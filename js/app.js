/* APP.JS
   Point d’entrée principal de l’application
*/

import { renderTokens } from "./tokenManager.js";
import { renderDynamicInputs, renderModelsGrid } from "./uiManager.js";
import { collectInputValues, generateFinalText } from "./tokenEngine.js";
import { copyToClipboard, showToast } from "./clipboard.js";
import { loadTemplates } from "./templateManager.js";

/* Détecte quelle page est ouverte */
document.addEventListener("DOMContentLoaded", async () => {

    const path = window.location.pathname;

    /* Page : manage-tokens */
    if (path.includes("manage-tokens.html")) {
        renderTokens();
    }

    /* Page : index.html */
    if (path.includes("index.html")) {
        console.log("Page principale chargée.");
        renderDynamicInputs();
        renderModelsGrid();
        setupHelpModal();

        /* Display active configuration name */
        const badge = document.getElementById("configBadge");
        if (badge) {
            const name = localStorage.getItem("local_configName") || "Aucune configuration";
            badge.textContent = name;
        }

        /* Gestion du segmented control – LANGUE uniquement */
        let currentLang = "fr";

        /* Click langue */
        document.querySelectorAll(".segment[data-lang]").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".segment[data-lang]").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentLang = btn.getAttribute("data-lang");
            });
        });

        /* Gestion du clic sur un modèle (index.html) */
        document.body.addEventListener("click", async (e) => {
            const btn = e.target.closest("button[data-model-id]");
            if (!btn) return;

            const modelId = btn.getAttribute("data-model-id");
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
                showToast("Information manquante", "error");
                return;
            }
            const generated = generateFinalText(model, currentLang, values);

            copyToClipboard(generated);
        });
    }

    /* Page : add-template.html */
    if (path.includes("add-template.html")) {
        console.log("Page création modèle chargée.");
        // On ajoutera la logique templateManager ici
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
            let configName = prompt("Nom de la configuration :", localStorage.getItem("local_configName") || "MaConfiguration");
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

    /* Import Configuration button */
    const importBtn = document.getElementById("importConfigBtn");
    if (importBtn) {
        importBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".templageConfig,.json";

            input.addEventListener("change", async () => {
                const file = input.files[0];
                if (!file) return;

                const text = await file.text();
                let config;
                try {
                    config = JSON.parse(text);
                } catch (e) {
                    alert("Invalid configuration file.");
                    return;
                }

                /* Clear and apply imported configuration */
                localStorage.clear();

                if (config.tokens) {
                    localStorage.setItem("local_tokens", JSON.stringify(config.tokens));
                }
                if (config.models) {
                    localStorage.setItem("local_models", JSON.stringify(config.models));
                }
                if (config.configName) {
                    localStorage.setItem("local_configName", config.configName);
                }

                alert("Configuration imported successfully.");
                location.reload();
            });

            input.click();
        });
    }

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
            });
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
    const modal = document.getElementById("helpModal");
    const closeBtn = document.getElementById("closeHelp");

    if (!btn || !modal || !closeBtn) return;

    const open = () => {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
    };
    const close = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    };

    btn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}
