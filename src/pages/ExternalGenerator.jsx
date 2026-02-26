import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import { copyText, showToast } from "../services/clipboardService.js";
import {
    EXTERNAL_DEFAULT_FIELDS,
    EXTERNAL_GENERATOR_PARTNERS,
    buildExternalCode,
    formatDateForInput,
    mergeExternalFields,
    parseExternalId,
    parseVtiClipboard
} from "../utils/externalGenerator.js";

const FLAGGING_OPTIONS = ["VALID", "MINFO", "WRCAT", "UNTKT"];
const PROMPT_BACK = "__PROMPT_BACK__";
const SIGNAL_OPTIONS = ["Lost", "Never", "Low RX|TX "];
const SIGNAL_OPTIONS_ESCALATION = ["Lost", "Never", "Low RX|TX", "Other"];
const LED_OPTIONS = [
    "Fiber Off",
    "Fiber Blinking white",
    "Fiber Blinking white|Red",
    "Fiber Red",
    "Fiber On",
    "WWW Off",
    "Internet Off"
];
const TREATMENT_STEP_OPTIONS = ["Box Swap", "FLL Ticket", "Other"];
const BOX_TYPE_OPTIONS = ["X6", "Arc", "W7"];
const COMMENT_OPTIONS = [
    "Power cable",
    "Box swap",
    "Extention (OTO@BEP). Email and SMS send",
    "Need Pictures (Rx Tx values) Email and SMS send",
    "Need Pictures (OTO) Email and SMS send",
    "3t Level escalation",
    "Box now online, issue solved"
];
const MISSING_INFO_COMMENT_OPTIONS = [
    "Pictures OTO and RX|TX values, Mail and SMS send",
    "picture ( OTO number and plug ), Mail and SMS send",
    "Pictures ( OTO Plug inside ), Mail and SMS send",
    "RX|TX, Mail and SMS send",
    "OTO @Beep, Mail and SMS send"
];
const ESCALATION_DETAIL_OPTIONS = [
    "Partner mean no fault clearence",
    "Fiber Blinking white|Red Huawei",
    "Internet Led Off",
    "No special Note"
];

const FIELD_PLACEHOLDERS = {
    flagging: "VALID / MINFO / WRCAT / UNTKT",
    data: "YYYY-MM-DD",
    customer: "Contractor number",
    soTicket: "SO Ticket number",
    SignalStatus: "Lost / Never / Low RX|TX",
    LedStatus: "Fiber Off / Fiber Red / ...",
    treatmentStep: "Box Swap / FLL Ticket / Other",
    boxType: "X6 / Arc / W7",
    partner: "EWB, SGSW, ...",
    partnerTicketNumber: "Partner ticket number",
    lexId: "LEX ID",
    oltName: "OLT Name",
    oltBoard: "OLT Board",
    bokBof: "BOK|BOF|Fiber",
    comment: "Comment"
};

function PromptModal({ state, onCancel, onSubmit }) {
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (!state) return;
        setInputValue(state.initialValue || "");
        setSearchValue("");
    }, [state]);

    if (!state) return null;

    if (state.type === "input") {
        return (
            <Modal onClose={onCancel} ariaLabel={state.title} dialogClassName="popup-box external-prompt-modal">
                <div className="popup-header">
                    <h2>{state.title}</h2>
                </div>
                <div className="popup-grid">
                    <div className="popup-card">
                        <input
                            autoFocus
                            type="text"
                            placeholder={state.placeholder || ""}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    onSubmit(inputValue);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="popup-actions external-prompt-actions">
                    <div className="external-prompt-actions__main">
                        {state.showBack && (
                            <button type="button" className="secondary-btn prompt-back-btn" onClick={() => onSubmit(PROMPT_BACK)}>Back</button>
                        )}
                        <button type="button" className="primary-btn prompt-continue-btn" onClick={() => onSubmit(inputValue)}>Continue</button>
                    </div>
                    <button type="button" className="secondary-btn prompt-cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </Modal>
        );
    }

    const options = state.options || [];
    const filtered = state.searchable
        ? options.filter((opt) => opt.label.toLowerCase().includes(searchValue.trim().toLowerCase()))
        : options;

    return (
        <Modal
            onClose={onCancel}
            ariaLabel={state.title}
            dialogClassName={`popup-box external-prompt-modal${state.searchable ? " external-prompt-modal--search" : " external-prompt-modal--choices"}`}
        >
            <div className="popup-header">
                <h2>{state.title}</h2>
            </div>
            {state.searchable && (
                <input
                    autoFocus
                    type="text"
                    className="partners-search"
                    placeholder={state.searchPlaceholder || "Search..."}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            )}
            <div className="external-prompt-options">
                {filtered.map((option) => (
                    <button
                        key={`${option.value}_${option.label}`}
                        type="button"
                        className="partners-list-item primary-btn template-type-email external-prompt-option-btn"
                        onClick={() => onSubmit(option.value)}
                    >
                        <strong>{option.label}</strong>
                    </button>
                ))}
                {filtered.length === 0 && <p className="hint">No result.</p>}
            </div>
            <div className="popup-actions external-prompt-actions">
                <div className="external-prompt-actions__main">
                    {state.showBack && (
                        <button type="button" className="secondary-btn prompt-back-btn" onClick={() => onSubmit(PROMPT_BACK)}>Back</button>
                    )}
                </div>
                <button type="button" className="secondary-btn prompt-cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </Modal>
    );
}

function optionsOf(values) {
    return values.map((value) => ({ label: value, value }));
}

function isBlank(value) {
    return String(value ?? "").trim() === "";
}

export default function ExternalGenerator({ embedded = false, onClose }) {
    const navigate = useNavigate();
    const [fields, setFields] = useState(() => ({
        ...EXTERNAL_DEFAULT_FIELDS,
        flagging: "VALID",
        data: formatDateForInput(new Date())
    }));
    const [externalIdFieldValue, setExternalIdFieldValue] = useState("");
    const [externalIdEditing, setExternalIdEditing] = useState(false);
    const [vtiEmptyFieldErrors, setVtiEmptyFieldErrors] = useState({});
    const [clipboardState, setClipboardState] = useState("unknown");
    const [promptState, setPromptState] = useState(null);
    const promptResolverRef = useRef(null);
    const hasMountedRef = useRef(false);
    const externalIdFieldRef = useRef(null);
    const fieldsRef = useRef(fields);

    useEffect(() => {
        const tick = () => {
            setFields((prev) => ({ ...prev, data: formatDateForInput(new Date()) }));
        };
        const id = setInterval(tick, 60 * 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const probeClipboard = async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (cancelled) return;
                setClipboardState(text.trim() ? "ready" : "empty");
            } catch {
                if (cancelled) return;
                setClipboardState("unknown");
            }
        };

        probeClipboard();
        const onFocus = () => probeClipboard();
        const onVisibility = () => {
            if (document.visibilityState === "visible") probeClipboard();
        };
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);
        const intervalId = window.setInterval(probeClipboard, 4000);

        return () => {
            cancelled = true;
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibility);
            window.clearInterval(intervalId);
        };
    }, []);

    const generatedCode = useMemo(() => buildExternalCode(fields), [fields]);

    useEffect(() => {
        fieldsRef.current = fields;
    }, [fields]);

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
        }
        if (!externalIdEditing) {
            setExternalIdFieldValue(generatedCode);
        }
    }, [generatedCode, externalIdEditing]);

    const externalIdDisplayValue = externalIdEditing ? externalIdFieldValue : generatedCode;

    useEffect(() => {
        const el = externalIdFieldRef.current;
        if (!el) return;
        el.style.height = "0px";
        const next = Math.min(Math.max(el.scrollHeight, 48), 120);
        el.style.height = `${next}px`;
    }, [externalIdDisplayValue]);

    const setField = (key, value) => {
        setFields((prev) => ({ ...prev, [key]: value }));
        setVtiEmptyFieldErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const patchFields = (patch) => {
        setFields((prev) => mergeExternalFields(prev, patch));
    };

    const askInput = (title, placeholder = "", initialValue = "", extra = {}) => {
        return new Promise((resolve) => {
            promptResolverRef.current = resolve;
            setPromptState({
                type: "input",
                title,
                placeholder,
                initialValue,
                showBack: !!extra.showBack
            });
        });
    };

    const askChoice = (title, options, extra = {}) => {
        return new Promise((resolve) => {
            promptResolverRef.current = resolve;
            setPromptState({
                type: "choice",
                title,
                options,
                searchable: extra.searchable || false,
                searchPlaceholder: extra.searchPlaceholder || "",
                showBack: !!extra.showBack
            });
        });
    };

    const closePrompt = (value = null) => {
        setPromptState(null);
        const resolver = promptResolverRef.current;
        promptResolverRef.current = null;
        resolver?.(value);
    };

    const requireInput = async (title, placeholder, initialValue = "") => {
        while (true) {
            const result = await askInput(title, placeholder, initialValue);
            if (result === null || result === PROMPT_BACK) return result;
            const cleaned = String(result).trim();
            if (cleaned) return cleaned;
            showToast("Champ requis", "error");
        }
    };

    const runPostVtiCompletionFlow = async (initialFields) => {
        let draft = { ...initialFields };
        let meta = {
            mode: null,
            flaggingConfirmed: false,
            boxSwapStatus: null,
            escalationType: null,
            escalationCaseType: null,
            boxSwapSerialImpact: null
        };
        const history = [];

        const snapshotState = () => ({
            draft: { ...draft },
            meta: { ...meta }
        });

        const restoreSnapshot = (snapshot) => {
            draft = { ...snapshot.draft };
            meta = { ...snapshot.meta };
            setFields({ ...snapshot.draft });
        };

        const apply = (patch) => {
            draft = { ...draft, ...patch };
            patchFields(patch);
        };

        const nextStep = () => {
            if (!meta.flaggingConfirmed) {
                return { kind: "choice", key: "flagging", title: "Flagging", options: FLAGGING_OPTIONS, markMeta: "flaggingConfirmed" };
            }
            if (isBlank(draft.soTicket)) {
                return { kind: "input", key: "soTicket", title: "SO Ticket", placeholder: "e.g. 31436062" };
            }
            if (isBlank(draft.treatmentStep)) {
                return { kind: "choice", key: "treatmentStep", title: "Treatment Step", options: TREATMENT_STEP_OPTIONS };
            }

            // Branch for Box Swap
            if (draft.treatmentStep === "Box Swap") {
                if (!meta.boxSwapStatus) {
                    return {
                        kind: "choice-meta",
                        key: "boxSwapStatus",
                        title: "Box Swap Status",
                        options: ["Old", "New", "Partner incriminate", "Booting"]
                    };
                }
                if (meta.boxSwapStatus === "Booting" && !meta.boxSwapSerialImpact) {
                    return {
                        kind: "choice-meta",
                        key: "boxSwapSerialImpact",
                        title: "Serial Impact",
                        options: ["Impacted Serial", "Not impacted Serial"]
                    };
                }
            }

            // Branch for FLL Ticket
            if (draft.treatmentStep === "FLL Ticket") {
                if (isBlank(draft.SignalStatus)) {
                    return { kind: "choice", key: "SignalStatus", title: "Signal Status", options: SIGNAL_OPTIONS };
                }
                if (isBlank(draft.LedStatus)) {
                    return { kind: "choice", key: "LedStatus", title: "LED Status", options: LED_OPTIONS };
                }
                if (isBlank(draft.partner)) {
                    return { kind: "partner-mode" };
                }
                if (!isBlank(draft.partner) && isBlank(draft.partnerTicketNumber)) {
                    return { kind: "input", key: "partnerTicketNumber", title: "Partner Ticket Number", placeholder: "e.g. 12345678" };
                }
            }

            // Branch for Other (requires a mode)
            if (draft.treatmentStep === "Other") {
                if (!meta.mode) {
                    return {
                        kind: "choice-meta",
                        key: "mode",
                        title: "Flow",
                        options: ["Power supply", "Missing info", "Escalation", "Generic"]
                    };
                }

                if (meta.mode === "Power supply") {
                    if (isBlank(draft.SignalStatus)) return { kind: "preset", patch: { SignalStatus: "Lost" } };
                    if (isBlank(draft.LedStatus)) return { kind: "preset", patch: { LedStatus: "Fiber Off" } };
                    if (isBlank(draft.comment)) return { kind: "preset", patch: { comment: "Power cable" } };
                }

                if (meta.mode === "Missing info") {
                    if (isBlank(draft.SignalStatus)) return { kind: "choice", key: "SignalStatus", title: "Signal Status", options: SIGNAL_OPTIONS };
                    if (isBlank(draft.LedStatus)) return { kind: "choice", key: "LedStatus", title: "LED Status", options: LED_OPTIONS };
                    if (isBlank(draft.comment)) {
                        return { kind: "choice-search", key: "comment", title: "Missing Info Comment", options: MISSING_INFO_COMMENT_OPTIONS };
                    }
                }

                if (meta.mode === "Escalation") {
                    if (!meta.escalationCaseType) {
                        return { kind: "choice-meta", key: "escalationCaseType", title: "Escalation Case", options: ["Existing External ID", "New Case"] };
                    }
                    if (meta.escalationCaseType === "Existing External ID") {
                        if (!meta.escalationType) {
                            return { kind: "choice-meta", key: "escalationType", title: "Escalation Type", options: ["3tLevel", "Fixnet"] };
                        }
                        if (meta.escalationType === "3tLevel" && isBlank(draft.comment)) {
                            return { kind: "choice", key: "comment", title: "3tLevel Detail", options: ESCALATION_DETAIL_OPTIONS, mapChoice: (v) => v === "No special Note" ? "3tLevel esclation" : `3tLevel esclation ${v}` };
                        }
                        if (meta.escalationType === "Fixnet" && isBlank(draft.comment)) {
                            return { kind: "preset", patch: { comment: "Fixnet esclation" } };
                        }
                    } else {
                        if (!meta.escalationType) {
                            return { kind: "choice-meta", key: "escalationType", title: "Escalation Type", options: ["3tLevel", "Fixnet"] };
                        }
                        if (isBlank(draft.SignalStatus)) return { kind: "choice", key: "SignalStatus", title: "Signal Status", options: SIGNAL_OPTIONS_ESCALATION };
                        if (isBlank(draft.LedStatus)) return { kind: "choice", key: "LedStatus", title: "LED Status", options: LED_OPTIONS };
                        if (meta.escalationType === "3tLevel" && isBlank(draft.comment)) {
                            return { kind: "choice", key: "comment", title: "3tLevel Detail", options: ESCALATION_DETAIL_OPTIONS, mapChoice: (v) => v === "No special Note" ? "3tLevel esclation" : `3tLevel esclation ${v}` };
                        }
                        if (meta.escalationType === "Fixnet" && isBlank(draft.comment)) {
                            return { kind: "preset", patch: { comment: "Fixnet esclation" } };
                        }
                    }
                }

                if (meta.mode === "Generic") {
                    if (isBlank(draft.SignalStatus)) return { kind: "choice", key: "SignalStatus", title: "Signal Status", options: SIGNAL_OPTIONS };
                    if (isBlank(draft.LedStatus)) return { kind: "choice", key: "LedStatus", title: "LED Status", options: LED_OPTIONS };
                    if (isBlank(draft.comment)) return { kind: "choice-search", key: "comment", title: "Comment", options: COMMENT_OPTIONS };
                }
            }

            // Fallback generic fill for any remaining visible core fields
            if (isBlank(draft.SignalStatus)) return { kind: "choice", key: "SignalStatus", title: "Signal Status", options: SIGNAL_OPTIONS };
            if (isBlank(draft.LedStatus)) return { kind: "choice", key: "LedStatus", title: "LED Status", options: LED_OPTIONS };
            if (draft.treatmentStep !== "FLL Ticket" && isBlank(draft.comment)) {
                return { kind: "choice-search", key: "comment", title: "Comment", options: COMMENT_OPTIONS };
            }

            return null;
        };

        while (true) {
            const step = nextStep();
            if (!step) break;

            if (step.kind === "preset") {
                apply(step.patch);
                continue;
            }

            if (step.kind === "input") {
                const before = snapshotState();
                const value = await askInput(step.title, step.placeholder || "", draft[step.key] || "", { showBack: history.length > 0 });
                if (value === PROMPT_BACK) {
                    const previous = history.pop();
                    if (previous) restoreSnapshot(previous);
                    continue;
                }
                if (value === null) return false;
                const cleaned = String(value).trim();
                if (!cleaned) {
                    showToast("Champ requis", "error");
                    continue;
                }
                history.push(before);
                apply({ [step.key]: cleaned });
                continue;
            }

            if (step.kind === "choice") {
                const before = snapshotState();
                const value = await askChoice(step.title, optionsOf(step.options), { showBack: history.length > 0 });
                if (value === PROMPT_BACK) {
                    const previous = history.pop();
                    if (previous) restoreSnapshot(previous);
                    continue;
                }
                if (!value) return false;
                history.push(before);
                apply({ [step.key]: step.mapChoice ? step.mapChoice(value) : value });
                if (step.markMeta) {
                    meta = { ...meta, [step.markMeta]: true };
                }

                if (step.key === "treatmentStep" && value === "Box Swap") {
                    // Reset branch-sensitive values to allow deterministic flow decisions.
                    meta.boxSwapStatus = null;
                    meta.boxSwapSerialImpact = null;
                }
                continue;
            }

            if (step.kind === "choice-search") {
                const before = snapshotState();
                const value = await askChoice(
                    step.title,
                    step.options.map((v) => ({ label: v, value: v })),
                    { searchable: true, searchPlaceholder: `Search ${step.title.toLowerCase()}...`, showBack: history.length > 0 }
                );
                if (value === PROMPT_BACK) {
                    const previous = history.pop();
                    if (previous) restoreSnapshot(previous);
                    continue;
                }
                if (!value) return false;
                history.push(before);
                apply({ [step.key]: value });
                continue;
            }

            if (step.kind === "choice-meta") {
                const before = snapshotState();
                const value = await askChoice(step.title, optionsOf(step.options), { showBack: history.length > 0 });
                if (value === PROMPT_BACK) {
                    const previous = history.pop();
                    if (previous) restoreSnapshot(previous);
                    continue;
                }
                if (!value) return false;
                history.push(before);
                meta = { ...meta, [step.key]: value };

                if (step.key === "boxSwapStatus") {
                    if (value === "Old") apply({ SignalStatus: "Lost", LedStatus: "Fiber Off", comment: "Box swap" });
                    if (value === "New") apply({ SignalStatus: "Never", LedStatus: "Fiber Off", comment: "Box swap" });
                    if (value === "Partner incriminate") apply({ SignalStatus: "Lost", LedStatus: "Fiber Off", comment: "FLL Partner Incriminate Box" });
                    if (value === "Booting") apply({ SignalStatus: "Lost", LedStatus: "Fiber Off" });
                }

                if (step.key === "boxSwapSerialImpact") {
                    apply({ comment: value === "Impacted Serial" ? "Box swap after Power supply change" : "Box swap" });
                }
                continue;
            }

            if (step.kind === "partner-mode") {
                const before = snapshotState();
                const selectedPartner = await askPartnerViaSearch();
                if (selectedPartner === PROMPT_BACK) {
                    const previous = history.pop();
                    if (previous) restoreSnapshot(previous);
                    continue;
                }
                if (!selectedPartner) return false;
                history.push(before);
                apply({ partner: selectedPartner });
                continue;
            }
        }

        return true;
    };

    const parseClipboardVti = async () => {
        try {
            const raw = await navigator.clipboard.readText();
            setClipboardState(raw.trim() ? "ready" : "empty");
            const result = parseVtiClipboard(raw);
            if (!result.ok) {
                if (result.error === "EMPTY_VTI_CLIPBOARD") {
                    showToast("Clipboard vide", "error");
                } else {
                    showToast("Format VTI invalide / non parsable", "error");
                }
                return;
            }
            const computedNext = mergeExternalFields(fieldsRef.current, result.fields);
            setFields(computedNext);
            if (computedNext) {
                const nextErrors = {};
                Object.entries(computedNext).forEach(([key, value]) => {
                    if (key === "data") return;
                    const text = String(value ?? "").trim();
                    if (!text) nextErrors[key] = true;
                });
                setVtiEmptyFieldErrors(nextErrors);
                const completed = await runPostVtiCompletionFlow(computedNext);
                if (completed) {
                    setVtiEmptyFieldErrors({});
                }
            }
            showToast("Données VTI importées depuis le clipboard", "info");
        } catch (error) {
            console.error(error);
            setClipboardState("unknown");
            showToast("Impossible de lire le clipboard", "error");
        }
    };

    const copyCode = async () => {
        if (!fields.flagging.trim()) {
            showToast("Flagging manquant", "error");
            return;
        }
        await copyText(generatedCode, { message: "Code copied", variant: "info" });
    };

    const fillFromExternalIdValue = (value, { silent = false } = {}) => {
        const parsed = parseExternalId(value);
        if (!parsed.ok) {
            if (!silent) showToast("External ID invalide (15 segments attendus)", "error");
            return false;
        }
        patchFields(parsed.fields);
        if (!silent) showToast("External ID importé", "info");
        return true;
    };

    const askSignal = async (title = "Select Signal Status", escalation = false) => {
        const values = escalation ? SIGNAL_OPTIONS_ESCALATION : SIGNAL_OPTIONS;
        return askChoice(title, optionsOf(values));
    };

    const askLed = async (title = "Select LED Status") => askChoice(title, optionsOf(LED_OPTIONS));

    const askPartnerViaSearch = async () => {
        return askChoice(
            "Search Partner",
            EXTERNAL_GENERATOR_PARTNERS.map((p) => ({ label: p, value: p })),
            { searchable: true, searchPlaceholder: "Type first letters (EWB, SGSW...)", showBack: true }
        );
    };

    const clearAllFields = () => {
        setFields({
            ...EXTERNAL_DEFAULT_FIELDS,
            flagging: "VALID",
            data: formatDateForInput(new Date())
        });
        setExternalIdFieldValue("");
        setExternalIdEditing(false);
        setVtiEmptyFieldErrors({});
        setPromptState(null);
        promptResolverRef.current = null;
        showToast("Champs effacés", "info");
    };

    const InputField = ({ id, label, list, type = "text" }) => (
        <div className="form-field">
            <label htmlFor={`ext-${id}`}>{label}</label>
            <input
                id={`ext-${id}`}
                className={vtiEmptyFieldErrors[id] ? "input-error" : ""}
                type={type}
                list={list ? `${id}-options` : undefined}
                value={fields[id]}
                placeholder={FIELD_PLACEHOLDERS[id] || label}
                onChange={(e) => setField(id, e.target.value)}
            />
            {list && (
                <datalist id={`${id}-options`}>
                    {list.map((option) => <option key={`${id}_${option}`} value={option} />)}
                </datalist>
            )}
        </div>
    );

    const pageContent = (
            <div className={`manage-card external-generator-page${embedded ? " external-generator-page--embedded" : ""}`}>
                <div className="variant-editor-head" style={{ alignItems: "center" }}>
                    <div>
                        <p className="eyebrow">HCAMP</p>
                        <h2>External Generator</h2>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {embedded ? (
                            <button type="button" className="secondary-btn" onClick={onClose}>Close</button>
                        ) : (
                            <button type="button" className="secondary-btn" onClick={() => navigate("/")}>Back</button>
                        )}
                    </div>
                </div>

                <div className="external-generator-layout">
                    <section className="popup-card external-generator-form">
                        <div className="popup-grid">
                            <InputField id="flagging" label="Flagging" list={FLAGGING_OPTIONS} />
                            <InputField id="data" label="Date" type="date" />
                            <InputField id="customer" label="Customer" />
                            <InputField id="soTicket" label="SO Ticket" />
                            <InputField id="SignalStatus" label="Signal Status" list={SIGNAL_OPTIONS_ESCALATION} />
                            <InputField id="LedStatus" label="LED Status" list={LED_OPTIONS} />
                            <InputField id="treatmentStep" label="Treatment Step" list={TREATMENT_STEP_OPTIONS} />
                            <InputField id="boxType" label="Box-type" list={BOX_TYPE_OPTIONS} />
                            <InputField id="partner" label="Partner or Empty" list={EXTERNAL_GENERATOR_PARTNERS} />
                            <InputField id="partnerTicketNumber" label="Partner Ticketnumber or Empty" />
                            <InputField id="lexId" label="LEX ID" />
                            <InputField id="oltName" label="OLT Name" />
                            <InputField id="oltBoard" label="OLT Board" />
                            <InputField id="bokBof" label="BOK|BOF" />
                            <InputField id="comment" label="Comment" list={COMMENT_OPTIONS} />
                        </div>
                    </section>

                    <div className="external-generator-right-col">
                        <section className="popup-card external-generator-actions-card">
                            <div className="external-generator-top-actions">
                                <button
                                    type="button"
                                    className={`primary-btn clipboard-parse-btn is-${clipboardState}`}
                                    onClick={parseClipboardVti}
                                    disabled={clipboardState !== "ready"}
                                >
                                    Paste & Parse VTI (Clipboard)
                                </button>
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={clearAllFields}
                                >
                                    Clear All
                                </button>
                            </div>
                        </section>

                        <section className="popup-card external-generator-externalid-card">
                            <div className="external-generator-block">
                            <h3>HCAMP External ID</h3>
                            <textarea
                                ref={externalIdFieldRef}
                                className="external-id-field"
                                value={externalIdDisplayValue}
                                placeholder="HCAMP External ID (15 segments séparés par //)"
                                onFocus={() => setExternalIdEditing(true)}
                                onBlur={() => {
                                    setExternalIdEditing(false);
                                    setExternalIdFieldValue(generatedCode);
                                }}
                                onChange={(e) => {
                                    const nextValue = e.target.value;
                                    setExternalIdFieldValue(nextValue);
                                    if (nextValue.trim()) {
                                        fillFromExternalIdValue(nextValue, { silent: true });
                                    }
                                }}
                            />
                            <div className="popup-actions" style={{ marginTop: 10 }}>
                                <button type="button" className="primary-btn" onClick={copyCode}>
                                    Copy
                                </button>
                            </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
    );

    return (
        <>
            {embedded ? pageContent : <main className="page-container">{pageContent}</main>}
            <PromptModal
                state={promptState}
                onCancel={() => closePrompt(null)}
                onSubmit={(value) => closePrompt(value)}
            />
        </>
    );
}
