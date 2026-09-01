export const ALEX_HOME_URL = "https://www.ftthproxy.ch/";
export const ALEX_STORAGE_NAVIGATION_DELAY_MS = 500;

export function inspectAlexWorkflowPage() {
    function hasAuthenticationMarker() {
        var selector = [
            'input[type="password"]',
            'form[action*="login" i]',
            '[data-testid*="login" i] input',
            '.login input'
        ].join(",");
        return Boolean(document.querySelector(selector));
    }

    var isAlexHost = /(^|\.)ftthproxy\.ch$/i.test(location.hostname);
    var route = String(location.pathname || "") + String(location.search || "");
    var isAuthenticationRoute = /(^|[/?&._=-])(login|sign-in|signin|sso|saml|oauth|authenticate|authentication)(?=$|[/?&._=-])/i
        .test(route);

    if (!isAlexHost || isAuthenticationRoute || hasAuthenticationMarker()) {
        return { state: "authentication-required" };
    }
    return { state: "ready" };
}

export function openAlexPage(payload, requestedDelayMs) {
    function text(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    }

    var pageLocation = location;
    if (!/(^|\.)ftthproxy\.ch$/i.test(pageLocation.hostname)) {
        throw new Error("L’onglet ALEX n’est pas sur ftthproxy.ch.");
    }
    var supportedAction = payload && (
        payload.action === "view-ticket"
        || payload.action === "create-ticket"
        || payload.action === "open-provider"
    );
    if (!payload || payload.source !== "salt-templater-alex-ticket" || !supportedAction) {
        throw new Error("Les données ALEX sont invalides.");
    }

    var alap = text(payload.alap);
    var ticket = text(payload.ticket).replace(/[^0-9]+/g, "");
    var otoId = text(payload.otoId).toUpperCase();
    var serviceDomain = Number(payload.serviceDomain);
    var businessDomain = text(payload.businessDomain);
    if (!/^\d+$/.test(alap) || alap === "0") {
        throw new Error("L’identifiant partenaire ALEX est invalide.");
    }
    if (payload.action === "view-ticket" && !ticket) {
        throw new Error("Le numéro du ticket ALEX est absent.");
    }
    if (payload.action === "create-ticket" && !/^[A-Z]\.\d{3}\.\d{3}\.\d{3}\.\d+$/.test(otoId)) {
        throw new Error("L’OTO ID VTI est absent ou invalide.");
    }
    if (!Number.isFinite(serviceDomain) || !businessDomain) {
        throw new Error("Le contexte partenaire ALEX est incomplet.");
    }

    localStorage.setItem("focus", JSON.stringify({
        alap,
        serviceDomain,
        businessDomain
    }));

    var delayMs = Number(requestedDelayMs);
    if (!Number.isFinite(delayMs) || delayMs < 300) delayMs = 500;
    var targetHash = payload.action === "view-ticket"
        ? "/assurance/ticket/" + ticket
        : payload.action === "create-ticket"
            ? "/fulfillment/search-sep?obj_fiberconnectionOtoId=" + encodeURIComponent(otoId)
            : "/";
    var targetUrl = pageLocation.origin
        + "/?saltAlexRefresh=" + Date.now()
        + "#" + targetHash;
    setTimeout(function openAlexAfterPartnerContext() {
        pageLocation.replace(targetUrl);
    }, delayMs);

    return { ok: true, action: payload.action, delayMs, targetUrl };
}
