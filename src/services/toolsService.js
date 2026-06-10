import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";

const TOOLS_KEY = "quick_tools";

export async function loadTools() {
    const tools = await loadIndexedJSON(TOOLS_KEY, []);
    return Array.isArray(tools) ? tools : [];
}

export async function saveTools(tools) {
    return saveIndexedJSON(TOOLS_KEY, tools);
}

export function resolveToolUrl(urlTemplate, values = {}) {
    return (urlTemplate || "").replace(/\{[^}]+\}/g, (match) => {
        const raw = values[match];
        if (raw == null || raw === "") return match;
        const plain = String(raw).replace(/<[^>]+>/g, "").trim();
        return encodeURIComponent(plain);
    });
}
