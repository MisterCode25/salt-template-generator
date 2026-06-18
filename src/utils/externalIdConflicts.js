import { SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";
import {
    buildExternalCode,
    buildExternalFieldsFromClientPayload,
    EXTERNAL_SYSTEM_TOKEN_FIELDS,
    buildExternalTokenValues,
    parseExternalId
} from "./externalGenerator.js";

export const EXTERNAL_CUSTOMER_TOKEN = "{external_customer}";
const CONTRACTOR_TOKENS = ["{contractor}", "{contractor_number}", "{client_contractor_number}"];
const EXTERNAL_TOKEN_BY_FIELD = Object.freeze(Object.fromEntries(
    EXTERNAL_SYSTEM_TOKEN_FIELDS.map(({ field, token }) => [field, token])
));
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

export function getExternalIdSourceConflicts(importResult = {}, clientPayload = null) {
    const conflicts = [];
    const tokenValues = importResult?.tokenValues || {};
    const externalFields = getExternalFields(importResult);
    const vtiFields = getVtiExternalFields(clientPayload);

    VTI_EXTERNAL_FIELD_CONFLICTS.forEach(({ field, label, sourceLabel, token }) => {
        addConflict(conflicts, {
            field,
            token,
            label,
            sourceLabel,
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
