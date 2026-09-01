import assert from "node:assert/strict";
import {
  buildVtiCapturePayload,
  captureVtiBackgroundPages,
  captureVtiOfferPage
} from "../browser-extension/vtiParallelCapture.js";
import { buildVtiContractorPageUrls } from "../shared/vtiContractorNavigation.js";

function recreateInjectedFunction(callback) {
  return Function(`return (${callback.toString()});`)();
}

const injectedBackgroundCapture = recreateInjectedFunction(captureVtiBackgroundPages);
const injectedOfferCapture = recreateInjectedFunction(captureVtiOfferPage);

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

function textElement(text) {
  return { innerText: text, textContent: text };
}

function createDocument({ recordId, text, html = "", fields = {}, hasLoginForm = false }) {
  return {
    body: {
      innerHTML: html,
      innerText: text,
      textContent: text
    },
    querySelector(selector) {
      if (selector.includes('input[type="password"]')) return hasLoginForm ? {} : null;
      if (selector === "#recordId") return { value: recordId };
      return fields[selector] || null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

{
  const pageUrls = buildVtiContractorPageUrls("56064498");
  const loginDocument = createDocument({
    recordId: "",
    text: "Login",
    hasLoginForm: true
  });

  const result = await withGlobalOverrides({
    location: { href: "https://vti.salt.ch/index.php", origin: "https://vti.salt.ch" },
    fetch: async (url) => ({ ok: true, url, text: async () => "LOGIN" }),
    DOMParser: class DOMParser {
      parseFromString() {
        return loginDocument;
      }
    }
  }, () => injectedBackgroundCapture("56064498", "31486331", pageUrls));

  assert.equal(result.ok, false);
  assert.equal(result.code, "VTI_SESSION_REQUIRED");
}

{
  const pageUrls = buildVtiContractorPageUrls("56064498");
  const contactRecordId = "56064496";
  const infoDocument = createDocument({
    recordId: "56064498",
    text: "Billing Account information\n31486331\nMs. CUSTOMER Test\nAddress\nExample street 1",
    html: `<a href="index.php?module=Contacts&view=Detail&record=${contactRecordId}">Owner</a>`
  });
  const billingDocument = createDocument({
    recordId: "56064498",
    text: "Bill information\nBilling account status\nBILLABLE"
  });
  const contactFields = {
    "#Contacts_detailView_fieldValue_firstname .value": textElement("Test"),
    "#Contacts_detailView_fieldValue_lastname .value": textElement("Customer"),
    "#Contacts_detailView_fieldValue_email .value": textElement("test@example.invalid"),
    "#Contacts_detailView_fieldValue_communication_language .value": textElement("FR"),
    "#Contacts_detailView_fieldValue_eligibility_source .value": textElement("ALO"),
    "#Contacts_detailView_fieldValue_cf_800 .value": textElement("41791234567")
  };
  const contactDocument = createDocument({
    recordId: contactRecordId,
    text: "Contact Details",
    fields: contactFields
  });
  const documents = new Map([
    ["INFO", infoDocument],
    ["BILLING", billingDocument],
    ["CONTACT", contactDocument]
  ]);
  const requestedUrls = [];

  const result = await withGlobalOverrides({
    location: { href: "https://vti.salt.ch/index.php", origin: "https://vti.salt.ch" },
    fetch: async (url, options) => {
      requestedUrls.push({ url, options });
      const source = url === pageUrls.info
        ? "INFO"
        : url === pageUrls.billing
          ? "BILLING"
          : "CONTACT";
      return { ok: true, url, text: async () => source };
    },
    DOMParser: class DOMParser {
      parseFromString(source) {
        return documents.get(source);
      }
    }
  }, () => injectedBackgroundCapture("56064498", "31486331", pageUrls));

  assert.equal(result.ok, true);
  assert.equal(result.contractorNumber, "31486331");
  assert.equal(result.contactInfo.contactRecordId, contactRecordId);
  assert.equal(result.contactInfo.firstName, "Test");
  assert.equal(result.contactInfo.communicationLanguage, "FR");
  assert.equal(requestedUrls.length, 3);
  assert.deepEqual(requestedUrls.slice(0, 2).map(({ url }) => url), [pageUrls.info, pageUrls.billing]);
  assert.ok(new URL(requestedUrls[2].url).searchParams.get("record") === contactRecordId);
  assert.ok(requestedUrls.every(({ options }) => options.credentials === "include"));
}

{
  const healthLink = {
    href: "https://vti.salt.ch/index.php?module=Contractors&view=Detail&record=56064498&mode=healthCheck&serviceId=56064501",
    innerText: "HealthCheck",
    textContent: "HealthCheck",
    getAttribute(name) {
      return name === "href" ? this.href : null;
    }
  };
  const activationRow = {
    querySelector(selector) {
      if (selector === ".partieGauche") return textElement("Activation date");
      if (selector === ".partieDroite .value") return textElement("27.08.2026");
      return null;
    }
  };

  const result = await withGlobalOverrides({
    location: {
      href: "https://vti.salt.ch/index.php?module=Contractors&view=Detail&record=56064498&tab_label=LBL_CONTRACTOR_OFFERS",
      origin: "https://vti.salt.ch"
    },
    document: {
      body: { innerText: "Offer management", textContent: "Offer management" },
      querySelector(selector) {
        if (selector === "#recordId") return { value: "56064498" };
        if (selector === 'a[href*="mode=healthCheck"]') return healthLink;
        return null;
      },
      querySelectorAll(selector) {
        if (selector === ".myrow") return [activationRow];
        if (selector === "a") return [healthLink];
        return [];
      }
    }
  }, () => injectedOfferCapture("56064498", 10));

  assert.equal(result.ok, true);
  assert.equal(result.serviceId, "56064501");
  assert.equal(result.offerInfo.activationDate, "27.08.2026");
}

{
  const result = await withGlobalOverrides({
    location: {
      href: "https://vti.salt.ch/index.php",
      origin: "https://vti.salt.ch"
    },
    document: {
      body: { innerText: "Login", textContent: "Login" },
      querySelector(selector) {
        return selector.includes('input[type="password"]') ? {} : null;
      },
      querySelectorAll() {
        return [];
      }
    }
  }, () => injectedOfferCapture("56064498", 10));

  assert.equal(result.ok, false);
  assert.equal(result.code, "VTI_SESSION_REQUIRED");
}

{
  const payload = buildVtiCapturePayload({
    staticCapture: {
      contractorNumber: "31486331",
      billingAccountText: "Billing Account information\n31486331\nMs. CUSTOMER Test\nAddress\nExample street 1",
      billingInformationText: "Bill information\nBilling account status\nBILLABLE",
      contactInfo: {
        contactRecordId: "56064496",
        title: "Ms.",
        firstName: "Test",
        lastName: "Customer",
        email: "test@example.invalid",
        communicationLanguage: "FR",
        eligibilitySource: "ALO",
        mobileRaw: "41791234567"
      }
    },
    offerCapture: { offerInfo: { activationDate: "27.08.2026" } },
    healthText: [
      "otoId B.111.222.333.4",
      "routerSerialNumber ROUTER-123",
      "lineState ACTIVE",
      'crossConnexion {"Port":"3"}'
    ].join("\n")
  });

  assert.equal(payload.client.contractorNumber, "31486331");
  assert.equal(payload.client.mobile, "079 123 45 67");
  assert.equal(payload.offer.activationDate, "27.08.2026");
  assert.equal(payload.contact.contactRecordId, "56064496");
  assert.equal(payload.healthcheck.otoId, "B.111.222.333.4");
  assert.deepEqual(payload.healthcheck.crossConnexion, { Port: "3" });
}

console.log("vtiParallelCapture tests passed");
