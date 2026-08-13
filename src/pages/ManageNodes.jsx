import { lazy, memo, Suspense, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowRight,
    Check,
    ChevronDown,
    Copy,
    Edit3,
    ExternalLink,
    Languages,
    Link2,
    Lock,
    MoreVertical,
    Plus,
    Search,
    Sparkles,
    Star,
    Trash2,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import { showToast } from "../services/clipboardService.js";
import { CONFIG_LOCK_UPDATED_EVENT, loadConfigLocked } from "../services/appConfigService.js";
import { TEMPLATE_TREE_UPDATED_EVENT, loadTemplateTreeData, saveTemplateTreeData } from "../services/templateTreeService.js";
import { loadTemplateImageMap } from "../services/templateImageService.js";
import { loadTokens, loadTokensWithClientData, saveTokens } from "../services/tokenService.js";
import { loadChatGptPromptSettings } from "../services/chatGptPromptSettingsService.js";
import { Channel, CHANNEL_VALUES } from "../models/templateTreeModel.js";
import {
    buildNodeChildrenIndex,
    buildNodeLookup,
    buildTemplateNodeIndex,
    canMoveNode,
    createNodeForParent,
    createTemplateForNode,
    duplicateTemplate,
    getIndexedChildNodes,
    getIndexedTemplatesForNode,
    linkTemplateToNode,
    moveNodeToParentAtIndex,
    moveTemplateToNodeAtIndex,
    removeNodeCascade,
    removeTemplate,
    unlinkTemplateFromNode,
    updateNode,
    updateTemplate
} from "../utils/templateTreeOperations.js";
import {
    hydrateTemplateImageHtml,
    stripImagesFromHtml,
    TEMPLATE_IMAGES_UPDATED_EVENT
} from "../utils/templateImages.js";
import {
    buildChatGptEditorPrompt,
    parseChatGptEditorJsonResult,
    sanitizeEditorPromptHtml
} from "../utils/chatGptEditorPrompt.js";
import {
    TOPIC_COLOR_PRESETS,
    getTopicColorStyle,
    getTopicColorValue,
    normalizeTopicColor
} from "../utils/topicAppearance.js";
import { filterTemplateEditorTree } from "../utils/templateEditorSearch.js";
import "../../css/node-editor-search.css";

const TREE_DRAG_MIME = "application/x-template-tree-item";
const CHATGPT_CLIPBOARD_READ_TIMEOUT_MS = 3500;
const TEMPLATE_DROP_BEFORE_THRESHOLD = 0.42;
const TEMPLATE_DROP_AFTER_THRESHOLD = 0.58;
const RichTextEditor = lazy(() => import("../components/RichTextEditor.jsx"));

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

const RichTextEditorFallback = memo(function RichTextEditorFallback() {
    return (
        <div className="node-content-rich-editor node-content-empty">
            Loading editor...
        </div>
    );
});

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

function sanitizeContentForChannel(channel, content = {}) {
    if (channel !== Channel.SMS) return content;

    const sanitized = { ...content };
    LANGUAGES.forEach(({ field }) => {
        sanitized[field] = stripImagesFromHtml(sanitized[field] || "");
    });
    sanitized.variants = Array.isArray(sanitized.variants)
        ? sanitized.variants.map((variant) => {
            const nextVariant = { ...variant };
            LANGUAGES.forEach(({ field }) => {
                nextVariant[field] = stripImagesFromHtml(nextVariant[field] || "");
            });
            return nextVariant;
        })
        : [];
    return sanitized;
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

function uniqueLanguages(preferredCode = "fr") {
    const seen = new Set();
    return [preferredCode, "fr", "en", "de", "it"]
        .map((code) => LANGUAGES.find((language) => language.code === code))
        .filter((language) => {
            if (!language || seen.has(language.code)) return false;
            seen.add(language.code);
            return true;
        });
}

function getBestSourceLanguage(record = {}, preferredCode = "fr") {
    return uniqueLanguages(preferredCode).find((language) => hasRichTextContent(record?.[language.field])) || null;
}

function sanitizeGeneratedHtmlForChannel(channel, html = "") {
    const value = String(html || "").trim();
    return channel === Channel.SMS ? stripImagesFromHtml(value) : value;
}

function getAiPayloadHtml(payload = {}) {
    const value = payload.html || payload.text || payload.content || payload.message || "";
    return typeof value === "string" ? value.trim() : "";
}

function getAiPayloadName(payload = {}, fallback = "Variant") {
    const value = payload.name || payload.title || payload.label || "";
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getAiTranslationFieldValue(payload = {}, field = "") {
    if (!payload || typeof payload !== "object" || !field) return "";
    const direct = payload[field];
    if (typeof direct === "string" && direct.trim()) return direct;

    const nestedContainers = [payload.translations, payload.languages, payload.values, payload.fields];
    for (const container of nestedContainers) {
        if (container && typeof container === "object" && typeof container[field] === "string" && container[field].trim()) {
            return container[field];
        }
    }

    return "";
}

function getAiPayloadVariants(payload = {}) {
    const variants = payload?.variants;
    if (Array.isArray(variants)) return variants;
    if (variants && typeof variants === "object") {
        return Object.entries(variants).map(([id, value]) => (
            value && typeof value === "object" ? { id, ...value } : { id, html: value }
        ));
    }
    return [];
}

function collectMissingTranslationTargets(content = {}, variants = [], preferredCode = "fr") {
    const mainSource = getBestSourceLanguage(content, preferredCode);
    const mainTargets = mainSource
        ? LANGUAGES.filter((language) => language.field !== mainSource.field && !hasRichTextContent(content?.[language.field]))
        : [];
    const variantTargets = variants
        .map((variant) => {
            const source = getBestSourceLanguage(variant, preferredCode);
            if (!source) return null;
            const targets = LANGUAGES.filter((language) => (
                language.field !== source.field
                && !hasRichTextContent(variant?.[language.field])
            ));
            return targets.length > 0
                ? { variant, source, targets }
                : null;
        })
        .filter(Boolean);

    return {
        main: mainTargets.length > 0 ? { source: mainSource, targets: mainTargets } : null,
        variants: variantTargets,
        count: mainTargets.length + variantTargets.reduce((sum, item) => sum + item.targets.length, 0)
    };
}

function buildTranslationContext(content = {}, variants = [], translationTargets = {}) {
    const context = {};
    if (translationTargets.main) {
        context.main = {
            sourceLanguage: translationTargets.main.source.label,
            sourceField: translationTargets.main.source.field,
            sourceHtml: sanitizeEditorPromptHtml(content[translationTargets.main.source.field] || ""),
            targets: translationTargets.main.targets.map((language) => ({
                language: language.label,
                field: language.field
            }))
        };
    }
    if (translationTargets.variants?.length > 0) {
        context.variants = translationTargets.variants.map(({ variant, source, targets }) => ({
            id: variant.id,
            name: variant.name || "Variant",
            sourceLanguage: source.label,
            sourceField: source.field,
            sourceHtml: sanitizeEditorPromptHtml(variant[source.field] || ""),
            targets: targets.map((language) => ({
                language: language.label,
                field: language.field
            }))
        }));
    }
    return context;
}

function collectMissingTranslationChannelItems(channelList = [], contentByChannel = {}, preferredCode = "fr", title = "") {
    return channelList
        .map((channel) => {
            const content = {
                ...createChannelContentDraft(channel, title),
                ...(contentByChannel[channel] || {})
            };
            const variants = Array.isArray(content.variants) ? content.variants : [];
            const targets = collectMissingTranslationTargets(content, variants, preferredCode);
            return { channel, content, variants, targets };
        })
        .filter((item) => item.targets.count > 0);
}

function getTranslationChannelItemCount(items = []) {
    return items.reduce((sum, item) => sum + item.targets.count, 0);
}

function buildChannelTranslationContext(items = []) {
    return {
        channels: items.map(({ channel, content, variants, targets }) => ({
            channel,
            channelLabel: CHANNEL_LABELS[channel] || channel,
            ...buildTranslationContext(content, variants, targets)
        }))
    };
}

function buildChannelTranslationOutputSchema(items = []) {
    return JSON.stringify({
        channels: items.map(({ channel, targets }) => ({
            channel,
            main: Object.fromEntries(
                (targets.main?.targets || []).map((language) => [language.field, `<p>${language.label} translation HTML</p>`])
            ),
            variants: (targets.variants || []).map(({ variant, targets: variantTargets }) => ({
                id: variant.id,
                ...Object.fromEntries(
                    variantTargets.map((language) => [language.field, `<p>${language.label} translation HTML</p>`])
                )
            }))
        }))
    }, null, 2);
}

function formatTokenContext(tokens = []) {
    const visibleTokens = tokens
        .filter((tokenDef) => tokenDef?.token)
        .slice(0, 80)
        .map((tokenDef) => `${tokenDef.token}${tokenDef.label ? ` - ${tokenDef.label}` : ""}`);
    return visibleTokens.length > 0 ? visibleTokens.join("\n") : "No configured tokens.";
}

async function copyRawTextToClipboard(text, { message = "Prompt copied.", variant = "success" } = {}) {
    const value = String(text || "");
    if (!value) return false;

    try {
        await navigator.clipboard.writeText(value);
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

    showToast(message, variant);
    return true;
}

async function readClipboardWithTimeout(readOperation) {
    let timeoutId;
    try {
        return await Promise.race([
            readOperation(),
            new Promise((_, reject) => {
                timeoutId = window.setTimeout(() => {
                    reject(new Error("Clipboard reading timed out."));
                }, CHATGPT_CLIPBOARD_READ_TIMEOUT_MS);
            })
        ]);
    } finally {
        window.clearTimeout(timeoutId);
    }
}

function openCenteredChatGptWindow() {
    const availableLeft = window.screen?.availLeft ?? 0;
    const availableTop = window.screen?.availTop ?? 0;
    const availableWidth = window.screen?.availWidth || window.outerWidth || 1440;
    const availableHeight = window.screen?.availHeight || window.outerHeight || 900;
    const width = Math.min(1120, Math.max(960, Math.round(availableWidth * 0.74)));
    const height = Math.min(840, Math.max(720, Math.round(availableHeight * 0.82)));
    const left = Math.max(availableLeft, Math.round(availableLeft + (availableWidth - width) / 2));
    const top = Math.max(availableTop, Math.round(availableTop + (availableHeight - height) / 2));
    const features = [
        "popup=yes",
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        "toolbar=no",
        "menubar=no",
        "location=no",
        "status=no",
        "resizable=yes",
        "scrollbars=yes"
    ].join(",");
    const chatGptWindow = window.open("https://chatgpt.com/", `templateEditorChatGPT-${Date.now()}`, features);
    if (chatGptWindow) {
        try {
            chatGptWindow.opener = null;
        } catch {
            // Some browsers block opener changes for external windows.
        }
        chatGptWindow.focus();
    }
    return chatGptWindow;
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
    const [color, setColor] = useState(initial?.color || "");
    const [iconMenuOpen, setIconMenuOpen] = useState(false);
    const [iconQuery, setIconQuery] = useState("");
    const [iconCategory, setIconCategory] = useState("All");
    const canSubmit = title.trim().length > 0;
    const selectedIconPreset = getNodeIconPreset(icon);
    const currentTopicDraft = { title, icon, color };
    const selectedColor = getTopicColorValue(currentTopicDraft);
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
            icon: icon.trim(),
            color: normalizeTopicColor(color)
        });
    };

    return (
        <Modal
            onClose={onClose}
            ariaLabel={isEdit ? "Rename topic" : "New topic"}
            dialogClassName="popup-box node-section-dialog"
        >
            <form onSubmit={submit} className="node-node-modal">
                <div className="popup-header">
                    <div>
                        <h2>{isEdit ? "Rename topic" : parentTitle ? "New subtopic" : "New topic"}</h2>
                        {parentTitle && !isEdit && <p className="node-modal-subtitle">Inside {parentTitle}</p>}
                    </div>
                </div>
                <div className="node-form" style={getTopicColorStyle(currentTopicDraft)}>
                    {parentTitle && !isEdit && (
                        <div className="node-form-parent">
                            <span className="client-info-label">Parent</span>
                            <strong>{parentTitle}</strong>
                        </div>
                    )}
                    <div className="node-form-preview" style={getTopicColorStyle(currentTopicDraft)}>
                        <span className="node-object-icon"><NodeIconGlyph icon={icon} /></span>
                        <span>
                            <strong>{title || "Untitled topic"}</strong>
                            <small>{selectedColor.toUpperCase()}</small>
                        </span>
                    </div>
                    <div className="node-section-form-grid node-section-form-grid--appearance">
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
                        <div className="form-field node-color-field">
                            <label>Color</label>
                            <div className="node-color-grid" aria-label="Topic colors">
                                <button
                                    type="button"
                                    className={!normalizeTopicColor(color) ? "node-color-auto is-selected" : "node-color-auto"}
                                    onClick={() => setColor("")}
                                    title="Automatic color"
                                >
                                    Auto
                                </button>
                                {TOPIC_COLOR_PRESETS.map((preset) => {
                                    const selected = normalizeTopicColor(color) === preset.value;
                                    return (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            className={selected ? "node-color-swatch is-selected" : "node-color-swatch"}
                                            style={getTopicColorStyle({ color: preset.value })}
                                            onClick={() => setColor(preset.value)}
                                            aria-label={preset.label}
                                            title={preset.label}
                                        />
                                    );
                                })}
                            </div>
                            <div className="node-color-custom">
                                <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(event) => setColor(event.target.value)}
                                    aria-label="Custom topic color"
                                />
                                <input
                                    value={color}
                                    onChange={(event) => setColor(event.target.value)}
                                    placeholder="#6366f1"
                                    aria-label="Topic color hex value"
                                />
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
                                    ? "All templates are already linked to this topic."
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

function TemplateEditorAiModal({ request, onClose }) {
    const [step, setStep] = useState("instructions");
    const [instruction, setInstruction] = useState(request.defaultInstruction || "");
    const [templateInstruction, setTemplateInstruction] = useState("");
    const [error, setError] = useState("");
    const [clipboardStatus, setClipboardStatus] = useState("idle");
    const requestId = useMemo(() => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }, []);
    const prompt = useMemo(() => request.buildPrompt({
        requestId,
        templateInstruction,
        userInstruction: instruction.trim()
    }), [instruction, request, requestId, templateInstruction]);

    useEffect(() => {
        let active = true;
        loadChatGptPromptSettings().then((settings) => {
            if (active) setTemplateInstruction(settings.templateInstruction || "");
        });
        return () => {
            active = false;
        };
    }, []);

    const goToCopyStep = () => {
        if (request.requiresInstruction && !instruction.trim()) {
            setError("Write the instruction first.");
            return;
        }
        setError("");
        setStep("copy");
    };

    const copyPromptAndOpen = async () => {
        if (request.requiresInstruction && !instruction.trim()) {
            setStep("instructions");
            setError("Write the instruction first.");
            return;
        }

        const copied = await copyRawTextToClipboard(prompt, {
            message: "ChatGPT prompt copied.",
            variant: "success"
        });
        if (!copied) return;

        const chatGptWindow = openCenteredChatGptWindow();
        if (!chatGptWindow) {
            showToast("ChatGPT window was blocked by the browser.", "error");
            return;
        }

        setError("");
        setClipboardStatus("waiting");
        setStep("waiting");
    };

    const applyClipboardText = useCallback((value) => {
        const parsed = parseChatGptEditorJsonResult(value, { requestId });
        if (!parsed) {
            setClipboardStatus("invalid");
            setError("Clipboard does not contain the expected ChatGPT result yet.");
            return false;
        }

        const applied = request.applyResult(parsed);
        if (!applied) {
            setClipboardStatus("invalid");
            setError("ChatGPT result has the wrong format for this action.");
            return false;
        }

        showToast(request.successMessage || "ChatGPT result applied.", "success");
        onClose();
        return true;
    }, [onClose, request, requestId]);

    const readChatGptClipboard = useCallback(async ({ automatic = false } = {}) => {
        if (!navigator.clipboard?.readText) {
            setClipboardStatus("blocked");
            setError("Clipboard reading is not available in this browser.");
            return false;
        }

        setClipboardStatus("checking");

        try {
            const clipboardText = await readClipboardWithTimeout(() => navigator.clipboard.readText());
            if (!clipboardText || clipboardText === prompt) {
                setClipboardStatus("waiting");
                if (!automatic) setError("Copy ChatGPT's answer first, then try again.");
                return false;
            }

            const applied = applyClipboardText(clipboardText);
            if (!applied && automatic) {
                setError("");
                setClipboardStatus("waiting");
            }
            return applied;
        } catch {
            setClipboardStatus("blocked");
            setError(automatic
                ? "Automatic clipboard reading was blocked. Use the button below when you are back from ChatGPT."
                : "Clipboard access was blocked. Click the button again after allowing clipboard access."
            );
            return false;
        }
    }, [applyClipboardText, prompt]);

    useEffect(() => {
        if (step !== "waiting") return undefined;

        const handleReturn = () => {
            if (document.visibilityState === "hidden") return;
            readChatGptClipboard({ automatic: true });
        };

        const timeoutId = window.setTimeout(handleReturn, 600);
        window.addEventListener("focus", handleReturn);
        window.addEventListener("pageshow", handleReturn);
        document.addEventListener("visibilitychange", handleReturn);

        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener("focus", handleReturn);
            window.removeEventListener("pageshow", handleReturn);
            document.removeEventListener("visibilitychange", handleReturn);
        };
    }, [readChatGptClipboard, step]);

    return (
        <Modal onClose={onClose} dialogClassName="popup-box template-chatgpt-modal" ariaLabel={request.title}>
            <div className="popup-header">
                <div>
                    <p className="template-result-kicker">ChatGPT</p>
                    <h2>{request.title}</h2>
                </div>
            </div>
            <div className="template-chatgpt-progress" aria-label="ChatGPT editor progress">
                <span className={step === "instructions" ? "is-active" : ""}>1 Instructions</span>
                <span className={step === "copy" ? "is-active" : ""}>2 Copy</span>
                <span className={step === "waiting" ? "is-active" : ""}>3 Waiting</span>
            </div>
            {step === "instructions" && (
                <div className="template-chatgpt-step">
                    <div className="template-chatgpt-step-header">
                        <span className="template-chatgpt-step-number">1</span>
                        <div>
                            <h3>{request.instructionTitle || "Instructions"}</h3>
                            <p>{request.description}</p>
                        </div>
                    </div>
                    <label className="template-chatgpt-field">
                        <span>{request.instructionLabel || "Instruction"}</span>
                        <textarea
                            value={instruction}
                            onChange={(event) => {
                                setInstruction(event.target.value);
                                setError("");
                            }}
                            placeholder={request.instructionPlaceholder || "Write the exact instruction for ChatGPT."}
                            rows={5}
                        />
                    </label>
                    <div className="template-chatgpt-note">
                        The technical format, response marker, and placeholder safety rules stay locked.
                    </div>
                    {error && <div className="template-chatgpt-error">{error}</div>}
                    <div className="popup-actions template-chatgpt-actions">
                        <button type="button" className="template-result-action-btn template-result-ai-btn" onClick={goToCopyStep}>
                            Next
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            )}
            {step === "copy" && (
                <div className="template-chatgpt-step">
                    <div className="template-chatgpt-step-header">
                        <span className="template-chatgpt-step-number">2</span>
                        <div>
                            <h3>Copy prompt</h3>
                            <p>One click copies the hidden prompt and opens ChatGPT in a centered window.</p>
                        </div>
                    </div>
                    <div className="template-chatgpt-note">
                        If ChatGPT opens empty, paste with Cmd+V. Then copy ChatGPT's full answer and come back here.
                    </div>
                    <div className="popup-actions template-chatgpt-actions">
                        <button type="button" className="secondary-btn" onClick={() => setStep("instructions")}>
                            Back
                        </button>
                        <button type="button" className="template-result-action-btn template-result-ai-btn" onClick={copyPromptAndOpen}>
                            <ExternalLink size={14} aria-hidden="true" />
                            Copy prompt and open ChatGPT
                        </button>
                    </div>
                </div>
            )}
            {step === "waiting" && (
                <div className="template-chatgpt-step">
                    <div className="template-chatgpt-step-header">
                        <span className="template-chatgpt-step-number">3</span>
                        <div>
                            <h3>Waiting for result</h3>
                            <p>Copy ChatGPT's answer, then return here. The editor will try to apply it automatically.</p>
                        </div>
                    </div>
                    <div className={`template-chatgpt-waiting is-${clipboardStatus}`}>
                        <span className="template-chatgpt-spinner" aria-hidden="true" />
                        <div>
                            <strong>
                                {clipboardStatus === "checking"
                                    ? "Checking clipboard..."
                                    : clipboardStatus === "blocked"
                                        ? "Waiting for permission"
                                        : clipboardStatus === "invalid"
                                            ? "Result not detected"
                                            : "Waiting for ChatGPT"}
                            </strong>
                            <p>
                                {clipboardStatus === "blocked"
                                    ? "Browser security can block automatic clipboard reading. Use the button below after copying the answer."
                                    : clipboardStatus === "invalid"
                                        ? "The copied text is not the expected ChatGPT answer for this request."
                                        : "Leave this popup open, copy the full ChatGPT answer, and come back to this editor."}
                            </p>
                        </div>
                    </div>
                    {error && <div className="template-chatgpt-error">{error}</div>}
                    <div className="popup-actions template-chatgpt-actions">
                        <button type="button" className="secondary-btn" onClick={() => setStep("copy")}>
                            Back
                        </button>
                        <button type="button" className="template-result-action-btn template-result-edit-btn" onClick={() => readChatGptClipboard()}>
                            <Check size={14} aria-hidden="true" />
                            Read clipboard
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

function TemplateFormModal({ initial, parentTitle, onClose, onSave, inline = false }) {
    const isEdit = Boolean(initial);
    const [title, setTitle] = useState(initial?.title || "");
    const [favorite, setFavorite] = useState(Boolean(initial?.favorite));
    const [channels, setChannels] = useState(initial?.channels || []);
    const [contentByChannel, setContentByChannel] = useState(initial?.contentByChannel || {});
    const [activeContentChannel, setActiveContentChannel] = useState(initial?.channels?.[0] || Channel.EMAIL);
    const [activeLanguage, setActiveLanguage] = useState("fr");
    const [activeVariantByChannel, setActiveVariantByChannel] = useState({});
    const [previewRequest, setPreviewRequest] = useState(null);
    const [aiRequest, setAiRequest] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [templateImageMap, setTemplateImageMap] = useState(() => new Map());
    const canSubmit = title.trim().length > 0 && channels.length > 0;

    useEffect(() => {
        setFavorite(Boolean(initial?.favorite));
    }, [initial?.favorite]);

    useEffect(() => {
        let active = true;
        loadTokensWithClientData().then((loadedTokens) => {
            if (active) setTokens(loadedTokens);
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        const refreshTemplateImages = () => {
            loadTemplateImageMap().then((imageMap) => {
                if (active) setTemplateImageMap(imageMap);
            });
        };
        refreshTemplateImages();
        window.addEventListener(TEMPLATE_IMAGES_UPDATED_EVENT, refreshTemplateImages);
        return () => {
            active = false;
            window.removeEventListener(TEMPLATE_IMAGES_UPDATED_EVENT, refreshTemplateImages);
        };
    }, []);

    const createToken = useCallback(async (tokenDef) => {
        const visibleTokens = await loadTokensWithClientData();
        const existing = visibleTokens.find((token) =>
            token.token === tokenDef.token
            || (token.label || "").toLowerCase() === (tokenDef.label || "").toLowerCase()
        );
        if (existing) {
            setTokens(visibleTokens);
            return existing;
        }

        const currentTokens = await loadTokens();
        const nextTokens = [...currentTokens, tokenDef];
        await saveTokens(nextTokens);
        setTokens(await loadTokensWithClientData());
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
            favorite,
            channels,
            contentByChannel: CHANNEL_VALUES.reduce((acc, channel) => {
                if (!channels.includes(channel)) return acc;
                const nextContent = {
                    ...createChannelContentDraft(channel, normalizedTitle),
                    ...(contentByChannel[channel] || {}),
                    title: normalizedTitle,
                    type: channel,
                    variants: Array.isArray(contentByChannel[channel]?.variants)
                        ? contentByChannel[channel].variants
                        : []
                };
                acc[channel] = sanitizeContentForChannel(channel, nextContent);
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
    const activeChannelAllowsImages = selectedContentChannel !== Channel.SMS;
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
            value: activeChannelAllowsImages
                ? hydrateTemplateImageHtml(activeTextValue, templateImageMap)
                : stripImagesFromHtml(activeTextValue)
        });
    }, [activeChannelAllowsImages, activeLanguageDef.label, activeTextValue, selectedContent, selectedContentChannel, templateImageMap]);
    const openVariantPreview = useCallback(() => {
        if (!selectedContentChannel || !activeVariant) return;
        setPreviewRequest({
            title: `${activeVariant.name || "Variant"} · ${activeLanguageDef.label}`,
            label: CHANNEL_LABELS[selectedContentChannel],
            value: activeChannelAllowsImages
                ? hydrateTemplateImageHtml(activeVariantTextValue, templateImageMap)
                : stripImagesFromHtml(activeVariantTextValue)
        });
    }, [activeChannelAllowsImages, activeLanguageDef.label, activeVariant, activeVariantTextValue, selectedContentChannel, templateImageMap]);
    const openGenerateMainWithAi = useCallback(() => {
        if (!selectedContentChannel) return;
        const channelLabel = CHANNEL_LABELS[selectedContentChannel] || selectedContentChannel;
        const languageLabel = activeLanguageDef.label;
        const currentTitle = title.trim() || "Untitled template";
        setAiRequest({
            title: "Generate template",
            description: `Generate ${languageLabel} content for the ${channelLabel} template.`,
            instructionTitle: "Template request",
            instructionLabel: "What should this template say?",
            instructionPlaceholder: "Example: explain to the customer that the outage is being handled and that we will update them shortly.",
            requiresInstruction: true,
            successMessage: "Template content generated.",
            buildPrompt: ({ requestId, templateInstruction, userInstruction }) => buildChatGptEditorPrompt({
                requestId,
                templateInstruction,
                userInstruction,
                taskTitle: "Generate main template content",
                outputSchema: JSON.stringify({ html: `<p>${languageLabel} template HTML</p>` }, null, 2),
                taskRules: [
                    `Write only in ${languageLabel}.`,
                    `Optimize for the ${channelLabel} channel.`,
                    selectedContentChannel === Channel.SMS
                        ? "For SMS, keep it short, plain, direct and suitable for mobile reading."
                        : "For email or other rich channels, use short paragraphs and only necessary formatting.",
                    "If existing content is present, improve or replace it according to the user instruction without losing important intent.",
                    "Use available placeholders only when they are useful for the requested template."
                ],
                contextBlocks: [
                    {
                        title: "Target",
                        body: [
                            `Template title: ${currentTitle}`,
                            `Channel: ${channelLabel}`,
                            `Language: ${languageLabel}`
                        ].join("\n")
                    },
                    {
                        title: "Existing content for this language",
                        body: sanitizeEditorPromptHtml(activeTextValue) || "Empty"
                    },
                    {
                        title: "Available placeholders",
                        body: formatTokenContext(tokens)
                    }
                ],
                allowImages: activeChannelAllowsImages
            }),
            applyResult: (payload) => {
                const html = getAiPayloadHtml(payload);
                if (!html) return false;
                updateChannelContent(
                    selectedContentChannel,
                    activeLanguageDef.field,
                    sanitizeGeneratedHtmlForChannel(selectedContentChannel, html)
                );
                return true;
            }
        });
    }, [
        activeChannelAllowsImages,
        activeLanguageDef.field,
        activeLanguageDef.label,
        activeTextValue,
        selectedContentChannel,
        title,
        tokens,
        updateChannelContent
    ]);
    const openGenerateVariantWithAi = useCallback(() => {
        if (!selectedContentChannel) return;
        const channelLabel = CHANNEL_LABELS[selectedContentChannel] || selectedContentChannel;
        const languageLabel = activeLanguageDef.label;
        const currentTitle = title.trim() || "Untitled template";
        const variantIndex = selectedVariants.length + 1;
        setAiRequest({
            title: "Generate variants",
            description: `Generate one or more ${languageLabel} variants for the ${channelLabel} template.`,
            instructionTitle: "Variant request",
            instructionLabel: "What variants do you need?",
            instructionPlaceholder: "Example: create two variants, one short and one more detailed for customers who already know the case context.",
            requiresInstruction: true,
            successMessage: "Variants generated.",
            buildPrompt: ({ requestId, templateInstruction, userInstruction }) => buildChatGptEditorPrompt({
                requestId,
                templateInstruction,
                userInstruction,
                taskTitle: "Generate template variants",
                outputSchema: JSON.stringify({
                    variants: [
                        {
                            name: `Variant ${variantIndex}`,
                            html: `<p>${languageLabel} variant HTML</p>`
                        }
                    ]
                }, null, 2),
                taskRules: [
                    `Write every variant in ${languageLabel}.`,
                    `Optimize variants for the ${channelLabel} channel.`,
                    "Each variant must be meaningfully different from the main content and from other generated variants.",
                    "Variant names must be short, descriptive labels, not full sentences.",
                    "Do not duplicate an existing variant name unless the user explicitly requested it.",
                    selectedContentChannel === Channel.SMS
                        ? "For SMS variants, keep wording short, plain and mobile-friendly."
                        : "For rich text variants, keep formatting simple and support-agent friendly."
                ],
                contextBlocks: [
                    {
                        title: "Target",
                        body: [
                            `Template title: ${currentTitle}`,
                            `Channel: ${channelLabel}`,
                            `Language: ${languageLabel}`
                        ].join("\n")
                    },
                    {
                        title: "Main content for this language",
                        body: sanitizeEditorPromptHtml(activeTextValue) || "Empty"
                    },
                    {
                        title: "Existing variants",
                        body: selectedVariants.length > 0
                            ? selectedVariants.map((variant) => `- ${variant.name || "Variant"}`).join("\n")
                            : "No existing variants."
                    },
                    {
                        title: "Available placeholders",
                        body: formatTokenContext(tokens)
                    }
                ],
                allowImages: activeChannelAllowsImages
            }),
            applyResult: (payload) => {
                const rawVariants = Array.isArray(payload.variants) && payload.variants.length > 0
                    ? payload.variants
                    : [payload];
                const generatedVariants = rawVariants
                    .map((item, index) => {
                        const html = getAiPayloadHtml(item);
                        if (!html) return null;
                        return {
                            ...createVariantDraft(variantIndex + index),
                            name: getAiPayloadName(item, `Variant ${variantIndex + index}`),
                            [activeLanguageDef.field]: sanitizeGeneratedHtmlForChannel(selectedContentChannel, html)
                        };
                    })
                    .filter(Boolean);

                if (generatedVariants.length === 0) return false;

                setContentByChannel((current) => {
                    const content = {
                        ...createChannelContentDraft(selectedContentChannel, title.trim()),
                        ...(current[selectedContentChannel] || {})
                    };
                    const variants = Array.isArray(content.variants) ? content.variants : [];
                    return {
                        ...current,
                        [selectedContentChannel]: {
                            ...content,
                            variants: [...variants, ...generatedVariants]
                        }
                    };
                });
                setActiveVariantByChannel((current) => ({
                    ...current,
                    [selectedContentChannel]: generatedVariants[0].id
                }));
                return true;
            }
        });
    }, [
        activeChannelAllowsImages,
        activeLanguageDef.field,
        activeLanguageDef.label,
        activeTextValue,
        selectedContentChannel,
        selectedVariants,
        title,
        tokens
    ]);
    const openTranslateMissingWithAi = useCallback(() => {
        const translationItems = collectMissingTranslationChannelItems(channels, contentByChannel, activeLanguage, title.trim());
        const translationCount = getTranslationChannelItemCount(translationItems);
        if (translationCount === 0) {
            showToast("No missing translations with source text.", "info");
            return;
        }
        const translationContext = buildChannelTranslationContext(translationItems);
        const outputSchema = buildChannelTranslationOutputSchema(translationItems);
        const currentTitle = title.trim() || "Untitled template";
        const payloadForChannel = (payload, channel, allowSingleChannelFallback = false) => {
            if (Array.isArray(payload?.channels)) {
                return payload.channels.find((item) => item?.channel === channel) || null;
            }
            return allowSingleChannelFallback ? payload : null;
        };
        const hasApplicableTranslation = (payload) => translationItems.some((item) => {
            const channelPayload = payloadForChannel(payload, item.channel, translationItems.length === 1);
            if (!channelPayload || typeof channelPayload !== "object") return false;

            const mainHasValue = item.targets.main?.targets.some((language) => (
                typeof channelPayload.main?.[language.field] === "string"
                && channelPayload.main[language.field].trim()
                && !hasRichTextContent(item.content[language.field])
            ));
            if (mainHasValue) return true;

            const payloadVariants = getAiPayloadVariants(channelPayload);
            const payloadByVariantId = new Map(
                payloadVariants
                    .filter((variant) => typeof variant?.id === "string" || typeof variant?.id === "number")
                    .map((variant) => [String(variant.id), variant])
            );
            return item.targets.variants.some(({ variant, targets }) => {
                const payloadVariant = payloadByVariantId.get(variant.id);
                if (!payloadVariant) return false;
                return targets.some((language) => (
                    getAiTranslationFieldValue(payloadVariant, language.field)
                    && !hasRichTextContent(variant[language.field])
                ));
            });
        });
        setAiRequest({
            title: "Translate missing",
            description: `Generate ${translationCount} missing translation${translationCount === 1 ? "" : "s"} across this template.`,
            instructionTitle: "Translation instruction",
            instructionLabel: "Additional instruction",
            instructionPlaceholder: "Optional: tone, terminology, or regional preference.",
            requiresInstruction: false,
            successMessage: "Missing translations generated.",
            buildPrompt: ({ requestId, templateInstruction, userInstruction }) => buildChatGptEditorPrompt({
                requestId,
                templateInstruction,
                userInstruction,
                taskTitle: "Translate missing template languages",
                outputSchema,
                taskRules: [
                    "Translate natural-language text only.",
                    "Preserve all HTML tag structure unless the target language requires minor punctuation spacing.",
                    "Preserve placeholders, IDs, product names, ticket references, brand names and technical values exactly.",
                    "Do not return translations for fields that are not listed as targets.",
                    "Return variant translations inside the variants array only, one object per source variant.",
                    "Each variant translation object must keep the exact source id string and put translated text directly in the requested text_* fields.",
                    "Do not nest variant translations under html, text, content, translations, languages, or values keys.",
                    "Do not rewrite existing non-empty fields.",
                    "Keep the tone, intent and level of detail of the source text."
                ],
                contextBlocks: [
                    {
                        title: "Target",
                        body: [
                            `Template title: ${currentTitle}`,
                            `Channels: ${translationItems.map((item) => CHANNEL_LABELS[item.channel] || item.channel).join(", ")}`,
                            "Translate only the requested empty fields.",
                            "Use the JSON shape exactly. For variants, return { id, text_fr/text_en/text_de/text_it } at the same object level.",
                            "Do not return fields that are not listed as targets."
                        ].join("\n")
                    },
                    {
                        title: "Translation targets",
                        body: JSON.stringify(translationContext, null, 2)
                    },
                    {
                        title: "Available placeholders",
                        body: formatTokenContext(tokens)
                    }
                ],
                allowImages: translationItems.some((item) => item.channel !== Channel.SMS)
            }),
            applyResult: (payload) => {
                if (!hasApplicableTranslation(payload)) return false;

                setContentByChannel((current) => {
                    let nextState = current;

                    translationItems.forEach((item) => {
                        const channelPayload = payloadForChannel(payload, item.channel, translationItems.length === 1);
                        if (!channelPayload || typeof channelPayload !== "object") return;

                        const content = {
                            ...createChannelContentDraft(item.channel, title.trim()),
                            ...(nextState[item.channel] || {})
                        };
                        const nextContent = { ...content };
                        let changed = false;

                        if (channelPayload.main && typeof channelPayload.main === "object") {
                            item.targets.main?.targets.forEach((language) => {
                                const nextValue = channelPayload.main?.[language.field];
                                if (
                                    typeof nextValue === "string"
                                    && nextValue.trim()
                                    && !hasRichTextContent(nextContent[language.field])
                                ) {
                                    nextContent[language.field] = sanitizeGeneratedHtmlForChannel(item.channel, nextValue);
                                    changed = true;
                                }
                            });
                        }

                        const payloadVariants = getAiPayloadVariants(channelPayload);
                        const payloadByVariantId = new Map(
                            payloadVariants
                                .filter((variant) => typeof variant?.id === "string" || typeof variant?.id === "number")
                                .map((variant) => [String(variant.id), variant])
                        );
                        const targetsByVariantId = new Map(
                            item.targets.variants.map((target) => [target.variant.id, target])
                        );
                        nextContent.variants = Array.isArray(content.variants)
                            ? content.variants.map((variant) => {
                                const target = targetsByVariantId.get(variant.id);
                                const payloadVariant = payloadByVariantId.get(variant.id);
                                if (!target || !payloadVariant) return variant;
                                const nextVariant = { ...variant };
                                target.targets.forEach((language) => {
                                    const nextValue = getAiTranslationFieldValue(payloadVariant, language.field);
                                    if (
                                        nextValue
                                        && !hasRichTextContent(nextVariant[language.field])
                                    ) {
                                        nextVariant[language.field] = sanitizeGeneratedHtmlForChannel(item.channel, nextValue);
                                        changed = true;
                                    }
                                });
                                return nextVariant;
                            })
                            : [];

                        if (changed) {
                            nextState = {
                                ...nextState,
                                [item.channel]: nextContent
                            };
                        }
                    });

                    return nextState;
                });
                return true;
            }
        });
    }, [
        activeLanguage,
        channels,
        contentByChannel,
        title,
        tokens
    ]);
    const editorContent = (
        <>
            <form onSubmit={submit} className={`node-template-modal${inline ? " node-template-modal--inline" : ""}`}>
                {!inline && (
                    <div className="popup-header">
                        <div>
                            <h2>{isEdit ? "Edit template" : "New template"}</h2>
                            {parentTitle && <p className="node-modal-subtitle">{parentTitle}</p>}
                        </div>
                    </div>
                )}
                <div className="node-form node-form--compact">
                    <div className="node-template-setup">
                        <div className="form-field node-template-title-field">
                            <label>Title</label>
                            <div className="node-template-title-row">
                                <input
                                    autoFocus={!inline}
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="Request OTO photo"
                                />
                                <button
                                    type="button"
                                    className={`secondary-btn node-favorite-btn${favorite ? " is-active" : ""}`}
                                    onClick={() => setFavorite((current) => !current)}
                                    aria-pressed={favorite}
                                    title={favorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <Star size={16} aria-hidden="true" fill={favorite ? "currentColor" : "none"} />
                                    <span>Favorite</span>
                                </button>
                            </div>
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
                                            <div className="node-ai-action-group">
                                                <button
                                                    type="button"
                                                    className="secondary-btn node-ai-action-btn node-ai-action-btn--primary"
                                                    onClick={openGenerateMainWithAi}
                                                    title="Generate or replace the current language content with ChatGPT"
                                                >
                                                    <Sparkles size={14} aria-hidden="true" />
                                                    Generate
                                                </button>
                                                <button
                                                    type="button"
                                                    className="secondary-btn node-ai-action-btn"
                                                    onClick={openTranslateMissingWithAi}
                                                    title="Generate all missing translations for this template"
                                                >
                                                    <Languages size={14} aria-hidden="true" />
                                                    Translate missing
                                                </button>
                                                <button
                                                    type="button"
                                                    className="secondary-btn node-preview-btn"
                                                    onClick={openMainPreview}
                                                >
                                                    Preview
                                                </button>
                                            </div>
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
                                            <Suspense fallback={<RichTextEditorFallback />}>
                                                <RichTextEditor
                                                    className="node-content-rich-editor"
                                                    value={activeTextValue}
                                                    onChange={handleMainTextChange}
                                                    placeholder={`${activeLanguageDef.label} HTML`}
                                                    tokens={tokens}
                                                    onTokenCreate={createToken}
                                                    allowImages={activeChannelAllowsImages}
                                                />
                                            </Suspense>
                                        </div>
                                    </div>
                                    <div className="variant-editor">
                                        <div className="variant-editor-head">
                                            <div>
                                                <label>Variants</label>
                                            </div>
                                            <div className="variant-editor-head-actions">
                                                <button
                                                    type="button"
                                                    className="secondary-btn node-ai-action-btn"
                                                    onClick={openGenerateVariantWithAi}
                                                    title="Generate one or more variants with ChatGPT"
                                                >
                                                    <Sparkles size={14} aria-hidden="true" />
                                                    AI variants
                                                </button>
                                                <button
                                                    type="button"
                                                    className="secondary-btn node-ai-action-btn"
                                                    onClick={() => addVariant(selectedContentChannel)}
                                                >
                                                    <Plus size={14} aria-hidden="true" />
                                                    Variant
                                                </button>
                                            </div>
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
                                                                    <Suspense fallback={<RichTextEditorFallback />}>
                                                                        <RichTextEditor
                                                                            className="node-content-rich-editor"
                                                                            value={activeVariantTextValue}
                                                                            onChange={handleVariantTextChange}
                                                                            placeholder={`${activeLanguageDef.label} variant HTML`}
                                                                            tokens={tokens}
                                                                            onTokenCreate={createToken}
                                                                            allowImages={activeChannelAllowsImages}
                                                                        />
                                                                    </Suspense>
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
            {aiRequest && (
                <TemplateEditorAiModal
                    request={aiRequest}
                    onClose={() => setAiRequest(null)}
                />
            )}
        </>
    );

    if (inline) {
        return (
            <div className="node-template-inline-editor">
                {editorContent}
            </div>
        );
    }

    return (
        <Modal
            onClose={onClose}
            ariaLabel={isEdit ? "Edit template" : "New template"}
            dialogClassName="popup-box node-template-dialog"
        >
            {editorContent}
        </Modal>
    );
}

const EMPTY_NODE_SUMMARY = { childCount: 0, templateCount: 0 };

function formatUnitCount(count, singular, plural = `${singular}s`) {
    return `${count} ${count === 1 ? singular : plural}`;
}

function buildNodePath(nodeLookup, node) {
    const path = [];
    const visited = new Set();
    let current = node;

    while (current && !visited.has(current.id)) {
        path.unshift(current);
        visited.add(current.id);
        current = current.parentId ? nodeLookup.get(current.parentId) : null;
    }

    return path;
}

function buildNodeAncestorIds(nodeLookup, nodeId) {
    const ancestors = [];
    const visited = new Set();
    let current = nodeLookup.get(nodeId);

    while (current?.parentId && !visited.has(current.parentId)) {
        visited.add(current.parentId);
        ancestors.unshift(current.parentId);
        current = nodeLookup.get(current.parentId);
    }

    return ancestors;
}

function getNodeDropPosition(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5;
    if (ratio < 0.24) return "before";
    if (ratio > 0.76) return "after";
    return "inside";
}

function getTemplateDropPosition(event, currentDropTarget = null, templateId = null, nodeId = null) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5;
    if (ratio < TEMPLATE_DROP_BEFORE_THRESHOLD) return "before";
    if (ratio > TEMPLATE_DROP_AFTER_THRESHOLD) return "after";

    if (
        currentDropTarget?.targetType === "template"
        && currentDropTarget.templateId === templateId
        && currentDropTarget.nodeId === nodeId
    ) {
        return currentDropTarget.position || (ratio < 0.5 ? "before" : "after");
    }

    return ratio < 0.5 ? "before" : "after";
}

function normalizeTreeDropCandidate(candidate, item) {
    if (!candidate) return null;
    if (item?.type === "template" && candidate.targetType === "topic") {
        return { ...candidate, position: "inside" };
    }
    return candidate;
}

function hasSameOrder(left = [], right = []) {
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index++) {
        if (left[index] !== right[index]) return false;
    }
    return true;
}

function isSameDropTarget(left, right) {
    return Boolean(left && right)
        && left.targetType === right.targetType
        && left.nodeId === right.nodeId
        && left.templateId === right.templateId
        && left.position === right.position;
}

function readDragItemFromEvent(event) {
    try {
        const raw = event.dataTransfer?.getData(TREE_DRAG_MIME);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

const NodeTreeRow = memo(function NodeTreeRow({
    node,
    summary,
    selected,
    depth,
    hasChildren,
    expanded,
    locked = false,
    dragItem,
    dropTarget,
    onToggle,
    onSelect,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop
}) {
    const handleSelect = useCallback(() => {
        if (hasChildren) {
            if (!expanded) {
                onToggle(node.id);
            } else if (selected) {
                onToggle(node.id);
                return;
            }
        }
        onSelect(node.id);
    }, [expanded, hasChildren, node.id, onSelect, onToggle, selected]);

    const handleToggle = useCallback((event) => {
        event.stopPropagation();
        onToggle(node.id);
    }, [node.id, onToggle]);

    const handleDragStart = useCallback((event) => {
        if (locked) {
            event.preventDefault();
            return;
        }
        onDragStart({ type: "topic", id: node.id }, event);
    }, [locked, node.id, onDragStart]);

    const handleDragOver = useCallback((event) => {
        if (locked) return;
        onDragOver(node.id, getNodeDropPosition(event), event);
    }, [locked, node.id, onDragOver]);

    const handleDrop = useCallback((event) => {
        if (locked) return;
        onDrop({
            targetType: "topic",
            nodeId: node.id,
            position: getNodeDropPosition(event)
        }, event);
    }, [locked, node.id, onDrop]);

    const dragging = dragItem?.type === "topic" && dragItem.id === node.id;
    const dropPosition = dropTarget?.targetType === "topic" && dropTarget.nodeId === node.id
        ? dropTarget.position
        : "";
    const rowClassName = [
        "node-tree-row",
        selected ? "is-selected" : "",
        expanded ? "" : "is-collapsed",
        dragging ? "is-dragging" : "",
        dropPosition ? `is-drop-${dropPosition}` : ""
    ].filter(Boolean).join(" ");

    return (
        <div className="node-tree-item" style={{ "--node-depth": depth, ...getTopicColorStyle(node) }}>
            <div
                className={rowClassName}
                data-depth={depth}
                draggable={!locked}
                aria-grabbed={dragging ? "true" : undefined}
                onDragStart={handleDragStart}
                onDragEnd={onDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {hasChildren && (
                    <button
                        type="button"
                        className="node-tree-disclosure-action"
                        onClick={handleToggle}
                        aria-label={`${expanded ? "Collapse" : "Expand"} ${node.title || "topic"}`}
                        aria-expanded={expanded}
                    >
                        <ChevronDown size={16} aria-hidden="true" />
                    </button>
                )}
                <button
                    type="button"
                    className="node-tree-main"
                    onClick={handleSelect}
                    aria-current={selected ? "true" : undefined}
                >
                    <span className={`node-tree-disclosure${hasChildren ? "" : " is-empty"}`} aria-hidden="true" />
                    <span className="node-tree-icon"><NodeIconGlyph icon={node.icon} /></span>
                    <span className="node-tree-copy">
                        <strong>{node.title || "Untitled topic"}</strong>
                    </span>
                    {summary.templateCount > 0 && (
                        <span className="node-tree-template-count" title={formatUnitCount(summary.templateCount, "template")}>
                            {summary.templateCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
});

const NodeTreeTemplateRow = memo(function NodeTreeTemplateRow({
    template,
    selected,
    depth,
    nodeId,
    locked = false,
    dragItem,
    dropTarget,
    onSelect,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop
}) {
    const handleSelect = useCallback(() => {
        onSelect(template.id, nodeId);
    }, [nodeId, onSelect, template.id]);

    const handleDragStart = useCallback((event) => {
        if (locked) {
            event.preventDefault();
            return;
        }
        onDragStart({ type: "template", id: template.id, nodeId }, event);
    }, [locked, nodeId, onDragStart, template.id]);

    const handleDragOver = useCallback((event) => {
        if (locked) return;
        onDragOver(template.id, nodeId, getTemplateDropPosition(event, dropTarget, template.id, nodeId), event);
    }, [dropTarget, locked, nodeId, onDragOver, template.id]);

    const handleDrop = useCallback((event) => {
        if (locked) return;
        onDrop({
            targetType: "template",
            templateId: template.id,
            nodeId,
            position: getTemplateDropPosition(event, dropTarget, template.id, nodeId)
        }, event);
    }, [dropTarget, locked, nodeId, onDrop, template.id]);

    const dragging = dragItem?.type === "template" && dragItem.id === template.id && dragItem.nodeId === nodeId;
    const dropPosition = dropTarget?.targetType === "template"
        && dropTarget.templateId === template.id
        && dropTarget.nodeId === nodeId
        ? dropTarget.position
        : "";
    const rowClassName = [
        "node-tree-row",
        "node-tree-row--template",
        selected ? "is-selected" : "",
        dragging ? "is-dragging" : "",
        dropPosition ? `is-drop-${dropPosition}` : ""
    ].filter(Boolean).join(" ");

    return (
        <div className="node-tree-item node-tree-template-item" style={{ "--node-depth": depth }}>
            <div
                className={rowClassName}
                data-depth={depth}
                draggable={!locked}
                aria-grabbed={dragging ? "true" : undefined}
                onDragStart={handleDragStart}
                onDragEnd={onDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <button
                    type="button"
                    className="node-tree-main node-tree-template-main"
                    onClick={handleSelect}
                    aria-current={selected ? "true" : undefined}
                >
                    <span className="node-tree-disclosure is-empty" aria-hidden="true" />
                    <span className="node-tree-icon node-tree-template-tree-icon"><NodeIconGlyph icon="template" /></span>
                    <span className="node-tree-copy">
                        <strong>{template.title || "Untitled template"}</strong>
                        {template.channels.length > 0 && (
                            <small>{template.channels.map((channel) => CHANNEL_LABELS[channel] || channel).join(" · ")}</small>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
});

const NodeTreeRows = memo(function NodeTreeRows({
    childrenByParent,
    nodeSummaryById,
    templatesByNode,
    parentId,
    selectedNodeId,
    selectedTemplateId,
    selectedItemType,
    expandedNodeIds,
    locked = false,
    dragItem,
    dropTarget,
    onToggleNode,
    onSelect,
    onSelectTemplate,
    onDragStart,
    onDragEnd,
    onNodeDragOver,
    onTemplateDragOver,
    onDrop,
    depth = 0
}) {
    const children = getIndexedChildNodes(childrenByParent, parentId);
    return children.map((node) => {
        const childNodes = getIndexedChildNodes(childrenByParent, node.id);
        const nodeTemplates = getIndexedTemplatesForNode(templatesByNode, node.id);
        const hasChildren = childNodes.length > 0 || nodeTemplates.length > 0;
        const expanded = !hasChildren || expandedNodeIds.has(node.id);
        return (
            <div key={node.id} className="node-tree-branch">
                <NodeTreeRow
                    node={node}
                    summary={nodeSummaryById.get(node.id) || EMPTY_NODE_SUMMARY}
                    selected={selectedItemType === "topic" && selectedNodeId === node.id}
                    depth={depth}
                    hasChildren={hasChildren}
                    expanded={expanded}
                    locked={locked}
                    dragItem={dragItem}
                    dropTarget={dropTarget}
                    onToggle={onToggleNode}
                    onSelect={onSelect}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onNodeDragOver}
                    onDrop={onDrop}
                />
                {expanded && childNodes.length > 0 && (
                    <NodeTreeRows
                        childrenByParent={childrenByParent}
                        nodeSummaryById={nodeSummaryById}
                        templatesByNode={templatesByNode}
                        parentId={node.id}
                        selectedNodeId={selectedNodeId}
                        selectedTemplateId={selectedTemplateId}
                        selectedItemType={selectedItemType}
                        expandedNodeIds={expandedNodeIds}
                        locked={locked}
                        dragItem={dragItem}
                        dropTarget={dropTarget}
                        onToggleNode={onToggleNode}
                        onSelect={onSelect}
                        onSelectTemplate={onSelectTemplate}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onNodeDragOver={onNodeDragOver}
                        onTemplateDragOver={onTemplateDragOver}
                        onDrop={onDrop}
                        depth={depth + 1}
                    />
                )}
                {expanded && nodeTemplates.map((template) => (
                    <NodeTreeTemplateRow
                        key={`${node.id}:${template.id}`}
                        template={template}
                        selected={selectedItemType === "template" && selectedNodeId === node.id && selectedTemplateId === template.id}
                        depth={depth + 1}
                        nodeId={node.id}
                        locked={locked}
                        dragItem={dragItem}
                        dropTarget={dropTarget}
                        onSelect={onSelectTemplate}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onTemplateDragOver}
                        onDrop={onDrop}
                    />
                ))}
            </div>
        );
    });
});

const LockedConfigPanel = memo(function LockedConfigPanel({ title, message, detail = "" }) {
    return (
        <section className="config-locked-panel">
            <span className="config-locked-panel__icon" aria-hidden="true">
                <Lock size={54} strokeWidth={1.8} />
            </span>
            <div>
                <p className="eyebrow">Configuration locked</p>
                <h2>{title}</h2>
                <p>{message}</p>
                {detail && <strong>{detail}</strong>}
            </div>
        </section>
    );
});

const TopicDetailPanel = memo(function TopicDetailPanel({
    selectedNode,
    selectedSummary,
    selectedChildNodes,
    selectedTemplates,
    locked = false,
    onRename,
    onDelete,
    onNewSubtopic,
    onLinkExisting,
    onNewTemplate
}) {
    const hasStats = selectedChildNodes.length > 0 || selectedTemplates.length > 0;

    return (
        <>
            <div className="node-canvas-hero node-canvas-hero--detail" style={getTopicColorStyle(selectedNode)}>
                <div className="node-hero-icon"><NodeIconGlyph icon={selectedNode.icon} /></div>
                <div className="node-hero-copy">
                    <h2>{selectedNode.title || "Untitled topic"}</h2>
                    <p>{selectedSummary}</p>
                </div>
                {!locked && (
                    <div className="node-detail-top-actions">
                        <button type="button" className="secondary-btn node-action-btn" onClick={onRename}>
                            <Edit3 size={17} aria-hidden="true" />
                            Rename
                        </button>
                        <details className="node-overflow-menu">
                            <summary className="secondary-btn node-icon-btn" aria-label="More topic actions" title="More actions">
                                <MoreVertical size={20} aria-hidden="true" />
                            </summary>
                            <button
                                type="button"
                                className="node-overflow-danger"
                                onClick={onDelete}
                            >
                                <Trash2 size={16} aria-hidden="true" />
                                Delete topic
                            </button>
                        </details>
                    </div>
                )}
            </div>

            <div className="node-detail-topic-grid">
                {hasStats ? (
                    <div className="node-topic-stat-grid" aria-label="Topic content summary">
                        {selectedChildNodes.length > 0 && (
                            <article className="node-topic-stat-card">
                                <span>Subtopics</span>
                                <strong>{selectedChildNodes.length}</strong>
                            </article>
                        )}
                        {selectedTemplates.length > 0 && (
                            <article className="node-topic-stat-card">
                                <span>Templates</span>
                                <strong>{selectedTemplates.length}</strong>
                            </article>
                        )}
                    </div>
                ) : (
                    <div className="node-topic-empty-summary">
                        This topic has no subtopics or templates yet.
                    </div>
                )}

                {locked ? (
                    <LockedConfigPanel
                        title="Playbook editing is locked"
                        message="This imported configuration allows template usage, but topic and template changes are disabled."
                    />
                ) : (
                    <section className="node-detail-card node-topic-action-card">
                        <div>
                            <h3>Topic actions</h3>
                            <p>Add content here, then navigate it from the tree on the left.</p>
                        </div>
                        <div className="node-detail-card-actions">
                            <button
                                type="button"
                                className="secondary-btn node-action-btn"
                                onClick={onNewSubtopic}
                            >
                                <Plus size={16} aria-hidden="true" />
                                New subtopic
                            </button>
                            <button
                                type="button"
                                className="secondary-btn node-action-btn"
                                onClick={onLinkExisting}
                            >
                                <Link2 size={16} aria-hidden="true" />
                                Link existing
                            </button>
                            <button
                                type="button"
                                className="primary-btn node-action-btn"
                                onClick={onNewTemplate}
                            >
                                <Plus size={16} aria-hidden="true" />
                                New template
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
});

const TemplateDetailPanel = memo(function TemplateDetailPanel({
    template,
    selectedNode,
    nodeLookup,
    linkTarget,
    linkOptions,
    onSave,
    onDuplicate,
    onUnlink,
    onDelete,
    onLinkTargetChange,
    onLink
}) {
    const linkedNodes = useMemo(() => (
        (template.nodeIds || [])
            .map((nodeId) => nodeLookup.get(nodeId))
            .filter(Boolean)
    ), [nodeLookup, template.nodeIds]);
    const channelSummary = template.channels.length > 0
        ? template.channels.map((channel) => CHANNEL_LABELS[channel] || channel).join(" · ")
        : "No channel";
    const linkedSummary = formatUnitCount(linkedNodes.length, "topic");
    const hasLinkOptions = linkOptions.length > 0;
    const canUnlinkFromCurrent = selectedNode && (template.nodeIds || []).length > 1;
    const parentTitle = linkedNodes.length > 0
        ? `Linked to ${linkedNodes.map((node) => node.title || "Untitled topic").join(", ")}`
        : "Not linked to a topic";

    const handleDuplicate = useCallback(() => {
        onDuplicate(template.id);
    }, [onDuplicate, template.id]);

    const handleUnlink = useCallback(() => {
        if (!selectedNode) return;
        onUnlink(template.id, selectedNode.id);
    }, [onUnlink, selectedNode, template.id]);

    const handleDelete = useCallback(() => {
        onDelete(template.id);
    }, [onDelete, template.id]);

    const handleFavorite = useCallback(() => {
        onSave({ favorite: !template.favorite });
    }, [onSave, template.favorite]);

    const handleLinkTargetChange = useCallback((event) => {
        onLinkTargetChange(template.id, event.target.value);
    }, [onLinkTargetChange, template.id]);

    const handleLink = useCallback(() => {
        onLink(template.id, linkTarget);
    }, [linkTarget, onLink, template.id]);

    return (
        <>
            <div className="node-canvas-hero node-canvas-hero--detail node-template-detail-hero">
                <div className="node-hero-icon"><NodeIconGlyph icon="template" /></div>
                <div className="node-hero-copy">
                    <h2>{template.title || "Untitled template"}</h2>
                    <p>{channelSummary} · {linkedSummary}</p>
                </div>
                <div className="node-detail-top-actions">
                    <button
                        type="button"
                        className={`secondary-btn node-action-btn node-favorite-btn${template.favorite ? " is-active" : ""}`}
                        onClick={handleFavorite}
                        aria-pressed={Boolean(template.favorite)}
                        title={template.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star size={16} aria-hidden="true" fill={template.favorite ? "currentColor" : "none"} />
                        Favorite
                    </button>
                    <button type="button" className="secondary-btn node-action-btn" onClick={handleDuplicate}>
                        <Copy size={16} aria-hidden="true" />
                        Duplicate
                    </button>
                    {canUnlinkFromCurrent && (
                        <button
                            type="button"
                            className="secondary-btn node-action-btn"
                            onClick={handleUnlink}
                            title="Remove this template from the selected topic only"
                        >
                            <Link2 size={16} aria-hidden="true" />
                            Unlink
                        </button>
                    )}
                    <details className="node-overflow-menu">
                        <summary className="secondary-btn node-icon-btn" aria-label="More template actions" title="More actions">
                            <MoreVertical size={20} aria-hidden="true" />
                        </summary>
                        <button
                            type="button"
                            className="node-overflow-danger"
                            onClick={handleDelete}
                        >
                            <Trash2 size={16} aria-hidden="true" />
                            Delete template
                        </button>
                    </details>
                </div>
            </div>

            <section className="node-detail-card node-template-link-card">
                <div className="node-template-linked-topics">
                    <h3>Linked topics</h3>
                    <div className="node-template-linked-pills">
                        {linkedNodes.map((node) => (
                            <span key={node.id} className="node-template-node-pill" style={getTopicColorStyle(node)}>
                                <Link2 size={14} aria-hidden="true" />
                                {node.title || "Untitled topic"}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="node-template-link-controls">
                    <select value={linkTarget} onChange={handleLinkTargetChange} disabled={!hasLinkOptions}>
                        <option value="">{hasLinkOptions ? "Link to topic..." : "No topics to link"}</option>
                        {linkOptions.map(({ node, depth }) => (
                            <option key={node.id} value={node.id}>
                                {`${"  ".repeat(depth)}${node.title || "Untitled topic"}`}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="secondary-btn node-action-btn"
                        onClick={handleLink}
                        disabled={!linkTarget || !hasLinkOptions}
                    >
                        <Link2 size={16} aria-hidden="true" />
                        Link
                    </button>
                </div>
            </section>

            <TemplateFormModal
                key={template.id}
                initial={template}
                parentTitle={parentTitle}
                onSave={onSave}
                inline
            />
        </>
    );
});

export default function ManageNodes({ embedded = false, onClose = null }) {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [expandedNodeIds, setExpandedNodeIds] = useState(() => new Set());
    const [nodeModal, setNodeModal] = useState(null);
    const [templateModal, setTemplateModal] = useState(null);
    const [existingPickerModal, setExistingPickerModal] = useState(null);
    const [confirmNodeDelete, setConfirmNodeDelete] = useState(null);
    const [confirmTemplateDelete, setConfirmTemplateDelete] = useState(null);
    const [templateLinkTargets, setTemplateLinkTargets] = useState({});
    const [dragItem, setDragItem] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const dropTargetRef = useRef(null);
    const [configLocked, setConfigLocked] = useState(false);
    const [templateSearchQuery, setTemplateSearchQuery] = useState("");
    const deferredTemplateSearchQuery = useDeferredValue(templateSearchQuery);

    useEffect(() => {
        let active = true;
        const refreshTreeData = (resetSelection = false) => loadTemplateTreeData().then((treeData) => {
            if (!active) return;
            setNodes(treeData.nodes);
            setTemplates(treeData.templates);
            setSelectedNodeId((current) => {
                if (current && treeData.nodes.some((node) => node.id === current)) return current;
                return treeData.nodes.find((node) => !node.parentId)?.id || treeData.nodes[0]?.id || null;
            });
            setSelectedTemplateId((current) => {
                if (resetSelection || !current) return null;
                return treeData.templates.some((template) => template.id === current) ? current : null;
            });
            setExpandedNodeIds((current) => {
                if (resetSelection) {
                    return new Set(treeData.nodes.filter((node) => !node.parentId).map((node) => node.id));
                }
                const validIds = new Set(treeData.nodes.map((node) => node.id));
                return new Set([...current].filter((nodeId) => validIds.has(nodeId)));
            });
        });
        refreshTreeData(true);
        const handleTemplateTreeUpdated = () => refreshTreeData(false);
        window.addEventListener(TEMPLATE_TREE_UPDATED_EVENT, handleTemplateTreeUpdated);
        return () => {
            active = false;
            window.removeEventListener(TEMPLATE_TREE_UPDATED_EVENT, handleTemplateTreeUpdated);
        };
    }, []);

    useEffect(() => {
        let active = true;
        const syncConfigLock = (event = null) => {
            if (event?.detail && typeof event.detail.locked === "boolean") {
                setConfigLocked(event.detail.locked);
                return;
            }
            loadConfigLocked().then((locked) => {
                if (active) setConfigLocked(locked);
            });
        };
        syncConfigLock();
        window.addEventListener(CONFIG_LOCK_UPDATED_EVENT, syncConfigLock);
        return () => {
            active = false;
            window.removeEventListener(CONFIG_LOCK_UPDATED_EVENT, syncConfigLock);
        };
    }, []);

    useEffect(() => {
        if (nodes.length === 0) {
            if (selectedNodeId !== null) setSelectedNodeId(null);
            if (selectedTemplateId !== null) setSelectedTemplateId(null);
            if (expandedNodeIds.size > 0) setExpandedNodeIds(new Set());
            return;
        }
        if (!nodes.some((node) => node.id === selectedNodeId)) {
            setSelectedNodeId(nodes.find((node) => !node.parentId)?.id || nodes[0]?.id || null);
            setSelectedTemplateId(null);
        }
        setExpandedNodeIds((current) => {
            const validIds = new Set(nodes.map((node) => node.id));
            return new Set([...current].filter((nodeId) => validIds.has(nodeId)));
        });
    }, [nodes, selectedNodeId, selectedTemplateId]);

    useEffect(() => {
        if (!selectedTemplateId) return;
        const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
        if (!selectedTemplate) {
            setSelectedTemplateId(null);
            return;
        }

        const linkedNodeIds = selectedTemplate.nodeIds || [];
        if (selectedNodeId && linkedNodeIds.includes(selectedNodeId)) return;

        const nextNodeId = linkedNodeIds.find((nodeId) => nodes.some((node) => node.id === nodeId));
        if (nextNodeId) {
            setSelectedNodeId(nextNodeId);
        } else {
            setSelectedTemplateId(null);
        }
    }, [nodes, selectedNodeId, selectedTemplateId, templates]);

    const nodeLookup = useMemo(() => buildNodeLookup(nodes), [nodes]);
    const childrenByParent = useMemo(() => buildNodeChildrenIndex(nodes), [nodes]);
    const templatesByNode = useMemo(() => buildTemplateNodeIndex(templates), [templates]);
    const templateSearchResults = useMemo(
        () => filterTemplateEditorTree(nodes, templates, deferredTemplateSearchQuery),
        [deferredTemplateSearchQuery, nodes, templates]
    );
    const isTemplateSearchActive = deferredTemplateSearchQuery.trim().length > 0;
    const visibleChildrenByParent = useMemo(
        () => isTemplateSearchActive
            ? buildNodeChildrenIndex(templateSearchResults.nodes)
            : childrenByParent,
        [childrenByParent, isTemplateSearchActive, templateSearchResults.nodes]
    );
    const visibleTemplatesByNode = useMemo(
        () => isTemplateSearchActive
            ? buildTemplateNodeIndex(templateSearchResults.templates)
            : templatesByNode,
        [isTemplateSearchActive, templateSearchResults.templates, templatesByNode]
    );
    const visibleExpandedNodeIds = useMemo(
        () => isTemplateSearchActive
            ? new Set(templateSearchResults.nodes.map((node) => node.id))
            : expandedNodeIds,
        [expandedNodeIds, isTemplateSearchActive, templateSearchResults.nodes]
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
    const selectedNode = useMemo(
        () => nodeLookup.get(selectedNodeId) || null,
        [nodeLookup, selectedNodeId]
    );
    const selectedTemplate = useMemo(
        () => templates.find((template) => template.id === selectedTemplateId) || null,
        [selectedTemplateId, templates]
    );
    const selectedItemType = selectedTemplate ? "template" : selectedNode ? "topic" : null;
    const selectedNodePath = useMemo(
        () => selectedNode ? buildNodePath(nodeLookup, selectedNode) : [],
        [nodeLookup, selectedNode]
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
    const linkOptionsByTemplateId = useMemo(() => {
        const optionsByTemplateId = new Map();
        selectedTemplates.forEach((template) => {
            const linkedNodeIds = new Set(template.nodeIds || []);
            optionsByTemplateId.set(
                template.id,
                nodeOptions.filter(({ node }) => !linkedNodeIds.has(node.id))
            );
        });
        return optionsByTemplateId;
    }, [nodeOptions, selectedTemplates]);
    const selectNode = useCallback((nodeId) => {
        setSelectedNodeId(nodeId);
        setSelectedTemplateId(null);
        setExpandedNodeIds((current) => {
            const next = new Set(current);
            buildNodeAncestorIds(nodeLookup, nodeId).forEach((ancestorId) => next.add(ancestorId));
            return next;
        });
    }, [nodeLookup]);

    const selectTemplate = useCallback((templateId, nodeId) => {
        setSelectedNodeId(nodeId);
        setSelectedTemplateId(templateId);
        setExpandedNodeIds((current) => {
            const next = new Set(current);
            buildNodeAncestorIds(nodeLookup, nodeId).forEach((ancestorId) => next.add(ancestorId));
            next.add(nodeId);
            return next;
        });
    }, [nodeLookup]);

    const toggleNodeExpansion = useCallback((nodeId) => {
        setExpandedNodeIds((current) => {
            const next = new Set(current);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
    }, []);

    const ensureUnlocked = useCallback(() => {
        if (!configLocked) return true;
        showToast("Configuration locked: templates and topics cannot be edited.", "warning");
        return false;
    }, [configLocked]);

    const persist = useCallback(async (nextNodes = nodes, nextTemplates = templates) => {
        if (!ensureUnlocked()) return false;
        setNodes(nextNodes);
        setTemplates(nextTemplates);
        await saveTemplateTreeData({ nodes: nextNodes, templates: nextTemplates });
        return true;
    }, [ensureUnlocked, nodes, templates]);

    const getTemplateDropPlan = useCallback((candidate, item = dragItem) => {
        const normalizedCandidate = normalizeTreeDropCandidate(candidate, item);
        if (!normalizedCandidate || item?.type !== "template") return null;

        const templateExists = templates.some((template) => template.id === item.id);
        if (!templateExists) return null;

        const targetNodeId = normalizedCandidate.nodeId;
        if (!nodeLookup.has(targetNodeId)) return null;

        const targetTemplatesForNode = getIndexedTemplatesForNode(templatesByNode, targetNodeId);
        const targetTemplates = targetTemplatesForNode.filter((template) => template.id !== item.id);
        let insertIndex = targetTemplates.length;

        if (normalizedCandidate.targetType === "template") {
            if (normalizedCandidate.templateId === item.id) return null;
            const targetIndex = targetTemplates.findIndex((template) => template.id === normalizedCandidate.templateId);
            if (targetIndex < 0) return null;
            insertIndex = targetIndex + (normalizedCandidate.position === "after" ? 1 : 0);
        } else if (normalizedCandidate.targetType !== "topic") {
            return null;
        }

        if (item.nodeId === targetNodeId) {
            const currentOrder = targetTemplatesForNode.map((template) => template.id);
            const nextOrder = targetTemplates.map((template) => template.id);
            nextOrder.splice(insertIndex, 0, item.id);
            if (hasSameOrder(currentOrder, nextOrder)) return null;
        }

        return { targetNodeId, insertIndex };
    }, [dragItem, nodeLookup, templates, templatesByNode]);

    const isValidTreeDrop = useCallback((candidate, item = dragItem) => {
        if (configLocked) return false;
        const normalizedCandidate = normalizeTreeDropCandidate(candidate, item);
        if (!normalizedCandidate || !item) return false;

        if (item.type === "topic") {
            if (normalizedCandidate.targetType !== "topic") return false;
            const targetNode = nodeLookup.get(normalizedCandidate.nodeId);
            if (!targetNode || targetNode.id === item.id) return false;

            const nextParentId = normalizedCandidate.position === "inside"
                ? targetNode.id
                : targetNode.parentId || null;
            return canMoveNode(nodes, item.id, nextParentId);
        }

        if (item.type === "template") {
            return Boolean(getTemplateDropPlan(normalizedCandidate, item));
        }

        return false;
    }, [configLocked, dragItem, getTemplateDropPlan, nodeLookup, nodes]);

    const updateDropTarget = useCallback((candidate) => {
        dropTargetRef.current = candidate;
        setDropTarget((current) => (
            isSameDropTarget(current, candidate) ? current : candidate
        ));
    }, []);

    const clearDropTarget = useCallback(() => {
        dropTargetRef.current = null;
        setDropTarget(null);
    }, []);

    const allowCurrentDropTarget = useCallback((event, item = dragItem) => {
        if (!isValidTreeDrop(dropTargetRef.current, item)) return false;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        return true;
    }, [dragItem, isValidTreeDrop]);

    const handleTreeDragStart = useCallback((item, event) => {
        if (!ensureUnlocked()) {
            event.preventDefault();
            return;
        }
        setDragItem(item);
        clearDropTarget();
        try {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData(TREE_DRAG_MIME, JSON.stringify(item));
            event.dataTransfer.setData("text/plain", item.id);
        } catch {
            // Drag metadata is only a browser hint; React state remains the source for this interaction.
        }
    }, [clearDropTarget, ensureUnlocked]);

    const handleTreeDragEnd = useCallback(() => {
        setDragItem(null);
        clearDropTarget();
    }, [clearDropTarget]);

    const handleNodeDragOver = useCallback((nodeId, position, event) => {
        const candidate = normalizeTreeDropCandidate({ targetType: "topic", nodeId, position }, dragItem);
        if (!isValidTreeDrop(candidate)) {
            if (!allowCurrentDropTarget(event)) clearDropTarget();
            return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        updateDropTarget(candidate);
    }, [allowCurrentDropTarget, clearDropTarget, dragItem, isValidTreeDrop, updateDropTarget]);

    const handleTemplateDragOver = useCallback((templateId, nodeId, position, event) => {
        const candidate = { targetType: "template", templateId, nodeId, position };
        if (!isValidTreeDrop(candidate)) {
            if (!allowCurrentDropTarget(event)) clearDropTarget();
            return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        updateDropTarget(candidate);
    }, [allowCurrentDropTarget, clearDropTarget, isValidTreeDrop, updateDropTarget]);

    const handleTreeDrop = useCallback(async (candidate, event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!ensureUnlocked()) {
            setDragItem(null);
            clearDropTarget();
            return;
        }

        const activeDragItem = dragItem || readDragItemFromEvent(event);
        const committedCandidate = isValidTreeDrop(dropTargetRef.current, activeDragItem)
            ? dropTargetRef.current
            : normalizeTreeDropCandidate(candidate, activeDragItem);
        if (!isValidTreeDrop(committedCandidate, activeDragItem)) {
            setDragItem(null);
            clearDropTarget();
            return;
        }

        try {
            if (activeDragItem.type === "topic" && committedCandidate.targetType === "topic") {
                const targetNode = nodeLookup.get(committedCandidate.nodeId);
                if (!targetNode) return;

                const nextParentId = committedCandidate.position === "inside"
                    ? targetNode.id
                    : targetNode.parentId || null;
                const siblingNodes = getIndexedChildNodes(childrenByParent, nextParentId)
                    .filter((node) => node.id !== activeDragItem.id);
                const targetIndex = committedCandidate.position === "inside"
                    ? siblingNodes.length
                    : siblingNodes.findIndex((node) => node.id === targetNode.id);
                const insertIndex = committedCandidate.position === "after"
                    ? targetIndex + 1
                    : targetIndex;

                const nextNodes = moveNodeToParentAtIndex(
                    nodes,
                    activeDragItem.id,
                    nextParentId,
                    insertIndex < 0 ? siblingNodes.length : insertIndex
                );
                const nextLookup = buildNodeLookup(nextNodes);
                if (!await persist(nextNodes, templates)) return;
                setSelectedNodeId(activeDragItem.id);
                setSelectedTemplateId(null);
                setExpandedNodeIds((current) => {
                    const next = new Set(current);
                    if (nextParentId) next.add(nextParentId);
                    next.add(activeDragItem.id);
                    buildNodeAncestorIds(nextLookup, activeDragItem.id).forEach((ancestorId) => next.add(ancestorId));
                    return next;
                });
                showToast("Topic moved", "info");
                return;
            }

            if (activeDragItem.type === "template") {
                const dropPlan = getTemplateDropPlan(committedCandidate, activeDragItem);
                if (!dropPlan) return;

                const nextTemplates = moveTemplateToNodeAtIndex(
                    templates,
                    activeDragItem.id,
                    activeDragItem.nodeId,
                    dropPlan.targetNodeId,
                    dropPlan.insertIndex,
                    nodes
                );
                if (!await persist(nodes, nextTemplates)) return;
                setSelectedNodeId(dropPlan.targetNodeId);
                setSelectedTemplateId(activeDragItem.id);
                setExpandedNodeIds((current) => {
                    const next = new Set(current);
                    next.add(dropPlan.targetNodeId);
                    buildNodeAncestorIds(nodeLookup, dropPlan.targetNodeId).forEach((ancestorId) => next.add(ancestorId));
                    return next;
                });
                showToast("Template moved", "info");
            }
        } catch (error) {
            console.error(error);
            showToast(activeDragItem.type === "topic" ? "Topic cannot be moved there" : "Template cannot be moved there", "error");
        } finally {
            setDragItem(null);
            clearDropTarget();
        }
    }, [
        clearDropTarget,
        childrenByParent,
        dragItem,
        ensureUnlocked,
        getTemplateDropPlan,
        isValidTreeDrop,
        nodeLookup,
        nodes,
        persist,
        templates
    ]);

    const openRootNodeModal = () => {
        if (!ensureUnlocked()) return;
        setNodeModal({ mode: "create", parentId: null });
    };

    const openChildNodeModal = (parentId = selectedNodeId) => {
        if (!ensureUnlocked()) return;
        if (!parentId) return;
        setNodeModal({ mode: "create", parentId });
    };

    const openEditNodeModal = (node) => {
        if (!ensureUnlocked()) return;
        setNodeModal({ mode: "edit", node });
    };

    const saveNode = async (fields) => {
        if (!ensureUnlocked()) return;
        if (!nodeModal) return;
        if (nodeModal.mode === "edit") {
            const nextNodes = updateNode(nodes, nodeModal.node.id, fields);
            if (!await persist(nextNodes, templates)) return;
            showToast("Topic updated", "info");
        } else {
            try {
                const nextNode = createNodeForParent(nodes, nodeModal.parentId, fields, templates);
                if (!await persist([...nodes, nextNode], templates)) return;
                setSelectedNodeId(nextNode.id);
                setSelectedTemplateId(null);
                setExpandedNodeIds((current) => {
                    const next = new Set(current);
                    next.add(nextNode.id);
                    if (nextNode.parentId) next.add(nextNode.parentId);
                    return next;
                });
                showToast("Topic created", "info");
            } catch (error) {
                showToast(error.message, "error");
                return;
            }
        }
        setNodeModal(null);
    };

    const deleteSelectedNode = async () => {
        if (!ensureUnlocked()) return;
        if (!confirmNodeDelete) return;
        const next = removeNodeCascade(nodes, templates, confirmNodeDelete);
        if (!await persist(next.nodes, next.templates)) return;
        setConfirmNodeDelete(null);
        showToast("Topic deleted", "warning");
    };

    const saveTemplate = async (fields) => {
        if (!ensureUnlocked()) return;
        if (!templateModal) return;
        if (templateModal.mode === "edit") {
            const nextTemplates = updateTemplate(templates, templateModal.template.id, fields);
            if (!await persist(nodes, nextTemplates)) return;
            showToast("Template updated", "info");
        } else {
            try {
                const nextTemplate = createTemplateForNode(templateModal.parentNodeId, fields, nodes, templates);
                if (!await persist(nodes, [...templates, nextTemplate])) return;
                setSelectedNodeId(templateModal.parentNodeId);
                setSelectedTemplateId(nextTemplate.id);
                showToast("Template created", "info");
            } catch (error) {
                showToast(error.message, "error");
                return;
            }
        }
        setTemplateModal(null);
    };

    const saveSelectedTemplateInline = useCallback(async (fields) => {
        if (!ensureUnlocked()) return;
        if (!selectedTemplate) return;
        const nextTemplates = updateTemplate(templates, selectedTemplate.id, fields);
        if (!await persist(nodes, nextTemplates)) return;
        showToast("Template updated", "info");
    }, [ensureUnlocked, nodes, persist, selectedTemplate, templates]);

    const deleteTemplate = async () => {
        if (!ensureUnlocked()) return;
        if (!confirmTemplateDelete) return;
        const nextTemplates = removeTemplate(templates, confirmTemplateDelete);
        if (!await persist(nodes, nextTemplates)) return;
        setConfirmTemplateDelete(null);
        showToast("Template deleted", "warning");
    };

    const requestTemplateDelete = useCallback((templateId) => {
        if (!ensureUnlocked()) return;
        setConfirmTemplateDelete(templateId);
    }, [ensureUnlocked]);

    const changeTemplateLinkTarget = useCallback((templateId, targetNodeId) => {
        setTemplateLinkTargets((current) => ({
            ...current,
            [templateId]: targetNodeId
        }));
    }, []);

    const duplicateSelectedTemplate = useCallback(async (templateId) => {
        if (!ensureUnlocked()) return;
        const nextTemplates = duplicateTemplate(templates, templateId);
        if (!await persist(nodes, nextTemplates)) return;
        showToast("Template duplicated", "info");
    }, [ensureUnlocked, nodes, persist, templates]);

    const openTemplateCreationPicker = (nodeId = selectedNodeId) => {
        if (!ensureUnlocked()) return;
        if (!nodeId) return;
        setTemplateModal({ mode: "create", parentNodeId: nodeId });
    };

    const openExistingTemplatePicker = (nodeId = selectedNodeId) => {
        if (!ensureUnlocked()) return;
        if (!nodeId) return;
        setExistingPickerModal({ nodeId });
    };

    const linkTemplateToCurrentNode = useCallback(async (templateId) => {
        if (!ensureUnlocked()) return;
        if (!existingPickerModal?.nodeId) return;
        try {
            const nextTemplates = linkTemplateToNode(templates, templateId, existingPickerModal.nodeId, nodes);
            if (!await persist(nodes, nextTemplates)) return;
            setExistingPickerModal(null);
            showToast("Template linked", "info");
        } catch (error) {
            console.error(error);
            showToast("Template cannot be linked there", "error");
        }
    }, [ensureUnlocked, existingPickerModal?.nodeId, nodes, persist, templates]);

    const linkTemplate = useCallback(async (templateId, targetNodeId) => {
        if (!ensureUnlocked()) return;
        if (!targetNodeId) return;
        try {
            const nextTemplates = linkTemplateToNode(templates, templateId, targetNodeId, nodes);
            if (!await persist(nodes, nextTemplates)) return;
            setTemplateLinkTargets((current) => {
                const next = { ...current };
                delete next[templateId];
                return next;
            });
            showToast("Template linked to topic", "info");
        } catch (error) {
            console.error(error);
            showToast("Template cannot be linked there", "error");
        }
    }, [ensureUnlocked, nodes, persist, templates]);

    const unlinkFromNode = useCallback(async (templateId, nodeId) => {
        if (!ensureUnlocked()) return;
        const template = templates.find((t) => t.id === templateId);
        if (!template || (template.nodeIds || []).length <= 1) return;
        const nextTemplates = unlinkTemplateFromNode(templates, templateId, nodeId);
        if (!await persist(nodes, nextTemplates)) return;
        showToast("Template unlinked from topic", "info");
    }, [ensureUnlocked, nodes, persist, templates]);

    const selectedBreadcrumb = selectedNodePath.length > 1
        ? selectedNodePath.slice(0, -1).map((node) => node.title || "Untitled topic").join(" · ")
        : "Topics";
    const selectedSummary = selectedNode
        ? `${formatUnitCount(selectedChildNodes.length, "subtopic")} · ${formatUnitCount(selectedTemplates.length, "template")}`
        : "";

    return (
        <main className={`page-container node-builder-page${embedded ? " node-builder-page--embedded" : ""}`}>
            <div className="node-builder-shell">
                <header className="node-builder-header node-editor-header">
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
                        <div className="node-editor-title-line">
                            <h1>Playbook</h1>
                            {selectedNode && <span className="node-editor-breadcrumb">{selectedBreadcrumb}</span>}
                            {configLocked && <span className="config-lock-badge"><Lock size={14} aria-hidden="true" /> Locked</span>}
                        </div>
                    </div>
                </header>

                <div className="node-builder-layout node-topic-editor-layout">
                    <section className="node-tree-panel node-list-panel node-topics-sidebar" aria-label="Topics">
                        <div className="node-list-header">
                            <div>
                                <h2>Topics</h2>
                            </div>
                            {!configLocked && (
                                <button type="button" className="secondary-btn node-action-btn node-sidebar-add-btn" onClick={openRootNodeModal}>
                                    <Plus size={16} aria-hidden="true" />
                                    Topic
                                </button>
                            )}
                        </div>
                        <div className="node-editor-search">
                            <Search size={16} aria-hidden="true" />
                            <input
                                type="search"
                                value={templateSearchQuery}
                                onChange={(event) => setTemplateSearchQuery(event.target.value)}
                                placeholder="Search templates..."
                                aria-label="Search templates"
                            />
                            {templateSearchQuery && (
                                <button
                                    type="button"
                                    className="node-editor-search__clear"
                                    onClick={() => setTemplateSearchQuery("")}
                                    aria-label="Clear template search"
                                    title="Clear search"
                                >
                                    <X size={15} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                        {isTemplateSearchActive && (
                            <p className="node-editor-search__count" aria-live="polite">
                                {formatUnitCount(templateSearchResults.matchCount, "template")} found
                            </p>
                        )}
                        <div className="node-tree-list node-tree-list--primary">
                            {nodes.length === 0 ? (
                                <EmptyState
                                    message="No topics yet."
                                    action={configLocked ? null : <button type="button" className="secondary-btn" onClick={openRootNodeModal}>Create topic</button>}
                                />
                            ) : isTemplateSearchActive && templateSearchResults.matchCount === 0 ? (
                                <EmptyState message="No matching templates." />
                            ) : (
                                <NodeTreeRows
                                    childrenByParent={visibleChildrenByParent}
                                    nodeSummaryById={nodeSummaryById}
                                    templatesByNode={visibleTemplatesByNode}
                                    parentId={null}
                                    selectedNodeId={selectedNodeId}
                                    selectedTemplateId={selectedTemplateId}
                                    selectedItemType={selectedItemType}
                                    expandedNodeIds={visibleExpandedNodeIds}
                                    locked={configLocked}
                                    dragItem={dragItem}
                                    dropTarget={dropTarget}
                                    onToggleNode={toggleNodeExpansion}
                                    onSelect={selectNode}
                                    onSelectTemplate={selectTemplate}
                                    onDragStart={handleTreeDragStart}
                                    onDragEnd={handleTreeDragEnd}
                                    onNodeDragOver={handleNodeDragOver}
                                    onTemplateDragOver={handleTemplateDragOver}
                                    onDrop={handleTreeDrop}
                                />
                            )}
                        </div>
                    </section>

                    <section className={`node-canvas-panel node-detail-view node-topic-detail-panel${selectedNode ? "" : " is-empty"}`} aria-label="Selected item details">
                        {!selectedNode ? (
                            <div className="node-topic-empty-panel">
                                <EmptyState
                                    message={configLocked ? "Select a topic to view locked content." : "Select a topic to edit."}
                                    action={configLocked ? null : <button type="button" className="primary-btn" onClick={openRootNodeModal}>Create topic</button>}
                                />
                            </div>
                        ) : configLocked && selectedTemplate ? (
                            <LockedConfigPanel
                                title="Template editing is locked"
                                message="You can use this template from the main workspace, but this imported configuration blocks saved edits."
                                detail={selectedTemplate.title || "Untitled template"}
                            />
                        ) : selectedTemplate ? (
                            <TemplateDetailPanel
                                template={selectedTemplate}
                                selectedNode={selectedNode}
                                nodeLookup={nodeLookup}
                                linkTarget={templateLinkTargets[selectedTemplate.id] || ""}
                                linkOptions={linkOptionsByTemplateId.get(selectedTemplate.id) || []}
                                onSave={saveSelectedTemplateInline}
                                onDuplicate={duplicateSelectedTemplate}
                                onUnlink={unlinkFromNode}
                                onDelete={requestTemplateDelete}
                                onLinkTargetChange={changeTemplateLinkTarget}
                                onLink={linkTemplate}
                            />
                        ) : (
                            <TopicDetailPanel
                                selectedNode={selectedNode}
                                selectedSummary={selectedSummary}
                                selectedChildNodes={selectedChildNodes}
                                selectedTemplates={selectedTemplates}
                                locked={configLocked}
                                onRename={() => openEditNodeModal(selectedNode)}
                                onDelete={() => setConfirmNodeDelete(selectedNode.id)}
                                onNewSubtopic={() => openChildNodeModal(selectedNode.id)}
                                onLinkExisting={() => openExistingTemplatePicker(selectedNode.id)}
                                onNewTemplate={() => openTemplateCreationPicker(selectedNode.id)}
                            />
                        )}
                    </section>
                </div>

                {nodeModal && !configLocked && (
                    <NodeFormModal
                        mode={nodeModal.mode}
                        initial={nodeModal.node}
                        parentTitle={nodeModal.parentId ? nodeLookup.get(nodeModal.parentId)?.title : ""}
                        onClose={() => setNodeModal(null)}
                        onSave={saveNode}
                    />
                )}

                {templateModal && !configLocked && (
                    <TemplateFormModal
                        initial={templateModal.template}
                        parentTitle={nodeLookup.get(templateModal.parentNodeId)?.title || "Selected topic"}
                        onClose={() => setTemplateModal(null)}
                        onSave={saveTemplate}
                    />
                )}

                {existingPickerModal && !configLocked && (
                    <ExistingTemplatePickerModal
                        currentNodeId={existingPickerModal.nodeId}
                        allTemplates={templates}
                        nodeLookup={nodeLookup}
                        onClose={() => setExistingPickerModal(null)}
                        onLink={linkTemplateToCurrentNode}
                    />
                )}

                {confirmNodeDelete && !configLocked && (
                    <ConfirmDialog
                        title="Delete topic"
                        message="Delete this topic, its subtopics, and all templates inside them?"
                        confirmLabel="Delete"
                        variant="danger"
                        onConfirm={deleteSelectedNode}
                        onCancel={() => setConfirmNodeDelete(null)}
                    />
                )}

                {confirmTemplateDelete && !configLocked && (
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
