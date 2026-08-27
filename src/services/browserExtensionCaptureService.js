import {
    BROWSER_EXTENSION_MESSAGE,
    createAppCommand,
    isExtensionEvent
} from "../../shared/browserExtensionProtocol.js";

const STATUS_TIMEOUT_MS = 1200;
const START_TIMEOUT_MS = 2200;

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

function sendCommandAndWait(type, requestId, expectedTypes, timeoutMs) {
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

        window.postMessage(createAppCommand(type, requestId), window.location.origin);
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

export async function startBrowserExtensionCapture(requestId = createBrowserExtensionRequestId()) {
    return sendCommandAndWait(
        BROWSER_EXTENSION_MESSAGE.START_CAPTURE,
        requestId,
        [BROWSER_EXTENSION_MESSAGE.ACCEPTED, BROWSER_EXTENSION_MESSAGE.FAILED],
        START_TIMEOUT_MS
    );
}
