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

export function buildAloAutofillFields(clientPayload = {}, agentProfile = {}, superOfficePayload = {}) {
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
    const mobilePhone = firstValue([
        client.mobileRaw,
        client.mobile,
        client.phone,
        client.telephone,
        contact.mobile,
        contact.phone
    ]);

    return {
        externalReference: superOffice.ticketId,
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
        ...ALO_DEFAULT_PROBLEM
    };
}

export function buildAloAutofillPayload(clientPayload = {}, agentProfile = {}, superOfficePayload = {}) {
    const fields = buildAloAutofillFields(clientPayload, agentProfile, superOfficePayload);
    const agent = normalizeAgentProfile(agentProfile);
    const superOffice = normalizeSuperOfficePayload(superOfficePayload);

    return {
        source: ALO_AUTOFILL_CLIPBOARD_SOURCE,
        version: ALO_AUTOFILL_VERSION,
        fields,
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

export function formatAloAutofillPayload(clientPayload = {}, agentProfile = {}, superOfficePayload = {}) {
    return JSON.stringify(buildAloAutofillPayload(clientPayload, agentProfile, superOfficePayload), null, 2);
}

export function buildAloAutofillBookmarklet() {
    const sourceLiteral = JSON.stringify(ALO_AUTOFILL_CLIPBOARD_SOURCE);
    return `javascript:(function(){try{var expectedSource=${sourceLiteral};function text(value){if(value===null||value===undefined)return"";return String(value).trim();}function first(values){for(var i=0;i<values.length;i++){var value=text(values[i]);if(value)return value;}return"";}function field(payload,name,fallbacks){var fields=payload&&payload.fields||{};return first([fields[name]].concat(fallbacks||[]));}function setVal(id,value,allowEmpty){var normalized=allowEmpty?String(value===null||value===undefined?"":value):text(value);if(!allowEmpty&&!normalized)return false;var el=document.getElementById(id);if(!el)return false;el.value=normalized;el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));return true;}function run(payload){if(!payload||typeof payload!=="object"||Array.isArray(payload)){alert("ALO fill data invalid.");return;}if(payload.source&&payload.source!==expectedSource){alert("Clipboard does not contain ALO fill data from Salt Templater.");return;}var client=payload.client||{};var technical=payload.technical||payload.healthcheck||{};var agent=payload.agent||{};var superOffice=payload.superOffice||{};var tokenValues=superOffice.tokenValues||payload.tokenValues||{};var count=0;function apply(id,value,allowEmpty){if(setVal(id,value,allowEmpty))count++;}apply("ticket.extRef",field(payload,"externalReference",[superOffice.sourceTicketId,superOffice.ticketId,payload.ticketId,tokenValues["{so_ticket_num}"]));apply("ticket.socketId",field(payload,"socketId",[technical.socketId,technical.otoId,technical.oto_id,technical.oto]));apply("ticket.plugNr",field(payload,"plugNr",[technical.plugNr,technical.otoPortId,technical.otoPort,technical.oto_port]));apply("ticket.breakoutCable",field(payload,"breakoutCable",[technical.breakoutCable,technical.breakoutCableId,technical.cable]));apply("ticket.breakoutFiber",field(payload,"breakoutFiber",[technical.breakoutFiber,technical.fiberNumber,technical.fiber,technical.fibre]));apply("ticket.otoAddress.firstName",field(payload,"firstName",[client.firstName,client.firstname,client.givenName]));apply("ticket.otoAddress.lastName",field(payload,"lastName",[client.lastName,client.lastname,client.surname,client.familyName]));apply("ticket.contactPersonFirstName",field(payload,"firstName",[client.firstName,client.firstname,client.givenName]));apply("ticket.contactPersonLastName",field(payload,"lastName",[client.lastName,client.lastname,client.surname,client.familyName]));apply("ticket.contactPersonPhone1",field(payload,"contactPhone1",[client.contactPhone1,client.fixedNumber,client.mobileRaw,client.mobile,client.phone]));apply("ticket.contactPersonPhone2",field(payload,"contactPhone2",[client.contactPhone2]));apply("ticket.contactPersonMail",field(payload,"contactEmail",[client.email,client.mail]));apply("ticket.contactPersonIspFirstName",field(payload,"ispFirstName",[agent.firstName]));apply("ticket.contactPersonIspLastName",field(payload,"ispLastName",[agent.lastName]));apply("ticket.contactPersonIspPhone",field(payload,"ispPhone",[agent.phoneNumber,agent.phone]));apply("ticket.contactPersonIspMail",field(payload,"ispEmail",[agent.email]));apply("ticket.problemDescription",field(payload,"problemDescription",["No signal"]));apply("ticket.problemNotes",field(payload,"problemNotes",[""]),true);apply("ticket.problemCode1",field(payload,"problemCode1",["400"]));apply("ticket.problemCode2",field(payload,"problemCode2",["800"]));apply("ticket.problemCode3",field(payload,"problemCode3",["900"]));if(!count){alert("ALO form fields not found on this page.");return;}alert("ALO fields populated.");}if(!navigator.clipboard||!navigator.clipboard.readText){alert("Clipboard API not available");return;}navigator.clipboard.readText().then(function(raw){if(!text(raw)){alert("Clipboard empty");return;}var payload;try{payload=JSON.parse(raw);}catch(e){alert("Clipboard does not contain valid ALO JSON.");return;}run(payload);}).catch(function(e){alert("Clipboard error: "+e);});}catch(e){alert("Global error: "+e);}})();`;
}
