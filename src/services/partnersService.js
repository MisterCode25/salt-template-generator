import { PARTNER_COLUMNS, mapPartnersByThemeToRows } from "../data/partnersData.js";
import { loadIndexedJSON, saveIndexedJSON } from "./indexedDbService.js";

export const PARTNERS_STORAGE_KEY = "partners";

let partnersCache = null;

function hasThemeSourceShape(partner) {
    return partner
        && typeof partner === "object"
        && !Array.isArray(partner)
        && Array.isArray(partner.themes);
}

function normalizePartnerRow(row, index) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;

    const normalized = {};
    for (const column of PARTNER_COLUMNS) {
        normalized[column] = String(row[column] ?? "").trim();
    }

    if (!normalized["ALA-P ID"]) {
        normalized["ALA-P ID"] = `PARTNER-${index + 1}`;
    }

    const hasVisibleData = PARTNER_COLUMNS.some((column) => column !== "ALA-P ID" && normalized[column]);
    return hasVisibleData ? normalized : null;
}

export function normalizePartners(partners = []) {
    if (!Array.isArray(partners)) return [];

    const rows = partners.some(hasThemeSourceShape)
        ? mapPartnersByThemeToRows(partners)
        : partners;

    return rows.map(normalizePartnerRow).filter(Boolean);
}

function getDefaultPartnersPath() {
    const baseUrl = import.meta.env?.BASE_URL || "/";
    return `${baseUrl.replace(/\/?$/, "/")}partners.json`;
}

async function fetchDefaultPartners() {
    const response = await fetch(getDefaultPartnersPath(), { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Unable to load partners.json (${response.status})`);
    }

    const raw = await response.json();
    const normalized = normalizePartners(raw);
    if (normalized.length === 0) {
        throw new Error("Invalid partners.json format: expected partner entries");
    }
    return normalized;
}

export async function loadPartners({ forceRefresh = false } = {}) {
    if (partnersCache && !forceRefresh) return partnersCache;

    if (!forceRefresh) {
        const storedPartners = normalizePartners(await loadIndexedJSON(PARTNERS_STORAGE_KEY, []));
        if (storedPartners.length > 0) {
            partnersCache = storedPartners;
            return partnersCache;
        }
    }

    const defaultPartners = await fetchDefaultPartners();
    await savePartners(defaultPartners);
    return defaultPartners;
}

export async function savePartners(partners) {
    const normalized = normalizePartners(partners);
    partnersCache = normalized;
    await saveIndexedJSON(PARTNERS_STORAGE_KEY, normalized);
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("partners-updated"));
    }
    return normalized;
}

export function clearPartnersCache() {
    partnersCache = null;
}
