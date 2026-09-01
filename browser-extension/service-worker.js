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
    selectReusableWorkflowTab,
    selectUniqueCaptureTabs
} from "./tabDiscovery.js";
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
const WORKFLOW_AUTHENTICATION_TIMEOUT_MS = 10 * 60 * 1000;
const WORKFLOW_PAGE_READY_TIMEOUT_MS = 30000;
const WORKFLOW_POST_LOGIN_GRACE_MS = 1500;
const WORKFLOW_POLL_INTERVAL_MS = 750;

function getExtensionVersion() {
    return chrome.runtime.getManifest().version;
}

function normalizeError(error) {
    return String(error?.message || error || "Opération impossible.").trim();
}

function createVtiResultError(result, fallbackMessage) {
    const error = new Error(result?.error || fallbackMessage);
    if (result?.code) error.code = result.code;
    return error;
}

function isVtiSessionError(error) {
    return error?.code === "VTI_SESSION_REQUIRED"
        || /session VTI a expiré/i.test(normalizeError(error));
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
        throw new Error(`${label} n’a retourné aucune donnée exploitable.`);
    }
    return result;
}

async function findVtiContractorInTab(tabId, contractorNumber) {
    const searchUrl = buildVtiContractorSearchUrl(contractorNumber);
    await chrome.tabs.update(tabId, { url: searchUrl });
    await waitForTabLoad(tabId, 30000, "de la recherche contractor VTI");
    const searchResults = await chrome.scripting.executeScript({
        target: { tabId },
        world: "ISOLATED",
        func: findVtiContractorRecord,
        args: [contractorNumber]
    });
    return readExecutionResult(searchResults, "La recherche VTI");
}

async function captureVtiOfferAndHealth(recordId, pageUrls) {
    let helperTabId = null;
    try {
        const helperTab = await chrome.tabs.create({ url: pageUrls.offers, active: false });
        helperTabId = helperTab.id;
        await waitForTabLoad(helperTabId, 30000, "d’Offer Management VTI");

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
                "Offer Management VTI est inaccessible."
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
            // Loading HealthCheck in the inactive tab below remains the compatibility fallback.
        }

        if (!healthText) {
            await chrome.tabs.update(helperTabId, { url: offerCapture.healthUrl });
            await waitForTabLoad(helperTabId, 30000, "du HealthCheck VTI");
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
            throw new Error("Le HealthCheck VTI n’a retourné aucune donnée exploitable.");
        }
        return { offerCapture, healthText };
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
        await waitForTabLoad(tabId, 30000, "de la fiche contractor VTI");
    }

    const verificationResults = await chrome.scripting.executeScript({
        target: { tabId },
        world: "ISOLATED",
        func: verifyLoadedVtiContractorPage,
        args: [recordId, contractorNumber]
    });
    const verification = readExecutionResult(
        verificationResults,
        "La validation de la fiche contractor VTI"
    );
    if (!verification.ok) {
        throw createVtiResultError(
            verification,
            "La fiche contractor VTI n’a pas pu être validée."
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
        "Les pages VTI en arrière-plan"
    );
    if (!staticCapture.ok) {
        throw createVtiResultError(
            staticCapture,
            "Les pages VTI n’ont pas pu être capturées."
        );
    }
    return staticCapture;
}

async function captureVtiInParallel(tabId, recordId, contractorNumber) {
    await loadVtiContractorInTab(tabId, recordId, contractorNumber);
    const pageUrls = buildVtiContractorPageUrls(recordId);
    const [staticCapture, capturedPages] = await Promise.all([
        captureVtiStaticPagesFromTab(tabId, recordId, contractorNumber, pageUrls),
        captureVtiOfferAndHealth(recordId, pageUrls)
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
            throw new Error("Le numéro de ticket SuperOffice est invalide.");
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.LOCATING_TABS,
            "Recherche de l’onglet SuperOffice et de l’onglet VTI…"
        );

        const tabs = await chrome.tabs.query({ windowType: "normal" });
        const selection = selectUniqueCaptureTabs(tabs);
        if (!selection.ok) {
            throw new Error(CAPTURE_TAB_ERROR_MESSAGE[selection.error] || selection.error);
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.LOCATING_TABS,
            `Chargement du ticket SuperOffice ${requestedTicketNumber}…`,
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
            await waitForTabLoad(selection.superOfficeTab.id, 30000, "du ticket SuperOffice");
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.SUPER_OFFICE_CAPTURE,
            `Capture du ticket SuperOffice ${requestedTicketNumber}…`,
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
            throw new Error("Le numéro du ticket chargé n’a pas pu être confirmé dans SuperOffice.");
        }
        if (capturedTicketNumber !== requestedTicketNumber) {
            throw new Error(
                `Le ticket SuperOffice capturé (${capturedTicketNumber}) ne correspond pas au ticket demandé (${requestedTicketNumber}).`
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
                    message: "Aucun contractor n’a été trouvé dans l’External ID ni après MSISDN dans le premier post. Saisis-le manuellement pour continuer. L’onglet VTI n’a pas été modifié."
                }
            ));
            return;
        }

        let vtiRecordId = "";
        if (vtiCaptureRoute.mode === "search") {
            await reportProgress(
                appTabId,
                requestId,
                BROWSER_EXTENSION_PHASE.VTI_SEARCH,
                `Recherche du contractor ${contractorNumber} dans VTI…`,
                { superOfficeStatus: "done", vtiStatus: "active" }
            );
            const vtiSearchResult = await findVtiContractorInTab(
                selection.vtiTab.id,
                contractorNumber
            );
            if (!vtiSearchResult.ok) {
                throw createVtiResultError(
                    vtiSearchResult,
                    "Le contractor n’a pas été trouvé dans VTI."
                );
            }
            vtiRecordId = String(vtiSearchResult.recordId || "");
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.VTI_CAPTURE,
            `Chargement du contractor ${contractorNumber} dans l’onglet VTI avant les captures parallèles…`,
            { superOfficeStatus: "done", vtiStatus: "active", vtiCaptureMode: "parallel" }
        );
        let vtiPayload;
        try {
            vtiPayload = await captureVtiInParallel(
                selection.vtiTab.id,
                vtiRecordId,
                contractorNumber
            );
        } catch (parallelCaptureError) {
            if (isVtiSessionError(parallelCaptureError)) {
                throw parallelCaptureError;
            }
            console.warn("Capture VTI parallèle indisponible.", parallelCaptureError);
            await reportProgress(
                appTabId,
                requestId,
                BROWSER_EXTENSION_PHASE.VTI_RECORD_LOAD,
                "Capture parallèle indisponible. Reprise avec la méthode compatible…",
                { superOfficeStatus: "done", vtiStatus: "active", vtiCaptureMode: "legacy" }
            );
            vtiPayload = await captureVtiWithLegacyPage(
                selection.vtiTab.id,
                vtiRecordId,
                contractorNumber
            );
        }
        const capturedVtiContractorNumber = getCapturedVtiContractorNumber(vtiPayload);
        if (capturedVtiContractorNumber !== contractorNumber) {
            throw new Error(
                `Le client VTI capturé (${capturedVtiContractorNumber || "inconnu"}) ne correspond pas au contractor demandé (${contractorNumber}).`
            );
        }

        await sendToApplication(appTabId, createExtensionEvent(
            BROWSER_EXTENSION_MESSAGE.COMPLETED,
            requestId,
            {
                phase: BROWSER_EXTENSION_PHASE.COMPLETED,
                message: "Captures SuperOffice et VTI terminées.",
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

function waitForTabLoad(tabId, timeoutMs = 30000, label = "de l’onglet") {
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
            finish(reject, new Error(`Le chargement ${label} a dépassé le délai autorisé.`));
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
        return { ok: false, error: "La page Healthcheck demandée n’est pas autorisée." };
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
        throw new Error(`L’état de la page ${workflow === "alo" ? "ALO" : "ALEX"} est inconnu.`);
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
            throw new Error(`L’onglet ${workflow === "alo" ? "ALO" : "ALEX"} a été fermé.`);
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
                    `Connecte-toi à ${label} dans l’onglet ouvert. L’action reprendra automatiquement.`,
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
                    workflow === "alo" ? "du formulaire ALO" : "d’ALEX"
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
                    ? "Le formulaire ALO ne s’est pas affiché après la connexion."
                    : "ALEX ne s’est pas affiché après la connexion."
            );
        }
        await waitForWorkflowPoll();
    }

    throw new Error(
        `La connexion ${workflow === "alo" ? "ALO" : "ALEX"} a dépassé le délai autorisé.`
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
            throw new Error("Les données ALO reçues sont invalides.");
        }
        const aloTab = await openOrReuseWorkflowTab("alo", ALO_TICKET_CREATION_URL);
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
        if (!result.ok) throw new Error(result.error || "Le formulaire ALO n’a pas pu être rempli.");

        const message = result.externalReferenceStatus === "unavailable"
            ? "Ticket ALO rempli. L’External Ref est restée vide."
            : "Ticket ALO ouvert et rempli.";
        await sendActionCompleted(appTabId, requestId, "alo", message, { result });
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
            throw new Error("Les données ALEX reçues sont invalides.");
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
        if (!result.ok) throw new Error(result.error || "ALEX n’a pas pu être ouvert.");

        const message = payload.action === "view-ticket"
            ? "Contexte partenaire appliqué. Ouverture du ticket ALEX…"
            : payload.action === "create-ticket"
                ? "Provider sélectionné. Recherche SEP ouverte avec l’OTO VTI…"
                : "Provider sélectionné. Ouverture d’ALEX…";

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
            error: "Une opération automatique est déjà en cours."
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
    if (message?.type === BROWSER_EXTENSION_MESSAGE.HEALTHCHECK) {
        captureHealthcheck(message, sender).then(sendResponse);
        return true;
    }

    if (!isAppCommand(message) || !sender.tab?.id) return false;

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
