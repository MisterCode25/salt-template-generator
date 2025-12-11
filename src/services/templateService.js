import { loadJSON, saveJSON } from "./storageService.js";

const MODEL_KEY = "models";

function normalizeVariant(v) {
    return {
        id: v.id || crypto.randomUUID(),
        name: v.name || "",
        text_fr: v.text_fr || "",
        text_en: v.text_en || "",
        text_de: v.text_de || "",
        text_it: v.text_it || ""
    };
}

function normalizeModel(m) {
    return {
        ...m,
        variants: Array.isArray(m.variants) ? m.variants.map(normalizeVariant) : []
    };
}

export async function loadTemplates() {
    const list = await loadJSON(MODEL_KEY, []);
    return Array.isArray(list) ? list.map(normalizeModel) : [];
}

export async function saveTemplates(models) {
    await saveJSON(MODEL_KEY, models);
}

export function groupTemplates(models = []) {
    const sorted = [...models].sort((a, b) => (a.order || 0) - (b.order || 0));
    return {
        email: sorted.filter(m => m.type === "email"),
        sms: sorted.filter(m => m.type === "sms"),
        other: sorted.filter(m => m.type === "other")
    };
}
