import assert from "node:assert/strict";
import { PARTNERS } from "../src/data/partnersData.js";
import { partnerMatchesQuery } from "../src/utils/partnerSearch.js";

const uniquePartners = [...new Set(PARTNERS.map((partner) => partner["Firma Entität"]))];

assert.ok(uniquePartners.length > 0, "partners dataset should not be empty");
assert.equal(
    uniquePartners.some((name) => name.toLowerCase() === "alo"),
    false,
    "ALO is currently missing from src/data/partnersData.js"
);

assert.equal(PARTNERS.filter((partner) => partnerMatchesQuery(partner, "SEY")).length > 0, true, "uppercase search should match existing partner");
assert.equal(PARTNERS.filter((partner) => partnerMatchesQuery(partner, "sey")).length > 0, true, "lowercase search should match existing partner");
assert.equal(PARTNERS.filter((partner) => partnerMatchesQuery(partner, "ALO")).length, 0, "search cannot return ALO because no ALO row exists");

console.log("partnersData tests passed");
