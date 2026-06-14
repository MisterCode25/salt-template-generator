export const TOOL_MODULE_API_VERSION = "template-tool-module-beta-1";

export const TOOL_MODULE_API_REFERENCE = Object.freeze({
    name: "Template Generator Module API",
    version: TOOL_MODULE_API_VERSION,
    globals: {
        TemplateTool: {
            type: "object",
            description: "Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."
        },
        TemplateVars: {
            type: "object",
            description: "Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."
        },
        TemplateEnv: {
            type: "object",
            description: "Execution metadata for the current module."
        },
        TemplateFields: {
            type: "array",
            description: "Normalized visible fields available to the module."
        },
        TemplateContext: {
            type: "object",
            description: "Full runtime context returned by TemplateTool.getContext()."
        },
        TemplateAPI: {
            type: "object",
            description: "Static API reference exposed inside every module."
        }
    },
    variables: {
        access: "await TemplateTool.getContext(); then read window.TemplateVars",
        examples: [
            "TemplateVars.clientName",
            "TemplateVars.mobile",
            "TemplateVars.contractor",
            "TemplateVars.activationDate",
            "TemplateVars.otoId",
            "TemplateVars.byToken['{client_first_name}']",
            "TemplateVars.byKey['client.firstName']",
            "TemplateVars.byLabel['Full name']"
        ],
        reservedContainers: ["env", "raw", "byToken", "byKey", "byLabel"]
    },
    contextShape: {
        apiVersion: "string",
        tool: "{ id: string, title: string, description: string }",
        environment: "{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",
        variables: "TemplateVars object",
        values: "token values plus compatibility aliases",
        tokenValues: "original token-keyed values",
        tokens: "Array<{ token, label, key, inputType, value, internal, aliases }>",
        fields: "Array<{ label, value, source, token, key, section, aliases }>",
        fieldIndex: "normalized lookup object",
        client: "raw imported client payload or null",
        clientInfo: "visible client detail sections",
        clientSummary: "compact client bar fields",
        generatedAt: "ISO timestamp"
    },
    functions: {
        "TemplateTool.getContext()": "Promise<TemplateContext>",
        "TemplateTool.getVars()": "Promise<TemplateVars>",
        "TemplateTool.getVar(name, fallback = '')": "Promise<string>",
        "TemplateTool.hasVariable(name)": "Promise<boolean>",
        "TemplateTool.listVariables()": "Promise<string[]>",
        "TemplateTool.findField(candidates)": "Promise<Field|null>",
        "TemplateTool.getFieldValue(candidates, fallback = '')": "Promise<string>",
        "TemplateTool.copyText(text, message)": "Promise<{ ok: boolean }>",
        "TemplateTool.copyHtml(html, message)": "Promise<{ ok: boolean }>",
        "TemplateTool.toast(message, variant)": "Promise<{ ok: boolean }>",
        "TemplateTool.openUrl(url)": "Promise<{ ok: boolean }>",
        "TemplateTool.close()": "void",
        "TemplateTool.requestResize()": "void",
        "TemplateTool.onContext(callback)": "unsubscribe function",
        "TemplateTool.describeApi()": "TemplateAPI reference"
    }
});

export function formatToolModuleApiReferenceForPrompt(api = TOOL_MODULE_API_REFERENCE) {
    const lines = [
        `${api.name} (${api.version})`,
        "",
        "Globals:"
    ];

    Object.entries(api.globals || {}).forEach(([name, detail]) => {
        lines.push(`- window.${name}: ${detail.description}`);
    });

    lines.push("", "Variable access:", `- ${api.variables.access}`);
    (api.variables.examples || []).forEach((example) => {
        lines.push(`- ${example}`);
    });
    lines.push(`- Reserved TemplateVars containers: ${(api.variables.reservedContainers || []).join(", ")}`);

    lines.push("", "Context shape:");
    Object.entries(api.contextShape || {}).forEach(([name, detail]) => {
        lines.push(`- ${name}: ${detail}`);
    });

    lines.push("", "Functions:");
    Object.entries(api.functions || {}).forEach(([signature, detail]) => {
        lines.push(`- ${signature}: ${detail}`);
    });

    return lines.join("\n");
}

const TOOL_MODULE_HOST_STYLE = `
<style id="template-tool-host-style">
    :root {
        color-scheme: light;
    }

    html,
    body {
        min-width: 0;
        overflow-x: hidden;
        background: #ffffff;
    }

    body {
        margin: 0 !important;
        min-height: 0 !important;
    }

    body > .module:first-child,
    body > main.module:first-child,
    body > .template-tool-module:first-child,
    body > main.template-tool-module:first-child {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 12px !important;
        background: #ffffff !important;
    }

    body > .module:first-child > .card:first-child,
    body > main.module:first-child > .card:first-child,
    body > main.module:first-child > section.card:first-child,
    body > .template-tool-module:first-child > .card:first-child,
    body > main.template-tool-module:first-child > .card:first-child,
    body > main.template-tool-module:first-child > section.card:first-child {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
    }

    button,
    input,
    select,
    textarea {
        font: inherit;
    }

    img,
    svg,
    canvas,
    video {
        max-width: 100%;
    }
</style>`;

const TOOL_MODULE_BRIDGE = `
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${TOOL_MODULE_API_VERSION}";
    var apiReference = ${JSON.stringify(TOOL_MODULE_API_REFERENCE)};
    var requestId = 0;
    var pending = new Map();
    var cachedContext = null;
    var resizeTimer = 0;

    function post(type, payload, expectsResponse) {
        var id = "tool-" + Date.now() + "-" + (++requestId);
        window.parent.postMessage({
            source: "template-tool-module",
            type: type,
            requestId: id,
            payload: payload || {}
        }, "*");

        if (!expectsResponse) return Promise.resolve(null);
        return new Promise(function (resolve, reject) {
            pending.set(id, { resolve: resolve, reject: reject });
            window.setTimeout(function () {
                if (!pending.has(id)) return;
                pending.delete(id);
                reject(new Error("Tool host did not respond."));
            }, 5000);
        });
    }

    function normalizeLookupKey(value) {
        return String(value || "")
            .replace(/[{}]/g, "")
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .normalize("NFD")
            .replace(/[\\u0300-\\u036f]/g, "")
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "");
    }

    function fieldMatches(field, key) {
        if (!field || !key) return false;
        var aliases = field.aliases || [];
        if (normalizeLookupKey(field.label) === key) return true;
        if (normalizeLookupKey(field.token) === key) return true;
        if (normalizeLookupKey(field.key) === key) return true;
        for (var i = 0; i < aliases.length; i += 1) {
            if (normalizeLookupKey(aliases[i]) === key) return true;
        }
        return false;
    }

    function findFieldInContext(context, candidates) {
        var names = Array.isArray(candidates) ? candidates : [candidates];
        var fields = Array.isArray(context && context.fields) ? context.fields : [];
        var index = context && context.fieldIndex && typeof context.fieldIndex === "object"
            ? context.fieldIndex
            : {};

        for (var i = 0; i < names.length; i += 1) {
            var key = normalizeLookupKey(names[i]);
            if (!key) continue;
            if (index[key] && index[key].value !== undefined && index[key].value !== "") {
                return index[key];
            }
            for (var j = 0; j < fields.length; j += 1) {
                if (fieldMatches(fields[j], key) && fields[j].value !== "") return fields[j];
            }
        }
        return null;
    }

    function installContextGlobals(context) {
        var safeContext = context || {};
        window.TemplateAPI = apiReference;
        window.TemplateContext = safeContext;
        window.TemplateEnv = safeContext.environment || {
            apiVersion: safeContext.apiVersion || apiVersion,
            toolId: safeContext.tool && safeContext.tool.id || "",
            toolTitle: safeContext.tool && safeContext.tool.title || "",
            toolDescription: safeContext.tool && safeContext.tool.description || "",
            generatedAt: safeContext.generatedAt || ""
        };
        window.TemplateFields = Array.isArray(safeContext.fields) ? safeContext.fields : [];
        window.TemplateVars = safeContext.variables && typeof safeContext.variables === "object"
            ? safeContext.variables
            : {};
    }

    window.TemplateAPI = apiReference;

    function emitContext(context) {
        cachedContext = context || {};
        installContextGlobals(cachedContext);
        window.dispatchEvent(new CustomEvent("template-tool-context", { detail: cachedContext }));
        requestResize();
    }

    function measureHeight() {
        var doc = document.documentElement;
        var body = document.body;
        if (!doc && !body) return 0;

        var childBottom = 0;
        if (body && body.children) {
            for (var i = 0; i < body.children.length; i += 1) {
                var rect = body.children[i].getBoundingClientRect();
                childBottom = Math.max(childBottom, rect.bottom);
            }
        }

        var height = childBottom || Math.max(
            doc ? doc.scrollHeight : 0,
            doc ? doc.offsetHeight : 0,
            body ? body.scrollHeight : 0,
            body ? body.offsetHeight : 0
        );
        return Math.ceil(Math.min(Math.max(height || 0, 140), 1400));
    }

    function requestResize() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            var height = measureHeight();
            if (height) post("tool:resize", { height: height }, false);
        }, 30);
    }

    window.addEventListener("message", function (event) {
        var data = event.data || {};
        if (data.source !== "template-tool-host") return;

        if (data.type === "tool:context") {
            emitContext(data.payload || {});
            return;
        }

        if (!data.responseTo || !pending.has(data.responseTo)) return;
        var request = pending.get(data.responseTo);
        pending.delete(data.responseTo);
        if (data.error) {
            request.reject(new Error(data.error));
        } else {
            if (data.type === "tool:response" && data.payload && data.payload.apiVersion) {
                emitContext(data.payload);
            }
            request.resolve(data.payload || null);
        }
    });

    window.TemplateTool = {
        apiVersion: apiVersion,
        ready: function () {
            return post("tool:ready", {}, false);
        },
        getContext: function () {
            if (cachedContext) return Promise.resolve(cachedContext);
            return post("tool:request-context", {}, true).then(function (context) {
                cachedContext = context || {};
                return cachedContext;
            });
        },
        onContext: function (callback) {
            if (typeof callback !== "function") return function () {};
            function handler(event) {
                callback(event.detail || {});
            }
            window.addEventListener("template-tool-context", handler);
            if (cachedContext) {
                window.setTimeout(function () {
                    callback(cachedContext);
                }, 0);
            }
            return function () {
                window.removeEventListener("template-tool-context", handler);
            };
        },
        findField: function (candidates) {
            return this.getContext().then(function (context) {
                return findFieldInContext(context || {}, candidates);
            });
        },
        getFieldValue: function (candidates, fallback) {
            return this.findField(candidates).then(function (field) {
                return field && field.value !== undefined && field.value !== "" ? field.value : (fallback || "");
            });
        },
        getVars: function () {
            return this.getContext().then(function () {
                return window.TemplateVars || {};
            });
        },
        getVar: function (name, fallback) {
            return this.getVars().then(function (vars) {
                var key = String(name || "");
                if (!key) return fallback || "";
                if (Object.prototype.hasOwnProperty.call(vars, key)) return vars[key];
                return fallback || "";
            });
        },
        hasVariable: function (name) {
            return this.getVars().then(function (vars) {
                return Object.prototype.hasOwnProperty.call(vars, String(name || ""));
            });
        },
        listVariables: function () {
            return this.getVars().then(function (vars) {
                return Object.keys(vars).filter(function (key) {
                    var value = vars[key];
                    return value === null || typeof value !== "object";
                }).sort();
            });
        },
        describeApi: function () {
            return apiReference;
        },
        requestResize: requestResize,
        copyText: function (text, message) {
            return post("tool:copy-text", { text: String(text || ""), message: message || "" }, true);
        },
        copyHtml: function (html, message) {
            return post("tool:copy-html", { html: String(html || ""), message: message || "" }, true);
        },
        toast: function (message, variant) {
            return post("tool:toast", { message: String(message || ""), variant: variant || "info" }, true);
        },
        openUrl: function (url) {
            return post("tool:open-url", { url: String(url || "") }, true);
        },
        close: function () {
            return post("tool:close", {}, false);
        }
    };

    function startRuntime() {
        requestResize();
        window.TemplateTool.ready();
        window.addEventListener("load", requestResize);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(requestResize).catch(function () {});
        }
        if (typeof ResizeObserver === "function") {
            var observer = new ResizeObserver(requestResize);
            if (document.documentElement) observer.observe(document.documentElement);
            if (document.body) observer.observe(document.body);
        }
        window.setTimeout(requestResize, 120);
        window.setTimeout(requestResize, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startRuntime, { once: true });
    } else {
        startRuntime();
    }
})();
</script>`;

const EMPTY_TOOL_HTML = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #f8fafc;
            color: #526078;
            font: 600 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
    </style>
</head>
<body>
    <p>Add generated HTML to preview this module.</p>
</body>
</html>`;

export function normalizeToolModuleHtml(html = "") {
    const raw = String(html || "").replace(/^\uFEFF/, "").trim();
    if (!raw) return "";

    const fenceMatch = raw.match(/```(?:html)?\s*([\s\S]*?)```/i);
    const candidate = fenceMatch?.[1]?.trim() || raw;
    const docStartMatch = candidate.match(/<!doctype\s+html\b|<html[\s>]/i);
    if (!docStartMatch) return candidate;

    const start = docStartMatch.index || 0;
    const sliced = candidate.slice(start).trim();
    const endMatch = sliced.match(/<\/html\s*>/i);
    if (!endMatch) return sliced;
    return sliced.slice(0, endMatch.index + endMatch[0].length).trim();
}

function ensureDocument(html = "") {
    const trimmedHtml = normalizeToolModuleHtml(html);
    if (!trimmedHtml) return EMPTY_TOOL_HTML;
    if (/<!doctype|<html[\s>]/i.test(trimmedHtml)) return trimmedHtml;
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${trimmedHtml}
</body>
</html>`;
}

function injectIntoHeadEnd(documentHtml, injection, marker) {
    if (documentHtml.includes(marker)) return documentHtml;
    if (/<\/head\s*>/i.test(documentHtml)) {
        return documentHtml.replace(/<\/head\s*>/i, `${injection}</head>`);
    }
    if (/<head[\s>]/i.test(documentHtml)) {
        return documentHtml.replace(/<head([^>]*)>/i, `<head$1>${injection}`);
    }
    if (/<html[\s>]/i.test(documentHtml)) {
        return documentHtml.replace(/<html([^>]*)>/i, `<html$1>${injection}`);
    }
    return `${injection}${documentHtml}`;
}

function injectIntoHeadStart(documentHtml, injection, marker) {
    if (documentHtml.includes(marker)) return documentHtml;
    if (/<head[\s>]/i.test(documentHtml)) {
        return documentHtml.replace(/<head([^>]*)>/i, `<head$1>${injection}`);
    }
    if (/<html[\s>]/i.test(documentHtml)) {
        return documentHtml.replace(/<html([^>]*)>/i, `<html$1>${injection}`);
    }
    return `${injection}${documentHtml}`;
}

export function buildToolModuleSrcDoc(html = "") {
    const documentHtml = ensureDocument(html);
    const withBridge = injectIntoHeadStart(documentHtml, TOOL_MODULE_BRIDGE, "template-tool-bridge");
    return injectIntoHeadEnd(withBridge, TOOL_MODULE_HOST_STYLE, "template-tool-host-style");
}

function normalizeToolTokens(tokens = [], values = {}) {
    if (!Array.isArray(tokens)) return [];

    return tokens
        .filter((tokenDef) => tokenDef?.token)
        .map((tokenDef) => {
            const value = Object.prototype.hasOwnProperty.call(values, tokenDef.token)
                ? values[tokenDef.token]
                : tokenDef.previewValue;

            return {
                token: tokenDef.token,
                label: tokenDef.label || tokenDef.token,
                key: tokenDef.key || "",
                inputType: tokenDef.input_type || tokenDef.inputType || "text",
                value: value ?? "",
                internal: Boolean(tokenDef.internal),
                aliases: Array.isArray(tokenDef.searchAliases) ? tokenDef.searchAliases.filter(Boolean) : []
            };
        });
}

function displayValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "";
}

function normalizeLookupKey(value = "") {
    return String(value || "")
        .replace(/[{}]/g, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "");
}

function normalizeName(value = "") {
    return String(value || "")
        .replace(/[{}]/g, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function camelizeName(value = "") {
    const normalized = normalizeName(value);
    if (!normalized) return "";
    return normalized.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function toVariableName(value = "") {
    const camel = camelizeName(value);
    if (!camel) return "";
    return /^[A-Za-z_$]/.test(camel) ? camel : `field${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
}

function pathSegments(value = "") {
    return String(value || "")
        .split(".")
        .map((part) => part.trim())
        .filter(Boolean);
}

function addUnique(values, value) {
    const text = String(value || "").trim();
    if (!text || values.includes(text)) return;
    values.push(text);
}

function addAliasVariants(aliases, value) {
    const raw = String(value || "").trim();
    if (!raw) return;
    addUnique(aliases, raw);
    const normalized = normalizeName(raw);
    const camel = camelizeName(raw);
    if (normalized) {
        addUnique(aliases, normalized);
        addUnique(aliases, `{${normalized}}`);
    }
    if (camel) addUnique(aliases, camel);
}

function aliasesFromField({ label = "", token = "", key = "", aliases = [], section = "" } = {}) {
    const result = [];
    addAliasVariants(result, label);
    addAliasVariants(result, token);
    addAliasVariants(result, token.replace(/[{}]/g, ""));
    addAliasVariants(result, key);
    const keyParts = pathSegments(key);
    if (keyParts.length > 0) {
        addAliasVariants(result, keyParts[keyParts.length - 1]);
        addAliasVariants(result, keyParts.join(" "));
        addAliasVariants(result, keyParts.join(""));
    }
    addAliasVariants(result, section);
    aliases.forEach((alias) => addAliasVariants(result, alias));
    return result;
}

function makeField(field) {
    const value = displayValue(field.value);
    if (value === "") return null;
    const normalized = {
        label: String(field.label || field.token || field.key || "Field"),
        value,
        source: field.source || "context"
    };
    if (field.token) normalized.token = String(field.token);
    if (field.key) normalized.key = String(field.key);
    if (field.section) normalized.section = String(field.section);
    normalized.aliases = aliasesFromField({ ...field, ...normalized });
    return normalized;
}

function buildRuntimeFields({ tokens = [], clientInfo = [], clientSummary = [] } = {}) {
    const fields = [];
    const seen = new Set();
    const addField = (field) => {
        const normalized = makeField(field);
        if (!normalized) return;
        const signature = `${normalized.source}:${normalized.label}:${normalized.value}:${normalized.token || ""}:${normalized.key || ""}`;
        if (seen.has(signature)) return;
        seen.add(signature);
        fields.push(normalized);
    };

    tokens.forEach((token) => {
        addField({
            label: token.label,
            value: token.value,
            token: token.token,
            key: token.key,
            aliases: token.aliases,
            source: "token"
        });
    });

    clientSummary.forEach((field) => {
        addField({
            label: field.label,
            value: field.value,
            section: "summary",
            source: "clientSummary"
        });
    });

    clientInfo.forEach((section) => {
        (section?.fields || []).forEach((field) => {
            addField({
                label: field.label,
                value: field.value,
                section: section.title || section.id,
                source: "clientInfo"
            });
        });
    });

    return fields;
}

function assignValueAlias(values, alias, value) {
    if (!alias || value === "") return;
    if (Object.prototype.hasOwnProperty.call(values, alias)) return;
    values[alias] = value;
}

function assignPathAlias(values, path, value) {
    const segments = pathSegments(path);
    if (segments.length < 2 || value === "") return;

    let current = values;
    for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index];
        if (!segment || /^\d+$/.test(segment)) return;
        if (current[segment] === undefined) {
            current[segment] = {};
        }
        if (!current[segment] || typeof current[segment] !== "object" || Array.isArray(current[segment])) return;
        current = current[segment];
    }

    const last = segments[segments.length - 1];
    if (last && !Object.prototype.hasOwnProperty.call(current, last)) {
        current[last] = value;
    }
}

function buildCompatibleValues(values = {}, fields = []) {
    const compatible = { ...values };
    fields.forEach((field) => {
        if (field.key) assignPathAlias(compatible, field.key, field.value);
        field.aliases.forEach((alias) => assignValueAlias(compatible, alias, field.value));
    });
    assignCanonicalFieldVariables(compatible, fields);
    return compatible;
}

const CANONICAL_FIELD_VARIABLES = Object.freeze([
    {
        name: "clientName",
        candidates: ["clientName", "client name", "fullName", "full name", "name", "client.name"]
    }
]);

function fieldMatchesCandidate(field, candidate) {
    const key = normalizeLookupKey(candidate);
    if (!field || !key) return false;
    return [field.label, field.token, field.key, ...(field.aliases || [])].some((alias) => normalizeLookupKey(alias) === key);
}

function findFieldValue(fields = [], candidates = []) {
    for (const candidate of candidates) {
        const field = fields.find((entry) => fieldMatchesCandidate(entry, candidate));
        const value = displayValue(field?.value);
        if (value !== "") return value;
    }
    return "";
}

function assignCanonicalFieldVariables(target, fields = []) {
    CANONICAL_FIELD_VARIABLES.forEach(({ name, candidates }) => {
        if (Object.prototype.hasOwnProperty.call(target, name)) return;
        const value = findFieldValue(fields, candidates);
        if (value !== "") target[name] = value;
    });
}

function buildFieldIndex(fields = []) {
    const index = {};
    fields.forEach((field) => {
        [field.label, field.token, field.key, ...(field.aliases || [])].forEach((alias) => {
            const key = normalizeLookupKey(alias);
            if (!key || index[key]) return;
            index[key] = {
                label: field.label,
                value: field.value,
                source: field.source,
                token: field.token || "",
                key: field.key || "",
                section: field.section || ""
            };
        });
    });
    return index;
}

function assignVariableAlias(variables, alias, value) {
    const name = toVariableName(alias);
    if (!name || value === "") return;
    if (Object.prototype.hasOwnProperty.call(variables, name)) return;
    variables[name] = value;
}

function assignVariablePath(variables, path, value) {
    const segments = pathSegments(path).map(toVariableName).filter(Boolean);
    if (segments.length < 2 || value === "") return;

    let current = variables;
    for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index];
        if (current[segment] === undefined) {
            current[segment] = {};
        }
        if (!current[segment] || typeof current[segment] !== "object" || Array.isArray(current[segment])) return;
        current = current[segment];
    }

    const last = segments[segments.length - 1];
    if (last && !Object.prototype.hasOwnProperty.call(current, last)) {
        current[last] = value;
    }
}

function buildRuntimeVariables({ fields = [], tokenValues = {}, environment = {} } = {}) {
    const variables = {
        env: environment,
        raw: tokenValues,
        byToken: {},
        byKey: {},
        byLabel: {}
    };

    Object.entries(tokenValues || {}).forEach(([token, value]) => {
        const display = displayValue(value);
        if (display === "") return;
        variables.byToken[token] = display;
        assignVariableAlias(variables, token, display);
        assignVariableAlias(variables, token.replace(/[{}]/g, ""), display);
    });

    fields.forEach((field) => {
        const value = displayValue(field.value);
        if (value === "") return;

        if (field.token) variables.byToken[field.token] = value;
        if (field.key) {
            variables.byKey[field.key] = value;
            assignVariablePath(variables, field.key, value);
        }
        variables.byLabel[field.label] = value;

        [field.label, field.token, field.key, ...(field.aliases || [])].forEach((alias) => {
            assignVariableAlias(variables, alias, value);
        });
    });

    assignCanonicalFieldVariables(variables, fields);
    return variables;
}

export function buildToolRuntimeContext({
    tool = {},
    values = {},
    tokens = [],
    client = null,
    clientInfo = [],
    clientSummary = []
} = {}) {
    const safeValues = values && typeof values === "object" ? values : {};
    const safeClientInfo = Array.isArray(clientInfo) ? clientInfo : [];
    const safeClientSummary = Array.isArray(clientSummary) ? clientSummary : [];
    const normalizedTokens = normalizeToolTokens(tokens, safeValues);
    const fields = buildRuntimeFields({
        tokens: normalizedTokens,
        clientInfo: safeClientInfo,
        clientSummary: safeClientSummary
    });
    const generatedAt = new Date().toISOString();
    const environment = {
        apiVersion: TOOL_MODULE_API_VERSION,
        toolId: tool.id || "",
        toolTitle: tool.title || "",
        toolDescription: tool.description || "",
        generatedAt
    };

    return {
        apiVersion: TOOL_MODULE_API_VERSION,
        tool: {
            id: tool.id || "",
            title: tool.title || "",
            description: tool.description || ""
        },
        values: buildCompatibleValues(safeValues, fields),
        tokenValues: safeValues,
        tokens: normalizedTokens,
        fields,
        fieldIndex: buildFieldIndex(fields),
        variables: buildRuntimeVariables({
            fields,
            tokenValues: safeValues,
            environment
        }),
        environment,
        client: client && typeof client === "object" ? client : null,
        clientInfo: safeClientInfo,
        clientSummary: safeClientSummary,
        generatedAt
    };
}

export function buildToolModulePrompt({ title = "", prompt = "" } = {}) {
    const safeTitle = String(title || "").trim() || "Custom tool";
    const userPrompt = String(prompt || "").trim() || "Create a useful workflow tool for my Template Generator app.";

    return `You are building a custom Beta module for a local app called Template Generator.

Return one complete HTML file, and nothing else.
- Put all HTML, CSS and JavaScript in that single file.
- Prefer attaching the result as a downloadable .html file when the chat interface supports files.
- If you cannot attach a file, return exactly one fenced code block containing the full HTML document from <!doctype html> to </html>.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not include explanations before or after the file.
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Module API reference:
${formatToolModuleApiReferenceForPrompt()}

Runtime:
- The file runs inside an iframe.
- The host app injects window.TemplateTool before your script runs.
- Use await window.TemplateTool.getContext() to read the current app context.
- Context shape: { apiVersion, tool: { id, title, description }, values, tokenValues, variables, environment, tokens, fields, fieldIndex, client, clientInfo, clientSummary, generatedAt }.
- tokenValues is the original object keyed by token strings, for example tokenValues["{client_first_name}"].
- values keeps those token keys and also includes host-generated aliases such as values.client.firstName, values.firstName and values.clientFirstName when they come from real data.
- variables is the easiest API for module JavaScript. It is also exposed globally as window.TemplateVars and contains safe JS property names such as TemplateVars.clientName, TemplateVars.mobile, TemplateVars.contractor, TemplateVars.activationDate, TemplateVars.otoId, plus TemplateVars.byToken, TemplateVars.byKey, TemplateVars.byLabel and TemplateVars.raw.
- environment is also exposed globally as window.TemplateEnv and contains { apiVersion, toolId, toolTitle, toolDescription, generatedAt }.
- The full context is exposed globally as window.TemplateContext, and normalized fields are exposed as window.TemplateFields.
- The API reference is exposed globally as window.TemplateAPI and through window.TemplateTool.describeApi().
- tokens is an array of available variables: [{ token, label, key, inputType, value, internal, aliases }].
- fields is the preferred normalized list for generated modules: [{ label, value, source, token, key, section, aliases }].
- fieldIndex is keyed by normalized names with accents, braces and separators removed.
- client is the raw imported client payload when available, otherwise null.
- clientInfo is an array of visible client detail sections: [{ id, title, fields: [{ label, value }] }].
- clientSummary is the compact client bar data: [{ label, value }].
- Prefer await window.TemplateTool.findField(["birth date", "date de naissance", "dob"]) for user-facing data lookup.
- Use await window.TemplateTool.getFieldValue(["mobile", "phone"], "") when only the string value is needed.
- Use await window.TemplateTool.getVars() or window.TemplateVars after getContext() when you want variable-style access.
- Use await window.TemplateTool.getVar("clientName", "") for a single variable.
- Use await window.TemplateTool.listVariables() when you need to discover the variable names available in the current context.
- Use window.TemplateTool.describeApi() when you need the static API reference.
- Use window.TemplateTool.copyText(text, message) to copy plain text.
- Use window.TemplateTool.copyHtml(html, message) to copy formatted HTML.
- Use window.TemplateTool.toast(message, "info" | "success" | "warning" | "error") for feedback.
- Use window.TemplateTool.openUrl(url) for external pages.
- Use window.TemplateTool.close() if your tool has a close action.
- Call window.TemplateTool.requestResize() after expanding/collapsing content, adding rows, changing validation messages or rendering async data.

Available data rules:
- Never invent variable names or sample values. Read the actual context returned by getContext().
- Prefer TemplateVars, TemplateTool.getVars(), TemplateTool.findField, context.fields, context.fieldIndex and context.clientInfo for user-facing data because they describe the available variables.
- Do not rely only on semantic object paths like context.values.client.birthDate. Use the field helpers first, then tokenValues when an exact token is known, then context.client last for raw nested data.
- Use context.client only when structured raw data is needed.
- If a required field is missing from context.tokens, context.clientInfo and context.client, show a clear missing-data state instead of guessing.
- For date tools, accept common formats like YYYY-MM-DD and DD.MM.YYYY, but only calculate from an actual available value.

Host behavior:
- The host app always opens this module inside its own popup/modal. The user does not need to ask for a popup.
- Build the HTML as the complete content of that popup, with a compact self-contained interface that fits inside the modal.
- Do not add a close button unless the requested workflow explicitly needs one. The host modal already has a close button.
- Do not create another full-screen overlay, fake browser window, onboarding page, landing page or centered modal/card inside the module.
- If the user explicitly asks for a main-page action instead of an editor UI, keep the module UI minimal and perform that action through the available TemplateTool APIs.
- If the requested main-page action is not possible with the available APIs, show a clear in-module message and offer the closest supported action.

Visual style:
- Build a compact productivity UI, not a landing page.
- The host popup already provides the modal frame and title. Do not create a second card-centered popup inside it.
- Use <main class="template-tool-module"> as the only top-level visual wrapper.
- Let the module content fill the iframe width. Set html/body margin to 0, do not set body min-height: 100vh, do not use place-items: center, do not use large empty gray backgrounds and do not center a max-width card in the canvas.
- Use a white or very light surface, #172033 text, #526078 muted text, #5b63f6 as the primary action color, #21a36a for success and #dc2626 only for destructive actions.
- Use 8px radius or less, clear labels, dense spacing and visible focus states.
- Buttons should look like app tools: bordered, solid when primary, quiet when secondary.
- Avoid decorative gradients, big hero sections, stock imagery and explanatory marketing copy.

Robustness:
- Do not assume a token exists. Read values defensively.
- Keep the layout responsive from 360px to desktop.
- Use type="button" on action buttons so forms do not submit unexpectedly.
- Ensure empty, loading and error states remain inside the same compact layout.
- Never write to localStorage unless it is essential for the tool.

Tool name: ${safeTitle}

User request:
${userPrompt}`;
}
