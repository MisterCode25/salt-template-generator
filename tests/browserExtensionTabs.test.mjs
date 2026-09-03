import assert from "node:assert/strict";
import {
  CAPTURE_TAB_ERROR,
  classifyCaptureTab,
  classifyWorkflowTab,
  selectFirstCaptureTabs,
  selectReusableWorkflowTab
} from "../browser-extension/tabDiscovery.js";
import {
  buildSuperOfficeTicketUrl,
  getCapturedSuperOfficeTicketNumber,
  getSuperOfficeTicketNumberFromUrl,
  normalizeSuperOfficeTicketNumber
} from "../shared/superOfficeTicketNavigation.js";

const vtiTab = {
  id: 11,
  index: 1,
  url: "https://vti.salt.ch/index.php?module=Accounts&view=Detail",
  title: "VTI"
};
const superOfficeTab = {
  id: 12,
  index: 2,
  url: "https://online.superoffice.com/salt/default.aspx",
  title: "REQUEST 31436062"
};
const saltSuperOfficeTab = {
  id: 16,
  index: 3,
  url: "https://cs.salt.ch/scripts/ticket.fcgi?_sf=0&action=doScreenDefinition&idString=viewEmail&entryId=28958607",
  title: "REQUEST 28958607"
};

{
  assert.equal(normalizeSuperOfficeTicketNumber("28958607"), "28958607");
  assert.equal(normalizeSuperOfficeTicketNumber("# 28958607"), "28958607");
  assert.equal(normalizeSuperOfficeTicketNumber("REQUEST 28958607"), "");
  assert.equal(normalizeSuperOfficeTicketNumber(""), "");

  const url = new URL(buildSuperOfficeTicketUrl("#28958607"));
  assert.equal(url.origin, "https://cs.salt.ch");
  assert.equal(url.pathname, "/scripts/ticket.fcgi");
  assert.equal(url.searchParams.get("_sf"), "0");
  assert.equal(url.searchParams.get("action"), "doScreenDefinition");
  assert.equal(url.searchParams.get("idString"), "viewEmail");
  assert.equal(url.searchParams.get("entryId"), "28958607");
  assert.equal(url.searchParams.has("entryID"), false);
  assert.throws(() => buildSuperOfficeTicketUrl("unknown ticket"), /ticket number/i);

  assert.equal(getCapturedSuperOfficeTicketNumber({ ticketId: "28958607" }), "28958607");
  assert.equal(getCapturedSuperOfficeTicketNumber({ sourceTicketId: "#28958607" }), "28958607");
  assert.equal(getCapturedSuperOfficeTicketNumber({}), "");
  assert.equal(getSuperOfficeTicketNumberFromUrl(saltSuperOfficeTab.url), "28958607");
  assert.equal(getSuperOfficeTicketNumberFromUrl("https://cs.salt.ch/"), "");
  assert.equal(getSuperOfficeTicketNumberFromUrl("invalid"), "");
}

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
  }), "superOffice");
  assert.equal(classifyCaptureTab({
    id: 17,
    url: "https://cs.salt.ch/",
    title: "SuperOffice home"
  }), "superOffice");
  assert.equal(classifyCaptureTab({
    id: 18,
    url: "https://not-cs.salt.ch/scripts/ticket.fcgi",
    title: "Another Salt tool"
  }), null);
}

{
  assert.equal(classifyWorkflowTab({
    url: "https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do"
  }), "alo");
  assert.equal(classifyWorkflowTab({
    url: "https://www.ftthproxy.ch/#/assurance/ticket/1234"
  }), "alex");
  assert.equal(classifyWorkflowTab({ url: "https://example.com/" }), null);
}

{
  const selected = selectReusableWorkflowTab([
    { id: 21, url: "https://www.ftthproxy.ch/", active: false, lastAccessed: 10 },
    { id: 22, url: "https://www.ftthproxy.ch/help", active: true, lastAccessed: 5 },
    { id: 23, url: "https://example.com/", active: true, lastAccessed: 20 }
  ], "alex");

  assert.equal(selected.id, 22);
}

{
  const selection = selectFirstCaptureTabs([vtiTab, superOfficeTab]);

  assert.equal(selection.ok, true);
  assert.equal(selection.vtiTab.id, 11);
  assert.equal(selection.superOfficeTab.id, 12);
}

{
  const selection = selectFirstCaptureTabs([superOfficeTab]);
  assert.equal(selection.ok, false);
  assert.equal(selection.error, CAPTURE_TAB_ERROR.VTI_MISSING);
}

{
  const selection = selectFirstCaptureTabs([vtiTab]);
  assert.equal(selection.ok, false);
  assert.equal(selection.error, CAPTURE_TAB_ERROR.SUPER_OFFICE_MISSING);
}

{
  const selection = selectFirstCaptureTabs([
    { ...vtiTab, id: 21, index: 7, url: "https://vti.salt.ch/index.php?record=late" },
    { ...superOfficeTab, id: 22, index: 6 },
    { ...vtiTab, id: 23, index: 1, url: "https://vti.salt.ch/index.php?record=first" },
    { ...superOfficeTab, id: 24, index: 2, url: "https://saltsupport.superoffice.com/ticket/first" }
  ]);

  assert.equal(selection.ok, true);
  assert.equal(selection.superOfficeTab.id, 24);
  assert.equal(selection.vtiTab.id, 23);
}

{
  const preferredWindowId = 8;
  const selection = selectFirstCaptureTabs([
    { ...superOfficeTab, id: 31, windowId: 3, index: 0 },
    { ...vtiTab, id: 32, windowId: 3, index: 1 },
    { ...vtiTab, id: 33, windowId: preferredWindowId, index: 2 },
    { ...superOfficeTab, id: 34, windowId: preferredWindowId, index: 5 }
  ], preferredWindowId);

  assert.equal(selection.ok, true);
  assert.equal(selection.superOfficeTab.id, 34);
  assert.equal(selection.vtiTab.id, 33);
}

{
  const selection = selectFirstCaptureTabs([
    { ...vtiTab, id: 41, windowId: 8, index: 0 },
    { ...superOfficeTab, id: 42, windowId: 3, index: 1 }
  ], 8);

  assert.equal(selection.ok, true);
  assert.equal(selection.superOfficeTab.id, 42);
  assert.equal(selection.vtiTab.id, 41);
}

console.log("browserExtensionTabs tests passed");
