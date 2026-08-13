import{c as qe}from"./appConfigService-CoHKYyKb.js";import{p as te,b as fe,S as re,x as ne,O as V,r as U,B as vt,J as pe,V as be,Y as he,Z as ge,_ as xt,f as wt}from"./tokenService-BU93B5NF.js";import{l as K,s as Te,d as It}from"./templateTreeService-ftQ4_DaS.js";import{f as Je,u as He}from"./templateTreeOperations-BphLAAWy.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],En=qe("chevron-right",At);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],Cn=qe("puzzle",St),Nt=/\.(jpe?g|jfif|png|webp|gif|bmp|avif|heic|heif|tiff?|ico|svg)(?:$|[?#])/i,Et=/\.(mp4|mov)(?:$|[?#])/i,Ct=/\.pdf(?:$|[?#])/i,_t=["{contractor}","{contractor_number}","{client_contractor_number}"];function T(...e){for(const t of e){const r=String(t??"").trim();if(r)return r}return""}function Ot(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function Lt(e="",t=""){const r=`${e} ${t}`;return Nt.test(r)?"image":Et.test(r)?"video":Ct.test(r)?"pdf":"file"}function Dt(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function Vt(e=""){const t=String(e||"").trim().toLowerCase();return t==="video"||t==="mp4"||t==="mov"||t.startsWith("video/")}function jt(e=""){const t=String(e||"").trim().toLowerCase();return t==="pdf"||t==="application/pdf"}function $t(...e){for(const t of e){if(Dt(t))return"image";if(Vt(t))return"video";if(jt(t))return"pdf"}return""}function Ft(...e){for(const t of e){const r=T(t),n=r.toLowerCase();if(n){if(n.includes("/"))return r;if(n==="pdf")return"application/pdf";if(n==="mp4")return"video/mp4";if(n==="mov")return"video/quicktime"}}return""}function Bt(e={}){var t,r,n;return T(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(r=e.message)==null?void 0:r.createdAt,(n=e.message)==null?void 0:n.sentAt)||null}function R(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function Rt(e,t){var l,u,m,c,d;if(!e||typeof e!="object"||Array.isArray(e))return null;const r=T(e.url,e.href,e.src,e.downloadUrl);if(!r)return null;const n=T(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((l=String(r).split("/").pop())==null?void 0:l.split("?")[0])||""))||`Attachment ${t+1}`,o=T(e.type,e.contentType,e.mimeType),i=Ft(e.contentType,e.mimeType,e.type,e.mediaType),a=$t(e.type,e.contentType,e.mimeType,e.mediaType)||Lt(n,r),s=T(e.messageId,e.messageID,e.postId,(u=e.message)==null?void 0:u.id)||null;return{id:T(e.id,e.attachmentId,e.documentId)||`${t}-${n}-${r}`,name:n,url:r,dataUrl:T(e.dataUrl)||null,type:a,contentType:i||o||null,size:T(e.size,e.sizeText,e.fileSize)||null,messageId:s,postId:T(e.postId,s)||null,messageIndex:R(T(e.messageIndex,e.messageOrder,e.postIndex,(m=e.message)==null?void 0:m.index)),attachmentIndex:R(T(e.attachmentIndex,e.fileIndex)),messageAuthor:T(e.messageAuthor,e.author,e.createdBy,(c=e.message)==null?void 0:c.author,(d=e.message)==null?void 0:d.createdBy)||null,source:T(e.source,e.origin)||null,date:Bt(e)}}function $e(e){return String(e).padStart(2,"0")}function zt(e){const t=e.getFullYear(),r=$e(e.getMonth()+1),n=$e(e.getDate());return{dateKey:`${t}-${r}-${n}`,label:`${n}.${r}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function Fe(e,t,r,n=0,o=0,i=0){if(t<0||t>11||r<1||r>31||n<0||n>23||o<0||o>59||i<0||i>59)return null;const a=new Date(e,t,r,n,o,i);return a.getFullYear()!==e||a.getMonth()!==t||a.getDate()!==r?null:a}function Mt(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const i=new Date(e);return Number.isNaN(i.getTime())?null:i}const t=String(e).trim();if(!t)return null;const r=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(r){const i=Fe(Number(r[1]),Number(r[2])-1,Number(r[3]),Number(r[4]||0),Number(r[5]||0),Number(r[6]||0));if(i)return i}const n=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const i=Number(n[1]),a=n[2],s=Number(n[3]),l=Number(n[4]),u=l<100?2e3+l:l,m=Number(n[5]||0),c=Number(n[6]||0),d=Number(n[7]||0),f=a==="/"&&s>12&&i<=12,p=f?s:i,g=(f?i:s)-1,b=Fe(u,g,p,m,c,d);if(b)return b}const o=new Date(t);return Number.isNaN(o.getTime())?null:o}function ye(e={}){const t=Mt(e.date);return t?zt(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function Ut(e,t){const r=T(t);r&&_t.forEach(n=>{e[n]=r})}function Be(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function Kt(e,t,r){const n=ne(t),o=T(r);!n||!o||e.push([n,o])}function Ye(e,t=[]){const r=[];return Be(e)&&Object.entries(e).forEach(([n,o])=>{if(Be(o)){r.push(...Ye(o,[...t,n]));return}Kt(r,[...t,n].join("."),o)}),r}function Pt(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(r=>{Ye(e[r]).forEach(([n,o])=>{t[n]=o})}),t}function P(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(Rt).filter(Boolean).filter(r=>{const n=`${r.name}|${r.url}`;return t.has(n)?!1:(t.add(n),!0)})}function ke(e=[]){return P(e).filter(t=>t.type==="image")}function ve(e=[]){return P(e).filter(t=>["image","video","pdf"].includes(t.type))}function qt(e=[]){const t=new Map;return e.forEach((r,n)=>{const o=ye(r);t.has(o.dateKey)||t.set(o.dateKey,{...o,postLabel:"Post non identifié",dateLabel:o.label,author:T(r.messageAuthor),attachments:[]}),t.get(o.dateKey).attachments.push({...r,galleryIndex:n})}),Array.from(t.values()).sort((r,n)=>n.sortValue-r.sortValue)}function Re(e={}){var t;return T(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function ze(e={},t=0){const r=R(e.messageNumber),n=R(e.messageIndex);return`Post ${r||(n===null?t+1:n+1)}`}function Jt(e={}){const t=ye(e),r=T(e.messageAuthor);return t.dateKey==="unknown"?r:[t.label,r].filter(Boolean).join(" · ")}function _n(e=[]){const t=ve(e);if(!t.some(n=>Re(n)))return qt(t);const r=new Map;return t.forEach((n,o)=>{const i=Re(n),a=ye(n),s=i||`unassigned:${a.dateKey}`;if(!r.has(s)){const l=r.size;r.set(s,{dateKey:s,label:i?ze(n,l):a.label,metaLabel:i?Jt(n):"",postLabel:i?ze(n,l):"Post non identifié",dateLabel:a.label,author:T(n.messageAuthor),sortValue:R(n.messageIndex)??o,attachments:[]})}r.get(s).attachments.push({...n,galleryIndex:o})}),Array.from(r.values()).sort((n,o)=>n.sortValue-o.sortValue)}function On(e){var g,b,v,I,F,Oe,Le,De,Ve,je;const t=Ot(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const r=T(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),n=T(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),o=T(t.firstPostAt,t.firstPostDate,t.firstMessageAt,t.firstMessageDate,(b=(g=t.posts)==null?void 0:g[0])==null?void 0:b.createdAt,(I=(v=t.posts)==null?void 0:v[0])==null?void 0:I.date,(Oe=(F=t.messages)==null?void 0:F[0])==null?void 0:Oe.createdAt,(De=(Le=t.messages)==null?void 0:Le[0])==null?void 0:De.date),i=T(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),a=T(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(Ve=t.client)==null?void 0:Ve.contractorNumber,(je=t.client)==null?void 0:je.contractor),s={};let l=null,u=!1;const m=P(t.attachments),c=ke(m),d=ve(m);if(i){const se=te(i);se.ok&&(u=!0,l=se.fields,Object.assign(s,fe(se.fields)))}Object.assign(s,Pt(t));const f=(l==null?void 0:l.customer)||a;f&&(u||r||m.length>0)&&Ut(s,f);const p=r||(l==null?void 0:l.soTicket)||"";return p&&(s[re]=p),Object.keys(s).length===0&&m.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:u,externalTicketId:i}:{ok:!0,ticketId:p,sourceTicketId:r,createdAt:n,firstPostAt:o,externalTicketId:i,contractorNumber:f,externalIdValid:u,externalFields:l,tokenValues:s,attachments:m,imageAttachments:c,mediaAttachments:d,ignoredExternalId:!!(i&&!u)}}const q="super_office_ticket_payload",xe="pending_super_office_ticket_payload",oe="previous_super_office_ticket_payload",Ht="super-office-ticket-updated";function Yt(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[he]:t,[ge]:r,...n}=e;return n}function le(e){return Array.isArray(e)?`[${e.map(le).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${le(e[t])}`).join(",")}}`:JSON.stringify(e)}function L(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return le(Yt(e))}catch{return""}}const Gt=new Set(["billingaccount","contractornumber","customerid","publicid","contactrecordid"]);function ce(e,t=new Map){return!e||typeof e!="object"||Array.isArray(e)||Object.entries(e).forEach(([r,n])=>{if(r.startsWith("__"))return;const o=r.replace(/[^a-z0-9]/gi,"").toLowerCase();if(Gt.has(o)){const i=String(n??"").trim().toLowerCase();i&&t.set(o,i);return}n&&typeof n=="object"&&ce(n,t)}),t}function Ln(e,t){const r=ce(e),n=ce(t);for(const[o,i]of r)if(n.get(o)===i)return!0;return L(e)===L(t)}function z(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(Ht,{detail:{payload:e}}))}function E(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=P(e.attachments),r=String(e.clientSignature||"").trim(),n=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([o,i])=>[o,i==null?"":String(i)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),firstPostAt:String(e.firstPostAt||e.firstPostDate||e.firstMessageAt||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:r,tokenValues:n,attachments:t,imageAttachments:ke(t),mediaAttachments:ve(t)}}function Xt(e,t=new Date,r=""){return E({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",firstPostAt:(e==null?void 0:e.firstPostAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:r,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function ae(e){e&&await be(q,e)}async function Ge(e){e&&await be(oe,e)}async function Xe(e){e&&await be(xe,e)}async function ie(){try{return E(await V(xe,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function Dn(){return ie()}async function Zt(){return await Ze()||await ie()}async function Vn(){return!!await Zt()}function we(){return pe(xe)}function W(){return pe(oe)}async function jn(e){const t=await U(),r=Xt(e,new Date,L(t));if(!r)return null;if(!r.clientSignature)return await Q(),await Xe(r),z(null),r;const n=E(await V(q,null)),o=(n==null?void 0:n.ticketId)||(n==null?void 0:n.sourceTicketId)||"",i=r.ticketId||r.sourceTicketId||"";return(n==null?void 0:n.clientSignature)===r.clientSignature&&o&&i&&o!==i&&await Ge(n),await ae(r),await we(),z(r),r}async function $n(e){const t=vt(e);if(!t)return null;const r=await Ze(),n=r?null:await ie(),o=r||n;if(!o)return null;const i=te(t),a=i.ok?{...o.tokenValues||{},...fe(i.fields)}:o.tokenValues||{},s=E({...o,externalTicketId:t,tokenValues:a});return s?(s.clientSignature?await ae(s):await Xe(s),z(s),s):null}function Q(){return pe(q)}async function Fn(){const e=await ie(),t=L(await U());if(!e||!t)return null;const r={...e,clientSignature:t};return await ae(r),await we(),z(r),r}async function Ze(){try{const e=await V(q,null);if(!e)return null;const t=L(await U());if(!t)return await Q(),await W(),null;if((e==null?void 0:e.clientSignature)!==t)return await Q(),await W(),null;const r=E(e);return r||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function Bn(){try{const e=E(await V(oe,null));if(!e)return null;const t=L(await U());return!t||e.clientSignature!==t?(await W(),null):e}catch(e){return console.error("loadPreviousSuperOfficeTicketPayload error",e),null}}async function Rn(){const e=L(await U());if(!e)return!1;const t=E(await V(q,null)),r=E(await V(oe,null));return await Promise.all([t?ae({...t,clientSignature:e}):Promise.resolve(),r?Ge({...r,clientSignature:e}):Promise.resolve()]),!!(t||r)}async function zn(){await Q(),await we(),await W(),z(null)}const Wt=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function Ie(e){return e==null?e:JSON.parse(JSON.stringify(e))}function B(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function O(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function We(e=[]){return new Map(e.map(t=>[t.id,t]))}function Qe(e,t){if(!e)return"";const r=[],n=new Set;let o=e;for(;o&&!n.has(o.id);)n.add(o.id),r.unshift(o.title||o.id),o=o.parentId?t.get(o.parentId):null;return r.join(" / ")}function Qt(e=[]){const t=We(e);return e.map(r=>({...r,path:Qe(r,t)}))}function et(e=[],t){const r=String(t||"").trim();if(!r)return null;const n=We(e);if(n.has(r))return n.get(r);const o=O(r);return e.find(i=>O(i.title)===o||O(Qe(i,n))===o)||null}function er(e=[],t={}){return et(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function tr(e=[],t={}){return et(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function rr(e,t={},r=null){const n=B(t.templateIds||t.templateId).map(String).filter(Boolean);if(n.length>0&&!n.includes(e.id)||r&&!(e.nodeIds||[]).includes(r.id))return!1;const o=B(t.channels||t.channel).map(s=>String(s||"").trim()).filter(Boolean);if(o.length>0&&!o.some(s=>(e.channels||[]).includes(s)))return!1;const i=String(t.title||t.templateTitle||"").trim();if(i&&O(e.title)!==O(i))return!1;const a=B(t.titleIncludes||t.templateTitleIncludes).map(O).filter(Boolean);if(a.length>0){const s=O(e.title);if(!a.some(l=>s.includes(l)))return!1}return!0}function nr({template:e,sourceNode:t,targetNode:r,reason:n=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:r.id,targetNodeTitle:r.title||"",reason:n}}function tt({nodes:e=[],templates:t=[]}={}){return{nodes:Qt(e),templates:Ie(t),counts:{nodes:e.length,templates:t.length}}}function rt(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([r,n])=>{Wt.has(r)&&(t[r]=n)}),t}async function nt(){return tt(await K())}async function or(){return nt()}async function ar(e=[]){const t=B(e),{nodes:r,templates:n}=await K(),o=[],i=[];return t.forEach((a,s)=>{if(!a||typeof a!="object"||Array.isArray(a)){i.push({ruleIndex:s,reason:"Rule must be an object."});return}const l=tr(r,a);if(!l){i.push({ruleIndex:s,reason:"Target topic was not found."});return}const u=er(r,a),m=n.filter(c=>rr(c,a,u));if(m.length===0){i.push({ruleIndex:s,reason:"No templates matched this rule."});return}m.forEach(c=>{(c.nodeIds||[])[0]===l.id&&(!u||u.id===l.id)||o.push(nr({template:c,sourceNode:u,targetNode:l,reason:a.reason||`Rule ${s+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:o.length,affectedTemplateCount:new Set(o.map(a=>a.templateId)).size,operations:o,skipped:i}}async function ir(e=[]){const t=B(e),r=await K();let n=r.nodes,o=r.templates;const i=[],a=[];return t.forEach((s,l)=>{var m;const u=(s==null?void 0:s.action)||(s==null?void 0:s.type);if(!s||typeof s!="object"||Array.isArray(s)){a.push({operationIndex:l,reason:"Operation must be an object."});return}if(u==="moveTemplate"){const c=String(s.templateId||""),d=String(s.targetNodeId||s.toNodeId||"");if(!c||!d){a.push({operationIndex:l,reason:"moveTemplate requires templateId and targetNodeId."});return}const f=o.find(b=>b.id===c),p=s.sourceNodeId||((m=f==null?void 0:f.nodeIds)==null?void 0:m[0])||null,g=JSON.stringify(o);o=Je(o,c,p,d,Number(s.targetIndex),n),JSON.stringify(o)!==g&&i.push({operationIndex:l,action:u,templateId:c,targetNodeId:d});return}if(u==="updateTemplate"){const c=String(s.templateId||"");if(!c){a.push({operationIndex:l,reason:"updateTemplate requires templateId."});return}const d=rt(s.patch||s.fields||{}),f=JSON.stringify(o);o=He(o,c,d),JSON.stringify(o)!==f&&i.push({operationIndex:l,action:u,templateId:c});return}a.push({operationIndex:l,reason:`Unsupported operation: ${u||"unknown"}.`})}),i.length>0&&await Te({nodes:n,templates:o}),{ok:!0,appliedCount:i.length,skippedCount:a.length,applied:i,skipped:a,tree:tt({nodes:n,templates:o})}}async function sr(e,t={}){const r=String(e||"");if(!r)throw new Error("templateId is required.");const n=await K();if(!n.templates.some(i=>i.id===r))throw new Error("Template was not found.");const o=He(n.templates,r,rt(t));return await Te({nodes:n.nodes,templates:o}),{ok:!0,template:Ie(o.find(i=>i.id===r))}}async function lr(e,t,r={}){var u;const n=String(e||""),o=String(t||"");if(!n||!o)throw new Error("templateId and targetNodeId are required.");const i=await K();if(!i.templates.some(m=>m.id===n))throw new Error("Template was not found.");const a=i.templates.find(m=>m.id===n),s=(r==null?void 0:r.sourceNodeId)||((u=a==null?void 0:a.nodeIds)==null?void 0:u[0])||null,l=Je(i.templates,n,s,o,Number(r==null?void 0:r.targetIndex),i.nodes);return await Te({nodes:i.nodes,templates:l}),{ok:!0,template:Ie(It(l.find(m=>m.id===n)))}}async function Mn(e,t={}){switch(e){case"tool:templates:list":return nt();case"tool:templates:get-tree":return or();case"tool:templates:preview-migration":return ar(t.rules||t);case"tool:templates:apply-migration":return ir(t.operations||t);case"tool:templates:update-template":return sr(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return lr(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const ee="template-tool-module-beta-2",ot=Object.freeze({name:"Template Generator Module API",version:ee,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",containers:{"context.profile / TemplateProfile":"Normalized customer and case profile with common scalar fields, tokenValues, vars, photos and attachments.","context.variables / TemplateVars":"Variable-friendly aliases generated from profile fields, tokens and visible client fields. This is the preferred object for JavaScript property access.","TemplateVars.byToken":"Exact token lookup keyed by brace tokens such as {client_first_name}. Includes known tokens even when the current value is empty.","TemplateVars.byKey":"Lookup keyed by structured token keys such as client.firstName or contractorNumber.","TemplateVars.byLabel":"Lookup keyed by user-facing field labels from the app.","TemplateVars.available":"Discovery list for every exposed variable with names, token, key, label, value, source, inputType and internal.","TemplateVars.availableTokens":"Subset of TemplateVars.available that comes from token definitions.","TemplateVars.availableFields":"Visible normalized field list with aliases for customer-facing selectors.","context.tokens":"All configured token definitions, including manual/internal tokens and empty values.","context.fields / TemplateFields":"Best normalized list for user-facing customer, case and profile fields.","context.fieldIndex":"Normalized lookup map for labels, tokens, keys and aliases with punctuation/accent/braces removed.","context.client":"Raw imported VTI/customer payload. Use only when the module needs structured nested source data.","context.clientInfo":"Visible client detail sections used by the app UI.","context.clientSummary":"Compact client bar fields currently selected in the app."},examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']","TemplateVars.available.map((entry) => entry.name)"],reservedContainers:["env","raw","byToken","byKey","byLabel","available","availableTokens","availableFields"]},dataAccess:{appDatabase:"Authorized only through TemplateTool APIs. TemplateTool.templates reads and writes the app's IndexedDB-backed topic/template data through host services.",internet:"Public Internet API/database access is authorized for explicit user-requested public HTTP(S) read requests. Prefer TemplateTool.fetchJson(url) or TemplateTool.fetchText(url) for CORS-enabled Internet APIs/databases.",restrictions:"Do not use secrets, cookies, credentials, private/local network URLs, remote scripts, CDNs, remote fonts, eval, parent DOM access, localStorage or raw IndexedDB."},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object with scalar aliases plus available, availableTokens, availableFields, byToken, byKey and byLabel discovery containers",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.fetchJson(url)":"Promise<{ ok, status, url, contentType, data?, text?, error?, truncated? }>","TemplateTool.fetchText(url)":"Promise<{ ok, status, url, contentType, text?, error?, truncated? }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function cr(e=ot){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([r,n])=>{t.push(`- window.${r}: ${n.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),e.variables.containers&&typeof e.variables.containers=="object"&&(t.push("","Variable containers:"),Object.entries(e.variables.containers).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)})),t.push("","Variable examples:"),(e.variables.examples||[]).forEach(r=>{t.push(`- ${r}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),e.dataAccess&&typeof e.dataAccess=="object"&&(t.push("","Data access:"),Object.entries(e.dataAccess).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)})),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)}),t.join(`
`)}const ur=`
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
</style>`,dr=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${ee}";
    var apiReference = ${JSON.stringify(ot)};
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
<\/script>`,mr=`<!doctype html>
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
</html>`;function fr(e=""){var l;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const r=t.match(/```(?:html)?\s*([\s\S]*?)```/i),n=((l=r==null?void 0:r[1])==null?void 0:l.trim())||t,o=n.match(/<!doctype\s+html\b|<html[\s>]/i);if(!o)return n;const i=o.index||0,a=n.slice(i).trim(),s=a.match(/<\/html\s*>/i);return s?a.slice(0,s.index+s[0].length).trim():a}function pr(e=""){const t=fr(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:mr}function br(e,t,r){return e.includes(r)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function hr(e,t,r){return e.includes(r)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Un(e=""){const t=pr(e),r=hr(t,dr,"template-tool-bridge");return br(r,ur,"template-tool-host-style")}const Me=3e5;function gr(e=""){const t=e.split(".").map(o=>Number(o));if(t.length!==4||t.some(o=>!Number.isInteger(o)||o<0||o>255))return!1;const[r,n]=t;return r===0||r===10||r===127||r===169&&n===254||r===172&&n>=16&&n<=31||r===192&&n===168}function Tr(e=""){try{const t=new URL(String(e||"").trim());if(!["http:","https:"].includes(t.protocol))return!1;const r=t.hostname.toLowerCase().replace(/^\[|\]$/g,"");return!(!r||r==="localhost"||r.endsWith(".localhost")||r.endsWith(".local")||r==="::1"||r==="0:0:0:0:0:0:0:1"||gr(r))}catch{return!1}}async function Kn({url:e="",responseType:t="json"}={}){const r=String(e||"").trim(),n=t==="json";if(!Tr(r))return{ok:!1,status:0,url:r,contentType:"",error:"Only public http/https URLs can be fetched by a module."};try{const o=await fetch(r,{method:"GET",credentials:"omit",cache:"no-store",redirect:"follow",headers:{Accept:n?"application/json, text/plain;q=0.8, */*;q=0.5":"text/plain, application/json;q=0.8, */*;q=0.5"}}),i=o.headers.get("content-type")||"",a=await o.text(),s=a.length>Me,l=s?a.slice(0,Me):a,u={ok:o.ok,status:o.status,url:o.url||r,contentType:i,truncated:s};if(!n)return{...u,text:l};try{return{...u,data:l?JSON.parse(l):null}}catch{return{...u,ok:!1,text:l,error:"The Internet response was not valid JSON."}}}catch(o){return{ok:!1,status:0,url:r,contentType:"",error:(o==null?void 0:o.message)||"Internet request failed."}}}function yr(e=[],t={}){return Array.isArray(e)?e.filter(r=>r==null?void 0:r.token).map(r=>{const n=Object.prototype.hasOwnProperty.call(t,r.token)?t[r.token]:r.previewValue;return{token:r.token,label:r.label||r.token,key:r.key||"",inputType:r.input_type||r.inputType||"text",value:n??"",internal:!!r.internal,aliases:Array.isArray(r.searchAliases)?r.searchAliases.filter(Boolean):[]}}):[]}function N(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function ue(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function at(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function it(e=""){const t=at(e);return t?t.replace(/_([a-z0-9])/g,(r,n)=>n.toUpperCase()):""}function M(e=""){const t=it(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ae(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function J(e,t){const r=String(t||"").trim();!r||e.includes(r)||e.push(r)}function S(e,t){const r=String(t||"").trim();if(!r)return;J(e,r);const n=at(r),o=it(r);n&&(J(e,n),J(e,`{${n}}`)),o&&J(e,o)}function st({label:e="",token:t="",key:r="",aliases:n=[],section:o=""}={}){const i=[];S(i,e),S(i,t),S(i,t.replace(/[{}]/g,"")),S(i,r);const a=Ae(r);return a.length>0&&(S(i,a[a.length-1]),S(i,a.join(" ")),S(i,a.join(""))),S(i,o),n.forEach(s=>S(i,s)),i}function kr(e){const t=N(e.value);if(t==="")return null;const r={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(r.token=String(e.token)),e.key&&(r.key=String(e.key)),e.section&&(r.section=String(e.section)),r.aliases=st({...e,...r}),r}function vr({tokens:e=[],clientInfo:t=[],clientSummary:r=[],profile:n=null}={}){const o=[],i=new Set,a=s=>{const l=kr(s);if(!l)return;const u=`${l.source}:${l.label}:${l.value}:${l.token||""}:${l.key||""}`;i.has(u)||(i.add(u),o.push(l))};return e.forEach(s=>{a({label:s.label,value:s.value,token:s.token,key:s.key,aliases:s.aliases,source:"token"})}),r.forEach(s=>{a({label:s.label,value:s.value,section:"summary",source:"clientSummary"})}),t.forEach(s=>{((s==null?void 0:s.fields)||[]).forEach(l=>{a({label:l.label,value:l.value,section:s.title||s.id,source:"clientInfo"})})}),n&&typeof n=="object"&&(Array.isArray(n.availableFields)?n.availableFields:[]).forEach(s=>{a({label:s.label,value:s.value,key:s.key,aliases:s.aliases,source:"profile"})}),o}function xr(e,t,r){!t||r===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=r)}function wr(e,t,r){const n=Ae(t);if(n.length<2||r==="")return;let o=e;for(let a=0;a<n.length-1;a+=1){const s=n[a];if(!s||/^\d+$/.test(s)||(o[s]===void 0&&(o[s]={}),!o[s]||typeof o[s]!="object"||Array.isArray(o[s])))return;o=o[s]}const i=n[n.length-1];i&&!Object.prototype.hasOwnProperty.call(o,i)&&(o[i]=r)}function Ir(e={},t=[]){const r={...e};return t.forEach(n=>{n.key&&wr(r,n.key,n.value),n.aliases.forEach(o=>xr(r,o,n.value))}),lt(r,t),r}const Ar=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function Sr(e,t){const r=ue(t);return!e||!r?!1:[e.label,e.token,e.key,...e.aliases||[]].some(n=>ue(n)===r)}function Nr(e=[],t=[]){for(const r of t){const n=e.find(i=>Sr(i,r)),o=N(n==null?void 0:n.value);if(o!=="")return o}return""}function lt(e,t=[]){Ar.forEach(({name:r,candidates:n})=>{if(Object.prototype.hasOwnProperty.call(e,r))return;const o=Nr(t,n);o!==""&&(e[r]=o)})}function Er({tokens:e=[],fields:t=[],variables:r={}}={}){const n=[],o=new Set,i=a=>{const s=Array.isArray(a.names)?a.names.filter(Boolean):[],l=[a.token||"",a.key||"",a.label||"",a.source||"",s.join("|")].join(":");o.has(l)||(o.add(l),n.push({name:s[0]||a.token||a.key||a.label||"",names:s,token:a.token||"",key:a.key||"",label:a.label||"",value:N(a.value),source:a.source||"context",inputType:a.inputType||"",internal:!!a.internal}))};return e.forEach(a=>{const l=st({label:a.label,token:a.token,key:a.key,aliases:a.aliases}).map(M).filter(Boolean);i({names:[...new Set(l)],token:a.token,key:a.key,label:a.label,value:a.value,source:"token",inputType:a.inputType,internal:a.internal})}),t.forEach(a=>{const l=[a.label,a.token,a.key,...a.aliases||[]].map(M).filter(Boolean);i({names:[...new Set(l)],token:a.token,key:a.key,label:a.label,value:a.value,source:a.source})}),Object.entries(r).forEach(([a,s])=>{!a||s===null||typeof s=="object"||i({names:[a],label:a,value:s,source:"variable"})}),n.sort((a,s)=>a.name.localeCompare(s.name))}function Cr(e=[]){const t={};return e.forEach(r=>{[r.label,r.token,r.key,...r.aliases||[]].forEach(n=>{const o=ue(n);!o||t[o]||(t[o]={label:r.label,value:r.value,source:r.source,token:r.token||"",key:r.key||"",section:r.section||""})})}),t}function Z(e,t,r){const n=M(t);!n||r===""||Object.prototype.hasOwnProperty.call(e,n)||(e[n]=r)}function _r(e,t,r){const n=Ae(t).map(M).filter(Boolean);if(n.length<2||r==="")return;let o=e;for(let a=0;a<n.length-1;a+=1){const s=n[a];if(o[s]===void 0&&(o[s]={}),!o[s]||typeof o[s]!="object"||Array.isArray(o[s]))return;o=o[s]}const i=n[n.length-1];i&&!Object.prototype.hasOwnProperty.call(o,i)&&(o[i]=r)}function Or(e,t=null){if(!t||typeof t!="object")return;const r=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(r).forEach(([n,o])=>{const i=N(o);i!==""&&Z(e,n,i)})}function Lr({fields:e=[],tokens:t=[],tokenValues:r={},environment:n={},profile:o=null}={}){const i={env:n,raw:r,byToken:{},byKey:{},byLabel:{},available:[],availableTokens:[],availableFields:[]};return t.forEach(a=>{a.token&&(i.byToken[a.token]=N(a.value))}),Object.entries(r||{}).forEach(([a,s])=>{const l=N(s);i.byToken[a]=l,l!==""&&(Z(i,a,l),Z(i,a.replace(/[{}]/g,""),l))}),Or(i,o),e.forEach(a=>{const s=N(a.value);s!==""&&(a.token&&(i.byToken[a.token]=s),a.key&&(i.byKey[a.key]=s,_r(i,a.key,s)),i.byLabel[a.label]=s,[a.label,a.token,a.key,...a.aliases||[]].forEach(l=>{Z(i,l,s)}))}),lt(i,e),i.available=Er({tokens:t,fields:e,variables:i}),i.availableTokens=i.available.filter(a=>a.token),i.availableFields=e.map(a=>({name:M(a.key||a.token||a.label),token:a.token||"",key:a.key||"",label:a.label||"",value:a.value,source:a.source||"context",aliases:a.aliases||[]})),i}function Pn({tool:e={},values:t={},tokens:r=[],client:n=null,clientInfo:o=[],clientSummary:i=[],profile:a=null}={}){const s=t&&typeof t=="object"?t:{},l=a&&typeof a=="object"?a:null,u=l!=null&&l.tokenValues&&typeof l.tokenValues=="object"?l.tokenValues:{},m={...s,...u},c=Array.isArray(o)?o:[],d=Array.isArray(i)?i:[],f=yr(r,m),p=vr({tokens:f,clientInfo:c,clientSummary:d,profile:l}),g=new Date().toISOString(),b={apiVersion:ee,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:g};return{apiVersion:ee,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:l||null,values:Ir(m,p),tokenValues:m,tokens:f,fields:p,fieldIndex:Cr(p),variables:Lr({fields:p,tokens:f,tokenValues:m,environment:b,profile:l}),environment:b,client:n&&typeof n=="object"?n:null,clientInfo:c,clientSummary:d,generatedAt:g}}function Dr(e=""){const t=String(e||"").trim(),r=t.match(/^```(?:json|text)?\s*([\s\S]*?)\s*```$/i);return r?r[1].trim():t}function qn(e=""){const t=Dr(e);if(!t)return"";try{const r=JSON.parse(t);return r&&typeof r=="object"&&!Array.isArray(r)&&typeof r.html=="string"&&r.html.trim()?r.html.trim():""}catch{return""}}function H(e=""){const t=N(e);return t?`value: ${t.slice(0,80)}${t.length>80?"…":""}`:"empty now"}function Vr(e={}){const t=Array.isArray(e.names)?e.names.filter(Boolean):[];return[...new Set([e.name,...t].filter(Boolean))].slice(0,8).join(", ")}function jr(e=null){var l;if(!e||typeof e!="object")return"No live app context was loaded while copying this prompt. The module must discover variables at runtime with TemplateTool.getContext(), TemplateTool.getVars(), TemplateTool.listVariables(), context.tokens and context.fields.";const t=["Live variable inventory from the current app context:","Use these exact names/tokens/keys when they fit the request, and still keep runtime fallbacks because availability changes per customer."],r=e.profile&&typeof e.profile=="object"?e.profile:null,n=r!=null&&r.vars&&typeof r.vars=="object"?r.vars:{},o=Object.entries(n).filter(([,u])=>N(u)!=="").sort(([u],[m])=>u.localeCompare(m));o.length>0&&(t.push("","Profile variables (TemplateProfile / TemplateVars aliases):"),o.forEach(([u,m])=>{t.push(`- ${u} (${H(m)})`)}));const i=Array.isArray((l=e.variables)==null?void 0:l.available)?e.variables.available:[];i.length>0&&(t.push("","Discoverable TemplateVars.available entries:"),i.forEach(u=>{const m=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",`names: ${Vr(u)||"none"}`,`source ${u.source||"context"}`,H(u.value)].filter(Boolean);t.push(`- ${m.join("; ")}`)}));const a=Array.isArray(e.fields)?e.fields:[];a.length>0&&(t.push("","Resolved context.fields (preferred for visible customer data):"),a.forEach(u=>{const m=[u.label?`label ${u.label}`:"",u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.section?`section ${u.section}`:"",`source ${u.source||"context"}`,H(u.value)].filter(Boolean);t.push(`- ${m.join("; ")}`)}));const s=Array.isArray(e.tokens)?e.tokens:[];return s.length>0&&(t.push("","All configured context.tokens, including empty values:"),s.forEach(u=>{const m=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",u.inputType?`type ${u.inputType}`:"",u.internal?"internal":"manual/configured",H(u.value)].filter(Boolean);t.push(`- ${m.join("; ")}`)})),o.length===0&&i.length===0&&a.length===0&&s.length===0&&t.push("- No variables are currently configured or populated in this context. Build a missing-data state and rely on runtime discovery."),t.join(`
`)}function Jn({title:e="",prompt:t="",runtimeContext:r=null}={}){const n=String(e||"").trim()||"Custom tool",o=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.
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
${cr()}

Current variable inventory:
${jr(r)}

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
${o}`}const Se="salt-templater-alo-autofill",$r=1,Fr="https://wholesale.swisscom.com/wsg/prod/alo/fuf/web/alo-web/fulfillment/detail.do",Br="https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do?clearModel=true";function Hn(e=(r=>(r=(t=>(t=globalThis.window)==null?void 0:t.open)())==null?void 0:r.bind(globalThis.window))()){return typeof e!="function"?null:e(Br,"_blank","noopener,noreferrer")}const Y=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function A(e){return e==null?"":String(e).trim()}function y(e){for(const t of e){const r=A(t);if(r)return r}return""}function Rr(e){const t=A(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:A(e)}function D(e){const t=A(e);if(!t)return"";const r=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(r)return`${r[1]}-${r[2]}-${r[3]}`;const n=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(n)return`${n[3]}-${n[2]}-${n[1]}`;const o=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return o?`${o[3]}-${o[1].padStart(2,"0")}-${o[2].padStart(2,"0")}`:t}function C(e){const t=D(e),r=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return r?`${r[3]}.${r[2]}.${r[1]}`:t}function zr(e={}){var t,r,n,o,i,a,s;return y([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activation_date,(o=e==null?void 0:e.client)==null?void 0:o.activation,(i=e==null?void 0:e.client)==null?void 0:i.dateActivation,(a=e==null?void 0:e.contact)==null?void 0:a.activationDate,(s=e==null?void 0:e.healthcheck)==null?void 0:s.activationDate])}function Mr(e={}){var t,r,n,o,i,a;return y([(t=e==null?void 0:e.contact)==null?void 0:t.providerOrderRef,(r=e==null?void 0:e.contact)==null?void 0:r.provider_order_ref,(n=e==null?void 0:e.client)==null?void 0:n.providerOrderRef,(o=e==null?void 0:e.client)==null?void 0:o.provider_order_ref,(i=e==null?void 0:e.healthcheck)==null?void 0:i.orderId,(a=e==null?void 0:e.healthcheck)==null?void 0:a.order_id,e==null?void 0:e.orderId,e==null?void 0:e.order_id])}function Ur(e={}){var i;const t=y([e==null?void 0:e.firstPostAt,e==null?void 0:e.firstPostDate,e==null?void 0:e.firstMessageAt,e==null?void 0:e.firstMessageDate]);if(t)return t;const r=(Array.isArray(e==null?void 0:e.attachments)?e.attachments:[]).map(a=>{var l,u;const s=a==null?void 0:a.messageIndex;return{date:y([a==null?void 0:a.date,a==null?void 0:a.messageDate,a==null?void 0:a.messageDateTime,a==null?void 0:a.createdAt,(l=a==null?void 0:a.message)==null?void 0:l.date,(u=a==null?void 0:a.message)==null?void 0:u.createdAt]),messageIndex:s==null||s===""?null:Number(s)}}).filter(a=>a.date&&D(a.date)),n=r.filter(a=>Number.isInteger(a.messageIndex)),o=n.length>0?n:r;return o.sort((a,s)=>n.length>0&&a.messageIndex!==s.messageIndex?a.messageIndex-s.messageIndex:D(a.date).localeCompare(D(s.date))),((i=o[0])==null?void 0:i.date)||""}function Kr(e={}){const t=A(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function Pr(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",r=e.signalState==="never"?"never":"lost",n=t==="lowBadRxTx"?"Bad signal":"No signal",o=C(r==="never"?e.activationDate:e.disconnectionDate);return[n,r==="never"?"Never activated":"Signal lost",o].filter(Boolean).join(" - ")}function qr(e={}){const t=C(e.disconnectionDate),r=C(e.activationDate),n=e.signalState==="never"?r:t;return{[xt]:n}}function Yn(e,t,r){return!e||typeof r!="function"?null:r(e,qr(t))}function Gn(e={},t={}){var l,u,m;const r=y([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(u=e==null?void 0:e.client)==null?void 0:u.externalId,(m=e==null?void 0:e.superOffice)==null?void 0:m.externalTicketId]),n=te(r),o=n.ok?n.fields:{},i=Kr(o),a=D(zr(e)),s=D(Ur(t));return{externalId:r,externalFields:o,aloType:"",signalState:i,disconnectionDate:s,activationDate:a,description:""}}function ct(e={}){return{firstName:A(e.firstName),lastName:A(e.lastName),email:A(e.email),phoneNumber:y([e.phoneNumber,e.phone])}}function Jr(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:y([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[re],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:A(e==null?void 0:e.externalTicketId),tokenValues:t}}function Hr(e={},t={},r={},n={}){const o=(e==null?void 0:e.client)||{},i=(e==null?void 0:e.contact)||{},a=(e==null?void 0:e.healthcheck)||{},s=ct(t),l=y([i.fixedNumber,i.voipNumber,i.voip,i.sip,o.fixedNumber,o.fixedPhone]),u=Rr(y([o.mobile,o.mobileRaw,o.phone,o.telephone,i.mobile,i.phone])),m=y([n.description,n.aloType==="lowBadRxTx"?"Bad signal":"",Y.problemDescription]),c=y([n.notes,n.signalState?Pr(n):"",Y.problemNotes]),d=n.signalState==="never"?C(n.activationDate):C(n.disconnectionDate);return{externalReference:A(n.extRef),socketId:y([a.otoId,a.oto_id,a.oto]),plugNr:y([a.otoPortId,a.otoPort,a.oto_port]),breakoutCable:y([a.breakoutCableId,a.breakoutCable,a.cable]),breakoutFiber:y([a.fiberNumber,a.fiber,a.fibre]),firstName:y([o.firstName,o.firstname,o.givenName]),lastName:y([o.lastName,o.lastname,o.surname,o.familyName]),contactPhone1:y([l,u]),contactPhone2:l&&u&&l!==u?u:"",contactEmail:y([o.email,o.mail,i.email,i.mail]),notificationType:"Email",preferredContactType:"Mobile",ispFirstName:s.firstName,ispLastName:s.lastName,ispPhone:s.phoneNumber,ispEmail:s.email,...Y,problemDescription:m,problemNotes:c,problemDateTime:d,problemCode3:n.aloType==="lowBadRxTx"?"Performance problem":Y.problemCode3}}function Yr(e={},t={},r={},n={}){const o=Hr(e,t,r,n),i=ct(t),a=Jr(r);return{source:Se,version:$r,fields:o,alo:{orderId:Mr(e),type:n.aloType||"noSignal",signalState:n.signalState||"",disconnectionDate:C(n.disconnectionDate),activationDate:C(n.activationDate),problemDateTime:o.problemDateTime,notes:n.notes||""},client:{firstName:o.firstName,lastName:o.lastName,contactPhone1:o.contactPhone1,contactPhone2:o.contactPhone2,email:o.contactEmail},technical:{socketId:o.socketId,plugNr:o.plugNr,breakoutCable:o.breakoutCable,breakoutFiber:o.breakoutFiber},agent:i,superOffice:a}}function Xn(e={},t={},r={},n={}){return JSON.stringify(Yr(e,t,r,n),null,2)}function Gr(e){var o,i,a;if(!e||typeof e.querySelectorAll!="function")return"";const t=s=>String(s??"").replace(/\s+/g," ").trim(),r=Array.from(e.querySelectorAll(".tooltipCode")).find(s=>t(s==null?void 0:s.textContent)==="translationId=global.extRef"),n=t((a=(i=(o=r==null?void 0:r.closest)==null?void 0:o.call(r,"td"))==null?void 0:i.nextElementSibling)==null?void 0:a.textContent);return n&&n!=="-"?n:""}function ut(e,t){function r(c){return c==null?"":String(c).trim()}function n(c){for(var d=0;d<c.length;d+=1){var f=r(c[d]);if(f)return f}return""}function o(c){return r(c).replace(/[&<>"']/g,function(f){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[f]})}function i(c,d,f){var p=document.getElementById("saltAloFillOverlay");p&&p.remove();var g=document.createElement("div");g.id="saltAloFillOverlay",g.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(f==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",g.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+o(c)+"</strong><span style='color:#d8d8df'>"+o(d)+"</span>",document.body.appendChild(g),f!=="error"&&setTimeout(function(){try{g.remove()}catch{}},4500)}function a(c,d,f){var p=c&&c.fields||{};return n([p[d]].concat(f||[]))}function s(c,d){var f=String(d).replace(/["\\]/g,"\\$&");return document.querySelector("["+c+'="'+f+'"]')}function l(c){return document.getElementById(c)||s("name",c)||s("formcontrolname",c)||s("data-testid",c)}function u(c,d,f){var p=f?String(d??""):r(d);if(!f&&!p)return!1;var g=l(c);if(!g)return!1;if(g.tagName==="SELECT")for(var b=r(p).toLowerCase(),v=0;v<g.options.length;v+=1){var I=g.options[v];if(r(I.value).toLowerCase()===b||r(I.textContent).toLowerCase()===b){g.value=I.value;break}}else"value"in g?g.value=p:g.textContent=p;return g.dispatchEvent(new Event("input",{bubbles:!0})),g.dispatchEvent(new Event("change",{bubbles:!0})),!0}function m(c){if(!c||typeof c!="object"||Array.isArray(c)){i("ALO fill","ALO fill data invalid.","error");return}if(c.source&&c.source!==e){i("ALO fill","Clipboard does not contain ALO fill data from Salt BO tools.","error");return}var d=c.client||{},f=c.technical||c.healthcheck||{},p=c.agent||{},g=0;function b(v,I,F){u(v,I,F)&&(g+=1)}if(b("ticket.extRef",a(c,"externalReference",[])),b("ticket.socketId",a(c,"socketId",[f.socketId,f.otoId,f.oto_id,f.oto])),b("ticket.plugNr",a(c,"plugNr",[f.plugNr,f.otoPortId,f.otoPort,f.oto_port])),b("ticket.breakoutCable",a(c,"breakoutCable",[f.breakoutCable,f.breakoutCableId,f.cable])),b("ticket.breakoutFiber",a(c,"breakoutFiber",[f.breakoutFiber,f.fiberNumber,f.fiber,f.fibre])),b("ticket.otoAddress.firstName",a(c,"firstName",[d.firstName,d.firstname,d.givenName])),b("ticket.otoAddress.lastName",a(c,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),b("ticket.contactPersonFirstName",a(c,"firstName",[d.firstName,d.firstname,d.givenName])),b("ticket.contactPersonLastName",a(c,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),b("ticket.contactPersonPhone1",a(c,"contactPhone1",[d.contactPhone1,d.fixedNumber,d.mobileRaw,d.mobile,d.phone])),b("ticket.contactPersonPhone2",a(c,"contactPhone2",[d.contactPhone2])),b("ticket.contactPersonMail",a(c,"contactEmail",[d.email,d.mail])),b("ticket.contactPersonNotificationsType",a(c,"notificationType",["Email"])),b("ticket.contactPersonPreferredContactType",a(c,"preferredContactType",["Mobile"])),b("ticket.contactPersonIspFirstName",a(c,"ispFirstName",[p.firstName])),b("ticket.contactPersonIspLastName",a(c,"ispLastName",[p.lastName])),b("ticket.contactPersonIspPhone",a(c,"ispPhone",[p.phoneNumber,p.phone])),b("ticket.contactPersonIspMail",a(c,"ispEmail",[p.email])),b("ticket.problemDescription",a(c,"problemDescription",["No signal"])),b("ticket.problemNotes",a(c,"problemNotes",[""]),!0),b("ticket.problemDateTime",a(c,"problemDateTime",[c.alo&&c.alo.problemDateTime])),b("ticket.problemCode1",a(c,"problemCode1",["400"])),b("ticket.problemCode2",a(c,"problemCode2",["800"])),b("ticket.problemCode3",a(c,"problemCode3",["900"])),!g){i("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}i("ALO fill","Fields populated: "+g,"success")}if(t){m(t);return}if(i("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){i("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(d){if(!r(d)){i("ALO fill","Clipboard empty. Click ALO fill in Salt BO tools first.","error");return}var f;try{f=JSON.parse(d)}catch{i("ALO fill","Clipboard does not contain valid ALO data.","error");return}m(f)}).catch(function(d){i("ALO fill","Clipboard error: "+(d&&d.message?d.message:d),"error")})}function Xr(e,t,r,n){function o(m){return m==null?"":String(m).trim()}function i(m){for(var c=0;c<m.length;c+=1){var d=o(m[c]);if(d)return d}return""}function a(m,c,d,f){var p=document.getElementById("saltAloBetaOverlay");p||(p=document.createElement("div"),p.id="saltAloBetaOverlay",p.style.cssText="position:fixed;z-index:2147483647;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(3px);color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:left",p.innerHTML="<div id='saltAloBetaCard' style='position:relative;width:420px;max-width:calc(100vw - 40px);background:rgba(24,24,28,.97);border:1px solid rgba(255,255,255,.12);border-radius:18px;box-shadow:0 22px 60px rgba(0,0,0,.45);padding:24px 26px'><button id='saltAloBetaClose' type='button' aria-label='Close' style='display:none;position:absolute;right:14px;top:12px;border:0;background:transparent;color:#fff;font-size:24px;line-height:1;cursor:pointer'>&times;</button><div style='display:flex;align-items:center;gap:12px;margin-bottom:16px'><div id='saltAloBetaDot' style='width:14px;height:14px;border-radius:50%;background:#21a36a;box-shadow:0 0 18px #21a36a'></div><div id='saltAloBetaTitle' style='font-size:18px;font-weight:700'></div></div><div id='saltAloBetaDetail' style='font-size:14px;line-height:1.5;color:#d8d8df;white-space:pre-line'></div><div style='margin-top:20px;height:5px;background:rgba(255,255,255,.14);border-radius:999px;overflow:hidden'><div id='saltAloBetaBar' style='width:8%;height:100%;background:linear-gradient(90deg,#21a36a,#65d6a0);border-radius:999px;transition:width .25s ease'></div></div></div>",(document.body||document.documentElement).appendChild(p),p.querySelector("#saltAloBetaClose").onclick=function(){p.remove()});var g=f==="error",b=p.querySelector("#saltAloBetaCard"),v=p.querySelector("#saltAloBetaDot"),I=p.querySelector("#saltAloBetaBar");p.querySelector("#saltAloBetaTitle").textContent=m||"ALO beta",p.querySelector("#saltAloBetaDetail").textContent=c||"",p.querySelector("#saltAloBetaClose").style.display=g?"block":"none",b.style.borderColor=g?"rgba(248,113,113,.55)":"rgba(255,255,255,.12)",v.style.background=g?"#ef4444":"#21a36a",v.style.boxShadow=g?"0 0 18px #ef4444":"0 0 18px #21a36a",I.style.width=Math.max(4,Math.min(100,d||0))+"%",I.style.background=g?"linear-gradient(90deg,#ef4444,#fb7185)":"linear-gradient(90deg,#21a36a,#65d6a0)"}function s(){var m=document.getElementById("saltAloBetaOverlay");m&&m.remove()}function l(m){a("ALO beta — impossible de continuer",m,100,"error")}a("ALO beta","Lecture des données préparées…",8,"info");var u;try{u=new URL(t)}catch{l("L’adresse Fulfillment configurée est invalide.");return}if(location.origin!==u.origin){l("Lance ce bookmarklet depuis le site ALO Wholesale.");return}if(!navigator.clipboard||!navigator.clipboard.readText){l("Le presse-papiers n’est pas accessible sur cette page.");return}navigator.clipboard.readText().then(function(c){if(!o(c))throw new Error("Le presse-papiers est vide. Prépare d’abord le ticket depuis Salt BO tools.");var d;try{d=JSON.parse(c)}catch{throw new Error("Le presse-papiers ne contient pas de données ALO valides.")}if(!d||typeof d!="object"||Array.isArray(d))throw new Error("Les données ALO préparées sont invalides.");if(d.source&&d.source!==e)throw new Error("Le presse-papiers ne contient pas les données ALO préparées par Salt BO tools.");var f=i([d.alo&&d.alo.orderId,d.orderId,d.contact&&d.contact.providerOrderRef,d.client&&d.client.providerOrderRef,d.fields&&d.fields.providerOrderRef]);if(!f)throw new Error("Order ID introuvable dans les données VTI. Recapture le client avec le bookmarklet VTI.");return a("ALO beta","Order ID détecté : "+f+`
Chargement de la commande Fulfillment…`,38,"info"),u.searchParams.set("orderId",f),fetch(u.href,{credentials:"include",cache:"no-store",redirect:"follow"}).then(function(g){if(!g.ok)throw new Error("La page Fulfillment a répondu avec l’erreur HTTP "+g.status+".");return g.text()}).then(function(g){a("ALO beta",`Commande chargée.
Recherche de l’External Ref…`,70,"info");var b=new DOMParser().parseFromString(g,"text/html"),v=n(b);if(!v)throw new Error("External Ref introuvable. Vérifie la session ALO et l’Order ID "+f+".");d.fields=Object.assign({},d.fields||{},{externalReference:v}),a("ALO beta","External Ref trouvée : "+v+`
Remplissage du ticket…`,92,"info"),s(),r(e,d)})}).catch(function(c){l(c&&c.message?c.message:String(c))})}function Zn(){const e=JSON.stringify(Se);return`javascript:(${ut.toString()})(${e});`}function Wn(){const e=JSON.stringify(Se),t=JSON.stringify(Fr);return`javascript:(${Xr.toString()})(${e},${t},(${ut.toString()}),(${Gr.toString()}));`}const dt="salt-templater-alex-ticket",Zr=1,Wr="https://www.ftthproxy.ch/",Qr=1,en="L1";function tn(e){return String(e??"").trim()}function rn(e){return String(e??"").replace(/[^0-9]+/g,"")}function nn(e){var t,r;return tn(((t=e==null?void 0:e.contact)==null?void 0:t.eligibilityOrdering)??((r=e==null?void 0:e.client)==null?void 0:r.eligibilityOrdering)??(e==null?void 0:e.eligibilityOrdering))}function Qn(e,t){const r=nn(e),n=rn(t);return/^\d+$/.test(r)?r==="0"?{ok:!1,error:"ALO_PARTNER"}:n?{ok:!0,payload:{source:dt,version:Zr,action:"view-ticket",alap:r,serviceDomain:Qr,businessDomain:en,ticket:n}}:{ok:!1,error:"MISSING_TICKET"}:{ok:!1,error:"MISSING_PARTNER_ID"}}function eo(e){return JSON.stringify(e,null,2)}function to(e){return e==="ALO_PARTNER"?"ALO tickets must be opened with the ALO flow":e==="MISSING_TICKET"?"Add the partner ticket number to the External ID first":"No ALEX partner identifier found in the active VTI customer"}function ro(e=(r=>(r=(t=>(t=globalThis.window)==null?void 0:t.open)())==null?void 0:r.bind(globalThis.window))()){return typeof e!="function"?null:e(Wr,"_blank","noopener,noreferrer")}function on(e){function t(r){alert("Ticket ALEX: "+r)}if(!/(^|\.)ftthproxy\.ch$/i.test(location.hostname)){t("launch this bookmarklet from ftthproxy.ch.");return}if(!navigator.clipboard||!navigator.clipboard.readText){t("clipboard access is not available on this page.");return}navigator.clipboard.readText().then(function(n){var o;try{o=JSON.parse(n)}catch{throw new Error("the clipboard does not contain valid JSON.")}if(!o||o.source!==e||o.action!=="view-ticket")throw new Error("the clipboard does not contain Ticket ALEX data from Salt BO tools.");var i=String(o.alap||"").trim(),a=String(o.ticket||"").replace(/[^0-9]+/g,""),s=Number(o.serviceDomain),l=String(o.businessDomain||"").trim();if(!/^\d+$/.test(i)||i==="0")throw new Error("the ALEX partner identifier is invalid.");if(!a)throw new Error("the ALEX ticket number is missing.");if(!Number.isFinite(s)||!l)throw new Error("the ALEX partner context is incomplete.");localStorage.setItem("focus",JSON.stringify({alap:i,serviceDomain:s,businessDomain:l}));var u="/assurance/ticket/"+a,m=location.origin+"/?saltAlexRefresh="+Date.now()+"#"+u;setTimeout(function(){location.replace(m)},300)}).catch(function(n){t(n&&n.message?n.message:String(n))})}function no(){const e=JSON.stringify(dt);return`javascript:(${on.toString()})(${e});`}const an=Object.freeze([{id:"captureData",label:"Capture data",key:"q",code:"KeyQ",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),sn=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function G(e,t){return!!(e!=null&&e[t])}function ln(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function mt(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function cn(e,t){return G(e,"ctrlKey")===!!t.ctrlKey&&G(e,"altKey")===!!t.altKey&&G(e,"shiftKey")===!!t.shiftKey&&G(e,"metaKey")===!!t.metaKey}function un(e,t){return cn(e,t)&&(ln(e==null?void 0:e.key,t.key)||mt(e==null?void 0:e.code,t.code))}function oo(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function dn(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(sn))}function mn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||dn(e==null?void 0:e.target))}function ao(e){if(mn(e))return null;const t=an.find(r=>un(e,r))||null;return!t||e!=null&&e.isComposing&&!mt(e==null?void 0:e.code,t.code)?null:t}const fn="case-profile-beta-1",ft=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["providerOrderRef","Provider order ref"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),Ne=Object.freeze(Object.fromEntries(ft)),pt=Object.freeze(ft.map(([e])=>e)),pn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),de=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),bt=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function k(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function x(...e){for(const t of e){const r=k(t);if(r!=="")return r}return""}function j(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function bn(e=""){const t=j(e);return t?t.replace(/_([a-z0-9])/g,(r,n)=>n.toUpperCase()):""}function Ee(e=""){const t=bn(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ue(e=""){const t=j(e);return t?`{${t}}`:""}function $(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function hn(){const e={};return pt.forEach(t=>{e[t]=""}),{version:fn,fields:e,fieldLabels:{...Ne},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function ht(e){return k(e)!==""}function w(e,t,r,{overwrite:n=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const o=k(r);return o===""||!n&&ht(e.fields[t])?!1:(e.fields[t]=o,e[t]=o,!0)}function Ce(e,t,r,{overwrite:n=!1,label:o=""}={}){const i=Ee(t),a=k(r);return!i||a===""||bt.has(i)||!n&&Object.prototype.hasOwnProperty.call(e.dynamic,i)?!1:(e.dynamic[i]=a,o&&!e.fieldLabels[i]&&(e.fieldLabels[i]=o),!0)}function gn(e,t,r,n={}){const o=j(ne(t)||t),i=de[o]||de[j(t)]||Ee(t);return Object.prototype.hasOwnProperty.call(e.fields,i)?w(e,i,r,n):Ce(e,t,r,n)}function Tn(e,t={},r={}){Object.entries(t).forEach(([n,o])=>w(e,n,o,r))}function me(e,t=[],r=[]){return Array.isArray(e)?(e.forEach((n,o)=>{t.push(String(o+1)),me(n,t,r),t.pop()}),r):e&&typeof e=="object"?(Object.keys(e).forEach(n=>{t.push(n),me(e[n],t,r),t.pop()}),r):(r.push({path:t.slice(),value:k(e)}),r)}function yn(e=[]){return e[0]===he||e[0]===ge}function gt(e,t,{prefix:r="",skipInternalClientKeys:n=!1}={}){!t||typeof t!="object"||me(t).filter(o=>o.value!=="").filter(o=>!n||!yn(o.path)).forEach(o=>{const i=r?[r,...o.path]:o.path;Ce(e,i.join("_"),o.value,{label:i.map($).join(" ")})})}function Ke(e=[],t=[]){const r=new Map;return[...e,...t].forEach(n=>{if(!n||typeof n!="object")return;const o=`${k(n.url)}|${k(n.name)}|${k(n.id)}`;o.replace(/\|/g,"")&&(r.has(o)||r.set(o,n))}),Array.from(r.values())}function _e(e){const t=k(e);if(!t)return null;const r=te(t);return r.ok?{externalId:t,fields:r.fields}:null}function Tt(e,t){var r,n,o,i;t&&(w(e,"externalId",t.externalId),Object.entries(pn).forEach(([a,s])=>{var l;w(e,s,(l=t.fields)==null?void 0:l[a])}),w(e,"contractorNumber",(r=t.fields)==null?void 0:r.customer),w(e,"lexId",(n=t.fields)==null?void 0:n.lexId),w(e,"oltName",(o=t.fields)==null?void 0:o.oltName),w(e,"oltBoard",(i=t.fields)==null?void 0:i.oltBoard))}function kn(e,t){var s;if(!t||typeof t!="object")return;const r=t.client||{},n=t.contact||{},o=t.healthcheck||{},i=o.crossConnexion||o.crossConnection||{},a=[r.firstName,r.lastName].map(k).filter(Boolean).join(" ");Tn(e,{clientName:a||x(r.fullName,r.name,r.customerName),title:r.title,firstName:r.firstName,lastName:r.lastName,contractorNumber:x(r.contractorNumber,r.contractor,o.customerId),mobile:x(r.mobile,r.phone,r.telephone),mobileRaw:r.mobileRaw,phone:x(r.phone,r.telephone,n.fixedNumber),email:r.email,address:r.address,communicationLanguage:x(r.communicationLanguage,n.communicationLanguage,r.language,n.language),activationDate:x(r.activationDate,r.activation_date,r.activation,r.dateActivation,(s=t.offer)==null?void 0:s.activationDate,n.activationDate,o.activationDate),eligibilitySource:x(r.eligibilitySource,n.eligibilitySource),contactRecordId:x(r.contactRecordId,n.contactRecordId),fixedNumber:n.fixedNumber,publicId:n.publicId,providerOrderRef:n.providerOrderRef,fllRecordId:o.fllRecordId,otoId:x(o.otoId,o.oto_id,o.oto),otoPortId:x(o.otoPortId,o.otoPort,o.oto_port,i.Port),routerSerialNumber:o.routerSerialNumber,oldRouterSerialNumber:o.oldRouterSerialNumber,lexId:o.lexId,oltName:o.oltName,oltBoard:o.oltBoard,ponPort:o.ponPort,breakoutCableId:o.breakoutCableId,fiberNumber:o.fiberNumber,lineState:o.lineState,routerStatus:o.routerStatus,odfId:o.odfId,option82:o.option82,oltObject:o.oltObject,ontConfigurationFilename:o.ontConfigurationFilename,svlan:o.svlan,customerId:o.customerId,crossConnectionEquipment:i.Equipment,crossConnectionRack:i.Rack,crossConnectionSlot:i.Slot,crossConnectionPort:i.Port}),Tt(e,_e(t[ge])),gt(e,t,{skipInternalClientKeys:!0})}function vn(e,t){var o;if(!t||typeof t!="object")return;w(e,"soTicketNum",x(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(o=t.tokenValues)==null?void 0:o[re])),w(e,"ticketCreatedAt",x(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),Tt(e,_e(t.externalTicketId)),yt(e,t.tokenValues);const r=P(t.attachments),n=ke(r);e.attachments=Ke(e.attachments,r),e.photos=Ke(e.photos,n),gt(e,t,{prefix:"ticket"})}function yt(e,t={},r={}){!t||typeof t!="object"||Object.entries(t).forEach(([n,o])=>{const i=k(o);if(i==="")return;const a=ne(n),s=wt(a)||j(n),l=de[s];l&&w(e,l,i,r),s==="external_customer"&&w(e,"contractorNumber",i,r),s==="external_lex_id"&&w(e,"lexId",i,r),s==="external_olt_name"&&w(e,"oltName",i,r),s==="external_olt_board"&&w(e,"oltBoard",i,r),Ce(e,s,i,{...r,label:$(s)})})}function xn(e,t){const r=t==null?void 0:t[he];!r||typeof r!="object"||Array.isArray(r)||Object.entries(r).forEach(([n,o])=>{gn(e,n,o,{overwrite:!0,label:$(n)})})}function Pe(e,t,r){const n=Ee(t),o=k(r);!n||o===""||bt.has(n)||Object.prototype.hasOwnProperty.call(e,n)||(e[n]=o)}function wn(e,t={}){const r={},n={},o=[];pt.forEach(s=>{const l=k(e.fields[s]);if(l==="")return;Pe(r,s,l);const u=Ue(s);u&&(n[u]=l),o.push({key:s,label:Ne[s]||$(s),value:l})}),Object.entries(e.dynamic).forEach(([s,l])=>{const u=k(l);if(u==="")return;Pe(r,s,u);const m=Ue(s);m&&!Object.prototype.hasOwnProperty.call(n,m)&&(n[m]=u),e.fields[s]||o.push({key:s,label:e.fieldLabels[s]||$(s),value:u})});const i=_e(e.externalId);i&&Object.assign(n,fe(i.fields)),ht(e.soTicketNum)&&(n[re]=e.soTicketNum);const a={};return Object.entries(t||{}).forEach(([s,l])=>{const u=ne(s)||s;a[u]=l}),e.vars=r,e.variables=r,e.tokenValues={...a,...n},e.availableFields=o,e}function io({clientPayload:e=null,superOfficePayload:t=null,tokenValues:r={}}={}){const n=hn();return kn(n,e),vn(n,t),yt(n,r),xn(n,e),wn(n,r)}function h(e,t,r=""){var o;const n=k((e==null?void 0:e[t])??((o=e==null?void 0:e.fields)==null?void 0:o[t]));return n?{label:r||Ne[t]||$(t),value:n}:null}function _(e,t){const r=k(t);return r?{label:e,value:r}:null}function kt(e=[]){const t=new Set;return e.filter(Boolean).filter(r=>{const n=`${j(r.label)}:${r.value}`;return t.has(n)?!1:(t.add(n),!0)})}function X(e,t,r=[]){const n=kt(r);return n.length>0?{id:e,title:t,fields:n}:null}function so(e=null){return!e||typeof e!="object"?[]:kt([_("Name",e.clientName),_("Mobile",x(e.mobile,e.mobileRaw,e.phone)),_("Contractor",x(e.contractorNumber,e.externalCustomer,e.customerId)),_("Activation",e.activationDate),_("OTO ID",e.otoId),_("Port",x(e.otoPortId,e.crossConnectionPort)),_("SO ticket",e.soTicketNum)])}function lo(e=null){return!e||typeof e!="object"?[]:[X("caseClient","Client",[h(e,"clientName","Full name"),h(e,"contractorNumber","Contractor"),h(e,"title"),h(e,"firstName"),h(e,"lastName"),h(e,"mobile"),h(e,"mobileRaw","Mobile raw"),h(e,"phone"),h(e,"email"),h(e,"address"),h(e,"communicationLanguage","Language"),h(e,"activationDate","Activation date")]),X("caseSuperOffice","SuperOffice",[h(e,"soTicketNum","SO ticket"),h(e,"ticketCreatedAt","Created at"),h(e,"externalId","External ID"),h(e,"externalPartner","Partner"),h(e,"externalPartnerTicketNumber","Partner ticket")]),X("caseExternalId","External ID fields",[h(e,"externalFlagging","Flagging"),h(e,"externalDate","Date"),h(e,"externalCustomer","Contractor"),h(e,"externalSignalStatus","Signal"),h(e,"externalLedStatus","LED"),h(e,"externalTreatmentStep","Treatment"),h(e,"externalBoxType","Box"),h(e,"externalLexId","LEX ID"),h(e,"externalOltName","OLT"),h(e,"externalOltBoard","Board"),h(e,"externalBokBof","BOK/BOF"),h(e,"externalComment","Comment")]),X("caseTechnical","Technical",[h(e,"fllRecordId","FLL record"),h(e,"otoId","OTO ID"),h(e,"otoPortId","OTO port"),h(e,"routerSerialNumber","Router serial"),h(e,"oldRouterSerialNumber","Old router serial"),h(e,"lexId","LEX ID"),h(e,"oltName","OLT"),h(e,"oltBoard","OLT board"),h(e,"ponPort","PON port"),h(e,"breakoutCableId","Breakout cable"),h(e,"fiberNumber","Fiber number"),h(e,"lineState","Line state"),h(e,"routerStatus","Router status"),h(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{$n as A,ao as B,En as C,Yn as D,no as E,Zn as F,Wn as G,oo as H,Jn as I,qn as J,an as K,ve as L,_n as M,Cn as P,Ht as S,Ze as a,Dn as b,zn as c,Fn as d,Un as e,Pn as f,L as g,Mn as h,Ln as i,Kn as j,io as k,Bn as l,lo as m,so as n,Qn as o,On as p,Zt as q,Rn as r,jn as s,Vn as t,Gn as u,to as v,eo as w,ro as x,Xn as y,Hn as z};
