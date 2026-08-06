import assert from "node:assert/strict";
import {
  ensureTokensFromTexts,
  loadTokens,
  loadTokensWithClientData,
  saveTokens
} from "../src/services/tokenService.js";
import { saveActiveClientPayload } from "../src/services/activeClientService.js";
import { clearAppIndexedDB } from "../src/services/indexedDbService.js";
import { loadJSON } from "../src/services/storageService.js";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }
  get length() {
    return this.store.size;
  }
  key(index) {
    return Array.from(this.store.keys())[index] ?? null;
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
const caseProblemDateToken = tokens.find((tokenDef) => tokenDef.token === "{case_problem_date}");

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
assert.equal(caseProblemDateToken?.system, true);
assert.equal(caseProblemDateToken?.input_type, "date");
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{client_first_name}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{contact_error}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{healthcheck_oto_id}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{ticket_num}"), false);
assert.equal(tokens.some((tokenDef) => tokenDef.token === "{so_number}"), false);

await saveTokens(tokens);
const persistedTokens = await loadJSON("tokens", []);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{agent_firstName}"), false);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{external_partner_ticket_number}"), false);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{so_ticket_num}"), false);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{case_problem_date}"), false);
assert.equal(persistedTokens.some((tokenDef) => tokenDef.token === "{customer_name}"), true);

await clearAppIndexedDB();
localStorage.setItem("local_tokens", JSON.stringify([
  { id: "legacy-agent-name", token: "{agent_name}", label: "Agent Name", display_mode: "on_demand" },
  { id: "legacy-agent", token: "{agent}", label: "agent", display_mode: "on_demand" },
  { id: "legacy-contact-num", token: "{contact_num}", label: "Customer number", display_mode: "on_demand" },
  { id: "customer", token: "{customer_name}", label: "Customer name", display_mode: "on_demand" },
  { id: "custom-ticket", token: "{ticketname}", label: "ticketName", display_mode: "on_demand" }
]));
localStorage.setItem("input_{agent_name}", "Legacy Agent");
localStorage.setItem("input_{agent}", "Legacy");
localStorage.setItem("input_{contact_num}", "123");

const cleanedLegacyTokens = await loadTokens();
assert.equal(cleanedLegacyTokens.some((tokenDef) => tokenDef.token === "{agent_name}"), false);
assert.equal(cleanedLegacyTokens.some((tokenDef) => tokenDef.token === "{agent}"), false);
assert.equal(cleanedLegacyTokens.some((tokenDef) => tokenDef.token === "{contact_num}"), false);
assert.equal(cleanedLegacyTokens.some((tokenDef) => tokenDef.token === "{ticketname}"), true);
const persistedAfterLegacyCleanup = await loadJSON("tokens", []);
assert.equal(persistedAfterLegacyCleanup.some((tokenDef) => tokenDef.token === "{agent_name}"), false);
assert.equal(persistedAfterLegacyCleanup.some((tokenDef) => tokenDef.token === "{agent}"), false);
assert.equal(persistedAfterLegacyCleanup.some((tokenDef) => tokenDef.token === "{contact_num}"), false);
assert.equal(persistedAfterLegacyCleanup.some((tokenDef) => tokenDef.token === "{ticketname}"), true);
assert.equal(localStorage.getItem("input_{agent_name}"), null);
assert.equal(localStorage.getItem("input_{agent}"), null);
assert.equal(localStorage.getItem("input_{contact_num}"), null);

await ensureTokensFromTexts([
  "Legacy {agent_name} {agent} {contact_num} plus custom {allowed_custom_token}"
]);
const afterLegacyTextScan = await loadTokens();
assert.equal(afterLegacyTextScan.some((tokenDef) => tokenDef.token === "{agent_name}"), false);
assert.equal(afterLegacyTextScan.some((tokenDef) => tokenDef.token === "{agent}"), false);
assert.equal(afterLegacyTextScan.some((tokenDef) => tokenDef.token === "{contact_num}"), false);
assert.equal(afterLegacyTextScan.some((tokenDef) => tokenDef.token === "{allowed_custom_token}"), true);

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
await saveActiveClientPayload(activeClientPayload);
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
const persistedTokensAfterClientMerge = await loadJSON("tokens", []);
assert.equal(persistedTokensAfterClientMerge.some((tokenDef) => tokenDef.token === "{client_first_name}"), false);
assert.equal(persistedTokensAfterClientMerge.some((tokenDef) => tokenDef.token === "{client_sex}"), false);
assert.equal(persistedTokensAfterClientMerge.some((tokenDef) => tokenDef.token === "{healthcheck_oto_id}"), false);
assert.equal(
  persistedTokensAfterClientMerge.find((tokenDef) => tokenDef.token === "{customer_name}").previewValue,
  undefined
);

console.log("tokenService tests passed");
