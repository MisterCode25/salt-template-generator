import assert from "node:assert/strict";
import vm from "node:vm";
import {
    ALEX_CLIPBOARD_SOURCE,
    ALEX_HOME_URL,
    buildAlexProviderPayload,
    buildAlexTicketBookmarklet,
    buildAlexTicketPayload,
    formatAlexTicketPayload,
    openAlexHomePage
} from "../src/utils/alexTicket.js";

{
    const result = buildAlexProviderPayload({
        contact: { eligibilityOrdering: "45" }
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.payload, {
        source: ALEX_CLIPBOARD_SOURCE,
        version: 1,
        action: "open-provider",
        alap: "45",
        serviceDomain: 1,
        businessDomain: "L1"
    });
}

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
    const result = buildAlexTicketPayload({
        contact: { eligibilityOrdering: "45" }
    }, "Ticket #98-61 / A");

    assert.equal(result.ok, true);
    assert.equal(result.payload.ticket, "9861");
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
    }, "###");
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
    assert.match(bookmarklet, /open-provider/);
    assert.match(bookmarklet, /assurance\/ticket/);
    assert.doesNotMatch(bookmarklet, /encodeURIComponent/);
    assert.doesNotMatch(bookmarklet, /auth/i);
}

{
    const bookmarklet = buildAlexTicketBookmarklet().replace(/^javascript:/, "");
    const storedValues = new Map();
    const scheduledCallbacks = [];
    const replacedUrls = [];
    const location = {
        hostname: "www.ftthproxy.ch",
        origin: "https://www.ftthproxy.ch",
        pathname: "/",
        hash: "",
        replace: (url) => replacedUrls.push(url)
    };
    const context = vm.createContext({
        alert: () => {},
        Date: { now: () => 1234567890 },
        JSON,
        location,
        localStorage: {
            setItem: (key, value) => storedValues.set(key, value)
        },
        navigator: {
            clipboard: {
                readText: async () => JSON.stringify({
                    source: ALEX_CLIPBOARD_SOURCE,
                    action: "view-ticket",
                    alap: "45",
                    serviceDomain: 1,
                    businessDomain: "L1",
                    ticket: "#223323"
                })
            }
        },
        Number,
        Promise,
        setTimeout: (callback, delay) => scheduledCallbacks.push({ callback, delay }),
        String
    });

    vm.runInContext(bookmarklet, context);
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(location.hash, "");
    assert.equal(storedValues.has("focus"), true);
    assert.equal(scheduledCallbacks.length, 1);
    assert.equal(scheduledCallbacks[0].delay, 300);

    scheduledCallbacks[0].callback();
    assert.deepEqual(replacedUrls, [
        "https://www.ftthproxy.ch/?saltAlexRefresh=1234567890#/assurance/ticket/223323"
    ]);
}

{
    const bookmarklet = buildAlexTicketBookmarklet().replace(/^javascript:/, "");
    const storedValues = new Map();
    const scheduledCallbacks = [];
    const replacedUrls = [];
    const location = {
        hostname: "www.ftthproxy.ch",
        origin: "https://www.ftthproxy.ch",
        pathname: "/",
        hash: "",
        replace: (url) => replacedUrls.push(url)
    };
    const context = vm.createContext({
        alert: () => {},
        Date: { now: () => 1234567890 },
        JSON,
        location,
        localStorage: {
            setItem: (key, value) => storedValues.set(key, value)
        },
        navigator: {
            clipboard: {
                readText: async () => JSON.stringify({
                    source: ALEX_CLIPBOARD_SOURCE,
                    action: "open-provider",
                    alap: "45",
                    serviceDomain: 1,
                    businessDomain: "L1"
                })
            }
        },
        Number,
        Promise,
        setTimeout: (callback, delay) => scheduledCallbacks.push({ callback, delay }),
        String
    });

    vm.runInContext(bookmarklet, context);
    await new Promise((resolve) => setImmediate(resolve));

    assert.deepEqual(JSON.parse(storedValues.get("focus")), {
        alap: "45",
        serviceDomain: 1,
        businessDomain: "L1"
    });
    assert.equal(scheduledCallbacks.length, 1);
    assert.equal(scheduledCallbacks[0].delay, 300);

    scheduledCallbacks[0].callback();
    assert.deepEqual(replacedUrls, [
        "https://www.ftthproxy.ch/?saltAlexRefresh=1234567890#/"
    ]);
}

console.log("alexTicket tests passed");
