export const KEYBOARD_SHORTCUTS = Object.freeze([
    { id: "importVti", label: "Import VTI data", key: "q", altKey: true },
    { id: "importSo", label: "Import SO data", key: "w", altKey: true },
    { id: "clearData", label: "Clear imported data", key: "e", altKey: true }
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
        || event?.isComposing
        || isEditableShortcutTarget(event?.target)
    );
}

export function getKeyboardShortcutForEvent(event) {
    if (shouldIgnoreKeyboardShortcut(event)) return null;

    return KEYBOARD_SHORTCUTS.find((shortcut) => (
        keyMatches(event?.key, shortcut.key)
        && hasModifier(event, "ctrlKey") === Boolean(shortcut.ctrlKey)
        && hasModifier(event, "altKey") === Boolean(shortcut.altKey)
        && hasModifier(event, "shiftKey") === Boolean(shortcut.shiftKey)
        && hasModifier(event, "metaKey") === Boolean(shortcut.metaKey)
    )) || null;
}
