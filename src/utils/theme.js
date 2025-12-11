const THEME_KEY = "theme_pref";

export function getInitialTheme() {
    return localStorage.getItem(THEME_KEY) || "dark";
}

export function applyTheme(theme) {
    const root = document.documentElement;
    const isLight = theme === "light";
    root.classList.toggle("light-theme", isLight);
    root.classList.toggle("dark-theme", !isLight);
    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
}

export function getThemeToggleLabel(theme) {
    return theme === "light" ? "🌙" : "☀️";
}
