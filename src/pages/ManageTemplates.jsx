import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { loadTemplates, saveTemplates } from "../services/templateService.js";
import { ensureTokensFromTexts } from "../services/tokenService.js";
import { groupTemplates } from "../services/templateService.js";

const emptyTexts = { fr: "", en: "", de: "", it: "" };

function LanguagePreview({ label, dot, value, onChange, onFullscreen }) {
    const [height, setHeight] = useState("auto");

    useEffect(() => {
        const temp = document.createElement("textarea");
        temp.style.visibility = "hidden";
        temp.style.position = "fixed";
        temp.style.height = "auto";
        temp.value = value || "";
        document.body.appendChild(temp);
        temp.style.height = "auto";
        const h = temp.scrollHeight;
        document.body.removeChild(temp);
        setHeight(`${Math.max(160, h)}px`);
    }, [value]);

    return (
        <div className="lang-col">
            <div className="lang-head">
                <span className="lang-dot">{dot}</span>
                <span className="lang-label">{label}</span>
            </div>
            <textarea
                className="plain-editor tall-textarea"
                data-lang={dot.toLowerCase()}
                placeholder={`Text ${dot}`}
                value={value}
                style={{ height }}
                onChange={e => onChange(e.target.value)}
                onClick={(e) => {
                    e.preventDefault();
                    if (onFullscreen) onFullscreen();
                }}
            />
        </div>
    );
}

function TemplateModal({ initial, templates, onClose, onSave }) {
    const isEdit = Boolean(initial);
    const [title, setTitle] = useState(initial?.title || "");
    const [mainVariantName, setMainVariantName] = useState(initial?.mainVariantName || "");
    const [type, setType] = useState(initial?.type || "email");
    const [main, setMain] = useState({
        fr: initial?.text_fr || "",
        en: initial?.text_en || "",
        de: initial?.text_de || "",
        it: initial?.text_it || ""
    });
    const [variants, setVariants] = useState(() => (initial?.variants || []).map(v => ({
        id: v.id || crypto.randomUUID(),
        name: v.name || "",
        text_fr: v.text_fr || "",
        text_en: v.text_en || "",
        text_de: v.text_de || "",
        text_it: v.text_it || ""
    })));
    const [activeTab, setActiveTab] = useState("main");
    const [fullscreen, setFullscreen] = useState(null);
    const [attachedTemplateIds, setAttachedTemplateIds] = useState([]);
    const [detachedVariants, setDetachedVariants] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");

    const activeVariant = variants.find(v => v.id === activeTab);
    const availableTemplates = (templates || []).filter(t =>
        t.id !== initial?.id
        && t.type === type
        && !(t.variants?.length > 0)
        && !attachedTemplateIds.includes(t.id)
    );

    const updateVariantText = (id, key, value) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [key]: value } : v));
    };

    const addVariant = () => {
        const next = {
            id: crypto.randomUUID(),
            name: `Variant ${variants.length + 1}`,
            text_fr: "",
            text_en: "",
            text_de: "",
            text_it: ""
        };
        setVariants(v => [...v, next]);
        setActiveTab(next.id);
    };

    const removeVariant = (id) => {
        setVariants(v => v.filter(x => x.id !== id));
        setActiveTab("main");
    };

    const detachVariant = () => {
        if (activeTab === "main" || !activeVariant) return;
        setVariants(prev => prev.filter(v => v.id !== activeTab));
        setDetachedVariants(prev => ([
            ...prev,
            {
                name: activeVariant.name || "Variant",
                text_fr: activeVariant.text_fr || "",
                text_en: activeVariant.text_en || "",
                text_de: activeVariant.text_de || "",
                text_it: activeVariant.text_it || ""
            }
        ]));
        setActiveTab("main");
    };

    const attachTemplateAsVariant = () => {
        if (!selectedTemplateId) return;
        const tpl = (templates || []).find(t => t.id === selectedTemplateId);
        if (!tpl) return;
        if (activeTab !== "main" && activeVariant) {
            setVariants(prev => prev.map(v => v.id === activeVariant.id ? {
                ...v,
                name: tpl.title || v.name || "Variant",
                text_fr: tpl.text_fr || "",
                text_en: tpl.text_en || "",
                text_de: tpl.text_de || "",
                text_it: tpl.text_it || ""
            } : v));
        } else {
            const newId = crypto.randomUUID();
            setVariants(prev => ([
                ...prev,
                {
                    id: newId,
                    name: tpl.title || "Variant",
                    text_fr: tpl.text_fr || "",
                    text_en: tpl.text_en || "",
                    text_de: tpl.text_de || "",
                    text_it: tpl.text_it || ""
                }
            ]));
            setActiveTab(newId);
        }
        setAttachedTemplateIds(prev => Array.from(new Set([...prev, tpl.id])));
        setSelectedTemplateId("");
    };

    const onSaveClick = async () => {
        if (!title.trim()) {
            alert("Title is required.");
            return;
        }
        const cleanedVariants = variants
            .map(v => ({
                ...v,
                name: v.name ? v.name.trim() : ""
            }))
            .filter(v =>
                v.name !== "" ||
                v.text_fr ||
                v.text_en ||
                v.text_de ||
                v.text_it
            );

        const model = {
            id: initial?.id || crypto.randomUUID(),
            title: title.trim(),
            mainVariantName: mainVariantName.trim(),
            type,
            order: initial?.order || (Number.isFinite(initial?.order) ? initial.order : 0),
            text_fr: main.fr,
            text_en: main.en,
            text_de: main.de,
            text_it: main.it,
            variants: cleanedVariants
        };

        await ensureTokensFromTexts([
            model.text_fr,
            model.text_en,
            model.text_de,
            model.text_it,
            ...cleanedVariants.flatMap(v => [v.text_fr, v.text_en, v.text_de, v.text_it])
        ]);

        onSave(model, { attachedTemplateIds, detachedVariants });
    };

    const renderTabs = () => (
        <div className="variant-tab-bar">
            <div id="variantTabs" className="variant-tabs">
                <button
                    className={`variant-tab ${activeTab === "main" ? "active" : ""}`}
                    data-tab-id="main"
                    onClick={() => setActiveTab("main")}
                >
                    <span className="variant-tab-name">{mainVariantName.trim() || title || "Main text"}</span>
                </button>
                {variants.map((v, idx) => (
                    <button
                        key={v.id}
                        className={`variant-tab ${activeTab === v.id ? "active" : ""}`}
                        data-tab-id={v.id}
                        onClick={() => setActiveTab(v.id)}
                    >
                        <span className="variant-tab-name">{v.name?.trim() || `Variant ${idx + 1}`}</span>
                    </button>
                ))}
            </div>
            <button className="icon-btn add-variant-tab" onClick={addVariant} aria-label="Add a variant">
                +
            </button>
        </div>
    );

    const nameBar = () => (
        <div className="variant-name-bar">
            <div className="variant-name-wrapper">
                {activeTab === "main" ? (
                    <input
                        id="variantNameStatic"
                        type="text"
                        className="variant-name-static"
                        value={mainVariantName}
                        onChange={e => setMainVariantName(e.target.value)}
                        placeholder={title ? `Default: ${title}` : "Main variant name"}
                    />
                ) : (
                    <input
                        type="text"
                        value={activeVariant?.name || ""}
                        onChange={e => {
                            const value = e.target.value;
                            setVariants(prev => prev.map(v => v.id === activeTab ? { ...v, name: value } : v));
                        }}
                        placeholder="Variant name"
                    />
                )}
            </div>
            {activeTab !== "main" && (
                <div className="variant-actions">
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={detachVariant}
                    >
                        Detach to template
                    </button>
                    <button
                        type="button"
                        className="icon-btn variant-remove-icon"
                        onClick={() => removeVariant(activeTab)}
                        aria-label="Delete variant"
                    >
                        <span className="icon-trash" aria-hidden="true"></span>
                    </button>
                </div>
            )}
        </div>
    );

    const linkExistingTemplate = () => (
        <div className="field-line attach-template-field">
            <label>Add existing template as variant</label>
            <div className="attach-template-controls">
                <select
                    value={selectedTemplateId}
                    onChange={e => setSelectedTemplateId(e.target.value)}
                >
                    <option value="">— Select a template —</option>
                    {availableTemplates.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
                <button type="button" className="secondary-btn" onClick={attachTemplateAsVariant} disabled={!selectedTemplateId}>
                    Add
                </button>
            </div>
        </div>
    );

    const langPanel = () => {
        const values = activeTab === "main"
            ? { ...main }
            : {
                fr: activeVariant?.text_fr || "",
                en: activeVariant?.text_en || "",
                de: activeVariant?.text_de || "",
                it: activeVariant?.text_it || ""
            };

        const setValue = (lang, val) => {
            if (activeTab === "main") {
                setMain(prev => ({ ...prev, [lang]: val }));
            } else if (activeVariant) {
                const key = `text_${lang}`;
                updateVariantText(activeVariant.id, key, val);
            }
        };

        const openFullscreen = (langKey) => {
            const items = [
                { key: "fr", label: "French", dot: "FR" },
                { key: "en", label: "English", dot: "EN" },
                { key: "de", label: "German", dot: "DE" },
                { key: "it", label: "Italian", dot: "IT" }
            ];
            const currentIndex = items.findIndex(i => i.key === langKey);
            setFullscreen({
                items,
                index: currentIndex,
                context: activeTab
            });
        };

        return (
            <div className="lang-block">
                <div id="variantLangColumns" className="lang-columns lang-columns-panel">
                <LanguagePreview label="French" dot="FR" value={values.fr} onChange={v => setValue("fr", v)} onFullscreen={() => openFullscreen("fr")} />
                <LanguagePreview label="English" dot="EN" value={values.en} onChange={v => setValue("en", v)} onFullscreen={() => openFullscreen("en")} />
                <LanguagePreview label="German" dot="DE" value={values.de} onChange={v => setValue("de", v)} onFullscreen={() => openFullscreen("de")} />
                <LanguagePreview label="Italian" dot="IT" value={values.it} onChange={v => setValue("it", v)} onFullscreen={() => openFullscreen("it")} />
                </div>
            </div>
        );
    };

    const fullscreenOverlay = () => {
        if (!fullscreen) return null;
        const { items, index, context } = fullscreen;
        const item = items[index];
        const isMain = context === "main";
        const targetVariant = variants.find(v => v.id === context);
        const currentValue = isMain ? main[item.key] : targetVariant ? targetVariant[`text_${item.key}`] || "" : "";

        const setValue = (val) => {
            if (isMain) {
                setMain(prev => ({ ...prev, [item.key]: val }));
            } else if (targetVariant) {
                updateVariantText(targetVariant.id, `text_${item.key}`, val);
            }
        };

        const go = (delta) => {
            const len = items.length;
            const nextIndex = (index + delta + len) % len;
            setFullscreen({ ...fullscreen, index: nextIndex });
        };

        return (
            <div className="lang-fullscreen">
                <button type="button" className="lang-fullscreen__nav lang-fullscreen__nav--prev" onClick={() => go(-1)} aria-label="Previous language">←</button>
                <div className="lang-fullscreen__card">
                    <div className="lang-fullscreen__head">
                        <div>
                            <p className="eyebrow">Fullscreen editor</p>
                            <h3 className="lang-fullscreen__title">{item.label}</h3>
                        </div>
                        <span className="lang-fullscreen__badge">{item.dot}</span>
                    </div>
                    <textarea
                        className="lang-fullscreen__textarea"
                        value={currentValue}
                        onChange={e => setValue(e.target.value)}
                    />
                    <div className="lang-fullscreen__actions">
                        <button type="button" className="primary-btn" data-close-fullscreen onClick={() => setFullscreen(null)}>Done</button>
                    </div>
                </div>
                <button type="button" className="lang-fullscreen__nav lang-fullscreen__nav--next" onClick={() => go(1)} aria-label="Next language">→</button>
            </div>
        );
    };

    return (
        <div className="popup">
            <div className="popup-box popup-box--wide template-config-modal">
                <div className="popup-header">
                    <h2>{isEdit ? "Edit template" : "New template"}</h2>
                </div>

                <div className="popup-grid template-grid">
                    <div className="popup-card popup-card--meta">
                        <div className="modal-section modal-section--meta">
                            <div className="meta-fields-row">
                                <div className="field-line field-line--inline">
                                    <label>Title</label>
                                    <input
                                        value={title}
                                        placeholder="Onboarding email"
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="field-line field-line--type field-line--inline">
                                    <label>Type</label>
                                    <select value={type} onChange={e => setType(e.target.value)}>
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="popup-card popup-card--variants">
                        {renderTabs()}
                        {nameBar()}
                        {activeTab !== "main" && linkExistingTemplate()}
                    </div>

            <div className="popup-card popup-card--langs">
                {langPanel()}
            </div>
        </div>

        <div className="popup-actions">
            <button className="secondary-btn" onClick={onClose}>Cancel</button>
            <button className="primary-btn" onClick={onSaveClick}>Save</button>
        </div>

        {fullscreenOverlay()}
    </div>
</div>
    );
}

export default function ManageTemplates() {
    const [templates, setTemplates] = useState([]);
    const [currentType, setCurrentType] = useState("email");
    const [modalTemplate, setModalTemplate] = useState(null);
    const [draggingId, setDraggingId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);

    useEffect(() => {
        loadTemplates().then(setTemplates);
    }, []);

    const persist = async (next) => {
        setTemplates(next);
        await saveTemplates(next);
    };

    const list = useMemo(() => {
        const grouped = groupTemplates(templates);
        if (currentType === "email") return grouped.email;
        if (currentType === "sms") return grouped.sms;
        return grouped.other;
    }, [templates, currentType]);

    const onDelete = async (id) => {
        if (!confirm("Delete this template?")) return;
        await persist(templates.filter(t => t.id !== id));
    };

    const onSaveTemplate = async (model, changes = {}) => {
        const { attachedTemplateIds = [], detachedVariants = [] } = changes;
        const exists = templates.some(t => t.id === model.id);
        let next = exists
            ? templates.map(t => t.id === model.id ? model : t)
            : [...templates, { ...model, order: templates.length + 1 }];
        if (attachedTemplateIds.length > 0) {
            next = next.filter(t => !attachedTemplateIds.includes(t.id));
        }
        if (detachedVariants.length > 0) {
            const startOrder = next.length;
            const promoted = detachedVariants.map((v, idx) => ({
                id: crypto.randomUUID(),
                title: v.name?.trim() || "Untitled template",
                type: model.type,
                order: startOrder + idx + 1,
                text_fr: v.text_fr || "",
                text_en: v.text_en || "",
                text_de: v.text_de || "",
                text_it: v.text_it || "",
                variants: []
            }));
            next = [...next, ...promoted];
        }
        await persist(next);
        setModalTemplate(null);
    };

    const reorderTemplates = async (dragId, dropId) => {
        if (!dragId || !dropId || dragId === dropId) return;
        const grouped = groupTemplates(templates);
        const currentList = currentType === "email"
            ? grouped.email
            : currentType === "sms"
                ? grouped.sms
                : grouped.other;
        const dragIndex = currentList.findIndex(t => t.id === dragId);
        const dropIndex = currentList.findIndex(t => t.id === dropId);
        if (dragIndex === -1 || dropIndex === -1) return;
        const reordered = [...currentList];
        const [moved] = reordered.splice(dragIndex, 1);
        reordered.splice(dropIndex, 0, moved);
        const next = templates.map(t => {
            const nextIndex = reordered.findIndex(r => r.id === t.id);
            if (nextIndex === -1) return t;
            return { ...t, order: nextIndex + 1 };
        });
        await persist(next);
    };

    return (
        <main className="page-container">
            <div className="manage-card">
                <div className="variant-editor-head" style={{ alignItems: "center" }}>
                    <h1 style={{ margin: 0 }}>Manage Templates</h1>
                    <Link to="/tokens" className="secondary-btn">Manage Tokens</Link>
                </div>

                <div className="segmented-control-managed-models">
                    <div className="segment-group">
                        <button className={`segment ${currentType === "email" ? "active" : ""}`} onClick={() => setCurrentType("email")}>Email</button>
                        <button className={`segment ${currentType === "sms" ? "active" : ""}`} onClick={() => setCurrentType("sms")}>SMS</button>
                        <button className={`segment ${currentType === "other" ? "active" : ""}`} onClick={() => setCurrentType("other")}>Other</button>
                    </div>
                </div>

                <div id="models-list" className="models-list">
                    {list.length === 0 && <p>No template for this type.</p>}
                    {list.map((model) => (
                        <div
                            key={model.id}
                            className={`model-row${dragOverId === model.id ? " drag-over" : ""}${draggingId === model.id ? " dragging" : ""}`}
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setData("text/plain", model.id);
                                setDraggingId(model.id);
                            }}
                            onDragOver={(event) => {
                                event.preventDefault();
                                if (dragOverId !== model.id) setDragOverId(model.id);
                            }}
                            onDragLeave={() => {
                                if (dragOverId === model.id) setDragOverId(null);
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                const dragId = draggingId || event.dataTransfer.getData("text/plain");
                                reorderTemplates(dragId, model.id);
                                setDraggingId(null);
                                setDragOverId(null);
                            }}
                            onDragEnd={() => {
                                setDraggingId(null);
                                setDragOverId(null);
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span className="drag-handle" aria-hidden="true"></span>
                                <span>{model.title}</span>
                                {model.variants?.length > 0 && (
                                    <span className="variant-pill">
                                        {model.variants.length} variant{model.variants.length > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                                <button className="icon-btn edit-btn" onClick={() => setModalTemplate(model)}>
                                    <span className="icon-pencil" aria-hidden="true"></span>
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => onDelete(model.id)}>
                                    <span className="icon-trash" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-btn-container">
                    <button className="primary-btn" onClick={() => setModalTemplate({})}>+ Add Template</button>
                </div>
            </div>

            {modalTemplate !== null && (
                <TemplateModal
                    initial={modalTemplate.id ? modalTemplate : null}
                    templates={templates}
                    onClose={() => setModalTemplate(null)}
                    onSave={onSaveTemplate}
                />
            )}
        </main>
    );
}
