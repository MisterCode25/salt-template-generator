import assert from "node:assert/strict";
import { IMPORTED_EXTERNAL_ID_KEY, MANUAL_CLIENT_INPUTS_KEY, saveActiveClientPayload } from "../src/services/activeClientService.js";
import {
  consumePendingSuperOfficeTicketPayload,
  getSuperOfficeClientSignature,
  isSameSuperOfficeClient,
  loadDisplaySuperOfficeTicketPayload,
  loadPreviousSuperOfficeTicketPayload,
  loadSuperOfficeTicketPayload,
  rebindSuperOfficeTicketsToActiveClient,
  saveDisplaySuperOfficeExternalId,
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
const clientAWithImportedExternalId = {
  ...clientA,
  [IMPORTED_EXTERNAL_ID_KEY]: "VALID//26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment"
};
const clientB = {
  billingAccount: "BA-2",
  customerName: "Client B"
};
const pendingExternalId = "VALID//26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Pending comment";
const storedExternalId = "MINFO//27.02.2026//456//SO2//Never//Fiber Red//FLL Ticket//W7//SGSW//DEF//L2//OLT2//2//BOK2|BOF2//Stored comment";

assert.equal(
  getSuperOfficeClientSignature(clientA),
  getSuperOfficeClientSignature(clientAWithDifferentManualInputs)
);
assert.equal(
  getSuperOfficeClientSignature(clientA),
  getSuperOfficeClientSignature(clientAWithImportedExternalId)
);
assert.equal(
  getSuperOfficeClientSignature({ z: "last", a: "first" }),
  getSuperOfficeClientSignature({ a: "first", z: "last" })
);
assert.notEqual(
  getSuperOfficeClientSignature(clientA),
  getSuperOfficeClientSignature(clientB)
);
assert.equal(
  isSameSuperOfficeClient(clientA, { ...clientA, healthcheck: { lineState: "changed" } }),
  true
);
assert.equal(isSameSuperOfficeClient(clientA, clientB), false);

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
assert.equal((await loadDisplaySuperOfficeTicketPayload()).ticketId, "31436061");

const updatedPending = await saveDisplaySuperOfficeExternalId(pendingExternalId);
assert.equal(updatedPending.externalTicketId, pendingExternalId);
assert.equal((await loadDisplaySuperOfficeTicketPayload()).externalTicketId, pendingExternalId);
assert.equal((await loadDisplaySuperOfficeTicketPayload()).tokenValues["{external_customer}"], "123");
assert.equal((await loadDisplaySuperOfficeTicketPayload()).tokenValues["{external_bok_bof}"], "BOK|BOF");

await saveActiveClientPayload(clientA);
const consumed = await consumePendingSuperOfficeTicketPayload();
assert.equal(consumed.ticketId, "31436061");
assert.equal(consumed.tokenValues["{so_ticket_num}"], "SO1");
assert.equal(consumed.externalTicketId, pendingExternalId);
assert.equal((await loadSuperOfficeTicketPayload()).imageAttachments.length, 1);

globalThis.localStorage.clear();
await clearAppIndexedDB();
await saveActiveClientPayload(clientA);
const saved = await saveSuperOfficeTicketPayload({
  ticketId: "31436062",
  createdAt: "6/4/2026 12:07 PM",
  firstPostAt: "6/3/2026 9:15 AM",
  tokenValues: {
    "{so_ticket_num}": "31436062"
  },
  attachments: [
    { name: "photo.jpg", url: "https://example.test/photo.jpg", type: "image" },
    { name: "preuve.mp4", url: "https://example.test/preuve.mp4" },
    { name: "rapport", url: "https://example.test/download?id=pdf", type: "application/pdf" }
  ]
});

assert.equal(saved.imageAttachments.length, 1);
assert.equal(saved.mediaAttachments.length, 3);
assert.equal(saved.createdAt, "6/4/2026 12:07 PM");
assert.equal(saved.firstPostAt, "6/3/2026 9:15 AM");
assert.equal(saved.tokenValues["{so_ticket_num}"], "31436062");
assert.equal((await loadSuperOfficeTicketPayload()).imageAttachments.length, 1);
assert.equal((await loadSuperOfficeTicketPayload()).mediaAttachments.length, 3);
assert.equal((await loadSuperOfficeTicketPayload()).createdAt, "6/4/2026 12:07 PM");

const updatedStored = await saveDisplaySuperOfficeExternalId(storedExternalId);
assert.equal(updatedStored.externalTicketId, storedExternalId);
assert.equal((await loadSuperOfficeTicketPayload()).externalTicketId, storedExternalId);
assert.equal((await loadSuperOfficeTicketPayload()).tokenValues["{external_customer}"], "456");
assert.equal((await loadSuperOfficeTicketPayload()).tokenValues["{external_bok_bof}"], "BOK2|BOF2");

await saveSuperOfficeTicketPayload({
  ticketId: "31436099",
  tokenValues: {
    "{so_ticket_num}": "31436099"
  },
  attachments: [
    { name: "other-ticket-photo.jpg", url: "https://example.test/other-ticket-photo.jpg", type: "image" }
  ]
});
assert.equal((await loadSuperOfficeTicketPayload()).ticketId, "31436099");
assert.equal((await loadPreviousSuperOfficeTicketPayload()).ticketId, "31436062");

const refreshedClientA = {
  ...clientA,
  healthcheck: {
    lineState: "Online",
    routerSerialNumber: "NEW-SERIAL"
  }
};
assert.equal(isSameSuperOfficeClient(clientA, refreshedClientA), true);
await saveActiveClientPayload(refreshedClientA);
await rebindSuperOfficeTicketsToActiveClient();
assert.equal((await loadSuperOfficeTicketPayload()).ticketId, "31436099");
assert.equal((await loadPreviousSuperOfficeTicketPayload()).ticketId, "31436062");

await saveActiveClientPayload(clientB);
assert.equal(await loadSuperOfficeTicketPayload(), null);
assert.equal(await loadPreviousSuperOfficeTicketPayload(), null);

console.log("superOfficeTicketService tests passed");
