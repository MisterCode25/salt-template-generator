import {
    canonicalizeInputTokenValue,
    canonicalizeTokenDefinition,
    normalizeTokenName
} from "../utils/tokenCanonicalization.js";

const ACTIVE_CLIENT_KEY = "active_client_payload";
export const STORED_INPUT_PREFIX = "input_";
export const MANUAL_CLIENT_INPUTS_KEY = "__templateInputs";

function normalizeManualInputs(manualInputs) {
    if (!manualInputs || typeof manualInputs !== "object" || Array.isArray(manualInputs)) {
        return { manualInputs: {}, dirty: Boolean(manualInputs) };
    }

    let dirty = false;
    const next = {};

    Object.entries(manualInputs).forEach(([name, value]) => {
        const canonicalToken = canonicalizeInputTokenValue(name);
        const canonicalName = normalizeTokenName(canonicalToken);
        if (!canonicalName) return;

        if (canonicalName !== name) dirty = true;
        next[canonicalName] = value;
    });

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

export function saveClientInputValue(tokenDef, value, storage = globalThis.localStorage) {
    const definition = canonicalizeTokenDefinition(typeof tokenDef === "string" ? { token: tokenDef } : tokenDef || {});
    const valueText = value === null || value === undefined ? "" : String(value);
    const inputTokens = new Set();
    const canonicalToken = canonicalizeInputTokenValue(definition.token);
    const canonicalName = normalizeTokenName(canonicalToken);
    if (canonicalToken) inputTokens.add(canonicalToken);

    if (storage) {
        inputTokens.forEach((token) => storage.setItem(`${STORED_INPUT_PREFIX}${token}`, valueText));
    }

    const payload = loadActiveClientPayload();
    if (!payload) {
        return { inputTokens: Array.from(inputTokens), payload: null };
    }

    const previousInputs = payload[MANUAL_CLIENT_INPUTS_KEY];
    const { manualInputs } = normalizeManualInputs(previousInputs);
    if (canonicalName) {
        if (valueText === "") {
            delete manualInputs[canonicalName];
        } else {
            manualInputs[canonicalName] = valueText;
        }
    }

    const nextPayload = {
        ...payload,
        [MANUAL_CLIENT_INPUTS_KEY]: manualInputs
    };
    saveActiveClientPayload(nextPayload);
    return { inputTokens: Array.from(inputTokens), payload: nextPayload };
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
