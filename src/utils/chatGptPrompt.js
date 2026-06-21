import { stripImagesFromHtml } from "./templateImages.js";

const DEFAULT_INSTRUCTION = "Modify this support message according to the user's instruction.";
const JSON_RESULT_KEYS = ["html"];
const RESULT_MARKER_PREFIX = "TEMPLATE_GENERATOR_RESULT";

function normalizeRequestId(value = "") {
    return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
}

export function getChatGptResultMarkers(requestId = "") {
    const safeRequestId = normalizeRequestId(requestId);
    if (!safeRequestId) return null;
    return {
        start: `[[${RESULT_MARKER_PREFIX}:${safeRequestId}]]`,
        end: `[[/${RESULT_MARKER_PREFIX}:${safeRequestId}]]`
    };
}

export function sanitizeTemplateHtmlForChatGpt(html = "") {
    return stripImagesFromHtml(String(html || "")).trim();
}

export function buildChatGptTemplatePrompt({
    title = "Template",
    html = "",
    instruction = DEFAULT_INSTRUCTION,
    templateInstruction = "",
    requestId = ""
} = {}) {
    const safeTitle = String(title || "Template").trim() || "Template";
    const safeInstruction = String(instruction || DEFAULT_INSTRUCTION).trim() || DEFAULT_INSTRUCTION;
    const safeTemplateInstruction = String(templateInstruction || "").trim();
    const safeHtml = sanitizeTemplateHtmlForChatGpt(html) || "<p></p>";
    const markers = getChatGptResultMarkers(requestId);

    return [
        "You are a senior Salt support template editor.",
        "Your job is to improve customer-support wording while keeping the result operationally safe for a real support workflow.",
        "",
        ...(safeTemplateInstruction ? [
            "Template writing guidance:",
            safeTemplateInstruction,
            ""
        ] : []),
        `Requested change: ${safeInstruction}`,
        "",
        "Priority order:",
        "1. Output format and JSON validity rules.",
        "2. Placeholder, customer-data and safety rules.",
        "3. Template writing guidance.",
        "4. User requested change.",
        "5. Current HTML content.",
        "",
        ...(markers ? [
            "Output format:",
            `- Start exactly with: ${markers.start}`,
            "- Put valid JSON after that line.",
            `- End exactly with: ${markers.end}`,
            "- Do not add markdown fences, explanations, comments, or text outside those markers.",
            "",
            "JSON shape:",
            JSON.stringify({ html: "<p>Revised template HTML</p>" }, null, 2),
            "",
            "JSON rules:",
            "- The JSON must parse with JSON.parse.",
            "- Use exactly the html field for the revised template body.",
            "- The html value must be a JSON string; escape quotes and newlines when needed.",
            ""
        ] : []),
        "Rules:",
        markers
            ? "- Return only the requested output format with valid JSON inside it."
            : "- Return only valid JSON.",
        "- Put the revised HTML only in the JSON html field.",
        "- Do not add explanations, markdown fences, notes, comments, or raw HTML outside JSON.",
        "- Return an HTML fragment only, not a full HTML document.",
        "- Keep valid HTML and preserve simple formatting such as paragraphs, lists, bold, italic, and links.",
        "- Do not include scripts, styles, forms, iframes, external assets, tracking pixels or data URLs.",
        "- Keep placeholders inside braces, for example {client_first_name}, exactly unchanged.",
        "- Do not translate, rename, split, remove or invent placeholders.",
        "- Do not invent customer data, ticket IDs, dates, names, phone numbers, addresses, or technical values.",
        "- Do not promise compensation, deadlines, technician visits or SLA outcomes unless they already exist in the source content or instruction.",
        "- Keep the message concise, professional, clear and directly useful for a support agent.",
        "- Preserve the original intent unless the requested change explicitly changes it.",
        "",
        "Before returning, verify silently:",
        "- The response is valid JSON in the requested wrapper.",
        "- The JSON contains a non-empty html string.",
        "- Every placeholder from the current HTML is preserved exactly unless the user explicitly asked to remove it.",
        "- No unsupported customer facts or operational promises were added.",
        "",
        `Template title: ${safeTitle}`,
        "",
        "Current HTML:",
        "```html",
        safeHtml,
        "```"
    ].join("\n");
}

function stripMarkdownFence(value = "") {
    const text = String(value || "").trim();
    const match = text.match(/^```(?:html|json|text)?\s*([\s\S]*?)\s*```$/i);
    return match ? match[1].trim() : text;
}

function getJsonResultValue(parsed) {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "";

    for (const key of JSON_RESULT_KEYS) {
        if (typeof parsed[key] === "string" && parsed[key].trim()) {
            return parsed[key].trim();
        }
    }

    return "";
}

function getChatGptResultText(value = "") {
    const text = stripMarkdownFence(value);
    if (!text) return "";

    try {
        const parsed = JSON.parse(text);
        const result = getJsonResultValue(parsed);
        if (result) return stripMarkdownFence(result);
        return "";
    } catch {
        return "";
    }
}

function extractMarkedResult(text, requestId) {
    const markers = getChatGptResultMarkers(requestId);
    if (!markers) return "";

    const startIndex = text.indexOf(markers.start);
    if (startIndex === -1) return "";

    const htmlStart = startIndex + markers.start.length;
    const endIndex = text.indexOf(markers.end, htmlStart);
    if (endIndex === -1) return "";

    return stripMarkdownFence(text.slice(htmlStart, endIndex)).trim();
}

export function extractChatGptJsonPayload(value = "", { requestId = "", requireRequestId = false } = {}) {
    const text = stripMarkdownFence(value);
    if (!text) return "";

    const markedResult = extractMarkedResult(text, requestId);
    if (markedResult) return markedResult;

    return requireRequestId ? "" : text;
}

export function extractChatGptTemplateHtml(value = "", { requestId = "", requireRequestId = false } = {}) {
    const payload = extractChatGptJsonPayload(value, { requestId, requireRequestId });
    return getChatGptResultText(payload);
}
