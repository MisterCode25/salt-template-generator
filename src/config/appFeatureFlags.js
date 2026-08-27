export const APP_FEATURE_FLAGS = Object.freeze({
    // Emergency fallback: restore the legacy button and Alt+Q clipboard flow together.
    legacyClipboardCapture: false
});

export const CAPTURE_FLOW = Object.freeze({
    EXTENSION: "extension",
    LEGACY_CLIPBOARD: "legacy-clipboard"
});

export function shouldShowLegacyCaptureButton(featureFlags = APP_FEATURE_FLAGS) {
    return featureFlags.legacyClipboardCapture === true;
}

export function getPrimaryCaptureFlow(featureFlags = APP_FEATURE_FLAGS) {
    return shouldShowLegacyCaptureButton(featureFlags)
        ? CAPTURE_FLOW.LEGACY_CLIPBOARD
        : CAPTURE_FLOW.EXTENSION;
}
