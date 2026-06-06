import assert from "node:assert/strict";
import { ensureTokensFromTexts, loadTokens } from "../src/services/tokenService.js";

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

await ensureTokensFromTexts([
  "Hello {customer_name} {client_first_name} {contact_error} {healthcheck_oto_id}"
]);

const tokens = await loadTokens();
const customerToken = tokens.find((tokenDef) => tokenDef.token === "{customer_name}");

assert.ok(customerToken);
assert.equal(customerToken.display_mode, "on_demand");
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{client_first_name}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{contact_error}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{healthcheck_oto_id}"), false);

console.log("tokenService tests passed");
