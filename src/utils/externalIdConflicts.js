import { SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";
import { buildExternalFieldsFromClientPayload } from "./externalGenerator.js";

export const EXTERNAL_CUSTOMER_TOKEN = "{external_customer}";
const CONTRACTOR_TOKENS = ["{contractor}", "{contractor_number}", "{client_contractor_number}"];

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
    if (valuesMatch(externalValue, expectedValue)) return;

    conflicts.push({
        ...conflict,
        externalValue,
        expectedValue
    });
}

function getVtiContractor(payload) {
    const result = buildExternalFieldsFromClientPayload(payload);
    return result.ok ? textValue(result.fields.customer) : "";
}

export function getExternalIdSourceConflicts(importResult = {}, clientPayload = null) {
    const conflicts = [];
    const tokenValues = importResult?.tokenValues || {};
    const externalFields = importResult?.externalFields || {};

    addConflict(conflicts, {
        field: "customer",
        token: EXTERNAL_CUSTOMER_TOKEN,
        label: "Contractor",
        sourceLabel: "VTI customer data",
        externalValue: externalFields.customer ?? tokenValues[EXTERNAL_CUSTOMER_TOKEN],
        expectedValue: getVtiContractor(clientPayload)
    });

    addConflict(conflicts, {
        field: "soTicket",
        token: SO_TICKET_NUM_TOKEN,
        label: "SO ticket number",
        sourceLabel: "SO ticket JSON",
        externalValue: externalFields.soTicket ?? tokenValues[SO_TICKET_NUM_TOKEN],
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
