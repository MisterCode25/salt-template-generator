export const CAPTURE_TAB_ERROR = Object.freeze({
    VTI_MISSING: "VTI_TAB_MISSING",
    VTI_AMBIGUOUS: "VTI_TAB_AMBIGUOUS",
    SUPER_OFFICE_MISSING: "SUPER_OFFICE_TAB_MISSING",
    SUPER_OFFICE_AMBIGUOUS: "SUPER_OFFICE_TAB_AMBIGUOUS"
});

export const CAPTURE_TAB_ERROR_MESSAGE = Object.freeze({
    [CAPTURE_TAB_ERROR.VTI_MISSING]: "Aucun onglet VTI n’a été trouvé. Ouvre le bon client VTI puis relance la capture.",
    [CAPTURE_TAB_ERROR.VTI_AMBIGUOUS]: "Plusieurs onglets VTI ont été trouvés. Garde uniquement l’onglet du client à capturer.",
    [CAPTURE_TAB_ERROR.SUPER_OFFICE_MISSING]: "Aucun onglet SuperOffice n’a été trouvé. Ouvre le bon ticket puis relance la capture.",
    [CAPTURE_TAB_ERROR.SUPER_OFFICE_AMBIGUOUS]: "Plusieurs onglets SuperOffice ont été trouvés. Garde uniquement l’onglet du ticket à capturer."
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

export function selectUniqueCaptureTabs(tabs = []) {
    const candidates = Array.isArray(tabs) ? tabs : [];
    const vtiTabs = candidates.filter((tab) => classifyCaptureTab(tab) === "vti");
    const superOfficeTabs = candidates.filter((tab) => classifyCaptureTab(tab) === "superOffice");

    if (vtiTabs.length === 0) return { ok: false, error: CAPTURE_TAB_ERROR.VTI_MISSING };
    if (vtiTabs.length > 1) return { ok: false, error: CAPTURE_TAB_ERROR.VTI_AMBIGUOUS };
    if (superOfficeTabs.length === 0) return { ok: false, error: CAPTURE_TAB_ERROR.SUPER_OFFICE_MISSING };
    if (superOfficeTabs.length > 1) return { ok: false, error: CAPTURE_TAB_ERROR.SUPER_OFFICE_AMBIGUOUS };

    return {
        ok: true,
        vtiTab: vtiTabs[0],
        superOfficeTab: superOfficeTabs[0]
    };
}
