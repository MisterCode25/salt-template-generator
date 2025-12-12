import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadTokens } from "../services/tokenService.js";
import { loadTemplates, saveTemplates } from "../services/templateService.js";
import { saveJSON } from "../services/storageService.js";
import { buildConfigPayload, validateImportedConfig } from "../services/configService.js";
import { showToast } from "../services/clipboardService.js";

export default function Settings() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [tokens, setTokens] = useState([]);
    const [models, setModels] = useState([]);
    const [configName, setConfigName] = useState(localStorage.getItem("local_configName") || "No configuration");
    const [ignoredKeysCount, setIgnoredKeysCount] = useState(0);

    useEffect(() => {
        loadTokens().then(setTokens);
        loadTemplates().then(setModels);
        try {
            const ignored = JSON.parse(localStorage.getItem("ignored_token_keys") || "[]");
            setIgnoredKeysCount(Array.isArray(ignored) ? ignored.length : 0);
        } catch {
            setIgnoredKeysCount(0);
        }
    }, []);

    const exportConfig = async () => {
        const nextName = prompt("Configuration name", configName) || configName;
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

    const resetStorage = async () => {
        if (!confirm("Reset all stored data?")) return;
        localStorage.clear();
        showToast("Local data reset", "warning");
        window.location.href = "/";
    };

    const reenableIgnoredKeys = () => {
        localStorage.removeItem("ignored_token_keys");
        setIgnoredKeysCount(0);
        showToast("Ignored keys restored", "info");
    };

    return (
        <main className="page-container">
            <input
                ref={fileInputRef}
                type="file"
                accept=".templageConfig,application/json"
                style={{ display: "none" }}
                onChange={handleFile}
            />
            <div className="manage-card">
                <div className="variant-editor-head" style={{ alignItems: "center" }}>
                    <div>
                        <p className="eyebrow">App</p>
                        <h2>Settings</h2>
                    </div>
                    <button className="secondary-btn" onClick={() => navigate("/")}>Back</button>
                </div>

                <div className="popup-grid" style={{ marginTop: 10 }}>
                    <div className="popup-card">
                        <label>Auto fill keys</label>
                        <p className="hint">Show the mapping popup again for previously ignored keys.</p>
                        <button
                            className="autofill-btn settings-restore-btn"
                            onClick={reenableIgnoredKeys}
                            disabled={ignoredKeysCount === 0}
                        >
                            Restore ignored keys {ignoredKeysCount > 0 ? `(${ignoredKeysCount})` : ""}
                        </button>
                    </div>

                    <div className="popup-card">
                        <label>Configuration</label>
                        <p className="hint">Import or export your tokens and templates.</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button className="secondary-btn" onClick={importConfig}>Import configuration</button>
                            <button className="secondary-btn" onClick={exportConfig}>Export configuration</button>
                        </div>
                    </div>

                    <div className="popup-card">
                        <label>Storage</label>
                        <p className="hint">Reset all local data stored in this browser.</p>
                        <button className="reset-fields-btn settings-reset-btn" onClick={resetStorage}>
                            Reset local data
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
