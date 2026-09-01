export const CLIENT_BAR_FIELD_LIMIT = 16;

export function limitClientBarFieldKeys(keys) {
    return Array.isArray(keys) ? keys.slice(0, CLIENT_BAR_FIELD_LIMIT) : [];
}
