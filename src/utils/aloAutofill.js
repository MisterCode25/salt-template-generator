import { parseExternalId } from "./externalGenerator.js";
import { SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";
import { CASE_PROBLEM_DATE_TOKEN } from "./caseDateTokens.js";

export const ALO_AUTOFILL_CLIPBOARD_SOURCE = "salt-templater-alo-autofill";
export const ALO_AUTOFILL_VERSION = 1;
export const ALO_FULFILLMENT_DETAIL_URL = "https://wholesale.swisscom.com/wsg/prod/alo/fuf/web/alo-web/fulfillment/detail.do";
export const ALO_TICKET_CREATION_URL = "https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do?clearModel=true";

export function openAloTicketCreationPage(openWindow = globalThis.window?.open?.bind(globalThis.window)) {
    if (typeof openWindow !== "function") return null;
    return openWindow(ALO_TICKET_CREATION_URL, "_blank", "noopener,noreferrer");
}

const ALO_DEFAULT_PROBLEM = Object.freeze({
    problemDescription: "No signal",
    problemNotes: "",
    problemCode1: "400",
    problemCode2: "800",
    problemCode3: "900"
});

function textValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function firstValue(values) {
    for (const value of values) {
        const text = textValue(value);
        if (text) return text;
    }
    return "";
}

function formatSwissLocalPhone(value) {
    const digits = textValue(value).replace(/\D/g, "");
    if (digits.startsWith("41") && digits.length === 11) return `0${digits.slice(2)}`;
    if (digits.startsWith("0041") && digits.length === 13) return `0${digits.slice(4)}`;
    if (digits.startsWith("0") && digits.length === 10) return digits;
    return textValue(value);
}

function formatIsoDate(value) {
    const text = textValue(value);
    if (!text) return "";
    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    const dotMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (dotMatch) return `${dotMatch[3]}-${dotMatch[2]}-${dotMatch[1]}`;
    const usSlashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (usSlashMatch) {
        return `${usSlashMatch[3]}-${usSlashMatch[1].padStart(2, "0")}-${usSlashMatch[2].padStart(2, "0")}`;
    }
    return text;
}

function formatDisplayDate(value) {
    const iso = formatIsoDate(value);
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return iso;
    return `${match[3]}.${match[2]}.${match[1]}`;
}

function getOfferActivationDate(clientPayload = {}) {
    return firstValue([
        clientPayload?.offer?.activationDate,
        clientPayload?.client?.activationDate,
        clientPayload?.client?.activation_date,
        clientPayload?.client?.activation,
        clientPayload?.client?.dateActivation,
        clientPayload?.contact?.activationDate,
        clientPayload?.healthcheck?.activationDate
    ]);
}

function getAloOrderId(clientPayload = {}) {
    return firstValue([
        clientPayload?.contact?.providerOrderRef,
        clientPayload?.contact?.provider_order_ref,
        clientPayload?.client?.providerOrderRef,
        clientPayload?.client?.provider_order_ref,
        clientPayload?.healthcheck?.orderId,
        clientPayload?.healthcheck?.order_id,
        clientPayload?.orderId,
        clientPayload?.order_id
    ]);
}

function getFirstSuperOfficePostDate(superOfficePayload = {}) {
    const explicitDate = firstValue([
        superOfficePayload?.firstPostAt,
        superOfficePayload?.firstPostDate,
        superOfficePayload?.firstMessageAt,
        superOfficePayload?.firstMessageDate
    ]);
    if (explicitDate) return explicitDate;

    const datedAttachments = (Array.isArray(superOfficePayload?.attachments) ? superOfficePayload.attachments : [])
        .map((attachment) => {
            const rawMessageIndex = attachment?.messageIndex;
            return {
                date: firstValue([
                    attachment?.date,
                    attachment?.messageDate,
                    attachment?.messageDateTime,
                    attachment?.createdAt,
                    attachment?.message?.date,
                    attachment?.message?.createdAt
                ]),
                messageIndex: rawMessageIndex === null || rawMessageIndex === undefined || rawMessageIndex === ""
                    ? null
                    : Number(rawMessageIndex)
            };
        })
        .filter((attachment) => attachment.date && formatIsoDate(attachment.date));
    const indexedAttachments = datedAttachments.filter((attachment) => Number.isInteger(attachment.messageIndex));
    const candidates = indexedAttachments.length > 0 ? indexedAttachments : datedAttachments;
    candidates.sort((left, right) => {
        if (indexedAttachments.length > 0 && left.messageIndex !== right.messageIndex) {
            return left.messageIndex - right.messageIndex;
        }
        return formatIsoDate(left.date).localeCompare(formatIsoDate(right.date));
    });
    return candidates[0]?.date || "";
}

function resolveAloSignalState(externalFields = {}) {
    const signal = textValue(externalFields.SignalStatus).toLowerCase();
    if (signal === "lost") return "lost";
    if (signal === "never") return "never";
    return "";
}

export function buildAloProblemDescription(options = {}) {
    const aloType = options.aloType === "lowBadRxTx" ? "lowBadRxTx" : "noSignal";
    const signalState = options.signalState === "never" ? "never" : "lost";
    const base = aloType === "lowBadRxTx" ? "Bad signal" : "No signal";
    const date = signalState === "never"
        ? formatDisplayDate(options.activationDate)
        : formatDisplayDate(options.disconnectionDate);
    const label = signalState === "never" ? "Never activated" : "Signal lost";
    return [base, label, date].filter(Boolean).join(" - ");
}

export function buildAloTemplateTokenValues(options = {}) {
    const disconnectionDate = formatDisplayDate(options.disconnectionDate);
    const activationDate = formatDisplayDate(options.activationDate);
    const problemDate = options.signalState === "never" ? activationDate : disconnectionDate;

    return {
        [CASE_PROBLEM_DATE_TOKEN]: problemDate
    };
}

export function resolveAloTemplateWithProblemDate(model, options, resolveTemplateText) {
    if (!model || typeof resolveTemplateText !== "function") return null;
    return resolveTemplateText(model, buildAloTemplateTokenValues(options));
}

export function buildAloPreparationDefaults(clientPayload = {}, superOfficePayload = {}) {
    const externalId = firstValue([
        superOfficePayload?.externalTicketId,
        clientPayload?.externalTicketId,
        clientPayload?.externalId,
        clientPayload?.client?.externalTicketId,
        clientPayload?.client?.externalId,
        clientPayload?.superOffice?.externalTicketId
    ]);
    const parsedExternalId = parseExternalId(externalId);
    const externalFields = parsedExternalId.ok ? parsedExternalId.fields : {};
    const signalState = resolveAloSignalState(externalFields);
    const activationDate = formatIsoDate(getOfferActivationDate(clientPayload));
    const firstPostDate = formatIsoDate(getFirstSuperOfficePostDate(superOfficePayload));

    return {
        externalId,
        externalFields,
        aloType: "",
        signalState,
        disconnectionDate: firstPostDate,
        activationDate,
        description: ""
    };
}

function normalizeAgentProfile(agentProfile = {}) {
    return {
        firstName: textValue(agentProfile.firstName),
        lastName: textValue(agentProfile.lastName),
        email: textValue(agentProfile.email),
        phoneNumber: firstValue([agentProfile.phoneNumber, agentProfile.phone])
    };
}

function normalizeSuperOfficePayload(superOfficePayload = {}) {
    const tokenValues = superOfficePayload?.tokenValues || {};
    return {
        ticketId: firstValue([
            superOfficePayload?.sourceTicketId,
            superOfficePayload?.ticketId,
            tokenValues[SO_TICKET_NUM_TOKEN],
            superOfficePayload?.soTicket,
            superOfficePayload?.ticketNumber
        ]),
        externalTicketId: textValue(superOfficePayload?.externalTicketId),
        tokenValues
    };
}

export function buildAloAutofillFields(clientPayload = {}, agentProfile = {}, superOfficePayload = {}, options = {}) {
    const client = clientPayload?.client || {};
    const contact = clientPayload?.contact || {};
    const healthcheck = clientPayload?.healthcheck || {};
    const agent = normalizeAgentProfile(agentProfile);
    const fixedPhone = firstValue([
        contact.fixedNumber,
        contact.voipNumber,
        contact.voip,
        contact.sip,
        client.fixedNumber,
        client.fixedPhone
    ]);
    const mobilePhone = formatSwissLocalPhone(firstValue([
        client.mobile,
        client.mobileRaw,
        client.phone,
        client.telephone,
        contact.mobile,
        contact.phone
    ]));
    const preparedProblemDescription = firstValue([
        options.description,
        options.aloType === "lowBadRxTx" ? "Bad signal" : "",
        ALO_DEFAULT_PROBLEM.problemDescription
    ]);
    const preparedProblemNotes = firstValue([
        options.notes,
        options.signalState ? buildAloProblemDescription(options) : "",
        ALO_DEFAULT_PROBLEM.problemNotes
    ]);
    const problemDateTime = options.signalState === "never"
        ? formatDisplayDate(options.activationDate)
        : formatDisplayDate(options.disconnectionDate);

    return {
        externalReference: textValue(options.extRef),
        socketId: firstValue([healthcheck.otoId, healthcheck.oto_id, healthcheck.oto]),
        plugNr: firstValue([healthcheck.otoPortId, healthcheck.otoPort, healthcheck.oto_port]),
        breakoutCable: firstValue([healthcheck.breakoutCableId, healthcheck.breakoutCable, healthcheck.cable]),
        breakoutFiber: firstValue([healthcheck.fiberNumber, healthcheck.fiber, healthcheck.fibre]),
        firstName: firstValue([client.firstName, client.firstname, client.givenName]),
        lastName: firstValue([client.lastName, client.lastname, client.surname, client.familyName]),
        contactPhone1: firstValue([fixedPhone, mobilePhone]),
        contactPhone2: fixedPhone && mobilePhone && fixedPhone !== mobilePhone ? mobilePhone : "",
        contactEmail: firstValue([client.email, client.mail, contact.email, contact.mail]),
        notificationType: "Email",
        preferredContactType: "Mobile",
        ispFirstName: agent.firstName,
        ispLastName: agent.lastName,
        ispPhone: agent.phoneNumber,
        ispEmail: agent.email,
        ...ALO_DEFAULT_PROBLEM,
        problemDescription: preparedProblemDescription,
        problemNotes: preparedProblemNotes,
        problemDateTime,
        problemCode3: options.aloType === "lowBadRxTx" ? "Performance problem" : ALO_DEFAULT_PROBLEM.problemCode3
    };
}

export function buildAloAutofillPayload(clientPayload = {}, agentProfile = {}, superOfficePayload = {}, options = {}) {
    const fields = buildAloAutofillFields(clientPayload, agentProfile, superOfficePayload, options);
    const agent = normalizeAgentProfile(agentProfile);
    const superOffice = normalizeSuperOfficePayload(superOfficePayload);

    return {
        source: ALO_AUTOFILL_CLIPBOARD_SOURCE,
        version: ALO_AUTOFILL_VERSION,
        fields,
        alo: {
            orderId: getAloOrderId(clientPayload),
            type: options.aloType || "noSignal",
            signalState: options.signalState || "",
            disconnectionDate: formatDisplayDate(options.disconnectionDate),
            activationDate: formatDisplayDate(options.activationDate),
            problemDateTime: fields.problemDateTime,
            notes: options.notes || ""
        },
        client: {
            firstName: fields.firstName,
            lastName: fields.lastName,
            contactPhone1: fields.contactPhone1,
            contactPhone2: fields.contactPhone2,
            email: fields.contactEmail
        },
        technical: {
            socketId: fields.socketId,
            plugNr: fields.plugNr,
            breakoutCable: fields.breakoutCable,
            breakoutFiber: fields.breakoutFiber
        },
        agent,
        superOffice
    };
}

export function formatAloAutofillPayload(clientPayload = {}, agentProfile = {}, superOfficePayload = {}, options = {}) {
    return JSON.stringify(buildAloAutofillPayload(clientPayload, agentProfile, superOfficePayload, options), null, 2);
}

export function extractAloExternalReference(documentRoot) {
    if (!documentRoot || typeof documentRoot.querySelectorAll !== "function") return "";

    const normalize = (value) => String(value === null || value === undefined ? "" : value)
        .replace(/\s+/g, " ")
        .trim();
    const label = Array.from(documentRoot.querySelectorAll(".tooltipCode")).find(
        (element) => normalize(element?.textContent) === "translationId=global.extRef"
    );
    const value = normalize(label?.closest?.("td")?.nextElementSibling?.textContent);
    return value && value !== "-" ? value : "";
}

function aloAutofillBookmarkletRunner(expectedSource, preparedPayload) {
    function text(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    }

    function first(values) {
        for (var i = 0; i < values.length; i += 1) {
            var value = text(values[i]);
            if (value) return value;
        }
        return "";
    }

    function escapeHtml(value) {
        return text(value).replace(/[&<>"']/g, function replaceHtmlChar(char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function show(title, detail, kind) {
        var existing = document.getElementById("saltAloFillOverlay");
        if (existing) existing.remove();

        var box = document.createElement("div");
        box.id = "saltAloFillOverlay";
        box.style.cssText = "position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"
            + (kind === "error" ? "#7f1d1d" : "#111827")
            + ";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)";
        box.innerHTML = "<strong style='display:block;margin-bottom:4px;font-size:14px'>"
            + escapeHtml(title)
            + "</strong><span style='color:#d8d8df'>"
            + escapeHtml(detail)
            + "</span>";
        document.body.appendChild(box);

        if (kind !== "error") {
            setTimeout(function removeOverlay() {
                try {
                    box.remove();
                } catch {
                    // The page may already have navigated.
                }
            }, 4500);
        }
    }

    function field(payload, name, fallbacks) {
        var fields = (payload && payload.fields) || {};
        return first([fields[name]].concat(fallbacks || []));
    }

    function byAttribute(name, value) {
        var safe = String(value).replace(/["\\]/g, "\\$&");
        return document.querySelector("[" + name + "=\"" + safe + "\"]");
    }

    function findField(id) {
        return document.getElementById(id)
            || byAttribute("name", id)
            || byAttribute("formcontrolname", id)
            || byAttribute("data-testid", id);
    }

    function setVal(id, value, allowEmpty) {
        var normalized = allowEmpty ? String(value === null || value === undefined ? "" : value) : text(value);
        if (!allowEmpty && !normalized) return false;

        var el = findField(id);
        if (!el) return false;

        if (el.tagName === "SELECT") {
            var target = text(normalized).toLowerCase();
            for (var i = 0; i < el.options.length; i += 1) {
                var option = el.options[i];
                if (text(option.value).toLowerCase() === target || text(option.textContent).toLowerCase() === target) {
                    el.value = option.value;
                    break;
                }
            }
        } else if ("value" in el) {
            el.value = normalized;
        } else {
            el.textContent = normalized;
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
    }

    function run(payload) {
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
            show("ALO fill", "ALO fill data invalid.", "error");
            return;
        }
        if (payload.source && payload.source !== expectedSource) {
            show("ALO fill", "Clipboard does not contain ALO fill data from Salt BO tools.", "error");
            return;
        }

        var client = payload.client || {};
        var technical = payload.technical || payload.healthcheck || {};
        var agent = payload.agent || {};
        var count = 0;

        function apply(id, value, allowEmpty) {
            if (setVal(id, value, allowEmpty)) count += 1;
        }

        apply("ticket.extRef", field(payload, "externalReference", []));
        apply("ticket.socketId", field(payload, "socketId", [technical.socketId, technical.otoId, technical.oto_id, technical.oto]));
        apply("ticket.plugNr", field(payload, "plugNr", [technical.plugNr, technical.otoPortId, technical.otoPort, technical.oto_port]));
        apply("ticket.breakoutCable", field(payload, "breakoutCable", [technical.breakoutCable, technical.breakoutCableId, technical.cable]));
        apply("ticket.breakoutFiber", field(payload, "breakoutFiber", [technical.breakoutFiber, technical.fiberNumber, technical.fiber, technical.fibre]));
        apply("ticket.otoAddress.firstName", field(payload, "firstName", [client.firstName, client.firstname, client.givenName]));
        apply("ticket.otoAddress.lastName", field(payload, "lastName", [client.lastName, client.lastname, client.surname, client.familyName]));
        apply("ticket.contactPersonFirstName", field(payload, "firstName", [client.firstName, client.firstname, client.givenName]));
        apply("ticket.contactPersonLastName", field(payload, "lastName", [client.lastName, client.lastname, client.surname, client.familyName]));
        apply("ticket.contactPersonPhone1", field(payload, "contactPhone1", [client.contactPhone1, client.fixedNumber, client.mobileRaw, client.mobile, client.phone]));
        apply("ticket.contactPersonPhone2", field(payload, "contactPhone2", [client.contactPhone2]));
        apply("ticket.contactPersonMail", field(payload, "contactEmail", [client.email, client.mail]));
        apply("ticket.contactPersonNotificationsType", field(payload, "notificationType", ["Email"]));
        apply("ticket.contactPersonPreferredContactType", field(payload, "preferredContactType", ["Mobile"]));
        apply("ticket.contactPersonIspFirstName", field(payload, "ispFirstName", [agent.firstName]));
        apply("ticket.contactPersonIspLastName", field(payload, "ispLastName", [agent.lastName]));
        apply("ticket.contactPersonIspPhone", field(payload, "ispPhone", [agent.phoneNumber, agent.phone]));
        apply("ticket.contactPersonIspMail", field(payload, "ispEmail", [agent.email]));
        apply("ticket.problemDescription", field(payload, "problemDescription", ["No signal"]));
        apply("ticket.problemNotes", field(payload, "problemNotes", [""]), true);
        apply("ticket.problemDateTime", field(payload, "problemDateTime", [payload.alo && payload.alo.problemDateTime]));
        apply("ticket.problemCode1", field(payload, "problemCode1", ["400"]));
        apply("ticket.problemCode2", field(payload, "problemCode2", ["800"]));
        apply("ticket.problemCode3", field(payload, "problemCode3", ["900"]));

        if (!count) {
            show("ALO fill", "No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.", "error");
            return;
        }
        show("ALO fill", "Fields populated: " + count, "success");
    }

    if (preparedPayload) {
        run(preparedPayload);
        return;
    }

    show("ALO fill", "Reading copied ALO data...", "info");
    if (!navigator.clipboard || !navigator.clipboard.readText) {
        show("ALO fill", "Clipboard API not available on this page.", "error");
        return;
    }

    navigator.clipboard.readText().then(function handleClipboard(raw) {
        if (!text(raw)) {
            show("ALO fill", "Clipboard empty. Click ALO fill in Salt BO tools first.", "error");
            return;
        }

        var payload;
        try {
            payload = JSON.parse(raw);
        } catch {
            show("ALO fill", "Clipboard does not contain valid ALO data.", "error");
            return;
        }
        run(payload);
    }).catch(function handleClipboardError(error) {
        show("ALO fill", "Clipboard error: " + (error && error.message ? error.message : error), "error");
    });
}

function aloAutofillBetaBookmarkletRunner(expectedSource, fulfillmentDetailUrl, fillForm, extractExternalReference) {
    function text(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    }

    function first(values) {
        for (var i = 0; i < values.length; i += 1) {
            var value = text(values[i]);
            if (value) return value;
        }
        return "";
    }

    function show(title, detail, progress, kind) {
        var overlay = document.getElementById("saltAloBetaOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "saltAloBetaOverlay";
            overlay.style.cssText = "position:fixed;z-index:2147483647;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(3px);color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:left";
            overlay.innerHTML = "<div id='saltAloBetaCard' style='position:relative;width:420px;max-width:calc(100vw - 40px);background:rgba(24,24,28,.97);border:1px solid rgba(255,255,255,.12);border-radius:18px;box-shadow:0 22px 60px rgba(0,0,0,.45);padding:24px 26px'>"
                + "<button id='saltAloBetaClose' type='button' aria-label='Close' style='display:none;position:absolute;right:14px;top:12px;border:0;background:transparent;color:#fff;font-size:24px;line-height:1;cursor:pointer'>&times;</button>"
                + "<div style='display:flex;align-items:center;gap:12px;margin-bottom:16px'><div id='saltAloBetaDot' style='width:14px;height:14px;border-radius:50%;background:#21a36a;box-shadow:0 0 18px #21a36a'></div><div id='saltAloBetaTitle' style='font-size:18px;font-weight:700'></div></div>"
                + "<div id='saltAloBetaDetail' style='font-size:14px;line-height:1.5;color:#d8d8df;white-space:pre-line'></div>"
                + "<div style='margin-top:20px;height:5px;background:rgba(255,255,255,.14);border-radius:999px;overflow:hidden'><div id='saltAloBetaBar' style='width:8%;height:100%;background:linear-gradient(90deg,#21a36a,#65d6a0);border-radius:999px;transition:width .25s ease'></div></div>"
                + "</div>";
            (document.body || document.documentElement).appendChild(overlay);
            overlay.querySelector("#saltAloBetaClose").onclick = function closeOverlay() {
                overlay.remove();
            };
        }

        var isError = kind === "error";
        var card = overlay.querySelector("#saltAloBetaCard");
        var dot = overlay.querySelector("#saltAloBetaDot");
        var bar = overlay.querySelector("#saltAloBetaBar");
        overlay.querySelector("#saltAloBetaTitle").textContent = title || "ALO beta";
        overlay.querySelector("#saltAloBetaDetail").textContent = detail || "";
        overlay.querySelector("#saltAloBetaClose").style.display = isError ? "block" : "none";
        card.style.borderColor = isError ? "rgba(248,113,113,.55)" : "rgba(255,255,255,.12)";
        dot.style.background = isError ? "#ef4444" : "#21a36a";
        dot.style.boxShadow = isError ? "0 0 18px #ef4444" : "0 0 18px #21a36a";
        bar.style.width = Math.max(4, Math.min(100, progress || 0)) + "%";
        bar.style.background = isError
            ? "linear-gradient(90deg,#ef4444,#fb7185)"
            : "linear-gradient(90deg,#21a36a,#65d6a0)";
    }

    function hide() {
        var overlay = document.getElementById("saltAloBetaOverlay");
        if (overlay) overlay.remove();
    }

    function fail(detail) {
        show("ALO beta — unable to continue", detail, 100, "error");
    }

    function fillWithExternalReference(payload, externalReference, detail) {
        payload.fields = Object.assign({}, payload.fields || {}, {
            externalReference: externalReference || ""
        });
        show("ALO beta", detail, 92, "info");
        hide();
        fillForm(expectedSource, payload);
    }

    show("ALO beta", "Reading prepared data…", 8, "info");

    var targetUrl;
    try {
        targetUrl = new URL(fulfillmentDetailUrl);
    } catch {
        fail("The configured Fulfillment URL is invalid.");
        return;
    }

    if (location.origin !== targetUrl.origin) {
        fail("Run this bookmarklet from the ALO Wholesale site.");
        return;
    }

    if (!navigator.clipboard || !navigator.clipboard.readText) {
        fail("Clipboard access is unavailable on this page.");
        return;
    }

    navigator.clipboard.readText().then(function handleClipboard(raw) {
        if (!text(raw)) throw new Error("The clipboard is empty. Prepare the ticket in Salt BO tools first.");

        var payload;
        try {
            payload = JSON.parse(raw);
        } catch {
            throw new Error("The clipboard does not contain valid ALO data.");
        }

        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
            throw new Error("The prepared ALO data is invalid.");
        }
        if (payload.source && payload.source !== expectedSource) {
            throw new Error("The clipboard does not contain ALO data prepared by Salt BO tools.");
        }

        var orderId = first([
            payload.alo && payload.alo.orderId,
            payload.orderId,
            payload.contact && payload.contact.providerOrderRef,
            payload.client && payload.client.providerOrderRef,
            payload.fields && payload.fields.providerOrderRef
        ]);
        if (!orderId) {
            fillWithExternalReference(
                payload,
                "",
                "Order ID unavailable. External Ref left empty.\nFilling the ticket…"
            );
            return;
        }

        show("ALO beta", "Order ID detected: " + orderId + "\nLoading the Fulfillment order…", 38, "info");
        targetUrl.searchParams.set("orderId", orderId);

        return fetch(targetUrl.href, {
            credentials: "include",
            cache: "no-store",
            redirect: "follow"
        }).then(function handleResponse(response) {
            if (!response.ok) return "";
            return response.text();
        }).then(function handleFulfillmentHtml(html) {
            show("ALO beta", "Order loaded.\nSearching for the External Ref…", 70, "info");
            var fulfillmentDocument = html
                ? new DOMParser().parseFromString(html, "text/html")
                : null;
            var externalReference = extractExternalReference(fulfillmentDocument);
            fillWithExternalReference(
                payload,
                externalReference,
                externalReference
                    ? "External Ref found: " + externalReference + "\nFilling the ticket…"
                    : "External Ref unavailable. Field left empty.\nFilling the ticket…"
            );
        }).catch(function handleExternalReferenceError() {
            fillWithExternalReference(
                payload,
                "",
                "External Ref unavailable. Field left empty.\nFilling the ticket…"
            );
        });
    }).catch(function handleError(error) {
        fail(error && error.message ? error.message : String(error));
    });
}

export function buildAloAutofillBookmarklet() {
    const sourceLiteral = JSON.stringify(ALO_AUTOFILL_CLIPBOARD_SOURCE);
    return `javascript:(${aloAutofillBookmarkletRunner.toString()})(${sourceLiteral});`;
}

export function buildAloAutofillBetaBookmarklet() {
    const sourceLiteral = JSON.stringify(ALO_AUTOFILL_CLIPBOARD_SOURCE);
    const detailUrlLiteral = JSON.stringify(ALO_FULFILLMENT_DETAIL_URL);
    return `javascript:(${aloAutofillBetaBookmarkletRunner.toString()})(${sourceLiteral},${detailUrlLiteral},(${aloAutofillBookmarkletRunner.toString()}),(${extractAloExternalReference.toString()}));`;
}
