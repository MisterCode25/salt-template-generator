import assert from "node:assert/strict";
import { IMPORTED_EXTERNAL_ID_KEY, MANUAL_CLIENT_INPUTS_KEY } from "../src/services/activeClientService.js";
import {
  getClientInternalTokenData,
  getClientLanguageCode,
  getClientInfoSections,
  getClientSummaryFields,
  matchClientDataToTokens,
  parseClientClipboardJSON
} from "../src/utils/clientClipboard.js";

const sampleClientJSON = {
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
};

{
  const parsed = parseClientClipboardJSON(JSON.stringify(sampleClientJSON));
  assert.equal(parsed.client.firstName, "Peter manuel");
}

{
  const parsed = parseClientClipboardJSON(`Voici le JSON:\n\n\`\`\`json\n${JSON.stringify(sampleClientJSON, null, 2)}\n\`\`\``);
  assert.equal(parsed.healthcheck.otoId, "B.111.783.391.7");
}

{
  const parsed = parseClientClipboardJSON(`Oui, voilà :

\`\`\`json
${JSON.stringify(sampleClientJSON, null, 2)}
\`\`\``);
  assert.equal(parsed.client.contractorNumber, "31447756");
  assert.equal(parsed.healthcheck.otoPortId, "3");
}

{
  const parsed = parseClientClipboardJSON(`Oui, voilà :

json
${JSON.stringify(sampleClientJSON, null, 2)}`);
  assert.equal(parsed.client.firstName, "Peter manuel");
  assert.equal(parsed.healthcheck.otoId, "B.111.783.391.7");
}

{
  assert.throws(
    () => parseClientClipboardJSON("{bad"),
    /valid VTI data/
  );
  assert.throws(
    () => parseClientClipboardJSON("[]"),
    /must be an object/
  );
}

{
  const sections = getClientInfoSections(sampleClientJSON);
  const client = sections.find((section) => section.id === "client");
  const contact = sections.find((section) => section.id === "contact");
  const technical = sections.find((section) => section.id === "technical");
  const crossConnection = sections.find((section) => section.id === "crossConnection");

  assert.ok(client.fields.some((field) => field.label === "Full name" && field.value === "Peter manuel BILLIG"));
  assert.ok(client.fields.some((field) => field.label === "Activation date" && field.value === "2026-06-20"));
  assert.ok(contact.fields.some((field) => field.label === "Contact eligibility" && field.value === "ALO (SIG)"));
  assert.ok(contact.fields.some((field) => field.label === "Eligibility ordering" && field.value === "35"));
  assert.ok(contact.fields.some((field) => field.label === "Public ID" && field.value === "28453061"));
  assert.ok(contact.fields.some((field) => field.label === "Fixed number" && field.value === "41788451664"));
  assert.ok(technical.fields.some((field) => field.label === "OTO ID" && field.value === "B.111.783.391.7"));
  assert.ok(crossConnection.fields.some((field) => field.label === "Port" && field.value === "23"));
}

{
  const nextShapeJSON = {
    ...sampleClientJSON,
    client: {
      ...sampleClientJSON.client,
      billingProfile: "VIP"
    },
    contact: {
      ...sampleClientJSON.contact,
      preferredSlot: "Morning"
    },
    healthcheck: {
      ...sampleClientJSON.healthcheck,
      diagnostics: {
        signalQuality: "GOOD"
      }
    }
  };
  const sections = getClientInfoSections(nextShapeJSON);
  const vtiData = sections.find((section) => section.id === "vtiData");
  const summary = getClientSummaryFields(nextShapeJSON);

  assert.ok(vtiData.fields.some((field) => field.label === "client billing Profile" && field.value === "VIP"));
  assert.ok(vtiData.fields.some((field) => field.label === "contact preferred Slot" && field.value === "Morning"));
  assert.ok(vtiData.fields.some((field) => field.label === "healthcheck diagnostics signal Quality" && field.value === "GOOD"));
  assert.equal(summary.some((field) => field.label === "billing Profile"), false);
}

{
  const summary = getClientSummaryFields(sampleClientJSON);
  assert.equal(summary.find((field) => field.label === "Name").value, "Mr. Peter manuel BILLIG");
  assert.equal(summary.find((field) => field.label === "Sex"), undefined);
  assert.equal(summary.find((field) => field.label === "Language"), undefined);
  assert.equal(summary.find((field) => field.label === "Mobile").value, "078 912 56 85");
  assert.equal(summary.find((field) => field.label === "Contractor").value, "31447756");
  assert.equal(summary.find((field) => field.label === "Activation").value, "20.06.2026");
  assert.equal(summary.find((field) => field.label === "OTO ID").value, "B.111.783.391.7");
  assert.equal(summary.find((field) => field.label === "Port").value, "3");
  assert.equal(getClientLanguageCode(sampleClientJSON), "fr");
}

{
  const { tokenDefs, values } = getClientInternalTokenData(sampleClientJSON);
  const tokenMap = new Map(tokenDefs.map((tokenDef) => [tokenDef.token, tokenDef]));

  assert.equal(values["{client_first_name}"], "Peter manuel");
  assert.equal(values["{healthcheck_oto_id}"], "B.111.783.391.7");
  assert.equal(values["{healthcheck_cross_connexion_port}"], "23");
  assert.equal(values["{contact_error}"], "");
  assert.equal(tokenMap.get("{client_first_name}").label, "First name");
  assert.equal(tokenMap.get("{client_sex}").label, "Sex");
  assert.equal(tokenMap.get("{healthcheck_oto_id}").label, "OTO ID");
  assert.ok(tokenMap.get("{client_first_name}").searchAliases.includes("prenom"));
  assert.ok(tokenMap.get("{client_last_name}").searchAliases.includes("nom"));
  assert.ok(tokenMap.get("{client_sex}").searchAliases.includes("sexe"));
  assert.equal(tokenMap.get("{client_first_name}").previewValue, "Peter manuel");
  assert.equal(tokenMap.get("{healthcheck_oto_id}").previewValue, "B.111.783.391.7");
  assert.equal(tokenMap.get("{client_first_name}").display_mode, "on_demand");
  assert.equal(tokenMap.get("{healthcheck_cross_connexion_port}").internal, true);
}

{
  const { values, matchedTokens } = matchClientDataToTokens(sampleClientJSON, [
    { token: "{customer_name}", label: "Customer" },
    { token: "{first_name}", label: "First name" },
    { token: "{lastName}", label: "Last name" },
    { token: "{contractor}", label: "Contractor" },
    { token: "{activation_date}", label: "Activation" },
    { token: "{oto_id}", label: "OTO" },
    { token: "{cross_connection_port}", label: "Cross port" },
    { token: "{unknown}", label: "Unknown" }
  ]);

  assert.equal(values["{customer_name}"], "Peter manuel BILLIG");
  assert.equal(values["{first_name}"], "Peter manuel");
  assert.equal(values["{lastName}"], "BILLIG");
  assert.equal(values["{contractor}"], "31447756");
  assert.equal(values["{activation_date}"], "2026-06-20");
  assert.equal(values["{oto_id}"], "B.111.783.391.7");
  assert.equal(values["{cross_connection_port}"], "23");
  assert.equal(matchClientDataToTokens(sampleClientJSON, [
    { token: "{client_first_name}", label: "Internal first name" },
    { token: "{healthcheck_router_serial_number}", label: "Internal router" }
  ]).values["{healthcheck_router_serial_number}"], "GFAB11004892");
  assert.equal(values["{unknown}"], undefined);
  assert.equal(matchedTokens.length, 7);
}

{
  const payloadWithManualInputs = {
    ...sampleClientJSON,
    [IMPORTED_EXTERNAL_ID_KEY]: "VALID//26.02.2026//123//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment",
    [MANUAL_CLIENT_INPUTS_KEY]: {
      ticket_num: "SO-123",
      so_number: "SO-123"
    }
  };
  const { values } = matchClientDataToTokens(payloadWithManualInputs, [
    { token: "{so_ticket_num}", label: "SO ticket number" }
  ]);
  const internal = getClientInternalTokenData(payloadWithManualInputs);
  const vtiData = getClientInfoSections(payloadWithManualInputs).find((section) => section.id === "vtiData");

  assert.equal(values["{so_ticket_num}"], "SO-123");
  assert.equal(internal.values["{so_ticket_num}"], "SO-123");
  assert.equal(
    internal.tokenDefs.find((tokenDef) => tokenDef.token === "{so_ticket_num}").previewValue,
    "SO-123"
  );
  assert.equal(internal.values["{ticket_num}"], undefined);
  assert.equal(internal.values["{so_number}"], undefined);
  assert.equal(internal.values["{__imported_external_id}"], undefined);
  assert.equal(Boolean(vtiData?.fields.some((field) => field.label.includes("template Inputs"))), false);
  assert.equal(Boolean(vtiData?.fields.some((field) => field.value.includes("VALID//26.02.2026"))), false);
}

{
  const payloadWithImportedExternalIdOnly = {
    client: {
      firstName: "Peter"
    },
    [IMPORTED_EXTERNAL_ID_KEY]: "VALID//26.02.2026//12345678//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment"
  };
  const summary = getClientSummaryFields(payloadWithImportedExternalIdOnly);
  const sections = getClientInfoSections(payloadWithImportedExternalIdOnly);
  const contractorSummary = summary.find((field) => field.label === "Contractor");
  const contractorField = sections
    .find((section) => section.id === "client")
    ?.fields.find((field) => field.label === "Contractor");

  assert.equal(contractorSummary.value, "12345678");
  assert.equal(contractorField.value, "12345678");
}

{
  const payloadWithVtiAndImportedExternalId = {
    client: {
      contractorNumber: "31447756"
    },
    [IMPORTED_EXTERNAL_ID_KEY]: "VALID//26.02.2026//99999999//SO1//Lost//Fiber Off//Other//X6//EWB//ABC//L1//OLT//1//BOK|BOF//Comment"
  };
  const contractorSummary = getClientSummaryFields(payloadWithVtiAndImportedExternalId)
    .find((field) => field.label === "Contractor");
  const contractorField = getClientInfoSections(payloadWithVtiAndImportedExternalId)
    .find((section) => section.id === "client")
    ?.fields.find((field) => field.label === "Contractor");

  assert.equal(contractorSummary.value, "31447756");
  assert.equal(contractorField.value, "31447756");
}

console.log("clientClipboard tests passed");
