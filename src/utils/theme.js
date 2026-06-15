import {
    deleteIndexedJSON,
    loadIndexedJSON,
    saveIndexedJSON
} from "../services/indexedDbService.js";

const THEME_KEY = "theme_pref";
const THEME_CLASSES = ["light-theme", "dark-theme", "salt-theme"];

export const THEME_UPDATED_EVENT = "theme-preference-updated";
export const THEME_PREFERENCES = Object.freeze(["system", "dark", "light", "salt"]);
export const APPEARANCE_THEMES = Object.freeze(["dark", "light", "salt"]);
const INDEXED_MISSING = Symbol("theme-missing");

function getStorage() {
    try {
        return globalThis.localStorage || null;
    } catch {
        return null;
    }
}

function getThemeMediaQuery() {
    if (typeof globalThis.matchMedia !== "function") return null;
    return globalThis.matchMedia("(prefers-color-scheme: dark)");
}

export function normalizeThemePreference(theme) {
    return THEME_PREFERENCES.includes(theme) ? theme : "dark";
}

export function getSystemTheme() {
    return getThemeMediaQuery()?.matches ? "dark" : "light";
}

export function getResolvedTheme(theme = getInitialTheme()) {
    const normalized = normalizeThemePreference(theme);
    return normalized === "system" ? getSystemTheme() : normalized;
}

export function getInitialTheme() {
    return "dark";
}

export async function loadThemePreference() {
    const indexedPreference = await loadIndexedJSON(THEME_KEY, INDEXED_MISSING);
    if (indexedPreference !== INDEXED_MISSING) return normalizeThemePreference(indexedPreference);

    const storage = getStorage();
    const legacyPreference = storage?.getItem(THEME_KEY);
    if (legacyPreference !== null && legacyPreference !== undefined) {
        const normalized = normalizeThemePreference(legacyPreference);
        await saveIndexedJSON(THEME_KEY, normalized);
        storage?.removeItem(THEME_KEY);
        return normalized;
    }

    return getInitialTheme();
}

export async function saveThemePreference(theme) {
    const preference = normalizeThemePreference(theme);
    await saveIndexedJSON(THEME_KEY, preference);
    getStorage()?.removeItem(THEME_KEY);
    return preference;
}

export async function deleteThemePreference() {
    await deleteIndexedJSON(THEME_KEY);
    getStorage()?.removeItem(THEME_KEY);
}

export function applyTheme(theme, options = {}) {
    const preference = normalizeThemePreference(theme);
    const resolvedTheme = getResolvedTheme(preference);
    const root = globalThis.document?.documentElement;

    if (root) {
        root.classList.remove(...THEME_CLASSES);
        root.classList.add(`${resolvedTheme}-theme`);
        root.dataset.themePreference = preference;
        root.dataset.resolvedTheme = resolvedTheme;
    }

    if (options.persist !== false) {
        saveThemePreference(preference);
    }

    if (
        typeof globalThis.window?.dispatchEvent === "function"
        && typeof globalThis.CustomEvent === "function"
        && options.emit !== false
    ) {
        globalThis.window.dispatchEvent(new CustomEvent(THEME_UPDATED_EVENT, {
            detail: { preference, resolvedTheme }
        }));
    }

    return { preference, resolvedTheme };
}

export function watchSystemThemePreference(callback) {
    const mediaQuery = getThemeMediaQuery();
    if (!mediaQuery || typeof callback !== "function") return () => {};

    const handleChange = () => callback();
    if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
}

export function getThemeToggleLabel(theme) {
    const resolvedTheme = getResolvedTheme(theme);
    if (resolvedTheme === "light") return "Dark";
    if (resolvedTheme === "salt") return "Salt";
    return "Light";
}

export function getNextTheme(theme) {
    const idx = APPEARANCE_THEMES.indexOf(getResolvedTheme(theme));
    return APPEARANCE_THEMES[(idx + 1) % APPEARANCE_THEMES.length];
}
