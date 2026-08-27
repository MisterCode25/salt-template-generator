import assert from "node:assert/strict";
import {
  ALO_AUTOFILL_CLIPBOARD_SOURCE,
  ALO_FULFILLMENT_DETAIL_URL,
  ALO_TICKET_CREATION_URL,
  buildAloAutofillBookmarklet,
  buildAloAutofillBetaBookmarklet,
  buildAloAutofillPayload,
  buildAloPreparationDefaults,
  buildAloTemplateTokenValues,
  extractAloExternalReference,
  formatAloAutofillPayload,
  openAloTicketCreationPage,
  resolveAloTemplateWithProblemDate
} from "../src/utils/aloAutofill.js";
import { buildAloPreparationSteps } from "../src/utils/aloPreparationFlow.js";
import { CASE_PROBLEM_DATE_TOKEN } from "../src/utils/caseDateTokens.js";
import { applyTokens } from "../src/core/tokenEngine.js";
import {
  TEST_SO_IMPORT_PAYLOAD,
  TEST_VTI_IMPORT_PAYLOAD
} from "../src/data/testImportPayloads.js";
import { buildExternalCode } from "../src/utils/externalGenerator.js";

const agentProfile = {
  firstName: "Samir",
  lastName: "Mestari",
  email: "samir@example.test",
  phoneNumber: "+41 79 000 00 00"
};

assert.equal(
  ALO_TICKET_CREATION_URL,
  "https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do?clearModel=true"
);

{
  const calls = [];
  openAloTicketCreationPage((...args) => calls.push(args));
  assert.deepEqual(calls, [[ALO_TICKET_CREATION_URL, "_blank", "noopener,noreferrer"]]);
}

{
  const payload = buildAloAutofillPayload(TEST_VTI_IMPORT_PAYLOAD, agentProfile, TEST_SO_IMPORT_PAYLOAD);

  assert.equal(payload.source, ALO_AUTOFILL_CLIPBOARD_SOURCE);
  assert.equal(payload.version, 1);
  assert.equal(payload.alo.orderId, "10031420260327025732000000");
  assert.equal(payload.fields.externalReference, "");
  assert.equal(payload.fields.socketId, "B.111.783.391.7");
  assert.equal(payload.fields.plugNr, "3");
  assert.equal(payload.fields.breakoutCable, "KP100314-C0036");
  assert.equal(payload.fields.breakoutFiber, "8");
  assert.equal(payload.fields.firstName, "Peter manuel");
  assert.equal(payload.fields.lastName, "BILLIG");
  assert.equal(payload.fields.contactPhone1, "41788451664");
  assert.equal(payload.fields.contactPhone2, "0789125685");
  assert.equal(payload.fields.contactEmail, "pierremb@gmail.com");
  assert.equal(payload.fields.notificationType, "Email");
  assert.equal(payload.fields.preferredContactType, "Mobile");
  assert.equal(payload.fields.ispFirstName, "Samir");
  assert.equal(payload.fields.ispLastName, "Mestari");
  assert.equal(payload.fields.ispPhone, "+41 79 000 00 00");
  assert.equal(payload.fields.ispEmail, "samir@example.test");
  assert.equal(payload.fields.problemCode1, "400");
  assert.equal(payload.fields.problemCode2, "800");
  assert.equal(payload.fields.problemCode3, "900");
}

{
  const payload = buildAloAutofillPayload({
    ...TEST_VTI_IMPORT_PAYLOAD,
    client: {
      ...TEST_VTI_IMPORT_PAYLOAD.client,
      mobile: "",
      mobileRaw: "41789125685"
    }
  }, agentProfile, TEST_SO_IMPORT_PAYLOAD);

  assert.equal(payload.fields.contactPhone2, "0789125685");
}

{
  const parsed = JSON.parse(formatAloAutofillPayload(TEST_VTI_IMPORT_PAYLOAD, agentProfile, TEST_SO_IMPORT_PAYLOAD));
  assert.equal(parsed.source, ALO_AUTOFILL_CLIPBOARD_SOURCE);
  assert.equal(parsed.fields.problemDescription, "No signal");
}

{
  const defaults = buildAloPreparationDefaults(TEST_VTI_IMPORT_PAYLOAD, TEST_SO_IMPORT_PAYLOAD);
  assert.equal(defaults.aloType, "");
  assert.equal(defaults.signalState, "lost");
  assert.equal(defaults.extRef, undefined);
  assert.equal(defaults.activationDate, "2026-06-20");
  assert.equal(defaults.description, "");
}

{
  const steps = buildAloPreparationSteps({
    signalState: "lost",
    hasTemplates: true
  });
  assert.deepEqual(steps.map((step) => step.key), [
    "aloType",
    "signalState",
    "disconnectionDate",
    "selectedTemplateId"
  ]);
  assert.equal(steps.some((step) => step.key === "extRef"), false);
  assert.equal(steps.some((step) => step.key === "notesMode" || step.kind === "textarea"), false);
  const lostDateStep = steps.find((step) => step.key === "disconnectionDate");
  assert.equal(lostDateStep.inputType, "text");
  assert.equal(lostDateStep.inputFormat, "localized-date");
  assert.equal(lostDateStep.placeholder, "DD.MM.YYYY");

  const neverSteps = buildAloPreparationSteps({
    signalState: "never",
    hasTemplates: true
  });
  assert.deepEqual(neverSteps.map((step) => step.key), [
    "aloType",
    "signalState",
    "activationDate",
    "selectedTemplateId"
  ]);
}

{
  const lostValues = buildAloTemplateTokenValues({
    signalState: "lost",
    disconnectionDate: "2026-06-04",
    activationDate: "2026-06-20"
  });
  assert.equal(lostValues[CASE_PROBLEM_DATE_TOKEN], "04.06.2026");
  assert.equal(
    applyTokens("Signal lost on {case_problem_date}", lostValues),
    "Signal lost on 04.06.2026"
  );

  const neverValues = buildAloTemplateTokenValues({
    signalState: "never",
    disconnectionDate: "2026-06-04",
    activationDate: "2026-06-20"
  });
  assert.equal(neverValues[CASE_PROBLEM_DATE_TOKEN], "20.06.2026");
}

{
  const model = { text_fr: "Date du problème : {case_problem_date}" };
  let receivedOverrides = null;
  const resolved = resolveAloTemplateWithProblemDate(
    model,
    { signalState: "lost", disconnectionDate: "2026-06-03" },
    (selectedModel, overrides) => {
      receivedOverrides = overrides;
      return {
        text: applyTokens(selectedModel.text_fr, overrides),
        missingTokens: []
      };
    }
  );

  assert.equal(receivedOverrides[CASE_PROBLEM_DATE_TOKEN], "03.06.2026");
  assert.equal(resolved.text, "Date du problème : 03.06.2026");
}

{
  const defaults = buildAloPreparationDefaults(TEST_VTI_IMPORT_PAYLOAD, {
    ...TEST_SO_IMPORT_PAYLOAD,
    externalTicketId: buildExternalCode({
      data: "2026-06-20",
      customer: "31447756",
      soTicket: "31436062",
      SignalStatus: "Low RX|TX",
      LedStatus: "Other",
      treatmentStep: "Other",
      partner: "ALO"
    })
  });

  assert.equal(defaults.aloType, "");
  assert.equal(defaults.signalState, "");
  assert.equal(defaults.description, "");
}

{
  const defaults = buildAloPreparationDefaults(TEST_VTI_IMPORT_PAYLOAD, {
    ...TEST_SO_IMPORT_PAYLOAD,
    createdAt: "6/4/2026 12:07 PM",
    firstPostAt: "03.06.2026 09:15"
  });

  assert.equal(defaults.disconnectionDate, "2026-06-03");
}

{
  const defaults = buildAloPreparationDefaults(TEST_VTI_IMPORT_PAYLOAD, {
    ...TEST_SO_IMPORT_PAYLOAD,
    firstPostAt: "03.06.2026 09:15"
  });

  assert.equal(defaults.disconnectionDate, "2026-06-03");
}

{
  const defaults = buildAloPreparationDefaults(TEST_VTI_IMPORT_PAYLOAD, {
    ticketId: "31436062",
    createdAt: "6/4/2026 12:07 PM"
  });

  assert.equal(defaults.signalState, "");
  assert.equal(defaults.disconnectionDate, "");
}

{
  const defaults = buildAloPreparationDefaults(TEST_VTI_IMPORT_PAYLOAD, {
    ...TEST_SO_IMPORT_PAYLOAD,
    attachments: [
      { messageIndex: 1, date: "04.06.2026 11:00" },
      { messageIndex: 0, date: "02.06.2026 08:30" }
    ]
  });

  assert.equal(defaults.disconnectionDate, "2026-06-02");
}

{
  const payload = buildAloAutofillPayload(TEST_VTI_IMPORT_PAYLOAD, agentProfile, TEST_SO_IMPORT_PAYLOAD, {
    aloType: "lowBadRxTx",
    signalState: "never",
    extRef: "SO-123",
    activationDate: "2026-06-20",
    description: "Bad signal",
    notes: "Bad signal - Never activated - 20.06.2026"
  });

  assert.equal(payload.fields.externalReference, "SO-123");
  assert.equal(payload.fields.problemDescription, "Bad signal");
  assert.equal(payload.fields.problemNotes, "Bad signal - Never activated - 20.06.2026");
  assert.equal(payload.fields.problemDateTime, "20.06.2026");
  assert.equal(payload.fields.problemCode3, "Performance problem");
  assert.equal(payload.alo.type, "lowBadRxTx");
  assert.equal(payload.alo.signalState, "never");
  assert.equal(payload.alo.activationDate, "20.06.2026");
  assert.equal(payload.alo.disconnectionDate, "");
  assert.equal(payload.alo.problemDateTime, "20.06.2026");
  assert.equal(payload.alo.notes, "Bad signal - Never activated - 20.06.2026");
}

{
  const externalReferenceCell = { textContent: " 61388266 " };
  const externalReferenceLabelCell = { nextElementSibling: externalReferenceCell };
  const externalReferenceLabel = {
    textContent: "translationId=global.extRef",
    closest: (selector) => selector === "td" ? externalReferenceLabelCell : null
  };
  const orderIdLabel = {
    textContent: "translationId=global.extRefOrderId",
    closest: () => ({ nextElementSibling: { textContent: "wrong-value" } })
  };
  const documentRoot = {
    querySelectorAll: () => [orderIdLabel, externalReferenceLabel]
  };

  assert.equal(extractAloExternalReference(documentRoot), "61388266");
  externalReferenceCell.textContent = " - ";
  assert.equal(extractAloExternalReference(documentRoot), "");
}

{
  const bookmarklet = buildAloAutofillBookmarklet();

  Function(bookmarklet.replace(/^javascript:/, ""));
  assert.ok(bookmarklet.startsWith("javascript:(function aloAutofillBookmarkletRunner("));
  assert.match(bookmarklet, /saltAloFillOverlay/);
  assert.match(bookmarklet, /byAttribute\("name", id\)/);
  assert.match(bookmarklet, /ticket\.socketId/);
  assert.match(bookmarklet, /ticket\.contactPersonIspFirstName/);
  assert.match(bookmarklet, /ticket\.contactPersonIspMail/);
  assert.match(bookmarklet, /ticket\.contactPersonNotificationsType/);
  assert.match(bookmarklet, /ticket\.contactPersonPreferredContactType/);
  assert.match(bookmarklet, /ticket\.problemDateTime/);
  assert.match(bookmarklet, /ticket\.problemCode3/);
  assert.match(bookmarklet, /tagName === "SELECT"/);
  assert.doesNotMatch(bookmarklet, /sourceTicketId/);
  assert.doesNotMatch(bookmarklet, /so_ticket_num/);
  assert.doesNotMatch(bookmarklet, /saltAloBetaOverlay/);
}

{
  const bookmarklet = buildAloAutofillBetaBookmarklet();

  Function(bookmarklet.replace(/^javascript:/, ""));
  assert.ok(bookmarklet.startsWith("javascript:(function aloAutofillBetaBookmarkletRunner("));
  assert.match(bookmarklet, /saltAloBetaOverlay/);
  assert.match(bookmarklet, /translationId=global\.extRef/);
  assert.match(bookmarklet, /credentials:\s*"include"/);
  assert.match(bookmarklet, /new DOMParser\(\)/);
  assert.match(bookmarklet, /payload\.alo && payload\.alo\.orderId/);
  assert.match(bookmarklet, /ticket\.extRef/);
  assert.match(bookmarklet, /External Ref indisponible\. Champ laissé vide/);
  assert.doesNotMatch(bookmarklet, /External Ref introuvable\. Vérifie/);
  assert.match(bookmarklet, new RegExp(ALO_FULFILLMENT_DETAIL_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(bookmarklet, /\.submit\(/);
}

console.log("aloAutofill tests passed");
