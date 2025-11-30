/* TEMPLATEMANAGER.JS
   Gestion des modèles : chargement, création, préparation
*/

import { loadJSON, saveJSON } from "./storage.js";
import { ensureTokensFromTexts } from "./tokenManager.js";

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

/* Charge tous les modèles */
export async function loadTemplates() {
    const templates = await loadJSON("models") || [];

    return {
        email: templates.filter(t => t.type === "email"),
        sms: templates.filter(t => t.type === "sms"),
        other: templates.filter(t => t.type === "other")
    };
}

/* Crée un objet TemplateModel prêt à être sauvegardé */
export function buildTemplateModel() {

    const title = document.getElementById("model-title").value.trim();
    const type = document.getElementById("model-type").value;
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

    const list = await loadJSON("models") || [];
    list.push(model);

    await saveJSON("models", list);
    await ensureTokensFromTexts([
        model.text_fr,
        model.text_en,
        model.text_de,
        model.text_it
    ]);

    alert("Modèle enregistré (simulation).");
}

/* Initialisation sur add-template.html */
export async function initAddTemplatePage() {
    /* Bouton de sauvegarde */
    const saveBtn = document.getElementById("save-template");
    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            const model = buildTemplateModel();
            await saveTemplate(model);
        });
    }

    setupAutosizeTextareas();
}

/* Auto-init : si on est sur add-template.html */
document.addEventListener("DOMContentLoaded", () => {
});
