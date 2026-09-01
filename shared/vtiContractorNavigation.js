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
        throw new Error("The VTI contractor number is invalid.");
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
        throw new Error("The VTI recordId is invalid.");
    }

    const url = new URL(VTI_BASE_URL);
    url.searchParams.set("module", "Contractors");
    url.searchParams.set("view", "Detail");
    url.searchParams.set("record", normalizedRecordId);
    return url.href;
}

export function buildVtiContractorPageUrls(recordId) {
    const detailUrl = new URL(buildVtiContractorDetailUrl(recordId));
    const withTabLabel = (tabLabel) => {
        const url = new URL(detailUrl);
        url.searchParams.set("tab_label", tabLabel);
        return url.href;
    };

    return {
        info: withTabLabel("LBL_CONTRACTOR_INFO"),
        billing: withTabLabel("LBL_CONTRACTOR_BILLING"),
        offers: withTabLabel("LBL_CONTRACTOR_OFFERS")
    };
}

export function getVtiContractorRecordIdFromUrl(value) {
    try {
        const url = new URL(value);
        const recordId = String(url.searchParams.get("record") || "").trim();
        return /^\d+$/.test(recordId) ? recordId : "";
    } catch {
        return "";
    }
}
