import assert from "node:assert/strict";
import { MANUAL_CLIENT_INPUTS_KEY, saveActiveClientPayload } from "../src/services/activeClientService.js";
import {
  consumePendingSuperOfficeTicketPayload,
  getSuperOfficeClientSignature,
  loadSuperOfficeTicketPayload,
  saveSuperOfficeTicketPayload
} from "../src/services/superOfficeTicketService.js";
import { clearAppIndexedDB } from "../src/services/indexedDbService.js";

function createMemoryStorage() {
  const data = new Map();
  return {
    get length() {
      return data.size;
    },
    key(index) {
      return Array.from(data.keys())[index] || null;
    },
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    clear() {
      data.clear();
    }
  };
}

globalThis.localStorage = createMemoryStorage();

const clientA = {
  billingAccount: "BA-1",
  customerName: "Client A",
  [MANUAL_CLIENT_INPUTS_KEY]: {
    so_ticket_num: "111"
  }
};
const clientAWithDifferentManualInputs = {
  ...clientA,
  [MANUAL_CLIENT_INPUTS_KEY]: {
    so_ticket_num: "222"
  }
};
const clientB = {
  billingAccount: "BA-2",
  customerName: "Client B"
};

assert.equal(
  getSuperOfficeClientSignature(clientA),
  getSuperOfficeClientSignature(clientAWithDifferentManualInputs)
);
assert.equal(
  getSuperOfficeClientSignature({ z: "last", a: "first" }),
  getSuperOfficeClientSignature({ a: "first", z: "last" })
);
assert.notEqual(
  getSuperOfficeClientSignature(clientA),
  getSuperOfficeClientSignature(clientB)
);

globalThis.localStorage.clear();
await clearAppIndexedDB();
const pending = await saveSuperOfficeTicketPayload({
  ticketId: "31436061",
  tokenValues: {
    "{so_ticket_num}": "31436061"
  },
  attachments: [
    { name: "pending-photo.jpg", url: "https://example.test/pending-photo.jpg", type: "image" }
  ]
});

assert.equal(pending.clientSignature, "");
assert.equal(await loadSuperOfficeTicketPayload(), null);

await saveActiveClientPayload(clientA);
const consumed = await consumePendingSuperOfficeTicketPayload();
assert.equal(consumed.ticketId, "31436061");
assert.equal(consumed.tokenValues["{so_ticket_num}"], "31436061");
assert.equal((await loadSuperOfficeTicketPayload()).imageAttachments.length, 1);

globalThis.localStorage.clear();
await clearAppIndexedDB();
await saveActiveClientPayload(clientA);
const saved = await saveSuperOfficeTicketPayload({
  ticketId: "31436062",
  createdAt: "6/4/2026 12:07 PM",
  tokenValues: {
    "{so_ticket_num}": "31436062"
  },
  attachments: [
    { name: "photo.jpg", url: "https://example.test/photo.jpg", type: "image" }
  ]
});

assert.equal(saved.imageAttachments.length, 1);
assert.equal(saved.createdAt, "6/4/2026 12:07 PM");
assert.equal(saved.tokenValues["{so_ticket_num}"], "31436062");
assert.equal((await loadSuperOfficeTicketPayload()).imageAttachments.length, 1);
assert.equal((await loadSuperOfficeTicketPayload()).createdAt, "6/4/2026 12:07 PM");

await saveActiveClientPayload(clientB);
assert.equal(await loadSuperOfficeTicketPayload(), null);

console.log("superOfficeTicketService tests passed");
