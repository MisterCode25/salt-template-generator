export function applyTokens(text, values) {
    if (!text) return "";
    const entries = Object.entries(values || {}).filter(([token]) => token && text.includes(token));
    if (entries.length === 0) return text;

    const replacements = new Map(entries);
    const pattern = new RegExp(entries.map(([token]) => escapeRegExp(token)).join("|"), "g");
    return text.replace(pattern, (token) => replacements.get(token));
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

function escapeRegExp(value = "") {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
}

export function getTemplateTextResult(model, langCode) {
    const preferred = TEMPLATE_LANGUAGE_BY_CODE.get(langCode) || TEMPLATE_LANGUAGE_FIELDS[0];
    const ordered = TEMPLATE_LANGUAGE_FALLBACKS_BY_CODE.get(preferred.code) || TEMPLATE_LANGUAGE_FIELDS;

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
