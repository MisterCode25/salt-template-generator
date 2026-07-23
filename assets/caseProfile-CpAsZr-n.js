import{c as $e}from"./appConfigService-9VUqA7ec.js";import{p as X,b as ue,S as Q,P as ee,K as _,q as z,x as mt,G as de,U as me,X as pe,Y as fe,Z as pt}from"./tokenService-Bkbwtr9d.js";import{l as B,s as be,d as ft}from"./templateTreeService-DQTY3_S0.js";import{f as Fe,u as ze}from"./templateTreeOperations-BULiHgvc.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],ra=$e("chevron-right",bt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],oa=$e("puzzle",ht),gt=/\.(jpe?g|jfif|png|webp|gif|bmp|avif|heic|heif|tiff?|ico|svg)(?:$|[?#])/i,Tt=/\.(mp4|mov)(?:$|[?#])/i,yt=/\.pdf(?:$|[?#])/i,kt=["{contractor}","{contractor_number}","{client_contractor_number}"];function g(...e){for(const t of e){const n=String(t??"").trim();if(n)return n}return""}function vt(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function xt(e="",t=""){const n=`${e} ${t}`;return gt.test(n)?"image":Tt.test(n)?"video":yt.test(n)?"pdf":"file"}function wt(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function It(e=""){const t=String(e||"").trim().toLowerCase();return t==="video"||t==="mp4"||t==="mov"||t.startsWith("video/")}function Nt(e=""){const t=String(e||"").trim().toLowerCase();return t==="pdf"||t==="application/pdf"}function St(...e){for(const t of e){if(wt(t))return"image";if(It(t))return"video";if(Nt(t))return"pdf"}return""}function At(...e){for(const t of e){const n=g(t),a=n.toLowerCase();if(a){if(a.includes("/"))return n;if(a==="pdf")return"application/pdf";if(a==="mp4")return"video/mp4";if(a==="mov")return"video/quicktime"}}return""}function Ct(e={}){var t,n,a;return g(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(n=e.message)==null?void 0:n.createdAt,(a=e.message)==null?void 0:a.sentAt)||null}function j(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function Et(e,t){var c,u,l,d,m;if(!e||typeof e!="object"||Array.isArray(e))return null;const n=g(e.url,e.href,e.src,e.downloadUrl);if(!n)return null;const a=g(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((c=String(n).split("/").pop())==null?void 0:c.split("?")[0])||""))||`Attachment ${t+1}`,r=g(e.type,e.contentType,e.mimeType),o=At(e.contentType,e.mimeType,e.type,e.mediaType),i=St(e.type,e.contentType,e.mimeType,e.mediaType)||xt(a,n),s=g(e.messageId,e.messageID,e.postId,(u=e.message)==null?void 0:u.id)||null;return{id:g(e.id,e.attachmentId,e.documentId)||`${t}-${a}-${n}`,name:a,url:n,dataUrl:g(e.dataUrl)||null,type:i,contentType:o||r||null,size:g(e.size,e.sizeText,e.fileSize)||null,messageId:s,postId:g(e.postId,s)||null,messageIndex:j(g(e.messageIndex,e.messageOrder,e.postIndex,(l=e.message)==null?void 0:l.index)),attachmentIndex:j(g(e.attachmentIndex,e.fileIndex)),messageAuthor:g(e.messageAuthor,e.author,e.createdBy,(d=e.message)==null?void 0:d.author,(m=e.message)==null?void 0:m.createdBy)||null,source:g(e.source,e.origin)||null,date:Ct(e)}}function Ae(e){return String(e).padStart(2,"0")}function _t(e){const t=e.getFullYear(),n=Ae(e.getMonth()+1),a=Ae(e.getDate());return{dateKey:`${t}-${n}-${a}`,label:`${a}.${n}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function Ce(e,t,n,a=0,r=0,o=0){if(t<0||t>11||n<1||n>31||a<0||a>23||r<0||r>59||o<0||o>59)return null;const i=new Date(e,t,n,a,r,o);return i.getFullYear()!==e||i.getMonth()!==t||i.getDate()!==n?null:i}function Ot(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const o=new Date(e);return Number.isNaN(o.getTime())?null:o}const t=String(e).trim();if(!t)return null;const n=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const o=Ce(Number(n[1]),Number(n[2])-1,Number(n[3]),Number(n[4]||0),Number(n[5]||0),Number(n[6]||0));if(o)return o}const a=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(a){const o=Number(a[1]),i=a[2],s=Number(a[3]),c=Number(a[4]),u=c<100?2e3+c:c,l=Number(a[5]||0),d=Number(a[6]||0),m=Number(a[7]||0),b=i==="/"&&s>12&&o<=12,h=b?s:o,f=(b?o:s)-1,T=Ce(u,f,h,l,d,m);if(T)return T}const r=new Date(t);return Number.isNaN(r.getTime())?null:r}function he(e={}){const t=Ot(e.date);return t?_t(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function Lt(e,t){const n=g(t);n&&kt.forEach(a=>{e[a]=n})}function Ee(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function Dt(e,t,n){const a=ee(t),r=g(n);!a||!r||e.push([a,r])}function Be(e,t=[]){const n=[];return Ee(e)&&Object.entries(e).forEach(([a,r])=>{if(Ee(r)){n.push(...Be(r,[...t,a]));return}Dt(n,[...t,a].join("."),r)}),n}function Vt(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(n=>{Be(e[n]).forEach(([a,r])=>{t[a]=r})}),t}function M(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(Et).filter(Boolean).filter(n=>{const a=`${n.name}|${n.url}`;return t.has(a)?!1:(t.add(a),!0)})}function ge(e=[]){return M(e).filter(t=>t.type==="image")}function Te(e=[]){return M(e).filter(t=>["image","video","pdf"].includes(t.type))}function jt(e=[]){const t=new Map;return e.forEach((n,a)=>{const r=he(n);t.has(r.dateKey)||t.set(r.dateKey,{...r,postLabel:"Post non identifié",dateLabel:r.label,author:g(n.messageAuthor),attachments:[]}),t.get(r.dateKey).attachments.push({...n,galleryIndex:a})}),Array.from(t.values()).sort((n,a)=>a.sortValue-n.sortValue)}function _e(e={}){var t;return g(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function Oe(e={},t=0){const n=j(e.messageNumber),a=j(e.messageIndex);return`Post ${n||(a===null?t+1:a+1)}`}function $t(e={}){const t=he(e),n=g(e.messageAuthor);return t.dateKey==="unknown"?n:[t.label,n].filter(Boolean).join(" · ")}function ia(e=[]){const t=Te(e);if(!t.some(a=>_e(a)))return jt(t);const n=new Map;return t.forEach((a,r)=>{const o=_e(a),i=he(a),s=o||`unassigned:${i.dateKey}`;if(!n.has(s)){const c=n.size;n.set(s,{dateKey:s,label:o?Oe(a,c):i.label,metaLabel:o?$t(a):"",postLabel:o?Oe(a,c):"Post non identifié",dateLabel:i.label,author:g(a.messageAuthor),sortValue:j(a.messageIndex)??r,attachments:[]})}n.get(s).attachments.push({...a,galleryIndex:r})}),Array.from(n.values()).sort((a,r)=>a.sortValue-r.sortValue)}function sa(e){var h,f;const t=vt(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const n=g(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),a=g(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),r=g(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),o=g(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(h=t.client)==null?void 0:h.contractorNumber,(f=t.client)==null?void 0:f.contractor),i={};let s=null,c=!1;const u=M(t.attachments),l=ge(u),d=Te(u);if(r){const T=X(r);T.ok&&(c=!0,s=T.fields,Object.assign(i,ue(T.fields)))}Object.assign(i,Vt(t));const m=(s==null?void 0:s.customer)||o;m&&(c||n||u.length>0)&&Lt(i,m);const b=n||(s==null?void 0:s.soTicket)||"";return b&&(i[Q]=b),Object.keys(i).length===0&&u.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:c,externalTicketId:r}:{ok:!0,ticketId:b,sourceTicketId:n,createdAt:a,externalTicketId:r,contractorNumber:m,externalIdValid:c,externalFields:s,tokenValues:i,attachments:u,imageAttachments:l,mediaAttachments:d,ignoredExternalId:!!(r&&!c)}}const R="super_office_ticket_payload",ye="pending_super_office_ticket_payload",te="previous_super_office_ticket_payload",Ft="super-office-ticket-updated";function zt(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[pe]:t,[fe]:n,...a}=e;return a}function re(e){return Array.isArray(e)?`[${e.map(re).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${re(e[t])}`).join(",")}}`:JSON.stringify(e)}function E(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return re(zt(e))}catch{return""}}const Bt=new Set(["billingaccount","contractornumber","customerid","publicid","contactrecordid"]);function oe(e,t=new Map){return!e||typeof e!="object"||Array.isArray(e)||Object.entries(e).forEach(([n,a])=>{if(n.startsWith("__"))return;const r=n.replace(/[^a-z0-9]/gi,"").toLowerCase();if(Bt.has(r)){const o=String(a??"").trim().toLowerCase();o&&t.set(r,o);return}a&&typeof a=="object"&&oe(a,t)}),t}function la(e,t){const n=oe(e),a=oe(t);for(const[r,o]of n)if(a.get(r)===o)return!0;return E(e)===E(t)}function $(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(Ft,{detail:{payload:e}}))}function S(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=M(e.attachments),n=String(e.clientSignature||"").trim(),a=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([r,o])=>[r,o==null?"":String(o)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:n,tokenValues:a,attachments:t,imageAttachments:ge(t),mediaAttachments:Te(t)}}function Mt(e,t=new Date,n=""){return S({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:n,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function ne(e){e&&await me(R,e)}async function Me(e){e&&await me(te,e)}async function Re(e){e&&await me(ye,e)}async function ae(){try{return S(await _(ye,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function ca(){return ae()}async function Rt(){return await Pe()||await ae()}async function ua(){return!!await Rt()}function ke(){return de(ye)}function Y(){return de(te)}async function da(e){const t=await z(),n=Mt(e,new Date,E(t));if(!n)return null;if(!n.clientSignature)return await G(),await Re(n),$(null),n;const a=S(await _(R,null)),r=(a==null?void 0:a.ticketId)||(a==null?void 0:a.sourceTicketId)||"",o=n.ticketId||n.sourceTicketId||"";return(a==null?void 0:a.clientSignature)===n.clientSignature&&r&&o&&r!==o&&await Me(a),await ne(n),await ke(),$(n),n}async function ma(e){const t=mt(e);if(!t)return null;const n=await Pe(),a=n?null:await ae(),r=n||a;if(!r)return null;const o=X(t),i=o.ok?{...r.tokenValues||{},...ue(o.fields)}:r.tokenValues||{},s=S({...r,externalTicketId:t,tokenValues:i});return s?(s.clientSignature?await ne(s):await Re(s),$(s),s):null}function G(){return de(R)}async function pa(){const e=await ae(),t=E(await z());if(!e||!t)return null;const n={...e,clientSignature:t};return await ne(n),await ke(),$(n),n}async function Pe(){try{const e=await _(R,null);if(!e)return null;const t=E(await z());if(!t)return await G(),await Y(),null;if((e==null?void 0:e.clientSignature)!==t)return await G(),await Y(),null;const n=S(e);return n||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function fa(){try{const e=S(await _(te,null));if(!e)return null;const t=E(await z());return!t||e.clientSignature!==t?(await Y(),null):e}catch(e){return console.error("loadPreviousSuperOfficeTicketPayload error",e),null}}async function ba(){const e=E(await z());if(!e)return!1;const t=S(await _(R,null)),n=S(await _(te,null));return await Promise.all([t?ne({...t,clientSignature:e}):Promise.resolve(),n?Me({...n,clientSignature:e}):Promise.resolve()]),!!(t||n)}async function ha(){await G(),await ke(),await Y(),$(null)}const Pt=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function ve(e){return e==null?e:JSON.parse(JSON.stringify(e))}function V(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function C(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function Ue(e=[]){return new Map(e.map(t=>[t.id,t]))}function Ke(e,t){if(!e)return"";const n=[],a=new Set;let r=e;for(;r&&!a.has(r.id);)a.add(r.id),n.unshift(r.title||r.id),r=r.parentId?t.get(r.parentId):null;return n.join(" / ")}function Ut(e=[]){const t=Ue(e);return e.map(n=>({...n,path:Ke(n,t)}))}function qe(e=[],t){const n=String(t||"").trim();if(!n)return null;const a=Ue(e);if(a.has(n))return a.get(n);const r=C(n);return e.find(o=>C(o.title)===r||C(Ke(o,a))===r)||null}function Kt(e=[],t={}){return qe(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function qt(e=[],t={}){return qe(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function Jt(e,t={},n=null){const a=V(t.templateIds||t.templateId).map(String).filter(Boolean);if(a.length>0&&!a.includes(e.id)||n&&!(e.nodeIds||[]).includes(n.id))return!1;const r=V(t.channels||t.channel).map(s=>String(s||"").trim()).filter(Boolean);if(r.length>0&&!r.some(s=>(e.channels||[]).includes(s)))return!1;const o=String(t.title||t.templateTitle||"").trim();if(o&&C(e.title)!==C(o))return!1;const i=V(t.titleIncludes||t.templateTitleIncludes).map(C).filter(Boolean);if(i.length>0){const s=C(e.title);if(!i.some(c=>s.includes(c)))return!1}return!0}function Ht({template:e,sourceNode:t,targetNode:n,reason:a=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:n.id,targetNodeTitle:n.title||"",reason:a}}function Je({nodes:e=[],templates:t=[]}={}){return{nodes:Ut(e),templates:ve(t),counts:{nodes:e.length,templates:t.length}}}function He(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([n,a])=>{Pt.has(n)&&(t[n]=a)}),t}async function Ye(){return Je(await B())}async function Yt(){return Ye()}async function Gt(e=[]){const t=V(e),{nodes:n,templates:a}=await B(),r=[],o=[];return t.forEach((i,s)=>{if(!i||typeof i!="object"||Array.isArray(i)){o.push({ruleIndex:s,reason:"Rule must be an object."});return}const c=qt(n,i);if(!c){o.push({ruleIndex:s,reason:"Target topic was not found."});return}const u=Kt(n,i),l=a.filter(d=>Jt(d,i,u));if(l.length===0){o.push({ruleIndex:s,reason:"No templates matched this rule."});return}l.forEach(d=>{(d.nodeIds||[])[0]===c.id&&(!u||u.id===c.id)||r.push(Ht({template:d,sourceNode:u,targetNode:c,reason:i.reason||`Rule ${s+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:r.length,affectedTemplateCount:new Set(r.map(i=>i.templateId)).size,operations:r,skipped:o}}async function Zt(e=[]){const t=V(e),n=await B();let a=n.nodes,r=n.templates;const o=[],i=[];return t.forEach((s,c)=>{var l;const u=(s==null?void 0:s.action)||(s==null?void 0:s.type);if(!s||typeof s!="object"||Array.isArray(s)){i.push({operationIndex:c,reason:"Operation must be an object."});return}if(u==="moveTemplate"){const d=String(s.templateId||""),m=String(s.targetNodeId||s.toNodeId||"");if(!d||!m){i.push({operationIndex:c,reason:"moveTemplate requires templateId and targetNodeId."});return}const b=r.find(T=>T.id===d),h=s.sourceNodeId||((l=b==null?void 0:b.nodeIds)==null?void 0:l[0])||null,f=JSON.stringify(r);r=Fe(r,d,h,m,Number(s.targetIndex),a),JSON.stringify(r)!==f&&o.push({operationIndex:c,action:u,templateId:d,targetNodeId:m});return}if(u==="updateTemplate"){const d=String(s.templateId||"");if(!d){i.push({operationIndex:c,reason:"updateTemplate requires templateId."});return}const m=He(s.patch||s.fields||{}),b=JSON.stringify(r);r=ze(r,d,m),JSON.stringify(r)!==b&&o.push({operationIndex:c,action:u,templateId:d});return}i.push({operationIndex:c,reason:`Unsupported operation: ${u||"unknown"}.`})}),o.length>0&&await be({nodes:a,templates:r}),{ok:!0,appliedCount:o.length,skippedCount:i.length,applied:o,skipped:i,tree:Je({nodes:a,templates:r})}}async function Wt(e,t={}){const n=String(e||"");if(!n)throw new Error("templateId is required.");const a=await B();if(!a.templates.some(o=>o.id===n))throw new Error("Template was not found.");const r=ze(a.templates,n,He(t));return await be({nodes:a.nodes,templates:r}),{ok:!0,template:ve(r.find(o=>o.id===n))}}async function Xt(e,t,n={}){var u;const a=String(e||""),r=String(t||"");if(!a||!r)throw new Error("templateId and targetNodeId are required.");const o=await B();if(!o.templates.some(l=>l.id===a))throw new Error("Template was not found.");const i=o.templates.find(l=>l.id===a),s=(n==null?void 0:n.sourceNodeId)||((u=i==null?void 0:i.nodeIds)==null?void 0:u[0])||null,c=Fe(o.templates,a,s,r,Number(n==null?void 0:n.targetIndex),o.nodes);return await be({nodes:o.nodes,templates:c}),{ok:!0,template:ve(ft(c.find(l=>l.id===a)))}}async function ga(e,t={}){switch(e){case"tool:templates:list":return Ye();case"tool:templates:get-tree":return Yt();case"tool:templates:preview-migration":return Gt(t.rules||t);case"tool:templates:apply-migration":return Zt(t.operations||t);case"tool:templates:update-template":return Wt(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return Xt(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const Z="template-tool-module-beta-2",Ge=Object.freeze({name:"Template Generator Module API",version:Z,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",containers:{"context.profile / TemplateProfile":"Normalized customer and case profile with common scalar fields, tokenValues, vars, photos and attachments.","context.variables / TemplateVars":"Variable-friendly aliases generated from profile fields, tokens and visible client fields. This is the preferred object for JavaScript property access.","TemplateVars.byToken":"Exact token lookup keyed by brace tokens such as {client_first_name}. Includes known tokens even when the current value is empty.","TemplateVars.byKey":"Lookup keyed by structured token keys such as client.firstName or contractorNumber.","TemplateVars.byLabel":"Lookup keyed by user-facing field labels from the app.","TemplateVars.available":"Discovery list for every exposed variable with names, token, key, label, value, source, inputType and internal.","TemplateVars.availableTokens":"Subset of TemplateVars.available that comes from token definitions.","TemplateVars.availableFields":"Visible normalized field list with aliases for customer-facing selectors.","context.tokens":"All configured token definitions, including manual/internal tokens and empty values.","context.fields / TemplateFields":"Best normalized list for user-facing customer, case and profile fields.","context.fieldIndex":"Normalized lookup map for labels, tokens, keys and aliases with punctuation/accent/braces removed.","context.client":"Raw imported VTI/customer payload. Use only when the module needs structured nested source data.","context.clientInfo":"Visible client detail sections used by the app UI.","context.clientSummary":"Compact client bar fields currently selected in the app."},examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']","TemplateVars.available.map((entry) => entry.name)"],reservedContainers:["env","raw","byToken","byKey","byLabel","available","availableTokens","availableFields"]},dataAccess:{appDatabase:"Authorized only through TemplateTool APIs. TemplateTool.templates reads and writes the app's IndexedDB-backed topic/template data through host services.",internet:"Public Internet API/database access is authorized for explicit user-requested public HTTP(S) read requests. Prefer TemplateTool.fetchJson(url) or TemplateTool.fetchText(url) for CORS-enabled Internet APIs/databases.",restrictions:"Do not use secrets, cookies, credentials, private/local network URLs, remote scripts, CDNs, remote fonts, eval, parent DOM access, localStorage or raw IndexedDB."},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object with scalar aliases plus available, availableTokens, availableFields, byToken, byKey and byLabel discovery containers",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.fetchJson(url)":"Promise<{ ok, status, url, contentType, data?, text?, error?, truncated? }>","TemplateTool.fetchText(url)":"Promise<{ ok, status, url, contentType, text?, error?, truncated? }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function Qt(e=Ge){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([n,a])=>{t.push(`- window.${n}: ${a.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),e.variables.containers&&typeof e.variables.containers=="object"&&(t.push("","Variable containers:"),Object.entries(e.variables.containers).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)})),t.push("","Variable examples:"),(e.variables.examples||[]).forEach(n=>{t.push(`- ${n}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),e.dataAccess&&typeof e.dataAccess=="object"&&(t.push("","Data access:"),Object.entries(e.dataAccess).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)})),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([n,a])=>{t.push(`- ${n}: ${a}`)}),t.join(`
`)}const en=`
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
</style>`,tn=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${Z}";
    var apiReference = ${JSON.stringify(Ge)};
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
<\/script>`,nn=`<!doctype html>
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
</html>`;function an(e=""){var c;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const n=t.match(/```(?:html)?\s*([\s\S]*?)```/i),a=((c=n==null?void 0:n[1])==null?void 0:c.trim())||t,r=a.match(/<!doctype\s+html\b|<html[\s>]/i);if(!r)return a;const o=r.index||0,i=a.slice(o).trim(),s=i.match(/<\/html\s*>/i);return s?i.slice(0,s.index+s[0].length).trim():i}function rn(e=""){const t=an(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:nn}function on(e,t,n){return e.includes(n)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function sn(e,t,n){return e.includes(n)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Ta(e=""){const t=rn(e),n=sn(t,tn,"template-tool-bridge");return on(n,en,"template-tool-host-style")}const Le=3e5;function ln(e=""){const t=e.split(".").map(r=>Number(r));if(t.length!==4||t.some(r=>!Number.isInteger(r)||r<0||r>255))return!1;const[n,a]=t;return n===0||n===10||n===127||n===169&&a===254||n===172&&a>=16&&a<=31||n===192&&a===168}function cn(e=""){try{const t=new URL(String(e||"").trim());if(!["http:","https:"].includes(t.protocol))return!1;const n=t.hostname.toLowerCase().replace(/^\[|\]$/g,"");return!(!n||n==="localhost"||n.endsWith(".localhost")||n.endsWith(".local")||n==="::1"||n==="0:0:0:0:0:0:0:1"||ln(n))}catch{return!1}}async function ya({url:e="",responseType:t="json"}={}){const n=String(e||"").trim(),a=t==="json";if(!cn(n))return{ok:!1,status:0,url:n,contentType:"",error:"Only public http/https URLs can be fetched by a module."};try{const r=await fetch(n,{method:"GET",credentials:"omit",cache:"no-store",redirect:"follow",headers:{Accept:a?"application/json, text/plain;q=0.8, */*;q=0.5":"text/plain, application/json;q=0.8, */*;q=0.5"}}),o=r.headers.get("content-type")||"",i=await r.text(),s=i.length>Le,c=s?i.slice(0,Le):i,u={ok:r.ok,status:r.status,url:r.url||n,contentType:o,truncated:s};if(!a)return{...u,text:c};try{return{...u,data:c?JSON.parse(c):null}}catch{return{...u,ok:!1,text:c,error:"The Internet response was not valid JSON."}}}catch(r){return{ok:!1,status:0,url:n,contentType:"",error:(r==null?void 0:r.message)||"Internet request failed."}}}function un(e=[],t={}){return Array.isArray(e)?e.filter(n=>n==null?void 0:n.token).map(n=>{const a=Object.prototype.hasOwnProperty.call(t,n.token)?t[n.token]:n.previewValue;return{token:n.token,label:n.label||n.token,key:n.key||"",inputType:n.input_type||n.inputType||"text",value:a??"",internal:!!n.internal,aliases:Array.isArray(n.searchAliases)?n.searchAliases.filter(Boolean):[]}}):[]}function N(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function ie(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function Ze(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function We(e=""){const t=Ze(e);return t?t.replace(/_([a-z0-9])/g,(n,a)=>a.toUpperCase()):""}function F(e=""){const t=We(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function xe(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function P(e,t){const n=String(t||"").trim();!n||e.includes(n)||e.push(n)}function I(e,t){const n=String(t||"").trim();if(!n)return;P(e,n);const a=Ze(n),r=We(n);a&&(P(e,a),P(e,`{${a}}`)),r&&P(e,r)}function Xe({label:e="",token:t="",key:n="",aliases:a=[],section:r=""}={}){const o=[];I(o,e),I(o,t),I(o,t.replace(/[{}]/g,"")),I(o,n);const i=xe(n);return i.length>0&&(I(o,i[i.length-1]),I(o,i.join(" ")),I(o,i.join(""))),I(o,r),a.forEach(s=>I(o,s)),o}function dn(e){const t=N(e.value);if(t==="")return null;const n={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(n.token=String(e.token)),e.key&&(n.key=String(e.key)),e.section&&(n.section=String(e.section)),n.aliases=Xe({...e,...n}),n}function mn({tokens:e=[],clientInfo:t=[],clientSummary:n=[],profile:a=null}={}){const r=[],o=new Set,i=s=>{const c=dn(s);if(!c)return;const u=`${c.source}:${c.label}:${c.value}:${c.token||""}:${c.key||""}`;o.has(u)||(o.add(u),r.push(c))};return e.forEach(s=>{i({label:s.label,value:s.value,token:s.token,key:s.key,aliases:s.aliases,source:"token"})}),n.forEach(s=>{i({label:s.label,value:s.value,section:"summary",source:"clientSummary"})}),t.forEach(s=>{((s==null?void 0:s.fields)||[]).forEach(c=>{i({label:c.label,value:c.value,section:s.title||s.id,source:"clientInfo"})})}),a&&typeof a=="object"&&(Array.isArray(a.availableFields)?a.availableFields:[]).forEach(s=>{i({label:s.label,value:s.value,key:s.key,aliases:s.aliases,source:"profile"})}),r}function pn(e,t,n){!t||n===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=n)}function fn(e,t,n){const a=xe(t);if(a.length<2||n==="")return;let r=e;for(let i=0;i<a.length-1;i+=1){const s=a[i];if(!s||/^\d+$/.test(s)||(r[s]===void 0&&(r[s]={}),!r[s]||typeof r[s]!="object"||Array.isArray(r[s])))return;r=r[s]}const o=a[a.length-1];o&&!Object.prototype.hasOwnProperty.call(r,o)&&(r[o]=n)}function bn(e={},t=[]){const n={...e};return t.forEach(a=>{a.key&&fn(n,a.key,a.value),a.aliases.forEach(r=>pn(n,r,a.value))}),Qe(n,t),n}const hn=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function gn(e,t){const n=ie(t);return!e||!n?!1:[e.label,e.token,e.key,...e.aliases||[]].some(a=>ie(a)===n)}function Tn(e=[],t=[]){for(const n of t){const a=e.find(o=>gn(o,n)),r=N(a==null?void 0:a.value);if(r!=="")return r}return""}function Qe(e,t=[]){hn.forEach(({name:n,candidates:a})=>{if(Object.prototype.hasOwnProperty.call(e,n))return;const r=Tn(t,a);r!==""&&(e[n]=r)})}function yn({tokens:e=[],fields:t=[],variables:n={}}={}){const a=[],r=new Set,o=i=>{const s=Array.isArray(i.names)?i.names.filter(Boolean):[],c=[i.token||"",i.key||"",i.label||"",i.source||"",s.join("|")].join(":");r.has(c)||(r.add(c),a.push({name:s[0]||i.token||i.key||i.label||"",names:s,token:i.token||"",key:i.key||"",label:i.label||"",value:N(i.value),source:i.source||"context",inputType:i.inputType||"",internal:!!i.internal}))};return e.forEach(i=>{const c=Xe({label:i.label,token:i.token,key:i.key,aliases:i.aliases}).map(F).filter(Boolean);o({names:[...new Set(c)],token:i.token,key:i.key,label:i.label,value:i.value,source:"token",inputType:i.inputType,internal:i.internal})}),t.forEach(i=>{const c=[i.label,i.token,i.key,...i.aliases||[]].map(F).filter(Boolean);o({names:[...new Set(c)],token:i.token,key:i.key,label:i.label,value:i.value,source:i.source})}),Object.entries(n).forEach(([i,s])=>{!i||s===null||typeof s=="object"||o({names:[i],label:i,value:s,source:"variable"})}),a.sort((i,s)=>i.name.localeCompare(s.name))}function kn(e=[]){const t={};return e.forEach(n=>{[n.label,n.token,n.key,...n.aliases||[]].forEach(a=>{const r=ie(a);!r||t[r]||(t[r]={label:n.label,value:n.value,source:n.source,token:n.token||"",key:n.key||"",section:n.section||""})})}),t}function H(e,t,n){const a=F(t);!a||n===""||Object.prototype.hasOwnProperty.call(e,a)||(e[a]=n)}function vn(e,t,n){const a=xe(t).map(F).filter(Boolean);if(a.length<2||n==="")return;let r=e;for(let i=0;i<a.length-1;i+=1){const s=a[i];if(r[s]===void 0&&(r[s]={}),!r[s]||typeof r[s]!="object"||Array.isArray(r[s]))return;r=r[s]}const o=a[a.length-1];o&&!Object.prototype.hasOwnProperty.call(r,o)&&(r[o]=n)}function xn(e,t=null){if(!t||typeof t!="object")return;const n=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(n).forEach(([a,r])=>{const o=N(r);o!==""&&H(e,a,o)})}function wn({fields:e=[],tokens:t=[],tokenValues:n={},environment:a={},profile:r=null}={}){const o={env:a,raw:n,byToken:{},byKey:{},byLabel:{},available:[],availableTokens:[],availableFields:[]};return t.forEach(i=>{i.token&&(o.byToken[i.token]=N(i.value))}),Object.entries(n||{}).forEach(([i,s])=>{const c=N(s);o.byToken[i]=c,c!==""&&(H(o,i,c),H(o,i.replace(/[{}]/g,""),c))}),xn(o,r),e.forEach(i=>{const s=N(i.value);s!==""&&(i.token&&(o.byToken[i.token]=s),i.key&&(o.byKey[i.key]=s,vn(o,i.key,s)),o.byLabel[i.label]=s,[i.label,i.token,i.key,...i.aliases||[]].forEach(c=>{H(o,c,s)}))}),Qe(o,e),o.available=yn({tokens:t,fields:e,variables:o}),o.availableTokens=o.available.filter(i=>i.token),o.availableFields=e.map(i=>({name:F(i.key||i.token||i.label),token:i.token||"",key:i.key||"",label:i.label||"",value:i.value,source:i.source||"context",aliases:i.aliases||[]})),o}function ka({tool:e={},values:t={},tokens:n=[],client:a=null,clientInfo:r=[],clientSummary:o=[],profile:i=null}={}){const s=t&&typeof t=="object"?t:{},c=i&&typeof i=="object"?i:null,u=c!=null&&c.tokenValues&&typeof c.tokenValues=="object"?c.tokenValues:{},l={...s,...u},d=Array.isArray(r)?r:[],m=Array.isArray(o)?o:[],b=un(n,l),h=mn({tokens:b,clientInfo:d,clientSummary:m,profile:c}),f=new Date().toISOString(),T={apiVersion:Z,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:f};return{apiVersion:Z,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:c||null,values:bn(l,h),tokenValues:l,tokens:b,fields:h,fieldIndex:kn(h),variables:wn({fields:h,tokens:b,tokenValues:l,environment:T,profile:c}),environment:T,client:a&&typeof a=="object"?a:null,clientInfo:d,clientSummary:m,generatedAt:f}}function In(e=""){const t=String(e||"").trim(),n=t.match(/^```(?:json|text)?\s*([\s\S]*?)\s*```$/i);return n?n[1].trim():t}function va(e=""){const t=In(e);if(!t)return"";try{const n=JSON.parse(t);return n&&typeof n=="object"&&!Array.isArray(n)&&typeof n.html=="string"&&n.html.trim()?n.html.trim():""}catch{return""}}function U(e=""){const t=N(e);return t?`value: ${t.slice(0,80)}${t.length>80?"…":""}`:"empty now"}function Nn(e={}){const t=Array.isArray(e.names)?e.names.filter(Boolean):[];return[...new Set([e.name,...t].filter(Boolean))].slice(0,8).join(", ")}function Sn(e=null){var c;if(!e||typeof e!="object")return"No live app context was loaded while copying this prompt. The module must discover variables at runtime with TemplateTool.getContext(), TemplateTool.getVars(), TemplateTool.listVariables(), context.tokens and context.fields.";const t=["Live variable inventory from the current app context:","Use these exact names/tokens/keys when they fit the request, and still keep runtime fallbacks because availability changes per customer."],n=e.profile&&typeof e.profile=="object"?e.profile:null,a=n!=null&&n.vars&&typeof n.vars=="object"?n.vars:{},r=Object.entries(a).filter(([,u])=>N(u)!=="").sort(([u],[l])=>u.localeCompare(l));r.length>0&&(t.push("","Profile variables (TemplateProfile / TemplateVars aliases):"),r.forEach(([u,l])=>{t.push(`- ${u} (${U(l)})`)}));const o=Array.isArray((c=e.variables)==null?void 0:c.available)?e.variables.available:[];o.length>0&&(t.push("","Discoverable TemplateVars.available entries:"),o.forEach(u=>{const l=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",`names: ${Nn(u)||"none"}`,`source ${u.source||"context"}`,U(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)}));const i=Array.isArray(e.fields)?e.fields:[];i.length>0&&(t.push("","Resolved context.fields (preferred for visible customer data):"),i.forEach(u=>{const l=[u.label?`label ${u.label}`:"",u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.section?`section ${u.section}`:"",`source ${u.source||"context"}`,U(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)}));const s=Array.isArray(e.tokens)?e.tokens:[];return s.length>0&&(t.push("","All configured context.tokens, including empty values:"),s.forEach(u=>{const l=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",u.inputType?`type ${u.inputType}`:"",u.internal?"internal":"manual/configured",U(u.value)].filter(Boolean);t.push(`- ${l.join("; ")}`)})),r.length===0&&o.length===0&&i.length===0&&s.length===0&&t.push("- No variables are currently configured or populated in this context. Build a missing-data state and rely on runtime discovery."),t.join(`
`)}function xa({title:e="",prompt:t="",runtimeContext:n=null}={}){const a=String(e||"").trim()||"Custom tool",r=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.
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
${Qt()}

Current variable inventory:
${Sn(n)}

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
${r}`}const et="salt-templater-alo-autofill",An=1,K=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function w(e){return e==null?"":String(e).trim()}function y(e){for(const t of e){const n=w(t);if(n)return n}return""}function Cn(e){const t=w(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:w(e)}function se(e){const t=w(e);if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;const a=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(a)return`${a[3]}-${a[2]}-${a[1]}`;const r=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return r?`${r[3]}-${r[1].padStart(2,"0")}-${r[2].padStart(2,"0")}`:t}function W(e){const t=se(e),n=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return n?`${n[3]}.${n[2]}.${n[1]}`:t}function En(e={}){var t,n,a,r,o,i,s;return y([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activationDate,(a=e==null?void 0:e.client)==null?void 0:a.activation_date,(r=e==null?void 0:e.client)==null?void 0:r.activation,(o=e==null?void 0:e.client)==null?void 0:o.dateActivation,(i=e==null?void 0:e.contact)==null?void 0:i.activationDate,(s=e==null?void 0:e.healthcheck)==null?void 0:s.activationDate])}function _n(e={}){const t=w(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function On(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",n=e.signalState==="never"?"never":"lost",a=t==="lowBadRxTx"?"Bad signal":"No signal",r=W(n==="never"?e.activationDate:e.disconnectionDate);return[a,n==="never"?"Never activated":"Signal lost",r].filter(Boolean).join(" - ")}function wa(e={},t={}){var c,u,l;const n=y([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(c=e==null?void 0:e.client)==null?void 0:c.externalTicketId,(u=e==null?void 0:e.client)==null?void 0:u.externalId,(l=e==null?void 0:e.superOffice)==null?void 0:l.externalTicketId]),a=X(n),r=a.ok?a.fields:{},o=_n(r),i=se(En(e)),s=se(y([t==null?void 0:t.createdAt,t==null?void 0:t.created,t==null?void 0:t.ticketDate,t==null?void 0:t.messageDate,t==null?void 0:t.importedAt]));return{externalId:n,externalFields:r,aloType:"",signalState:o,extRef:"",disconnectionDate:o==="lost"?s:"",activationDate:i,description:""}}function tt(e={}){return{firstName:w(e.firstName),lastName:w(e.lastName),email:w(e.email),phoneNumber:y([e.phoneNumber,e.phone])}}function Ln(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:y([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[Q],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:w(e==null?void 0:e.externalTicketId),tokenValues:t}}function Dn(e={},t={},n={},a={}){const r=(e==null?void 0:e.client)||{},o=(e==null?void 0:e.contact)||{},i=(e==null?void 0:e.healthcheck)||{},s=tt(t),c=y([o.fixedNumber,o.voipNumber,o.voip,o.sip,r.fixedNumber,r.fixedPhone]),u=Cn(y([r.mobile,r.mobileRaw,r.phone,r.telephone,o.mobile,o.phone])),l=y([a.description,a.aloType==="lowBadRxTx"?"Bad signal":"",K.problemDescription]),d=y([a.notes,a.signalState?On(a):"",K.problemNotes]),m=a.signalState==="never"?W(a.activationDate):W(a.disconnectionDate);return{externalReference:w(a.extRef),socketId:y([i.otoId,i.oto_id,i.oto]),plugNr:y([i.otoPortId,i.otoPort,i.oto_port]),breakoutCable:y([i.breakoutCableId,i.breakoutCable,i.cable]),breakoutFiber:y([i.fiberNumber,i.fiber,i.fibre]),firstName:y([r.firstName,r.firstname,r.givenName]),lastName:y([r.lastName,r.lastname,r.surname,r.familyName]),contactPhone1:y([c,u]),contactPhone2:c&&u&&c!==u?u:"",contactEmail:y([r.email,r.mail,o.email,o.mail]),notificationType:"Email",preferredContactType:"Mobile",ispFirstName:s.firstName,ispLastName:s.lastName,ispPhone:s.phoneNumber,ispEmail:s.email,...K,problemDescription:l,problemNotes:d,problemDateTime:m,problemCode3:a.aloType==="lowBadRxTx"?"Performance problem":K.problemCode3}}function Vn(e={},t={},n={},a={}){const r=Dn(e,t,n,a),o=tt(t),i=Ln(n);return{source:et,version:An,fields:r,alo:{type:a.aloType||"noSignal",signalState:a.signalState||"",disconnectionDate:a.disconnectionDate||"",activationDate:a.activationDate||"",problemDateTime:r.problemDateTime,notes:a.notes||""},client:{firstName:r.firstName,lastName:r.lastName,contactPhone1:r.contactPhone1,contactPhone2:r.contactPhone2,email:r.contactEmail},technical:{socketId:r.socketId,plugNr:r.plugNr,breakoutCable:r.breakoutCable,breakoutFiber:r.breakoutFiber},agent:o,superOffice:i}}function Ia(e={},t={},n={},a={}){return JSON.stringify(Vn(e,t,n,a),null,2)}function jn(e){function t(l){return l==null?"":String(l).trim()}function n(l){for(var d=0;d<l.length;d+=1){var m=t(l[d]);if(m)return m}return""}function a(l){return t(l).replace(/[&<>"']/g,function(m){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}function r(l,d,m){var b=document.getElementById("saltAloFillOverlay");b&&b.remove();var h=document.createElement("div");h.id="saltAloFillOverlay",h.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(m==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",h.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+a(l)+"</strong><span style='color:#d8d8df'>"+a(d)+"</span>",document.body.appendChild(h),m!=="error"&&setTimeout(function(){try{h.remove()}catch{}},4500)}function o(l,d,m){var b=l&&l.fields||{};return n([b[d]].concat(m||[]))}function i(l,d){var m=String(d).replace(/["\\]/g,"\\$&");return document.querySelector("["+l+'="'+m+'"]')}function s(l){return document.getElementById(l)||i("name",l)||i("formcontrolname",l)||i("data-testid",l)}function c(l,d,m){var b=m?String(d??""):t(d);if(!m&&!b)return!1;var h=s(l);if(!h)return!1;if(h.tagName==="SELECT")for(var f=t(b).toLowerCase(),T=0;T<h.options.length;T+=1){var D=h.options[T];if(t(D.value).toLowerCase()===f||t(D.textContent).toLowerCase()===f){h.value=D.value;break}}else"value"in h?h.value=b:h.textContent=b;return h.dispatchEvent(new Event("input",{bubbles:!0})),h.dispatchEvent(new Event("change",{bubbles:!0})),!0}function u(l){if(!l||typeof l!="object"||Array.isArray(l)){r("ALO fill","ALO fill data invalid.","error");return}if(l.source&&l.source!==e){r("ALO fill","Clipboard does not contain ALO fill data from Salt BO tools.","error");return}var d=l.client||{},m=l.technical||l.healthcheck||{},b=l.agent||{},h=0;function f(T,D,dt){c(T,D,dt)&&(h+=1)}if(f("ticket.extRef",o(l,"externalReference",[])),f("ticket.socketId",o(l,"socketId",[m.socketId,m.otoId,m.oto_id,m.oto])),f("ticket.plugNr",o(l,"plugNr",[m.plugNr,m.otoPortId,m.otoPort,m.oto_port])),f("ticket.breakoutCable",o(l,"breakoutCable",[m.breakoutCable,m.breakoutCableId,m.cable])),f("ticket.breakoutFiber",o(l,"breakoutFiber",[m.breakoutFiber,m.fiberNumber,m.fiber,m.fibre])),f("ticket.otoAddress.firstName",o(l,"firstName",[d.firstName,d.firstname,d.givenName])),f("ticket.otoAddress.lastName",o(l,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),f("ticket.contactPersonFirstName",o(l,"firstName",[d.firstName,d.firstname,d.givenName])),f("ticket.contactPersonLastName",o(l,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),f("ticket.contactPersonPhone1",o(l,"contactPhone1",[d.contactPhone1,d.fixedNumber,d.mobileRaw,d.mobile,d.phone])),f("ticket.contactPersonPhone2",o(l,"contactPhone2",[d.contactPhone2])),f("ticket.contactPersonMail",o(l,"contactEmail",[d.email,d.mail])),f("ticket.contactPersonNotificationsType",o(l,"notificationType",["Email"])),f("ticket.contactPersonPreferredContactType",o(l,"preferredContactType",["Mobile"])),f("ticket.contactPersonIspFirstName",o(l,"ispFirstName",[b.firstName])),f("ticket.contactPersonIspLastName",o(l,"ispLastName",[b.lastName])),f("ticket.contactPersonIspPhone",o(l,"ispPhone",[b.phoneNumber,b.phone])),f("ticket.contactPersonIspMail",o(l,"ispEmail",[b.email])),f("ticket.problemDescription",o(l,"problemDescription",["No signal"])),f("ticket.problemNotes",o(l,"problemNotes",[""]),!0),f("ticket.problemDateTime",o(l,"problemDateTime",[l.alo&&l.alo.problemDateTime])),f("ticket.problemCode1",o(l,"problemCode1",["400"])),f("ticket.problemCode2",o(l,"problemCode2",["800"])),f("ticket.problemCode3",o(l,"problemCode3",["900"])),!h){r("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}r("ALO fill","Fields populated: "+h,"success")}if(r("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){r("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(d){if(!t(d)){r("ALO fill","Clipboard empty. Click ALO fill in Salt BO tools first.","error");return}var m;try{m=JSON.parse(d)}catch{r("ALO fill","Clipboard does not contain valid ALO data.","error");return}u(m)}).catch(function(d){r("ALO fill","Clipboard error: "+(d&&d.message?d.message:d),"error")})}function Na(){const e=JSON.stringify(et);return`javascript:(${jn.toString()})(${e});`}const $n=Object.freeze([{id:"captureData",label:"Capture data",key:"q",code:"KeyQ",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),Fn=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function q(e,t){return!!(e!=null&&e[t])}function zn(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function nt(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function Bn(e,t){return q(e,"ctrlKey")===!!t.ctrlKey&&q(e,"altKey")===!!t.altKey&&q(e,"shiftKey")===!!t.shiftKey&&q(e,"metaKey")===!!t.metaKey}function Mn(e,t){return Bn(e,t)&&(zn(e==null?void 0:e.key,t.key)||nt(e==null?void 0:e.code,t.code))}function Sa(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function Rn(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(Fn))}function Pn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||Rn(e==null?void 0:e.target))}function Aa(e){if(Pn(e))return null;const t=$n.find(n=>Mn(e,n))||null;return!t||e!=null&&e.isComposing&&!nt(e==null?void 0:e.code,t.code)?null:t}const Un="case-profile-beta-1",at=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["providerOrderRef","Provider order ref"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),we=Object.freeze(Object.fromEntries(at)),rt=Object.freeze(at.map(([e])=>e)),Kn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),le=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),ot=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function k(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function v(...e){for(const t of e){const n=k(t);if(n!=="")return n}return""}function O(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function qn(e=""){const t=O(e);return t?t.replace(/_([a-z0-9])/g,(n,a)=>a.toUpperCase()):""}function Ie(e=""){const t=qn(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function De(e=""){const t=O(e);return t?`{${t}}`:""}function L(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function Jn(){const e={};return rt.forEach(t=>{e[t]=""}),{version:Un,fields:e,fieldLabels:{...we},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function it(e){return k(e)!==""}function x(e,t,n,{overwrite:a=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const r=k(n);return r===""||!a&&it(e.fields[t])?!1:(e.fields[t]=r,e[t]=r,!0)}function Ne(e,t,n,{overwrite:a=!1,label:r=""}={}){const o=Ie(t),i=k(n);return!o||i===""||ot.has(o)||!a&&Object.prototype.hasOwnProperty.call(e.dynamic,o)?!1:(e.dynamic[o]=i,r&&!e.fieldLabels[o]&&(e.fieldLabels[o]=r),!0)}function Hn(e,t,n,a={}){const r=O(ee(t)||t),o=le[r]||le[O(t)]||Ie(t);return Object.prototype.hasOwnProperty.call(e.fields,o)?x(e,o,n,a):Ne(e,t,n,a)}function Yn(e,t={},n={}){Object.entries(t).forEach(([a,r])=>x(e,a,r,n))}function ce(e,t=[],n=[]){return Array.isArray(e)?(e.forEach((a,r)=>{t.push(String(r+1)),ce(a,t,n),t.pop()}),n):e&&typeof e=="object"?(Object.keys(e).forEach(a=>{t.push(a),ce(e[a],t,n),t.pop()}),n):(n.push({path:t.slice(),value:k(e)}),n)}function Gn(e=[]){return e[0]===pe||e[0]===fe}function st(e,t,{prefix:n="",skipInternalClientKeys:a=!1}={}){!t||typeof t!="object"||ce(t).filter(r=>r.value!=="").filter(r=>!a||!Gn(r.path)).forEach(r=>{const o=n?[n,...r.path]:r.path;Ne(e,o.join("_"),r.value,{label:o.map(L).join(" ")})})}function Ve(e=[],t=[]){const n=new Map;return[...e,...t].forEach(a=>{if(!a||typeof a!="object")return;const r=`${k(a.url)}|${k(a.name)}|${k(a.id)}`;r.replace(/\|/g,"")&&(n.has(r)||n.set(r,a))}),Array.from(n.values())}function Se(e){const t=k(e);if(!t)return null;const n=X(t);return n.ok?{externalId:t,fields:n.fields}:null}function lt(e,t){var n,a,r,o;t&&(x(e,"externalId",t.externalId),Object.entries(Kn).forEach(([i,s])=>{var c;x(e,s,(c=t.fields)==null?void 0:c[i])}),x(e,"contractorNumber",(n=t.fields)==null?void 0:n.customer),x(e,"lexId",(a=t.fields)==null?void 0:a.lexId),x(e,"oltName",(r=t.fields)==null?void 0:r.oltName),x(e,"oltBoard",(o=t.fields)==null?void 0:o.oltBoard))}function Zn(e,t){var s;if(!t||typeof t!="object")return;const n=t.client||{},a=t.contact||{},r=t.healthcheck||{},o=r.crossConnexion||r.crossConnection||{},i=[n.firstName,n.lastName].map(k).filter(Boolean).join(" ");Yn(e,{clientName:i||v(n.fullName,n.name,n.customerName),title:n.title,firstName:n.firstName,lastName:n.lastName,contractorNumber:v(n.contractorNumber,n.contractor,r.customerId),mobile:v(n.mobile,n.phone,n.telephone),mobileRaw:n.mobileRaw,phone:v(n.phone,n.telephone,a.fixedNumber),email:n.email,address:n.address,communicationLanguage:v(n.communicationLanguage,a.communicationLanguage,n.language,a.language),activationDate:v(n.activationDate,n.activation_date,n.activation,n.dateActivation,(s=t.offer)==null?void 0:s.activationDate,a.activationDate,r.activationDate),eligibilitySource:v(n.eligibilitySource,a.eligibilitySource),contactRecordId:v(n.contactRecordId,a.contactRecordId),fixedNumber:a.fixedNumber,publicId:a.publicId,providerOrderRef:a.providerOrderRef,fllRecordId:r.fllRecordId,otoId:v(r.otoId,r.oto_id,r.oto),otoPortId:v(r.otoPortId,r.otoPort,r.oto_port,o.Port),routerSerialNumber:r.routerSerialNumber,oldRouterSerialNumber:r.oldRouterSerialNumber,lexId:r.lexId,oltName:r.oltName,oltBoard:r.oltBoard,ponPort:r.ponPort,breakoutCableId:r.breakoutCableId,fiberNumber:r.fiberNumber,lineState:r.lineState,routerStatus:r.routerStatus,odfId:r.odfId,option82:r.option82,oltObject:r.oltObject,ontConfigurationFilename:r.ontConfigurationFilename,svlan:r.svlan,customerId:r.customerId,crossConnectionEquipment:o.Equipment,crossConnectionRack:o.Rack,crossConnectionSlot:o.Slot,crossConnectionPort:o.Port}),lt(e,Se(t[fe])),st(e,t,{skipInternalClientKeys:!0})}function Wn(e,t){var r;if(!t||typeof t!="object")return;x(e,"soTicketNum",v(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(r=t.tokenValues)==null?void 0:r[Q])),x(e,"ticketCreatedAt",v(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),lt(e,Se(t.externalTicketId)),ct(e,t.tokenValues);const n=M(t.attachments),a=ge(n);e.attachments=Ve(e.attachments,n),e.photos=Ve(e.photos,a),st(e,t,{prefix:"ticket"})}function ct(e,t={},n={}){!t||typeof t!="object"||Object.entries(t).forEach(([a,r])=>{const o=k(r);if(o==="")return;const i=ee(a),s=pt(i)||O(a),c=le[s];c&&x(e,c,o,n),s==="external_customer"&&x(e,"contractorNumber",o,n),s==="external_lex_id"&&x(e,"lexId",o,n),s==="external_olt_name"&&x(e,"oltName",o,n),s==="external_olt_board"&&x(e,"oltBoard",o,n),Ne(e,s,o,{...n,label:L(s)})})}function Xn(e,t){const n=t==null?void 0:t[pe];!n||typeof n!="object"||Array.isArray(n)||Object.entries(n).forEach(([a,r])=>{Hn(e,a,r,{overwrite:!0,label:L(a)})})}function je(e,t,n){const a=Ie(t),r=k(n);!a||r===""||ot.has(a)||Object.prototype.hasOwnProperty.call(e,a)||(e[a]=r)}function Qn(e,t={}){const n={},a={},r=[];rt.forEach(s=>{const c=k(e.fields[s]);if(c==="")return;je(n,s,c);const u=De(s);u&&(a[u]=c),r.push({key:s,label:we[s]||L(s),value:c})}),Object.entries(e.dynamic).forEach(([s,c])=>{const u=k(c);if(u==="")return;je(n,s,u);const l=De(s);l&&!Object.prototype.hasOwnProperty.call(a,l)&&(a[l]=u),e.fields[s]||r.push({key:s,label:e.fieldLabels[s]||L(s),value:u})});const o=Se(e.externalId);o&&Object.assign(a,ue(o.fields)),it(e.soTicketNum)&&(a[Q]=e.soTicketNum);const i={};return Object.entries(t||{}).forEach(([s,c])=>{const u=ee(s)||s;i[u]=c}),e.vars=n,e.variables=n,e.tokenValues={...i,...a},e.availableFields=r,e}function Ca({clientPayload:e=null,superOfficePayload:t=null,tokenValues:n={}}={}){const a=Jn();return Zn(a,e),Wn(a,t),ct(a,n),Xn(a,e),Qn(a,n)}function p(e,t,n=""){var r;const a=k((e==null?void 0:e[t])??((r=e==null?void 0:e.fields)==null?void 0:r[t]));return a?{label:n||we[t]||L(t),value:a}:null}function A(e,t){const n=k(t);return n?{label:e,value:n}:null}function ut(e=[]){const t=new Set;return e.filter(Boolean).filter(n=>{const a=`${O(n.label)}:${n.value}`;return t.has(a)?!1:(t.add(a),!0)})}function J(e,t,n=[]){const a=ut(n);return a.length>0?{id:e,title:t,fields:a}:null}function Ea(e=null){return!e||typeof e!="object"?[]:ut([A("Name",e.clientName),A("Mobile",v(e.mobile,e.mobileRaw,e.phone)),A("Contractor",v(e.contractorNumber,e.externalCustomer,e.customerId)),A("Activation",e.activationDate),A("OTO ID",e.otoId),A("Port",v(e.otoPortId,e.crossConnectionPort)),A("SO ticket",e.soTicketNum)])}function _a(e=null){return!e||typeof e!="object"?[]:[J("caseClient","Client",[p(e,"clientName","Full name"),p(e,"contractorNumber","Contractor"),p(e,"title"),p(e,"firstName"),p(e,"lastName"),p(e,"mobile"),p(e,"mobileRaw","Mobile raw"),p(e,"phone"),p(e,"email"),p(e,"address"),p(e,"communicationLanguage","Language"),p(e,"activationDate","Activation date")]),J("caseSuperOffice","SuperOffice",[p(e,"soTicketNum","SO ticket"),p(e,"ticketCreatedAt","Created at"),p(e,"externalId","External ID"),p(e,"externalPartner","Partner"),p(e,"externalPartnerTicketNumber","Partner ticket")]),J("caseExternalId","External ID fields",[p(e,"externalFlagging","Flagging"),p(e,"externalDate","Date"),p(e,"externalCustomer","Contractor"),p(e,"externalSignalStatus","Signal"),p(e,"externalLedStatus","LED"),p(e,"externalTreatmentStep","Treatment"),p(e,"externalBoxType","Box"),p(e,"externalLexId","LEX ID"),p(e,"externalOltName","OLT"),p(e,"externalOltBoard","Board"),p(e,"externalBokBof","BOK/BOF"),p(e,"externalComment","Comment")]),J("caseTechnical","Technical",[p(e,"fllRecordId","FLL record"),p(e,"otoId","OTO ID"),p(e,"otoPortId","OTO port"),p(e,"routerSerialNumber","Router serial"),p(e,"oldRouterSerialNumber","Old router serial"),p(e,"lexId","LEX ID"),p(e,"oltName","OLT"),p(e,"oltBoard","OLT board"),p(e,"ponPort","PON port"),p(e,"breakoutCableId","Breakout cable"),p(e,"fiberNumber","Fiber number"),p(e,"lineState","Line state"),p(e,"routerStatus","Router status"),p(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{xa as A,va as B,ra as C,Te as D,ia as E,$n as K,oa as P,Ft as S,Pe as a,ca as b,ha as c,pa as d,Ta as e,ka as f,E as g,ga as h,la as i,ya as j,Ca as k,fa as l,_a as m,Ea as n,Rt as o,sa as p,ua as q,ba as r,da as s,wa as t,Ia as u,ma as v,Aa as w,On as x,Na as y,Sa as z};
