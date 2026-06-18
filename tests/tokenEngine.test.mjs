import assert from "node:assert/strict";
import {
  applyTokens,
  generateFinalText,
  getTemplateTextByLang,
  getTemplateTextResult
} from "../src/core/tokenEngine.js";

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
  const output = applyTokens("Hello {name} {missing}", { "{name}": "World" });
  assert.equal(output, "Hello World {missing}");
}

{
  const values = { "{customer}": "Alice" };
  const en = generateFinalText(sampleModel, "en", values);
  assert.equal(en, "Hello Alice");
  const fr = generateFinalText(sampleModel, "fr", values);
  assert.equal(fr, "Bonjour Alice");
}

{
  const titleModel = {
    text_fr: "Bonjour {client_title} {client_last_name}",
    text_en: "Hello {client_title} {client_last_name}",
    text_de: "Guten Tag {client_title} {client_last_name}",
    text_it: "Buongiorno {client_title} {client_last_name}"
  };
  const maleValues = { "{client_title}": "Mr.", "{client_last_name}": "BILLIG" };
  const femaleValues = { "{client_title}": "Ms.", "{client_last_name}": "BILLIG" };

  assert.equal(generateFinalText(titleModel, "fr", maleValues), "Bonjour M. BILLIG");
  assert.equal(generateFinalText(titleModel, "de", maleValues), "Guten Tag Herr BILLIG");
  assert.equal(generateFinalText(titleModel, "de", femaleValues), "Guten Tag Frau BILLIG");
  assert.equal(generateFinalText(titleModel, "it", femaleValues), "Buongiorno Sig.ra BILLIG");
}

{
  const frOnlyModel = {
    text_fr: "Bonjour {customer}",
    text_en: "",
    text_de: "",
    text_it: ""
  };
  const result = getTemplateTextResult(frOnlyModel, "en");
  assert.equal(result.text, "Bonjour {customer}");
  assert.equal(result.lang, "fr");
  assert.equal(result.isFallback, true);
  assert.equal(getTemplateTextByLang(frOnlyModel, "en"), "Bonjour {customer}");
  assert.equal(generateFinalText(frOnlyModel, "en", { "{customer}": "Alice" }), "Bonjour Alice");
}

console.log("tokenEngine tests passed");
