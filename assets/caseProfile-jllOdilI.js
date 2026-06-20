import{c as j}from"./createLucideIcon-Dx08w7rC.js";import{p as J,b as re,S as F,L as H,H as Ae,o as oe,w as dt,F as Ce,T as _e,W as ae,X as ie,Y as mt}from"./tokenService-DE0qwuQh.js";import{l as ft,a as pt}from"./index-BYBfN0C2.js";import{l as z,s as se,d as bt}from"./templateTreeService-CQkg_Mzh.js";import{f as Ee,u as Le}from"./templateTreeOperations-BkfXWuea.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],ar=j("chevron-left",ht);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],ir=j("chevron-right",gt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],sr=j("clipboard-copy",Tt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],lr=j("external-link",kt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],cr=j("puzzle",xt),yt=/\.(jpe?g|png|webp|gif|bmp|avif)(?:$|[?#])/i,It=/\.pdf(?:$|[?#])/i,wt=["{contractor}","{contractor_number}","{client_contractor_number}"];function g(...e){for(const t of e){const n=String(t??"").trim();if(n)return n}return""}function Nt(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function vt(e="",t=""){const n=`${e} ${t}`;return yt.test(n)?"image":It.test(n)?"pdf":"file"}function St(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function At(e={}){var t,n,r;return g(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(n=e.message)==null?void 0:n.createdAt,(r=e.message)==null?void 0:r.sentAt)||null}function D(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function Ct(e,t){var i,u,m,l,c;if(!e||typeof e!="object"||Array.isArray(e))return null;const n=g(e.url,e.href,e.src,e.downloadUrl);if(!n)return null;const r=g(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((i=String(n).split("/").pop())==null?void 0:i.split("?")[0])||""))||`Attachment ${t+1}`,o=g(e.type,e.contentType,e.mimeType),a=St(o)?"image":vt(r,n),s=g(e.messageId,e.messageID,e.postId,(u=e.message)==null?void 0:u.id)||null;return{id:g(e.id,e.attachmentId,e.documentId)||`${t}-${r}-${n}`,name:r,url:n,type:a,size:g(e.size,e.sizeText,e.fileSize)||null,messageId:s,postId:g(e.postId,s)||null,messageIndex:D(g(e.messageIndex,e.messageOrder,e.postIndex,(m=e.message)==null?void 0:m.index)),attachmentIndex:D(g(e.attachmentIndex,e.fileIndex)),messageAuthor:g(e.messageAuthor,e.author,e.createdBy,(l=e.message)==null?void 0:l.author,(c=e.message)==null?void 0:c.createdBy)||null,source:g(e.source,e.origin)||null,date:At(e)}}function xe(e){return String(e).padStart(2,"0")}function _t(e){const t=e.getFullYear(),n=xe(e.getMonth()+1),r=xe(e.getDate());return{dateKey:`${t}-${n}-${r}`,label:`${r}.${n}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function ye(e,t,n,r=0,o=0,a=0){if(t<0||t>11||n<1||n>31||r<0||r>23||o<0||o>59||a<0||a>59)return null;const s=new Date(e,t,n,r,o,a);return s.getFullYear()!==e||s.getMonth()!==t||s.getDate()!==n?null:s}function Et(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const a=new Date(e);return Number.isNaN(a.getTime())?null:a}const t=String(e).trim();if(!t)return null;const n=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const a=ye(Number(n[1]),Number(n[2])-1,Number(n[3]),Number(n[4]||0),Number(n[5]||0),Number(n[6]||0));if(a)return a}const r=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(r){const a=Number(r[1]),s=r[2],i=Number(r[3]),u=Number(r[4]),m=u<100?2e3+u:u,l=Number(r[5]||0),c=Number(r[6]||0),d=Number(r[7]||0),p=s==="/"&&i>12&&a<=12,b=p?i:a,k=(p?a:i)-1,y=ye(m,k,b,l,c,d);if(y)return y}const o=new Date(t);return Number.isNaN(o.getTime())?null:o}function le(e={}){const t=Et(e.date);return t?_t(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function Lt(e,t){const n=g(t);n&&wt.forEach(r=>{e[r]=n})}function Ie(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function Dt(e,t,n){const r=H(t),o=g(n);!r||!o||e.push([r,o])}function De(e,t=[]){const n=[];return Ie(e)&&Object.entries(e).forEach(([r,o])=>{if(Ie(o)){n.push(...De(o,[...t,r]));return}Dt(n,[...t,r].join("."),o)}),n}function Ot(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(n=>{De(e[n]).forEach(([r,o])=>{t[r]=o})}),t}function G(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(Ct).filter(Boolean).filter(n=>{const r=`${n.name}|${n.url}`;return t.has(r)?!1:(t.add(r),!0)})}function $(e=[]){return G(e).filter(t=>t.type==="image")}function Vt(e=[]){const t=new Map;return $(e).forEach((n,r)=>{const o=le(n);t.has(o.dateKey)||t.set(o.dateKey,{...o,attachments:[]}),t.get(o.dateKey).attachments.push({...n,galleryIndex:r})}),Array.from(t.values()).sort((n,r)=>r.sortValue-n.sortValue)}function we(e={}){var t;return g(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function jt(e={},t=0){const n=D(e.messageNumber),r=D(e.messageIndex);return`Post ${n||(r===null?t+1:r+1)}`}function Ft(e={}){const t=le(e),n=g(e.messageAuthor);return t.dateKey==="unknown"?n:[t.label,n].filter(Boolean).join(" · ")}function ur(e=[]){const t=$(e);if(!t.some(r=>we(r)))return Vt(t);const n=new Map;return t.forEach((r,o)=>{const a=we(r),s=le(r),i=a||`unassigned:${s.dateKey}`;if(!n.has(i)){const u=n.size;n.set(i,{dateKey:i,label:a?jt(r,u):s.label,metaLabel:a?Ft(r):"",sortValue:D(r.messageIndex)??o,attachments:[]})}n.get(i).attachments.push({...r,galleryIndex:o})}),Array.from(n.values()).sort((r,o)=>r.sortValue-o.sortValue)}function dr(e){var p,b;const t=Nt(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const n=g(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),r=g(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),o=g(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),a=g(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(p=t.client)==null?void 0:p.contractorNumber,(b=t.client)==null?void 0:b.contractor),s={};let i=null,u=!1;const m=G(t.attachments),l=$(m);if(o){const k=J(o);k.ok&&(u=!0,i=k.fields,Object.assign(s,re(k.fields)))}Object.assign(s,Ot(t));const c=(i==null?void 0:i.customer)||a;c&&(u||n||m.length>0)&&Lt(s,c);const d=n||(i==null?void 0:i.soTicket)||"";return d&&(s[F]=d),Object.keys(s).length===0&&m.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:u,externalTicketId:o}:{ok:!0,ticketId:d,sourceTicketId:n,createdAt:r,externalTicketId:o,contractorNumber:c,externalIdValid:u,externalFields:i,tokenValues:s,attachments:m,imageAttachments:l,ignoredExternalId:!!(o&&!u)}}const ce="super_office_ticket_payload",ue="pending_super_office_ticket_payload",zt="super-office-ticket-updated";function $t(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[ae]:t,[ie]:n,...r}=e;return r}function W(e){return Array.isArray(e)?`[${e.map(W).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${W(e[t])}`).join(",")}}`:JSON.stringify(e)}function de(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return W($t(e))}catch{return""}}function O(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(zt,{detail:{payload:e}}))}function X(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=G(e.attachments),n=String(e.clientSignature||"").trim(),r=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([o,a])=>[o,a==null?"":String(a)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:n,tokenValues:r,attachments:t,imageAttachments:$(t)}}function Mt(e,t=new Date,n=""){return X({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:n,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function me(e){e&&await _e(ce,e)}async function Oe(e){e&&await _e(ue,e)}async function Z(){try{return X(await Ae(ue,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function mr(){return Z()}async function Bt(){return await Ve()||await Z()}async function fr(){return!!await Bt()}function fe(){return Ce(ue)}async function pr(e){const t=await oe(),n=Mt(e,new Date,de(t));return n?n.clientSignature?(await me(n),await fe(),O(n),n):(await q(),await Oe(n),O(null),n):null}async function br(e){const t=dt(e);if(!t)return null;const n=await Ve(),r=n?null:await Z(),o=n||r;if(!o)return null;const a=J(t),s=a.ok?{...o.tokenValues||{},...re(a.fields)}:o.tokenValues||{},i=X({...o,externalTicketId:t,tokenValues:s});return i?(i.clientSignature?await me(i):await Oe(i),O(i),i):null}function q(){return Ce(ce)}async function hr(){const e=await Z(),t=de(await oe());if(!e||!t)return null;const n={...e,clientSignature:t};return await me(n),await fe(),O(n),n}async function Ve(){try{const e=await Ae(ce,null);if(!e)return null;const t=de(await oe());if(!t)return await q(),null;if((e==null?void 0:e.clientSignature)!==t)return await q(),null;const n=X(e);return n||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function gr(){await q(),await fe(),O(null)}const je="quick_tools",Rt="blue",A=Object.freeze({LINK:"link",MODULE:"module"}),Ut=A.LINK,Kt=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],qt=new Set(Kt.map(e=>e.value)),Pt=new Set(Object.values(A));function Yt(e){return qt.has(e)?e:Rt}function Fe(e){return Pt.has(e)?e:Ut}function Jt(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function ze(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?A.MODULE:A.LINK),n=Fe(t);return{...e,type:n,title:String(e.title||"").trim(),url:n===A.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:Yt(e.color),order:Jt(e.order),beta:n===A.MODULE?!0:!!e.beta}}async function Tr(){const e=await ft(je,[]);return Array.isArray(e)?e.map(ze).filter(Boolean):[]}async function kr(e){const t=Array.isArray(e)?e.map(ze).filter(Boolean):[];return pt(je,t)}function xr(e,t={}){return(e||"").replace(/\{[^}]+\}/g,n=>{const r=t[n];if(r==null||r==="")return n;const o=String(r).replace(/<[^>]+>/g,"").trim();return encodeURIComponent(o)})}function yr(e){return Fe(e==null?void 0:e.type)===A.MODULE}const Ht=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function pe(e){return e==null?e:JSON.parse(JSON.stringify(e))}function L(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function C(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function $e(e=[]){return new Map(e.map(t=>[t.id,t]))}function Me(e,t){if(!e)return"";const n=[],r=new Set;let o=e;for(;o&&!r.has(o.id);)r.add(o.id),n.unshift(o.title||o.id),o=o.parentId?t.get(o.parentId):null;return n.join(" / ")}function Gt(e=[]){const t=$e(e);return e.map(n=>({...n,path:Me(n,t)}))}function Be(e=[],t){const n=String(t||"").trim();if(!n)return null;const r=$e(e);if(r.has(n))return r.get(n);const o=C(n);return e.find(a=>C(a.title)===o||C(Me(a,r))===o)||null}function Xt(e=[],t={}){return Be(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function Zt(e=[],t={}){return Be(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function Wt(e,t={},n=null){const r=L(t.templateIds||t.templateId).map(String).filter(Boolean);if(r.length>0&&!r.includes(e.id)||n&&!(e.nodeIds||[]).includes(n.id))return!1;const o=L(t.channels||t.channel).map(i=>String(i||"").trim()).filter(Boolean);if(o.length>0&&!o.some(i=>(e.channels||[]).includes(i)))return!1;const a=String(t.title||t.templateTitle||"").trim();if(a&&C(e.title)!==C(a))return!1;const s=L(t.titleIncludes||t.templateTitleIncludes).map(C).filter(Boolean);if(s.length>0){const i=C(e.title);if(!s.some(u=>i.includes(u)))return!1}return!0}function Qt({template:e,sourceNode:t,targetNode:n,reason:r=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:n.id,targetNodeTitle:n.title||"",reason:r}}function Re({nodes:e=[],templates:t=[]}={}){return{nodes:Gt(e),templates:pe(t),counts:{nodes:e.length,templates:t.length}}}function Ue(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([n,r])=>{Ht.has(n)&&(t[n]=r)}),t}async function Ke(){return Re(await z())}async function en(){return Ke()}async function tn(e=[]){const t=L(e),{nodes:n,templates:r}=await z(),o=[],a=[];return t.forEach((s,i)=>{if(!s||typeof s!="object"||Array.isArray(s)){a.push({ruleIndex:i,reason:"Rule must be an object."});return}const u=Zt(n,s);if(!u){a.push({ruleIndex:i,reason:"Target topic was not found."});return}const m=Xt(n,s),l=r.filter(c=>Wt(c,s,m));if(l.length===0){a.push({ruleIndex:i,reason:"No templates matched this rule."});return}l.forEach(c=>{(c.nodeIds||[])[0]===u.id&&(!m||m.id===u.id)||o.push(Qt({template:c,sourceNode:m,targetNode:u,reason:s.reason||`Rule ${i+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:o.length,affectedTemplateCount:new Set(o.map(s=>s.templateId)).size,operations:o,skipped:a}}async function nn(e=[]){const t=L(e),n=await z();let r=n.nodes,o=n.templates;const a=[],s=[];return t.forEach((i,u)=>{var l;const m=(i==null?void 0:i.action)||(i==null?void 0:i.type);if(!i||typeof i!="object"||Array.isArray(i)){s.push({operationIndex:u,reason:"Operation must be an object."});return}if(m==="moveTemplate"){const c=String(i.templateId||""),d=String(i.targetNodeId||i.toNodeId||"");if(!c||!d){s.push({operationIndex:u,reason:"moveTemplate requires templateId and targetNodeId."});return}const p=o.find(y=>y.id===c),b=i.sourceNodeId||((l=p==null?void 0:p.nodeIds)==null?void 0:l[0])||null,k=JSON.stringify(o);o=Ee(o,c,b,d,Number(i.targetIndex),r),JSON.stringify(o)!==k&&a.push({operationIndex:u,action:m,templateId:c,targetNodeId:d});return}if(m==="updateTemplate"){const c=String(i.templateId||"");if(!c){s.push({operationIndex:u,reason:"updateTemplate requires templateId."});return}const d=Ue(i.patch||i.fields||{}),p=JSON.stringify(o);o=Le(o,c,d),JSON.stringify(o)!==p&&a.push({operationIndex:u,action:m,templateId:c});return}s.push({operationIndex:u,reason:`Unsupported operation: ${m||"unknown"}.`})}),a.length>0&&await se({nodes:r,templates:o}),{ok:!0,appliedCount:a.length,skippedCount:s.length,applied:a,skipped:s,tree:Re({nodes:r,templates:o})}}async function rn(e,t={}){const n=String(e||"");if(!n)throw new Error("templateId is required.");const r=await z();if(!r.templates.some(a=>a.id===n))throw new Error("Template was not found.");const o=Le(r.templates,n,Ue(t));return await se({nodes:r.nodes,templates:o}),{ok:!0,template:pe(o.find(a=>a.id===n))}}async function on(e,t,n={}){var m;const r=String(e||""),o=String(t||"");if(!r||!o)throw new Error("templateId and targetNodeId are required.");const a=await z();if(!a.templates.some(l=>l.id===r))throw new Error("Template was not found.");const s=a.templates.find(l=>l.id===r),i=(n==null?void 0:n.sourceNodeId)||((m=s==null?void 0:s.nodeIds)==null?void 0:m[0])||null,u=Ee(a.templates,r,i,o,Number(n==null?void 0:n.targetIndex),a.nodes);return await se({nodes:a.nodes,templates:u}),{ok:!0,template:pe(bt(u.find(l=>l.id===r)))}}async function Ir(e,t={}){switch(e){case"tool:templates:list":return Ke();case"tool:templates:get-tree":return en();case"tool:templates:preview-migration":return tn(t.rules||t);case"tool:templates:apply-migration":return nn(t.operations||t);case"tool:templates:update-template":return rn(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return on(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const P="template-tool-module-beta-1",qe=Object.freeze({name:"Template Generator Module API",version:P,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']"],reservedContainers:["env","raw","byToken","byKey","byLabel"]},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function an(e=qe){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,r])=>{t.push(`- window.${n}: ${r.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.join(`
`)}const sn=`
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
</style>`,ln=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${P}";
    var apiReference = ${JSON.stringify(qe)};
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
<\/script>`,cn=`<!doctype html>
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
</html>`;function un(e=""){var u;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),r=((u=n==null?void 0:n[1])==null?void 0:u.trim())||t,o=r.match(/<!doctype\s+html\b|<html[\s>]/i);if(!o)return r;const a=o.index||0,s=r.slice(a).trim(),i=s.match(/<\/html\s*>/i);return i?s.slice(0,i.index+i[0].length).trim():s}function dn(e=""){const t=un(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:cn}function mn(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function fn(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function wr(e=""){const t=dn(e),n=fn(t,ln,"template-tool-bridge");return mn(n,sn,"template-tool-host-style")}function pn(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const r=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:r??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function V(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function Q(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function Pe(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Ye(e=""){const t=Pe(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function Je(e=""){const t=Ye(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function be(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function M(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function N(e,t){const n=String(t||"").trim();if(!n)return;M(e,n);const r=Pe(n),o=Ye(n);r&&(M(e,r),M(e,`{${r}}`)),o&&M(e,o)}function bn({label:e="",token:t="",key:n="",aliases:r=[],section:o=""}={}){const a=[];N(a,e),N(a,t),N(a,t.replace(/[{}]/g,"")),N(a,n);const s=be(n);return s.length>0&&(N(a,s[s.length-1]),N(a,s.join(" ")),N(a,s.join(""))),N(a,o),r.forEach(i=>N(a,i)),a}function hn(e){const t=V(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=bn({...e,...n}),n}function gn({tokens:e=[],clientInfo:t=[],clientSummary:n=[],profile:r=null}={}){const o=[],a=new Set,s=i=>{const u=hn(i);if(!u)return;const m=`${u.source}:${u.label}:${u.value}:${u.token||""}:${u.key||""}`;a.has(m)||(a.add(m),o.push(u))};return e.forEach(i=>{s({label:i.label,value:i.value,token:i.token,key:i.key,aliases:i.aliases,source:"token"})}),n.forEach(i=>{s({label:i.label,value:i.value,section:"summary",source:"clientSummary"})}),t.forEach(i=>{((i==null?void 0:i.fields)||[]).forEach(u=>{s({label:u.label,value:u.value,section:i.title||i.id,source:"clientInfo"})})}),r&&typeof r=="object"&&(Array.isArray(r.availableFields)?r.availableFields:[]).forEach(i=>{s({label:i.label,value:i.value,key:i.key,aliases:i.aliases,source:"profile"})}),o}function Tn(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function kn(e,t,n){const r=be(t);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const i=r[s];if(!i||/^\d+$/.test(i)||(o[i]===void 0&&(o[i]={}),!o[i]||typeof o[i]!="object"||Array.isArray(o[i])))return;o=o[i]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function xn(e={},t=[]){const n={...e};return t.forEach(r=>{r.key&&kn(n,r.key,r.value),r.aliases.forEach(o=>Tn(n,o,r.value))}),He(n,t),n}const yn=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function In(e,t){const n=Q(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(r=>Q(r)===n)}function wn(e=[],t=[]){for(const n of t){const r=e.find(a=>In(a,n)),o=V(r==null?void 0:r.value);if(o!=="")return o}return""}function He(e,t=[]){yn.forEach(({name:n,candidates:r})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const o=wn(t,r);o!==""&&(e[n]=o)})}function Nn(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(r=>{const o=Q(r);!o||t[o]||(t[o]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function K(e,t,n){const r=Je(t);!r||n===""||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=n)}function vn(e,t,n){const r=be(t).map(Je).filter(Boolean);if(r.length<2||n==="")return;let o=e;for(let s=0;s<r.length-1;s+=1){const i=r[s];if(o[i]===void 0&&(o[i]={}),!o[i]||typeof o[i]!="object"||Array.isArray(o[i]))return;o=o[i]}const a=r[r.length-1];a&&!Object.prototype.hasOwnProperty.call(o,a)&&(o[a]=n)}function Sn(e,t=null){if(!t||typeof t!="object")return;const n=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(n).forEach(([r,o])=>{const a=V(o);a!==""&&K(e,r,a)})}function An({fields:e=[],tokenValues:t={},environment:n={},profile:r=null}={}){const o={env:n,raw:t,byToken:{},byKey:{},byLabel:{}};return Object.entries(t||{}).forEach(([a,s])=>{const i=V(s);i!==""&&(o.byToken[a]=i,K(o,a,i),K(o,a.replace(/[{}]/g,""),i))}),Sn(o,r),e.forEach(a=>{const s=V(a.value);s!==""&&(a.token&&(o.byToken[a.token]=s),a.key&&(o.byKey[a.key]=s,vn(o,a.key,s)),o.byLabel[a.label]=s,[a.label,a.token,a.key,...a.aliases||[]].forEach(i=>{K(o,i,s)}))}),He(o,e),o}function Nr({tool:e={},values:t={},tokens:n=[],client:r=null,clientInfo:o=[],clientSummary:a=[],profile:s=null}={}){const i=t&&typeof t=="object"?t:{},u=s&&typeof s=="object"?s:null,m=u!=null&&u.tokenValues&&typeof u.tokenValues=="object"?u.tokenValues:{},l={...i,...m},c=Array.isArray(o)?o:[],d=Array.isArray(a)?a:[],p=pn(n,l),b=gn({tokens:p,clientInfo:c,clientSummary:d,profile:u}),k=new Date().toISOString(),y={apiVersion:P,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:k};return{apiVersion:P,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:u||null,values:xn(l,b),tokenValues:l,tokens:p,fields:b,fieldIndex:Nn(b),variables:An({fields:b,tokenValues:l,environment:y,profile:u}),environment:y,client:r&&typeof r=="object"?r:null,clientInfo:c,clientSummary:d,generatedAt:k}}function vr({title:e="",prompt:t=""}={}){const n=String(e||"").trim()||"Custom tool",r=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.

Return one complete HTML file, and nothing else.
- Put all HTML, CSS and JavaScript in that single file.
- Prefer attaching the result as a downloadable .html file when the chat interface supports files.
- If you cannot attach a file, return exactly one fenced code block containing the full HTML document from <!doctype html> to </html>.
- Do not split the answer into multiple parts or multiple messages. If the file would be too long, reduce scope and keep a complete working single-file version.
- Do not include explanations before or after the file.
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Generation contract:
- Read the user request literally and implement only that workflow.
- Do not add unrelated dashboards, tabs, settings, history, import/export, theme switches, fake navigation, sample records, analytics, onboarding, help copy or extra panels unless the user explicitly requested them or they are required for the requested action.
- Every visible control must map to a requested user action, a required validation step or a TemplateTool API operation.
- If the request is vague, build the smallest useful module for the named task and show missing requirements inside the module instead of inventing behavior.
- Use real app context and API responses only. Do not prefill fake topics, templates, clients, IDs or example data.

Module API reference:
${an()}

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
- Use await window.TemplateTool.templates.getTree() or .list() when a trusted module needs the current topic/template tree.
- Use await window.TemplateTool.templates.previewMigration(rules) before writing migrations. Rules may target topics by id, title, or path with fields like { fromTopic, toTopic, channel, titleIncludes }.
- Use await window.TemplateTool.templates.applyMigration(preview.operations) to apply reviewed migration operations through the host storage service.
- Use await window.TemplateTool.templates.updateTemplate(templateId, patch) or .moveTemplate(templateId, targetNodeId, options) for focused edits.
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

Tool name: ${n}

User request:
${r}`}const Ge="salt-templater-alo-autofill",Cn=1,B=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function v(e){return e==null?"":String(e).trim()}function T(e){for(const t of e){const n=v(t);if(n)return n}return""}function _n(e){const t=v(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:v(e)}function ee(e){const t=v(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const r=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(r)return`${r[3]}-${r[2]}-${r[1]}`;const o=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return o?`${o[3]}-${o[1].padStart(2,"0")}-${o[2].padStart(2,"0")}`:t}function Y(e){const t=ee(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function En(e={}){var t,n,r,o,a,s,i;return T([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activation_date,(o=e==null?void 0:e.client)==null?void 0:o.activation,(a=e==null?void 0:e.client)==null?void 0:a.dateActivation,(s=e==null?void 0:e.contact)==null?void 0:s.activationDate,(i=e==null?void 0:e.healthcheck)==null?void 0:i.activationDate])}function Ln(e={}){const t=[e.SignalStatus,e.LedStatus,e.treatmentStep,e.comment].join(" ").toLowerCase();return/(low|bad|rx|tx|performance)/i.test(t)?"lowBadRxTx":"noSignal"}function Dn(e={}){const t=v(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function Xe(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",r=t==="lowBadRxTx"?"Bad signal":"No signal",o=Y(n==="never"?e.activationDate:e.disconnectionDate);return[r,n==="never"?"Never activated":"Signal lost",o].filter(Boolean).join(" - ")}function Sr(e={},t={}){var l,c,d,p;const n=T([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(c=e==null?void 0:e.client)==null?void 0:c.externalId,(d=e==null?void 0:e.superOffice)==null?void 0:d.externalTicketId]),r=J(n),o=r.ok?r.fields:{},a=Ln(o),s=Dn(o),i=ee(En(e)),u=ee(T([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt])),m=T([t==null?void 0:t.sourceTicketId,t==null?void 0:t.ticketId,(p=t==null?void 0:t.tokenValues)==null?void 0:p[F],o.soTicket]);return{externalId:n,externalFields:o,aloType:a,signalState:s,extRef:m,disconnectionDate:s==="lost"?u:"",activationDate:i,description:Xe({aloType:a,signalState:s,disconnectionDate:u,activationDate:i})}}function Ze(e={}){return{firstName:v(e.firstName),lastName:v(e.lastName),email:v(e.email),phoneNumber:T([e.phoneNumber,e.phone])}}function We(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:T([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[F],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:v(e==null?void 0:e.externalTicketId),tokenValues:t}}function On(e={},t={},n={},r={}){const o=(e==null?void 0:e.client)||{},a=(e==null?void 0:e.contact)||{},s=(e==null?void 0:e.healthcheck)||{},i=Ze(t),u=We(n),m=T([a.fixedNumber,a.voipNumber,a.voip,a.sip,o.fixedNumber,o.fixedPhone]),l=_n(T([o.mobile,o.mobileRaw,o.phone,o.telephone,a.mobile,a.phone])),c=T([r.description,r.aloType==="lowBadRxTx"?"Bad signal":"",B.problemDescription]),d=T([r.notes,r.signalState?Xe(r):"",B.problemNotes]),p=r.signalState==="never"?Y(r.activationDate):Y(r.disconnectionDate);return{externalReference:T([r.extRef,u.ticketId]),socketId:T([s.otoId,s.oto_id,s.oto]),plugNr:T([s.otoPortId,s.otoPort,s.oto_port]),breakoutCable:T([s.breakoutCableId,s.breakoutCable,s.cable]),breakoutFiber:T([s.fiberNumber,s.fiber,s.fibre]),firstName:T([o.firstName,o.firstname,o.givenName]),lastName:T([o.lastName,o.lastname,o.surname,o.familyName]),contactPhone1:T([m,l]),contactPhone2:m&&l&&m!==l?l:"",contactEmail:T([o.email,o.mail,a.email,a.mail]),ispFirstName:i.firstName,ispLastName:i.lastName,ispPhone:i.phoneNumber,ispEmail:i.email,...B,problemDescription:c,problemNotes:d,problemDateTime:p,problemCode3:r.aloType==="lowBadRxTx"?"Performance problem":B.problemCode3}}function Vn(e={},t={},n={},r={}){const o=On(e,t,n,r),a=Ze(t),s=We(n);return{source:Ge,version:Cn,fields:o,alo:{type:r.aloType||"noSignal",signalState:r.signalState||"",disconnectionDate:r.disconnectionDate||"",activationDate:r.activationDate||"",problemDateTime:o.problemDateTime,notes:r.notes||""},client:{firstName:o.firstName,lastName:o.lastName,contactPhone1:o.contactPhone1,contactPhone2:o.contactPhone2,email:o.contactEmail},technical:{socketId:o.socketId,plugNr:o.plugNr,breakoutCable:o.breakoutCable,breakoutFiber:o.breakoutFiber},agent:a,superOffice:s}}function Ar(e={},t={},n={},r={}){return JSON.stringify(Vn(e,t,n,r),null,2)}function jn(e){function t(l){return l==null?"":String(l).trim()}function n(l){for(var c=0;c<l.length;c+=1){var d=t(l[c]);if(d)return d}return""}function r(l){return t(l).replace(/[&<>"']/g,function(d){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[d]})}function o(l,c,d){var p=document.getElementById("saltAloFillOverlay");p&&p.remove();var b=document.createElement("div");b.id="saltAloFillOverlay",b.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(d==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",b.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+r(l)+"</strong><span style='color:#d8d8df'>"+r(c)+"</span>",document.body.appendChild(b),d!=="error"&&setTimeout(function(){try{b.remove()}catch{}},4500)}function a(l,c,d){var p=l&&l.fields||{};return n([p[c]].concat(d||[]))}function s(l,c){var d=String(c).replace(/["\\]/g,"\\$&");return document.querySelector("["+l+'="'+d+'"]')}function i(l){return document.getElementById(l)||s("name",l)||s("formcontrolname",l)||s("data-testid",l)}function u(l,c,d){var p=d?String(c??""):t(c);if(!d&&!p)return!1;var b=i(l);if(!b)return!1;if(b.tagName==="SELECT")for(var k=t(p).toLowerCase(),y=0;y<b.options.length;y+=1){var h=b.options[y];if(t(h.value).toLowerCase()===k||t(h.textContent).toLowerCase()===k){b.value=h.value;break}}else"value"in b?b.value=p:b.textContent=p;return b.dispatchEvent(new Event("input",{bubbles:!0})),b.dispatchEvent(new Event("change",{bubbles:!0})),!0}function m(l){if(!l||typeof l!="object"||Array.isArray(l)){o("ALO fill","ALO fill data invalid.","error");return}if(l.source&&l.source!==e){o("ALO fill","Clipboard does not contain ALO fill data from Salt Templater.","error");return}var c=l.client||{},d=l.technical||l.healthcheck||{},p=l.agent||{},b=l.superOffice||{},k=b.tokenValues||l.tokenValues||{},y=0;function h(lt,ct,ut){u(lt,ct,ut)&&(y+=1)}if(h("ticket.extRef",a(l,"externalReference",[b.sourceTicketId,b.ticketId,l.ticketId,k["{so_ticket_num}"]])),h("ticket.socketId",a(l,"socketId",[d.socketId,d.otoId,d.oto_id,d.oto])),h("ticket.plugNr",a(l,"plugNr",[d.plugNr,d.otoPortId,d.otoPort,d.oto_port])),h("ticket.breakoutCable",a(l,"breakoutCable",[d.breakoutCable,d.breakoutCableId,d.cable])),h("ticket.breakoutFiber",a(l,"breakoutFiber",[d.breakoutFiber,d.fiberNumber,d.fiber,d.fibre])),h("ticket.otoAddress.firstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),h("ticket.otoAddress.lastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),h("ticket.contactPersonFirstName",a(l,"firstName",[c.firstName,c.firstname,c.givenName])),h("ticket.contactPersonLastName",a(l,"lastName",[c.lastName,c.lastname,c.surname,c.familyName])),h("ticket.contactPersonPhone1",a(l,"contactPhone1",[c.contactPhone1,c.fixedNumber,c.mobileRaw,c.mobile,c.phone])),h("ticket.contactPersonPhone2",a(l,"contactPhone2",[c.contactPhone2])),h("ticket.contactPersonMail",a(l,"contactEmail",[c.email,c.mail])),h("ticket.contactPersonIspFirstName",a(l,"ispFirstName",[p.firstName])),h("ticket.contactPersonIspLastName",a(l,"ispLastName",[p.lastName])),h("ticket.contactPersonIspPhone",a(l,"ispPhone",[p.phoneNumber,p.phone])),h("ticket.contactPersonIspMail",a(l,"ispEmail",[p.email])),h("ticket.problemDescription",a(l,"problemDescription",["No signal"])),h("ticket.problemNotes",a(l,"problemNotes",[""]),!0),h("ticket.problemDateTime",a(l,"problemDateTime",[l.alo&&l.alo.problemDateTime])),h("ticket.problemCode1",a(l,"problemCode1",["400"])),h("ticket.problemCode2",a(l,"problemCode2",["800"])),h("ticket.problemCode3",a(l,"problemCode3",["900"])),!y){o("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}o("ALO fill","Fields populated: "+y,"success")}if(o("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){o("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(c){if(!t(c)){o("ALO fill","Clipboard empty. Click ALO fill in Salt Templater first.","error");return}var d;try{d=JSON.parse(c)}catch{o("ALO fill","Clipboard does not contain valid ALO data.","error");return}m(d)}).catch(function(c){o("ALO fill","Clipboard error: "+(c&&c.message?c.message:c),"error")})}function Cr(){const e=JSON.stringify(Ge);return`javascript:(${jn.toString()})(${e});`}const Fn=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),zn=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function R(e,t){return!!(e!=null&&e[t])}function $n(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Qe(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Mn(e,t){return R(e,"ctrlKey")===!!t.ctrlKey&&R(e,"altKey")===!!t.altKey&&R(e,"shiftKey")===!!t.shiftKey&&R(e,"metaKey")===!!t.metaKey}function Bn(e,t){return Mn(e,t)&&($n(e==null?void 0:e.key,t.key)||Qe(e==null?void 0:e.code,t.code))}function _r(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function Rn(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(zn))}function Un(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||Rn(e==null?void 0:e.target))}function Er(e){if(Un(e))return null;const t=Fn.find(n=>Bn(e,n))||null;return!t||e!=null&&e.isComposing&&!Qe(e==null?void 0:e.code,t.code)?null:t}const Kn="case-profile-beta-1",et=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),he=Object.freeze(Object.fromEntries(et)),tt=Object.freeze(et.map(([e])=>e)),qn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),te=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),nt=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function x(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function I(...e){for(const t of e){const n=x(t);if(n!=="")return n}return""}function _(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Pn(e=""){const t=_(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function ge(e=""){const t=Pn(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ne(e=""){const t=_(e);return t?`{${t}}`:""}function E(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function Yn(){const e={};return tt.forEach(t=>{e[t]=""}),{version:Kn,fields:e,fieldLabels:{...he},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function rt(e){return x(e)!==""}function w(e,t,n,{overwrite:r=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const o=x(n);return o===""||!r&&rt(e.fields[t])?!1:(e.fields[t]=o,e[t]=o,!0)}function Te(e,t,n,{overwrite:r=!1,label:o=""}={}){const a=ge(t),s=x(n);return!a||s===""||nt.has(a)||!r&&Object.prototype.hasOwnProperty.call(e.dynamic,a)?!1:(e.dynamic[a]=s,o&&!e.fieldLabels[a]&&(e.fieldLabels[a]=o),!0)}function Jn(e,t,n,r={}){const o=_(H(t)||t),a=te[o]||te[_(t)]||ge(t);return Object.prototype.hasOwnProperty.call(e.fields,a)?w(e,a,n,r):Te(e,t,n,r)}function Hn(e,t={},n={}){Object.entries(t).forEach(([r,o])=>w(e,r,o,n))}function ne(e,t=[],n=[]){return Array.isArray(e)?(e.forEach((r,o)=>{t.push(String(o+1)),ne(r,t,n),t.pop()}),n):e&&typeof e=="object"?(Object.keys(e).forEach(r=>{t.push(r),ne(e[r],t,n),t.pop()}),n):(n.push({path:t.slice(),value:x(e)}),n)}function Gn(e=[]){return e[0]===ae||e[0]===ie}function ot(e,t,{prefix:n="",skipInternalClientKeys:r=!1}={}){!t||typeof t!="object"||ne(t).filter(o=>o.value!=="").filter(o=>!r||!Gn(o.path)).forEach(o=>{const a=n?[n,...o.path]:o.path;Te(e,a.join("_"),o.value,{label:a.map(E).join(" ")})})}function ve(e=[],t=[]){const n=new Map;return[...e,...t].forEach(r=>{if(!r||typeof r!="object")return;const o=`${x(r.url)}|${x(r.name)}|${x(r.id)}`;o.replace(/\|/g,"")&&(n.has(o)||n.set(o,r))}),Array.from(n.values())}function ke(e){const t=x(e);if(!t)return null;const n=J(t);return n.ok?{externalId:t,fields:n.fields}:null}function at(e,t){var n,r,o,a;t&&(w(e,"externalId",t.externalId),Object.entries(qn).forEach(([s,i])=>{var u;w(e,i,(u=t.fields)==null?void 0:u[s])}),w(e,"contractorNumber",(n=t.fields)==null?void 0:n.customer),w(e,"lexId",(r=t.fields)==null?void 0:r.lexId),w(e,"oltName",(o=t.fields)==null?void 0:o.oltName),w(e,"oltBoard",(a=t.fields)==null?void 0:a.oltBoard))}function Xn(e,t){var i;if(!t||typeof t!="object")return;const n=t.client||{},r=t.contact||{},o=t.healthcheck||{},a=o.crossConnexion||o.crossConnection||{},s=[n.firstName,n.lastName].map(x).filter(Boolean).join(" ");Hn(e,{clientName:s||I(n.fullName,n.name,n.customerName),title:n.title,firstName:n.firstName,lastName:n.lastName,contractorNumber:I(n.contractorNumber,n.contractor,o.customerId),mobile:I(n.mobile,n.phone,n.telephone),mobileRaw:n.mobileRaw,phone:I(n.phone,n.telephone,r.fixedNumber),email:n.email,address:n.address,communicationLanguage:I(n.communicationLanguage,r.communicationLanguage,n.language,r.language),activationDate:I(n.activationDate,n.activation_date,n.activation,n.dateActivation,(i=t.offer)==null?void 0:i.activationDate,r.activationDate,o.activationDate),eligibilitySource:I(n.eligibilitySource,r.eligibilitySource),contactRecordId:I(n.contactRecordId,r.contactRecordId),fixedNumber:r.fixedNumber,publicId:r.publicId,fllRecordId:o.fllRecordId,otoId:I(o.otoId,o.oto_id,o.oto),otoPortId:I(o.otoPortId,o.otoPort,o.oto_port,a.Port),routerSerialNumber:o.routerSerialNumber,oldRouterSerialNumber:o.oldRouterSerialNumber,lexId:o.lexId,oltName:o.oltName,oltBoard:o.oltBoard,ponPort:o.ponPort,breakoutCableId:o.breakoutCableId,fiberNumber:o.fiberNumber,lineState:o.lineState,routerStatus:o.routerStatus,odfId:o.odfId,option82:o.option82,oltObject:o.oltObject,ontConfigurationFilename:o.ontConfigurationFilename,svlan:o.svlan,customerId:o.customerId,crossConnectionEquipment:a.Equipment,crossConnectionRack:a.Rack,crossConnectionSlot:a.Slot,crossConnectionPort:a.Port}),at(e,ke(t[ie])),ot(e,t,{skipInternalClientKeys:!0})}function Zn(e,t){var o;if(!t||typeof t!="object")return;w(e,"soTicketNum",I(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(o=t.tokenValues)==null?void 0:o[F])),w(e,"ticketCreatedAt",I(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),at(e,ke(t.externalTicketId)),it(e,t.tokenValues);const n=G(t.attachments),r=$(n);e.attachments=ve(e.attachments,n),e.photos=ve(e.photos,r),ot(e,t,{prefix:"ticket"})}function it(e,t={},n={}){!t||typeof t!="object"||Object.entries(t).forEach(([r,o])=>{const a=x(o);if(a==="")return;const s=H(r),i=mt(s)||_(r),u=te[i];u&&w(e,u,a,n),i==="external_customer"&&w(e,"contractorNumber",a,n),i==="external_lex_id"&&w(e,"lexId",a,n),i==="external_olt_name"&&w(e,"oltName",a,n),i==="external_olt_board"&&w(e,"oltBoard",a,n),Te(e,i,a,{...n,label:E(i)})})}function Wn(e,t){const n=t==null?void 0:t[ae];!n||typeof n!="object"||Array.isArray(n)||Object.entries(n).forEach(([r,o])=>{Jn(e,r,o,{overwrite:!0,label:E(r)})})}function Se(e,t,n){const r=ge(t),o=x(n);!r||o===""||nt.has(r)||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=o)}function Qn(e,t={}){const n={},r={},o=[];tt.forEach(i=>{const u=x(e.fields[i]);if(u==="")return;Se(n,i,u);const m=Ne(i);m&&(r[m]=u),o.push({key:i,label:he[i]||E(i),value:u})}),Object.entries(e.dynamic).forEach(([i,u])=>{const m=x(u);if(m==="")return;Se(n,i,m);const l=Ne(i);l&&!Object.prototype.hasOwnProperty.call(r,l)&&(r[l]=m),e.fields[i]||o.push({key:i,label:e.fieldLabels[i]||E(i),value:m})});const a=ke(e.externalId);a&&Object.assign(r,re(a.fields)),rt(e.soTicketNum)&&(r[F]=e.soTicketNum);const s={};return Object.entries(t||{}).forEach(([i,u])=>{const m=H(i)||i;s[m]=u}),e.vars=n,e.variables=n,e.tokenValues={...s,...r},e.availableFields=o,e}function Lr({clientPayload:e=null,superOfficePayload:t=null,tokenValues:n={}}={}){const r=Yn();return Xn(r,e),Zn(r,t),it(r,n),Wn(r,e),Qn(r,n)}function f(e,t,n=""){var o;const r=x((e==null?void 0:e[t])??((o=e==null?void 0:e.fields)==null?void 0:o[t]));return r?{label:n||he[t]||E(t),value:r}:null}function S(e,t){const n=x(t);return n?{label:e,value:n}:null}function st(e=[]){const t=new Set;return e.filter(Boolean).filter(n=>{const r=`${_(n.label)}:${n.value}`;return t.has(r)?!1:(t.add(r),!0)})}function U(e,t,n=[]){const r=st(n);return r.length>0?{id:e,title:t,fields:r}:null}function Dr(e=null){return!e||typeof e!="object"?[]:st([S("Name",e.clientName),S("Mobile",I(e.mobile,e.mobileRaw,e.phone)),S("Contractor",I(e.contractorNumber,e.externalCustomer,e.customerId)),S("Activation",e.activationDate),S("OTO ID",e.otoId),S("Port",I(e.otoPortId,e.crossConnectionPort)),S("SO ticket",e.soTicketNum)])}function Or(e=null){return!e||typeof e!="object"?[]:[U("caseClient","Client",[f(e,"clientName","Full name"),f(e,"contractorNumber","Contractor"),f(e,"title"),f(e,"firstName"),f(e,"lastName"),f(e,"mobile"),f(e,"mobileRaw","Mobile raw"),f(e,"phone"),f(e,"email"),f(e,"address"),f(e,"communicationLanguage","Language"),f(e,"activationDate","Activation date")]),U("caseSuperOffice","SuperOffice",[f(e,"soTicketNum","SO ticket"),f(e,"ticketCreatedAt","Created at"),f(e,"externalId","External ID"),f(e,"externalPartner","Partner"),f(e,"externalPartnerTicketNumber","Partner ticket")]),U("caseExternalId","External ID fields",[f(e,"externalFlagging","Flagging"),f(e,"externalDate","Date"),f(e,"externalCustomer","Contractor"),f(e,"externalSignalStatus","Signal"),f(e,"externalLedStatus","LED"),f(e,"externalTreatmentStep","Treatment"),f(e,"externalBoxType","Box"),f(e,"externalLexId","LEX ID"),f(e,"externalOltName","OLT"),f(e,"externalOltBoard","Board"),f(e,"externalBokBof","BOK/BOF"),f(e,"externalComment","Comment")]),U("caseTechnical","Technical",[f(e,"fllRecordId","FLL record"),f(e,"otoId","OTO ID"),f(e,"otoPortId","OTO port"),f(e,"routerSerialNumber","Router serial"),f(e,"oldRouterSerialNumber","Old router serial"),f(e,"lexId","LEX ID"),f(e,"oltName","OLT"),f(e,"oltBoard","OLT board"),f(e,"ponPort","PON port"),f(e,"breakoutCableId","Breakout cable"),f(e,"fiberNumber","Fiber number"),f(e,"lineState","Line state"),f(e,"routerStatus","Router status"),f(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{Er as A,Xe as B,sr as C,Cr as D,lr as E,kr as F,ze as G,Fe as H,Rt as I,_r as J,Fn as K,vr as L,Kt as M,cr as P,zt as S,A as T,Ve as a,hr as b,gr as c,Tr as d,Yt as e,wr as f,de as g,Nr as h,yr as i,Ir as j,$ as k,mr as l,ur as m,ar as n,ir as o,dr as p,Lr as q,xr as r,pr as s,Or as t,Dr as u,Bt as v,fr as w,Sr as x,Ar as y,br as z};
