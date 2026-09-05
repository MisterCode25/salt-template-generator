import{c as D,q as me,u as pe}from"./appConfigService--loes_4k.js";import{a0 as Ze,a1 as We,p as fe,S as W,an as be,ao as Qe,ap as Pe,D as Q,q as et,aq as he,k as tt}from"./index-CJZRTMR2.js";import{l as $,s as P,d as rt}from"./templateTreeService-drEh6u7e.js";import{C as nt}from"./tokenService-B7E3tzol.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Gr=D("chevron-right",at);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Xr=D("circle-check",ot);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],Yr=D("database",it);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],Zr=D("download",st);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],Wr=D("puzzle",lt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],Qr=D("triangle-alert",ct);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],Pr=D("upload",ut),ge="quick_tools",dt="blue",O=Object.freeze({LINK:"link",MODULE:"module"}),mt=O.LINK,pt=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],ft=new Set(pt.map(e=>e.value)),bt=new Set(Object.values(O));function ht(e){return ft.has(e)?e:dt}function Te(e){return bt.has(e)?e:mt}function gt(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function ve(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?O.MODULE:O.LINK),r=Te(t);return{...e,type:r,title:String(e.title||"").trim(),url:r===O.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:ht(e.color),order:gt(e.order),beta:r===O.MODULE?!0:!!e.beta}}async function en(){const e=await Ze(ge,[]);return Array.isArray(e)?e.map(ve).filter(Boolean):[]}async function tn(e){const t=Array.isArray(e)?e.map(ve).filter(Boolean):[];return We(ge,t)}function Tt(e=""){return Array.from(new Set(String(e||"").match(/\{[^}]+\}/g)||[]))}function ke(e){return e==null||e===""?"":String(e).replace(/<[^>]+>/g,"").trim()}function rn(e,t={}){return Tt(e).every(r=>ke(t[r])!=="")}function nn(e,t={}){return(e||"").replace(/\{[^}]+\}/g,r=>{const a=ke(t[r]);return a?encodeURIComponent(a):r})}function an(e){return Te(e==null?void 0:e.type)===O.MODULE}const vt=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function ee(e){return e==null?e:JSON.parse(JSON.stringify(e))}function F(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function _(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function xe(e=[]){return new Map(e.map(t=>[t.id,t]))}function ye(e,t){if(!e)return"";const r=[],a=new Set;let n=e;for(;n&&!a.has(n.id);)a.add(n.id),r.unshift(n.title||n.id),n=n.parentId?t.get(n.parentId):null;return r.join(" / ")}function kt(e=[]){const t=xe(e);return e.map(r=>({...r,path:ye(r,t)}))}function we(e=[],t){const r=String(t||"").trim();if(!r)return null;const a=xe(e);if(a.has(r))return a.get(r);const n=_(r);return e.find(s=>_(s.title)===n||_(ye(s,a))===n)||null}function xt(e=[],t={}){return we(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function yt(e=[],t={}){return we(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function wt(e,t={},r=null){const a=F(t.templateIds||t.templateId).map(String).filter(Boolean);if(a.length>0&&!a.includes(e.id)||r&&!(e.nodeIds||[]).includes(r.id))return!1;const n=F(t.channels||t.channel).map(i=>String(i||"").trim()).filter(Boolean);if(n.length>0&&!n.some(i=>(e.channels||[]).includes(i)))return!1;const s=String(t.title||t.templateTitle||"").trim();if(s&&_(e.title)!==_(s))return!1;const o=F(t.titleIncludes||t.templateTitleIncludes).map(_).filter(Boolean);if(o.length>0){const i=_(e.title);if(!o.some(l=>i.includes(l)))return!1}return!0}function It({template:e,sourceNode:t,targetNode:r,reason:a=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:r.id,targetNodeTitle:r.title||"",reason:a}}function Ie({nodes:e=[],templates:t=[]}={}){return{nodes:kt(e),templates:ee(t),counts:{nodes:e.length,templates:t.length}}}function Ne(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([r,a])=>{vt.has(r)&&(t[r]=a)}),t}async function Ae(){return Ie(await $())}async function Nt(){return Ae()}async function At(e=[]){const t=F(e),{nodes:r,templates:a}=await $(),n=[],s=[];return t.forEach((o,i)=>{if(!o||typeof o!="object"||Array.isArray(o)){s.push({ruleIndex:i,reason:"Rule must be an object."});return}const l=yt(r,o);if(!l){s.push({ruleIndex:i,reason:"Target topic was not found."});return}const u=xt(r,o),p=a.filter(b=>wt(b,o,u));if(p.length===0){s.push({ruleIndex:i,reason:"No templates matched this rule."});return}p.forEach(b=>{(b.nodeIds||[])[0]===l.id&&(!u||u.id===l.id)||n.push(It({template:b,sourceNode:u,targetNode:l,reason:o.reason||`Rule ${i+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:n.length,affectedTemplateCount:new Set(n.map(o=>o.templateId)).size,operations:n,skipped:s}}async function St(e=[]){const t=F(e),r=await $();let a=r.nodes,n=r.templates;const s=[],o=[];return t.forEach((i,l)=>{var p;const u=(i==null?void 0:i.action)||(i==null?void 0:i.type);if(!i||typeof i!="object"||Array.isArray(i)){o.push({operationIndex:l,reason:"Operation must be an object."});return}if(u==="moveTemplate"){const b=String(i.templateId||""),g=String(i.targetNodeId||i.toNodeId||"");if(!b||!g){o.push({operationIndex:l,reason:"moveTemplate requires templateId and targetNodeId."});return}const c=n.find(h=>h.id===b),m=i.sourceNodeId||((p=c==null?void 0:c.nodeIds)==null?void 0:p[0])||null,d=JSON.stringify(n);n=me(n,b,m,g,Number(i.targetIndex),a),JSON.stringify(n)!==d&&s.push({operationIndex:l,action:u,templateId:b,targetNodeId:g});return}if(u==="updateTemplate"){const b=String(i.templateId||"");if(!b){o.push({operationIndex:l,reason:"updateTemplate requires templateId."});return}const g=Ne(i.patch||i.fields||{}),c=JSON.stringify(n);n=pe(n,b,g),JSON.stringify(n)!==c&&s.push({operationIndex:l,action:u,templateId:b});return}o.push({operationIndex:l,reason:`Unsupported operation: ${u||"unknown"}.`})}),s.length>0&&await P({nodes:a,templates:n}),{ok:!0,appliedCount:s.length,skippedCount:o.length,applied:s,skipped:o,tree:Ie({nodes:a,templates:n})}}async function Ct(e,t={}){const r=String(e||"");if(!r)throw new Error("templateId is required.");const a=await $();if(!a.templates.some(s=>s.id===r))throw new Error("Template was not found.");const n=pe(a.templates,r,Ne(t));return await P({nodes:a.nodes,templates:n}),{ok:!0,template:ee(n.find(s=>s.id===r))}}async function Et(e,t,r={}){var u;const a=String(e||""),n=String(t||"");if(!a||!n)throw new Error("templateId and targetNodeId are required.");const s=await $();if(!s.templates.some(p=>p.id===a))throw new Error("Template was not found.");const o=s.templates.find(p=>p.id===a),i=(r==null?void 0:r.sourceNodeId)||((u=o==null?void 0:o.nodeIds)==null?void 0:u[0])||null,l=me(s.templates,a,i,n,Number(r==null?void 0:r.targetIndex),s.nodes);return await P({nodes:s.nodes,templates:l}),{ok:!0,template:ee(rt(l.find(p=>p.id===a)))}}async function on(e,t={}){switch(e){case"tool:templates:list":return Ae();case"tool:templates:get-tree":return Nt();case"tool:templates:preview-migration":return At(t.rules||t);case"tool:templates:apply-migration":return St(t.operations||t);case"tool:templates:update-template":return Ct(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return Et(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const G="template-tool-module-beta-2",Se=Object.freeze({name:"Template Generator Module API",version:G,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",containers:{"context.profile / TemplateProfile":"Normalized customer and case profile with common scalar fields, tokenValues, vars, photos and attachments.","context.variables / TemplateVars":"Variable-friendly aliases generated from profile fields, tokens and visible client fields. This is the preferred object for JavaScript property access.","TemplateVars.byToken":"Exact token lookup keyed by brace tokens such as {client_first_name}. Includes known tokens even when the current value is empty.","TemplateVars.byKey":"Lookup keyed by structured token keys such as client.firstName or contractorNumber.","TemplateVars.byLabel":"Lookup keyed by user-facing field labels from the app.","TemplateVars.available":"Discovery list for every exposed variable with names, token, key, label, value, source, inputType and internal.","TemplateVars.availableTokens":"Subset of TemplateVars.available that comes from token definitions.","TemplateVars.availableFields":"Visible normalized field list with aliases for customer-facing selectors.","context.tokens":"All configured token definitions, including manual/internal tokens and empty values.","context.fields / TemplateFields":"Best normalized list for user-facing customer, case and profile fields.","context.fieldIndex":"Normalized lookup map for labels, tokens, keys and aliases with punctuation/accent/braces removed.","context.client":"Raw imported VTI/customer payload. Use only when the module needs structured nested source data.","context.clientInfo":"Visible client detail sections used by the app UI.","context.clientSummary":"Compact client bar fields currently selected in the app."},examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']","TemplateVars.available.map((entry) => entry.name)"],reservedContainers:["env","raw","byToken","byKey","byLabel","available","availableTokens","availableFields"]},dataAccess:{appDatabase:"Authorized only through TemplateTool APIs. TemplateTool.templates reads and writes the app's IndexedDB-backed topic/template data through host services.",internet:"Public Internet API/database access is authorized for explicit user-requested public HTTP(S) read requests. Prefer TemplateTool.fetchJson(url) or TemplateTool.fetchText(url) for CORS-enabled Internet APIs/databases.",restrictions:"Do not use secrets, cookies, credentials, private/local network URLs, remote scripts, CDNs, remote fonts, eval, parent DOM access, localStorage or raw IndexedDB."},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object with scalar aliases plus available, availableTokens, availableFields, byToken, byKey and byLabel discovery containers",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.fetchJson(url)":"Promise<{ ok, status, url, contentType, data?, text?, error?, truncated? }>","TemplateTool.fetchText(url)":"Promise<{ ok, status, url, contentType, text?, error?, truncated? }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function Lt(e=Se){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([r,a])=>{t.push(`- window.${r}: ${a.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),e.variables.containers&&typeof e.variables.containers=="object"&&(t.push("","Variable containers:"),Object.entries(e.variables.containers).forEach(([r,a])=>{t.push(`- ${r}: ${a}`)})),t.push("","Variable examples:"),(e.variables.examples||[]).forEach(r=>{t.push(`- ${r}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),e.dataAccess&&typeof e.dataAccess=="object"&&(t.push("","Data access:"),Object.entries(e.dataAccess).forEach(([r,a])=>{t.push(`- ${r}: ${a}`)})),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([r,a])=>{t.push(`- ${r}: ${a}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([r,a])=>{t.push(`- ${r}: ${a}`)}),t.join(`
`)}const Ot=`
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
</style>`,_t=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${G}";
    var apiReference = ${JSON.stringify(Se)};
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
        window.TemplateProfile = safeContext.profile && typeof safeContext.profile === "object"
            ? safeContext.profile
            : {};
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
        getProfile: function () {
            return this.getContext().then(function () {
                return window.TemplateProfile || {};
            });
        },
        getVar: function (name, fallback) {
            return this.getVars().then(function (vars) {
                var key = String(name || "");
                if (!key) return fallback || "";
                if (Object.prototype.hasOwnProperty.call(vars, key)) return vars[key];
                if (vars.byToken && Object.prototype.hasOwnProperty.call(vars.byToken, key)) return vars.byToken[key];
                if (vars.byKey && Object.prototype.hasOwnProperty.call(vars.byKey, key)) return vars.byKey[key];
                if (vars.byLabel && Object.prototype.hasOwnProperty.call(vars.byLabel, key)) return vars.byLabel[key];
                var normalized = key.replace(/[{}]/g, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, "");
                var available = Array.isArray(vars.available) ? vars.available : [];
                for (var index = 0; index < available.length; index += 1) {
                    var entry = available[index] || {};
                    var names = Array.isArray(entry.names) ? entry.names : [];
                    var candidates = [entry.name, entry.token, entry.key, entry.label].concat(names);
                    var found = candidates.some(function (candidate) {
                        return String(candidate || "").replace(/[{}]/g, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, "") === normalized;
                    });
                    if (found) return entry.value !== undefined ? entry.value : (fallback || "");
                }
                return fallback || "";
            });
        },
        hasVariable: function (name) {
            return this.getVars().then(function (vars) {
                var key = String(name || "");
                if (!key) return false;
                if (Object.prototype.hasOwnProperty.call(vars, key)) return true;
                if (vars.byToken && Object.prototype.hasOwnProperty.call(vars.byToken, key)) return true;
                if (vars.byKey && Object.prototype.hasOwnProperty.call(vars.byKey, key)) return true;
                if (vars.byLabel && Object.prototype.hasOwnProperty.call(vars.byLabel, key)) return true;
                var normalized = key.replace(/[{}]/g, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, "");
                return (Array.isArray(vars.available) ? vars.available : []).some(function (entry) {
                    var names = Array.isArray(entry.names) ? entry.names : [];
                    return [entry.name, entry.token, entry.key, entry.label].concat(names).some(function (candidate) {
                        return String(candidate || "").replace(/[{}]/g, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, "") === normalized;
                    });
                });
            });
        },
        listVariables: function () {
            return this.getVars().then(function (vars) {
                var scalarKeys = Object.keys(vars).filter(function (key) {
                    var value = vars[key];
                    return value === null || typeof value !== "object";
                });
                var availableKeys = [];
                (Array.isArray(vars.available) ? vars.available : []).forEach(function (entry) {
                    if (entry.name) availableKeys.push(entry.name);
                    (Array.isArray(entry.names) ? entry.names : []).forEach(function (name) {
                        if (name) availableKeys.push(name);
                    });
                });
                return scalarKeys.concat(availableKeys).filter(function (key, index, all) {
                    return key && all.indexOf(key) === index;
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
        fetchJson: function (url) {
            return post("tool:fetch-json", { url: String(url || "") }, true);
        },
        fetchText: function (url) {
            return post("tool:fetch-text", { url: String(url || "") }, true);
        },
        close: function () {
            return post("tool:close", {}, false);
        },
        templates: {
            list: function () {
                return post("tool:templates:list", {}, true);
            },
            getTree: function () {
                return post("tool:templates:get-tree", {}, true);
            },
            previewMigration: function (rules) {
                return post("tool:templates:preview-migration", { rules: rules || [] }, true);
            },
            applyMigration: function (operations) {
                return post("tool:templates:apply-migration", { operations: operations || [] }, true);
            },
            updateTemplate: function (templateId, patch) {
                return post("tool:templates:update-template", {
                    templateId: String(templateId || ""),
                    patch: patch || {}
                }, true);
            },
            moveTemplate: function (templateId, targetNodeId, options) {
                return post("tool:templates:move-template", {
                    templateId: String(templateId || ""),
                    targetNodeId: String(targetNodeId || ""),
                    options: options || {}
                }, true);
            }
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
<\/script>`,Dt=`<!doctype html>
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
</html>`;function Rt(e=""){var l;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const r=t.match(/```(?:html)?\s*([\s\S]*?)```/i),a=((l=r==null?void 0:r[1])==null?void 0:l.trim())||t,n=a.match(/<!doctype\s+html\b|<html[\s>]/i);if(!n)return a;const s=n.index||0,o=a.slice(s).trim(),i=o.match(/<\/html\s*>/i);return i?o.slice(0,i.index+i[0].length).trim():o}function Vt(e=""){const t=Rt(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:Dt}function jt(e,t,r){return e.includes(r)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Bt(e,t,r){return e.includes(r)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function sn(e=""){const t=Vt(e),r=Bt(t,_t,"template-tool-bridge");return jt(r,Ot,"template-tool-host-style")}const se=3e5;function Ft(e=""){const t=e.split(".").map(n=>Number(n));if(t.length!==4||t.some(n=>!Number.isInteger(n)||n<0||n>255))return!1;const[r,a]=t;return r===0||r===10||r===127||r===169&&a===254||r===172&&a>=16&&a<=31||r===192&&a===168}function zt(e=""){try{const t=new URL(String(e||"").trim());if(!["http:","https:"].includes(t.protocol))return!1;const r=t.hostname.toLowerCase().replace(/^\[|\]$/g,"");return!(!r||r==="localhost"||r.endsWith(".localhost")||r.endsWith(".local")||r==="::1"||r==="0:0:0:0:0:0:0:1"||Ft(r))}catch{return!1}}async function ln({url:e="",responseType:t="json"}={}){const r=String(e||"").trim(),a=t==="json";if(!zt(r))return{ok:!1,status:0,url:r,contentType:"",error:"Only public http/https URLs can be fetched by a module."};try{const n=await fetch(r,{method:"GET",credentials:"omit",cache:"no-store",redirect:"follow",headers:{Accept:a?"application/json, text/plain;q=0.8, */*;q=0.5":"text/plain, application/json;q=0.8, */*;q=0.5"}}),s=n.headers.get("content-type")||"",o=await n.text(),i=o.length>se,l=i?o.slice(0,se):o,u={ok:n.ok,status:n.status,url:n.url||r,contentType:s,truncated:i};if(!a)return{...u,text:l};try{return{...u,data:l?JSON.parse(l):null}}catch{return{...u,ok:!1,text:l,error:"The Internet response was not valid JSON."}}}catch(n){return{ok:!1,status:0,url:r,contentType:"",error:(n==null?void 0:n.message)||"Internet request failed."}}}function $t(e=[],t={}){return Array.isArray(e)?e.filter(r=>r==null?void 0:r.token).map(r=>{const a=Object.prototype.hasOwnProperty.call(t,r.token)?t[r.token]:r.previewValue;return{token:r.token,label:r.label||r.token,key:r.key||"",inputType:r.input_type||r.inputType||"text",value:a??"",internal:!!r.internal,aliases:Array.isArray(r.searchAliases)?r.searchAliases.filter(Boolean):[]}}):[]}function E(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function X(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function Ce(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Ee(e=""){const t=Ce(e);return t?t.replace(/_([a-z0-9])/g,(r,a)=>a.toUpperCase()):""}function z(e=""){const t=Ee(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function te(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function M(e,t){const r=String(t||"").trim();!r||e.includes(r)||e.push(r)}function S(e,t){const r=String(t||"").trim();if(!r)return;M(e,r);const a=Ce(r),n=Ee(r);a&&(M(e,a),M(e,`{${a}}`)),n&&M(e,n)}function Le({label:e="",token:t="",key:r="",aliases:a=[],section:n=""}={}){const s=[];S(s,e),S(s,t),S(s,t.replace(/[{}]/g,"")),S(s,r);const o=te(r);return o.length>0&&(S(s,o[o.length-1]),S(s,o.join(" ")),S(s,o.join(""))),S(s,n),a.forEach(i=>S(s,i)),s}function Mt(e){const t=E(e.value);if(t==="")return null;const r={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(r.token=String(e.token)),e.key&&(r.key=String(e.key)),e.section&&(r.section=String(e.section)),r.aliases=Le({...e,...r}),r}function Ut({tokens:e=[],clientInfo:t=[],clientSummary:r=[],profile:a=null}={}){const n=[],s=new Set,o=i=>{const l=Mt(i);if(!l)return;const u=`${l.source}:${l.label}:${l.value}:${l.token||""}:${l.key||""}`;s.has(u)||(s.add(u),n.push(l))};return e.forEach(i=>{o({label:i.label,value:i.value,token:i.token,key:i.key,aliases:i.aliases,source:"token"})}),r.forEach(i=>{o({label:i.label,value:i.value,section:"summary",source:"clientSummary"})}),t.forEach(i=>{((i==null?void 0:i.fields)||[]).forEach(l=>{o({label:l.label,value:l.value,section:i.title||i.id,source:"clientInfo"})})}),a&&typeof a=="object"&&(Array.isArray(a.availableFields)?a.availableFields:[]).forEach(i=>{o({label:i.label,value:i.value,key:i.key,aliases:i.aliases,source:"profile"})}),n}function qt(e,t,r){!t||r===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=r)}function Kt(e,t,r){const a=te(t);if(a.length<2||r==="")return;let n=e;for(let o=0;o<a.length-1;o+=1){const i=a[o];if(!i||/^\d+$/.test(i)||(n[i]===void 0&&(n[i]={}),!n[i]||typeof n[i]!="object"||Array.isArray(n[i])))return;n=n[i]}const s=a[a.length-1];s&&!Object.prototype.hasOwnProperty.call(n,s)&&(n[s]=r)}function Jt(e={},t=[]){const r={...e};return t.forEach(a=>{a.key&&Kt(r,a.key,a.value),a.aliases.forEach(n=>qt(r,n,a.value))}),Oe(r,t),r}const Ht=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function Gt(e,t){const r=X(t);return!e||!r?!1:[e.label,e.token,e.key,...e.aliases||[]].some(a=>X(a)===r)}function Xt(e=[],t=[]){for(const r of t){const a=e.find(s=>Gt(s,r)),n=E(a==null?void 0:a.value);if(n!=="")return n}return""}function Oe(e,t=[]){Ht.forEach(({name:r,candidates:a})=>{if(Object.prototype.hasOwnProperty.call(e,r))return;const n=Xt(t,a);n!==""&&(e[r]=n)})}function Yt({tokens:e=[],fields:t=[],variables:r={}}={}){const a=[],n=new Set,s=o=>{const i=Array.isArray(o.names)?o.names.filter(Boolean):[],l=[o.token||"",o.key||"",o.label||"",o.source||"",i.join("|")].join(":");n.has(l)||(n.add(l),a.push({name:i[0]||o.token||o.key||o.label||"",names:i,token:o.token||"",key:o.key||"",label:o.label||"",value:E(o.value),source:o.source||"context",inputType:o.inputType||"",internal:!!o.internal}))};return e.forEach(o=>{const l=Le({label:o.label,token:o.token,key:o.key,aliases:o.aliases}).map(z).filter(Boolean);s({names:[...new Set(l)],token:o.token,key:o.key,label:o.label,value:o.value,source:"token",inputType:o.inputType,internal:o.internal})}),t.forEach(o=>{const l=[o.label,o.token,o.key,...o.aliases||[]].map(z).filter(Boolean);s({names:[...new Set(l)],token:o.token,key:o.key,label:o.label,value:o.value,source:o.source})}),Object.entries(r).forEach(([o,i])=>{!o||i===null||typeof i=="object"||s({names:[o],label:o,value:i,source:"variable"})}),a.sort((o,i)=>o.name.localeCompare(i.name))}function Zt(e=[]){const t={};return e.forEach(r=>{[r.label,r.token,r.key,...r.aliases||[]].forEach(a=>{const n=X(a);!n||t[n]||(t[n]={label:r.label,value:r.value,source:r.source,token:r.token||"",key:r.key||"",section:r.section||""})})}),t}function H(e,t,r){const a=z(t);!a||r===""||Object.prototype.hasOwnProperty.call(e,a)||(e[a]=r)}function Wt(e,t,r){const a=te(t).map(z).filter(Boolean);if(a.length<2||r==="")return;let n=e;for(let o=0;o<a.length-1;o+=1){const i=a[o];if(n[i]===void 0&&(n[i]={}),!n[i]||typeof n[i]!="object"||Array.isArray(n[i]))return;n=n[i]}const s=a[a.length-1];s&&!Object.prototype.hasOwnProperty.call(n,s)&&(n[s]=r)}function Qt(e,t=null){if(!t||typeof t!="object")return;const r=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(r).forEach(([a,n])=>{const s=E(n);s!==""&&H(e,a,s)})}function Pt({fields:e=[],tokens:t=[],tokenValues:r={},environment:a={},profile:n=null}={}){const s={env:a,raw:r,byToken:{},byKey:{},byLabel:{},available:[],availableTokens:[],availableFields:[]};return t.forEach(o=>{o.token&&(s.byToken[o.token]=E(o.value))}),Object.entries(r||{}).forEach(([o,i])=>{const l=E(i);s.byToken[o]=l,l!==""&&(H(s,o,l),H(s,o.replace(/[{}]/g,""),l))}),Qt(s,n),e.forEach(o=>{const i=E(o.value);i!==""&&(o.token&&(s.byToken[o.token]=i),o.key&&(s.byKey[o.key]=i,Wt(s,o.key,i)),s.byLabel[o.label]=i,[o.label,o.token,o.key,...o.aliases||[]].forEach(l=>{H(s,l,i)}))}),Oe(s,e),s.available=Yt({tokens:t,fields:e,variables:s}),s.availableTokens=s.available.filter(o=>o.token),s.availableFields=e.map(o=>({name:z(o.key||o.token||o.label),token:o.token||"",key:o.key||"",label:o.label||"",value:o.value,source:o.source||"context",aliases:o.aliases||[]})),s}function cn({tool:e={},values:t={},tokens:r=[],client:a=null,clientInfo:n=[],clientSummary:s=[],profile:o=null}={}){const i=t&&typeof t=="object"?t:{},l=o&&typeof o=="object"?o:null,u=l!=null&&l.tokenValues&&typeof l.tokenValues=="object"?l.tokenValues:{},p={...i,...u},b=Array.isArray(n)?n:[],g=Array.isArray(s)?s:[],c=$t(r,p),m=Ut({tokens:c,clientInfo:b,clientSummary:g,profile:l}),d=new Date().toISOString(),h={apiVersion:G,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:d};return{apiVersion:G,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:l||null,values:Jt(p,m),tokenValues:p,tokens:c,fields:m,fieldIndex:Zt(m),variables:Pt({fields:m,tokens:c,tokenValues:p,environment:h,profile:l}),environment:h,client:a&&typeof a=="object"?a:null,clientInfo:b,clientSummary:g,generatedAt:d}}function er(e=""){const t=String(e||"").trim(),r=t.match(/^```(?:json|text)?\s*([\s\S]*?)\s*```$/i);return r?r[1].trim():t}function un(e=""){const t=er(e);if(!t)return"";try{const r=JSON.parse(t);return r&&typeof r=="object"&&!Array.isArray(r)&&typeof r.html=="string"&&r.html.trim()?r.html.trim():""}catch{return""}}function U(e=""){const t=E(e);return t?`value: ${t.slice(0,80)}${t.length>80?"…":""}`:"empty now"}function tr(e={}){const t=Array.isArray(e.names)?e.names.filter(Boolean):[];return[...new Set([e.name,...t].filter(Boolean))].slice(0,8).join(", ")}function rr(e=null){var l;if(!e||typeof e!="object")return"No live app context was loaded while copying this prompt. The module must discover variables at runtime with TemplateTool.getContext(), TemplateTool.getVars(), TemplateTool.listVariables(), context.tokens and context.fields.";const t=["Live variable inventory from the current app context:","Use these exact names/tokens/keys when they fit the request, and still keep runtime fallbacks because availability changes per customer."],r=e.profile&&typeof e.profile=="object"?e.profile:null,a=r!=null&&r.vars&&typeof r.vars=="object"?r.vars:{},n=Object.entries(a).filter(([,u])=>E(u)!=="").sort(([u],[p])=>u.localeCompare(p));n.length>0&&(t.push("","Profile variables (TemplateProfile / TemplateVars aliases):"),n.forEach(([u,p])=>{t.push(`- ${u} (${U(p)})`)}));const s=Array.isArray((l=e.variables)==null?void 0:l.available)?e.variables.available:[];s.length>0&&(t.push("","Discoverable TemplateVars.available entries:"),s.forEach(u=>{const p=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",`names: ${tr(u)||"none"}`,`source ${u.source||"context"}`,U(u.value)].filter(Boolean);t.push(`- ${p.join("; ")}`)}));const o=Array.isArray(e.fields)?e.fields:[];o.length>0&&(t.push("","Resolved context.fields (preferred for visible customer data):"),o.forEach(u=>{const p=[u.label?`label ${u.label}`:"",u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.section?`section ${u.section}`:"",`source ${u.source||"context"}`,U(u.value)].filter(Boolean);t.push(`- ${p.join("; ")}`)}));const i=Array.isArray(e.tokens)?e.tokens:[];return i.length>0&&(t.push("","All configured context.tokens, including empty values:"),i.forEach(u=>{const p=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",u.inputType?`type ${u.inputType}`:"",u.internal?"internal":"manual/configured",U(u.value)].filter(Boolean);t.push(`- ${p.join("; ")}`)})),n.length===0&&s.length===0&&o.length===0&&i.length===0&&t.push("- No variables are currently configured or populated in this context. Build a missing-data state and rely on runtime discovery."),t.join(`
`)}function dn({title:e="",prompt:t="",runtimeContext:r=null}={}){const a=String(e||"").trim()||"Custom tool",n=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.
Act as a senior frontend engineer building a compact operational support tool.

Return exactly one valid JSON object, and nothing else.

JSON shape:
{
  "html": "<!doctype html>..."
}

- Put one complete HTML file in the html string.
- Put all HTML, CSS and JavaScript in that single HTML document.
- Escape the HTML as a valid JSON string.
- The JSON must parse with JSON.parse.
- Do not add extra JSON fields.
- Do not return raw HTML, markdown fences, downloadable files, explanations, notes or comments outside JSON.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not use external JavaScript/CSS dependencies, CDNs, remote fonts, build steps, module imports or remote scripts.
- Public Internet/API/database reads are allowed when the user request needs them. Use TemplateTool.fetchJson(url), TemplateTool.fetchText(url), or browser fetch for public CORS-enabled HTTP(S) endpoints.

Priority order:
1. JSON validity and single-file module constraints.
2. Security and host runtime rules.
3. TemplateTool API, variable discovery and data-access rules.
4. User request.
5. Visual style guidance.

Generation contract:
- Read the user request literally and implement only that workflow.
- Do not add unrelated dashboards, tabs, settings, history, import/export, theme switches, fake navigation, sample records, analytics, onboarding, help copy or extra panels unless the user explicitly requested them or they are required for the requested action.
- Every visible control must map to a requested user action, a required validation step or a TemplateTool API operation.
- If the request is vague, build the smallest useful module for the named task and show missing requirements inside the module instead of inventing behavior.
- Use real app context, TemplateTool APIs and user-requested public Internet API responses only. Do not prefill fake topics, templates, clients, IDs or example data.
- Keep all user-facing copy short and operational.

Module API reference:
${Lt()}

Current variable inventory:
${rr(r)}

Runtime:
- The file runs inside an iframe.
- The host app injects window.TemplateTool before your script runs.
- Use await window.TemplateTool.getContext() to read the current app context.
- Context shape: { apiVersion, tool: { id, title, description }, profile, values, tokenValues, variables, environment, tokens, fields, fieldIndex, client, clientInfo, clientSummary, generatedAt }.
- profile is the simplest normalized customer object. Read it with await window.TemplateTool.getProfile() or context.profile. Common fields: profile.clientName, profile.contractorNumber, profile.mobile, profile.activationDate, profile.otoId, profile.routerSerialNumber, profile.soTicketNum, profile.externalId, profile.photos, profile.attachments, profile.vars and profile.tokenValues.
- tokenValues is the original object keyed by token strings, for example tokenValues["{client_first_name}"].
- values keeps those token keys and also includes host-generated aliases such as values.client.firstName, values.firstName and values.clientFirstName when they come from real data.
- variables is the easiest API for module JavaScript. It is also exposed globally as window.TemplateVars and contains safe JS property names from the profile such as TemplateVars.clientName, TemplateVars.contractorNumber, TemplateVars.mobile, TemplateVars.activationDate, TemplateVars.otoId, TemplateVars.soTicketNum, plus TemplateVars.byToken, TemplateVars.byKey, TemplateVars.byLabel, TemplateVars.raw and discovery lists.
- All known token definitions are exposed, including empty/missing values: context.tokens lists every token definition, TemplateVars.byToken has every token key, and TemplateVars.available / TemplateVars.availableTokens list discoverable names with { name, names, token, key, label, value, source, inputType, internal }.
- Do not hard-code an assumed token list. At startup, call const context = await TemplateTool.getContext(); const vars = await TemplateTool.getVars(); then derive selectable variables from context.tokens, context.fields, vars.available, vars.availableTokens, vars.availableFields and await TemplateTool.listVariables().
- If the module lets the user calculate or operate on variables, include a compact variable picker/search built from the live context instead of expecting the AI to know variable names in advance.
- Do not say variables are unavailable just because the prompt did not list the exact requested name. Search context.tokens, context.fields, TemplateVars.available, TemplateVars.availableTokens, TemplateVars.availableFields, TemplateVars.byToken, TemplateVars.byKey, TemplateVars.byLabel and context.clientInfo first.
- environment is also exposed globally as window.TemplateEnv and contains { apiVersion, toolId, toolTitle, toolDescription, generatedAt }.
- The normalized profile is exposed globally as window.TemplateProfile, the full context as window.TemplateContext, and normalized fields as window.TemplateFields.
- The API reference is exposed globally as window.TemplateAPI and through window.TemplateTool.describeApi().
- tokens is an array of available variables: [{ token, label, key, inputType, value, internal, aliases }].
- fields is the preferred normalized list for generated modules: [{ label, value, source, token, key, section, aliases }].
- fieldIndex is keyed by normalized names with accents, braces and separators removed.
- client is the raw imported client payload when available, otherwise null.
- clientInfo is an array of visible client detail sections: [{ id, title, fields: [{ label, value }] }].
- clientSummary is the compact client bar data: [{ label, value }].
- Prefer await window.TemplateTool.findField(["birth date", "date de naissance", "dob"]) for user-facing data lookup.
- Use await window.TemplateTool.getFieldValue(["mobile", "phone"], "") when only the string value is needed.
- Use await window.TemplateTool.getProfile() when you want the normalized customer profile object.
- Use await window.TemplateTool.getVars() or window.TemplateVars after getContext() when you want variable-style access.
- Use await window.TemplateTool.getVar("clientName", "") for a single variable. getVar also accepts token strings like "{client_first_name}", keys and labels when present.
- Use await window.TemplateTool.hasVariable(name) to check availability without treating an empty value as missing.
- Use await window.TemplateTool.listVariables() when you need to discover the variable names available in the current context; it includes safe aliases from TemplateVars.available, not only populated scalar values.
- Use window.TemplateTool.describeApi() when you need the static API reference.
- Use await window.TemplateTool.templates.getTree() or .list() when a trusted module needs the current topic/template tree.
- Use await window.TemplateTool.templates.previewMigration(rules) before writing migrations. Rules may target topics by id, title, or path with fields like { fromTopic, toTopic, channel, titleIncludes }.
- Use await window.TemplateTool.templates.applyMigration(preview.operations) to apply reviewed migration operations through the host storage service.
- Use await window.TemplateTool.templates.updateTemplate(templateId, patch) or .moveTemplate(templateId, targetNodeId, options) for focused edits.
- Use await window.TemplateTool.fetchJson("https://example.com/data.json") for public Internet JSON/database lookups requested by the user.
- Use await window.TemplateTool.fetchText("https://example.com/file.txt") for public text/HTML/CSV lookups requested by the user.
- Use window.TemplateTool.copyText(text, message) to copy plain text.
- Use window.TemplateTool.copyHtml(html, message) to copy formatted HTML.
- Use window.TemplateTool.toast(message, "info" | "success" | "warning" | "error") for feedback.
- Use window.TemplateTool.openUrl(url) for external pages.
- Use window.TemplateTool.close() if your tool has a close action.
- Call window.TemplateTool.requestResize() after expanding/collapsing content, adding rows, changing validation messages or rendering async data.

Available data rules:
- Never invent variable names or sample values. Read the actual context returned by getContext().
- Prefer context.profile, TemplateProfile, TemplateTool.getProfile(), TemplateVars, TemplateTool.getVars(), TemplateTool.findField, context.fields, context.fieldIndex and context.clientInfo for user-facing data because they describe the available variables.
- Do not rely only on semantic object paths like context.values.client.birthDate. Use the variable/token discovery lists first, field helpers second, tokenValues/byToken when an exact token is known, then context.client last for raw nested data.
- Use context.client only when structured raw data is needed.
- If a required field is missing from context.tokens, TemplateVars.available, context.fields, context.clientInfo and context.client, show a clear missing-data state instead of guessing.
- For date tools, accept common formats like YYYY-MM-DD and DD.MM.YYYY, but only calculate from an actual available value.

Internet and database access:
- App database access is authorized through TemplateTool APIs only. Use TemplateTool.templates.* for topic/template reads, previews and writes.
- Public Internet database/API access is authorized when the user request needs external data. Prefer TemplateTool.fetchJson(url) or TemplateTool.fetchText(url); these are GET-only public HTTP(S) reads, omit credentials and block localhost/private-network URLs.
- Plain browser fetch is also allowed for public CORS-enabled HTTP(S) endpoints when TemplateTool.fetchJson/fetchText is not enough.
- Do not invent API keys, passwords, headers or private endpoints. If an external service requires authentication or a proxy, include a compact input/state explaining what is needed.
- Keep network reads visible in the UI: show loading, source URL/domain, failure state and empty state. Avoid background polling unless explicitly requested.

Template tree and migration rules:
- TemplateTool.templates is the host-mediated full-access layer for trusted modules. Use it instead of raw IndexedDB, localStorage hacks or parent DOM access.
- list() and getTree() return the live topic/template tree from the app storage service.
- previewMigration(rules) accepts an array of rule objects. Rule targets can use topic ids, topic titles or paths. Useful fields include fromTopic, toTopic, fromNodeId, toNodeId, channel, channels, title, templateTitle, titleIncludes, templateTitleIncludes, templateId, templateIds and reason.
- Show the preview result before mutating storage: operation count, affected templates, skipped items and enough template/topic labels for the user to verify the move.
- Apply migrations only from a clear user action such as an Apply button, unless the user explicitly requested an automatic action.
- For risky operations, keep the UI focused on review and rollback clarity: no hidden writes, no silent bulk edits and no mutation without feedback.
- After applyMigration, updateTemplate or moveTemplate succeeds, show a concise success state and call requestResize() if the visible result changes.

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
- Make the interface shape specific to the requested job. Migration tools should feel like review tables or rule builders; calculators should feel like input/result panels; inspectors should feel like searchable lists; copy helpers should feel like compact composers.
- Avoid repeating the same generic module layout. Do not always use a header block, stats grid, centered card, icon pills or decorative preview panel unless that structure fits the request.
- Use a restrained app-like palette with white or very light surfaces, dark readable text, one purposeful accent color and state colors for success, warning and destructive actions. The accent may change per module when it helps distinguish the workflow.
- Use 8px radius or less, clear labels, dense spacing, aligned controls and visible focus states.
- Buttons should look like app tools: bordered, solid when primary, quiet when secondary.
- Avoid decorative gradients, big hero sections, stock imagery, ornamental icons and explanatory marketing copy.
- Keep copy operational and short. Do not explain what the app is or how modules work unless the user asked for help text.

Robustness:
- Do not assume a token exists. Read values defensively.
- Keep the layout responsive from 360px to desktop.
- Use type="button" on action buttons so forms do not submit unexpectedly.
- Ensure empty, loading and error states remain inside the same compact layout.
- Never write to localStorage or IndexedDB directly. Use TemplateTool APIs for app data writes.
- Validate input before copying, opening URLs or writing through TemplateTool APIs.
- Avoid eval, Function constructors, inline remote scripts and hidden or credentialed network calls.

Before returning, verify silently:
- The whole answer is exactly one JSON object with only an html string field.
- The html string contains a complete document from <!doctype html> to </html>.
- The module uses TemplateTool APIs for app data and copy actions.
- The module does not invent customer data or unsupported variables.
- The interface is compact, responsive and specific to the requested job.

Tool name: ${a}

User request:
${n}`}const re="salt-templater-alo-autofill",nr=1,ar="https://wholesale.swisscom.com/wsg/prod/alo/fuf/web/alo-web/fulfillment/detail.do",or="https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do?clearModel=true";function mn(e=(r=>(r=(t=>(t=globalThis.window)==null?void 0:t.open)())==null?void 0:r.bind(globalThis.window))()){return typeof e!="function"?null:e(or,"_blank","noopener,noreferrer")}const q=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function A(e){return e==null?"":String(e).trim()}function k(e){for(const t of e){const r=A(t);if(r)return r}return""}function le(e){const t=A(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:A(e)}function V(e){const t=A(e);if(!t)return"";const r=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(r)return`${r[1]}-${r[2]}-${r[3]}`;const a=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(a)return`${a[3]}-${a[2]}-${a[1]}`;const n=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return n?`${n[3]}-${n[1].padStart(2,"0")}-${n[2].padStart(2,"0")}`:t}function L(e){const t=V(e),r=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return r?`${r[3]}.${r[2]}.${r[1]}`:t}function ir(e={}){var t,r,a,n,s,o,i;return k([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activationDate,(a=e==null?void 0:e.client)==null?void 0:a.activation_date,(n=e==null?void 0:e.client)==null?void 0:n.activation,(s=e==null?void 0:e.client)==null?void 0:s.dateActivation,(o=e==null?void 0:e.contact)==null?void 0:o.activationDate,(i=e==null?void 0:e.healthcheck)==null?void 0:i.activationDate])}function sr(e={}){var t,r,a,n,s,o;return k([(t=e==null?void 0:e.contact)==null?void 0:t.providerOrderRef,(r=e==null?void 0:e.contact)==null?void 0:r.provider_order_ref,(a=e==null?void 0:e.client)==null?void 0:a.providerOrderRef,(n=e==null?void 0:e.client)==null?void 0:n.provider_order_ref,(s=e==null?void 0:e.healthcheck)==null?void 0:s.orderId,(o=e==null?void 0:e.healthcheck)==null?void 0:o.order_id,e==null?void 0:e.orderId,e==null?void 0:e.order_id])}function lr(e={}){var s;const t=k([e==null?void 0:e.firstPostAt,e==null?void 0:e.firstPostDate,e==null?void 0:e.firstMessageAt,e==null?void 0:e.firstMessageDate]);if(t)return t;const r=(Array.isArray(e==null?void 0:e.attachments)?e.attachments:[]).map(o=>{var l,u;const i=o==null?void 0:o.messageIndex;return{date:k([o==null?void 0:o.date,o==null?void 0:o.messageDate,o==null?void 0:o.messageDateTime,o==null?void 0:o.createdAt,(l=o==null?void 0:o.message)==null?void 0:l.date,(u=o==null?void 0:o.message)==null?void 0:u.createdAt]),messageIndex:i==null||i===""?null:Number(i)}}).filter(o=>o.date&&V(o.date)),a=r.filter(o=>Number.isInteger(o.messageIndex)),n=a.length>0?a:r;return n.sort((o,i)=>a.length>0&&o.messageIndex!==i.messageIndex?o.messageIndex-i.messageIndex:V(o.date).localeCompare(V(i.date))),((s=n[0])==null?void 0:s.date)||""}function cr(e={}){const t=A(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function ur(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",r=e.signalState==="never"?"never":"lost",a=t==="lowBadRxTx"?"Bad signal":"No signal",n=L(r==="never"?e.activationDate:e.disconnectionDate);return[a,r==="never"?"Never activated":"Signal lost",n].filter(Boolean).join(" - ")}function dr(e={}){const t=L(e.disconnectionDate),r=L(e.activationDate),a=e.signalState==="never"?r:t;return{[nt]:a}}function pn(e,t,r){return!e||typeof r!="function"?null:r(e,dr(t))}function fn(e={},t={}){var l,u,p;const r=k([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(u=e==null?void 0:e.client)==null?void 0:u.externalId,(p=e==null?void 0:e.superOffice)==null?void 0:p.externalTicketId]),a=fe(r),n=a.ok?a.fields:{},s=cr(n),o=V(ir(e)),i=V(lr(t));return{externalId:r,externalFields:n,aloType:"",signalState:s,disconnectionDate:i,activationDate:o,description:""}}function _e(e={}){return{firstName:A(e.firstName),lastName:A(e.lastName),email:A(e.email),phoneNumber:k([e.phoneNumber,e.phone])}}function mr(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:k([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[W],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:A(e==null?void 0:e.externalTicketId),tokenValues:t}}function pr(e={},t={},r={},a={}){const n=(e==null?void 0:e.client)||{},s=(e==null?void 0:e.contact)||{},o=(e==null?void 0:e.healthcheck)||{},i=_e(t),l=le(k([s.fixedNumber,s.voipNumber,s.voip,s.sip,n.fixedNumber,n.fixedPhone])),u=le(k([n.mobile,n.mobileRaw,n.phone,n.telephone,s.mobile,s.phone])),p=k([a.description,a.aloType==="lowBadRxTx"?"Bad signal":"",q.problemDescription]),b=k([a.notes,a.signalState?ur(a):"",q.problemNotes]),g=a.signalState==="never"?L(a.activationDate):L(a.disconnectionDate);return{externalReference:A(a.extRef),socketId:k([o.otoId,o.oto_id,o.oto]),plugNr:k([o.otoPortId,o.otoPort,o.oto_port]),breakoutCable:k([o.breakoutCableId,o.breakoutCable,o.cable]),breakoutFiber:k([o.fiberNumber,o.fiber,o.fibre]),firstName:k([n.firstName,n.firstname,n.givenName]),lastName:k([n.lastName,n.lastname,n.surname,n.familyName]),contactPhone1:k([l,u]),contactPhone2:l&&u&&l!==u?u:"",contactEmail:k([n.email,n.mail,s.email,s.mail]),notificationType:"Email",preferredContactType:"Mobile",ispFirstName:i.firstName,ispLastName:i.lastName,ispPhone:i.phoneNumber,ispEmail:i.email,...q,problemDescription:p,problemNotes:b,problemDateTime:g,problemCode3:a.aloType==="lowBadRxTx"?"Performance problem":q.problemCode3}}function bn(e={},t={},r={},a={}){const n=pr(e,t,r,a),s=_e(t),o=mr(r);return{source:re,version:nr,fields:n,alo:{orderId:sr(e),type:a.aloType||"noSignal",signalState:a.signalState||"",disconnectionDate:L(a.disconnectionDate),activationDate:L(a.activationDate),problemDateTime:n.problemDateTime,notes:a.notes||""},client:{firstName:n.firstName,lastName:n.lastName,contactPhone1:n.contactPhone1,contactPhone2:n.contactPhone2,email:n.contactEmail},technical:{socketId:n.socketId,plugNr:n.plugNr,breakoutCable:n.breakoutCable,breakoutFiber:n.breakoutFiber},agent:s,superOffice:o}}function fr(e){var n,s,o;if(!e||typeof e.querySelectorAll!="function")return"";const t=i=>String(i??"").replace(/\s+/g," ").trim(),r=Array.from(e.querySelectorAll(".tooltipCode")).find(i=>t(i==null?void 0:i.textContent)==="translationId=global.extRef"),a=t((o=(s=(n=r==null?void 0:r.closest)==null?void 0:n.call(r,"td"))==null?void 0:s.nextElementSibling)==null?void 0:o.textContent);return a&&a!=="-"?a:""}function De(e,t){function r(c){return c==null?"":String(c).trim()}function a(c){for(var m=0;m<c.length;m+=1){var d=r(c[m]);if(d)return d}return""}function n(c){var m=r(c),d=m.replace(/\D/g,"");return d.indexOf("0041")===0&&d.length===13?"0"+d.slice(4):d.indexOf("41")===0&&d.length===11?"0"+d.slice(2):d.indexOf("0")===0&&d.length===10?d:m}function s(c,m){var d=r(c).replace(/\D/g,""),h=r(m).replace(/\D/g,"");return!!(d&&h&&d===h)}function o(c){return r(c).replace(/[&<>"']/g,function(d){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[d]})}function i(c,m,d){var h=document.getElementById("saltAloFillOverlay");h&&h.remove();var T=document.createElement("div");T.id="saltAloFillOverlay",T.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(d==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",T.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+o(c)+"</strong><span style='color:#d8d8df'>"+o(m)+"</span>",document.body.appendChild(T),d!=="error"&&setTimeout(function(){try{T.remove()}catch{}},4500)}function l(c,m,d){var h=c&&c.fields||{};return a([h[m]].concat(d||[]))}function u(c,m){var d=String(m).replace(/["\\]/g,"\\$&");return document.querySelector("["+c+'="'+d+'"]')}function p(c){return document.getElementById(c)||u("name",c)||u("formcontrolname",c)||u("data-testid",c)}function b(c,m,d){var h=d?String(m??""):r(m);if(!d&&!h)return!1;var T=p(c);if(!T)return!1;if(T.tagName==="SELECT")for(var I=r(h).toLowerCase(),N=0;N<T.options.length;N+=1){var R=T.options[N];if(r(R.value).toLowerCase()===I||r(R.textContent).toLowerCase()===I){T.value=R.value;break}}else"value"in T?T.value=h:T.textContent=h;return T.dispatchEvent(new Event("input",{bubbles:!0})),T.dispatchEvent(new Event("change",{bubbles:!0})),!0}function g(c){if(!c||typeof c!="object"||Array.isArray(c)){i("ALO fill","ALO fill data invalid.","error");return}if(c.source&&c.source!==e){i("ALO fill","Clipboard does not contain ALO fill data from Salt BO tools.","error");return}var m=c.client||{},d=c.technical||c.healthcheck||{},h=c.agent||{},T=0,I=n(l(c,"contactPhone1",[m.contactPhone1,m.fixedNumber,m.mobileRaw,m.mobile,m.phone])),N=n(l(c,"contactPhone2",[m.contactPhone2])),R=I||N,He=I&&N&&!s(I,N)?N:"";function v(Ge,Xe,Ye){b(Ge,Xe,Ye)&&(T+=1)}if(v("ticket.extRef",l(c,"externalReference",[])),v("ticket.socketId",l(c,"socketId",[d.socketId,d.otoId,d.oto_id,d.oto])),v("ticket.plugNr",l(c,"plugNr",[d.plugNr,d.otoPortId,d.otoPort,d.oto_port])),v("ticket.breakoutCable",l(c,"breakoutCable",[d.breakoutCable,d.breakoutCableId,d.cable])),v("ticket.breakoutFiber",l(c,"breakoutFiber",[d.breakoutFiber,d.fiberNumber,d.fiber,d.fibre])),v("ticket.otoAddress.firstName",l(c,"firstName",[m.firstName,m.firstname,m.givenName])),v("ticket.otoAddress.lastName",l(c,"lastName",[m.lastName,m.lastname,m.surname,m.familyName])),v("ticket.contactPersonFirstName",l(c,"firstName",[m.firstName,m.firstname,m.givenName])),v("ticket.contactPersonLastName",l(c,"lastName",[m.lastName,m.lastname,m.surname,m.familyName])),v("ticket.contactPersonPhone1",R),v("ticket.contactPersonPhone2",He,!0),v("ticket.contactPersonMail",l(c,"contactEmail",[m.email,m.mail])),v("ticket.contactPersonNotificationsType",l(c,"notificationType",["Email"])),v("ticket.contactPersonPreferredContactType",l(c,"preferredContactType",["Mobile"])),v("ticket.contactPersonIspFirstName",l(c,"ispFirstName",[h.firstName])),v("ticket.contactPersonIspLastName",l(c,"ispLastName",[h.lastName])),v("ticket.contactPersonIspPhone",l(c,"ispPhone",[h.phoneNumber,h.phone])),v("ticket.contactPersonIspMail",l(c,"ispEmail",[h.email])),v("ticket.problemDescription",l(c,"problemDescription",["No signal"])),v("ticket.problemNotes",l(c,"problemNotes",[""]),!0),v("ticket.problemDateTime",l(c,"problemDateTime",[c.alo&&c.alo.problemDateTime])),v("ticket.problemCode1",l(c,"problemCode1",["400"])),v("ticket.problemCode2",l(c,"problemCode2",["800"])),v("ticket.problemCode3",l(c,"problemCode3",["900"])),!T){i("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}i("ALO fill","Fields populated: "+T,"success")}if(t){g(t);return}if(i("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){i("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(m){if(!r(m)){i("ALO fill","Clipboard empty. Click ALO fill in Salt BO tools first.","error");return}var d;try{d=JSON.parse(m)}catch{i("ALO fill","Clipboard does not contain valid ALO data.","error");return}g(d)}).catch(function(m){i("ALO fill","Clipboard error: "+(m&&m.message?m.message:m),"error")})}function br(e,t,r,a){function n(b){return b==null?"":String(b).trim()}function s(b){for(var g=0;g<b.length;g+=1){var c=n(b[g]);if(c)return c}return""}function o(b,g,c,m){var d=document.getElementById("saltAloBetaOverlay");d||(d=document.createElement("div"),d.id="saltAloBetaOverlay",d.style.cssText="position:fixed;z-index:2147483647;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(3px);color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:left",d.innerHTML="<div id='saltAloBetaCard' style='position:relative;width:420px;max-width:calc(100vw - 40px);background:rgba(24,24,28,.97);border:1px solid rgba(255,255,255,.12);border-radius:18px;box-shadow:0 22px 60px rgba(0,0,0,.45);padding:24px 26px'><button id='saltAloBetaClose' type='button' aria-label='Close' style='display:none;position:absolute;right:14px;top:12px;border:0;background:transparent;color:#fff;font-size:24px;line-height:1;cursor:pointer'>&times;</button><div style='display:flex;align-items:center;gap:12px;margin-bottom:16px'><div id='saltAloBetaDot' style='width:14px;height:14px;border-radius:50%;background:#21a36a;box-shadow:0 0 18px #21a36a'></div><div id='saltAloBetaTitle' style='font-size:18px;font-weight:700'></div></div><div id='saltAloBetaDetail' style='font-size:14px;line-height:1.5;color:#d8d8df;white-space:pre-line'></div><div style='margin-top:20px;height:5px;background:rgba(255,255,255,.14);border-radius:999px;overflow:hidden'><div id='saltAloBetaBar' style='width:8%;height:100%;background:linear-gradient(90deg,#21a36a,#65d6a0);border-radius:999px;transition:width .25s ease'></div></div></div>",(document.body||document.documentElement).appendChild(d),d.querySelector("#saltAloBetaClose").onclick=function(){d.remove()});var h=m==="error",T=d.querySelector("#saltAloBetaCard"),I=d.querySelector("#saltAloBetaDot"),N=d.querySelector("#saltAloBetaBar");d.querySelector("#saltAloBetaTitle").textContent=b||"ALO beta",d.querySelector("#saltAloBetaDetail").textContent=g||"",d.querySelector("#saltAloBetaClose").style.display=h?"block":"none",T.style.borderColor=h?"rgba(248,113,113,.55)":"rgba(255,255,255,.12)",I.style.background=h?"#ef4444":"#21a36a",I.style.boxShadow=h?"0 0 18px #ef4444":"0 0 18px #21a36a",N.style.width=Math.max(4,Math.min(100,c||0))+"%",N.style.background=h?"linear-gradient(90deg,#ef4444,#fb7185)":"linear-gradient(90deg,#21a36a,#65d6a0)"}function i(){var b=document.getElementById("saltAloBetaOverlay");b&&b.remove()}function l(b){o("ALO beta — unable to continue",b,100,"error")}function u(b,g,c){b.fields=Object.assign({},b.fields||{},{externalReference:g||""}),o("ALO beta",c,92,"info"),i(),r(e,b)}o("ALO beta","Reading prepared data…",8,"info");var p;try{p=new URL(t)}catch{l("The configured Fulfillment URL is invalid.");return}if(location.origin!==p.origin){l("Run this bookmarklet from the ALO Wholesale site.");return}if(!navigator.clipboard||!navigator.clipboard.readText){l("Clipboard access is unavailable on this page.");return}navigator.clipboard.readText().then(function(g){if(!n(g))throw new Error("The clipboard is empty. Prepare the ticket in Salt BO tools first.");var c;try{c=JSON.parse(g)}catch{throw new Error("The clipboard does not contain valid ALO data.")}if(!c||typeof c!="object"||Array.isArray(c))throw new Error("The prepared ALO data is invalid.");if(c.source&&c.source!==e)throw new Error("The clipboard does not contain ALO data prepared by Salt BO tools.");var m=s([c.alo&&c.alo.orderId,c.orderId,c.contact&&c.contact.providerOrderRef,c.client&&c.client.providerOrderRef,c.fields&&c.fields.providerOrderRef]);if(!m){u(c,"",`Order ID unavailable. External Ref left empty.
Filling the ticket…`);return}return o("ALO beta","Order ID detected: "+m+`
Loading the Fulfillment order…`,38,"info"),p.searchParams.set("orderId",m),fetch(p.href,{credentials:"include",cache:"no-store",redirect:"follow"}).then(function(h){return h.ok?h.text():""}).then(function(h){o("ALO beta",`Order loaded.
Searching for the External Ref…`,70,"info");var T=h?new DOMParser().parseFromString(h,"text/html"):null,I=a(T);u(c,I,I?"External Ref found: "+I+`
Filling the ticket…`:`External Ref unavailable. Field left empty.
Filling the ticket…`)}).catch(function(){u(c,"",`External Ref unavailable. Field left empty.
Filling the ticket…`)})}).catch(function(g){l(g&&g.message?g.message:String(g))})}function hn(){const e=JSON.stringify(re);return`javascript:(${De.toString()})(${e});`}function gn(){const e=JSON.stringify(re),t=JSON.stringify(ar);return`javascript:(${br.toString()})(${e},${t},(${De.toString()}),(${fr.toString()}));`}const Re="salt-templater-alex-ticket",hr=2,gr="https://www.ftthproxy.ch/",Tr=1,vr="L1";function Ve(e){return String(e??"").trim()}function kr(e){return String(e??"").replace(/[^0-9]+/g,"")}function xr(e){const t=Ve(e).toUpperCase();return/^[A-Z]\.\d{3}\.\d{3}\.\d{3}\.\d+$/.test(t)?t:""}function yr(e){var t,r;return Ve(((t=e==null?void 0:e.contact)==null?void 0:t.eligibilityOrdering)??((r=e==null?void 0:e.client)==null?void 0:r.eligibilityOrdering)??(e==null?void 0:e.eligibilityOrdering))}function wr(e){var t,r,a,n,s;return[(t=e==null?void 0:e.healthcheck)==null?void 0:t.otoId,(r=e==null?void 0:e.healthcheck)==null?void 0:r.oto_id,(a=e==null?void 0:e.healthcheck)==null?void 0:a.oto,(n=e==null?void 0:e.client)==null?void 0:n.otoId,(s=e==null?void 0:e.contact)==null?void 0:s.otoId,e==null?void 0:e.otoId].map(xr).find(Boolean)||""}function je(e,t){const r=yr(e);return/^\d+$/.test(r)?r==="0"?{ok:!1,error:"ALO_PARTNER"}:{ok:!0,payload:{source:Re,version:hr,action:t,alap:r,serviceDomain:Tr,businessDomain:vr}}:{ok:!1,error:"MISSING_PARTNER_ID"}}function Tn(e){const t=je(e,"create-ticket");if(!t.ok)return t;const r=wr(e);return r?{ok:!0,payload:{...t.payload,otoId:r}}:{ok:!1,error:"MISSING_OTO_ID"}}function vn(e,t){const r=je(e,"view-ticket");if(!r.ok)return r;const a=kr(t);return a?{ok:!0,payload:{...r.payload,ticket:a}}:{ok:!1,error:"MISSING_TICKET"}}function kn(e){return JSON.stringify(e,null,2)}function xn(e){return e==="ALO_PARTNER"?"ALO tickets must be opened with the ALO flow":e==="MISSING_TICKET"?"Add the partner ticket number to the External ID first":e==="MISSING_OTO_ID"?"No valid OTO ID found in the active VTI customer":"No ALEX partner identifier found in the active VTI customer"}function yn(e=(r=>(r=(t=>(t=globalThis.window)==null?void 0:t.open)())==null?void 0:r.bind(globalThis.window))()){return typeof e!="function"?null:e(gr,"_blank","noopener,noreferrer")}function Ir(e){function t(r){alert("Ticket ALEX: "+r)}if(!/(^|\.)ftthproxy\.ch$/i.test(location.hostname)){t("launch this bookmarklet from ftthproxy.ch.");return}if(!navigator.clipboard||!navigator.clipboard.readText){t("clipboard access is not available on this page.");return}navigator.clipboard.readText().then(function(a){var n;try{n=JSON.parse(a)}catch{throw new Error("the clipboard does not contain valid JSON.")}var s=n&&(n.action==="view-ticket"||n.action==="create-ticket"||n.action==="open-provider");if(!n||n.source!==e||!s)throw new Error("the clipboard does not contain ALEX data from Salt BO tools.");var o=String(n.alap||"").trim(),i=String(n.ticket||"").replace(/[^0-9]+/g,""),l=String(n.otoId||"").trim().toUpperCase(),u=Number(n.serviceDomain),p=String(n.businessDomain||"").trim();if(!/^\d+$/.test(o)||o==="0")throw new Error("the ALEX partner identifier is invalid.");if(n.action==="view-ticket"&&!i)throw new Error("the ALEX ticket number is missing.");if(n.action==="create-ticket"&&!/^[A-Z]\.\d{3}\.\d{3}\.\d{3}\.\d+$/.test(l))throw new Error("the VTI OTO ID is missing or invalid.");if(!Number.isFinite(u)||!p)throw new Error("the ALEX partner context is incomplete.");localStorage.setItem("focus",JSON.stringify({alap:o,serviceDomain:u,businessDomain:p}));var b=n.action==="view-ticket"?"/assurance/ticket/"+i:n.action==="create-ticket"?"/fulfillment/search-sep?obj_fiberconnectionOtoId="+encodeURIComponent(l):"/",g=location.origin+"/?saltAlexRefresh="+Date.now()+"#"+b;setTimeout(function(){location.replace(g)},300)}).catch(function(a){t(a&&a.message?a.message:String(a))})}function wn(){const e=JSON.stringify(Re);return`javascript:(${Ir.toString()})(${e});`}const Nr=Object.freeze([{id:"captureData",label:"Capture data",key:"q",code:"KeyQ",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),Ar=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function K(e,t){return!!(e!=null&&e[t])}function Sr(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Be(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Cr(e,t){return K(e,"ctrlKey")===!!t.ctrlKey&&K(e,"altKey")===!!t.altKey&&K(e,"shiftKey")===!!t.shiftKey&&K(e,"metaKey")===!!t.metaKey}function Er(e,t){return Cr(e,t)&&(Sr(e==null?void 0:e.key,t.key)||Be(e==null?void 0:e.code,t.code))}function In(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function Lr(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(Ar))}function Or(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||Lr(e==null?void 0:e.target))}function Nn(e){if(Or(e))return null;const t=Nr.find(r=>Er(e,r))||null;return!t||e!=null&&e.isComposing&&!Be(e==null?void 0:e.code,t.code)?null:t}const _r="case-profile-beta-1",Fe=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["providerOrderRef","Provider order ref"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),ne=Object.freeze(Object.fromEntries(Fe)),ze=Object.freeze(Fe.map(([e])=>e)),Dr=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),Y=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),$e=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function y(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function x(...e){for(const t of e){const r=y(t);if(r!=="")return r}return""}function j(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Rr(e=""){const t=j(e);return t?t.replace(/_([a-z0-9])/g,(r,a)=>a.toUpperCase()):""}function ae(e=""){const t=Rr(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function ce(e=""){const t=j(e);return t?`{${t}}`:""}function B(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function Vr(){const e={};return ze.forEach(t=>{e[t]=""}),{version:_r,fields:e,fieldLabels:{...ne},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function Me(e){return y(e)!==""}function w(e,t,r,{overwrite:a=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const n=y(r);return n===""||!a&&Me(e.fields[t])?!1:(e.fields[t]=n,e[t]=n,!0)}function oe(e,t,r,{overwrite:a=!1,label:n=""}={}){const s=ae(t),o=y(r);return!s||o===""||$e.has(s)||!a&&Object.prototype.hasOwnProperty.call(e.dynamic,s)?!1:(e.dynamic[s]=o,n&&!e.fieldLabels[s]&&(e.fieldLabels[s]=n),!0)}function jr(e,t,r,a={}){const n=j(Q(t)||t),s=Y[n]||Y[j(t)]||ae(t);return Object.prototype.hasOwnProperty.call(e.fields,s)?w(e,s,r,a):oe(e,t,r,a)}function Br(e,t={},r={}){Object.entries(t).forEach(([a,n])=>w(e,a,n,r))}function Z(e,t=[],r=[]){return Array.isArray(e)?(e.forEach((a,n)=>{t.push(String(n+1)),Z(a,t,r),t.pop()}),r):e&&typeof e=="object"?(Object.keys(e).forEach(a=>{t.push(a),Z(e[a],t,r),t.pop()}),r):(r.push({path:t.slice(),value:y(e)}),r)}function Fr(e=[]){return e[0]===he||e[0]===be}function Ue(e,t,{prefix:r="",skipInternalClientKeys:a=!1}={}){!t||typeof t!="object"||Z(t).filter(n=>n.value!=="").filter(n=>!a||!Fr(n.path)).forEach(n=>{const s=r?[r,...n.path]:n.path;oe(e,s.join("_"),n.value,{label:s.map(B).join(" ")})})}function ue(e=[],t=[]){const r=new Map;return[...e,...t].forEach(a=>{if(!a||typeof a!="object")return;const n=`${y(a.url)}|${y(a.name)}|${y(a.id)}`;n.replace(/\|/g,"")&&(r.has(n)||r.set(n,a))}),Array.from(r.values())}function ie(e){const t=y(e);if(!t)return null;const r=fe(t);return r.ok?{externalId:t,fields:r.fields}:null}function qe(e,t){var r,a,n,s;t&&(w(e,"externalId",t.externalId),Object.entries(Dr).forEach(([o,i])=>{var l;w(e,i,(l=t.fields)==null?void 0:l[o])}),w(e,"contractorNumber",(r=t.fields)==null?void 0:r.customer),w(e,"lexId",(a=t.fields)==null?void 0:a.lexId),w(e,"oltName",(n=t.fields)==null?void 0:n.oltName),w(e,"oltBoard",(s=t.fields)==null?void 0:s.oltBoard))}function zr(e,t){var i;if(!t||typeof t!="object")return;const r=t.client||{},a=t.contact||{},n=t.healthcheck||{},s=n.crossConnexion||n.crossConnection||{},o=[r.firstName,r.lastName].map(y).filter(Boolean).join(" ");Br(e,{clientName:o||x(r.fullName,r.name,r.customerName),title:r.title,firstName:r.firstName,lastName:r.lastName,contractorNumber:x(r.contractorNumber,r.contractor,n.customerId),mobile:x(r.mobile,r.phone,r.telephone),mobileRaw:r.mobileRaw,phone:x(r.phone,r.telephone,a.fixedNumber),email:r.email,address:r.address,communicationLanguage:x(r.communicationLanguage,a.communicationLanguage,r.language,a.language),activationDate:x(r.activationDate,r.activation_date,r.activation,r.dateActivation,(i=t.offer)==null?void 0:i.activationDate,a.activationDate,n.activationDate),eligibilitySource:x(r.eligibilitySource,a.eligibilitySource),contactRecordId:x(r.contactRecordId,a.contactRecordId),fixedNumber:a.fixedNumber,publicId:a.publicId,providerOrderRef:a.providerOrderRef,fllRecordId:n.fllRecordId,otoId:x(n.otoId,n.oto_id,n.oto),otoPortId:x(n.otoPortId,n.otoPort,n.oto_port,s.Port),routerSerialNumber:n.routerSerialNumber,oldRouterSerialNumber:n.oldRouterSerialNumber,lexId:n.lexId,oltName:n.oltName,oltBoard:n.oltBoard,ponPort:n.ponPort,breakoutCableId:n.breakoutCableId,fiberNumber:n.fiberNumber,lineState:n.lineState,routerStatus:n.routerStatus,odfId:n.odfId,option82:n.option82,oltObject:n.oltObject,ontConfigurationFilename:n.ontConfigurationFilename,svlan:n.svlan,customerId:n.customerId,crossConnectionEquipment:s.Equipment,crossConnectionRack:s.Rack,crossConnectionSlot:s.Slot,crossConnectionPort:s.Port}),qe(e,ie(t[be])),Ue(e,t,{skipInternalClientKeys:!0})}function $r(e,t){var n;if(!t||typeof t!="object")return;w(e,"soTicketNum",x(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(n=t.tokenValues)==null?void 0:n[W])),w(e,"ticketCreatedAt",x(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),qe(e,ie(t.externalTicketId)),Ke(e,t.tokenValues);const r=Qe(t.attachments),a=Pe(r);e.attachments=ue(e.attachments,r),e.photos=ue(e.photos,a),Ue(e,t,{prefix:"ticket"})}function Ke(e,t={},r={}){!t||typeof t!="object"||Object.entries(t).forEach(([a,n])=>{const s=y(n);if(s==="")return;const o=Q(a),i=et(o)||j(a),l=Y[i];l&&w(e,l,s,r),i==="external_customer"&&w(e,"contractorNumber",s,r),i==="external_lex_id"&&w(e,"lexId",s,r),i==="external_olt_name"&&w(e,"oltName",s,r),i==="external_olt_board"&&w(e,"oltBoard",s,r),oe(e,i,s,{...r,label:B(i)})})}function Mr(e,t){const r=t==null?void 0:t[he];!r||typeof r!="object"||Array.isArray(r)||Object.entries(r).forEach(([a,n])=>{jr(e,a,n,{overwrite:!0,label:B(a)})})}function de(e,t,r){const a=ae(t),n=y(r);!a||n===""||$e.has(a)||Object.prototype.hasOwnProperty.call(e,a)||(e[a]=n)}function Ur(e,t={}){const r={},a={},n=[];ze.forEach(i=>{const l=y(e.fields[i]);if(l==="")return;de(r,i,l);const u=ce(i);u&&(a[u]=l),n.push({key:i,label:ne[i]||B(i),value:l})}),Object.entries(e.dynamic).forEach(([i,l])=>{const u=y(l);if(u==="")return;de(r,i,u);const p=ce(i);p&&!Object.prototype.hasOwnProperty.call(a,p)&&(a[p]=u),e.fields[i]||n.push({key:i,label:e.fieldLabels[i]||B(i),value:u})});const s=ie(e.externalId);s&&Object.assign(a,tt(s.fields)),Me(e.soTicketNum)&&(a[W]=e.soTicketNum);const o={};return Object.entries(t||{}).forEach(([i,l])=>{const u=Q(i)||i;o[u]=l}),e.vars=r,e.variables=r,e.tokenValues={...o,...a},e.availableFields=n,e}function An({clientPayload:e=null,superOfficePayload:t=null,tokenValues:r={}}={}){const a=Vr();return zr(a,e),$r(a,t),Ke(a,r),Mr(a,e),Ur(a,r)}function f(e,t,r=""){var n;const a=y((e==null?void 0:e[t])??((n=e==null?void 0:e.fields)==null?void 0:n[t]));return a?{label:r||ne[t]||B(t),value:a}:null}function C(e,t){const r=y(t);return r?{label:e,value:r}:null}function Je(e=[]){const t=new Set;return e.filter(Boolean).filter(r=>{const a=`${j(r.label)}:${r.value}`;return t.has(a)?!1:(t.add(a),!0)})}function J(e,t,r=[]){const a=Je(r);return a.length>0?{id:e,title:t,fields:a}:null}function Sn(e=null){return!e||typeof e!="object"?[]:Je([C("Name",e.clientName),C("Mobile",x(e.mobile,e.mobileRaw,e.phone)),C("Contractor",x(e.contractorNumber,e.externalCustomer,e.customerId)),C("Activation",e.activationDate),C("OTO ID",e.otoId),C("Port",x(e.otoPortId,e.crossConnectionPort)),C("SO ticket",e.soTicketNum)])}function Cn(e=null){if(!e||typeof e!="object")return[];const t=C("Contractor",x(e.contractorNumber,e.externalCustomer,e.customerId)),r=C("SO ticket",e.soTicketNum);return[t&&{key:"contractor",...t},r&&{key:"so-ticket",...r}].filter(Boolean)}function En(e=null){return!e||typeof e!="object"?[]:[J("caseClient","Client",[f(e,"clientName","Full name"),f(e,"contractorNumber","Contractor"),f(e,"title"),f(e,"firstName"),f(e,"lastName"),f(e,"mobile"),f(e,"mobileRaw","Mobile raw"),f(e,"phone"),f(e,"email"),f(e,"address"),f(e,"communicationLanguage","Language"),f(e,"activationDate","Activation date")]),J("caseSuperOffice","SuperOffice",[f(e,"soTicketNum","SO ticket"),f(e,"ticketCreatedAt","Created at"),f(e,"externalId","External ID"),f(e,"externalPartner","Partner"),f(e,"externalPartnerTicketNumber","Partner ticket")]),J("caseExternalId","External ID fields",[f(e,"externalFlagging","Flagging"),f(e,"externalDate","Date"),f(e,"externalCustomer","Contractor"),f(e,"externalSignalStatus","Signal"),f(e,"externalLedStatus","LED"),f(e,"externalTreatmentStep","Treatment"),f(e,"externalBoxType","Box"),f(e,"externalLexId","LEX ID"),f(e,"externalOltName","OLT"),f(e,"externalOltBoard","Board"),f(e,"externalBokBof","BOK/BOF"),f(e,"externalComment","Comment")]),J("caseTechnical","Technical",[f(e,"fllRecordId","FLL record"),f(e,"otoId","OTO ID"),f(e,"otoPortId","OTO port"),f(e,"routerSerialNumber","Router serial"),f(e,"oldRouterSerialNumber","Old router serial"),f(e,"lexId","LEX ID"),f(e,"oltName","OLT"),f(e,"oltBoard","OLT board"),f(e,"ponPort","PON port"),f(e,"breakoutCableId","Breakout cable"),f(e,"fiberNumber","Fiber number"),f(e,"lineState","Line state"),f(e,"routerStatus","Router status"),f(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{wn as A,hn as B,Xr as C,Zr as D,gn as E,tn as F,O as G,Te as H,dt as I,In as J,Nr as K,dn as L,un as M,pt as N,Wr as P,Qr as T,Pr as U,Yr as a,sn as b,cn as c,on as d,An as e,ln as f,En as g,rn as h,an as i,Sn as j,Cn as k,en as l,Tn as m,vn as n,fn as o,kn as p,yn as q,nn as r,ht as s,xn as t,bn as u,mn as v,Nn as w,Gr as x,pn as y,ve as z};
