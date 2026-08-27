export const ALEX_HOME_URL = "https://www.ftthproxy.ch/";
export const ALEX_STORAGE_NAVIGATION_DELAY_MS = 500;

export function openAlexTicketPage(payload, requestedDelayMs) {
    function text(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    }

    var pageLocation = location;
    if (!/(^|\.)ftthproxy\.ch$/i.test(pageLocation.hostname)) {
        throw new Error("L’onglet ALEX n’est pas sur ftthproxy.ch.");
    }
    if (!payload || payload.source !== "salt-templater-alex-ticket" || payload.action !== "view-ticket") {
        throw new Error("Les données ALEX sont invalides.");
    }

    var alap = text(payload.alap);
    var ticket = text(payload.ticket).replace(/[^0-9]+/g, "");
    var serviceDomain = Number(payload.serviceDomain);
    var businessDomain = text(payload.businessDomain);
    if (!/^\d+$/.test(alap) || alap === "0") {
        throw new Error("L’identifiant partenaire ALEX est invalide.");
    }
    if (!ticket) {
        throw new Error("Le numéro du ticket ALEX est absent.");
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
    var targetUrl = pageLocation.origin
        + "/?saltAlexRefresh=" + Date.now()
        + "#/assurance/ticket/" + ticket;
    setTimeout(function openTicketAfterPartnerContext() {
        pageLocation.replace(targetUrl);
    }, delayMs);

    return { ok: true, delayMs, targetUrl };
}
