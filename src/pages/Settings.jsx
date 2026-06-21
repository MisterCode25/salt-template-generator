import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Copy,
    Database,
    Download,
    FileJson,
    HardDrive,
    Monitor,
    Moon,
    Palette,
    ShieldCheck,
    Sparkles,
    Sun,
    Tags,
    TestTube2,
    Upload,
    UserRound
} from "lucide-react";
import { loadTokens, saveTokens } from "../services/tokenService.js";
import { loadTemplateTreeData, saveTemplateTreeData } from "../services/templateTreeService.js";
import { clearAppIndexedDB } from "../services/indexedDbService.js";
import { loadTemplateImages, saveTemplateImages } from "../services/templateImageService.js";
import { buildConfigPayload, mergeConfigData, validateImportedConfig } from "../services/configService.js";
import { loadConfigName, saveConfigName } from "../services/appConfigService.js";
import {
    loadChatGptPromptSettings,
    saveChatGptPromptSettings
} from "../services/chatGptPromptSettingsService.js";
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
import ManageTokens from "./ManageTokens.jsx";
import {
    applyTheme,
    getInitialTheme,
    getResolvedTheme,
    loadThemePreference,
    THEME_UPDATED_EVENT,
    watchSystemThemePreference
} from "../utils/theme.js";

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

const SETTINGS_SECTIONS = [
    {
        id: "agent",
        label: "Agent profile",
        summary: "Agent tokens",
        icon: UserRound
    },
    {
        id: "tokens",
        label: "Custom tokens",
        summary: "User tokens",
        icon: Tags
    },
    {
        id: "aiPrompt",
        label: "AI prompt",
        summary: "Template guidance",
        icon: Sparkles
    },
    {
        id: "theme",
        label: "Theme",
        summary: "Appearance",
        icon: Palette
    },
    {
        id: "configuration",
        label: "Configuration",
        summary: "Import / export",
        icon: FileJson
    },
    {
        id: "testData",
        label: "Test data",
        summary: "VTI and SO",
        icon: TestTube2
    },
    {
        id: "storage",
        label: "Storage",
        summary: "Browser data",
        icon: HardDrive
    }
];

const THEME_OPTIONS = [
    {
        id: "system",
        label: "System",
        summary: "Follow macOS/browser",
        icon: Monitor
    },
    {
        id: "dark",
        label: "Dark",
        summary: "Dark interface",
        icon: Moon
    },
    {
        id: "light",
        label: "Light",
        summary: "Clear interface",
        icon: Sun
    },
    {
        id: "salt",
        label: "Salt",
        summary: "Green accent mode",
        icon: Palette
    }
];

const DEFAULT_CONFIG_NAME = "No configuration";

export default function Settings({ embedded = false, onClose = null }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [tokens, setTokens] = useState([]);
    const [treeData, setTreeData] = useState({ nodes: [], templates: [] });
    const [configName, setConfigName] = useState(DEFAULT_CONFIG_NAME);
    const [confirmReset, setConfirmReset] = useState(false);
    const [pendingImportConfig, setPendingImportConfig] = useState(null);
    const [exportNameOpen, setExportNameOpen] = useState(false);
    const [exportNameValue, setExportNameValue] = useState("");
    const [storageInfo, setStorageInfo] = useState(null);
    const [agentProfile, setAgentProfile] = useState({});
    const [chatGptPromptSettings, setChatGptPromptSettings] = useState({ templateInstruction: "" });
    const [activeSection, setActiveSection] = useState("agent");
    const [themePreference, setThemePreference] = useState(() => getInitialTheme());
    const [resolvedTheme, setResolvedTheme] = useState(() => getResolvedTheme(getInitialTheme()));
    useEffect(() => {
        loadTokens().then(setTokens);
        loadTemplateTreeData().then(setTreeData);
        loadConfigName().then(setConfigName);
        loadAgentProfile().then(setAgentProfile);
        loadChatGptPromptSettings().then(setChatGptPromptSettings);
        getStorageInfo().then(setStorageInfo).catch(() => setStorageInfo(null));
    }, []);

    useEffect(() => {
        const syncThemeState = async (event = null) => {
            const nextPreference = event?.detail?.preference || await loadThemePreference();
            const nextResolved = event?.detail?.resolvedTheme || getResolvedTheme(nextPreference);
            setThemePreference(nextPreference);
            setResolvedTheme(nextResolved);
        };
        const unsubscribeSystemTheme = watchSystemThemePreference(syncThemeState);
        window.addEventListener(THEME_UPDATED_EVENT, syncThemeState);
        syncThemeState();
        return () => {
            unsubscribeSystemTheme();
            window.removeEventListener(THEME_UPDATED_EVENT, syncThemeState);
        };
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
        await saveConfigName(nextName);
        const payload = buildConfigPayload(
            nextName,
            tokens.filter((tokenDef) => !tokenDef.system),
            treeData,
            await loadTemplateImages(),
            chatGptPromptSettings
        );
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${nextName || "config"}.templageConfig`;
        a.click();
        URL.revokeObjectURL(url);
    }, [chatGptPromptSettings, configName, exportNameValue, tokens, treeData]);

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
                chatGptPromptSettings: importedChatGptPromptSettings,
                configName: importedName
            } = validateImportedConfig(json);
            setPendingImportConfig({
                fileName: file.name,
                tokens: importedTokens,
                nodes: importedNodes,
                templates: importedTemplates,
                templateImages: importedTemplateImages,
                chatGptPromptSettings: importedChatGptPromptSettings,
                configName: importedName || "Imported configuration"
            });
        } catch (err) {
            console.error(err);
            showToast("Import failed", "error");
        }
    }, []);

    const closeImportModeModal = useCallback(() => {
        setPendingImportConfig(null);
    }, []);

    const applyPendingImport = useCallback(async (mode) => {
        if (!pendingImportConfig) return;

        try {
            const currentTemplateImages = await loadTemplateImages();
            const currentConfig = {
                tokens: tokens.filter((tokenDef) => !tokenDef.system && !tokenDef.internal),
                nodes: treeData.nodes,
                templates: treeData.templates,
                templateImages: currentTemplateImages,
                chatGptPromptSettings
            };
            const importedConfig = {
                tokens: pendingImportConfig.tokens,
                nodes: pendingImportConfig.nodes,
                templates: pendingImportConfig.templates,
                templateImages: pendingImportConfig.templateImages,
                chatGptPromptSettings: pendingImportConfig.chatGptPromptSettings
            };
            const nextConfig = mode === "merge"
                ? mergeConfigData(currentConfig, importedConfig)
                : importedConfig;

            await saveTokens(nextConfig.tokens);
            await saveTemplateTreeData({ nodes: nextConfig.nodes, templates: nextConfig.templates });
            await saveTemplateImages(nextConfig.templateImages);
            const savedChatGptPromptSettings = await saveChatGptPromptSettings(nextConfig.chatGptPromptSettings);

            const [normalizedTokens, normalizedTreeData] = await Promise.all([
                loadTokens(),
                loadTemplateTreeData()
            ]);
            setTokens(normalizedTokens);
            setTreeData(normalizedTreeData);
            setChatGptPromptSettings(savedChatGptPromptSettings);
            refreshStorageInfo();

            const importedName = pendingImportConfig.configName || "Imported configuration";
            const nextName = mode === "merge" && configName && configName !== DEFAULT_CONFIG_NAME
                ? configName
                : importedName;
            setConfigName(await saveConfigName(nextName));
            setPendingImportConfig(null);
            showToast(mode === "merge" ? "Configuration merged" : "Configuration replaced", "success");
            navigate("/");
        } catch (err) {
            console.error(err);
            showToast("Import failed", "error");
        }
    }, [chatGptPromptSettings, configName, navigate, pendingImportConfig, refreshStorageInfo, tokens, treeData]);

    const triggerReset = useCallback(() => {
        setConfirmReset(true);
    }, []);

    const updateAgentProfileField = useCallback((key, value) => {
        setAgentProfile((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleTokensChange = useCallback((nextTokens) => {
        setTokens(nextTokens);
    }, []);

    const updateChatGptTemplateInstruction = useCallback((event) => {
        setChatGptPromptSettings((prev) => ({
            ...prev,
            templateInstruction: event.target.value
        }));
    }, []);

    const changeThemePreference = useCallback((nextTheme) => {
        const result = applyTheme(nextTheme);
        setThemePreference(result.preference);
        setResolvedTheme(result.resolvedTheme);
        showToast(
            result.preference === "system"
                ? `Theme follows system (${result.resolvedTheme})`
                : `Theme set to ${result.preference}`,
            "success"
        );
    }, []);

    const saveAgentSettings = useCallback(async () => {
        const savedProfile = await saveAgentProfile(agentProfile);
        setAgentProfile(savedProfile);
        showToast("Agent profile saved", "success");
    }, [agentProfile]);

    const saveAiPromptSettings = useCallback(async () => {
        const savedSettings = await saveChatGptPromptSettings(chatGptPromptSettings);
        setChatGptPromptSettings(savedSettings);
        showToast("AI prompt settings saved", "success");
    }, [chatGptPromptSettings]);

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
        const appScopedLegacyKeys = new Set(["tokens", "models", "theme_pref", "active_client_payload", "agent_profile", "chatgpt_prompt_settings"]);
        try {
            const storage = globalThis.localStorage || null;
            if (storage) {
                for (let i = 0; i < storage.length; i++) {
                    const key = storage.key(i);
                    if (!key) continue;
                    if (
                        key.startsWith("local_")
                        || key.startsWith("input_")
                        || appScopedLegacyKeys.has(key)
                    ) {
                        keysToDelete.push(key);
                    }
                }
                keysToDelete.forEach((key) => storage.removeItem(key));
            }
        } catch {
            // Best-effort cleanup for pre-migration browser keys.
        }
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

    const activeSectionConfig = SETTINGS_SECTIONS.find((section) => section.id === activeSection) || SETTINGS_SECTIONS[0];
    const ActiveSectionIcon = activeSectionConfig.icon;
    const customTokenCount = tokens.filter((tokenDef) => !tokenDef.system && !tokenDef.internal).length;

    const renderSettingsDetail = () => {
        switch (activeSection) {
            case "tokens":
                return (
                    <div className="settings-detail-stack">
                        <div className="settings-info-card">
                            <span>Managed here</span>
                            <strong>{customTokenCount} custom token{customTokenCount === 1 ? "" : "s"}</strong>
                        </div>
                        <div className="settings-token-manager">
                            <ManageTokens
                                embedded
                                customOnly
                                hideHeader
                                onTokensChange={handleTokensChange}
                            />
                        </div>
                    </div>
                );
            case "theme":
                return (
                    <div className="settings-detail-stack">
                        <div className="settings-theme-grid" role="radiogroup" aria-label="Theme preference">
                            {THEME_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const selected = themePreference === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        className={`settings-theme-option${selected ? " is-selected" : ""}`}
                                        onClick={() => changeThemePreference(option.id)}
                                    >
                                        <span className="settings-theme-icon"><Icon size={20} aria-hidden="true" /></span>
                                        <span>
                                            <strong>{option.label}</strong>
                                            <small>{option.summary}</small>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="settings-info-card">
                            <span>Active appearance</span>
                            <strong>
                                {themePreference === "system"
                                    ? `System (${resolvedTheme === "light" ? "Light" : "Dark"})`
                                    : THEME_OPTIONS.find((option) => option.id === themePreference)?.label || "Dark"}
                            </strong>
                        </div>
                    </div>
                );
            case "aiPrompt":
                return (
                    <div className="settings-detail-stack">
                        <label className="settings-ai-prompt-field">
                            <span>Template guidance</span>
                            <textarea
                                value={chatGptPromptSettings.templateInstruction || ""}
                                onChange={updateChatGptTemplateInstruction}
                                placeholder="Example: start with Hello {customer_name}, and end with Meilleures salutations {agent_firstName} de votre equipe Salt."
                                rows={8}
                            />
                        </label>
                        <div className="settings-info-card">
                            <span>Internal rules</span>
                            <strong>Response markers, request IDs, HTML format, and placeholder safety stay locked.</strong>
                        </div>
                        <div className="settings-detail-actions">
                            <button type="button" className="settings-action-btn settings-action-btn--save" onClick={saveAiPromptSettings}>
                                <ShieldCheck size={16} aria-hidden="true" />
                                <span>Save AI prompt</span>
                            </button>
                        </div>
                    </div>
                );
            case "configuration":
                return (
                    <div className="settings-detail-stack">
                        <div className="settings-info-card">
                            <span>Current configuration</span>
                            <strong>{configName}</strong>
                        </div>
                        <div className="settings-action-grid">
                            <button type="button" className="settings-action-btn settings-action-btn--import" onClick={importConfig}>
                                <Upload size={16} aria-hidden="true" />
                                <span>Import configuration</span>
                            </button>
                            <button type="button" className="settings-action-btn settings-action-btn--export" onClick={startExport}>
                                <Download size={16} aria-hidden="true" />
                                <span>Export configuration</span>
                            </button>
                        </div>
                    </div>
                );
            case "testData":
                return (
                    <div className="settings-detail-stack">
                        <div className="settings-action-grid">
                            <button
                                type="button"
                                className="settings-action-btn settings-action-btn--vti"
                                onClick={() => copyTestData("vti")}
                            >
                                <Copy size={16} strokeWidth={2} aria-hidden="true" />
                                <span>VTI data</span>
                            </button>
                            <button
                                type="button"
                                className="settings-action-btn settings-action-btn--so"
                                onClick={() => copyTestData("so")}
                            >
                                <Copy size={16} strokeWidth={2} aria-hidden="true" />
                                <span>SO data</span>
                            </button>
                        </div>
                    </div>
                );
            case "storage":
                return (
                    <div className="settings-detail-stack">
                        <div className="storage-info-grid settings-storage-grid">
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
                        <div className="settings-action-grid">
                            <button type="button" className="settings-action-btn settings-action-btn--protect" onClick={requestPersist}>
                                <ShieldCheck size={16} aria-hidden="true" />
                                <span>Protect storage</span>
                            </button>
                            <button type="button" className="settings-action-btn settings-action-btn--danger" onClick={triggerReset}>
                                <Database size={16} aria-hidden="true" />
                                <span>Reset local data</span>
                            </button>
                        </div>
                    </div>
                );
            case "agent":
            default:
                return (
                    <div className="settings-detail-stack">
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
                        <div className="settings-detail-actions">
                            <button type="button" className="settings-action-btn settings-action-btn--save" onClick={saveAgentSettings}>
                                <ShieldCheck size={16} aria-hidden="true" />
                                <span>Save agent profile</span>
                            </button>
                        </div>
                    </div>
                );
        }
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
            <div className="settings-shell">
                <header className="settings-header">
                    <div>
                        <p className="eyebrow">App</p>
                        <h2>Settings <span className="settings-version-tag">V2.5</span></h2>
                    </div>
                    {!embedded && (
                        <button type="button" className="secondary-btn" onClick={() => navigate("/")}>
                            Back
                        </button>
                    )}
                </header>

                <div className="settings-layout">
                    <aside className="settings-sidebar" aria-label="Settings sections">
                        {SETTINGS_SECTIONS.map((section) => {
                            const Icon = section.icon;
                            const selected = activeSection === section.id;
                            const sidebarMeta = section.id === "configuration"
                                ? configName
                                : section.id === "storage"
                                    ? storageInfo?.usageLabel || section.summary
                                    : section.id === "tokens"
                                        ? `${customTokenCount} custom`
                                    : section.id === "theme"
                                        ? themePreference === "system" ? `System (${resolvedTheme})` : themePreference
                                        : section.id === "aiPrompt"
                                            ? chatGptPromptSettings.templateInstruction?.trim() ? "Configured" : "Empty"
                                            : section.summary;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    className={`settings-sidebar-item${selected ? " is-selected" : ""}`}
                                    onClick={() => setActiveSection(section.id)}
                                    aria-current={selected ? "page" : undefined}
                                >
                                    <span className="settings-sidebar-icon"><Icon size={19} aria-hidden="true" /></span>
                                    <span className="settings-sidebar-copy">
                                        <strong>{section.label}</strong>
                                        <small>{sidebarMeta}</small>
                                    </span>
                                </button>
                            );
                        })}
                    </aside>

                    <section className="settings-detail-panel" aria-labelledby={`settings-${activeSectionConfig.id}-title`}>
                        <div className="settings-detail-hero">
                            <span className="settings-detail-icon"><ActiveSectionIcon size={28} aria-hidden="true" /></span>
                            <div>
                                <h3 id={`settings-${activeSectionConfig.id}-title`}>{activeSectionConfig.label}</h3>
                                <p>{activeSectionConfig.summary}</p>
                            </div>
                        </div>
                        {renderSettingsDetail()}
                    </section>
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
            {pendingImportConfig && (
                <Modal onClose={closeImportModeModal} ariaLabel="Import configuration mode">
                    <div className="popup-header">
                        <h2>Import configuration</h2>
                    </div>
                    <div className="confirm-dialog-body">
                        <p>
                            Choose how to import
                            {" "}
                            <strong>{pendingImportConfig.configName}</strong>.
                        </p>
                        <p className="hint">
                            Merge keeps existing content, adds new imported items, and updates matching
                            tokens or IDs. Replace removes existing templates, tokens and images before
                            importing this configuration.
                        </p>
                    </div>
                    <div className="popup-actions">
                        <button type="button" className="secondary-btn" onClick={closeImportModeModal}>Cancel</button>
                        <button type="button" className="secondary-btn" onClick={() => applyPendingImport("replace")}>Replace</button>
                        <button type="button" className="primary-btn" onClick={() => applyPendingImport("merge")}>Merge</button>
                    </div>
                </Modal>
            )}
        </>
    );

    if (embedded) {
        return content;
    }

    return <main className="page-container">{content}</main>;
}
