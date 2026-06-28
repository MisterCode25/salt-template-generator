import assert from "node:assert/strict";
import {
  formatTestImportPayload,
  getTestImportScenario,
  TEST_IMPORT_SCENARIOS,
  TEST_SO_CONFLICT_IMPORT_PAYLOAD,
  TEST_SO_INVALID_EXTERNAL_ID_IMPORT_PAYLOAD,
  TEST_SO_IMPORT_PAYLOAD,
  TEST_SO_MISSING_EXTERNAL_ID_IMPORT_PAYLOAD,
  TEST_VTI_IMPORT_PAYLOAD,
  TEST_VTI_MISSING_HEALTHCHECK_IMPORT_PAYLOAD
} from "../src/data/testImportPayloads.js";
import { parseClientClipboardJSON } from "../src/utils/clientClipboard.js";
import {
  groupSuperOfficeImageAttachmentsByDate,
  parseSuperOfficeInfoPayload
} from "../src/utils/superOfficeImport.js";
import { getExternalIdSourceConflicts } from "../src/utils/externalIdConflicts.js";

{
  assert.ok(TEST_IMPORT_SCENARIOS.length >= 5);
  assert.equal(new Set(TEST_IMPORT_SCENARIOS.map((scenario) => scenario.id)).size, TEST_IMPORT_SCENARIOS.length);
  assert.equal(getTestImportScenario("normal")?.soPayload, TEST_SO_IMPORT_PAYLOAD);
  assert.equal(getTestImportScenario("conflict")?.soPayload, TEST_SO_CONFLICT_IMPORT_PAYLOAD);

  TEST_IMPORT_SCENARIOS.forEach((scenario) => {
    assert.ok(scenario.title);
    assert.ok(scenario.summary);
    assert.ok(scenario.soPayload || scenario.vtiPayload);
  });
}

{
  const parsed = parseClientClipboardJSON(formatTestImportPayload(TEST_VTI_IMPORT_PAYLOAD));
  assert.equal(parsed.client.contractorNumber, "31447756");
  assert.equal(parsed.healthcheck.lexId, "69VEV");
}

{
  const parsed = parseClientClipboardJSON(formatTestImportPayload(TEST_VTI_MISSING_HEALTHCHECK_IMPORT_PAYLOAD));
  assert.equal(parsed.client.contractorNumber, "31447756");
  assert.equal(parsed.healthcheck, undefined);
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
  assert.equal(conflicts.length, 0);
}

{
  const result = parseSuperOfficeInfoPayload(formatTestImportPayload(TEST_SO_CONFLICT_IMPORT_PAYLOAD));
  assert.equal(result.ok, true);
  assert.equal(result.sourceTicketId, "31436062");
  assert.equal(result.externalIdValid, true);

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

{
  const result = parseSuperOfficeInfoPayload(formatTestImportPayload(TEST_SO_MISSING_EXTERNAL_ID_IMPORT_PAYLOAD));
  assert.equal(result.ok, true);
  assert.equal(result.sourceTicketId, "31436062");
  assert.equal(result.externalIdValid, false);
  assert.equal(result.ignoredExternalId, false);
  assert.equal(result.externalTicketId, "");
  assert.equal(result.imageAttachments.length, 3);
  assert.equal(getExternalIdSourceConflicts(result, TEST_VTI_IMPORT_PAYLOAD).length, 0);
}

{
  const result = parseSuperOfficeInfoPayload(formatTestImportPayload(TEST_SO_INVALID_EXTERNAL_ID_IMPORT_PAYLOAD));
  assert.equal(result.ok, true);
  assert.equal(result.sourceTicketId, "31436062");
  assert.equal(result.externalIdValid, false);
  assert.equal(result.ignoredExternalId, true);
  assert.equal(result.externalTicketId, "INVALID-EXTERNAL-ID-FOR-TEST");
  assert.equal(result.imageAttachments.length, 3);
  assert.equal(getExternalIdSourceConflicts(result, TEST_VTI_IMPORT_PAYLOAD).length, 0);
}

console.log("testImportPayloads tests passed");
