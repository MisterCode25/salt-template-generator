import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";
import { loadJSON, saveJSON } from "./storageService.js";
import { CHANNEL_VALUES, normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";
import { migrateLegacyModelsToTemplateTree } from "../utils/legacyTemplateMigration.js";
import { canonicalizeTemplateTokensInText } from "../utils/tokenCanonicalization.js";

export const TEMPLATE_NODE_KEY = "template_nodes";
export const NODE_TEMPLATE_KEY = "node_templates";
export const LEGACY_MODEL_KEY = "models";
export const LEGACY_TEMPLATE_MIGRATION_KEY = "template_tree_legacy_migration";

async function loadList(key, normalize) {
    const indexedList = await loadIndexedJSON(key, null);
    if (Array.isArray(indexedList)) {
        return indexedList.map(normalize);
    }

    const legacyList = await loadJSON(key, []);
    return Array.isArray(legacyList) ? legacyList.map(normalize) : [];
}

async function saveList(key, items, normalize) {
    const normalizedItems = Array.isArray(items) ? items.map(normalize) : [];
    const saved = await saveIndexedJSON(key, normalizedItems);
    if (!saved) {
        await saveJSON(key, normalizedItems);
    }
}

export async function loadTemplateNodes() {
    return loadList(TEMPLATE_NODE_KEY, normalizeNode);
}

export async function saveTemplateNodes(nodes) {
    return saveList(TEMPLATE_NODE_KEY, nodes, normalizeNode);
}

export async function loadNodeTemplates() {
    return loadList(NODE_TEMPLATE_KEY, normalizeTemplate);
}

export async function saveNodeTemplates(templates) {
    return saveList(NODE_TEMPLATE_KEY, templates, normalizeTemplate);
}

export async function loadTemplateTreeData() {
    const [nodes, templates] = await Promise.all([
        loadTemplateNodes(),
        loadNodeTemplates()
    ]);

    const migrated = await migrateStoredLegacyTemplates({ nodes, templates });
    if (migrated) return migrateCanonicalTemplateTokens(migrated);

    return migrateCanonicalTemplateTokens({ nodes, templates });
}

export async function saveTemplateTreeData({ nodes = [], templates = [] } = {}) {
    const canonicalizedTemplates = templates.map((template) => canonicalizeTemplateTokens(template).template);
    await Promise.all([
        saveTemplateNodes(nodes),
        saveNodeTemplates(canonicalizedTemplates)
    ]);
}

function canonicalizeChannelContentTokens(content) {
    if (!content) return { content, dirty: false };

    const variants = (content.variants || []).map((variant) => ({
        ...variant,
        text_fr: canonicalizeTemplateTokensInText(variant.text_fr || ""),
        text_en: canonicalizeTemplateTokensInText(variant.text_en || ""),
        text_de: canonicalizeTemplateTokensInText(variant.text_de || ""),
        text_it: canonicalizeTemplateTokensInText(variant.text_it || "")
    }));

    const nextContent = {
        ...content,
        text_fr: canonicalizeTemplateTokensInText(content.text_fr || ""),
        text_en: canonicalizeTemplateTokensInText(content.text_en || ""),
        text_de: canonicalizeTemplateTokensInText(content.text_de || ""),
        text_it: canonicalizeTemplateTokensInText(content.text_it || ""),
        variants
    };

    return {
        content: nextContent,
        dirty: JSON.stringify(nextContent) !== JSON.stringify(content)
    };
}

function canonicalizeTemplateTokens(template) {
    const contentByChannel = { ...(template.contentByChannel || {}) };
    let dirty = false;

    CHANNEL_VALUES.forEach((channel) => {
        const result = canonicalizeChannelContentTokens(contentByChannel[channel]);
        contentByChannel[channel] = result.content;
        dirty = dirty || result.dirty;
    });

    return {
        template: normalizeTemplate({
            ...template,
            contentByChannel
        }),
        dirty
    };
}

async function migrateCanonicalTemplateTokens({ nodes = [], templates = [] } = {}) {
    let dirty = false;
    const nextTemplates = templates.map((template) => {
        const result = canonicalizeTemplateTokens(template);
        dirty = dirty || result.dirty;
        return result.template;
    });

    if (dirty) {
        await saveTemplateTreeData({ nodes, templates: nextTemplates });
    }

    return { nodes, templates: nextTemplates };
}

async function loadStoredLegacyModels() {
    const [indexedModels, localModels] = await Promise.all([
        loadIndexedJSON(LEGACY_MODEL_KEY, null),
        loadJSON(LEGACY_MODEL_KEY, null)
    ]);
    const indexedList = Array.isArray(indexedModels) ? indexedModels : [];
    const localList = Array.isArray(localModels) ? localModels : [];

    // The legacy app stored templates in localStorage. Prefer that non-empty
    // source over an empty IndexedDB value that may have been created later.
    return localList.length > 0 ? localList : indexedList;
}

async function migrateStoredLegacyTemplates({ nodes = [], templates = [] } = {}) {
    const migrationState = await loadJSON(LEGACY_TEMPLATE_MIGRATION_KEY, null);
    if (migrationState?.completed && templates.length > 0) return null;

    const legacyModels = await loadStoredLegacyModels();

    if (legacyModels.length === 0) return null;
    if (templates.length > 0 && !migrationState?.completed) return null;

    const migrated = migrateLegacyModelsToTemplateTree(legacyModels);
    if (migrated.nodes.length === 0 && migrated.templates.length === 0) return null;

    await saveTemplateTreeData(migrated);
    await saveJSON(LEGACY_TEMPLATE_MIGRATION_KEY, {
        completed: true,
        migratedAt: Date.now(),
        modelCount: legacyModels.length
    });

    return migrated;
}

function replaceInText(text, fromToken, toToken) {
    if (!text || !fromToken || fromToken === toToken) return text;
    return text.split(fromToken).join(toToken);
}

function replaceTokenInChannelContent(content, fromToken, toToken) {
    if (!content) return { content, dirty: false };

    const variants = (content.variants || []).map((variant) => ({
        ...variant,
        text_fr: replaceInText(variant.text_fr || "", fromToken, toToken),
        text_en: replaceInText(variant.text_en || "", fromToken, toToken),
        text_de: replaceInText(variant.text_de || "", fromToken, toToken),
        text_it: replaceInText(variant.text_it || "", fromToken, toToken)
    }));

    const nextContent = {
        ...content,
        text_fr: replaceInText(content.text_fr || "", fromToken, toToken),
        text_en: replaceInText(content.text_en || "", fromToken, toToken),
        text_de: replaceInText(content.text_de || "", fromToken, toToken),
        text_it: replaceInText(content.text_it || "", fromToken, toToken),
        variants
    };

    return {
        content: nextContent,
        dirty: JSON.stringify(nextContent) !== JSON.stringify(content)
    };
}

export async function renameTokenInTemplateTree(fromToken, toToken) {
    if (!fromToken || !toToken || fromToken === toToken) return;

    const { nodes, templates } = await loadTemplateTreeData();
    let dirty = false;
    const nextTemplates = templates.map((template) => {
        const contentByChannel = { ...(template.contentByChannel || {}) };

        CHANNEL_VALUES.forEach((channel) => {
            const result = replaceTokenInChannelContent(contentByChannel[channel], fromToken, toToken);
            contentByChannel[channel] = result.content;
            dirty = dirty || result.dirty;
        });

        return normalizeTemplate({
            ...template,
            contentByChannel
        });
    });

    if (dirty) {
        await saveTemplateTreeData({ nodes, templates: nextTemplates });
    }
}
