import assert from "node:assert/strict";
import { renameTokenInTemplates, loadTemplates } from "../src/services/templateService.js";

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

global.localStorage = new LocalStorageMock();

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

await renameTokenInTemplates("{old_token}", "{new_token}");

const updated = await loadTemplates();
assert.equal(updated[0].text_fr, "Bonjour {new_token}");
assert.equal(updated[0].text_en, "Hello {new_token}");
assert.equal(updated[0].variants[0].text_it, "Var IT {new_token}");

console.log("templateService tests passed");
