import assert from "node:assert/strict";
import { createAloTicketTracker } from "../browser-extension/aloTicketTracking.js";

const records = {};
const delivered = [];
const storage = {
  get: async (key) => structuredClone(key ? { [key]: records[key] } : records),
  set: async (patch) => Object.assign(records, structuredClone(patch)),
  remove: async (keys) => [keys].flat().forEach((key) => delete records[key])
};
let time = Date.parse("2026-09-05T08:55:00Z");
const createTracker = () => createAloTicketTracker({ storage, sendResult: async (record) => delivered.push(record), now: () => time });
let tracker = createTracker();
const record = { requestId: "request-1", aloTabId: 2, appTabId: 1, appOrigin: "http://localhost:5173", socketId: "OTO1", externalReference: "REF1" };
const sender = { tab: { id: 2 }, frameId: 0, url: "https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do" };
const result = { incidentId: "2336981", socketId: "OTO1", externalReference: "REF1", createdAt: "05.09.2026 10:55:11" };
const submit = () => tracker.observe({ type: "salt.alo.submitted.v1", result }, sender);
const capture = (patch = {}, source = sender) => tracker.observe({ type: "salt.alo.result.v1", result: { ...result, ...patch } }, source);
await tracker.start(record);
assert.equal((await capture()).captured, false, "opening an existing detail is not a submission");
await submit();
tracker = createTracker(); // A suspended worker loses its globals, but keeps session storage.
assert.equal((await capture({}, { ...sender, tab: { id: 3 } })).captured, false);
assert.equal((await capture({}, { ...sender, frameId: 1 })).captured, false);
assert.equal((await capture({}, { ...sender, url: "https://example.com" })).captured, false);
assert.equal((await capture({ socketId: "OTO2" })).captured, false);
assert.equal((await capture({ externalReference: "REF2" })).captured, false);
assert.equal((await capture({ incidentId: "INC000014852874" })).captured, false);
assert.equal((await capture({ createdAt: "04.09.2026 10:55:11" })).captured, false);
assert.equal((await capture({ createdAt: "" })).captured, false);
assert.equal((await capture()).captured, true);
await capture();
assert.equal(delivered.length, 1);
await tracker.replay([record.requestId], 8, "https://example.com");
assert.equal(delivered.length, 1);
await tracker.replay([record.requestId], 8, record.appOrigin);
assert.equal(delivered.at(-1).appTabId, 8);
await tracker.acknowledge(record.requestId, "https://example.com");
assert.equal(Object.keys(records).length, 1);
await tracker.acknowledge(record.requestId, record.appOrigin);
assert.equal(Object.keys(records).length, 0);
await tracker.start(record);
await submit();
await tracker.start({ ...record, requestId: "request-2" });
assert.equal((await capture()).captured, false, "reusing the form requires a new submission");
await tracker.removeTab(2);
assert.equal(Object.keys(records).length, 0);
await tracker.start(record);
time += 25 * 60 * 60 * 1000;
assert.equal((await capture()).captured, false);
assert.equal(Object.keys(records).length, 0);
console.log("aloTicketTracking tests passed");
