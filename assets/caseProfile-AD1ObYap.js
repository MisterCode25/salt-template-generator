import{c as O}from"./createLucideIcon-BDVsJ0sS.js";import{p as q,a as ee,S as V,L as P,H as Ie,o as te,w as We,F as we,T as Ne,W as ne,X as re,Y as Qe}from"./tokenService-mnO8ycCB.js";import{l as et,a as tt}from"./index-B72IMIQN.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Dn=O("chevron-left",nt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],On=O("chevron-right",rt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],Vn=O("clipboard-copy",ot);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],jn=O("external-link",at);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],Fn=O("puzzle",it),st=/\.(jpe?g|png|webp|gif|bmp|avif)(?:$|[?#])/i,lt=/\.pdf(?:$|[?#])/i,ct=["{contractor}","{contractor_number}","{client_contractor_number}"];function g(...e){for(const t of e){const n=String(t??"").trim();if(n)return n}return""}function ut(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function dt(e="",t=""){const n=`${e} ${t}`;return st.test(n)?"image":lt.test(n)?"pdf":"file"}function mt(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function ft(e={}){var t,n,r;return g(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(n=e.message)==null?void 0:n.createdAt,(r=e.message)==null?void 0:r.sentAt)||null}function E(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function bt(e,t){var i,u,f,l,c;if(!e||typeof e!="object"||Array.isArray(e))return null;const n=g(e.url,e.href,e.src,e.downloadUrl);if(!n)return null;const r=g(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((i=String(n).split("/").pop())==null?void 0:i.split("?")[0])||""))||`Attachment ${t+1}`,o=g(e.type,e.contentType,e.mimeType),a=mt(o)?"image":dt(r,n),s=g(e.messageId,e.messageID,e.postId,(u=e.message)==null?void 0:u.id)||null;return{id:g(e.id,e.attachmentId,e.documentId)||`${t}-${r}-${n}`,name:r,url:n,type:a,size:g(e.size,e.sizeText,e.fileSize)||null,messageId:s,postId:g(e.postId,s)||null,messageIndex:E(g(e.messageIndex,e.messageOrder,e.postIndex,(f=e.message)==null?void 0:f.index)),attachmentIndex:E(g(e.attachmentIndex,e.fileIndex)),messageAuthor:g(e.messageAuthor,e.author,e.createdBy,(l=e.message)==null?void 0:l.author,(c=e.message)==null?void 0:c.createdBy)||null,source:g(e.source,e.origin)||null,date:ft(e)}}function pe(e){return String(e).padStart(2,"0")}function pt(e){const t=e.getFullYear(),n=pe(e.getMonth()+1),r=pe(e.getDate());return{dateKey:`${t}-${n}-${r}`,label:`${r}.${n}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function he(e,t,n,r=0,o=0,a=0){if(t<0||t>11||n<1||n>31||r<0||r>23||o<0||o>59||a<0||a>59)return null;const s=new Date(e,t,n,r,o,a);return s.getFullYear()!==e||s.getMonth()!==t||s.getDate()!==n?null:s}function ht(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const a=new Date(e);return Number.isNaN(a.getTime())?null:a}const t=String(e).trim();if(!t)return null;const n=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const a=he(Number(n[1]),Number(n[2])-1,Number(n[3]),Number(n[4]||0),Number(n[5]||0),Number(n[6]||0));if(a)return a}const r=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(r){const a=Number(r[1]),s=r[2],i=Number(r[3]),u=Number(r[4]),f=u<100?2e3+u:u,l=Number(r[5]||0),c=Number(r[6]||0),d=Number(r[7]||0),p=s==="/"&&i>12&&a<=12,b=p?i:a,I=(p?a:i)-1,w=he(f,I,b,l,c,d);if(w)return w}const o=new Date(t);return Number.isNaN(o.getTime())?null:o}function oe(e={}){const t=ht(e.date);return t?pt(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function gt(e,t){const n=g(t);n&&ct.forEach(r=>{e[r]=n})}function ge(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function Tt(e,t,n){const r=P(t),o=g(n);!r||!o||e.push([r,o])}function ve(e,t=[]){const n=[];return ge(e)&&Object.entries(e).forEach(([r,o])=>{if(ge(o)){n.push(...ve(o,[...t,r]));return}Tt(n,[...t,r].join("."),o)}),n}function xt(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(n=>{ve(e[n]).forEach(([r,o])=>{t[r]=o})}),t}function Y(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(bt).filter(Boolean).filter(n=>{const r=`${n.name}|${n.url}`;return t.has(r)?!1:(t.add(r),!0)})}function j(e=[]){return Y(e).filter(t=>t.type==="image")}function kt(e=[]){const t=new Map;return j(e).forEach((n,r)=>{const o=oe(n);t.has(o.dateKey)||t.set(o.dateKey,{...o,attachments:[]}),t.get(o.dateKey).attachments.push({...n,galleryIndex:r})}),Array.from(t.values()).sort((n,r)=>r.sortValue-n.sortValue)}function Te(e={}){var t;return g(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function yt(e={},t=0){const n=E(e.messageNumber),r=E(e.messageIndex);return`Post ${n||(r===null?t+1:r+1)}`}function It(e={}){const t=oe(e),n=g(e.messageAuthor);return t.dateKey==="unknown"?n:[t.label,n].filter(Boolean).join(" · ")}function $n(e=[]){const t=j(e);if(!t.some(r=>Te(r)))return kt(t);const n=new Map;return t.forEach((r,o)=>{const a=Te(r),s=oe(r),i=a||`unassigned:${s.dateKey}`;if(!n.has(i)){const u=n.size;n.set(i,{dateKey:i,label:a?yt(r,u):s.label,metaLabel:a?It(r):"",sortValue:E(r.messageIndex)??o,attachments:[]})}n.get(i).attachments.push({...r,galleryIndex:o})}),Array.from(n.values()).sort((r,o)=>r.sortValue-o.sortValue)}function zn(e){var p,b;const t=ut(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const n=g(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),r=g(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),o=g(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),a=g(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(p=t.client)==null?void 0:p.contractorNumber,(b=t.client)==null?void 0:b.contractor),s={};let i=null,u=!1;const f=Y(t.attachments),l=j(f);if(o){const I=q(o);I.ok&&(u=!0,i=I.fields,Object.assign(s,ee(I.fields)))}Object.assign(s,xt(t));const c=(i==null?void 0:i.customer)||a;c&&(u||n||f.length>0)&&gt(s,c);const d=n||(i==null?void 0:i.soTicket)||"";return d&&(s[V]=d),Object.keys(s).length===0&&f.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:u,externalTicketId:o}:{ok:!0,ticketId:d,sourceTicketId:n,createdAt:r,externalTicketId:o,contractorNumber:c,externalIdValid:u,externalFields:i,tokenValues:s,attachments:f,imageAttachments:l,ignoredExternalId:!!(o&&!u)}}const ae="super_office_ticket_payload",ie="pending_super_office_ticket_payload",wt="super-office-ticket-updated";function Nt(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[ne]:t,[re]:n,...r}=e;return r}function G(e){return Array.isArray(e)?`[${e.map(G).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${G(e[t])}`).join(",")}}`:JSON.stringify(e)}function se(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return G(Nt(e))}catch{return""}}function L(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(wt,{detail:{payload:e}}))}function H(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=Y(e.attachments),n=String(e.clientSignature||"").trim(),r=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([o,a])=>[o,a==null?"":String(a)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:n,tokenValues:r,attachments:t,imageAttachments:j(t)}}function vt(e,t=new Date,n=""){return H({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:n,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function le(e){e&&await Ne(ae,e)}async function Se(e){e&&await Ne(ie,e)}async function J(){try{return H(await Ie(ie,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function Bn(){return J()}async function St(){return await _e()||await J()}async function Rn(){return!!await St()}function ce(){return we(ie)}async function Mn(e){const t=await te(),n=vt(e,new Date,se(t));return n?n.clientSignature?(await le(n),await ce(),L(n),n):(await M(),await Se(n),L(null),n):null}async function Kn(e){const t=We(e);if(!t)return null;const n=await _e(),r=n?null:await J(),o=n||r;if(!o)return null;const a=q(t),s=a.ok?{...o.tokenValues||{},...ee(a.fields)}:o.tokenValues||{},i=H({...o,externalTicketId:t,tokenValues:s});return i?(i.clientSignature?await le(i):await Se(i),L(i),i):null}function M(){return we(ae)}async function Un(){const e=await J(),t=se(await te());if(!e||!t)return null;const n={...e,clientSignature:t};return await le(n),await ce(),L(n),n}async function _e(){try{const e=await Ie(ae,null);if(!e)return null;const t=se(await te());if(!t)return await M(),null;if((e==null?void 0:e.clientSignature)!==t)return await M(),null;const n=H(e);return n||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function qn(){await M(),await ce(),L(null)}const Ae="quick_tools",_t="blue",_=Object.freeze({LINK:"link",MODULE:"module"}),At=_.LINK,Ct=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],Et=new Set(Ct.map(e=>e.value)),Lt=new Set(Object.values(_));function Dt(e){return Et.has(e)?e:_t}function Ce(e){return Lt.has(e)?e:At}function Ot(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function Ee(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?_.MODULE:_.LINK),n=Ce(t);return{...e,type:n,title:String(e.title||"").trim(),url:n===_.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:Dt(e.color),order:Ot(e.order),beta:n===_.MODULE?!0:!!e.beta}}async function Pn(){const e=await et(Ae,[]);return Array.isArray(e)?e.map(Ee).filter(Boolean):[]}async function Yn(e){const t=Array.isArray(e)?e.map(Ee).filter(Boolean):[];return tt(Ae,t)}function Hn(e,t={}){return(e||"").replace(/\{[^}]+\}/g,n=>{const r=t[n];if(r==null||r==="")return n;const o=String(r).replace(/<[^>]+>/g,"").trim();return encodeURIComponent(o)})}function Jn(e){return Ce(e==null?void 0:e.type)===_.MODULE}const K="template-tool-module-beta-1",Le=Object.freeze({name:"Template Generator Module API",version:K,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']"],reservedContainers:["env","raw","byToken","byKey","byLabel"]},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function Vt(e=Le){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,r])=>{t.push(`- window.${n}: ${r.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.join(`
`)}const jt=`
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
</style>`,Ft=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${K}";
    var apiReference = ${JSON.stringify(Le)};
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
<\/script>`,$t=`<!doctype html>
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
</html>`;function zt(e=""){var u;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),r=((u=n==null?void 0:n[1])==null?void 0:u.trim())||t,o=r.match(/<!doctype\s+html\b|<html[\s>]/i);if(!o)return r;const a=o.index||0,s=r.slice(a).trim(),i=s.match(/<\/html\s*>/i);return i?s.slice(0,i.index+i[0].length).trim():s}function Bt(e=""){const t=zt(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:$t}function Rt(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Mt(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Gn(e=""){const t=Bt(e),n=Mt(t,Ft,"template-tool-bridge");return Rt(n,jt,"template-tool-host-style")}function Kt(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const r=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:r??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function D(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function X(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function De(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Oe(e=""){const t=De(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function Ve(e=""){const t=Oe(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function ue(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function F(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function N(e,t){const n=String(t||"").trim();if(!n)return;F(e,n);const r=De(n),o=Oe(n);r&&(F(e,r),F(e,`{${r}}`)),o&&F(e,o)}function Ut({label:e="",token:t="",key:n="",aliases:r=[],section:o=""}={}){const a=[];N(a,e),N(a,t),N(a,t.replace(/[{}]/g,"")),N(a,n);const s=ue(n);return s.length>0&&(N(a,s[s.length-1]),N(a,s.join(" ")),N(a,s.join(""))),N(a,o),r.forEach(i=>N(a,i)),a}function qt(e){const t=D(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=Ut({...e,...n}),n}function Pt({tokens:e=[],clientInfo:t=[],clientSummary:n=[],profile:r=null}={}){const o=[],a=new Set,s=i=>{const u=qt(i);if(!u)return;const f=`${u.source}:${u.label}:${u.value}:${u.token||""}:${u.key||""}`;a.has(f)||(a.add(f),o.push(u))};return e.forEach(i=>{s({label:i.label,value:i.value,token:i.token,key:i.key,aliases:i.aliases,source:"token"})}),n.forEach(i=>{s({label:i.label,value:i.value,section:"summary",source:"clientSummary"})}),t.forEach(i=>{((i==null?void 0:i.fields)||[]).forEach(u=>{s({label:u.label,value:u.value,section:i.title||i.id,source:"clientInfo"})})}),r&&typeof r=="object"&&(Array.isArray(r.availableFields)?r.availableFields:[]).forEach(i=>{s({label:i.label,value:i.value,key:i.key,aliases:i.aliases,source:"profile"})}),o}function Yt(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function Ht(e,t,n){const r=ue(t);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const i=r[s];if(!i||/^\d+$/.test(i)||(o[i]===void 0&&(o[i]={}),!o[i]||typeof o[i]!="object"||Array.isArray(o[i])))return;o=o[i]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function Jt(e={},t=[]){const n={...e};return t.forEach(r=>{r.key&&Ht(n,r.key,r.value),r.aliases.forEach(o=>Yt(n,o,r.value))}),je(n,t),n}const Gt=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function Xt(e,t){const n=X(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(r=>X(r)===n)}function Zt(e=[],t=[]){for(const n of t){const r=e.find(a=>Xt(a,n)),o=D(r==null?void 0:r.value);if(o!=="")return o}return""}function je(e,t=[]){Gt.forEach(({name:n,candidates:r})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const o=Zt(t,r);o!==""&&(e[n]=o)})}function Wt(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(r=>{const o=X(r);!o||t[o]||(t[o]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function R(e,t,n){const r=Ve(t);!r||n===""||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=n)}function Qt(e,t,n){const r=ue(t).map(Ve).filter(Boolean);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const i=r[s];if(o[i]===void 0&&(o[i]={}),!o[i]||typeof o[i]!="object"||Array.isArray(o[i]))return;o=o[i]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function en(e,t=null){if(!t||typeof t!="object")return;const n=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(n).forEach(([r,o])=>{const a=D(o);a!==""&&R(e,r,a)})}function tn({fields:e=[],tokenValues:t={},environment:n={},profile:r=null}={}){const o={env:n,raw:t,byToken:{},byKey:{},byLabel:{}};return Object.entries(t||{}).forEach(([a,s])=>{const i=D(s);i!==""&&(o.byToken[a]=i,R(o,a,i),R(o,a.replace(/[{}]/g,""),i))}),en(o,r),e.forEach(a=>{const s=D(a.value);s!==""&&(a.token&&(o.byToken[a.token]=s),a.key&&(o.byKey[a.key]=s,Qt(o,a.key,s)),o.byLabel[a.label]=s,[a.label,a.token,a.key,...a.aliases||[]].forEach(i=>{R(o,i,s)}))}),je(o,e),o}function Xn({tool:e={},values:t={},tokens:n=[],client:r=null,clientInfo:o=[],clientSummary:a=[],profile:s=null}={}){const i=t&&typeof t=="object"?t:{},u=s&&typeof s=="object"?s:null,f=u!=null&&u.tokenValues&&typeof u.tokenValues=="object"?u.tokenValues:{},l={...i,...f},c=Array.isArray(o)?o:[],d=Array.isArray(a)?a:[],p=Kt(n,l),b=Pt({tokens:p,clientInfo:c,clientSummary:d,profile:u}),I=new Date().toISOString(),w={apiVersion:K,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:I};return{apiVersion:K,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:u||null,values:Jt(l,b),tokenValues:l,tokens:p,fields:b,fieldIndex:Wt(b),variables:tn({fields:b,tokenValues:l,environment:w,profile:u}),environment:w,client:r&&typeof r=="object"?r:null,clientInfo:c,clientSummary:d,generatedAt:I}}function Zn({title:e="",prompt:t=""}={}){const n=String(e||"").trim()||"Custom tool",r=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.

Return one complete HTML file, and nothing else.
- Put all HTML, CSS and JavaScript in that single file.
- Prefer attaching the result as a downloadable .html file when the chat interface supports files.
- If you cannot attach a file, return exactly one fenced code block containing the full HTML document from <!doctype html> to </html>.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not include explanations before or after the file.
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Module API reference:
${Vt()}

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
${r}`}const Fe="salt-templater-alo-autofill",nn=1,$=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function v(e){return e==null?"":String(e).trim()}function T(e){for(const t of e){const n=v(t);if(n)return n}return""}function rn(e){const t=v(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:v(e)}function Z(e){const t=v(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const r=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(r)return`${r[3]}-${r[2]}-${r[1]}`;const o=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return o?`${o[3]}-${o[1].padStart(2,"0")}-${o[2].padStart(2,"0")}`:t}function U(e){const t=Z(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function on(e={}){var t,n,r,o,a,s,i;return T([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activation_date,(o=e==null?void 0:e.client)==null?void 0:o.activation,(a=e==null?void 0:e.client)==null?void 0:a.dateActivation,(s=e==null?void 0:e.contact)==null?void 0:s.activationDate,(i=e==null?void 0:e.healthcheck)==null?void 0:i.activationDate])}function an(e={}){const t=[e.SignalStatus,e.LedStatus,e.treatmentStep,e.comment].join(" ").toLowerCase();return/(low|bad|rx|tx|performance)/i.test(t)?"lowBadRxTx":"noSignal"}function sn(e={}){const t=v(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function $e(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",r=t==="lowBadRxTx"?"Bad signal":"No signal",o=U(n==="never"?e.activationDate:e.disconnectionDate);return[r,n==="never"?"Never activated":"Signal lost",o].filter(Boolean).join(" - ")}function Wn(e={},t={}){var l,c,d,p;const n=T([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(c=e==null?void 0:e.client)==null?void 0:c.externalId,(d=e==null?void 0:e.superOffice)==null?void 0:d.externalTicketId]),r=q(n),o=r.ok?r.fields:{},a=an(o),s=sn(o),i=Z(on(e)),u=Z(T([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt])),f=T([t==null?void 0:t.sourceTicketId,t==null?void 0:t.ticketId,(p=t==null?void 0:t.tokenValues)==null?void 0:p[V],o.soTicket]);return{externalId:n,externalFields:o,aloType:a,signalState:s,extRef:f,disconnectionDate:s==="lost"?u:"",activationDate:i,description:$e({aloType:a,signalState:s,disconnectionDate:u,activationDate:i})}}function ze(e={}){return{firstName:v(e.firstName),lastName:v(e.lastName),email:v(e.email),phoneNumber:T([e.phoneNumber,e.phone])}}function Be(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:T([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[V],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:v(e==null?void 0:e.externalTicketId),tokenValues:t}}function ln(e={},t={},n={},r={}){const o=(e==null?void 0:e.client)||{},a=(e==null?void 0:e.contact)||{},s=(e==null?void 0:e.healthcheck)||{},i=ze(t),u=Be(n),f=T([a.fixedNumber,a.voipNumber,a.voip,a.sip,o.fixedNumber,o.fixedPhone]),l=rn(T([o.mobile,o.mobileRaw,o.phone,o.telephone,a.mobile,a.phone])),c=T([r.description,r.aloType==="lowBadRxTx"?"Bad signal":"",$.problemDescription]),d=T([r.notes,r.signalState?$e(r):"",$.problemNotes]),p=r.signalState==="never"?U(r.activationDate):U(r.disconnectionDate);return{externalReference:T([r.extRef,u.ticketId]),socketId:T([s.otoId,s.oto_id,s.oto]),plugNr:T([s.otoPortId,s.otoPort,s.oto_port]),breakoutCable:T([s.breakoutCableId,s.breakoutCable,s.cable]),breakoutFiber:T([s.fiberNumber,s.fiber,s.fibre]),firstName:T([o.firstName,o.firstname,o.givenName]),lastName:T([o.lastName,o.lastname,o.surname,o.familyName]),contactPhone1:T([f,l]),contactPhone2:f&&l&&f!==l?l:"",contactEmail:T([o.email,o.mail,a.email,a.mail]),ispFirstName:i.firstName,ispLastName:i.lastName,ispPhone:i.phoneNumber,ispEmail:i.email,...$,problemDescription:c,problemNotes:d,problemDateTime:p,problemCode3:r.aloType==="lowBadRxTx"?"Performance problem":$.problemCode3}}function cn(e={},t={},n={},r={}){const o=ln(e,t,n,r),a=ze(t),s=Be(n);return{source:Fe,version:nn,fields:o,alo:{type:r.aloType||"noSignal",signalState:r.signalState||"",disconnectionDate:r.disconnectionDate||"",activationDate:r.activationDate||"",problemDateTime:o.problemDateTime,notes:r.notes||""},client:{firstName:o.firstName,lastName:o.lastName,contactPhone1:o.contactPhone1,contactPhone2:o.contactPhone2,email:o.contactEmail},technical:{socketId:o.socketId,plugNr:o.plugNr,breakoutCable:o.breakoutCable,breakoutFiber:o.breakoutFiber},agent:a,superOffice:s}}function Qn(e={},t={},n={},r={}){return JSON.stringify(cn(e,t,n,r),null,2)}function un(e){function t(l){return l==null?"":String(l).trim()}function n(l){for(var c=0;c<l.length;c+=1){var d=t(l[c]);if(d)return d}return""}function r(l){return t(l).replace(/[&<>"']/g,function(d){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[d]})}function o(l,c,d){var p=document.getElementById("saltAloFillOverlay");p&&p.remove();var b=document.createElement("div");b.id="saltAloFillOverlay",b.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(d==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",b.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+r(l)+"</strong><span style='color:#d8d8df'>"+r(c)+"</span>",document.body.appendChild(b),d!=="error"&&setTimeout(function(){try{b.remove()}catch{}},4500)}function a(l,c,d){var p=l&&l.fields||{};return n([p[c]].concat(d||[]))}function s(l,c){var d=String(c).replace(/["\\]/g,"\\$&");return document.querySelector("["+l+'="'+d+'"]')}function i(l){return document.getElementById(l)||s("name",l)||s("formcontrolname",l)||s("data-testid",l)}function u(l,c,d){var p=d?String(c??""):t(c);if(!d&&!p)return!1;var b=i(l);if(!b)return!1;if(b.tagName==="SELECT")for(var I=t(p).toLowerCase(),w=0;w<b.options.length;w+=1){var h=b.options[w];if(t(h.value).toLowerCase()===I||t(h.textContent).toLowerCase()===I){b.value=h.value;break}}else"value"in b?b.value=p:b.textContent=p;return b.dispatchEvent(new Event("input",{bubbles:!0})),b.dispatchEvent(new Event("change",{bubbles:!0})),!0}function f(l){if(!l||typeof l!="object"||Array.isArray(l)){o("ALO fill","ALO fill data invalid.","error");return}if(l.source&&l.source!==e){o("ALO fill","Clipboard does not contain ALO fill data from Salt Templater.","error");return}var c=l.client||{},d=l.technical||l.healthcheck||{},p=l.agent||{},b=l.superOffice||{},I=b.tokenValues||l.tokenValues||{},w=0;function h(Ge,Xe,Ze){u(Ge,Xe,Ze)&&(w+=1)}if(h("ticket.extRef",a(l,"externalReference",[b.sourceTicketId,b.ticketId,l.ticketId,I["{so_ticket_num}"]])),h("ticket.socketId",a(l,"socketId",[d.socketId,d.otoId,d.oto_id,d.oto])),h("ticket.plugNr",a(l,"plugNr",[d.plugNr,d.otoPortId,d.otoPort,d.oto_port])),h("ticket.breakoutCable",a(l,"breakoutCable",[d.breakoutCable,d.breakoutCableId,d.cable])),h("ticket.breakoutFiber",a(l,"breakoutFiber",[d.breakoutFiber,d.fiberNumber,d.fiber,d.fibre])),h("ticket.otoAddress.firstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),h("ticket.otoAddress.lastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),h("ticket.contactPersonFirstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),h("ticket.contactPersonLastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),h("ticket.contactPersonPhone1",a(l,"contactPhone1",[c.contactPhone1,c.fixedNumber,c.mobileRaw,c.mobile,c.phone])),h("ticket.contactPersonPhone2",a(l,"contactPhone2",[c.contactPhone2])),h("ticket.contactPersonMail",a(l,"contactEmail",[c.email,c.mail])),h("ticket.contactPersonIspFirstName",a(l,"ispFirstName",[p.firstName])),h("ticket.contactPersonIspLastName",a(l,"ispLastName",[p.lastName])),h("ticket.contactPersonIspPhone",a(l,"ispPhone",[p.phoneNumber,p.phone])),h("ticket.contactPersonIspMail",a(l,"ispEmail",[p.email])),h("ticket.problemDescription",a(l,"problemDescription",["No signal"])),h("ticket.problemNotes",a(l,"problemNotes",[""]),!0),h("ticket.problemDateTime",a(l,"problemDateTime",[l.alo&&l.alo.problemDateTime])),h("ticket.problemCode1",a(l,"problemCode1",["400"])),h("ticket.problemCode2",a(l,"problemCode2",["800"])),h("ticket.problemCode3",a(l,"problemCode3",["900"])),!w){o("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}o("ALO fill","Fields populated: "+w,"success")}if(o("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){o("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(c){if(!t(c)){o("ALO fill","Clipboard empty. Click ALO fill in Salt Templater first.","error");return}var d;try{d=JSON.parse(c)}catch{o("ALO fill","Clipboard does not contain valid ALO data.","error");return}f(d)}).catch(function(c){o("ALO fill","Clipboard error: "+(c&&c.message?c.message:c),"error")})}function er(){const e=JSON.stringify(Fe);return`javascript:(${un.toString()})(${e});`}const dn=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),mn=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function z(e,t){return!!(e!=null&&e[t])}function fn(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Re(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function bn(e,t){return z(e,"ctrlKey")===!!t.ctrlKey&&z(e,"altKey")===!!t.altKey&&z(e,"shiftKey")===!!t.shiftKey&&z(e,"metaKey")===!!t.metaKey}function pn(e,t){return bn(e,t)&&(fn(e==null?void 0:e.key,t.key)||Re(e==null?void 0:e.code,t.code))}function tr(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function hn(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(mn))}function gn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||hn(e==null?void 0:e.target))}function nr(e){if(gn(e))return null;const t=dn.find(n=>pn(e,n))||null;return!t||e!=null&&e.isComposing&&!Re(e==null?void 0:e.code,t.code)?null:t}const Tn="case-profile-beta-1",Me=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),de=Object.freeze(Object.fromEntries(Me)),Ke=Object.freeze(Me.map(([e])=>e)),xn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),W=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),Ue=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function x(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function k(...e){for(const t of e){const n=x(t);if(n!=="")return n}return""}function A(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function kn(e=""){const t=A(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function me(e=""){const t=kn(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function xe(e=""){const t=A(e);return t?`{${t}}`:""}function C(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function yn(){const e={};return Ke.forEach(t=>{e[t]=""}),{version:Tn,fields:e,fieldLabels:{...de},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function qe(e){return x(e)!==""}function y(e,t,n,{overwrite:r=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const o=x(n);return o===""||!r&&qe(e.fields[t])?!1:(e.fields[t]=o,e[t]=o,!0)}function fe(e,t,n,{overwrite:r=!1,label:o=""}={}){const a=me(t),s=x(n);return!a||s===""||Ue.has(a)||!r&&Object.prototype.hasOwnProperty.call(e.dynamic,a)?!1:(e.dynamic[a]=s,o&&!e.fieldLabels[a]&&(e.fieldLabels[a]=o),!0)}function In(e,t,n,r={}){const o=A(P(t)||t),a=W[o]||W[A(t)]||me(t);return Object.prototype.hasOwnProperty.call(e.fields,a)?y(e,a,n,r):fe(e,t,n,r)}function wn(e,t={},n={}){Object.entries(t).forEach(([r,o])=>y(e,r,o,n))}function Q(e,t=[],n=[]){return Array.isArray(e)?(e.forEach((r,o)=>{t.push(String(o+1)),Q(r,t,n),t.pop()}),n):e&&typeof e=="object"?(Object.keys(e).forEach(r=>{t.push(r),Q(e[r],t,n),t.pop()}),n):(n.push({path:t.slice(),value:x(e)}),n)}function Nn(e=[]){return e[0]===ne||e[0]===re}function Pe(e,t,{prefix:n="",skipInternalClientKeys:r=!1}={}){!t||typeof t!="object"||Q(t).filter(o=>o.value!=="").filter(o=>!r||!Nn(o.path)).forEach(o=>{const a=n?[n,...o.path]:o.path;fe(e,a.join("_"),o.value,{label:a.map(C).join(" ")})})}function ke(e=[],t=[]){const n=new Map;return[...e,...t].forEach(r=>{if(!r||typeof r!="object")return;const o=`${x(r.url)}|${x(r.name)}|${x(r.id)}`;o.replace(/\|/g,"")&&(n.has(o)||n.set(o,r))}),Array.from(n.values())}function be(e){const t=x(e);if(!t)return null;const n=q(t);return n.ok?{externalId:t,fields:n.fields}:null}function Ye(e,t){var n,r,o,a;t&&(y(e,"externalId",t.externalId),Object.entries(xn).forEach(([s,i])=>{var u;y(e,i,(u=t.fields)==null?void 0:u[s])}),y(e,"contractorNumber",(n=t.fields)==null?void 0:n.customer),y(e,"lexId",(r=t.fields)==null?void 0:r.lexId),y(e,"oltName",(o=t.fields)==null?void 0:o.oltName),y(e,"oltBoard",(a=t.fields)==null?void 0:a.oltBoard))}function vn(e,t){var i;if(!t||typeof t!="object")return;const n=t.client||{},r=t.contact||{},o=t.healthcheck||{},a=o.crossConnexion||o.crossConnection||{},s=[n.firstName,n.lastName].map(x).filter(Boolean).join(" ");wn(e,{clientName:s||k(n.fullName,n.name,n.customerName),title:n.title,firstName:n.firstName,lastName:n.lastName,contractorNumber:k(n.contractorNumber,n.contractor,o.customerId),mobile:k(n.mobile,n.phone,n.telephone),mobileRaw:n.mobileRaw,phone:k(n.phone,n.telephone,r.fixedNumber),email:n.email,address:n.address,communicationLanguage:k(n.communicationLanguage,r.communicationLanguage,n.language,r.language),activationDate:k(n.activationDate,n.activation_date,n.activation,n.dateActivation,(i=t.offer)==null?void 0:i.activationDate,r.activationDate,o.activationDate),eligibilitySource:k(n.eligibilitySource,r.eligibilitySource),contactRecordId:k(n.contactRecordId,r.contactRecordId),fixedNumber:r.fixedNumber,publicId:r.publicId,fllRecordId:o.fllRecordId,otoId:k(o.otoId,o.oto_id,o.oto),otoPortId:k(o.otoPortId,o.otoPort,o.oto_port,a.Port),routerSerialNumber:o.routerSerialNumber,oldRouterSerialNumber:o.oldRouterSerialNumber,lexId:o.lexId,oltName:o.oltName,oltBoard:o.oltBoard,ponPort:o.ponPort,breakoutCableId:o.breakoutCableId,fiberNumber:o.fiberNumber,lineState:o.lineState,routerStatus:o.routerStatus,odfId:o.odfId,option82:o.option82,oltObject:o.oltObject,ontConfigurationFilename:o.ontConfigurationFilename,svlan:o.svlan,customerId:o.customerId,crossConnectionEquipment:a.Equipment,crossConnectionRack:a.Rack,crossConnectionSlot:a.Slot,crossConnectionPort:a.Port}),Ye(e,be(t[re])),Pe(e,t,{skipInternalClientKeys:!0})}function Sn(e,t){var o;if(!t||typeof t!="object")return;y(e,"soTicketNum",k(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(o=t.tokenValues)==null?void 0:o[V])),y(e,"ticketCreatedAt",k(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),Ye(e,be(t.externalTicketId)),He(e,t.tokenValues);const n=Y(t.attachments),r=j(n);e.attachments=ke(e.attachments,n),e.photos=ke(e.photos,r),Pe(e,t,{prefix:"ticket"})}function He(e,t={},n={}){!t||typeof t!="object"||Object.entries(t).forEach(([r,o])=>{const a=x(o);if(a==="")return;const s=P(r),i=Qe(s)||A(r),u=W[i];u&&y(e,u,a,n),i==="external_customer"&&y(e,"contractorNumber",a,n),i==="external_lex_id"&&y(e,"lexId",a,n),i==="external_olt_name"&&y(e,"oltName",a,n),i==="external_olt_board"&&y(e,"oltBoard",a,n),fe(e,i,a,{...n,label:C(i)})})}function _n(e,t){const n=t==null?void 0:t[ne];!n||typeof n!="object"||Array.isArray(n)||Object.entries(n).forEach(([r,o])=>{In(e,r,o,{overwrite:!0,label:C(r)})})}function ye(e,t,n){const r=me(t),o=x(n);!r||o===""||Ue.has(r)||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=o)}function An(e,t={}){const n={},r={},o=[];Ke.forEach(i=>{const u=x(e.fields[i]);if(u==="")return;ye(n,i,u);const f=xe(i);f&&(r[f]=u),o.push({key:i,label:de[i]||C(i),value:u})}),Object.entries(e.dynamic).forEach(([i,u])=>{const f=x(u);if(f==="")return;ye(n,i,f);const l=xe(i);l&&!Object.prototype.hasOwnProperty.call(r,l)&&(r[l]=f),e.fields[i]||o.push({key:i,label:e.fieldLabels[i]||C(i),value:f})});const a=be(e.externalId);a&&Object.assign(r,ee(a.fields)),qe(e.soTicketNum)&&(r[V]=e.soTicketNum);const s={};return Object.entries(t||{}).forEach(([i,u])=>{const f=P(i)||i;s[f]=u}),e.vars=n,e.variables=n,e.tokenValues={...s,...r},e.availableFields=o,e}function rr({clientPayload:e=null,superOfficePayload:t=null,tokenValues:n={}}={}){const r=yn();return vn(r,e),Sn(r,t),He(r,n),_n(r,e),An(r,n)}function m(e,t,n=""){var o;const r=x((e==null?void 0:e[t])??((o=e==null?void 0:e.fields)==null?void 0:o[t]));return r?{label:n||de[t]||C(t),value:r}:null}function S(e,t){const n=x(t);return n?{label:e,value:n}:null}function Je(e=[]){const t=new Set;return e.filter(Boolean).filter(n=>{const r=`${A(n.label)}:${n.value}`;return t.has(r)?!1:(t.add(r),!0)})}function B(e,t,n=[]){const r=Je(n);return r.length>0?{id:e,title:t,fields:r}:null}function or(e=null){return!e||typeof e!="object"?[]:Je([S("Name",e.clientName),S("Mobile",k(e.mobile,e.mobileRaw,e.phone)),S("Contractor",k(e.contractorNumber,e.externalCustomer,e.customerId)),S("Activation",e.activationDate),S("OTO ID",e.otoId),S("Port",k(e.otoPortId,e.crossConnectionPort)),S("SO ticket",e.soTicketNum)])}function ar(e=null){return!e||typeof e!="object"?[]:[B("caseClient","Client",[m(e,"clientName","Full name"),m(e,"contractorNumber","Contractor"),m(e,"title"),m(e,"firstName"),m(e,"lastName"),m(e,"mobile"),m(e,"mobileRaw","Mobile raw"),m(e,"phone"),m(e,"email"),m(e,"address"),m(e,"communicationLanguage","Language"),m(e,"activationDate","Activation date")]),B("caseSuperOffice","SuperOffice",[m(e,"soTicketNum","SO ticket"),m(e,"ticketCreatedAt","Created at"),m(e,"externalId","External ID"),m(e,"externalPartner","Partner"),m(e,"externalPartnerTicketNumber","Partner ticket")]),B("caseExternalId","External ID fields",[m(e,"externalFlagging","Flagging"),m(e,"externalDate","Date"),m(e,"externalCustomer","Contractor"),m(e,"externalSignalStatus","Signal"),m(e,"externalLedStatus","LED"),m(e,"externalTreatmentStep","Treatment"),m(e,"externalBoxType","Box"),m(e,"externalLexId","LEX ID"),m(e,"externalOltName","OLT"),m(e,"externalOltBoard","Board"),m(e,"externalBokBof","BOK/BOF"),m(e,"externalComment","Comment")]),B("caseTechnical","Technical",[m(e,"fllRecordId","FLL record"),m(e,"otoId","OTO ID"),m(e,"otoPortId","OTO port"),m(e,"routerSerialNumber","Router serial"),m(e,"oldRouterSerialNumber","Old router serial"),m(e,"lexId","LEX ID"),m(e,"oltName","OLT"),m(e,"oltBoard","OLT board"),m(e,"ponPort","PON port"),m(e,"breakoutCableId","Breakout cable"),m(e,"fiberNumber","Fiber number"),m(e,"lineState","Line state"),m(e,"routerStatus","Router status"),m(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{$e as A,er as B,Vn as C,Yn as D,jn as E,Ee as F,Ce as G,_t as H,tr as I,Zn as J,dn as K,Ct as L,Fn as P,wt as S,_ as T,_e as a,Un as b,qn as c,Pn as d,Dt as e,Gn as f,se as g,Xn as h,Jn as i,j,$n as k,Bn as l,Dn as m,On as n,rr as o,zn as p,ar as q,Hn as r,Mn as s,or as t,St as u,Rn as v,Wn as w,Qn as x,Kn as y,nr as z};
