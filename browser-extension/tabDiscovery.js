export const CAPTURE_TAB_ERROR = Object.freeze({
    VTI_MISSING: "VTI_TAB_MISSING",
    SUPER_OFFICE_MISSING: "SUPER_OFFICE_TAB_MISSING"
});

export const CAPTURE_TAB_ERROR_MESSAGE = Object.freeze({
    [CAPTURE_TAB_ERROR.VTI_MISSING]: "No VTI tab was found. Open the correct VTI customer, then start the capture again.",
    [CAPTURE_TAB_ERROR.SUPER_OFFICE_MISSING]: "No SuperOffice tab was found. Open the correct ticket, then start the capture again."
});

function parseTabUrl(rawUrl) {
    try {
        return new URL(String(rawUrl || ""));
    } catch {
        return null;
    }
}

export function classifyCaptureTab(tab = {}) {
    const url = parseTabUrl(tab.url);
    const hostname = url?.hostname.toLowerCase() || "";

    if (hostname === "vti.salt.ch" || hostname.endsWith(".vti.salt.ch")) {
        return "vti";
    }

    if (hostname === "cs.salt.ch" || hostname.includes("superoffice")) {
        return "superOffice";
    }

    return null;
}

export function classifyWorkflowTab(tab = {}) {
    const url = parseTabUrl(tab.url);
    const hostname = url?.hostname.toLowerCase() || "";

    if (hostname === "wholesale.swisscom.com") return "alo";
    if (hostname === "ftthproxy.ch" || hostname.endsWith(".ftthproxy.ch")) return "alex";
    return null;
}

export function selectReusableWorkflowTab(tabs = [], workflow) {
    const candidates = (Array.isArray(tabs) ? tabs : [])
        .filter((tab) => classifyWorkflowTab(tab) === workflow)
        .sort((left, right) => {
            if (Boolean(left.active) !== Boolean(right.active)) return left.active ? -1 : 1;
            return Number(right.lastAccessed || 0) - Number(left.lastAccessed || 0);
        });
    return candidates[0] || null;
}

export function selectFirstCaptureTabs(tabs = []) {
    const orderedTabs = (Array.isArray(tabs) ? [...tabs] : [])
        .sort((left, right) => {
            const leftIndex = Number.isInteger(left?.index) ? left.index : Number.MAX_SAFE_INTEGER;
            const rightIndex = Number.isInteger(right?.index) ? right.index : Number.MAX_SAFE_INTEGER;
            return leftIndex - rightIndex;
        });

    const superOfficeTab = orderedTabs.find(
        (tab) => classifyCaptureTab(tab) === "superOffice"
    );
    if (!superOfficeTab) {
        return { ok: false, error: CAPTURE_TAB_ERROR.SUPER_OFFICE_MISSING };
    }

    const vtiTab = orderedTabs.find((tab) => classifyCaptureTab(tab) === "vti");
    if (!vtiTab) return { ok: false, error: CAPTURE_TAB_ERROR.VTI_MISSING };

    return {
        ok: true,
        vtiTab,
        superOfficeTab
    };
}
