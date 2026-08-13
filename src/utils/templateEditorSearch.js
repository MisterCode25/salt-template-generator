function normalizeSearchText(value = "") {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function collectSearchableStrings(value, strings) {
    if (typeof value === "string") {
        strings.push(value);
        return;
    }
    if (Array.isArray(value)) {
        value.forEach((entry) => collectSearchableStrings(entry, strings));
        return;
    }
    if (!value || typeof value !== "object") return;
    Object.values(value).forEach((entry) => collectSearchableStrings(entry, strings));
}

export function buildTemplateEditorSearchText(template = {}) {
    const strings = [template.title, template.description];
    collectSearchableStrings(template.contentByChannel, strings);
    return normalizeSearchText(strings.filter(Boolean).join(" "));
}

export function filterTemplateEditorTree(nodes = [], templates = [], query = "") {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
        return { nodes, templates, matchCount: templates.length };
    }

    const matchingTemplates = templates.filter((template) => (
        buildTemplateEditorSearchText(template).includes(normalizedQuery)
    ));
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const visibleNodeIds = new Set();

    matchingTemplates.forEach((template) => {
        (template.nodeIds || []).forEach((nodeId) => {
            let currentNode = nodeById.get(nodeId);
            while (currentNode && !visibleNodeIds.has(currentNode.id)) {
                visibleNodeIds.add(currentNode.id);
                currentNode = currentNode.parentId ? nodeById.get(currentNode.parentId) : null;
            }
        });
    });

    return {
        nodes: nodes.filter((node) => visibleNodeIds.has(node.id)),
        templates: matchingTemplates,
        matchCount: matchingTemplates.length
    };
}
