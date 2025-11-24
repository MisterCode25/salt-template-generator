

/* CLIPBOARD.JS
   Gestion du copier-coller du texte généré
*/

/* Copie une chaîne dans le presse‑papiers (HTML + texte brut) */
export async function copyToClipboard(htmlContent) {
   const plainText = htmlContent
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                "text/html": new Blob([htmlContent], { type: "text/html" }),
                "text/plain": new Blob([plainText], { type: "text/plain" })
            })
        ]);
        console.log("Rich HTML copied.");
        showToast("Content copied!");
        return;
    } catch (err) {
        console.error("Rich copy failed, fallback:", err);
    }

    /* Fallback for old browsers */
    try {
        await navigator.clipboard.writeText(htmlContent);
        showToast("Content copied!");
    } catch (err2) {
        console.error("Fallback failed:", err2);

        const temp = document.createElement("textarea");
        temp.value = plainText;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();

        try {
            document.execCommand("copy");
            showToast("Content copied!");
        } catch (err3) {
            showToast("Unable to copy.");
        }

        document.body.removeChild(temp);
    }
}

/* ---- TOAST VISUEL ---- */
function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "white";
    toast.style.color = "black";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "14px";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";

    document.body.appendChild(toast);

    setTimeout(() => { toast.style.opacity = "1"; }, 10);
    setTimeout(() => { 
        toast.style.opacity = "0"; 
        setTimeout(() => toast.remove(), 300);
    }, 1200);
}