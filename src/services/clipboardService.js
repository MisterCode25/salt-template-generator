function decodeHtmlEntities(str) {
    if (!String(str || "").includes("&")) return str;
    return str
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

export function formatClipboardHtmlBody(html) {
    if (!html) return "";
    const isHtml = HTML_TAG_PATTERN.test(html);
    return isHtml
        ? html
        : html.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, "<br />\n")}</p>`).join("\n");
}

export function formatClipboardPlainText(html) {
    return stripHtmlToPlainText(formatClipboardHtmlBody(html));
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
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    const palette = {
        info: { bg: "white", fg: "black" },
        success: { bg: "#15803d", fg: "#f0fdf4" },
        error: { bg: "#b91c1c", fg: "#ffecec" },
        warning: { bg: "#b45309", fg: "#fff5e6" }
    };
    const { bg, fg } = palette[variant] || palette.info;
    toast.style.background = bg;
    toast.style.color = fg;
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "14px";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.35)";

    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "1"; }, 10);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 1400);
}
