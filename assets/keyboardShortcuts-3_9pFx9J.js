import{c as u}from"./createLucideIcon-dekeuoj3.js";import{l as L,s as E}from"./indexedDbService-6_otWuvc.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],ge=u("clipboard-copy",z);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],Te=u("external-link",M);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],we=u("puzzle",P);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],ve=u("trash-2",j);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],xe=u("upload",$),x="quick_tools",_="blue",d=Object.freeze({LINK:"link",MODULE:"module"}),R=d.LINK,U=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],K=new Set(U.map(e=>e.value)),F=new Set(Object.values(d));function N(e){return K.has(e)?e:_}function k(e){return F.has(e)?e:R}function q(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function C(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?d.MODULE:d.LINK),a=k(t);return{...e,type:a,title:String(e.title||"").trim(),url:a===d.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:N(e.color),order:q(e.order),beta:a===d.MODULE?!0:!!e.beta}}async function ke(){const e=await L(x,[]);return Array.isArray(e)?e.map(C).filter(Boolean):[]}async function Ce(e){const t=Array.isArray(e)?e.map(C).filter(Boolean):[];return E(x,t)}function Ve(e,t={}){return(e||"").replace(/\{[^}]+\}/g,a=>{const o=t[a];if(o==null||o==="")return a;const n=String(o).replace(/<[^>]+>/g,"").trim();return encodeURIComponent(n)})}function Se(e){return k(e==null?void 0:e.type)===d.MODULE}const h="template-tool-module-beta-1",V=Object.freeze({name:"Template Generator Module API",version:h,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']"],reservedContainers:["env","raw","byToken","byKey","byLabel"]},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",variables:"TemplateVars object",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function B(e=V){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([a,o])=>{t.push(`- window.${a}: ${o.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),(e.variables.examples||[]).forEach(a=>{t.push(`- ${a}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([a,o])=>{t.push(`- ${a}: ${o}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([a,o])=>{t.push(`- ${a}: ${o}`)}),t.join(`
`)}const D=`
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
</style>`,H=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${h}";
    var apiReference = ${JSON.stringify(V)};
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
<\/script>`,Y=`<!doctype html>
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
</html>`;function G(e=""){var c;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const a=t.match(/```(?:html)?\s*([\s\S]*?)```/i),o=((c=a==null?void 0:a[1])==null?void 0:c.trim())||t,n=o.match(/<!doctype\s+html\b|<html[\s>]/i);if(!n)return o;const i=n.index||0,r=o.slice(i).trim(),l=r.match(/<\/html\s*>/i);return l?r.slice(0,l.index+l[0].length).trim():r}function J(e=""){const t=G(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:Y}function Z(e,t,a){return e.includes(a)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Q(e,t,a){return e.includes(a)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Oe(e=""){const t=J(e),a=Q(t,H,"template-tool-bridge");return Z(a,D,"template-tool-host-style")}function W(e=[],t={}){return Array.isArray(e)?e.filter(a=>a==null?void 0:a.token).map(a=>{const o=Object.prototype.hasOwnProperty.call(t,a.token)?t[a.token]:a.previewValue;return{token:a.token,label:a.label||a.token,key:a.key||"",inputType:a.input_type||a.inputType||"text",value:o??"",internal:!!a.internal,aliases:Array.isArray(a.searchAliases)?a.searchAliases.filter(Boolean):[]}}):[]}function b(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function X(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function S(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function O(e=""){const t=S(e);return t?t.replace(/_([a-z0-9])/g,(a,o)=>o.toUpperCase()):""}function A(e=""){const t=O(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function g(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function m(e,t){const a=String(t||"").trim();!a||e.includes(a)||e.push(a)}function s(e,t){const a=String(t||"").trim();if(!a)return;m(e,a);const o=S(a),n=O(a);o&&(m(e,o),m(e,`{${o}}`)),n&&m(e,n)}function ee({label:e="",token:t="",key:a="",aliases:o=[],section:n=""}={}){const i=[];s(i,e),s(i,t),s(i,t.replace(/[{}]/g,"")),s(i,a);const r=g(a);return r.length>0&&(s(i,r[r.length-1]),s(i,r.join(" ")),s(i,r.join(""))),s(i,n),o.forEach(l=>s(i,l)),i}function te(e){const t=b(e.value);if(t==="")return null;const a={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(a.token=String(e.token)),e.key&&(a.key=String(e.key)),e.section&&(a.section=String(e.section)),a.aliases=ee({...e,...a}),a}function ae({tokens:e=[],clientInfo:t=[],clientSummary:a=[]}={}){const o=[],n=new Set,i=r=>{const l=te(r);if(!l)return;const c=`${l.source}:${l.label}:${l.value}:${l.token||""}:${l.key||""}`;n.has(c)||(n.add(c),o.push(l))};return e.forEach(r=>{i({label:r.label,value:r.value,token:r.token,key:r.key,aliases:r.aliases,source:"token"})}),a.forEach(r=>{i({label:r.label,value:r.value,section:"summary",source:"clientSummary"})}),t.forEach(r=>{((r==null?void 0:r.fields)||[]).forEach(l=>{i({label:l.label,value:l.value,section:r.title||r.id,source:"clientInfo"})})}),o}function oe(e,t,a){!t||a===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=a)}function ne(e,t,a){const o=g(t);if(o.length<2||a==="")return;let n=e;for(let r=0;r<o.length-1;r+=1){const l=o[r];if(!l||/^\d+$/.test(l)||(n[l]===void 0&&(n[l]={}),!n[l]||typeof n[l]!="object"||Array.isArray(n[l])))return;n=n[l]}const i=o[o.length-1];i&&!Object.prototype.hasOwnProperty.call(n,i)&&(n[i]=a)}function re(e={},t=[]){const a={...e};return t.forEach(o=>{o.key&&ne(a,o.key,o.value),o.aliases.forEach(n=>oe(a,n,o.value))}),a}function ie(e=[]){const t={};return e.forEach(a=>{[a.label,a.token,a.key,...a.aliases||[]].forEach(o=>{const n=X(o);!n||t[n]||(t[n]={label:a.label,value:a.value,source:a.source,token:a.token||"",key:a.key||"",section:a.section||""})})}),t}function y(e,t,a){const o=A(t);!o||a===""||Object.prototype.hasOwnProperty.call(e,o)||(e[o]=a)}function le(e,t,a){const o=g(t).map(A).filter(Boolean);if(o.length<2||a==="")return;let n=e;for(let r=0;r<o.length-1;r+=1){const l=o[r];if(n[l]===void 0&&(n[l]={}),!n[l]||typeof n[l]!="object"||Array.isArray(n[l]))return;n=n[l]}const i=o[o.length-1];i&&!Object.prototype.hasOwnProperty.call(n,i)&&(n[i]=a)}function se({fields:e=[],tokenValues:t={},environment:a={}}={}){const o={env:a,raw:t,byToken:{},byKey:{},byLabel:{}};return Object.entries(t||{}).forEach(([n,i])=>{const r=b(i);r!==""&&(o.byToken[n]=r,y(o,n,r),y(o,n.replace(/[{}]/g,""),r))}),e.forEach(n=>{const i=b(n.value);i!==""&&(n.token&&(o.byToken[n.token]=i),n.key&&(o.byKey[n.key]=i,le(o,n.key,i)),o.byLabel[n.label]=i,[n.label,n.token,n.key,...n.aliases||[]].forEach(r=>{y(o,r,i)}))}),o}function Ae({tool:e={},values:t={},tokens:a=[],client:o=null,clientInfo:n=[],clientSummary:i=[]}={}){const r=t&&typeof t=="object"?t:{},l=Array.isArray(n)?n:[],c=Array.isArray(i)?i:[],T=W(a,r),p=ae({tokens:T,clientInfo:l,clientSummary:c}),w=new Date().toISOString(),v={apiVersion:h,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:w};return{apiVersion:h,tool:{id:e.id||"",title:e.title||"",description:e.description||""},values:re(r,p),tokenValues:r,tokens:T,fields:p,fieldIndex:ie(p),variables:se({fields:p,tokenValues:r,environment:v}),environment:v,client:o&&typeof o=="object"?o:null,clientInfo:l,clientSummary:c,generatedAt:w}}function Ie({title:e="",prompt:t=""}={}){const a=String(e||"").trim()||"Custom tool",o=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.

Return one complete HTML file, and nothing else.
- Put all HTML, CSS and JavaScript in that single file.
- Prefer attaching the result as a downloadable .html file when the chat interface supports files.
- If you cannot attach a file, return exactly one fenced code block containing the full HTML document from <!doctype html> to </html>.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not include explanations before or after the file.
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Module API reference:
${B()}

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

Tool name: ${a}

User request:
${o}`}const ce=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),de=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function f(e,t){return!!(e!=null&&e[t])}function ue(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function I(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function pe(e,t){return f(e,"ctrlKey")===!!t.ctrlKey&&f(e,"altKey")===!!t.altKey&&f(e,"shiftKey")===!!t.shiftKey&&f(e,"metaKey")===!!t.metaKey}function me(e,t){return pe(e,t)&&(ue(e==null?void 0:e.key,t.key)||I(e==null?void 0:e.code,t.code))}function Le(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function fe(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(de))}function he(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||fe(e==null?void 0:e.target))}function Ee(e){if(he(e))return null;const t=ce.find(a=>me(e,a))||null;return!t||e!=null&&e.isComposing&&!I(e==null?void 0:e.code,t.code)?null:t}export{ge as C,_ as D,Te as E,ce as K,we as P,ve as T,xe as U,Ae as a,Oe as b,Ce as c,d,k as e,Le as f,Ee as g,Ie as h,Se as i,U as j,ke as l,C as n,Ve as r,N as s};
