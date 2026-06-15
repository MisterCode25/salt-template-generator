import {
    deleteIndexedJSON,
    loadIndexedJSON,
    saveIndexedJSON
} from "./indexedDbService.js";

const LOCAL_PREFIX = "local_";
const INDEXED_MISSING = Symbol("indexed-missing");

function getLegacyStorage() {
    try {
        return globalThis.localStorage || null;
    } catch {
        return null;
    }
}

function parseLegacyValue(raw) {
    if (raw === null || raw === undefined) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
}

export function readLegacyStorageValue(key) {
    const storage = getLegacyStorage();
    if (!storage) return { found: false, value: null };

    const prefixedKey = LOCAL_PREFIX + key;
    const prefixedValue = storage.getItem(prefixedKey);
    if (prefixedValue !== null) {
        return { found: true, value: parseLegacyValue(prefixedValue) };
    }

    const legacyValue = storage.getItem(key);
    if (legacyValue !== null) {
        return { found: true, value: parseLegacyValue(legacyValue) };
    }

    return { found: false, value: null };
}

export function removeLegacyStorageValue(key) {
    const storage = getLegacyStorage();
    if (!storage) return;
    storage.removeItem(LOCAL_PREFIX + key);
    storage.removeItem(key);
}

export function removeLegacyStorageKeys(keys = []) {
    keys.forEach((key) => removeLegacyStorageValue(key));
}

export async function loadJSON(key, fallback = null) {
    try {
        const indexedValue = await loadIndexedJSON(key, INDEXED_MISSING);
        if (indexedValue !== INDEXED_MISSING) return indexedValue ?? fallback;

        const legacyValue = readLegacyStorageValue(key);
        if (!legacyValue.found) return fallback;

        await saveIndexedJSON(key, legacyValue.value);
        removeLegacyStorageValue(key);
        return legacyValue.value ?? fallback;
    } catch (e) {
        console.error("loadJSON error", e);
        return fallback;
    }
}

export async function saveJSON(key, value) {
    try {
        await saveIndexedJSON(key, value);
        removeLegacyStorageValue(key);
    } catch (e) {
        console.error("saveJSON error", e);
    }
}

export async function deleteJSON(key) {
    try {
        await deleteIndexedJSON(key);
        removeLegacyStorageValue(key);
    } catch (e) {
        console.error("deleteJSON error", e);
    }
}
