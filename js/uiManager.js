/* UIMANAGER.JS
   Gestion de l'affichage dynamique :
   - Inputs générés depuis les tokens
   - Catégories
   - Boutons des modèles
*/

import { loadTokens } from "./tokenManager.js";
import { loadTemplates } from "./templateManager.js";

/* Affiche les inputs dynamiques (un input par token) */
export async function renderDynamicInputs() {
    const container = document.getElementById("dynamic-inputs");
    if (!container) return;

    container.innerHTML = "";

    const tokens = await loadTokens();

    tokens.forEach(t => {
        const div = document.createElement("div");
        div.className = "form-field";

        // load saved value if exists
        const saved = localStorage.getItem("input_" + t.token);
        const initialValue = saved !== null ? saved : (t.default ? t.default : "");

        div.innerHTML = `
            <label>${t.label || ""}</label>
            <input 
                type="${t.input_type || 'text'}" 
                data-token="${t.token}" 
                placeholder="${t.label || ''}"
                value="${initialValue}"
            >
        `;

        container.appendChild(div);
    });
}

/* Affiche les catégories et les modèles */
export async function renderModelsGrid() {
    const emailZone = document.getElementById("email-container");
    const smsZone = document.getElementById("sms-container");
    const otherZone = document.getElementById("other-container");

    if (!emailZone || !smsZone || !otherZone) return;

    emailZone.innerHTML = "";
    smsZone.innerHTML = "";
    otherZone.innerHTML = "";

    const templates = await loadTemplates();
    const zones = [
        { container: emailZone, models: templates.email },
        { container: smsZone, models: templates.sms },
        { container: otherZone, models: templates.other }
    ];

    zones.forEach(({ container, models }) => {
        models.forEach(model => {
            const btn = document.createElement("button");
            btn.className = "primary-btn";
            btn.textContent = model.title;
            btn.setAttribute("data-model-id", model.id);
            btn.addEventListener("click", () => {
                document.dispatchEvent(
                    new CustomEvent("modelSelected", { detail: model })
                );
            });
            container.appendChild(btn);
        });
    });
}
