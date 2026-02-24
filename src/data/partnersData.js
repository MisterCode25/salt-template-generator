export const PARTNER_COLUMNS = [
  "Firma Entität",
  "ALA-P ID",
  "Thema",
  "Unit/Rolle",
  "Telefon",
  "Email",
  "Verfügbarkeit",
  "Bemerkung"
];

export function mapPartnersByThemeToRows(partnersByTheme = []) {
  return partnersByTheme.flatMap((entry, partnerIndex) => {
    const themes = Array.isArray(entry?.themes) ? entry.themes : [];
    return themes.map((theme, themeIndex) => ({
      "Firma Entität": String(entry?.partner ?? "").trim(),
      "ALA-P ID": `MANUAL-${partnerIndex + 1}-${themeIndex + 1}`,
      "Thema": String(theme?.name ?? "").trim(),
      "Unit/Rolle": String(theme?.unit_role ?? "").trim(),
      "Telefon": String(theme?.telefon ?? "").trim(),
      "Email": String(theme?.email ?? "").trim(),
      "Verfügbarkeit": String(theme?.availability ?? "").trim(),
      "Bemerkung": ""
    }));
  });
}
