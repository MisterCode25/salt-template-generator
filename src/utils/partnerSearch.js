const SEARCHABLE_PARTNER_FIELDS = [
    "Firma Entität",
    "ALA-P ID",
    "Thema",
    "Unit/Rolle",
    "Telefon",
    "Email",
    "Bemerkung"
];
const partnerSearchTextCache = typeof WeakMap !== "undefined" ? new WeakMap() : null;

export function normalizeSearchText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function getPartnerSearchText(partner) {
    if (partner && typeof partner === "object") {
        const cached = partnerSearchTextCache?.get(partner);
        if (cached !== undefined) return cached;
    }

    let haystack = "";
    for (const field of SEARCHABLE_PARTNER_FIELDS) {
        const text = normalizeSearchText(partner?.[field]);
        if (!text) continue;
        haystack = haystack ? `${haystack} ${text}` : text;
    }

    if (partner && typeof partner === "object") {
        partnerSearchTextCache?.set(partner, haystack);
    }
    return haystack;
}

export function partnerMatchesQuery(partner, query) {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return true;

    return getPartnerSearchText(partner).includes(normalizedQuery);
}
