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

const { loadTemplateTreeData, saveTemplateTreeData } = await import("../src/services/templateTreeService.js");
const {
  applyTemplateMigrationForModule,
  getTemplateTreeForModule,
  handleToolModuleTemplateRequest,
  moveTemplateForModule,
  previewTemplateMigrationForModule,
  updateTemplateForModule
} = await import("../src/services/toolModuleTemplateService.js");

await saveTemplateTreeData({
  nodes: [
    { id: "topic-email", parentId: null, title: "Email", description: "", icon: "mail", order: 1 },
    { id: "topic-signal", parentId: null, title: "MSG No signal", description: "", icon: "wifi-off", order: 2 },
    { id: "topic-other", parentId: null, title: "Other", description: "", icon: "document", order: 3 }
  ],
  templates: [
    {
      id: "tpl-email",
      nodeIds: ["topic-email"],
      title: "Ticket Closed",
      description: "",
      channels: ["email"],
      contentByChannel: {
        email: {
          id: "email-content",
          title: "Ticket Closed",
          type: "email",
          text_en: "Done"
        }
      }
    },
    {
      id: "tpl-sms",
      nodeIds: ["topic-email"],
      title: "SMS Alert",
      description: "",
      channels: ["sms"],
      contentByChannel: {
        sms: {
          id: "sms-content",
          title: "SMS Alert",
          type: "sms",
          text_en: "Done"
        }
      }
    }
  ]
});

{
  const tree = await getTemplateTreeForModule();
  assert.equal(tree.counts.nodes, 3);
  assert.equal(tree.counts.templates, 2);
  assert.equal(tree.nodes.find((node) => node.id === "topic-signal").path, "MSG No signal");
}

{
  const preview = await previewTemplateMigrationForModule([
    { fromTopic: "Email", toTopic: "MSG No signal", channel: "email", reason: "Move email closures" }
  ]);
  assert.equal(preview.operationCount, 1);
  assert.equal(preview.affectedTemplateCount, 1);
  assert.equal(preview.operations[0].templateId, "tpl-email");
  assert.equal(preview.operations[0].sourceNodeId, "topic-email");
  assert.equal(preview.operations[0].targetNodeId, "topic-signal");

  const result = await applyTemplateMigrationForModule(preview.operations);
  assert.equal(result.appliedCount, 1);
  assert.equal(result.skippedCount, 0);

  const migrated = await loadTemplateTreeData();
  const moved = migrated.templates.find((template) => template.id === "tpl-email");
  const untouched = migrated.templates.find((template) => template.id === "tpl-sms");
  assert.deepEqual(moved.nodeIds, ["topic-signal"]);
  assert.deepEqual(untouched.nodeIds, ["topic-email"]);
}

{
  const updated = await updateTemplateForModule("tpl-email", {
    title: "Ticket Closed Updated",
    favorite: true,
    id: "should-not-change"
  });
  assert.equal(updated.template.id, "tpl-email");
  assert.equal(updated.template.title, "Ticket Closed Updated");
  assert.equal(updated.template.favorite, true);
}

{
  const moved = await moveTemplateForModule("tpl-email", "topic-other");
  assert.deepEqual(moved.template.nodeIds, ["topic-other"]);
}

{
  const listed = await handleToolModuleTemplateRequest("tool:templates:list", {});
  assert.equal(listed.templates.some((template) => template.title === "Ticket Closed Updated"), true);
  await assert.rejects(
    () => handleToolModuleTemplateRequest("tool:templates:move-template", {
      templateId: "missing",
      targetNodeId: "topic-other"
    }),
    /Template was not found/
  );
}

console.log("toolModuleTemplateService tests passed");
