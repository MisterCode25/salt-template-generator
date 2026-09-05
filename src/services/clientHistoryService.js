import {
    loadActiveClientPayload,
    saveActiveClientPayload
} from "./activeClientService.js";
import { loadJSON, saveJSON } from "./storageService.js";
import {
    clearSuperOfficeTicketPayload,
    isSameSuperOfficeClient,
    loadSuperOfficeTicketPayload,
    saveSuperOfficeTicketPayload
} from "./superOfficeTicketService.js";
import {
    loadTokenInputValues,
    saveTokenInputValues
} from "./tokenInputValueService.js";

const RECENT_CLIENT_HISTORY_KEY = "recent_client_history";
const OMIT_VALUE = Symbol("omit-history-value");

export const RECENT_CLIENT_HISTORY_LIMIT = 15;
export const RECENT_CLIENT_HISTORY_UPDATED_EVENT = "recent-client-history-updated";

let fallbackIdSequence = 0;

function createHistoryEntryId() {
    if (typeof globalThis.crypto?.randomUUID === "function") {
        return globalThis.crypto.randomUUID();
    }
    fallbackIdSequence += 1;
    return `recent-client-${Date.now()}-${fallbackIdSequence}`;
}

function isTransientMediaUrl(value) {
    return /^(?:blob|data):/i.test(String(value || "").trim());
}

function isBlobValue(value) {
    return typeof Blob !== "undefined" && value instanceof Blob;
}

function isBinaryValue(value) {
    if (isBlobValue(value)) return true;
    if (typeof ArrayBuffer === "undefined") return false;
    return value instanceof ArrayBuffer || ArrayBuffer.isView(value);
}

function shouldOmitProperty(key) {
    return /(?:base64|dataUrl)$/i.test(String(key || "")) || /^blob$/i.test(String(key || ""));
}

function isLikelyBase64Payload(value) {
    const compactValue = String(value || "").replace(/\s+/g, "");
    return compactValue.length >= 2048
        && compactValue.length % 4 === 0
        && /^[a-z0-9+/]+={0,2}$/i.test(compactValue);
}

function cloneHistoryValue(value, key = "", seen = new WeakSet()) {
    if (value === null) return null;
    if (value === undefined || typeof value === "function" || typeof value === "symbol") {
        return OMIT_VALUE;
    }
    if (isBinaryValue(value) || shouldOmitProperty(key)) return OMIT_VALUE;
    if (typeof value === "string") {
        return isTransientMediaUrl(value) || isLikelyBase64Payload(value) ? OMIT_VALUE : value;
    }
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "bigint") return String(value);
    if (value instanceof Date) return value.toISOString();
    if (typeof value !== "object") return OMIT_VALUE;
    if (seen.has(value)) return OMIT_VALUE;

    seen.add(value);
    if (Array.isArray(value)) {
        const clonedArray = value
            .map((entry) => cloneHistoryValue(entry, key, seen))
            .filter((entry) => entry !== OMIT_VALUE);
        seen.delete(value);
        return clonedArray;
    }

    const clonedObject = {};
    Object.entries(value).forEach(([property, propertyValue]) => {
        const clonedValue = cloneHistoryValue(propertyValue, property, seen);
        if (clonedValue !== OMIT_VALUE) clonedObject[property] = clonedValue;
    });
    seen.delete(value);
    return clonedObject;
}

function normalizedText(value) {
    return value === null || value === undefined ? "" : String(value).trim();
}

function isPersistentMediaUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function normalizeTokenValues(values) {
    if (!values || typeof values !== "object" || Array.isArray(values)) return {};
    return Object.fromEntries(
        Object.entries(values).map(([token, value]) => [
            token,
            value === null || value === undefined ? "" : String(value)
        ])
    );
}

function sanitizeAttachment(attachment) {
    if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) return null;

    const url = normalizedText(
        attachment.url || attachment.href || attachment.src || attachment.downloadUrl
    );
    if (!url || !isPersistentMediaUrl(url)) return null;

    const sanitized = cloneHistoryValue({
        id: attachment.id || attachment.attachmentId || attachment.documentId || "",
        name: attachment.name || attachment.filename || attachment.fileName || attachment.title || "",
        url,
        type: attachment.type || "",
        contentType: attachment.contentType || attachment.mimeType || "",
        size: attachment.size || attachment.sizeText || attachment.fileSize || "",
        messageId: attachment.messageId || attachment.messageID || attachment.postId || null,
        postId: attachment.postId || attachment.messageId || attachment.messageID || null,
        messageIndex: attachment.messageIndex ?? null,
        attachmentIndex: attachment.attachmentIndex ?? null,
        messageAuthor: attachment.messageAuthor || attachment.author || null,
        source: attachment.source || attachment.origin || null,
        date: attachment.date || attachment.messageDate || attachment.createdAt || null
    });
    return sanitized === OMIT_VALUE ? null : sanitized;
}

function sanitizeSuperOfficeTicket(ticket) {
    if (!ticket || typeof ticket !== "object" || Array.isArray(ticket)) return null;
    const sourceAttachments = Array.isArray(ticket.attachments)
        ? ticket.attachments
        : ticket.mediaAttachments || ticket.imageAttachments || [];

    return {
        ticketId: normalizedText(ticket.ticketId),
        sourceTicketId: normalizedText(ticket.sourceTicketId),
        createdAt: normalizedText(ticket.createdAt),
        firstPostAt: normalizedText(ticket.firstPostAt),
        externalTicketId: normalizedText(ticket.externalTicketId),
        importedAt: normalizedText(ticket.importedAt),
        tokenValues: normalizeTokenValues(ticket.tokenValues),
        attachments: sourceAttachments.map(sanitizeAttachment).filter(Boolean)
    };
}

function normalizeSavedAt(value, fallback = new Date()) {
    const date = value instanceof Date ? value : new Date(value || fallback);
    return Number.isNaN(date.getTime()) ? fallback.toISOString() : date.toISOString();
}

function normalizeHistoryEntry(entry) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const clientPayload = cloneHistoryValue(entry.clientPayload);
    if (!clientPayload || clientPayload === OMIT_VALUE || typeof clientPayload !== "object" || Array.isArray(clientPayload)) {
        return null;
    }

    return {
        id: normalizedText(entry.id) || createHistoryEntryId(),
        savedAt: normalizeSavedAt(entry.savedAt),
        clientPayload,
        tokenValues: normalizeTokenValues(entry.tokenValues),
        superOfficeTicket: sanitizeSuperOfficeTicket(entry.superOfficeTicket)
    };
}

function dispatchHistoryUpdated(entries) {
    if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") return;
    window.dispatchEvent(new CustomEvent(RECENT_CLIENT_HISTORY_UPDATED_EVENT, {
        detail: { entries }
    }));
}

async function saveRecentClientHistory(entries) {
    const normalizedEntries = entries
        .map(normalizeHistoryEntry)
        .filter(Boolean)
        .slice(0, RECENT_CLIENT_HISTORY_LIMIT);
    await saveJSON(RECENT_CLIENT_HISTORY_KEY, normalizedEntries);
    dispatchHistoryUpdated(normalizedEntries);
    return normalizedEntries;
}

function sameClient(left, right) {
    return isSameSuperOfficeClient(left?.clientPayload, right?.clientPayload);
}

async function buildActiveClientSnapshot(savedAt = new Date()) {
    const clientPayload = await loadActiveClientPayload();
    if (!clientPayload) return null;
    const [tokenValues, superOfficeTicket] = await Promise.all([
        loadTokenInputValues(),
        loadSuperOfficeTicketPayload()
    ]);
    return normalizeHistoryEntry({
        id: createHistoryEntryId(),
        savedAt,
        clientPayload,
        tokenValues,
        superOfficeTicket
    });
}

export async function loadRecentClientHistory() {
    const storedEntries = await loadJSON(RECENT_CLIENT_HISTORY_KEY, []);
    if (!Array.isArray(storedEntries)) return [];
    return storedEntries
        .map(normalizeHistoryEntry)
        .filter(Boolean)
        .slice(0, RECENT_CLIENT_HISTORY_LIMIT);
}

export async function recordRecentClientSnapshot(snapshot) {
    const nextEntry = normalizeHistoryEntry({
        ...snapshot,
        id: snapshot?.id || createHistoryEntryId()
    });
    if (!nextEntry) return loadRecentClientHistory();

    const currentEntries = await loadRecentClientHistory();
    const existingEntry = currentEntries.find((entry) => sameClient(entry, nextEntry));
    const entry = existingEntry ? { ...nextEntry, id: existingEntry.id } : nextEntry;
    return saveRecentClientHistory([
        entry,
        ...currentEntries.filter((candidate) => !sameClient(candidate, entry))
    ]);
}

export async function archiveActiveClientSnapshot(savedAt = new Date()) {
    const snapshot = await buildActiveClientSnapshot(savedAt);
    if (!snapshot) return loadRecentClientHistory();
    return recordRecentClientSnapshot(snapshot);
}

export async function restoreRecentClientSnapshot(entryId, switchedAt = new Date()) {
    const entries = await loadRecentClientHistory();
    const targetEntry = entries.find((entry) => entry.id === entryId);
    if (!targetEntry) return null;

    const activeEntry = await buildActiveClientSnapshot(switchedAt);

    await clearSuperOfficeTicketPayload();
    await saveActiveClientPayload(targetEntry.clientPayload);
    await saveTokenInputValues(targetEntry.tokenValues);
    if (targetEntry.superOfficeTicket) {
        await saveSuperOfficeTicketPayload(targetEntry.superOfficeTicket);
    }

    let nextEntries = entries.filter((entry) => entry.id !== targetEntry.id);
    if (activeEntry && !sameClient(activeEntry, targetEntry)) {
        const existingActiveEntry = nextEntries.find((entry) => sameClient(entry, activeEntry));
        const entryToArchive = existingActiveEntry
            ? { ...activeEntry, id: existingActiveEntry.id }
            : activeEntry;
        nextEntries = [
            entryToArchive,
            ...nextEntries.filter((entry) => !sameClient(entry, entryToArchive))
        ];
    }
    await saveRecentClientHistory(nextEntries);
    return targetEntry;
}
