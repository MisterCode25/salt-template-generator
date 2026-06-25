import{c as H}from"./createLucideIcon-CY7U6rUe.js";import{p as G,b as oe,S as $,L as Z,H as Ee,o as ie,w as pt,F as _e,T as Le,W as se,X as le,Y as ft}from"./tokenService-1uiqThb2.js";import{l as bt,s as ht}from"./index-kl7YVbjy.js";import{l as F,s as ce,d as gt}from"./templateTreeService-CGpSjTBN.js";import{f as Oe,u as De}from"./templateTreeOperations-DnJlNyQc.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],cr=H("chevron-left",Tt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],ur=H("chevron-right",yt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],dr=H("clipboard-copy",kt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],mr=H("puzzle",vt),xt=/\.(jpe?g|png|webp|gif|bmp|avif)(?:$|[?#])/i,wt=/\.pdf(?:$|[?#])/i,It=["{contractor}","{contractor_number}","{client_contractor_number}"];function g(...e){for(const t of e){const n=String(t??"").trim();if(n)return n}return""}function Nt(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function St(e="",t=""){const n=`${e} ${t}`;return xt.test(n)?"image":wt.test(n)?"pdf":"file"}function At(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function Ct(e={}){var t,n,r;return g(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(n=e.message)==null?void 0:n.createdAt,(r=e.message)==null?void 0:r.sentAt)||null}function D(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function Et(e,t){var s,c,u,l,d;if(!e||typeof e!="object"||Array.isArray(e))return null;const n=g(e.url,e.href,e.src,e.downloadUrl);if(!n)return null;const r=g(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((s=String(n).split("/").pop())==null?void 0:s.split("?")[0])||""))||`Attachment ${t+1}`,a=g(e.type,e.contentType,e.mimeType),i=At(a)?"image":St(r,n),o=g(e.messageId,e.messageID,e.postId,(c=e.message)==null?void 0:c.id)||null;return{id:g(e.id,e.attachmentId,e.documentId)||`${t}-${r}-${n}`,name:r,url:n,type:i,size:g(e.size,e.sizeText,e.fileSize)||null,messageId:o,postId:g(e.postId,o)||null,messageIndex:D(g(e.messageIndex,e.messageOrder,e.postIndex,(u=e.message)==null?void 0:u.index)),attachmentIndex:D(g(e.attachmentIndex,e.fileIndex)),messageAuthor:g(e.messageAuthor,e.author,e.createdBy,(l=e.message)==null?void 0:l.author,(d=e.message)==null?void 0:d.createdBy)||null,source:g(e.source,e.origin)||null,date:Ct(e)}}function xe(e){return String(e).padStart(2,"0")}function _t(e){const t=e.getFullYear(),n=xe(e.getMonth()+1),r=xe(e.getDate());return{dateKey:`${t}-${n}-${r}`,label:`${r}.${n}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function we(e,t,n,r=0,a=0,i=0){if(t<0||t>11||n<1||n>31||r<0||r>23||a<0||a>59||i<0||i>59)return null;const o=new Date(e,t,n,r,a,i);return o.getFullYear()!==e||o.getMonth()!==t||o.getDate()!==n?null:o}function Lt(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const i=new Date(e);return Number.isNaN(i.getTime())?null:i}const t=String(e).trim();if(!t)return null;const n=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const i=we(Number(n[1]),Number(n[2])-1,Number(n[3]),Number(n[4]||0),Number(n[5]||0),Number(n[6]||0));if(i)return i}const r=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(r){const i=Number(r[1]),o=r[2],s=Number(r[3]),c=Number(r[4]),u=c<100?2e3+c:c,l=Number(r[5]||0),d=Number(r[6]||0),m=Number(r[7]||0),f=o==="/"&&s>12&&i<=12,b=f?s:i,y=(f?i:s)-1,v=we(u,y,b,l,d,m);if(v)return v}const a=new Date(t);return Number.isNaN(a.getTime())?null:a}function ue(e={}){const t=Lt(e.date);return t?_t(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function Ot(e,t){const n=g(t);n&&It.forEach(r=>{e[r]=n})}function Ie(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function Dt(e,t,n){const r=Z(t),a=g(n);!r||!a||e.push([r,a])}function Ve(e,t=[]){const n=[];return Ie(e)&&Object.entries(e).forEach(([r,a])=>{if(Ie(a)){n.push(...Ve(a,[...t,r]));return}Dt(n,[...t,r].join("."),a)}),n}function Vt(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(n=>{Ve(e[n]).forEach(([r,a])=>{t[r]=a})}),t}function X(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(Et).filter(Boolean).filter(n=>{const r=`${n.name}|${n.url}`;return t.has(r)?!1:(t.add(r),!0)})}function z(e=[]){return X(e).filter(t=>t.type==="image")}function jt(e=[]){const t=new Map;return z(e).forEach((n,r)=>{const a=ue(n);t.has(a.dateKey)||t.set(a.dateKey,{...a,attachments:[]}),t.get(a.dateKey).attachments.push({...n,galleryIndex:r})}),Array.from(t.values()).sort((n,r)=>r.sortValue-n.sortValue)}function Ne(e={}){var t;return g(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function $t(e={},t=0){const n=D(e.messageNumber),r=D(e.messageIndex);return`Post ${n||(r===null?t+1:r+1)}`}function Ft(e={}){const t=ue(e),n=g(e.messageAuthor);return t.dateKey==="unknown"?n:[t.label,n].filter(Boolean).join(" · ")}function pr(e=[]){const t=z(e);if(!t.some(r=>Ne(r)))return jt(t);const n=new Map;return t.forEach((r,a)=>{const i=Ne(r),o=ue(r),s=i||`unassigned:${o.dateKey}`;if(!n.has(s)){const c=n.size;n.set(s,{dateKey:s,label:i?$t(r,c):o.label,metaLabel:i?Ft(r):"",sortValue:D(r.messageIndex)??a,attachments:[]})}n.get(s).attachments.push({...r,galleryIndex:a})}),Array.from(n.values()).sort((r,a)=>r.sortValue-a.sortValue)}function fr(e){var f,b;const t=Nt(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const n=g(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),r=g(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),a=g(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),i=g(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(f=t.client)==null?void 0:f.contractorNumber,(b=t.client)==null?void 0:b.contractor),o={};let s=null,c=!1;const u=X(t.attachments),l=z(u);if(a){const y=G(a);y.ok&&(c=!0,s=y.fields,Object.assign(o,oe(y.fields)))}Object.assign(o,Vt(t));const d=(s==null?void 0:s.customer)||i;d&&(c||n||u.length>0)&&Ot(o,d);const m=n||(s==null?void 0:s.soTicket)||"";return m&&(o[$]=m),Object.keys(o).length===0&&u.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:c,externalTicketId:a}:{ok:!0,ticketId:m,sourceTicketId:n,createdAt:r,externalTicketId:a,contractorNumber:d,externalIdValid:c,externalFields:s,tokenValues:o,attachments:u,imageAttachments:l,ignoredExternalId:!!(a&&!c)}}const de="super_office_ticket_payload",me="pending_super_office_ticket_payload",zt="super-office-ticket-updated";function Bt(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[se]:t,[le]:n,...r}=e;return r}function ee(e){return Array.isArray(e)?`[${e.map(ee).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${ee(e[t])}`).join(",")}}`:JSON.stringify(e)}function pe(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return ee(Bt(e))}catch{return""}}function V(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(zt,{detail:{payload:e}}))}function W(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=X(e.attachments),n=String(e.clientSignature||"").trim(),r=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([a,i])=>[a,i==null?"":String(i)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:n,tokenValues:r,attachments:t,imageAttachments:z(t)}}function Mt(e,t=new Date,n=""){return W({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:n,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function fe(e){e&&await Le(de,e)}async function je(e){e&&await Le(me,e)}async function Q(){try{return W(await Ee(me,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function br(){return Q()}async function Rt(){return await $e()||await Q()}async function hr(){return!!await Rt()}function be(){return _e(me)}async function gr(e){const t=await ie(),n=Mt(e,new Date,pe(t));return n?n.clientSignature?(await fe(n),await be(),V(n),n):(await q(),await je(n),V(null),n):null}async function Tr(e){const t=pt(e);if(!t)return null;const n=await $e(),r=n?null:await Q(),a=n||r;if(!a)return null;const i=G(t),o=i.ok?{...a.tokenValues||{},...oe(i.fields)}:a.tokenValues||{},s=W({...a,externalTicketId:t,tokenValues:o});return s?(s.clientSignature?await fe(s):await je(s),V(s),s):null}function q(){return _e(de)}async function yr(){const e=await Q(),t=pe(await ie());if(!e||!t)return null;const n={...e,clientSignature:t};return await fe(n),await be(),V(n),n}async function $e(){try{const e=await Ee(de,null);if(!e)return null;const t=pe(await ie());if(!t)return await q(),null;if((e==null?void 0:e.clientSignature)!==t)return await q(),null;const n=W(e);return n||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function kr(){await q(),await be(),V(null)}const Fe="quick_tools",Kt="blue",C=Object.freeze({LINK:"link",MODULE:"module"}),Ut=C.LINK,Pt=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],qt=new Set(Pt.map(e=>e.value)),Jt=new Set(Object.values(C));function Yt(e){return qt.has(e)?e:Kt}function ze(e){return Jt.has(e)?e:Ut}function Ht(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function Be(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?C.MODULE:C.LINK),n=ze(t);return{...e,type:n,title:String(e.title||"").trim(),url:n===C.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:Yt(e.color),order:Ht(e.order),beta:n===C.MODULE?!0:!!e.beta}}async function vr(){const e=await bt(Fe,[]);return Array.isArray(e)?e.map(Be).filter(Boolean):[]}async function xr(e){const t=Array.isArray(e)?e.map(Be).filter(Boolean):[];return ht(Fe,t)}function wr(e,t={}){return(e||"").replace(/\{[^}]+\}/g,n=>{const r=t[n];if(r==null||r==="")return n;const a=String(r).replace(/<[^>]+>/g,"").trim();return encodeURIComponent(a)})}function Ir(e){return ze(e==null?void 0:e.type)===C.MODULE}const Gt=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function he(e){return e==null?e:JSON.parse(JSON.stringify(e))}function O(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function E(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function Me(e=[]){return new Map(e.map(t=>[t.id,t]))}function Re(e,t){if(!e)return"";const n=[],r=new Set;let a=e;for(;a&&!r.has(a.id);)r.add(a.id),n.unshift(a.title||a.id),a=a.parentId?t.get(a.parentId):null;return n.join(" / ")}function Zt(e=[]){const t=Me(e);return e.map(n=>({...n,path:Re(n,t)}))}function Ke(e=[],t){const n=String(t||"").trim();if(!n)return null;const r=Me(e);if(r.has(n))return r.get(n);const a=E(n);return e.find(i=>E(i.title)===a||E(Re(i,r))===a)||null}function Xt(e=[],t={}){return Ke(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function Wt(e=[],t={}){return Ke(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function Qt(e,t={},n=null){const r=O(t.templateIds||t.templateId).map(String).filter(Boolean);if(r.length>0&&!r.includes(e.id)||n&&!(e.nodeIds||[]).includes(n.id))return!1;const a=O(t.channels||t.channel).map(s=>String(s||"").trim()).filter(Boolean);if(a.length>0&&!a.some(s=>(e.channels||[]).includes(s)))return!1;const i=String(t.title||t.templateTitle||"").trim();if(i&&E(e.title)!==E(i))return!1;const o=O(t.titleIncludes||t.templateTitleIncludes).map(E).filter(Boolean);if(o.length>0){const s=E(e.title);if(!o.some(c=>s.includes(c)))return!1}return!0}function en({template:e,sourceNode:t,targetNode:n,reason:r=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:n.id,targetNodeTitle:n.title||"",reason:r}}function Ue({nodes:e=[],templates:t=[]}={}){return{nodes:Zt(e),templates:he(t),counts:{nodes:e.length,templates:t.length}}}function Pe(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([n,r])=>{Gt.has(n)&&(t[n]=r)}),t}async function qe(){return Ue(await F())}async function tn(){return qe()}async function nn(e=[]){const t=O(e),{nodes:n,templates:r}=await F(),a=[],i=[];return t.forEach((o,s)=>{if(!o||typeof o!="object"||Array.isArray(o)){i.push({ruleIndex:s,reason:"Rule must be an object."});return}const c=Wt(n,o);if(!c){i.push({ruleIndex:s,reason:"Target topic was not found."});return}const u=Xt(n,o),l=r.filter(d=>Qt(d,o,u));if(l.length===0){i.push({ruleIndex:s,reason:"No templates matched this rule."});return}l.forEach(d=>{(d.nodeIds||[])[0]===c.id&&(!u||u.id===c.id)||a.push(en({template:d,sourceNode:u,targetNode:c,reason:o.reason||`Rule ${s+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:a.length,affectedTemplateCount:new Set(a.map(o=>o.templateId)).size,operations:a,skipped:i}}async function rn(e=[]){const t=O(e),n=await F();let r=n.nodes,a=n.templates;const i=[],o=[];return t.forEach((s,c)=>{var l;const u=(s==null?void 0:s.action)||(s==null?void 0:s.type);if(!s||typeof s!="object"||Array.isArray(s)){o.push({operationIndex:c,reason:"Operation must be an object."});return}if(u==="moveTemplate"){const d=String(s.templateId||""),m=String(s.targetNodeId||s.toNodeId||"");if(!d||!m){o.push({operationIndex:c,reason:"moveTemplate requires templateId and targetNodeId."});return}const f=a.find(v=>v.id===d),b=s.sourceNodeId||((l=f==null?void 0:f.nodeIds)==null?void 0:l[0])||null,y=JSON.stringify(a);a=Oe(a,d,b,m,Number(s.targetIndex),r),JSON.stringify(a)!==y&&i.push({operationIndex:c,action:u,templateId:d,targetNodeId:m});return}if(u==="updateTemplate"){const d=String(s.templateId||"");if(!d){o.push({operationIndex:c,reason:"updateTemplate requires templateId."});return}const m=Pe(s.patch||s.fields||{}),f=JSON.stringify(a);a=De(a,d,m),JSON.stringify(a)!==f&&i.push({operationIndex:c,action:u,templateId:d});return}o.push({operationIndex:c,reason:`Unsupported operation: ${u||"unknown"}.`})}),i.length>0&&await ce({nodes:r,templates:a}),{ok:!0,appliedCount:i.length,skippedCount:o.length,applied:i,skipped:o,tree:Ue({nodes:r,templates:a})}}async function an(e,t={}){const n=String(e||"");if(!n)throw new Error("templateId is required.");const r=await F();if(!r.templates.some(i=>i.id===n))throw new Error("Template was not found.");const a=De(r.templates,n,Pe(t));return await ce({nodes:r.nodes,templates:a}),{ok:!0,template:he(a.find(i=>i.id===n))}}async function on(e,t,n={}){var u;const r=String(e||""),a=String(t||"");if(!r||!a)throw new Error("templateId and targetNodeId are required.");const i=await F();if(!i.templates.some(l=>l.id===r))throw new Error("Template was not found.");const o=i.templates.find(l=>l.id===r),s=(n==null?void 0:n.sourceNodeId)||((u=o==null?void 0:o.nodeIds)==null?void 0:u[0])||null,c=Oe(i.templates,r,s,a,Number(n==null?void 0:n.targetIndex),i.nodes);return await ce({nodes:i.nodes,templates:c}),{ok:!0,template:he(gt(c.find(l=>l.id===r)))}}async function Nr(e,t={}){switch(e){case"tool:templates:list":return qe();case"tool:templates:get-tree":return tn();case"tool:templates:preview-migration":return nn(t.rules||t);case"tool:templates:apply-migration":return rn(t.operations||t);case"tool:templates:update-template":return an(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return on(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const J="template-tool-module-beta-1",Je=Object.freeze({name:"Template Generator Module API",version:J,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']","TemplateVars.available.map((entry) => entry.name)"],reservedContainers:["env","raw","byToken","byKey","byLabel","available","availableTokens","availableFields"]},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object with scalar aliases plus available, availableTokens, availableFields, byToken, byKey and byLabel discovery containers",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function sn(e=Je){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,r])=>{t.push(`- window.${n}: ${r.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,r])=>{t.push(`- ${n}: ${r}`)}),t.join(`
`)}const ln=`
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
</style>`,cn=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${J}";
    var apiReference = ${JSON.stringify(Je)};
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
<\/script>`,un=`<!doctype html>
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
</html>`;function dn(e=""){var c;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),r=((c=n==null?void 0:n[1])==null?void 0:c.trim())||t,a=r.match(/<!doctype\s+html\b|<html[\s>]/i);if(!a)return r;const i=a.index||0,o=r.slice(i).trim(),s=o.match(/<\/html\s*>/i);return s?o.slice(0,s.index+s[0].length).trim():o}function mn(e=""){const t=dn(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:un}function pn(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function fn(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Sr(e=""){const t=mn(e),n=fn(t,cn,"template-tool-bridge");return pn(n,ln,"template-tool-host-style")}function bn(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const r=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:r??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function N(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function te(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function Ye(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function He(e=""){const t=Ye(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function j(e=""){const t=He(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function ge(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function B(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function I(e,t){const n=String(t||"").trim();if(!n)return;B(e,n);const r=Ye(n),a=He(n);r&&(B(e,r),B(e,`{${r}}`)),a&&B(e,a)}function Ge({label:e="",token:t="",key:n="",aliases:r=[],section:a=""}={}){const i=[];I(i,e),I(i,t),I(i,t.replace(/[{}]/g,"")),I(i,n);const o=ge(n);return o.length>0&&(I(i,o[o.length-1]),I(i,o.join(" ")),I(i,o.join(""))),I(i,a),r.forEach(s=>I(i,s)),i}function hn(e){const t=N(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=Ge({...e,...n}),n}function gn({tokens:e=[],clientInfo:t=[],clientSummary:n=[],profile:r=null}={}){const a=[],i=new Set,o=s=>{const c=hn(s);if(!c)return;const u=`${c.source}:${c.label}:${c.value}:${c.token||""}:${c.key||""}`;i.has(u)||(i.add(u),a.push(c))};return e.forEach(s=>{o({label:s.label,value:s.value,token:s.token,key:s.key,aliases:s.aliases,source:"token"})}),n.forEach(s=>{o({label:s.label,value:s.value,section:"summary",source:"clientSummary"})}),t.forEach(s=>{((s==null?void 0:s.fields)||[]).forEach(c=>{o({label:c.label,value:c.value,section:s.title||s.id,source:"clientInfo"})})}),r&&typeof r=="object"&&(Array.isArray(r.availableFields)?r.availableFields:[]).forEach(s=>{o({label:s.label,value:s.value,key:s.key,aliases:s.aliases,source:"profile"})}),a}function Tn(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function yn(e,t,n){const r=ge(t);if(r.length<2||n==="")return;let a=e;for(let o=0;o<r.length-1;o+=1){const s=r[o];if(!s||/^\d+$/.test(s)||(a[s]===void 0&&(a[s]={}),!a[s]||typeof a[s]!="object"||Array.isArray(a[s])))return;a=a[s]}const i=r[r.length-1];i&&!Object.prototype.hasOwnProperty.call(a,i)&&(a[i]=n)}function kn(e={},t=[]){const n={...e};return t.forEach(r=>{r.key&&yn(n,r.key,r.value),r.aliases.forEach(a=>Tn(n,a,r.value))}),Ze(n,t),n}const vn=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function xn(e,t){const n=te(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(r=>te(r)===n)}function wn(e=[],t=[]){for(const n of t){const r=e.find(i=>xn(i,n)),a=N(r==null?void 0:r.value);if(a!=="")return a}return""}function Ze(e,t=[]){vn.forEach(({name:n,candidates:r})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const a=wn(t,r);a!==""&&(e[n]=a)})}function In({tokens:e=[],fields:t=[],variables:n={}}={}){const r=[],a=new Set,i=o=>{const s=Array.isArray(o.names)?o.names.filter(Boolean):[],c=[o.token||"",o.key||"",o.label||"",o.source||"",s.join("|")].join(":");a.has(c)||(a.add(c),r.push({name:s[0]||o.token||o.key||o.label||"",names:s,token:o.token||"",key:o.key||"",label:o.label||"",value:N(o.value),source:o.source||"context",inputType:o.inputType||"",internal:!!o.internal}))};return e.forEach(o=>{const c=Ge({label:o.label,token:o.token,key:o.key,aliases:o.aliases}).map(j).filter(Boolean);i({names:[...new Set(c)],token:o.token,key:o.key,label:o.label,value:o.value,source:"token",inputType:o.inputType,internal:o.internal})}),t.forEach(o=>{const c=[o.label,o.token,o.key,...o.aliases||[]].map(j).filter(Boolean);i({names:[...new Set(c)],token:o.token,key:o.key,label:o.label,value:o.value,source:o.source})}),Object.entries(n).forEach(([o,s])=>{!o||s===null||typeof s=="object"||i({names:[o],label:o,value:s,source:"variable"})}),r.sort((o,s)=>o.name.localeCompare(s.name))}function Nn(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(r=>{const a=te(r);!a||t[a]||(t[a]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function P(e,t,n){const r=j(t);!r||n===""||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=n)}function Sn(e,t,n){const r=ge(t).map(j).filter(Boolean);if(r.length<2||n==="")return;let a=e;for(let o=0;o<r.length-1;o+=1){const s=r[o];if(a[s]===void 0&&(a[s]={}),!a[s]||typeof a[s]!="object"||Array.isArray(a[s]))return;a=a[s]}const i=r[r.length-1];i&&!Object.prototype.hasOwnProperty.call(a,i)&&(a[i]=n)}function An(e,t=null){if(!t||typeof t!="object")return;const n=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(n).forEach(([r,a])=>{const i=N(a);i!==""&&P(e,r,i)})}function Cn({fields:e=[],tokens:t=[],tokenValues:n={},environment:r={},profile:a=null}={}){const i={env:r,raw:n,byToken:{},byKey:{},byLabel:{},available:[],availableTokens:[],availableFields:[]};return t.forEach(o=>{o.token&&(i.byToken[o.token]=N(o.value))}),Object.entries(n||{}).forEach(([o,s])=>{const c=N(s);i.byToken[o]=c,c!==""&&(P(i,o,c),P(i,o.replace(/[{}]/g,""),c))}),An(i,a),e.forEach(o=>{const s=N(o.value);s!==""&&(o.token&&(i.byToken[o.token]=s),o.key&&(i.byKey[o.key]=s,Sn(i,o.key,s)),i.byLabel[o.label]=s,[o.label,o.token,o.key,...o.aliases||[]].forEach(c=>{P(i,c,s)}))}),Ze(i,e),i.available=In({tokens:t,fields:e,variables:i}),i.availableTokens=i.available.filter(o=>o.token),i.availableFields=e.map(o=>({name:j(o.key||o.token||o.label),token:o.token||"",key:o.key||"",label:o.label||"",value:o.value,source:o.source||"context",aliases:o.aliases||[]})),i}function Ar({tool:e={},values:t={},tokens:n=[],client:r=null,clientInfo:a=[],clientSummary:i=[],profile:o=null}={}){const s=t&&typeof t=="object"?t:{},c=o&&typeof o=="object"?o:null,u=c!=null&&c.tokenValues&&typeof c.tokenValues=="object"?c.tokenValues:{},l={...s,...u},d=Array.isArray(a)?a:[],m=Array.isArray(i)?i:[],f=bn(n,l),b=gn({tokens:f,clientInfo:d,clientSummary:m,profile:c}),y=new Date().toISOString(),v={apiVersion:J,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:y};return{apiVersion:J,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:c||null,values:kn(l,b),tokenValues:l,tokens:f,fields:b,fieldIndex:Nn(b),variables:Cn({fields:b,tokens:f,tokenValues:l,environment:v,profile:c}),environment:v,client:r&&typeof r=="object"?r:null,clientInfo:d,clientSummary:m,generatedAt:y}}function En(e=""){const t=String(e||"").trim(),n=t.match(/^```(?:json|text)?\s*([\s\S]*?)\s*```$/i);return n?n[1].trim():t}function Cr(e=""){const t=En(e);if(!t)return"";try{const n=JSON.parse(t);return n&&typeof n=="object"&&!Array.isArray(n)&&typeof n.html=="string"&&n.html.trim()?n.html.trim():""}catch{return""}}function M(e=""){const t=N(e);return t?`value: ${t.slice(0,80)}${t.length>80?"…":""}`:"empty now"}function _n(e={}){const t=Array.isArray(e.names)?e.names.filter(Boolean):[];return[...new Set([e.name,...t].filter(Boolean))].slice(0,8).join(", ")}function Ln(e=null){var c;if(!e||typeof e!="object")return"No live app context was loaded while copying this prompt. The module must discover variables at runtime with TemplateTool.getContext(), TemplateTool.getVars(), TemplateTool.listVariables(), context.tokens and context.fields.";const t=["Live variable inventory from the current app context:","Use these exact names/tokens/keys when they fit the request, and still keep runtime fallbacks because availability changes per customer."],n=e.profile&&typeof e.profile=="object"?e.profile:null,r=n!=null&&n.vars&&typeof n.vars=="object"?n.vars:{},a=Object.entries(r).filter(([,u])=>N(u)!=="").sort(([u],[l])=>u.localeCompare(l));a.length>0&&(t.push("","Profile variables (TemplateProfile / TemplateVars aliases):"),a.forEach(([u,l])=>{t.push(`- ${u} (${M(l)})`)}));const i=Array.isArray((c=e.variables)==null?void 0:c.available)?e.variables.available:[];i.length>0&&(t.push("","Discoverable TemplateVars.available entries:"),i.forEach(u=>{const l=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",`names: ${_n(u)||"none"}`,`source ${u.source||"context"}`,M(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)}));const o=Array.isArray(e.fields)?e.fields:[];o.length>0&&(t.push("","Resolved context.fields (preferred for visible customer data):"),o.forEach(u=>{const l=[u.label?`label ${u.label}`:"",u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.section?`section ${u.section}`:"",`source ${u.source||"context"}`,M(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)}));const s=Array.isArray(e.tokens)?e.tokens:[];return s.length>0&&(t.push("","All configured context.tokens, including empty values:"),s.forEach(u=>{const l=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",u.inputType?`type ${u.inputType}`:"",u.internal?"internal":"manual/configured",M(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)})),a.length===0&&i.length===0&&o.length===0&&s.length===0&&t.push("- No variables are currently configured or populated in this context. Build a missing-data state and rely on runtime discovery."),t.join(`
`)}function Er({title:e="",prompt:t="",runtimeContext:n=null}={}){const r=String(e||"").trim()||"Custom tool",a=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.
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
- Do not use external dependencies, CDNs, remote fonts, build steps, imports or backend calls.

Priority order:
1. JSON validity and single-file module constraints.
2. Security and host runtime rules.
3. TemplateTool API and real-data rules.
4. User request.
5. Visual style guidance.

Generation contract:
- Read the user request literally and implement only that workflow.
- Do not add unrelated dashboards, tabs, settings, history, import/export, theme switches, fake navigation, sample records, analytics, onboarding, help copy or extra panels unless the user explicitly requested them or they are required for the requested action.
- Every visible control must map to a requested user action, a required validation step or a TemplateTool API operation.
- If the request is vague, build the smallest useful module for the named task and show missing requirements inside the module instead of inventing behavior.
- Use real app context and API responses only. Do not prefill fake topics, templates, clients, IDs or example data.
- Keep all user-facing copy short and operational.

Module API reference:
${sn()}

Current variable inventory:
${Ln(n)}

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
- Avoid eval, Function constructors, inline remote scripts and hidden network calls.

Before returning, verify silently:
- The whole answer is exactly one JSON object with only an html string field.
- The html string contains a complete document from <!doctype html> to </html>.
- The module uses TemplateTool APIs for app data and copy actions.
- The module does not invent customer data or unsupported variables.
- The interface is compact, responsive and specific to the requested job.

Tool name: ${r}

User request:
${a}`}const Xe="salt-templater-alo-autofill",On=1,R=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function S(e){return e==null?"":String(e).trim()}function T(e){for(const t of e){const n=S(t);if(n)return n}return""}function Dn(e){const t=S(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:S(e)}function ne(e){const t=S(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const r=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(r)return`${r[3]}-${r[2]}-${r[1]}`;const a=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return a?`${a[3]}-${a[1].padStart(2,"0")}-${a[2].padStart(2,"0")}`:t}function Y(e){const t=ne(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function Vn(e={}){var t,n,r,a,i,o,s;return T([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activation_date,(a=e==null?void 0:e.client)==null?void 0:a.activation,(i=e==null?void 0:e.client)==null?void 0:i.dateActivation,(o=e==null?void 0:e.contact)==null?void 0:o.activationDate,(s=e==null?void 0:e.healthcheck)==null?void 0:s.activationDate])}function jn(e={}){const t=[e.SignalStatus,e.LedStatus,e.treatmentStep,e.comment].join(" ").toLowerCase();return/(low|bad|rx|tx|performance)/i.test(t)?"lowBadRxTx":"noSignal"}function $n(e={}){const t=S(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function We(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",r=t==="lowBadRxTx"?"Bad signal":"No signal",a=Y(n==="never"?e.activationDate:e.disconnectionDate);return[r,n==="never"?"Never activated":"Signal lost",a].filter(Boolean).join(" - ")}function _r(e={},t={}){var l,d,m,f;const n=T([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(d=e==null?void 0:e.client)==null?void 0:d.externalId,(m=e==null?void 0:e.superOffice)==null?void 0:m.externalTicketId]),r=G(n),a=r.ok?r.fields:{},i=jn(a),o=$n(a),s=ne(Vn(e)),c=ne(T([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt])),u=T([t==null?void 0:t.sourceTicketId,t==null?void 0:t.ticketId,(f=t==null?void 0:t.tokenValues)==null?void 0:f[$],a.soTicket]);return{externalId:n,externalFields:a,aloType:i,signalState:o,extRef:u,disconnectionDate:o==="lost"?c:"",activationDate:s,description:We({aloType:i,signalState:o,disconnectionDate:c,activationDate:s})}}function Qe(e={}){return{firstName:S(e.firstName),lastName:S(e.lastName),email:S(e.email),phoneNumber:T([e.phoneNumber,e.phone])}}function et(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:T([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[$],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:S(e==null?void 0:e.externalTicketId),tokenValues:t}}function Fn(e={},t={},n={},r={}){const a=(e==null?void 0:e.client)||{},i=(e==null?void 0:e.contact)||{},o=(e==null?void 0:e.healthcheck)||{},s=Qe(t),c=et(n),u=T([i.fixedNumber,i.voipNumber,i.voip,i.sip,a.fixedNumber,a.fixedPhone]),l=Dn(T([a.mobile,a.mobileRaw,a.phone,a.telephone,i.mobile,i.phone])),d=T([r.description,r.aloType==="lowBadRxTx"?"Bad signal":"",R.problemDescription]),m=T([r.notes,r.signalState?We(r):"",R.problemNotes]),f=r.signalState==="never"?Y(r.activationDate):Y(r.disconnectionDate);return{externalReference:T([r.extRef,c.ticketId]),socketId:T([o.otoId,o.oto_id,o.oto]),plugNr:T([o.otoPortId,o.otoPort,o.oto_port]),breakoutCable:T([o.breakoutCableId,o.breakoutCable,o.cable]),breakoutFiber:T([o.fiberNumber,o.fiber,o.fibre]),firstName:T([a.firstName,a.firstname,a.givenName]),lastName:T([a.lastName,a.lastname,a.surname,a.familyName]),contactPhone1:T([u,l]),contactPhone2:u&&l&&u!==l?l:"",contactEmail:T([a.email,a.mail,i.email,i.mail]),ispFirstName:s.firstName,ispLastName:s.lastName,ispPhone:s.phoneNumber,ispEmail:s.email,...R,problemDescription:d,problemNotes:m,problemDateTime:f,problemCode3:r.aloType==="lowBadRxTx"?"Performance problem":R.problemCode3}}function zn(e={},t={},n={},r={}){const a=Fn(e,t,n,r),i=Qe(t),o=et(n);return{source:Xe,version:On,fields:a,alo:{type:r.aloType||"noSignal",signalState:r.signalState||"",disconnectionDate:r.disconnectionDate||"",activationDate:r.activationDate||"",problemDateTime:a.problemDateTime,notes:r.notes||""},client:{firstName:a.firstName,lastName:a.lastName,contactPhone1:a.contactPhone1,contactPhone2:a.contactPhone2,email:a.contactEmail},technical:{socketId:a.socketId,plugNr:a.plugNr,breakoutCable:a.breakoutCable,breakoutFiber:a.breakoutFiber},agent:i,superOffice:o}}function Lr(e={},t={},n={},r={}){return JSON.stringify(zn(e,t,n,r),null,2)}function Bn(e){function t(l){return l==null?"":String(l).trim()}function n(l){for(var d=0;d<l.length;d+=1){var m=t(l[d]);if(m)return m}return""}function r(l){return t(l).replace(/[&<>"']/g,function(m){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}function a(l,d,m){var f=document.getElementById("saltAloFillOverlay");f&&f.remove();var b=document.createElement("div");b.id="saltAloFillOverlay",b.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(m==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",b.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+r(l)+"</strong><span style='color:#d8d8df'>"+r(d)+"</span>",document.body.appendChild(b),m!=="error"&&setTimeout(function(){try{b.remove()}catch{}},4500)}function i(l,d,m){var f=l&&l.fields||{};return n([f[d]].concat(m||[]))}function o(l,d){var m=String(d).replace(/["\\]/g,"\\$&");return document.querySelector("["+l+'="'+m+'"]')}function s(l){return document.getElementById(l)||o("name",l)||o("formcontrolname",l)||o("data-testid",l)}function c(l,d,m){var f=m?String(d??""):t(d);if(!m&&!f)return!1;var b=s(l);if(!b)return!1;if(b.tagName==="SELECT")for(var y=t(f).toLowerCase(),v=0;v<b.options.length;v+=1){var h=b.options[v];if(t(h.value).toLowerCase()===y||t(h.textContent).toLowerCase()===y){b.value=h.value;break}}else"value"in b?b.value=f:b.textContent=f;return b.dispatchEvent(new Event("input",{bubbles:!0})),b.dispatchEvent(new Event("change",{bubbles:!0})),!0}function u(l){if(!l||typeof l!="object"||Array.isArray(l)){a("ALO fill","ALO fill data invalid.","error");return}if(l.source&&l.source!==e){a("ALO fill","Clipboard does not contain ALO fill data from Salt Templater.","error");return}var d=l.client||{},m=l.technical||l.healthcheck||{},f=l.agent||{},b=l.superOffice||{},y=b.tokenValues||l.tokenValues||{},v=0;function h(ut,dt,mt){c(ut,dt,mt)&&(v+=1)}if(h("ticket.extRef",i(l,"externalReference",[b.sourceTicketId,b.ticketId,l.ticketId,y["{so_ticket_num}"]])),h("ticket.socketId",i(l,"socketId",[m.socketId,m.otoId,m.oto_id,m.oto])),h("ticket.plugNr",i(l,"plugNr",[m.plugNr,m.otoPortId,m.otoPort,m.oto_port])),h("ticket.breakoutCable",i(l,"breakoutCable",[m.breakoutCable,m.breakoutCableId,m.cable])),h("ticket.breakoutFiber",i(l,"breakoutFiber",[m.breakoutFiber,m.fiberNumber,m.fiber,m.fibre])),h("ticket.otoAddress.firstName",i(l,"firstName",[d.firstName,d.firstname,d.givenName])),h("ticket.otoAddress.lastName",i(l,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),h("ticket.contactPersonFirstName",i(l,"firstName",[d.firstName,d.firstname,d.givenName])),h("ticket.contactPersonLastName",i(l,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),h("ticket.contactPersonPhone1",i(l,"contactPhone1",[d.contactPhone1,d.fixedNumber,d.mobileRaw,d.mobile,d.phone])),h("ticket.contactPersonPhone2",i(l,"contactPhone2",[d.contactPhone2])),h("ticket.contactPersonMail",i(l,"contactEmail",[d.email,d.mail])),h("ticket.contactPersonIspFirstName",i(l,"ispFirstName",[f.firstName])),h("ticket.contactPersonIspLastName",i(l,"ispLastName",[f.lastName])),h("ticket.contactPersonIspPhone",i(l,"ispPhone",[f.phoneNumber,f.phone])),h("ticket.contactPersonIspMail",i(l,"ispEmail",[f.email])),h("ticket.problemDescription",i(l,"problemDescription",["No signal"])),h("ticket.problemNotes",i(l,"problemNotes",[""]),!0),h("ticket.problemDateTime",i(l,"problemDateTime",[l.alo&&l.alo.problemDateTime])),h("ticket.problemCode1",i(l,"problemCode1",["400"])),h("ticket.problemCode2",i(l,"problemCode2",["800"])),h("ticket.problemCode3",i(l,"problemCode3",["900"])),!v){a("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}a("ALO fill","Fields populated: "+v,"success")}if(a("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){a("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(d){if(!t(d)){a("ALO fill","Clipboard empty. Click ALO fill in Salt Templater first.","error");return}var m;try{m=JSON.parse(d)}catch{a("ALO fill","Clipboard does not contain valid ALO data.","error");return}u(m)}).catch(function(d){a("ALO fill","Clipboard error: "+(d&&d.message?d.message:d),"error")})}function Or(){const e=JSON.stringify(Xe);return`javascript:(${Bn.toString()})(${e});`}const Mn=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),Rn=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function K(e,t){return!!(e!=null&&e[t])}function Kn(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function tt(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Un(e,t){return K(e,"ctrlKey")===!!t.ctrlKey&&K(e,"altKey")===!!t.altKey&&K(e,"shiftKey")===!!t.shiftKey&&K(e,"metaKey")===!!t.metaKey}function Pn(e,t){return Un(e,t)&&(Kn(e==null?void 0:e.key,t.key)||tt(e==null?void 0:e.code,t.code))}function Dr(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function qn(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(Rn))}function Jn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||qn(e==null?void 0:e.target))}function Vr(e){if(Jn(e))return null;const t=Mn.find(n=>Pn(e,n))||null;return!t||e!=null&&e.isComposing&&!tt(e==null?void 0:e.code,t.code)?null:t}const Yn="case-profile-beta-1",nt=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["providerOrderRef","Provider order ref"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),Te=Object.freeze(Object.fromEntries(nt)),rt=Object.freeze(nt.map(([e])=>e)),Hn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),re=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),at=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function k(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function x(...e){for(const t of e){const n=k(t);if(n!=="")return n}return""}function _(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Gn(e=""){const t=_(e);return t?t.replace(/_([a-z0-9])/g,(n,r)=>r.toUpperCase()):""}function ye(e=""){const t=Gn(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Se(e=""){const t=_(e);return t?`{${t}}`:""}function L(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function Zn(){const e={};return rt.forEach(t=>{e[t]=""}),{version:Yn,fields:e,fieldLabels:{...Te},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function ot(e){return k(e)!==""}function w(e,t,n,{overwrite:r=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const a=k(n);return a===""||!r&&ot(e.fields[t])?!1:(e.fields[t]=a,e[t]=a,!0)}function ke(e,t,n,{overwrite:r=!1,label:a=""}={}){const i=ye(t),o=k(n);return!i||o===""||at.has(i)||!r&&Object.prototype.hasOwnProperty.call(e.dynamic,i)?!1:(e.dynamic[i]=o,a&&!e.fieldLabels[i]&&(e.fieldLabels[i]=a),!0)}function Xn(e,t,n,r={}){const a=_(Z(t)||t),i=re[a]||re[_(t)]||ye(t);return Object.prototype.hasOwnProperty.call(e.fields,i)?w(e,i,n,r):ke(e,t,n,r)}function Wn(e,t={},n={}){Object.entries(t).forEach(([r,a])=>w(e,r,a,n))}function ae(e,t=[],n=[]){return Array.isArray(e)?(e.forEach((r,a)=>{t.push(String(a+1)),ae(r,t,n),t.pop()}),n):e&&typeof e=="object"?(Object.keys(e).forEach(r=>{t.push(r),ae(e[r],t,n),t.pop()}),n):(n.push({path:t.slice(),value:k(e)}),n)}function Qn(e=[]){return e[0]===se||e[0]===le}function it(e,t,{prefix:n="",skipInternalClientKeys:r=!1}={}){!t||typeof t!="object"||ae(t).filter(a=>a.value!=="").filter(a=>!r||!Qn(a.path)).forEach(a=>{const i=n?[n,...a.path]:a.path;ke(e,i.join("_"),a.value,{label:i.map(L).join(" ")})})}function Ae(e=[],t=[]){const n=new Map;return[...e,...t].forEach(r=>{if(!r||typeof r!="object")return;const a=`${k(r.url)}|${k(r.name)}|${k(r.id)}`;a.replace(/\|/g,"")&&(n.has(a)||n.set(a,r))}),Array.from(n.values())}function ve(e){const t=k(e);if(!t)return null;const n=G(t);return n.ok?{externalId:t,fields:n.fields}:null}function st(e,t){var n,r,a,i;t&&(w(e,"externalId",t.externalId),Object.entries(Hn).forEach(([o,s])=>{var c;w(e,s,(c=t.fields)==null?void 0:c[o])}),w(e,"contractorNumber",(n=t.fields)==null?void 0:n.customer),w(e,"lexId",(r=t.fields)==null?void 0:r.lexId),w(e,"oltName",(a=t.fields)==null?void 0:a.oltName),w(e,"oltBoard",(i=t.fields)==null?void 0:i.oltBoard))}function er(e,t){var s;if(!t||typeof t!="object")return;const n=t.client||{},r=t.contact||{},a=t.healthcheck||{},i=a.crossConnexion||a.crossConnection||{},o=[n.firstName,n.lastName].map(k).filter(Boolean).join(" ");Wn(e,{clientName:o||x(n.fullName,n.name,n.customerName),title:n.title,firstName:n.firstName,lastName:n.lastName,contractorNumber:x(n.contractorNumber,n.contractor,a.customerId),mobile:x(n.mobile,n.phone,n.telephone),mobileRaw:n.mobileRaw,phone:x(n.phone,n.telephone,r.fixedNumber),email:n.email,address:n.address,communicationLanguage:x(n.communicationLanguage,r.communicationLanguage,n.language,r.language),activationDate:x(n.activationDate,n.activation_date,n.activation,n.dateActivation,(s=t.offer)==null?void 0:s.activationDate,r.activationDate,a.activationDate),eligibilitySource:x(n.eligibilitySource,r.eligibilitySource),contactRecordId:x(n.contactRecordId,r.contactRecordId),fixedNumber:r.fixedNumber,publicId:r.publicId,providerOrderRef:r.providerOrderRef,fllRecordId:a.fllRecordId,otoId:x(a.otoId,a.oto_id,a.oto),otoPortId:x(a.otoPortId,a.otoPort,a.oto_port,i.Port),routerSerialNumber:a.routerSerialNumber,oldRouterSerialNumber:a.oldRouterSerialNumber,lexId:a.lexId,oltName:a.oltName,oltBoard:a.oltBoard,ponPort:a.ponPort,breakoutCableId:a.breakoutCableId,fiberNumber:a.fiberNumber,lineState:a.lineState,routerStatus:a.routerStatus,odfId:a.odfId,option82:a.option82,oltObject:a.oltObject,ontConfigurationFilename:a.ontConfigurationFilename,svlan:a.svlan,customerId:a.customerId,crossConnectionEquipment:i.Equipment,crossConnectionRack:i.Rack,crossConnectionSlot:i.Slot,crossConnectionPort:i.Port}),st(e,ve(t[le])),it(e,t,{skipInternalClientKeys:!0})}function tr(e,t){var a;if(!t||typeof t!="object")return;w(e,"soTicketNum",x(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(a=t.tokenValues)==null?void 0:a[$])),w(e,"ticketCreatedAt",x(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),st(e,ve(t.externalTicketId)),lt(e,t.tokenValues);const n=X(t.attachments),r=z(n);e.attachments=Ae(e.attachments,n),e.photos=Ae(e.photos,r),it(e,t,{prefix:"ticket"})}function lt(e,t={},n={}){!t||typeof t!="object"||Object.entries(t).forEach(([r,a])=>{const i=k(a);if(i==="")return;const o=Z(r),s=ft(o)||_(r),c=re[s];c&&w(e,c,i,n),s==="external_customer"&&w(e,"contractorNumber",i,n),s==="external_lex_id"&&w(e,"lexId",i,n),s==="external_olt_name"&&w(e,"oltName",i,n),s==="external_olt_board"&&w(e,"oltBoard",i,n),ke(e,s,i,{...n,label:L(s)})})}function nr(e,t){const n=t==null?void 0:t[se];!n||typeof n!="object"||Array.isArray(n)||Object.entries(n).forEach(([r,a])=>{Xn(e,r,a,{overwrite:!0,label:L(r)})})}function Ce(e,t,n){const r=ye(t),a=k(n);!r||a===""||at.has(r)||Object.prototype.hasOwnProperty.call(e,r)||(e[r]=a)}function rr(e,t={}){const n={},r={},a=[];rt.forEach(s=>{const c=k(e.fields[s]);if(c==="")return;Ce(n,s,c);const u=Se(s);u&&(r[u]=c),a.push({key:s,label:Te[s]||L(s),value:c})}),Object.entries(e.dynamic).forEach(([s,c])=>{const u=k(c);if(u==="")return;Ce(n,s,u);const l=Se(s);l&&!Object.prototype.hasOwnProperty.call(r,l)&&(r[l]=u),e.fields[s]||a.push({key:s,label:e.fieldLabels[s]||L(s),value:u})});const i=ve(e.externalId);i&&Object.assign(r,oe(i.fields)),ot(e.soTicketNum)&&(r[$]=e.soTicketNum);const o={};return Object.entries(t||{}).forEach(([s,c])=>{const u=Z(s)||s;o[u]=c}),e.vars=n,e.variables=n,e.tokenValues={...o,...r},e.availableFields=a,e}function jr({clientPayload:e=null,superOfficePayload:t=null,tokenValues:n={}}={}){const r=Zn();return er(r,e),tr(r,t),lt(r,n),nr(r,e),rr(r,n)}function p(e,t,n=""){var a;const r=k((e==null?void 0:e[t])??((a=e==null?void 0:e.fields)==null?void 0:a[t]));return r?{label:n||Te[t]||L(t),value:r}:null}function A(e,t){const n=k(t);return n?{label:e,value:n}:null}function ct(e=[]){const t=new Set;return e.filter(Boolean).filter(n=>{const r=`${_(n.label)}:${n.value}`;return t.has(r)?!1:(t.add(r),!0)})}function U(e,t,n=[]){const r=ct(n);return r.length>0?{id:e,title:t,fields:r}:null}function $r(e=null){return!e||typeof e!="object"?[]:ct([A("Name",e.clientName),A("Mobile",x(e.mobile,e.mobileRaw,e.phone)),A("Contractor",x(e.contractorNumber,e.externalCustomer,e.customerId)),A("Activation",e.activationDate),A("OTO ID",e.otoId),A("Port",x(e.otoPortId,e.crossConnectionPort)),A("SO ticket",e.soTicketNum)])}function Fr(e=null){return!e||typeof e!="object"?[]:[U("caseClient","Client",[p(e,"clientName","Full name"),p(e,"contractorNumber","Contractor"),p(e,"title"),p(e,"firstName"),p(e,"lastName"),p(e,"mobile"),p(e,"mobileRaw","Mobile raw"),p(e,"phone"),p(e,"email"),p(e,"address"),p(e,"communicationLanguage","Language"),p(e,"activationDate","Activation date")]),U("caseSuperOffice","SuperOffice",[p(e,"soTicketNum","SO ticket"),p(e,"ticketCreatedAt","Created at"),p(e,"externalId","External ID"),p(e,"externalPartner","Partner"),p(e,"externalPartnerTicketNumber","Partner ticket")]),U("caseExternalId","External ID fields",[p(e,"externalFlagging","Flagging"),p(e,"externalDate","Date"),p(e,"externalCustomer","Contractor"),p(e,"externalSignalStatus","Signal"),p(e,"externalLedStatus","LED"),p(e,"externalTreatmentStep","Treatment"),p(e,"externalBoxType","Box"),p(e,"externalLexId","LEX ID"),p(e,"externalOltName","OLT"),p(e,"externalOltBoard","Board"),p(e,"externalBokBof","BOK/BOF"),p(e,"externalComment","Comment")]),U("caseTechnical","Technical",[p(e,"fllRecordId","FLL record"),p(e,"otoId","OTO ID"),p(e,"otoPortId","OTO port"),p(e,"routerSerialNumber","Router serial"),p(e,"oldRouterSerialNumber","Old router serial"),p(e,"lexId","LEX ID"),p(e,"oltName","OLT"),p(e,"oltBoard","OLT board"),p(e,"ponPort","PON port"),p(e,"breakoutCableId","Breakout cable"),p(e,"fiberNumber","Fiber number"),p(e,"lineState","Line state"),p(e,"routerStatus","Router status"),p(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{Vr as A,We as B,dr as C,Or as D,xr as E,Be as F,ze as G,Kt as H,Dr as I,Er as J,Mn as K,Cr as L,Pt as M,mr as P,zt as S,C as T,$e as a,yr as b,kr as c,vr as d,Yt as e,Sr as f,pe as g,Ar as h,Ir as i,Nr as j,z as k,br as l,pr as m,cr as n,ur as o,fr as p,jr as q,wr as r,gr as s,Fr as t,$r as u,Rt as v,hr as w,_r as x,Lr as y,Tr as z};
