import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";
import { loadJSON, saveJSON } from "./storageService.js";
import { CHANNEL_VALUES, normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";

export const TEMPLATE_NODE_KEY = "template_nodes";
export const NODE_TEMPLATE_KEY = "node_templates";

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
    return { nodes, templates };
}

export async function saveTemplateTreeData({ nodes = [], templates = [] } = {}) {
    await Promise.all([
        saveTemplateNodes(nodes),
        saveNodeTemplates(templates)
    ]);
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
