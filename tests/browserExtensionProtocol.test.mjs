import assert from "node:assert/strict";
import {
  BROWSER_EXTENSION_MESSAGE,
  BROWSER_EXTENSION_PHASE,
  createAppCommand,
  createExtensionEvent,
  isAppCommand,
  isExtensionEvent
} from "../shared/browserExtensionProtocol.js";

{
  const command = createAppCommand(BROWSER_EXTENSION_MESSAGE.START_CAPTURE, "request-1");

  assert.equal(isAppCommand(command), true);
  assert.equal(isExtensionEvent(command), false);
  assert.equal(command.requestId, "request-1");
}

{
  const aloCommand = createAppCommand(BROWSER_EXTENSION_MESSAGE.START_ALO, "alo-1", {
    payload: { source: "salt-templater-alo-autofill" }
  });
  const alexCommand = createAppCommand(BROWSER_EXTENSION_MESSAGE.START_ALEX, "alex-1", {
    payload: { source: "salt-templater-alex-ticket" }
  });
  const completed = createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACTION_COMPLETED, "alo-1", {
    action: "alo"
  });

  assert.equal(isAppCommand(aloCommand), true);
  assert.equal(isAppCommand(alexCommand), true);
  assert.equal(isExtensionEvent(completed), true);
}

{
  const contractorInput = createExtensionEvent(
    BROWSER_EXTENSION_MESSAGE.CONTRACTOR_INPUT_REQUIRED,
    "request-contractor-input",
    { ticketNumber: "28958607" }
  );

  assert.equal(isExtensionEvent(contractorInput), true);
}

{
  const event = createExtensionEvent(BROWSER_EXTENSION_MESSAGE.PROGRESS, "request-2", {
    phase: BROWSER_EXTENSION_PHASE.AWAITING_AUTHENTICATION
  });

  assert.equal(isExtensionEvent(event), true);
  assert.equal(isAppCommand(event), false);
  assert.equal(event.phase, "AWAITING_AUTHENTICATION");
}

{
  assert.equal(isAppCommand({ type: BROWSER_EXTENSION_MESSAGE.START_CAPTURE }), false);
  assert.equal(isExtensionEvent({ type: BROWSER_EXTENSION_MESSAGE.COMPLETED }), false);
  assert.equal(isExtensionEvent(null), false);
}

{
  const event = createExtensionEvent(BROWSER_EXTENSION_MESSAGE.STATUS, "request-3", {
    source: "forged-source",
    requestId: "forged-request"
  });

  assert.equal(event.requestId, "request-3");
  assert.equal(isExtensionEvent(event), true);
}

console.log("browserExtensionProtocol tests passed");
