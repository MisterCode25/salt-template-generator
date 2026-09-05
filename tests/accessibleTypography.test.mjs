import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const stylesheetPaths = [
  "../css/main.css",
  "../css/layout.css",
  "../css/components.css",
  "../css/node-editor-search.css",
  "../css/super-office-media.css"
];

const stylesheets = stylesheetPaths.map((path) => ({
  path,
  source: readFileSync(new URL(path, import.meta.url), "utf8")
}));
const mainCss = stylesheets[0].source;
const componentsCss = stylesheets.find(({ path }) => path.endsWith("components.css")).source;

assert.match(mainCss, /family=Atkinson\+Hyperlegible/);
assert.match(mainCss, /--font-xs:\s*13px/);
assert.match(mainCss, /--font-sm:\s*14px/);
assert.match(mainCss, /--font-base:\s*16px/);
assert.match(mainCss, /font-family:\s*'Atkinson Hyperlegible'/);
assert.match(mainCss, /body\s*\{[^}]*line-height:\s*1\.5/s);
assert.match(mainCss, /button,[\s\S]*textarea\s*\{[^}]*font-family:\s*inherit/);

for (const { path, source } of stylesheets) {
  assert.doesNotMatch(
    source,
    /font-size:\s*(?:9|10|11|12)px/,
    `${path} must not use fixed interface text below 13px`
  );
}

assert.doesNotMatch(
  stylesheets.find(({ path }) => path.endsWith("node-editor-search.css")).source,
  /font-size:\s*0\.75rem/,
  "Search result counts must use the accessible type scale"
);
assert.match(
  componentsCss,
  /@media \(max-width: 900px\)[\s\S]*?\.templates-app-header\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*0;/,
  "The enlarged home header must grow instead of overlapping the capture controls"
);

const layoutCss = stylesheets.find(({ path }) => path.endsWith("layout.css")).source;
assert.match(
  layoutCss,
  /\.client-info-bar-field-key\s*\{[^}]*font-size:\s*var\(--font-sm\)/s,
  "Client banner labels must use the readable small-text size"
);
assert.match(
  layoutCss,
  /\.client-info-bar-field-val\s*\{[^}]*font-size:\s*var\(--font-md\)/s,
  "Client banner values must be visually prominent"
);
assert.match(
  layoutCss,
  /\.client-capture-reference-field dd\s*\{[^}]*font-size:\s*var\(--font-md\)/s,
  "VTI and ticket references must be visually prominent"
);

assert.match(
  componentsCss,
  /\.client-info-bar-field-val\s*\{[^}]*font-size:\s*var\(--font-md\)/s,
  "Later component styles must preserve the prominent client banner value size"
);

console.log("accessibleTypography tests passed");
