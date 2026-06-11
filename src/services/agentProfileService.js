const AGENT_PROFILE_KEY = "agent_profile";

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

function normalizeAgentProfile(profile = {}) {
    return AGENT_PROFILE_FIELDS.reduce((next, field) => ({
        ...next,
        [field.key]: typeof profile?.[field.key] === "string" ? profile[field.key] : ""
    }), {});
}

export function isAgentProfileToken(token = "") {
    return AGENT_PROFILE_FIELDS.some((field) => field.token === token);
}

function fieldForToken(token = "") {
    return AGENT_PROFILE_FIELDS.find((field) => field.token === token) || null;
}

export function loadAgentProfile(storage = globalThis.localStorage) {
    if (!storage) return normalizeAgentProfile();

    try {
        const raw = storage.getItem(`local_${AGENT_PROFILE_KEY}`) || storage.getItem(AGENT_PROFILE_KEY);
        return normalizeAgentProfile(raw ? JSON.parse(raw) : {});
    } catch (error) {
        console.error("loadAgentProfile error", error);
        return normalizeAgentProfile();
    }
}

export function getAgentProfileTokenValues(profile = loadAgentProfile()) {
    const normalized = normalizeAgentProfile(profile);
    return AGENT_PROFILE_FIELDS.reduce((values, field) => ({
        ...values,
        [field.token]: normalized[field.key]
    }), {});
}

export function syncAgentProfileInputValues(profile = loadAgentProfile(), storage = globalThis.localStorage) {
    if (!storage) return;

    const values = getAgentProfileTokenValues(profile);
    Object.entries(values).forEach(([token, value]) => {
        const key = `input_${token}`;
        if (value === "") {
            storage.removeItem(key);
        } else {
            storage.setItem(key, value);
        }
    });
}

export function saveAgentProfile(profile, storage = globalThis.localStorage) {
    const normalized = normalizeAgentProfile(profile);
    if (!storage) return normalized;

    try {
        const serialized = JSON.stringify(normalized);
        storage.setItem(`local_${AGENT_PROFILE_KEY}`, serialized);
        storage.setItem(AGENT_PROFILE_KEY, serialized);
        syncAgentProfileInputValues(normalized, storage);
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
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

    const profile = {
        ...loadAgentProfile(storage),
        [field.key]: value === null || value === undefined ? "" : String(value)
    };
    const savedProfile = saveAgentProfile(profile, storage);
    return {
        token: field.token,
        value: savedProfile[field.key],
        profile: savedProfile
    };
}
