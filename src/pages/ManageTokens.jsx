import { useEffect, useState } from "react";
import { loadTokens, saveTokens } from "../services/tokenService.js";
import { renameTokenInTemplates } from "../services/templateService.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { showToast } from "../services/clipboardService.js";

function TokenModal({ initial, tokens, onClose, onSave }) {
    const [token, setToken] = useState(initial?.token || "");
    const [label, setLabel] = useState(initial?.label || "");
    const [key, setKey] = useState(initial?.key || "");
    const [type, setType] = useState(initial?.input_type || "text");
    const [def, setDef] = useState(initial?.default || "");

    const handleSave = () => {
        const normalizedToken = token.trim();
        const normalizedLabel = label.trim();
        const normalizedKey = key.trim();
        const normalizedDefault = def.trim();

        if (!normalizedToken.startsWith("{") || !normalizedToken.endsWith("}")) {
            showToast("Token must follow the {my_token} format.", "error");
            return;
        }
        const duplicate = (tokens || []).some((candidate) =>
            candidate.id !== initial?.id && candidate.token === normalizedToken
        );
        if (duplicate) {
            showToast("A token with this name already exists.", "error");
            return;
        }
        onSave({
            ...initial,
            token: normalizedToken,
            label: normalizedLabel,
            key: normalizedKey || undefined,
            input_type: type,
            default: normalizedDefault !== "" ? normalizedDefault : undefined
        });
    };

    return (
        <Modal onClose={onClose} ariaLabel="Token editor">
                <div className="popup-header">
                    <h2>{initial ? "Edit Token" : "New Token"}</h2>
                </div>

                <div className="popup-grid">
                    <div className="popup-card">
                        <label>Token name (format: {"{my_token}"})</label>
                        <input value={token} onChange={e => setToken(e.target.value)} />

                        <label>Display label</label>
                        <input value={label} onChange={e => setLabel(e.target.value)} />

                        <label>Parsing key (optional)</label>
                        <input
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            placeholder="Ex: LastName, Mobile, Request…"
                        />

                        <label>Field type</label>
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                        </select>

                        <label>Default value (optional)</label>
                        <input value={def} onChange={e => setDef(e.target.value)} />
                    </div>
                </div>

                <div className="popup-actions">
                    <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                    <button type="button" className="primary-btn" onClick={handleSave}>Save</button>
                </div>
        </Modal>
    );
}

export default function ManageTokens() {
    const [tokens, setTokens] = useState([]);
    const [modalToken, setModalToken] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        loadTokens().then(setTokens);
    }, []);

    const persist = async (next) => {
        setTokens(next);
        await saveTokens(next);
    };

    const onDelete = (id) => {
        setConfirmDelete(id);
    };

    const confirmDeleteToken = async () => {
        if (!confirmDelete) return;
        const next = tokens.filter(t => t.id !== confirmDelete);
        await persist(next);
        setConfirmDelete(null);
    };

    const onSave = async (token) => {
        if (token.id) {
            const previous = tokens.find(t => t.id === token.id);
            const next = tokens.map(t => t.id === token.id ? token : t);
            await persist(next);
            if (previous?.token && previous.token !== token.token) {
                await renameTokenInTemplates(previous.token, token.token);
            }
        } else {
            const next = [...tokens, { ...token, id: crypto.randomUUID() }];
            await persist(next);
        }
        setModalToken(null);
    };

    return (
        <main className="page-container">
            <div className="manage-card">
                <div className="variant-editor-head">
                    <div>
                        <p className="eyebrow">Data tokens</p>
                        <h2>Manage Tokens</h2>
                    </div>
                </div>

                <div id="tokens-list" className="models-list">
                    {tokens.length === 0 && <EmptyState message="No tokens yet." />}
                    {tokens.map(t => (
                        <div key={t.id} className="model-row">
                            <div>
                                <strong>{t.label || t.token}</strong> <span className="hint">{t.token}</span>
                                {t.key && <div className="hint mt-sm">Key: {t.key}</div>}
                            </div>
                            <div className="flex-row gap-sm" style={{ marginLeft: "auto" }}>
                                <button className="icon-btn edit-btn" onClick={() => setModalToken(t)}>
                                    <span className="icon-pencil" aria-hidden="true"></span>
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => onDelete(t.id)}>
                                    <span className="icon-trash" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-btn-container">
                    <button className="primary-btn" onClick={() => setModalToken({})}>+ Add Token</button>
                </div>
            </div>
            {modalToken !== null && (
                <TokenModal
                    initial={modalToken.id ? modalToken : null}
                    tokens={tokens}
                    onClose={() => setModalToken(null)}
                    onSave={onSave}
                />
            )}
            {confirmDelete !== null && (
                <ConfirmDialog
                    title="Delete token"
                    message="Are you sure you want to delete this token? This action cannot be undone."
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    variant="danger"
                    onConfirm={confirmDeleteToken}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </main>
    );
}
