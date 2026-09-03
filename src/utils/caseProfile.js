import { IMPORTED_EXTERNAL_ID_KEY, MANUAL_CLIENT_INPUTS_KEY } from "../services/activeClientService.js";
import {
    SO_TICKET_NUM_TOKEN,
    canonicalizeInputTokenValue,
    normalizeTokenName
} from "./tokenCanonicalization.js";
import {
    buildExternalTokenValues,
    parseExternalId
} from "./externalGenerator.js";
import {
    getSuperOfficeImageAttachments,
    normalizeSuperOfficeAttachments
} from "./superOfficeImport.js";

export const CASE_PROFILE_VERSION = "case-profile-beta-1";

const FIELD_DEFINITIONS = Object.freeze([
    ["clientName", "Client name"],
    ["title", "Title"],
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["contractorNumber", "Contractor"],
    ["mobile", "Mobile"],
    ["mobileRaw", "Mobile raw"],
    ["phone", "Phone"],
    ["email", "Email"],
    ["address", "Address"],
    ["communicationLanguage", "Language"],
    ["activationDate", "Activation date"],
    ["eligibilitySource", "Eligibility"],
    ["contactRecordId", "Contact record"],
    ["fixedNumber", "Fixed number"],
    ["publicId", "Public ID"],
    ["providerOrderRef", "Provider order ref"],
    ["fllRecordId", "FLL record"],
    ["otoId", "OTO ID"],
    ["otoPortId", "OTO port"],
    ["routerSerialNumber", "Router serial"],
    ["oldRouterSerialNumber", "Old router serial"],
    ["lexId", "LEX ID"],
    ["oltName", "OLT"],
    ["oltBoard", "OLT board"],
    ["ponPort", "PON port"],
    ["breakoutCableId", "Breakout cable"],
    ["fiberNumber", "Fiber number"],
    ["lineState", "Line state"],
    ["routerStatus", "Router status"],
    ["odfId", "ODF ID"],
    ["option82", "Option 82"],
    ["oltObject", "OLT object"],
    ["ontConfigurationFilename", "ONT config"],
    ["svlan", "SVLAN"],
    ["customerId", "Customer ID"],
    ["crossConnectionEquipment", "Cross connection equipment"],
    ["crossConnectionRack", "Cross connection rack"],
    ["crossConnectionSlot", "Cross connection slot"],
    ["crossConnectionPort", "Cross connection port"],
    ["externalId", "External ID"],
    ["externalFlagging", "External ID flagging"],
    ["externalDate", "External ID date"],
    ["externalCustomer", "External ID customer"],
    ["soTicketNum", "SO ticket number"],
    ["externalSignalStatus", "External ID signal status"],
    ["externalLedStatus", "External ID LED status"],
    ["externalTreatmentStep", "External ID treatment step"],
    ["externalBoxType", "External ID box type"],
    ["externalPartner", "External ID partner"],
    ["externalPartnerTicketNumber", "External ID partner ticket number"],
    ["externalLexId", "External ID LEX ID"],
    ["externalOltName", "External ID OLT"],
    ["externalOltBoard", "External ID OLT board"],
    ["externalBokBof", "External ID BOK/BOF"],
    ["externalComment", "External ID comment"],
    ["ticketCreatedAt", "Ticket created at"]
]);

const FIELD_LABELS = Object.freeze(Object.fromEntries(FIELD_DEFINITIONS));
const FIELD_NAMES = Object.freeze(FIELD_DEFINITIONS.map(([name]) => name));

const EXTERNAL_FIELD_TO_PROFILE_FIELD = Object.freeze({
    flagging: "externalFlagging",
    data: "externalDate",
    customer: "externalCustomer",
    soTicket: "soTicketNum",
    SignalStatus: "externalSignalStatus",
    LedStatus: "externalLedStatus",
    treatmentStep: "externalTreatmentStep",
    boxType: "externalBoxType",
    partner: "externalPartner",
    partnerTicketNumber: "externalPartnerTicketNumber",
    lexId: "externalLexId",
    oltName: "externalOltName",
    oltBoard: "externalOltBoard",
    bokBof: "externalBokBof",
    comment: "externalComment"
});

const TOKEN_NAME_TO_PROFILE_FIELD = Object.freeze({
    client_name: "clientName",
    customer_name: "clientName",
    full_name: "clientName",
    name: "clientName",
    title: "title",
    client_title: "title",
    first_name: "firstName",
    client_first_name: "firstName",
    last_name: "lastName",
    client_last_name: "lastName",
    contractor: "contractorNumber",
    contractor_number: "contractorNumber",
    client_contractor_number: "contractorNumber",
    customer_id: "customerId",
    healthcheck_customer_id: "customerId",
    mobile: "mobile",
    client_mobile: "mobile",
    mobile_raw: "mobileRaw",
    client_mobile_raw: "mobileRaw",
    phone: "phone",
    telephone: "phone",
    email: "email",
    client_email: "email",
    address: "address",
    client_address: "address",
    language: "communicationLanguage",
    client_communication_language: "communicationLanguage",
    activation_date: "activationDate",
    client_activation_date: "activationDate",
    offer_activation_date: "activationDate",
    oto_id: "otoId",
    healthcheck_oto_id: "otoId",
    oto_port_id: "otoPortId",
    healthcheck_oto_port_id: "otoPortId",
    router_serial_number: "routerSerialNumber",
    healthcheck_router_serial_number: "routerSerialNumber",
    old_router_serial_number: "oldRouterSerialNumber",
    healthcheck_old_router_serial_number: "oldRouterSerialNumber",
    lex_id: "lexId",
    healthcheck_lex_id: "lexId",
    olt_name: "oltName",
    healthcheck_olt_name: "oltName",
    olt_board: "oltBoard",
    healthcheck_olt_board: "oltBoard",
    pon_port: "ponPort",
    breakout_cable_id: "breakoutCableId",
    fiber_number: "fiberNumber",
    line_state: "lineState",
    router_status: "routerStatus",
    so_ticket_num: "soTicketNum",
    ticket_num: "soTicketNum",
    external_flagging: "externalFlagging",
    external_date: "externalDate",
    external_customer: "externalCustomer",
    external_signal_status: "externalSignalStatus",
    external_led_status: "externalLedStatus",
    external_treatment_step: "externalTreatmentStep",
    external_box_type: "externalBoxType",
    external_partner: "externalPartner",
    external_partner_ticket_number: "externalPartnerTicketNumber",
    external_lex_id: "externalLexId",
    external_olt_name: "externalOltName",
    external_olt_board: "externalOltBoard",
    external_bok_bof: "externalBokBof",
    external_comment: "externalComment"
});

const RESERVED_PROFILE_VARIABLES = new Set([
    "attachments",
    "availableFields",
    "dynamic",
    "fieldLabels",
    "fields",
    "photos",
    "tokenValues",
    "variables",
    "vars",
    "version"
]);

function displayValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "";
}

function firstValue(...values) {
    for (const value of values) {
        const text = displayValue(value);
        if (text !== "") return text;
    }
    return "";
}

function readPath(source, path = "") {
    let current = source;
    for (const segment of String(path || "").split(".")) {
        if (!segment) continue;
        if (current === null || current === undefined) return undefined;
        current = current[segment];
    }
    return current;
}

function normalizeName(value = "") {
    return String(value || "")
        .replace(/[{}]/g, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function camelizeName(value = "") {
    const normalized = normalizeName(value);
    if (!normalized) return "";
    return normalized.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function toVariableName(value = "") {
    const camel = camelizeName(value);
    if (!camel) return "";
    return /^[A-Za-z_$]/.test(camel) ? camel : `field${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
}

function toToken(value = "") {
    const normalized = normalizeName(value);
    return normalized ? `{${normalized}}` : "";
}

function humanizeName(value = "") {
    return String(value || "")
        .replace(/[{}]/g, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^./, (char) => char.toUpperCase());
}

function createEmptyProfile() {
    const fields = {};
    FIELD_NAMES.forEach((name) => {
        fields[name] = "";
    });

    return {
        version: CASE_PROFILE_VERSION,
        fields,
        fieldLabels: { ...FIELD_LABELS },
        dynamic: {},
        vars: {},
        variables: {},
        tokenValues: {},
        availableFields: [],
        attachments: [],
        photos: []
    };
}

function isFilled(value) {
    return displayValue(value) !== "";
}

function setField(profile, name, value, { overwrite = false } = {}) {
    if (!name || !Object.prototype.hasOwnProperty.call(profile.fields, name)) return false;
    const text = displayValue(value);
    if (text === "") return false;
    if (!overwrite && isFilled(profile.fields[name])) return false;

    profile.fields[name] = text;
    profile[name] = text;
    return true;
}

function setDynamic(profile, name, value, { overwrite = false, label = "" } = {}) {
    const variableName = toVariableName(name);
    const text = displayValue(value);
    if (!variableName || text === "" || RESERVED_PROFILE_VARIABLES.has(variableName)) return false;
    if (!overwrite && Object.prototype.hasOwnProperty.call(profile.dynamic, variableName)) return false;

    profile.dynamic[variableName] = text;
    if (label && !profile.fieldLabels[variableName]) profile.fieldLabels[variableName] = label;
    return true;
}

function setFieldOrDynamic(profile, name, value, options = {}) {
    const tokenName = normalizeName(canonicalizeInputTokenValue(name) || name);
    const fieldName = TOKEN_NAME_TO_PROFILE_FIELD[tokenName] || TOKEN_NAME_TO_PROFILE_FIELD[normalizeName(name)] || toVariableName(name);
    if (Object.prototype.hasOwnProperty.call(profile.fields, fieldName)) {
        return setField(profile, fieldName, value, options);
    }
    return setDynamic(profile, name, value, options);
}

function applyFieldMap(profile, map = {}, options = {}) {
    Object.entries(map).forEach(([name, value]) => setField(profile, name, value, options));
}

function walkLeaves(value, path = [], leaves = []) {
    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            path.push(String(index + 1));
            walkLeaves(item, path, leaves);
            path.pop();
        });
        return leaves;
    }

    if (value && typeof value === "object") {
        Object.keys(value).forEach((key) => {
            path.push(key);
            walkLeaves(value[key], path, leaves);
            path.pop();
        });
        return leaves;
    }

    leaves.push({
        path: path.slice(),
        value: displayValue(value)
    });
    return leaves;
}

function isInternalClientPath(path = []) {
    return path[0] === MANUAL_CLIENT_INPUTS_KEY || path[0] === IMPORTED_EXTERNAL_ID_KEY;
}

function addDynamicLeaves(profile, payload, { prefix = "", skipInternalClientKeys = false } = {}) {
    if (!payload || typeof payload !== "object") return;

    walkLeaves(payload)
        .filter((leaf) => leaf.value !== "")
        .filter((leaf) => !skipInternalClientKeys || !isInternalClientPath(leaf.path))
        .forEach((leaf) => {
            const path = prefix ? [prefix, ...leaf.path] : leaf.path;
            setDynamic(profile, path.join("_"), leaf.value, {
                label: path.map(humanizeName).join(" ")
            });
        });
}

function mergeAttachments(current = [], incoming = []) {
    const byKey = new Map();
    [...current, ...incoming].forEach((attachment) => {
        if (!attachment || typeof attachment !== "object") return;
        const key = `${displayValue(attachment.url)}|${displayValue(attachment.name)}|${displayValue(attachment.id)}`;
        if (!key.replace(/\|/g, "")) return;
        if (!byKey.has(key)) byKey.set(key, attachment);
    });
    return Array.from(byKey.values());
}

function getValidParsedExternalId(value) {
    const externalId = displayValue(value);
    if (!externalId) return null;
    const parsed = parseExternalId(externalId);
    return parsed.ok ? { externalId, fields: parsed.fields } : null;
}

function applyExternalFields(profile, parsedExternalId) {
    if (!parsedExternalId) return;
    setField(profile, "externalId", parsedExternalId.externalId);

    Object.entries(EXTERNAL_FIELD_TO_PROFILE_FIELD).forEach(([externalField, profileField]) => {
        setField(profile, profileField, parsedExternalId.fields?.[externalField]);
    });

    setField(profile, "contractorNumber", parsedExternalId.fields?.customer);
    setField(profile, "lexId", parsedExternalId.fields?.lexId);
    setField(profile, "oltName", parsedExternalId.fields?.oltName);
    setField(profile, "oltBoard", parsedExternalId.fields?.oltBoard);
}

function applyClientPayload(profile, clientPayload) {
    if (!clientPayload || typeof clientPayload !== "object") return;

    const client = clientPayload.client || {};
    const contact = clientPayload.contact || {};
    const healthcheck = clientPayload.healthcheck || {};
    const crossConnection = healthcheck.crossConnexion || healthcheck.crossConnection || {};
    const clientName = [client.firstName, client.lastName].map(displayValue).filter(Boolean).join(" ");

    applyFieldMap(profile, {
        clientName: clientName || firstValue(client.fullName, client.name, client.customerName),
        title: client.title,
        firstName: client.firstName,
        lastName: client.lastName,
        contractorNumber: firstValue(client.contractorNumber, client.contractor, healthcheck.customerId),
        mobile: firstValue(client.mobile, client.phone, client.telephone),
        mobileRaw: client.mobileRaw,
        phone: firstValue(client.phone, client.telephone, contact.fixedNumber),
        email: client.email,
        address: client.address,
        communicationLanguage: firstValue(client.communicationLanguage, contact.communicationLanguage, client.language, contact.language),
        activationDate: firstValue(
            client.activationDate,
            client.activation_date,
            client.activation,
            client.dateActivation,
            clientPayload.offer?.activationDate,
            contact.activationDate,
            healthcheck.activationDate
        ),
        eligibilitySource: firstValue(client.eligibilitySource, contact.eligibilitySource),
        contactRecordId: firstValue(client.contactRecordId, contact.contactRecordId),
        fixedNumber: contact.fixedNumber,
        publicId: contact.publicId,
        providerOrderRef: contact.providerOrderRef,
        fllRecordId: healthcheck.fllRecordId,
        otoId: firstValue(healthcheck.otoId, healthcheck.oto_id, healthcheck.oto),
        otoPortId: firstValue(healthcheck.otoPortId, healthcheck.otoPort, healthcheck.oto_port, crossConnection.Port),
        routerSerialNumber: healthcheck.routerSerialNumber,
        oldRouterSerialNumber: healthcheck.oldRouterSerialNumber,
        lexId: healthcheck.lexId,
        oltName: healthcheck.oltName,
        oltBoard: healthcheck.oltBoard,
        ponPort: healthcheck.ponPort,
        breakoutCableId: healthcheck.breakoutCableId,
        fiberNumber: healthcheck.fiberNumber,
        lineState: healthcheck.lineState,
        routerStatus: healthcheck.routerStatus,
        odfId: healthcheck.odfId,
        option82: healthcheck.option82,
        oltObject: healthcheck.oltObject,
        ontConfigurationFilename: healthcheck.ontConfigurationFilename,
        svlan: healthcheck.svlan,
        customerId: healthcheck.customerId,
        crossConnectionEquipment: crossConnection.Equipment,
        crossConnectionRack: crossConnection.Rack,
        crossConnectionSlot: crossConnection.Slot,
        crossConnectionPort: crossConnection.Port
    });

    applyExternalFields(profile, getValidParsedExternalId(clientPayload[IMPORTED_EXTERNAL_ID_KEY]));
    addDynamicLeaves(profile, clientPayload, { skipInternalClientKeys: true });
}

function applySuperOfficePayload(profile, superOfficePayload) {
    if (!superOfficePayload || typeof superOfficePayload !== "object") return;

    setField(profile, "soTicketNum", firstValue(
        superOfficePayload.ticketId,
        superOfficePayload.sourceTicketId,
        superOfficePayload.soTicket,
        superOfficePayload.soTicketNumber,
        superOfficePayload.ticketNumber,
        superOfficePayload.tokenValues?.[SO_TICKET_NUM_TOKEN]
    ));
    setField(profile, "ticketCreatedAt", firstValue(
        superOfficePayload.createdAt,
        superOfficePayload.created,
        superOfficePayload.createdDate,
        superOfficePayload.ticketCreatedAt,
        superOfficePayload.ticketCreatedDate
    ));

    applyExternalFields(profile, getValidParsedExternalId(superOfficePayload.externalTicketId));
    applyTokenValues(profile, superOfficePayload.tokenValues);

    const attachments = normalizeSuperOfficeAttachments(superOfficePayload.attachments);
    const photos = getSuperOfficeImageAttachments(attachments);
    profile.attachments = mergeAttachments(profile.attachments, attachments);
    profile.photos = mergeAttachments(profile.photos, photos);

    addDynamicLeaves(profile, superOfficePayload, { prefix: "ticket" });
}

function applyTokenValues(profile, tokenValues = {}, options = {}) {
    if (!tokenValues || typeof tokenValues !== "object") return;

    Object.entries(tokenValues).forEach(([token, value]) => {
        const text = displayValue(value);
        if (text === "") return;

        const canonicalToken = canonicalizeInputTokenValue(token);
        const normalizedName = normalizeTokenName(canonicalToken) || normalizeName(token);
        const fieldName = TOKEN_NAME_TO_PROFILE_FIELD[normalizedName];
        if (fieldName) setField(profile, fieldName, text, options);
        if (normalizedName === "external_customer") setField(profile, "contractorNumber", text, options);
        if (normalizedName === "external_lex_id") setField(profile, "lexId", text, options);
        if (normalizedName === "external_olt_name") setField(profile, "oltName", text, options);
        if (normalizedName === "external_olt_board") setField(profile, "oltBoard", text, options);
        setDynamic(profile, normalizedName, text, {
            ...options,
            label: humanizeName(normalizedName)
        });
    });
}

function applyManualInputs(profile, clientPayload) {
    const manualInputs = clientPayload?.[MANUAL_CLIENT_INPUTS_KEY];
    if (!manualInputs || typeof manualInputs !== "object" || Array.isArray(manualInputs)) return;

    Object.entries(manualInputs).forEach(([name, value]) => {
        setFieldOrDynamic(profile, name, value, {
            overwrite: true,
            label: humanizeName(name)
        });
    });
}

function assignVariable(target, name, value) {
    const variableName = toVariableName(name);
    const text = displayValue(value);
    if (!variableName || text === "" || RESERVED_PROFILE_VARIABLES.has(variableName)) return;
    if (Object.prototype.hasOwnProperty.call(target, variableName)) return;
    target[variableName] = text;
}

function finalizeProfile(profile, incomingTokenValues = {}) {
    const vars = {};
    const generatedTokenValues = {};
    const availableFields = [];

    FIELD_NAMES.forEach((name) => {
        const value = displayValue(profile.fields[name]);
        if (value === "") return;

        assignVariable(vars, name, value);
        const token = toToken(name);
        if (token) generatedTokenValues[token] = value;
        availableFields.push({
            key: name,
            label: FIELD_LABELS[name] || humanizeName(name),
            value
        });
    });

    Object.entries(profile.dynamic).forEach(([name, value]) => {
        const text = displayValue(value);
        if (text === "") return;
        assignVariable(vars, name, text);
        const token = toToken(name);
        if (token && !Object.prototype.hasOwnProperty.call(generatedTokenValues, token)) {
            generatedTokenValues[token] = text;
        }
        if (!profile.fields[name]) {
            availableFields.push({
                key: name,
                label: profile.fieldLabels[name] || humanizeName(name),
                value: text
            });
        }
    });

    const parsedExternalId = getValidParsedExternalId(profile.externalId);
    if (parsedExternalId) {
        Object.assign(generatedTokenValues, buildExternalTokenValues(parsedExternalId.fields));
    }
    if (isFilled(profile.soTicketNum)) {
        generatedTokenValues[SO_TICKET_NUM_TOKEN] = profile.soTicketNum;
    }

    const normalizedIncomingTokenValues = {};
    Object.entries(incomingTokenValues || {}).forEach(([token, value]) => {
        const canonicalToken = canonicalizeInputTokenValue(token) || token;
        normalizedIncomingTokenValues[canonicalToken] = value;
    });

    profile.vars = vars;
    profile.variables = vars;
    profile.tokenValues = {
        ...normalizedIncomingTokenValues,
        ...generatedTokenValues
    };
    profile.availableFields = availableFields;
    return profile;
}

export function buildCaseProfile({
    clientPayload = null,
    superOfficePayload = null,
    tokenValues = {}
} = {}) {
    const profile = createEmptyProfile();

    applyClientPayload(profile, clientPayload);
    applySuperOfficePayload(profile, superOfficePayload);
    applyTokenValues(profile, tokenValues);
    applyManualInputs(profile, clientPayload);

    return finalizeProfile(profile, tokenValues);
}

function profileField(profile, key, label = "") {
    const value = displayValue(profile?.[key] ?? profile?.fields?.[key]);
    return value ? { label: label || FIELD_LABELS[key] || humanizeName(key), value } : null;
}

function fieldFromValue(label, value) {
    const text = displayValue(value);
    return text ? { label, value: text } : null;
}

function compactFields(fields = []) {
    const seen = new Set();
    return fields.filter(Boolean).filter((field) => {
        const key = `${normalizeName(field.label)}:${field.value}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function section(id, title, fields = []) {
    const compact = compactFields(fields);
    return compact.length > 0 ? { id, title, fields: compact } : null;
}

export function getCaseProfileSummaryFields(profile = null) {
    if (!profile || typeof profile !== "object") return [];

    return compactFields([
        fieldFromValue("Name", profile.clientName),
        fieldFromValue("Mobile", firstValue(profile.mobile, profile.mobileRaw, profile.phone)),
        fieldFromValue("Contractor", firstValue(profile.contractorNumber, profile.externalCustomer, profile.customerId)),
        fieldFromValue("Activation", profile.activationDate),
        fieldFromValue("OTO ID", profile.otoId),
        fieldFromValue("Port", firstValue(profile.otoPortId, profile.crossConnectionPort)),
        fieldFromValue("SO ticket", profile.soTicketNum)
    ]);
}

export function getCaseReferenceFields(profile = null) {
    if (!profile || typeof profile !== "object") return [];

    const contractor = fieldFromValue("Contractor", firstValue(
        profile.contractorNumber,
        profile.externalCustomer,
        profile.customerId
    ));
    const superOfficeTicket = fieldFromValue("SO ticket", profile.soTicketNum);

    return [
        contractor && { key: "contractor", ...contractor },
        superOfficeTicket && { key: "so-ticket", ...superOfficeTicket }
    ].filter(Boolean);
}

export function getCaseProfileInfoSections(profile = null) {
    if (!profile || typeof profile !== "object") return [];

    return [
        section("caseClient", "Client", [
            profileField(profile, "clientName", "Full name"),
            profileField(profile, "contractorNumber", "Contractor"),
            profileField(profile, "title"),
            profileField(profile, "firstName"),
            profileField(profile, "lastName"),
            profileField(profile, "mobile"),
            profileField(profile, "mobileRaw", "Mobile raw"),
            profileField(profile, "phone"),
            profileField(profile, "email"),
            profileField(profile, "address"),
            profileField(profile, "communicationLanguage", "Language"),
            profileField(profile, "activationDate", "Activation date")
        ]),
        section("caseSuperOffice", "SuperOffice", [
            profileField(profile, "soTicketNum", "SO ticket"),
            profileField(profile, "ticketCreatedAt", "Created at"),
            profileField(profile, "externalId", "External ID"),
            profileField(profile, "externalPartner", "Partner"),
            profileField(profile, "externalPartnerTicketNumber", "Partner ticket")
        ]),
        section("caseExternalId", "External ID fields", [
            profileField(profile, "externalFlagging", "Flagging"),
            profileField(profile, "externalDate", "Date"),
            profileField(profile, "externalCustomer", "Contractor"),
            profileField(profile, "externalSignalStatus", "Signal"),
            profileField(profile, "externalLedStatus", "LED"),
            profileField(profile, "externalTreatmentStep", "Treatment"),
            profileField(profile, "externalBoxType", "Box"),
            profileField(profile, "externalLexId", "LEX ID"),
            profileField(profile, "externalOltName", "OLT"),
            profileField(profile, "externalOltBoard", "Board"),
            profileField(profile, "externalBokBof", "BOK/BOF"),
            profileField(profile, "externalComment", "Comment")
        ]),
        section("caseTechnical", "Technical", [
            profileField(profile, "fllRecordId", "FLL record"),
            profileField(profile, "otoId", "OTO ID"),
            profileField(profile, "otoPortId", "OTO port"),
            profileField(profile, "routerSerialNumber", "Router serial"),
            profileField(profile, "oldRouterSerialNumber", "Old router serial"),
            profileField(profile, "lexId", "LEX ID"),
            profileField(profile, "oltName", "OLT"),
            profileField(profile, "oltBoard", "OLT board"),
            profileField(profile, "ponPort", "PON port"),
            profileField(profile, "breakoutCableId", "Breakout cable"),
            profileField(profile, "fiberNumber", "Fiber number"),
            profileField(profile, "lineState", "Line state"),
            profileField(profile, "routerStatus", "Router status"),
            profileField(profile, "crossConnectionPort", "Cross connection port")
        ])
    ].filter(Boolean);
}
