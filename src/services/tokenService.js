import { loadJSON, saveJSON } from "./storageService.js";
import {
    SO_TICKET_NUM_TOKEN,
    canonicalizeInputTokenValue,
    canonicalizeTokenDefinition,
    canonicalizeTokenDefinitions
} from "../utils/tokenCanonicalization.js";
import { AGENT_PROFILE_TOKENS } from "./agentProfileService.js";
import { EXTERNAL_SYSTEM_TOKENS } from "../utils/externalGenerator.js";

const TOKEN_PATH = "tokens";
const TOKEN_PATTERN = /\{[^{}]+\}/g;
const INTERNAL_TOKEN_PREFIX_PATTERN = /^\{(?:client|contact|healthcheck|offer)_/i;
const SYSTEM_TOKENS = [...AGENT_PROFILE_TOKENS, ...EXTERNAL_SYSTEM_TOKENS];
const SYSTEM_TOKEN_SET = new Set(SYSTEM_TOKENS.map((tokenDef) => tokenDef.token));

function isSystemToken(tokenDef) {
    return SYSTEM_TOKEN_SET.has(tokenDef?.token);
}

function normalizeTokenDefinition(tokenDef) {
    if (!tokenDef || typeof tokenDef !== "object") return tokenDef;
    return canonicalizeTokenDefinition({
        ...tokenDef,
        display_mode: "on_demand"
    });
}

function shallowRecordsEqual(left, right) {
    if (left === right) return true;
    if (!left || !right || typeof left !== "object" || typeof right !== "object") return false;

    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) return false;

    return leftKeys.every((key) => (
        Object.prototype.hasOwnProperty.call(right, key)
        && left[key] === right[key]
    ));
}

function tokenListsEqual(left = [], right = []) {
    if (left === right) return true;
    if (left.length !== right.length) return false;

    return left.every((tokenDef, index) => shallowRecordsEqual(tokenDef, right[index]));
}

export async function loadTokens() {
    const tokens = await loadJSON(TOKEN_PATH, []);
    const storedTokens = Array.isArray(tokens) ? tokens : [];

    const normalized = canonicalizeTokenDefinitions(storedTokens.map(normalizeTokenDefinition))
        .filter((tokenDef) => !isSystemToken(tokenDef));
    if (!tokenListsEqual(normalized, storedTokens)) {
        await saveTokens(normalized);
    }
    return canonicalizeTokenDefinitions([...SYSTEM_TOKENS, ...normalized]);
}

export async function saveTokens(tokens) {
    await saveJSON(TOKEN_PATH, Array.isArray(tokens)
        ? canonicalizeTokenDefinitions(tokens.map(normalizeTokenDefinition)).filter((tokenDef) => !isSystemToken(tokenDef))
        : tokens);
}

export async function ensureTokensFromTexts(texts = []) {
    const discovered = new Set();
    for (const text of texts) {
        if (!text) continue;
        TOKEN_PATTERN.lastIndex = 0;
        let match;
        while ((match = TOKEN_PATTERN.exec(String(text))) !== null) {
            discovered.add(canonicalizeInputTokenValue(match[0].trim()));
        }
    }
    if (discovered.size === 0) return;

    const current = await loadTokens();
    const currentTokenSet = new Set();
    for (const tokenDef of current) {
        if (tokenDef?.token) currentTokenSet.add(tokenDef.token);
    }
    let dirty = false;
    for (const tokenValue of discovered) {
        if (INTERNAL_TOKEN_PREFIX_PATTERN.test(tokenValue)) continue;
        if (currentTokenSet.has(tokenValue)) continue;
        const clean = tokenValue.slice(1, -1).replace(/[_-]+/g, " ").trim();
        const label = tokenValue === SO_TICKET_NUM_TOKEN
            ? "SO ticket number"
            : clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : tokenValue;
        const nextToken = {
            id: crypto.randomUUID(),
            token: tokenValue,
            label,
            input_type: "text",
            display_mode: "on_demand"
        };
        current.push(nextToken);
        currentTokenSet.add(tokenValue);
        dirty = true;
    }
    if (dirty) {
        await saveTokens(current);
    }
}
