import assert from "node:assert/strict";
import {
    BROWSER_EXTENSION_MESSAGE,
    BROWSER_EXTENSION_PHASE,
    createExtensionEvent
} from "../shared/browserExtensionProtocol.js";
import {
    BROWSER_EXTENSION_CAPTURE_ACTION,
    createBrowserExtensionCaptureState,
    reduceBrowserExtensionCaptureState
} from "../src/utils/browserExtensionCaptureState.js";

const requestId = "capture-1";

{
    const initial = createBrowserExtensionCaptureState();
    const starting = reduceBrowserExtensionCaptureState(initial, {
        type: BROWSER_EXTENSION_CAPTURE_ACTION.STARTING,
        requestId
    });
    const locating = reduceBrowserExtensionCaptureState(starting, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.PROGRESS,
        requestId,
        {
            phase: BROWSER_EXTENSION_PHASE.LOCATING_TABS,
            message: "Recherche des onglets"
        }
    ));

    assert.equal(locating.isRunning, true);
    assert.equal(locating.phase, BROWSER_EXTENSION_PHASE.LOCATING_TABS);
    assert.equal(locating.message, "Recherche des onglets");
}

{
    const starting = reduceBrowserExtensionCaptureState(createBrowserExtensionCaptureState(), {
        type: BROWSER_EXTENSION_CAPTURE_ACTION.STARTING,
        requestId
    });
    const contractorInput = reduceBrowserExtensionCaptureState(starting, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.CONTRACTOR_INPUT_REQUIRED,
        requestId,
        {
            ticketNumber: "28958607",
            message: "Contractor introuvable"
        }
    ));

    assert.equal(contractorInput.isRunning, false);
    assert.equal(contractorInput.requiresContractorInput, true);
    assert.equal(contractorInput.superOfficeStatus, "done");
    assert.equal(contractorInput.vtiStatus, "waiting");
    assert.equal(contractorInput.ticketNumber, "28958607");
}

{
    const starting = reduceBrowserExtensionCaptureState(createBrowserExtensionCaptureState(), {
        type: BROWSER_EXTENSION_CAPTURE_ACTION.STARTING,
        requestId
    });
    const vtiCapture = reduceBrowserExtensionCaptureState(starting, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.PROGRESS,
        requestId,
        {
            phase: BROWSER_EXTENSION_PHASE.VTI_CAPTURE,
            superOfficeStatus: "done",
            vtiStatus: "active"
        }
    ));
    const importing = reduceBrowserExtensionCaptureState(vtiCapture, {
        type: BROWSER_EXTENSION_CAPTURE_ACTION.IMPORTING,
        requestId
    });

    assert.equal(vtiCapture.superOfficeStatus, "done");
    assert.equal(vtiCapture.vtiStatus, "active");
    assert.equal(importing.phase, BROWSER_EXTENSION_PHASE.IMPORTING);
    assert.equal(importing.vtiStatus, "done");
}

{
    const starting = reduceBrowserExtensionCaptureState(createBrowserExtensionCaptureState(), {
        type: BROWSER_EXTENSION_CAPTURE_ACTION.STARTING,
        requestId
    });
    const unrelatedFailure = reduceBrowserExtensionCaptureState(starting, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.FAILED,
        "another-request",
        { error: "Wrong request" }
    ));
    const failure = reduceBrowserExtensionCaptureState(starting, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.FAILED,
        requestId,
        { error: "VTI missing" }
    ));

    assert.deepEqual(unrelatedFailure, starting);
    assert.equal(failure.isRunning, false);
    assert.equal(failure.error, "VTI missing");
    assert.equal(failure.phase, BROWSER_EXTENSION_PHASE.FAILED);
}

console.log("browserExtensionCaptureState tests passed");
