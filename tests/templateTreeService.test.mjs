import assert from "node:assert/strict";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

function createRequest() {
  return {
    result: undefined,
    error: null,
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null
  };
}

function createFakeIndexedDB() {
  const data = new Map();
  const objectStoreNames = {
    contains: () => true
  };
  const db = {
    objectStoreNames,
    createObjectStore: () => {},
    close: () => {},
    transaction: () => {
      const transaction = {
        error: null,
        oncomplete: null,
        onerror: null,
        onabort: null,
        abort: () => transaction.onabort?.(),
        objectStore: () => ({
          get: (key) => {
            const request = createRequest();
            setTimeout(() => {
              request.result = data.get(key);
              request.onsuccess?.();
            }, 0);
            return request;
          },
          put: (value, key) => {
            data.set(key, value);
            return createRequest();
          },
          delete: (key) => {
            data.delete(key);
            return createRequest();
          },
          clear: () => {
            data.clear();
            return createRequest();
          }
        })
      };
      setTimeout(() => transaction.oncomplete?.(), 2);
      return transaction;
    }
  };

  return {
    data,
    open: () => {
      const request = createRequest();
      setTimeout(() => {
        request.result = db;
        request.onupgradeneeded?.();
        request.onsuccess?.();
      }, 0);
      return request;
    }
  };
}

global.localStorage = new LocalStorageMock();
global.indexedDB = createFakeIndexedDB();

const {
  Channel,
  CHANNEL_VALUES,
  createNode,
  createTemplate,
  isChannel,
  normalizeChannels,
  normalizeNode,
  normalizeTemplate
} = await import("../src/models/templateTreeModel.js");

const {
  LEGACY_MODEL_KEY,
  LEGACY_TEMPLATE_MIGRATION_KEY,
  NODE_TEMPLATE_KEY,
  TEMPLATE_NODE_KEY,
  loadTemplateTreeData,
  renameTokenInTemplateTree,
  saveTemplateTreeData
} = await import("../src/services/templateTreeService.js");

assert.deepEqual(CHANNEL_VALUES, ["email", "sms", "other"]);
assert.equal(Channel.EMAIL, "email");
assert.equal(isChannel("email"), true);
assert.equal(isChannel("push"), false);
assert.deepEqual(normalizeChannels(["email", "sms", "email", "push"]), ["email", "sms"]);
assert.deepEqual(normalizeChannels("other"), ["other"]);

assert.deepEqual(
  normalizeNode({
    id: "node-1",
    parentId: "",
    title: "No signal",
    description: "Signal troubleshooting",
    icon: "wifi-off",
    order: 2
  }),
  {
    id: "node-1",
    parentId: null,
    title: "No signal",
    description: "Signal troubleshooting",
    icon: "wifi-off",
    order: 2
  }
);

const normalizedTemplate = normalizeTemplate({
  id: "tpl-1",
  parentNodeId: "node-1",
  title: "Request OTO photo",
  description: "Ask customer for OTO photos",
  channels: ["email", "sms", "email", "invalid"]
});

assert.equal(normalizedTemplate.id, "tpl-1");
assert.equal(normalizedTemplate.parentNodeId, "node-1");
assert.deepEqual(normalizedTemplate.channels, ["email", "sms"]);
assert.equal(normalizedTemplate.order, 0);
assert.equal(normalizedTemplate.sourceModelId, "");
assert.equal(normalizedTemplate.contentByChannel.email.title, "Request OTO photo");
assert.equal(normalizedTemplate.contentByChannel.email.type, "email");
assert.equal(normalizedTemplate.contentByChannel.email.text_fr, "");
assert.equal(normalizedTemplate.contentByChannel.sms.title, "Request OTO photo");
assert.equal(normalizedTemplate.contentByChannel.other, undefined);
assert.deepEqual(normalizeTemplate({ parentNodeId: "legacy-node", nodeIds: [] }).nodeIds, []);

const linkedTemplate = normalizeTemplate({
  id: "tpl-linked",
  parentNodeId: "node-1",
  title: "Linked",
  description: "",
  channels: ["email", "sms"],
  contentByChannel: {
    email: {
      id: "email-content",
      title: "Email content",
      type: "email",
      mainVariantName: "Main",
      text_fr: "<p>Bonjour {old_token}</p>",
      text_en: "<p>Hello</p>",
      variants: [
        {
          id: "variant-a",
          name: "Variant A",
          text_fr: "<p>Variante {old_token}</p>"
        }
      ]
    }
  }
});

assert.equal(linkedTemplate.contentByChannel.email.id, "email-content");
assert.equal(linkedTemplate.contentByChannel.email.text_fr, "<p>Bonjour {old_token}</p>");
assert.equal(linkedTemplate.contentByChannel.email.text_de, "");
assert.equal(linkedTemplate.contentByChannel.email.variants[0].id, "variant-a");
assert.equal(linkedTemplate.contentByChannel.email.variants[0].text_it, "");
assert.equal(linkedTemplate.contentByChannel.sms.title, "Linked");

assert.equal(createNode({ title: "Low prio" }).title, "Low prio");
assert.equal(createTemplate({ channels: Channel.OTHER }).channels[0], "other");

localStorage.setItem("models", JSON.stringify([
  {
    id: "legacy-email",
    type: "email",
    title: "Legacy email",
    mainVariantName: "Base",
    text_fr: "Bonjour legacy",
    variants: [
      {
        id: "follow-up",
        name: "Follow-up",
        text_fr: "Relance legacy"
      }
    ]
  }
]));
indexedDB.data.set(LEGACY_MODEL_KEY, []);
indexedDB.data.set(TEMPLATE_NODE_KEY, [
  {
    id: "empty-new-root",
    parentId: null,
    title: "Empty new tree",
    description: "",
    icon: "",
    order: 1
  }
]);
indexedDB.data.set(NODE_TEMPLATE_KEY, []);

const migratedFromLegacy = await loadTemplateTreeData();
assert.deepEqual(migratedFromLegacy.nodes.filter((node) => node.parentId === null).map((node) => node.title), ["Email", "SMS", "Other"]);
assert.equal(migratedFromLegacy.nodes.some((node) => node.id === "empty-new-root"), false);
const legacyEmailNode = migratedFromLegacy.nodes.find((node) => node.title === "Legacy email");
assert.equal(legacyEmailNode.parentId, "legacy-channel-email");
assert.deepEqual(
  migratedFromLegacy.templates
    .filter((template) => template.parentNodeId === legacyEmailNode.id)
    .map((template) => template.title),
  ["Legacy email"]
);
const migratedLegacyTemplate = migratedFromLegacy.templates.find((template) => template.parentNodeId === legacyEmailNode.id);
assert.equal(migratedLegacyTemplate.contentByChannel.email.mainVariantName, "Base");
assert.equal(migratedLegacyTemplate.contentByChannel.email.text_fr, "Bonjour legacy");
assert.deepEqual(migratedLegacyTemplate.contentByChannel.email.variants.map((variant) => variant.name), ["Follow-up"]);
assert.equal(migratedLegacyTemplate.contentByChannel.email.variants[0].text_fr, "Relance legacy");
assert.equal(indexedDB.data.get(TEMPLATE_NODE_KEY).length, 4);
assert.equal(indexedDB.data.get(NODE_TEMPLATE_KEY).length, 1);
assert.equal(indexedDB.data.get(LEGACY_TEMPLATE_MIGRATION_KEY).completed, true);

localStorage.clear();
indexedDB.data.clear();

await saveTemplateTreeData({
  nodes: [
    {
      id: "node-root",
      parentId: null,
      title: "No signal",
      description: "",
      icon: "wifi-off",
      order: 1
    }
  ],
  templates: [
    {
      id: "tpl-leaf",
      parentNodeId: "node-root",
      title: "Customer unreachable",
      description: "",
      channels: ["sms", "other"],
      contentByChannel: {
        sms: {
          id: "sms-content",
          title: "Customer unreachable",
          type: "sms",
          mainVariantName: "Main",
          text_fr: "Bonjour {old_token} {ticket_num}",
          text_en: "Hello",
          text_de: "",
          text_it: "",
          variants: [
            {
              id: "sms-variant",
              name: "Short",
              text_fr: "Variante {old_token} {so_number}",
              text_en: "",
              text_de: "",
              text_it: ""
            }
          ]
        }
      }
    }
  ]
});

assert.equal(indexedDB.data.has("models"), false);
assert.deepEqual(indexedDB.data.get(TEMPLATE_NODE_KEY), [
  {
    id: "node-root",
    parentId: null,
    title: "No signal",
    description: "",
    icon: "wifi-off",
    order: 1
  }
]);
const savedTemplates = indexedDB.data.get(NODE_TEMPLATE_KEY);
assert.equal(savedTemplates.length, 1);
assert.equal(savedTemplates[0].id, "tpl-leaf");
assert.deepEqual(savedTemplates[0].channels, ["sms", "other"]);
assert.equal(savedTemplates[0].contentByChannel.sms.text_fr, "Bonjour {old_token} {so_ticket_num}");
assert.equal(savedTemplates[0].contentByChannel.sms.variants[0].text_fr, "Variante {old_token} {so_ticket_num}");
assert.equal(savedTemplates[0].contentByChannel.other.title, "Customer unreachable");

const loaded = await loadTemplateTreeData();
assert.equal(loaded.nodes[0].title, "No signal");
assert.equal(loaded.templates[0].parentNodeId, "node-root");

await renameTokenInTemplateTree("{old_token}", "{new_token}");
const renamed = await loadTemplateTreeData();
assert.equal(renamed.templates[0].contentByChannel.sms.text_fr, "Bonjour {new_token} {so_ticket_num}");
assert.equal(renamed.templates[0].contentByChannel.sms.variants[0].text_fr, "Variante {new_token} {so_ticket_num}");

console.log("templateTreeService tests passed");
