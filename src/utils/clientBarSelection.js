export const CLIENT_BAR_FIELD_LIMIT = 16;

const CASE_REFERENCE_LABELS = new Set([
    "contractor",
    "contractor number",
    "so ticket",
    "so ticket number"
]);

function normalizeFieldLabel(label = "") {
    return String(label || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function limitClientBarFieldKeys(keys) {
    return Array.isArray(keys) ? keys.slice(0, CLIENT_BAR_FIELD_LIMIT) : [];
}

export function excludeCaseReferenceFields(fields) {
    return Array.isArray(fields)
        ? fields.filter((field) => !CASE_REFERENCE_LABELS.has(normalizeFieldLabel(field?.label)))
        : [];
}
