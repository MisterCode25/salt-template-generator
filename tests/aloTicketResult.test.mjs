import assert from "node:assert/strict";
import { buildAloExternalIdFields, extractAloTicketResult } from "../src/utils/aloTicketResult.js";
import { buildExternalCode, parseExternalId } from "../src/utils/externalGenerator.js";

function resultDocument(patch = {}) {
  const labels = {
    "alo.assurance.detail.title": "",
    "global.incidentId": "2336981",
    "global.incidentState": "PENDING",
    "global.incidentCreatonDateTime": "05.09.2026 10:55:11",
    "global.extRef": "57982517",
    "global.swisscomRef": "INC000014852874",
    "global.otoId": "B.110.705.978.X",
    ...patch
  };
  return {
    querySelectorAll: () => Object.entries(labels).map(([key, value]) => ({
      textContent: `translationId=${key}`,
      closest: () => ({ nextElementSibling: { textContent: value } })
    })),
    querySelector: () => ({ getAttribute: () => "detail.do?ttId=2336981" })
  };
}
const url = "https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/detail.do?ttId=2336981";
const result = extractAloTicketResult(resultDocument(), url);
assert.equal(result.incidentId, "2336981");
assert.equal(result.externalReference, "57982517");
assert.equal(result.socketId, "B.110.705.978.X");
assert.equal(extractAloTicketResult(resultDocument({ "global.incidentId": "INC000014852874" }), url), null);
assert.equal(extractAloTicketResult(resultDocument({ "global.incidentId": "9999999" }), url), null);
assert.equal(extractAloTicketResult(resultDocument(), url.replace("/assurance/", "/fulfillment/")), null);
assert.equal(extractAloTicketResult(resultDocument(), url.replace("wholesale.swisscom.com", "example.com")), null);
assert.equal(extractAloTicketResult({ querySelectorAll: () => [] }, url), null);

const client = { client: { contractorNumber: "12345678" }, healthcheck: {
  routerSerialNumber: "SAGEM-123", lexId: "LEX1", oltName: "OLT1", oltBoard: "3",
  breakoutCableId: "2", fiberNumber: "4"
} };
const fields = buildAloExternalIdFields({
  clientPayload: client, soTicket: "31436062", existingFields: { LedStatus: "Fiber Red", comment: "Keep this" },
  preparation: { aloType: "noSignal", signalState: "never" }, incidentId: result.incidentId,
  date: new Date(2026, 8, 5)
});
const parsed = parseExternalId(buildExternalCode(fields));
assert.equal(parsed.fields.treatmentStep, "FLL Ticket");
assert.equal(parsed.fields.partner, "ALO");
assert.equal(parsed.fields.partnerTicketNumber, "2336981");
assert.equal(parsed.fields.soTicket, "31436062");
assert.equal(parsed.fields.customer, "12345678");
assert.equal(parsed.fields.SignalStatus, "Never");
assert.equal(parsed.fields.LedStatus, "Fiber Red");
assert.equal(parsed.fields.comment, "Keep this");
assert.equal(parsed.fields.oltName, "OLT1");
assert.equal(fields.data, "2026-09-05");
assert.equal(buildAloExternalIdFields({ clientPayload: client, preparation: { aloType: "lowBadRxTx", signalState: "lost" } }).SignalStatus, "Low RX|TX");
assert.equal(buildAloExternalIdFields({ clientPayload: client }).LedStatus, "");
console.log("aloTicketResult tests passed");
