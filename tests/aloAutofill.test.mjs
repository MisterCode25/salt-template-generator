import assert from "node:assert/strict";
import {
  ALO_AUTOFILL_CLIPBOARD_SOURCE,
  buildAloAutofillBookmarklet,
  buildAloAutofillPayload,
  formatAloAutofillPayload
} from "../src/utils/aloAutofill.js";
import {
  TEST_SO_IMPORT_PAYLOAD,
  TEST_VTI_IMPORT_PAYLOAD
} from "../src/data/testImportPayloads.js";

const agentProfile = {
  firstName: "Samir",
  lastName: "Mestari",
  email: "samir@example.test",
  phoneNumber: "+41 79 000 00 00"
};

{
  const payload = buildAloAutofillPayload(TEST_VTI_IMPORT_PAYLOAD, agentProfile, TEST_SO_IMPORT_PAYLOAD);

  assert.equal(payload.source, ALO_AUTOFILL_CLIPBOARD_SOURCE);
  assert.equal(payload.version, 1);
  assert.equal(payload.fields.externalReference, "31436062");
  assert.equal(payload.fields.socketId, "B.111.783.391.7");
  assert.equal(payload.fields.plugNr, "3");
  assert.equal(payload.fields.breakoutCable, "KP100314-C0036");
  assert.equal(payload.fields.breakoutFiber, "8");
  assert.equal(payload.fields.firstName, "Peter manuel");
  assert.equal(payload.fields.lastName, "BILLIG");
  assert.equal(payload.fields.contactPhone1, "41788451664");
  assert.equal(payload.fields.contactPhone2, "41789125685");
  assert.equal(payload.fields.contactEmail, "pierremb@gmail.com");
  assert.equal(payload.fields.ispFirstName, "Samir");
  assert.equal(payload.fields.ispLastName, "Mestari");
  assert.equal(payload.fields.ispPhone, "+41 79 000 00 00");
  assert.equal(payload.fields.ispEmail, "samir@example.test");
  assert.equal(payload.fields.problemCode1, "400");
  assert.equal(payload.fields.problemCode2, "800");
  assert.equal(payload.fields.problemCode3, "900");
}

{
  const parsed = JSON.parse(formatAloAutofillPayload(TEST_VTI_IMPORT_PAYLOAD, agentProfile, TEST_SO_IMPORT_PAYLOAD));
  assert.equal(parsed.source, ALO_AUTOFILL_CLIPBOARD_SOURCE);
  assert.equal(parsed.fields.problemDescription, "No signal");
}

{
  const bookmarklet = buildAloAutofillBookmarklet();

  assert.ok(bookmarklet.startsWith("javascript:(function aloAutofillBookmarkletRunner("));
  assert.match(bookmarklet, /saltAloFillOverlay/);
  assert.match(bookmarklet, /byAttribute\("name", id\)/);
  assert.match(bookmarklet, /ticket\.socketId/);
  assert.match(bookmarklet, /ticket\.contactPersonIspFirstName/);
  assert.match(bookmarklet, /ticket\.contactPersonIspMail/);
  assert.match(bookmarklet, /ticket\.problemCode3/);
}

console.log("aloAutofill tests passed");
