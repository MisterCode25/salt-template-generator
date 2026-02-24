import assert from "node:assert/strict";
import fs from "node:fs";
import { mapPartnersByThemeToRows } from "../src/data/partnersData.js";
import { partnerMatchesQuery } from "../src/utils/partnerSearch.js";

const source = JSON.parse(fs.readFileSync(new URL("../public/partners.json", import.meta.url), "utf8"));
const partners = mapPartnersByThemeToRows(source);

const samplePartner = partners.find((partner) => partner["Firma Entität"] === "SEY");

assert.equal(partnerMatchesQuery(samplePartner, "sey"), true, "matches lowercase name");
assert.equal(partnerMatchesQuery(samplePartner, "SeY"), true, "matches mixed-case name");
assert.equal(partnerMatchesQuery(samplePartner, "MANUAL-5"), true, "matches generated ALA-P ID");
assert.equal(partnerMatchesQuery(samplePartner, "Yverdon-les-bains"), true, "matches email/domain text");
assert.equal(partnerMatchesQuery(samplePartner, "inexistant"), false, "non-matching query should return false");

console.log("partnerSearch tests passed");
