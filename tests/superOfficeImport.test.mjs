import assert from "node:assert/strict";
import {
  groupSuperOfficeImageAttachmentsByDate,
  parseSuperOfficeInfoPayload
} from "../src/utils/superOfficeImport.js";
import {
  applyExternalIdValuesToImportResult,
  applyExternalIdSourceCorrections,
  applyExternalIdSourceCorrectionsToImportResult,
  getExternalIdSourceConflicts
} from "../src/utils/externalIdConflicts.js";
import { parseExternalId } from "../src/utils/externalGenerator.js";

{
  const result = parseSuperOfficeInfoPayload(JSON.stringify({
    ticketId: "232",
    createdAt: "6/4/2026 12:07 PM",
    externalTicketId: "VALID//26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment"
  }));

  assert.equal(result.ok, true);
  assert.equal(result.ticketId, "232");
  assert.equal(result.sourceTicketId, "232");
  assert.equal(result.createdAt, "6/4/2026 12:07 PM");
  assert.equal(result.externalIdValid, true);
  assert.equal(result.ignoredExternalId, false);
  assert.equal(result.contractorNumber, "123");
  assert.equal(result.tokenValues["{so_ticket_num}"], "232");
  assert.equal(result.tokenValues["{contractor}"], "123");
  assert.equal(result.tokenValues["{contractor_number}"], "123");
  assert.equal(result.tokenValues["{client_contractor_number}"], "123");
  assert.equal(result.tokenValues["{external_partner}"], "EWB");
  assert.equal(result.tokenValues["{external_partner_ticket_number}"], "ABC");
  assert.equal(result.tokenValues["{external_comment}"], undefined);
}

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "31436062",
    externalTicketId: "VALID//26.02.2026//99999999//SO-WRONG//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment"
  });
  const conflicts = getExternalIdSourceConflicts(result, {
    client: {
      contractorNumber: "31447756"
    }
  });

  assert.equal(conflicts.length, 2);
  assert.equal(conflicts[0].field, "customer");
  assert.equal(conflicts[0].externalValue, "99999999");
  assert.equal(conflicts[0].expectedValue, "31447756");
  assert.equal(conflicts[1].field, "soTicket");
  assert.equal(conflicts[1].externalValue, "SO-WRONG");
  assert.equal(conflicts[1].expectedValue, "31436062");

  const corrected = applyExternalIdSourceCorrections(result.tokenValues, conflicts);
  assert.equal(corrected["{external_customer}"], "31447756");
  assert.equal(corrected["{contractor}"], "31447756");
  assert.equal(corrected["{contractor_number}"], "31447756");
  assert.equal(corrected["{client_contractor_number}"], "31447756");
  assert.equal(corrected["{so_ticket_num}"], "31436062");

  const correctedResult = applyExternalIdSourceCorrectionsToImportResult(result, conflicts);
  const correctedExternalId = parseExternalId(correctedResult.externalTicketId);
  assert.equal(correctedExternalId.ok, true);
  assert.equal(correctedExternalId.fields.customer, "31447756");
  assert.equal(correctedExternalId.fields.soTicket, "31436062");
  assert.equal(correctedResult.tokenValues["{external_customer}"], "31447756");
  assert.equal(correctedResult.tokenValues["{so_ticket_num}"], "31436062");

  const externalIdResult = applyExternalIdValuesToImportResult(result);
  assert.equal(externalIdResult.tokenValues["{external_customer}"], "99999999");
  assert.equal(externalIdResult.tokenValues["{contractor}"], "99999999");
  assert.equal(externalIdResult.tokenValues["{contractor_number}"], "99999999");
  assert.equal(externalIdResult.tokenValues["{client_contractor_number}"], "99999999");
  assert.equal(externalIdResult.tokenValues["{so_ticket_num}"], "SO-WRONG");
}

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "31436062",
    contractorNumber: "31447756"
  });

  assert.equal(result.ok, true);
  assert.equal(result.contractorNumber, "31447756");
  assert.equal(result.tokenValues["{contractor}"], "31447756");
  assert.equal(result.tokenValues["{contractor_number}"], "31447756");
}

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "SO-2",
    tokenValues: {
      "{client_mobile}": "079 111 22 33"
    },
    values: {
      healthcheck: {
        lexId: "LEX-SO"
      }
    },
    variables: {
      client: {
        firstName: "Sofia"
      }
    }
  });
  const conflicts = getExternalIdSourceConflicts(result, {
    client: {
      firstName: "Peter",
      mobile: "078 912 56 85"
    },
    healthcheck: {
      lexId: "LEX-VTI"
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.tokenValues["{client_mobile}"], "079 111 22 33");
  assert.equal(result.tokenValues["{healthcheck_lex_id}"], "LEX-SO");
  assert.equal(result.tokenValues["{client_first_name}"], "Sofia");
  assert.deepEqual(conflicts.map((conflict) => conflict.token), [
    "{client_mobile}",
    "{healthcheck_lex_id}",
    "{client_first_name}"
  ]);
  assert.deepEqual(conflicts.map((conflict) => conflict.expectedValue), [
    "078 912 56 85",
    "LEX-VTI",
    "Peter"
  ]);

  const correctedResult = applyExternalIdSourceCorrectionsToImportResult(result, conflicts);
  assert.equal(correctedResult.tokenValues["{client_mobile}"], "078 912 56 85");
  assert.equal(correctedResult.tokenValues["{healthcheck_lex_id}"], "LEX-VTI");
  assert.equal(correctedResult.tokenValues["{client_first_name}"], "Peter");

  const keptImportResult = applyExternalIdValuesToImportResult(result);
  assert.equal(keptImportResult.tokenValues["{client_mobile}"], "079 111 22 33");
  assert.equal(keptImportResult.tokenValues["{healthcheck_lex_id}"], "LEX-SO");
  assert.equal(keptImportResult.tokenValues["{client_first_name}"], "Sofia");
}

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "SO-1",
    externalTicketId: "VALID//26.02.2026//31447756//SO-1//Lost//Fiber Off//Other//X6//EWB//ABC//LEX-SO//OLT-SO//BOARD-SO//BOK-SO|1//Comment"
  });
  const conflicts = getExternalIdSourceConflicts(result, {
    client: {
      contractorNumber: "31447756"
    },
    healthcheck: {
      routerSerialNumber: "GFAC12345678",
      lexId: "LEX-VTI",
      oltName: "OLT-VTI",
      oltBoard: "BOARD-VTI",
      breakoutCableId: "BOK-VTI/BOF-VTI",
      fiberNumber: "7"
    }
  });

  assert.deepEqual(conflicts.map((conflict) => conflict.field), [
    "boxType",
    "lexId",
    "oltName",
    "oltBoard",
    "bokBof"
  ]);
  assert.deepEqual(conflicts.map((conflict) => conflict.expectedValue), [
    "W7",
    "LEX-VTI",
    "OLT-VTI",
    "BOARD-VTI",
    "BOK-VTI|BOF-VTI|7"
  ]);

  const correctedResult = applyExternalIdSourceCorrectionsToImportResult(result, conflicts);
  const correctedExternalId = parseExternalId(correctedResult.externalTicketId);
  assert.equal(correctedExternalId.fields.boxType, "W7");
  assert.equal(correctedExternalId.fields.lexId, "LEX-VTI");
  assert.equal(correctedExternalId.fields.oltName, "OLT-VTI");
  assert.equal(correctedExternalId.fields.oltBoard, "BOARD-VTI");
  assert.equal(correctedExternalId.fields.bokBof, "BOK-VTI|BOF-VTI|7");
  assert.equal(correctedResult.tokenValues["{external_box_type}"], "W7");
  assert.equal(correctedResult.tokenValues["{external_lex_id}"], "LEX-VTI");
  assert.equal(correctedResult.tokenValues["{external_olt_name}"], "OLT-VTI");
  assert.equal(correctedResult.tokenValues["{external_olt_board}"], "BOARD-VTI");
  assert.equal(correctedResult.tokenValues["{external_bok_bof}"], "BOK-VTI|BOF-VTI|7");
}

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "31436062"
  });
  const conflicts = getExternalIdSourceConflicts(result, {
    client: {
      contractorNumber: "31447756"
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.externalTicketId, "");
  assert.equal(conflicts.length, 0);
}

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "31436062",
    externalTicketId: "nothing useful here"
  });
  const conflicts = getExternalIdSourceConflicts(result, {
    client: {
      contractorNumber: "31447756"
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.externalIdValid, false);
  assert.equal(result.ignoredExternalId, true);
  assert.deepEqual(result.tokenValues, {
    "{so_ticket_num}": "31436062"
  });
  assert.equal(conflicts.length, 0);
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

{
  const result = parseSuperOfficeInfoPayload({
    ticketId: "31436062",
    attachments: [
      {
        name: "photo-a.jpg",
        url: "https://example.test/photo-a.jpg",
        type: "image",
        size: "2.3MB",
        messageId: 10,
        messageDate: "13.06.2026 14:45"
      },
      {
        name: "document.pdf",
        url: "https://example.test/document.pdf",
        type: "pdf",
        date: "2026-06-12"
      },
      {
        name: "photo-b.png",
        url: "https://example.test/photo-b.png",
        createdAt: "2026-06-12T10:00:00Z"
      }
    ]
  });

  assert.equal(result.ok, true);
  assert.equal(result.attachments.length, 3);
  assert.equal(result.imageAttachments.length, 2);
  assert.equal(result.imageAttachments[0].date, "13.06.2026 14:45");

  const groups = groupSuperOfficeImageAttachmentsByDate(result.attachments);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].dateKey, "2026-06-13");
  assert.equal(groups[0].attachments[0].galleryIndex, 0);
  assert.equal(groups[1].dateKey, "2026-06-12");
}

{
  const result = parseSuperOfficeInfoPayload({
    attachments: [
      { name: "photo-only.webp", url: "https://example.test/photo-only.webp", type: "image" }
    ]
  });

  assert.equal(result.ok, true);
  assert.equal(result.tokenValues["{so_ticket_num}"], undefined);
  assert.equal(result.imageAttachments.length, 1);
}

console.log("superOfficeImport tests passed");
