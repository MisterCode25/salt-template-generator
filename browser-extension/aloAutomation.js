export const ALO_FULFILLMENT_DETAIL_URL = "https://wholesale.swisscom.com/wsg/prod/alo/fuf/web/alo-web/fulfillment/detail.do";
export const ALO_TICKET_CREATION_URL = "https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do?clearModel=true";

export async function autofillAloTicketPage(payload, fulfillmentDetailUrl) {
    function text(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    }

    function first(values) {
        for (var index = 0; index < values.length; index += 1) {
            var value = text(values[index]);
            if (value) return value;
        }
        return "";
    }

    function byAttribute(name, value) {
        var safeValue = String(value).replace(/["\\]/g, "\\$&");
        return document.querySelector("[" + name + "=\"" + safeValue + "\"]");
    }

    function findField(id) {
        return document.getElementById(id)
            || byAttribute("name", id)
            || byAttribute("formcontrolname", id)
            || byAttribute("data-testid", id);
    }

    function setValue(id, value, allowEmpty) {
        var normalized = allowEmpty
            ? String(value === null || value === undefined ? "" : value)
            : text(value);
        if (!allowEmpty && !normalized) return false;

        var element = findField(id);
        if (!element) return false;

        if (element.tagName === "SELECT") {
            var target = text(normalized).toLowerCase();
            for (var optionIndex = 0; optionIndex < element.options.length; optionIndex += 1) {
                var option = element.options[optionIndex];
                if (text(option.value).toLowerCase() === target
                    || text(option.textContent).toLowerCase() === target) {
                    element.value = option.value;
                    break;
                }
            }
        } else if ("value" in element) {
            element.value = normalized;
        } else {
            element.textContent = normalized;
        }

        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
    }

    function extractExternalReference(documentRoot) {
        if (!documentRoot || typeof documentRoot.querySelectorAll !== "function") return "";

        var labels = Array.from(documentRoot.querySelectorAll(".tooltipCode"));
        var label = labels.find(function findExternalReference(candidate) {
            return text(candidate && candidate.textContent).replace(/\s+/g, " ")
                === "translationId=global.extRef";
        });
        var value = text(label && label.closest && label.closest("td")
            && label.closest("td").nextElementSibling
            && label.closest("td").nextElementSibling.textContent);
        return value && value !== "-" ? value : "";
    }

    async function retrieveExternalReference(orderId) {
        if (!orderId || typeof fetch !== "function" || typeof DOMParser !== "function") return "";

        try {
            var targetUrl = new URL(fulfillmentDetailUrl);
            if (targetUrl.origin !== location.origin) return "";
            targetUrl.searchParams.set("orderId", orderId);
            var controller = typeof AbortController === "function" ? new AbortController() : null;
            var timeoutId = controller
                ? setTimeout(function cancelSlowFulfillmentRequest() { controller.abort(); }, 15000)
                : null;
            var response = await fetch(targetUrl.href, {
                credentials: "include",
                cache: "no-store",
                redirect: "follow",
                signal: controller ? controller.signal : undefined
            });
            if (timeoutId) clearTimeout(timeoutId);
            if (!response.ok) return "";
            var html = await response.text();
            var fulfillmentDocument = new DOMParser().parseFromString(html, "text/html");
            return extractExternalReference(fulfillmentDocument);
        } catch {
            if (timeoutId) clearTimeout(timeoutId);
            return "";
        }
    }

    if (!/(^|\.)wholesale\.swisscom\.com$/i.test(location.hostname)) {
        throw new Error("L’onglet ALO n’est pas sur le site Swisscom Wholesale.");
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("Les données ALO sont invalides.");
    }
    if (payload.source && payload.source !== "salt-templater-alo-autofill") {
        throw new Error("Les données ne proviennent pas de Salt BO tools.");
    }

    var fields = payload.fields || {};
    var client = payload.client || {};
    var technical = payload.technical || payload.healthcheck || {};
    var agent = payload.agent || {};
    var orderId = first([
        payload.alo && payload.alo.orderId,
        payload.orderId,
        payload.contact && payload.contact.providerOrderRef,
        client.providerOrderRef,
        fields.providerOrderRef
    ]);
    var providedExternalReferenceCandidate = text(fields.externalReference);
    var providedExternalReference = providedExternalReferenceCandidate === "-"
        ? ""
        : providedExternalReferenceCandidate;
    var externalReference = providedExternalReference || await retrieveExternalReference(orderId);
    var externalReferenceStatus = providedExternalReference
        ? "provided"
        : externalReference
            ? "retrieved"
            : "unavailable";
    var filledCount = 0;

    function apply(id, value, allowEmpty) {
        if (setValue(id, value, allowEmpty)) filledCount += 1;
    }

    apply("ticket.extRef", externalReference, true);
    apply("ticket.socketId", first([fields.socketId, technical.socketId, technical.otoId, technical.oto_id, technical.oto]));
    apply("ticket.plugNr", first([fields.plugNr, technical.plugNr, technical.otoPortId, technical.otoPort, technical.oto_port]));
    apply("ticket.breakoutCable", first([fields.breakoutCable, technical.breakoutCable, technical.breakoutCableId, technical.cable]));
    apply("ticket.breakoutFiber", first([fields.breakoutFiber, technical.breakoutFiber, technical.fiberNumber, technical.fiber, technical.fibre]));
    apply("ticket.otoAddress.firstName", first([fields.firstName, client.firstName, client.firstname, client.givenName]));
    apply("ticket.otoAddress.lastName", first([fields.lastName, client.lastName, client.lastname, client.surname, client.familyName]));
    apply("ticket.contactPersonFirstName", first([fields.firstName, client.firstName, client.firstname, client.givenName]));
    apply("ticket.contactPersonLastName", first([fields.lastName, client.lastName, client.lastname, client.surname, client.familyName]));
    apply("ticket.contactPersonPhone1", first([fields.contactPhone1, client.contactPhone1, client.fixedNumber, client.mobileRaw, client.mobile, client.phone]));
    apply("ticket.contactPersonPhone2", first([fields.contactPhone2, client.contactPhone2]));
    apply("ticket.contactPersonMail", first([fields.contactEmail, client.email, client.mail]));
    apply("ticket.contactPersonNotificationsType", first([fields.notificationType, "Email"]));
    apply("ticket.contactPersonPreferredContactType", first([fields.preferredContactType, "Mobile"]));
    apply("ticket.contactPersonIspFirstName", first([fields.ispFirstName, agent.firstName]));
    apply("ticket.contactPersonIspLastName", first([fields.ispLastName, agent.lastName]));
    apply("ticket.contactPersonIspPhone", first([fields.ispPhone, agent.phoneNumber, agent.phone]));
    apply("ticket.contactPersonIspMail", first([fields.ispEmail, agent.email]));
    apply("ticket.problemDescription", first([fields.problemDescription, "No signal"]));
    apply("ticket.problemNotes", first([fields.problemNotes, ""]), true);
    apply("ticket.problemDateTime", first([fields.problemDateTime, payload.alo && payload.alo.problemDateTime]));
    apply("ticket.problemCode1", first([fields.problemCode1, "400"]));
    apply("ticket.problemCode2", first([fields.problemCode2, "800"]));
    apply("ticket.problemCode3", first([fields.problemCode3, "900"]));

    if (!filledCount) {
        throw new Error("Aucun champ du formulaire ALO n’a été trouvé.");
    }

    return {
        ok: true,
        externalReference,
        externalReferenceStatus,
        filledCount
    };
}
