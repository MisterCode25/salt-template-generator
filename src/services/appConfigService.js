import { loadJSON, saveJSON } from "./storageService.js";

const CONFIG_NAME_KEY = "configName";
const DEFAULT_CONFIG_NAME = "No configuration";

export async function loadConfigName() {
    const value = await loadJSON(CONFIG_NAME_KEY, DEFAULT_CONFIG_NAME);
    return typeof value === "string" && value.trim() ? value : DEFAULT_CONFIG_NAME;
}

export async function saveConfigName(name) {
    const nextName = typeof name === "string" && name.trim() ? name.trim() : DEFAULT_CONFIG_NAME;
    await saveJSON(CONFIG_NAME_KEY, nextName);
    return nextName;
}
