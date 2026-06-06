function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return "Unknown";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }

    const formatted = unitIndex === 0 ? String(Math.round(value)) : value.toFixed(value >= 10 ? 1 : 2);
    return `${formatted} ${units[unitIndex]}`;
}

export async function getStorageInfo() {
    const estimate = navigator.storage?.estimate
        ? await navigator.storage.estimate()
        : {};
    const persisted = navigator.storage?.persisted
        ? await navigator.storage.persisted()
        : false;

    return {
        usage: estimate.usage ?? null,
        quota: estimate.quota ?? null,
        usageLabel: formatBytes(estimate.usage),
        quotaLabel: formatBytes(estimate.quota),
        persisted
    };
}

export async function requestPersistentStorage() {
    if (!navigator.storage?.persist) return false;
    return navigator.storage.persist();
}
