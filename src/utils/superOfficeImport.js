import { SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";
import { buildExternalTokenValues, parseExternalId } from "./externalGenerator.js";

const IMAGE_ATTACHMENT_PATTERN = /\.(jpe?g|png|webp|gif|bmp|avif)(?:$|[?#])/i;
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
    if (PDF_ATTACHMENT_PATTERN.test(source)) return "pdf";
    return "file";
}

function isImageAttachmentType(value = "") {
    const type = String(value || "").trim().toLowerCase();
    return type === "image" || type.startsWith("image/");
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
    const type = isImageAttachmentType(declaredType) ? "image" : extensionTypeFor(name, url);

    return {
        id: valueOf(attachment.id, attachment.attachmentId, attachment.documentId) || `${index}-${name}-${url}`,
        name,
        url,
        type,
        size: valueOf(attachment.size, attachment.sizeText, attachment.fileSize) || null,
        messageId: valueOf(attachment.messageId, attachment.messageID, attachment.message?.id) || null,
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

function parseAttachmentDate(value) {
    if (value === null || value === undefined || value === "") return null;

    if (typeof value === "number" && Number.isFinite(value)) {
        const numericDate = new Date(value);
        return Number.isNaN(numericDate.getTime()) ? null : numericDate;
    }

    const text = String(value).trim();
    if (!text) return null;

    const dmy = text.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b/);
    if (dmy) {
        const day = Number(dmy[1]);
        const month = Number(dmy[2]) - 1;
        const rawYear = Number(dmy[3]);
        const year = rawYear < 100 ? 2000 + rawYear : rawYear;
        const date = new Date(year, month, day);
        if (!Number.isNaN(date.getTime())) return date;
    }

    const ymd = text.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})\b/);
    if (ymd) {
        const date = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
        if (!Number.isNaN(date.getTime())) return date;
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

export function groupSuperOfficeImageAttachmentsByDate(attachments = []) {
    const groups = new Map();
    getSuperOfficeImageAttachments(attachments).forEach((attachment, index) => {
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

    if (externalTicketId) {
        const parsedExternalId = parseExternalId(externalTicketId);
        if (parsedExternalId.ok) {
            externalIdValid = true;
            externalFields = parsedExternalId.fields;
            Object.assign(tokenValues, buildExternalTokenValues(parsedExternalId.fields));
        }
    }

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
        ignoredExternalId: Boolean(externalTicketId && !externalIdValid)
    };
}
