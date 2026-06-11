const ACTIVE_CLIENT_KEY = "active_client_payload";
const STORED_INPUT_PREFIX = "input_";

export function loadActiveClientPayload() {
    try {
        const raw = localStorage.getItem(`local_${ACTIVE_CLIENT_KEY}`) || localStorage.getItem(ACTIVE_CLIENT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error("loadActiveClientPayload error", error);
        return null;
    }
}

export function saveActiveClientPayload(payload) {
    try {
        const serialized = JSON.stringify(payload);
        localStorage.setItem(`local_${ACTIVE_CLIENT_KEY}`, serialized);
        localStorage.setItem(ACTIVE_CLIENT_KEY, serialized);
    } catch (error) {
        console.error("saveActiveClientPayload error", error);
    }
}

export function clearActiveClientPayload() {
    localStorage.removeItem(`local_${ACTIVE_CLIENT_KEY}`);
    localStorage.removeItem(ACTIVE_CLIENT_KEY);
}

export function clearStoredInputValues(storage = globalThis.localStorage) {
    if (!storage) return 0;

    const keysToRemove = [];
    for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (key?.startsWith(STORED_INPUT_PREFIX)) keysToRemove.push(key);
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
    return keysToRemove.length;
}
