/* STORAGE.JS — Nouvelle version avec LocalStorage */
/* ------------------------------------------------ */

/* Chargement générique : si disponible dans localStorage, on utilise localStorage.
   Sinon on charge le fichier JSON depuis le disque (fetch). */

export async function loadJSON(path) {
    try {
        // Clef unique basée sur le chemin
        const key = "local_" + path;

        // Si les données sont déjà en localstorage → priorité
        const localData = localStorage.getItem(key);
        if (localData) {
            return JSON.parse(localData);
        }

        // Sinon → charger le fichier JSON original
        const response = await fetch(path);
        if (!response.ok) {
            console.error("Erreur lors du chargement :", path);
            return null;
        }

        const data = await response.json();

        // Stocker une copie dans localStorage pour les futures sauvegardes
        localStorage.setItem(key, JSON.stringify(data));

        return data;

    } catch (err) {
        console.error("Erreur loadJSON :", err);
        return null;
    }
}

/* Sauvegarde : Écriture dans localStorage uniquement */
export async function saveJSON(path, data) {
    try {
        const key = "local_" + path;
        localStorage.setItem(key, JSON.stringify(data));
        console.log("Données sauvegardées dans localStorage :", key);
    } catch (err) {
        console.error("Erreur saveJSON :", err);
    }
}