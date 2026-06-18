import assert from "node:assert/strict";
import {
  formatClipboardHtmlBody,
  formatClipboardPlainText,
  formatToastMessage
} from "../src/services/clipboardService.js";

{
  const body = formatClipboardHtmlBody("Hello,\nLine two.\n\nBest regards,\nSalt");

  assert.equal(body, "<p>Hello,<br />\nLine two.</p>\n<p>Best regards,<br />\nSalt</p>");
}

{
  const html = "<p>Hello<br />World</p>";

  assert.equal(formatClipboardHtmlBody(html), html);
  assert.equal(formatClipboardPlainText(html), "Hello\nWorld");
}

{
  assert.equal(formatClipboardPlainText("  A\n\n\nB &amp; C  "), "A\n\nB & C");
}

{
  assert.equal(formatToastMessage("  Data   imported  "), "Data imported");
  assert.equal(formatToastMessage("x".repeat(120)).length, 92);
  assert.equal(formatToastMessage("x".repeat(120)).endsWith("..."), true);
}

console.log("clipboardService tests passed");
