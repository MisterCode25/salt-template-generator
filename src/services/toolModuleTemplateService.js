import { normalizeTemplate } from "../models/templateTreeModel.js";
import { loadTemplateTreeData, saveTemplateTreeData } from "./templateTreeService.js";
import {
    moveTemplateToNodeAtIndex,
    updateTemplate
} from "../utils/templateTreeOperations.js";

const TEMPLATE_PATCH_FIELDS = new Set([
    "title",
    "description",
    "channels",
    "contentByChannel",
    "favorite",
    "nodeIds",
    "parentNodeId",
    "order"
]);

function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
}

function asArray(value) {
    if (Array.isArray(value)) return value;
    return value === undefined || value === null || value === "" ? [] : [value];
}

function normalizeText(value = "") {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function buildNodeLookup(nodes = []) {
    return new Map(nodes.map((node) => [node.id, node]));
}

function buildNodePath(node, nodeLookup) {
    if (!node) return "";
    const parts = [];
    const seen = new Set();
    let current = node;
    while (current && !seen.has(current.id)) {
        seen.add(current.id);
        parts.unshift(current.title || current.id);
        current = current.parentId ? nodeLookup.get(current.parentId) : null;
    }
    return parts.join(" / ");
}

function decorateNodes(nodes = []) {
    const nodeLookup = buildNodeLookup(nodes);
    return nodes.map((node) => ({
        ...node,
        path: buildNodePath(node, nodeLookup)
    }));
}

function findNodeByReference(nodes = [], ref) {
    const text = String(ref || "").trim();
    if (!text) return null;
    const nodeLookup = buildNodeLookup(nodes);
    if (nodeLookup.has(text)) return nodeLookup.get(text);
    const normalized = normalizeText(text);
    return nodes.find((node) => (
        normalizeText(node.title) === normalized
        || normalizeText(buildNodePath(node, nodeLookup)) === normalized
    )) || null;
}

function resolveRuleSourceNode(nodes = [], rule = {}) {
    return findNodeByReference(
        nodes,
        rule.fromNodeId
            || rule.sourceNodeId
            || rule.fromTopicId
            || rule.sourceTopicId
            || rule.fromNode
            || rule.sourceNode
            || rule.fromTopic
            || rule.sourceTopic
    );
}

function resolveRuleTargetNode(nodes = [], rule = {}) {
    return findNodeByReference(
        nodes,
        rule.toNodeId
            || rule.targetNodeId
            || rule.toTopicId
            || rule.targetTopicId
            || rule.toNode
            || rule.targetNode
            || rule.toTopic
            || rule.targetTopic
    );
}

function templateMatchesRule(template, rule = {}, sourceNode = null) {
    const templateIds = asArray(rule.templateIds || rule.templateId).map(String).filter(Boolean);
    if (templateIds.length > 0 && !templateIds.includes(template.id)) return false;

    if (sourceNode && !(template.nodeIds || []).includes(sourceNode.id)) return false;

    const channels = asArray(rule.channels || rule.channel).map((channel) => String(channel || "").trim()).filter(Boolean);
    if (channels.length > 0 && !channels.some((channel) => (template.channels || []).includes(channel))) return false;

    const exactTitle = String(rule.title || rule.templateTitle || "").trim();
    if (exactTitle && normalizeText(template.title) !== normalizeText(exactTitle)) return false;

    const titleIncludes = asArray(rule.titleIncludes || rule.templateTitleIncludes)
        .map(normalizeText)
        .filter(Boolean);
    if (titleIncludes.length > 0) {
        const title = normalizeText(template.title);
        if (!titleIncludes.some((needle) => title.includes(needle))) return false;
    }

    return true;
}

function buildMoveOperation({ template, sourceNode, targetNode, reason = "" }) {
    return {
        action: "moveTemplate",
        templateId: template.id,
        templateTitle: template.title || "",
        sourceNodeId: sourceNode?.id || null,
        sourceNodeTitle: sourceNode?.title || "",
        targetNodeId: targetNode.id,
        targetNodeTitle: targetNode.title || "",
        reason
    };
}

function summarizeTree({ nodes = [], templates = [] } = {}) {
    return {
        nodes: decorateNodes(nodes),
        templates: clone(templates),
        counts: {
            nodes: nodes.length,
            templates: templates.length
        }
    };
}

function normalizeTemplatePatch(patch = {}) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
        throw new Error("Template patch must be an object.");
    }

    const next = {};
    Object.entries(patch).forEach(([key, value]) => {
        if (TEMPLATE_PATCH_FIELDS.has(key)) next[key] = value;
    });
    return next;
}

export async function listTemplatesForModule() {
    return summarizeTree(await loadTemplateTreeData());
}

export async function getTemplateTreeForModule() {
    return listTemplatesForModule();
}

export async function previewTemplateMigrationForModule(rules = []) {
    const normalizedRules = asArray(rules);
    const { nodes, templates } = await loadTemplateTreeData();
    const operations = [];
    const skipped = [];

    normalizedRules.forEach((rule, ruleIndex) => {
        if (!rule || typeof rule !== "object" || Array.isArray(rule)) {
            skipped.push({ ruleIndex, reason: "Rule must be an object." });
            return;
        }

        const targetNode = resolveRuleTargetNode(nodes, rule);
        if (!targetNode) {
            skipped.push({ ruleIndex, reason: "Target topic was not found." });
            return;
        }

        const sourceNode = resolveRuleSourceNode(nodes, rule);
        const matches = templates.filter((template) => templateMatchesRule(template, rule, sourceNode));
        if (matches.length === 0) {
            skipped.push({ ruleIndex, reason: "No templates matched this rule." });
            return;
        }

        matches.forEach((template) => {
            if ((template.nodeIds || [])[0] === targetNode.id && (!sourceNode || sourceNode.id === targetNode.id)) return;
            operations.push(buildMoveOperation({
                template,
                sourceNode,
                targetNode,
                reason: rule.reason || `Rule ${ruleIndex + 1}`
            }));
        });
    });

    return {
        ok: true,
        ruleCount: normalizedRules.length,
        operationCount: operations.length,
        affectedTemplateCount: new Set(operations.map((operation) => operation.templateId)).size,
        operations,
        skipped
    };
}

export async function applyTemplateMigrationForModule(operations = []) {
    const normalizedOperations = asArray(operations);
    const treeData = await loadTemplateTreeData();
    let nodes = treeData.nodes;
    let templates = treeData.templates;
    const applied = [];
    const skipped = [];

    normalizedOperations.forEach((operation, operationIndex) => {
        const action = operation?.action || operation?.type;
        if (!operation || typeof operation !== "object" || Array.isArray(operation)) {
            skipped.push({ operationIndex, reason: "Operation must be an object." });
            return;
        }

        if (action === "moveTemplate") {
            const templateId = String(operation.templateId || "");
            const targetNodeId = String(operation.targetNodeId || operation.toNodeId || "");
            if (!templateId || !targetNodeId) {
                skipped.push({ operationIndex, reason: "moveTemplate requires templateId and targetNodeId." });
                return;
            }
            const template = templates.find((candidate) => candidate.id === templateId);
            const sourceNodeId = operation.sourceNodeId || template?.nodeIds?.[0] || null;
            const before = JSON.stringify(templates);
            templates = moveTemplateToNodeAtIndex(
                templates,
                templateId,
                sourceNodeId,
                targetNodeId,
                Number(operation.targetIndex),
                nodes
            );
            if (JSON.stringify(templates) !== before) applied.push({ operationIndex, action, templateId, targetNodeId });
            return;
        }

        if (action === "updateTemplate") {
            const templateId = String(operation.templateId || "");
            if (!templateId) {
                skipped.push({ operationIndex, reason: "updateTemplate requires templateId." });
                return;
            }
            const patch = normalizeTemplatePatch(operation.patch || operation.fields || {});
            const before = JSON.stringify(templates);
            templates = updateTemplate(templates, templateId, patch);
            if (JSON.stringify(templates) !== before) applied.push({ operationIndex, action, templateId });
            return;
        }

        skipped.push({ operationIndex, reason: `Unsupported operation: ${action || "unknown"}.` });
    });

    if (applied.length > 0) {
        await saveTemplateTreeData({ nodes, templates });
    }

    return {
        ok: true,
        appliedCount: applied.length,
        skippedCount: skipped.length,
        applied,
        skipped,
        tree: summarizeTree({ nodes, templates })
    };
}

export async function updateTemplateForModule(templateId, patch = {}) {
    const id = String(templateId || "");
    if (!id) throw new Error("templateId is required.");

    const treeData = await loadTemplateTreeData();
    if (!treeData.templates.some((template) => template.id === id)) {
        throw new Error("Template was not found.");
    }

    const nextTemplates = updateTemplate(treeData.templates, id, normalizeTemplatePatch(patch));
    await saveTemplateTreeData({ nodes: treeData.nodes, templates: nextTemplates });
    return {
        ok: true,
        template: clone(nextTemplates.find((template) => template.id === id))
    };
}

export async function moveTemplateForModule(templateId, targetNodeId, options = {}) {
    const id = String(templateId || "");
    const target = String(targetNodeId || "");
    if (!id || !target) throw new Error("templateId and targetNodeId are required.");

    const treeData = await loadTemplateTreeData();
    if (!treeData.templates.some((template) => template.id === id)) {
        throw new Error("Template was not found.");
    }
    const template = treeData.templates.find((candidate) => candidate.id === id);
    const sourceNodeId = options?.sourceNodeId || template?.nodeIds?.[0] || null;

    const nextTemplates = moveTemplateToNodeAtIndex(
        treeData.templates,
        id,
        sourceNodeId,
        target,
        Number(options?.targetIndex),
        treeData.nodes
    );
    await saveTemplateTreeData({ nodes: treeData.nodes, templates: nextTemplates });
    return {
        ok: true,
        template: clone(normalizeTemplate(nextTemplates.find((template) => template.id === id)))
    };
}

export async function handleToolModuleTemplateRequest(type, payload = {}) {
    switch (type) {
        case "tool:templates:list":
            return listTemplatesForModule();
        case "tool:templates:get-tree":
            return getTemplateTreeForModule();
        case "tool:templates:preview-migration":
            return previewTemplateMigrationForModule(payload.rules || payload);
        case "tool:templates:apply-migration":
            return applyTemplateMigrationForModule(payload.operations || payload);
        case "tool:templates:update-template":
            return updateTemplateForModule(payload.templateId, payload.patch || payload.fields || {});
        case "tool:templates:move-template":
            return moveTemplateForModule(payload.templateId, payload.targetNodeId, payload.options || {});
        default:
            throw new Error("Unsupported template module request.");
    }
}
