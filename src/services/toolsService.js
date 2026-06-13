import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";

const TOOLS_KEY = "quick_tools";

export const DEFAULT_TOOL_COLOR = "blue";

export const TOOL_COLOR_OPTIONS = [
    { value: "blue", label: "Blue" },
    { value: "cyan", label: "Cyan" },
    { value: "emerald", label: "Green" },
    { value: "amber", label: "Amber" },
    { value: "rose", label: "Rose" },
    { value: "violet", label: "Violet" },
    { value: "slate", label: "Slate" }
];

const TOOL_COLOR_VALUES = new Set(TOOL_COLOR_OPTIONS.map((option) => option.value));

export function sanitizeToolColor(color) {
    return TOOL_COLOR_VALUES.has(color) ? color : DEFAULT_TOOL_COLOR;
}

function normalizeTool(tool) {
    if (!tool || typeof tool !== "object" || Array.isArray(tool)) return null;
    return {
        ...tool,
        color: sanitizeToolColor(tool.color)
    };
}

export async function loadTools() {
    const tools = await loadIndexedJSON(TOOLS_KEY, []);
    return Array.isArray(tools) ? tools.map(normalizeTool).filter(Boolean) : [];
}

export async function saveTools(tools) {
    const normalizedTools = Array.isArray(tools) ? tools.map(normalizeTool).filter(Boolean) : [];
    return saveIndexedJSON(TOOLS_KEY, normalizedTools);
}

export function resolveToolUrl(urlTemplate, values = {}) {
    return (urlTemplate || "").replace(/\{[^}]+\}/g, (match) => {
        const raw = values[match];
        if (raw == null || raw === "") return match;
        const plain = String(raw).replace(/<[^>]+>/g, "").trim();
        return encodeURIComponent(plain);
    });
}
