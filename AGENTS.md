# AI Agent Project Context

This is the first context file for Codex, Claude, and other AI coding agents working on this repository.
Read it before scanning the whole codebase. The goal is to give a precise project map so future agents can start from the right mental model and only inspect the files they actually need.

## Project

`template-generator` is a local React/Vite operational web app for Salt support workflows. It manages:

- Customer templates organized in a topic tree.
- Imported VTI/customer data.
- Imported BO/SuperOffice ticket data.
- Custom, system, agent, client, and External ID tokens.
- External ID generation.
- Quick link tools and executable single-file HTML modules.
- Template images, SuperOffice photo galleries, ALO autofill data, shortcuts, app settings, and configuration import/export.

This is not a marketing site. It is a dense productivity tool for repeated support work. UI changes should be compact, scannable, and task-focused.

The root `README.md` is older than the current app. Treat this `AGENTS.md` plus source/tests as the reliable orientation when README statements mention old pages or `localStorage` as the main storage.

## Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Run full test suite: `npm test`
- Preview production build: `npm run preview`

When changing runtime, storage, imports, token behavior, template generation, template tree operations, or module execution, run at least:

- `npm test`
- `npm run build`

For UI/runtime behavior, also test in a real browser when feasible. Clipboard, iframe module runtime, image hydration, and IndexedDB behavior are browser-sensitive.

## Stack

- React 18 with `react-router-dom`.
- Vite 5.
- Plain CSS in `css/`.
- IndexedDB-backed local storage through app services.
- No backend in this repo.
- `lucide-react` for icons.
- `konva` / `react-konva` for image annotation.

## App Routes

Routes are defined in `src/App.jsx`.

- `/` and `/templates`: main operational template runtime and browser.
- `/nodes`: topic/tree/template management.
- `/tokens`: custom token management.
- `/settings`: agent profile, custom tokens, theme, config import/export, test data, storage.
- `/external-generator`: standalone External ID generator.
- `/vti-bookmarklet`: opens `ManageTools` on shortcuts.
- `/tools`: quick links, shortcuts, and HTML module editor/preview.

## Main Files

- `src/components/TemplateRuntime.jsx`
  Main runtime hook and modals. Handles VTI import, SO import, active client state, token values, token prompt flow, template copy/result preview, client info panel, client bar field selection, External ID conflict prompts, and saving imported/generated External IDs.

- `src/pages/Templates.jsx`
  Main app screen. Loads the template tree, renders topics/templates, search, language/channel selection, most-used templates, client/case panel, tools bar, SO photos, ALO fill modal, embedded settings/nodes/tools, and External ID generator modal.

- `src/pages/ManageNodes.jsx`
  Topic tree and template editor. Creates/edits/moves/deletes nodes and templates, manages channels, language text, variants, topic icons/colors, rich text content, and template images.

- `src/pages/ManageTokens.jsx`
  Custom token CRUD. System/internal tokens are not meant to be edited as regular custom tokens.

- `src/pages/ManageTools.jsx`
  Quick link tools, shortcuts, keyboard shortcut reference, and single-file HTML module editor/preview.

- `src/pages/Settings.jsx`
  Agent profile, custom tokens, theme, configuration import/export, test import payload copying, storage info and reset.

- `src/core/tokenEngine.js`
  Pure token application and language fallback. Also translates title/salutation tokens by language.

- `src/models/templateTreeModel.js`
  Normalizers and constructors for topic nodes, templates, channels, channel content, and variants.

- `src/utils/templateTreeOperations.js`
  Pure operations for creating, updating, moving, linking, duplicating, and deleting nodes/templates.

- `src/utils/templateTreeNavigation.js`
  Search, node/template path helpers, and channel model resolution.

- `src/utils/clientClipboard.js`
  VTI/customer JSON parsing, client display sections, client summary fields, language detection, internal client token generation, and matching imported client data to tokens.

- `src/utils/superOfficeImport.js`
  BO/SuperOffice JSON parsing, SO ticket extraction, valid External ID parsing, explicit token extraction, attachment/photo normalization and grouping.

- `src/utils/externalGenerator.js`
  External ID field order, formatting, parsing, system tokens, VTI/client-derived External ID fields, and generation helpers.

- `src/utils/externalIdConflicts.js`
  Conflict detection/resolution between imported SO External ID values and trusted VTI/client values.

- `src/utils/toolModuleRuntime.js`
  HTML module iframe runtime. Builds injected bridge/style, module prompt, runtime context, `TemplateTool` API, variables, fields, and compatibility aliases.

- `src/services/*`
  Storage, persistence, migration, app events, clipboard wrappers, config import/export, image storage, usage stats, tools, active client, SuperOffice ticket, token, and agent profile services.

## Core Data Model

### Template Tree

Templates are no longer a flat legacy `models` list. The current structure is:

- `template_nodes`: topic nodes with `id`, `parentId`, `title`, `description`, `icon`, `color`, `order`.
- `node_templates`: reusable templates with `id`, `nodeIds`, `parentNodeId`, `title`, `description`, `channels`, `order`, `favorite`, `contentByChannel`.
- Channels are `email`, `sms`, and `other`.
- Each channel content has `text_fr`, `text_en`, `text_de`, `text_it`, `mainVariantName`, and `variants`.
- A template can be linked to multiple nodes through `nodeIds`; `parentNodeId` is mainly the first/primary node for compatibility.
- Use `normalizeTemplate`, `normalizeNode`, and operations in `templateTreeOperations.js` instead of ad hoc object edits.
- Legacy `models` can migrate through `migrateLegacyModelsToTemplateTree` and `templateTreeService`.

### Tokens

Token strings use braces, for example `{client_first_name}`.

Token categories:

- System tokens: agent profile tokens and External ID tokens. Loaded by `tokenService`, not persisted as custom tokens.
- Custom tokens: user-created tokens persisted under `tokens`.
- Internal client tokens: generated on demand from imported VTI/customer JSON leaves in `clientClipboard.js`.
- Manual token values: persisted under `token_input_values` and optionally mirrored in active client payload under `__templateInputs`.
- Agent profile tokens: persisted in `agent_profile` and synced into token input values.

Important rules:

- Always canonicalize token definitions and token inputs with `tokenCanonicalization.js`.
- BO/SO ticket token aliases must normalize to `{so_ticket_num}`.
- Do not persist system/internal tokens as custom tokens.
- Do not show manual token inputs as generic VTI dynamic fields.
- Client JSON leaves create internal on-demand tokens, but internal metadata paths are skipped.

### Client Payload

Active VTI/customer data is stored as `active_client_payload`.

Expected payload shape usually includes `client`, `contact`, and/or `healthcheck`. `parseClientClipboardJSON` accepts raw JSON, JSON embedded in markdown fences, or a larger clipboard string containing the first JSON object.

Client display data comes from:

- Known groups in `CLIENT_FIELD_GROUPS`.
- Dynamic non-empty JSON leaves not already covered by known paths.
- Manual inputs under `__templateInputs`.
- Valid imported External ID metadata under `__importedExternalId`.

VTI/customer data is the trusted source for identity, contractor, OTO, healthcheck, activation date, and client summary fields.

### SuperOffice Payload

Imported BO/SuperOffice ticket data is stored as:

- `super_office_ticket_payload` when it matches the current active client signature.
- `pending_super_office_ticket_payload` when no matching active VTI/customer data exists yet.

Stored SO payloads contain normalized `ticketId`, `sourceTicketId`, `createdAt`, `externalTicketId`, `importedAt`, `clientSignature`, `tokenValues`, `attachments`, and `imageAttachments`.

The client signature is a stable stringify of the active client payload with manual inputs and imported External ID metadata stripped. This prevents SO data from silently attaching to the wrong customer.

### External ID

External ID fields and order live in `externalGenerator.js`.

The generated/imported code is a `//`-separated string with fields in `EXTERNAL_FIELD_ORDER`:

`data`, `customer`, `soTicket`, `SignalStatus`, `LedStatus`, `treatmentStep`, `boxType`, `partner`, `partnerTicketNumber`, `lexId`, `oltName`, `oltBoard`, `bokBof`, `comment`. Legacy imported External IDs may still include the previous leading `flagging` segment and must remain parseable.

Date display inside an External ID is `DD.MM.YYYY`; stored form for the generator is `YYYY-MM-DD`.

External ID display rules are strict:

- External ID generation is an explicit user action.
- Display an External ID in the client info panel only when it came from a valid imported BO/SO External ID or another explicitly valid stored/generated External ID source.
- Never synthesize an imported External ID from partial token values.
- A valid imported External ID must pass `parseExternalId`.
- Partial fields such as SO ticket number, contractor number, partner, attachments, or BO/SO metadata are not enough to display an imported External ID.

## Storage Architecture

Primary storage is IndexedDB:

- DB name: `salt-template-generator`
- Object store: `appData`
- Service: `src/services/indexedDbService.js`

Most callers should use `storageService.js`, which reads IndexedDB first, migrates legacy `localStorage` values, and removes legacy keys. Some services use IndexedDB directly where they need tighter control or older migration behavior.

Important storage keys:

- `active_client_payload`: active imported VTI/customer payload.
- `token_input_values`: saved manual/system token values.
- `tokens`: custom token definitions only.
- `agent_profile`: agent profile fields used by system tokens.
- `template_nodes`: topic tree nodes.
- `node_templates`: templates linked to topic nodes.
- `models`: legacy template storage, migration source only.
- `template_tree_legacy_migration`: legacy migration status.
- `quick_tools`: quick link tools and HTML modules.
- `super_office_ticket_payload`: SO ticket data matching the active client.
- `pending_super_office_ticket_payload`: SO data waiting for matching VTI/customer data.
- `client_bar_fields`: chosen fields for the compact client bar.
- `template_images`: stored rich text/template images.
- `template_usage_stats`: usage counts and last-used timestamps.
- `template_quick_sections`: collapsed/expanded quick sections.
- `configName`: user-facing configuration name.
- `theme_pref`: theme preference.

Do not bypass storage services unless a test specifically needs to seed state. Direct `localStorage` writes are usually wrong because they skip migration, normalization, and events.

## Runtime Events

Several views stay in sync via window events:

- `template-tree-updated`: emitted after saving tree data.
- `template-images-updated`: emitted after saving template images.
- `super-office-ticket-updated`: emitted after SO ticket payload changes.
- `client-input-values-updated`: emitted after token/manual input changes.
- `active-client-payload-updated`: emitted after imported/generated External ID metadata changes on the client payload.
- `agent-profile-updated`: emitted after agent profile save.
- `theme-preference-updated`: emitted after theme change.
- `tools-updated`: listened to by `ToolsBar`; emitted from tools management code when tool records change.

When adding persistence behavior, update the relevant service and dispatch/consume existing events instead of forcing React state manually in one screen only.

## Main Workflows

### VTI / Customer Import

`useTemplateRuntime.loadClientFromText` is the core flow:

1. Parse clipboard/paste text with `parseClientClipboardJSON`.
2. Compare current and next client signatures; clear stale SO payload when customer changes.
3. Build internal client token definitions and values from JSON leaves.
4. Match imported client fields to configured tokens.
5. Clear stale token input values.
6. Reload and sync agent profile values so they survive customer changes.
7. Persist matched VTI/client token values.
8. Save `active_client_payload`.
9. Apply a pending or matching SO ticket if available.
10. If SO values conflict with trusted VTI/client values, prompt instead of silently overwriting.
11. Save a valid imported External ID only if one exists on the SO payload.
12. Update language from customer communication language when supported.

Critical rules:

- Clear stale token input values before applying a new VTI/customer payload.
- Keep agent profile values.
- Rebuild internal client tokens from the new payload.
- If pending SO data matches the same customer, apply it.
- If SO data conflicts with VTI data, prompt instead of silently overwriting.

### BO / SuperOffice Import

`readSuperOfficeClipboard` parses clipboard text with `parseSuperOfficeInfoPayload`, checks conflicts, then calls `completeSuperOfficeImport`.

BO/SuperOffice import can provide:

- SO ticket number.
- External ID, only when present and valid.
- Explicit token values from `tokenValues`, `values`, `variables`, or `fields`.
- Contractor number.
- Photo/file attachments.
- Ticket creation metadata.

Critical rules:

- Never create, reconstruct, or display an imported External ID when BO/SO did not provide a valid External ID.
- If BO/SO External ID is empty, missing, or invalid, ignore only the External ID and keep the rest of the BO/SO data.
- When External ID is invalid, SO ticket/photos/token values should still remain available.
- In that case, the user must generate the External ID manually with the "Generate external ID" button.
- If no active client exists, SO data is saved as pending.
- If an active client exists, SO data is saved with that client signature.
- The contractor number is copied after import when available, to help VTI search.

### External ID Conflicts

When imported SO External ID/token values disagree with trusted VTI/client values, `externalIdConflicts.js` builds field-level conflicts.

The UI lets the user keep:

- VTI/client source values.
- SO imported External ID values.
- A per-field selection.

Do not collapse this prompt into silent precedence rules. It exists to prevent wrong customer/ticket data from being stored.

### Template Copy / Result Flow

Template content is selected by channel and language:

- Preferred language comes from active runtime language.
- `tokenEngine.getTemplateTextResult` falls back across FR/EN/DE/IT if the preferred language is empty.
- `generateFinalText` applies tokens and translates title/salutation tokens by output language.
- Missing tokens open `TokenPromptModal`.
- Filled values are persisted through `activeClientService` / `tokenInputValueService`, or through `agentProfileService` for agent tokens.
- Rich HTML is copied through `clipboardService.copyHtml`.
- Template image placeholders are hydrated before copy.
- SMS templates strip images before copy/result.
- Repeated copies without data changes show a warning/info distinction.
- Usage stats are recorded when a template workflow completes.

### Tools Bar and HTML Modules

Quick tools live in `quick_tools`.

Tool types:

- `link`: URL template with token replacement through `resolveToolUrl`.
- `module`: executable single-file HTML/CSS/JS tool run inside an iframe.

HTML modules are user-created tools executed in a sandboxed iframe. They must communicate with the host through `TemplateTool`, not by accessing parent DOM, `localStorage`, or IndexedDB directly.

Available runtime globals/API include:

- `TemplateTool.getContext()`
- `TemplateTool.getProfile()`
- `TemplateTool.getVars()`
- `TemplateTool.getVar(name, fallback?)`
- `TemplateTool.hasVariable(name)`
- `TemplateTool.listVariables()`
- `TemplateTool.findField(candidates)`
- `TemplateTool.getFieldValue(candidates, fallback?)`
- `TemplateTool.copyText(text, message?)`
- `TemplateTool.copyHtml(html, message?)`
- `TemplateTool.toast(message, variant?)`
- `TemplateTool.requestResize()`
- `TemplateTool.openUrl(url)`
- `TemplateTool.close()`
- `TemplateTool.onContext(callback)`
- `TemplateTool.describeApi()`
- `TemplateTool.templates.list()`
- `TemplateTool.templates.getTree()`
- `TemplateTool.templates.previewMigration(rules)`
- `TemplateTool.templates.applyMigration(operations)`
- `TemplateTool.templates.updateTemplate(templateId, patch)`
- `TemplateTool.templates.moveTemplate(templateId, targetNodeId, options?)`

The host exposes:

- `context.profile`: normalized customer/case profile.
- `context.variables` and global `TemplateVars`: safe JS variable names.
- `context.values`: token values plus compatibility aliases.
- `context.tokenValues`: original token-keyed values.
- `context.fields`: normalized lookup fields.
- `context.fieldIndex`: normalized lookup map.
- `context.client`: raw imported client payload.
- `context.clientInfo` and `context.clientSummary`.

Important module rules:

- Modules run with iframe sandbox: `allow-scripts allow-forms allow-popups allow-modals`.
- Copy actions must go through host APIs.
- Long or dynamic content should call `TemplateTool.requestResize()`.
- `TemplateTool.openUrl` only allows `http`, `https`, `mailto`, and `tel`.
- Module preview in `ManageTools` should behave like final execution from `ToolsBar`.
- Trusted modules that edit templates must use `TemplateTool.templates.*`, preview bulk migrations before applying, and write only from explicit user action.
- Generated modules should be compact app-like tools, not landing pages or nested modal UIs.

### Settings and Configuration

Configuration export/import lives in `configService.js` and `Settings.jsx`.

- Current config schema version is `3`.
- Exported data can include config name, custom tokens, nodes, templates, and template images.
- Import validates checksum when present.
- Import can merge or replace through Settings UI.
- Legacy config files with `models` are migrated to the tree format.

## UI Rules

This is an operational app.

- Prefer compact, scannable, task-focused UI.
- Avoid decorative landing-page style.
- Keep repeated items and modals visually clear.
- Use existing CSS conventions in `css/`.
- Use `lucide-react` icons where suitable.
- Test text overflow for long customer names, OTO IDs, router serials, External IDs, ticket numbers, and long notes.
- Avoid nested card layouts unless already established locally.
- Do not create large hero sections, onboarding pages, decorative gradients, or marketing copy for app screens.

## Testing Guide

Run the full suite for broad behavioral changes:

- `npm test`
- `npm run build`

Targeted tests by area:

- Token engine/canonicalization: `tests/tokenEngine.test.mjs`, `tests/tokenService.test.mjs`, `tests/richTextTokens.test.mjs`.
- Template tree/model/navigation: `tests/templateTreeService.test.mjs`, `tests/templateTreeOperations.test.mjs`, `tests/templateTreeNavigation.test.mjs`, `tests/legacyTemplateMigration.test.mjs`.
- VTI/customer import: `tests/clientClipboard.test.mjs`, `tests/activeClientService.test.mjs`, `tests/caseProfile.test.mjs`.
- BO/SuperOffice import: `tests/superOfficeImport.test.mjs`, `tests/superOfficeTicketService.test.mjs`, `tests/superOfficeBookmarklet.test.mjs`.
- External ID: `tests/externalGenerator.test.mjs`.
- Tools/modules: `tests/toolsService.test.mjs`, `tests/toolModuleRuntime.test.mjs`, `tests/toolModuleTemplateService.test.mjs`.
- Images: `tests/templateImages.test.mjs`, `tests/imageAnnotation.test.mjs`.
- Settings/profile/config support: `tests/agentProfileService.test.mjs`, `tests/templateUsageService.test.mjs`, `tests/clipboardService.test.mjs`.
- Data fixtures/bookmarklets: `tests/testImportPayloads.test.mjs`, `tests/aloAutofill.test.mjs`.

For data import/storage/token changes, manually verify when feasible:

- Import VTI/customer data.
- Import BO/SO data with a valid External ID.
- Import BO/SO data with empty External ID.
- Import BO/SO data with invalid External ID.
- Verify SO ticket/photos remain available when External ID is invalid.
- Verify no synthetic External ID is displayed for invalid/missing import.
- Verify the Generate external ID button still works.
- Verify a customer change clears stale SO/tokens but keeps agent profile values.

For module changes, manually verify when feasible:

- Create/open a simple variable display module.
- Create/open a form module.
- Create/open a long-content runtime inspector module.
- Test copy text, copy HTML, forms, buttons, toast, resize, and allowed/blocked URLs.
- Test the module editor preview and final tools-bar execution.

## Development Notes

- Prefer pure helpers in `utils/` and persistence through `services/`.
- Keep React state changes in page/component code, not inside pure utilities.
- Keep normalization at boundaries: service load/save, import parsing, config import, and model constructors.
- Avoid duplicating token parsing logic; use `tokenCanonicalization.js`.
- Avoid duplicating template tree mutation logic; use `templateTreeOperations.js` and `templateTreeService.js`.
- Do not write directly to IndexedDB/localStorage from UI code.
- Do not mutate imported payload objects in place when saving state; clone or build new objects.
- Do not commit `output/playwright/*.png` unless explicitly asked.
- Do not revert unrelated local changes.
- If the worktree is dirty, identify which files belong to the current task before staging.
- Prefer small focused commits, but make sure all required source changes are included before pushing.
