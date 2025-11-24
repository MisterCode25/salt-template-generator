/* APP.JS
   Point d’entrée principal de l’application
*/

import { renderTokens } from "./tokenManager.js";
import { loadJSON } from "./storage.js";
import { renderDynamicInputs, renderModelsGrid } from "./uiManager.js";
import { loadTemplates } from "./templateManager.js";
import { collectInputValues, generateFinalText } from "./tokenEngine.js";
import { copyToClipboard } from "./clipboard.js";

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

            const values = collectInputValues();
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
        });
    }
});