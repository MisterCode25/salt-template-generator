import { Channel, CHANNEL_VALUES, normalizeNode, normalizeTemplate } from "../models/templateTreeModel.js";

const TEXT_FIELDS = ["text_fr", "text_en", "text_de", "text_it"];

const CHANNEL_META = {
    [Channel.EMAIL]: {
        title: "Email",
        icon: "mail",
        description: "Migrated email templates"
    },
    [Channel.SMS]: {
        title: "SMS",
        icon: "sms",
        description: "Migrated SMS templates"
    },
    [Channel.OTHER]: {
        title: "Other",
        icon: "document",
        description: "Migrated other templates"
    }
};

function asString(value) {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "";
}

function compactString(value) {
    return asString(value).trim();
}

function slugify(value) {
    const slug = compactString(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 72);
    return slug || "item";
}

function createUniqueId(prefix, source, usedIds) {
    const base = `${prefix}-${slugify(source)}`;
    let id = base;
    let index = 2;
    while (usedIds.has(id)) {
        id = `${base}-${index}`;
        index += 1;
    }
    usedIds.add(id);
    return id;
}

function firstString(...values) {
    return values.find((value) => typeof value === "string") || "";
}

function getLegacyText(source = {}, field) {
    const lang = field.slice(-2);
    const camelField = `text${lang.toUpperCase()}`;

    return firstString(
        source[field],
        source[camelField],
        source[`body_${lang}`],
        source[`content_${lang}`],
        source[`message_${lang}`],
        source[lang],
        source.texts?.[lang],
        source.contents?.[lang],
        source.messages?.[lang]
    );
}

function getTextSet(source = {}, fallback = null) {
    return TEXT_FIELDS.reduce((acc, field) => {
        const value = getLegacyText(source, field);
        acc[field] = value.trim() !== "" ? value : fallback ? getLegacyText(fallback, field) : "";
        return acc;
    }, {});
}

function resolveLegacyChannel(model = {}) {
    const raw = compactString(
        model.type
        || model.channel
        || model.category
        || (Array.isArray(model.channels) ? model.channels[0] : "")
    ).toLowerCase();
    const compact = raw.replace(/[\s_-]+/g, "");

    if (compact.includes("email") || compact.includes("mail")) return Channel.EMAIL;
    if (compact.includes("sms") || compact.includes("textmessage") || compact === "text") return Channel.SMS;
    if (compact.includes("other") || compact.includes("note") || compact.includes("custom")) return Channel.OTHER;
    if (CHANNEL_VALUES.includes(raw)) return raw;
    return Channel.OTHER;
}

function normalizeLegacyVariants(variants) {
    if (Array.isArray(variants)) {
        return variants.filter((variant) => variant && typeof variant === "object");
    }

    if (variants && typeof variants === "object") {
        return Object.entries(variants).map(([name, variant]) => (
            variant && typeof variant === "object"
                ? { name, ...variant }
                : { name, text_fr: asString(variant) }
        ));
    }

    return [];
}

function createMigratedVariant(variant, index, usedVariantIds) {
    const rawId = compactString(variant.id);
    const baseId = rawId || slugify(variant.name || variant.title || variant.label || `variant-${index + 1}`);
    let id = baseId;
    let suffix = 2;
    while (usedVariantIds.has(id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
    }
    usedVariantIds.add(id);

    return {
        id,
        name: compactString(variant.name || variant.title || variant.label) || `Variant ${index + 1}`,
        ...getTextSet(variant)
    };
}

function createChannelContent(templateId, title, channel, source, variants = []) {
    return {
        id: `${templateId}-content`,
        title,
        type: channel,
        mainVariantName: compactString(source.mainVariantName || source.main_variant_name),
        ...getTextSet(source),
        variants
    };
}

function createMigratedTemplate({ id, nodeId, title, description, order, channel, source, variants, sourceModelId, favorite }) {
    return normalizeTemplate({
        id,
        nodeIds: [nodeId],
        title,
        description,
        channels: [channel],
        order,
        sourceModelId,
        favorite,
        contentByChannel: {
            [channel]: createChannelContent(id, title, channel, source, variants)
        }
    });
}

export function migrateLegacyModelsToTemplateTree(legacyModels = []) {
    const validModels = Array.isArray(legacyModels)
        ? legacyModels.filter((model) => model && typeof model === "object")
        : [];

    if (validModels.length === 0) {
        return { nodes: [], templates: [] };
    }

    const usedNodeIds = new Set();
    const usedTemplateIds = new Set();
    const childOrderByChannel = new Map(CHANNEL_VALUES.map((channel) => [channel, 0]));
    const templates = [];

    const nodes = CHANNEL_VALUES.map((channel, index) => {
        const meta = CHANNEL_META[channel];
        const id = `legacy-channel-${channel}`;
        usedNodeIds.add(id);
        return normalizeNode({
            id,
            parentId: null,
            title: meta.title,
            description: meta.description,
            icon: meta.icon,
            order: index + 1
        });
    });

    validModels.forEach((model, modelIndex) => {
        const channel = resolveLegacyChannel(model);
        const meta = CHANNEL_META[channel];
        const sourceModelId = compactString(model.id);
        const modelTitle = compactString(model.title || model.name || model.label) || `Legacy template ${modelIndex + 1}`;
        const modelKey = sourceModelId || `${channel}-${modelIndex + 1}-${modelTitle}`;
        const parentNodeId = `legacy-channel-${channel}`;
        const nodeOrder = (childOrderByChannel.get(channel) || 0) + 1;
        childOrderByChannel.set(channel, nodeOrder);

        const groupNodeId = createUniqueId("legacy-node", `${channel}-${modelKey}`, usedNodeIds);
        nodes.push(normalizeNode({
            id: groupNodeId,
            parentId: parentNodeId,
            title: modelTitle,
            description: compactString(model.description),
            icon: meta.icon,
            order: nodeOrder
        }));

        const usedVariantIds = new Set();
        const variants = normalizeLegacyVariants(model.variants).map((variant, variantIndex) => {
            return createMigratedVariant(variant, variantIndex, usedVariantIds);
        });
        const templateId = createUniqueId("legacy-template", `${channel}-${modelKey}`, usedTemplateIds);
        templates.push(createMigratedTemplate({
            id: templateId,
            nodeId: groupNodeId,
            title: modelTitle,
            description: compactString(model.description),
            order: 1,
            channel,
            source: model,
            variants,
            sourceModelId,
            favorite: Boolean(model.favorite)
        }));
    });

    return { nodes, templates };
}
