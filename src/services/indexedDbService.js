const DB_NAME = "salt-template-generator";
const DB_VERSION = 1;
const STORE_NAME = "appData";

function hasIndexedDB() {
    return typeof indexedDB !== "undefined";
}

function openDatabase() {
    if (!hasIndexedDB()) {
        return Promise.reject(new Error("IndexedDB is not available."));
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Unable to open IndexedDB."));
    });
}

async function withStore(mode, action) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        let actionResult;

        transaction.oncomplete = () => {
            db.close();
            resolve(actionResult);
        };
        transaction.onerror = () => {
            db.close();
            reject(transaction.error || new Error("IndexedDB transaction failed."));
        };
        transaction.onabort = () => {
            db.close();
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

export async function loadIndexedJSON(key, fallback = null) {
    if (!hasIndexedDB()) return fallback;

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
    if (!hasIndexedDB()) return false;

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
    if (!hasIndexedDB()) return false;

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

export async function clearAppIndexedDB() {
    if (!hasIndexedDB()) return false;

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
