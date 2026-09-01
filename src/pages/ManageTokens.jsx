import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { loadTokens, loadTokensWithClientData, saveTokens } from "../services/tokenService.js";
import {
    listTemplateTokensInTemplateTree,
    migrateTokenInTemplateTree,
    previewTokenMigrationInTemplateTree,
    renameTokenInTemplateTree
} from "../services/templateTreeService.js";
import { canonicalizeInputTokenValue } from "../utils/tokenCanonicalization.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { showToast } from "../services/clipboardService.js";

function labelForTokenValue(tokenValue = "") {
    const clean = String(tokenValue || "").replace(/[{}]/g, "").replace(/[_-]+/g, " ").trim();
    return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : tokenValue;
}

function addMigrationTokenOption(optionMap, tokenDef, source) {
    const token = canonicalizeInputTokenValue(tokenDef?.token || tokenDef);
    if (!token) return;

    const existing = optionMap.get(token);
    const next = typeof tokenDef === "string"
        ? {
            id: `${source}:${token}`,
            token,
            label: labelForTokenValue(token),
            templateOnly: source === "template"
        }
        : {
            ...tokenDef,
            id: tokenDef.id || `${source}:${token}`,
            token
        };

    if (!existing) {
        optionMap.set(token, next);
        return;
    }

    if (!existing.label && next.label) {
        optionMap.set(token, { ...existing, label: next.label });
    }
}

function buildMigrationTokenOptions(tokens = [], contextTokens = [], templateTokenValues = []) {
    const optionMap = new Map();
    for (const tokenDef of tokens || []) {
        addMigrationTokenOption(optionMap, tokenDef, "stored");
    }
    for (const tokenDef of contextTokens || []) {
        addMigrationTokenOption(optionMap, tokenDef, "context");
    }
    for (const tokenValue of templateTokenValues || []) {
        addMigrationTokenOption(optionMap, tokenValue, "template");
    }

    return Array.from(optionMap.values())
        .sort((left, right) => left.token.localeCompare(right.token));
}

function formatMigrationTokenOption(tokenDef) {
    const label = tokenDef.label && tokenDef.label !== tokenDef.token
        ? ` - ${tokenDef.label}`
        : "";
    const source = tokenDef.templateOnly
        ? " - template"
        : tokenDef.internal
            ? " - client"
            : tokenDef.system
                ? " - system"
                : "";
    return `${tokenDef.token}${label}${source}`;
}

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
                                placeholder="Example: LastName, Mobile, Request…"
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

const TokenMigrationSection = memo(function TokenMigrationSection({
    tokens,
    onCreateToken
}) {
    const [contextTokens, setContextTokens] = useState([]);
    const [templateTokenValues, setTemplateTokenValues] = useState([]);
    const [fromToken, setFromToken] = useState("");
    const [targetMode, setTargetMode] = useState("existing");
    const [existingTargetToken, setExistingTargetToken] = useState("");
    const [newTargetToken, setNewTargetToken] = useState("");
    const [newTargetLabel, setNewTargetLabel] = useState("");
    const [pendingMigration, setPendingMigration] = useState(null);
    const [isWorking, setIsWorking] = useState(false);

    const refreshTokenOptions = useCallback(async () => {
        const [loadedContextTokens, loadedTemplateTokenValues] = await Promise.all([
            loadTokensWithClientData(),
            listTemplateTokensInTemplateTree()
        ]);
        setContextTokens(loadedContextTokens);
        setTemplateTokenValues(loadedTemplateTokenValues);
    }, []);

    useEffect(() => {
        let active = true;
        Promise.all([
            loadTokensWithClientData(),
            listTemplateTokensInTemplateTree()
        ]).then(([loadedContextTokens, loadedTemplateTokenValues]) => {
            if (!active) return;
            setContextTokens(loadedContextTokens);
            setTemplateTokenValues(loadedTemplateTokenValues);
        }).catch((error) => {
            console.error("load token migration options error", error);
        });
        return () => {
            active = false;
        };
    }, []);

    const tokenOptions = useMemo(() => (
        buildMigrationTokenOptions(tokens, contextTokens, templateTokenValues)
    ), [contextTokens, templateTokenValues, tokens]);
    const tokenSet = useMemo(() => new Set(tokenOptions.map((tokenDef) => tokenDef.token)), [tokenOptions]);
    const targetToken = targetMode === "existing"
        ? existingTargetToken
        : canonicalizeInputTokenValue(newTargetToken);
    const canStart = Boolean(fromToken && targetToken && fromToken !== targetToken && !isWorking);

    const resetPendingMigration = useCallback(() => {
        setPendingMigration(null);
    }, []);

    const handleNewTargetChange = useCallback((event) => {
        const nextValue = event.target.value;
        setNewTargetToken(nextValue);
        if (!newTargetLabel.trim()) {
            setNewTargetLabel(labelForTokenValue(canonicalizeInputTokenValue(nextValue)));
        }
    }, [newTargetLabel]);

    const previewMigration = useCallback(async () => {
        const normalizedFromToken = canonicalizeInputTokenValue(fromToken);
        const normalizedToToken = targetMode === "existing"
            ? canonicalizeInputTokenValue(existingTargetToken)
            : canonicalizeInputTokenValue(newTargetToken);

        if (!normalizedFromToken || !tokenSet.has(normalizedFromToken)) {
            showToast("Choose an existing source token.", "error");
            return;
        }
        if (!normalizedToToken) {
            showToast("Choose or enter a target token.", "error");
            return;
        }
        if (normalizedFromToken === normalizedToToken) {
            showToast("Source and target tokens must be different.", "error");
            return;
        }
        if (targetMode === "existing" && !tokenSet.has(normalizedToToken)) {
            showToast("Choose an existing target token.", "error");
            return;
        }
        if (targetMode === "new" && tokenSet.has(normalizedToToken)) {
            showToast("This target token already exists. Use existing-token mode.", "error");
            return;
        }

        setIsWorking(true);
        try {
            const preview = await previewTokenMigrationInTemplateTree(normalizedFromToken);
            setPendingMigration({
                ...preview,
                fromToken: normalizedFromToken,
                toToken: normalizedToToken,
                createTarget: targetMode === "new",
                targetLabel: newTargetLabel.trim() || labelForTokenValue(normalizedToToken)
            });
        } catch (error) {
            console.error("previewTokenMigrationInTemplateTree error", error);
            showToast("Unable to scan templates.", "error");
        } finally {
            setIsWorking(false);
        }
    }, [existingTargetToken, fromToken, newTargetLabel, newTargetToken, targetMode, tokenSet]);

    const confirmMigration = useCallback(async () => {
        if (!pendingMigration) return;
        setIsWorking(true);
        try {
            if (pendingMigration.createTarget) {
                await onCreateToken({
                    token: pendingMigration.toToken,
                    label: pendingMigration.targetLabel,
                    input_type: "text",
                    display_mode: "on_demand"
                });
            }
            const result = await migrateTokenInTemplateTree(pendingMigration.fromToken, pendingMigration.toToken);
            await refreshTokenOptions();
            setPendingMigration(null);
            setNewTargetToken("");
            setNewTargetLabel("");
            showToast(
                result.replacements > 0
                    ? `Token migrated in ${result.templateCount} template${result.templateCount > 1 ? "s" : ""}.`
                    : "No template occurrence found for this token.",
                result.replacements > 0 ? "success" : "info"
            );
        } catch (error) {
            console.error("migrateTokenInTemplateTree error", error);
            showToast("Token migration failed.", "error");
        } finally {
            setIsWorking(false);
        }
    }, [onCreateToken, pendingMigration, refreshTokenOptions]);

    return (
        <section className="token-migration-section" aria-label="Token migration">
            <div className="token-migration-section__head">
                <div>
                    <p className="eyebrow">Bulk update</p>
                    <h3>Token migration</h3>
                </div>
            </div>

            <div className="token-migration-grid">
                <label className="field-line">
                    <span>Replace token</span>
                    <select value={fromToken} onChange={(event) => setFromToken(event.target.value)}>
                        <option value="">Choose source token</option>
                        {tokenOptions.map((tokenDef) => (
                            <option key={tokenDef.id || tokenDef.token} value={tokenDef.token}>
                                {formatMigrationTokenOption(tokenDef)}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="field-line">
                    <span>Replacement mode</span>
                    <div className="token-migration-mode" role="group" aria-label="Replacement mode">
                        <button
                            type="button"
                            className={targetMode === "existing" ? "is-active" : ""}
                            onClick={() => setTargetMode("existing")}
                        >
                            Existing token
                        </button>
                        <button
                            type="button"
                            className={targetMode === "new" ? "is-active" : ""}
                            onClick={() => setTargetMode("new")}
                        >
                            New token
                        </button>
                    </div>
                </div>

                {targetMode === "existing" ? (
                    <label className="field-line">
                        <span>Replace with</span>
                        <select value={existingTargetToken} onChange={(event) => setExistingTargetToken(event.target.value)}>
                            <option value="">Choose target token</option>
                            {tokenOptions
                                .filter((tokenDef) => tokenDef.token !== fromToken)
                                .map((tokenDef) => (
                                    <option key={tokenDef.id || tokenDef.token} value={tokenDef.token}>
                                        {formatMigrationTokenOption(tokenDef)}
                                    </option>
                                ))}
                        </select>
                    </label>
                ) : (
                    <>
                        <label className="field-line">
                            <span>New token</span>
                            <input
                                value={newTargetToken}
                                onChange={handleNewTargetChange}
                                placeholder="{new_token}"
                            />
                        </label>
                        <label className="field-line">
                            <span>New token label</span>
                            <input
                                value={newTargetLabel}
                                onChange={(event) => setNewTargetLabel(event.target.value)}
                                placeholder="Display label"
                            />
                        </label>
                    </>
                )}
            </div>

            <div className="token-migration-actions">
                <button type="button" className="primary-btn" onClick={previewMigration} disabled={!canStart}>
                    Preview migration
                </button>
                <span className="hint">
                    Replaces exact token matches in all template languages and variants.
                </span>
            </div>

            {pendingMigration && (
                <ConfirmDialog
                    title="Run token migration"
                    message={
                        pendingMigration.replacements > 0
                            ? `Replace ${pendingMigration.replacements} occurrence${pendingMigration.replacements > 1 ? "s" : ""} of ${pendingMigration.fromToken} with ${pendingMigration.toToken} in ${pendingMigration.templateCount} template${pendingMigration.templateCount > 1 ? "s" : ""}?`
                            : `No occurrence of ${pendingMigration.fromToken} was found in templates. ${pendingMigration.createTarget ? `Create ${pendingMigration.toToken} anyway?` : "Run migration anyway?"}`
                    }
                    confirmLabel={pendingMigration.replacements > 0 ? "Run migration" : "Continue"}
                    onConfirm={confirmMigration}
                    onCancel={resetPendingMigration}
                />
            )}
        </section>
    );
});

export default function ManageTokens({
    embedded = false,
    onClose = null,
    customOnly = false,
    hideHeader = false,
    onTokensChange = null
}) {
    const [tokens, setTokens] = useState([]);
    const [modalToken, setModalToken] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        let active = true;
        loadTokens().then((loadedTokens) => {
            if (!active) return;
            setTokens(loadedTokens);
            onTokensChange?.(loadedTokens);
        });
        return () => {
            active = false;
        };
    }, [onTokensChange]);

    const visibleTokens = useMemo(() => (
        customOnly ? tokens.filter((tokenDef) => !tokenDef.system && !tokenDef.internal) : tokens
    ), [customOnly, tokens]);

    const persist = useCallback(async (next) => {
        setTokens(next);
        onTokensChange?.(next);
        await saveTokens(next);
    }, [onTokensChange]);

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

    const createTokenFromMigration = useCallback(async (token) => {
        const next = [...tokens, { ...token, id: crypto.randomUUID() }];
        await persist(next);
    }, [persist, tokens]);

    return (
        <main className={embedded ? "management-embedded-page" : "page-container"}>
            <div className="manage-card">
                {!hideHeader && (
                    <div className="variant-editor-head">
                        <div>
                            <p className="eyebrow">Data tokens</p>
                            <h2>Manage Tokens</h2>
                        </div>
                    </div>
                )}

                <div id="tokens-list" className="models-list">
                    {visibleTokens.length === 0 && <EmptyState message="No custom tokens yet." />}
                    {visibleTokens.map(t => (
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

                <TokenMigrationSection
                    tokens={tokens}
                    onCreateToken={createTokenFromMigration}
                />
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
