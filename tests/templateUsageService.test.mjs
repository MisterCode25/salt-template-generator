import assert from "node:assert/strict";

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

global.indexedDB = createFakeIndexedDB();

const {
  TEMPLATE_QUICK_SECTIONS_KEY,
  TEMPLATE_USAGE_STATS_KEY,
  loadTemplateQuickSectionsState,
  loadTemplateUsageStats,
  normalizeTemplateQuickSectionsState,
  normalizeTemplateUsageStats,
  recordTemplateUsage,
  saveTemplateQuickSectionsState,
  saveTemplateUsageStats
} = await import("../src/services/templateUsageService.js");

assert.deepEqual(normalizeTemplateUsageStats(null), {});
assert.deepEqual(normalizeTemplateUsageStats({
  " tpl-a ": { usageCount: 2.8, lastUsedAt: 123 },
  "tpl-b": { usageCount: -1, lastUsedAt: 0 },
  "": { usageCount: 1, lastUsedAt: 1 }
}), {
  "tpl-a": { usageCount: 2, lastUsedAt: 123 }
});

assert.deepEqual(normalizeTemplateQuickSectionsState({
  favorites: true,
  recent: 1,
  mostUsed: ""
}), {
  mostUsed: false
});

assert.deepEqual(await loadTemplateUsageStats(), {});

let stats = await recordTemplateUsage("tpl-a", 1000);
assert.deepEqual(stats, {
  "tpl-a": { usageCount: 1, lastUsedAt: 1000 }
});

stats = await recordTemplateUsage("tpl-a", 2000);
assert.deepEqual(stats, {
  "tpl-a": { usageCount: 2, lastUsedAt: 2000 }
});

await saveTemplateUsageStats({
  "tpl-a": { usageCount: 5, lastUsedAt: 3000 },
  "tpl-empty": { usageCount: 0, lastUsedAt: 0 }
});
assert.deepEqual(global.indexedDB.data.get(TEMPLATE_USAGE_STATS_KEY), {
  "tpl-a": { usageCount: 5, lastUsedAt: 3000 }
});

assert.deepEqual(await loadTemplateQuickSectionsState(), {
  mostUsed: false
});

await saveTemplateQuickSectionsState({
  favorites: true,
  recent: false,
  mostUsed: true
});
assert.deepEqual(global.indexedDB.data.get(TEMPLATE_QUICK_SECTIONS_KEY), {
  mostUsed: true
});

console.log("templateUsageService tests passed");
