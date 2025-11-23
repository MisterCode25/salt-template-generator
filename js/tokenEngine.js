

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
 * @returns object : { "{ticket_num}": "263XXXXX", "{agent_name}": "Samir", ... }
 */
export function collectInputValues() {
    const inputs = document.querySelectorAll("[data-token]");
    const values = {};

    inputs.forEach(input => {
        const token = input.getAttribute("data-token");
        values[token] = input.value;
    });

    return values;
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