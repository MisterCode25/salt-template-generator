import { memo, useRef, useEffect, useCallback, useMemo, useState } from "react";
import {
    formatRichTextForEditor,
    getCompletedSlashContext,
    getSlashContext,
    makeTokenChip,
    normalizePastedPlainText,
    normalizePastedRichTextHTML,
    serializeRichText,
    serializeRichTextPlain,
    slugifyTokenLabel,
    tokenName
} from "../utils/richTextTokens.js";

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

function normalizeTokenSearchValue(value = "") {
    return String(value || "").trim().toLowerCase();
}

function buildTokenSearchIndex(tokens = []) {
    const index = [];
    for (const item of tokens || []) {
        index.push({
            item,
            labelSearch: normalizeTokenSearchValue(item.label),
            tokenSearch: normalizeTokenSearchValue(item.token),
            tokenNameSearch: normalizeTokenSearchValue(tokenName(item.token))
        });
    }
    return index;
}

function buildTokenMatches(queryValue, tokenSearchIndex = []) {
    const query = queryValue.trim().toLowerCase();
    const matches = [];
    let hasExactMatch = false;

    for (const { item, labelSearch, tokenSearch, tokenNameSearch } of tokenSearchIndex) {
        if (!query || labelSearch.includes(query) || tokenSearch.includes(query)) {
            matches.push(item);
        }
        if (query && (labelSearch === query || tokenNameSearch === query)) {
            hasExactMatch = true;
        }
    }

    if (query && !hasExactMatch) {
        const label = queryValue.trim();
        matches.unshift({
            id: `create:${label}`,
            label: `+ Create and insert "${label}"`,
            token: `{${slugifyTokenLabel(label)}}`,
            createLabel: label
        });
    }

    return matches;
}

function getTokenCategory(tokenDef = {}) {
    if (tokenDef.createLabel) return { id: "create", title: "Create" };

    const token = String(tokenDef.token || "").toLowerCase();
    const label = String(tokenDef.label || "").toLowerCase();
    const key = String(tokenDef.key || "").toLowerCase();
    const haystack = `${token} ${label} ${key}`;

    if (
        haystack.includes("agent_")
        || haystack.includes("agent ")
        || haystack.includes("external_")
        || haystack.includes("external id")
        || haystack.includes("so_")
        || haystack.includes("superoffice")
        || haystack.includes("ticket")
    ) {
        return { id: "custom-data", title: "Custom Data" };
    }
    if (
        tokenDef.system
        || haystack.includes("client")
        || haystack.includes("customer")
        || haystack.includes("contractor")
        || haystack.includes("mobile")
        || haystack.includes("oto")
        || haystack.includes("port")
        || haystack.includes("activation")
    ) {
        return { id: "client", title: "Client Data" };
    }

    return { id: "custom-tokens", title: "Custom Tokens" };
}

function groupTokenMatches(matches = []) {
    const groups = [];
    const byId = new Map();
    const order = new Map([
        ["client", 0],
        ["custom-data", 1],
        ["custom-tokens", 2],
        ["create", 3]
    ]);

    matches.forEach((item, index) => {
        const category = getTokenCategory(item);
        if (!byId.has(category.id)) {
            const group = { ...category, items: [] };
            byId.set(category.id, group);
            groups.push(group);
        }
        byId.get(category.id).items.push({ item, index });
    });

    return groups.sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99));
}

function RichTextEditor({
    value,
    onChange,
    placeholder,
    className = "",
    tokens = [],
    onTokenCreate
}) {
    const editorRef = useRef(null);
    const menuRef = useRef(null);
    const skipSync = useRef(false);
    const slashRange = useRef(null);
    const [slashQuery, setSlashQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});
    const tokenSearchIndex = useMemo(() => buildTokenSearchIndex(tokens), [tokens]);

    const tokenMatches = useMemo(
        () => menuOpen ? buildTokenMatches(slashQuery, tokenSearchIndex) : [],
        [menuOpen, slashQuery, tokenSearchIndex]
    );
    const tokenMatchGroups = useMemo(() => groupTokenMatches(tokenMatches), [tokenMatches]);

    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        if (skipSync.current) {
            skipSync.current = false;
            return;
        }
        const nextHtml = formatRichTextForEditor(value || "", tokens);
        if (el.innerHTML !== nextHtml) {
            el.innerHTML = nextHtml;
        }
    }, [value, tokens]);

    const handleInput = useCallback(() => {
        const el = editorRef.current;
        if (!el) return;
        skipSync.current = true;
        onChange?.(serializeRichText(el));
    }, [onChange]);

    const closeMenu = useCallback(() => {
        slashRange.current = null;
        setSlashQuery("");
        setActiveIndex(0);
        setMenuOpen(false);
    }, []);

    const updateMenuPosition = useCallback(() => {
        const selection = window.getSelection();
        const editor = editorRef.current;
        const menu = menuRef.current;
        if (!selection?.rangeCount || !editor || !menu) return;

        const caretRange = selection.getRangeAt(0).cloneRange();
        caretRange.collapse(false);
        const caretRect = caretRange.getBoundingClientRect();
        const editorRect = editor.getBoundingClientRect();
        const shellRect = editor.parentElement.getBoundingClientRect();
        const baseRect = caretRect.width || caretRect.height ? caretRect : editorRect;
        const menuWidth = Math.min(340, shellRect.width - 36);
        const menuHeight = menu.offsetHeight || 220;
        const gap = 10;

        let left = baseRect.left - shellRect.left;
        left = Math.max(18, Math.min(left, shellRect.width - menuWidth - 18));

        let top = baseRect.bottom - shellRect.top + gap;
        const wouldOverflowEditor = top + menuHeight > editorRect.bottom - shellRect.top;
        if (wouldOverflowEditor && baseRect.top - shellRect.top > menuHeight + gap) {
            top = baseRect.top - shellRect.top - menuHeight - gap;
        }

        setMenuStyle({
            "--token-menu-left": `${left}px`,
            "--token-menu-top": `${top}px`
        });
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        updateMenuPosition();
    }, [menuOpen, slashQuery, activeIndex, updateMenuPosition]);

    const createTokenDefinition = useCallback(async (label) => {
        const normalizedLabel = label.trim();
        const token = `{${slugifyTokenLabel(normalizedLabel)}}`;
        const existing = (tokens || []).find((item) =>
            item.token === token
            || (item.label || "").toLowerCase() === normalizedLabel.toLowerCase()
        );
        if (existing) return existing;

        const nextToken = {
            id: crypto.randomUUID(),
            token,
            label: normalizedLabel,
            input_type: "text",
            display_mode: "on_demand"
        };
        if (onTokenCreate) {
            const created = await onTokenCreate(nextToken);
            return created || nextToken;
        }
        return nextToken;
    }, [onTokenCreate, tokens]);

    const getCurrentSlashRange = useCallback(() => {
        const editor = editorRef.current;
        if (editor) {
            const context = getSlashContext(editor);
            if (context?.range) return context.range;
        }
        return slashRange.current?.cloneRange() || null;
    }, []);

    const insertToken = useCallback(async (tokenDef) => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        const range = getCurrentSlashRange();
        if (!editor || !selection || !range) return;

        const resolvedToken = tokenDef.createLabel
            ? await createTokenDefinition(tokenDef.createLabel)
            : tokenDef;
        if (!resolvedToken?.token) return;

        range.deleteContents();
        const chip = makeTokenChip(document, resolvedToken.token, [resolvedToken, ...tokens]);
        const space = document.createTextNode(" ");
        range.insertNode(space);
        range.insertNode(chip);

        const nextRange = document.createRange();
        nextRange.setStartAfter(space);
        nextRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(nextRange);

        closeMenu();
        handleInput();
        editor.focus();
    }, [closeMenu, createTokenDefinition, getCurrentSlashRange, handleInput, tokens]);

    const handleEditorInput = useCallback(() => {
        const selection = window.getSelection();
        if (!selection?.rangeCount) {
            handleInput();
            return;
        }

        const editor = editorRef.current;
        const slashContext = editor ? getSlashContext(editor) : null;
        const completedSlashContext = !slashContext && editor ? getCompletedSlashContext(editor) : null;

        if (slashContext) {
            slashRange.current = slashContext.range;
            setSlashQuery(slashContext.query);
            setActiveIndex(0);
            setMenuOpen(true);
        } else if (completedSlashContext) {
            slashRange.current = completedSlashContext.range;
            const selected = buildTokenMatches(completedSlashContext.query, tokenSearchIndex)[0];
            if (selected) {
                insertToken(selected);
                return;
            }
        } else if (slashRange.current) {
            closeMenu();
        }

        handleInput();
    }, [closeMenu, handleInput, insertToken, tokenSearchIndex]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === " ") {
            const editor = editorRef.current;
            const context = editor ? getSlashContext(editor) : null;
            if (context?.query.trim()) {
                event.preventDefault();
                slashRange.current = context.range;
                const matches = buildTokenMatches(context.query, tokenSearchIndex);
                const selected = matches[Math.min(activeIndex, Math.max(matches.length - 1, 0))];
                if (selected) insertToken(selected);
                return;
            }
        }

        if (!menuOpen) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((current) => Math.min(current + 1, Math.max(tokenMatches.length - 1, 0)));
            return;
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, 0));
            return;
        }
        if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            const selected = tokenMatches[activeIndex];
            if (selected) insertToken(selected);
            return;
        }
        if (event.key === " " && slashQuery.trim()) {
            event.preventDefault();
            const selected = tokenMatches[activeIndex];
            if (selected) insertToken(selected);
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
        }
    }, [activeIndex, closeMenu, insertToken, menuOpen, slashQuery, tokenMatches, tokenSearchIndex]);

    const writeSelectionToClipboard = useCallback((event) => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        if (!editor || !selection?.rangeCount || selection.isCollapsed) return false;

        const range = selection.getRangeAt(0);
        if (!editor.contains(range.commonAncestorContainer)) return false;

        const fragment = range.cloneContents();
        const wrapper = document.createElement("div");
        wrapper.appendChild(fragment);

        event.preventDefault();
        event.clipboardData.setData("text/html", serializeRichText(wrapper));
        event.clipboardData.setData("text/plain", serializeRichTextPlain(wrapper));
        return true;
    }, []);

    const handleCopy = useCallback((event) => {
        writeSelectionToClipboard(event);
    }, [writeSelectionToClipboard]);

    const handleCut = useCallback((event) => {
        if (!writeSelectionToClipboard(event)) return;
        document.execCommand("delete", false, null);
        handleInput();
    }, [handleInput, writeSelectionToClipboard]);

    const handlePaste = useCallback((event) => {
        const editor = editorRef.current;
        if (!editor) return;

        const html = event.clipboardData?.getData("text/html") || "";
        const text = event.clipboardData?.getData("text/plain") || "";
        if (!html && !text) return;

        const nextHtml = html
            ? normalizePastedRichTextHTML(html, tokens)
            : normalizePastedPlainText(text, tokens);

        event.preventDefault();
        document.execCommand("insertHTML", false, nextHtml);
        closeMenu();
        handleInput();
    }, [closeMenu, handleInput, tokens]);

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
                onInput={handleEditorInput}
                onKeyDown={handleKeyDown}
                onCopy={handleCopy}
                onCut={handleCut}
                onPaste={handlePaste}
                data-placeholder={placeholder}
            />
            <div
                ref={menuRef}
                className={`rich-token-menu${menuOpen && tokenMatches.length > 0 ? " is-open" : ""}`}
                style={menuStyle}
            >
                <div className="rich-token-menu__title">
                    <span>{slashQuery.trim() ? `Token: @${slashQuery}` : "Choose or create a token"}</span>
                    <kbd>Space</kbd>
                </div>
                <div className="rich-token-menu__list">
                    {tokenMatchGroups.map((group) => (
                        <section key={group.id} className="rich-token-menu__group">
                            <h4>{group.title}</h4>
                            <div className="rich-token-menu__group-items">
                                {group.items.map(({ item, index }) => (
                                    <button
                                        key={item.id || item.token}
                                        type="button"
                                        className={`${index === activeIndex ? "is-active" : ""}${item.createLabel ? " create-token" : ""}`.trim()}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            insertToken(item);
                                        }}
                                    >
                                        <span>{item.label || tokenName(item.token)}</span>
                                        <small>{item.token}</small>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(RichTextEditor);
