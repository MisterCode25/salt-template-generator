import assert from "node:assert/strict";
import {
  CLIENT_BAR_FIELD_LIMIT,
  excludeCaseReferenceFields,
  limitClientBarFieldKeys
} from "../src/utils/clientBarSelection.js";

assert.equal(CLIENT_BAR_FIELD_LIMIT, 16);

{
  const keys = Array.from({ length: 20 }, (_value, index) => `field-${index + 1}`);
  const limitedKeys = limitClientBarFieldKeys(keys);

  assert.equal(limitedKeys.length, 16);
  assert.equal(limitedKeys[0], "field-1");
  assert.equal(limitedKeys.at(-1), "field-16");
  assert.equal(keys.length, 20);
}

assert.deepEqual(limitClientBarFieldKeys(null), []);

{
  const fields = [
    { label: "Name", value: "Ana Muster" },
    { label: "Contractor", value: "31447756" },
    { label: "SO ticket number", value: "31436062" },
    { label: "Router serial", value: "GFAB11004892" }
  ];

  assert.deepEqual(excludeCaseReferenceFields(fields), [
    { label: "Name", value: "Ana Muster" },
    { label: "Router serial", value: "GFAB11004892" }
  ]);
  assert.equal(fields.length, 4);
}

console.log("clientBarSelection tests passed");
