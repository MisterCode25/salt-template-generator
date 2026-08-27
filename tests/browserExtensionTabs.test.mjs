import assert from "node:assert/strict";
import {
  CAPTURE_TAB_ERROR,
  classifyCaptureTab,
  selectUniqueCaptureTabs
} from "../browser-extension/tabDiscovery.js";

const vtiTab = {
  id: 11,
  url: "https://vti.salt.ch/index.php?module=Accounts&view=Detail",
  title: "VTI"
};
const superOfficeTab = {
  id: 12,
  url: "https://online.superoffice.com/salt/default.aspx",
  title: "REQUEST 31436062"
};
const saltSuperOfficeTab = {
  id: 16,
  url: "https://cs.salt.ch/scripts/ticket.fcgi?_sf=0&action=doScreenDefinition&idString=viewEmail&entryId=28958607",
  title: "REQUEST 28958607"
};

{
  assert.equal(classifyCaptureTab(vtiTab), "vti");
  assert.equal(classifyCaptureTab(superOfficeTab), "superOffice");
  assert.equal(classifyCaptureTab(saltSuperOfficeTab), "superOffice");
  assert.equal(classifyCaptureTab({
    id: 13,
    url: "https://example.com/",
    title: "Unrelated page"
  }), null);
  assert.equal(classifyCaptureTab({
    id: 14,
    url: "https://example.com/",
    title: "SuperOffice documentation"
  }), null);
  assert.equal(classifyCaptureTab({
    id: 15,
    url: "https://cs.salt.ch/scripts/customer.fcgi?action=doScreenDefinition",
    title: "Other CS page"
  }), null);
}

{
  const selection = selectUniqueCaptureTabs([vtiTab, superOfficeTab]);

  assert.equal(selection.ok, true);
  assert.equal(selection.vtiTab.id, 11);
  assert.equal(selection.superOfficeTab.id, 12);
}

{
  const selection = selectUniqueCaptureTabs([superOfficeTab]);
  assert.equal(selection.ok, false);
  assert.equal(selection.error, CAPTURE_TAB_ERROR.VTI_MISSING);
}

{
  const selection = selectUniqueCaptureTabs([
    vtiTab,
    { ...vtiTab, id: 14, url: "https://vti.salt.ch/index.php?record=2" },
    superOfficeTab
  ]);
  assert.equal(selection.ok, false);
  assert.equal(selection.error, CAPTURE_TAB_ERROR.VTI_AMBIGUOUS);
}

{
  const selection = selectUniqueCaptureTabs([
    vtiTab,
    superOfficeTab,
    { ...superOfficeTab, id: 15, url: "https://saltsupport.superoffice.com/ticket/2" }
  ]);
  assert.equal(selection.ok, false);
  assert.equal(selection.error, CAPTURE_TAB_ERROR.SUPER_OFFICE_AMBIGUOUS);
}

console.log("browserExtensionTabs tests passed");
