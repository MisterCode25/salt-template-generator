import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import { copyText, showToast } from "../services/clipboardService.js";
import { loadActiveClientPayload } from "../services/activeClientService.js";
import { loadTokens, saveTokens } from "../services/tokenService.js";
import {
    EXTERNAL_DEFAULT_FIELDS,
    EXTERNAL_GENERATOR_PARTNERS,
    buildExternalFieldsFromClientPayload,
    buildExternalCode,
    formatDateForInput,
    mergeExternalFields,
    parseExternalId
} from "../utils/externalGenerator.js";

// Stable key used to link a token to the soTicket field.
// Rename the token freely — as long as its `key` property equals this value,
// the SO Ticket field will always be pre-filled from it.
const SO_TICKET_TOKEN_KEY = "soTicket";

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
    // displayState buffers the null transition so the modal stays open between wizard steps
    const [displayState, setDisplayState] = useState(state);
    const [contentKey, setContentKey] = useState(0);
    const closeTimerRef = useRef(null);
    const wasShownRef = useRef(state !== null);

    useEffect(() => {
        if (state !== null) {
            if (closeTimerRef.current !== null) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            // Only animate the content transition when the modal was already open
            if (wasShownRef.current) {
                setContentKey((k) => k + 1);
            }
            wasShownRef.current = true;
            setDisplayState(state);
        } else {
            // Delay the close so a quick null→newState (wizard step change) never flashes
            closeTimerRef.current = window.setTimeout(() => {
                closeTimerRef.current = null;
                wasShownRef.current = false;
                setDisplayState(null);
            }, 20);
        }
        return () => {
            if (closeTimerRef.current !== null) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
        };
    }, [state]);

    useEffect(() => {
        if (!displayState) return;
        setInputValue(displayState.initialValue || "");
        setSearchValue("");
    }, [displayState]);

    if (!displayState) return null;

    if (displayState.type === "input") {
        return (
            <Modal onClose={onCancel} ariaLabel={displayState.title} dialogClassName="prompt-dialog">
                <div key={contentKey} className="prompt-dialog__step">
                    <div className="prompt-dialog__header">
                        <span className="prompt-dialog__indicator" />
                        <h2>{displayState.title}</h2>
                    </div>
                    <div className="prompt-dialog__body">
                        <input
                            autoFocus
                            type="text"
                            className="prompt-dialog__input"
                            placeholder={displayState.placeholder || ""}
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
                    <div className="prompt-dialog__actions">
                        {displayState.showBack && (
                            <button type="button" className="prompt-dialog__btn prompt-dialog__btn--back" onClick={() => onSubmit(PROMPT_BACK)}>← Back</button>
                        )}
                        <div className="prompt-dialog__actions-end">
                            <button type="button" className="prompt-dialog__btn prompt-dialog__btn--cancel" onClick={onCancel}>Cancel</button>
                            <button type="button" className="prompt-dialog__btn prompt-dialog__btn--continue" onClick={() => onSubmit(inputValue)}>Continue →</button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    const options = displayState.options || [];
    const filtered = (displayState.searchable && !displayState.customNote)
        ? options.filter((opt) => opt.label.toLowerCase().includes(searchValue.trim().toLowerCase()))
        : options;

    return (
        <Modal
            onClose={onCancel}
            ariaLabel={displayState.title}
            dialogClassName={`prompt-dialog${(displayState.searchable || displayState.customNote) ? " prompt-dialog--search" : " prompt-dialog--choices"}`}
        >
            <div key={contentKey} className="prompt-dialog__step">
                <div className="prompt-dialog__header">
                    <span className="prompt-dialog__indicator" />
                    <h2>{displayState.title}</h2>
                </div>
                {displayState.customNote ? (
                    <input
                        autoFocus
                        type="text"
                        className="prompt-dialog__search"
                        placeholder="Custom note..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && inputValue.trim()) {
                                e.preventDefault();
                                onSubmit(inputValue.trim());
                            }
                        }}
                    />
                ) : displayState.searchable && (
                    <input
                        autoFocus
                        type="text"
                        className="prompt-dialog__search"
                        placeholder={displayState.searchPlaceholder || "Search..."}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                )}
                <div className="prompt-dialog__options">
                    {filtered.map((option) => (
                        <button
                            key={`${option.value}_${option.label}`}
                            type="button"
                            className={`prompt-dialog__option${displayState.currentValue === option.value ? " is-selected" : ""}`}
                            onClick={() => onSubmit(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                    {filtered.length === 0 && <p className="prompt-dialog__empty">No result.</p>}
                </div>
                <div className="prompt-dialog__actions">
                    {displayState.showBack && (
                        <button type="button" className="prompt-dialog__btn prompt-dialog__btn--back" onClick={() => onSubmit(PROMPT_BACK)}>← Back</button>
                    )}
                    <div className="prompt-dialog__actions-end">
                        <button type="button" className="prompt-dialog__btn prompt-dialog__btn--cancel" onClick={onCancel}>Cancel</button>
                        {displayState.customNote && (
                            <button
                                type="button"
                                className="prompt-dialog__btn prompt-dialog__btn--continue"
                                onClick={() => inputValue.trim() && onSubmit(inputValue.trim())}
                            >
                                Continue →
                            </button>
                        )}
                    </div>
                </div>
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

export default function ExternalGenerator({ embedded = false, onClose, clientPayload = null }) {
    const navigate = useNavigate();
    const [fields, setFields] = useState(() => ({
        ...EXTERNAL_DEFAULT_FIELDS,
        flagging: "VALID",
        data: formatDateForInput(new Date())
    }));
    const [externalIdFieldValue, setExternalIdFieldValue] = useState("");
    const [externalIdEditing, setExternalIdEditing] = useState(false);
    const [vtiEmptyFieldErrors, setVtiEmptyFieldErrors] = useState({});
    const [storedClientPayload, setStoredClientPayload] = useState(() => clientPayload || loadActiveClientPayload());
    const [promptState, setPromptState] = useState(null);
    const promptResolverRef = useRef(null);
    const hasMountedRef = useRef(false);
    const externalIdFieldRef = useRef(null);
    const fieldsRef = useRef(fields);
    const appliedClientSignatureRef = useRef("");

    useEffect(() => {
        const tick = () => {
            setFields((prev) => ({ ...prev, data: formatDateForInput(new Date()) }));
        };
        const id = setInterval(tick, 60 * 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        setStoredClientPayload(clientPayload || loadActiveClientPayload());
    }, [clientPayload]);

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

    // Auto-fill soTicket from the token linked via key === SO_TICKET_TOKEN_KEY.
    // Fallback: if no token has that key yet but {ticket_num} exists, the key is
    // automatically assigned so renaming the token later keeps the link intact.
    useEffect(() => {
        (async () => {
            const allTokens = await loadTokens();

            // Primary lookup: stable key, survives token renaming
            let linked = allTokens.find(t => t.key === SO_TICKET_TOKEN_KEY);

            // Fallback: token still named {ticket_num} — auto-assign the key
            if (!linked) {
                const byName = allTokens.find(t => t.token === "{ticket_num}");
                if (byName) {
                    linked = byName;
                    await saveTokens(
                        allTokens.map(t =>
                            t.id === byName.id ? { ...t, key: SO_TICKET_TOKEN_KEY } : t
                        )
                    );
                }
            }

            if (!linked) return;

            const stored = localStorage.getItem("input_" + linked.token);
            if (stored !== null && stored.trim() !== "") {
                setFields(prev => ({ ...prev, soTicket: stored.trim() }));
            }
        })();
    }, []); // runs once on mount — ExternalGenerator unmounts on close so re-opens always re-read

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
                customNote: extra.customNote || false,
                searchPlaceholder: extra.searchPlaceholder || "",
                showBack: !!extra.showBack,
                currentValue: extra.currentValue ?? null,
                initialValue: extra.customNote ? (extra.currentValue || "") : ""
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
            showToast("Field required", "error");
        }
    };

    const runPostVtiCompletionFlow = async (initialFields, initialMeta = null) => {
        let draft = { ...initialFields };
        let meta = initialMeta || {
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
                        return { kind: "choice-search", key: "comment", title: "Missing Info Comment", options: MISSING_INFO_COMMENT_OPTIONS, customNote: true };
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
                    if (isBlank(draft.comment)) return { kind: "choice-search", key: "comment", title: "Comment", options: COMMENT_OPTIONS, customNote: true };
                }
            }

            // Fallback generic fill for any remaining visible core fields
            if (isBlank(draft.SignalStatus)) return { kind: "choice", key: "SignalStatus", title: "Signal Status", options: SIGNAL_OPTIONS };
            if (isBlank(draft.LedStatus)) return { kind: "choice", key: "LedStatus", title: "LED Status", options: LED_OPTIONS };
            if (draft.treatmentStep !== "FLL Ticket" && isBlank(draft.comment)) {
                return { kind: "choice-search", key: "comment", title: "Comment", options: COMMENT_OPTIONS, customNote: true };
            }

            return null;
        };

        const autoCopyResult = async () => {
            const code = buildExternalCode(draft);
            if (!code) return;
            try {
                await navigator.clipboard.writeText(code);
            } catch {
                const ta = document.createElement("textarea");
                ta.value = code;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            showToast("External ID copied!", "success");
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
                    showToast("Field required", "error");
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
                    step.customNote
                        ? { customNote: true, showBack: history.length > 0 }
                        : { searchable: true, searchPlaceholder: `Search ${step.title.toLowerCase()}...`, showBack: history.length > 0 }
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

        await autoCopyResult();
        return true;
    };

    const applyActiveClientData = async ({ runFlow = false, notify = false } = {}) => {
        const payload = clientPayload || storedClientPayload || loadActiveClientPayload();
        const result = buildExternalFieldsFromClientPayload(payload);

        if (!result.ok) {
            if (notify) showToast("No active customer data", "error");
            return;
        }

        const computedNext = mergeExternalFields(fieldsRef.current, result.fields);
        setFields(computedNext);
        if (runFlow && computedNext) {
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
        if (notify) showToast("Customer data refreshed", "info");
    };

    useEffect(() => {
        const payload = clientPayload || storedClientPayload || loadActiveClientPayload();
        if (!payload) return;

        const signature = JSON.stringify(payload);
        if (appliedClientSignatureRef.current === signature) return;
        appliedClientSignatureRef.current = signature;
        applyActiveClientData({ runFlow: false, notify: false });
    }, [clientPayload, storedClientPayload]);

    const copyCode = async () => {
        if (!fields.flagging.trim()) {
            showToast("Flagging required", "error");
            return;
        }
        await copyText(generatedCode, { message: "Code copied", variant: "info" });
    };

    const fillFromExternalIdValue = (value, { silent = false } = {}) => {
        const parsed = parseExternalId(value);
        if (!parsed.ok) {
            if (!silent) showToast("Invalid External ID (15 segments expected)", "error");
            return false;
        }
        patchFields(parsed.fields);
        if (!silent) showToast("External ID imported", "info");
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
        showToast("Fields cleared", "info");
    };

    // Reconstruct meta state from existing field values so that handleFieldClick
    // can resume the flow from the correct branch without re-asking already-answered
    // meta questions (e.g. boxSwapStatus, mode, escalationType).
    const inferMetaFromFields = (f) => {
        const meta = {
            flaggingConfirmed: !isBlank(f.flagging),
            mode: null,
            boxSwapStatus: null,
            escalationType: null,
            escalationCaseType: null,
            boxSwapSerialImpact: null
        };

        if (f.treatmentStep === "Box Swap") {
            const comment = String(f.comment ?? "").trim();
            const signal = String(f.SignalStatus ?? "").trim();
            const led = String(f.LedStatus ?? "").trim();
            if (comment === "FLL Partner Incriminate Box") {
                meta.boxSwapStatus = "Partner incriminate";
            } else if (comment === "Box swap after Power supply change") {
                meta.boxSwapStatus = "Booting";
                meta.boxSwapSerialImpact = "Impacted Serial";
            } else if (!isBlank(comment)) {
                // "Box swap" comment: Old → Signal=Lost, New → Signal=Never
                meta.boxSwapStatus = signal === "Never" ? "New" : "Old";
            } else if (!isBlank(signal) && !isBlank(led)) {
                // Signal+LED set but no comment → Booting (awaiting serial impact)
                meta.boxSwapStatus = "Booting";
            }
        }

        if (f.treatmentStep === "Other") {
            const comment = String(f.comment ?? "").trim();
            if (comment === "Power cable") {
                meta.mode = "Power supply";
            } else if (MISSING_INFO_COMMENT_OPTIONS.includes(comment)) {
                meta.mode = "Missing info";
            } else if (comment.startsWith("3tLevel esclation") || comment === "Fixnet esclation") {
                meta.mode = "Escalation";
                meta.escalationType = comment.startsWith("3tLevel") ? "3tLevel" : "Fixnet";
                // New Case sets Signal+LED; Existing External ID does not
                meta.escalationCaseType = !isBlank(f.SignalStatus) ? "New Case" : "Existing External ID";
            } else if (!isBlank(comment)) {
                meta.mode = "Generic";
            }
        }

        return meta;
    };

    const launchCompletionFlow = async () => {
        await runPostVtiCompletionFlow(fieldsRef.current, inferMetaFromFields(fieldsRef.current));
    };

    // When the user modifies a branching field via field click, clear the fields that
    // logically come after it in the wizard so the flow re-asks for them.
    const WIZARD_DOWNSTREAM_FIELDS = {
        flagging: ["treatmentStep", "SignalStatus", "LedStatus", "partner", "partnerTicketNumber", "comment"],
        treatmentStep: ["SignalStatus", "LedStatus", "partner", "partnerTicketNumber", "comment"],
    };

    const FIELD_POPUP_CONFIG = {
        flagging: { type: "choice", options: FLAGGING_OPTIONS, title: "Flagging" },
        SignalStatus: { type: "choice", options: SIGNAL_OPTIONS_ESCALATION, title: "Signal Status" },
        LedStatus: { type: "choice", options: LED_OPTIONS, title: "LED Status" },
        treatmentStep: { type: "choice", options: TREATMENT_STEP_OPTIONS, title: "Treatment Step" },
        boxType: { type: "choice", options: BOX_TYPE_OPTIONS, title: "Box Type" },
        partner: { type: "search", title: "Partner", options: EXTERNAL_GENERATOR_PARTNERS, searchPlaceholder: "Type first letters (EWB, SGSW...)" },
        comment: { type: "custom-note", title: "Comment", options: COMMENT_OPTIONS },
        customer: { type: "input", title: "Customer", placeholder: "Contractor number" },
        soTicket: { type: "input", title: "SO Ticket", placeholder: "e.g. 31436062" },
        partnerTicketNumber: { type: "input", title: "Partner Ticket Number", placeholder: "e.g. 12345678" },
        lexId: { type: "input", title: "LEX ID", placeholder: "LEX ID" },
        oltName: { type: "input", title: "OLT Name", placeholder: "OLT Name" },
        oltBoard: { type: "input", title: "OLT Board", placeholder: "OLT Board" },
        bokBof: { type: "input", title: "BOK|BOF", placeholder: "BOK|BOF|Fiber" },
    };

    const handleFieldClick = async (fieldId) => {
        if (promptState) return;
        if (fieldId === "data") return;

        const config = FIELD_POPUP_CONFIG[fieldId];
        if (!config) return;

        let value;
        if (config.type === "choice") {
            value = await askChoice(config.title, optionsOf(config.options), { currentValue: fields[fieldId] });
        } else if (config.type === "search") {
            value = await askChoice(
                config.title,
                config.options.map((v) => ({ label: v, value: v })),
                { searchable: true, searchPlaceholder: config.searchPlaceholder || "Search...", currentValue: fields[fieldId] }
            );
        } else if (config.type === "custom-note") {
            value = await askChoice(
                config.title,
                config.options.map((v) => ({ label: v, value: v })),
                { customNote: true, currentValue: fields[fieldId] }
            );
        } else {
            value = await askInput(config.title, config.placeholder || "", fields[fieldId] || "");
        }

        if (value === null) return;
        const cleaned = String(value).trim();
        if (!cleaned) return;

        // When modifying a branching field, clear its downstream fields so the wizard
        // re-asks for them in the correct context rather than skipping them.
        const downstreamFields = WIZARD_DOWNSTREAM_FIELDS[fieldId] || [];
        const clearPatch = downstreamFields.reduce((acc, f) => ({ ...acc, [f]: "" }), {});

        const updatedFields = { ...fieldsRef.current, [fieldId]: cleaned, ...clearPatch };
        setFields(updatedFields);
        setVtiEmptyFieldErrors((prev) => {
            const next = { ...prev };
            delete next[fieldId];
            downstreamFields.forEach((f) => delete next[f]);
            return next;
        });

        // Let React flush the prompt-close state before opening the next one
        await new Promise((r) => setTimeout(r, 0));

        await runPostVtiCompletionFlow(updatedFields, inferMetaFromFields(updatedFields));
    };

    const InputField = ({ id, label, type = "text" }) => {
        const isPopupField = id !== "data";
        return (
            <div
                className={`form-field${isPopupField ? " ext-field--interactive" : ""}`}
                onClick={isPopupField ? () => handleFieldClick(id) : undefined}
            >
                <label htmlFor={`ext-${id}`}>{label}</label>
                <input
                    id={`ext-${id}`}
                    className={vtiEmptyFieldErrors[id] ? "input-error" : ""}
                    type={type}
                    value={fields[id]}
                    placeholder={FIELD_PLACEHOLDERS[id] || label}
                    readOnly={isPopupField}
                    onChange={isPopupField ? undefined : (e) => setField(id, e.target.value)}
                />
            </div>
        );
    };

    const pageContent = (
            <div className={`manage-card external-generator-page${embedded ? " external-generator-page--embedded" : ""}`}>
                <div className="variant-editor-head">
                    <div>
                        <p className="eyebrow">HCAMP</p>
                        <h2>External Generator</h2>
                    </div>
                    {!embedded && (
                        <div className="flex-row gap-sm flex-wrap">
                            <button type="button" className="secondary-btn" onClick={() => navigate("/")}>Back</button>
                        </div>
                    )}
                </div>

                <div className="external-generator-layout">
                    <section className="popup-card external-generator-form">
                        <div className="popup-grid">
                            <InputField id="flagging" label="Flagging" />
                            <InputField id="data" label="Date" type="date" />
                            <InputField id="customer" label="Customer" />
                            <InputField id="soTicket" label="SO Ticket" />
                            <InputField id="SignalStatus" label="Signal Status" />
                            <InputField id="LedStatus" label="LED Status" />
                            <InputField id="treatmentStep" label="Treatment Step" />
                            <InputField id="boxType" label="Box-type" />
                            <InputField id="partner" label="Partner or Empty" />
                            <InputField id="partnerTicketNumber" label="Partner Ticket or Empty" />
                            <InputField id="lexId" label="LEX ID" />
                            <InputField id="oltName" label="OLT Name" />
                            <InputField id="oltBoard" label="OLT Board" />
                            <InputField id="bokBof" label="BOK|BOF" />
                            <InputField id="comment" label="Comment" />
                        </div>
                    </section>

                    <div className="external-generator-right-col">
                        <section className="popup-card external-generator-actions-card">
                            <div className="external-generator-top-actions">
                                <p className="hint external-generator-active-client-status">
                                    Customer data is loaded automatically from the active customer.
                                </p>
                                <div className="external-generator-subtle-actions">
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() => applyActiveClientData({ runFlow: false, notify: true })}
                                    >
                                        Refresh
                                    </button>
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={clearAllFields}
                                    >
                                        Clear
                                    </button>
                                </div>
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
                            <div className="popup-actions mt-md">
                                <button type="button" className="primary-btn external-generator-build-btn" onClick={launchCompletionFlow}>
                                    Build
                                </button>
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
