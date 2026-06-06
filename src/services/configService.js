import { normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";

const CONFIG_SCHEMA_VERSION = 2;

function computeConfigChecksum(serialized) {
    return Array.from(serialized).reduce((sum, ch) => (sum + ch.charCodeAt(0)) % 1000000007, 0);
}

function normalizeTreeData(treeData = {}) {
    return {
        nodes: Array.isArray(treeData.nodes) ? treeData.nodes.map(normalizeNode) : [],
        templates: Array.isArray(treeData.templates) ? treeData.templates.map(normalizeTemplate) : []
    };
}

export function buildConfigPayload(configName, tokens, treeData) {
    const { nodes, templates } = normalizeTreeData(treeData);
    const meta = {
        configName,
        schemaVersion: CONFIG_SCHEMA_VERSION,
        exportedAt: Date.now(),
        checksum: 0
    };
    const base = { meta, tokens, nodes, templates };
    const serialized = JSON.stringify({ ...base, meta: { ...meta, checksum: 0 } });
    meta.checksum = computeConfigChecksum(serialized);
    return {
        meta,
        tokens,
        nodes,
        templates,
        configName
    };
}

export function validateImportedConfig(raw = {}) {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Invalid file shape");
    }
    const tokens = Array.isArray(raw.tokens) ? raw.tokens : [];
    const hasTreeData = Array.isArray(raw.nodes) || Array.isArray(raw.templates);
    if (!hasTreeData && Array.isArray(raw.models)) {
        throw new Error("Legacy template configs are not supported");
    }

    const { nodes, templates } = normalizeTreeData(raw);
    const meta = raw.meta || {};
    const configName = meta.configName || raw.configName || "Imported configuration";

    if (meta.schemaVersion && meta.schemaVersion > CONFIG_SCHEMA_VERSION) {
        throw new Error("Unsupported version");
    }

    const serialized = JSON.stringify({
        meta: { ...meta, checksum: 0 },
        tokens,
        nodes,
        templates
    });
    if (meta.checksum !== undefined) {
        const computed = computeConfigChecksum(serialized);
        if (computed !== meta.checksum) {
            throw new Error("Checksum mismatch");
        }
    }

    return { tokens, nodes, templates, configName };
}
