import assert from "node:assert/strict";
import { MANUAL_CLIENT_INPUTS_KEY } from "../src/services/activeClientService.js";
import {
  buildCaseProfile,
  CASE_PROFILE_VERSION,
  getCaseProfileInfoSections,
  getCaseReferenceFields,
  getCaseProfileSummaryFields
} from "../src/utils/caseProfile.js";

const importedExternalId = "FLAG//26.02.2026//777001//SO-777//Lost//Off//Check OTO//X6//EWB//ABC-123//LEX-SO//OLT-SO//B1//BOK|7//Inline note";

{
  const profile = buildCaseProfile({
    clientPayload: {
      client: {
        firstName: "Ana",
        lastName: "Muster",
        contractorNumber: "31447756",
        mobile: "+41790000000",
        activationDate: "2026-06-20"
      },
      contact: {
        providerOrderRef: "10031420260327025732000000"
      },
      healthcheck: {
        otoId: "B.111.783.391.7",
        routerSerialNumber: "GFAB11004892",
        lexId: "LEX-VTI",
        oltName: "OLT-VTI",
        newFutureProperty: "future-value"
      }
    },
    superOfficePayload: {
      ticketId: "SO-314",
      externalTicketId: importedExternalId,
      attachments: [
        { name: "inline", url: "https://example.test/image?id=42", type: "image" },
        { name: "report.pdf", url: "https://example.test/report.pdf" }
      ]
    }
  });

  assert.equal(profile.version, CASE_PROFILE_VERSION);
  assert.equal(profile.clientName, "Ana Muster");
  assert.equal(profile.contractorNumber, "31447756");
  assert.equal(profile.providerOrderRef, "10031420260327025732000000");
  assert.equal(profile.externalCustomer, "777001");
  assert.equal(profile.soTicketNum, "SO-314");
  assert.equal(profile.lexId, "LEX-VTI");
  assert.equal(profile.externalLexId, "LEX-SO");
  assert.equal(profile.vars.contractorNumber, "31447756");
  assert.equal(profile.vars.providerOrderRef, "10031420260327025732000000");
  assert.equal(profile.tokenValues["{provider_order_ref}"], "10031420260327025732000000");
  assert.equal(profile.vars.healthcheckNewFutureProperty, "future-value");
  assert.equal(profile.tokenValues["{contractor_number}"], "31447756");
  assert.equal(profile.tokenValues["{external_customer}"], "777001");
  assert.equal(profile.tokenValues["{so_ticket_num}"], "SO-314");
  assert.equal(profile.photos.length, 1);
  assert.equal(profile.attachments.length, 2);
  assert.ok(profile.availableFields.some((field) => field.key === "healthcheckNewFutureProperty" && field.value === "future-value"));
  assert.deepEqual(getCaseReferenceFields(profile), [
    { key: "contractor", label: "Contractor", value: "31447756" },
    { key: "so-ticket", label: "SO ticket", value: "SO-314" }
  ]);
}

{
  const profile = buildCaseProfile({
    superOfficePayload: { ticketId: "SO-ONLY" }
  });

  assert.deepEqual(getCaseReferenceFields(profile), [
    { key: "so-ticket", label: "SO ticket", value: "SO-ONLY" }
  ]);
}

{
  const profile = buildCaseProfile({
    superOfficePayload: {
      externalTicketId: importedExternalId,
      tokenValues: {
        "{external_partner_ticket_number}": "ABC-123"
      }
    }
  });

  assert.equal(profile.contractorNumber, "777001");
  assert.equal(profile.externalCustomer, "777001");
  assert.equal(profile.soTicketNum, "SO-777");
  assert.equal(profile.tokenValues["{external_date}"], "26.02.2026");
  assert.equal(profile.vars.externalPartnerTicketNumber, "ABC-123");

  const summary = getCaseProfileSummaryFields(profile);
  assert.ok(summary.some((field) => field.label === "Contractor" && field.value === "777001"));
  assert.ok(summary.some((field) => field.label === "SO ticket" && field.value === "SO-777"));

  const sections = getCaseProfileInfoSections(profile);
  assert.ok(sections.some((section) =>
    section.title === "SuperOffice"
    && section.fields.some((field) => field.label === "External ID" && field.value === importedExternalId)
  ));
  assert.ok(sections.some((section) =>
    section.title === "External ID fields"
    && section.fields.some((field) => field.label === "Contractor" && field.value === "777001")
  ));
}

{
  const profile = buildCaseProfile({
    clientPayload: {
      client: {
        contractorNumber: "31447756"
      },
      [MANUAL_CLIENT_INPUTS_KEY]: {
        contractor_number: "99999999",
        custom_note: "Manual note"
      }
    },
    superOfficePayload: {
      externalTicketId: importedExternalId
    }
  });

  assert.equal(profile.contractorNumber, "99999999");
  assert.equal(profile.externalCustomer, "777001");
  assert.equal(profile.vars.customNote, "Manual note");
  assert.equal(profile.tokenValues["{custom_note}"], "Manual note");
}

{
  const profile = buildCaseProfile({
    clientPayload: {
      client: {
        contractorNumber: "31447756"
      },
      [MANUAL_CLIENT_INPUTS_KEY]: {
        contractor_number: "99999999"
      }
    },
    tokenValues: {
      "{contractor_number}": "31447756"
    }
  });

  assert.equal(profile.contractorNumber, "99999999");
  assert.equal(profile.tokenValues["{contractor_number}"], "99999999");
}

{
  const profile = buildCaseProfile({
    tokenValues: {
      "{client_name}": "Token Client",
      "{router_serial_number}": "GFAC999",
      "{unknown_added_field}": "New value"
    }
  });

  assert.equal(profile.clientName, "Token Client");
  assert.equal(profile.routerSerialNumber, "GFAC999");
  assert.equal(profile.vars.unknownAddedField, "New value");
  assert.equal(profile.tokenValues["{unknown_added_field}"], "New value");
}

console.log("caseProfile tests passed");
