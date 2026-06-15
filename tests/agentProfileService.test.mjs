import assert from "node:assert/strict";
import {
  AGENT_PROFILE_TOKENS,
  getAgentProfileTokenValues,
  isAgentProfileToken,
  loadAgentProfile,
  saveAgentProfile,
  saveAgentProfileTokenValue,
  syncAgentProfileInputValues
} from "../src/services/agentProfileService.js";
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
  assert.deepEqual(
    AGENT_PROFILE_TOKENS.map((tokenDef) => tokenDef.token),
    ["{agent_firstName}", "{agent_lastName}", "{agent_email}", "{agent_phoneNumber}"]
  );
  assert.equal(isAgentProfileToken("{agent_email}"), true);
  assert.equal(isAgentProfileToken("{client_first_name}"), false);
}

{
  await clearAppIndexedDB();
  globalThis.localStorage = createMemoryStorage();
  const profile = await saveAgentProfile({
    firstName: "Samir",
    lastName: "Mestari",
    email: "samir@example.com",
    phoneNumber: "+410000000"
  });

  assert.deepEqual(await loadAgentProfile(), profile);
  const tokenInputValues = await loadTokenInputValues();
  assert.equal(tokenInputValues["{agent_firstName}"], "Samir");
  assert.equal(tokenInputValues["{agent_email}"], "samir@example.com");
  assert.equal(getAgentProfileTokenValues(profile)["{agent_phoneNumber}"], "+410000000");
}

{
  await clearAppIndexedDB();
  globalThis.localStorage = createMemoryStorage({
    local_agent_profile: JSON.stringify({ firstName: "Old", lastName: "", email: "", phoneNumber: "" }),
    "input_{agent_firstName}": "Old"
  });

  const result = await saveAgentProfileTokenValue("{agent_firstName}", "New");

  assert.equal(result.token, "{agent_firstName}");
  assert.equal(result.value, "New");
  assert.equal((await loadAgentProfile()).firstName, "New");
  assert.equal((await loadTokenInputValues())["{agent_firstName}"], "New");

  await syncAgentProfileInputValues({ firstName: "", lastName: "", email: "", phoneNumber: "" });
  assert.equal((await loadTokenInputValues())["{agent_firstName}"], undefined);
}

console.log("agentProfileService tests passed");
