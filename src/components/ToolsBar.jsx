import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardPaste, ExternalLink, Files, Puzzle, Settings2, Users } from "lucide-react";
import Modal from "./Modal.jsx";
import PartnersModal from "./PartnersModal.jsx";
import { copyHtml, copyText, showToast } from "../services/clipboardService.js";
import {
    hasRequiredToolUrlValues,
    isModuleTool,
    loadTools,
    resolveToolUrl,
    sanitizeToolColor
} from "../services/toolsService.js";
import { handleToolModuleTemplateRequest } from "../services/toolModuleTemplateService.js";
import {
    buildToolModuleSrcDoc,
    buildToolRuntimeContext,
    fetchToolModuleNetworkResource
} from "../utils/toolModuleRuntime.js";

const ToolButton = memo(function ToolButton({ tool, valuesRef, onOpenModule }) {
    const linkRef = useRef(null);
    const moduleTool = isModuleTool(tool);

    const resolveHref = useCallback(() => (
        moduleTool ? "" : resolveToolUrl(tool.url, valuesRef?.current || {})
    ), [moduleTool, tool.url, valuesRef]);

    const refreshHref = useCallback(() => {
        const href = resolveHref();
        if (linkRef.current) {
            if (href) linkRef.current.setAttribute("href", href);
            else linkRef.current.removeAttribute("href");
        }
        return href;
    }, [resolveHref]);

    const handleModuleClick = useCallback(() => {
        onOpenModule(tool);
    }, [onOpenModule, tool]);

    const handleLinkClick = useCallback((event) => {
        const href = refreshHref();
        if (href) return;
        event.preventDefault();
        showToast("This tool has no URL.", "warning");
    }, [refreshHref]);

    if (!moduleTool) {
        const href = resolveHref();

        return (
            <a
                ref={linkRef}
                href={href || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`tools-bar-btn tools-bar-btn--custom tools-bar-btn--${sanitizeToolColor(tool.color)}`}
                title={tool.url || tool.title}
                onPointerDown={refreshHref}
                onFocus={refreshHref}
                onClick={handleLinkClick}
                onAuxClick={handleLinkClick}
            >
                {tool.title}
                <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
            </a>
        );
    }

    return (
        <button
            type="button"
            className={`tools-bar-btn tools-bar-btn--custom tools-bar-btn--${sanitizeToolColor(tool.color)}`}
            title={`${tool.title} module`}
            onClick={handleModuleClick}
        >
            {tool.title}
            <Puzzle size={12} strokeWidth={2} aria-hidden="true" />
        </button>
    );
});

function isSafeOpenUrl(url) {
    return /^(https?:|mailto:|tel:)/i.test(String(url || "").trim());
}

function ToolModuleModal({ tool, valuesRef, runtimeContextRef, onClose }) {
    const iframeRef = useRef(null);
    const [frameHeight, setFrameHeight] = useState(520);
    const srcDoc = buildToolModuleSrcDoc(tool.html);

    const postContext = useCallback((requestId = "") => {
        const target = iframeRef.current?.contentWindow;
        if (!target) return;
        const runtimeContext = runtimeContextRef?.current || {};
        target.postMessage({
            source: "template-tool-host",
            type: requestId ? "tool:response" : "tool:context",
            responseTo: requestId,
            payload: buildToolRuntimeContext({
                tool,
                values: valuesRef.current || {},
                tokens: runtimeContext.tokens || [],
                client: runtimeContext.client || null,
                clientInfo: runtimeContext.clientInfo || [],
                clientSummary: runtimeContext.clientSummary || [],
                profile: runtimeContext.profile || null
            })
        }, "*");
    }, [tool, valuesRef, runtimeContextRef]);

    const reply = useCallback((requestId, payload = null, error = "") => {
        if (!requestId) return;
        const target = iframeRef.current?.contentWindow;
        if (!target) return;
        target.postMessage({
            source: "template-tool-host",
            type: "tool:response",
            responseTo: requestId,
            payload,
            error
        }, "*");
    }, []);

    useEffect(() => {
        const handleMessage = async (event) => {
            if (event.source !== iframeRef.current?.contentWindow) return;
            const data = event.data || {};
            if (data.source !== "template-tool-module") return;

            const { type, requestId, payload = {} } = data;

            try {
                if (type === "tool:ready") {
                    postContext();
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:resize") {
                    const nextHeight = Math.min(Math.max(Math.ceil(Number(payload.height) || 0), 160), 1400);
                    if (nextHeight > 0) {
                        setFrameHeight((current) => Math.abs(current - nextHeight) > 4 ? nextHeight : current);
                    }
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:request-context") {
                    postContext(requestId);
                    return;
                }

                if (String(type || "").startsWith("tool:templates:")) {
                    const result = await handleToolModuleTemplateRequest(type, payload);
                    if (["tool:templates:apply-migration", "tool:templates:update-template", "tool:templates:move-template"].includes(type)) {
                        showToast("Template tree updated.", "success");
                    }
                    reply(requestId, result);
                    return;
                }

                if (type === "tool:copy-text") {
                    if (!payload.text) {
                        showToast("Nothing to copy.", "warning");
                        reply(requestId, { ok: false });
                        return;
                    }
                    await copyText(payload.text, {
                        message: payload.message || "Copied from tool.",
                        variant: "success"
                    });
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:copy-html") {
                    if (!payload.html) {
                        showToast("Nothing to copy.", "warning");
                        reply(requestId, { ok: false });
                        return;
                    }
                    await copyHtml(payload.html, {
                        message: payload.message || "Copied from tool.",
                        variant: "success"
                    });
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:toast") {
                    showToast(payload.message || "Tool updated.", payload.variant || "info");
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:open-url") {
                    if (!isSafeOpenUrl(payload.url)) {
                        showToast("Only http, mailto and tel links can be opened by the host.", "warning");
                        reply(requestId, { ok: false });
                        return;
                    }
                    window.open(payload.url, "_blank", "noopener,noreferrer");
                    reply(requestId, { ok: true });
                    return;
                }

                if (type === "tool:fetch-json" || type === "tool:fetch-text") {
                    const result = await fetchToolModuleNetworkResource({
                        url: payload.url,
                        responseType: type === "tool:fetch-json" ? "json" : "text"
                    });
                    reply(requestId, result);
                    return;
                }

                if (type === "tool:close") {
                    onClose();
                    return;
                }
            } catch (error) {
                reply(requestId, null, error?.message || "Tool request failed.");
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [onClose, postContext, reply]);

    useEffect(() => {
        setFrameHeight(520);
    }, [tool.id, tool.html]);

    return (
        <Modal
            onClose={onClose}
            ariaLabel={`${tool.title} tool module`}
            dialogClassName="popup-box tool-module-modal"
        >
            <div className="tool-module-modal__header">
                <div>
                    <p className="eyebrow">Tool module <span className="tool-beta-pill">Beta</span></p>
                    <h2>{tool.title}</h2>
                </div>
            </div>
            <div
                className="tool-module-frame-shell"
                style={{ "--tool-module-frame-height": `${frameHeight}px` }}
            >
                <iframe
                    ref={iframeRef}
                    className="tool-module-frame"
                    title={`${tool.title} module`}
                    sandbox="allow-scripts allow-forms allow-popups allow-modals"
                    srcDoc={srcDoc}
                    onLoad={() => postContext()}
                />
            </div>
        </Modal>
    );
}

function ToolsBar({
    values = {},
    valuesRef: externalValuesRef = null,
    runtimeContextRef: externalRuntimeContextRef = null,
    onOpenExternalGenerator,
    hasExternalId = false,
    onOpenAlexTicket,
    hasAlexTicketData = false,
    alexTicketUnavailableMessage = "ALEX ticket data is unavailable",
    onCopyAloAutofillData,
    hasAloAutofillData = false,
    onOpenSuperOfficePhotos,
    superOfficeMediaCount = 0,
    superOfficePhotoCount = 0,
    onManageTools
}) {
    const navigate = useNavigate();
    const [tools, setTools] = useState([]);
    const [activeModuleTool, setActiveModuleTool] = useState(null);
    const [partnersOpen, setPartnersOpen] = useState(false);
    const internalValuesRef = useRef(values);
    internalValuesRef.current = values;
    const valuesRef = externalValuesRef || internalValuesRef;
    const internalRuntimeContextRef = useRef({});
    const runtimeContextRef = externalRuntimeContextRef || internalRuntimeContextRef;

    const reload = useCallback(() => loadTools().then(setTools), []);

    useEffect(() => {
        reload();
        const handler = () => reload();
        window.addEventListener("tools-updated", handler);
        return () => window.removeEventListener("tools-updated", handler);
    }, [reload]);

    const openModuleTool = useCallback((tool) => {
        setActiveModuleTool(tool);
    }, []);

    const closeModuleTool = useCallback(() => {
        setActiveModuleTool(null);
    }, []);

    const openPartners = useCallback(() => {
        setPartnersOpen(true);
    }, []);

    const closePartners = useCallback(() => {
        setPartnersOpen(false);
    }, []);

    const handleManageTools = useCallback(() => {
        if (onManageTools) {
            onManageTools();
            return;
        }
        navigate("/tools");
    }, [navigate, onManageTools]);

    const visibleTools = tools.filter((tool) => isModuleTool(tool) || hasRequiredToolUrlValues(tool.url, valuesRef.current || {}));
    const hasInternalTools = true;
    const hasConfiguredTools = tools.length > 0;
    const hasExternalTools = visibleTools.length > 0;
    const superOfficeAttachmentCount = superOfficeMediaCount || superOfficePhotoCount;

    if (!hasInternalTools && !hasExternalTools && !onManageTools) return null;

    return (
        <div className="tools-bar">
            <div className="tools-bar-inner">
                {hasInternalTools && (
                    <div className="tools-bar-section tools-bar-section--internal" aria-label="Internal actions">
                        <div className="tools-bar-section-items">
                            <button
                                type="button"
                                className="tools-bar-btn tools-bar-btn--system tools-bar-btn--partner"
                                onClick={openPartners}
                                title="Open partner contact list"
                            >
                                <Users size={14} strokeWidth={2} aria-hidden="true" />
                                Partner
                            </button>
                            {onOpenExternalGenerator && (
                                <button
                                    type="button"
                                    className={`tools-bar-btn tools-bar-btn--system tools-bar-btn--external${hasExternalId ? " is-disabled" : ""}`}
                                    onClick={onOpenExternalGenerator}
                                    disabled={hasExternalId}
                                    aria-disabled={hasExternalId}
                                    title={hasExternalId ? "External ID already present" : "Generate external ID"}
                                >
                                    Generate external ID
                                </button>
                            )}
                            {onCopyAloAutofillData && (
                                <button
                                    type="button"
                                    className={`tools-bar-btn tools-bar-btn--system tools-bar-btn--alo${hasAloAutofillData ? "" : " is-disabled"}`}
                                    onClick={onCopyAloAutofillData}
                                    disabled={!hasAloAutofillData}
                                    aria-disabled={!hasAloAutofillData}
                                    title={hasAloAutofillData ? "Copy ALO fill data for the bookmarklet" : "Import VTI data before preparing ALO fill data"}
                                >
                                    <ClipboardPaste size={14} strokeWidth={2} aria-hidden="true" />
                                    ALO fill
                                </button>
                            )}
                            {onOpenAlexTicket && (
                                <button
                                    type="button"
                                    className={`tools-bar-btn tools-bar-btn--system tools-bar-btn--alex${hasAlexTicketData ? "" : " is-disabled"}`}
                                    onClick={onOpenAlexTicket}
                                    disabled={!hasAlexTicketData}
                                    aria-disabled={!hasAlexTicketData}
                                    title={hasAlexTicketData ? "Copy the payload and open the existing ALEX ticket" : alexTicketUnavailableMessage}
                                >
                                    <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
                                    Ticket ALEX
                                </button>
                            )}
                            {onOpenSuperOfficePhotos && superOfficeAttachmentCount > 0 && (
                                <button
                                    type="button"
                                    className="tools-bar-btn tools-bar-btn--system tools-bar-btn--photos"
                                    onClick={onOpenSuperOfficePhotos}
                                    title="Afficher les photos, vidéos et PDF du dernier ticket SuperOffice importé"
                                >
                                    <Files size={14} strokeWidth={2} aria-hidden="true" />
                                    Médias SO
                                    <span className="tools-bar-count">{superOfficeAttachmentCount}</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
                <div className="tools-bar-section tools-bar-section--external" aria-label="External tools and modules">
                    <div className="tools-bar-section-items">
                        {hasExternalTools ? (
                            visibleTools.map((tool) => (
                                <ToolButton
                                    key={tool.id}
                                    tool={tool}
                                    valuesRef={valuesRef}
                                    onOpenModule={openModuleTool}
                                />
                            ))
                        ) : (
                            <span className="tools-bar-empty-tip">
                                {hasConfiguredTools
                                    ? "No tools available for current data."
                                    : "No tools yet. Open Options > Tools to create one."}
                            </span>
                        )}
                        <button
                            type="button"
                            className="tools-bar-manage-btn"
                            onClick={handleManageTools}
                            title="Manage tools"
                            aria-label="Manage tools"
                        >
                            <Settings2 size={15} strokeWidth={1.9} />
                        </button>
                    </div>
                </div>
            </div>
            {activeModuleTool && (
                <ToolModuleModal
                    tool={activeModuleTool}
                    valuesRef={valuesRef}
                    runtimeContextRef={runtimeContextRef}
                    onClose={closeModuleTool}
                />
            )}
            {partnersOpen && <PartnersModal onClose={closePartners} />}
        </div>
    );
}

export default memo(ToolsBar, (prevProps, nextProps) => {
    const valuesEqual = prevProps.values === nextProps.values
        && prevProps.valuesRef === nextProps.valuesRef;

    return valuesEqual
        && prevProps.runtimeContextRef === nextProps.runtimeContextRef
        && prevProps.onOpenExternalGenerator === nextProps.onOpenExternalGenerator
        && prevProps.hasExternalId === nextProps.hasExternalId
        && prevProps.onOpenAlexTicket === nextProps.onOpenAlexTicket
        && prevProps.hasAlexTicketData === nextProps.hasAlexTicketData
        && prevProps.alexTicketUnavailableMessage === nextProps.alexTicketUnavailableMessage
        && prevProps.onCopyAloAutofillData === nextProps.onCopyAloAutofillData
        && prevProps.hasAloAutofillData === nextProps.hasAloAutofillData
        && prevProps.onOpenSuperOfficePhotos === nextProps.onOpenSuperOfficePhotos
        && prevProps.superOfficeMediaCount === nextProps.superOfficeMediaCount
        && prevProps.superOfficePhotoCount === nextProps.superOfficePhotoCount
        && prevProps.onManageTools === nextProps.onManageTools;
});
