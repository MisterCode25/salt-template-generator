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
            <Modal onClose={onCancel} ariaLabel={state.title}>
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
                <div className="popup-actions">
                    <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
                    <button type="button" className="primary-btn" onClick={() => onSubmit(inputValue)}>OK</button>
                </div>
            </Modal>
        );
    }

    const options = state.options || [];
    const filtered = state.searchable
        ? options.filter((opt) => opt.label.toLowerCase().includes(searchValue.trim().toLowerCase()))
        : options;

    return (
        <Modal onClose={onCancel} ariaLabel={state.title} dialogClassName="popup-box external-prompt-modal">
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
                        className="partners-list-item"
                        onClick={() => onSubmit(option.value)}
                    >
                        <strong>{option.label}</strong>
                    </button>
                ))}
                {filtered.length === 0 && <p className="hint">No result.</p>}
            </div>
            <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
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

export default function ExternalGenerator() {
    const navigate = useNavigate();
    const [fields, setFields] = useState(() => ({
        ...EXTERNAL_DEFAULT_FIELDS,
        flagging: "VALID",
        data: formatDateForInput(new Date())
    }));
    const [externalIdFieldValue, setExternalIdFieldValue] = useState("");
    const [vtiEmptyFieldErrors, setVtiEmptyFieldErrors] = useState({});
    const [clipboardState, setClipboardState] = useState("unknown");
    const [promptState, setPromptState] = useState(null);
    const promptResolverRef = useRef(null);
    const hasMountedRef = useRef(false);
    const externalIdFieldRef = useRef(null);

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
        setExternalIdFieldValue(generatedCode);
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                await navigator.clipboard.writeText(generatedCode);
            } catch (error) {
                // Silent failure: clipboard may require user gesture in some contexts.
                console.debug("Auto-copy external ID failed", error);
            }
        }, 120);
        return () => clearTimeout(timeout);
    }, [generatedCode]);

    useEffect(() => {
        const el = externalIdFieldRef.current;
        if (!el) return;
        el.style.height = "0px";
        const next = Math.min(Math.max(el.scrollHeight, 48), 120);
        el.style.height = `${next}px`;
    }, [externalIdFieldValue]);

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

    const askInput = (title, placeholder = "", initialValue = "") => {
        return new Promise((resolve) => {
            promptResolverRef.current = resolve;
            setPromptState({
                type: "input",
                title,
                placeholder,
                initialValue
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
                searchPlaceholder: extra.searchPlaceholder || ""
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
            if (result === null) return null;
            const cleaned = String(result).trim();
            if (cleaned) return cleaned;
            showToast("Champ requis", "error");
        }
    };

    const runPostVtiCompletionFlow = async (initialFields) => {
        let draft = { ...initialFields };
        const apply = (patch) => {
            draft = { ...draft, ...patch };
            patchFields(patch);
        };

        if (isBlank(draft.soTicket)) {
            const soTicket = await requireInput("SO Ticket", "e.g. 31436062", "");
            if (!soTicket) return false;
            apply({ soTicket });
        }

        if (isBlank(draft.SignalStatus)) {
            const signalValue = await askSignal("Signal Status");
            if (!signalValue) return false;
            apply({ SignalStatus: signalValue });
        }

        if (isBlank(draft.LedStatus)) {
            const ledValue = await askLed("LED Status");
            if (!ledValue) return false;
            apply({ LedStatus: ledValue });
        }

        if (isBlank(draft.treatmentStep)) {
            const treatment = await askChoice("Treatment Step", optionsOf(TREATMENT_STEP_OPTIONS));
            if (!treatment) return false;
            apply({ treatmentStep: treatment });
        }

        if (draft.treatmentStep === "FLL Ticket" && isBlank(draft.partner)) {
            const partnerMode = await askChoice("Partner", [
                { label: "Skip (empty)", value: "__skip__" },
                { label: "ALO", value: "ALO" },
                { label: "Search partner", value: "__search__" }
            ]);
            if (!partnerMode) return false;
            if (partnerMode === "__search__") {
                const selectedPartner = await askPartnerViaSearch();
                if (!selectedPartner) return false;
                apply({ partner: selectedPartner });
            } else if (partnerMode !== "__skip__") {
                apply({ partner: partnerMode });
            }
        }

        if (!isBlank(draft.partner) && isBlank(draft.partnerTicketNumber)) {
            const partnerTicketNumber = await requireInput("Partner Ticket Number", "e.g. 12345678", "");
            if (!partnerTicketNumber) return false;
            apply({ partnerTicketNumber });
        }

        if (isBlank(draft.comment)) {
            const baseComments = COMMENT_OPTIONS.filter(Boolean);
            const commentChoice = await askChoice("Comment", [
                { label: "Skip (empty)", value: "__skip__" },
                ...baseComments.map((c) => ({ label: c, value: c }))
            ], { searchable: true, searchPlaceholder: "Search comment..." });
            if (!commentChoice) return false;
            if (commentChoice !== "__skip__") {
                apply({ comment: commentChoice });
            }
        }

        await generateExternalId();
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
            let computedNext = null;
            setFields((prev) => {
                computedNext = mergeExternalFields(prev, result.fields);
                return computedNext;
            });
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

    const generateExternalId = async () => {
        setExternalIdFieldValue(generatedCode);
        if (!fields.flagging.trim()) {
            showToast("Flagging manquant", "warning");
            return;
        }
        await copyText(generatedCode, { message: "External ID generated & copied", variant: "info" });
    };

    const fillFromExternalIdValue = (value) => {
        const parsed = parseExternalId(value);
        if (!parsed.ok) {
            showToast("External ID invalide (15 segments attendus)", "error");
            return false;
        }
        patchFields(parsed.fields);
        showToast("External ID importé", "info");
        return true;
    };

    const fillFromExternalId = async () => {
        const value = externalIdFieldValue.trim();
        if (!value) {
            showToast("Colle un HCAMP External ID dans le champ dédié", "error");
            return false;
        }
        return fillFromExternalIdValue(value);
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
            { searchable: true, searchPlaceholder: "Type first letters (EWB, SGSW...)" }
        );
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

    return (
        <main className="page-container">
            <div className="manage-card external-generator-page">
                <div className="variant-editor-head" style={{ alignItems: "center" }}>
                    <div>
                        <p className="eyebrow">HCAMP</p>
                        <h2>External Generator</h2>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button type="button" className="secondary-btn" onClick={() => navigate("/")}>Back</button>
                    </div>
                </div>

                <div className="external-generator-top-actions">
                    <button
                        type="button"
                        className={`primary-btn clipboard-parse-btn is-${clipboardState}`}
                        onClick={parseClipboardVti}
                    >
                        Paste & Parse VTI (Clipboard)
                    </button>
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
                        <section className="popup-card external-generator-externalid-card">
                            <div className="external-generator-block">
                            <h3>HCAMP External ID</h3>
                            <textarea
                                ref={externalIdFieldRef}
                                className="external-id-field"
                                value={externalIdFieldValue}
                                placeholder="HCAMP External ID (15 segments séparés par //)"
                                onChange={(e) => setExternalIdFieldValue(e.target.value)}
                                onPaste={(e) => {
                                    const pasted = e.clipboardData?.getData("text") ?? "";
                                    if (!pasted) return;
                                    setTimeout(() => {
                                        fillFromExternalIdValue(pasted);
                                    }, 0);
                                }}
                            />
                            <div className="popup-actions" style={{ marginTop: 10 }}>
                                <button type="button" className="secondary-btn" onClick={fillFromExternalId}>
                                    Lire / Remplir depuis le champ
                                </button>
                                <button type="button" className="primary-btn" onClick={generateExternalId}>
                                    Générer
                                </button>
                            </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>

            <PromptModal
                state={promptState}
                onCancel={() => closePrompt(null)}
                onSubmit={(value) => closePrompt(value)}
            />
        </main>
    );
}
