import assert from "node:assert/strict";
import {
  clearActiveClientPayload,
  clearStoredInputValues,
  MANUAL_CLIENT_INPUTS_KEY,
  loadActiveClientPayload,
  migrateStoredClientInputValues,
  saveClientInputValue,
  saveClientInputValues,
  saveActiveClientPayload
} from "../src/services/activeClientService.js";
import { clearAppIndexedDB } from "../src/services/indexedDbService.js";
import { loadTokenInputValues } from "../src/services/tokenInputValueService.js";

function createMemoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    key(index) {
      return Array.from(map.keys())[index] ?? null;
    },
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    }
  };
}

{
  await clearAppIndexedDB();
  globalThis.localStorage = createMemoryStorage({
    "input_{client_first_name}": "Peter",
    "input_{ticket_num}": "SO-123",
    theme_pref: "dark",
    active_client_payload: "{}"
  });

  const removed = await clearStoredInputValues();

  assert.equal(removed, 2);
  assert.equal(localStorage.getItem("input_{client_first_name}"), null);
  assert.equal(localStorage.getItem("input_{ticket_num}"), null);
  assert.equal(localStorage.getItem("theme_pref"), "dark");
  assert.equal(localStorage.getItem("active_client_payload"), "{}");
}

{
  await clearAppIndexedDB();
  globalThis.localStorage = createMemoryStorage();
  const payload = { client: { firstName: "Peter" } };

  await saveActiveClientPayload(payload);
  assert.deepEqual(await loadActiveClientPayload(), payload);

  await clearActiveClientPayload();
  assert.equal(await loadActiveClientPayload(), null);
}

{
  await clearAppIndexedDB();
  globalThis.localStorage = createMemoryStorage();
  await saveActiveClientPayload({ client: { firstName: "Peter" } });

  const { inputTokens } = await saveClientInputValue({
    token: "{ticket_num}",
    label: "SO number",
    key: "soTicket"
  }, "31436062");

  assert.deepEqual(inputTokens, ["{so_ticket_num}"]);
  const tokenInputValues = await loadTokenInputValues();
  assert.equal(tokenInputValues["{ticket_num}"], undefined);
  assert.equal(tokenInputValues["{so_number}"], undefined);
  assert.equal(tokenInputValues["{so_ticket_num}"], "31436062");
  assert.equal((await loadActiveClientPayload())[MANUAL_CLIENT_INPUTS_KEY].so_ticket_num, "31436062");
}

{
  await clearAppIndexedDB();
  globalThis.localStorage = createMemoryStorage();
  await saveActiveClientPayload({ client: { firstName: "Peter" } });

  const { inputTokens, values } = await saveClientInputValues({
    "{external_partner}": "EWB",
    "{external_partner_ticket_number}": "ABC-123"
  });

  assert.deepEqual(inputTokens, ["{external_partner}", "{external_partner_ticket_number}"]);
  assert.deepEqual(values, {
    "{external_partner}": "EWB",
    "{external_partner_ticket_number}": "ABC-123"
  });
  assert.equal((await loadTokenInputValues())["{external_partner_ticket_number}"], "ABC-123");
  assert.equal((await loadActiveClientPayload())[MANUAL_CLIENT_INPUTS_KEY].external_partner_ticket_number, "ABC-123");
}

{
  await clearAppIndexedDB();
  globalThis.localStorage = createMemoryStorage({
    "input_{ticket_num}": "SO-123",
    "input_{customer_name}": "Peter"
  });

  await migrateStoredClientInputValues();
  const migratedValues = await loadTokenInputValues();

  assert.equal(localStorage.getItem("input_{ticket_num}"), null);
  assert.equal(localStorage.getItem("input_{customer_name}"), null);
  assert.equal(migratedValues["{so_ticket_num}"], "SO-123");
  assert.equal(migratedValues["{customer_name}"], "Peter");
}

console.log("activeClientService tests passed");
