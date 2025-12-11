import { useEffect, useState } from "react";
import { loadTokens, saveTokens } from "../services/tokenService.js";

function TokenModal({ initial, onClose, onSave }) {
    const [token, setToken] = useState(initial?.token || "");
    const [label, setLabel] = useState(initial?.label || "");
    const [type, setType] = useState(initial?.input_type || "text");
    const [def, setDef] = useState(initial?.default || "");

    const handleSave = () => {
        if (!token.startsWith("{") || !token.endsWith("}")) {
            alert("Token must follow the {my_token} format.");
            return;
        }
        onSave({
            ...initial,
            token,
            label,
            input_type: type,
            default: def !== "" ? def : undefined
        });
    };

    return (
        <div className="popup">
            <div className="popup-box">
                <h2>{initial ? "Edit Token" : "New Token"}</h2>
                <label>Token name (format: {"{my_token}"})</label>
                <input value={token} onChange={e => setToken(e.target.value)} />

                <label>Display label</label>
                <input value={label} onChange={e => setLabel(e.target.value)} />

                <label>Field type</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                </select>

                <label>Default value (optional)</label>
                <input value={def} onChange={e => setDef(e.target.value)} />

                <div className="popup-actions">
                    <button className="secondary-btn" onClick={onClose}>Cancel</button>
                    <button className="primary-btn" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default function ManageTokens() {
    const [tokens, setTokens] = useState([]);
    const [modalToken, setModalToken] = useState(null);

    useEffect(() => {
        loadTokens().then(setTokens);
    }, []);

    const persist = async (next) => {
        setTokens(next);
        await saveTokens(next);
    };

    const onDelete = async (id) => {
        if (!confirm("Delete this token?")) return;
        const next = tokens.filter(t => t.id !== id);
        await persist(next);
    };

    const onSave = async (token) => {
        if (token.id) {
            const next = tokens.map(t => t.id === token.id ? token : t);
            await persist(next);
        } else {
            const next = [...tokens, { ...token, id: crypto.randomUUID() }];
            await persist(next);
        }
        setModalToken(null);
    };

    return (
        <main className="page-container">
            <div className="manage-card">
                <div className="variant-editor-head" style={{ alignItems: "center" }}>
                    <div>
                        <p className="eyebrow">Data tokens</p>
                        <h2>Manage Tokens</h2>
                    </div>
                </div>

                <div id="tokens-list" className="models-list">
                    {tokens.length === 0 && <p>No token yet.</p>}
                    {tokens.map(t => (
                        <div key={t.id} className="model-row">
                            <div>
                                <strong>{t.label || t.token}</strong> <span className="hint">{t.token}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
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
                    onClose={() => setModalToken(null)}
                    onSave={onSave}
                />
            )}
        </main>
    );
}
