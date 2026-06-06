export function applyTokens(text, values) {
    if (!text) return "";
    let result = text;
    Object.keys(values || {}).forEach(token => {
        result = result.split(token).join(values[token]);
    });
    return result;
}

export const TEMPLATE_LANGUAGE_FIELDS = Object.freeze([
    { code: "fr", field: "text_fr" },
    { code: "en", field: "text_en" },
    { code: "de", field: "text_de" },
    { code: "it", field: "text_it" }
]);

function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
}

export function getTemplateTextResult(model, langCode) {
    const preferred = TEMPLATE_LANGUAGE_FIELDS.find((language) => language.code === langCode)
        || TEMPLATE_LANGUAGE_FIELDS[0];
    const ordered = [
        preferred,
        ...TEMPLATE_LANGUAGE_FIELDS.filter((language) => language.code !== preferred.code)
    ];

    const match = ordered.find((language) => hasText(model?.[language.field]));
    if (match) {
        return {
            text: model[match.field],
            lang: match.code,
            field: match.field,
            isFallback: match.code !== preferred.code
        };
    }

    return {
        text: model?.[preferred.field] ?? "",
        lang: preferred.code,
        field: preferred.field,
        isFallback: false
    };
}

export function getTemplateTextByLang(model, langCode) {
    return getTemplateTextResult(model, langCode).text;
}

export function generateFinalText(model, lang, tokenValues) {
    const base = getTemplateTextByLang(model, lang);
    return applyTokens(base, tokenValues || {});
}
