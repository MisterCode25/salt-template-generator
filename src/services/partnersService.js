import { mapPartnersByThemeToRows } from "../data/partnersData.js";

let partnersCache = null;

export async function loadPartners() {
  if (partnersCache) return partnersCache;

  const partnersPath = `${import.meta.env.BASE_URL}partners.json`;
  const response = await fetch(partnersPath, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load partners.json (${response.status})`);
  }

  const raw = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error("Invalid partners.json format: expected an array");
  }

  partnersCache = mapPartnersByThemeToRows(raw);
  return partnersCache;
}
