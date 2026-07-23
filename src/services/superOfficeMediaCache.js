const mediaObjectUrlCache = new Map();
const decodedMediaCache = new Set();

export function getSuperOfficeMediaKey(attachment = {}) {
    return `${attachment?.type || ""}|${attachment?.name || ""}|${attachment?.url || attachment?.dataUrl || ""}`;
}

export function getCachedSuperOfficeMedia(cacheKey) {
    return mediaObjectUrlCache.get(cacheKey);
}

export function setCachedSuperOfficeMedia(cacheKey, value) {
    mediaObjectUrlCache.set(cacheKey, value);
}

export function deleteCachedSuperOfficeMedia(cacheKey) {
    mediaObjectUrlCache.delete(cacheKey);
}

export function isSuperOfficeMediaDecoded(cacheKey) {
    return decodedMediaCache.has(cacheKey);
}

export function markSuperOfficeMediaDecoded(cacheKey) {
    decodedMediaCache.add(cacheKey);
}

export function clearSuperOfficeMediaCache() {
    mediaObjectUrlCache.forEach((entry) => {
        if (entry?.objectUrl && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
            URL.revokeObjectURL(entry.objectUrl);
        }
    });
    mediaObjectUrlCache.clear();
    decodedMediaCache.clear();
}
