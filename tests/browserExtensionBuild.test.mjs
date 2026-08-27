import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildSuperOfficeCaptureModule,
  buildVtiCaptureModule
} from "../scripts/browserExtensionBuildSupport.mjs";

const vtiBookmarklet = readFileSync(
  new URL("../src/data/vtiHealthcheckBookmarklet.txt", import.meta.url),
  "utf8"
).trim();
const superOfficeBookmarklet = readFileSync(
  new URL("../src/data/superOfficeBookmarklet.txt", import.meta.url),
  "utf8"
).trim();
const manifest = JSON.parse(readFileSync(
  new URL("../browser-extension/manifest.json", import.meta.url),
  "utf8"
));

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);

  assert.match(moduleSource, /export async function captureSuperOfficePage/);
  assert.match(moduleSource, /return data/);
  assert.doesNotMatch(moduleSource, /navigator\.clipboard/);
  assert.doesNotMatch(moduleSource, /position:fixed/);
  assert.doesNotMatch(moduleSource, /\beval\s*\(/);
}

{
  const moduleSource = buildVtiCaptureModule(vtiBookmarklet);

  assert.match(moduleSource, /export async function captureVtiPage/);
  assert.match(moduleSource, /salt\.capture\.healthcheck\.v1/);
  assert.match(moduleSource, /return payload/);
  assert.doesNotMatch(moduleSource, /navigator\.clipboard/);
  assert.doesNotMatch(moduleSource, /window\.open/);
  assert.doesNotMatch(moduleSource, /saltOverlay/);
  assert.doesNotMatch(moduleSource, /position:fixed/);
  assert.doesNotMatch(moduleSource, /\beval\s*\(/);
}

assert.ok(vtiBookmarklet.startsWith("javascript:"));
assert.ok(superOfficeBookmarklet.startsWith("javascript:"));

assert.equal(manifest.manifest_version, 3);
assert.deepEqual(manifest.permissions.sort(), ["scripting", "tabs"]);
assert.equal(manifest.host_permissions.includes("<all_urls>"), false);
assert.ok(manifest.host_permissions.includes("https://*.salt.ch/*"));
assert.ok(manifest.host_permissions.some((permission) => permission.includes("superoffice")));
assert.ok(manifest.content_scripts[0].matches.includes(
  "https://mistercode25.github.io/salt-template-generator/*"
));

console.log("browserExtensionBuild tests passed");
