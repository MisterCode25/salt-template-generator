import {
    BROWSER_EXTENSION_MESSAGE,
    BROWSER_EXTENSION_PHASE,
    createExtensionEvent,
    isAppCommand
} from "./shared/browserExtensionProtocol.js";
import {
    CAPTURE_TAB_ERROR_MESSAGE,
    selectUniqueCaptureTabs
} from "./tabDiscovery.js";
import { captureSuperOfficePage } from "./generated/superOfficeCapture.js";
import { captureVtiPage } from "./generated/vtiCapture.js";
import { captureVtiHealthcheckPage } from "./healthcheckCapture.js";

let activeCapture = null;

function getExtensionVersion() {
    return chrome.runtime.getManifest().version;
}

function normalizeError(error) {
    return String(error?.message || error || "Capture impossible.").trim();
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

async function runCapture(requestId, appTabId) {
    try {
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
            BROWSER_EXTENSION_PHASE.SUPER_OFFICE_CAPTURE,
            "Capture du ticket SuperOffice…",
            { superOfficeStatus: "active", vtiStatus: "waiting" }
        );
        const superOfficeResults = await chrome.scripting.executeScript({
            target: { tabId: selection.superOfficeTab.id },
            world: "MAIN",
            func: captureSuperOfficePage
        });
        const superOfficePayload = readExecutionResult(superOfficeResults, "SuperOffice");

        await reportProgress(
            appTabId,
            requestId,
            BROWSER_EXTENSION_PHASE.VTI_CAPTURE,
            "Ticket SuperOffice capturé. Capture du client VTI…",
            { superOfficeStatus: "done", vtiStatus: "active" }
        );
        const vtiResults = await chrome.scripting.executeScript({
            target: { tabId: selection.vtiTab.id },
            world: "ISOLATED",
            func: captureVtiPage
        });
        const vtiPayload = readExecutionResult(vtiResults, "VTI");

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
        if (activeCapture?.requestId === requestId) activeCapture = null;
    }
}

function waitForTabLoad(tabId, timeoutMs = 30000) {
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
            finish(reject, new Error("Le chargement Healthcheck VTI a dépassé le délai autorisé."));
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
        await waitForTabLoad(helperTabId);
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
            busy: Boolean(activeCapture)
        }));
        return false;
    }

    if (message.type === BROWSER_EXTENSION_MESSAGE.START_CAPTURE) {
        if (activeCapture) {
            sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.FAILED, message.requestId, {
                error: "Une capture automatique est déjà en cours."
            }));
            return false;
        }

        activeCapture = { requestId: message.requestId, appTabId: sender.tab.id };
        sendResponse(createExtensionEvent(BROWSER_EXTENSION_MESSAGE.ACCEPTED, message.requestId, {
            version: getExtensionVersion()
        }));
        runCapture(message.requestId, sender.tab.id);
        return false;
    }

    return false;
});
