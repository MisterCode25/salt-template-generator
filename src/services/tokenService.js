import { loadJSON, saveJSON } from "./storageService.js";
import {
    SO_TICKET_NUM_TOKEN,
    canonicalizeInputTokenValue,
    canonicalizeTokenDefinition,
    canonicalizeTokenDefinitions
} from "../utils/tokenCanonicalization.js";
import { AGENT_PROFILE_TOKENS } from "./agentProfileService.js";
import { EXTERNAL_SYSTEM_TOKENS } from "../utils/externalGenerator.js";
import { loadActiveClientPayload, STORED_INPUT_PREFIX } from "./activeClientService.js";
import { getClientInternalTokenData } from "../utils/clientClipboard.js";

const TOKEN_PATH = "tokens";
const TOKEN_PATTERN = /\{[^{}]+\}/g;
const INTERNAL_TOKEN_PREFIX_PATTERN = /^\{(?:client|contact|healthcheck|offer)_/i;
const SYSTEM_TOKENS = [...AGENT_PROFILE_TOKENS, ...EXTERNAL_SYSTEM_TOKENS];
const SYSTEM_TOKEN_SET = new Set(SYSTEM_TOKENS.map((tokenDef) => tokenDef.token));

function isNonPersistentToken(tokenDef) {
    return SYSTEM_TOKEN_SET.has(tokenDef?.token)
        || Boolean(tokenDef?.system)
        || Boolean(tokenDef?.internal);
}

function normalizeTokenDefinition(tokenDef) {
    if (!tokenDef || typeof tokenDef !== "object") return tokenDef;
    const { previewValue, currentValue, ...persistedTokenDef } = tokenDef;
    return canonicalizeTokenDefinition({
        ...persistedTokenDef,
        display_mode: "on_demand"
    });
}

function formatPreviewValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "";
}

function readStoredTokenPreviewValue(token, storage = globalThis.localStorage) {
    if (!storage || !token) return "";
    try {
        return formatPreviewValue(storage.getItem(`${STORED_INPUT_PREFIX}${token}`));
    } catch {
        return "";
    }
}

function withTokenPreviewValues(tokenDefs = [], storage = globalThis.localStorage) {
    return tokenDefs.map((tokenDef) => {
        if (!tokenDef || typeof tokenDef !== "object") return tokenDef;

        const previewValue = formatPreviewValue(tokenDef.previewValue ?? tokenDef.currentValue)
            || readStoredTokenPreviewValue(tokenDef.token, storage);
        return previewValue ? { ...tokenDef, previewValue } : tokenDef;
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
        .filter((tokenDef) => !isNonPersistentToken(tokenDef));
    if (!tokenListsEqual(normalized, storedTokens)) {
        await saveTokens(normalized);
    }
    return canonicalizeTokenDefinitions([...SYSTEM_TOKENS, ...normalized]);
}

export function mergeUniqueTokenDefinitions(tokenDefs = []) {
    const byToken = new Map();
    tokenDefs
        .filter(Boolean)
        .forEach((tokenDef) => {
            if (!tokenDef?.token || byToken.has(tokenDef.token)) return;
            byToken.set(tokenDef.token, tokenDef);
        });
    return Array.from(byToken.values());
}

export async function loadTokensWithClientData(clientPayload = loadActiveClientPayload()) {
    const configuredTokens = await loadTokens();
    const clientTokens = clientPayload
        ? getClientInternalTokenData(clientPayload).tokenDefs
        : [];
    return withTokenPreviewValues(mergeUniqueTokenDefinitions([...configuredTokens, ...clientTokens]));
}

export async function saveTokens(tokens) {
    await saveJSON(TOKEN_PATH, Array.isArray(tokens)
        ? canonicalizeTokenDefinitions(tokens.map(normalizeTokenDefinition)).filter((tokenDef) => !isNonPersistentToken(tokenDef))
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
