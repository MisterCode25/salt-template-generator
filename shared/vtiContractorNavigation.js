export const VTI_BASE_URL = "https://vti.salt.ch/index.php";
export const VTI_CONTRACTOR_SEARCH_VIEW_ID = "254";

export function normalizeContractorNumber(value) {
    const normalizedValue = String(value ?? "").trim().replace(/\s+/g, "");
    return /^\d+$/.test(normalizedValue) ? normalizedValue : "";
}

function getExternalIdContractorNumber(externalTicketId) {
    const parts = String(externalTicketId ?? "")
        .trim()
        .split("//")
        .map((part) => part.trim());

    if (parts.length === 14 && /^\d{2}\.\d{2}\.\d{4}$/.test(parts[0])) {
        return normalizeContractorNumber(parts[1]);
    }
    if (parts.length >= 15) {
        return normalizeContractorNumber(parts[2]);
    }
    return "";
}

export function getSuperOfficeContractorNumber(payload) {
    return getExternalIdContractorNumber(payload?.externalTicketId)
        || normalizeContractorNumber(payload?.contractorNumber)
        || normalizeContractorNumber(payload?.contractor)
        || normalizeContractorNumber(payload?.client?.contractorNumber);
}

export function getCapturedVtiContractorNumber(payload) {
    return normalizeContractorNumber(payload?.client?.contractorNumber)
        || normalizeContractorNumber(payload?.client?.contractor)
        || normalizeContractorNumber(payload?.contractorNumber)
        || normalizeContractorNumber(payload?.contractor_no);
}

export function resolveVtiCaptureRoute(superOfficePayload, manualContractorNumber = "") {
    const contractorNumber = getSuperOfficeContractorNumber(superOfficePayload)
        || normalizeContractorNumber(manualContractorNumber);
    if (contractorNumber) return { mode: "search", contractorNumber };
    return { mode: "manual-input", contractorNumber: "" };
}

export function buildVtiContractorSearchUrl(contractorNumber) {
    const normalizedContractorNumber = normalizeContractorNumber(contractorNumber);
    if (!normalizedContractorNumber) {
        throw new Error("Le numéro de contractor VTI est invalide.");
    }

    const url = new URL(VTI_BASE_URL);
    url.searchParams.set("module", "Contractors");
    url.searchParams.set("parent", "");
    url.searchParams.set("page", "1");
    url.searchParams.set("view", "List");
    url.searchParams.set("viewname", VTI_CONTRACTOR_SEARCH_VIEW_ID);
    url.searchParams.set("orderby", "");
    url.searchParams.set("sortorder", "");
    url.searchParams.set(
        "search_params",
        JSON.stringify([[["contractor_no", "e", normalizedContractorNumber]]])
    );
    return url.href;
}

export function buildVtiContractorDetailUrl(recordId) {
    const normalizedRecordId = String(recordId ?? "").trim();
    if (!/^\d+$/.test(normalizedRecordId)) {
        throw new Error("Le recordId VTI est invalide.");
    }

    const url = new URL(VTI_BASE_URL);
    url.searchParams.set("module", "Contractors");
    url.searchParams.set("view", "Detail");
    url.searchParams.set("record", normalizedRecordId);
    return url.href;
}
