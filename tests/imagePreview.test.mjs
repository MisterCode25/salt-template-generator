import assert from "node:assert/strict";
import {
  getImagePreviewKind,
  isDirectlyPreviewableImage,
  requiresImageConversion
} from "../src/utils/imagePreview.js";

const directFormats = [
  ["photo.jpg", "image/jpeg"],
  ["photo.jpeg", "image/pjpeg"],
  ["photo.jfif", "image/jfif"],
  ["photo.png", "image/png"],
  ["photo.gif", "image/gif"],
  ["photo.webp", "image/webp"],
  ["photo.bmp", "image/x-ms-bmp"],
  ["photo.avif", "image/avif"],
  ["photo.svg", "image/svg+xml"],
  ["photo.ico", "image/vnd.microsoft.icon"]
];

for (const [name, contentType] of directFormats) {
  const attachment = { name, url: `https://example.test/${name}`, contentType };
  assert.equal(getImagePreviewKind(attachment), "direct", name);
  assert.equal(isDirectlyPreviewableImage(attachment), true, name);
  assert.equal(requiresImageConversion(attachment), false, name);
}

for (const [name, contentType, kind] of [
  ["iphone.heic", "image/heic", "heic"],
  ["iphone.heif", "image/heif-sequence", "heic"],
  ["scan.tif", "image/tif", "tiff"],
  ["scan.tiff", "image/tiff", "tiff"]
]) {
  const attachment = { name, url: `https://example.test/${name}`, contentType };
  assert.equal(getImagePreviewKind(attachment), kind, name);
  assert.equal(isDirectlyPreviewableImage(attachment), false, name);
  assert.equal(requiresImageConversion(attachment), true, name);
}

assert.equal(getImagePreviewKind({
  name: "attachment",
  url: "https://example.test/download?id=1",
  contentType: "image/heic; charset=binary"
}), "heic");

assert.equal(getImagePreviewKind({
  name: "PHOTO.HEIC",
  url: "https://example.test/download?id=2",
  contentType: "application/octet-stream"
}), "heic");

assert.equal(getImagePreviewKind({
  name: "document.pdf",
  url: "https://example.test/document.pdf",
  contentType: "application/pdf"
}), "unknown");

console.log("imagePreview tests passed");
