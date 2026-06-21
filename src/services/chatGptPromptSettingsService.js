import { loadJSON, saveJSON } from "./storageService.js";

export const CHATGPT_PROMPT_SETTINGS_KEY = "chatgpt_prompt_settings";
export const CHATGPT_PROMPT_SETTINGS_UPDATED_EVENT = "chatgpt-prompt-settings-updated";

export const DEFAULT_CHATGPT_PROMPT_SETTINGS = Object.freeze({
    templateInstruction: ""
});

export function normalizeChatGptPromptSettings(settings = {}) {
    return {
        templateInstruction: typeof settings?.templateInstruction === "string"
            ? settings.templateInstruction
            : ""
    };
}

export async function loadChatGptPromptSettings() {
    try {
        return normalizeChatGptPromptSettings(await loadJSON(CHATGPT_PROMPT_SETTINGS_KEY, DEFAULT_CHATGPT_PROMPT_SETTINGS));
    } catch (error) {
        console.error("loadChatGptPromptSettings error", error);
        return normalizeChatGptPromptSettings();
    }
}

export async function saveChatGptPromptSettings(settings = {}) {
    const normalized = normalizeChatGptPromptSettings(settings);

    try {
        await saveJSON(CHATGPT_PROMPT_SETTINGS_KEY, normalized);
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent(CHATGPT_PROMPT_SETTINGS_UPDATED_EVENT, {
                detail: { settings: normalized }
            }));
        }
    } catch (error) {
        console.error("saveChatGptPromptSettings error", error);
    }

    return normalized;
}
