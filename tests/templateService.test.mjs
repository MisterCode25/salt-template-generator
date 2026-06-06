import assert from "node:assert/strict";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

function createRequest() {
  return {
    result: undefined,
    error: null,
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null
  };
}

function createFakeIndexedDB() {
  const data = new Map();
  const objectStoreNames = {
    contains: () => true
  };
  const db = {
    objectStoreNames,
    createObjectStore: () => {},
    close: () => {},
    transaction: () => {
      const transaction = {
        error: null,
        oncomplete: null,
        onerror: null,
        onabort: null,
        abort: () => transaction.onabort?.(),
        objectStore: () => ({
          get: (key) => {
            const request = createRequest();
            setTimeout(() => {
              request.result = data.get(key);
              request.onsuccess?.();
            }, 0);
            return request;
          },
          put: (value, key) => {
            data.set(key, value);
            return createRequest();
          },
          delete: (key) => {
            data.delete(key);
            return createRequest();
          },
          clear: () => {
            data.clear();
            return createRequest();
          }
        })
      };
      setTimeout(() => transaction.oncomplete?.(), 2);
      return transaction;
    }
  };

  return {
    data,
    open: () => {
      const request = createRequest();
      setTimeout(() => {
        request.result = db;
        request.onupgradeneeded?.();
        request.onsuccess?.();
      }, 0);
      return request;
    }
  };
}

global.localStorage = new LocalStorageMock();
global.indexedDB = createFakeIndexedDB();

const { renameTokenInTemplates, loadTemplates, saveTemplates } = await import("../src/services/templateService.js");

const templates = [
  {
    id: "tpl-1",
    title: "Template 1",
    type: "email",
    text_fr: "Bonjour {old_token}",
    text_en: "Hello {old_token}",
    text_de: "Hallo {old_token}",
    text_it: "Ciao {old_token}",
    variants: [
      {
        id: "var-1",
        name: "Variant 1",
        text_fr: "Var FR {old_token}",
        text_en: "Var EN {old_token}",
        text_de: "Var DE {old_token}",
        text_it: "Var IT {old_token}"
      }
    ]
  }
];

localStorage.setItem("local_models", JSON.stringify(templates));

const migrated = await loadTemplates();
assert.equal(migrated[0].text_en, "Hello {old_token}");
assert.deepEqual(indexedDB.data.get("models"), migrated);

await renameTokenInTemplates("{old_token}", "{new_token}");

const updated = await loadTemplates();
assert.equal(updated[0].text_fr, "Bonjour {new_token}");
assert.equal(updated[0].text_en, "Hello {new_token}");
assert.equal(updated[0].variants[0].text_it, "Var IT {new_token}");

await saveTemplates([
  {
    id: "tpl-rich",
    title: "Rich",
    type: "email",
    text_fr: "<p>Hello <strong>{customer_name}</strong></p>",
    text_en: "<p>Hello <strong>{customer_name}</strong></p>",
    text_de: "",
    text_it: "",
    variants: []
  }
]);

assert.equal(indexedDB.data.get("models")[0].text_fr, "<p>Hello <strong>{customer_name}</strong></p>");

console.log("templateService tests passed");
