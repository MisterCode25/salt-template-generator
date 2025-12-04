/* APP.JS
   Main entry point
*/

import { renderTokens, loadTokens } from "./tokenManager.js";
import { renderDynamicInputs, renderModelsGrid } from "./uiManager.js";
import { collectInputValues, generateFinalText } from "./tokenEngine.js";
import { copyToClipboard, showToast } from "./clipboard.js";
import { loadTemplates } from "./templateManager.js";

/* Track input activity per section */
const lastSectionClickVersion = {};
let inputChangeVersion = 0;

/* Detect which page is open */
document.addEventListener("DOMContentLoaded", async () => {

    const path = window.location.pathname;
    const isMain =
        path.endsWith("/") ||
        path.endsWith("/index.html") ||
        path.includes("index.html");

    /* Page : manage-tokens */
    if (path.includes("manage-tokens.html")) {
        renderTokens();
    }

    /* Page : index.html */
    if (isMain) {
        console.log("Main page loaded.");
        await renderDynamicInputs();
        await renderModelsGrid();
        await checkEmptyState();
        setTimeout(checkEmptyState, 0); // re-evaluate once DOM paints
        initEmptyStateWatcher();
        setupHelpModal();
        setupQuickCreate();

        /* Display active configuration name */
        const badge = document.getElementById("configBadge");
        if (badge) {
            const name = localStorage.getItem("local_configName") || "No configuration";
            badge.textContent = name;
        }

        /* Language segmented control */
        let currentLang = "fr";

        /* Language click */
        document.querySelectorAll(".segment[data-lang]").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".segment[data-lang]").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentLang = btn.getAttribute("data-lang");
            });
        });

        /* Track edits on token inputs */
        const handleInputChange = (e) => {
            const target = e.target.closest("[data-token]");
            if (!target) return;
            inputChangeVersion++;
            target.classList.remove("input-warning");
        };
        document.body.addEventListener("input", handleInputChange);
        document.body.addEventListener("change", handleInputChange);

        /* Handle model click (index.html) */
        document.body.addEventListener("click", async (e) => {
            const btn = e.target.closest("button[data-model-id]");
            if (!btn) return;

            const modelId = btn.getAttribute("data-model-id");
            const section = btn.getAttribute("data-section") || "unknown";
            const tokenDefs = await loadTokens();
            const groups = await loadTemplates();
            const allTemplates = [
                ...groups.email,
                ...groups.sms,
                ...groups.other
            ];

            const model = allTemplates.find(t => t.id === modelId);
            if (!model) return;

            const baseText = (() => {
                switch (currentLang) {
                    case "fr": return model.text_fr || "";
                    case "en": return model.text_en || "";
                    case "de": return model.text_de || "";
                    case "it": return model.text_it || "";
                    default: return model.text_fr || "";
                }
            })();

            const neededTokens = Array.from(new Set(baseText.match(/\{[^{}]+\}/g) || []));

            const { values, missing } = await collectInputValues(neededTokens);
            if (missing.length > 0) {
                showToast("Missing information", "error");
                return;
            }
            const nonDefaultTokens = neededTokens.filter(token => {
                const def = tokenDefs.find(t => t.token === token);
                if (!def || def.default === undefined) return true;
                return values[token] !== def.default;
            });

            const warnSameSection = lastSectionClickVersion[section] !== undefined
                && lastSectionClickVersion[section] === inputChangeVersion
                && nonDefaultTokens.length > 0;

            if (warnSameSection) {
                highlightInputs(nonDefaultTokens);
            }

            const generated = generateFinalText(model, currentLang, values);

            copyToClipboard(generated, warnSameSection ? {
                message: "Copié (aucun champ modifié depuis cette section).",
                variant: "warning"
            } : undefined);

            lastSectionClickVersion[section] = inputChangeVersion;
        });
    }

    /* Page : add-template.html */
    if (path.includes("add-template.html")) {
        console.log("Add-template page loaded.");
    }

    /* Reset Local Storage button */
    const resetBtn = document.getElementById("resetLocalStorageBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("Reset all stored data?")) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    /* Export Configuration button */
    const exportBtn = document.getElementById("exportConfigBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
            let configName = prompt("Configuration name:", localStorage.getItem("local_configName") || "MyConfiguration");
            if (!configName) return;

            localStorage.setItem("local_configName", configName);

            const config = {
                configName: configName,
                tokens: JSON.parse(localStorage.getItem("local_tokens") || "[]"),
                models: JSON.parse(localStorage.getItem("local_models") || "[]"),
                timestamp: Date.now()
            };

            const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = configName + ".templageConfig";
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    /* Rename Configuration button */
    const renameBtn = document.getElementById("renameConfigBtn");
    if (renameBtn) {
        renameBtn.addEventListener("click", () => {
            const current = localStorage.getItem("local_configName") || "MyConfiguration";
            const next = prompt("Configuration name:", current);
            if (!next) return;
            localStorage.setItem("local_configName", next);
            const badge = document.getElementById("configBadge");
            if (badge) badge.textContent = next;
            showToast("Configuration name updated");
        });
    }

    /* Import Configuration button */
    const importBtn = document.getElementById("importConfigBtn");
    const emptyImportBtn = document.getElementById("emptyImportBtn");
    const wireImport = (btn) => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".templageConfig,.json";

            input.addEventListener("change", async () => {
                const file = input.files[0];
                if (!file) return;

                try {
                    const text = await file.text();
                    const config = JSON.parse(text);
                    await applyImportedConfig(config);
                    showToast("Configuration imported successfully.");
                } catch (e) {
                    console.error("Import failed:", e);
                    showToast("Invalid configuration file.", "error");
                    return;
                }
                finally {
                    input.value = "";
                }
            });

            input.click();
        });
    };

    wireImport(importBtn);
    wireImport(emptyImportBtn);

    /* Reset Data Fields button */
    const resetFieldsBtn = document.getElementById("resetFieldsBtn");
    if (resetFieldsBtn) {
        resetFieldsBtn.addEventListener("click", () => {
            const container = document.getElementById("dynamic-inputs");
            if (!container) return;

            const fields = container.querySelectorAll("input, textarea, select");

            fields.forEach(field => {
                if (field.type === "checkbox" || field.type === "radio") {
                    field.checked = false;
                } else {
                    field.value = "";
                }
                field.classList.remove("input-warning");
            });
            inputChangeVersion++;
            /* Re-apply default values from tokens */
            import("./tokenManager.js").then(module => {
                module.loadTokens().then(tokens => {
                    tokens.forEach(t => {
                        if (!t.default) return;
                        const field = container.querySelector(`[data-token="${t.token}"]`);
                        if (field && field.value.trim() === "") {
                            field.value = t.default;
                        }
                    });
                });
            });
        });
    }
});

function setupHelpModal() {
    const btn = document.getElementById("helpBtn");
    const triggers = document.querySelectorAll("[data-open-help]");
    const modal = document.getElementById("helpModal");
    const closeBtn = document.getElementById("closeHelp");

    if (!modal || !closeBtn || (!btn && triggers.length === 0)) return;

    const open = () => {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
    };
    const close = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    };

    if (btn) btn.addEventListener("click", open);
    triggers.forEach(t => t.addEventListener("click", open));
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}

async function checkEmptyState() {
    const empty = document.getElementById("emptyState");
    const grid = document.getElementById("zones-grid");
    if (!empty || !grid) return;

    const groups = await loadTemplates();
    const tokens = await loadTokens();
    const storageTemplateCount = groups.email.length + groups.sms.length + groups.other.length;
    const storageTokenCount = tokens.length;
    const hasTemplates = storageTemplateCount > 0;
    const hasTokens = storageTokenCount > 0;
    const isEmpty = !hasTemplates && !hasTokens;

    const sections = [
        document.getElementById("zone-left"),
        document.getElementById("email-col"),
        document.getElementById("sms-col"),
        document.getElementById("other-col")
    ].filter(Boolean);

    if (isEmpty) {
        empty.hidden = false;
        grid.classList.add("zones-grid--empty");
        sections.forEach(s => s.setAttribute("hidden", "true"));
    } else {
        empty.hidden = true;
        grid.classList.remove("zones-grid--empty");
        sections.forEach(s => s.removeAttribute("hidden"));
    }
}

function setupQuickCreate() {
    const btn = document.getElementById("quickCreateTemplate");
    if (!btn) return;
    btn.addEventListener("click", () => {
        import("./manageModels.js").then(mod => {
            if (mod.openModelEditor) {
                mod.openModelEditor(null, {
                    onSave: () => location.reload()
                });
            }
        });
    });
}

function initEmptyStateWatcher() {
    const targets = [
        document.getElementById("email-container"),
        document.getElementById("sms-container"),
        document.getElementById("other-container"),
        document.getElementById("dynamic-inputs")
    ].filter(Boolean);

    if (targets.length === 0) return;

    const observer = new MutationObserver(() => {
        checkEmptyState();
    });

    targets.forEach(t => observer.observe(t, { childList: true, subtree: true }));
}

async function applyImportedConfig(config = {}) {
    const safeTokens = Array.isArray(config.tokens) ? config.tokens : [];
    const safeModels = Array.isArray(config.models) ? config.models : [];
    const configName = config.configName || "Imported configuration";

    localStorage.clear();
    localStorage.setItem("local_tokens", JSON.stringify(safeTokens));
    localStorage.setItem("local_models", JSON.stringify(safeModels));
    localStorage.setItem("local_configName", configName);

    // Refresh UI and force a reload to ensure consistency
    await renderDynamicInputs();
    await renderModelsGrid();
    await checkEmptyState();
    const badge = document.getElementById("configBadge");
    if (badge) badge.textContent = configName;
    setTimeout(() => location.reload(), 50);
}

function highlightInputs(tokens = []) {
    const uniqueTokens = Array.from(new Set(tokens));
    uniqueTokens.forEach(token => {
        const field = document.querySelector(`[data-token="${token}"]`);
        if (!field) return;
        field.classList.remove("input-error");
        field.classList.add("input-warning");
    });
}
