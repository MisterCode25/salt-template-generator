import { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";
import { showToast } from "../services/clipboardService.js";
import { loadTemplateTreeData, saveTemplateTreeData } from "../services/templateTreeService.js";
import { loadTokens, saveTokens } from "../services/tokenService.js";
import { Channel, CHANNEL_VALUES } from "../models/templateTreeModel.js";
import {
    buildNodeChildrenIndex,
    buildNodeLookup,
    buildTemplateNodeIndex,
    canMoveNode,
    createNodeForParent,
    createTemplateForNode,
    duplicateTemplate,
    getDescendantNodeIds,
    getIndexedChildNodes,
    getIndexedTemplatesForNode,
    linkTemplateToNode,
    moveNode,
    removeNodeCascade,
    removeTemplate,
    reorderNode,
    unlinkTemplateFromNode,
    updateNode,
    updateTemplate
} from "../utils/templateTreeOperations.js";

const ROOT_PARENT_VALUE = "__root__";

const CHANNEL_LABELS = {
    [Channel.EMAIL]: "Email",
    [Channel.SMS]: "SMS",
    [Channel.OTHER]: "Other"
};

const CHANNEL_DESCRIPTIONS = {
    [Channel.EMAIL]: "Full customer message",
    [Channel.SMS]: "Short mobile message",
    [Channel.OTHER]: "Custom response"
};

const LANGUAGES = [
    { code: "fr", label: "FR", field: "text_fr" },
    { code: "en", label: "EN", field: "text_en" },
    { code: "de", label: "DE", field: "text_de" },
    { code: "it", label: "IT", field: "text_it" }
];

const NODE_ICON_CATEGORIES = ["All", "Network", "Customer", "Messages", "Hardware", "Actions", "Status", "Business"];

const NODE_ICON_PRESETS = [
    { value: "wifi-off", label: "Wi-Fi off", category: "Network", kind: "wifiOff", terms: "no signal network offline internet" },
    { value: "wifi", label: "Wi-Fi", category: "Network", kind: "wifi", terms: "signal online network internet" },
    { value: "signal", label: "Signal", category: "Network", kind: "signal", terms: "bars coverage reception" },
    { value: "signal-low", label: "Low signal", category: "Network", kind: "signalLow", terms: "weak low reception" },
    { value: "globe", label: "Internet", category: "Network", kind: "globe", terms: "web internet wan" },
    { value: "router", label: "Router", category: "Network", kind: "router", terms: "box modem gateway" },
    { value: "ethernet", label: "Ethernet", category: "Network", kind: "port", terms: "lan cable port" },
    { value: "outage", label: "Outage", category: "Network", kind: "boltOff", terms: "down outage incident" },
    { value: "user", label: "Customer", category: "Customer", kind: "user", terms: "client user customer" },
    { value: "users", label: "Group", category: "Customer", kind: "users", terms: "team family contacts" },
    { value: "headset", label: "Support", category: "Customer", kind: "headset", terms: "call support agent" },
    { value: "phone", label: "Phone", category: "Customer", kind: "phone", terms: "call mobile contact" },
    { value: "phone-off", label: "Unreachable", category: "Customer", kind: "phoneOff", terms: "no answer unreachable call failed" },
    { value: "home", label: "Address", category: "Customer", kind: "home", terms: "house address location" },
    { value: "account", label: "Account", category: "Customer", kind: "badge", terms: "profile account identity" },
    { value: "mail", label: "Email", category: "Messages", kind: "mail", terms: "email message mail" },
    { value: "sms", label: "SMS", category: "Messages", kind: "message", terms: "sms text message" },
    { value: "chat", label: "Chat", category: "Messages", kind: "chat", terms: "conversation reply" },
    { value: "bell", label: "Notification", category: "Messages", kind: "bell", terms: "alert notify" },
    { value: "inbox", label: "Inbox", category: "Messages", kind: "inbox", terms: "queue receive" },
    { value: "send", label: "Send", category: "Messages", kind: "send", terms: "send outbound" },
    { value: "note", label: "Note", category: "Messages", kind: "note", terms: "comment note text" },
    { value: "language", label: "Language", category: "Messages", kind: "language", terms: "translate language" },
    { value: "modem", label: "Modem", category: "Hardware", kind: "box", terms: "modem box device" },
    { value: "ont", label: "ONT", category: "Hardware", kind: "box", terms: "fiber ont device" },
    { value: "server", label: "Server", category: "Hardware", kind: "server", terms: "backend system" },
    { value: "laptop", label: "Laptop", category: "Hardware", kind: "laptop", terms: "computer device" },
    { value: "mobile", label: "Mobile", category: "Hardware", kind: "mobile", terms: "phone device" },
    { value: "tv", label: "TV", category: "Hardware", kind: "tv", terms: "television box" },
    { value: "cable", label: "Cable", category: "Hardware", kind: "cable", terms: "wire connection" },
    { value: "tools", label: "Tools", category: "Actions", kind: "tools", terms: "action fix work" },
    { value: "wrench", label: "Fix", category: "Actions", kind: "wrench", terms: "repair fix" },
    { value: "reboot", label: "Reboot", category: "Actions", kind: "refresh", terms: "restart reboot reset" },
    { value: "refresh", label: "Refresh", category: "Actions", kind: "refresh", terms: "reload update" },
    { value: "camera", label: "Photo", category: "Actions", kind: "camera", terms: "picture photo screenshot" },
    { value: "upload", label: "Upload", category: "Actions", kind: "upload", terms: "send file upload" },
    { value: "download", label: "Download", category: "Actions", kind: "download", terms: "receive file download" },
    { value: "copy", label: "Copy", category: "Actions", kind: "copy", terms: "duplicate clone" },
    { value: "link", label: "Link", category: "Actions", kind: "link", terms: "url attach" },
    { value: "warning", label: "Warning", category: "Status", kind: "warning", terms: "danger caution issue" },
    { value: "alert", label: "Alert", category: "Status", kind: "octagon", terms: "error alert stop" },
    { value: "clock", label: "Waiting", category: "Status", kind: "clock", terms: "wait pending time" },
    { value: "check", label: "Done", category: "Status", kind: "check", terms: "ok success done" },
    { value: "xmark", label: "Failed", category: "Status", kind: "xmark", terms: "failed reject cancel" },
    { value: "lock", label: "Locked", category: "Status", kind: "lock", terms: "secure locked" },
    { value: "shield", label: "Security", category: "Status", kind: "shield", terms: "security safe" },
    { value: "bolt", label: "Urgent", category: "Status", kind: "bolt", terms: "urgent fast priority" },
    { value: "star", label: "Favorite", category: "Status", kind: "star", terms: "favorite important" },
    { value: "flag", label: "Flag", category: "Status", kind: "flag", terms: "flag mark" },
    { value: "folder", label: "Folder", category: "Business", kind: "folder", terms: "category group" },
    { value: "tree", label: "Tree", category: "Business", kind: "tree", terms: "hierarchy node branch" },
    { value: "template", label: "Template", category: "Business", kind: "template", terms: "template model" },
    { value: "document", label: "Document", category: "Business", kind: "document", terms: "file page" },
    { value: "list", label: "List", category: "Business", kind: "list", terms: "items checklist" },
    { value: "pin", label: "Pin", category: "Business", kind: "pin", terms: "location marker" },
    { value: "map", label: "Map", category: "Business", kind: "map", terms: "area location" },
    { value: "tag", label: "Tag", category: "Business", kind: "tag", terms: "label type" }
];

const NODE_ICON_PRESET_BY_VALUE = new Map(
    NODE_ICON_PRESETS.map((preset) => [preset.value, preset])
);

function getNodeIconPreset(icon) {
    return NODE_ICON_PRESET_BY_VALUE.get(icon) || null;
}

function renderNodeIconPaths(kind) {
    switch (kind) {
        case "wifi":
            return <><path d="M5 9.5a11 11 0 0 1 14 0" /><path d="M8 13a6.8 6.8 0 0 1 8 0" /><path d="M11 16.5a2.5 2.5 0 0 1 2 0" /><circle cx="12" cy="19" r="1" /></>;
        case "wifiOff":
            return <><path d="M4 4l16 16" /><path d="M8.5 8.5a11 11 0 0 1 10.5 1" /><path d="M5 9.5a11.4 11.4 0 0 1 2-1.2" /><path d="M9.8 13.2A6.8 6.8 0 0 1 16 13" /><path d="M11.2 16.5a2.5 2.5 0 0 1 1.6 0" /></>;
        case "signal":
            return <><path d="M5 19v-3" /><path d="M10 19v-7" /><path d="M15 19V8" /><path d="M20 19V5" /></>;
        case "signalLow":
            return <><path d="M5 19v-3" /><path d="M10 19v-7" /><path d="M15 19V8" opacity=".35" /><path d="M20 19V5" opacity=".35" /></>;
        case "globe":
            return <><circle cx="12" cy="12" r="8" /><path d="M4 12h16" /><path d="M12 4a13 13 0 0 1 0 16" /><path d="M12 4a13 13 0 0 0 0 16" /></>;
        case "router":
            return <><rect x="4" y="10" width="16" height="8" rx="2" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 10V6" /><path d="M13 6h6" /></>;
        case "port":
            return <><rect x="5" y="6" width="14" height="12" rx="2" /><path d="M9 18v-4h6v4" /><path d="M9 10h6" /></>;
        case "boltOff":
            return <><path d="M13 3L5 14h6l-1 7 7-10h-5l1-8z" /><path d="M4 4l16 16" /></>;
        case "user":
            return <><circle cx="12" cy="8" r="3" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>;
        case "users":
            return <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M15 11a3 3 0 1 0-.7-5.9" /><path d="M17 20a5 5 0 0 0-3-4.6" /></>;
        case "headset":
            return <><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v4a2 2 0 0 0 2 2h2v-6H4z" /><path d="M20 13v4a2 2 0 0 1-2 2h-2v-6h4z" /><path d="M13 19h3" /></>;
        case "phone":
            return <><path d="M7 5l3 3-2 2a10 10 0 0 0 6 6l2-2 3 3-2 3c-7 0-13-6-13-13l3-2z" /></>;
        case "phoneOff":
            return <><path d="M7 5l3 3-2 2a10 10 0 0 0 6 6l2-2 3 3-2 3c-7 0-13-6-13-13l3-2z" /><path d="M4 4l16 16" /></>;
        case "home":
            return <><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></>;
        case "badge":
            return <><rect x="5" y="4" width="14" height="16" rx="2" /><circle cx="12" cy="9" r="2" /><path d="M8.5 16a3.8 3.8 0 0 1 7 0" /></>;
        case "mail":
            return <><rect x="4" y="6" width="16" height="12" rx="2" /><path d="M4 8l8 6 8-6" /></>;
        case "message":
            return <><path d="M5 6h14v10H8l-3 3V6z" /><path d="M8 10h8" /><path d="M8 13h5" /></>;
        case "chat":
            return <><path d="M4 6h12v9H8l-4 4V6z" /><path d="M9 17h7l4 3V9h-3" /></>;
        case "bell":
            return <><path d="M6 17h12l-2-3v-4a4 4 0 0 0-8 0v4l-2 3z" /><path d="M10 20h4" /></>;
        case "inbox":
            return <><path d="M5 5h14l2 9v5H3v-5l2-9z" /><path d="M3 14h5l2 3h4l2-3h5" /></>;
        case "send":
            return <><path d="M4 12l16-8-5 16-3-7-8-1z" /><path d="M12 13l8-9" /></>;
        case "note":
            return <><path d="M6 4h9l3 3v13H6V4z" /><path d="M15 4v4h4" /><path d="M9 12h6" /><path d="M9 16h4" /></>;
        case "language":
            return <><path d="M4 6h9" /><path d="M8.5 4v2" /><path d="M10 6c-.8 4-3 6.5-6 8" /><path d="M5.5 8c1 2.2 2.6 4 5 5" /><path d="M14 20l4-10 4 10" /><path d="M16 16h4" /></>;
        case "box":
            return <><rect x="5" y="6" width="14" height="12" rx="2" /><path d="M8 10h8" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /></>;
        case "server":
            return <><rect x="5" y="4" width="14" height="7" rx="2" /><rect x="5" y="13" width="14" height="7" rx="2" /><path d="M8 7h.01" /><path d="M8 16h.01" /></>;
        case "laptop":
            return <><rect x="5" y="5" width="14" height="11" rx="2" /><path d="M3 20h18" /></>;
        case "mobile":
            return <><rect x="8" y="3" width="8" height="18" rx="2" /><path d="M11 18h2" /></>;
        case "tv":
            return <><rect x="4" y="5" width="16" height="11" rx="2" /><path d="M9 20h6" /><path d="M12 16v4" /></>;
        case "cable":
            return <><path d="M7 7v4a5 5 0 0 0 10 0V7" /><path d="M6 7h4" /><path d="M14 7h4" /><path d="M12 16v5" /></>;
        case "tools":
            return <><path d="M14 6l4 4" /><path d="M16 4l4 4-9 9-4-4 9-9z" /><path d="M4 20l4-4" /></>;
        case "wrench":
            return <><path d="M15 6a5 5 0 0 0 6 6L12 21l-4-4 9-9a5 5 0 0 1-2-2z" /></>;
        case "refresh":
            return <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M19 12a7 7 0 0 0-12-5" /><path d="M5 12a7 7 0 0 0 12 5" /></>;
        case "camera":
            return <><path d="M5 8h3l2-3h4l2 3h3v11H5V8z" /><circle cx="12" cy="13.5" r="3" /></>;
        case "upload":
            return <><path d="M12 16V4" /><path d="M8 8l4-4 4 4" /><path d="M5 20h14" /></>;
        case "download":
            return <><path d="M12 4v12" /><path d="M8 12l4 4 4-4" /><path d="M5 20h14" /></>;
        case "copy":
            return <><rect x="8" y="8" width="11" height="11" rx="2" /><rect x="5" y="5" width="11" height="11" rx="2" /></>;
        case "link":
            return <><path d="M10 7h-2a5 5 0 0 0 0 10h2" /><path d="M14 7h2a5 5 0 0 1 0 10h-2" /><path d="M9 12h6" /></>;
        case "warning":
            return <><path d="M12 4l9 16H3l9-16z" /><path d="M12 9v5" /><path d="M12 17h.01" /></>;
        case "octagon":
            return <><path d="M8 3h8l5 5v8l-5 5H8l-5-5V8l5-5z" /><path d="M9 9l6 6" /><path d="M15 9l-6 6" /></>;
        case "clock":
            return <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>;
        case "check":
            return <><path d="M4 12l5 5L20 6" /></>;
        case "xmark":
            return <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>;
        case "lock":
            return <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>;
        case "shield":
            return <><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" /><path d="M9 12l2 2 4-5" /></>;
        case "bolt":
            return <><path d="M13 3L5 14h6l-1 7 7-10h-5l1-8z" /></>;
        case "star":
            return <><path d="M12 4l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8L12 4z" /></>;
        case "flag":
            return <><path d="M6 21V4" /><path d="M6 5h11l-2 4 2 4H6" /></>;
        case "folder":
            return <><path d="M4 7h6l2 2h8v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" /></>;
        case "tree":
            return <><path d="M12 4v16" /><path d="M12 8H7v4" /><path d="M12 12h5v4" /><circle cx="7" cy="13" r="2" /><circle cx="17" cy="17" r="2" /><circle cx="12" cy="4" r="2" /></>;
        case "template":
            return <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M4 10h16" /><path d="M10 10v9" /></>;
        case "document":
            return <><path d="M6 4h9l3 3v13H6V4z" /><path d="M15 4v4h4" /><path d="M9 13h6" /><path d="M9 16h6" /></>;
        case "list":
            return <><path d="M8 7h12" /><path d="M8 12h12" /><path d="M8 17h12" /><path d="M4 7h.01" /><path d="M4 12h.01" /><path d="M4 17h.01" /></>;
        case "pin":
            return <><path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11z" /><circle cx="12" cy="10" r="2" /></>;
        case "map":
            return <><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6z" /><path d="M9 4v14" /><path d="M15 6v14" /></>;
        case "tag":
        default:
            return <><path d="M4 12V5h7l9 9-7 7-9-9z" /><path d="M8 8h.01" /></>;
    }
}

const NodeIconGlyph = memo(function NodeIconGlyph({ icon }) {
    const preset = getNodeIconPreset(icon);
    return (
        <svg className="node-symbol" viewBox="0 0 24 24" aria-hidden="true">
            {renderNodeIconPaths(preset?.kind || "tag")}
        </svg>
    );
});

function createChannelContentDraft(channel, title = "") {
    return {
        title,
        type: channel,
        mainVariantName: "",
        text_fr: "",
        text_en: "",
        text_de: "",
        text_it: "",
        variants: []
    };
}

function createVariantId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createVariantDraft(index = 1) {
    return {
        id: createVariantId(),
        name: `Variant ${index}`,
        text_fr: "",
        text_en: "",
        text_de: "",
        text_it: ""
    };
}

function hasRichTextContent(value = "") {
    const raw = String(value || "");
    if (/<(img|video|audio|iframe)\b/i.test(raw)) return true;

    const textOnly = raw
        .replace(/<br\s*\/?>/gi, "")
        .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/\u200B/g, "")
        .trim();

    return textOnly.length > 0;
}

function buildNodeOptions(childrenByParent, parentId = null, depth = 0) {
    return getIndexedChildNodes(childrenByParent, parentId).flatMap((node) => [
        { node, depth },
        ...buildNodeOptions(childrenByParent, node.id, depth + 1)
    ]);
}

function normalizeTemplatePickerQuery(value = "") {
    return String(value || "").trim().toLowerCase();
}

function buildTemplatePickerSearchIndex(templates = []) {
    return templates.map((template) => ({
        template,
        searchText: normalizeTemplatePickerQuery(template.title)
    }));
}

function NodeFormModal({ mode, initial, parentTitle, onClose, onSave }) {
    const isEdit = mode === "edit";
    const [title, setTitle] = useState(initial?.title || "");
    const [icon, setIcon] = useState(initial?.icon || "");
    const [iconMenuOpen, setIconMenuOpen] = useState(false);
    const [iconQuery, setIconQuery] = useState("");
    const [iconCategory, setIconCategory] = useState("All");
    const canSubmit = title.trim().length > 0;
    const selectedIconPreset = getNodeIconPreset(icon);
    const filteredIconPresets = useMemo(() => {
        const query = iconQuery.trim().toLowerCase();
        return NODE_ICON_PRESETS.filter((preset) => {
            const categoryMatch = iconCategory === "All" || preset.category === iconCategory;
            if (!categoryMatch) return false;
            if (!query) return true;
            return [
                preset.value,
                preset.label,
                preset.category,
                preset.terms
            ].join(" ").toLowerCase().includes(query);
        });
    }, [iconCategory, iconQuery]);

    const submit = (event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onSave({
            title: title.trim(),
            icon: icon.trim()
        });
    };

    return (
        <Modal
            onClose={onClose}
            ariaLabel={isEdit ? "Rename section" : "New section"}
            dialogClassName="popup-box node-section-dialog"
        >
            <form onSubmit={submit} className="node-node-modal">
                <div className="popup-header">
                    <div>
                        <h2>{isEdit ? "Rename section" : parentTitle ? "New subsection" : "New section"}</h2>
                        {parentTitle && !isEdit && <p className="node-modal-subtitle">Inside {parentTitle}</p>}
                    </div>
                </div>
                <div className="node-form">
                    {parentTitle && !isEdit && (
                        <div className="node-form-parent">
                            <span className="client-info-label">Parent</span>
                            <strong>{parentTitle}</strong>
                        </div>
                    )}
                    <div className="node-form-preview">
                        <span className="node-object-icon"><NodeIconGlyph icon={icon} /></span>
                        <span>
                            <strong>{title || "Untitled section"}</strong>
                        </span>
                    </div>
                    <div className="node-section-form-grid">
                        <div className="form-field">
                            <label>Title</label>
                            <input
                                autoFocus
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="No signal"
                            />
                        </div>
                        <div className="form-field">
                            <label>Icon</label>
                            <div className="node-icon-field">
                                <button
                                    type="button"
                                    className="node-icon-current"
                                    onClick={() => setIconMenuOpen((open) => !open)}
                                    aria-expanded={iconMenuOpen}
                                >
                                    <span className="node-icon-current-preview">
                                        <NodeIconGlyph icon={icon} />
                                    </span>
                                    <span className="node-icon-current-copy">
                                        <strong>{selectedIconPreset?.label || icon || "No icon"}</strong>
                                        <small>{icon || "Choose a symbol"}</small>
                                    </span>
                                    <span className="node-icon-current-action">Choose</span>
                                </button>

                                {iconMenuOpen && (
                                    <div className="node-symbol-menu">
                                        <div className="node-symbol-menu-head">
                                            <input
                                                value={iconQuery}
                                                onChange={(event) => setIconQuery(event.target.value)}
                                                placeholder="Search symbols"
                                            />
                                            <button
                                                type="button"
                                                className="node-mini-btn node-mini-btn--icon"
                                                onClick={() => setIconMenuOpen(false)}
                                                aria-label="Close symbol picker"
                                                title="Close"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="node-symbol-categories" aria-label="Symbol categories">
                                            {NODE_ICON_CATEGORIES.map((category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    className={iconCategory === category ? "is-active" : ""}
                                                    onClick={() => setIconCategory(category)}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="node-symbol-grid" aria-label="Symbols">
                                            {filteredIconPresets.map((preset) => (
                                                <button
                                                    key={preset.value}
                                                    type="button"
                                                    className={icon === preset.value ? "is-selected" : ""}
                                                    onClick={() => setIcon(preset.value)}
                                                    title={preset.value}
                                                >
                                                    <span className="node-symbol-cell-icon">
                                                        <NodeIconGlyph icon={preset.value} />
                                                    </span>
                                                    <small>{preset.label}</small>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="node-symbol-custom">
                                            <label>Custom</label>
                                            <input
                                                value={icon}
                                                onChange={(event) => setIcon(event.target.value)}
                                                placeholder="custom-symbol"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popup-actions">
                    <button type="submit" className="primary-btn" disabled={!canSubmit}>{isEdit ? "Save" : "Create"}</button>
                </div>
            </form>
        </Modal>
    );
}

const ExistingTemplatePickerRow = memo(function ExistingTemplatePickerRow({
    template,
    nodeNames,
    onLink
}) {
    const handleLink = useCallback(() => {
        onLink(template.id);
    }, [onLink, template.id]);

    return (
        <div className="node-picker-row">
            <div className="node-picker-copy">
                <strong>{template.title || "Untitled template"}</strong>
                {nodeNames && <span className="node-picker-nodes">In: {nodeNames}</span>}
                <div className="node-channel-pills">
                    {template.channels.map((channel) => (
                        <span key={channel} className="variant-pill">{CHANNEL_LABELS[channel] || channel}</span>
                    ))}
                </div>
            </div>
            <button type="button" className="primary-btn" onClick={handleLink}>
                Link
            </button>
        </div>
    );
});

const ExistingTemplatePickerModal = memo(function ExistingTemplatePickerModal({ currentNodeId, allTemplates, nodeLookup, onClose, onLink }) {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    const normalizedQuery = useMemo(
        () => normalizeTemplatePickerQuery(deferredQuery),
        [deferredQuery]
    );
    const alreadyLinked = useMemo(
        () => new Set(
            allTemplates
                .filter((t) => (t.nodeIds || []).includes(currentNodeId))
                .map((t) => t.id)
        ),
        [allTemplates, currentNodeId]
    );
    const templateSearchIndex = useMemo(
        () => buildTemplatePickerSearchIndex(allTemplates),
        [allTemplates]
    );
    const filteredRows = useMemo(() => (
        templateSearchIndex
            .filter(({ template, searchText }) => (
                !alreadyLinked.has(template.id)
                && (!normalizedQuery || searchText.includes(normalizedQuery))
            ))
            .map(({ template }) => ({
                template,
                nodeNames: (template.nodeIds || [])
                    .map((id) => nodeLookup.get(id)?.title || "?")
                    .join(", ")
            }))
    ), [alreadyLinked, nodeLookup, normalizedQuery, templateSearchIndex]);

    return (
        <Modal onClose={onClose} ariaLabel="Link existing template">
            <div className="node-picker-modal">
                <div className="popup-header">
                    <h2>Link existing template</h2>
                </div>
                <div className="node-form">
                    <div className="form-field">
                        <label>Search</label>
                        <input
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search templates..."
                        />
                    </div>
                    <div className="node-picker-list">
                        {filteredRows.length === 0 ? (
                            <p className="node-picker-empty">
                                {allTemplates.length === alreadyLinked.size
                                    ? "All templates are already linked to this section."
                                    : "No matching templates."}
                            </p>
                        ) : (
                            filteredRows.map(({ template, nodeNames }) => (
                                <ExistingTemplatePickerRow
                                    key={template.id}
                                    template={template}
                                    nodeNames={nodeNames}
                                    onLink={onLink}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
});

function TemplateFormModal({ initial, parentTitle, onClose, onSave }) {
    const isEdit = Boolean(initial);
    const [title, setTitle] = useState(initial?.title || "");
    const [channels, setChannels] = useState(initial?.channels || []);
    const [contentByChannel, setContentByChannel] = useState(initial?.contentByChannel || {});
    const [activeContentChannel, setActiveContentChannel] = useState(initial?.channels?.[0] || Channel.EMAIL);
    const [activeLanguage, setActiveLanguage] = useState("fr");
    const [activeVariantByChannel, setActiveVariantByChannel] = useState({});
    const [previewRequest, setPreviewRequest] = useState(null);
    const [tokens, setTokens] = useState([]);
    const canSubmit = title.trim().length > 0 && channels.length > 0;

    useEffect(() => {
        let active = true;
        loadTokens().then((loadedTokens) => {
            if (active) setTokens(loadedTokens);
        });
        return () => {
            active = false;
        };
    }, []);

    const createToken = useCallback(async (tokenDef) => {
        const currentTokens = await loadTokens();
        const existing = currentTokens.find((token) =>
            token.token === tokenDef.token
            || (token.label || "").toLowerCase() === (tokenDef.label || "").toLowerCase()
        );
        if (existing) {
            setTokens(currentTokens);
            return existing;
        }

        const nextTokens = [...currentTokens, tokenDef];
        await saveTokens(nextTokens);
        setTokens(nextTokens);
        return tokenDef;
    }, []);

    const toggleChannel = useCallback((channel) => {
        let nextChannels;
        if (channels.includes(channel)) {
            nextChannels = channels.filter((item) => item !== channel);
        } else {
            nextChannels = [...channels, channel];
            setContentByChannel((contents) => ({
                ...contents,
                [channel]: contents[channel] || createChannelContentDraft(channel, title.trim())
            }));
        }
        setChannels(nextChannels);
        setActiveContentChannel(nextChannels.includes(channel) ? channel : nextChannels[0] || Channel.EMAIL);
    }, [channels, title]);

    const updateChannelContent = useCallback((channel, field, value) => {
        setContentByChannel((current) => ({
            ...current,
            [channel]: {
                ...createChannelContentDraft(channel, title.trim()),
                ...(current[channel] || {}),
                [field]: value
            }
        }));
    }, [title]);

    const addVariant = useCallback((channel) => {
        const currentVariants = Array.isArray(contentByChannel[channel]?.variants)
            ? contentByChannel[channel].variants
            : [];
        const variant = createVariantDraft(currentVariants.length + 1);

        setContentByChannel((current) => {
            const content = {
                ...createChannelContentDraft(channel, title.trim()),
                ...(current[channel] || {})
            };
            const variants = Array.isArray(content.variants) ? content.variants : [];
            return {
                ...current,
                [channel]: {
                    ...content,
                    variants: [...variants, variant]
                }
            };
        });
        setActiveVariantByChannel((current) => ({
            ...current,
            [channel]: variant.id
        }));
    }, [contentByChannel, title]);

    const updateVariant = useCallback((channel, variantId, field, value) => {
        setContentByChannel((current) => {
            const content = {
                ...createChannelContentDraft(channel, title.trim()),
                ...(current[channel] || {})
            };
            const variants = Array.isArray(content.variants) ? content.variants : [];
            return {
                ...current,
                [channel]: {
                    ...content,
                    variants: variants.map((variant) => (
                        variant.id === variantId ? { ...variant, [field]: value } : variant
                    ))
                }
            };
        });
    }, [title]);

    const removeVariant = useCallback((channel, variantId) => {
        const variants = Array.isArray(contentByChannel[channel]?.variants)
            ? contentByChannel[channel].variants
            : [];
        const removedIndex = variants.findIndex((variant) => variant.id === variantId);
        const nextActiveVariant = variants[removedIndex + 1] || variants[removedIndex - 1] || null;

        setContentByChannel((current) => {
            const content = {
                ...createChannelContentDraft(channel, title.trim()),
                ...(current[channel] || {})
            };
            const currentVariants = Array.isArray(content.variants) ? content.variants : [];
            return {
                ...current,
                [channel]: {
                    ...content,
                    variants: currentVariants.filter((variant) => variant.id !== variantId)
                }
            };
        });
        setActiveVariantByChannel((current) => ({
            ...current,
            [channel]: nextActiveVariant?.id || ""
        }));
    }, [contentByChannel, title]);

    const submit = (event) => {
        event.preventDefault();
        if (!canSubmit) return;
        const normalizedTitle = title.trim();

        onSave({
            title: normalizedTitle,
            channels,
            contentByChannel: CHANNEL_VALUES.reduce((acc, channel) => {
                if (!channels.includes(channel)) return acc;
                acc[channel] = {
                    ...createChannelContentDraft(channel, normalizedTitle),
                    ...(contentByChannel[channel] || {}),
                    title: normalizedTitle,
                    type: channel,
                    variants: Array.isArray(contentByChannel[channel]?.variants)
                        ? contentByChannel[channel].variants
                        : []
                };
                return acc;
            }, {})
        });
    };

    const selectedContentChannel = channels.includes(activeContentChannel)
        ? activeContentChannel
        : channels[0] || null;
    const activeLanguageDef = LANGUAGES.find((language) => language.code === activeLanguage) || LANGUAGES[0];
    const selectedContent = useMemo(() => (
        selectedContentChannel
            ? {
                ...createChannelContentDraft(selectedContentChannel, title.trim()),
                ...(contentByChannel[selectedContentChannel] || {})
            }
            : null
    ), [contentByChannel, selectedContentChannel, title]);
    const activeTextValue = selectedContent?.[activeLanguageDef.field] || "";
    const selectedVariants = Array.isArray(selectedContent?.variants) ? selectedContent.variants : [];
    const activeVariantId = selectedVariants.some((variant) => variant.id === activeVariantByChannel[selectedContentChannel])
        ? activeVariantByChannel[selectedContentChannel]
        : selectedVariants[0]?.id || "";
    const activeVariant = selectedVariants.find((variant) => variant.id === activeVariantId) || null;
    const activeVariantTextValue = activeVariant?.[activeLanguageDef.field] || "";
    const languageCompletion = useMemo(() => LANGUAGES.map((language) => {
        const values = [
            selectedContent?.[language.field] || "",
            ...selectedVariants.map((variant) => variant?.[language.field] || "")
        ];
        const total = Math.max(values.length, 1);
        const filled = values.filter(hasRichTextContent).length;
        const status = filled === 0 ? "empty" : filled >= total ? "complete" : "partial";

        return {
            ...language,
            filled,
            total,
            percent: Math.round((filled / total) * 100),
            status
        };
    }), [selectedContent, selectedVariants]);
    const handleMainTextChange = useCallback((nextValue) => {
        if (!selectedContentChannel) return;
        updateChannelContent(selectedContentChannel, activeLanguageDef.field, nextValue);
    }, [activeLanguageDef.field, selectedContentChannel, updateChannelContent]);
    const handleMainVariantNameChange = useCallback((event) => {
        if (!selectedContentChannel) return;
        updateChannelContent(selectedContentChannel, "mainVariantName", event.target.value);
    }, [selectedContentChannel, updateChannelContent]);
    const handleVariantTextChange = useCallback((nextValue) => {
        if (!selectedContentChannel || !activeVariant) return;
        updateVariant(selectedContentChannel, activeVariant.id, activeLanguageDef.field, nextValue);
    }, [activeLanguageDef.field, activeVariant, selectedContentChannel, updateVariant]);
    const handleVariantNameChange = useCallback((event) => {
        if (!selectedContentChannel || !activeVariant) return;
        updateVariant(selectedContentChannel, activeVariant.id, "name", event.target.value);
    }, [activeVariant, selectedContentChannel, updateVariant]);
    const openMainPreview = useCallback(() => {
        if (!selectedContentChannel) return;
        setPreviewRequest({
            title: `${CHANNEL_LABELS[selectedContentChannel]} · ${activeLanguageDef.label}`,
            label: selectedContent?.mainVariantName || selectedContent?.title || "Main text",
            value: activeTextValue
        });
    }, [activeLanguageDef.label, activeTextValue, selectedContent, selectedContentChannel]);
    const openVariantPreview = useCallback(() => {
        if (!selectedContentChannel || !activeVariant) return;
        setPreviewRequest({
            title: `${activeVariant.name || "Variant"} · ${activeLanguageDef.label}`,
            label: CHANNEL_LABELS[selectedContentChannel],
            value: activeVariantTextValue
        });
    }, [activeLanguageDef.label, activeVariant, activeVariantTextValue, selectedContentChannel]);
    return (
        <Modal
            onClose={onClose}
            ariaLabel={isEdit ? "Edit template" : "New template"}
            dialogClassName="popup-box node-template-dialog"
        >
            <form onSubmit={submit} className="node-template-modal">
                <div className="popup-header">
                    <div>
                        <h2>{isEdit ? "Edit template" : "New template"}</h2>
                    </div>
                </div>
                <div className="node-form node-form--compact">
                    <div className="node-template-setup">
                        <div className="form-field node-template-title-field">
                            <label>Title</label>
                            <input
                                autoFocus
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Request OTO photo"
                            />
                        </div>
                        <div className="node-template-channel-control">
                            <span className="node-template-field-label">Channels</span>
                            <div className="node-channel-options node-channel-options--compact">
                                {CHANNEL_VALUES.map((channel) => {
                                    const selected = channels.includes(channel);
                                    return (
                                        <button
                                            key={channel}
                                            type="button"
                                            className={`node-channel-option${selected ? " is-selected" : ""}`}
                                            onClick={() => toggleChannel(channel)}
                                            aria-pressed={selected}
                                            aria-label={`${CHANNEL_LABELS[channel]} - ${CHANNEL_DESCRIPTIONS[channel]}`}
                                            title={CHANNEL_DESCRIPTIONS[channel]}
                                        >
                                            <span className="node-channel-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                                            <strong>{CHANNEL_LABELS[channel]}</strong>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <section className="node-template-section node-template-section--content node-template-section--editor">
                        {selectedContentChannel ? (
                            <div className={`node-content-workbench${channels.length === 1 ? " is-single" : ""}`}>
                                {channels.length > 1 && (
                                    <div className="node-content-tabs" role="tablist" aria-label="Template content channels">
                                        {channels.map((channel) => (
                                            <button
                                                key={channel}
                                                type="button"
                                                role="tab"
                                                aria-selected={selectedContentChannel === channel}
                                                className={selectedContentChannel === channel ? "is-active" : ""}
                                                onClick={() => setActiveContentChannel(channel)}
                                            >
                                                {CHANNEL_LABELS[channel]}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="node-content-editor">
                                    <div className="node-content-editor-head">
                                        <div>
                                            <label>{CHANNEL_LABELS[selectedContentChannel]}</label>
                                        </div>
                                        <div className="node-template-editor-actions">
                                            <div className="node-language-tabs node-language-tabs--progress" role="tablist" aria-label="Template languages">
                                                {languageCompletion.map((language) => (
                                                    <button
                                                        key={language.code}
                                                        type="button"
                                                        role="tab"
                                                        aria-selected={activeLanguage === language.code}
                                                        aria-label={`${language.label}: ${language.filled} of ${language.total} filled`}
                                                        className={`${activeLanguage === language.code ? "is-active " : ""}is-${language.status}`.trim()}
                                                        style={{ "--language-fill": `${language.percent}%` }}
                                                        onClick={() => setActiveLanguage(language.code)}
                                                        title={`${language.label}: ${language.filled}/${language.total} filled`}
                                                    >
                                                        <span className="node-language-label">{language.label}</span>
                                                        <span className="node-language-fill" aria-hidden="true">
                                                            <span />
                                                        </span>
                                                        <small className="node-language-count">
                                                            {language.status === "complete" ? "✓" : `${language.filled}/${language.total}`}
                                                        </small>
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                className="secondary-btn node-preview-btn"
                                                onClick={openMainPreview}
                                            >
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                    <div className="node-content-main">
                                        <div className="node-content-edit-pane">
                                            <div className="form-field">
                                                <label>Main variant label</label>
                                                <input
                                                    value={selectedContent?.mainVariantName || ""}
                                                    onChange={handleMainVariantNameChange}
                                                    placeholder="Main"
                                                />
                                            </div>
                                            <RichTextEditor
                                                className="node-content-rich-editor"
                                                value={activeTextValue}
                                                onChange={handleMainTextChange}
                                                placeholder={`${activeLanguageDef.label} HTML`}
                                                tokens={tokens}
                                                onTokenCreate={createToken}
                                            />
                                        </div>
                                    </div>
                                    <div className="variant-editor">
                                        <div className="variant-editor-head">
                                            <div>
                                                <label>Variants</label>
                                            </div>
                                            <button
                                                type="button"
                                                className="secondary-btn"
                                                onClick={() => addVariant(selectedContentChannel)}
                                            >
                                                + Variant
                                            </button>
                                        </div>
                                        {selectedVariants.length > 0 ? (
                                            <div className="variant-split">
                                                <div className="variant-list" aria-label="Template variants">
                                                    {selectedVariants.map((variant) => (
                                                        <button
                                                            key={variant.id}
                                                            type="button"
                                                            className={`variant-list-item${variant.id === activeVariantId ? " active" : ""}`}
                                                            onClick={() => setActiveVariantByChannel((current) => ({
                                                                ...current,
                                                                [selectedContentChannel]: variant.id
                                                            }))}
                                                        >
                                                            {variant.name || "Variant"}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="variant-content">
                                                    {activeVariant ? (
                                                        <div className="variant-content-inner">
                                                            <div className="variant-panel-header">
                                                                <div className="variant-name-field">
                                                                    <label>Variant name</label>
                                                                    <input
                                                                        value={activeVariant.name || ""}
                                                                        onChange={handleVariantNameChange}
                                                                        placeholder="Variant name"
                                                                    />
                                                                </div>
                                                                <div className="node-template-editor-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="secondary-btn node-preview-btn"
                                                                        onClick={openVariantPreview}
                                                                    >
                                                                        Preview
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="reset-fields-btn"
                                                                        onClick={() => removeVariant(selectedContentChannel, activeVariant.id)}
                                                                    >
                                                                        Delete variant
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="node-content-main">
                                                                <div className="node-content-edit-pane">
                                                                    <RichTextEditor
                                                                        className="node-content-rich-editor"
                                                                        value={activeVariantTextValue}
                                                                        onChange={handleVariantTextChange}
                                                                        placeholder={`${activeLanguageDef.label} variant HTML`}
                                                                        tokens={tokens}
                                                                        onTokenCreate={createToken}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="variant-empty">Select a variant to edit.</div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="variant-empty">No variants yet.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="node-content-empty">
                                Select at least one channel to start writing.
                            </div>
                        )}
                    </section>
                </div>
                <div className="popup-actions">
                    <button type="submit" className="primary-btn" disabled={!canSubmit}>{isEdit ? "Save" : "Create"}</button>
                </div>
            </form>
            {previewRequest && (
                <Modal
                    onClose={() => setPreviewRequest(null)}
                    ariaLabel="Template preview"
                    dialogClassName="popup-box node-template-preview-modal"
                >
                    <div className="popup-header">
                        <div>
                            <p className="template-result-kicker">Preview</p>
                            <h2>{previewRequest.title}</h2>
                            {previewRequest.label && <p className="node-modal-subtitle">{previewRequest.label}</p>}
                        </div>
                    </div>
                    <div className="node-content-preview-body node-content-preview-body--modal">
                        {previewRequest.value.trim() ? (
                            <div dangerouslySetInnerHTML={{ __html: previewRequest.value }} />
                        ) : (
                            <p>No content yet.</p>
                        )}
                    </div>
                </Modal>
            )}
        </Modal>
    );
}

const EMPTY_NODE_SUMMARY = { childCount: 0, templateCount: 0 };

const NodeTreeRow = memo(function NodeTreeRow({
    node,
    summary,
    selected,
    onSelect
}) {
    const handleSelect = useCallback(() => {
        onSelect(node.id);
    }, [node.id, onSelect]);

    return (
        <div className="node-tree-item">
            <div className={`node-tree-row${selected ? " is-selected" : ""}`}>
                <button
                    type="button"
                    className="node-tree-main"
                    onClick={handleSelect}
                >
                    <span className="node-tree-icon"><NodeIconGlyph icon={node.icon} /></span>
                    <span className="node-tree-copy">
                        <strong>{node.title || "Untitled section"}</strong>
                    </span>
                    <span className="node-tree-counts">
                        {summary.childCount > 0 && <span>{summary.childCount} section{summary.childCount === 1 ? "" : "s"}</span>}
                        {summary.templateCount > 0 && <span>{summary.templateCount} template{summary.templateCount === 1 ? "" : "s"}</span>}
                    </span>
                </button>
            </div>
        </div>
    );
});

const NodeTreeRows = memo(function NodeTreeRows({
    childrenByParent,
    nodeSummaryById,
    parentId,
    selectedNodeId,
    onSelect
}) {
    const children = getIndexedChildNodes(childrenByParent, parentId);
    return children.map((node) => (
        <NodeTreeRow
            key={node.id}
            node={node}
            summary={nodeSummaryById.get(node.id) || EMPTY_NODE_SUMMARY}
            selected={selectedNodeId === node.id}
            onSelect={onSelect}
        />
    ));
});

const NodeTemplateRow = memo(function NodeTemplateRow({
    template,
    selectedNodeId,
    linkTarget,
    nodeLookup,
    finalNodeOptions,
    onEdit,
    onDuplicate,
    onUnlink,
    onDelete,
    onLinkTargetChange,
    onLink
}) {
    const otherNodes = useMemo(() => (
        (template.nodeIds || [])
            .filter((nodeId) => nodeId !== selectedNodeId)
            .map((nodeId) => nodeLookup.get(nodeId))
            .filter(Boolean)
    ), [nodeLookup, selectedNodeId, template.nodeIds]);

    const linkOptions = useMemo(() => (
        finalNodeOptions.filter(({ node }) => !(template.nodeIds || []).includes(node.id))
    ), [finalNodeOptions, template.nodeIds]);

    const handleEdit = useCallback(() => {
        onEdit(template);
    }, [onEdit, template]);

    const handleDuplicate = useCallback(() => {
        onDuplicate(template.id);
    }, [onDuplicate, template.id]);

    const handleUnlink = useCallback(() => {
        onUnlink(template.id, selectedNodeId);
    }, [onUnlink, selectedNodeId, template.id]);

    const handleDelete = useCallback(() => {
        onDelete(template.id);
    }, [onDelete, template.id]);

    const handleLinkTargetChange = useCallback((event) => {
        onLinkTargetChange(template.id, event.target.value);
    }, [onLinkTargetChange, template.id]);

    const handleLink = useCallback(() => {
        onLink(template.id, linkTarget);
    }, [linkTarget, onLink, template.id]);

    return (
        <article className="node-template-row">
            <div className="node-template-main">
                <span className="node-tree-icon node-template-icon"><NodeIconGlyph icon="template" /></span>
                <div className="node-template-copy">
                    <strong>{template.title || "Untitled template"}</strong>
                    <div className="node-template-meta">
                        <div className="node-channel-pills">
                            {template.channels.map((channel) => (
                                <span key={channel} className="variant-pill">{CHANNEL_LABELS[channel] || channel}</span>
                            ))}
                        </div>
                        {otherNodes.length > 0 && (
                            <div className="node-template-nodes">
                                <span className="node-template-nodes-label">Also in:</span>
                                {otherNodes.map((node) => (
                                    <span key={node.id} className="node-template-node-pill">{node.title}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="node-template-toolbar">
                <button type="button" className="secondary-btn" onClick={handleEdit}>
                    Edit
                </button>
                <button type="button" className="secondary-btn" onClick={handleDuplicate}>Duplicate</button>
                {(template.nodeIds || []).length > 1 && (
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={handleUnlink}
                        title="Remove this template from this section only"
                    >
                        Unlink
                    </button>
                )}
                <button type="button" className="icon-btn delete-btn" onClick={handleDelete} aria-label={`Delete ${template.title}`}>
                    <span className="icon-trash" aria-hidden="true"></span>
                </button>
            </div>
            <div className="node-template-move">
                <select value={linkTarget} onChange={handleLinkTargetChange}>
                    <option value="">Link to final section...</option>
                    {linkOptions.map(({ node, depth }) => (
                        <option key={node.id} value={node.id}>
                            {`${"  ".repeat(depth)}${node.title || "Untitled section"}`}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleLink}
                    disabled={!linkTarget}
                >
                    Link
                </button>
            </div>
        </article>
    );
});

export default function ManageNodes({ embedded = false, onClose = null }) {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [nodeModal, setNodeModal] = useState(null);
    const [templateModal, setTemplateModal] = useState(null);
    const [existingPickerModal, setExistingPickerModal] = useState(null);
    const [confirmNodeDelete, setConfirmNodeDelete] = useState(null);
    const [confirmTemplateDelete, setConfirmTemplateDelete] = useState(null);
    const [templateLinkTargets, setTemplateLinkTargets] = useState({});

    useEffect(() => {
        let active = true;
        loadTemplateTreeData().then((treeData) => {
            if (!active) return;
            setNodes(treeData.nodes);
            setTemplates(treeData.templates);
            setSelectedNodeId((current) => (
                current && treeData.nodes.some((node) => node.id === current) ? current : null
            ));
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (nodes.length === 0) {
            if (selectedNodeId !== null) setSelectedNodeId(null);
            return;
        }
        if (!nodes.some((node) => node.id === selectedNodeId)) {
            setSelectedNodeId(null);
        }
    }, [nodes, selectedNodeId]);

    const nodeLookup = useMemo(() => buildNodeLookup(nodes), [nodes]);
    const childrenByParent = useMemo(() => buildNodeChildrenIndex(nodes), [nodes]);
    const templatesByNode = useMemo(() => buildTemplateNodeIndex(templates), [templates]);
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
    const selectedNode = useMemo(
        () => nodeLookup.get(selectedNodeId) || null,
        [nodeLookup, selectedNodeId]
    );
    const selectedTemplates = useMemo(
        () => selectedNode ? getIndexedTemplatesForNode(templatesByNode, selectedNode.id) : [],
        [selectedNode, templatesByNode]
    );
    const selectedChildNodes = useMemo(
        () => selectedNode ? getIndexedChildNodes(childrenByParent, selectedNode.id) : [],
        [childrenByParent, selectedNode]
    );
    const nodeOptions = useMemo(() => buildNodeOptions(childrenByParent), [childrenByParent]);
    const finalNodeOptions = useMemo(
        () => nodeOptions.filter(({ node }) => (nodeSummaryById.get(node.id)?.childCount || 0) === 0),
        [nodeOptions, nodeSummaryById]
    );
    const selectedDescendantIds = useMemo(
        () => selectedNode ? getDescendantNodeIds(nodes, selectedNode.id) : [],
        [nodes, selectedNode]
    );

    // Leaf/branch rule: a section can hold subsections OR templates, not both.
    const selectedNodeCanAddChild = useMemo(
        () => selectedNode ? selectedTemplates.length === 0 : false,
        [selectedNode, selectedTemplates]
    );
    const selectedNodeCanAddTemplate = useMemo(
        () => selectedNode ? selectedChildNodes.length === 0 : false,
        [selectedChildNodes, selectedNode]
    );

    const persist = useCallback(async (nextNodes = nodes, nextTemplates = templates) => {
        setNodes(nextNodes);
        setTemplates(nextTemplates);
        await saveTemplateTreeData({ nodes: nextNodes, templates: nextTemplates });
    }, [nodes, templates]);

    const openRootNodeModal = () => {
        setNodeModal({ mode: "create", parentId: null });
    };

    const openChildNodeModal = (parentId = selectedNodeId) => {
        if (!parentId) return;
        setNodeModal({ mode: "create", parentId });
    };

    const openEditNodeModal = (node) => {
        setNodeModal({ mode: "edit", node });
    };

    const saveNode = async (fields) => {
        if (!nodeModal) return;
        if (nodeModal.mode === "edit") {
            const nextNodes = updateNode(nodes, nodeModal.node.id, fields);
            await persist(nextNodes, templates);
            showToast("Section updated", "info");
        } else {
            try {
                const nextNode = createNodeForParent(nodes, nodeModal.parentId, fields, templates);
                await persist([...nodes, nextNode], templates);
                setSelectedNodeId(nextNode.id);
                showToast("Section created", "info");
            } catch (error) {
                showToast(error.message, "error");
                return;
            }
        }
        setNodeModal(null);
    };

    const deleteSelectedNode = async () => {
        if (!confirmNodeDelete) return;
        const next = removeNodeCascade(nodes, templates, confirmNodeDelete);
        await persist(next.nodes, next.templates);
        setConfirmNodeDelete(null);
        showToast("Section deleted", "warning");
    };

    const changeSelectedParent = async (value) => {
        if (!selectedNode) return;
        const nextParentId = value === ROOT_PARENT_VALUE ? null : value;
        if ((selectedNode.parentId || null) === nextParentId) return;

        try {
            const nextNodes = moveNode(nodes, selectedNode.id, nextParentId);
            await persist(nextNodes, templates);
            showToast("Section moved", "info");
        } catch (error) {
            console.error(error);
            showToast("Section cannot be moved there", "error");
        }
    };

    const reorderSelectedNode = async (nodeId, direction) => {
        const nextNodes = reorderNode(nodes, nodeId, direction);
        await persist(nextNodes, templates);
    };

    const saveTemplate = async (fields) => {
        if (!templateModal) return;
        if (templateModal.mode === "edit") {
            const nextTemplates = updateTemplate(templates, templateModal.template.id, fields);
            await persist(nodes, nextTemplates);
            showToast("Template updated", "info");
        } else {
            try {
                const nextTemplate = createTemplateForNode(templateModal.parentNodeId, fields, nodes, templates);
                await persist(nodes, [...templates, nextTemplate]);
                showToast("Template created", "info");
            } catch (error) {
                showToast(error.message, "error");
                return;
            }
        }
        setTemplateModal(null);
    };

    const deleteTemplate = async () => {
        if (!confirmTemplateDelete) return;
        const nextTemplates = removeTemplate(templates, confirmTemplateDelete);
        await persist(nodes, nextTemplates);
        setConfirmTemplateDelete(null);
        showToast("Template deleted", "warning");
    };

    const openTemplateEditModal = useCallback((template) => {
        setTemplateModal({ mode: "edit", template, parentNodeId: template.parentNodeId });
    }, []);

    const requestTemplateDelete = useCallback((templateId) => {
        setConfirmTemplateDelete(templateId);
    }, []);

    const changeTemplateLinkTarget = useCallback((templateId, targetNodeId) => {
        setTemplateLinkTargets((current) => ({
            ...current,
            [templateId]: targetNodeId
        }));
    }, []);

    const duplicateSelectedTemplate = useCallback(async (templateId) => {
        const nextTemplates = duplicateTemplate(templates, templateId);
        await persist(nodes, nextTemplates);
        showToast("Template duplicated", "info");
    }, [nodes, persist, templates]);

    const openTemplateCreationPicker = (nodeId = selectedNodeId) => {
        if (!nodeId) return;
        setTemplateModal({ mode: "create", parentNodeId: nodeId });
    };

    const linkTemplateToCurrentNode = useCallback(async (templateId) => {
        if (!existingPickerModal?.nodeId) return;
        try {
            const nextTemplates = linkTemplateToNode(templates, templateId, existingPickerModal.nodeId, nodes);
            await persist(nodes, nextTemplates);
            setExistingPickerModal(null);
            showToast("Template linked", "info");
        } catch (error) {
            console.error(error);
            showToast("Template cannot be linked there", "error");
        }
    }, [existingPickerModal?.nodeId, nodes, persist, templates]);

    const linkTemplate = useCallback(async (templateId, targetNodeId) => {
        if (!targetNodeId) return;
        try {
            const nextTemplates = linkTemplateToNode(templates, templateId, targetNodeId, nodes);
            await persist(nodes, nextTemplates);
            setTemplateLinkTargets((current) => {
                const next = { ...current };
                delete next[templateId];
                return next;
            });
            showToast("Template linked to section", "info");
        } catch (error) {
            console.error(error);
            showToast("Template cannot be linked there", "error");
        }
    }, [nodes, persist, templates]);

    const unlinkFromNode = useCallback(async (templateId, nodeId) => {
        const template = templates.find((t) => t.id === templateId);
        if (!template || (template.nodeIds || []).length <= 1) return;
        const nextTemplates = unlinkTemplateFromNode(templates, templateId, nodeId);
        await persist(nodes, nextTemplates);
        showToast("Template unlinked from section", "info");
    }, [nodes, persist, templates]);

    const parentSelectValue = selectedNode?.parentId || ROOT_PARENT_VALUE;
    const selectedParentTitle = selectedNode?.parentId
        ? nodeLookup.get(selectedNode.parentId)?.title || ""
        : "";
    const goBackOneLevel = () => {
        setSelectedNodeId(selectedNode?.parentId || null);
    };

    return (
        <main className={`page-container node-builder-page${embedded ? " node-builder-page--embedded" : ""}`}>
            <div className="node-builder-shell">
                <header className="node-builder-header">
                    <div className="node-builder-title">
                        {!embedded && (
                            <button
                                type="button"
                                className="node-back-btn"
                                onClick={() => navigate("/")}
                            >
                                Back
                            </button>
                        )}
                        <h1>Playbook</h1>
                    </div>
                </header>

                <div className={`node-builder-layout${selectedNode ? " node-builder-layout--detail" : " node-builder-layout--list"}`}>
                    {!selectedNode ? (
                        <section className="node-tree-panel node-list-panel" aria-label="Sections">
                            <div className="node-list-header">
                                <div>
                                    <h2>Sections</h2>
                                </div>
                                <button type="button" className="primary-btn" onClick={openRootNodeModal}>+ Section</button>
                            </div>
                            <div className="node-tree-list node-tree-list--primary">
                                {nodes.length === 0 ? (
                                    <EmptyState
                                        message="No sections yet."
                                        action={<button type="button" className="secondary-btn" onClick={openRootNodeModal}>Create section</button>}
                                    />
                                ) : (
                                    <NodeTreeRows
                                        childrenByParent={childrenByParent}
                                        nodeSummaryById={nodeSummaryById}
                                        parentId={null}
                                        selectedNodeId={selectedNodeId}
                                        onSelect={setSelectedNodeId}
                                    />
                                )}
                            </div>
                        </section>
                    ) : (
                        <section className="node-canvas-panel node-detail-view" aria-label="Section detail">
                            <button type="button" className="node-back-btn node-list-back-btn" onClick={goBackOneLevel}>
                                {selectedNode.parentId ? "← Back" : "← Sections"}
                            </button>

                            <div className="node-canvas-hero node-canvas-hero--detail">
                                <div className="node-hero-icon"><NodeIconGlyph icon={selectedNode.icon} /></div>
                                <div className="node-hero-copy">
                                    <h2>{selectedNode.title || "Untitled section"}</h2>
                                </div>
                                <div className="node-detail-top-actions">
                                    <button type="button" className="secondary-btn" onClick={() => openEditNodeModal(selectedNode)}>Rename</button>
                                    <button type="button" className="reset-fields-btn" onClick={() => setConfirmNodeDelete(selectedNode.id)}>Delete</button>
                                </div>
                            </div>

                            <section className="node-board-section">
                                <div className="node-board-head">
                                    <h3>Subsections</h3>
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() => openChildNodeModal(selectedNode.id)}
                                        disabled={!selectedNodeCanAddChild}
                                        title={!selectedNodeCanAddChild ? "This section already contains templates — remove them first" : undefined}
                                    >
                                        + Section
                                    </button>
                                </div>
                                {!selectedNodeCanAddChild && selectedChildNodes.length === 0 ? (
                                    <p className="node-rule-hint">This section already contains templates.</p>
                                ) : selectedChildNodes.length === 0 ? (
                                    <button type="button" className="node-empty-tile" onClick={() => openChildNodeModal(selectedNode.id)}>
                                        + Section
                                    </button>
                                ) : (
                                    <div className="node-tree-list node-tree-list--level">
                                        <NodeTreeRows
                                            childrenByParent={childrenByParent}
                                            nodeSummaryById={nodeSummaryById}
                                            parentId={selectedNode.id}
                                            selectedNodeId={selectedNodeId}
                                            onSelect={setSelectedNodeId}
                                        />
                                    </div>
                                )}
                            </section>

                            <section className="node-board-section">
                                <div className="node-board-head">
                                    <h3>Templates</h3>
                                    <button
                                        type="button"
                                        className="primary-btn"
                                        onClick={() => openTemplateCreationPicker(selectedNode.id)}
                                        disabled={!selectedNodeCanAddTemplate}
                                        title={!selectedNodeCanAddTemplate ? "This section has subsections — templates go in final sections only" : undefined}
                                    >
                                        + Template
                                    </button>
                                </div>
                                {!selectedNodeCanAddTemplate && selectedTemplates.length === 0 ? (
                                    <p className="node-rule-hint">Templates go in final sections only.</p>
                                ) : selectedTemplates.length === 0 ? (
                                    <button
                                        type="button"
                                        className="node-empty-tile"
                                        onClick={() => openTemplateCreationPicker(selectedNode.id)}
                                    >
                                        + Template
                                    </button>
                                ) : (
                                    <div className="node-template-list">
                                        {selectedTemplates.map((template) => (
                                            <NodeTemplateRow
                                                key={template.id}
                                                template={template}
                                                selectedNodeId={selectedNode.id}
                                                linkTarget={templateLinkTargets[template.id] || ""}
                                                nodeLookup={nodeLookup}
                                                finalNodeOptions={finalNodeOptions}
                                                onEdit={openTemplateEditModal}
                                                onDuplicate={duplicateSelectedTemplate}
                                                onUnlink={unlinkFromNode}
                                                onDelete={requestTemplateDelete}
                                                onLinkTargetChange={changeTemplateLinkTarget}
                                                onLink={linkTemplate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            <details className="node-detail-settings">
                                <summary>Settings</summary>
                                <div className="node-detail-settings-grid">
                                    <div className="node-admin-block">
                                        <label>Parent</label>
                                        <select
                                            value={parentSelectValue}
                                            onChange={(event) => changeSelectedParent(event.target.value)}
                                        >
                                            <option value={ROOT_PARENT_VALUE}>Top level</option>
                                            {nodeOptions
                                                .filter(({ node }) => (
                                                    node.id !== selectedNode.id
                                                    && !selectedDescendantIds.includes(node.id)
                                                    && canMoveNode(nodes, selectedNode.id, node.id)
                                                ))
                                                .map(({ node, depth }) => (
                                                    <option key={node.id} value={node.id}>
                                                        {`${"  ".repeat(depth)}${node.title || "Untitled section"}`}
                                                    </option>
                                                ))}
                                        </select>
                                        {selectedParentTitle && <small>{selectedParentTitle}</small>}
                                    </div>
                                    <div className="node-admin-block">
                                        <label>Order</label>
                                        <div className="node-order-controls">
                                            <button type="button" className="secondary-btn" onClick={() => reorderSelectedNode(selectedNode.id, "up")}>Up</button>
                                            <button type="button" className="secondary-btn" onClick={() => reorderSelectedNode(selectedNode.id, "down")}>Down</button>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </section>
                    )}
                </div>

                {nodeModal && (
                    <NodeFormModal
                        mode={nodeModal.mode}
                        initial={nodeModal.node}
                        parentTitle={nodeModal.parentId ? nodeLookup.get(nodeModal.parentId)?.title : ""}
                        onClose={() => setNodeModal(null)}
                        onSave={saveNode}
                    />
                )}

                {templateModal && (
                    <TemplateFormModal
                        initial={templateModal.template}
                        parentTitle={nodeLookup.get(templateModal.parentNodeId)?.title || "Selected section"}
                        onClose={() => setTemplateModal(null)}
                        onSave={saveTemplate}
                    />
                )}

                {existingPickerModal && (
                    <ExistingTemplatePickerModal
                        currentNodeId={existingPickerModal.nodeId}
                        allTemplates={templates}
                        nodeLookup={nodeLookup}
                        onClose={() => setExistingPickerModal(null)}
                        onLink={linkTemplateToCurrentNode}
                    />
                )}

                {confirmNodeDelete && (
                    <ConfirmDialog
                        title="Delete section"
                        message="Delete this section, its subsections, and all templates inside them?"
                        confirmLabel="Delete"
                        variant="danger"
                        onConfirm={deleteSelectedNode}
                        onCancel={() => setConfirmNodeDelete(null)}
                    />
                )}

                {confirmTemplateDelete && (
                    <ConfirmDialog
                        title="Delete template"
                        message="Delete this template from the playbook?"
                        confirmLabel="Delete"
                        variant="danger"
                        onConfirm={deleteTemplate}
                        onCancel={() => setConfirmTemplateDelete(null)}
                    />
                )}
            </div>
        </main>
    );
}
