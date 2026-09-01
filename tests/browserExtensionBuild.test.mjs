import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildSuperOfficeCaptureModule,
  buildVtiCaptureModule
} from "../scripts/browserExtensionBuildSupport.mjs";
import {
  captureVtiHealthcheckPage,
  extractUsableVtiHealthcheckText,
  fetchVtiHealthcheckSource,
  normalizeVtiHealthcheckResponseText
} from "../browser-extension/healthcheckCapture.js";
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
  await assert.rejects(
    withGlobalOverrides({
      document: {
        querySelector(selector) {
          return selector.includes('input[type="password"]') ? {} : null;
        }
      }
    }, () => captureVtiHealthcheckPage()),
    /session VTI a expiré/i
  );
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);

  assert.match(moduleSource, /export async function captureSuperOfficePage/);
  assert.match(moduleSource, /return data/);
  assert.match(moduleSource, /MSISDN/);
  assert.match(moduleSource, /contractorNumber/);
  assert.match(moduleSource, /orderedSuperOfficePostEntries/);
  assert.match(moduleSource, /findSuperOfficeMsisdn/);
  assert.match(moduleSource, /flipHtmlMessagesPosts/);
  assert.doesNotMatch(moduleSource, /openFirstSuperOfficePost/);
  assert.doesNotMatch(moduleSource, /expandAllSuperOfficePosts/);
  assert.doesNotMatch(moduleSource, /HtmlMessages2_buildHtml/);
  assert.match(moduleSource, /waitForSuperOfficeMsisdn/);
  assert.match(
    moduleSource,
    /const contractorNumber=getExternalIdContractorNumber\(externalTicketId\)\|\|await waitForSuperOfficeMsisdn\(\)/
  );
  assert.doesNotMatch(
    moduleSource,
    /const contractorNumber=await waitForSuperOfficeMsisdn\(\);const text=document\.body\.innerText/
  );
  assert.doesNotMatch(moduleSource, /prepareSuperOfficePosts/);
  assert.doesNotMatch(moduleSource, /await expandTicketPosts\(\);const text/);
  assert.doesNotMatch(moduleSource, /const message=messageDataList\(\)\[0\]/);
  assert.doesNotMatch(moduleSource, /navigator\.clipboard/);
  assert.doesNotMatch(moduleSource, /position:fixed/);
  assert.doesNotMatch(moduleSource, /\beval\s*\(/);
  const captureSuperOfficePage = Function(
    `${moduleSource.replace(/^export /, "")}; return captureSuperOfficePage;`
  )();
  let buildHtmlCallCount = 0;
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
      },
      HtmlMessages2_buildHtml() {
        buildHtmlCallCount += 1;
      }
    }
  }, () => captureSuperOfficePage());

  assert.equal(buildHtmlCallCount, 0);
  assert.equal(captureResult.contractorNumber, "32323232");
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);
  const captureSuperOfficePage = Function(
    `${moduleSource.replace(/^export /, "")}; return captureSuperOfficePage;`
  )();
  const externalTicketId = [
    "27.08.2026",
    "31486331",
    "31436062",
    "signal",
    "led",
    "step",
    "box",
    "partner",
    "partner-ticket",
    "lex",
    "olt",
    "board",
    "bok",
    "comment"
  ].join("//");
  let parsedPostBodyCount = 0;

  const captureResult = await withGlobalOverrides({
    document: {
      body: {
        innerText: `REQUEST 31436062\nExternal ticket ID:\n${externalTicketId}\nPreferred language: French`
      },
      querySelectorAll: () => []
    },
    DOMParser: class DOMParser {
      parseFromString(html) {
        parsedPostBodyCount += 1;
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
          messages: [{ body: "MSISDN: 99999999" }]
        }
      }
    }
  }, () => captureSuperOfficePage());

  assert.equal(captureResult.externalTicketId, externalTicketId);
  assert.equal(captureResult.contractorNumber, "31486331");
  assert.equal(parsedPostBodyCount, 0);

  parsedPostBodyCount = 0;
  const fallbackResult = await withGlobalOverrides({
    document: {
      body: {
        innerText: "REQUEST 31436062\nExternal ticket ID:\ninvalid\nPreferred language: French"
      },
      querySelectorAll: () => []
    },
    DOMParser: class DOMParser {
      parseFromString(html) {
        parsedPostBodyCount += 1;
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
          messages: [{ body: "MSISDN: 99999999" }]
        }
      }
    }
  }, () => captureSuperOfficePage());

  assert.equal(fallbackResult.externalTicketId, "invalid");
  assert.equal(fallbackResult.contractorNumber, "99999999");
  assert.equal(parsedPostBodyCount, 1);
}

{
  const html = `
    <html>
      <head><style>.hidden { display: none; }</style></head>
      <body>
        <section>
          <div>routerSerialNumber</div><div>SAGEM-123</div>
          <div>otoId</div><div>OTO-456</div>
          <div>lineState</div><div>ACTIVE</div>
          <p>${"Healthcheck details ".repeat(40)}</p>
        </section>
        <script>window.hiddenHealthcheckValue = "ignored";</script>
      </body>
    </html>
  `;
  const normalizedText = normalizeVtiHealthcheckResponseText(html);

  assert.match(normalizedText, /routerSerialNumber\nSAGEM-123/);
  assert.doesNotMatch(normalizedText, /hiddenHealthcheckValue/);

  let requestedOptions = null;
  const fetchedSource = await withGlobalOverrides({
    location: { href: "https://vti.salt.ch/index.php", origin: "https://vti.salt.ch" },
    fetch: async (_url, options) => {
      requestedOptions = options;
      return { ok: true, text: async () => html };
    }
  }, () => fetchVtiHealthcheckSource(
    "https://vti.salt.ch/index.php?mode=healthCheck"
  ));
  const fetchedText = extractUsableVtiHealthcheckText(fetchedSource);

  assert.equal(fetchedText, normalizedText);
  assert.equal(requestedOptions.credentials, "include");
  assert.equal(requestedOptions.cache, "no-store");
  assert.equal(requestedOptions.redirect, "follow");
}

{
  const fetchedText = extractUsableVtiHealthcheckText("<html><body>Loading...</body></html>");

  assert.equal(fetchedText, "");
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);
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
            {
              createdAt: "27.08.2026 08:30",
              bodyHtml: "<p>Premier post sans MSISDN</p>"
            },
            {
              createdAt: "27.08.2026 10:15",
              bodyHtml: "<p>MSISDN: <strong>32323232</strong></p>"
            }
          ]
        }
      }
    }
  }, () => captureSuperOfficePage());

  assert.equal(captureResult.firstPostAt, "27.08.2026 08:30");
  assert.equal(captureResult.contractorNumber, "32323232");
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);
  const captureSuperOfficePage = Function(
    `${moduleSource.replace(/^export /, "")}; return captureSuperOfficePage;`
  )();
  let postDataReads = 0;
  const delayedSuperOfficeWindow = {};
  Object.defineProperty(delayedSuperOfficeWindow, "HtmlMessages2_data", {
    configurable: true,
    get() {
      postDataReads += 1;
      if (postDataReads < 6) return { ticket: { messages: [] } };
      return {
        ticket: {
          messages: [
            { bodyHtml: "<p>MSISDN: <strong>32323232</strong></p>" }
          ]
        }
      };
    }
  });

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
    window: delayedSuperOfficeWindow,
    setTimeout(callback) {
      callback();
      return 1;
    }
  }, () => captureSuperOfficePage());

  assert.ok(postDataReads >= 6);
  assert.equal(captureResult.contractorNumber, "32323232");
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);
  const captureSuperOfficePage = Function(
    `${moduleSource.replace(/^export /, "")}; return captureSuperOfficePage;`
  )();
  let isPostExpanded = false;
  let expandedDataReadCount = 0;
  let buildHtmlCallCount = 0;
  let flipClickCount = 0;
  let secondFlipClickCount = 0;
  const flipImage = {
    className: "HtmlMessages2_flipImage",
    closest: () => null,
    getAttribute(name) {
      return name === "src" ? "/graphics/Nine/leftarrow.svg" : "";
    },
    click() {
      flipClickCount += 1;
      isPostExpanded = true;
      expandedDataReadCount = 0;
    }
  };
  const secondFlipImage = {
    className: "HtmlMessages2_flipImage",
    closest: () => null,
    getAttribute(name) {
      return name === "src" ? "/graphics/Nine/leftarrow.svg" : "";
    },
    click() {
      secondFlipClickCount += 1;
    }
  };
  const superOfficeWindow = {};
  Object.defineProperty(superOfficeWindow, "HtmlMessages2_data", {
    configurable: true,
    get() {
      const isBodyLoaded = isPostExpanded && expandedDataReadCount >= 3;
      const bodyHtml = isBodyLoaded
        ? "<p>MSISDN: <strong>77889900</strong></p>"
        : "";
      return {
        ticket: {
          numExpandedMessages: 0,
          messages: [{ bodyHtml, bodyNotLoaded: !isBodyLoaded }]
        },
        secondaryTicketBlock: {
          numExpandedMessages: 0,
          messages: [{ bodyHtml: "Post already loaded", bodyNotLoaded: false }]
        }
      };
    }
  });
  superOfficeWindow.HtmlMessages2_buildHtml = () => {
    buildHtmlCallCount += 1;
  };

  const captureResult = await withGlobalOverrides({
    document: {
      body: { innerText: "REQUEST 31436062\nExternal ticket ID:\n" },
      querySelectorAll(selector) {
        return selector === "img.HtmlMessages2_flipImage"
          ? [flipImage, secondFlipImage]
          : [];
      }
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
    window: superOfficeWindow,
    setTimeout(callback) {
      if (isPostExpanded) expandedDataReadCount += 1;
      callback();
      return 1;
    }
  }, () => captureSuperOfficePage());

  assert.equal(buildHtmlCallCount, 0);
  assert.equal(flipClickCount, 1);
  assert.equal(secondFlipClickCount, 0);
  assert.equal(captureResult.contractorNumber, "77889900");
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);
  const captureSuperOfficePage = Function(
    `${moduleSource.replace(/^export /, "")}; return captureSuperOfficePage;`
  )();
  const firstPostFrame = {
    contentDocument: {
      body: { innerText: "MSISDN: 44556677" }
    }
  };
  const firstPostRoot = {
    innerText: "",
    closest: () => null,
    querySelectorAll(selector) {
      return selector === "iframe" ? [firstPostFrame] : [];
    }
  };
  const messageScopeSelector = ".HtmlMessages2,[id*='HtmlMessages2'],.HtmlMessages2_mainDiv,.HtmlMessages2_message,.HtmlMessage";
  const messageRootSelector = ".HtmlMessages2_message,.HtmlMessage,[id*='HtmlMessages2_message'],article";

  const captureResult = await withGlobalOverrides({
    document: {
      body: { innerText: "REQUEST 31436062\nExternal ticket ID:\n" },
      querySelectorAll(selector) {
        return [messageScopeSelector, messageRootSelector].includes(selector)
          ? [firstPostRoot]
          : [];
      }
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
    window: { HtmlMessages2_data: {} }
  }, () => captureSuperOfficePage());

  assert.equal(captureResult.contractorNumber, null);
}

{
  const moduleSource = buildSuperOfficeCaptureModule(superOfficeBookmarklet);
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
        firstBlock: {
          messages: [
            { body: "MSISDN: 123456789" },
            { body: "MSISDN: 31544 600" }
          ]
        },
        secondBlock: {
          messages: [
            { bodyHtml: "<p><strong>MSISDN:</strong> 87654321</p>" }
          ]
        }
      }
    }
  }, () => captureSuperOfficePage());

  assert.equal(captureResult.contractorNumber, "87654321");
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
assert.equal(manifest.version, "0.1.23");
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
assert.match(serviceWorkerSource, /runAlexOpen/);
assert.match(serviceWorkerSource, /waitForAuthenticatedWorkflowPage/);
assert.match(serviceWorkerSource, /AWAITING_AUTHENTICATION/);
assert.match(serviceWorkerSource, /open-provider/);
assert.match(serviceWorkerSource, /create-ticket/);
assert.match(serviceWorkerSource, /buildSuperOfficeTicketUrl/);
assert.match(serviceWorkerSource, /chrome\.tabs\.update/);
assert.match(serviceWorkerSource, /getCapturedSuperOfficeTicketNumber/);
assert.match(serviceWorkerSource, /findVtiContractorRecord/);
assert.match(serviceWorkerSource, /captureVtiInParallel/);
assert.match(serviceWorkerSource, /captureVtiBackgroundPages/);
assert.match(serviceWorkerSource, /captureVtiOfferPage/);
assert.match(serviceWorkerSource, /loadVtiContractorInTab/);
assert.match(serviceWorkerSource, /captureVtiWithLegacyPage/);
assert.match(serviceWorkerSource, /active: false/);
assert.match(serviceWorkerSource, /fetchVtiHealthcheckSource/);
assert.match(serviceWorkerSource, /CONTRACTOR_INPUT_REQUIRED/);
assert.match(serviceWorkerSource, /ALEX_STORAGE_NAVIGATION_DELAY_MS/);

const aloWorkflowSource = serviceWorkerSource.slice(
  serviceWorkerSource.indexOf("async function runAloAutofill"),
  serviceWorkerSource.indexOf("async function runAlexOpen")
);
assert.ok(
  aloWorkflowSource.indexOf("waitForAuthenticatedWorkflowPage")
    < aloWorkflowSource.indexOf("chrome.scripting.executeScript")
);

const alexWorkflowSource = serviceWorkerSource.slice(
  serviceWorkerSource.indexOf("async function runAlexOpen"),
  serviceWorkerSource.indexOf("function startWorkflow")
);
assert.ok(
  alexWorkflowSource.indexOf("waitForAuthenticatedWorkflowPage")
    < alexWorkflowSource.indexOf("chrome.scripting.executeScript")
);
assert.match(appBridgeSource, /salt\.capture\.alo\.start\.v1/);
assert.match(appBridgeSource, /salt\.capture\.alex\.start\.v1/);

const searchFunctionSource = serviceWorkerSource.slice(
  serviceWorkerSource.indexOf("async function findVtiContractorInTab"),
  serviceWorkerSource.indexOf("async function captureVtiOfferAndHealth")
);
assert.ok(searchFunctionSource.indexOf("chrome.tabs.update") < searchFunctionSource.indexOf("chrome.scripting.executeScript"));
assert.doesNotMatch(searchFunctionSource, /VTI_FAST_SEARCH_UNAVAILABLE/);

const captureWorkflowSource = serviceWorkerSource.slice(
  serviceWorkerSource.indexOf("async function captureVtiInParallel"),
  serviceWorkerSource.indexOf("async function captureVtiWithLegacyPage")
);
assert.match(captureWorkflowSource, /await loadVtiContractorInTab/);
assert.match(captureWorkflowSource, /await Promise\.all/);
assert.ok(
  captureWorkflowSource.indexOf("await loadVtiContractorInTab")
    < captureWorkflowSource.indexOf("await Promise.all")
);

console.log("browserExtensionBuild tests passed");
