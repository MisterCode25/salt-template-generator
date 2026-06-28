import { loadJSON, saveJSON } from "./storageService.js";

const CONFIG_NAME_KEY = "configName";
const CONFIG_LOCKED_KEY = "config_locked";
const DEFAULT_CONFIG_NAME = "No configuration";
export const CONFIG_LOCK_UPDATED_EVENT = "config-lock-updated";

export async function loadConfigName() {
    const value = await loadJSON(CONFIG_NAME_KEY, DEFAULT_CONFIG_NAME);
    return typeof value === "string" && value.trim() ? value : DEFAULT_CONFIG_NAME;
}

export async function saveConfigName(name) {
    const nextName = typeof name === "string" && name.trim() ? name.trim() : DEFAULT_CONFIG_NAME;
    await saveJSON(CONFIG_NAME_KEY, nextName);
    return nextName;
}

export async function loadConfigLocked() {
    return Boolean(await loadJSON(CONFIG_LOCKED_KEY, false));
}

export async function saveConfigLocked(locked) {
    const nextLocked = Boolean(locked);
    await saveJSON(CONFIG_LOCKED_KEY, nextLocked);
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(CONFIG_LOCK_UPDATED_EVENT, {
            detail: { locked: nextLocked }
        }));
    }
    return nextLocked;
}
