export const SUPER_OFFICE_TICKET_BASE_URL = "https://cs.salt.ch/scripts/ticket.fcgi";

export function normalizeSuperOfficeTicketNumber(value) {
    const normalizedValue = String(value ?? "")
        .trim()
        .replace(/^#\s*/, "");
    return /^\d+$/.test(normalizedValue) ? normalizedValue : "";
}

export function buildSuperOfficeTicketUrl(ticketNumber) {
    const normalizedTicketNumber = normalizeSuperOfficeTicketNumber(ticketNumber);
    if (!normalizedTicketNumber) {
        throw new Error("Le numéro de ticket SuperOffice est invalide.");
    }

    const url = new URL(SUPER_OFFICE_TICKET_BASE_URL);
    url.searchParams.set("_sf", "0");
    url.searchParams.set("action", "doScreenDefinition");
    url.searchParams.set("idString", "viewEmail");
    url.searchParams.set("entryId", normalizedTicketNumber);
    return url.href;
}

export function getSuperOfficeTicketNumberFromUrl(value) {
    try {
        return normalizeSuperOfficeTicketNumber(new URL(value).searchParams.get("entryId"));
    } catch {
        return "";
    }
}

export function getCapturedSuperOfficeTicketNumber(payload) {
    return normalizeSuperOfficeTicketNumber(payload?.ticketId)
        || normalizeSuperOfficeTicketNumber(payload?.sourceTicketId);
}
