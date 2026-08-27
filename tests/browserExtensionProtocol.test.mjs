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
  const event = createExtensionEvent(BROWSER_EXTENSION_MESSAGE.PROGRESS, "request-2", {
    phase: BROWSER_EXTENSION_PHASE.SUPER_OFFICE_CAPTURE
  });

  assert.equal(isExtensionEvent(event), true);
  assert.equal(isAppCommand(event), false);
  assert.equal(event.phase, BROWSER_EXTENSION_PHASE.SUPER_OFFICE_CAPTURE);
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
