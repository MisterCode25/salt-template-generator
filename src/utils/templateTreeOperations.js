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

function clampInsertIndex(index, length) {
    if (!Number.isFinite(index)) return length;
    return Math.max(0, Math.min(length, index));
}

export function getChildNodes(nodes = [], parentId = null) {
    const normalizedParentId = normalizeParentId(parentId);
    const children = [];
    for (const node of nodes) {
        if (normalizeParentId(node.parentId) === normalizedParentId) children.push(node);
    }
    children.sort(sortByOrderThenTitle);
    return children;
}

export function buildNodeLookup(nodes = []) {
    const lookup = new Map();
    for (const node of nodes) {
        lookup.set(node.id, node);
    }
    return lookup;
}

export function buildNodeChildrenIndex(nodes = []) {
    const childrenByParent = new Map();

    for (const node of nodes) {
        const normalizedParentId = normalizeParentId(node.parentId);
        let children = childrenByParent.get(normalizedParentId);
        if (!children) {
            children = [];
            childrenByParent.set(normalizedParentId, children);
        }
        children.push(node);
    }

    childrenByParent.forEach((children) => {
        children.sort(sortByOrderThenTitle);
    });

    return childrenByParent;
}

export function getIndexedChildNodes(childrenByParent, parentId = null) {
    return childrenByParent?.get(normalizeParentId(parentId)) || [];
}

export function getNextNodeOrder(nodes = [], parentId = null, excludedNodeId = null) {
    const normalizedParentId = normalizeParentId(parentId);
    let maxOrder = 0;
    for (const node of nodes) {
        if (node.id === excludedNodeId) continue;
        if (normalizeParentId(node.parentId) !== normalizedParentId) continue;
        if ((node.order || 0) > maxOrder) maxOrder = node.order || 0;
    }
    return maxOrder + 1;
}

function getDescendantNodeIdSet(nodes = [], nodeId) {
    if (!nodeId) return new Set();

    const childrenByParent = new Map();
    for (const node of nodes) {
        const parentId = normalizeParentId(node.parentId);
        if (!parentId) continue;
        let children = childrenByParent.get(parentId);
        if (!children) {
            children = [];
            childrenByParent.set(parentId, children);
        }
        children.push(node.id);
    }

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
    if (normalizedParentId && !nodeExists(nodes, normalizedParentId)) return false;
    return !getDescendantNodeIdSet(nodes, nodeId).has(normalizedParentId);
}

function nodeExists(nodes = [], nodeId) {
    for (const node of nodes) {
        if (node.id === nodeId) return true;
    }
    return false;
}

export function createNodeForParent(nodes = [], parentId = null, fields = {}, templates = []) {
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
            : node
    ));
}

export function moveNode(nodes = [], nodeId, parentId = null) {
    const normalizedParentId = normalizeParentId(parentId);
    if (!canMoveNode(nodes, nodeId, normalizedParentId)) {
        throw new Error("Invalid node move");
    }

    const nextOrder = getNextNodeOrder(nodes, normalizedParentId, nodeId);
    return nodes.map((node) => (
        node.id === nodeId
            ? normalizeNode({ ...node, parentId: normalizedParentId, order: nextOrder })
            : node
    ));
}

export function moveNodeToParentAtIndex(nodes = [], nodeId, parentId = null, targetIndex = 0) {
    const normalizedParentId = normalizeParentId(parentId);
    const node = nodes.find((candidate) => candidate.id === nodeId);
    if (!node || !canMoveNode(nodes, nodeId, normalizedParentId)) {
        throw new Error("Invalid node move");
    }

    const targetSiblings = getChildNodes(nodes, normalizedParentId)
        .filter((candidate) => candidate.id !== nodeId);
    const insertIndex = clampInsertIndex(targetIndex, targetSiblings.length);
    const orderedSiblingIds = targetSiblings.map((candidate) => candidate.id);
    orderedSiblingIds.splice(insertIndex, 0, nodeId);

    const orderById = new Map();
    for (let index = 0; index < orderedSiblingIds.length; index++) {
        orderById.set(orderedSiblingIds[index], index + 1);
    }

    return nodes.map((candidate) => (
        orderById.has(candidate.id)
            ? normalizeNode({
                ...candidate,
                parentId: candidate.id === nodeId ? normalizedParentId : candidate.parentId,
                order: orderById.get(candidate.id)
            })
            : normalizeNode(candidate)
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
    const orderById = new Map();
    for (let index = 0; index < reordered.length; index++) {
        orderById.set(reordered[index].id, index + 1);
    }

    return nodes.map((candidate) => (
        orderById.has(candidate.id)
            ? normalizeNode({ ...candidate, order: orderById.get(candidate.id) })
            : candidate
    ));
}

export function removeNodeCascade(nodes = [], templates = [], nodeId) {
    const removedNodeIds = getDescendantNodeIdSet(nodes, nodeId);
    removedNodeIds.add(nodeId);
    const nextTemplates = [];
    for (const template of templates) {
        const currentNodeIds = template.nodeIds || [];
        const nextNodeIds = [];
        for (const id of currentNodeIds) {
            if (!removedNodeIds.has(id)) nextNodeIds.push(id);
        }
        if (nextNodeIds.length === 0) continue;
        nextTemplates.push(nextNodeIds.length === currentNodeIds.length
            ? template
            : normalizeTemplate({ ...template, nodeIds: nextNodeIds }));
    }

    const nextNodes = [];
    for (const node of nodes) {
        if (!removedNodeIds.has(node.id)) nextNodes.push(node);
    }

    return {
        nodes: nextNodes,
        templates: nextTemplates
    };
}

export function nodeHasChildren(nodes = [], nodeId) {
    for (const node of nodes) {
        if (normalizeParentId(node.parentId) === nodeId) return true;
    }
    return false;
}

export function nodeHasTemplates(templates = [], nodeId) {
    for (const template of templates) {
        if (templateHasNode(template, nodeId)) return true;
    }
    return false;
}

export function getTemplatesForNode(templates = [], nodeId) {
    const nodeTemplates = [];
    for (const template of templates) {
        if (templateHasNode(template, nodeId)) nodeTemplates.push(normalizeTemplate(template));
    }
    nodeTemplates.sort(sortByTitle);
    return nodeTemplates;
}

export function buildTemplateNodeIndex(templates = []) {
    const templatesByNode = new Map();

    for (const template of templates) {
        const normalizedTemplate = normalizeTemplate(template);
        for (const nodeId of normalizedTemplate.nodeIds) {
            let nodeTemplates = templatesByNode.get(nodeId);
            if (!nodeTemplates) {
                nodeTemplates = [];
                templatesByNode.set(nodeId, nodeTemplates);
            }
            nodeTemplates.push(normalizedTemplate);
        }
    }

    templatesByNode.forEach((nodeTemplates) => {
        nodeTemplates.sort(sortByTitle);
    });

    return templatesByNode;
}

export function getIndexedTemplatesForNode(templatesByNode, nodeId) {
    return templatesByNode?.get(nodeId) || [];
}

export function createTemplateForNode(nodeId, fields = {}, nodes = [], templates = []) {
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
    if (!nodeExists(nodes, targetNodeId)) {
        throw new Error("Template target node does not exist");
    }

    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, nodeIds: movePrimaryNodeId(template.nodeIds || [], targetNodeId) })
            : template
    ));
}

export function moveTemplateToNodeAtIndex(
    templates = [],
    templateId,
    sourceNodeId,
    targetNodeId,
    targetIndex = 0,
    nodes = []
) {
    if (!nodeExists(nodes, targetNodeId)) {
        throw new Error("Template target node does not exist");
    }

    const template = templates.find((candidate) => candidate.id === templateId);
    if (!template) return templates.map(normalizeTemplate);

    const targetTemplates = getTemplatesForNode(templates, targetNodeId)
        .filter((candidate) => candidate.id !== templateId);
    const insertIndex = clampInsertIndex(targetIndex, targetTemplates.length);
    const orderedTemplateIds = targetTemplates.map((candidate) => candidate.id);
    orderedTemplateIds.splice(insertIndex, 0, templateId);

    const orderById = new Map();
    for (let index = 0; index < orderedTemplateIds.length; index++) {
        orderById.set(orderedTemplateIds[index], index + 1);
    }

    let nextNodeIds = Array.isArray(template.nodeIds) ? [...template.nodeIds] : [];
    if (sourceNodeId && sourceNodeId !== targetNodeId) {
        nextNodeIds = removeNodeId(nextNodeIds, sourceNodeId);
    }
    nextNodeIds = appendUniqueNodeId(nextNodeIds, targetNodeId);
    if (nextNodeIds[0] !== targetNodeId) {
        nextNodeIds = [
            targetNodeId,
            ...nextNodeIds.filter((nodeId) => nodeId !== targetNodeId)
        ];
    }

    return templates.map((candidate) => {
        if (candidate.id === templateId) {
            return normalizeTemplate({
                ...candidate,
                nodeIds: nextNodeIds,
                order: orderById.get(candidate.id) || candidate.order || 0
            });
        }
        if (orderById.has(candidate.id)) {
            return normalizeTemplate({ ...candidate, order: orderById.get(candidate.id) });
        }
        return normalizeTemplate(candidate);
    });
}

export function linkTemplateToNode(templates = [], templateId, nodeId, nodes = []) {
    if (!nodeExists(nodes, nodeId)) {
        throw new Error("Template target node does not exist");
    }

    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, nodeIds: appendUniqueNodeId(template.nodeIds || [], nodeId) })
            : template
    ));
}

export function unlinkTemplateFromNode(templates = [], templateId, nodeId) {
    return templates.map((template) => (
        template.id === templateId
            ? normalizeTemplate({ ...template, nodeIds: removeNodeId(template.nodeIds || [], nodeId) })
            : template
    ));
}

function templateHasNode(template, nodeId) {
    if (!Array.isArray(template.nodeIds)) return false;
    for (const id of template.nodeIds) {
        if (id === nodeId) return true;
    }
    return false;
}

function movePrimaryNodeId(nodeIds = [], targetNodeId) {
    const nextNodeIds = [targetNodeId];
    const previousPrimaryNodeId = nodeIds[0];
    for (const id of nodeIds) {
        if (id !== previousPrimaryNodeId) nextNodeIds.push(id);
    }
    return nextNodeIds;
}

function appendUniqueNodeId(nodeIds = [], nodeId) {
    const nextNodeIds = [];
    let hasNode = false;
    for (const id of nodeIds) {
        if (id === nodeId) hasNode = true;
        nextNodeIds.push(id);
    }
    if (!hasNode) nextNodeIds.push(nodeId);
    return nextNodeIds;
}

function removeNodeId(nodeIds = [], nodeId) {
    const nextNodeIds = [];
    for (const id of nodeIds) {
        if (id !== nodeId) nextNodeIds.push(id);
    }
    return nextNodeIds;
}

export function duplicateTemplate(templates = [], templateId) {
    const template = templates.find((candidate) => candidate.id === templateId);
    if (!template) return templates.map(normalizeTemplate);

    const title = `${template.title || "Untitled template"} copy`;
    const contentByChannel = {};
    const sourceContentByChannel = template.contentByChannel || {};
    for (const channel in sourceContentByChannel) {
        if (!Object.prototype.hasOwnProperty.call(sourceContentByChannel, channel)) continue;
        const content = sourceContentByChannel[channel];
        const variants = [];
        if (Array.isArray(content.variants)) {
            for (const variant of content.variants) {
                variants.push({ ...variant, id: undefined });
            }
        }
        contentByChannel[channel] = {
            ...content,
            id: undefined,
            title,
            variants
        };
    }

    const copy = createTemplate({
        nodeIds: template.nodeIds || [],
        title,
        description: template.description,
        channels: template.channels,
        order: (template.order || 0) + 1,
        contentByChannel
    });
    return [...templates, copy];
}

export function removeTemplate(templates = [], templateId) {
    return templates.filter((template) => template.id !== templateId);
}
