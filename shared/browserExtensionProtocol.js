export const BROWSER_EXTENSION_CHANNEL = "salt-bo-browser-capture.v1";

export const BROWSER_EXTENSION_SOURCE = Object.freeze({
    APP: "salt-template-generator",
    EXTENSION: "salt-bo-capture-extension"
});

export const BROWSER_EXTENSION_MESSAGE = Object.freeze({
    READY: "salt.capture.ready.v1",
    STATUS_REQUEST: "salt.capture.status.request.v1",
    STATUS: "salt.capture.status.v1",
    START_CAPTURE: "salt.capture.start.v1",
    START_ALO: "salt.capture.alo.start.v1",
    START_ALEX: "salt.capture.alex.start.v1",
    ACCEPTED: "salt.capture.accepted.v1",
    PROGRESS: "salt.capture.progress.v1",
    CONTRACTOR_INPUT_REQUIRED: "salt.capture.contractor-input-required.v1",
    COMPLETED: "salt.capture.completed.v1",
    ACTION_COMPLETED: "salt.capture.action.completed.v1",
    FAILED: "salt.capture.failed.v1",
    HEALTHCHECK: "salt.capture.healthcheck.v1"
});

export const BROWSER_EXTENSION_PHASE = Object.freeze({
    LOCATING_TABS: "LOCATING_TABS",
    SUPER_OFFICE_CAPTURE: "SUPER_OFFICE_CAPTURE",
    VTI_SEARCH: "VTI_SEARCH",
    VTI_RECORD_LOAD: "VTI_RECORD_LOAD",
    AWAITING_CONTRACTOR_INPUT: "AWAITING_CONTRACTOR_INPUT",
    AWAITING_AUTHENTICATION: "AWAITING_AUTHENTICATION",
    VTI_CAPTURE: "VTI_CAPTURE",
    IMPORTING: "IMPORTING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED"
});

const APP_MESSAGE_TYPES = new Set([
    BROWSER_EXTENSION_MESSAGE.STATUS_REQUEST,
    BROWSER_EXTENSION_MESSAGE.START_CAPTURE,
    BROWSER_EXTENSION_MESSAGE.START_ALO,
    BROWSER_EXTENSION_MESSAGE.START_ALEX
]);

const EXTENSION_MESSAGE_TYPES = new Set([
    BROWSER_EXTENSION_MESSAGE.READY,
    BROWSER_EXTENSION_MESSAGE.STATUS,
    BROWSER_EXTENSION_MESSAGE.ACCEPTED,
    BROWSER_EXTENSION_MESSAGE.PROGRESS,
    BROWSER_EXTENSION_MESSAGE.CONTRACTOR_INPUT_REQUIRED,
    BROWSER_EXTENSION_MESSAGE.COMPLETED,
    BROWSER_EXTENSION_MESSAGE.ACTION_COMPLETED,
    BROWSER_EXTENSION_MESSAGE.FAILED
]);

function hasRequestId(message) {
    return typeof message?.requestId === "string" && message.requestId.trim().length > 0;
}

export function createAppCommand(type, requestId, details = {}) {
    return {
        ...details,
        channel: BROWSER_EXTENSION_CHANNEL,
        source: BROWSER_EXTENSION_SOURCE.APP,
        type,
        requestId
    };
}

export function createExtensionEvent(type, requestId, details = {}) {
    return {
        ...details,
        channel: BROWSER_EXTENSION_CHANNEL,
        source: BROWSER_EXTENSION_SOURCE.EXTENSION,
        type,
        requestId
    };
}

export function isAppCommand(message) {
    return Boolean(
        message
        && message.channel === BROWSER_EXTENSION_CHANNEL
        && message.source === BROWSER_EXTENSION_SOURCE.APP
        && APP_MESSAGE_TYPES.has(message.type)
        && hasRequestId(message)
    );
}

export function isExtensionEvent(message) {
    return Boolean(
        message
        && message.channel === BROWSER_EXTENSION_CHANNEL
        && message.source === BROWSER_EXTENSION_SOURCE.EXTENSION
        && EXTENSION_MESSAGE_TYPES.has(message.type)
        && hasRequestId(message)
    );
}
