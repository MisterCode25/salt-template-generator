import assert from "node:assert/strict";

const {
  matchTokenTriggerBeforeCaret,
  makeTokenChip,
  serializeRichText,
  serializeRichTextPlain
} = await import("../src/utils/richTextTokens.js");

function createFakeDocument() {
  return {
    createElement: () => ({
      className: "",
      contentEditable: "",
      dataset: {},
      textContent: ""
    })
  };
}

const documentRef = createFakeDocument();
const tokenDefs = [
  { token: "{client_first_name}", label: "Client first name" },
  { token: "{agent_email}", label: "Agent email" }
];

const chipFromArray = makeTokenChip(documentRef, "{client_first_name}", tokenDefs);
assert.equal(chipFromArray.dataset.label, "Client first name");
assert.equal(chipFromArray.textContent, "Client first name");

const chipFromMap = makeTokenChip(documentRef, "{agent_email}", new Map([
  ["{agent_email}", "Agent email"]
]));
assert.equal(chipFromMap.dataset.label, "Agent email");

const unknownChip = makeTokenChip(documentRef, "{unknown_token}", tokenDefs);
assert.equal(unknownChip.dataset.label, "unknown token");

assert.deepEqual(matchTokenTriggerBeforeCaret("@client"), {
  query: "client",
  raw: "@client"
});
assert.deepEqual(matchTokenTriggerBeforeCaret("Hello @client"), {
  query: "client",
  raw: "@client"
});
assert.deepEqual(matchTokenTriggerBeforeCaret("Hello @client ", { completed: true }), {
  query: "client",
  raw: "@client "
});
assert.equal(matchTokenTriggerBeforeCaret("samir@example"), null);
assert.equal(matchTokenTriggerBeforeCaret("samir@example ", { completed: true }), null);
assert.equal(matchTokenTriggerBeforeCaret("Text,@client"), null);

{
  let cloned = false;
  const root = {
    innerHTML: "<p>Hello</p>",
    textContent: "Hello",
    querySelector: () => null,
    cloneNode: () => {
      cloned = true;
      throw new Error("should not clone without token chips");
    }
  };

  assert.equal(serializeRichText(root), "<p>Hello</p>");
  assert.equal(serializeRichTextPlain(root), "Hello");
  assert.equal(cloned, false);
}

console.log("richTextTokens tests passed");
