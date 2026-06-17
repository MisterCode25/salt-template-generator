import{c as w}from"./createLucideIcon-BZ4YxiVJ.js";import{l as Z,a as Q}from"./index-CGi8Qhno.js";import{p as X,S as R}from"./tokenService-IYdbRjjr.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Ze=w("chevron-left",P);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Qe=w("chevron-right",ee);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],Xe=w("clipboard-copy",te);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],Pe=w("external-link",ne);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],et=w("puzzle",oe),_="quick_tools",re="blue",v=Object.freeze({LINK:"link",MODULE:"module"}),ae=v.LINK,ie=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],se=new Set(ie.map(e=>e.value)),le=new Set(Object.values(v));function ce(e){return se.has(e)?e:re}function $(e){return le.has(e)?e:ae}function ue(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function D(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?v.MODULE:v.LINK),n=$(t);return{...e,type:n,title:String(e.title||"").trim(),url:n===v.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:ce(e.color),order:ue(e.order),beta:n===v.MODULE?!0:!!e.beta}}async function tt(){const e=await Z(_,[]);return Array.isArray(e)?e.map(D).filter(Boolean):[]}async function nt(e){const t=Array.isArray(e)?e.map(D).filter(Boolean):[];return Q(_,t)}function ot(e,t={}){return(e||"").replace(/\{[^}]+\}/g,n=>{const r=t[n];if(r==null||r==="")return n;const o=String(r).replace(/<[^>]+>/g,"").trim();return encodeURIComponent(o)})}function rt(e){return $(e==null?void 0:e.type)===v.MODULE}const S="template-tool-module-beta-1",M=Object.freeze({name:"Template Generator Module API",version:S,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']"],reservedContainers:["env","raw","byToken","byKey","byLabel"]},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",variables:"TemplateVars object",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function de(e=M){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,r])=>{t.push(`- window.${n}: ${r.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.join(`
`)}const me=`
<style id="template-tool-host-style">
    :root {
        color-scheme: light;
    }

    html,
    body {
        min-width: 0;
        overflow-x: hidden;
        background: #ffffff;
    }

    body {
        margin: 0 !important;
        min-height: 0 !important;
    }

    body > .module:first-child,
    body > main.module:first-child,
    body > .template-tool-module:first-child,
    body > main.template-tool-module:first-child {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 12px !important;
        background: #ffffff !important;
    }

    body > .module:first-child > .card:first-child,
    body > main.module:first-child > .card:first-child,
    body > main.module:first-child > section.card:first-child,
    body > .template-tool-module:first-child > .card:first-child,
    body > main.template-tool-module:first-child > .card:first-child,
    body > main.template-tool-module:first-child > section.card:first-child {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
    }

    button,
    input,
    select,
    textarea {
        font: inherit;
    }

    img,
    svg,
    canvas,
    video {
        max-width: 100%;
    }
</style>`,pe=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${S}";
    var apiReference = ${JSON.stringify(M)};
    var requestId = 0;
    var pending = new Map();
    var cachedContext = null;
    var resizeTimer = 0;

    function post(type, payload, expectsResponse) {
        var id = "tool-" + Date.now() + "-" + (++requestId);
        window.parent.postMessage({
            source: "template-tool-module",
            type: type,
            requestId: id,
            payload: payload || {}
        }, "*");

        if (!expectsResponse) return Promise.resolve(null);
        return new Promise(function (resolve, reject) {
            pending.set(id, { resolve: resolve, reject: reject });
            window.setTimeout(function () {
                if (!pending.has(id)) return;
                pending.delete(id);
                reject(new Error("Tool host did not respond."));
            }, 5000);
        });
    }

    function normalizeLookupKey(value) {
        return String(value || "")
            .replace(/[{}]/g, "")
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .normalize("NFD")
            .replace(/[\\u0300-\\u036f]/g, "")
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "");
    }

    function fieldMatches(field, key) {
        if (!field || !key) return false;
        var aliases = field.aliases || [];
        if (normalizeLookupKey(field.label) === key) return true;
        if (normalizeLookupKey(field.token) === key) return true;
        if (normalizeLookupKey(field.key) === key) return true;
        for (var i = 0; i < aliases.length; i += 1) {
            if (normalizeLookupKey(aliases[i]) === key) return true;
        }
        return false;
    }

    function findFieldInContext(context, candidates) {
        var names = Array.isArray(candidates) ? candidates : [candidates];
        var fields = Array.isArray(context && context.fields) ? context.fields : [];
        var index = context && context.fieldIndex && typeof context.fieldIndex === "object"
            ? context.fieldIndex
            : {};

        for (var i = 0; i < names.length; i += 1) {
            var key = normalizeLookupKey(names[i]);
            if (!key) continue;
            if (index[key] && index[key].value !== undefined && index[key].value !== "") {
                return index[key];
            }
            for (var j = 0; j < fields.length; j += 1) {
                if (fieldMatches(fields[j], key) && fields[j].value !== "") return fields[j];
            }
        }
        return null;
    }

    function installContextGlobals(context) {
        var safeContext = context || {};
        window.TemplateAPI = apiReference;
        window.TemplateContext = safeContext;
        window.TemplateEnv = safeContext.environment || {
            apiVersion: safeContext.apiVersion || apiVersion,
            toolId: safeContext.tool && safeContext.tool.id || "",
            toolTitle: safeContext.tool && safeContext.tool.title || "",
            toolDescription: safeContext.tool && safeContext.tool.description || "",
            generatedAt: safeContext.generatedAt || ""
        };
        window.TemplateFields = Array.isArray(safeContext.fields) ? safeContext.fields : [];
        window.TemplateVars = safeContext.variables && typeof safeContext.variables === "object"
            ? safeContext.variables
            : {};
    }

    window.TemplateAPI = apiReference;

    function emitContext(context) {
        cachedContext = context || {};
        installContextGlobals(cachedContext);
        window.dispatchEvent(new CustomEvent("template-tool-context", { detail: cachedContext }));
        requestResize();
    }

    function measureHeight() {
        var doc = document.documentElement;
        var body = document.body;
        if (!doc && !body) return 0;

        var childBottom = 0;
        if (body && body.children) {
            for (var i = 0; i < body.children.length; i += 1) {
                var rect = body.children[i].getBoundingClientRect();
                childBottom = Math.max(childBottom, rect.bottom);
            }
        }

        var height = childBottom || Math.max(
            doc ? doc.scrollHeight : 0,
            doc ? doc.offsetHeight : 0,
            body ? body.scrollHeight : 0,
            body ? body.offsetHeight : 0
        );
        return Math.ceil(Math.min(Math.max(height || 0, 140), 1400));
    }

    function requestResize() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            var height = measureHeight();
            if (height) post("tool:resize", { height: height }, false);
        }, 30);
    }

    window.addEventListener("message", function (event) {
        var data = event.data || {};
        if (data.source !== "template-tool-host") return;

        if (data.type === "tool:context") {
            emitContext(data.payload || {});
            return;
        }

        if (!data.responseTo || !pending.has(data.responseTo)) return;
        var request = pending.get(data.responseTo);
        pending.delete(data.responseTo);
        if (data.error) {
            request.reject(new Error(data.error));
        } else {
            if (data.type === "tool:response" && data.payload && data.payload.apiVersion) {
                emitContext(data.payload);
            }
            request.resolve(data.payload || null);
        }
    });

    window.TemplateTool = {
        apiVersion: apiVersion,
        ready: function () {
            return post("tool:ready", {}, false);
        },
        getContext: function () {
            if (cachedContext) return Promise.resolve(cachedContext);
            return post("tool:request-context", {}, true).then(function (context) {
                cachedContext = context || {};
                return cachedContext;
            });
        },
        onContext: function (callback) {
            if (typeof callback !== "function") return function () {};
            function handler(event) {
                callback(event.detail || {});
            }
            window.addEventListener("template-tool-context", handler);
            if (cachedContext) {
                window.setTimeout(function () {
                    callback(cachedContext);
                }, 0);
            }
            return function () {
                window.removeEventListener("template-tool-context", handler);
            };
        },
        findField: function (candidates) {
            return this.getContext().then(function (context) {
                return findFieldInContext(context || {}, candidates);
            });
        },
        getFieldValue: function (candidates, fallback) {
            return this.findField(candidates).then(function (field) {
                return field && field.value !== undefined && field.value !== "" ? field.value : (fallback || "");
            });
        },
        getVars: function () {
            return this.getContext().then(function () {
                return window.TemplateVars || {};
            });
        },
        getVar: function (name, fallback) {
            return this.getVars().then(function (vars) {
                var key = String(name || "");
                if (!key) return fallback || "";
                if (Object.prototype.hasOwnProperty.call(vars, key)) return vars[key];
                return fallback || "";
            });
        },
        hasVariable: function (name) {
            return this.getVars().then(function (vars) {
                return Object.prototype.hasOwnProperty.call(vars, String(name || ""));
            });
        },
        listVariables: function () {
            return this.getVars().then(function (vars) {
                return Object.keys(vars).filter(function (key) {
                    var value = vars[key];
                    return value === null || typeof value !== "object";
                }).sort();
            });
        },
        describeApi: function () {
            return apiReference;
        },
        requestResize: requestResize,
        copyText: function (text, message) {
            return post("tool:copy-text", { text: String(text || ""), message: message || "" }, true);
        },
        copyHtml: function (html, message) {
            return post("tool:copy-html", { html: String(html || ""), message: message || "" }, true);
        },
        toast: function (message, variant) {
            return post("tool:toast", { message: String(message || ""), variant: variant || "info" }, true);
        },
        openUrl: function (url) {
            return post("tool:open-url", { url: String(url || "") }, true);
        },
        close: function () {
            return post("tool:close", {}, false);
        }
    };

    function startRuntime() {
        requestResize();
        window.TemplateTool.ready();
        window.addEventListener("load", requestResize);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(requestResize).catch(function () {});
        }
        if (typeof ResizeObserver === "function") {
            var observer = new ResizeObserver(requestResize);
            if (document.documentElement) observer.observe(document.documentElement);
            if (document.body) observer.observe(document.body);
        }
        window.setTimeout(requestResize, 120);
        window.setTimeout(requestResize, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startRuntime, { once: true });
    } else {
        startRuntime();
    }
})();
<\/script>`,fe=`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #f8fafc;
            color: #526078;
            font: 600 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
    </style>
</head>
<body>
    <p>Add generated HTML to preview this module.</p>
</body>
</html>`;function he(e=""){var h;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),r=((h=n==null?void 0:n[1])==null?void 0:h.trim())||t,o=r.match(/<!doctype\s+html\b|<html[\s>]/i);if(!o)return r;const a=o.index||0,s=r.slice(a).trim(),c=s.match(/<\/html\s*>/i);return c?s.slice(0,c.index+c[0].length).trim():s}function be(e=""){const t=he(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:fe}function ge(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Te(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function at(e=""){const t=be(e),n=Te(t,pe,"template-tool-bridge");return ge(n,me,"template-tool-host-style")}function ke(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const r=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:r??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function I(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function E(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function F(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function j(e=""){const t=F(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function O(e=""){const t=j(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function z(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function y(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function g(e,t){const n=String(t||"").trim();if(!n)return;y(e,n);const r=F(n),o=j(n);r&&(y(e,r),y(e,`{${r}}`)),o&&y(e,o)}function ve({label:e="",token:t="",key:n="",aliases:r=[],section:o=""}={}){const a=[];g(a,e),g(a,t),g(a,t.replace(/[{}]/g,"")),g(a,n);const s=z(n);return s.length>0&&(g(a,s[s.length-1]),g(a,s.join(" ")),g(a,s.join(""))),g(a,o),r.forEach(c=>g(a,c)),a}function xe(e){const t=I(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=ve({...e,...n}),n}function we({tokens:e=[],clientInfo:t=[],clientSummary:n=[]}={}){const r=[],o=new Set,a=s=>{const c=xe(s);if(!c)return;const h=`${c.source}:${c.label}:${c.value}:${c.token||""}:${c.key||""}`;o.has(h)||(o.add(h),r.push(c))};return e.forEach(s=>{a({label:s.label,value:s.value,token:s.token,key:s.key,aliases:s.aliases,source:"token"})}),n.forEach(s=>{a({label:s.label,value:s.value,section:"summary",source:"clientSummary"})}),t.forEach(s=>{((s==null?void 0:s.fields)||[]).forEach(c=>{a({label:c.label,value:c.value,section:s.title||s.id,source:"clientInfo"})})}),r}function ye(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function Ce(e,t,n){const r=z(t);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const c=r[s];if(!c||/^\d+$/.test(c)||(o[c]===void 0&&(o[c]={}),!o[c]||typeof o[c]!="object"||Array.isArray(o[c])))return;o=o[c]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function Ae(e={},t=[]){const n={...e};return t.forEach(r=>{r.key&&Ce(n,r.key,r.value),r.aliases.forEach(o=>ye(n,o,r.value))}),U(n,t),n}const Se=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function Ie(e,t){const n=E(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(r=>E(r)===n)}function Le(e=[],t=[]){for(const n of t){const r=e.find(a=>Ie(a,n)),o=I(r==null?void 0:r.value);if(o!=="")return o}return""}function U(e,t=[]){Se.forEach(({name:n,candidates:r})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const o=Le(t,r);o!==""&&(e[n]=o)})}function Ne(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(r=>{const o=E(r);!o||t[o]||(t[o]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function N(e,t,n){const r=O(t);!r||n===""||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=n)}function Ee(e,t,n){const r=z(t).map(O).filter(Boolean);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const c=r[s];if(o[c]===void 0&&(o[c]={}),!o[c]||typeof o[c]!="object"||Array.isArray(o[c]))return;o=o[c]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function Ve({fields:e=[],tokenValues:t={},environment:n={}}={}){const r={env:n,raw:t,byToken:{},byKey:{},byLabel:{}};return Object.entries(t||{}).forEach(([o,a])=>{const s=I(a);s!==""&&(r.byToken[o]=s,N(r,o,s),N(r,o.replace(/[{}]/g,""),s))}),e.forEach(o=>{const a=I(o.value);a!==""&&(o.token&&(r.byToken[o.token]=a),o.key&&(r.byKey[o.key]=a,Ee(r,o.key,a)),r.byLabel[o.label]=a,[o.label,o.token,o.key,...o.aliases||[]].forEach(s=>{N(r,s,a)}))}),U(r,e),r}function it({tool:e={},values:t={},tokens:n=[],client:r=null,clientInfo:o=[],clientSummary:a=[]}={}){const s=t&&typeof t=="object"?t:{},c=Array.isArray(o)?o:[],h=Array.isArray(a)?a:[],b=ke(n,s),i=we({tokens:b,clientInfo:c,clientSummary:h}),l=new Date().toISOString(),u={apiVersion:S,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:l};return{apiVersion:S,tool:{id:e.id||"",title:e.title||"",description:e.description||""},values:Ae(s,i),tokenValues:s,tokens:b,fields:i,fieldIndex:Ne(i),variables:Ve({fields:i,tokenValues:s,environment:u}),environment:u,client:r&&typeof r=="object"?r:null,clientInfo:c,clientSummary:h,generatedAt:l}}function st({title:e="",prompt:t=""}={}){const n=String(e||"").trim()||"Custom tool",r=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.

Return one complete HTML file, and nothing else.
- Put all HTML, CSS and JavaScript in that single file.
- Prefer attaching the result as a downloadable .html file when the chat interface supports files.
- If you cannot attach a file, return exactly one fenced code block containing the full HTML document from <!doctype html> to </html>.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not include explanations before or after the file.
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Module API reference:
${de()}

Runtime:
- The file runs inside an iframe.
- The host app injects window.TemplateTool before your script runs.
- Use await window.TemplateTool.getContext() to read the current app context.
- Context shape: { apiVersion, tool: { id, title, description }, values, tokenValues, variables, environment, tokens, fields, fieldIndex, client, clientInfo, clientSummary, generatedAt }.
- tokenValues is the original object keyed by token strings, for example tokenValues["{client_first_name}"].
- values keeps those token keys and also includes host-generated aliases such as values.client.firstName, values.firstName and values.clientFirstName when they come from real data.
- variables is the easiest API for module JavaScript. It is also exposed globally as window.TemplateVars and contains safe JS property names such as TemplateVars.clientName, TemplateVars.mobile, TemplateVars.contractor, TemplateVars.activationDate, TemplateVars.otoId, plus TemplateVars.byToken, TemplateVars.byKey, TemplateVars.byLabel and TemplateVars.raw.
- environment is also exposed globally as window.TemplateEnv and contains { apiVersion, toolId, toolTitle, toolDescription, generatedAt }.
- The full context is exposed globally as window.TemplateContext, and normalized fields are exposed as window.TemplateFields.
- The API reference is exposed globally as window.TemplateAPI and through window.TemplateTool.describeApi().
- tokens is an array of available variables: [{ token, label, key, inputType, value, internal, aliases }].
- fields is the preferred normalized list for generated modules: [{ label, value, source, token, key, section, aliases }].
- fieldIndex is keyed by normalized names with accents, braces and separators removed.
- client is the raw imported client payload when available, otherwise null.
- clientInfo is an array of visible client detail sections: [{ id, title, fields: [{ label, value }] }].
- clientSummary is the compact client bar data: [{ label, value }].
- Prefer await window.TemplateTool.findField(["birth date", "date de naissance", "dob"]) for user-facing data lookup.
- Use await window.TemplateTool.getFieldValue(["mobile", "phone"], "") when only the string value is needed.
- Use await window.TemplateTool.getVars() or window.TemplateVars after getContext() when you want variable-style access.
- Use await window.TemplateTool.getVar("clientName", "") for a single variable.
- Use await window.TemplateTool.listVariables() when you need to discover the variable names available in the current context.
- Use window.TemplateTool.describeApi() when you need the static API reference.
- Use window.TemplateTool.copyText(text, message) to copy plain text.
- Use window.TemplateTool.copyHtml(html, message) to copy formatted HTML.
- Use window.TemplateTool.toast(message, "info" | "success" | "warning" | "error") for feedback.
- Use window.TemplateTool.openUrl(url) for external pages.
- Use window.TemplateTool.close() if your tool has a close action.
- Call window.TemplateTool.requestResize() after expanding/collapsing content, adding rows, changing validation messages or rendering async data.

Available data rules:
- Never invent variable names or sample values. Read the actual context returned by getContext().
- Prefer TemplateVars, TemplateTool.getVars(), TemplateTool.findField, context.fields, context.fieldIndex and context.clientInfo for user-facing data because they describe the available variables.
- Do not rely only on semantic object paths like context.values.client.birthDate. Use the field helpers first, then tokenValues when an exact token is known, then context.client last for raw nested data.
- Use context.client only when structured raw data is needed.
- If a required field is missing from context.tokens, context.clientInfo and context.client, show a clear missing-data state instead of guessing.
- For date tools, accept common formats like YYYY-MM-DD and DD.MM.YYYY, but only calculate from an actual available value.

Host behavior:
- The host app always opens this module inside its own popup/modal. The user does not need to ask for a popup.
- Build the HTML as the complete content of that popup, with a compact self-contained interface that fits inside the modal.
- Do not add a close button unless the requested workflow explicitly needs one. The host modal already has a close button.
- Do not create another full-screen overlay, fake browser window, onboarding page, landing page or centered modal/card inside the module.
- If the user explicitly asks for a main-page action instead of an editor UI, keep the module UI minimal and perform that action through the available TemplateTool APIs.
- If the requested main-page action is not possible with the available APIs, show a clear in-module message and offer the closest supported action.

Visual style:
- Build a compact productivity UI, not a landing page.
- The host popup already provides the modal frame and title. Do not create a second card-centered popup inside it.
- Use <main class="template-tool-module"> as the only top-level visual wrapper.
- Let the module content fill the iframe width. Set html/body margin to 0, do not set body min-height: 100vh, do not use place-items: center, do not use large empty gray backgrounds and do not center a max-width card in the canvas.
- Use a white or very light surface, #172033 text, #526078 muted text, #5b63f6 as the primary action color, #21a36a for success and #dc2626 only for destructive actions.
- Use 8px radius or less, clear labels, dense spacing and visible focus states.
- Buttons should look like app tools: bordered, solid when primary, quiet when secondary.
- Avoid decorative gradients, big hero sections, stock imagery and explanatory marketing copy.

Robustness:
- Do not assume a token exists. Read values defensively.
- Keep the layout responsive from 360px to desktop.
- Use type="button" on action buttons so forms do not submit unexpectedly.
- Ensure empty, loading and error states remain inside the same compact layout.
- Never write to localStorage unless it is essential for the tool.

Tool name: ${n}

User request:
${r}`}const B="salt-templater-alo-autofill",ze=1,C=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function T(e){return e==null?"":String(e).trim()}function f(e){for(const t of e){const n=T(t);if(n)return n}return""}function Re(e){const t=T(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:T(e)}function V(e){const t=T(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const r=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(r)return`${r[3]}-${r[2]}-${r[1]}`;const o=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return o?`${o[3]}-${o[1].padStart(2,"0")}-${o[2].padStart(2,"0")}`:t}function L(e){const t=V(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function _e(e={}){var t,n,r,o,a,s,c;return f([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activation_date,(o=e==null?void 0:e.client)==null?void 0:o.activation,(a=e==null?void 0:e.client)==null?void 0:a.dateActivation,(s=e==null?void 0:e.contact)==null?void 0:s.activationDate,(c=e==null?void 0:e.healthcheck)==null?void 0:c.activationDate])}function $e(e={}){const t=[e.SignalStatus,e.LedStatus,e.treatmentStep,e.comment].join(" ").toLowerCase();return/(low|bad|rx|tx|performance)/i.test(t)?"lowBadRxTx":"noSignal"}function De(e={}){const t=T(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function K(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",r=t==="lowBadRxTx"?"Bad signal":"No signal",o=L(n==="never"?e.activationDate:e.disconnectionDate);return[r,n==="never"?"Never activated":"Signal lost",o].filter(Boolean).join(" - ")}function lt(e={},t={}){var i,l,u,m;const n=f([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(i=e==null?void 0:e.client)==null?void 0:i.externalTicketId,(l=e==null?void 0:e.client)==null?void 0:l.externalId,(u=e==null?void 0:e.superOffice)==null?void 0:u.externalTicketId]),r=X(n),o=r.ok?r.fields:{},a=$e(o),s=De(o),c=V(_e(e)),h=V(f([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt])),b=f([t==null?void 0:t.sourceTicketId,t==null?void 0:t.ticketId,(m=t==null?void 0:t.tokenValues)==null?void 0:m[R],o.soTicket]);return{externalId:n,externalFields:o,aloType:a,signalState:s,extRef:b,disconnectionDate:s==="lost"?h:"",activationDate:c,description:K({aloType:a,signalState:s,disconnectionDate:h,activationDate:c})}}function q(e={}){return{firstName:T(e.firstName),lastName:T(e.lastName),email:T(e.email),phoneNumber:f([e.phoneNumber,e.phone])}}function H(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:f([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[R],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:T(e==null?void 0:e.externalTicketId),tokenValues:t}}function Me(e={},t={},n={},r={}){const o=(e==null?void 0:e.client)||{},a=(e==null?void 0:e.contact)||{},s=(e==null?void 0:e.healthcheck)||{},c=q(t),h=H(n),b=f([a.fixedNumber,a.voipNumber,a.voip,a.sip,o.fixedNumber,o.fixedPhone]),i=Re(f([o.mobile,o.mobileRaw,o.phone,o.telephone,a.mobile,a.phone])),l=f([r.description,r.aloType==="lowBadRxTx"?"Bad signal":"",C.problemDescription]),u=f([r.notes,r.signalState?K(r):"",C.problemNotes]),m=r.signalState==="never"?L(r.activationDate):L(r.disconnectionDate);return{externalReference:f([r.extRef,h.ticketId]),socketId:f([s.otoId,s.oto_id,s.oto]),plugNr:f([s.otoPortId,s.otoPort,s.oto_port]),breakoutCable:f([s.breakoutCableId,s.breakoutCable,s.cable]),breakoutFiber:f([s.fiberNumber,s.fiber,s.fibre]),firstName:f([o.firstName,o.firstname,o.givenName]),lastName:f([o.lastName,o.lastname,o.surname,o.familyName]),contactPhone1:f([b,i]),contactPhone2:b&&i&&b!==i?i:"",contactEmail:f([o.email,o.mail,a.email,a.mail]),ispFirstName:c.firstName,ispLastName:c.lastName,ispPhone:c.phoneNumber,ispEmail:c.email,...C,problemDescription:l,problemNotes:u,problemDateTime:m,problemCode3:r.aloType==="lowBadRxTx"?"Performance problem":C.problemCode3}}function Fe(e={},t={},n={},r={}){const o=Me(e,t,n,r),a=q(t),s=H(n);return{source:B,version:ze,fields:o,alo:{type:r.aloType||"noSignal",signalState:r.signalState||"",disconnectionDate:r.disconnectionDate||"",activationDate:r.activationDate||"",problemDateTime:o.problemDateTime,notes:r.notes||""},client:{firstName:o.firstName,lastName:o.lastName,contactPhone1:o.contactPhone1,contactPhone2:o.contactPhone2,email:o.contactEmail},technical:{socketId:o.socketId,plugNr:o.plugNr,breakoutCable:o.breakoutCable,breakoutFiber:o.breakoutFiber},agent:a,superOffice:s}}function ct(e={},t={},n={},r={}){return JSON.stringify(Fe(e,t,n,r),null,2)}function je(e){function t(i){return i==null?"":String(i).trim()}function n(i){for(var l=0;l<i.length;l+=1){var u=t(i[l]);if(u)return u}return""}function r(i){return t(i).replace(/[&<>"']/g,function(u){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[u]})}function o(i,l,u){var m=document.getElementById("saltAloFillOverlay");m&&m.remove();var p=document.createElement("div");p.id="saltAloFillOverlay",p.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(u==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",p.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+r(i)+"</strong><span style='color:#d8d8df'>"+r(l)+"</span>",document.body.appendChild(p),u!=="error"&&setTimeout(function(){try{p.remove()}catch{}},4500)}function a(i,l,u){var m=i&&i.fields||{};return n([m[l]].concat(u||[]))}function s(i,l){var u=String(l).replace(/["\\]/g,"\\$&");return document.querySelector("["+i+'="'+u+'"]')}function c(i){return document.getElementById(i)||s("name",i)||s("formcontrolname",i)||s("data-testid",i)}function h(i,l,u){var m=u?String(l??""):t(l);if(!u&&!m)return!1;var p=c(i);if(!p)return!1;if(p.tagName==="SELECT")for(var x=t(m).toLowerCase(),k=0;k<p.options.length;k+=1){var d=p.options[k];if(t(d.value).toLowerCase()===x||t(d.textContent).toLowerCase()===x){p.value=d.value;break}}else"value"in p?p.value=m:p.textContent=m;return p.dispatchEvent(new Event("input",{bubbles:!0})),p.dispatchEvent(new Event("change",{bubbles:!0})),!0}function b(i){if(!i||typeof i!="object"||Array.isArray(i)){o("ALO fill","ALO fill data invalid.","error");return}if(i.source&&i.source!==e){o("ALO fill","Clipboard does not contain ALO fill data from Salt Templater.","error");return}var l=i.client||{},u=i.technical||i.healthcheck||{},m=i.agent||{},p=i.superOffice||{},x=p.tokenValues||i.tokenValues||{},k=0;function d(J,G,W){h(J,G,W)&&(k+=1)}if(d("ticket.extRef",a(i,"externalReference",[p.sourceTicketId,p.ticketId,i.ticketId,x["{so_ticket_num}"]])),d("ticket.socketId",a(i,"socketId",[u.socketId,u.otoId,u.oto_id,u.oto])),d("ticket.plugNr",a(i,"plugNr",[u.plugNr,u.otoPortId,u.otoPort,u.oto_port])),d("ticket.breakoutCable",a(i,"breakoutCable",[u.breakoutCable,u.breakoutCableId,u.cable])),d("ticket.breakoutFiber",a(i,"breakoutFiber",[u.breakoutFiber,u.fiberNumber,u.fiber,u.fibre])),d("ticket.otoAddress.firstName",a(i,"firstName",[l.firstName,l.firstname,l.givenName])),d("ticket.otoAddress.lastName",a(i,"lastName",[l.lastName,l.lastname,l.surname,l.familyName])),d("ticket.contactPersonFirstName",a(i,"firstName",[l.firstName,l.firstname,l.givenName])),d("ticket.contactPersonLastName",a(i,"lastName",[l.lastName,l.lastname,l.surname,l.familyName])),d("ticket.contactPersonPhone1",a(i,"contactPhone1",[l.contactPhone1,l.fixedNumber,l.mobileRaw,l.mobile,l.phone])),d("ticket.contactPersonPhone2",a(i,"contactPhone2",[l.contactPhone2])),d("ticket.contactPersonMail",a(i,"contactEmail",[l.email,l.mail])),d("ticket.contactPersonIspFirstName",a(i,"ispFirstName",[m.firstName])),d("ticket.contactPersonIspLastName",a(i,"ispLastName",[m.lastName])),d("ticket.contactPersonIspPhone",a(i,"ispPhone",[m.phoneNumber,m.phone])),d("ticket.contactPersonIspMail",a(i,"ispEmail",[m.email])),d("ticket.problemDescription",a(i,"problemDescription",["No signal"])),d("ticket.problemNotes",a(i,"problemNotes",[""]),!0),d("ticket.problemDateTime",a(i,"problemDateTime",[i.alo&&i.alo.problemDateTime])),d("ticket.problemCode1",a(i,"problemCode1",["400"])),d("ticket.problemCode2",a(i,"problemCode2",["800"])),d("ticket.problemCode3",a(i,"problemCode3",["900"])),!k){o("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}o("ALO fill","Fields populated: "+k,"success")}if(o("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){o("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(l){if(!t(l)){o("ALO fill","Clipboard empty. Click ALO fill in Salt Templater first.","error");return}var u;try{u=JSON.parse(l)}catch{o("ALO fill","Clipboard does not contain valid ALO data.","error");return}b(u)}).catch(function(l){o("ALO fill","Clipboard error: "+(l&&l.message?l.message:l),"error")})}function ut(){const e=JSON.stringify(B);return`javascript:(${je.toString()})(${e});`}const Oe=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),Ue=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function A(e,t){return!!(e!=null&&e[t])}function Be(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Y(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Ke(e,t){return A(e,"ctrlKey")===!!t.ctrlKey&&A(e,"altKey")===!!t.altKey&&A(e,"shiftKey")===!!t.shiftKey&&A(e,"metaKey")===!!t.metaKey}function qe(e,t){return Ke(e,t)&&(Be(e==null?void 0:e.key,t.key)||Y(e==null?void 0:e.code,t.code))}function dt(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function He(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(Ue))}function Ye(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||He(e==null?void 0:e.target))}function mt(e){if(Ye(e))return null;const t=Oe.find(n=>qe(e,n))||null;return!t||e!=null&&e.isComposing&&!Y(e==null?void 0:e.code,t.code)?null:t}export{Xe as C,re as D,Pe as E,Oe as K,et as P,v as T,it as a,at as b,Ze as c,Qe as d,lt as e,ct as f,mt as g,K as h,rt as i,ut as j,nt as k,tt as l,$ as m,D as n,dt as o,st as p,ie as q,ot as r,ce as s};
