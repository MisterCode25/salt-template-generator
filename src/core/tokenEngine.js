export function applyTokens(text, values) {
    if (!text) return "";
    let result = text;
    Object.keys(values || {}).forEach(token => {
        const regex = new RegExp(token, "g");
        result = result.replace(regex, values[token]);
    });
    return result;
}

export function generateFinalText(model, lang, tokenValues) {
    const baseByLang = {
        fr: model.text_fr,
        en: model.text_en,
        de: model.text_de,
        it: model.text_it
    };
    const base = baseByLang[lang] ?? model.text_fr ?? "";
    return applyTokens(base, tokenValues || {});
}
