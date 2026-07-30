import { normalizeTokenName } from "./tokenCanonicalization.js";

function isValidIsoDate(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

export function isDateTokenDefinition(tokenDef = {}) {
    if (tokenDef?.input_type === "date" || tokenDef?.inputType === "date") return true;
    return normalizeTokenName(tokenDef?.token).split("_").includes("date");
}

export function getTokenPromptInputType(tokenDef = {}) {
    if (isDateTokenDefinition(tokenDef)) return "date";
    return tokenDef?.input_type === "number" || tokenDef?.inputType === "number"
        ? "number"
        : "text";
}

export function formatDateTokenValueForInput(value) {
    const text = String(value ?? "").trim();
    if (!text) return "";

    const isoValue = text.slice(0, 10);
    if (isValidIsoDate(isoValue)) return isoValue;

    const displayMatch = text.match(/^(\d{2})[./](\d{2})[./](\d{4})$/);
    if (!displayMatch) return "";

    const normalized = `${displayMatch[3]}-${displayMatch[2]}-${displayMatch[1]}`;
    return isValidIsoDate(normalized) ? normalized : "";
}

export function formatDateInputValueForToken(value) {
    const isoValue = formatDateTokenValueForInput(value);
    if (!isoValue) return "";
    const [year, month, day] = isoValue.split("-");
    return `${day}.${month}.${year}`;
}
