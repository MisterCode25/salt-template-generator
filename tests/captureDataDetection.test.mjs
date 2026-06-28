import assert from "node:assert/strict";
import { CAPTURE_DATA_TYPE, classifyCaptureClipboardText } from "../src/utils/captureDataDetection.js";

const vtiPayload = {
  client: {
    contractorNumber: "31447756",
    firstName: "Peter",
    lastName: "Billig"
  },
  contact: {
    communicationLanguage: "FR"
  },
  healthcheck: {
    otoId: "B.111.783.391.7"
  }
};

const soPayload = {
  ticketId: "31436062",
  contractorNumber: "31447756",
  createdAt: "6/4/2026 12:07 PM",
  attachments: []
};

{
  const result = classifyCaptureClipboardText(JSON.stringify(soPayload));
  assert.equal(result.type, CAPTURE_DATA_TYPE.SUPER_OFFICE);
  assert.equal(result.result.ok, true);
  assert.equal(result.result.ticketId, "31436062");
  assert.equal(result.result.contractorNumber, "31447756");
}

{
  const result = classifyCaptureClipboardText(`\`\`\`json\n${JSON.stringify(vtiPayload)}\n\`\`\``);
  assert.equal(result.type, CAPTURE_DATA_TYPE.CLIENT);
  assert.equal(result.payload.client.contractorNumber, "31447756");
  assert.equal(result.payload.healthcheck.otoId, "B.111.783.391.7");
}

{
  const result = classifyCaptureClipboardText("{ bad json");
  assert.equal(result.type, CAPTURE_DATA_TYPE.UNKNOWN);
  assert.match(result.error, /valid VTI data|Customer data|Clipboard/);
}

console.log("captureDataDetection tests passed");
