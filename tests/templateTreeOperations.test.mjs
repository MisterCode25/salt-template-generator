import assert from "node:assert/strict";

const {
  buildNodeChildrenIndex,
  buildNodeLookup,
  buildTemplateNodeIndex,
  canMoveNode,
  createNodeForParent,
  createTemplateForNode,
  duplicateTemplate,
  getChildNodes,
  getDescendantNodeIds,
  getIndexedChildNodes,
  getIndexedTemplatesForNode,
  getTemplatesForNode,
  moveNode,
  moveTemplateToNode,
  removeNodeCascade,
  removeTemplate,
  reorderNode,
  updateNode,
  updateTemplate
} = await import("../src/utils/templateTreeOperations.js");

let nodes = [];
const rootA = createNodeForParent(nodes, null, { id: "root-a", title: "No signal", order: 99 });
nodes = [...nodes, rootA];
const rootB = createNodeForParent(nodes, null, { id: "root-b", title: "Low prio" });
nodes = [...nodes, rootB];
const childA = createNodeForParent(nodes, "root-a", { id: "child-a", title: "Request OTO photo" });
nodes = [...nodes, childA];
const grandChildA = createNodeForParent(nodes, "child-a", { id: "grand-child-a", title: "Deep child" });
nodes = [...nodes, grandChildA];

assert.deepEqual(getChildNodes(nodes, null).map((node) => node.id), ["root-a", "root-b"]);
assert.deepEqual([...buildNodeLookup(nodes).keys()], ["root-a", "root-b", "child-a", "grand-child-a"]);
assert.deepEqual(getIndexedChildNodes(buildNodeChildrenIndex(nodes), null).map((node) => node.id), ["root-a", "root-b"]);
assert.deepEqual(getDescendantNodeIds(nodes, "root-a").sort(), ["child-a", "grand-child-a"]);
assert.equal(canMoveNode(nodes, "root-a", "grand-child-a"), false);
assert.equal(canMoveNode(nodes, "child-a", null), true);

nodes = updateNode(nodes, "root-a", { title: "No signal updated" });
assert.equal(nodes.find((node) => node.id === "root-a").title, "No signal updated");
assert.equal(nodes.find((node) => node.id === "root-b"), rootB);

nodes = moveNode(nodes, "child-a", null);
assert.equal(nodes.find((node) => node.id === "child-a").parentId, null);
assert.equal(nodes.find((node) => node.id === "grand-child-a").parentId, "child-a");

nodes = reorderNode(nodes, "child-a", "up");
assert.equal(getChildNodes(nodes, null)[1].id, "child-a");

let templates = [
  createTemplateForNode("child-a", {
    id: "tpl-a",
    title: "Customer unreachable",
    description: "Call failed",
    channels: ["sms", "other"],
    contentByChannel: {
      sms: {
        id: "sms-content",
        title: "Customer unreachable",
        type: "sms",
        mainVariantName: "",
        text_fr: "Bonjour",
        text_en: "Hello",
        text_de: "",
        text_it: "",
        variants: []
      }
    }
  }),
  createTemplateForNode("grand-child-a", {
    id: "tpl-deep",
    title: "Nested template",
    channels: ["email"]
  })
];

assert.deepEqual(getTemplatesForNode(templates, "child-a").map((template) => template.id), ["tpl-a"]);
assert.deepEqual(getIndexedTemplatesForNode(buildTemplateNodeIndex(templates), "child-a").map((template) => template.id), ["tpl-a"]);

const tplDeepBeforeUpdate = templates.find((template) => template.id === "tpl-deep");
templates = updateTemplate(templates, "tpl-a", { title: "Customer unreachable updated", channels: ["email"] });
assert.equal(templates.find((template) => template.id === "tpl-a").title, "Customer unreachable updated");
assert.deepEqual(templates.find((template) => template.id === "tpl-a").channels, ["email"]);
assert.equal(templates.find((template) => template.id === "tpl-deep"), tplDeepBeforeUpdate);

templates = updateTemplate(templates, "tpl-a", { title: "Customer unreachable", channels: ["sms", "other"] });

templates = moveTemplateToNode(templates, "tpl-a", "root-b", nodes);
assert.equal(templates.find((template) => template.id === "tpl-a").parentNodeId, "root-b");

templates = duplicateTemplate(templates, "tpl-a");
const copies = templates.filter((template) => template.title === "Customer unreachable copy");
assert.equal(copies.length, 1);
assert.deepEqual(copies[0].channels, ["sms", "other"]);
assert.equal(copies[0].contentByChannel.sms.text_en, "Hello");
assert.equal(copies[0].contentByChannel.other.title, "Customer unreachable copy");

templates = removeTemplate(templates, "tpl-a");
assert.equal(templates.some((template) => template.id === "tpl-a"), false);

const removed = removeNodeCascade(nodes, templates, "child-a");
assert.equal(removed.nodes.some((node) => node.id === "child-a"), false);
assert.equal(removed.nodes.some((node) => node.id === "grand-child-a"), false);
assert.equal(removed.templates.some((template) => template.id === "tpl-deep"), false);
assert.equal(removed.templates.some((template) => template.title === "Customer unreachable copy"), true);

assert.throws(
  () => moveTemplateToNode(templates, "tpl-deep", "missing-node", nodes),
  /Template target node does not exist/
);

console.log("templateTreeOperations tests passed");
