import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";
import { loadJSON, readLegacyStorageValue, removeLegacyStorageValue, saveJSON } from "./storageService.js";
import { CHANNEL_VALUES, normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";
import { migrateLegacyModelsToTemplateTree } from "../utils/legacyTemplateMigration.js";
import { canonicalizeTemplateTokensInText } from "../utils/tokenCanonicalization.js";

export const TEMPLATE_NODE_KEY = "template_nodes";
export const NODE_TEMPLATE_KEY = "node_templates";
export const LEGACY_MODEL_KEY = "models";
export const LEGACY_TEMPLATE_MIGRATION_KEY = "template_tree_legacy_migration";
const TEMPLATE_TEXT_FIELDS = Object.freeze(["text_fr", "text_en", "text_de", "text_it"]);

async function loadList(key, normalize) {
    const indexedList = await loadIndexedJSON(key, null);
    if (Array.isArray(indexedList)) {
        const normalized = [];
        for (const item of indexedList) {
            normalized.push(normalize(item));
        }
        return normalized;
    }

    const legacyList = await loadJSON(key, []);
    if (!Array.isArray(legacyList)) return [];

    const normalized = [];
    for (const item of legacyList) {
        normalized.push(normalize(item));
    }
    return normalized;
}

async function saveList(key, items, normalize) {
    const normalizedItems = [];
    if (Array.isArray(items)) {
        for (const item of items) {
            normalizedItems.push(normalize(item));
        }
    }
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
    const canonicalizedTemplates = [];
    for (const template of templates) {
        canonicalizedTemplates.push(canonicalizeTemplateTokens(template).template);
    }
    await Promise.all([
        saveTemplateNodes(nodes),
        saveNodeTemplates(canonicalizedTemplates)
    ]);
}

function transformTextFields(source = {}, transformText) {
    let dirty = false;
    let nextFields = null;

    for (const field of TEMPLATE_TEXT_FIELDS) {
        const current = source[field];
        const next = transformText(current || "");
        if (current === next) continue;
        dirty = true;
        nextFields = nextFields || {};
        nextFields[field] = next;
    }

    return {
        value: dirty ? { ...source, ...nextFields } : source,
        dirty
    };
}

function transformChannelContentText(content, transformText) {
    if (!content) return { content, dirty: false };

    const contentResult = transformTextFields(content, transformText);
    const hasVariantList = Array.isArray(content.variants);
    const originalVariants = hasVariantList ? content.variants : [];
    let variants = hasVariantList ? originalVariants : [];
    let dirty = contentResult.dirty || !hasVariantList;

    for (let index = 0; index < originalVariants.length; index++) {
        const variant = originalVariants[index];
        const variantResult = transformTextFields(variant, transformText);
        if (!variantResult.dirty) continue;
        if (variants === originalVariants) variants = originalVariants.slice();
        variants[index] = variantResult.value;
        dirty = true;
    }

    if (!dirty) {
        return { content, dirty: false };
    }

    const nextContent = {
        ...contentResult.value,
        variants
    };

    return {
        content: nextContent,
        dirty: true
    };
}

function canonicalizeChannelContentTokens(content) {
    return transformChannelContentText(content, canonicalizeTemplateTokensInText);
}

function canonicalizeTemplateTokens(template) {
    const originalContentByChannel = template.contentByChannel || {};
    let contentByChannel = originalContentByChannel;
    let dirty = false;

    for (const channel of CHANNEL_VALUES) {
        const result = canonicalizeChannelContentTokens(contentByChannel[channel]);
        if (!result.dirty) continue;
        if (contentByChannel === originalContentByChannel) {
            contentByChannel = { ...originalContentByChannel };
        }
        contentByChannel[channel] = result.content;
        dirty = true;
    }

    return dirty
        ? {
            template: normalizeTemplate({
                ...template,
                contentByChannel
            }),
            dirty
        }
        : {
            template: normalizeTemplate(template),
            dirty: false
        };
}

async function migrateCanonicalTemplateTokens({ nodes = [], templates = [] } = {}) {
    let dirty = false;
    const nextTemplates = [];
    for (const template of templates) {
        const result = canonicalizeTemplateTokens(template);
        dirty = dirty || result.dirty;
        nextTemplates.push(result.template);
    }

    if (dirty) {
        await saveTemplateTreeData({ nodes, templates: nextTemplates });
    }

    return { nodes, templates: nextTemplates };
}

async function loadStoredLegacyModels() {
    const indexedModels = await loadIndexedJSON(LEGACY_MODEL_KEY, null);
    const legacyModels = readLegacyStorageValue(LEGACY_MODEL_KEY);
    const indexedList = Array.isArray(indexedModels) ? indexedModels : [];
    const localList = Array.isArray(legacyModels.value) ? legacyModels.value : [];

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
    removeLegacyStorageValue(LEGACY_MODEL_KEY);
    await saveJSON(LEGACY_TEMPLATE_MIGRATION_KEY, {
        completed: true,
        migratedAt: Date.now(),
        modelCount: legacyModels.length
    });

    return migrated;
}

function replaceInText(text, fromToken, toToken) {
    if (!text || !fromToken || fromToken === toToken) return text;
    if (!text.includes(fromToken)) return text;
    return text.split(fromToken).join(toToken);
}

function replaceTokenInChannelContent(content, fromToken, toToken) {
    return transformChannelContentText(content, (text) => replaceInText(text, fromToken, toToken));
}

export async function renameTokenInTemplateTree(fromToken, toToken) {
    if (!fromToken || !toToken || fromToken === toToken) return;

    const { nodes, templates } = await loadTemplateTreeData();
    let dirty = false;
    const nextTemplates = [];
    for (const template of templates) {
        const originalContentByChannel = template.contentByChannel || {};
        let contentByChannel = originalContentByChannel;
        let templateDirty = false;

        for (const channel of CHANNEL_VALUES) {
            const result = replaceTokenInChannelContent(contentByChannel[channel], fromToken, toToken);
            if (!result.dirty) continue;
            if (contentByChannel === originalContentByChannel) {
                contentByChannel = { ...originalContentByChannel };
            }
            contentByChannel[channel] = result.content;
            templateDirty = true;
        }

        dirty = dirty || templateDirty;
        nextTemplates.push(templateDirty
            ? normalizeTemplate({
                ...template,
                contentByChannel
            })
            : normalizeTemplate(template));
    }

    if (dirty) {
        await saveTemplateTreeData({ nodes, templates: nextTemplates });
    }
}
