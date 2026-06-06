import { useRef, useEffect, useCallback } from "react";

const TOOLBAR_ACTIONS = [
    { command: "bold", label: <strong>B</strong>, title: "Bold" },
    { command: "italic", label: <em>I</em>, title: "Italic" },
    { command: "underline", label: <u>U</u>, title: "Underline" },
    { type: "sep" },
    { command: "insertOrderedList", label: "1.", title: "Ordered list" },
    { command: "insertUnorderedList", label: "•", title: "Unordered list" },
    { type: "sep" },
    { command: "insertImageByUrl", label: "Img", title: "Insert image by URL" },
    { type: "sep" },
    { command: "removeFormat", label: "✕", title: "Clear formatting" },
];

export default function RichTextEditor({ value, onChange, placeholder, className = "" }) {
    const editorRef = useRef(null);
    const skipSync = useRef(false);

    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        if (skipSync.current) {
            skipSync.current = false;
            return;
        }
        if (el.innerHTML !== (value || "")) {
            el.innerHTML = value || "";
        }
    }, [value]);

    const handleInput = useCallback(() => {
        const el = editorRef.current;
        if (!el) return;
        skipSync.current = true;
        onChange?.(el.innerHTML);
    }, [onChange]);

    const insertImageByUrl = () => {
        editorRef.current?.focus();
        const url = window.prompt("Image URL");
        const trimmed = url?.trim();
        if (!trimmed) return;
        if (!/^https?:\/\//i.test(trimmed)) {
            window.alert("Use an http:// or https:// image URL.");
            return;
        }
        document.execCommand("insertImage", false, trimmed);
        handleInput();
    };

    const exec = (command) => {
        editorRef.current?.focus();
        if (command === "insertImageByUrl") {
            insertImageByUrl();
            return;
        }
        document.execCommand(command, false, null);
        handleInput();
    };

    return (
        <div className={`rich-editor ${className}`.trim()}>
            <div className="rich-editor__toolbar">
                {TOOLBAR_ACTIONS.map((action, idx) =>
                    action.type === "sep"
                        ? <span key={idx} className="rich-editor__sep" />
                        : (
                            <button
                                key={action.command}
                                type="button"
                                className="rich-editor__btn"
                                title={action.title}
                                onMouseDown={(e) => { e.preventDefault(); exec(action.command); }}
                            >
                                {action.label}
                            </button>
                        )
                )}
            </div>
            <div
                ref={editorRef}
                className="rich-editor__content"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                data-placeholder={placeholder}
            />
        </div>
    );
}
