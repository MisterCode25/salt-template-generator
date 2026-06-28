import { normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";
import { normalizeChatGptPromptSettings } from "./chatGptPromptSettingsService.js";
import { migrateLegacyModelsToTemplateTree } from "../utils/legacyTemplateMigration.js";
import { normalizeTemplateImages } from "../utils/templateImages.js";
import { normalizeTool } from "./toolsService.js";

const CONFIG_SCHEMA_VERSION = 3;
const DEFAULT_CONFIG_INCLUDES = Object.freeze({
    tokens: true,
    templates: true,
    templateImages: true,
    chatGptPromptSettings: true,
    tools: true
});

function computeConfigChecksum(serialized) {
    return Array.from(serialized).reduce((sum, ch) => (sum + ch.charCodeAt(0)) % 1000000007, 0);
}

function normalizeTreeData(treeData = {}) {
    return {
        nodes: Array.isArray(treeData.nodes) ? treeData.nodes.map(normalizeNode) : [],
        templates: Array.isArray(treeData.templates) ? treeData.templates.map(normalizeTemplate) : []
    };
}

function normalizeTools(tools = []) {
    return Array.isArray(tools) ? tools.map(normalizeTool).filter(Boolean) : [];
}

function getRawConfigTools(raw = {}) {
    if (Array.isArray(raw.tools)) return raw.tools;
    if (Array.isArray(raw.quickTools)) return raw.quickTools;
    if (Array.isArray(raw.quick_tools)) return raw.quick_tools;
    return null;
}

function getRawConfigLocked(raw = {}) {
    const meta = raw.meta || {};
    if (Object.prototype.hasOwnProperty.call(meta, "locked")) return meta.locked;
    if (Object.prototype.hasOwnProperty.call(meta, "configLocked")) return meta.configLocked;
    if (Object.prototype.hasOwnProperty.call(raw, "locked")) return raw.locked;
    if (Object.prototype.hasOwnProperty.call(raw, "configLocked")) return raw.configLocked;
    return undefined;
}

function normalizeConfigIncludes(rawIncludes = null) {
    return {
        ...DEFAULT_CONFIG_INCLUDES,
        ...(rawIncludes && typeof rawIncludes === "object" ? rawIncludes : {})
    };
}

export function buildConfigPayload(configName, tokens, treeData, templateImages = [], chatGptPromptSettings = {}, tools = [], protection = {}) {
    const includes = normalizeConfigIncludes(protection?.include);
    const { nodes, templates } = normalizeTreeData(treeData);
    const images = normalizeTemplateImages(templateImages);
    const normalizedChatGptPromptSettings = normalizeChatGptPromptSettings(chatGptPromptSettings);
    const normalizedTools = normalizeTools(tools);
    const locked = Boolean(protection?.locked);
    const meta = {
        configName,
        schemaVersion: CONFIG_SCHEMA_VERSION,
        exportedAt: Date.now(),
        locked,
        includes,
        checksum: 0
    };
    const base = {
        meta,
        tokens: includes.tokens ? tokens : [],
        nodes: includes.templates ? nodes : [],
        templates: includes.templates ? templates : [],
        templateImages: includes.templateImages ? images : [],
        chatGptPromptSettings: includes.chatGptPromptSettings ? normalizedChatGptPromptSettings : normalizeChatGptPromptSettings({}),
        tools: includes.tools ? normalizedTools : []
    };
    const serialized = JSON.stringify({ ...base, meta: { ...meta, checksum: 0 } });
    meta.checksum = computeConfigChecksum(serialized);
    return {
        meta,
        tokens: base.tokens,
        nodes: base.nodes,
        templates: base.templates,
        templateImages: base.templateImages,
        chatGptPromptSettings: base.chatGptPromptSettings,
        tools: base.tools,
        configName
    };
}

export function validateImportedConfig(raw = {}) {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Invalid file shape");
    }
    const meta = raw.meta || {};
    const rawIncludes = meta.includes && typeof meta.includes === "object" ? meta.includes : null;
    const hasTokens = rawIncludes ? Boolean(rawIncludes.tokens) : Array.isArray(raw.tokens);
    const hasTreeData = rawIncludes ? Boolean(rawIncludes.templates) : Array.isArray(raw.nodes) || Array.isArray(raw.templates);
    const hasTemplateImages = rawIncludes ? Boolean(rawIncludes.templateImages) : Array.isArray(raw.templateImages);
    const hasChatGptPromptSettings = rawIncludes
        ? Boolean(rawIncludes.chatGptPromptSettings)
        : Object.prototype.hasOwnProperty.call(raw, "chatGptPromptSettings");
    const rawTools = getRawConfigTools(raw);
    const hasTools = rawIncludes ? Boolean(rawIncludes.tools) : rawTools !== null;
    const tokens = hasTokens && Array.isArray(raw.tokens) ? raw.tokens : [];
    const hasLegacyModels = !hasTreeData && Array.isArray(raw.models);

    const { nodes, templates } = hasLegacyModels
        ? migrateLegacyModelsToTemplateTree(raw.models)
        : normalizeTreeData(raw);
    const templateImages = hasTemplateImages ? normalizeTemplateImages(raw.templateImages) : [];
    const chatGptPromptSettings = hasChatGptPromptSettings
        ? normalizeChatGptPromptSettings(raw.chatGptPromptSettings)
        : normalizeChatGptPromptSettings({});
    const tools = hasTools ? normalizeTools(rawTools || []) : [];
    const rawLocked = getRawConfigLocked(raw);
    const hasLock = rawLocked !== undefined;
    const locked = Boolean(rawLocked);
    const configName = meta.configName || raw.configName || "Imported configuration";

    if (meta.schemaVersion && meta.schemaVersion > CONFIG_SCHEMA_VERSION) {
        throw new Error("Unsupported version");
    }

    const serialized = JSON.stringify({
        meta: { ...meta, checksum: 0 },
        tokens,
        nodes,
        templates,
        templateImages,
        chatGptPromptSettings,
        tools
    });
    const withoutToolsSerialized = JSON.stringify({
        meta: { ...meta, checksum: 0 },
        tokens,
        nodes,
        templates,
        templateImages,
        chatGptPromptSettings
    });
    const previousSerialized = JSON.stringify({
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
        const withoutToolsComputed = computeConfigChecksum(withoutToolsSerialized);
        const previousComputed = computeConfigChecksum(previousSerialized);
        const legacyComputed = computeConfigChecksum(legacySerialized);
        if (
            computed !== meta.checksum
            && withoutToolsComputed !== meta.checksum
            && previousComputed !== meta.checksum
            && legacyComputed !== meta.checksum
        ) {
            throw new Error("Checksum mismatch");
        }
    }

    return {
        tokens,
        hasTokens,
        nodes,
        templates,
        hasTreeData: hasTreeData || hasLegacyModels,
        templateImages,
        hasTemplateImages,
        chatGptPromptSettings,
        hasChatGptPromptSettings,
        tools,
        hasTools,
        locked,
        hasLock,
        configName
    };
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
        tokens: imported.hasTokens === false
            ? (Array.isArray(current.tokens) ? current.tokens : [])
            : mergeUniqueByKey(current.tokens, imported.tokens, (tokenDef) => tokenDef?.token || tokenDef?.id),
        nodes: imported.hasTreeData === false
            ? (Array.isArray(current.nodes) ? current.nodes : [])
            : mergeUniqueByKey(current.nodes, imported.nodes, (node) => node?.id),
        templates: imported.hasTreeData === false
            ? (Array.isArray(current.templates) ? current.templates : [])
            : mergeUniqueByKey(current.templates, imported.templates, (template) => template?.id),
        templateImages: imported.hasTemplateImages === false
            ? (Array.isArray(current.templateImages) ? current.templateImages : [])
            : mergeUniqueByKey(current.templateImages, imported.templateImages, (image) => image?.id),
        tools: imported.hasTools !== false && Array.isArray(imported.tools)
            ? mergeUniqueByKey(normalizeTools(current.tools), normalizeTools(imported.tools), (tool) => tool?.id)
            : normalizeTools(current.tools),
        chatGptPromptSettings: normalizeChatGptPromptSettings(
            imported.hasChatGptPromptSettings !== false && imported.chatGptPromptSettings?.templateInstruction
                ? imported.chatGptPromptSettings
                : current.chatGptPromptSettings
        )
    };
}
