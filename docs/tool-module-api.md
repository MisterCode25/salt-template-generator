# Template Generator Module API

This API is available to every HTML module executed inside the Template Generator module iframe.

## Bootstrap

Call `TemplateTool.getContext()` before reading runtime variables:

```html
<script>
  (async function () {
    const context = await window.TemplateTool.getContext();
    const vars = window.TemplateVars;

    document.getElementById("client").textContent = vars.clientName || "Client missing";
  }());
</script>
```

The module can also use `await TemplateTool.getVars()` when it only needs variables.

## Globals

`window.TemplateTool`
: Host bridge with all callable functions.

`window.TemplateVars`
: Variable-style data access. Keys are safe JavaScript names generated from tokens, labels and field keys.

`window.TemplateEnv`
: Current module metadata.

`window.TemplateFields`
: Array of normalized fields available to the module.

`window.TemplateContext`
: Full runtime context returned by `TemplateTool.getContext()`.

`window.TemplateAPI`
: Static API reference describing globals, context shape, variables and functions.

## TemplateVars

Common examples:

```js
TemplateVars.clientName
TemplateVars.mobile
TemplateVars.contractor
TemplateVars.contractorNumber
TemplateVars.activationDate
TemplateVars.activation
TemplateVars.otoId
TemplateVars.otoPort
TemplateVars.language
```

Fallback maps:

```js
TemplateVars.byToken["{client_first_name}"]
TemplateVars.byKey["client.firstName"]
TemplateVars.byLabel["Full name"]
TemplateVars.raw["{client_first_name}"]
```

Reserved containers:

```js
TemplateVars.env
TemplateVars.raw
TemplateVars.byToken
TemplateVars.byKey
TemplateVars.byLabel
```

Variable names are generated from real available data only. Never assume a value exists; always provide a fallback.

## TemplateEnv

```js
TemplateEnv.apiVersion
TemplateEnv.toolId
TemplateEnv.toolTitle
TemplateEnv.toolDescription
TemplateEnv.generatedAt
```

## TemplateFields

Each field has this shape:

```js
{
  label: "Mobile",
  value: "078 912 56 85",
  source: "token",
  token: "{client_mobile}",
  key: "client.mobile",
  section: "Client",
  aliases: ["Mobile", "mobile", "{mobile}", "client.mobile", "clientMobile"]
}
```

Use fields when you need to render a dynamic list of available data.

## TemplateContext

`await TemplateTool.getContext()` returns:

```js
{
  apiVersion,
  tool: { id, title, description },
  environment,
  variables,
  values,
  tokenValues,
  tokens,
  fields,
  fieldIndex,
  client,
  clientInfo,
  clientSummary,
  generatedAt
}
```

## TemplateTool Functions

```js
await TemplateTool.getContext()
await TemplateTool.getVars()
await TemplateTool.getVar("clientName", "")
await TemplateTool.hasVariable("clientName")
await TemplateTool.listVariables()
await TemplateTool.findField(["mobile", "phone"])
await TemplateTool.getFieldValue(["mobile", "phone"], "")
await TemplateTool.copyText("text", "Copied")
await TemplateTool.copyHtml("<strong>HTML</strong>", "Copied")
await TemplateTool.toast("Saved", "success")
await TemplateTool.openUrl("https://example.com")
TemplateTool.requestResize()
TemplateTool.close()
TemplateTool.onContext((context) => {})
TemplateTool.describeApi()
```

Toast variants:

```js
"info"
"success"
"warning"
"error"
```

## Minimal Module

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; background: #fff; color: #172033; font: 14px system-ui; }
    .template-tool-module { display: grid; gap: 10px; padding: 12px; }
    button { border: 1px solid #5b63f6; border-radius: 8px; background: #5b63f6; color: #fff; padding: 8px 11px; }
  </style>
</head>
<body>
  <main class="template-tool-module">
    <strong id="name">Loading...</strong>
    <button type="button" id="copy">Copy</button>
  </main>
  <script>
    (async function () {
      await TemplateTool.getContext();
      const name = TemplateVars.clientName || "Client";

      document.getElementById("name").textContent = name;
      document.getElementById("copy").addEventListener("click", async function () {
        await TemplateTool.copyText(name, "Client copied");
      });

      TemplateTool.requestResize();
    }());
  </script>
</body>
</html>
```
