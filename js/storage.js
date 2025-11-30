/* STORAGE.JS — LocalStorage-backed storage */
/* ------------------------------------------------ */

/* Generic load: only from localStorage */

export async function loadJSON(path) {
    try {
        const key = "local_" + path;
        const localData = localStorage.getItem(key);

        if (localData) {
            return JSON.parse(localData);
        }

        // No JSON file loading anymore — return empty structure
        return [];
    } catch (err) {
        console.error("Erreur loadJSON :", err);
        return [];
    }
}

/* Save: write to localStorage only */
export async function saveJSON(path, data) {
    try {
        const key = "local_" + path;
        localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
        console.error("Erreur saveJSON :", err);
    }
}
