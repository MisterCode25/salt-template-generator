import assert from "node:assert/strict";
import {
  buildVtiContractorDetailUrl,
  buildVtiContractorPageUrls,
  buildVtiContractorSearchUrl,
  getCapturedVtiContractorNumber,
  getSuperOfficeContractorNumber,
  getVtiContractorRecordIdFromUrl,
  normalizeContractorNumber,
  resolveVtiCaptureRoute
} from "../shared/vtiContractorNavigation.js";
import {
  findVtiContractorRecord,
  verifyLoadedVtiContractorPage
} from "../browser-extension/vtiContractorSearch.js";

function createResultRow({ contractorNumber, recordId }) {
  return {
    getAttribute(name) {
      if (name.toLowerCase() === "data-id") return recordId;
      if (name.toLowerCase() === "data-recordurl") {
        return `index.php?module=Contractors&view=Detail&record=${recordId}`;
      }
      return null;
    },
    querySelector(selector) {
      if (selector === ".listViewEntriesCheckBox") return { value: recordId };
      return null;
    },
    querySelectorAll(selector) {
      if (selector !== ".listViewEntryValue") return [];
      return [
        { textContent: contractorNumber },
        { textContent: "Customer name" }
      ];
    }
  };
}

{
  const urls = buildVtiContractorPageUrls("56064498");

  assert.equal(new URL(urls.info).searchParams.get("tab_label"), "LBL_CONTRACTOR_INFO");
  assert.equal(new URL(urls.billing).searchParams.get("tab_label"), "LBL_CONTRACTOR_BILLING");
  assert.equal(new URL(urls.offers).searchParams.get("tab_label"), "LBL_CONTRACTOR_OFFERS");
  assert.deepEqual(
    [urls.info, urls.billing, urls.offers].map((value) => new URL(value).searchParams.get("record")),
    ["56064498", "56064498", "56064498"]
  );
}

async function withDocument(documentValue, callback) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: documentValue,
    writable: true
  });
  try {
    return await callback();
  } finally {
    if (previous) Object.defineProperty(globalThis, "document", previous);
    else delete globalThis.document;
  }
}

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

assert.equal(normalizeContractorNumber("31486331"), "31486331");
assert.equal(normalizeContractorNumber(" 3148 6331 "), "31486331");
assert.equal(normalizeContractorNumber("contractor 31486331"), "");

{
  const url = new URL(buildVtiContractorSearchUrl("31486331"));
  assert.equal(url.origin, "https://vti.salt.ch");
  assert.equal(url.pathname, "/index.php");
  assert.equal(url.searchParams.get("module"), "Contractors");
  assert.equal(url.searchParams.get("view"), "List");
  assert.equal(url.searchParams.get("viewname"), "254");
  assert.deepEqual(JSON.parse(url.searchParams.get("search_params")), [
    [["contractor_no", "e", "31486331"]]
  ]);
  assert.throws(() => buildVtiContractorSearchUrl("invalid"), /contractor/i);
}

{
  const url = new URL(buildVtiContractorDetailUrl("56064498"));
  assert.equal(url.searchParams.get("module"), "Contractors");
  assert.equal(url.searchParams.get("view"), "Detail");
  assert.equal(url.searchParams.get("record"), "56064498");
  assert.throws(() => buildVtiContractorDetailUrl("record-1"), /recordId/i);
  assert.equal(getVtiContractorRecordIdFromUrl(url.href), "56064498");
  assert.equal(getVtiContractorRecordIdFromUrl("https://vti.salt.ch/index.php?view=List"), "");
  assert.equal(getVtiContractorRecordIdFromUrl("invalid"), "");
}

{
  const currentExternalId = [
    "27.08.2026",
    "31486331",
    "28958607",
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
  const legacyExternalId = ["flag", ...currentExternalId.split("//")].join("//");

  assert.equal(getSuperOfficeContractorNumber({
    externalTicketId: currentExternalId,
    contractorNumber: "99999999"
  }), "31486331");
  assert.equal(getSuperOfficeContractorNumber({ externalTicketId: legacyExternalId }), "31486331");
  assert.equal(getSuperOfficeContractorNumber({ contractorNumber: "31486331" }), "31486331");
  assert.equal(getSuperOfficeContractorNumber({ externalTicketId: "invalid" }), "");

  assert.deepEqual(resolveVtiCaptureRoute({ contractorNumber: "31486331" }), {
    mode: "search",
    contractorNumber: "31486331"
  });
  assert.deepEqual(resolveVtiCaptureRoute({}), {
    mode: "manual-input",
    contractorNumber: ""
  });
  assert.deepEqual(resolveVtiCaptureRoute({}, " 3148 6331 "), {
    mode: "search",
    contractorNumber: "31486331"
  });
}

{
  assert.equal(getCapturedVtiContractorNumber({ client: { contractorNumber: "31486331" } }), "31486331");
  assert.equal(getCapturedVtiContractorNumber({ contractor_no: "31486331" }), "31486331");
  assert.equal(getCapturedVtiContractorNumber({}), "");
}

{
  const result = await withDocument({
    querySelector: () => null,
    querySelectorAll: () => [createResultRow({ contractorNumber: "31486331", recordId: "56064498" })]
  }, () => findVtiContractorRecord("31486331"));

  assert.deepEqual(result, {
    ok: true,
    contractorNumber: "31486331",
    recordId: "56064498"
  });
}

{
  const result = await withDocument({
    body: { innerText: "No contractor found" },
    querySelector: () => null,
    querySelectorAll: () => [createResultRow({ contractorNumber: "99999999", recordId: "1" })]
  }, () => findVtiContractorRecord("31486331"));

  assert.equal(result.ok, false);
  assert.equal(result.code, "VTI_CONTRACTOR_NOT_FOUND");
}

{
  const result = await withDocument({
    querySelector: () => null,
    querySelectorAll: () => [
      createResultRow({ contractorNumber: "31486331", recordId: "1" }),
      createResultRow({ contractorNumber: "31486331", recordId: "2" })
    ]
  }, () => findVtiContractorRecord("31486331"));

  assert.equal(result.ok, false);
  assert.equal(result.code, "VTI_CONTRACTOR_AMBIGUOUS");
}

{
  const result = await withDocument({
    body: { innerText: "Login" },
    querySelector: (selector) => selector.includes("password") ? {} : null,
    querySelectorAll: () => []
  }, () => findVtiContractorRecord("31486331"));

  assert.equal(result.ok, false);
  assert.equal(result.code, "VTI_SESSION_REQUIRED");
}

{
  const result = await withGlobalOverrides({
    document: {
      body: { innerText: "Contractor 31486331" },
      querySelector(selector) {
        if (selector.includes("password")) return null;
        if (selector === "#recordId") return { value: "56064498" };
        return null;
      }
    },
    location: {
      href: "https://vti.salt.ch/index.php?module=Contractors&view=Detail&record=56064498"
    }
  }, () => verifyLoadedVtiContractorPage("56064498", "31486331"));

  assert.deepEqual(result, {
    ok: true,
    contractorNumber: "31486331",
    recordId: "56064498"
  });
}

{
  const result = await withGlobalOverrides({
    document: {
      body: { innerText: "Login" },
      querySelector: (selector) => selector.includes("password") ? {} : null
    },
    location: { href: "https://vti.salt.ch/index.php" }
  }, () => verifyLoadedVtiContractorPage("56064498", "31486331"));

  assert.equal(result.ok, false);
  assert.equal(result.code, "VTI_SESSION_REQUIRED");
}

{
  const result = await withGlobalOverrides({
    document: {
      body: { innerText: "Contractor 31486331" },
      querySelector(selector) {
        if (selector.includes("password")) return null;
        if (selector === "#recordId") return { value: "99999999" };
        return null;
      }
    },
    location: {
      href: "https://vti.salt.ch/index.php?module=Contractors&view=Detail&record=99999999"
    }
  }, () => verifyLoadedVtiContractorPage("56064498", "31486331"));

  assert.equal(result.ok, false);
  assert.equal(result.code, "VTI_RECORD_MISMATCH");
}

console.log("vtiContractorNavigation tests passed");
