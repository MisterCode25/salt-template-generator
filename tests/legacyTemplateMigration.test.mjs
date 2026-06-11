import assert from "node:assert/strict";

const { migrateLegacyModelsToTemplateTree } = await import("../src/utils/legacyTemplateMigration.js");
const { validateImportedConfig } = await import("../src/services/configService.js");

const legacyModels = [
  {
    id: "welcome",
    type: "Email",
    title: "Welcome",
    description: "First contact",
    mainVariantName: "Default",
    text_fr: "<p>Bonjour {customer}</p>",
    text_en: "<p>Hello {customer}</p>",
    variants: [
      {
        id: "formal",
        name: "Formal",
        text_en: "<p>Dear {customer}</p>"
      },
      {
        id: "short",
        name: "Short",
        text_fr: "<p>Salut {customer}</p>"
      }
    ]
  },
  {
    id: "callback",
    type: "sms",
    title: "Call back",
    text_fr: "Rappelez-nous",
    text_de: "Bitte rufen Sie uns an"
  },
  {
    id: "internal-note",
    type: "unknown",
    title: "Internal note",
    text_fr: "Note interne"
  }
];

const migrated = migrateLegacyModelsToTemplateTree(legacyModels);

assert.deepEqual(
  migrated.nodes.filter((node) => node.parentId === null).map((node) => node.title),
  ["Email", "SMS", "Other"]
);

const emailRoot = migrated.nodes.find((node) => node.id === "legacy-channel-email");
const smsRoot = migrated.nodes.find((node) => node.id === "legacy-channel-sms");
const otherRoot = migrated.nodes.find((node) => node.id === "legacy-channel-other");
assert.equal(emailRoot.icon, "mail");
assert.equal(smsRoot.icon, "sms");
assert.equal(otherRoot.icon, "document");

const welcomeNode = migrated.nodes.find((node) => node.title === "Welcome");
assert.equal(welcomeNode.parentId, emailRoot.id);
assert.equal(welcomeNode.order, 1);

const welcomeTemplates = migrated.templates
  .filter((template) => template.parentNodeId === welcomeNode.id)
  .sort((a, b) => a.order - b.order);
assert.deepEqual(welcomeTemplates.map((template) => template.title), ["Welcome"]);
assert.deepEqual(welcomeTemplates.map((template) => template.channels), [["email"]]);
assert.equal(welcomeTemplates[0].contentByChannel.email.mainVariantName, "Default");
assert.equal(welcomeTemplates[0].contentByChannel.email.text_fr, "<p>Bonjour {customer}</p>");
assert.equal(welcomeTemplates[0].contentByChannel.email.text_en, "<p>Hello {customer}</p>");
assert.deepEqual(
  welcomeTemplates[0].contentByChannel.email.variants.map((variant) => variant.name),
  ["Formal", "Short"]
);
assert.equal(welcomeTemplates[0].contentByChannel.email.variants[0].text_fr, "");
assert.equal(welcomeTemplates[0].contentByChannel.email.variants[0].text_en, "<p>Dear {customer}</p>");
assert.equal(welcomeTemplates[0].contentByChannel.email.variants[1].text_fr, "<p>Salut {customer}</p>");
assert.equal(welcomeTemplates[0].contentByChannel.email.variants[1].text_en, "");

const callbackNode = migrated.nodes.find((node) => node.title === "Call back");
const callbackTemplate = migrated.templates.find((template) => template.parentNodeId === callbackNode.id);
assert.equal(callbackNode.parentId, smsRoot.id);
assert.equal(callbackTemplate.title, "Call back");
assert.equal(callbackTemplate.contentByChannel.sms.text_de, "Bitte rufen Sie uns an");

const noteNode = migrated.nodes.find((node) => node.title === "Internal note");
assert.equal(noteNode.parentId, otherRoot.id);

const imported = validateImportedConfig({
  configName: "Legacy config",
  tokens: [{ token: "{customer}", label: "Customer" }],
  models: legacyModels
});
assert.equal(imported.configName, "Legacy config");
assert.equal(imported.tokens[0].token, "{customer}");
assert.equal(imported.nodes.length, migrated.nodes.length);
assert.equal(imported.templates.length, migrated.templates.length);

console.log("legacyTemplateMigration tests passed");
