export const SETTINGS_SECTION = Object.freeze({
    AGENT: "agent",
    TOKENS: "tokens",
    AI_PROMPT: "aiPrompt",
    LINK_TOOLS: "link-tools",
    MODULE_TOOLS: "module-tools",
    DATA_SHORTCUTS: "data-shortcuts",
    KEYBOARD_SHORTCUTS: "keyboard-shortcuts",
    THEME: "theme",
    CONFIGURATION: "configuration",
    TEST_DATA: "testData",
    STORAGE: "storage"
});

export const SETTINGS_SECTION_DEFINITIONS = Object.freeze([
    { id: SETTINGS_SECTION.AGENT, label: "Agent profile", summary: "Agent tokens" },
    { id: SETTINGS_SECTION.TOKENS, label: "Custom tokens", summary: "User tokens" },
    { id: SETTINGS_SECTION.AI_PROMPT, label: "AI prompt", summary: "Template guidance" },
    { id: SETTINGS_SECTION.LINK_TOOLS, label: "Link tools", summary: "External shortcuts" },
    { id: SETTINGS_SECTION.MODULE_TOOLS, label: "Modules", summary: "HTML tools" },
    { id: SETTINGS_SECTION.DATA_SHORTCUTS, label: "Data shortcuts", summary: "Extension and bookmarklets" },
    { id: SETTINGS_SECTION.KEYBOARD_SHORTCUTS, label: "Keyboard shortcuts", summary: "App commands" },
    { id: SETTINGS_SECTION.THEME, label: "Theme", summary: "Appearance" },
    { id: SETTINGS_SECTION.CONFIGURATION, label: "Configuration", summary: "Import / export" },
    { id: SETTINGS_SECTION.TEST_DATA, label: "Test data", summary: "VTI and SO" },
    { id: SETTINGS_SECTION.STORAGE, label: "Storage", summary: "Browser data" }
]);

const settingsSectionIds = new Set(SETTINGS_SECTION_DEFINITIONS.map(({ id }) => id));
const toolSettingsSectionIds = new Set([
    SETTINGS_SECTION.LINK_TOOLS,
    SETTINGS_SECTION.MODULE_TOOLS,
    SETTINGS_SECTION.DATA_SHORTCUTS,
    SETTINGS_SECTION.KEYBOARD_SHORTCUTS
]);

export function normalizeSettingsSection(sectionId) {
    return settingsSectionIds.has(sectionId) ? sectionId : SETTINGS_SECTION.AGENT;
}

export function isToolSettingsSection(sectionId) {
    return toolSettingsSectionIds.has(sectionId);
}
