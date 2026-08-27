import {
    BROWSER_EXTENSION_MESSAGE,
    BROWSER_EXTENSION_PHASE,
    createExtensionEvent,
    isAppCommand
} from "./shared/browserExtensionProtocol.js";
import {
    buildSuperOfficeTicketUrl,
    getCapturedSuperOfficeTicketNumber,
    normalizeSuperOfficeTicketNumber
} from "./shared/superOfficeTicketNavigation.js";
import {
    buildVtiContractorDetailUrl,
    buildVtiContractorSearchUrl,
    getCapturedVtiContractorNumber,
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
    autofillAloTicketPage
} from "./aloAutomation.js";
import {
    ALEX_HOME_URL,
    ALEX_STORAGE_NAVIGATION_DELAY_MS,
    openAlexTicketPage
} from "./alexAutomation.js";
import { captureSuperOfficePage } from "./generated/superOfficeCapture.js";
import { captureVtiPage } from "./generated/vtiCapture.js";
import { captureVtiHealthcheckPage } from "./healthcheckCapture.js";
import { findVtiContractorRecord } from "./vtiContractorSearch.js";

let activeWorkflow = null;

function getExtensionVersion() {
    return chrome.runtime.getManifest().version;
}

function normalizeError(error) {
    return String(error?.message || error || "Opération impossible.").trim();
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
        await chrome.tabs.update(selection.superOfficeTab.id, {
            url: buildSuperOfficeTicketUrl(requestedTicketNumber)
        });
        await waitForTabLoad(selection.superOfficeTab.id, 30000, "du ticket SuperOffice");

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

        if (vtiCaptureRoute.mode === "search") {
            await reportProgress(
                appTabId,
                requestId,
                BROWSER_EXTENSION_PHASE.VTI_SEARCH,
                `Recherche du contractor ${contractorNumber} dans VTI…`,
                { superOfficeStatus: "done", vtiStatus: "active" }
            );
            await chrome.tabs.update(selection.vtiTab.id, {
                url: buildVtiContractorSearchUrl(contractorNumber)
            });
            await waitForTabLoad(selection.vtiTab.id, 30000, "de la recherche contractor VTI");

            const vtiSearchResults = await chrome.scripting.executeScript({
                target: { tabId: selection.vtiTab.id },
                world: "ISOLATED",
                func: findVtiContractorRecord,
                args: [contractorNumber]
            });
            const vtiSearchResult = readExecutionResult(vtiSearchResults, "La recherche VTI");
            if (!vtiSearchResult.ok) {
                throw new Error(vtiSearchResult.error || "Le contractor n’a pas été trouvé dans VTI.");
            }

            await reportProgress(
                appTabId,
                requestId,
                BROWSER_EXTENSION_PHASE.VTI_RECORD_LOAD,
                `Contractor trouvé. Chargement de la fiche VTI ${vtiSearchResult.recordId}…`,
                { superOfficeStatus: "done", vtiStatus: "active" }
            );
            await chrome.tabs.update(selection.vtiTab.id, {
                url: buildVtiContractorDetailUrl(vtiSearchResult.recordId)
            });
            await waitForTabLoad(selection.vtiTab.id, 30000, "de la fiche contractor VTI");
        }

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.VTI_CAPTURE,
            `Fiche du contractor ${contractorNumber} chargée. Capture du client VTI…`,
            { superOfficeStatus: "done", vtiStatus: "active" }
        );
        const vtiResults = await chrome.scripting.executeScript({
            target: { tabId: selection.vtiTab.id },
            world: "ISOLATED",
            func: captureVtiPage
        });
        const vtiPayload = readExecutionResult(vtiResults, "VTI");
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
        const helperTab = await chrome.tabs.create({ url: message.url, active: false });
        helperTabId = helperTab.id;
        await waitForTabLoad(helperTabId, 30000, "Healthcheck VTI");
        const results = await chrome.scripting.executeScript({
            target: { tabId: helperTabId },
            world: "ISOLATED",
            func: captureVtiHealthcheckPage
        });
        return { ok: true, text: String(results?.[0]?.result || "") };
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

async function runAlexTicketOpen(requestId, appTabId, payload) {
    try {
        if (!payload || payload.source !== "salt-templater-alex-ticket" || payload.action !== "view-ticket") {
            throw new Error("Les données ALEX reçues sont invalides.");
        }
        const alexTab = await openOrReuseWorkflowTab("alex", ALEX_HOME_URL);
        const executionResults = await chrome.scripting.executeScript({
            target: { tabId: alexTab.id },
            world: "MAIN",
            func: openAlexTicketPage,
            args: [payload, ALEX_STORAGE_NAVIGATION_DELAY_MS]
        });
        const result = readExecutionResult(executionResults, "ALEX");
        if (!result.ok) throw new Error(result.error || "Le ticket ALEX n’a pas pu être ouvert.");

        await sendActionCompleted(
            appTabId,
            requestId,
            "alex",
            "Contexte partenaire appliqué. Ouverture du ticket ALEX…",
            { result }
        );
    } catch (error) {
        await sendActionFailed(appTabId, requestId, "alex", error);
    } finally {
        if (activeWorkflow?.requestId === requestId) activeWorkflow = null;
    }
}

function startWorkflow(message, appTabId, sendResponse, runner) {
    if (activeWorkflow) {
        sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.FAILED, message.requestId, {
            error: "Une opération automatique est déjà en cours."
        }));
        return;
    }

    activeWorkflow = { requestId: message.requestId, appTabId };
    sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACCEPTED, message.requestId, {
        version: getExtensionVersion()
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
        startWorkflow(message, sender.tab.id, sendResponse, runAloAutofill);
        return false;
    }

    if (message.type === BROWSER_EXTENSION_MESSAGE.START_ALEX) {
        startWorkflow(message, sender.tab.id, sendResponse, runAlexTicketOpen);
        return false;
    }

    return false;
});
