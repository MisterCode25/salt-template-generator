# AI Agent Project Context

This file is the first context file for Codex, Claude, and other AI coding agents working on this repository.
Read it before scanning the whole codebase.

## Project

`template-generator` is a React/Vite web app used to manage customer templates, imported customer data, tokens, SuperOffice/BO data, quick tools, and executable HTML modules.

The app is used as an operational tool, not a marketing site. UI changes should stay dense, practical, and workflow-focused.

## Commands

- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Run full test suite: `npm test`

When changing runtime, storage, imports, token behavior, or template generation, run at least:

- `npm test`
- `npm run build`

For UI/runtime behavior, also test in a real browser when feasible.

## Stack

- React 18
- Vite
- Plain CSS in `css/`
- IndexedDB-backed storage through app services
- No backend in this repo

## Main Areas

- `src/components/TemplateRuntime.jsx`
  Main app runtime: imports VTI/BO/SO data, manages active client data, token values, template copy flow, external ID display, and module/tool handoff.

- `src/pages/Templates.jsx`
  Template browsing/editing workflow.

- `src/pages/ManageNodes.jsx`
  Topic/tree/template management.

- `src/pages/ManageTokens.jsx`
  Custom token management.

- `src/pages/ManageTools.jsx`
  Link tools, shortcuts, and HTML module editor/preview.

- `src/utils/clientClipboard.js`
  VTI/customer payload parsing, client summary fields, internal client tokens, and matching imported data to tokens.

- `src/utils/superOfficeImport.js`
  BO/SuperOffice import parsing, ticket number extraction, valid external ID parsing, and photo attachment extraction.

- `src/utils/externalGenerator.js`
  External ID field order, parsing, token conversion, and generation.

- `src/utils/toolModuleRuntime.js`
  Runtime API injected into executable HTML modules.

- `src/services/activeClientService.js`
  Active client payload and manual token input persistence.

- `src/services/tokenInputValueService.js`
  Token input persistence and legacy localStorage migration.

- `src/services/toolsService.js`
  Quick tools and HTML module persistence.

## Storage Keys

Important app data is persisted through storage services, mostly IndexedDB:

- `active_client_payload`: active imported VTI/customer payload.
- `token_input_values`: saved manual/system token values.
- `quick_tools`: quick tools and HTML modules.
- `super_office_ticket_payload`: imported BO/SuperOffice ticket data.
- `pending_super_office_ticket_payload`: BO/SO import waiting for matching VTI/customer data.
- `client_bar_fields`: chosen fields for the compact client bar.

Do not bypass storage services unless a test specifically needs to seed state.

## Data Import Rules

### VTI / Customer Data

VTI/customer data is the trusted source for customer identity, contractor number, OTO data, activation date, and client summary display.

When importing a new VTI/customer payload:

- Clear stale token input values first.
- Keep agent profile values.
- Rebuild internal client tokens from the new payload.
- If pending BO/SO data matches the same customer, apply it.
- If BO/SO data conflicts with VTI data, prompt instead of silently overwriting.

### BO / SuperOffice Data

BO/SuperOffice import can provide:

- SO ticket number.
- External ID, only when present and valid.
- Photo/file attachments.
- Ticket creation metadata.

Critical rule:

- Never create, reconstruct, or display an imported External ID when BO/SO did not provide a valid External ID.
- If BO/SO External ID is empty, missing, or invalid, ignore only the External ID and keep the rest of the BO/SO data.
- In that case, the user must generate the External ID manually with the "Generate external ID" button.
- A valid imported External ID must parse with `parseExternalId`.
- Partial fields such as SO ticket number, contractor number, partner, or attachment data are not enough to display an imported External ID.

### External ID

External ID generation is an explicit user action.

Display an External ID in the client info panel only when it came from a valid imported BO/SO External ID or another explicitly valid stored External ID source.

Do not use incomplete token values to build a synthetic External ID for display.

## HTML Module Runtime

HTML modules are user-created single-file HTML/CSS/JS tools executed in an iframe. The goal is that generated HTML, CSS, and JS actually run inside the app.

Modules should use the injected `TemplateTool` API.

Available runtime calls:

- `TemplateTool.getContext()`
- `TemplateTool.getVars()`
- `TemplateTool.copyText(text, message?)`
- `TemplateTool.copyHtml(html, message?)`
- `TemplateTool.toast(message, variant?)`
- `TemplateTool.requestResize()`
- `TemplateTool.openUrl(url)`
- `TemplateTool.close()`

The host exposes:

- Runtime variables under `context.variables`.
- Compatible flat values under `context.values`.
- All resolved fields under `context.fields`.
- Field lookup under `context.fieldIndex`.
- Client summary and client info sections.

Important module rules:

- Modules run in an iframe sandbox.
- They must communicate with the host through `TemplateTool`, not direct parent DOM access.
- Copy actions must go through the host API.
- Long content should call `TemplateTool.requestResize()`.
- Module preview in `ManageTools` must behave like final execution from the tools bar.

## Token Rules

- System tokens should stay canonicalized through `tokenCanonicalization.js`.
- BO/SO ticket token should normalize to `{so_ticket_num}`.
- Manual token values should be saved through `activeClientService` / `tokenInputValueService`.
- Client JSON leaves create internal on-demand tokens.
- Do not show manual token inputs as generic VTI dynamic fields.

## UI Rules

This is an operational app.

- Prefer compact, scannable, task-focused UI.
- Avoid decorative landing-page style.
- Keep repeated items and modals visually clear.
- Test text overflow for long customer names, OTO IDs, router serials, and long notes.
- Avoid putting page sections inside nested card layouts unless already established locally.

## Testing Checklist For Risky Changes

For data import/storage/token changes:

- Import VTI/customer data.
- Import BO/SO data with a valid External ID.
- Import BO/SO data with empty External ID.
- Import BO/SO data with invalid External ID.
- Verify SO ticket/photos remain available when External ID is invalid.
- Verify no synthetic External ID is displayed for invalid/missing import.
- Verify the Generate external ID button still works.

For module changes:

- Create/open a simple variable display module.
- Create/open a form module.
- Create/open a long-content runtime inspector module.
- Test copy text, copy HTML, forms, buttons, toast, and resize.
- Test the module editor preview and final tools-bar execution.

## Git / Artifact Notes

- Do not commit `output/playwright/*.png` unless the user explicitly asks for screenshot artifacts.
- Do not revert unrelated local changes.
- If the worktree is dirty, identify which files belong to the current task before staging.
- Prefer small focused commits, but make sure all required source changes are included before pushing.

