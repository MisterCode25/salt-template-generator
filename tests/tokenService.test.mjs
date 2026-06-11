import assert from "node:assert/strict";
import { ensureTokensFromTexts, loadTokens, saveTokens } from "../src/services/tokenService.js";

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
const agentFirstNameToken = tokens.find((tokenDef) => tokenDef.token === "{agent_firstName}");
const agentEmailToken = tokens.find((tokenDef) => tokenDef.token === "{agent_email}");
const externalPartnerTicketToken = tokens.find((tokenDef) => tokenDef.token === "{external_partner_ticket_number}");
const externalCommentToken = tokens.find((tokenDef) => tokenDef.token === "{external_comment}");

assert.ok(customerToken);
assert.ok(soTicketToken);
assert.ok(agentFirstNameToken);
assert.ok(agentEmailToken);
assert.ok(externalPartnerTicketToken);
assert.equal(customerToken.display_mode, "on_demand");
assert.equal(soTicketToken.label, "SO ticket number");
assert.equal(soTicketToken.key, "soTicket");
assert.equal(soTicketToken.system, true);
assert.equal(agentFirstNameToken.system, true);
assert.equal(agentEmailToken.label, "Agent email");
assert.equal(externalPartnerTicketToken.system, true);
assert.equal(externalPartnerTicketToken.key, "partnerTicketNumber");
assert.equal(externalCommentToken, undefined);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{client_first_name}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{contact_error}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{healthcheck_oto_id}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{ticket_num}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{so_number}"), false);

await saveTokens(tokens);
const persistedTokens = JSON.parse(localStorage.getItem("local_tokens"));
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{agent_firstName}"), false);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{external_partner_ticket_number}"), false);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{so_ticket_num}"), false);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{customer_name}"), true);

console.log("tokenService tests passed");
