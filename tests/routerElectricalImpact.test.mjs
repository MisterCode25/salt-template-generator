import assert from "node:assert/strict";
import {
    getRouterElectricalImpact,
    isX6RouterSerial
} from "../src/utils/routerElectricalImpact.js";

assert.equal(isX6RouterSerial("GFAB23600001"), true);
assert.equal(isX6RouterSerial(" gfab23600001 "), true);
assert.equal(isX6RouterSerial("GFAC23600001"), false);

assert.deepEqual(getRouterElectricalImpact("GFAB23600001"), {
    isImpacted: true,
    label: "Impacted"
});
assert.deepEqual(getRouterElectricalImpact("GFAB32209601"), {
    isImpacted: true,
    label: "Impacted"
});
assert.deepEqual(getRouterElectricalImpact("GFAB24209650"), {
    isImpacted: false,
    label: "Non impacted"
});
assert.deepEqual(getRouterElectricalImpact("GFAB99999999"), {
    isImpacted: false,
    label: "Non impacted"
});
assert.equal(getRouterElectricalImpact("GFAC23600001"), null);
assert.equal(getRouterElectricalImpact(""), null);

console.log("routerElectricalImpact tests passed");
