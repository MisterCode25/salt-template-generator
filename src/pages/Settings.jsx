import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { loadTokens, saveTokens } from "../services/tokenService.js";
import { loadTemplateTreeData, saveTemplateTreeData } from "../services/templateTreeService.js";
import { clearAppIndexedDB } from "../services/indexedDbService.js";
import { loadTemplateImages, saveTemplateImages } from "../services/templateImageService.js";
import { buildConfigPayload, validateImportedConfig } from "../services/configService.js";
import { copyText, showToast } from "../services/clipboardService.js";
import { getStorageInfo, requestPersistentStorage } from "../services/storageInfoService.js";
import { AGENT_PROFILE_FIELDS, loadAgentProfile, saveAgentProfile } from "../services/agentProfileService.js";
import {
    formatTestImportPayload,
    TEST_SO_IMPORT_PAYLOAD,
    TEST_VTI_IMPORT_PAYLOAD
} from "../data/testImportPayloads.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const AgentProfileField = memo(function AgentProfileField({ field, value, onChange }) {
    const handleChange = useCallback((event) => {
        onChange(field.key, event.target.value);
    }, [field.key, onChange]);

    const inputType = field.key === "email"
        ? "email"
        : field.key === "phoneNumber" ? "tel" : "text";

    return (
        <div className="field-line">
            <label>{field.settingsLabel}</label>
            <input
                type={inputType}
                value={value}
                onChange={handleChange}
                placeholder={field.token}
            />
            <span className="hint">{field.token}</span>
        </div>
    );
});

export default function Settings({ embedded = false, onClose = null }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [tokens, setTokens] = useState([]);
    const [treeData, setTreeData] = useState({ nodes: [], templates: [] });
    const [configName, setConfigName] = useState(localStorage.getItem("local_configName") || "No configuration");
    const [confirmReset, setConfirmReset] = useState(false);
    const [exportNameOpen, setExportNameOpen] = useState(false);
    const [exportNameValue, setExportNameValue] = useState("");
    const [storageInfo, setStorageInfo] = useState(null);
    const [agentProfile, setAgentProfile] = useState(() => loadAgentProfile());
    useEffect(() => {
        loadTokens().then(setTokens);
        loadTemplateTreeData().then(setTreeData);
        getStorageInfo().then(setStorageInfo).catch(() => setStorageInfo(null));
    }, []);

    const refreshStorageInfo = useCallback(() => {
        getStorageInfo().then(setStorageInfo).catch(() => setStorageInfo(null));
    }, []);

    const requestPersist = useCallback(async () => {
        const persisted = await requestPersistentStorage();
        refreshStorageInfo();
        showToast(
            persisted ? "Persistent browser storage enabled" : "Persistent storage was not granted",
            persisted ? "success" : "warning"
        );
    }, [refreshStorageInfo]);

    const startExport = useCallback(() => {
        setExportNameValue(configName);
        setExportNameOpen(true);
    }, [configName]);

    const doExport = useCallback(async () => {
        const nextName = exportNameValue.trim() || configName;
        setExportNameOpen(false);
        setConfigName(nextName);
        localStorage.setItem("local_configName", nextName);
        const payload = buildConfigPayload(
            nextName,
            tokens.filter((tokenDef) => !tokenDef.system),
            treeData,
            await loadTemplateImages()
        );
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${nextName || "config"}.templageConfig`;
        a.click();
        URL.revokeObjectURL(url);
    }, [configName, exportNameValue, tokens, treeData]);

    const importConfig = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    }, []);

    const handleFile = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const {
                tokens: importedTokens,
                nodes: importedNodes,
                templates: importedTemplates,
                templateImages: importedTemplateImages,
                configName: importedName
            } = validateImportedConfig(json);
            await saveTokens(importedTokens);
            await saveTemplateTreeData({ nodes: importedNodes, templates: importedTemplates });
            await saveTemplateImages(importedTemplateImages);
            const [normalizedTokens, normalizedTreeData] = await Promise.all([
                loadTokens(),
                loadTemplateTreeData()
            ]);
            setTokens(normalizedTokens);
            setTreeData(normalizedTreeData);
            refreshStorageInfo();
            const name = importedName || "Imported configuration";
            localStorage.setItem("local_configName", name);
            setConfigName(name);
            showToast("Configuration imported", "info");
            navigate("/");
        } catch (err) {
            console.error(err);
            showToast("Import failed", "error");
        }
    }, [navigate, refreshStorageInfo]);

    const triggerReset = useCallback(() => {
        setConfirmReset(true);
    }, []);

    const updateAgentProfileField = useCallback((key, value) => {
        setAgentProfile((prev) => ({ ...prev, [key]: value }));
    }, []);

    const saveAgentSettings = useCallback(() => {
        const savedProfile = saveAgentProfile(agentProfile);
        setAgentProfile(savedProfile);
        showToast("Agent profile saved", "success");
    }, [agentProfile]);

    const copyTestData = useCallback((kind) => {
        const isVti = kind === "vti";
        const payload = isVti ? TEST_VTI_IMPORT_PAYLOAD : TEST_SO_IMPORT_PAYLOAD;
        copyText(formatTestImportPayload(payload), {
            message: `${isVti ? "VTI" : "SO"} test JSON copied`,
            variant: "success"
        });
    }, []);

    const resetStorage = useCallback(async () => {
        setConfirmReset(false);
        const keysToDelete = [];
        const appScopedLegacyKeys = new Set(["tokens", "models", "theme_pref", "active_client_payload", "agent_profile"]);
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
        await clearAppIndexedDB();
        showToast("Local data reset", "warning");
        window.location.href = "/";
    }, []);

    const closeExportNameModal = useCallback(() => {
        setExportNameOpen(false);
    }, []);

    const handleExportNameChange = useCallback((event) => {
        setExportNameValue(event.target.value);
    }, []);

    const handleExportNameKeyDown = useCallback((event) => {
        if (event.key === "Enter") doExport();
    }, [doExport]);

    const cancelReset = useCallback(() => {
        setConfirmReset(false);
    }, []);

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
                    {!embedded && (
                        <button className="secondary-btn" onClick={() => navigate("/")}>
                            Back
                        </button>
                    )}
                </div>

                <div className="popup-grid mt-md">
                    <div className="popup-card settings-agent-card">
                        <label>Agent profile</label>
                        <p className="hint">Used by the hard-coded agent tokens in templates and tool URLs.</p>
                        <div className="settings-agent-grid">
                            {AGENT_PROFILE_FIELDS.map((field) => (
                                <AgentProfileField
                                    key={field.key}
                                    field={field}
                                    value={agentProfile[field.key] || ""}
                                    onChange={updateAgentProfileField}
                                />
                            ))}
                        </div>
                        <div className="flex-row gap-sm flex-wrap mt-md">
                            <button className="primary-btn" onClick={saveAgentSettings}>Save agent profile</button>
                        </div>
                    </div>

                    <div className="popup-card">
                        <label>Configuration</label>
                        <p className="hint">Import or export your tokens and templates.</p>
                        <div className="flex-row gap-sm flex-wrap">
                            <button className="secondary-btn" onClick={importConfig}>Import configuration</button>
                            <button className="secondary-btn" onClick={startExport}>Export configuration</button>
                        </div>
                    </div>

                    <div className="popup-card settings-test-data-card">
                        <label>Test data</label>
                        <p className="hint">Copies ready-to-import JSON for quick VTI/SO tests.</p>
                        <div className="settings-test-data-actions">
                            <button
                                type="button"
                                className="settings-test-data-btn settings-test-data-btn--vti"
                                onClick={() => copyTestData("vti")}
                            >
                                <Copy size={15} strokeWidth={2} aria-hidden="true" />
                                <span>VTI data</span>
                            </button>
                            <button
                                type="button"
                                className="settings-test-data-btn settings-test-data-btn--so"
                                onClick={() => copyTestData("so")}
                            >
                                <Copy size={15} strokeWidth={2} aria-hidden="true" />
                                <span>SO data</span>
                            </button>
                        </div>
                    </div>

                    <div className="popup-card">
                        <label>Storage</label>
                        <p className="hint">
                            Local browser data. Templates are stored in IndexedDB.
                        </p>
                        <div className="storage-info-grid">
                            <div>
                                <span className="client-info-label">Used</span>
                                <strong>{storageInfo?.usageLabel || "Unknown"}</strong>
                            </div>
                            <div>
                                <span className="client-info-label">Quota</span>
                                <strong>{storageInfo?.quotaLabel || "Unknown"}</strong>
                            </div>
                            <div>
                                <span className="client-info-label">Persistent</span>
                                <strong>{storageInfo?.persisted ? "Yes" : "No"}</strong>
                            </div>
                        </div>
                        <div className="flex-row gap-sm flex-wrap mt-md">
                            <button className="secondary-btn" onClick={requestPersist}>Protect storage</button>
                            <button className="reset-fields-btn settings-reset-btn" onClick={triggerReset}>
                                Reset local data
                            </button>
                        </div>
                    </div>


                </div>
            </div>
            {exportNameOpen && (
                <Modal onClose={closeExportNameModal} ariaLabel="Configuration name">
                    <div className="popup-header">
                        <h2>Export configuration</h2>
                    </div>
                    <div className="confirm-dialog-body">
                        <div className="form-field">
                            <label>Configuration name</label>
                            <input
                                autoFocus
                                value={exportNameValue}
                                onChange={handleExportNameChange}
                                onKeyDown={handleExportNameKeyDown}
                                placeholder="My configuration"
                            />
                        </div>
                    </div>
                    <div className="popup-actions">
                        <button type="button" className="primary-btn" onClick={doExport}>Export</button>
                    </div>
                </Modal>
            )}
            {confirmReset && (
                <ConfirmDialog
                    title="Reset local data"
                    message="Are you sure you want to reset all stored data? This will delete all your templates, tokens, and settings. This action cannot be undone."
                    confirmLabel="Reset"
                    variant="danger"
                    onConfirm={resetStorage}
                    onCancel={cancelReset}
                />
            )}
        </>
    );

    if (embedded) {
        return content;
    }

    return <main className="page-container">{content}</main>;
}
