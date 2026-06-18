import{c as D}from"./createLucideIcon-BnnLM3Cs.js";import{p as U,b as X,S as O,F as ge,k as Q,u as Ye,B as Te,Q as ke,U as ee,V as te,J as ne,W as He}from"./tokenService-9mPrK0Fx.js";import{l as Je,a as Ge}from"./index-BJhmB7sb.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],wn=D("chevron-left",Ze);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],In=D("chevron-right",We);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],vn=D("clipboard-copy",Xe);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],Nn=D("external-link",Qe);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],Sn=D("puzzle",et),tt=/\.(jpe?g|png|webp|gif|bmp|avif)(?:$|[?#])/i,nt=/\.pdf(?:$|[?#])/i,rt=["{contractor}","{contractor_number}","{client_contractor_number}"];function w(...e){for(const t of e){const n=String(t??"").trim();if(n)return n}return""}function ot(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function at(e="",t=""){const n=`${e} ${t}`;return tt.test(n)?"image":nt.test(n)?"pdf":"file"}function it(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function st(e={}){var t,n,o;return w(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(n=e.message)==null?void 0:n.createdAt,(o=e.message)==null?void 0:o.sentAt)||null}function lt(e,t){var s,i;if(!e||typeof e!="object"||Array.isArray(e))return null;const n=w(e.url,e.href,e.src,e.downloadUrl);if(!n)return null;const o=w(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((s=String(n).split("/").pop())==null?void 0:s.split("?")[0])||""))||`Attachment ${t+1}`,r=w(e.type,e.contentType,e.mimeType),a=it(r)?"image":at(o,n);return{id:w(e.id,e.attachmentId,e.documentId)||`${t}-${o}-${n}`,name:o,url:n,type:a,size:w(e.size,e.sizeText,e.fileSize)||null,messageId:w(e.messageId,e.messageID,(i=e.message)==null?void 0:i.id)||null,date:st(e)}}function fe(e){return String(e).padStart(2,"0")}function ct(e){const t=e.getFullYear(),n=fe(e.getMonth()+1),o=fe(e.getDate());return{dateKey:`${t}-${n}-${o}`,label:`${o}.${n}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function ut(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const a=new Date(e);return Number.isNaN(a.getTime())?null:a}const t=String(e).trim();if(!t)return null;const n=t.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b/);if(n){const a=Number(n[1]),s=Number(n[2])-1,i=Number(n[3]),u=i<100?2e3+i:i,f=new Date(u,s,a);if(!Number.isNaN(f.getTime()))return f}const o=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})\b/);if(o){const a=new Date(Number(o[1]),Number(o[2])-1,Number(o[3]));if(!Number.isNaN(a.getTime()))return a}const r=new Date(t);return Number.isNaN(r.getTime())?null:r}function dt(e={}){const t=ut(e.date);return t?ct(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function mt(e,t){const n=w(t);n&&rt.forEach(o=>{e[o]=n})}function K(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(lt).filter(Boolean).filter(n=>{const o=`${n.name}|${n.url}`;return t.has(o)?!1:(t.add(o),!0)})}function q(e=[]){return K(e).filter(t=>t.type==="image")}function _n(e=[]){const t=new Map;return q(e).forEach((n,o)=>{const r=dt(n);t.has(r.dateKey)||t.set(r.dateKey,{...r,attachments:[]}),t.get(r.dateKey).attachments.push({...n,galleryIndex:o})}),Array.from(t.values()).sort((n,o)=>o.sortValue-n.sortValue)}function Cn(e){var p,b;const t=ot(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const n=w(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),o=w(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),r=w(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),a=w(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(p=t.client)==null?void 0:p.contractorNumber,(b=t.client)==null?void 0:b.contractor),s={};let i=null,u=!1;const f=K(t.attachments),l=q(f);if(r){const y=U(r);y.ok&&(u=!0,i=y.fields,Object.assign(s,X(y.fields)))}const c=(i==null?void 0:i.customer)||a;c&&(u||n||f.length>0)&&mt(s,c);const d=n||(i==null?void 0:i.soTicket)||"";return d&&(s[O]=d),Object.keys(s).length===0&&f.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:u,externalTicketId:r}:{ok:!0,ticketId:d,sourceTicketId:n,createdAt:o,externalTicketId:r,contractorNumber:c,externalIdValid:u,externalFields:i,tokenValues:s,attachments:f,imageAttachments:l,ignoredExternalId:!!(r&&!u)}}const re="super_office_ticket_payload",oe="pending_super_office_ticket_payload",ft="super-office-ticket-updated";function bt(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[ee]:t,[te]:n,...o}=e;return o}function H(e){return Array.isArray(e)?`[${e.map(H).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${H(e[t])}`).join(",")}}`:JSON.stringify(e)}function ae(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return H(bt(e))}catch{return""}}function E(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(ft,{detail:{payload:e}}))}function P(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=K(e.attachments),n=String(e.clientSignature||"").trim(),o=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([r,a])=>[r,a==null?"":String(a)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:n,tokenValues:o,attachments:t,imageAttachments:q(t)}}function pt(e,t=new Date,n=""){return P({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:n,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function ie(e){e&&await ke(re,e)}async function xe(e){e&&await ke(oe,e)}async function Y(){try{return P(await ge(oe,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function An(){return Y()}async function ht(){return await ye()||await Y()}async function En(){return!!await ht()}function se(){return Te(oe)}async function Ln(e){const t=await Q(),n=pt(e,new Date,ae(t));return n?n.clientSignature?(await ie(n),await se(),E(n),n):(await B(),await xe(n),E(null),n):null}async function Dn(e){const t=Ye(e);if(!t)return null;const n=await ye(),o=n?null:await Y(),r=n||o;if(!r)return null;const a=U(t),s=a.ok?{...r.tokenValues||{},...X(a.fields)}:r.tokenValues||{},i=P({...r,externalTicketId:t,tokenValues:s});return i?(i.clientSignature?await ie(i):await xe(i),E(i),i):null}function B(){return Te(re)}async function On(){const e=await Y(),t=ae(await Q());if(!e||!t)return null;const n={...e,clientSignature:t};return await ie(n),await se(),E(n),n}async function ye(){try{const e=await ge(re,null);if(!e)return null;const t=ae(await Q());if(!t)return await B(),null;if((e==null?void 0:e.clientSignature)!==t)return await B(),null;const n=P(e);return n||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function Vn(){await B(),await se(),E(null)}const we="quick_tools",gt="blue",_=Object.freeze({LINK:"link",MODULE:"module"}),Tt=_.LINK,kt=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],xt=new Set(kt.map(e=>e.value)),yt=new Set(Object.values(_));function wt(e){return xt.has(e)?e:gt}function Ie(e){return yt.has(e)?e:Tt}function It(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function ve(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?_.MODULE:_.LINK),n=Ie(t);return{...e,type:n,title:String(e.title||"").trim(),url:n===_.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:wt(e.color),order:It(e.order),beta:n===_.MODULE?!0:!!e.beta}}async function jn(){const e=await Je(we,[]);return Array.isArray(e)?e.map(ve).filter(Boolean):[]}async function Fn(e){const t=Array.isArray(e)?e.map(ve).filter(Boolean):[];return Ge(we,t)}function $n(e,t={}){return(e||"").replace(/\{[^}]+\}/g,n=>{const o=t[n];if(o==null||o==="")return n;const r=String(o).replace(/<[^>]+>/g,"").trim();return encodeURIComponent(r)})}function zn(e){return Ie(e==null?void 0:e.type)===_.MODULE}const R="template-tool-module-beta-1",Ne=Object.freeze({name:"Template Generator Module API",version:R,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']"],reservedContainers:["env","raw","byToken","byKey","byLabel"]},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function vt(e=Ne){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,o])=>{t.push(`- window.${n}: ${o.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,o])=>{t.push(`- ${n}: ${o}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,o])=>{t.push(`- ${n}: ${o}`)}),t.join(`
`)}const Nt=`
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
</style>`,St=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${R}";
    var apiReference = ${JSON.stringify(Ne)};
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
<\/script>`,_t=`<!doctype html>
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
</html>`;function Ct(e=""){var u;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),o=((u=n==null?void 0:n[1])==null?void 0:u.trim())||t,r=o.match(/<!doctype\s+html\b|<html[\s>]/i);if(!r)return o;const a=r.index||0,s=o.slice(a).trim(),i=s.match(/<\/html\s*>/i);return i?s.slice(0,i.index+i[0].length).trim():s}function At(e=""){const t=Ct(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:_t}function Et(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Lt(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Bn(e=""){const t=At(e),n=Lt(t,St,"template-tool-bridge");return Et(n,Nt,"template-tool-host-style")}function Dt(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const o=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:o??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function L(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function J(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function Se(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function _e(e=""){const t=Se(e);return t?t.replace(/_([a-z0-9])/g,(n,o)=>o.toUpperCase()):""}function Ce(e=""){const t=_e(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function le(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function V(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function v(e,t){const n=String(t||"").trim();if(!n)return;V(e,n);const o=Se(n),r=_e(n);o&&(V(e,o),V(e,`{${o}}`)),r&&V(e,r)}function Ot({label:e="",token:t="",key:n="",aliases:o=[],section:r=""}={}){const a=[];v(a,e),v(a,t),v(a,t.replace(/[{}]/g,"")),v(a,n);const s=le(n);return s.length>0&&(v(a,s[s.length-1]),v(a,s.join(" ")),v(a,s.join(""))),v(a,r),o.forEach(i=>v(a,i)),a}function Vt(e){const t=L(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=Ot({...e,...n}),n}function jt({tokens:e=[],clientInfo:t=[],clientSummary:n=[],profile:o=null}={}){const r=[],a=new Set,s=i=>{const u=Vt(i);if(!u)return;const f=`${u.source}:${u.label}:${u.value}:${u.token||""}:${u.key||""}`;a.has(f)||(a.add(f),r.push(u))};return e.forEach(i=>{s({label:i.label,value:i.value,token:i.token,key:i.key,aliases:i.aliases,source:"token"})}),n.forEach(i=>{s({label:i.label,value:i.value,section:"summary",source:"clientSummary"})}),t.forEach(i=>{((i==null?void 0:i.fields)||[]).forEach(u=>{s({label:u.label,value:u.value,section:i.title||i.id,source:"clientInfo"})})}),o&&typeof o=="object"&&(Array.isArray(o.availableFields)?o.availableFields:[]).forEach(i=>{s({label:i.label,value:i.value,key:i.key,aliases:i.aliases,source:"profile"})}),r}function Ft(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function $t(e,t,n){const o=le(t);if(o.length<2||n==="")return;let r=e;for(let s=0;s<o.length-1;s+=1){const i=o[s];if(!i||/^\d+$/.test(i)||(r[i]===void 0&&(r[i]={}),!r[i]||typeof r[i]!="object"||Array.isArray(r[i])))return;r=r[i]}const a=o[o.length-1];a&&!Object.prototype.hasOwnProperty.call(r,a)&&(r[a]=n)}function zt(e={},t=[]){const n={...e};return t.forEach(o=>{o.key&&$t(n,o.key,o.value),o.aliases.forEach(r=>Ft(n,r,o.value))}),Ae(n,t),n}const Bt=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function Rt(e,t){const n=J(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(o=>J(o)===n)}function Mt(e=[],t=[]){for(const n of t){const o=e.find(a=>Rt(a,n)),r=L(o==null?void 0:o.value);if(r!=="")return r}return""}function Ae(e,t=[]){Bt.forEach(({name:n,candidates:o})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const r=Mt(t,o);r!==""&&(e[n]=r)})}function Ut(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(o=>{const r=J(o);!r||t[r]||(t[r]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function z(e,t,n){const o=Ce(t);!o||n===""||Object.prototype.hasOwnProperty.call(e,o)||(e[o]=n)}function Kt(e,t,n){const o=le(t).map(Ce).filter(Boolean);if(o.length<2||n==="")return;let r=e;for(let s=0;s<o.length-1;s+=1){const i=o[s];if(r[i]===void 0&&(r[i]={}),!r[i]||typeof r[i]!="object"||Array.isArray(r[i]))return;r=r[i]}const a=o[o.length-1];a&&!Object.prototype.hasOwnProperty.call(r,a)&&(r[a]=n)}function qt(e,t=null){if(!t||typeof t!="object")return;const n=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(n).forEach(([o,r])=>{const a=L(r);a!==""&&z(e,o,a)})}function Pt({fields:e=[],tokenValues:t={},environment:n={},profile:o=null}={}){const r={env:n,raw:t,byToken:{},byKey:{},byLabel:{}};return Object.entries(t||{}).forEach(([a,s])=>{const i=L(s);i!==""&&(r.byToken[a]=i,z(r,a,i),z(r,a.replace(/[{}]/g,""),i))}),qt(r,o),e.forEach(a=>{const s=L(a.value);s!==""&&(a.token&&(r.byToken[a.token]=s),a.key&&(r.byKey[a.key]=s,Kt(r,a.key,s)),r.byLabel[a.label]=s,[a.label,a.token,a.key,...a.aliases||[]].forEach(i=>{z(r,i,s)}))}),Ae(r,e),r}function Rn({tool:e={},values:t={},tokens:n=[],client:o=null,clientInfo:r=[],clientSummary:a=[],profile:s=null}={}){const i=t&&typeof t=="object"?t:{},u=s&&typeof s=="object"?s:null,f=u!=null&&u.tokenValues&&typeof u.tokenValues=="object"?u.tokenValues:{},l={...i,...f},c=Array.isArray(r)?r:[],d=Array.isArray(a)?a:[],p=Dt(n,l),b=jt({tokens:p,clientInfo:c,clientSummary:d,profile:u}),y=new Date().toISOString(),I={apiVersion:R,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:y};return{apiVersion:R,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:u||null,values:zt(l,b),tokenValues:l,tokens:p,fields:b,fieldIndex:Ut(b),variables:Pt({fields:b,tokenValues:l,environment:I,profile:u}),environment:I,client:o&&typeof o=="object"?o:null,clientInfo:c,clientSummary:d,generatedAt:y}}function Mn({title:e="",prompt:t=""}={}){const n=String(e||"").trim()||"Custom tool",o=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.

Return one complete HTML file, and nothing else.
- Put all HTML, CSS and JavaScript in that single file.
- Prefer attaching the result as a downloadable .html file when the chat interface supports files.
- If you cannot attach a file, return exactly one fenced code block containing the full HTML document from <!doctype html> to </html>.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not include explanations before or after the file.
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Module API reference:
${vt()}

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
${o}`}const Ee="salt-templater-alo-autofill",Yt=1,j=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function N(e){return e==null?"":String(e).trim()}function g(e){for(const t of e){const n=N(t);if(n)return n}return""}function Ht(e){const t=N(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:N(e)}function G(e){const t=N(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const o=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(o)return`${o[3]}-${o[2]}-${o[1]}`;const r=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return r?`${r[3]}-${r[1].padStart(2,"0")}-${r[2].padStart(2,"0")}`:t}function M(e){const t=G(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function Jt(e={}){var t,n,o,r,a,s,i;return g([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(o=e==null?void 0:e.client)==null?void 0:o.activation_date,(r=e==null?void 0:e.client)==null?void 0:r.activation,(a=e==null?void 0:e.client)==null?void 0:a.dateActivation,(s=e==null?void 0:e.contact)==null?void 0:s.activationDate,(i=e==null?void 0:e.healthcheck)==null?void 0:i.activationDate])}function Gt(e={}){const t=[e.SignalStatus,e.LedStatus,e.treatmentStep,e.comment].join(" ").toLowerCase();return/(low|bad|rx|tx|performance)/i.test(t)?"lowBadRxTx":"noSignal"}function Zt(e={}){const t=N(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function Le(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",o=t==="lowBadRxTx"?"Bad signal":"No signal",r=M(n==="never"?e.activationDate:e.disconnectionDate);return[o,n==="never"?"Never activated":"Signal lost",r].filter(Boolean).join(" - ")}function Un(e={},t={}){var l,c,d,p;const n=g([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(c=e==null?void 0:e.client)==null?void 0:c.externalId,(d=e==null?void 0:e.superOffice)==null?void 0:d.externalTicketId]),o=U(n),r=o.ok?o.fields:{},a=Gt(r),s=Zt(r),i=G(Jt(e)),u=G(g([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt])),f=g([t==null?void 0:t.sourceTicketId,t==null?void 0:t.ticketId,(p=t==null?void 0:t.tokenValues)==null?void 0:p[O],r.soTicket]);return{externalId:n,externalFields:r,aloType:a,signalState:s,extRef:f,disconnectionDate:s==="lost"?u:"",activationDate:i,description:Le({aloType:a,signalState:s,disconnectionDate:u,activationDate:i})}}function De(e={}){return{firstName:N(e.firstName),lastName:N(e.lastName),email:N(e.email),phoneNumber:g([e.phoneNumber,e.phone])}}function Oe(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:g([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[O],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:N(e==null?void 0:e.externalTicketId),tokenValues:t}}function Wt(e={},t={},n={},o={}){const r=(e==null?void 0:e.client)||{},a=(e==null?void 0:e.contact)||{},s=(e==null?void 0:e.healthcheck)||{},i=De(t),u=Oe(n),f=g([a.fixedNumber,a.voipNumber,a.voip,a.sip,r.fixedNumber,r.fixedPhone]),l=Ht(g([r.mobile,r.mobileRaw,r.phone,r.telephone,a.mobile,a.phone])),c=g([o.description,o.aloType==="lowBadRxTx"?"Bad signal":"",j.problemDescription]),d=g([o.notes,o.signalState?Le(o):"",j.problemNotes]),p=o.signalState==="never"?M(o.activationDate):M(o.disconnectionDate);return{externalReference:g([o.extRef,u.ticketId]),socketId:g([s.otoId,s.oto_id,s.oto]),plugNr:g([s.otoPortId,s.otoPort,s.oto_port]),breakoutCable:g([s.breakoutCableId,s.breakoutCable,s.cable]),breakoutFiber:g([s.fiberNumber,s.fiber,s.fibre]),firstName:g([r.firstName,r.firstname,r.givenName]),lastName:g([r.lastName,r.lastname,r.surname,r.familyName]),contactPhone1:g([f,l]),contactPhone2:f&&l&&f!==l?l:"",contactEmail:g([r.email,r.mail,a.email,a.mail]),ispFirstName:i.firstName,ispLastName:i.lastName,ispPhone:i.phoneNumber,ispEmail:i.email,...j,problemDescription:c,problemNotes:d,problemDateTime:p,problemCode3:o.aloType==="lowBadRxTx"?"Performance problem":j.problemCode3}}function Xt(e={},t={},n={},o={}){const r=Wt(e,t,n,o),a=De(t),s=Oe(n);return{source:Ee,version:Yt,fields:r,alo:{type:o.aloType||"noSignal",signalState:o.signalState||"",disconnectionDate:o.disconnectionDate||"",activationDate:o.activationDate||"",problemDateTime:r.problemDateTime,notes:o.notes||""},client:{firstName:r.firstName,lastName:r.lastName,contactPhone1:r.contactPhone1,contactPhone2:r.contactPhone2,email:r.contactEmail},technical:{socketId:r.socketId,plugNr:r.plugNr,breakoutCable:r.breakoutCable,breakoutFiber:r.breakoutFiber},agent:a,superOffice:s}}function Kn(e={},t={},n={},o={}){return JSON.stringify(Xt(e,t,n,o),null,2)}function Qt(e){function t(l){return l==null?"":String(l).trim()}function n(l){for(var c=0;c<l.length;c+=1){var d=t(l[c]);if(d)return d}return""}function o(l){return t(l).replace(/[&<>"']/g,function(d){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[d]})}function r(l,c,d){var p=document.getElementById("saltAloFillOverlay");p&&p.remove();var b=document.createElement("div");b.id="saltAloFillOverlay",b.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(d==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",b.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+o(l)+"</strong><span style='color:#d8d8df'>"+o(c)+"</span>",document.body.appendChild(b),d!=="error"&&setTimeout(function(){try{b.remove()}catch{}},4500)}function a(l,c,d){var p=l&&l.fields||{};return n([p[c]].concat(d||[]))}function s(l,c){var d=String(c).replace(/["\\]/g,"\\$&");return document.querySelector("["+l+'="'+d+'"]')}function i(l){return document.getElementById(l)||s("name",l)||s("formcontrolname",l)||s("data-testid",l)}function u(l,c,d){var p=d?String(c??""):t(c);if(!d&&!p)return!1;var b=i(l);if(!b)return!1;if(b.tagName==="SELECT")for(var y=t(p).toLowerCase(),I=0;I<b.options.length;I+=1){var h=b.options[I];if(t(h.value).toLowerCase()===y||t(h.textContent).toLowerCase()===y){b.value=h.value;break}}else"value"in b?b.value=p:b.textContent=p;return b.dispatchEvent(new Event("input",{bubbles:!0})),b.dispatchEvent(new Event("change",{bubbles:!0})),!0}function f(l){if(!l||typeof l!="object"||Array.isArray(l)){r("ALO fill","ALO fill data invalid.","error");return}if(l.source&&l.source!==e){r("ALO fill","Clipboard does not contain ALO fill data from Salt Templater.","error");return}var c=l.client||{},d=l.technical||l.healthcheck||{},p=l.agent||{},b=l.superOffice||{},y=b.tokenValues||l.tokenValues||{},I=0;function h(Ke,qe,Pe){u(Ke,qe,Pe)&&(I+=1)}if(h("ticket.extRef",a(l,"externalReference",[b.sourceTicketId,b.ticketId,l.ticketId,y["{so_ticket_num}"]])),h("ticket.socketId",a(l,"socketId",[d.socketId,d.otoId,d.oto_id,d.oto])),h("ticket.plugNr",a(l,"plugNr",[d.plugNr,d.otoPortId,d.otoPort,d.oto_port])),h("ticket.breakoutCable",a(l,"breakoutCable",[d.breakoutCable,d.breakoutCableId,d.cable])),h("ticket.breakoutFiber",a(l,"breakoutFiber",[d.breakoutFiber,d.fiberNumber,d.fiber,d.fibre])),h("ticket.otoAddress.firstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),h("ticket.otoAddress.lastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),h("ticket.contactPersonFirstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),h("ticket.contactPersonLastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),h("ticket.contactPersonPhone1",a(l,"contactPhone1",[c.contactPhone1,c.fixedNumber,c.mobileRaw,c.mobile,c.phone])),h("ticket.contactPersonPhone2",a(l,"contactPhone2",[c.contactPhone2])),h("ticket.contactPersonMail",a(l,"contactEmail",[c.email,c.mail])),h("ticket.contactPersonIspFirstName",a(l,"ispFirstName",[p.firstName])),h("ticket.contactPersonIspLastName",a(l,"ispLastName",[p.lastName])),h("ticket.contactPersonIspPhone",a(l,"ispPhone",[p.phoneNumber,p.phone])),h("ticket.contactPersonIspMail",a(l,"ispEmail",[p.email])),h("ticket.problemDescription",a(l,"problemDescription",["No signal"])),h("ticket.problemNotes",a(l,"problemNotes",[""]),!0),h("ticket.problemDateTime",a(l,"problemDateTime",[l.alo&&l.alo.problemDateTime])),h("ticket.problemCode1",a(l,"problemCode1",["400"])),h("ticket.problemCode2",a(l,"problemCode2",["800"])),h("ticket.problemCode3",a(l,"problemCode3",["900"])),!I){r("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}r("ALO fill","Fields populated: "+I,"success")}if(r("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){r("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(c){if(!t(c)){r("ALO fill","Clipboard empty. Click ALO fill in Salt Templater first.","error");return}var d;try{d=JSON.parse(c)}catch{r("ALO fill","Clipboard does not contain valid ALO data.","error");return}f(d)}).catch(function(c){r("ALO fill","Clipboard error: "+(c&&c.message?c.message:c),"error")})}function qn(){const e=JSON.stringify(Ee);return`javascript:(${Qt.toString()})(${e});`}const en=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),tn=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function F(e,t){return!!(e!=null&&e[t])}function nn(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Ve(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function rn(e,t){return F(e,"ctrlKey")===!!t.ctrlKey&&F(e,"altKey")===!!t.altKey&&F(e,"shiftKey")===!!t.shiftKey&&F(e,"metaKey")===!!t.metaKey}function on(e,t){return rn(e,t)&&(nn(e==null?void 0:e.key,t.key)||Ve(e==null?void 0:e.code,t.code))}function Pn(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function an(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(tn))}function sn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||an(e==null?void 0:e.target))}function Yn(e){if(sn(e))return null;const t=en.find(n=>on(e,n))||null;return!t||e!=null&&e.isComposing&&!Ve(e==null?void 0:e.code,t.code)?null:t}const ln="case-profile-beta-1",je=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),ce=Object.freeze(Object.fromEntries(je)),Fe=Object.freeze(je.map(([e])=>e)),cn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),Z=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),$e=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function T(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function k(...e){for(const t of e){const n=T(t);if(n!=="")return n}return""}function C(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function un(e=""){const t=C(e);return t?t.replace(/_([a-z0-9])/g,(n,o)=>o.toUpperCase()):""}function ue(e=""){const t=un(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function be(e=""){const t=C(e);return t?`{${t}}`:""}function A(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function dn(){const e={};return Fe.forEach(t=>{e[t]=""}),{version:ln,fields:e,fieldLabels:{...ce},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function ze(e){return T(e)!==""}function x(e,t,n,{overwrite:o=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const r=T(n);return r===""||!o&&ze(e.fields[t])?!1:(e.fields[t]=r,e[t]=r,!0)}function de(e,t,n,{overwrite:o=!1,label:r=""}={}){const a=ue(t),s=T(n);return!a||s===""||$e.has(a)||!o&&Object.prototype.hasOwnProperty.call(e.dynamic,a)?!1:(e.dynamic[a]=s,r&&!e.fieldLabels[a]&&(e.fieldLabels[a]=r),!0)}function mn(e,t,n,o={}){const r=C(ne(t)||t),a=Z[r]||Z[C(t)]||ue(t);return Object.prototype.hasOwnProperty.call(e.fields,a)?x(e,a,n,o):de(e,t,n,o)}function fn(e,t={},n={}){Object.entries(t).forEach(([o,r])=>x(e,o,r,n))}function W(e,t=[],n=[]){return Array.isArray(e)?(e.forEach((o,r)=>{t.push(String(r+1)),W(o,t,n),t.pop()}),n):e&&typeof e=="object"?(Object.keys(e).forEach(o=>{t.push(o),W(e[o],t,n),t.pop()}),n):(n.push({path:t.slice(),value:T(e)}),n)}function bn(e=[]){return e[0]===ee||e[0]===te}function Be(e,t,{prefix:n="",skipInternalClientKeys:o=!1}={}){!t||typeof t!="object"||W(t).filter(r=>r.value!=="").filter(r=>!o||!bn(r.path)).forEach(r=>{const a=n?[n,...r.path]:r.path;de(e,a.join("_"),r.value,{label:a.map(A).join(" ")})})}function pe(e=[],t=[]){const n=new Map;return[...e,...t].forEach(o=>{if(!o||typeof o!="object")return;const r=`${T(o.url)}|${T(o.name)}|${T(o.id)}`;r.replace(/\|/g,"")&&(n.has(r)||n.set(r,o))}),Array.from(n.values())}function me(e){const t=T(e);if(!t)return null;const n=U(t);return n.ok?{externalId:t,fields:n.fields}:null}function Re(e,t){var n,o,r,a;t&&(x(e,"externalId",t.externalId),Object.entries(cn).forEach(([s,i])=>{var u;x(e,i,(u=t.fields)==null?void 0:u[s])}),x(e,"contractorNumber",(n=t.fields)==null?void 0:n.customer),x(e,"lexId",(o=t.fields)==null?void 0:o.lexId),x(e,"oltName",(r=t.fields)==null?void 0:r.oltName),x(e,"oltBoard",(a=t.fields)==null?void 0:a.oltBoard))}function pn(e,t){var i;if(!t||typeof t!="object")return;const n=t.client||{},o=t.contact||{},r=t.healthcheck||{},a=r.crossConnexion||r.crossConnection||{},s=[n.firstName,n.lastName].map(T).filter(Boolean).join(" ");fn(e,{clientName:s||k(n.fullName,n.name,n.customerName),title:n.title,firstName:n.firstName,lastName:n.lastName,contractorNumber:k(n.contractorNumber,n.contractor,r.customerId),mobile:k(n.mobile,n.phone,n.telephone),mobileRaw:n.mobileRaw,phone:k(n.phone,n.telephone,o.fixedNumber),email:n.email,address:n.address,communicationLanguage:k(n.communicationLanguage,o.communicationLanguage,n.language,o.language),activationDate:k(n.activationDate,n.activation_date,n.activation,n.dateActivation,(i=t.offer)==null?void 0:i.activationDate,o.activationDate,r.activationDate),eligibilitySource:k(n.eligibilitySource,o.eligibilitySource),contactRecordId:k(n.contactRecordId,o.contactRecordId),fixedNumber:o.fixedNumber,publicId:o.publicId,fllRecordId:r.fllRecordId,otoId:k(r.otoId,r.oto_id,r.oto),otoPortId:k(r.otoPortId,r.otoPort,r.oto_port,a.Port),routerSerialNumber:r.routerSerialNumber,oldRouterSerialNumber:r.oldRouterSerialNumber,lexId:r.lexId,oltName:r.oltName,oltBoard:r.oltBoard,ponPort:r.ponPort,breakoutCableId:r.breakoutCableId,fiberNumber:r.fiberNumber,lineState:r.lineState,routerStatus:r.routerStatus,odfId:r.odfId,option82:r.option82,oltObject:r.oltObject,ontConfigurationFilename:r.ontConfigurationFilename,svlan:r.svlan,customerId:r.customerId,crossConnectionEquipment:a.Equipment,crossConnectionRack:a.Rack,crossConnectionSlot:a.Slot,crossConnectionPort:a.Port}),Re(e,me(t[te])),Be(e,t,{skipInternalClientKeys:!0})}function hn(e,t){var r;if(!t||typeof t!="object")return;x(e,"soTicketNum",k(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(r=t.tokenValues)==null?void 0:r[O])),x(e,"ticketCreatedAt",k(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),Re(e,me(t.externalTicketId)),Me(e,t.tokenValues);const n=K(t.attachments),o=q(n);e.attachments=pe(e.attachments,n),e.photos=pe(e.photos,o),Be(e,t,{prefix:"ticket"})}function Me(e,t={},n={}){!t||typeof t!="object"||Object.entries(t).forEach(([o,r])=>{const a=T(r);if(a==="")return;const s=ne(o),i=He(s)||C(o),u=Z[i];u&&x(e,u,a,n),i==="external_customer"&&x(e,"contractorNumber",a,n),i==="external_lex_id"&&x(e,"lexId",a,n),i==="external_olt_name"&&x(e,"oltName",a,n),i==="external_olt_board"&&x(e,"oltBoard",a,n),de(e,i,a,{...n,label:A(i)})})}function gn(e,t){const n=t==null?void 0:t[ee];!n||typeof n!="object"||Array.isArray(n)||Object.entries(n).forEach(([o,r])=>{mn(e,o,r,{overwrite:!0,label:A(o)})})}function he(e,t,n){const o=ue(t),r=T(n);!o||r===""||$e.has(o)||Object.prototype.hasOwnProperty.call(e,o)||(e[o]=r)}function Tn(e,t={}){const n={},o={},r=[];Fe.forEach(i=>{const u=T(e.fields[i]);if(u==="")return;he(n,i,u);const f=be(i);f&&(o[f]=u),r.push({key:i,label:ce[i]||A(i),value:u})}),Object.entries(e.dynamic).forEach(([i,u])=>{const f=T(u);if(f==="")return;he(n,i,f);const l=be(i);l&&!Object.prototype.hasOwnProperty.call(o,l)&&(o[l]=f),e.fields[i]||r.push({key:i,label:e.fieldLabels[i]||A(i),value:f})});const a=me(e.externalId);a&&Object.assign(o,X(a.fields)),ze(e.soTicketNum)&&(o[O]=e.soTicketNum);const s={};return Object.entries(t||{}).forEach(([i,u])=>{const f=ne(i)||i;s[f]=u}),e.vars=n,e.variables=n,e.tokenValues={...s,...o},e.availableFields=r,e}function Hn({clientPayload:e=null,superOfficePayload:t=null,tokenValues:n={}}={}){const o=dn();return pn(o,e),hn(o,t),Me(o,n),gn(o,e),Tn(o,n)}function m(e,t,n=""){var r;const o=T((e==null?void 0:e[t])??((r=e==null?void 0:e.fields)==null?void 0:r[t]));return o?{label:n||ce[t]||A(t),value:o}:null}function S(e,t){const n=T(t);return n?{label:e,value:n}:null}function Ue(e=[]){const t=new Set;return e.filter(Boolean).filter(n=>{const o=`${C(n.label)}:${n.value}`;return t.has(o)?!1:(t.add(o),!0)})}function $(e,t,n=[]){const o=Ue(n);return o.length>0?{id:e,title:t,fields:o}:null}function Jn(e=null){return!e||typeof e!="object"?[]:Ue([S("Name",e.clientName),S("Mobile",k(e.mobile,e.mobileRaw,e.phone)),S("Contractor",k(e.contractorNumber,e.externalCustomer,e.customerId)),S("Activation",e.activationDate),S("OTO ID",e.otoId),S("Port",k(e.otoPortId,e.crossConnectionPort)),S("SO ticket",e.soTicketNum)])}function Gn(e=null){return!e||typeof e!="object"?[]:[$("caseClient","Client",[m(e,"clientName","Full name"),m(e,"contractorNumber","Contractor"),m(e,"title"),m(e,"firstName"),m(e,"lastName"),m(e,"mobile"),m(e,"mobileRaw","Mobile raw"),m(e,"phone"),m(e,"email"),m(e,"address"),m(e,"communicationLanguage","Language"),m(e,"activationDate","Activation date")]),$("caseSuperOffice","SuperOffice",[m(e,"soTicketNum","SO ticket"),m(e,"ticketCreatedAt","Created at"),m(e,"externalId","External ID"),m(e,"externalPartner","Partner"),m(e,"externalPartnerTicketNumber","Partner ticket")]),$("caseExternalId","External ID fields",[m(e,"externalFlagging","Flagging"),m(e,"externalDate","Date"),m(e,"externalCustomer","Contractor"),m(e,"externalSignalStatus","Signal"),m(e,"externalLedStatus","LED"),m(e,"externalTreatmentStep","Treatment"),m(e,"externalBoxType","Box"),m(e,"externalLexId","LEX ID"),m(e,"externalOltName","OLT"),m(e,"externalOltBoard","Board"),m(e,"externalBokBof","BOK/BOF"),m(e,"externalComment","Comment")]),$("caseTechnical","Technical",[m(e,"fllRecordId","FLL record"),m(e,"otoId","OTO ID"),m(e,"otoPortId","OTO port"),m(e,"routerSerialNumber","Router serial"),m(e,"oldRouterSerialNumber","Old router serial"),m(e,"lexId","LEX ID"),m(e,"oltName","OLT"),m(e,"oltBoard","OLT board"),m(e,"ponPort","PON port"),m(e,"breakoutCableId","Breakout cable"),m(e,"fiberNumber","Fiber number"),m(e,"lineState","Line state"),m(e,"routerStatus","Router status"),m(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{Le as A,qn as B,vn as C,Fn as D,Nn as E,ve as F,Ie as G,gt as H,Pn as I,Mn as J,en as K,kt as L,Sn as P,ft as S,_ as T,ye as a,On as b,Vn as c,jn as d,wt as e,Bn as f,ae as g,Rn as h,zn as i,q as j,_n as k,An as l,wn as m,In as n,Hn as o,Cn as p,Gn as q,$n as r,Ln as s,Jn as t,ht as u,En as v,Un as w,Kn as x,Dn as y,Yn as z};
