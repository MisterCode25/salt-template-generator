import assert from "node:assert/strict";
import {
  formatKeyboardShortcut,
  getKeyboardShortcutForEvent,
  isEditableShortcutTarget
} from "../src/utils/keyboardShortcuts.js";

function eventFor(key, overrides = {}) {
  return {
    key,
    code: "",
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    defaultPrevented: false,
    repeat: false,
    isComposing: false,
    target: null,
    ...overrides
  };
}

{
  assert.equal(getKeyboardShortcutForEvent(eventFor("q", { altKey: true })).id, "captureData");
  assert.equal(getKeyboardShortcutForEvent(eventFor("W", { altKey: true })), null);
  assert.equal(getKeyboardShortcutForEvent(eventFor("e", { altKey: true })).id, "clearData");
}

{
  assert.equal(getKeyboardShortcutForEvent(eventFor("Dead", { altKey: true, code: "KeyQ" })).id, "captureData");
  assert.equal(getKeyboardShortcutForEvent(eventFor("∑", { altKey: true, code: "KeyW" })), null);
  assert.equal(getKeyboardShortcutForEvent(eventFor("Dead", { altKey: true, code: "KeyE" })).id, "clearData");
  assert.equal(getKeyboardShortcutForEvent(eventFor("Dead", { altKey: true, code: "KeyE", isComposing: true })).id, "clearData");
  assert.equal(getKeyboardShortcutForEvent(eventFor("Dead", { altKey: true, code: "KeyR" })), null);
}

{
  assert.equal(getKeyboardShortcutForEvent(eventFor("q")), null);
  assert.equal(getKeyboardShortcutForEvent(eventFor("q", { ctrlKey: true })), null);
  assert.equal(getKeyboardShortcutForEvent(eventFor("q", { altKey: true, ctrlKey: true })), null);
}

{
  const inputLikeTarget = {
    closest(selector) {
      return selector.includes("input") ? this : null;
    }
  };

  assert.equal(isEditableShortcutTarget(inputLikeTarget), true);
  assert.equal(getKeyboardShortcutForEvent(eventFor("q", { altKey: true, target: inputLikeTarget })), null);
}

{
  const shortcut = getKeyboardShortcutForEvent(eventFor("q", { altKey: true }));
  assert.equal(formatKeyboardShortcut(shortcut), "Alt+q");
  assert.equal(formatKeyboardShortcut(getKeyboardShortcutForEvent(eventFor("w", { altKey: true }))), "");
}

console.log("keyboardShortcuts tests passed");
