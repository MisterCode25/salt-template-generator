const THEME_KEY = "theme_pref";
const THEMES = ["dark", "light", "salt"];

export function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    return THEMES.includes(stored) ? stored : "dark";
}

export function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove("light-theme", "dark-theme", "salt-theme");
    const normalized = THEMES.includes(theme) ? theme : "dark";
    root.classList.add(`${normalized}-theme`);
    localStorage.setItem(THEME_KEY, normalized);
}

export function getThemeToggleLabel(theme) {
    if (theme === "light") return "🌙";
    if (theme === "salt") return "S";
    return "☀️";
}

export function getNextTheme(theme) {
    const idx = THEMES.indexOf(theme);
    return THEMES[(idx + 1) % THEMES.length];
}
