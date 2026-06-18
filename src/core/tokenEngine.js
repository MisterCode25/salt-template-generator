const TOKEN_PATTERN = /\{[^{}]+\}/g;
const HAS_OWN = Object.prototype.hasOwnProperty;
const TITLE_TOKEN_NAMES = new Set([
    "title",
    "clienttitle",
    "customertitle",
    "civilite",
    "clientcivilite",
    "customercivilite",
    "salutation",
    "clientsalutation",
    "customersalutation"
]);
const TITLE_TRANSLATIONS = Object.freeze({
    male: Object.freeze({
        fr: "M.",
        en: "Mr.",
        de: "Herr",
        it: "Sig."
    }),
    female: Object.freeze({
        fr: "Mme",
        en: "Ms.",
        de: "Frau",
        it: "Sig.ra"
    })
});

function normalizeTokenName(token = "") {
    return String(token)
        .replace(/[{}]/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

function titleGender(value) {
    const normalized = String(value ?? "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[.\s]+/g, "");

    if (["mr", "m", "monsieur", "herr", "sig", "signor"].includes(normalized)) return "male";
    if (["ms", "mrs", "miss", "mme", "madame", "frau", "sigra", "signora"].includes(normalized)) return "female";
    return "";
}

export function translateTitleValue(value, langCode) {
    const gender = titleGender(value);
    if (!gender) return value;
    return TITLE_TRANSLATIONS[gender]?.[langCode] || value;
}

function translateTitleTokens(values = {}, langCode) {
    if (!values || typeof values !== "object") return values;

    const translated = {};
    let dirty = false;
    Object.entries(values).forEach(([token, value]) => {
        const nextValue = TITLE_TOKEN_NAMES.has(normalizeTokenName(token))
            ? translateTitleValue(value, langCode)
            : value;
        translated[token] = nextValue;
        if (nextValue !== value) dirty = true;
    });
    return dirty ? translated : values;
}

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
    const result = getTemplateTextResult(model, lang);
    return applyTokens(result.text, translateTitleTokens(tokenValues || {}, result.lang));
}
