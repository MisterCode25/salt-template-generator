import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { createAloTicketTracker } from "../browser-extension/aloTicketTracking.js";

const source = await readFile(new URL("../browser-extension/alo-ticket-observer.js", import.meta.url), "utf8");
const records = {};
const deliveries = [];
const tracker = createAloTicketTracker({
  storage: {
    get: async (key) => key ? { [key]: records[key] } : { ...records },
    set: async (patch) => Object.assign(records, patch),
    remove: async (keys) => [keys].flat().forEach((key) => delete records[key])
  },
  sendResult: async (record) => deliveries.push(record),
  now: () => Date.parse("2026-09-05T08:55:00Z")
});
await tracker.start({ requestId: "observer", aloTabId: 2, socketId: "OTO1", externalReference: "REF1" });
const base = "https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/";
const incident = { incidentId: "2336981", socketId: "OTO1", externalReference: "REF1", createdAt: "05.09.2026 10:55:11" };
function createPage(pageName, initialResult = null) {
  const listeners = new Map();
  const messages = [];
  let mutationCallback;
  let disconnected = false;
  let parsedResult = initialResult;
  const location = { href: base + pageName, pathname: new URL(base + pageName).pathname };
  const pending = [];
  runInNewContext(source, {
    document: {
      documentElement: {},
      getElementById: (id) => ({ value: id === "ticket.socketId" ? "OTO1" : "REF1" }),
      addEventListener: (name, callback) => listeners.set(name, callback)
    },
    location,
    window: { addEventListener: (name, callback) => listeners.set(name, callback) },
    chrome: { runtime: { sendMessage: (message) => {
      messages.push(message);
      const operation = tracker.observe(message, { tab: { id: 2 }, frameId: 0, url: location.href });
      pending.push(operation);
      return operation;
    } } },
    MutationObserver: class { constructor(callback) { mutationCallback = callback; } observe() {} disconnect() { disconnected = true; } },
    extractAloTicketResult: () => parsedResult,
    setTimeout: () => 1,
    clearTimeout() {}
  });
  return {
    listeners, messages, pending,
    async renderResult(result) { parsedResult = result; await mutationCallback(); },
    isDisconnected: () => disconnected
  };
}
const form = createPage("create.do");
assert.equal(form.messages.length, 0, "autofill does not submit anything");
form.listeners.get("submit")({ type: "submit", isTrusted: false });
assert.equal(form.messages.length, 0, "synthetic submission cannot arm tracking");
form.listeners.get("click")({ type: "click", isTrusted: true, target: { closest: () => ({ type: "submit" }) } });
await Promise.all(form.pending);
assert.equal(form.messages[0].type, "salt.alo.submitted.v1");
const detail = createPage("detail.do?ttId=2336981"); // A new content-script context after navigation.
assert.equal(deliveries.length, 0);
await detail.renderResult(incident); // Detail content arrives asynchronously.
assert.equal(deliveries.length, 1);
assert.equal(deliveries[0].result.incidentId, "2336981");
assert.equal(detail.isDisconnected(), true);
await detail.renderResult(incident);
assert.equal(deliveries.length, 1);
const reloaded = createPage("detail.do?ttId=2336981", incident);
await Promise.all(reloaded.pending);
assert.equal(deliveries.length, 1, "reloading the result cannot generate a second ticket event");
console.log("aloTicketObserver tests passed");
