/* UIMANAGER.JS
   Dynamic display management:
   - Inputs generated from tokens
   - Categories
   - Model buttons
*/

import { loadTokens } from "./tokenManager.js";
import { loadTemplates } from "./templateManager.js";

/* Render dynamic inputs (one per token) */
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

/* Render categories and models */
export async function renderModelsGrid() {
    const emailZone = document.getElementById("email-container");
    const smsZone = document.getElementById("sms-container");
    const otherZone = document.getElementById("other-container");

    if (!emailZone || !smsZone || !otherZone) return;

    emailZone.innerHTML = "";
    smsZone.innerHTML = "";
    otherZone.innerHTML = "";

    const templates = await loadTemplates();
    const createBtn = (model) => {
        const btn = document.createElement("button");
        btn.className = "primary-btn";
        btn.setAttribute("data-model-id", model.id);

        if (model.variants && model.variants.length > 0) {
            btn.classList.add("has-variants");
            btn.innerHTML = `<span>${model.title}</span><span class="variant-caret">▾</span>`;
        } else {
            btn.textContent = model.title;
        }

        btn.addEventListener("click", () => {
            document.dispatchEvent(
                new CustomEvent("modelSelected", { detail: model })
            );
        });
        return btn;
    };

    /* EMAIL */
    templates.email.forEach(model => {
        emailZone.appendChild(createBtn(model));
    });

    /* SMS */
    templates.sms.forEach(model => {
        smsZone.appendChild(createBtn(model));
    });

    /* OTHER */
    templates.other.forEach(model => {
        otherZone.appendChild(createBtn(model));
    });
}
