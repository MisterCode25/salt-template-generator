import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Cable,
    Camera,
    CheckCircle2,
    ChevronRight,
    Copy,
    FileText,
    Folder,
    Home,
    Mail,
    MessageSquare,
    Search,
    Settings,
    Smartphone,
    Star,
    Truck,
    Upload,
    Users,
    WalletCards,
    Wrench
} from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import {
    ClientInfoPanel,
    ClientPasteModal,
    TokenPromptModal,
    useTemplateRuntime,
    VariantModal
} from "../components/TemplateRuntime.jsx";
import { getTemplateTextResult } from "../core/tokenEngine.js";
import { loadTemplateTreeData, saveTemplateTreeData } from "../services/templateTreeService.js";
import { Channel } from "../models/templateTreeModel.js";
import { getChildNodes, getTemplatesForNode, updateTemplate } from "../utils/templateTreeOperations.js";
import {
    getAvailableTemplateChannels,
    getNodeCardSummary,
    getNodePath,
    getTemplatePath,
    resolveChannelModel,
    searchTemplateTree
} from "../utils/templateTreeNavigation.js";
import { formatTokenPreviewHTML } from "../utils/richTextTokens.js";
import { applyTheme, getInitialTheme } from "../utils/theme.js";
import ExternalGenerator from "./ExternalGenerator.jsx";
import ToolsBar from "../components/ToolsBar.jsx";

const CHANNEL_LABELS = {
    [Channel.EMAIL]: "Email",
    [Channel.SMS]: "SMS",
    [Channel.OTHER]: "Other"
};

const CHANNEL_META = {
    [Channel.EMAIL]: { label: "Email", Icon: Mail },
    [Channel.SMS]: { label: "SMS", Icon: MessageSquare },
    [Channel.OTHER]: { label: "Other", Icon: FileText }
};

const LANGUAGES = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
    { code: "it", label: "IT" }
];

const NODE_ICON_MAP = {
    "wifi-off": Wrench,
    wifi: Wrench,
    signal: Wrench,
    "signal-low": Wrench,
    globe: Folder,
    router: Wrench,
    ethernet: Cable,
    outage: Wrench,
    user: Users,
    users: Users,
    headset: Wrench,
    phone: Smartphone,
    "phone-off": Smartphone,
    home: Home,
    account: Users,
    mail: Mail,
    sms: MessageSquare,
    chat: MessageSquare,
    bell: MessageSquare,
    inbox: Folder,
    send: Mail,
    note: FileText,
    language: FileText,
    modem: Wrench,
    ont: Cable,
    server: Folder,
    laptop: Smartphone,
    mobile: Smartphone,
    tv: FileText,
    cable: Cable,
    tools: Wrench,
    wrench: Wrench,
    reboot: Wrench,
    refresh: Wrench,
    camera: Camera,
    upload: Upload,
    download: Upload,
    copy: Copy,
    link: FileText,
    warning: Wrench,
    alert: Wrench,
    clock: FileText,
    check: CheckCircle2,
    xmark: FileText,
    lock: FileText,
    shield: FileText,
    bolt: Wrench,
    star: FileText,
    flag: FileText,
    folder: Folder,
    tree: Folder,
    template: FileText,
    document: FileText,
    list: FileText,
    pin: Folder,
    map: Folder,
    tag: Folder
};

const TITLE_ICON_RULES = [
    { pattern: /photo|oto|camera|picture|screenshot/i, Icon: Camera },
    { pattern: /dispatch|intervention|truck|onsite|on-site/i, Icon: Truck },
    { pattern: /unreachable|contact|phone|mobile|call/i, Icon: Smartphone },
    { pattern: /fiber|fibre|cable|ont/i, Icon: Cable },
    { pattern: /billing|invoice|payment|admin|account/i, Icon: WalletCards },
    { pattern: /retention|customer|client|sales/i, Icon: Users },
    { pattern: /support|tech|repair|fix|router|signal|offline|reboot/i, Icon: Wrench },
    { pattern: /close|closure|done|resolved|check/i, Icon: CheckCircle2 },
    { pattern: /sms|message|general|chat/i, Icon: MessageSquare }
];

function toneForValue(value = "") {
    const source = String(value || "template");
    const total = [...source].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return `tone-${(total % 6) + 1}`;
}

function iconForItem(iconValue = "", title = "") {
    const normalizedIcon = String(iconValue || "").toLowerCase();
    if (NODE_ICON_MAP[normalizedIcon]) return NODE_ICON_MAP[normalizedIcon];

    const source = `${iconValue} ${title}`;
    const rule = TITLE_ICON_RULES.find(({ pattern }) => pattern.test(source));
    return rule?.Icon || Folder;
}

function templateIcon(template) {
    const source = `${template?.title || ""} ${template?.description || ""}`;
    const rule = TITLE_ICON_RULES.find(({ pattern }) => pattern.test(source));
    return rule?.Icon || FileText;
}

function IconBadge({ Icon, tone, className = "" }) {
    return (
        <span className={`templates-icon-badge ${tone || "tone-1"} ${className}`.trim()} aria-hidden="true">
            <Icon size={22} strokeWidth={1.9} />
        </span>
    );
}

function ChannelPills({ channels }) {
    return (
        <div className="templates-channel-pills">
            {channels.map((channel) => (
                <span key={channel} className="variant-pill">{CHANNEL_LABELS[channel] || channel}</span>
            ))}
        </div>
    );
}

function Breadcrumb({ nodes, activeNode, activeTemplate, onRoot, onNode }) {
    const path = activeTemplate
        ? getTemplatePath(nodes, activeTemplate)
        : activeNode
            ? getNodePath(nodes, activeNode.id)
            : [];

    return (
        <nav className="templates-breadcrumb" aria-label="Breadcrumb">
            <button type="button" className="templates-breadcrumb-home" onClick={onRoot} aria-label="Playbook root">
                <Home size={16} />
            </button>
            <ChevronRight size={15} aria-hidden="true" />
            {path.length === 0 ? (
                <span>Playbook</span>
            ) : (
                <>
                    <button type="button" onClick={onRoot}>Playbook</button>
                    {path.map((node, index) => {
                        const isLast = index === path.length - 1;
                        return (
                            <span key={node.id} className="templates-breadcrumb-step">
                                <ChevronRight size={15} aria-hidden="true" />
                                {isLast ? (
                                    <span>{node.title || "Untitled node"}</span>
                                ) : (
                                    <button type="button" onClick={() => onNode(node.id)}>
                                        {node.title || "Untitled node"}
                                    </button>
                                )}
                            </span>
                        );
                    })}
                </>
            )}
        </nav>
    );
}

function NodeCard({ node, nodes, templates, onOpen, selected }) {
    const summary = getNodeCardSummary(nodes, templates, node.id);
    const totalCount = summary.childCount + summary.templateCount;
    const Icon = iconForItem(node.icon, node.title);
    const tone = toneForValue(node.icon || node.title);

    return (
        <button
            type="button"
            className={`templates-card templates-card--node${selected ? " is-selected" : ""}`}
            onClick={() => onOpen(node.id)}
        >
            <span className="templates-card-topline">
                <IconBadge Icon={Icon} tone={tone} />
                {totalCount > 0 && (
                    <span className="templates-count-pill">
                        <Folder size={13} aria-hidden="true" />
                        {totalCount}
                    </span>
                )}
            </span>
            <span className="templates-card-title-row">
                <strong>{node.title || "Untitled node"}</strong>
                <ChevronRight size={22} aria-hidden="true" />
            </span>
            {node.description && <small>{node.description}</small>}
        </button>
    );
}

function BusinessTemplateCard({ template, onOpen, selected }) {
    const availableChannels = getAvailableTemplateChannels(template);
    const channels = availableChannels.length > 0 ? availableChannels : template.channels;
    const Icon = templateIcon(template);
    const tone = toneForValue(template.title);

    return (
        <button
            type="button"
            className={`templates-card templates-card--template${selected ? " is-selected" : ""}`}
            onClick={() => onOpen(template.id)}
        >
            <span className="templates-card-topline">
                <IconBadge Icon={Icon} tone={tone} />
            </span>
            <span className="templates-card-title-row">
                <strong>{template.title || "Untitled template"}</strong>
            </span>
            {template.description && <small>{template.description}</small>}
            <ChannelPills channels={channels} />
        </button>
    );
}

function EmptyColumnState({ message }) {
    return (
        <div className="templates-column-empty">
            <Folder size={30} strokeWidth={1.7} />
            <span>{message}</span>
        </div>
    );
}

function PlaybookColumn({
    title,
    description,
    nodes: columnNodes,
    templates: columnTemplates,
    allNodes,
    allTemplates,
    activeNodeId,
    activeTemplateId,
    onOpenNode,
    onOpenTemplate,
    emptyMessage
}) {
    const hasItems = columnNodes.length > 0 || columnTemplates.length > 0;

    return (
        <section className="templates-column" aria-label={title || "Playbook column"}>
            <div className="templates-column-head">
                <h2>{title || "Playbook"}</h2>
                {description && <p>{description}</p>}
            </div>
            <div className="templates-column-list">
                {hasItems ? (
                    <>
                        {columnNodes.map((node) => {
                            const summary = getNodeCardSummary(allNodes, allTemplates, node.id);
                            const totalCount = summary.childCount + summary.templateCount;
                            const Icon = iconForItem(node.icon, node.title);
                            return (
                                <button
                                    key={node.id}
                                    type="button"
                                    className={`templates-column-row templates-column-row--node${activeNodeId === node.id ? " is-active" : ""}`}
                                    onClick={() => onOpenNode(node.id)}
                                >
                                    <IconBadge Icon={Icon} tone={toneForValue(node.icon || node.title)} />
                                    <span className="templates-column-copy">
                                        <strong>{node.title || "Untitled node"}</strong>
                                        {node.description && <small>{node.description}</small>}
                                    </span>
                                    {totalCount > 0 && <span className="templates-column-count">{totalCount}</span>}
                                    <ChevronRight className="templates-column-chevron" size={19} aria-hidden="true" />
                                </button>
                            );
                        })}
                        {columnTemplates.map((template) => {
                            const Icon = templateIcon(template);
                            const availableChannels = getAvailableTemplateChannels(template);
                            const channels = availableChannels.length > 0 ? availableChannels : template.channels;
                            return (
                                <button
                                    key={template.id}
                                    type="button"
                                    className={`templates-column-row templates-column-row--template${activeTemplateId === template.id ? " is-active" : ""}`}
                                    onClick={() => onOpenTemplate(template.id)}
                                >
                                    <IconBadge Icon={Icon} tone={toneForValue(template.title)} />
                                    <span className="templates-column-copy">
                                        <strong>{template.title || "Untitled template"}</strong>
                                        {template.description && <small>{template.description}</small>}
                                        <ChannelPills channels={channels} />
                                    </span>
                                </button>
                            );
                        })}
                    </>
                ) : (
                    <EmptyColumnState message={emptyMessage || "No item here."} />
                )}
            </div>
        </section>
    );
}

const TEMPLATE_TOKEN_PATTERN = /\{[^{}]+\}/g;

function escapePreviewHTML(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function resolvePreviewTokenValue(tokenName, tokenMap, values = {}) {
    const tokenDef = tokenMap.get(tokenName);
    const value = values[tokenName] ?? tokenDef?.default ?? "";
    return value === "" || value === null || value === undefined ? null : String(value);
}

function formatResultPreviewText(value = "", tokens = [], values = {}) {
    const tokenMap = new Map(tokens.map((tokenDef) => [tokenDef.token, tokenDef]));
    return String(value || "").replace(TEMPLATE_TOKEN_PATTERN, (tokenName) =>
        resolvePreviewTokenValue(tokenName, tokenMap, values) ?? tokenName
    );
}

function formatResultPreviewHTML(value = "", tokens = [], values = {}) {
    const tokenMap = new Map(tokens.map((tokenDef) => [tokenDef.token, tokenDef]));
    const hydrated = String(value || "").replace(TEMPLATE_TOKEN_PATTERN, (tokenName) => {
        const resolved = resolvePreviewTokenValue(tokenName, tokenMap, values);
        return resolved === null ? tokenName : escapePreviewHTML(resolved);
    });
    return formatTokenPreviewHTML(hydrated, tokens);
}

function TemplateDetail({ template, activeChannel, setActiveChannel, runtime, onManage, onToggleFavorite }) {
    const availableChannels = getAvailableTemplateChannels(template);
    const visibleChannels = (availableChannels.length > 0 ? availableChannels : template.channels)
        .filter((channel, index, list) => list.indexOf(channel) === index);
    const channelPreviews = visibleChannels.map((channel) => {
        const channelModel = resolveChannelModel(template, channel);
        const textResult = getTemplateTextResult(channelModel, runtime.lang);
        const subject = channelModel?.title || template.title || "Untitled template";
        return {
            channel,
            model: channelModel,
            langLabel: textResult.isFallback
                ? `${(textResult.lang || runtime.lang).toUpperCase()} fallback`
                : (textResult.lang || runtime.lang).toUpperCase(),
            subject: formatResultPreviewText(subject, runtime.tokens, runtime.values),
            html: formatResultPreviewHTML(textResult.text, runtime.tokens, runtime.values),
            meta: CHANNEL_META[channel] || CHANNEL_META[Channel.OTHER]
        };
    });
    const activePreview = channelPreviews.find((preview) => preview.channel === activeChannel) || channelPreviews[0] || null;
    const model = activePreview?.model || null;
    const hasVariants = Boolean(model?.variants?.length);
    const copyKey = `tree_${template.id}_${activePreview?.channel || activeChannel}`;
    const detailIcon = templateIcon(template);
    const detailTone = toneForValue(template.title);

    const copyTemplate = () => {
        if (!model) return;
        runtime.requestCopy(model, copyKey);
    };

    const selectChannel = (channel) => {
        setActiveChannel(channel);
        const nextModel = resolveChannelModel(template, channel);
        if (nextModel) {
            runtime.requestTokenInputs(nextModel, `tree_${template.id}_${channel}`);
        }
    };

    const handleChannelCardKeyDown = (event, channel) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectChannel(channel);
    };

    return (
        <>
            <aside className="templates-detail-panel" aria-label="Template detail">
                <div className="templates-detail-head">
                    <div className="templates-detail-title">
                        <IconBadge Icon={detailIcon} tone={detailTone} />
                        <div>
                            <p>Selected template</p>
                            <h2>{template.title || "Untitled template"}</h2>
                        </div>
                    </div>
                    <div className="templates-detail-head-actions">
                        <button
                            type="button"
                            className={`templates-favorite-btn${template.favorite ? " is-favorite" : ""}`}
                            onClick={() => onToggleFavorite(template.id)}
                            aria-label={template.favorite ? "Remove from favorites" : "Add to favorites"}
                            title={template.favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Star size={18} fill={template.favorite ? "currentColor" : "none"} />
                        </button>
                        <button type="button" className="secondary-btn templates-manage-btn" onClick={onManage}>
                            <Settings size={17} aria-hidden="true" />
                            Manage playbook
                        </button>
                    </div>
                </div>

                {model ? (
                    <div className="templates-template-fields">
                        <div className="templates-channel-result-grid">
                            {channelPreviews.map((preview) => {
                                const isActive = preview.channel === (activePreview?.channel || activeChannel);
                                const PreviewIcon = preview.meta.Icon;
                                return (
                                    <article
                                        key={preview.channel}
                                        className={`templates-channel-result${isActive ? " is-active" : ""}`}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={isActive}
                                        onClick={() => selectChannel(preview.channel)}
                                        onKeyDown={(event) => handleChannelCardKeyDown(event, preview.channel)}
                                    >
                                        <div className="templates-channel-result-head">
                                            <span className="templates-channel-result-label">
                                                <PreviewIcon size={17} aria-hidden="true" />
                                                <strong>{preview.meta.label}</strong>
                                            </span>
                                            <span className="templates-channel-lang">{preview.langLabel}</span>
                                        </div>
                                        {preview.channel === Channel.EMAIL && preview.subject && (
                                            <div className="templates-channel-subject">
                                                <span>Subject</span>
                                                <strong>{preview.subject}</strong>
                                            </div>
                                        )}
                                        <div className="templates-consultation-preview">
                                            <div
                                                key={`${preview.channel}-${runtime.lang}-${preview.langLabel}`}
                                                className="rich-preview templates-html-preview"
                                                data-placeholder="No content for this language."
                                                dangerouslySetInnerHTML={{ __html: preview.html }}
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {hasVariants && (
                            <div className="templates-variant-grid">
                                <button type="button" className="templates-variant-card" onClick={() => runtime.copyModel(model, `${copyKey}_main`)}>
                                    <strong>{model.mainVariantName?.trim() || model.title || "Main text"}</strong>
                                    <span>Copy main version</span>
                                </button>
                                {model.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        className="templates-variant-card"
                                        onClick={() => runtime.copyModel(variant, `${copyKey}_${variant.id}`, model)}
                                    >
                                        <strong>{variant.name || "Variant"}</strong>
                                        <span>Copy variant</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="templates-detail-actions">
                            <button type="button" className="primary-btn" onClick={copyTemplate}>
                                <Copy size={17} aria-hidden="true" />
                                Copy
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="templates-content-card">
                        <EmptyState message={`No ${CHANNEL_LABELS[activeChannel]} content linked to this business template.`} />
                    </div>
                )}
            </aside>
        </>
    );
}

export default function Templates() {
    const navigate = useNavigate();
    const runtime = useTemplateRuntime();
    const [nodes, setNodes] = useState([]);
    const [treeTemplates, setTreeTemplates] = useState([]);
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [activeTemplateId, setActiveTemplateId] = useState(null);
    const [activeChannel, setActiveChannel] = useState(Channel.EMAIL);
    const [query, setQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(() => getInitialTheme());
    const [externalGeneratorOpen, setExternalGeneratorOpen] = useState(false);
    const [externalGeneratorClosing, setExternalGeneratorClosing] = useState(false);
    const configName = localStorage.getItem("local_configName") || "No configuration";

    useEffect(() => {
        loadTemplateTreeData().then((treeData) => {
            setNodes(treeData.nodes);
            setTreeTemplates(treeData.templates);
        });
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        const handler = (event) => {
            if (!event.target.closest(".options-dropdown")) setDropdownOpen(false);
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const favoriteTemplates = useMemo(
        () => treeTemplates.filter((t) => t.favorite),
        [treeTemplates]
    );

    const toggleFavorite = async (templateId) => {
        const template = treeTemplates.find((t) => t.id === templateId);
        if (!template) return;
        const nextTemplates = updateTemplate(treeTemplates, templateId, { favorite: !template.favorite });
        setTreeTemplates(nextTemplates);
        await saveTemplateTreeData({ nodes, templates: nextTemplates });
    };

    const activeNode = useMemo(
        () => nodes.find((node) => node.id === activeNodeId) || null,
        [nodes, activeNodeId]
    );
    const activeTemplate = useMemo(
        () => treeTemplates.find((template) => template.id === activeTemplateId) || null,
        [treeTemplates, activeTemplateId]
    );
    const rootNodes = useMemo(() => getChildNodes(nodes, null), [nodes]);
    const searchResults = useMemo(
        () => searchTemplateTree(nodes, treeTemplates, query),
        [nodes, treeTemplates, query]
    );
    const activeNodePath = useMemo(
        () => activeNode ? getNodePath(nodes, activeNode.id) : [],
        [nodes, activeNode]
    );

    useEffect(() => {
        if (!activeTemplate) return;
        const available = getAvailableTemplateChannels(activeTemplate);
        const preferred = available[0] || activeTemplate.channels[0] || Channel.EMAIL;
        if (!available.includes(activeChannel) && !activeTemplate.channels.includes(activeChannel)) {
            setActiveChannel(preferred);
        }
    }, [activeTemplate, activeChannel]);

    const openNode = (nodeId) => {
        setActiveNodeId(nodeId);
        setActiveTemplateId(null);
        setQuery("");
    };

    const openRoot = () => {
        setActiveNodeId(null);
        setActiveTemplateId(null);
        setQuery("");
    };

    const resetCaseNavigation = () => {
        setActiveNodeId(null);
        setActiveTemplateId(null);
        setActiveChannel(Channel.EMAIL);
        setQuery("");
    };

    const clearClientAndResetCase = () => {
        runtime.clearClientInfo();
        resetCaseNavigation();
    };

    const importClientFromClipboardAndResetCase = async (event) => {
        const imported = await runtime.readClientClipboard(event);
        if (imported) resetCaseNavigation();
    };

    const importClientFromPasteAndResetCase = (text) => {
        runtime.importClientFromPaste(text);
        resetCaseNavigation();
    };

    const changeLanguage = (code) => {
        runtime.setLang(code);
    };

    const requestFirstMissingChannelInputs = (template, preferredChannel) => {
        if (!template) return false;
        const available = getAvailableTemplateChannels(template);
        const channels = (available.length > 0 ? available : template.channels)
            .filter((channel, index, list) => list.indexOf(channel) === index);
        const orderedChannels = [
            preferredChannel,
            ...channels.filter((channel) => channel !== preferredChannel)
        ].filter(Boolean);

        for (const channel of orderedChannels) {
            const model = resolveChannelModel(template, channel);
            if (model && runtime.requestTokenInputs(model, `tree_${template.id}_${channel}`)) {
                setActiveChannel(channel);
                return true;
            }
        }

        return false;
    };

    const openTemplate = (templateId) => {
        const template = treeTemplates.find((candidate) => candidate.id === templateId);
        setActiveTemplateId(templateId);
        if (template?.parentNodeId) setActiveNodeId(template.parentNodeId);
        const channels = template ? getAvailableTemplateChannels(template) : [];
        const nextChannel = channels[0] || template?.channels?.[0] || Channel.EMAIL;
        setActiveChannel(nextChannel);
        requestFirstMissingChannelInputs(template, nextChannel);
        setQuery("");
    };

    const openExternalGenerator = () => {
        setExternalGeneratorClosing(false);
        setExternalGeneratorOpen(true);
    };

    const closeExternalGenerator = () => {
        setExternalGeneratorClosing(true);
        window.setTimeout(() => {
            setExternalGeneratorOpen(false);
            setExternalGeneratorClosing(false);
        }, 220);
    };

    const searchMode = query.trim().length > 0 && !activeTemplate;
    const panelTitle = activeNode ? activeNode.title : "Playbook";
    const panelDescription = activeNode?.description || "Navigate through nodes to find the right template";
    const navigationColumns = useMemo(() => {
        if (searchMode) {
            const count = searchResults.nodes.length + searchResults.templates.length;
            return [{
                id: "search",
                title: "Search results",
                description: `${count} result${count === 1 ? "" : "s"}`,
                nodes: searchResults.nodes,
                templates: searchResults.templates,
                emptyMessage: "No result found."
            }];
        }

        const columns = [{
            id: "root",
            title: "Playbook",
            description: "Root nodes",
            nodes: rootNodes,
            templates: [],
            emptyMessage: "No business nodes yet."
        }];

        activeNodePath.forEach((node) => {
            columns.push({
                id: node.id,
                title: node.title || "Untitled node",
                description: node.description,
                nodes: getChildNodes(nodes, node.id),
                templates: getTemplatesForNode(treeTemplates, node.id),
                emptyMessage: "No sub-node or template in this node."
            });
        });

        return columns;
    }, [activeNodePath, nodes, rootNodes, searchMode, searchResults, treeTemplates]);

    return (
        <main className="page-container page-container--home templates-page">
            <header className="app-header templates-app-header">
                <div className="app-title">
                    Salt Templater
                    {configName && configName !== "No configuration" && (
                        <span className="app-title-config"> ({configName})</span>
                    )}
                </div>
                <nav className="top-menu">
                    <div className="dropdown options-dropdown">
                        <button type="button" className="dropdown-btn" aria-haspopup="menu" aria-expanded={dropdownOpen} onClick={() => setDropdownOpen((open) => !open)}>
                            Options ▾
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu is-open" role="menu">
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Management</div>
                                    <button type="button" role="menuitem" onClick={() => { navigate("/nodes"); setDropdownOpen(false); }} className="dropdown-reset">Manage nodes</button>
                                    <button type="button" role="menuitem" onClick={() => { navigate("/tokens"); setDropdownOpen(false); }} className="dropdown-reset">Manage tokens</button>
                                    <button type="button" role="menuitem" onClick={() => { navigate("/settings"); setDropdownOpen(false); }} className="dropdown-reset">Settings</button>
                                </div>
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Tools</div>
                                    <button type="button" role="menuitem" onClick={() => { navigate("/tools"); setDropdownOpen(false); }} className="dropdown-reset">Manage tools</button>
                                    <button type="button" role="menuitem" onClick={() => { navigate("/vti-bookmarklet"); setDropdownOpen(false); }} className="dropdown-reset">VTI shortcut</button>
                                </div>
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Theme</div>
                                    <button type="button" role="menuitem" className={`dropdown-reset${theme === "dark" ? " is-active" : ""}`} onClick={() => { setTheme("dark"); setDropdownOpen(false); }}>Dark</button>
                                    <button type="button" role="menuitem" className={`dropdown-reset${theme === "light" ? " is-active" : ""}`} onClick={() => { setTheme("light"); setDropdownOpen(false); }}>Clear</button>
                                    <button type="button" role="menuitem" className={`dropdown-reset${theme === "salt" ? " is-active" : ""}`} onClick={() => { setTheme("salt"); setDropdownOpen(false); }}>Salt</button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <ClientInfoPanel
                sections={runtime.clientInfoSections}
                summaryFields={runtime.clientSummaryFields}
                status={runtime.clientImportStatus}
                loading={runtime.clientImportLoading}
                detailsExpanded={runtime.clientDetailsExpanded}
                lang={runtime.lang}
                onChangeLang={changeLanguage}
                onReadClipboard={importClientFromClipboardAndResetCase}
                onOpenPaste={() => {
                    runtime.setClientPasteInitialError(runtime.clientImportStatus.message || "");
                    runtime.setClientPasteOpen(true);
                }}
                onClearClient={clearClientAndResetCase}
                onToggleDetails={() => runtime.setClientDetailsExpanded((expanded) => !expanded)}
            />

            <ToolsBar values={runtime.values} onOpenExternalGenerator={openExternalGenerator} />

            <section className="templates-workbench templates-workbench--columns">
                <section className="templates-playbook-panel" aria-label="Playbook">
                    <div className="templates-playbook-head">
                        <div className="templates-playbook-title">
                            <IconBadge Icon={activeNode ? iconForItem(activeNode.icon, activeNode.title) : Folder} tone={toneForValue(panelTitle)} className="templates-title-icon" />
                            <div>
                                <h1>{panelTitle || "Playbook"}</h1>
                                <p>{searchMode ? "Search across nodes and templates" : panelDescription}</p>
                            </div>
                        </div>
                        <button type="button" className="secondary-btn templates-manage-btn" onClick={() => navigate("/nodes")}>
                            <Settings size={17} aria-hidden="true" />
                            Manage playbook
                        </button>
                    </div>

                    <div className="templates-playbook-controls">
                        {(activeNode || activeTemplate || searchMode) && (
                            <Breadcrumb
                                nodes={nodes}
                                activeNode={activeNode}
                                activeTemplate={activeTemplate}
                                onRoot={openRoot}
                                onNode={openNode}
                            />
                        )}
                        <label className="templates-search-wrap">
                            <span className="sr-only">Search in playbook</span>
                            <Search size={18} aria-hidden="true" />
                            <input
                                type="text"
                                className="templates-search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={activeNode ? "Search..." : "Search in playbook..."}
                            />
                        </label>
                    </div>

                    {favoriteTemplates.length > 0 && (
                        <div className="templates-favorites">
                            <div className="templates-favorites-head">
                                <Star size={14} fill="currentColor" aria-hidden="true" />
                                <span>Favorites</span>
                            </div>
                            <div className="templates-favorites-list">
                                {favoriteTemplates.map((template) => {
                                    const FavIcon = templateIcon(template);
                                    return (
                                        <button
                                            key={template.id}
                                            type="button"
                                            className={`templates-favorites-item${activeTemplateId === template.id ? " is-active" : ""}`}
                                            onClick={() => openTemplate(template.id)}
                                        >
                                            <IconBadge Icon={FavIcon} tone={toneForValue(template.title)} className="templates-favorites-icon" />
                                            <span>{template.title || "Untitled"}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="templates-columns" aria-label="Playbook columns">
                        {navigationColumns.map((column) => (
                            <PlaybookColumn
                                key={column.id}
                                title={column.title}
                                description={column.description}
                                nodes={column.nodes}
                                templates={column.templates}
                                allNodes={nodes}
                                allTemplates={treeTemplates}
                                activeNodeId={activeNodeId}
                                activeTemplateId={activeTemplateId}
                                onOpenNode={openNode}
                                onOpenTemplate={openTemplate}
                                emptyMessage={column.emptyMessage}
                            />
                        ))}
                    </div>

                    {!activeNode && !activeTemplate && !searchMode && (
                        <div className="templates-bottom-trail">
                            <Breadcrumb
                                nodes={nodes}
                                activeNode={activeNode}
                                activeTemplate={activeTemplate}
                                onRoot={openRoot}
                                onNode={openNode}
                            />
                        </div>
                    )}
                </section>
            </section>

            {activeTemplate && (
                <Modal
                    onClose={() => setActiveTemplateId(null)}
                    dialogClassName="popup-box templates-template-modal"
                    ariaLabel="Template preview"
                >
                    <div className="templates-template-modal-bar">
                        <button type="button" className="secondary-btn" onClick={() => setActiveTemplateId(null)}>
                            Close
                        </button>
                    </div>
                    <TemplateDetail
                        template={activeTemplate}
                        activeChannel={activeChannel}
                        setActiveChannel={setActiveChannel}
                        runtime={runtime}
                        onManage={() => navigate("/nodes")}
                        onToggleFavorite={toggleFavorite}
                    />
                </Modal>
            )}

            {runtime.variantPicker && (
                <VariantModal
                    model={runtime.variantPicker.model}
                    displayTitle={formatResultPreviewText(
                        runtime.variantPicker.model?.title || "",
                        runtime.tokens,
                        runtime.values
                    )}
                    onClose={() => runtime.setVariantPicker(null)}
                    onSelect={(variant) => {
                        if (variant) {
                            runtime.copyModel(
                                variant,
                                `variant_${runtime.variantPicker.model.id}_${variant.id}`,
                                runtime.variantPicker.model
                            );
                        } else {
                            runtime.copyModel(runtime.variantPicker.model, runtime.variantPicker.sectionKey || `main_${runtime.variantPicker.model.id}`);
                        }
                        runtime.setVariantPicker(null);
                    }}
                />
            )}

            {runtime.tokenPrompt && (
                <TokenPromptModal
                    title={runtime.tokenPrompt.title}
                    tokenDefs={runtime.tokenPrompt.tokenDefs}
                    values={runtime.values}
                    missingTokens={runtime.promptMissingTokens}
                    mode={runtime.tokenPrompt.mode}
                    onChange={(token, nextValue) => {
                        runtime.setValues((prev) => {
                            const next = { ...prev, [token]: nextValue };
                            localStorage.setItem("input_" + token, nextValue);
                            return next;
                        });
                        runtime.setPromptMissingTokens((prev) => prev.filter((name) => name !== token));
                        runtime.inputChangeVersion.current++;
                    }}
                    onConfirm={runtime.confirmTokenPrompt}
                    onClose={() => {
                        const defs = runtime.tokenPrompt?.tokenDefs ?? [];
                        runtime.setPromptMissingTokens([]);
                        runtime.setTokenPrompt(null);
                        runtime.clearOnDemandValues(defs);
                    }}
                />
            )}

            {runtime.clientPasteOpen && (
                <ClientPasteModal
                    initialError={runtime.clientPasteInitialError}
                    onClose={() => {
                        runtime.setClientPasteOpen(false);
                        runtime.setClientPasteInitialError("");
                    }}
                    onImport={importClientFromPasteAndResetCase}
                />
            )}

            {externalGeneratorOpen && (
                <Modal
                    onClose={closeExternalGenerator}
                    overlayClassName={`popup external-generator-overlay${externalGeneratorClosing ? " is-closing" : ""}`}
                    dialogClassName={`popup-box external-generator-overlay-box${externalGeneratorClosing ? " is-closing" : ""}`}
                    ariaLabel="External Generator"
                >
                    <ExternalGenerator embedded onClose={closeExternalGenerator} clientPayload={runtime.clientPayload} />
                </Modal>
            )}
        </main>
    );
}
