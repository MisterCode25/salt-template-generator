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

function readPath(source, path) {
    return path.split(".").reduce((current, segment) => {
        if (current === null || current === undefined) return undefined;
        return current[segment];
    }, source);
}

function displayValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "";
}

function valueForField(payload, field) {
    if (field.compute) return displayValue(field.compute(payload));
    return displayValue(readPath(payload, field.path));
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

export function parseClientClipboardJSON(text) {
    const raw = String(text ?? "").trim();
    if (!raw) {
        throw new Error("Clipboard is empty.");
    }

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error("Clipboard does not contain valid JSON.");
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Client JSON must be an object.");
    }

    if (!parsed.client && !parsed.contact && !parsed.healthcheck) {
        throw new Error("Client JSON must contain client, contact, or healthcheck data.");
    }

    return parsed;
}

export function getClientInfoSections(payload) {
    if (!payload) return [];

    return CLIENT_FIELD_GROUPS.map((group) => ({
        id: group.id,
        title: group.title,
        fields: group.fields
            .map((field) => ({
                label: field.label,
                value: valueForField(payload, field)
            }))
            .filter((field) => field.value !== "")
    })).filter((group) => group.fields.length > 0);
}

function addIndexEntry(index, alias, value) {
    const key = normalizeClientTokenName(alias);
    if (!key || value === "" || index.has(key)) return;
    index.set(key, value);
}

export function buildClientTokenIndex(payload) {
    const index = new Map();

    CLIENT_FIELD_GROUPS.forEach((group) => {
        group.fields.forEach((field) => {
            const value = valueForField(payload, field);
            if (value === "") return;

            addIndexEntry(index, field.label, value);
            if (field.path) {
                const pathParts = field.path.split(".");
                const lastPart = pathParts[pathParts.length - 1];
                addIndexEntry(index, lastPart, value);
                addIndexEntry(index, pathParts.join(" "), value);
                addIndexEntry(index, pathParts.join(""), value);
                addIndexEntry(index, `${group.id} ${lastPart}`, value);
                addIndexEntry(index, `${group.id}${lastPart}`, value);
            }
            (field.aliases || []).forEach((alias) => addIndexEntry(index, alias, value));
        });
    });

    return index;
}

export function matchClientDataToTokens(payload, tokens = []) {
    const index = buildClientTokenIndex(payload);
    const values = {};
    const matchedTokens = [];

    tokens.forEach((tokenDef) => {
        const token = typeof tokenDef === "string" ? tokenDef : tokenDef?.token;
        if (!token) return;

        const key = normalizeClientTokenName(token);
        if (!index.has(key)) return;

        const value = index.get(key);
        values[token] = value;
        matchedTokens.push({
            token,
            value,
            label: tokenDef?.label || token
        });
    });

    return { values, matchedTokens };
}
