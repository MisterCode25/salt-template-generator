import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AlertTriangle,
    ArrowRight,
    Check,
    CheckCircle2,
    ClipboardList,
    Copy,
    Database,
    Edit3,
    ExternalLink,
    History,
    Loader2,
    Puzzle,
    RefreshCw,
    RotateCcw,
    Sparkles,
    Star
} from "lucide-react";
import {
    generateFinalText,
    generateFinalTextWithTokenResolver,
    getTemplateTextByLang
} from "../core/tokenEngine.js";
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
import { clearSuperOfficeMediaCache } from "../services/superOfficeMediaCache.js";
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
    EXTERNAL_GENERATED_FIELD_ORDER,
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
import { CAPTURE_DATA_TYPE, classifyCaptureClipboardText } from "../utils/captureDataDetection.js";
import { parseSuperOfficeInfoPayload } from "../utils/superOfficeImport.js";
import {
    BROWSER_EXTENSION_MESSAGE
} from "../../shared/browserExtensionProtocol.js";
import {
    CURRENT_BROWSER_EXTENSION_VERSION,
    createBrowserExtensionRequestId,
    isBrowserExtensionVersionAtLeast,
    requestBrowserExtensionStatus,
    startBrowserExtensionCapture,
    subscribeToBrowserExtensionEvents
} from "../services/browserExtensionCaptureService.js";
import {
    BROWSER_EXTENSION_CAPTURE_ACTION,
    createBrowserExtensionCaptureState,
    reduceBrowserExtensionCaptureState
} from "../utils/browserExtensionCaptureState.js";
import { shouldShowLegacyCaptureButton } from "../config/appFeatureFlags.js";
import { getRouterElectricalImpact } from "../utils/routerElectricalImpact.js";
import {
    formatDateInputValueForToken,
    formatDateTokenValueForInput,
    getTokenPromptInputType
} from "../utils/tokenPromptInput.js";
import {
    clearSuperOfficeTicketPayload,
    consumePendingSuperOfficeTicketPayload,
    getSuperOfficeClientSignature,
    isSameSuperOfficeClient,
    loadPendingSuperOfficeTicketPayload,
    loadPreviousSuperOfficeTicketPayload,
    loadSuperOfficeTicketPayload,
    rebindSuperOfficeTicketsToActiveClient,
    saveSuperOfficeTicketPayload
} from "../services/superOfficeTicketService.js";
import {
    buildChatGptTemplatePrompt,
    extractChatGptTemplateHtml
} from "../utils/chatGptPrompt.js";
import {
    CHATGPT_PROMPT_SETTINGS_UPDATED_EVENT,
    loadChatGptPromptSettings
} from "../services/chatGptPromptSettingsService.js";
import Modal from "./Modal.jsx";

const CLIENT_CLIPBOARD_READ_TIMEOUT_MS = 3500;
const CAPTURE_DATA_POLL_INTERVAL_MS = 1400;
const CAPTURE_DATA_COMPLETE_CLOSE_DELAY_MS = 1300;
const CAPTURE_DATA_STEP_ADVANCE_DELAY_MS = 900;
const CLIENT_BAR_FIELDS_KEY = "client_bar_fields";
const CLIENT_BAR_FIELD_LIMIT = 8;
const RichTextEditor = lazy(() => import("./RichTextEditor.jsx"));

function createCaptureDataState(options = {}) {
    const hasVtiData = Boolean(options.hasVtiData);
    const hasSuperOfficeData = Boolean(options.hasSuperOfficeData);
    const complete = hasVtiData && hasSuperOfficeData;

    return {
        phase: complete ? "complete" : hasSuperOfficeData && !hasVtiData ? "vti" : "so",
        soStatus: hasSuperOfficeData ? "done" : "active",
        contractorStatus: "idle",
        vtiStatus: hasVtiData ? "done" : hasSuperOfficeData ? "active" : "waiting",
        contractorNumber: "",
        lastDetectedType: "",
        message: complete
            ? "Capture complete."
            : hasSuperOfficeData
                ? "Waiting for VTI data."
                : "Waiting for SuperOffice data.",
        detail: complete
            ? "Everything needed is already loaded."
            : hasSuperOfficeData
                ? "Open the customer in VTI, click the VTI Capture bookmark, then copy the result."
                : "Open the BO/SuperOffice ticket, click the BO Capture bookmark, then copy the result.",
        error: "",
        isReading: false,
        isPaused: false,
        completedAt: null
    };
}

function isCaptureDataComplete(state) {
    return state?.soStatus === "done" && state?.vtiStatus === "done";
}

function getCaptureDataVisualState(state, hasConflict = false) {
    if (hasConflict) {
        return {
            mode: "conflict",
            Icon: AlertTriangle,
            title: "Import conflict",
            detail: "Some ticket fields do not match the customer. Choose the correct values below."
        };
    }
    if (isCaptureDataComplete(state)) {
        return {
            mode: "done",
            Icon: CheckCircle2,
            title: "Capture complete",
            detail: "SuperOffice and VTI data are ready."
        };
    }
    if (state.phase === "contractor" || state.phase === "so-done") {
        return {
            mode: "done",
            Icon: CheckCircle2,
            title: state.contractorStatus === "done" ? "Contractor copied" : "SO data captured",
            detail: state.contractorStatus === "done"
                ? `${state.contractorNumber} copied. Search this contractor in VTI, then click the VTI Capture bookmark.`
                : "Ticket data imported. Now open the customer in VTI and click the VTI Capture bookmark."
        };
    }
    if (state.phase === "vti" || state.vtiStatus === "active") {
        return {
            mode: "scanning",
            Icon: Loader2,
            waitingTarget: "VTI",
            title: "Waiting for VTI data",
            detail: "Click the Import data VTI bookmarklet."
        };
    }
    return {
        mode: "scanning",
        Icon: Loader2,
        waitingTarget: "SO",
        title: "Waiting for SuperOffice data",
        detail: "Click the Import data SO bookmarklet."
    };
}

function sanitizeGeneratedTemplateHtml(model, html = "") {
    return model?.type === "sms" ? stripImagesFromHtml(html) : html;
}

function clientBarFieldKey(scope, label) {
    return `${scope}:${String(label || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

function getRouterImpactForClientField(field = {}) {
    const label = String(field.label || "").trim().toLowerCase();
    if (label !== "router serial" && label !== "n° série routeur") return null;
    return field.routerElectricalImpact || getRouterElectricalImpact(field.value);
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

    const fieldOrder = parsed.fields.flagging ? EXTERNAL_FIELD_ORDER : EXTERNAL_GENERATED_FIELD_ORDER;
    return fieldOrder.map((field) => ({
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
    const type = getTokenPromptInputType(tokenDef);
    const inputValue = type === "date" ? formatDateTokenValueForInput(value) : value;

    return (
        <div className={`token-prompt-field${hasError ? " token-prompt-field--error" : ""}`}>
            <label htmlFor={`tp-${tokenDef.token}`}>{tokenDef.label || tokenDef.token}</label>
            <input
                id={`tp-${tokenDef.token}`}
                type={type}
                autoFocus={autoFocus}
                value={inputValue}
                className={hasError ? "input-error" : ""}
                placeholder={tokenDef.token}
                onChange={(event) => onChange(
                    tokenDef.token,
                    type === "date"
                        ? formatDateInputValueForToken(event.target.value)
                        : event.target.value
                )}
            />
            {hasError && <span className="token-prompt-field-error">This field is required</span>}
        </div>
    );
});

const TemplateResultEditorFallback = memo(function TemplateResultEditorFallback() {
    return (
        <div className="template-result-editor-fallback">
            Loading editor...
        </div>
    );
});

function normalizeSmsRecipientNumber(value = "") {
    const text = String(value || "").trim();
    if (!text) return "";

    let digits = text.replace(/\D+/g, "");
    if (digits.startsWith("0041") && digits.length > 4) {
        digits = `0${digits.slice(4)}`;
    } else if (digits.startsWith("41") && digits.length > 2) {
        digits = `0${digits.slice(2)}`;
    }
    return digits;
}

function findClientInfoValue(sections = [], preferredLabels = []) {
    const normalizedLabels = preferredLabels.map((label) => String(label).toLowerCase());
    const fields = sections.flatMap((section) => Array.isArray(section?.fields) ? section.fields : []);

    for (const label of normalizedLabels) {
        const exact = fields.find((field) => String(field?.label || "").toLowerCase() === label && field?.value && field.value !== "-");
        if (exact) return String(exact.value).trim();
    }

    for (const label of normalizedLabels) {
        const partial = fields.find((field) => String(field?.label || "").toLowerCase().includes(label) && field?.value && field.value !== "-");
        if (partial) return String(partial.value).trim();
    }

    return "";
}

function buildTemplateRecipientInfo(type, clientInfoSections = []) {
    if (type === "email") {
        const value = findClientInfoValue(clientInfoSections, ["Email", "Mail"]);
        return value ? { label: "Email client", value } : null;
    }

    if (type === "sms") {
        const value = normalizeSmsRecipientNumber(findClientInfoValue(clientInfoSections, ["Mobile raw", "Mobile", "Phone", "Telephone"]));
        return value ? { label: "SMS client", value } : null;
    }

    return null;
}

async function copyRawTextToClipboard(text, { message = "Prompt copied.", variant = "success" } = {}) {
    const value = String(text || "");
    if (!value) return false;

    try {
        await navigator.clipboard.writeText(value);
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

    showToast(message, variant);
    return true;
}

function openCenteredChatGptWindow() {
    const availableLeft = window.screen?.availLeft ?? 0;
    const availableTop = window.screen?.availTop ?? 0;
    const availableWidth = window.screen?.availWidth || window.outerWidth || 1440;
    const availableHeight = window.screen?.availHeight || window.outerHeight || 900;
    const width = Math.min(1120, Math.max(960, Math.round(availableWidth * 0.74)));
    const height = Math.min(840, Math.max(720, Math.round(availableHeight * 0.82)));
    const left = Math.max(availableLeft, Math.round(availableLeft + (availableWidth - width) / 2));
    const top = Math.max(availableTop, Math.round(availableTop + (availableHeight - height) / 2));
    const features = [
        "popup=yes",
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        "toolbar=no",
        "menubar=no",
        "location=no",
        "status=no",
        "resizable=yes",
        "scrollbars=yes"
    ].join(",");
    const chatGptWindow = window.open("https://chatgpt.com/", `templateGeneratorChatGPT-${Date.now()}`, features);
    if (chatGptWindow) {
        try {
            chatGptWindow.opener = null;
        } catch {
            // Some browsers block opener changes for external windows.
        }
        chatGptWindow.focus();
    }
    return chatGptWindow;
}

function ChatGptPromptModal({
    title,
    html,
    allowImages,
    onApplyResult,
    onClose
}) {
    const [step, setStep] = useState("instructions");
    const [instruction, setInstruction] = useState("");
    const [templateInstruction, setTemplateInstruction] = useState("");
    const [pasteError, setPasteError] = useState("");
    const [clipboardStatus, setClipboardStatus] = useState("idle");
    const requestId = useMemo(() => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }, []);
    const prompt = useMemo(() => buildChatGptTemplatePrompt({
        title,
        html,
        instruction: instruction.trim(),
        templateInstruction,
        requestId
    }), [html, instruction, requestId, templateInstruction, title]);

    useEffect(() => {
        let cancelled = false;

        const syncSettings = async (event = null) => {
            const settings = event?.detail?.settings || await loadChatGptPromptSettings();
            if (!cancelled) setTemplateInstruction(settings.templateInstruction || "");
        };

        syncSettings();
        window.addEventListener(CHATGPT_PROMPT_SETTINGS_UPDATED_EVENT, syncSettings);

        return () => {
            cancelled = true;
            window.removeEventListener(CHATGPT_PROMPT_SETTINGS_UPDATED_EVENT, syncSettings);
        };
    }, []);

    const goToCopyStep = () => {
        if (!instruction.trim()) {
            setPasteError("Write the instruction first.");
            return;
        }
        setPasteError("");
        setStep("copy");
    };

    const copyPromptAndOpen = async () => {
        if (!instruction.trim()) {
            setStep("instructions");
            setPasteError("Write the instruction first.");
            return;
        }
        const copied = await copyRawTextToClipboard(prompt, {
            message: "ChatGPT prompt copied.",
            variant: "success"
        });
        if (!copied) return;
        const chatGptWindow = openCenteredChatGptWindow();
        if (!chatGptWindow) {
            showToast("ChatGPT window was blocked by the browser.", "error");
            return;
        }
        setPasteError("");
        setClipboardStatus("waiting");
        setStep("waiting");
    };

    const applyResultText = useCallback((value, { requireRequestId = true } = {}) => {
        const extractedHtml = extractChatGptTemplateHtml(value, {
            requestId,
            requireRequestId
        });
        if (!extractedHtml) {
            setClipboardStatus("invalid");
            setPasteError("Clipboard does not contain the expected ChatGPT result yet.");
            return false;
        }
        onApplyResult(allowImages ? extractedHtml : stripImagesFromHtml(extractedHtml));
        showToast("ChatGPT result added as draft.", "success");
        onClose();
        return true;
    }, [allowImages, onApplyResult, onClose, requestId]);

    const readChatGptClipboard = useCallback(async ({ automatic = false } = {}) => {
        if (!navigator.clipboard?.readText) {
            setClipboardStatus("blocked");
            setPasteError("Clipboard reading is not available in this browser.");
            return false;
        }

        setClipboardStatus("checking");

        try {
            const clipboardText = await withClipboardTimeout(() => navigator.clipboard.readText());
            if (!clipboardText || clipboardText === prompt) {
                setClipboardStatus("waiting");
                if (!automatic) setPasteError("Copy ChatGPT's answer first, then try again.");
                return false;
            }

            const applied = applyResultText(clipboardText, { requireRequestId: true });
            if (!applied && automatic) {
                setPasteError("");
                setClipboardStatus("waiting");
            }
            return applied;
        } catch {
            setClipboardStatus("blocked");
            setPasteError(automatic
                ? "Automatic clipboard reading was blocked. Use the button below when you are back from ChatGPT."
                : "Clipboard access was blocked. Click the button again after allowing clipboard access."
            );
            return false;
        }
    }, [applyResultText, prompt]);

    useEffect(() => {
        if (step !== "waiting") return undefined;

        const handleReturn = () => {
            if (document.visibilityState === "hidden") return;
            readChatGptClipboard({ automatic: true });
        };

        const timeoutId = window.setTimeout(handleReturn, 600);
        window.addEventListener("focus", handleReturn);
        window.addEventListener("pageshow", handleReturn);
        document.addEventListener("visibilitychange", handleReturn);

        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener("focus", handleReturn);
            window.removeEventListener("pageshow", handleReturn);
            document.removeEventListener("visibilitychange", handleReturn);
        };
    }, [readChatGptClipboard, step]);

    return (
        <Modal onClose={onClose} dialogClassName="popup-box template-chatgpt-modal" ariaLabel="ChatGPT prompt">
            <div className="popup-header">
                <div>
                    <p className="template-result-kicker">ChatGPT</p>
                    <h2>Edit with ChatGPT</h2>
                </div>
            </div>
            <div className="template-chatgpt-progress" aria-label="ChatGPT edit progress">
                <span className={step === "instructions" ? "is-active" : ""}>1 Instructions</span>
                <span className={step === "copy" ? "is-active" : ""}>2 Copy</span>
                <span className={step === "waiting" ? "is-active" : ""}>3 Waiting</span>
            </div>
            {step === "instructions" && (
                <div className="template-chatgpt-step">
                    <div className="template-chatgpt-step-header">
                        <span className="template-chatgpt-step-number">1</span>
                        <div>
                            <h3>Instructions</h3>
                            <p>Write exactly what ChatGPT should change in this temporary draft.</p>
                        </div>
                    </div>
                    <label className="template-chatgpt-field">
                        <span>Instruction</span>
                        <textarea
                            value={instruction}
                            onChange={(event) => {
                                setInstruction(event.target.value);
                                setPasteError("");
                            }}
                            placeholder="Write the exact instruction for ChatGPT."
                            rows={5}
                        />
                    </label>
                    <div className="template-chatgpt-note">
                        Nothing is sent automatically from the app. The next step only copies the prepared prompt.
                    </div>
                    {pasteError && <div className="template-chatgpt-error">{pasteError}</div>}
                    <div className="popup-actions template-chatgpt-actions">
                        <button type="button" className="template-result-action-btn template-result-ai-btn" onClick={goToCopyStep}>
                            Next
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            )}
            {step === "copy" && (
                <div className="template-chatgpt-step">
                    <div className="template-chatgpt-step-header">
                        <span className="template-chatgpt-step-number">2</span>
                        <div>
                            <h3>Copy prompt</h3>
                            <p>One click copies the hidden prompt and opens ChatGPT in a centered window.</p>
                        </div>
                    </div>
                    <div className="template-chatgpt-note">
                        If ChatGPT opens empty, paste with Cmd+V. Then copy ChatGPT's answer and come back here.
                    </div>
                    <div className="popup-actions template-chatgpt-actions">
                        <button type="button" className="secondary-btn" onClick={() => setStep("instructions")}>
                            Back
                        </button>
                        <button type="button" className="template-result-action-btn template-result-ai-btn" onClick={copyPromptAndOpen}>
                            <ExternalLink size={14} aria-hidden="true" />
                            Copy prompt and open ChatGPT
                        </button>
                    </div>
                </div>
            )}
            {step === "waiting" && (
                <div className="template-chatgpt-step">
                    <div className="template-chatgpt-step-header">
                        <span className="template-chatgpt-step-number">3</span>
                        <div>
                            <h3>Waiting for result</h3>
                            <p>Copy ChatGPT's answer, then return here. The app will try to apply it automatically.</p>
                        </div>
                    </div>
                    <div className={`template-chatgpt-waiting is-${clipboardStatus}`}>
                        <span className="template-chatgpt-spinner" aria-hidden="true" />
                        <div>
                            <strong>
                                {clipboardStatus === "checking"
                                    ? "Checking clipboard..."
                                    : clipboardStatus === "blocked"
                                        ? "Waiting for permission"
                                        : clipboardStatus === "invalid"
                                            ? "Result not detected"
                                            : "Waiting for ChatGPT"}
                            </strong>
                            <p>
                                {clipboardStatus === "blocked"
                                    ? "Browser security can block automatic clipboard reading. Use the button below after copying the answer."
                                    : clipboardStatus === "invalid"
                                        ? "The copied text is not the expected ChatGPT answer for this request."
                                        : "Leave this popup open, copy the full ChatGPT answer, and come back to this app."}
                            </p>
                        </div>
                    </div>
                    {pasteError && <div className="template-chatgpt-error">{pasteError}</div>}
                    <div className="popup-actions template-chatgpt-actions">
                        <button type="button" className="secondary-btn" onClick={() => setStep("copy")}>
                            Back
                        </button>
                        <button type="button" className="template-result-action-btn template-result-edit-btn" onClick={() => readChatGptClipboard()}>
                            <Check size={14} aria-hidden="true" />
                            Read clipboard
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

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
    tokens = [],
    channelOptions = [],
    currentChannel = "",
    isFavorite = false,
    onSelectChannel,
    onNextChannel,
    onCopy,
    onToggleFavorite,
    onClose
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftHtml, setDraftHtml] = useState(result?.html || "");
    const [chatGptPromptOpen, setChatGptPromptOpen] = useState(false);

    useEffect(() => {
        setDraftHtml(result?.html || "");
        setIsEditing(false);
        setChatGptPromptOpen(false);
    }, [result?.id]);

    if (!result) return null;
    const showChannelControls = channelOptions.length > 1 && onSelectChannel;
    const sourceHtml = result.html || "";
    const previewHtml = draftHtml || "";
    const isDirty = draftHtml !== sourceHtml;
    const allowImages = result.type !== "sms";
    const copyStateText = isEditing
        ? isDirty ? "Local draft" : "Editing"
        : result.copied ? "✓ Already copied" : "Copying...";
    const canToggleFavorite = typeof onToggleFavorite === "function";
    const recipientInfo = result.recipientInfo;

    const resetDraft = () => {
        setDraftHtml(sourceHtml);
        setIsEditing(false);
    };

    const copyDraft = () => {
        onCopy?.(allowImages ? draftHtml : stripImagesFromHtml(draftHtml));
    };

    const copyRecipient = async () => {
        if (!recipientInfo?.value) return;
        await copyText(recipientInfo.value, {
            message: `${recipientInfo.label} copied`,
            variant: "success"
        });
    };

    return (
        <>
            <Modal
                onClose={onClose}
                dialogClassName={`popup-box template-result-modal${isEditing ? " is-editing" : ""}`}
                ariaLabel="Generated template"
            >
                <div className="popup-header template-result-header">
                    <div>
                        <p className="template-result-kicker">{isEditing ? "Edit final text" : "Final text"}</p>
                        <h2>{result.title || "Template"}</h2>
                    </div>
                    <div className="template-result-header-actions">
                        {canToggleFavorite && (
                            <button
                                type="button"
                                className={`template-result-favorite-btn${isFavorite ? " is-active" : ""}`}
                                onClick={onToggleFavorite}
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                aria-pressed={Boolean(isFavorite)}
                                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Star size={16} aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                        )}
                        <span className={`template-result-copy-state${result.copied && !isDirty && !isEditing ? " is-copied" : ""}`} aria-live="polite">
                            {copyStateText}
                        </span>
                    </div>
                </div>
                {recipientInfo && (
                    <div className="template-result-recipient" aria-label={recipientInfo.label}>
                        <span className="template-result-recipient-label">{recipientInfo.label}</span>
                        <span className="template-result-recipient-value">{recipientInfo.value}</span>
                        <button
                            type="button"
                            className="template-result-recipient-copy"
                            onClick={copyRecipient}
                            aria-label={`Copy ${recipientInfo.label}`}
                            title={`Copy ${recipientInfo.value}`}
                        >
                            <Copy size={13} aria-hidden="true" />
                            Copy
                        </button>
                    </div>
                )}
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
                {isEditing ? (
                    <Suspense fallback={<TemplateResultEditorFallback />}>
                        <RichTextEditor
                            className="template-result-editor"
                            value={draftHtml}
                            onChange={setDraftHtml}
                            placeholder="Final text"
                            tokens={tokens}
                            allowImages={allowImages}
                        />
                    </Suspense>
                ) : (
                    <div
                        className="rich-preview template-result-preview"
                        data-placeholder="No content."
                        dangerouslySetInnerHTML={{ __html: formatTokenPreviewHTML(formatClipboardHtmlBody(previewHtml)) }}
                    />
                )}
                <div className="popup-actions template-result-actions">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                className="template-result-action-btn template-result-ai-btn"
                                onClick={() => setChatGptPromptOpen(true)}
                            >
                                <Sparkles size={14} aria-hidden="true" />
                                ChatGPT
                            </button>
                            {isDirty && (
                                <button
                                    type="button"
                                    className="template-result-action-btn template-result-reset-btn"
                                    onClick={resetDraft}
                                >
                                    <RotateCcw size={14} aria-hidden="true" />
                                    Reset
                                </button>
                            )}
                            <button
                                type="button"
                                className="template-result-action-btn template-result-edit-btn"
                                onClick={() => setIsEditing(false)}
                            >
                                <Check size={14} aria-hidden="true" />
                                Done
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="template-result-action-btn template-result-edit-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit3 size={14} aria-hidden="true" />
                            Modify
                        </button>
                    )}
                    {(!isEditing || isDirty) && (
                        <button type="button" className="template-result-action-btn template-result-copy-btn" onClick={copyDraft}>
                            <Copy size={14} aria-hidden="true" />
                            {isDirty ? "Copy draft" : "Copy again"}
                        </button>
                    )}
                    {!isEditing && showChannelControls && (
                        <button
                            type="button"
                            className="template-result-action-btn template-result-next-btn"
                            onClick={onNextChannel}
                        >
                            Next
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    )}
                </div>
            </Modal>
            {chatGptPromptOpen && (
                <ChatGptPromptModal
                    title={result.title || "Template"}
                    html={draftHtml}
                    allowImages={allowImages}
                    onApplyResult={(nextHtml) => {
                        setDraftHtml(nextHtml);
                        setIsEditing(true);
                    }}
                    onClose={() => setChatGptPromptOpen(false)}
                />
            )}
        </>
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
    onOpenCaptureData,
    onOpenBrowserExtensionCapture,
    onRefreshVti,
    onReplaceSuperOffice,
    onRestorePreviousSuperOffice,
    previousSuperOfficeTicketId = "",
    onOpenPaste,
    onClearClient,
    onCustomizeBar,
    onExternalIdFieldClick,
    onToggleDetails
}) {
    const updateMenuRef = useRef(null);
    const hasInfo = sections.length > 0;
    const isError = status.type === "error";
    const hasAnyImportedData = hasVtiData || hasSuperOfficeData;
    const missingCaptureLabel = !hasVtiData && !hasSuperOfficeData
        ? "SO + VTI"
        : !hasSuperOfficeData
            ? "SO missing"
            : !hasVtiData
                ? "VTI missing"
                : "Ready";
    const externalIdSegments = useMemo(() => buildExternalIdSegments(externalId), [externalId]);
    const copyExternalId = async () => {
        try {
            await navigator.clipboard.writeText(externalId);
            showToast("External ID copied", "success");
        } catch {
            showToast("Unable to copy External ID", "error");
        }
    };
    const runUpdateAction = (action) => {
        updateMenuRef.current?.removeAttribute("open");
        action?.();
    };

    return (
        <section className="client-info-panel" aria-label="Client information">
            <div className="client-import-status-row" aria-label="Data imports">
                {shouldShowLegacyCaptureButton() && (
                    <button
                        type="button"
                        className={`client-import-status-btn client-import-status-btn--capture${hasVtiData && hasSuperOfficeData ? " is-loaded" : " is-missing"}`}
                        onClick={onOpenCaptureData}
                        disabled={loading}
                        title="Capture SO/BO and VTI data. Alt+Q"
                    >
                        <ClipboardList size={14} aria-hidden="true" />
                        <span>{loading ? "Capturing..." : "Capture data"}</span>
                        <small>{missingCaptureLabel}</small>
                    </button>
                )}
                <button
                    type="button"
                    className="client-import-status-btn client-import-status-btn--extension"
                    onClick={onOpenBrowserExtensionCapture}
                    disabled={loading}
                    title="Capturer les onglets SuperOffice et VTI avec l’extension"
                >
                    <Puzzle size={14} aria-hidden="true" />
                    <span>Capture data</span>
                    <small>Extension</small>
                </button>
                {hasAnyImportedData && (
                    <details className="client-import-update-menu" ref={updateMenuRef}>
                        <summary className="client-import-update-btn">
                            <RefreshCw size={13} aria-hidden="true" />
                            Mettre à jour
                        </summary>
                        <div className="client-import-update-popover" role="menu">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => runUpdateAction(onRefreshVti)}
                                disabled={loading || !hasVtiData}
                            >
                                <RefreshCw size={14} aria-hidden="true" />
                                <span>
                                    <strong>Actualiser VTI</strong>
                                    <small>Conserver le ticket SO</small>
                                </span>
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => runUpdateAction(onReplaceSuperOffice)}
                                disabled={loading || !hasVtiData}
                            >
                                <ClipboardList size={14} aria-hidden="true" />
                                <span>
                                    <strong>Remplacer le ticket SO</strong>
                                    <small>Conserver les données VTI</small>
                                </span>
                            </button>
                            {previousSuperOfficeTicketId && (
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => runUpdateAction(onRestorePreviousSuperOffice)}
                                    disabled={loading}
                                >
                                    <History size={14} aria-hidden="true" />
                                    <span>
                                        <strong>Revenir au ticket précédent</strong>
                                        <small>Ticket {previousSuperOfficeTicketId}</small>
                                    </span>
                                </button>
                            )}
                        </div>
                    </details>
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
                                        <span className="client-info-bar-field-value-row">
                                            <span className="client-info-bar-field-val">{field.value}</span>
                                            {field.routerElectricalImpact && (
                                                <span
                                                    className={`router-impact-status router-impact-status--${field.routerElectricalImpact.isImpacted ? "impacted" : "safe"}`}
                                                >
                                                    {field.routerElectricalImpact.label}
                                                </span>
                                            )}
                                        </span>
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
                                {section.fields.map((field) => {
                                    const routerElectricalImpact = getRouterImpactForClientField(field);
                                    return (
                                        <div key={`${section.id}-${field.label}`} className="client-info-field">
                                            <span className="client-info-label">{field.label}</span>
                                            <span className="client-info-value-row">
                                                <span className="client-info-value">{field.value}</span>
                                                {routerElectricalImpact && (
                                                    <span
                                                        className={`router-impact-status router-impact-status--${routerElectricalImpact.isImpacted ? "impacted" : "safe"}`}
                                                    >
                                                        {routerElectricalImpact.label}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
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

export function SuperOfficeReplacementModal({ currentTicket, nextTicket, onCancel, onConfirm }) {
    const currentId = currentTicket?.ticketId || currentTicket?.sourceTicketId || "actuel";
    const nextId = nextTicket?.ticketId || nextTicket?.sourceTicketId || "copié";
    const isSameTicket = currentId === nextId;

    return (
        <Modal
            onClose={onCancel}
            dialogClassName="popup-box super-office-replacement-modal"
            ariaLabel="Replace SuperOffice ticket"
        >
            <div className="popup-header">
                <div>
                    <p className="eyebrow">SuperOffice</p>
                    <h2>{isSameTicket ? "Actualiser le ticket SO ?" : "Remplacer le ticket SO ?"}</h2>
                </div>
            </div>
            <div className="super-office-replacement-summary">
                <span>
                    <small>Ticket actuel</small>
                    <strong>{currentId}</strong>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
                <span>
                    <small>Nouveau ticket</small>
                    <strong>{nextId}</strong>
                </span>
            </div>
            <p className="hint">
                Les données VTI et le profil agent seront conservés. Les photos, pièces jointes et données SO
                seront remplacées.
            </p>
            <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={onCancel}>Annuler</button>
                <button type="button" className="primary-btn" onClick={onConfirm}>
                    {isSameTicket ? "Actualiser" : "Remplacer"}
                </button>
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
            <p className="hint">After clicking the VTI Capture bookmark in VTI, paste the copied result here.</p>
            {error && <p className="client-info-status client-info-status--error">{error}</p>}
            <textarea
                autoFocus
                className="client-paste-textarea"
                value={text}
                onChange={(event) => {
                    setText(event.target.value);
                    if (error) setError("");
                }}
                placeholder="Paste the result copied by the VTI Capture bookmark..."
            />
            <div className="popup-actions">
                <button type="button" className="primary-btn" onClick={submit}>Import</button>
            </div>
        </Modal>
    );
}

export function CaptureDataModal({
    state,
    conflictPrompt = null,
    onApplyConflictSelections,
    onCancelConflict,
    onClose,
    onReadNow,
    onOpenPaste
}) {
    const visual = getCaptureDataVisualState(state, Boolean(conflictPrompt));
    const VisualIcon = visual.Icon;
    const timelineSteps = [
        {
            id: "so",
            label: "SO",
            status: state.soStatus
        },
        {
            id: "vti",
            label: "VTI",
            status: state.vtiStatus
        }
    ];
    const isBusy = visual.mode === "scanning" || state.isReading;
    const timelineProgressClass = state.vtiStatus === "done"
        ? "is-complete"
        : state.soStatus === "done"
            ? "is-half"
            : "is-start";
    const statusText = state.error || (visual.waitingTarget ? visual.detail : state.detail);

    return (
        <Modal onClose={onClose} dialogClassName="popup-box capture-data-modal" ariaLabel="Capture data">
            <div className="capture-data-header">
                <div className="capture-data-orb" aria-hidden="true">
                    <Database size={22} />
                </div>
                <div>
                    <h2>Capture data</h2>
                </div>
            </div>

            <div className={`capture-data-focus is-${visual.mode}${isBusy ? " is-busy" : ""}`} aria-live="polite">
                {!visual.waitingTarget && <strong>{visual.title}</strong>}
                <div className="capture-data-focus-ring" aria-hidden="true" />
                <div className="capture-data-focus-icon">
                    {visual.waitingTarget ? (
                        <div className="capture-data-focus-label" aria-hidden="true">
                            <small>Waiting for</small>
                            <b>{visual.waitingTarget}</b>
                        </div>
                    ) : (
                        <VisualIcon size={38} aria-hidden="true" />
                    )}
                </div>
                {!visual.waitingTarget && <span>{visual.detail}</span>}
            </div>

            <div className={`capture-data-timeline ${timelineProgressClass}`} aria-label="Capture progress">
                <div className="capture-data-timeline-line" aria-hidden="true">
                    <span />
                </div>
                {timelineSteps.map((step) => (
                    <div key={step.id} className={`capture-data-timeline-step is-${step.status}`}>
                        <span className="capture-data-timeline-dot" aria-hidden="true" />
                        <strong>{step.label}</strong>
                    </div>
                ))}
            </div>

            <div className={`capture-data-status${state.error ? " is-error" : ""}${state.isPaused ? " is-paused" : ""}`}>
                {state.isReading && <Loader2 size={16} aria-hidden="true" className="capture-data-spinner" />}
                <span>{statusText}</span>
            </div>

            {conflictPrompt && (
                <div className="capture-data-conflict-panel">
                    <ExternalIdConflictContent
                        conflicts={conflictPrompt.conflicts}
                        onApplySelections={onApplyConflictSelections}
                        onCancel={onCancelConflict}
                    />
                </div>
            )}

            <div className="popup-actions capture-data-actions">
                <button type="button" className="secondary-btn" onClick={onOpenPaste}>
                    Paste manually
                </button>
                <button type="button" className="primary-btn" onClick={onReadNow} disabled={state.isReading || state.isPaused || Boolean(conflictPrompt)}>
                    Read clipboard now
                </button>
            </div>
        </Modal>
    );
}

function ExternalIdConflictContent({ conflicts = [], onApplySelections, onCancel }) {
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
        <>
            <div className="popup-header">
                <div>
                    <h2>Ticket/customer mismatch</h2>
                    <p className="hint">The ticket and customer do not fully match. Pick the value that is correct for this case.</p>
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
                <button type="button" className="secondary-btn" onClick={onCancel}>Cancel ticket data</button>
                <button type="button" className="primary-btn" onClick={() => onApplySelections(selectionByField)}>Keep selected values</button>
            </div>
        </>
    );
}

export function ExternalIdConflictModal({ conflicts = [], onApplySelections, onCancel }) {
    return (
        <Modal onClose={onCancel} dialogClassName="popup-box external-id-conflict-modal" ariaLabel="Import data conflict">
            <ExternalIdConflictContent
                conflicts={conflicts}
                onApplySelections={onApplySelections}
                onCancel={onCancel}
            />
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
    const [superOfficeReplacementPrompt, setSuperOfficeReplacementPrompt] = useState(null);
    const [captureDataOpen, setCaptureDataOpen] = useState(false);
    const [captureDataState, setCaptureDataState] = useState(() => createCaptureDataState());
    const [browserExtensionCaptureOpen, setBrowserExtensionCaptureOpen] = useState(false);
    const [browserExtensionCaptureState, setBrowserExtensionCaptureState] = useState(
        () => createBrowserExtensionCaptureState()
    );
    const captureCompletedTypes = useRef(new Set());
    const captureLastClipboardText = useRef("");
    const captureImportCallback = useRef(null);
    const captureCompleteCloseTimer = useRef(null);
    const captureStepAdvanceTimer = useRef(null);
    const captureReadInFlight = useRef(false);
    const captureConflictType = useRef(null);
    const browserExtensionImportInFlight = useRef(false);
    const browserExtensionImportCallback = useRef(null);
    const browserExtensionEventHandler = useRef(null);
    const dispatchBrowserExtensionCapture = useCallback((event) => {
        setBrowserExtensionCaptureState((current) => reduceBrowserExtensionCaptureState(current, event));
    }, []);

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
                const storedClientLanguage = getClientLanguageCode(storedClient);
                if (storedClientLanguage) setLang(storedClientLanguage);
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

    const finishBrowserExtensionImport = async () => {
        const callback = browserExtensionImportCallback.current;
        browserExtensionImportCallback.current = null;
        try {
            if (callback) await callback();
        } catch (error) {
            console.error("browser extension import callback error", error);
        }
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
        setSuperOfficeReplacementPrompt(null);
        await resolveCaptureConflict();
        await finishBrowserExtensionImport();
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
        await resolveCaptureConflict();
        await finishBrowserExtensionImport();
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
        await resolveCaptureConflict();
        await finishBrowserExtensionImport();
    };


    const cancelExternalIdConflictCorrection = () => {
        const wasCaptureConflict = Boolean(captureConflictType.current);
        setExternalIdConflictPrompt(null);
        captureConflictType.current = null;
        browserExtensionImportCallback.current = null;
        if (wasCaptureConflict) {
            captureCompletedTypes.current.delete(CAPTURE_DATA_TYPE.SUPER_OFFICE);
            setCaptureDataState((current) => ({
                ...current,
                phase: "so",
                soStatus: "active",
                isPaused: false,
                detail: "SuperOffice import canceled. Open the BO/SuperOffice ticket and click BO Capture again.",
                error: ""
            }));
        }
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
        clearSuperOfficeMediaCache();
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
        closeCaptureDataFlow();
        setClientImportStatus({ type: "idle", message: "" });
        lastSectionClickVersion.current = {};
        inputChangeVersion.current++;
    };

    const loadClientFromText = async (text) => {
        const payload = parseClientClipboardJSON(text);
        const currentClientPayload = await loadActiveClientPayload();
        const currentClientSignature = getSuperOfficeClientSignature(currentClientPayload);
        const nextClientSignature = getSuperOfficeClientSignature(payload);
        const isSameClient = isSameSuperOfficeClient(currentClientPayload, payload);
        if (currentClientSignature && currentClientSignature !== nextClientSignature && !isSameClient) {
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
        if (isSameClient && currentClientSignature !== nextClientSignature) {
            await rebindSuperOfficeTicketsToActiveClient();
        }
        const pendingSuperOfficeTicket = await loadPendingSuperOfficeTicketPayload();
        const storedSuperOfficeTicket = currentClientSignature === nextClientSignature
            ? await loadSuperOfficeTicketPayload()
            : null;
        const candidateSuperOfficeTicket = pendingSuperOfficeTicket || storedSuperOfficeTicket;
        let activeSuperOfficeTicket = candidateSuperOfficeTicket;
        let superOfficeTokenValues = candidateSuperOfficeTicket?.tokenValues || {};
        let savedSuperOfficeValues = null;
        let pendingSuperOfficeConflict = false;
        if (candidateSuperOfficeTicket && Object.keys(superOfficeTokenValues).length > 0) {
            const conflictPrompt = buildExternalIdConflictPrompt(candidateSuperOfficeTicket, payload);
            if (conflictPrompt) {
                setExternalIdConflictPrompt(conflictPrompt);
                showToast("Import data conflict detected.", "warning");
                superOfficeTokenValues = {};
                activeSuperOfficeTicket = null;
                pendingSuperOfficeConflict = true;
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
        return { pendingSuperOfficeConflict };
    };

    const importBrowserExtensionCapture = async (message) => {
        if (browserExtensionImportInFlight.current) return;
        browserExtensionImportInFlight.current = true;

        try {
            const vtiText = JSON.stringify(message.payload?.vti ?? null);
            parseClientClipboardJSON(vtiText);
            const superOfficeResult = parseSuperOfficeInfoPayload(message.payload?.superOffice);
            if (!superOfficeResult.ok) {
                throw new Error("L’extension n’a pas retourné de données SuperOffice valides.");
            }

            dispatchBrowserExtensionCapture({
                type: BROWSER_EXTENSION_CAPTURE_ACTION.IMPORTING,
                requestId: message.requestId
            });

            clearSuperOfficeMediaCache();
            await clearSuperOfficeTicketPayload();
            await loadClientFromText(vtiText);

            if (openExternalIdConflictPrompt(superOfficeResult, await loadActiveClientPayload())) {
                setBrowserExtensionCaptureOpen(false);
                return;
            }

            await completeSuperOfficeImport(superOfficeResult);
            dispatchBrowserExtensionCapture({
                type: BROWSER_EXTENSION_CAPTURE_ACTION.SUCCEEDED,
                requestId: message.requestId
            });
            await finishBrowserExtensionImport();
        } catch (error) {
            dispatchBrowserExtensionCapture({
                type: BROWSER_EXTENSION_CAPTURE_ACTION.LOCAL_FAILURE,
                requestId: message.requestId,
                installed: true,
                error: error?.message || "Les données capturées n’ont pas pu être importées."
            });
        } finally {
            browserExtensionImportInFlight.current = false;
        }
    };

    browserExtensionEventHandler.current = (message) => {
        dispatchBrowserExtensionCapture(message);
        if (message.type === BROWSER_EXTENSION_MESSAGE.COMPLETED) {
            importBrowserExtensionCapture(message);
        }
    };

    useEffect(() => subscribeToBrowserExtensionEvents((message) => {
        browserExtensionEventHandler.current?.(message);
    }), []);

    const openBrowserExtensionCaptureFlow = (options = {}) => {
        browserExtensionImportCallback.current = typeof options.onImported === "function"
            ? options.onImported
            : null;
        setBrowserExtensionCaptureOpen(true);
        dispatchBrowserExtensionCapture({ type: BROWSER_EXTENSION_CAPTURE_ACTION.RESET });
    };

    const startBrowserExtensionCaptureFlow = async (ticketNumber, options = {}) => {
        if (browserExtensionCaptureState.isRunning || browserExtensionCaptureState.isChecking) {
            return false;
        }

        dispatchBrowserExtensionCapture({ type: BROWSER_EXTENSION_CAPTURE_ACTION.CHECKING });

        const status = await requestBrowserExtensionStatus();
        if (!status || status.type === BROWSER_EXTENSION_MESSAGE.FAILED) {
            dispatchBrowserExtensionCapture({
                type: BROWSER_EXTENSION_CAPTURE_ACTION.LOCAL_FAILURE,
                installed: false,
                error: "Extension non détectée. Installe-la, recharge l’application puis réessaie."
            });
            return false;
        }
        if (!isBrowserExtensionVersionAtLeast(status.version, CURRENT_BROWSER_EXTENSION_VERSION)) {
            dispatchBrowserExtensionCapture({
                type: BROWSER_EXTENSION_CAPTURE_ACTION.LOCAL_FAILURE,
                installed: true,
                error: `Mets l’extension à jour vers la version ${CURRENT_BROWSER_EXTENSION_VERSION}, puis recharge-la.`
            });
            return false;
        }
        if (status.busy) {
            dispatchBrowserExtensionCapture({
                type: BROWSER_EXTENSION_CAPTURE_ACTION.LOCAL_FAILURE,
                installed: true,
                error: "Une autre capture est déjà en cours dans l’extension."
            });
            return false;
        }

        const requestId = createBrowserExtensionRequestId();
        dispatchBrowserExtensionCapture({
            type: BROWSER_EXTENSION_CAPTURE_ACTION.STARTING,
            requestId,
            ticketNumber
        });
        const response = await startBrowserExtensionCapture(
            requestId,
            ticketNumber,
            options.manualContractorNumber || ""
        );
        if (!response) {
            dispatchBrowserExtensionCapture({
                type: BROWSER_EXTENSION_CAPTURE_ACTION.LOCAL_FAILURE,
                requestId,
                installed: false,
                error: "L’extension ne répond pas. Recharge l’application puis réessaie."
            });
            return false;
        }

        dispatchBrowserExtensionCapture(response);
        return response.type === BROWSER_EXTENSION_MESSAGE.ACCEPTED;
    };

    const closeBrowserExtensionCaptureFlow = () => {
        if (browserExtensionCaptureState.isRunning || browserExtensionCaptureState.isChecking) return;
        browserExtensionImportCallback.current = null;
        setBrowserExtensionCaptureOpen(false);
        dispatchBrowserExtensionCapture({ type: BROWSER_EXTENSION_CAPTURE_ACTION.RESET });
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

    const prepareSuperOfficeReplacement = async (event) => {
        setClientImportLoading(true);
        try {
            window.focus();
            event?.currentTarget?.focus?.();
            const clipboardText = await readClipboardText();
            const result = parseSuperOfficeInfoPayload(clipboardText);
            if (!result.ok) throw new Error("Clipboard does not contain SuperOffice data.");

            setSuperOfficeReplacementPrompt({
                currentTicket: await loadSuperOfficeTicketPayload(),
                nextTicket: result
            });
            return true;
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

    const cancelSuperOfficeReplacement = () => {
        setSuperOfficeReplacementPrompt(null);
    };

    const confirmSuperOfficeReplacement = async () => {
        const nextTicket = superOfficeReplacementPrompt?.nextTicket;
        if (!nextTicket) return false;
        setSuperOfficeReplacementPrompt(null);
        clearSuperOfficeMediaCache();

        if (openExternalIdConflictPrompt(nextTicket, await loadActiveClientPayload())) {
            return false;
        }
        return completeSuperOfficeImport(nextTicket);
    };

    const restorePreviousSuperOfficeTicket = async () => {
        const previousTicket = await loadPreviousSuperOfficeTicketPayload();
        if (!previousTicket) {
            showToast("No previous SuperOffice ticket is available.", "warning");
            return false;
        }
        clearSuperOfficeMediaCache();
        await completeSuperOfficeImport(previousTicket, previousTicket.tokenValues || {}, { restored: true });
        showToast(`SuperOffice ticket ${previousTicket.ticketId || previousTicket.sourceTicketId} restored.`, "success");
        return true;
    };

    const notifyCaptureImport = async (type) => {
        try {
            await captureImportCallback.current?.(type);
        } catch (error) {
            console.error("capture import callback error", error);
        }
    };

    const scheduleCaptureVtiStep = () => {
        window.clearTimeout(captureStepAdvanceTimer.current);
        captureStepAdvanceTimer.current = window.setTimeout(() => {
            setCaptureDataState((current) => {
                if (current.isPaused || current.vtiStatus === "done" || current.soStatus !== "done") {
                    return current;
                }
                return {
                    ...current,
                    phase: "vti",
                    vtiStatus: "active",
                    message: "Waiting for VTI data.",
                    detail: "Open the customer in VTI, click the VTI Capture bookmark, then copy the result.",
                    error: ""
                };
            });
        }, CAPTURE_DATA_STEP_ADVANCE_DELAY_MS);
    };

    const updateCaptureCompletionState = (updates) => {
        setCaptureDataState((current) => {
            const next = { ...current, ...updates };
            if (isCaptureDataComplete(next)) {
                if (next.isPaused) {
                    return {
                        ...next,
                    phase: "complete",
                    soStatus: "done",
                    vtiStatus: "done",
                    message: "SO and VTI data captured.",
                    detail: next.detail || "Choose the correct values below before capture can finish.",
                    error: "",
                    completedAt: null
                };
                }
                return {
                    ...next,
                    phase: "complete",
                    soStatus: "done",
                    vtiStatus: "done",
                    message: "SO and VTI data captured.",
                    detail: "Capture complete. Closing automatically...",
                    error: "",
                    completedAt: Date.now()
                };
            }
            return next;
        });
    };

    const resolveCaptureConflict = async () => {
        const conflictType = captureConflictType.current;
        if (!conflictType) return;

        captureConflictType.current = null;
        captureCompletedTypes.current.add(conflictType);
        await notifyCaptureImport(conflictType);
        updateCaptureCompletionState({
            phase: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.CLIENT) ? "complete" : "vti",
            soStatus: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.SUPER_OFFICE) ? "done" : "active",
            vtiStatus: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.CLIENT) ? "done" : "active",
            contractorStatus: "done",
            isPaused: false,
            detail: "Conflict resolved. Capture can finish now.",
            error: ""
        });
    };

    const describeRemainingCaptureStep = () => {
        const completed = captureCompletedTypes.current;
        if (!completed.has(CAPTURE_DATA_TYPE.SUPER_OFFICE)) {
            return "Open the BO/SuperOffice ticket, click the BO Capture bookmark, then copy the result.";
        }
        if (!completed.has(CAPTURE_DATA_TYPE.CLIENT)) {
            return "Open the customer in VTI, click the VTI Capture bookmark, then copy the result.";
        }
        return "Capture complete.";
    };

    const handleCaptureClipboardText = async (clipboardText, source = "auto") => {
        const trimmed = String(clipboardText ?? "").trim();
        if (!trimmed) {
            setCaptureDataState((current) => ({
                ...current,
                detail: "Clipboard is empty. Click a Capture bookmark first, then copy its result.",
                error: source === "manual" ? "Clipboard is empty." : ""
            }));
            return false;
        }

        if (trimmed === captureLastClipboardText.current) {
            setCaptureDataState((current) => ({
                ...current,
                detail: current.error ? current.detail : describeRemainingCaptureStep()
            }));
            return false;
        }
        captureLastClipboardText.current = trimmed;

        const detected = classifyCaptureClipboardText(trimmed);
        if (detected.type === CAPTURE_DATA_TYPE.UNKNOWN) {
            setCaptureDataState((current) => ({
                ...current,
                detail: "Clipboard changed, but it is not a result from the BO Capture or VTI Capture bookmark.",
                error: source === "manual" ? detected.error : "",
                lastDetectedType: ""
            }));
            return false;
        }

        if (captureCompletedTypes.current.has(detected.type)) {
            setCaptureDataState((current) => ({
                ...current,
                detail: `${detected.type === CAPTURE_DATA_TYPE.CLIENT ? "VTI" : "SO/BO"} data is already captured. ${describeRemainingCaptureStep()}`,
                error: "",
                lastDetectedType: detected.type
            }));
            return false;
        }

        if (detected.type === CAPTURE_DATA_TYPE.SUPER_OFFICE) {
            const activeClientPayload = await loadActiveClientPayload();
            if (openExternalIdConflictPrompt(detected.result, activeClientPayload)) {
                window.clearTimeout(captureStepAdvanceTimer.current);
                captureStepAdvanceTimer.current = null;
                captureConflictType.current = CAPTURE_DATA_TYPE.SUPER_OFFICE;
                setCaptureDataState((current) => ({
                    ...current,
                    isPaused: true,
                    error: "",
                    detail: "Some ticket fields do not match the customer. Choose the correct values below."
                }));
                return false;
            }

            const contractorNumber = getSuperOfficeContractorNumber(detected.result, detected.result?.tokenValues || {});
            const imported = await completeSuperOfficeImport(detected.result);
            if (!imported) return false;

            captureCompletedTypes.current.add(CAPTURE_DATA_TYPE.SUPER_OFFICE);
            await notifyCaptureImport(CAPTURE_DATA_TYPE.SUPER_OFFICE);
            updateCaptureCompletionState({
                phase: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.CLIENT)
                    ? "complete"
                    : contractorNumber ? "contractor" : "so-done",
                soStatus: "done",
                contractorStatus: contractorNumber ? "done" : "skipped",
                vtiStatus: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.CLIENT) ? "done" : "waiting",
                contractorNumber,
                lastDetectedType: detected.type,
                message: contractorNumber
                    ? "Contractor copied."
                    : "SO data captured.",
                detail: contractorNumber
                    ? "Contractor copied. Search it in VTI, open the customer, then click VTI Capture."
                    : "Ticket data imported. Open the customer in VTI, then click VTI Capture.",
                error: ""
            });
            if (!captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.CLIENT)) {
                scheduleCaptureVtiStep();
            }
            return true;
        }

        window.clearTimeout(captureStepAdvanceTimer.current);
        captureStepAdvanceTimer.current = null;
        const clientImportResult = await loadClientFromText(trimmed);
        captureCompletedTypes.current.add(CAPTURE_DATA_TYPE.CLIENT);
        await notifyCaptureImport(CAPTURE_DATA_TYPE.CLIENT);
        const hasPendingSuperOfficeConflict = Boolean(clientImportResult?.pendingSuperOfficeConflict);
        if (hasPendingSuperOfficeConflict) {
            captureConflictType.current = CAPTURE_DATA_TYPE.SUPER_OFFICE;
        }
        updateCaptureCompletionState({
            phase: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.SUPER_OFFICE) ? "complete" : "so",
            vtiStatus: "done",
            soStatus: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.SUPER_OFFICE) ? "done" : "active",
            lastDetectedType: detected.type,
            isPaused: hasPendingSuperOfficeConflict,
            message: captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.SUPER_OFFICE)
                ? "VTI data captured."
                : "VTI data captured. Waiting for SuperOffice data.",
            detail: hasPendingSuperOfficeConflict
                ? "Some ticket fields do not match the customer. Choose the correct values below."
                : captureCompletedTypes.current.has(CAPTURE_DATA_TYPE.SUPER_OFFICE)
                ? "Customer data imported."
                : "Customer data imported. Now open the BO/SuperOffice ticket and click BO Capture.",
            error: ""
        });
        return true;
    };

    const readCaptureDataClipboard = async (source = "auto") => {
        if (captureReadInFlight.current) return false;
        captureReadInFlight.current = true;
        setCaptureDataState((current) => ({
            ...current,
            isReading: true,
            error: "",
            detail: source === "manual" ? "Reading copied capture result..." : "Watching for the next copied capture result..."
        }));

        try {
            const clipboardText = await readClipboardText();
            return await handleCaptureClipboardText(clipboardText, source);
        } catch (error) {
            const message = error?.message || "Unable to read clipboard.";
            setCaptureDataState((current) => ({
                ...current,
                error: message,
                detail: "Clipboard access is blocked. Click Paste manually and paste the result from the Capture bookmark."
            }));
            return false;
        } finally {
            captureReadInFlight.current = false;
            setCaptureDataState((current) => ({
                ...current,
                isReading: false
            }));
        }
    };

    const openCaptureDataFlow = (options = {}) => {
        window.clearTimeout(captureCompleteCloseTimer.current);
        captureCompleteCloseTimer.current = null;
        window.clearTimeout(captureStepAdvanceTimer.current);
        captureStepAdvanceTimer.current = null;
        captureConflictType.current = null;
        captureImportCallback.current = typeof options.onImported === "function" ? options.onImported : null;
        captureLastClipboardText.current = "";
        captureCompletedTypes.current = new Set([
            ...(options.hasSuperOfficeData ? [CAPTURE_DATA_TYPE.SUPER_OFFICE] : []),
            ...(options.hasVtiData ? [CAPTURE_DATA_TYPE.CLIENT] : [])
        ]);
        setCaptureDataState(createCaptureDataState(options));
        setCaptureDataOpen(true);
    };

    const closeCaptureDataFlow = () => {
        window.clearTimeout(captureCompleteCloseTimer.current);
        captureCompleteCloseTimer.current = null;
        window.clearTimeout(captureStepAdvanceTimer.current);
        captureStepAdvanceTimer.current = null;
        captureConflictType.current = null;
        captureImportCallback.current = null;
        setCaptureDataOpen(false);
        setCaptureDataState(createCaptureDataState());
    };

    useEffect(() => {
        if (!captureDataOpen || captureDataState.isPaused || isCaptureDataComplete(captureDataState)) {
            return undefined;
        }

        let cancelled = false;
        let pollTimer = null;

        const pollClipboard = async () => {
            if (cancelled) return;
            await readCaptureDataClipboard("auto");
            if (!cancelled) {
                pollTimer = window.setTimeout(pollClipboard, CAPTURE_DATA_POLL_INTERVAL_MS);
            }
        };

        const handleFocus = () => {
            if (!cancelled) readCaptureDataClipboard("focus");
        };

        pollClipboard();
        window.addEventListener("focus", handleFocus);

        return () => {
            cancelled = true;
            window.clearTimeout(pollTimer);
            window.removeEventListener("focus", handleFocus);
        };
    }, [captureDataOpen, captureDataState.isPaused, captureDataState.soStatus, captureDataState.vtiStatus]);

    useEffect(() => {
        if (!captureDataOpen || captureDataState.isPaused || externalIdConflictPrompt || !isCaptureDataComplete(captureDataState)) {
            return undefined;
        }

        window.clearTimeout(captureCompleteCloseTimer.current);
        captureCompleteCloseTimer.current = window.setTimeout(() => {
            closeCaptureDataFlow();
        }, CAPTURE_DATA_COMPLETE_CLOSE_DELAY_MS);

        return () => {
            window.clearTimeout(captureCompleteCloseTimer.current);
        };
    }, [captureDataOpen, captureDataState.completedAt, captureDataState.isPaused, externalIdConflictPrompt]);

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

    const generateResolvedTemplateText = (model, tokenOverrides = {}) => {
        const tokenDefinitions = new Map();
        templateTokens.forEach((tokenDef) => {
            tokenDefinitions.set(tokenDef.token, tokenDef);
            tokenDefinitions.set(canonicalizeInputTokenValue(tokenDef.token), tokenDef);
        });

        return generateFinalTextWithTokenResolver(model, lang, (tokenName) => {
            const canonicalTokenName = canonicalizeInputTokenValue(tokenName);
            if (Object.prototype.hasOwnProperty.call(tokenOverrides, tokenName)) {
                return tokenOverrides[tokenName];
            }
            if (Object.prototype.hasOwnProperty.call(tokenOverrides, canonicalTokenName)) {
                return tokenOverrides[canonicalTokenName];
            }
            const tokenDef = tokenDefinitions.get(tokenName)
                || tokenDefinitions.get(canonicalTokenName);
            return getTokenValue(tokenDef || tokenName);
        });
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
            type: effectiveModel?.type || "",
            html: finalText,
            copied: false,
            recipientInfo: buildTemplateRecipientInfo(effectiveModel?.type || "", clientInfoSections)
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

    const copyTemplateResultAgain = async (htmlOverride = null) => {
        const hasOverride = typeof htmlOverride === "string";
        if (!copyPreview?.html && !hasOverride) return false;
        const nextHtml = hasOverride ? htmlOverride : copyPreview.html;
        const html = copyPreview?.type === "sms" ? stripImagesFromHtml(nextHtml) : nextHtml;
        if (!html) return false;
        setCopyPreview((prev) => prev ? { ...prev, copied: false } : prev);
        if (hasOverride) {
            setCopyPreview((prev) => prev ? { ...prev, html } : prev);
        }
        await copyPreviewHtml(html, copyPreview.id);
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
        captureDataOpen,
        captureDataState,
        openCaptureDataFlow,
        closeCaptureDataFlow,
        readCaptureDataClipboard,
        browserExtensionCaptureOpen,
        browserExtensionCaptureState,
        openBrowserExtensionCaptureFlow,
        startBrowserExtensionCaptureFlow,
        closeBrowserExtensionCaptureFlow,
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
        superOfficeReplacementPrompt,
        prepareSuperOfficeReplacement,
        cancelSuperOfficeReplacement,
        confirmSuperOfficeReplacement,
        restorePreviousSuperOfficeTicket,
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
        generateResolvedTemplateText,
        requestTokenInputs,
        confirmTokenPrompt,
        clearOnDemandValues
    };
}
