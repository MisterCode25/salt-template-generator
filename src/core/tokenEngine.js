const TOKEN_PATTERN = /\{[^{}]+\}/g;
const HAS_OWN = Object.prototype.hasOwnProperty;

export function applyTokens(text, values) {
    if (!text) return "";
    if (!text.includes("{")) return text;
    if (!values) return text;

    const replacements = values || {};
    let result = "";
    let cursor = 0;
    let dirty = false;
    TOKEN_PATTERN.lastIndex = 0;

    let match;
    while ((match = TOKEN_PATTERN.exec(text)) !== null) {
        const token = match[0];
        if (!HAS_OWN.call(replacements, token)) continue;

        dirty = true;
        result += text.slice(cursor, match.index);
        result += replacements[token];
        cursor = match.index + token.length;
    }

    if (!dirty) return text;
    return result + text.slice(cursor);
}

export const TEMPLATE_LANGUAGE_FIELDS = Object.freeze([
    { code: "fr", field: "text_fr" },
    { code: "en", field: "text_en" },
    { code: "de", field: "text_de" },
    { code: "it", field: "text_it" }
]);
const TEMPLATE_LANGUAGE_BY_CODE = new Map(
    TEMPLATE_LANGUAGE_FIELDS.map((language) => [language.code, language])
);
const TEMPLATE_LANGUAGE_FALLBACKS_BY_CODE = new Map(
    TEMPLATE_LANGUAGE_FIELDS.map((language) => [
        language.code,
        Object.freeze([
            language,
            ...TEMPLATE_LANGUAGE_FIELDS.filter((candidate) => candidate.code !== language.code)
        ])
    ])
);

function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
}

export function getTemplateTextResult(model, langCode) {
    const preferred = TEMPLATE_LANGUAGE_BY_CODE.get(langCode) || TEMPLATE_LANGUAGE_FIELDS[0];
    const ordered = TEMPLATE_LANGUAGE_FALLBACKS_BY_CODE.get(preferred.code) || TEMPLATE_LANGUAGE_FIELDS;

    for (const language of ordered) {
        if (!hasText(model?.[language.field])) continue;
        return {
            text: model[language.field],
            lang: language.code,
            field: language.field,
            isFallback: language.code !== preferred.code
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
