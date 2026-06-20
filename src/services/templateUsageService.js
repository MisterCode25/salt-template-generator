import { loadJSON, saveJSON } from "./storageService.js";

export const TEMPLATE_USAGE_STATS_KEY = "template_usage_stats";
export const TEMPLATE_QUICK_SECTIONS_KEY = "template_quick_sections";

const DEFAULT_QUICK_SECTIONS_STATE = Object.freeze({
    mostUsed: false
});

function normalizeTimestamp(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeUsageCount(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

export function normalizeTemplateUsageStats(value = {}) {
    const source = value && typeof value === "object" ? value : {};
    const normalized = {};

    Object.entries(source).forEach(([templateId, entry]) => {
        const id = String(templateId || "").trim();
        if (!id || !entry || typeof entry !== "object") return;
        const usageCount = normalizeUsageCount(entry.usageCount);
        const lastUsedAt = normalizeTimestamp(entry.lastUsedAt);
        if (usageCount === 0 && lastUsedAt === 0) return;
        normalized[id] = { usageCount, lastUsedAt };
    });

    return normalized;
}

export function normalizeTemplateQuickSectionsState(value = {}) {
    const source = value && typeof value === "object" ? value : {};
    return {
        mostUsed: Boolean(source.mostUsed)
    };
}

export async function loadTemplateUsageStats() {
    return normalizeTemplateUsageStats(await loadJSON(TEMPLATE_USAGE_STATS_KEY, {}));
}

export async function saveTemplateUsageStats(stats = {}) {
    const normalized = normalizeTemplateUsageStats(stats);
    await saveJSON(TEMPLATE_USAGE_STATS_KEY, normalized);
    return normalized;
}

export async function recordTemplateUsage(templateId, usedAt = Date.now()) {
    const id = String(templateId || "").trim();
    if (!id) return loadTemplateUsageStats();

    const stats = await loadTemplateUsageStats();
    const previous = stats[id] || { usageCount: 0, lastUsedAt: 0 };
    stats[id] = {
        usageCount: previous.usageCount + 1,
        lastUsedAt: normalizeTimestamp(usedAt) || Date.now()
    };

    return saveTemplateUsageStats(stats);
}

export async function loadTemplateQuickSectionsState() {
    return normalizeTemplateQuickSectionsState(
        await loadJSON(TEMPLATE_QUICK_SECTIONS_KEY, DEFAULT_QUICK_SECTIONS_STATE)
    );
}

export async function saveTemplateQuickSectionsState(state = {}) {
    const normalized = normalizeTemplateQuickSectionsState(state);
    await saveJSON(TEMPLATE_QUICK_SECTIONS_KEY, normalized);
    return normalized;
}
