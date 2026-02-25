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
import ManageTemplates from "./ManageTemplates.jsx";
import Settings from "./Settings.jsx";

function highlightInputs(tokens = [], className = "input-warning") {
    tokens.forEach(token => {
        const field = document.querySelector(`[data-token="${token}"]`);
        if (field) {
            field.classList.add(className);
        }
    });
}
function DataInputs({ tokens, values, setValues, onDirty }) {
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
            <div className="zone-section-header">
                <h3>Data</h3>
                <button
                    id="resetFieldsBtn"
                    className="reset-fields-btn"
                    title="Reset fields"
                    onClick={() => {
                        setValues({});
                        tokens.forEach(t => localStorage.removeItem("input_" + t.token));
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
    const mainVariantLabel = model.mainVariantName?.trim() || model.title || "Main text";

    return (
        <div className="popup" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="popup-box variant-picker">
                <div className="popup-header">
                    <div>
                        <h2>{model.title}</h2>
                    </div>
                    <button className="secondary-btn" onClick={onClose}>Close</button>
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
            </div>
        </div>
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
                if (alive) setPartnersError(error?.message || "Erreur de chargement des partenaires");
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
        await copyText(String(value), { message: `${label} copié`, variant: "info" });
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
                                Copier
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return <span className="partners-detail-value-text">{text}</span>;
    };

    return (
        <div className="popup" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="popup-box partners-modal">
                <div className="popup-header">
                    <div>
                        <h2>Partenaires</h2>
                        <p className="partners-subtitle">Choisis un partenaire pour afficher sa fiche complète en grand.</p>
                    </div>
                    <button className="secondary-btn" onClick={onClose}>Fermer</button>
                </div>

                <input
                    type="text"
                    className="partners-search"
                    placeholder="Rechercher (société, rôle, email, téléphone, remarque...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="partners-layout">
                    <aside className="partners-list-panel">
                        <div className="partners-list-count">{loadingPartners ? "Chargement..." : `${filteredPartners.length} résultat(s)`}</div>
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
                                        <strong>{partner["Firma Entität"] || "Sans nom"}</strong>
                                        <span>{partner["Thema"] || "—"}</span>
                                        <small>{partner["ALA-P ID"] || "—"}</small>
                                    </button>
                                );
                            })}
                            {!loadingPartners && !partnersError && filteredPartners.length === 0 && (
                                <p className="hint">Aucun partenaire trouvé.</p>
                            )}
                            {partnersError && <p className="hint">{partnersError}</p>}
                        </div>
                    </aside>

                    <section className="partners-detail-panel">
                        {selectedPartner ? (
                            <div className="partners-detail-card">
                                <h3>{selectedPartner["Firma Entität"] || "Partenaire"}</h3>
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
                            <p className="hint">Sélectionne un partenaire pour voir ses informations.</p>
                        )}
                    </section>
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
    const [partnersOpen, setPartnersOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [manageTemplatesOpen, setManageTemplatesOpen] = useState(false);

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
        <main className="page-container page-container--home">
            <header className="app-header">
                <div className="app-title">
                    Salt Templater
                    {configName && configName !== "No configuration" && (
                        <span className="app-title-config"> ({configName})</span>
                    )}
                </div>
                <nav className="top-menu">
                    <div className="dropdown options-dropdown">
                        <button className="dropdown-btn" onClick={() => setDropdownOpen(o => !o)}>Options ▾</button>
                        {dropdownOpen && (
                            <div className="dropdown-menu is-open">
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Management</div>
                                    <button onClick={() => { setManageTemplatesOpen(true); setDropdownOpen(false); }} className="dropdown-reset">Manage templates</button>
                                    <button onClick={() => { setSettingsOpen(true); setDropdownOpen(false); }} className="dropdown-reset">Settings</button>
                                    <button onClick={() => { setPartnersOpen(true); setDropdownOpen(false); }} className="dropdown-reset">Partenaires</button>
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
                    </div>
                </div>
            )}

            {!empty && (
                <div id="zones-grid" className="zones-grid">
                    <DataInputs tokens={tokens} values={values} setValues={setValues} onDirty={() => { inputChangeVersion.current++; }} />

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

            {partnersOpen && <PartnersModal onClose={() => setPartnersOpen(false)} />}

            {settingsOpen && (
                <div className="popup" onClick={(e) => { if (e.target === e.currentTarget) setSettingsOpen(false); }}>
                    <div className="popup-box popup-box--wide" onClick={(e) => e.stopPropagation()}>
                        <Settings embedded onClose={() => setSettingsOpen(false)} />
                    </div>
                </div>
            )}

            {manageTemplatesOpen && (
                <div className="popup" onClick={(e) => { if (e.target === e.currentTarget) setManageTemplatesOpen(false); }}>
                    <div className="popup-box popup-box--wide" onClick={(e) => e.stopPropagation()}>
                        <ManageTemplates
                            embedded
                            onClose={() => setManageTemplatesOpen(false)}
                            onNavigateTokens={() => {
                                setManageTemplatesOpen(false);
                                navigate("/tokens");
                            }}
                        />
                    </div>
                </div>
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
