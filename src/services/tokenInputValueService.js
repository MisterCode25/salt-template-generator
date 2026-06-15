import {
    canonicalizeInputTokenValue
} from "../utils/tokenCanonicalization.js";
import {
    deleteIndexedJSON,
    loadIndexedJSON,
    saveIndexedJSON
} from "./indexedDbService.js";

export const TOKEN_INPUT_VALUES_KEY = "token_input_values";
export const STORED_INPUT_PREFIX = "input_";

const INDEXED_MISSING = Symbol("token-input-missing");

let migrationPromise = null;

function getLegacyStorage() {
    try {
        return globalThis.localStorage || null;
    } catch {
        return null;
    }
}

function normalizeTokenInputValues(values = {}) {
    if (!values || typeof values !== "object" || Array.isArray(values)) return {};

    const normalized = {};
    Object.entries(values).forEach(([token, value]) => {
        const canonicalToken = canonicalizeInputTokenValue(token);
        if (!canonicalToken) return;
        normalized[canonicalToken] = value === null || value === undefined ? "" : String(value);
    });
    return normalized;
}

function readLegacyTokenInputValues() {
    const storage = getLegacyStorage();
    if (!storage) return { values: {}, keys: [] };

    const values = {};
    const keys = [];
    for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (!key?.startsWith(STORED_INPUT_PREFIX)) continue;
        keys.push(key);
        const canonicalToken = canonicalizeInputTokenValue(key.slice(STORED_INPUT_PREFIX.length));
        if (!canonicalToken) continue;
        values[canonicalToken] = storage.getItem(key) || "";
    }
    return { values, keys };
}

function removeLegacyTokenInputKeys(keys = []) {
    const storage = getLegacyStorage();
    if (!storage) return;
    keys.forEach((key) => storage.removeItem(key));
}

async function migrateLegacyTokenInputValues() {
    const indexedValues = await loadIndexedJSON(TOKEN_INPUT_VALUES_KEY, INDEXED_MISSING);
    if (indexedValues !== INDEXED_MISSING) {
        const normalized = normalizeTokenInputValues(indexedValues);
        if (Object.keys(normalized).length !== Object.keys(indexedValues || {}).length) {
            await saveIndexedJSON(TOKEN_INPUT_VALUES_KEY, normalized);
        }
        const { keys } = readLegacyTokenInputValues();
        removeLegacyTokenInputKeys(keys);
        return normalized;
    }

    const { values, keys } = readLegacyTokenInputValues();
    const normalized = normalizeTokenInputValues(values);
    await saveIndexedJSON(TOKEN_INPUT_VALUES_KEY, normalized);
    removeLegacyTokenInputKeys(keys);
    return normalized;
}

async function ensureMigrated() {
    if (!migrationPromise) {
        migrationPromise = migrateLegacyTokenInputValues().catch((error) => {
            migrationPromise = null;
            throw error;
        });
    }
    return migrationPromise;
}

export async function loadTokenInputValues() {
    try {
        const indexedValues = await ensureMigrated();
        const { values: legacyValues, keys } = readLegacyTokenInputValues();
        if (keys.length === 0) return indexedValues;

        const mergedValues = {
            ...indexedValues,
            ...normalizeTokenInputValues(legacyValues)
        };
        await saveIndexedJSON(TOKEN_INPUT_VALUES_KEY, mergedValues);
        migrationPromise = Promise.resolve(mergedValues);
        removeLegacyTokenInputKeys(keys);
        return mergedValues;
    } catch (error) {
        console.error("loadTokenInputValues error", error);
        return {};
    }
}

export async function saveTokenInputValues(values = {}) {
    const normalized = normalizeTokenInputValues(values);
    await saveIndexedJSON(TOKEN_INPUT_VALUES_KEY, normalized);
    migrationPromise = Promise.resolve(normalized);
    return normalized;
}

export async function setTokenInputValue(token, value) {
    const canonicalToken = canonicalizeInputTokenValue(token);
    if (!canonicalToken) return {};

    const current = await loadTokenInputValues();
    const next = {
        ...current,
        [canonicalToken]: value === null || value === undefined ? "" : String(value)
    };
    return saveTokenInputValues(next);
}

export async function setTokenInputValues(valuesByToken = {}) {
    const current = await loadTokenInputValues();
    const next = {
        ...current,
        ...normalizeTokenInputValues(valuesByToken)
    };
    return saveTokenInputValues(next);
}

export async function removeTokenInputValue(token) {
    const canonicalToken = canonicalizeInputTokenValue(token);
    if (!canonicalToken) return {};

    const current = await loadTokenInputValues();
    const next = { ...current };
    delete next[canonicalToken];
    return saveTokenInputValues(next);
}

export async function removeTokenInputValues(tokens = []) {
    const current = await loadTokenInputValues();
    const next = { ...current };
    tokens.forEach((token) => {
        const canonicalToken = canonicalizeInputTokenValue(token);
        if (canonicalToken) delete next[canonicalToken];
    });
    return saveTokenInputValues(next);
}

export async function clearTokenInputValues() {
    await deleteIndexedJSON(TOKEN_INPUT_VALUES_KEY);
    migrationPromise = Promise.resolve({});
    const { keys } = readLegacyTokenInputValues();
    removeLegacyTokenInputKeys(keys);
    return keys.length;
}
