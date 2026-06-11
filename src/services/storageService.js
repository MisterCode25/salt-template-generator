const LOCAL_PREFIX = "local_";

export async function loadJSON(key, fallback = null) {
    try {
        const prefixedKey = LOCAL_PREFIX + key;
        const raw = localStorage.getItem(prefixedKey) ?? localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.error("loadJSON error", e);
        return fallback;
    }
}

export async function saveJSON(key, value) {
    try {
        const serialized = JSON.stringify(value);
        const prefixedKey = LOCAL_PREFIX + key;
        if (localStorage.getItem(prefixedKey) !== serialized) {
            localStorage.setItem(prefixedKey, serialized);
        }
        if (localStorage.getItem(key) !== serialized) {
            localStorage.setItem(key, serialized);
        }
    } catch (e) {
        console.error("saveJSON error", e);
    }
}
