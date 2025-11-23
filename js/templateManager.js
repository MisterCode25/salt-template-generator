/* TEMPLATEMANAGER.JS
   Gestion des modèles : chargement, création, préparation
*/

import { loadJSON, saveJSON } from "./storage.js";

/* Charge tous les modèles */
export async function loadTemplates() {
    const templates = await loadJSON("../data/models.json") || [];

    return {
        email: templates.filter(t => t.type === "email"),
        sms: templates.filter(t => t.type === "sms"),
        other: templates.filter(t => t.type === "other")
    };
}

/* Charge les catégories */
export async function loadCategories() {
    return await loadJSON("../data/categories.json") || [];
}

/* Crée un objet TemplateModel prêt à être sauvegardé */
export function buildTemplateModel() {

    const title = document.getElementById("model-title").value.trim();
    const type = document.getElementById("model-type").value;
    const category = document.getElementById("model-category").value;
    const order = Number(document.getElementById("model-order").value);

    const text_fr = document.getElementById("text-fr").value;
    const text_en = document.getElementById("text-en").value;
    const text_de = document.getElementById("text-de").value;
    const text_it = document.getElementById("text-it").value;

    if (title === "") {
        alert("Veuillez saisir un titre.");
        return null;
    }

    return {
        id: crypto.randomUUID(),
        title,
        type,
        category,
        order,
        text_fr,
        text_en,
        text_de,
        text_it
    };
}

/* Sauvegarde un modèle dans models.json (simulation locale) */
export async function saveTemplate(model) {
    if (!model) return;

    const list = await loadJSON("../data/models.json") || [];
    list.push(model);

    await saveJSON("../data/models.json", list);

    alert("Modèle enregistré (simulation).");
}

/* Initialisation sur add-template.html */
export async function initAddTemplatePage() {

    const categorySelect = document.getElementById("model-category");
    if (!categorySelect) return;

    /* Charger et afficher les catégories disponibles */
    const categories = await loadCategories();
    categorySelect.innerHTML = "";

    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
    });

    /* Bouton de sauvegarde */
    const saveBtn = document.getElementById("save-template");
    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            const model = buildTemplateModel();
            await saveTemplate(model);
        });
    }
}

/* Auto-init : si on est sur add-template.html */
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("add-template.html")) {
        initAddTemplatePage();
    }
});
