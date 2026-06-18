import assert from "node:assert/strict";
import {
  formatTestImportPayload,
  TEST_SO_IMPORT_PAYLOAD,
  TEST_VTI_IMPORT_PAYLOAD
} from "../src/data/testImportPayloads.js";
import { parseClientClipboardJSON } from "../src/utils/clientClipboard.js";
import {
  groupSuperOfficeImageAttachmentsByDate,
  parseSuperOfficeInfoPayload
} from "../src/utils/superOfficeImport.js";
import { getExternalIdSourceConflicts } from "../src/utils/externalIdConflicts.js";

{
  const parsed = parseClientClipboardJSON(formatTestImportPayload(TEST_VTI_IMPORT_PAYLOAD));
  assert.equal(parsed.client.contractorNumber, "31447756");
  assert.equal(parsed.healthcheck.lexId, "69VEV");
}

{
  const result = parseSuperOfficeInfoPayload(formatTestImportPayload(TEST_SO_IMPORT_PAYLOAD));
  assert.equal(result.ok, true);
  assert.equal(result.sourceTicketId, "31436062");
  assert.equal(result.externalIdValid, true);
  assert.equal(result.imageAttachments.length, 3);

  const groups = groupSuperOfficeImageAttachmentsByDate(result.attachments);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].dateKey, "2026-06-13");

  const conflicts = getExternalIdSourceConflicts(result, TEST_VTI_IMPORT_PAYLOAD);
  assert.equal(conflicts.length, 5);
  assert.deepEqual(conflicts.map((conflict) => conflict.field), [
    "customer",
    "oltName",
    "oltBoard",
    "bokBof",
    "soTicket"
  ]);
  assert.deepEqual(conflicts.map((conflict) => conflict.expectedValue), [
    "31447756",
    "1",
    "2",
    "KP100314-C0036|8",
    "31436062"
  ]);
}

console.log("testImportPayloads tests passed");
