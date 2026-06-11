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
    return nodes
        .filter((node) => normalizeParentId(node.parentId) === normalizedParentId)
        .sort(sortByOrderThenTitle);
}

export function buildNodeLookup(nodes = []) {
    return new Map(nodes.map((node) => [node.id, node]));
}

export function buildNodeChildrenIndex(nodes = []) {
    const childrenByParent = new Map();

    nodes.forEach((node) => {
        const normalizedParentId = normalizeParentId(node.parentId);
        const children = childrenByParent.get(normalizedParentId) || [];
        children.push(node);
        childrenByParent.set(normalizedParentId, children);
    });

    childrenByParent.forEach((children) => {
        children.sort(sortByOrderThenTitle);
    });

    return childrenByParent;
}

export function getIndexedChildNodes(childrenByParent, parentId = null) {
    return childrenByParent?.get(normalizeParentId(parentId)) || [];
}

export function getNextNodeOrder(nodes = [], parentId = null) {
    const siblings = getChildNodes(nodes, parentId);
    if (siblings.length === 0) return 1;
    let maxOrder = 0;
    siblings.forEach((node) => {
        maxOrder = Math.max(maxOrder, node.order || 0);
    });
    return maxOrder + 1;
}

function getDescendantNodeIdSet(nodes = [], nodeId) {
    if (!nodeId) return new Set();

    const childrenByParent = new Map();
    nodes.forEach((node) => {
        const parentId = normalizeParentId(node.parentId);
        if (!parentId) return;
        const children = childrenByParent.get(parentId) || [];
        children.push(node.id);
        childrenByParent.set(parentId, children);
    });

    const descendants = new Set();
    const stack = [...(childrenByParent.get(nodeId) || [])];
    while (stack.length > 0) {
        const currentId = stack.pop();
        if (descendants.has(currentId)) continue;
        descendants.add(currentId);
        stack.push(...(childrenByParent.get(currentId) || []));
    }
    return descendants;
}

export function getDescendantNodeIds(nodes = [], nodeId) {
    return Array.from(getDescendantNodeIdSet(nodes, nodeId));
}

export function canMoveNode(nodes = [], nodeId, parentId = null) {
    const normalizedParentId = normalizeParentId(parentId);
    if (!nodeId || nodeId === normalizedParentId) return false;
    if (normalizedParentId && !nodes.some((node) => node.id === normalizedParentId)) return false;
    return !getDescendantNodeIdSet(nodes, nodeId).has(normalizedParentId);
}

export function createNodeForParent(nodes = [], parentId = null, fields = {}, templates = []) {
    const normalizedParentId = normalizeParentId(parentId);
    if (normalizedParentId && nodeHasTemplates(templates, normalizedParentId)) {
        throw new Error("This node already has templates — a node can hold either sub-nodes or templates, not both.");
    }
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
            : node
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
            : node
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
            : candidate
    ));
}

export function removeNodeCascade(nodes = [], templates = [], nodeId) {
    const removedNodeIds = getDescendantNodeIdSet(nodes, nodeId);
    removedNodeIds.add(nodeId);
    const nextTemplates = templates
        .map((template) => {
            const nextNodeIds = (template.nodeIds || []).filter((id) => !removedNodeIds.has(id));
            return normalizeTemplate({ ...template, nodeIds: nextNodeIds });
        })
        .filter((template) => template.nodeIds.length > 0);
    return {
        nodes: nodes.filter((node) => !removedNodeIds.has(node.id)).map(normalizeNode),
        templates: nextTemplates
    };
}

export function nodeHasChildren(nodes = [], nodeId) {
    return nodes.some((node) => normalizeParentId(node.parentId) === nodeId);
}

export function nodeHasTemplates(templates = [], nodeId) {
    return templates.some((template) => Array.isArray(template.nodeIds) && template.nodeIds.includes(nodeId));
}

export function getTemplatesForNode(templates = [], nodeId) {
    return templates
        .filter((template) => Array.isArray(template.nodeIds) && template.nodeIds.includes(nodeId))
        .map(normalizeTemplate)
        .sort(sortByTitle);
}

export function buildTemplateNodeIndex(templates = []) {
    const templatesByNode = new Map();

    templates.forEach((template) => {
        const normalizedTemplate = normalizeTemplate(template);
        normalizedTemplate.nodeIds.forEach((nodeId) => {
            const nodeTemplates = templatesByNode.get(nodeId) || [];
            nodeTemplates.push(normalizedTemplate);
            templatesByNode.set(nodeId, nodeTemplates);
        });
    });

    templatesByNode.forEach((nodeTemplates) => {
        nodeTemplates.sort(sortByTitle);
    });

    return templatesByNode;
}

export function getIndexedTemplatesForNode(templatesByNode, nodeId) {
    return templatesByNode?.get(nodeId) || [];
}

export function createTemplateForNode(nodeId, fields = {}, nodes = [], templates = []) {
    if (nodeHasChildren(nodes, nodeId)) {
        throw new Error("This node has sub-nodes — only leaf nodes can hold templates.");
    }
    return createTemplate({
        ...fields,
        nodeIds: [nodeId]
    });
}

export function updateTemplate(templates = [], templateId, fields = {}) {
    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, ...fields, id: template.id })
            : template
    ));
}

export function moveTemplateToNode(templates = [], templateId, targetNodeId, nodes = []) {
    if (!nodes.some((node) => node.id === targetNodeId)) {
        throw new Error("Template target node does not exist");
    }

    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, nodeIds: [targetNodeId, ...(template.nodeIds || []).filter((id) => id !== template.nodeIds[0])] })
            : template
    ));
}

export function linkTemplateToNode(templates = [], templateId, nodeId, nodes = []) {
    if (!nodes.some((node) => node.id === nodeId)) {
        throw new Error("Template target node does not exist");
    }
    if (nodeHasChildren(nodes, nodeId)) {
        throw new Error("This node has sub-nodes — only leaf nodes can hold templates.");
    }

    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, nodeIds: [...new Set([...(template.nodeIds || []), nodeId])] })
            : template
    ));
}

export function unlinkTemplateFromNode(templates = [], templateId, nodeId) {
    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, nodeIds: (template.nodeIds || []).filter((id) => id !== nodeId) })
            : template
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
        nodeIds: template.nodeIds || [],
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
