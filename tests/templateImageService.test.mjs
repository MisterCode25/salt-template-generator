import assert from "node:assert/strict";
import {
    deleteIndexedJSON,
    loadIndexedJSON,
    saveIndexedJSON
} from "../src/services/indexedDbService.js";
import {
    loadTemplateImageMapForHtml,
    loadTemplateImages,
    saveTemplateImages
} from "../src/services/templateImageService.js";

const legacyImage = {
    id: "legacy-image",
    name: "Legacy",
    type: "image/png",
    dataUrl: "data:image/png;base64,legacy"
};
const unusedImage = {
    id: "unused-image",
    name: "Unused",
    type: "image/jpeg",
    dataUrl: "data:image/jpeg;base64,unused"
};

await saveIndexedJSON("template_images", [legacyImage, unusedImage]);

const requestedMap = await loadTemplateImageMapForHtml(
    '<img data-template-image-id="legacy-image">'
);
assert.equal(requestedMap.size, 1);
assert.equal(requestedMap.get("legacy-image").dataUrl, legacyImage.dataUrl);

const migratedMetadata = await loadIndexedJSON("template_images", []);
assert.equal(migratedMetadata.length, 2);
assert.equal("dataUrl" in migratedMetadata[0], false);
assert.equal(
    await loadIndexedJSON("template_image_data:legacy-image", ""),
    legacyImage.dataUrl
);

await saveTemplateImages([legacyImage]);
assert.equal(await loadIndexedJSON("template_image_data:unused-image", null), null);
assert.deepEqual((await loadTemplateImages()).map((image) => image.id), ["legacy-image"]);

await deleteIndexedJSON("template_images");
await deleteIndexedJSON("template_image_data:legacy-image");

console.log("templateImageService tests passed");
