import assert from "node:assert/strict";
import {
    buildExternalCode,
    parseExternalId,
    parseVtiClipboard
} from "../src/utils/externalGenerator.js";

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
}

{
    const parsed = parseExternalId("26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment");
    assert.equal(parsed.ok, true);
    assert.equal(parsed.fields.flagging, "");
    assert.equal(parsed.fields.customer, "123");
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
