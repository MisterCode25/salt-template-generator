export const Channel = Object.freeze({
    EMAIL: "email",
    SMS: "sms",
    OTHER: "other"
});

export const CHANNEL_VALUES = Object.freeze([
    Channel.EMAIL,
    Channel.SMS,
    Channel.OTHER
]);

const CHANNEL_SET = new Set(CHANNEL_VALUES);

function createId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeText(value) {
    return typeof value === "string" ? value : "";
}

function normalizeNullableId(value) {
    return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeOrder(value) {
    return Number.isFinite(value) ? value : 0;
}

/**
 * @typedef {"email" | "sms" | "other"} TemplateChannel
 *
 * @typedef {Object} TemplateNode
 * @property {string} id
 * @property {string | null} parentId
 * @property {string} title
 * @property {string} description
 * @property {string} icon
 * @property {number} order
 *
 * @typedef {Object} NodeTemplate
 * @property {string} id
 * @property {string | null} parentNodeId
 * @property {string} title
 * @property {string} description
 * @property {TemplateChannel[]} channels
 * @property {Partial<Record<TemplateChannel, ChannelTemplateContent>>} contentByChannel
 *
 * @typedef {Object} ChannelTemplateContent
 * @property {string} id
 * @property {string} title
 * @property {TemplateChannel} type
 * @property {string} mainVariantName
 * @property {string} text_fr
 * @property {string} text_en
 * @property {string} text_de
 * @property {string} text_it
 * @property {Array<Object>} variants
 */

export function isChannel(value) {
    return CHANNEL_SET.has(value);
}

export function normalizeChannels(channels = []) {
    const list = Array.isArray(channels) ? channels : [channels];
    return [...new Set(list.filter(isChannel))];
}

export function createNode(fields = {}) {
    return normalizeNode({
        id: createId(),
        ...fields
    });
}

export function normalizeNode(node = {}) {
    return {
        id: normalizeText(node.id) || createId(),
        parentId: normalizeNullableId(node.parentId),
        title: normalizeText(node.title),
        description: normalizeText(node.description),
        icon: normalizeText(node.icon),
        order: normalizeOrder(node.order)
    };
}

export function createTemplate(fields = {}) {
    return normalizeTemplate({
        id: createId(),
        ...fields
    });
}

export function normalizeTemplateVariant(variant = {}) {
    return {
        ...variant,
        id: normalizeText(variant.id) || createId(),
        name: normalizeText(variant.name),
        text_fr: normalizeText(variant.text_fr),
        text_en: normalizeText(variant.text_en),
        text_de: normalizeText(variant.text_de),
        text_it: normalizeText(variant.text_it)
    };
}

export function normalizeChannelContent(content = {}, channel, fallbackTitle = "") {
    return {
        ...content,
        id: normalizeText(content.id) || createId(),
        title: normalizeText(content.title) || fallbackTitle,
        type: isChannel(content.type) ? content.type : channel,
        mainVariantName: normalizeText(content.mainVariantName),
        text_fr: normalizeText(content.text_fr),
        text_en: normalizeText(content.text_en),
        text_de: normalizeText(content.text_de),
        text_it: normalizeText(content.text_it),
        variants: Array.isArray(content.variants)
            ? content.variants.map(normalizeTemplateVariant)
            : []
    };
}

export function createEmptyChannelContent(channel, title = "") {
    return normalizeChannelContent({
        id: createId(),
        title,
        type: channel,
        mainVariantName: "",
        text_fr: "",
        text_en: "",
        text_de: "",
        text_it: "",
        variants: []
    }, channel, title);
}

export function normalizeTemplate(template = {}) {
    const channels = normalizeChannels(template.channels);
    const contentByChannel = {};
    const rawContent = template.contentByChannel || {};

    CHANNEL_VALUES.forEach((channel) => {
        if (rawContent[channel] && typeof rawContent[channel] === "object") {
            contentByChannel[channel] = normalizeChannelContent(rawContent[channel], channel, normalizeText(template.title));
        } else if (channels.includes(channel)) {
            contentByChannel[channel] = createEmptyChannelContent(channel, normalizeText(template.title));
        }
    });

    // Migrate from legacy parentNodeId to nodeIds array
    let nodeIds;
    if (Array.isArray(template.nodeIds)) {
        nodeIds = [...new Set(template.nodeIds.filter((id) => typeof id === "string" && id.length > 0))];
    } else if (typeof template.parentNodeId === "string" && template.parentNodeId.length > 0) {
        nodeIds = [template.parentNodeId];
    } else {
        nodeIds = [];
    }

    return {
        id: normalizeText(template.id) || createId(),
        nodeIds,
        parentNodeId: nodeIds[0] || null,
        title: normalizeText(template.title),
        description: normalizeText(template.description),
        channels,
        order: normalizeOrder(template.order),
        sourceModelId: normalizeText(template.sourceModelId),
        contentByChannel,
        favorite: Boolean(template.favorite)
    };
}
