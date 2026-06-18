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
export const IMPORTED_EXTERNAL_ID_KEY = "__importedExternalId";
export const CLIENT_INPUT_VALUES_UPDATED_EVENT = "client-input-values-updated";
export const ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT = "active-client-payload-updated";

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

    let nextPayload = payload;
    let payloadDirty = false;
    const { manualInputs, dirty } = normalizeManualInputs(payload[MANUAL_CLIENT_INPUTS_KEY]);
    if (dirty) {
        nextPayload = {
            ...nextPayload,
            [MANUAL_CLIENT_INPUTS_KEY]: manualInputs
        };
        payloadDirty = true;
    }

    if (Object.prototype.hasOwnProperty.call(payload, IMPORTED_EXTERNAL_ID_KEY)) {
        const importedExternalId = String(payload[IMPORTED_EXTERNAL_ID_KEY] ?? "").trim();
        if (importedExternalId) {
            if (importedExternalId !== payload[IMPORTED_EXTERNAL_ID_KEY]) {
                nextPayload = {
                    ...nextPayload,
                    [IMPORTED_EXTERNAL_ID_KEY]: importedExternalId
                };
                payloadDirty = true;
            }
        } else {
            const { [IMPORTED_EXTERNAL_ID_KEY]: _externalId, ...withoutExternalId } = nextPayload;
            nextPayload = withoutExternalId;
            payloadDirty = true;
        }
    }

    return { payload: nextPayload, dirty: payloadDirty };
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

function dispatchActiveClientPayloadUpdated(payload) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT, {
        detail: { payload }
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

export async function saveImportedExternalId(externalId) {
    try {
        const payload = await loadActiveClientPayload();
        if (!payload) return null;

        const importedExternalId = String(externalId ?? "").trim();
        const nextPayload = { ...payload };
        if (importedExternalId) {
            nextPayload[IMPORTED_EXTERNAL_ID_KEY] = importedExternalId;
        } else {
            delete nextPayload[IMPORTED_EXTERNAL_ID_KEY];
        }

        await saveActiveClientPayload(nextPayload);
        dispatchActiveClientPayloadUpdated(nextPayload);
        return nextPayload;
    } catch (error) {
        console.error("saveImportedExternalId error", error);
        return null;
    }
}

export function clearActiveClientPayload() {
    return deleteJSON(ACTIVE_CLIENT_KEY);
}

export function clearStoredInputValues() {
    return clearTokenInputValues();
}
