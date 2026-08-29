import assert from "node:assert/strict";
import {
  ALO_FULFILLMENT_DETAIL_URL,
  autofillAloTicketPage
} from "../browser-extension/aloAutomation.js";
import {
  ALEX_HOME_URL,
  ALEX_STORAGE_NAVIGATION_DELAY_MS,
  openAlexPage
} from "../browser-extension/alexAutomation.js";
import {
  BROWSER_EXTENSION_MESSAGE,
  createExtensionEvent
} from "../shared/browserExtensionProtocol.js";
import {
  CURRENT_BROWSER_EXTENSION_VERSION,
  isBrowserExtensionVersionAtLeast,
  startBrowserExtensionCapture,
  startBrowserExtensionAloAutofill
} from "../src/services/browserExtensionCaptureService.js";
import { ALO_FULFILLMENT_DETAIL_URL as APP_ALO_FULFILLMENT_DETAIL_URL } from "../src/utils/aloAutofill.js";
import { ALEX_HOME_URL as APP_ALEX_HOME_URL } from "../src/utils/alexTicket.js";

assert.equal(ALO_FULFILLMENT_DETAIL_URL, APP_ALO_FULFILLMENT_DETAIL_URL);
assert.equal(ALEX_HOME_URL, APP_ALEX_HOME_URL);
assert.equal(isBrowserExtensionVersionAtLeast("0.1.3", "0.1.3"), true);
assert.equal(isBrowserExtensionVersionAtLeast("0.2.0", "0.1.3"), true);
assert.equal(isBrowserExtensionVersionAtLeast("0.1.2", "0.1.3"), false);
assert.equal(isBrowserExtensionVersionAtLeast("", "0.1.3"), false);
assert.equal(CURRENT_BROWSER_EXTENSION_VERSION, "0.1.16");

async function withGlobalOverrides(overrides, callback) {
  const previousDescriptors = new Map();

  for (const [name, value] of Object.entries(overrides)) {
    previousDescriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value,
      writable: true
    });
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
  const storedValues = new Map();
  const scheduledCallbacks = [];
  const replacedUrls = [];

  const result = await withGlobalOverrides({
    localStorage: {
      setItem: (key, value) => storedValues.set(key, value)
    },
    location: {
      hostname: "www.ftthproxy.ch",
      origin: "https://www.ftthproxy.ch",
      replace: (url) => replacedUrls.push(url)
    },
    setTimeout: (callback, delay) => scheduledCallbacks.push({ callback, delay })
  }, () => openAlexPage({
    source: "salt-templater-alex-ticket",
    action: "open-provider",
    alap: "45",
    serviceDomain: 1,
    businessDomain: "L1"
  }, ALEX_STORAGE_NAVIGATION_DELAY_MS));

  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(storedValues.get("focus")), {
    alap: "45",
    serviceDomain: 1,
    businessDomain: "L1"
  });
  assert.equal(scheduledCallbacks.length, 1);

  scheduledCallbacks[0].callback();
  assert.match(replacedUrls[0], /^https:\/\/www\.ftthproxy\.ch\/\?saltAlexRefresh=\d+#\/$/);
}

function createInput(value = "") {
  const dispatchedEvents = [];
  return {
    dispatchedEvents,
    tagName: "INPUT",
    value,
    dispatchEvent(event) {
      dispatchedEvents.push(event.type);
    }
  };
}

{
  const externalReferenceInput = createInput("stale-value");
  const firstNameInput = createInput();
  const fields = new Map([
    ["ticket.extRef", externalReferenceInput],
    ["ticket.otoAddress.firstName", firstNameInput]
  ]);

  const result = await withGlobalOverrides({
    document: {
      getElementById: (id) => fields.get(id) || null,
      querySelector: () => null
    },
    Event: class Event {
      constructor(type) {
        this.type = type;
      }
    },
    fetch: async () => ({ ok: false, status: 503 }),
    location: {
      hostname: "wholesale.swisscom.com",
      origin: "https://wholesale.swisscom.com"
    }
  }, () => autofillAloTicketPage({
    source: "salt-templater-alo-autofill",
    fields: {
      externalReference: "-",
      firstName: "Samir"
    },
    alo: { orderId: "order-42" }
  }, ALO_FULFILLMENT_DETAIL_URL));

  assert.equal(result.ok, true);
  assert.equal(result.externalReference, "");
  assert.equal(result.externalReferenceStatus, "unavailable");
  assert.equal(externalReferenceInput.value, "");
  assert.equal(firstNameInput.value, "Samir");
  assert.deepEqual(externalReferenceInput.dispatchedEvents, ["input", "change"]);
  assert.doesNotMatch(autofillAloTicketPage.toString(), /\.submit\s*\(/);
  assert.doesNotMatch(autofillAloTicketPage.toString(), /position:\s*fixed/);
}

{
  const storedValues = new Map();
  const scheduledCallbacks = [];
  const replacedUrls = [];

  const result = await withGlobalOverrides({
    localStorage: {
      setItem: (key, value) => storedValues.set(key, value)
    },
    location: {
      hostname: "www.ftthproxy.ch",
      origin: "https://www.ftthproxy.ch",
      replace: (url) => replacedUrls.push(url)
    },
    setTimeout: (callback, delay) => scheduledCallbacks.push({ callback, delay })
  }, () => openAlexPage({
    source: "salt-templater-alex-ticket",
    action: "view-ticket",
    alap: "45",
    serviceDomain: 1,
    businessDomain: "L1",
    ticket: "#223323"
  }, ALEX_STORAGE_NAVIGATION_DELAY_MS));

  assert.equal(result.ok, true);
  assert.equal(replacedUrls.length, 0);
  assert.deepEqual(JSON.parse(storedValues.get("focus")), {
    alap: "45",
    serviceDomain: 1,
    businessDomain: "L1"
  });
  assert.equal(scheduledCallbacks.length, 1);
  assert.equal(scheduledCallbacks[0].delay, ALEX_STORAGE_NAVIGATION_DELAY_MS);

  scheduledCallbacks[0].callback();
  assert.match(replacedUrls[0], /^https:\/\/www\.ftthproxy\.ch\/\?saltAlexRefresh=\d+#\/assurance\/ticket\/223323$/);
}

{
  const commands = [];
  const listeners = new Set();
  const fakeWindow = {
    location: { origin: "https://mistercode25.github.io" },
    addEventListener(type, listener) {
      if (type === "message") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === "message") listeners.delete(listener);
    },
    clearTimeout() {},
    setTimeout() {
      return 1;
    },
    postMessage(command) {
      commands.push(command);
      for (const listener of [...listeners]) {
        listener({
          data: createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACCEPTED, command.requestId),
          origin: fakeWindow.location.origin,
          source: fakeWindow
        });
      }
    }
  };

  const result = await withGlobalOverrides({ window: fakeWindow }, () => (
    startBrowserExtensionCapture("capture-ticket-1", "28958607", "31486331")
  ));

  assert.equal(result.type, BROWSER_EXTENSION_MESSAGE.ACCEPTED);
  assert.deepEqual(commands[0].payload, {
    ticketNumber: "28958607",
    manualContractorNumber: "31486331"
  });
}

{
  const listeners = new Set();
  let nextTimeoutId = 1;
  const fakeWindow = {
    location: { origin: "https://mistercode25.github.io" },
    addEventListener(type, listener) {
      if (type === "message") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === "message") listeners.delete(listener);
    },
    clearTimeout() {},
    setTimeout() {
      const timeoutId = nextTimeoutId;
      nextTimeoutId += 1;
      return timeoutId;
    },
    postMessage(command) {
      const dispatch = (message) => {
        for (const listener of [...listeners]) {
          listener({ data: message, origin: fakeWindow.location.origin, source: fakeWindow });
        }
      };
      dispatch(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACCEPTED, command.requestId));
      dispatch(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACTION_COMPLETED, command.requestId, {
        action: "alo",
        result: { externalReferenceStatus: "unavailable" }
      }));
    }
  };

  const result = await withGlobalOverrides({ window: fakeWindow }, () => (
    startBrowserExtensionAloAutofill({ source: "salt-templater-alo-autofill" })
  ));

  assert.equal(result.type, BROWSER_EXTENSION_MESSAGE.ACTION_COMPLETED);
  assert.equal(result.action, "alo");
  assert.equal(listeners.size, 0);
}

console.log("browserExtensionAutomation tests passed");
