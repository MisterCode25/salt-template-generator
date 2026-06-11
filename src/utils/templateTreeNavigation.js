import { CHANNEL_VALUES } from "../models/templateTreeModel.js";
import { buildNodeLookup } from "./templateTreeOperations.js";

const nodeLookupCache = typeof WeakMap !== "undefined" ? new WeakMap() : null;

function normalizeParentId(parentId) {
    return typeof parentId === "string" && parentId.length > 0 ? parentId : null;
}

function normalizeNeedle(value) {
    return String(value || "").trim().toLowerCase();
}

function appendSearchText(text, value) {
    const normalized = normalizeNeedle(value);
    if (!normalized) return text;
    return text ? `${text} ${normalized}` : normalized;
}

function buildNodeSearchText(node) {
    let text = appendSearchText("", node.title);
    text = appendSearchText(text, node.description);
    return text;
}

function buildTemplateSearchText(template) {
    let text = appendSearchText("", template.title);
    text = appendSearchText(text, template.description);

    if (Array.isArray(template.channels)) {
        for (const channel of template.channels) {
            text = appendSearchText(text, channel);
        }
    }

    return text;
}

export function getNodePath(nodes = [], nodeId) {
    let byId = nodeLookupCache?.get(nodes);
    if (!byId) {
        byId = buildNodeLookup(nodes);
        nodeLookupCache?.set(nodes, byId);
    }
    const path = [];
    const seen = new Set();
    let current = byId.get(nodeId);

    while (current && !seen.has(current.id)) {
        path.unshift(current);
        seen.add(current.id);
        current = current.parentId ? byId.get(current.parentId) : null;
    }

    return path;
}

export function getTemplatePath(nodes = [], template) {
    const nodeId = template?.parentNodeId || template?.nodeIds?.[0];
    if (!nodeId) return [];
    return getNodePath(nodes, nodeId);
}

export function resolveChannelModel(treeTemplate, channel) {
    if (!treeTemplate || !CHANNEL_VALUES.includes(channel)) return null;
    return treeTemplate.contentByChannel?.[channel] || null;
}

export function getAvailableTemplateChannels(treeTemplate) {
    if (!treeTemplate) return [];
    return CHANNEL_VALUES.filter((channel) =>
        treeTemplate.channels.includes(channel)
        || Boolean(resolveChannelModel(treeTemplate, channel))
    );
}

export function getNodeCardSummary(nodes = [], templates = [], nodeId) {
    const normalizedNodeId = normalizeParentId(nodeId);
    let childCount = 0;
    let templateCount = 0;

    for (const node of nodes) {
        if (normalizeParentId(node.parentId) === normalizedNodeId) childCount += 1;
    }

    for (const template of templates) {
        if (Array.isArray(template.nodeIds) && template.nodeIds.includes(nodeId)) {
            templateCount += 1;
        }
    }

    return {
        childCount,
        templateCount
    };
}

export function buildTemplateTreeSearchIndex(nodes = [], templates = []) {
    const nodeIndex = [];
    const templateIndex = [];

    for (const node of nodes) {
        nodeIndex.push({
            item: node,
            searchText: buildNodeSearchText(node)
        });
    }

    for (const template of templates) {
        templateIndex.push({
            item: template,
            searchText: buildTemplateSearchText(template)
        });
    }

    return {
        nodes: nodeIndex,
        templates: templateIndex
    };
}

export function searchTemplateTreeIndex(index = {}, query = "") {
    const needle = normalizeNeedle(query);
    if (!needle) return { nodes: [], templates: [] };

    const nodes = [];
    const templates = [];

    for (const entry of index.nodes || []) {
        if (entry.searchText.includes(needle)) nodes.push(entry.item);
    }
    for (const entry of index.templates || []) {
        if (entry.searchText.includes(needle)) templates.push(entry.item);
    }

    return { nodes, templates };
}

export function searchTemplateTree(nodes = [], templates = [], query = "") {
    return searchTemplateTreeIndex(buildTemplateTreeSearchIndex(nodes, templates), query);
}
