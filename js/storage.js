/* STORAGE.JS — Nouvelle version avec LocalStorage */
/* ------------------------------------------------ */

/* Chargement générique : uniquement depuis localStorage */

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

/* Sauvegarde : Écriture dans localStorage uniquement */
export async function saveJSON(path, data) {
    try {
        const key = "local_" + path;
        localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
        console.error("Erreur saveJSON :", err);
    }
}