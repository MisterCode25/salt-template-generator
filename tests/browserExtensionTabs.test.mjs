import assert from "node:assert/strict";
import {
  CAPTURE_TAB_ERROR,
  classifyCaptureTab,
  classifyWorkflowTab,
  selectReusableWorkflowTab,
  selectUniqueCaptureTabs
} from "../browser-extension/tabDiscovery.js";
import {
  buildSuperOfficeTicketUrl,
  getCapturedSuperOfficeTicketNumber,
  normalizeSuperOfficeTicketNumber
} from "../shared/superOfficeTicketNavigation.js";

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
  assert.throws(() => buildSuperOfficeTicketUrl("ticket inconnu"), /numéro de ticket/i);

  assert.equal(getCapturedSuperOfficeTicketNumber({ ticketId: "28958607" }), "28958607");
  assert.equal(getCapturedSuperOfficeTicketNumber({ sourceTicketId: "#28958607" }), "28958607");
  assert.equal(getCapturedSuperOfficeTicketNumber({}), "");
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
