import { SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";
import {
    buildExternalCode,
    buildExternalFieldsFromClientPayload,
    EXTERNAL_SYSTEM_TOKEN_FIELDS,
    buildExternalTokenValues,
    parseExternalId
} from "./externalGenerator.js";
import { buildClientTokenIndex, normalizeClientTokenName } from "./clientClipboard.js";

export const EXTERNAL_CUSTOMER_TOKEN = "{external_customer}";
const CONTRACTOR_TOKENS = ["{contractor}", "{contractor_number}", "{client_contractor_number}"];
const EXTERNAL_TOKEN_BY_FIELD = Object.freeze(Object.fromEntries(
    EXTERNAL_SYSTEM_TOKEN_FIELDS.map(({ field, token }) => [field, token])
));
const EXTERNAL_SYSTEM_TOKEN_SET = new Set(EXTERNAL_SYSTEM_TOKEN_FIELDS.map(({ token }) => token));
const VTI_EXTERNAL_FIELD_CONFLICTS = Object.freeze([
    { field: "customer", label: "Contractor", sourceLabel: "VTI customer data", token: EXTERNAL_CUSTOMER_TOKEN },
    { field: "boxType", label: "Box type", sourceLabel: "VTI router data", token: EXTERNAL_TOKEN_BY_FIELD.boxType },
    { field: "lexId", label: "LEX ID", sourceLabel: "VTI healthcheck data", token: EXTERNAL_TOKEN_BY_FIELD.lexId },
    { field: "oltName", label: "OLT", sourceLabel: "VTI healthcheck data", token: EXTERNAL_TOKEN_BY_FIELD.oltName },
    { field: "oltBoard", label: "OLT board", sourceLabel: "VTI healthcheck data", token: EXTERNAL_TOKEN_BY_FIELD.oltBoard },
    { field: "bokBof", label: "BOK/BOF", sourceLabel: "VTI healthcheck data", token: EXTERNAL_TOKEN_BY_FIELD.bokBof }
]);

function normalizeComparableValue(value) {
    return String(value ?? "").trim().replace(/\s+/g, "");
}

function textValue(value) {
    return String(value ?? "").trim();
}

function valuesMatch(a, b) {
    const left = normalizeComparableValue(a);
    const right = normalizeComparableValue(b);
    return left !== "" && right !== "" && left === right;
}

function addConflict(conflicts, conflict) {
    const expectedValue = textValue(conflict.expectedValue);
    if (!expectedValue) return;

    const externalValue = textValue(conflict.externalValue);
    if (!externalValue) return;
    if (valuesMatch(externalValue, expectedValue)) return;
    if (conflict.clientKey && conflicts.some((entry) => entry.clientKey === conflict.clientKey)) return;

    conflicts.push({
        ...conflict,
        externalValue,
        expectedValue
    });
}

function getVtiExternalFields(payload) {
    const result = buildExternalFieldsFromClientPayload(payload);
    return result.ok ? result.fields : {};
}

function getExternalFields(importResult = {}) {
    if (importResult?.externalFields && typeof importResult.externalFields === "object" && !Array.isArray(importResult.externalFields)) {
        return importResult.externalFields;
    }

    const parsed = parseExternalId(importResult?.externalTicketId);
    return parsed.ok ? parsed.fields : null;
}

function rawTokenName(token = "") {
    return String(token ?? "").trim().replace(/[{}]/g, "");
}

function tokenClientKeyCandidates(token = "") {
    const rawName = rawTokenName(token);
    const normalized = normalizeClientTokenName(rawName);
    const candidates = new Set([normalized]);
    const prefixPattern = /^(external|so|superoffice|super_office|vti|client|customer)(.+)$/;
    const normalizedPrefixMatch = normalized.match(prefixPattern);
    if (normalizedPrefixMatch?.[2]) candidates.add(normalizedPrefixMatch[2]);

    const parts = rawName
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean);
    if (parts.length > 1) {
        const firstPart = normalizeClientTokenName(parts[0]);
        if (["external", "so", "superoffice", "vti", "client", "customer"].includes(firstPart)) {
            candidates.add(normalizeClientTokenName(parts.slice(1).join(" ")));
        }
    }

    return Array.from(candidates).filter(Boolean);
}

function findClientTokenMatch(clientIndex, token = "") {
    for (const candidate of tokenClientKeyCandidates(token)) {
        if (clientIndex.has(candidate)) {
            return {
                clientKey: candidate,
                value: clientIndex.get(candidate)
            };
        }
    }
    return null;
}

function formatTokenConflictLabel(token = "") {
    const rawName = rawTokenName(token)
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .trim();
    const withoutSourcePrefix = rawName.replace(/^(external|so|super office|superoffice|vti)\s+/i, "");
    const label = withoutSourcePrefix || rawName || "Field";
    return label
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.length <= 3 ? word.toUpperCase() : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(" ");
}

function shouldSkipGenericTokenConflict(token = "", externalFields = null) {
    if (token === SO_TICKET_NUM_TOKEN) return true;
    if (EXTERNAL_SYSTEM_TOKEN_SET.has(token)) return true;
    return Boolean(externalFields?.customer && CONTRACTOR_TOKENS.includes(token));
}

export function getExternalIdSourceConflicts(importResult = {}, clientPayload = null) {
    const conflicts = [];
    const tokenValues = importResult?.tokenValues || {};
    const externalFields = getExternalFields(importResult);
    const vtiFields = getVtiExternalFields(clientPayload);
    const clientIndex = buildClientTokenIndex(clientPayload);

    VTI_EXTERNAL_FIELD_CONFLICTS.forEach(({ field, label, sourceLabel, token }) => {
        addConflict(conflicts, {
            field,
            token,
            label,
            sourceLabel,
            clientKey: normalizeClientTokenName(field === "customer" ? "contractor" : field),
            externalValue: externalFields?.[field] ?? tokenValues[token],
            expectedValue: vtiFields[field]
        });
    });

    addConflict(conflicts, {
        field: "soTicket",
        token: SO_TICKET_NUM_TOKEN,
        label: "SO ticket number",
        sourceLabel: "SO ticket JSON",
        externalValue: externalFields?.soTicket ?? tokenValues[SO_TICKET_NUM_TOKEN],
        expectedValue: importResult?.sourceTicketId
    });

    Object.entries(tokenValues).forEach(([token, value]) => {
        if (shouldSkipGenericTokenConflict(token, externalFields)) return;
        const clientMatch = findClientTokenMatch(clientIndex, token);
        if (!clientMatch) return;
        addConflict(conflicts, {
            field: rawTokenName(token),
            token,
            label: formatTokenConflictLabel(token),
            sourceLabel: "VTI client data",
            clientKey: clientMatch.clientKey,
            externalValue: value,
            expectedValue: clientMatch.value
        });
    });

    return conflicts;
}

export function applyExternalIdSourceCorrections(tokenValues = {}, conflicts = []) {
    const corrected = { ...tokenValues };
    conflicts.forEach((conflict) => {
        if (!conflict?.token) return;
        const expectedValue = textValue(conflict.expectedValue);
        corrected[conflict.token] = expectedValue;
        if (conflict.field === "customer") {
            CONTRACTOR_TOKENS.forEach((token) => {
                if (Object.prototype.hasOwnProperty.call(corrected, token)) corrected[token] = expectedValue;
            });
        }
    });
    return corrected;
}

export function applyExternalIdSourceCorrectionsToImportResult(importResult = {}, conflicts = []) {
    const correctedTokenValues = applyExternalIdSourceCorrections(importResult.tokenValues || {}, conflicts);
    const externalFields = getExternalFields(importResult);
    if (!externalFields) {
        return {
            ...importResult,
            tokenValues: correctedTokenValues
        };
    }

    const correctedExternalFields = { ...externalFields };
    conflicts.forEach((conflict) => {
        if (!conflict?.field || !Object.prototype.hasOwnProperty.call(correctedExternalFields, conflict.field)) return;
        correctedExternalFields[conflict.field] = textValue(conflict.expectedValue);
    });

    return {
        ...importResult,
        externalTicketId: buildExternalCode(correctedExternalFields),
        externalIdValid: true,
        ignoredExternalId: false,
        externalFields: correctedExternalFields,
        contractorNumber: correctedExternalFields.customer || importResult.contractorNumber || "",
        tokenValues: {
            ...buildExternalTokenValues(correctedExternalFields),
            ...correctedTokenValues
        }
    };
}

export function applyExternalIdValuesToImportResult(importResult = {}) {
    const externalFields = getExternalFields(importResult);
    if (!externalFields) {
        return {
            ...importResult,
            tokenValues: importResult.tokenValues || {}
        };
    }

    const tokenValues = {
        ...(importResult.tokenValues || {}),
        ...buildExternalTokenValues(externalFields)
    };
    const contractorNumber = textValue(externalFields.customer);
    if (contractorNumber) {
        CONTRACTOR_TOKENS.forEach((token) => {
            tokenValues[token] = contractorNumber;
        });
    }

    return {
        ...importResult,
        externalFields,
        externalIdValid: true,
        ignoredExternalId: false,
        contractorNumber: contractorNumber || importResult.contractorNumber || "",
        tokenValues
    };
}

export function applyExternalIdConflictSelectionsToImportResult(importResult = {}, conflicts = [], selections = {}) {
    const baseImportResult = applyExternalIdValuesToImportResult(importResult);
    const sourceConflicts = conflicts.filter((conflict) => (
        selections?.[conflict.field] !== "external"
    ));
    return applyExternalIdSourceCorrectionsToImportResult(baseImportResult, sourceConflicts);
}
