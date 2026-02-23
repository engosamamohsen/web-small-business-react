import{j as E}from"./jsx-runtime.D_zvdyIk.js";import{r as m}from"./index.DeO6U63H.js";import{u as F,P as q,a as K,c as V,C as B}from"./componentbase.esm.Bo6LrbGa.js";import{c as W,u as J}from"./providers.C1Sdikbx.js";var Y={root:"p-progress-spinner",spinner:"p-progress-spinner-svg",circle:"p-progress-spinner-circle"},Z=`
@layer primereact {
    .p-progress-spinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }
    
    .p-progress-spinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }
    
    .p-progress-spinner-svg {
        animation: p-progress-spinner-rotate 2s linear infinite;
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
    
    .p-progress-spinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: #d62d20;
        animation: p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }
}

@keyframes p-progress-spinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes p-progress-spinner-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}

@keyframes p-progress-spinner-color {
    100%,
    0% {
        stroke: #d62d20;
    }
    40% {
        stroke: #0057e7;
    }
    66% {
        stroke: #008744;
    }
    80%,
    90% {
        stroke: #ffa700;
    }
}
`,G={spinner:function(o){var t=o.props;return{animationDuration:t.animationDuration}}},P=B.extend({defaultProps:{__TYPE:"ProgressSpinner",id:null,style:null,className:null,strokeWidth:"2",fill:"none",animationDuration:"2s",children:void 0},css:{classes:Y,styles:Z,inlineStyles:G}}),U=m.memo(m.forwardRef(function(r,o){var t=F(),s=m.useContext(q),a=P.getProps(r,s),d=m.useRef(null),y=P.setMetaData({props:a}),l=y.ptm,h=y.cx,v=y.sx,b=y.isUnstyled;K(P.css.styles,b,{name:"progressspinner"}),m.useImperativeHandle(o,function(){return{props:a,getElement:function(){return d.current}}});var w=t({id:a.id,ref:d,style:a.style,className:V(a.className,h("root")),role:"progressbar","aria-busy":!0},P.getOtherProps(a),l("root")),k=t({className:h("spinner"),viewBox:"25 25 50 50",style:v("spinner")},l("spinner")),i=t({className:h("circle"),cx:"50",cy:"50",r:"20",fill:a.fill,strokeWidth:a.strokeWidth,strokeMiterlimit:"10"},l("circle"));return m.createElement("div",w,m.createElement("svg",k,m.createElement("circle",i)))}));U.displayName="ProgressSpinner";var j={};/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var M;function Q(){if(M)return j;M=1,j.parse=y,j.serialize=v;var r=Object.prototype.toString,o=Object.prototype.hasOwnProperty,t=/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/,s=/^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/,a=/^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i,d=/^[\u0020-\u003A\u003D-\u007E]*$/;function y(i,f){if(typeof i!="string")throw new TypeError("argument str must be a string");var n={},g=i.length;if(g<2)return n;var C=f&&f.decode||b,c=0,p=0,S=0;do{if(p=i.indexOf("=",c),p===-1)break;if(S=i.indexOf(";",c),S===-1)S=g;else if(p>S){c=i.lastIndexOf(";",p-1)+1;continue}var e=l(i,c,p),O=h(i,p,e),_=i.slice(e,O);if(!o.call(n,_)){var x=l(i,p+1,S),N=h(i,S,x);i.charCodeAt(x)===34&&i.charCodeAt(N-1)===34&&(x++,N--);var H=i.slice(x,N);n[_]=k(H,C)}c=S+1}while(c<g);return n}function l(i,f,n){do{var g=i.charCodeAt(f);if(g!==32&&g!==9)return f}while(++f<n);return n}function h(i,f,n){for(;f>n;){var g=i.charCodeAt(--f);if(g!==32&&g!==9)return f+1}return n}function v(i,f,n){var g=n&&n.encode||encodeURIComponent;if(typeof g!="function")throw new TypeError("option encode is invalid");if(!t.test(i))throw new TypeError("argument name is invalid");var C=g(f);if(!s.test(C))throw new TypeError("argument val is invalid");var c=i+"="+C;if(!n)return c;if(n.maxAge!=null){var p=Math.floor(n.maxAge);if(!isFinite(p))throw new TypeError("option maxAge is invalid");c+="; Max-Age="+p}if(n.domain){if(!a.test(n.domain))throw new TypeError("option domain is invalid");c+="; Domain="+n.domain}if(n.path){if(!d.test(n.path))throw new TypeError("option path is invalid");c+="; Path="+n.path}if(n.expires){var S=n.expires;if(!w(S)||isNaN(S.valueOf()))throw new TypeError("option expires is invalid");c+="; Expires="+S.toUTCString()}if(n.httpOnly&&(c+="; HttpOnly"),n.secure&&(c+="; Secure"),n.partitioned&&(c+="; Partitioned"),n.priority){var e=typeof n.priority=="string"?n.priority.toLowerCase():n.priority;switch(e){case"low":c+="; Priority=Low";break;case"medium":c+="; Priority=Medium";break;case"high":c+="; Priority=High";break;default:throw new TypeError("option priority is invalid")}}if(n.sameSite){var O=typeof n.sameSite=="string"?n.sameSite.toLowerCase():n.sameSite;switch(O){case!0:c+="; SameSite=Strict";break;case"lax":c+="; SameSite=Lax";break;case"strict":c+="; SameSite=Strict";break;case"none":c+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}}return c}function b(i){return i.indexOf("%")!==-1?decodeURIComponent(i):i}function w(i){return r.call(i)==="[object Date]"}function k(i,f){try{return f(i)}catch{return i}}return j}var T=Q();function X(){const r=typeof global>"u"?void 0:global.TEST_HAS_DOCUMENT_COOKIE;return typeof r=="boolean"?r:typeof document=="object"&&typeof document.cookie=="string"}function ee(r){return typeof r=="string"?T.parse(r):typeof r=="object"&&r!==null?r:{}}function $(r,o={}){const t=te(r);if(!o.doNotParse)try{return JSON.parse(t)}catch{}return r}function te(r){return r&&r[0]==="j"&&r[1]===":"?r.substr(2):r}class re{constructor(o,t={}){this.changeListeners=[],this.HAS_DOCUMENT_COOKIE=!1,this.update=()=>{if(!this.HAS_DOCUMENT_COOKIE)return;const a=this.cookies;this.cookies=T.parse(document.cookie),this._checkChanges(a)};const s=typeof document>"u"?"":document.cookie;this.cookies=ee(o||s),this.defaultSetOptions=t,this.HAS_DOCUMENT_COOKIE=X()}_emitChange(o){for(let t=0;t<this.changeListeners.length;++t)this.changeListeners[t](o)}_checkChanges(o){new Set(Object.keys(o).concat(Object.keys(this.cookies))).forEach(s=>{o[s]!==this.cookies[s]&&this._emitChange({name:s,value:$(this.cookies[s])})})}_startPolling(){this.pollingInterval=setInterval(this.update,300)}_stopPolling(){this.pollingInterval&&clearInterval(this.pollingInterval)}get(o,t={}){return t.doNotUpdate||this.update(),$(this.cookies[o],t)}getAll(o={}){o.doNotUpdate||this.update();const t={};for(let s in this.cookies)t[s]=$(this.cookies[s],o);return t}set(o,t,s){s?s=Object.assign(Object.assign({},this.defaultSetOptions),s):s=this.defaultSetOptions;const a=typeof t=="string"?t:JSON.stringify(t);this.cookies=Object.assign(Object.assign({},this.cookies),{[o]:a}),this.HAS_DOCUMENT_COOKIE&&(document.cookie=T.serialize(o,a,s)),this._emitChange({name:o,value:t,options:s})}remove(o,t){const s=t=Object.assign(Object.assign(Object.assign({},this.defaultSetOptions),t),{expires:new Date(1970,1,1,0,0,1),maxAge:0});this.cookies=Object.assign({},this.cookies),delete this.cookies[o],this.HAS_DOCUMENT_COOKIE&&(document.cookie=T.serialize(o,"",s)),this._emitChange({name:o,value:void 0,options:t})}addChangeListener(o){this.changeListeners.push(o),this.HAS_DOCUMENT_COOKIE&&this.changeListeners.length===1&&(typeof window=="object"&&"cookieStore"in window?window.cookieStore.addEventListener("change",this.update):this._startPolling())}removeChangeListener(o){const t=this.changeListeners.indexOf(o);t>=0&&this.changeListeners.splice(t,1),this.HAS_DOCUMENT_COOKIE&&this.changeListeners.length===0&&(typeof window=="object"&&"cookieStore"in window?window.cookieStore.removeEventListener("change",this.update):this._stopPolling())}}const z=m.createContext(new re),{Provider:ye,Consumer:me}=z;var A={exports:{}},u={};/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var I;function ne(){if(I)return u;I=1;var r=typeof Symbol=="function"&&Symbol.for,o=r?Symbol.for("react.element"):60103,t=r?Symbol.for("react.portal"):60106,s=r?Symbol.for("react.fragment"):60107,a=r?Symbol.for("react.strict_mode"):60108,d=r?Symbol.for("react.profiler"):60114,y=r?Symbol.for("react.provider"):60109,l=r?Symbol.for("react.context"):60110,h=r?Symbol.for("react.async_mode"):60111,v=r?Symbol.for("react.concurrent_mode"):60111,b=r?Symbol.for("react.forward_ref"):60112,w=r?Symbol.for("react.suspense"):60113,k=r?Symbol.for("react.suspense_list"):60120,i=r?Symbol.for("react.memo"):60115,f=r?Symbol.for("react.lazy"):60116,n=r?Symbol.for("react.block"):60121,g=r?Symbol.for("react.fundamental"):60117,C=r?Symbol.for("react.responder"):60118,c=r?Symbol.for("react.scope"):60119;function p(e){if(typeof e=="object"&&e!==null){var O=e.$$typeof;switch(O){case o:switch(e=e.type,e){case h:case v:case s:case d:case a:case w:return e;default:switch(e=e&&e.$$typeof,e){case l:case b:case f:case i:case y:return e;default:return O}}case t:return O}}}function S(e){return p(e)===v}return u.AsyncMode=h,u.ConcurrentMode=v,u.ContextConsumer=l,u.ContextProvider=y,u.Element=o,u.ForwardRef=b,u.Fragment=s,u.Lazy=f,u.Memo=i,u.Portal=t,u.Profiler=d,u.StrictMode=a,u.Suspense=w,u.isAsyncMode=function(e){return S(e)||p(e)===h},u.isConcurrentMode=S,u.isContextConsumer=function(e){return p(e)===l},u.isContextProvider=function(e){return p(e)===y},u.isElement=function(e){return typeof e=="object"&&e!==null&&e.$$typeof===o},u.isForwardRef=function(e){return p(e)===b},u.isFragment=function(e){return p(e)===s},u.isLazy=function(e){return p(e)===f},u.isMemo=function(e){return p(e)===i},u.isPortal=function(e){return p(e)===t},u.isProfiler=function(e){return p(e)===d},u.isStrictMode=function(e){return p(e)===a},u.isSuspense=function(e){return p(e)===w},u.isValidElementType=function(e){return typeof e=="string"||typeof e=="function"||e===s||e===v||e===d||e===a||e===w||e===k||typeof e=="object"&&e!==null&&(e.$$typeof===f||e.$$typeof===i||e.$$typeof===y||e.$$typeof===l||e.$$typeof===b||e.$$typeof===g||e.$$typeof===C||e.$$typeof===c||e.$$typeof===n)},u.typeOf=p,u}var D;function oe(){return D||(D=1,A.exports=ne()),A.exports}var R,L;function ie(){if(L)return R;L=1;var r=oe(),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},t={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},s={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},a={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},d={};d[r.ForwardRef]=s,d[r.Memo]=a;function y(f){return r.isMemo(f)?a:d[f.$$typeof]||o}var l=Object.defineProperty,h=Object.getOwnPropertyNames,v=Object.getOwnPropertySymbols,b=Object.getOwnPropertyDescriptor,w=Object.getPrototypeOf,k=Object.prototype;function i(f,n,g){if(typeof n!="string"){if(k){var C=w(n);C&&C!==k&&i(f,C,g)}var c=h(n);v&&(c=c.concat(v(n)));for(var p=y(f),S=y(n),e=0;e<c.length;++e){var O=c[e];if(!t[O]&&!(g&&g[O])&&!(S&&S[O])&&!(p&&p[O])){var _=b(n,O);try{l(f,O,_)}catch{}}}}return f}return R=i,R}ie();function se(){return typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u"}function ae(r,o){const t=m.useContext(z);if(!t)throw new Error("Missing <CookiesProvider>");const a=Object.assign(Object.assign({},{doNotUpdate:!0}),o),[d,y]=m.useState(()=>t.getAll(a));se()&&m.useLayoutEffect(()=>{function b(){const w=t.getAll(a);ce(r||null,w,d)&&y(w)}return t.addChangeListener(b),()=>{t.removeChangeListener(b)}},[t,d]);const l=m.useMemo(()=>t.set.bind(t),[t]),h=m.useMemo(()=>t.remove.bind(t),[t]),v=m.useMemo(()=>t.update.bind(t),[t]);return[d,l,h,v]}function ce(r,o,t){if(!r)return!0;for(let s of r)if(o[s]!==t[s])return!0;return!1}function he({globalData:r}){const o=m.useRef(!1),[,t]=ae(["app_data"]),[s,a]=m.useState(!0),{settings:d}=W(),{setCartCount:y}=J(),l=d||r?.data,h=r?.cart_count;return m.useLayoutEffect(()=>{if(o.current){a(!1);return}if(!l||typeof window>"u"){a(!1);return}const v=document.documentElement,b="#FC7643",w=l?.main_font_color??"#FC7643";v.style.setProperty("--main-color",b),v.style.setProperty("--second-color",w),l.main_bg&&v.style.setProperty("--main-background",l.main_bg),t("app_data",l,{path:"/",maxAge:86400}),o.current=!0,a(!1)},[l,t]),m.useEffect(()=>{typeof h=="number"&&y(h)},[h,y]),s?E.jsx(ue,{}):null}function ue(){return E.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50",suppressHydrationWarning:!0,children:E.jsxs("div",{className:"flex flex-col items-center gap-3",children:[E.jsx(U,{style:{width:"40px",height:"40px"},strokeWidth:"4",animationDuration:".5s","aria-label":"Loading"}),E.jsx("span",{className:"text-lg text-gray-600",children:"جاري التحميل..."})]})})}export{he as default};
