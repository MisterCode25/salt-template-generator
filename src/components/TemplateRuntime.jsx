import { useEffect, useMemo, useRef, useState } from "react";
import { generateFinalText, getTemplateTextByLang } from "../core/tokenEngine.js";
import {
    clearActiveClientPayload,
    clearStoredInputValues,
    loadActiveClientPayload,
    saveClientInputValue,
    saveActiveClientPayload
} from "../services/activeClientService.js";
import { copyHtml, formatClipboardHtmlBody, showToast } from "../services/clipboardService.js";
import { loadTokens } from "../services/tokenService.js";
import {
    getClientInfoSections,
    getClientInternalTokenData,
    getClientLanguageCode,
    getClientSummaryFields,
    matchClientDataToTokens,
    parseClientClipboardJSON
} from "../utils/clientClipboard.js";
import { formatTokenPreviewHTML } from "../utils/richTextTokens.js";
import Modal from "./Modal.jsx";

const CLIENT_CLIPBOARD_READ_TIMEOUT_MS = 3500;

async function withClipboardTimeout(readOperation) {
    let timeoutId;
    try {
        return await Promise.race([
            readOperation(),
            new Promise((_, reject) => {
                timeoutId = window.setTimeout(() => {
                    reject(new Error("Clipboard reading timed out. Click the page and try again."));
                }, CLIENT_CLIPBOARD_READ_TIMEOUT_MS);
            })
        ]);
    } finally {
        window.clearTimeout(timeoutId);
    }
}

async function readClipboardTextFromItems() {
    if (!navigator.clipboard?.read) {
        throw new Error("Clipboard item reading is not available in this browser.");
    }

    const items = await withClipboardTimeout(() => navigator.clipboard.read());
    const htmlCandidates = [];
    for (const item of items || []) {
        if (item.types?.includes("text/plain")) {
            const blob = await item.getType("text/plain");
            const text = await blob.text();
            if (text) return text;
        }
        if (item.types?.includes("text/html")) {
            const blob = await item.getType("text/html");
            const html = await blob.text();
            if (html) htmlCandidates.push(html);
        }
    }
    for (const html of htmlCandidates) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const codeText = doc.querySelector("pre code, code, pre")?.textContent?.trim();
        if (codeText) return codeText;
        const bodyText = doc.body?.textContent?.trim();
        if (bodyText) return bodyText;
    }
    throw new Error("Clipboard does not contain text.");
}

async function readClipboardText() {
    const errors = [];

    if (navigator.clipboard?.readText) {
        try {
            const text = await withClipboardTimeout(() => navigator.clipboard.readText());
            if (text) return text;
            errors.push("Clipboard text is empty.");
        } catch (error) {
            errors.push(error?.message || "Clipboard text reading failed.");
        }
    } else {
        errors.push("Clipboard text reading is not available in this browser.");
    }

    try {
        return await readClipboardTextFromItems();
    } catch (error) {
        errors.push(error?.message || "Clipboard item reading failed.");
    }

    throw new Error(errors[errors.length - 1] || "Unable to read customer data from clipboard.");
}

function resolveVariantModel(base, variant) {
    if (!variant) return base;
    const resolveText = (key) => {
        const val = variant?.[key];
        if (typeof val === "string" && val.trim() !== "") return val;
        return base?.[key] ?? "";
    };
    return {
        ...base,
        ...variant,
        text_fr: resolveText("text_fr"),
        text_en: resolveText("text_en"),
        text_de: resolveText("text_de"),
        text_it: resolveText("text_it"),
        title: base?.title || variant?.title || ""
    };
}

function getTemplateDisplayTitle(model) {
    const title = model?.title || "Template";
    if (model?.name) return `${title} · ${model.name}`;
    if (model?.mainVariantName) return `${title} · ${model.mainVariantName}`;
    return title;
}

export function TokenPromptModal({ title, tokenDefs, values, missingTokens, mode = "copy", onChange, onConfirm, onClose }) {
    const isMultiCol = tokenDefs.length > 2;
    const isFillMode = mode === "fill";
    const isResultMode = mode === "result";
    return (
        <Modal onClose={onClose} dialogClassName="popup-box token-prompt-modal" ariaLabel="Template tokens">
            <div className="popup-header token-prompt-header">
                <div>
                    <h2>{title || "Template"}</h2>
                    <p className="hint">
                        {isFillMode
                            ? tokenDefs.length === 1
                                ? "Fill in the required field to preview the final result."
                                : `Fill in ${tokenDefs.length} required fields to preview the final result.`
                            : isResultMode
                                ? tokenDefs.length === 1
                                    ? "Fill in the required field before opening the final text."
                                    : `Fill in ${tokenDefs.length} required fields before opening the final text.`
                            : tokenDefs.length === 1
                                ? "Fill in the required field before copying."
                                : `Fill in ${tokenDefs.length} required fields before copying.`}
                    </p>
                </div>
            </div>
            <div className={`token-prompt-grid mt-md${isMultiCol ? " token-prompt-grid--multi" : ""}`}>
                {tokenDefs.map((tokenDef, idx) => {
                    const type = tokenDef.input_type === "number"
                        ? "number"
                        : tokenDef.input_type === "date"
                            ? "date"
                            : "text";
                    const hasError = missingTokens.includes(tokenDef.token);
                    return (
                        <div key={tokenDef.token} className={`token-prompt-field${hasError ? " token-prompt-field--error" : ""}`}>
                            <label htmlFor={`tp-${tokenDef.token}`}>{tokenDef.label || tokenDef.token}</label>
                            <input
                                id={`tp-${tokenDef.token}`}
                                type={type}
                                autoFocus={idx === 0}
                                value={values[tokenDef.token] ?? tokenDef.default ?? ""}
                                className={hasError ? "input-error" : ""}
                                placeholder={tokenDef.token}
                                onChange={(e) => onChange(tokenDef.token, e.target.value)}
                            />
                            {hasError && <span className="token-prompt-field-error">This field is required</span>}
                        </div>
                    );
                })}
            </div>
            <div className="popup-actions">
                <button className="primary-btn" onClick={onConfirm}>{isFillMode ? "Apply" : isResultMode ? "Continue" : "Copy text"}</button>
            </div>
        </Modal>
    );
}

export function VariantModal({ model, displayTitle, onSelect, onClose }) {
    const typeClass = model.type ? `template-type-${model.type}` : "";
    const mainVariantLabel = model.mainVariantName?.trim() || model.title || "Main text";

    return (
        <Modal onClose={onClose} dialogClassName="popup-box variant-picker" ariaLabel="Variant selection">
            <div className="popup-header">
                <h2>{displayTitle || model.title}</h2>
            </div>
            <div className="variant-choice-grid">
                <button className={`primary-btn variant-choice-btn ${typeClass}`} onClick={() => onSelect(null)}>
                    {mainVariantLabel}
                </button>
                {(model.variants || []).map((variant) => (
                    <button key={variant.id} className={`primary-btn variant-choice-btn ${typeClass}`} onClick={() => onSelect(variant)}>
                        {variant.name || "Variant"}
                    </button>
                ))}
            </div>
        </Modal>
    );
}

export function TemplateResultModal({ result, onCopy, onClose }) {
    if (!result) return null;

    return (
        <Modal onClose={onClose} dialogClassName="popup-box template-result-modal" ariaLabel="Generated template">
            <div className="popup-header template-result-header">
                <div>
                    <p className="template-result-kicker">Final text</p>
                    <h2>{result.title || "Template"}</h2>
                </div>
                <span className={`template-result-copy-state${result.copied ? " is-copied" : ""}`} aria-live="polite">
                    {result.copied ? "✓ Already copied" : "Copying..."}
                </span>
            </div>
            <div
                className="rich-preview template-result-preview"
                data-placeholder="No content."
                dangerouslySetInnerHTML={{ __html: formatTokenPreviewHTML(formatClipboardHtmlBody(result.html || "")) }}
            />
            <div className="popup-actions">
                <button type="button" className="primary-btn" onClick={onCopy}>
                    Copy again
                </button>
            </div>
        </Modal>
    );
}

export function ClientInfoPanel({
    sections,
    summaryFields,
    status,
    loading,
    detailsExpanded,
    lang,
    onChangeLang,
    onReadClipboard,
    onOpenPaste,
    onClearClient,
    onToggleDetails
}) {
    const hasInfo = sections.length > 0;
    const isError = status.type === "error";

    return (
        <section className="client-info-panel" aria-label="Client information">
            <div className="client-info-bar">
                <div className="client-info-bar-main">
                    {!hasInfo ? (
                        <div className="client-info-bar-empty">
                            <span className="client-info-bar-hint">No client loaded</span>
                            <button
                                type="button"
                                className="client-info-import-btn"
                                onClick={onReadClipboard}
                                disabled={loading}
                            >
                                {loading ? "Importing…" : "Import from clipboard"}
                            </button>
                            {(isError) && (
                                <button type="button" className="client-info-paste-btn" onClick={onOpenPaste}>
                                    Paste manually
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="client-info-bar-loaded">
                            <span className="client-info-bar-check" aria-label="Client loaded">✓</span>
                            <div className="client-info-bar-fields">
                                {summaryFields.map((field) => (
                                    <div key={field.label} className="client-info-bar-field">
                                        <span className="client-info-bar-field-key">{field.label}</span>
                                        <span className="client-info-bar-field-val">{field.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="client-info-bar-controls">
                    <div className="client-lang-picker" title="Change language">
                        <select
                            value={lang}
                            onChange={(e) => onChangeLang(e.target.value)}
                            aria-label="Language"
                        >
                            <option value="fr">FR</option>
                            <option value="en">EN</option>
                            <option value="de">DE</option>
                            <option value="it">IT</option>
                        </select>
                    </div>
                    {hasInfo && (
                        <>
                            <button
                                type="button"
                                className={`client-info-toggle-btn${detailsExpanded ? " is-active" : ""}`}
                                onClick={onToggleDetails}
                                aria-expanded={detailsExpanded}
                                title={detailsExpanded ? "Hide client details" : "Show client details"}
                            >
                                {detailsExpanded ? "Hide" : "Details"}
                            </button>
                            <button
                                type="button"
                                className="client-info-clear-btn"
                                onClick={onClearClient}
                                aria-label="Clear client data"
                                title="Clear client"
                            >
                                ✕
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isError && status.message && (
                <p className="client-info-bar-error" aria-live="polite">{status.message}</p>
            )}

            {hasInfo && detailsExpanded && (
                <div className="client-info-grid">
                    {sections.map((section) => (
                        <div key={section.id} className="client-info-section">
                            <h3>{section.title}</h3>
                            <div className="client-info-fields">
                                {section.fields.map((field) => (
                                    <div key={`${section.id}-${field.label}`} className="client-info-field">
                                        <span className="client-info-label">{field.label}</span>
                                        <span className="client-info-value">{field.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export function ClientPasteModal({ onClose, onImport, initialError = "" }) {
    const [text, setText] = useState("");
    const [error, setError] = useState(initialError);

    const submit = () => {
        try {
            onImport(text);
        } catch (importError) {
            setError(importError?.message || "Unable to import customer data.");
        }
    };

    return (
        <Modal onClose={onClose} dialogClassName="popup-box client-paste-modal" ariaLabel="Paste customer data">
            <div className="popup-header">
                <h2>Paste customer data</h2>
            </div>
            <p className="hint">Paste the VTI customer data here when clipboard access is blocked.</p>
            {error && <p className="client-info-status client-info-status--error">{error}</p>}
            <textarea
                autoFocus
                className="client-paste-textarea"
                value={text}
                onChange={(event) => {
                    setText(event.target.value);
                    if (error) setError("");
                }}
                placeholder='{"client": {...}, "contact": {...}, "healthcheck": {...}}'
            />
            <div className="popup-actions">
                <button type="button" className="primary-btn" onClick={submit}>Import</button>
            </div>
        </Modal>
    );
}

export function useTemplateRuntime() {
    const [lang, setLang] = useState("en");
    const [tokens, setTokens] = useState([]);
    const [values, setValues] = useState({});
    const [variantPicker, setVariantPicker] = useState(null);
    const [tokenPrompt, setTokenPrompt] = useState(null);
    const [copyPreview, setCopyPreview] = useState(null);
    const [promptMissingTokens, setPromptMissingTokens] = useState([]);
    const lastSectionClickVersion = useRef({});
    const inputChangeVersion = useRef(0);
    const copyPreviewId = useRef(0);
    const [clientPayload, setClientPayload] = useState(null);
    const [clientImportStatus, setClientImportStatus] = useState({ type: "idle", message: "" });
    const [clientMatchedTokens, setClientMatchedTokens] = useState([]);
    const [clientInternalTokens, setClientInternalTokens] = useState([]);
    const [clientImportLoading, setClientImportLoading] = useState(false);
    const [clientDetailsExpanded, setClientDetailsExpanded] = useState(false);
    const [clientPasteOpen, setClientPasteOpen] = useState(false);
    const [clientPasteInitialError, setClientPasteInitialError] = useState("");

    useEffect(() => {
        loadTokens().then(setTokens);
        const storedClient = loadActiveClientPayload();
        if (storedClient) {
            setClientPayload(storedClient);
            setClientImportStatus({ type: "success", message: "" });
        }
    }, []);

    const templateTokens = useMemo(() => {
        if (clientInternalTokens.length === 0) return tokens;
        const configured = new Set(tokens.map((tokenDef) => tokenDef.token));
        return [
            ...tokens,
            ...clientInternalTokens.filter((tokenDef) => !configured.has(tokenDef.token))
        ];
    }, [tokens, clientInternalTokens]);

    const clientInfoSections = useMemo(() => getClientInfoSections(clientPayload), [clientPayload]);
    const clientSummaryFields = useMemo(() => getClientSummaryFields(clientPayload), [clientPayload]);

    const readStoredInputValue = (token) => {
        try {
            return localStorage.getItem("input_" + token);
        } catch {
            return null;
        }
    };

    const getTokenValue = (tokenDef) => {
        const token = typeof tokenDef === "string" ? tokenDef : tokenDef?.token;
        if (!token) return "";
        const stateValue = values[token];
        if (stateValue !== undefined && stateValue !== null) return stateValue;
        const storedValue = readStoredInputValue(token);
        if (storedValue !== null) return storedValue;
        return typeof tokenDef === "object" ? tokenDef?.default ?? "" : "";
    };

    useEffect(() => {
        if (!clientPayload || tokens.length === 0 || clientInternalTokens.length > 0) return;

        const {
            tokenDefs: internalTokenDefs,
            values: internalValues,
            matchedTokens: internalMatchedTokens
        } = getClientInternalTokenData(clientPayload);
        const availableTokens = [
            ...tokens,
            ...internalTokenDefs.filter((internalToken) =>
                !tokens.some((tokenDef) => tokenDef.token === internalToken.token)
            )
        ];
        const { values: matchedValues, matchedTokens } = matchClientDataToTokens(clientPayload, availableTokens);
        const nextValues = { ...internalValues, ...matchedValues };
        const tokensToClear = new Map();
        [...internalMatchedTokens, ...matchedTokens].forEach((match) => {
            tokensToClear.set(match.token, match);
        });
        tokensToClear.forEach(({ token, value }) => {
            localStorage.setItem("input_" + token, value);
        });

        setClientInternalTokens(internalTokenDefs);
        setClientMatchedTokens(Array.from(tokensToClear.values()));
        setValues((prev) => ({ ...prev, ...nextValues }));
    }, [clientPayload, clientInternalTokens.length, tokens]);

    const clearClientInfo = () => {
        setValues({});
        clearStoredInputValues();
        setClientPayload(null);
        setClientMatchedTokens([]);
        setClientInternalTokens([]);
        clearActiveClientPayload();
        setClientDetailsExpanded(false);
        setClientPasteOpen(false);
        setClientPasteInitialError("");
        setTokenPrompt(null);
        setCopyPreview(null);
        setPromptMissingTokens([]);
        setVariantPicker(null);
        setClientImportStatus({ type: "idle", message: "" });
        lastSectionClickVersion.current = {};
        inputChangeVersion.current++;
    };

    const loadClientFromText = (text) => {
        const payload = parseClientClipboardJSON(text);
        const {
            tokenDefs: internalTokenDefs,
            values: internalValues,
            matchedTokens: internalMatchedTokens
        } = getClientInternalTokenData(payload);
        const availableTokens = [
            ...tokens,
            ...internalTokenDefs.filter((internalToken) =>
                !tokens.some((tokenDef) => tokenDef.token === internalToken.token)
            )
        ];
        const { values: matchedValues, matchedTokens } = matchClientDataToTokens(payload, availableTokens);
        const nextLanguage = getClientLanguageCode(payload);
        const nextValues = { ...internalValues, ...matchedValues };
        const tokensToClear = new Map();
        [...internalMatchedTokens, ...matchedTokens].forEach((match) => {
            tokensToClear.set(match.token, match);
        });

        clearStoredInputValues();
        tokensToClear.forEach(({ token, value }) => {
            localStorage.setItem("input_" + token, value);
        });

        setClientPayload(payload);
        saveActiveClientPayload(payload);
        setClientInternalTokens(internalTokenDefs);
        setClientMatchedTokens(Array.from(tokensToClear.values()));
        setClientDetailsExpanded(false);
        setTokenPrompt(null);
        setCopyPreview(null);
        setPromptMissingTokens([]);
        setVariantPicker(null);
        if (nextLanguage) setLang(nextLanguage);

        setValues(nextValues);
        inputChangeVersion.current++;
        setClientImportStatus({ type: "success", message: "" });
    };

    const readClientClipboard = async (event) => {
        setClientImportLoading(true);
        try {
            window.focus();
            event?.currentTarget?.focus?.();
            const clipboardText = await readClipboardText();
            loadClientFromText(clipboardText);
            return true;
        } catch (error) {
            const message = error?.message || "Unable to read customer data from clipboard.";
            setClientImportStatus({ type: "error", message });
            showToast(message, "error");
            setClientPasteInitialError(message);
            return false;
        } finally {
            setClientImportLoading(false);
        }
    };

    const importClientFromPaste = (text) => {
        loadClientFromText(text);
        setClientPasteOpen(false);
        setClientPasteInitialError("");
    };

    const collectInputValues = (requiredTokens) => {
        const vals = {};
        const missing = [];
        const set = new Set(requiredTokens || []);
        const knownTokens = new Set();

        templateTokens.forEach((tokenDef) => {
            knownTokens.add(tokenDef.token);
            const stored = getTokenValue(tokenDef);
            if (set.size === 0 || set.has(tokenDef.token)) {
                if (stored === "" || stored === null || stored === undefined) missing.push(tokenDef.token);
            }
            vals[tokenDef.token] = stored;
        });

        set.forEach((tokenName) => {
            if (knownTokens.has(tokenName)) return;
            const stored = getTokenValue(tokenName);
            vals[tokenName] = stored;
            if (stored === "" || stored === null || stored === undefined) missing.push(tokenName);
        });

        return { values: vals, missing };
    };

    const buildTokenPrompt = (effectiveModel, sectionKey, mode = "copy") => {
        const text = getTemplateTextByLang(effectiveModel, lang) || "";
        const tokensNeeded = Array.from(new Set(text.match(/\{[^{}]+\}/g) || []));
        if (tokensNeeded.length === 0) return null;

        const tokenMap = new Map(templateTokens.map((tokenDef) => [tokenDef.token, tokenDef]));
        const missingTokensNeeded = tokensNeeded.filter((tokenName) => {
            const tokenDef = tokenMap.get(tokenName);
            const stored = getTokenValue(tokenDef || tokenName);
            return stored === "" || stored === null || stored === undefined;
        });
        if (missingTokensNeeded.length === 0) return null;

        return {
            mode,
            title: getTemplateDisplayTitle(effectiveModel),
            tokenDefs: missingTokensNeeded.map((tokenName) => tokenMap.get(tokenName) || {
                token: tokenName,
                label: tokenName,
                input_type: "text"
            }),
            effectiveModel,
            sectionKey
        };
    };

    const requestTokenInputs = (model, sectionKey, baseModel = null) => {
        const effectiveModel = baseModel ? resolveVariantModel(baseModel, model) : model;
        const prompt = buildTokenPrompt(effectiveModel, sectionKey, "fill");
        if (!prompt) return false;

        setPromptMissingTokens([]);
        setTokenPrompt(prompt);
        return true;
    };

    const setCopyPreviewCopied = (id) => {
        setCopyPreview((prev) => prev?.id === id ? { ...prev, copied: true } : prev);
    };

    const copyPreviewHtml = async (html, id) => {
        await copyHtml(html, { message: "Text copied", variant: "success" });
        setCopyPreviewCopied(id);
    };

    const openTemplateResult = async (effectiveModel, sectionKey) => {
        const tokensNeeded = Array.from(new Set((getTemplateTextByLang(effectiveModel, lang) || "").match(/\{[^{}]+\}/g) || []));
        const { values: filled, missing } = tokensNeeded.length > 0
            ? collectInputValues(tokensNeeded)
            : { values: {}, missing: [] };
        if (missing.length > 0) {
            setPromptMissingTokens(missing);
            showToast("Missing data for: " + missing.join(", "), "error");
            return false;
        }

        const finalText = generateFinalText(effectiveModel, lang, filled);
        const id = copyPreviewId.current + 1;
        copyPreviewId.current = id;
        setCopyPreview({
            id,
            title: getTemplateDisplayTitle(effectiveModel),
            html: finalText,
            copied: false
        });
        lastSectionClickVersion.current[sectionKey] = inputChangeVersion.current;
        await copyPreviewHtml(finalText, id);
        return true;
    };

    const requestTemplateResult = async (model, section, baseModel = null) => {
        const sectionKey = section || model?.type || "global";
        const effectiveModel = baseModel ? resolveVariantModel(baseModel, model) : model;
        const prompt = buildTokenPrompt(effectiveModel, sectionKey, "result");
        if (prompt) {
            setPromptMissingTokens([]);
            setTokenPrompt(prompt);
            return false;
        }
        return openTemplateResult(effectiveModel, sectionKey);
    };

    const copyTemplateResultAgain = async () => {
        if (!copyPreview?.html) return;
        setCopyPreview((prev) => prev ? { ...prev, copied: false } : prev);
        await copyPreviewHtml(copyPreview.html, copyPreview.id);
    };

    const copyModel = async (model, section, baseModel = null, skipPopup = false) => {
        const sectionKey = section || model?.type || "global";
        const effectiveModel = baseModel ? resolveVariantModel(baseModel, model) : model;
        const text = getTemplateTextByLang(effectiveModel, lang) || "";
        const tokensNeeded = Array.from(new Set(text.match(/\{[^{}]+\}/g) || []));

        if (tokensNeeded.length === 0) {
            const finalText = generateFinalText(effectiveModel, lang, {});
            await copyHtml(finalText, { message: "Text copied", variant: "info" });
            lastSectionClickVersion.current[sectionKey] = inputChangeVersion.current;
            return;
        }

        if (!skipPopup) {
            const prompt = buildTokenPrompt(effectiveModel, sectionKey, "copy");
            if (prompt) {
                setPromptMissingTokens([]);
                setTokenPrompt(prompt);
                return;
            }
        }

        const { values: filled, missing } = collectInputValues(tokensNeeded);
        if (missing.length > 0) {
            showToast("Missing data for: " + missing.join(", "), "error");
            return;
        }

        const warnSameSection = lastSectionClickVersion.current[sectionKey] !== undefined
            && lastSectionClickVersion.current[sectionKey] === inputChangeVersion.current;
        const map = {};
        Object.entries(filled).forEach(([token, val]) => {
            map[token] = val;
        });
        const finalText = generateFinalText(effectiveModel, lang, map);
        await copyHtml(finalText, {
            message: warnSameSection ? "Text copied (data unchanged)." : "Text copied",
            variant: warnSameSection ? "warning" : "info"
        });
        lastSectionClickVersion.current[sectionKey] = inputChangeVersion.current;
    };

    const requestCopy = (model, sectionKey) => {
        if (!model) return;
        if (model.variants && model.variants.length > 0) {
            setVariantPicker({ model, sectionKey });
        } else {
            requestTemplateResult(model, sectionKey);
        }
    };

    const clearOnDemandValues = (tokenDefs) => {
        setValues((prev) => {
            const next = { ...prev };
            tokenDefs.forEach(({ token }) => {
                delete next[token];
                localStorage.removeItem("input_" + token);
            });
            return next;
        });
    };

    const persistTokenPromptValues = (tokenDefs, filledValues) => {
        const persistedValues = {};
        tokenDefs.forEach((tokenDef) => {
            const value = filledValues[tokenDef.token] ?? getTokenValue(tokenDef);
            const { inputTokens } = saveClientInputValue(tokenDef, value);
            inputTokens.forEach((token) => {
                persistedValues[token] = value;
            });
        });

        if (Object.keys(persistedValues).length > 0) {
            setValues((prev) => ({ ...prev, ...persistedValues }));
        }
        inputChangeVersion.current++;
    };

    const confirmTokenPrompt = async () => {
        if (!tokenPrompt) return;
        const requiredTokens = tokenPrompt.tokenDefs.map((tokenDef) => tokenDef.token);
        const { values: filled, missing } = collectInputValues(requiredTokens);
        if (missing.length > 0) {
            setPromptMissingTokens(missing);
            showToast("Missing data for: " + missing.join(", "), "error");
            return;
        }
        const { effectiveModel, sectionKey, tokenDefs } = tokenPrompt;
        persistTokenPromptValues(tokenDefs, filled);
        setTokenPrompt(null);
        setPromptMissingTokens([]);
        if (tokenPrompt.mode === "fill") return;
        if (tokenPrompt.mode === "result") {
            await openTemplateResult(effectiveModel, sectionKey);
            return;
        }
        await copyModel(effectiveModel, sectionKey, null, true);
    };

    return {
        lang,
        setLang,
        tokens: templateTokens,
        values,
        setValues,
        clientInfoSections,
        clientSummaryFields,
        clientPayload,
        clientImportStatus,
        clientImportLoading,
        clientDetailsExpanded,
        setClientDetailsExpanded,
        readClientClipboard,
        clearClientInfo,
        clientPasteOpen,
        setClientPasteOpen,
        clientPasteInitialError,
        setClientPasteInitialError,
        importClientFromPaste,
        copyPreview,
        setCopyPreview,
        copyTemplateResultAgain,
        variantPicker,
        setVariantPicker,
        tokenPrompt,
        promptMissingTokens,
        setPromptMissingTokens,
        setTokenPrompt,
        inputChangeVersion,
        requestCopy,
        copyModel,
        requestTemplateResult,
        requestTokenInputs,
        confirmTokenPrompt,
        clearOnDemandValues
    };
}
