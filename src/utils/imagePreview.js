const DIRECT_IMAGE_EXTENSION_PATTERN = /\.(jpe?g|jfif|png|webp|gif|bmp|avif|ico|svg)(?:$|[?#])/i;
const HEIC_IMAGE_EXTENSION_PATTERN = /\.(heic|heif)(?:$|[?#])/i;
const TIFF_IMAGE_EXTENSION_PATTERN = /\.(tiff?|tif)(?:$|[?#])/i;

const DIRECT_IMAGE_CONTENT_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/pjpeg",
    "image/jfif",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/x-ms-bmp",
    "image/avif",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/svg+xml"
]);

const HEIC_IMAGE_CONTENT_TYPES = new Set([
    "image/heic",
    "image/heic-sequence",
    "image/heif",
    "image/heif-sequence"
]);

const TIFF_IMAGE_CONTENT_TYPES = new Set([
    "image/tif",
    "image/tiff"
]);

function normalizedContentType(value) {
    return String(value || "").split(";")[0].trim().toLowerCase();
}

function matchesAttachmentExtension(attachment, pattern) {
    return pattern.test(String(attachment?.name || "")) || pattern.test(String(attachment?.url || ""));
}

export function getImagePreviewKind(attachment = {}) {
    const contentType = normalizedContentType(attachment.contentType);

    if (HEIC_IMAGE_CONTENT_TYPES.has(contentType) || matchesAttachmentExtension(attachment, HEIC_IMAGE_EXTENSION_PATTERN)) return "heic";
    if (TIFF_IMAGE_CONTENT_TYPES.has(contentType) || matchesAttachmentExtension(attachment, TIFF_IMAGE_EXTENSION_PATTERN)) return "tiff";
    if (DIRECT_IMAGE_CONTENT_TYPES.has(contentType) || matchesAttachmentExtension(attachment, DIRECT_IMAGE_EXTENSION_PATTERN)) return "direct";
    return "unknown";
}

export function isDirectlyPreviewableImage(attachment = {}) {
    return getImagePreviewKind(attachment) === "direct";
}

export function requiresImageConversion(attachment = {}) {
    const kind = getImagePreviewKind(attachment);
    return kind === "heic" || kind === "tiff";
}

function canvasToBlob(canvas, type = "image/png", quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("IMAGE_EXPORT_FAILED"));
        }, type, quality);
    });
}

async function convertBitmapCompatibleImage(blob) {
    if (typeof createImageBitmap !== "function") throw new Error("IMAGE_CONVERSION_UNAVAILABLE");

    const bitmap = await createImageBitmap(blob);
    try {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("IMAGE_CANVAS_UNAVAILABLE");
        context.drawImage(bitmap, 0, 0);
        return await canvasToBlob(canvas);
    } finally {
        bitmap.close?.();
    }
}

async function convertHeicImage(blob) {
    const { heicTo } = await import("heic-to/csp");
    const converted = await heicTo({
        blob,
        type: "image/jpeg",
        quality: 0.9
    });
    return Array.isArray(converted) ? converted[0] : converted;
}

async function convertTiffImage(blob) {
    const module = await import("utif");
    const UTIF = module.default || module;
    const buffer = await blob.arrayBuffer();
    const pages = UTIF.decode(buffer);
    const page = pages?.[0];
    if (!page) throw new Error("TIFF_DECODE_FAILED");

    UTIF.decodeImage(buffer, page);
    const rgba = UTIF.toRGBA8(page);
    const width = Number(page.width);
    const height = Number(page.height);
    if (!width || !height || !rgba?.length) throw new Error("TIFF_DECODE_FAILED");

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("IMAGE_CANVAS_UNAVAILABLE");
    context.putImageData(new ImageData(new Uint8ClampedArray(rgba), width, height), 0, 0);
    return canvasToBlob(canvas);
}

export async function convertImageBlobForPreview(blob, attachment = {}) {
    const kind = getImagePreviewKind({
        ...attachment,
        contentType: attachment.contentType || blob?.type
    });

    if (kind === "heic") return convertHeicImage(blob);
    if (kind === "tiff") return convertTiffImage(blob);
    return convertBitmapCompatibleImage(blob);
}
