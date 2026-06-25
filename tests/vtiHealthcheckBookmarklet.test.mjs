import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const bookmarklet = readFileSync(new URL("../src/data/vtiHealthcheckBookmarklet.txt", import.meta.url), "utf8").trim();

function extractFunction(name, nextName) {
  const start = bookmarklet.indexOf(`function ${name}`);
  const end = bookmarklet.indexOf(`function ${nextName}`, start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return Function(`${bookmarklet.slice(start, end)}; return ${name};`)();
}

function fakeElement(value = "", attributes = {}) {
  return {
    value,
    getAttribute(name) {
      return attributes[name] ?? null;
    }
  };
}

function fakeDocument({
  html = "",
  moduleValue = "",
  recordId = "",
  recordLabelTitle = "",
  isContactsBody = false
} = {}) {
  return {
    body: {
      innerHTML: html,
      classList: {
        contains(name) {
          return name === "module_Contacts" && isContactsBody;
        }
      }
    },
    querySelector(selector) {
      if (selector === "#module" && moduleValue) return fakeElement(moduleValue);
      if (selector === "#recordId" && recordId) return fakeElement(recordId, { value: recordId });
      if (selector === ".recordLabel[title]" && recordLabelTitle) {
        return fakeElement("", { title: recordLabelTitle });
      }
      return null;
    }
  };
}

const getContactRecordIdFromDoc = extractFunction("getContactRecordIdFromDoc", "textOf");

{
  const doc = fakeDocument({
    recordId: "99999999",
    moduleValue: "Billing",
    html: '<a href="index.php?module=Contacts&view=Detail&record=59647132">Contact Details</a>'
  });

  assert.equal(getContactRecordIdFromDoc(doc), "59647132");
}

{
  const doc = fakeDocument({
    recordId: "59647132",
    moduleValue: "Contacts",
    isContactsBody: true,
    html: '<input type="hidden" id="module" value="Contacts">'
  });

  assert.equal(getContactRecordIdFromDoc(doc), "59647132");
}

{
  const doc = fakeDocument({
    recordId: "99999999",
    moduleValue: "Billing",
    html: "<div>Billing Account information</div>"
  });

  assert.equal(getContactRecordIdFromDoc(doc), "");
}

{
  const doc = fakeDocument({
    recordLabelTitle: "50895045",
    html: "<div>Legacy numeric record label</div>"
  });

  assert.equal(getContactRecordIdFromDoc(doc), "50895045");
}

console.log("vtiHealthcheckBookmarklet tests passed");
