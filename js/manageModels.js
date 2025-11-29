import { loadJSON, saveJSON } from "./storage.js";
import { ensureTokensFromTexts } from "./tokenManager.js";

/* --- STATE --- */
let currentType = "email"; // email or sms
let templates = [];

/* --- INIT --- */
document.addEventListener("DOMContentLoaded", async () => {
    templates = await loadJSON("models");
    setupSegments();
    renderModelsList();

    document.getElementById("addModelBtn").addEventListener("click", () => {
        openModelEditor();
    });
});

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
        container.innerHTML = "<p>Aucun modèle pour ce type.</p>";
        return;
    }

    list.forEach(model => {
        const row = document.createElement("div");
        row.className = "model-row";

        const title = document.createElement("span");
        title.textContent = model.title;

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "✏️";
        editBtn.addEventListener("click", () => openModelEditor(model));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑️";
        deleteBtn.addEventListener("click", () => deleteModel(model.id));

        row.appendChild(title);

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
    if (!confirm("Supprimer ce modèle ?")) return;

    templates = templates.filter(t => t.id !== id);
    await saveJSON("models", templates);
    renderModelsList();
}

/* --- EDITOR POPUP --- */
function openModelEditor(model = null) {
    const isEdit = model !== null;

    const popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
        <div class="popup-box">
            <h2>${isEdit ? "Edit Template" : "New Template"}</h2>

            <label>Title</label>
            <input id="mTitle" type="text" value="${isEdit ? model.title : ""}">

            <label>Type</label>
            <select id="mType">
                <option value="email" ${isEdit && model.type === "email" ? "selected" : ""}>Email</option>
                <option value="sms" ${isEdit && model.type === "sms" ? "selected" : ""}>SMS</option>
                <option value="other" ${isEdit && model.type === "other" ? "selected" : ""}>Other</option>
            </select>

            <div class="popup-lang-grid">
                <div class="popup-lang-item">
                    <label>FR</label>
                    <textarea id="mFr" class="plain-editor" style="height:160px; width:100%; background-color:#111827; color:white; border:1px solid #1f2937; border-radius:8px; padding:8px;">${isEdit ? model.text_fr : ""}</textarea>
                </div>
                <div class="popup-lang-item">
                    <label>EN</label>
                    <textarea id="mEn" class="plain-editor" style="height:160px; width:100%; background-color:#111827; color:white; border:1px solid #1f2937; border-radius:8px; padding:8px;">${isEdit ? model.text_en : ""}</textarea>
                </div>
                <div class="popup-lang-item">
                    <label>DE</label>
                    <textarea id="mDe" class="plain-editor" style="height:160px; width:100%; background-color:#111827; color:white; border:1px solid #1f2937; border-radius:8px; padding:8px;">${isEdit ? model.text_de : ""}</textarea>
                </div>
                <div class="popup-lang-item">
                    <label>IT</label>
                    <textarea id="mIt" class="plain-editor" style="height:160px; width:100%; background-color:#111827; color:white; border:1px solid #1f2937; border-radius:8px; padding:8px;">${isEdit ? model.text_it : ""}</textarea>
                </div>
            </div>

            <div class="popup-actions">
                <button id="closePopup" class="secondary-btn">Cancel</button>
                <button id="saveModel" class="primary-btn">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("closePopup").addEventListener("click", () => popup.remove());

    document.getElementById("saveModel").addEventListener("click", async () => {
        const title = document.getElementById("mTitle").value.trim();
        const type = document.getElementById("mType").value;
        const text_fr = document.getElementById("mFr").value.trim();
        const text_en = document.getElementById("mEn").value.trim();
        const text_de = document.getElementById("mDe").value.trim();
        const text_it = document.getElementById("mIt").value.trim();

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
                text_it
            };
            templates.push(newModel);
        }

        await saveJSON("models", templates);
        await ensureTokensFromTexts([text_fr, text_en, text_de, text_it]);
        popup.remove();
        renderModelsList();
    });
}
