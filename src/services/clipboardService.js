export async function copyText(text, opts = {}) {
    if (!text) return;
    const {
        message = "Content copied!",
        variant = "info"
    } = opts;
    const plainText = text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

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
