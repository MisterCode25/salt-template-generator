import { useEffect, useMemo, useState, useRef } from "react";
import { loadTokens, ensureTokensFromTexts } from "../services/tokenService.js";
import { loadTemplates, groupTemplates, saveTemplates } from "../services/templateService.js";
import { generateFinalText } from "../core/tokenEngine.js";
import { copyText, showToast } from "../services/clipboardService.js";
import { useNavigate } from "react-router-dom";
import { applyTheme, getInitialTheme, getThemeToggleLabel } from "../utils/theme.js";
import { PARTNER_COLUMNS } from "../data/partnersData.js";
import { loadPartners } from "../services/partnersService.js";
import { partnerMatchesQuery } from "../utils/partnerSearch.js";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Settings from "./Settings.jsx";
import ExternalGenerator from "./ExternalGenerator.jsx";
import ManageTemplates from "./ManageTemplates.jsx";

function DataInputs({
    tokens,
    values,
    setValues,
    onDirty,
    inputErrors,
    inputWarnings,
    onClearTokenDecoration,
    onResetDecorations
}) {
    const handleChange = (token, value) => {
        setValues(prev => {
            const next = { ...prev, [token]: value };
            localStorage.setItem("input_" + token, value);
            return next;
        });
        if (onClearTokenDecoration) onClearTokenDecoration(token);
        if (onDirty) onDirty();
    };

    return (
        <section id="zone-left" className="zone-box">
            <div className="zone-section-header">
                <h3>Data</h3>
                <button
                    id="resetFieldsBtn"
                    className="reset-fields-btn"
                    title="Reset fields"
                    onClick={() => {
                        setValues({});
                        tokens.forEach(t => localStorage.removeItem("input_" + t.token));
                        if (onResetDecorations) onResetDecorations();
                        if (onDirty) onDirty();
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                </button>
            </div>
            <div id="dynamic-inputs" className="inputs-zone">
                {tokens.length === 0 && <EmptyState message="No tokens yet." />}
                {tokens.map(tok => {
                    const stored = values[tok.token] ?? tok.default ?? "";
                    const type = tok.input_type === "number" ? "number" : tok.input_type === "date" ? "date" : "text";
                    return (
                        <div key={tok.id} className="form-field">
                            <label>{tok.label || tok.token}</label>
                            <input
                                data-token={tok.token}
                                className={`${inputErrors?.[tok.token] ? " input-error" : ""}${inputWarnings?.[tok.token] ? " input-warning" : ""}`.trim()}
                                type={type}
                                value={stored}
                                placeholder={tok.token}
                                onChange={e => handleChange(tok.token, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
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
            <div className="flex-row gap-sm">
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
    const mainVariantLabel = model.mainVariantName?.trim() || model.title || "Main text";

    return (
        <Modal onClose={onClose} dialogClassName="popup-box variant-picker" ariaLabel="Variant selection">
                <div className="popup-header">
                    <h2>{model.title}</h2>
                </div>
                <div className="variant-choice-grid">
                    <button className={`primary-btn variant-choice-btn ${typeClass}`} onClick={() => onSelect(null)}>
                        {mainVariantLabel}
                    </button>
                    {model.variants.map(v => (
                        <button key={v.id} className={`primary-btn variant-choice-btn ${typeClass}`} onClick={() => onSelect(v)}>
                            {v.name || "Variant"}
                        </button>
                    ))}
                </div>
                <div className="popup-actions">
                    <button className="secondary-btn" onClick={onClose}>Close</button>
                </div>
        </Modal>
    );
}

function TokenPromptModal({ title, tokenDefs, values, missingTokens, onChange, onConfirm, onClose }) {
    return (
        <Modal onClose={onClose} dialogClassName="popup-box" ariaLabel="Template tokens">
            <div className="popup-header">
                <div>
                    <h2>{title || "Template"}</h2>
                    <p className="hint">Fill required tokens before copying.</p>
                </div>
            </div>
            <div className="popup-grid mt-md">
                {tokenDefs.map((tokenDef) => {
                    const type = tokenDef.input_type === "number"
                        ? "number"
                        : tokenDef.input_type === "date"
                            ? "date"
                            : "text";
                    const hasError = missingTokens.includes(tokenDef.token);
                    return (
                        <div key={tokenDef.token} className="form-field">
                            <label>{tokenDef.label || tokenDef.token}</label>
                            <input
                                type={type}
                                value={values[tokenDef.token] ?? tokenDef.default ?? ""}
                                className={hasError ? "input-error" : ""}
                                placeholder={tokenDef.token}
                                onChange={(e) => onChange(tokenDef.token, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="popup-actions">
                <button className="secondary-btn" onClick={onClose}>Cancel</button>
                <button className="primary-btn" onClick={onConfirm}>Copy text</button>
            </div>
        </Modal>
    );
}

function PartnersModal({ onClose }) {
    const [query, setQuery] = useState("");
    const [selectedKey, setSelectedKey] = useState(null);
    const [partners, setPartners] = useState([]);
    const [loadingPartners, setLoadingPartners] = useState(true);
    const [partnersError, setPartnersError] = useState("");

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoadingPartners(true);
                setPartnersError("");
                const loaded = await loadPartners();
                if (alive) setPartners(loaded);
            } catch (error) {
                if (alive) setPartnersError(error?.message || "Error loading partners");
            } finally {
                if (alive) setLoadingPartners(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const filteredPartners = useMemo(() => {
        const needle = query.trim();
        if (!needle) return partners;

        return partners.filter((partner) => partnerMatchesQuery(partner, needle));
    }, [query, partners]);

    useEffect(() => {
        if (filteredPartners.length === 0) {
            setSelectedKey(null);
            return;
        }
        const firstKey = `${filteredPartners[0]["Firma Entität"]}_${filteredPartners[0]["ALA-P ID"]}`;
        const exists = filteredPartners.some(
            (p) => `${p["Firma Entität"]}_${p["ALA-P ID"]}` === selectedKey
        );
        if (!selectedKey || !exists) {
            setSelectedKey(firstKey);
        }
    }, [filteredPartners, selectedKey]);

    const selectedPartner = useMemo(() => {
        return (
            filteredPartners.find(
                (p) => `${p["Firma Entität"]}_${p["ALA-P ID"]}` === selectedKey
            ) || null
        );
    }, [filteredPartners, selectedKey]);

    const copyPartnerField = async (value, label) => {
        if (!value) return;
        await copyText(String(value), { message: `${label} copied`, variant: "info" });
    };

    const renderValue = (column, value) => {
        const text = (value ?? "").trim();
        if (!text) return <span className="partners-detail-value-text">—</span>;

        const isCopyField = column === "Telefon" || column === "Email";
        if (isCopyField) {
            const entries = text.split(";").map((s) => s.trim()).filter(Boolean);
            return (
                <div className="partners-detail-stack">
                    {entries.map((entry, idx) => (
                        <div key={idx} className="partners-detail-contact-line">
                            <span className="partners-detail-value-text">{entry}</span>
                            <button
                                type="button"
                                className="copy-chip"
                                onClick={() => copyPartnerField(entry, column)}
                            >
                                Copy
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return <span className="partners-detail-value-text">{text}</span>;
    };

    return (
        <Modal onClose={onClose} dialogClassName="popup-box partners-modal" ariaLabel="Partners">
                <div className="popup-header">
                    <div>
                        <h2>Partners</h2>
                        <p className="partners-subtitle">Select a partner to view their full details.</p>
                    </div>
                    <button className="secondary-btn" onClick={onClose}>Close</button>
                </div>

                <input
                    type="text"
                    className="partners-search"
                    placeholder="Search (company, role, email, phone, notes...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="partners-layout">
                    <aside className="partners-list-panel">
                        <div className="partners-list-count">{loadingPartners ? "Loading..." : `${filteredPartners.length} result(s)`}</div>
                        <div className="partners-list">
                            {filteredPartners.map((partner, index) => {
                                const key = `${partner["Firma Entität"]}_${partner["ALA-P ID"]}`;
                                const active = key === selectedKey;
                                return (
                                    <button
                                        key={`${key}_${index}`}
                                        type="button"
                                        className={`partners-list-item${active ? " is-active" : ""}`}
                                        onClick={() => setSelectedKey(key)}
                                    >
                                        <strong>{partner["Firma Entität"] || "No name"}</strong>
                                        <span>{partner["Thema"] || "—"}</span>
                                        <small>{partner["ALA-P ID"] || "—"}</small>
                                    </button>
                                );
                            })}
                            {!loadingPartners && !partnersError && filteredPartners.length === 0 && (
                                <EmptyState message="No partner found." />
                            )}
                            {partnersError && <p className="hint">{partnersError}</p>}
                        </div>
                    </aside>

                    <section className="partners-detail-panel">
                        {selectedPartner ? (
                            <div className="partners-detail-card">
                                <h3>{selectedPartner["Firma Entität"] || "Partner"}</h3>
                                <div className="partners-detail-grid">
                                    {PARTNER_COLUMNS.map((column) => (
                                        <div key={column} className="partners-detail-row">
                                            <div className="partners-detail-label">{column}</div>
                                            <div className="partners-detail-value">
                                                {renderValue(column, selectedPartner[column])}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="hint">Select a partner to see their information.</p>
                        )}
                    </section>
                </div>
        </Modal>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [lang, setLang] = useState("en");
    const [tokens, setTokens] = useState([]);
    const [models, setModels] = useState([]);
    const [values, setValues] = useState({});
    const [inputErrors, setInputErrors] = useState({});
    const [inputWarnings, setInputWarnings] = useState({});
    const [variantPicker, setVariantPicker] = useState(null);
    const [configName, setConfigName] = useState(localStorage.getItem("local_configName") || "No configuration");
    const [empty, setEmpty] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const lastSectionClickVersion = useRef({});
    const inputChangeVersion = useRef(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(() => getInitialTheme());
    const [partnersOpen, setPartnersOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [externalGeneratorOpen, setExternalGeneratorOpen] = useState(false);
    const [externalGeneratorClosing, setExternalGeneratorClosing] = useState(false);
    const [manageTemplatesOpen, setManageTemplatesOpen] = useState(false);
    const [tokenPrompt, setTokenPrompt] = useState(null);
    const [promptMissingTokens, setPromptMissingTokens] = useState([]);

    useEffect(() => {
        loadTokens().then(setTokens);
        loadTemplates().then(setModels);
    }, []);

    useEffect(() => {
        if (tokens.length === 0) return;
        setValues((prev) => {
            const next = { ...prev };
            let changed = false;
            tokens.forEach((tokenDef) => {
                if (next[tokenDef.token] !== undefined) return;
                const stored = localStorage.getItem("input_" + tokenDef.token);
                if (stored !== null) {
                    next[tokenDef.token] = stored;
                    changed = true;
                    return;
                }
                if (tokenDef.default !== undefined) {
                    next[tokenDef.token] = tokenDef.default;
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [tokens]);

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

    const openExternalGenerator = () => {
        setExternalGeneratorClosing(false);
        setExternalGeneratorOpen(true);
    };

    const closeExternalGenerator = () => {
        setExternalGeneratorClosing(true);
        window.setTimeout(() => {
            setExternalGeneratorOpen(false);
            setExternalGeneratorClosing(false);
        }, 220);
    };

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

    const clearInputDecorations = () => {
        setInputErrors({});
        setInputWarnings({});
    };

    const clearTokenDecoration = (token) => {
        setInputErrors((prev) => {
            if (!prev[token]) return prev;
            const next = { ...prev };
            delete next[token];
            return next;
        });
        setInputWarnings((prev) => {
            if (!prev[token]) return prev;
            const next = { ...prev };
            delete next[token];
            return next;
        });
    };

    const collectInputValues = (requiredTokens) => {
        const vals = {};
        const missing = [];
        const set = new Set(requiredTokens || []);
        const nextErrors = {};
        tokens.forEach(t => {
            const stored = values[t.token] ?? t.default ?? "";
            if (set.size === 0 || set.has(t.token)) {
                if (stored === "" || stored === null || stored === undefined) {
                    missing.push(t.token);
                    nextErrors[t.token] = true;
                }
            }
            vals[t.token] = stored;
        });
        setInputErrors(nextErrors);
        return { values: vals, missing };
    };

    const copyModel = async (model, section, baseModel = null, skipPopup = false) => {
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

        const tokenMap = new Map(tokens.map((tokenDef) => [tokenDef.token, tokenDef]));

        // Always verify visible tokens first, before showing any popup
        const visibleTokensNeeded = tokensNeeded.filter(
            (tokenName) => tokenMap.get(tokenName)?.display_mode !== "on_demand"
        );
        if (visibleTokensNeeded.length > 0) {
            const { missing: missingVisible } = collectInputValues(visibleTokensNeeded);
            if (missingVisible.length > 0) {
                showToast("Missing data for: " + missingVisible.join(", "), "error");
                return;
            }
        }

        // Then check on-demand tokens and show popup if needed
        if (!skipPopup) {
            const onDemandNeeded = tokensNeeded
                .filter((tokenName) => tokenMap.get(tokenName)?.display_mode === "on_demand");
            if (onDemandNeeded.length > 0) {
                setPromptMissingTokens([]);
                setTokenPrompt({
                    title: effectiveModel.title,
                    tokenDefs: onDemandNeeded.map((tokenName) => tokenMap.get(tokenName) || {
                        token: tokenName,
                        label: tokenName,
                        input_type: "text"
                    }),
                    effectiveModel,
                    sectionKey
                });
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

        if (warnSameSection && tokensNeeded.length > 0) {
            const nextWarnings = {};
            tokensNeeded.forEach((tokenValue) => {
                const def = tokens.find(t => t.token === tokenValue);
                if (!def || def.default === undefined) {
                    nextWarnings[tokenValue] = true;
                }
            });
            setInputWarnings(nextWarnings);
        } else {
            setInputWarnings({});
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

    const confirmTokenPrompt = async () => {
        if (!tokenPrompt) return;
        const requiredTokens = tokenPrompt.tokenDefs.map((tokenDef) => tokenDef.token);
        const { missing } = collectInputValues(requiredTokens);
        if (missing.length > 0) {
            setPromptMissingTokens(missing);
            showToast("Missing data for: " + missing.join(", "), "error");
            return;
        }
        const { effectiveModel, sectionKey } = tokenPrompt;
        setTokenPrompt(null);
        setPromptMissingTokens([]);
        await copyModel(effectiveModel, sectionKey, null, true);
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
        <main className="page-container page-container--home">
            <header className="app-header">
                <div className="app-title">
                    Salt Templater
                    {configName && configName !== "No configuration" && (
                        <span className="app-title-config"> ({configName})</span>
                    )}
                </div>
                <nav className="top-menu">
                    <div className="segmented-control">
                        <div className="segment-group">
                            {["fr", "en", "de", "it"].map(code => (
                                <button key={code} className={`segment ${lang === code ? "active" : ""}`} data-lang={code} onClick={() => setLang(code)}>
                                    {code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="secondary-btn external-generator-open-btn"
                        onClick={openExternalGenerator}
                    >
                        External Generator
                    </button>
                    <div className="dropdown options-dropdown">
                        <button type="button" className="dropdown-btn" aria-haspopup="menu" aria-expanded={dropdownOpen} onClick={() => setDropdownOpen(o => !o)}>
                            Options ▾
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu is-open" role="menu">
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Management</div>
                                    <button type="button" role="menuitem" onClick={() => { setManageTemplatesOpen(true); setDropdownOpen(false); }} className="dropdown-reset">Manage templates</button>
                                    <button type="button" role="menuitem" onClick={() => { setSettingsOpen(true); setDropdownOpen(false); }} className="dropdown-reset">Settings</button>
                                    <button type="button" role="menuitem" onClick={() => { setPartnersOpen(true); setDropdownOpen(false); }} className="dropdown-reset">Partners</button>
                                </div>
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Tools</div>
                                    <button type="button" role="menuitem" onClick={() => { setHelpOpen(true); setDropdownOpen(false); }} className="dropdown-reset">Help</button>
                                </div>
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Theme</div>
                                    <button type="button" role="menuitem" className={`dropdown-reset${theme === "dark" ? " is-active" : ""}`} onClick={() => { setTheme("dark"); setDropdownOpen(false); }}>Dark</button>
                                    <button type="button" role="menuitem" className={`dropdown-reset${theme === "light" ? " is-active" : ""}`} onClick={() => { setTheme("light"); setDropdownOpen(false); }}>Clear</button>
                                    <button type="button" role="menuitem" className={`dropdown-reset${theme === "salt" ? " is-active" : ""}`} onClick={() => { setTheme("salt"); setDropdownOpen(false); }}>Salt</button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {helpOpen && (
                <Modal onClose={() => setHelpOpen(false)} dialogClassName="popup-box help-modal-box" ariaLabel="Quick guide">
                    <div className="popup-header">
                        <h2>Salt Templater — Quick guide</h2>
                        <button className="secondary-btn" onClick={() => setHelpOpen(false)}>Close</button>
                    </div>
                    <div className="help-modal__section">
                        <h3>What it does</h3>
                        <p>Create emails, SMS, or other messages with reusable templates and fill them with your data instantly.</p>
                    </div>
                    <div className="help-modal__section">
                        <h3>How to use</h3>
                        <ul>
                            <li>Fill the fields in the "Data" column (one field per token like {"{customer_name}"}).</li>
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
                </Modal>
            )}

            {!empty && (
                <div id="zones-grid" className="zones-grid">
                    <DataInputs
                        tokens={tokens.filter(t => t.display_mode !== "on_demand")}
                        values={values}
                        setValues={setValues}
                        onDirty={() => { inputChangeVersion.current++; }}
                        inputErrors={inputErrors}
                        inputWarnings={inputWarnings}
                        onClearTokenDecoration={clearTokenDecoration}
                        onResetDecorations={clearInputDecorations}
                    />

                <section id="email-col" className="zone-box">
                    <h3>Email</h3>
                    <div id="email-container">
                        {grouped.email.length === 0 && <EmptyState message="No email templates yet." />}
                        {grouped.email.map(m => <TemplateButton key={m.id} model={m} onCopy={handleCopy} />)}
                    </div>
                </section>

                <section id="sms-col" className="zone-box">
                    <h3>SMS</h3>
                    <div id="sms-container">
                        {grouped.sms.length === 0 && <EmptyState message="No SMS templates yet." />}
                        {grouped.sms.map(m => <TemplateButton key={m.id} model={m} onCopy={handleCopy} />)}
                    </div>
                </section>

                <section id="other-col" className="zone-box">
                    <h3>Other</h3>
                    <div id="other-container">
                        {grouped.other.length === 0 && <EmptyState message="No other templates yet." />}
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

            {partnersOpen && <PartnersModal onClose={() => setPartnersOpen(false)} />}

            {settingsOpen && (
                <Modal onClose={() => setSettingsOpen(false)} dialogClassName="popup-box settings-modal" ariaLabel="Settings">
                    <Settings
                        embedded
                        onClose={() => setSettingsOpen(false)}
                    />
                </Modal>
            )}

            {tokenPrompt && (
                <TokenPromptModal
                    title={tokenPrompt.title}
                    tokenDefs={tokenPrompt.tokenDefs}
                    values={values}
                    missingTokens={promptMissingTokens}
                    onChange={(token, nextValue) => {
                        setValues((prev) => {
                            const next = { ...prev, [token]: nextValue };
                            localStorage.setItem("input_" + token, nextValue);
                            return next;
                        });
                        clearTokenDecoration(token);
                        setPromptMissingTokens((prev) => prev.filter((name) => name !== token));
                        inputChangeVersion.current++;
                    }}
                    onConfirm={confirmTokenPrompt}
                    onClose={() => {
                        setPromptMissingTokens([]);
                        setTokenPrompt(null);
                    }}
                />
            )}

            {manageTemplatesOpen && (
                <Modal onClose={() => setManageTemplatesOpen(false)} dialogClassName="popup-box manage-templates-modal" ariaLabel="Manage Templates">
                    <ManageTemplates
                        embedded
                        onClose={() => setManageTemplatesOpen(false)}
                        onNavigateTokens={() => {
                            setManageTemplatesOpen(false);
                            navigate("/tokens");
                        }}
                    />
                </Modal>
            )}

            {externalGeneratorOpen && (
                <Modal
                    onClose={closeExternalGenerator}
                    overlayClassName={`popup external-generator-overlay${externalGeneratorClosing ? " is-closing" : ""}`}
                    dialogClassName={`popup-box external-generator-overlay-box${externalGeneratorClosing ? " is-closing" : ""}`}
                    ariaLabel="External Generator"
                >
                    <ExternalGenerator embedded onClose={closeExternalGenerator} />
                </Modal>
            )}

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
