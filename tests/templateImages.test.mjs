import assert from "node:assert/strict";

const {
  buildTemplateImageMap,
  extractTemplateImageIdsFromHtml,
  hydrateTemplateImageHtml,
  normalizeTemplateImages,
  stripImagesFromHtml
} = await import("../src/utils/templateImages.js");
const {
  buildConfigPayload,
  validateImportedConfig
} = await import("../src/services/configService.js");

const image = {
  id: "img-1",
  name: "Router photo",
  type: "image/jpeg",
  size: 1234,
  width: 900,
  height: 600,
  createdAt: 1710000000000,
  dataUrl: "data:image/jpeg;base64,abc123"
};

function computeTestChecksum(serialized) {
  return Array.from(serialized).reduce((sum, ch) => (sum + ch.charCodeAt(0)) % 1000000007, 0);
}

{
  const normalized = normalizeTemplateImages([
    image,
    { id: "", dataUrl: "ignored" },
    { ...image, name: "Router photo duplicate" }
  ]);

  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].id, "img-1");
  assert.equal(normalized[0].name, "Router photo duplicate");
}

{
  const html = [
    "<p>Photo:</p>",
    '<img data-template-image-id="img-1" data-template-image-name="Router photo" alt="Router photo">',
    '<img data-template-image-id="missing">'
  ].join("");
  const imageMap = buildTemplateImageMap([image]);

  assert.deepEqual(extractTemplateImageIdsFromHtml(html), ["img-1", "missing"]);

  const hydrated = hydrateTemplateImageHtml(html, imageMap);
  assert.match(hydrated, /src="data:image\/jpeg;base64,abc123"/);
  assert.match(hydrated, /data-template-image-id="missing"/);
}

{
  const payload = buildConfigPayload(
    "Image config",
    [],
    { nodes: [], templates: [] },
    [image],
    { templateInstruction: "Start with Hello {customer_name}." },
    [
      {
        id: "tool-1",
        title: "Customer search",
        url: "https://example.com?q={client_name}",
        color: "rose"
      },
      {
        id: "module-1",
        type: "module",
        title: "Refund helper",
        html: "<main>Refund</main>",
        color: "violet"
      }
    ],
    { locked: true }
  );
  const imported = validateImportedConfig(payload);

  assert.equal(payload.meta.schemaVersion, 3);
  assert.equal(payload.meta.locked, true);
  assert.equal(payload.meta.includes.templates, true);
  assert.equal(payload.meta.includes.templateImages, true);
  assert.equal(payload.meta.includes.tools, true);
  assert.equal(imported.templateImages.length, 1);
  assert.equal(imported.templateImages[0].dataUrl, image.dataUrl);
  assert.equal(imported.chatGptPromptSettings.templateInstruction, "Start with Hello {customer_name}.");
  assert.equal(imported.hasTokens, true);
  assert.equal(imported.hasTreeData, true);
  assert.equal(imported.hasTemplateImages, true);
  assert.equal(imported.hasChatGptPromptSettings, true);
  assert.equal(imported.hasTools, true);
  assert.equal(imported.tools.length, 2);
  assert.equal(imported.tools[0].title, "Customer search");
  assert.equal(imported.tools[1].type, "module");
  assert.equal(imported.tools[1].beta, true);
  assert.equal(imported.tools[1].url, "");
  assert.equal(imported.hasLock, true);
  assert.equal(imported.locked, true);

  const previousPayload = {
    meta: { ...payload.meta, checksum: 0 },
    tokens: payload.tokens,
    nodes: payload.nodes,
    templates: payload.templates,
    templateImages: payload.templateImages,
    configName: payload.configName
  };
  delete previousPayload.meta.includes;
  previousPayload.meta.checksum = computeTestChecksum(JSON.stringify({
    meta: previousPayload.meta,
    tokens: previousPayload.tokens,
    nodes: previousPayload.nodes,
    templates: previousPayload.templates,
    templateImages: previousPayload.templateImages
  }));

  const previousImported = validateImportedConfig(previousPayload);
  assert.equal(previousImported.templateImages.length, 1);
  assert.equal(previousImported.chatGptPromptSettings.templateInstruction, "");
  assert.equal(previousImported.hasTools, false);
  assert.equal(previousImported.tools.length, 0);
  assert.equal(previousImported.hasLock, true);
  assert.equal(previousImported.locked, true);
}

{
  const partial = buildConfigPayload(
    "Tools only",
    [{ token: "{customer}", label: "Customer" }],
    {
      nodes: [{ id: "node-1", title: "Topic" }],
      templates: [{ id: "template-1", nodeIds: ["node-1"], parentNodeId: "node-1", title: "Template" }]
    },
    [image],
    { templateInstruction: "Keep short." },
    [{ id: "tool-1", title: "Customer search", url: "https://example.com?q={customer}" }],
    {
      include: {
        templates: false,
        templateImages: false,
        tokens: false,
        chatGptPromptSettings: false,
        tools: true
      }
    }
  );
  const importedPartial = validateImportedConfig(partial);

  assert.equal(partial.meta.includes.templates, false);
  assert.equal(partial.meta.includes.tools, true);
  assert.equal(partial.tokens.length, 0);
  assert.equal(partial.nodes.length, 0);
  assert.equal(partial.templates.length, 0);
  assert.equal(partial.templateImages.length, 0);
  assert.equal(partial.chatGptPromptSettings.templateInstruction, "");
  assert.equal(partial.tools.length, 1);
  assert.equal(importedPartial.hasTokens, false);
  assert.equal(importedPartial.hasTreeData, false);
  assert.equal(importedPartial.hasTemplateImages, false);
  assert.equal(importedPartial.hasChatGptPromptSettings, false);
  assert.equal(importedPartial.hasTools, true);
  assert.equal(importedPartial.tools.length, 1);
}

{
  const html = 'Hello <img data-template-image-id="img-1" alt="router"><span>world</span><img src="x">';
  assert.equal(stripImagesFromHtml(html), "Hello <span>world</span>");
}

console.log("templateImages tests passed");
