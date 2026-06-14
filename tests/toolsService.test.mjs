import assert from "node:assert/strict";
import {
  DEFAULT_TOOL_COLOR,
  TOOL_TYPES,
  isModuleTool,
  normalizeTool,
  resolveToolUrl,
  sanitizeToolType
} from "../src/services/toolsService.js";

{
  const tool = normalizeTool({
    title: "  Customer search  ",
    url: "  https://example.com?q={client_name}  ",
    color: "unknown"
  });

  assert.equal(tool.type, TOOL_TYPES.LINK);
  assert.equal(tool.title, "Customer search");
  assert.equal(tool.url, "https://example.com?q={client_name}");
  assert.equal(tool.color, DEFAULT_TOOL_COLOR);
  assert.equal(isModuleTool(tool), false);
}

{
  const tool = normalizeTool({
    title: "  Refund helper  ",
    html: "<button>Copy</button>",
    color: "violet"
  });

  assert.equal(tool.type, TOOL_TYPES.MODULE);
  assert.equal(tool.title, "Refund helper");
  assert.equal(tool.url, "");
  assert.equal(tool.html, "<button>Copy</button>");
  assert.equal(tool.beta, true);
  assert.equal(isModuleTool(tool), true);
}

{
  assert.equal(sanitizeToolType("module"), TOOL_TYPES.MODULE);
  assert.equal(sanitizeToolType("bad"), TOOL_TYPES.LINK);
}

{
  const url = resolveToolUrl("https://example.com/search?q={client_name}", {
    "{client_name}": "Jane & Bob <strong>Fiber</strong>"
  });
  assert.equal(url, "https://example.com/search?q=Jane%20%26%20Bob%20Fiber");
}

console.log("toolsService tests passed");
