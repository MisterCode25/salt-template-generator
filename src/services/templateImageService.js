import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";
import {
    buildTemplateImageMap,
    hydrateTemplateImageElements,
    hydrateTemplateImageHtml,
    normalizeTemplateImageRecord,
    normalizeTemplateImages,
    TEMPLATE_IMAGES_UPDATED_EVENT
} from "../utils/templateImages.js";

const TEMPLATE_IMAGES_KEY = "template_images";
const MAX_TEMPLATE_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.86;
const SUPPORTED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function createId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `template-image-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emitTemplateImagesUpdated() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(TEMPLATE_IMAGES_UPDATED_EVENT));
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("Unable to read image file."));
        reader.readAsDataURL(file);
    });
}

function loadHtmlImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Unable to decode image."));
        image.src = dataUrl;
    });
}

function getCanvasMimeType(fileType) {
    if (fileType === "image/png") return "image/png";
    if (fileType === "image/webp") return "image/webp";
    return "image/jpeg";
}

async function normalizeImageDataUrl(dataUrl, fileType) {
    if (fileType === "image/gif") {
        return { dataUrl, width: 0, height: 0 };
    }

    const image = await loadHtmlImage(dataUrl);
    const sourceWidth = image.naturalWidth || image.width || 0;
    const sourceHeight = image.naturalHeight || image.height || 0;
    if (!sourceWidth || !sourceHeight) {
        return { dataUrl, width: 0, height: 0 };
    }

    const scale = Math.min(1, MAX_TEMPLATE_IMAGE_DIMENSION / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    if (scale === 1 && fileType === "image/gif") {
        return { dataUrl, width, height };
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
        return { dataUrl, width, height };
    }
    context.drawImage(image, 0, 0, width, height);

    const mimeType = getCanvasMimeType(fileType);
    return {
        dataUrl: canvas.toDataURL(mimeType, mimeType === "image/png" ? undefined : JPEG_QUALITY),
        width,
        height
    };
}

export async function loadTemplateImages() {
    return normalizeTemplateImages(await loadIndexedJSON(TEMPLATE_IMAGES_KEY, []));
}

export async function loadTemplateImageMap() {
    return buildTemplateImageMap(await loadTemplateImages());
}

export async function saveTemplateImages(images = []) {
    const normalized = normalizeTemplateImages(images);
    await saveIndexedJSON(TEMPLATE_IMAGES_KEY, normalized);
    emitTemplateImagesUpdated();
    return normalized;
}

export async function upsertTemplateImage(record) {
    const normalized = normalizeTemplateImageRecord(record);
    if (!normalized) throw new Error("Invalid template image.");

    const images = await loadTemplateImages();
    const byId = new Map(images.map((image) => [image.id, image]));
    byId.set(normalized.id, normalized);
    await saveTemplateImages(Array.from(byId.values()));
    return normalized;
}

export async function createTemplateImageFromFile(file) {
    if (!file || !SUPPORTED_FILE_TYPES.has(file.type)) {
        throw new Error("Use a JPG, PNG, WEBP or GIF image.");
    }
    if (typeof FileReader === "undefined" || typeof Image === "undefined" || typeof document === "undefined") {
        throw new Error("Image import is not available in this browser context.");
    }

    const sourceDataUrl = await readFileAsDataUrl(file);
    const normalized = await normalizeImageDataUrl(sourceDataUrl, file.type);
    return normalizeTemplateImageRecord({
        id: createId(),
        name: file.name || "pasted-image",
        type: file.type,
        size: file.size || normalized.dataUrl.length,
        width: normalized.width,
        height: normalized.height,
        createdAt: Date.now(),
        dataUrl: normalized.dataUrl
    });
}

export async function saveTemplateImageFile(file) {
    return upsertTemplateImage(await createTemplateImageFromFile(file));
}

export async function resolveTemplateImagesInHtml(html = "") {
    if (!String(html || "").includes("data-template-image-id")) return html || "";
    return hydrateTemplateImageHtml(html, await loadTemplateImageMap());
}

export async function hydrateStoredTemplateImageElements(root) {
    return hydrateTemplateImageElements(root, await loadTemplateImageMap());
}
