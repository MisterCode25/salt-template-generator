export const KEYBOARD_SHORTCUTS = Object.freeze([
    { id: "importVti", label: "Import VTI data", key: "q", code: "KeyQ", altKey: true },
    { id: "importSo", label: "Import SO data", key: "w", code: "KeyW", altKey: true },
    { id: "clearData", label: "Clear imported data", key: "e", code: "KeyE", altKey: true }
]);

const EDITABLE_TARGET_SELECTOR = [
    "input",
    "textarea",
    "select",
    "[contenteditable='true']",
    "[contenteditable='']",
    "[role='textbox']"
].join(",");

function hasModifier(event, name) {
    return Boolean(event?.[name]);
}

function keyMatches(actualKey, expectedKey) {
    return String(actualKey || "").toLowerCase() === String(expectedKey || "").toLowerCase();
}

function codeMatches(actualCode, expectedCode) {
    return Boolean(expectedCode)
        && String(actualCode || "").toLowerCase() === String(expectedCode || "").toLowerCase();
}

function modifiersMatch(event, shortcut) {
    return hasModifier(event, "ctrlKey") === Boolean(shortcut.ctrlKey)
        && hasModifier(event, "altKey") === Boolean(shortcut.altKey)
        && hasModifier(event, "shiftKey") === Boolean(shortcut.shiftKey)
        && hasModifier(event, "metaKey") === Boolean(shortcut.metaKey);
}

function shortcutMatchesEvent(event, shortcut) {
    return modifiersMatch(event, shortcut)
        && (
            keyMatches(event?.key, shortcut.key)
            || codeMatches(event?.code, shortcut.code)
        );
}

export function formatKeyboardShortcut(shortcut) {
    if (!shortcut) return "";

    return [
        shortcut.ctrlKey ? "Ctrl" : "",
        shortcut.altKey ? "Alt" : "",
        shortcut.shiftKey ? "Shift" : "",
        shortcut.metaKey ? "Meta" : "",
        shortcut.key
    ].filter(Boolean).join("+");
}

export function isEditableShortcutTarget(target) {
    const doc = typeof document === "undefined" ? null : document;
    const win = typeof window === "undefined" ? null : window;
    if (!target || target === doc || target === win) return false;
    if (typeof target.closest === "function" && target.closest(EDITABLE_TARGET_SELECTOR)) return true;
    return false;
}

export function shouldIgnoreKeyboardShortcut(event) {
    return Boolean(
        event?.defaultPrevented
        || event?.repeat
        || isEditableShortcutTarget(event?.target)
    );
}

export function getKeyboardShortcutForEvent(event) {
    if (shouldIgnoreKeyboardShortcut(event)) return null;

    const shortcut = KEYBOARD_SHORTCUTS.find((candidate) => shortcutMatchesEvent(event, candidate)) || null;
    if (!shortcut) return null;
    if (event?.isComposing && !codeMatches(event?.code, shortcut.code)) return null;
    return shortcut;
}
