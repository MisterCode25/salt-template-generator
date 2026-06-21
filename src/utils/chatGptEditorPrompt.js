import {
    extractChatGptJsonPayload,
    getChatGptResultMarkers,
    sanitizeTemplateHtmlForChatGpt
} from "./chatGptPrompt.js";

function compactText(value = "") {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function formatContextBlock(block = {}) {
    const title = compactText(block.title);
    const body = String(block.body || "").trim();
    if (!title || !body) return "";
    return [`## ${title}`, body].join("\n");
}

function formatRuleList(title = "", rules = []) {
    const safeTitle = compactText(title);
    const safeRules = rules
        .map((rule) => compactText(rule))
        .filter(Boolean);
    if (!safeTitle || safeRules.length === 0) return [];
    return [
        `${safeTitle}:`,
        ...safeRules.map((rule) => `- ${rule}`),
        ""
    ];
}

export function buildChatGptEditorPrompt({
    requestId = "",
    templateInstruction = "",
    userInstruction = "",
    taskTitle = "Edit template",
    outputSchema = "{}",
    contextBlocks = [],
    taskRules = [],
    allowImages = true
} = {}) {
    const markers = getChatGptResultMarkers(requestId || "template-editor");
    const safeTemplateInstruction = String(templateInstruction || "").trim();
    const safeUserInstruction = String(userInstruction || "").trim();
    const safeTaskTitle = compactText(taskTitle) || "Edit template";
    const safeOutputSchema = String(outputSchema || "{}").trim();
    const formattedContext = contextBlocks.map(formatContextBlock).filter(Boolean);

    return [
        "You are a senior Salt support template editor.",
        "Your job is to generate structured JSON that the local app can parse and apply safely.",
        "",
        ...(safeTemplateInstruction ? [
            "Template writing guidance:",
            safeTemplateInstruction,
            ""
        ] : []),
        `Task: ${safeTaskTitle}`,
        ...(safeUserInstruction ? [
            `User instruction: ${safeUserInstruction}`
        ] : []),
        "",
        "Priority order:",
        "1. Output format, JSON schema and field-name rules.",
        "2. Placeholder, customer-data and safety rules.",
        "3. Template writing guidance.",
        "4. User instruction.",
        "5. Existing source content.",
        "",
        "Output format:",
        `- Start exactly with: ${markers.start}`,
        "- Put valid JSON after that line.",
        `- End exactly with: ${markers.end}`,
        "- Do not add markdown fences, explanations, comments, or text outside those markers.",
        "",
        "JSON shape:",
        safeOutputSchema,
        "",
        "JSON rules:",
        "- The JSON must parse with JSON.parse.",
        "- Use exactly the fields shown in the JSON shape unless the shape explicitly contains arrays of objects.",
        "- Do not add extra top-level sections, commentary fields, confidence scores or metadata.",
        "- HTML content must be JSON string values; escape quotes and newlines when needed.",
        "",
        "Rules:",
        "- Use HTML fragment strings for template content, not full HTML documents.",
        "- Keep HTML simple and compatible with a rich text editor: paragraphs, line breaks, lists, bold, italic and links are acceptable.",
        "- Do not include scripts, styles, forms, iframes, external assets, tracking pixels or data URLs.",
        "- Keep placeholders inside braces, for example {client_first_name}, exactly unchanged.",
        "- Do not translate, rename, split, remove or invent placeholders.",
        "- Do not invent customer data, ticket IDs, dates, names, phone numbers, addresses, or technical values.",
        "- Do not promise compensation, deadlines, technician visits or SLA outcomes unless the source content or user instruction explicitly provides them.",
        "- Keep support wording professional, concise, direct and ready for an agent to send.",
        "- Preserve the intent of existing content unless the user instruction explicitly asks for a change.",
        allowImages
            ? "- Do not create new image tags unless the source content already contains image placeholders."
            : "- Do not include images.",
        "",
        ...formatRuleList("Task-specific rules", taskRules),
        "Before returning, verify silently:",
        "- The answer is valid JSON between the required markers.",
        "- The JSON matches the requested shape and requested fields.",
        "- All placeholders are preserved exactly where required.",
        "- No unsupported customer facts or operational promises were added.",
        "- The generated language matches the requested target language.",
        "",
        "Context:",
        ...formattedContext
    ].join("\n");
}

export function parseChatGptEditorJsonResult(value = "", { requestId = "" } = {}) {
    const payload = extractChatGptJsonPayload(value, {
        requestId,
        requireRequestId: true
    });
    if (!payload) return null;

    try {
        const parsed = JSON.parse(payload);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export function sanitizeEditorPromptHtml(html = "") {
    return sanitizeTemplateHtmlForChatGpt(html) || "";
}
