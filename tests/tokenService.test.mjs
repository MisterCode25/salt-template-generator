import assert from "node:assert/strict";
import {
  ensureTokensFromTexts,
  loadTokens,
  loadTokensWithClientData,
  saveTokens
} from "../src/services/tokenService.js";

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

const activeClientPayload = {
  client: {
    firstName: "Peter manuel",
    lastName: "BILLIG",
    sex: "Male"
  },
  healthcheck: {
    otoId: "B.111.783.391.7"
  }
};
localStorage.setItem("local_active_client_payload", JSON.stringify(activeClientPayload));
localStorage.setItem("input_{customer_name}", "Peter manuel BILLIG");
localStorage.setItem("input_{agent_email}", "samir@example.com");

const tokensWithClient = await loadTokensWithClientData();
const clientFirstNameToken = tokensWithClient.find((tokenDef) => tokenDef.token === "{client_first_name}");
const clientSexToken = tokensWithClient.find((tokenDef) => tokenDef.token === "{client_sex}");
const otoToken = tokensWithClient.find((tokenDef) => tokenDef.token === "{healthcheck_oto_id}");
const customerTokenWithPreview = tokensWithClient.find((tokenDef) => tokenDef.token === "{customer_name}");
const agentEmailTokenWithPreview = tokensWithClient.find((tokenDef) => tokenDef.token === "{agent_email}");

assert.ok(clientFirstNameToken);
assert.ok(clientSexToken);
assert.ok(otoToken);
assert.ok(customerTokenWithPreview);
assert.ok(agentEmailTokenWithPreview);
assert.equal(clientFirstNameToken.label, "First name");
assert.ok(clientFirstNameToken.internal);
assert.ok(clientFirstNameToken.searchAliases.includes("prenom"));
assert.ok(clientSexToken.searchAliases.includes("sexe"));
assert.equal(otoToken.label, "OTO ID");
assert.ok(otoToken.searchAliases.includes("otoId"));
assert.equal(clientFirstNameToken.previewValue, "Peter manuel");
assert.equal(clientSexToken.previewValue, "Male");
assert.equal(otoToken.previewValue, "B.111.783.391.7");
assert.equal(customerTokenWithPreview.previewValue, "Peter manuel BILLIG");
assert.equal(agentEmailTokenWithPreview.previewValue, "samir@example.com");

await saveTokens(tokensWithClient);
const persistedTokensAfterClientMerge = JSON.parse(localStorage.getItem("local_tokens"));
assert.equal(persistedTokensAfterClientMerge.some((tokenDef) => tokenDef.token === "{client_first_name}"), false);
assert.equal(persistedTokensAfterClientMerge.some((tokenDef) => tokenDef.token === "{client_sex}"), false);
assert.equal(persistedTokensAfterClientMerge.some((tokenDef) => tokenDef.token === "{healthcheck_oto_id}"), false);
assert.equal(
  persistedTokensAfterClientMerge.find((tokenDef) => tokenDef.token === "{customer_name}").previewValue,
  undefined
);

console.log("tokenService tests passed");
