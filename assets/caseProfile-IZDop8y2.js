import{c as H}from"./createLucideIcon-DBTomhl2.js";import{p as Y,b as oe,S as G,L as Z,H as _e,o as ie,w as dt,F as Oe,T as Le,W as se,X as le,Y as mt}from"./tokenService-BvemiXFj.js";import{l as pt,s as ft}from"./index-tmkp-tK1.js";import{l as $,s as ce,d as bt}from"./templateTreeService-CS5oSlPm.js";import{f as De,u as Ve}from"./templateTreeOperations-B-GzzA8y.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],da=H("chevron-left",ht);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],ma=H("chevron-right",gt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]],pa=H("clipboard-copy",Tt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],fa=H("puzzle",yt),kt=/\.(jpe?g|png|webp|gif|bmp|avif)(?:$|[?#])/i,vt=/\.pdf(?:$|[?#])/i,xt=["{contractor}","{contractor_number}","{client_contractor_number}"];function g(...e){for(const t of e){const n=String(t??"").trim();if(n)return n}return""}function wt(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function It(e="",t=""){const n=`${e} ${t}`;return kt.test(n)?"image":vt.test(n)?"pdf":"file"}function Nt(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function St(e={}){var t,n,a;return g(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(n=e.message)==null?void 0:n.createdAt,(a=e.message)==null?void 0:a.sentAt)||null}function D(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function At(e,t){var s,c,u,l,d;if(!e||typeof e!="object"||Array.isArray(e))return null;const n=g(e.url,e.href,e.src,e.downloadUrl);if(!n)return null;const a=g(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((s=String(n).split("/").pop())==null?void 0:s.split("?")[0])||""))||`Attachment ${t+1}`,r=g(e.type,e.contentType,e.mimeType),i=Nt(r)?"image":It(a,n),o=g(e.messageId,e.messageID,e.postId,(c=e.message)==null?void 0:c.id)||null;return{id:g(e.id,e.attachmentId,e.documentId)||`${t}-${a}-${n}`,name:a,url:n,type:i,size:g(e.size,e.sizeText,e.fileSize)||null,messageId:o,postId:g(e.postId,o)||null,messageIndex:D(g(e.messageIndex,e.messageOrder,e.postIndex,(u=e.message)==null?void 0:u.index)),attachmentIndex:D(g(e.attachmentIndex,e.fileIndex)),messageAuthor:g(e.messageAuthor,e.author,e.createdBy,(l=e.message)==null?void 0:l.author,(d=e.message)==null?void 0:d.createdBy)||null,source:g(e.source,e.origin)||null,date:St(e)}}function xe(e){return String(e).padStart(2,"0")}function Ct(e){const t=e.getFullYear(),n=xe(e.getMonth()+1),a=xe(e.getDate());return{dateKey:`${t}-${n}-${a}`,label:`${a}.${n}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function we(e,t,n,a=0,r=0,i=0){if(t<0||t>11||n<1||n>31||a<0||a>23||r<0||r>59||i<0||i>59)return null;const o=new Date(e,t,n,a,r,i);return o.getFullYear()!==e||o.getMonth()!==t||o.getDate()!==n?null:o}function Et(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const i=new Date(e);return Number.isNaN(i.getTime())?null:i}const t=String(e).trim();if(!t)return null;const n=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const i=we(Number(n[1]),Number(n[2])-1,Number(n[3]),Number(n[4]||0),Number(n[5]||0),Number(n[6]||0));if(i)return i}const a=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(a){const i=Number(a[1]),o=a[2],s=Number(a[3]),c=Number(a[4]),u=c<100?2e3+c:c,l=Number(a[5]||0),d=Number(a[6]||0),m=Number(a[7]||0),h=o==="/"&&s>12&&i<=12,b=h?s:i,f=(h?i:s)-1,x=we(u,f,b,l,d,m);if(x)return x}const r=new Date(t);return Number.isNaN(r.getTime())?null:r}function ue(e={}){const t=Et(e.date);return t?Ct(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function _t(e,t){const n=g(t);n&&xt.forEach(a=>{e[a]=n})}function Ie(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function Ot(e,t,n){const a=Z(t),r=g(n);!a||!r||e.push([a,r])}function je(e,t=[]){const n=[];return Ie(e)&&Object.entries(e).forEach(([a,r])=>{if(Ie(r)){n.push(...je(r,[...t,a]));return}Ot(n,[...t,a].join("."),r)}),n}function Lt(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(n=>{je(e[n]).forEach(([a,r])=>{t[a]=r})}),t}function W(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(At).filter(Boolean).filter(n=>{const a=`${n.name}|${n.url}`;return t.has(a)?!1:(t.add(a),!0)})}function F(e=[]){return W(e).filter(t=>t.type==="image")}function Dt(e=[]){const t=new Map;return F(e).forEach((n,a)=>{const r=ue(n);t.has(r.dateKey)||t.set(r.dateKey,{...r,attachments:[]}),t.get(r.dateKey).attachments.push({...n,galleryIndex:a})}),Array.from(t.values()).sort((n,a)=>a.sortValue-n.sortValue)}function Ne(e={}){var t;return g(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function Vt(e={},t=0){const n=D(e.messageNumber),a=D(e.messageIndex);return`Post ${n||(a===null?t+1:a+1)}`}function jt(e={}){const t=ue(e),n=g(e.messageAuthor);return t.dateKey==="unknown"?n:[t.label,n].filter(Boolean).join(" · ")}function ba(e=[]){const t=F(e);if(!t.some(a=>Ne(a)))return Dt(t);const n=new Map;return t.forEach((a,r)=>{const i=Ne(a),o=ue(a),s=i||`unassigned:${o.dateKey}`;if(!n.has(s)){const c=n.size;n.set(s,{dateKey:s,label:i?Vt(a,c):o.label,metaLabel:i?jt(a):"",sortValue:D(a.messageIndex)??r,attachments:[]})}n.get(s).attachments.push({...a,galleryIndex:r})}),Array.from(n.values()).sort((a,r)=>a.sortValue-r.sortValue)}function ha(e){var h,b;const t=wt(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const n=g(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),a=g(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),r=g(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),i=g(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(h=t.client)==null?void 0:h.contractorNumber,(b=t.client)==null?void 0:b.contractor),o={};let s=null,c=!1;const u=W(t.attachments),l=F(u);if(r){const f=Y(r);f.ok&&(c=!0,s=f.fields,Object.assign(o,oe(f.fields)))}Object.assign(o,Lt(t));const d=(s==null?void 0:s.customer)||i;d&&(c||n||u.length>0)&&_t(o,d);const m=n||(s==null?void 0:s.soTicket)||"";return m&&(o[G]=m),Object.keys(o).length===0&&u.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:c,externalTicketId:r}:{ok:!0,ticketId:m,sourceTicketId:n,createdAt:a,externalTicketId:r,contractorNumber:d,externalIdValid:c,externalFields:s,tokenValues:o,attachments:u,imageAttachments:l,ignoredExternalId:!!(r&&!c)}}const de="super_office_ticket_payload",me="pending_super_office_ticket_payload",$t="super-office-ticket-updated";function Ft(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[se]:t,[le]:n,...a}=e;return a}function ee(e){return Array.isArray(e)?`[${e.map(ee).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${ee(e[t])}`).join(",")}}`:JSON.stringify(e)}function pe(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return ee(Ft(e))}catch{return""}}function V(e){typeof window>"u"||window.dispatchEvent(new CustomEvent($t,{detail:{payload:e}}))}function X(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=W(e.attachments),n=String(e.clientSignature||"").trim(),a=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([r,i])=>[r,i==null?"":String(i)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:n,tokenValues:a,attachments:t,imageAttachments:F(t)}}function zt(e,t=new Date,n=""){return X({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:n,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function fe(e){e&&await Le(de,e)}async function $e(e){e&&await Le(me,e)}async function Q(){try{return X(await _e(me,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function ga(){return Q()}async function Mt(){return await Fe()||await Q()}async function Ta(){return!!await Mt()}function be(){return Oe(me)}async function ya(e){const t=await ie(),n=zt(e,new Date,pe(t));return n?n.clientSignature?(await fe(n),await be(),V(n),n):(await K(),await $e(n),V(null),n):null}async function ka(e){const t=dt(e);if(!t)return null;const n=await Fe(),a=n?null:await Q(),r=n||a;if(!r)return null;const i=Y(t),o=i.ok?{...r.tokenValues||{},...oe(i.fields)}:r.tokenValues||{},s=X({...r,externalTicketId:t,tokenValues:o});return s?(s.clientSignature?await fe(s):await $e(s),V(s),s):null}function K(){return Oe(de)}async function va(){const e=await Q(),t=pe(await ie());if(!e||!t)return null;const n={...e,clientSignature:t};return await fe(n),await be(),V(n),n}async function Fe(){try{const e=await _e(de,null);if(!e)return null;const t=pe(await ie());if(!t)return await K(),null;if((e==null?void 0:e.clientSignature)!==t)return await K(),null;const n=X(e);return n||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function xa(){await K(),await be(),V(null)}const ze="quick_tools",Rt="blue",A=Object.freeze({LINK:"link",MODULE:"module"}),Bt=A.LINK,Pt=[{value:"blue",label:"Blue"},{value:"cyan",label:"Cyan"},{value:"emerald",label:"Green"},{value:"amber",label:"Amber"},{value:"rose",label:"Rose"},{value:"violet",label:"Violet"},{value:"slate",label:"Slate"}],Ut=new Set(Pt.map(e=>e.value)),Kt=new Set(Object.values(A));function qt(e){return Ut.has(e)?e:Rt}function Me(e){return Kt.has(e)?e:Bt}function Jt(e){const t=Number(e);return Number.isFinite(t)?t:void 0}function Re(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.type||(e.html?A.MODULE:A.LINK),n=Me(t);return{...e,type:n,title:String(e.title||"").trim(),url:n===A.LINK?String(e.url||"").trim():"",description:String(e.description||"").trim(),prompt:String(e.prompt||""),html:String(e.html||""),color:qt(e.color),order:Jt(e.order),beta:n===A.MODULE?!0:!!e.beta}}async function wa(){const e=await pt(ze,[]);return Array.isArray(e)?e.map(Re).filter(Boolean):[]}async function Ia(e){const t=Array.isArray(e)?e.map(Re).filter(Boolean):[];return ft(ze,t)}function Ht(e=""){return Array.from(new Set(String(e||"").match(/\{[^}]+\}/g)||[]))}function Be(e){return e==null||e===""?"":String(e).replace(/<[^>]+>/g,"").trim()}function Na(e,t={}){return Ht(e).every(n=>Be(t[n])!=="")}function Sa(e,t={}){return(e||"").replace(/\{[^}]+\}/g,n=>{const a=Be(t[n]);return a?encodeURIComponent(a):n})}function Aa(e){return Me(e==null?void 0:e.type)===A.MODULE}const Yt=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function he(e){return e==null?e:JSON.parse(JSON.stringify(e))}function L(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function C(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function Pe(e=[]){return new Map(e.map(t=>[t.id,t]))}function Ue(e,t){if(!e)return"";const n=[],a=new Set;let r=e;for(;r&&!a.has(r.id);)a.add(r.id),n.unshift(r.title||r.id),r=r.parentId?t.get(r.parentId):null;return n.join(" / ")}function Gt(e=[]){const t=Pe(e);return e.map(n=>({...n,path:Ue(n,t)}))}function Ke(e=[],t){const n=String(t||"").trim();if(!n)return null;const a=Pe(e);if(a.has(n))return a.get(n);const r=C(n);return e.find(i=>C(i.title)===r||C(Ue(i,a))===r)||null}function Zt(e=[],t={}){return Ke(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function Wt(e=[],t={}){return Ke(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function Xt(e,t={},n=null){const a=L(t.templateIds||t.templateId).map(String).filter(Boolean);if(a.length>0&&!a.includes(e.id)||n&&!(e.nodeIds||[]).includes(n.id))return!1;const r=L(t.channels||t.channel).map(s=>String(s||"").trim()).filter(Boolean);if(r.length>0&&!r.some(s=>(e.channels||[]).includes(s)))return!1;const i=String(t.title||t.templateTitle||"").trim();if(i&&C(e.title)!==C(i))return!1;const o=L(t.titleIncludes||t.templateTitleIncludes).map(C).filter(Boolean);if(o.length>0){const s=C(e.title);if(!o.some(c=>s.includes(c)))return!1}return!0}function Qt({template:e,sourceNode:t,targetNode:n,reason:a=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:n.id,targetNodeTitle:n.title||"",reason:a}}function qe({nodes:e=[],templates:t=[]}={}){return{nodes:Gt(e),templates:he(t),counts:{nodes:e.length,templates:t.length}}}function Je(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([n,a])=>{Yt.has(n)&&(t[n]=a)}),t}async function He(){return qe(await $())}async function en(){return He()}async function tn(e=[]){const t=L(e),{nodes:n,templates:a}=await $(),r=[],i=[];return t.forEach((o,s)=>{if(!o||typeof o!="object"||Array.isArray(o)){i.push({ruleIndex:s,reason:"Rule must be an object."});return}const c=Wt(n,o);if(!c){i.push({ruleIndex:s,reason:"Target topic was not found."});return}const u=Zt(n,o),l=a.filter(d=>Xt(d,o,u));if(l.length===0){i.push({ruleIndex:s,reason:"No templates matched this rule."});return}l.forEach(d=>{(d.nodeIds||[])[0]===c.id&&(!u||u.id===c.id)||r.push(Qt({template:d,sourceNode:u,targetNode:c,reason:o.reason||`Rule ${s+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:r.length,affectedTemplateCount:new Set(r.map(o=>o.templateId)).size,operations:r,skipped:i}}async function nn(e=[]){const t=L(e),n=await $();let a=n.nodes,r=n.templates;const i=[],o=[];return t.forEach((s,c)=>{var l;const u=(s==null?void 0:s.action)||(s==null?void 0:s.type);if(!s||typeof s!="object"||Array.isArray(s)){o.push({operationIndex:c,reason:"Operation must be an object."});return}if(u==="moveTemplate"){const d=String(s.templateId||""),m=String(s.targetNodeId||s.toNodeId||"");if(!d||!m){o.push({operationIndex:c,reason:"moveTemplate requires templateId and targetNodeId."});return}const h=r.find(x=>x.id===d),b=s.sourceNodeId||((l=h==null?void 0:h.nodeIds)==null?void 0:l[0])||null,f=JSON.stringify(r);r=De(r,d,b,m,Number(s.targetIndex),a),JSON.stringify(r)!==f&&i.push({operationIndex:c,action:u,templateId:d,targetNodeId:m});return}if(u==="updateTemplate"){const d=String(s.templateId||"");if(!d){o.push({operationIndex:c,reason:"updateTemplate requires templateId."});return}const m=Je(s.patch||s.fields||{}),h=JSON.stringify(r);r=Ve(r,d,m),JSON.stringify(r)!==h&&i.push({operationIndex:c,action:u,templateId:d});return}o.push({operationIndex:c,reason:`Unsupported operation: ${u||"unknown"}.`})}),i.length>0&&await ce({nodes:a,templates:r}),{ok:!0,appliedCount:i.length,skippedCount:o.length,applied:i,skipped:o,tree:qe({nodes:a,templates:r})}}async function an(e,t={}){const n=String(e||"");if(!n)throw new Error("templateId is required.");const a=await $();if(!a.templates.some(i=>i.id===n))throw new Error("Template was not found.");const r=Ve(a.templates,n,Je(t));return await ce({nodes:a.nodes,templates:r}),{ok:!0,template:he(r.find(i=>i.id===n))}}async function rn(e,t,n={}){var u;const a=String(e||""),r=String(t||"");if(!a||!r)throw new Error("templateId and targetNodeId are required.");const i=await $();if(!i.templates.some(l=>l.id===a))throw new Error("Template was not found.");const o=i.templates.find(l=>l.id===a),s=(n==null?void 0:n.sourceNodeId)||((u=o==null?void 0:o.nodeIds)==null?void 0:u[0])||null,c=De(i.templates,a,s,r,Number(n==null?void 0:n.targetIndex),i.nodes);return await ce({nodes:i.nodes,templates:c}),{ok:!0,template:he(bt(c.find(l=>l.id===a)))}}async function Ca(e,t={}){switch(e){case"tool:templates:list":return He();case"tool:templates:get-tree":return en();case"tool:templates:preview-migration":return tn(t.rules||t);case"tool:templates:apply-migration":return nn(t.operations||t);case"tool:templates:update-template":return an(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return rn(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const q="template-tool-module-beta-2",Ye=Object.freeze({name:"Template Generator Module API",version:q,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",containers:{"context.profile / TemplateProfile":"Normalized customer and case profile with common scalar fields, tokenValues, vars, photos and attachments.","context.variables / TemplateVars":"Variable-friendly aliases generated from profile fields, tokens and visible client fields. This is the preferred object for JavaScript property access.","TemplateVars.byToken":"Exact token lookup keyed by brace tokens such as {client_first_name}. Includes known tokens even when the current value is empty.","TemplateVars.byKey":"Lookup keyed by structured token keys such as client.firstName or contractorNumber.","TemplateVars.byLabel":"Lookup keyed by user-facing field labels from the app.","TemplateVars.available":"Discovery list for every exposed variable with names, token, key, label, value, source, inputType and internal.","TemplateVars.availableTokens":"Subset of TemplateVars.available that comes from token definitions.","TemplateVars.availableFields":"Visible normalized field list with aliases for customer-facing selectors.","context.tokens":"All configured token definitions, including manual/internal tokens and empty values.","context.fields / TemplateFields":"Best normalized list for user-facing customer, case and profile fields.","context.fieldIndex":"Normalized lookup map for labels, tokens, keys and aliases with punctuation/accent/braces removed.","context.client":"Raw imported VTI/customer payload. Use only when the module needs structured nested source data.","context.clientInfo":"Visible client detail sections used by the app UI.","context.clientSummary":"Compact client bar fields currently selected in the app."},examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']","TemplateVars.available.map((entry) => entry.name)"],reservedContainers:["env","raw","byToken","byKey","byLabel","available","availableTokens","availableFields"]},dataAccess:{appDatabase:"Authorized only through TemplateTool APIs. TemplateTool.templates reads and writes the app's IndexedDB-backed topic/template data through host services.",internet:"Public Internet API/database access is authorized for explicit user-requested public HTTP(S) read requests. Prefer TemplateTool.fetchJson(url) or TemplateTool.fetchText(url) for CORS-enabled Internet APIs/databases.",restrictions:"Do not use secrets, cookies, credentials, private/local network URLs, remote scripts, CDNs, remote fonts, eval, parent DOM access, localStorage or raw IndexedDB."},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object with scalar aliases plus available, availableTokens, availableFields, byToken, byKey and byLabel discovery containers",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.fetchJson(url)":"Promise<{ ok, status, url, contentType, data?, text?, error?, truncated? }>","TemplateTool.fetchText(url)":"Promise<{ ok, status, url, contentType, text?, error?, truncated? }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function on(e=Ye){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,a])=>{t.push(`- window.${n}: ${a.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),e.variables.containers&&typeof e.variables.containers=="object"&&(t.push("","Variable containers:"),Object.entries(e.variables.containers).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)})),t.push("","Variable examples:"),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),e.dataAccess&&typeof e.dataAccess=="object"&&(t.push("","Data access:"),Object.entries(e.dataAccess).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)})),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)}),t.join(`
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
    var apiVersion = "${q}";
    var apiReference = ${JSON.stringify(Ye)};
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
</html>`;function un(e=""){var c;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),a=((c=n==null?void 0:n[1])==null?void 0:c.trim())||t,r=a.match(/<!doctype\s+html\b|<html[\s>]/i);if(!r)return a;const i=r.index||0,o=a.slice(i).trim(),s=o.match(/<\/html\s*>/i);return s?o.slice(0,s.index+s[0].length).trim():o}function dn(e=""){const t=un(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:cn}function mn(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function pn(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Ea(e=""){const t=dn(e),n=pn(t,ln,"template-tool-bridge");return mn(n,sn,"template-tool-host-style")}const Se=3e5;function fn(e=""){const t=e.split(".").map(r=>Number(r));if(t.length!==4||t.some(r=>!Number.isInteger(r)||r<0||r>255))return!1;const[n,a]=t;return n===0||n===10||n===127||n===169&&a===254||n===172&&a>=16&&a<=31||n===192&&a===168}function bn(e=""){try{const t=new URL(String(e||"").trim());if(!["http:","https:"].includes(t.protocol))return!1;const n=t.hostname.toLowerCase().replace(/^\[|\]$/g,"");return!(!n||n==="localhost"||n.endsWith(".localhost")||n.endsWith(".local")||n==="::1"||n==="0:0:0:0:0:0:0:1"||fn(n))}catch{return!1}}async function _a({url:e="",responseType:t="json"}={}){const n=String(e||"").trim(),a=t==="json";if(!bn(n))return{ok:!1,status:0,url:n,contentType:"",error:"Only public http/https URLs can be fetched by a module."};try{const r=await fetch(n,{method:"GET",credentials:"omit",cache:"no-store",redirect:"follow",headers:{Accept:a?"application/json, text/plain;q=0.8, */*;q=0.5":"text/plain, application/json;q=0.8, */*;q=0.5"}}),i=r.headers.get("content-type")||"",o=await r.text(),s=o.length>Se,c=s?o.slice(0,Se):o,u={ok:r.ok,status:r.status,url:r.url||n,contentType:i,truncated:s};if(!a)return{...u,text:c};try{return{...u,data:c?JSON.parse(c):null}}catch{return{...u,ok:!1,text:c,error:"The Internet response was not valid JSON."}}}catch(r){return{ok:!1,status:0,url:n,contentType:"",error:(r==null?void 0:r.message)||"Internet request failed."}}}function hn(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const a=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:a??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function N(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function te(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function Ge(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Ze(e=""){const t=Ge(e);return t?t.replace(/_([a-z0-9])/g,(n,a)=>a.toUpperCase()):""}function j(e=""){const t=Ze(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function ge(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function z(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function I(e,t){const n=String(t||"").trim();if(!n)return;z(e,n);const a=Ge(n),r=Ze(n);a&&(z(e,a),z(e,`{${a}}`)),r&&z(e,r)}function We({label:e="",token:t="",key:n="",aliases:a=[],section:r=""}={}){const i=[];I(i,e),I(i,t),I(i,t.replace(/[{}]/g,"")),I(i,n);const o=ge(n);return o.length>0&&(I(i,o[o.length-1]),I(i,o.join(" ")),I(i,o.join(""))),I(i,r),a.forEach(s=>I(i,s)),i}function gn(e){const t=N(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=We({...e,...n}),n}function Tn({tokens:e=[],clientInfo:t=[],clientSummary:n=[],profile:a=null}={}){const r=[],i=new Set,o=s=>{const c=gn(s);if(!c)return;const u=`${c.source}:${c.label}:${c.value}:${c.token||""}:${c.key||""}`;i.has(u)||(i.add(u),r.push(c))};return e.forEach(s=>{o({label:s.label,value:s.value,token:s.token,key:s.key,aliases:s.aliases,source:"token"})}),n.forEach(s=>{o({label:s.label,value:s.value,section:"summary",source:"clientSummary"})}),t.forEach(s=>{((s==null?void 0:s.fields)||[]).forEach(c=>{o({label:c.label,value:c.value,section:s.title||s.id,source:"clientInfo"})})}),a&&typeof a=="object"&&(Array.isArray(a.availableFields)?a.availableFields:[]).forEach(s=>{o({label:s.label,value:s.value,key:s.key,aliases:s.aliases,source:"profile"})}),r}function yn(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function kn(e,t,n){const a=ge(t);if(a.length<2||n==="")return;let r=e;for(let o=0;o<a.length-1;o+=1){const s=a[o];if(!s||/^\d+$/.test(s)||(r[s]===void 0&&(r[s]={}),!r[s]||typeof r[s]!="object"||Array.isArray(r[s])))return;r=r[s]}const i=a[a.length-1];i&&!Object.prototype.hasOwnProperty.call(r,i)&&(r[i]=n)}function vn(e={},t=[]){const n={...e};return t.forEach(a=>{a.key&&kn(n,a.key,a.value),a.aliases.forEach(r=>yn(n,r,a.value))}),Xe(n,t),n}const xn=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function wn(e,t){const n=te(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(a=>te(a)===n)}function In(e=[],t=[]){for(const n of t){const a=e.find(i=>wn(i,n)),r=N(a==null?void 0:a.value);if(r!=="")return r}return""}function Xe(e,t=[]){xn.forEach(({name:n,candidates:a})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const r=In(t,a);r!==""&&(e[n]=r)})}function Nn({tokens:e=[],fields:t=[],variables:n={}}={}){const a=[],r=new Set,i=o=>{const s=Array.isArray(o.names)?o.names.filter(Boolean):[],c=[o.token||"",o.key||"",o.label||"",o.source||"",s.join("|")].join(":");r.has(c)||(r.add(c),a.push({name:s[0]||o.token||o.key||o.label||"",names:s,token:o.token||"",key:o.key||"",label:o.label||"",value:N(o.value),source:o.source||"context",inputType:o.inputType||"",internal:!!o.internal}))};return e.forEach(o=>{const c=We({label:o.label,token:o.token,key:o.key,aliases:o.aliases}).map(j).filter(Boolean);i({names:[...new Set(c)],token:o.token,key:o.key,label:o.label,value:o.value,source:"token",inputType:o.inputType,internal:o.internal})}),t.forEach(o=>{const c=[o.label,o.token,o.key,...o.aliases||[]].map(j).filter(Boolean);i({names:[...new Set(c)],token:o.token,key:o.key,label:o.label,value:o.value,source:o.source})}),Object.entries(n).forEach(([o,s])=>{!o||s===null||typeof s=="object"||i({names:[o],label:o,value:s,source:"variable"})}),a.sort((o,s)=>o.name.localeCompare(s.name))}function Sn(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(a=>{const r=te(a);!r||t[r]||(t[r]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function U(e,t,n){const a=j(t);!a||n===""||Object.prototype.hasOwnProperty.call(e,a)||(e[a]=n)}function An(e,t,n){const a=ge(t).map(j).filter(Boolean);if(a.length<2||n==="")return;let r=e;for(let o=0;o<a.length-1;o+=1){const s=a[o];if(r[s]===void 0&&(r[s]={}),!r[s]||typeof r[s]!="object"||Array.isArray(r[s]))return;r=r[s]}const i=a[a.length-1];i&&!Object.prototype.hasOwnProperty.call(r,i)&&(r[i]=n)}function Cn(e,t=null){if(!t||typeof t!="object")return;const n=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(n).forEach(([a,r])=>{const i=N(r);i!==""&&U(e,a,i)})}function En({fields:e=[],tokens:t=[],tokenValues:n={},environment:a={},profile:r=null}={}){const i={env:a,raw:n,byToken:{},byKey:{},byLabel:{},available:[],availableTokens:[],availableFields:[]};return t.forEach(o=>{o.token&&(i.byToken[o.token]=N(o.value))}),Object.entries(n||{}).forEach(([o,s])=>{const c=N(s);i.byToken[o]=c,c!==""&&(U(i,o,c),U(i,o.replace(/[{}]/g,""),c))}),Cn(i,r),e.forEach(o=>{const s=N(o.value);s!==""&&(o.token&&(i.byToken[o.token]=s),o.key&&(i.byKey[o.key]=s,An(i,o.key,s)),i.byLabel[o.label]=s,[o.label,o.token,o.key,...o.aliases||[]].forEach(c=>{U(i,c,s)}))}),Xe(i,e),i.available=Nn({tokens:t,fields:e,variables:i}),i.availableTokens=i.available.filter(o=>o.token),i.availableFields=e.map(o=>({name:j(o.key||o.token||o.label),token:o.token||"",key:o.key||"",label:o.label||"",value:o.value,source:o.source||"context",aliases:o.aliases||[]})),i}function Oa({tool:e={},values:t={},tokens:n=[],client:a=null,clientInfo:r=[],clientSummary:i=[],profile:o=null}={}){const s=t&&typeof t=="object"?t:{},c=o&&typeof o=="object"?o:null,u=c!=null&&c.tokenValues&&typeof c.tokenValues=="object"?c.tokenValues:{},l={...s,...u},d=Array.isArray(r)?r:[],m=Array.isArray(i)?i:[],h=hn(n,l),b=Tn({tokens:h,clientInfo:d,clientSummary:m,profile:c}),f=new Date().toISOString(),x={apiVersion:q,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:f};return{apiVersion:q,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:c||null,values:vn(l,b),tokenValues:l,tokens:h,fields:b,fieldIndex:Sn(b),variables:En({fields:b,tokens:h,tokenValues:l,environment:x,profile:c}),environment:x,client:a&&typeof a=="object"?a:null,clientInfo:d,clientSummary:m,generatedAt:f}}function _n(e=""){const t=String(e||"").trim(),n=t.match(/^```(?:json|text)?\s*([\s\S]*?)\s*```$/i);return n?n[1].trim():t}function La(e=""){const t=_n(e);if(!t)return"";try{const n=JSON.parse(t);return n&&typeof n=="object"&&!Array.isArray(n)&&typeof n.html=="string"&&n.html.trim()?n.html.trim():""}catch{return""}}function M(e=""){const t=N(e);return t?`value: ${t.slice(0,80)}${t.length>80?"…":""}`:"empty now"}function On(e={}){const t=Array.isArray(e.names)?e.names.filter(Boolean):[];return[...new Set([e.name,...t].filter(Boolean))].slice(0,8).join(", ")}function Ln(e=null){var c;if(!e||typeof e!="object")return"No live app context was loaded while copying this prompt. The module must discover variables at runtime with TemplateTool.getContext(), TemplateTool.getVars(), TemplateTool.listVariables(), context.tokens and context.fields.";const t=["Live variable inventory from the current app context:","Use these exact names/tokens/keys when they fit the request, and still keep runtime fallbacks because availability changes per customer."],n=e.profile&&typeof e.profile=="object"?e.profile:null,a=n!=null&&n.vars&&typeof n.vars=="object"?n.vars:{},r=Object.entries(a).filter(([,u])=>N(u)!=="").sort(([u],[l])=>u.localeCompare(l));r.length>0&&(t.push("","Profile variables (TemplateProfile / TemplateVars aliases):"),r.forEach(([u,l])=>{t.push(`- ${u} (${M(l)})`)}));const i=Array.isArray((c=e.variables)==null?void 0:c.available)?e.variables.available:[];i.length>0&&(t.push("","Discoverable TemplateVars.available entries:"),i.forEach(u=>{const l=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",`names: ${On(u)||"none"}`,`source ${u.source||"context"}`,M(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)}));const o=Array.isArray(e.fields)?e.fields:[];o.length>0&&(t.push("","Resolved context.fields (preferred for visible customer data):"),o.forEach(u=>{const l=[u.label?`label ${u.label}`:"",u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.section?`section ${u.section}`:"",`source ${u.source||"context"}`,M(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)}));const s=Array.isArray(e.tokens)?e.tokens:[];return s.length>0&&(t.push("","All configured context.tokens, including empty values:"),s.forEach(u=>{const l=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",u.inputType?`type ${u.inputType}`:"",u.internal?"internal":"manual/configured",M(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)})),r.length===0&&i.length===0&&o.length===0&&s.length===0&&t.push("- No variables are currently configured or populated in this context. Build a missing-data state and rely on runtime discovery."),t.join(`
`)}function Da({title:e="",prompt:t="",runtimeContext:n=null}={}){const a=String(e||"").trim()||"Custom tool",r=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.
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
${on()}

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
${r}`}const Qe="salt-templater-alo-autofill",Dn=1,R=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function w(e){return e==null?"":String(e).trim()}function T(e){for(const t of e){const n=w(t);if(n)return n}return""}function Vn(e){const t=w(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:w(e)}function ne(e){const t=w(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const a=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(a)return`${a[3]}-${a[2]}-${a[1]}`;const r=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return r?`${r[3]}-${r[1].padStart(2,"0")}-${r[2].padStart(2,"0")}`:t}function J(e){const t=ne(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function jn(e={}){var t,n,a,r,i,o,s;return T([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(a=e==null?void 0:e.client)==null?void 0:a.activation_date,(r=e==null?void 0:e.client)==null?void 0:r.activation,(i=e==null?void 0:e.client)==null?void 0:i.dateActivation,(o=e==null?void 0:e.contact)==null?void 0:o.activationDate,(s=e==null?void 0:e.healthcheck)==null?void 0:s.activationDate])}function $n(e={}){const t=w(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function Fn(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",a=t==="lowBadRxTx"?"Bad signal":"No signal",r=J(n==="never"?e.activationDate:e.disconnectionDate);return[a,n==="never"?"Never activated":"Signal lost",r].filter(Boolean).join(" - ")}function Va(e={},t={}){var c,u,l;const n=T([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(c=e==null?void 0:e.client)==null?void 0:c.externalTicketId,(u=e==null?void 0:e.client)==null?void 0:u.externalId,(l=e==null?void 0:e.superOffice)==null?void 0:l.externalTicketId]),a=Y(n),r=a.ok?a.fields:{},i=$n(r),o=ne(jn(e)),s=ne(T([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt]));return{externalId:n,externalFields:r,aloType:"",signalState:i,extRef:"",disconnectionDate:i==="lost"?s:"",activationDate:o,description:""}}function et(e={}){return{firstName:w(e.firstName),lastName:w(e.lastName),email:w(e.email),phoneNumber:T([e.phoneNumber,e.phone])}}function zn(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:T([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[G],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:w(e==null?void 0:e.externalTicketId),tokenValues:t}}function Mn(e={},t={},n={},a={}){const r=(e==null?void 0:e.client)||{},i=(e==null?void 0:e.contact)||{},o=(e==null?void 0:e.healthcheck)||{},s=et(t),c=T([i.fixedNumber,i.voipNumber,i.voip,i.sip,r.fixedNumber,r.fixedPhone]),u=Vn(T([r.mobile,r.mobileRaw,r.phone,r.telephone,i.mobile,i.phone])),l=T([a.description,a.aloType==="lowBadRxTx"?"Bad signal":"",R.problemDescription]),d=T([a.notes,a.signalState?Fn(a):"",R.problemNotes]),m=a.signalState==="never"?J(a.activationDate):J(a.disconnectionDate);return{externalReference:w(a.extRef),socketId:T([o.otoId,o.oto_id,o.oto]),plugNr:T([o.otoPortId,o.otoPort,o.oto_port]),breakoutCable:T([o.breakoutCableId,o.breakoutCable,o.cable]),breakoutFiber:T([o.fiberNumber,o.fiber,o.fibre]),firstName:T([r.firstName,r.firstname,r.givenName]),lastName:T([r.lastName,r.lastname,r.surname,r.familyName]),contactPhone1:T([c,u]),contactPhone2:c&&u&&c!==u?u:"",contactEmail:T([r.email,r.mail,i.email,i.mail]),ispFirstName:s.firstName,ispLastName:s.lastName,ispPhone:s.phoneNumber,ispEmail:s.email,...R,problemDescription:l,problemNotes:d,problemDateTime:m,problemCode3:a.aloType==="lowBadRxTx"?"Performance problem":R.problemCode3}}function Rn(e={},t={},n={},a={}){const r=Mn(e,t,n,a),i=et(t),o=zn(n);return{source:Qe,version:Dn,fields:r,alo:{type:a.aloType||"noSignal",signalState:a.signalState||"",disconnectionDate:a.disconnectionDate||"",activationDate:a.activationDate||"",problemDateTime:r.problemDateTime,notes:a.notes||""},client:{firstName:r.firstName,lastName:r.lastName,contactPhone1:r.contactPhone1,contactPhone2:r.contactPhone2,email:r.contactEmail},technical:{socketId:r.socketId,plugNr:r.plugNr,breakoutCable:r.breakoutCable,breakoutFiber:r.breakoutFiber},agent:i,superOffice:o}}function ja(e={},t={},n={},a={}){return JSON.stringify(Rn(e,t,n,a),null,2)}function Bn(e){function t(l){return l==null?"":String(l).trim()}function n(l){for(var d=0;d<l.length;d+=1){var m=t(l[d]);if(m)return m}return""}function a(l){return t(l).replace(/[&<>"']/g,function(m){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}function r(l,d,m){var h=document.getElementById("saltAloFillOverlay");h&&h.remove();var b=document.createElement("div");b.id="saltAloFillOverlay",b.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(m==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",b.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+a(l)+"</strong><span style='color:#d8d8df'>"+a(d)+"</span>",document.body.appendChild(b),m!=="error"&&setTimeout(function(){try{b.remove()}catch{}},4500)}function i(l,d,m){var h=l&&l.fields||{};return n([h[d]].concat(m||[]))}function o(l,d){var m=String(d).replace(/["\\]/g,"\\$&");return document.querySelector("["+l+'="'+m+'"]')}function s(l){return document.getElementById(l)||o("name",l)||o("formcontrolname",l)||o("data-testid",l)}function c(l,d,m){var h=m?String(d??""):t(d);if(!m&&!h)return!1;var b=s(l);if(!b)return!1;if(b.tagName==="SELECT")for(var f=t(h).toLowerCase(),x=0;x<b.options.length;x+=1){var O=b.options[x];if(t(O.value).toLowerCase()===f||t(O.textContent).toLowerCase()===f){b.value=O.value;break}}else"value"in b?b.value=h:b.textContent=h;return b.dispatchEvent(new Event("input",{bubbles:!0})),b.dispatchEvent(new Event("change",{bubbles:!0})),!0}function u(l){if(!l||typeof l!="object"||Array.isArray(l)){r("ALO fill","ALO fill data invalid.","error");return}if(l.source&&l.source!==e){r("ALO fill","Clipboard does not contain ALO fill data from Salt Templater.","error");return}var d=l.client||{},m=l.technical||l.healthcheck||{},h=l.agent||{},b=0;function f(x,O,ut){c(x,O,ut)&&(b+=1)}if(f("ticket.extRef",i(l,"externalReference",[])),f("ticket.socketId",i(l,"socketId",[m.socketId,m.otoId,m.oto_id,m.oto])),f("ticket.plugNr",i(l,"plugNr",[m.plugNr,m.otoPortId,m.otoPort,m.oto_port])),f("ticket.breakoutCable",i(l,"breakoutCable",[m.breakoutCable,m.breakoutCableId,m.cable])),f("ticket.breakoutFiber",i(l,"breakoutFiber",[m.breakoutFiber,m.fiberNumber,m.fiber,m.fibre])),f("ticket.otoAddress.firstName",i(l,"firstName",[d.firstName,d.firstname,d.givenName])),f("ticket.otoAddress.lastName",i(l,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),f("ticket.contactPersonFirstName",i(l,"firstName",[d.firstName,d.firstname,d.givenName])),f("ticket.contactPersonLastName",i(l,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),f("ticket.contactPersonPhone1",i(l,"contactPhone1",[d.contactPhone1,d.fixedNumber,d.mobileRaw,d.mobile,d.phone])),f("ticket.contactPersonPhone2",i(l,"contactPhone2",[d.contactPhone2])),f("ticket.contactPersonMail",i(l,"contactEmail",[d.email,d.mail])),f("ticket.contactPersonIspFirstName",i(l,"ispFirstName",[h.firstName])),f("ticket.contactPersonIspLastName",i(l,"ispLastName",[h.lastName])),f("ticket.contactPersonIspPhone",i(l,"ispPhone",[h.phoneNumber,h.phone])),f("ticket.contactPersonIspMail",i(l,"ispEmail",[h.email])),f("ticket.problemDescription",i(l,"problemDescription",["No signal"])),f("ticket.problemNotes",i(l,"problemNotes",[""]),!0),f("ticket.problemDateTime",i(l,"problemDateTime",[l.alo&&l.alo.problemDateTime])),f("ticket.problemCode1",i(l,"problemCode1",["400"])),f("ticket.problemCode2",i(l,"problemCode2",["800"])),f("ticket.problemCode3",i(l,"problemCode3",["900"])),!b){r("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}r("ALO fill","Fields populated: "+b,"success")}if(r("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){r("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(d){if(!t(d)){r("ALO fill","Clipboard empty. Click ALO fill in Salt Templater first.","error");return}var m;try{m=JSON.parse(d)}catch{r("ALO fill","Clipboard does not contain valid ALO data.","error");return}u(m)}).catch(function(d){r("ALO fill","Clipboard error: "+(d&&d.message?d.message:d),"error")})}function $a(){const e=JSON.stringify(Qe);return`javascript:(${Bn.toString()})(${e});`}const Pn=Object.freeze([{id:"importVti",label:"Import VTI data",key:"q",code:"KeyQ",altKey:!0},{id:"importSo",label:"Import SO data",key:"w",code:"KeyW",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),Un=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function B(e,t){return!!(e!=null&&e[t])}function Kn(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function tt(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function qn(e,t){return B(e,"ctrlKey")===!!t.ctrlKey&&B(e,"altKey")===!!t.altKey&&B(e,"shiftKey")===!!t.shiftKey&&B(e,"metaKey")===!!t.metaKey}function Jn(e,t){return qn(e,t)&&(Kn(e==null?void 0:e.key,t.key)||tt(e==null?void 0:e.code,t.code))}function Fa(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function Hn(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(Un))}function Yn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||Hn(e==null?void 0:e.target))}function za(e){if(Yn(e))return null;const t=Pn.find(n=>Jn(e,n))||null;return!t||e!=null&&e.isComposing&&!tt(e==null?void 0:e.code,t.code)?null:t}const Gn="case-profile-beta-1",nt=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["providerOrderRef","Provider order ref"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),Te=Object.freeze(Object.fromEntries(nt)),at=Object.freeze(nt.map(([e])=>e)),Zn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),ae=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),rt=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function y(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function k(...e){for(const t of e){const n=y(t);if(n!=="")return n}return""}function E(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Wn(e=""){const t=E(e);return t?t.replace(/_([a-z0-9])/g,(n,a)=>a.toUpperCase()):""}function ye(e=""){const t=Wn(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ae(e=""){const t=E(e);return t?`{${t}}`:""}function _(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function Xn(){const e={};return at.forEach(t=>{e[t]=""}),{version:Gn,fields:e,fieldLabels:{...Te},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function ot(e){return y(e)!==""}function v(e,t,n,{overwrite:a=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const r=y(n);return r===""||!a&&ot(e.fields[t])?!1:(e.fields[t]=r,e[t]=r,!0)}function ke(e,t,n,{overwrite:a=!1,label:r=""}={}){const i=ye(t),o=y(n);return!i||o===""||rt.has(i)||!a&&Object.prototype.hasOwnProperty.call(e.dynamic,i)?!1:(e.dynamic[i]=o,r&&!e.fieldLabels[i]&&(e.fieldLabels[i]=r),!0)}function Qn(e,t,n,a={}){const r=E(Z(t)||t),i=ae[r]||ae[E(t)]||ye(t);return Object.prototype.hasOwnProperty.call(e.fields,i)?v(e,i,n,a):ke(e,t,n,a)}function ea(e,t={},n={}){Object.entries(t).forEach(([a,r])=>v(e,a,r,n))}function re(e,t=[],n=[]){return Array.isArray(e)?(e.forEach((a,r)=>{t.push(String(r+1)),re(a,t,n),t.pop()}),n):e&&typeof e=="object"?(Object.keys(e).forEach(a=>{t.push(a),re(e[a],t,n),t.pop()}),n):(n.push({path:t.slice(),value:y(e)}),n)}function ta(e=[]){return e[0]===se||e[0]===le}function it(e,t,{prefix:n="",skipInternalClientKeys:a=!1}={}){!t||typeof t!="object"||re(t).filter(r=>r.value!=="").filter(r=>!a||!ta(r.path)).forEach(r=>{const i=n?[n,...r.path]:r.path;ke(e,i.join("_"),r.value,{label:i.map(_).join(" ")})})}function Ce(e=[],t=[]){const n=new Map;return[...e,...t].forEach(a=>{if(!a||typeof a!="object")return;const r=`${y(a.url)}|${y(a.name)}|${y(a.id)}`;r.replace(/\|/g,"")&&(n.has(r)||n.set(r,a))}),Array.from(n.values())}function ve(e){const t=y(e);if(!t)return null;const n=Y(t);return n.ok?{externalId:t,fields:n.fields}:null}function st(e,t){var n,a,r,i;t&&(v(e,"externalId",t.externalId),Object.entries(Zn).forEach(([o,s])=>{var c;v(e,s,(c=t.fields)==null?void 0:c[o])}),v(e,"contractorNumber",(n=t.fields)==null?void 0:n.customer),v(e,"lexId",(a=t.fields)==null?void 0:a.lexId),v(e,"oltName",(r=t.fields)==null?void 0:r.oltName),v(e,"oltBoard",(i=t.fields)==null?void 0:i.oltBoard))}function na(e,t){var s;if(!t||typeof t!="object")return;const n=t.client||{},a=t.contact||{},r=t.healthcheck||{},i=r.crossConnexion||r.crossConnection||{},o=[n.firstName,n.lastName].map(y).filter(Boolean).join(" ");ea(e,{clientName:o||k(n.fullName,n.name,n.customerName),title:n.title,firstName:n.firstName,lastName:n.lastName,contractorNumber:k(n.contractorNumber,n.contractor,r.customerId),mobile:k(n.mobile,n.phone,n.telephone),mobileRaw:n.mobileRaw,phone:k(n.phone,n.telephone,a.fixedNumber),email:n.email,address:n.address,communicationLanguage:k(n.communicationLanguage,a.communicationLanguage,n.language,a.language),activationDate:k(n.activationDate,n.activation_date,n.activation,n.dateActivation,(s=t.offer)==null?void 0:s.activationDate,a.activationDate,r.activationDate),eligibilitySource:k(n.eligibilitySource,a.eligibilitySource),contactRecordId:k(n.contactRecordId,a.contactRecordId),fixedNumber:a.fixedNumber,publicId:a.publicId,providerOrderRef:a.providerOrderRef,fllRecordId:r.fllRecordId,otoId:k(r.otoId,r.oto_id,r.oto),otoPortId:k(r.otoPortId,r.otoPort,r.oto_port,i.Port),routerSerialNumber:r.routerSerialNumber,oldRouterSerialNumber:r.oldRouterSerialNumber,lexId:r.lexId,oltName:r.oltName,oltBoard:r.oltBoard,ponPort:r.ponPort,breakoutCableId:r.breakoutCableId,fiberNumber:r.fiberNumber,lineState:r.lineState,routerStatus:r.routerStatus,odfId:r.odfId,option82:r.option82,oltObject:r.oltObject,ontConfigurationFilename:r.ontConfigurationFilename,svlan:r.svlan,customerId:r.customerId,crossConnectionEquipment:i.Equipment,crossConnectionRack:i.Rack,crossConnectionSlot:i.Slot,crossConnectionPort:i.Port}),st(e,ve(t[le])),it(e,t,{skipInternalClientKeys:!0})}function aa(e,t){var r;if(!t||typeof t!="object")return;v(e,"soTicketNum",k(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(r=t.tokenValues)==null?void 0:r[G])),v(e,"ticketCreatedAt",k(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),st(e,ve(t.externalTicketId)),lt(e,t.tokenValues);const n=W(t.attachments),a=F(n);e.attachments=Ce(e.attachments,n),e.photos=Ce(e.photos,a),it(e,t,{prefix:"ticket"})}function lt(e,t={},n={}){!t||typeof t!="object"||Object.entries(t).forEach(([a,r])=>{const i=y(r);if(i==="")return;const o=Z(a),s=mt(o)||E(a),c=ae[s];c&&v(e,c,i,n),s==="external_customer"&&v(e,"contractorNumber",i,n),s==="external_lex_id"&&v(e,"lexId",i,n),s==="external_olt_name"&&v(e,"oltName",i,n),s==="external_olt_board"&&v(e,"oltBoard",i,n),ke(e,s,i,{...n,label:_(s)})})}function ra(e,t){const n=t==null?void 0:t[se];!n||typeof n!="object"||Array.isArray(n)||Object.entries(n).forEach(([a,r])=>{Qn(e,a,r,{overwrite:!0,label:_(a)})})}function Ee(e,t,n){const a=ye(t),r=y(n);!a||r===""||rt.has(a)||Object.prototype.hasOwnProperty.call(e,a)||(e[a]=r)}function oa(e,t={}){const n={},a={},r=[];at.forEach(s=>{const c=y(e.fields[s]);if(c==="")return;Ee(n,s,c);const u=Ae(s);u&&(a[u]=c),r.push({key:s,label:Te[s]||_(s),value:c})}),Object.entries(e.dynamic).forEach(([s,c])=>{const u=y(c);if(u==="")return;Ee(n,s,u);const l=Ae(s);l&&!Object.prototype.hasOwnProperty.call(a,l)&&(a[l]=u),e.fields[s]||r.push({key:s,label:e.fieldLabels[s]||_(s),value:u})});const i=ve(e.externalId);i&&Object.assign(a,oe(i.fields)),ot(e.soTicketNum)&&(a[G]=e.soTicketNum);const o={};return Object.entries(t||{}).forEach(([s,c])=>{const u=Z(s)||s;o[u]=c}),e.vars=n,e.variables=n,e.tokenValues={...o,...a},e.availableFields=r,e}function Ma({clientPayload:e=null,superOfficePayload:t=null,tokenValues:n={}}={}){const a=Xn();return na(a,e),aa(a,t),lt(a,n),ra(a,e),oa(a,n)}function p(e,t,n=""){var r;const a=y((e==null?void 0:e[t])??((r=e==null?void 0:e.fields)==null?void 0:r[t]));return a?{label:n||Te[t]||_(t),value:a}:null}function S(e,t){const n=y(t);return n?{label:e,value:n}:null}function ct(e=[]){const t=new Set;return e.filter(Boolean).filter(n=>{const a=`${E(n.label)}:${n.value}`;return t.has(a)?!1:(t.add(a),!0)})}function P(e,t,n=[]){const a=ct(n);return a.length>0?{id:e,title:t,fields:a}:null}function Ra(e=null){return!e||typeof e!="object"?[]:ct([S("Name",e.clientName),S("Mobile",k(e.mobile,e.mobileRaw,e.phone)),S("Contractor",k(e.contractorNumber,e.externalCustomer,e.customerId)),S("Activation",e.activationDate),S("OTO ID",e.otoId),S("Port",k(e.otoPortId,e.crossConnectionPort)),S("SO ticket",e.soTicketNum)])}function Ba(e=null){return!e||typeof e!="object"?[]:[P("caseClient","Client",[p(e,"clientName","Full name"),p(e,"contractorNumber","Contractor"),p(e,"title"),p(e,"firstName"),p(e,"lastName"),p(e,"mobile"),p(e,"mobileRaw","Mobile raw"),p(e,"phone"),p(e,"email"),p(e,"address"),p(e,"communicationLanguage","Language"),p(e,"activationDate","Activation date")]),P("caseSuperOffice","SuperOffice",[p(e,"soTicketNum","SO ticket"),p(e,"ticketCreatedAt","Created at"),p(e,"externalId","External ID"),p(e,"externalPartner","Partner"),p(e,"externalPartnerTicketNumber","Partner ticket")]),P("caseExternalId","External ID fields",[p(e,"externalFlagging","Flagging"),p(e,"externalDate","Date"),p(e,"externalCustomer","Contractor"),p(e,"externalSignalStatus","Signal"),p(e,"externalLedStatus","LED"),p(e,"externalTreatmentStep","Treatment"),p(e,"externalBoxType","Box"),p(e,"externalLexId","LEX ID"),p(e,"externalOltName","OLT"),p(e,"externalOltBoard","Board"),p(e,"externalBokBof","BOK/BOF"),p(e,"externalComment","Comment")]),P("caseTechnical","Technical",[p(e,"fllRecordId","FLL record"),p(e,"otoId","OTO ID"),p(e,"otoPortId","OTO port"),p(e,"routerSerialNumber","Router serial"),p(e,"oldRouterSerialNumber","Old router serial"),p(e,"lexId","LEX ID"),p(e,"oltName","OLT"),p(e,"oltBoard","OLT board"),p(e,"ponPort","PON port"),p(e,"breakoutCableId","Breakout cable"),p(e,"fiberNumber","Fiber number"),p(e,"lineState","Line state"),p(e,"routerStatus","Router status"),p(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{ja as A,ka as B,pa as C,za as D,Fn as E,$a as F,Ia as G,Re as H,Me as I,Rt as J,Pn as K,Fa as L,Da as M,La as N,Pt as O,fa as P,$t as S,A as T,Fe as a,va as b,xa as c,wa as d,qt as e,Ea as f,pe as g,Na as h,Aa as i,Oa as j,Ca as k,ga as l,_a as m,F as n,ba as o,ha as p,da as q,Sa as r,ya as s,ma as t,Ma as u,Ba as v,Ra as w,Mt as x,Ta as y,Va as z};
