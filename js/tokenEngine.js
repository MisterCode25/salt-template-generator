/* TOKENENGINE.JS
   Moteur de remplacement des tokens dans un texte
*/

/**
 * Remplace tous les tokens {token_name} dans un texte
 * @param {string} text - Le texte original contenant les tokens
 * @param {object} values - Clé: token → Valeur réelle
 * @returns string
 */
export function applyTokens(text, values) {
    if (!text) return "";

    let result = text;

    Object.keys(values).forEach(token => {
        const regex = new RegExp(token, "g");
        result = result.replace(regex, values[token]);
    });

    return result;
}

/**
 * Récupère les valeurs des inputs dynamiques (un input par token)
 * @param {string[]} requiredTokens - liste des tokens à valider (si null => tous)
 * @returns object : { values: { "{ticket_num}": "263XXXXX" }, missing: ["{token}"] }
 */
export async function collectInputValues(requiredTokens = null) {
    const inputs = document.querySelectorAll("[data-token]");
    const values = {};
    const missing = [];
    const requiredSet = requiredTokens ? new Set(requiredTokens) : null;

    // Load token definitions to check for defaults
    const tokenDefs = await (await import("./tokenManager.js")).loadTokens();

    inputs.forEach(input => {
        const token = input.getAttribute("data-token");
        const value = input.value.trim();
        const isRequired = !requiredSet || requiredSet.has(token);

        // find token definition
        const def = tokenDefs.find(t => t.token === token);

        // apply default if empty AND default exists
        let finalValue = value;
        if (finalValue === "" && def && def.default !== undefined) {
            finalValue = def.default;
        }

        const isEmpty = finalValue === "" || finalValue === undefined || finalValue === null;
        if (isRequired && isEmpty) {
            missing.push(token);
            input.classList.add("input-error");
            if (!input.dataset.errorListener) {
                input.addEventListener("input", () => {
                    if (input.value.trim() !== "") {
                        input.classList.remove("input-error");
                    }
                });
                input.dataset.errorListener = "true";
            }
        } else {
            input.classList.remove("input-error");
        }

        values[token] = finalValue;
        // save value for persistence
        localStorage.setItem("input_" + token, values[token]);
    });

    return { values, missing };
}

/**
 * Génère le texte final en fonction de la langue choisie
 * @param {object} model - Le modèle sélectionné
 * @param {string} lang - fr / en / de / it
 */
export function generateFinalText(model, lang, tokenValues) {
    let base = "";

    switch (lang) {
        case "fr": base = model.text_fr; break;
        case "en": base = model.text_en; break;
        case "de": base = model.text_de; break;
        case "it": base = model.text_it; break;
        default: base = model.text_fr;
    }

    return applyTokens(base, tokenValues);
}
