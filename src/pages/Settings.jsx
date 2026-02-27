import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadTokens } from "../services/tokenService.js";
import { loadTemplates, saveTemplates } from "../services/templateService.js";
import { saveJSON } from "../services/storageService.js";
import { buildConfigPayload, validateImportedConfig } from "../services/configService.js";
import { showToast } from "../services/clipboardService.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Settings({ embedded = false, onClose = null }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [tokens, setTokens] = useState([]);
    const [models, setModels] = useState([]);
    const [configName, setConfigName] = useState(localStorage.getItem("local_configName") || "No configuration");
    const [confirmReset, setConfirmReset] = useState(false);
    const [exportNameOpen, setExportNameOpen] = useState(false);
    const [exportNameValue, setExportNameValue] = useState("");
    useEffect(() => {
        loadTokens().then(setTokens);
        loadTemplates().then(setModels);
    }, []);

    const startExport = () => {
        setExportNameValue(configName);
        setExportNameOpen(true);
    };

    const doExport = () => {
        const nextName = exportNameValue.trim() || configName;
        setExportNameOpen(false);
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
            showToast("Configuration imported", "info");
            navigate("/");
        } catch (err) {
            console.error(err);
            showToast("Import failed", "error");
        }
    };

    const triggerReset = () => setConfirmReset(true);

    const resetStorage = async () => {
        setConfirmReset(false);
        const keysToDelete = [];
        const appScopedLegacyKeys = new Set(["tokens", "models", "theme_pref"]);
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            if (
                key.startsWith("local_")
                || key.startsWith("input_")
                || appScopedLegacyKeys.has(key)
            ) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach((key) => localStorage.removeItem(key));
        showToast("Local data reset", "warning");
        window.location.href = "/";
    };

    const content = (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".templageConfig,application/json"
                style={{ display: "none" }}
                onChange={handleFile}
            />
            <div className="manage-card">
                <div className="variant-editor-head">
                    <div>
                        <p className="eyebrow">App</p>
                        <h2>Settings <span className="settings-version-tag">V2.5</span></h2>
                    </div>
                    <button className="secondary-btn" onClick={() => {
                        if (embedded && onClose) {
                            onClose();
                            return;
                        }
                        navigate("/");
                    }}>
                        {embedded ? "Close" : "Back"}
                    </button>
                </div>

                <div className="popup-grid mt-md">
                    <div className="popup-card">
                        <label>Configuration</label>
                        <p className="hint">Import or export your tokens and templates.</p>
                        <div className="flex-row gap-sm flex-wrap">
                            <button className="secondary-btn" onClick={importConfig}>Import configuration</button>
                            <button className="secondary-btn" onClick={startExport}>Export configuration</button>
                        </div>
                    </div>

                    <div className="popup-card">
                        <label>Storage</label>
                        <p className="hint">Reset all local data stored in this browser.</p>
                        <button className="reset-fields-btn settings-reset-btn" onClick={triggerReset}>
                            Reset local data
                        </button>
                    </div>
                </div>
            </div>
            {exportNameOpen && (
                <Modal onClose={() => setExportNameOpen(false)} ariaLabel="Configuration name">
                    <div className="popup-header">
                        <h2>Export configuration</h2>
                    </div>
                    <div className="confirm-dialog-body">
                        <div className="form-field">
                            <label>Configuration name</label>
                            <input
                                autoFocus
                                value={exportNameValue}
                                onChange={(e) => setExportNameValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") doExport(); }}
                                placeholder="My configuration"
                            />
                        </div>
                    </div>
                    <div className="popup-actions">
                        <button type="button" className="secondary-btn" onClick={() => setExportNameOpen(false)}>Cancel</button>
                        <button type="button" className="primary-btn" onClick={doExport}>Export</button>
                    </div>
                </Modal>
            )}
            {confirmReset && (
                <ConfirmDialog
                    title="Reset local data"
                    message="Are you sure you want to reset all stored data? This will delete all your templates, tokens, and settings. This action cannot be undone."
                    confirmLabel="Reset"
                    cancelLabel="Cancel"
                    variant="danger"
                    onConfirm={resetStorage}
                    onCancel={() => setConfirmReset(false)}
                />
            )}
        </>
    );

    if (embedded) {
        return content;
    }

    return <main className="page-container">{content}</main>;
}
