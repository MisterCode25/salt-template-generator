import { lazy, memo, Suspense, useCallback, useDeferredValue, useMemo, useRef, useEffect, useState } from "react";
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
    TemplateResultModal,
    TokenPromptModal,
    useTemplateRuntime,
    VariantModal
} from "../components/TemplateRuntime.jsx";
import { getTemplateTextResult } from "../core/tokenEngine.js";
import { loadTemplateTreeData, saveTemplateTreeData } from "../services/templateTreeService.js";
import { Channel } from "../models/templateTreeModel.js";
import {
    buildNodeChildrenIndex,
    buildNodeLookup,
    buildTemplateNodeIndex,
    getIndexedChildNodes,
    getIndexedTemplatesForNode,
    updateTemplate
} from "../utils/templateTreeOperations.js";
import {
    buildTemplateTreeSearchIndex,
    getAvailableTemplateChannels,
    resolveChannelModel,
    searchTemplateTreeIndex
} from "../utils/templateTreeNavigation.js";
import { formatTokenPreviewHTML } from "../utils/richTextTokens.js";
import { applyTheme, getInitialTheme } from "../utils/theme.js";
import ToolsBar from "../components/ToolsBar.jsx";

const ExternalGenerator = lazy(() => import("./ExternalGenerator.jsx"));
const ManageNodes = lazy(() => import("./ManageNodes.jsx"));
const ManageTokens = lazy(() => import("./ManageTokens.jsx"));
const ManageTools = lazy(() => import("./ManageTools.jsx"));
const SettingsPage = lazy(() => import("./Settings.jsx"));
const VtiBookmarklet = lazy(() => import("./VtiBookmarklet.jsx"));

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

const EMPTY_NODE_SUMMARY = Object.freeze({ childCount: 0, templateCount: 0 });

function getTemplateDisplayChannels(template) {
    if (!template) return [];
    const availableChannels = getAvailableTemplateChannels(template);
    return availableChannels.length > 0 ? availableChannels : template.channels;
}

function buildTemplateDisplayChannelIndex(templates = []) {
    return new Map(
        templates.map((template) => [template.id, getTemplateDisplayChannels(template)])
    );
}

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
    const source = `${template?.title || ""}`;
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

function EmptyColumnState({ message }) {
    return (
        <div className="templates-column-empty">
            <Folder size={30} strokeWidth={1.7} />
            <span>{message}</span>
        </div>
    );
}

const PlaybookNodeRow = memo(function PlaybookNodeRow({
    node,
    summary,
    selected,
    onOpenNode
}) {
    const totalCount = summary.childCount + summary.templateCount;
    const Icon = iconForItem(node.icon, node.title);

    return (
        <button
            type="button"
            className={`templates-column-row templates-column-row--node${selected ? " is-active" : ""}`}
            onClick={() => onOpenNode(node.id)}
        >
            <IconBadge Icon={Icon} tone={toneForValue(node.icon || node.title)} />
            <span className="templates-column-copy">
                <strong>{node.title || "Untitled section"}</strong>
            </span>
            {totalCount > 0 && <span className="templates-column-count">{totalCount}</span>}
            <ChevronRight className="templates-column-chevron" size={19} aria-hidden="true" />
        </button>
    );
});

const PlaybookTemplateRow = memo(function PlaybookTemplateRow({
    template,
    channels,
    selected,
    onOpenTemplate
}) {
    const Icon = templateIcon(template);

    return (
        <button
            type="button"
            className={`templates-column-row templates-column-row--template${selected ? " is-active" : ""}`}
            onClick={() => onOpenTemplate(template.id)}
        >
            <IconBadge Icon={Icon} tone={toneForValue(template.title)} />
            <span className="templates-column-copy">
                <strong>{template.title || "Untitled template"}</strong>
                <ChannelPills channels={channels} />
            </span>
        </button>
    );
});

const FavoriteTemplateButton = memo(function FavoriteTemplateButton({
    template,
    selected,
    onOpenTemplate
}) {
    const Icon = templateIcon(template);
    const handleClick = useCallback(() => {
        onOpenTemplate(template.id);
    }, [onOpenTemplate, template.id]);

    return (
        <button
            type="button"
            className={`templates-favorites-item${selected ? " is-active" : ""}`}
            onClick={handleClick}
        >
            <IconBadge Icon={Icon} tone={toneForValue(template.title)} className="templates-favorites-icon" />
            <span>{template.title || "Untitled"}</span>
        </button>
    );
});

const PlaybookSearchBox = memo(function PlaybookSearchBox({
    placeholder,
    resetSignal,
    onQueryChange
}) {
    const [draftQuery, setDraftQuery] = useState("");
    const deferredDraftQuery = useDeferredValue(draftQuery);

    useEffect(() => {
        setDraftQuery("");
        onQueryChange("");
    }, [onQueryChange, resetSignal]);

    useEffect(() => {
        onQueryChange(deferredDraftQuery);
    }, [deferredDraftQuery, onQueryChange]);

    const handleChange = useCallback((event) => {
        setDraftQuery(event.target.value);
    }, []);

    return (
        <label className="templates-search-wrap">
            <span className="sr-only">Search in playbook</span>
            <Search size={17} aria-hidden="true" />
            <input
                type="text"
                className="templates-search"
                value={draftQuery}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </label>
    );
});

const PlaybookColumn = memo(function PlaybookColumn({
    title,
    nodes: columnNodes,
    templates: columnTemplates,
    nodeSummaryById,
    activeNodeId,
    activeTemplateId,
    templateChannelsById,
    onOpenNode,
    onOpenTemplate,
    emptyMessage
}) {
    const hasItems = columnNodes.length > 0 || columnTemplates.length > 0;

    return (
        <section className="templates-column" aria-label={title || "Playbook column"}>
            <div className="templates-column-list">
                {hasItems ? (
                    <>
                        {columnNodes.map((node) => {
                            const summary = nodeSummaryById.get(node.id) || EMPTY_NODE_SUMMARY;
                            return (
                                <PlaybookNodeRow
                                    key={node.id}
                                    node={node}
                                    summary={summary}
                                    selected={activeNodeId === node.id}
                                    onOpenNode={onOpenNode}
                                />
                            );
                        })}
                        {columnTemplates.map((template) => {
                            return (
                                <PlaybookTemplateRow
                                    key={template.id}
                                    template={template}
                                    channels={templateChannelsById.get(template.id) || template.channels}
                                    selected={activeTemplateId === template.id}
                                    onOpenTemplate={onOpenTemplate}
                                />
                            );
                        })}
                    </>
                ) : (
                    <EmptyColumnState message={emptyMessage || "No item here."} />
                )}
            </div>
        </section>
    );
});

const TEMPLATE_TOKEN_PATTERN = /\{[^{}]+\}/g;
const EMPTY_TOKEN_MAP = new Map();

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

function buildPreviewTokenMap(tokens = []) {
    return new Map(tokens.map((tokenDef) => [tokenDef.token, tokenDef]));
}

function formatResultPreviewText(value = "", tokenMap = EMPTY_TOKEN_MAP, values = {}) {
    return String(value || "").replace(TEMPLATE_TOKEN_PATTERN, (tokenName) =>
        resolvePreviewTokenValue(tokenName, tokenMap, values) ?? tokenName
    );
}

function formatResultPreviewHTML(value = "", tokenMap = EMPTY_TOKEN_MAP, tokens = [], values = {}) {
    const hydrated = String(value || "").replace(TEMPLATE_TOKEN_PATTERN, (tokenName) => {
        const resolved = resolvePreviewTokenValue(tokenName, tokenMap, values);
        return resolved === null ? tokenName : escapePreviewHTML(resolved);
    });
    return formatTokenPreviewHTML(hydrated, tokens);
}

const TemplateChannelPreviewCard = memo(function TemplateChannelPreviewCard({
    preview,
    isActive,
    lang,
    onSelectChannel
}) {
    const PreviewIcon = preview.meta.Icon;
    const handleClick = useCallback(() => {
        onSelectChannel(preview.channel);
    }, [onSelectChannel, preview.channel]);
    const handleKeyDown = useCallback((event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onSelectChannel(preview.channel);
    }, [onSelectChannel, preview.channel]);

    return (
        <article
            className={`templates-channel-result${isActive ? " is-active" : ""}`}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
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
                    key={`${preview.channel}-${lang}-${preview.langLabel}`}
                    className="rich-preview templates-html-preview"
                    data-placeholder="No content for this language."
                    dangerouslySetInnerHTML={{ __html: preview.html }}
                />
            </div>
        </article>
    );
});

const TemplateDetail = memo(function TemplateDetail({
    template,
    activeChannel,
    setActiveChannel,
    visibleChannels,
    lang,
    tokens,
    values,
    onRequestCopy,
    onRequestTemplateResult,
    onSetVariantPicker,
    onManage,
    onToggleFavorite
}) {
    const previewTokenMap = useMemo(() => buildPreviewTokenMap(tokens), [tokens]);
    const uniqueVisibleChannels = useMemo(
        () => visibleChannels.filter((channel, index, list) => list.indexOf(channel) === index),
        [visibleChannels]
    );
    const channelPreviews = useMemo(() => uniqueVisibleChannels.map((channel) => {
        const channelModel = resolveChannelModel(template, channel);
        const textResult = getTemplateTextResult(channelModel, lang);
        const subject = channelModel?.title || template.title || "Untitled template";
        return {
            channel,
            model: channelModel,
            langLabel: textResult.isFallback
                ? `${(textResult.lang || lang).toUpperCase()} fallback`
                : (textResult.lang || lang).toUpperCase(),
            subject: formatResultPreviewText(subject, previewTokenMap, values),
            html: formatResultPreviewHTML(textResult.text, previewTokenMap, tokens, values),
            meta: CHANNEL_META[channel] || CHANNEL_META[Channel.OTHER]
        };
    }), [lang, previewTokenMap, template, tokens, uniqueVisibleChannels, values]);
    const activePreview = useMemo(
        () => channelPreviews.find((preview) => preview.channel === activeChannel) || channelPreviews[0] || null,
        [activeChannel, channelPreviews]
    );
    const model = activePreview?.model || null;
    const hasVariants = Boolean(model?.variants?.length);
    const copyKey = `tree_${template.id}_${activePreview?.channel || activeChannel}`;
    const detailIcon = useMemo(() => templateIcon(template), [template]);
    const detailTone = useMemo(() => toneForValue(template.title), [template.title]);

    const copyTemplate = useCallback(() => {
        if (!model) return;
        onRequestCopy(model, copyKey);
    }, [copyKey, model, onRequestCopy]);

    const openVariantResult = useCallback((variant) => {
        if (!model) return;
        const sectionKey = variant ? `${copyKey}_${variant.id}` : `${copyKey}_main`;
        onRequestTemplateResult(variant || model, sectionKey, variant ? model : null);
    }, [copyKey, model, onRequestTemplateResult]);

    const selectChannel = useCallback((channel) => {
        setActiveChannel(channel);
        const nextModel = resolveChannelModel(template, channel);
        if (nextModel) {
            const sectionKey = `tree_${template.id}_${channel}`;
            if (nextModel.variants?.length) {
                onSetVariantPicker({ model: nextModel, sectionKey });
            } else {
                onRequestTemplateResult(nextModel, sectionKey);
            }
        }
    }, [onRequestTemplateResult, onSetVariantPicker, setActiveChannel, template]);

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
                                return (
                                    <TemplateChannelPreviewCard
                                        key={preview.channel}
                                        preview={preview}
                                        isActive={isActive}
                                        lang={lang}
                                        onSelectChannel={selectChannel}
                                    />
                                );
                            })}
                        </div>

                        {hasVariants && (
                            <div className="templates-variant-grid">
                                <button type="button" className="templates-variant-card" onClick={() => openVariantResult(null)}>
                                    <strong>{model.mainVariantName?.trim() || model.title || "Main text"}</strong>
                                    <span>Open main version</span>
                                </button>
                                {model.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        className="templates-variant-card"
                                        onClick={() => openVariantResult(variant)}
                                    >
                                        <strong>{variant.name || "Variant"}</strong>
                                        <span>Open variant</span>
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
});

export default function Templates() {
    const runtime = useTemplateRuntime();
    const runtimeRef = useRef(runtime);
    runtimeRef.current = runtime;
    const toolValuesRef = useRef(runtime.values);
    toolValuesRef.current = runtime.values;
    const [nodes, setNodes] = useState([]);
    const [treeTemplates, setTreeTemplates] = useState([]);
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [activeTemplateId, setActiveTemplateId] = useState(null);
    const [activeChannel, setActiveChannel] = useState(Channel.EMAIL);
    const [query, setQuery] = useState("");
    const [searchResetSignal, setSearchResetSignal] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(() => getInitialTheme());
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [externalGeneratorOpen, setExternalGeneratorOpen] = useState(false);
    const [externalGeneratorClosing, setExternalGeneratorClosing] = useState(false);
    const configName = localStorage.getItem("local_configName") || "No configuration";

    const refreshTreeData = () => {
        return loadTemplateTreeData().then((treeData) => {
            setNodes(treeData.nodes);
            setTreeTemplates(treeData.templates);
        });
    };

    useEffect(() => {
        refreshTreeData();
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

    const nodeLookup = useMemo(() => buildNodeLookup(nodes), [nodes]);
    const childrenByParent = useMemo(() => buildNodeChildrenIndex(nodes), [nodes]);
    const templatesByNode = useMemo(() => buildTemplateNodeIndex(treeTemplates), [treeTemplates]);
    const templateLookup = useMemo(
        () => new Map(treeTemplates.map((template) => [template.id, template])),
        [treeTemplates]
    );
    const templateChannelsById = useMemo(
        () => buildTemplateDisplayChannelIndex(treeTemplates),
        [treeTemplates]
    );
    const getIndexedTemplateChannels = useCallback((template) => (
        template ? (templateChannelsById.get(template.id) || getTemplateDisplayChannels(template)) : []
    ), [templateChannelsById]);
    const searchIndex = useMemo(
        () => buildTemplateTreeSearchIndex(nodes, treeTemplates),
        [nodes, treeTemplates]
    );
    const nodeSummaryById = useMemo(() => {
        const summaries = new Map();
        nodes.forEach((node) => {
            summaries.set(node.id, {
                childCount: getIndexedChildNodes(childrenByParent, node.id).length,
                templateCount: getIndexedTemplatesForNode(templatesByNode, node.id).length
            });
        });
        return summaries;
    }, [childrenByParent, nodes, templatesByNode]);

    const favoriteTemplates = useMemo(
        () => treeTemplates.filter((t) => t.favorite),
        [treeTemplates]
    );

    const toggleFavorite = useCallback(async (templateId) => {
        const template = templateLookup.get(templateId);
        if (!template) return;
        const nextTemplates = updateTemplate(treeTemplates, templateId, { favorite: !template.favorite });
        setTreeTemplates(nextTemplates);
        await saveTemplateTreeData({ nodes, templates: nextTemplates });
    }, [nodes, templateLookup, treeTemplates]);

    const activeNode = useMemo(
        () => nodeLookup.get(activeNodeId) || null,
        [activeNodeId, nodeLookup]
    );
    const activeTemplate = useMemo(
        () => templateLookup.get(activeTemplateId) || null,
        [activeTemplateId, templateLookup]
    );
    const rootNodes = useMemo(() => getIndexedChildNodes(childrenByParent, null), [childrenByParent]);
    const searchResults = useMemo(
        () => searchTemplateTreeIndex(searchIndex, query),
        [query, searchIndex]
    );
    const activeNodePath = useMemo(() => {
        const path = [];
        const seen = new Set();
        let current = activeNode;

        while (current && !seen.has(current.id)) {
            path.unshift(current);
            seen.add(current.id);
            current = current.parentId ? nodeLookup.get(current.parentId) : null;
        }

        return path;
    }, [activeNode, nodeLookup]);

    useEffect(() => {
        if (!activeTemplate) return;
        const available = getIndexedTemplateChannels(activeTemplate);
        const preferred = available[0] || activeTemplate.channels[0] || Channel.EMAIL;
        if (!available.includes(activeChannel) && !activeTemplate.channels.includes(activeChannel)) {
            setActiveChannel(preferred);
        }
    }, [activeChannel, activeTemplate, getIndexedTemplateChannels]);

    const handleSearchQueryChange = useCallback((nextQuery) => {
        setQuery(nextQuery);
    }, []);

    const resetSearchQuery = useCallback(() => {
        setQuery("");
        setSearchResetSignal((signal) => signal + 1);
    }, []);

    const openNode = useCallback((nodeId) => {
        setActiveNodeId(nodeId);
        setActiveTemplateId(null);
        resetSearchQuery();
    }, [resetSearchQuery]);

    const resetCaseNavigation = useCallback(() => {
        setActiveNodeId(null);
        setActiveTemplateId(null);
        setActiveChannel(Channel.EMAIL);
        resetSearchQuery();
    }, [resetSearchQuery]);

    const clearClientAndResetCase = useCallback(() => {
        runtimeRef.current.clearClientInfo();
        resetCaseNavigation();
    }, [resetCaseNavigation]);

    const importClientFromClipboardAndResetCase = useCallback(async (event) => {
        const imported = await runtimeRef.current.readClientClipboard(event);
        if (imported) resetCaseNavigation();
    }, [resetCaseNavigation]);

    const importClientFromPasteAndResetCase = useCallback((text) => {
        runtimeRef.current.importClientFromPaste(text);
        resetCaseNavigation();
    }, [resetCaseNavigation]);

    const changeLanguage = useCallback((code) => {
        runtimeRef.current.setLang(code);
    }, []);

    const openClientPasteModal = useCallback(() => {
        const runtimeApi = runtimeRef.current;
        runtimeApi.setClientPasteInitialError(runtimeApi.clientImportStatus.message || "");
        runtimeApi.setClientPasteOpen(true);
    }, []);

    const toggleClientDetails = useCallback(() => {
        runtimeRef.current.setClientDetailsExpanded((expanded) => !expanded);
    }, []);

    const requestFirstTemplateWorkflow = useCallback((template, preferredChannel) => {
        if (!template) return false;
        const runtimeApi = runtimeRef.current;
        const channels = getIndexedTemplateChannels(template)
            .filter((channel, index, list) => list.indexOf(channel) === index);
        const orderedChannels = [
            preferredChannel,
            ...channels.filter((channel) => channel !== preferredChannel)
        ].filter(Boolean);

        for (const channel of orderedChannels) {
            const model = resolveChannelModel(template, channel);
            if (model?.variants?.length) {
                setActiveChannel(channel);
                runtimeApi.setVariantPicker({ model, sectionKey: `tree_${template.id}_${channel}` });
                return true;
            }
            if (model) {
                setActiveChannel(channel);
                runtimeApi.requestTemplateResult(model, `tree_${template.id}_${channel}`);
                return true;
            }
        }

        return false;
    }, [getIndexedTemplateChannels]);

    const openTemplate = useCallback((templateId) => {
        const template = templateLookup.get(templateId);
        setActiveTemplateId(templateId);
        if (template?.parentNodeId) setActiveNodeId(template.parentNodeId);
        const channels = getIndexedTemplateChannels(template);
        const nextChannel = channels[0] || template?.channels?.[0] || Channel.EMAIL;
        setActiveChannel(nextChannel);
        requestFirstTemplateWorkflow(template, nextChannel);
        resetSearchQuery();
    }, [getIndexedTemplateChannels, requestFirstTemplateWorkflow, resetSearchQuery, templateLookup]);

    const closeTemplateWorkflow = useCallback(() => {
        setActiveTemplateId(null);
        const runtimeApi = runtimeRef.current;
        runtimeApi.setVariantPicker(null);
        runtimeApi.setTokenPrompt(null);
        runtimeApi.setPromptMissingTokens([]);
        runtimeApi.setCopyPreview(null);
    }, []);

    const closeActiveTemplatePreview = useCallback(() => {
        setActiveTemplateId(null);
    }, []);

    const requestDetailCopy = useCallback((model, sectionKey) => {
        return runtimeRef.current.requestCopy(model, sectionKey);
    }, []);

    const requestDetailTemplateResult = useCallback((model, sectionKey, baseModel = null) => {
        return runtimeRef.current.requestTemplateResult(model, sectionKey, baseModel);
    }, []);

    const setDetailVariantPicker = useCallback((picker) => {
        runtimeRef.current.setVariantPicker(picker);
    }, []);

    const openExternalGenerator = useCallback(() => {
        setExternalGeneratorClosing(false);
        setExternalGeneratorOpen(true);
    }, []);

    const openToolsWorkspace = useCallback(() => {
        setActiveWorkspace("tools");
        setDropdownOpen(false);
    }, []);

    const closeExternalGenerator = () => {
        setExternalGeneratorClosing(true);
        window.setTimeout(() => {
            setExternalGeneratorOpen(false);
            setExternalGeneratorClosing(false);
        }, 220);
    };

    const openWorkspace = useCallback((workspace) => {
        setActiveWorkspace(workspace);
        setDropdownOpen(false);
    }, []);

    const openNodesWorkspace = useCallback(() => {
        openWorkspace("nodes");
    }, [openWorkspace]);

    const closeWorkspace = () => {
        setActiveWorkspace(null);
        refreshTreeData();
    };

    const renderWorkspace = () => {
        switch (activeWorkspace) {
            case "nodes":
                return <ManageNodes embedded onClose={closeWorkspace} />;
            case "tokens":
                return <ManageTokens embedded onClose={closeWorkspace} />;
            case "tools":
                return <ManageTools embedded onClose={closeWorkspace} />;
            case "settings":
                return <SettingsPage embedded onClose={closeWorkspace} />;
            case "vti":
                return <VtiBookmarklet embedded onClose={closeWorkspace} />;
            default:
                return null;
        }
    };

    const searchMode = query.trim().length > 0 && !activeTemplate;
    const navigationColumns = useMemo(() => {
        if (searchMode) {
            const count = searchResults.nodes.length + searchResults.templates.length;
            return [{
                id: "search",
                title: "Search results",
                nodes: searchResults.nodes,
                templates: searchResults.templates,
                emptyMessage: "No result found."
            }];
        }

        const columns = [{
            id: "root",
            title: "Sections",
            nodes: rootNodes,
            templates: [],
            emptyMessage: "No section yet."
        }];

        activeNodePath.forEach((node) => {
            columns.push({
                id: node.id,
                title: node.title || "Untitled section",
                nodes: getIndexedChildNodes(childrenByParent, node.id),
                templates: getIndexedTemplatesForNode(templatesByNode, node.id),
                emptyMessage: "No section or template here."
            });
        });

        return columns;
    }, [activeNodePath, childrenByParent, rootNodes, searchMode, searchResults, templatesByNode]);

    const workflowModalOpen = Boolean(runtime.variantPicker || runtime.tokenPrompt || runtime.copyPreview);
    const runtimeTokenMap = useMemo(() => buildPreviewTokenMap(runtime.tokens), [runtime.tokens]);

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
                                    <button type="button" role="menuitem" onClick={() => openWorkspace("nodes")} className="dropdown-reset">Manage playbook</button>
                                    <button type="button" role="menuitem" onClick={() => openWorkspace("tokens")} className="dropdown-reset">Manage tokens</button>
                                    <button type="button" role="menuitem" onClick={() => openWorkspace("settings")} className="dropdown-reset">Settings</button>
                                </div>
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Tools</div>
                                    <button type="button" role="menuitem" onClick={() => openWorkspace("tools")} className="dropdown-reset">Manage tools</button>
                                    <button type="button" role="menuitem" onClick={() => openWorkspace("vti")} className="dropdown-reset">VTI shortcut</button>
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
                onOpenPaste={openClientPasteModal}
                onClearClient={clearClientAndResetCase}
                onToggleDetails={toggleClientDetails}
            />

            <ToolsBar
                valuesRef={toolValuesRef}
                onOpenExternalGenerator={openExternalGenerator}
                onManageTools={openToolsWorkspace}
            />

            <section className="templates-workbench templates-workbench--columns">
                <section className="templates-playbook-panel" aria-label="Playbook">
                    <div className="templates-playbook-head">
                        <PlaybookSearchBox
                            placeholder={activeNode ? "Search..." : "Search in playbook..."}
                            resetSignal={searchResetSignal}
                            onQueryChange={handleSearchQueryChange}
                        />
                    </div>

                    {favoriteTemplates.length > 0 && (
                        <div className="templates-favorites">
                            <div className="templates-favorites-head">
                                <Star size={14} fill="currentColor" aria-hidden="true" />
                                <span>Favorites</span>
                            </div>
                            <div className="templates-favorites-list">
                                {favoriteTemplates.map((template) => (
                                    <FavoriteTemplateButton
                                        key={template.id}
                                        template={template}
                                        selected={activeTemplateId === template.id}
                                        onOpenTemplate={openTemplate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="templates-columns" aria-label="Playbook columns">
                        {navigationColumns.map((column) => (
                            <PlaybookColumn
                                key={column.id}
                                title={column.title}
                                nodes={column.nodes}
                                templates={column.templates}
                                nodeSummaryById={nodeSummaryById}
                                activeNodeId={activeNodeId}
                                activeTemplateId={activeTemplateId}
                                templateChannelsById={templateChannelsById}
                                onOpenNode={openNode}
                                onOpenTemplate={openTemplate}
                                emptyMessage={column.emptyMessage}
                            />
                        ))}
                    </div>

                </section>
            </section>

            {activeTemplate && !workflowModalOpen && (
                <Modal
                    onClose={closeActiveTemplatePreview}
                    dialogClassName="popup-box templates-template-modal"
                    ariaLabel="Template preview"
                >
                    <TemplateDetail
                        template={activeTemplate}
                        activeChannel={activeChannel}
                        setActiveChannel={setActiveChannel}
                        visibleChannels={templateChannelsById.get(activeTemplate.id) || activeTemplate.channels}
                        lang={runtime.lang}
                        tokens={runtime.tokens}
                        values={runtime.values}
                        onRequestCopy={requestDetailCopy}
                        onRequestTemplateResult={requestDetailTemplateResult}
                        onSetVariantPicker={setDetailVariantPicker}
                        onManage={openNodesWorkspace}
                        onToggleFavorite={toggleFavorite}
                    />
                </Modal>
            )}

            {activeWorkspace && (
                <Modal
                    onClose={closeWorkspace}
                    dialogClassName={`popup-box workspace-modal workspace-modal--${activeWorkspace}`}
                    ariaLabel="Workspace"
                >
                    <Suspense fallback={<div className="node-content-empty">Loading...</div>}>
                        {renderWorkspace()}
                    </Suspense>
                </Modal>
            )}

            {runtime.variantPicker && (
                <VariantModal
                    model={runtime.variantPicker.model}
                    displayTitle={formatResultPreviewText(
                        runtime.variantPicker.model?.title || "",
                        runtimeTokenMap,
                        runtime.values
                    )}
                    onClose={closeTemplateWorkflow}
                    onSelect={(variant) => {
                        const picker = runtime.variantPicker;
                        const baseKey = picker.sectionKey || `variant_${picker.model.id}`;
                        const sectionKey = variant ? `${baseKey}_${variant.id}` : `${baseKey}_main`;
                        runtime.setVariantPicker(null);
                        if (variant) {
                            runtime.requestTemplateResult(
                                variant,
                                sectionKey,
                                picker.model
                            );
                        } else {
                            runtime.requestTemplateResult(picker.model, sectionKey);
                        }
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
                            return { ...prev, [token]: nextValue };
                        });
                        runtime.setPromptMissingTokens((prev) => prev.filter((name) => name !== token));
                    }}
                    onConfirm={runtime.confirmTokenPrompt}
                    onClose={() => {
                        const defs = runtime.tokenPrompt?.tokenDefs ?? [];
                        closeTemplateWorkflow();
                        runtime.clearOnDemandValues(defs);
                    }}
                />
            )}

            {runtime.copyPreview && (
                <TemplateResultModal
                    result={runtime.copyPreview}
                    onCopy={runtime.copyTemplateResultAgain}
                    onClose={closeTemplateWorkflow}
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
                    <Suspense fallback={<div className="node-content-empty">Loading...</div>}>
                        <ExternalGenerator embedded onClose={closeExternalGenerator} clientPayload={runtime.clientPayload} />
                    </Suspense>
                </Modal>
            )}
        </main>
    );
}
