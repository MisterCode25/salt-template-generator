import assert from "node:assert/strict";
import {
  clearActiveClientPayload,
  clearStoredInputValues,
  MANUAL_CLIENT_INPUTS_KEY,
  loadActiveClientPayload,
  saveClientInputValue,
  saveActiveClientPayload
} from "../src/services/activeClientService.js";

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
  const storage = createMemoryStorage({
    "input_{client_first_name}": "Peter",
    "input_{ticket_num}": "SO-123",
    theme_pref: "dark",
    active_client_payload: "{}"
  });

  const removed = clearStoredInputValues(storage);

  assert.equal(removed, 2);
  assert.equal(storage.getItem("input_{client_first_name}"), null);
  assert.equal(storage.getItem("input_{ticket_num}"), null);
  assert.equal(storage.getItem("theme_pref"), "dark");
  assert.equal(storage.getItem("active_client_payload"), "{}");
}

{
  globalThis.localStorage = createMemoryStorage();
  const payload = { client: { firstName: "Peter" } };

  saveActiveClientPayload(payload);
  assert.deepEqual(loadActiveClientPayload(), payload);

  clearActiveClientPayload();
  assert.equal(loadActiveClientPayload(), null);
}

{
  globalThis.localStorage = createMemoryStorage();
  saveActiveClientPayload({ client: { firstName: "Peter" } });

  const { inputTokens } = saveClientInputValue({
    token: "{ticket_num}",
    label: "SO number",
    key: "soTicket"
  }, "31436062");

  assert.ok(inputTokens.includes("{ticket_num}"));
  assert.ok(inputTokens.includes("{so_number}"));
  assert.equal(localStorage.getItem("input_{ticket_num}"), "31436062");
  assert.equal(localStorage.getItem("input_{so_number}"), "31436062");
  assert.equal(localStorage.getItem("input_{so_ticket}"), "31436062");
  assert.equal(loadActiveClientPayload()[MANUAL_CLIENT_INPUTS_KEY].ticket_num, "31436062");
  assert.equal(loadActiveClientPayload()[MANUAL_CLIENT_INPUTS_KEY].so_number, "31436062");
}

console.log("activeClientService tests passed");
