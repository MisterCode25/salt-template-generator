import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Copy } from "lucide-react";
import { generateFinalText, getTemplateTextByLang } from "../core/tokenEngine.js";
import {
    ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT,
    CLIENT_INPUT_VALUES_UPDATED_EVENT,
    clearActiveClientPayload,
    clearStoredInputValues,
    loadActiveClientPayload,
    migrateStoredClientInputValues,
    saveClientInputValue,
    saveClientInputValues,
    saveActiveClientPayload,
    saveImportedExternalId
} from "../services/activeClientService.js";
import { copyHtml, copyText, formatClipboardHtmlBody, showToast } from "../services/clipboardService.js";
import { resolveTemplateImagesInHtml } from "../services/templateImageService.js";
import { stripImagesFromHtml } from "../utils/templateImages.js";
import { loadTokens } from "../services/tokenService.js";
import { deleteJSON, loadJSON, saveJSON } from "../services/storageService.js";
import {
    loadTokenInputValues,
    removeTokenInputValues,
    setTokenInputValues
} from "../services/tokenInputValueService.js";
import {
    AGENT_PROFILE_UPDATED_EVENT,
    getAgentProfileTokenValues,
    isAgentProfileToken,
    loadAgentProfile,
    saveAgentProfileTokenValue,
    syncAgentProfileInputValues
} from "../services/agentProfileService.js";
import {
    getClientInfoSections,
    getClientInternalTokenData,
    getClientLanguageCode,
    getClientSummaryFields,
    matchClientDataToTokens,
    parseClientClipboardJSON
} from "../utils/clientClipboard.js";
import { formatTokenPreviewHTML } from "../utils/richTextTokens.js";
import { canonicalizeInputTokenValue } from "../utils/tokenCanonicalization.js";
import {
    EXTERNAL_FIELD_ORDER,
    getImportedExternalIdFromClientPayload,
    getValidExternalId,
    parseExternalId
} from "../utils/externalGenerator.js";
import {
    applyExternalIdValuesToImportResult,
    applyExternalIdConflictSelectionsToImportResult,
    applyExternalIdSourceCorrectionsToImportResult,
    getExternalIdSourceConflicts
} from "../utils/externalIdConflicts.js";
import { parseSuperOfficeInfoPayload } from "../utils/superOfficeImport.js";
import {
    clearSuperOfficeTicketPayload,
    consumePendingSuperOfficeTicketPayload,
    getSuperOfficeClientSignature,
    loadPendingSuperOfficeTicketPayload,
    loadSuperOfficeTicketPayload,
    saveSuperOfficeTicketPayload
} from "../services/superOfficeTicketService.js";
import Modal from "./Modal.jsx";

const CLIENT_CLIPBOARD_READ_TIMEOUT_MS = 3500;
const CLIENT_BAR_FIELDS_KEY = "client_bar_fields";
const CLIENT_BAR_FIELD_LIMIT = 8;

function sanitizeGeneratedTemplateHtml(model, html = "") {
    return model?.type === "sms" ? stripImagesFromHtml(html) : html;
}

function clientBarFieldKey(scope, label) {
    return `${scope}:${String(label || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

async function loadClientBarFieldKeys() {
    try {
        const parsed = await loadJSON(CLIENT_BAR_FIELDS_KEY, null);
        return Array.isArray(parsed) ? parsed.filter((key) => typeof key === "string") : null;
    } catch {
        return null;
    }
}

function saveClientBarFieldKeys(keys) {
    return saveJSON(CLIENT_BAR_FIELDS_KEY, keys);
}

function buildClientBarFieldGroups(summaryFields = [], sections = []) {
    const seen = new Set();
    const groups = [];
    const summaryOptions = summaryFields.map((field) => ({
        key: clientBarFieldKey("summary", field.label),
        label: field.label,
        value: field.value
    }));
    summaryOptions.forEach((option) => seen.add(option.key));
    if (summaryOptions.length > 0) {
        groups.push({ id: "summary", title: "Default bar", fields: summaryOptions });
    }

    sections.forEach((section) => {
        const fields = section.fields
            .map((field) => ({
                key: clientBarFieldKey(section.id, field.label),
                label: field.label,
                value: field.value
            }))
            .filter((field) => {
                if (seen.has(field.key)) return false;
                seen.add(field.key);
                return true;
            });
        if (fields.length > 0) groups.push({ id: section.id, title: section.title, fields });
    });

    return groups;
}

function flattenClientBarFieldGroups(groups = []) {
    return groups.flatMap((group) => group.fields || []);
}

function getDefaultClientBarFieldKeys(summaryFields = []) {
    return summaryFields
        .slice(0, CLIENT_BAR_FIELD_LIMIT)
        .map((field) => clientBarFieldKey("summary", field.label));
}

function resolveClientBarSummaryFields(groups = [], selectedKeys, fallbackSummaryFields = []) {
    const allFields = flattenClientBarFieldGroups(groups);
    if (allFields.length === 0) return fallbackSummaryFields;
    const fallbackKeys = getDefaultClientBarFieldKeys(fallbackSummaryFields);
    const activeKeys = Array.isArray(selectedKeys) && selectedKeys.length > 0 ? selectedKeys : fallbackKeys;
    const byKey = new Map(allFields.map((field) => [field.key, field]));
    const selected = activeKeys
        .map((key) => byKey.get(key))
        .filter(Boolean)
        .slice(0, CLIENT_BAR_FIELD_LIMIT)
        .map(({ label, value }) => ({ label, value }));
    return selected.length > 0 ? selected : fallbackSummaryFields;
}

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

function getExternalIdFromClientPayload(payload) {
    return getImportedExternalIdFromClientPayload(payload);
}

function getSuperOfficeContractorNumber(importResult = {}, tokenValues = {}) {
    return String(
        importResult?.contractorNumber
        || tokenValues?.["{contractor}"]
        || tokenValues?.["{contractor_number}"]
        || tokenValues?.["{client_contractor_number}"]
        || tokenValues?.["{external_customer}"]
        || importResult?.externalFields?.customer
        || ""
    ).trim();
}

const EXTERNAL_ID_FIELD_LABELS = {
    flagging: "Flagging",
    data: "Date",
    customer: "Contractor",
    soTicket: "SO ticket",
    SignalStatus: "Signal",
    LedStatus: "LED",
    treatmentStep: "Treatment",
    boxType: "Box",
    partner: "Partner",
    partnerTicketNumber: "Partner ticket",
    lexId: "LEX ID",
    oltName: "OLT",
    oltBoard: "Board",
    bokBof: "BOK/BOF",
    comment: "Comment"
};

function formatExternalIdSegmentValue(field, value) {
    const text = String(value ?? "").trim();
    if (field === "data" && text) {
        return text.split("-").reverse().join(".");
    }
    return text;
}

function buildExternalIdSegments(externalId) {
    const parsed = parseExternalId(externalId);
    if (!parsed.ok) return [];

    return EXTERNAL_FIELD_ORDER.map((field) => ({
        field,
        label: EXTERNAL_ID_FIELD_LABELS[field] || field,
        value: formatExternalIdSegmentValue(field, parsed.fields[field])
    }));
}

const TokenPromptField = memo(function TokenPromptField({
    tokenDef,
    value,
    hasError,
    autoFocus,
    onChange
}) {
    const type = tokenDef.input_type === "number"
        ? "number"
        : tokenDef.input_type === "date"
            ? "date"
            : "text";

    return (
        <div className={`token-prompt-field${hasError ? " token-prompt-field--error" : ""}`}>
            <label htmlFor={`tp-${tokenDef.token}`}>{tokenDef.label || tokenDef.token}</label>
            <input
                id={`tp-${tokenDef.token}`}
                type={type}
                autoFocus={autoFocus}
                value={value}
                className={hasError ? "input-error" : ""}
                placeholder={tokenDef.token}
                onChange={(event) => onChange(tokenDef.token, event.target.value)}
            />
            {hasError && <span className="token-prompt-field-error">This field is required</span>}
        </div>
    );
});

export const TokenPromptModal = memo(function TokenPromptModal({ title, tokenDefs, values, missingTokens, mode = "copy", onChange, onConfirm, onClose }) {
    const isMultiCol = tokenDefs.length > 2;
    const isFillMode = mode === "fill";
    const isResultMode = mode === "result";
    const missingTokenSet = useMemo(() => new Set(missingTokens), [missingTokens]);

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
                {tokenDefs.map((tokenDef, idx) => (
                    <TokenPromptField
                        key={tokenDef.token}
                        tokenDef={tokenDef}
                        value={values[tokenDef.token] ?? tokenDef.default ?? ""}
                        hasError={missingTokenSet.has(tokenDef.token)}
                        autoFocus={idx === 0}
                        onChange={onChange}
                    />
                ))}
            </div>
            <div className="popup-actions">
                <button className="primary-btn" onClick={onConfirm}>{isFillMode ? "Apply" : isResultMode ? "Continue" : "Copy text"}</button>
            </div>
        </Modal>
    );
});

export const VariantModal = memo(function VariantModal({ model, displayTitle, onSelect, onClose }) {
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
});

export const TemplateResultModal = memo(function TemplateResultModal({
    result,
    channelOptions = [],
    currentChannel = "",
    onSelectChannel,
    onNextChannel,
    onCopy,
    onClose
}) {
    if (!result) return null;
    const showChannelControls = channelOptions.length > 1 && onSelectChannel;

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
            {showChannelControls && (
                <div className="template-result-toolbar">
                    <div className="template-result-channel-segments" role="tablist" aria-label="Channel">
                        {channelOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`template-result-channel-segment${currentChannel === option.value ? " is-active" : ""}`}
                                onClick={() => onSelectChannel(option.value)}
                                role="tab"
                                aria-selected={currentChannel === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div
                className="rich-preview template-result-preview"
                data-placeholder="No content."
                dangerouslySetInnerHTML={{ __html: formatTokenPreviewHTML(formatClipboardHtmlBody(result.html || "")) }}
            />
            <div className="popup-actions template-result-actions">
                <button type="button" className="template-result-action-btn template-result-copy-btn" onClick={onCopy}>
                    <Copy size={14} aria-hidden="true" />
                    Copy again
                </button>
                {showChannelControls && (
                    <button type="button" className="template-result-action-btn template-result-next-btn" onClick={onNextChannel}>
                        Next
                        <ArrowRight size={14} aria-hidden="true" />
                    </button>
                )}
            </div>
        </Modal>
    );
});

export function ClientBarCustomizeModal({
    groups,
    selectedKeys,
    defaultKeys,
    onChange,
    onReset,
    onClose
}) {
    const activeKeys = Array.isArray(selectedKeys) && selectedKeys.length > 0 ? selectedKeys : defaultKeys;
    const selectedSet = useMemo(() => new Set(activeKeys), [activeKeys]);
    const fieldByKey = useMemo(() => new Map(flattenClientBarFieldGroups(groups).map((field) => [field.key, field])), [groups]);
    const visibleFields = useMemo(
        () => activeKeys.map((key) => fieldByKey.get(key)).filter(Boolean).slice(0, CLIENT_BAR_FIELD_LIMIT),
        [activeKeys, fieldByKey]
    );
    const selectedCount = selectedSet.size;

    const toggleField = (key) => {
        const next = selectedSet.has(key)
            ? activeKeys.filter((item) => item !== key)
            : [...activeKeys, key];
        onChange(next.slice(0, CLIENT_BAR_FIELD_LIMIT));
    };

    const moveField = (key, direction) => {
        const fromIndex = activeKeys.indexOf(key);
        const toIndex = fromIndex + direction;
        if (fromIndex < 0 || toIndex < 0 || toIndex >= activeKeys.length) return;
        const next = [...activeKeys];
        const [item] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, item);
        onChange(next);
    };

    return (
        <Modal onClose={onClose} dialogClassName="popup-box client-bar-customize-modal" ariaLabel="Customize client bar">
            <div className="popup-header">
                <div>
                    <h2>Customize client bar</h2>
                    <p className="hint">Choose up to {CLIENT_BAR_FIELD_LIMIT} fields and order them in the client bar.</p>
                </div>
                <span className="client-bar-customize-count">{selectedCount}/{CLIENT_BAR_FIELD_LIMIT}</span>
            </div>
            <div className="client-bar-customize-list">
                {visibleFields.length > 0 && (
                    <section className="client-bar-customize-section">
                        <h3>Visible fields</h3>
                        <div className="client-bar-customize-visible-list">
                            {visibleFields.map((field, index) => (
                                <div key={field.key} className="client-bar-customize-visible-item">
                                    <span className="client-bar-customize-drag-index">{index + 1}</span>
                                    <span className="client-bar-customize-visible-copy">
                                        <strong>{field.label}</strong>
                                        <small>{field.value}</small>
                                    </span>
                                    <span className="client-bar-customize-reorder-actions">
                                        <button
                                            type="button"
                                            onClick={() => moveField(field.key, -1)}
                                            disabled={index === 0}
                                            aria-label={`Move ${field.label} up`}
                                            title="Move up"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveField(field.key, 1)}
                                            disabled={index === visibleFields.length - 1}
                                            aria-label={`Move ${field.label} down`}
                                            title="Move down"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toggleField(field.key)}
                                            aria-label={`Remove ${field.label}`}
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {groups.map((group) => (
                    <section key={group.id} className="client-bar-customize-section">
                        <h3>{group.title}</h3>
                        <div className="client-bar-customize-fields">
                            {group.fields.map((field) => {
                                const checked = selectedSet.has(field.key);
                                const disabled = !checked && selectedCount >= CLIENT_BAR_FIELD_LIMIT;
                                return (
                                    <label key={field.key} className={`client-bar-customize-option${disabled ? " is-disabled" : ""}`}>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            disabled={disabled}
                                            onChange={() => toggleField(field.key)}
                                        />
                                        <span>
                                            <strong>{field.label}</strong>
                                            <small>{field.value}</small>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
            <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={onReset}>Reset default</button>
                <button type="button" className="primary-btn" onClick={onClose}>Done</button>
            </div>
        </Modal>
    );
}

export const ClientInfoPanel = memo(function ClientInfoPanel({
    sections,
    summaryFields,
    externalId,
    status,
    loading,
    detailsExpanded,
    lang,
    hasVtiData = false,
    hasSuperOfficeData = false,
    onChangeLang,
    onReadClipboard,
    onReadSuperOffice,
    onOpenPaste,
    onClearClient,
    onCustomizeBar,
    onExternalIdFieldClick,
    onToggleDetails
}) {
    const hasInfo = sections.length > 0;
    const isError = status.type === "error";
    const hasAnyImportedData = hasVtiData || hasSuperOfficeData;
    const externalIdSegments = useMemo(() => buildExternalIdSegments(externalId), [externalId]);
    const copyExternalId = async () => {
        try {
            await navigator.clipboard.writeText(externalId);
            showToast("External ID copied", "success");
        } catch {
            showToast("Unable to copy External ID", "error");
        }
    };

    return (
        <section className="client-info-panel" aria-label="Client information">
            <div className="client-import-status-row" aria-label="Data imports">
                {!hasVtiData && (
                    <button
                        type="button"
                        className="client-import-status-btn client-import-status-btn--vti is-missing"
                        onClick={onReadClipboard}
                        disabled={loading}
                        title="Import missing VTI data. Alt+Q"
                    >
                        <span>{loading ? "Importing..." : "VTI"}</span>
                        <small>Missing</small>
                    </button>
                )}
                {!hasSuperOfficeData && (
                    <button
                        type="button"
                        className="client-import-status-btn client-import-status-btn--so is-missing"
                        onClick={onReadSuperOffice}
                        disabled={loading}
                        title="Import missing SO data. Alt+W"
                    >
                        <span>SO</span>
                        <small>Missing</small>
                    </button>
                )}
                <button
                    type="button"
                    className="client-import-clear-btn"
                    onClick={onClearClient}
                    disabled={loading || !hasAnyImportedData}
                    aria-label="Clear imported data"
                    title={hasAnyImportedData ? "Clear VTI and SO data. Alt+E" : "No imported data to clear"}
                >
                    <span aria-hidden="true">×</span>
                    Clear
                </button>
                {isError && (
                    <button type="button" className="client-info-paste-btn" onClick={onOpenPaste}>
                        Paste manually
                    </button>
                )}
            </div>
            <div className="client-info-bar">
                <div className="client-info-bar-main">
                    {!hasInfo ? (
                        <div className="client-info-bar-empty">
                            <span className="client-info-bar-hint">No client loaded</span>
                        </div>
                    ) : (
                        <div className="client-info-bar-loaded">
                            <span className="client-info-bar-check" aria-label="Client loaded">✓</span>
                            <div className="client-info-bar-fields">
                                {summaryFields.map((field) => (
                                    <div
                                        key={field.label}
                                        className="client-info-bar-field"
                                        title={`${field.label}: ${field.value}`}
                                    >
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
                            {onCustomizeBar && (
                                <button
                                    type="button"
                                    className="client-info-toggle-btn"
                                    onClick={onCustomizeBar}
                                    title="Customize client bar"
                                >
                                    Customize
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {hasInfo && externalId && (
                <div className="client-info-external-id" aria-label="Imported external ID">
                    <span className="client-info-external-id-side">
                        <span className="client-info-external-id-label">External ID</span>
                        <button
                            type="button"
                            className="client-info-external-id-copy"
                            onClick={copyExternalId}
                            title="Copy External ID"
                            aria-label="Copy External ID"
                        >
                            Copy
                        </button>
                    </span>
                    {externalIdSegments.length > 0 ? (
                        <div className="client-info-external-id-chips" aria-label="External ID fields">
                            {externalIdSegments.map((segment, index) => (
                                <span key={segment.field} className="client-info-external-id-segment">
                                    <button
                                        type="button"
                                        className={`client-info-external-id-chip${segment.value ? "" : " is-empty"}`}
                                        onClick={() => onExternalIdFieldClick?.(segment.field)}
                                        disabled={!onExternalIdFieldClick}
                                        title={`${segment.label}: ${segment.value || "Empty"}`}
                                        aria-label={`Edit ${segment.label}`}
                                    >
                                        <span className="client-info-external-id-chip-value">{segment.value || "Empty"}</span>
                                    </button>
                                    {index < externalIdSegments.length - 1 && (
                                        <span className="client-info-external-id-separator" aria-hidden="true">//</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="client-info-external-id-value">{externalId}</span>
                    )}
                </div>
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
});

export function ClientImportErrorModal({ message, onClose }) {
    return (
        <Modal onClose={onClose} dialogClassName="popup-box client-import-error-modal" ariaLabel="Import error">
            <div className="popup-header">
                <div>
                    <p className="eyebrow">Import error</p>
                    <h2>Unable to import data</h2>
                </div>
            </div>
            <p className="client-import-error-message">{message}</p>
            <div className="popup-actions">
                <button type="button" className="primary-btn" onClick={onClose}>OK</button>
            </div>
        </Modal>
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

export function ExternalIdConflictModal({ conflicts = [], onApplySelections, onCancel }) {
    const [selectionByField, setSelectionByField] = useState(() => (
        Object.fromEntries(conflicts.map((conflict) => [conflict.field, "source"]))
    ));

    useEffect(() => {
        setSelectionByField(Object.fromEntries(conflicts.map((conflict) => [conflict.field, "source"])));
    }, [conflicts]);

    const selectValue = (field, source) => {
        setSelectionByField((current) => ({
            ...current,
            [field]: source
        }));
    };

    return (
        <Modal onClose={onCancel} dialogClassName="popup-box external-id-conflict-modal" ariaLabel="Import data conflict">
            <div className="popup-header">
                <div>
                    <h2>Import data conflict</h2>
                    <p className="hint">Click the value to keep for each conflicting field.</p>
                </div>
            </div>
            <div className="external-id-conflict-list">
                {conflicts.map((conflict) => {
                    const selectedSource = selectionByField[conflict.field] || "source";
                    return (
                        <div key={conflict.field} className="external-id-conflict-item">
                            <div className="external-id-conflict-head">
                                <strong>{conflict.label}</strong>
                                <span>{conflict.sourceLabel}</span>
                            </div>
                            <div className="external-id-conflict-values">
                                <button
                                    type="button"
                                    className={`external-id-conflict-choice${selectedSource === "external" ? " is-selected" : ""}`}
                                    onClick={() => selectValue(conflict.field, "external")}
                                    aria-pressed={selectedSource === "external"}
                                >
                                    <span>SO import</span>
                                    <code>{conflict.externalValue || "Empty"}</code>
                                </button>
                                <button
                                    type="button"
                                    className={`external-id-conflict-choice${selectedSource === "source" ? " is-selected" : ""}`}
                                    onClick={() => selectValue(conflict.field, "source")}
                                    aria-pressed={selectedSource === "source"}
                                >
                                    <span>{conflict.sourceLabel}</span>
                                    <code>{conflict.expectedValue}</code>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={onCancel}>Cancel import</button>
                <button type="button" className="primary-btn" onClick={() => onApplySelections(selectionByField)}>Import selected data</button>
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
    const [clientImportErrorModal, setClientImportErrorModal] = useState(null);
    const [clientBarFieldKeys, setClientBarFieldKeys] = useState(null);
    const [clientBarCustomizeOpen, setClientBarCustomizeOpen] = useState(false);
    const [externalIdConflictPrompt, setExternalIdConflictPrompt] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const applyAgentProfile = async (profile = null) => {
            const effectiveProfile = profile || await loadAgentProfile();
            await syncAgentProfileInputValues(effectiveProfile);
            if (cancelled) return;
            setValues((prev) => ({ ...prev, ...getAgentProfileTokenValues(effectiveProfile) }));
            inputChangeVersion.current++;
        };

        const initializeRuntimeStorage = async () => {
            await migrateStoredClientInputValues();
            const [
                loadedTokens,
                tokenInputValues,
                storedClient,
                barKeys
            ] = await Promise.all([
                loadTokens(),
                loadTokenInputValues(),
                loadActiveClientPayload(),
                loadClientBarFieldKeys()
            ]);
            if (cancelled) return;
            setTokens(loadedTokens);
            setValues((prev) => ({ ...prev, ...tokenInputValues }));
            setClientBarFieldKeys(barKeys);
            await applyAgentProfile();
            if (cancelled) return;
            if (storedClient) {
                setClientPayload(storedClient);
                setClientImportStatus({ type: "success", message: "" });
            }
        };

        initializeRuntimeStorage();

        const handleAgentProfileUpdated = (event) => {
            applyAgentProfile(event.detail?.profile);
        };
        const handleClientInputValuesUpdated = async (event) => {
            const nextValues = event.detail?.values;
            if (!nextValues || typeof nextValues !== "object") return;
            setValues((prev) => ({ ...prev, ...nextValues }));
            const latestClientPayload = await loadActiveClientPayload();
            if (latestClientPayload) {
                setClientPayload(latestClientPayload);
            }
            inputChangeVersion.current++;
        };
        const handleActiveClientPayloadUpdated = (event) => {
            const nextPayload = event.detail?.payload;
            if (nextPayload && typeof nextPayload === "object") {
                setClientPayload(nextPayload);
            }
        };
        window.addEventListener(AGENT_PROFILE_UPDATED_EVENT, handleAgentProfileUpdated);
        window.addEventListener(ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT, handleActiveClientPayloadUpdated);
        window.addEventListener(CLIENT_INPUT_VALUES_UPDATED_EVENT, handleClientInputValuesUpdated);

        return () => {
            cancelled = true;
            window.removeEventListener(AGENT_PROFILE_UPDATED_EVENT, handleAgentProfileUpdated);
            window.removeEventListener(ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT, handleActiveClientPayloadUpdated);
            window.removeEventListener(CLIENT_INPUT_VALUES_UPDATED_EVENT, handleClientInputValuesUpdated);
        };
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
    const defaultClientSummaryFields = useMemo(() => getClientSummaryFields(clientPayload), [clientPayload]);
    const clientBarFieldGroups = useMemo(
        () => buildClientBarFieldGroups(defaultClientSummaryFields, clientInfoSections),
        [clientInfoSections, defaultClientSummaryFields]
    );
    const clientBarDefaultFieldKeys = useMemo(
        () => getDefaultClientBarFieldKeys(defaultClientSummaryFields),
        [defaultClientSummaryFields]
    );
    const clientSummaryFields = useMemo(
        () => resolveClientBarSummaryFields(clientBarFieldGroups, clientBarFieldKeys, defaultClientSummaryFields),
        [clientBarFieldGroups, clientBarFieldKeys, defaultClientSummaryFields]
    );
    const clientExternalId = useMemo(() => getExternalIdFromClientPayload(clientPayload), [clientPayload]);

    const saveClientBarSelection = (keys) => {
        const next = Array.isArray(keys) ? keys.slice(0, CLIENT_BAR_FIELD_LIMIT) : [];
        setClientBarFieldKeys(next);
        saveClientBarFieldKeys(next);
    };

    const resetClientBarSelection = () => {
        setClientBarFieldKeys(null);
        deleteJSON(CLIENT_BAR_FIELDS_KEY);
    };

    const getTokenValue = (tokenDef) => {
        const token = typeof tokenDef === "string" ? tokenDef : tokenDef?.token;
        if (!token) return "";
        const canonicalToken = canonicalizeInputTokenValue(token);
        const candidateTokens = canonicalToken && canonicalToken !== token
            ? [token, canonicalToken]
            : [token];

        for (const candidateToken of candidateTokens) {
            const stateValue = values[candidateToken];
            if (stateValue !== undefined && stateValue !== null) return stateValue;
        }
        return typeof tokenDef === "object" ? tokenDef?.default ?? "" : "";
    };

    const buildExternalIdConflictPrompt = (importResult, sourceClientPayload = clientPayload) => {
        const conflicts = getExternalIdSourceConflicts(importResult, sourceClientPayload);
        if (conflicts.length === 0) return null;

        return {
            importResult,
            conflicts,
            externalIdImportResult: applyExternalIdValuesToImportResult(importResult),
            correctedImportResult: applyExternalIdSourceCorrectionsToImportResult(importResult, conflicts)
        };
    };

    const completeSuperOfficeImport = async (importResult, tokenValues = importResult?.tokenValues || {}, options = {}) => {
        const nextResult = {
            ...importResult,
            tokenValues
        };
        await saveSuperOfficeTicketPayload(nextResult);

        let nextClientPayload = null;
        if (Object.keys(tokenValues).length > 0) {
            const saved = await saveClientInputValues(tokenValues);
            if (saved.payload) nextClientPayload = saved.payload;
            setValues((prev) => ({ ...prev, ...tokenValues }));
            inputChangeVersion.current++;
        }
        const importedExternalIdPayload = await saveImportedExternalId(getValidExternalId(nextResult.externalTicketId));
        if (importedExternalIdPayload) nextClientPayload = importedExternalIdPayload;
        if (nextClientPayload) setClientPayload(nextClientPayload);

        const contractorNumber = getSuperOfficeContractorNumber(nextResult, tokenValues);
        if (contractorNumber) {
            await copyText(contractorNumber, {
                message: "Contractor copied for VTI search.",
                variant: "success"
            });
        }

        const message = options.corrected
            ? "VTI/client values kept and SuperOffice data imported."
            : options.selectedConflictValues
                ? "Selected conflict values kept and SuperOffice data imported."
                : options.keptExternalId
                    ? "SuperOffice import values kept."
                    : nextResult.ignoredExternalId
                        ? "SO ticket imported. External ID ignored because its format is invalid."
                        : "SuperOffice data imported.";
        setClientImportStatus({ type: "success", message: "" });
        if (!contractorNumber || nextResult.ignoredExternalId || options.corrected || options.keptExternalId) {
            showToast(message, nextResult.ignoredExternalId ? "warning" : "success");
        }
        return true;
    };

    const openExternalIdConflictPrompt = (importResult, sourceClientPayload = clientPayload) => {
        const prompt = buildExternalIdConflictPrompt(importResult, sourceClientPayload);
        if (!prompt) return false;
        setExternalIdConflictPrompt(prompt);
        setClientImportStatus({ type: "idle", message: "" });
        showToast("Import data conflict detected.", "warning");
        return true;
    };

    const keepExternalIdSourceValues = async () => {
        if (!externalIdConflictPrompt) return;
        const correctedImportResult = externalIdConflictPrompt.correctedImportResult;
        await completeSuperOfficeImport(
            correctedImportResult,
            correctedImportResult?.tokenValues || {},
            { corrected: true }
        );
        setExternalIdConflictPrompt(null);
    };

    const keepExternalIdValues = async () => {
        if (!externalIdConflictPrompt) return;
        const importResult = externalIdConflictPrompt.externalIdImportResult;
        await completeSuperOfficeImport(
            importResult,
            importResult?.tokenValues || {},
            { keptExternalId: true }
        );
        setExternalIdConflictPrompt(null);
    };

    const applyExternalIdConflictSelections = async (selections = {}) => {
        if (!externalIdConflictPrompt) return;
        const selectedImportResult = applyExternalIdConflictSelectionsToImportResult(
            externalIdConflictPrompt.importResult,
            externalIdConflictPrompt.conflicts,
            selections
        );
        const sourceCount = externalIdConflictPrompt.conflicts.filter((conflict) => (
            selections?.[conflict.field] !== "external"
        )).length;
        await completeSuperOfficeImport(
            selectedImportResult,
            selectedImportResult?.tokenValues || {},
            {
                corrected: sourceCount === externalIdConflictPrompt.conflicts.length,
                keptExternalId: sourceCount === 0,
                selectedConflictValues: sourceCount > 0 && sourceCount < externalIdConflictPrompt.conflicts.length
            }
        );
        setExternalIdConflictPrompt(null);
    };


    const cancelExternalIdConflictCorrection = () => {
        setExternalIdConflictPrompt(null);
        showToast("SuperOffice import canceled.", "info");
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
        const valuesToPersist = {};
        tokensToClear.forEach(({ token, value }) => {
            valuesToPersist[token] = value;
        });
        setTokenInputValues(valuesToPersist);

        setClientInternalTokens(internalTokenDefs);
        setClientMatchedTokens(Array.from(tokensToClear.values()));
        setValues((prev) => ({ ...prev, ...nextValues }));
    }, [clientPayload, clientInternalTokens.length, tokens]);

    const clearClientInfo = async () => {
        await clearSuperOfficeTicketPayload();
        await clearStoredInputValues();
        const agentProfile = await loadAgentProfile();
        const agentValues = getAgentProfileTokenValues(agentProfile);
        await syncAgentProfileInputValues(agentProfile);
        setValues(agentValues);
        setClientPayload(null);
        setClientMatchedTokens([]);
        setClientInternalTokens([]);
        await clearActiveClientPayload();
        setClientDetailsExpanded(false);
        setClientPasteOpen(false);
        setClientPasteInitialError("");
        setTokenPrompt(null);
        setCopyPreview(null);
        setPromptMissingTokens([]);
        setVariantPicker(null);
        setExternalIdConflictPrompt(null);
        setClientImportStatus({ type: "idle", message: "" });
        lastSectionClickVersion.current = {};
        inputChangeVersion.current++;
    };

    const loadClientFromText = async (text) => {
        const payload = parseClientClipboardJSON(text);
        const currentClientPayload = await loadActiveClientPayload();
        const currentClientSignature = getSuperOfficeClientSignature(currentClientPayload);
        const nextClientSignature = getSuperOfficeClientSignature(payload);
        if (currentClientSignature && currentClientSignature !== nextClientSignature) {
            await clearSuperOfficeTicketPayload();
        }
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

        await clearStoredInputValues();
        const agentProfile = await loadAgentProfile();
        const agentValues = getAgentProfileTokenValues(agentProfile);
        await syncAgentProfileInputValues(agentProfile);
        const valuesToPersist = {};
        tokensToClear.forEach(({ token, value }) => {
            valuesToPersist[token] = value;
        });
        await setTokenInputValues(valuesToPersist);

        await saveActiveClientPayload(payload);
        const pendingSuperOfficeTicket = await loadPendingSuperOfficeTicketPayload();
        const storedSuperOfficeTicket = currentClientSignature === nextClientSignature
            ? await loadSuperOfficeTicketPayload()
            : null;
        const candidateSuperOfficeTicket = pendingSuperOfficeTicket || storedSuperOfficeTicket;
        let activeSuperOfficeTicket = candidateSuperOfficeTicket;
        let superOfficeTokenValues = candidateSuperOfficeTicket?.tokenValues || {};
        let savedSuperOfficeValues = null;
        if (candidateSuperOfficeTicket && Object.keys(superOfficeTokenValues).length > 0) {
            const conflictPrompt = buildExternalIdConflictPrompt(candidateSuperOfficeTicket, payload);
            if (conflictPrompt) {
                setExternalIdConflictPrompt(conflictPrompt);
                showToast("Import data conflict detected.", "warning");
                superOfficeTokenValues = {};
                activeSuperOfficeTicket = null;
            } else {
                if (pendingSuperOfficeTicket) {
                    activeSuperOfficeTicket = await consumePendingSuperOfficeTicketPayload();
                    superOfficeTokenValues = activeSuperOfficeTicket?.tokenValues || {};
                }
                savedSuperOfficeValues = await saveClientInputValues(superOfficeTokenValues);
            }
        } else if (pendingSuperOfficeTicket) {
            activeSuperOfficeTicket = await consumePendingSuperOfficeTicketPayload();
            superOfficeTokenValues = activeSuperOfficeTicket?.tokenValues || {};
        }
        const importedExternalIdPayload = activeSuperOfficeTicket
            ? await saveImportedExternalId(getValidExternalId(activeSuperOfficeTicket.externalTicketId))
            : null;
        const nextPayload = importedExternalIdPayload || savedSuperOfficeValues?.payload || payload;

        setClientPayload(nextPayload);
        setClientInternalTokens(internalTokenDefs);
        setClientMatchedTokens(Array.from(tokensToClear.values()));
        setClientDetailsExpanded(false);
        setTokenPrompt(null);
        setCopyPreview(null);
        setPromptMissingTokens([]);
        setVariantPicker(null);
        if (nextLanguage) setLang(nextLanguage);

        setValues({ ...agentValues, ...nextValues, ...(savedSuperOfficeValues?.values || superOfficeTokenValues) });
        inputChangeVersion.current++;
        setClientImportStatus({ type: "success", message: "" });
    };

    const readClientClipboard = async (event) => {
        setClientImportLoading(true);
        try {
            window.focus();
            event?.currentTarget?.focus?.();
            const clipboardText = await readClipboardText();
            await loadClientFromText(clipboardText);
            return true;
        } catch (error) {
            const message = error?.message || "Unable to read customer data from clipboard.";
            setClientImportStatus({ type: "error", message });
            setClientImportErrorModal(message);
            showToast(message, "error");
            setClientPasteInitialError(message);
            return false;
        } finally {
            setClientImportLoading(false);
        }
    };

    const readSuperOfficeClipboard = async (event) => {
        setClientImportLoading(true);
        try {
            window.focus();
            event?.currentTarget?.focus?.();
            const clipboardText = await readClipboardText();
            const result = parseSuperOfficeInfoPayload(clipboardText);
            if (!result.ok) {
                throw new Error("Clipboard does not contain SuperOffice data.");
            }

            if (openExternalIdConflictPrompt(result, await loadActiveClientPayload())) {
                return false;
            }

            return completeSuperOfficeImport(result);
        } catch (error) {
            const message = error?.message || "Unable to import SuperOffice data.";
            setClientImportStatus({ type: "error", message });
            setClientImportErrorModal(message);
            showToast(message, "error");
            return false;
        } finally {
            setClientImportLoading(false);
        }
    };

    const importClientFromPaste = async (text) => {
        await loadClientFromText(text);
        setClientPasteOpen(false);
        setClientPasteInitialError("");
    };

    const saveClientExternalId = async (externalId) => {
        const nextPayload = await saveImportedExternalId(getValidExternalId(externalId));
        if (nextPayload) setClientPayload(nextPayload);
        return nextPayload;
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

        const tokenMap = new Map();
        templateTokens.forEach((tokenDef) => {
            tokenMap.set(tokenDef.token, tokenDef);
            tokenMap.set(canonicalizeInputTokenValue(tokenDef.token), tokenDef);
        });
        const promptDefs = [];
        const seenPromptTokens = new Set();
        tokensNeeded.forEach((tokenName) => {
            const tokenDef = tokenMap.get(tokenName) || tokenMap.get(canonicalizeInputTokenValue(tokenName));
            const stored = getTokenValue(tokenDef || tokenName);
            if (stored !== "" && stored !== null && stored !== undefined) return;

            const promptDef = tokenDef || {
                token: canonicalizeInputTokenValue(tokenName) || tokenName,
                label: canonicalizeInputTokenValue(tokenName) || tokenName,
                input_type: "text"
            };
            if (seenPromptTokens.has(promptDef.token)) return;
            seenPromptTokens.add(promptDef.token);
            promptDefs.push(promptDef);
        });
        if (promptDefs.length === 0) return null;

        return {
            mode,
            title: getTemplateDisplayTitle(effectiveModel),
            tokenDefs: promptDefs,
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
        await copyHtml(await resolveTemplateImagesInHtml(html), { message: "Text copied", variant: "success" });
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

        const finalText = await resolveTemplateImagesInHtml(sanitizeGeneratedTemplateHtml(
            effectiveModel,
            generateFinalText(effectiveModel, lang, filled)
        ));
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
        if (!copyPreview?.html) return false;
        setCopyPreview((prev) => prev ? { ...prev, copied: false } : prev);
        await copyPreviewHtml(copyPreview.html, copyPreview.id);
        return true;
    };

    const copyModel = async (model, section, baseModel = null, skipPopup = false) => {
        const sectionKey = section || model?.type || "global";
        const effectiveModel = baseModel ? resolveVariantModel(baseModel, model) : model;
        const text = getTemplateTextByLang(effectiveModel, lang) || "";
        const tokensNeeded = Array.from(new Set(text.match(/\{[^{}]+\}/g) || []));

        if (tokensNeeded.length === 0) {
            const finalText = await resolveTemplateImagesInHtml(sanitizeGeneratedTemplateHtml(
                effectiveModel,
                generateFinalText(effectiveModel, lang, {})
            ));
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
        const finalText = await resolveTemplateImagesInHtml(sanitizeGeneratedTemplateHtml(
            effectiveModel,
            generateFinalText(effectiveModel, lang, map)
        ));
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
            return false;
        } else {
            return requestTemplateResult(model, sectionKey);
        }
    };

    const clearOnDemandValues = (tokenDefs) => {
        setValues((prev) => {
            const next = { ...prev };
            tokenDefs.forEach(({ token }) => {
                delete next[token];
            });
            return next;
        });
        removeTokenInputValues(tokenDefs.map(({ token }) => token));
    };

    const persistTokenPromptValues = async (tokenDefs, filledValues) => {
        const persistedValues = {};
        for (const tokenDef of tokenDefs) {
            const value = filledValues[tokenDef.token] ?? getTokenValue(tokenDef);
            if (isAgentProfileToken(tokenDef.token)) {
                const result = await saveAgentProfileTokenValue(tokenDef.token, value);
                persistedValues[result.token] = result.value;
                continue;
            }

            const { inputTokens } = await saveClientInputValue(tokenDef, value);
            inputTokens.forEach((token) => {
                persistedValues[token] = value;
            });
        }

        if (Object.keys(persistedValues).length > 0) {
            setValues((prev) => ({ ...prev, ...persistedValues }));
        }
        inputChangeVersion.current++;
    };

    const confirmTokenPrompt = async () => {
        if (!tokenPrompt) return false;
        const requiredTokens = tokenPrompt.tokenDefs.map((tokenDef) => tokenDef.token);
        const { values: filled, missing } = collectInputValues(requiredTokens);
        if (missing.length > 0) {
            setPromptMissingTokens(missing);
            showToast("Missing data for: " + missing.join(", "), "error");
            return false;
        }
        const { effectiveModel, sectionKey, tokenDefs } = tokenPrompt;
        await persistTokenPromptValues(tokenDefs, filled);
        setTokenPrompt(null);
        setPromptMissingTokens([]);
        if (tokenPrompt.mode === "fill") return true;
        if (tokenPrompt.mode === "result") {
            return openTemplateResult(effectiveModel, sectionKey);
        }
        await copyModel(effectiveModel, sectionKey, null, true);
        return true;
    };

    return {
        lang,
        setLang,
        tokens: templateTokens,
        values,
        setValues,
        clientInfoSections,
        clientSummaryFields,
        clientExternalId,
        clientPayload,
        clientImportStatus,
        clientImportLoading,
        clientImportErrorModal,
        setClientImportErrorModal,
        clientDetailsExpanded,
        setClientDetailsExpanded,
        clientBarFieldGroups,
        clientBarFieldKeys,
        clientBarDefaultFieldKeys,
        clientBarCustomizeOpen,
        setClientBarCustomizeOpen,
        saveClientBarSelection,
        resetClientBarSelection,
        externalIdConflictPrompt,
        keepExternalIdSourceValues,
        keepExternalIdValues,
        applyExternalIdConflictSelections,
        cancelExternalIdConflictCorrection,
        readClientClipboard,
        readSuperOfficeClipboard,
        clearClientInfo,
        clientPasteOpen,
        setClientPasteOpen,
        clientPasteInitialError,
        setClientPasteInitialError,
        importClientFromPaste,
        saveClientExternalId,
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
