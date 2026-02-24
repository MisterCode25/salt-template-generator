import assert from "node:assert/strict";
import fs from "node:fs";
import { mapPartnersByThemeToRows } from "../src/data/partnersData.js";
import { partnerMatchesQuery } from "../src/utils/partnerSearch.js";

const source = JSON.parse(fs.readFileSync(new URL("../public/partners.json", import.meta.url), "utf8"));
const partners = mapPartnersByThemeToRows(source);

assert.ok(Array.isArray(source) && source.length > 0, "partners.json should contain entries");
assert.ok(partners.length > 0, "mapped partners should not be empty");

assert.equal(partners.some((p) => p["Firma Entität"] === "ALO"), true, "ALO must exist in dataset");
assert.equal(partners.filter((p) => partnerMatchesQuery(p, "alo")).length > 0, true, "lowercase alo should match");
assert.equal(partners.filter((p) => partnerMatchesQuery(p, "ALO")).length > 0, true, "uppercase ALO should match");

console.log("partnersData tests passed");
