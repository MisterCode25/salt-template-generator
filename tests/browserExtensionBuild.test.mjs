import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildSuperOfficeCaptureModule,
  buildVtiCaptureModule
} from "../scripts/browserExtensionBuildSupport.mjs";
import { CURRENT_BROWSER_EXTENSION_VERSION } from "../src/services/browserExtensionCaptureService.js";

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
const serviceWorkerSource = readFileSync(
  new URL("../browser-extension/service-worker.js", import.meta.url),
  "utf8"
);
const appBridgeSource = readFileSync(
  new URL("../browser-extension/app-bridge.js", import.meta.url),
  "utf8"
);

async function withGlobalOverrides(overrides, callback) {
  const previousDescriptors = new Map();
  for (const [name, value] of Object.entries(overrides)) {
    previousDescriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value, writable: true });
  }

  try {
    return await callback();
  } finally {
    for (const [name, descriptor] of previousDescriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);

  assert.match(moduleSource, /export async function captureSuperOfficePage/);
  assert.match(moduleSource, /return data/);
  assert.match(moduleSource, /MSISDN/);
  assert.match(moduleSource, /contractorNumber/);
  assert.match(moduleSource, /messageDataList\(\)\[0\]/);
  assert.doesNotMatch(moduleSource, /navigator\.clipboard/);
  assert.doesNotMatch(moduleSource, /position:fixed/);
  assert.doesNotMatch(moduleSource, /\beval\s*\(/);
  const captureSuperOfficePage = Function(
    `${moduleSource.replace(/^export /, "")}; return captureSuperOfficePage;`
  )();
  const captureResult = await withGlobalOverrides({
    document: {
      body: { innerText: "REQUEST 31436062\nExternal ticket ID:\n" },
      querySelectorAll: () => []
    },
    DOMParser: class DOMParser {
      parseFromString(html) {
        return {
          body: { textContent: String(html).replace(/<[^>]+>/g, " ") },
          querySelectorAll: () => []
        };
      }
    },
    location: { origin: "https://cs.salt.ch" },
    window: {
      HtmlMessages2_data: {
        ticket: {
          messages: [
            { bodyHtml: "<p>MSISDN: <strong>32323232</strong></p>" },
            { body: "MSISDN: 99999999" }
          ]
        }
      }
    }
  }, () => captureSuperOfficePage());

  assert.equal(captureResult.contractorNumber, "32323232");
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
assert.equal(manifest.version, "0.1.7");
assert.equal(CURRENT_BROWSER_EXTENSION_VERSION, manifest.version);
assert.deepEqual(manifest.permissions.sort(), ["scripting", "tabs"]);
assert.equal(manifest.host_permissions.includes("<all_urls>"), false);
assert.ok(manifest.host_permissions.includes("https://*.salt.ch/*"));
assert.ok(manifest.host_permissions.some((permission) => permission.includes("superoffice")));
assert.ok(manifest.host_permissions.includes("https://wholesale.swisscom.com/*"));
assert.ok(manifest.host_permissions.includes("https://*.ftthproxy.ch/*"));
assert.ok(manifest.content_scripts[0].matches.includes(
  "https://mistercode25.github.io/salt-template-generator/*"
));
assert.match(serviceWorkerSource, /runAloAutofill/);
assert.match(serviceWorkerSource, /runAlexTicketOpen/);
assert.match(serviceWorkerSource, /buildSuperOfficeTicketUrl/);
assert.match(serviceWorkerSource, /chrome\.tabs\.update/);
assert.match(serviceWorkerSource, /getCapturedSuperOfficeTicketNumber/);
assert.match(serviceWorkerSource, /findVtiContractorRecord/);
assert.match(serviceWorkerSource, /CONTRACTOR_INPUT_REQUIRED/);
assert.match(serviceWorkerSource, /ALEX_STORAGE_NAVIGATION_DELAY_MS/);
assert.match(appBridgeSource, /salt\.capture\.alo\.start\.v1/);
assert.match(appBridgeSource, /salt\.capture\.alex\.start\.v1/);

console.log("browserExtensionBuild tests passed");
