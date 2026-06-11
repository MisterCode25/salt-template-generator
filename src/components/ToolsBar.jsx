import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Settings2 } from "lucide-react";
import { loadTools, resolveToolUrl } from "../services/toolsService.js";

export default function ToolsBar({ values = {}, onOpenExternalGenerator, onManageTools }) {
    const navigate = useNavigate();
    const [tools, setTools] = useState([]);

    const reload = () => loadTools().then(setTools);

    useEffect(() => {
        reload();
        const handler = () => reload();
        window.addEventListener("tools-updated", handler);
        return () => window.removeEventListener("tools-updated", handler);
    }, []);

    if (tools.length === 0 && !onOpenExternalGenerator) return null;

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
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        type="button"
                        className="tools-bar-btn"
                        title={tool.url || tool.title}
                        onClick={() => {
                            const url = resolveToolUrl(tool.url, values);
                            window.open(url, "_blank", "noopener,noreferrer");
                        }}
                    >
                        {tool.title}
                        <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
                    </button>
                ))}
            </div>
            <button
                type="button"
                className="tools-bar-manage-btn"
                onClick={() => {
                    if (onManageTools) {
                        onManageTools();
                        return;
                    }
                    navigate("/tools");
                }}
                title="Manage tools"
                aria-label="Manage tools"
            >
                <Settings2 size={15} strokeWidth={1.9} />
            </button>
        </div>
    );
}
