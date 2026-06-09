import { useEffect, useMemo, useState } from "react";
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
    canMoveNode,
    createNodeForParent,
    createTemplateForNode,
    duplicateTemplate,
    getChildNodes,
    getDescendantNodeIds,
    getTemplatesForNode,
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

function getNodeIconPreset(icon) {
    return NODE_ICON_PRESETS.find((preset) => preset.value === icon) || null;
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

function NodeIconGlyph({ icon }) {
    const preset = getNodeIconPreset(icon);
    return (
        <svg className="node-symbol" viewBox="0 0 24 24" aria-hidden="true">
            {renderNodeIconPaths(preset?.kind || "tag")}
        </svg>
    );
}

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

function buildNodeOptions(nodes, parentId = null, depth = 0) {
    return getChildNodes(nodes, parentId).flatMap((node) => [
        { node, depth },
        ...buildNodeOptions(nodes, node.id, depth + 1)
    ]);
}

function NodeFormModal({ mode, initial, parentTitle, onClose, onSave }) {
    const isEdit = mode === "edit";
    const [title, setTitle] = useState(initial?.title || "");
    const [description, setDescription] = useState(initial?.description || "");
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
            description: description.trim(),
            icon: icon.trim()
        });
    };

    return (
        <Modal onClose={onClose} ariaLabel={isEdit ? "Rename node" : "New node"}>
            <form onSubmit={submit} className="node-node-modal">
                <div className="popup-header">
                    <h2>{isEdit ? "Rename node" : parentTitle ? "New sub-node" : "New root node"}</h2>
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
                            <strong>{title || "Untitled node"}</strong>
                            {description && <small>{description}</small>}
                        </span>
                    </div>
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
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Business context"
                            rows={3}
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
                                        <button type="button" className="node-mini-btn" onClick={() => setIconMenuOpen(false)}>Close</button>
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
                <div className="popup-actions">
                    <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                    <button type="submit" className="primary-btn" disabled={!canSubmit}>{isEdit ? "Save" : "Create"}</button>
                </div>
            </form>
        </Modal>
    );
}

function TemplateCreatePickerModal({ onClose, onCreateNew, onLinkExisting }) {
    return (
        <Modal onClose={onClose} ariaLabel="Add template">
            <div className="node-picker-modal">
                <div className="popup-header">
                    <h2>Add template</h2>
                </div>
                <div className="node-picker-choice">
                    <button type="button" className="node-picker-choice-btn" onClick={onCreateNew}>
                        <strong>New template</strong>
                        <small>Create a brand new template for this node</small>
                    </button>
                    <button type="button" className="node-picker-choice-btn" onClick={onLinkExisting}>
                        <strong>Link existing</strong>
                        <small>Add an existing template to this node</small>
                    </button>
                </div>
                <div className="popup-actions">
                    <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </Modal>
    );
}

function ExistingTemplatePickerModal({ currentNodeId, allTemplates, nodes, onClose, onLink }) {
    const [query, setQuery] = useState("");

    const alreadyLinked = new Set(
        allTemplates
            .filter((t) => (t.nodeIds || []).includes(currentNodeId))
            .map((t) => t.id)
    );

    const filtered = allTemplates.filter((t) => {
        if (alreadyLinked.has(t.id)) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            (t.title || "").toLowerCase().includes(q)
            || (t.description || "").toLowerCase().includes(q)
        );
    });

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
                        {filtered.length === 0 ? (
                            <p className="node-picker-empty">
                                {allTemplates.length === alreadyLinked.size
                                    ? "All templates are already linked to this node."
                                    : "No matching templates."}
                            </p>
                        ) : (
                            filtered.map((template) => {
                                const nodeNames = (template.nodeIds || [])
                                    .map((id) => nodes.find((n) => n.id === id)?.title || "?")
                                    .join(", ");
                                return (
                                    <div key={template.id} className="node-picker-row">
                                        <div className="node-picker-copy">
                                            <strong>{template.title || "Untitled template"}</strong>
                                            {template.description && <small>{template.description}</small>}
                                            {nodeNames && <span className="node-picker-nodes">In: {nodeNames}</span>}
                                            <div className="node-channel-pills">
                                                {template.channels.map((channel) => (
                                                    <span key={channel} className="variant-pill">{CHANNEL_LABELS[channel] || channel}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="button" className="primary-btn" onClick={() => onLink(template.id)}>
                                            Link
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="popup-actions">
                    <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </Modal>
    );
}

function TemplateFormModal({ initial, parentTitle, onClose, onSave }) {
    const isEdit = Boolean(initial);
    const [title, setTitle] = useState(initial?.title || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [channels, setChannels] = useState(initial?.channels || []);
    const [contentByChannel, setContentByChannel] = useState(initial?.contentByChannel || {});
    const [activeContentChannel, setActiveContentChannel] = useState(initial?.channels?.[0] || Channel.EMAIL);
    const [activeLanguage, setActiveLanguage] = useState("fr");
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

    const createToken = async (tokenDef) => {
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
    };

    const toggleChannel = (channel) => {
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
    };

    const updateChannelContent = (channel, field, value) => {
        setContentByChannel((current) => ({
            ...current,
            [channel]: {
                ...createChannelContentDraft(channel, title.trim()),
                ...(current[channel] || {}),
                [field]: value
            }
        }));
    };

    const submit = (event) => {
        event.preventDefault();
        if (!canSubmit) return;
        const normalizedTitle = title.trim();

        onSave({
            title: normalizedTitle,
            description: description.trim(),
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

    return (
        <Modal onClose={onClose} ariaLabel={isEdit ? "Edit template" : "New template"}>
            <form onSubmit={submit} className="node-template-modal">
                <div className="popup-header">
                    <h2>{isEdit ? "Edit template" : "New template"}</h2>
                </div>
                <div className="node-form">
                    <div className="node-form-parent">
                        <span className="client-info-label">Node</span>
                        <strong>{parentTitle}</strong>
                    </div>
                    <div className="form-field">
                        <label>Title</label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Request OTO photo"
                        />
                    </div>
                    <div className="form-field">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Template purpose"
                            rows={3}
                        />
                    </div>
                    <div className="form-field">
                        <label>Channels</label>
                        <div className="node-channel-options">
                            {CHANNEL_VALUES.map((channel) => (
                                <button
                                    key={channel}
                                    type="button"
                                    className={`node-channel-option${channels.includes(channel) ? " is-selected" : ""}`}
                                    onClick={() => toggleChannel(channel)}
                                    aria-pressed={channels.includes(channel)}
                                >
                                    <span>{CHANNEL_LABELS[channel]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedContentChannel && (
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
                                    <label>{CHANNEL_LABELS[selectedContentChannel]}</label>
                                    <div className="node-language-tabs" role="tablist" aria-label="Template languages">
                                        {LANGUAGES.map((language) => (
                                            <button
                                                key={language.code}
                                                type="button"
                                                role="tab"
                                                aria-selected={activeLanguage === language.code}
                                                className={activeLanguage === language.code ? "is-active" : ""}
                                                onClick={() => setActiveLanguage(language.code)}
                                            >
                                                {language.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Main label</label>
                                    <input
                                        value={contentByChannel[selectedContentChannel]?.mainVariantName || ""}
                                        onChange={(event) => updateChannelContent(selectedContentChannel, "mainVariantName", event.target.value)}
                                        placeholder="Main"
                                    />
                                </div>
                                <RichTextEditor
                                    className="node-content-rich-editor"
                                    value={contentByChannel[selectedContentChannel]?.[activeLanguageDef.field] || ""}
                                    onChange={(nextValue) => updateChannelContent(selectedContentChannel, activeLanguageDef.field, nextValue)}
                                    placeholder={`${activeLanguageDef.label} HTML`}
                                    tokens={tokens}
                                    onTokenCreate={createToken}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="popup-actions">
                    <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                    <button type="submit" className="primary-btn" disabled={!canSubmit}>{isEdit ? "Save" : "Create"}</button>
                </div>
            </form>
        </Modal>
    );
}

function NodeTreeRows({
    nodes,
    templates,
    parentId,
    depth,
    selectedNodeId,
    onSelect,
    onAddChild,
    onEdit,
    onDelete,
    onReorder
}) {
    const children = getChildNodes(nodes, parentId);
    return children.map((node) => {
        const childCount = getChildNodes(nodes, node.id).length;
        const templateCount = getTemplatesForNode(templates, node.id).length;
        const siblings = getChildNodes(nodes, node.parentId);
        const siblingIndex = siblings.findIndex((candidate) => candidate.id === node.id);
        const selected = selectedNodeId === node.id;

        return (
            <div key={node.id} className="node-tree-item">
                <div
                    className={`node-tree-row${selected ? " is-selected" : ""}`}
                    style={{ "--node-depth": depth }}
                >
                    <button
                        type="button"
                        className="node-tree-main"
                        onClick={() => onSelect(node.id)}
                    >
                        <span className="node-tree-icon"><NodeIconGlyph icon={node.icon} /></span>
                        <span className="node-tree-copy">
                            <strong>{node.title || "Untitled node"}</strong>
                            {node.description && <small>{node.description}</small>}
                        </span>
                        <span className="node-tree-counts">
                            {childCount > 0 && <span>{childCount}N</span>}
                            {templateCount > 0 && <span>{templateCount}T</span>}
                        </span>
                    </button>
                    <div className="node-row-actions">
                        <button type="button" className="node-mini-btn" onClick={() => onAddChild(node.id)} aria-label={`Add child to ${node.title}`}>+</button>
                        <button type="button" className="node-mini-btn" onClick={() => onReorder(node.id, "up")} disabled={siblingIndex <= 0}>Up</button>
                        <button type="button" className="node-mini-btn" onClick={() => onReorder(node.id, "down")} disabled={siblingIndex === -1 || siblingIndex >= siblings.length - 1}>Dn</button>
                        <button type="button" className="icon-btn edit-btn" onClick={() => onEdit(node)} aria-label={`Rename ${node.title}`}>
                            <span className="icon-pencil" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="icon-btn delete-btn" onClick={() => onDelete(node.id)} aria-label={`Delete ${node.title}`}>
                            <span className="icon-trash" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <NodeTreeRows
                    nodes={nodes}
                    templates={templates}
                    parentId={node.id}
                    depth={depth + 1}
                    selectedNodeId={selectedNodeId}
                    onSelect={onSelect}
                    onAddChild={onAddChild}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReorder={onReorder}
                />
            </div>
        );
    });
}

export default function ManageNodes() {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [nodeModal, setNodeModal] = useState(null);
    const [templateModal, setTemplateModal] = useState(null);
    const [templatePickerModal, setTemplatePickerModal] = useState(null);
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
            setSelectedNodeId((current) => current || getChildNodes(treeData.nodes, null)[0]?.id || treeData.nodes[0]?.id || null);
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
            setSelectedNodeId(getChildNodes(nodes, null)[0]?.id || nodes[0]?.id || null);
        }
    }, [nodes, selectedNodeId]);

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selectedNodeId) || null,
        [nodes, selectedNodeId]
    );
    const selectedTemplates = useMemo(
        () => selectedNode ? getTemplatesForNode(templates, selectedNode.id) : [],
        [templates, selectedNode]
    );
    const selectedChildNodes = useMemo(
        () => selectedNode ? getChildNodes(nodes, selectedNode.id) : [],
        [nodes, selectedNode]
    );
    const nodeOptions = useMemo(() => buildNodeOptions(nodes), [nodes]);
    const selectedDescendantIds = useMemo(
        () => selectedNode ? getDescendantNodeIds(nodes, selectedNode.id) : [],
        [nodes, selectedNode]
    );

    const persist = async (nextNodes = nodes, nextTemplates = templates) => {
        setNodes(nextNodes);
        setTemplates(nextTemplates);
        await saveTemplateTreeData({ nodes: nextNodes, templates: nextTemplates });
    };

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
            showToast("Node updated", "info");
        } else {
            const nextNode = createNodeForParent(nodes, nodeModal.parentId, fields);
            await persist([...nodes, nextNode], templates);
            setSelectedNodeId(nextNode.id);
            showToast("Node created", "info");
        }
        setNodeModal(null);
    };

    const deleteSelectedNode = async () => {
        if (!confirmNodeDelete) return;
        const next = removeNodeCascade(nodes, templates, confirmNodeDelete);
        await persist(next.nodes, next.templates);
        setConfirmNodeDelete(null);
        showToast("Node deleted", "warning");
    };

    const changeSelectedParent = async (value) => {
        if (!selectedNode) return;
        const nextParentId = value === ROOT_PARENT_VALUE ? null : value;
        if ((selectedNode.parentId || null) === nextParentId) return;

        try {
            const nextNodes = moveNode(nodes, selectedNode.id, nextParentId);
            await persist(nextNodes, templates);
            showToast("Node moved", "info");
        } catch (error) {
            console.error(error);
            showToast("Node cannot be moved there", "error");
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
            const nextTemplate = createTemplateForNode(templateModal.parentNodeId, fields);
            await persist(nodes, [...templates, nextTemplate]);
            showToast("Template created", "info");
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

    const duplicateSelectedTemplate = async (templateId) => {
        const nextTemplates = duplicateTemplate(templates, templateId);
        await persist(nodes, nextTemplates);
        showToast("Template duplicated", "info");
    };

    const openTemplateCreationPicker = (nodeId = selectedNodeId) => {
        if (!nodeId) return;
        setTemplatePickerModal({ nodeId });
    };

    const linkTemplateToCurrentNode = async (templateId) => {
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
    };

    const linkTemplate = async (templateId) => {
        const targetNodeId = templateLinkTargets[templateId];
        if (!targetNodeId) return;
        try {
            const nextTemplates = linkTemplateToNode(templates, templateId, targetNodeId, nodes);
            await persist(nodes, nextTemplates);
            setTemplateLinkTargets((current) => {
                const next = { ...current };
                delete next[templateId];
                return next;
            });
            showToast("Template linked to node", "info");
        } catch (error) {
            console.error(error);
            showToast("Template cannot be linked there", "error");
        }
    };

    const unlinkFromNode = async (templateId, nodeId) => {
        const template = templates.find((t) => t.id === templateId);
        if (!template || (template.nodeIds || []).length <= 1) return;
        const nextTemplates = unlinkTemplateFromNode(templates, templateId, nodeId);
        await persist(nodes, nextTemplates);
        showToast("Template unlinked from node", "info");
    };

    const parentSelectValue = selectedNode?.parentId || ROOT_PARENT_VALUE;
    const selectedParentTitle = selectedNode?.parentId
        ? nodes.find((node) => node.id === selectedNode.parentId)?.title || ""
        : "";

    return (
        <main className="page-container node-builder-page">
            <div className="node-builder-shell">
                <header className="node-builder-header">
                    <div className="node-builder-title">
                        <button type="button" className="node-back-btn" onClick={() => navigate("/")}>Back</button>
                        <p className="eyebrow">Structure</p>
                        <h1>Node Builder</h1>
                    </div>
                    <div className="node-builder-actions">
                        <button type="button" className="primary-btn" onClick={openRootNodeModal}>+ Root</button>
                        <button type="button" className="secondary-btn" onClick={() => openChildNodeModal()} disabled={!selectedNode}>+ Child</button>
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => openTemplateCreationPicker()}
                            disabled={!selectedNode}
                        >
                            + Template
                        </button>
                    </div>
                </header>

                <div className="node-builder-layout">
                    <aside className="node-tree-panel" aria-label="Node tree">
                        <div className="node-panel-header">
                            <h2>Tree</h2>
                            <span>{nodes.length}</span>
                        </div>
                        <div className="node-tree-list">
                            {nodes.length === 0 ? (
                                <EmptyState
                                    message="No nodes yet."
                                    action={<button type="button" className="secondary-btn" onClick={openRootNodeModal}>Create root node</button>}
                                />
                            ) : (
                                <NodeTreeRows
                                    nodes={nodes}
                                    templates={templates}
                                    parentId={null}
                                    depth={0}
                                    selectedNodeId={selectedNodeId}
                                    onSelect={setSelectedNodeId}
                                    onAddChild={openChildNodeModal}
                                    onEdit={openEditNodeModal}
                                    onDelete={setConfirmNodeDelete}
                                    onReorder={reorderSelectedNode}
                                />
                            )}
                        </div>
                    </aside>

                    <section className="node-canvas-panel" aria-label="Selected node workspace">
                        {selectedNode ? (
                            <>
                                <div className="node-canvas-hero">
                                    <div className="node-hero-icon"><NodeIconGlyph icon={selectedNode.icon} /></div>
                                    <div className="node-hero-copy">
                                        <p className="eyebrow">Active node</p>
                                        <h2>{selectedNode.title || "Untitled node"}</h2>
                                        {selectedNode.description && <p>{selectedNode.description}</p>}
                                    </div>
                                    <div className="node-hero-meta">
                                        <span>{selectedChildNodes.length} nodes</span>
                                        <span>{selectedTemplates.length} templates</span>
                                    </div>
                                </div>

                                <section className="node-board-section">
                                    <div className="node-board-head">
                                        <h3>Sub-nodes</h3>
                                        <button type="button" className="secondary-btn" onClick={() => openChildNodeModal(selectedNode.id)}>+ Child</button>
                                    </div>
                                    {selectedChildNodes.length === 0 ? (
                                        <button type="button" className="node-empty-tile" onClick={() => openChildNodeModal(selectedNode.id)}>
                                            + Child
                                        </button>
                                    ) : (
                                        <div className="node-object-grid">
                                            {selectedChildNodes.map((node) => {
                                                const childCount = getChildNodes(nodes, node.id).length;
                                                const templateCount = getTemplatesForNode(templates, node.id).length;
                                                return (
                                                    <article key={node.id} className="node-object-card">
                                                        <button type="button" className="node-object-main" onClick={() => setSelectedNodeId(node.id)}>
                                                            <span className="node-object-icon"><NodeIconGlyph icon={node.icon} /></span>
                                                            <span>
                                                                <strong>{node.title || "Untitled node"}</strong>
                                                                {node.description && <small>{node.description}</small>}
                                                            </span>
                                                        </button>
                                                        <div className="node-object-footer">
                                                            <span>{childCount}N</span>
                                                            <span>{templateCount}T</span>
                                                            <button type="button" className="node-mini-btn" onClick={() => openChildNodeModal(node.id)} aria-label={`Add child to ${node.title}`}>+</button>
                                                        </div>
                                                    </article>
                                                );
                                            })}
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
                                        >
                                            + Template
                                        </button>
                                    </div>
                                    {selectedTemplates.length === 0 ? (
                                        <button
                                            type="button"
                                            className="node-empty-tile"
                                            onClick={() => openTemplateCreationPicker(selectedNode.id)}
                                        >
                                            + Template
                                        </button>
                                    ) : (
                                        <div className="node-template-grid">
                                            {selectedTemplates.map((template) => {
                                                const linkTarget = templateLinkTargets[template.id] || "";
                                                const otherNodes = (template.nodeIds || [])
                                                    .filter((nid) => nid !== selectedNode.id)
                                                    .map((nid) => nodes.find((n) => n.id === nid))
                                                    .filter(Boolean);
                                                return (
                                                    <article key={template.id} className="node-template-card">
                                                        <div className="node-template-copy">
                                                            <strong>{template.title || "Untitled template"}</strong>
                                                            {template.description && <p>{template.description}</p>}
                                                            <div className="node-channel-pills">
                                                                {template.channels.map((channel) => (
                                                                    <span key={channel} className="variant-pill">{CHANNEL_LABELS[channel] || channel}</span>
                                                                ))}
                                                            </div>
                                                            {otherNodes.length > 0 && (
                                                                <div className="node-template-nodes">
                                                                    <span className="node-template-nodes-label">Also in:</span>
                                                                    {otherNodes.map((n) => (
                                                                        <span key={n.id} className="node-template-node-pill">{n.title}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="node-template-toolbar">
                                                            <button
                                                                type="button"
                                                                className="secondary-btn"
                                                                onClick={() => setTemplateModal({ mode: "edit", template, parentNodeId: template.parentNodeId })}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button type="button" className="secondary-btn" onClick={() => duplicateSelectedTemplate(template.id)}>Duplicate</button>
                                                            {(template.nodeIds || []).length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="secondary-btn"
                                                                    onClick={() => unlinkFromNode(template.id, selectedNode.id)}
                                                                    title="Remove this template from this node only"
                                                                >
                                                                    Unlink
                                                                </button>
                                                            )}
                                                            <button type="button" className="icon-btn delete-btn" onClick={() => setConfirmTemplateDelete(template.id)} aria-label={`Delete ${template.title}`}>
                                                                <span className="icon-trash" aria-hidden="true"></span>
                                                            </button>
                                                        </div>
                                                        <div className="node-template-move">
                                                            <select
                                                                value={linkTarget}
                                                                onChange={(event) => setTemplateLinkTargets((current) => ({
                                                                    ...current,
                                                                    [template.id]: event.target.value
                                                                }))}
                                                            >
                                                                <option value="">Link to node…</option>
                                                                {nodeOptions
                                                                    .filter(({ node }) => !(template.nodeIds || []).includes(node.id))
                                                                    .map(({ node, depth }) => (
                                                                        <option key={node.id} value={node.id}>
                                                                            {`${"  ".repeat(depth)}${node.title || "Untitled node"}`}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                            <button
                                                                type="button"
                                                                className="secondary-btn"
                                                                onClick={() => linkTemplate(template.id)}
                                                                disabled={!linkTarget}
                                                            >
                                                                Link
                                                            </button>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>
                            </>
                        ) : (
                            <div className="node-canvas-empty">
                                <EmptyState
                                    message="No node selected."
                                    action={<button type="button" className="primary-btn" onClick={openRootNodeModal}>Create root node</button>}
                                />
                            </div>
                        )}
                    </section>

                    <aside className="node-inspector-panel" aria-label="Node inspector">
                        {selectedNode ? (
                            <>
                                <div className="node-inspector-title">
                                    <span className="node-object-icon"><NodeIconGlyph icon={selectedNode.icon} /></span>
                                    <strong>{selectedNode.title || "Untitled node"}</strong>
                                </div>
                                <div className="node-inspector-actions">
                                    <button type="button" className="secondary-btn" onClick={() => openEditNodeModal(selectedNode)}>Rename</button>
                                    <button type="button" className="reset-fields-btn" onClick={() => setConfirmNodeDelete(selectedNode.id)}>Delete</button>
                                </div>
                                <div className="node-admin-block">
                                    <label>Parent</label>
                                    <select
                                        value={parentSelectValue}
                                        onChange={(event) => changeSelectedParent(event.target.value)}
                                    >
                                        <option value={ROOT_PARENT_VALUE}>Root</option>
                                        {nodeOptions
                                            .filter(({ node }) => (
                                                node.id !== selectedNode.id
                                                && !selectedDescendantIds.includes(node.id)
                                                && canMoveNode(nodes, selectedNode.id, node.id)
                                            ))
                                            .map(({ node, depth }) => (
                                                <option key={node.id} value={node.id}>
                                                    {`${"  ".repeat(depth)}${node.title || "Untitled node"}`}
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
                            </>
                        ) : (
                            <EmptyState message="Select a node." />
                        )}
                    </aside>
                </div>

                {nodeModal && (
                    <NodeFormModal
                        mode={nodeModal.mode}
                        initial={nodeModal.node}
                        parentTitle={nodeModal.parentId ? nodes.find((node) => node.id === nodeModal.parentId)?.title : ""}
                        onClose={() => setNodeModal(null)}
                        onSave={saveNode}
                    />
                )}

                {templateModal && (
                    <TemplateFormModal
                        initial={templateModal.template}
                        parentTitle={nodes.find((node) => node.id === templateModal.parentNodeId)?.title || "Selected node"}
                        onClose={() => setTemplateModal(null)}
                        onSave={saveTemplate}
                    />
                )}

                {templatePickerModal && (
                    <TemplateCreatePickerModal
                        onClose={() => setTemplatePickerModal(null)}
                        onCreateNew={() => {
                            setTemplatePickerModal(null);
                            setTemplateModal({ mode: "create", parentNodeId: templatePickerModal.nodeId });
                        }}
                        onLinkExisting={() => {
                            setTemplatePickerModal(null);
                            setExistingPickerModal({ nodeId: templatePickerModal.nodeId });
                        }}
                    />
                )}

                {existingPickerModal && (
                    <ExistingTemplatePickerModal
                        currentNodeId={existingPickerModal.nodeId}
                        allTemplates={templates}
                        nodes={nodes}
                        onClose={() => setExistingPickerModal(null)}
                        onLink={linkTemplateToCurrentNode}
                    />
                )}

                {confirmNodeDelete && (
                    <ConfirmDialog
                        title="Delete node"
                        message="Delete this node, its sub-nodes, and all templates inside them?"
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        variant="danger"
                        onConfirm={deleteSelectedNode}
                        onCancel={() => setConfirmNodeDelete(null)}
                    />
                )}

                {confirmTemplateDelete && (
                    <ConfirmDialog
                        title="Delete template"
                        message="Delete this template from the node tree?"
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        variant="danger"
                        onConfirm={deleteTemplate}
                        onCancel={() => setConfirmTemplateDelete(null)}
                    />
                )}
            </div>
        </main>
    );
}
