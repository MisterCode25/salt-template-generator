import { useEffect, useRef, useState } from "react";
import { loadTools, saveTools } from "../services/toolsService.js";
import { loadTokens } from "../services/tokenService.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { showToast } from "../services/clipboardService.js";

function ToolModal({ initial, onClose, onSave }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [url, setUrl] = useState(initial?.url || "");
    const [tokens, setTokens] = useState([]);
    const urlRef = useRef(null);

    useEffect(() => {
        loadTokens().then(setTokens);
    }, []);

    const insertToken = (token) => {
        const el = urlRef.current;
        if (!el) {
            setUrl((prev) => prev + token);
            return;
        }
        const start = el.selectionStart ?? url.length;
        const end = el.selectionEnd ?? url.length;
        const next = url.slice(0, start) + token + url.slice(end);
        setUrl(next);
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(start + token.length, start + token.length);
        });
    };

    const handleSave = () => {
        const t = title.trim();
        const u = url.trim();
        if (!t) { showToast("Title is required.", "error"); return; }
        if (!u) { showToast("URL is required.", "error"); return; }
        onSave({ ...initial, title: t, url: u });
    };

    return (
        <Modal onClose={onClose} ariaLabel="Tool editor">
            <div className="popup-header">
                <h2>{initial?.id ? "Edit tool" : "New tool"}</h2>
            </div>

            <div className="popup-grid">
                <div className="popup-card">
                    <div className="field-line">
                        <label>Button label</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Axiros, NetCracker…"
                            autoFocus
                        />
                    </div>

                    <div className="field-line">
                        <label>URL (use {"{token}"} for dynamic values)</label>
                        <input
                            ref={urlRef}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com?id={client_id}"
                            className="tools-url-input"
                        />
                    </div>

                    {tokens.length > 0 && (
                        <div className="field-line">
                            <label>Insert token</label>
                            <div className="tools-token-chips">
                                {tokens.map((tok) => (
                                    <button
                                        key={tok.id}
                                        type="button"
                                        className="tools-token-chip"
                                        onClick={() => insertToken(tok.token)}
                                        title={tok.label || tok.token}
                                    >
                                        {tok.token}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {url && (
                        <div className="field-line">
                            <label>URL preview</label>
                            <code className="tools-url-preview">{url}</code>
                        </div>
                    )}
                </div>
            </div>

            <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                <button type="button" className="primary-btn" onClick={handleSave}>Save</button>
            </div>
        </Modal>
    );
}

export default function ManageTools() {
    const [tools, setTools] = useState([]);
    const [modalTool, setModalTool] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        loadTools().then(setTools);
    }, []);

    const persist = async (next) => {
        setTools(next);
        await saveTools(next);
        window.dispatchEvent(new CustomEvent("tools-updated"));
    };

    const onSave = async (tool) => {
        let next;
        if (tool.id) {
            next = tools.map((t) => (t.id === tool.id ? tool : t));
        } else {
            next = [...tools, { ...tool, id: crypto.randomUUID(), order: tools.length + 1 }];
        }
        await persist(next);
        setModalTool(null);
    };

    const onDelete = async () => {
        if (!confirmDelete) return;
        await persist(tools.filter((t) => t.id !== confirmDelete));
        setConfirmDelete(null);
    };

    return (
        <main className="page-container">
            <div className="manage-card">
                <div className="variant-editor-head">
                    <div>
                        <p className="eyebrow">Quick tools</p>
                        <h2>Manage Tools</h2>
                    </div>
                </div>

                <p className="manage-tools-desc">
                    Add URL-based tools that appear in the tools bar on the main page.
                    Use <code>{"{token}"}</code> placeholders in the URL to inject client data.
                </p>

                <div className="models-list">
                    {tools.length === 0 && <EmptyState message="No tools yet." />}
                    {tools.map((tool) => (
                        <div key={tool.id} className="model-row">
                            <div>
                                <strong>{tool.title}</strong>
                                <div className="hint mt-sm" style={{ wordBreak: "break-all" }}>{tool.url}</div>
                            </div>
                            <div className="flex-row gap-sm" style={{ marginLeft: "auto" }}>
                                <button className="icon-btn edit-btn" onClick={() => setModalTool(tool)}>
                                    <span className="icon-pencil" aria-hidden="true"></span>
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => setConfirmDelete(tool.id)}>
                                    <span className="icon-trash" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-btn-container">
                    <button className="primary-btn" onClick={() => setModalTool({})}>+ Add Tool</button>
                </div>
            </div>

            {modalTool !== null && (
                <ToolModal
                    initial={modalTool.id ? modalTool : null}
                    onClose={() => setModalTool(null)}
                    onSave={onSave}
                />
            )}
            {confirmDelete !== null && (
                <ConfirmDialog
                    title="Delete tool"
                    message="Are you sure you want to delete this tool?"
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    variant="danger"
                    onConfirm={onDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </main>
    );
}
