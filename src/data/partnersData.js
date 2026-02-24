export const PARTNER_COLUMNS = [
    "Firma Entität",
    "ALA-P ID",
    "Thema",
    "Unit/Rolle",
    "Telefon",
    "Email",
    "Verfügbarkeit",
    "Bemerkung"
];

const PARTNERS_BY_THEME = [
    {
        partner: "ewb",
        themes: [
            { name: "Incident management", unit_role: "Incident Management / Leitstelle", telefon: "+41 31 321 38 08", email: "lsm_incident@ewb.ch", availability: "7*24" },
            { name: "Incident management", unit_role: "Incident management", telefon: "+41 31 321 38 08", email: "incidentinfo@ewb.ch", availability: "Business hours" },
            { name: "Fulfillment Management", unit_role: "Fulfillment Manager", telefon: "+41 31 321 35 91", email: "telecomorderdesk@ewb.ch", availability: "Business hours" }
        ]
    },
    {
        partner: "ewl",
        themes: [
            { name: "Incident management", unit_role: "Glasfaser Betrieb", telefon: "0800 395 395", email: "ftth.stoerung@ewl-luzern.ch", availability: "Business hours" },
            { name: "Fulfillment Management", unit_role: "Glasfaser Betrieb", telefon: "0800 395 395", email: "ftth.anschluss@ewl-luzern.ch", availability: "Business hours" }
        ]
    },
    {
        partner: "sgsw",
        themes: [
            { name: "Incident management", unit_role: "Layer 1 BD", telefon: "+41 74 029 07 09 (Pager)", email: "bd.telecom@sgsw.ch", availability: "7*24 (Pager), Email (Business hours)" },
            { name: "Fulfillment Management", unit_role: "Change Manager", telefon: "071 224 62 64", email: "order.telecom@sgsw.ch", availability: "Business hours" }
        ]
    },
    {
        partner: "Didico (EWM)",
        themes: [
            { name: "Incident management", unit_role: "Support Desk", telefon: "+41 44 512 61 15", email: "fibx@didico.ch", availability: "" },
            { name: "Fulfillment Management", unit_role: "Support Desk", telefon: "+41 44 512 61 15", email: "fibx@didico.ch", availability: "Business hours" }
        ]
    },
    {
        partner: "Danet",
        themes: [
            { name: "Incident management", unit_role: "Service Desk", telefon: "41 27 924 11 88", email: "info@danet-oberwallis.ch", availability: "Business hours" },
            { name: "Fulfillment Management", unit_role: "Service Desk", telefon: "41 27 924 11 88", email: "info@danet-oberwallis.ch", availability: "Business hours" }
        ]
    },
    {
        partner: "GAW",
        themes: [
            { name: "Incident management", unit_role: "Kundenservice KDS / Betrieb", telefon: "+41 32 9 429 426", email: "partnernetz@ga-weissenstein.ch", availability: "7*24 German (Telefon)" },
            { name: "Fulfillment Management", unit_role: "FttH / Migration", telefon: "+41 32 9 429 470", email: "ftth@ga-weissenstein.ch", availability: "Mo-Fr 09:00-12:00 und 13:00-17:00" }
        ]
    },
    {
        partner: "Leucom Stafag",
        themes: [
            { name: "Incident management", unit_role: "Leiter Operations", telefon: "+41 52 552 98 54", email: "patchauftrag@leucom.ch", availability: "Mo. – Fr. 08.00 – 12.00 / 13.00 – 16.30" },
            { name: "Fulfillment Management", unit_role: "Leiter Operations", telefon: "+41 52 552 98 54", email: "patchauftrag@leucom.ch", availability: "Mo. – Fr. 08.00 – 12.00 / 13.00 – 16.30" }
        ]
    },
    {
        partner: "SAK",
        themes: [
            { name: "Incident management", unit_role: "SPOC FTTH Inhouse", telefon: "+41 71 229 56 33", email: "oto.ftth@sak.ch", availability: "Business hours" },
            { name: "Fulfillment Management", unit_role: "", telefon: "+41 71 229 56 33", email: "oto.ftth@sak.ch", availability: "" }
        ]
    },
    {
        partner: "SWW",
        themes: [
            { name: "Incident management", unit_role: "Orderdesk", telefon: "+41 52 267 61 11", email: "assurance.telekom@win.ch", availability: "MO – FR 0800 bis 1700" },
            { name: "Fulfillment Management", unit_role: "Orderdesk", telefon: "+41 52 267 61 11", email: "orderdesk.telekom@win.ch", availability: "MO – FR 0800 bis 1700" }
        ]
    },
    {
        partner: "ftth fr",
        themes: [
            { name: "Incident management", unit_role: "Netzbetrieb", telefon: "+41 26 352 65 84 (5*8)\n+41 76 434 39 21 (ONLY out of business hours)", email: "ftth_operations@ftth-fr.ch", availability: "7*24" },
            { name: "Fulfillment Management", unit_role: "Netzbetrieb", telefon: "+41 26 352 65 84", email: "ftth_operations@ftth-fr.ch", availability: "Business hours" }
        ]
    },
    {
        partner: "SEY",
        themes: [
            { name: "Incident management", unit_role: "Exploitation FTTH", telefon: "024 423 65 43", email: "ftth@yverdon-les-bains.ch", availability: "Montag - Freitag : 07:00-12:00 / 13:30 – 17:00" },
            { name: "Incident management", unit_role: "Service de piquet", telefon: "024 423 65 77", email: "ftth@yverdon-les-bains.ch", availability: "Montag - Freitag : 17:00 – 07:00 et 12:00 – 13:30 + Samstag/Sonntag et Feiertage" },
            { name: "Fulfillment Management", unit_role: "Exploitation FTTH", telefon: "024 423 65 43", email: "ftth@yverdon-les-bains.ch", availability: "Montag - Freitag : 07:00-12:00 / 13:30 – 17:00" }
        ]
    },
    {
        partner: "SEIC",
        themes: [
            { name: "Incident management", unit_role: "service MM", telefon: "+41 22 364 31 31", email: "ftth_externe@seicgland.ch", availability: "7*24" },
            { name: "Fulfillment Management", unit_role: "service MM", telefon: "+41 22 364 31 31", email: "ftth_externe@seicgland.ch", availability: "7*24" }
        ]
    },
    {
        partner: "AMB",
        themes: [
            { name: "Incident management", unit_role: "Servicedesk", telefon: "+41 91 850 49 85", email: "ftth@amb.ch", availability: "08:30-11:30 / 14:00-17:00" },
            { name: "Fulfillment Management", unit_role: "Servicedesk", telefon: "+41 91 850 49 85", email: "ftth@amb.ch", availability: "08:30-11:30 / 14:00-17:00" }
        ]
    },
    {
        partner: "TBW",
        themes: [
            { name: "Incident management", unit_role: "Störungsbehebung", telefon: "+41 71 626 82 82", email: "daniel.keller@tbweinfelden.ch\nthomas.dudlitz@tbweinfelden.ch", availability: "" },
            { name: "Fulfillment Management", unit_role: "Aufschalten", telefon: "+41 71 626 82 82", email: "ff.ftth@tbweinfelden.ch", availability: "" }
        ]
    },
    {
        partner: "DWW",
        themes: [
            { name: "Incident management", unit_role: "Ordermanager", telefon: "+41 52 267 61 11", email: "assurance.telekom@win.ch", availability: "MO – FR 0800 bis 1700" },
            { name: "Fulfillment Management", unit_role: "Ordermanager", telefon: "+41 52 267 61 11", email: "orderdesk.wallisellen@win.ch", availability: "MO – FR 0800 bis 1700" }
        ]
    },
    {
        partner: "PGL",
        themes: [
            { name: "Incident management", unit_role: "Orderdesk", telefon: "+41 52 267 61 11", email: "assurance.telekom@win.ch", availability: "MO – FR 0800 bis 1700" },
            { name: "Fulfillment Management", unit_role: "Orderdesk", telefon: "+41 52 267 61 11", email: "orderdesk.lindau@win.ch", availability: "MO – FR 0800 bis 1700" }
        ]
    },
    {
        partner: "EWA",
        themes: [
            { name: "Incident management", unit_role: "Incident Management", telefon: "+41 32 391 60 30", email: "s_catv@ewaarberg.ch", availability: "7*24" },
            { name: "Fulfillment Management", unit_role: "Fulfillment Management", telefon: "+41 32 391 60 30", email: "s_catv@ewaarberg.ch", availability: "Business hours" }
        ]
    },
    {
        partner: "EWH",
        themes: [
            { name: "Incident management", unit_role: "Telekom Support", telefon: "+41 55 415 31 21", email: "sfn@ewh.ch", availability: "Bürozeiten\nMo-Fr 07:30-11:45 / 13:15-17:00" },
            { name: "Fulfillment Management", unit_role: "Telekom Support", telefon: "+41 55 415 31 21", email: "sfn@ewh.ch", availability: "Bürozeiten\nMo-Fr 07:30-11:45 / 13:15-17:00" }
        ]
    }
];

export const PARTNERS = PARTNERS_BY_THEME.flatMap((entry, partnerIndex) =>
    entry.themes.map((theme, themeIndex) => ({
        "Firma Entität": entry.partner,
        "ALA-P ID": `MANUAL-${partnerIndex + 1}-${themeIndex + 1}`,
        "Thema": theme.name,
        "Unit/Rolle": theme.unit_role,
        "Telefon": theme.telefon,
        "Email": theme.email,
        "Verfügbarkeit": theme.availability,
        "Bemerkung": ""
    }))
);
