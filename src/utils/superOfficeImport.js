import { SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";
import { buildExternalTokenValues, parseExternalId } from "./externalGenerator.js";

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

export function parseSuperOfficeInfoPayload(input) {
    const payload = parsePayload(input);
    if (!payload) {
        return { ok: false, error: "INVALID_SUPER_OFFICE_JSON" };
    }

    const ticketId = valueOf(
        payload.ticketId,
        payload.soTicket,
        payload.soTicketNumber,
        payload.ticketNumber
    );
    const externalTicketId = valueOf(
        payload.externalTicketId,
        payload.externalId,
        payload.externalID,
        payload.hcampExternalId
    );
    const tokenValues = {};
    let externalFields = null;
    let externalIdValid = false;

    if (externalTicketId) {
        const parsedExternalId = parseExternalId(externalTicketId);
        if (parsedExternalId.ok) {
            externalIdValid = true;
            externalFields = parsedExternalId.fields;
            Object.assign(tokenValues, buildExternalTokenValues(parsedExternalId.fields));
        }
    }

    const soTicket = ticketId || externalFields?.soTicket || "";
    if (soTicket) {
        tokenValues[SO_TICKET_NUM_TOKEN] = soTicket;
    }

    if (Object.keys(tokenValues).length === 0) {
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
        externalTicketId,
        externalIdValid,
        externalFields,
        tokenValues,
        ignoredExternalId: Boolean(externalTicketId && !externalIdValid)
    };
}
