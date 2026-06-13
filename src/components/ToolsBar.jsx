import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardPaste, ExternalLink, Image as ImageIcon, Settings2 } from "lucide-react";
import { loadTools, resolveToolUrl, sanitizeToolColor } from "../services/toolsService.js";

const ToolButton = memo(function ToolButton({ tool, onOpenTool }) {
    const handleClick = useCallback(() => {
        onOpenTool(tool);
    }, [onOpenTool, tool]);

    return (
        <button
            type="button"
            className={`tools-bar-btn tools-bar-btn--custom tools-bar-btn--${sanitizeToolColor(tool.color)}`}
            title={tool.url || tool.title}
            onClick={handleClick}
        >
            {tool.title}
            <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
        </button>
    );
});

function ToolsBar({
    values = {},
    valuesRef: externalValuesRef = null,
    onOpenExternalGenerator,
    hasExternalId = false,
    onCopyAloAutofillData,
    hasAloAutofillData = false,
    onOpenSuperOfficePhotos,
    superOfficePhotoCount = 0,
    onManageTools
}) {
    const navigate = useNavigate();
    const [tools, setTools] = useState([]);
    const internalValuesRef = useRef(values);
    internalValuesRef.current = values;
    const valuesRef = externalValuesRef || internalValuesRef;

    const reload = useCallback(() => loadTools().then(setTools), []);

    useEffect(() => {
        reload();
        const handler = () => reload();
        window.addEventListener("tools-updated", handler);
        return () => window.removeEventListener("tools-updated", handler);
    }, [reload]);

    const openTool = useCallback((tool) => {
        const url = resolveToolUrl(tool.url, valuesRef.current);
        window.open(url, "_blank", "noopener,noreferrer");
    }, [valuesRef]);

    const handleManageTools = useCallback(() => {
        if (onManageTools) {
            onManageTools();
            return;
        }
        navigate("/tools");
    }, [navigate, onManageTools]);

    if (tools.length === 0 && !onOpenExternalGenerator && !onCopyAloAutofillData && !onOpenSuperOfficePhotos) return null;

    return (
        <div className="tools-bar">
            <div className="tools-bar-inner">
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
                {onOpenSuperOfficePhotos && superOfficePhotoCount > 0 && (
                    <button
                        type="button"
                        className="tools-bar-btn tools-bar-btn--system tools-bar-btn--photos"
                        onClick={onOpenSuperOfficePhotos}
                        title="Afficher les photos du dernier ticket SuperOffice importé"
                    >
                        <ImageIcon size={14} strokeWidth={2} aria-hidden="true" />
                        Photos SO
                        <span className="tools-bar-count">{superOfficePhotoCount}</span>
                    </button>
                )}
                {tools.map((tool) => (
                    <ToolButton
                        key={tool.id}
                        tool={tool}
                        onOpenTool={openTool}
                    />
                ))}
            </div>
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
    );
}

export default memo(ToolsBar, (prevProps, nextProps) => {
    const refBackedValues = prevProps.valuesRef || nextProps.valuesRef;
    const valuesEqual = refBackedValues
        ? prevProps.valuesRef === nextProps.valuesRef
        : prevProps.values === nextProps.values;

    return valuesEqual
        && prevProps.onOpenExternalGenerator === nextProps.onOpenExternalGenerator
        && prevProps.hasExternalId === nextProps.hasExternalId
        && prevProps.onCopyAloAutofillData === nextProps.onCopyAloAutofillData
        && prevProps.hasAloAutofillData === nextProps.hasAloAutofillData
        && prevProps.onOpenSuperOfficePhotos === nextProps.onOpenSuperOfficePhotos
        && prevProps.superOfficePhotoCount === nextProps.superOfficePhotoCount
        && prevProps.onManageTools === nextProps.onManageTools;
});
