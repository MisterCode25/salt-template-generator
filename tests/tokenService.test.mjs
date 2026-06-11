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
  "Hello {customer_name} {client_first_name} {contact_error} {healthcheck_oto_id}",
  "Ticket {ticket_num} {so_number}"
]);

const tokens = await loadTokens();
const customerToken = tokens.find((tokenDef) => tokenDef.token === "{customer_name}");
const soTicketToken = tokens.find((tokenDef) => tokenDef.token === "{so_ticket_num}");

assert.ok(customerToken);
assert.ok(soTicketToken);
assert.equal(customerToken.display_mode, "on_demand");
assert.equal(soTicketToken.label, "SO ticket number");
assert.equal(soTicketToken.key, "soTicket");
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{client_first_name}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{contact_error}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{healthcheck_oto_id}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{ticket_num}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{so_number}"), false);

console.log("tokenService tests passed");
