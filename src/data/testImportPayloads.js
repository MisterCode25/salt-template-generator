import { buildExternalCode } from "../utils/externalGenerator.js";

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

const TEST_SO_EXTERNAL_FIELDS = Object.freeze({
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
    ticketId: "31436062",
    externalTicketId: buildExternalCode(TEST_SO_EXTERNAL_FIELDS),
    attachments: [
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
    ]
});

export function formatTestImportPayload(payload) {
    return JSON.stringify(payload, null, 2);
}
