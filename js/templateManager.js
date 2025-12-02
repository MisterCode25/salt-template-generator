/* TEMPLATEMANAGER.JS
   Template handling: load, create, prepare
*/

import { loadJSON, saveJSON } from "./storage.js";
import { ensureTokensFromTexts } from "./tokenManager.js";

let variantState = [];
let activeVariantId = null;

function setupAutosizeTextareas(root = document) {
    const autosize = root.querySelectorAll("textarea[data-autosize]");
    autosize.forEach(el => {
        const min = parseInt(getComputedStyle(el).minHeight || "0", 10) || 0;
        const resize = () => {
            el.style.height = "auto";
            el.style.height = Math.max(min, el.scrollHeight) + "px";
        };
        el.addEventListener("input", resize);
        resize();
    });
}

function setActiveVariant(id) {
    activeVariantId = id;
    const tabs = document.querySelectorAll(".variant-tab");
    const panels = document.querySelectorAll(".variant-panel");

    tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.variantId === id);
    });

    panels.forEach(panel => {
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
    const tabContainer = document.getElementById("variantTabs");
    const panelContainer = document.getElementById("variantPanels");
    if (!tabContainer || !panelContainer) return;

    tabContainer.innerHTML = "";
    panelContainer.innerHTML = "";

    if (variantState.length === 0) {
        panelContainer.innerHTML = `<div class="variant-empty">Aucune variante. Ajoutez-en une pour créer des versions alternatives.</div>`;
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
                    <input type="text" data-variant-name value="${variant.name || ""}" placeholder="Ex: Client injoignable">
                </div>
                <button class="secondary-btn variant-delete-btn" data-remove-variant>Supprimer</button>
            </div>
            <div class="lang-grid">
                <div class="lang-block">
                    <div class="lang-header">
                        <h3>Français</h3>
                        <span class="lang-badge">FR</span>
                    </div>
                    <textarea data-lang="fr" data-autosize placeholder="Bonjour {customer_name}, ...">${variant.text_fr || ""}</textarea>
                </div>
                <div class="lang-block">
                    <div class="lang-header">
                        <h3>English</h3>
                        <span class="lang-badge">EN</span>
                    </div>
                    <textarea data-lang="en" data-autosize placeholder="Hi {customer_name}, ...">${variant.text_en || ""}</textarea>
                </div>
                <div class="lang-block">
                    <div class="lang-header">
                        <h3>Deutsch</h3>
                        <span class="lang-badge">DE</span>
                    </div>
                    <textarea data-lang="de" data-autosize placeholder="Hallo {customer_name}, ...">${variant.text_de || ""}</textarea>
                </div>
                <div class="lang-block">
                    <div class="lang-header">
                        <h3>Italiano</h3>
                        <span class="lang-badge">IT</span>
                    </div>
                    <textarea data-lang="it" data-autosize placeholder="Ciao {customer_name}, ...">${variant.text_it || ""}</textarea>
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
                const langKey = "text_" + area.dataset.lang;
                variant[langKey] = area.value;
            });
        });

        panelContainer.appendChild(panel);
        setupAutosizeTextareas(panel);
    });

    if (!activeVariantId && variantState[0]) {
        setActiveVariant(variantState[0].id);
    } else {
        setActiveVariant(activeVariantId);
    }
}

function initVariantUI() {
    variantState = [];
    activeVariantId = null;
    const addBtn = document.getElementById("addVariantBtn");
    if (addBtn) {
        addBtn.addEventListener("click", () => addVariant());
    }
    renderVariantUI();
}

function getVariantsSnapshot() {
    return variantState.map(v => ({
        id: v.id,
        name: v.name ? v.name.trim() : "",
        text_fr: v.text_fr || "",
        text_en: v.text_en || "",
        text_de: v.text_de || "",
        text_it: v.text_it || ""
    }));
}

/* Load all templates */
export async function loadTemplates() {
    const templates = await loadJSON("models") || [];

    const normalized = templates.map(t => ({
        ...t,
        variants: Array.isArray(t.variants)
            ? t.variants.map(v => ({
                id: v.id || crypto.randomUUID(),
                name: v.name || "",
                text_fr: v.text_fr || "",
                text_en: v.text_en || "",
                text_de: v.text_de || "",
                text_it: v.text_it || ""
            }))
            : []
    }));

    return {
        email: normalized.filter(t => t.type === "email"),
        sms: normalized.filter(t => t.type === "sms"),
        other: normalized.filter(t => t.type === "other")
    };
}

/* Build a TemplateModel ready to be saved */
export function buildTemplateModel() {

    const title = document.getElementById("model-title").value.trim();
    const type = document.getElementById("model-type").value;
    const order = Number(document.getElementById("model-order").value);

    const text_fr = document.getElementById("text-fr").value;
    const text_en = document.getElementById("text-en").value;
    const text_de = document.getElementById("text-de").value;
    const text_it = document.getElementById("text-it").value;
    const variants = getVariantsSnapshot();

    if (title === "") {
        alert("Veuillez saisir un titre.");
        return null;
    }

    return {
        id: crypto.randomUUID(),
        title,
        type,
        order,
        text_fr,
        text_en,
        text_de,
        text_it,
        variants
    };
}

/* Save a template in localStorage */
export async function saveTemplate(model) {
    if (!model) return;

    const list = await loadJSON("models") || [];
    list.push(model);

    await saveJSON("models", list);
    await ensureTokensFromTexts([
        model.text_fr,
        model.text_en,
        model.text_de,
        model.text_it,
        ...model.variants.flatMap(v => [v.text_fr, v.text_en, v.text_de, v.text_it])
    ]);

    alert("Modèle enregistré (simulation).");
}

/* Init on add-template.html */
export async function initAddTemplatePage() {
    /* Save button */
    const saveBtn = document.getElementById("save-template");
    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            const model = buildTemplateModel();
            await saveTemplate(model);
        });
    }

    initVariantUI();
    setupAutosizeTextareas();
}

/* Auto-init: if on add-template.html */
document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("save-template");
    if (saveBtn) {
        initAddTemplatePage();
    }
});
