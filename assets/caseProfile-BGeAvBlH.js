import{c as L}from"./createLucideIcon-D0L4PIlA.js";import{v as G,P as pe,S as D,w as he,h as Z,u as ge,Q as X,R as W,K as Te,B as Q,T as qe}from"./tokenService-nkfQG7Kb.js";import{l as Pe,a as Ye}from"./index-D-Xp-yqh.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Tn=L("chevron-left",He);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],xn=L("chevron-right",Je);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],kn=L("clipboard-copy",Ge);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],yn=L("external-link",Ze);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],wn=L("puzzle",Xe),We=/\.(jpe?g|png|webp|gif|bmp|avif)(?:$|[?#])/i,Qe=/\.pdf(?:$|[?#])/i;function w(...e){for(const t of e){const n=String(t??"").trim();if(n)return n}return""}function et(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function tt(e="",t=""){const n=`${e} ${t}`;return We.test(n)?"image":Qe.test(n)?"pdf":"file"}function nt(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function rt(e={}){var t,n,r;return w(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(n=e.message)==null?void 0:n.createdAt,(r=e.message)==null?void 0:r.sentAt)||null}function ot(e,t){var s,i;if(!e||typeof e!="object"||Array.isArray(e))return null;const n=w(e.url,e.href,e.src,e.downloadUrl);if(!n)return null;const r=w(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((s=String(n).split("/").pop())==null?void 0:s.split("?")[0])||""))||`Attachment ${t+1}`,o=w(e.type,e.contentType,e.mimeType),a=nt(o)?"image":tt(r,n);return{id:w(e.id,e.attachmentId,e.documentId)||`${t}-${r}-${n}`,name:r,url:n,type:a,size:w(e.size,e.sizeText,e.fileSize)||null,messageId:w(e.messageId,e.messageID,(i=e.message)==null?void 0:i.id)||null,date:rt(e)}}function de(e){return String(e).padStart(2,"0")}function at(e){const t=e.getFullYear(),n=de(e.getMonth()+1),r=de(e.getDate());return{dateKey:`${t}-${n}-${r}`,label:`${r}.${n}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function it(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const a=new Date(e);return Number.isNaN(a.getTime())?null:a}const t=String(e).trim();if(!t)return null;const n=t.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b/);if(n){const a=Number(n[1]),s=Number(n[2])-1,i=Number(n[3]),u=i<100?2e3+i:i,f=new Date(u,s,a);if(!Number.isNaN(f.getTime()))return f}const r=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})\b/);if(r){const a=new Date(Number(r[1]),Number(r[2])-1,Number(r[3]));if(!Number.isNaN(a.getTime()))return a}const o=new Date(t);return Number.isNaN(o.getTime())?null:o}function st(e={}){const t=it(e.date);return t?at(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function U(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(ot).filter(Boolean).filter(n=>{const r=`${n.name}|${n.url}`;return t.has(r)?!1:(t.add(r),!0)})}function K(e=[]){return U(e).filter(t=>t.type==="image")}function In(e=[]){const t=new Map;return K(e).forEach((n,r)=>{const o=st(n);t.has(o.dateKey)||t.set(o.dateKey,{...o,attachments:[]}),t.get(o.dateKey).attachments.push({...n,galleryIndex:r})}),Array.from(t.values()).sort((n,r)=>r.sortValue-n.sortValue)}function vn(e){const t=et(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const n=w(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),r=w(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),o=w(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),a={};let s=null,i=!1;const u=U(t.attachments),f=K(u);if(o){const c=G(o);c.ok&&(i=!0,s=c.fields,Object.assign(a,pe(c.fields)))}const l=n||(s==null?void 0:s.soTicket)||"";return l&&(a[D]=l),Object.keys(a).length===0&&u.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:i,externalTicketId:o}:{ok:!0,ticketId:l,sourceTicketId:n,createdAt:r,externalTicketId:o,externalIdValid:i,externalFields:s,tokenValues:a,attachments:u,imageAttachments:f,ignoredExternalId:!!(o&&!i)}}const ee="super_office_ticket_payload",te="pending_super_office_ticket_payload",lt="super-office-ticket-updated";function ct(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[X]:t,[W]:n,...r}=e;return r}function q(e){return Array.isArray(e)?`[${e.map(q).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${q(e[t])}`).join(",")}}`:JSON.stringify(e)}function ne(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return q(ct(e))}catch{return""}}function z(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(lt,{detail:{payload:e}}))}function re(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=U(e.attachments),n=String(e.clientSignature||"").trim(),r=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([o,a])=>[o,a==null?"":String(a)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:n,tokenValues:r,attachments:t,imageAttachments:K(t)}}function ut(e,t=new Date,n=""){return re({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:n,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function xe(e){e&&await Te(ee,e)}async function dt(e){e&&await Te(te,e)}async function oe(){try{return re(await he(te,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function Nn(){return oe()}async function Sn(){return!!(await mt()||await oe())}function ae(){return ge(te)}async function _n(e){const t=await Z(),n=ut(e,new Date,ne(t));return n?n.clientSignature?(await xe(n),await ae(),z(n),n):(await B(),await dt(n),z(null),n):null}function B(){return ge(ee)}async function Cn(){const e=await oe(),t=ne(await Z());if(!e||!t)return null;const n={...e,clientSignature:t};return await xe(n),await ae(),z(n),n}async function mt(){try{const e=await he(ee,null);if(!e)return null;const t=ne(await Z());if(!t)return await B(),null;if((e==null?void 0:e.clientSignature)!==t)return await B(),null;const n=re(e);return n||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function An(){await B(),await ae(),z(null)}const ke="quick_tools",ft="blue",_=Object.freeze({LINK:"link",MODULE:"module"}),bt=_.LINK,pt=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],ht=new Set(pt.map(e=>e.value)),gt=new Set(Object.values(_));function Tt(e){return ht.has(e)?e:ft}function ye(e){return gt.has(e)?e:bt}function xt(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function we(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?_.MODULE:_.LINK),n=ye(t);return{...e,type:n,title:String(e.title||"").trim(),url:n===_.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:Tt(e.color),order:xt(e.order),beta:n===_.MODULE?!0:!!e.beta}}async function En(){const e=await Pe(ke,[]);return Array.isArray(e)?e.map(we).filter(Boolean):[]}async function Ln(e){const t=Array.isArray(e)?e.map(we).filter(Boolean):[];return Ye(ke,t)}function Dn(e,t={}){return(e||"").replace(/\{[^}]+\}/g,n=>{const r=t[n];if(r==null||r==="")return n;const o=String(r).replace(/<[^>]+>/g,"").trim();return encodeURIComponent(o)})}function On(e){return ye(e==null?void 0:e.type)===_.MODULE}const R="template-tool-module-beta-1",Ie=Object.freeze({name:"Template Generator Module API",version:R,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']"],reservedContainers:["env","raw","byToken","byKey","byLabel"]},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function kt(e=Ie){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,r])=>{t.push(`- window.${n}: ${r.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.join(`
`)}const yt=`
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
</style>`,wt=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${R}";
    var apiReference = ${JSON.stringify(Ie)};
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
<\/script>`,It=`<!doctype html>
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
</html>`;function vt(e=""){var u;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),r=((u=n==null?void 0:n[1])==null?void 0:u.trim())||t,o=r.match(/<!doctype\s+html\b|<html[\s>]/i);if(!o)return r;const a=o.index||0,s=r.slice(a).trim(),i=s.match(/<\/html\s*>/i);return i?s.slice(0,i.index+i[0].length).trim():s}function Nt(e=""){const t=vt(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:It}function St(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function _t(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Vn(e=""){const t=Nt(e),n=_t(t,wt,"template-tool-bridge");return St(n,yt,"template-tool-host-style")}function Ct(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const r=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:r??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function E(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function P(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function ve(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Ne(e=""){const t=ve(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function Se(e=""){const t=Ne(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function ie(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function O(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function I(e,t){const n=String(t||"").trim();if(!n)return;O(e,n);const r=ve(n),o=Ne(n);r&&(O(e,r),O(e,`{${r}}`)),o&&O(e,o)}function At({label:e="",token:t="",key:n="",aliases:r=[],section:o=""}={}){const a=[];I(a,e),I(a,t),I(a,t.replace(/[{}]/g,"")),I(a,n);const s=ie(n);return s.length>0&&(I(a,s[s.length-1]),I(a,s.join(" ")),I(a,s.join(""))),I(a,o),r.forEach(i=>I(a,i)),a}function Et(e){const t=E(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=At({...e,...n}),n}function Lt({tokens:e=[],clientInfo:t=[],clientSummary:n=[],profile:r=null}={}){const o=[],a=new Set,s=i=>{const u=Et(i);if(!u)return;const f=`${u.source}:${u.label}:${u.value}:${u.token||""}:${u.key||""}`;a.has(f)||(a.add(f),o.push(u))};return e.forEach(i=>{s({label:i.label,value:i.value,token:i.token,key:i.key,aliases:i.aliases,source:"token"})}),n.forEach(i=>{s({label:i.label,value:i.value,section:"summary",source:"clientSummary"})}),t.forEach(i=>{((i==null?void 0:i.fields)||[]).forEach(u=>{s({label:u.label,value:u.value,section:i.title||i.id,source:"clientInfo"})})}),r&&typeof r=="object"&&(Array.isArray(r.availableFields)?r.availableFields:[]).forEach(i=>{s({label:i.label,value:i.value,key:i.key,aliases:i.aliases,source:"profile"})}),o}function Dt(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function Ot(e,t,n){const r=ie(t);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const i=r[s];if(!i||/^\d+$/.test(i)||(o[i]===void 0&&(o[i]={}),!o[i]||typeof o[i]!="object"||Array.isArray(o[i])))return;o=o[i]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function Vt(e={},t=[]){const n={...e};return t.forEach(r=>{r.key&&Ot(n,r.key,r.value),r.aliases.forEach(o=>Dt(n,o,r.value))}),_e(n,t),n}const jt=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function Ft(e,t){const n=P(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(r=>P(r)===n)}function $t(e=[],t=[]){for(const n of t){const r=e.find(a=>Ft(a,n)),o=E(r==null?void 0:r.value);if(o!=="")return o}return""}function _e(e,t=[]){jt.forEach(({name:n,candidates:r})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const o=$t(t,r);o!==""&&(e[n]=o)})}function zt(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(r=>{const o=P(r);!o||t[o]||(t[o]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function $(e,t,n){const r=Se(t);!r||n===""||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=n)}function Bt(e,t,n){const r=ie(t).map(Se).filter(Boolean);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const i=r[s];if(o[i]===void 0&&(o[i]={}),!o[i]||typeof o[i]!="object"||Array.isArray(o[i]))return;o=o[i]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function Rt(e,t=null){if(!t||typeof t!="object")return;const n=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(n).forEach(([r,o])=>{const a=E(o);a!==""&&$(e,r,a)})}function Mt({fields:e=[],tokenValues:t={},environment:n={},profile:r=null}={}){const o={env:n,raw:t,byToken:{},byKey:{},byLabel:{}};return Object.entries(t||{}).forEach(([a,s])=>{const i=E(s);i!==""&&(o.byToken[a]=i,$(o,a,i),$(o,a.replace(/[{}]/g,""),i))}),Rt(o,r),e.forEach(a=>{const s=E(a.value);s!==""&&(a.token&&(o.byToken[a.token]=s),a.key&&(o.byKey[a.key]=s,Bt(o,a.key,s)),o.byLabel[a.label]=s,[a.label,a.token,a.key,...a.aliases||[]].forEach(i=>{$(o,i,s)}))}),_e(o,e),o}function jn({tool:e={},values:t={},tokens:n=[],client:r=null,clientInfo:o=[],clientSummary:a=[],profile:s=null}={}){const i=t&&typeof t=="object"?t:{},u=s&&typeof s=="object"?s:null,f=u!=null&&u.tokenValues&&typeof u.tokenValues=="object"?u.tokenValues:{},l={...i,...f},c=Array.isArray(o)?o:[],m=Array.isArray(a)?a:[],h=Ct(n,l),p=Lt({tokens:h,clientInfo:c,clientSummary:m,profile:u}),N=new Date().toISOString(),y={apiVersion:R,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:N};return{apiVersion:R,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:u||null,values:Vt(l,p),tokenValues:l,tokens:h,fields:p,fieldIndex:zt(p),variables:Mt({fields:p,tokenValues:l,environment:y,profile:u}),environment:y,client:r&&typeof r=="object"?r:null,clientInfo:c,clientSummary:m,generatedAt:N}}function Fn({title:e="",prompt:t=""}={}){const n=String(e||"").trim()||"Custom tool",r=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.

Return one complete HTML file, and nothing else.
- Put all HTML, CSS and JavaScript in that single file.
- Prefer attaching the result as a downloadable .html file when the chat interface supports files.
- If you cannot attach a file, return exactly one fenced code block containing the full HTML document from <!doctype html> to </html>.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not include explanations before or after the file.
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Module API reference:
${kt()}

Runtime:
- The file runs inside an iframe.
- The host app injects window.TemplateTool before your script runs.
- Use await window.TemplateTool.getContext() to read the current app context.
- Context shape: { apiVersion, tool: { id, title, description }, profile, values, tokenValues, variables, environment, tokens, fields, fieldIndex, client, clientInfo, clientSummary, generatedAt }.
- profile is the simplest normalized customer object. Read it with await window.TemplateTool.getProfile() or context.profile. Common fields: profile.clientName, profile.contractorNumber, profile.mobile, profile.activationDate, profile.otoId, profile.routerSerialNumber, profile.soTicketNum, profile.externalId, profile.photos, profile.attachments, profile.vars and profile.tokenValues.
- tokenValues is the original object keyed by token strings, for example tokenValues["{client_first_name}"].
- values keeps those token keys and also includes host-generated aliases such as values.client.firstName, values.firstName and values.clientFirstName when they come from real data.
- variables is the easiest API for module JavaScript. It is also exposed globally as window.TemplateVars and contains safe JS property names from the profile such as TemplateVars.clientName, TemplateVars.contractorNumber, TemplateVars.mobile, TemplateVars.activationDate, TemplateVars.otoId, TemplateVars.soTicketNum, plus TemplateVars.byToken, TemplateVars.byKey, TemplateVars.byLabel and TemplateVars.raw.
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
- Prefer context.profile, TemplateProfile, TemplateTool.getProfile(), TemplateVars, TemplateTool.getVars(), TemplateTool.findField, context.fields, context.fieldIndex and context.clientInfo for user-facing data because they describe the available variables.
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
${r}`}const Ce="salt-templater-alo-autofill",Ut=1,V=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function v(e){return e==null?"":String(e).trim()}function g(e){for(const t of e){const n=v(t);if(n)return n}return""}function Kt(e){const t=v(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:v(e)}function Y(e){const t=v(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const r=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(r)return`${r[3]}-${r[2]}-${r[1]}`;const o=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return o?`${o[3]}-${o[1].padStart(2,"0")}-${o[2].padStart(2,"0")}`:t}function M(e){const t=Y(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function qt(e={}){var t,n,r,o,a,s,i;return g([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activation_date,(o=e==null?void 0:e.client)==null?void 0:o.activation,(a=e==null?void 0:e.client)==null?void 0:a.dateActivation,(s=e==null?void 0:e.contact)==null?void 0:s.activationDate,(i=e==null?void 0:e.healthcheck)==null?void 0:i.activationDate])}function Pt(e={}){const t=[e.SignalStatus,e.LedStatus,e.treatmentStep,e.comment].join(" ").toLowerCase();return/(low|bad|rx|tx|performance)/i.test(t)?"lowBadRxTx":"noSignal"}function Yt(e={}){const t=v(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function Ae(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",r=t==="lowBadRxTx"?"Bad signal":"No signal",o=M(n==="never"?e.activationDate:e.disconnectionDate);return[r,n==="never"?"Never activated":"Signal lost",o].filter(Boolean).join(" - ")}function $n(e={},t={}){var l,c,m,h;const n=g([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(c=e==null?void 0:e.client)==null?void 0:c.externalId,(m=e==null?void 0:e.superOffice)==null?void 0:m.externalTicketId]),r=G(n),o=r.ok?r.fields:{},a=Pt(o),s=Yt(o),i=Y(qt(e)),u=Y(g([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt])),f=g([t==null?void 0:t.sourceTicketId,t==null?void 0:t.ticketId,(h=t==null?void 0:t.tokenValues)==null?void 0:h[D],o.soTicket]);return{externalId:n,externalFields:o,aloType:a,signalState:s,extRef:f,disconnectionDate:s==="lost"?u:"",activationDate:i,description:Ae({aloType:a,signalState:s,disconnectionDate:u,activationDate:i})}}function Ee(e={}){return{firstName:v(e.firstName),lastName:v(e.lastName),email:v(e.email),phoneNumber:g([e.phoneNumber,e.phone])}}function Le(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:g([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[D],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:v(e==null?void 0:e.externalTicketId),tokenValues:t}}function Ht(e={},t={},n={},r={}){const o=(e==null?void 0:e.client)||{},a=(e==null?void 0:e.contact)||{},s=(e==null?void 0:e.healthcheck)||{},i=Ee(t),u=Le(n),f=g([a.fixedNumber,a.voipNumber,a.voip,a.sip,o.fixedNumber,o.fixedPhone]),l=Kt(g([o.mobile,o.mobileRaw,o.phone,o.telephone,a.mobile,a.phone])),c=g([r.description,r.aloType==="lowBadRxTx"?"Bad signal":"",V.problemDescription]),m=g([r.notes,r.signalState?Ae(r):"",V.problemNotes]),h=r.signalState==="never"?M(r.activationDate):M(r.disconnectionDate);return{externalReference:g([r.extRef,u.ticketId]),socketId:g([s.otoId,s.oto_id,s.oto]),plugNr:g([s.otoPortId,s.otoPort,s.oto_port]),breakoutCable:g([s.breakoutCableId,s.breakoutCable,s.cable]),breakoutFiber:g([s.fiberNumber,s.fiber,s.fibre]),firstName:g([o.firstName,o.firstname,o.givenName]),lastName:g([o.lastName,o.lastname,o.surname,o.familyName]),contactPhone1:g([f,l]),contactPhone2:f&&l&&f!==l?l:"",contactEmail:g([o.email,o.mail,a.email,a.mail]),ispFirstName:i.firstName,ispLastName:i.lastName,ispPhone:i.phoneNumber,ispEmail:i.email,...V,problemDescription:c,problemNotes:m,problemDateTime:h,problemCode3:r.aloType==="lowBadRxTx"?"Performance problem":V.problemCode3}}function Jt(e={},t={},n={},r={}){const o=Ht(e,t,n,r),a=Ee(t),s=Le(n);return{source:Ce,version:Ut,fields:o,alo:{type:r.aloType||"noSignal",signalState:r.signalState||"",disconnectionDate:r.disconnectionDate||"",activationDate:r.activationDate||"",problemDateTime:o.problemDateTime,notes:r.notes||""},client:{firstName:o.firstName,lastName:o.lastName,contactPhone1:o.contactPhone1,contactPhone2:o.contactPhone2,email:o.contactEmail},technical:{socketId:o.socketId,plugNr:o.plugNr,breakoutCable:o.breakoutCable,breakoutFiber:o.breakoutFiber},agent:a,superOffice:s}}function zn(e={},t={},n={},r={}){return JSON.stringify(Jt(e,t,n,r),null,2)}function Gt(e){function t(l){return l==null?"":String(l).trim()}function n(l){for(var c=0;c<l.length;c+=1){var m=t(l[c]);if(m)return m}return""}function r(l){return t(l).replace(/[&<>"']/g,function(m){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}function o(l,c,m){var h=document.getElementById("saltAloFillOverlay");h&&h.remove();var p=document.createElement("div");p.id="saltAloFillOverlay",p.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(m==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",p.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+r(l)+"</strong><span style='color:#d8d8df'>"+r(c)+"</span>",document.body.appendChild(p),m!=="error"&&setTimeout(function(){try{p.remove()}catch{}},4500)}function a(l,c,m){var h=l&&l.fields||{};return n([h[c]].concat(m||[]))}function s(l,c){var m=String(c).replace(/["\\]/g,"\\$&");return document.querySelector("["+l+'="'+m+'"]')}function i(l){return document.getElementById(l)||s("name",l)||s("formcontrolname",l)||s("data-testid",l)}function u(l,c,m){var h=m?String(c??""):t(c);if(!m&&!h)return!1;var p=i(l);if(!p)return!1;if(p.tagName==="SELECT")for(var N=t(h).toLowerCase(),y=0;y<p.options.length;y+=1){var b=p.options[y];if(t(b.value).toLowerCase()===N||t(b.textContent).toLowerCase()===N){p.value=b.value;break}}else"value"in p?p.value=h:p.textContent=h;return p.dispatchEvent(new Event("input",{bubbles:!0})),p.dispatchEvent(new Event("change",{bubbles:!0})),!0}function f(l){if(!l||typeof l!="object"||Array.isArray(l)){o("ALO fill","ALO fill data invalid.","error");return}if(l.source&&l.source!==e){o("ALO fill","Clipboard does not contain ALO fill data from Salt Templater.","error");return}var c=l.client||{},m=l.technical||l.healthcheck||{},h=l.agent||{},p=l.superOffice||{},N=p.tokenValues||l.tokenValues||{},y=0;function b(Me,Ue,Ke){u(Me,Ue,Ke)&&(y+=1)}if(b("ticket.extRef",a(l,"externalReference",[p.sourceTicketId,p.ticketId,l.ticketId,N["{so_ticket_num}"]])),b("ticket.socketId",a(l,"socketId",[m.socketId,m.otoId,m.oto_id,m.oto])),b("ticket.plugNr",a(l,"plugNr",[m.plugNr,m.otoPortId,m.otoPort,m.oto_port])),b("ticket.breakoutCable",a(l,"breakoutCable",[m.breakoutCable,m.breakoutCableId,m.cable])),b("ticket.breakoutFiber",a(l,"breakoutFiber",[m.breakoutFiber,m.fiberNumber,m.fiber,m.fibre])),b("ticket.otoAddress.firstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),b("ticket.otoAddress.lastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),b("ticket.contactPersonFirstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),b("ticket.contactPersonLastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),b("ticket.contactPersonPhone1",a(l,"contactPhone1",[c.contactPhone1,c.fixedNumber,c.mobileRaw,c.mobile,c.phone])),b("ticket.contactPersonPhone2",a(l,"contactPhone2",[c.contactPhone2])),b("ticket.contactPersonMail",a(l,"contactEmail",[c.email,c.mail])),b("ticket.contactPersonIspFirstName",a(l,"ispFirstName",[h.firstName])),b("ticket.contactPersonIspLastName",a(l,"ispLastName",[h.lastName])),b("ticket.contactPersonIspPhone",a(l,"ispPhone",[h.phoneNumber,h.phone])),b("ticket.contactPersonIspMail",a(l,"ispEmail",[h.email])),b("ticket.problemDescription",a(l,"problemDescription",["No signal"])),b("ticket.problemNotes",a(l,"problemNotes",[""]),!0),b("ticket.problemDateTime",a(l,"problemDateTime",[l.alo&&l.alo.problemDateTime])),b("ticket.problemCode1",a(l,"problemCode1",["400"])),b("ticket.problemCode2",a(l,"problemCode2",["800"])),b("ticket.problemCode3",a(l,"problemCode3",["900"])),!y){o("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}o("ALO fill","Fields populated: "+y,"success")}if(o("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){o("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(c){if(!t(c)){o("ALO fill","Clipboard empty. Click ALO fill in Salt Templater first.","error");return}var m;try{m=JSON.parse(c)}catch{o("ALO fill","Clipboard does not contain valid ALO data.","error");return}f(m)}).catch(function(c){o("ALO fill","Clipboard error: "+(c&&c.message?c.message:c),"error")})}function Bn(){const e=JSON.stringify(Ce);return`javascript:(${Gt.toString()})(${e});`}const Zt=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),Xt=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function j(e,t){return!!(e!=null&&e[t])}function Wt(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function De(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Qt(e,t){return j(e,"ctrlKey")===!!t.ctrlKey&&j(e,"altKey")===!!t.altKey&&j(e,"shiftKey")===!!t.shiftKey&&j(e,"metaKey")===!!t.metaKey}function en(e,t){return Qt(e,t)&&(Wt(e==null?void 0:e.key,t.key)||De(e==null?void 0:e.code,t.code))}function Rn(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function tn(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(Xt))}function nn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||tn(e==null?void 0:e.target))}function Mn(e){if(nn(e))return null;const t=Zt.find(n=>en(e,n))||null;return!t||e!=null&&e.isComposing&&!De(e==null?void 0:e.code,t.code)?null:t}const rn="case-profile-beta-1",Oe=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),se=Object.freeze(Object.fromEntries(Oe)),Ve=Object.freeze(Oe.map(([e])=>e)),on=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),H=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),je=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function T(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function x(...e){for(const t of e){const n=T(t);if(n!=="")return n}return""}function C(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function an(e=""){const t=C(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function le(e=""){const t=an(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function me(e=""){const t=C(e);return t?`{${t}}`:""}function A(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function sn(){const e={};return Ve.forEach(t=>{e[t]=""}),{version:rn,fields:e,fieldLabels:{...se},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function Fe(e){return T(e)!==""}function k(e,t,n,{overwrite:r=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const o=T(n);return o===""||!r&&Fe(e.fields[t])?!1:(e.fields[t]=o,e[t]=o,!0)}function ce(e,t,n,{overwrite:r=!1,label:o=""}={}){const a=le(t),s=T(n);return!a||s===""||je.has(a)||!r&&Object.prototype.hasOwnProperty.call(e.dynamic,a)?!1:(e.dynamic[a]=s,o&&!e.fieldLabels[a]&&(e.fieldLabels[a]=o),!0)}function ln(e,t,n,r={}){const o=C(Q(t)||t),a=H[o]||H[C(t)]||le(t);return Object.prototype.hasOwnProperty.call(e.fields,a)?k(e,a,n,r):ce(e,t,n,r)}function cn(e,t={},n={}){Object.entries(t).forEach(([r,o])=>k(e,r,o,n))}function J(e,t=[],n=[]){return Array.isArray(e)?(e.forEach((r,o)=>{t.push(String(o+1)),J(r,t,n),t.pop()}),n):e&&typeof e=="object"?(Object.keys(e).forEach(r=>{t.push(r),J(e[r],t,n),t.pop()}),n):(n.push({path:t.slice(),value:T(e)}),n)}function un(e=[]){return e[0]===X||e[0]===W}function $e(e,t,{prefix:n="",skipInternalClientKeys:r=!1}={}){!t||typeof t!="object"||J(t).filter(o=>o.value!=="").filter(o=>!r||!un(o.path)).forEach(o=>{const a=n?[n,...o.path]:o.path;ce(e,a.join("_"),o.value,{label:a.map(A).join(" ")})})}function fe(e=[],t=[]){const n=new Map;return[...e,...t].forEach(r=>{if(!r||typeof r!="object")return;const o=`${T(r.url)}|${T(r.name)}|${T(r.id)}`;o.replace(/\|/g,"")&&(n.has(o)||n.set(o,r))}),Array.from(n.values())}function ue(e){const t=T(e);if(!t)return null;const n=G(t);return n.ok?{externalId:t,fields:n.fields}:null}function ze(e,t){var n,r,o,a;t&&(k(e,"externalId",t.externalId),Object.entries(on).forEach(([s,i])=>{var u;k(e,i,(u=t.fields)==null?void 0:u[s])}),k(e,"contractorNumber",(n=t.fields)==null?void 0:n.customer),k(e,"lexId",(r=t.fields)==null?void 0:r.lexId),k(e,"oltName",(o=t.fields)==null?void 0:o.oltName),k(e,"oltBoard",(a=t.fields)==null?void 0:a.oltBoard))}function dn(e,t){var i;if(!t||typeof t!="object")return;const n=t.client||{},r=t.contact||{},o=t.healthcheck||{},a=o.crossConnexion||o.crossConnection||{},s=[n.firstName,n.lastName].map(T).filter(Boolean).join(" ");cn(e,{clientName:s||x(n.fullName,n.name,n.customerName),title:n.title,firstName:n.firstName,lastName:n.lastName,contractorNumber:x(n.contractorNumber,n.contractor,o.customerId),mobile:x(n.mobile,n.phone,n.telephone),mobileRaw:n.mobileRaw,phone:x(n.phone,n.telephone,r.fixedNumber),email:n.email,address:n.address,communicationLanguage:x(n.communicationLanguage,r.communicationLanguage,n.language,r.language),activationDate:x(n.activationDate,n.activation_date,n.activation,n.dateActivation,(i=t.offer)==null?void 0:i.activationDate,r.activationDate,o.activationDate),eligibilitySource:x(n.eligibilitySource,r.eligibilitySource),contactRecordId:x(n.contactRecordId,r.contactRecordId),fixedNumber:r.fixedNumber,publicId:r.publicId,fllRecordId:o.fllRecordId,otoId:x(o.otoId,o.oto_id,o.oto),otoPortId:x(o.otoPortId,o.otoPort,o.oto_port,a.Port),routerSerialNumber:o.routerSerialNumber,oldRouterSerialNumber:o.oldRouterSerialNumber,lexId:o.lexId,oltName:o.oltName,oltBoard:o.oltBoard,ponPort:o.ponPort,breakoutCableId:o.breakoutCableId,fiberNumber:o.fiberNumber,lineState:o.lineState,routerStatus:o.routerStatus,odfId:o.odfId,option82:o.option82,oltObject:o.oltObject,ontConfigurationFilename:o.ontConfigurationFilename,svlan:o.svlan,customerId:o.customerId,crossConnectionEquipment:a.Equipment,crossConnectionRack:a.Rack,crossConnectionSlot:a.Slot,crossConnectionPort:a.Port}),ze(e,ue(t[W])),$e(e,t,{skipInternalClientKeys:!0})}function mn(e,t){var o;if(!t||typeof t!="object")return;k(e,"soTicketNum",x(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(o=t.tokenValues)==null?void 0:o[D])),k(e,"ticketCreatedAt",x(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),ze(e,ue(t.externalTicketId)),Be(e,t.tokenValues);const n=U(t.attachments),r=K(n);e.attachments=fe(e.attachments,n),e.photos=fe(e.photos,r),$e(e,t,{prefix:"ticket"})}function Be(e,t={},n={}){!t||typeof t!="object"||Object.entries(t).forEach(([r,o])=>{const a=T(o);if(a==="")return;const s=Q(r),i=qe(s)||C(r),u=H[i];u&&k(e,u,a,n),i==="external_customer"&&k(e,"contractorNumber",a,n),i==="external_lex_id"&&k(e,"lexId",a,n),i==="external_olt_name"&&k(e,"oltName",a,n),i==="external_olt_board"&&k(e,"oltBoard",a,n),ce(e,i,a,{...n,label:A(i)})})}function fn(e,t){const n=t==null?void 0:t[X];!n||typeof n!="object"||Array.isArray(n)||Object.entries(n).forEach(([r,o])=>{ln(e,r,o,{overwrite:!0,label:A(r)})})}function be(e,t,n){const r=le(t),o=T(n);!r||o===""||je.has(r)||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=o)}function bn(e,t={}){const n={},r={},o=[];Ve.forEach(i=>{const u=T(e.fields[i]);if(u==="")return;be(n,i,u);const f=me(i);f&&(r[f]=u),o.push({key:i,label:se[i]||A(i),value:u})}),Object.entries(e.dynamic).forEach(([i,u])=>{const f=T(u);if(f==="")return;be(n,i,f);const l=me(i);l&&!Object.prototype.hasOwnProperty.call(r,l)&&(r[l]=f),e.fields[i]||o.push({key:i,label:e.fieldLabels[i]||A(i),value:f})});const a=ue(e.externalId);a&&Object.assign(r,pe(a.fields)),Fe(e.soTicketNum)&&(r[D]=e.soTicketNum);const s={};return Object.entries(t||{}).forEach(([i,u])=>{const f=Q(i)||i;s[f]=u}),e.vars=n,e.variables=n,e.tokenValues={...s,...r},e.availableFields=o,e}function Un({clientPayload:e=null,superOfficePayload:t=null,tokenValues:n={}}={}){const r=sn();return dn(r,e),mn(r,t),Be(r,n),fn(r,e),bn(r,n)}function d(e,t,n=""){var o;const r=T((e==null?void 0:e[t])??((o=e==null?void 0:e.fields)==null?void 0:o[t]));return r?{label:n||se[t]||A(t),value:r}:null}function S(e,t){const n=T(t);return n?{label:e,value:n}:null}function Re(e=[]){const t=new Set;return e.filter(Boolean).filter(n=>{const r=`${C(n.label)}:${n.value}`;return t.has(r)?!1:(t.add(r),!0)})}function F(e,t,n=[]){const r=Re(n);return r.length>0?{id:e,title:t,fields:r}:null}function Kn(e=null){return!e||typeof e!="object"?[]:Re([S("Name",e.clientName),S("Mobile",x(e.mobile,e.mobileRaw,e.phone)),S("Contractor",x(e.contractorNumber,e.externalCustomer,e.customerId)),S("Activation",e.activationDate),S("OTO ID",e.otoId),S("Port",x(e.otoPortId,e.crossConnectionPort)),S("SO ticket",e.soTicketNum)])}function qn(e=null){return!e||typeof e!="object"?[]:[F("caseClient","Client",[d(e,"clientName","Full name"),d(e,"contractorNumber","Contractor"),d(e,"title"),d(e,"firstName"),d(e,"lastName"),d(e,"mobile"),d(e,"mobileRaw","Mobile raw"),d(e,"phone"),d(e,"email"),d(e,"address"),d(e,"communicationLanguage","Language"),d(e,"activationDate","Activation date")]),F("caseSuperOffice","SuperOffice",[d(e,"soTicketNum","SO ticket"),d(e,"ticketCreatedAt","Created at"),d(e,"externalId","External ID"),d(e,"externalPartner","Partner"),d(e,"externalPartnerTicketNumber","Partner ticket")]),F("caseExternalId","External ID fields",[d(e,"externalFlagging","Flagging"),d(e,"externalDate","Date"),d(e,"externalCustomer","Contractor"),d(e,"externalSignalStatus","Signal"),d(e,"externalLedStatus","LED"),d(e,"externalTreatmentStep","Treatment"),d(e,"externalBoxType","Box"),d(e,"externalLexId","LEX ID"),d(e,"externalOltName","OLT"),d(e,"externalOltBoard","Board"),d(e,"externalBokBof","BOK/BOF"),d(e,"externalComment","Comment")]),F("caseTechnical","Technical",[d(e,"fllRecordId","FLL record"),d(e,"otoId","OTO ID"),d(e,"otoPortId","OTO port"),d(e,"routerSerialNumber","Router serial"),d(e,"oldRouterSerialNumber","Old router serial"),d(e,"lexId","LEX ID"),d(e,"oltName","OLT"),d(e,"oltBoard","OLT board"),d(e,"ponPort","PON port"),d(e,"breakoutCableId","Breakout cable"),d(e,"fiberNumber","Fiber number"),d(e,"lineState","Line state"),d(e,"routerStatus","Router status"),d(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{Ln as A,we as B,kn as C,ye as D,yn as E,ft as F,Rn as G,Fn as H,pt as I,Zt as K,wn as P,lt as S,_ as T,mt as a,Cn as b,An as c,En as d,Tt as e,Vn as f,ne as g,jn as h,On as i,K as j,In as k,Nn as l,Tn as m,xn as n,Un as o,vn as p,qn as q,Dn as r,_n as s,Kn as t,Sn as u,$n as v,zn as w,Mn as x,Ae as y,Bn as z};
