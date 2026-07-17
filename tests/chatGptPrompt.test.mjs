import assert from "node:assert/strict";

import {
  buildChatGptTemplatePrompt,
  extractChatGptJsonPayload,
  extractChatGptTemplateHtml,
  getChatGptResultMarkers,
  sanitizeTemplateHtmlForChatGpt
} from "../src/utils/chatGptPrompt.js";
import {
  buildChatGptEditorPrompt,
  parseChatGptEditorJsonResult,
  sanitizeEditorPromptHtml
} from "../src/utils/chatGptEditorPrompt.js";

{
  const html = '<p>Hello {client_first_name}</p><img src="data:image/png;base64,abc" alt="photo">';
  const sanitized = sanitizeTemplateHtmlForChatGpt(html);

  assert.equal(sanitized, "<p>Hello {client_first_name}</p>");
}

{
  const prompt = buildChatGptTemplatePrompt({
    title: "Signal follow-up",
    html: "<p>Hello {client_first_name}</p>",
    instruction: "Make it shorter.",
    templateInstruction: "Always start with Hello {customer_name}.",
    requestId: "request-123"
  });

  assert.match(prompt, /Template writing guidance:/);
  assert.match(prompt, /Always start with Hello \{customer_name\}\./);
  assert.match(prompt, /Requested change: Make it shorter\./);
  assert.match(prompt, /\[\[TEMPLATE_GENERATOR_RESULT:request-123\]\]/);
  assert.match(prompt, /\[\[\/TEMPLATE_GENERATOR_RESULT:request-123\]\]/);
  assert.match(prompt, /Put valid JSON after that line/);
  assert.match(prompt, /"html": "<p>Revised template HTML<\/p>"/);
  assert.match(prompt, /Priority order:/);
  assert.match(prompt, /The JSON must parse with JSON\.parse/);
  assert.match(prompt, /Do not translate, rename, split, remove or invent placeholders/);
  assert.match(prompt, /Do not promise compensation/);
  assert.match(prompt, /Before returning, verify silently:/);
  assert.match(prompt, /Template title: Signal follow-up/);
  assert.match(prompt, /Keep placeholders inside braces/);
  assert.match(prompt, /\{client_first_name\}/);
}

{
  const markers = getChatGptResultMarkers("request-123");
  const markedResult = `${markers.start}\n{"html":"<p>Done</p>"}\n${markers.end}`;

  assert.equal(
    extractChatGptTemplateHtml(markedResult, { requestId: "request-123", requireRequestId: true }),
    "<p>Done</p>"
  );
  assert.equal(
    extractChatGptJsonPayload(markedResult, { requestId: "request-123", requireRequestId: true }),
    '{"html":"<p>Done</p>"}'
  );
  assert.equal(
    extractChatGptTemplateHtml(markedResult, { requestId: "other-request", requireRequestId: true }),
    ""
  );
  assert.equal(
    extractChatGptTemplateHtml(`${markers.start}\n<p>Done</p>\n${markers.end}`, { requestId: "request-123", requireRequestId: true }),
    ""
  );
  assert.equal(
    extractChatGptTemplateHtml("```html\n<p>Done</p>\n```"),
    ""
  );
  assert.equal(
    extractChatGptTemplateHtml('{"html":"<p>Done</p>"}'),
    "<p>Done</p>"
  );
  assert.equal(
    extractChatGptTemplateHtml('{"text_en":"<p>Hello</p>"}'),
    ""
  );
}

{
  const prompt = buildChatGptEditorPrompt({
    requestId: "editor-123",
    taskTitle: "Generate template",
    templateInstruction: "Always end with {agent_firstName}.",
    userInstruction: "Create a short outage reply.",
    outputSchema: '{"html":"<p>Generated content</p>"}',
    contextBlocks: [{ title: "Template", body: "Channel: Email" }],
    taskRules: ["Write only in FR.", "Keep variants distinct."],
    allowImages: false
  });

  assert.match(prompt, /\[\[TEMPLATE_GENERATOR_RESULT:editor-123\]\]/);
  assert.match(prompt, /Always end with \{agent_firstName\}\./);
  assert.match(prompt, /Task: Generate template/);
  assert.match(prompt, /"html"/);
  assert.match(prompt, /Do not include images/);
  assert.match(prompt, /Priority order:/);
  assert.match(prompt, /JSON rules:/);
  assert.match(prompt, /Do not translate, rename, split, remove or invent placeholders/);
  assert.match(prompt, /Before returning, verify silently:/);
  assert.match(prompt, /Task-specific rules:/);
  assert.match(prompt, /Write only in FR\./);
  assert.match(prompt, /Keep variants distinct\./);

  const markers = getChatGptResultMarkers("editor-123");
  const result = `${markers.start}\n{"html":"<p>Generated</p>"}\n${markers.end}`;
  assert.deepEqual(
    parseChatGptEditorJsonResult(result, { requestId: "editor-123" }),
    { html: "<p>Generated</p>" }
  );
  assert.equal(parseChatGptEditorJsonResult(result, { requestId: "wrong-id" }), null);

  const fencedResult = `${markers.start}
Here is the JSON:
\`\`\`json
{
  "channels": [
    {
      "channel": "email",
      "variants": [
        { "id": "variant-1", "text_en": "<p>Hello</p>" }
      ]
    }
  ]
}
\`\`\`
${markers.end}`;
  assert.deepEqual(
    parseChatGptEditorJsonResult(fencedResult, { requestId: "editor-123" }),
    {
      channels: [
        {
          channel: "email",
          variants: [
            { id: "variant-1", text_en: "<p>Hello</p>" }
          ]
        }
      ]
    }
  );
}

{
  const html = '<p>Keep me</p><img src="x">';
  assert.equal(sanitizeEditorPromptHtml(html), "<p>Keep me</p>");
}

console.log("chatGptPrompt tests passed");
