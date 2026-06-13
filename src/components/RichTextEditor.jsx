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
import { createTemplateImageMarkup, stripImagesFromHtml } from "../utils/templateImages.js";
import { hydrateStoredTemplateImageElements, saveTemplateImageFile } from "../services/templateImageService.js";

const MIN_IMAGE_DIMENSION = 16;
const MAX_IMAGE_DIMENSION = 4000;

const TOOLBAR_ACTIONS = [
    { command: "bold", label: <strong>B</strong>, title: "Bold" },
    { command: "italic", label: <em>I</em>, title: "Italic" },
    { command: "underline", label: <u>U</u>, title: "Underline" },
    { type: "sep" },
    { command: "insertOrderedList", label: "1.", title: "Ordered list" },
    { command: "insertUnorderedList", label: "•", title: "Unordered list" },
    { type: "sep" },
    { command: "insertImage", label: "Img", title: "Insert image" },
    { type: "sep" },
    { command: "removeFormat", label: "✕", title: "Clear formatting" },
];

function getToolbarActions({ allowImages = true } = {}) {
    const actions = TOOLBAR_ACTIONS.filter((action) => allowImages || action.command !== "insertImage");
    return actions.filter((action, index, list) => {
        if (action.type !== "sep") return true;
        const previous = list[index - 1];
        const next = list[index + 1];
        return previous && next && previous.type !== "sep" && next.type !== "sep";
    });
}

function normalizeTokenSearchValue(value = "") {
    return String(value || "").trim().toLowerCase();
}

function buildTokenSearchIndex(tokens = []) {
    const index = [];
    for (const item of tokens || []) {
        const aliases = [
            item.key,
            ...(Array.isArray(item.aliases) ? item.aliases : []),
            ...(Array.isArray(item.searchAliases) ? item.searchAliases : [])
        ];
        index.push({
            item,
            labelSearch: normalizeTokenSearchValue([item.label, ...aliases].filter(Boolean).join(" ")),
            tokenSearch: normalizeTokenSearchValue(item.token),
            tokenNameSearch: normalizeTokenSearchValue(tokenName(item.token)),
            exactSearchValues: [
                item.label,
                item.token,
                tokenName(item.token),
                ...aliases
            ].map(normalizeTokenSearchValue).filter(Boolean)
        });
    }
    return index;
}

function buildTokenMatches(queryValue, tokenSearchIndex = []) {
    const query = queryValue.trim().toLowerCase();
    const matches = [];
    let hasExactMatch = false;

    for (const { item, labelSearch, tokenSearch, tokenNameSearch, exactSearchValues } of tokenSearchIndex) {
        if (!query || labelSearch.includes(query) || tokenSearch.includes(query)) {
            matches.push(item);
        }
        if (query && (tokenNameSearch === query || exactSearchValues.includes(query))) {
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

function getTokenPreviewValue(tokenDef = {}) {
    const value = tokenDef.previewValue ?? tokenDef.currentValue;
    if (value === null || value === undefined) return "";
    const text = String(value).replace(/\s+/g, " ").trim();
    if (!text) return "";
    return text.length > 90 ? `${text.slice(0, 87)}...` : text;
}

function parseImageDimension(value) {
    if (value === null || value === undefined || value === "") return null;
    const numeric = Number.parseInt(String(value).replace(/[^\d.]/g, ""), 10);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function clampImageDimension(value) {
    const numeric = parseImageDimension(value);
    if (!numeric) return null;
    return Math.min(Math.max(numeric, MIN_IMAGE_DIMENSION), MAX_IMAGE_DIMENSION);
}

function getImageDisplayDimensions(image) {
    const rect = image.getBoundingClientRect();
    const width = parseImageDimension(image.style.width)
        || parseImageDimension(image.getAttribute("width"))
        || Math.round(rect.width)
        || image.naturalWidth
        || MIN_IMAGE_DIMENSION;
    const height = parseImageDimension(image.style.height)
        || parseImageDimension(image.getAttribute("height"))
        || Math.round(rect.height)
        || image.naturalHeight
        || MIN_IMAGE_DIMENSION;
    const originalWidth = image.naturalWidth || parseImageDimension(image.getAttribute("width")) || width;
    const originalHeight = image.naturalHeight || parseImageDimension(image.getAttribute("height")) || height;

    return {
        width: clampImageDimension(width) || MIN_IMAGE_DIMENSION,
        height: clampImageDimension(height) || MIN_IMAGE_DIMENSION,
        originalWidth: clampImageDimension(originalWidth) || width,
        originalHeight: clampImageDimension(originalHeight) || height
    };
}

function buildImageResizeState(image) {
    const dimensions = getImageDisplayDimensions(image);
    const ratio = dimensions.originalWidth > 0 && dimensions.originalHeight > 0
        ? dimensions.originalWidth / dimensions.originalHeight
        : dimensions.width / Math.max(dimensions.height, 1);

    return {
        width: String(dimensions.width),
        height: String(dimensions.height),
        originalWidth: dimensions.originalWidth,
        originalHeight: dimensions.originalHeight,
        aspectRatio: Number.isFinite(ratio) && ratio > 0 ? ratio : 1,
        lockAspectRatio: image.style.height ? image.style.height === "auto" : true,
        name: image.getAttribute("data-template-image-name") || image.getAttribute("alt") || "Image"
    };
}

function nextHeightForWidth(width, aspectRatio) {
    return String(clampImageDimension(Math.round(width / Math.max(aspectRatio, 0.01))) || MIN_IMAGE_DIMENSION);
}

function nextWidthForHeight(height, aspectRatio) {
    return String(clampImageDimension(Math.round(height * Math.max(aspectRatio, 0.01))) || MIN_IMAGE_DIMENSION);
}

function RichTextEditor({
    value,
    onChange,
    placeholder,
    className = "",
    tokens = [],
    onTokenCreate,
    allowImages = true
}) {
    const editorRef = useRef(null);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);
    const savedSelectionRange = useRef(null);
    const imageResizeTargetRef = useRef(null);
    const skipSync = useRef(false);
    const slashRange = useRef(null);
    const [slashQuery, setSlashQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});
    const [imageResize, setImageResize] = useState(null);
    const tokenSearchIndex = useMemo(() => buildTokenSearchIndex(tokens), [tokens]);
    const toolbarActions = useMemo(() => getToolbarActions({ allowImages }), [allowImages]);

    const tokenMatches = useMemo(
        () => menuOpen ? buildTokenMatches(slashQuery, tokenSearchIndex) : [],
        [menuOpen, slashQuery, tokenSearchIndex]
    );
    const tokenMatchGroups = useMemo(() => groupTokenMatches(tokenMatches), [tokenMatches]);

    const hydrateImages = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        hydrateStoredTemplateImageElements(editor).catch((error) => {
            console.error("Unable to hydrate template images", error);
        });
    }, []);

    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        if (skipSync.current) {
            skipSync.current = false;
            hydrateImages();
            return;
        }
        const sourceValue = value || "";
        const editorValue = allowImages ? sourceValue : stripImagesFromHtml(sourceValue);
        const nextHtml = formatRichTextForEditor(editorValue, tokens);
        if (el.innerHTML !== nextHtml) {
            el.innerHTML = nextHtml;
        }
        hydrateImages();
        if (!allowImages && editorValue !== sourceValue) {
            onChange?.(editorValue);
        }
    }, [allowImages, hydrateImages, onChange, value, tokens]);

    const handleInput = useCallback(() => {
        const el = editorRef.current;
        if (!el) return;
        skipSync.current = true;
        const html = serializeRichText(el);
        onChange?.(allowImages ? html : stripImagesFromHtml(html));
    }, [allowImages, onChange]);

    const closeMenu = useCallback(() => {
        slashRange.current = null;
        setSlashQuery("");
        setActiveIndex(0);
        setMenuOpen(false);
    }, []);

    const closeImageResize = useCallback(() => {
        imageResizeTargetRef.current = null;
        setImageResize(null);
    }, []);

    const saveSelectionRange = useCallback(() => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        if (!editor || !selection?.rangeCount) return;
        const range = selection.getRangeAt(0);
        if (!editor.contains(range.commonAncestorContainer)) return;
        savedSelectionRange.current = range.cloneRange();
    }, []);

    const restoreSelectionRange = useCallback(() => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        const range = savedSelectionRange.current;
        if (!editor || !selection || !range) {
            editor?.focus();
            return false;
        }
        editor.focus();
        selection.removeAllRanges();
        selection.addRange(range);
        savedSelectionRange.current = null;
        return true;
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

    useEffect(() => {
        if (!imageResize) return;
        const handleWindowKeyDown = (event) => {
            if (event.key === "Escape") closeImageResize();
        };
        window.addEventListener("keydown", handleWindowKeyDown);
        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [closeImageResize, imageResize]);

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

    const openImageResize = useCallback((image) => {
        if (!allowImages) return;
        imageResizeTargetRef.current = image;
        setImageResize(buildImageResizeState(image));
        closeMenu();
    }, [allowImages, closeMenu]);

    const handleEditorDoubleClick = useCallback((event) => {
        if (!allowImages) return;
        const editor = editorRef.current;
        const image = event.target?.closest?.("img");
        if (!editor || !image || !editor.contains(image)) return;

        event.preventDefault();
        openImageResize(image);
    }, [allowImages, openImageResize]);

    const updateImageResizeWidth = useCallback((event) => {
        const widthValue = event.target.value;
        setImageResize((current) => {
            if (!current) return current;
            const width = clampImageDimension(widthValue);
            return {
                ...current,
                width: widthValue,
                height: current.lockAspectRatio && width
                    ? nextHeightForWidth(width, current.aspectRatio)
                    : current.height
            };
        });
    }, []);

    const updateImageResizeHeight = useCallback((event) => {
        const heightValue = event.target.value;
        setImageResize((current) => {
            if (!current) return current;
            const height = clampImageDimension(heightValue);
            return {
                ...current,
                width: current.lockAspectRatio && height
                    ? nextWidthForHeight(height, current.aspectRatio)
                    : current.width,
                height: heightValue
            };
        });
    }, []);

    const toggleImageAspectRatio = useCallback((event) => {
        const checked = event.target.checked;
        setImageResize((current) => {
            if (!current) return current;
            const width = clampImageDimension(current.width);
            return {
                ...current,
                lockAspectRatio: checked,
                height: checked && width
                    ? nextHeightForWidth(width, current.aspectRatio)
                    : current.height
            };
        });
    }, []);

    const resetImageResizeToOriginal = useCallback(() => {
        setImageResize((current) => {
            if (!current) return current;
            return {
                ...current,
                width: String(current.originalWidth),
                height: String(current.originalHeight)
            };
        });
    }, []);

    const applyImageResize = useCallback((event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        const image = imageResizeTargetRef.current;
        const editor = editorRef.current;
        if (!imageResize || !image || !editor?.contains(image)) {
            closeImageResize();
            return;
        }

        const width = clampImageDimension(imageResize.width);
        const height = clampImageDimension(imageResize.height);
        if (!width || !height) return;

        image.setAttribute("width", String(width));
        image.setAttribute("height", String(height));
        image.style.width = `${width}px`;
        image.style.maxWidth = "100%";
        image.style.height = imageResize.lockAspectRatio ? "auto" : `${height}px`;
        image.style.objectFit = imageResize.lockAspectRatio ? "" : "fill";
        image.classList.add("template-image");

        handleInput();
        closeImageResize();
    }, [closeImageResize, handleInput, imageResize]);

    const insertTemplateImage = useCallback((imageRecord) => {
        if (!allowImages) return;
        const html = createTemplateImageMarkup(imageRecord, { includeSrc: true });
        if (!html) return;

        restoreSelectionRange();
        const editor = editorRef.current;
        const selection = window.getSelection();
        if (!editor || !selection) return;
        editor.focus();

        const range = selection.rangeCount ? selection.getRangeAt(0) : null;
        if (!range || !editor.contains(range.commonAncestorContainer)) {
            editor.insertAdjacentHTML("beforeend", `${html} `);
        } else {
            const template = document.createElement("template");
            template.innerHTML = html;
            const image = template.content.firstElementChild;
            if (!image) return;

            const fragment = document.createDocumentFragment();
            const trailingSpace = document.createTextNode(" ");
            fragment.appendChild(image);
            fragment.appendChild(trailingSpace);
            range.deleteContents();
            range.insertNode(fragment);

            const nextRange = document.createRange();
            nextRange.setStartAfter(trailingSpace);
            nextRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(nextRange);
        }
        closeMenu();
        handleInput();
        hydrateImages();
    }, [allowImages, closeMenu, handleInput, hydrateImages, restoreSelectionRange]);

    const insertImageFiles = useCallback(async (files = []) => {
        if (!allowImages) return false;
        const imageFiles = Array.from(files).filter((file) => file?.type?.startsWith("image/"));
        if (imageFiles.length === 0) return false;

        for (const file of imageFiles) {
            try {
                const imageRecord = await saveTemplateImageFile(file);
                insertTemplateImage(imageRecord);
            } catch (error) {
                console.error("Template image import failed", error);
                window.alert(error?.message || "Image import failed.");
            }
        }
        return true;
    }, [allowImages, insertTemplateImage]);

    const getPastedImageFiles = useCallback((clipboardData) => {
        const files = [];
        if (clipboardData?.items?.length) {
            Array.from(clipboardData.items).forEach((item) => {
                if (item.kind === "file" && item.type?.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) files.push(file);
                }
            });
        }
        if (files.length === 0 && clipboardData?.files?.length) {
            Array.from(clipboardData.files).forEach((file) => {
                if (file?.type?.startsWith("image/")) files.push(file);
            });
        }
        return files;
    }, []);

    const handlePaste = useCallback((event) => {
        const editor = editorRef.current;
        if (!editor) return;

        const pastedImageFiles = getPastedImageFiles(event.clipboardData);
        if (pastedImageFiles.length > 0) {
            event.preventDefault();
            if (!allowImages) return;
            saveSelectionRange();
            insertImageFiles(pastedImageFiles);
            return;
        }

        const html = event.clipboardData?.getData("text/html") || "";
        const text = event.clipboardData?.getData("text/plain") || "";
        if (!html && !text) return;

        const nextHtml = html
            ? normalizePastedRichTextHTML(allowImages ? html : stripImagesFromHtml(html), tokens)
            : normalizePastedPlainText(text, tokens);

        event.preventDefault();
        document.execCommand("insertHTML", false, nextHtml);
        closeMenu();
        handleInput();
        hydrateImages();
    }, [allowImages, closeMenu, getPastedImageFiles, handleInput, hydrateImages, insertImageFiles, saveSelectionRange, tokens]);

    const openImagePicker = () => {
        if (!allowImages) return;
        saveSelectionRange();
        fileInputRef.current?.click();
    };

    const handleImageInputChange = (event) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        event.target.value = "";
        if (!allowImages) return;
        insertImageFiles(files);
    };

    const exec = (command) => {
        editorRef.current?.focus();
        if (command === "insertImage") {
            if (!allowImages) return;
            openImagePicker();
            return;
        }
        document.execCommand(command, false, null);
        handleInput();
    };

    return (
        <div className={`rich-editor ${className}`.trim()}>
            {allowImages && (
                <input
                    ref={fileInputRef}
                    className="rich-editor__file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageInputChange}
                    tabIndex={-1}
                />
            )}
            <div className="rich-editor__toolbar">
                {toolbarActions.map((action, idx) =>
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
                onDoubleClick={handleEditorDoubleClick}
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
                                {group.items.map(({ item, index }) => {
                                    const label = item.label || tokenName(item.token);
                                    const previewValue = getTokenPreviewValue(item);

                                    return (
                                        <button
                                            key={item.id || item.token}
                                            type="button"
                                            className={`${index === activeIndex ? "is-active" : ""}${item.createLabel ? " create-token" : ""}`.trim()}
                                            title={previewValue ? `${label}: ${previewValue}` : undefined}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseDown={(event) => {
                                                event.preventDefault();
                                                insertToken(item);
                                            }}
                                        >
                                            <span className="rich-token-menu__option-main">
                                                <span className="rich-token-menu__option-label">{label}</span>
                                                {previewValue ? (
                                                    <small className="rich-token-menu__preview">{previewValue}</small>
                                                ) : null}
                                            </span>
                                            <small className="rich-token-menu__token-value">{item.token}</small>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
            {imageResize && (
                <div
                    className="rich-image-resize"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Resize image"
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeImageResize();
                    }}
                >
                    <div
                        className="rich-image-resize__dialog"
                        role="document"
                        onKeyDown={(event) => {
                            if (event.key === "Enter") applyImageResize(event);
                        }}
                    >
                        <div className="rich-image-resize__header">
                            <div>
                                <p>Image</p>
                                <h3>{imageResize.name}</h3>
                            </div>
                            <button type="button" className="rich-image-resize__close" onClick={closeImageResize}>×</button>
                        </div>
                        <div className="rich-image-resize__fields">
                            <label>
                                <span>Width</span>
                                <input
                                    type="number"
                                    min={MIN_IMAGE_DIMENSION}
                                    max={MAX_IMAGE_DIMENSION}
                                    value={imageResize.width}
                                    onChange={updateImageResizeWidth}
                                    autoFocus
                                />
                            </label>
                            <label>
                                <span>Height</span>
                                <input
                                    type="number"
                                    min={MIN_IMAGE_DIMENSION}
                                    max={MAX_IMAGE_DIMENSION}
                                    value={imageResize.height}
                                    onChange={updateImageResizeHeight}
                                />
                            </label>
                        </div>
                        <label className="rich-image-resize__lock">
                            <input
                                type="checkbox"
                                checked={imageResize.lockAspectRatio}
                                onChange={toggleImageAspectRatio}
                            />
                            <span>Keep proportions</span>
                        </label>
                        <div className="rich-image-resize__actions">
                            <button type="button" className="secondary-btn" onClick={resetImageResizeToOriginal}>Original</button>
                            <button type="button" className="secondary-btn" onClick={closeImageResize}>Cancel</button>
                            <button type="button" className="primary-btn" onClick={applyImageResize}>Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(RichTextEditor);
