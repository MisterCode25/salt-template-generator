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
  const payload = buildConfigPayload("Image config", [], { nodes: [], templates: [] }, [image]);
  const imported = validateImportedConfig(payload);

  assert.equal(payload.meta.schemaVersion, 3);
  assert.equal(imported.templateImages.length, 1);
  assert.equal(imported.templateImages[0].dataUrl, image.dataUrl);
}

{
  const html = 'Hello <img data-template-image-id="img-1" alt="router"><span>world</span><img src="x">';
  assert.equal(stripImagesFromHtml(html), "Hello <span>world</span>");
}

console.log("templateImages tests passed");
