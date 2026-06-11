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
  const storage = createMemoryStorage();
  const profile = saveAgentProfile({
    firstName: "Samir",
    lastName: "Mestari",
    email: "samir@example.com",
    phoneNumber: "+410000000"
  }, storage);

  assert.deepEqual(loadAgentProfile(storage), profile);
  assert.equal(storage.getItem("input_{agent_firstName}"), "Samir");
  assert.equal(storage.getItem("input_{agent_email}"), "samir@example.com");
  assert.equal(getAgentProfileTokenValues(profile)["{agent_phoneNumber}"], "+410000000");
}

{
  const storage = createMemoryStorage({
    local_agent_profile: JSON.stringify({ firstName: "Old", lastName: "", email: "", phoneNumber: "" }),
    "input_{agent_firstName}": "Old"
  });

  const result = saveAgentProfileTokenValue("{agent_firstName}", "New", storage);

  assert.equal(result.token, "{agent_firstName}");
  assert.equal(result.value, "New");
  assert.equal(loadAgentProfile(storage).firstName, "New");
  assert.equal(storage.getItem("input_{agent_firstName}"), "New");

  syncAgentProfileInputValues({ firstName: "", lastName: "", email: "", phoneNumber: "" }, storage);
  assert.equal(storage.getItem("input_{agent_firstName}"), null);
}

console.log("agentProfileService tests passed");
