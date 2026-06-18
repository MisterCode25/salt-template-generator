function decodeHtmlEntities(str) {
    const text = String(str || "");
    if (!text.includes("&")) return text;
    return text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

const HTML_TAG_PATTERN = /<[a-z][\s\S]*>/i;
const HTML_BREAK_PATTERN = /<br\s*\/?>/gi;
const HTML_PARAGRAPH_END_PATTERN = /<\/p>/gi;
const HTML_TAG_STRIP_PATTERN = /<[^>]+>/g;
const EXCESS_NEWLINE_PATTERN = /\n{3,}/g;
const TOAST_MAX_MESSAGE_LENGTH = 92;
const TOAST_DISPLAY_MS = 2600;

function normalizePlainText(value = "") {
    return decodeHtmlEntities(String(value || "")
        .replace(EXCESS_NEWLINE_PATTERN, "\n\n")
        .trim());
}

function stripHtmlToPlainText(value = "") {
    const text = String(value || "");
    if (!text.includes("<")) return normalizePlainText(text);

    return normalizePlainText(
        text
            .replace(HTML_BREAK_PATTERN, "\n")
            .replace(HTML_PARAGRAPH_END_PATTERN, "\n\n")
            .replace(HTML_TAG_STRIP_PATTERN, "")
    );
}

export function formatToastMessage(message = "") {
    const text = String(message || "").replace(/\s+/g, " ").trim();
    if (text.length <= TOAST_MAX_MESSAGE_LENGTH) return text;
    return `${text.slice(0, TOAST_MAX_MESSAGE_LENGTH - 3).trim()}...`;
}

export function formatClipboardHtmlBody(html) {
    if (!html) return "";
    const isHtml = HTML_TAG_PATTERN.test(html);
    return isHtml
        ? html
        : html.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, "<br />\n")}</p>`).join("\n");
}

export function formatClipboardPlainText(html) {
    const text = String(html || "");
    return HTML_TAG_PATTERN.test(text)
        ? stripHtmlToPlainText(text)
        : normalizePlainText(text);
}

export async function copyText(text, opts = {}) {
    if (!text) return;
    const {
        message = "Content copied!",
        variant = "info"
    } = opts;
    const plainText = stripHtmlToPlainText(text);

    try {
        await navigator.clipboard.writeText(plainText);
        showToast(message, variant);
        return;
    } catch (e) {
        const textarea = document.createElement("textarea");
        textarea.value = plainText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(message, variant);
    }
}

export async function copyHtml(html, opts = {}) {
    if (!html) return;
    const {
        message = "Content copied!",
        variant = "info"
    } = opts;

    const body = formatClipboardHtmlBody(html);
    const plainText = formatClipboardPlainText(html);

    try {
        const item = new ClipboardItem({
            "text/html": new Blob([body], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
        showToast(message, variant);
        return;
    } catch (e) {
        // Fallback: plain text only
        try {
            await navigator.clipboard.writeText(plainText);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = plainText;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        showToast(message, variant);
    }
}

export function showToast(message, variant = "info") {
    const fullMessage = String(message || "").replace(/\s+/g, " ").trim();
    if (!fullMessage) return;

    document.querySelectorAll("[data-app-toast='true']").forEach((node) => node.remove());

    const toast = document.createElement("div");
    const displayMessage = formatToastMessage(fullMessage);
    toast.dataset.appToast = "true";
    toast.textContent = displayMessage;
    if (displayMessage !== fullMessage) toast.title = fullMessage;
    toast.style.position = "fixed";
    toast.style.top = "18px";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -8px)";
    const palette = {
        info: { bg: "white", fg: "black" },
        success: { bg: "#15803d", fg: "#f0fdf4" },
        error: { bg: "#b91c1c", fg: "#ffecec" },
        warning: { bg: "#b45309", fg: "#fff5e6" }
    };
    const { bg, fg } = palette[variant] || palette.info;
    toast.style.background = bg;
    toast.style.color = fg;
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "15.5px";
    toast.style.fontWeight = "650";
    toast.style.lineHeight = "1.35";
    toast.style.maxWidth = "min(460px, calc(100vw - 32px))";
    toast.style.textAlign = "center";
    toast.style.overflow = "hidden";
    toast.style.textOverflow = "ellipsis";
    toast.style.whiteSpace = "nowrap";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.22s ease, transform 0.22s ease";
    toast.style.boxShadow = "0 10px 28px rgba(0,0,0,0.38)";

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translate(-50%, 0)";
    }, 10);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translate(-50%, -8px)";
        setTimeout(() => toast.remove(), 260);
    }, TOAST_DISPLAY_MS);
}
