const AGENT_PROFILE_KEY = "agent_profile";
const LOCAL_AGENT_PROFILE_KEY = `local_${AGENT_PROFILE_KEY}`;
const INPUT_VALUE_PREFIX = "input_";

export const AGENT_PROFILE_UPDATED_EVENT = "agent-profile-updated";

export const AGENT_PROFILE_FIELDS = Object.freeze([
    {
        key: "firstName",
        token: "{agent_firstName}",
        label: "Agent first name",
        settingsLabel: "First name"
    },
    {
        key: "lastName",
        token: "{agent_lastName}",
        label: "Agent last name",
        settingsLabel: "Last name"
    },
    {
        key: "email",
        token: "{agent_email}",
        label: "Agent email",
        settingsLabel: "Email"
    },
    {
        key: "phoneNumber",
        token: "{agent_phoneNumber}",
        label: "Agent phone number",
        settingsLabel: "Phone number"
    }
]);

export const AGENT_PROFILE_TOKENS = Object.freeze(AGENT_PROFILE_FIELDS.map((field) => ({
    id: `system:${field.key}`,
    token: field.token,
    label: field.label,
    key: `agent.${field.key}`,
    input_type: "text",
    display_mode: "on_demand",
    internal: true,
    system: true
})));
const AGENT_PROFILE_TOKEN_SET = new Set(AGENT_PROFILE_FIELDS.map((field) => field.token));
const AGENT_PROFILE_FIELD_BY_TOKEN = new Map(AGENT_PROFILE_FIELDS.map((field) => [field.token, field]));

function normalizeAgentProfile(profile = {}) {
    const normalized = {};
    for (const field of AGENT_PROFILE_FIELDS) {
        normalized[field.key] = typeof profile?.[field.key] === "string" ? profile[field.key] : "";
    }
    return normalized;
}

function writeStorageValue(storage, key, value) {
    if (storage.getItem(key) === value) return false;
    storage.setItem(key, value);
    return true;
}

function removeStorageValue(storage, key) {
    if (storage.getItem(key) === null) return false;
    storage.removeItem(key);
    return true;
}

export function isAgentProfileToken(token = "") {
    return AGENT_PROFILE_TOKEN_SET.has(token);
}

function fieldForToken(token = "") {
    return AGENT_PROFILE_FIELD_BY_TOKEN.get(token) || null;
}

export function loadAgentProfile(storage = globalThis.localStorage) {
    if (!storage) return normalizeAgentProfile();

    try {
        const raw = storage.getItem(LOCAL_AGENT_PROFILE_KEY) || storage.getItem(AGENT_PROFILE_KEY);
        return normalizeAgentProfile(raw ? JSON.parse(raw) : {});
    } catch (error) {
        console.error("loadAgentProfile error", error);
        return normalizeAgentProfile();
    }
}

export function getAgentProfileTokenValues(profile = loadAgentProfile()) {
    const normalized = normalizeAgentProfile(profile);
    const values = {};
    for (const field of AGENT_PROFILE_FIELDS) {
        values[field.token] = normalized[field.key];
    }
    return values;
}

export function syncAgentProfileInputValues(profile = loadAgentProfile(), storage = globalThis.localStorage) {
    if (!storage) return false;

    let changed = false;
    const normalized = normalizeAgentProfile(profile);
    for (const field of AGENT_PROFILE_FIELDS) {
        const value = normalized[field.key];
        const key = `${INPUT_VALUE_PREFIX}${field.token}`;
        if (value === "") {
            changed = removeStorageValue(storage, key) || changed;
        } else {
            changed = writeStorageValue(storage, key, value) || changed;
        }
    }
    return changed;
}

export function saveAgentProfile(profile, storage = globalThis.localStorage) {
    const normalized = normalizeAgentProfile(profile);
    if (!storage) return normalized;

    try {
        const serialized = JSON.stringify(normalized);
        const localProfileChanged = writeStorageValue(storage, LOCAL_AGENT_PROFILE_KEY, serialized);
        const legacyProfileChanged = writeStorageValue(storage, AGENT_PROFILE_KEY, serialized);
        const profileChanged = localProfileChanged || legacyProfileChanged;
        const inputChanged = syncAgentProfileInputValues(normalized, storage);
        if ((profileChanged || inputChanged) && typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent(AGENT_PROFILE_UPDATED_EVENT, { detail: { profile: normalized } }));
        }
    } catch (error) {
        console.error("saveAgentProfile error", error);
    }
    return normalized;
}

export function saveAgentProfileTokenValue(token, value, storage = globalThis.localStorage) {
    const field = fieldForToken(token);
    if (!field) return { token, value };

    const profile = loadAgentProfile(storage);
    profile[field.key] = value === null || value === undefined ? "" : String(value);
    const savedProfile = saveAgentProfile(profile, storage);
    return {
        token: field.token,
        value: savedProfile[field.key],
        profile: savedProfile
    };
}
