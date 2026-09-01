export const ALEX_CLIPBOARD_SOURCE = "salt-templater-alex-ticket";
export const ALEX_CLIPBOARD_VERSION = 2;
export const ALEX_HOME_URL = "https://www.ftthproxy.ch/";

const ALEX_SERVICE_DOMAIN = 1;
const ALEX_BUSINESS_DOMAIN = "L1";

function normalizeText(value) {
    return String(value ?? "").trim();
}

function normalizeTicketNumber(value) {
    return String(value ?? "").replace(/[^0-9]+/g, "");
}

function normalizeOtoId(value) {
    const normalizedValue = normalizeText(value).toUpperCase();
    return /^[A-Z]\.\d{3}\.\d{3}\.\d{3}\.\d+$/.test(normalizedValue)
        ? normalizedValue
        : "";
}

function getEligibilityOrdering(clientPayload) {
    return normalizeText(
        clientPayload?.contact?.eligibilityOrdering
        ?? clientPayload?.client?.eligibilityOrdering
        ?? clientPayload?.eligibilityOrdering
    );
}

function getOtoId(clientPayload) {
    return [
        clientPayload?.healthcheck?.otoId,
        clientPayload?.healthcheck?.oto_id,
        clientPayload?.healthcheck?.oto,
        clientPayload?.client?.otoId,
        clientPayload?.contact?.otoId,
        clientPayload?.otoId
    ].map(normalizeOtoId).find(Boolean) || "";
}

function buildAlexProviderContext(clientPayload, action) {
    const alap = getEligibilityOrdering(clientPayload);

    if (!/^\d+$/.test(alap)) return { ok: false, error: "MISSING_PARTNER_ID" };
    if (alap === "0") return { ok: false, error: "ALO_PARTNER" };

    return {
        ok: true,
        payload: {
            source: ALEX_CLIPBOARD_SOURCE,
            version: ALEX_CLIPBOARD_VERSION,
            action,
            alap,
            serviceDomain: ALEX_SERVICE_DOMAIN,
            businessDomain: ALEX_BUSINESS_DOMAIN
        }
    };
}

export function buildAlexCreateTicketPayload(clientPayload) {
    const context = buildAlexProviderContext(clientPayload, "create-ticket");
    if (!context.ok) return context;

    const otoId = getOtoId(clientPayload);
    if (!otoId) return { ok: false, error: "MISSING_OTO_ID" };

    return {
        ok: true,
        payload: { ...context.payload, otoId }
    };
}

export function buildAlexTicketPayload(clientPayload, partnerTicketNumber) {
    const context = buildAlexProviderContext(clientPayload, "view-ticket");
    if (!context.ok) return context;

    const ticket = normalizeTicketNumber(partnerTicketNumber);
    if (!ticket) return { ok: false, error: "MISSING_TICKET" };

    return {
        ok: true,
        payload: { ...context.payload, ticket }
    };
}

export function formatAlexTicketPayload(payload) {
    return JSON.stringify(payload, null, 2);
}

export function getAlexTicketUnavailableMessage(error) {
    if (error === "ALO_PARTNER") return "ALO tickets must be opened with the ALO flow";
    if (error === "MISSING_TICKET") return "Add the partner ticket number to the External ID first";
    if (error === "MISSING_OTO_ID") return "No valid OTO ID found in the active VTI customer";
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

        var supportedAction = payload && (
            payload.action === "view-ticket"
            || payload.action === "create-ticket"
            || payload.action === "open-provider"
        );
        if (!payload || payload.source !== expectedSource || !supportedAction) {
            throw new Error("the clipboard does not contain ALEX data from Salt BO tools.");
        }

        var alap = String(payload.alap || "").trim();
        var ticket = String(payload.ticket || "").replace(/[^0-9]+/g, "");
        var otoId = String(payload.otoId || "").trim().toUpperCase();
        var serviceDomain = Number(payload.serviceDomain);
        var businessDomain = String(payload.businessDomain || "").trim();

        if (!/^\d+$/.test(alap) || alap === "0") {
            throw new Error("the ALEX partner identifier is invalid.");
        }
        if (payload.action === "view-ticket" && !ticket) {
            throw new Error("the ALEX ticket number is missing.");
        }
        if (payload.action === "create-ticket" && !/^[A-Z]\.\d{3}\.\d{3}\.\d{3}\.\d+$/.test(otoId)) {
            throw new Error("the VTI OTO ID is missing or invalid.");
        }
        if (!Number.isFinite(serviceDomain) || !businessDomain) {
            throw new Error("the ALEX partner context is incomplete.");
        }

        localStorage.setItem("focus", JSON.stringify({
            alap: alap,
            serviceDomain: serviceDomain,
            businessDomain: businessDomain
        }));

        var targetHash = payload.action === "view-ticket"
            ? "/assurance/ticket/" + ticket
            : payload.action === "create-ticket"
                ? "/fulfillment/search-sep?obj_fiberconnectionOtoId=" + encodeURIComponent(otoId)
                : "/";
        var reloadUrl = location.origin
            + "/?saltAlexRefresh=" + Date.now()
            + "#" + targetHash;
        setTimeout(function reloadAlexWithPartnerContext() {
            location.replace(reloadUrl);
        }, 300);
    }).catch(function handleError(error) {
        fail(error && error.message ? error.message : String(error));
    });
}

export function buildAlexTicketBookmarklet() {
    const sourceLiteral = JSON.stringify(ALEX_CLIPBOARD_SOURCE);
    return `javascript:(${alexTicketBookmarkletRunner.toString()})(${sourceLiteral});`;
}
