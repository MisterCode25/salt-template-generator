/* TOKENMANAGER.JS — Version PRO alignée avec manageModels.js */
import { loadJSON, saveJSON } from "./storage.js";

let tokens = [];
const TOKEN_PATH = "tokens";
const TOKEN_PATTERN = /\{[^{}]+\}/g;

/* Charge depuis localStorage ou tokens.json */
export async function loadTokens() {
    tokens = await loadJSON(TOKEN_PATH) || [];
    return tokens;
}

/* Ajoute automatiquement les tokens découverts dans des modèles */
export async function ensureTokensFromTexts(texts = []) {
    const discovered = new Set();

    texts.filter(Boolean).forEach(text => {
        const matches = text.match(TOKEN_PATTERN);
        if (!matches) return;
        matches.forEach(m => {
            const token = m.trim();
            if (token.startsWith("{") && token.endsWith("}")) {
                discovered.add(token);
            }
        });
    });

    if (discovered.size === 0) return;

    await loadTokens();

    let added = false;
    discovered.forEach(tokenValue => {
        const alreadyExists = tokens.some(t => t.token === tokenValue);
        if (alreadyExists) return;

        const clean = tokenValue.slice(1, -1).replace(/[_-]+/g, " ").trim();
        const label = clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : tokenValue;

        tokens.push({
            id: crypto.randomUUID(),
            token: tokenValue,
            label,
            input_type: "text"
        });
        added = true;
    });

    if (added) {
        await saveTokens();
    }
}

/* Sauvegarde dans localStorage */
async function saveTokens() {
    await saveJSON(TOKEN_PATH, tokens);
}

/* Affiche la liste des tokens */
export async function renderTokens() {
    const list = document.getElementById("tokens-list");
    if (!list) return;

    list.innerHTML = "";

    await loadTokens();

    tokens.forEach(t => {
        const row = document.createElement("div");
        row.className = "token-row";

        const title = document.createElement("div");
        title.textContent = `${t.label || t.token}`;

        /* Boutons */
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "✏️";
        editBtn.addEventListener("click", () => openTokenEditor(t));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.addEventListener("click", () => deleteToken(t.id));

        /* Groupe boutons */
        const btnBox = document.createElement("div");
        btnBox.style.display = "flex";
        btnBox.style.gap = "8px";
        btnBox.style.marginLeft = "auto";
        btnBox.appendChild(editBtn);
        btnBox.appendChild(deleteBtn);

        row.appendChild(title);
        row.appendChild(btnBox);
        list.appendChild(row);
    });
}

/* Supprimer un token */
async function deleteToken(id) {
    if (!confirm("Delete this token?")) return;
    tokens = tokens.filter(t => t.id !== id);
    await saveTokens();
    renderTokens();
}

/* Popup d’édition / création */
function openTokenEditor(token = null) {
    const isEdit = token !== null;

    const popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
        <div class="popup-box">

            <h2>${isEdit ? "Edit Token" : "New Token"}</h2>

            <label>Token name (format: {my_token})</label>
            <input id="tName" type="text" value="${isEdit ? token.token : ""}">

            <label>Display label</label>
            <input id="tLabel" type="text" value="${isEdit ? token.label : ""}">

            <label>Field type</label>
            <select id="tType">
                <option value="text" ${isEdit && token.input_type === "text" ? "selected" : ""}>Text</option>
                <option value="number" ${isEdit && token.input_type === "number" ? "selected" : ""}>Number</option>
                <option value="date" ${isEdit && token.input_type === "date" ? "selected" : ""}>Date</option>
            </select>

            <label>Default value (optional)</label>
            <input id="tDefault" type="text" value="${isEdit && token.default ? token.default : ""}">

            <div class="popup-actions">
                <button class="secondary-btn" id="cancelPopup">Cancel</button>
                <button class="primary-btn" id="saveToken">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("cancelPopup").onclick = () => popup.remove();
    document.getElementById("saveToken").onclick = async () => saveToken(popup, token);
}

/* Sauvegarde token (edit ou create) */
async function saveToken(popup, token = null) {
    const name = document.getElementById("tName").value.trim();
    const label = document.getElementById("tLabel").value.trim();
    const type = document.getElementById("tType").value;

    if (!name.startsWith("{") || !name.endsWith("}")) {
        alert("Token must follow the {my_token} format.");
        return;
    }

    if (token) {
        /* Edition */
        token.token = name;
        token.label = label;
        token.input_type = type;
        const def = document.getElementById("tDefault").value.trim();
        token.default = def !== "" ? def : undefined;
    } else {
        /* Création */
        const def = document.getElementById("tDefault").value.trim();
        tokens.push({
            id: crypto.randomUUID(),
            token: name,
            label: label,
            input_type: type,
            default: def !== "" ? def : undefined
        });
    }

    await saveTokens();
    popup.remove();
    renderTokens();
}

/* Initialisation automatique */
document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("tokens-list");
    if (!list) return;

    renderTokens();

    const addBtn = document.getElementById("addTokenBtn");
    if (addBtn) addBtn.onclick = () => openTokenEditor();
});
