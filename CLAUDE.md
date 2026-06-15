# Claude Project Instructions

Read `AGENTS.md` first. It is the canonical AI-agent context for this project and applies to Claude too.

Critical reminders:

- This is a React/Vite operational template tool.
- Run `npm test` and `npm run build` for risky source changes.
- Do not display or reconstruct an imported External ID unless BO/SO provided one that is present and valid.
- If BO/SO External ID is empty or invalid, keep the rest of the BO/SO data and let the user generate the External ID manually.
- HTML modules must execute through the `TemplateTool` iframe runtime API.
- Do not commit `output/playwright/*.png` unless explicitly requested.

