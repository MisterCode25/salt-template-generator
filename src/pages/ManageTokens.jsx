import { memo, useCallback, useEffect, useState } from "react";
import { loadTokens, saveTokens } from "../services/tokenService.js";
import { renameTokenInTemplateTree } from "../services/templateTreeService.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { showToast } from "../services/clipboardService.js";

const TokenModal = memo(function TokenModal({ initial, tokens, onClose, onSave }) {
    const [token, setToken] = useState(initial?.token || "");
    const [label, setLabel] = useState(initial?.label || "");
    const [key, setKey] = useState(initial?.key || "");
    const [type, setType] = useState(initial?.input_type || "text");
    const [def, setDef] = useState(initial?.default || "");

    const handleSave = useCallback(() => {
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
            default: normalizedDefault !== "" ? normalizedDefault : undefined,
            display_mode: "on_demand"
        });
    }, [def, initial, key, label, onSave, token, tokens, type]);

    return (
        <Modal onClose={onClose} ariaLabel="Token editor">
                <div className="popup-header">
                    <h2>{initial ? "Edit Token" : "New Token"}</h2>
                </div>

                <div className="popup-grid">
                    <div className="popup-card">
                        <div className="field-line">
                            <label>Token name (format: {"{my_token}"})</label>
                            <input value={token} onChange={e => setToken(e.target.value)} />
                        </div>

                        <div className="field-line">
                            <label>Display label</label>
                            <input value={label} onChange={e => setLabel(e.target.value)} />
                        </div>

                        <div className="field-line">
                            <label>Parsing key (optional)</label>
                            <input
                                value={key}
                                onChange={e => setKey(e.target.value)}
                                placeholder="Ex: LastName, Mobile, Request…"
                            />
                        </div>

                        <div className="field-line">
                            <label>Field type</label>
                            <select value={type} onChange={e => setType(e.target.value)}>
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                            </select>
                        </div>

                        <div className="field-line">
                            <label>Default value (optional)</label>
                            <input value={def} onChange={e => setDef(e.target.value)} />
                        </div>

                    </div>
                </div>

                <div className="popup-actions">
                    <button type="button" className="primary-btn" onClick={handleSave}>Save</button>
                </div>
        </Modal>
    );
});

const TokenRow = memo(function TokenRow({ token, onEdit, onDelete }) {
    const handleEdit = useCallback(() => {
        onEdit(token);
    }, [onEdit, token]);

    const handleDelete = useCallback(() => {
        onDelete(token.id);
    }, [onDelete, token.id]);

    return (
        <div className="model-row">
            <div>
                <strong>{token.label || token.token}</strong> <span className="hint">{token.token}</span>
                {token.system && (
                    <span className="variant-pill" style={{ marginLeft: "0.4rem" }}>system</span>
                )}
                {token.display_mode === "on_demand" && (
                    <span className="variant-pill" style={{ marginLeft: "0.4rem" }}>on demand</span>
                )}
                {token.key && <div className="hint mt-sm">Key: {token.key}</div>}
            </div>
            <div className="flex-row gap-sm" style={{ marginLeft: "auto" }}>
                {!token.system && (
                    <>
                        <button className="icon-btn edit-btn" onClick={handleEdit}>
                            <span className="icon-pencil" aria-hidden="true"></span>
                        </button>
                        <button className="icon-btn delete-btn" onClick={handleDelete}>
                            <span className="icon-trash" aria-hidden="true"></span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
});

export default function ManageTokens({ embedded = false, onClose = null }) {
    const [tokens, setTokens] = useState([]);
    const [modalToken, setModalToken] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        loadTokens().then(setTokens);
    }, []);

    const persist = useCallback(async (next) => {
        setTokens(next);
        await saveTokens(next);
    }, []);

    const onDelete = useCallback((id) => {
        setConfirmDelete(id);
    }, []);

    const confirmDeleteToken = useCallback(async () => {
        if (!confirmDelete) return;
        const next = tokens.filter(t => t.id !== confirmDelete);
        await persist(next);
        setConfirmDelete(null);
    }, [confirmDelete, persist, tokens]);

    const onSave = useCallback(async (token) => {
        if (token.id) {
            const previous = tokens.find(t => t.id === token.id);
            const next = tokens.map(t => t.id === token.id ? token : t);
            await persist(next);
            if (previous?.token && previous.token !== token.token) {
                await renameTokenInTemplateTree(previous.token, token.token);
            }
        } else {
            const next = [...tokens, { ...token, id: crypto.randomUUID() }];
            await persist(next);
        }
        setModalToken(null);
    }, [persist, tokens]);

    const openTokenModal = useCallback((token) => {
        setModalToken(token);
    }, []);

    const closeTokenModal = useCallback(() => {
        setModalToken(null);
    }, []);

    const openNewTokenModal = useCallback(() => {
        setModalToken({});
    }, []);

    const cancelDeleteToken = useCallback(() => {
        setConfirmDelete(null);
    }, []);

    return (
        <main className={embedded ? "management-embedded-page" : "page-container"}>
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
                        <TokenRow
                            key={t.id}
                            token={t}
                            onEdit={openTokenModal}
                            onDelete={onDelete}
                        />
                    ))}
                </div>

                <div className="add-btn-container">
                    <button className="primary-btn" onClick={openNewTokenModal}>+ Add Token</button>
                </div>
            </div>
            {modalToken !== null && (
                <TokenModal
                    initial={modalToken.id ? modalToken : null}
                    tokens={tokens}
                    onClose={closeTokenModal}
                    onSave={onSave}
                />
            )}
            {confirmDelete !== null && (
                <ConfirmDialog
                    title="Delete token"
                    message="Are you sure you want to delete this token? This action cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                    onConfirm={confirmDeleteToken}
                    onCancel={cancelDeleteToken}
                />
            )}
        </main>
    );
}
