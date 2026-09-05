import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookMarked,
    Copy,
    Database,
    Download,
    FileJson,
    HardDrive,
    Keyboard,
    Link2,
    Lock,
    Monitor,
    Moon,
    Palette,
    Puzzle,
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
import {
    loadConfigLocked,
    loadConfigName,
    saveConfigLocked,
    saveConfigName
} from "../services/appConfigService.js";
import {
    loadChatGptPromptSettings,
    saveChatGptPromptSettings
} from "../services/chatGptPromptSettingsService.js";
import { copyText, showToast } from "../services/clipboardService.js";
import { getStorageInfo, requestPersistentStorage } from "../services/storageInfoService.js";
import { AGENT_PROFILE_FIELDS, loadAgentProfile, saveAgentProfile } from "../services/agentProfileService.js";
import { loadTools, saveTools } from "../services/toolsService.js";
import {
    formatTestImportPayload,
    TEST_IMPORT_SCENARIOS
} from "../data/testImportPayloads.js";
import { extractTemplateImageIdsFromHtml } from "../utils/templateImages.js";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ManageTokens from "./ManageTokens.jsx";
import ManageTools from "./ManageTools.jsx";
import {
    SETTINGS_SECTION,
    SETTINGS_SECTION_DEFINITIONS,
    isToolSettingsSection,
    normalizeSettingsSection
} from "../config/settingsSections.js";
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

const SETTINGS_SECTION_ICONS = Object.freeze({
    [SETTINGS_SECTION.AGENT]: UserRound,
    [SETTINGS_SECTION.TOKENS]: Tags,
    [SETTINGS_SECTION.AI_PROMPT]: Sparkles,
    [SETTINGS_SECTION.LINK_TOOLS]: Link2,
    [SETTINGS_SECTION.MODULE_TOOLS]: Puzzle,
    [SETTINGS_SECTION.DATA_SHORTCUTS]: BookMarked,
    [SETTINGS_SECTION.KEYBOARD_SHORTCUTS]: Keyboard,
    [SETTINGS_SECTION.THEME]: Palette,
    [SETTINGS_SECTION.CONFIGURATION]: FileJson,
    [SETTINGS_SECTION.TEST_DATA]: TestTube2,
    [SETTINGS_SECTION.STORAGE]: HardDrive
});

const SETTINGS_SECTIONS = SETTINGS_SECTION_DEFINITIONS.map((section) => ({
    ...section,
    icon: SETTINGS_SECTION_ICONS[section.id]
}));

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
const DEFAULT_EXPORT_OPTIONS = Object.freeze({
    templates: true,
    tools: true,
    tokens: true,
    templateImages: true,
    chatGptPromptSettings: true
});
const EXPORT_CONTENT_OPTIONS = Object.freeze([
    {
        id: "templates",
        label: "Templates and topics",
        summary: "Playbook topic tree and templates."
    },
    {
        id: "tools",
        label: "Tools and modules",
        summary: "Customer links and HTML modules."
    },
    {
        id: "tokens",
        label: "Custom tokens",
        summary: "User-created token definitions."
    },
    {
        id: "templateImages",
        label: "Template images",
        summary: "Images used inside exported templates."
    },
    {
        id: "chatGptPromptSettings",
        label: "AI prompt guidance",
        summary: "Saved template-writing instruction."
    }
]);
const TEST_DATA_SOURCES = Object.freeze([
    {
        id: "so",
        payloadKey: "soPayload",
        label: "SuperOffice capture",
        buttonLabel: "Copy SuperOffice"
    },
    {
        id: "vti",
        payloadKey: "vtiPayload",
        label: "VTI capture",
        buttonLabel: "Copy VTI"
    }
]);

function sortByOrderAndTitle(left, right) {
    const leftOrder = Number.isFinite(Number(left?.order)) ? Number(left.order) : 0;
    const rightOrder = Number.isFinite(Number(right?.order)) ? Number(right.order) : 0;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return String(left?.title || "").localeCompare(String(right?.title || ""));
}

function buildTopicExportOptions(nodes = [], parentId = null, depth = 0) {
    return nodes
        .filter((node) => (node.parentId || null) === (parentId || null))
        .sort(sortByOrderAndTitle)
        .flatMap((node) => [
            { node, depth },
            ...buildTopicExportOptions(nodes, node.id, depth + 1)
        ]);
}

function collectDescendantTopicIds(nodes = [], selectedIds = new Set()) {
    const result = new Set(selectedIds);
    let changed = true;
    while (changed) {
        changed = false;
        nodes.forEach((node) => {
            if (node.parentId && result.has(node.parentId) && !result.has(node.id)) {
                result.add(node.id);
                changed = true;
            }
        });
    }
    return result;
}

function collectAncestorTopicIds(nodes = [], topicIds = new Set()) {
    const result = new Set(topicIds);
    const byId = new Map(nodes.map((node) => [node.id, node]));
    topicIds.forEach((topicId) => {
        let current = byId.get(topicId);
        while (current?.parentId) {
            result.add(current.parentId);
            current = byId.get(current.parentId);
        }
    });
    return result;
}

function getTemplateTextFields(template = {}) {
    const values = [];
    Object.values(template.contentByChannel || {}).forEach((content) => {
        ["text_fr", "text_en", "text_de", "text_it"].forEach((field) => values.push(content?.[field] || ""));
        (Array.isArray(content?.variants) ? content.variants : []).forEach((variant) => {
            ["text_fr", "text_en", "text_de", "text_it"].forEach((field) => values.push(variant?.[field] || ""));
        });
    });
    return values;
}

function filterTemplateLinksForExport(template, exportedNodeIds) {
    const nodeIds = (Array.isArray(template.nodeIds) ? template.nodeIds : [])
        .filter((nodeId) => exportedNodeIds.has(nodeId));
    if (nodeIds.length === 0 && exportedNodeIds.has(template.parentNodeId)) {
        nodeIds.push(template.parentNodeId);
    }
    const parentNodeId = nodeIds.includes(template.parentNodeId) ? template.parentNodeId : nodeIds[0] || "";
    return {
        ...template,
        nodeIds,
        parentNodeId
    };
}

function buildSelectedTemplateTreeData(treeData = {}, selectedTopicIds = new Set()) {
    const nodes = Array.isArray(treeData.nodes) ? treeData.nodes : [];
    const templates = Array.isArray(treeData.templates) ? treeData.templates : [];
    const contentTopicIds = collectDescendantTopicIds(nodes, selectedTopicIds);
    const exportedNodeIds = collectAncestorTopicIds(nodes, contentTopicIds);
    const exportedNodes = nodes.filter((node) => exportedNodeIds.has(node.id));
    const exportedTemplates = templates
        .filter((template) => {
            const nodeIds = Array.isArray(template.nodeIds) ? template.nodeIds : [];
            return nodeIds.some((nodeId) => contentTopicIds.has(nodeId))
                || contentTopicIds.has(template.parentNodeId);
        })
        .map((template) => filterTemplateLinksForExport(template, exportedNodeIds))
        .filter((template) => template.nodeIds.length > 0 || template.parentNodeId);
    return { nodes: exportedNodes, templates: exportedTemplates };
}

function filterTemplateImagesForExport(templateImages = [], templates = []) {
    const imageIds = new Set();
    templates.forEach((template) => {
        getTemplateTextFields(template).forEach((html) => {
            extractTemplateImageIdsFromHtml(html).forEach((imageId) => imageIds.add(imageId));
        });
    });
    if (imageIds.size === 0) return [];
    return templateImages.filter((image) => imageIds.has(image?.id));
}

export default function Settings({ embedded = false, onClose = null, initialSection = SETTINGS_SECTION.AGENT }) {
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
    const [activeSection, setActiveSection] = useState(() => normalizeSettingsSection(initialSection));
    const [themePreference, setThemePreference] = useState(() => getInitialTheme());
    const [resolvedTheme, setResolvedTheme] = useState(() => getResolvedTheme(getInitialTheme()));
    const [configLocked, setConfigLocked] = useState(false);
    const [exportLocked, setExportLocked] = useState(false);
    const [exportOptions, setExportOptions] = useState(DEFAULT_EXPORT_OPTIONS);
    const [exportTopicIds, setExportTopicIds] = useState(() => new Set());
    useEffect(() => {
        loadTokens().then(setTokens);
        loadTemplateTreeData().then(setTreeData);
        loadConfigName().then(setConfigName);
        loadConfigLocked().then(setConfigLocked);
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
        setExportLocked(configLocked);
        setExportOptions(DEFAULT_EXPORT_OPTIONS);
        setExportTopicIds(new Set(treeData.nodes.map((node) => node.id)));
        setExportNameOpen(true);
    }, [configLocked, configName, treeData.nodes]);

    const doExport = useCallback(async () => {
        const nextName = exportNameValue.trim() || configName;
        const nextExportLocked = configLocked || exportLocked;
        const effectiveExportOptions = {
            ...exportOptions,
            templateImages: Boolean(exportOptions.templates && exportOptions.templateImages)
        };
        const exportTreeData = effectiveExportOptions.templates
            ? buildSelectedTemplateTreeData(treeData, exportTopicIds)
            : { nodes: [], templates: [] };
        const [templateImages, tools] = await Promise.all([
            loadTemplateImages(),
            loadTools()
        ]);
        const exportTemplateImages = effectiveExportOptions.templateImages
            ? filterTemplateImagesForExport(templateImages, exportTreeData.templates)
            : [];
        setExportNameOpen(false);
        setConfigName(nextName);
        await saveConfigName(nextName);
        const payload = buildConfigPayload(
            nextName,
            effectiveExportOptions.tokens ? tokens.filter((tokenDef) => !tokenDef.system) : [],
            exportTreeData,
            exportTemplateImages,
            effectiveExportOptions.chatGptPromptSettings ? chatGptPromptSettings : {},
            effectiveExportOptions.tools ? tools : [],
            { locked: nextExportLocked, include: effectiveExportOptions }
        );
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${nextName || "config"}.templageConfig`;
        a.click();
        URL.revokeObjectURL(url);
    }, [chatGptPromptSettings, configLocked, configName, exportLocked, exportNameValue, exportOptions, exportTopicIds, tokens, treeData]);

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
                hasTokens: importedHasTokens,
                nodes: importedNodes,
                templates: importedTemplates,
                hasTreeData: importedHasTreeData,
                templateImages: importedTemplateImages,
                hasTemplateImages: importedHasTemplateImages,
                chatGptPromptSettings: importedChatGptPromptSettings,
                hasChatGptPromptSettings: importedHasChatGptPromptSettings,
                tools: importedTools,
                hasTools: importedHasTools,
                locked: importedLocked,
                hasLock: importedHasLock,
                configName: importedName
            } = validateImportedConfig(json);
            setPendingImportConfig({
                fileName: file.name,
                tokens: importedTokens,
                hasTokens: importedHasTokens,
                nodes: importedNodes,
                templates: importedTemplates,
                hasTreeData: importedHasTreeData,
                templateImages: importedTemplateImages,
                hasTemplateImages: importedHasTemplateImages,
                chatGptPromptSettings: importedChatGptPromptSettings,
                hasChatGptPromptSettings: importedHasChatGptPromptSettings,
                tools: importedTools,
                hasTools: importedHasTools,
                locked: importedLocked,
                hasLock: importedHasLock,
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
            const [currentTemplateImages, currentTools] = await Promise.all([
                loadTemplateImages(),
                loadTools()
            ]);
            const currentConfig = {
                tokens: tokens.filter((tokenDef) => !tokenDef.system && !tokenDef.internal),
                nodes: treeData.nodes,
                templates: treeData.templates,
                templateImages: currentTemplateImages,
                chatGptPromptSettings,
                tools: currentTools
            };
            const importedConfig = {
                tokens: pendingImportConfig.tokens,
                hasTokens: pendingImportConfig.hasTokens,
                nodes: pendingImportConfig.nodes,
                templates: pendingImportConfig.templates,
                hasTreeData: pendingImportConfig.hasTreeData,
                templateImages: pendingImportConfig.templateImages,
                hasTemplateImages: pendingImportConfig.hasTemplateImages,
                chatGptPromptSettings: pendingImportConfig.chatGptPromptSettings,
                hasChatGptPromptSettings: pendingImportConfig.hasChatGptPromptSettings,
                tools: pendingImportConfig.tools,
                hasTools: pendingImportConfig.hasTools
            };
            const nextConfig = mode === "merge"
                ? mergeConfigData(currentConfig, importedConfig)
                : {
                    tokens: pendingImportConfig.hasTokens ? importedConfig.tokens : currentConfig.tokens,
                    nodes: pendingImportConfig.hasTreeData ? importedConfig.nodes : currentConfig.nodes,
                    templates: pendingImportConfig.hasTreeData ? importedConfig.templates : currentConfig.templates,
                    templateImages: pendingImportConfig.hasTemplateImages ? importedConfig.templateImages : currentConfig.templateImages,
                    chatGptPromptSettings: pendingImportConfig.hasChatGptPromptSettings
                        ? importedConfig.chatGptPromptSettings
                        : currentConfig.chatGptPromptSettings,
                    tools: pendingImportConfig.hasTools ? importedConfig.tools : currentConfig.tools
                };
            const nextConfigLocked = mode === "merge"
                ? Boolean(configLocked || (pendingImportConfig.hasLock && pendingImportConfig.locked))
                : Boolean(pendingImportConfig.hasLock && pendingImportConfig.locked);

            await saveTokens(nextConfig.tokens);
            await saveTemplateTreeData({ nodes: nextConfig.nodes, templates: nextConfig.templates });
            await saveTemplateImages(nextConfig.templateImages);
            await saveTools(nextConfig.tools);
            const savedConfigLocked = await saveConfigLocked(nextConfigLocked);
            const savedChatGptPromptSettings = await saveChatGptPromptSettings(nextConfig.chatGptPromptSettings);
            window.dispatchEvent(new CustomEvent("tools-updated"));

            const [normalizedTokens, normalizedTreeData] = await Promise.all([
                loadTokens(),
                loadTemplateTreeData()
            ]);
            setTokens(normalizedTokens);
            setTreeData(normalizedTreeData);
            setChatGptPromptSettings(savedChatGptPromptSettings);
            setConfigLocked(savedConfigLocked);
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
    }, [chatGptPromptSettings, configLocked, configName, navigate, pendingImportConfig, refreshStorageInfo, tokens, treeData]);

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

    const copyTestData = useCallback((scenario, sourceId) => {
        const source = TEST_DATA_SOURCES.find((entry) => entry.id === sourceId);
        const payload = source ? scenario?.[source.payloadKey] : null;
        if (!source || !payload) return;

        copyText(formatTestImportPayload(payload), {
            message: `${scenario.title}: ${source.label} copied`,
            variant: "success"
        });
    }, []);

    const resetStorage = useCallback(async () => {
        setConfirmReset(false);
        const keysToDelete = [];
        const appScopedLegacyKeys = new Set(["tokens", "models", "theme_pref", "active_client_payload", "recent_client_history", "agent_profile", "chatgpt_prompt_settings", "config_locked"]);
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

    const handleExportLockedChange = useCallback((event) => {
        setExportLocked(event.target.checked);
    }, []);

    const toggleExportOption = useCallback((optionId) => {
        const nextValue = !exportOptions[optionId];
        const allTopicIds = new Set(treeData.nodes.map((node) => node.id));
        setExportOptions((prev) => {
            const resolvedNextValue = !prev[optionId];
            const next = { ...prev, [optionId]: resolvedNextValue };
            if (optionId === "templates" && !resolvedNextValue) {
                next.templateImages = false;
            }
            if (optionId === "templateImages" && resolvedNextValue) {
                next.templates = true;
            }
            return next;
        });
        if (nextValue && (optionId === "templates" || optionId === "templateImages")) {
            setExportTopicIds((prev) => prev.size > 0 ? prev : allTopicIds);
        }
    }, [exportOptions, treeData.nodes]);

    const toggleExportTopic = useCallback((topicId) => {
        const affectedTopicIds = collectDescendantTopicIds(treeData.nodes, new Set([topicId]));
        setExportTopicIds((prev) => {
            const next = new Set(prev);
            if (next.has(topicId)) {
                affectedTopicIds.forEach((id) => next.delete(id));
            } else {
                affectedTopicIds.forEach((id) => next.add(id));
            }
            return next;
        });
    }, [treeData.nodes]);

    const selectAllExportTopics = useCallback(() => {
        setExportTopicIds(new Set(treeData.nodes.map((node) => node.id)));
    }, [treeData.nodes]);

    const clearExportTopics = useCallback(() => {
        setExportTopicIds(new Set());
    }, []);

    const handleExportNameKeyDown = useCallback((event) => {
        if (event.key === "Enter") doExport();
    }, [doExport]);

    const cancelReset = useCallback(() => {
        setConfirmReset(false);
    }, []);

    const activeSectionConfig = SETTINGS_SECTIONS.find((section) => section.id === activeSection) || SETTINGS_SECTIONS[0];
    const ActiveSectionIcon = activeSectionConfig.icon;
    const isToolsSection = isToolSettingsSection(activeSection);
    const customTokenCount = tokens.filter((tokenDef) => !tokenDef.system && !tokenDef.internal).length;
    const exportTopicOptions = buildTopicExportOptions(treeData.nodes);
    const selectedExportTopicCount = exportTopicOptions.filter(({ node }) => exportTopicIds.has(node.id)).length;
    const exportTopicCount = exportTopicOptions.length;

    const renderSettingsDetail = () => {
        switch (activeSection) {
            case SETTINGS_SECTION.LINK_TOOLS:
            case SETTINGS_SECTION.MODULE_TOOLS:
            case SETTINGS_SECTION.DATA_SHORTCUTS:
            case SETTINGS_SECTION.KEYBOARD_SHORTCUTS:
                return <ManageTools embedded detailOnly section={activeSection} />;
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
                                placeholder="Example: start with Hello {customer_name}, and end with Kind regards, {agent_firstName} from your Salt team."
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
                        <div className="settings-info-card">
                            <span>Modification lock</span>
                            <strong>{configLocked ? "Templates and tools are locked" : "Templates and tools are editable"}</strong>
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
                        <div className="settings-info-card">
                            <span>Capture order</span>
                            <strong>Copy SuperOffice first, then VTI, to test the full import popup.</strong>
                        </div>
                        <div className="settings-test-scenarios">
                            {TEST_IMPORT_SCENARIOS.map((scenario) => (
                                <article key={scenario.id} className="settings-test-scenario-card">
                                    <div className="settings-test-scenario-copy">
                                        <strong>{scenario.title}</strong>
                                        <span>{scenario.summary}</span>
                                    </div>
                                    <div className="settings-test-scenario-actions">
                                        {TEST_DATA_SOURCES.map((source) => {
                                            const hasPayload = Boolean(scenario[source.payloadKey]);
                                            if (!hasPayload) return null;
                                            return (
                                                <button
                                                    key={source.id}
                                                    type="button"
                                                    className={`settings-action-btn settings-action-btn--${source.id}`}
                                                    onClick={() => copyTestData(scenario, source.id)}
                                                >
                                                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                                                    <span>{source.buttonLabel}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </article>
                            ))}
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

                    <section
                        className={`settings-detail-panel${isToolsSection ? " settings-detail-panel--tools" : ""}`}
                        aria-labelledby={isToolsSection ? undefined : `settings-${activeSectionConfig.id}-title`}
                        aria-label={isToolsSection ? activeSectionConfig.label : undefined}
                    >
                        {!isToolsSection && (
                            <div className="settings-detail-hero">
                                <span className="settings-detail-icon"><ActiveSectionIcon size={28} aria-hidden="true" /></span>
                                <div>
                                    <h3 id={`settings-${activeSectionConfig.id}-title`}>{activeSectionConfig.label}</h3>
                                    <p>{activeSectionConfig.summary}</p>
                                </div>
                            </div>
                        )}
                        {renderSettingsDetail()}
                    </section>
                </div>
            </div>
            {exportNameOpen && (
                <Modal onClose={closeExportNameModal} ariaLabel="Configuration export" dialogClassName="popup-box settings-export-modal">
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
                        <div className="settings-export-options" role="group" aria-label="Content to export">
                            {EXPORT_CONTENT_OPTIONS.map((option) => (
                                <label
                                    key={option.id}
                                    className={`settings-export-option${exportOptions[option.id] ? " is-selected" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={Boolean(exportOptions[option.id])}
                                        onChange={() => toggleExportOption(option.id)}
                                    />
                                    <span>
                                        <strong>{option.label}</strong>
                                        <small>{option.summary}</small>
                                    </span>
                                </label>
                            ))}
                        </div>
                        {exportOptions.templates && (
                            <div className="settings-export-topic-panel">
                                <div className="settings-export-topic-head">
                                    <span>
                                        <strong>Topics to export</strong>
                                        <small>{selectedExportTopicCount} of {exportTopicCount} selected</small>
                                    </span>
                                    <div className="settings-export-topic-actions">
                                        <button type="button" className="secondary-btn" onClick={selectAllExportTopics}>All</button>
                                        <button type="button" className="secondary-btn" onClick={clearExportTopics}>None</button>
                                    </div>
                                </div>
                                <div className="settings-export-topic-list">
                                    {exportTopicOptions.length === 0 ? (
                                        <div className="settings-export-topic-empty">No topics to export.</div>
                                    ) : exportTopicOptions.map(({ node, depth }) => (
                                        <label
                                            key={node.id}
                                            className="settings-export-topic-row"
                                            style={{ "--topic-depth": depth }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={exportTopicIds.has(node.id)}
                                                onChange={() => toggleExportTopic(node.id)}
                                            />
                                            <span>{node.title || "Untitled topic"}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        <label className={`settings-lock-option${configLocked ? " is-forced" : ""}`}>
                            <input
                                type="checkbox"
                                checked={configLocked || exportLocked}
                                disabled={configLocked}
                                onChange={handleExportLockedChange}
                            />
                            <span className="settings-lock-option-icon"><Lock size={18} aria-hidden="true" /></span>
                            <span>
                                <strong>Lock templates and tools in this export</strong>
                                <small>Imported users can use templates and tools, but cannot edit templates or inspect tool URLs/modules.</small>
                            </span>
                        </label>
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
                            Merge keeps existing content, adds new imported items, and updates matching IDs.
                            Replace overwrites only the sections included in the file, so partial exports
                            leave omitted sections untouched.
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
