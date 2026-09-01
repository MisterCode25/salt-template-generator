import { SO_TICKET_NUM_TOKEN, SO_TICKET_TOKEN_KEY } from "./tokenCanonicalization.js";
import { loadTokenInputValues } from "../services/tokenInputValueService.js";
import { IMPORTED_EXTERNAL_ID_KEY } from "../services/activeClientService.js";
import { getEligibilityPartnerName } from "./eligibilityPartner.js";

export const EXTERNAL_GENERATOR_PARTNERS = [
    "ALO", "AMB", "ANI", "COMNET", "DANET", "DEK", "DWW", "EBS", "ENERCOM", "ENIWA", "ESAG", "ESI", "EVAL", "EVB", "EVK",
    "EVM", "EWB", "EWBU", "EWG", "EWH", "EWL", "EWLA", "EWM", "EWMAI", "EWME", "EWR", "EWS", "EWW", "EWZ", "FLMS", "FTTH-FR",
    "GABU", "GAG", "GAW", "GBM", "GEF", "GEL", "GES", "GWB", "IWB", "JENNY", "KCL", "LEU", "LFO", "LID", "LKWG", "LOCN",
    "PGE", "PGL", "PGS", "RENET", "RWT", "SAK", "SEIC", "SEY", "SGSW", "SIG", "SME", "STWZ", "SWG", "SWISS4NET", "SWL", "SWW",
    "TBA", "TBF", "TBG", "TBS", "TBW", "TBWAE", "TRN", "TVT", "TWAG", "WBB", "WEW", "WEWA", "WWB"
];

export const EXTERNAL_FIELD_ORDER = [
    "flagging",
    "data",
    "customer",
    "soTicket",
    "SignalStatus",
    "LedStatus",
    "treatmentStep",
    "boxType",
    "partner",
    "partnerTicketNumber",
    "lexId",
    "oltName",
    "oltBoard",
    "bokBof",
    "comment"
];

export const EXTERNAL_GENERATED_FIELD_ORDER = EXTERNAL_FIELD_ORDER.filter((field) => field !== "flagging");

export const EXTERNAL_DEFAULT_FIELDS = {
    flagging: "",
    data: "",
    customer: "",
    soTicket: "",
    SignalStatus: "",
    LedStatus: "",
    treatmentStep: "",
    boxType: "",
    partner: "",
    partnerTicketNumber: "",
    lexId: "",
    oltName: "",
    oltBoard: "",
    bokBof: "",
    comment: ""
};

export function buildPartnerTicketPromptTitle(partnerName) {
    const partner = String(partnerName ?? "").trim();
    return partner ? `Partner Ticket Number — ${partner}` : "Partner Ticket Number";
}

export const EXTERNAL_SYSTEM_TOKEN_FIELDS = Object.freeze([
    { field: "flagging", token: "{external_flagging}", label: "External ID flagging" },
    { field: "data", token: "{external_date}", label: "External ID date", input_type: "date" },
    { field: "customer", token: "{external_customer}", label: "External ID customer" },
    { field: "soTicket", token: SO_TICKET_NUM_TOKEN, label: "SO ticket number", key: SO_TICKET_TOKEN_KEY },
    { field: "SignalStatus", token: "{external_signal_status}", label: "External ID signal status" },
    { field: "LedStatus", token: "{external_led_status}", label: "External ID LED status" },
    { field: "treatmentStep", token: "{external_treatment_step}", label: "External ID treatment step" },
    { field: "boxType", token: "{external_box_type}", label: "External ID box type" },
    { field: "partner", token: "{external_partner}", label: "External ID partner" },
    { field: "partnerTicketNumber", token: "{external_partner_ticket_number}", label: "External ID partner ticket number" },
    { field: "lexId", token: "{external_lex_id}", label: "External ID LEX ID" },
    { field: "oltName", token: "{external_olt_name}", label: "External ID OLT name" },
    { field: "oltBoard", token: "{external_olt_board}", label: "External ID OLT board" },
    { field: "bokBof", token: "{external_bok_bof}", label: "External ID BOK/BOF" }
]);

export const EXTERNAL_SYSTEM_TOKENS = Object.freeze(EXTERNAL_SYSTEM_TOKEN_FIELDS.map((field) => ({
    id: `system:external:${field.field}`,
    token: field.token,
    key: field.key || field.field,
    label: field.label,
    input_type: field.input_type || "text",
    display_mode: "on_demand",
    system: true
})));

function normalizeSegment(value) {
    const trimmed = String(value ?? "").trim();
    return trimmed === "" ? " " : trimmed;
}

export function formatDateForInput(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function buildExternalCode(fields) {
    const dateValue = fields?.data ? String(fields.data) : "";
    const displayDate = dateValue ? dateValue.split("-").reverse().join(".") : " ";
    const includesPartnerTicket = String(fields?.treatmentStep ?? "").trim() === "FLL Ticket";
    const valuesByField = {
        ...EXTERNAL_DEFAULT_FIELDS,
        ...fields,
        data: displayDate,
        partner: includesPartnerTicket ? fields?.partner : "",
        partnerTicketNumber: includesPartnerTicket ? fields?.partnerTicketNumber : ""
    };
    return EXTERNAL_GENERATED_FIELD_ORDER
        .map((field) => normalizeSegment(valuesByField[field]))
        .join("//");
}

function formatTokenFieldValue(field, value) {
    if (field === "data" && value) {
        return String(value).split("-").reverse().join(".");
    }
    return value === null || value === undefined ? "" : String(value);
}

function parseTokenFieldValue(field, value) {
    const text = String(value ?? "").trim();
    if (!text) return "";
    if (field === "data") {
        const dateMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (dateMatch) return `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
    }
    return text;
}

export function buildExternalTokenValues(fields = {}) {
    return Object.fromEntries(
        EXTERNAL_SYSTEM_TOKEN_FIELDS.map(({ field, token }) => [
            token,
            formatTokenFieldValue(field, fields[field])
        ])
    );
}

export function buildExternalFieldsFromTokenValues(valuesByToken = {}) {
    const fields = {};

    EXTERNAL_SYSTEM_TOKEN_FIELDS.forEach(({ field, token }) => {
        if (!Object.prototype.hasOwnProperty.call(valuesByToken, token)) return;
        const value = parseTokenFieldValue(field, valuesByToken[token]);
        if (value) fields[field] = value;
    });

    return fields;
}

export async function readExternalFieldsFromStoredTokens() {
    const storedValues = await loadTokenInputValues();
    const valuesByToken = {};
    EXTERNAL_SYSTEM_TOKEN_FIELDS.forEach(({ token }) => {
        if (Object.prototype.hasOwnProperty.call(storedValues, token)) {
            valuesByToken[token] = storedValues[token];
        }
    });
    return buildExternalFieldsFromTokenValues(valuesByToken);
}

export function parseExternalId(externalId) {
    const raw = String(externalId ?? "").trim();
    if (!raw) {
        return { ok: false, error: "EMPTY_EXTERNAL_ID" };
    }

    let parts = raw.split("//").map((p) => p.trim());
    if (parts.length === 14 && /^\d{2}\.\d{2}\.\d{4}$/.test(parts[0])) {
        parts = ["", ...parts];
    }

    if (parts.length < 15) {
        return { ok: false, error: "INVALID_EXTERNAL_ID_FORMAT" };
    }

    const next = { ...EXTERNAL_DEFAULT_FIELDS };
    for (let i = 0; i < EXTERNAL_FIELD_ORDER.length; i++) {
        const key = EXTERNAL_FIELD_ORDER[i];
        if (key === "data") {
            const datePart = (parts[i] ?? "").trim();
            const dateMatch = datePart.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
            if (dateMatch) {
                next.data = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
            }
            continue;
        }
        next[key] = parts[i] ?? "";
    }
    return { ok: true, fields: next };
}

export function getValidExternalId(externalId) {
    const raw = String(externalId ?? "").trim();
    if (!raw) return "";
    return parseExternalId(raw).ok ? raw : "";
}

export function getImportedExternalIdFromClientPayload(payload) {
    return getValidExternalId(payload?.[IMPORTED_EXTERNAL_ID_KEY]);
}

function extractValue(rawData, label, contextRegex = "") {
    const valuePattern = "([\\s\\S]*?)";
    const endPattern = "(?:<\\/[a-z]\\w*>|\\s*\\n\\s*(?:[a-z]\\w+|\\d+)|<\\/div>|$)";
    const regex = contextRegex
        ? new RegExp(`${contextRegex}[\\s\\S]*?${label}\\s*(?:<br\\s*\\/?>|\\s*<[a-z]\\w*>\\s*)?${valuePattern}${endPattern}`, "i")
        : new RegExp(`${label}\\s*(?:<br\\s*\\/?>|\\s*<[a-z]\\w*>\\s*)?${valuePattern}${endPattern}`, "i");
    const match = rawData.match(regex);
    if (!match?.[1]) return "";
    return match[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function parseVtiClipboard(rawInput) {
    const rawData = String(rawInput ?? "");
    if (!rawData.trim()) {
        return { ok: false, error: "EMPTY_VTI_CLIPBOARD" };
    }

    const next = { ...EXTERNAL_DEFAULT_FIELDS };
    const customerMatch = rawData.match(
        /(Contractor number|Vertragsnummer|N°\s*Contractant)\s*:\s*(\d+)/i
    );
    next.customer = customerMatch?.[2]?.trim() || "";

    const fiberFllContext = "Fiber FLL";
    const routerSerialNumber = extractValue(rawData, "routerSerialNumber", fiberFllContext);
    if (routerSerialNumber.startsWith("GFAB")) next.boxType = "X6";
    else if (routerSerialNumber.startsWith("GFAC")) next.boxType = "W7";
    else if (routerSerialNumber.startsWith("SFAA")) next.boxType = "Arc";

    next.lexId = extractValue(rawData, "lexId", fiberFllContext);
    next.oltName = extractValue(rawData, "oltName", fiberFllContext);
    next.oltBoard = extractValue(rawData, "oltBoard", fiberFllContext);

    const breakoutCableId = extractValue(rawData, "breakoutCableId", fiberFllContext);
    const fiberNumber = extractValue(rawData, "fiberNumber", fiberFllContext);
    const bokBofParts = [];
    if (breakoutCableId) {
        const split = breakoutCableId.split("/");
        if (split.length > 1) {
            bokBofParts.push(split[0], split[1]);
        } else {
            bokBofParts.push(breakoutCableId);
        }
    }
    if (fiberNumber) {
        bokBofParts.push(fiberNumber);
    }
    next.bokBof = bokBofParts.join("|");

    const hasUsefulData = Boolean(
        next.customer
        || next.boxType
        || next.lexId
        || next.oltName
        || next.oltBoard
        || next.bokBof
    );
    if (!hasUsefulData) {
        return { ok: false, error: "INVALID_VTI_FORMAT" };
    }

    delete next.data;
    delete next.soTicket; // not present in VTI data — preserve any pre-filled value
    return { ok: true, fields: next };
}

function valueOf(...values) {
    for (const value of values) {
        const text = String(value ?? "").trim();
        if (text) return text;
    }
    return "";
}

function normalizeGeneratorPartner(partnerName) {
    const value = String(partnerName ?? "").trim();
    if (!value) return "";

    const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    const aliases = {
        com: "COMNET",
        enerc: "ENERCOM",
        swiss4: "SWISS4NET"
    };
    if (aliases[normalizedValue]) return aliases[normalizedValue];

    return EXTERNAL_GENERATOR_PARTNERS.find((partner) => (
        partner.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedValue
    )) || value;
}

function boxTypeFromRouterSerial(serial = "") {
    if (serial.startsWith("GFAB")) return "X6";
    if (serial.startsWith("GFAC")) return "W7";
    if (serial.startsWith("SFAA")) return "Arc";
    return "";
}

function formatBokBof(breakoutCableId = "", fiberNumber = "") {
    const parts = [];
    const breakout = String(breakoutCableId ?? "").trim();
    const fiber = String(fiberNumber ?? "").trim();

    if (breakout) {
        const split = breakout.split("/");
        if (split.length > 1) {
            parts.push(split[0], split[1]);
        } else {
            parts.push(breakout);
        }
    }
    if (fiber) parts.push(fiber);

    return parts.join("|");
}

export function buildExternalFieldsFromClientPayload(payload) {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "NO_ACTIVE_CLIENT_DATA" };
    }

    const client = payload.client || {};
    const contact = payload.contact || {};
    const healthcheck = payload.healthcheck || {};
    const routerSerial = valueOf(healthcheck.routerSerialNumber, healthcheck.oldRouterSerialNumber);
    const partner = normalizeGeneratorPartner(valueOf(
        getEligibilityPartnerName(contact.eligibilityOrdering),
        contact.partnerName,
        contact.partner,
        client.partnerName,
        client.partner,
        contact.eligibilitySource,
        client.eligibilitySource
    ));
    const fields = {
        customer: valueOf(client.contractorNumber, client.contractor, healthcheck.customerId),
        boxType: boxTypeFromRouterSerial(routerSerial),
        ...(partner ? { partner } : {}),
        lexId: valueOf(healthcheck.lexId),
        oltName: valueOf(healthcheck.oltName),
        oltBoard: valueOf(healthcheck.oltBoard),
        bokBof: formatBokBof(healthcheck.breakoutCableId, healthcheck.fiberNumber)
    };

    const hasUsefulData = Boolean(
        fields.customer
        || fields.boxType
        || fields.partner
        || fields.lexId
        || fields.oltName
        || fields.oltBoard
        || fields.bokBof
    );

    if (!hasUsefulData) {
        return { ok: false, error: "INVALID_ACTIVE_CLIENT_DATA" };
    }

    return { ok: true, fields };
}

export function buildExternalClientPrefillFields(currentFields, clientPayload) {
    const result = buildExternalFieldsFromClientPayload(clientPayload);
    if (!result.ok) return result;

    const fields = { ...result.fields };
    const isFllTicket = String(currentFields?.treatmentStep ?? "").trim() === "FLL Ticket";
    if (!isFllTicket) {
        fields.partner = "";
        fields.partnerTicketNumber = "";
        return { ...result, fields };
    }

    const currentPartner = String(currentFields?.partner ?? "").trim();
    const nextPartner = String(fields.partner ?? "").trim();
    if (nextPartner && nextPartner !== currentPartner) {
        fields.partnerTicketNumber = "";
    }
    return { ...result, fields };
}

export const EXTERNAL_TREATMENT_STEP_DOWNSTREAM_FIELDS = Object.freeze([
    "SignalStatus",
    "LedStatus",
    "partner",
    "partnerTicketNumber",
    "comment"
]);

export function buildTreatmentStepChangeFields(currentFields, treatmentStep, clientPayload) {
    const resetFields = Object.fromEntries(
        EXTERNAL_TREATMENT_STEP_DOWNSTREAM_FIELDS.map((field) => [field, ""])
    );
    const nextFields = {
        ...currentFields,
        treatmentStep,
        ...resetFields
    };

    if (treatmentStep !== "FLL Ticket") return nextFields;

    const clientFields = buildExternalFieldsFromClientPayload(clientPayload);
    if (clientFields.ok && clientFields.fields.partner) {
        nextFields.partner = clientFields.fields.partner;
    }

    return nextFields;
}

export function mergeExternalFields(current, patch) {
    return { ...current, ...patch };
}

export function clearExternalFieldsExceptDate(current) {
    return { ...EXTERNAL_DEFAULT_FIELDS, data: current?.data || "" };
}
