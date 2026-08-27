import{c as be}from"./appConfigService-BwOyID2I.js";import{p as re,b as he,S as ne,x as oe,O as j,r as P,B as _t,J as ge,V as Te,Y as ye,Z as ke,_ as Ot,f as Lt}from"./tokenService-DH-fZkFu.js";import{l as q,s as ve,d as Dt}from"./templateTreeService-sO7uz_YW.js";import{f as Xe,u as Ye}from"./templateTreeOperations-CNlo_ije.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Un=be("chevron-right",Vt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Pn=be("circle-check",Rt);/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",key:"w46dr5"}]],qn=be("puzzle",jt),Ge="salt-bo-browser-capture.v1",We=Object.freeze({APP:"salt-template-generator",EXTENSION:"salt-bo-capture-extension"}),y=Object.freeze({READY:"salt.capture.ready.v1",STATUS_REQUEST:"salt.capture.status.request.v1",STATUS:"salt.capture.status.v1",START_CAPTURE:"salt.capture.start.v1",START_ALO:"salt.capture.alo.start.v1",START_ALEX:"salt.capture.alex.start.v1",ACCEPTED:"salt.capture.accepted.v1",PROGRESS:"salt.capture.progress.v1",COMPLETED:"salt.capture.completed.v1",ACTION_COMPLETED:"salt.capture.action.completed.v1",FAILED:"salt.capture.failed.v1",HEALTHCHECK:"salt.capture.healthcheck.v1"}),Kn=Object.freeze({LOCATING_TABS:"LOCATING_TABS",SUPER_OFFICE_CAPTURE:"SUPER_OFFICE_CAPTURE",VTI_CAPTURE:"VTI_CAPTURE",IMPORTING:"IMPORTING",COMPLETED:"COMPLETED",FAILED:"FAILED"});y.STATUS_REQUEST,y.START_CAPTURE,y.START_ALO,y.START_ALEX;const Bt=new Set([y.READY,y.STATUS,y.ACCEPTED,y.PROGRESS,y.COMPLETED,y.ACTION_COMPLETED,y.FAILED]);function Ft(e){return typeof(e==null?void 0:e.requestId)=="string"&&e.requestId.trim().length>0}function Ze(e,t,r={}){return{...r,channel:Ge,source:We.APP,type:e,requestId:t}}function $t(e){return!!(e&&e.channel===Ge&&e.source===We.EXTENSION&&Bt.has(e.type)&&Ft(e))}const Mt=/\.(jpe?g|jfif|png|webp|gif|bmp|avif|heic|heif|tiff?|ico|svg)(?:$|[?#])/i,zt=/\.(mp4|mov)(?:$|[?#])/i,Ut=/\.pdf(?:$|[?#])/i,Pt=["{contractor}","{contractor_number}","{client_contractor_number}"];function T(...e){for(const t of e){const r=String(t??"").trim();if(r)return r}return""}function qt(e){if(e&&typeof e=="object"&&!Array.isArray(e))return e;if(typeof e!="string")return null;try{const t=JSON.parse(e);return t&&typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}}function Kt(e="",t=""){const r=`${e} ${t}`;return Mt.test(r)?"image":zt.test(r)?"video":Ut.test(r)?"pdf":"file"}function Jt(e=""){const t=String(e||"").trim().toLowerCase();return t==="image"||t.startsWith("image/")}function Ht(e=""){const t=String(e||"").trim().toLowerCase();return t==="video"||t==="mp4"||t==="mov"||t.startsWith("video/")}function Xt(e=""){const t=String(e||"").trim().toLowerCase();return t==="pdf"||t==="application/pdf"}function Yt(...e){for(const t of e){if(Jt(t))return"image";if(Ht(t))return"video";if(Xt(t))return"pdf"}return""}function Gt(...e){for(const t of e){const r=T(t),n=r.toLowerCase();if(n){if(n.includes("/"))return r;if(n==="pdf")return"application/pdf";if(n==="mp4")return"video/mp4";if(n==="mov")return"video/quicktime"}}return""}function Wt(e={}){var t,r,n;return T(e.date,e.messageDate,e.messageDateTime,e.createdAt,e.created,e.sentAt,e.receivedAt,e.timestamp,(t=e.message)==null?void 0:t.date,(r=e.message)==null?void 0:r.createdAt,(n=e.message)==null?void 0:n.sentAt)||null}function M(e){if(e==null||e==="")return null;const t=Number(e);return Number.isInteger(t)&&t>=0?t:null}function Zt(e,t){var l,u,f,c,d;if(!e||typeof e!="object"||Array.isArray(e))return null;const r=T(e.url,e.href,e.src,e.downloadUrl);if(!r)return null;const n=T(e.name,e.filename,e.fileName,e.title,decodeURIComponent(((l=String(r).split("/").pop())==null?void 0:l.split("?")[0])||""))||`Attachment ${t+1}`,o=T(e.type,e.contentType,e.mimeType),i=Gt(e.contentType,e.mimeType,e.type,e.mediaType),a=Yt(e.type,e.contentType,e.mimeType,e.mediaType)||Kt(n,r),s=T(e.messageId,e.messageID,e.postId,(u=e.message)==null?void 0:u.id)||null;return{id:T(e.id,e.attachmentId,e.documentId)||`${t}-${n}-${r}`,name:n,url:r,dataUrl:T(e.dataUrl)||null,type:a,contentType:i||o||null,size:T(e.size,e.sizeText,e.fileSize)||null,messageId:s,postId:T(e.postId,s)||null,messageIndex:M(T(e.messageIndex,e.messageOrder,e.postIndex,(f=e.message)==null?void 0:f.index)),attachmentIndex:M(T(e.attachmentIndex,e.fileIndex)),messageAuthor:T(e.messageAuthor,e.author,e.createdBy,(c=e.message)==null?void 0:c.author,(d=e.message)==null?void 0:d.createdBy)||null,source:T(e.source,e.origin)||null,date:Wt(e)}}function $e(e){return String(e).padStart(2,"0")}function Qt(e){const t=e.getFullYear(),r=$e(e.getMonth()+1),n=$e(e.getDate());return{dateKey:`${t}-${r}-${n}`,label:`${n}.${r}.${t}`,sortValue:new Date(t,e.getMonth(),e.getDate()).getTime()}}function Me(e,t,r,n=0,o=0,i=0){if(t<0||t>11||r<1||r>31||n<0||n>23||o<0||o>59||i<0||i>59)return null;const a=new Date(e,t,r,n,o,i);return a.getFullYear()!==e||a.getMonth()!==t||a.getDate()!==r?null:a}function er(e){if(e==null||e==="")return null;if(typeof e=="number"&&Number.isFinite(e)){const i=new Date(e);return Number.isNaN(i.getTime())?null:i}const t=String(e).trim();if(!t)return null;const r=t.match(/\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(r){const i=Me(Number(r[1]),Number(r[2])-1,Number(r[3]),Number(r[4]||0),Number(r[5]||0),Number(r[6]||0));if(i)return i}const n=t.match(/\b(\d{1,2})([./-])(\d{1,2})\2(\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\b/);if(n){const i=Number(n[1]),a=n[2],s=Number(n[3]),l=Number(n[4]),u=l<100?2e3+l:l,f=Number(n[5]||0),c=Number(n[6]||0),d=Number(n[7]||0),m=a==="/"&&s>12&&i<=12,g=m?s:i,b=(m?i:s)-1,p=Me(u,b,g,f,c,d);if(p)return p}const o=new Date(t);return Number.isNaN(o.getTime())?null:o}function we(e={}){const t=er(e.date);return t?Qt(t):{dateKey:"unknown",label:"Date non disponible",sortValue:Number.NEGATIVE_INFINITY}}function tr(e,t){const r=T(t);r&&Pt.forEach(n=>{e[n]=r})}function ze(e){return!!(e&&typeof e=="object"&&!Array.isArray(e))}function rr(e,t,r){const n=oe(t),o=T(r);!n||!o||e.push([n,o])}function Qe(e,t=[]){const r=[];return ze(e)&&Object.entries(e).forEach(([n,o])=>{if(ze(o)){r.push(...Qe(o,[...t,n]));return}rr(r,[...t,n].join("."),o)}),r}function nr(e={}){const t={};return["tokenValues","values","variables","fields"].forEach(r=>{Qe(e[r]).forEach(([n,o])=>{t[n]=o})}),t}function K(e=[]){if(!Array.isArray(e))return[];const t=new Set;return e.map(Zt).filter(Boolean).filter(r=>{const n=`${r.name}|${r.url}`;return t.has(n)?!1:(t.add(n),!0)})}function xe(e=[]){return K(e).filter(t=>t.type==="image")}function Ie(e=[]){return K(e).filter(t=>["image","video","pdf"].includes(t.type))}function or(e=[]){const t=new Map;return e.forEach((r,n)=>{const o=we(r);t.has(o.dateKey)||t.set(o.dateKey,{...o,postLabel:"Post non identifié",dateLabel:o.label,author:T(r.messageAuthor),attachments:[]}),t.get(o.dateKey).attachments.push({...r,galleryIndex:n})}),Array.from(t.values()).sort((r,n)=>n.sortValue-r.sortValue)}function Ue(e={}){var t;return T(e.postId,e.messageId,e.messageID,(t=e.message)==null?void 0:t.id)}function Pe(e={},t=0){const r=M(e.messageNumber),n=M(e.messageIndex);return`Post ${r||(n===null?t+1:n+1)}`}function ar(e={}){const t=we(e),r=T(e.messageAuthor);return t.dateKey==="unknown"?r:[t.label,r].filter(Boolean).join(" · ")}function Jn(e=[]){const t=Ie(e);if(!t.some(n=>Ue(n)))return or(t);const r=new Map;return t.forEach((n,o)=>{const i=Ue(n),a=we(n),s=i||`unassigned:${a.dateKey}`;if(!r.has(s)){const l=r.size;r.set(s,{dateKey:s,label:i?Pe(n,l):a.label,metaLabel:i?ar(n):"",postLabel:i?Pe(n,l):"Post non identifié",dateLabel:a.label,author:T(n.messageAuthor),sortValue:M(n.messageIndex)??o,attachments:[]})}r.get(s).attachments.push({...n,galleryIndex:o})}),Array.from(r.values()).sort((n,o)=>n.sortValue-o.sortValue)}function Hn(e){var b,p,A,w,O,le,Re,je,Be,Fe;const t=qt(e);if(!t)return{ok:!1,error:"INVALID_SUPER_OFFICE_JSON"};const r=T(t.ticketId,t.soTicket,t.soTicketNumber,t.ticketNumber),n=T(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate),o=T(t.firstPostAt,t.firstPostDate,t.firstMessageAt,t.firstMessageDate,(p=(b=t.posts)==null?void 0:b[0])==null?void 0:p.createdAt,(w=(A=t.posts)==null?void 0:A[0])==null?void 0:w.date,(le=(O=t.messages)==null?void 0:O[0])==null?void 0:le.createdAt,(je=(Re=t.messages)==null?void 0:Re[0])==null?void 0:je.date),i=T(t.externalTicketId,t.externalId,t.externalID,t.hcampExternalId),a=T(t.contractorNumber,t.contractor,t.contractorNo,t.customerId,t.customer,(Be=t.client)==null?void 0:Be.contractorNumber,(Fe=t.client)==null?void 0:Fe.contractor),s={};let l=null,u=!1;const f=K(t.attachments),c=xe(f),d=Ie(f);if(i){const ce=re(i);ce.ok&&(u=!0,l=ce.fields,Object.assign(s,he(ce.fields)))}Object.assign(s,nr(t));const m=(l==null?void 0:l.customer)||a;m&&(u||r||f.length>0)&&tr(s,m);const g=r||(l==null?void 0:l.soTicket)||"";return g&&(s[ne]=g),Object.keys(s).length===0&&f.length===0?{ok:!1,error:"EMPTY_SUPER_OFFICE_DATA",externalIdValid:u,externalTicketId:i}:{ok:!0,ticketId:g,sourceTicketId:r,createdAt:n,firstPostAt:o,externalTicketId:i,contractorNumber:m,externalIdValid:u,externalFields:l,tokenValues:s,attachments:f,imageAttachments:c,mediaAttachments:d,ignoredExternalId:!!(i&&!u)}}const ir=1200,et=2200,sr=45e3;function Xn(e,t){const r=i=>String(i||"").split(".").slice(0,3).map(a=>Number(a)),n=r(e),o=r(t);if(n.length!==3||o.length!==3||[...n,...o].some(i=>!Number.isInteger(i)||i<0))return!1;for(let i=0;i<3;i+=1){if(n[i]>o[i])return!0;if(n[i]<o[i])return!1}return!0}function Ae(){var e;return(e=globalThis.crypto)!=null&&e.randomUUID?globalThis.crypto.randomUUID():`capture-${Date.now()}-${Math.random().toString(16).slice(2)}`}function tt(e){if(typeof window>"u")return()=>{};const t=r=>{r.source!==window||r.origin!==window.location.origin||$t(r.data)&&e(r.data)};return window.addEventListener("message",t),()=>window.removeEventListener("message",t)}function rt(e,t,r,n,o={}){return typeof window>"u"?Promise.resolve(null):new Promise(i=>{let a=null;const s=tt(l=>{l.requestId!==t||!r.includes(l.type)||(window.clearTimeout(a),s(),i(l))});a=window.setTimeout(()=>{s(),i(null)},n),window.postMessage(Ze(e,t,o),window.location.origin)})}async function Yn(){const e=Ae();return rt(y.STATUS_REQUEST,e,[y.STATUS,y.FAILED],ir)}async function Gn(e=Ae()){return rt(y.START_CAPTURE,e,[y.ACCEPTED,y.FAILED],et)}function nt(e,t){if(typeof window>"u")return Promise.resolve(null);const r=Ae();return new Promise(n=>{let o=null,i=null,a=!1;const s=u=>{a||(a=!0,o&&window.clearTimeout(o),i&&window.clearTimeout(i),l(),n(u))},l=tt(u=>{if(u.requestId===r){if(u.type===y.ACCEPTED){window.clearTimeout(o),i=window.setTimeout(()=>s({type:y.FAILED,requestId:r,error:"L’opération de l’extension a dépassé le délai autorisé."}),sr);return}[y.ACTION_COMPLETED,y.FAILED].includes(u.type)&&s(u)}});o=window.setTimeout(()=>s(null),et),window.postMessage(Ze(e,r,{payload:t}),window.location.origin)})}function Wn(e){return nt(y.START_ALO,e)}function Zn(e){return nt(y.START_ALEX,e)}const J="super_office_ticket_payload",Se="pending_super_office_ticket_payload",ae="previous_super_office_ticket_payload",lr="super-office-ticket-updated";function cr(e){if(!e||typeof e!="object"||Array.isArray(e))return e;const{[ye]:t,[ke]:r,...n}=e;return n}function ue(e){return Array.isArray(e)?`[${e.map(ue).join(",")}]`:e&&typeof e=="object"?`{${Object.keys(e).sort().map(t=>`${JSON.stringify(t)}:${ue(e[t])}`).join(",")}}`:JSON.stringify(e)}function V(e=null){if(!e||typeof e!="object"||Array.isArray(e))return"";try{return ue(cr(e))}catch{return""}}const ur=new Set(["billingaccount","contractornumber","customerid","publicid","contactrecordid"]);function de(e,t=new Map){return!e||typeof e!="object"||Array.isArray(e)||Object.entries(e).forEach(([r,n])=>{if(r.startsWith("__"))return;const o=r.replace(/[^a-z0-9]/gi,"").toLowerCase();if(ur.has(o)){const i=String(n??"").trim().toLowerCase();i&&t.set(o,i);return}n&&typeof n=="object"&&de(n,t)}),t}function Qn(e,t){const r=de(e),n=de(t);for(const[o,i]of r)if(n.get(o)===i)return!0;return V(e)===V(t)}function z(e){typeof window>"u"||window.dispatchEvent(new CustomEvent(lr,{detail:{payload:e}}))}function C(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=K(e.attachments),r=String(e.clientSignature||"").trim(),n=e.tokenValues&&typeof e.tokenValues=="object"&&!Array.isArray(e.tokenValues)?Object.fromEntries(Object.entries(e.tokenValues).map(([o,i])=>[o,i==null?"":String(i)])):{};return{ticketId:String(e.ticketId||"").trim(),sourceTicketId:String(e.sourceTicketId||"").trim(),createdAt:String(e.createdAt||e.created||e.createdDate||"").trim(),firstPostAt:String(e.firstPostAt||e.firstPostDate||e.firstMessageAt||"").trim(),externalTicketId:String(e.externalTicketId||"").trim(),importedAt:e.importedAt||new Date().toISOString(),clientSignature:r,tokenValues:n,attachments:t,imageAttachments:xe(t),mediaAttachments:Ie(t)}}function dr(e,t=new Date,r=""){return C({ticketId:(e==null?void 0:e.ticketId)||"",sourceTicketId:(e==null?void 0:e.sourceTicketId)||"",createdAt:(e==null?void 0:e.createdAt)||"",firstPostAt:(e==null?void 0:e.firstPostAt)||"",externalTicketId:(e==null?void 0:e.externalTicketId)||"",importedAt:t.toISOString(),clientSignature:r,tokenValues:(e==null?void 0:e.tokenValues)||{},attachments:(e==null?void 0:e.attachments)||[]})}async function ie(e){e&&await Te(J,e)}async function ot(e){e&&await Te(ae,e)}async function at(e){e&&await Te(Se,e)}async function se(){try{return C(await j(Se,null))}catch(e){return console.error("loadPendingSuperOfficeTicketPayload error",e),null}}function eo(){return se()}async function mr(){return await it()||await se()}async function to(){return!!await mr()}function Ee(){return ge(Se)}function Q(){return ge(ae)}async function ro(e){const t=await P(),r=dr(e,new Date,V(t));if(!r)return null;if(!r.clientSignature)return await ee(),await at(r),z(null),r;const n=C(await j(J,null)),o=(n==null?void 0:n.ticketId)||(n==null?void 0:n.sourceTicketId)||"",i=r.ticketId||r.sourceTicketId||"";return(n==null?void 0:n.clientSignature)===r.clientSignature&&o&&i&&o!==i&&await ot(n),await ie(r),await Ee(),z(r),r}async function no(e){const t=_t(e);if(!t)return null;const r=await it(),n=r?null:await se(),o=r||n;if(!o)return null;const i=re(t),a=i.ok?{...o.tokenValues||{},...he(i.fields)}:o.tokenValues||{},s=C({...o,externalTicketId:t,tokenValues:a});return s?(s.clientSignature?await ie(s):await at(s),z(s),s):null}function ee(){return ge(J)}async function oo(){const e=await se(),t=V(await P());if(!e||!t)return null;const r={...e,clientSignature:t};return await ie(r),await Ee(),z(r),r}async function it(){try{const e=await j(J,null);if(!e)return null;const t=V(await P());if(!t)return await ee(),await Q(),null;if((e==null?void 0:e.clientSignature)!==t)return await ee(),await Q(),null;const r=C(e);return r||null}catch(e){return console.error("loadSuperOfficeTicketPayload error",e),null}}async function ao(){try{const e=C(await j(ae,null));if(!e)return null;const t=V(await P());return!t||e.clientSignature!==t?(await Q(),null):e}catch(e){return console.error("loadPreviousSuperOfficeTicketPayload error",e),null}}async function io(){const e=V(await P());if(!e)return!1;const t=C(await j(J,null)),r=C(await j(ae,null));return await Promise.all([t?ie({...t,clientSignature:e}):Promise.resolve(),r?ot({...r,clientSignature:e}):Promise.resolve()]),!!(t||r)}async function so(){await ee(),await Ee(),await Q(),z(null)}const fr=new Set(["title","description","channels","contentByChannel","favorite","nodeIds","parentNodeId","order"]);function Ne(e){return e==null?e:JSON.parse(JSON.stringify(e))}function $(e){return Array.isArray(e)?e:e==null||e===""?[]:[e]}function D(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function st(e=[]){return new Map(e.map(t=>[t.id,t]))}function lt(e,t){if(!e)return"";const r=[],n=new Set;let o=e;for(;o&&!n.has(o.id);)n.add(o.id),r.unshift(o.title||o.id),o=o.parentId?t.get(o.parentId):null;return r.join(" / ")}function pr(e=[]){const t=st(e);return e.map(r=>({...r,path:lt(r,t)}))}function ct(e=[],t){const r=String(t||"").trim();if(!r)return null;const n=st(e);if(n.has(r))return n.get(r);const o=D(r);return e.find(i=>D(i.title)===o||D(lt(i,n))===o)||null}function br(e=[],t={}){return ct(e,t.fromNodeId||t.sourceNodeId||t.fromTopicId||t.sourceTopicId||t.fromNode||t.sourceNode||t.fromTopic||t.sourceTopic)}function hr(e=[],t={}){return ct(e,t.toNodeId||t.targetNodeId||t.toTopicId||t.targetTopicId||t.toNode||t.targetNode||t.toTopic||t.targetTopic)}function gr(e,t={},r=null){const n=$(t.templateIds||t.templateId).map(String).filter(Boolean);if(n.length>0&&!n.includes(e.id)||r&&!(e.nodeIds||[]).includes(r.id))return!1;const o=$(t.channels||t.channel).map(s=>String(s||"").trim()).filter(Boolean);if(o.length>0&&!o.some(s=>(e.channels||[]).includes(s)))return!1;const i=String(t.title||t.templateTitle||"").trim();if(i&&D(e.title)!==D(i))return!1;const a=$(t.titleIncludes||t.templateTitleIncludes).map(D).filter(Boolean);if(a.length>0){const s=D(e.title);if(!a.some(l=>s.includes(l)))return!1}return!0}function Tr({template:e,sourceNode:t,targetNode:r,reason:n=""}){return{action:"moveTemplate",templateId:e.id,templateTitle:e.title||"",sourceNodeId:(t==null?void 0:t.id)||null,sourceNodeTitle:(t==null?void 0:t.title)||"",targetNodeId:r.id,targetNodeTitle:r.title||"",reason:n}}function ut({nodes:e=[],templates:t=[]}={}){return{nodes:pr(e),templates:Ne(t),counts:{nodes:e.length,templates:t.length}}}function dt(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Template patch must be an object.");const t={};return Object.entries(e).forEach(([r,n])=>{fr.has(r)&&(t[r]=n)}),t}async function mt(){return ut(await q())}async function yr(){return mt()}async function kr(e=[]){const t=$(e),{nodes:r,templates:n}=await q(),o=[],i=[];return t.forEach((a,s)=>{if(!a||typeof a!="object"||Array.isArray(a)){i.push({ruleIndex:s,reason:"Rule must be an object."});return}const l=hr(r,a);if(!l){i.push({ruleIndex:s,reason:"Target topic was not found."});return}const u=br(r,a),f=n.filter(c=>gr(c,a,u));if(f.length===0){i.push({ruleIndex:s,reason:"No templates matched this rule."});return}f.forEach(c=>{(c.nodeIds||[])[0]===l.id&&(!u||u.id===l.id)||o.push(Tr({template:c,sourceNode:u,targetNode:l,reason:a.reason||`Rule ${s+1}`}))})}),{ok:!0,ruleCount:t.length,operationCount:o.length,affectedTemplateCount:new Set(o.map(a=>a.templateId)).size,operations:o,skipped:i}}async function vr(e=[]){const t=$(e),r=await q();let n=r.nodes,o=r.templates;const i=[],a=[];return t.forEach((s,l)=>{var f;const u=(s==null?void 0:s.action)||(s==null?void 0:s.type);if(!s||typeof s!="object"||Array.isArray(s)){a.push({operationIndex:l,reason:"Operation must be an object."});return}if(u==="moveTemplate"){const c=String(s.templateId||""),d=String(s.targetNodeId||s.toNodeId||"");if(!c||!d){a.push({operationIndex:l,reason:"moveTemplate requires templateId and targetNodeId."});return}const m=o.find(p=>p.id===c),g=s.sourceNodeId||((f=m==null?void 0:m.nodeIds)==null?void 0:f[0])||null,b=JSON.stringify(o);o=Xe(o,c,g,d,Number(s.targetIndex),n),JSON.stringify(o)!==b&&i.push({operationIndex:l,action:u,templateId:c,targetNodeId:d});return}if(u==="updateTemplate"){const c=String(s.templateId||"");if(!c){a.push({operationIndex:l,reason:"updateTemplate requires templateId."});return}const d=dt(s.patch||s.fields||{}),m=JSON.stringify(o);o=Ye(o,c,d),JSON.stringify(o)!==m&&i.push({operationIndex:l,action:u,templateId:c});return}a.push({operationIndex:l,reason:`Unsupported operation: ${u||"unknown"}.`})}),i.length>0&&await ve({nodes:n,templates:o}),{ok:!0,appliedCount:i.length,skippedCount:a.length,applied:i,skipped:a,tree:ut({nodes:n,templates:o})}}async function wr(e,t={}){const r=String(e||"");if(!r)throw new Error("templateId is required.");const n=await q();if(!n.templates.some(i=>i.id===r))throw new Error("Template was not found.");const o=Ye(n.templates,r,dt(t));return await ve({nodes:n.nodes,templates:o}),{ok:!0,template:Ne(o.find(i=>i.id===r))}}async function xr(e,t,r={}){var u;const n=String(e||""),o=String(t||"");if(!n||!o)throw new Error("templateId and targetNodeId are required.");const i=await q();if(!i.templates.some(f=>f.id===n))throw new Error("Template was not found.");const a=i.templates.find(f=>f.id===n),s=(r==null?void 0:r.sourceNodeId)||((u=a==null?void 0:a.nodeIds)==null?void 0:u[0])||null,l=Xe(i.templates,n,s,o,Number(r==null?void 0:r.targetIndex),i.nodes);return await ve({nodes:i.nodes,templates:l}),{ok:!0,template:Ne(Dt(l.find(f=>f.id===n)))}}async function lo(e,t={}){switch(e){case"tool:templates:list":return mt();case"tool:templates:get-tree":return yr();case"tool:templates:preview-migration":return kr(t.rules||t);case"tool:templates:apply-migration":return vr(t.operations||t);case"tool:templates:update-template":return wr(t.templateId,t.patch||t.fields||{});case"tool:templates:move-template":return xr(t.templateId,t.targetNodeId,t.options||{});default:throw new Error("Unsupported template module request.")}}const te="template-tool-module-beta-2",ft=Object.freeze({name:"Template Generator Module API",version:te,globals:{TemplateTool:{type:"object",description:"Host bridge used by module JavaScript to read data, copy content, show feedback and control the module modal."},TemplateVars:{type:"object",description:"Runtime variables with safe JavaScript property names, populated after TemplateTool.getContext()."},TemplateProfile:{type:"object",description:"Normalized customer profile with easy fields, variables, tokens, photos and attachments."},TemplateEnv:{type:"object",description:"Execution metadata for the current module."},TemplateFields:{type:"array",description:"Normalized visible fields available to the module."},TemplateContext:{type:"object",description:"Full runtime context returned by TemplateTool.getContext()."},TemplateAPI:{type:"object",description:"Static API reference exposed inside every module."}},variables:{access:"await TemplateTool.getContext(); then read window.TemplateVars",containers:{"context.profile / TemplateProfile":"Normalized customer and case profile with common scalar fields, tokenValues, vars, photos and attachments.","context.variables / TemplateVars":"Variable-friendly aliases generated from profile fields, tokens and visible client fields. This is the preferred object for JavaScript property access.","TemplateVars.byToken":"Exact token lookup keyed by brace tokens such as {client_first_name}. Includes known tokens even when the current value is empty.","TemplateVars.byKey":"Lookup keyed by structured token keys such as client.firstName or contractorNumber.","TemplateVars.byLabel":"Lookup keyed by user-facing field labels from the app.","TemplateVars.available":"Discovery list for every exposed variable with names, token, key, label, value, source, inputType and internal.","TemplateVars.availableTokens":"Subset of TemplateVars.available that comes from token definitions.","TemplateVars.availableFields":"Visible normalized field list with aliases for customer-facing selectors.","context.tokens":"All configured token definitions, including manual/internal tokens and empty values.","context.fields / TemplateFields":"Best normalized list for user-facing customer, case and profile fields.","context.fieldIndex":"Normalized lookup map for labels, tokens, keys and aliases with punctuation/accent/braces removed.","context.client":"Raw imported VTI/customer payload. Use only when the module needs structured nested source data.","context.clientInfo":"Visible client detail sections used by the app UI.","context.clientSummary":"Compact client bar fields currently selected in the app."},examples:["TemplateVars.clientName","TemplateVars.mobile","TemplateVars.contractor","TemplateVars.activationDate","TemplateVars.otoId","TemplateVars.soTicketNum","TemplateVars.byToken['{client_first_name}']","TemplateVars.byKey['client.firstName']","TemplateVars.byLabel['Full name']","TemplateVars.available.map((entry) => entry.name)"],reservedContainers:["env","raw","byToken","byKey","byLabel","available","availableTokens","availableFields"]},dataAccess:{appDatabase:"Authorized only through TemplateTool APIs. TemplateTool.templates reads and writes the app's IndexedDB-backed topic/template data through host services.",internet:"Public Internet API/database access is authorized for explicit user-requested public HTTP(S) read requests. Prefer TemplateTool.fetchJson(url) or TemplateTool.fetchText(url) for CORS-enabled Internet APIs/databases.",restrictions:"Do not use secrets, cookies, credentials, private/local network URLs, remote scripts, CDNs, remote fonts, eval, parent DOM access, localStorage or raw IndexedDB."},contextShape:{apiVersion:"string",tool:"{ id: string, title: string, description: string }",environment:"{ apiVersion, toolId, toolTitle, toolDescription, generatedAt }",profile:"normalized customer profile with fields, vars, tokenValues, photos and attachments",variables:"TemplateVars object with scalar aliases plus available, availableTokens, availableFields, byToken, byKey and byLabel discovery containers",values:"token values plus compatibility aliases",tokenValues:"original token-keyed values",tokens:"Array<{ token, label, key, inputType, value, internal, aliases }>",fields:"Array<{ label, value, source, token, key, section, aliases }>",fieldIndex:"normalized lookup object",client:"raw imported client payload or null",clientInfo:"visible client detail sections",clientSummary:"compact client bar fields",generatedAt:"ISO timestamp"},functions:{"TemplateTool.getContext()":"Promise<TemplateContext>","TemplateTool.getProfile()":"Promise<TemplateProfile>","TemplateTool.getVars()":"Promise<TemplateVars>","TemplateTool.getVar(name, fallback = '')":"Promise<string>","TemplateTool.hasVariable(name)":"Promise<boolean>","TemplateTool.listVariables()":"Promise<string[]>","TemplateTool.findField(candidates)":"Promise<Field|null>","TemplateTool.getFieldValue(candidates, fallback = '')":"Promise<string>","TemplateTool.templates.list()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.getTree()":"Promise<{ nodes, templates, counts }>","TemplateTool.templates.previewMigration(rules)":"Promise<{ operations, skipped, operationCount, affectedTemplateCount }>","TemplateTool.templates.applyMigration(operations)":"Promise<{ ok, appliedCount, skippedCount, tree }>","TemplateTool.templates.updateTemplate(templateId, patch)":"Promise<{ ok, template }>","TemplateTool.templates.moveTemplate(templateId, targetNodeId, options = {})":"Promise<{ ok, template }>","TemplateTool.fetchJson(url)":"Promise<{ ok, status, url, contentType, data?, text?, error?, truncated? }>","TemplateTool.fetchText(url)":"Promise<{ ok, status, url, contentType, text?, error?, truncated? }>","TemplateTool.copyText(text, message)":"Promise<{ ok: boolean }>","TemplateTool.copyHtml(html, message)":"Promise<{ ok: boolean }>","TemplateTool.toast(message, variant)":"Promise<{ ok: boolean }>","TemplateTool.openUrl(url)":"Promise<{ ok: boolean }>","TemplateTool.close()":"void","TemplateTool.requestResize()":"void","TemplateTool.onContext(callback)":"unsubscribe function","TemplateTool.describeApi()":"TemplateAPI reference"}});function Ir(e=ft){const t=[`${e.name} (${e.version})`,"","Globals:"];return Object.entries(e.globals||{}).forEach(([r,n])=>{t.push(`- window.${r}: ${n.description}`)}),t.push("","Variable access:",`- ${e.variables.access}`),e.variables.containers&&typeof e.variables.containers=="object"&&(t.push("","Variable containers:"),Object.entries(e.variables.containers).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)})),t.push("","Variable examples:"),(e.variables.examples||[]).forEach(r=>{t.push(`- ${r}`)}),t.push(`- Reserved TemplateVars containers: ${(e.variables.reservedContainers||[]).join(", ")}`),e.dataAccess&&typeof e.dataAccess=="object"&&(t.push("","Data access:"),Object.entries(e.dataAccess).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)})),t.push("","Context shape:"),Object.entries(e.contextShape||{}).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)}),t.push("","Functions:"),Object.entries(e.functions||{}).forEach(([r,n])=>{t.push(`- ${r}: ${n}`)}),t.join(`
`)}const Ar=`
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
</style>`,Sr=`
<script id="template-tool-bridge">
(function () {
    var apiVersion = "${te}";
    var apiReference = ${JSON.stringify(ft)};
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
<\/script>`,Er=`<!doctype html>
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
</html>`;function Nr(e=""){var l;const t=String(e||"").replace(/^\uFEFF/,"").trim();if(!t)return"";const r=t.match(/```(?:html)?\s*([\s\S]*?)```/i),n=((l=r==null?void 0:r[1])==null?void 0:l.trim())||t,o=n.match(/<!doctype\s+html\b|<html[\s>]/i);if(!o)return n;const i=o.index||0,a=n.slice(i).trim(),s=a.match(/<\/html\s*>/i);return s?a.slice(0,s.index+s[0].length).trim():a}function Cr(e=""){const t=Nr(e);return t?/<!doctype|<html[\s>]/i.test(t)?t:`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${t}
</body>
</html>`:Er}function _r(e,t,r){return e.includes(r)?e:/<\/head\s*>/i.test(e)?e.replace(/<\/head\s*>/i,`${t}</head>`):/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function Or(e,t,r){return e.includes(r)?e:/<head[\s>]/i.test(e)?e.replace(/<head([^>]*)>/i,`<head$1>${t}`):/<html[\s>]/i.test(e)?e.replace(/<html([^>]*)>/i,`<html$1>${t}`):`${t}${e}`}function co(e=""){const t=Cr(e),r=Or(t,Sr,"template-tool-bridge");return _r(r,Ar,"template-tool-host-style")}const qe=3e5;function Lr(e=""){const t=e.split(".").map(o=>Number(o));if(t.length!==4||t.some(o=>!Number.isInteger(o)||o<0||o>255))return!1;const[r,n]=t;return r===0||r===10||r===127||r===169&&n===254||r===172&&n>=16&&n<=31||r===192&&n===168}function Dr(e=""){try{const t=new URL(String(e||"").trim());if(!["http:","https:"].includes(t.protocol))return!1;const r=t.hostname.toLowerCase().replace(/^\[|\]$/g,"");return!(!r||r==="localhost"||r.endsWith(".localhost")||r.endsWith(".local")||r==="::1"||r==="0:0:0:0:0:0:0:1"||Lr(r))}catch{return!1}}async function uo({url:e="",responseType:t="json"}={}){const r=String(e||"").trim(),n=t==="json";if(!Dr(r))return{ok:!1,status:0,url:r,contentType:"",error:"Only public http/https URLs can be fetched by a module."};try{const o=await fetch(r,{method:"GET",credentials:"omit",cache:"no-store",redirect:"follow",headers:{Accept:n?"application/json, text/plain;q=0.8, */*;q=0.5":"text/plain, application/json;q=0.8, */*;q=0.5"}}),i=o.headers.get("content-type")||"",a=await o.text(),s=a.length>qe,l=s?a.slice(0,qe):a,u={ok:o.ok,status:o.status,url:o.url||r,contentType:i,truncated:s};if(!n)return{...u,text:l};try{return{...u,data:l?JSON.parse(l):null}}catch{return{...u,ok:!1,text:l,error:"The Internet response was not valid JSON."}}}catch(o){return{ok:!1,status:0,url:r,contentType:"",error:(o==null?void 0:o.message)||"Internet request failed."}}}function Vr(e=[],t={}){return Array.isArray(e)?e.filter(r=>r==null?void 0:r.token).map(r=>{const n=Object.prototype.hasOwnProperty.call(t,r.token)?t[r.token]:r.previewValue;return{token:r.token,label:r.label||r.token,key:r.key||"",inputType:r.input_type||r.inputType||"text",value:n??"",internal:!!r.internal,aliases:Array.isArray(r.searchAliases)?r.searchAliases.filter(Boolean):[]}}):[]}function N(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function me(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"")}function pt(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function bt(e=""){const t=pt(e);return t?t.replace(/_([a-z0-9])/g,(r,n)=>n.toUpperCase()):""}function U(e=""){const t=bt(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ce(e=""){return String(e||"").split(".").map(t=>t.trim()).filter(Boolean)}function H(e,t){const r=String(t||"").trim();!r||e.includes(r)||e.push(r)}function E(e,t){const r=String(t||"").trim();if(!r)return;H(e,r);const n=pt(r),o=bt(r);n&&(H(e,n),H(e,`{${n}}`)),o&&H(e,o)}function ht({label:e="",token:t="",key:r="",aliases:n=[],section:o=""}={}){const i=[];E(i,e),E(i,t),E(i,t.replace(/[{}]/g,"")),E(i,r);const a=Ce(r);return a.length>0&&(E(i,a[a.length-1]),E(i,a.join(" ")),E(i,a.join(""))),E(i,o),n.forEach(s=>E(i,s)),i}function Rr(e){const t=N(e.value);if(t==="")return null;const r={label:String(e.label||e.token||e.key||"Field"),value:t,source:e.source||"context"};return e.token&&(r.token=String(e.token)),e.key&&(r.key=String(e.key)),e.section&&(r.section=String(e.section)),r.aliases=ht({...e,...r}),r}function jr({tokens:e=[],clientInfo:t=[],clientSummary:r=[],profile:n=null}={}){const o=[],i=new Set,a=s=>{const l=Rr(s);if(!l)return;const u=`${l.source}:${l.label}:${l.value}:${l.token||""}:${l.key||""}`;i.has(u)||(i.add(u),o.push(l))};return e.forEach(s=>{a({label:s.label,value:s.value,token:s.token,key:s.key,aliases:s.aliases,source:"token"})}),r.forEach(s=>{a({label:s.label,value:s.value,section:"summary",source:"clientSummary"})}),t.forEach(s=>{((s==null?void 0:s.fields)||[]).forEach(l=>{a({label:l.label,value:l.value,section:s.title||s.id,source:"clientInfo"})})}),n&&typeof n=="object"&&(Array.isArray(n.availableFields)?n.availableFields:[]).forEach(s=>{a({label:s.label,value:s.value,key:s.key,aliases:s.aliases,source:"profile"})}),o}function Br(e,t,r){!t||r===""||Object.prototype.hasOwnProperty.call(e,t)||(e[t]=r)}function Fr(e,t,r){const n=Ce(t);if(n.length<2||r==="")return;let o=e;for(let a=0;a<n.length-1;a+=1){const s=n[a];if(!s||/^\d+$/.test(s)||(o[s]===void 0&&(o[s]={}),!o[s]||typeof o[s]!="object"||Array.isArray(o[s])))return;o=o[s]}const i=n[n.length-1];i&&!Object.prototype.hasOwnProperty.call(o,i)&&(o[i]=r)}function $r(e={},t=[]){const r={...e};return t.forEach(n=>{n.key&&Fr(r,n.key,n.value),n.aliases.forEach(o=>Br(r,o,n.value))}),gt(r,t),r}const Mr=Object.freeze([{name:"clientName",candidates:["clientName","client name","fullName","full name","name","client.name"]}]);function zr(e,t){const r=me(t);return!e||!r?!1:[e.label,e.token,e.key,...e.aliases||[]].some(n=>me(n)===r)}function Ur(e=[],t=[]){for(const r of t){const n=e.find(i=>zr(i,r)),o=N(n==null?void 0:n.value);if(o!=="")return o}return""}function gt(e,t=[]){Mr.forEach(({name:r,candidates:n})=>{if(Object.prototype.hasOwnProperty.call(e,r))return;const o=Ur(t,n);o!==""&&(e[r]=o)})}function Pr({tokens:e=[],fields:t=[],variables:r={}}={}){const n=[],o=new Set,i=a=>{const s=Array.isArray(a.names)?a.names.filter(Boolean):[],l=[a.token||"",a.key||"",a.label||"",a.source||"",s.join("|")].join(":");o.has(l)||(o.add(l),n.push({name:s[0]||a.token||a.key||a.label||"",names:s,token:a.token||"",key:a.key||"",label:a.label||"",value:N(a.value),source:a.source||"context",inputType:a.inputType||"",internal:!!a.internal}))};return e.forEach(a=>{const l=ht({label:a.label,token:a.token,key:a.key,aliases:a.aliases}).map(U).filter(Boolean);i({names:[...new Set(l)],token:a.token,key:a.key,label:a.label,value:a.value,source:"token",inputType:a.inputType,internal:a.internal})}),t.forEach(a=>{const l=[a.label,a.token,a.key,...a.aliases||[]].map(U).filter(Boolean);i({names:[...new Set(l)],token:a.token,key:a.key,label:a.label,value:a.value,source:a.source})}),Object.entries(r).forEach(([a,s])=>{!a||s===null||typeof s=="object"||i({names:[a],label:a,value:s,source:"variable"})}),n.sort((a,s)=>a.name.localeCompare(s.name))}function qr(e=[]){const t={};return e.forEach(r=>{[r.label,r.token,r.key,...r.aliases||[]].forEach(n=>{const o=me(n);!o||t[o]||(t[o]={label:r.label,value:r.value,source:r.source,token:r.token||"",key:r.key||"",section:r.section||""})})}),t}function Z(e,t,r){const n=U(t);!n||r===""||Object.prototype.hasOwnProperty.call(e,n)||(e[n]=r)}function Kr(e,t,r){const n=Ce(t).map(U).filter(Boolean);if(n.length<2||r==="")return;let o=e;for(let a=0;a<n.length-1;a+=1){const s=n[a];if(o[s]===void 0&&(o[s]={}),!o[s]||typeof o[s]!="object"||Array.isArray(o[s]))return;o=o[s]}const i=n[n.length-1];i&&!Object.prototype.hasOwnProperty.call(o,i)&&(o[i]=r)}function Jr(e,t=null){if(!t||typeof t!="object")return;const r=t.vars&&typeof t.vars=="object"?t.vars:t.variables&&typeof t.variables=="object"?t.variables:{};Object.entries(r).forEach(([n,o])=>{const i=N(o);i!==""&&Z(e,n,i)})}function Hr({fields:e=[],tokens:t=[],tokenValues:r={},environment:n={},profile:o=null}={}){const i={env:n,raw:r,byToken:{},byKey:{},byLabel:{},available:[],availableTokens:[],availableFields:[]};return t.forEach(a=>{a.token&&(i.byToken[a.token]=N(a.value))}),Object.entries(r||{}).forEach(([a,s])=>{const l=N(s);i.byToken[a]=l,l!==""&&(Z(i,a,l),Z(i,a.replace(/[{}]/g,""),l))}),Jr(i,o),e.forEach(a=>{const s=N(a.value);s!==""&&(a.token&&(i.byToken[a.token]=s),a.key&&(i.byKey[a.key]=s,Kr(i,a.key,s)),i.byLabel[a.label]=s,[a.label,a.token,a.key,...a.aliases||[]].forEach(l=>{Z(i,l,s)}))}),gt(i,e),i.available=Pr({tokens:t,fields:e,variables:i}),i.availableTokens=i.available.filter(a=>a.token),i.availableFields=e.map(a=>({name:U(a.key||a.token||a.label),token:a.token||"",key:a.key||"",label:a.label||"",value:a.value,source:a.source||"context",aliases:a.aliases||[]})),i}function mo({tool:e={},values:t={},tokens:r=[],client:n=null,clientInfo:o=[],clientSummary:i=[],profile:a=null}={}){const s=t&&typeof t=="object"?t:{},l=a&&typeof a=="object"?a:null,u=l!=null&&l.tokenValues&&typeof l.tokenValues=="object"?l.tokenValues:{},f={...s,...u},c=Array.isArray(o)?o:[],d=Array.isArray(i)?i:[],m=Vr(r,f),g=jr({tokens:m,clientInfo:c,clientSummary:d,profile:l}),b=new Date().toISOString(),p={apiVersion:te,toolId:e.id||"",toolTitle:e.title||"",toolDescription:e.description||"",generatedAt:b};return{apiVersion:te,tool:{id:e.id||"",title:e.title||"",description:e.description||""},profile:l||null,values:$r(f,g),tokenValues:f,tokens:m,fields:g,fieldIndex:qr(g),variables:Hr({fields:g,tokens:m,tokenValues:f,environment:p,profile:l}),environment:p,client:n&&typeof n=="object"?n:null,clientInfo:c,clientSummary:d,generatedAt:b}}function Xr(e=""){const t=String(e||"").trim(),r=t.match(/^```(?:json|text)?\s*([\s\S]*?)\s*```$/i);return r?r[1].trim():t}function fo(e=""){const t=Xr(e);if(!t)return"";try{const r=JSON.parse(t);return r&&typeof r=="object"&&!Array.isArray(r)&&typeof r.html=="string"&&r.html.trim()?r.html.trim():""}catch{return""}}function X(e=""){const t=N(e);return t?`value: ${t.slice(0,80)}${t.length>80?"…":""}`:"empty now"}function Yr(e={}){const t=Array.isArray(e.names)?e.names.filter(Boolean):[];return[...new Set([e.name,...t].filter(Boolean))].slice(0,8).join(", ")}function Gr(e=null){var l;if(!e||typeof e!="object")return"No live app context was loaded while copying this prompt. The module must discover variables at runtime with TemplateTool.getContext(), TemplateTool.getVars(), TemplateTool.listVariables(), context.tokens and context.fields.";const t=["Live variable inventory from the current app context:","Use these exact names/tokens/keys when they fit the request, and still keep runtime fallbacks because availability changes per customer."],r=e.profile&&typeof e.profile=="object"?e.profile:null,n=r!=null&&r.vars&&typeof r.vars=="object"?r.vars:{},o=Object.entries(n).filter(([,u])=>N(u)!=="").sort(([u],[f])=>u.localeCompare(f));o.length>0&&(t.push("","Profile variables (TemplateProfile / TemplateVars aliases):"),o.forEach(([u,f])=>{t.push(`- ${u} (${X(f)})`)}));const i=Array.isArray((l=e.variables)==null?void 0:l.available)?e.variables.available:[];i.length>0&&(t.push("","Discoverable TemplateVars.available entries:"),i.forEach(u=>{const f=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",`names: ${Yr(u)||"none"}`,`source ${u.source||"context"}`,X(u.value)].filter(Boolean);t.push(`- ${f.join("; ")}`)}));const a=Array.isArray(e.fields)?e.fields:[];a.length>0&&(t.push("","Resolved context.fields (preferred for visible customer data):"),a.forEach(u=>{const f=[u.label?`label ${u.label}`:"",u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.section?`section ${u.section}`:"",`source ${u.source||"context"}`,X(u.value)].filter(Boolean);t.push(`- ${f.join("; ")}`)}));const s=Array.isArray(e.tokens)?e.tokens:[];return s.length>0&&(t.push("","All configured context.tokens, including empty values:"),s.forEach(u=>{const f=[u.token?`token ${u.token}`:"",u.key?`key ${u.key}`:"",u.label?`label ${u.label}`:"",u.inputType?`type ${u.inputType}`:"",u.internal?"internal":"manual/configured",X(u.value)].filter(Boolean);t.push(`- ${f.join("; ")}`)})),o.length===0&&i.length===0&&a.length===0&&s.length===0&&t.push("- No variables are currently configured or populated in this context. Build a missing-data state and rely on runtime discovery."),t.join(`
`)}function po({title:e="",prompt:t="",runtimeContext:r=null}={}){const n=String(e||"").trim()||"Custom tool",o=String(t||"").trim()||"Create a useful workflow tool for my Template Generator app.";return`You are building a custom Beta module for a local app called Template Generator.
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
${Ir()}

Current variable inventory:
${Gr(r)}

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
${o}`}const _e="salt-templater-alo-autofill",Wr=1,Zr="https://wholesale.swisscom.com/wsg/prod/alo/fuf/web/alo-web/fulfillment/detail.do",Qr="https://wholesale.swisscom.com/wsg/prod/alo/ass/web/alo-web/assurance/create.do?clearModel=true";function bo(e=(r=>(r=(t=>(t=globalThis.window)==null?void 0:t.open)())==null?void 0:r.bind(globalThis.window))()){return typeof e!="function"?null:e(Qr,"_blank","noopener,noreferrer")}const Y=Object.freeze({problemDescription:"No signal",problemNotes:"",problemCode1:"400",problemCode2:"800",problemCode3:"900"});function S(e){return e==null?"":String(e).trim()}function k(e){for(const t of e){const r=S(t);if(r)return r}return""}function en(e){const t=S(e).replace(/\D/g,"");return t.startsWith("41")&&t.length===11?`0${t.slice(2)}`:t.startsWith("0041")&&t.length===13?`0${t.slice(4)}`:t.startsWith("0")&&t.length===10?t:S(e)}function R(e){const t=S(e);if(!t)return"";const r=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(r)return`${r[1]}-${r[2]}-${r[3]}`;const n=t.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(n)return`${n[3]}-${n[2]}-${n[1]}`;const o=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return o?`${o[3]}-${o[1].padStart(2,"0")}-${o[2].padStart(2,"0")}`:t}function _(e){const t=R(e),r=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return r?`${r[3]}.${r[2]}.${r[1]}`:t}function tn(e={}){var t,r,n,o,i,a,s;return k([(t=e==null?void 0:e.offer)==null?void 0:t.activationDate,(r=e==null?void 0:e.client)==null?void 0:r.activationDate,(n=e==null?void 0:e.client)==null?void 0:n.activation_date,(o=e==null?void 0:e.client)==null?void 0:o.activation,(i=e==null?void 0:e.client)==null?void 0:i.dateActivation,(a=e==null?void 0:e.contact)==null?void 0:a.activationDate,(s=e==null?void 0:e.healthcheck)==null?void 0:s.activationDate])}function rn(e={}){var t,r,n,o,i,a;return k([(t=e==null?void 0:e.contact)==null?void 0:t.providerOrderRef,(r=e==null?void 0:e.contact)==null?void 0:r.provider_order_ref,(n=e==null?void 0:e.client)==null?void 0:n.providerOrderRef,(o=e==null?void 0:e.client)==null?void 0:o.provider_order_ref,(i=e==null?void 0:e.healthcheck)==null?void 0:i.orderId,(a=e==null?void 0:e.healthcheck)==null?void 0:a.order_id,e==null?void 0:e.orderId,e==null?void 0:e.order_id])}function nn(e={}){var i;const t=k([e==null?void 0:e.firstPostAt,e==null?void 0:e.firstPostDate,e==null?void 0:e.firstMessageAt,e==null?void 0:e.firstMessageDate]);if(t)return t;const r=(Array.isArray(e==null?void 0:e.attachments)?e.attachments:[]).map(a=>{var l,u;const s=a==null?void 0:a.messageIndex;return{date:k([a==null?void 0:a.date,a==null?void 0:a.messageDate,a==null?void 0:a.messageDateTime,a==null?void 0:a.createdAt,(l=a==null?void 0:a.message)==null?void 0:l.date,(u=a==null?void 0:a.message)==null?void 0:u.createdAt]),messageIndex:s==null||s===""?null:Number(s)}}).filter(a=>a.date&&R(a.date)),n=r.filter(a=>Number.isInteger(a.messageIndex)),o=n.length>0?n:r;return o.sort((a,s)=>n.length>0&&a.messageIndex!==s.messageIndex?a.messageIndex-s.messageIndex:R(a.date).localeCompare(R(s.date))),((i=o[0])==null?void 0:i.date)||""}function on(e={}){const t=S(e.SignalStatus).toLowerCase();return t==="lost"?"lost":t==="never"?"never":""}function an(e={}){const t=e.aloType==="lowBadRxTx"?"lowBadRxTx":"noSignal",r=e.signalState==="never"?"never":"lost",n=t==="lowBadRxTx"?"Bad signal":"No signal",o=_(r==="never"?e.activationDate:e.disconnectionDate);return[n,r==="never"?"Never activated":"Signal lost",o].filter(Boolean).join(" - ")}function sn(e={}){const t=_(e.disconnectionDate),r=_(e.activationDate),n=e.signalState==="never"?r:t;return{[Ot]:n}}function ho(e,t,r){return!e||typeof r!="function"?null:r(e,sn(t))}function go(e={},t={}){var l,u,f;const r=k([t==null?void 0:t.externalTicketId,e==null?void 0:e.externalTicketId,e==null?void 0:e.externalId,(l=e==null?void 0:e.client)==null?void 0:l.externalTicketId,(u=e==null?void 0:e.client)==null?void 0:u.externalId,(f=e==null?void 0:e.superOffice)==null?void 0:f.externalTicketId]),n=re(r),o=n.ok?n.fields:{},i=on(o),a=R(tn(e)),s=R(nn(t));return{externalId:r,externalFields:o,aloType:"",signalState:i,disconnectionDate:s,activationDate:a,description:""}}function Tt(e={}){return{firstName:S(e.firstName),lastName:S(e.lastName),email:S(e.email),phoneNumber:k([e.phoneNumber,e.phone])}}function ln(e={}){const t=(e==null?void 0:e.tokenValues)||{};return{ticketId:k([e==null?void 0:e.sourceTicketId,e==null?void 0:e.ticketId,t[ne],e==null?void 0:e.soTicket,e==null?void 0:e.ticketNumber]),externalTicketId:S(e==null?void 0:e.externalTicketId),tokenValues:t}}function cn(e={},t={},r={},n={}){const o=(e==null?void 0:e.client)||{},i=(e==null?void 0:e.contact)||{},a=(e==null?void 0:e.healthcheck)||{},s=Tt(t),l=k([i.fixedNumber,i.voipNumber,i.voip,i.sip,o.fixedNumber,o.fixedPhone]),u=en(k([o.mobile,o.mobileRaw,o.phone,o.telephone,i.mobile,i.phone])),f=k([n.description,n.aloType==="lowBadRxTx"?"Bad signal":"",Y.problemDescription]),c=k([n.notes,n.signalState?an(n):"",Y.problemNotes]),d=n.signalState==="never"?_(n.activationDate):_(n.disconnectionDate);return{externalReference:S(n.extRef),socketId:k([a.otoId,a.oto_id,a.oto]),plugNr:k([a.otoPortId,a.otoPort,a.oto_port]),breakoutCable:k([a.breakoutCableId,a.breakoutCable,a.cable]),breakoutFiber:k([a.fiberNumber,a.fiber,a.fibre]),firstName:k([o.firstName,o.firstname,o.givenName]),lastName:k([o.lastName,o.lastname,o.surname,o.familyName]),contactPhone1:k([l,u]),contactPhone2:l&&u&&l!==u?u:"",contactEmail:k([o.email,o.mail,i.email,i.mail]),notificationType:"Email",preferredContactType:"Mobile",ispFirstName:s.firstName,ispLastName:s.lastName,ispPhone:s.phoneNumber,ispEmail:s.email,...Y,problemDescription:f,problemNotes:c,problemDateTime:d,problemCode3:n.aloType==="lowBadRxTx"?"Performance problem":Y.problemCode3}}function To(e={},t={},r={},n={}){const o=cn(e,t,r,n),i=Tt(t),a=ln(r);return{source:_e,version:Wr,fields:o,alo:{orderId:rn(e),type:n.aloType||"noSignal",signalState:n.signalState||"",disconnectionDate:_(n.disconnectionDate),activationDate:_(n.activationDate),problemDateTime:o.problemDateTime,notes:n.notes||""},client:{firstName:o.firstName,lastName:o.lastName,contactPhone1:o.contactPhone1,contactPhone2:o.contactPhone2,email:o.contactEmail},technical:{socketId:o.socketId,plugNr:o.plugNr,breakoutCable:o.breakoutCable,breakoutFiber:o.breakoutFiber},agent:i,superOffice:a}}function un(e){var o,i,a;if(!e||typeof e.querySelectorAll!="function")return"";const t=s=>String(s??"").replace(/\s+/g," ").trim(),r=Array.from(e.querySelectorAll(".tooltipCode")).find(s=>t(s==null?void 0:s.textContent)==="translationId=global.extRef"),n=t((a=(i=(o=r==null?void 0:r.closest)==null?void 0:o.call(r,"td"))==null?void 0:i.nextElementSibling)==null?void 0:a.textContent);return n&&n!=="-"?n:""}function yt(e,t){function r(c){return c==null?"":String(c).trim()}function n(c){for(var d=0;d<c.length;d+=1){var m=r(c[d]);if(m)return m}return""}function o(c){return r(c).replace(/[&<>"']/g,function(m){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}function i(c,d,m){var g=document.getElementById("saltAloFillOverlay");g&&g.remove();var b=document.createElement("div");b.id="saltAloFillOverlay",b.style.cssText="position:fixed;z-index:2147483647;right:18px;top:18px;max-width:360px;background:"+(m==="error"?"#7f1d1d":"#111827")+";color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 16px;font:13px Arial,sans-serif;line-height:1.35;box-shadow:0 16px 40px rgba(0,0,0,.35)",b.innerHTML="<strong style='display:block;margin-bottom:4px;font-size:14px'>"+o(c)+"</strong><span style='color:#d8d8df'>"+o(d)+"</span>",document.body.appendChild(b),m!=="error"&&setTimeout(function(){try{b.remove()}catch{}},4500)}function a(c,d,m){var g=c&&c.fields||{};return n([g[d]].concat(m||[]))}function s(c,d){var m=String(d).replace(/["\\]/g,"\\$&");return document.querySelector("["+c+'="'+m+'"]')}function l(c){return document.getElementById(c)||s("name",c)||s("formcontrolname",c)||s("data-testid",c)}function u(c,d,m){var g=m?String(d??""):r(d);if(!m&&!g)return!1;var b=l(c);if(!b)return!1;if(b.tagName==="SELECT")for(var p=r(g).toLowerCase(),A=0;A<b.options.length;A+=1){var w=b.options[A];if(r(w.value).toLowerCase()===p||r(w.textContent).toLowerCase()===p){b.value=w.value;break}}else"value"in b?b.value=g:b.textContent=g;return b.dispatchEvent(new Event("input",{bubbles:!0})),b.dispatchEvent(new Event("change",{bubbles:!0})),!0}function f(c){if(!c||typeof c!="object"||Array.isArray(c)){i("ALO fill","ALO fill data invalid.","error");return}if(c.source&&c.source!==e){i("ALO fill","Clipboard does not contain ALO fill data from Salt BO tools.","error");return}var d=c.client||{},m=c.technical||c.healthcheck||{},g=c.agent||{},b=0;function p(A,w,O){u(A,w,O)&&(b+=1)}if(p("ticket.extRef",a(c,"externalReference",[])),p("ticket.socketId",a(c,"socketId",[m.socketId,m.otoId,m.oto_id,m.oto])),p("ticket.plugNr",a(c,"plugNr",[m.plugNr,m.otoPortId,m.otoPort,m.oto_port])),p("ticket.breakoutCable",a(c,"breakoutCable",[m.breakoutCable,m.breakoutCableId,m.cable])),p("ticket.breakoutFiber",a(c,"breakoutFiber",[m.breakoutFiber,m.fiberNumber,m.fiber,m.fibre])),p("ticket.otoAddress.firstName",a(c,"firstName",[d.firstName,d.firstname,d.givenName])),p("ticket.otoAddress.lastName",a(c,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),p("ticket.contactPersonFirstName",a(c,"firstName",[d.firstName,d.firstname,d.givenName])),p("ticket.contactPersonLastName",a(c,"lastName",[d.lastName,d.lastname,d.surname,d.familyName])),p("ticket.contactPersonPhone1",a(c,"contactPhone1",[d.contactPhone1,d.fixedNumber,d.mobileRaw,d.mobile,d.phone])),p("ticket.contactPersonPhone2",a(c,"contactPhone2",[d.contactPhone2])),p("ticket.contactPersonMail",a(c,"contactEmail",[d.email,d.mail])),p("ticket.contactPersonNotificationsType",a(c,"notificationType",["Email"])),p("ticket.contactPersonPreferredContactType",a(c,"preferredContactType",["Mobile"])),p("ticket.contactPersonIspFirstName",a(c,"ispFirstName",[g.firstName])),p("ticket.contactPersonIspLastName",a(c,"ispLastName",[g.lastName])),p("ticket.contactPersonIspPhone",a(c,"ispPhone",[g.phoneNumber,g.phone])),p("ticket.contactPersonIspMail",a(c,"ispEmail",[g.email])),p("ticket.problemDescription",a(c,"problemDescription",["No signal"])),p("ticket.problemNotes",a(c,"problemNotes",[""]),!0),p("ticket.problemDateTime",a(c,"problemDateTime",[c.alo&&c.alo.problemDateTime])),p("ticket.problemCode1",a(c,"problemCode1",["400"])),p("ticket.problemCode2",a(c,"problemCode2",["800"])),p("ticket.problemCode3",a(c,"problemCode3",["900"])),!b){i("ALO fill","No ALO form fields were found on this page. Open the ALO ticket form, then click the shortcut again.","error");return}i("ALO fill","Fields populated: "+b,"success")}if(t){f(t);return}if(i("ALO fill","Reading copied ALO data...","info"),!navigator.clipboard||!navigator.clipboard.readText){i("ALO fill","Clipboard API not available on this page.","error");return}navigator.clipboard.readText().then(function(d){if(!r(d)){i("ALO fill","Clipboard empty. Click ALO fill in Salt BO tools first.","error");return}var m;try{m=JSON.parse(d)}catch{i("ALO fill","Clipboard does not contain valid ALO data.","error");return}f(m)}).catch(function(d){i("ALO fill","Clipboard error: "+(d&&d.message?d.message:d),"error")})}function dn(e,t,r,n){function o(c){return c==null?"":String(c).trim()}function i(c){for(var d=0;d<c.length;d+=1){var m=o(c[d]);if(m)return m}return""}function a(c,d,m,g){var b=document.getElementById("saltAloBetaOverlay");b||(b=document.createElement("div"),b.id="saltAloBetaOverlay",b.style.cssText="position:fixed;z-index:2147483647;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(3px);color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:left",b.innerHTML="<div id='saltAloBetaCard' style='position:relative;width:420px;max-width:calc(100vw - 40px);background:rgba(24,24,28,.97);border:1px solid rgba(255,255,255,.12);border-radius:18px;box-shadow:0 22px 60px rgba(0,0,0,.45);padding:24px 26px'><button id='saltAloBetaClose' type='button' aria-label='Close' style='display:none;position:absolute;right:14px;top:12px;border:0;background:transparent;color:#fff;font-size:24px;line-height:1;cursor:pointer'>&times;</button><div style='display:flex;align-items:center;gap:12px;margin-bottom:16px'><div id='saltAloBetaDot' style='width:14px;height:14px;border-radius:50%;background:#21a36a;box-shadow:0 0 18px #21a36a'></div><div id='saltAloBetaTitle' style='font-size:18px;font-weight:700'></div></div><div id='saltAloBetaDetail' style='font-size:14px;line-height:1.5;color:#d8d8df;white-space:pre-line'></div><div style='margin-top:20px;height:5px;background:rgba(255,255,255,.14);border-radius:999px;overflow:hidden'><div id='saltAloBetaBar' style='width:8%;height:100%;background:linear-gradient(90deg,#21a36a,#65d6a0);border-radius:999px;transition:width .25s ease'></div></div></div>",(document.body||document.documentElement).appendChild(b),b.querySelector("#saltAloBetaClose").onclick=function(){b.remove()});var p=g==="error",A=b.querySelector("#saltAloBetaCard"),w=b.querySelector("#saltAloBetaDot"),O=b.querySelector("#saltAloBetaBar");b.querySelector("#saltAloBetaTitle").textContent=c||"ALO beta",b.querySelector("#saltAloBetaDetail").textContent=d||"",b.querySelector("#saltAloBetaClose").style.display=p?"block":"none",A.style.borderColor=p?"rgba(248,113,113,.55)":"rgba(255,255,255,.12)",w.style.background=p?"#ef4444":"#21a36a",w.style.boxShadow=p?"0 0 18px #ef4444":"0 0 18px #21a36a",O.style.width=Math.max(4,Math.min(100,m||0))+"%",O.style.background=p?"linear-gradient(90deg,#ef4444,#fb7185)":"linear-gradient(90deg,#21a36a,#65d6a0)"}function s(){var c=document.getElementById("saltAloBetaOverlay");c&&c.remove()}function l(c){a("ALO beta — impossible de continuer",c,100,"error")}function u(c,d,m){c.fields=Object.assign({},c.fields||{},{externalReference:d||""}),a("ALO beta",m,92,"info"),s(),r(e,c)}a("ALO beta","Lecture des données préparées…",8,"info");var f;try{f=new URL(t)}catch{l("L’adresse Fulfillment configurée est invalide.");return}if(location.origin!==f.origin){l("Lance ce bookmarklet depuis le site ALO Wholesale.");return}if(!navigator.clipboard||!navigator.clipboard.readText){l("Le presse-papiers n’est pas accessible sur cette page.");return}navigator.clipboard.readText().then(function(d){if(!o(d))throw new Error("Le presse-papiers est vide. Prépare d’abord le ticket depuis Salt BO tools.");var m;try{m=JSON.parse(d)}catch{throw new Error("Le presse-papiers ne contient pas de données ALO valides.")}if(!m||typeof m!="object"||Array.isArray(m))throw new Error("Les données ALO préparées sont invalides.");if(m.source&&m.source!==e)throw new Error("Le presse-papiers ne contient pas les données ALO préparées par Salt BO tools.");var g=i([m.alo&&m.alo.orderId,m.orderId,m.contact&&m.contact.providerOrderRef,m.client&&m.client.providerOrderRef,m.fields&&m.fields.providerOrderRef]);if(!g){u(m,"",`Order ID indisponible. External Ref laissée vide.
Remplissage du ticket…`);return}return a("ALO beta","Order ID détecté : "+g+`
Chargement de la commande Fulfillment…`,38,"info"),f.searchParams.set("orderId",g),fetch(f.href,{credentials:"include",cache:"no-store",redirect:"follow"}).then(function(p){return p.ok?p.text():""}).then(function(p){a("ALO beta",`Commande chargée.
Recherche de l’External Ref…`,70,"info");var A=p?new DOMParser().parseFromString(p,"text/html"):null,w=n(A);u(m,w,w?"External Ref trouvée : "+w+`
Remplissage du ticket…`:`External Ref indisponible. Champ laissé vide.
Remplissage du ticket…`)}).catch(function(){u(m,"",`External Ref indisponible. Champ laissé vide.
Remplissage du ticket…`)})}).catch(function(d){l(d&&d.message?d.message:String(d))})}function yo(){const e=JSON.stringify(_e);return`javascript:(${yt.toString()})(${e});`}function ko(){const e=JSON.stringify(_e),t=JSON.stringify(Zr);return`javascript:(${dn.toString()})(${e},${t},(${yt.toString()}),(${un.toString()}));`}const kt="salt-templater-alex-ticket",mn=1,fn="https://www.ftthproxy.ch/",pn=1,bn="L1";function hn(e){return String(e??"").trim()}function gn(e){return String(e??"").replace(/[^0-9]+/g,"")}function Tn(e){var t,r;return hn(((t=e==null?void 0:e.contact)==null?void 0:t.eligibilityOrdering)??((r=e==null?void 0:e.client)==null?void 0:r.eligibilityOrdering)??(e==null?void 0:e.eligibilityOrdering))}function vo(e,t){const r=Tn(e),n=gn(t);return/^\d+$/.test(r)?r==="0"?{ok:!1,error:"ALO_PARTNER"}:n?{ok:!0,payload:{source:kt,version:mn,action:"view-ticket",alap:r,serviceDomain:pn,businessDomain:bn,ticket:n}}:{ok:!1,error:"MISSING_TICKET"}:{ok:!1,error:"MISSING_PARTNER_ID"}}function wo(e){return JSON.stringify(e,null,2)}function xo(e){return e==="ALO_PARTNER"?"ALO tickets must be opened with the ALO flow":e==="MISSING_TICKET"?"Add the partner ticket number to the External ID first":"No ALEX partner identifier found in the active VTI customer"}function Io(e=(r=>(r=(t=>(t=globalThis.window)==null?void 0:t.open)())==null?void 0:r.bind(globalThis.window))()){return typeof e!="function"?null:e(fn,"_blank","noopener,noreferrer")}function yn(e){function t(r){alert("Ticket ALEX: "+r)}if(!/(^|\.)ftthproxy\.ch$/i.test(location.hostname)){t("launch this bookmarklet from ftthproxy.ch.");return}if(!navigator.clipboard||!navigator.clipboard.readText){t("clipboard access is not available on this page.");return}navigator.clipboard.readText().then(function(n){var o;try{o=JSON.parse(n)}catch{throw new Error("the clipboard does not contain valid JSON.")}if(!o||o.source!==e||o.action!=="view-ticket")throw new Error("the clipboard does not contain Ticket ALEX data from Salt BO tools.");var i=String(o.alap||"").trim(),a=String(o.ticket||"").replace(/[^0-9]+/g,""),s=Number(o.serviceDomain),l=String(o.businessDomain||"").trim();if(!/^\d+$/.test(i)||i==="0")throw new Error("the ALEX partner identifier is invalid.");if(!a)throw new Error("the ALEX ticket number is missing.");if(!Number.isFinite(s)||!l)throw new Error("the ALEX partner context is incomplete.");localStorage.setItem("focus",JSON.stringify({alap:i,serviceDomain:s,businessDomain:l}));var u="/assurance/ticket/"+a,f=location.origin+"/?saltAlexRefresh="+Date.now()+"#"+u;setTimeout(function(){location.replace(f)},300)}).catch(function(n){t(n&&n.message?n.message:String(n))})}function Ao(){const e=JSON.stringify(kt);return`javascript:(${yn.toString()})(${e});`}const kn=Object.freeze([{id:"captureData",label:"Capture data",key:"q",code:"KeyQ",altKey:!0},{id:"clearData",label:"Clear imported data",key:"e",code:"KeyE",altKey:!0}]),vn=["input","textarea","select","[contenteditable='true']","[contenteditable='']","[role='textbox']"].join(",");function G(e,t){return!!(e!=null&&e[t])}function wn(e,t){return String(e||"").toLowerCase()===String(t||"").toLowerCase()}function vt(e,t){return!!t&&String(e||"").toLowerCase()===String(t||"").toLowerCase()}function xn(e,t){return G(e,"ctrlKey")===!!t.ctrlKey&&G(e,"altKey")===!!t.altKey&&G(e,"shiftKey")===!!t.shiftKey&&G(e,"metaKey")===!!t.metaKey}function In(e,t){return xn(e,t)&&(wn(e==null?void 0:e.key,t.key)||vt(e==null?void 0:e.code,t.code))}function So(e){return e?[e.ctrlKey?"Ctrl":"",e.altKey?"Alt":"",e.shiftKey?"Shift":"",e.metaKey?"Meta":"",e.key].filter(Boolean).join("+"):""}function An(e){return!e||e===(typeof document>"u"?null:document)||e===(typeof window>"u"?null:window)?!1:!!(typeof e.closest=="function"&&e.closest(vn))}function Sn(e){return!!(e!=null&&e.defaultPrevented||e!=null&&e.repeat||An(e==null?void 0:e.target))}function Eo(e){if(Sn(e))return null;const t=kn.find(r=>In(e,r))||null;return!t||e!=null&&e.isComposing&&!vt(e==null?void 0:e.code,t.code)?null:t}const En="case-profile-beta-1",wt=Object.freeze([["clientName","Client name"],["title","Title"],["firstName","First name"],["lastName","Last name"],["contractorNumber","Contractor"],["mobile","Mobile"],["mobileRaw","Mobile raw"],["phone","Phone"],["email","Email"],["address","Address"],["communicationLanguage","Language"],["activationDate","Activation date"],["eligibilitySource","Eligibility"],["contactRecordId","Contact record"],["fixedNumber","Fixed number"],["publicId","Public ID"],["providerOrderRef","Provider order ref"],["fllRecordId","FLL record"],["otoId","OTO ID"],["otoPortId","OTO port"],["routerSerialNumber","Router serial"],["oldRouterSerialNumber","Old router serial"],["lexId","LEX ID"],["oltName","OLT"],["oltBoard","OLT board"],["ponPort","PON port"],["breakoutCableId","Breakout cable"],["fiberNumber","Fiber number"],["lineState","Line state"],["routerStatus","Router status"],["odfId","ODF ID"],["option82","Option 82"],["oltObject","OLT object"],["ontConfigurationFilename","ONT config"],["svlan","SVLAN"],["customerId","Customer ID"],["crossConnectionEquipment","Cross connection equipment"],["crossConnectionRack","Cross connection rack"],["crossConnectionSlot","Cross connection slot"],["crossConnectionPort","Cross connection port"],["externalId","External ID"],["externalFlagging","External ID flagging"],["externalDate","External ID date"],["externalCustomer","External ID customer"],["soTicketNum","SO ticket number"],["externalSignalStatus","External ID signal status"],["externalLedStatus","External ID LED status"],["externalTreatmentStep","External ID treatment step"],["externalBoxType","External ID box type"],["externalPartner","External ID partner"],["externalPartnerTicketNumber","External ID partner ticket number"],["externalLexId","External ID LEX ID"],["externalOltName","External ID OLT"],["externalOltBoard","External ID OLT board"],["externalBokBof","External ID BOK/BOF"],["externalComment","External ID comment"],["ticketCreatedAt","Ticket created at"]]),Oe=Object.freeze(Object.fromEntries(wt)),xt=Object.freeze(wt.map(([e])=>e)),Nn=Object.freeze({flagging:"externalFlagging",data:"externalDate",customer:"externalCustomer",soTicket:"soTicketNum",SignalStatus:"externalSignalStatus",LedStatus:"externalLedStatus",treatmentStep:"externalTreatmentStep",boxType:"externalBoxType",partner:"externalPartner",partnerTicketNumber:"externalPartnerTicketNumber",lexId:"externalLexId",oltName:"externalOltName",oltBoard:"externalOltBoard",bokBof:"externalBokBof",comment:"externalComment"}),fe=Object.freeze({client_name:"clientName",customer_name:"clientName",full_name:"clientName",name:"clientName",title:"title",client_title:"title",first_name:"firstName",client_first_name:"firstName",last_name:"lastName",client_last_name:"lastName",contractor:"contractorNumber",contractor_number:"contractorNumber",client_contractor_number:"contractorNumber",customer_id:"customerId",healthcheck_customer_id:"customerId",mobile:"mobile",client_mobile:"mobile",mobile_raw:"mobileRaw",client_mobile_raw:"mobileRaw",phone:"phone",telephone:"phone",email:"email",client_email:"email",address:"address",client_address:"address",language:"communicationLanguage",client_communication_language:"communicationLanguage",activation_date:"activationDate",client_activation_date:"activationDate",offer_activation_date:"activationDate",oto_id:"otoId",healthcheck_oto_id:"otoId",oto_port_id:"otoPortId",healthcheck_oto_port_id:"otoPortId",router_serial_number:"routerSerialNumber",healthcheck_router_serial_number:"routerSerialNumber",old_router_serial_number:"oldRouterSerialNumber",healthcheck_old_router_serial_number:"oldRouterSerialNumber",lex_id:"lexId",healthcheck_lex_id:"lexId",olt_name:"oltName",healthcheck_olt_name:"oltName",olt_board:"oltBoard",healthcheck_olt_board:"oltBoard",pon_port:"ponPort",breakout_cable_id:"breakoutCableId",fiber_number:"fiberNumber",line_state:"lineState",router_status:"routerStatus",so_ticket_num:"soTicketNum",ticket_num:"soTicketNum",external_flagging:"externalFlagging",external_date:"externalDate",external_customer:"externalCustomer",external_signal_status:"externalSignalStatus",external_led_status:"externalLedStatus",external_treatment_step:"externalTreatmentStep",external_box_type:"externalBoxType",external_partner:"externalPartner",external_partner_ticket_number:"externalPartnerTicketNumber",external_lex_id:"externalLexId",external_olt_name:"externalOltName",external_olt_board:"externalOltBoard",external_bok_bof:"externalBokBof",external_comment:"externalComment"}),It=new Set(["attachments","availableFields","dynamic","fieldLabels","fields","photos","tokenValues","variables","vars","version"]);function v(e){return e==null?"":typeof e=="string"?e.trim():typeof e=="number"||typeof e=="boolean"?String(e):""}function x(...e){for(const t of e){const r=v(t);if(r!=="")return r}return""}function B(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Cn(e=""){const t=B(e);return t?t.replace(/_([a-z0-9])/g,(r,n)=>n.toUpperCase()):""}function Le(e=""){const t=Cn(e);return t?/^[A-Za-z_$]/.test(t)?t:`field${t.charAt(0).toUpperCase()}${t.slice(1)}`:""}function Ke(e=""){const t=B(e);return t?`{${t}}`:""}function F(e=""){return String(e||"").replace(/[{}]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/^./,t=>t.toUpperCase())}function _n(){const e={};return xt.forEach(t=>{e[t]=""}),{version:En,fields:e,fieldLabels:{...Oe},dynamic:{},vars:{},variables:{},tokenValues:{},availableFields:[],attachments:[],photos:[]}}function At(e){return v(e)!==""}function I(e,t,r,{overwrite:n=!1}={}){if(!t||!Object.prototype.hasOwnProperty.call(e.fields,t))return!1;const o=v(r);return o===""||!n&&At(e.fields[t])?!1:(e.fields[t]=o,e[t]=o,!0)}function De(e,t,r,{overwrite:n=!1,label:o=""}={}){const i=Le(t),a=v(r);return!i||a===""||It.has(i)||!n&&Object.prototype.hasOwnProperty.call(e.dynamic,i)?!1:(e.dynamic[i]=a,o&&!e.fieldLabels[i]&&(e.fieldLabels[i]=o),!0)}function On(e,t,r,n={}){const o=B(oe(t)||t),i=fe[o]||fe[B(t)]||Le(t);return Object.prototype.hasOwnProperty.call(e.fields,i)?I(e,i,r,n):De(e,t,r,n)}function Ln(e,t={},r={}){Object.entries(t).forEach(([n,o])=>I(e,n,o,r))}function pe(e,t=[],r=[]){return Array.isArray(e)?(e.forEach((n,o)=>{t.push(String(o+1)),pe(n,t,r),t.pop()}),r):e&&typeof e=="object"?(Object.keys(e).forEach(n=>{t.push(n),pe(e[n],t,r),t.pop()}),r):(r.push({path:t.slice(),value:v(e)}),r)}function Dn(e=[]){return e[0]===ye||e[0]===ke}function St(e,t,{prefix:r="",skipInternalClientKeys:n=!1}={}){!t||typeof t!="object"||pe(t).filter(o=>o.value!=="").filter(o=>!n||!Dn(o.path)).forEach(o=>{const i=r?[r,...o.path]:o.path;De(e,i.join("_"),o.value,{label:i.map(F).join(" ")})})}function Je(e=[],t=[]){const r=new Map;return[...e,...t].forEach(n=>{if(!n||typeof n!="object")return;const o=`${v(n.url)}|${v(n.name)}|${v(n.id)}`;o.replace(/\|/g,"")&&(r.has(o)||r.set(o,n))}),Array.from(r.values())}function Ve(e){const t=v(e);if(!t)return null;const r=re(t);return r.ok?{externalId:t,fields:r.fields}:null}function Et(e,t){var r,n,o,i;t&&(I(e,"externalId",t.externalId),Object.entries(Nn).forEach(([a,s])=>{var l;I(e,s,(l=t.fields)==null?void 0:l[a])}),I(e,"contractorNumber",(r=t.fields)==null?void 0:r.customer),I(e,"lexId",(n=t.fields)==null?void 0:n.lexId),I(e,"oltName",(o=t.fields)==null?void 0:o.oltName),I(e,"oltBoard",(i=t.fields)==null?void 0:i.oltBoard))}function Vn(e,t){var s;if(!t||typeof t!="object")return;const r=t.client||{},n=t.contact||{},o=t.healthcheck||{},i=o.crossConnexion||o.crossConnection||{},a=[r.firstName,r.lastName].map(v).filter(Boolean).join(" ");Ln(e,{clientName:a||x(r.fullName,r.name,r.customerName),title:r.title,firstName:r.firstName,lastName:r.lastName,contractorNumber:x(r.contractorNumber,r.contractor,o.customerId),mobile:x(r.mobile,r.phone,r.telephone),mobileRaw:r.mobileRaw,phone:x(r.phone,r.telephone,n.fixedNumber),email:r.email,address:r.address,communicationLanguage:x(r.communicationLanguage,n.communicationLanguage,r.language,n.language),activationDate:x(r.activationDate,r.activation_date,r.activation,r.dateActivation,(s=t.offer)==null?void 0:s.activationDate,n.activationDate,o.activationDate),eligibilitySource:x(r.eligibilitySource,n.eligibilitySource),contactRecordId:x(r.contactRecordId,n.contactRecordId),fixedNumber:n.fixedNumber,publicId:n.publicId,providerOrderRef:n.providerOrderRef,fllRecordId:o.fllRecordId,otoId:x(o.otoId,o.oto_id,o.oto),otoPortId:x(o.otoPortId,o.otoPort,o.oto_port,i.Port),routerSerialNumber:o.routerSerialNumber,oldRouterSerialNumber:o.oldRouterSerialNumber,lexId:o.lexId,oltName:o.oltName,oltBoard:o.oltBoard,ponPort:o.ponPort,breakoutCableId:o.breakoutCableId,fiberNumber:o.fiberNumber,lineState:o.lineState,routerStatus:o.routerStatus,odfId:o.odfId,option82:o.option82,oltObject:o.oltObject,ontConfigurationFilename:o.ontConfigurationFilename,svlan:o.svlan,customerId:o.customerId,crossConnectionEquipment:i.Equipment,crossConnectionRack:i.Rack,crossConnectionSlot:i.Slot,crossConnectionPort:i.Port}),Et(e,Ve(t[ke])),St(e,t,{skipInternalClientKeys:!0})}function Rn(e,t){var o;if(!t||typeof t!="object")return;I(e,"soTicketNum",x(t.ticketId,t.sourceTicketId,t.soTicket,t.soTicketNumber,t.ticketNumber,(o=t.tokenValues)==null?void 0:o[ne])),I(e,"ticketCreatedAt",x(t.createdAt,t.created,t.createdDate,t.ticketCreatedAt,t.ticketCreatedDate)),Et(e,Ve(t.externalTicketId)),Nt(e,t.tokenValues);const r=K(t.attachments),n=xe(r);e.attachments=Je(e.attachments,r),e.photos=Je(e.photos,n),St(e,t,{prefix:"ticket"})}function Nt(e,t={},r={}){!t||typeof t!="object"||Object.entries(t).forEach(([n,o])=>{const i=v(o);if(i==="")return;const a=oe(n),s=Lt(a)||B(n),l=fe[s];l&&I(e,l,i,r),s==="external_customer"&&I(e,"contractorNumber",i,r),s==="external_lex_id"&&I(e,"lexId",i,r),s==="external_olt_name"&&I(e,"oltName",i,r),s==="external_olt_board"&&I(e,"oltBoard",i,r),De(e,s,i,{...r,label:F(s)})})}function jn(e,t){const r=t==null?void 0:t[ye];!r||typeof r!="object"||Array.isArray(r)||Object.entries(r).forEach(([n,o])=>{On(e,n,o,{overwrite:!0,label:F(n)})})}function He(e,t,r){const n=Le(t),o=v(r);!n||o===""||It.has(n)||Object.prototype.hasOwnProperty.call(e,n)||(e[n]=o)}function Bn(e,t={}){const r={},n={},o=[];xt.forEach(s=>{const l=v(e.fields[s]);if(l==="")return;He(r,s,l);const u=Ke(s);u&&(n[u]=l),o.push({key:s,label:Oe[s]||F(s),value:l})}),Object.entries(e.dynamic).forEach(([s,l])=>{const u=v(l);if(u==="")return;He(r,s,u);const f=Ke(s);f&&!Object.prototype.hasOwnProperty.call(n,f)&&(n[f]=u),e.fields[s]||o.push({key:s,label:e.fieldLabels[s]||F(s),value:u})});const i=Ve(e.externalId);i&&Object.assign(n,he(i.fields)),At(e.soTicketNum)&&(n[ne]=e.soTicketNum);const a={};return Object.entries(t||{}).forEach(([s,l])=>{const u=oe(s)||s;a[u]=l}),e.vars=r,e.variables=r,e.tokenValues={...a,...n},e.availableFields=o,e}function No({clientPayload:e=null,superOfficePayload:t=null,tokenValues:r={}}={}){const n=_n();return Vn(n,e),Rn(n,t),Nt(n,r),jn(n,e),Bn(n,r)}function h(e,t,r=""){var o;const n=v((e==null?void 0:e[t])??((o=e==null?void 0:e.fields)==null?void 0:o[t]));return n?{label:r||Oe[t]||F(t),value:n}:null}function L(e,t){const r=v(t);return r?{label:e,value:r}:null}function Ct(e=[]){const t=new Set;return e.filter(Boolean).filter(r=>{const n=`${B(r.label)}:${r.value}`;return t.has(n)?!1:(t.add(n),!0)})}function W(e,t,r=[]){const n=Ct(r);return n.length>0?{id:e,title:t,fields:n}:null}function Co(e=null){return!e||typeof e!="object"?[]:Ct([L("Name",e.clientName),L("Mobile",x(e.mobile,e.mobileRaw,e.phone)),L("Contractor",x(e.contractorNumber,e.externalCustomer,e.customerId)),L("Activation",e.activationDate),L("OTO ID",e.otoId),L("Port",x(e.otoPortId,e.crossConnectionPort)),L("SO ticket",e.soTicketNum)])}function _o(e=null){return!e||typeof e!="object"?[]:[W("caseClient","Client",[h(e,"clientName","Full name"),h(e,"contractorNumber","Contractor"),h(e,"title"),h(e,"firstName"),h(e,"lastName"),h(e,"mobile"),h(e,"mobileRaw","Mobile raw"),h(e,"phone"),h(e,"email"),h(e,"address"),h(e,"communicationLanguage","Language"),h(e,"activationDate","Activation date")]),W("caseSuperOffice","SuperOffice",[h(e,"soTicketNum","SO ticket"),h(e,"ticketCreatedAt","Created at"),h(e,"externalId","External ID"),h(e,"externalPartner","Partner"),h(e,"externalPartnerTicketNumber","Partner ticket")]),W("caseExternalId","External ID fields",[h(e,"externalFlagging","Flagging"),h(e,"externalDate","Date"),h(e,"externalCustomer","Contractor"),h(e,"externalSignalStatus","Signal"),h(e,"externalLedStatus","LED"),h(e,"externalTreatmentStep","Treatment"),h(e,"externalBoxType","Box"),h(e,"externalLexId","LEX ID"),h(e,"externalOltName","OLT"),h(e,"externalOltBoard","Board"),h(e,"externalBokBof","BOK/BOF"),h(e,"externalComment","Comment")]),W("caseTechnical","Technical",[h(e,"fllRecordId","FLL record"),h(e,"otoId","OTO ID"),h(e,"otoPortId","OTO port"),h(e,"routerSerialNumber","Router serial"),h(e,"oldRouterSerialNumber","Old router serial"),h(e,"lexId","LEX ID"),h(e,"oltName","OLT"),h(e,"oltBoard","OLT board"),h(e,"ponPort","PON port"),h(e,"breakoutCableId","Breakout cable"),h(e,"fiberNumber","Fiber number"),h(e,"lineState","Line state"),h(e,"routerStatus","Router status"),h(e,"crossConnectionPort","Cross connection port")])].filter(Boolean)}export{xo as A,Kn as B,Pn as C,Zn as D,wo as E,Io as F,To as G,Wn as H,bo as I,no as J,Eo as K,Un as L,ho as M,Ao as N,yo as O,qn as P,ko as Q,Xn as R,lr as S,kn as T,So as U,po as V,fo as W,Ie as X,Jn as Y,y as a,it as b,so as c,Ae as d,Gn as e,io as f,V as g,eo as h,Qn as i,oo as j,ro as k,ao as l,co as m,mo as n,lo as o,Hn as p,uo as q,Yn as r,tt as s,No as t,_o as u,Co as v,vo as w,mr as x,to as y,go as z};
