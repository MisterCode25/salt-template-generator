import{c as qe}from"./appConfigService-CdnvAh_8.js";import{p as te,b as pe,S as re,x as ne,O as D,r as U,B as kt,J as fe,V as be,Y as he,Z as ge,_ as vt,f as xt}from"./tokenService-DcYFCvkh.js";import{l as P,s as Te,d as wt}from"./templateTreeService-BI3aDoNG.js";import{f as Je,u as He}from"./templateTreeOperations-av5yUfQc.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Tn=qe("chevron-right",It);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],yn=qe("puzzle",At),Nt=/\.(jpe?g|jfif|png|webp|gif|bmp|avif|heic|heif|tiff?|ico|svg)(?:$|[?#])/i,St=/\.(mp4|mov)(?:$|[?#])/i,Ct=/\.pdf(?:$|[?#])/i,Et=["{contractor}","{contractor_number}","{client_contractor_number}"];function T(...e){for(const t of e){const r=String(t??"").trim();if(r)return r}return""}function _t(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function Ot(e="",t=""){const r=`${e} ${t}`;return Nt.test(r)?"image":St.test(r)?"video":Ct.test(r)?"pdf":"file"}function Lt(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function Dt(e=""){const t=String(e||"").trim().toLowerCase();return t==="video"||t==="mp4"||t==="mov"||t.startsWith("video/")}function Vt(e=""){const t=String(e||"").trim().toLowerCase();return t==="pdf"||t==="application/pdf"}function jt(...e){for(const t of e){if(Lt(t))return"image";if(Dt(t))return"video";if(Vt(t))return"pdf"}return""}function Ft(...e){for(const t of e){const r=T(t),n=r.toLowerCase();if(n){if(n.includes("/"))return r;if(n==="pdf")return"application/pdf";if(n==="mp4")return"video/mp4";if(n==="mov")return"video/quicktime"}}return""}function $t(e={}){var t,r,n;return T(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(r=e.message)==null?void 0:r.createdAt,(n=e.message)==null?void 0:n.sentAt)||null}function z(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function Bt(e,t){var l,u,m,c,d;if(!e||typeof e!="object"||Array.isArray(e))return null;const r=T(e.url,e.href,e.src,e.downloadUrl);if(!r)return null;const n=T(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((l=String(r).split("/").pop())==null?void 0:l.split("?")[0])||""))||`Attachment ${t+1}`,a=T(e.type,e.contentType,e.mimeType),i=Ft(e.contentType,e.mimeType,e.type,e.mediaType),o=jt(e.type,e.contentType,e.mimeType,e.mediaType)||Ot(n,r),s=T(e.messageId,e.messageID,e.postId,(u=e.message)==null?void 0:u.id)||null;return{id:T(e.id,e.attachmentId,e.documentId)||`${t}-${n}-${r}`,name:n,url:r,dataUrl:T(e.dataUrl)||null,type:o,contentType:i||a||null,size:T(e.size,e.sizeText,e.fileSize)||null,messageId:s,postId:T(e.postId,s)||null,messageIndex:z(T(e.messageIndex,e.messageOrder,e.postIndex,(m=e.message)==null?void 0:m.index)),attachmentIndex:z(T(e.attachmentIndex,e.fileIndex)),messageAuthor:T(e.messageAuthor,e.author,e.createdBy,(c=e.message)==null?void 0:c.author,(d=e.message)==null?void 0:d.createdBy)||null,source:T(e.source,e.origin)||null,date:$t(e)}}function Fe(e){return String(e).padStart(2,"0")}function zt(e){const t=e.getFullYear(),r=Fe(e.getMonth()+1),n=Fe(e.getDate());return{dateKey:`${t}-${r}-${n}`,label:`${n}.${r}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function $e(e,t,r,n=0,a=0,i=0){if(t<0||t>11||r<1||r>31||n<0||n>23||a<0||a>59||i<0||i>59)return null;const o=new Date(e,t,r,n,a,i);return o.getFullYear()!==e||o.getMonth()!==t||o.getDate()!==r?null:o}function Rt(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const i=new Date(e);return Number.isNaN(i.getTime())?null:i}const t=String(e).trim();if(!t)return null;const r=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(r){const i=$e(Number(r[1]),Number(r[2])-1,Number(r[3]),Number(r[4]||0),Number(r[5]||0),Number(r[6]||0));if(i)return i}const n=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const i=Number(n[1]),o=n[2],s=Number(n[3]),l=Number(n[4]),u=l<100?2e3+l:l,m=Number(n[5]||0),c=Number(n[6]||0),d=Number(n[7]||0),p=o==="/"&&s>12&&i<=12,f=p?s:i,g=(p?i:s)-1,b=$e(u,g,f,m,c,d);if(b)return b}const a=new Date(t);return Number.isNaN(a.getTime())?null:a}function ye(e={}){const t=Rt(e.date);return t?zt(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function Mt(e,t){const r=T(t);r&&Et.forEach(n=>{e[n]=r})}function Be(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function Ut(e,t,r){const n=ne(t),a=T(r);!n||!a||e.push([n,a])}function Ye(e,t=[]){const r=[];return Be(e)&&Object.entries(e).forEach(([n,a])=>{if(Be(a)){r.push(...Ye(a,[...t,n]));return}Ut(r,[...t,n].join("."),a)}),r}function Pt(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(r=>{Ye(e[r]).forEach(([n,a])=>{t[n]=a})}),t}function K(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(Bt).filter(Boolean).filter(r=>{const n=`${r.name}|${r.url}`;return t.has(n)?!1:(t.add(n),!0)})}function ke(e=[]){return K(e).filter(t=>t.type==="image")}function ve(e=[]){return K(e).filter(t=>["image","video","pdf"].includes(t.type))}function Kt(e=[]){const t=new Map;return e.forEach((r,n)=>{const a=ye(r);t.has(a.dateKey)||t.set(a.dateKey,{...a,postLabel:"Post non identifié",dateLabel:a.label,author:T(r.messageAuthor),attachments:[]}),t.get(a.dateKey).attachments.push({...r,galleryIndex:n})}),Array.from(t.values()).sort((r,n)=>n.sortValue-r.sortValue)}function ze(e={}){var t;return T(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function Re(e={},t=0){const r=z(e.messageNumber),n=z(e.messageIndex);return`Post ${r||(n===null?t+1:n+1)}`}function qt(e={}){const t=ye(e),r=T(e.messageAuthor);return t.dateKey==="unknown"?r:[t.label,r].filter(Boolean).join(" · ")}function kn(e=[]){const t=ve(e);if(!t.some(n=>ze(n)))return Kt(t);const r=new Map;return t.forEach((n,a)=>{const i=ze(n),o=ye(n),s=i||`unassigned:${o.dateKey}`;if(!r.has(s)){const l=r.size;r.set(s,{dateKey:s,label:i?Re(n,l):o.label,metaLabel:i?qt(n):"",postLabel:i?Re(n,l):"Post non identifié",dateLabel:o.label,author:T(n.messageAuthor),sortValue:z(n.messageIndex)??a,attachments:[]})}r.get(s).attachments.push({...n,galleryIndex:a})}),Array.from(r.values()).sort((n,a)=>n.sortValue-a.sortValue)}function vn(e){var g,b,v,I,$,Oe,Le,De,Ve,je;const t=_t(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const r=T(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),n=T(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),a=T(t.firstPostAt,t.firstPostDate,t.firstMessageAt,t.firstMessageDate,(b=(g=t.posts)==null?void 0:g[0])==null?void 0:b.createdAt,(I=(v=t.posts)==null?void 0:v[0])==null?void 0:I.date,(Oe=($=t.messages)==null?void 0:$[0])==null?void 0:Oe.createdAt,(De=(Le=t.messages)==null?void 0:Le[0])==null?void 0:De.date),i=T(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),o=T(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(Ve=t.client)==null?void 0:Ve.contractorNumber,(je=t.client)==null?void 0:je.contractor),s={};let l=null,u=!1;const m=K(t.attachments),c=ke(m),d=ve(m);if(i){const se=te(i);se.ok&&(u=!0,l=se.fields,Object.assign(s,pe(se.fields)))}Object.assign(s,Pt(t));const p=(l==null?void 0:l.customer)||o;p&&(u||r||m.length>0)&&Mt(s,p);const f=r||(l==null?void 0:l.soTicket)||"";return f&&(s[re]=f),Object.keys(s).length===0&&m.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:u,externalTicketId:i}:{ok:!0,ticketId:f,sourceTicketId:r,createdAt:n,firstPostAt:a,externalTicketId:i,contractorNumber:p,externalIdValid:u,externalFields:l,tokenValues:s,attachments:m,imageAttachments:c,mediaAttachments:d,ignoredExternalId:!!(i&&!u)}}const q="super_office_ticket_payload",xe="pending_super_office_ticket_payload",ae="previous_super_office_ticket_payload",Jt="super-office-ticket-updated";function Ht(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[he]:t,[ge]:r,...n}=e;return n}function le(e){return Array.isArray(e)?`[${e.map(le).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${le(e[t])}`).join(",")}}`:JSON.stringify(e)}function O(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return le(Ht(e))}catch{return""}}const Yt=new Set(["billingaccount","contractornumber","customerid","publicid","contactrecordid"]);function ce(e,t=new Map){return!e||typeof e!="object"||Array.isArray(e)||Object.entries(e).forEach(([r,n])=>{if(r.startsWith("__"))return;const a=r.replace(/[^a-z0-9]/gi,"").toLowerCase();if(Yt.has(a)){const i=String(n??"").trim().toLowerCase();i&&t.set(a,i);return}n&&typeof n=="object"&&ce(n,t)}),t}function xn(e,t){const r=ce(e),n=ce(t);for(const[a,i]of r)if(n.get(a)===i)return!0;return O(e)===O(t)}function R(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(Jt,{detail:{payload:e}}))}function C(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=K(e.attachments),r=String(e.clientSignature||"").trim(),n=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([a,i])=>[a,i==null?"":String(i)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),firstPostAt:String(e.firstPostAt||e.firstPostDate||e.firstMessageAt||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:r,tokenValues:n,attachments:t,imageAttachments:ke(t),mediaAttachments:ve(t)}}function Gt(e,t=new Date,r=""){return C({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",firstPostAt:(e==null?void 0:e.firstPostAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:r,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function oe(e){e&&await be(q,e)}async function Ge(e){e&&await be(ae,e)}async function Ze(e){e&&await be(xe,e)}async function ie(){try{return C(await D(xe,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function wn(){return ie()}async function Zt(){return await We()||await ie()}async function In(){return!!await Zt()}function we(){return fe(xe)}function X(){return fe(ae)}async function An(e){const t=await U(),r=Gt(e,new Date,O(t));if(!r)return null;if(!r.clientSignature)return await Q(),await Ze(r),R(null),r;const n=C(await D(q,null)),a=(n==null?void 0:n.ticketId)||(n==null?void 0:n.sourceTicketId)||"",i=r.ticketId||r.sourceTicketId||"";return(n==null?void 0:n.clientSignature)===r.clientSignature&&a&&i&&a!==i&&await Ge(n),await oe(r),await we(),R(r),r}async function Nn(e){const t=kt(e);if(!t)return null;const r=await We(),n=r?null:await ie(),a=r||n;if(!a)return null;const i=te(t),o=i.ok?{...a.tokenValues||{},...pe(i.fields)}:a.tokenValues||{},s=C({...a,externalTicketId:t,tokenValues:o});return s?(s.clientSignature?await oe(s):await Ze(s),R(s),s):null}function Q(){return fe(q)}async function Sn(){const e=await ie(),t=O(await U());if(!e||!t)return null;const r={...e,clientSignature:t};return await oe(r),await we(),R(r),r}async function We(){try{const e=await D(q,null);if(!e)return null;const t=O(await U());if(!t)return await Q(),await X(),null;if((e==null?void 0:e.clientSignature)!==t)return await Q(),await X(),null;const r=C(e);return r||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function Cn(){try{const e=C(await D(ae,null));if(!e)return null;const t=O(await U());return!t||e.clientSignature!==t?(await X(),null):e}catch(e){return console.error("loadPreviousSuperOfficeTicketPayload error",e),null}}async function En(){const e=O(await U());if(!e)return!1;const t=C(await D(q,null)),r=C(await D(ae,null));return await Promise.all([t?oe({...t,clientSignature:e}):Promise.resolve(),r?Ge({...r,clientSignature:e}):Promise.resolve()]),!!(t||r)}async function _n(){await Q(),await we(),await X(),R(null)}const Wt=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function Ie(e){return e==null?e:JSON.parse(JSON.stringify(e))}function B(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function _(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function Xe(e=[]){return new Map(e.map(t=>[t.id,t]))}function Qe(e,t){if(!e)return"";const r=[],n=new Set;let a=e;for(;a&&!n.has(a.id);)n.add(a.id),r.unshift(a.title||a.id),a=a.parentId?t.get(a.parentId):null;return r.join(" / ")}function Xt(e=[]){const t=Xe(e);return e.map(r=>({...r,path:Qe(r,t)}))}function et(e=[],t){const r=String(t||"").trim();if(!r)return null;const n=Xe(e);if(n.has(r))return n.get(r);const a=_(r);return e.find(i=>_(i.title)===a||_(Qe(i,n))===a)||null}function Qt(e=[],t={}){return et(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function er(e=[],t={}){return et(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function tr(e,t={},r=null){const n=B(t.templateIds||t.templateId).map(String).filter(Boolean);if(n.length>0&&!n.includes(e.id)||r&&!(e.nodeIds||[]).includes(r.id))return!1;const a=B(t.channels||t.channel).map(s=>String(s||"").trim()).filter(Boolean);if(a.length>0&&!a.some(s=>(e.channels||[]).includes(s)))return!1;const i=String(t.title||t.templateTitle||"").trim();if(i&&_(e.title)!==_(i))return!1;const o=B(t.titleIncludes||t.templateTitleIncludes).map(_).filter(Boolean);if(o.length>0){const s=_(e.title);if(!o.some(l=>s.includes(l)))return!1}return!0}function rr({template:e,sourceNode:t,targetNode:r,reason:n=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:r.id,targetNodeTitle:r.title||"",reason:n}}function tt({nodes:e=[],templates:t=[]}={}){return{nodes:Xt(e),templates:Ie(t),counts:{nodes:e.length,templates:t.length}}}function rt(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([r,n])=>{Wt.has(r)&&(t[r]=n)}),t}async function nt(){return tt(await P())}async function nr(){return nt()}async function ar(e=[]){const t=B(e),{nodes:r,templates:n}=await P(),a=[],i=[];return t.forEach((o,s)=>{if(!o||typeof o!="object"||Array.isArray(o)){i.push({ruleIndex:s,reason:"Rule must be an object."});return}const l=er(r,o);if(!l){i.push({ruleIndex:s,reason:"Target topic was not found."});return}const u=Qt(r,o),m=n.filter(c=>tr(c,o,u));if(m.length===0){i.push({ruleIndex:s,reason:"No templates matched this rule."});return}m.forEach(c=>{(c.nodeIds||[])[0]===l.id&&(!u||u.id===l.id)||a.push(rr({template:c,sourceNode:u,targetNode:l,reason:o.reason||`Rule ${s+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:a.length,affectedTemplateCount:new Set(a.map(o=>o.templateId)).size,operations:a,skipped:i}}async function or(e=[]){const t=B(e),r=await P();let n=r.nodes,a=r.templates;const i=[],o=[];return t.forEach((s,l)=>{var m;const u=(s==null?void 0:s.action)||(s==null?void 0:s.type);if(!s||typeof s!="object"||Array.isArray(s)){o.push({operationIndex:l,reason:"Operation must be an object."});return}if(u==="moveTemplate"){const c=String(s.templateId||""),d=String(s.targetNodeId||s.toNodeId||"");if(!c||!d){o.push({operationIndex:l,reason:"moveTemplate requires templateId and targetNodeId."});return}const p=a.find(b=>b.id===c),f=s.sourceNodeId||((m=p==null?void 0:p.nodeIds)==null?void 0:m[0])||null,g=JSON.stringify(a);a=Je(a,c,f,d,Number(s.targetIndex),n),JSON.stringify(a)!==g&&i.push({operationIndex:l,action:u,templateId:c,targetNodeId:d});return}if(u==="updateTemplate"){const c=String(s.templateId||"");if(!c){o.push({operationIndex:l,reason:"updateTemplate requires templateId."});return}const d=rt(s.patch||s.fields||{}),p=JSON.stringify(a);a=He(a,c,d),JSON.stringify(a)!==p&&i.push({operationIndex:l,action:u,templateId:c});return}o.push({operationIndex:l,reason:`Unsupported operation: ${u||"unknown"}.`})}),i.length>0&&await Te({nodes:n,templates:a}),{ok:!0,appliedCount:i.length,skippedCount:o.length,applied:i,skipped:o,tree:tt({nodes:n,templates:a})}}async function ir(e,t={}){const r=String(e||"");if(!r)throw new Error("templateId is required.");const n=await P();if(!n.templates.some(i=>i.id===r))throw new Error("Template was not found.");const a=He(n.templates,r,rt(t));return await Te({nodes:n.nodes,templates:a}),{ok:!0,template:Ie(a.find(i=>i.id===r))}}async function sr(e,t,r={}){var u;const n=String(e||""),a=String(t||"");if(!n||!a)throw new Error("templateId and targetNodeId are required.");const i=await P();if(!i.templates.some(m=>m.id===n))throw new Error("Template was not found.");const o=i.templates.find(m=>m.id===n),s=(r==null?void 0:r.sourceNodeId)||((u=o==null?void 0:o.nodeIds)==null?void 0:u[0])||null,l=Je(i.templates,n,s,a,Number(r==null?void 0:r.targetIndex),i.nodes);return await Te({nodes:i.nodes,templates:l}),{ok:!0,template:Ie(wt(l.find(m=>m.id===n)))}}async function On(e,t={}){switch(e){case"tool:templates:list":return nt();case"tool:templates:get-tree":return nr();case"tool:templates:preview-migration":return ar(t.rules||t);case"tool:templates:apply-migration":return or(t.operations||t);case"tool:templates:update-template":return ir(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return sr(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const ee="template-tool-module-beta-2",at=Object.freeze({name:"Template Generator Module API",version:ee,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",containers:{"context.profile / TemplateProfile":"Normalized customer and case profile with common scalar fields, tokenValues, vars, photos and attachments.","context.variables / TemplateVars":"Variable-friendly aliases generated from profile fields, tokens and visible client fields. This is the preferred object for JavaScript property access.","TemplateVars.byToken":"Exact token lookup keyed by brace tokens such as {client_first_name}. Includes known tokens even when the current value is empty.","TemplateVars.byKey":"Lookup keyed by structured token keys such as client.firstName or contractorNumber.","TemplateVars.byLabel":"Lookup keyed by user-facing field labels from the app.","TemplateVars.available":"Discovery list for every exposed variable with names, token, key, label, value, source, inputType and internal.","TemplateVars.availableTokens":"Subset of TemplateVars.available that comes from token definitions.","TemplateVars.availableFields":"Visible normalized field list with aliases for customer-facing selectors.","context.tokens":"All configured token definitions, including manual/internal tokens and empty values.","context.fields / TemplateFields":"Best normalized list for user-facing customer, case and profile fields.","context.fieldIndex":"Normalized lookup map for labels, tokens, keys and aliases with punctuation/accent/braces removed.","context.client":"Raw imported VTI/customer payload. Use only when the module needs structured nested source data.","context.clientInfo":"Visible client detail sections used by the app UI.","context.clientSummary":"Compact client bar fields currently selected in the app."},examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']","TemplateVars.available.map((entry) => entry.name)"],reservedContainers:["env","raw","byToken","byKey","byLabel","available","availableTokens","availableFields"]},dataAccess:{appDatabase:"Authorized only through TemplateTool APIs. TemplateTool.templates reads and writes the app's IndexedDB-backed topic/template data through host services.",internet:"Public Internet API/database access is authorized for explicit user-requested public HTTP(S) read requests. Prefer TemplateTool.fetchJson(url) or TemplateTool.fetchText(url) for CORS-enabled Internet APIs/databases.",restrictions:"Do not use secrets, cookies, credentials, private/local network URLs, remote scripts, CDNs, remote fonts, eval, parent DOM access, localStorage or raw IndexedDB."},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object with scalar aliases plus available, availableTokens, availableFields, byToken, byKey and byLabel discovery containers",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.fetchJson(url)":"Promise<{ ok, status, url, contentType, data?, text?, error?, truncated? }>","TemplateTool.fetchText(url)":"Promise<{ ok, status, url, contentType, text?, error?, truncated? }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function lr(e=at){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([r,n])=>{t.push(`- window.${r}: ${n.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),e.variables.containers&&typeof e.variables.containers=="object"&&(t.push("","Variable containers:"),Object.entries(e.variables.containers).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)})),t.push("","Variable examples:"),(e.variables.examples||[]).forEach(r=>{t.push(`- ${r}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),e.dataAccess&&typeof e.dataAccess=="object"&&(t.push("","Data access:"),Object.entries(e.dataAccess).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)})),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)}),t.join(`
`)}const cr=`
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
</style>`,ur=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${ee}";
    var apiReference = ${JSON.stringify(at)};
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
<\/script>`,dr=`<!doctype html>
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
</html>`;function mr(e=""){var l;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const r=t.match(/```(?:html)?\s*([\s\S]*?)```/i),n=((l=r==null?void 0:r[1])==null?void 0:l.trim())||t,a=n.match(/<!doctype\s+html\b|<html[\s>]/i);if(!a)return n;const i=a.index||0,o=n.slice(i).trim(),s=o.match(/<\/html\s*>/i);return s?o.slice(0,s.index+s[0].length).trim():o}function pr(e=""){const t=mr(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:dr}function fr(e,t,r){return e.includes(r)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function br(e,t,r){return e.includes(r)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Ln(e=""){const t=pr(e),r=br(t,ur,"template-tool-bridge");return fr(r,cr,"template-tool-host-style")}const Me=3e5;function hr(e=""){const t=e.split(".").map(a=>Number(a));if(t.length!==4||t.some(a=>!Number.isInteger(a)||a<0||a>255))return!1;const[r,n]=t;return r===0||r===10||r===127||r===169&&n===254||r===172&&n>=16&&n<=31||r===192&&n===168}function gr(e=""){try{const t=new URL(String(e||"").trim());if(!["http:","https:"].includes(t.protocol))return!1;const r=t.hostname.toLowerCase().replace(/^\[|\]$/g,"");return!(!r||r==="localhost"||r.endsWith(".localhost")||r.endsWith(".local")||r==="::1"||r==="0:0:0:0:0:0:0:1"||hr(r))}catch{return!1}}async function Dn({url:e="",responseType:t="json"}={}){const r=String(e||"").trim(),n=t==="json";if(!gr(r))return{ok:!1,status:0,url:r,contentType:"",error:"Only public http/https URLs can be fetched by a module."};try{const a=await fetch(r,{method:"GET",credentials:"omit",cache:"no-store",redirect:"follow",headers:{Accept:n?"application/json, text/plain;q=0.8, */*;q=0.5":"text/plain, application/json;q=0.8, */*;q=0.5"}}),i=a.headers.get("content-type")||"",o=await a.text(),s=o.length>Me,l=s?o.slice(0,Me):o,u={ok:a.ok,status:a.status,url:a.url||r,contentType:i,truncated:s};if(!n)return{...u,text:l};try{return{...u,data:l?JSON.parse(l):null}}catch{return{...u,ok:!1,text:l,error:"The Internet response was not valid JSON."}}}catch(a){return{ok:!1,status:0,url:r,contentType:"",error:(a==null?void 0:a.message)||"Internet request failed."}}}function Tr(e=[],t={}){return Array.isArray(e)?e.filter(r=>r==null?void 0:r.token).map(r=>{const n=Object.prototype.hasOwnProperty.call(t,r.token)?t[r.token]:r.previewValue;return{token:r.token,label:r.label||r.token,key:r.key||"",inputType:r.input_type||r.inputType||"text",value:n??"",internal:!!r.internal,aliases:Array.isArray(r.searchAliases)?r.searchAliases.filter(Boolean):[]}}):[]}function S(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function ue(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function ot(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function it(e=""){const t=ot(e);return t?t.replace(/_([a-z0-9])/g,(r,n)=>n.toUpperCase()):""}function M(e=""){const t=it(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ae(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function J(e,t){const r=String(t||"").trim();!r||e.includes(r)||e.push(r)}function N(e,t){const r=String(t||"").trim();if(!r)return;J(e,r);const n=ot(r),a=it(r);n&&(J(e,n),J(e,`{${n}}`)),a&&J(e,a)}function st({label:e="",token:t="",key:r="",aliases:n=[],section:a=""}={}){const i=[];N(i,e),N(i,t),N(i,t.replace(/[{}]/g,"")),N(i,r);const o=Ae(r);return o.length>0&&(N(i,o[o.length-1]),N(i,o.join(" ")),N(i,o.join(""))),N(i,a),n.forEach(s=>N(i,s)),i}function yr(e){const t=S(e.value);if(t==="")return null;const r={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(r.token=String(e.token)),e.key&&(r.key=String(e.key)),e.section&&(r.section=String(e.section)),r.aliases=st({...e,...r}),r}function kr({tokens:e=[],clientInfo:t=[],clientSummary:r=[],profile:n=null}={}){const a=[],i=new Set,o=s=>{const l=yr(s);if(!l)return;const u=`${l.source}:${l.label}:${l.value}:${l.token||""}:${l.key||""}`;i.has(u)||(i.add(u),a.push(l))};return e.forEach(s=>{o({label:s.label,value:s.value,token:s.token,key:s.key,aliases:s.aliases,source:"token"})}),r.forEach(s=>{o({label:s.label,value:s.value,section:"summary",source:"clientSummary"})}),t.forEach(s=>{((s==null?void 0:s.fields)||[]).forEach(l=>{o({label:l.label,value:l.value,section:s.title||s.id,source:"clientInfo"})})}),n&&typeof n=="object"&&(Array.isArray(n.availableFields)?n.availableFields:[]).forEach(s=>{o({label:s.label,value:s.value,key:s.key,aliases:s.aliases,source:"profile"})}),a}function vr(e,t,r){!t||r===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=r)}function xr(e,t,r){const n=Ae(t);if(n.length<2||r==="")return;let a=e;for(let o=0;o<n.length-1;o+=1){const s=n[o];if(!s||/^\d+$/.test(s)||(a[s]===void 0&&(a[s]={}),!a[s]||typeof a[s]!="object"||Array.isArray(a[s])))return;a=a[s]}const i=n[n.length-1];i&&!Object.prototype.hasOwnProperty.call(a,i)&&(a[i]=r)}function wr(e={},t=[]){const r={...e};return t.forEach(n=>{n.key&&xr(r,n.key,n.value),n.aliases.forEach(a=>vr(r,a,n.value))}),lt(r,t),r}const Ir=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function Ar(e,t){const r=ue(t);return!e||!r?!1:[e.label,e.token,e.key,...e.aliases||[]].some(n=>ue(n)===r)}function Nr(e=[],t=[]){for(const r of t){const n=e.find(i=>Ar(i,r)),a=S(n==null?void 0:n.value);if(a!=="")return a}return""}function lt(e,t=[]){Ir.forEach(({name:r,candidates:n})=>{if(Object.prototype.hasOwnProperty.call(e,r))return;const a=Nr(t,n);a!==""&&(e[r]=a)})}function Sr({tokens:e=[],fields:t=[],variables:r={}}={}){const n=[],a=new Set,i=o=>{const s=Array.isArray(o.names)?o.names.filter(Boolean):[],l=[o.token||"",o.key||"",o.label||"",o.source||"",s.join("|")].join(":");a.has(l)||(a.add(l),n.push({name:s[0]||o.token||o.key||o.label||"",names:s,token:o.token||"",key:o.key||"",label:o.label||"",value:S(o.value),source:o.source||"context",inputType:o.inputType||"",internal:!!o.internal}))};return e.forEach(o=>{const l=st({label:o.label,token:o.token,key:o.key,aliases:o.aliases}).map(M).filter(Boolean);i({names:[...new Set(l)],token:o.token,key:o.key,label:o.label,value:o.value,source:"token",inputType:o.inputType,internal:o.internal})}),t.forEach(o=>{const l=[o.label,o.token,o.key,...o.aliases||[]].map(M).filter(Boolean);i({names:[...new Set(l)],token:o.token,key:o.key,label:o.label,value:o.value,source:o.source})}),Object.entries(r).forEach(([o,s])=>{!o||s===null||typeof s=="object"||i({names:[o],label:o,value:s,source:"variable"})}),n.sort((o,s)=>o.name.localeCompare(s.name))}function Cr(e=[]){const t={};return e.forEach(r=>{[r.label,r.token,r.key,...r.aliases||[]].forEach(n=>{const a=ue(n);!a||t[a]||(t[a]={label:r.label,value:r.value,source:r.source,token:r.token||"",key:r.key||"",section:r.section||""})})}),t}function W(e,t,r){const n=M(t);!n||r===""||Object.prototype.hasOwnProperty.call(e,n)||(e[n]=r)}function Er(e,t,r){const n=Ae(t).map(M).filter(Boolean);if(n.length<2||r==="")return;let a=e;for(let o=0;o<n.length-1;o+=1){const s=n[o];if(a[s]===void 0&&(a[s]={}),!a[s]||typeof a[s]!="object"||Array.isArray(a[s]))return;a=a[s]}const i=n[n.length-1];i&&!Object.prototype.hasOwnProperty.call(a,i)&&(a[i]=r)}function _r(e,t=null){if(!t||typeof t!="object")return;const r=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(r).forEach(([n,a])=>{const i=S(a);i!==""&&W(e,n,i)})}function Or({fields:e=[],tokens:t=[],tokenValues:r={},environment:n={},profile:a=null}={}){const i={env:n,raw:r,byToken:{},byKey:{},byLabel:{},available:[],availableTokens:[],availableFields:[]};return t.forEach(o=>{o.token&&(i.byToken[o.token]=S(o.value))}),Object.entries(r||{}).forEach(([o,s])=>{const l=S(s);i.byToken[o]=l,l!==""&&(W(i,o,l),W(i,o.replace(/[{}]/g,""),l))}),_r(i,a),e.forEach(o=>{const s=S(o.value);s!==""&&(o.token&&(i.byToken[o.token]=s),o.key&&(i.byKey[o.key]=s,Er(i,o.key,s)),i.byLabel[o.label]=s,[o.label,o.token,o.key,...o.aliases||[]].forEach(l=>{W(i,l,s)}))}),lt(i,e),i.available=Sr({tokens:t,fields:e,variables:i}),i.availableTokens=i.available.filter(o=>o.token),i.availableFields=e.map(o=>({name:M(o.key||o.token||o.label),token:o.token||"",key:o.key||"",label:o.label||"",value:o.value,source:o.source||"context",aliases:o.aliases||[]})),i}function Vn({tool:e={},values:t={},tokens:r=[],client:n=null,clientInfo:a=[],clientSummary:i=[],profile:o=null}={}){const s=t&&typeof t=="object"?t:{},l=o&&typeof o=="object"?o:null,u=l!=null&&l.tokenValues&&typeof l.tokenValues=="object"?l.tokenValues:{},m={...s,...u},c=Array.isArray(a)?a:[],d=Array.isArray(i)?i:[],p=Tr(r,m),f=kr({tokens:p,clientInfo:c,clientSummary:d,profile:l}),g=new Date().toISOString(),b={apiVersion:ee,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:g};return{apiVersion:ee,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:l||null,values:wr(m,f),tokenValues:m,tokens:p,fields:f,fieldIndex:Cr(f),variables:Or({fields:f,tokens:p,tokenValues:m,environment:b,profile:l}),environment:b,client:n&&typeof n=="object"?n:null,clientInfo:c,clientSummary:d,generatedAt:g}}function Lr(e=""){const t=String(e||"").trim(),r=t.match(/^```(?:json|text)?\s*([\s\S]*?)\s*```$/i);return r?r[1].trim():t}function jn(e=""){const t=Lr(e);if(!t)return"";try{const r=JSON.parse(t);return r&&typeof r=="object"&&!Array.isArray(r)&&typeof r.html=="string"&&r.html.trim()?r.html.trim():""}catch{return""}}function H(e=""){const t=S(e);return t?`value: ${t.slice(0,80)}${t.length>80?"…":""}`:"empty now"}function Dr(e={}){const t=Array.isArray(e.names)?e.names.filter(Boolean):[];return[...new Set([e.name,...t].filter(Boolean))].slice(0,8).join(", ")}function Vr(e=null){var l;if(!e||typeof e!="object")return"No live app context was loaded while copying this prompt. The module must discover variables at runtime with TemplateTool.getContext(), TemplateTool.getVars(), TemplateTool.listVariables(), context.tokens and context.fields.";const t=["Live variable inventory from the current app context:","Use these exact names/tokens/keys when they fit the request, and still keep runtime fallbacks because availability changes per customer."],r=e.profile&&typeof e.profile=="object"?e.profile:null,n=r!=null&&r.vars&&typeof r.vars=="object"?r.vars:{},a=Object.entries(n).filter(([,u])=>S(u)!=="").sort(([u],[m])=>u.localeCompare(m));a.length>0&&(t.push("","Profile variables (TemplateProfile / TemplateVars aliases):"),a.forEach(([u,m])=>{t.push(`- ${u} (${H(m)})`)}));const i=Array.isArray((l=e.variables)==null?void 0:l.available)?e.variables.available:[];i.length>0&&(t.push("","Discoverable TemplateVars.available entries:"),i.forEach(u=>{const m=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",`names: ${Dr(u)||"none"}`,`source ${u.source||"context"}`,H(u.value)].filter(Boolean);t.push(`- ${m.join("; ")}`)}));const o=Array.isArray(e.fields)?e.fields:[];o.length>0&&(t.push("","Resolved context.fields (preferred for visible customer data):"),o.forEach(u=>{const m=[u.label?`label ${u.label}`:"",u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.section?`section ${u.section}`:"",`source ${u.source||"context"}`,H(u.value)].filter(Boolean);t.push(`- ${m.join("; ")}`)}));const s=Array.isArray(e.tokens)?e.tokens:[];return s.length>0&&(t.push("","All configured context.tokens, including empty values:"),s.forEach(u=>{const m=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",u.inputType?`type ${u.inputType}`:"",u.internal?"internal":"manual/configured",H(u.value)].filter(Boolean);t.push(`- ${m.join("; ")}`)})),a.length===0&&i.length===0&&o.length===0&&s.length===0&&t.push("- No variables are currently configured or populated in this context. Build a missing-data state and rely on runtime discovery."),t.join(`
`)}function Fn({title:e="",prompt:t="",runtimeContext:r=null}={}){const n=String(e||"").trim()||"Custom tool",a=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.
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
${lr()}

Current variable inventory:
${Vr(r)}

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

Tool name: ${n}

User request:
${a}`}const Ne="salt-templater-alo-autofill",jr=1,Fr="https://wholesale.swisscom.com/wsg/prod/alo/fuf/web/alo-web/fulfillment/detail.do",$r="https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do?clearModel=true";function $n(e=(r=>(r=(t=>(t=globalThis.window)==null?void 0:t.open)())==null?void 0:r.bind(globalThis.window))()){return typeof e!="function"?null:e($r,"_blank","noopener,noreferrer")}const Y=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function A(e){return e==null?"":String(e).trim()}function y(e){for(const t of e){const r=A(t);if(r)return r}return""}function Br(e){const t=A(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:A(e)}function L(e){const t=A(e);if(!t)return"";const r=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(r)return`${r[1]}-${r[2]}-${r[3]}`;const n=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(n)return`${n[3]}-${n[2]}-${n[1]}`;const a=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return a?`${a[3]}-${a[1].padStart(2,"0")}-${a[2].padStart(2,"0")}`:t}function V(e){const t=L(e),r=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return r?`${r[3]}.${r[2]}.${r[1]}`:t}function zr(e={}){var t,r,n,a,i,o,s;return y([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activation_date,(a=e==null?void 0:e.client)==null?void 0:a.activation,(i=e==null?void 0:e.client)==null?void 0:i.dateActivation,(o=e==null?void 0:e.contact)==null?void 0:o.activationDate,(s=e==null?void 0:e.healthcheck)==null?void 0:s.activationDate])}function Rr(e={}){var t,r,n,a,i,o;return y([(t=e==null?void 0:e.contact)==null?void 0:t.providerOrderRef,(r=e==null?void 0:e.contact)==null?void 0:r.provider_order_ref,(n=e==null?void 0:e.client)==null?void 0:n.providerOrderRef,(a=e==null?void 0:e.client)==null?void 0:a.provider_order_ref,(i=e==null?void 0:e.healthcheck)==null?void 0:i.orderId,(o=e==null?void 0:e.healthcheck)==null?void 0:o.order_id,e==null?void 0:e.orderId,e==null?void 0:e.order_id])}function Mr(e={}){var i;const t=y([e==null?void 0:e.firstPostAt,e==null?void 0:e.firstPostDate,e==null?void 0:e.firstMessageAt,e==null?void 0:e.firstMessageDate]);if(t)return t;const r=(Array.isArray(e==null?void 0:e.attachments)?e.attachments:[]).map(o=>{var l,u;const s=o==null?void 0:o.messageIndex;return{date:y([o==null?void 0:o.date,o==null?void 0:o.messageDate,o==null?void 0:o.messageDateTime,o==null?void 0:o.createdAt,(l=o==null?void 0:o.message)==null?void 0:l.date,(u=o==null?void 0:o.message)==null?void 0:u.createdAt]),messageIndex:s==null||s===""?null:Number(s)}}).filter(o=>o.date&&L(o.date)),n=r.filter(o=>Number.isInteger(o.messageIndex)),a=n.length>0?n:r;return a.sort((o,s)=>n.length>0&&o.messageIndex!==s.messageIndex?o.messageIndex-s.messageIndex:L(o.date).localeCompare(L(s.date))),((i=a[0])==null?void 0:i.date)||""}function Ur(e={}){const t=A(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function Pr(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",r=e.signalState==="never"?"never":"lost",n=t==="lowBadRxTx"?"Bad signal":"No signal",a=V(r==="never"?e.activationDate:e.disconnectionDate);return[n,r==="never"?"Never activated":"Signal lost",a].filter(Boolean).join(" - ")}function Bn(e={}){const t=V(e.disconnectionDate),r=V(e.activationDate),n=e.signalState==="never"?r:t;return{[vt]:n}}function zn(e={},t={}){var l,u,m;const r=y([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(u=e==null?void 0:e.client)==null?void 0:u.externalId,(m=e==null?void 0:e.superOffice)==null?void 0:m.externalTicketId]),n=te(r),a=n.ok?n.fields:{},i=Ur(a),o=L(zr(e)),s=L(Mr(t));return{externalId:r,externalFields:a,aloType:"",signalState:i,disconnectionDate:s,activationDate:o,description:""}}function ct(e={}){return{firstName:A(e.firstName),lastName:A(e.lastName),email:A(e.email),phoneNumber:y([e.phoneNumber,e.phone])}}function Kr(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:y([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[re],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:A(e==null?void 0:e.externalTicketId),tokenValues:t}}function qr(e={},t={},r={},n={}){const a=(e==null?void 0:e.client)||{},i=(e==null?void 0:e.contact)||{},o=(e==null?void 0:e.healthcheck)||{},s=ct(t),l=y([i.fixedNumber,i.voipNumber,i.voip,i.sip,a.fixedNumber,a.fixedPhone]),u=Br(y([a.mobile,a.mobileRaw,a.phone,a.telephone,i.mobile,i.phone])),m=y([n.description,n.aloType==="lowBadRxTx"?"Bad signal":"",Y.problemDescription]),c=y([n.notes,n.signalState?Pr(n):"",Y.problemNotes]),d=n.signalState==="never"?V(n.activationDate):V(n.disconnectionDate);return{externalReference:A(n.extRef),socketId:y([o.otoId,o.oto_id,o.oto]),plugNr:y([o.otoPortId,o.otoPort,o.oto_port]),breakoutCable:y([o.breakoutCableId,o.breakoutCable,o.cable]),breakoutFiber:y([o.fiberNumber,o.fiber,o.fibre]),firstName:y([a.firstName,a.firstname,a.givenName]),lastName:y([a.lastName,a.lastname,a.surname,a.familyName]),contactPhone1:y([l,u]),contactPhone2:l&&u&&l!==u?u:"",contactEmail:y([a.email,a.mail,i.email,i.mail]),notificationType:"Email",preferredContactType:"Mobile",ispFirstName:s.firstName,ispLastName:s.lastName,ispPhone:s.phoneNumber,ispEmail:s.email,...Y,problemDescription:m,problemNotes:c,problemDateTime:d,problemCode3:n.aloType==="lowBadRxTx"?"Performance problem":Y.problemCode3}}function Jr(e={},t={},r={},n={}){const a=qr(e,t,r,n),i=ct(t),o=Kr(r);return{source:Ne,version:jr,fields:a,alo:{orderId:Rr(e),type:n.aloType||"noSignal",signalState:n.signalState||"",disconnectionDate:n.disconnectionDate||"",activationDate:n.activationDate||"",problemDateTime:a.problemDateTime,notes:n.notes||""},client:{firstName:a.firstName,lastName:a.lastName,contactPhone1:a.contactPhone1,contactPhone2:a.contactPhone2,email:a.contactEmail},technical:{socketId:a.socketId,plugNr:a.plugNr,breakoutCable:a.breakoutCable,breakoutFiber:a.breakoutFiber},agent:i,superOffice:o}}function Rn(e={},t={},r={},n={}){return JSON.stringify(Jr(e,t,r,n),null,2)}function Hr(e){var a,i,o;if(!e||typeof e.querySelectorAll!="function")return"";const t=s=>String(s??"").replace(/\s+/g," ").trim(),r=Array.from(e.querySelectorAll(".tooltipCode")).find(s=>t(s==null?void 0:s.textContent)==="translationId=global.extRef"),n=t((o=(i=(a=r==null?void 0:r.closest)==null?void 0:a.call(r,"td"))==null?void 0:i.nextElementSibling)==null?void 0:o.textContent);return n&&n!=="-"?n:""}function ut(e,t){function r(c){return c==null?"":String(c).trim()}function n(c){for(var d=0;d<c.length;d+=1){var p=r(c[d]);if(p)return p}return""}function a(c){return r(c).replace(/[&<>"']/g,function(p){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[p]})}function i(c,d,p){var f=document.getElementById("saltAloFillOverlay");f&&f.remove();var g=document.createElement("div");g.id="saltAloFillOverlay",g.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(p==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",g.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+a(c)+"</strong><span style='color:#d8d8df'>"+a(d)+"</span>",document.body.appendChild(g),p!=="error"&&setTimeout(function(){try{g.remove()}catch{}},4500)}function o(c,d,p){var f=c&&c.fields||{};return n([f[d]].concat(p||[]))}function s(c,d){var p=String(d).replace(/["\\]/g,"\\$&");return document.querySelector("["+c+'="'+p+'"]')}function l(c){return document.getElementById(c)||s("name",c)||s("formcontrolname",c)||s("data-testid",c)}function u(c,d,p){var f=p?String(d??""):r(d);if(!p&&!f)return!1;var g=l(c);if(!g)return!1;if(g.tagName==="SELECT")for(var b=r(f).toLowerCase(),v=0;v<g.options.length;v+=1){var I=g.options[v];if(r(I.value).toLowerCase()===b||r(I.textContent).toLowerCase()===b){g.value=I.value;break}}else"value"in g?g.value=f:g.textContent=f;return g.dispatchEvent(new Event("input",{bubbles:!0})),g.dispatchEvent(new Event("change",{bubbles:!0})),!0}function m(c){if(!c||typeof c!="object"||Array.isArray(c)){i("ALO fill","ALO fill data invalid.","error");return}if(c.source&&c.source!==e){i("ALO fill","Clipboard does not contain ALO fill data from Salt BO tools.","error");return}var d=c.client||{},p=c.technical||c.healthcheck||{},f=c.agent||{},g=0;function b(v,I,$){u(v,I,$)&&(g+=1)}if(b("ticket.extRef",o(c,"externalReference",[])),b("ticket.socketId",o(c,"socketId",[p.socketId,p.otoId,p.oto_id,p.oto])),b("ticket.plugNr",o(c,"plugNr",[p.plugNr,p.otoPortId,p.otoPort,p.oto_port])),b("ticket.breakoutCable",o(c,"breakoutCable",[p.breakoutCable,p.breakoutCableId,p.cable])),b("ticket.breakoutFiber",o(c,"breakoutFiber",[p.breakoutFiber,p.fiberNumber,p.fiber,p.fibre])),b("ticket.otoAddress.firstName",o(c,"firstName",[d.firstName,d.firstname,d.givenName])),b("ticket.otoAddress.lastName",o(c,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),b("ticket.contactPersonFirstName",o(c,"firstName",[d.firstName,d.firstname,d.givenName])),b("ticket.contactPersonLastName",o(c,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),b("ticket.contactPersonPhone1",o(c,"contactPhone1",[d.contactPhone1,d.fixedNumber,d.mobileRaw,d.mobile,d.phone])),b("ticket.contactPersonPhone2",o(c,"contactPhone2",[d.contactPhone2])),b("ticket.contactPersonMail",o(c,"contactEmail",[d.email,d.mail])),b("ticket.contactPersonNotificationsType",o(c,"notificationType",["Email"])),b("ticket.contactPersonPreferredContactType",o(c,"preferredContactType",["Mobile"])),b("ticket.contactPersonIspFirstName",o(c,"ispFirstName",[f.firstName])),b("ticket.contactPersonIspLastName",o(c,"ispLastName",[f.lastName])),b("ticket.contactPersonIspPhone",o(c,"ispPhone",[f.phoneNumber,f.phone])),b("ticket.contactPersonIspMail",o(c,"ispEmail",[f.email])),b("ticket.problemDescription",o(c,"problemDescription",["No signal"])),b("ticket.problemNotes",o(c,"problemNotes",[""]),!0),b("ticket.problemDateTime",o(c,"problemDateTime",[c.alo&&c.alo.problemDateTime])),b("ticket.problemCode1",o(c,"problemCode1",["400"])),b("ticket.problemCode2",o(c,"problemCode2",["800"])),b("ticket.problemCode3",o(c,"problemCode3",["900"])),!g){i("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}i("ALO fill","Fields populated: "+g,"success")}if(t){m(t);return}if(i("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){i("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(d){if(!r(d)){i("ALO fill","Clipboard empty. Click ALO fill in Salt BO tools first.","error");return}var p;try{p=JSON.parse(d)}catch{i("ALO fill","Clipboard does not contain valid ALO data.","error");return}m(p)}).catch(function(d){i("ALO fill","Clipboard error: "+(d&&d.message?d.message:d),"error")})}function Yr(e,t,r,n){function a(m){return m==null?"":String(m).trim()}function i(m){for(var c=0;c<m.length;c+=1){var d=a(m[c]);if(d)return d}return""}function o(m,c,d,p){var f=document.getElementById("saltAloBetaOverlay");f||(f=document.createElement("div"),f.id="saltAloBetaOverlay",f.style.cssText="position:fixed;z-index:2147483647;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(3px);color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:left",f.innerHTML="<div id='saltAloBetaCard' style='position:relative;width:420px;max-width:calc(100vw - 40px);background:rgba(24,24,28,.97);border:1px solid rgba(255,255,255,.12);border-radius:18px;box-shadow:0 22px 60px rgba(0,0,0,.45);padding:24px 26px'><button id='saltAloBetaClose' type='button' aria-label='Close' style='display:none;position:absolute;right:14px;top:12px;border:0;background:transparent;color:#fff;font-size:24px;line-height:1;cursor:pointer'>&times;</button><div style='display:flex;align-items:center;gap:12px;margin-bottom:16px'><div id='saltAloBetaDot' style='width:14px;height:14px;border-radius:50%;background:#21a36a;box-shadow:0 0 18px #21a36a'></div><div id='saltAloBetaTitle' style='font-size:18px;font-weight:700'></div></div><div id='saltAloBetaDetail' style='font-size:14px;line-height:1.5;color:#d8d8df;white-space:pre-line'></div><div style='margin-top:20px;height:5px;background:rgba(255,255,255,.14);border-radius:999px;overflow:hidden'><div id='saltAloBetaBar' style='width:8%;height:100%;background:linear-gradient(90deg,#21a36a,#65d6a0);border-radius:999px;transition:width .25s ease'></div></div></div>",(document.body||document.documentElement).appendChild(f),f.querySelector("#saltAloBetaClose").onclick=function(){f.remove()});var g=p==="error",b=f.querySelector("#saltAloBetaCard"),v=f.querySelector("#saltAloBetaDot"),I=f.querySelector("#saltAloBetaBar");f.querySelector("#saltAloBetaTitle").textContent=m||"ALO beta",f.querySelector("#saltAloBetaDetail").textContent=c||"",f.querySelector("#saltAloBetaClose").style.display=g?"block":"none",b.style.borderColor=g?"rgba(248,113,113,.55)":"rgba(255,255,255,.12)",v.style.background=g?"#ef4444":"#21a36a",v.style.boxShadow=g?"0 0 18px #ef4444":"0 0 18px #21a36a",I.style.width=Math.max(4,Math.min(100,d||0))+"%",I.style.background=g?"linear-gradient(90deg,#ef4444,#fb7185)":"linear-gradient(90deg,#21a36a,#65d6a0)"}function s(){var m=document.getElementById("saltAloBetaOverlay");m&&m.remove()}function l(m){o("ALO beta — impossible de continuer",m,100,"error")}o("ALO beta","Lecture des données préparées…",8,"info");var u;try{u=new URL(t)}catch{l("L’adresse Fulfillment configurée est invalide.");return}if(location.origin!==u.origin){l("Lance ce bookmarklet depuis le site ALO Wholesale.");return}if(!navigator.clipboard||!navigator.clipboard.readText){l("Le presse-papiers n’est pas accessible sur cette page.");return}navigator.clipboard.readText().then(function(c){if(!a(c))throw new Error("Le presse-papiers est vide. Prépare d’abord le ticket depuis Salt BO tools.");var d;try{d=JSON.parse(c)}catch{throw new Error("Le presse-papiers ne contient pas de données ALO valides.")}if(!d||typeof d!="object"||Array.isArray(d))throw new Error("Les données ALO préparées sont invalides.");if(d.source&&d.source!==e)throw new Error("Le presse-papiers ne contient pas les données ALO préparées par Salt BO tools.");var p=i([d.alo&&d.alo.orderId,d.orderId,d.contact&&d.contact.providerOrderRef,d.client&&d.client.providerOrderRef,d.fields&&d.fields.providerOrderRef]);if(!p)throw new Error("Order ID introuvable dans les données VTI. Recapture le client avec le bookmarklet VTI.");return o("ALO beta","Order ID détecté : "+p+`
Chargement de la commande Fulfillment…`,38,"info"),u.searchParams.set("orderId",p),fetch(u.href,{credentials:"include",cache:"no-store",redirect:"follow"}).then(function(g){if(!g.ok)throw new Error("La page Fulfillment a répondu avec l’erreur HTTP "+g.status+".");return g.text()}).then(function(g){o("ALO beta",`Commande chargée.
Recherche de l’External Ref…`,70,"info");var b=new DOMParser().parseFromString(g,"text/html"),v=n(b);if(!v)throw new Error("External Ref introuvable. Vérifie la session ALO et l’Order ID "+p+".");d.fields=Object.assign({},d.fields||{},{externalReference:v}),o("ALO beta","External Ref trouvée : "+v+`
Remplissage du ticket…`,92,"info"),s(),r(e,d)})}).catch(function(c){l(c&&c.message?c.message:String(c))})}function Mn(){const e=JSON.stringify(Ne);return`javascript:(${ut.toString()})(${e});`}function Un(){const e=JSON.stringify(Ne),t=JSON.stringify(Fr);return`javascript:(${Yr.toString()})(${e},${t},(${ut.toString()}),(${Hr.toString()}));`}const Gr=Object.freeze([{id:"captureData",label:"Capture data",key:"q",code:"KeyQ",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),Zr=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function G(e,t){return!!(e!=null&&e[t])}function Wr(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function dt(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Xr(e,t){return G(e,"ctrlKey")===!!t.ctrlKey&&G(e,"altKey")===!!t.altKey&&G(e,"shiftKey")===!!t.shiftKey&&G(e,"metaKey")===!!t.metaKey}function Qr(e,t){return Xr(e,t)&&(Wr(e==null?void 0:e.key,t.key)||dt(e==null?void 0:e.code,t.code))}function Pn(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function en(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(Zr))}function tn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||en(e==null?void 0:e.target))}function Kn(e){if(tn(e))return null;const t=Gr.find(r=>Qr(e,r))||null;return!t||e!=null&&e.isComposing&&!dt(e==null?void 0:e.code,t.code)?null:t}const rn="case-profile-beta-1",mt=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["providerOrderRef","Provider order ref"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),Se=Object.freeze(Object.fromEntries(mt)),pt=Object.freeze(mt.map(([e])=>e)),nn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),de=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),ft=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function k(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function x(...e){for(const t of e){const r=k(t);if(r!=="")return r}return""}function j(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function an(e=""){const t=j(e);return t?t.replace(/_([a-z0-9])/g,(r,n)=>n.toUpperCase()):""}function Ce(e=""){const t=an(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ue(e=""){const t=j(e);return t?`{${t}}`:""}function F(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function on(){const e={};return pt.forEach(t=>{e[t]=""}),{version:rn,fields:e,fieldLabels:{...Se},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function bt(e){return k(e)!==""}function w(e,t,r,{overwrite:n=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const a=k(r);return a===""||!n&&bt(e.fields[t])?!1:(e.fields[t]=a,e[t]=a,!0)}function Ee(e,t,r,{overwrite:n=!1,label:a=""}={}){const i=Ce(t),o=k(r);return!i||o===""||ft.has(i)||!n&&Object.prototype.hasOwnProperty.call(e.dynamic,i)?!1:(e.dynamic[i]=o,a&&!e.fieldLabels[i]&&(e.fieldLabels[i]=a),!0)}function sn(e,t,r,n={}){const a=j(ne(t)||t),i=de[a]||de[j(t)]||Ce(t);return Object.prototype.hasOwnProperty.call(e.fields,i)?w(e,i,r,n):Ee(e,t,r,n)}function ln(e,t={},r={}){Object.entries(t).forEach(([n,a])=>w(e,n,a,r))}function me(e,t=[],r=[]){return Array.isArray(e)?(e.forEach((n,a)=>{t.push(String(a+1)),me(n,t,r),t.pop()}),r):e&&typeof e=="object"?(Object.keys(e).forEach(n=>{t.push(n),me(e[n],t,r),t.pop()}),r):(r.push({path:t.slice(),value:k(e)}),r)}function cn(e=[]){return e[0]===he||e[0]===ge}function ht(e,t,{prefix:r="",skipInternalClientKeys:n=!1}={}){!t||typeof t!="object"||me(t).filter(a=>a.value!=="").filter(a=>!n||!cn(a.path)).forEach(a=>{const i=r?[r,...a.path]:a.path;Ee(e,i.join("_"),a.value,{label:i.map(F).join(" ")})})}function Pe(e=[],t=[]){const r=new Map;return[...e,...t].forEach(n=>{if(!n||typeof n!="object")return;const a=`${k(n.url)}|${k(n.name)}|${k(n.id)}`;a.replace(/\|/g,"")&&(r.has(a)||r.set(a,n))}),Array.from(r.values())}function _e(e){const t=k(e);if(!t)return null;const r=te(t);return r.ok?{externalId:t,fields:r.fields}:null}function gt(e,t){var r,n,a,i;t&&(w(e,"externalId",t.externalId),Object.entries(nn).forEach(([o,s])=>{var l;w(e,s,(l=t.fields)==null?void 0:l[o])}),w(e,"contractorNumber",(r=t.fields)==null?void 0:r.customer),w(e,"lexId",(n=t.fields)==null?void 0:n.lexId),w(e,"oltName",(a=t.fields)==null?void 0:a.oltName),w(e,"oltBoard",(i=t.fields)==null?void 0:i.oltBoard))}function un(e,t){var s;if(!t||typeof t!="object")return;const r=t.client||{},n=t.contact||{},a=t.healthcheck||{},i=a.crossConnexion||a.crossConnection||{},o=[r.firstName,r.lastName].map(k).filter(Boolean).join(" ");ln(e,{clientName:o||x(r.fullName,r.name,r.customerName),title:r.title,firstName:r.firstName,lastName:r.lastName,contractorNumber:x(r.contractorNumber,r.contractor,a.customerId),mobile:x(r.mobile,r.phone,r.telephone),mobileRaw:r.mobileRaw,phone:x(r.phone,r.telephone,n.fixedNumber),email:r.email,address:r.address,communicationLanguage:x(r.communicationLanguage,n.communicationLanguage,r.language,n.language),activationDate:x(r.activationDate,r.activation_date,r.activation,r.dateActivation,(s=t.offer)==null?void 0:s.activationDate,n.activationDate,a.activationDate),eligibilitySource:x(r.eligibilitySource,n.eligibilitySource),contactRecordId:x(r.contactRecordId,n.contactRecordId),fixedNumber:n.fixedNumber,publicId:n.publicId,providerOrderRef:n.providerOrderRef,fllRecordId:a.fllRecordId,otoId:x(a.otoId,a.oto_id,a.oto),otoPortId:x(a.otoPortId,a.otoPort,a.oto_port,i.Port),routerSerialNumber:a.routerSerialNumber,oldRouterSerialNumber:a.oldRouterSerialNumber,lexId:a.lexId,oltName:a.oltName,oltBoard:a.oltBoard,ponPort:a.ponPort,breakoutCableId:a.breakoutCableId,fiberNumber:a.fiberNumber,lineState:a.lineState,routerStatus:a.routerStatus,odfId:a.odfId,option82:a.option82,oltObject:a.oltObject,ontConfigurationFilename:a.ontConfigurationFilename,svlan:a.svlan,customerId:a.customerId,crossConnectionEquipment:i.Equipment,crossConnectionRack:i.Rack,crossConnectionSlot:i.Slot,crossConnectionPort:i.Port}),gt(e,_e(t[ge])),ht(e,t,{skipInternalClientKeys:!0})}function dn(e,t){var a;if(!t||typeof t!="object")return;w(e,"soTicketNum",x(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(a=t.tokenValues)==null?void 0:a[re])),w(e,"ticketCreatedAt",x(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),gt(e,_e(t.externalTicketId)),Tt(e,t.tokenValues);const r=K(t.attachments),n=ke(r);e.attachments=Pe(e.attachments,r),e.photos=Pe(e.photos,n),ht(e,t,{prefix:"ticket"})}function Tt(e,t={},r={}){!t||typeof t!="object"||Object.entries(t).forEach(([n,a])=>{const i=k(a);if(i==="")return;const o=ne(n),s=xt(o)||j(n),l=de[s];l&&w(e,l,i,r),s==="external_customer"&&w(e,"contractorNumber",i,r),s==="external_lex_id"&&w(e,"lexId",i,r),s==="external_olt_name"&&w(e,"oltName",i,r),s==="external_olt_board"&&w(e,"oltBoard",i,r),Ee(e,s,i,{...r,label:F(s)})})}function mn(e,t){const r=t==null?void 0:t[he];!r||typeof r!="object"||Array.isArray(r)||Object.entries(r).forEach(([n,a])=>{sn(e,n,a,{overwrite:!0,label:F(n)})})}function Ke(e,t,r){const n=Ce(t),a=k(r);!n||a===""||ft.has(n)||Object.prototype.hasOwnProperty.call(e,n)||(e[n]=a)}function pn(e,t={}){const r={},n={},a=[];pt.forEach(s=>{const l=k(e.fields[s]);if(l==="")return;Ke(r,s,l);const u=Ue(s);u&&(n[u]=l),a.push({key:s,label:Se[s]||F(s),value:l})}),Object.entries(e.dynamic).forEach(([s,l])=>{const u=k(l);if(u==="")return;Ke(r,s,u);const m=Ue(s);m&&!Object.prototype.hasOwnProperty.call(n,m)&&(n[m]=u),e.fields[s]||a.push({key:s,label:e.fieldLabels[s]||F(s),value:u})});const i=_e(e.externalId);i&&Object.assign(n,pe(i.fields)),bt(e.soTicketNum)&&(n[re]=e.soTicketNum);const o={};return Object.entries(t||{}).forEach(([s,l])=>{const u=ne(s)||s;o[u]=l}),e.vars=r,e.variables=r,e.tokenValues={...o,...n},e.availableFields=a,e}function qn({clientPayload:e=null,superOfficePayload:t=null,tokenValues:r={}}={}){const n=on();return un(n,e),dn(n,t),Tt(n,r),mn(n,e),pn(n,r)}function h(e,t,r=""){var a;const n=k((e==null?void 0:e[t])??((a=e==null?void 0:e.fields)==null?void 0:a[t]));return n?{label:r||Se[t]||F(t),value:n}:null}function E(e,t){const r=k(t);return r?{label:e,value:r}:null}function yt(e=[]){const t=new Set;return e.filter(Boolean).filter(r=>{const n=`${j(r.label)}:${r.value}`;return t.has(n)?!1:(t.add(n),!0)})}function Z(e,t,r=[]){const n=yt(r);return n.length>0?{id:e,title:t,fields:n}:null}function Jn(e=null){return!e||typeof e!="object"?[]:yt([E("Name",e.clientName),E("Mobile",x(e.mobile,e.mobileRaw,e.phone)),E("Contractor",x(e.contractorNumber,e.externalCustomer,e.customerId)),E("Activation",e.activationDate),E("OTO ID",e.otoId),E("Port",x(e.otoPortId,e.crossConnectionPort)),E("SO ticket",e.soTicketNum)])}function Hn(e=null){return!e||typeof e!="object"?[]:[Z("caseClient","Client",[h(e,"clientName","Full name"),h(e,"contractorNumber","Contractor"),h(e,"title"),h(e,"firstName"),h(e,"lastName"),h(e,"mobile"),h(e,"mobileRaw","Mobile raw"),h(e,"phone"),h(e,"email"),h(e,"address"),h(e,"communicationLanguage","Language"),h(e,"activationDate","Activation date")]),Z("caseSuperOffice","SuperOffice",[h(e,"soTicketNum","SO ticket"),h(e,"ticketCreatedAt","Created at"),h(e,"externalId","External ID"),h(e,"externalPartner","Partner"),h(e,"externalPartnerTicketNumber","Partner ticket")]),Z("caseExternalId","External ID fields",[h(e,"externalFlagging","Flagging"),h(e,"externalDate","Date"),h(e,"externalCustomer","Contractor"),h(e,"externalSignalStatus","Signal"),h(e,"externalLedStatus","LED"),h(e,"externalTreatmentStep","Treatment"),h(e,"externalBoxType","Box"),h(e,"externalLexId","LEX ID"),h(e,"externalOltName","OLT"),h(e,"externalOltBoard","Board"),h(e,"externalBokBof","BOK/BOF"),h(e,"externalComment","Comment")]),Z("caseTechnical","Technical",[h(e,"fllRecordId","FLL record"),h(e,"otoId","OTO ID"),h(e,"otoPortId","OTO port"),h(e,"routerSerialNumber","Router serial"),h(e,"oldRouterSerialNumber","Old router serial"),h(e,"lexId","LEX ID"),h(e,"oltName","OLT"),h(e,"oltBoard","OLT board"),h(e,"ponPort","PON port"),h(e,"breakoutCableId","Breakout cable"),h(e,"fiberNumber","Fiber number"),h(e,"lineState","Line state"),h(e,"routerStatus","Router status"),h(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{Un as A,Pn as B,Tn as C,Fn as D,jn as E,ve as F,kn as G,Gr as K,yn as P,Jt as S,We as a,wn as b,_n as c,Sn as d,Ln as e,Vn as f,O as g,On as h,xn as i,Dn as j,qn as k,Cn as l,Hn as m,Jn as n,Zt as o,vn as p,In as q,En as r,An as s,zn as t,Rn as u,$n as v,Nn as w,Kn as x,Bn as y,Mn as z};
