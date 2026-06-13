import { parseExternalId } from "./externalGenerator.js";
import { SO_TICKET_NUM_TOKEN } from "./tokenCanonicalization.js";

export const ALO_AUTOFILL_CLIPBOARD_SOURCE = "salt-templater-alo-autofill";
export const ALO_AUTOFILL_VERSION = 1;

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

function resolveAloType(externalFields = {}) {
    const haystack = [
        externalFields.SignalStatus,
        externalFields.LedStatus,
        externalFields.treatmentStep,
        externalFields.comment
    ].join(" ").toLowerCase();
    if (/(low|bad|rx|tx|performance)/i.test(haystack)) return "lowBadRxTx";
    return "noSignal";
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
    const aloType = resolveAloType(externalFields);
    const signalState = resolveAloSignalState(externalFields);
    const activationDate = formatIsoDate(getOfferActivationDate(clientPayload));
    const ticketCreatedDate = formatIsoDate(firstValue([
        superOfficePayload?.createdAt,
        superOfficePayload?.created,
        superOfficePayload?.ticketDate,
        superOfficePayload?.messageDate,
        superOfficePayload?.importedAt
    ]));
    const extRef = firstValue([
        superOfficePayload?.sourceTicketId,
        superOfficePayload?.ticketId,
        superOfficePayload?.tokenValues?.[SO_TICKET_NUM_TOKEN],
        externalFields.soTicket
    ]);

    return {
        externalId,
        externalFields,
        aloType,
        signalState,
        extRef,
        disconnectionDate: signalState === "lost" ? ticketCreatedDate : "",
        activationDate,
        description: buildAloProblemDescription({ aloType, signalState, disconnectionDate: ticketCreatedDate, activationDate })
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
    const superOffice = normalizeSuperOfficePayload(superOfficePayload);
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
        externalReference: firstValue([options.extRef, superOffice.ticketId]),
        socketId: firstValue([healthcheck.otoId, healthcheck.oto_id, healthcheck.oto]),
        plugNr: firstValue([healthcheck.otoPortId, healthcheck.otoPort, healthcheck.oto_port]),
        breakoutCable: firstValue([healthcheck.breakoutCableId, healthcheck.breakoutCable, healthcheck.cable]),
        breakoutFiber: firstValue([healthcheck.fiberNumber, healthcheck.fiber, healthcheck.fibre]),
        firstName: firstValue([client.firstName, client.firstname, client.givenName]),
        lastName: firstValue([client.lastName, client.lastname, client.surname, client.familyName]),
        contactPhone1: firstValue([fixedPhone, mobilePhone]),
        contactPhone2: fixedPhone && mobilePhone && fixedPhone !== mobilePhone ? mobilePhone : "",
        contactEmail: firstValue([client.email, client.mail, contact.email, contact.mail]),
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
            type: options.aloType || "noSignal",
            signalState: options.signalState || "",
            disconnectionDate: options.disconnectionDate || "",
            activationDate: options.activationDate || "",
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

function aloAutofillBookmarkletRunner(expectedSource) {
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
            show("ALO fill", "Clipboard does not contain ALO fill data from Salt Templater.", "error");
            return;
        }

        var client = payload.client || {};
        var technical = payload.technical || payload.healthcheck || {};
        var agent = payload.agent || {};
        var superOffice = payload.superOffice || {};
        var tokenValues = superOffice.tokenValues || payload.tokenValues || {};
        var count = 0;

        function apply(id, value, allowEmpty) {
            if (setVal(id, value, allowEmpty)) count += 1;
        }

        apply("ticket.extRef", field(payload, "externalReference", [superOffice.sourceTicketId, superOffice.ticketId, payload.ticketId, tokenValues["{so_ticket_num}"]]));
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

    show("ALO fill", "Reading copied ALO data...", "info");
    if (!navigator.clipboard || !navigator.clipboard.readText) {
        show("ALO fill", "Clipboard API not available on this page.", "error");
        return;
    }

    navigator.clipboard.readText().then(function handleClipboard(raw) {
        if (!text(raw)) {
            show("ALO fill", "Clipboard empty. Click ALO fill in Salt Templater first.", "error");
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

export function buildAloAutofillBookmarklet() {
    const sourceLiteral = JSON.stringify(ALO_AUTOFILL_CLIPBOARD_SOURCE);
    return `javascript:(${aloAutofillBookmarkletRunner.toString()})(${sourceLiteral});`;
}
