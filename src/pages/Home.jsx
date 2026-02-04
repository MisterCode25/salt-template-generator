import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { loadTokens, ensureTokensFromTexts, saveTokens } from "../services/tokenService.js";
import { loadTemplates, groupTemplates, saveTemplates } from "../services/templateService.js";
import { applyTokens, generateFinalText } from "../core/tokenEngine.js";
import { copyText, showToast } from "../services/clipboardService.js";
import { loadJSON, saveJSON } from "../services/storageService.js";
import { useNavigate } from "react-router-dom";
import { applyTheme, getInitialTheme, getThemeToggleLabel, getNextTheme } from "../utils/theme.js";
import { parseClipboard, applyParsedToTokenValues } from "../utils/clipboardParser.js";
import { AUTOFILL_ENABLED } from "../utils/featureFlags.js";

function highlightInputs(tokens = [], className = "input-warning") {
    tokens.forEach(token => {
        const field = document.querySelector(`[data-token="${token}"]`);
        if (field) {
            field.classList.add(className);
        }
    });
}
function DataInputs({ tokens, setTokens, values, setValues, onDirty }) {
    const applyClipboardText = (text) => {
        const parsed = parseClipboard(text);
        const { nextValues, applied, unmapped } = applyParsedToTokenValues(parsed, tokens, values);
        const appliedTokens = applied.map(a => a.token);
        if (appliedTokens.length > 0) {
            setValues(nextValues);
            appliedTokens.forEach(tokenKey => {
                localStorage.setItem("input_" + tokenKey, nextValues[tokenKey]);
            });
            if (onDirty) onDirty();
            showToast("Fields filled from clipboard", "info");
        }
        const availableTokens = (tokens || []).filter(t => !t.key);
        const filteredUnmapped = unmapped.filter(kv => !ignoredKeys.includes(kv.key));
        if (filteredUnmapped.length > 0 && availableTokens.length > 0) {
            setPendingMappings(filteredUnmapped);
            setMappingSelections({});
            setMappingOpen(true);
        } else if (appliedTokens.length === 0) {
            showToast("No matching keys found", "warning");
        }
    };

    const [clipboardParsable, setClipboardParsable] = useState(false);
    const [lastPastedText, setLastPastedText] = useState("");
    const [mappingOpen, setMappingOpen] = useState(false);
    const [pendingMappings, setPendingMappings] = useState([]);
    const [mappingSelections, setMappingSelections] = useState({});
    const [ignoredKeys, setIgnoredKeys] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("ignored_token_keys") || "[]");
        } catch {
            return [];
        }
    });
    const persistIgnoredKeys = (next) => {
        setIgnoredKeys(next);
        localStorage.setItem("ignored_token_keys", JSON.stringify(next));
    };
    const tokensRef = useRef(tokens);
    const valuesRef = useRef(values);

    useEffect(() => {
        tokensRef.current = tokens;
    }, [tokens]);

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);

    const checkClipboardParsable = async () => {
        if (!AUTOFILL_ENABLED) return;
        try {
            const text = await navigator.clipboard.readText();
            const parsed = parseClipboard(text);
            const hasPairs = (parsed.keyValues || []).length > 0 || parsed.ticketNumber || parsed.mobileNumber;
            setClipboardParsable(Boolean(hasPairs));
        } catch (e) {
            if (lastPastedText) {
                const parsed = parseClipboard(lastPastedText);
                const hasPairs = (parsed.keyValues || []).length > 0 || parsed.ticketNumber || parsed.mobileNumber;
                setClipboardParsable(Boolean(hasPairs));
            } else {
                setClipboardParsable(false);
            }
        }
    };

    const handleAutoFill = async () => {
        if (!AUTOFILL_ENABLED) {
            showToast("Auto fill is temporarily unavailable", "warning");
            return;
        }
        try {
            let text = "";
            try {
                text = await navigator.clipboard.readText();
            } catch {
                text = lastPastedText;
            }
            if (!text) {
                showToast("Paste the content (Cmd+V) then try again", "warning");
                return;
            }
            applyClipboardText(text);
            await checkClipboardParsable();
        } catch (e) {
            showToast("Unable to read clipboard", "error");
        }
    };

    useEffect(() => {
        if (!AUTOFILL_ENABLED) return undefined;
        checkClipboardParsable();
        const onFocus = () => checkClipboardParsable();
        const onVisibility = () => {
            if (!document.hidden) checkClipboardParsable();
        };
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    useEffect(() => {
        if (!AUTOFILL_ENABLED) return undefined;
        const onPaste = (e) => {
            const pasted = e.clipboardData?.getData("text/plain") || "";
            if (pasted) {
                setLastPastedText(pasted);
                const parsed = parseClipboard(pasted);
                const hasPairs = (parsed.keyValues || []).length > 0 || parsed.ticketNumber || parsed.mobileNumber;
                setClipboardParsable(Boolean(hasPairs));
            }
        };
        window.addEventListener("paste", onPaste);
        return () => window.removeEventListener("paste", onPaste);
    }, []);

    const handleChange = (token, value) => {
        setValues(prev => {
            const next = { ...prev, [token]: value };
            localStorage.setItem("input_" + token, value);
            return next;
        });
        if (onDirty) onDirty();
    };

    return (
        <section id="zone-left" className="zone-box">
            <h3>Data</h3>
            <div id="dynamic-inputs" className="inputs-zone">
                {tokens.length === 0 && <p className="hint">No tokens yet.</p>}
                {tokens.map(tok => {
                    const stored = values[tok.token] ?? localStorage.getItem("input_" + tok.token) ?? tok.default ?? "";
                    const type = tok.input_type === "number" ? "number" : tok.input_type === "date" ? "date" : "text";
                    return (
                        <div key={tok.id} className="form-field">
                            <label>{tok.label || tok.token}</label>
                            <input
                                data-token={tok.token}
                                type={type}
                                value={stored}
                                placeholder={tok.token}
                                onChange={e => handleChange(tok.token, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="data-actions-row">
                {!AUTOFILL_ENABLED && (
                    <p className="hint">Auto fill is temporarily unavailable.</p>
                )}
                {AUTOFILL_ENABLED && clipboardParsable && (
                    <button
                        type="button"
                        className="autofill-btn"
                        onMouseEnter={checkClipboardParsable}
                        onFocus={checkClipboardParsable}
                        onClick={handleAutoFill}
                    >
                        Auto fill
                    </button>
                )}
                <button id="resetFieldsBtn" className="reset-fields-btn" onClick={() => {
                    setValues({});
                    tokens.forEach(t => localStorage.removeItem("input_" + t.token));
                    if (onDirty) onDirty();
                    checkClipboardParsable();
                }}>Reset fields</button>
            </div>

            {mappingOpen && typeof document !== "undefined" && createPortal(
                <div className="popup">
                    <div className="popup-box popup-box--wide">
                        <div className="popup-header">
                            <div>
                                <p className="eyebrow">Auto fill</p>
                                <h2>Detected keys</h2>
                                <p className="hint">Match each key to an unmapped token.</p>
                            </div>
                            <button className="secondary-btn" onClick={() => setMappingOpen(false)}>Close</button>
                        </div>

                        <div className="popup-grid">
                            {pendingMappings.map((kv, idx) => {
                                const options = (tokens || []).filter(t => !t.key);
                                const selectionKey = `${kv.key}_${idx}`;
                                return (
                                    <div key={selectionKey} className="popup-card">
                                        <div className="field-line">
                                            <label>{kv.rawKey}</label>
                                            <div className="hint" style={{ whiteSpace: "pre-wrap" }}>{kv.value}</div>
                                            <select
                                                value={mappingSelections[selectionKey] || ""}
                                                onChange={(e) => setMappingSelections(prev => ({ ...prev, [selectionKey]: e.target.value }))}
                                            >
                                                <option value="">— Select a token —</option>
                                                {options.map(t => (
                                                    <option key={t.id} value={t.id}>{t.label || t.token}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="popup-actions">
                            <button
                                className="secondary-btn"
                                onClick={() => {
                                    const nextIgnored = Array.from(new Set([
                                        ...ignoredKeys,
                                        ...pendingMappings.map(kv => kv.key)
                                    ]));
                                    persistIgnoredKeys(nextIgnored);
                                    setMappingOpen(false);
                                    showToast("Keys ignored for next pastes", "info");
                                }}
                            >
                                Ignore
                            </button>
                            <button
                                className="primary-btn"
                                onClick={async () => {
                                    const nextTokens = [...tokens];
                                    const idToToken = new Map(nextTokens.map(t => [t.id, t]));
                                    pendingMappings.forEach((kv, idx) => {
                                        const selectionKey = `${kv.key}_${idx}`;
                                        const id = mappingSelections[selectionKey];
                                        if (!id) return;
                                        const tok = idToToken.get(id);
                                        if (!tok) return;
                                        tok.key = kv.rawKey;
                                    });
                                    setTokens(nextTokens);
                                    await saveTokens(nextTokens);
                                    setMappingOpen(false);
                                    showToast("Keys saved", "info");
                                    const clipboardText = await navigator.clipboard.readText();
                                    applyClipboardText(clipboardText);
                                }}
                            >
                                Save mapping and apply
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}

function TemplateButton({ model, onCopy }) {
    const hasVariants = model.variants && model.variants.length > 0;

    return (
        <button
            className={`primary-btn ${hasVariants ? "has-variants" : ""}`}
            onClick={() => onCopy(model)}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{model.title}</span>
                {hasVariants && (
                    <span className="variant-pill">{model.variants.length} variant{model.variants.length > 1 ? "s" : ""}</span>
                )}
            </div>
            {hasVariants && <span className="variant-caret">▾</span>}
        </button>
    );
}

function VariantModal({ model, onSelect, onClose }) {
    const typeClass = model.type ? `template-type-${model.type}` : "";

    return (
        <div className="popup">
            <div className="popup-box variant-picker">
                <div className="popup-header">
                    <div>
                        <p className="eyebrow">{model.title}</p>
                        <h2>Choose a variant</h2>
                    </div>
                    <button className="secondary-btn" onClick={onClose}>Close</button>
                </div>
                <div className="variant-choice-grid">
                    <button className={`primary-btn variant-choice-btn ${typeClass}`} onClick={() => onSelect(null)}>
                        {model.title || "Main text"}
                    </button>
                    {model.variants.map(v => (
                        <button key={v.id} className={`primary-btn variant-choice-btn ${typeClass}`} onClick={() => onSelect(v)}>
                            {v.name || "Variant"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [lang, setLang] = useState("en");
    const [tokens, setTokens] = useState([]);
    const [models, setModels] = useState([]);
    const [values, setValues] = useState({});
    const [variantPicker, setVariantPicker] = useState(null);
    const [configName, setConfigName] = useState(localStorage.getItem("local_configName") || "No configuration");
    const [empty, setEmpty] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const lastSectionClickVersion = useRef({});
    const inputChangeVersion = useRef(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(() => getInitialTheme());

    useEffect(() => {
        loadTokens().then(setTokens);
        loadTemplates().then(setModels);
    }, []);

    const grouped = useMemo(() => groupTemplates(models), [models]);

    useEffect(() => {
        const hasTemplates = models.length > 0;
        const hasTokens = tokens.length > 0;
        setEmpty(!hasTemplates && !hasTokens);
    }, [models, tokens]);

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest(".options-dropdown")) {
                setDropdownOpen(false);
            }
            if (!e.target.closest(".theme-dropdown")) {
                setThemeDropdownOpen(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        if (!helpOpen) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") {
                setHelpOpen(false);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [helpOpen]);

    const getTextByLang = (model, langCode) => {
        switch (langCode) {
            case "fr": return model?.text_fr ?? "";
            case "en": return model?.text_en ?? "";
            case "de": return model?.text_de ?? "";
            case "it": return model?.text_it ?? "";
            default: return model?.text_fr ?? "";
        }
    };

    const resolveVariantModel = (base, variant) => {
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
    };

    const collectInputValues = (requiredTokens) => {
        const vals = {};
        const missing = [];
        const set = new Set(requiredTokens || []);
        tokens.forEach(t => {
            const stored = values[t.token] ?? localStorage.getItem("input_" + t.token) ?? t.default ?? "";
            if (set.size === 0 || set.has(t.token)) {
                if (stored === "" || stored === null || stored === undefined) {
                    missing.push(t.token);
                }
            }
            vals[t.token] = stored;
            const field = document.querySelector(`[data-token="${t.token}"]`);
            if (field) {
                field.classList.remove("input-warning");
                field.classList.remove("input-error");
                if (missing.includes(t.token)) {
                    field.classList.add("input-error");
                }
                field.addEventListener("input", () => {
                    field.classList.remove("input-warning");
                    field.classList.remove("input-error");
                    inputChangeVersion.current++;
                }, { once: true });
            }
        });
        return { values: vals, missing };
    };

    const copyModel = async (model, section, baseModel = null) => {
        const sectionKey = section || model?.type || "global";
        const effectiveModel = baseModel ? resolveVariantModel(baseModel, model) : model;
        const text = getTextByLang(effectiveModel, lang) || "";
        const tokensNeeded = Array.from(new Set(text.match(/\{[^{}]+\}/g) || []));
        if (tokensNeeded.length === 0) {
            const finalText = generateFinalText(effectiveModel, lang, {});
            await copyText(finalText, { message: "Text copied", variant: "info" });
            lastSectionClickVersion.current[sectionKey] = inputChangeVersion.current;
            return;
        }
        const { values: filled, missing } = collectInputValues(tokensNeeded);
        if (missing.length > 0) {
            showToast("Missing data for: " + missing.join(", "), "error");
            return;
        }
        const warnSameSection = lastSectionClickVersion.current[sectionKey] !== undefined
            && lastSectionClickVersion.current[sectionKey] === inputChangeVersion.current;

        if (warnSameSection && tokensNeeded.length > 0) {
            const toWarn = tokensNeeded.filter(tokenValue => {
                const def = tokens.find(t => t.token === tokenValue);
                return !def || def.default === undefined;
            });
            highlightInputs(toWarn, "input-warning");
        }

        const map = {};
        Object.entries(filled).forEach(([token, val]) => map[token] = val);
        const finalText = generateFinalText(effectiveModel, lang, map);
        await copyText(finalText, {
            message: warnSameSection ? "Text copied (data unchanged)." : "Text copied",
            variant: warnSameSection ? "warning" : "info"
        });
        lastSectionClickVersion.current[sectionKey] = inputChangeVersion.current;
    };

    const handleCopy = (model) => {
        if (model.variants && model.variants.length > 0) {
            setVariantPicker(model);
        } else {
            copyModel(model, `model_${model.id}`);
        }
    };

    const quickCreateTemplate = async () => {
        const sample = {
            id: crypto.randomUUID(),
            title: "Welcome email",
            type: "email",
            order: models.length + 1,
            text_fr: "Hello {customer_name}",
            text_en: "Hello {customer_name}",
            text_de: "Hallo {customer_name}",
            text_it: "Ciao {customer_name}",
            variants: []
        };
        const next = [...models, sample];
        await saveTemplates(next);
        await ensureTokensFromTexts([sample.text_fr, sample.text_en, sample.text_de, sample.text_it]);
        const refreshedTokens = await loadTokens();
        setTokens(refreshedTokens);
        setModels(next);
        setEmpty(false);
        showToast("Template created", "info");
    };

    return (
        <main className="page-container">
            <header className="app-header">
                <div className="app-title">Salt Templater</div>
                <nav className="top-menu">
                    <div className="dropdown options-dropdown">
                        <button className="dropdown-btn" onClick={() => setDropdownOpen(o => !o)}>Options ▾</button>
                        {dropdownOpen && (
                            <div className="dropdown-menu is-open">
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Management</div>
                                    <button onClick={() => { navigate("/templates"); setDropdownOpen(false); }} className="dropdown-reset">Manage templates</button>
                                    <button onClick={() => { navigate("/settings"); setDropdownOpen(false); }} className="dropdown-reset">Settings</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="dropdown theme-dropdown">
                        <button
                            id="themeToggle"
                            className="theme-toggle"
                            aria-label="Toggle theme"
                            onClick={() => setThemeDropdownOpen(o => !o)}
                        >
                            {getThemeToggleLabel(theme)} Theme ▾
                        </button>
                        {themeDropdownOpen && (
                            <div className="dropdown-menu is-open">
                                <button
                                    className="dropdown-reset"
                                    onClick={() => { setTheme("dark"); setThemeDropdownOpen(false); }}
                                >
                                    Dark
                                </button>
                                <button
                                    className="dropdown-reset"
                                    onClick={() => { setTheme("light"); setThemeDropdownOpen(false); }}
                                >
                                    Clear
                                </button>
                                <button
                                    className="dropdown-reset"
                                    onClick={() => { setTheme("salt"); setThemeDropdownOpen(false); }}
                                >
                                    Salt
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="segmented-control">
                    <div className="segment-group">
                        {["fr", "en", "de", "it"].map(code => (
                            <button
                                key={code}
                                className={`segment ${lang === code ? "active" : ""}`}
                                data-lang={code}
                                onClick={() => setLang(code)}
                            >
                                {code.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {helpOpen && (
                <div
                    id="helpModal"
                    className="help-modal"
                    aria-hidden="false"
                    onClick={(e) => { if (e.target === e.currentTarget) setHelpOpen(false); }}
                >
                    <div className="help-modal__content">
                        <button className="secondary-btn help-modal__close" onClick={() => setHelpOpen(false)}>Close</button>
                        <h2>Salt Templater — Quick guide</h2>
                        <div className="help-modal__section">
                            <h3>What it does</h3>
                            <p>Create emails, SMS, or other messages with reusable templates and fill them with your data instantly.</p>
                        </div>
                        <div className="help-modal__section">
                            <h3>How to use</h3>
                            <ul>
                                <li>Fill the fields in the “Data” column (one field per token like {"{customer_name}"}).</li>
                                <li>Pick a language (FR / EN / DE / IT).</li>
                                <li>Click a template button to copy the final text (copy is blocked if required data is missing).</li>
                            </ul>
                        </div>
                        <div className="help-modal__section">
                            <h3>Manage templates</h3>
                            <ul>
                                <li>Options → Manage Templates to create/edit your models.</li>
                                <li>Each model has a title, a type (Email/SMS/Other) and text per language.</li>
                                <li>Add variants to provide multiple versions of a model.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {!empty && (
                <div id="zones-grid" className="zones-grid">
                    <DataInputs tokens={tokens} setTokens={setTokens} values={values} setValues={setValues} onDirty={() => { inputChangeVersion.current++; }} />

                <section id="email-col" className="zone-box">
                    <h3>Email</h3>
                    <div id="email-container">
                        {grouped.email.length === 0 && <p className="hint">No email templates.</p>}
                        {grouped.email.map(m => <TemplateButton key={m.id} model={m} onCopy={handleCopy} />)}
                    </div>
                </section>

                <section id="sms-col" className="zone-box">
                    <h3>SMS</h3>
                    <div id="sms-container">
                        {grouped.sms.length === 0 && <p className="hint">No SMS templates.</p>}
                        {grouped.sms.map(m => <TemplateButton key={m.id} model={m} onCopy={handleCopy} />)}
                    </div>
                </section>

                <section id="other-col" className="zone-box">
                    <h3>Other</h3>
                    <div id="other-container">
                        {grouped.other.length === 0 && <p className="hint">No Other templates.</p>}
                        {grouped.other.map(m => <TemplateButton key={m.id} model={m} onCopy={handleCopy} />)}
                    </div>
                </section>
                </div>
            )}

            {variantPicker && (
                <VariantModal
                    model={variantPicker}
                    onClose={() => setVariantPicker(null)}
                    onSelect={(variant) => {
                        if (variant) {
                            copyModel(variant, `variant_${variantPicker.id}_${variant.id}`, variantPicker);
                        } else {
                            copyModel(variantPicker, `main_${variantPicker.id}`);
                        }
                        setVariantPicker(null);
                    }}
                />
            )}

            <div id="configBadge" className="config-badge">{configName}</div>
            <div id="versionBadge" className="version-badge">V2.5</div>

            {empty && (
                <section id="emptyState" className="empty-state">
                    <div className="empty-card">
                        <p className="eyebrow">Get started</p>
                        <h2>No configuration yet</h2>
                        <p className="empty-text">Create your first template to unlock the workspace. You can always import an existing configuration later.</p>
                        <div className="empty-actions">
                            <button className="primary-btn" onClick={() => quickCreateTemplate()}>Create template</button>
                            <button className="secondary-btn" onClick={() => navigate("/settings")}>Import configuration</button>
                            <button className="secondary-btn help-link-btn" onClick={() => setHelpOpen(true)}>How it works</button>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
