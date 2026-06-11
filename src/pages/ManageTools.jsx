import { useEffect, useRef, useState } from "react";
import { loadTools, saveTools } from "../services/toolsService.js";
import { loadTokens } from "../services/tokenService.js";
import { loadActiveClientPayload } from "../services/activeClientService.js";
import { getClientInternalTokenData } from "../utils/clientClipboard.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { showToast } from "../services/clipboardService.js";

function getUrlTokenContext(value, caret) {
    if (caret === null || caret === undefined) return null;
    const beforeCaret = value.slice(0, caret);
    const triggerIndex = beforeCaret.lastIndexOf("@");
    if (triggerIndex === -1) return null;

    const query = beforeCaret.slice(triggerIndex + 1);
    if (!/^[a-zA-Z0-9_-]*$/.test(query)) return null;

    return {
        start: triggerIndex,
        end: caret,
        query
    };
}

function tokenMatchesQuery(token, query = "") {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;
    return [token.label, token.token, token.key]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
}

async function loadToolTokens() {
    const configuredTokens = await loadTokens();
    const clientPayload = loadActiveClientPayload();
    const clientTokens = clientPayload
        ? getClientInternalTokenData(clientPayload).tokenDefs
        : [];
    const byToken = new Map();

    [...configuredTokens, ...clientTokens].forEach((tokenDef) => {
        if (!tokenDef?.token || byToken.has(tokenDef.token)) return;
        byToken.set(tokenDef.token, tokenDef);
    });

    return Array.from(byToken.values());
}

function ToolModal({ initial, onClose, onSave }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [url, setUrl] = useState(initial?.url || "");
    const [tokens, setTokens] = useState([]);
    const [tokenMenu, setTokenMenu] = useState(null);
    const [activeTokenIndex, setActiveTokenIndex] = useState(0);
    const urlRef = useRef(null);

    useEffect(() => {
        let active = true;
        loadToolTokens().then((loadedTokens) => {
            if (active) setTokens(loadedTokens);
        });
        return () => {
            active = false;
        };
    }, []);

    const filteredTokens = tokenMenu
        ? tokens.filter((token) => tokenMatchesQuery(token, tokenMenu.query))
        : [];
    const selectedTokenIndex = Math.min(activeTokenIndex, Math.max(filteredTokens.length - 1, 0));

    const updateTokenMenu = (nextUrl, caret) => {
        const context = getUrlTokenContext(nextUrl, caret);
        setTokenMenu(context);
        setActiveTokenIndex(0);
    };

    const insertToken = (token, context = tokenMenu) => {
        const el = urlRef.current;
        if (!el) {
            setUrl((prev) => prev + token);
            setTokenMenu(null);
            return;
        }
        const start = context?.start ?? el.selectionStart ?? url.length;
        const end = context?.end ?? el.selectionEnd ?? url.length;
        const next = url.slice(0, start) + token + url.slice(end);
        setUrl(next);
        setTokenMenu(null);
        setActiveTokenIndex(0);
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(start + token.length, start + token.length);
        });
    };

    const handleUrlChange = (event) => {
        const nextUrl = event.target.value;
        const caret = event.target.selectionStart ?? nextUrl.length;
        setUrl(nextUrl);
        updateTokenMenu(nextUrl, caret);
    };

    const handleUrlKeyDown = (event) => {
        if (!tokenMenu) return;

        if (event.key === "Escape") {
            event.preventDefault();
            setTokenMenu(null);
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveTokenIndex((current) => Math.min(current + 1, Math.max(filteredTokens.length - 1, 0)));
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveTokenIndex((current) => Math.max(current - 1, 0));
            return;
        }

        if ((event.key === "Enter" || event.key === "Tab") && filteredTokens.length > 0) {
            event.preventDefault();
            insertToken(filteredTokens[selectedTokenIndex].token, tokenMenu);
        }
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

                    <div className="field-line tools-url-field">
                        <label>URL</label>
                        <input
                            ref={urlRef}
                            value={url}
                            onChange={handleUrlChange}
                            onKeyDown={handleUrlKeyDown}
                            onSelect={(event) => updateTokenMenu(url, event.target.selectionStart ?? url.length)}
                            onFocus={(event) => updateTokenMenu(url, event.target.selectionStart ?? url.length)}
                            onBlur={() => window.setTimeout(() => setTokenMenu(null), 120)}
                            placeholder="https://example.com?id=@client"
                            className="tools-url-input"
                        />
                        {tokenMenu && (
                            <div className="tools-token-menu" role="listbox">
                                {filteredTokens.length > 0 ? filteredTokens.map((tok, index) => (
                                    <button
                                        key={tok.id}
                                        type="button"
                                        className={`tools-token-option${index === selectedTokenIndex ? " is-active" : ""}`}
                                        onMouseEnter={() => setActiveTokenIndex(index)}
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            insertToken(tok.token, tokenMenu);
                                        }}
                                        title={tok.label || tok.token}
                                    >
                                        <span>{tok.label || tok.token}</span>
                                        <small>{tok.token}</small>
                                    </button>
                                )) : (
                                    <div className="tools-token-menu__empty">No matching token</div>
                                )}
                            </div>
                        )}
                    </div>

                    {url && (
                        <div className="field-line">
                            <label>URL preview</label>
                            <code className="tools-url-preview">{url}</code>
                        </div>
                    )}
                </div>
            </div>

            <div className="popup-actions">
                <button type="button" className="primary-btn" onClick={handleSave}>Save</button>
            </div>
        </Modal>
    );
}

export default function ManageTools({ embedded = false, onClose = null }) {
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
        <main className={embedded ? "management-embedded-page" : "page-container"}>
            <div className="manage-card">
                <div className="variant-editor-head">
                    <div>
                        <p className="eyebrow">Quick tools</p>
                        <h2>Manage Tools</h2>
                    </div>
                </div>

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
                    variant="danger"
                    onConfirm={onDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </main>
    );
}
