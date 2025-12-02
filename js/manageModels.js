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
    let activeVariantId = variantState[0] ? variantState[0].id : null;

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
                    <div class="lang-columns">
                        <div class="lang-col">
                            <div class="lang-head">
                                <span class="lang-dot">FR</span>
                                <span class="lang-label">French</span>
                            </div>
                            <textarea id="mFr" class="plain-editor tall-textarea">${isEdit ? model.text_fr : ""}</textarea>
                        </div>
                        <div class="lang-col">
                            <div class="lang-head">
                                <span class="lang-dot">EN</span>
                                <span class="lang-label">English</span>
                            </div>
                            <textarea id="mEn" class="plain-editor tall-textarea">${isEdit ? model.text_en : ""}</textarea>
                        </div>
                        <div class="lang-col">
                            <div class="lang-head">
                                <span class="lang-dot">DE</span>
                                <span class="lang-label">German</span>
                            </div>
                            <textarea id="mDe" class="plain-editor tall-textarea">${isEdit ? model.text_de : ""}</textarea>
                        </div>
                        <div class="lang-col">
                            <div class="lang-head">
                                <span class="lang-dot">IT</span>
                                <span class="lang-label">Italian</span>
                            </div>
                            <textarea id="mIt" class="plain-editor tall-textarea">${isEdit ? model.text_it : ""}</textarea>
                        </div>
                    </div>
                </div>

                <div class="popup-card">
                    <div class="variant-editor-head">
                        <div>
                            <p class="eyebrow">Variantes</p>
                            <h3>Versions alternatives</h3>
                            <p class="hint">Si vous ajoutez des variantes, un choix sera proposé lors du clic sur le template dans la page principale.</p>
                        </div>
                        <button class="secondary-btn" id="addVariantBtn">+ Ajouter une variante</button>
                    </div>
                    <div id="variantTabs" class="variant-tabs"></div>
                    <div id="variantPanels" class="variant-panels"></div>
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
    const panelContainer = popup.querySelector("#variantPanels");
    const addVariantBtn = popup.querySelector("#addVariantBtn");

    function setActiveVariant(id) {
        activeVariantId = id;
        popup.querySelectorAll(".variant-tab").forEach(tab => {
            tab.classList.toggle("active", tab.dataset.variantId === id);
        });
        popup.querySelectorAll(".variant-panel").forEach(panel => {
            panel.classList.toggle("active", panel.dataset.variantId === id);
        });
    }

    function removeVariant(id) {
        variantState = variantState.filter(v => v.id !== id);
        if (activeVariantId === id) {
            activeVariantId = variantState[0] ? variantState[0].id : null;
        }
        renderVariantUI();
    }

    function addVariant(data = {}) {
        const variant = {
            id: data.id || crypto.randomUUID(),
            name: data.name || `Variante ${variantState.length + 1}`,
            text_fr: data.text_fr || "",
            text_en: data.text_en || "",
            text_de: data.text_de || "",
            text_it: data.text_it || ""
        };
        variantState.push(variant);
        activeVariantId = variant.id;
        renderVariantUI();
    }

    function renderVariantUI() {
        if (!tabContainer || !panelContainer) return;

        tabContainer.innerHTML = "";
        panelContainer.innerHTML = "";

        if (variantState.length === 0) {
            panelContainer.innerHTML = `<div class="variant-empty">Aucune variante. Ajoutez-en une pour proposer plusieurs déclinaisons.</div>`;
            return;
        }

        variantState.forEach((variant, idx) => {
            const tab = document.createElement("button");
            tab.className = "variant-tab" + (variant.id === activeVariantId ? " active" : "");
            tab.dataset.variantId = variant.id;
            tab.textContent = variant.name || `Variante ${idx + 1}`;
            tab.addEventListener("click", () => setActiveVariant(variant.id));
            tabContainer.appendChild(tab);

            const panel = document.createElement("div");
            panel.className = "variant-panel" + (variant.id === activeVariantId ? " active" : "");
            panel.dataset.variantId = variant.id;
            panel.innerHTML = `
                <div class="variant-panel-header">
                    <div class="variant-name-field">
                        <label>Nom de la variante</label>
                        <input type="text" data-variant-name value="${variant.name || ""}" placeholder="Nom de variante">
                    </div>
                    <button class="secondary-btn variant-delete-btn" data-remove-variant>Supprimer</button>
                </div>
                <div class="variant-lang-grid">
                    <div class="variant-lang">
                        <div class="lang-head">
                            <span class="lang-dot">FR</span>
                            <span class="lang-label">French</span>
                        </div>
                        <textarea class="plain-editor tall-textarea" data-lang="fr" placeholder="Texte FR">${variant.text_fr || ""}</textarea>
                    </div>
                    <div class="variant-lang">
                        <div class="lang-head">
                            <span class="lang-dot">EN</span>
                            <span class="lang-label">English</span>
                        </div>
                        <textarea class="plain-editor tall-textarea" data-lang="en" placeholder="Text EN">${variant.text_en || ""}</textarea>
                    </div>
                    <div class="variant-lang">
                        <div class="lang-head">
                            <span class="lang-dot">DE</span>
                            <span class="lang-label">German</span>
                        </div>
                        <textarea class="plain-editor tall-textarea" data-lang="de" placeholder="Text DE">${variant.text_de || ""}</textarea>
                    </div>
                    <div class="variant-lang">
                        <div class="lang-head">
                            <span class="lang-dot">IT</span>
                            <span class="lang-label">Italian</span>
                        </div>
                        <textarea class="plain-editor tall-textarea" data-lang="it" placeholder="Text IT">${variant.text_it || ""}</textarea>
                    </div>
                </div>
            `;

            const nameInput = panel.querySelector("[data-variant-name]");
            nameInput.addEventListener("input", (e) => {
                variant.name = e.target.value;
                tab.textContent = variant.name || `Variante ${idx + 1}`;
            });

            const removeBtn = panel.querySelector("[data-remove-variant]");
            removeBtn.addEventListener("click", () => removeVariant(variant.id));

            panel.querySelectorAll("textarea[data-lang]").forEach(area => {
                area.addEventListener("input", () => {
                    const key = "text_" + area.dataset.lang;
                    variant[key] = area.value;
                });
            });

            panelContainer.appendChild(panel);
        });

        if (!activeVariantId && variantState[0]) {
            setActiveVariant(variantState[0].id);
        } else {
            setActiveVariant(activeVariantId);
        }
    }

    if (addVariantBtn) {
        addVariantBtn.addEventListener("click", () => addVariant());
    }
    renderVariantUI();

    document.getElementById("closePopup").addEventListener("click", () => popup.remove());

    document.getElementById("saveModel").addEventListener("click", async () => {
        const title = document.getElementById("mTitle").value.trim();
        const type = document.getElementById("mType").value;
        const text_fr = document.getElementById("mFr").value.trim();
        const text_en = document.getElementById("mEn").value.trim();
        const text_de = document.getElementById("mDe").value.trim();
        const text_it = document.getElementById("mIt").value.trim();
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
