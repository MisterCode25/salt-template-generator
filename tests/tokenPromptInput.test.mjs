import assert from "node:assert/strict";
import {
  formatDateInputValueForToken,
  formatDateTokenValueForInput,
  getTokenPromptInputType,
  isDateTokenDefinition
} from "../src/utils/tokenPromptInput.js";

assert.equal(isDateTokenDefinition({ token: "{activation_date}", input_type: "text" }), true);
assert.equal(isDateTokenDefinition({ token: "{birthDate}" }), true);
assert.equal(isDateTokenDefinition({ token: "{candidate_name}" }), false);
assert.equal(isDateTokenDefinition({ token: "{client_name}", input_type: "date" }), true);

assert.equal(getTokenPromptInputType({ token: "{intervention_date}", input_type: "text" }), "date");
assert.equal(getTokenPromptInputType({ token: "{quantity}", input_type: "number" }), "number");
assert.equal(getTokenPromptInputType({ token: "{comment}", input_type: "text" }), "text");

assert.equal(formatDateTokenValueForInput("30.07.2026"), "2026-07-30");
assert.equal(formatDateTokenValueForInput("30/07/2026"), "2026-07-30");
assert.equal(formatDateTokenValueForInput("2026-07-30"), "2026-07-30");
assert.equal(formatDateTokenValueForInput("not a date"), "");

assert.equal(formatDateInputValueForToken("2026-07-30"), "30.07.2026");
assert.equal(formatDateInputValueForToken(""), "");

console.log("tokenPromptInput tests passed");
