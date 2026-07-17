import { canonicalizeInputTokenValue, SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";
import { buildExternalTokenValues, parseExternalId } from "./externalGenerator.js";

const IMAGE_ATTACHMENT_PATTERN = /\.(jpe?g|jfif|pjpe?g|png|webp|gif|bmp|avif|heic|heif|hif|tiff?|ico|svg)(?:$|[?#])/i;
const VIDEO_ATTACHMENT_PATTERN = /\.(mp4|mov)(?:$|[?#])/i;
const PDF_ATTACHMENT_PATTERN = /\.pdf(?:$|[?#])/i;
const CONTRACTOR_TOKENS = ["{contractor}", "{contractor_number}", "{client_contractor_number}"];

function valueOf(...values) {
    for (const value of values) {
        const text = String(value ?? "").trim();
        if (text) return text;
    }
    return "";
}

function parsePayload(input) {
    if (input && typeof input === "object" && !Array.isArray(input)) return input;
    if (typeof input !== "string") return null;

    try {
        const parsed = JSON.parse(input);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function extensionTypeFor(name = "", url = "") {
    const source = `${name} ${url}`;
    if (IMAGE_ATTACHMENT_PATTERN.test(source)) return "image";
    if (VIDEO_ATTACHMENT_PATTERN.test(source)) return "video";
    if (PDF_ATTACHMENT_PATTERN.test(source)) return "pdf";
    return "file";
}

function isImageAttachmentType(value = "") {
    const type = String(value || "").trim().toLowerCase();
    return type === "image" || type.startsWith("image/");
}

function isVideoAttachmentType(value = "") {
    const type = String(value || "").trim().toLowerCase();
    return type === "video" || type === "mp4" || type === "mov" || type.startsWith("video/");
}

function isPdfAttachmentType(value = "") {
    const type = String(value || "").trim().toLowerCase();
    return type === "pdf" || type === "application/pdf";
}

function declaredAttachmentTypeFor(...values) {
    for (const value of values) {
        if (isImageAttachmentType(value)) return "image";
        if (isVideoAttachmentType(value)) return "video";
        if (isPdfAttachmentType(value)) return "pdf";
    }
    return "";
}

function attachmentContentTypeFor(...values) {
    for (const value of values) {
        const text = valueOf(value);
        const type = text.toLowerCase();
        if (!type) continue;
        if (type.includes("/")) return text;
        if (type === "pdf") return "application/pdf";
        if (type === "mp4") return "video/mp4";
        if (type === "mov") return "video/quicktime";
    }
    return "";
}

function getAttachmentDateValue(attachment = {}) {
    return valueOf(
        attachment.date,
        attachment.messageDate,
        attachment.messageDateTime,
        attachment.createdAt,
        attachment.created,
        attachment.sentAt,
        attachment.receivedAt,
        attachment.timestamp,
        attachment.message?.date,
        attachment.message?.createdAt,
        attachment.message?.sentAt
    ) || null;
}

function normalizeOptionalInteger(value) {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : null;
}

function normalizeAttachment(attachment, index) {
    if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) return null;

    const url = valueOf(attachment.url, attachment.href, attachment.src, attachment.downloadUrl);
    if (!url) return null;

    const name = valueOf(
        attachment.name,
        attachment.filename,
        attachment.fileName,
        attachment.title,
        decodeURIComponent(String(url).split("/").pop()?.split("?")[0] || "")
    ) || `Attachment ${index + 1}`;
    const declaredType = valueOf(attachment.type, attachment.contentType, attachment.mimeType);
    const contentType = attachmentContentTypeFor(
        attachment.contentType,
        attachment.mimeType,
        attachment.type,
        attachment.mediaType
    );
    const type = declaredAttachmentTypeFor(
        attachment.type,
        attachment.contentType,
        attachment.mimeType,
        attachment.mediaType
    ) || extensionTypeFor(name, url);
    const messageId = valueOf(attachment.messageId, attachment.messageID, attachment.postId, attachment.message?.id) || null;

    return {
        id: valueOf(attachment.id, attachment.attachmentId, attachment.documentId) || `${index}-${name}-${url}`,
        name,
        url,
        type,
        contentType: contentType || declaredType || null,
        size: valueOf(attachment.size, attachment.sizeText, attachment.fileSize) || null,
        messageId,
        postId: valueOf(attachment.postId, messageId) || null,
        messageIndex: normalizeOptionalInteger(valueOf(
            attachment.messageIndex,
            attachment.messageOrder,
            attachment.postIndex,
            attachment.message?.index
        )),
        attachmentIndex: normalizeOptionalInteger(valueOf(attachment.attachmentIndex, attachment.fileIndex)),
        messageAuthor: valueOf(
            attachment.messageAuthor,
            attachment.author,
            attachment.createdBy,
            attachment.message?.author,
            attachment.message?.createdBy
        ) || null,
        source: valueOf(attachment.source, attachment.origin) || null,
        date: getAttachmentDateValue(attachment)
    };
}

function padDatePart(value) {
    return String(value).padStart(2, "0");
}

function buildDateMeta(date) {
    const year = date.getFullYear();
    const month = padDatePart(date.getMonth() + 1);
    const day = padDatePart(date.getDate());
    const dateKey = `${year}-${month}-${day}`;
    return {
        dateKey,
        label: `${day}.${month}.${year}`,
        sortValue: new Date(year, date.getMonth(), date.getDate()).getTime()
    };
}

function buildValidDate(year, monthIndex, day, hours = 0, minutes = 0, seconds = 0) {
    if (monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) return null;
    const date = new Date(year, monthIndex, day, hours, minutes, seconds);
    if (
        date.getFullYear() !== year
        || date.getMonth() !== monthIndex
        || date.getDate() !== day
    ) return null;
    return date;
}

function parseAttachmentDate(value) {
    if (value === null || value === undefined || value === "") return null;

    if (typeof value === "number" && Number.isFinite(value)) {
        const numericDate = new Date(value);
        return Number.isNaN(numericDate.getTime()) ? null : numericDate;
    }

    const text = String(value).trim();
    if (!text) return null;

    const ymd = text.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);
    if (ymd) {
        const date = buildValidDate(
            Number(ymd[1]),
            Number(ymd[2]) - 1,
            Number(ymd[3]),
            Number(ymd[4] || 0),
            Number(ymd[5] || 0),
            Number(ymd[6] || 0)
        );
        if (date) return date;
    }

    const localDate = text.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);
    if (localDate) {
        const first = Number(localDate[1]);
        const separator = localDate[2];
        const second = Number(localDate[3]);
        const rawYear = Number(localDate[4]);
        const year = rawYear < 100 ? 2000 + rawYear : rawYear;
        const hours = Number(localDate[5] || 0);
        const minutes = Number(localDate[6] || 0);
        const seconds = Number(localDate[7] || 0);
        const monthFirst = separator === "/" && second > 12 && first <= 12;
        const day = monthFirst ? second : first;
        const month = (monthFirst ? first : second) - 1;
        const date = buildValidDate(year, month, day, hours, minutes, seconds);
        if (date) return date;
    }

    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getAttachmentDateMeta(attachment = {}) {
    const date = parseAttachmentDate(attachment.date);
    return date ? buildDateMeta(date) : {
        dateKey: "unknown",
        label: "Date non disponible",
        sortValue: Number.NEGATIVE_INFINITY
    };
}

function assignContractorTokenValues(tokenValues, contractorNumber) {
    const text = valueOf(contractorNumber);
    if (!text) return;
    CONTRACTOR_TOKENS.forEach((token) => {
        tokenValues[token] = text;
    });
}

function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function addTokenValueEntry(entries, rawName, rawValue) {
    const token = canonicalizeInputTokenValue(rawName);
    const value = valueOf(rawValue);
    if (!token || !value) return;
    entries.push([token, value]);
}

function collectTokenValueEntries(source, path = []) {
    const entries = [];
    if (!isPlainObject(source)) return entries;

    Object.entries(source).forEach(([key, value]) => {
        if (isPlainObject(value)) {
            entries.push(...collectTokenValueEntries(value, [...path, key]));
            return;
        }
        addTokenValueEntry(entries, [...path, key].join("."), value);
    });

    return entries;
}

function getExplicitSuperOfficeTokenValues(payload = {}) {
    const explicitValues = {};
    ["tokenValues", "values", "variables", "fields"].forEach((containerKey) => {
        collectTokenValueEntries(payload[containerKey]).forEach(([token, value]) => {
            explicitValues[token] = value;
        });
    });
    return explicitValues;
}

export function normalizeSuperOfficeAttachments(attachments = []) {
    if (!Array.isArray(attachments)) return [];

    const seen = new Set();
    return attachments
        .map(normalizeAttachment)
        .filter(Boolean)
        .filter((attachment) => {
            const key = `${attachment.name}|${attachment.url}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

export function getSuperOfficeImageAttachments(attachments = []) {
    return normalizeSuperOfficeAttachments(attachments).filter((attachment) => attachment.type === "image");
}

export function getSuperOfficeMediaAttachments(attachments = []) {
    return normalizeSuperOfficeAttachments(attachments)
        .filter((attachment) => ["image", "video", "pdf"].includes(attachment.type));
}

function groupAttachmentsByDate(attachments = []) {
    const groups = new Map();
    attachments.forEach((attachment, index) => {
        const meta = getAttachmentDateMeta(attachment);
        if (!groups.has(meta.dateKey)) {
            groups.set(meta.dateKey, {
                ...meta,
                attachments: []
            });
        }
        groups.get(meta.dateKey).attachments.push({ ...attachment, galleryIndex: index });
    });

    return Array.from(groups.values())
        .sort((a, b) => b.sortValue - a.sortValue);
}

export function groupSuperOfficeImageAttachmentsByDate(attachments = []) {
    return groupAttachmentsByDate(getSuperOfficeImageAttachments(attachments));
}

export function groupSuperOfficeMediaAttachmentsByDate(attachments = []) {
    return groupAttachmentsByDate(getSuperOfficeMediaAttachments(attachments));
}

function getAttachmentPostKey(attachment = {}) {
    return valueOf(attachment.postId, attachment.messageId, attachment.messageID, attachment.message?.id);
}

function buildPostGroupLabel(attachment = {}, fallbackIndex = 0) {
    const messageNumber = normalizeOptionalInteger(attachment.messageNumber);
    const messageIndex = normalizeOptionalInteger(attachment.messageIndex);
    const postNumber = messageNumber || (messageIndex === null ? fallbackIndex + 1 : messageIndex + 1);
    return `Post ${postNumber}`;
}

function buildPostGroupMetaLabel(attachment = {}) {
    const meta = getAttachmentDateMeta(attachment);
    const author = valueOf(attachment.messageAuthor);
    if (meta.dateKey === "unknown") return author;
    return [meta.label, author].filter(Boolean).join(" · ");
}

export function groupSuperOfficeImageAttachmentsByPost(attachments = []) {
    const images = getSuperOfficeImageAttachments(attachments);
    if (!images.some((attachment) => getAttachmentPostKey(attachment))) {
        return groupAttachmentsByDate(images);
    }

    const groups = new Map();
    images.forEach((attachment, index) => {
        const postKey = getAttachmentPostKey(attachment);
        const dateMeta = getAttachmentDateMeta(attachment);
        const groupKey = postKey || `unassigned:${dateMeta.dateKey}`;
        if (!groups.has(groupKey)) {
            const fallbackIndex = groups.size;
            groups.set(groupKey, {
                dateKey: groupKey,
                label: postKey ? buildPostGroupLabel(attachment, fallbackIndex) : dateMeta.label,
                metaLabel: postKey ? buildPostGroupMetaLabel(attachment) : "",
                sortValue: normalizeOptionalInteger(attachment.messageIndex) ?? index,
                attachments: []
            });
        }
        groups.get(groupKey).attachments.push({ ...attachment, galleryIndex: index });
    });

    return Array.from(groups.values())
        .sort((a, b) => a.sortValue - b.sortValue);
}

export function groupSuperOfficeMediaAttachmentsByPost(attachments = []) {
    const media = getSuperOfficeMediaAttachments(attachments);
    if (!media.some((attachment) => getAttachmentPostKey(attachment))) {
        return groupAttachmentsByDate(media);
    }

    const groups = new Map();
    media.forEach((attachment, index) => {
        const postKey = getAttachmentPostKey(attachment);
        const dateMeta = getAttachmentDateMeta(attachment);
        const groupKey = postKey || `unassigned:${dateMeta.dateKey}`;
        if (!groups.has(groupKey)) {
            const fallbackIndex = groups.size;
            groups.set(groupKey, {
                dateKey: groupKey,
                label: postKey ? buildPostGroupLabel(attachment, fallbackIndex) : dateMeta.label,
                metaLabel: postKey ? buildPostGroupMetaLabel(attachment) : "",
                sortValue: normalizeOptionalInteger(attachment.messageIndex) ?? index,
                attachments: []
            });
        }
        groups.get(groupKey).attachments.push({ ...attachment, galleryIndex: index });
    });

    return Array.from(groups.values())
        .sort((a, b) => a.sortValue - b.sortValue);
}

export function parseSuperOfficeInfoPayload(input) {
    const payload = parsePayload(input);
    if (!payload) {
        return { ok: false, error: "INVALID_SUPER_OFFICE_JSON" };
    }

    const sourceTicketId = valueOf(
        payload.ticketId,
        payload.soTicket,
        payload.soTicketNumber,
        payload.ticketNumber
    );
    const createdAt = valueOf(
        payload.createdAt,
        payload.created,
        payload.createdDate,
        payload.ticketCreatedAt,
        payload.ticketCreatedDate
    );
    const externalTicketId = valueOf(
        payload.externalTicketId,
        payload.externalId,
        payload.externalID,
        payload.hcampExternalId
    );
    const payloadContractorNumber = valueOf(
        payload.contractorNumber,
        payload.contractor,
        payload.contractorNo,
        payload.customerId,
        payload.customer,
        payload.client?.contractorNumber,
        payload.client?.contractor
    );
    const tokenValues = {};
    let externalFields = null;
    let externalIdValid = false;
    const attachments = normalizeSuperOfficeAttachments(payload.attachments);
    const imageAttachments = getSuperOfficeImageAttachments(attachments);
    const mediaAttachments = getSuperOfficeMediaAttachments(attachments);

    if (externalTicketId) {
        const parsedExternalId = parseExternalId(externalTicketId);
        if (parsedExternalId.ok) {
            externalIdValid = true;
            externalFields = parsedExternalId.fields;
            Object.assign(tokenValues, buildExternalTokenValues(parsedExternalId.fields));
        }
    }

    Object.assign(tokenValues, getExplicitSuperOfficeTokenValues(payload));

    const contractorNumber = externalFields?.customer || payloadContractorNumber;
    if (contractorNumber && (externalIdValid || sourceTicketId || attachments.length > 0)) {
        assignContractorTokenValues(tokenValues, contractorNumber);
    }

    const soTicket = sourceTicketId || externalFields?.soTicket || "";
    if (soTicket) {
        tokenValues[SO_TICKET_NUM_TOKEN] = soTicket;
    }

    if (Object.keys(tokenValues).length === 0 && attachments.length === 0) {
        return {
            ok: false,
            error: "EMPTY_SUPER_OFFICE_DATA",
            externalIdValid,
            externalTicketId
        };
    }

    return {
        ok: true,
        ticketId: soTicket,
        sourceTicketId,
        createdAt,
        externalTicketId,
        contractorNumber,
        externalIdValid,
        externalFields,
        tokenValues,
        attachments,
        imageAttachments,
        mediaAttachments,
        ignoredExternalId: Boolean(externalTicketId && !externalIdValid)
    };
}
