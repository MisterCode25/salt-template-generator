import assert from "node:assert/strict";
import {
  TOOL_MODULE_API_REFERENCE,
  TOOL_MODULE_API_VERSION,
  buildToolModulePrompt,
  buildToolModuleSrcDoc,
  buildToolRuntimeContext,
  formatToolModuleApiReferenceForPrompt,
  normalizeToolModuleHtml
} from "../src/utils/toolModuleRuntime.js";

{
  const srcDoc = buildToolModuleSrcDoc("<main>Tool body</main>");
  assert.match(srcDoc, /<!doctype html>/i);
  assert.match(srcDoc, /window\.TemplateTool/);
  assert.match(srcDoc, /TemplateAPI/);
  assert.match(srcDoc, /describeApi/);
  assert.match(srcDoc, /getVar/);
  assert.match(srcDoc, /listVariables/);
  assert.match(srcDoc, /template-tool-host-style/);
  assert.match(srcDoc, /<main>Tool body<\/main>/);
}

{
  assert.equal(TOOL_MODULE_API_REFERENCE.version, TOOL_MODULE_API_VERSION);
  assert.ok(TOOL_MODULE_API_REFERENCE.globals.TemplateVars);
  assert.ok(TOOL_MODULE_API_REFERENCE.globals.TemplateAPI);
  assert.equal(TOOL_MODULE_API_REFERENCE.functions["TemplateTool.getContext()"], "Promise<TemplateContext>");
  assert.equal(TOOL_MODULE_API_REFERENCE.functions["TemplateTool.getVar(name, fallback = '')"], "Promise<string>");
  assert.ok(TOOL_MODULE_API_REFERENCE.variables.examples.includes("TemplateVars.clientName"));
  const apiPromptReference = formatToolModuleApiReferenceForPrompt();
  assert.match(apiPromptReference, /Template Generator Module API/);
  assert.match(apiPromptReference, /Globals:/);
  assert.match(apiPromptReference, /Variable access:/);
  assert.match(apiPromptReference, /Context shape:/);
  assert.match(apiPromptReference, /Functions:/);
  assert.match(apiPromptReference, /TemplateTool\.copyHtml/);
}

{
  const srcDoc = buildToolModuleSrcDoc("<!doctype html><html><head><title>X</title></head><body></body></html>");
  assert.ok(srcDoc.indexOf("window.TemplateTool") > -1);
  assert.ok(srcDoc.indexOf("window.TemplateTool") < srcDoc.indexOf("<title>X</title>"));
  assert.ok(srcDoc.indexOf("template-tool-host-style") > srcDoc.indexOf("<title>X</title>"));
}

{
  const pasted = "Here is the file:\n```html\n<!doctype html><html><head><title>Tool</title></head><body><main>OK</main></body></html>\n```\nDone.";
  assert.equal(
    normalizeToolModuleHtml(pasted),
    "<!doctype html><html><head><title>Tool</title></head><body><main>OK</main></body></html>"
  );
}

{
  const context = buildToolRuntimeContext({
    tool: { id: "tool-1", title: "Refund", description: "Calculator" },
    values: { "{client_name}": "Samir", "{client_birth_date}": "1989-04-12" },
    tokens: [
      { token: "{client_name}", label: "Client name", key: "client.name", input_type: "text", searchAliases: ["fullName"], internal: true },
      { token: "{client_birth_date}", label: "Birth date", key: "client.birthDate", input_type: "date", searchAliases: ["dob", "date of birth"] }
    ],
    client: { client: { name: "Samir", birthDate: "1989-04-12" } },
    clientInfo: [{ id: "client", title: "Client", fields: [{ label: "Birth date", value: "1989-04-12" }] }],
    clientSummary: [{ label: "Name", value: "Samir" }]
  });
  assert.equal(context.apiVersion, TOOL_MODULE_API_VERSION);
  assert.deepEqual(context.tool, { id: "tool-1", title: "Refund", description: "Calculator" });
  assert.equal(context.values["{client_name}"], "Samir");
  assert.equal(context.values["{client_birth_date}"], "1989-04-12");
  assert.equal(context.values.client.name, "Samir");
  assert.equal(context.values.client.birthDate, "1989-04-12");
  assert.equal(context.values.birthDate, "1989-04-12");
  assert.equal(context.values.dob, "1989-04-12");
  assert.deepEqual(context.tokenValues, { "{client_name}": "Samir", "{client_birth_date}": "1989-04-12" });
  assert.equal(context.variables.clientName, "Samir");
  assert.equal(context.variables.fullName, "Samir");
  assert.equal(context.variables.client.name, "Samir");
  assert.equal(context.variables.clientBirthDate, "1989-04-12");
  assert.equal(context.variables.birthDate, "1989-04-12");
  assert.equal(context.variables.dob, "1989-04-12");
  assert.equal(context.variables.byToken["{client_birth_date}"], "1989-04-12");
  assert.equal(context.variables.byKey["client.birthDate"], "1989-04-12");
  assert.equal(context.variables.byLabel["Birth date"], "1989-04-12");
  assert.equal(context.variables.env.toolTitle, "Refund");
  assert.equal(context.environment.toolTitle, "Refund");
  assert.deepEqual(context.tokens, [
    {
      token: "{client_name}",
      label: "Client name",
      key: "client.name",
      inputType: "text",
      value: "Samir",
      aliases: ["fullName"],
      internal: true
    },
    {
      token: "{client_birth_date}",
      label: "Birth date",
      key: "client.birthDate",
      inputType: "date",
      value: "1989-04-12",
      aliases: ["dob", "date of birth"],
      internal: false
    }
  ]);
  assert.ok(context.fields.some((field) => field.label === "Birth date" && field.value === "1989-04-12"));
  assert.equal(context.fieldIndex.birthdate.value, "1989-04-12");
  assert.equal(context.fieldIndex.dob.value, "1989-04-12");
  assert.deepEqual(context.client, { client: { name: "Samir", birthDate: "1989-04-12" } });
  assert.deepEqual(context.clientInfo, [{ id: "client", title: "Client", fields: [{ label: "Birth date", value: "1989-04-12" }] }]);
  assert.deepEqual(context.clientSummary, [{ label: "Name", value: "Samir" }]);
  assert.match(context.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
}

{
  const prompt = buildToolModulePrompt({
    title: "Refund helper",
    prompt: "Calculate a refund and copy a customer message."
  });
  assert.match(prompt, /Return one complete HTML file, and nothing else/);
  assert.match(prompt, /downloadable \.html file/);
  assert.match(prompt, /Do not split the answer into multiple parts/);
  assert.match(prompt, /Module API reference:/);
  assert.match(prompt, /Globals:/);
  assert.match(prompt, /Variable access:/);
  assert.match(prompt, /Context shape:/);
  assert.match(prompt, /Functions:/);
  assert.match(prompt, /always opens this module inside its own popup\/modal/);
  assert.match(prompt, /user does not need to ask for a popup/);
  assert.match(prompt, /If the user explicitly asks for a main-page action/);
  assert.match(prompt, /tokens is an array of available variables/);
  assert.match(prompt, /Never invent variable names or sample values/);
  assert.match(prompt, /Do not create a second card-centered popup/);
  assert.match(prompt, /TemplateTool\.findField/);
  assert.match(prompt, /TemplateVars/);
  assert.match(prompt, /TemplateEnv/);
  assert.match(prompt, /TemplateContext/);
  assert.match(prompt, /TemplateFields/);
  assert.match(prompt, /TemplateAPI/);
  assert.match(prompt, /TemplateTool\.describeApi/);
  assert.match(prompt, /TemplateTool\.getVars/);
  assert.match(prompt, /TemplateTool\.getVar/);
  assert.match(prompt, /TemplateTool\.listVariables/);
  assert.match(prompt, /TemplateTool\.copyHtml\(html, message\)/);
  assert.match(prompt, /TemplateTool\.requestResize/);
  assert.match(prompt, /Use <main class="template-tool-module">/);
  assert.match(prompt, /window\.TemplateTool\.getContext/);
  assert.match(prompt, /Refund helper/);
  assert.match(prompt, /Calculate a refund/);
}

console.log("toolModuleRuntime tests passed");
