import {
    BROWSER_EXTENSION_MESSAGE,
    createAppCommand,
    isExtensionEvent
} from "../../shared/browserExtensionProtocol.js";

const STATUS_TIMEOUT_MS = 1200;
const START_TIMEOUT_MS = 2200;
const ACTION_TIMEOUT_MS = 45000;
export const CURRENT_BROWSER_EXTENSION_VERSION = "0.1.5";

export function isBrowserExtensionVersionAtLeast(version, minimumVersion) {
    const parseVersion = (value) => String(value || "")
        .split(".")
        .slice(0, 3)
        .map((part) => Number(part));
    const current = parseVersion(version);
    const minimum = parseVersion(minimumVersion);
    if (current.length !== 3 || minimum.length !== 3) return false;
    if ([...current, ...minimum].some((part) => !Number.isInteger(part) || part < 0)) return false;

    for (let index = 0; index < 3; index += 1) {
        if (current[index] > minimum[index]) return true;
        if (current[index] < minimum[index]) return false;
    }
    return true;
}

export function createBrowserExtensionRequestId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `capture-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function subscribeToBrowserExtensionEvents(listener) {
    if (typeof window === "undefined") return () => {};

    const handleMessage = (event) => {
        if (event.source !== window || event.origin !== window.location.origin) return;
        if (!isExtensionEvent(event.data)) return;
        listener(event.data);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
}

function sendCommandAndWait(type, requestId, expectedTypes, timeoutMs, details = {}) {
    if (typeof window === "undefined") return Promise.resolve(null);

    return new Promise((resolve) => {
        let timeoutId = null;
        const unsubscribe = subscribeToBrowserExtensionEvents((message) => {
            if (message.requestId !== requestId || !expectedTypes.includes(message.type)) return;
            window.clearTimeout(timeoutId);
            unsubscribe();
            resolve(message);
        });

        timeoutId = window.setTimeout(() => {
            unsubscribe();
            resolve(null);
        }, timeoutMs);

        window.postMessage(createAppCommand(type, requestId, details), window.location.origin);
    });
}

export async function requestBrowserExtensionStatus() {
    const requestId = createBrowserExtensionRequestId();
    return sendCommandAndWait(
        BROWSER_EXTENSION_MESSAGE.STATUS_REQUEST,
        requestId,
        [BROWSER_EXTENSION_MESSAGE.STATUS, BROWSER_EXTENSION_MESSAGE.FAILED],
        STATUS_TIMEOUT_MS
    );
}

export async function startBrowserExtensionCapture(
    requestId = createBrowserExtensionRequestId(),
    ticketNumber = ""
) {
    return sendCommandAndWait(
        BROWSER_EXTENSION_MESSAGE.START_CAPTURE,
        requestId,
        [BROWSER_EXTENSION_MESSAGE.ACCEPTED, BROWSER_EXTENSION_MESSAGE.FAILED],
        START_TIMEOUT_MS,
        { payload: { ticketNumber } }
    );
}

function startBrowserExtensionAction(type, payload) {
    if (typeof window === "undefined") return Promise.resolve(null);

    const requestId = createBrowserExtensionRequestId();
    return new Promise((resolve) => {
        let acceptanceTimeoutId = null;
        let actionTimeoutId = null;
        let isSettled = false;

        const finish = (message) => {
            if (isSettled) return;
            isSettled = true;
            if (acceptanceTimeoutId) window.clearTimeout(acceptanceTimeoutId);
            if (actionTimeoutId) window.clearTimeout(actionTimeoutId);
            unsubscribe();
            resolve(message);
        };

        const unsubscribe = subscribeToBrowserExtensionEvents((message) => {
            if (message.requestId !== requestId) return;
            if (message.type === BROWSER_EXTENSION_MESSAGE.ACCEPTED) {
                window.clearTimeout(acceptanceTimeoutId);
                actionTimeoutId = window.setTimeout(() => finish({
                    type: BROWSER_EXTENSION_MESSAGE.FAILED,
                    requestId,
                    error: "L’opération de l’extension a dépassé le délai autorisé."
                }), ACTION_TIMEOUT_MS);
                return;
            }
            if ([
                BROWSER_EXTENSION_MESSAGE.ACTION_COMPLETED,
                BROWSER_EXTENSION_MESSAGE.FAILED
            ].includes(message.type)) {
                finish(message);
            }
        });

        acceptanceTimeoutId = window.setTimeout(() => finish(null), START_TIMEOUT_MS);
        window.postMessage(createAppCommand(type, requestId, { payload }), window.location.origin);
    });
}

export function startBrowserExtensionAloAutofill(payload) {
    return startBrowserExtensionAction(BROWSER_EXTENSION_MESSAGE.START_ALO, payload);
}

export function startBrowserExtensionAlexTicket(payload) {
    return startBrowserExtensionAction(BROWSER_EXTENSION_MESSAGE.START_ALEX, payload);
}
