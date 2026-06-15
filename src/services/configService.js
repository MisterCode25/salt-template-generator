import { normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";
import { migrateLegacyModelsToTemplateTree } from "../utils/legacyTemplateMigration.js";
import { normalizeTemplateImages } from "../utils/templateImages.js";

const CONFIG_SCHEMA_VERSION = 3;

function computeConfigChecksum(serialized) {
    return Array.from(serialized).reduce((sum, ch) => (sum + ch.charCodeAt(0)) % 1000000007, 0);
}

function normalizeTreeData(treeData = {}) {
    return {
        nodes: Array.isArray(treeData.nodes) ? treeData.nodes.map(normalizeNode) : [],
        templates: Array.isArray(treeData.templates) ? treeData.templates.map(normalizeTemplate) : []
    };
}

export function buildConfigPayload(configName, tokens, treeData, templateImages = []) {
    const { nodes, templates } = normalizeTreeData(treeData);
    const images = normalizeTemplateImages(templateImages);
    const meta = {
        configName,
        schemaVersion: CONFIG_SCHEMA_VERSION,
        exportedAt: Date.now(),
        checksum: 0
    };
    const base = { meta, tokens, nodes, templates, templateImages: images };
    const serialized = JSON.stringify({ ...base, meta: { ...meta, checksum: 0 } });
    meta.checksum = computeConfigChecksum(serialized);
    return {
        meta,
        tokens,
        nodes,
        templates,
        templateImages: images,
        configName
    };
}

export function validateImportedConfig(raw = {}) {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Invalid file shape");
    }
    const tokens = Array.isArray(raw.tokens) ? raw.tokens : [];
    const hasTreeData = Array.isArray(raw.nodes) || Array.isArray(raw.templates);
    const hasLegacyModels = !hasTreeData && Array.isArray(raw.models);

    const { nodes, templates } = hasLegacyModels
        ? migrateLegacyModelsToTemplateTree(raw.models)
        : normalizeTreeData(raw);
    const templateImages = normalizeTemplateImages(raw.templateImages);
    const meta = raw.meta || {};
    const configName = meta.configName || raw.configName || "Imported configuration";

    if (meta.schemaVersion && meta.schemaVersion > CONFIG_SCHEMA_VERSION) {
        throw new Error("Unsupported version");
    }

    const serialized = JSON.stringify({
        meta: { ...meta, checksum: 0 },
        tokens,
        nodes,
        templates,
        templateImages
    });
    const legacySerialized = JSON.stringify({
        meta: { ...meta, checksum: 0 },
        tokens,
        nodes,
        templates
    });
    if (!hasLegacyModels && meta.checksum !== undefined) {
        const computed = computeConfigChecksum(serialized);
        const legacyComputed = computeConfigChecksum(legacySerialized);
        if (computed !== meta.checksum && legacyComputed !== meta.checksum) {
            throw new Error("Checksum mismatch");
        }
    }

    return { tokens, nodes, templates, templateImages, configName };
}

function mergeUniqueByKey(current = [], imported = [], getKey) {
    const byKey = new Map();
    const merged = [];

    const put = (item, fallbackPrefix, index) => {
        if (!item) return;
        const key = getKey(item) || `${fallbackPrefix}:${index}`;
        if (byKey.has(key)) {
            merged[byKey.get(key)] = item;
            return;
        }
        byKey.set(key, merged.length);
        merged.push(item);
    };

    current.forEach((item, index) => put(item, "current", index));
    imported.forEach((item, index) => put(item, "imported", index));
    return merged;
}

export function mergeConfigData(current = {}, imported = {}) {
    return {
        tokens: mergeUniqueByKey(current.tokens, imported.tokens, (tokenDef) => tokenDef?.token || tokenDef?.id),
        nodes: mergeUniqueByKey(current.nodes, imported.nodes, (node) => node?.id),
        templates: mergeUniqueByKey(current.templates, imported.templates, (template) => template?.id),
        templateImages: mergeUniqueByKey(current.templateImages, imported.templateImages, (image) => image?.id)
    };
}
