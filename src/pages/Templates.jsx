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
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Modal from "../components/Modal.jsx";
import {
    ClientBarCustomizeModal,
    ClientInfoPanel,
    ClientImportErrorModal,
    ClientPasteModal,
    ExternalIdConflictModal,
    TemplateResultModal,
    TokenPromptModal,
    useTemplateRuntime,
    VariantModal
} from "../components/TemplateRuntime.jsx";
import { generateFinalText, getTemplateTextResult } from "../core/tokenEngine.js";
import { TEMPLATE_TREE_UPDATED_EVENT, loadTemplateTreeData, saveTemplateTreeData } from "../services/templateTreeService.js";
import { CHANNEL_VALUES, Channel } from "../models/templateTreeModel.js";
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
import {
    hydrateTemplateImageHtml,
    stripImagesFromHtml,
    TEMPLATE_IMAGES_UPDATED_EVENT
} from "../utils/templateImages.js";
import { loadTemplateImageMap } from "../services/templateImageService.js";
import { loadConfigName } from "../services/appConfigService.js";
import ToolsBar from "../components/ToolsBar.jsx";
import SuperOfficePhotoGallery from "../components/SuperOfficePhotoGallery.jsx";
import { copyText, showToast } from "../services/clipboardService.js";
import { loadAgentProfile } from "../services/agentProfileService.js";
import {
    SUPER_OFFICE_TICKET_UPDATED_EVENT,
    hasSuperOfficeTicketPayload,
    loadDisplaySuperOfficeTicketPayload,
    loadSuperOfficeTicketPayload,
    saveDisplaySuperOfficeExternalId
} from "../services/superOfficeTicketService.js";
import {
    buildAloPreparationDefaults,
    buildAloProblemDescription,
    formatAloAutofillPayload
} from "../utils/aloAutofill.js";
import { getKeyboardShortcutForEvent } from "../utils/keyboardShortcuts.js";
import {
    buildCaseProfile,
    getCaseProfileInfoSections,
    getCaseProfileSummaryFields
} from "../utils/caseProfile.js";
import {
    loadTemplateQuickSectionsState,
    recordTemplateUsage,
    saveTemplateQuickSectionsState
} from "../services/templateUsageService.js";
import { getTopicColorStyle } from "../utils/topicAppearance.js";

const ExternalGenerator = lazy(() => import("./ExternalGenerator.jsx"));
const ManageNodes = lazy(() => import("./ManageNodes.jsx"));
const ManageTools = lazy(() => import("./ManageTools.jsx"));
const SettingsPage = lazy(() => import("./Settings.jsx"));

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

const QUICK_TEMPLATE_LIMIT = 8;
const DEFAULT_QUICK_SECTION_STATE = Object.freeze({
    favorites: false
});

const ALO_TYPE_OPTIONS = [
    { value: "noSignal", label: "No signal" },
    { value: "lowBadRxTx", label: "Low / bad RX TX" }
];

function WorkspaceErrorFallback({ workspace, error, onClose, onRetry }) {
    const workspaceLabel = {
        nodes: "Manage playbook",
        tools: "Tools + shortcuts",
        settings: "Settings",
        vti: "Tools + shortcuts"
    }[workspace] || "Workspace";
    const message = error?.message || "This workspace could not be opened.";

    return (
        <div className="workspace-error-panel">
            <p className="eyebrow">Interface error</p>
            <h2>{workspaceLabel} did not open</h2>
            <p>{message}</p>
            <div className="workspace-error-actions">
                <button type="button" className="secondary-btn" onClick={onClose}>Close</button>
                <button type="button" className="primary-btn" onClick={onRetry}>Try again</button>
            </div>
        </div>
    );
}

const ALO_SIGNAL_OPTIONS = [
    { value: "lost", label: "Lost" },
    { value: "never", label: "Never" }
];

function plainTextFromTemplate(value) {
    return String(value || "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function normalizeDisplayFieldKey(label = "", value = "") {
    return `${String(label || "").trim().toLowerCase()}:${String(value || "").trim()}`;
}

function mergeDisplayInfoSections(primarySections = [], fallbackSections = []) {
    if (!Array.isArray(primarySections) || primarySections.length === 0) return fallbackSections;
    if (!Array.isArray(fallbackSections) || fallbackSections.length === 0) return primarySections;

    const seen = new Set();
    primarySections.forEach((sectionItem) => {
        (sectionItem?.fields || []).forEach((field) => {
            seen.add(normalizeDisplayFieldKey(field.label, field.value));
        });
    });

    const nextFallbackSections = fallbackSections
        .map((sectionItem) => ({
            ...sectionItem,
            fields: (sectionItem.fields || []).filter((field) => {
                const key = normalizeDisplayFieldKey(field.label, field.value);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
        }))
        .filter((sectionItem) => sectionItem.fields.length > 0);

    return [...primarySections, ...nextFallbackSections];
}

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

function buildFavoriteTemplateEntries(templates = []) {
    return templates
        .filter((template) => template?.favorite)
        .map((template) => ({ template }))
        .slice(0, QUICK_TEMPLATE_LIMIT);
}

function templateIdFromSectionKey(sectionKey = "") {
    const raw = String(sectionKey || "");
    if (!raw.startsWith("tree_")) return "";
    const body = raw.slice(5);

    for (const channel of CHANNEL_VALUES) {
        const marker = `_${channel}`;
        const markerIndex = body.lastIndexOf(marker);
        if (markerIndex > 0) return body.slice(0, markerIndex);
    }

    return "";
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

function PlaybookColumnGroup({ title, count, children }) {
    return (
        <div className="templates-column-group">
            <div className="templates-column-group-head">
                <span>{title}</span>
                <span>{count}</span>
            </div>
            <div className="templates-column-group-list">
                {children}
            </div>
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
            style={getTopicColorStyle(node)}
            onClick={() => onOpenNode(node.id)}
        >
            <IconBadge Icon={Icon} tone={toneForValue(node.icon || node.title)} className="templates-topic-badge" />
            <span className="templates-column-copy">
                <strong>{node.title || "Untitled topic"}</strong>
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

const QuickTemplateButton = memo(function QuickTemplateButton({
    entry,
    channels,
    selected,
    onOpenTemplate
}) {
    const { template } = entry;
    const Icon = templateIcon(template);
    const handleClick = useCallback(() => {
        onOpenTemplate(template.id);
    }, [onOpenTemplate, template.id]);

    return (
        <button
            type="button"
            className={`templates-quick-template${selected ? " is-active" : ""}`}
            onClick={handleClick}
        >
            <IconBadge Icon={Icon} tone={toneForValue(template.title)} className="templates-quick-template-icon" />
            <span className="templates-quick-template-copy">
                <strong>{template.title || "Untitled"}</strong>
                <ChannelPills channels={channels} />
            </span>
        </button>
    );
});

const QuickTemplateSection = memo(function QuickTemplateSection({
    id,
    title,
    Icon,
    entries,
    collapsed,
    activeTemplateId,
    templateChannelsById,
    onOpenTemplate,
    onToggle
}) {
    if (entries.length === 0) return null;

    return (
        <section className={`templates-quick-section templates-quick-section--${id}${collapsed ? " is-collapsed" : ""}`}>
            <button
                type="button"
                className="templates-quick-section-head"
                aria-expanded={!collapsed}
                onClick={() => onToggle(id)}
            >
                <ChevronRight className="templates-quick-section-chevron" size={16} aria-hidden="true" />
                <Icon size={15} aria-hidden="true" />
                <span>{title}</span>
                <span className="templates-quick-section-count">{entries.length}</span>
            </button>

            {!collapsed && (
                <div className="templates-quick-grid">
                    {entries.map((entry) => (
                        <QuickTemplateButton
                            key={`${id}-${entry.template.id}`}
                            entry={entry}
                            channels={templateChannelsById.get(entry.template.id) || entry.template.channels}
                            selected={activeTemplateId === entry.template.id}
                            onOpenTemplate={onOpenTemplate}
                        />
                    ))}
                </div>
            )}
        </section>
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

function AloPreparationModal({ defaults, templateOptions = [], onCancel, onSubmit }) {
    const [form, setForm] = useState(() => ({
        aloType: defaults.aloType || "",
        extRef: defaults.extRef || "",
        signalState: defaults.signalState || "",
        disconnectionDate: defaults.disconnectionDate || "",
        activationDate: defaults.activationDate || "",
        notesMode: "",
        selectedTemplateId: "",
        notes: defaults.description || ""
    }));
    const [stepIndex, setStepIndex] = useState(0);
    const inferredSignalState = Boolean(defaults.signalState);

    const steps = useMemo(() => {
        const next = [];
        next.push({ key: "aloType", kind: "choice", title: "Type", options: ALO_TYPE_OPTIONS });
        next.push({
            key: "extRef",
            kind: "input",
            title: "External ref",
            inputType: "text",
            placeholder: "Optional external reference",
            optional: true
        });
        if (!inferredSignalState) next.push({ key: "signalState", kind: "choice", title: "Signal state", options: ALO_SIGNAL_OPTIONS });
        next.push({
            key: form.signalState === "never" ? "activationDate" : "disconnectionDate",
            kind: "input",
            title: form.signalState === "never" ? "Activation date" : "Disconnection date",
            inputType: "date"
        });
        next.push({
            key: "notesMode",
            kind: "choice",
            title: "Problem notes",
            options: [
                { value: "free", label: "Free text" },
                { value: "template", label: "Import template", disabled: templateOptions.length === 0 }
            ]
        });
        next.push(form.notesMode === "template"
            ? { key: "selectedTemplateId", kind: "template", title: "Import template" }
            : { key: "notes", kind: "textarea", title: "Free text" });
        return next;
    }, [form.notesMode, form.signalState, inferredSignalState, templateOptions.length]);

    const step = steps[Math.min(stepIndex, steps.length - 1)];
    const showBack = stepIndex > 0;
    const problemDescription = form.aloType === "lowBadRxTx"
        ? "Bad signal"
        : form.aloType === "noSignal"
            ? "No signal"
            : "Choose type";

    const updateForm = (patch) => {
        setForm((current) => {
            const next = { ...current, ...patch };
            if (Object.prototype.hasOwnProperty.call(patch, "signalState") || Object.prototype.hasOwnProperty.call(patch, "aloType")) {
                next.notes = next.aloType ? buildAloProblemDescription(next) : "";
            }
            return next;
        });
    };

    const advance = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    const back = () => setStepIndex((current) => Math.max(current - 1, 0));

    const finish = () => onSubmit({
        aloType: form.aloType,
        extRef: form.extRef.trim(),
        signalState: form.signalState,
        disconnectionDate: form.disconnectionDate,
        activationDate: form.activationDate,
        description: form.aloType === "lowBadRxTx" ? "Bad signal" : "No signal",
        notes: form.notes.trim()
    });

    const continueInput = () => {
        const value = String(form[step.key] || "").trim();
        if (!value && !step.optional) return;
        if (stepIndex === steps.length - 1) {
            finish();
            return;
        }
        advance();
    };

    const chooseValue = (value) => {
        if (!value) return;
        if (step.key === "selectedTemplateId") {
            const option = templateOptions.find((candidate) => candidate.id === value);
            if (!option) return;
            updateForm({ selectedTemplateId: value, notes: option.text });
            return;
        }
        updateForm({ [step.key]: value });
        setTimeout(advance, 0);
    };

    return (
        <Modal onClose={onCancel} ariaLabel={step.title} dialogClassName="prompt-dialog alo-step-modal">
            <div key={step.key} className="prompt-dialog__step">
                <div className="prompt-dialog__header">
                    <span className="prompt-dialog__indicator" />
                    <div>
                        <h2>{step.title}</h2>
                        <p className="hint">Problem description: {problemDescription}</p>
                    </div>
                </div>

                {step.kind === "choice" && (
                    <div className="prompt-dialog__options">
                        {step.options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`prompt-dialog__option${form[step.key] === option.value ? " is-selected" : ""}`}
                                disabled={option.disabled}
                                onClick={() => chooseValue(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}

                {step.kind === "input" && (
                    <div className="prompt-dialog__body">
                        <input
                            autoFocus
                            type={step.inputType || "text"}
                            className="prompt-dialog__input"
                            value={form[step.key] || ""}
                            placeholder={step.placeholder || ""}
                            onChange={(event) => updateForm({ [step.key]: event.target.value })}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    continueInput();
                                }
                            }}
                        />
                    </div>
                )}

                {step.kind === "textarea" && (
                    <div className="prompt-dialog__body">
                        <textarea
                            autoFocus
                            className="prompt-dialog__input alo-step-textarea"
                            rows={6}
                            value={form.notes}
                            onChange={(event) => updateForm({ notes: event.target.value })}
                        />
                    </div>
                )}

                {step.kind === "template" && (
                    <div className="prompt-dialog__body">
                        <select
                            autoFocus
                            className="prompt-dialog__input"
                            value={form.selectedTemplateId}
                            onChange={(event) => chooseValue(event.target.value)}
                        >
                            <option value="">Choose template...</option>
                            {templateOptions.map((option) => (
                                <option key={option.id} value={option.id}>{option.label}</option>
                            ))}
                        </select>
                        {form.notes && <p className="alo-step-preview">{form.notes}</p>}
                    </div>
                )}

                <div className="prompt-dialog__actions">
                    {showBack && (
                        <button type="button" className="prompt-dialog__btn prompt-dialog__btn--back" onClick={back}>← Back</button>
                    )}
                    <div className="prompt-dialog__actions-end">
                        {step.kind !== "choice" && (
                            <button type="button" className="prompt-dialog__btn prompt-dialog__btn--continue" onClick={continueInput}>
                                {stepIndex === steps.length - 1 ? "Copy ALO data" : "Continue →"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

const PlaybookColumn = memo(function PlaybookColumn({
    title,
    nodeGroupTitle = "Topics",
    nodes: columnNodes,
    templates: columnTemplates,
    nodeSummaryById,
    activeNodeId,
    activeTemplateId,
    templateChannelsById,
    onOpenNode,
    onOpenTemplate,
    emptyMessage,
    templatesFirst = false
}) {
    const hasItems = columnNodes.length > 0 || columnTemplates.length > 0;
    const showNodeGroup = columnNodes.length > 0;
    const showTemplateGroup = columnTemplates.length > 0;
    const nodeGroup = showNodeGroup ? (
        <PlaybookColumnGroup
            title={nodeGroupTitle}
            count={columnNodes.length}
        >
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
        </PlaybookColumnGroup>
    ) : null;
    const templateGroup = showTemplateGroup ? (
        <PlaybookColumnGroup
            title="Templates"
            count={columnTemplates.length}
        >
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
        </PlaybookColumnGroup>
    ) : null;

    return (
        <section className="templates-column" aria-label={title || "Playbook column"}>
            {title && (
                <div className="templates-column-head">
                    <h2>{title}</h2>
                </div>
            )}
            <div className="templates-column-list">
                {hasItems ? (
                    <>
                        {templatesFirst ? templateGroup : nodeGroup}
                        {templatesFirst ? nodeGroup : templateGroup}
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

function formatResultPreviewHTML(value = "", tokenMap = EMPTY_TOKEN_MAP, tokens = [], values = {}, templateImageMap = new Map(), options = {}) {
    const source = options.allowImages === false ? stripImagesFromHtml(value) : value;
    const hydrated = String(source || "").replace(TEMPLATE_TOKEN_PATTERN, (tokenName) => {
        const resolved = resolvePreviewTokenValue(tokenName, tokenMap, values);
        return resolved === null ? tokenName : escapePreviewHTML(resolved);
    });
    const formatted = formatTokenPreviewHTML(hydrated, tokens);
    return options.allowImages === false ? formatted : hydrateTemplateImageHtml(formatted, templateImageMap);
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
    templateImageMap,
    onRequestCopy,
    onRequestTemplateResult,
    onSetVariantPicker,
    onToggleFavorite,
    onManage
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
            html: formatResultPreviewHTML(textResult.text, previewTokenMap, tokens, values, templateImageMap, {
                allowImages: channel !== Channel.SMS
            }),
            meta: CHANNEL_META[channel] || CHANNEL_META[Channel.OTHER]
        };
    }), [lang, previewTokenMap, template, templateImageMap, tokens, uniqueVisibleChannels, values]);
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

    const toggleFavorite = useCallback(() => {
        onToggleFavorite(template.id);
    }, [onToggleFavorite, template.id]);

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
                            className={`secondary-btn templates-favorite-btn${template.favorite ? " is-active" : ""}`}
                            onClick={toggleFavorite}
                            aria-pressed={Boolean(template.favorite)}
                            title={template.favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Star
                                size={17}
                                aria-hidden="true"
                                fill={template.favorite ? "currentColor" : "none"}
                            />
                            {template.favorite ? "Favorite" : "Add favorite"}
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
    const toolRuntimeContextRef = useRef({});
    const [nodes, setNodes] = useState([]);
    const [treeTemplates, setTreeTemplates] = useState([]);
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [activeTemplateId, setActiveTemplateId] = useState(null);
    const [activeChannel, setActiveChannel] = useState(Channel.EMAIL);
    const [query, setQuery] = useState("");
    const [searchResetSignal, setSearchResetSignal] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [externalGeneratorOpen, setExternalGeneratorOpen] = useState(false);
    const [externalGeneratorStartField, setExternalGeneratorStartField] = useState(null);
    const [superOfficeTicket, setSuperOfficeTicket] = useState(null);
    const [superOfficeDataPresent, setSuperOfficeDataPresent] = useState(false);
    const [superOfficeGalleryOpen, setSuperOfficeGalleryOpen] = useState(false);
    const [aloPreparation, setAloPreparation] = useState(null);
    const [templateImageMap, setTemplateImageMap] = useState(() => new Map());
    const [configName, setConfigName] = useState("No configuration");
    const [quickSectionsCollapsed, setQuickSectionsCollapsed] = useState(DEFAULT_QUICK_SECTION_STATE);
    const caseProfile = useMemo(() => buildCaseProfile({
        clientPayload: runtime.clientPayload,
        superOfficePayload: superOfficeTicket,
        tokenValues: runtime.values
    }), [runtime.clientPayload, runtime.values, superOfficeTicket]);
    const caseProfileInfoSections = useMemo(() => getCaseProfileInfoSections(caseProfile), [caseProfile]);
    const caseProfileSummaryFields = useMemo(() => getCaseProfileSummaryFields(caseProfile), [caseProfile]);
    const displayClientInfoSections = useMemo(
        () => mergeDisplayInfoSections(runtime.clientInfoSections, caseProfileInfoSections),
        [caseProfileInfoSections, runtime.clientInfoSections]
    );
    const displayClientSummaryFields = runtime.clientPayload
        ? runtime.clientSummaryFields
        : caseProfileSummaryFields;
    const displayClientExternalId = runtime.clientExternalId || caseProfile.externalId || "";
    const canCustomizeClientBar = runtime.clientBarFieldGroups.length > 0;

    toolRuntimeContextRef.current = {
        tokens: runtime.tokens,
        client: runtime.clientPayload,
        clientInfo: displayClientInfoSections,
        clientSummary: displayClientSummaryFields,
        profile: caseProfile
    };

    const refreshTreeData = () => {
        return loadTemplateTreeData().then((treeData) => {
            setNodes(treeData.nodes);
            setTreeTemplates(treeData.templates);
        });
    };

    useEffect(() => {
        refreshTreeData();
        loadConfigName().then(setConfigName);
    }, []);

    useEffect(() => {
        const handler = () => refreshTreeData();
        window.addEventListener(TEMPLATE_TREE_UPDATED_EVENT, handler);
        return () => window.removeEventListener(TEMPLATE_TREE_UPDATED_EVENT, handler);
    }, []);

    useEffect(() => {
        let cancelled = false;
        loadTemplateQuickSectionsState().then((sectionState) => {
            if (cancelled) return;
            setQuickSectionsCollapsed(sectionState);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const refreshSuperOfficeState = useCallback(async (payload = undefined) => {
        const nextTicket = payload === undefined ? await loadDisplaySuperOfficeTicketPayload() : payload;
        setSuperOfficeTicket(nextTicket || null);
        setSuperOfficeDataPresent(await hasSuperOfficeTicketPayload());
        return nextTicket;
    }, []);

    useEffect(() => {
        refreshSuperOfficeState();
    }, [refreshSuperOfficeState]);

    useEffect(() => {
        let cancelled = false;
        const refreshTemplateImages = () => {
            loadTemplateImageMap().then((imageMap) => {
                if (!cancelled) setTemplateImageMap(imageMap);
            });
        };
        refreshTemplateImages();
        window.addEventListener(TEMPLATE_IMAGES_UPDATED_EVENT, refreshTemplateImages);
        return () => {
            cancelled = true;
            window.removeEventListener(TEMPLATE_IMAGES_UPDATED_EVENT, refreshTemplateImages);
        };
    }, []);

    useEffect(() => {
        const handler = (event) => {
            refreshSuperOfficeState(event.detail?.payload ?? undefined);
        };
        window.addEventListener(SUPER_OFFICE_TICKET_UPDATED_EVENT, handler);
        return () => window.removeEventListener(SUPER_OFFICE_TICKET_UPDATED_EVENT, handler);
    }, [refreshSuperOfficeState]);

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
    const aloTemplateOptions = useMemo(() => {
        const options = [];
        treeTemplates.forEach((template) => {
            getAvailableTemplateChannels(template).forEach((channel) => {
                const model = resolveChannelModel(template, channel);
                if (!model) return;
                const text = plainTextFromTemplate(generateFinalText(model, runtime.lang, runtime.values));
                if (!text) return;
                options.push({
                    id: `${template.id}:${channel}`,
                    label: `${template.title || "Untitled"} - ${CHANNEL_LABELS[channel]}`,
                    text
                });
            });
        });
        return options.sort((a, b) => a.label.localeCompare(b.label));
    }, [runtime.lang, runtime.values, treeTemplates]);
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

    const favoriteTemplateEntries = useMemo(
        () => buildFavoriteTemplateEntries(treeTemplates),
        [treeTemplates]
    );

    const toggleQuickSection = useCallback((sectionId) => {
        setQuickSectionsCollapsed((current) => {
            const next = {
                ...current,
                [sectionId]: !current[sectionId]
            };
            saveTemplateQuickSectionsState(next).catch((error) => {
                console.error("saveTemplateQuickSectionsState error", error);
            });
            return next;
        });
    }, []);

    const markTemplateUsed = useCallback(async (templateId) => {
        if (!templateId) return;
        await recordTemplateUsage(templateId);
    }, []);

    const toggleTemplateFavorite = useCallback(async (templateId) => {
        const template = treeTemplates.find((item) => item.id === templateId);
        if (!template) return;

        const nextFavorite = !template.favorite;
        const previousTemplates = treeTemplates;
        const nextTemplates = updateTemplate(treeTemplates, templateId, { favorite: nextFavorite });
        setTreeTemplates(nextTemplates);

        try {
            await saveTemplateTreeData({ nodes, templates: nextTemplates });
            showToast(nextFavorite ? "Template added to favorites" : "Template removed from favorites", "info");
        } catch (error) {
            console.error("toggleTemplateFavorite error", error);
            setTreeTemplates(previousTemplates);
            showToast("Favorite was not saved", "error");
        }
    }, [nodes, treeTemplates]);

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

    const clearClientAndResetCase = useCallback(async () => {
        await runtimeRef.current.clearClientInfo();
        await refreshSuperOfficeState(null);
        resetCaseNavigation();
    }, [refreshSuperOfficeState, resetCaseNavigation]);

    const importClientFromClipboardAndResetCase = useCallback(async (event) => {
        const imported = await runtimeRef.current.readClientClipboard(event);
        if (imported) resetCaseNavigation();
    }, [resetCaseNavigation]);

    const importSuperOfficeFromClipboardAndResetCase = useCallback(async (event) => {
        const imported = await runtimeRef.current.readSuperOfficeClipboard(event);
        if (imported) {
            await refreshSuperOfficeState();
            resetCaseNavigation();
        }
    }, [refreshSuperOfficeState, resetCaseNavigation]);

    const openSuperOfficeGallery = useCallback(async () => {
        await refreshSuperOfficeState();
        setSuperOfficeGalleryOpen(true);
    }, [refreshSuperOfficeState]);

    const closeSuperOfficeGallery = useCallback(() => {
        setSuperOfficeGalleryOpen(false);
    }, []);

    const copyAloAutofillData = useCallback(async () => {
        const clientPayload = runtimeRef.current.clientPayload;
        if (!clientPayload) return;

        setAloPreparation(buildAloPreparationDefaults(clientPayload, await loadSuperOfficeTicketPayload()));
    }, []);

    const closeAloPreparation = useCallback(() => {
        setAloPreparation(null);
    }, []);

    const submitAloPreparation = useCallback(async (options) => {
        const clientPayload = runtimeRef.current.clientPayload;
        if (!clientPayload) return;

        await copyText(
            formatAloAutofillPayload(
                clientPayload,
                await loadAgentProfile(),
                await loadSuperOfficeTicketPayload(),
                options
            ),
            { message: "ALO fill data copied", variant: "success" }
        );
        setAloPreparation(null);
    }, []);

    const importClientFromPasteAndResetCase = useCallback(async (text) => {
        await runtimeRef.current.importClientFromPaste(text);
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

    const requestFirstTemplateWorkflow = useCallback(async (template, preferredChannel) => {
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
                const copied = await runtimeApi.requestTemplateResult(model, `tree_${template.id}_${channel}`);
                if (copied) await markTemplateUsed(template.id);
                return copied;
            }
        }

        return false;
    }, [getIndexedTemplateChannels, markTemplateUsed]);

    const openTemplate = useCallback((templateId) => {
        const template = templateLookup.get(templateId);
        setActiveTemplateId(templateId);
        if (template?.parentNodeId) setActiveNodeId(template.parentNodeId);
        const channels = getIndexedTemplateChannels(template);
        const nextChannel = channels[0] || template?.channels?.[0] || Channel.EMAIL;
        setActiveChannel(nextChannel);
        requestFirstTemplateWorkflow(template, nextChannel).catch((error) => {
            console.error("requestFirstTemplateWorkflow error", error);
        });
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

    const requestDetailCopy = useCallback(async (model, sectionKey) => {
        const copied = await runtimeRef.current.requestCopy(model, sectionKey);
        if (copied) await markTemplateUsed(templateIdFromSectionKey(sectionKey) || activeTemplateId);
        return copied;
    }, [activeTemplateId, markTemplateUsed]);

    const requestDetailTemplateResult = useCallback(async (model, sectionKey, baseModel = null) => {
        const copied = await runtimeRef.current.requestTemplateResult(model, sectionKey, baseModel);
        if (copied) await markTemplateUsed(templateIdFromSectionKey(sectionKey) || activeTemplateId);
        return copied;
    }, [activeTemplateId, markTemplateUsed]);

    const setDetailVariantPicker = useCallback((picker) => {
        runtimeRef.current.setVariantPicker(picker);
    }, []);

    const selectRuntimeVariant = useCallback((variant) => {
        const runtimeApi = runtimeRef.current;
        const picker = runtimeApi.variantPicker;
        if (!picker?.model) return;
        const baseKey = picker.sectionKey || `variant_${picker.model.id}`;
        const sectionKey = variant ? `${baseKey}_${variant.id}` : `${baseKey}_main`;
        runtimeApi.setVariantPicker(null);
        if (variant) {
            runtimeApi.requestTemplateResult(variant, sectionKey, picker.model).then((copied) => {
                if (copied) markTemplateUsed(templateIdFromSectionKey(sectionKey) || activeTemplateId);
            });
        } else {
            runtimeApi.requestTemplateResult(picker.model, sectionKey).then((copied) => {
                if (copied) markTemplateUsed(templateIdFromSectionKey(sectionKey) || activeTemplateId);
            });
        }
    }, [activeTemplateId, markTemplateUsed]);

    const changeTokenPromptValue = useCallback((token, nextValue) => {
        const runtimeApi = runtimeRef.current;
        runtimeApi.setValues((prev) => ({ ...prev, [token]: nextValue }));
        runtimeApi.setPromptMissingTokens((prev) => prev.filter((name) => name !== token));
    }, []);

    const confirmRuntimeTokenPrompt = useCallback(async () => {
        const prompt = runtimeRef.current.tokenPrompt;
        const templateId = templateIdFromSectionKey(prompt?.sectionKey) || activeTemplateId;
        const copied = await runtimeRef.current.confirmTokenPrompt();
        if (copied && prompt?.mode !== "fill" && templateId) await markTemplateUsed(templateId);
    }, [activeTemplateId, markTemplateUsed]);

    const closeRuntimeTokenPrompt = useCallback(() => {
        const runtimeApi = runtimeRef.current;
        const defs = runtimeApi.tokenPrompt?.tokenDefs ?? [];
        closeTemplateWorkflow();
        runtimeApi.clearOnDemandValues(defs);
    }, [closeTemplateWorkflow]);

    const copyRuntimeTemplateResultAgain = useCallback(async (htmlOverride = null) => {
        const copied = await runtimeRef.current.copyTemplateResultAgain(htmlOverride);
        if (copied && activeTemplateId) await markTemplateUsed(activeTemplateId);
    }, [activeTemplateId, markTemplateUsed]);

    const resultChannelOptions = useMemo(() => {
        if (!activeTemplate) return [];
        return getIndexedTemplateChannels(activeTemplate)
            .filter((channel, index, list) => list.indexOf(channel) === index)
            .filter((channel) => Boolean(resolveChannelModel(activeTemplate, channel)))
            .map((channel) => ({
                value: channel,
                label: CHANNEL_LABELS[channel] || channel
            }));
    }, [activeTemplate, getIndexedTemplateChannels]);

    const openResultChannel = useCallback((channel) => {
        if (!activeTemplate || !channel) return false;
        const model = resolveChannelModel(activeTemplate, channel);
        if (!model) return false;

        setActiveChannel(channel);
        const runtimeApi = runtimeRef.current;
        const sectionKey = `tree_${activeTemplate.id}_${channel}`;
        if (model.variants?.length) {
            runtimeApi.setCopyPreview(null);
            runtimeApi.setVariantPicker({ model, sectionKey });
            return true;
        }
        return runtimeApi.requestTemplateResult(model, sectionKey).then((copied) => {
            if (copied) markTemplateUsed(activeTemplate.id);
            return copied;
        });
    }, [activeTemplate, markTemplateUsed]);

    const openNextResultChannel = useCallback(() => {
        if (resultChannelOptions.length === 0) return false;
        const currentIndex = resultChannelOptions.findIndex((option) => option.value === activeChannel);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % resultChannelOptions.length;
        return openResultChannel(resultChannelOptions[nextIndex].value);
    }, [activeChannel, openResultChannel, resultChannelOptions]);

    const closeClientPasteModal = useCallback(() => {
        const runtimeApi = runtimeRef.current;
        runtimeApi.setClientPasteOpen(false);
        runtimeApi.setClientPasteInitialError("");
    }, []);

    const openExternalGenerator = useCallback((startField = null) => {
        const fieldId = typeof startField === "string" ? startField : null;
        setExternalGeneratorStartField(fieldId);
        setExternalGeneratorOpen(true);
    }, []);

    const openToolsWorkspace = useCallback(() => {
        setActiveWorkspace("tools");
        setDropdownOpen(false);
    }, []);

    const closeExternalGenerator = () => {
        setExternalGeneratorOpen(false);
        setExternalGeneratorStartField(null);
    };

    const saveExternalGeneratorResult = useCallback(async (externalId) => {
        const nextClientPayload = await runtimeRef.current.saveClientExternalId(externalId);
        const nextTicket = await saveDisplaySuperOfficeExternalId(externalId);
        if (nextTicket) {
            setSuperOfficeTicket(nextTicket);
            setSuperOfficeDataPresent(true);
        }
        return nextClientPayload || nextTicket;
    }, []);

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
            case "tools":
                return <ManageTools embedded onClose={closeWorkspace} />;
            case "settings":
                return <SettingsPage embedded onClose={closeWorkspace} />;
            case "vti":
                return <ManageTools embedded onClose={closeWorkspace} initialSection="shortcuts" />;
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
                nodeGroupTitle: "Topics",
                nodes: searchResults.nodes,
                templates: searchResults.templates,
                templatesFirst: true,
                emptyMessage: "No result found."
            }];
        }

        const columns = [{
            id: "root",
            title: "Topics",
            nodeGroupTitle: "Topics",
            nodes: rootNodes,
            templates: [],
            emptyMessage: "No topics yet."
        }];

        activeNodePath.forEach((node) => {
            columns.push({
                id: node.id,
                title: node.title || "Untitled topic",
                nodeGroupTitle: "Subtopics",
                nodes: getIndexedChildNodes(childrenByParent, node.id),
                templates: getIndexedTemplatesForNode(templatesByNode, node.id),
                emptyMessage: "No subtopics or templates here."
            });
        });

        return columns;
    }, [activeNodePath, childrenByParent, rootNodes, searchMode, searchResults, templatesByNode]);

    const workflowModalOpen = Boolean(runtime.variantPicker || runtime.tokenPrompt || runtime.copyPreview);
    const runtimeTokenMap = useMemo(() => buildPreviewTokenMap(runtime.tokens), [runtime.tokens]);
    const shortcutModalOpen = Boolean(
        activeWorkspace
        || activeTemplate
        || workflowModalOpen
        || runtime.clientPasteOpen
        || runtime.clientImportErrorModal
        || runtime.clientBarCustomizeOpen
        || runtime.externalIdConflictPrompt
        || externalGeneratorOpen
        || superOfficeGalleryOpen
    );

    useEffect(() => {
        const handleKeyboardShortcut = async (event) => {
            const shortcut = getKeyboardShortcutForEvent(event);
            if (!shortcut || shortcutModalOpen || runtimeRef.current.clientImportLoading) return;

            const hasVtiData = Boolean(runtimeRef.current.clientPayload);
            const hasSoData = await hasSuperOfficeTicketPayload();

            if (shortcut.id === "importVti") {
                if (hasVtiData) return;
                event.preventDefault();
                await importClientFromClipboardAndResetCase(event);
                return;
            }

            if (shortcut.id === "importSo") {
                if (hasSoData) return;
                event.preventDefault();
                await importSuperOfficeFromClipboardAndResetCase(event);
                return;
            }

            if (shortcut.id === "clearData") {
                if (!hasVtiData && !hasSoData) return;
                event.preventDefault();
                await clearClientAndResetCase();
            }
        };

        document.addEventListener("keydown", handleKeyboardShortcut);
        return () => document.removeEventListener("keydown", handleKeyboardShortcut);
    }, [
        clearClientAndResetCase,
        importClientFromClipboardAndResetCase,
        importSuperOfficeFromClipboardAndResetCase,
        shortcutModalOpen
    ]);

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
                                    <button type="button" role="menuitem" onClick={() => openWorkspace("settings")} className="dropdown-reset">Settings</button>
                                </div>
                                <div className="dropdown-section">
                                    <div className="dropdown-title">Tools</div>
                                    <button type="button" role="menuitem" onClick={() => openWorkspace("tools")} className="dropdown-reset">Tools + shortcuts</button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <ClientInfoPanel
                sections={displayClientInfoSections}
                summaryFields={displayClientSummaryFields}
                externalId={displayClientExternalId}
                status={runtime.clientImportStatus}
                loading={runtime.clientImportLoading}
                detailsExpanded={runtime.clientDetailsExpanded}
                lang={runtime.lang}
                hasVtiData={Boolean(runtime.clientPayload)}
                hasSuperOfficeData={superOfficeDataPresent}
                onChangeLang={changeLanguage}
                onReadClipboard={importClientFromClipboardAndResetCase}
                onReadSuperOffice={importSuperOfficeFromClipboardAndResetCase}
                onOpenPaste={openClientPasteModal}
                onClearClient={clearClientAndResetCase}
                onCustomizeBar={canCustomizeClientBar ? () => runtimeRef.current.setClientBarCustomizeOpen(true) : null}
                onExternalIdFieldClick={openExternalGenerator}
                onToggleDetails={toggleClientDetails}
            />

            <ToolsBar
                values={runtime.values}
                valuesRef={toolValuesRef}
                runtimeContextRef={toolRuntimeContextRef}
                onOpenExternalGenerator={openExternalGenerator}
                hasExternalId={Boolean(displayClientExternalId)}
                onCopyAloAutofillData={copyAloAutofillData}
                hasAloAutofillData={Boolean(runtime.clientPayload)}
                onOpenSuperOfficePhotos={openSuperOfficeGallery}
                superOfficePhotoCount={superOfficeTicket?.imageAttachments?.length || 0}
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

                    <div className="templates-quick-sections" aria-label="Quick templates">
                        <QuickTemplateSection
                            id="favorites"
                            title="Favorites"
                            Icon={Star}
                            entries={favoriteTemplateEntries}
                            collapsed={quickSectionsCollapsed.favorites}
                            activeTemplateId={activeTemplateId}
                            templateChannelsById={templateChannelsById}
                            onOpenTemplate={openTemplate}
                            onToggle={toggleQuickSection}
                        />
                    </div>

                    <div className="templates-columns" aria-label="Playbook columns">
                        {navigationColumns.map((column) => (
                            <PlaybookColumn
                                key={column.id}
                                title={column.title}
                                nodeGroupTitle={column.nodeGroupTitle}
                                nodes={column.nodes}
                                templates={column.templates}
                                nodeSummaryById={nodeSummaryById}
                                activeNodeId={activeNodeId}
                                activeTemplateId={activeTemplateId}
                                templateChannelsById={templateChannelsById}
                                onOpenNode={openNode}
                                onOpenTemplate={openTemplate}
                                emptyMessage={column.emptyMessage}
                                templatesFirst={column.templatesFirst}
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
                        templateImageMap={templateImageMap}
                        onRequestCopy={requestDetailCopy}
                        onRequestTemplateResult={requestDetailTemplateResult}
                        onSetVariantPicker={setDetailVariantPicker}
                        onToggleFavorite={toggleTemplateFavorite}
                        onManage={openNodesWorkspace}
                    />
                </Modal>
            )}

            {activeWorkspace && (
                <Modal
                    onClose={closeWorkspace}
                    dialogClassName={`popup-box workspace-modal workspace-modal--${activeWorkspace}`}
                    ariaLabel="Workspace"
                >
                    <ErrorBoundary
                        resetKey={activeWorkspace}
                        fallback={({ error, reset }) => (
                            <WorkspaceErrorFallback
                                workspace={activeWorkspace}
                                error={error}
                                onClose={closeWorkspace}
                                onRetry={reset}
                            />
                        )}
                    >
                        <Suspense fallback={<div className="node-content-empty">Loading...</div>}>
                            {renderWorkspace()}
                        </Suspense>
                    </ErrorBoundary>
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
                    onSelect={selectRuntimeVariant}
                />
            )}

            {runtime.tokenPrompt && (
                <TokenPromptModal
                    title={runtime.tokenPrompt.title}
                    tokenDefs={runtime.tokenPrompt.tokenDefs}
                    values={runtime.values}
                    missingTokens={runtime.promptMissingTokens}
                    mode={runtime.tokenPrompt.mode}
                    onChange={changeTokenPromptValue}
                    onConfirm={confirmRuntimeTokenPrompt}
                    onClose={closeRuntimeTokenPrompt}
                />
            )}

            {runtime.copyPreview && (
                <TemplateResultModal
                    result={runtime.copyPreview}
                    tokens={runtime.tokens}
                    channelOptions={resultChannelOptions}
                    currentChannel={activeChannel}
                    isFavorite={Boolean(activeTemplate?.favorite)}
                    onSelectChannel={openResultChannel}
                    onNextChannel={openNextResultChannel}
                    onCopy={copyRuntimeTemplateResultAgain}
                    onToggleFavorite={activeTemplate ? () => toggleTemplateFavorite(activeTemplate.id) : null}
                    onClose={closeTemplateWorkflow}
                />
            )}

            {runtime.clientPasteOpen && (
                <ClientPasteModal
                    initialError={runtime.clientPasteInitialError}
                    onClose={closeClientPasteModal}
                    onImport={importClientFromPasteAndResetCase}
                />
            )}

            {runtime.clientImportErrorModal && (
                <ClientImportErrorModal
                    message={runtime.clientImportErrorModal}
                    onClose={() => runtime.setClientImportErrorModal(null)}
                />
            )}

            {runtime.clientBarCustomizeOpen && canCustomizeClientBar && (
                <ClientBarCustomizeModal
                    groups={runtime.clientBarFieldGroups}
                    selectedKeys={runtime.clientBarFieldKeys}
                    defaultKeys={runtime.clientBarDefaultFieldKeys}
                    onChange={runtime.saveClientBarSelection}
                    onReset={runtime.resetClientBarSelection}
                    onClose={() => runtime.setClientBarCustomizeOpen(false)}
                />
            )}

            {runtime.externalIdConflictPrompt && (
                <ExternalIdConflictModal
                    conflicts={runtime.externalIdConflictPrompt.conflicts}
                    onApplySelections={runtime.applyExternalIdConflictSelections}
                    onCancel={runtime.cancelExternalIdConflictCorrection}
                />
            )}

            {aloPreparation && (
                <AloPreparationModal
                    defaults={aloPreparation}
                    templateOptions={aloTemplateOptions}
                    onCancel={closeAloPreparation}
                    onSubmit={submitAloPreparation}
                />
            )}

            {externalGeneratorOpen && (
                <Suspense fallback={null}>
                    <ExternalGenerator
                        embedded
                        flowOnly
                        startField={externalGeneratorStartField}
                        onClose={closeExternalGenerator}
                        onExternalIdSaved={saveExternalGeneratorResult}
                        initialExternalId={displayClientExternalId}
                        clientPayload={runtime.clientPayload}
                    />
                </Suspense>
            )}

            {superOfficeGalleryOpen && (
                <SuperOfficePhotoGallery
                    ticket={superOfficeTicket}
                    profile={caseProfile}
                    onClose={closeSuperOfficeGallery}
                />
            )}
        </main>
    );
}
