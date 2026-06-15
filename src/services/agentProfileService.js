import { loadJSON, saveJSON } from "./storageService.js";
import {
    removeTokenInputValues,
    setTokenInputValues
} from "./tokenInputValueService.js";

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
const AGENT_PROFILE_TOKEN_SET = new Set(AGENT_PROFILE_FIELDS.map((field) => field.token));
const AGENT_PROFILE_FIELD_BY_TOKEN = new Map(AGENT_PROFILE_FIELDS.map((field) => [field.token, field]));

function normalizeAgentProfile(profile = {}) {
    const normalized = {};
    for (const field of AGENT_PROFILE_FIELDS) {
        normalized[field.key] = typeof profile?.[field.key] === "string" ? profile[field.key] : "";
    }
    return normalized;
}

export function isAgentProfileToken(token = "") {
    return AGENT_PROFILE_TOKEN_SET.has(token);
}

function fieldForToken(token = "") {
    return AGENT_PROFILE_FIELD_BY_TOKEN.get(token) || null;
}

export async function loadAgentProfile() {
    try {
        return normalizeAgentProfile(await loadJSON(AGENT_PROFILE_KEY, {}));
    } catch (error) {
        console.error("loadAgentProfile error", error);
        return normalizeAgentProfile();
    }
}

export function getAgentProfileTokenValues(profile = {}) {
    const normalized = normalizeAgentProfile(profile);
    const values = {};
    for (const field of AGENT_PROFILE_FIELDS) {
        values[field.token] = normalized[field.key];
    }
    return values;
}

export async function syncAgentProfileInputValues(profile = {}) {
    const normalized = normalizeAgentProfile(profile);
    const valuesToSet = {};
    const valuesToRemove = [];
    for (const field of AGENT_PROFILE_FIELDS) {
        const value = normalized[field.key];
        if (value === "") {
            valuesToRemove.push(field.token);
        } else {
            valuesToSet[field.token] = value;
        }
    }
    if (Object.keys(valuesToSet).length > 0) await setTokenInputValues(valuesToSet);
    if (valuesToRemove.length > 0) await removeTokenInputValues(valuesToRemove);
    return true;
}

export async function saveAgentProfile(profile) {
    const normalized = normalizeAgentProfile(profile);

    try {
        await saveJSON(AGENT_PROFILE_KEY, normalized);
        await syncAgentProfileInputValues(normalized);
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent(AGENT_PROFILE_UPDATED_EVENT, { detail: { profile: normalized } }));
        }
    } catch (error) {
        console.error("saveAgentProfile error", error);
    }
    return normalized;
}

export async function saveAgentProfileTokenValue(token, value) {
    const field = fieldForToken(token);
    if (!field) return { token, value };

    const profile = await loadAgentProfile();
    profile[field.key] = value === null || value === undefined ? "" : String(value);
    const savedProfile = await saveAgentProfile(profile);
    return {
        token: field.token,
        value: savedProfile[field.key],
        profile: savedProfile
    };
}
