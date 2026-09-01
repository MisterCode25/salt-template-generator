import assert from "node:assert/strict";
import {
    BROWSER_EXTENSION_MESSAGE,
    BROWSER_EXTENSION_PHASE,
    createExtensionEvent
} from "../shared/browserExtensionProtocol.js";
import {
    BROWSER_EXTENSION_CAPTURE_ACTION,
    createBrowserExtensionCaptureState,
    getBrowserExtensionJourneyActiveStep,
    reduceBrowserExtensionCaptureState
} from "../src/utils/browserExtensionCaptureState.js";

const requestId = "capture-1";

assert.equal(getBrowserExtensionJourneyActiveStep(null), 0);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.SUPER_OFFICE_CAPTURE), 0);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.VTI_SEARCH), 1);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.VTI_RECORD_LOAD), 1);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.VTI_CAPTURE), 1);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.AWAITING_CONTRACTOR_INPUT), 1);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.IMPORTING), 2);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.COMPLETED), 2);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.FAILED), 0);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.FAILED, {
    superOfficeStatus: "done",
    vtiStatus: "waiting"
}), 1);
assert.equal(getBrowserExtensionJourneyActiveStep(BROWSER_EXTENSION_PHASE.FAILED, {
    superOfficeStatus: "done",
    vtiStatus: "done"
}), 2);

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
            message: "Finding tabs"
        }
    ));

    assert.equal(locating.isRunning, true);
    assert.equal(locating.phase, BROWSER_EXTENSION_PHASE.LOCATING_TABS);
    assert.equal(locating.message, "Finding tabs");
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
            message: "Contractor not found"
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

{
    const initial = createBrowserExtensionCaptureState();
    const accepted = reduceBrowserExtensionCaptureState(initial, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.ACCEPTED,
        "alo-action-1",
        { action: "alo" }
    ));
    const waitingForLogin = reduceBrowserExtensionCaptureState(accepted, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.PROGRESS,
        "alo-action-1",
        {
            action: "alo",
            phase: BROWSER_EXTENSION_PHASE.AWAITING_AUTHENTICATION
        }
    ));

    assert.deepEqual(accepted, initial);
    assert.deepEqual(waitingForLogin, initial);
}

console.log("browserExtensionCaptureState tests passed");
