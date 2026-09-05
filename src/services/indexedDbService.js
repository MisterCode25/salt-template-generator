const DB_NAME = "salt-template-generator";
const DB_VERSION = 1;
const STORE_NAME = "appData";
let databasePromise = null;
const memoryStore = new Map();

function hasIndexedDB() {
    return typeof indexedDB !== "undefined";
}

function openDatabase() {
    if (!hasIndexedDB()) {
        return Promise.reject(new Error("IndexedDB is not available."));
    }

    if (!databasePromise) {
        databasePromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            request.onsuccess = () => {
                const db = request.result;
                db.onversionchange = () => {
                    db.close();
                    databasePromise = null;
                };
                resolve(db);
            };
            request.onerror = () => reject(request.error || new Error("Unable to open IndexedDB."));
            request.onblocked = () => reject(new Error("IndexedDB open request was blocked."));
        }).catch((error) => {
            databasePromise = null;
            throw error;
        });
    }

    return databasePromise;
}

function runStoreTransaction(db, mode, action) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        let actionResult;

        transaction.oncomplete = () => {
            resolve(actionResult);
        };
        transaction.onerror = () => {
            reject(transaction.error || new Error("IndexedDB transaction failed."));
        };
        transaction.onabort = () => {
            reject(transaction.error || new Error("IndexedDB transaction aborted."));
        };

        try {
            actionResult = action(store);
        } catch (error) {
            transaction.abort();
            reject(error);
        }
    });
}

async function withStore(mode, action) {
    const db = await openDatabase();
    try {
        return await runStoreTransaction(db, mode, action);
    } catch (error) {
        if (error?.name !== "InvalidStateError") throw error;
        databasePromise = null;
        return runStoreTransaction(await openDatabase(), mode, action);
    }
}

export async function loadIndexedJSON(key, fallback = null) {
    if (!hasIndexedDB()) {
        return memoryStore.has(key) ? memoryStore.get(key) : fallback;
    }

    try {
        return await withStore("readonly", (store) => {
            return new Promise((resolve, reject) => {
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result ?? fallback);
                request.onerror = () => reject(request.error || new Error("IndexedDB read failed."));
            });
        });
    } catch (error) {
        console.error("loadIndexedJSON error", error);
        return fallback;
    }
}

export async function saveIndexedJSON(key, value) {
    if (!hasIndexedDB()) {
        memoryStore.set(key, value);
        return true;
    }

    try {
        await withStore("readwrite", (store) => {
            store.put(value, key);
        });
        return true;
    } catch (error) {
        console.error("saveIndexedJSON error", error);
        return false;
    }
}

export async function deleteIndexedJSON(key) {
    if (!hasIndexedDB()) {
        return memoryStore.delete(key);
    }

    try {
        await withStore("readwrite", (store) => {
            store.delete(key);
        });
        return true;
    } catch (error) {
        console.error("deleteIndexedJSON error", error);
        return false;
    }
}

// The synchronous updater reads and writes the selected records in one transaction.
// This keeps a delayed workflow result from being attached during a customer change.
export async function updateIndexedRecords(keys, updater) {
    if (!keys.length) throw new Error("An atomic update requires at least one record key.");
    if (!hasIndexedDB()) {
        const snapshot = Object.fromEntries(keys.map((key) => [key, memoryStore.get(key)]));
        const { updates = {}, result } = updater(structuredClone(snapshot));
        Object.entries(updates).forEach(([key, value]) => memoryStore.set(key, value));
        return result;
    }
    const outcome = {};
    await withStore("readwrite", (store) => {
        const snapshot = {};
        let remaining = keys.length;
        for (const key of keys) {
            const request = store.get(key);
            request.onsuccess = () => {
                snapshot[key] = request.result;
                remaining -= 1;
                if (remaining) return;
                try {
                    const { updates = {}, result } = updater(snapshot);
                    Object.entries(updates).forEach(([name, value]) => store.put(value, name));
                    outcome.result = result;
                } catch (error) {
                    outcome.error = error;
                    store.transaction.abort();
                }
            };
        }
    }).catch((error) => { throw outcome.error || error; });
    return outcome.result;
}

export async function clearAppIndexedDB() {
    if (!hasIndexedDB()) {
        memoryStore.clear();
        return true;
    }

    try {
        await withStore("readwrite", (store) => {
            store.clear();
        });
        return true;
    } catch (error) {
        console.error("clearAppIndexedDB error", error);
        return false;
    }
}
