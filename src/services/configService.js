const CONFIG_SCHEMA_VERSION = 1;

function computeConfigChecksum(serialized) {
    return Array.from(serialized).reduce((sum, ch) => (sum + ch.charCodeAt(0)) % 1000000007, 0);
}

export function buildConfigPayload(configName, tokens, models) {
    const meta = {
        configName,
        schemaVersion: CONFIG_SCHEMA_VERSION,
        exportedAt: Date.now(),
        checksum: 0
    };
    const base = { meta, tokens, models };
    const serialized = JSON.stringify({ ...base, meta: { ...meta, checksum: 0 } });
    meta.checksum = computeConfigChecksum(serialized);
    return {
        meta,
        tokens,
        models,
        configName
    };
}

export function validateImportedConfig(raw = {}) {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Invalid file shape");
    }
    const tokens = Array.isArray(raw.tokens) ? raw.tokens : [];
    const models = Array.isArray(raw.models) ? raw.models : [];
    const meta = raw.meta || {};
    const configName = meta.configName || raw.configName || "Imported configuration";

    if (meta.schemaVersion && meta.schemaVersion > CONFIG_SCHEMA_VERSION) {
        throw new Error("Unsupported version");
    }

    const serialized = JSON.stringify({
        meta: { ...meta, checksum: 0 },
        tokens,
        models
    });
    if (meta.checksum !== undefined) {
        const computed = computeConfigChecksum(serialized);
        if (computed !== meta.checksum) {
            throw new Error("Checksum mismatch");
        }
    }

    return { tokens, models, configName };
}

