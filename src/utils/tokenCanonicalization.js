export const SO_TICKET_NUM_TOKEN = "{so_ticket_num}";
export const SO_TICKET_TOKEN_KEY = "soTicket";

const SO_TICKET_NUM_NAME = "so_ticket_num";
const SO_TICKET_NAME_ALIASES = new Set([
    SO_TICKET_NUM_NAME,
    "ticket_num",
    "ticket_number",
    "ticket_no",
    "so_num",
    "so_number",
    "so_no",
    "so_ticket",
    "so_ticket_number",
    "so_ticket_no"
]);

export function normalizeTokenName(name = "") {
    return String(name)
        .replace(/[{}]/g, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function formatTokenName(name = "") {
    const normalized = normalizeTokenName(name);
    return normalized ? `{${normalized}}` : "";
}

export function isSoTicketTokenName(name = "") {
    return SO_TICKET_NAME_ALIASES.has(normalizeTokenName(name));
}

export function canonicalizeInputTokenValue(token = "") {
    const raw = String(token ?? "").trim();
    if (!raw) return "";
    if (isSoTicketTokenName(raw)) return SO_TICKET_NUM_TOKEN;
    if (/^\{[^{}]+\}$/.test(raw)) return raw;
    return formatTokenName(raw);
}

export function canonicalizeTemplateTokensInText(text = "") {
    if (typeof text !== "string" || text === "") return text;
    return text.replace(/\{[^{}]+\}/g, (token) => (
        isSoTicketTokenName(token) ? SO_TICKET_NUM_TOKEN : token
    ));
}

export function canonicalizeTokenDefinition(tokenDef = {}) {
    if (!tokenDef || typeof tokenDef !== "object") return tokenDef;

    const shouldUseSoTicketToken = [
        tokenDef.token,
        tokenDef.key,
        tokenDef.label,
        tokenDef.name
    ].some((candidate) => candidate && isSoTicketTokenName(candidate));

    return {
        ...tokenDef,
        token: shouldUseSoTicketToken
            ? SO_TICKET_NUM_TOKEN
            : canonicalizeInputTokenValue(tokenDef.token),
        key: shouldUseSoTicketToken ? SO_TICKET_TOKEN_KEY : tokenDef.key,
        label: shouldUseSoTicketToken && !tokenDef.label ? "SO ticket number" : tokenDef.label
    };
}

function mergeTokenDefinitions(existing, incoming) {
    return {
        ...incoming,
        ...existing,
        token: existing.token,
        label: existing.label || incoming.label,
        key: existing.key || incoming.key,
        input_type: existing.input_type || incoming.input_type,
        default: existing.default ?? incoming.default,
        display_mode: existing.display_mode || incoming.display_mode
    };
}

export function canonicalizeTokenDefinitions(tokens = []) {
    const byToken = new Map();

    tokens.forEach((tokenDef) => {
        const canonical = canonicalizeTokenDefinition(tokenDef);
        if (!canonical?.token) return;

        const previous = byToken.get(canonical.token);
        byToken.set(canonical.token, previous ? mergeTokenDefinitions(previous, canonical) : canonical);
    });

    return Array.from(byToken.values());
}
