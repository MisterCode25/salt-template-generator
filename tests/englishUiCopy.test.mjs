import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoots = ["src", "browser-extension", "shared", "scripts"];
const standaloneSourceFiles = ["index.html", "index 3.html"];
const sourceExtensions = new Set([".js", ".jsx", ".mjs"]);
const excludedPaths = new Set([
    "src/data/partnersData.js"
]);
const excludedPrefixes = ["browser-extension/dist/"];
const allowedCompatibilityCopy = [
    "n° série routeur"
];
const frenchUiPattern = /[éèêëàâùûçîïôœ«»]|[cdjlmnstqu]’|\b(?:actualiser|annoter|annuler|aucun|aucune|avant|avec|bloqué|capturé|chargement|conserver|copie|copier|créer|dans|depuis|des|détecté|doit|données|du|déjà|enregistrer|erreur|est|fermer|français|garde|ici|image complète|impossible|indisponible|invalide|introuvable|la|le|les|maintenant|média|mettre|modifier|numéro|onglet|ouvrir|par|plusieurs|pour|précédent|préparer|prêt|prête|puis|rechercher|remplacer|remplacé|réessayer|retour|saisis|sera|seront|suivant|supprimer|sur|télécharger|terminé|trouvé|uniquement|une|vers|vidéo|votre)\b|\bEx\s*:/iu;

function collectSourceFiles(relativeDirectory) {
    const absoluteDirectory = path.join(repositoryRoot, relativeDirectory);
    return readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
        const relativePath = path.join(relativeDirectory, entry.name);
        if (entry.isDirectory()) return collectSourceFiles(relativePath);
        if (!sourceExtensions.has(path.extname(entry.name))) return [];
        if (excludedPaths.has(relativePath) || excludedPrefixes.some((prefix) => relativePath.startsWith(prefix))) return [];
        return [relativePath];
    });
}

const violations = sourceRoots
    .flatMap(collectSourceFiles)
    .concat(standaloneSourceFiles)
    .flatMap((relativePath) => readFileSync(path.join(repositoryRoot, relativePath), "utf8")
        .split("\n")
        .map((line, index) => ({ relativePath, line, lineNumber: index + 1 })))
    .filter(({ line }) => /["'`]/.test(line))
    .map((entry) => ({
        ...entry,
        line: allowedCompatibilityCopy.reduce(
            (copy, allowedText) => copy.replaceAll(allowedText, ""),
            entry.line
        )
    }))
    .filter(({ line }) => frenchUiPattern.test(line))
    .map(({ relativePath, line, lineNumber }) => `${relativePath}:${lineNumber}: ${line.trim()}`);

if (violations.length > 0) {
    console.error("French user-facing copy is not allowed. Use concise English UI text.");
    console.error(violations.join("\n"));
    process.exit(1);
}

const captureModalSource = readFileSync(
    path.join(repositoryRoot, "src/components/BrowserExtensionCaptureModal.jsx"),
    "utf8"
);
if (!/visual\.mode !== "scanning"\s*&&\s*<span>\{state\.error \|\| state\.message\}<\/span>/.test(captureModalSource)) {
    console.error("The automatic capture progress card must hide its redundant detail line while scanning.");
    process.exit(1);
}

console.log("englishUiCopy tests passed");
