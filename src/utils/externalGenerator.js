export const EXTERNAL_GENERATOR_PARTNERS = [
    "ALO", "AMB", "ANI", "COMNET", "DANET", "DEK", "DWW", "EBS", "ENERCOM", "ENIWA", "ESAG", "ESI", "EVAL", "EVB", "EVK",
    "EVM", "EWB", "EWBU", "EWG", "EWH", "EWL", "EWLA", "EWM", "EWMAI", "EWME", "EWR", "EWS", "EWW", "EWZ", "FLMS", "FTTH-FR",
    "GABU", "GAG", "GAW", "GBM", "GEF", "GEL", "GES", "GWB", "IWB", "JENNY", "KCL", "LEU", "LFO", "LID", "LKWG", "LOCN",
    "PGE", "PGL", "PGS", "RENET", "RWT", "SAK", "SEIC", "SEY", "SGSW", "SIG", "SME", "STWZ", "SWG", "SWISS4NET", "SWL", "SWW",
    "TBA", "TBF", "TBG", "TBS", "TBW", "TBWAE", "TRN", "TVT", "TWAG", "WBB", "WEW", "WEWA", "WWB"
];

export const EXTERNAL_FIELD_ORDER = [
    "flagging",
    "data",
    "customer",
    "soTicket",
    "SignalStatus",
    "LedStatus",
    "treatmentStep",
    "boxType",
    "partner",
    "partnerTicketNumber",
    "lexId",
    "oltName",
    "oltBoard",
    "bokBof",
    "comment"
];

export const EXTERNAL_DEFAULT_FIELDS = {
    flagging: "",
    data: "",
    customer: "",
    soTicket: "",
    SignalStatus: "",
    LedStatus: "",
    treatmentStep: "",
    boxType: "",
    partner: "",
    partnerTicketNumber: "",
    lexId: "",
    oltName: "",
    oltBoard: "",
    bokBof: "",
    comment: ""
};

function normalizeSegment(value) {
    const trimmed = String(value ?? "").trim();
    return trimmed === "" ? " " : trimmed;
}

export function formatDateForInput(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function buildExternalCode(fields) {
    const dateValue = fields?.data ? String(fields.data) : "";
    const displayDate = dateValue ? dateValue.split("-").reverse().join(".") : " ";
    const valuesByField = {
        ...EXTERNAL_DEFAULT_FIELDS,
        ...fields,
        data: displayDate
    };
    return EXTERNAL_FIELD_ORDER
        .map((field) => normalizeSegment(valuesByField[field]))
        .join("//");
}

export function parseExternalId(externalId) {
    const raw = String(externalId ?? "").trim();
    if (!raw) {
        return { ok: false, error: "EMPTY_EXTERNAL_ID" };
    }

    let parts = raw.split("//").map((p) => p.trim());
    if (parts.length === 14 && /^\d{2}\.\d{2}\.\d{4}$/.test(parts[0])) {
        parts = ["", ...parts];
    }

    if (parts.length < 15) {
        return { ok: false, error: "INVALID_EXTERNAL_ID_FORMAT" };
    }

    const next = { ...EXTERNAL_DEFAULT_FIELDS };
    for (let i = 0; i < EXTERNAL_FIELD_ORDER.length; i++) {
        const key = EXTERNAL_FIELD_ORDER[i];
        if (key === "data") {
            continue;
        }
        next[key] = parts[i] ?? "";
    }
    delete next.data;
    return { ok: true, fields: next };
}

function extractValue(rawData, label, contextRegex = "") {
    const valuePattern = "([\\s\\S]*?)";
    const endPattern = "(?:<\\/[a-z]\\w*>|\\s*\\n\\s*(?:[a-z]\\w+|\\d+)|<\\/div>|$)";
    const regex = contextRegex
        ? new RegExp(`${contextRegex}[\\s\\S]*?${label}\\s*(?:<br\\s*\\/?>|\\s*<[a-z]\\w*>\\s*)?${valuePattern}${endPattern}`, "i")
        : new RegExp(`${label}\\s*(?:<br\\s*\\/?>|\\s*<[a-z]\\w*>\\s*)?${valuePattern}${endPattern}`, "i");
    const match = rawData.match(regex);
    if (!match?.[1]) return "";
    return match[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function parseVtiClipboard(rawInput) {
    const rawData = String(rawInput ?? "");
    if (!rawData.trim()) {
        return { ok: false, error: "EMPTY_VTI_CLIPBOARD" };
    }

    const next = { ...EXTERNAL_DEFAULT_FIELDS };
    const customerMatch = rawData.match(
        /(Contractor number|Vertragsnummer|N°\s*Contractant)\s*:\s*(\d+)/i
    );
    next.customer = customerMatch?.[2]?.trim() || "";

    const fiberFllContext = "Fiber FLL";
    const routerSerialNumber = extractValue(rawData, "routerSerialNumber", fiberFllContext);
    if (routerSerialNumber.startsWith("GFAB")) next.boxType = "X6";
    else if (routerSerialNumber.startsWith("GFAC")) next.boxType = "W7";
    else if (routerSerialNumber.startsWith("SFAA")) next.boxType = "Arc";

    next.lexId = extractValue(rawData, "lexId", fiberFllContext);
    next.oltName = extractValue(rawData, "oltName", fiberFllContext);
    next.oltBoard = extractValue(rawData, "oltBoard", fiberFllContext);

    const breakoutCableId = extractValue(rawData, "breakoutCableId", fiberFllContext);
    const fiberNumber = extractValue(rawData, "fiberNumber", fiberFllContext);
    const bokBofParts = [];
    if (breakoutCableId) {
        const split = breakoutCableId.split("/");
        if (split.length > 1) {
            bokBofParts.push(split[0], split[1]);
        } else {
            bokBofParts.push(breakoutCableId);
        }
    }
    if (fiberNumber) {
        bokBofParts.push(fiberNumber);
    }
    next.bokBof = bokBofParts.join("|");

    const hasUsefulData = Boolean(
        next.customer
        || next.boxType
        || next.lexId
        || next.oltName
        || next.oltBoard
        || next.bokBof
    );
    if (!hasUsefulData) {
        return { ok: false, error: "INVALID_VTI_FORMAT" };
    }

    delete next.data;
    return { ok: true, fields: next };
}

export function mergeExternalFields(current, patch) {
    return { ...current, ...patch };
}

export function clearExternalFieldsExceptDate(current) {
    return { ...EXTERNAL_DEFAULT_FIELDS, data: current?.data || "" };
}
