import {
    canonicalizeInputTokenValue,
    canonicalizeTokenDefinition,
    normalizeTokenName
} from "../utils/tokenCanonicalization.js";

const ACTIVE_CLIENT_KEY = "active_client_payload";
export const STORED_INPUT_PREFIX = "input_";
export const MANUAL_CLIENT_INPUTS_KEY = "__templateInputs";
export const CLIENT_INPUT_VALUES_UPDATED_EVENT = "client-input-values-updated";

function normalizeManualInputs(manualInputs) {
    if (!manualInputs || typeof manualInputs !== "object" || Array.isArray(manualInputs)) {
        return { manualInputs: {}, dirty: Boolean(manualInputs) };
    }

    let dirty = false;
    const next = {};

    for (const name in manualInputs) {
        if (!Object.prototype.hasOwnProperty.call(manualInputs, name)) continue;
        const canonicalToken = canonicalizeInputTokenValue(name);
        const canonicalName = normalizeTokenName(canonicalToken);
        if (!canonicalName) continue;

        if (canonicalName !== name) dirty = true;
        next[canonicalName] = manualInputs[name];
    }

    return { manualInputs: next, dirty };
}

function normalizeActiveClientPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return { payload, dirty: false };
    }

    const { manualInputs, dirty } = normalizeManualInputs(payload[MANUAL_CLIENT_INPUTS_KEY]);
    if (!dirty) return { payload, dirty: false };

    return {
        payload: {
            ...payload,
            [MANUAL_CLIENT_INPUTS_KEY]: manualInputs
        },
        dirty: true
    };
}

export function migrateStoredClientInputValues(storage = globalThis.localStorage) {
    if (!storage) return 0;

    let migrated = 0;
    const inputEntries = [];
    for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (!key?.startsWith(STORED_INPUT_PREFIX)) continue;
        inputEntries.push([key, storage.getItem(key)]);
    }

    inputEntries.forEach(([key, value]) => {
        const token = key.slice(STORED_INPUT_PREFIX.length);
        const canonicalToken = canonicalizeInputTokenValue(token);
        const canonicalKey = `${STORED_INPUT_PREFIX}${canonicalToken}`;
        if (!canonicalToken || canonicalKey === key) return;

        if (storage.getItem(canonicalKey) === null && value !== null) {
            storage.setItem(canonicalKey, value);
        }
        storage.removeItem(key);
        migrated++;
    });

    return migrated;
}

function dispatchClientInputValuesUpdated(values) {
    if (typeof window === "undefined" || !hasRecordValues(values)) return;
    window.dispatchEvent(new CustomEvent(CLIENT_INPUT_VALUES_UPDATED_EVENT, {
        detail: { values }
    }));
}

function hasRecordValues(record) {
    if (!record) return false;
    for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) return true;
    }
    return false;
}

function normalizeClientInputEntry(tokenDef, value) {
    const definition = canonicalizeTokenDefinition(typeof tokenDef === "string" ? { token: tokenDef } : tokenDef || {});
    const valueText = value === null || value === undefined ? "" : String(value);
    const canonicalToken = canonicalizeInputTokenValue(definition.token);
    const canonicalName = normalizeTokenName(canonicalToken);

    if (!canonicalToken) return null;
    return { token: canonicalToken, name: canonicalName, value: valueText };
}

function saveClientInputEntries(entries, storage = globalThis.localStorage) {
    const normalizedEntries = [];
    const valuesByToken = {};

    for (const { tokenDef, value } of entries) {
        const entry = normalizeClientInputEntry(tokenDef, value);
        if (!entry) continue;
        normalizedEntries.push(entry);
        valuesByToken[entry.token] = entry.value;
    }

    const changedValuesByToken = {};
    if (storage) {
        for (const token in valuesByToken) {
            if (!Object.prototype.hasOwnProperty.call(valuesByToken, token)) continue;
            const value = valuesByToken[token];
            const storageKey = `${STORED_INPUT_PREFIX}${token}`;
            if (storage.getItem(storageKey) === value) continue;
            storage.setItem(storageKey, value);
            changedValuesByToken[token] = value;
        }
    } else {
        Object.assign(changedValuesByToken, valuesByToken);
    }

    const payload = loadActiveClientPayload();
    if (!payload) {
        dispatchClientInputValuesUpdated(changedValuesByToken);
        return { inputTokens: Object.keys(valuesByToken), payload: null, values: valuesByToken };
    }

    const previousInputs = payload[MANUAL_CLIENT_INPUTS_KEY];
    const { manualInputs, dirty: normalizedInputsDirty } = normalizeManualInputs(previousInputs);
    let payloadDirty = normalizedInputsDirty;
    for (const entry of normalizedEntries) {
        if (!entry.name) continue;
        if (entry.value === "") {
            if (!Object.prototype.hasOwnProperty.call(manualInputs, entry.name)) continue;
            delete manualInputs[entry.name];
            changedValuesByToken[entry.token] = entry.value;
            payloadDirty = true;
            continue;
        }
        if (manualInputs[entry.name] === entry.value) continue;
        manualInputs[entry.name] = entry.value;
        changedValuesByToken[entry.token] = entry.value;
        payloadDirty = true;
    }

    const nextPayload = payloadDirty
        ? {
            ...payload,
            [MANUAL_CLIENT_INPUTS_KEY]: manualInputs
        }
        : payload;
    if (payloadDirty) saveActiveClientPayload(nextPayload);
    dispatchClientInputValuesUpdated(changedValuesByToken);
    return { inputTokens: Object.keys(valuesByToken), payload: nextPayload, values: valuesByToken };
}

export function saveClientInputValue(tokenDef, value, storage = globalThis.localStorage) {
    return saveClientInputEntries([{ tokenDef, value }], storage);
}

export function saveClientInputValues(valuesByToken = {}, storage = globalThis.localStorage) {
    return saveClientInputEntries(
        Object.entries(valuesByToken).map(([token, value]) => ({
            tokenDef: { token },
            value
        })),
        storage
    );
}

export function loadActiveClientPayload() {
    try {
        const raw = localStorage.getItem(`local_${ACTIVE_CLIENT_KEY}`) || localStorage.getItem(ACTIVE_CLIENT_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        const normalized = normalizeActiveClientPayload(parsed);
        if (normalized.dirty) saveActiveClientPayload(normalized.payload);
        return normalized.payload;
    } catch (error) {
        console.error("loadActiveClientPayload error", error);
        return null;
    }
}

export function saveActiveClientPayload(payload) {
    try {
        const { payload: normalizedPayload } = normalizeActiveClientPayload(payload);
        const serialized = JSON.stringify(normalizedPayload);
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
