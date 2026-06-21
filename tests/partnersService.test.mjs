import assert from "node:assert/strict";
import { clearAppIndexedDB } from "../src/services/indexedDbService.js";
import {
  clearPartnersCache,
  loadPartners,
  normalizePartners,
  savePartners
} from "../src/services/partnersService.js";

await clearAppIndexedDB();
clearPartnersCache();

const normalizedRows = normalizePartners([
  {
    partner: "TEST",
    themes: [
      {
        name: "Incident management",
        unit_role: "NOC",
        telefon: "+41 00 000 00 00",
        email: "support@example.test",
        availability: "Business hours"
      }
    ]
  }
]);

assert.equal(normalizedRows.length, 1);
assert.equal(normalizedRows[0]["Firma Entität"], "TEST");
assert.equal(normalizedRows[0]["Thema"], "Incident management");

await savePartners(normalizedRows);
clearPartnersCache();

const loaded = await loadPartners();
assert.deepEqual(loaded, normalizedRows);

console.log("partnersService tests passed");
