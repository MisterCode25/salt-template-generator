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
        mainVariantName: m.mainVariantName || "",
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

function replaceInText(text, fromToken, toToken) {
    if (!text || !fromToken || fromToken === toToken) return text;
    return text.split(fromToken).join(toToken);
}

function replaceTokenInVariant(variant, fromToken, toToken) {
    return {
        ...variant,
        text_fr: replaceInText(variant.text_fr || "", fromToken, toToken),
        text_en: replaceInText(variant.text_en || "", fromToken, toToken),
        text_de: replaceInText(variant.text_de || "", fromToken, toToken),
        text_it: replaceInText(variant.text_it || "", fromToken, toToken)
    };
}

export async function renameTokenInTemplates(fromToken, toToken) {
    if (!fromToken || !toToken || fromToken === toToken) return;

    const templates = await loadTemplates();
    let dirty = false;

    const next = templates.map(template => {
        const updated = {
            ...template,
            text_fr: replaceInText(template.text_fr || "", fromToken, toToken),
            text_en: replaceInText(template.text_en || "", fromToken, toToken),
            text_de: replaceInText(template.text_de || "", fromToken, toToken),
            text_it: replaceInText(template.text_it || "", fromToken, toToken),
            variants: (template.variants || []).map(v => replaceTokenInVariant(v, fromToken, toToken))
        };

        if (
            updated.text_fr !== template.text_fr
            || updated.text_en !== template.text_en
            || updated.text_de !== template.text_de
            || updated.text_it !== template.text_it
            || JSON.stringify(updated.variants) !== JSON.stringify(template.variants || [])
        ) {
            dirty = true;
        }

        return updated;
    });

    if (dirty) {
        await saveTemplates(next);
    }
}

export function groupTemplates(models = []) {
    const sorted = [...models].sort((a, b) => (a.order || 0) - (b.order || 0));
    return {
        email: sorted.filter(m => m.type === "email"),
        sms: sorted.filter(m => m.type === "sms"),
        other: sorted.filter(m => m.type === "other")
    };
}
