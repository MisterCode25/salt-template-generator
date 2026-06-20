export const TOPIC_COLOR_PRESETS = Object.freeze([
    { value: "#6366f1", label: "Indigo" },
    { value: "#2563eb", label: "Blue" },
    { value: "#0f766e", label: "Teal" },
    { value: "#047857", label: "Green" },
    { value: "#ca8a04", label: "Amber" },
    { value: "#c2410c", label: "Orange" },
    { value: "#dc2626", label: "Red" },
    { value: "#7c3aed", label: "Violet" }
]);

const TOPIC_COLOR_VALUES = TOPIC_COLOR_PRESETS.map((preset) => preset.value);
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

export function normalizeTopicColor(value = "") {
    const color = String(value || "").trim();
    return HEX_COLOR_PATTERN.test(color) ? color.toLowerCase() : "";
}

function stableColorIndex(source = "") {
    const text = String(source || "topic");
    let total = 0;
    for (const char of text) total += char.charCodeAt(0);
    return total % TOPIC_COLOR_VALUES.length;
}

export function getTopicColorValue(topic = {}) {
    const explicitColor = normalizeTopicColor(topic.color);
    if (explicitColor) return explicitColor;

    return TOPIC_COLOR_VALUES[stableColorIndex(`${topic.icon || ""}:${topic.title || ""}`)];
}

export function getTopicColorStyle(topic = {}) {
    return {
        "--topic-color": getTopicColorValue(topic)
    };
}
