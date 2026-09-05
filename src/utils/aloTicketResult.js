import { EXTERNAL_DEFAULT_FIELDS, buildExternalFieldsFromClientPayload, formatDateForInput } from "./externalGenerator.js";

// Kept self-contained so the extension build can reuse this exact DOM reader.
export function extractAloTicketResult(documentRoot, pageUrl) {
    const url = new URL(pageUrl);
    if (url.origin !== "https://wholesale.swisscom.com"
        || !url.pathname.startsWith("/wsg/prod/alo/ass/web/alo-web/assurance/")) return null;

    const labels = Array.from(documentRoot.querySelectorAll(".tooltipCode"));
    const labelFor = (key) => labels.find((label) => label.textContent.trim() === `translationId=${key}`);
    if (!labelFor("alo.assurance.detail.title")) return null;
    const read = (key) => {
        const value = labelFor(key)?.closest("td")?.nextElementSibling?.textContent?.trim() || "";
        return value === "-" ? "" : value;
    };
    const incidentId = read("global.incidentId");
    if (!/^\d+$/.test(incidentId)) return null;
    const action = documentRoot.querySelector("form#formCommand")?.getAttribute("action");
    const actionId = action ? new URL(action, url).searchParams.get("ttId") : null;
    const urlId = url.searchParams.get("ttId");
    if ((!actionId && !urlId) || (actionId && actionId !== incidentId) || (urlId && urlId !== incidentId)) return null;

    return {
        incidentId,
        externalReference: read("global.extRef"),
        socketId: read("global.otoId"),
        state: read("global.incidentState"),
        createdAt: read("global.incidentCreatonDateTime")
    };
}

export function buildAloExternalIdFields({
    clientPayload, soTicket = "", existingFields = {}, preparation = {}, incidentId = "", date = new Date()
}) {
    const clientFields = buildExternalFieldsFromClientPayload(clientPayload);
    return {
        ...EXTERNAL_DEFAULT_FIELDS,
        ...existingFields,
        ...(clientFields.ok ? clientFields.fields : {}),
        data: formatDateForInput(date),
        soTicket,
        SignalStatus: preparation.aloType === "lowBadRxTx"
            ? "Low RX|TX"
            : preparation.signalState === "never" ? "Never" : "Lost",
        treatmentStep: "FLL Ticket",
        partner: "ALO",
        partnerTicketNumber: incidentId
    };
}
