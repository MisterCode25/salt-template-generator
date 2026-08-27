import{r}from"./index-DDbfla8-.js";import{O as C,V as m}from"./tokenService-C_nL4Tgc.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=(...t)=>t.filter((e,o,n)=>!!e&&e.trim()!==""&&n.indexOf(e)===o).join(" ").trim();/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,o,n)=>n?n.toUpperCase():o.toLowerCase());/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=t=>{const e=v(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},b=r.createContext({}),S=()=>r.useContext(b),W=r.forwardRef(({color:t,size:e,strokeWidth:o,absoluteStrokeWidth:n,className:s="",children:a,iconNode:h,...u},k)=>{const{size:c=24,strokeWidth:d=2,absoluteStrokeWidth:x=!1,color:N="currentColor",className:E=""}=S()??{},L=n??x?Number(o??d)*24/Number(e??c):o??d;return r.createElement("svg",{ref:k,...i,width:e??c??i.width,height:e??c??i.height,stroke:t??N,strokeWidth:L,className:p("lucide",E,s),...!a&&!O(u)&&{"aria-hidden":"true"},...u},[...h.map(([A,y])=>r.createElement(A,y)),...Array.isArray(a)?a:[a]])});/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=(t,e)=>{const o=r.forwardRef(({className:n,...s},a)=>r.createElement(W,{ref:a,iconNode:e,className:p(`lucide-${_(f(t))}`,`lucide-${t}`,n),...s}));return o.displayName=f(t),o},w="configName",g="config_locked",l="No configuration",I="config-lock-updated";async function D(){const t=await C(w,l);return typeof t=="string"&&t.trim()?t:l}async function G(t){const e=typeof t=="string"&&t.trim()?t.trim():l;return await m(w,e),e}async function U(){return!!await C(g,!1)}async function $(t){const e=!!t;return await m(g,e),typeof window<"u"&&window.dispatchEvent(new CustomEvent(I,{detail:{locked:e}})),e}export{I as C,U as a,$ as b,B as c,D as l,G as s};
