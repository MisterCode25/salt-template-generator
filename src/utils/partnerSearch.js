const SEARCHABLE_PARTNER_FIELDS = [
    "Firma Entität",
    "ALA-P ID",
    "Thema",
    "Unit/Rolle",
    "Telefon",
    "Email",
    "Bemerkung"
];

export function normalizeSearchText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function partnerMatchesQuery(partner, query) {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return true;

    const haystack = SEARCHABLE_PARTNER_FIELDS
        .map((field) => normalizeSearchText(partner[field]))
        .join(" ");

    return haystack.includes(normalizedQuery);
}
