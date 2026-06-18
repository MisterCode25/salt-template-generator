import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";

const TOOLS_KEY = "quick_tools";

export const DEFAULT_TOOL_COLOR = "blue";
export const TOOL_TYPES = Object.freeze({
    LINK: "link",
    MODULE: "module"
});
export const DEFAULT_TOOL_TYPE = TOOL_TYPES.LINK;

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
const TOOL_TYPE_VALUES = new Set(Object.values(TOOL_TYPES));

export function sanitizeToolColor(color) {
    return TOOL_COLOR_VALUES.has(color) ? color : DEFAULT_TOOL_COLOR;
}

export function sanitizeToolType(type) {
    return TOOL_TYPE_VALUES.has(type) ? type : DEFAULT_TOOL_TYPE;
}

function normalizeOrder(order) {
    const numericOrder = Number(order);
    return Number.isFinite(numericOrder) ? numericOrder : undefined;
}

export function normalizeTool(tool) {
    if (!tool || typeof tool !== "object" || Array.isArray(tool)) return null;
    const inferredType = tool.type || (tool.html ? TOOL_TYPES.MODULE : TOOL_TYPES.LINK);
    const type = sanitizeToolType(inferredType);

    return {
        ...tool,
        type,
        title: String(tool.title || "").trim(),
        url: type === TOOL_TYPES.LINK ? String(tool.url || "").trim() : "",
        description: String(tool.description || "").trim(),
        prompt: String(tool.prompt || ""),
        html: String(tool.html || ""),
        color: sanitizeToolColor(tool.color),
        order: normalizeOrder(tool.order),
        beta: type === TOOL_TYPES.MODULE ? true : Boolean(tool.beta)
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

export function isModuleTool(tool) {
    return sanitizeToolType(tool?.type) === TOOL_TYPES.MODULE;
}
