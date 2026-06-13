import {
    getSuperOfficeImageAttachments,
    normalizeSuperOfficeAttachments
} from "../utils/superOfficeImport.js";
import {
    MANUAL_CLIENT_INPUTS_KEY,
    loadActiveClientPayload
} from "./activeClientService.js";

const SUPER_OFFICE_TICKET_KEY = "super_office_ticket_payload";
const LOCAL_SUPER_OFFICE_TICKET_KEY = `local_${SUPER_OFFICE_TICKET_KEY}`;
const PENDING_SUPER_OFFICE_TICKET_KEY = "pending_super_office_ticket_payload";
const LOCAL_PENDING_SUPER_OFFICE_TICKET_KEY = `local_${PENDING_SUPER_OFFICE_TICKET_KEY}`;

export const SUPER_OFFICE_TICKET_UPDATED_EVENT = "super-office-ticket-updated";

function stripManualClientInputs(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return payload;
    const { [MANUAL_CLIENT_INPUTS_KEY]: _manualInputs, ...clientIdentityPayload } = payload;
    return clientIdentityPayload;
}

function stableStringify(value) {
    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(",")}]`;
    }
    if (value && typeof value === "object") {
        return `{${Object.keys(value)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
            .join(",")}}`;
    }
    return JSON.stringify(value);
}

export function getSuperOfficeClientSignature(payload = loadActiveClientPayload()) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "";

    try {
        return stableStringify(stripManualClientInputs(payload));
    } catch {
        return "";
    }
}

function dispatchSuperOfficeTicketUpdated(payload) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(SUPER_OFFICE_TICKET_UPDATED_EVENT, {
        detail: { payload }
    }));
}

function normalizeStoredTicketPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;

    const attachments = normalizeSuperOfficeAttachments(payload.attachments);
    const clientSignature = String(payload.clientSignature || "").trim();
    const tokenValues = payload.tokenValues && typeof payload.tokenValues === "object" && !Array.isArray(payload.tokenValues)
        ? Object.fromEntries(
            Object.entries(payload.tokenValues).map(([key, value]) => [key, value === null || value === undefined ? "" : String(value)])
        )
        : {};
    return {
        ticketId: String(payload.ticketId || "").trim(),
        sourceTicketId: String(payload.sourceTicketId || "").trim(),
        externalTicketId: String(payload.externalTicketId || "").trim(),
        importedAt: payload.importedAt || new Date().toISOString(),
        clientSignature,
        tokenValues,
        attachments,
        imageAttachments: getSuperOfficeImageAttachments(attachments)
    };
}

export function buildSuperOfficeTicketPayload(importResult, importedAt = new Date(), clientSignature = getSuperOfficeClientSignature()) {
    return normalizeStoredTicketPayload({
        ticketId: importResult?.ticketId || "",
        sourceTicketId: importResult?.sourceTicketId || "",
        externalTicketId: importResult?.externalTicketId || "",
        importedAt: importedAt.toISOString(),
        clientSignature,
        tokenValues: importResult?.tokenValues || {},
        attachments: importResult?.attachments || []
    });
}

function saveStoredPayload(payload, storage = globalThis.localStorage) {
    if (!payload || !storage) return;

    const serialized = JSON.stringify(payload);
    storage.setItem(LOCAL_SUPER_OFFICE_TICKET_KEY, serialized);
    storage.setItem(SUPER_OFFICE_TICKET_KEY, serialized);
}

function savePendingPayload(payload, storage = globalThis.localStorage) {
    if (!payload || !storage) return;

    const serialized = JSON.stringify(payload);
    storage.setItem(LOCAL_PENDING_SUPER_OFFICE_TICKET_KEY, serialized);
    storage.setItem(PENDING_SUPER_OFFICE_TICKET_KEY, serialized);
}

function loadPendingPayload(storage = globalThis.localStorage) {
    if (!storage) return null;

    try {
        const raw = storage.getItem(LOCAL_PENDING_SUPER_OFFICE_TICKET_KEY) || storage.getItem(PENDING_SUPER_OFFICE_TICKET_KEY);
        if (!raw) return null;
        return normalizeStoredTicketPayload(JSON.parse(raw));
    } catch (error) {
        console.error("loadPendingSuperOfficeTicketPayload error", error);
        return null;
    }
}

export function loadPendingSuperOfficeTicketPayload(storage = globalThis.localStorage) {
    return loadPendingPayload(storage);
}

export function hasSuperOfficeTicketPayload(storage = globalThis.localStorage) {
    return Boolean(loadSuperOfficeTicketPayload(storage) || loadPendingPayload(storage));
}

function removePendingPayload(storage = globalThis.localStorage) {
    storage?.removeItem(LOCAL_PENDING_SUPER_OFFICE_TICKET_KEY);
    storage?.removeItem(PENDING_SUPER_OFFICE_TICKET_KEY);
}

export function saveSuperOfficeTicketPayload(importResult, storage = globalThis.localStorage) {
    const payload = buildSuperOfficeTicketPayload(importResult);
    if (!payload) return null;

    if (!payload.clientSignature) {
        removeStoredSuperOfficeTicketPayload(storage);
        savePendingPayload(payload, storage);
        dispatchSuperOfficeTicketUpdated(null);
        return payload;
    }

    saveStoredPayload(payload, storage);
    removePendingPayload(storage);
    dispatchSuperOfficeTicketUpdated(payload);
    return payload;
}

function removeStoredSuperOfficeTicketPayload(storage = globalThis.localStorage) {
    storage?.removeItem(LOCAL_SUPER_OFFICE_TICKET_KEY);
    storage?.removeItem(SUPER_OFFICE_TICKET_KEY);
}

export function consumePendingSuperOfficeTicketPayload(storage = globalThis.localStorage) {
    const pendingPayload = loadPendingPayload(storage);
    const clientSignature = getSuperOfficeClientSignature();
    if (!pendingPayload || !clientSignature) return null;

    const payload = {
        ...pendingPayload,
        clientSignature
    };
    saveStoredPayload(payload, storage);
    removePendingPayload(storage);
    dispatchSuperOfficeTicketUpdated(payload);
    return payload;
}

export function loadSuperOfficeTicketPayload(storage = globalThis.localStorage) {
    if (!storage) return null;

    try {
        const raw = storage.getItem(LOCAL_SUPER_OFFICE_TICKET_KEY) || storage.getItem(SUPER_OFFICE_TICKET_KEY);
        if (!raw) return null;

        const activeClientSignature = getSuperOfficeClientSignature();
        if (!activeClientSignature) {
            removeStoredSuperOfficeTicketPayload(storage);
            return null;
        }

        const parsed = JSON.parse(raw);
        if (parsed?.clientSignature !== activeClientSignature) {
            removeStoredSuperOfficeTicketPayload(storage);
            return null;
        }

        const payload = normalizeStoredTicketPayload(parsed);
        if (!payload) return null;

        return payload;
    } catch (error) {
        console.error("loadSuperOfficeTicketPayload error", error);
        return null;
    }
}

export function clearSuperOfficeTicketPayload(storage = globalThis.localStorage) {
    removeStoredSuperOfficeTicketPayload(storage);
    removePendingPayload(storage);
    dispatchSuperOfficeTicketUpdated(null);
}
