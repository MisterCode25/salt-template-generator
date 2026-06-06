import assert from "node:assert/strict";
import { applyTokens, generateFinalText } from "../src/core/tokenEngine.js";

const sampleModel = {
  text_fr: "Bonjour {customer}",
  text_en: "Hello {customer}",
  text_de: "Hallo {customer}",
  text_it: "Ciao {customer}"
};

{
  const output = applyTokens("Hello {name}", { "{name}": "World" });
  assert.equal(output, "Hello World");
}

{
  const output = applyTokens("<p>Hello <strong>{customer_name}</strong></p>", {
    "{customer_name}": "Alice"
  });
  assert.equal(output, "<p>Hello <strong>Alice</strong></p>");
}

{
  const output = applyTokens("No tokens here", {});
  assert.equal(output, "No tokens here");
}

{
  const values = { "{customer}": "Alice" };
  const en = generateFinalText(sampleModel, "en", values);
  assert.equal(en, "Hello Alice");
  const fr = generateFinalText(sampleModel, "fr", values);
  assert.equal(fr, "Bonjour Alice");
}

console.log("tokenEngine tests passed");
