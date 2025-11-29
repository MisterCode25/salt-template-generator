const THEME_KEY = "theme_pref";

function applyTheme(theme) {
    const root = document.documentElement;
    const isLight = theme === "light";
    root.classList.toggle("light-theme", isLight);
    root.classList.toggle("dark-theme", !isLight);
    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
}

function updateToggleLabel(btn, theme) {
    if (!btn) return;
    btn.textContent = theme === "light" ? "🌙" : "☀️";
    btn.setAttribute("aria-pressed", theme === "light");
}

export function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(saved);
    updateToggleLabel(btn, saved);

    if (!btn) return;

    btn.addEventListener("click", () => {
        const current = document.documentElement.classList.contains("light-theme") ? "light" : "dark";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
        updateToggleLabel(btn, next);
    });
}

document.addEventListener("DOMContentLoaded", initThemeToggle);
