export const ALEX_CLIPBOARD_SOURCE = "salt-templater-alex-ticket";
export const ALEX_CLIPBOARD_VERSION = 1;
export const ALEX_HOME_URL = "https://www.ftthproxy.ch/";

const ALEX_SERVICE_DOMAIN = 1;
const ALEX_BUSINESS_DOMAIN = "L1";

function normalizeText(value) {
    return String(value ?? "").trim();
}

function normalizeTicketNumber(value) {
    return String(value ?? "").replace(/[^0-9]+/g, "");
}

function getEligibilityOrdering(clientPayload) {
    return normalizeText(
        clientPayload?.contact?.eligibilityOrdering
        ?? clientPayload?.client?.eligibilityOrdering
        ?? clientPayload?.eligibilityOrdering
    );
}

export function buildAlexTicketPayload(clientPayload, partnerTicketNumber) {
    const alap = getEligibilityOrdering(clientPayload);
    const ticket = normalizeTicketNumber(partnerTicketNumber);

    if (!/^\d+$/.test(alap)) return { ok: false, error: "MISSING_PARTNER_ID" };
    if (alap === "0") return { ok: false, error: "ALO_PARTNER" };
    if (!ticket) return { ok: false, error: "MISSING_TICKET" };

    return {
        ok: true,
        payload: {
            source: ALEX_CLIPBOARD_SOURCE,
            version: ALEX_CLIPBOARD_VERSION,
            action: "view-ticket",
            alap,
            serviceDomain: ALEX_SERVICE_DOMAIN,
            businessDomain: ALEX_BUSINESS_DOMAIN,
            ticket
        }
    };
}

export function formatAlexTicketPayload(payload) {
    return JSON.stringify(payload, null, 2);
}

export function getAlexTicketUnavailableMessage(error) {
    if (error === "ALO_PARTNER") return "ALO tickets must be opened with the ALO flow";
    if (error === "MISSING_TICKET") return "Add the partner ticket number to the External ID first";
    return "No ALEX partner identifier found in the active VTI customer";
}

export function openAlexHomePage(openWindow = globalThis.window?.open?.bind(globalThis.window)) {
    if (typeof openWindow !== "function") return null;
    return openWindow(ALEX_HOME_URL, "_blank", "noopener,noreferrer");
}

function alexTicketBookmarkletRunner(expectedSource) {
    function fail(message) {
        alert("Ticket ALEX: " + message);
    }

    if (!/(^|\.)ftthproxy\.ch$/i.test(location.hostname)) {
        fail("launch this bookmarklet from ftthproxy.ch.");
        return;
    }

    if (!navigator.clipboard || !navigator.clipboard.readText) {
        fail("clipboard access is not available on this page.");
        return;
    }

    navigator.clipboard.readText().then(function handleClipboard(raw) {
        var payload;
        try {
            payload = JSON.parse(raw);
        } catch (error) {
            throw new Error("the clipboard does not contain valid JSON.");
        }

        if (!payload || payload.source !== expectedSource || payload.action !== "view-ticket") {
            throw new Error("the clipboard does not contain Ticket ALEX data from Salt BO tools.");
        }

        var alap = String(payload.alap || "").trim();
        var ticket = String(payload.ticket || "").replace(/[^0-9]+/g, "");
        var serviceDomain = Number(payload.serviceDomain);
        var businessDomain = String(payload.businessDomain || "").trim();

        if (!/^\d+$/.test(alap) || alap === "0") {
            throw new Error("the ALEX partner identifier is invalid.");
        }
        if (!ticket) {
            throw new Error("the ALEX ticket number is missing.");
        }
        if (!Number.isFinite(serviceDomain) || !businessDomain) {
            throw new Error("the ALEX partner context is incomplete.");
        }

        localStorage.setItem("focus", JSON.stringify({
            alap: alap,
            serviceDomain: serviceDomain,
            businessDomain: businessDomain
        }));

        var targetHash = "/assurance/ticket/" + ticket;
        if (location.hash === "#" + targetHash) {
            location.reload();
            return;
        }
        location.hash = targetHash;
    }).catch(function handleError(error) {
        fail(error && error.message ? error.message : String(error));
    });
}

export function buildAlexTicketBookmarklet() {
    const sourceLiteral = JSON.stringify(ALEX_CLIPBOARD_SOURCE);
    return `javascript:(${alexTicketBookmarkletRunner.toString()})(${sourceLiteral});`;
}
