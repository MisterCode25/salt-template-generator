import assert from "node:assert/strict";
import { PARTNERS } from "../src/data/partnersData.js";
import { partnerMatchesQuery } from "../src/utils/partnerSearch.js";

const samplePartner = PARTNERS.find((partner) => partner["Firma Entität"] === "SEY");

assert.equal(partnerMatchesQuery(samplePartner, "sey"), true, "matches lowercase name");
assert.equal(partnerMatchesQuery(samplePartner, "SeY"), true, "matches mixed-case name");
assert.equal(partnerMatchesQuery(samplePartner, "MANUAL-11"), true, "matches ALA-P ID");
assert.equal(partnerMatchesQuery(samplePartner, "Yverdon-les-bains"), true, "matches email/domain text");
assert.equal(partnerMatchesQuery(samplePartner, "inexistant"), false, "non-matching query should return false");

console.log("partnerSearch tests passed");
