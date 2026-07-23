import { deleteIndexedJSON, loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";
import {
    buildTemplateImageMap,
    hydrateTemplateImageElements,
    hydrateTemplateImageHtml,
    extractTemplateImageIdsFromHtml,
    normalizeTemplateImageRecord,
    normalizeTemplateImages,
    TEMPLATE_IMAGES_UPDATED_EVENT
} from "../utils/templateImages.js";

const TEMPLATE_IMAGES_KEY = "template_images";
const TEMPLATE_IMAGE_DATA_KEY_PREFIX = "template_image_data:";
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

function getTemplateImageDataKey(id) {
    return `${TEMPLATE_IMAGE_DATA_KEY_PREFIX}${id}`;
}

function withoutImageData(record) {
    const { dataUrl: _dataUrl, ...metadata } = record;
    return metadata;
}

async function loadTemplateImageMetadata() {
    const stored = normalizeTemplateImages(await loadIndexedJSON(TEMPLATE_IMAGES_KEY, []));
    if (!stored.some((image) => image.dataUrl)) return stored;

    await Promise.all(stored.map((image) => (
        image.dataUrl ? saveIndexedJSON(getTemplateImageDataKey(image.id), image.dataUrl) : Promise.resolve()
    )));
    const metadata = stored.map(withoutImageData);
    await saveIndexedJSON(TEMPLATE_IMAGES_KEY, metadata);
    return normalizeTemplateImages(metadata);
}

async function loadTemplateImageByMetadata(metadata) {
    const dataUrl = await loadIndexedJSON(getTemplateImageDataKey(metadata.id), "");
    return normalizeTemplateImageRecord({ ...metadata, dataUrl });
}

export async function loadTemplateImages() {
    const metadata = await loadTemplateImageMetadata();
    return Promise.all(metadata.map(loadTemplateImageByMetadata));
}

export async function loadTemplateImageMap(ids = null) {
    const metadata = await loadTemplateImageMetadata();
    const requestedIds = ids ? new Set(ids) : null;
    const selected = requestedIds ? metadata.filter((image) => requestedIds.has(image.id)) : metadata;
    return buildTemplateImageMap(await Promise.all(selected.map(loadTemplateImageByMetadata)));
}

export async function loadTemplateImageMapForHtml(...htmlValues) {
    const ids = new Set();
    htmlValues.flat(Infinity).forEach((html) => {
        extractTemplateImageIdsFromHtml(String(html || "")).forEach((id) => ids.add(id));
    });
    if (ids.size === 0) return new Map();
    return loadTemplateImageMap(ids);
}

export async function saveTemplateImages(images = []) {
    const normalized = normalizeTemplateImages(images);
    const previous = await loadTemplateImageMetadata();
    const nextIds = new Set(normalized.map((image) => image.id));
    await Promise.all([
        ...normalized.map((image) => saveIndexedJSON(getTemplateImageDataKey(image.id), image.dataUrl || "")),
        ...previous
            .filter((image) => !nextIds.has(image.id))
            .map((image) => deleteIndexedJSON(getTemplateImageDataKey(image.id)))
    ]);
    await saveIndexedJSON(TEMPLATE_IMAGES_KEY, normalized.map(withoutImageData));
    emitTemplateImagesUpdated();
    return normalized;
}

export async function upsertTemplateImage(record) {
    const normalized = normalizeTemplateImageRecord(record);
    if (!normalized) throw new Error("Invalid template image.");

    const metadata = await loadTemplateImageMetadata();
    await saveIndexedJSON(getTemplateImageDataKey(normalized.id), normalized.dataUrl || "");
    const byId = new Map(metadata.map((image) => [image.id, image]));
    byId.set(normalized.id, withoutImageData(normalized));
    await saveIndexedJSON(TEMPLATE_IMAGES_KEY, Array.from(byId.values()));
    emitTemplateImagesUpdated();
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
    return hydrateTemplateImageHtml(html, await loadTemplateImageMapForHtml(html));
}

export async function hydrateStoredTemplateImageElements(root) {
    if (!root?.querySelectorAll) return 0;
    const html = Array.from(root.querySelectorAll("[data-template-image-id]"))
        .map((image) => image.outerHTML)
        .join("");
    return hydrateTemplateImageElements(root, await loadTemplateImageMapForHtml(html));
}
