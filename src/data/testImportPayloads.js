import { buildExternalCode } from "../utils/externalGenerator.js";

const TEST_SO_TICKET_ID = "31436062";

export const TEST_VTI_IMPORT_PAYLOAD = Object.freeze({
    client: {
        contractorNumber: "31447756",
        title: "Mr.",
        firstName: "Peter manuel",
        lastName: "BILLIG",
        sex: "Male",
        mobileRaw: "41789125685",
        mobile: "078 912 56 85",
        address: "67 Avenue de Gilamont, 1800 Vevey",
        email: "pierremb@gmail.com",
        communicationLanguage: "FR",
        eligibilitySource: "ALO",
        contactRecordId: "50895045"
    },
    offer: {
        activationDate: "2026-06-20"
    },
    contact: {
        communicationLanguage: "FR",
        eligibilitySource: "ALO",
        eligibilityOrdering: "35",
        publicId: "28453061",
        fixedNumber: "41788451664",
        providerOrderRef: "10031420260327025732000000",
        contactRecordId: "50895045",
        error: ""
    },
    healthcheck: {
        fllRecordId: "473444",
        otoId: "B.111.783.391.7",
        otoPortId: "3",
        routerSerialNumber: "GFAB11004892",
        oldRouterSerialNumber: "GFAB12007637",
        lexId: "69VEV",
        oltName: "1",
        oltBoard: "2",
        ponPort: "14",
        breakoutCableId: "KP100314-C0036",
        fiberNumber: "8",
        status: "OUT",
        odfId: "OHDF 1.99",
        option82: "VD_9217-69VEV-OLT1:1381 xpon 0/2/0/14:8.1.69",
        oltObject: "VD_9217-69VEV-OLT1",
        ontConfigurationFilename: "VD_9217_69VEV_OLT1_2_0_14_8.cfg",
        svlan: "1381",
        customerId: "21744581",
        lineState: "BNG",
        crossConnexion: {
            Equipment: "OHDF 1.99",
            Rack: "1.99",
            Slot: "29",
            Port: "23"
        },
        routerStatus: ""
    }
});

export const TEST_VTI_MISSING_HEALTHCHECK_IMPORT_PAYLOAD = Object.freeze({
    client: {
        contractorNumber: "31447756",
        title: "Mr.",
        firstName: "Peter manuel",
        lastName: "BILLIG",
        mobile: "078 912 56 85",
        address: "67 Avenue de Gilamont, 1800 Vevey",
        email: "pierremb@gmail.com",
        communicationLanguage: "FR",
        eligibilitySource: "ALO"
    },
    contact: {
        communicationLanguage: "FR",
        eligibilitySource: "ALO",
        publicId: "28453061",
        error: "Missing healthcheck data for incomplete VTI test"
    }
});

const TEST_SO_ATTACHMENTS = Object.freeze([
    {
        name: "photo-test-1.jpg",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
        type: "image",
        size: "1.8MB",
        messageDate: "13.06.2026 10:12"
    },
    {
        name: "photo-test-2.jpg",
        url: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200",
        type: "image",
        size: "2.1MB",
        messageDate: "13.06.2026 10:15"
    },
    {
        name: "photo-test-3.jpg",
        url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200",
        type: "image",
        size: "1.4MB",
        messageDate: "12.06.2026 17:40"
    }
]);

const TEST_SO_NORMAL_EXTERNAL_FIELDS = Object.freeze({
    flagging: "VALID",
    data: "2026-06-13",
    customer: "31447756",
    soTicket: TEST_SO_TICKET_ID,
    SignalStatus: "Lost",
    LedStatus: "Fiber Off",
    treatmentStep: "Other",
    boxType: "X6",
    partner: "ALO",
    partnerTicketNumber: "PT-99",
    lexId: "69VEV",
    oltName: "1",
    oltBoard: "2",
    bokBof: "KP100314-C0036|8",
    comment: "Normal import test"
});

const TEST_SO_CONFLICT_EXTERNAL_FIELDS = Object.freeze({
    flagging: "VALID",
    data: "2026-06-13",
    customer: "99999999",
    soTicket: "SO-WRONG",
    SignalStatus: "Lost",
    LedStatus: "Fiber Off",
    treatmentStep: "Other",
    boxType: "X6",
    partner: "ALO",
    partnerTicketNumber: "PT-99",
    lexId: "69VEV",
    oltName: "OLT-GVA-01",
    oltBoard: "1/2/3",
    bokBof: "BOK|BOF|12",
    comment: "Comment"
});

export const TEST_SO_IMPORT_PAYLOAD = Object.freeze({
    ticketId: TEST_SO_TICKET_ID,
    contractorNumber: "31447756",
    externalTicketId: buildExternalCode(TEST_SO_NORMAL_EXTERNAL_FIELDS),
    attachments: TEST_SO_ATTACHMENTS
});

export const TEST_SO_CONFLICT_IMPORT_PAYLOAD = Object.freeze({
    ticketId: TEST_SO_TICKET_ID,
    contractorNumber: "99999999",
    externalTicketId: buildExternalCode(TEST_SO_CONFLICT_EXTERNAL_FIELDS),
    attachments: TEST_SO_ATTACHMENTS
});

export const TEST_SO_MISSING_EXTERNAL_ID_IMPORT_PAYLOAD = Object.freeze({
    ticketId: TEST_SO_TICKET_ID,
    contractorNumber: "31447756",
    attachments: TEST_SO_ATTACHMENTS
});

export const TEST_SO_INVALID_EXTERNAL_ID_IMPORT_PAYLOAD = Object.freeze({
    ticketId: TEST_SO_TICKET_ID,
    contractorNumber: "31447756",
    externalTicketId: "INVALID-EXTERNAL-ID-FOR-TEST",
    attachments: TEST_SO_ATTACHMENTS
});

export const TEST_IMPORT_SCENARIOS = Object.freeze([
    {
        id: "normal",
        title: "Normal capture",
        summary: "SO and VTI match. Use this for the standard import flow without conflict popup.",
        soPayload: TEST_SO_IMPORT_PAYLOAD,
        vtiPayload: TEST_VTI_IMPORT_PAYLOAD
    },
    {
        id: "conflict",
        title: "Conflict capture",
        summary: "SO External ID disagrees with VTI values. Use this only to test the conflict resolver.",
        soPayload: TEST_SO_CONFLICT_IMPORT_PAYLOAD,
        vtiPayload: TEST_VTI_IMPORT_PAYLOAD
    },
    {
        id: "missing-external-id",
        title: "SO missing External ID",
        summary: "SO has ticket/photos but no External ID. The app should keep SO data and ask to generate the External ID manually.",
        soPayload: TEST_SO_MISSING_EXTERNAL_ID_IMPORT_PAYLOAD,
        vtiPayload: TEST_VTI_IMPORT_PAYLOAD
    },
    {
        id: "invalid-external-id",
        title: "SO invalid External ID",
        summary: "SO has a bad External ID. The app should ignore only that ID and keep ticket/photos.",
        soPayload: TEST_SO_INVALID_EXTERNAL_ID_IMPORT_PAYLOAD,
        vtiPayload: TEST_VTI_IMPORT_PAYLOAD
    },
    {
        id: "missing-vti-healthcheck",
        title: "VTI missing healthcheck",
        summary: "VTI has customer/contact data but no healthcheck block. Use it to test incomplete VTI data.",
        vtiPayload: TEST_VTI_MISSING_HEALTHCHECK_IMPORT_PAYLOAD
    }
]);

export function getTestImportScenario(id) {
    return TEST_IMPORT_SCENARIOS.find((scenario) => scenario.id === id) || null;
}

export function formatTestImportPayload(payload) {
    return JSON.stringify(payload, null, 2);
}
