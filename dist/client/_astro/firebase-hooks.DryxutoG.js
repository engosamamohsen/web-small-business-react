import{b as Si}from"./tslib.es6.OVu8nUpd.js";import{$ as mi}from"./index.DJ8_E5ld.js";import{a as Ws}from"./js.cookie.Cz0CWeBA.js";import{y as Te}from"./_astro-entry_react-toastify.CWO7AusI.js";import{u as Ca}from"./navigation.C6XGOaB_.js";import{r as Pa}from"./index.DeO6U63H.js";const Oa=()=>{};var qr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zs=function(i){const e=[];let t=0;for(let r=0;r<i.length;r++){let o=i.charCodeAt(r);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&r+1<i.length&&(i.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++r)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},Na=function(i){const e=[];let t=0,r=0;for(;t<i.length;){const o=i[t++];if(o<128)e[r++]=String.fromCharCode(o);else if(o>191&&o<224){const c=i[t++];e[r++]=String.fromCharCode((o&31)<<6|c&63)}else if(o>239&&o<365){const c=i[t++],l=i[t++],f=i[t++],g=((o&7)<<18|(c&63)<<12|(l&63)<<6|f&63)-65536;e[r++]=String.fromCharCode(55296+(g>>10)),e[r++]=String.fromCharCode(56320+(g&1023))}else{const c=i[t++],l=i[t++];e[r++]=String.fromCharCode((o&15)<<12|(c&63)<<6|l&63)}}return e.join("")},Gs={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<i.length;o+=3){const c=i[o],l=o+1<i.length,f=l?i[o+1]:0,g=o+2<i.length,E=g?i[o+2]:0,b=c>>2,S=(c&3)<<4|f>>4;let T=(f&15)<<2|E>>6,L=E&63;g||(L=64,l||(T=64)),r.push(t[b],t[S],t[T],t[L])}return r.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(zs(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):Na(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<i.length;){const c=t[i.charAt(o++)],f=o<i.length?t[i.charAt(o)]:0;++o;const E=o<i.length?t[i.charAt(o)]:64;++o;const S=o<i.length?t[i.charAt(o)]:64;if(++o,c==null||f==null||E==null||S==null)throw new Da;const T=c<<2|f>>4;if(r.push(T),E!==64){const L=f<<4&240|E>>2;if(r.push(L),S!==64){const k=E<<6&192|S;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class Da extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const La=function(i){const e=zs(i);return Gs.encodeByteArray(e,!0)},wn=function(i){return La(i).replace(/\./g,"")},qs=function(i){try{return Gs.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ua=()=>Ma().__FIREBASE_DEFAULTS__,xa=()=>{if(typeof process>"u"||typeof qr>"u")return;const i=qr.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},Fa=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&qs(i[1]);return e&&JSON.parse(e)},Ri=()=>{try{return Oa()||Ua()||xa()||Fa()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Ks=i=>{var e,t;return(t=(e=Ri())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[i]},Js=i=>{const e=Ks(i);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Xs=()=>{var i;return(i=Ri())===null||i===void 0?void 0:i.config},Ys=i=>{var e;return(e=Ri())===null||e===void 0?void 0:e[`_${i}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Va{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ki(i){return(await fetch(i,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zs(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",o=i.iat||0,c=i.sub||i.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:o,exp:o+3600,auth_time:o,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}}},i);return[wn(JSON.stringify(t)),wn(JSON.stringify(l)),""].join(".")}const Dt={};function ja(){const i={prod:[],emulator:[]};for(const e of Object.keys(Dt))Dt[e]?i.emulator.push(e):i.prod.push(e);return i}function Ba(i){let e=document.getElementById(i),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",i),t=!0),{created:t,element:e}}let Kr=!1;function Ci(i,e){if(typeof window>"u"||typeof document>"u"||!pt(window.location.host)||Dt[i]===e||Dt[i]||Kr)return;Dt[i]=e;function t(T){return`__firebase__banner__${T}`}const r="__firebase__banner",c=ja().prod.length>0;function l(){const T=document.getElementById(r);T&&T.remove()}function f(T){T.style.display="flex",T.style.background="#7faaf0",T.style.position="fixed",T.style.bottom="5px",T.style.left="5px",T.style.padding=".5em",T.style.borderRadius="5px",T.style.alignItems="center"}function g(T,L){T.setAttribute("width","24"),T.setAttribute("id",L),T.setAttribute("height","24"),T.setAttribute("viewBox","0 0 24 24"),T.setAttribute("fill","none"),T.style.marginLeft="-6px"}function E(){const T=document.createElement("span");return T.style.cursor="pointer",T.style.marginLeft="16px",T.style.fontSize="24px",T.innerHTML=" &times;",T.onclick=()=>{Kr=!0,l()},T}function b(T,L){T.setAttribute("id",L),T.innerText="Learn more",T.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",T.setAttribute("target","__blank"),T.style.paddingLeft="5px",T.style.textDecoration="underline"}function S(){const T=Ba(r),L=t("text"),k=document.getElementById(L)||document.createElement("span"),U=t("learnmore"),C=document.getElementById(U)||document.createElement("a"),z=t("preprendIcon"),H=document.getElementById(z)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(T.created){const x=T.element;f(x),b(C,U);const V=E();g(H,z),x.append(H,k,C,V),document.body.appendChild(x)}c?(k.innerText="Preview backend disconnected.",H.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(H.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,k.innerText="Preview backend running in this workspace."),k.setAttribute("id",L)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",S):S()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ee(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ha(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ee())}function $a(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Wa(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function za(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ga(){const i=ee();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function qa(){try{return typeof indexedDB=="object"}catch{return!1}}function Ka(){return new Promise((i,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(r),i(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var c;e(((c=o.error)===null||c===void 0?void 0:c.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ja="FirebaseError";class ye extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Ja,Object.setPrototypeOf(this,ye.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Bt.prototype.create)}}class Bt{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},o=`${this.service}/${e}`,c=this.errors[e],l=c?Xa(c,r):"Error",f=`${this.serviceName}: ${l} (${o}).`;return new ye(o,f,r)}}function Xa(i,e){return i.replace(Ya,(t,r)=>{const o=e[r];return o!=null?String(o):`<${r}?>`})}const Ya=/\{\$([^}]+)}/g;function Za(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function Ye(i,e){if(i===e)return!0;const t=Object.keys(i),r=Object.keys(e);for(const o of t){if(!r.includes(o))return!1;const c=i[o],l=e[o];if(Jr(c)&&Jr(l)){if(!Ye(c,l))return!1}else if(c!==l)return!1}for(const o of r)if(!t.includes(o))return!1;return!0}function Jr(i){return i!==null&&typeof i=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ht(i){const e=[];for(const[t,r]of Object.entries(i))Array.isArray(r)?r.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Qa(i,e){const t=new ec(i,e);return t.subscribe.bind(t)}class ec{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let o;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");tc(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:r},o.next===void 0&&(o.next=ai),o.error===void 0&&(o.error=ai),o.complete===void 0&&(o.complete=ai);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function tc(i,e){if(typeof i!="object"||i===null)return!1;for(const t of e)if(t in i&&typeof i[t]=="function")return!0;return!1}function ai(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tt(i){return i&&i._delegate?i._delegate:i}class je{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const We="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nc{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Va;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e?.identifier),o=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(c){if(o)return null;throw c}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(rc(e))try{this.getOrInitializeService({instanceIdentifier:We})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const c=this.getOrInitializeService({instanceIdentifier:o});r.resolve(c)}catch{}}}}clearInstance(e=We){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=We){return this.instances.has(e)}getOptions(e=We){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[c,l]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(c);r===f&&l.resolve(o)}return o}onInit(e,t){var r;const o=this.normalizeInstanceIdentifier(t),c=(r=this.onInitCallbacks.get(o))!==null&&r!==void 0?r:new Set;c.add(e),this.onInitCallbacks.set(o,c);const l=this.instances.get(o);return l&&e(l,o),()=>{c.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const o of r)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:ic(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=We){return this.component?this.component.multipleInstances?e:We:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ic(i){return i===We?void 0:i}function rc(i){return i.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new nc(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var M;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(M||(M={}));const oc={debug:M.DEBUG,verbose:M.VERBOSE,info:M.INFO,warn:M.WARN,error:M.ERROR,silent:M.SILENT},ac=M.INFO,cc={[M.DEBUG]:"log",[M.VERBOSE]:"log",[M.INFO]:"info",[M.WARN]:"warn",[M.ERROR]:"error"},hc=(i,e,...t)=>{if(e<i.logLevel)return;const r=new Date().toISOString(),o=cc[e];if(o)console[o](`[${r}]  ${i.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Pi{constructor(e){this.name=e,this._logLevel=ac,this._logHandler=hc,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in M))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?oc[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,M.DEBUG,...e),this._logHandler(this,M.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,M.VERBOSE,...e),this._logHandler(this,M.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,M.INFO,...e),this._logHandler(this,M.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,M.WARN,...e),this._logHandler(this,M.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,M.ERROR,...e),this._logHandler(this,M.ERROR,...e)}}const lc=(i,e)=>e.some(t=>i instanceof t);let Xr,Yr;function uc(){return Xr||(Xr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function dc(){return Yr||(Yr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Qs=new WeakMap,_i=new WeakMap,eo=new WeakMap,ci=new WeakMap,Oi=new WeakMap;function fc(i){const e=new Promise((t,r)=>{const o=()=>{i.removeEventListener("success",c),i.removeEventListener("error",l)},c=()=>{t(Fe(i.result)),o()},l=()=>{r(i.error),o()};i.addEventListener("success",c),i.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&Qs.set(t,i)}).catch(()=>{}),Oi.set(e,i),e}function pc(i){if(_i.has(i))return;const e=new Promise((t,r)=>{const o=()=>{i.removeEventListener("complete",c),i.removeEventListener("error",l),i.removeEventListener("abort",l)},c=()=>{t(),o()},l=()=>{r(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",c),i.addEventListener("error",l),i.addEventListener("abort",l)});_i.set(i,e)}let yi={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return _i.get(i);if(e==="objectStoreNames")return i.objectStoreNames||eo.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Fe(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function gc(i){yi=i(yi)}function mc(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=i.call(hi(this),e,...t);return eo.set(r,e.sort?e.sort():[e]),Fe(r)}:dc().includes(i)?function(...e){return i.apply(hi(this),e),Fe(Qs.get(this))}:function(...e){return Fe(i.apply(hi(this),e))}}function _c(i){return typeof i=="function"?mc(i):(i instanceof IDBTransaction&&pc(i),lc(i,uc())?new Proxy(i,yi):i)}function Fe(i){if(i instanceof IDBRequest)return fc(i);if(ci.has(i))return ci.get(i);const e=_c(i);return e!==i&&(ci.set(i,e),Oi.set(e,i)),e}const hi=i=>Oi.get(i);function yc(i,e,{blocked:t,upgrade:r,blocking:o,terminated:c}={}){const l=indexedDB.open(i,e),f=Fe(l);return r&&l.addEventListener("upgradeneeded",g=>{r(Fe(l.result),g.oldVersion,g.newVersion,Fe(l.transaction),g)}),t&&l.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),f.then(g=>{c&&g.addEventListener("close",()=>c()),o&&g.addEventListener("versionchange",E=>o(E.oldVersion,E.newVersion,E))}).catch(()=>{}),f}const vc=["get","getKey","getAll","getAllKeys","count"],wc=["put","add","delete","clear"],li=new Map;function Zr(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(li.get(e))return li.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,o=wc.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(o||vc.includes(t)))return;const c=async function(l,...f){const g=this.transaction(l,o?"readwrite":"readonly");let E=g.store;return r&&(E=E.index(f.shift())),(await Promise.all([E[t](...f),o&&g.done]))[0]};return li.set(e,c),c}gc(i=>({...i,get:(e,t,r)=>Zr(e,t)||i.get(e,t,r),has:(e,t)=>!!Zr(e,t)||i.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ic{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Ec(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Ec(i){const e=i.getComponent();return e?.type==="VERSION"}const vi="@firebase/app",Qr="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ke=new Pi("@firebase/app"),Tc="@firebase/app-compat",Ac="@firebase/analytics-compat",bc="@firebase/analytics",Sc="@firebase/app-check-compat",Rc="@firebase/app-check",kc="@firebase/auth",Cc="@firebase/auth-compat",Pc="@firebase/database",Oc="@firebase/data-connect",Nc="@firebase/database-compat",Dc="@firebase/functions",Lc="@firebase/functions-compat",Mc="@firebase/installations",Uc="@firebase/installations-compat",xc="@firebase/messaging",Fc="@firebase/messaging-compat",Vc="@firebase/performance",jc="@firebase/performance-compat",Bc="@firebase/remote-config",Hc="@firebase/remote-config-compat",$c="@firebase/storage",Wc="@firebase/storage-compat",zc="@firebase/firestore",Gc="@firebase/ai",qc="@firebase/firestore-compat",Kc="firebase",Jc="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wi="[DEFAULT]",Xc={[vi]:"fire-core",[Tc]:"fire-core-compat",[bc]:"fire-analytics",[Ac]:"fire-analytics-compat",[Rc]:"fire-app-check",[Sc]:"fire-app-check-compat",[kc]:"fire-auth",[Cc]:"fire-auth-compat",[Pc]:"fire-rtdb",[Oc]:"fire-data-connect",[Nc]:"fire-rtdb-compat",[Dc]:"fire-fn",[Lc]:"fire-fn-compat",[Mc]:"fire-iid",[Uc]:"fire-iid-compat",[xc]:"fire-fcm",[Fc]:"fire-fcm-compat",[Vc]:"fire-perf",[jc]:"fire-perf-compat",[Bc]:"fire-rc",[Hc]:"fire-rc-compat",[$c]:"fire-gcs",[Wc]:"fire-gcs-compat",[zc]:"fire-fst",[qc]:"fire-fst-compat",[Gc]:"fire-vertex","fire-js":"fire-js",[Kc]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const In=new Map,Yc=new Map,Ii=new Map;function es(i,e){try{i.container.addComponent(e)}catch(t){ke.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,t)}}function Ze(i){const e=i.name;if(Ii.has(e))return ke.debug(`There were multiple attempts to register component ${e}.`),!1;Ii.set(e,i);for(const t of In.values())es(t,i);for(const t of Yc.values())es(t,i);return!0}function On(i,e){const t=i.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),i.container.getProvider(e)}function ie(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ve=new Bt("app","Firebase",Zc);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qc{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new je("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ve.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nt=Jc;function to(i,e={}){let t=i;typeof e!="object"&&(e={name:e});const r=Object.assign({name:wi,automaticDataCollectionEnabled:!0},e),o=r.name;if(typeof o!="string"||!o)throw Ve.create("bad-app-name",{appName:String(o)});if(t||(t=Xs()),!t)throw Ve.create("no-options");const c=In.get(o);if(c){if(Ye(t,c.options)&&Ye(r,c.config))return c;throw Ve.create("duplicate-app",{appName:o})}const l=new sc(o);for(const g of Ii.values())l.addComponent(g);const f=new Qc(t,r,l);return In.set(o,f),f}function Ni(i=wi){const e=In.get(i);if(!e&&i===wi&&Xs())return to();if(!e)throw Ve.create("no-app",{appName:i});return e}function pe(i,e,t){var r;let o=(r=Xc[i])!==null&&r!==void 0?r:i;t&&(o+=`-${t}`);const c=o.match(/\s|\//),l=e.match(/\s|\//);if(c||l){const f=[`Unable to register library "${o}" with version "${e}":`];c&&f.push(`library name "${o}" contains illegal characters (whitespace or "/")`),c&&l&&f.push("and"),l&&f.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ke.warn(f.join(" "));return}Ze(new je(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh="firebase-heartbeat-database",th=1,Ft="firebase-heartbeat-store";let ui=null;function no(){return ui||(ui=yc(eh,th,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(Ft)}catch(t){console.warn(t)}}}}).catch(i=>{throw Ve.create("idb-open",{originalErrorMessage:i.message})})),ui}async function nh(i){try{const t=(await no()).transaction(Ft),r=await t.objectStore(Ft).get(io(i));return await t.done,r}catch(e){if(e instanceof ye)ke.warn(e.message);else{const t=Ve.create("idb-get",{originalErrorMessage:e?.message});ke.warn(t.message)}}}async function ts(i,e){try{const r=(await no()).transaction(Ft,"readwrite");await r.objectStore(Ft).put(e,io(i)),await r.done}catch(t){if(t instanceof ye)ke.warn(t.message);else{const r=Ve.create("idb-set",{originalErrorMessage:t?.message});ke.warn(r.message)}}}function io(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ih=1024,rh=30;class sh{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new ah(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),c=ns();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===c||this._heartbeatsCache.heartbeats.some(l=>l.date===c))return;if(this._heartbeatsCache.heartbeats.push({date:c,agent:o}),this._heartbeatsCache.heartbeats.length>rh){const l=ch(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){ke.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ns(),{heartbeatsToSend:r,unsentEntries:o}=oh(this._heartbeatsCache.heartbeats),c=wn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(t){return ke.warn(t),""}}}function ns(){return new Date().toISOString().substring(0,10)}function oh(i,e=ih){const t=[];let r=i.slice();for(const o of i){const c=t.find(l=>l.agent===o.agent);if(c){if(c.dates.push(o.date),is(t)>e){c.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),is(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class ah{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return qa()?Ka().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await nh(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return ts(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return ts(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function is(i){return wn(JSON.stringify({version:2,heartbeats:i})).length}function ch(i){if(i.length===0)return-1;let e=0,t=i[0].date;for(let r=1;r<i.length;r++)i[r].date<t&&(t=i[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hh(i){Ze(new je("platform-logger",e=>new Ic(e),"PRIVATE")),Ze(new je("heartbeat",e=>new sh(e),"PRIVATE")),pe(vi,Qr,i),pe(vi,Qr,"esm2017"),pe("fire-js","")}hh("");function ro(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const lh=ro,so=new Bt("auth","Firebase",ro());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const En=new Pi("@firebase/auth");function uh(i,...e){En.logLevel<=M.WARN&&En.warn(`Auth (${nt}): ${i}`,...e)}function gn(i,...e){En.logLevel<=M.ERROR&&En.error(`Auth (${nt}): ${i}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(i,...e){throw Li(i,...e)}function he(i,...e){return Li(i,...e)}function Di(i,e,t){const r=Object.assign(Object.assign({},lh()),{[e]:t});return new Bt("auth","Firebase",r).create(e,{appName:i.name})}function Ke(i){return Di(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function dh(i,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&me(i,"argument-error"),Di(i,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Li(i,...e){if(typeof i!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=i.name),i._errorFactory.create(t,...r)}return so.create(i,...e)}function R(i,e,...t){if(!i)throw Li(e,...t)}function Se(i){const e="INTERNAL ASSERTION FAILED: "+i;throw gn(e),new Error(e)}function Ce(i,e){i||Se(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ei(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.href)||""}function fh(){return rs()==="http:"||rs()==="https:"}function rs(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ph(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(fh()||Wa()||"connection"in navigator)?navigator.onLine:!0}function gh(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ce(t>e,"Short delay should be less than long delay!"),this.isMobile=Ha()||za()}get(){return ph()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mi(i,e){Ce(i.emulator,"Emulator should always be set here");const{url:t}=i.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Se("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Se("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Se("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mh={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],yh=new $t(3e4,6e4);function Ui(i,e){return i.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:i.tenantId}):e}async function gt(i,e,t,r,o={}){return ao(i,o,async()=>{let c={},l={};r&&(e==="GET"?l=r:c={body:JSON.stringify(r)});const f=Ht(Object.assign({key:i.config.apiKey},l)).slice(1),g=await i._getAdditionalHeaders();g["Content-Type"]="application/json",i.languageCode&&(g["X-Firebase-Locale"]=i.languageCode);const E=Object.assign({method:e,headers:g},c);return $a()||(E.referrerPolicy="no-referrer"),i.emulatorConfig&&pt(i.emulatorConfig.host)&&(E.credentials="include"),oo.fetch()(await co(i,i.config.apiHost,t,f),E)})}async function ao(i,e,t){i._canInitEmulator=!1;const r=Object.assign(Object.assign({},mh),e);try{const o=new wh(i),c=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const l=await c.json();if("needConfirmation"in l)throw un(i,"account-exists-with-different-credential",l);if(c.ok&&!("errorMessage"in l))return l;{const f=c.ok?l.errorMessage:l.error.message,[g,E]=f.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw un(i,"credential-already-in-use",l);if(g==="EMAIL_EXISTS")throw un(i,"email-already-in-use",l);if(g==="USER_DISABLED")throw un(i,"user-disabled",l);const b=r[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw Di(i,b,E);me(i,b)}}catch(o){if(o instanceof ye)throw o;me(i,"network-request-failed",{message:String(o)})}}async function vh(i,e,t,r,o={}){const c=await gt(i,e,t,r,o);return"mfaPendingCredential"in c&&me(i,"multi-factor-auth-required",{_serverResponse:c}),c}async function co(i,e,t,r){const o=`${e}${t}?${r}`,c=i,l=c.config.emulator?Mi(i.config,o):`${i.config.apiScheme}://${o}`;return _h.includes(t)&&(await c._persistenceManagerAvailable,c._getPersistenceType()==="COOKIE")?c._getPersistence()._getFinalTarget(l).toString():l}class wh{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(he(this.auth,"network-request-failed")),yh.get())})}}function un(i,e,t){const r={appName:i.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const o=he(i,e,r);return o.customData._tokenResponse=t,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ih(i,e){return gt(i,"POST","/v1/accounts:delete",e)}async function Tn(i,e){return gt(i,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lt(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Eh(i,e=!1){const t=tt(i),r=await t.getIdToken(e),o=xi(r);R(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const c=typeof o.firebase=="object"?o.firebase:void 0,l=c?.sign_in_provider;return{claims:o,token:r,authTime:Lt(di(o.auth_time)),issuedAtTime:Lt(di(o.iat)),expirationTime:Lt(di(o.exp)),signInProvider:l||null,signInSecondFactor:c?.sign_in_second_factor||null}}function di(i){return Number(i)*1e3}function xi(i){const[e,t,r]=i.split(".");if(e===void 0||t===void 0||r===void 0)return gn("JWT malformed, contained fewer than 3 sections"),null;try{const o=qs(t);return o?JSON.parse(o):(gn("Failed to decode base64 JWT payload"),null)}catch(o){return gn("Caught error parsing JWT payload as JSON",o?.toString()),null}}function ss(i){const e=xi(i);return R(e,"internal-error"),R(typeof e.exp<"u","internal-error"),R(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vt(i,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof ye&&Th(r)&&i.auth.currentUser===i&&await i.auth.signOut(),r}}function Th({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ah{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const o=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Lt(this.lastLoginAt),this.creationTime=Lt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function An(i){var e;const t=i.auth,r=await i.getIdToken(),o=await Vt(i,Tn(t,{idToken:r}));R(o?.users.length,t,"internal-error");const c=o.users[0];i._notifyReloadListener(c);const l=!((e=c.providerUserInfo)===null||e===void 0)&&e.length?ho(c.providerUserInfo):[],f=Sh(i.providerData,l),g=i.isAnonymous,E=!(i.email&&c.passwordHash)&&!f?.length,b=g?E:!1,S={uid:c.localId,displayName:c.displayName||null,photoURL:c.photoUrl||null,email:c.email||null,emailVerified:c.emailVerified||!1,phoneNumber:c.phoneNumber||null,tenantId:c.tenantId||null,providerData:f,metadata:new Ti(c.createdAt,c.lastLoginAt),isAnonymous:b};Object.assign(i,S)}async function bh(i){const e=tt(i);await An(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Sh(i,e){return[...i.filter(r=>!e.some(o=>o.providerId===r.providerId)),...e]}function ho(i){return i.map(e=>{var{providerId:t}=e,r=Si(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rh(i,e){const t=await ao(i,{},async()=>{const r=Ht({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:c}=i.config,l=await co(i,o,"/v1/token",`key=${c}`),f=await i._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:f,body:r};return i.emulatorConfig&&pt(i.emulatorConfig.host)&&(g.credentials="include"),oo.fetch()(l,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function kh(i,e){return gt(i,"POST","/v2/accounts:revokeToken",Ui(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){R(e.idToken,"internal-error"),R(typeof e.idToken<"u","internal-error"),R(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ss(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){R(e.length!==0,"internal-error");const t=ss(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(R(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:o,expiresIn:c}=await Rh(e,t);this.updateTokensAndExpiration(r,o,Number(c))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:o,expirationTime:c}=t,l=new ct;return r&&(R(typeof r=="string","internal-error",{appName:e}),l.refreshToken=r),o&&(R(typeof o=="string","internal-error",{appName:e}),l.accessToken=o),c&&(R(typeof c=="number","internal-error",{appName:e}),l.expirationTime=c),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ct,this.toJSON())}_performRefresh(){return Se("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Le(i,e){R(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class oe{constructor(e){var{uid:t,auth:r,stsTokenManager:o}=e,c=Si(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Ah(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=c.displayName||null,this.email=c.email||null,this.emailVerified=c.emailVerified||!1,this.phoneNumber=c.phoneNumber||null,this.photoURL=c.photoURL||null,this.isAnonymous=c.isAnonymous||!1,this.tenantId=c.tenantId||null,this.providerData=c.providerData?[...c.providerData]:[],this.metadata=new Ti(c.createdAt||void 0,c.lastLoginAt||void 0)}async getIdToken(e){const t=await Vt(this,this.stsTokenManager.getToken(this.auth,e));return R(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Eh(this,e)}reload(){return bh(this)}_assign(e){this!==e&&(R(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new oe(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){R(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await An(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ie(this.auth.app))return Promise.reject(Ke(this.auth));const e=await this.getIdToken();return await Vt(this,Ih(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,o,c,l,f,g,E,b;const S=(r=t.displayName)!==null&&r!==void 0?r:void 0,T=(o=t.email)!==null&&o!==void 0?o:void 0,L=(c=t.phoneNumber)!==null&&c!==void 0?c:void 0,k=(l=t.photoURL)!==null&&l!==void 0?l:void 0,U=(f=t.tenantId)!==null&&f!==void 0?f:void 0,C=(g=t._redirectEventId)!==null&&g!==void 0?g:void 0,z=(E=t.createdAt)!==null&&E!==void 0?E:void 0,H=(b=t.lastLoginAt)!==null&&b!==void 0?b:void 0,{uid:x,emailVerified:V,isAnonymous:te,providerData:W,stsTokenManager:y}=t;R(x&&y,e,"internal-error");const u=ct.fromJSON(this.name,y);R(typeof x=="string",e,"internal-error"),Le(S,e.name),Le(T,e.name),R(typeof V=="boolean",e,"internal-error"),R(typeof te=="boolean",e,"internal-error"),Le(L,e.name),Le(k,e.name),Le(U,e.name),Le(C,e.name),Le(z,e.name),Le(H,e.name);const p=new oe({uid:x,auth:e,email:T,emailVerified:V,displayName:S,isAnonymous:te,photoURL:k,phoneNumber:L,tenantId:U,stsTokenManager:u,createdAt:z,lastLoginAt:H});return W&&Array.isArray(W)&&(p.providerData=W.map(m=>Object.assign({},m))),C&&(p._redirectEventId=C),p}static async _fromIdTokenResponse(e,t,r=!1){const o=new ct;o.updateFromServerResponse(t);const c=new oe({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:r});return await An(c),c}static async _fromGetAccountInfoResponse(e,t,r){const o=t.users[0];R(o.localId!==void 0,"internal-error");const c=o.providerUserInfo!==void 0?ho(o.providerUserInfo):[],l=!(o.email&&o.passwordHash)&&!c?.length,f=new ct;f.updateFromIdToken(r);const g=new oe({uid:o.localId,auth:e,stsTokenManager:f,isAnonymous:l}),E={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:c,metadata:new Ti(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!c?.length};return Object.assign(g,E),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const os=new Map;function Re(i){Ce(i instanceof Function,"Expected a class definition");let e=os.get(i);return e?(Ce(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,os.set(i,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}lo.type="NONE";const as=lo;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mn(i,e,t){return`firebase:${i}:${e}:${t}`}class ht{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:o,name:c}=this.auth;this.fullUserKey=mn(this.userKey,o.apiKey,c),this.fullPersistenceKey=mn("persistence",o.apiKey,c),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Tn(this.auth,{idToken:e}).catch(()=>{});return t?oe._fromGetAccountInfoResponse(this.auth,t,e):null}return oe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new ht(Re(as),e,r);const o=(await Promise.all(t.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let c=o[0]||Re(as);const l=mn(r,e.config.apiKey,e.name);let f=null;for(const E of t)try{const b=await E._get(l);if(b){let S;if(typeof b=="string"){const T=await Tn(e,{idToken:b}).catch(()=>{});if(!T)break;S=await oe._fromGetAccountInfoResponse(e,T,b)}else S=oe._fromJSON(e,b);E!==c&&(f=S),c=E;break}}catch{}const g=o.filter(E=>E._shouldAllowMigration);return!c._shouldAllowMigration||!g.length?new ht(c,e,r):(c=g[0],f&&await c._set(l,f.toJSON()),await Promise.all(t.map(async E=>{if(E!==c)try{await E._remove(l)}catch{}})),new ht(c,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cs(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(go(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(uo(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(_o(e))return"Blackberry";if(yo(e))return"Webos";if(fo(e))return"Safari";if((e.includes("chrome/")||po(e))&&!e.includes("edge/"))return"Chrome";if(mo(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=i.match(t);if(r?.length===2)return r[1]}return"Other"}function uo(i=ee()){return/firefox\//i.test(i)}function fo(i=ee()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function po(i=ee()){return/crios\//i.test(i)}function go(i=ee()){return/iemobile/i.test(i)}function mo(i=ee()){return/android/i.test(i)}function _o(i=ee()){return/blackberry/i.test(i)}function yo(i=ee()){return/webos/i.test(i)}function Fi(i=ee()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function Ch(i=ee()){var e;return Fi(i)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Ph(){return Ga()&&document.documentMode===10}function vo(i=ee()){return Fi(i)||mo(i)||yo(i)||_o(i)||/windows phone/i.test(i)||go(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(i,e=[]){let t;switch(i){case"Browser":t=cs(ee());break;case"Worker":t=`${cs(ee())}-${i}`;break;default:t=i}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${nt}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oh{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=c=>new Promise((l,f)=>{try{const g=e(c);l(g)}catch(g){f(g)}});r.onAbort=t,this.queue.push(r);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nh(i,e={}){return gt(i,"GET","/v2/passwordPolicy",Ui(i,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh=6;class Lh{constructor(e){var t,r,o,c;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=l.minPasswordLength)!==null&&t!==void 0?t:Dh,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(c=e.forceUpgradeOnSignin)!==null&&c!==void 0?c:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,o,c,l,f;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(t=g.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),g.isValid&&(g.isValid=(r=g.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(c=g.containsUppercaseLetter)!==null&&c!==void 0?c:!0),g.isValid&&(g.isValid=(l=g.containsNumericCharacter)!==null&&l!==void 0?l:!0),g.isValid&&(g.isValid=(f=g.containsNonAlphanumericCharacter)!==null&&f!==void 0?f:!0),g}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let o=0;o<e.length;o++)r=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,o,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh{constructor(e,t,r,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new hs(this),this.idTokenSubscription=new hs(this),this.beforeStateQueue=new Oh(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=so,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(c=>this._resolvePersistenceManagerAvailable=c)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Re(t)),this._initializationPromise=this.queue(async()=>{var r,o,c;if(!this._deleted&&(this.persistenceManager=await ht.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((c=this.currentUser)===null||c===void 0?void 0:c.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Tn(this,{idToken:e}),r=await oe._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(ie(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(f,f))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let o=r,c=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,f=o?._redirectEventId,g=await this.tryRedirectSignIn(e);(!l||l===f)&&g?.user&&(o=g.user,c=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(c)try{await this.beforeStateQueue.runMiddleware(o)}catch(l){o=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return R(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await An(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=gh()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ie(this.app))return Promise.reject(Ke(this));const t=e?tt(e):null;return t&&R(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&R(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ie(this.app)?Promise.reject(Ke(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ie(this.app)?Promise.reject(Ke(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Re(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Nh(this),t=new Lh(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Bt("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await kh(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Re(e)||this._popupRedirectResolver;R(t,this,"argument-error"),this.redirectPersistenceManager=await ht.create(this,[Re(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,o){if(this._deleted)return()=>{};const c=typeof t=="function"?t:t.next.bind(t);let l=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(R(f,this,"internal-error"),f.then(()=>{l||c(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,r,o);return()=>{l=!0,g()}}else{const g=e.addObserver(t);return()=>{l=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return R(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=wo(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const o=await this._getAppCheckToken();return o&&(t["X-Firebase-AppCheck"]=o),t}async _getAppCheckToken(){var e;if(ie(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&uh(`Error while retrieving App Check token: ${t.error}`),t?.token}}function Nn(i){return tt(i)}class hs{constructor(e){this.auth=e,this.observer=null,this.addObserver=Qa(t=>this.observer=t)}get next(){return R(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Uh(i){Vi=i}function xh(i){return Vi.loadJS(i)}function Fh(){return Vi.gapiScript}function Vh(i){return`__${i}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jh(i,e){const t=On(i,"auth");if(t.isInitialized()){const o=t.getImmediate(),c=t.getOptions();if(Ye(c,e??{}))return o;me(o,"already-initialized")}return t.initialize({options:e})}function Bh(i,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(Re);e?.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(r,e?.popupRedirectResolver)}function Hh(i,e,t){const r=Nn(i);R(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const o=!1,c=Io(e),{host:l,port:f}=$h(e),g=f===null?"":`:${f}`,E={url:`${c}//${l}${g}/`},b=Object.freeze({host:l,port:f,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!r._canInitEmulator){R(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),R(Ye(E,r.config.emulator)&&Ye(b,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=E,r.emulatorConfig=b,r.settings.appVerificationDisabledForTesting=!0,pt(l)?(ki(`${c}//${l}${g}`),Ci("Auth",!0)):Wh()}function Io(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function $h(i){const e=Io(i),t=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(r);if(o){const c=o[1];return{host:c,port:ls(r.substr(c.length+1))}}else{const[c,l]=r.split(":");return{host:c,port:ls(l)}}}function ls(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function Wh(){function i(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Se("not implemented")}_getIdTokenResponse(e){return Se("not implemented")}_linkToIdToken(e,t){return Se("not implemented")}_getReauthenticationResolver(e){return Se("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lt(i,e){return vh(i,"POST","/v1/accounts:signInWithIdp",Ui(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zh="http://localhost";class Qe extends Eo{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Qe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):me("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:o}=t,c=Si(t,["providerId","signInMethod"]);if(!r||!o)return null;const l=new Qe(r,o);return l.idToken=c.idToken||void 0,l.accessToken=c.accessToken||void 0,l.secret=c.secret,l.nonce=c.nonce,l.pendingToken=c.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return lt(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,lt(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,lt(e,t)}buildRequest(){const e={requestUri:zh,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ht(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt extends ji{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me extends Wt{constructor(){super("facebook.com")}static credential(e){return Qe._fromParams({providerId:Me.PROVIDER_ID,signInMethod:Me.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Me.credentialFromTaggedObject(e)}static credentialFromError(e){return Me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Me.credential(e.oauthAccessToken)}catch{return null}}}Me.FACEBOOK_SIGN_IN_METHOD="facebook.com";Me.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae extends Wt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Qe._fromParams({providerId:Ae.PROVIDER_ID,signInMethod:Ae.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Ae.credentialFromTaggedObject(e)}static credentialFromError(e){return Ae.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Ae.credential(t,r)}catch{return null}}}Ae.GOOGLE_SIGN_IN_METHOD="google.com";Ae.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue extends Wt{constructor(){super("github.com")}static credential(e){return Qe._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ue.credential(e.oauthAccessToken)}catch{return null}}}Ue.GITHUB_SIGN_IN_METHOD="github.com";Ue.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe extends Wt{constructor(){super("twitter.com")}static credential(e,t){return Qe._fromParams({providerId:xe.PROVIDER_ID,signInMethod:xe.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return xe.credentialFromTaggedObject(e)}static credentialFromError(e){return xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return xe.credential(t,r)}catch{return null}}}xe.TWITTER_SIGN_IN_METHOD="twitter.com";xe.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,o=!1){const c=await oe._fromIdTokenResponse(e,r,o),l=us(r);return new dt({user:c,providerId:l,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const o=us(r);return new dt({user:e,providerId:o,_tokenResponse:r,operationType:t})}}function us(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn extends ye{constructor(e,t,r,o){var c;super(t.code,t.message),this.operationType=r,this.user=o,Object.setPrototypeOf(this,bn.prototype),this.customData={appName:e.name,tenantId:(c=e.tenantId)!==null&&c!==void 0?c:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,o){return new bn(e,t,r,o)}}function To(i,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(i):t._getIdTokenResponse(i)).catch(c=>{throw c.code==="auth/multi-factor-auth-required"?bn._fromErrorAndOperation(i,c,e,r):c})}async function Gh(i,e,t=!1){const r=await Vt(i,e._linkToIdToken(i.auth,await i.getIdToken()),t);return dt._forOperation(i,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qh(i,e,t=!1){const{auth:r}=i;if(ie(r.app))return Promise.reject(Ke(r));const o="reauthenticate";try{const c=await Vt(i,To(r,o,e,i),t);R(c.idToken,r,"internal-error");const l=xi(c.idToken);R(l,r,"internal-error");const{sub:f}=l;return R(i.uid===f,r,"user-mismatch"),dt._forOperation(i,o,c)}catch(c){throw c?.code==="auth/user-not-found"&&me(r,"user-mismatch"),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kh(i,e,t=!1){if(ie(i.app))return Promise.reject(Ke(i));const r="signIn",o=await To(i,r,e),c=await dt._fromIdTokenResponse(i,r,o);return t||await i._updateCurrentUser(c.user),c}function Jh(i,e,t,r){return tt(i).onIdTokenChanged(e,t,r)}function Xh(i,e,t){return tt(i).beforeAuthStateChanged(e,t)}const Sn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ao{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Sn,"1"),this.storage.removeItem(Sn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yh=1e3,Zh=10;class bo extends Ao{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=vo(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),o=this.localCache[t];r!==o&&e(t,o,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,f,g)=>{this.notifyListeners(l,g)});return}const r=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const l=this.storage.getItem(r);!t&&this.localCache[r]===l||this.notifyListeners(r,l)},c=this.storage.getItem(r);Ph()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,Zh):o()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Yh)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}bo.type="LOCAL";const Qh=bo;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So extends Ao{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}So.type="SESSION";const Ro=So;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function el(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const r=new Dn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:o,data:c}=t.data,l=this.handlersMap[o];if(!l?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:o});const f=Array.from(l).map(async E=>E(t.origin,c)),g=await el(f);t.ports[0].postMessage({status:"done",eventId:r,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Dn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bi(i="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return i+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let c,l;return new Promise((f,g)=>{const E=Bi("",20);o.port1.start();const b=setTimeout(()=>{g(new Error("unsupported_event"))},r);l={messageChannel:o,onMessage(S){const T=S;if(T.data.eventId===E)switch(T.data.status){case"ack":clearTimeout(b),c=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),f(T.data.response);break;default:clearTimeout(b),clearTimeout(c),g(new Error("invalid_response"));break}}},this.handlers.add(l),o.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:E,data:t},[o.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(){return window}function nl(i){ge().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(){return typeof ge().WorkerGlobalScope<"u"&&typeof ge().importScripts=="function"}async function il(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function rl(){var i;return((i=navigator?.serviceWorker)===null||i===void 0?void 0:i.controller)||null}function sl(){return ko()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Co="firebaseLocalStorageDb",ol=1,Rn="firebaseLocalStorage",Po="fbase_key";class zt{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ln(i,e){return i.transaction([Rn],e?"readwrite":"readonly").objectStore(Rn)}function al(){const i=indexedDB.deleteDatabase(Co);return new zt(i).toPromise()}function Ai(){const i=indexedDB.open(Co,ol);return new Promise((e,t)=>{i.addEventListener("error",()=>{t(i.error)}),i.addEventListener("upgradeneeded",()=>{const r=i.result;try{r.createObjectStore(Rn,{keyPath:Po})}catch(o){t(o)}}),i.addEventListener("success",async()=>{const r=i.result;r.objectStoreNames.contains(Rn)?e(r):(r.close(),await al(),e(await Ai()))})})}async function ds(i,e,t){const r=Ln(i,!0).put({[Po]:e,value:t});return new zt(r).toPromise()}async function cl(i,e){const t=Ln(i,!1).get(e),r=await new zt(t).toPromise();return r===void 0?null:r.value}function fs(i,e){const t=Ln(i,!0).delete(e);return new zt(t).toPromise()}const hl=800,ll=3;class Oo{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Ai(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>ll)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ko()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Dn._getInstance(sl()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await il(),!this.activeServiceWorker)return;this.sender=new tl(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||rl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Ai();return await ds(e,Sn,"1"),await fs(e,Sn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>ds(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>cl(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>fs(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const c=Ln(o,!1).getAll();return new zt(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:o,value:c}of e)r.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(c)&&(this.notifyListeners(o,c),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!r.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),hl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Oo.type="LOCAL";const ul=Oo;new $t(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function No(i,e){return e?Re(e):(R(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hi extends Eo{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return lt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return lt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return lt(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function dl(i){return Kh(i.auth,new Hi(i),i.bypassAuthState)}function fl(i){const{auth:e,user:t}=i;return R(t,e,"internal-error"),qh(t,new Hi(i),i.bypassAuthState)}async function pl(i){const{auth:e,user:t}=i;return R(t,e,"internal-error"),Gh(t,new Hi(i),i.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do{constructor(e,t,r,o,c=!1){this.auth=e,this.resolver=r,this.user=o,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:o,tenantId:c,error:l,type:f}=e;if(l){this.reject(l);return}const g={auth:this.auth,requestUri:t,sessionId:r,tenantId:c||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(g))}catch(E){this.reject(E)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return dl;case"linkViaPopup":case"linkViaRedirect":return pl;case"reauthViaPopup":case"reauthViaRedirect":return fl;default:me(this.auth,"internal-error")}}resolve(e){Ce(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ce(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gl=new $t(2e3,1e4);async function ml(i,e,t){if(ie(i.app))return Promise.reject(he(i,"operation-not-supported-in-this-environment"));const r=Nn(i);dh(i,e,ji);const o=No(r,t);return new Ge(r,"signInViaPopup",e,o).executeNotNull()}class Ge extends Do{constructor(e,t,r,o,c){super(e,t,o,c),this.provider=r,this.authWindow=null,this.pollId=null,Ge.currentPopupAction&&Ge.currentPopupAction.cancel(),Ge.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return R(e,this.auth,"internal-error"),e}async onExecution(){Ce(this.filter.length===1,"Popup operations only handle one event");const e=Bi();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(he(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(he(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ge.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(he(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,gl.get())};e()}}Ge.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _l="pendingRedirect",_n=new Map;class yl extends Do{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=_n.get(this.auth._key());if(!e){try{const r=await vl(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}_n.set(this.auth._key(),e)}return this.bypassAuthState||_n.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function vl(i,e){const t=El(e),r=Il(i);if(!await r._isAvailable())return!1;const o=await r._get(t)==="true";return await r._remove(t),o}function wl(i,e){_n.set(i._key(),e)}function Il(i){return Re(i._redirectPersistence)}function El(i){return mn(_l,i.config.apiKey,i.name)}async function Tl(i,e,t=!1){if(ie(i.app))return Promise.reject(Ke(i));const r=Nn(i),o=No(r,e),l=await new yl(r,o,t).execute();return l&&!t&&(delete l.user._redirectEventId,await r._persistUserIfCurrent(l.user),await r._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Al=600*1e3;class bl{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Sl(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Lo(e)){const o=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(he(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Al&&this.cachedEventUids.clear(),this.cachedEventUids.has(ps(e))}saveEventToCache(e){this.cachedEventUids.add(ps(e)),this.lastProcessedEventTime=Date.now()}}function ps(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function Lo({type:i,error:e}){return i==="unknown"&&e?.code==="auth/no-auth-event"}function Sl(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Lo(i);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rl(i,e={}){return gt(i,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kl=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Cl=/^https?/;async function Pl(i){if(i.config.emulator)return;const{authorizedDomains:e}=await Rl(i);for(const t of e)try{if(Ol(t))return}catch{}me(i,"unauthorized-domain")}function Ol(i){const e=Ei(),{protocol:t,hostname:r}=new URL(e);if(i.startsWith("chrome-extension://")){const l=new URL(i);return l.hostname===""&&r===""?t==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===r}if(!Cl.test(t))return!1;if(kl.test(i))return r===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nl=new $t(3e4,6e4);function gs(){const i=ge().___jsl;if(i?.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let t=0;t<i.CP.length;t++)i.CP[t]=null}}function Dl(i){return new Promise((e,t)=>{var r,o,c;function l(){gs(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{gs(),t(he(i,"network-request-failed"))},timeout:Nl.get()})}if(!((o=(r=ge().gapi)===null||r===void 0?void 0:r.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((c=ge().gapi)===null||c===void 0)&&c.load)l();else{const f=Vh("iframefcb");return ge()[f]=()=>{gapi.load?l():t(he(i,"network-request-failed"))},xh(`${Fh()}?onload=${f}`).catch(g=>t(g))}}).catch(e=>{throw yn=null,e})}let yn=null;function Ll(i){return yn=yn||Dl(i),yn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml=new $t(5e3,15e3),Ul="__/auth/iframe",xl="emulator/auth/iframe",Fl={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Vl=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function jl(i){const e=i.config;R(e.authDomain,i,"auth-domain-config-required");const t=e.emulator?Mi(e,xl):`https://${i.config.authDomain}/${Ul}`,r={apiKey:e.apiKey,appName:i.name,v:nt},o=Vl.get(i.config.apiHost);o&&(r.eid=o);const c=i._getFrameworks();return c.length&&(r.fw=c.join(",")),`${t}?${Ht(r).slice(1)}`}async function Bl(i){const e=await Ll(i),t=ge().gapi;return R(t,i,"internal-error"),e.open({where:document.body,url:jl(i),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Fl,dontclear:!0},r=>new Promise(async(o,c)=>{await r.restyle({setHideOnLeave:!1});const l=he(i,"network-request-failed"),f=ge().setTimeout(()=>{c(l)},Ml.get());function g(){ge().clearTimeout(f),o(r)}r.ping(g).then(g,()=>{c(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},$l=500,Wl=600,zl="_blank",Gl="http://localhost";class ms{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ql(i,e,t,r=$l,o=Wl){const c=Math.max((window.screen.availHeight-o)/2,0).toString(),l=Math.max((window.screen.availWidth-r)/2,0).toString();let f="";const g=Object.assign(Object.assign({},Hl),{width:r.toString(),height:o.toString(),top:c,left:l}),E=ee().toLowerCase();t&&(f=po(E)?zl:t),uo(E)&&(e=e||Gl,g.scrollbars="yes");const b=Object.entries(g).reduce((T,[L,k])=>`${T}${L}=${k},`,"");if(Ch(E)&&f!=="_self")return Kl(e||"",f),new ms(null);const S=window.open(e||"",f,b);R(S,i,"popup-blocked");try{S.focus()}catch{}return new ms(S)}function Kl(i,e){const t=document.createElement("a");t.href=i,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl="__/auth/handler",Xl="emulator/auth/handler",Yl=encodeURIComponent("fac");async function _s(i,e,t,r,o,c){R(i.config.authDomain,i,"auth-domain-config-required"),R(i.config.apiKey,i,"invalid-api-key");const l={apiKey:i.config.apiKey,appName:i.name,authType:t,redirectUrl:r,v:nt,eventId:o};if(e instanceof ji){e.setDefaultLanguage(i.languageCode),l.providerId=e.providerId||"",Za(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[b,S]of Object.entries({}))l[b]=S}if(e instanceof Wt){const b=e.getScopes().filter(S=>S!=="");b.length>0&&(l.scopes=b.join(","))}i.tenantId&&(l.tid=i.tenantId);const f=l;for(const b of Object.keys(f))f[b]===void 0&&delete f[b];const g=await i._getAppCheckToken(),E=g?`#${Yl}=${encodeURIComponent(g)}`:"";return`${Zl(i)}?${Ht(f).slice(1)}${E}`}function Zl({config:i}){return i.emulator?Mi(i,Xl):`https://${i.authDomain}/${Jl}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fi="webStorageSupport";class Ql{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ro,this._completeRedirectFn=Tl,this._overrideRedirectResult=wl}async _openPopup(e,t,r,o){var c;Ce((c=this.eventManagers[e._key()])===null||c===void 0?void 0:c.manager,"_initialize() not called before _openPopup()");const l=await _s(e,t,r,Ei(),o);return ql(e,l,Bi())}async _openRedirect(e,t,r,o){await this._originValidation(e);const c=await _s(e,t,r,Ei(),o);return nl(c),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:c}=this.eventManagers[t];return o?Promise.resolve(o):(Ce(c,"If manager is not set, promise should be"),c)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Bl(e),r=new bl(e);return t.register("authEvent",o=>(R(o?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(fi,{type:fi},o=>{var c;const l=(c=o?.[0])===null||c===void 0?void 0:c[fi];l!==void 0&&t(!!l),me(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Pl(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return vo()||fo()||Fi()}}const eu=Ql;var ys="@firebase/auth",vs="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){R(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nu(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function iu(i){Ze(new je("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:l,authDomain:f}=r.options;R(l&&!l.includes(":"),"invalid-api-key",{appName:r.name});const g={apiKey:l,authDomain:f,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:wo(i)},E=new Mh(r,o,c,g);return Bh(E,t),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Ze(new je("auth-internal",e=>{const t=Nn(e.getProvider("auth").getImmediate());return(r=>new tu(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),pe(ys,vs,nu(i)),pe(ys,vs,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ru=300,su=Ys("authIdTokenMaxAge")||ru;let ws=null;const ou=i=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>su)return;const o=t?.token;ws!==o&&(ws=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function au(i=Ni()){const e=On(i,"auth");if(e.isInitialized())return e.getImmediate();const t=jh(i,{popupRedirectResolver:eu,persistence:[ul,Qh,Ro]}),r=Ys("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(r,location.origin);if(location.origin===c.origin){const l=ou(c.toString());Xh(t,l,()=>l(t.currentUser)),Jh(t,f=>l(f))}}const o=Ks("auth");return o&&Hh(t,`http://${o}`),t}function cu(){var i,e;return(e=(i=document.getElementsByTagName("head"))===null||i===void 0?void 0:i[0])!==null&&e!==void 0?e:document}Uh({loadJS(i){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",i),r.onload=e,r.onerror=o=>{const c=he("internal-error");c.customData=o,t(c)},r.type="text/javascript",r.charset="UTF-8",cu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});iu("Browser");var hu="firebase",lu="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */pe(hu,lu,"app");var Is=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var $i;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(y,u){function p(){}p.prototype=u.prototype,y.D=u.prototype,y.prototype=new p,y.prototype.constructor=y,y.C=function(m,_,w){for(var d=Array(arguments.length-2),we=2;we<arguments.length;we++)d[we-2]=arguments[we];return u.prototype[_].apply(m,d)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(y,u,p){p||(p=0);var m=Array(16);if(typeof u=="string")for(var _=0;16>_;++_)m[_]=u.charCodeAt(p++)|u.charCodeAt(p++)<<8|u.charCodeAt(p++)<<16|u.charCodeAt(p++)<<24;else for(_=0;16>_;++_)m[_]=u[p++]|u[p++]<<8|u[p++]<<16|u[p++]<<24;u=y.g[0],p=y.g[1],_=y.g[2];var w=y.g[3],d=u+(w^p&(_^w))+m[0]+3614090360&4294967295;u=p+(d<<7&4294967295|d>>>25),d=w+(_^u&(p^_))+m[1]+3905402710&4294967295,w=u+(d<<12&4294967295|d>>>20),d=_+(p^w&(u^p))+m[2]+606105819&4294967295,_=w+(d<<17&4294967295|d>>>15),d=p+(u^_&(w^u))+m[3]+3250441966&4294967295,p=_+(d<<22&4294967295|d>>>10),d=u+(w^p&(_^w))+m[4]+4118548399&4294967295,u=p+(d<<7&4294967295|d>>>25),d=w+(_^u&(p^_))+m[5]+1200080426&4294967295,w=u+(d<<12&4294967295|d>>>20),d=_+(p^w&(u^p))+m[6]+2821735955&4294967295,_=w+(d<<17&4294967295|d>>>15),d=p+(u^_&(w^u))+m[7]+4249261313&4294967295,p=_+(d<<22&4294967295|d>>>10),d=u+(w^p&(_^w))+m[8]+1770035416&4294967295,u=p+(d<<7&4294967295|d>>>25),d=w+(_^u&(p^_))+m[9]+2336552879&4294967295,w=u+(d<<12&4294967295|d>>>20),d=_+(p^w&(u^p))+m[10]+4294925233&4294967295,_=w+(d<<17&4294967295|d>>>15),d=p+(u^_&(w^u))+m[11]+2304563134&4294967295,p=_+(d<<22&4294967295|d>>>10),d=u+(w^p&(_^w))+m[12]+1804603682&4294967295,u=p+(d<<7&4294967295|d>>>25),d=w+(_^u&(p^_))+m[13]+4254626195&4294967295,w=u+(d<<12&4294967295|d>>>20),d=_+(p^w&(u^p))+m[14]+2792965006&4294967295,_=w+(d<<17&4294967295|d>>>15),d=p+(u^_&(w^u))+m[15]+1236535329&4294967295,p=_+(d<<22&4294967295|d>>>10),d=u+(_^w&(p^_))+m[1]+4129170786&4294967295,u=p+(d<<5&4294967295|d>>>27),d=w+(p^_&(u^p))+m[6]+3225465664&4294967295,w=u+(d<<9&4294967295|d>>>23),d=_+(u^p&(w^u))+m[11]+643717713&4294967295,_=w+(d<<14&4294967295|d>>>18),d=p+(w^u&(_^w))+m[0]+3921069994&4294967295,p=_+(d<<20&4294967295|d>>>12),d=u+(_^w&(p^_))+m[5]+3593408605&4294967295,u=p+(d<<5&4294967295|d>>>27),d=w+(p^_&(u^p))+m[10]+38016083&4294967295,w=u+(d<<9&4294967295|d>>>23),d=_+(u^p&(w^u))+m[15]+3634488961&4294967295,_=w+(d<<14&4294967295|d>>>18),d=p+(w^u&(_^w))+m[4]+3889429448&4294967295,p=_+(d<<20&4294967295|d>>>12),d=u+(_^w&(p^_))+m[9]+568446438&4294967295,u=p+(d<<5&4294967295|d>>>27),d=w+(p^_&(u^p))+m[14]+3275163606&4294967295,w=u+(d<<9&4294967295|d>>>23),d=_+(u^p&(w^u))+m[3]+4107603335&4294967295,_=w+(d<<14&4294967295|d>>>18),d=p+(w^u&(_^w))+m[8]+1163531501&4294967295,p=_+(d<<20&4294967295|d>>>12),d=u+(_^w&(p^_))+m[13]+2850285829&4294967295,u=p+(d<<5&4294967295|d>>>27),d=w+(p^_&(u^p))+m[2]+4243563512&4294967295,w=u+(d<<9&4294967295|d>>>23),d=_+(u^p&(w^u))+m[7]+1735328473&4294967295,_=w+(d<<14&4294967295|d>>>18),d=p+(w^u&(_^w))+m[12]+2368359562&4294967295,p=_+(d<<20&4294967295|d>>>12),d=u+(p^_^w)+m[5]+4294588738&4294967295,u=p+(d<<4&4294967295|d>>>28),d=w+(u^p^_)+m[8]+2272392833&4294967295,w=u+(d<<11&4294967295|d>>>21),d=_+(w^u^p)+m[11]+1839030562&4294967295,_=w+(d<<16&4294967295|d>>>16),d=p+(_^w^u)+m[14]+4259657740&4294967295,p=_+(d<<23&4294967295|d>>>9),d=u+(p^_^w)+m[1]+2763975236&4294967295,u=p+(d<<4&4294967295|d>>>28),d=w+(u^p^_)+m[4]+1272893353&4294967295,w=u+(d<<11&4294967295|d>>>21),d=_+(w^u^p)+m[7]+4139469664&4294967295,_=w+(d<<16&4294967295|d>>>16),d=p+(_^w^u)+m[10]+3200236656&4294967295,p=_+(d<<23&4294967295|d>>>9),d=u+(p^_^w)+m[13]+681279174&4294967295,u=p+(d<<4&4294967295|d>>>28),d=w+(u^p^_)+m[0]+3936430074&4294967295,w=u+(d<<11&4294967295|d>>>21),d=_+(w^u^p)+m[3]+3572445317&4294967295,_=w+(d<<16&4294967295|d>>>16),d=p+(_^w^u)+m[6]+76029189&4294967295,p=_+(d<<23&4294967295|d>>>9),d=u+(p^_^w)+m[9]+3654602809&4294967295,u=p+(d<<4&4294967295|d>>>28),d=w+(u^p^_)+m[12]+3873151461&4294967295,w=u+(d<<11&4294967295|d>>>21),d=_+(w^u^p)+m[15]+530742520&4294967295,_=w+(d<<16&4294967295|d>>>16),d=p+(_^w^u)+m[2]+3299628645&4294967295,p=_+(d<<23&4294967295|d>>>9),d=u+(_^(p|~w))+m[0]+4096336452&4294967295,u=p+(d<<6&4294967295|d>>>26),d=w+(p^(u|~_))+m[7]+1126891415&4294967295,w=u+(d<<10&4294967295|d>>>22),d=_+(u^(w|~p))+m[14]+2878612391&4294967295,_=w+(d<<15&4294967295|d>>>17),d=p+(w^(_|~u))+m[5]+4237533241&4294967295,p=_+(d<<21&4294967295|d>>>11),d=u+(_^(p|~w))+m[12]+1700485571&4294967295,u=p+(d<<6&4294967295|d>>>26),d=w+(p^(u|~_))+m[3]+2399980690&4294967295,w=u+(d<<10&4294967295|d>>>22),d=_+(u^(w|~p))+m[10]+4293915773&4294967295,_=w+(d<<15&4294967295|d>>>17),d=p+(w^(_|~u))+m[1]+2240044497&4294967295,p=_+(d<<21&4294967295|d>>>11),d=u+(_^(p|~w))+m[8]+1873313359&4294967295,u=p+(d<<6&4294967295|d>>>26),d=w+(p^(u|~_))+m[15]+4264355552&4294967295,w=u+(d<<10&4294967295|d>>>22),d=_+(u^(w|~p))+m[6]+2734768916&4294967295,_=w+(d<<15&4294967295|d>>>17),d=p+(w^(_|~u))+m[13]+1309151649&4294967295,p=_+(d<<21&4294967295|d>>>11),d=u+(_^(p|~w))+m[4]+4149444226&4294967295,u=p+(d<<6&4294967295|d>>>26),d=w+(p^(u|~_))+m[11]+3174756917&4294967295,w=u+(d<<10&4294967295|d>>>22),d=_+(u^(w|~p))+m[2]+718787259&4294967295,_=w+(d<<15&4294967295|d>>>17),d=p+(w^(_|~u))+m[9]+3951481745&4294967295,y.g[0]=y.g[0]+u&4294967295,y.g[1]=y.g[1]+(_+(d<<21&4294967295|d>>>11))&4294967295,y.g[2]=y.g[2]+_&4294967295,y.g[3]=y.g[3]+w&4294967295}r.prototype.u=function(y,u){u===void 0&&(u=y.length);for(var p=u-this.blockSize,m=this.B,_=this.h,w=0;w<u;){if(_==0)for(;w<=p;)o(this,y,w),w+=this.blockSize;if(typeof y=="string"){for(;w<u;)if(m[_++]=y.charCodeAt(w++),_==this.blockSize){o(this,m),_=0;break}}else for(;w<u;)if(m[_++]=y[w++],_==this.blockSize){o(this,m),_=0;break}}this.h=_,this.o+=u},r.prototype.v=function(){var y=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);y[0]=128;for(var u=1;u<y.length-8;++u)y[u]=0;var p=8*this.o;for(u=y.length-8;u<y.length;++u)y[u]=p&255,p/=256;for(this.u(y),y=Array(16),u=p=0;4>u;++u)for(var m=0;32>m;m+=8)y[p++]=this.g[u]>>>m&255;return y};function c(y,u){var p=f;return Object.prototype.hasOwnProperty.call(p,y)?p[y]:p[y]=u(y)}function l(y,u){this.h=u;for(var p=[],m=!0,_=y.length-1;0<=_;_--){var w=y[_]|0;m&&w==u||(p[_]=w,m=!1)}this.g=p}var f={};function g(y){return-128<=y&&128>y?c(y,function(u){return new l([u|0],0>u?-1:0)}):new l([y|0],0>y?-1:0)}function E(y){if(isNaN(y)||!isFinite(y))return S;if(0>y)return C(E(-y));for(var u=[],p=1,m=0;y>=p;m++)u[m]=y/p|0,p*=4294967296;return new l(u,0)}function b(y,u){if(y.length==0)throw Error("number format error: empty string");if(u=u||10,2>u||36<u)throw Error("radix out of range: "+u);if(y.charAt(0)=="-")return C(b(y.substring(1),u));if(0<=y.indexOf("-"))throw Error('number format error: interior "-" character');for(var p=E(Math.pow(u,8)),m=S,_=0;_<y.length;_+=8){var w=Math.min(8,y.length-_),d=parseInt(y.substring(_,_+w),u);8>w?(w=E(Math.pow(u,w)),m=m.j(w).add(E(d))):(m=m.j(p),m=m.add(E(d)))}return m}var S=g(0),T=g(1),L=g(16777216);i=l.prototype,i.m=function(){if(U(this))return-C(this).m();for(var y=0,u=1,p=0;p<this.g.length;p++){var m=this.i(p);y+=(0<=m?m:4294967296+m)*u,u*=4294967296}return y},i.toString=function(y){if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(k(this))return"0";if(U(this))return"-"+C(this).toString(y);for(var u=E(Math.pow(y,6)),p=this,m="";;){var _=V(p,u).g;p=z(p,_.j(u));var w=((0<p.g.length?p.g[0]:p.h)>>>0).toString(y);if(p=_,k(p))return w+m;for(;6>w.length;)w="0"+w;m=w+m}},i.i=function(y){return 0>y?0:y<this.g.length?this.g[y]:this.h};function k(y){if(y.h!=0)return!1;for(var u=0;u<y.g.length;u++)if(y.g[u]!=0)return!1;return!0}function U(y){return y.h==-1}i.l=function(y){return y=z(this,y),U(y)?-1:k(y)?0:1};function C(y){for(var u=y.g.length,p=[],m=0;m<u;m++)p[m]=~y.g[m];return new l(p,~y.h).add(T)}i.abs=function(){return U(this)?C(this):this},i.add=function(y){for(var u=Math.max(this.g.length,y.g.length),p=[],m=0,_=0;_<=u;_++){var w=m+(this.i(_)&65535)+(y.i(_)&65535),d=(w>>>16)+(this.i(_)>>>16)+(y.i(_)>>>16);m=d>>>16,w&=65535,d&=65535,p[_]=d<<16|w}return new l(p,p[p.length-1]&-2147483648?-1:0)};function z(y,u){return y.add(C(u))}i.j=function(y){if(k(this)||k(y))return S;if(U(this))return U(y)?C(this).j(C(y)):C(C(this).j(y));if(U(y))return C(this.j(C(y)));if(0>this.l(L)&&0>y.l(L))return E(this.m()*y.m());for(var u=this.g.length+y.g.length,p=[],m=0;m<2*u;m++)p[m]=0;for(m=0;m<this.g.length;m++)for(var _=0;_<y.g.length;_++){var w=this.i(m)>>>16,d=this.i(m)&65535,we=y.i(_)>>>16,mt=y.i(_)&65535;p[2*m+2*_]+=d*mt,H(p,2*m+2*_),p[2*m+2*_+1]+=w*mt,H(p,2*m+2*_+1),p[2*m+2*_+1]+=d*we,H(p,2*m+2*_+1),p[2*m+2*_+2]+=w*we,H(p,2*m+2*_+2)}for(m=0;m<u;m++)p[m]=p[2*m+1]<<16|p[2*m];for(m=u;m<2*u;m++)p[m]=0;return new l(p,0)};function H(y,u){for(;(y[u]&65535)!=y[u];)y[u+1]+=y[u]>>>16,y[u]&=65535,u++}function x(y,u){this.g=y,this.h=u}function V(y,u){if(k(u))throw Error("division by zero");if(k(y))return new x(S,S);if(U(y))return u=V(C(y),u),new x(C(u.g),C(u.h));if(U(u))return u=V(y,C(u)),new x(C(u.g),u.h);if(30<y.g.length){if(U(y)||U(u))throw Error("slowDivide_ only works with positive integers.");for(var p=T,m=u;0>=m.l(y);)p=te(p),m=te(m);var _=W(p,1),w=W(m,1);for(m=W(m,2),p=W(p,2);!k(m);){var d=w.add(m);0>=d.l(y)&&(_=_.add(p),w=d),m=W(m,1),p=W(p,1)}return u=z(y,_.j(u)),new x(_,u)}for(_=S;0<=y.l(u);){for(p=Math.max(1,Math.floor(y.m()/u.m())),m=Math.ceil(Math.log(p)/Math.LN2),m=48>=m?1:Math.pow(2,m-48),w=E(p),d=w.j(u);U(d)||0<d.l(y);)p-=m,w=E(p),d=w.j(u);k(w)&&(w=T),_=_.add(w),y=z(y,d)}return new x(_,y)}i.A=function(y){return V(this,y).h},i.and=function(y){for(var u=Math.max(this.g.length,y.g.length),p=[],m=0;m<u;m++)p[m]=this.i(m)&y.i(m);return new l(p,this.h&y.h)},i.or=function(y){for(var u=Math.max(this.g.length,y.g.length),p=[],m=0;m<u;m++)p[m]=this.i(m)|y.i(m);return new l(p,this.h|y.h)},i.xor=function(y){for(var u=Math.max(this.g.length,y.g.length),p=[],m=0;m<u;m++)p[m]=this.i(m)^y.i(m);return new l(p,this.h^y.h)};function te(y){for(var u=y.g.length+1,p=[],m=0;m<u;m++)p[m]=y.i(m)<<1|y.i(m-1)>>>31;return new l(p,y.h)}function W(y,u){var p=u>>5;u%=32;for(var m=y.g.length-p,_=[],w=0;w<m;w++)_[w]=0<u?y.i(w+p)>>>u|y.i(w+p+1)<<32-u:y.i(w+p);return new l(_,y.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=E,l.fromString=b,$i=l}).apply(typeof Is<"u"?Is:typeof self<"u"?self:typeof window<"u"?window:{});var dn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(n,s,a){return n==Array.prototype||n==Object.prototype||(n[s]=a.value),n};function t(n){n=[typeof globalThis=="object"&&globalThis,n,typeof window=="object"&&window,typeof self=="object"&&self,typeof dn=="object"&&dn];for(var s=0;s<n.length;++s){var a=n[s];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var r=t(this);function o(n,s){if(s)e:{var a=r;n=n.split(".");for(var h=0;h<n.length-1;h++){var v=n[h];if(!(v in a))break e;a=a[v]}n=n[n.length-1],h=a[n],s=s(h),s!=h&&s!=null&&e(a,n,{configurable:!0,writable:!0,value:s})}}function c(n,s){n instanceof String&&(n+="");var a=0,h=!1,v={next:function(){if(!h&&a<n.length){var I=a++;return{value:s(I,n[I]),done:!1}}return h=!0,{done:!0,value:void 0}}};return v[Symbol.iterator]=function(){return v},v}o("Array.prototype.values",function(n){return n||function(){return c(this,function(s,a){return a})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},f=this||self;function g(n){var s=typeof n;return s=s!="object"?s:n?Array.isArray(n)?"array":s:"null",s=="array"||s=="object"&&typeof n.length=="number"}function E(n){var s=typeof n;return s=="object"&&n!=null||s=="function"}function b(n,s,a){return n.call.apply(n.bind,arguments)}function S(n,s,a){if(!n)throw Error();if(2<arguments.length){var h=Array.prototype.slice.call(arguments,2);return function(){var v=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(v,h),n.apply(s,v)}}return function(){return n.apply(s,arguments)}}function T(n,s,a){return T=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?b:S,T.apply(null,arguments)}function L(n,s){var a=Array.prototype.slice.call(arguments,1);return function(){var h=a.slice();return h.push.apply(h,arguments),n.apply(this,h)}}function k(n,s){function a(){}a.prototype=s.prototype,n.aa=s.prototype,n.prototype=new a,n.prototype.constructor=n,n.Qb=function(h,v,I){for(var A=Array(arguments.length-2),F=2;F<arguments.length;F++)A[F-2]=arguments[F];return s.prototype[v].apply(h,A)}}function U(n){const s=n.length;if(0<s){const a=Array(s);for(let h=0;h<s;h++)a[h]=n[h];return a}return[]}function C(n,s){for(let a=1;a<arguments.length;a++){const h=arguments[a];if(g(h)){const v=n.length||0,I=h.length||0;n.length=v+I;for(let A=0;A<I;A++)n[v+A]=h[A]}else n.push(h)}}class z{constructor(s,a){this.i=s,this.j=a,this.h=0,this.g=null}get(){let s;return 0<this.h?(this.h--,s=this.g,this.g=s.next,s.next=null):s=this.i(),s}}function H(n){return/^[\s\xa0]*$/.test(n)}function x(){var n=f.navigator;return n&&(n=n.userAgent)?n:""}function V(n){return V[" "](n),n}V[" "]=function(){};var te=x().indexOf("Gecko")!=-1&&!(x().toLowerCase().indexOf("webkit")!=-1&&x().indexOf("Edge")==-1)&&!(x().indexOf("Trident")!=-1||x().indexOf("MSIE")!=-1)&&x().indexOf("Edge")==-1;function W(n,s,a){for(const h in n)s.call(a,n[h],h,n)}function y(n,s){for(const a in n)s.call(void 0,n[a],a,n)}function u(n){const s={};for(const a in n)s[a]=n[a];return s}const p="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function m(n,s){let a,h;for(let v=1;v<arguments.length;v++){h=arguments[v];for(a in h)n[a]=h[a];for(let I=0;I<p.length;I++)a=p[I],Object.prototype.hasOwnProperty.call(h,a)&&(n[a]=h[a])}}function _(n){var s=1;n=n.split(":");const a=[];for(;0<s&&n.length;)a.push(n.shift()),s--;return n.length&&a.push(n.join(":")),a}function w(n){f.setTimeout(()=>{throw n},0)}function d(){var n=Mn;let s=null;return n.g&&(s=n.g,n.g=n.g.next,n.g||(n.h=null),s.next=null),s}class we{constructor(){this.h=this.g=null}add(s,a){const h=mt.get();h.set(s,a),this.h?this.h.next=h:this.g=h,this.h=h}}var mt=new z(()=>new Go,n=>n.reset());class Go{constructor(){this.next=this.g=this.h=null}set(s,a){this.h=s,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let _t,yt=!1,Mn=new we,Ji=()=>{const n=f.Promise.resolve(void 0);_t=()=>{n.then(qo)}};var qo=()=>{for(var n;n=d();){try{n.h.call(n.g)}catch(a){w(a)}var s=mt;s.j(n),100>s.h&&(s.h++,n.next=s.g,s.g=n)}yt=!1};function Pe(){this.s=this.s,this.C=this.C}Pe.prototype.s=!1,Pe.prototype.ma=function(){this.s||(this.s=!0,this.N())},Pe.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function q(n,s){this.type=n,this.g=this.target=s,this.defaultPrevented=!1}q.prototype.h=function(){this.defaultPrevented=!0};var Ko=(function(){if(!f.addEventListener||!Object.defineProperty)return!1;var n=!1,s=Object.defineProperty({},"passive",{get:function(){n=!0}});try{const a=()=>{};f.addEventListener("test",a,s),f.removeEventListener("test",a,s)}catch{}return n})();function vt(n,s){if(q.call(this,n?n.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,n){var a=this.type=n.type,h=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:null;if(this.target=n.target||n.srcElement,this.g=s,s=n.relatedTarget){if(te){e:{try{V(s.nodeName);var v=!0;break e}catch{}v=!1}v||(s=null)}}else a=="mouseover"?s=n.fromElement:a=="mouseout"&&(s=n.toElement);this.relatedTarget=s,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=n.clientX!==void 0?n.clientX:n.pageX,this.clientY=n.clientY!==void 0?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0),this.button=n.button,this.key=n.key||"",this.ctrlKey=n.ctrlKey,this.altKey=n.altKey,this.shiftKey=n.shiftKey,this.metaKey=n.metaKey,this.pointerId=n.pointerId||0,this.pointerType=typeof n.pointerType=="string"?n.pointerType:Jo[n.pointerType]||"",this.state=n.state,this.i=n,n.defaultPrevented&&vt.aa.h.call(this)}}k(vt,q);var Jo={2:"touch",3:"pen",4:"mouse"};vt.prototype.h=function(){vt.aa.h.call(this);var n=this.i;n.preventDefault?n.preventDefault():n.returnValue=!1};var Kt="closure_listenable_"+(1e6*Math.random()|0),Xo=0;function Yo(n,s,a,h,v){this.listener=n,this.proxy=null,this.src=s,this.type=a,this.capture=!!h,this.ha=v,this.key=++Xo,this.da=this.fa=!1}function Jt(n){n.da=!0,n.listener=null,n.proxy=null,n.src=null,n.ha=null}function Xt(n){this.src=n,this.g={},this.h=0}Xt.prototype.add=function(n,s,a,h,v){var I=n.toString();n=this.g[I],n||(n=this.g[I]=[],this.h++);var A=xn(n,s,h,v);return-1<A?(s=n[A],a||(s.fa=!1)):(s=new Yo(s,this.src,I,!!h,v),s.fa=a,n.push(s)),s};function Un(n,s){var a=s.type;if(a in n.g){var h=n.g[a],v=Array.prototype.indexOf.call(h,s,void 0),I;(I=0<=v)&&Array.prototype.splice.call(h,v,1),I&&(Jt(s),n.g[a].length==0&&(delete n.g[a],n.h--))}}function xn(n,s,a,h){for(var v=0;v<n.length;++v){var I=n[v];if(!I.da&&I.listener==s&&I.capture==!!a&&I.ha==h)return v}return-1}var Fn="closure_lm_"+(1e6*Math.random()|0),Vn={};function Xi(n,s,a,h,v){if(Array.isArray(s)){for(var I=0;I<s.length;I++)Xi(n,s[I],a,h,v);return null}return a=Qi(a),n&&n[Kt]?n.K(s,a,E(h)?!!h.capture:!1,v):Zo(n,s,a,!1,h,v)}function Zo(n,s,a,h,v,I){if(!s)throw Error("Invalid event type");var A=E(v)?!!v.capture:!!v,F=Bn(n);if(F||(n[Fn]=F=new Xt(n)),a=F.add(s,a,h,A,I),a.proxy)return a;if(h=Qo(),a.proxy=h,h.src=n,h.listener=a,n.addEventListener)Ko||(v=A),v===void 0&&(v=!1),n.addEventListener(s.toString(),h,v);else if(n.attachEvent)n.attachEvent(Zi(s.toString()),h);else if(n.addListener&&n.removeListener)n.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return a}function Qo(){function n(a){return s.call(n.src,n.listener,a)}const s=ea;return n}function Yi(n,s,a,h,v){if(Array.isArray(s))for(var I=0;I<s.length;I++)Yi(n,s[I],a,h,v);else h=E(h)?!!h.capture:!!h,a=Qi(a),n&&n[Kt]?(n=n.i,s=String(s).toString(),s in n.g&&(I=n.g[s],a=xn(I,a,h,v),-1<a&&(Jt(I[a]),Array.prototype.splice.call(I,a,1),I.length==0&&(delete n.g[s],n.h--)))):n&&(n=Bn(n))&&(s=n.g[s.toString()],n=-1,s&&(n=xn(s,a,h,v)),(a=-1<n?s[n]:null)&&jn(a))}function jn(n){if(typeof n!="number"&&n&&!n.da){var s=n.src;if(s&&s[Kt])Un(s.i,n);else{var a=n.type,h=n.proxy;s.removeEventListener?s.removeEventListener(a,h,n.capture):s.detachEvent?s.detachEvent(Zi(a),h):s.addListener&&s.removeListener&&s.removeListener(h),(a=Bn(s))?(Un(a,n),a.h==0&&(a.src=null,s[Fn]=null)):Jt(n)}}}function Zi(n){return n in Vn?Vn[n]:Vn[n]="on"+n}function ea(n,s){if(n.da)n=!0;else{s=new vt(s,this);var a=n.listener,h=n.ha||n.src;n.fa&&jn(n),n=a.call(h,s)}return n}function Bn(n){return n=n[Fn],n instanceof Xt?n:null}var Hn="__closure_events_fn_"+(1e9*Math.random()>>>0);function Qi(n){return typeof n=="function"?n:(n[Hn]||(n[Hn]=function(s){return n.handleEvent(s)}),n[Hn])}function K(){Pe.call(this),this.i=new Xt(this),this.M=this,this.F=null}k(K,Pe),K.prototype[Kt]=!0,K.prototype.removeEventListener=function(n,s,a,h){Yi(this,n,s,a,h)};function Y(n,s){var a,h=n.F;if(h)for(a=[];h;h=h.F)a.push(h);if(n=n.M,h=s.type||s,typeof s=="string")s=new q(s,n);else if(s instanceof q)s.target=s.target||n;else{var v=s;s=new q(h,n),m(s,v)}if(v=!0,a)for(var I=a.length-1;0<=I;I--){var A=s.g=a[I];v=Yt(A,h,!0,s)&&v}if(A=s.g=n,v=Yt(A,h,!0,s)&&v,v=Yt(A,h,!1,s)&&v,a)for(I=0;I<a.length;I++)A=s.g=a[I],v=Yt(A,h,!1,s)&&v}K.prototype.N=function(){if(K.aa.N.call(this),this.i){var n=this.i,s;for(s in n.g){for(var a=n.g[s],h=0;h<a.length;h++)Jt(a[h]);delete n.g[s],n.h--}}this.F=null},K.prototype.K=function(n,s,a,h){return this.i.add(String(n),s,!1,a,h)},K.prototype.L=function(n,s,a,h){return this.i.add(String(n),s,!0,a,h)};function Yt(n,s,a,h){if(s=n.i.g[String(s)],!s)return!0;s=s.concat();for(var v=!0,I=0;I<s.length;++I){var A=s[I];if(A&&!A.da&&A.capture==a){var F=A.listener,G=A.ha||A.src;A.fa&&Un(n.i,A),v=F.call(G,h)!==!1&&v}}return v&&!h.defaultPrevented}function er(n,s,a){if(typeof n=="function")a&&(n=T(n,a));else if(n&&typeof n.handleEvent=="function")n=T(n.handleEvent,n);else throw Error("Invalid listener argument");return 2147483647<Number(s)?-1:f.setTimeout(n,s||0)}function tr(n){n.g=er(()=>{n.g=null,n.i&&(n.i=!1,tr(n))},n.l);const s=n.h;n.h=null,n.m.apply(null,s)}class ta extends Pe{constructor(s,a){super(),this.m=s,this.l=a,this.h=null,this.i=!1,this.g=null}j(s){this.h=arguments,this.g?this.i=!0:tr(this)}N(){super.N(),this.g&&(f.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function wt(n){Pe.call(this),this.h=n,this.g={}}k(wt,Pe);var nr=[];function ir(n){W(n.g,function(s,a){this.g.hasOwnProperty(a)&&jn(s)},n),n.g={}}wt.prototype.N=function(){wt.aa.N.call(this),ir(this)},wt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var $n=f.JSON.stringify,na=f.JSON.parse,ia=class{stringify(n){return f.JSON.stringify(n,void 0)}parse(n){return f.JSON.parse(n,void 0)}};function Wn(){}Wn.prototype.h=null;function rr(n){return n.h||(n.h=n.i())}function ra(){}var It={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function zn(){q.call(this,"d")}k(zn,q);function Gn(){q.call(this,"c")}k(Gn,q);var it={},sr=null;function qn(){return sr=sr||new K}it.La="serverreachability";function or(n){q.call(this,it.La,n)}k(or,q);function Et(n){const s=qn();Y(s,new or(s))}it.STAT_EVENT="statevent";function ar(n,s){q.call(this,it.STAT_EVENT,n),this.stat=s}k(ar,q);function Z(n){const s=qn();Y(s,new ar(s,n))}it.Ma="timingevent";function cr(n,s){q.call(this,it.Ma,n),this.size=s}k(cr,q);function Tt(n,s){if(typeof n!="function")throw Error("Fn must not be null and must be a function");return f.setTimeout(function(){n()},s)}function At(){this.g=!0}At.prototype.xa=function(){this.g=!1};function sa(n,s,a,h,v,I){n.info(function(){if(n.g)if(I)for(var A="",F=I.split("&"),G=0;G<F.length;G++){var D=F[G].split("=");if(1<D.length){var J=D[0];D=D[1];var X=J.split("_");A=2<=X.length&&X[1]=="type"?A+(J+"="+D+"&"):A+(J+"=redacted&")}}else A=null;else A=I;return"XMLHTTP REQ ("+h+") [attempt "+v+"]: "+s+`
`+a+`
`+A})}function oa(n,s,a,h,v,I,A){n.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+v+"]: "+s+`
`+a+`
`+I+" "+A})}function rt(n,s,a,h){n.info(function(){return"XMLHTTP TEXT ("+s+"): "+ca(n,a)+(h?" "+h:"")})}function aa(n,s){n.info(function(){return"TIMEOUT: "+s})}At.prototype.info=function(){};function ca(n,s){if(!n.g)return s;if(!s)return null;try{var a=JSON.parse(s);if(a){for(n=0;n<a.length;n++)if(Array.isArray(a[n])){var h=a[n];if(!(2>h.length)){var v=h[1];if(Array.isArray(v)&&!(1>v.length)){var I=v[0];if(I!="noop"&&I!="stop"&&I!="close")for(var A=1;A<v.length;A++)v[A]=""}}}}return $n(a)}catch{return s}}var Kn={NO_ERROR:0,TIMEOUT:8},ha={},Jn;function Zt(){}k(Zt,Wn),Zt.prototype.g=function(){return new XMLHttpRequest},Zt.prototype.i=function(){return{}},Jn=new Zt;function Oe(n,s,a,h){this.j=n,this.i=s,this.l=a,this.R=h||1,this.U=new wt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new hr}function hr(){this.i=null,this.g="",this.h=!1}var lr={},Xn={};function Yn(n,s,a){n.L=1,n.v=nn(Ie(s)),n.m=a,n.P=!0,ur(n,null)}function ur(n,s){n.F=Date.now(),Qt(n),n.A=Ie(n.v);var a=n.A,h=n.R;Array.isArray(h)||(h=[String(h)]),br(a.i,"t",h),n.C=0,a=n.j.J,n.h=new hr,n.g=$r(n.j,a?s:null,!n.m),0<n.O&&(n.M=new ta(T(n.Y,n,n.g),n.O)),s=n.U,a=n.g,h=n.ca;var v="readystatechange";Array.isArray(v)||(v&&(nr[0]=v.toString()),v=nr);for(var I=0;I<v.length;I++){var A=Xi(a,v[I],h||s.handleEvent,!1,s.h||s);if(!A)break;s.g[A.key]=A}s=n.H?u(n.H):{},n.m?(n.u||(n.u="POST"),s["Content-Type"]="application/x-www-form-urlencoded",n.g.ea(n.A,n.u,n.m,s)):(n.u="GET",n.g.ea(n.A,n.u,null,s)),Et(),sa(n.i,n.u,n.A,n.l,n.R,n.m)}Oe.prototype.ca=function(n){n=n.target;const s=this.M;s&&Ee(n)==3?s.j():this.Y(n)},Oe.prototype.Y=function(n){try{if(n==this.g)e:{const X=Ee(this.g);var s=this.g.Ba();const at=this.g.Z();if(!(3>X)&&(X!=3||this.g&&(this.h.h||this.g.oa()||Nr(this.g)))){this.J||X!=4||s==7||(s==8||0>=at?Et(3):Et(2)),Zn(this);var a=this.g.Z();this.X=a;t:if(dr(this)){var h=Nr(this.g);n="";var v=h.length,I=Ee(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Be(this),bt(this);var A="";break t}this.h.i=new f.TextDecoder}for(s=0;s<v;s++)this.h.h=!0,n+=this.h.i.decode(h[s],{stream:!(I&&s==v-1)});h.length=0,this.h.g+=n,this.C=0,A=this.h.g}else A=this.g.oa();if(this.o=a==200,oa(this.i,this.u,this.A,this.l,this.R,X,a),this.o){if(this.T&&!this.K){t:{if(this.g){var F,G=this.g;if((F=G.g?G.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!H(F)){var D=F;break t}}D=null}if(a=D)rt(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Qn(this,a);else{this.o=!1,this.s=3,Z(12),Be(this),bt(this);break e}}if(this.P){a=!0;let re;for(;!this.J&&this.C<A.length;)if(re=la(this,A),re==Xn){X==4&&(this.s=4,Z(14),a=!1),rt(this.i,this.l,null,"[Incomplete Response]");break}else if(re==lr){this.s=4,Z(15),rt(this.i,this.l,A,"[Invalid Chunk]"),a=!1;break}else rt(this.i,this.l,re,null),Qn(this,re);if(dr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),X!=4||A.length!=0||this.h.h||(this.s=1,Z(16),a=!1),this.o=this.o&&a,!a)rt(this.i,this.l,A,"[Invalid Chunked Response]"),Be(this),bt(this);else if(0<A.length&&!this.W){this.W=!0;var J=this.j;J.g==this&&J.ba&&!J.M&&(J.j.info("Great, no buffering proxy detected. Bytes received: "+A.length),si(J),J.M=!0,Z(11))}}else rt(this.i,this.l,A,null),Qn(this,A);X==4&&Be(this),this.o&&!this.J&&(X==4?Vr(this.j,this):(this.o=!1,Qt(this)))}else Ra(this.g),a==400&&0<A.indexOf("Unknown SID")?(this.s=3,Z(12)):(this.s=0,Z(13)),Be(this),bt(this)}}}catch{}finally{}};function dr(n){return n.g?n.u=="GET"&&n.L!=2&&n.j.Ca:!1}function la(n,s){var a=n.C,h=s.indexOf(`
`,a);return h==-1?Xn:(a=Number(s.substring(a,h)),isNaN(a)?lr:(h+=1,h+a>s.length?Xn:(s=s.slice(h,h+a),n.C=h+a,s)))}Oe.prototype.cancel=function(){this.J=!0,Be(this)};function Qt(n){n.S=Date.now()+n.I,fr(n,n.I)}function fr(n,s){if(n.B!=null)throw Error("WatchDog timer not null");n.B=Tt(T(n.ba,n),s)}function Zn(n){n.B&&(f.clearTimeout(n.B),n.B=null)}Oe.prototype.ba=function(){this.B=null;const n=Date.now();0<=n-this.S?(aa(this.i,this.A),this.L!=2&&(Et(),Z(17)),Be(this),this.s=2,bt(this)):fr(this,this.S-n)};function bt(n){n.j.G==0||n.J||Vr(n.j,n)}function Be(n){Zn(n);var s=n.M;s&&typeof s.ma=="function"&&s.ma(),n.M=null,ir(n.U),n.g&&(s=n.g,n.g=null,s.abort(),s.ma())}function Qn(n,s){try{var a=n.j;if(a.G!=0&&(a.g==n||ei(a.h,n))){if(!n.K&&ei(a.h,n)&&a.G==3){try{var h=a.Da.g.parse(s)}catch{h=null}if(Array.isArray(h)&&h.length==3){var v=h;if(v[0]==0){e:if(!a.u){if(a.g)if(a.g.F+3e3<n.F)hn(a),an(a);else break e;ri(a),Z(18)}}else a.za=v[1],0<a.za-a.T&&37500>v[2]&&a.F&&a.v==0&&!a.C&&(a.C=Tt(T(a.Za,a),6e3));if(1>=mr(a.h)&&a.ca){try{a.ca()}catch{}a.ca=void 0}}else $e(a,11)}else if((n.K||a.g==n)&&hn(a),!H(s))for(v=a.Da.g.parse(s),s=0;s<v.length;s++){let D=v[s];if(a.T=D[0],D=D[1],a.G==2)if(D[0]=="c"){a.K=D[1],a.ia=D[2];const J=D[3];J!=null&&(a.la=J,a.j.info("VER="+a.la));const X=D[4];X!=null&&(a.Aa=X,a.j.info("SVER="+a.Aa));const at=D[5];at!=null&&typeof at=="number"&&0<at&&(h=1.5*at,a.L=h,a.j.info("backChannelRequestTimeoutMs_="+h)),h=a;const re=n.g;if(re){const ln=re.g?re.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ln){var I=h.h;I.g||ln.indexOf("spdy")==-1&&ln.indexOf("quic")==-1&&ln.indexOf("h2")==-1||(I.j=I.l,I.g=new Set,I.h&&(ti(I,I.h),I.h=null))}if(h.D){const oi=re.g?re.g.getResponseHeader("X-HTTP-Session-Id"):null;oi&&(h.ya=oi,j(h.I,h.D,oi))}}a.G=3,a.l&&a.l.ua(),a.ba&&(a.R=Date.now()-n.F,a.j.info("Handshake RTT: "+a.R+"ms")),h=a;var A=n;if(h.qa=Hr(h,h.J?h.ia:null,h.W),A.K){_r(h.h,A);var F=A,G=h.L;G&&(F.I=G),F.B&&(Zn(F),Qt(F)),h.g=A}else xr(h);0<a.i.length&&cn(a)}else D[0]!="stop"&&D[0]!="close"||$e(a,7);else a.G==3&&(D[0]=="stop"||D[0]=="close"?D[0]=="stop"?$e(a,7):ii(a):D[0]!="noop"&&a.l&&a.l.ta(D),a.v=0)}}Et(4)}catch{}}var ua=class{constructor(n,s){this.g=n,this.map=s}};function pr(n){this.l=n||10,f.PerformanceNavigationTiming?(n=f.performance.getEntriesByType("navigation"),n=0<n.length&&(n[0].nextHopProtocol=="hq"||n[0].nextHopProtocol=="h2")):n=!!(f.chrome&&f.chrome.loadTimes&&f.chrome.loadTimes()&&f.chrome.loadTimes().wasFetchedViaSpdy),this.j=n?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function gr(n){return n.h?!0:n.g?n.g.size>=n.j:!1}function mr(n){return n.h?1:n.g?n.g.size:0}function ei(n,s){return n.h?n.h==s:n.g?n.g.has(s):!1}function ti(n,s){n.g?n.g.add(s):n.h=s}function _r(n,s){n.h&&n.h==s?n.h=null:n.g&&n.g.has(s)&&n.g.delete(s)}pr.prototype.cancel=function(){if(this.i=yr(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const n of this.g.values())n.cancel();this.g.clear()}};function yr(n){if(n.h!=null)return n.i.concat(n.h.D);if(n.g!=null&&n.g.size!==0){let s=n.i;for(const a of n.g.values())s=s.concat(a.D);return s}return U(n.i)}function da(n){if(n.V&&typeof n.V=="function")return n.V();if(typeof Map<"u"&&n instanceof Map||typeof Set<"u"&&n instanceof Set)return Array.from(n.values());if(typeof n=="string")return n.split("");if(g(n)){for(var s=[],a=n.length,h=0;h<a;h++)s.push(n[h]);return s}s=[],a=0;for(h in n)s[a++]=n[h];return s}function fa(n){if(n.na&&typeof n.na=="function")return n.na();if(!n.V||typeof n.V!="function"){if(typeof Map<"u"&&n instanceof Map)return Array.from(n.keys());if(!(typeof Set<"u"&&n instanceof Set)){if(g(n)||typeof n=="string"){var s=[];n=n.length;for(var a=0;a<n;a++)s.push(a);return s}s=[],a=0;for(const h in n)s[a++]=h;return s}}}function vr(n,s){if(n.forEach&&typeof n.forEach=="function")n.forEach(s,void 0);else if(g(n)||typeof n=="string")Array.prototype.forEach.call(n,s,void 0);else for(var a=fa(n),h=da(n),v=h.length,I=0;I<v;I++)s.call(void 0,h[I],a&&a[I],n)}var wr=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function pa(n,s){if(n){n=n.split("&");for(var a=0;a<n.length;a++){var h=n[a].indexOf("="),v=null;if(0<=h){var I=n[a].substring(0,h);v=n[a].substring(h+1)}else I=n[a];s(I,v?decodeURIComponent(v.replace(/\+/g," ")):"")}}}function He(n){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,n instanceof He){this.h=n.h,en(this,n.j),this.o=n.o,this.g=n.g,tn(this,n.s),this.l=n.l;var s=n.i,a=new kt;a.i=s.i,s.g&&(a.g=new Map(s.g),a.h=s.h),Ir(this,a),this.m=n.m}else n&&(s=String(n).match(wr))?(this.h=!1,en(this,s[1]||"",!0),this.o=St(s[2]||""),this.g=St(s[3]||"",!0),tn(this,s[4]),this.l=St(s[5]||"",!0),Ir(this,s[6]||"",!0),this.m=St(s[7]||"")):(this.h=!1,this.i=new kt(null,this.h))}He.prototype.toString=function(){var n=[],s=this.j;s&&n.push(Rt(s,Er,!0),":");var a=this.g;return(a||s=="file")&&(n.push("//"),(s=this.o)&&n.push(Rt(s,Er,!0),"@"),n.push(encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.s,a!=null&&n.push(":",String(a))),(a=this.l)&&(this.g&&a.charAt(0)!="/"&&n.push("/"),n.push(Rt(a,a.charAt(0)=="/"?_a:ma,!0))),(a=this.i.toString())&&n.push("?",a),(a=this.m)&&n.push("#",Rt(a,va)),n.join("")};function Ie(n){return new He(n)}function en(n,s,a){n.j=a?St(s,!0):s,n.j&&(n.j=n.j.replace(/:$/,""))}function tn(n,s){if(s){if(s=Number(s),isNaN(s)||0>s)throw Error("Bad port number "+s);n.s=s}else n.s=null}function Ir(n,s,a){s instanceof kt?(n.i=s,wa(n.i,n.h)):(a||(s=Rt(s,ya)),n.i=new kt(s,n.h))}function j(n,s,a){n.i.set(s,a)}function nn(n){return j(n,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),n}function St(n,s){return n?s?decodeURI(n.replace(/%25/g,"%2525")):decodeURIComponent(n):""}function Rt(n,s,a){return typeof n=="string"?(n=encodeURI(n).replace(s,ga),a&&(n=n.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n):null}function ga(n){return n=n.charCodeAt(0),"%"+(n>>4&15).toString(16)+(n&15).toString(16)}var Er=/[#\/\?@]/g,ma=/[#\?:]/g,_a=/[#\?]/g,ya=/[#\?@]/g,va=/#/g;function kt(n,s){this.h=this.g=null,this.i=n||null,this.j=!!s}function Ne(n){n.g||(n.g=new Map,n.h=0,n.i&&pa(n.i,function(s,a){n.add(decodeURIComponent(s.replace(/\+/g," ")),a)}))}i=kt.prototype,i.add=function(n,s){Ne(this),this.i=null,n=st(this,n);var a=this.g.get(n);return a||this.g.set(n,a=[]),a.push(s),this.h+=1,this};function Tr(n,s){Ne(n),s=st(n,s),n.g.has(s)&&(n.i=null,n.h-=n.g.get(s).length,n.g.delete(s))}function Ar(n,s){return Ne(n),s=st(n,s),n.g.has(s)}i.forEach=function(n,s){Ne(this),this.g.forEach(function(a,h){a.forEach(function(v){n.call(s,v,h,this)},this)},this)},i.na=function(){Ne(this);const n=Array.from(this.g.values()),s=Array.from(this.g.keys()),a=[];for(let h=0;h<s.length;h++){const v=n[h];for(let I=0;I<v.length;I++)a.push(s[h])}return a},i.V=function(n){Ne(this);let s=[];if(typeof n=="string")Ar(this,n)&&(s=s.concat(this.g.get(st(this,n))));else{n=Array.from(this.g.values());for(let a=0;a<n.length;a++)s=s.concat(n[a])}return s},i.set=function(n,s){return Ne(this),this.i=null,n=st(this,n),Ar(this,n)&&(this.h-=this.g.get(n).length),this.g.set(n,[s]),this.h+=1,this},i.get=function(n,s){return n?(n=this.V(n),0<n.length?String(n[0]):s):s};function br(n,s,a){Tr(n,s),0<a.length&&(n.i=null,n.g.set(st(n,s),U(a)),n.h+=a.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const n=[],s=Array.from(this.g.keys());for(var a=0;a<s.length;a++){var h=s[a];const I=encodeURIComponent(String(h)),A=this.V(h);for(h=0;h<A.length;h++){var v=I;A[h]!==""&&(v+="="+encodeURIComponent(String(A[h]))),n.push(v)}}return this.i=n.join("&")};function st(n,s){return s=String(s),n.j&&(s=s.toLowerCase()),s}function wa(n,s){s&&!n.j&&(Ne(n),n.i=null,n.g.forEach(function(a,h){var v=h.toLowerCase();h!=v&&(Tr(this,h),br(this,v,a))},n)),n.j=s}function Ia(n,s){const a=new At;if(f.Image){const h=new Image;h.onload=L(De,a,"TestLoadImage: loaded",!0,s,h),h.onerror=L(De,a,"TestLoadImage: error",!1,s,h),h.onabort=L(De,a,"TestLoadImage: abort",!1,s,h),h.ontimeout=L(De,a,"TestLoadImage: timeout",!1,s,h),f.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=n}else s(!1)}function Ea(n,s){const a=new At,h=new AbortController,v=setTimeout(()=>{h.abort(),De(a,"TestPingServer: timeout",!1,s)},1e4);fetch(n,{signal:h.signal}).then(I=>{clearTimeout(v),I.ok?De(a,"TestPingServer: ok",!0,s):De(a,"TestPingServer: server error",!1,s)}).catch(()=>{clearTimeout(v),De(a,"TestPingServer: error",!1,s)})}function De(n,s,a,h,v){try{v&&(v.onload=null,v.onerror=null,v.onabort=null,v.ontimeout=null),h(a)}catch{}}function Ta(){this.g=new ia}function Aa(n,s,a){const h=a||"";try{vr(n,function(v,I){let A=v;E(v)&&(A=$n(v)),s.push(h+I+"="+encodeURIComponent(A))})}catch(v){throw s.push(h+"type="+encodeURIComponent("_badmap")),v}}function rn(n){this.l=n.Ub||null,this.j=n.eb||!1}k(rn,Wn),rn.prototype.g=function(){return new sn(this.l,this.j)},rn.prototype.i=(function(n){return function(){return n}})({});function sn(n,s){K.call(this),this.D=n,this.o=s,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}k(sn,K),i=sn.prototype,i.open=function(n,s){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=n,this.A=s,this.readyState=1,Pt(this)},i.send=function(n){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const s={headers:this.u,method:this.B,credentials:this.m,cache:void 0};n&&(s.body=n),(this.D||f).fetch(new Request(this.A,s)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Ct(this)),this.readyState=0},i.Sa=function(n){if(this.g&&(this.l=n,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=n.headers,this.readyState=2,Pt(this)),this.g&&(this.readyState=3,Pt(this),this.g)))if(this.responseType==="arraybuffer")n.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof f.ReadableStream<"u"&&"body"in n){if(this.j=n.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Sr(this)}else n.text().then(this.Ra.bind(this),this.ga.bind(this))};function Sr(n){n.j.read().then(n.Pa.bind(n)).catch(n.ga.bind(n))}i.Pa=function(n){if(this.g){if(this.o&&n.value)this.response.push(n.value);else if(!this.o){var s=n.value?n.value:new Uint8Array(0);(s=this.v.decode(s,{stream:!n.done}))&&(this.response=this.responseText+=s)}n.done?Ct(this):Pt(this),this.readyState==3&&Sr(this)}},i.Ra=function(n){this.g&&(this.response=this.responseText=n,Ct(this))},i.Qa=function(n){this.g&&(this.response=n,Ct(this))},i.ga=function(){this.g&&Ct(this)};function Ct(n){n.readyState=4,n.l=null,n.j=null,n.v=null,Pt(n)}i.setRequestHeader=function(n,s){this.u.append(n,s)},i.getResponseHeader=function(n){return this.h&&this.h.get(n.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const n=[],s=this.h.entries();for(var a=s.next();!a.done;)a=a.value,n.push(a[0]+": "+a[1]),a=s.next();return n.join(`\r
`)};function Pt(n){n.onreadystatechange&&n.onreadystatechange.call(n)}Object.defineProperty(sn.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(n){this.m=n?"include":"same-origin"}});function Rr(n){let s="";return W(n,function(a,h){s+=h,s+=":",s+=a,s+=`\r
`}),s}function ni(n,s,a){e:{for(h in a){var h=!1;break e}h=!0}h||(a=Rr(a),typeof n=="string"?a!=null&&encodeURIComponent(String(a)):j(n,s,a))}function B(n){K.call(this),this.headers=new Map,this.o=n||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}k(B,K);var ba=/^https?$/i,Sa=["POST","PUT"];i=B.prototype,i.Ha=function(n){this.J=n},i.ea=function(n,s,a,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+n);s=s?s.toUpperCase():"GET",this.D=n,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Jn.g(),this.v=this.o?rr(this.o):rr(Jn),this.g.onreadystatechange=T(this.Ea,this);try{this.B=!0,this.g.open(s,String(n),!0),this.B=!1}catch(I){kr(this,I);return}if(n=a||"",a=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var v in h)a.set(v,h[v]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const I of h.keys())a.set(I,h.get(I));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(a.keys()).find(I=>I.toLowerCase()=="content-type"),v=f.FormData&&n instanceof f.FormData,!(0<=Array.prototype.indexOf.call(Sa,s,void 0))||h||v||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[I,A]of a)this.g.setRequestHeader(I,A);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Or(this),this.u=!0,this.g.send(n),this.u=!1}catch(I){kr(this,I)}};function kr(n,s){n.h=!1,n.g&&(n.j=!0,n.g.abort(),n.j=!1),n.l=s,n.m=5,Cr(n),on(n)}function Cr(n){n.A||(n.A=!0,Y(n,"complete"),Y(n,"error"))}i.abort=function(n){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=n||7,Y(this,"complete"),Y(this,"abort"),on(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),on(this,!0)),B.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?Pr(this):this.bb())},i.bb=function(){Pr(this)};function Pr(n){if(n.h&&typeof l<"u"&&(!n.v[1]||Ee(n)!=4||n.Z()!=2)){if(n.u&&Ee(n)==4)er(n.Ea,0,n);else if(Y(n,"readystatechange"),Ee(n)==4){n.h=!1;try{const A=n.Z();e:switch(A){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var s=!0;break e;default:s=!1}var a;if(!(a=s)){var h;if(h=A===0){var v=String(n.D).match(wr)[1]||null;!v&&f.self&&f.self.location&&(v=f.self.location.protocol.slice(0,-1)),h=!ba.test(v?v.toLowerCase():"")}a=h}if(a)Y(n,"complete"),Y(n,"success");else{n.m=6;try{var I=2<Ee(n)?n.g.statusText:""}catch{I=""}n.l=I+" ["+n.Z()+"]",Cr(n)}}finally{on(n)}}}}function on(n,s){if(n.g){Or(n);const a=n.g,h=n.v[0]?()=>{}:null;n.g=null,n.v=null,s||Y(n,"ready");try{a.onreadystatechange=h}catch{}}}function Or(n){n.I&&(f.clearTimeout(n.I),n.I=null)}i.isActive=function(){return!!this.g};function Ee(n){return n.g?n.g.readyState:0}i.Z=function(){try{return 2<Ee(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(n){if(this.g){var s=this.g.responseText;return n&&s.indexOf(n)==0&&(s=s.substring(n.length)),na(s)}};function Nr(n){try{if(!n.g)return null;if("response"in n.g)return n.g.response;switch(n.H){case"":case"text":return n.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in n.g)return n.g.mozResponseArrayBuffer}return null}catch{return null}}function Ra(n){const s={};n=(n.g&&2<=Ee(n)&&n.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<n.length;h++){if(H(n[h]))continue;var a=_(n[h]);const v=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const I=s[v]||[];s[v]=I,I.push(a)}y(s,function(h){return h.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ot(n,s,a){return a&&a.internalChannelParams&&a.internalChannelParams[n]||s}function Dr(n){this.Aa=0,this.i=[],this.j=new At,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ot("failFast",!1,n),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ot("baseRetryDelayMs",5e3,n),this.cb=Ot("retryDelaySeedMs",1e4,n),this.Wa=Ot("forwardChannelMaxRetries",2,n),this.wa=Ot("forwardChannelRequestTimeoutMs",2e4,n),this.pa=n&&n.xmlHttpFactory||void 0,this.Xa=n&&n.Tb||void 0,this.Ca=n&&n.useFetchStreams||!1,this.L=void 0,this.J=n&&n.supportsCrossDomainXhr||!1,this.K="",this.h=new pr(n&&n.concurrentRequestLimit),this.Da=new Ta,this.P=n&&n.fastHandshake||!1,this.O=n&&n.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=n&&n.Rb||!1,n&&n.xa&&this.j.xa(),n&&n.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&n&&n.detectBufferingProxy||!1,this.ja=void 0,n&&n.longPollingTimeout&&0<n.longPollingTimeout&&(this.ja=n.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=Dr.prototype,i.la=8,i.G=1,i.connect=function(n,s,a,h){Z(0),this.W=n,this.H=s||{},a&&h!==void 0&&(this.H.OSID=a,this.H.OAID=h),this.F=this.X,this.I=Hr(this,null,this.W),cn(this)};function ii(n){if(Lr(n),n.G==3){var s=n.U++,a=Ie(n.I);if(j(a,"SID",n.K),j(a,"RID",s),j(a,"TYPE","terminate"),Nt(n,a),s=new Oe(n,n.j,s),s.L=2,s.v=nn(Ie(a)),a=!1,f.navigator&&f.navigator.sendBeacon)try{a=f.navigator.sendBeacon(s.v.toString(),"")}catch{}!a&&f.Image&&(new Image().src=s.v,a=!0),a||(s.g=$r(s.j,null),s.g.ea(s.v)),s.F=Date.now(),Qt(s)}Br(n)}function an(n){n.g&&(si(n),n.g.cancel(),n.g=null)}function Lr(n){an(n),n.u&&(f.clearTimeout(n.u),n.u=null),hn(n),n.h.cancel(),n.s&&(typeof n.s=="number"&&f.clearTimeout(n.s),n.s=null)}function cn(n){if(!gr(n.h)&&!n.s){n.s=!0;var s=n.Ga;_t||Ji(),yt||(_t(),yt=!0),Mn.add(s,n),n.B=0}}function ka(n,s){return mr(n.h)>=n.h.j-(n.s?1:0)?!1:n.s?(n.i=s.D.concat(n.i),!0):n.G==1||n.G==2||n.B>=(n.Va?0:n.Wa)?!1:(n.s=Tt(T(n.Ga,n,s),jr(n,n.B)),n.B++,!0)}i.Ga=function(n){if(this.s)if(this.s=null,this.G==1){if(!n){this.U=Math.floor(1e5*Math.random()),n=this.U++;const v=new Oe(this,this.j,n);let I=this.o;if(this.S&&(I?(I=u(I),m(I,this.S)):I=this.S),this.m!==null||this.O||(v.H=I,I=null),this.P)e:{for(var s=0,a=0;a<this.i.length;a++){t:{var h=this.i[a];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break t}h=void 0}if(h===void 0)break;if(s+=h,4096<s){s=a;break e}if(s===4096||a===this.i.length-1){s=a+1;break e}}s=1e3}else s=1e3;s=Ur(this,v,s),a=Ie(this.I),j(a,"RID",n),j(a,"CVER",22),this.D&&j(a,"X-HTTP-Session-Id",this.D),Nt(this,a),I&&(this.O?s="headers="+encodeURIComponent(String(Rr(I)))+"&"+s:this.m&&ni(a,this.m,I)),ti(this.h,v),this.Ua&&j(a,"TYPE","init"),this.P?(j(a,"$req",s),j(a,"SID","null"),v.T=!0,Yn(v,a,null)):Yn(v,a,s),this.G=2}}else this.G==3&&(n?Mr(this,n):this.i.length==0||gr(this.h)||Mr(this))};function Mr(n,s){var a;s?a=s.l:a=n.U++;const h=Ie(n.I);j(h,"SID",n.K),j(h,"RID",a),j(h,"AID",n.T),Nt(n,h),n.m&&n.o&&ni(h,n.m,n.o),a=new Oe(n,n.j,a,n.B+1),n.m===null&&(a.H=n.o),s&&(n.i=s.D.concat(n.i)),s=Ur(n,a,1e3),a.I=Math.round(.5*n.wa)+Math.round(.5*n.wa*Math.random()),ti(n.h,a),Yn(a,h,s)}function Nt(n,s){n.H&&W(n.H,function(a,h){j(s,h,a)}),n.l&&vr({},function(a,h){j(s,h,a)})}function Ur(n,s,a){a=Math.min(n.i.length,a);var h=n.l?T(n.l.Na,n.l,n):null;e:{var v=n.i;let I=-1;for(;;){const A=["count="+a];I==-1?0<a?(I=v[0].g,A.push("ofs="+I)):I=0:A.push("ofs="+I);let F=!0;for(let G=0;G<a;G++){let D=v[G].g;const J=v[G].map;if(D-=I,0>D)I=Math.max(0,v[G].g-100),F=!1;else try{Aa(J,A,"req"+D+"_")}catch{h&&h(J)}}if(F){h=A.join("&");break e}}}return n=n.i.splice(0,a),s.D=n,h}function xr(n){if(!n.g&&!n.u){n.Y=1;var s=n.Fa;_t||Ji(),yt||(_t(),yt=!0),Mn.add(s,n),n.v=0}}function ri(n){return n.g||n.u||3<=n.v?!1:(n.Y++,n.u=Tt(T(n.Fa,n),jr(n,n.v)),n.v++,!0)}i.Fa=function(){if(this.u=null,Fr(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var n=2*this.R;this.j.info("BP detection timer enabled: "+n),this.A=Tt(T(this.ab,this),n)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Z(10),an(this),Fr(this))};function si(n){n.A!=null&&(f.clearTimeout(n.A),n.A=null)}function Fr(n){n.g=new Oe(n,n.j,"rpc",n.Y),n.m===null&&(n.g.H=n.o),n.g.O=0;var s=Ie(n.qa);j(s,"RID","rpc"),j(s,"SID",n.K),j(s,"AID",n.T),j(s,"CI",n.F?"0":"1"),!n.F&&n.ja&&j(s,"TO",n.ja),j(s,"TYPE","xmlhttp"),Nt(n,s),n.m&&n.o&&ni(s,n.m,n.o),n.L&&(n.g.I=n.L);var a=n.g;n=n.ia,a.L=1,a.v=nn(Ie(s)),a.m=null,a.P=!0,ur(a,n)}i.Za=function(){this.C!=null&&(this.C=null,an(this),ri(this),Z(19))};function hn(n){n.C!=null&&(f.clearTimeout(n.C),n.C=null)}function Vr(n,s){var a=null;if(n.g==s){hn(n),si(n),n.g=null;var h=2}else if(ei(n.h,s))a=s.D,_r(n.h,s),h=1;else return;if(n.G!=0){if(s.o)if(h==1){a=s.m?s.m.length:0,s=Date.now()-s.F;var v=n.B;h=qn(),Y(h,new cr(h,a)),cn(n)}else xr(n);else if(v=s.s,v==3||v==0&&0<s.X||!(h==1&&ka(n,s)||h==2&&ri(n)))switch(a&&0<a.length&&(s=n.h,s.i=s.i.concat(a)),v){case 1:$e(n,5);break;case 4:$e(n,10);break;case 3:$e(n,6);break;default:$e(n,2)}}}function jr(n,s){let a=n.Ta+Math.floor(Math.random()*n.cb);return n.isActive()||(a*=2),a*s}function $e(n,s){if(n.j.info("Error code "+s),s==2){var a=T(n.fb,n),h=n.Xa;const v=!h;h=new He(h||"//www.google.com/images/cleardot.gif"),f.location&&f.location.protocol=="http"||en(h,"https"),nn(h),v?Ia(h.toString(),a):Ea(h.toString(),a)}else Z(2);n.G=0,n.l&&n.l.sa(s),Br(n),Lr(n)}i.fb=function(n){n?(this.j.info("Successfully pinged google.com"),Z(2)):(this.j.info("Failed to ping google.com"),Z(1))};function Br(n){if(n.G=0,n.ka=[],n.l){const s=yr(n.h);(s.length!=0||n.i.length!=0)&&(C(n.ka,s),C(n.ka,n.i),n.h.i.length=0,U(n.i),n.i.length=0),n.l.ra()}}function Hr(n,s,a){var h=a instanceof He?Ie(a):new He(a);if(h.g!="")s&&(h.g=s+"."+h.g),tn(h,h.s);else{var v=f.location;h=v.protocol,s=s?s+"."+v.hostname:v.hostname,v=+v.port;var I=new He(null);h&&en(I,h),s&&(I.g=s),v&&tn(I,v),a&&(I.l=a),h=I}return a=n.D,s=n.ya,a&&s&&j(h,a,s),j(h,"VER",n.la),Nt(n,h),h}function $r(n,s,a){if(s&&!n.J)throw Error("Can't create secondary domain capable XhrIo object.");return s=n.Ca&&!n.pa?new B(new rn({eb:a})):new B(n.pa),s.Ha(n.J),s}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Wr(){}i=Wr.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function ne(n,s){K.call(this),this.g=new Dr(s),this.l=n,this.h=s&&s.messageUrlParams||null,n=s&&s.messageHeaders||null,s&&s.clientProtocolHeaderRequired&&(n?n["X-Client-Protocol"]="webchannel":n={"X-Client-Protocol":"webchannel"}),this.g.o=n,n=s&&s.initMessageHeaders||null,s&&s.messageContentType&&(n?n["X-WebChannel-Content-Type"]=s.messageContentType:n={"X-WebChannel-Content-Type":s.messageContentType}),s&&s.va&&(n?n["X-WebChannel-Client-Profile"]=s.va:n={"X-WebChannel-Client-Profile":s.va}),this.g.S=n,(n=s&&s.Sb)&&!H(n)&&(this.g.m=n),this.v=s&&s.supportsCrossDomainXhr||!1,this.u=s&&s.sendRawJson||!1,(s=s&&s.httpSessionIdParam)&&!H(s)&&(this.g.D=s,n=this.h,n!==null&&s in n&&(n=this.h,s in n&&delete n[s])),this.j=new ot(this)}k(ne,K),ne.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ne.prototype.close=function(){ii(this.g)},ne.prototype.o=function(n){var s=this.g;if(typeof n=="string"){var a={};a.__data__=n,n=a}else this.u&&(a={},a.__data__=$n(n),n=a);s.i.push(new ua(s.Ya++,n)),s.G==3&&cn(s)},ne.prototype.N=function(){this.g.l=null,delete this.j,ii(this.g),delete this.g,ne.aa.N.call(this)};function zr(n){zn.call(this),n.__headers__&&(this.headers=n.__headers__,this.statusCode=n.__status__,delete n.__headers__,delete n.__status__);var s=n.__sm__;if(s){e:{for(const a in s){n=a;break e}n=void 0}(this.i=n)&&(n=this.i,s=s!==null&&n in s?s[n]:void 0),this.data=s}else this.data=n}k(zr,zn);function Gr(){Gn.call(this),this.status=1}k(Gr,Gn);function ot(n){this.g=n}k(ot,Wr),ot.prototype.ua=function(){Y(this.g,"a")},ot.prototype.ta=function(n){Y(this.g,new zr(n))},ot.prototype.sa=function(n){Y(this.g,new Gr)},ot.prototype.ra=function(){Y(this.g,"b")},ne.prototype.send=ne.prototype.o,ne.prototype.open=ne.prototype.m,ne.prototype.close=ne.prototype.close,Kn.NO_ERROR=0,Kn.TIMEOUT=8,Kn.HTTP_ERROR=6,ha.COMPLETE="complete",ra.EventType=It,It.OPEN="a",It.CLOSE="b",It.ERROR="c",It.MESSAGE="d",K.prototype.listen=K.prototype.K,B.prototype.listenOnce=B.prototype.L,B.prototype.getLastError=B.prototype.Ka,B.prototype.getLastErrorCode=B.prototype.Ba,B.prototype.getStatus=B.prototype.Z,B.prototype.getResponseJson=B.prototype.Oa,B.prototype.getResponseText=B.prototype.oa,B.prototype.send=B.prototype.ea,B.prototype.setWithCredentials=B.prototype.Ha}).apply(typeof dn<"u"?dn:typeof self<"u"?self:typeof window<"u"?window:{});const Es="@firebase/firestore",Ts="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Q.UNAUTHENTICATED=new Q(null),Q.GOOGLE_CREDENTIALS=new Q("google-credentials-uid"),Q.FIRST_PARTY=new Q("first-party-uid"),Q.MOCK_USER=new Q("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gt="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ft=new Pi("@firebase/firestore");function ae(i,...e){if(ft.logLevel<=M.DEBUG){const t=e.map(Wi);ft.debug(`Firestore (${Gt}): ${i}`,...t)}}function Mo(i,...e){if(ft.logLevel<=M.ERROR){const t=e.map(Wi);ft.error(`Firestore (${Gt}): ${i}`,...t)}}function uu(i,...e){if(ft.logLevel<=M.WARN){const t=e.map(Wi);ft.warn(`Firestore (${Gt}): ${i}`,...t)}}function Wi(i){if(typeof i=="string")return i;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(i,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Uo(i,r,t)}function Uo(i,e,t){let r=`FIRESTORE (${Gt}) INTERNAL ASSERTION FAILED: ${e} (ID: ${i.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Mo(r),new Error(r)}function Mt(i,e,t,r){let o="Unexpected state";typeof t=="string"?o=t:r=t,i||Uo(e,o,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class N extends ye{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xo{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class du{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Q.UNAUTHENTICATED)))}shutdown(){}}class fu{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class pu{constructor(e){this.t=e,this.currentUser=Q.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Mt(this.o===void 0,42304);let r=this.i;const o=g=>this.i!==r?(r=this.i,t(g)):Promise.resolve();let c=new Ut;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new Ut,e.enqueueRetryable((()=>o(this.currentUser)))};const l=()=>{const g=c;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},f=g=>{ae("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit((g=>f(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?f(g):(ae("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new Ut)}}),0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(ae("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Mt(typeof r.accessToken=="string",31837,{l:r}),new xo(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Mt(e===null||typeof e=="string",2055,{h:e}),new Q(e)}}class gu{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Q.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class mu{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new gu(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Q.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class As{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class _u{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ie(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Mt(this.o===void 0,3512);const r=c=>{c.error!=null&&ae("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const l=c.token!==this.m;return this.m=c.token,ae("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable((()=>r(c)))};const o=c=>{ae("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((c=>o(c))),setTimeout((()=>{if(!this.appCheck){const c=this.V.getImmediate({optional:!0});c?o(c):ae("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new As(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Mt(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new As(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yu(i){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(i);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<i;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vu(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const o=yu(40);for(let c=0;c<o.length;++c)r.length<20&&o[c]<t&&(r+=e.charAt(o[c]%62))}return r}}function le(i,e){return i<e?-1:i>e?1:0}function Iu(i,e){let t=0;for(;t<i.length&&t<e.length;){const r=i.codePointAt(t),o=e.codePointAt(t);if(r!==o){if(r<128&&o<128)return le(r,o);{const c=vu(),l=Eu(c.encode(bs(i,t)),c.encode(bs(e,t)));return l!==0?l:le(r,o)}}t+=r>65535?2:1}return le(i.length,e.length)}function bs(i,e){return i.codePointAt(e)>65535?i.substring(e,e+2):i.substring(e,e+1)}function Eu(i,e){for(let t=0;t<i.length&&t<e.length;++t)if(i[t]!==e[t])return le(i[t],e[t]);return le(i.length,e.length)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ss="__name__";class ue{constructor(e,t,r){t===void 0?t=0:t>e.length&&jt(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&jt(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return ue.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ue?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let o=0;o<r;o++){const c=ue.compareSegments(e.get(o),t.get(o));if(c!==0)return c}return le(e.length,t.length)}static compareSegments(e,t){const r=ue.isNumericId(e),o=ue.isNumericId(t);return r&&!o?-1:!r&&o?1:r&&o?ue.extractNumericId(e).compare(ue.extractNumericId(t)):Iu(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return $i.fromString(e.substring(4,e.length-2))}}class se extends ue{construct(e,t,r){return new se(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new N(O.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((o=>o.length>0)))}return new se(t)}static emptyPath(){return new se([])}}const Tu=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ze extends ue{construct(e,t,r){return new ze(e,t,r)}static isValidIdentifier(e){return Tu.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ze.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ss}static keyField(){return new ze([Ss])}static fromServerFormat(e){const t=[];let r="",o=0;const c=()=>{if(r.length===0)throw new N(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let l=!1;for(;o<e.length;){const f=e[o];if(f==="\\"){if(o+1===e.length)throw new N(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new N(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=g,o+=2}else f==="`"?(l=!l,o++):f!=="."||l?(r+=f,o++):(c(),o++)}if(c(),l)throw new N(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ze(t)}static emptyPath(){return new ze([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe{constructor(e){this.path=e}static fromPath(e){return new qe(se.fromString(e))}static fromName(e){return new qe(se.fromString(e).popFirst(5))}static empty(){return new qe(se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return se.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new qe(new se(e.slice()))}}function Au(i,e,t,r){if(e===!0&&r===!0)throw new N(O.INVALID_ARGUMENT,`${i} and ${t} cannot be used together.`)}function bu(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function Su(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":jt(12329,{type:typeof i})}function Ru(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new N(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Su(i);throw new N(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(i,e){const t={typeString:i};return e&&(t.value=e),t}function qt(i,e){if(!bu(i))throw new N(O.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const o=e[r].typeString,c="value"in e[r]?{value:e[r].value}:void 0;if(!(r in i)){t=`JSON missing required field: '${r}'`;break}const l=i[r];if(o&&typeof l!==o){t=`JSON field '${r}' must be a ${o}.`;break}if(c!==void 0&&l!==c.value){t=`Expected '${r}' field to equal '${c.value}'`;break}}if(t)throw new N(O.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rs=-62135596800,ks=1e6;class de{static now(){return de.fromMillis(Date.now())}static fromDate(e){return de.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*ks);return new de(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Rs)throw new N(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ks}_compareTo(e){return this.seconds===e.seconds?le(this.nanoseconds,e.nanoseconds):le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:de._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(qt(e,de._jsonSchema))return new de(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Rs;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}de._jsonSchemaVersion="firestore/timestamp/1.0",de._jsonSchema={type:$("string",de._jsonSchemaVersion),seconds:$("number"),nanoseconds:$("number")};function ku(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(c){throw typeof DOMException<"u"&&c instanceof DOMException?new Cu("Invalid base64 string: "+c):c}})(e);return new et(t)}static fromUint8Array(e){const t=(function(o){let c="";for(let l=0;l<o.length;++l)c+=String.fromCharCode(o[l]);return c})(e);return new et(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let o=0;o<t.length;o++)r[o]=t.charCodeAt(o);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}et.EMPTY_BYTE_STRING=new et("");const bi="(default)";class kn{constructor(e,t){this.projectId=e,this.database=t||bi}static empty(){return new kn("","")}get isDefaultDatabase(){return this.database===bi}isEqual(e){return e instanceof kn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pu{constructor(e,t=null,r=[],o=[],c=null,l="F",f=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=o,this.limit=c,this.limitType=l,this.startAt=f,this.endAt=g,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function Ou(i){return new Pu(i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Cs,P;(P=Cs||(Cs={}))[P.OK=0]="OK",P[P.CANCELLED=1]="CANCELLED",P[P.UNKNOWN=2]="UNKNOWN",P[P.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",P[P.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",P[P.NOT_FOUND=5]="NOT_FOUND",P[P.ALREADY_EXISTS=6]="ALREADY_EXISTS",P[P.PERMISSION_DENIED=7]="PERMISSION_DENIED",P[P.UNAUTHENTICATED=16]="UNAUTHENTICATED",P[P.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",P[P.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",P[P.ABORTED=10]="ABORTED",P[P.OUT_OF_RANGE=11]="OUT_OF_RANGE",P[P.UNIMPLEMENTED=12]="UNIMPLEMENTED",P[P.INTERNAL=13]="INTERNAL",P[P.UNAVAILABLE=14]="UNAVAILABLE",P[P.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new $i([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nu=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Du=1048576;function pi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lu{constructor(e,t,r=1e3,o=1.5,c=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=o,this.A_=c,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-r);o>0&&ae("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e,t,r,o,c){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=o,this.removalCallback=c,this.deferred=new Ut,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((l=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,o,c){const l=Date.now()+r,f=new zi(e,t,l,o,c);return f.start(r),f}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Ps,Os;(Os=Ps||(Ps={})).Fa="default",Os.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mu(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fo="firestore.googleapis.com",Ds=!0;class Ls{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new N(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Fo,this.ssl=Ds}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Ds;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Nu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Du)throw new N(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Au("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Mu((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),(function(c){if(c.timeoutSeconds!==void 0){if(isNaN(c.timeoutSeconds))throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (must not be NaN)`);if(c.timeoutSeconds<5)throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (minimum allowed value is 5)`);if(c.timeoutSeconds>30)throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,o){return r.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Vo{constructor(e,t,r,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ls({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ls(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new du;switch(r.type){case"firstParty":return new mu(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Ns.get(t);r&&(ae("ComponentProvider","Removing Datastore"),Ns.delete(t),r.terminate())})(this),Promise.resolve()}}function Uu(i,e,t,r={}){var o;i=Ru(i,Vo);const c=pt(e),l=i._getSettings(),f=Object.assign(Object.assign({},l),{emulatorOptions:i._getEmulatorOptions()}),g=`${e}:${t}`;c&&(ki(`https://${g}`),Ci("Firestore",!0)),l.host!==Fo&&l.host!==g&&uu("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const E=Object.assign(Object.assign({},l),{host:g,ssl:c,emulatorOptions:r});if(!Ye(E,f)&&(i._setSettings(E),r.mockUserToken)){let b,S;if(typeof r.mockUserToken=="string")b=r.mockUserToken,S=Q.MOCK_USER;else{b=Zs(r.mockUserToken,(o=i._app)===null||o===void 0?void 0:o.options.projectId);const T=r.mockUserToken.sub||r.mockUserToken.user_id;if(!T)throw new N(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");S=new Q(T)}i._authCredentials=new fu(new xo(b,S))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gi{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Gi(this.firestore,e,this._query)}}class fe{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new qi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new fe(this.firestore,e,this._key)}toJSON(){return{type:fe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(qt(t,fe._jsonSchema))return new fe(e,r||null,new qe(se.fromString(t.referencePath)))}}fe._jsonSchemaVersion="firestore/documentReference/1.0",fe._jsonSchema={type:$("string",fe._jsonSchemaVersion),referencePath:$("string")};class qi extends Gi{constructor(e,t,r){super(e,t,Ou(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new fe(this.firestore,null,new qe(e))}withConverter(e){return new qi(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ms="AsyncQueue";class Us{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Lu(this,"async_queue_retry"),this.oc=()=>{const r=pi();r&&ae(Ms,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const t=pi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=pi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new Ut;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!ku(e))throw e;ae(Ms,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((r=>{throw this.tc=r,this.nc=!1,Mo("INTERNAL UNHANDLED ERROR: ",xs(r)),r})).then((r=>(this.nc=!1,r))))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const o=zi.createAndSchedule(this,e,t,r,(c=>this.lc(c)));return this.ec.push(o),o}ac(){this.tc&&jt(47125,{hc:xs(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function xs(i){let e=i.message||"";return i.stack&&(e=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),e}class xu extends Vo{constructor(e,t,r,o){super(e,t,r,o),this.type="firestore",this._queue=new Us,this._persistenceKey=o?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Us(e),this._firestoreClient=void 0,await e}}}function Fu(i,e){const t=typeof i=="object"?i:Ni(),r=typeof i=="string"?i:bi,o=On(t,"firestore").getImmediate({identifier:r});if(!o._initialized){const c=Js("firestore");c&&Uu(o,...c)}return o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e){this._byteString=e}static fromBase64String(e){try{return new be(et.fromBase64String(e))}catch(t){throw new N(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new be(et.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:be._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(qt(e,be._jsonSchema))return be.fromBase64String(e.bytes)}}be._jsonSchemaVersion="firestore/bytes/1.0",be._jsonSchema={type:$("string",be._jsonSchemaVersion),bytes:$("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ze(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return le(this._lat,e._lat)||le(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Je._jsonSchemaVersion}}static fromJSON(e){if(qt(e,Je._jsonSchema))return new Je(e.latitude,e.longitude)}}Je._jsonSchemaVersion="firestore/geoPoint/1.0",Je._jsonSchema={type:$("string",Je._jsonSchemaVersion),latitude:$("number"),longitude:$("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,o){if(r.length!==o.length)return!1;for(let c=0;c<r.length;++c)if(r[c]!==o[c])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Xe._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(qt(e,Xe._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Xe(e.vectorValues);throw new N(O.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Xe._jsonSchemaVersion="firestore/vectorValue/1.0",Xe._jsonSchema={type:$("string",Xe._jsonSchemaVersion),vectorValues:$("object")};const Vu=new RegExp("[~\\*/\\[\\]]");function ju(i,e,t){if(e.search(Vu)>=0)throw Fs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new jo(...e.split("."))._internalPath}catch{throw Fs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function Fs(i,e,t,r,o){let c=`Function ${e}() called with invalid data`;c+=". ";let l="";return new N(O.INVALID_ARGUMENT,c+i+l)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bo{constructor(e,t,r,o,c){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=o,this._converter=c}get id(){return this._key.path.lastSegment()}get ref(){return new fe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Bu(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Ho("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Bu extends Bo{data(){return super.data()}}function Ho(i,e){return typeof e=="string"?ju(i,e):e instanceof jo?e._internalPath:e._delegate._internalPath}class fn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ut extends Bo{constructor(e,t,r,o,c,l){super(e,t,r,o,l),this._firestore=e,this._firestoreImpl=e,this.metadata=c}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new vn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Ho("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(O.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=ut._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}ut._jsonSchemaVersion="firestore/documentSnapshot/1.0",ut._jsonSchema={type:$("string",ut._jsonSchemaVersion),bundleSource:$("string","DocumentSnapshot"),bundleName:$("string"),bundle:$("string")};class vn extends ut{data(e={}){return super.data(e)}}class xt{constructor(e,t,r,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new fn(o.hasPendingWrites,o.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new vn(this._firestore,this._userDataWriter,r.key,r,new fn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,c){if(o._snapshot.oldDocs.isEmpty()){let l=0;return o._snapshot.docChanges.map((f=>{const g=new vn(o._firestore,o._userDataWriter,f.doc.key,f.doc,new fn(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);return f.doc,{type:"added",doc:g,oldIndex:-1,newIndex:l++}}))}{let l=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((f=>c||f.type!==3)).map((f=>{const g=new vn(o._firestore,o._userDataWriter,f.doc.key,f.doc,new fn(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);let E=-1,b=-1;return f.type!==0&&(E=l.indexOf(f.doc.key),l=l.delete(f.doc.key)),f.type!==1&&(l=l.add(f.doc),b=l.indexOf(f.doc.key)),{type:Hu(f.type),doc:g,oldIndex:E,newIndex:b}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(O.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=xt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=wu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],o=[];return this.docs.forEach((c=>{c._document!==null&&(t.push(c._document),r.push(this._userDataWriter.convertObjectMap(c._document.data.value.mapValue.fields,"previous")),o.push(c.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Hu(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return jt(61501,{type:i})}}xt._jsonSchemaVersion="firestore/querySnapshot/1.0",xt._jsonSchema={type:$("string",xt._jsonSchemaVersion),bundleSource:$("string","QuerySnapshot"),bundleName:$("string"),bundle:$("string")};(function(e,t=!0){(function(o){Gt=o})(nt),Ze(new je("firestore",((r,{instanceIdentifier:o,options:c})=>{const l=r.getProvider("app").getImmediate(),f=new xu(new pu(r.getProvider("auth-internal")),new _u(l,r.getProvider("app-check-internal")),(function(E,b){if(!Object.prototype.hasOwnProperty.apply(E.options,["projectId"]))throw new N(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new kn(E.options.projectId,b)})(l,o),l);return c=Object.assign({useFetchStreams:t},c),f._setSettings(c),f}),"PUBLIC").setMultipleInstances(!0)),pe(Es,Ts,e),pe(Es,Ts,"esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $o="firebasestorage.googleapis.com",$u="storageBucket",Wu=120*1e3,zu=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve extends ye{constructor(e,t,r=0){super(gi(e),`Firebase Storage: ${t} (${gi(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,ve.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return gi(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var _e;(function(i){i.UNKNOWN="unknown",i.OBJECT_NOT_FOUND="object-not-found",i.BUCKET_NOT_FOUND="bucket-not-found",i.PROJECT_NOT_FOUND="project-not-found",i.QUOTA_EXCEEDED="quota-exceeded",i.UNAUTHENTICATED="unauthenticated",i.UNAUTHORIZED="unauthorized",i.UNAUTHORIZED_APP="unauthorized-app",i.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",i.INVALID_CHECKSUM="invalid-checksum",i.CANCELED="canceled",i.INVALID_EVENT_NAME="invalid-event-name",i.INVALID_URL="invalid-url",i.INVALID_DEFAULT_BUCKET="invalid-default-bucket",i.NO_DEFAULT_BUCKET="no-default-bucket",i.CANNOT_SLICE_BLOB="cannot-slice-blob",i.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",i.NO_DOWNLOAD_URL="no-download-url",i.INVALID_ARGUMENT="invalid-argument",i.INVALID_ARGUMENT_COUNT="invalid-argument-count",i.APP_DELETED="app-deleted",i.INVALID_ROOT_OPERATION="invalid-root-operation",i.INVALID_FORMAT="invalid-format",i.INTERNAL_ERROR="internal-error",i.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(_e||(_e={}));function gi(i){return"storage/"+i}function Gu(){const i="An unknown error occurred, please check the error payload for server response.";return new ve(_e.UNKNOWN,i)}function qu(){return new ve(_e.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Ku(){return new ve(_e.CANCELED,"User canceled the upload/download.")}function Ju(i){return new ve(_e.INVALID_URL,"Invalid URL '"+i+"'.")}function Xu(i){return new ve(_e.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+i+"'.")}function Vs(i){return new ve(_e.INVALID_ARGUMENT,i)}function Wo(){return new ve(_e.APP_DELETED,"The Firebase app was deleted.")}function Yu(i){return new ve(_e.INVALID_ROOT_OPERATION,"The operation '"+i+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=ce.makeFromUrl(e,t)}catch{return new ce(e,"")}if(r.path==="")return r;throw Xu(e)}static makeFromUrl(e,t){let r=null;const o="([A-Za-z0-9.\\-_]+)";function c(V){V.path.charAt(V.path.length-1)==="/"&&(V.path_=V.path_.slice(0,-1))}const l="(/(.*))?$",f=new RegExp("^gs://"+o+l,"i"),g={bucket:1,path:3};function E(V){V.path_=decodeURIComponent(V.path)}const b="v[A-Za-z0-9_]+",S=t.replace(/[.]/g,"\\."),T="(/([^?#]*).*)?$",L=new RegExp(`^https?://${S}/${b}/b/${o}/o${T}`,"i"),k={bucket:1,path:3},U=t===$o?"(?:storage.googleapis.com|storage.cloud.google.com)":t,C="([^?#]*)",z=new RegExp(`^https?://${U}/${o}/${C}`,"i"),x=[{regex:f,indices:g,postModify:c},{regex:L,indices:k,postModify:E},{regex:z,indices:{bucket:1,path:2},postModify:E}];for(let V=0;V<x.length;V++){const te=x[V],W=te.regex.exec(e);if(W){const y=W[te.indices.bucket];let u=W[te.indices.path];u||(u=""),r=new ce(y,u),te.postModify(r);break}}if(r==null)throw Ju(e);return r}}class Zu{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qu(i,e,t){let r=1,o=null,c=null,l=!1,f=0;function g(){return f===2}let E=!1;function b(...C){E||(E=!0,e.apply(null,C))}function S(C){o=setTimeout(()=>{o=null,i(L,g())},C)}function T(){c&&clearTimeout(c)}function L(C,...z){if(E){T();return}if(C){T(),b.call(null,C,...z);return}if(g()||l){T(),b.call(null,C,...z);return}r<64&&(r*=2);let x;f===1?(f=2,x=0):x=(r+Math.random())*1e3,S(x)}let k=!1;function U(C){k||(k=!0,T(),!E&&(o!==null?(C||(f=2),clearTimeout(o),S(0)):C||(f=1)))}return S(0),c=setTimeout(()=>{l=!0,U(!0)},t),U}function ed(i){i(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function td(i){return i!==void 0}function js(i,e,t,r){if(r<e)throw Vs(`Invalid value for '${i}'. Expected ${e} or greater.`);if(r>t)throw Vs(`Invalid value for '${i}'. Expected ${t} or less.`)}function nd(i){const e=encodeURIComponent;let t="?";for(const r in i)if(i.hasOwnProperty(r)){const o=e(r)+"="+e(i[r]);t=t+o+"&"}return t=t.slice(0,-1),t}var Cn;(function(i){i[i.NO_ERROR=0]="NO_ERROR",i[i.NETWORK_ERROR=1]="NETWORK_ERROR",i[i.ABORT=2]="ABORT"})(Cn||(Cn={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function id(i,e){const t=i>=500&&i<600,o=[408,429].indexOf(i)!==-1,c=e.indexOf(i)!==-1;return t||o||c}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd{constructor(e,t,r,o,c,l,f,g,E,b,S,T=!0,L=!1){this.url_=e,this.method_=t,this.headers_=r,this.body_=o,this.successCodes_=c,this.additionalRetryCodes_=l,this.callback_=f,this.errorCallback_=g,this.timeout_=E,this.progressCallback_=b,this.connectionFactory_=S,this.retry=T,this.isUsingEmulator=L,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((k,U)=>{this.resolve_=k,this.reject_=U,this.start_()})}start_(){const e=(r,o)=>{if(o){r(!1,new pn(!1,null,!0));return}const c=this.connectionFactory_();this.pendingConnection_=c;const l=f=>{const g=f.loaded,E=f.lengthComputable?f.total:-1;this.progressCallback_!==null&&this.progressCallback_(g,E)};this.progressCallback_!==null&&c.addUploadProgressListener(l),c.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&c.removeUploadProgressListener(l),this.pendingConnection_=null;const f=c.getErrorCode()===Cn.NO_ERROR,g=c.getStatus();if(!f||id(g,this.additionalRetryCodes_)&&this.retry){const b=c.getErrorCode()===Cn.ABORT;r(!1,new pn(!1,null,b));return}const E=this.successCodes_.indexOf(g)!==-1;r(!0,new pn(E,c))})},t=(r,o)=>{const c=this.resolve_,l=this.reject_,f=o.connection;if(o.wasSuccessCode)try{const g=this.callback_(f,f.getResponse());td(g)?c(g):c()}catch(g){l(g)}else if(f!==null){const g=Gu();g.serverResponse=f.getErrorText(),this.errorCallback_?l(this.errorCallback_(f,g)):l(g)}else if(o.canceled){const g=this.appDelete_?Wo():Ku();l(g)}else{const g=qu();l(g)}};this.canceled_?t(!1,new pn(!1,null,!0)):this.backoffId_=Qu(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&ed(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class pn{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function sd(i,e){e!==null&&e.length>0&&(i.Authorization="Firebase "+e)}function od(i,e){i["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function ad(i,e){e&&(i["X-Firebase-GMPID"]=e)}function cd(i,e){e!==null&&(i["X-Firebase-AppCheck"]=e)}function hd(i,e,t,r,o,c,l=!0,f=!1){const g=nd(i.urlParams),E=i.url+g,b=Object.assign({},i.headers);return ad(b,e),sd(b,t),od(b,c),cd(b,r),new rd(E,i.method,b,i.body,i.successCodes,i.additionalRetryCodes,i.handler,i.errorHandler,i.timeout,i.progressCallback,o,l,f)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ld(i){if(i.length===0)return null;const e=i.lastIndexOf("/");return e===-1?"":i.slice(0,e)}function ud(i){const e=i.lastIndexOf("/",i.length-2);return e===-1?i:i.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e,t){this._service=e,t instanceof ce?this._location=t:this._location=ce.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Pn(e,t)}get root(){const e=new ce(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return ud(this._location.path)}get storage(){return this._service}get parent(){const e=ld(this._location.path);if(e===null)return null;const t=new ce(this._location.bucket,e);return new Pn(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw Yu(e)}}function Bs(i,e){const t=e?.[$u];return t==null?null:ce.makeFromBucketSpec(t,i)}function dd(i,e,t,r={}){i.host=`${e}:${t}`;const o=pt(e);o&&(ki(`https://${i.host}/b`),Ci("Storage",!0)),i._isUsingEmulator=!0,i._protocol=o?"https":"http";const{mockUserToken:c}=r;c&&(i._overrideAuthToken=typeof c=="string"?c:Zs(c,i.app.options.projectId))}class fd{constructor(e,t,r,o,c,l=!1){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=o,this._firebaseVersion=c,this._isUsingEmulator=l,this._bucket=null,this._host=$o,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Wu,this._maxUploadRetryTime=zu,this._requests=new Set,o!=null?this._bucket=ce.makeFromBucketSpec(o,this._host):this._bucket=Bs(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=ce.makeFromBucketSpec(this._url,e):this._bucket=Bs(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){js("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){js("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(ie(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Pn(this,e)}_makeRequest(e,t,r,o,c=!0){if(this._deleted)return new Zu(Wo());{const l=hd(e,this._appId,r,o,t,this._firebaseVersion,c,this._isUsingEmulator);return this._requests.add(l),l.getPromise().then(()=>this._requests.delete(l),()=>this._requests.delete(l)),l}}async makeRequestWithTokens(e,t){const[r,o]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,o).getPromise()}}const Hs="@firebase/storage",$s="0.13.14";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zo="storage";function pd(i=Ni(),e){i=tt(i);const r=On(i,zo).getImmediate({identifier:e}),o=Js("storage");return o&&gd(r,...o),r}function gd(i,e,t,r={}){dd(i,e,t,r)}function md(i,{instanceIdentifier:e}){const t=i.getProvider("app").getImmediate(),r=i.getProvider("auth-internal"),o=i.getProvider("app-check-internal");return new fd(t,r,o,e,nt)}function _d(){Ze(new je(zo,md,"PUBLIC").setMultipleInstances(!0)),pe(Hs,$s,""),pe(Hs,$s,"esm2017")}_d();const yd={apiKey:"AIzaSyBgikvsur0oHXH3al8oa8sQwKQ58FHPwMY",authDomain:"cashier-thru.firebaseapp.com",databaseURL:"https://cashier-thru-default-rtdb.firebaseio.com",projectId:"cashier-thru",storageBucket:"cashier-thru.firebasestorage.app",messagingSenderId:"675561190760",appId:"1:675561190760:web:1d0cc394c3bc113aa452dd",measurementId:"G-C5EM0V4EH6"},Ki=to(yd);Fu(Ki);pd(Ki);const vd=au(Ki),wd=async(i,e)=>{try{const{data:t}=await mi.post("v1/register-social",Id(i));if(t?.data?.status!==200)throw Te.error(` فشل تسجيل الدخول : ${t?.message}`,{position:"top-right",autoClose:2e3,rtl:!0}),new Error(t?.message);console.log("user is loggin"),console.log("user",t?.data),Ws.set("app_token",t?.data?.api_token,{expires:1,path:"/",sameSite:"lax",secure:!0}),Te.success("تم تسجيل الدخول بنجاح!",{position:"top-right",autoClose:1500,rtl:!0}),e&&e()}catch(t){Te.error(` فشل تسجيل الدخول : ${t?.response?.data?.message}`,{position:"top-right",autoClose:2e3,rtl:!0})}};function Id(i){const e=new FormData;return e.append("register_type","2"),e.append("social_id",i?.uid),i?.displayName&&e.append("name",i?.displayName),i?.email&&e.append("email",i?.email),i?.photoURL&&e.append("image",i?.photoURL),e}const Pd=()=>{const[i,e]=Pa.useState(!1),t=Ca();return{loading:i,login:async(c,l,f)=>{try{e(!0);const{data:g}=await mi.post("v1/login-user",Ed(c));Ws.set("app_token",g?.data?.api_token,{expires:1,path:"/",sameSite:"lax",secure:!0}),Te.success("تم تسجيل الدخول بنجاح!",{position:"top-right",autoClose:1500,rtl:!0}),l?l():typeof window<"u"?window.location.replace("/"):(t.replace("/"),t.refresh())}catch(g){const E=g?.response?.status,b=g?.response?.data?.message;if(E===403){if(Te.warn("يرجى التحقق من بريدك الإلكتروني أولاً",{position:"top-right",autoClose:3e3,rtl:!0}),f)f(c?.email||"");else{const S=encodeURIComponent(c?.email||"");t.push(`/auth/verify?email=${S}&mode=register`)}return}throw Te.error(` فشل تسجيل الدخول : ${b}`,{position:"top-right",autoClose:2e3,rtl:!0}),g}finally{e(!1)}},register:async(c,l,f)=>{try{e(!0);const{data:g}=await mi.post("v1/register-user",Td(c));if(g?.status===!0||g?.status===200)if(Te.success("تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني.",{position:"top-right",autoClose:2e3,rtl:!0}),f)f(c?.email||"");else{const E=encodeURIComponent(c?.email||"");t.push(`/auth/verify?email=${E}&mode=register`)}else Te.error(g?.message||"فشل التسجيل",{position:"top-right",autoClose:2e3,rtl:!0})}catch(g){throw Te.error(` فشل التسجيل : ${g?.response?.data?.message}`,{position:"top-right",autoClose:2e3,rtl:!0}),g}finally{e(!1)}}}},Ed=i=>{const e=new FormData;return e.append("type","1"),e.append("email",i?.email),e.append("password",i?.password),e},Td=i=>{const e=new FormData;return e.append("name",i?.name),e.append("email",i?.email),e.append("password",i?.password),e.append("password_confirmation",i?.confirmPassword),e.append("register_type","1"),e.append("phone",i?.phone),e},Od=async({action:i=()=>{}})=>{try{const e=new Ae,r=(await ml(vd,e)).user;console.log("logged in with google",r),await wd(r,i)}catch(e){console.log("failed to login with google",e)}};export{Od as l,Pd as u};
