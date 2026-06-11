const TOKEN_PATTERN = /\{[^{}]+\}/g;
const CARET_BOUNDARY = "\u200B";

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function tokenName(token = "") {
    return String(token)
        .replace(/[{}]/g, "")
        .replace(/[_-]+/g, " ")
        .trim();
}

function buildTokenLabelLookup(tokens = []) {
    return new Map(
        (tokens || [])
            .filter((item) => item?.token)
            .map((item) => [item.token, item.label])
    );
}

function tokenLabel(token, tokenLabels = new Map()) {
    return tokenLabels.get(token) || tokenName(token) || token;
}

export function slugifyTokenLabel(label = "") {
    return String(label)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

export function makeTokenChip(documentRef, token, tokensOrLabels = []) {
    const tokenLabels = tokensOrLabels instanceof Map
        ? tokensOrLabels
        : buildTokenLabelLookup(tokensOrLabels);
    const chip = documentRef.createElement("span");
    chip.className = "rich-token-chip";
    chip.contentEditable = "false";
    chip.dataset.token = token;
    chip.dataset.label = tokenLabel(token, tokenLabels);
    chip.textContent = chip.dataset.label;
    return chip;
}

function textNodeWalker(root) {
    const showText = root.ownerDocument.defaultView?.NodeFilter?.SHOW_TEXT ?? 4;
    return root.ownerDocument.createTreeWalker(root, showText);
}

function replaceTokensInTextNode(textNode, tokenLabels) {
    const text = textNode.nodeValue || "";
    TOKEN_PATTERN.lastIndex = 0;
    if (!TOKEN_PATTERN.test(text)) return;
    TOKEN_PATTERN.lastIndex = 0;

    const fragment = textNode.ownerDocument.createDocumentFragment();
    let cursor = 0;
    let match;
    while ((match = TOKEN_PATTERN.exec(text)) !== null) {
        const before = text.slice(cursor, match.index);
        if (before) fragment.appendChild(textNode.ownerDocument.createTextNode(before));
        fragment.appendChild(makeTokenChip(textNode.ownerDocument, match[0], tokenLabels));
        fragment.appendChild(textNode.ownerDocument.createTextNode(CARET_BOUNDARY));
        cursor = match.index + match[0].length;
    }
    const after = text.slice(cursor);
    if (after) fragment.appendChild(textNode.ownerDocument.createTextNode(after));
    textNode.replaceWith(fragment);
}

function decorateTokens(root, tokens = []) {
    const tokenLabels = buildTokenLabelLookup(tokens);
    const walker = textNodeWalker(root);
    const nodes = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest(".rich-token-chip")) continue;
        nodes.push(node);
    }
    nodes.forEach((node) => replaceTokensInTextNode(node, tokenLabels));
}

export function formatRichTextForEditor(value = "", tokens = []) {
    if (typeof document === "undefined") return value || "";
    const template = document.createElement("template");
    template.innerHTML = value || "";
    decorateTokens(template.content, tokens);
    return template.innerHTML;
}

export function formatTokenPreviewHTML(value = "", tokens = []) {
    const formatted = formatRichTextForEditor(value, tokens);
    return formatted || escapeHtml("");
}

function cloneWithSerializedTokens(root) {
    const clone = root.cloneNode(true);
    clone.querySelectorAll(".rich-token-chip").forEach((chip) => {
        chip.replaceWith(clone.ownerDocument.createTextNode(chip.dataset.token || ""));
    });
    return clone;
}

export function serializeRichText(root) {
    return cloneWithSerializedTokens(root).innerHTML.replaceAll(CARET_BOUNDARY, "");
}

export function serializeRichTextPlain(root) {
    return cloneWithSerializedTokens(root).textContent.replaceAll(CARET_BOUNDARY, "");
}

export function normalizePastedRichTextHTML(value = "", tokens = []) {
    if (typeof document === "undefined") return value || "";
    const template = document.createElement("template");
    template.innerHTML = value || "";
    template.content.querySelectorAll("script, style, link, meta").forEach((node) => node.remove());
    template.content.querySelectorAll(".rich-token-chip").forEach((chip) => {
        chip.replaceWith(document.createTextNode(chip.dataset.token || chip.textContent || ""));
    });
    return formatRichTextForEditor(template.innerHTML, tokens);
}

export function normalizePastedPlainText(value = "", tokens = []) {
    const html = escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");
    return formatRichTextForEditor(html, tokens);
}

function getTextNodes(root) {
    const walker = textNodeWalker(root);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
}

function getCaretTextOffset(root) {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !root.contains(selection.anchorNode)) return null;

    const range = selection.getRangeAt(0).cloneRange();
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(root);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

function rangeFromTextOffsets(root, startOffset, endOffset) {
    const range = root.ownerDocument.createRange();
    const textNodes = getTextNodes(root);
    let current = 0;
    let started = false;

    for (const node of textNodes) {
        const next = current + (node.nodeValue || "").length;
        if (!started && startOffset >= current && startOffset <= next) {
            range.setStart(node, startOffset - current);
            started = true;
        }
        if (started && endOffset >= current && endOffset <= next) {
            range.setEnd(node, endOffset - current);
            return range;
        }
        current = next;
    }

    return null;
}

export function getSlashContext(root) {
    const offset = getCaretTextOffset(root);
    if (offset === null) return null;

    const beforeCaret = root.textContent.slice(0, offset);
    const slashMatch = beforeCaret.match(/@([a-zA-Z0-9 _-]*)$/);
    if (!slashMatch) return null;

    const raw = slashMatch[0];
    const range = rangeFromTextOffsets(root, offset - raw.length, offset);
    if (!range) return null;

    return {
        query: slashMatch[1] || "",
        range
    };
}

export function getCompletedSlashContext(root) {
    const offset = getCaretTextOffset(root);
    if (offset === null) return null;

    const beforeCaret = root.textContent.slice(0, offset);
    const slashMatch = beforeCaret.match(/@([a-zA-Z0-9 _-]+)[\s\u00a0]$/);
    if (!slashMatch) return null;

    const raw = slashMatch[0];
    const query = (slashMatch[1] || "").trim();
    if (!query) return null;

    const range = rangeFromTextOffsets(root, offset - raw.length, offset);
    if (!range) return null;

    return {
        query,
        range
    };
}
