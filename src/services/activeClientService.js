import {
    canonicalizeInputTokenValue,
    canonicalizeTokenDefinition,
    normalizeTokenName
} from "../utils/tokenCanonicalization.js";
import { deleteJSON, loadJSON, saveJSON } from "./storageService.js";
import {
    clearTokenInputValues,
    loadTokenInputValues,
    setTokenInputValues
} from "./tokenInputValueService.js";

const ACTIVE_CLIENT_KEY = "active_client_payload";
export { STORED_INPUT_PREFIX } from "./tokenInputValueService.js";
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

export async function migrateStoredClientInputValues() {
    await loadTokenInputValues();
    return 0;
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

async function saveClientInputEntries(entries) {
    const normalizedEntries = [];
    const valuesByToken = {};

    for (const { tokenDef, value } of entries) {
        const entry = normalizeClientInputEntry(tokenDef, value);
        if (!entry) continue;
        normalizedEntries.push(entry);
        valuesByToken[entry.token] = entry.value;
    }

    const currentValues = await loadTokenInputValues();
    const changedValuesByToken = {};
    for (const token in valuesByToken) {
        if (!Object.prototype.hasOwnProperty.call(valuesByToken, token)) continue;
        const value = valuesByToken[token];
        if (currentValues[token] === value) continue;
        changedValuesByToken[token] = value;
    }
    await setTokenInputValues(valuesByToken);

    const payload = await loadActiveClientPayload();
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
    if (payloadDirty) await saveActiveClientPayload(nextPayload);
    dispatchClientInputValuesUpdated(changedValuesByToken);
    return { inputTokens: Object.keys(valuesByToken), payload: nextPayload, values: valuesByToken };
}

export function saveClientInputValue(tokenDef, value) {
    return saveClientInputEntries([{ tokenDef, value }]);
}

export function saveClientInputValues(valuesByToken = {}) {
    return saveClientInputEntries(
        Object.entries(valuesByToken).map(([token, value]) => ({
            tokenDef: { token },
            value
        }))
    );
}

export async function loadActiveClientPayload() {
    try {
        const parsed = await loadJSON(ACTIVE_CLIENT_KEY, null);
        if (!parsed) return null;
        const normalized = normalizeActiveClientPayload(parsed);
        if (normalized.dirty) await saveActiveClientPayload(normalized.payload);
        return normalized.payload;
    } catch (error) {
        console.error("loadActiveClientPayload error", error);
        return null;
    }
}

export async function saveActiveClientPayload(payload) {
    try {
        const { payload: normalizedPayload } = normalizeActiveClientPayload(payload);
        await saveJSON(ACTIVE_CLIENT_KEY, normalizedPayload);
    } catch (error) {
        console.error("saveActiveClientPayload error", error);
    }
}

export function clearActiveClientPayload() {
    return deleteJSON(ACTIVE_CLIENT_KEY);
}

export function clearStoredInputValues() {
    return clearTokenInputValues();
}
