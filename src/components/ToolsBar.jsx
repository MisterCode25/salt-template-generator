import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Settings2 } from "lucide-react";
import { loadTools, resolveToolUrl } from "../services/toolsService.js";

const ToolButton = memo(function ToolButton({ tool, onOpenTool }) {
    const handleClick = useCallback(() => {
        onOpenTool(tool);
    }, [onOpenTool, tool]);

    return (
        <button
            type="button"
            className="tools-bar-btn"
            title={tool.url || tool.title}
            onClick={handleClick}
        >
            {tool.title}
            <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
        </button>
    );
});

function ToolsBar({ values = {}, valuesRef: externalValuesRef = null, onOpenExternalGenerator, onImportSuperOffice, onManageTools }) {
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

    if (tools.length === 0 && !onOpenExternalGenerator && !onImportSuperOffice) return null;

    return (
        <div className="tools-bar">
            <div className="tools-bar-inner">
                {onOpenExternalGenerator && (
                    <button
                        type="button"
                        className="tools-bar-btn"
                        onClick={onOpenExternalGenerator}
                        title="Open External Generator"
                    >
                        External Generator
                    </button>
                )}
                {onImportSuperOffice && (
                    <button
                        type="button"
                        className="tools-bar-btn"
                        onClick={onImportSuperOffice}
                        title="Import SuperOffice ticket data from clipboard"
                    >
                        Import data from SO
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
        && prevProps.onImportSuperOffice === nextProps.onImportSuperOffice
        && prevProps.onManageTools === nextProps.onManageTools;
});
