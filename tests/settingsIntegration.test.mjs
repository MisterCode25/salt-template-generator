import assert from "node:assert/strict";
import {
  APP_FEATURE_FLAGS,
  CAPTURE_FLOW,
  getPrimaryCaptureFlow,
  shouldShowCaptureUpdateMenu,
  shouldShowLegacyCaptureButton
} from "../src/config/appFeatureFlags.js";
import {
  SETTINGS_SECTION,
  SETTINGS_SECTION_DEFINITIONS,
  isToolSettingsSection,
  normalizeSettingsSection
} from "../src/config/settingsSections.js";

{
  assert.equal(APP_FEATURE_FLAGS.legacyClipboardCapture, false);
  assert.equal(APP_FEATURE_FLAGS.captureUpdateMenu, false);
  assert.equal(shouldShowLegacyCaptureButton(), false);
  assert.equal(shouldShowCaptureUpdateMenu(), false);
  assert.equal(getPrimaryCaptureFlow(), CAPTURE_FLOW.EXTENSION);
}

{
  const legacyFlags = { legacyClipboardCapture: true };
  assert.equal(shouldShowLegacyCaptureButton(legacyFlags), true);
  assert.equal(getPrimaryCaptureFlow(legacyFlags), CAPTURE_FLOW.LEGACY_CLIPBOARD);
}

{
  assert.equal(shouldShowCaptureUpdateMenu({ captureUpdateMenu: true }), true);
}

{
  const sectionIds = SETTINGS_SECTION_DEFINITIONS.map((section) => section.id);
  const toolSectionIds = [
    SETTINGS_SECTION.LINK_TOOLS,
    SETTINGS_SECTION.MODULE_TOOLS,
    SETTINGS_SECTION.DATA_SHORTCUTS,
    SETTINGS_SECTION.KEYBOARD_SHORTCUTS
  ];

  toolSectionIds.forEach((sectionId) => {
    assert.equal(sectionIds.includes(sectionId), true);
    assert.equal(isToolSettingsSection(sectionId), true);
    assert.equal(normalizeSettingsSection(sectionId), sectionId);
  });
  assert.equal(isToolSettingsSection(SETTINGS_SECTION.AGENT), false);
  assert.equal(normalizeSettingsSection("unknown-section"), SETTINGS_SECTION.AGENT);
}

console.log("settingsIntegration tests passed");
