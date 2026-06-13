export const TEMPLATE_IMAGE_ID_ATTRIBUTE = "data-template-image-id";
export const TEMPLATE_IMAGE_NAME_ATTRIBUTE = "data-template-image-name";
export const TEMPLATE_IMAGE_SELECTOR = `img[${TEMPLATE_IMAGE_ID_ATTRIBUTE}]`;
export const TEMPLATE_IMAGES_UPDATED_EVENT = "template-images-updated";

const IMG_WITH_TEMPLATE_ID_PATTERN = /<img\b([^>]*\bdata-template-image-id=(["'])(.*?)\2[^>]*)>/gi;
const IMG_TAG_PATTERN = /<img\b[^>]*>/gi;

function escapeHtmlAttribute(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function getTemplateImageFromLookup(lookup, id) {
    if (!lookup || !id) return null;
    if (lookup instanceof Map) return lookup.get(id) || null;
    if (Array.isArray(lookup)) return lookup.find((item) => item?.id === id) || null;
    if (typeof lookup === "object") return lookup[id] || null;
    return null;
}

function normalizeDimension(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : 0;
}

export function normalizeTemplateImageRecord(record = {}) {
    const id = String(record.id || "").trim();
    if (!id) return null;

    const dataUrl = typeof record.dataUrl === "string" ? record.dataUrl : "";
    return {
        id,
        name: String(record.name || "template-image").trim() || "template-image",
        type: String(record.type || "").trim() || "image",
        size: normalizeDimension(record.size),
        width: normalizeDimension(record.width),
        height: normalizeDimension(record.height),
        createdAt: normalizeDimension(record.createdAt) || Date.now(),
        dataUrl
    };
}

export function normalizeTemplateImages(records = []) {
    const byId = new Map();
    for (const record of Array.isArray(records) ? records : []) {
        const normalized = normalizeTemplateImageRecord(record);
        if (normalized) byId.set(normalized.id, normalized);
    }
    return Array.from(byId.values());
}

export function buildTemplateImageMap(records = []) {
    return new Map(normalizeTemplateImages(records).map((record) => [record.id, record]));
}

export function createTemplateImageMarkup(record = {}, { includeSrc = true } = {}) {
    const image = normalizeTemplateImageRecord(record);
    if (!image) return "";

    const attrs = [
        `class="template-image"`,
        `${TEMPLATE_IMAGE_ID_ATTRIBUTE}="${escapeHtmlAttribute(image.id)}"`,
        `${TEMPLATE_IMAGE_NAME_ATTRIBUTE}="${escapeHtmlAttribute(image.name)}"`,
        `alt="${escapeHtmlAttribute(image.name)}"`
    ];
    if (includeSrc && image.dataUrl) attrs.push(`src="${escapeHtmlAttribute(image.dataUrl)}"`);
    if (image.width) attrs.push(`width="${image.width}"`);
    if (image.height) attrs.push(`height="${image.height}"`);

    return `<img ${attrs.join(" ")}>`;
}

export function serializeTemplateImageReferences(root) {
    if (!root?.querySelectorAll) return;
    root.querySelectorAll(TEMPLATE_IMAGE_SELECTOR).forEach((image) => {
        image.removeAttribute("src");
        image.removeAttribute("srcset");
        image.removeAttribute("sizes");
        image.classList?.add("template-image");
        if (!image.getAttribute("alt")) {
            image.setAttribute("alt", image.getAttribute(TEMPLATE_IMAGE_NAME_ATTRIBUTE) || "template image");
        }
    });
}

export function hydrateTemplateImageElements(root, lookup) {
    if (!root?.querySelectorAll) return 0;
    let count = 0;
    root.querySelectorAll(TEMPLATE_IMAGE_SELECTOR).forEach((image) => {
        const id = image.getAttribute(TEMPLATE_IMAGE_ID_ATTRIBUTE);
        const record = getTemplateImageFromLookup(lookup, id);
        if (!record?.dataUrl) return;

        image.setAttribute("src", record.dataUrl);
        image.classList?.add("template-image");
        if (!image.getAttribute(TEMPLATE_IMAGE_NAME_ATTRIBUTE)) {
            image.setAttribute(TEMPLATE_IMAGE_NAME_ATTRIBUTE, record.name || "template image");
        }
        if (!image.getAttribute("alt")) {
            image.setAttribute("alt", record.name || "template image");
        }
        if (record.width && !image.getAttribute("width")) image.setAttribute("width", String(record.width));
        if (record.height && !image.getAttribute("height")) image.setAttribute("height", String(record.height));
        count += 1;
    });
    return count;
}

export function hydrateTemplateImageHtml(html = "", lookup) {
    const source = String(html || "");
    if (!source.includes(TEMPLATE_IMAGE_ID_ATTRIBUTE)) return source;

    if (typeof document !== "undefined") {
        const template = document.createElement("template");
        template.innerHTML = source;
        hydrateTemplateImageElements(template.content, lookup);
        return template.innerHTML;
    }

    return source.replace(IMG_WITH_TEMPLATE_ID_PATTERN, (match, attrs, quote, id) => {
        const record = getTemplateImageFromLookup(lookup, id);
        if (!record?.dataUrl) return match;

        const withoutSrc = attrs
            .replace(/\s+src=(["']).*?\1/gi, "")
            .replace(/\s+srcset=(["']).*?\1/gi, "")
            .replace(/\s+sizes=(["']).*?\1/gi, "");
        return `<img${withoutSrc} src="${escapeHtmlAttribute(record.dataUrl)}">`;
    });
}

export function stripImagesFromHtml(html = "") {
    const source = String(html || "");
    if (!/<img\b/i.test(source)) return source;

    if (typeof document !== "undefined") {
        const template = document.createElement("template");
        template.innerHTML = source;
        template.content.querySelectorAll("img").forEach((image) => image.remove());
        return template.innerHTML;
    }

    return source.replace(IMG_TAG_PATTERN, "");
}

export function extractTemplateImageIdsFromHtml(html = "") {
    const source = String(html || "");
    if (!source.includes(TEMPLATE_IMAGE_ID_ATTRIBUTE)) return [];

    const ids = new Set();
    if (typeof document !== "undefined") {
        const template = document.createElement("template");
        template.innerHTML = source;
        template.content.querySelectorAll(TEMPLATE_IMAGE_SELECTOR).forEach((image) => {
            const id = image.getAttribute(TEMPLATE_IMAGE_ID_ATTRIBUTE);
            if (id) ids.add(id);
        });
        return Array.from(ids);
    }

    IMG_WITH_TEMPLATE_ID_PATTERN.lastIndex = 0;
    let match;
    while ((match = IMG_WITH_TEMPLATE_ID_PATTERN.exec(source)) !== null) {
        if (match[3]) ids.add(match[3]);
    }
    return Array.from(ids);
}
