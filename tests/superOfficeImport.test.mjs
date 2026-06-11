import assert from "node:assert/strict";
import { parseSuperOfficeInfoPayload } from "../src/utils/superOfficeImport.js";

{
  const result = parseSuperOfficeInfoPayload(JSON.stringify({
    ticketId: "232",
    externalTicketId: "VALID//26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment"
  }));

  assert.equal(result.ok, true);
  assert.equal(result.ticketId, "232");
  assert.equal(result.externalIdValid, true);
  assert.equal(result.ignoredExternalId, false);
  assert.equal(result.tokenValues["{so_ticket_num}"], "232");
  assert.equal(result.tokenValues["{external_partner}"], "EWB");
  assert.equal(result.tokenValues["{external_partner_ticket_number}"], "ABC");
  assert.equal(result.tokenValues["{external_comment}"], undefined);
}

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "31436062",
    externalTicketId: "nothing useful here"
  });

  assert.equal(result.ok, true);
  assert.equal(result.externalIdValid, false);
  assert.equal(result.ignoredExternalId, true);
  assert.deepEqual(result.tokenValues, {
    "{so_ticket_num}": "31436062"
  });
}

{
  const result = parseSuperOfficeInfoPayload("{ bad json");
  assert.equal(result.ok, false);
  assert.equal(result.error, "INVALID_SUPER_OFFICE_JSON");
}

{
  const result = parseSuperOfficeInfoPayload({ externalTicketId: "bad format" });
  assert.equal(result.ok, false);
  assert.equal(result.error, "EMPTY_SUPER_OFFICE_DATA");
}

console.log("superOfficeImport tests passed");
