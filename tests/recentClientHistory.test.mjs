import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  clearActiveClientPayload,
  clearStoredInputValues,
  loadActiveClientPayload,
  saveActiveClientPayload
} from "../src/services/activeClientService.js";
import {
  archiveActiveClientSnapshot,
  loadRecentClientHistory,
  recordRecentClientSnapshot,
  RECENT_CLIENT_HISTORY_LIMIT,
  restoreRecentClientSnapshot
} from "../src/services/clientHistoryService.js";
import { clearAppIndexedDB } from "../src/services/indexedDbService.js";
import {
  loadSuperOfficeTicketPayload,
  saveSuperOfficeTicketPayload
} from "../src/services/superOfficeTicketService.js";
import {
  loadTokenInputValues,
  saveTokenInputValues
} from "../src/services/tokenInputValueService.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };
}

async function resetStorage() {
  await clearAppIndexedDB();
  await clearStoredInputValues();
  await clearActiveClientPayload();
  globalThis.localStorage = createMemoryStorage();
}

globalThis.localStorage = createMemoryStorage();

{
  await resetStorage();
  await saveActiveClientPayload({
    billingAccount: "BA-1",
    client: { firstName: "Ada", lastName: "Lovelace" },
    avatar: "data:image/png;base64,CLIENT_IMAGE",
    encodedPhoto: "A".repeat(2048),
    binaryPhoto: new Uint8Array([1, 2, 3])
  });
  await saveTokenInputValues({ "{client_first_name}": "Ada" });
  await saveSuperOfficeTicketPayload({
    ticketId: "SO-1",
    tokenValues: { "{so_ticket_num}": "SO-1" },
    attachments: [
      {
        id: "stable-photo",
        name: "photo.jpg",
        url: "https://superoffice.example.test/photo.jpg",
        dataUrl: "data:image/jpeg;base64,HEAVY_IMAGE",
        type: "image"
      },
      {
        id: "temporary-photo",
        name: "temporary.jpg",
        url: "blob:https://app.example.test/temporary",
        type: "image"
      }
    ]
  });

  const history = await archiveActiveClientSnapshot(new Date("2026-09-03T08:00:00.000Z"));

  assert.equal(history.length, 1);
  assert.equal(history[0].clientPayload.avatar, undefined);
  assert.equal(history[0].clientPayload.encodedPhoto, undefined);
  assert.equal(history[0].clientPayload.binaryPhoto, undefined);
  assert.equal(history[0].superOfficeTicket.attachments.length, 1);
  assert.equal(history[0].superOfficeTicket.attachments[0].id, "stable-photo");
  assert.equal(history[0].superOfficeTicket.attachments[0].dataUrl, undefined);
  assert.equal(history[0].superOfficeTicket.imageAttachments, undefined);
  assert.equal(history[0].superOfficeTicket.mediaAttachments, undefined);
}

{
  await resetStorage();

  for (let index = 1; index <= RECENT_CLIENT_HISTORY_LIMIT + 1; index += 1) {
    await recordRecentClientSnapshot({
      clientPayload: { billingAccount: `BA-${index}`, client: { firstName: `Client ${index}` } },
      tokenValues: { "{client_first_name}": `Client ${index}` },
      savedAt: new Date(Date.UTC(2026, 8, 3, 8, index)).toISOString()
    });
  }

  let history = await loadRecentClientHistory();
  assert.equal(history.length, RECENT_CLIENT_HISTORY_LIMIT);
  assert.equal(history[0].clientPayload.billingAccount, `BA-${RECENT_CLIENT_HISTORY_LIMIT + 1}`);
  assert.equal(history.some((entry) => entry.clientPayload.billingAccount === "BA-1"), false);

  await recordRecentClientSnapshot({
    clientPayload: {
      billingAccount: "BA-8",
      client: { firstName: "Updated client" },
      healthcheck: { lineState: "Online" }
    },
    tokenValues: { "{client_first_name}": "Updated client" },
    savedAt: "2026-09-03T10:00:00.000Z"
  });

  history = await loadRecentClientHistory();
  assert.equal(history.length, RECENT_CLIENT_HISTORY_LIMIT);
  assert.equal(history[0].clientPayload.billingAccount, "BA-8");
  assert.equal(history[0].clientPayload.client.firstName, "Updated client");
  assert.equal(history.filter((entry) => entry.clientPayload.billingAccount === "BA-8").length, 1);
}

{
  await resetStorage();
  const clientA = { billingAccount: "BA-A", client: { firstName: "Current" } };
  const clientB = { billingAccount: "BA-B", client: { firstName: "Archived" } };

  await saveActiveClientPayload(clientA);
  await saveTokenInputValues({ "{client_first_name}": "Current" });
  await saveSuperOfficeTicketPayload({
    ticketId: "SO-A",
    tokenValues: { "{so_ticket_num}": "SO-A" },
    attachments: []
  });
  const [archivedClient] = await recordRecentClientSnapshot({
    clientPayload: clientB,
    tokenValues: {
      "{client_first_name}": "Archived",
      "{so_ticket_num}": "SO-B"
    },
    superOfficeTicket: {
      ticketId: "SO-B",
      tokenValues: { "{so_ticket_num}": "SO-B" },
      attachments: [
        { id: "photo-b", name: "photo-b.jpg", url: "https://superoffice.example.test/photo-b.jpg", type: "image" }
      ]
    },
    savedAt: "2026-09-03T09:00:00.000Z"
  });

  const restored = await restoreRecentClientSnapshot(archivedClient.id, new Date("2026-09-03T10:00:00.000Z"));

  assert.equal(restored.clientPayload.billingAccount, "BA-B");
  assert.equal((await loadActiveClientPayload()).billingAccount, "BA-B");
  assert.equal((await loadTokenInputValues())["{client_first_name}"], "Archived");
  assert.equal((await loadSuperOfficeTicketPayload()).ticketId, "SO-B");
  const history = await loadRecentClientHistory();
  assert.equal(history.some((entry) => entry.clientPayload.billingAccount === "BA-B"), false);
  assert.equal(history[0].clientPayload.billingAccount, "BA-A");
  assert.equal(history[0].superOfficeTicket.ticketId, "SO-A");
}

{
  const templatesSource = readFileSync(new URL("../src/pages/Templates.jsx", import.meta.url), "utf8");
  const recentClientsMenuSource = readFileSync(new URL("../src/components/RecentClientsMenu.jsx", import.meta.url), "utf8");

  assert.match(templatesSource, /<RecentClientsMenu/);
  assert.match(recentClientsMenuSource, /Recent clients/);
  assert.match(recentClientsMenuSource, /No recent clients yet\./);
  assert.match(recentClientsMenuSource, /VTI \$\{presentation\.contractor \|\| "—"\}/);
  assert.match(recentClientsMenuSource, /Ticket \$\{presentation\.ticket \|\| "—"\}/);
}

console.log("recentClientHistory tests passed");
