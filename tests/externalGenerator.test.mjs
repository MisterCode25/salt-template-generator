import assert from "node:assert/strict";
import {
    EXTERNAL_SYSTEM_TOKENS,
    buildExternalFieldsFromClientPayload,
    buildExternalCode,
    readExternalFieldsFromStoredTokens,
    buildExternalTokenValues,
    getImportedExternalIdFromClientPayload,
    getValidExternalId,
    parseExternalId,
    parseVtiClipboard
} from "../src/utils/externalGenerator.js";
import { clearAppIndexedDB } from "../src/services/indexedDbService.js";
import { IMPORTED_EXTERNAL_ID_KEY } from "../src/services/activeClientService.js";
import { setTokenInputValues } from "../src/services/tokenInputValueService.js";

{
    const partnerTicketToken = EXTERNAL_SYSTEM_TOKENS.find((tokenDef) => tokenDef.token === "{external_partner_ticket_number}");
    assert.ok(partnerTicketToken);
    assert.equal(partnerTicketToken.system, true);
    assert.equal(partnerTicketToken.key, "partnerTicketNumber");
    assert.equal(EXTERNAL_SYSTEM_TOKENS.some((tokenDef) => tokenDef.token === "{external_comment}"), false);

    const values = buildExternalTokenValues({
        data: "2026-02-26",
        soTicket: "SO1",
        partner: "EWB",
        partnerTicketNumber: "ABC",
        comment: "do not expose"
    });
    assert.equal(values["{external_date}"], "26.02.2026");
    assert.equal(values["{so_ticket_num}"], "SO1");
    assert.equal(values["{external_partner}"], "EWB");
    assert.equal(values["{external_partner_ticket_number}"], "ABC");
    assert.equal(values["{external_comment}"], undefined);

    await clearAppIndexedDB();
    await setTokenInputValues({
        "{external_date}": "26.02.2026",
        "{external_partner_ticket_number}": "ABC",
        "{external_comment}": "ignored"
    });
    const fields = await readExternalFieldsFromStoredTokens();
    assert.equal(fields.data, "2026-02-26");
    assert.equal(fields.partnerTicketNumber, "ABC");
    assert.equal(fields.comment, undefined);
}

{
    const code = buildExternalCode({
        flagging: "VALID",
        data: "2026-02-26",
        customer: "123",
        soTicket: "",
        comment: "ok"
    });
    assert.equal(code.split("//")[0], "VALID");
    assert.equal(code.split("//")[1], "26.02.2026");
    assert.equal(code.split("//")[3], " ");
    assert.equal(code.split("//")[14], "ok");
}

{
    const parsed = parseExternalId("VALID//26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment");
    assert.equal(parsed.ok, true);
    assert.equal(parsed.fields.customer, "123");
    assert.equal(parsed.fields.partner, "EWB");
    assert.equal(parsed.fields.comment, "Comment");
    // Date must be converted from DD.MM.YYYY to YYYY-MM-DD
    assert.equal(parsed.fields.data, "2026-02-26");
}

{
    const validExternalId = "VALID//26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment";
    assert.equal(getValidExternalId(` ${validExternalId} `), validExternalId);
    assert.equal(getValidExternalId("nothing useful here"), "");
    assert.equal(getValidExternalId(""), "");
    assert.equal(getImportedExternalIdFromClientPayload({
        [IMPORTED_EXTERNAL_ID_KEY]: validExternalId,
        __templateInputs: {
            external_partner: "EWB",
            external_partner_ticket_number: "ABC"
        }
    }), validExternalId);
    assert.equal(getImportedExternalIdFromClientPayload({
        __templateInputs: {
            external_partner: "EWB",
            external_partner_ticket_number: "ABC"
        }
    }), "");
    assert.equal(getImportedExternalIdFromClientPayload({
        [IMPORTED_EXTERNAL_ID_KEY]: "bad format"
    }), "");
}

{
    const parsed = parseExternalId("26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment");
    assert.equal(parsed.ok, true);
    assert.equal(parsed.fields.flagging, "");
    assert.equal(parsed.fields.customer, "123");
    // Date must be correctly parsed even without flagging prefix
    assert.equal(parsed.fields.data, "2026-02-26");
}

{
    const parsed = buildExternalFieldsFromClientPayload({
        client: {
            contractorNumber: "31447756"
        },
        healthcheck: {
            routerSerialNumber: "GFAB11004892",
            lexId: "69VEV",
            oltName: "1",
            oltBoard: "2",
            breakoutCableId: "KP100314-C0036",
            fiberNumber: "8"
        }
    });
    assert.equal(parsed.ok, true);
    assert.equal(parsed.fields.customer, "31447756");
    assert.equal(parsed.fields.boxType, "X6");
    assert.equal(parsed.fields.lexId, "69VEV");
    assert.equal(parsed.fields.oltName, "1");
    assert.equal(parsed.fields.oltBoard, "2");
    assert.equal(parsed.fields.bokBof, "KP100314-C0036|8");
}

{
    const raw = `
        Contractor number: 987654
        Fiber FLL
        routerSerialNumber GFAB123456
        lexId <div>LEX-22</div>
        oltName OLT-ABC
        oltBoard 1/2/3
        breakoutCableId BOK123/BOF77
        fiberNumber 12
    `;
    const parsed = parseVtiClipboard(raw);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.fields.customer, "987654");
    assert.equal(parsed.fields.boxType, "X6");
    assert.equal(parsed.fields.lexId, "LEX-22");
    assert.equal(parsed.fields.bokBof, "BOK123|BOF77|12");
}

{
    const parsed = parseVtiClipboard("hello world");
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error, "INVALID_VTI_FORMAT");
}

console.log("externalGenerator tests passed");
