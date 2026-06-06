import { loadJSON, saveJSON } from "./storageService.js";

const TOKEN_PATH = "tokens";
const TOKEN_PATTERN = /\{[^{}]+\}/g;
const INTERNAL_TOKEN_PREFIX_PATTERN = /^\{(?:client|contact|healthcheck)_/i;

export async function loadTokens() {
    const tokens = await loadJSON(TOKEN_PATH, []);
    return Array.isArray(tokens) ? tokens : [];
}

export async function saveTokens(tokens) {
    await saveJSON(TOKEN_PATH, tokens);
}

export async function ensureTokensFromTexts(texts = []) {
    const discovered = new Set();
    texts.filter(Boolean).forEach(text => {
        const matches = text.match(TOKEN_PATTERN);
        if (!matches) return;
        matches.forEach(m => discovered.add(m.trim()));
    });
    if (discovered.size === 0) return;

    const current = await loadTokens();
    let dirty = false;
    discovered.forEach(tokenValue => {
        if (INTERNAL_TOKEN_PREFIX_PATTERN.test(tokenValue)) return;
        if (current.some(t => t.token === tokenValue)) return;
        const clean = tokenValue.slice(1, -1).replace(/[_-]+/g, " ").trim();
        const label = clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : tokenValue;
        current.push({
            id: crypto.randomUUID(),
            token: tokenValue,
            label,
            input_type: "text"
        });
        dirty = true;
    });
    if (dirty) {
        await saveTokens(current);
    }
}
