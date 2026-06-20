import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    BookMarked,
    Check,
    ChevronLeft,
    ChevronRight,
    ClipboardCopy,
    ExternalLink,
    Keyboard,
    Link2,
    Pencil,
    Plus,
    Puzzle,
    Save,
    Trash2,
    Upload
} from "lucide-react";
import {
    DEFAULT_TOOL_COLOR,
    TOOL_COLOR_OPTIONS,
    TOOL_TYPES,
    loadTools,
    normalizeTool,
    sanitizeToolColor,
    sanitizeToolType,
    saveTools
} from "../services/toolsService.js";
import { handleToolModuleTemplateRequest } from "../services/toolModuleTemplateService.js";
import { loadTokens } from "../services/tokenService.js";
import { loadActiveClientPayload } from "../services/activeClientService.js";
import { loadTokenInputValues } from "../services/tokenInputValueService.js";
import { loadSuperOfficeTicketPayload } from "../services/superOfficeTicketService.js";
import { getClientInfoSections, getClientInternalTokenData, getClientSummaryFields } from "../utils/clientClipboard.js";
import { DATA_SHORTCUTS, copyTextFallback } from "../services/shortcutsService.js";
import { KEYBOARD_SHORTCUTS, formatKeyboardShortcut } from "../utils/keyboardShortcuts.js";
import { buildToolModulePrompt, buildToolModuleSrcDoc, buildToolRuntimeContext } from "../utils/toolModuleRuntime.js";
import { buildCaseProfile } from "../utils/caseProfile.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { copyHtml, copyText, showToast } from "../services/clipboardService.js";

const SELECTIONS = Object.freeze({
    LINK_TOOLS: "link-tools",
    MODULE_TOOLS: "module-tools",
    DATA_SHORTCUTS: "data-shortcuts",
    KEYBOARD_SHORTCUTS: "keyboard-shortcuts"
});

const KEYBOARD_SHORTCUT_DESCRIPTIONS = Object.freeze({
    importVti: "Import VTI customer data from the clipboard.",
    importSo: "Import SuperOffice ticket data from the clipboard.",
    clearData: "Clear the currently imported customer and ticket data."
});

const MODULE_WIZARD_STEPS = Object.freeze([
    {
        label: "Setup",
        caption: "Name, color and prompt"
    },
    {
        label: "HTML",
        caption: "Paste or import code"
    },
    {
        label: "Preview",
        caption: "Build and finish"
    }
]);

function createId() {
    return globalThis.crypto?.randomUUID?.() || `tool_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function createDraftTool(type = TOOL_TYPES.LINK, order = 1) {
    const safeType = sanitizeToolType(type);
    return {
        id: "",
        type: safeType,
        title: safeType === TOOL_TYPES.MODULE ? "New module" : "New link tool",
        description: "",
        url: "",
        prompt: "",
        html: "",
        color: DEFAULT_TOOL_COLOR,
        order,
        beta: safeType === TOOL_TYPES.MODULE
    };
}

function getUrlTokenContext(value, caret) {
    if (caret === null || caret === undefined) return null;
    const beforeCaret = value.slice(0, caret);
    const triggerIndex = beforeCaret.lastIndexOf("@");
    if (triggerIndex === -1) return null;

    const query = beforeCaret.slice(triggerIndex + 1);
    if (!/^[a-zA-Z0-9_-]*$/.test(query)) return null;

    return {
        start: triggerIndex,
        end: caret,
        query
    };
}

function normalizeTokenSearchValue(value = "") {
    return String(value || "").trim().toLowerCase();
}

function buildToolTokenSearchIndex(tokens = []) {
    return tokens.map((token) => ({
        token,
        searchText: [token.label, token.token, token.key]
            .map(normalizeTokenSearchValue)
            .filter(Boolean)
            .join(" ")
    }));
}

function tokenEntryMatchesQuery(entry, query = "") {
    const normalizedQuery = normalizeTokenSearchValue(query);
    if (!normalizedQuery) return true;
    return entry.searchText.includes(normalizedQuery);
}

function filterToolTokenEntries(tokenSearchIndex = [], query = "") {
    return tokenSearchIndex
        .filter((entry) => tokenEntryMatchesQuery(entry, query))
        .map((entry) => entry.token);
}

function mergeUniqueTokens(tokenDefs = []) {
    const byToken = new Map();
    tokenDefs
        .filter(Boolean)
        .forEach((tokenDef) => {
            if (!tokenDef?.token || byToken.has(tokenDef.token)) return;
            byToken.set(tokenDef.token, tokenDef);
        });
    return Array.from(byToken.values());
}

async function loadToolRuntimePreviewContext() {
    const [
        configuredTokens,
        clientPayload,
        superOfficePayload,
        storedTokenValues
    ] = await Promise.all([
        loadTokens(),
        loadActiveClientPayload(),
        loadSuperOfficeTicketPayload(),
        loadTokenInputValues()
    ]);
    const clientData = clientPayload
        ? getClientInternalTokenData(clientPayload)
        : { tokenDefs: [], values: {} };
    const values = {
        ...(clientData.values || {}),
        ...(superOfficePayload?.tokenValues || {}),
        ...(storedTokenValues || {})
    };
    const profile = buildCaseProfile({
        clientPayload,
        superOfficePayload,
        tokenValues: values
    });

    return {
        tokens: mergeUniqueTokens([...configuredTokens, ...clientData.tokenDefs]),
        values,
        client: clientPayload || null,
        clientInfo: clientPayload ? getClientInfoSections(clientPayload) : [],
        clientSummary: clientPayload ? getClientSummaryFields(clientPayload) : [],
        profile
    };
}

async function writeTextToClipboard(value, message) {
    try {
        await navigator.clipboard.writeText(value);
    } catch {
        copyTextFallback(value);
    }
    showToast(message, "success");
}

function describeTool(tool) {
    if (tool.type === TOOL_TYPES.MODULE) return tool.description || "HTML module · Beta";
    return tool.url || "Link tool";
}

const ToolTokenOption = memo(function ToolTokenOption({
    token,
    index,
    selected,
    context,
    onHover,
    onInsert
}) {
    const handleMouseEnter = useCallback(() => {
        onHover(index);
    }, [index, onHover]);

    const handleMouseDown = useCallback((event) => {
        event.preventDefault();
        onInsert(token.token, context);
    }, [context, onInsert, token.token]);

    return (
        <button
            type="button"
            className={`tools-token-option${selected ? " is-active" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseDown}
            title={token.label || token.token}
        >
            <span>{token.label || token.token}</span>
            <small>{token.token}</small>
        </button>
    );
});

function SidebarSection({ title, action, children }) {
    return (
        <section className="tools-sidebar-section">
            <div className="tools-sidebar-section__head">
                <span>{title}</span>
                {action}
            </div>
            <div className="tools-sidebar-list">
                {children}
            </div>
        </section>
    );
}

function SidebarButton({ icon, title, subtitle, selected, badge, onClick }) {
    return (
        <button
            type="button"
            className={`tools-sidebar-item${selected ? " is-selected" : ""}`}
            onClick={onClick}
            title={title}
        >
            <span className="tools-sidebar-icon" aria-hidden="true">{icon}</span>
            <span className="tools-sidebar-copy">
                <strong>{title}</strong>
                <small>{subtitle}</small>
            </span>
            {badge && <span className="tools-sidebar-badge">{badge}</span>}
        </button>
    );
}

function ColorPicker({ color, onChange }) {
    return (
        <div className="tool-color-picker" role="radiogroup" aria-label="Button color">
            {TOOL_COLOR_OPTIONS.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`tool-color-swatch tool-color-swatch--${option.value}${color === option.value ? " is-selected" : ""}`}
                    onClick={() => onChange(option.value)}
                    role="radio"
                    aria-checked={color === option.value}
                    title={option.label}
                >
                    <span className="sr-only">{option.label}</span>
                </button>
            ))}
        </div>
    );
}

function CommonToolFields({ draft, onPatch }) {
    return (
        <div className="tools-form-grid">
            <label className="tools-field-line">
                <span>Tool name</span>
                <input
                    type="text"
                    value={draft.title || ""}
                    onChange={(event) => onPatch({ title: event.target.value })}
                    placeholder="Ex: Axiros search"
                />
            </label>
            <label className="tools-field-line">
                <span>Description</span>
                <input
                    type="text"
                    value={draft.description || ""}
                    onChange={(event) => onPatch({ description: event.target.value })}
                    placeholder="What this tool does"
                />
            </label>
            <div className="tools-field-line">
                <span>Button color</span>
                <ColorPicker
                    color={sanitizeToolColor(draft.color)}
                    onChange={(color) => onPatch({ color })}
                />
            </div>
        </div>
    );
}

function LinkToolFields({ draft, onPatch, tokens }) {
    const [tokenMenu, setTokenMenu] = useState(null);
    const [activeTokenIndex, setActiveTokenIndex] = useState(0);
    const urlRef = useRef(null);
    const url = draft.url || "";
    const tokenSearchIndex = useMemo(() => buildToolTokenSearchIndex(tokens), [tokens]);
    const filteredTokens = useMemo(
        () => tokenMenu ? filterToolTokenEntries(tokenSearchIndex, tokenMenu.query) : [],
        [tokenMenu, tokenSearchIndex]
    );
    const selectedTokenIndex = useMemo(
        () => Math.min(activeTokenIndex, Math.max(filteredTokens.length - 1, 0)),
        [activeTokenIndex, filteredTokens.length]
    );

    const updateTokenMenu = useCallback((nextUrl, caret) => {
        const context = getUrlTokenContext(nextUrl, caret);
        setTokenMenu(context);
        setActiveTokenIndex(0);
    }, []);

    const insertToken = useCallback((token, context = tokenMenu) => {
        const el = urlRef.current;
        if (!el) {
            onPatch({ url: `${url}${token}` });
            setTokenMenu(null);
            return;
        }
        const start = context?.start ?? el.selectionStart ?? url.length;
        const end = context?.end ?? el.selectionEnd ?? url.length;
        const next = url.slice(0, start) + token + url.slice(end);
        onPatch({ url: next });
        setTokenMenu(null);
        setActiveTokenIndex(0);
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(start + token.length, start + token.length);
        });
    }, [onPatch, tokenMenu, url]);

    const handleUrlChange = useCallback((event) => {
        const nextUrl = event.target.value;
        const caret = event.target.selectionStart ?? nextUrl.length;
        onPatch({ url: nextUrl });
        updateTokenMenu(nextUrl, caret);
    }, [onPatch, updateTokenMenu]);

    const handleUrlKeyDown = useCallback((event) => {
        if (!tokenMenu) return;

        if (event.key === "Escape") {
            event.preventDefault();
            setTokenMenu(null);
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveTokenIndex((current) => Math.min(current + 1, Math.max(filteredTokens.length - 1, 0)));
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveTokenIndex((current) => Math.max(current - 1, 0));
            return;
        }

        if ((event.key === "Enter" || event.key === "Tab") && filteredTokens.length > 0) {
            event.preventDefault();
            insertToken(filteredTokens[selectedTokenIndex].token, tokenMenu);
        }
    }, [filteredTokens, insertToken, selectedTokenIndex, tokenMenu]);

    return (
        <section className="tools-panel-block">
            <div className="tools-panel-title">
                <h3>Link target</h3>
                <p>Use <code>@</code> to insert app tokens into the URL.</p>
            </div>
            <label className="tools-field-line tools-url-field">
                <span>URL</span>
                <input
                    ref={urlRef}
                    value={url}
                    onChange={handleUrlChange}
                    onKeyDown={handleUrlKeyDown}
                    onSelect={(event) => updateTokenMenu(url, event.target.selectionStart ?? url.length)}
                    onFocus={(event) => updateTokenMenu(url, event.target.selectionStart ?? url.length)}
                    onBlur={() => window.setTimeout(() => setTokenMenu(null), 120)}
                    placeholder="https://example.com/search?q=@"
                    className="tools-url-input"
                />
                {tokenMenu && (
                    <div className="tools-token-menu" role="listbox">
                        {filteredTokens.length > 0 ? filteredTokens.map((tok, index) => (
                            <ToolTokenOption
                                key={tok.id || tok.token}
                                token={tok}
                                index={index}
                                selected={index === selectedTokenIndex}
                                context={tokenMenu}
                                onHover={setActiveTokenIndex}
                                onInsert={insertToken}
                            />
                        )) : (
                            <div className="tools-token-menu__empty">No matching token</div>
                        )}
                    </div>
                )}
            </label>
            {url && (
                <div className="tools-field-line">
                    <span>URL preview</span>
                    <code className="tools-url-preview">{url}</code>
                </div>
            )}
        </section>
    );
}

function isSafeToolPreviewUrl(url) {
    return /^(https?:|mailto:|tel:)/i.test(String(url || "").trim());
}

function ModulePreviewFrame({ draft, tokens, runtimePreviewContext }) {
    const iframeRef = useRef(null);
    const [frameHeight, setFrameHeight] = useState(360);
    const previewSrcDoc = useMemo(() => buildToolModuleSrcDoc(draft.html), [draft.html]);

    const reply = useCallback((requestId, payload = null, error = "") => {
        if (!requestId) return;
        const target = iframeRef.current?.contentWindow;
        if (!target) return;
        target.postMessage({
            source: "template-tool-host",
            type: "tool:response",
            responseTo: requestId,
            payload,
            error
        }, "*");
    }, []);

    const postContext = useCallback((requestId = "") => {
        const target = iframeRef.current?.contentWindow;
        if (!target) return;
        target.postMessage({
            source: "template-tool-host",
            type: requestId ? "tool:response" : "tool:context",
            responseTo: requestId,
            payload: buildToolRuntimeContext({
                tool: draft,
                values: runtimePreviewContext.values || {},
                tokens,
                client: runtimePreviewContext.client || null,
                clientInfo: runtimePreviewContext.clientInfo || [],
                clientSummary: runtimePreviewContext.clientSummary || [],
                profile: runtimePreviewContext.profile || null
            })
        }, "*");
    }, [draft, runtimePreviewContext, tokens]);

    useEffect(() => {
        const handleMessage = async (event) => {
            if (event.source !== iframeRef.current?.contentWindow) return;
            const data = event.data || {};
            if (data.source !== "template-tool-module") return;

            const { type, requestId, payload = {} } = data;

            try {
                if (type === "tool:ready") {
                    postContext();
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:request-context") {
                    postContext(requestId);
                    return;
                }

                if (type === "tool:resize") {
                    const nextHeight = Math.min(Math.max(Math.ceil(Number(payload.height) || 0), 180), 620);
                    if (nextHeight > 0) setFrameHeight(nextHeight);
                    reply(requestId, { ok: true });
                    return;
                }

                if (String(type || "").startsWith("tool:templates:")) {
                    const result = await handleToolModuleTemplateRequest(type, payload);
                    if (["tool:templates:apply-migration", "tool:templates:update-template", "tool:templates:move-template"].includes(type)) {
                        showToast("Template tree updated from module preview.", "success");
                    }
                    reply(requestId, result);
                    return;
                }

                if (type === "tool:copy-text") {
                    await copyText(payload.text || "", {
                        message: payload.message || "Copied from module preview.",
                        variant: "success"
                    });
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:copy-html") {
                    await copyHtml(payload.html || "", {
                        message: payload.message || "Copied from module preview.",
                        variant: "success"
                    });
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:toast") {
                    showToast(payload.message || "Module preview updated.", payload.variant || "info");
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:open-url") {
                    if (!isSafeToolPreviewUrl(payload.url)) {
                        showToast("Only http, mailto and tel links can be opened by the host.", "warning");
                        reply(requestId, { ok: false });
                        return;
                    }
                    window.open(payload.url, "_blank", "noopener,noreferrer");
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:close") {
                    showToast("Preview close action received.", "info");
                    reply(requestId, { ok: true });
                }
            } catch (error) {
                reply(requestId, null, error?.message || "Preview request failed.");
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [postContext, reply]);

    useEffect(() => {
        setFrameHeight(360);
    }, [draft.html]);

    return (
        <iframe
            ref={iframeRef}
            className="tools-module-preview-frame"
            title={`${draft.title || "Tool module"} preview`}
            sandbox="allow-scripts allow-forms allow-popups allow-modals"
            srcDoc={previewSrcDoc}
            style={{ height: `${frameHeight}px` }}
            onLoad={() => postContext()}
        />
    );
}

function ModuleWizardStepper({ activeStep }) {
    return (
        <ol className="tool-module-stepper" aria-label="Module creation steps">
            {MODULE_WIZARD_STEPS.map((step, index) => {
                const statusClass = index === activeStep
                    ? " is-active"
                    : (index < activeStep ? " is-complete" : "");
                return (
                    <li key={step.label} className={`tool-module-step${statusClass}`} aria-current={index === activeStep ? "step" : undefined}>
                        <span className="tool-module-step-number" aria-hidden="true">
                            {index < activeStep ? <Check size={14} strokeWidth={3} /> : index + 1}
                        </span>
                        <span className="tool-module-step-copy">
                            <strong>{step.label}</strong>
                            <small>{step.caption}</small>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

function ModuleToolStep({ step, draft, onPatch, tokens, runtimePreviewContext }) {
    const fileInputRef = useRef(null);
    const buildPrompt = useMemo(
        () => buildToolModulePrompt({ title: draft.title, prompt: draft.prompt }),
        [draft.prompt, draft.title]
    );

    const copyBuildPrompt = useCallback(() => {
        writeTextToClipboard(buildPrompt, "Build prompt copied.");
    }, [buildPrompt]);

    const openChatGpt = useCallback(() => {
        window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
    }, []);

    const openHtmlFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const loadHtmlFile = useCallback(async (event) => {
        const file = event.target.files?.[0] || null;
        event.target.value = "";
        if (!file) return;

        const isHtmlFile = /\.html?$/i.test(file.name) || file.type === "text/html";
        if (!isHtmlFile) {
            showToast("Choose an .html file.", "error");
            return;
        }

        try {
            const html = await file.text();
            onPatch({ html });
            showToast(`${file.name} loaded.`, "success");
        } catch {
            showToast("Unable to read this HTML file.", "error");
        }
    }, [onPatch]);

    if (step === 0) {
        return (
            <div className="tool-module-step-panel">
                <section className="tools-panel-block">
                    <div className="tools-panel-title">
                        <h3>Module setup</h3>
                        <p>Set the label, button color and request used to generate the module.</p>
                    </div>
                    <CommonToolFields draft={draft} onPatch={onPatch} />
                </section>

                <section className="tools-panel-block">
                    <div className="tools-panel-title">
                        <h3>Build prompt</h3>
                        <p>The copied prompt includes the module API and runtime rules automatically.</p>
                    </div>
                    <label className="tools-field-line">
                        <span>User request</span>
                        <textarea
                            value={draft.prompt || ""}
                            onChange={(event) => onPatch({ prompt: event.target.value })}
                            placeholder="Ex: Build a small refund calculator that copies the final customer message."
                            rows={7}
                        />
                    </label>
                    <div className="tools-action-row">
                        <button type="button" className="settings-action-btn settings-action-btn--import" onClick={copyBuildPrompt}>
                            <ClipboardCopy size={15} strokeWidth={2} aria-hidden="true" />
                            Copy build prompt
                        </button>
                        <button type="button" className="settings-action-btn" onClick={openChatGpt}>
                            <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                            Open ChatGPT
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    if (step === 1) {
        return (
            <div className="tool-module-step-panel">
                <section className="tools-panel-block">
                    <div className="tools-panel-title">
                        <h3>Generated HTML</h3>
                        <p>Paste the complete single-file HTML returned by ChatGPT, or load the downloaded HTML file.</p>
                    </div>
                    <div className="tools-action-row">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".html,.htm,text/html"
                            className="sr-only"
                            onChange={loadHtmlFile}
                        />
                        <button type="button" className="settings-action-btn" onClick={openHtmlFilePicker}>
                            <Upload size={15} strokeWidth={2} aria-hidden="true" />
                            Load HTML file
                        </button>
                    </div>
                    <label className="tools-field-line">
                        <span>HTML, CSS and JavaScript</span>
                        <textarea
                            className="tools-code-textarea"
                            value={draft.html || ""}
                            onChange={(event) => onPatch({ html: event.target.value })}
                            placeholder="<!doctype html>..."
                            rows={16}
                        />
                    </label>
                </section>
            </div>
        );
    }

    return (
        <div className="tool-module-step-panel">
            <section className="tools-panel-block">
                <div className="tools-panel-title">
                    <h3>Construction and preview</h3>
                    <p>The module runs here with the same API and iframe runtime used by the tools bar.</p>
                </div>
                <ModulePreviewFrame
                    draft={draft}
                    tokens={tokens}
                    runtimePreviewContext={runtimePreviewContext}
                />
            </section>
        </div>
    );
}

function ToolEditorModal({ draft, tokens, runtimePreviewContext, onPatch, onSave, onClose }) {
    const toolType = sanitizeToolType(draft.type);
    const isModule = toolType === TOOL_TYPES.MODULE;
    const [moduleStep, setModuleStep] = useState(0);

    useEffect(() => {
        setModuleStep(0);
    }, [draft.id, toolType]);

    const goToPreviousModuleStep = useCallback(() => {
        setModuleStep((current) => Math.max(current - 1, 0));
    }, []);

    const goToNextModuleStep = useCallback(() => {
        const title = String(draft.title || "").trim();
        if (moduleStep === 0 && !title) {
            showToast("Tool name is required.", "error");
            return;
        }
        if (moduleStep === 1 && !String(draft.html || "").trim()) {
            showToast("Paste or import the module HTML first.", "error");
            return;
        }
        setModuleStep((current) => Math.min(current + 1, MODULE_WIZARD_STEPS.length - 1));
    }, [draft.html, draft.title, moduleStep]);

    return (
        <Modal
            onClose={onClose}
            ariaLabel={isModule ? "Module tool editor" : "Link tool editor"}
            dialogClassName="popup-box tool-editor-modal"
        >
            <div className="tool-editor-modal__header">
                <span className="tools-detail-icon" aria-hidden="true">
                    {isModule ? <Puzzle size={26} strokeWidth={1.9} /> : <Link2 size={26} strokeWidth={1.9} />}
                </span>
                <div>
                    <p className="eyebrow">
                        {isModule ? "Module tool" : "Link tool"} {isModule && <span className="tool-beta-pill">Beta</span>}
                    </p>
                    <h2>{draft.id ? `Edit ${draft.title || "tool"}` : (isModule ? "New module" : "New link tool")}</h2>
                    <p>{isModule ? "Create a local HTML module launched from the tools bar." : "Create an external URL button for the tools bar."}</p>
                </div>
            </div>

            <div className="tool-editor-modal__body">
                {isModule ? (
                    <div className="tool-module-wizard">
                        <ModuleWizardStepper activeStep={moduleStep} />
                        <ModuleToolStep
                            step={moduleStep}
                            draft={draft}
                            tokens={tokens}
                            runtimePreviewContext={runtimePreviewContext}
                            onPatch={onPatch}
                        />
                    </div>
                ) : (
                    <>
                        <section className="tools-panel-block">
                            <div className="tools-panel-title">
                                <h3>Tool setup</h3>
                                <p>Set the label, description and visual color used in the tools bar.</p>
                            </div>
                            <CommonToolFields draft={draft} onPatch={onPatch} />
                        </section>
                        <LinkToolFields draft={draft} onPatch={onPatch} tokens={tokens} />
                    </>
                )}
            </div>

            <div className="tool-editor-modal__actions">
                <div className="tool-editor-modal__actions-start">
                    {isModule && moduleStep > 0 && (
                        <button type="button" className="settings-action-btn" onClick={goToPreviousModuleStep}>
                            <ChevronLeft size={15} strokeWidth={2} aria-hidden="true" />
                            Back
                        </button>
                    )}
                </div>
                <div className="tool-editor-modal__actions-end">
                    <button type="button" className="settings-action-btn" onClick={onClose}>
                        Cancel
                    </button>
                    {isModule && moduleStep < MODULE_WIZARD_STEPS.length - 1 ? (
                        <button type="button" className="settings-action-btn settings-action-btn--save" onClick={goToNextModuleStep}>
                            Next
                            <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
                        </button>
                    ) : (
                        <button type="button" className="settings-action-btn settings-action-btn--save" onClick={onSave}>
                            <Save size={15} strokeWidth={2} aria-hidden="true" />
                            {isModule ? "Finish" : "Save tool"}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

function ToolListPanel({ type, tools, onCreate, onEdit, onDelete }) {
    const isModule = type === TOOL_TYPES.MODULE;
    const title = isModule ? "Modules" : "Link tools";
    const subtitle = isModule
        ? "HTML modules launched locally from the tools bar."
        : "External links launched from the tools bar.";
    const emptyMessage = isModule ? "No modules yet." : "No link tools yet.";

    return (
        <div className="tools-detail-stack">
            <section className="tools-detail-hero tools-detail-hero--list">
                <span className="tools-detail-icon" aria-hidden="true">
                    {isModule ? <Puzzle size={30} strokeWidth={1.9} /> : <Link2 size={30} strokeWidth={1.9} />}
                </span>
                <div className="tools-panel-title">
                    <p className="eyebrow">Custom tools {isModule && <span className="tool-beta-pill">Beta</span>}</p>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>
                <div className="tools-detail-actions">
                    <button type="button" className="settings-action-btn settings-action-btn--import" onClick={() => onCreate(type)}>
                        <Plus size={15} strokeWidth={2} aria-hidden="true" />
                        {isModule ? "New module" : "New link tool"}
                        {isModule && <span className="tool-beta-pill">Beta</span>}
                    </button>
                </div>
            </section>

            {tools.length === 0 ? (
                <section className="tools-panel-block tools-empty-panel">
                    <EmptyState message={emptyMessage} />
                </section>
            ) : (
                <section className="tools-list-panel">
                    {tools.map((tool) => (
                        <article key={tool.id} className="tools-list-row">
                            <div className="tools-list-row__icon">
                                <span className={`tool-color-dot tool-color-dot--${sanitizeToolColor(tool.color)}`} aria-hidden="true" />
                                {isModule ? <Puzzle size={18} strokeWidth={2} /> : <Link2 size={18} strokeWidth={2} />}
                            </div>
                            <div className="tools-list-row__copy">
                                <h3>{tool.title || "Untitled tool"}</h3>
                                <p>{describeTool(tool)}</p>
                            </div>
                            <div className="tools-list-row__actions">
                                <button type="button" className="settings-action-btn" onClick={() => onEdit(tool)}>
                                    <Pencil size={15} strokeWidth={2} aria-hidden="true" />
                                    Edit
                                </button>
                                <button type="button" className="settings-action-btn settings-action-btn--danger" onClick={() => onDelete(tool.id)}>
                                    <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}

function DataShortcutsPanel() {
    const copyBookmarklet = useCallback((shortcut) => {
        writeTextToClipboard(shortcut.bookmarklet, `${shortcut.buttonLabel} shortcut copied.`);
    }, []);

    return (
        <div className="tools-detail-stack">
            <section className="tools-detail-hero tools-detail-hero--compact">
                <span className="tools-detail-icon" aria-hidden="true">
                    <BookMarked size={30} strokeWidth={1.9} />
                </span>
                <div>
                    <p className="eyebrow">Shortcuts</p>
                    <h2>Data capture shortcuts</h2>
                    <p>Bookmarklets used to capture VTI, SuperOffice and ALO data.</p>
                </div>
            </section>

            <div className="tools-shortcut-grid">
                {DATA_SHORTCUTS.map((shortcut) => (
                    <article key={shortcut.id} className="tools-shortcut-card">
                        <div className="tools-shortcut-card__head">
                            <div>
                                <p className="eyebrow">{shortcut.eyebrow}</p>
                                <h3>{shortcut.title}</h3>
                                <p>{shortcut.description}</p>
                            </div>
                            <a
                                className={`vti-bookmarklet-button vti-bookmarklet-button--${shortcut.id}`}
                                href={shortcut.bookmarklet}
                                title={shortcut.buttonLabel}
                                aria-label={shortcut.buttonLabel}
                                onClick={(event) => {
                                    event.preventDefault();
                                    showToast("Drag this button to the bookmarks bar.", "info");
                                }}
                            >
                                {shortcut.buttonLabel}
                            </a>
                        </div>
                        <ol className="tools-shortcut-steps">
                            {shortcut.steps.map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                        <button type="button" className="settings-action-btn" onClick={() => copyBookmarklet(shortcut)}>
                            <ClipboardCopy size={15} strokeWidth={2} aria-hidden="true" />
                            Copy shortcut
                        </button>
                    </article>
                ))}
            </div>
        </div>
    );
}

function KeyboardShortcutsPanel() {
    return (
        <div className="tools-detail-stack">
            <section className="tools-detail-hero tools-detail-hero--compact">
                <span className="tools-detail-icon" aria-hidden="true">
                    <Keyboard size={30} strokeWidth={1.9} />
                </span>
                <div>
                    <p className="eyebrow">Shortcuts</p>
                    <h2>Keyboard shortcuts</h2>
                    <p>Global app shortcuts available from the main workspace.</p>
                </div>
            </section>

            <section className="tools-panel-block">
                <div className="tools-keyboard-list">
                    {KEYBOARD_SHORTCUTS.map((shortcut) => (
                        <div key={shortcut.id} className="tools-keyboard-row">
                            <div>
                                <strong>{shortcut.label}</strong>
                                <p>{KEYBOARD_SHORTCUT_DESCRIPTIONS[shortcut.id] || "App action shortcut."}</p>
                            </div>
                            <kbd>{formatKeyboardShortcut(shortcut)}</kbd>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function ManageTools({ embedded = false, onClose = null, initialSection = "tools" }) {
    const [tools, setTools] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [runtimePreviewContext, setRuntimePreviewContext] = useState({
        values: {},
        client: null,
        clientInfo: [],
        clientSummary: []
    });
    const [selection, setSelection] = useState(
        initialSection === "shortcuts" ? SELECTIONS.DATA_SHORTCUTS : SELECTIONS.LINK_TOOLS
    );
    const [editorDraft, setEditorDraft] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        let active = true;
        Promise.all([loadTools(), loadToolRuntimePreviewContext()]).then(([loadedTools, loadedContext]) => {
            if (!active) return;
            const sortedTools = [...loadedTools].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setTools(sortedTools);
            setTokens(loadedContext.tokens);
            setRuntimePreviewContext(loadedContext);
            setSelection(initialSection === "shortcuts" ? SELECTIONS.DATA_SHORTCUTS : SELECTIONS.LINK_TOOLS);
            setEditorDraft(null);
        });
        return () => {
            active = false;
        };
    }, [initialSection]);

    const persist = useCallback(async (next) => {
        const sortedNext = [...next].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setTools(sortedNext);
        await saveTools(sortedNext);
        window.dispatchEvent(new CustomEvent("tools-updated"));
    }, []);

    const selectDataShortcuts = useCallback(() => {
        setSelection(SELECTIONS.DATA_SHORTCUTS);
    }, []);

    const selectKeyboardShortcuts = useCallback(() => {
        setSelection(SELECTIONS.KEYBOARD_SHORTCUTS);
    }, []);

    const selectLinkTools = useCallback(() => {
        setSelection(SELECTIONS.LINK_TOOLS);
    }, []);

    const selectModuleTools = useCallback(() => {
        setSelection(SELECTIONS.MODULE_TOOLS);
    }, []);

    const createTool = useCallback((type) => {
        const nextDraft = createDraftTool(type, tools.length + 1);
        setEditorDraft(nextDraft);
    }, [tools.length]);

    const editTool = useCallback((tool) => {
        setEditorDraft(tool);
    }, []);

    const closeEditor = useCallback(() => {
        setEditorDraft(null);
    }, []);

    const patchDraft = useCallback((patch) => {
        setEditorDraft((current) => current ? { ...current, ...patch } : current);
    }, []);

    const saveDraft = useCallback(async () => {
        if (!editorDraft) return;
        const normalized = normalizeTool(editorDraft);
        const title = normalized.title.trim();
        if (!title) {
            showToast("Tool name is required.", "error");
            return;
        }
        if (normalized.type === TOOL_TYPES.LINK && !normalized.url.trim()) {
            showToast("URL is required for link tools.", "error");
            return;
        }
        if (normalized.type === TOOL_TYPES.MODULE && !normalized.html.trim()) {
            showToast("HTML is required for module tools.", "error");
            return;
        }

        const now = new Date().toISOString();
        const savedTool = {
            ...normalized,
            id: normalized.id || createId(),
            title,
            color: sanitizeToolColor(normalized.color),
            order: normalized.order ?? tools.length + 1,
            createdAt: normalized.createdAt || now,
            updatedAt: now
        };
        const exists = tools.some((tool) => tool.id === savedTool.id);
        const next = exists
            ? tools.map((tool) => (tool.id === savedTool.id ? savedTool : tool))
            : [...tools, savedTool];
        await persist(next);
        setSelection(savedTool.type === TOOL_TYPES.MODULE ? SELECTIONS.MODULE_TOOLS : SELECTIONS.LINK_TOOLS);
        setEditorDraft(null);
        showToast("Tool saved.", "success");
    }, [editorDraft, persist, tools]);

    const requestDelete = useCallback((toolId) => {
        if (!toolId) return;
        setConfirmDelete(toolId);
    }, []);

    const deleteTool = useCallback(async () => {
        if (!confirmDelete) return;
        const next = tools.filter((tool) => tool.id !== confirmDelete);
        await persist(next);
        setConfirmDelete(null);
        setEditorDraft((current) => current?.id === confirmDelete ? null : current);
        showToast("Tool deleted.", "success");
    }, [confirmDelete, persist, tools]);

    const cancelDelete = useCallback(() => {
        setConfirmDelete(null);
    }, []);

    const linkToolsCount = tools.filter((tool) => tool.type !== TOOL_TYPES.MODULE).length;
    const moduleToolsCount = tools.filter((tool) => tool.type === TOOL_TYPES.MODULE).length;
    const linkTools = useMemo(
        () => tools.filter((tool) => tool.type !== TOOL_TYPES.MODULE),
        [tools]
    );
    const moduleTools = useMemo(
        () => tools.filter((tool) => tool.type === TOOL_TYPES.MODULE),
        [tools]
    );

    return (
        <main className={`tools-manager-page${embedded ? " tools-manager-page--embedded" : ""}`}>
            <div className="tools-manager-shell">
                <header className="tools-manager-header">
                    <div>
                        <p className="eyebrow">Tools + shortcuts</p>
                        <h2>Extensions</h2>
                    </div>
                </header>

                <div className="tools-manager-layout">
                    <aside className="tools-manager-sidebar" aria-label="Tools and shortcuts">
                        <SidebarSection title="Tools">
                            <SidebarButton
                                icon={<Link2 size={18} strokeWidth={2} />}
                                title="Link tools"
                                subtitle={`${linkToolsCount} saved links`}
                                selected={selection === SELECTIONS.LINK_TOOLS}
                                onClick={selectLinkTools}
                            />
                            <SidebarButton
                                icon={<Puzzle size={18} strokeWidth={2} />}
                                title="Modules"
                                subtitle={`${moduleToolsCount} HTML modules`}
                                selected={selection === SELECTIONS.MODULE_TOOLS}
                                badge="Beta"
                                onClick={selectModuleTools}
                            />
                        </SidebarSection>

                        <SidebarSection title="Shortcuts">
                            <SidebarButton
                                icon={<BookMarked size={18} strokeWidth={2} />}
                                title="Data shortcuts"
                                subtitle={`${DATA_SHORTCUTS.length} bookmarklets`}
                                selected={selection === SELECTIONS.DATA_SHORTCUTS}
                                onClick={selectDataShortcuts}
                            />
                            <SidebarButton
                                icon={<Keyboard size={18} strokeWidth={2} />}
                                title="Keyboard shortcuts"
                                subtitle={`${KEYBOARD_SHORTCUTS.length} app shortcuts`}
                                selected={selection === SELECTIONS.KEYBOARD_SHORTCUTS}
                                onClick={selectKeyboardShortcuts}
                            />
                        </SidebarSection>
                    </aside>

                    <section className="tools-manager-detail" aria-label="Selected extension detail">
                        {selection === SELECTIONS.LINK_TOOLS && (
                            <ToolListPanel
                                type={TOOL_TYPES.LINK}
                                tools={linkTools}
                                onCreate={createTool}
                                onEdit={editTool}
                                onDelete={requestDelete}
                            />
                        )}
                        {selection === SELECTIONS.MODULE_TOOLS && (
                            <ToolListPanel
                                type={TOOL_TYPES.MODULE}
                                tools={moduleTools}
                                onCreate={createTool}
                                onEdit={editTool}
                                onDelete={requestDelete}
                            />
                        )}
                        {selection === SELECTIONS.DATA_SHORTCUTS && <DataShortcutsPanel />}
                        {selection === SELECTIONS.KEYBOARD_SHORTCUTS && <KeyboardShortcutsPanel />}
                    </section>
                </div>
            </div>

            {editorDraft && (
                <ToolEditorModal
                    draft={editorDraft}
                    tokens={tokens}
                    runtimePreviewContext={runtimePreviewContext}
                    onPatch={patchDraft}
                    onSave={saveDraft}
                    onClose={closeEditor}
                />
            )}

            {confirmDelete !== null && (
                <ConfirmDialog
                    title="Delete tool"
                    message="Are you sure you want to delete this tool?"
                    confirmLabel="Delete"
                    variant="danger"
                    onConfirm={deleteTool}
                    onCancel={cancelDelete}
                />
            )}
        </main>
    );
}
