import { IMPORTED_EXTERNAL_ID_KEY, MANUAL_CLIENT_INPUTS_KEY } from "../services/activeClientService.js";
import { canonicalizeInputTokenValue, normalizeTokenName } from "./tokenCanonicalization.js";

const CLIENT_FIELD_GROUPS = [
    {
        id: "client",
        title: "Client",
        fields: [
            {
                label: "Full name",
                aliases: ["name", "fullName", "clientName", "customerName", "customer_name"],
                compute: (payload) => [payload?.client?.firstName, payload?.client?.lastName].filter(Boolean).join(" ")
            },
            {
                label: "Contractor",
                path: "client.contractorNumber",
                aliases: ["contractor", "contractorNo", "contractorNumber", "contractor_number", "numContractor"]
            },
            {
                label: "Title",
                path: "client.title",
                aliases: ["title", "civilite", "salutation"]
            },
            {
                label: "First name",
                path: "client.firstName",
                aliases: ["firstName", "first_name", "firstname", "prenom", "givenName", "clientFirstName", "customerFirstName"]
            },
            {
                label: "Last name",
                path: "client.lastName",
                aliases: ["lastName", "last_name", "lastname", "nom", "surname", "familyName", "clientLastName", "customerLastName"]
            },
            {
                label: "Sex",
                path: "client.sex",
                aliases: ["sex", "sexe", "gender"]
            },
            {
                label: "Mobile",
                path: "client.mobile",
                aliases: ["mobile", "phone", "telephone", "tel", "mobilePhone", "clientMobile", "customerMobile"]
            },
            {
                label: "Mobile raw",
                path: "client.mobileRaw",
                aliases: ["mobileRaw", "mobile_raw", "rawMobile", "phoneRaw"]
            },
            {
                label: "Email",
                path: "client.email",
                aliases: ["email", "mail", "eMail", "clientEmail", "customerEmail"]
            },
            {
                label: "Address",
                path: "client.address",
                aliases: ["address", "adresse", "clientAddress", "customerAddress"]
            },
            {
                label: "Language",
                path: "client.communicationLanguage",
                aliases: ["communicationLanguage", "language", "lang", "langue", "clientLanguage"]
            },
            {
                label: "Activation date",
                aliases: ["activationDate", "activation_date", "activation", "dateActivation", "date_activation"],
                compute: (payload) => firstValue([
                    payload?.client?.activationDate,
                    payload?.client?.activation_date,
                    payload?.client?.activation,
                    payload?.client?.dateActivation,
                    payload?.offer?.activationDate,
                    payload?.contact?.activationDate,
                    payload?.healthcheck?.activationDate
                ])
            },
            {
                label: "Eligibility",
                path: "client.eligibilitySource",
                aliases: ["eligibilitySource", "eligibility", "sourceEligibility"]
            },
            {
                label: "Contact record",
                path: "client.contactRecordId",
                aliases: ["contactRecordId", "contactId", "contactRecord"]
            }
        ]
    },
    {
        id: "contact",
        title: "Contact",
        fields: [
            {
                label: "Contact language",
                path: "contact.communicationLanguage",
                aliases: ["contactCommunicationLanguage", "contactLanguage"]
            },
            {
                label: "Contact eligibility",
                path: "contact.eligibilitySource",
                aliases: ["contactEligibilitySource", "contactEligibility"]
            },
            {
                label: "Eligibility ordering",
                path: "contact.eligibilityOrdering",
                aliases: ["eligibilityOrdering", "contactEligibilityOrdering"]
            },
            {
                label: "Public ID",
                path: "contact.publicId",
                aliases: ["publicId", "publicID", "contactPublicId"]
            },
            {
                label: "Fixed number",
                path: "contact.fixedNumber",
                aliases: ["fixedNumber", "fixedPhone", "voipNumber", "voip"]
            },
            {
                label: "Contact record",
                path: "contact.contactRecordId",
                aliases: ["contactContactRecordId"]
            },
            {
                label: "Contact error",
                path: "contact.error",
                aliases: ["contactError"]
            }
        ]
    },
    {
        id: "technical",
        title: "Technical",
        fields: [
            {
                label: "FLL record",
                path: "healthcheck.fllRecordId",
                aliases: ["fllRecordId", "fll", "fllRecord"]
            },
            {
                label: "OTO ID",
                path: "healthcheck.otoId",
                aliases: ["otoId", "oto", "oto_id"]
            },
            {
                label: "OTO port",
                path: "healthcheck.otoPortId",
                aliases: ["otoPortId", "otoPort", "oto_port"]
            },
            {
                label: "Router serial",
                path: "healthcheck.routerSerialNumber",
                aliases: ["routerSerialNumber", "routerSerial", "router", "serialNumber"]
            },
            {
                label: "Old router serial",
                path: "healthcheck.oldRouterSerialNumber",
                aliases: ["oldRouterSerialNumber", "oldRouterSerial"]
            },
            {
                label: "LEX ID",
                path: "healthcheck.lexId",
                aliases: ["lexId", "lex"]
            },
            {
                label: "OLT",
                path: "healthcheck.oltName",
                aliases: ["oltName", "olt"]
            },
            {
                label: "OLT board",
                path: "healthcheck.oltBoard",
                aliases: ["oltBoard", "board"]
            },
            {
                label: "PON port",
                path: "healthcheck.ponPort",
                aliases: ["ponPort", "pon"]
            },
            {
                label: "Breakout cable",
                path: "healthcheck.breakoutCableId",
                aliases: ["breakoutCableId", "breakoutCable", "cable"]
            },
            {
                label: "Fiber number",
                path: "healthcheck.fiberNumber",
                aliases: ["fiberNumber", "fiber", "fibre"]
            },
            {
                label: "Status",
                path: "healthcheck.status",
                aliases: ["status", "lineStatus"]
            },
            {
                label: "ODF ID",
                path: "healthcheck.odfId",
                aliases: ["odfId", "odf"]
            },
            {
                label: "Option 82",
                path: "healthcheck.option82",
                aliases: ["option82"]
            },
            {
                label: "OLT object",
                path: "healthcheck.oltObject",
                aliases: ["oltObject"]
            },
            {
                label: "ONT config",
                path: "healthcheck.ontConfigurationFilename",
                aliases: ["ontConfigurationFilename", "ontConfig", "ontConfiguration"]
            },
            {
                label: "SVLAN",
                path: "healthcheck.svlan",
                aliases: ["svlan"]
            },
            {
                label: "Customer ID",
                path: "healthcheck.customerId",
                aliases: ["customerId", "customer"]
            },
            {
                label: "Line state",
                path: "healthcheck.lineState",
                aliases: ["lineState"]
            },
            {
                label: "Router status",
                path: "healthcheck.routerStatus",
                aliases: ["routerStatus"]
            }
        ]
    },
    {
        id: "crossConnection",
        title: "Cross connection",
        fields: [
            {
                label: "Equipment",
                path: "healthcheck.crossConnexion.Equipment",
                aliases: ["crossConnectionEquipment", "crossConnexionEquipment", "equipment"]
            },
            {
                label: "Rack",
                path: "healthcheck.crossConnexion.Rack",
                aliases: ["crossConnectionRack", "crossConnexionRack", "rack"]
            },
            {
                label: "Slot",
                path: "healthcheck.crossConnexion.Slot",
                aliases: ["crossConnectionSlot", "crossConnexionSlot", "slot"]
            },
            {
                label: "Port",
                path: "healthcheck.crossConnexion.Port",
                aliases: ["crossConnectionPort", "crossConnexionPort", "port"]
            }
        ]
    }
];
let knownClientFieldPathCache = null;
let knownClientFieldByPathCache = null;
const payloadLeavesCache = typeof WeakMap !== "undefined" ? new WeakMap() : null;
const pathSegmentsCache = new Map();

function getPathSegments(path = "") {
    let segments = pathSegmentsCache.get(path);
    if (!segments) {
        segments = path.split(".");
        pathSegmentsCache.set(path, segments);
    }
    return segments;
}

function readPath(source, path) {
    let current = source;
    for (const segment of getPathSegments(path)) {
        if (current === null || current === undefined) return undefined;
        current = current[segment];
    }
    return current;
}

function displayValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "";
}

function humanizePathSegment(segment = "") {
    return String(segment)
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .trim();
}

function tokenSegment(segment = "") {
    return humanizePathSegment(segment)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function formatPathToken(path) {
    let name = "";
    for (const segment of path) {
        const part = tokenSegment(segment);
        if (!part) continue;
        name = name ? `${name}_${part}` : part;
    }
    return name ? `{${name}}` : "";
}

function formatPathLabel(path) {
    let label = "";
    for (const segment of path) {
        const part = humanizePathSegment(segment);
        if (!part) continue;
        label = label ? `${label} ${part}` : part;
    }
    return label;
}

function walkPayloadLeaves(value, path = [], leaves = []) {
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
            path.push(String(index + 1));
            walkPayloadLeaves(value[index], path, leaves);
            path.pop();
        }
        return leaves;
    }

    if (value && typeof value === "object") {
        for (const key in value) {
            if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
            path.push(key);
            walkPayloadLeaves(value[key], path, leaves);
            path.pop();
        }
        return leaves;
    }

    leaves.push({
        path: path.slice(),
        value: displayValue(value)
    });
    return leaves;
}

function getPayloadLeaves(payload) {
    if (!payload || typeof payload !== "object") {
        return walkPayloadLeaves(payload);
    }

    const cached = payloadLeavesCache?.get(payload);
    if (cached) return cached;

    const leaves = walkPayloadLeaves(payload);
    payloadLeavesCache?.set(payload, leaves);
    return leaves;
}

function isManualInputPath(path = []) {
    return path[0] === MANUAL_CLIENT_INPUTS_KEY;
}

function isInternalMetadataPath(path = []) {
    return isManualInputPath(path) || path[0] === IMPORTED_EXTERNAL_ID_KEY;
}

function getManualInputEntries(payload) {
    const manualInputs = payload?.[MANUAL_CLIENT_INPUTS_KEY];
    if (!manualInputs || typeof manualInputs !== "object" || Array.isArray(manualInputs)) return [];

    const entries = [];
    for (const name in manualInputs) {
        if (!Object.prototype.hasOwnProperty.call(manualInputs, name)) continue;
        const entryName = normalizeTokenName(canonicalizeInputTokenValue(name));
        const value = displayValue(manualInputs[name]);
        if (!entryName || value === "") continue;
        entries.push({
            name: entryName,
            label: humanizePathSegment(name),
            value
        });
    }
    return entries;
}

function firstValue(values) {
    for (const value of values) {
        const formatted = displayValue(value);
        if (formatted !== "") return formatted;
    }
    return "";
}

function valueForField(payload, field) {
    if (field.compute) return displayValue(field.compute(payload));
    return displayValue(readPath(payload, field.path));
}

function knownClientFieldPaths() {
    if (knownClientFieldPathCache) return knownClientFieldPathCache;

    const paths = new Set();
    CLIENT_FIELD_GROUPS.forEach((group) => {
        group.fields.forEach((field) => {
            if (field.path) paths.add(field.path);
        });
    });

    knownClientFieldPathCache = paths;
    return paths;
}

function knownClientFieldsByPath() {
    if (knownClientFieldByPathCache) return knownClientFieldByPathCache;

    const byPath = new Map();
    CLIENT_FIELD_GROUPS.forEach((group) => {
        group.fields.forEach((field) => {
            if (!field.path) return;
            byPath.set(field.path, { ...field, group });
        });
    });

    knownClientFieldByPathCache = byPath;
    return byPath;
}

export function normalizeClientTokenName(name = "") {
    return String(name)
        .replace(/[{}]/g, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "");
}

function extractFirstJSONObject(text) {
    let start = -1;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = 0; index < text.length; index++) {
        const char = text[index];

        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (char === "\\") {
                escaped = true;
            } else if (char === "\"") {
                inString = false;
            }
            continue;
        }

        if (char === "\"") {
            inString = true;
            continue;
        }

        if (char === "{") {
            if (depth === 0) start = index;
            depth++;
            continue;
        }

        if (char === "}" && depth > 0) {
            depth--;
            if (depth === 0 && start >= 0) {
                return text.slice(start, index + 1);
            }
        }
    }

    return "";
}

function extractMarkdownJSONBlocks(text) {
    const blocks = [];
    const fencePattern = /```(?:json|javascript|js)?\s*([\s\S]*?)```/gi;
    let match;
    while ((match = fencePattern.exec(text)) !== null) {
        if (match[1]?.trim()) blocks.push(match[1].trim());
    }
    return blocks;
}

export function parseClientClipboardJSON(text) {
    const raw = String(text ?? "").replace(/^\uFEFF/, "").trim();
    if (!raw) {
        throw new Error("Clipboard is empty.");
    }

    const markdownBlocks = extractMarkdownJSONBlocks(raw);
    const candidates = [
        ...markdownBlocks,
        ...markdownBlocks.map(extractFirstJSONObject),
        raw,
        extractFirstJSONObject(raw)
    ]
        .map((candidate) => candidate.trim())
        .filter(Boolean)
        .filter((candidate, index, list) => list.indexOf(candidate) === index);
    let parsedInvalidObject = false;
    let parsedInvalidShape = false;

    for (const candidate of candidates) {
        let parsed;
        try {
            parsed = JSON.parse(candidate);
        } catch {
            continue;
        }

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            parsedInvalidObject = true;
            continue;
        }

        if (!parsed.client && !parsed.contact && !parsed.healthcheck) {
            parsedInvalidShape = true;
            continue;
        }

        return parsed;
    }

    if (parsedInvalidObject) {
        throw new Error("Customer data must be an object.");
    }
    if (parsedInvalidShape) {
        throw new Error("Customer data must contain client, contact, or healthcheck data.");
    }

    throw new Error("Clipboard does not contain valid VTI data.");
}

export function getClientInfoSections(payload) {
    if (!payload) return [];

    const knownPaths = knownClientFieldPaths();
    const sections = [];

    for (const group of CLIENT_FIELD_GROUPS) {
        const fields = [];
        for (const field of group.fields) {
            const value = valueForField(payload, field);
            if (value === "") continue;
            fields.push({
                label: field.label,
                value
            });
        }
        if (fields.length > 0) {
            sections.push({
                id: group.id,
                title: group.title,
                fields
            });
        }
    }

    const dynamicFields = [];
    for (const leaf of getPayloadLeaves(payload)) {
        if (leaf.value === "" || isInternalMetadataPath(leaf.path)) continue;
        if (knownPaths.has(leaf.path.join("."))) continue;
        dynamicFields.push({
            label: formatPathLabel(leaf.path),
            value: leaf.value
        });
    }

    if (dynamicFields.length > 0) {
        sections.push({
            id: "vtiData",
            title: "VTI data",
            fields: dynamicFields
        });
    }

    return sections;
}

export function getClientSummaryFields(payload) {
    if (!payload) return [];

    const client = payload.client || {};
    const contact = payload.contact || {};
    const healthcheck = payload.healthcheck || {};
    const fullName = [client.title, client.firstName, client.lastName]
        .map(displayValue)
        .filter(Boolean)
        .join(" ");

    return [
        {
            label: "Name",
            value: fullName || firstValue([client.firstName, client.lastName])
        },
        {
            label: "Mobile",
            value: firstValue([client.mobile, client.mobileRaw, client.phone, client.telephone])
        },
        {
            label: "Contractor",
            value: firstValue([client.contractorNumber, client.contractor, healthcheck.customerId])
        },
        {
            label: "Activation",
            value: firstValue([
                client.activationDate,
                client.activation_date,
                client.activation,
                client.dateActivation,
                payload?.offer?.activationDate,
                contact.activationDate,
                healthcheck.activationDate
            ])
        },
        {
            label: "OTO ID",
            value: firstValue([healthcheck.otoId, healthcheck.oto_id, healthcheck.oto])
        },
        {
            label: "Port",
            value: firstValue([
                healthcheck.otoPortId,
                healthcheck.otoPort,
                healthcheck.oto_port,
                healthcheck.port,
                healthcheck.crossConnexion?.Port
            ])
        }
    ].map((field) => ({
        ...field,
        value: field.value || "-"
    }));
}

export function getClientLanguageCode(payload) {
    const rawLanguage = firstValue([
        payload?.client?.communicationLanguage,
        payload?.contact?.communicationLanguage,
        payload?.client?.language,
        payload?.contact?.language
    ]).toLowerCase();
    const code = rawLanguage.slice(0, 2);
    return ["fr", "en", "de", "it"].includes(code) ? code : "";
}

function addIndexEntry(index, alias, value) {
    const key = normalizeClientTokenName(alias);
    if (!key || value === "" || index.has(key)) return;
    index.set(key, value);
}

export function buildClientTokenIndex(payload) {
    const index = new Map();

    for (const leaf of getPayloadLeaves(payload)) {
        if (isInternalMetadataPath(leaf.path) || leaf.value === "") continue;
        const token = formatPathToken(leaf.path);
        if (token) addIndexEntry(index, token, leaf.value);
        addIndexEntry(index, leaf.path.join(" "), leaf.value);
        addIndexEntry(index, leaf.path.join(""), leaf.value);
    }

    for (const group of CLIENT_FIELD_GROUPS) {
        for (const field of group.fields) {
            const value = valueForField(payload, field);
            if (value === "") continue;

            addIndexEntry(index, field.label, value);
            if (field.path) {
                const pathParts = getPathSegments(field.path);
                const lastPart = pathParts[pathParts.length - 1];
                addIndexEntry(index, lastPart, value);
                addIndexEntry(index, pathParts.join(" "), value);
                addIndexEntry(index, pathParts.join(""), value);
                addIndexEntry(index, `${group.id} ${lastPart}`, value);
                addIndexEntry(index, `${group.id}${lastPart}`, value);
            }
            for (const alias of field.aliases || []) {
                addIndexEntry(index, alias, value);
            }
        }
    }

    for (const entry of getManualInputEntries(payload)) {
        addIndexEntry(index, entry.name, entry.value);
    }

    return index;
}

export function getClientInternalTokenData(payload) {
    const tokenDefs = [];
    const values = {};
    const matchedTokens = [];
    const seen = new Set();

    for (const leaf of getPayloadLeaves(payload)) {
        if (isInternalMetadataPath(leaf.path)) continue;
        const token = formatPathToken(leaf.path);
        if (!token || seen.has(token)) continue;
        seen.add(token);

        const pathKey = leaf.path.join(".");
        const field = knownClientFieldsByPath().get(pathKey);
        const pathLabel = formatPathLabel(leaf.path) || token;
        const label = field?.label || pathLabel;
        const searchAliases = [
            ...(field?.aliases || []),
            pathLabel,
            pathKey,
            leaf.path.join(" ")
        ].filter(Boolean);
        tokenDefs.push({
            id: `client-json:${leaf.path.join(".")}`,
            token,
            label,
            key: leaf.path.join("."),
            searchAliases,
            previewValue: leaf.value,
            input_type: "text",
            display_mode: "on_demand",
            internal: true
        });

        values[token] = leaf.value;
        matchedTokens.push({
            token,
            value: leaf.value,
            label
        });
    }

    for (const entry of getManualInputEntries(payload)) {
        const token = `{${entry.name}}`;
        if (seen.has(token)) continue;
        seen.add(token);

        tokenDefs.push({
            id: `client-manual:${entry.name}`,
            token,
            label: entry.label || token,
            key: `${MANUAL_CLIENT_INPUTS_KEY}.${entry.name}`,
            previewValue: entry.value,
            input_type: "text",
            display_mode: "on_demand",
            internal: true
        });

        values[token] = entry.value;
        matchedTokens.push({
            token,
            value: entry.value,
            label: entry.label || token
        });
    }

    return { tokenDefs, values, matchedTokens };
}

export function matchClientDataToTokens(payload, tokens = []) {
    const index = buildClientTokenIndex(payload);
    const values = {};
    const matchedTokens = [];

    for (const tokenDef of tokens) {
        const token = typeof tokenDef === "string" ? tokenDef : tokenDef?.token;
        if (!token) continue;

        const key = normalizeClientTokenName(token);
        if (!index.has(key)) continue;

        const value = index.get(key);
        values[token] = value;
        matchedTokens.push({
            token,
            value,
            label: tokenDef?.label || token
        });
    }

    return { values, matchedTokens };
}
