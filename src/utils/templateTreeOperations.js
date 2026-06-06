import { createNode, createTemplate, normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";

function normalizeParentId(parentId) {
    return typeof parentId === "string" && parentId.length > 0 ? parentId : null;
}

function sortByOrderThenTitle(a, b) {
    const orderDelta = (a.order || 0) - (b.order || 0);
    if (orderDelta !== 0) return orderDelta;
    return (a.title || "").localeCompare(b.title || "");
}

function sortByTitle(a, b) {
    const orderDelta = (a.order || 0) - (b.order || 0);
    if (orderDelta !== 0) return orderDelta;
    return (a.title || "").localeCompare(b.title || "");
}

export function getChildNodes(nodes = [], parentId = null) {
    const normalizedParentId = normalizeParentId(parentId);
    return [...nodes]
        .filter((node) => normalizeParentId(node.parentId) === normalizedParentId)
        .sort(sortByOrderThenTitle);
}

export function getNextNodeOrder(nodes = [], parentId = null) {
    const siblings = getChildNodes(nodes, parentId);
    if (siblings.length === 0) return 1;
    return Math.max(...siblings.map((node) => node.order || 0)) + 1;
}

export function getDescendantNodeIds(nodes = [], nodeId) {
    if (!nodeId) return [];

    const childrenByParent = new Map();
    nodes.forEach((node) => {
        const parentId = normalizeParentId(node.parentId);
        if (!parentId) return;
        const children = childrenByParent.get(parentId) || [];
        children.push(node.id);
        childrenByParent.set(parentId, children);
    });

    const descendants = [];
    const stack = [...(childrenByParent.get(nodeId) || [])];
    while (stack.length > 0) {
        const currentId = stack.pop();
        descendants.push(currentId);
        stack.push(...(childrenByParent.get(currentId) || []));
    }
    return descendants;
}

export function canMoveNode(nodes = [], nodeId, parentId = null) {
    const normalizedParentId = normalizeParentId(parentId);
    if (!nodeId || nodeId === normalizedParentId) return false;
    if (normalizedParentId && !nodes.some((node) => node.id === normalizedParentId)) return false;
    return !getDescendantNodeIds(nodes, nodeId).includes(normalizedParentId);
}

export function createNodeForParent(nodes = [], parentId = null, fields = {}) {
    const normalizedParentId = normalizeParentId(parentId);
    return createNode({
        ...fields,
        parentId: normalizedParentId,
        order: getNextNodeOrder(nodes, normalizedParentId)
    });
}

export function updateNode(nodes = [], nodeId, fields = {}) {
    return nodes.map((node) => (
        node.id === nodeId
            ? normalizeNode({ ...node, ...fields, id: node.id })
            : normalizeNode(node)
    ));
}

export function moveNode(nodes = [], nodeId, parentId = null) {
    const normalizedParentId = normalizeParentId(parentId);
    if (!canMoveNode(nodes, nodeId, normalizedParentId)) {
        throw new Error("Invalid node move");
    }

    const nextOrder = getNextNodeOrder(nodes.filter((node) => node.id !== nodeId), normalizedParentId);
    return nodes.map((node) => (
        node.id === nodeId
            ? normalizeNode({ ...node, parentId: normalizedParentId, order: nextOrder })
            : normalizeNode(node)
    ));
}

export function reorderNode(nodes = [], nodeId, direction) {
    const node = nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return nodes.map(normalizeNode);

    const siblings = getChildNodes(nodes, node.parentId);
    const currentIndex = siblings.findIndex((candidate) => candidate.id === nodeId);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex === -1 || targetIndex < 0 || targetIndex >= siblings.length) {
        return nodes.map(normalizeNode);
    }

    const reordered = [...siblings];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    const orderById = new Map(reordered.map((candidate, index) => [candidate.id, index + 1]));

    return nodes.map((candidate) => (
        orderById.has(candidate.id)
            ? normalizeNode({ ...candidate, order: orderById.get(candidate.id) })
            : normalizeNode(candidate)
    ));
}

export function removeNodeCascade(nodes = [], templates = [], nodeId) {
    const removedNodeIds = new Set([nodeId, ...getDescendantNodeIds(nodes, nodeId)]);
    return {
        nodes: nodes.filter((node) => !removedNodeIds.has(node.id)).map(normalizeNode),
        templates: templates
            .filter((template) => !removedNodeIds.has(template.parentNodeId))
            .map(normalizeTemplate)
    };
}

export function getTemplatesForNode(templates = [], nodeId) {
    return templates
        .filter((template) => template.parentNodeId === nodeId)
        .map(normalizeTemplate)
        .sort(sortByTitle);
}

export function createTemplateForNode(parentNodeId, fields = {}) {
    return createTemplate({
        ...fields,
        parentNodeId
    });
}

export function updateTemplate(templates = [], templateId, fields = {}) {
    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, ...fields, id: template.id })
            : normalizeTemplate(template)
    ));
}

export function moveTemplateToNode(templates = [], templateId, parentNodeId, nodes = []) {
    if (!nodes.some((node) => node.id === parentNodeId)) {
        throw new Error("Template target node does not exist");
    }

    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, parentNodeId })
            : normalizeTemplate(template)
    ));
}

export function duplicateTemplate(templates = [], templateId) {
    const template = templates.find((candidate) => candidate.id === templateId);
    if (!template) return templates.map(normalizeTemplate);

    const title = `${template.title || "Untitled template"} copy`;
    const contentByChannel = Object.fromEntries(
        Object.entries(template.contentByChannel || {}).map(([channel, content]) => [
            channel,
            {
                ...content,
                id: undefined,
                title,
                variants: Array.isArray(content.variants)
                    ? content.variants.map((variant) => ({ ...variant, id: undefined }))
                    : []
            }
        ])
    );

    const copy = createTemplate({
        parentNodeId: template.parentNodeId,
        title,
        description: template.description,
        channels: template.channels,
        order: (template.order || 0) + 1,
        contentByChannel
    });
    return [...templates.map(normalizeTemplate), copy];
}

export function removeTemplate(templates = [], templateId) {
    return templates
        .filter((template) => template.id !== templateId)
        .map(normalizeTemplate);
}
