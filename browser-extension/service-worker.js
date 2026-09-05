import {
    BROWSER_EXTENSION_MESSAGE,
    BROWSER_EXTENSION_PHASE,
    createExtensionEvent,
    isAppCommand
} from "./shared/browserExtensionProtocol.js";
import {
    buildSuperOfficeTicketUrl,
    getCapturedSuperOfficeTicketNumber,
    getSuperOfficeTicketNumberFromUrl,
    normalizeSuperOfficeTicketNumber
} from "./shared/superOfficeTicketNavigation.js";
import {
    buildVtiContractorDetailUrl,
    buildVtiContractorPageUrls,
    buildVtiContractorSearchUrl,
    getCapturedVtiContractorNumber,
    getVtiContractorRecordIdFromUrl,
    resolveVtiCaptureRoute
} from "./shared/vtiContractorNavigation.js";
import {
    CAPTURE_TAB_ERROR_MESSAGE,
    selectFirstCaptureTabs,
    selectReusableWorkflowTab
} from "./tabDiscovery.js";
import { withTemporarilyActiveTab } from "./tabActivity.js";
import { createAloTicketTracker } from "./aloTicketTracking.js";
import {
    ALO_FULFILLMENT_DETAIL_URL,
    ALO_TICKET_CREATION_URL,
    autofillAloTicketPage,
    inspectAloWorkflowPage
} from "./aloAutomation.js";
import {
    ALEX_HOME_URL,
    ALEX_STORAGE_NAVIGATION_DELAY_MS,
    inspectAlexWorkflowPage,
    openAlexPage
} from "./alexAutomation.js";
import { captureSuperOfficePage } from "./generated/superOfficeCapture.js";
import { captureVtiPage } from "./generated/vtiCapture.js";
import {
    captureVtiHealthcheckPage,
    extractUsableVtiHealthcheckText,
    fetchVtiHealthcheckSource
} from "./healthcheckCapture.js";
import {
    findVtiContractorRecord,
    verifyLoadedVtiContractorPage
} from "./vtiContractorSearch.js";
import {
    buildVtiCapturePayload,
    captureVtiBackgroundPages,
    captureVtiOfferPage
} from "./vtiParallelCapture.js";

let activeWorkflow = null;
const aloTicketTracker = createAloTicketTracker({
    storage: chrome.storage.session,
    sendResult: (record) => sendToApplication(record.appTabId, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.ALO_TICKET_CREATED, record.requestId,
        { result: record.result, capturedAt: record.capturedAt }
    ))
});
chrome.tabs.onRemoved.addListener((tabId) => {
    aloTicketTracker.removeTab(tabId).catch(console.error);
});
const WORKFLOW_AUTHENTICATION_TIMEOUT_MS = 10 * 60 * 1000;
const WORKFLOW_PAGE_READY_TIMEOUT_MS = 30000;
const WORKFLOW_POST_LOGIN_GRACE_MS = 1500;
const WORKFLOW_POLL_INTERVAL_MS = 750;

function getExtensionVersion() {
    return chrome.runtime.getManifest().version;
}

function normalizeError(error) {
    return String(error?.message || error || "Unable to complete the operation.").trim();
}

function createVtiResultError(result, fallbackMessage) {
    const error = new Error(result?.error || fallbackMessage);
    if (result?.code) error.code = result.code;
    return error;
}

function isVtiSessionError(error) {
    return error?.code === "VTI_SESSION_REQUIRED"
        || /VTI session has expired/i.test(normalizeError(error));
}

async function sendToApplication(tabId, message) {
    try {
        await chrome.tabs.sendMessage(tabId, message);
    } catch {
        // The application tab may have been closed or reloaded during capture.
    }
}

async function reportProgress(appTabId, requestId, phase, message, details = {}) {
    await sendToApplication(appTabId, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.PROGRESS,
        requestId,
        { phase, message, ...details }
    ));
}

function readExecutionResult(results, label) {
    const result = results?.[0]?.result;
    if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw new Error(`${label} returned no usable data.`);
    }
    return result;
}

async function findVtiContractorInTab(tabId, contractorNumber) {
    const searchUrl = buildVtiContractorSearchUrl(contractorNumber);
    await chrome.tabs.update(tabId, { url: searchUrl });
    await waitForTabLoad(tabId, 30000, "VTI contractor search");
    const searchResults = await chrome.scripting.executeScript({
        target: { tabId },
        world: "ISOLATED",
        func: findVtiContractorRecord,
        args: [contractorNumber]
    });
    return readExecutionResult(searchResults, "VTI search");
}

async function captureVtiOfferAndHealth(recordId, pageUrls, windowId) {
    let helperTabId = null;
    try {
        const helperTab = await chrome.tabs.create({
            url: pageUrls.offers,
            active: false,
            windowId
        });
        helperTabId = helperTab.id;
        return await withTemporarilyActiveTab(chrome.tabs, helperTabId, async () => {
            await waitForTabLoad(helperTabId, 30000, "VTI Offer Management");

            const offerResults = await chrome.scripting.executeScript({
                target: { tabId: helperTabId },
                world: "MAIN",
                func: captureVtiOfferPage,
                args: [recordId]
            });
            const offerCapture = readExecutionResult(offerResults, "Offer Management VTI");
            if (!offerCapture.ok) {
                throw createVtiResultError(
                    offerCapture,
                    "VTI Offer Management is unavailable."
                );
            }

            let healthText = "";
            try {
                const healthResults = await chrome.scripting.executeScript({
                    target: { tabId: helperTabId },
                    world: "MAIN",
                    func: fetchVtiHealthcheckSource,
                    args: [offerCapture.healthUrl]
                });
                healthText = extractUsableVtiHealthcheckText(
                    String(healthResults?.[0]?.result || "")
                );
            } catch {
                // Loading HealthCheck in the active helper tab below remains the compatibility fallback.
            }

            if (!healthText) {
                await chrome.tabs.update(helperTabId, { url: offerCapture.healthUrl });
                await waitForTabLoad(helperTabId, 30000, "VTI HealthCheck");
                const healthResults = await chrome.scripting.executeScript({
                    target: { tabId: helperTabId },
                    world: "ISOLATED",
                    func: captureVtiHealthcheckPage
                });
                healthText = extractUsableVtiHealthcheckText(
                    String(healthResults?.[0]?.result || "")
                );
            }

            if (!healthText) {
                throw new Error("VTI HealthCheck returned no usable data.");
            }
            return { offerCapture, healthText };
        });
    } finally {
        if (helperTabId !== null) {
            try {
                await chrome.tabs.remove(helperTabId);
            } catch {
                // The helper tab may already have been closed by the user.
            }
        }
    }
}

async function loadVtiContractorInTab(tabId, recordId, contractorNumber) {
    const currentVtiTab = await chrome.tabs.get(tabId);
    const isRequestedRecordAlreadyLoaded = getVtiContractorRecordIdFromUrl(
        currentVtiTab.url
    ) === recordId;
    if (!isRequestedRecordAlreadyLoaded) {
        await chrome.tabs.update(tabId, {
            url: buildVtiContractorDetailUrl(recordId)
        });
    }
    if (!isRequestedRecordAlreadyLoaded || currentVtiTab.status !== "complete") {
        await waitForTabLoad(tabId, 30000, "VTI contractor record");
    }

    const verificationResults = await chrome.scripting.executeScript({
        target: { tabId },
        world: "ISOLATED",
        func: verifyLoadedVtiContractorPage,
        args: [recordId, contractorNumber]
    });
    const verification = readExecutionResult(
        verificationResults,
        "VTI contractor record validation"
    );
    if (!verification.ok) {
        throw createVtiResultError(
            verification,
            "The VTI contractor record could not be validated."
        );
    }
    return verification;
}

async function captureVtiStaticPagesFromTab(tabId, recordId, contractorNumber, pageUrls) {
    const staticResults = await chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        func: captureVtiBackgroundPages,
        args: [recordId, contractorNumber, pageUrls]
    });
    const staticCapture = readExecutionResult(
        staticResults,
        "The background VTI pages"
    );
    if (!staticCapture.ok) {
        throw createVtiResultError(
            staticCapture,
            "The VTI pages could not be captured."
        );
    }
    return staticCapture;
}

async function captureVtiInParallel(tabId, recordId, contractorNumber) {
    await loadVtiContractorInTab(tabId, recordId, contractorNumber);
    const vtiTab = await chrome.tabs.get(tabId);
    const pageUrls = buildVtiContractorPageUrls(recordId);
    const [staticCapture, capturedPages] = await Promise.all([
        captureVtiStaticPagesFromTab(tabId, recordId, contractorNumber, pageUrls),
        captureVtiOfferAndHealth(recordId, pageUrls, vtiTab.windowId)
    ]);

    return buildVtiCapturePayload({
        staticCapture,
        offerCapture: capturedPages.offerCapture,
        healthText: capturedPages.healthText
    });
}

async function captureVtiWithLegacyPage(tabId, recordId, contractorNumber) {
    await loadVtiContractorInTab(tabId, recordId, contractorNumber);

    const results = await chrome.scripting.executeScript({
        target: { tabId },
        world: "ISOLATED",
        func: captureVtiPage
    });
    return readExecutionResult(results, "VTI");
}

async function runCapture(requestId, appTabId, payload) {
    try {
        const requestedTicketNumber = normalizeSuperOfficeTicketNumber(payload?.ticketNumber);
        if (!requestedTicketNumber) {
            throw new Error("The SuperOffice ticket number is invalid.");
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.LOCATING_TABS,
            "Finding the SuperOffice and VTI tabs..."
        );

        const appTab = await chrome.tabs.get(appTabId);
        const tabs = await chrome.tabs.query({ windowType: "normal" });
        const selection = selectFirstCaptureTabs(tabs, appTab.windowId);
        if (!selection.ok) {
            throw new Error(CAPTURE_TAB_ERROR_MESSAGE[selection.error] || selection.error);
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.LOCATING_TABS,
            `Loading SuperOffice ticket ${requestedTicketNumber}...`,
            { superOfficeStatus: "active", vtiStatus: "waiting" }
        );
        const isRequestedTicketAlreadyLoaded = getSuperOfficeTicketNumberFromUrl(
            selection.superOfficeTab.url
        ) === requestedTicketNumber;
        if (!isRequestedTicketAlreadyLoaded) {
            await chrome.tabs.update(selection.superOfficeTab.id, {
                url: buildSuperOfficeTicketUrl(requestedTicketNumber)
            });
        }
        if (!isRequestedTicketAlreadyLoaded || selection.superOfficeTab.status !== "complete") {
            await waitForTabLoad(selection.superOfficeTab.id, 30000, "SuperOffice ticket");
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.SUPER_OFFICE_CAPTURE,
            `Capturing SuperOffice ticket ${requestedTicketNumber}...`,
            { superOfficeStatus: "active", vtiStatus: "waiting" }
        );
        const superOfficeResults = await chrome.scripting.executeScript({
            target: { tabId: selection.superOfficeTab.id },
            world: "MAIN",
            func: captureSuperOfficePage
        });
        const superOfficePayload = readExecutionResult(superOfficeResults, "SuperOffice");
        const capturedTicketNumber = getCapturedSuperOfficeTicketNumber(superOfficePayload);
        if (!capturedTicketNumber) {
            throw new Error("The loaded ticket number could not be confirmed in SuperOffice.");
        }
        if (capturedTicketNumber !== requestedTicketNumber) {
            throw new Error(
                `The captured SuperOffice ticket (${capturedTicketNumber}) does not match the requested ticket (${requestedTicketNumber}).`
            );
        }

        const vtiCaptureRoute = resolveVtiCaptureRoute(
            superOfficePayload,
            payload?.manualContractorNumber
        );
        const { contractorNumber } = vtiCaptureRoute;
        if (vtiCaptureRoute.mode === "manual-input") {
            await sendToApplication(appTabId, createExtensionEvent(
                BROWSER_EXTENSION_MESSAGE.CONTRACTOR_INPUT_REQUIRED,
                requestId,
                {
                    phase: BROWSER_EXTENSION_PHASE.AWAITING_CONTRACTOR_INPUT,
                    ticketNumber: requestedTicketNumber,
                    message: "No contractor was found in the External ID or after MSISDN in the first post. Enter it manually to continue. The VTI tab was not changed."
                }
            ));
            return;
        }

        const vtiPayload = await withTemporarilyActiveTab(
            chrome.tabs,
            selection.vtiTab.id,
            async () => {
                let vtiRecordId = "";
                if (vtiCaptureRoute.mode === "search") {
                    await reportProgress(
                        appTabId,
                        requestId,
                        BROWSER_EXTENSION_PHASE.VTI_SEARCH,
                        `Searching for contractor ${contractorNumber} in VTI...`,
                        { superOfficeStatus: "done", vtiStatus: "active" }
                    );
                    const vtiSearchResult = await findVtiContractorInTab(
                        selection.vtiTab.id,
                        contractorNumber
                    );
                    if (!vtiSearchResult.ok) {
                        throw createVtiResultError(
                            vtiSearchResult,
                            "The contractor was not found in VTI."
                        );
                    }
                    vtiRecordId = String(vtiSearchResult.recordId || "");
                }

                await reportProgress(
                    appTabId,
                    requestId,
                    BROWSER_EXTENSION_PHASE.VTI_CAPTURE,
                    `Loading contractor ${contractorNumber} in the VTI tab before parallel capture...`,
                    { superOfficeStatus: "done", vtiStatus: "active", vtiCaptureMode: "parallel" }
                );
                try {
                    return await captureVtiInParallel(
                        selection.vtiTab.id,
                        vtiRecordId,
                        contractorNumber
                    );
                } catch (parallelCaptureError) {
                    if (isVtiSessionError(parallelCaptureError)) {
                        throw parallelCaptureError;
                    }
                    console.warn("Parallel VTI capture is unavailable.", parallelCaptureError);
                    await reportProgress(
                        appTabId,
                        requestId,
                        BROWSER_EXTENSION_PHASE.VTI_RECORD_LOAD,
                        "Parallel capture is unavailable. Continuing with the compatible method...",
                        { superOfficeStatus: "done", vtiStatus: "active", vtiCaptureMode: "legacy" }
                    );
                    return captureVtiWithLegacyPage(
                        selection.vtiTab.id,
                        vtiRecordId,
                        contractorNumber
                    );
                }
            }
        );
        const capturedVtiContractorNumber = getCapturedVtiContractorNumber(vtiPayload);
        if (capturedVtiContractorNumber !== contractorNumber) {
            throw new Error(
                `The captured VTI customer (${capturedVtiContractorNumber || "unknown"}) does not match the requested contractor (${contractorNumber}).`
            );
        }

        await sendToApplication(appTabId, createExtensionEvent(
            BROWSER_EXTENSION_MESSAGE.COMPLETED,
            requestId,
            {
                phase: BROWSER_EXTENSION_PHASE.COMPLETED,
                message: "SuperOffice and VTI captures complete.",
                payload: {
                    superOffice: superOfficePayload,
                    vti: vtiPayload
                }
            }
        ));
    } catch (error) {
        await sendToApplication(appTabId, createExtensionEvent(
            BROWSER_EXTENSION_MESSAGE.FAILED,
            requestId,
            {
                phase: BROWSER_EXTENSION_PHASE.FAILED,
                error: normalizeError(error)
            }
        ));
    } finally {
        if (activeWorkflow?.requestId === requestId) activeWorkflow = null;
    }
}

function waitForTabLoad(tabId, timeoutMs = 30000, label = "tab") {
    return new Promise((resolve, reject) => {
        let timeoutId = null;
        const finish = (callback, value) => {
            chrome.tabs.onUpdated.removeListener(handleUpdated);
            if (timeoutId) clearTimeout(timeoutId);
            callback(value);
        };
        const handleUpdated = (updatedTabId, changeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
                finish(resolve);
            }
        };

        chrome.tabs.onUpdated.addListener(handleUpdated);
        timeoutId = setTimeout(() => {
            finish(reject, new Error(`Loading ${label} timed out.`));
        }, timeoutMs);

        chrome.tabs.get(tabId).then((tab) => {
            if (tab.status === "complete") finish(resolve);
        }).catch((error) => finish(reject, error));
    });
}

function validateHealthcheckRequest(message, sender) {
    try {
        const requestedUrl = new URL(message.url);
        const senderUrl = new URL(sender.tab?.url || "");
        return requestedUrl.protocol === "https:"
            && requestedUrl.hostname === senderUrl.hostname
            && requestedUrl.hostname === "vti.salt.ch";
    } catch {
        return false;
    }
}

async function captureHealthcheck(message, sender) {
    if (!validateHealthcheckRequest(message, sender)) {
        return { ok: false, error: "The requested Healthcheck page is not allowed." };
    }

    let helperTabId = null;
    try {
        let fetchedText = "";
        try {
            const fastFetchResults = await chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                world: "MAIN",
                func: fetchVtiHealthcheckSource,
                args: [message.url]
            });
            fetchedText = extractUsableVtiHealthcheckText(
                String(fastFetchResults?.[0]?.result || "")
            );
        } catch {
            // The hidden helper tab below remains the compatibility fallback.
        }
        if (fetchedText) {
            return { ok: true, text: fetchedText, transport: "fetch" };
        }

        const helperTab = await chrome.tabs.create({ url: message.url, active: false });
        helperTabId = helperTab.id;
        await waitForTabLoad(helperTabId, 30000, "Healthcheck VTI");
        const results = await chrome.scripting.executeScript({
            target: { tabId: helperTabId },
            world: "ISOLATED",
            func: captureVtiHealthcheckPage
        });
        return { ok: true, text: String(results?.[0]?.result || ""), transport: "tab" };
    } catch (error) {
        return { ok: false, error: normalizeError(error) };
    } finally {
        if (helperTabId !== null) {
            try {
                await chrome.tabs.remove(helperTabId);
            } catch {
                // The helper tab may already have been closed by the user.
            }
        }
    }
}

async function openOrReuseWorkflowTab(workflow, url) {
    const tabs = await chrome.tabs.query({ windowType: "normal" });
    const reusableTab = selectReusableWorkflowTab(tabs, workflow);
    const tab = reusableTab
        ? await chrome.tabs.update(reusableTab.id, { active: true, url })
        : await chrome.tabs.create({ active: true, url });
    await waitForTabLoad(tab.id, 30000, workflow === "alo" ? "ALO" : "ALEX");
    return tab;
}

function isWorkflowHost(workflow, tabUrl) {
    try {
        const hostname = new URL(tabUrl).hostname;
        return workflow === "alo"
            ? /(^|\.)wholesale\.swisscom\.com$/i.test(hostname)
            : /(^|\.)ftthproxy\.ch$/i.test(hostname);
    } catch {
        return false;
    }
}

function isWorkflowTargetUrl(currentUrl, targetUrl) {
    try {
        const current = new URL(currentUrl);
        const target = new URL(targetUrl);
        return current.origin === target.origin && current.pathname === target.pathname;
    } catch {
        return false;
    }
}

async function inspectWorkflowTab(tab, workflow) {
    if (!isWorkflowHost(workflow, tab.url)) {
        return { state: "authentication-required" };
    }

    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: "ISOLATED",
        func: workflow === "alo" ? inspectAloWorkflowPage : inspectAlexWorkflowPage
    });
    const result = readExecutionResult(results, workflow === "alo" ? "ALO" : "ALEX");
    if (!["ready", "loading", "authentication-required"].includes(result.state)) {
        throw new Error(`The ${workflow === "alo" ? "ALO" : "ALEX"} page state is unknown.`);
    }
    return result;
}

function waitForWorkflowPoll() {
    return new Promise((resolve) => setTimeout(resolve, WORKFLOW_POLL_INTERVAL_MS));
}

async function waitForAuthenticatedWorkflowPage({
    workflow,
    tabId,
    targetUrl,
    appTabId,
    requestId
}) {
    const authenticationDeadline = Date.now() + WORKFLOW_AUTHENTICATION_TIMEOUT_MS;
    let pageReadyStartedAt = Date.now();
    let postLoginLandingStartedAt = null;
    let hasObservedAuthentication = false;
    let hasReportedAuthentication = false;

    while (Date.now() < authenticationDeadline) {
        let tab;
        try {
            tab = await chrome.tabs.get(tabId);
        } catch {
            throw new Error(`The ${workflow === "alo" ? "ALO" : "ALEX"} tab was closed.`);
        }

        const pageState = await inspectWorkflowTab(tab, workflow);
        if (pageState.state === "ready") return tab;

        if (pageState.state === "authentication-required") {
            hasObservedAuthentication = true;
            pageReadyStartedAt = null;
            postLoginLandingStartedAt = null;
            if (!hasReportedAuthentication) {
                hasReportedAuthentication = true;
                const label = workflow === "alo" ? "ALO" : "ALEX";
                await reportProgress(
                    appTabId,
                    requestId,
                    BROWSER_EXTENSION_PHASE.AWAITING_AUTHENTICATION,
                    `Sign in to ${label} in the open tab. The action will resume automatically.`,
                    { action: workflow }
                );
            }
            await waitForWorkflowPoll();
            continue;
        }

        if (pageReadyStartedAt === null) pageReadyStartedAt = Date.now();
        const isTargetPage = isWorkflowTargetUrl(tab.url, targetUrl);
        if (hasObservedAuthentication && !isTargetPage) {
            if (postLoginLandingStartedAt === null) postLoginLandingStartedAt = Date.now();
            if (Date.now() - postLoginLandingStartedAt >= WORKFLOW_POST_LOGIN_GRACE_MS) {
                await chrome.tabs.update(tabId, { active: true, url: targetUrl });
                await waitForTabLoad(
                    tabId,
                    WORKFLOW_PAGE_READY_TIMEOUT_MS,
                    workflow === "alo" ? "the ALO form" : "ALEX"
                );
                pageReadyStartedAt = Date.now();
                postLoginLandingStartedAt = null;
                continue;
            }
        } else {
            postLoginLandingStartedAt = null;
        }

        if (Date.now() - pageReadyStartedAt >= WORKFLOW_PAGE_READY_TIMEOUT_MS) {
            throw new Error(
                workflow === "alo"
                    ? "The ALO form did not appear after sign-in."
                    : "ALEX did not appear after sign-in."
            );
        }
        await waitForWorkflowPoll();
    }

    throw new Error(
        `${workflow === "alo" ? "ALO" : "ALEX"} sign-in timed out.`
    );
}

async function sendActionCompleted(appTabId, requestId, action, message, details = {}) {
    await sendToApplication(appTabId, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.ACTION_COMPLETED,
        requestId,
        { action, message, ...details }
    ));
}

async function sendActionFailed(appTabId, requestId, action, error) {
    await sendToApplication(appTabId, createExtensionEvent(
        BROWSER_EXTENSION_MESSAGE.FAILED,
        requestId,
        { action, error: normalizeError(error) }
    ));
}

async function runAloAutofill(requestId, appTabId, payload) {
    try {
        if (!payload || payload.source !== "salt-templater-alo-autofill") {
            throw new Error("The received ALO data is invalid.");
        }
        const aloTab = await openOrReuseWorkflowTab("alo", ALO_TICKET_CREATION_URL);
        await aloTicketTracker.removeTab(aloTab.id);
        await waitForAuthenticatedWorkflowPage({
            workflow: "alo",
            tabId: aloTab.id,
            targetUrl: ALO_TICKET_CREATION_URL,
            appTabId,
            requestId
        });
        const executionResults = await chrome.scripting.executeScript({
            target: { tabId: aloTab.id },
            world: "MAIN",
            func: autofillAloTicketPage,
            args: [payload, ALO_FULFILLMENT_DETAIL_URL]
        });
        const result = readExecutionResult(executionResults, "ALO");
        if (!result.ok) throw new Error(result.error || "The ALO form could not be filled.");

        const watchesTicketResult = Boolean(payload.fields?.socketId?.trim());
        if (watchesTicketResult) {
            const appTab = await chrome.tabs.get(appTabId);
            await aloTicketTracker.start({
                requestId, appTabId, appOrigin: new URL(appTab.url).origin,
                aloTabId: aloTab.id, socketId: payload.fields.socketId.trim(),
                externalReference: result.externalReference
            });
        }

        const message = !watchesTicketResult
            ? "ALO filled. Automatic External ID requires a VTI OTO."
            : result.externalReferenceStatus === "unavailable"
                ? "ALO ticket filled. External Ref remains empty."
                : "ALO ticket opened and filled.";
        await sendActionCompleted(appTabId, requestId, "alo", message, { result: { ...result, watchesTicketResult } });
    } catch (error) {
        await sendActionFailed(appTabId, requestId, "alo", error);
    } finally {
        if (activeWorkflow?.requestId === requestId) activeWorkflow = null;
    }
}

async function runAlexOpen(requestId, appTabId, payload) {
    try {
        const supportedAction = payload
            && ["view-ticket", "create-ticket", "open-provider"].includes(payload.action);
        if (!payload || payload.source !== "salt-templater-alex-ticket" || !supportedAction) {
            throw new Error("The received ALEX data is invalid.");
        }
        const alexTab = await openOrReuseWorkflowTab("alex", ALEX_HOME_URL);
        await waitForAuthenticatedWorkflowPage({
            workflow: "alex",
            tabId: alexTab.id,
            targetUrl: ALEX_HOME_URL,
            appTabId,
            requestId
        });
        const executionResults = await chrome.scripting.executeScript({
            target: { tabId: alexTab.id },
            world: "MAIN",
            func: openAlexPage,
            args: [payload, ALEX_STORAGE_NAVIGATION_DELAY_MS]
        });
        const result = readExecutionResult(executionResults, "ALEX");
        if (!result.ok) throw new Error(result.error || "ALEX could not be opened.");

        const message = payload.action === "view-ticket"
            ? "Partner context applied. Opening the ALEX ticket..."
            : payload.action === "create-ticket"
                ? "Provider selected. Opening the SEP search with the VTI OTO..."
                : "Provider selected. Opening ALEX...";

        await sendActionCompleted(
            appTabId,
            requestId,
            "alex",
            message,
            { result }
        );
    } catch (error) {
        await sendActionFailed(appTabId, requestId, "alex", error);
    } finally {
        if (activeWorkflow?.requestId === requestId) activeWorkflow = null;
    }
}

function startWorkflow(message, appTabId, sendResponse, runner, action = "") {
    if (activeWorkflow) {
        sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.FAILED, message.requestId, {
            error: "Another automatic operation is already running."
        }));
        return;
    }

    activeWorkflow = { requestId: message.requestId, appTabId };
    sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACCEPTED, message.requestId, {
        version: getExtensionVersion(),
        ...(action ? { action } : {})
    }));
    runner(message.requestId, appTabId, message.payload);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (["salt.alo.submitted.v1", "salt.alo.result.v1"].includes(message?.type)) {
        aloTicketTracker.observe(message, sender).then(sendResponse).catch((error) => {
            console.error("ALO result capture failed", error);
            sendResponse({ captured: false });
        });
        return true;
    }
    if (message?.type === BROWSER_EXTENSION_MESSAGE.HEALTHCHECK) {
        captureHealthcheck(message, sender).then(sendResponse);
        return true;
    }

    if (!isAppCommand(message) || !sender.tab?.id) return false;

    if ([BROWSER_EXTENSION_MESSAGE.ALO_RESULTS_REQUEST, BROWSER_EXTENSION_MESSAGE.ALO_RESULT_ACK].includes(message.type)) {
        const origin = new URL(sender.url).origin;
        const operation = message.type === BROWSER_EXTENSION_MESSAGE.ALO_RESULT_ACK
            ? aloTicketTracker.acknowledge(message.requestId, origin)
            : aloTicketTracker.replay(Array.isArray(message.requestIds) ? message.requestIds : [], sender.tab.id, origin);
        operation.then(() => sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACCEPTED, message.requestId)))
            .catch((error) => sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.FAILED, message.requestId, { error: normalizeError(error) })));
        return true;
    }

    if (message.type === BROWSER_EXTENSION_MESSAGE.STATUS_REQUEST) {
        sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.STATUS, message.requestId, {
            installed: true,
            version: getExtensionVersion(),
            busy: Boolean(activeWorkflow)
        }));
        return false;
    }

    if (message.type === BROWSER_EXTENSION_MESSAGE.START_CAPTURE) {
        startWorkflow(message, sender.tab.id, sendResponse, runCapture);
        return false;
    }

    if (message.type === BROWSER_EXTENSION_MESSAGE.START_ALO) {
        startWorkflow(message, sender.tab.id, sendResponse, runAloAutofill, "alo");
        return false;
    }

    if (message.type === BROWSER_EXTENSION_MESSAGE.START_ALEX) {
        startWorkflow(message, sender.tab.id, sendResponse, runAlexOpen, "alex");
        return false;
    }

    return false;
});
