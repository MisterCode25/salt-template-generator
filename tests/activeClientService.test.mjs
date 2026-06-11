import assert from "node:assert/strict";
import {
  clearActiveClientPayload,
  clearStoredInputValues,
  loadActiveClientPayload,
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

console.log("activeClientService tests passed");
