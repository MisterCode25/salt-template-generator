import {
    getSuperOfficeImageAttachments,
    getSuperOfficeMediaAttachments,
    normalizeSuperOfficeAttachments
} from "../utils/superOfficeImport.js";
import {
    buildExternalTokenValues,
    getValidExternalId,
    parseExternalId
} from "../utils/externalGenerator.js";
import {
    IMPORTED_EXTERNAL_ID_KEY,
    MANUAL_CLIENT_INPUTS_KEY,
    loadActiveClientPayload
} from "./activeClientService.js";
import { deleteJSON, loadJSON, saveJSON } from "./storageService.js";

const SUPER_OFFICE_TICKET_KEY = "super_office_ticket_payload";
const PENDING_SUPER_OFFICE_TICKET_KEY = "pending_super_office_ticket_payload";
const PREVIOUS_SUPER_OFFICE_TICKET_KEY = "previous_super_office_ticket_payload";

export const SUPER_OFFICE_TICKET_UPDATED_EVENT = "super-office-ticket-updated";

function stripManualClientInputs(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return payload;
    const {
        [MANUAL_CLIENT_INPUTS_KEY]: _manualInputs,
        [IMPORTED_EXTERNAL_ID_KEY]: _importedExternalId,
        ...clientIdentityPayload
    } = payload;
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

export function getSuperOfficeClientSignature(payload = null) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "";

    try {
        return stableStringify(stripManualClientInputs(payload));
    } catch {
        return "";
    }
}

const CLIENT_IDENTITY_KEYS = new Set([
    "billingaccount",
    "contractornumber",
    "customerid",
    "publicid",
    "contactrecordid"
]);

function collectClientIdentityValues(value, result = new Map()) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return result;
    Object.entries(value).forEach(([key, nestedValue]) => {
        if (key.startsWith("__")) return;
        const normalizedKey = key.replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (CLIENT_IDENTITY_KEYS.has(normalizedKey)) {
            const normalizedValue = String(nestedValue ?? "").trim().toLowerCase();
            if (normalizedValue) result.set(normalizedKey, normalizedValue);
            return;
        }
        if (nestedValue && typeof nestedValue === "object") {
            collectClientIdentityValues(nestedValue, result);
        }
    });
    return result;
}

export function isSameSuperOfficeClient(currentPayload, nextPayload) {
    const currentIdentity = collectClientIdentityValues(currentPayload);
    const nextIdentity = collectClientIdentityValues(nextPayload);
    for (const [key, value] of currentIdentity) {
        if (nextIdentity.get(key) === value) return true;
    }
    return getSuperOfficeClientSignature(currentPayload) === getSuperOfficeClientSignature(nextPayload);
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
        createdAt: String(payload.createdAt || payload.created || payload.createdDate || "").trim(),
        firstPostAt: String(payload.firstPostAt || payload.firstPostDate || payload.firstMessageAt || "").trim(),
        externalTicketId: String(payload.externalTicketId || "").trim(),
        importedAt: payload.importedAt || new Date().toISOString(),
        clientSignature,
        tokenValues,
        attachments,
        imageAttachments: getSuperOfficeImageAttachments(attachments),
        mediaAttachments: getSuperOfficeMediaAttachments(attachments)
    };
}

export function buildSuperOfficeTicketPayload(importResult, importedAt = new Date(), clientSignature = "") {
    return normalizeStoredTicketPayload({
        ticketId: importResult?.ticketId || "",
        sourceTicketId: importResult?.sourceTicketId || "",
        createdAt: importResult?.createdAt || "",
        firstPostAt: importResult?.firstPostAt || "",
        externalTicketId: importResult?.externalTicketId || "",
        importedAt: importedAt.toISOString(),
        clientSignature,
        tokenValues: importResult?.tokenValues || {},
        attachments: importResult?.attachments || []
    });
}

async function saveStoredPayload(payload) {
    if (!payload) return;
    await saveJSON(SUPER_OFFICE_TICKET_KEY, payload);
}

async function savePreviousPayload(payload) {
    if (!payload) return;
    await saveJSON(PREVIOUS_SUPER_OFFICE_TICKET_KEY, payload);
}

async function savePendingPayload(payload) {
    if (!payload) return;
    await saveJSON(PENDING_SUPER_OFFICE_TICKET_KEY, payload);
}

async function loadPendingPayload() {
    try {
        return normalizeStoredTicketPayload(await loadJSON(PENDING_SUPER_OFFICE_TICKET_KEY, null));
    } catch (error) {
        console.error("loadPendingSuperOfficeTicketPayload error", error);
        return null;
    }
}

export function loadPendingSuperOfficeTicketPayload() {
    return loadPendingPayload();
}

export async function loadDisplaySuperOfficeTicketPayload() {
    return await loadSuperOfficeTicketPayload() || await loadPendingPayload();
}

export async function hasSuperOfficeTicketPayload() {
    return Boolean(await loadDisplaySuperOfficeTicketPayload());
}

function removePendingPayload() {
    return deleteJSON(PENDING_SUPER_OFFICE_TICKET_KEY);
}

function removePreviousPayload() {
    return deleteJSON(PREVIOUS_SUPER_OFFICE_TICKET_KEY);
}

export async function saveSuperOfficeTicketPayload(importResult) {
    const activeClientPayload = await loadActiveClientPayload();
    const payload = buildSuperOfficeTicketPayload(
        importResult,
        new Date(),
        getSuperOfficeClientSignature(activeClientPayload)
    );
    if (!payload) return null;

    if (!payload.clientSignature) {
        await removeStoredSuperOfficeTicketPayload();
        await savePendingPayload(payload);
        dispatchSuperOfficeTicketUpdated(null);
        return payload;
    }

    const currentPayload = normalizeStoredTicketPayload(await loadJSON(SUPER_OFFICE_TICKET_KEY, null));
    const currentTicketId = currentPayload?.ticketId || currentPayload?.sourceTicketId || "";
    const nextTicketId = payload.ticketId || payload.sourceTicketId || "";
    if (
        currentPayload?.clientSignature === payload.clientSignature
        && currentTicketId
        && nextTicketId
        && currentTicketId !== nextTicketId
    ) {
        await savePreviousPayload(currentPayload);
    }
    await saveStoredPayload(payload);
    await removePendingPayload();
    dispatchSuperOfficeTicketUpdated(payload);
    return payload;
}

export async function saveDisplaySuperOfficeExternalId(externalId) {
    const validExternalId = getValidExternalId(externalId);
    if (!validExternalId) return null;

    const storedPayload = await loadSuperOfficeTicketPayload();
    const pendingPayload = storedPayload ? null : await loadPendingPayload();
    const currentPayload = storedPayload || pendingPayload;
    if (!currentPayload) return null;

    const parsed = parseExternalId(validExternalId);
    const nextTokenValues = parsed.ok
        ? {
            ...(currentPayload.tokenValues || {}),
            ...buildExternalTokenValues(parsed.fields)
        }
        : currentPayload.tokenValues || {};
    const nextPayload = normalizeStoredTicketPayload({
        ...currentPayload,
        externalTicketId: validExternalId,
        tokenValues: nextTokenValues
    });
    if (!nextPayload) return null;

    if (nextPayload.clientSignature) {
        await saveStoredPayload(nextPayload);
    } else {
        await savePendingPayload(nextPayload);
    }
    dispatchSuperOfficeTicketUpdated(nextPayload);
    return nextPayload;
}

function removeStoredSuperOfficeTicketPayload() {
    return deleteJSON(SUPER_OFFICE_TICKET_KEY);
}

export async function consumePendingSuperOfficeTicketPayload() {
    const pendingPayload = await loadPendingPayload();
    const clientSignature = getSuperOfficeClientSignature(await loadActiveClientPayload());
    if (!pendingPayload || !clientSignature) return null;

    const payload = {
        ...pendingPayload,
        clientSignature
    };
    await saveStoredPayload(payload);
    await removePendingPayload();
    dispatchSuperOfficeTicketUpdated(payload);
    return payload;
}

export async function loadSuperOfficeTicketPayload() {
    try {
        const storedPayload = await loadJSON(SUPER_OFFICE_TICKET_KEY, null);
        if (!storedPayload) return null;

        const activeClientSignature = getSuperOfficeClientSignature(await loadActiveClientPayload());
        if (!activeClientSignature) {
            await removeStoredSuperOfficeTicketPayload();
            await removePreviousPayload();
            return null;
        }

        if (storedPayload?.clientSignature !== activeClientSignature) {
            await removeStoredSuperOfficeTicketPayload();
            await removePreviousPayload();
            return null;
        }

        const payload = normalizeStoredTicketPayload(storedPayload);
        if (!payload) return null;

        return payload;
    } catch (error) {
        console.error("loadSuperOfficeTicketPayload error", error);
        return null;
    }
}

export async function loadPreviousSuperOfficeTicketPayload() {
    try {
        const previousPayload = normalizeStoredTicketPayload(
            await loadJSON(PREVIOUS_SUPER_OFFICE_TICKET_KEY, null)
        );
        if (!previousPayload) return null;

        const activeClientSignature = getSuperOfficeClientSignature(await loadActiveClientPayload());
        if (!activeClientSignature || previousPayload.clientSignature !== activeClientSignature) {
            await removePreviousPayload();
            return null;
        }
        return previousPayload;
    } catch (error) {
        console.error("loadPreviousSuperOfficeTicketPayload error", error);
        return null;
    }
}

export async function rebindSuperOfficeTicketsToActiveClient() {
    const clientSignature = getSuperOfficeClientSignature(await loadActiveClientPayload());
    if (!clientSignature) return false;

    const currentPayload = normalizeStoredTicketPayload(await loadJSON(SUPER_OFFICE_TICKET_KEY, null));
    const previousPayload = normalizeStoredTicketPayload(await loadJSON(PREVIOUS_SUPER_OFFICE_TICKET_KEY, null));
    await Promise.all([
        currentPayload
            ? saveStoredPayload({ ...currentPayload, clientSignature })
            : Promise.resolve(),
        previousPayload
            ? savePreviousPayload({ ...previousPayload, clientSignature })
            : Promise.resolve()
    ]);
    return Boolean(currentPayload || previousPayload);
}

export async function clearSuperOfficeTicketPayload() {
    await removeStoredSuperOfficeTicketPayload();
    await removePendingPayload();
    await removePreviousPayload();
    dispatchSuperOfficeTicketUpdated(null);
}
