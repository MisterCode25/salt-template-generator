import { CHANNEL_VALUES } from "../models/templateTreeModel.js";
import { getChildNodes, getTemplatesForNode } from "./templateTreeOperations.js";

function normalizeNeedle(value) {
    return String(value || "").trim().toLowerCase();
}

function includesNeedle(value, query) {
    const needle = normalizeNeedle(query);
    if (!needle) return true;
    return normalizeNeedle(value).includes(needle);
}

export function getNodePath(nodes = [], nodeId) {
    const byId = new Map(nodes.map((node) => [node.id, node]));
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
    if (!template?.parentNodeId) return [];
    return getNodePath(nodes, template.parentNodeId);
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

export function searchTemplateTree(nodes = [], templates = [], query = "") {
    const needle = normalizeNeedle(query);
    if (!needle) return { nodes: [], templates: [] };

    return {
        nodes: nodes.filter((node) =>
            includesNeedle(node.title, needle)
            || includesNeedle(node.description, needle)
        ),
        templates: templates.filter((template) =>
            includesNeedle(template.title, needle)
            || includesNeedle(template.description, needle)
            || template.channels.some((channel) => includesNeedle(channel, needle))
        )
    };
}
