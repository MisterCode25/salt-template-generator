import assert from "node:assert/strict";
import {
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
    activationDate: "2026-06-20",
    eligibilitySource: "ALO",
    contactRecordId: "50895045"
  },
  contact: {
    communicationLanguage: "FR",
    eligibilitySource: "ALO",
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
  assert.throws(
    () => parseClientClipboardJSON("{bad"),
    /valid JSON/
  );
  assert.throws(
    () => parseClientClipboardJSON("[]"),
    /must be an object/
  );
}

{
  const sections = getClientInfoSections(sampleClientJSON);
  const client = sections.find((section) => section.id === "client");
  const technical = sections.find((section) => section.id === "technical");
  const crossConnection = sections.find((section) => section.id === "crossConnection");

  assert.ok(client.fields.some((field) => field.label === "Full name" && field.value === "Peter manuel BILLIG"));
  assert.ok(client.fields.some((field) => field.label === "Activation date" && field.value === "2026-06-20"));
  assert.ok(technical.fields.some((field) => field.label === "OTO ID" && field.value === "B.111.783.391.7"));
  assert.ok(crossConnection.fields.some((field) => field.label === "Port" && field.value === "23"));
}

{
  const summary = getClientSummaryFields(sampleClientJSON);
  assert.equal(summary.find((field) => field.label === "Name").value, "Mr. Peter manuel BILLIG");
  assert.equal(summary.find((field) => field.label === "Sex").value, "Male");
  assert.equal(summary.find((field) => field.label === "Language").value, "FR");
  assert.equal(summary.find((field) => field.label === "Mobile").value, "078 912 56 85");
  assert.equal(summary.find((field) => field.label === "Contractor").value, "31447756");
  assert.equal(summary.find((field) => field.label === "Activation").value, "2026-06-20");
  assert.equal(getClientLanguageCode(sampleClientJSON), "fr");
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
  assert.equal(values["{unknown}"], undefined);
  assert.equal(matchedTokens.length, 7);
}

console.log("clientClipboard tests passed");
