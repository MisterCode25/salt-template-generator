import { loadJSON, saveJSON } from "./storage.js";
import { ensureTokensFromTexts } from "./tokenManager.js";

/* --- STATE --- */
let currentType = "email"; // email or sms
let templates = [];

function normalizeModel(model = {}) {
    return {
        ...model,
        variants: Array.isArray(model.variants)
            ? model.variants.map(v => ({
                id: v.id || crypto.randomUUID(),
                name: v.name || "",
                text_fr: v.text_fr || "",
                text_en: v.text_en || "",
                text_de: v.text_de || "",
                text_it: v.text_it || ""
            }))
            : []
    };
}

function deriveLangLabel(textarea) {
    const host = textarea.closest(".lang-col, .variant-lang");
    const label = host?.querySelector(".lang-label");
    if (label && label.textContent.trim()) return label.textContent.trim();
    const dot = host?.querySelector(".lang-dot");
    if (dot && dot.textContent.trim()) return dot.textContent.trim();
    if (textarea.dataset.lang) return textarea.dataset.lang.toUpperCase();
    return "Texte";
}

function createLangFullscreenController(host) {
    let activeTarget = null;
    let sequence = [];
    let sequenceIndex = -1;

    const overlay = document.createElement("div");
    overlay.className = "lang-fullscreen";
    overlay.innerHTML = `
            <button type="button" class="lang-fullscreen__nav lang-fullscreen__nav--prev" data-nav="prev" aria-label="Langue précédente">←</button>
            <div class="lang-fullscreen__card">
                <div class="lang-fullscreen__head">
                    <div>
                        <p class="eyebrow">Edition plein écran</p>
                        <h3 class="lang-fullscreen__title">Texte</h3>
                    </div>
                    <span class="lang-fullscreen__badge">TXT</span>
                </div>
                <textarea class="lang-fullscreen__textarea"></textarea>
                <div class="lang-fullscreen__actions">
                    <button type="button" class="primary-btn" data-close-fullscreen>Terminer</button>
                </div>
            </div>
            <button type="button" class="lang-fullscreen__nav lang-fullscreen__nav--next" data-nav="next" aria-label="Langue suivante">→</button>
        `;

    const titleEl = overlay.querySelector(".lang-fullscreen__title");
    const badgeEl = overlay.querySelector(".lang-fullscreen__badge");
    const fullscreenArea = overlay.querySelector(".lang-fullscreen__textarea");
    const closeBtn = overlay.querySelector("[data-close-fullscreen]");
    const navPrev = overlay.querySelector("[data-nav='prev']");
    const navNext = overlay.querySelector("[data-nav='next']");

    const persistActiveValue = () => {
        if (!activeTarget) return;
        activeTarget.value = fullscreenArea.value;
        activeTarget.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const updateNavState = () => {
        const disabled = sequence.length <= 1 || sequenceIndex === -1;
        navPrev.disabled = disabled;
        navNext.disabled = disabled;
    };

    const buildSequence = (target) => {
        const container = target.closest(".lang-columns, .variant-lang-grid");
        const scope = container || host;
        sequence = Array.from(scope.querySelectorAll("textarea.plain-editor"));
        sequenceIndex = sequence.indexOf(target);
        updateNavState();
    };

    const applyContent = (target, { focus = true } = {}) => {
        if (!target) return;
        activeTarget = target;
        fullscreenArea.value = target.value;
        const label = deriveLangLabel(target);
        titleEl.textContent = label;
        const badgeText = target.closest(".lang-col, .variant-lang")?.querySelector(".lang-dot")?.textContent?.trim()
            || target.dataset.lang?.toUpperCase()
            || label?.slice(0, 2).toUpperCase()
            || "TXT";
        badgeEl.textContent = badgeText;
        buildSequence(target);

        if (!overlay.isConnected) {
            host.appendChild(overlay);
        }
        host.classList.add("has-lang-fullscreen");
        if (focus) {
            fullscreenArea.focus();
            fullscreenArea.setSelectionRange(fullscreenArea.value.length, fullscreenArea.value.length);
        }
    };

    const navigate = (delta) => {
        if (sequence.length <= 1 || sequenceIndex === -1) return;
        persistActiveValue();
        sequenceIndex = (sequenceIndex + delta + sequence.length) % sequence.length;
        const nextTarget = sequence[sequenceIndex];
        applyContent(nextTarget);
    };

    const close = () => {
        if (!activeTarget) return;
        const targetToFocus = activeTarget;
        persistActiveValue();
        if (overlay.parentNode === host) {
            host.removeChild(overlay);
        }
        host.classList.remove("has-lang-fullscreen");
        targetToFocus.focus();
        activeTarget = null;
        sequence = [];
        sequenceIndex = -1;
    };

    closeBtn.addEventListener("click", close);
    fullscreenArea.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            close();
        }
    });

    navPrev.addEventListener("click", () => navigate(-1));
    navNext.addEventListener("click", () => navigate(1));

    return function open(target) {
        if (activeTarget && activeTarget !== target) {
            persistActiveValue();
        }
        applyContent(target);
    };
}

/* --- SEGMENTED CONTROL --- */
function setupSegments() {
    document.querySelectorAll(".segment[data-type]").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".segment[data-type]").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentType = btn.getAttribute("data-type");
            renderModelsList();
        });
    });
}

/* --- RENDER MODELS --- */
function renderModelsList() {
    const container = document.getElementById("models-list");
    container.innerHTML = "";

    const list = templates
        .filter(t => t.type === currentType)
        .sort((a, b) => a.order - b.order);

    if (list.length === 0) {
        container.innerHTML = "<p>No template for this type.</p>";
        return;
    }

    list.forEach(model => {
        const row = document.createElement("div");
        row.className = "model-row";

        const infoBox = document.createElement("div");
        infoBox.style.display = "flex";
        infoBox.style.alignItems = "center";
        infoBox.style.gap = "10px";

        const title = document.createElement("span");
        title.textContent = model.title;
        infoBox.appendChild(title);

        if (model.variants && model.variants.length > 0) {
            const variantPill = document.createElement("span");
            variantPill.className = "variant-pill";
            variantPill.textContent = `${model.variants.length} variante${model.variants.length > 1 ? "s" : ""}`;
            infoBox.appendChild(variantPill);
        }

        const editBtn = document.createElement("button");
        editBtn.className = "icon-btn edit-btn";
        editBtn.innerHTML = `<span class="icon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span>`;
        editBtn.addEventListener("click", () => openModelEditor(model));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "icon-btn delete-btn";
        deleteBtn.innerHTML = `<span class="icon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span>`;
        deleteBtn.addEventListener("click", () => deleteModel(model.id));

        row.appendChild(infoBox);

        const btnBox = document.createElement("div");
        btnBox.style.display = "flex";
        btnBox.style.gap = "8px";
        btnBox.style.marginLeft = "auto";

        btnBox.appendChild(editBtn);
        btnBox.appendChild(deleteBtn);

        row.appendChild(btnBox);

        container.appendChild(row);
    });
}

/* --- DELETE MODEL --- */
async function deleteModel(id) {
    if (!confirm("Delete this template?")) return;

    templates = templates.filter(t => t.id !== id);
    await saveJSON("models", templates);
    renderModelsList();
}

/* --- EDITOR POPUP --- */
export function openModelEditor(model = null, opts = {}) {
    const isEdit = model !== null;
    let variantState = (isEdit && Array.isArray(model.variants))
        ? model.variants.map(v => ({
            id: v.id || crypto.randomUUID(),
            name: v.name || "",
            text_fr: v.text_fr || "",
            text_en: v.text_en || "",
            text_de: v.text_de || "",
            text_it: v.text_it || ""
        }))
        : [];

    const popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
        <div class="popup-box popup-box--wide">
            <div class="popup-header">
                <div>
                    <p class="eyebrow">Template</p>
                    <h2>${isEdit ? "Edit template" : "New template"}</h2>
                </div>
                <div class="pill">${isEdit ? "Existing" : "Draft"}</div>
            </div>

            <div class="popup-grid">
                <div class="popup-card">
                    <div class="field-line">
                        <label>Title</label>
                        <input id="mTitle" type="text" value="${isEdit ? model.title : ""}">
                    </div>
                    <div class="field-line">
                        <label>Type</label>
                        <select id="mType">
                            <option value="email" ${isEdit && model.type === "email" ? "selected" : ""}>Email</option>
                            <option value="sms" ${isEdit && model.type === "sms" ? "selected" : ""}>SMS</option>
                            <option value="other" ${isEdit && model.type === "other" ? "selected" : ""}>Other</option>
                        </select>
                    </div>
                </div>

                <div class="popup-card popup-card--langs">
                    <div class="variant-tab-bar">
                        <div id="variantTabs" class="variant-tabs"></div>
                        <button class="icon-btn add-variant-tab" id="addVariantTab" aria-label="Ajouter une variante">+</button>
                    </div>
                    <div class="variant-name-bar">
                        <div class="variant-name-label">Nom de la variante</div>
                        <div class="variant-name-wrapper">
                            <input type="text" id="variantNameInput" placeholder="Nom de variante">
                            <span id="variantNameStatic" class="variant-name-static">Texte principal</span>
                        </div>
                        <button type="button" class="icon-btn variant-remove-icon" id="removeVariantBtn" aria-label="Supprimer la variante">
                            <span class="icon-trash" aria-hidden="true"></span>
                        </button>
                    </div>
                    <div id="variantLangColumns" class="lang-columns"></div>
                </div>
            </div>

            <div class="popup-actions">
                <button id="closePopup" class="secondary-btn">Cancel</button>
                <button id="saveModel" class="primary-btn">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const tabContainer = popup.querySelector("#variantTabs");
    const addVariantTab = popup.querySelector("#addVariantTab");
    const variantNameInput = popup.querySelector("#variantNameInput");
    const variantNameStatic = popup.querySelector("#variantNameStatic");
    const langColumnsHost = popup.querySelector("#variantLangColumns");
    const removeVariantBtn = popup.querySelector("#removeVariantBtn");

    const openFullscreenEditor = createLangFullscreenController(popup);
    const panels = {};
    let activeTabId = "main";

    const bindFullscreen = (area) => {
        if (!area || area.dataset.fullscreenBound === "true") return;
        area.dataset.fullscreenBound = "true";
        area.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openFullscreenEditor(area);
        });
    };

    const variantLabel = (variant, idx) => variant.name?.trim() || `Variante ${idx}`;

    const createLangPanel = (values = {}, { isMain = false, variantRef = null } = {}) => {
        const panel = document.createElement("div");
        panel.className = "lang-columns lang-columns-panel";
        panel.innerHTML = `
            <div class="lang-col">
                <div class="lang-head">
                    <span class="lang-dot">FR</span>
                    <span class="lang-label">French</span>
                </div>
                <textarea ${isMain ? 'id="mFr"' : ""} class="plain-editor tall-textarea" data-lang="fr" placeholder="Texte FR">${values.text_fr || ""}</textarea>
            </div>
            <div class="lang-col">
                <div class="lang-head">
                    <span class="lang-dot">EN</span>
                    <span class="lang-label">English</span>
                </div>
                <textarea ${isMain ? 'id="mEn"' : ""} class="plain-editor tall-textarea" data-lang="en" placeholder="Text EN">${values.text_en || ""}</textarea>
            </div>
            <div class="lang-col">
                <div class="lang-head">
                    <span class="lang-dot">DE</span>
                    <span class="lang-label">German</span>
                </div>
                <textarea ${isMain ? 'id="mDe"' : ""} class="plain-editor tall-textarea" data-lang="de" placeholder="Text DE">${values.text_de || ""}</textarea>
            </div>
            <div class="lang-col">
                <div class="lang-head">
                    <span class="lang-dot">IT</span>
                    <span class="lang-label">Italian</span>
                </div>
                <textarea ${isMain ? 'id="mIt"' : ""} class="plain-editor tall-textarea" data-lang="it" placeholder="Text IT">${values.text_it || ""}</textarea>
            </div>
        `;

        panel.querySelectorAll("textarea[data-lang]").forEach(area => {
            bindFullscreen(area);
            if (!isMain && variantRef) {
                area.addEventListener("input", () => {
                    const key = "text_" + area.dataset.lang;
                    variantRef[key] = area.value;
                });
            }
        });

        return panel;
    };

    panels.main = createLangPanel({
        text_fr: isEdit ? model.text_fr : "",
        text_en: isEdit ? model.text_en : "",
        text_de: isEdit ? model.text_de : "",
        text_it: isEdit ? model.text_it : ""
    }, { isMain: true });

    variantState.forEach(v => {
        panels[v.id] = createLangPanel(v, { variantRef: v });
    });

    const baseTextAreas = {
        fr: panels.main.querySelector("#mFr"),
        en: panels.main.querySelector("#mEn"),
        de: panels.main.querySelector("#mDe"),
        it: panels.main.querySelector("#mIt")
    };

    Object.values(baseTextAreas).forEach(bindFullscreen);

    const showPanel = (panel) => {
        langColumnsHost.innerHTML = "";
        if (panel) {
            langColumnsHost.appendChild(panel);
        }
    };

    const setActiveTab = (id) => {
        const exists = id === "main" || variantState.some(v => v.id === id);
        activeTabId = exists ? id : "main";
        tabContainer.querySelectorAll("[data-tab-id]").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.tabId === activeTabId);
        });

        if (activeTabId === "main") {
            variantNameInput.classList.add("is-hidden");
            variantNameInput.value = "";
            if (variantNameStatic) {
                variantNameStatic.textContent = "Texte principal";
                variantNameStatic.classList.remove("is-hidden");
            }
            if (removeVariantBtn) {
                removeVariantBtn.classList.add("is-hidden");
                removeVariantBtn.disabled = true;
            }
            showPanel(panels.main);
        } else {
            const targetVariant = variantState.find(v => v.id === activeTabId);
            variantNameInput.classList.remove("is-hidden");
            variantNameInput.value = targetVariant?.name || "";
            if (variantNameStatic) {
                variantNameStatic.classList.add("is-hidden");
            }
            if (removeVariantBtn) {
                removeVariantBtn.classList.remove("is-hidden");
                removeVariantBtn.disabled = false;
            }
            showPanel(panels[activeTabId]);
        }
    };

    const renderTabs = () => {
        tabContainer.innerHTML = "";
        const mainTab = document.createElement("button");
        mainTab.className = "variant-tab";
        mainTab.dataset.tabId = "main";
        mainTab.textContent = "Texte principal";
        mainTab.addEventListener("click", () => setActiveTab("main"));
        tabContainer.appendChild(mainTab);

        variantState.forEach((variant, idx) => {
            const tab = document.createElement("button");
            tab.className = "variant-tab";
            tab.dataset.tabId = variant.id;
            tab.textContent = variantLabel(variant, idx + 1);
            tab.addEventListener("click", () => setActiveTab(variant.id));
            tabContainer.appendChild(tab);
        });

        setActiveTab(activeTabId || "main");
    };

    renderTabs();
    showPanel(panels.main);
    setActiveTab("main");

    variantNameInput.addEventListener("input", () => {
        if (activeTabId === "main") return;
        const targetVariant = variantState.find(v => v.id === activeTabId);
        if (!targetVariant) return;
        targetVariant.name = variantNameInput.value;
        const tab = tabContainer.querySelector(`[data-tab-id="${activeTabId}"]`);
        if (tab) {
            tab.textContent = variantLabel(targetVariant, variantState.indexOf(targetVariant) + 1);
        }
    });

    if (addVariantTab) {
        addVariantTab.addEventListener("click", () => {
            const variant = {
                id: crypto.randomUUID(),
                name: `Variante ${variantState.length + 1}`,
                text_fr: "",
                text_en: "",
                text_de: "",
                text_it: ""
            };
            variantState.push(variant);
            panels[variant.id] = createLangPanel(variant, { variantRef: variant });
            activeTabId = variant.id;
            renderTabs();
            setActiveTab(variant.id);
        });
    }

    if (removeVariantBtn) {
        removeVariantBtn.addEventListener("click", () => {
            if (activeTabId === "main") return;
            variantState = variantState.filter(v => v.id !== activeTabId);
            delete panels[activeTabId];
            activeTabId = "main";
            renderTabs();
            setActiveTab("main");
        });
    }

    document.getElementById("closePopup").addEventListener("click", () => popup.remove());

    document.getElementById("saveModel").addEventListener("click", async () => {
        const title = document.getElementById("mTitle").value.trim();
        const type = document.getElementById("mType").value;
        const text_fr = baseTextAreas.fr.value.trim();
        const text_en = baseTextAreas.en.value.trim();
        const text_de = baseTextAreas.de.value.trim();
        const text_it = baseTextAreas.it.value.trim();
        const cleanedVariants = variantState
            .map(v => ({
                ...v,
                name: v.name ? v.name.trim() : ""
            }))
            .filter(v =>
                v.name !== "" ||
                v.text_fr ||
                v.text_en ||
                v.text_de ||
                v.text_it
            );

        if (title === "") {
            alert("Title is required.");
            return;
        }

        if (isEdit) {
            // update
            model.title = title;
            model.type = type;
            model.text_fr = text_fr;
            model.text_en = text_en;
            model.text_de = text_de;
            model.text_it = text_it;
            model.variants = cleanedVariants;
        } else {
            // create new
            const newModel = {
                id: crypto.randomUUID(),
                title,
                type,
                order: templates.length + 1,
                text_fr,
                text_en,
                text_de,
                text_it,
                variants: cleanedVariants
            };
            templates.push(newModel);
        }

        await saveJSON("models", templates);
        await ensureTokensFromTexts([
            text_fr,
            text_en,
            text_de,
            text_it,
            ...cleanedVariants.flatMap(v => [v.text_fr, v.text_en, v.text_de, v.text_it])
        ]);
        popup.remove();
        if (typeof opts.onSave === "function") {
            opts.onSave();
        } else {
            renderModelsList();
        }
    });
}

/* --- INIT --- */
document.addEventListener("DOMContentLoaded", async () => {
    const listEl = document.getElementById("models-list");
    if (!listEl) return;

    templates = await loadJSON("models") || [];
    templates = templates.map(normalizeModel);
    setupSegments();
    renderModelsList();

    const addBtn = document.getElementById("addModelBtn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            openModelEditor();
        });
    }
});
