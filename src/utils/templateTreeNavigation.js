import { CHANNEL_VALUES } from "../models/templateTreeModel.js";
import { getChildNodes, getTemplatesForNode } from "./templateTreeOperations.js";

const nodeLookupCache = typeof WeakMap !== "undefined" ? new WeakMap() : null;

function normalizeNeedle(value) {
    return String(value || "").trim().toLowerCase();
}

function buildSearchText(values = []) {
    return values
        .map(normalizeNeedle)
        .filter(Boolean)
        .join(" ");
}

export function getNodePath(nodes = [], nodeId) {
    let byId = nodeLookupCache?.get(nodes);
    if (!byId) {
        byId = new Map(nodes.map((node) => [node.id, node]));
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
    return {
        childCount: getChildNodes(nodes, nodeId).length,
        templateCount: getTemplatesForNode(templates, nodeId).length
    };
}

export function buildTemplateTreeSearchIndex(nodes = [], templates = []) {
    return {
        nodes: nodes.map((node) => ({
            item: node,
            searchText: buildSearchText([node.title, node.description])
        })),
        templates: templates.map((template) => ({
            item: template,
            searchText: buildSearchText([
                template.title,
                template.description,
                ...(Array.isArray(template.channels) ? template.channels : [])
            ])
        }))
    };
}

export function searchTemplateTreeIndex(index = {}, query = "") {
    const needle = normalizeNeedle(query);
    if (!needle) return { nodes: [], templates: [] };

    const nodes = [];
    const templates = [];

    (index.nodes || []).forEach((entry) => {
        if (entry.searchText.includes(needle)) nodes.push(entry.item);
    });
    (index.templates || []).forEach((entry) => {
        if (entry.searchText.includes(needle)) templates.push(entry.item);
    });

    return { nodes, templates };
}

export function searchTemplateTree(nodes = [], templates = [], query = "") {
    return searchTemplateTreeIndex(buildTemplateTreeSearchIndex(nodes, templates), query);
}
