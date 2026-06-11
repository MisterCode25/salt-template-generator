import { loadJSON, saveJSON } from "./storageService.js";
import {
    SO_TICKET_NUM_TOKEN,
    canonicalizeInputTokenValue,
    canonicalizeTokenDefinition,
    canonicalizeTokenDefinitions
} from "../utils/tokenCanonicalization.js";

const TOKEN_PATH = "tokens";
const TOKEN_PATTERN = /\{[^{}]+\}/g;
const INTERNAL_TOKEN_PREFIX_PATTERN = /^\{(?:client|contact|healthcheck)_/i;

function normalizeTokenDefinition(tokenDef) {
    if (!tokenDef || typeof tokenDef !== "object") return tokenDef;
    return canonicalizeTokenDefinition({
        ...tokenDef,
        display_mode: "on_demand"
    });
}

export async function loadTokens() {
    const tokens = await loadJSON(TOKEN_PATH, []);
    if (!Array.isArray(tokens)) return [];

    const normalized = canonicalizeTokenDefinitions(tokens.map(normalizeTokenDefinition));
    if (JSON.stringify(normalized) !== JSON.stringify(tokens)) {
        await saveTokens(normalized);
    }
    return normalized;
}

export async function saveTokens(tokens) {
    await saveJSON(TOKEN_PATH, Array.isArray(tokens)
        ? canonicalizeTokenDefinitions(tokens.map(normalizeTokenDefinition))
        : tokens);
}

export async function ensureTokensFromTexts(texts = []) {
    const discovered = new Set();
    texts.filter(Boolean).forEach(text => {
        const matches = text.match(TOKEN_PATTERN);
        if (!matches) return;
        matches.forEach((match) => discovered.add(canonicalizeInputTokenValue(match.trim())));
    });
    if (discovered.size === 0) return;

    const current = await loadTokens();
    let dirty = false;
    discovered.forEach(tokenValue => {
        if (INTERNAL_TOKEN_PREFIX_PATTERN.test(tokenValue)) return;
        if (current.some(t => t.token === tokenValue)) return;
        const clean = tokenValue.slice(1, -1).replace(/[_-]+/g, " ").trim();
        const label = tokenValue === SO_TICKET_NUM_TOKEN
            ? "SO ticket number"
            : clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : tokenValue;
        current.push({
            id: crypto.randomUUID(),
            token: tokenValue,
            label,
            input_type: "text",
            display_mode: "on_demand"
        });
        dirty = true;
    });
    if (dirty) {
        await saveTokens(current);
    }
}
