const ACTIVE_CLIENT_KEY = "active_client_payload";
export const STORED_INPUT_PREFIX = "input_";
export const MANUAL_CLIENT_INPUTS_KEY = "__templateInputs";

function normalizeManualInputName(name = "") {
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

function formatManualInputToken(name = "") {
    const normalized = normalizeManualInputName(name);
    return normalized ? `{${normalized}}` : "";
}

function rawTokenValue(token = "") {
    const trimmed = String(token).trim();
    return /^\{[^{}]+\}$/.test(trimmed) ? trimmed : formatManualInputToken(trimmed);
}

export function getManualClientInputAliases(tokenDef = {}) {
    const definition = typeof tokenDef === "string" ? { token: tokenDef } : tokenDef || {};
    const aliases = new Set();
    [definition.token, definition.label, definition.key, definition.name]
        .filter(Boolean)
        .forEach((source) => {
            const normalized = normalizeManualInputName(source);
            if (normalized) aliases.add(normalized);
        });

    const names = Array.from(aliases);
    const hasPartnerTicket = names.some((name) => name.includes("partner_ticket"));
    const hasSoTicket = names.some((name) =>
        name === "so"
        || name.startsWith("so_")
        || name.includes("_so_")
        || name.includes("so_ticket")
    );
    const hasDefaultTicketName = names.some((name) =>
        ["ticket_num", "ticket_number", "ticket_no"].includes(name)
    );

    if (!hasPartnerTicket && (hasSoTicket || hasDefaultTicketName)) {
        [
            "so_ticket",
            "so_ticket_number",
            "so_number",
            "so_num",
            "ticket_num",
            "ticket_number"
        ].forEach((alias) => aliases.add(alias));
    }

    return Array.from(aliases);
}

export function saveClientInputValue(tokenDef, value, storage = globalThis.localStorage) {
    const definition = typeof tokenDef === "string" ? { token: tokenDef } : tokenDef || {};
    const valueText = value === null || value === undefined ? "" : String(value);
    const aliases = getManualClientInputAliases(definition);
    const inputTokens = new Set();
    const exactToken = rawTokenValue(definition.token);
    if (exactToken) inputTokens.add(exactToken);
    aliases.forEach((alias) => {
        const token = formatManualInputToken(alias);
        if (token) inputTokens.add(token);
    });

    if (storage) {
        inputTokens.forEach((token) => storage.setItem(`${STORED_INPUT_PREFIX}${token}`, valueText));
    }

    const payload = loadActiveClientPayload();
    if (!payload) {
        return { aliases, inputTokens: Array.from(inputTokens), payload: null };
    }

    const previousInputs = payload[MANUAL_CLIENT_INPUTS_KEY];
    const manualInputs = previousInputs && typeof previousInputs === "object" && !Array.isArray(previousInputs)
        ? { ...previousInputs }
        : {};
    aliases.forEach((alias) => {
        if (valueText === "") {
            delete manualInputs[alias];
        } else {
            manualInputs[alias] = valueText;
        }
    });

    const nextPayload = {
        ...payload,
        [MANUAL_CLIENT_INPUTS_KEY]: manualInputs
    };
    saveActiveClientPayload(nextPayload);
    return { aliases, inputTokens: Array.from(inputTokens), payload: nextPayload };
}

export function loadActiveClientPayload() {
    try {
        const raw = localStorage.getItem(`local_${ACTIVE_CLIENT_KEY}`) || localStorage.getItem(ACTIVE_CLIENT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error("loadActiveClientPayload error", error);
        return null;
    }
}

export function saveActiveClientPayload(payload) {
    try {
        const serialized = JSON.stringify(payload);
        localStorage.setItem(`local_${ACTIVE_CLIENT_KEY}`, serialized);
        localStorage.setItem(ACTIVE_CLIENT_KEY, serialized);
    } catch (error) {
        console.error("saveActiveClientPayload error", error);
    }
}

export function clearActiveClientPayload() {
    localStorage.removeItem(`local_${ACTIVE_CLIENT_KEY}`);
    localStorage.removeItem(ACTIVE_CLIENT_KEY);
}

export function clearStoredInputValues(storage = globalThis.localStorage) {
    if (!storage) return 0;

    const keysToRemove = [];
    for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (key?.startsWith(STORED_INPUT_PREFIX)) keysToRemove.push(key);
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
    return keysToRemove.length;
}
