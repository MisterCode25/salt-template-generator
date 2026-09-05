import { loadJSON } from "./storageService.js";
import { updateIndexedRecords } from "./indexedDbService.js";
import {
    ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT, CLIENT_INPUT_VALUES_UPDATED_EVENT,
    IMPORTED_EXTERNAL_ID_KEY, MANUAL_CLIENT_INPUTS_KEY
} from "./activeClientService.js";
import { getSuperOfficeClientSignature, SUPER_OFFICE_TICKET_UPDATED_EVENT } from "./superOfficeTicketService.js";
import { buildAloExternalIdFields } from "../utils/aloTicketResult.js";
import {
    buildExternalCode, buildExternalFieldsFromTokenValues, buildExternalTokenValues, formatDateForInput, parseExternalId
} from "../utils/externalGenerator.js";

const PENDING_KEY = "pending_alo_ticket_completions";
const CLIENT_KEY = "active_client_payload";
const TICKET_KEY = "super_office_ticket_payload";
const TOKENS_KEY = "token_input_values";
const KEYS = [PENDING_KEY, CLIENT_KEY, TICKET_KEY, TOKENS_KEY];
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const activeRequests = (records = []) => (Array.isArray(records) ? records : [])
    .filter((record) => record?.requestId && Date.now() - record.startedAt <= MAX_AGE_MS);

export async function prepareAloTicketCompletion(requestId, clientPayload, ticket, preparation) {
    // Migrate legacy records before the atomic IndexedDB boundary.
    await Promise.all(KEYS.map((key) => loadJSON(key)));
    return updateIndexedRecords(KEYS, (snapshot) => {
        const clientSignature = getSuperOfficeClientSignature(clientPayload);
        const storedTicket = snapshot[TICKET_KEY];
        if (!clientSignature || clientSignature !== getSuperOfficeClientSignature(snapshot[CLIENT_KEY])
            || String(ticket?.ticketId || "") !== String(storedTicket?.ticketId || "")) {
            throw new Error("The active case changed. Prepare ALO again.");
        }
        const parsed = parseExternalId(clientPayload[IMPORTED_EXTERNAL_ID_KEY] || storedTicket?.externalTicketId);
        const fields = buildAloExternalIdFields({
            clientPayload,
            soTicket: String(storedTicket?.ticketId || snapshot[TOKENS_KEY]?.["{so_ticket_num}"] || ""),
            existingFields: { ...buildExternalFieldsFromTokenValues(snapshot[TOKENS_KEY]), ...(parsed.ok ? parsed.fields : {}) },
            preparation
        });
        const record = {
            requestId, clientSignature, ticketId: String(storedTicket?.ticketId || ""),
            sourceTicketId: String(storedTicket?.sourceTicketId || ""),
            fields, startedAt: Date.now()
        };
        const pending = activeRequests(snapshot[PENDING_KEY]).filter((entry) => (
            entry.clientSignature !== clientSignature || entry.ticketId !== record.ticketId
        ));
        return { updates: { [PENDING_KEY]: [...pending.filter((entry) => entry.requestId !== requestId), record].slice(-15) }, result: record };
    });
}

export async function cancelAloTicketCompletion(requestId) {
    await updateIndexedRecords([PENDING_KEY], (snapshot) => ({
        updates: { [PENDING_KEY]: activeRequests(snapshot[PENDING_KEY]).filter((entry) => entry.requestId !== requestId) }
    }));
}

export async function loadPendingAloTicketCompletions() {
    return activeRequests(await loadJSON(PENDING_KEY, []));
}

export async function completeAloTicket(requestId, result, capturedAt = Date.now()) {
    if (!/^\d+$/.test(result?.incidentId || "") || !Number.isFinite(new Date(capturedAt).getTime())) {
        return { status: "invalid" };
    }
    const completion = await updateIndexedRecords(KEYS, (snapshot) => {
        const pending = activeRequests(snapshot[PENDING_KEY]);
        const record = pending.find((entry) => entry.requestId === requestId);
        if (!record) return { result: { status: "ignored" } };
        const client = snapshot[CLIENT_KEY];
        const ticket = snapshot[TICKET_KEY];
        const isMatchingCase = record.clientSignature === getSuperOfficeClientSignature(client)
            && record.ticketId === String(ticket?.ticketId || "")
            && record.sourceTicketId === String(ticket?.sourceTicketId || "")
            && (!ticket || ticket.clientSignature === record.clientSignature);
        if (!isMatchingCase) {
            return {
                updates: { [PENDING_KEY]: pending.map((entry) => entry === record ? { ...record, result, capturedAt } : entry) },
                result: { status: "waiting", incidentId: result.incidentId }
            };
        }
        const fields = { ...record.fields, data: formatDateForInput(new Date(capturedAt)), partnerTicketNumber: result.incidentId };
        const externalId = buildExternalCode(fields).trim();
        const tokenValues = buildExternalTokenValues(fields);
        const manualInputs = { ...client[MANUAL_CLIENT_INPUTS_KEY] };
        Object.entries(tokenValues).forEach(([token, value]) => {
            const name = token.slice(1, -1);
            if (value) manualInputs[name] = value;
            else delete manualInputs[name];
        });
        const nextClient = { ...client, [IMPORTED_EXTERNAL_ID_KEY]: externalId, [MANUAL_CLIENT_INPUTS_KEY]: manualInputs };
        const nextTicket = ticket ? { ...ticket, externalTicketId: externalId, tokenValues: { ...ticket.tokenValues, ...tokenValues } } : null;
        return {
            updates: {
                [PENDING_KEY]: pending.filter((entry) => entry !== record),
                [CLIENT_KEY]: nextClient,
                [TOKENS_KEY]: { ...snapshot[TOKENS_KEY], ...tokenValues },
                ...(nextTicket ? { [TICKET_KEY]: nextTicket } : {})
            },
            result: { status: "completed", externalId, incidentId: result.incidentId, client: nextClient, ticket: nextTicket, tokenValues }
        };
    });
    if (completion.status === "completed" && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT, { detail: { payload: completion.client } }));
        window.dispatchEvent(new CustomEvent(CLIENT_INPUT_VALUES_UPDATED_EVENT, { detail: { values: completion.tokenValues } }));
        if (completion.ticket) window.dispatchEvent(new CustomEvent(SUPER_OFFICE_TICKET_UPDATED_EVENT, { detail: { payload: completion.ticket } }));
    }
    return completion;
}
