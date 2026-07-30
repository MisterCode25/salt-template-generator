import { SAGEM_IMPACTED_SERIAL_RANGES } from "../data/sagemImpactedSerialRanges.js";

const X6_SERIAL_PATTERN = /^GFAB(\d{8})$/;

function normalizeRouterSerial(serial) {
    return String(serial ?? "").trim().replace(/\s+/g, "").toUpperCase();
}

export function isX6RouterSerial(serial) {
    return X6_SERIAL_PATTERN.test(normalizeRouterSerial(serial));
}

export function getRouterElectricalImpact(serial) {
    const match = normalizeRouterSerial(serial).match(X6_SERIAL_PATTERN);
    if (!match) return null;

    const serialNumber = Number(match[1]);
    const isImpacted = SAGEM_IMPACTED_SERIAL_RANGES.some(
        ([rangeStart, rangeEnd]) => serialNumber >= rangeStart && serialNumber <= rangeEnd
    );

    return {
        isImpacted,
        label: isImpacted ? "Impacted" : "Non impacted"
    };
}
