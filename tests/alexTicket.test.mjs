import assert from "node:assert/strict";
import {
    ALEX_CLIPBOARD_SOURCE,
    ALEX_HOME_URL,
    buildAlexTicketBookmarklet,
    buildAlexTicketPayload,
    formatAlexTicketPayload,
    openAlexHomePage
} from "../src/utils/alexTicket.js";

{
    const result = buildAlexTicketPayload({
        contact: { eligibilityOrdering: "45" }
    }, "9861");

    assert.equal(result.ok, true);
    assert.deepEqual(result.payload, {
        source: ALEX_CLIPBOARD_SOURCE,
        version: 1,
        action: "view-ticket",
        alap: "45",
        serviceDomain: 1,
        businessDomain: "L1",
        ticket: "9861"
    });
    assert.deepEqual(JSON.parse(formatAlexTicketPayload(result.payload)), result.payload);
}

{
    const aloResult = buildAlexTicketPayload({
        contact: { eligibilityOrdering: "0" }
    }, "1234");
    assert.deepEqual(aloResult, { ok: false, error: "ALO_PARTNER" });
}

{
    const missingPartner = buildAlexTicketPayload({ contact: {} }, "1234");
    assert.deepEqual(missingPartner, { ok: false, error: "MISSING_PARTNER_ID" });

    const missingTicket = buildAlexTicketPayload({
        contact: { eligibilityOrdering: "35" }
    }, "");
    assert.deepEqual(missingTicket, { ok: false, error: "MISSING_TICKET" });
}

{
    const calls = [];
    openAlexHomePage((...args) => calls.push(args));
    assert.deepEqual(calls, [[ALEX_HOME_URL, "_blank", "noopener,noreferrer"]]);
}

{
    const bookmarklet = buildAlexTicketBookmarklet();
    assert.ok(bookmarklet.startsWith("javascript:"));
    Function(bookmarklet.replace(/^javascript:/, ""));
    assert.match(bookmarklet, /localStorage\.setItem\("focus"/);
    assert.match(bookmarklet, /view-ticket/);
    assert.match(bookmarklet, /assurance\/ticket/);
    assert.doesNotMatch(bookmarklet, /auth/i);
}

console.log("alexTicket tests passed");
