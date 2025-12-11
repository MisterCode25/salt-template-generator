import { useEffect, useMemo, useState, useRef } from "react";
import { loadTokens, ensureTokensFromTexts } from "../services/tokenService.js";
import { loadTemplates, groupTemplates, saveTemplates } from "../services/templateService.js";
import { applyTokens, generateFinalText } from "../core/tokenEngine.js";
import { copyText, showToast } from "../services/clipboardService.js";
import { loadJSON, saveJSON } from "../services/storageService.js";
import { useNavigate } from "react-router-dom";
import { applyTheme, getInitialTheme, getThemeToggleLabel } from "../utils/theme.js";

const CONFIG_SCHEMA_VERSION = 1;

function computeConfigChecksum(serialized) {
    return Array.from(serialized).reduce((sum, ch) => (sum + ch.charCodeAt(0)) % 1000000007, 0);
}

function buildConfigPayload(configName, tokens, models) {
    const meta = {
        configName,
        schemaVersion: CONFIG_SCHEMA_VERSION,
        exportedAt: Date.now(),
        checksum: 0
    };
    const base = { meta, tokens, models };
    const serialized = JSON.stringify({ ...base, meta: { ...meta, checksum: 0 } });
    meta.checksum = computeConfigChecksum(serialized);
    return {
        meta,
        tokens,
        models,
        configName
    };
}

function validateImportedConfig(raw = {}) {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Invalid file shape");
    }
    const tokens = Array.isArray(raw.tokens) ? raw.tokens : [];
    const models = Array.isArray(raw.models) ? raw.models : [];
    const meta = raw.meta || {};
    const configName = meta.configName || raw.configName || "Imported configuration";

    if (meta.schemaVersion && meta.schemaVersion > CONFIG_SCHEMA_VERSION) {
        throw new Error("Unsupported version");
    }

    const serialized = JSON.stringify({
        meta: { ...meta, checksum: 0 },
        tokens,
        models
    });
    if (meta.checksum !== undefined) {
        const computed = computeConfigChecksum(serialized);
        if (computed !== meta.checksum) {
            throw new Error("Checksum mismatch");
        }
    }

    return { tokens, models, configName };
}

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
            <h3>Data</h3>
            <div id="dynamic-inputs" className="inputs-zone">
                {tokens.length === 0 && <p className="hint">Aucun token pour l’instant.</p>}
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
            <button id="resetFieldsBtn" className="reset-fields-btn" onClick={() => {
                setValues({});
                tokens.forEach(t => localStorage.removeItem("input_" + t.token));
                if (onDirty) onDirty();
            }}>Reset fields</button>
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
                    <span className="variant-pill">{model.variants.length} variante{model.variants.length > 1 ? "s" : ""}</span>
                )}
            </div>
            {hasVariants && <span className="variant-caret">▾</span>}
        </button>
    );
}

function VariantModal({ model, onSelect, onClose }) {
    return (
        <div className="popup">
            <div className="popup-box variant-picker">
                <div className="popup-header">
                    <div>
                        <p className="eyebrow">{model.title}</p>
                        <h2>Choisir une variante</h2>
                    </div>
                    <button className="secondary-btn" onClick={onClose}>Fermer</button>
                </div>
                <div className="variant-choice-grid">
                    {model.variants.map(v => (
                        <button key={v.id} className="primary-btn variant-choice-btn" onClick={() => onSelect(v)}>
                            {v.name || "Variante"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [lang, setLang] = useState("fr");
    const [tokens, setTokens] = useState([]);
    const [models, setModels] = useState([]);
    const [values, setValues] = useState({});
    const [variantPicker, setVariantPicker] = useState(null);
    const [configName, setConfigName] = useState(localStorage.getItem("local_configName") || "No configuration");
    const [empty, setEmpty] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const fileInputRef = useRef(null);
    const lastSectionClickVersion = useRef({});
    const inputChangeVersion = useRef(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
            if (!e.target.closest(".dropdown")) {
                setDropdownOpen(false);
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

    const copyModel = async (model, section = "global") => {
        const text = (() => {
            switch (lang) {
                case "fr": return model.text_fr;
                case "en": return model.text_en;
                case "de": return model.text_de;
                case "it": return model.text_it;
                default: return model.text_fr;
            }
        })() || "";
        const tokensNeeded = Array.from(new Set(text.match(/\{[^{}]+\}/g) || []));
        const { values: filled, missing } = collectInputValues(tokensNeeded);
        if (missing.length > 0) {
            showToast("Il manque des données pour : " + missing.join(", "), "error");
            return;
        }
        const warnSameSection = lastSectionClickVersion.current[section] !== undefined
            && lastSectionClickVersion.current[section] === inputChangeVersion.current;

        if (warnSameSection && tokensNeeded.length > 0) {
            const toWarn = tokensNeeded.filter(tokenValue => {
                const def = tokens.find(t => t.token === tokenValue);
                return !def || def.default === undefined;
            });
            highlightInputs(toWarn, "input-warning");
        }

        const map = {};
        Object.entries(filled).forEach(([token, val]) => map[token] = val);
        const finalText = generateFinalText(model, lang, map);
        await copyText(finalText, {
            message: warnSameSection ? "Texte copié (données inchangées)." : "Texte copié",
            variant: warnSameSection ? "warning" : "info"
        });
        lastSectionClickVersion.current[section] = inputChangeVersion.current;
    };

    const handleCopy = (model) => {
        if (model.variants && model.variants.length > 0) {
            setVariantPicker(model);
        } else {
            copyModel(model);
        }
    };

    const exportConfig = async () => {
        const nextName = prompt("Nom de la configuration", configName) || configName;
        setConfigName(nextName);
        localStorage.setItem("local_configName", nextName);
        const payload = buildConfigPayload(nextName, tokens, models);
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${nextName || "config"}.templageConfig`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importConfig = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const { tokens: importedTokens, models: importedModels, configName: importedName } = validateImportedConfig(json);
            await saveJSON("tokens", importedTokens);
            await saveTemplates(importedModels);
            setTokens(importedTokens);
            setModels(importedModels);
            const name = importedName || "Imported configuration";
            localStorage.setItem("local_configName", name);
            setConfigName(name);
            showToast("Configuration importée", "info");
            setEmpty((importedModels || []).length === 0 && (importedTokens || []).length === 0);
        } catch (err) {
            console.error(err);
            showToast("Import échoué", "error");
        }
    };

    const quickCreateTemplate = async () => {
        const sample = {
            id: crypto.randomUUID(),
            title: "Welcome email",
            type: "email",
            order: models.length + 1,
            text_fr: "Bonjour {customer_name}",
            text_en: "Hi {customer_name}",
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
        showToast("Template créé", "info");
    };

    const resetLocal = async () => {
        if (!confirm("Reset all stored data?")) return;
        localStorage.clear();
        setModels([]);
        setTokens([]);
        setValues({});
        setConfigName("No configuration");
        setEmpty(true);
        showToast("Configuration réinitialisée", "warning");
    };

    return (
        <main className="page-container">
            <input ref={fileInputRef} type="file" accept=".templageConfig,application/json" style={{ display: "none" }} onChange={handleFile} />
            <header className="app-header">
                <div className="app-title">Salt Templater</div>
                <nav className="top-menu">
                    <div className="dropdown">
                        <button className="dropdown-btn" onClick={() => setDropdownOpen(o => !o)}>Options ▾</button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Management</div>
                                    <button onClick={() => { navigate("/templates"); setDropdownOpen(false); }} className="dropdown-reset">Manage templates</button>
                                </div>
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Configuration</div>
                                    <button onClick={() => { importConfig(); setDropdownOpen(false); }} className="dropdown-reset">Import configuration</button>
                                    <button onClick={() => { exportConfig(); setDropdownOpen(false); }} className="dropdown-reset">Export configuration</button>
                                    <button onClick={() => {
                                        const name = prompt("Nom de la configuration", configName) || configName;
                                        localStorage.setItem("local_configName", name);
                                        setConfigName(name);
                                    }} className="dropdown-reset">Rename configuration</button>
                                    <button onClick={() => { resetLocal(); setDropdownOpen(false); }} className="reset-btn dropdown-reset">Reset saved data</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        id="themeToggle"
                        className="theme-toggle"
                        aria-label="Toggle theme"
                        onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
                    >
                        {getThemeToggleLabel(theme)}
                    </button>
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
                        <button className="secondary-btn help-modal__close" onClick={() => setHelpOpen(false)}>Fermer</button>
                        <h2>Salt Templater — Quick guide</h2>
                        <div className="help-modal__section">
                            <h3>What it does</h3>
                            <p>Create emails, SMS, or other messages with reusable templates and fill them with your data instantly.</p>
                        </div>
                        <div className="help-modal__section">
                            <h3>How to use</h3>
                            <ul>
                                <li>Fill the fields in the “Data” column (one field per token comme {"{customer_name}"}).</li>
                                <li>Pick a language (FR / EN / DE / IT).</li>
                                <li>Click a template button to copy the final text (copy is blocked if required data is missing).</li>
                            </ul>
                        </div>
                        <div className="help-modal__section">
                            <h3>Manage templates</h3>
                            <ul>
                                <li>Options → Manage Templates pour créer/éditer vos modèles.</li>
                                <li>Chaque modèle a un titre, un type (Email/SMS/Other) et un texte par langue.</li>
                                <li>Ajoutez des variantes pour proposer plusieurs versions d’un modèle.</li>
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
                        {grouped.email.length === 0 && <p className="hint">Aucun template email.</p>}
                        {grouped.email.map(m => <TemplateButton key={m.id} model={m} onCopy={handleCopy} />)}
                    </div>
                </section>

                <section id="sms-col" className="zone-box">
                    <h3>SMS</h3>
                    <div id="sms-container">
                        {grouped.sms.length === 0 && <p className="hint">Aucun template SMS.</p>}
                        {grouped.sms.map(m => <TemplateButton key={m.id} model={m} onCopy={handleCopy} />)}
                    </div>
                </section>

                <section id="other-col" className="zone-box">
                    <h3>Other</h3>
                    <div id="other-container">
                        {grouped.other.length === 0 && <p className="hint">Aucun template Other.</p>}
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
                        copyModel(variant, "variant");
                        setVariantPicker(null);
                    }}
                />
            )}

            <div id="configBadge" className="config-badge">{configName}</div>
            <button id="helpBtn" className="help-btn" onClick={() => setHelpOpen(true)}>?</button>

            {empty && (
                <section id="emptyState" className="empty-state">
                    <div className="empty-card">
                        <p className="eyebrow">Get started</p>
                        <h2>No configuration yet</h2>
                        <p className="empty-text">Create your first template to unlock the workspace. You can always import an existing configuration later.</p>
                        <div className="empty-actions">
                            <button className="primary-btn" onClick={() => quickCreateTemplate()}>Create template</button>
                            <button className="secondary-btn" onClick={() => importConfig()}>Import configuration</button>
                            <button className="secondary-btn help-link-btn" onClick={() => setHelpOpen(true)}>How it works</button>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
