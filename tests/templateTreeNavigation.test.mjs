import assert from "node:assert/strict";

const {
  buildTemplateTreeSearchIndex,
  getAvailableTemplateChannels,
  getNodeCardSummary,
  getNodePath,
  getTemplatePath,
  resolveChannelModel,
  searchTemplateTree,
  searchTemplateTreeIndex
} = await import("../src/utils/templateTreeNavigation.js");

const nodes = [
  { id: "root", parentId: null, title: "No signal", description: "", icon: "", order: 1 },
  { id: "child", parentId: "root", title: "Request OTO photo", description: "", icon: "", order: 1 }
];

const treeTemplate = {
  id: "leaf",
  parentNodeId: "child",
  nodeIds: ["child"],
  title: "Customer unreachable",
  description: "Call failed",
  channels: ["email", "sms"],
  contentByChannel: {
    email: {
      id: "email-content",
      type: "email",
      title: "Customer unreachable"
    },
    sms: {
      id: "sms-content",
      type: "sms",
      title: "Customer unreachable"
    }
  }
};

assert.deepEqual(getNodePath(nodes, "child").map((node) => node.id), ["root", "child"]);
assert.deepEqual(getTemplatePath(nodes, treeTemplate).map((node) => node.id), ["root", "child"]);
assert.deepEqual(getNodeCardSummary(nodes, [treeTemplate], "root"), { childCount: 1, templateCount: 0 });
assert.deepEqual(getNodeCardSummary(nodes, [treeTemplate], "child"), { childCount: 0, templateCount: 1 });

assert.equal(resolveChannelModel(treeTemplate, "sms").id, "sms-content");
assert.equal(resolveChannelModel(treeTemplate, "email").id, "email-content");
assert.equal(resolveChannelModel(treeTemplate, "other"), null);
assert.deepEqual(getAvailableTemplateChannels(treeTemplate), ["email", "sms"]);

const searchResults = searchTemplateTree(nodes, [treeTemplate], "oto");
assert.deepEqual(searchResults.nodes.map((node) => node.id), ["child"]);
assert.deepEqual(searchTemplateTree(nodes, [treeTemplate], "sms").templates.map((template) => template.id), ["leaf"]);

const searchIndex = buildTemplateTreeSearchIndex(nodes, [treeTemplate]);
assert.deepEqual(searchTemplateTreeIndex(searchIndex, "call").templates.map((template) => template.id), ["leaf"]);
assert.deepEqual(searchTemplateTreeIndex(searchIndex, "signal").nodes.map((node) => node.id), ["root"]);

console.log("templateTreeNavigation tests passed");
