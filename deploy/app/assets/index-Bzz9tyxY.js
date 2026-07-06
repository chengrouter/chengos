(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const f of document.querySelectorAll('link[rel="modulepreload"]'))u(f);new MutationObserver(f=>{for(const p of f)if(p.type==="childList")for(const m of p.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&u(m)}).observe(document,{childList:!0,subtree:!0});function c(f){const p={};return f.integrity&&(p.integrity=f.integrity),f.referrerPolicy&&(p.referrerPolicy=f.referrerPolicy),f.crossOrigin==="use-credentials"?p.credentials="include":f.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function u(f){if(f.ep)return;f.ep=!0;const p=c(f);fetch(f.href,p)}})();function mp(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var Hs={exports:{}},Pr={},Gs={exports:{}},je={};var Qc;function xp(){if(Qc)return je;Qc=1;var l=Symbol.for("react.element"),s=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),p=Symbol.for("react.provider"),m=Symbol.for("react.context"),y=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),w=Symbol.for("react.memo"),R=Symbol.for("react.lazy"),z=Symbol.iterator;function V(g){return g===null||typeof g!="object"?null:(g=z&&g[z]||g["@@iterator"],typeof g=="function"?g:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},G=Object.assign,j={};function B(g,S,v){this.props=g,this.context=S,this.refs=j,this.updater=v||E}B.prototype.isReactComponent={},B.prototype.setState=function(g,S){if(typeof g!="object"&&typeof g!="function"&&g!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,g,S,"setState")},B.prototype.forceUpdate=function(g){this.updater.enqueueForceUpdate(this,g,"forceUpdate")};function W(){}W.prototype=B.prototype;function U(g,S,v){this.props=g,this.context=S,this.refs=j,this.updater=v||E}var J=U.prototype=new W;J.constructor=U,G(J,B.prototype),J.isPureReactComponent=!0;var K=Array.isArray,$=Object.prototype.hasOwnProperty,X={current:null},ie={key:!0,ref:!0,__self:!0,__source:!0};function se(g,S,v){var D,T={},O=null,N=null;if(S!=null)for(D in S.ref!==void 0&&(N=S.ref),S.key!==void 0&&(O=""+S.key),S)$.call(S,D)&&!ie.hasOwnProperty(D)&&(T[D]=S[D]);var re=arguments.length-2;if(re===1)T.children=v;else if(1<re){for(var xe=Array(re),H=0;H<re;H++)xe[H]=arguments[H+2];T.children=xe}if(g&&g.defaultProps)for(D in re=g.defaultProps,re)T[D]===void 0&&(T[D]=re[D]);return{$$typeof:l,type:g,key:O,ref:N,props:T,_owner:X.current}}function ae(g,S){return{$$typeof:l,type:g.type,key:S,ref:g.ref,props:g.props,_owner:g._owner}}function ee(g){return typeof g=="object"&&g!==null&&g.$$typeof===l}function le(g){var S={"=":"=0",":":"=2"};return"$"+g.replace(/[=:]/g,function(v){return S[v]})}var ue=/\/+/g;function te(g,S){return typeof g=="object"&&g!==null&&g.key!=null?le(""+g.key):S.toString(36)}function _e(g,S,v,D,T){var O=typeof g;(O==="undefined"||O==="boolean")&&(g=null);var N=!1;if(g===null)N=!0;else switch(O){case"string":case"number":N=!0;break;case"object":switch(g.$$typeof){case l:case s:N=!0}}if(N)return N=g,T=T(N),g=D===""?"."+te(N,0):D,K(T)?(v="",g!=null&&(v=g.replace(ue,"$&/")+"/"),_e(T,S,v,"",function(H){return H})):T!=null&&(ee(T)&&(T=ae(T,v+(!T.key||N&&N.key===T.key?"":(""+T.key).replace(ue,"$&/")+"/")+g)),S.push(T)),1;if(N=0,D=D===""?".":D+":",K(g))for(var re=0;re<g.length;re++){O=g[re];var xe=D+te(O,re);N+=_e(O,S,v,xe,T)}else if(xe=V(g),typeof xe=="function")for(g=xe.call(g),re=0;!(O=g.next()).done;)O=O.value,xe=D+te(O,re++),N+=_e(O,S,v,xe,T);else if(O==="object")throw S=String(g),Error("Objects are not valid as a React child (found: "+(S==="[object Object]"?"object with keys {"+Object.keys(g).join(", ")+"}":S)+"). If you meant to render a collection of children, use an array instead.");return N}function Q(g,S,v){if(g==null)return g;var D=[],T=0;return _e(g,D,"","",function(O){return S.call(v,O,T++)}),D}function ne(g){if(g._status===-1){var S=g._result;S=S(),S.then(function(v){(g._status===0||g._status===-1)&&(g._status=1,g._result=v)},function(v){(g._status===0||g._status===-1)&&(g._status=2,g._result=v)}),g._status===-1&&(g._status=0,g._result=S)}if(g._status===1)return g._result.default;throw g._result}var A={current:null},M={transition:null},P={ReactCurrentDispatcher:A,ReactCurrentBatchConfig:M,ReactCurrentOwner:X};function F(){throw Error("act(...) is not supported in production builds of React.")}return je.Children={map:Q,forEach:function(g,S,v){Q(g,function(){S.apply(this,arguments)},v)},count:function(g){var S=0;return Q(g,function(){S++}),S},toArray:function(g){return Q(g,function(S){return S})||[]},only:function(g){if(!ee(g))throw Error("React.Children.only expected to receive a single React element child.");return g}},je.Component=B,je.Fragment=c,je.Profiler=f,je.PureComponent=U,je.StrictMode=u,je.Suspense=k,je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=P,je.act=F,je.cloneElement=function(g,S,v){if(g==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+g+".");var D=G({},g.props),T=g.key,O=g.ref,N=g._owner;if(S!=null){if(S.ref!==void 0&&(O=S.ref,N=X.current),S.key!==void 0&&(T=""+S.key),g.type&&g.type.defaultProps)var re=g.type.defaultProps;for(xe in S)$.call(S,xe)&&!ie.hasOwnProperty(xe)&&(D[xe]=S[xe]===void 0&&re!==void 0?re[xe]:S[xe])}var xe=arguments.length-2;if(xe===1)D.children=v;else if(1<xe){re=Array(xe);for(var H=0;H<xe;H++)re[H]=arguments[H+2];D.children=re}return{$$typeof:l,type:g.type,key:T,ref:O,props:D,_owner:N}},je.createContext=function(g){return g={$$typeof:m,_currentValue:g,_currentValue2:g,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},g.Provider={$$typeof:p,_context:g},g.Consumer=g},je.createElement=se,je.createFactory=function(g){var S=se.bind(null,g);return S.type=g,S},je.createRef=function(){return{current:null}},je.forwardRef=function(g){return{$$typeof:y,render:g}},je.isValidElement=ee,je.lazy=function(g){return{$$typeof:R,_payload:{_status:-1,_result:g},_init:ne}},je.memo=function(g,S){return{$$typeof:w,type:g,compare:S===void 0?null:S}},je.startTransition=function(g){var S=M.transition;M.transition={};try{g()}finally{M.transition=S}},je.unstable_act=F,je.useCallback=function(g,S){return A.current.useCallback(g,S)},je.useContext=function(g){return A.current.useContext(g)},je.useDebugValue=function(){},je.useDeferredValue=function(g){return A.current.useDeferredValue(g)},je.useEffect=function(g,S){return A.current.useEffect(g,S)},je.useId=function(){return A.current.useId()},je.useImperativeHandle=function(g,S,v){return A.current.useImperativeHandle(g,S,v)},je.useInsertionEffect=function(g,S){return A.current.useInsertionEffect(g,S)},je.useLayoutEffect=function(g,S){return A.current.useLayoutEffect(g,S)},je.useMemo=function(g,S){return A.current.useMemo(g,S)},je.useReducer=function(g,S,v){return A.current.useReducer(g,S,v)},je.useRef=function(g){return A.current.useRef(g)},je.useState=function(g){return A.current.useState(g)},je.useSyncExternalStore=function(g,S,v){return A.current.useSyncExternalStore(g,S,v)},je.useTransition=function(){return A.current.useTransition()},je.version="18.3.1",je}var Xc;function na(){return Xc||(Xc=1,Gs.exports=xp()),Gs.exports}var Yc;function _p(){if(Yc)return Pr;Yc=1;var l=na(),s=Symbol.for("react.element"),c=Symbol.for("react.fragment"),u=Object.prototype.hasOwnProperty,f=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function m(y,k,w){var R,z={},V=null,E=null;w!==void 0&&(V=""+w),k.key!==void 0&&(V=""+k.key),k.ref!==void 0&&(E=k.ref);for(R in k)u.call(k,R)&&!p.hasOwnProperty(R)&&(z[R]=k[R]);if(y&&y.defaultProps)for(R in k=y.defaultProps,k)z[R]===void 0&&(z[R]=k[R]);return{$$typeof:s,type:y,key:V,ref:E,props:z,_owner:f.current}}return Pr.Fragment=c,Pr.jsx=m,Pr.jsxs=m,Pr}var qc;function wp(){return qc||(qc=1,Hs.exports=_p()),Hs.exports}var n=wp(),h=na();const bp=mp(h);var Go={},Qs={exports:{}},dt={},Xs={exports:{}},Ys={};var Jc;function yp(){return Jc||(Jc=1,(function(l){function s(M,P){var F=M.length;M.push(P);e:for(;0<F;){var g=F-1>>>1,S=M[g];if(0<f(S,P))M[g]=P,M[F]=S,F=g;else break e}}function c(M){return M.length===0?null:M[0]}function u(M){if(M.length===0)return null;var P=M[0],F=M.pop();if(F!==P){M[0]=F;e:for(var g=0,S=M.length,v=S>>>1;g<v;){var D=2*(g+1)-1,T=M[D],O=D+1,N=M[O];if(0>f(T,F))O<S&&0>f(N,T)?(M[g]=N,M[O]=F,g=O):(M[g]=T,M[D]=F,g=D);else if(O<S&&0>f(N,F))M[g]=N,M[O]=F,g=O;else break e}}return P}function f(M,P){var F=M.sortIndex-P.sortIndex;return F!==0?F:M.id-P.id}if(typeof performance=="object"&&typeof performance.now=="function"){var p=performance;l.unstable_now=function(){return p.now()}}else{var m=Date,y=m.now();l.unstable_now=function(){return m.now()-y}}var k=[],w=[],R=1,z=null,V=3,E=!1,G=!1,j=!1,B=typeof setTimeout=="function"?setTimeout:null,W=typeof clearTimeout=="function"?clearTimeout:null,U=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function J(M){for(var P=c(w);P!==null;){if(P.callback===null)u(w);else if(P.startTime<=M)u(w),P.sortIndex=P.expirationTime,s(k,P);else break;P=c(w)}}function K(M){if(j=!1,J(M),!G)if(c(k)!==null)G=!0,ne($);else{var P=c(w);P!==null&&A(K,P.startTime-M)}}function $(M,P){G=!1,j&&(j=!1,W(se),se=-1),E=!0;var F=V;try{for(J(P),z=c(k);z!==null&&(!(z.expirationTime>P)||M&&!le());){var g=z.callback;if(typeof g=="function"){z.callback=null,V=z.priorityLevel;var S=g(z.expirationTime<=P);P=l.unstable_now(),typeof S=="function"?z.callback=S:z===c(k)&&u(k),J(P)}else u(k);z=c(k)}if(z!==null)var v=!0;else{var D=c(w);D!==null&&A(K,D.startTime-P),v=!1}return v}finally{z=null,V=F,E=!1}}var X=!1,ie=null,se=-1,ae=5,ee=-1;function le(){return!(l.unstable_now()-ee<ae)}function ue(){if(ie!==null){var M=l.unstable_now();ee=M;var P=!0;try{P=ie(!0,M)}finally{P?te():(X=!1,ie=null)}}else X=!1}var te;if(typeof U=="function")te=function(){U(ue)};else if(typeof MessageChannel<"u"){var _e=new MessageChannel,Q=_e.port2;_e.port1.onmessage=ue,te=function(){Q.postMessage(null)}}else te=function(){B(ue,0)};function ne(M){ie=M,X||(X=!0,te())}function A(M,P){se=B(function(){M(l.unstable_now())},P)}l.unstable_IdlePriority=5,l.unstable_ImmediatePriority=1,l.unstable_LowPriority=4,l.unstable_NormalPriority=3,l.unstable_Profiling=null,l.unstable_UserBlockingPriority=2,l.unstable_cancelCallback=function(M){M.callback=null},l.unstable_continueExecution=function(){G||E||(G=!0,ne($))},l.unstable_forceFrameRate=function(M){0>M||125<M?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ae=0<M?Math.floor(1e3/M):5},l.unstable_getCurrentPriorityLevel=function(){return V},l.unstable_getFirstCallbackNode=function(){return c(k)},l.unstable_next=function(M){switch(V){case 1:case 2:case 3:var P=3;break;default:P=V}var F=V;V=P;try{return M()}finally{V=F}},l.unstable_pauseExecution=function(){},l.unstable_requestPaint=function(){},l.unstable_runWithPriority=function(M,P){switch(M){case 1:case 2:case 3:case 4:case 5:break;default:M=3}var F=V;V=M;try{return P()}finally{V=F}},l.unstable_scheduleCallback=function(M,P,F){var g=l.unstable_now();switch(typeof F=="object"&&F!==null?(F=F.delay,F=typeof F=="number"&&0<F?g+F:g):F=g,M){case 1:var S=-1;break;case 2:S=250;break;case 5:S=1073741823;break;case 4:S=1e4;break;default:S=5e3}return S=F+S,M={id:R++,callback:P,priorityLevel:M,startTime:F,expirationTime:S,sortIndex:-1},F>g?(M.sortIndex=F,s(w,M),c(k)===null&&M===c(w)&&(j?(W(se),se=-1):j=!0,A(K,F-g))):(M.sortIndex=S,s(k,M),G||E||(G=!0,ne($))),M},l.unstable_shouldYield=le,l.unstable_wrapCallback=function(M){var P=V;return function(){var F=V;V=P;try{return M.apply(this,arguments)}finally{V=F}}}})(Ys)),Ys}var Zc;function vp(){return Zc||(Zc=1,Xs.exports=yp()),Xs.exports}var ed;function kp(){if(ed)return dt;ed=1;var l=na(),s=vp();function c(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var u=new Set,f={};function p(e,t){m(e,t),m(e+"Capture",t)}function m(e,t){for(f[e]=t,e=0;e<t.length;e++)u.add(t[e])}var y=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,w=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,R={},z={};function V(e){return k.call(z,e)?!0:k.call(R,e)?!1:w.test(e)?z[e]=!0:(R[e]=!0,!1)}function E(e,t,r,o){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function G(e,t,r,o){if(t===null||typeof t>"u"||E(e,t,r,o))return!0;if(o)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function j(e,t,r,o,i,a,d){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=i,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=d}var B={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){B[e]=new j(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];B[t]=new j(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){B[e]=new j(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){B[e]=new j(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){B[e]=new j(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){B[e]=new j(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){B[e]=new j(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){B[e]=new j(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){B[e]=new j(e,5,!1,e.toLowerCase(),null,!1,!1)});var W=/[\-:]([a-z])/g;function U(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(W,U);B[t]=new j(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(W,U);B[t]=new j(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(W,U);B[t]=new j(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){B[e]=new j(e,1,!1,e.toLowerCase(),null,!1,!1)}),B.xlinkHref=new j("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){B[e]=new j(e,1,!1,e.toLowerCase(),null,!0,!0)});function J(e,t,r,o){var i=B.hasOwnProperty(t)?B[t]:null;(i!==null?i.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(G(t,r,i,o)&&(r=null),o||i===null?V(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):i.mustUseProperty?e[i.propertyName]=r===null?i.type===3?!1:"":r:(t=i.attributeName,o=i.attributeNamespace,r===null?e.removeAttribute(t):(i=i.type,r=i===3||i===4&&r===!0?"":""+r,o?e.setAttributeNS(o,t,r):e.setAttribute(t,r))))}var K=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,$=Symbol.for("react.element"),X=Symbol.for("react.portal"),ie=Symbol.for("react.fragment"),se=Symbol.for("react.strict_mode"),ae=Symbol.for("react.profiler"),ee=Symbol.for("react.provider"),le=Symbol.for("react.context"),ue=Symbol.for("react.forward_ref"),te=Symbol.for("react.suspense"),_e=Symbol.for("react.suspense_list"),Q=Symbol.for("react.memo"),ne=Symbol.for("react.lazy"),A=Symbol.for("react.offscreen"),M=Symbol.iterator;function P(e){return e===null||typeof e!="object"?null:(e=M&&e[M]||e["@@iterator"],typeof e=="function"?e:null)}var F=Object.assign,g;function S(e){if(g===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);g=t&&t[1]||""}return`
`+g+e}var v=!1;function D(e,t){if(!e||v)return"";v=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(L){var o=L}Reflect.construct(e,[],t)}else{try{t.call()}catch(L){o=L}e.call(t.prototype)}else{try{throw Error()}catch(L){o=L}e()}}catch(L){if(L&&o&&typeof L.stack=="string"){for(var i=L.stack.split(`
`),a=o.stack.split(`
`),d=i.length-1,x=a.length-1;1<=d&&0<=x&&i[d]!==a[x];)x--;for(;1<=d&&0<=x;d--,x--)if(i[d]!==a[x]){if(d!==1||x!==1)do if(d--,x--,0>x||i[d]!==a[x]){var _=`
`+i[d].replace(" at new "," at ");return e.displayName&&_.includes("<anonymous>")&&(_=_.replace("<anonymous>",e.displayName)),_}while(1<=d&&0<=x);break}}}finally{v=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?S(e):""}function T(e){switch(e.tag){case 5:return S(e.type);case 16:return S("Lazy");case 13:return S("Suspense");case 19:return S("SuspenseList");case 0:case 2:case 15:return e=D(e.type,!1),e;case 11:return e=D(e.type.render,!1),e;case 1:return e=D(e.type,!0),e;default:return""}}function O(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ie:return"Fragment";case X:return"Portal";case ae:return"Profiler";case se:return"StrictMode";case te:return"Suspense";case _e:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case le:return(e.displayName||"Context")+".Consumer";case ee:return(e._context.displayName||"Context")+".Provider";case ue:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Q:return t=e.displayName||null,t!==null?t:O(e.type)||"Memo";case ne:t=e._payload,e=e._init;try{return O(e(t))}catch{}}return null}function N(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return O(t);case 8:return t===se?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function re(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function xe(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function H(e){var t=xe(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(d){o=""+d,a.call(this,d)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return o},setValue:function(d){o=""+d},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function fe(e){e._valueTracker||(e._valueTracker=H(e))}function Ne(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),o="";return e&&(o=xe(e)?e.checked?"true":"false":e.value),e=o,e!==r?(t.setValue(e),!0):!1}function ce(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ye(e,t){var r=t.checked;return F({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function Se(e,t){var r=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;r=re(t.value!=null?t.value:r),e._wrapperState={initialChecked:o,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Ee(e,t){t=t.checked,t!=null&&J(e,"checked",t,!1)}function ot(e,t){Ee(e,t);var r=re(t.value),o=t.type;if(r!=null)o==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?kn(e,t.type,r):t.hasOwnProperty("defaultValue")&&kn(e,t.type,re(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Et(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function kn(e,t,r){(t!=="number"||ce(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var qn=Array.isArray;function jn(e,t,r,o){if(e=e.options,t){t={};for(var i=0;i<r.length;i++)t["$"+r[i]]=!0;for(r=0;r<e.length;r++)i=t.hasOwnProperty("$"+e[r].value),e[r].selected!==i&&(e[r].selected=i),i&&o&&(e[r].defaultSelected=!0)}else{for(r=""+re(r),t=null,i=0;i<e.length;i++){if(e[i].value===r){e[i].selected=!0,o&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function ni(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(c(91));return F({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function oa(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(c(92));if(qn(r)){if(1<r.length)throw Error(c(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:re(r)}}function ia(e,t){var r=re(t.value),o=re(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),o!=null&&(e.defaultValue=""+o)}function sa(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function aa(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ri(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?aa(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Wr,la=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,o,i){MSApp.execUnsafeLocalFunction(function(){return e(t,r,o,i)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Wr=Wr||document.createElement("div"),Wr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Wr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Jn(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var Zn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},bd=["Webkit","ms","Moz","O"];Object.keys(Zn).forEach(function(e){bd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Zn[t]=Zn[e]})});function ca(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||Zn.hasOwnProperty(e)&&Zn[e]?(""+t).trim():t+"px"}function da(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var o=r.indexOf("--")===0,i=ca(r,t[r],o);r==="float"&&(r="cssFloat"),o?e.setProperty(r,i):e[r]=i}}var yd=F({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function oi(e,t){if(t){if(yd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(c(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(c(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(c(61))}if(t.style!=null&&typeof t.style!="object")throw Error(c(62))}}function ii(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var si=null;function ai(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var li=null,Sn=null,Cn=null;function ua(e){if(e=yr(e)){if(typeof li!="function")throw Error(c(280));var t=e.stateNode;t&&(t=ao(t),li(e.stateNode,e.type,t))}}function pa(e){Sn?Cn?Cn.push(e):Cn=[e]:Sn=e}function ha(){if(Sn){var e=Sn,t=Cn;if(Cn=Sn=null,ua(e),t)for(e=0;e<t.length;e++)ua(t[e])}}function fa(e,t){return e(t)}function ga(){}var ci=!1;function ma(e,t,r){if(ci)return e(t,r);ci=!0;try{return fa(e,t,r)}finally{ci=!1,(Sn!==null||Cn!==null)&&(ga(),ha())}}function er(e,t){var r=e.stateNode;if(r===null)return null;var o=ao(r);if(o===null)return null;r=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(c(231,t,typeof r));return r}var di=!1;if(y)try{var tr={};Object.defineProperty(tr,"passive",{get:function(){di=!0}}),window.addEventListener("test",tr,tr),window.removeEventListener("test",tr,tr)}catch{di=!1}function vd(e,t,r,o,i,a,d,x,_){var L=Array.prototype.slice.call(arguments,3);try{t.apply(r,L)}catch(q){this.onError(q)}}var nr=!1,Fr=null,Or=!1,ui=null,kd={onError:function(e){nr=!0,Fr=e}};function jd(e,t,r,o,i,a,d,x,_){nr=!1,Fr=null,vd.apply(kd,arguments)}function Sd(e,t,r,o,i,a,d,x,_){if(jd.apply(this,arguments),nr){if(nr){var L=Fr;nr=!1,Fr=null}else throw Error(c(198));Or||(Or=!0,ui=L)}}function cn(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function xa(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function _a(e){if(cn(e)!==e)throw Error(c(188))}function Cd(e){var t=e.alternate;if(!t){if(t=cn(e),t===null)throw Error(c(188));return t!==e?null:e}for(var r=e,o=t;;){var i=r.return;if(i===null)break;var a=i.alternate;if(a===null){if(o=i.return,o!==null){r=o;continue}break}if(i.child===a.child){for(a=i.child;a;){if(a===r)return _a(i),e;if(a===o)return _a(i),t;a=a.sibling}throw Error(c(188))}if(r.return!==o.return)r=i,o=a;else{for(var d=!1,x=i.child;x;){if(x===r){d=!0,r=i,o=a;break}if(x===o){d=!0,o=i,r=a;break}x=x.sibling}if(!d){for(x=a.child;x;){if(x===r){d=!0,r=a,o=i;break}if(x===o){d=!0,o=a,r=i;break}x=x.sibling}if(!d)throw Error(c(189))}}if(r.alternate!==o)throw Error(c(190))}if(r.tag!==3)throw Error(c(188));return r.stateNode.current===r?e:t}function wa(e){return e=Cd(e),e!==null?ba(e):null}function ba(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=ba(e);if(t!==null)return t;e=e.sibling}return null}var ya=s.unstable_scheduleCallback,va=s.unstable_cancelCallback,Nd=s.unstable_shouldYield,Id=s.unstable_requestPaint,Oe=s.unstable_now,Ed=s.unstable_getCurrentPriorityLevel,pi=s.unstable_ImmediatePriority,ka=s.unstable_UserBlockingPriority,Ur=s.unstable_NormalPriority,Ad=s.unstable_LowPriority,ja=s.unstable_IdlePriority,$r=null,At=null;function Td(e){if(At&&typeof At.onCommitFiberRoot=="function")try{At.onCommitFiberRoot($r,e,void 0,(e.current.flags&128)===128)}catch{}}var yt=Math.clz32?Math.clz32:Rd,zd=Math.log,Ld=Math.LN2;function Rd(e){return e>>>=0,e===0?32:31-(zd(e)/Ld|0)|0}var Br=64,Vr=4194304;function rr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Kr(e,t){var r=e.pendingLanes;if(r===0)return 0;var o=0,i=e.suspendedLanes,a=e.pingedLanes,d=r&268435455;if(d!==0){var x=d&~i;x!==0?o=rr(x):(a&=d,a!==0&&(o=rr(a)))}else d=r&~i,d!==0?o=rr(d):a!==0&&(o=rr(a));if(o===0)return 0;if(t!==0&&t!==o&&(t&i)===0&&(i=o&-o,a=t&-t,i>=a||i===16&&(a&4194240)!==0))return t;if((o&4)!==0&&(o|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)r=31-yt(t),i=1<<r,o|=e[r],t&=~i;return o}function Md(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Pd(e,t){for(var r=e.suspendedLanes,o=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes;0<a;){var d=31-yt(a),x=1<<d,_=i[d];_===-1?((x&r)===0||(x&o)!==0)&&(i[d]=Md(x,t)):_<=t&&(e.expiredLanes|=x),a&=~x}}function hi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Sa(){var e=Br;return Br<<=1,(Br&4194240)===0&&(Br=64),e}function fi(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function or(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-yt(t),e[t]=r}function Dd(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<r;){var i=31-yt(r),a=1<<i;t[i]=0,o[i]=-1,e[i]=-1,r&=~a}}function gi(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var o=31-yt(r),i=1<<o;i&t|e[o]&t&&(e[o]|=t),r&=~i}}var Ae=0;function Ca(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Na,mi,Ia,Ea,Aa,xi=!1,Hr=[],Bt=null,Vt=null,Kt=null,ir=new Map,sr=new Map,Ht=[],Wd="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ta(e,t){switch(e){case"focusin":case"focusout":Bt=null;break;case"dragenter":case"dragleave":Vt=null;break;case"mouseover":case"mouseout":Kt=null;break;case"pointerover":case"pointerout":ir.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":sr.delete(t.pointerId)}}function ar(e,t,r,o,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:r,eventSystemFlags:o,nativeEvent:a,targetContainers:[i]},t!==null&&(t=yr(t),t!==null&&mi(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Fd(e,t,r,o,i){switch(t){case"focusin":return Bt=ar(Bt,e,t,r,o,i),!0;case"dragenter":return Vt=ar(Vt,e,t,r,o,i),!0;case"mouseover":return Kt=ar(Kt,e,t,r,o,i),!0;case"pointerover":var a=i.pointerId;return ir.set(a,ar(ir.get(a)||null,e,t,r,o,i)),!0;case"gotpointercapture":return a=i.pointerId,sr.set(a,ar(sr.get(a)||null,e,t,r,o,i)),!0}return!1}function za(e){var t=dn(e.target);if(t!==null){var r=cn(t);if(r!==null){if(t=r.tag,t===13){if(t=xa(r),t!==null){e.blockedOn=t,Aa(e.priority,function(){Ia(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Gr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=wi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var o=new r.constructor(r.type,r);si=o,r.target.dispatchEvent(o),si=null}else return t=yr(r),t!==null&&mi(t),e.blockedOn=r,!1;t.shift()}return!0}function La(e,t,r){Gr(e)&&r.delete(t)}function Od(){xi=!1,Bt!==null&&Gr(Bt)&&(Bt=null),Vt!==null&&Gr(Vt)&&(Vt=null),Kt!==null&&Gr(Kt)&&(Kt=null),ir.forEach(La),sr.forEach(La)}function lr(e,t){e.blockedOn===t&&(e.blockedOn=null,xi||(xi=!0,s.unstable_scheduleCallback(s.unstable_NormalPriority,Od)))}function cr(e){function t(i){return lr(i,e)}if(0<Hr.length){lr(Hr[0],e);for(var r=1;r<Hr.length;r++){var o=Hr[r];o.blockedOn===e&&(o.blockedOn=null)}}for(Bt!==null&&lr(Bt,e),Vt!==null&&lr(Vt,e),Kt!==null&&lr(Kt,e),ir.forEach(t),sr.forEach(t),r=0;r<Ht.length;r++)o=Ht[r],o.blockedOn===e&&(o.blockedOn=null);for(;0<Ht.length&&(r=Ht[0],r.blockedOn===null);)za(r),r.blockedOn===null&&Ht.shift()}var Nn=K.ReactCurrentBatchConfig,Qr=!0;function Ud(e,t,r,o){var i=Ae,a=Nn.transition;Nn.transition=null;try{Ae=1,_i(e,t,r,o)}finally{Ae=i,Nn.transition=a}}function $d(e,t,r,o){var i=Ae,a=Nn.transition;Nn.transition=null;try{Ae=4,_i(e,t,r,o)}finally{Ae=i,Nn.transition=a}}function _i(e,t,r,o){if(Qr){var i=wi(e,t,r,o);if(i===null)Pi(e,t,o,Xr,r),Ta(e,o);else if(Fd(i,e,t,r,o))o.stopPropagation();else if(Ta(e,o),t&4&&-1<Wd.indexOf(e)){for(;i!==null;){var a=yr(i);if(a!==null&&Na(a),a=wi(e,t,r,o),a===null&&Pi(e,t,o,Xr,r),a===i)break;i=a}i!==null&&o.stopPropagation()}else Pi(e,t,o,null,r)}}var Xr=null;function wi(e,t,r,o){if(Xr=null,e=ai(o),e=dn(e),e!==null)if(t=cn(e),t===null)e=null;else if(r=t.tag,r===13){if(e=xa(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Xr=e,null}function Ra(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ed()){case pi:return 1;case ka:return 4;case Ur:case Ad:return 16;case ja:return 536870912;default:return 16}default:return 16}}var Gt=null,bi=null,Yr=null;function Ma(){if(Yr)return Yr;var e,t=bi,r=t.length,o,i="value"in Gt?Gt.value:Gt.textContent,a=i.length;for(e=0;e<r&&t[e]===i[e];e++);var d=r-e;for(o=1;o<=d&&t[r-o]===i[a-o];o++);return Yr=i.slice(e,1<o?1-o:void 0)}function qr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Jr(){return!0}function Pa(){return!1}function ut(e){function t(r,o,i,a,d){this._reactName=r,this._targetInst=i,this.type=o,this.nativeEvent=a,this.target=d,this.currentTarget=null;for(var x in e)e.hasOwnProperty(x)&&(r=e[x],this[x]=r?r(a):a[x]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Jr:Pa,this.isPropagationStopped=Pa,this}return F(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=Jr)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=Jr)},persist:function(){},isPersistent:Jr}),t}var In={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},yi=ut(In),dr=F({},In,{view:0,detail:0}),Bd=ut(dr),vi,ki,ur,Zr=F({},dr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Si,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ur&&(ur&&e.type==="mousemove"?(vi=e.screenX-ur.screenX,ki=e.screenY-ur.screenY):ki=vi=0,ur=e),vi)},movementY:function(e){return"movementY"in e?e.movementY:ki}}),Da=ut(Zr),Vd=F({},Zr,{dataTransfer:0}),Kd=ut(Vd),Hd=F({},dr,{relatedTarget:0}),ji=ut(Hd),Gd=F({},In,{animationName:0,elapsedTime:0,pseudoElement:0}),Qd=ut(Gd),Xd=F({},In,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Yd=ut(Xd),qd=F({},In,{data:0}),Wa=ut(qd),Jd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Zd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},eu={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function tu(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=eu[e])?!!t[e]:!1}function Si(){return tu}var nu=F({},dr,{key:function(e){if(e.key){var t=Jd[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=qr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Zd[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Si,charCode:function(e){return e.type==="keypress"?qr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?qr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),ru=ut(nu),ou=F({},Zr,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Fa=ut(ou),iu=F({},dr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Si}),su=ut(iu),au=F({},In,{propertyName:0,elapsedTime:0,pseudoElement:0}),lu=ut(au),cu=F({},Zr,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),du=ut(cu),uu=[9,13,27,32],Ci=y&&"CompositionEvent"in window,pr=null;y&&"documentMode"in document&&(pr=document.documentMode);var pu=y&&"TextEvent"in window&&!pr,Oa=y&&(!Ci||pr&&8<pr&&11>=pr),Ua=" ",$a=!1;function Ba(e,t){switch(e){case"keyup":return uu.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Va(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var En=!1;function hu(e,t){switch(e){case"compositionend":return Va(t);case"keypress":return t.which!==32?null:($a=!0,Ua);case"textInput":return e=t.data,e===Ua&&$a?null:e;default:return null}}function fu(e,t){if(En)return e==="compositionend"||!Ci&&Ba(e,t)?(e=Ma(),Yr=bi=Gt=null,En=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Oa&&t.locale!=="ko"?null:t.data;default:return null}}var gu={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ka(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!gu[e.type]:t==="textarea"}function Ha(e,t,r,o){pa(o),t=oo(t,"onChange"),0<t.length&&(r=new yi("onChange","change",null,r,o),e.push({event:r,listeners:t}))}var hr=null,fr=null;function mu(e){dl(e,0)}function eo(e){var t=Rn(e);if(Ne(t))return e}function xu(e,t){if(e==="change")return t}var Ga=!1;if(y){var Ni;if(y){var Ii="oninput"in document;if(!Ii){var Qa=document.createElement("div");Qa.setAttribute("oninput","return;"),Ii=typeof Qa.oninput=="function"}Ni=Ii}else Ni=!1;Ga=Ni&&(!document.documentMode||9<document.documentMode)}function Xa(){hr&&(hr.detachEvent("onpropertychange",Ya),fr=hr=null)}function Ya(e){if(e.propertyName==="value"&&eo(fr)){var t=[];Ha(t,fr,e,ai(e)),ma(mu,t)}}function _u(e,t,r){e==="focusin"?(Xa(),hr=t,fr=r,hr.attachEvent("onpropertychange",Ya)):e==="focusout"&&Xa()}function wu(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return eo(fr)}function bu(e,t){if(e==="click")return eo(t)}function yu(e,t){if(e==="input"||e==="change")return eo(t)}function vu(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var vt=typeof Object.is=="function"?Object.is:vu;function gr(e,t){if(vt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),o=Object.keys(t);if(r.length!==o.length)return!1;for(o=0;o<r.length;o++){var i=r[o];if(!k.call(t,i)||!vt(e[i],t[i]))return!1}return!0}function qa(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ja(e,t){var r=qa(e);e=0;for(var o;r;){if(r.nodeType===3){if(o=e+r.textContent.length,e<=t&&o>=t)return{node:r,offset:t-e};e=o}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=qa(r)}}function Za(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Za(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function el(){for(var e=window,t=ce();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=ce(e.document)}return t}function Ei(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function ku(e){var t=el(),r=e.focusedElem,o=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&Za(r.ownerDocument.documentElement,r)){if(o!==null&&Ei(r)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=r.textContent.length,a=Math.min(o.start,i);o=o.end===void 0?a:Math.min(o.end,i),!e.extend&&a>o&&(i=o,o=a,a=i),i=Ja(r,a);var d=Ja(r,o);i&&d&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==d.node||e.focusOffset!==d.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),a>o?(e.addRange(t),e.extend(d.node,d.offset)):(t.setEnd(d.node,d.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ju=y&&"documentMode"in document&&11>=document.documentMode,An=null,Ai=null,mr=null,Ti=!1;function tl(e,t,r){var o=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Ti||An==null||An!==ce(o)||(o=An,"selectionStart"in o&&Ei(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),mr&&gr(mr,o)||(mr=o,o=oo(Ai,"onSelect"),0<o.length&&(t=new yi("onSelect","select",null,t,r),e.push({event:t,listeners:o}),t.target=An)))}function to(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Tn={animationend:to("Animation","AnimationEnd"),animationiteration:to("Animation","AnimationIteration"),animationstart:to("Animation","AnimationStart"),transitionend:to("Transition","TransitionEnd")},zi={},nl={};y&&(nl=document.createElement("div").style,"AnimationEvent"in window||(delete Tn.animationend.animation,delete Tn.animationiteration.animation,delete Tn.animationstart.animation),"TransitionEvent"in window||delete Tn.transitionend.transition);function no(e){if(zi[e])return zi[e];if(!Tn[e])return e;var t=Tn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in nl)return zi[e]=t[r];return e}var rl=no("animationend"),ol=no("animationiteration"),il=no("animationstart"),sl=no("transitionend"),al=new Map,ll="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Qt(e,t){al.set(e,t),p(t,[e])}for(var Li=0;Li<ll.length;Li++){var Ri=ll[Li],Su=Ri.toLowerCase(),Cu=Ri[0].toUpperCase()+Ri.slice(1);Qt(Su,"on"+Cu)}Qt(rl,"onAnimationEnd"),Qt(ol,"onAnimationIteration"),Qt(il,"onAnimationStart"),Qt("dblclick","onDoubleClick"),Qt("focusin","onFocus"),Qt("focusout","onBlur"),Qt(sl,"onTransitionEnd"),m("onMouseEnter",["mouseout","mouseover"]),m("onMouseLeave",["mouseout","mouseover"]),m("onPointerEnter",["pointerout","pointerover"]),m("onPointerLeave",["pointerout","pointerover"]),p("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),p("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),p("onBeforeInput",["compositionend","keypress","textInput","paste"]),p("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),p("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),p("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var xr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Nu=new Set("cancel close invalid load scroll toggle".split(" ").concat(xr));function cl(e,t,r){var o=e.type||"unknown-event";e.currentTarget=r,Sd(o,t,void 0,e),e.currentTarget=null}function dl(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var o=e[r],i=o.event;o=o.listeners;e:{var a=void 0;if(t)for(var d=o.length-1;0<=d;d--){var x=o[d],_=x.instance,L=x.currentTarget;if(x=x.listener,_!==a&&i.isPropagationStopped())break e;cl(i,x,L),a=_}else for(d=0;d<o.length;d++){if(x=o[d],_=x.instance,L=x.currentTarget,x=x.listener,_!==a&&i.isPropagationStopped())break e;cl(i,x,L),a=_}}}if(Or)throw e=ui,Or=!1,ui=null,e}function Le(e,t){var r=t[$i];r===void 0&&(r=t[$i]=new Set);var o=e+"__bubble";r.has(o)||(ul(t,e,2,!1),r.add(o))}function Mi(e,t,r){var o=0;t&&(o|=4),ul(r,e,o,t)}var ro="_reactListening"+Math.random().toString(36).slice(2);function _r(e){if(!e[ro]){e[ro]=!0,u.forEach(function(r){r!=="selectionchange"&&(Nu.has(r)||Mi(r,!1,e),Mi(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ro]||(t[ro]=!0,Mi("selectionchange",!1,t))}}function ul(e,t,r,o){switch(Ra(t)){case 1:var i=Ud;break;case 4:i=$d;break;default:i=_i}r=i.bind(null,t,r,e),i=void 0,!di||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),o?i!==void 0?e.addEventListener(t,r,{capture:!0,passive:i}):e.addEventListener(t,r,!0):i!==void 0?e.addEventListener(t,r,{passive:i}):e.addEventListener(t,r,!1)}function Pi(e,t,r,o,i){var a=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var d=o.tag;if(d===3||d===4){var x=o.stateNode.containerInfo;if(x===i||x.nodeType===8&&x.parentNode===i)break;if(d===4)for(d=o.return;d!==null;){var _=d.tag;if((_===3||_===4)&&(_=d.stateNode.containerInfo,_===i||_.nodeType===8&&_.parentNode===i))return;d=d.return}for(;x!==null;){if(d=dn(x),d===null)return;if(_=d.tag,_===5||_===6){o=a=d;continue e}x=x.parentNode}}o=o.return}ma(function(){var L=a,q=ai(r),Z=[];e:{var Y=al.get(e);if(Y!==void 0){var de=yi,he=e;switch(e){case"keypress":if(qr(r)===0)break e;case"keydown":case"keyup":de=ru;break;case"focusin":he="focus",de=ji;break;case"focusout":he="blur",de=ji;break;case"beforeblur":case"afterblur":de=ji;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":de=Da;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":de=Kd;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":de=su;break;case rl:case ol:case il:de=Qd;break;case sl:de=lu;break;case"scroll":de=Bd;break;case"wheel":de=du;break;case"copy":case"cut":case"paste":de=Yd;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":de=Fa}var ge=(t&4)!==0,Ue=!ge&&e==="scroll",C=ge?Y!==null?Y+"Capture":null:Y;ge=[];for(var b=L,I;b!==null;){I=b;var oe=I.stateNode;if(I.tag===5&&oe!==null&&(I=oe,C!==null&&(oe=er(b,C),oe!=null&&ge.push(wr(b,oe,I)))),Ue)break;b=b.return}0<ge.length&&(Y=new de(Y,he,null,r,q),Z.push({event:Y,listeners:ge}))}}if((t&7)===0){e:{if(Y=e==="mouseover"||e==="pointerover",de=e==="mouseout"||e==="pointerout",Y&&r!==si&&(he=r.relatedTarget||r.fromElement)&&(dn(he)||he[Mt]))break e;if((de||Y)&&(Y=q.window===q?q:(Y=q.ownerDocument)?Y.defaultView||Y.parentWindow:window,de?(he=r.relatedTarget||r.toElement,de=L,he=he?dn(he):null,he!==null&&(Ue=cn(he),he!==Ue||he.tag!==5&&he.tag!==6)&&(he=null)):(de=null,he=L),de!==he)){if(ge=Da,oe="onMouseLeave",C="onMouseEnter",b="mouse",(e==="pointerout"||e==="pointerover")&&(ge=Fa,oe="onPointerLeave",C="onPointerEnter",b="pointer"),Ue=de==null?Y:Rn(de),I=he==null?Y:Rn(he),Y=new ge(oe,b+"leave",de,r,q),Y.target=Ue,Y.relatedTarget=I,oe=null,dn(q)===L&&(ge=new ge(C,b+"enter",he,r,q),ge.target=I,ge.relatedTarget=Ue,oe=ge),Ue=oe,de&&he)t:{for(ge=de,C=he,b=0,I=ge;I;I=zn(I))b++;for(I=0,oe=C;oe;oe=zn(oe))I++;for(;0<b-I;)ge=zn(ge),b--;for(;0<I-b;)C=zn(C),I--;for(;b--;){if(ge===C||C!==null&&ge===C.alternate)break t;ge=zn(ge),C=zn(C)}ge=null}else ge=null;de!==null&&pl(Z,Y,de,ge,!1),he!==null&&Ue!==null&&pl(Z,Ue,he,ge,!0)}}e:{if(Y=L?Rn(L):window,de=Y.nodeName&&Y.nodeName.toLowerCase(),de==="select"||de==="input"&&Y.type==="file")var me=xu;else if(Ka(Y))if(Ga)me=yu;else{me=wu;var we=_u}else(de=Y.nodeName)&&de.toLowerCase()==="input"&&(Y.type==="checkbox"||Y.type==="radio")&&(me=bu);if(me&&(me=me(e,L))){Ha(Z,me,r,q);break e}we&&we(e,Y,L),e==="focusout"&&(we=Y._wrapperState)&&we.controlled&&Y.type==="number"&&kn(Y,"number",Y.value)}switch(we=L?Rn(L):window,e){case"focusin":(Ka(we)||we.contentEditable==="true")&&(An=we,Ai=L,mr=null);break;case"focusout":mr=Ai=An=null;break;case"mousedown":Ti=!0;break;case"contextmenu":case"mouseup":case"dragend":Ti=!1,tl(Z,r,q);break;case"selectionchange":if(ju)break;case"keydown":case"keyup":tl(Z,r,q)}var be;if(Ci)e:{switch(e){case"compositionstart":var ve="onCompositionStart";break e;case"compositionend":ve="onCompositionEnd";break e;case"compositionupdate":ve="onCompositionUpdate";break e}ve=void 0}else En?Ba(e,r)&&(ve="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(ve="onCompositionStart");ve&&(Oa&&r.locale!=="ko"&&(En||ve!=="onCompositionStart"?ve==="onCompositionEnd"&&En&&(be=Ma()):(Gt=q,bi="value"in Gt?Gt.value:Gt.textContent,En=!0)),we=oo(L,ve),0<we.length&&(ve=new Wa(ve,e,null,r,q),Z.push({event:ve,listeners:we}),be?ve.data=be:(be=Va(r),be!==null&&(ve.data=be)))),(be=pu?hu(e,r):fu(e,r))&&(L=oo(L,"onBeforeInput"),0<L.length&&(q=new Wa("onBeforeInput","beforeinput",null,r,q),Z.push({event:q,listeners:L}),q.data=be))}dl(Z,t)})}function wr(e,t,r){return{instance:e,listener:t,currentTarget:r}}function oo(e,t){for(var r=t+"Capture",o=[];e!==null;){var i=e,a=i.stateNode;i.tag===5&&a!==null&&(i=a,a=er(e,r),a!=null&&o.unshift(wr(e,a,i)),a=er(e,t),a!=null&&o.push(wr(e,a,i))),e=e.return}return o}function zn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function pl(e,t,r,o,i){for(var a=t._reactName,d=[];r!==null&&r!==o;){var x=r,_=x.alternate,L=x.stateNode;if(_!==null&&_===o)break;x.tag===5&&L!==null&&(x=L,i?(_=er(r,a),_!=null&&d.unshift(wr(r,_,x))):i||(_=er(r,a),_!=null&&d.push(wr(r,_,x)))),r=r.return}d.length!==0&&e.push({event:t,listeners:d})}var Iu=/\r\n?/g,Eu=/\u0000|\uFFFD/g;function hl(e){return(typeof e=="string"?e:""+e).replace(Iu,`
`).replace(Eu,"")}function io(e,t,r){if(t=hl(t),hl(e)!==t&&r)throw Error(c(425))}function so(){}var Di=null,Wi=null;function Fi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Oi=typeof setTimeout=="function"?setTimeout:void 0,Au=typeof clearTimeout=="function"?clearTimeout:void 0,fl=typeof Promise=="function"?Promise:void 0,Tu=typeof queueMicrotask=="function"?queueMicrotask:typeof fl<"u"?function(e){return fl.resolve(null).then(e).catch(zu)}:Oi;function zu(e){setTimeout(function(){throw e})}function Ui(e,t){var r=t,o=0;do{var i=r.nextSibling;if(e.removeChild(r),i&&i.nodeType===8)if(r=i.data,r==="/$"){if(o===0){e.removeChild(i),cr(t);return}o--}else r!=="$"&&r!=="$?"&&r!=="$!"||o++;r=i}while(r);cr(t)}function Xt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function gl(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var Ln=Math.random().toString(36).slice(2),Tt="__reactFiber$"+Ln,br="__reactProps$"+Ln,Mt="__reactContainer$"+Ln,$i="__reactEvents$"+Ln,Lu="__reactListeners$"+Ln,Ru="__reactHandles$"+Ln;function dn(e){var t=e[Tt];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Mt]||r[Tt]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=gl(e);e!==null;){if(r=e[Tt])return r;e=gl(e)}return t}e=r,r=e.parentNode}return null}function yr(e){return e=e[Tt]||e[Mt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Rn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(c(33))}function ao(e){return e[br]||null}var Bi=[],Mn=-1;function Yt(e){return{current:e}}function Re(e){0>Mn||(e.current=Bi[Mn],Bi[Mn]=null,Mn--)}function ze(e,t){Mn++,Bi[Mn]=e.current,e.current=t}var qt={},qe=Yt(qt),it=Yt(!1),un=qt;function Pn(e,t){var r=e.type.contextTypes;if(!r)return qt;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var i={},a;for(a in r)i[a]=t[a];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function st(e){return e=e.childContextTypes,e!=null}function lo(){Re(it),Re(qe)}function ml(e,t,r){if(qe.current!==qt)throw Error(c(168));ze(qe,t),ze(it,r)}function xl(e,t,r){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return r;o=o.getChildContext();for(var i in o)if(!(i in t))throw Error(c(108,N(e)||"Unknown",i));return F({},r,o)}function co(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||qt,un=qe.current,ze(qe,e),ze(it,it.current),!0}function _l(e,t,r){var o=e.stateNode;if(!o)throw Error(c(169));r?(e=xl(e,t,un),o.__reactInternalMemoizedMergedChildContext=e,Re(it),Re(qe),ze(qe,e)):Re(it),ze(it,r)}var Pt=null,uo=!1,Vi=!1;function wl(e){Pt===null?Pt=[e]:Pt.push(e)}function Mu(e){uo=!0,wl(e)}function Jt(){if(!Vi&&Pt!==null){Vi=!0;var e=0,t=Ae;try{var r=Pt;for(Ae=1;e<r.length;e++){var o=r[e];do o=o(!0);while(o!==null)}Pt=null,uo=!1}catch(i){throw Pt!==null&&(Pt=Pt.slice(e+1)),ya(pi,Jt),i}finally{Ae=t,Vi=!1}}return null}var Dn=[],Wn=0,po=null,ho=0,gt=[],mt=0,pn=null,Dt=1,Wt="";function hn(e,t){Dn[Wn++]=ho,Dn[Wn++]=po,po=e,ho=t}function bl(e,t,r){gt[mt++]=Dt,gt[mt++]=Wt,gt[mt++]=pn,pn=e;var o=Dt;e=Wt;var i=32-yt(o)-1;o&=~(1<<i),r+=1;var a=32-yt(t)+i;if(30<a){var d=i-i%5;a=(o&(1<<d)-1).toString(32),o>>=d,i-=d,Dt=1<<32-yt(t)+i|r<<i|o,Wt=a+e}else Dt=1<<a|r<<i|o,Wt=e}function Ki(e){e.return!==null&&(hn(e,1),bl(e,1,0))}function Hi(e){for(;e===po;)po=Dn[--Wn],Dn[Wn]=null,ho=Dn[--Wn],Dn[Wn]=null;for(;e===pn;)pn=gt[--mt],gt[mt]=null,Wt=gt[--mt],gt[mt]=null,Dt=gt[--mt],gt[mt]=null}var pt=null,ht=null,Me=!1,kt=null;function yl(e,t){var r=bt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function vl(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,pt=e,ht=Xt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,pt=e,ht=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=pn!==null?{id:Dt,overflow:Wt}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=bt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,pt=e,ht=null,!0):!1;default:return!1}}function Gi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Qi(e){if(Me){var t=ht;if(t){var r=t;if(!vl(e,t)){if(Gi(e))throw Error(c(418));t=Xt(r.nextSibling);var o=pt;t&&vl(e,t)?yl(o,r):(e.flags=e.flags&-4097|2,Me=!1,pt=e)}}else{if(Gi(e))throw Error(c(418));e.flags=e.flags&-4097|2,Me=!1,pt=e}}}function kl(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;pt=e}function fo(e){if(e!==pt)return!1;if(!Me)return kl(e),Me=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Fi(e.type,e.memoizedProps)),t&&(t=ht)){if(Gi(e))throw jl(),Error(c(418));for(;t;)yl(e,t),t=Xt(t.nextSibling)}if(kl(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){ht=Xt(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}ht=null}}else ht=pt?Xt(e.stateNode.nextSibling):null;return!0}function jl(){for(var e=ht;e;)e=Xt(e.nextSibling)}function Fn(){ht=pt=null,Me=!1}function Xi(e){kt===null?kt=[e]:kt.push(e)}var Pu=K.ReactCurrentBatchConfig;function vr(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(c(309));var o=r.stateNode}if(!o)throw Error(c(147,e));var i=o,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(d){var x=i.refs;d===null?delete x[a]:x[a]=d},t._stringRef=a,t)}if(typeof e!="string")throw Error(c(284));if(!r._owner)throw Error(c(290,e))}return e}function go(e,t){throw e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Sl(e){var t=e._init;return t(e._payload)}function Cl(e){function t(C,b){if(e){var I=C.deletions;I===null?(C.deletions=[b],C.flags|=16):I.push(b)}}function r(C,b){if(!e)return null;for(;b!==null;)t(C,b),b=b.sibling;return null}function o(C,b){for(C=new Map;b!==null;)b.key!==null?C.set(b.key,b):C.set(b.index,b),b=b.sibling;return C}function i(C,b){return C=an(C,b),C.index=0,C.sibling=null,C}function a(C,b,I){return C.index=I,e?(I=C.alternate,I!==null?(I=I.index,I<b?(C.flags|=2,b):I):(C.flags|=2,b)):(C.flags|=1048576,b)}function d(C){return e&&C.alternate===null&&(C.flags|=2),C}function x(C,b,I,oe){return b===null||b.tag!==6?(b=Os(I,C.mode,oe),b.return=C,b):(b=i(b,I),b.return=C,b)}function _(C,b,I,oe){var me=I.type;return me===ie?q(C,b,I.props.children,oe,I.key):b!==null&&(b.elementType===me||typeof me=="object"&&me!==null&&me.$$typeof===ne&&Sl(me)===b.type)?(oe=i(b,I.props),oe.ref=vr(C,b,I),oe.return=C,oe):(oe=Fo(I.type,I.key,I.props,null,C.mode,oe),oe.ref=vr(C,b,I),oe.return=C,oe)}function L(C,b,I,oe){return b===null||b.tag!==4||b.stateNode.containerInfo!==I.containerInfo||b.stateNode.implementation!==I.implementation?(b=Us(I,C.mode,oe),b.return=C,b):(b=i(b,I.children||[]),b.return=C,b)}function q(C,b,I,oe,me){return b===null||b.tag!==7?(b=yn(I,C.mode,oe,me),b.return=C,b):(b=i(b,I),b.return=C,b)}function Z(C,b,I){if(typeof b=="string"&&b!==""||typeof b=="number")return b=Os(""+b,C.mode,I),b.return=C,b;if(typeof b=="object"&&b!==null){switch(b.$$typeof){case $:return I=Fo(b.type,b.key,b.props,null,C.mode,I),I.ref=vr(C,null,b),I.return=C,I;case X:return b=Us(b,C.mode,I),b.return=C,b;case ne:var oe=b._init;return Z(C,oe(b._payload),I)}if(qn(b)||P(b))return b=yn(b,C.mode,I,null),b.return=C,b;go(C,b)}return null}function Y(C,b,I,oe){var me=b!==null?b.key:null;if(typeof I=="string"&&I!==""||typeof I=="number")return me!==null?null:x(C,b,""+I,oe);if(typeof I=="object"&&I!==null){switch(I.$$typeof){case $:return I.key===me?_(C,b,I,oe):null;case X:return I.key===me?L(C,b,I,oe):null;case ne:return me=I._init,Y(C,b,me(I._payload),oe)}if(qn(I)||P(I))return me!==null?null:q(C,b,I,oe,null);go(C,I)}return null}function de(C,b,I,oe,me){if(typeof oe=="string"&&oe!==""||typeof oe=="number")return C=C.get(I)||null,x(b,C,""+oe,me);if(typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case $:return C=C.get(oe.key===null?I:oe.key)||null,_(b,C,oe,me);case X:return C=C.get(oe.key===null?I:oe.key)||null,L(b,C,oe,me);case ne:var we=oe._init;return de(C,b,I,we(oe._payload),me)}if(qn(oe)||P(oe))return C=C.get(I)||null,q(b,C,oe,me,null);go(b,oe)}return null}function he(C,b,I,oe){for(var me=null,we=null,be=b,ve=b=0,Qe=null;be!==null&&ve<I.length;ve++){be.index>ve?(Qe=be,be=null):Qe=be.sibling;var Ie=Y(C,be,I[ve],oe);if(Ie===null){be===null&&(be=Qe);break}e&&be&&Ie.alternate===null&&t(C,be),b=a(Ie,b,ve),we===null?me=Ie:we.sibling=Ie,we=Ie,be=Qe}if(ve===I.length)return r(C,be),Me&&hn(C,ve),me;if(be===null){for(;ve<I.length;ve++)be=Z(C,I[ve],oe),be!==null&&(b=a(be,b,ve),we===null?me=be:we.sibling=be,we=be);return Me&&hn(C,ve),me}for(be=o(C,be);ve<I.length;ve++)Qe=de(be,C,ve,I[ve],oe),Qe!==null&&(e&&Qe.alternate!==null&&be.delete(Qe.key===null?ve:Qe.key),b=a(Qe,b,ve),we===null?me=Qe:we.sibling=Qe,we=Qe);return e&&be.forEach(function(ln){return t(C,ln)}),Me&&hn(C,ve),me}function ge(C,b,I,oe){var me=P(I);if(typeof me!="function")throw Error(c(150));if(I=me.call(I),I==null)throw Error(c(151));for(var we=me=null,be=b,ve=b=0,Qe=null,Ie=I.next();be!==null&&!Ie.done;ve++,Ie=I.next()){be.index>ve?(Qe=be,be=null):Qe=be.sibling;var ln=Y(C,be,Ie.value,oe);if(ln===null){be===null&&(be=Qe);break}e&&be&&ln.alternate===null&&t(C,be),b=a(ln,b,ve),we===null?me=ln:we.sibling=ln,we=ln,be=Qe}if(Ie.done)return r(C,be),Me&&hn(C,ve),me;if(be===null){for(;!Ie.done;ve++,Ie=I.next())Ie=Z(C,Ie.value,oe),Ie!==null&&(b=a(Ie,b,ve),we===null?me=Ie:we.sibling=Ie,we=Ie);return Me&&hn(C,ve),me}for(be=o(C,be);!Ie.done;ve++,Ie=I.next())Ie=de(be,C,ve,Ie.value,oe),Ie!==null&&(e&&Ie.alternate!==null&&be.delete(Ie.key===null?ve:Ie.key),b=a(Ie,b,ve),we===null?me=Ie:we.sibling=Ie,we=Ie);return e&&be.forEach(function(gp){return t(C,gp)}),Me&&hn(C,ve),me}function Ue(C,b,I,oe){if(typeof I=="object"&&I!==null&&I.type===ie&&I.key===null&&(I=I.props.children),typeof I=="object"&&I!==null){switch(I.$$typeof){case $:e:{for(var me=I.key,we=b;we!==null;){if(we.key===me){if(me=I.type,me===ie){if(we.tag===7){r(C,we.sibling),b=i(we,I.props.children),b.return=C,C=b;break e}}else if(we.elementType===me||typeof me=="object"&&me!==null&&me.$$typeof===ne&&Sl(me)===we.type){r(C,we.sibling),b=i(we,I.props),b.ref=vr(C,we,I),b.return=C,C=b;break e}r(C,we);break}else t(C,we);we=we.sibling}I.type===ie?(b=yn(I.props.children,C.mode,oe,I.key),b.return=C,C=b):(oe=Fo(I.type,I.key,I.props,null,C.mode,oe),oe.ref=vr(C,b,I),oe.return=C,C=oe)}return d(C);case X:e:{for(we=I.key;b!==null;){if(b.key===we)if(b.tag===4&&b.stateNode.containerInfo===I.containerInfo&&b.stateNode.implementation===I.implementation){r(C,b.sibling),b=i(b,I.children||[]),b.return=C,C=b;break e}else{r(C,b);break}else t(C,b);b=b.sibling}b=Us(I,C.mode,oe),b.return=C,C=b}return d(C);case ne:return we=I._init,Ue(C,b,we(I._payload),oe)}if(qn(I))return he(C,b,I,oe);if(P(I))return ge(C,b,I,oe);go(C,I)}return typeof I=="string"&&I!==""||typeof I=="number"?(I=""+I,b!==null&&b.tag===6?(r(C,b.sibling),b=i(b,I),b.return=C,C=b):(r(C,b),b=Os(I,C.mode,oe),b.return=C,C=b),d(C)):r(C,b)}return Ue}var On=Cl(!0),Nl=Cl(!1),mo=Yt(null),xo=null,Un=null,Yi=null;function qi(){Yi=Un=xo=null}function Ji(e){var t=mo.current;Re(mo),e._currentValue=t}function Zi(e,t,r){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===r)break;e=e.return}}function $n(e,t){xo=e,Yi=Un=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(at=!0),e.firstContext=null)}function xt(e){var t=e._currentValue;if(Yi!==e)if(e={context:e,memoizedValue:t,next:null},Un===null){if(xo===null)throw Error(c(308));Un=e,xo.dependencies={lanes:0,firstContext:e}}else Un=Un.next=e;return t}var fn=null;function es(e){fn===null?fn=[e]:fn.push(e)}function Il(e,t,r,o){var i=t.interleaved;return i===null?(r.next=r,es(t)):(r.next=i.next,i.next=r),t.interleaved=r,Ft(e,o)}function Ft(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var Zt=!1;function ts(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function El(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Ot(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function en(e,t,r){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ce&2)!==0){var i=o.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),o.pending=t,Ft(e,r)}return i=o.interleaved,i===null?(t.next=t,es(o)):(t.next=i.next,i.next=t),o.interleaved=t,Ft(e,r)}function _o(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,gi(e,r)}}function Al(e,t){var r=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,r===o)){var i=null,a=null;if(r=r.firstBaseUpdate,r!==null){do{var d={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};a===null?i=a=d:a=a.next=d,r=r.next}while(r!==null);a===null?i=a=t:a=a.next=t}else i=a=t;r={baseState:o.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:o.shared,effects:o.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function wo(e,t,r,o){var i=e.updateQueue;Zt=!1;var a=i.firstBaseUpdate,d=i.lastBaseUpdate,x=i.shared.pending;if(x!==null){i.shared.pending=null;var _=x,L=_.next;_.next=null,d===null?a=L:d.next=L,d=_;var q=e.alternate;q!==null&&(q=q.updateQueue,x=q.lastBaseUpdate,x!==d&&(x===null?q.firstBaseUpdate=L:x.next=L,q.lastBaseUpdate=_))}if(a!==null){var Z=i.baseState;d=0,q=L=_=null,x=a;do{var Y=x.lane,de=x.eventTime;if((o&Y)===Y){q!==null&&(q=q.next={eventTime:de,lane:0,tag:x.tag,payload:x.payload,callback:x.callback,next:null});e:{var he=e,ge=x;switch(Y=t,de=r,ge.tag){case 1:if(he=ge.payload,typeof he=="function"){Z=he.call(de,Z,Y);break e}Z=he;break e;case 3:he.flags=he.flags&-65537|128;case 0:if(he=ge.payload,Y=typeof he=="function"?he.call(de,Z,Y):he,Y==null)break e;Z=F({},Z,Y);break e;case 2:Zt=!0}}x.callback!==null&&x.lane!==0&&(e.flags|=64,Y=i.effects,Y===null?i.effects=[x]:Y.push(x))}else de={eventTime:de,lane:Y,tag:x.tag,payload:x.payload,callback:x.callback,next:null},q===null?(L=q=de,_=Z):q=q.next=de,d|=Y;if(x=x.next,x===null){if(x=i.shared.pending,x===null)break;Y=x,x=Y.next,Y.next=null,i.lastBaseUpdate=Y,i.shared.pending=null}}while(!0);if(q===null&&(_=Z),i.baseState=_,i.firstBaseUpdate=L,i.lastBaseUpdate=q,t=i.shared.interleaved,t!==null){i=t;do d|=i.lane,i=i.next;while(i!==t)}else a===null&&(i.shared.lanes=0);xn|=d,e.lanes=d,e.memoizedState=Z}}function Tl(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],i=o.callback;if(i!==null){if(o.callback=null,o=r,typeof i!="function")throw Error(c(191,i));i.call(o)}}}var kr={},zt=Yt(kr),jr=Yt(kr),Sr=Yt(kr);function gn(e){if(e===kr)throw Error(c(174));return e}function ns(e,t){switch(ze(Sr,t),ze(jr,e),ze(zt,kr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ri(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ri(t,e)}Re(zt),ze(zt,t)}function Bn(){Re(zt),Re(jr),Re(Sr)}function zl(e){gn(Sr.current);var t=gn(zt.current),r=ri(t,e.type);t!==r&&(ze(jr,e),ze(zt,r))}function rs(e){jr.current===e&&(Re(zt),Re(jr))}var Pe=Yt(0);function bo(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var os=[];function is(){for(var e=0;e<os.length;e++)os[e]._workInProgressVersionPrimary=null;os.length=0}var yo=K.ReactCurrentDispatcher,ss=K.ReactCurrentBatchConfig,mn=0,De=null,Be=null,He=null,vo=!1,Cr=!1,Nr=0,Du=0;function Je(){throw Error(c(321))}function as(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!vt(e[r],t[r]))return!1;return!0}function ls(e,t,r,o,i,a){if(mn=a,De=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,yo.current=e===null||e.memoizedState===null?Uu:$u,e=r(o,i),Cr){a=0;do{if(Cr=!1,Nr=0,25<=a)throw Error(c(301));a+=1,He=Be=null,t.updateQueue=null,yo.current=Bu,e=r(o,i)}while(Cr)}if(yo.current=So,t=Be!==null&&Be.next!==null,mn=0,He=Be=De=null,vo=!1,t)throw Error(c(300));return e}function cs(){var e=Nr!==0;return Nr=0,e}function Lt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return He===null?De.memoizedState=He=e:He=He.next=e,He}function _t(){if(Be===null){var e=De.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var t=He===null?De.memoizedState:He.next;if(t!==null)He=t,Be=e;else{if(e===null)throw Error(c(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},He===null?De.memoizedState=He=e:He=He.next=e}return He}function Ir(e,t){return typeof t=="function"?t(e):t}function ds(e){var t=_t(),r=t.queue;if(r===null)throw Error(c(311));r.lastRenderedReducer=e;var o=Be,i=o.baseQueue,a=r.pending;if(a!==null){if(i!==null){var d=i.next;i.next=a.next,a.next=d}o.baseQueue=i=a,r.pending=null}if(i!==null){a=i.next,o=o.baseState;var x=d=null,_=null,L=a;do{var q=L.lane;if((mn&q)===q)_!==null&&(_=_.next={lane:0,action:L.action,hasEagerState:L.hasEagerState,eagerState:L.eagerState,next:null}),o=L.hasEagerState?L.eagerState:e(o,L.action);else{var Z={lane:q,action:L.action,hasEagerState:L.hasEagerState,eagerState:L.eagerState,next:null};_===null?(x=_=Z,d=o):_=_.next=Z,De.lanes|=q,xn|=q}L=L.next}while(L!==null&&L!==a);_===null?d=o:_.next=x,vt(o,t.memoizedState)||(at=!0),t.memoizedState=o,t.baseState=d,t.baseQueue=_,r.lastRenderedState=o}if(e=r.interleaved,e!==null){i=e;do a=i.lane,De.lanes|=a,xn|=a,i=i.next;while(i!==e)}else i===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function us(e){var t=_t(),r=t.queue;if(r===null)throw Error(c(311));r.lastRenderedReducer=e;var o=r.dispatch,i=r.pending,a=t.memoizedState;if(i!==null){r.pending=null;var d=i=i.next;do a=e(a,d.action),d=d.next;while(d!==i);vt(a,t.memoizedState)||(at=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),r.lastRenderedState=a}return[a,o]}function Ll(){}function Rl(e,t){var r=De,o=_t(),i=t(),a=!vt(o.memoizedState,i);if(a&&(o.memoizedState=i,at=!0),o=o.queue,ps(Dl.bind(null,r,o,e),[e]),o.getSnapshot!==t||a||He!==null&&He.memoizedState.tag&1){if(r.flags|=2048,Er(9,Pl.bind(null,r,o,i,t),void 0,null),Ge===null)throw Error(c(349));(mn&30)!==0||Ml(r,t,i)}return i}function Ml(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=De.updateQueue,t===null?(t={lastEffect:null,stores:null},De.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function Pl(e,t,r,o){t.value=r,t.getSnapshot=o,Wl(t)&&Fl(e)}function Dl(e,t,r){return r(function(){Wl(t)&&Fl(e)})}function Wl(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!vt(e,r)}catch{return!0}}function Fl(e){var t=Ft(e,1);t!==null&&Nt(t,e,1,-1)}function Ol(e){var t=Lt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ir,lastRenderedState:e},t.queue=e,e=e.dispatch=Ou.bind(null,De,e),[t.memoizedState,e]}function Er(e,t,r,o){return e={tag:e,create:t,destroy:r,deps:o,next:null},t=De.updateQueue,t===null?(t={lastEffect:null,stores:null},De.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(o=r.next,r.next=e,e.next=o,t.lastEffect=e)),e}function Ul(){return _t().memoizedState}function ko(e,t,r,o){var i=Lt();De.flags|=e,i.memoizedState=Er(1|t,r,void 0,o===void 0?null:o)}function jo(e,t,r,o){var i=_t();o=o===void 0?null:o;var a=void 0;if(Be!==null){var d=Be.memoizedState;if(a=d.destroy,o!==null&&as(o,d.deps)){i.memoizedState=Er(t,r,a,o);return}}De.flags|=e,i.memoizedState=Er(1|t,r,a,o)}function $l(e,t){return ko(8390656,8,e,t)}function ps(e,t){return jo(2048,8,e,t)}function Bl(e,t){return jo(4,2,e,t)}function Vl(e,t){return jo(4,4,e,t)}function Kl(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Hl(e,t,r){return r=r!=null?r.concat([e]):null,jo(4,4,Kl.bind(null,t,e),r)}function hs(){}function Gl(e,t){var r=_t();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&as(t,o[1])?o[0]:(r.memoizedState=[e,t],e)}function Ql(e,t){var r=_t();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&as(t,o[1])?o[0]:(e=e(),r.memoizedState=[e,t],e)}function Xl(e,t,r){return(mn&21)===0?(e.baseState&&(e.baseState=!1,at=!0),e.memoizedState=r):(vt(r,t)||(r=Sa(),De.lanes|=r,xn|=r,e.baseState=!0),t)}function Wu(e,t){var r=Ae;Ae=r!==0&&4>r?r:4,e(!0);var o=ss.transition;ss.transition={};try{e(!1),t()}finally{Ae=r,ss.transition=o}}function Yl(){return _t().memoizedState}function Fu(e,t,r){var o=on(e);if(r={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null},ql(e))Jl(t,r);else if(r=Il(e,t,r,o),r!==null){var i=rt();Nt(r,e,o,i),Zl(r,t,o)}}function Ou(e,t,r){var o=on(e),i={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null};if(ql(e))Jl(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var d=t.lastRenderedState,x=a(d,r);if(i.hasEagerState=!0,i.eagerState=x,vt(x,d)){var _=t.interleaved;_===null?(i.next=i,es(t)):(i.next=_.next,_.next=i),t.interleaved=i;return}}catch{}r=Il(e,t,i,o),r!==null&&(i=rt(),Nt(r,e,o,i),Zl(r,t,o))}}function ql(e){var t=e.alternate;return e===De||t!==null&&t===De}function Jl(e,t){Cr=vo=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function Zl(e,t,r){if((r&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,gi(e,r)}}var So={readContext:xt,useCallback:Je,useContext:Je,useEffect:Je,useImperativeHandle:Je,useInsertionEffect:Je,useLayoutEffect:Je,useMemo:Je,useReducer:Je,useRef:Je,useState:Je,useDebugValue:Je,useDeferredValue:Je,useTransition:Je,useMutableSource:Je,useSyncExternalStore:Je,useId:Je,unstable_isNewReconciler:!1},Uu={readContext:xt,useCallback:function(e,t){return Lt().memoizedState=[e,t===void 0?null:t],e},useContext:xt,useEffect:$l,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,ko(4194308,4,Kl.bind(null,t,e),r)},useLayoutEffect:function(e,t){return ko(4194308,4,e,t)},useInsertionEffect:function(e,t){return ko(4,2,e,t)},useMemo:function(e,t){var r=Lt();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var o=Lt();return t=r!==void 0?r(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=Fu.bind(null,De,e),[o.memoizedState,e]},useRef:function(e){var t=Lt();return e={current:e},t.memoizedState=e},useState:Ol,useDebugValue:hs,useDeferredValue:function(e){return Lt().memoizedState=e},useTransition:function(){var e=Ol(!1),t=e[0];return e=Wu.bind(null,e[1]),Lt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var o=De,i=Lt();if(Me){if(r===void 0)throw Error(c(407));r=r()}else{if(r=t(),Ge===null)throw Error(c(349));(mn&30)!==0||Ml(o,t,r)}i.memoizedState=r;var a={value:r,getSnapshot:t};return i.queue=a,$l(Dl.bind(null,o,a,e),[e]),o.flags|=2048,Er(9,Pl.bind(null,o,a,r,t),void 0,null),r},useId:function(){var e=Lt(),t=Ge.identifierPrefix;if(Me){var r=Wt,o=Dt;r=(o&~(1<<32-yt(o)-1)).toString(32)+r,t=":"+t+"R"+r,r=Nr++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=Du++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},$u={readContext:xt,useCallback:Gl,useContext:xt,useEffect:ps,useImperativeHandle:Hl,useInsertionEffect:Bl,useLayoutEffect:Vl,useMemo:Ql,useReducer:ds,useRef:Ul,useState:function(){return ds(Ir)},useDebugValue:hs,useDeferredValue:function(e){var t=_t();return Xl(t,Be.memoizedState,e)},useTransition:function(){var e=ds(Ir)[0],t=_t().memoizedState;return[e,t]},useMutableSource:Ll,useSyncExternalStore:Rl,useId:Yl,unstable_isNewReconciler:!1},Bu={readContext:xt,useCallback:Gl,useContext:xt,useEffect:ps,useImperativeHandle:Hl,useInsertionEffect:Bl,useLayoutEffect:Vl,useMemo:Ql,useReducer:us,useRef:Ul,useState:function(){return us(Ir)},useDebugValue:hs,useDeferredValue:function(e){var t=_t();return Be===null?t.memoizedState=e:Xl(t,Be.memoizedState,e)},useTransition:function(){var e=us(Ir)[0],t=_t().memoizedState;return[e,t]},useMutableSource:Ll,useSyncExternalStore:Rl,useId:Yl,unstable_isNewReconciler:!1};function jt(e,t){if(e&&e.defaultProps){t=F({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function fs(e,t,r,o){t=e.memoizedState,r=r(o,t),r=r==null?t:F({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Co={isMounted:function(e){return(e=e._reactInternals)?cn(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var o=rt(),i=on(e),a=Ot(o,i);a.payload=t,r!=null&&(a.callback=r),t=en(e,a,i),t!==null&&(Nt(t,e,i,o),_o(t,e,i))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var o=rt(),i=on(e),a=Ot(o,i);a.tag=1,a.payload=t,r!=null&&(a.callback=r),t=en(e,a,i),t!==null&&(Nt(t,e,i,o),_o(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=rt(),o=on(e),i=Ot(r,o);i.tag=2,t!=null&&(i.callback=t),t=en(e,i,o),t!==null&&(Nt(t,e,o,r),_o(t,e,o))}};function ec(e,t,r,o,i,a,d){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,a,d):t.prototype&&t.prototype.isPureReactComponent?!gr(r,o)||!gr(i,a):!0}function tc(e,t,r){var o=!1,i=qt,a=t.contextType;return typeof a=="object"&&a!==null?a=xt(a):(i=st(t)?un:qe.current,o=t.contextTypes,a=(o=o!=null)?Pn(e,i):qt),t=new t(r,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Co,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=a),t}function nc(e,t,r,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,o),t.state!==e&&Co.enqueueReplaceState(t,t.state,null)}function gs(e,t,r,o){var i=e.stateNode;i.props=r,i.state=e.memoizedState,i.refs={},ts(e);var a=t.contextType;typeof a=="object"&&a!==null?i.context=xt(a):(a=st(t)?un:qe.current,i.context=Pn(e,a)),i.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(fs(e,t,a,r),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&Co.enqueueReplaceState(i,i.state,null),wo(e,r,i,o),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function Vn(e,t){try{var r="",o=t;do r+=T(o),o=o.return;while(o);var i=r}catch(a){i=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:i,digest:null}}function ms(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function xs(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var Vu=typeof WeakMap=="function"?WeakMap:Map;function rc(e,t,r){r=Ot(-1,r),r.tag=3,r.payload={element:null};var o=t.value;return r.callback=function(){Lo||(Lo=!0,zs=o),xs(e,t)},r}function oc(e,t,r){r=Ot(-1,r),r.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var i=t.value;r.payload=function(){return o(i)},r.callback=function(){xs(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(r.callback=function(){xs(e,t),typeof o!="function"&&(nn===null?nn=new Set([this]):nn.add(this));var d=t.stack;this.componentDidCatch(t.value,{componentStack:d!==null?d:""})}),r}function ic(e,t,r){var o=e.pingCache;if(o===null){o=e.pingCache=new Vu;var i=new Set;o.set(t,i)}else i=o.get(t),i===void 0&&(i=new Set,o.set(t,i));i.has(r)||(i.add(r),e=op.bind(null,e,t,r),t.then(e,e))}function sc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function ac(e,t,r,o,i){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=Ot(-1,1),t.tag=2,en(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=i,e)}var Ku=K.ReactCurrentOwner,at=!1;function nt(e,t,r,o){t.child=e===null?Nl(t,null,r,o):On(t,e.child,r,o)}function lc(e,t,r,o,i){r=r.render;var a=t.ref;return $n(t,i),o=ls(e,t,r,o,a,i),r=cs(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ut(e,t,i)):(Me&&r&&Ki(t),t.flags|=1,nt(e,t,o,i),t.child)}function cc(e,t,r,o,i){if(e===null){var a=r.type;return typeof a=="function"&&!Fs(a)&&a.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=a,dc(e,t,a,o,i)):(e=Fo(r.type,null,o,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&i)===0){var d=a.memoizedProps;if(r=r.compare,r=r!==null?r:gr,r(d,o)&&e.ref===t.ref)return Ut(e,t,i)}return t.flags|=1,e=an(a,o),e.ref=t.ref,e.return=t,t.child=e}function dc(e,t,r,o,i){if(e!==null){var a=e.memoizedProps;if(gr(a,o)&&e.ref===t.ref)if(at=!1,t.pendingProps=o=a,(e.lanes&i)!==0)(e.flags&131072)!==0&&(at=!0);else return t.lanes=e.lanes,Ut(e,t,i)}return _s(e,t,r,o,i)}function uc(e,t,r){var o=t.pendingProps,i=o.children,a=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ze(Hn,ft),ft|=r;else{if((r&1073741824)===0)return e=a!==null?a.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ze(Hn,ft),ft|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=a!==null?a.baseLanes:r,ze(Hn,ft),ft|=o}else a!==null?(o=a.baseLanes|r,t.memoizedState=null):o=r,ze(Hn,ft),ft|=o;return nt(e,t,i,r),t.child}function pc(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function _s(e,t,r,o,i){var a=st(r)?un:qe.current;return a=Pn(t,a),$n(t,i),r=ls(e,t,r,o,a,i),o=cs(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ut(e,t,i)):(Me&&o&&Ki(t),t.flags|=1,nt(e,t,r,i),t.child)}function hc(e,t,r,o,i){if(st(r)){var a=!0;co(t)}else a=!1;if($n(t,i),t.stateNode===null)Io(e,t),tc(t,r,o),gs(t,r,o,i),o=!0;else if(e===null){var d=t.stateNode,x=t.memoizedProps;d.props=x;var _=d.context,L=r.contextType;typeof L=="object"&&L!==null?L=xt(L):(L=st(r)?un:qe.current,L=Pn(t,L));var q=r.getDerivedStateFromProps,Z=typeof q=="function"||typeof d.getSnapshotBeforeUpdate=="function";Z||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(x!==o||_!==L)&&nc(t,d,o,L),Zt=!1;var Y=t.memoizedState;d.state=Y,wo(t,o,d,i),_=t.memoizedState,x!==o||Y!==_||it.current||Zt?(typeof q=="function"&&(fs(t,r,q,o),_=t.memoizedState),(x=Zt||ec(t,r,x,o,Y,_,L))?(Z||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(t.flags|=4194308)):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=_),d.props=o,d.state=_,d.context=L,o=x):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{d=t.stateNode,El(e,t),x=t.memoizedProps,L=t.type===t.elementType?x:jt(t.type,x),d.props=L,Z=t.pendingProps,Y=d.context,_=r.contextType,typeof _=="object"&&_!==null?_=xt(_):(_=st(r)?un:qe.current,_=Pn(t,_));var de=r.getDerivedStateFromProps;(q=typeof de=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(x!==Z||Y!==_)&&nc(t,d,o,_),Zt=!1,Y=t.memoizedState,d.state=Y,wo(t,o,d,i);var he=t.memoizedState;x!==Z||Y!==he||it.current||Zt?(typeof de=="function"&&(fs(t,r,de,o),he=t.memoizedState),(L=Zt||ec(t,r,L,o,Y,he,_)||!1)?(q||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(o,he,_),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(o,he,_)),typeof d.componentDidUpdate=="function"&&(t.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof d.componentDidUpdate!="function"||x===e.memoizedProps&&Y===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&Y===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=he),d.props=o,d.state=he,d.context=_,o=L):(typeof d.componentDidUpdate!="function"||x===e.memoizedProps&&Y===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&Y===e.memoizedState||(t.flags|=1024),o=!1)}return ws(e,t,r,o,a,i)}function ws(e,t,r,o,i,a){pc(e,t);var d=(t.flags&128)!==0;if(!o&&!d)return i&&_l(t,r,!1),Ut(e,t,a);o=t.stateNode,Ku.current=t;var x=d&&typeof r.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&d?(t.child=On(t,e.child,null,a),t.child=On(t,null,x,a)):nt(e,t,x,a),t.memoizedState=o.state,i&&_l(t,r,!0),t.child}function fc(e){var t=e.stateNode;t.pendingContext?ml(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ml(e,t.context,!1),ns(e,t.containerInfo)}function gc(e,t,r,o,i){return Fn(),Xi(i),t.flags|=256,nt(e,t,r,o),t.child}var bs={dehydrated:null,treeContext:null,retryLane:0};function ys(e){return{baseLanes:e,cachePool:null,transitions:null}}function mc(e,t,r){var o=t.pendingProps,i=Pe.current,a=!1,d=(t.flags&128)!==0,x;if((x=d)||(x=e!==null&&e.memoizedState===null?!1:(i&2)!==0),x?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),ze(Pe,i&1),e===null)return Qi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(d=o.children,e=o.fallback,a?(o=t.mode,a=t.child,d={mode:"hidden",children:d},(o&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=d):a=Oo(d,o,0,null),e=yn(e,o,r,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=ys(r),t.memoizedState=bs,e):vs(t,d));if(i=e.memoizedState,i!==null&&(x=i.dehydrated,x!==null))return Hu(e,t,d,o,x,i,r);if(a){a=o.fallback,d=t.mode,i=e.child,x=i.sibling;var _={mode:"hidden",children:o.children};return(d&1)===0&&t.child!==i?(o=t.child,o.childLanes=0,o.pendingProps=_,t.deletions=null):(o=an(i,_),o.subtreeFlags=i.subtreeFlags&14680064),x!==null?a=an(x,a):(a=yn(a,d,r,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,o=a,a=t.child,d=e.child.memoizedState,d=d===null?ys(r):{baseLanes:d.baseLanes|r,cachePool:null,transitions:d.transitions},a.memoizedState=d,a.childLanes=e.childLanes&~r,t.memoizedState=bs,o}return a=e.child,e=a.sibling,o=an(a,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=r),o.return=t,o.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=o,t.memoizedState=null,o}function vs(e,t){return t=Oo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function No(e,t,r,o){return o!==null&&Xi(o),On(t,e.child,null,r),e=vs(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Hu(e,t,r,o,i,a,d){if(r)return t.flags&256?(t.flags&=-257,o=ms(Error(c(422))),No(e,t,d,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=o.fallback,i=t.mode,o=Oo({mode:"visible",children:o.children},i,0,null),a=yn(a,i,d,null),a.flags|=2,o.return=t,a.return=t,o.sibling=a,t.child=o,(t.mode&1)!==0&&On(t,e.child,null,d),t.child.memoizedState=ys(d),t.memoizedState=bs,a);if((t.mode&1)===0)return No(e,t,d,null);if(i.data==="$!"){if(o=i.nextSibling&&i.nextSibling.dataset,o)var x=o.dgst;return o=x,a=Error(c(419)),o=ms(a,o,void 0),No(e,t,d,o)}if(x=(d&e.childLanes)!==0,at||x){if(o=Ge,o!==null){switch(d&-d){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=(i&(o.suspendedLanes|d))!==0?0:i,i!==0&&i!==a.retryLane&&(a.retryLane=i,Ft(e,i),Nt(o,e,i,-1))}return Ws(),o=ms(Error(c(421))),No(e,t,d,o)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=ip.bind(null,e),i._reactRetry=t,null):(e=a.treeContext,ht=Xt(i.nextSibling),pt=t,Me=!0,kt=null,e!==null&&(gt[mt++]=Dt,gt[mt++]=Wt,gt[mt++]=pn,Dt=e.id,Wt=e.overflow,pn=t),t=vs(t,o.children),t.flags|=4096,t)}function xc(e,t,r){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Zi(e.return,t,r)}function ks(e,t,r,o,i){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:r,tailMode:i}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=o,a.tail=r,a.tailMode=i)}function _c(e,t,r){var o=t.pendingProps,i=o.revealOrder,a=o.tail;if(nt(e,t,o.children,r),o=Pe.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&xc(e,r,t);else if(e.tag===19)xc(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(ze(Pe,o),(t.mode&1)===0)t.memoizedState=null;else switch(i){case"forwards":for(r=t.child,i=null;r!==null;)e=r.alternate,e!==null&&bo(e)===null&&(i=r),r=r.sibling;r=i,r===null?(i=t.child,t.child=null):(i=r.sibling,r.sibling=null),ks(t,!1,i,r,a);break;case"backwards":for(r=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&bo(e)===null){t.child=i;break}e=i.sibling,i.sibling=r,r=i,i=e}ks(t,!0,r,null,a);break;case"together":ks(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Io(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ut(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),xn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,r=an(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=an(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function Gu(e,t,r){switch(t.tag){case 3:fc(t),Fn();break;case 5:zl(t);break;case 1:st(t.type)&&co(t);break;case 4:ns(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,i=t.memoizedProps.value;ze(mo,o._currentValue),o._currentValue=i;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(ze(Pe,Pe.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?mc(e,t,r):(ze(Pe,Pe.current&1),e=Ut(e,t,r),e!==null?e.sibling:null);ze(Pe,Pe.current&1);break;case 19:if(o=(r&t.childLanes)!==0,(e.flags&128)!==0){if(o)return _c(e,t,r);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),ze(Pe,Pe.current),o)break;return null;case 22:case 23:return t.lanes=0,uc(e,t,r)}return Ut(e,t,r)}var wc,js,bc,yc;wc=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},js=function(){},bc=function(e,t,r,o){var i=e.memoizedProps;if(i!==o){e=t.stateNode,gn(zt.current);var a=null;switch(r){case"input":i=ye(e,i),o=ye(e,o),a=[];break;case"select":i=F({},i,{value:void 0}),o=F({},o,{value:void 0}),a=[];break;case"textarea":i=ni(e,i),o=ni(e,o),a=[];break;default:typeof i.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=so)}oi(r,o);var d;r=null;for(L in i)if(!o.hasOwnProperty(L)&&i.hasOwnProperty(L)&&i[L]!=null)if(L==="style"){var x=i[L];for(d in x)x.hasOwnProperty(d)&&(r||(r={}),r[d]="")}else L!=="dangerouslySetInnerHTML"&&L!=="children"&&L!=="suppressContentEditableWarning"&&L!=="suppressHydrationWarning"&&L!=="autoFocus"&&(f.hasOwnProperty(L)?a||(a=[]):(a=a||[]).push(L,null));for(L in o){var _=o[L];if(x=i?.[L],o.hasOwnProperty(L)&&_!==x&&(_!=null||x!=null))if(L==="style")if(x){for(d in x)!x.hasOwnProperty(d)||_&&_.hasOwnProperty(d)||(r||(r={}),r[d]="");for(d in _)_.hasOwnProperty(d)&&x[d]!==_[d]&&(r||(r={}),r[d]=_[d])}else r||(a||(a=[]),a.push(L,r)),r=_;else L==="dangerouslySetInnerHTML"?(_=_?_.__html:void 0,x=x?x.__html:void 0,_!=null&&x!==_&&(a=a||[]).push(L,_)):L==="children"?typeof _!="string"&&typeof _!="number"||(a=a||[]).push(L,""+_):L!=="suppressContentEditableWarning"&&L!=="suppressHydrationWarning"&&(f.hasOwnProperty(L)?(_!=null&&L==="onScroll"&&Le("scroll",e),a||x===_||(a=[])):(a=a||[]).push(L,_))}r&&(a=a||[]).push("style",r);var L=a;(t.updateQueue=L)&&(t.flags|=4)}},yc=function(e,t,r,o){r!==o&&(t.flags|=4)};function Ar(e,t){if(!Me)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,o=0;if(t)for(var i=e.child;i!==null;)r|=i.lanes|i.childLanes,o|=i.subtreeFlags&14680064,o|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)r|=i.lanes|i.childLanes,o|=i.subtreeFlags,o|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=o,e.childLanes=r,t}function Qu(e,t,r){var o=t.pendingProps;switch(Hi(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ze(t),null;case 1:return st(t.type)&&lo(),Ze(t),null;case 3:return o=t.stateNode,Bn(),Re(it),Re(qe),is(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(fo(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,kt!==null&&(Ms(kt),kt=null))),js(e,t),Ze(t),null;case 5:rs(t);var i=gn(Sr.current);if(r=t.type,e!==null&&t.stateNode!=null)bc(e,t,r,o,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(c(166));return Ze(t),null}if(e=gn(zt.current),fo(t)){o=t.stateNode,r=t.type;var a=t.memoizedProps;switch(o[Tt]=t,o[br]=a,e=(t.mode&1)!==0,r){case"dialog":Le("cancel",o),Le("close",o);break;case"iframe":case"object":case"embed":Le("load",o);break;case"video":case"audio":for(i=0;i<xr.length;i++)Le(xr[i],o);break;case"source":Le("error",o);break;case"img":case"image":case"link":Le("error",o),Le("load",o);break;case"details":Le("toggle",o);break;case"input":Se(o,a),Le("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!a.multiple},Le("invalid",o);break;case"textarea":oa(o,a),Le("invalid",o)}oi(r,a),i=null;for(var d in a)if(a.hasOwnProperty(d)){var x=a[d];d==="children"?typeof x=="string"?o.textContent!==x&&(a.suppressHydrationWarning!==!0&&io(o.textContent,x,e),i=["children",x]):typeof x=="number"&&o.textContent!==""+x&&(a.suppressHydrationWarning!==!0&&io(o.textContent,x,e),i=["children",""+x]):f.hasOwnProperty(d)&&x!=null&&d==="onScroll"&&Le("scroll",o)}switch(r){case"input":fe(o),Et(o,a,!0);break;case"textarea":fe(o),sa(o);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(o.onclick=so)}o=i,t.updateQueue=o,o!==null&&(t.flags|=4)}else{d=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=aa(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=d.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=d.createElement(r,{is:o.is}):(e=d.createElement(r),r==="select"&&(d=e,o.multiple?d.multiple=!0:o.size&&(d.size=o.size))):e=d.createElementNS(e,r),e[Tt]=t,e[br]=o,wc(e,t,!1,!1),t.stateNode=e;e:{switch(d=ii(r,o),r){case"dialog":Le("cancel",e),Le("close",e),i=o;break;case"iframe":case"object":case"embed":Le("load",e),i=o;break;case"video":case"audio":for(i=0;i<xr.length;i++)Le(xr[i],e);i=o;break;case"source":Le("error",e),i=o;break;case"img":case"image":case"link":Le("error",e),Le("load",e),i=o;break;case"details":Le("toggle",e),i=o;break;case"input":Se(e,o),i=ye(e,o),Le("invalid",e);break;case"option":i=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},i=F({},o,{value:void 0}),Le("invalid",e);break;case"textarea":oa(e,o),i=ni(e,o),Le("invalid",e);break;default:i=o}oi(r,i),x=i;for(a in x)if(x.hasOwnProperty(a)){var _=x[a];a==="style"?da(e,_):a==="dangerouslySetInnerHTML"?(_=_?_.__html:void 0,_!=null&&la(e,_)):a==="children"?typeof _=="string"?(r!=="textarea"||_!=="")&&Jn(e,_):typeof _=="number"&&Jn(e,""+_):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(f.hasOwnProperty(a)?_!=null&&a==="onScroll"&&Le("scroll",e):_!=null&&J(e,a,_,d))}switch(r){case"input":fe(e),Et(e,o,!1);break;case"textarea":fe(e),sa(e);break;case"option":o.value!=null&&e.setAttribute("value",""+re(o.value));break;case"select":e.multiple=!!o.multiple,a=o.value,a!=null?jn(e,!!o.multiple,a,!1):o.defaultValue!=null&&jn(e,!!o.multiple,o.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=so)}switch(r){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ze(t),null;case 6:if(e&&t.stateNode!=null)yc(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(c(166));if(r=gn(Sr.current),gn(zt.current),fo(t)){if(o=t.stateNode,r=t.memoizedProps,o[Tt]=t,(a=o.nodeValue!==r)&&(e=pt,e!==null))switch(e.tag){case 3:io(o.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&io(o.nodeValue,r,(e.mode&1)!==0)}a&&(t.flags|=4)}else o=(r.nodeType===9?r:r.ownerDocument).createTextNode(o),o[Tt]=t,t.stateNode=o}return Ze(t),null;case 13:if(Re(Pe),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Me&&ht!==null&&(t.mode&1)!==0&&(t.flags&128)===0)jl(),Fn(),t.flags|=98560,a=!1;else if(a=fo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(c(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(c(317));a[Tt]=t}else Fn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),a=!1}else kt!==null&&(Ms(kt),kt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Pe.current&1)!==0?Ve===0&&(Ve=3):Ws())),t.updateQueue!==null&&(t.flags|=4),Ze(t),null);case 4:return Bn(),js(e,t),e===null&&_r(t.stateNode.containerInfo),Ze(t),null;case 10:return Ji(t.type._context),Ze(t),null;case 17:return st(t.type)&&lo(),Ze(t),null;case 19:if(Re(Pe),a=t.memoizedState,a===null)return Ze(t),null;if(o=(t.flags&128)!==0,d=a.rendering,d===null)if(o)Ar(a,!1);else{if(Ve!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(d=bo(e),d!==null){for(t.flags|=128,Ar(a,!1),o=d.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=r,r=t.child;r!==null;)a=r,e=o,a.flags&=14680066,d=a.alternate,d===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=d.childLanes,a.lanes=d.lanes,a.child=d.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=d.memoizedProps,a.memoizedState=d.memoizedState,a.updateQueue=d.updateQueue,a.type=d.type,e=d.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return ze(Pe,Pe.current&1|2),t.child}e=e.sibling}a.tail!==null&&Oe()>Gn&&(t.flags|=128,o=!0,Ar(a,!1),t.lanes=4194304)}else{if(!o)if(e=bo(d),e!==null){if(t.flags|=128,o=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Ar(a,!0),a.tail===null&&a.tailMode==="hidden"&&!d.alternate&&!Me)return Ze(t),null}else 2*Oe()-a.renderingStartTime>Gn&&r!==1073741824&&(t.flags|=128,o=!0,Ar(a,!1),t.lanes=4194304);a.isBackwards?(d.sibling=t.child,t.child=d):(r=a.last,r!==null?r.sibling=d:t.child=d,a.last=d)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Oe(),t.sibling=null,r=Pe.current,ze(Pe,o?r&1|2:r&1),t):(Ze(t),null);case 22:case 23:return Ds(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(ft&1073741824)!==0&&(Ze(t),t.subtreeFlags&6&&(t.flags|=8192)):Ze(t),null;case 24:return null;case 25:return null}throw Error(c(156,t.tag))}function Xu(e,t){switch(Hi(t),t.tag){case 1:return st(t.type)&&lo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Bn(),Re(it),Re(qe),is(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return rs(t),null;case 13:if(Re(Pe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));Fn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Re(Pe),null;case 4:return Bn(),null;case 10:return Ji(t.type._context),null;case 22:case 23:return Ds(),null;case 24:return null;default:return null}}var Eo=!1,et=!1,Yu=typeof WeakSet=="function"?WeakSet:Set,pe=null;function Kn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(o){We(e,t,o)}else r.current=null}function Ss(e,t,r){try{r()}catch(o){We(e,t,o)}}var vc=!1;function qu(e,t){if(Di=Qr,e=el(),Ei(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var o=r.getSelection&&r.getSelection();if(o&&o.rangeCount!==0){r=o.anchorNode;var i=o.anchorOffset,a=o.focusNode;o=o.focusOffset;try{r.nodeType,a.nodeType}catch{r=null;break e}var d=0,x=-1,_=-1,L=0,q=0,Z=e,Y=null;t:for(;;){for(var de;Z!==r||i!==0&&Z.nodeType!==3||(x=d+i),Z!==a||o!==0&&Z.nodeType!==3||(_=d+o),Z.nodeType===3&&(d+=Z.nodeValue.length),(de=Z.firstChild)!==null;)Y=Z,Z=de;for(;;){if(Z===e)break t;if(Y===r&&++L===i&&(x=d),Y===a&&++q===o&&(_=d),(de=Z.nextSibling)!==null)break;Z=Y,Y=Z.parentNode}Z=de}r=x===-1||_===-1?null:{start:x,end:_}}else r=null}r=r||{start:0,end:0}}else r=null;for(Wi={focusedElem:e,selectionRange:r},Qr=!1,pe=t;pe!==null;)if(t=pe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,pe=e;else for(;pe!==null;){t=pe;try{var he=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(he!==null){var ge=he.memoizedProps,Ue=he.memoizedState,C=t.stateNode,b=C.getSnapshotBeforeUpdate(t.elementType===t.type?ge:jt(t.type,ge),Ue);C.__reactInternalSnapshotBeforeUpdate=b}break;case 3:var I=t.stateNode.containerInfo;I.nodeType===1?I.textContent="":I.nodeType===9&&I.documentElement&&I.removeChild(I.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(c(163))}}catch(oe){We(t,t.return,oe)}if(e=t.sibling,e!==null){e.return=t.return,pe=e;break}pe=t.return}return he=vc,vc=!1,he}function Tr(e,t,r){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var i=o=o.next;do{if((i.tag&e)===e){var a=i.destroy;i.destroy=void 0,a!==void 0&&Ss(t,r,a)}i=i.next}while(i!==o)}}function Ao(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var o=r.create;r.destroy=o()}r=r.next}while(r!==t)}}function Cs(e){var t=e.ref;if(t!==null){var r=e.stateNode;e.tag,e=r,typeof t=="function"?t(e):t.current=e}}function kc(e){var t=e.alternate;t!==null&&(e.alternate=null,kc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Tt],delete t[br],delete t[$i],delete t[Lu],delete t[Ru])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function jc(e){return e.tag===5||e.tag===3||e.tag===4}function Sc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||jc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ns(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=so));else if(o!==4&&(e=e.child,e!==null))for(Ns(e,t,r),e=e.sibling;e!==null;)Ns(e,t,r),e=e.sibling}function Is(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(Is(e,t,r),e=e.sibling;e!==null;)Is(e,t,r),e=e.sibling}var Xe=null,St=!1;function tn(e,t,r){for(r=r.child;r!==null;)Cc(e,t,r),r=r.sibling}function Cc(e,t,r){if(At&&typeof At.onCommitFiberUnmount=="function")try{At.onCommitFiberUnmount($r,r)}catch{}switch(r.tag){case 5:et||Kn(r,t);case 6:var o=Xe,i=St;Xe=null,tn(e,t,r),Xe=o,St=i,Xe!==null&&(St?(e=Xe,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):Xe.removeChild(r.stateNode));break;case 18:Xe!==null&&(St?(e=Xe,r=r.stateNode,e.nodeType===8?Ui(e.parentNode,r):e.nodeType===1&&Ui(e,r),cr(e)):Ui(Xe,r.stateNode));break;case 4:o=Xe,i=St,Xe=r.stateNode.containerInfo,St=!0,tn(e,t,r),Xe=o,St=i;break;case 0:case 11:case 14:case 15:if(!et&&(o=r.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){i=o=o.next;do{var a=i,d=a.destroy;a=a.tag,d!==void 0&&((a&2)!==0||(a&4)!==0)&&Ss(r,t,d),i=i.next}while(i!==o)}tn(e,t,r);break;case 1:if(!et&&(Kn(r,t),o=r.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=r.memoizedProps,o.state=r.memoizedState,o.componentWillUnmount()}catch(x){We(r,t,x)}tn(e,t,r);break;case 21:tn(e,t,r);break;case 22:r.mode&1?(et=(o=et)||r.memoizedState!==null,tn(e,t,r),et=o):tn(e,t,r);break;default:tn(e,t,r)}}function Nc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new Yu),t.forEach(function(o){var i=sp.bind(null,e,o);r.has(o)||(r.add(o),o.then(i,i))})}}function Ct(e,t){var r=t.deletions;if(r!==null)for(var o=0;o<r.length;o++){var i=r[o];try{var a=e,d=t,x=d;e:for(;x!==null;){switch(x.tag){case 5:Xe=x.stateNode,St=!1;break e;case 3:Xe=x.stateNode.containerInfo,St=!0;break e;case 4:Xe=x.stateNode.containerInfo,St=!0;break e}x=x.return}if(Xe===null)throw Error(c(160));Cc(a,d,i),Xe=null,St=!1;var _=i.alternate;_!==null&&(_.return=null),i.return=null}catch(L){We(i,t,L)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Ic(t,e),t=t.sibling}function Ic(e,t){var r=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ct(t,e),Rt(e),o&4){try{Tr(3,e,e.return),Ao(3,e)}catch(ge){We(e,e.return,ge)}try{Tr(5,e,e.return)}catch(ge){We(e,e.return,ge)}}break;case 1:Ct(t,e),Rt(e),o&512&&r!==null&&Kn(r,r.return);break;case 5:if(Ct(t,e),Rt(e),o&512&&r!==null&&Kn(r,r.return),e.flags&32){var i=e.stateNode;try{Jn(i,"")}catch(ge){We(e,e.return,ge)}}if(o&4&&(i=e.stateNode,i!=null)){var a=e.memoizedProps,d=r!==null?r.memoizedProps:a,x=e.type,_=e.updateQueue;if(e.updateQueue=null,_!==null)try{x==="input"&&a.type==="radio"&&a.name!=null&&Ee(i,a),ii(x,d);var L=ii(x,a);for(d=0;d<_.length;d+=2){var q=_[d],Z=_[d+1];q==="style"?da(i,Z):q==="dangerouslySetInnerHTML"?la(i,Z):q==="children"?Jn(i,Z):J(i,q,Z,L)}switch(x){case"input":ot(i,a);break;case"textarea":ia(i,a);break;case"select":var Y=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!a.multiple;var de=a.value;de!=null?jn(i,!!a.multiple,de,!1):Y!==!!a.multiple&&(a.defaultValue!=null?jn(i,!!a.multiple,a.defaultValue,!0):jn(i,!!a.multiple,a.multiple?[]:"",!1))}i[br]=a}catch(ge){We(e,e.return,ge)}}break;case 6:if(Ct(t,e),Rt(e),o&4){if(e.stateNode===null)throw Error(c(162));i=e.stateNode,a=e.memoizedProps;try{i.nodeValue=a}catch(ge){We(e,e.return,ge)}}break;case 3:if(Ct(t,e),Rt(e),o&4&&r!==null&&r.memoizedState.isDehydrated)try{cr(t.containerInfo)}catch(ge){We(e,e.return,ge)}break;case 4:Ct(t,e),Rt(e);break;case 13:Ct(t,e),Rt(e),i=e.child,i.flags&8192&&(a=i.memoizedState!==null,i.stateNode.isHidden=a,!a||i.alternate!==null&&i.alternate.memoizedState!==null||(Ts=Oe())),o&4&&Nc(e);break;case 22:if(q=r!==null&&r.memoizedState!==null,e.mode&1?(et=(L=et)||q,Ct(t,e),et=L):Ct(t,e),Rt(e),o&8192){if(L=e.memoizedState!==null,(e.stateNode.isHidden=L)&&!q&&(e.mode&1)!==0)for(pe=e,q=e.child;q!==null;){for(Z=pe=q;pe!==null;){switch(Y=pe,de=Y.child,Y.tag){case 0:case 11:case 14:case 15:Tr(4,Y,Y.return);break;case 1:Kn(Y,Y.return);var he=Y.stateNode;if(typeof he.componentWillUnmount=="function"){o=Y,r=Y.return;try{t=o,he.props=t.memoizedProps,he.state=t.memoizedState,he.componentWillUnmount()}catch(ge){We(o,r,ge)}}break;case 5:Kn(Y,Y.return);break;case 22:if(Y.memoizedState!==null){Tc(Z);continue}}de!==null?(de.return=Y,pe=de):Tc(Z)}q=q.sibling}e:for(q=null,Z=e;;){if(Z.tag===5){if(q===null){q=Z;try{i=Z.stateNode,L?(a=i.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(x=Z.stateNode,_=Z.memoizedProps.style,d=_!=null&&_.hasOwnProperty("display")?_.display:null,x.style.display=ca("display",d))}catch(ge){We(e,e.return,ge)}}}else if(Z.tag===6){if(q===null)try{Z.stateNode.nodeValue=L?"":Z.memoizedProps}catch(ge){We(e,e.return,ge)}}else if((Z.tag!==22&&Z.tag!==23||Z.memoizedState===null||Z===e)&&Z.child!==null){Z.child.return=Z,Z=Z.child;continue}if(Z===e)break e;for(;Z.sibling===null;){if(Z.return===null||Z.return===e)break e;q===Z&&(q=null),Z=Z.return}q===Z&&(q=null),Z.sibling.return=Z.return,Z=Z.sibling}}break;case 19:Ct(t,e),Rt(e),o&4&&Nc(e);break;case 21:break;default:Ct(t,e),Rt(e)}}function Rt(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(jc(r)){var o=r;break e}r=r.return}throw Error(c(160))}switch(o.tag){case 5:var i=o.stateNode;o.flags&32&&(Jn(i,""),o.flags&=-33);var a=Sc(e);Is(e,a,i);break;case 3:case 4:var d=o.stateNode.containerInfo,x=Sc(e);Ns(e,x,d);break;default:throw Error(c(161))}}catch(_){We(e,e.return,_)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ju(e,t,r){pe=e,Ec(e)}function Ec(e,t,r){for(var o=(e.mode&1)!==0;pe!==null;){var i=pe,a=i.child;if(i.tag===22&&o){var d=i.memoizedState!==null||Eo;if(!d){var x=i.alternate,_=x!==null&&x.memoizedState!==null||et;x=Eo;var L=et;if(Eo=d,(et=_)&&!L)for(pe=i;pe!==null;)d=pe,_=d.child,d.tag===22&&d.memoizedState!==null?zc(i):_!==null?(_.return=d,pe=_):zc(i);for(;a!==null;)pe=a,Ec(a),a=a.sibling;pe=i,Eo=x,et=L}Ac(e)}else(i.subtreeFlags&8772)!==0&&a!==null?(a.return=i,pe=a):Ac(e)}}function Ac(e){for(;pe!==null;){var t=pe;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:et||Ao(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!et)if(r===null)o.componentDidMount();else{var i=t.elementType===t.type?r.memoizedProps:jt(t.type,r.memoizedProps);o.componentDidUpdate(i,r.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&Tl(t,a,o);break;case 3:var d=t.updateQueue;if(d!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Tl(t,d,r)}break;case 5:var x=t.stateNode;if(r===null&&t.flags&4){r=x;var _=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":_.autoFocus&&r.focus();break;case"img":_.src&&(r.src=_.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var L=t.alternate;if(L!==null){var q=L.memoizedState;if(q!==null){var Z=q.dehydrated;Z!==null&&cr(Z)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(c(163))}et||t.flags&512&&Cs(t)}catch(Y){We(t,t.return,Y)}}if(t===e){pe=null;break}if(r=t.sibling,r!==null){r.return=t.return,pe=r;break}pe=t.return}}function Tc(e){for(;pe!==null;){var t=pe;if(t===e){pe=null;break}var r=t.sibling;if(r!==null){r.return=t.return,pe=r;break}pe=t.return}}function zc(e){for(;pe!==null;){var t=pe;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Ao(4,t)}catch(_){We(t,r,_)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var i=t.return;try{o.componentDidMount()}catch(_){We(t,i,_)}}var a=t.return;try{Cs(t)}catch(_){We(t,a,_)}break;case 5:var d=t.return;try{Cs(t)}catch(_){We(t,d,_)}}}catch(_){We(t,t.return,_)}if(t===e){pe=null;break}var x=t.sibling;if(x!==null){x.return=t.return,pe=x;break}pe=t.return}}var Zu=Math.ceil,To=K.ReactCurrentDispatcher,Es=K.ReactCurrentOwner,wt=K.ReactCurrentBatchConfig,Ce=0,Ge=null,$e=null,Ye=0,ft=0,Hn=Yt(0),Ve=0,zr=null,xn=0,zo=0,As=0,Lr=null,lt=null,Ts=0,Gn=1/0,$t=null,Lo=!1,zs=null,nn=null,Ro=!1,rn=null,Mo=0,Rr=0,Ls=null,Po=-1,Do=0;function rt(){return(Ce&6)!==0?Oe():Po!==-1?Po:Po=Oe()}function on(e){return(e.mode&1)===0?1:(Ce&2)!==0&&Ye!==0?Ye&-Ye:Pu.transition!==null?(Do===0&&(Do=Sa()),Do):(e=Ae,e!==0||(e=window.event,e=e===void 0?16:Ra(e.type)),e)}function Nt(e,t,r,o){if(50<Rr)throw Rr=0,Ls=null,Error(c(185));or(e,r,o),((Ce&2)===0||e!==Ge)&&(e===Ge&&((Ce&2)===0&&(zo|=r),Ve===4&&sn(e,Ye)),ct(e,o),r===1&&Ce===0&&(t.mode&1)===0&&(Gn=Oe()+500,uo&&Jt()))}function ct(e,t){var r=e.callbackNode;Pd(e,t);var o=Kr(e,e===Ge?Ye:0);if(o===0)r!==null&&va(r),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(r!=null&&va(r),t===1)e.tag===0?Mu(Rc.bind(null,e)):wl(Rc.bind(null,e)),Tu(function(){(Ce&6)===0&&Jt()}),r=null;else{switch(Ca(o)){case 1:r=pi;break;case 4:r=ka;break;case 16:r=Ur;break;case 536870912:r=ja;break;default:r=Ur}r=$c(r,Lc.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Lc(e,t){if(Po=-1,Do=0,(Ce&6)!==0)throw Error(c(327));var r=e.callbackNode;if(Qn()&&e.callbackNode!==r)return null;var o=Kr(e,e===Ge?Ye:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Wo(e,o);else{t=o;var i=Ce;Ce|=2;var a=Pc();(Ge!==e||Ye!==t)&&($t=null,Gn=Oe()+500,wn(e,t));do try{np();break}catch(x){Mc(e,x)}while(!0);qi(),To.current=a,Ce=i,$e!==null?t=0:(Ge=null,Ye=0,t=Ve)}if(t!==0){if(t===2&&(i=hi(e),i!==0&&(o=i,t=Rs(e,i))),t===1)throw r=zr,wn(e,0),sn(e,o),ct(e,Oe()),r;if(t===6)sn(e,o);else{if(i=e.current.alternate,(o&30)===0&&!ep(i)&&(t=Wo(e,o),t===2&&(a=hi(e),a!==0&&(o=a,t=Rs(e,a))),t===1))throw r=zr,wn(e,0),sn(e,o),ct(e,Oe()),r;switch(e.finishedWork=i,e.finishedLanes=o,t){case 0:case 1:throw Error(c(345));case 2:bn(e,lt,$t);break;case 3:if(sn(e,o),(o&130023424)===o&&(t=Ts+500-Oe(),10<t)){if(Kr(e,0)!==0)break;if(i=e.suspendedLanes,(i&o)!==o){rt(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=Oi(bn.bind(null,e,lt,$t),t);break}bn(e,lt,$t);break;case 4:if(sn(e,o),(o&4194240)===o)break;for(t=e.eventTimes,i=-1;0<o;){var d=31-yt(o);a=1<<d,d=t[d],d>i&&(i=d),o&=~a}if(o=i,o=Oe()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*Zu(o/1960))-o,10<o){e.timeoutHandle=Oi(bn.bind(null,e,lt,$t),o);break}bn(e,lt,$t);break;case 5:bn(e,lt,$t);break;default:throw Error(c(329))}}}return ct(e,Oe()),e.callbackNode===r?Lc.bind(null,e):null}function Rs(e,t){var r=Lr;return e.current.memoizedState.isDehydrated&&(wn(e,t).flags|=256),e=Wo(e,t),e!==2&&(t=lt,lt=r,t!==null&&Ms(t)),e}function Ms(e){lt===null?lt=e:lt.push.apply(lt,e)}function ep(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var o=0;o<r.length;o++){var i=r[o],a=i.getSnapshot;i=i.value;try{if(!vt(a(),i))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function sn(e,t){for(t&=~As,t&=~zo,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-yt(t),o=1<<r;e[r]=-1,t&=~o}}function Rc(e){if((Ce&6)!==0)throw Error(c(327));Qn();var t=Kr(e,0);if((t&1)===0)return ct(e,Oe()),null;var r=Wo(e,t);if(e.tag!==0&&r===2){var o=hi(e);o!==0&&(t=o,r=Rs(e,o))}if(r===1)throw r=zr,wn(e,0),sn(e,t),ct(e,Oe()),r;if(r===6)throw Error(c(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,bn(e,lt,$t),ct(e,Oe()),null}function Ps(e,t){var r=Ce;Ce|=1;try{return e(t)}finally{Ce=r,Ce===0&&(Gn=Oe()+500,uo&&Jt())}}function _n(e){rn!==null&&rn.tag===0&&(Ce&6)===0&&Qn();var t=Ce;Ce|=1;var r=wt.transition,o=Ae;try{if(wt.transition=null,Ae=1,e)return e()}finally{Ae=o,wt.transition=r,Ce=t,(Ce&6)===0&&Jt()}}function Ds(){ft=Hn.current,Re(Hn)}function wn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Au(r)),$e!==null)for(r=$e.return;r!==null;){var o=r;switch(Hi(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&lo();break;case 3:Bn(),Re(it),Re(qe),is();break;case 5:rs(o);break;case 4:Bn();break;case 13:Re(Pe);break;case 19:Re(Pe);break;case 10:Ji(o.type._context);break;case 22:case 23:Ds()}r=r.return}if(Ge=e,$e=e=an(e.current,null),Ye=ft=t,Ve=0,zr=null,As=zo=xn=0,lt=Lr=null,fn!==null){for(t=0;t<fn.length;t++)if(r=fn[t],o=r.interleaved,o!==null){r.interleaved=null;var i=o.next,a=r.pending;if(a!==null){var d=a.next;a.next=i,o.next=d}r.pending=o}fn=null}return e}function Mc(e,t){do{var r=$e;try{if(qi(),yo.current=So,vo){for(var o=De.memoizedState;o!==null;){var i=o.queue;i!==null&&(i.pending=null),o=o.next}vo=!1}if(mn=0,He=Be=De=null,Cr=!1,Nr=0,Es.current=null,r===null||r.return===null){Ve=1,zr=t,$e=null;break}e:{var a=e,d=r.return,x=r,_=t;if(t=Ye,x.flags|=32768,_!==null&&typeof _=="object"&&typeof _.then=="function"){var L=_,q=x,Z=q.tag;if((q.mode&1)===0&&(Z===0||Z===11||Z===15)){var Y=q.alternate;Y?(q.updateQueue=Y.updateQueue,q.memoizedState=Y.memoizedState,q.lanes=Y.lanes):(q.updateQueue=null,q.memoizedState=null)}var de=sc(d);if(de!==null){de.flags&=-257,ac(de,d,x,a,t),de.mode&1&&ic(a,L,t),t=de,_=L;var he=t.updateQueue;if(he===null){var ge=new Set;ge.add(_),t.updateQueue=ge}else he.add(_);break e}else{if((t&1)===0){ic(a,L,t),Ws();break e}_=Error(c(426))}}else if(Me&&x.mode&1){var Ue=sc(d);if(Ue!==null){(Ue.flags&65536)===0&&(Ue.flags|=256),ac(Ue,d,x,a,t),Xi(Vn(_,x));break e}}a=_=Vn(_,x),Ve!==4&&(Ve=2),Lr===null?Lr=[a]:Lr.push(a),a=d;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var C=rc(a,_,t);Al(a,C);break e;case 1:x=_;var b=a.type,I=a.stateNode;if((a.flags&128)===0&&(typeof b.getDerivedStateFromError=="function"||I!==null&&typeof I.componentDidCatch=="function"&&(nn===null||!nn.has(I)))){a.flags|=65536,t&=-t,a.lanes|=t;var oe=oc(a,x,t);Al(a,oe);break e}}a=a.return}while(a!==null)}Wc(r)}catch(me){t=me,$e===r&&r!==null&&($e=r=r.return);continue}break}while(!0)}function Pc(){var e=To.current;return To.current=So,e===null?So:e}function Ws(){(Ve===0||Ve===3||Ve===2)&&(Ve=4),Ge===null||(xn&268435455)===0&&(zo&268435455)===0||sn(Ge,Ye)}function Wo(e,t){var r=Ce;Ce|=2;var o=Pc();(Ge!==e||Ye!==t)&&($t=null,wn(e,t));do try{tp();break}catch(i){Mc(e,i)}while(!0);if(qi(),Ce=r,To.current=o,$e!==null)throw Error(c(261));return Ge=null,Ye=0,Ve}function tp(){for(;$e!==null;)Dc($e)}function np(){for(;$e!==null&&!Nd();)Dc($e)}function Dc(e){var t=Uc(e.alternate,e,ft);e.memoizedProps=e.pendingProps,t===null?Wc(e):$e=t,Es.current=null}function Wc(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=Qu(r,t,ft),r!==null){$e=r;return}}else{if(r=Xu(r,t),r!==null){r.flags&=32767,$e=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ve=6,$e=null;return}}if(t=t.sibling,t!==null){$e=t;return}$e=t=e}while(t!==null);Ve===0&&(Ve=5)}function bn(e,t,r){var o=Ae,i=wt.transition;try{wt.transition=null,Ae=1,rp(e,t,r,o)}finally{wt.transition=i,Ae=o}return null}function rp(e,t,r,o){do Qn();while(rn!==null);if((Ce&6)!==0)throw Error(c(327));r=e.finishedWork;var i=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(c(177));e.callbackNode=null,e.callbackPriority=0;var a=r.lanes|r.childLanes;if(Dd(e,a),e===Ge&&($e=Ge=null,Ye=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Ro||(Ro=!0,$c(Ur,function(){return Qn(),null})),a=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||a){a=wt.transition,wt.transition=null;var d=Ae;Ae=1;var x=Ce;Ce|=4,Es.current=null,qu(e,r),Ic(r,e),ku(Wi),Qr=!!Di,Wi=Di=null,e.current=r,Ju(r),Id(),Ce=x,Ae=d,wt.transition=a}else e.current=r;if(Ro&&(Ro=!1,rn=e,Mo=i),a=e.pendingLanes,a===0&&(nn=null),Td(r.stateNode),ct(e,Oe()),t!==null)for(o=e.onRecoverableError,r=0;r<t.length;r++)i=t[r],o(i.value,{componentStack:i.stack,digest:i.digest});if(Lo)throw Lo=!1,e=zs,zs=null,e;return(Mo&1)!==0&&e.tag!==0&&Qn(),a=e.pendingLanes,(a&1)!==0?e===Ls?Rr++:(Rr=0,Ls=e):Rr=0,Jt(),null}function Qn(){if(rn!==null){var e=Ca(Mo),t=wt.transition,r=Ae;try{if(wt.transition=null,Ae=16>e?16:e,rn===null)var o=!1;else{if(e=rn,rn=null,Mo=0,(Ce&6)!==0)throw Error(c(331));var i=Ce;for(Ce|=4,pe=e.current;pe!==null;){var a=pe,d=a.child;if((pe.flags&16)!==0){var x=a.deletions;if(x!==null){for(var _=0;_<x.length;_++){var L=x[_];for(pe=L;pe!==null;){var q=pe;switch(q.tag){case 0:case 11:case 15:Tr(8,q,a)}var Z=q.child;if(Z!==null)Z.return=q,pe=Z;else for(;pe!==null;){q=pe;var Y=q.sibling,de=q.return;if(kc(q),q===L){pe=null;break}if(Y!==null){Y.return=de,pe=Y;break}pe=de}}}var he=a.alternate;if(he!==null){var ge=he.child;if(ge!==null){he.child=null;do{var Ue=ge.sibling;ge.sibling=null,ge=Ue}while(ge!==null)}}pe=a}}if((a.subtreeFlags&2064)!==0&&d!==null)d.return=a,pe=d;else e:for(;pe!==null;){if(a=pe,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:Tr(9,a,a.return)}var C=a.sibling;if(C!==null){C.return=a.return,pe=C;break e}pe=a.return}}var b=e.current;for(pe=b;pe!==null;){d=pe;var I=d.child;if((d.subtreeFlags&2064)!==0&&I!==null)I.return=d,pe=I;else e:for(d=b;pe!==null;){if(x=pe,(x.flags&2048)!==0)try{switch(x.tag){case 0:case 11:case 15:Ao(9,x)}}catch(me){We(x,x.return,me)}if(x===d){pe=null;break e}var oe=x.sibling;if(oe!==null){oe.return=x.return,pe=oe;break e}pe=x.return}}if(Ce=i,Jt(),At&&typeof At.onPostCommitFiberRoot=="function")try{At.onPostCommitFiberRoot($r,e)}catch{}o=!0}return o}finally{Ae=r,wt.transition=t}}return!1}function Fc(e,t,r){t=Vn(r,t),t=rc(e,t,1),e=en(e,t,1),t=rt(),e!==null&&(or(e,1,t),ct(e,t))}function We(e,t,r){if(e.tag===3)Fc(e,e,r);else for(;t!==null;){if(t.tag===3){Fc(t,e,r);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(nn===null||!nn.has(o))){e=Vn(r,e),e=oc(t,e,1),t=en(t,e,1),e=rt(),t!==null&&(or(t,1,e),ct(t,e));break}}t=t.return}}function op(e,t,r){var o=e.pingCache;o!==null&&o.delete(t),t=rt(),e.pingedLanes|=e.suspendedLanes&r,Ge===e&&(Ye&r)===r&&(Ve===4||Ve===3&&(Ye&130023424)===Ye&&500>Oe()-Ts?wn(e,0):As|=r),ct(e,t)}function Oc(e,t){t===0&&((e.mode&1)===0?t=1:(t=Vr,Vr<<=1,(Vr&130023424)===0&&(Vr=4194304)));var r=rt();e=Ft(e,t),e!==null&&(or(e,t,r),ct(e,r))}function ip(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),Oc(e,r)}function sp(e,t){var r=0;switch(e.tag){case 13:var o=e.stateNode,i=e.memoizedState;i!==null&&(r=i.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(c(314))}o!==null&&o.delete(t),Oc(e,r)}var Uc;Uc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||it.current)at=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return at=!1,Gu(e,t,r);at=(e.flags&131072)!==0}else at=!1,Me&&(t.flags&1048576)!==0&&bl(t,ho,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Io(e,t),e=t.pendingProps;var i=Pn(t,qe.current);$n(t,r),i=ls(null,t,o,e,i,r);var a=cs();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,st(o)?(a=!0,co(t)):a=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,ts(t),i.updater=Co,t.stateNode=i,i._reactInternals=t,gs(t,o,e,r),t=ws(null,t,o,!0,a,r)):(t.tag=0,Me&&a&&Ki(t),nt(null,t,i,r),t=t.child),t;case 16:o=t.elementType;e:{switch(Io(e,t),e=t.pendingProps,i=o._init,o=i(o._payload),t.type=o,i=t.tag=lp(o),e=jt(o,e),i){case 0:t=_s(null,t,o,e,r);break e;case 1:t=hc(null,t,o,e,r);break e;case 11:t=lc(null,t,o,e,r);break e;case 14:t=cc(null,t,o,jt(o.type,e),r);break e}throw Error(c(306,o,""))}return t;case 0:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),_s(e,t,o,i,r);case 1:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),hc(e,t,o,i,r);case 3:e:{if(fc(t),e===null)throw Error(c(387));o=t.pendingProps,a=t.memoizedState,i=a.element,El(e,t),wo(t,o,null,r);var d=t.memoizedState;if(o=d.element,a.isDehydrated)if(a={element:o,isDehydrated:!1,cache:d.cache,pendingSuspenseBoundaries:d.pendingSuspenseBoundaries,transitions:d.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){i=Vn(Error(c(423)),t),t=gc(e,t,o,r,i);break e}else if(o!==i){i=Vn(Error(c(424)),t),t=gc(e,t,o,r,i);break e}else for(ht=Xt(t.stateNode.containerInfo.firstChild),pt=t,Me=!0,kt=null,r=Nl(t,null,o,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Fn(),o===i){t=Ut(e,t,r);break e}nt(e,t,o,r)}t=t.child}return t;case 5:return zl(t),e===null&&Qi(t),o=t.type,i=t.pendingProps,a=e!==null?e.memoizedProps:null,d=i.children,Fi(o,i)?d=null:a!==null&&Fi(o,a)&&(t.flags|=32),pc(e,t),nt(e,t,d,r),t.child;case 6:return e===null&&Qi(t),null;case 13:return mc(e,t,r);case 4:return ns(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=On(t,null,o,r):nt(e,t,o,r),t.child;case 11:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),lc(e,t,o,i,r);case 7:return nt(e,t,t.pendingProps,r),t.child;case 8:return nt(e,t,t.pendingProps.children,r),t.child;case 12:return nt(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(o=t.type._context,i=t.pendingProps,a=t.memoizedProps,d=i.value,ze(mo,o._currentValue),o._currentValue=d,a!==null)if(vt(a.value,d)){if(a.children===i.children&&!it.current){t=Ut(e,t,r);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var x=a.dependencies;if(x!==null){d=a.child;for(var _=x.firstContext;_!==null;){if(_.context===o){if(a.tag===1){_=Ot(-1,r&-r),_.tag=2;var L=a.updateQueue;if(L!==null){L=L.shared;var q=L.pending;q===null?_.next=_:(_.next=q.next,q.next=_),L.pending=_}}a.lanes|=r,_=a.alternate,_!==null&&(_.lanes|=r),Zi(a.return,r,t),x.lanes|=r;break}_=_.next}}else if(a.tag===10)d=a.type===t.type?null:a.child;else if(a.tag===18){if(d=a.return,d===null)throw Error(c(341));d.lanes|=r,x=d.alternate,x!==null&&(x.lanes|=r),Zi(d,r,t),d=a.sibling}else d=a.child;if(d!==null)d.return=a;else for(d=a;d!==null;){if(d===t){d=null;break}if(a=d.sibling,a!==null){a.return=d.return,d=a;break}d=d.return}a=d}nt(e,t,i.children,r),t=t.child}return t;case 9:return i=t.type,o=t.pendingProps.children,$n(t,r),i=xt(i),o=o(i),t.flags|=1,nt(e,t,o,r),t.child;case 14:return o=t.type,i=jt(o,t.pendingProps),i=jt(o.type,i),cc(e,t,o,i,r);case 15:return dc(e,t,t.type,t.pendingProps,r);case 17:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),Io(e,t),t.tag=1,st(o)?(e=!0,co(t)):e=!1,$n(t,r),tc(t,o,i),gs(t,o,i,r),ws(null,t,o,!0,e,r);case 19:return _c(e,t,r);case 22:return uc(e,t,r)}throw Error(c(156,t.tag))};function $c(e,t){return ya(e,t)}function ap(e,t,r,o){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function bt(e,t,r,o){return new ap(e,t,r,o)}function Fs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function lp(e){if(typeof e=="function")return Fs(e)?1:0;if(e!=null){if(e=e.$$typeof,e===ue)return 11;if(e===Q)return 14}return 2}function an(e,t){var r=e.alternate;return r===null?(r=bt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Fo(e,t,r,o,i,a){var d=2;if(o=e,typeof e=="function")Fs(e)&&(d=1);else if(typeof e=="string")d=5;else e:switch(e){case ie:return yn(r.children,i,a,t);case se:d=8,i|=8;break;case ae:return e=bt(12,r,t,i|2),e.elementType=ae,e.lanes=a,e;case te:return e=bt(13,r,t,i),e.elementType=te,e.lanes=a,e;case _e:return e=bt(19,r,t,i),e.elementType=_e,e.lanes=a,e;case A:return Oo(r,i,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ee:d=10;break e;case le:d=9;break e;case ue:d=11;break e;case Q:d=14;break e;case ne:d=16,o=null;break e}throw Error(c(130,e==null?e:typeof e,""))}return t=bt(d,r,t,i),t.elementType=e,t.type=o,t.lanes=a,t}function yn(e,t,r,o){return e=bt(7,e,o,t),e.lanes=r,e}function Oo(e,t,r,o){return e=bt(22,e,o,t),e.elementType=A,e.lanes=r,e.stateNode={isHidden:!1},e}function Os(e,t,r){return e=bt(6,e,null,t),e.lanes=r,e}function Us(e,t,r){return t=bt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function cp(e,t,r,o,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=fi(0),this.expirationTimes=fi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=fi(0),this.identifierPrefix=o,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function $s(e,t,r,o,i,a,d,x,_){return e=new cp(e,t,r,x,_),t===1?(t=1,a===!0&&(t|=8)):t=0,a=bt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:o,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},ts(a),e}function dp(e,t,r){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:X,key:o==null?null:""+o,children:e,containerInfo:t,implementation:r}}function Bc(e){if(!e)return qt;e=e._reactInternals;e:{if(cn(e)!==e||e.tag!==1)throw Error(c(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(st(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(c(171))}if(e.tag===1){var r=e.type;if(st(r))return xl(e,r,t)}return t}function Vc(e,t,r,o,i,a,d,x,_){return e=$s(r,o,!0,e,i,a,d,x,_),e.context=Bc(null),r=e.current,o=rt(),i=on(r),a=Ot(o,i),a.callback=t??null,en(r,a,i),e.current.lanes=i,or(e,i,o),ct(e,o),e}function Uo(e,t,r,o){var i=t.current,a=rt(),d=on(i);return r=Bc(r),t.context===null?t.context=r:t.pendingContext=r,t=Ot(a,d),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=en(i,t,d),e!==null&&(Nt(e,i,d,a),_o(e,i,d)),d}function $o(e){return e=e.current,e.child?(e.child.tag===5,e.child.stateNode):null}function Kc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function Bs(e,t){Kc(e,t),(e=e.alternate)&&Kc(e,t)}function up(){return null}var Hc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Vs(e){this._internalRoot=e}Bo.prototype.render=Vs.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));Uo(e,t,null,null)},Bo.prototype.unmount=Vs.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;_n(function(){Uo(null,e,null,null)}),t[Mt]=null}};function Bo(e){this._internalRoot=e}Bo.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ea();e={blockedOn:null,target:e,priority:t};for(var r=0;r<Ht.length&&t!==0&&t<Ht[r].priority;r++);Ht.splice(r,0,e),r===0&&za(e)}};function Ks(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Vo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Gc(){}function pp(e,t,r,o,i){if(i){if(typeof o=="function"){var a=o;o=function(){var L=$o(d);a.call(L)}}var d=Vc(t,o,e,0,null,!1,!1,"",Gc);return e._reactRootContainer=d,e[Mt]=d.current,_r(e.nodeType===8?e.parentNode:e),_n(),d}for(;i=e.lastChild;)e.removeChild(i);if(typeof o=="function"){var x=o;o=function(){var L=$o(_);x.call(L)}}var _=$s(e,0,!1,null,null,!1,!1,"",Gc);return e._reactRootContainer=_,e[Mt]=_.current,_r(e.nodeType===8?e.parentNode:e),_n(function(){Uo(t,_,r,o)}),_}function Ko(e,t,r,o,i){var a=r._reactRootContainer;if(a){var d=a;if(typeof i=="function"){var x=i;i=function(){var _=$o(d);x.call(_)}}Uo(t,d,e,i)}else d=pp(r,t,e,i,o);return $o(d)}Na=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=rr(t.pendingLanes);r!==0&&(gi(t,r|1),ct(t,Oe()),(Ce&6)===0&&(Gn=Oe()+500,Jt()))}break;case 13:_n(function(){var o=Ft(e,1);if(o!==null){var i=rt();Nt(o,e,1,i)}}),Bs(e,1)}},mi=function(e){if(e.tag===13){var t=Ft(e,134217728);if(t!==null){var r=rt();Nt(t,e,134217728,r)}Bs(e,134217728)}},Ia=function(e){if(e.tag===13){var t=on(e),r=Ft(e,t);if(r!==null){var o=rt();Nt(r,e,t,o)}Bs(e,t)}},Ea=function(){return Ae},Aa=function(e,t){var r=Ae;try{return Ae=e,t()}finally{Ae=r}},li=function(e,t,r){switch(t){case"input":if(ot(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var o=r[t];if(o!==e&&o.form===e.form){var i=ao(o);if(!i)throw Error(c(90));Ne(o),ot(o,i)}}}break;case"textarea":ia(e,r);break;case"select":t=r.value,t!=null&&jn(e,!!r.multiple,t,!1)}},fa=Ps,ga=_n;var hp={usingClientEntryPoint:!1,Events:[yr,Rn,ao,pa,ha,Ps]},Mr={findFiberByHostInstance:dn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},fp={bundleType:Mr.bundleType,version:Mr.version,rendererPackageName:Mr.rendererPackageName,rendererConfig:Mr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:K.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=wa(e),e===null?null:e.stateNode},findFiberByHostInstance:Mr.findFiberByHostInstance||up,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ho=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ho.isDisabled&&Ho.supportsFiber)try{$r=Ho.inject(fp),At=Ho}catch{}}return dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=hp,dt.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ks(t))throw Error(c(200));return dp(e,t,null,r)},dt.createRoot=function(e,t){if(!Ks(e))throw Error(c(299));var r=!1,o="",i=Hc;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=$s(e,1,!1,null,null,r,!1,o,i),e[Mt]=t.current,_r(e.nodeType===8?e.parentNode:e),new Vs(t)},dt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=wa(t),e=e===null?null:e.stateNode,e},dt.flushSync=function(e){return _n(e)},dt.hydrate=function(e,t,r){if(!Vo(t))throw Error(c(200));return Ko(null,e,t,!0,r)},dt.hydrateRoot=function(e,t,r){if(!Ks(e))throw Error(c(405));var o=r!=null&&r.hydratedSources||null,i=!1,a="",d=Hc;if(r!=null&&(r.unstable_strictMode===!0&&(i=!0),r.identifierPrefix!==void 0&&(a=r.identifierPrefix),r.onRecoverableError!==void 0&&(d=r.onRecoverableError)),t=Vc(t,null,e,1,r??null,i,!1,a,d),e[Mt]=t.current,_r(e),o)for(e=0;e<o.length;e++)r=o[e],i=r._getVersion,i=i(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,i]:t.mutableSourceEagerHydrationData.push(r,i);return new Bo(t)},dt.render=function(e,t,r){if(!Vo(t))throw Error(c(200));return Ko(null,e,t,!1,r)},dt.unmountComponentAtNode=function(e){if(!Vo(e))throw Error(c(40));return e._reactRootContainer?(_n(function(){Ko(null,null,e,!1,function(){e._reactRootContainer=null,e[Mt]=null})}),!0):!1},dt.unstable_batchedUpdates=Ps,dt.unstable_renderSubtreeIntoContainer=function(e,t,r,o){if(!Vo(r))throw Error(c(200));if(e==null||e._reactInternals===void 0)throw Error(c(38));return Ko(e,t,r,!1,o)},dt.version="18.3.1-next-f1338f8080-20240426",dt}var td;function jp(){if(td)return Qs.exports;td=1;function l(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l)}catch(s){console.error(s)}}return l(),Qs.exports=kp(),Qs.exports}var nd;function Sp(){if(nd)return Go;nd=1;var l=jp();return Go.createRoot=l.createRoot,Go.hydrateRoot=l.hydrateRoot,Go}var Cp=Sp();const Zo="cheng_access_token",qs="cheng_refresh_token";class Ke{constructor(s){this.apiBaseUrl=s}apiBaseUrl;async getAccessToken(){return this.getAccessTokenSync()}getAccessTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(Zo)}getRefreshTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(qs)}storeTokens(s,c){typeof window>"u"||(window.localStorage.setItem(Zo,s),c&&window.localStorage.setItem(qs,c))}clearTokens(){typeof window>"u"||(window.localStorage.removeItem(Zo),window.localStorage.removeItem(qs))}async refreshAccessToken(){const s=this.getRefreshTokenSync();if(!s)return null;const c=await fetch(`${this.apiBaseUrl}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:s})});if(!c.ok)return null;const u=await c.json().catch(()=>null),f=u?.token??u?.access_token??null;return f?(this.storeTokens(f,u?.refresh_token),f):null}}const Dr="cheng:auth-expired";function fd(){new Ke("").clearTokens()}function vn(l="expired"){fd(),!(typeof window>"u")&&window.dispatchEvent(new CustomEvent(Dr,{detail:{reason:l}}))}class ra{constructor(s){this.apiBaseUrl=s,this.session=new Ke(s)}apiBaseUrl;session;async login(s){const c=await fetch(`${this.apiBaseUrl}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!c.ok){const f=await c.json().catch(()=>({}));throw new Error(f.message??f.error??`Login failed (${c.status})`)}const u=await c.json();return this.session.storeTokens(u.token,u.refresh_token),u}async resetPassword(s){const c=await fetch(`${this.apiBaseUrl}/auth/password/reset`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!c.ok){const u=await c.json().catch(()=>({}));throw new Error(u.message??u.error??`Reset password failed (${c.status})`)}}async refresh(){const s=await this.session.refreshAccessToken();return s||vn("refresh-failed"),s}logout(){fd()}getAccessToken(){return this.session.getAccessTokenSync()}getRefreshToken(){return this.session.getRefreshTokenSync()}isAuthenticated(){return!!this.getAccessToken()}}class Np{apiBaseUrl;workspaceId;contractWarnedKeys;tokenProvider;constructor(s,c){if(this.apiBaseUrl=s.apiBaseUrl,this.workspaceId=s.workspaceId.trim(),!this.workspaceId)throw new It("VALIDATION_ERROR","workspaceId is required in ChannelConfig",422);this.contractWarnedKeys=new Set,this.tokenProvider=c??new Ke(s.apiBaseUrl)}async execute(s,c,u,f,p,m){const y={app_id:s,external_user_id:(p||"web-user").trim(),external_chat_id:(f||`web-session-${Date.now()}`).trim(),mode:"workflow_chat",workflow_id:c,extra_context:{channel_id:s}},k=await this.resolveConversation(this.workspaceId,y),w=this._extractConversationId(k),R=await this.createMessage(w,{role:"user",content:u,attachments:m&&m.length>0?m:void 0}),z=this._extractExecutionId(R);return this._normalizeExecuteData({conversation_id:w,workflow_id:c,execution_id:z})}async workflowSupportsAttachments(s){try{const c=await this._fetch(`/workflows/${s}`,"GET");return(c?.definition?.nodes??c?.data?.definition?.nodes??[]).some(f=>f?.nodeType==="io/file_upload"||f?.node_type==="io/file_upload")}catch{return!1}}async resolveConversation(s,c){return this._fetch(`/workspaces/${s}/conversations/resolve`,"POST",c)}async getConversationMessages(s){const c=await this._fetch(`/conversations/${s}/messages`,"GET");return(Array.isArray(c)?c:Array.isArray(c?.data)?c.data:Array.isArray(c?.data?.items)?c.data.items:Array.isArray(c?.items)?c.items:[]).map(f=>({id:f.id??f.messageId??"",role:f.role??"assistant",content:f.content??"",createdAt:f.createdAt??f.created_at??new Date().toISOString(),executionId:f.executionId??f.execution_id}))}async createMessage(s,c){return this._fetch(`/conversations/${s}/messages`,"POST",c)}async submitApproval(s,c,u,f){return this._fetch(`/executions/${s}/approve`,"POST",{requestId:c,decision:u,scope:"once",reason:f||null})}async _fetch(s,c,u){const f=`${this.apiBaseUrl}${s}`;try{const p={"Content-Type":"application/json"},m=await this.tokenProvider.getAccessToken();if(!m)throw vn("missing-access-token"),new It("UNAUTHORIZED","Access token is missing",401);const y=u!==void 0?JSON.stringify(u):void 0,k=async z=>{const V={...p,Authorization:`Bearer ${z}`};return fetch(f,{method:c,headers:V,body:y})};let w=await k(m),R=!1;if(w.status===401&&this.tokenProvider.refreshAccessToken){const z=await this.tokenProvider.refreshAccessToken().catch(()=>null);z?w=await k(z):(vn("refresh-failed"),R=!0)}return w.ok||await this._handleError(w,R),w.json()}catch(p){throw p instanceof It?p:new It("NETWORK_ERROR",p instanceof Error?p.message:"Unknown network error",0)}}_extractConversationId(s){const c=s&&typeof s=="object"?s:{},u=c.data&&typeof c.data=="object"?c.data:c,f=u.id??u.conversation_id??u.conversationId;if(typeof f!="string"||!f)throw new It("UNKNOWN_ERROR","Conversation resolve response missing conversation id",500,s);return f}_extractExecutionId(s){const c=s&&typeof s=="object"?s:{},u=c.data&&typeof c.data=="object"?c.data:c,f=c.metadata&&typeof c.metadata=="object"?c.metadata:u.metadata&&typeof u.metadata=="object"?u.metadata:null,p=f?.execution_id??f?.executionId??u.execution_id??u.executionId??null;return typeof p=="string"?p:null}_normalizeExecuteData(s){const c=s&&typeof s=="object"?s:{},u=c.conversation_id??c.conversationId,f=c.workflow_id??c.workflowId,p=c.execution_id??c.executionId??null;(u===void 0||f===void 0)&&this._warnContract("execute-missing-fields","[contract-guard] execute response missing expected fields: conversation_id/workflow_id");const y=Object.keys(c).filter(k=>k.includes("_"));return y.length>0&&this._warnContract("execute-snake-keys",`[contract-guard] execute response contains snake_case keys: ${y.join(", ")}`),{conversation_id:typeof u=="string"?u:"",workflow_id:typeof f=="string"?f:"",execution_id:typeof p=="string"?p:null}}_warnContract(s,c){this.contractWarnedKeys.has(s)||(this.contractWarnedKeys.add(s),console.warn(c))}async _handleError(s,c){const u=s.status;let f;try{f=await s.json()}catch{f={message:s.statusText}}const p=f.message||f.error||"Unknown error";switch(u){case 401:throw c||vn("channel-unauthorized"),new It("UNAUTHORIZED","Access token is invalid or expired",u,f);case 404:throw new It("NOT_FOUND","Resource not found",u,f);case 422:throw new It("VALIDATION_ERROR",p,u,f);case 429:throw new It("RATE_LIMIT","Too many requests",u,f);case 500:case 502:case 503:case 504:throw new It("SERVER_ERROR","Server error, please try again later",u,f);default:throw new It("UNKNOWN_ERROR",p,u,f)}}}class It extends Error{constructor(s,c,u,f){super(c),this.code=s,this.status=u,this.details=f,this.name="ChannelClientError"}code;status;details}class gd{storage;sessionKey;conversationKey;sessionsKey;conversationMapKey;constructor(s,c){this.storage=c||(typeof window<"u"?window.localStorage:new Ip),this.sessionKey=`cheng_session_${s}`,this.conversationKey=`cheng_conversation_${s}`,this.sessionsKey=`cheng_sessions_${s}`,this.conversationMapKey=`cheng_conversation_map_${s}`}getOrCreateSessionId(){let s=this.storage.getItem(this.sessionKey);return s||(s=this._generateUUID(),this.storage.setItem(this.sessionKey,s)),this._ensureCurrentSessionListed(s),s}resetSession(){const s=this._generateUUID();return this.storage.setItem(this.sessionKey,s),this.storage.removeItem(this.conversationKey),this._ensureCurrentSessionListed(s),s}setConversationId(s){this.storage.setItem(this.conversationKey,s);const c=this.getOrCreateSessionId(),u=this._getConversationMap();u[c]=s,this._setConversationMap(u),this._updateSession(c,{conversationId:s})}getConversationId(){const s=this.storage.getItem(this.sessionKey),c=this._getConversationMap();if(s&&c[s])return c[s];const u=this.storage.getItem(this.conversationKey);return s&&u&&(c[s]=u,this._setConversationMap(c),this._updateSession(s,{conversationId:u})),u}clearConversationId(){this.storage.removeItem(this.conversationKey);const s=this.storage.getItem(this.sessionKey);if(!s)return;const c=this._getConversationMap();delete c[s],this._setConversationMap(c),this._updateSession(s,{conversationId:void 0})}clear(){this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey),this.storage.removeItem(this.sessionsKey),this.storage.removeItem(this.conversationMapKey)}listSessions(){const s=this.storage.getItem(this.sessionsKey),c=this.storage.getItem(this.sessionKey),u=this._getConversationMap();if(!s){if(!c)return[];const f={id:c,label:"Session 1",createdAt:new Date().toISOString(),conversationId:u[c],pinned:!1};return this.storage.setItem(this.sessionsKey,JSON.stringify([f])),[f]}try{const p=JSON.parse(s).map(y=>({...y,conversationId:u[y.id]??y.conversationId}));c&&!p.some(y=>y.id===c)&&p.unshift({id:c,label:`Session ${p.length+1}`,createdAt:new Date().toISOString(),conversationId:u[c],pinned:!1});const m=[...p.filter(y=>y.pinned),...p.filter(y=>!y.pinned)];return this.storage.setItem(this.sessionsKey,JSON.stringify(m)),m}catch{return[]}}createSession(s){const c=this.listSessions(),u=this._generateUUID(),f=s??`Session ${c.length+1}`,p={id:u,label:f,createdAt:new Date().toISOString(),pinned:!1};return c.unshift(p),this.storage.setItem(this.sessionsKey,JSON.stringify(c)),this.storage.setItem(this.sessionKey,u),this.storage.removeItem(this.conversationKey),p}renameSession(s,c){const u=c.trim();u&&this._updateSession(s,{label:u})}togglePinSession(s){const c=this.listSessions().find(u=>u.id===s);c&&this._updateSession(s,{pinned:!c.pinned})}deleteSession(s){let c=this.listSessions();const u=this.storage.getItem(this.sessionKey);if(c=c.filter(p=>p.id!==s),this.storage.setItem(this.sessionsKey,JSON.stringify(c)),u===s)if(c.length>0){this.storage.setItem(this.sessionKey,c[0].id);const m=this._getConversationMap()[c[0].id];m?this.storage.setItem(this.conversationKey,m):this.storage.removeItem(this.conversationKey)}else this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey);const f=this._getConversationMap();delete f[s],this._setConversationMap(f)}getActiveSessionId(){return this.getOrCreateSessionId()}setActiveSessionId(s){this.storage.setItem(this.sessionKey,s),this._ensureCurrentSessionListed(s);const u=this._getConversationMap()[s];u?this.storage.setItem(this.conversationKey,u):this.storage.removeItem(this.conversationKey)}_getConversationMap(){const s=this.storage.getItem(this.conversationMapKey);if(!s)return{};try{return JSON.parse(s)}catch{return{}}}_setConversationMap(s){this.storage.setItem(this.conversationMapKey,JSON.stringify(s))}_updateSession(s,c){const f=this.listSessions().map(p=>p.id===s?{...p,...c}:p);this.storage.setItem(this.sessionsKey,JSON.stringify(f))}_ensureCurrentSessionListed(s){const c=this.listSessions();if(c.some(f=>f.id===s))return;const u=[{id:s,label:`Session ${c.length+1}`,createdAt:new Date().toISOString(),conversationId:this._getConversationMap()[s],pinned:!1},...c];this.storage.setItem(this.sessionsKey,JSON.stringify(u))}_generateUUID(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,s=>{const c=Math.random()*16|0;return(s==="x"?c:c&3|8).toString(16)})}}let Ip=class{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(s){return this.data.get(s)??null}key(s){return Array.from(this.data.keys())[s]??null}removeItem(s){this.data.delete(s)}setItem(s,c){this.data.set(s,c)}};const Ep="cheng_active_execution",rd=l=>typeof l=="object"&&l!==null;class Ap{storage;recordsKey;activeExecutionKey;constructor(s,c){this.storage=c||(typeof window<"u"?window.localStorage:new Tp),this.recordsKey=`cheng_execution_mappings_${s}`,this.activeExecutionKey=`${Ep}_${s}`}setActive(s){const c=new Date().toISOString(),u={...s,status:s.status??"pending",createdAt:s.createdAt??c,updatedAt:s.updatedAt??c},f=this._readRecords();return f[u.executionId]=u,this._writeRecords(f),this.storage.setItem(this.activeExecutionKey,u.executionId),u}getActive(){const s=this.storage.getItem(this.activeExecutionKey);return s?this.getByExecutionId(s):null}getActiveForConversation(s){const c=this.getActive();return c?.conversationId===s?c:this.findLatestByConversation(s)}getByExecutionId(s){return this._readRecords()[s]??null}findLatestByConversation(s){const c=Object.values(this._readRecords()).filter(u=>u.conversationId===s);return c.length===0?null:c.sort((u,f)=>new Date(f.updatedAt).getTime()-new Date(u.updatedAt).getTime())[0]}updateStatus(s,c){const u=this._readRecords(),f=u[s];if(!f)return null;const p={...f,status:c,updatedAt:new Date().toISOString()};return u[s]=p,this._writeRecords(u),p}clearExecution(s){const c=this._readRecords();c[s]&&(delete c[s],this._writeRecords(c),this.storage.getItem(this.activeExecutionKey)===s&&this.storage.removeItem(this.activeExecutionKey))}clearConversation(s){const c=this._readRecords();let u=!1;for(const[p,m]of Object.entries(c))m.conversationId===s&&(delete c[p],u=!0);u&&this._writeRecords(c),this.getActive()?.conversationId===s&&this.storage.removeItem(this.activeExecutionKey)}clear(){this.storage.removeItem(this.recordsKey),this.storage.removeItem(this.activeExecutionKey)}_readRecords(){const s=this.storage.getItem(this.recordsKey);if(!s)return{};try{const c=JSON.parse(s);return rd(c)?Object.entries(c).reduce((u,[f,p])=>{if(!rd(p))return u;const m=p,y=typeof m.boundWorkflowId=="string"?m.boundWorkflowId:typeof m.workflowId=="string"?m.workflowId:void 0;return typeof m.channelId=="string"&&typeof y=="string"&&typeof m.conversationId=="string"&&typeof m.executionId=="string"&&typeof m.externalChatId=="string"&&typeof m.status=="string"&&typeof m.createdAt=="string"&&typeof m.updatedAt=="string"&&(u[f]={channelId:m.channelId,boundWorkflowId:y,conversationId:m.conversationId,executionId:m.executionId,externalChatId:m.externalChatId,externalUserId:m.externalUserId,status:m.status,createdAt:m.createdAt,updatedAt:m.updatedAt}),u},{}):{}}catch{return{}}}_writeRecords(s){this.storage.setItem(this.recordsKey,JSON.stringify(s))}}class Tp{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(s){return this.data.get(s)??null}key(s){return Array.from(this.data.keys())[s]??null}removeItem(s){this.data.delete(s)}setItem(s,c){this.data.set(s,c)}}class zp{config;ws=null;status="disconnected";eventHandlers=new Map;statusHandlers=new Set;activeSubscriptions=new Set;reconnectTimer=null;reconnectAttempts=0;shouldReconnect=!0;_wsGeneration=0;heartbeatTimer=null;heartbeatTimeoutTimer=null;lastPongTime=0;messageQueue=[];contractWarnedKeys=new Set;constructor(s){this.config={url:s.url,tokenProvider:s.tokenProvider,reconnect:s.reconnect??!0,reconnectInterval:s.reconnectInterval??1e3,reconnectMaxInterval:s.reconnectMaxInterval??3e4,reconnectBackoffRate:s.reconnectBackoffRate??2,reconnectMaxAttempts:s.reconnectMaxAttempts??1/0,reconnectJitter:s.reconnectJitter??!1,heartbeatInterval:s.heartbeatInterval??3e4,heartbeatTimeout:s.heartbeatTimeout??1e4,debug:s.debug??!1}}connect(){if(this.shouldReconnect=!0,this.ws?.readyState===WebSocket.OPEN){this._log("Already connected");return}if(this.ws?.readyState===WebSocket.CONNECTING){this._log("Already connecting");return}const s=this.config.tokenProvider?.(),c=s?`${this.config.url}${this.config.url.includes("?")?"&":"?"}token=${encodeURIComponent(s)}`:this.config.url;this._log(`Connecting to ${this.config.url}...`),this._setStatus("connecting");try{this._wsGeneration++,this.ws=new WebSocket(c),this._setupWebSocketHandlers(this._wsGeneration)}catch(u){this._log("Connection error:",u),this._setStatus("error"),this._scheduleReconnect()}}disconnect(){this._log("Disconnecting..."),this.shouldReconnect=!1,this._clearTimers(),this.messageQueue=[],this.ws&&(this._setStatus("disconnecting"),this.ws.close(1e3,"Client disconnect"),this.ws=null),this._setStatus("disconnected")}subscribe(s){const c=this._serializeScope(s);if(this.activeSubscriptions.has(c)){this._log(`Already subscribed to ${c}`);return}this.activeSubscriptions.add(c);const u={type:"SUBSCRIBE",scope:s};this._send(JSON.stringify(u)),this._log(`Subscribed to ${c}`)}unsubscribe(s){const c=this._serializeScope(s);if(!this.activeSubscriptions.has(c)){this._log(`Not subscribed to ${c}`);return}this.activeSubscriptions.delete(c);const u={type:"UNSUBSCRIBE",scope:s};this._send(JSON.stringify(u)),this._log(`Unsubscribed from ${c}`)}on(s,c){this.eventHandlers.has(s)||this.eventHandlers.set(s,new Set),this.eventHandlers.get(s).add(c)}off(s,c){const u=this.eventHandlers.get(s);u&&(u.delete(c),u.size===0&&this.eventHandlers.delete(s))}onStatusChange(s){this.statusHandlers.add(s)}offStatusChange(s){this.statusHandlers.delete(s)}getStatus(){return this.status}getActiveSubscriptions(){return Array.from(this.activeSubscriptions).map(s=>this._deserializeScope(s))}_setupWebSocketHandlers(s){this.ws&&(this.ws.onopen=()=>{this._log("Connected"),setTimeout(()=>{this._setStatus("connected"),this._flushMessageQueue(),this._restoreSubscriptions(),this._startHeartbeat()},1)},this.ws.onclose=c=>{s===this._wsGeneration&&(this._log(`Connection closed: ${c.code} ${c.reason}`),this._clearTimers(),this._setStatus("disconnected"),this.shouldReconnect&&this.config.reconnect&&this._scheduleReconnect())},this.ws.onerror=c=>{this._log("WebSocket error:",c),this._setStatus("error")},this.ws.onmessage=c=>{this._handleMessage(c.data)})}_handleMessage(s){try{const c=JSON.parse(s),u=this._normalizeEnvelope(c);if(!u){this._log("Ignoring malformed envelope:",c);return}if(this._guardEnvelopeContract(c,u),this._log("Received:",u.type,u),u.type==="PONG"){this._handlePong();return}this._dispatchEvent(u)}catch(c){this._log("Failed to parse message:",c,s)}}_normalizeEnvelope(s){if(!s||typeof s!="object"||Array.isArray(s))return null;const c=this._deepCamelizeKeys(s),u=c.type;if(typeof u!="string")return null;const f=typeof c.messageId=="string"?c.messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,p=typeof c.timestamp=="string"?c.timestamp:new Date().toISOString();return{...c,messageId:f,timestamp:p,type:u}}_guardEnvelopeContract(s,c){const f=(s&&typeof s=="object"&&!Array.isArray(s)?Object.keys(s):[]).filter(k=>k.includes("_"));f.length>0&&this._warnContract(`snake:${c.type}`,`[contract-guard] WS ${c.type} contains snake_case keys: ${f.join(", ")}`);const m={MESSAGE_CREATED:["conversationId","messageId","role","content"],WORKFLOW_TRIGGERED:["conversationId","workflowId","executionId"],MESSAGE_COMPLETED:["conversationId","messageId"],NODE_STREAM_CHUNK:["executionId","nodeId","content","sequence"],NODE_STREAM_COMPLETE:["executionId","nodeId","fullContent"],NODE_STREAM_FAILED:["executionId","nodeId","error"],EXECUTION_FAILED:["executionId","error"],ERROR:["code","message"]}[c.type];if(!m)return;const y=m.filter(k=>c[k]===void 0||c[k]===null);y.length>0&&this._warnContract(`missing:${c.type}:${y.join(",")}`,`[contract-guard] WS ${c.type} missing expected fields: ${y.join(", ")}`)}_warnContract(s,c){this.contractWarnedKeys.has(s)||(this.contractWarnedKeys.add(s),console.warn(c))}_deepCamelizeKeys(s){if(Array.isArray(s))return s.map(f=>this._deepCamelizeKeys(f));if(!s||typeof s!="object")return s;const c=s,u={};for(const[f,p]of Object.entries(c))u[this._toCamelCase(f)]=this._deepCamelizeKeys(p);return u}_toCamelCase(s){return s.replace(/_([a-z])/g,(c,u)=>u.toUpperCase())}_dispatchEvent(s){const c=this.eventHandlers.get("*");c&&c.forEach(f=>{try{f(s)}catch(p){this._log("Error in wildcard handler:",p)}});const u=this.eventHandlers.get(s.type);u&&u.forEach(f=>{try{f(s)}catch(p){this._log(`Error in ${s.type} handler:`,p)}})}_send(s){const c=this._wrapEnvelope(s);this.ws?.readyState===WebSocket.OPEN?(this.ws.send(c),this._log("Sent:",c)):(this.messageQueue.push(s),this._log("Queued:",s))}_wrapEnvelope(s){try{const c=JSON.parse(s),u={messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,timestamp:new Date().toISOString(),...c};return JSON.stringify(u)}catch{return s}}_flushMessageQueue(){this.messageQueue.length!==0&&(this._log(`Flushing ${this.messageQueue.length} queued messages`),this.messageQueue.forEach(s=>{this.ws?.readyState===WebSocket.OPEN&&this.ws.send(this._wrapEnvelope(s))}),this.messageQueue=[])}_restoreSubscriptions(){this.activeSubscriptions.size!==0&&(this._log(`Restoring ${this.activeSubscriptions.size} subscriptions`),this.messageQueue=this.messageQueue.filter(s=>{try{const c=JSON.parse(s);return c.type!=="SUBSCRIBE"&&c.type!=="UNSUBSCRIBE"}catch{return!0}}),this.activeSubscriptions.forEach(s=>{const u={type:"SUBSCRIBE",scope:this._deserializeScope(s)};this.ws?.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(u))}))}_scheduleReconnect(){if(!this.config.reconnect||!this.shouldReconnect)return;if(this.reconnectAttempts>=this.config.reconnectMaxAttempts){this._log(`Max reconnect attempts (${this.config.reconnectMaxAttempts}) reached, giving up`),this.shouldReconnect=!1,this._setStatus("error");return}let s=Math.min(this.config.reconnectInterval*Math.pow(this.config.reconnectBackoffRate,this.reconnectAttempts),this.config.reconnectMaxInterval);if(this.config.reconnectJitter){const c=s*.3*Math.random();s=s+c}this._log(`Reconnecting in ${Math.round(s)}ms (attempt ${this.reconnectAttempts+1}/${this.config.reconnectMaxAttempts})`),this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.reconnectAttempts++,this._setStatus("connecting"),this.connect()},s)}_startHeartbeat(){this._clearHeartbeat(),this.heartbeatTimer=setInterval(()=>{this._sendPing()},this.config.heartbeatInterval),this._sendPing()}_sendPing(){this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null);const s={type:"PING",timestamp:Date.now()};this._send(JSON.stringify(s)),this.heartbeatTimeoutTimer=setTimeout(()=>{this._log(`Heartbeat timeout (${this.config.heartbeatTimeout}ms), reconnecting...`),this.ws?.close(1e3,"Heartbeat timeout")},this.config.heartbeatTimeout)}_handlePong(){const s=Date.now(),c=this.lastPongTime?s-this.lastPongTime:0;this.lastPongTime=s,this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null),this._log(`Heartbeat OK${c?` (Δ ${c}ms)`:""}`)}_clearHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=null),this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null)}_clearTimers(){this._clearHeartbeat(),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null)}_setStatus(s){this.status!==s&&(this.status=s,this._log(`Status changed: ${s}`),this.statusHandlers.forEach(c=>{try{c(s)}catch(u){this._log("Error in status handler:",u)}}))}_serializeScope(s){if(s.type==="workspace")return`ws:${s.workspaceId}`;if(s.type==="conversation")return`conv:${s.conversationId}`;if(s.type==="execution")return`exec:${s.executionId}`;throw new Error(`Unknown scope type: ${s.type}`)}_deserializeScope(s){const[c,u]=s.split(":");if(c==="ws")return{type:"workspace",workspaceId:u};if(c==="conv")return{type:"conversation",conversationId:u};if(c==="exec")return{type:"execution",executionId:u};throw new Error(`Invalid scope key: ${s}`)}_log(...s){this.config.debug&&console.log("[WsClient]",...s)}}const ke=l=>typeof l=="object"&&l!==null;function Qo(l){if(Array.isArray(l))return l;if(!ke(l))return[];const s=l,c=ke(s.data)?s.data:void 0;return Array.isArray(c?.items)?c.items:Array.isArray(s.data)?s.data:Array.isArray(s.items)?s.items:[]}function Xo(l,s){const c=l.bound_workflow_id??l.boundWorkflowId,u=c!=null&&c!==""?String(c):"";return{id:String(l.id??""),workspaceId:String(l.workspace_id??l.workspaceId??s),channelId:String(l.channel_id??l.channelId??""),name:String(l.name??""),description:l.description!=null?String(l.description):void 0,boundWorkflowId:u,appType:typeof l.app_type=="string"?l.app_type:typeof l.appType=="string"?l.appType:void 0,connectionConfig:ke(l.connection_config)?l.connection_config:ke(l.connectionConfig)?l.connectionConfig:void 0,enabled:typeof l.enabled=="boolean"?l.enabled:!0,connectionState:typeof l.connection_state=="string"?l.connection_state:typeof l.connectionState=="string"?l.connectionState:void 0,setupData:ke(l.setup_data)?l.setup_data:ke(l.setupData)?l.setupData:void 0,webhookUrl:typeof l.webhook_url=="string"?l.webhook_url:typeof l.webhookUrl=="string"?l.webhookUrl:void 0,createdAt:String(l.created_at??l.createdAt??new Date().toISOString()),updatedAt:String(l.updated_at??l.updatedAt??l.created_at??l.createdAt??new Date().toISOString())}}function Lp(l){const c=(Array.isArray(l.tags)?l.tags:[]).find(p=>p.startsWith("chid:"));if(!c)return null;const u=ke(l.metadata)?l.metadata:{},f=String(l.id??l.workflowId??l.workflow_id??"");return{id:f,workspaceId:String(u.workspace_id??u.workspaceId??""),channelId:c.slice(5),name:String(u.display_name??l.name??""),description:l.description?String(l.description):void 0,boundWorkflowId:String(u.workflow_id??u.workflowId??f),appType:typeof u.app_type=="string"?u.app_type:void 0,connectionConfig:ke(u.connection_config)?u.connection_config:void 0,enabled:!0,createdAt:String(l.created_at??l.createdAt??new Date().toISOString()),updatedAt:String(l.updated_at??l.updatedAt??l.created_at??l.createdAt??new Date().toISOString())}}function Rp(l){const s=ke(l.metadata)?l.metadata:{},c=l.id??l.workflow_id??l.workflowId,u=l.name??l.display_name??l.displayName??s.display_name??s.displayName??c;return{id:String(c??""),name:String(u??""),description:l.description!=null?String(l.description):void 0,state:typeof l.state=="string"?l.state:void 0,visibility:typeof l.visibility=="string"?l.visibility:void 0,tags:Array.isArray(l.tags)?l.tags.map(String):[],createdAt:typeof(l.created_at??l.createdAt)=="string"?String(l.created_at??l.createdAt):void 0,updatedAt:typeof(l.updated_at??l.updatedAt)=="string"?String(l.updated_at??l.updatedAt):void 0}}class tt{constructor(s,c){this.apiBaseUrl=s,this.tokenProvider=c}apiBaseUrl;tokenProvider;async listChannels(){let s;try{s=await this.listWorkspaces()}catch(f){if(od(f))throw f;return this._listChannelsLegacy()}if(s.length===0)return this._listChannelsLegacy();const c=[];let u=!1;for(const f of s){const p=await this._fetchChannelsByWorkspaceSafe(f.id);p!==null&&(u=!0,c.push(...p))}return u?c:this._listChannelsLegacy()}async createChannel(s){try{const c=await this._fetch(`/workspaces/${s.workspaceId}/channels`,"POST",{channel_id:s.channelId,name:s.name,bound_workflow_id:s.boundWorkflowId,description:s.description,app_type:s.appType,connection_config:s.connectionConfig}),u=ke(c)?c:void 0,f=ke(u?.data)?u?.data:u??{};return Xo(f,s.workspaceId)}catch(c){if(c instanceof ei&&c.status===409){const u=ke(c.body)?c.body:void 0,f=ke(u?.details)?u.details:void 0,p=ke(f?.existing_channel)?f.existing_channel:void 0;if(p)return Xo(p,s.workspaceId);throw new Error(`Integration with ID "${s.channelId}" already exists in this workspace.`)}if(!Js(c))throw c;return this._createChannelLegacy(s)}}async updateChannel(s){const c=await this._fetch(`/workspaces/${s.workspaceId}/channels/${s.id}`,"PATCH",{channel_id:s.channelId,name:s.name,bound_workflow_id:s.boundWorkflowId,description:s.description,app_type:s.appType,connection_config:s.connectionConfig}),u=ke(c)?c:void 0,f=ke(u?.data)?u?.data:u??{};return Xo(f,s.workspaceId)}async deleteChannel(s,c){if(c)try{await this._fetch(`/workspaces/${c}/channels/${s}`,"DELETE");return}catch(u){if(!Js(u))throw u}await this._fetch(`/workflows/${s}`,"DELETE")}async listWorkspaces(){const s=await this._fetch("/workspaces","GET");return Qo(s).map(u=>{const f=u;return{id:String(f.id??f.workspace_id??""),name:String(f.name??""),description:f.description?String(f.description):void 0,createdAt:String(f.created_at??f.createdAt??new Date().toISOString()),updatedAt:f.updated_at?String(f.updated_at):f.updatedAt?String(f.updatedAt):void 0}})}async createWorkspace(s){const c=await this._fetch("/workspaces","POST",{name:s.name,description:s.description}),u=ke(c)?c:void 0,p=ke(u?.data)?u?.data:u??{};return{id:String(p.id??p.workspace_id??""),name:String(p.name??s.name),description:p.description?String(p.description):s.description,createdAt:String(p.created_at??p.createdAt??new Date().toISOString()),updatedAt:p.updated_at?String(p.updated_at):p.updatedAt?String(p.updatedAt):void 0}}async listPublishedWorkflows(s={}){const c=s.limit??100,u=new URLSearchParams({tags:"long_task",limit:String(c)}),f=await this._fetch(`/workflows?${u.toString()}`,"GET");return Qo(f).map(m=>Rp(m)).filter(m=>m.id.trim().length>0)}async getWorkflowName(s){const c=await this._fetch(`/workflows/${s}`,"GET"),u=ke(c)?c:void 0,p=ke(u?.data)?u?.data:u??{},m=ke(p.metadata)?p.metadata:void 0,y=p.name??p.display_name??p.displayName??m?.display_name??m?.displayName??p.title;return typeof y=="string"&&y.trim()?y.trim():null}async getChannelStatus(s,c){const u=await this._fetch(`/workspaces/${s}/channels/${c}/status`,"GET"),f=ke(u)?u:{},p=ke(f.data)?f.data:f;return{connectionState:String(p.connection_state??p.connectionState??"idle"),ok:typeof p.ok=="boolean"?p.ok:void 0,details:typeof p.details=="string"?p.details:void 0,lastMessageAt:typeof p.last_message_at=="string"?p.last_message_at:void 0,error:typeof p.error=="string"?p.error:void 0,mode:p.mode==="polling"||p.mode==="webhook"||p.mode==="stream"?p.mode:void 0,workerRunning:typeof p.worker_running=="boolean"?p.worker_running:void 0,lastPollAt:typeof p.last_poll_at=="string"?p.last_poll_at:void 0,startedAt:typeof p.started_at=="string"?p.started_at:void 0,lastEventAt:typeof p.last_event_at=="string"?p.last_event_at:void 0,lastError:typeof p.last_error=="string"?p.last_error:void 0}}async getChannelCapabilities(s,c){const u=await this._fetch(`/workspaces/${s}/channels/${c}/capabilities`,"GET"),f=ke(u)?u:{},p=ke(f.data)?f.data:f,m=y=>typeof y=="boolean"?y:void 0;return{raw:p,directMessage:m(p.direct_message),groupChat:m(p.group_chat),reactions:m(p.reactions),messageEdit:m(p.message_edit),messageDelete:m(p.message_delete),mediaUpload:m(p.media_upload),mediaDownload:m(p.media_download),typingIndicator:m(p.typing_indicator),readReceipts:m(p.read_receipts),webhooks:m(p.webhooks),longPolling:m(p.long_polling)}}async getChannelAuthPattern(s,c){const u=await this._fetch(`/workspaces/${s}/channels/${c}/auth-pattern`,"GET"),f=ke(u)?u:{},p=ke(f.data)?f.data:f,m=p.pattern??p.auth_pattern??p.authPattern;return{authPattern:Mp(m),raw:p,fields:Array.isArray(p.fields)?p.fields:void 0,webhookUrl:typeof(p.webhook_url??p.webhookUrl)=="string"?String(p.webhook_url??p.webhookUrl):void 0,oauthUrl:typeof(p.oauth_url??p.oauthUrl)=="string"?String(p.oauth_url??p.oauthUrl):void 0,instructions:typeof p.instructions=="string"?p.instructions:void 0}}async connectChannel(s,c,u){const f=await this._fetch(`/workspaces/${s}/channels/${c}/connect`,"POST",u),p=ke(f)?f:{},m=ke(p.data)?p.data:p;return{connectionState:String(m.connection_state??m.connectionState??"connecting"),setupData:ke(m.setup_data)?m.setup_data:ke(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async completeConnect(s,c,u){const f=await this._fetch(`/workspaces/${s}/channels/${c}/connect/complete`,"POST",u),p=ke(f)?f:{},m=ke(p.data)?p.data:p;return{connectionState:String(m.connection_state??m.connectionState??"active"),setupData:ke(m.setup_data)?m.setup_data:ke(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async disconnectChannel(s,c){await this._fetch(`/workspaces/${s}/channels/${c}/connect`,"DELETE")}async _fetchChannelsByWorkspaceSafe(s){try{const c=await this._fetch(`/workspaces/${s}/channels`,"GET");return Qo(c).map(f=>Xo(f,s))}catch(c){if(Js(c))return null;if(od(c))throw c;return[]}}async _listChannelsLegacy(){const s=await this._fetch("/workflows","GET"),c=Qo(s),u=[];for(const f of c){const p=Lp(f);p&&u.push(p)}return u}async _createChannelLegacy(s){const u=(await this._listChannelsLegacy()).find(z=>z.channelId===s.channelId);if(u)return u;const f={name:s.channelId,description:s.description,tags:[`chid:${s.channelId}`],metadata:{channel_id:s.channelId,workspace_id:s.workspaceId,display_name:s.name,workflow_id:s.boundWorkflowId,app_type:s.appType,connection_config:s.connectionConfig}},p=await this._fetch("/workflows","POST",f),m=ke(p)?p:void 0,k=ke(m?.data)?m?.data:m??{},w=ke(k.metadata)?k.metadata:{};return{id:String(k.id??k.workflowId??k.workflow_id??""),workspaceId:s.workspaceId,channelId:s.channelId,name:String(w.display_name??s.name),description:k.description?String(k.description):s.description,boundWorkflowId:String(w.workflow_id??w.workflowId??s.boundWorkflowId),appType:typeof w.app_type=="string"?w.app_type:s.appType,connectionConfig:ke(w.connection_config)?w.connection_config:s.connectionConfig,enabled:!0,createdAt:String(k.created_at??k.createdAt??new Date().toISOString()),updatedAt:String(k.updated_at??k.updatedAt??k.created_at??k.createdAt??new Date().toISOString())}}async _fetch(s,c,u){const f=`${this.apiBaseUrl}${s}`,p=await this.tokenProvider.getAccessToken();if(!p)throw vn("missing-access-token"),new Error("Authentication required");const m=async w=>fetch(f,{method:c,headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:u!==void 0?JSON.stringify(u):void 0});let y=await m(p),k=!1;if(y.status===401&&this.tokenProvider.refreshAccessToken){const w=await this.tokenProvider.refreshAccessToken().catch(()=>null);w?y=await m(w):(vn("refresh-failed"),k=!0)}if(!y.ok){y.status===401&&!k&&vn("unauthorized");const w=await y.text().catch(()=>"");let R;try{R=JSON.parse(w)}catch{R=void 0}throw new ei(y.status,`Management API error ${y.status}: ${w}`,R)}return y.status===204||y.headers.get("content-length")==="0"?null:y.json().catch(()=>null)}}class ei extends Error{constructor(s,c,u){super(c),this.status=s,this.body=u,this.name="ManagementApiError"}status;body}function Js(l){return l instanceof ei?l.status===404||l.status===405:l instanceof Error?l.message.includes("404")||l.message.includes("405"):!1}function od(l){return l instanceof ei?l.status===401||l.status===403:l instanceof Error?l.message.includes("401")||l.message.includes("403")||l.message.toLowerCase().includes("authentication"):!1}const id=new Set;function Mp(l){const s=["webhook_token","webhook_signature","webhook_encrypted_signature","oauth","qr_session","stream_connection"],c=typeof l=="string"?l.toLowerCase().replace(/-/g,"_"):"";return s.includes(c)?c:(c&&!id.has(c)&&(id.add(c),console.warn(`[ManagementClient] Unknown auth-pattern value "${c}" from backend. Expected one of: ${s.join(", ")}. Defaulting to "webhook_token".`)),"webhook_token")}function Pp(l){const{autoConnect:s=!0,url:c,tokenProvider:u,...f}=l,p=h.useRef(!1),m=h.useRef(null),[y,k]=h.useState("disconnected"),[w,R]=h.useState([]);h.useEffect(()=>{const K={url:c,tokenProvider:u,...f},$=new zp(K);m.current=$;const X=se=>{k(se)};$.onStatusChange(X);let ie=null;return s&&!p.current&&(ie=setTimeout(()=>{$.connect()},0)),()=>{ie&&clearTimeout(ie),$.offStatusChange(X),$.disconnect(),m.current=null}},[c]),h.useEffect(()=>{if(typeof window>"u")return;const K=()=>{p.current=!0,m.current?.disconnect(),R([])};return window.addEventListener(Dr,K),()=>{window.removeEventListener(Dr,K)}},[]);const z=h.useCallback(()=>{if(p.current){if(!(typeof window<"u"&&!!window.localStorage.getItem(Zo)))return;p.current=!1}m.current?.connect()},[]),V=h.useCallback(()=>{m.current?.disconnect()},[]),E=h.useCallback(K=>{m.current?.subscribe(K),R(m.current?.getActiveSubscriptions()||[])},[]),G=h.useCallback(K=>{m.current?.unsubscribe(K),R(m.current?.getActiveSubscriptions()||[])},[]),j=h.useCallback((K,$)=>{m.current?.on(K,$)},[]),B=h.useCallback((K,$)=>{m.current?.off(K,$)},[]);return{status:y,connect:z,disconnect:V,subscribe:E,unsubscribe:G,on:j,off:B,activeSubscriptions:w,isConnected:y==="connected",isConnecting:y==="connecting",isDisconnected:y==="disconnected"}}function Dp(l,s){switch(s.type){case"ADD_MESSAGE":return[...l,s.message];case"UPDATE_MESSAGE":return l.map(c=>c.id===s.id?{...c,...s.updates}:c);case"REMOVE_MESSAGE":return l.filter(c=>c.id!==s.id);case"REMOVE_ASSISTANT_BY_EXEC_ID":return l.filter(c=>!(c.role==="assistant"&&c.executionId===s.executionId));case"UPDATE_AGENT_REVIEW_BY_EXEC_ID":return l.map(c=>c.executionId===s.executionId&&c.agentReview?{...c,agentReview:{...c.agentReview,...s.updates}}:c);case"REMOVE_EMPTY_ASSISTANTS":return l.filter(c=>!(c.role==="assistant"&&!c.content));case"CLEAR_MESSAGES":return[];case"SET_MESSAGES":return s.messages;default:return l}}function Wp(l){return l?l.includes("No response output found in execution")?"工作流未返回任何输出（请检查工作流是否配置了节点）":l.includes("No nodes")||l.includes("0 nodes")?"工作流没有节点，请先添加节点":l.includes("timeout")||l.includes("Timeout")?"工作流执行超时":l.includes("not found")||l.includes("Not found")?"工作流或资源未找到":l:"工作流执行失败"}function Fp(l){const s=l.replace(/\s+/g," ").trim();if(!s)return"新会话";const c=s.split(/\r?\n/)[0]?.trim()??s,u=c.split(/[。！？!?]/)[0]?.trim()||c,f=18;return u.length<=f?u:`${u.slice(0,f)}...`}function Op(l){if(!l)return!0;const s=l.trim();return/^(session|会话|新会话)(\s*\d+)?$/i.test(s)}function Up(l){const s=h.useRef(null),c=h.useRef(null),u=h.useRef(null),[f,p]=h.useReducer(Dp,[]),[m,y]=h.useState(!1),[k,w]=h.useState(null),[R,z]=h.useState(null),[V,E]=h.useState(!1),G=h.useRef(""),j=h.useRef(null),B=h.useRef(null),W=h.useRef(null),U=h.useRef(null),J=h.useRef(Date.now()),K=h.useRef(new Ke(l.apiBaseUrl)),$=Pp({url:l.wsBaseUrl,tokenProvider:()=>K.current.getAccessTokenSync(),autoConnect:!0,debug:!1}),X=$.subscribe,ie=$.unsubscribe,se=$.on,ae=$.off,ee=$.connect,le=h.useCallback(A=>{A&&p({type:"UPDATE_AGENT_REVIEW_BY_EXEC_ID",executionId:A,updates:{status:"pending"}})},[]);h.useEffect(()=>{s.current=new Np(l),c.current=new gd(l.channelId),u.current=new Ap(l.channelId),l.sessionId&&c.current.setActiveSessionId(l.sessionId),p({type:"CLEAR_MESSAGES"}),y(!1),w(null),z(null),G.current="",j.current=null,B.current=null,W.current=null,U.current=null;const A=c.current.getConversationId();if(A){W.current=A,X({type:"conversation",conversationId:A});const M=u.current.getActiveForConversation(A);M&&(U.current=M.executionId,X({type:"execution",executionId:M.executionId})),(async()=>{try{const F=[...await s.current.getConversationMessages(A)].sort((g,S)=>new Date(g.createdAt).getTime()-new Date(S.createdAt).getTime());p({type:"SET_MESSAGES",messages:F.map(g=>({id:g.id,role:g.role??"assistant",content:g.content,status:"completed",createdAt:new Date(g.createdAt),executionId:g.executionId}))})}catch{}})()}},[l.apiBaseUrl,l.channelId,l.sessionId,X]),h.useEffect(()=>{const A=l.boundWorkflowId?.trim();if(!A||!s.current){E(!1);return}let M=!1;return s.current.workflowSupportsAttachments(A).then(P=>{M||E(P)}).catch(()=>{M||E(!1)}),()=>{M=!0}},[l.boundWorkflowId,l.apiBaseUrl]),h.useEffect(()=>{const A=H=>H?U.current===H:!1,M=H=>{J.current=Date.now(),H.role==="assistant"&&(le(U.current),j.current?(p({type:"UPDATE_MESSAGE",id:j.current,updates:{content:H.content,status:"completed"}}),j.current=null,B.current=null):p({type:"ADD_MESSAGE",message:{id:`msg-assistant-${Date.now()}`,role:"assistant",content:H.content,status:"completed",executionId:U.current??void 0,createdAt:new Date}}),U.current&&(u.current?.updateStatus(U.current,"completed"),u.current?.clearExecution(U.current)),G.current="",z(null),y(!1))},P=H=>{le(H.executionId||U.current),y(!1),j.current&&(p({type:"REMOVE_MESSAGE",id:j.current}),j.current=null,B.current=null),p({type:"REMOVE_EMPTY_ASSISTANTS"}),U.current&&u.current?.clearExecution(U.current),U.current&&(ie({type:"execution",executionId:U.current}),U.current=null)},F=H=>{J.current=Date.now();const{executionId:fe}=H;if(fe&&(U.current&&U.current!==fe&&ie({type:"execution",executionId:U.current}),U.current=fe,X({type:"execution",executionId:fe}),W.current&&u.current?.setActive({channelId:l.channelId,boundWorkflowId:H.workflowId,conversationId:W.current,executionId:fe,externalChatId:c.current?.getOrCreateSessionId()??"",externalUserId:l.externalUserId,status:"running"}),!j.current||B.current!==fe)){const Ne=`msg-assistant-${Date.now()}`;j.current=Ne,B.current=fe,p({type:"ADD_MESSAGE",message:{id:Ne,role:"assistant",content:"",status:"streaming",executionId:fe,createdAt:new Date}})}},g=H=>{A(H.executionId)&&(z(""),G.current="")},S=H=>{A(H.executionId)&&(J.current=Date.now(),G.current+=H.content,z(G.current),j.current&&p({type:"UPDATE_MESSAGE",id:j.current,updates:{content:G.current,status:"streaming"}}))},v=H=>{A(H.executionId)&&(H.fullContent&&G.current!==H.fullContent&&(console.warn("[useChannel] Stream content mismatch:",G.current.length,"vs",H.fullContent.length),G.current=H.fullContent,z(H.fullContent),j.current&&p({type:"UPDATE_MESSAGE",id:j.current,updates:{content:H.fullContent}})),H.usage&&console.log("[useChannel] Token usage:",H.usage),U.current===H.executionId&&u.current?.updateStatus(H.executionId,"completed"))},D=H=>{A(H.executionId)&&(y(!1),w(new Error(H.error)),j.current&&p({type:"UPDATE_MESSAGE",id:j.current,updates:{status:"error",content:H.partialContent||"流式输出失败"}}))},T=H=>{A(H.executionId)&&(J.current=Date.now(),y(!1),z(null),G.current="",j.current&&(p({type:"REMOVE_MESSAGE",id:j.current}),j.current=null,B.current=null),u.current?.updateStatus(H.executionId,"paused"),p({type:"ADD_MESSAGE",message:{id:`agent-review-${H.executionId}-${H.iteration}`,role:"assistant",content:H.reason||"Agent paused for review",status:"agent_review",executionId:H.executionId,agentReview:{nodeId:H.nodeId,iteration:H.iteration,reason:H.reason||"Agent paused for review",interimReport:H.interimReport||"",suggestedNextAction:H.suggestedNextAction,status:"waiting"},createdAt:new Date}}))},O=async H=>{if(!A(H.executionId)||(le(H.executionId),!j.current))return;const fe=s.current,Ne=c.current?.getConversationId();if(!(!fe||!Ne))try{const ye=(await fe.getConversationMessages(Ne)).find(Se=>Se.role==="assistant"&&Se.executionId===H.executionId);ye&&j.current&&(p({type:"UPDATE_MESSAGE",id:j.current,updates:{content:ye.content,status:"completed"}}),j.current=null,B.current=null,G.current="",z(null),y(!1))}catch{}},N=H=>{const fe=H.error||H.error||"",Ne=Wp(fe);w(new Error(Ne));const ce=H.executionId||H.execution_id;ce&&!A(ce)||(y(!1),j.current?(p({type:"REMOVE_MESSAGE",id:j.current}),j.current=null,B.current=null):p(ce?{type:"REMOVE_ASSISTANT_BY_EXEC_ID",executionId:ce}:{type:"REMOVE_EMPTY_ASSISTANTS"}),ce&&u.current?.updateStatus(ce,"failed"))},re=H=>{A(H.executionId)&&(J.current=Date.now(),y(!1),p({type:"ADD_MESSAGE",message:{id:`approval-${H.requestId}`,role:"assistant",content:`需要确认操作：${H.actionName}`,status:"approval",executionId:H.executionId,approval:{requestId:H.requestId,actionName:H.actionName,riskLevel:H.riskLevel,paramSummary:H.paramSummary,status:"pending"},createdAt:new Date}}))},xe=H=>{console.error("[useChannel] WebSocket error:",H.code,H.message),w(new Error(`${H.code}: ${H.message}`)),H.executionId&&j.current&&p({type:"UPDATE_MESSAGE",id:j.current,updates:{status:"error"}}),H.executionId&&u.current?.updateStatus(H.executionId,"failed")};return se("MESSAGE_CREATED",M),se("MESSAGE_COMPLETED",P),se("WORKFLOW_TRIGGERED",F),se("NODE_STREAM_START",g),se("NODE_STREAM_CHUNK",S),se("NODE_STREAM_COMPLETE",v),se("NODE_STREAM_FAILED",D),se("AGENT_PAUSED_FOR_REVIEW",T),se("EXECUTION_FAILED",N),se("EXECUTION_COMPLETE",O),se("APPROVAL_REQUESTED",re),se("ERROR",xe),()=>{ae("MESSAGE_CREATED",M),ae("MESSAGE_COMPLETED",P),ae("WORKFLOW_TRIGGERED",F),ae("NODE_STREAM_START",g),ae("NODE_STREAM_CHUNK",S),ae("NODE_STREAM_COMPLETE",v),ae("NODE_STREAM_FAILED",D),ae("AGENT_PAUSED_FOR_REVIEW",T),ae("EXECUTION_FAILED",N),ae("EXECUTION_COMPLETE",O),ae("APPROVAL_REQUESTED",re),ae("ERROR",xe)}},[se,ae,X,ie,le,l.channelId,l.externalUserId]),h.useEffect(()=>{const M=setInterval(()=>{Date.now()-J.current>3e5&&$.disconnect()},3e4);return()=>clearInterval(M)},[$.disconnect]);const ue=h.useCallback(async(A,M)=>{if(!s.current||!c.current)throw new Error("Channel client not initialized");if(!A.trim()&&(!M||M.length===0))return;J.current=Date.now(),ee(),w(null),y(!0),U.current&&(ie({type:"execution",executionId:U.current}),U.current=null);const P=l.sessionId||c.current.getOrCreateSessionId(),F=c.current.listSessions().find(S=>S.id===P);A.trim()&&Op(F?.label)&&(c.current.renameSession(P,Fp(A)),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cheng:session-label-updated",{detail:{channelId:l.channelId,sessionId:P}})));const g=`msg-user-${Date.now()}`;p({type:"ADD_MESSAGE",message:{id:g,role:"user",content:A,status:"sending",createdAt:new Date}});try{W.current&&X({type:"conversation",conversationId:W.current});const S=l.boundWorkflowId.trim();if(!S)throw new Error("Bound Workflow ID is required");const v=await s.current.execute(l.channelId,S,A,P,l.externalUserId,M);p({type:"UPDATE_MESSAGE",id:g,updates:{status:"sent"}});const{conversation_id:D,execution_id:T}=v;if(W.current=D,c.current.setConversationId(D),X({type:"conversation",conversationId:D}),T){U.current=T,X({type:"execution",executionId:T}),u.current?.setActive({channelId:l.channelId,boundWorkflowId:S,conversationId:D,executionId:T,externalChatId:P,externalUserId:l.externalUserId,status:"running"});let O=j.current;(!O||B.current!==T)&&(O=`msg-assistant-${Date.now()}`,j.current=O,B.current=T,p({type:"ADD_MESSAGE",message:{id:O,role:"assistant",content:"",status:"streaming",executionId:T,createdAt:new Date}}));const N=async(fe,Ne,ce,ye)=>{if(j.current!==ce)return;const Se=s.current;if(Se)try{const ot=(await Se.getConversationMessages(fe)).find(Et=>Et.role==="assistant"&&Et.executionId===Ne);if(j.current!==ce)return;if(ot){p({type:"UPDATE_MESSAGE",id:ce,updates:{content:ot.content,status:"completed"}}),u.current?.updateStatus(Ne,"completed"),u.current?.clearExecution(Ne),j.current=null,B.current=null,G.current="",z(null),y(!1);return}}catch{if(!ye||j.current!==ce)return;p({type:"REMOVE_MESSAGE",id:ce}),j.current=null,B.current=null,u.current?.updateStatus(Ne,"failed"),y(!1)}};setTimeout(()=>{N(D,T,O,!1)},250);const re=O,xe=D,H=T;[5e3,1e4,2e4,4e4].forEach((fe,Ne,ce)=>{setTimeout(async()=>{j.current===re&&(await N(xe,H,re,!1),Ne===ce.length-1&&j.current===re&&(p({type:"UPDATE_MESSAGE",id:re,updates:{status:"error",content:"执行超时，请重试"}}),j.current=null,B.current=null,u.current?.updateStatus(H,"failed"),y(!1)))},fe)})}else y(!1),console.warn("[useChannel] No execution_id returned, workflow not triggered")}catch(S){throw y(!1),w(S instanceof Error?S:new Error(String(S))),p({type:"UPDATE_MESSAGE",id:g,updates:{status:"error"}}),S}},[l.channelId,l.sessionId,l.boundWorkflowId,l.externalUserId,X,ie,ee]),te=h.useCallback(()=>{p({type:"CLEAR_MESSAGES"}),W.current=null,U.current=null,y(!1),w(null),z(null),G.current="",j.current=null,B.current=null,u.current?.clear(),c.current?.resetSession()},[]),_e=h.useCallback(async(A,M,P)=>{const F=f.find(g=>g.id===A);if(!(!F?.executionId||!F.approval||!s.current)){p({type:"UPDATE_MESSAGE",id:A,updates:{approval:{...F.approval,status:"submitting"}}});try{await s.current.submitApproval(F.executionId,F.approval.requestId,M,P),p({type:"UPDATE_MESSAGE",id:A,updates:{approval:{...F.approval,status:M,reason:P}}})}catch(g){const S=g instanceof Error?g:new Error(String(g));w(S),p({type:"UPDATE_MESSAGE",id:A,updates:{approval:{...F.approval,status:"error"}}})}}},[f]),Q=h.useCallback(async(A,M)=>{const P=f.find(F=>F.id===A);!P?.agentReview||P.agentReview.status!=="pending"||(p({type:"UPDATE_MESSAGE",id:A,updates:{agentReview:{...P.agentReview,status:"continuing"}}}),await ue(M?.trim()||P.agentReview.suggestedNextAction?.trim()||"Continue."))},[f,ue]),ne=$.isConnected?"connected":$.isConnecting?"connecting":$.status==="error"?"error":"disconnected";return{messages:f,sendMessage:ue,isLoading:m,connectionStatus:ne,streamingContent:R,resetConversation:te,submitApproval:_e,continueAgentReview:Q,error:k,supportsAttachments:V}}const sd="cheng_active_channel";function ad(l,s,c,u){const f=c.trim().toLowerCase();if(l.find(m=>u&&m.id===u?!1:m.workspaceId===s&&m.channelId.trim().toLowerCase()===f))throw new Error(`Agent ID "${c.trim()}" already exists in this workspace`)}function $p(l){const[s,c]=h.useState([]),[u,f]=h.useState(null),[p,m]=h.useState(!1),[y,k]=h.useState(null),w=h.useRef(null),R=h.useRef(null),z=h.useRef(l);z.current=l;const V=h.useRef([]);V.current=s,!R.current&&l&&(R.current=new Ke(l.apiBaseUrl));const E=h.useCallback(async()=>{const K=z.current;if(!K)return;const $=R.current;if(!$)return;if(!await $.getAccessToken()){const se={id:K.channelId,workspaceId:K.workspaceId??"",channelId:K.channelId,name:"Default",boundWorkflowId:K.boundWorkflowId,createdAt:new Date().toISOString()};c([se]),f(ae=>ae??se);return}w.current||(w.current=new tt(K.apiBaseUrl,$));const ie=w.current;m(!0),k(null);try{const se=await ie.listChannels();c(se);const ae=typeof window<"u"?window.localStorage.getItem(sd):null;f(ee=>ee?se.find(te=>te.channelId===ee.channelId)??se[0]??null:(ae?se.find(ue=>ue.channelId===ae):null)??se[0]??null)}catch(se){k(se instanceof Error?se:new Error(String(se)))}finally{m(!1)}},[]),G=h.useRef(!1);h.useEffect(()=>{G.current||(G.current=!0,E())},[E]);const j=h.useCallback(K=>{f(K),typeof window<"u"&&window.localStorage.setItem(sd,K.channelId)},[]),B=h.useCallback(async()=>{if(w.current)return w.current;const K=z.current;if(!K)throw new Error("Workspace not selected.");const $=R.current;if(!await $.getAccessToken())throw new Error("Authentication required. Please log in.");return w.current=new tt(K.apiBaseUrl,$),w.current},[]),W=h.useCallback(async K=>{ad(V.current,K.workspaceId,K.channelId);const X=await(await B()).createChannel(K);return await E(),j(X),X},[B,E,j]),U=h.useCallback(async K=>{ad(V.current,K.workspaceId,K.channelId,K.id);const X=await(await B()).updateChannel(K);return await E(),f(ie=>ie&&(ie.id===K.id||ie.channelId===K.channelId?X:ie)),X},[B,E]),J=h.useCallback(async K=>{const $=await B(),X=V.current.find(ie=>ie.id===K);await $.deleteChannel(K,X?.workspaceId),f(ie=>ie?.id===K?null:ie),await E()},[B,E]);return{channels:s,activeChannel:u,setActiveChannel:j,createChannel:W,updateChannel:U,deleteChannel:J,isLoading:p,error:y,refresh:E}}function Bp(l){const c=h.useRef(new ra(l)).current,[u,f]=h.useState(()=>c.isAuthenticated()),[p,m]=h.useState(!1),[y,k]=h.useState(null),[w,R]=h.useState(null),z=h.useCallback(async G=>{m(!0),k(null);try{const j=await c.login(G);R(j.user),f(!0)}catch(j){k(j instanceof Error?j.message:String(j))}finally{m(!1)}},[c]),V=h.useCallback(()=>{c.logout(),f(!1),R(null)},[c]),E=h.useCallback(()=>{f(c.isAuthenticated())},[c]);return h.useEffect(()=>{if(typeof window>"u")return;const G=()=>{f(!1),R(null),k("登录已过期，请重新登录。")};return window.addEventListener(Dr,G),()=>{window.removeEventListener(Dr,G)}},[]),{isAuthenticated:u,isLoading:p,error:y,user:w,login:z,logout:V,refresh:E}}const md=h.createContext(null);function Vp({config:l,children:s}){const c=Up(l);return n.jsx(md.Provider,{value:c,children:s})}function ti(){const l=h.useContext(md);if(!l)throw new Error("useChatContext must be used within a ChatProvider");return l}function Kp({className:l="",showText:s=!0}){const{connectionStatus:c}=ti(),u=Hp(c);return n.jsxs("div",{className:`cheng-status-indicator ${l}`,"data-status":c,children:[n.jsxs("div",{className:`cheng-status-indicator__container ${u.containerClass}`,children:[n.jsx("div",{className:`cheng-status-indicator__dot ${u.dotClass}`}),s&&n.jsx("span",{className:"cheng-status-indicator__text",children:u.text})]}),n.jsx("style",{children:Gp})]})}function Hp(l){switch(l){case"connected":return{text:"已连接",dotClass:"cheng-status-indicator__dot--connected",containerClass:""};case"connecting":return{text:"连接中...",dotClass:"cheng-status-indicator__dot--connecting",containerClass:"cheng-status-indicator__container--pulse"};case"disconnected":return{text:"已断开",dotClass:"cheng-status-indicator__dot--disconnected",containerClass:""};case"error":return{text:"连接错误",dotClass:"cheng-status-indicator__dot--error",containerClass:""};default:return{text:"未知状态",dotClass:"",containerClass:""}}}const Gp=`
  .cheng-status-indicator {
    display: inline-block;
  }

  .cheng-status-indicator__container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cheng-status-indicator__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  .cheng-status-indicator__dot--connected {
    background-color: #10b981; /* green */
  }

  .cheng-status-indicator__dot--connecting {
    background-color: #f59e0b; /* amber */
  }

  .cheng-status-indicator__dot--disconnected {
    background-color: #5e5d59; /* gray */
  }

  .cheng-status-indicator__dot--error {
    background-color: #b53333; /* red */
  }

  .cheng-status-indicator__text {
    font-size: 14px;
    color: #4d4c48;
  }

  /* 脉冲动画 */
  .cheng-status-indicator__container--pulse .cheng-status-indicator__dot {
    animation: cheng-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes cheng-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;function Qp({content:l,className:s="",showCursor:c=!0}){const u=h.useRef(null);return h.useEffect(()=>{u.current&&(u.current.scrollTop=u.current.scrollHeight)},[l]),n.jsxs("div",{className:`cheng-streaming-text ${s}`,ref:u,children:[n.jsxs("div",{className:"cheng-streaming-text__content",children:[l,c&&n.jsx("span",{className:"cheng-streaming-text__cursor",children:"▊"})]}),n.jsx("style",{children:Xp})]})}const Xp=`
  .cheng-streaming-text {
    position: relative;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .cheng-streaming-text__content {
    display: inline;
  }

  .cheng-streaming-text__cursor {
    display: inline-block;
    margin-left: 2px;
    animation: cheng-blink 1s step-end infinite;
    color: #4d4c48;
  }

  @keyframes cheng-blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;function Yp({message:l,className:s="",onRetry:c,onApprovalDecision:u,onAgentReviewContinue:f}){const p=l.role==="user",m=l.status==="streaming",y=l.status==="error",k=l.status==="sending",w=!!l.approval,R=!!l.agentReview;return n.jsxs("div",{className:`cheng-message-bubble ${s}`,"data-role":l.role,"data-status":l.status,children:[n.jsxs("div",{className:`cheng-message-bubble__container ${p?"cheng-message-bubble__container--user":"cheng-message-bubble__container--assistant"}`,children:[n.jsxs("div",{className:`cheng-message-bubble__bubble ${p?"cheng-message-bubble__bubble--user":"cheng-message-bubble__bubble--assistant"} ${y?"cheng-message-bubble__bubble--error":""}`,children:[!w&&!R&&(m?n.jsx(ld,{content:l.content,role:l.role,isStreaming:!0}):n.jsx(ld,{content:l.content,role:l.role})),k&&n.jsx("div",{className:"cheng-message-bubble__sending",children:n.jsx("div",{className:"cheng-message-bubble__spinner"})}),y&&c&&n.jsx("button",{className:"cheng-message-bubble__retry",onClick:()=>c(l.id),type:"button",children:"重试"}),w&&l.approval&&n.jsx(qp,{approval:l.approval,messageId:l.id,onDecision:u}),R&&l.agentReview&&n.jsx(Jp,{review:l.agentReview,messageId:l.id,onContinue:f})]}),n.jsx("div",{className:"cheng-message-bubble__timestamp",children:eh(l.createdAt)})]}),n.jsx("style",{children:th})]})}function ld({content:l,role:s,isStreaming:c=!1}){if(s!=="assistant")return n.jsx("div",{className:"cheng-message-bubble__content",children:l});const{thinkBlocks:u,visibleContent:f,hasThinkTag:p,isThinkOpen:m}=Zp(l),y=f.trim().length>0;return n.jsxs("div",{className:"cheng-message-bubble__content-wrap",children:[p&&n.jsxs("details",{className:"cheng-message-bubble__think",children:[n.jsx("summary",{className:"cheng-message-bubble__think-summary",children:m?"查看思考中...":"查看思考过程"}),n.jsx("div",{className:"cheng-message-bubble__think-body",children:u.map((k,w)=>n.jsx("div",{className:"cheng-message-bubble__think-block",children:k||"思考中..."},w))})]}),y?c?n.jsx(Qp,{content:f}):n.jsx("div",{className:"cheng-message-bubble__content",children:f}):c&&p&&n.jsx("div",{className:"cheng-message-bubble__thinking-label",children:"正在思考..."})]})}function qp({approval:l,messageId:s,onDecision:c}){const[u,f]=h.useState(!1),[p,m]=h.useState(""),y=l.status==="submitting",k=l.status==="approved"||l.status==="rejected",R={critical:"#b53333",high:"#b53333",medium:"#c96442",low:"#5e5d59"}[l.riskLevel.toLowerCase()]??"#5e5d59";let z=[];if(l.paramSummary)try{const V=typeof l.paramSummary=="string"?JSON.parse(l.paramSummary):l.paramSummary;z=Object.entries(V).map(([E,G])=>`${E}: ${G}`)}catch{z=[String(l.paramSummary)]}return n.jsxs("div",{className:"cheng-approval-card",children:[n.jsxs("div",{className:"cheng-approval-card__header",children:[n.jsxs("span",{className:"cheng-approval-card__risk",style:{color:R},children:["[",l.riskLevel.toUpperCase(),"]"]}),n.jsx("span",{className:"cheng-approval-card__action",children:l.actionName})]}),z.length>0&&n.jsx("div",{className:"cheng-approval-card__params",children:z.map((V,E)=>n.jsx("div",{className:"cheng-approval-card__param-line",children:V},E))}),k?n.jsxs("div",{className:"cheng-approval-card__settled",children:[n.jsx("span",{children:l.status==="approved"?"✓ 已批准":"✗ 已拒绝"}),l.reason&&n.jsxs("div",{className:"cheng-approval-card__settled-reason",children:["建议：",l.reason]})]}):n.jsxs(n.Fragment,{children:[u&&n.jsx("textarea",{className:"cheng-approval-card__suggestion",value:p,onChange:V=>m(V.target.value),placeholder:"请输入修改建议…",rows:2}),n.jsxs("div",{className:"cheng-approval-card__actions",children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--approve",disabled:y,onClick:()=>c?.(s,"approved"),type:"button",children:y?"提交中…":"批准"}),u?n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:y,onClick:()=>c?.(s,"rejected",p),type:"button",children:"确认拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--cancel",disabled:y,onClick:()=>{f(!1),m("")},type:"button",children:"取消"})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:y,onClick:()=>c?.(s,"rejected"),type:"button",children:"拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--suggest",disabled:y,onClick:()=>f(!0),type:"button",children:"拒绝并提建议"})]})]})]})]})}function Jp({review:l,messageId:s,onContinue:c}){const[u,f]=h.useState(l.suggestedNextAction||"Continue."),p=l.status==="waiting",m=l.status==="continuing",y=p||m;return n.jsxs("div",{className:"cheng-agent-review-card",children:[n.jsxs("div",{className:"cheng-agent-review-card__header",children:[n.jsx("span",{className:"cheng-agent-review-card__badge",children:"REVIEW"}),n.jsx("span",{className:"cheng-agent-review-card__title",children:"Agent paused"}),n.jsxs("span",{className:"cheng-agent-review-card__meta",children:["Iteration ",l.iteration]})]}),n.jsx("div",{className:"cheng-agent-review-card__reason",children:l.reason}),l.interimReport&&n.jsx("pre",{className:"cheng-agent-review-card__report",children:l.interimReport}),n.jsx("div",{className:"cheng-agent-review-card__suggestion",children:n.jsxs("label",{className:"cheng-agent-review-card__suggestion-label",children:["Next action",n.jsx("textarea",{className:"cheng-agent-review-card__suggestion-input",value:u,onChange:k=>f(k.target.value),rows:2,disabled:y})]})}),p&&n.jsx("div",{className:"cheng-agent-review-card__waiting",children:"Saving the paused state before resume..."}),n.jsx("button",{className:"cheng-agent-review-card__btn",disabled:y,onClick:()=>c?.(s,u.trim()||"Continue."),type:"button",children:p?"Saving...":m?"Continuing...":"Continue"})]})}function Zp(l){const s=[],c=[],u="<think>",f="</think>";let p=0,m=!1;for(;p<l.length;){const y=l.indexOf(u,p);if(y===-1){c.push(l.slice(p));break}c.push(l.slice(p,y));const k=y+u.length,w=l.indexOf(f,k);if(w===-1){s.push(l.slice(k).trim()),m=!0;break}s.push(l.slice(k,w).trim()),p=w+f.length}return{thinkBlocks:s,visibleContent:c.join("").trim(),hasThinkTag:s.length>0||l.includes(u),isThinkOpen:m}}function eh(l){const s=new Date,c=s.getTime()-l.getTime();return c<60*1e3?"刚刚":c<3600*1e3?`${Math.floor(c/6e4)} 分钟前`:l.toDateString()===s.toDateString()?l.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"}):l.toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}const th=`
  .cheng-message-bubble {
    margin-bottom: 16px;
  }

  .cheng-message-bubble__container {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cheng-message-bubble__container--user {
    align-items: flex-end;
  }

  .cheng-message-bubble__container--assistant {
    align-items: flex-start;
  }

  .cheng-message-bubble__bubble {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 12px;
    word-break: break-word;
    position: relative;
  }

  .cheng-message-bubble__bubble--user {
    background-color: #c96442; /* blue-500 */
    color: #faf9f5;
  }

  .cheng-message-bubble__bubble--assistant {
    background-color: #e8e6dc; /* gray-100 */
    color: #30302e; /* gray-800 */
  }

  .cheng-message-bubble__bubble--error {
    border: 2px solid #b53333; /* red-500 */
    background-color: #f3ddd8; /* red-100 */
  }

  .cheng-message-bubble__content {
    white-space: pre-wrap;
    line-height: 1.5;
  }

  .cheng-message-bubble__content-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cheng-message-bubble__think {
    border: 1px solid #e8e6dc;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.55);
    overflow: hidden;
  }

  .cheng-message-bubble__think-summary {
    cursor: pointer;
    list-style: none;
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 600;
    color: #4d4c48;
    user-select: none;
  }

  .cheng-message-bubble__think-summary::-webkit-details-marker {
    display: none;
  }

  .cheng-message-bubble__think-summary::before {
    content: "›";
    display: inline-block;
    margin-right: 6px;
    transition: transform 0.2s ease;
  }

  .cheng-message-bubble__think[open] .cheng-message-bubble__think-summary::before {
    transform: rotate(90deg);
  }

  .cheng-message-bubble__think-body {
    padding: 0 12px 12px;
    border-top: 1px solid #f0eee6;
  }

  .cheng-message-bubble__think-block {
    white-space: pre-wrap;
    line-height: 1.5;
    color: #5e5d59;
    padding-top: 10px;
  }

  .cheng-message-bubble__thinking-label {
    font-size: 13px;
    color: #5e5d59;
  }

  .cheng-message-bubble__timestamp {
    font-size: 12px;
    color: #87867f; /* gray-400 */
    padding: 0 8px;
  }

  .cheng-message-bubble__sending {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
  }

  .cheng-message-bubble__spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #faf9f5;
    border-radius: 50%;
    animation: cheng-spin 0.6s linear infinite;
  }

  .cheng-message-bubble__retry {
    margin-top: 8px;
    padding: 4px 12px;
    background-color: #b53333;
    color: #faf9f5;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cheng-message-bubble__retry:hover {
    background-color: #b53333;
  }

  @keyframes cheng-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .cheng-approval-card {
    margin-top: 10px;
    border: 1px solid #e8e6dc;
    border-radius: 8px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.6);
  }

  .cheng-agent-review-card {
    margin-top: 10px;
    border: 1px solid #e5b461;
    border-radius: 8px;
    padding: 12px;
    background: #fff7e8;
    color: #30302e;
  }

  .cheng-agent-review-card__header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .cheng-agent-review-card__badge {
    font-family: monospace;
    font-size: 11px;
    font-weight: 700;
    color: #9a5a1f;
  }

  .cheng-agent-review-card__title {
    font-size: 13px;
    font-weight: 700;
  }

  .cheng-agent-review-card__meta {
    font-size: 12px;
    color: #6b6258;
  }

  .cheng-agent-review-card__reason {
    font-size: 13px;
    line-height: 1.5;
    color: #4d4c48;
  }

  .cheng-agent-review-card__report {
    margin: 10px 0 0;
    max-height: 220px;
    overflow: auto;
    white-space: pre-wrap;
    border: 1px solid #f0d7ad;
    border-radius: 6px;
    background: #fffaf0;
    padding: 10px;
    font-size: 12px;
    line-height: 1.5;
  }

  .cheng-agent-review-card__suggestion {
    margin-top: 10px;
    border: 1px solid #f0d7ad;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.55);
    padding: 10px;
    font-size: 12px;
  }

  .cheng-agent-review-card__suggestion-label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 4px;
    font-weight: 700;
    color: #6b6258;
  }

  .cheng-agent-review-card__suggestion-input {
    width: 100%;
    min-height: 58px;
    resize: vertical;
    border: 1px solid #f0d7ad;
    border-radius: 6px;
    background: #fffaf0;
    padding: 8px;
    color: #30302e;
    font: inherit;
    font-weight: 400;
    line-height: 1.45;
  }

  .cheng-agent-review-card__suggestion-input:disabled {
    opacity: 0.7;
  }

  .cheng-agent-review-card__waiting {
    margin-top: 8px;
    font-size: 12px;
    color: #6b6258;
  }

  .cheng-agent-review-card__btn {
    margin-top: 12px;
    padding: 7px 16px;
    background-color: #c96442;
    color: #faf9f5;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }

  .cheng-agent-review-card__btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .cheng-approval-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  .cheng-approval-card__risk {
    font-family: monospace;
  }

  .cheng-approval-card__action {
    color: #30302e;
  }

  .cheng-approval-card__params {
    font-size: 12px;
    color: #5e5d59;
    margin-bottom: 10px;
    line-height: 1.6;
  }

  .cheng-approval-card__param-line {
    font-family: monospace;
  }

  .cheng-approval-card__actions {
    display: flex;
    gap: 8px;
  }

  .cheng-approval-card__btn {
    padding: 6px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .cheng-approval-card__btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cheng-approval-card__btn--approve {
    background: #c96442;
    color: #faf9f5;
  }

  .cheng-approval-card__btn--approve:hover:not(:disabled) {
    background: #b5583a;
  }

  .cheng-approval-card__btn--reject {
    background: #e8e6dc;
    color: #30302e;
  }

  .cheng-approval-card__btn--reject:hover:not(:disabled) {
    background: #d8d6cc;
  }

  .cheng-approval-card__btn--suggest {
    background: transparent;
    color: #5e5d59;
    border: 1px solid #e8e6dc;
  }

  .cheng-approval-card__btn--suggest:hover:not(:disabled) {
    background: #f0eee6;
  }

  .cheng-approval-card__btn--cancel {
    background: transparent;
    color: #87867f;
    border: none;
    font-size: 12px;
  }

  .cheng-approval-card__btn--cancel:hover:not(:disabled) {
    color: #30302e;
  }

  .cheng-approval-card__suggestion {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid #e8e6dc;
    border-radius: 6px;
    font-size: 12px;
    resize: vertical;
    margin-bottom: 8px;
    background: #faf9f5;
    color: #30302e;
    font-family: inherit;
    line-height: 1.5;
  }

  .cheng-approval-card__suggestion:focus {
    outline: none;
    border-color: #c96442;
  }

  .cheng-approval-card__settled {
    font-size: 13px;
    color: #5e5d59;
    font-weight: 500;
  }

  .cheng-approval-card__settled-reason {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #87867f;
  }
`;function nh({className:l="",onRetry:s}){const{messages:c,submitApproval:u,continueAgentReview:f}=ti(),p=h.useRef(null),[m,y]=h.useState(!1),[k,w]=h.useState(!0),R=()=>{if(!p.current)return;const{scrollTop:V,scrollHeight:E,clientHeight:G}=p.current,j=E-V-G<100;y(!j),w(j)},z=(V=!1)=>{if(!p.current)return;const E=p.current.scrollHeight;typeof p.current.scrollTo=="function"?p.current.scrollTo({top:E,behavior:V?"smooth":"auto"}):p.current.scrollTop=E};return h.useEffect(()=>{k&&z()},[c,k]),h.useEffect(()=>{z()},[]),n.jsxs("div",{className:`cheng-message-list ${l}`,children:[n.jsx("div",{className:"cheng-message-list__container",ref:p,onScroll:R,children:c.length===0?n.jsxs("div",{className:"cheng-message-list__empty",children:[n.jsx("div",{className:"cheng-message-list__empty-icon",children:"💬"}),n.jsx("p",{className:"cheng-message-list__empty-text",children:"开始对话吧"})]}):n.jsx("div",{className:"cheng-message-list__messages",children:c.map(V=>n.jsx(Yp,{message:V,onRetry:s,onApprovalDecision:u,onAgentReviewContinue:f},V.id))})}),m&&n.jsxs("button",{className:"cheng-message-list__scroll-button",onClick:()=>{z(!0),w(!0)},type:"button","aria-label":"滚动到底部",children:[n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M5 7.5L10 12.5L15 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),n.jsx("span",{className:"cheng-message-list__scroll-button-text",children:"新消息"})]}),n.jsx("style",{children:rh})]})}const rh=`
  .cheng-message-list {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .cheng-message-list__container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    scroll-behavior: smooth;
  }

  .cheng-message-list__container::-webkit-scrollbar {
    width: 6px;
  }

  .cheng-message-list__container::-webkit-scrollbar-track {
    background: transparent;
  }

  .cheng-message-list__container::-webkit-scrollbar-thumb {
    background: #e8e6dc;
    border-radius: 3px;
  }

  .cheng-message-list__container::-webkit-scrollbar-thumb:hover {
    background: #87867f;
  }

  .cheng-message-list__messages {
    display: flex;
    flex-direction: column;
  }

  .cheng-message-list__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #87867f;
  }

  .cheng-message-list__empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .cheng-message-list__empty-text {
    font-size: 16px;
    margin: 0;
  }

  .cheng-message-list__scroll-button {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: #faf9f5;
    color: #c96442;
    border: 1px solid #f0eee6;
    border-radius: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .cheng-message-list__scroll-button:hover {
    background-color: #f5f4ed;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .cheng-message-list__scroll-button-text {
    font-weight: 500;
  }
`;function oh(l){return new Promise((s,c)=>{const u=new FileReader;u.onload=()=>{const f=u.result,p=f.indexOf(",");s(p>=0?f.slice(p+1):f)},u.onerror=c,u.readAsDataURL(l)})}async function ih(l){return Promise.all(l.map(async s=>{const c=await oh(s);return{filename:s.name,mime_type:s.type||void 0,base64_content:c,size:s.size}}))}function sh(l){return l<1024?`${l} B`:l<1024*1024?`${(l/1024).toFixed(1)} KB`:`${(l/1024/1024).toFixed(1)} MB`}const ah=["image/jpeg","image/png","image/gif","image/webp","image/bmp","image/svg+xml","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","text/plain","text/csv","text/markdown","audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/flac","video/mp4","video/quicktime","video/x-msvideo","video/x-matroska","video/webm"].join(",");function lh({className:l="",placeholder:s="输入消息...",disabled:c=!1,maxLength:u=2e3,autoFocus:f=!0,channels:p=[],activeChannelId:m=null,activeChannel:y=null,onSelectChannel:k}){const{sendMessage:w,resetConversation:R,isLoading:z,supportsAttachments:V}=ti(),[E,G]=h.useState(""),[j,B]=h.useState([]),[W,U]=h.useState(!1),J=h.useRef(null),K=h.useRef(null),$=h.useRef(null),X=c||z,ie=!X&&(E.trim().length>0||j.length>0),se=Q=>{const ne=Q.trim().toLowerCase();return ne?p.find(A=>A.channelId.toLowerCase()===ne)??p.find(A=>A.id.toLowerCase()===ne)??p.find(A=>A.name.toLowerCase()===ne)??null:null};h.useEffect(()=>{if(!W)return;const Q=ne=>{K.current&&(K.current.contains(ne.target)||U(!1))};return window.addEventListener("mousedown",Q),()=>{window.removeEventListener("mousedown",Q)}},[W]);const ae=async Q=>{Q.preventDefault();const ne=E.trim();if(!(!ne&&j.length===0)&&!X)try{if(j.length===0&&ne.startsWith("~")){const M=ne.slice(1).trim();if(M.toLowerCase()==="new"){R(),G("");return}const P=se(M);if(P&&k){k(P),R(),G("");return}}let A;j.length>0&&(A=await ih(j)),await w(ne||" ",A),G(""),B([]),J.current&&(J.current.style.height="auto")}catch(A){console.error("[InputBar] Failed to send message:",A)}},ee=Q=>{Q.key==="Enter"&&!Q.shiftKey&&(Q.preventDefault(),ae(Q))},le=Q=>{const ne=Q.target.value;G(ne),J.current&&(J.current.style.height="auto",J.current.style.height=`${Math.min(J.current.scrollHeight,120)}px`)},ue=()=>{!V||X||$.current?.click()},te=Q=>{const ne=Array.from(Q.target.files??[]);ne.length!==0&&(B(A=>[...A,...ne]),Q.target.value="")},_e=Q=>{B(ne=>ne.filter((A,M)=>M!==Q))};return n.jsxs("div",{className:`cheng-input-bar ${l}`,children:[n.jsx("form",{className:"cheng-input-bar__form",onSubmit:ae,children:n.jsxs("div",{className:"cheng-input-bar__composer",children:[j.length>0&&n.jsx("div",{className:"cheng-input-bar__attachments",children:j.map((Q,ne)=>n.jsxs("div",{className:"cheng-input-bar__attachment-chip",children:[n.jsx("span",{className:"cheng-input-bar__attachment-icon",children:ch(Q.type)}),n.jsx("span",{className:"cheng-input-bar__attachment-name",title:Q.name,children:Q.name}),n.jsx("span",{className:"cheng-input-bar__attachment-size",children:sh(Q.size)}),n.jsx("button",{type:"button",className:"cheng-input-bar__attachment-remove",onClick:()=>_e(ne),"aria-label":`移除 ${Q.name}`,children:n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M2 2L10 10M10 2L2 10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]},ne))}),n.jsx("textarea",{ref:J,className:"cheng-input-bar__textarea",placeholder:s,value:E,onChange:le,onKeyDown:ee,disabled:X,maxLength:u,autoFocus:f,rows:1}),n.jsxs("div",{className:"cheng-input-bar__toolbar",children:[n.jsxs("div",{className:"cheng-input-bar__toolbar-left",children:[n.jsxs("div",{className:"cheng-input-bar__attachment-wrap",children:[n.jsx("button",{className:`cheng-input-bar__icon-button${V?"":" cheng-input-bar__icon-button--disabled"}`,type:"button","aria-label":"添加附件",title:V?"添加附件（PDF / 图片 / Word / Excel / 音视频等）":"当前工作流未配置附件上传节点",onClick:ue,disabled:!V||X,children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M15.5 8.5L8.5 15.5C6.843 17.157 4.157 17.157 2.5 15.5C0.843 13.843 0.843 11.157 2.5 9.5L9.5 2.5C10.657 1.343 12.343 1.343 13.5 2.5C14.657 3.657 14.657 5.343 13.5 6.5L6.5 13.5C5.948 14.052 5.052 14.052 4.5 13.5C3.948 12.948 3.948 12.052 4.5 11.5L11 5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})}),n.jsx("input",{ref:$,type:"file",multiple:!0,accept:ah,className:"cheng-input-bar__file-input",onChange:te,tabIndex:-1,"aria-hidden":"true"})]}),p.length>0&&n.jsxs("div",{className:"cheng-input-bar__select-wrap",ref:K,children:[n.jsx("button",{className:"cheng-input-bar__select-button",type:"button","aria-haspopup":"listbox","aria-expanded":W,onClick:()=>U(Q=>!Q),children:n.jsx("span",{className:"cheng-input-bar__select-button-text",children:y?.name||p[0]?.name||"Select channel"})}),W&&n.jsx("div",{className:"cheng-input-bar__select-menu",role:"listbox","aria-label":"Channels",children:p.map(Q=>{const ne=Q.id===m;return n.jsxs("button",{type:"button",role:"option","aria-selected":ne,className:`cheng-input-bar__select-option${ne?" cheng-input-bar__select-option--active":""}`,onClick:()=>{k?.(Q),U(!1)},children:[n.jsx("span",{className:"cheng-input-bar__select-option-name",children:Q.name}),n.jsx("span",{className:"cheng-input-bar__select-option-id",children:Q.channelId})]},Q.id)})})]})]}),n.jsx("button",{className:"cheng-input-bar__button",type:"submit",disabled:!ie,"aria-label":"发送消息",children:z?n.jsx("div",{className:"cheng-input-bar__spinner"}):n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M10 3.5V16.5M10 3.5L5 8.5M10 3.5L15 8.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]})]})}),E.length>u*.8&&n.jsxs("div",{className:"cheng-input-bar__counter",children:[E.length," / ",u]}),n.jsx("style",{children:dh})]})}function ch(l){return l.startsWith("image/")?"🖼":l.startsWith("audio/")?"🎵":l.startsWith("video/")?"🎬":l==="application/pdf"?"📄":l.includes("word")||l.includes("wordprocessingml")?"📝":l.includes("excel")||l.includes("spreadsheetml")?"📊":l.includes("powerpoint")||l.includes("presentationml")?"📑":"📎"}const dh=`
  .cheng-input-bar {
    border-top: 1px solid #f0eee6;
    background:
      linear-gradient(180deg, rgba(245, 244, 237, 0.92) 0%, #faf9f5 100%);
    padding: 18px 16px 16px;
  }

  .cheng-input-bar__form {
    display: block;
  }

  .cheng-input-bar__composer {
    border: 1px solid #e8e6dc;
    background:
      linear-gradient(180deg, #faf9f5 0%, #f5f4ed 100%);
    border-radius: 24px;
    padding: 14px 14px 10px;
    box-shadow: 0 0 0 1px #d1cfc5, rgba(0,0,0,0.05) 0px 4px 24px;
  }

  /* ── 附件预览区 ── */
  .cheng-input-bar__attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0eee6;
  }

  .cheng-input-bar__attachment-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    max-width: 220px;
    padding: 5px 8px;
    background: #faf9f5;
    border: 1px solid #e8e6dc;
    border-radius: 10px;
    font-size: 12px;
    color: #4d4c48;
  }

  .cheng-input-bar__attachment-icon {
    flex-shrink: 0;
    font-size: 14px;
    line-height: 1;
  }

  .cheng-input-bar__attachment-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .cheng-input-bar__attachment-size {
    flex-shrink: 0;
    color: #87867f;
    font-size: 11px;
  }

  .cheng-input-bar__attachment-remove {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 50%;
    background: #e8e6dc;
    color: #5e5d59;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.12s, color 0.12s;
  }

  .cheng-input-bar__attachment-remove:hover {
    background: #e7b7ae;
    color: #b53333;
  }

  /* ── textarea ── */
  .cheng-input-bar__textarea {
    width: 100%;
    min-height: 52px;
    max-height: 140px;
    padding: 6px 4px 12px;
    border: none;
    background: transparent;
    color: #141413;
    font-size: 15px;
    font-family: inherit;
    line-height: 1.5;
    resize: none;
    outline: none;
    box-sizing: border-box;
  }

  .cheng-input-bar__textarea:focus {
    border: none;
    box-shadow: none;
  }

  .cheng-input-bar__textarea:disabled {
    background-color: transparent;
    color: #87867f;
    cursor: not-allowed;
  }

  .cheng-input-bar__textarea::placeholder {
    color: #87867f;
  }

  /* ── toolbar ── */
  .cheng-input-bar__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px solid #f0eee6;
    padding-top: 10px;
  }

  .cheng-input-bar__toolbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex-wrap: wrap;
  }

  /* ── 附件按钮 ── */
  .cheng-input-bar__attachment-wrap {
    position: relative;
  }

  .cheng-input-bar__file-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  .cheng-input-bar__icon-button {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 999px;
    background: #f5f4ed;
    color: #5e5d59;
    cursor: pointer;
    transition: background-color 0.16s, color 0.16s;
  }

  .cheng-input-bar__icon-button:hover:not(:disabled) {
    background: #f0eee6;
    color: #c96442;
  }

  .cheng-input-bar__icon-button--disabled,
  .cheng-input-bar__icon-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ── channel selector ── */
  .cheng-input-bar__select-wrap {
    position: relative;
  }

  .cheng-input-bar__select-button {
    min-width: 120px;
    max-width: 180px;
    border: 1px solid #e8e6dc;
    border-radius: 999px;
    background: #faf9f5;
    color: #141413;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 32px 7px 12px;
    outline: none;
    cursor: pointer;
    box-shadow: 0 0 0 1px #d1cfc5;
    position: relative;
    text-align: left;
  }

  .cheng-input-bar__select-button::after {
    content: "";
    position: absolute;
    right: 12px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-right: 1.5px solid #87867f;
    border-bottom: 1.5px solid #87867f;
    transform: translateY(-65%) rotate(45deg);
    pointer-events: none;
  }

  .cheng-input-bar__select-button-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cheng-input-bar__select-menu {
    position: absolute;
    left: 0;
    bottom: calc(100% + 10px);
    min-width: 220px;
    max-width: 280px;
    max-height: 240px;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid #e8e6dc;
    border-radius: 16px;
    background: #faf9f5;
    box-shadow: 0 0 0 1px #d1cfc5, rgba(0,0,0,0.08) 0px 10px 24px;
    z-index: 20;
  }

  .cheng-input-bar__select-option {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 12px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: #141413;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.16s, color 0.16s;
  }

  .cheng-input-bar__select-option:hover {
    background: #f5f4ed;
  }

  .cheng-input-bar__select-option--active {
    background: #f0eee6;
  }

  .cheng-input-bar__select-option-name {
    font-size: 13px;
    font-weight: 600;
    color: #141413;
  }

  .cheng-input-bar__select-option-id {
    font-size: 12px;
    color: #5e5d59;
  }

  /* ── 发送按钮 ── */
  .cheng-input-bar__button {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #f5f4ed 0%, #e8e6dc 100%);
    color: #141413;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: transform 0.16s, background-color 0.2s, opacity 0.2s;
  }

  .cheng-input-bar__button:hover:not(:disabled) {
    background: linear-gradient(180deg, #faf9f5 0%, #f0eee6 100%);
    transform: translateY(-1px);
  }

  .cheng-input-bar__button:disabled {
    background: #f0eee6;
    color: #87867f;
    cursor: not-allowed;
  }

  .cheng-input-bar__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(245, 244, 237, 0.35);
    border-top-color: #faf9f5;
    border-radius: 50%;
    animation: cheng-spin 0.6s linear infinite;
  }

  .cheng-input-bar__counter {
    margin-top: 8px;
    font-size: 12px;
    color: #87867f;
    text-align: right;
  }

  @media (max-width: 720px) {
    .cheng-input-bar__toolbar {
      align-items: flex-end;
    }

    .cheng-input-bar__toolbar-left {
      gap: 8px;
    }

    .cheng-input-bar__select-button {
      min-width: 100px;
      max-width: 140px;
    }
  }

  @keyframes cheng-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;function uh({className:l="",style:s={},title:c="对话",placeholder:u="输入消息...",showStatus:f=!0,height:p="600px",channels:m=[],activeChannelId:y=null,activeChannel:k=null,onSelectChannel:w}){const{resetConversation:R,error:z}=ti();return n.jsxs("div",{className:`cheng-chat-window ${l}`,style:{...s,height:typeof p=="number"?`${p}px`:p},children:[n.jsxs("div",{className:"cheng-chat-window__header",children:[n.jsxs("div",{className:"cheng-chat-window__header-left",children:[n.jsx("h2",{className:"cheng-chat-window__title",children:c}),f&&n.jsx(Kp,{})]}),n.jsx("div",{className:"cheng-chat-window__header-right",children:n.jsx("button",{className:"cheng-chat-window__reset-button",onClick:R,type:"button","aria-label":"新建对话",title:"新建对话",children:n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C8.34315 16 6.84315 15.3284 5.75736 14.2426",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),n.jsx("path",{d:"M7 10L4 10L4 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})})]}),z&&n.jsxs("div",{className:"cheng-chat-window__error",children:[n.jsx("span",{className:"cheng-chat-window__error-icon",children:"⚠️"}),n.jsx("span",{className:"cheng-chat-window__error-text",children:z.message})]}),n.jsx("div",{className:"cheng-chat-window__body",children:n.jsx(nh,{})}),n.jsx("div",{className:"cheng-chat-window__footer",children:n.jsx(lh,{placeholder:u,channels:m,activeChannelId:y,activeChannel:k,onSelectChannel:w})}),n.jsx("style",{children:ph})]})}const ph=`
  .cheng-chat-window {
    display: flex;
    flex-direction: column;
    background-color: #faf9f5;
    border: none;
    border-radius: 0;
    overflow: hidden;
    box-shadow: none;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  .cheng-chat-window__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid #e8e6dc;
    background-color: #faf9f5;
  }

  .cheng-chat-window__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cheng-chat-window__header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cheng-chat-window__title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #141413;
  }

  .cheng-chat-window__reset-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: #87867f;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .cheng-chat-window__reset-button:hover {
    background-color: #e8e6dc;
    color: #4d4c48;
  }

  .cheng-chat-window__error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background-color: #f7ebe8;
    border-bottom: 1px solid #e7b7ae;
  }

  .cheng-chat-window__error-icon {
    font-size: 16px;
  }

  .cheng-chat-window__error-text {
    flex: 1;
    font-size: 14px;
    color: #b53333;
  }

  .cheng-chat-window__body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .cheng-chat-window__footer {
    flex-shrink: 0;
  }
`,hh=/^[a-z0-9-]+$/,Zs=["🤖","🧠","🛠️","📊","💬","🚀","🧭","✨"];function fh(l){if(!l)return"";const{avatarIcon:s,...c}=l;return Object.keys(c).length>0?JSON.stringify(c,null,2):""}function gh({onSubmit:l,apiBaseUrl:s,onSuccess:c,isActive:u=!0,defaultAppType:f="",initialChannel:p=null,existingChannels:m=[],mode:y="create",showCancelButton:k=!1,onCancel:w,submitLabel:R="Create"}){const z=y==="edit",[V,E]=h.useState(""),[G,j]=h.useState(""),[B,W]=h.useState(""),[U,J]=h.useState(""),[K,$]=h.useState(""),[X,ie]=h.useState(f),[se,ae]=h.useState(Zs[0]),[ee,le]=h.useState(""),[ue,te]=h.useState(!1),[_e,Q]=h.useState(!1),[ne,A]=h.useState(!1),[M,P]=h.useState([]),[F,g]=h.useState([]),[S,v]=h.useState(null),[D,T]=h.useState(null),[O,N]=h.useState(null),re=h.useCallback(()=>{const ce=p?.connectionConfig?.avatarIcon;E(p?.name??""),j(p?.channelId??""),W(p?.workspaceId??""),J(p?.boundWorkflowId??""),$(p?.description??""),ie(p?.appType??f),ae(typeof ce=="string"&&ce.trim()?ce:Zs[0]),le(fh(p?.connectionConfig)),P([]),g([]),v(null),T(null),Q(!1),A(!1),N(null),te(!1)},[f,p]);h.useEffect(()=>{re()},[re]);const xe=h.useCallback(async()=>{if(!s){P([]),v("Missing apiBaseUrl, cannot load workspaces");return}Q(!0),v(null);try{const ce=new Ke(s),Se=await new tt(s,ce).listWorkspaces();P(Se),W(Ee=>!Ee&&Se.length>0?Se[0].id:Ee)}catch(ce){P([]),v(ce instanceof Error?ce.message:"Failed to load workspaces")}finally{Q(!1)}},[s]);h.useEffect(()=>{u&&xe()},[u,xe]);const H=h.useCallback(async()=>{if(!s){g([]),T("Missing apiBaseUrl, cannot load workflows");return}A(!0),T(null);try{const ce=new Ke(s),Se=await new tt(s,ce).listPublishedWorkflows();g(Se),J(Ee=>!Ee&&Se.length>0?Se[0].id:Ee)}catch(ce){g([]),T(ce instanceof Error?ce.message:"Failed to load published workflows")}finally{A(!1)}},[s]);h.useEffect(()=>{u&&H()},[u,H]);const fe=h.useCallback(ce=>{const ye=ce.target.value;E(ye),j(Se=>{const Ee=V.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return Se===Ee||Se===""?ye.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):Se})},[V]),Ne=h.useCallback(async ce=>{if(ce.preventDefault(),N(null),!V.trim()){N("Name is required");return}if(!G.trim()){N("Channel ID is required");return}if(!B.trim()){N("Workspace ID is required");return}if(!U.trim()){N("Bound Workflow ID is required");return}if(!hh.test(G)){N("Channel ID must only contain lowercase letters, numbers, and hyphens");return}const ye=G.trim().toLowerCase();if(m.find(Ee=>z&&p&&Ee.id===p.id?!1:Ee.workspaceId===B.trim()&&Ee.channelId.trim().toLowerCase()===ye)){N(`Agent ID "${G.trim()}" already exists in this workspace`);return}te(!0);try{const ot={...ee.trim()?JSON.parse(ee):{},avatarIcon:se},Et={name:V.trim(),channelId:G.trim(),workspaceId:B.trim(),boundWorkflowId:U.trim(),description:K.trim()||void 0,appType:X.trim()||void 0,connectionConfig:ot};z&&p?await l({id:p.id,...Et}):await l(Et),re(),c?.()}catch(Ee){N(Ee instanceof SyntaxError?"Connection config must be valid JSON":Ee instanceof Error?Ee.message:z?"Failed to update agent":"Failed to create agent"),te(!1)}},[V,G,B,U,K,X,se,ee,p,m,z,l,re,c]);return n.jsxs("form",{className:"cheng-channel-form",onSubmit:Ne,children:[O&&n.jsx("div",{className:"cheng-channel-form__error",children:O}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-name",children:"Name *"}),n.jsx("input",{id:"cf-name",className:"cheng-channel-form__input",type:"text",value:V,onChange:fe,placeholder:"My Agent",autoFocus:!0,disabled:ue})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-channel-id",children:["Agent ID *",n.jsxs("span",{className:"cheng-channel-form__label-hint",children:[" ","(lowercase letters, numbers, hyphens)"]})]}),n.jsx("input",{id:"cf-channel-id",className:"cheng-channel-form__input",type:"text",value:G,onChange:ce=>j(ce.target.value),placeholder:"my-agent",disabled:ue||z})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workspace-id",children:"Workspace *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{xe()},disabled:ue||_e||z,children:_e?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workspace-id",className:"cheng-channel-form__input",value:B,onChange:ce=>W(ce.target.value),disabled:ue||_e||z,children:[n.jsx("option",{value:"",children:_e?"Loading workspaces...":"Select workspace"}),M.map(ce=>n.jsx("option",{value:ce.id,children:ce.name||ce.id},ce.id))]}),S&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:S})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workflow-id",children:"Published Workflow *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{H()},disabled:ue||ne,children:ne?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workflow-id",className:"cheng-channel-form__input",value:U,onChange:ce=>J(ce.target.value),disabled:ue||ne,children:[n.jsx("option",{value:"",children:ne?"Loading published workflows...":"Select published workflow"}),F.map(ce=>n.jsx("option",{value:ce.id,children:ce.name||ce.id},ce.id)),U&&!F.some(ce=>ce.id===U)&&n.jsx("option",{value:U,children:U})]}),D&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:D})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-app-type",children:"App Type"}),n.jsx("input",{id:"cf-app-type",className:"cheng-channel-form__input",type:"text",value:X,onChange:ce=>ie(ce.target.value),placeholder:"whatsapp / telegram / slack",disabled:ue})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",children:"Agent Avatar"}),n.jsx("div",{className:"cheng-channel-form__avatar-grid",role:"radiogroup","aria-label":"Agent avatar",children:Zs.map(ce=>{const ye=se===ce;return n.jsx("button",{type:"button",className:`cheng-channel-form__avatar-option${ye?" cheng-channel-form__avatar-option--selected":""}`,onClick:()=>ae(ce),"aria-pressed":ye,disabled:ue,children:n.jsx("span",{className:"cheng-channel-form__avatar-emoji","aria-hidden":"true",children:ce})},ce)})}),n.jsx("div",{className:"cheng-channel-form__field-hint",children:"The selected avatar will be saved with this agent and shown on the agent cards."})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-desc",children:"Description"}),n.jsx("input",{id:"cf-desc",className:"cheng-channel-form__input",type:"text",value:K,onChange:ce=>$(ce.target.value),placeholder:"Optional description",disabled:ue})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-conn-cfg",children:"Connection Config"}),n.jsx("textarea",{id:"cf-conn-cfg",className:"cheng-channel-form__input cheng-channel-form__textarea",value:ee,onChange:ce=>le(ce.target.value),placeholder:'{"botToken":"..."}',rows:4,disabled:ue})]}),n.jsxs("div",{className:"cheng-channel-form__footer",children:[k&&w&&n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--secondary",type:"button",onClick:w,disabled:ue,children:"Cancel"}),n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--primary",type:"submit",disabled:ue,children:ue?z?"Saving...":"Creating...":R})]}),n.jsx("style",{children:mh})]})}const mh=`
  .cheng-channel-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  .cheng-channel-form__error {
    background: #f7ebe8;
    border: 1px solid #e7b7ae;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #b53333;
  }

  .cheng-channel-form__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cheng-channel-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #4d4c48;
  }

  .cheng-channel-form__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .cheng-channel-form__label-hint {
    font-weight: 400;
    color: #87867f;
  }

  .cheng-channel-form__input {
    padding: 9px 12px;
    border: 1px solid #e8e6dc;
    border-radius: 8px;
    font-size: 14px;
    color: #141413;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    background: #faf9f5;
    width: 100%;
    box-sizing: border-box;
  }

  .cheng-channel-form__input:focus {
    border-color: #3898ec;
    box-shadow: 0 0 0 3px rgba(56,152,236,0.2);
  }

  .cheng-channel-form__input:disabled {
    background: #f5f4ed;
    color: #87867f;
    cursor: not-allowed;
  }

  .cheng-channel-form__textarea {
    resize: vertical;
    min-height: 88px;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, monospace;
  }

  .cheng-channel-form__refresh {
    border: 1px solid #e8e6dc;
    background: #f5f4ed;
    color: #4d4c48;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    flex-shrink: 0;
  }

  .cheng-channel-form__refresh:hover:not(:disabled) {
    background: #e8e6dc;
    border-color: #87867f;
  }

  .cheng-channel-form__refresh:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cheng-channel-form__field-hint {
    font-size: 12px;
    line-height: 1.4;
    color: #5e5d59;
  }

  .cheng-channel-form__field-hint--error {
    color: #b53333;
  }

  .cheng-channel-form__avatar-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .cheng-channel-form__avatar-option {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 52px;
    border-radius: 12px;
    border: 1px solid #e8e6dc;
    background: #faf9f5;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s;
  }

  .cheng-channel-form__avatar-option:hover:not(:disabled) {
    border-color: #d1cfc5;
    background: #f5f4ed;
    transform: translateY(-1px);
  }

  .cheng-channel-form__avatar-option:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cheng-channel-form__avatar-option--selected {
    border-color: #c96442;
    background: #f7ebe8;
    box-shadow: 0 0 0 3px rgba(201,100,66,0.14);
  }

  .cheng-channel-form__avatar-emoji {
    font-size: 24px;
    line-height: 1;
  }

  .cheng-channel-form__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 4px;
  }

  .cheng-channel-form__btn {
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: background 0.15s, opacity 0.15s;
  }

  .cheng-channel-form__btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cheng-channel-form__btn--secondary {
    background: #e8e6dc;
    color: #4d4c48;
  }

  .cheng-channel-form__btn--secondary:hover:not(:disabled) {
    background: #f0eee6;
  }

  .cheng-channel-form__btn--primary {
    background: #c96442;
    color: #faf9f5;
  }

  .cheng-channel-form__btn--primary:hover:not(:disabled) {
    background: #d97757;
  }
`;function xh({isOpen:l,onClose:s,mode:c="create",initialChannel:u=null,existingChannels:f=[],onCreate:p,onUpdate:m,apiBaseUrl:y}){const[k,w]=h.useState(0),R=c==="edit";return h.useEffect(()=>{l&&w(z=>z+1)},[l]),l?n.jsx("div",{className:"cheng-modal-overlay",onClick:s,children:n.jsxs("div",{className:"cheng-modal",onClick:z=>z.stopPropagation(),children:[n.jsxs("div",{className:"cheng-modal__header",children:[n.jsxs("div",{className:"cheng-modal__header-copy",children:[n.jsx("h3",{className:"cheng-modal__title",children:R?"Edit Agent":"Create Agent"}),n.jsx("p",{className:"cheng-modal__subtitle",children:R?"Update this agent's profile, workflow binding, avatar, and runtime settings.":"Set up a new agent, connect it to a workspace, and bind the workflow it should run."})]}),n.jsx("button",{className:"cheng-modal__close",onClick:s,type:"button","aria-label":"Close",children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M4 4l10 10M14 4L4 14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsx("div",{className:"cheng-modal__body",children:n.jsx(gh,{onSubmit:async z=>{if(R){if(!m)throw new Error("Update handler is not configured");await m(z);return}await p(z)},apiBaseUrl:y,onSuccess:s,isActive:l,initialChannel:u,existingChannels:f,mode:c,showCancelButton:!0,onCancel:s,submitLabel:R?"Save Changes":"Create Agent"},k)}),n.jsx("style",{children:_h})]})}):null}const _h=`
  .cheng-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .cheng-modal {
    background: #faf9f5;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    width: 420px;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 64px);
    overflow-y: auto;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  .cheng-modal__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f0eee6;
    position: sticky;
    top: 0;
    background: #faf9f5;
    z-index: 1;
  }

  .cheng-modal__header-copy {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-right: 16px;
  }

  .cheng-modal__title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    color: #141413;
  }

  .cheng-modal__subtitle {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: #5e5d59;
  }

  .cheng-modal__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #5e5d59;
    transition: background 0.15s, color 0.15s;
  }

  .cheng-modal__close:hover {
    background: #e8e6dc;
    color: #141413;
  }

  .cheng-modal__body {
    padding: 20px 24px 24px;
  }
`;function wh(l){const s=new Date(l);return Number.isNaN(s.getTime())?"创建时间未知":`创建于 ${s.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}`}function bh({sessions:l,activeSessionId:s,onSelect:c,onCreateClick:u,onDeleteSession:f,onRenameSession:p,onTogglePinSession:m}){const[y,k]=h.useState(null),[w,R]=h.useState(null),[z,V]=h.useState(""),E=h.useRef(null),G=h.useRef(null);h.useEffect(()=>{const W=U=>{E.current&&(E.current.contains(U.target)||(k(null),R(null)))};return document.addEventListener("mousedown",W),()=>document.removeEventListener("mousedown",W)},[]),h.useEffect(()=>{w&&(G.current?.focus(),G.current?.select())},[w]);const j=W=>{if(!p)return;const U=z.trim();!U||U===W.label||(p(W.id,U),k(null),R(null),V(""))},B=l.length>1&&!!f;return n.jsxs("div",{className:"cheng-session-list",ref:E,children:[n.jsxs("div",{className:"cheng-session-list__header",children:[n.jsx("span",{className:"cheng-session-list__title",children:"Conversations"}),n.jsx("button",{className:"cheng-session-list__add-btn",onClick:u,type:"button","aria-label":"Create conversation",title:"Create conversation",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsxs("ul",{className:"cheng-session-list__items",children:[l.map(W=>n.jsxs("li",{className:`cheng-session-list__item${W.id===s?" cheng-session-list__item--active":""}`,children:[n.jsxs("button",{className:"cheng-session-list__item-main",onClick:()=>c(W),type:"button",title:W.label,children:[n.jsx("span",{className:"cheng-session-list__item-icon",title:wh(W.createdAt),children:n.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M7 1C3.68629 1 1 3.68629 1 7C1 8.20693 1.35785 9.33012 1.97285 10.2718L1 13L3.72822 12.0272C4.66988 12.6421 5.79307 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})})}),n.jsx("span",{className:"cheng-session-list__item-meta",children:n.jsx("span",{className:"cheng-session-list__item-label",children:W.label})})]}),n.jsxs("div",{className:"cheng-session-list__item-actions",children:[n.jsx("button",{className:"cheng-session-list__item-menu-trigger",type:"button","aria-label":`更多操作 ${W.label}`,title:"更多操作",onClick:U=>{U.stopPropagation(),k(J=>J===W.id?null:W.id)},children:n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"7",cy:"2.5",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"7",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"11.5",r:"1.2",fill:"currentColor"})]})}),y===W.id&&n.jsx("div",{className:"cheng-session-list__menu",role:"menu",children:w===W.id?n.jsxs("div",{className:"cheng-session-list__rename-wrap",children:[n.jsx("input",{ref:G,className:"cheng-session-list__rename-input",value:z,onChange:U=>V(U.target.value),onKeyDown:U=>{U.key==="Enter"&&(U.preventDefault(),j(W)),U.key==="Escape"&&(U.preventDefault(),R(null))},maxLength:80}),n.jsxs("div",{className:"cheng-session-list__rename-actions",children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:U=>{U.stopPropagation(),j(W)},children:"保存"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:U=>{U.stopPropagation(),R(null)},children:"取消"})]})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:U=>{U.stopPropagation(),m?.(W.id),k(null)},role:"menuitem",children:W.pinned?"取消置顶":"置顶"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:U=>{U.stopPropagation(),R(W.id),V(W.label)},role:"menuitem",children:"重命名"}),n.jsx("button",{className:"cheng-session-list__menu-item cheng-session-list__menu-item--danger",type:"button",disabled:!B,onClick:U=>{U.stopPropagation(),f&&(f(W.id),k(null))},role:"menuitem",children:"删除"})]})})]})]},W.id)),l.length===0&&n.jsx("li",{className:"cheng-session-list__empty",children:"No conversations yet"})]}),n.jsx("style",{children:yh})]})}const yh=`
  .cheng-session-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #faf9f5;
    color: #4d4c48;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
    overflow: hidden;
  }

  .cheng-session-list__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 10px;
    border-bottom: 1px solid #e8e6dc;
  }

  .cheng-session-list__title {
    font-size: 14px;
    font-weight: 600;
    color: #141413;
  }

  .cheng-session-list__add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background: transparent;
    color: #5e5d59;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
  }

  .cheng-session-list__add-btn:hover {
    background: #e8e6dc;
    color: #141413;
  }

  .cheng-session-list__items {
    list-style: none;
    margin: 0;
    padding: 6px 8px;
    flex: 1;
    overflow-y: auto;
  }

  .cheng-session-list__item {
    display: flex;
    align-items: center;
    padding: 0 4px;
    border-radius: 6px;
    margin: 1px 0;
    transition: background 0.15s;
    position: relative;
  }

  .cheng-session-list__item:hover {
    background: #e8e6dc;
  }

  .cheng-session-list__item--active {
    background: #f0eee6;
  }

  .cheng-session-list__item-main {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    padding: 8px 28px 8px 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    color: #4d4c48;
    min-width: 0;
  }

  .cheng-session-list__item-main:hover {
    background: transparent !important;
    color: #4d4c48 !important;
    border-color: transparent !important;
  }

  .cheng-session-list__item-icon {
    flex-shrink: 0;
    color: #87867f;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f0eee6;
  }

  .cheng-session-list__item--active .cheng-session-list__item-icon,
  .cheng-session-list__item--active .cheng-session-list__item-label {
    color: #c96442;
  }

  .cheng-session-list__item-label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 500;
  }

  .cheng-session-list__item-meta {
    display: block;
    min-width: 0;
    flex: 1;
  }

  .cheng-session-list__item-actions {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    z-index: 2;
  }

  .cheng-session-list__item-menu-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: #87867f;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.12s, visibility 0.12s, background 0.12s, color 0.12s;
  }

  .cheng-session-list__item:hover .cheng-session-list__item-menu-trigger,
  .cheng-session-list__item-menu-trigger:focus-visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .cheng-session-list__item-menu-trigger:hover {
    background: #e8e6dc;
    color: #141413;
    border-color: transparent !important;
  }

  .cheng-session-list__menu {
    position: absolute;
    top: 26px;
    right: 0;
    min-width: 112px;
    background: #faf9f5;
    border: 1px solid #d1cfc5;
    border-radius: 10px;
    box-shadow: 0 10px 28px rgba(20, 20, 19, 0.16);
    padding: 4px;
    z-index: 20;
  }

  .cheng-session-list__menu-item {
    width: 100%;
    display: block;
    text-align: left;
    background: transparent;
    border: none;
    border-radius: 7px;
    padding: 7px 8px;
    color: #30302e;
    font-size: 12px;
    cursor: pointer;
  }

  .cheng-session-list__menu-item:hover:not(:disabled) {
    background: #f0eee6;
    color: #141413;
    border-color: transparent !important;
  }

  .cheng-session-list__menu-item:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .cheng-session-list__menu-item--danger {
    color: #b53333;
  }

  .cheng-session-list__menu-item--danger:hover:not(:disabled) {
    background: #fff0ee;
    color: #b53333;
  }

  .cheng-session-list__rename-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 4px;
  }

  .cheng-session-list__rename-input {
    width: 100%;
    height: 30px;
    border: 1px solid #d1cfc5;
    border-radius: 7px;
    padding: 0 8px;
    font-size: 12px;
    color: #141413;
    background: #fffdf8;
    outline: none;
  }

  .cheng-session-list__rename-input:focus {
    border-color: #c96442;
    box-shadow: 0 0 0 2px rgba(201, 100, 66, 0.14);
  }

  .cheng-session-list__rename-actions {
    display: flex;
    gap: 6px;
  }

  .cheng-session-list__rename-actions .cheng-session-list__menu-item {
    text-align: center;
    padding: 6px 8px;
    flex: 1;
  }

  .cheng-session-list__empty {
    padding: 18px 10px;
    color: #87867f;
    font-size: 12px;
    text-align: center;
  }

  .cheng-shell .cheng-session-list__add-btn,
  .cheng-shell .cheng-session-list__item-main,
  .cheng-shell .cheng-session-list__item-menu-trigger,
  .cheng-shell .cheng-session-list__menu-item {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    appearance: none !important;
  }

  .cheng-shell .cheng-session-list__item-main,
  .cheng-shell .cheng-session-list__item-menu-trigger,
  .cheng-shell .cheng-session-list__add-btn {
    background: transparent !important;
    border-color: transparent !important;
  }

  .cheng-shell .cheng-session-list__add-btn:hover,
  .cheng-shell .cheng-session-list__item-main:hover,
  .cheng-shell .cheng-session-list__item-menu-trigger:hover {
    background: transparent !important;
    color: inherit !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }
`;function vh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"telegram-bot"}function kh(l){const s=l.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function jh({agents:l,onCreate:s,apiBaseUrl:c,onPaired:u,onRefresh:f,onGoToAgents:p,onCancel:m}){const[y,k]=h.useState("ready"),[w,R]=h.useState(""),[z,V]=h.useState(()=>l[0]?.id??""),[E,G]=h.useState(""),[j,B]=h.useState(null),[W,U]=h.useState(null),[J,K]=h.useState(null),[$,X]=h.useState(null),[ie,se]=h.useState(!1),ae=h.useRef(null),ee=h.useCallback(()=>(ae.current||(ae.current=new tt(c,new Ke(c))),ae.current),[c]),le=l.find(Q=>Q.id===z)??null,ue=h.useCallback(async Q=>{if(Q.preventDefault(),!(!w.trim()||!E.trim()||!le)){B(null),k("connecting");try{const ne=vh(w),A=await s({name:w.trim(),channelId:ne,workspaceId:le.workspaceId,boundWorkflowId:le.boundWorkflowId,appType:"telegram",description:`Telegram bot for agent: ${le.name}`});A.channelId!==ne&&se(!0);const M=await ee().connectChannel(A.workspaceId,A.id,{bot_token:E.trim(),connection_mode:"polling"}),P=M.setupData,F=P?.username??P?.bot_username??P?.first_name;F&&X(`@${F}`),K(P?.connection_mode??"polling");const g={...A,connectionState:M.connectionState,webhookUrl:M.webhookUrl,setupData:M.setupData};U(g),k("connected"),f?.(),u(g)}catch(ne){B(ne instanceof Error?ne.message:"Connection failed. Please check your bot token and try again."),k("error")}}},[w,E,le,s,ee,u]);if(l.length===0)return n.jsxs("div",{className:"cheng-tg-form__no-agents",children:[n.jsx("div",{className:"cheng-tg-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-tg-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-tg-form__no-agents-desc",children:"Create an agent first, then come back to connect a Telegram bot to it. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:ea})]});if(y==="connected"&&W)return n.jsxs("div",{className:"cheng-tg-form__success",children:[n.jsx("div",{className:"cheng-tg-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-form__success-title",children:ie?"Telegram Reconnected!":"Telegram Connected!"}),n.jsxs("p",{className:"cheng-tg-form__success-desc",children:[ie&&n.jsxs("span",{className:"cheng-tg-form__existing-note",children:["An existing integration was found and reconnected."," "]}),n.jsx("strong",{children:W.name})," is now active",$&&n.jsxs(n.Fragment,{children:[" as ",n.jsx("strong",{children:$})]}),le&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:le.name})]}),"."]}),J==="polling"?n.jsxs("div",{className:"cheng-tg-form__polling-notice",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),"The bot is listening for messages via polling — no public URL required."]}):null,n.jsx("p",{className:"cheng-tg-form__success-hint",children:"Your integration is listed in Connected Integrations above. Use Manage to view connection details."}),n.jsx("style",{children:ea})]});const te=y==="connecting",_e=w.trim().length>0&&E.trim().length>0&&!!le&&!te;return n.jsxs("form",{className:"cheng-tg-form",onSubmit:ue,children:[n.jsxs("div",{className:"cheng-tg-form__instructions",children:[n.jsx("p",{className:"cheng-tg-form__instructions-title",children:"How to get your bot token"}),n.jsxs("ol",{className:"cheng-tg-form__steps",children:[n.jsxs("li",{children:["Open Telegram and search for ",n.jsx("strong",{children:"@BotFather"})]}),n.jsxs("li",{children:["Send ",n.jsx("code",{children:"/newbot"})," and follow the prompts to create your bot"]}),n.jsx("li",{children:"Copy the API token BotFather provides and paste it below"})]})]}),j&&n.jsxs("div",{className:"cheng-tg-form__error-banner",children:[n.jsx("span",{children:j}),n.jsx("button",{type:"button",className:"cheng-tg-form__retry-btn",onClick:()=>{k("ready"),B(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-name",children:["Integration Name ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("input",{id:"tg-name",className:"cheng-tg-form__input",type:"text",value:w,onChange:Q=>R(Q.target.value),placeholder:"Support Bot",disabled:te,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-tg-form__hint",children:"A display name for this Telegram integration"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-agent",children:["Agent ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-tg-form__agent-select-wrap",children:n.jsx("select",{id:"tg-agent",className:"cheng-tg-form__input cheng-tg-form__input--select",value:z,onChange:Q=>V(Q.target.value),disabled:te,required:!0,children:l.map(Q=>n.jsxs("option",{value:Q.id,children:[kh(Q)," ",Q.name]},Q.id))})}),le&&n.jsxs("span",{className:"cheng-tg-form__hint",children:["Messages from this bot will be handled by ",n.jsx("strong",{children:le.name}),le.description?` — ${le.description}`:""]})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-token",children:["Bot Token ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"}),n.jsx("span",{className:"cheng-tg-form__label-hint",children:" (from @BotFather)"})]}),n.jsx("input",{id:"tg-token",className:"cheng-tg-form__input cheng-tg-form__input--token",type:"password",value:E,onChange:Q=>G(Q.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:te,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-form__hint",children:"Keep this token secret — it grants full control over your bot"})]}),n.jsxs("div",{className:"cheng-tg-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--ghost",onClick:m,disabled:te,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-form__btn cheng-tg-form__btn--connect",disabled:!_e,children:te?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-form__btn-spinner"}),"Connecting..."]}):"Connect Telegram"})]}),n.jsx("style",{children:ea})]})}const ea=`
  .cheng-tg-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* No-agents empty state */
  .cheng-tg-form__no-agents {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }

  .cheng-tg-form__no-agents-icon {
    font-size: 32px;
    line-height: 1;
  }

  .cheng-tg-form__no-agents-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-tg-form__no-agents-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.55;
    max-width: 420px;
  }

  /* Success state */
  .cheng-tg-form__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }

  .cheng-tg-form__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #25d36618;
    color: #1a9e4a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cheng-tg-form__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-tg-form__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-tg-form__existing-note {
    color: #b8860b;
  }

  .cheng-tg-form__success-hint {
    margin: 0;
    font-size: 12px;
    color: #87867f;
    line-height: 1.4;
  }

  .cheng-tg-form__polling-notice {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    background: #2ca5e010;
    border: 1px solid #2ca5e030;
    border-radius: 8px;
    font-size: 12px;
    color: #1a82b8;
    line-height: 1.5;
  }

  .cheng-tg-form__polling-notice svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* Instructions box */
  .cheng-tg-form__instructions {
    background: #2ca5e00d;
    border: 1px solid #2ca5e025;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .cheng-tg-form__instructions-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    color: #2ca5e0;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .cheng-tg-form__steps {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cheng-tg-form__steps li {
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-tg-form__steps code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    background: #e8e6dc;
    padding: 1px 5px;
    border-radius: 4px;
    color: #141413;
  }

  /* Error banner */
  .cheng-tg-form__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }

  .cheng-tg-form__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .cheng-tg-form__retry-btn:hover {
    background: #b5333312 !important;
    border-color: #b53333 !important;
    color: #b53333 !important;
  }

  /* Fields */
  .cheng-tg-form__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cheng-tg-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-tg-form__required {
    color: #b53333;
    margin-left: 1px;
  }

  .cheng-tg-form__label-hint {
    font-weight: 400;
    color: #87867f;
  }

  .cheng-tg-form__input {
    padding: 9px 12px;
    border: 1px solid #d1cfc5;
    border-radius: 8px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .cheng-tg-form__input:focus {
    border-color: #2ca5e0;
    box-shadow: 0 0 0 3px rgba(44, 165, 224, 0.12);
  }

  .cheng-tg-form__input:disabled {
    background: #f5f4ed;
    color: #87867f;
    cursor: not-allowed;
  }

  .cheng-tg-form__input--select {
    appearance: auto;
    cursor: pointer;
  }

  .cheng-tg-form__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  .cheng-tg-form__agent-select-wrap {
    position: relative;
  }

  .cheng-tg-form__hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }

  .cheng-tg-form__hint strong {
    color: #5e5d59;
  }

  /* Info label */
  .cheng-tg-form__info-label {
    font-size: 11px;
    font-weight: 600;
    color: #87867f;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Footer & buttons */
  .cheng-tg-form__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }

  .cheng-tg-form__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }

  .cheng-tg-form__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Telegram blue — doubled selector beats .cheng-shell button { !important } */
  .cheng-tg-form .cheng-tg-form__btn--connect {
    background: #2ca5e0 !important;
    color: #ffffff !important;
    border: none !important;
  }

  .cheng-tg-form .cheng-tg-form__btn--connect:hover:not(:disabled) {
    background: #1a94cf !important;
    border-color: #1a94cf !important;
  }

  .cheng-tg-form .cheng-tg-form__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }

  .cheng-tg-form .cheng-tg-form__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
    border-color: #d1cfc5 !important;
  }

  .cheng-tg-form .cheng-tg-form__btn--secondary {
    background: #f0eee6 !important;
    color: #141413 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }

  .cheng-tg-form .cheng-tg-form__btn--secondary:hover:not(:disabled) {
    background: #e8e6dc !important;
    color: #141413 !important;
  }

  .cheng-tg-form__btn-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-tg-spin 0.65s linear infinite;
    flex-shrink: 0;
  }

  @keyframes cheng-tg-spin {
    to { transform: rotate(360deg); }
  }
`;function Sh({channel:l,agents:s,apiBaseUrl:c,onUpdate:u,onRefresh:f,onSaved:p,onCancel:m}){const y=s.find(te=>te.boundWorkflowId===l.boundWorkflowId&&te.workspaceId===l.workspaceId)?.id??s[0]?.id??"",[k,w]=h.useState(y),[R,z]=h.useState(""),[V,E]=h.useState("ready"),[G,j]=h.useState(!1),[B,W]=h.useState(null),[U,J]=h.useState(null),K=h.useRef(null),$=h.useCallback(()=>(K.current||(K.current=new tt(c,new Ke(c))),K.current),[c]),X=s.find(te=>te.id===k)??null,ie=X&&(X.workspaceId!==l.workspaceId||X.boundWorkflowId!==l.boundWorkflowId),se=s.find(te=>te.boundWorkflowId===l.boundWorkflowId&&te.workspaceId===l.workspaceId)??null,ae=h.useCallback(async te=>{if(!(!R.trim()||!X)){J(null),W(null),te?E("saving"):j(!0);try{ie&&await u({id:l.id,channelId:l.channelId,name:l.name,workspaceId:X.workspaceId,boundWorkflowId:X.boundWorkflowId,appType:l.appType,description:l.description});const _e=ie?X.workspaceId:l.workspaceId;await $().connectChannel(_e,l.id,{bot_token:R.trim(),connection_mode:"polling"}),f?.(),te?(E("saved"),setTimeout(()=>p(),1200)):(E("ready"),W("Bot connected — backend is polling for Telegram messages."))}catch(_e){J(_e instanceof Error?_e.message:"Update failed. Please try again."),E("error"),W(null)}finally{te||j(!1)}}},[R,X,ie,l,u,$,f,p]),ee=h.useCallback(async te=>{te.preventDefault(),await ae(!0)},[ae]),le=V==="saving",ue=!!X&&R.trim().length>0&&!le&&!G;return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):V==="saved"?n.jsxs("div",{className:"cheng-tg-edit__success",children:[n.jsx("div",{className:"cheng-tg-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-tg-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been reconfigured and reconnected."]}),n.jsx("style",{children:cd})]}):n.jsxs("form",{className:"cheng-tg-edit",onSubmit:ee,children:[U&&n.jsxs("div",{className:"cheng-tg-edit__error-banner",children:[n.jsx("span",{children:U}),n.jsx("button",{type:"button",className:"cheng-tg-edit__retry-btn",onClick:()=>{E("ready"),J(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-edit__grid",children:[n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Choose which agent should handle messages from this Telegram bot."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("select",{className:"cheng-tg-edit__input cheng-tg-edit__input--select",value:k,onChange:te=>w(te.target.value),disabled:le,required:!0,children:s.map(te=>n.jsx("option",{value:te.id,children:te.name},te.id))}),X&&n.jsxs("span",{className:"cheng-tg-edit__hint",children:["Selected: ",n.jsx("strong",{children:X.name}),X.description?` — ${X.description}`:""]}),ie&&X&&n.jsxs("div",{className:"cheng-tg-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:se?.name??"the current agent"})," to"," ",n.jsx("strong",{children:X.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Bot Token"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Paste a fresh token to reconnect this bot or rotate credentials."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("input",{className:"cheng-tg-edit__input cheng-tg-edit__input--token",type:"password",value:R,onChange:te=>z(te.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:le,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-edit__hint",children:"Your existing token will be replaced. Get a new one from @BotFather if needed."}),B&&n.jsx("div",{className:"cheng-tg-edit__test-ok",children:B}),n.jsx("div",{className:"cheng-tg-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--secondary",disabled:!X||R.trim().length===0||le||G,onClick:()=>{ae(!1)},children:G?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner cheng-tg-edit__spinner--dark"}),"测试中..."]}):"测试连接"})})]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--ghost",onClick:m,disabled:le,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-edit__btn cheng-tg-edit__btn--connect",disabled:!ue,children:le?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner"}),"Saving..."]}):"Save & Reconnect"})]}),n.jsx("style",{children:cd})]})}const cd=`
  .cheng-tg-edit {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* Success state */
  .cheng-tg-edit__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-tg-edit__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #2ca5e018;
    color: #1a82b8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-tg-edit__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-tg-edit__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-tg-edit__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-tg-edit__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
  }

  /* Grid */
  .cheng-tg-edit__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  /* Card */
  .cheng-tg-edit__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px;
    background: #fffdf8;
    border: 1px solid #ece7db;
    border-radius: 16px;
  }
  .cheng-tg-edit__card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-tg-edit__card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #141413;
  }
  .cheng-tg-edit__card-tip {
    font-size: 12px;
    line-height: 1.45;
    color: #6d6a63;
  }

  /* Field */
  .cheng-tg-edit__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cheng-tg-edit__hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }
  .cheng-tg-edit__hint strong { color: #5e5d59; }
  .cheng-tg-edit__notice {
    padding: 8px 12px;
    background: rgba(230, 168, 23, 0.1);
    border: 1px solid rgba(230, 168, 23, 0.25);
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
    color: #9a6b00;
  }

  /* Input */
  .cheng-tg-edit__input {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #d9d3c7;
    border-radius: 10px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-tg-edit__input:focus {
    border-color: #2ca5e0;
    box-shadow: 0 0 0 3px rgba(44, 165, 224, 0.14);
    background: #ffffff;
  }
  .cheng-tg-edit__input:disabled { background: #f3f1ea; color: #87867f; cursor: not-allowed; }
  .cheng-tg-edit__input--select { appearance: auto; cursor: pointer; }
  .cheng-tg-edit__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  /* Test result */
  .cheng-tg-edit__test-ok {
    padding: 8px 12px;
    background: rgba(44, 165, 224, 0.09);
    border: 1px solid rgba(44, 165, 224, 0.22);
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.4;
    color: #1a82b8;
  }
  .cheng-tg-edit__card-actions {
    display: flex;
    gap: 8px;
  }

  /* Footer */
  .cheng-tg-edit__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 4px;
  }

  /* Buttons */
  .cheng-tg-edit__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-tg-edit__btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .cheng-tg-edit .cheng-tg-edit__btn--connect {
    background: #2ca5e0 !important;
    color: #ffffff !important;
    border: 1px solid #2ca5e0 !important;
  }
  .cheng-tg-edit .cheng-tg-edit__btn--connect:hover:not(:disabled) {
    background: #1a94cf !important;
    border-color: #1a94cf !important;
  }
  .cheng-tg-edit .cheng-tg-edit__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
  }
  .cheng-tg-edit .cheng-tg-edit__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-tg-edit .cheng-tg-edit__btn--secondary {
    background: #fffdf8 !important;
    color: #2ca5e0 !important;
    border: 1px solid rgba(44, 165, 224, 0.28) !important;
    font-size: 12px;
    padding: 8px 14px;
    font-weight: 500;
  }
  .cheng-tg-edit .cheng-tg-edit__btn--secondary:hover:not(:disabled) {
    background: rgba(44, 165, 224, 0.08) !important;
    border-color: #2ca5e0 !important;
  }

  /* Spinner */
  .cheng-tg-edit__spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cheng-tg-edit-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  .cheng-tg-edit__spinner--dark {
    border-color: rgba(44, 165, 224, 0.2);
    border-top-color: #2ca5e0;
  }
  @keyframes cheng-tg-edit-spin { to { transform: rotate(360deg); } }

  @media (max-width: 760px) {
    .cheng-tg-edit__grid { grid-template-columns: 1fr; }
    .cheng-tg-edit__footer { flex-direction: column-reverse; align-items: stretch; }
    .cheng-tg-edit__btn { width: 100%; justify-content: center; }
  }
`;function Ch(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"whatsapp-bot"}function Nh(l){const s=l.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Ih({agents:l,onCreate:s,apiBaseUrl:c,onPaired:u,onRefresh:f,onGoToAgents:p,onCancel:m}){const[y,k]=h.useState("ready"),[w,R]=h.useState(""),[z,V]=h.useState(()=>l[0]?.id??""),[E,G]=h.useState(""),[j,B]=h.useState(""),[W,U]=h.useState(""),[J,K]=h.useState(""),[$,X]=h.useState("v21.0"),[ie,se]=h.useState(null),[ae,ee]=h.useState(null),[le,ue]=h.useState(null),[te,_e]=h.useState(null),Q=h.useRef(null),ne=h.useCallback(()=>(Q.current||(Q.current=new tt(c,new Ke(c))),Q.current),[c]),A=l.find(g=>g.id===z)??null,M=h.useCallback(async g=>{if(g.preventDefault(),!(!w.trim()||!E.trim()||!j.trim()||!W.trim()||!J.trim()||!A)){se(null),k("connecting");try{const S=Ch(w),v=await s({name:w.trim(),channelId:S,workspaceId:A.workspaceId,boundWorkflowId:A.boundWorkflowId,appType:"whatsapp",description:`WhatsApp integration for agent: ${A.name}`}),D=await ne().connectChannel(v.workspaceId,v.id,{phone_number_id:E.trim(),access_token:j.trim(),signing_secret:W.trim(),webhook_verify_token:J.trim(),api_version:$.trim()||"v21.0"}),T=D.setupData,O=D.webhookUrl??T?.webhook_url??null,N=T?.webhook_verify_token??J.trim();ue(O),_e(N);const re={...v,connectionState:D.connectionState,webhookUrl:D.webhookUrl,setupData:D.setupData};ee(re),k("connected"),f?.(),u(re)}catch(S){se(S instanceof Error?S.message:"Connection failed. Please check your configuration and try again."),k("error")}}},[w,E,j,W,J,$,A,s,ne,u,f]);if(l.length===0)return n.jsxs("div",{className:"cheng-wa-form__no-agents",children:[n.jsx("div",{className:"cheng-wa-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wa-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wa-form__no-agents-desc",children:"Create an agent first, then come back to connect a WhatsApp integration. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:ta})]});if(y==="connected"&&ae)return n.jsxs("div",{className:"cheng-wa-form__success",children:[n.jsx("div",{className:"cheng-wa-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-form__success-title",children:"WhatsApp Connected!"}),n.jsxs("p",{className:"cheng-wa-form__success-desc",children:[n.jsx("strong",{children:ae.name})," has been created and verified",A&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:A.name})]}),"."]}),(le||te)&&n.jsxs("div",{className:"cheng-wa-form__webhook-box",children:[n.jsx("p",{className:"cheng-wa-form__webhook-box-title",children:"Configure Meta Console Webhook"}),le&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Webhook URL"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:le})]}),te&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Verify Token"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:te})]}),n.jsxs("ol",{className:"cheng-wa-form__meta-steps",children:[n.jsxs("li",{children:["Go to"," ",n.jsx("strong",{children:"Meta for Developers"})," → your WhatsApp app →"," ",n.jsx("strong",{children:"WhatsApp > Configuration"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Webhook"}),", click ",n.jsx("strong",{children:"Edit"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Webhook URL"})," and"," ",n.jsx("strong",{children:"Verify Token"})," shown above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Verify and Save"})]}),n.jsxs("li",{children:["Subscribe to ",n.jsx("strong",{children:"messages"})," webhook field"]})]})]}),n.jsx("p",{className:"cheng-wa-form__success-hint",children:"After configuring the webhook in Meta Console, send a test WhatsApp message to verify the full integration is working."}),m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:ta})]});const P=y==="connecting",F=w.trim().length>0&&E.trim().length>0&&j.trim().length>0&&W.trim().length>0&&J.trim().length>0&&!!A&&!P;return n.jsxs("form",{className:"cheng-wa-form",onSubmit:M,children:[n.jsxs("div",{className:"cheng-wa-form__instructions",children:[n.jsx("p",{className:"cheng-wa-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wa-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"Meta Business Account"})," with a verified phone number in WhatsApp Business Platform"]}),n.jsxs("li",{children:["Create a WhatsApp app in"," ",n.jsx("strong",{children:"Meta for Developers"})," and note the"," ",n.jsx("strong",{children:"Phone Number ID"})," and ",n.jsx("strong",{children:"Access Token"})]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Webhook URL"})," ","to paste into Meta Console"]})]})]}),ie&&n.jsxs("div",{className:"cheng-wa-form__error-banner",children:[n.jsx("span",{children:ie}),n.jsx("button",{type:"button",className:"cheng-wa-form__retry-btn",onClick:()=>{k("ready"),se(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-name",className:"cheng-wa-form__input",type:"text",value:w,onChange:g=>R(g.target.value),placeholder:"Customer Support WA",disabled:P,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A display name for this WhatsApp integration"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-agent",children:["Agent ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wa-form__agent-select-wrap",children:n.jsx("select",{id:"wa-agent",className:"cheng-wa-form__input cheng-wa-form__input--select",value:z,onChange:g=>V(g.target.value),disabled:P,required:!0,children:l.map(g=>n.jsxs("option",{value:g.id,children:[Nh(g)," ",g.name]},g.id))})}),A&&n.jsxs("span",{className:"cheng-wa-form__hint",children:["Messages from WhatsApp will be handled by"," ",n.jsx("strong",{children:A.name}),A.description?` — ${A.description}`:""]})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-phone-id",children:["Phone Number ID ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-phone-id",className:"cheng-wa-form__input",type:"text",value:E,onChange:g=>G(g.target.value),placeholder:"123456789012345",disabled:P,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta for Developers → WhatsApp → API Setup"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-access-token",children:["Access Token ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-access-token",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:j,onChange:g=>B(g.target.value),placeholder:"EAAxxxxxxxx...",disabled:P,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Permanent or temporary access token from Meta app dashboard"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-signing-secret",children:["App Secret"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"}),n.jsx("span",{className:"cheng-wa-form__label-hint",children:" (signing secret)"})]}),n.jsx("input",{id:"wa-signing-secret",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:W,onChange:g=>U(g.target.value),placeholder:"Your app secret",disabled:P,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta app → Settings → Basic → App Secret. Used to verify incoming webhook signatures."})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-verify-token",children:["Webhook Verify Token"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-verify-token",className:"cheng-wa-form__input",type:"text",value:J,onChange:g=>K(g.target.value),placeholder:"my-secret-verify-token",disabled:P,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A string you choose — you'll enter this same value when configuring the webhook in Meta Console"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsx("label",{className:"cheng-wa-form__label",htmlFor:"wa-api-version",children:"API Version"}),n.jsx("input",{id:"wa-api-version",className:"cheng-wa-form__input",type:"text",value:$,onChange:g=>X(g.target.value),placeholder:"v21.0",disabled:P,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"WhatsApp Cloud API version — default is v21.0"})]}),n.jsxs("div",{className:"cheng-wa-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--ghost",onClick:m,disabled:P,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",disabled:!F,children:P?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-form__btn-spinner"}),"Connecting..."]}):"Connect WhatsApp"})]}),n.jsx("style",{children:ta})]})}const ta=`
  .cheng-wa-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* No-agents empty state */
  .cheng-wa-form__no-agents {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }

  .cheng-wa-form__no-agents-icon {
    font-size: 32px;
    line-height: 1;
  }

  .cheng-wa-form__no-agents-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-wa-form__no-agents-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.55;
    max-width: 420px;
  }

  /* Success state */
  .cheng-wa-form__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 4px 0;
  }

  .cheng-wa-form__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #25d36618;
    color: #1aad54;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cheng-wa-form__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-wa-form__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-wa-form__success-hint {
    margin: 0;
    font-size: 12px;
    color: #87867f;
    line-height: 1.4;
  }

  /* Webhook info box */
  .cheng-wa-form__webhook-box {
    width: 100%;
    background: #25d36608;
    border: 1px solid #25d36628;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
  }

  .cheng-wa-form__webhook-box-title {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    color: #1aad54;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .cheng-wa-form__webhook-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .cheng-wa-form__webhook-label {
    font-size: 11px;
    font-weight: 600;
    color: #5e5d59;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .cheng-wa-form__webhook-value {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    background: #f0f0ea;
    padding: 6px 10px;
    border-radius: 6px;
    color: #141413;
    word-break: break-all;
    display: block;
  }

  .cheng-wa-form__meta-steps {
    margin: 4px 0 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cheng-wa-form__meta-steps li {
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Instructions box */
  .cheng-wa-form__instructions {
    background: #25d3660d;
    border: 1px solid #25d36625;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .cheng-wa-form__instructions-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    color: #1aad54;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .cheng-wa-form__steps {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cheng-wa-form__steps li {
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-wa-form__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }

  .cheng-wa-form__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .cheng-wa-form__retry-btn:hover {
    background: #b5333312 !important;
  }

  /* Fields */
  .cheng-wa-form__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cheng-wa-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-wa-form__required {
    color: #b53333;
    margin-left: 1px;
  }

  .cheng-wa-form__label-hint {
    font-weight: 400;
    color: #87867f;
  }

  .cheng-wa-form__input {
    padding: 9px 12px;
    border: 1px solid #d1cfc5;
    border-radius: 8px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .cheng-wa-form__input:focus {
    border-color: #25d366;
    box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.12);
  }

  .cheng-wa-form__input:disabled {
    background: #f5f4ed;
    color: #87867f;
    cursor: not-allowed;
  }

  .cheng-wa-form__input--select {
    appearance: auto;
    cursor: pointer;
  }

  .cheng-wa-form__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  .cheng-wa-form__agent-select-wrap {
    position: relative;
  }

  .cheng-wa-form__hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }

  .cheng-wa-form__hint strong {
    color: #5e5d59;
  }

  /* Footer & buttons */
  .cheng-wa-form__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }

  .cheng-wa-form__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }

  .cheng-wa-form__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cheng-wa-form .cheng-wa-form__btn--connect {
    background: #25d366 !important;
    color: #ffffff !important;
    border: none !important;
  }

  .cheng-wa-form .cheng-wa-form__btn--connect:hover:not(:disabled) {
    background: #1aad54 !important;
  }

  .cheng-wa-form .cheng-wa-form__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }

  .cheng-wa-form .cheng-wa-form__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }

  .cheng-wa-form .cheng-wa-form__btn--secondary {
    background: #f0eee6 !important;
    color: #141413 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }

  .cheng-wa-form .cheng-wa-form__btn--secondary:hover:not(:disabled) {
    background: #e8e6dc !important;
  }

  .cheng-wa-form__btn-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-wa-spin 0.65s linear infinite;
    flex-shrink: 0;
  }

  @keyframes cheng-wa-spin {
    to { transform: rotate(360deg); }
  }
`;function Eh({channel:l,agents:s,apiBaseUrl:c,onUpdate:u,onRefresh:f,onSaved:p,onCancel:m}){const y=l.connectionConfig??{},k=s.find(T=>T.boundWorkflowId===l.boundWorkflowId&&T.workspaceId===l.workspaceId)?.id??s[0]?.id??"",[w,R]=h.useState(k),[z,V]=h.useState(typeof y.phone_number_id=="string"?y.phone_number_id:""),[E,G]=h.useState(typeof y.api_version=="string"?y.api_version:"v21.0"),[j,B]=h.useState(""),[W,U]=h.useState(""),[J,K]=h.useState(""),[$,X]=h.useState("ready"),[ie,se]=h.useState(!1),[ae,ee]=h.useState(null),[le,ue]=h.useState(null),[te,_e]=h.useState(l.webhookUrl??null),Q=h.useRef(null),ne=h.useCallback(()=>(Q.current||(Q.current=new tt(c,new Ke(c))),Q.current),[c]),A=s.find(T=>T.id===w)??null,M=s.find(T=>T.boundWorkflowId===l.boundWorkflowId&&T.workspaceId===l.workspaceId)??null,P=A&&(A.workspaceId!==l.workspaceId||A.boundWorkflowId!==l.boundWorkflowId),F=j.trim().length>0&&W.trim().length>0&&J.trim().length>0&&z.trim().length>0,g=h.useCallback(async T=>{if(A){ue(null),ee(null),T?X("saving"):se(!0);try{if(P&&await u({id:l.id,channelId:l.channelId,name:l.name,workspaceId:A.workspaceId,boundWorkflowId:A.boundWorkflowId,appType:l.appType,description:l.description}),F){const O=P?A.workspaceId:l.workspaceId,N=await ne().connectChannel(O,l.id,{phone_number_id:z.trim(),access_token:j.trim(),signing_secret:W.trim(),webhook_verify_token:J.trim(),api_version:E.trim()||"v21.0"}),re=N.setupData,xe=N.webhookUrl??re?.webhook_url??null;xe&&_e(xe)}f?.(),T?(X("saved"),setTimeout(()=>p(),1200)):(X("ready"),ee(F?"Connection verified — credentials accepted.":"Agent binding updated."))}catch(O){ue(O instanceof Error?O.message:"Update failed. Please try again."),X("error"),ee(null)}finally{T||se(!1)}}},[A,P,F,l,u,ne,z,j,W,J,E,f,p]),S=h.useCallback(async T=>{T.preventDefault(),await g(!0)},[g]),v=$==="saving",D=!!A&&(!!P||F)&&!v&&!ie;return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):$==="saved"?n.jsxs("div",{className:"cheng-wa-edit__success",children:[n.jsx("div",{className:"cheng-wa-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wa-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",F?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:dd})]}):n.jsxs("form",{className:"cheng-wa-edit",onSubmit:S,children:[le&&n.jsxs("div",{className:"cheng-wa-edit__error-banner",children:[n.jsx("span",{children:le}),n.jsx("button",{type:"button",className:"cheng-wa-edit__retry-btn",onClick:()=>{X("ready"),ue(null)},children:"Retry"})]}),te&&n.jsxs("div",{className:"cheng-wa-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wa-edit__webhook-label",children:"Current Webhook URL"}),n.jsx("code",{className:"cheng-wa-edit__webhook-value",children:te})]}),n.jsxs("div",{className:"cheng-wa-edit__grid",children:[n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("select",{className:"cheng-wa-edit__input cheng-wa-edit__input--select",value:w,onChange:T=>R(T.target.value),disabled:v,required:!0,children:s.map(T=>n.jsx("option",{value:T.id,children:T.name},T.id))}),P&&A&&n.jsxs("div",{className:"cheng-wa-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:M?.name??"current agent"})," to"," ",n.jsx("strong",{children:A.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Phone Number ID"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Pre-filled from your current configuration. Only change if the number changed."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:z,onChange:T=>V(T.target.value),placeholder:"123456789012345",disabled:v,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Access Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Fill in only to rotate credentials."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:j,onChange:T=>B(T.target.value),placeholder:"EAAxxxxxxxx... (leave blank to keep current)",disabled:v,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"App Secret"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing secret. Required when rotating Access Token."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:W,onChange:T=>U(T.target.value),placeholder:"(leave blank to keep current)",disabled:v,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Webhook Verify Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:J,onChange:T=>K(T.target.value),placeholder:"(leave blank to keep current)",disabled:v,autoComplete:"off"}),ae&&n.jsx("div",{className:"cheng-wa-edit__test-ok",children:ae}),n.jsx("div",{className:"cheng-wa-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--secondary",disabled:!F||!A||v||ie,onClick:()=>{g(!1)},children:ie?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner cheng-wa-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"API Version"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"WhatsApp Cloud API version — pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:E,onChange:T=>G(T.target.value),placeholder:"v21.0",disabled:v,autoComplete:"off"})})]})]}),!F&&n.jsxs("div",{className:"cheng-wa-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Access Token + App Secret + Verify Token to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wa-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--ghost",onClick:m,disabled:v,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-edit__btn cheng-wa-edit__btn--connect",disabled:!D,children:v?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner"}),"Saving..."]}):F?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:dd})]})}const dd=`
  .cheng-wa-edit {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* Success state */
  .cheng-wa-edit__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-wa-edit__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #25d36618;
    color: #1aad54;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-wa-edit__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-wa-edit__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-wa-edit__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-wa-edit__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
  }

  /* Webhook info (read-only) */
  .cheng-wa-edit__webhook-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px;
    background: #25d3660a;
    border: 1px solid #25d36622;
    border-radius: 8px;
  }
  .cheng-wa-edit__webhook-label {
    font-size: 11px;
    font-weight: 600;
    color: #5e5d59;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .cheng-wa-edit__webhook-value {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    color: #141413;
    word-break: break-all;
  }

  /* Credentials hint */
  .cheng-wa-edit__creds-hint {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    background: #f5f3ec;
    border: 1px solid #ddd8cc;
    border-radius: 8px;
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-wa-edit__creds-hint svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: #87867f;
  }

  /* Grid */
  .cheng-wa-edit__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 600px) {
    .cheng-wa-edit__grid { grid-template-columns: 1fr; }
  }

  /* Card */
  .cheng-wa-edit__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px;
    background: #fffdf8;
    border: 1px solid #ece7db;
    border-radius: 16px;
  }
  .cheng-wa-edit__card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-wa-edit__card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #141413;
  }
  .cheng-wa-edit__card-tip {
    font-size: 12px;
    line-height: 1.45;
    color: #6d6a63;
  }

  /* Field */
  .cheng-wa-edit__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cheng-wa-edit__notice {
    padding: 8px 12px;
    background: #fff8e8;
    border: 1px solid #f0d080;
    border-radius: 7px;
    font-size: 12px;
    color: #7a5c00;
    line-height: 1.45;
  }

  /* Input */
  .cheng-wa-edit__input {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #d9d3c7;
    border-radius: 10px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-wa-edit__input:focus {
    border-color: #25d366;
    box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.14);
    background: #ffffff;
  }
  .cheng-wa-edit__input:disabled { background: #f3f1ea; color: #87867f; cursor: not-allowed; }
  .cheng-wa-edit__input--select { appearance: auto; cursor: pointer; }
  .cheng-wa-edit__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  /* Test status */
  .cheng-wa-edit__test-ok {
    padding: 8px 12px;
    background: #25d3660e;
    border: 1px solid #25d36628;
    border-radius: 7px;
    font-size: 12px;
    color: #1aad54;
    line-height: 1.4;
  }
  .cheng-wa-edit__card-actions {
    display: flex;
    gap: 8px;
  }

  /* Footer */
  .cheng-wa-edit__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }

  /* Buttons */
  .cheng-wa-edit__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-wa-edit__btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .cheng-wa-edit .cheng-wa-edit__btn--connect {
    background: #25d366 !important;
    color: #ffffff !important;
    border: none !important;
  }
  .cheng-wa-edit .cheng-wa-edit__btn--connect:hover:not(:disabled) {
    background: #1aad54 !important;
  }
  .cheng-wa-edit .cheng-wa-edit__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-wa-edit . cheng-wa-edit__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-wa-edit . cheng-wa-edit__btn--secondary {
    background: #f0eee6 !important;
    color: #141413 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 500;
  }
  .cheng-wa-edit . cheng-wa-edit__btn--secondary:hover:not(:disabled) {
    background: #e8e6dc !important;
  }

  /* Spinner */
  .cheng-wa-edit__spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-wa-edit-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  .cheng-wa-edit__spinner--dark {
    border-color: rgba(0, 0, 0, 0.15);
    border-top-color: #5e5d59;
  }
  @keyframes cheng-wa-edit-spin { to { transform: rotate(360deg); } }
`;function Ah(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"slack-app"}function Th(l){const s=l.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function zh({agents:l,onCreate:s,apiBaseUrl:c,onPaired:u,onRefresh:f,onGoToAgents:p,onCancel:m}){const[y,k]=h.useState("ready"),[w,R]=h.useState("webhook"),[z,V]=h.useState(""),[E,G]=h.useState(()=>l[0]?.id??""),[j,B]=h.useState(""),[W,U]=h.useState(""),[J,K]=h.useState(""),[$,X]=h.useState(""),[ie,se]=h.useState(""),[ae,ee]=h.useState(null),[le,ue]=h.useState(null),[te,_e]=h.useState(null),[Q,ne]=h.useState(null),[A,M]=h.useState(null),[P,F]=h.useState("idle"),g=h.useRef(null),S=h.useCallback(()=>(g.current||(g.current=new tt(c,new Ke(c))),g.current),[c]),v=l.find(N=>N.id===E)??null,D=h.useCallback(async N=>{N.preventDefault();const re=w==="webhook"&&z.trim()&&j.trim()&&W.trim()&&v,xe=w==="socket_mode"&&z.trim()&&j.trim()&&J.trim()&&v;if(!re&&!xe)return;ee(null),k("connecting");let H;try{const fe=Ah(z);H=await s({name:z.trim(),channelId:fe,workspaceId:v.workspaceId,boundWorkflowId:v.boundWorkflowId,appType:"slack",description:`Slack integration for agent: ${v.name}`})}catch(fe){ee(fe instanceof Error?fe.message:"Failed to create the channel record. Please try again."),k("error");return}_e(H);try{const fe={bot_token:j.trim(),connection_mode:w};w==="webhook"?fe.signing_secret=W.trim():fe.app_token=J.trim(),$.trim()&&(fe.app_id=$.trim()),ie.trim()&&(fe.team_id=ie.trim());const Ne=await S().connectChannel(H.workspaceId,H.id,fe),ce=Ne.setupData,ye=w==="webhook"?Ne.webhookUrl??ce?.webhook_url??null:null;ne(ye);const Se=ce?.team_name??null,Ee=ce?.bot_user??null;(Se||Ee)&&M([Se,Ee?`Bot: ${Ee}`:null].filter(Boolean).join(" · "));const ot={...H,connectionState:Ne.connectionState,webhookUrl:Ne.webhookUrl,setupData:Ne.setupData};ue(ot),k("connected"),f?.(),u(ot)}catch(fe){f?.(),ee(fe instanceof Error?fe.message:w==="webhook"?"Connection failed. Please check your Bot Token and Signing Secret.":"Connection failed. Please check your Bot Token and App-Level Token."),k("created")}},[w,z,j,W,J,$,ie,v,s,S,u,f]);if(l.length===0)return n.jsxs("div",{className:"cheng-sl-form__no-agents",children:[n.jsx("div",{className:"cheng-sl-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-sl-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-sl-form__no-agents-desc",children:"Create an agent first, then come back to connect a Slack app. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:Yo})]});if(y==="connected"&&le)return n.jsxs("div",{className:"cheng-sl-form__success",children:[n.jsx("div",{className:"cheng-sl-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-form__success-title",children:"Slack Connected!"}),n.jsxs("p",{className:"cheng-sl-form__success-desc",children:[n.jsx("strong",{children:le.name})," has been created and verified",A&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-sl-form__workspace-info",children:A})]}),v&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:v.name})]}),"."]}),n.jsx("div",{className:"cheng-sl-form__mode-badge",children:w==="socket_mode"?"Socket Mode":"Webhook Mode"}),w==="webhook"&&Q&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Configure Slack Event Subscriptions"}),n.jsxs("div",{className:"cheng-sl-form__webhook-row",children:[n.jsx("span",{className:"cheng-sl-form__webhook-label",children:"Request URL"}),n.jsxs("div",{className:"cheng-sl-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-sl-form__webhook-value",children:Q}),n.jsx("button",{type:"button",className:"cheng-sl-form__copy-btn",onClick:()=>{navigator.clipboard.writeText(Q).then(()=>{F("copied"),setTimeout(()=>F("idle"),2e3)})},children:P==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Event Subscriptions"})]}),n.jsxs("li",{children:["Enable events and paste the ",n.jsx("strong",{children:"Request URL"})," shown above"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Subscribe to bot events"}),", add:"," ",n.jsx("code",{children:"app_mention"})," and ",n.jsx("code",{children:"message.im"})," (add"," ",n.jsx("code",{children:"message.channels"})," to receive channel messages)"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"})]}),n.jsx("li",{children:"Reinstall the app to your workspace to apply scope changes"})]})]}),w==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Socket Mode — No Public URL Required"}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Socket Mode"})," and confirm it is ",n.jsx("strong",{children:"enabled"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Event Subscriptions"}),", enable events and subscribe to bot events:"," ",n.jsx("code",{children:"app_mention"}),", ",n.jsx("code",{children:"message.im"}),", ",n.jsx("code",{children:"message.channels"})]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"}),", ",n.jsx("code",{children:"connections:write"})]}),n.jsx("li",{children:"Reinstall the app to your workspace if you added new scopes"}),n.jsx("li",{children:"The backend is now listening via WebSocket — no Event Subscriptions Request URL needed"})]})]}),n.jsx("p",{className:"cheng-sl-form__success-hint",children:w==="webhook"?"After configuring Event Subscriptions, mention your bot in a channel to verify the integration.":"Your bot is now connected via Socket Mode. Mention it in a channel or send a DM to verify."}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:Yo})]});if(y==="created"&&te)return n.jsxs("div",{className:"cheng-sl-form__created-warn",children:[n.jsx("div",{className:"cheng-sl-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-sl-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-sl-form__created-warn-desc",children:[n.jsx("strong",{children:te.name})," was created successfully, but the token validation failed",ae?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:ae})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:Yo})]});const T=y==="connecting",O=z.trim().length>0&&j.trim().length>0&&(w==="webhook"?W.trim().length>0:J.trim().length>0)&&!!v&&!T;return n.jsxs("form",{className:"cheng-sl-form",onSubmit:D,children:[n.jsxs("div",{className:"cheng-sl-form__mode-toggle-wrap",children:[n.jsx("span",{className:"cheng-sl-form__mode-toggle-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-form__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${w==="webhook"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>R("webhook"),disabled:T,children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${w==="socket_mode"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>R("socket_mode"),disabled:T,children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]}),n.jsx("span",{className:"cheng-sl-form__mode-toggle-hint",children:w==="webhook"?"Requires a public HTTPS URL. Slack sends events to your server via HTTP.":"No public URL needed. Backend maintains a persistent WebSocket to Slack."})]}),n.jsxs("div",{className:"cheng-sl-form__instructions",children:[n.jsx("p",{className:"cheng-sl-form__instructions-title",children:"Before you begin"}),w==="webhook"?n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App Credentials"}),", copy the"," ",n.jsx("strong",{children:"Signing Secret"})]}),n.jsxs("li",{children:["After connecting, paste the provided ",n.jsx("strong",{children:"Request URL"})," into"," ",n.jsx("strong",{children:"Event Subscriptions"})]})]}):n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"Socket Mode"})," in your app settings and"," ",n.jsx("strong",{children:"enable Socket Mode"})]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),", generate a token with ",n.jsx("code",{children:"connections:write"})," scope — this is your"," ",n.jsx("strong",{children:"App-Level Token"})," (",n.jsx("code",{children:"xapp-..."}),")"]}),n.jsxs("li",{children:["Enable ",n.jsx("strong",{children:"Event Subscriptions"})," and subscribe to the bot events you need (no Request URL needed)"]})]})]}),ae&&n.jsxs("div",{className:"cheng-sl-form__error-banner",children:[n.jsx("span",{children:ae}),n.jsx("button",{type:"button",className:"cheng-sl-form__retry-btn",onClick:()=>{k("ready"),ee(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-name",children:["Integration Name ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-name",className:"cheng-sl-form__input",type:"text",value:z,onChange:N=>V(N.target.value),placeholder:"Slack Support Bot",disabled:T,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-sl-form__hint",children:"A display name for this Slack integration"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-agent",children:["Agent ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-sl-form__agent-select-wrap",children:n.jsx("select",{id:"sl-agent",className:"cheng-sl-form__input cheng-sl-form__input--select",value:E,onChange:N=>G(N.target.value),disabled:T,required:!0,children:l.map(N=>n.jsxs("option",{value:N.id,children:[Th(N)," ",N.name]},N.id))})}),v&&n.jsxs("span",{className:"cheng-sl-form__hint",children:["Messages from Slack will be handled by"," ",n.jsx("strong",{children:v.name}),v.description?` — ${v.description}`:""]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-bot-token",children:["Bot Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xoxb-...)"})]}),n.jsx("input",{id:"sl-bot-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:j,onChange:N=>B(N.target.value),placeholder:"xoxb-0000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx",disabled:T,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"OAuth & Permissions → Bot User OAuth Token"}),". Keep this secret."]})]}),w==="webhook"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-signing-secret",children:["Signing Secret ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-signing-secret",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:W,onChange:N=>U(N.target.value),placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:T,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App Credentials → Signing Secret"}),". Used to verify webhook signatures."]})]}),w==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-token",children:["App-Level Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xapp-...)"})]}),n.jsx("input",{id:"sl-app-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:J,onChange:N=>K(N.target.value),placeholder:"xapp-1-xxxxxxxxxx-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:T,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),". Must have the"," ",n.jsx("code",{children:"connections:write"})," scope. Different from the Bot Token."]})]}),n.jsxs("div",{className:"cheng-sl-form__optional-row",children:[n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-id",children:["App ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-app-id",className:"cheng-sl-form__input",type:"text",value:$,onChange:N=>X(N.target.value),placeholder:"A0XXXXXXX",disabled:T,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["From ",n.jsx("strong",{children:"Basic Information → App ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-team-id",children:["Workspace ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-team-id",className:"cheng-sl-form__input",type:"text",value:ie,onChange:N=>se(N.target.value),placeholder:"T0XXXXXXX",disabled:T,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:"Slack Workspace / Team ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--ghost",onClick:m,disabled:T,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",disabled:!O,children:T?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-form__btn-spinner"}),"Connecting..."]}):"Connect Slack"})]}),n.jsx("style",{children:Yo})]})}const Yo=`
  .cheng-sl-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* No-agents empty state */
  .cheng-sl-form__no-agents {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-sl-form__no-agents-icon {
    font-size: 32px;
    line-height: 1;
  }
  .cheng-sl-form__no-agents-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-sl-form__no-agents-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.55;
    max-width: 420px;
  }

  /* Connection mode toggle */
  .cheng-sl-form__mode-toggle-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cheng-sl-form__mode-toggle-label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-sl-form__mode-toggle {
    display: inline-flex;
    border: 1px solid #d1cfc5;
    border-radius: 10px;
    overflow: hidden;
    background: #f5f4ed;
  }
  .cheng-sl-form__mode-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    color: #5e5d59;
    background: transparent !important;
    border: none !important;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .cheng-sl-form__mode-btn:hover:not(:disabled) {
    background: #ece9e0 !important;
    color: #141413;
  }
  .cheng-sl-form__mode-btn--active {
    background: #4a154b !important;
    color: #ffffff !important;
  }
  .cheng-sl-form__mode-btn--active:hover:not(:disabled) {
    background: #611f69 !important;
  }
  .cheng-sl-form__mode-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .cheng-sl-form__mode-toggle-hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.4;
  }

  /* Success state */
  .cheng-sl-form__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 4px 0;
  }
  .cheng-sl-form__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #4a154b18;
    color: #4a154b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-sl-form__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-sl-form__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-sl-form__workspace-info {
    color: #4a154b;
    font-weight: 500;
  }
  .cheng-sl-form__mode-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    background: #4a154b12;
    border: 1px solid #4a154b28;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: #4a154b;
    letter-spacing: 0.02em;
  }
  .cheng-sl-form__success-hint {
    margin: 0;
    font-size: 12px;
    color: #87867f;
    line-height: 1.4;
  }

  /* Webhook info box */
  .cheng-sl-form__webhook-box {
    width: 100%;
    background: #4a154b08;
    border: 1px solid #4a154b28;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
  }
  .cheng-sl-form__webhook-box-title {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    color: #4a154b;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cheng-sl-form__webhook-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .cheng-sl-form__webhook-label {
    font-size: 11px;
    font-weight: 600;
    color: #5e5d59;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  /* URL + copy button container */
  .cheng-sl-form__webhook-url-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  .cheng-sl-form__webhook-value {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    background: #f0f0ea;
    padding: 6px 10px;
    border-radius: 6px;
    color: #141413;
    word-break: break-all;
    display: block;
    flex: 1;
  }
  .cheng-sl-form__copy-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    background: #4a154b !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .cheng-sl-form__copy-btn:hover {
    background: #611f69 !important;
  }

  /* Channel-created-but-connect-failed warning state */
  .cheng-sl-form__created-warn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-sl-form__created-warn-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #f5a62318;
    color: #b87400;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-sl-form__created-warn-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-sl-form__created-warn-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.6;
    max-width: 460px;
  }
  .cheng-sl-form__created-warn-desc em {
    font-style: normal;
    color: #b53333;
  }

  .cheng-sl-form__slack-steps {
    margin: 4px 0 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .cheng-sl-form__slack-steps li {
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-sl-form__slack-steps code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    background: #e8e6dc;
    padding: 1px 4px;
    border-radius: 3px;
    color: #141413;
  }

  /* Instructions box */
  .cheng-sl-form__instructions {
    background: #4a154b0d;
    border: 1px solid #4a154b25;
    border-radius: 10px;
    padding: 14px 16px;
  }
  .cheng-sl-form__instructions-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    color: #4a154b;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cheng-sl-form__steps {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .cheng-sl-form__steps li {
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-sl-form__steps code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    background: #e8e6dc;
    padding: 1px 5px;
    border-radius: 4px;
    color: #141413;
  }

  /* Error banner */
  .cheng-sl-form__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-sl-form__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .cheng-sl-form__retry-btn:hover {
    background: #b5333312 !important;
  }

  /* Fields */
  .cheng-sl-form__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .cheng-sl-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-sl-form__required {
    color: #b53333;
    margin-left: 1px;
  }
  .cheng-sl-form__label-hint {
    font-weight: 400;
    color: #87867f;
  }

  /* Optional row — two columns */
  .cheng-sl-form__optional-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 560px) {
    .cheng-sl-form__optional-row { grid-template-columns: 1fr; }
  }

  /* Inputs */
  .cheng-sl-form__input {
    padding: 9px 12px;
    border: 1px solid #d1cfc5;
    border-radius: 8px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-sl-form__input:focus {
    border-color: #4a154b;
    box-shadow: 0 0 0 3px rgba(74, 21, 75, 0.12);
  }
  .cheng-sl-form__input:disabled {
    background: #f5f4ed;
    color: #87867f;
    cursor: not-allowed;
  }
  .cheng-sl-form__input--select {
    appearance: auto;
    cursor: pointer;
  }
  .cheng-sl-form__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }
  .cheng-sl-form__agent-select-wrap {
    position: relative;
  }

  .cheng-sl-form__hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }
  .cheng-sl-form__hint strong {
    color: #5e5d59;
  }
  .cheng-sl-form__hint code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    background: #e8e6dc;
    padding: 1px 4px;
    border-radius: 3px;
    color: #141413;
  }

  /* Footer & buttons */
  .cheng-sl-form__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }
  .cheng-sl-form__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-sl-form__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .cheng-sl-form .cheng-sl-form__btn--connect {
    background: #4a154b !important;
    color: #ffffff !important;
    border: none !important;
  }
  .cheng-sl-form .cheng-sl-form__btn--connect:hover:not(:disabled) {
    background: #611f69 !important;
  }
  .cheng-sl-form .cheng-sl-form__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-sl-form .cheng-sl-form__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-sl-form .cheng-sl-form__btn--secondary {
    background: #f0eee6 !important;
    color: #141413 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-sl-form .cheng-sl-form__btn--secondary:hover:not(:disabled) {
    background: #e8e6dc !important;
  }

  .cheng-sl-form__btn-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-sl-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  @keyframes cheng-sl-spin {
    to { transform: rotate(360deg); }
  }
`;function Lh({channel:l,agents:s,apiBaseUrl:c,onUpdate:u,onRefresh:f,onSaved:p,onCancel:m}){const y=l.connectionConfig??{},k=s.find(ye=>ye.boundWorkflowId===l.boundWorkflowId&&ye.workspaceId===l.workspaceId)?.id??s[0]?.id??"",w=typeof y.connection_mode=="string"&&y.connection_mode==="socket_mode"?"socket_mode":"webhook",[R,z]=h.useState(w),[V,E]=h.useState(k),G=typeof y.app_id=="string"?y.app_id:"",j=typeof y.team_id=="string"?y.team_id:"",[B,W]=h.useState(G),[U,J]=h.useState(j),[K,$]=h.useState(""),[X,ie]=h.useState(""),[se,ae]=h.useState(""),[ee,le]=h.useState("ready"),[ue,te]=h.useState(!1),[_e,Q]=h.useState(null),[ne,A]=h.useState(null),[M,P]=h.useState(l.webhookUrl??null),F=h.useRef(null),g=h.useCallback(()=>(F.current||(F.current=new tt(c,new Ke(c))),F.current),[c]),S=s.find(ye=>ye.id===V)??null,v=s.find(ye=>ye.boundWorkflowId===l.boundWorkflowId&&ye.workspaceId===l.workspaceId)??null,D=S&&(S.workspaceId!==l.workspaceId||S.boundWorkflowId!==l.boundWorkflowId),T=R!==w,O=R==="webhook"?K.trim().length>0||X.trim().length>0:K.trim().length>0||se.trim().length>0,N=R==="webhook"?K.trim().length>0&&X.trim().length>0:K.trim().length>0&&se.trim().length>0,re=T&&!N,xe=h.useCallback(async ye=>{if(S&&!(!D&&!O&&!T)&&!re){A(null),Q(null),ye?le("saving"):te(!0);try{if(D&&await u({id:l.id,channelId:l.channelId,name:l.name,workspaceId:S.workspaceId,boundWorkflowId:S.boundWorkflowId,appType:l.appType,description:l.description}),O||T){const Se=D?S.workspaceId:l.workspaceId,Ee={connection_mode:R};K.trim()&&(Ee.bot_token=K.trim()),R==="webhook"?X.trim()&&(Ee.signing_secret=X.trim()):se.trim()&&(Ee.app_token=se.trim()),Ee.app_id=B.trim()||null,Ee.team_id=U.trim()||null;const ot=await g().connectChannel(Se,l.id,Ee),Et=ot.setupData;if(R==="webhook"){const kn=ot.webhookUrl??Et?.webhook_url??null;kn&&P(kn)}else P(null)}if(f?.(),ye)le("saved"),setTimeout(()=>p(),1200);else{le("ready");let Se;T?Se=`Switched to ${R==="socket_mode"?"Socket Mode":"Webhook Mode"} and verified.`:O?Se="Credentials verified — Slack integration is active.":Se="Agent binding updated.",Q(Se)}}catch(Se){A(Se instanceof Error?Se.message:"Update failed. Please try again."),le("error"),Q(null)}finally{ye||te(!1)}}},[S,D,O,T,re,R,l,u,g,K,X,se,B,U,f,p]),H=h.useCallback(async ye=>{ye.preventDefault(),await xe(!0)},[xe]),fe=ee==="saving",Ne=!!S&&(O||!!D&&!T)&&!re&&!fe&&!ue,ce=fe?null:O||T?"Save & Reconnect":"Save";return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):ee==="saved"?n.jsxs("div",{className:"cheng-sl-edit__success",children:[n.jsx("div",{className:"cheng-sl-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-sl-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",O||T?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:ud})]}):n.jsxs("form",{className:"cheng-sl-edit",onSubmit:H,children:[ne&&n.jsxs("div",{className:"cheng-sl-edit__error-banner",children:[n.jsx("span",{children:ne}),n.jsx("button",{type:"button",className:"cheng-sl-edit__retry-btn",onClick:()=>{le("ready"),A(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-edit__mode-section",children:[n.jsxs("div",{className:"cheng-sl-edit__mode-header",children:[n.jsx("span",{className:"cheng-sl-edit__mode-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-edit__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${R==="webhook"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>z("webhook"),disabled:fe,children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${R==="socket_mode"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>z("socket_mode"),disabled:fe,children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]})]}),T&&n.jsxs("div",{className:"cheng-sl-edit__mode-change-warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Switching from ",n.jsx("strong",{children:w==="webhook"?"Webhook":"Socket Mode"})," to"," ",n.jsx("strong",{children:R==="webhook"?"Webhook":"Socket Mode"}),". You must provide"," ",R==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to complete the switch — saving will trigger a full reconnect."]})]}),R==="webhook"&&M&&n.jsxs("div",{className:"cheng-sl-edit__webhook-info",children:[n.jsx("span",{className:"cheng-sl-edit__webhook-label",children:"Event Subscriptions Request URL"}),n.jsx("code",{className:"cheng-sl-edit__webhook-value",children:M}),n.jsxs("span",{className:"cheng-sl-edit__webhook-hint",children:["Paste this URL in your Slack app's ",n.jsx("strong",{children:"Event Subscriptions"})," settings."]})]}),R==="socket_mode"&&!T&&n.jsxs("div",{className:"cheng-sl-edit__socket-info",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),"Connected via Socket Mode — no Event Subscriptions Request URL needed. The backend maintains a persistent WebSocket to Slack."]}),n.jsxs("div",{className:"cheng-sl-edit__grid",children:[n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("select",{className:"cheng-sl-edit__input cheng-sl-edit__input--select",value:V,onChange:ye=>E(ye.target.value),disabled:fe,required:!0,children:s.map(ye=>n.jsx("option",{value:ye.id,children:ye.name},ye.id))}),D&&S&&n.jsxs("div",{className:"cheng-sl-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:v?.name??"current agent"})," to"," ",n.jsx("strong",{children:S.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Bot Token"}),n.jsxs("span",{className:"cheng-sl-edit__card-tip",children:["Leave blank to keep the existing token (",n.jsx("code",{children:"xoxb-..."}),"). Fill in only to rotate."]})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:K,onChange:ye=>$(ye.target.value),placeholder:"xoxb-... (leave blank to keep current)",disabled:fe,autoComplete:"off"})})]}),R==="webhook"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Signing Secret"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:T?"Required to activate Webhook Mode. Found in Basic Information → App Credentials.":"Leave blank to keep the existing secret. Fill in to rotate it independently."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:X,onChange:ye=>ie(ye.target.value),placeholder:T?"Required for Webhook Mode":"(leave blank to keep current)",disabled:fe,autoComplete:"off"}),_e&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:_e}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!O||!S||fe||ue||re,onClick:()=>{xe(!1)},children:ue?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),R==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App-Level Token"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:T?"Required to activate Socket Mode. Generate in Basic Information → App-Level Tokens with connections:write scope.":"Leave blank to keep the existing token (xapp-...). Fill in only to rotate."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:se,onChange:ye=>ae(ye.target.value),placeholder:T?"xapp-... (required for Socket Mode)":"xapp-... (leave blank to keep current)",disabled:fe,autoComplete:"off"}),_e&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:_e}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!O||!S||fe||ue||re,onClick:()=>{xe(!1)},children:ue?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:O?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:B,onChange:ye=>W(ye.target.value),placeholder:"A0XXXXXXX",disabled:fe||!O,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Workspace ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:O?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:U,onChange:ye=>J(ye.target.value),placeholder:"T0XXXXXXX",disabled:fe||!O,autoComplete:"off"})})]})]}),!O&&!T&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),R==="webhook"?"Fill in Bot Token or Signing Secret (or both) to reconnect. Leave blank to only update the agent.":"Fill in Bot Token or App-Level Token (or both) to reconnect. Leave blank to only update the agent."]}),re&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint cheng-sl-edit__creds-hint--warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Mode change requires credentials to reconnect. Provide"," ",R==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to proceed."]}),n.jsxs("div",{className:"cheng-sl-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--ghost",onClick:m,disabled:fe,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-edit__btn cheng-sl-edit__btn--connect",disabled:!Ne,children:fe?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner"}),"Saving..."]}):ce})]}),n.jsx("style",{children:ud})]})}const ud=`
  .cheng-sl-edit {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* Success state */
  .cheng-sl-edit__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-sl-edit__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #4a154b18;
    color: #4a154b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-sl-edit__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-sl-edit__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-sl-edit__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-sl-edit__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
  }

  /* Connection mode section */
  .cheng-sl-edit__mode-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cheng-sl-edit__mode-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .cheng-sl-edit__mode-label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
    white-space: nowrap;
  }
  .cheng-sl-edit__mode-toggle {
    display: inline-flex;
    border: 1px solid #d1cfc5;
    border-radius: 10px;
    overflow: hidden;
    background: #f5f4ed;
  }
  .cheng-sl-edit__mode-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 500;
    color: #5e5d59;
    background: transparent !important;
    border: none !important;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .cheng-sl-edit__mode-btn:hover:not(:disabled) {
    background: #ece9e0 !important;
    color: #141413;
  }
  .cheng-sl-edit__mode-btn--active {
    background: #4a154b !important;
    color: #ffffff !important;
  }
  .cheng-sl-edit__mode-btn--active:hover:not(:disabled) {
    background: #611f69 !important;
  }
  .cheng-sl-edit__mode-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Mode change warning */
  .cheng-sl-edit__mode-change-warn {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    background: #fff8e8;
    border: 1px solid #f0d080;
    border-radius: 8px;
    font-size: 12px;
    color: #7a5c00;
    line-height: 1.5;
  }
  .cheng-sl-edit__mode-change-warn svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: #b87400;
  }

  /* Webhook info (read-only) */
  .cheng-sl-edit__webhook-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px 14px;
    background: #4a154b0a;
    border: 1px solid #4a154b22;
    border-radius: 8px;
  }
  .cheng-sl-edit__webhook-label {
    font-size: 11px;
    font-weight: 600;
    color: #4a154b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .cheng-sl-edit__webhook-value {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    color: #141413;
    word-break: break-all;
  }
  .cheng-sl-edit__webhook-hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }
  .cheng-sl-edit__webhook-hint strong {
    color: #5e5d59;
  }

  /* Socket Mode info (read-only) */
  .cheng-sl-edit__socket-info {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 10px 13px;
    background: #4a154b08;
    border: 1px solid #4a154b20;
    border-radius: 8px;
    font-size: 12px;
    color: #4a154b;
    line-height: 1.5;
  }
  .cheng-sl-edit__socket-info svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* Credentials hint */
  .cheng-sl-edit__creds-hint {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    background: #f5f3ec;
    border: 1px solid #ddd8cc;
    border-radius: 8px;
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-sl-edit__creds-hint svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: #87867f;
  }
  .cheng-sl-edit__creds-hint--warn {
    background: #fff1f0;
    border-color: #f5c6c6;
    color: #b53333;
  }
  .cheng-sl-edit__creds-hint--warn svg {
    color: #b53333;
  }

  /* Grid */
  .cheng-sl-edit__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 600px) {
    .cheng-sl-edit__grid { grid-template-columns: 1fr; }
  }

  /* Card */
  .cheng-sl-edit__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px;
    background: #fffdf8;
    border: 1px solid #ece7db;
    border-radius: 16px;
  }
  .cheng-sl-edit__card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-sl-edit__card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #141413;
  }
  .cheng-sl-edit__card-tip {
    font-size: 12px;
    line-height: 1.45;
    color: #6d6a63;
  }
  .cheng-sl-edit__card-tip code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    background: #e8e6dc;
    padding: 1px 4px;
    border-radius: 3px;
    color: #141413;
  }

  /* Field */
  .cheng-sl-edit__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cheng-sl-edit__notice {
    padding: 8px 12px;
    background: #fff8e8;
    border: 1px solid #f0d080;
    border-radius: 7px;
    font-size: 12px;
    color: #7a5c00;
    line-height: 1.45;
  }

  /* Input */
  .cheng-sl-edit__input {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #d9d3c7;
    border-radius: 10px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-sl-edit__input:focus {
    border-color: #4a154b;
    box-shadow: 0 0 0 3px rgba(74, 21, 75, 0.14);
    background: #ffffff;
  }
  .cheng-sl-edit__input:disabled { background: #f3f1ea; color: #87867f; cursor: not-allowed; }
  .cheng-sl-edit__input--select { appearance: auto; cursor: pointer; }
  .cheng-sl-edit__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  /* Test result */
  .cheng-sl-edit__test-ok {
    padding: 8px 12px;
    background: #4a154b0e;
    border: 1px solid #4a154b28;
    border-radius: 7px;
    font-size: 12px;
    color: #4a154b;
    line-height: 1.4;
  }
  .cheng-sl-edit__card-actions {
    display: flex;
    gap: 8px;
  }

  /* Footer */
  .cheng-sl-edit__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 4px;
  }

  /* Buttons */
  .cheng-sl-edit__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-sl-edit__btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .cheng-sl-edit .cheng-sl-edit__btn--connect {
    background: #4a154b !important;
    color: #ffffff !important;
    border: 1px solid #4a154b !important;
  }
  .cheng-sl-edit .cheng-sl-edit__btn--connect:hover:not(:disabled) {
    background: #611f69 !important;
    border-color: #611f69 !important;
  }
  .cheng-sl-edit .cheng-sl-edit__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-sl-edit .cheng-sl-edit__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-sl-edit .cheng-sl-edit__btn--secondary {
    background: #fffdf8 !important;
    color: #4a154b !important;
    border: 1px solid rgba(74, 21, 75, 0.28) !important;
    font-size: 12px;
    padding: 8px 14px;
    font-weight: 500;
  }
  .cheng-sl-edit .cheng-sl-edit__btn--secondary:hover:not(:disabled) {
    background: rgba(74, 21, 75, 0.07) !important;
    border-color: #4a154b !important;
  }

  /* Spinner */
  .cheng-sl-edit__spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-sl-edit-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  .cheng-sl-edit__spinner--dark {
    border-color: rgba(74, 21, 75, 0.2);
    border-top-color: #4a154b;
  }
  @keyframes cheng-sl-edit-spin { to { transform: rotate(360deg); } }

  @media (max-width: 760px) {
    .cheng-sl-edit__footer { flex-direction: column-reverse; align-items: stretch; }
    .cheng-sl-edit__btn { width: 100%; justify-content: center; }
  }
`;function Rh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"wecom-bot"}function Mh(l){const s=l.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Ph({agents:l,onCreate:s,apiBaseUrl:c,onPaired:u,onRefresh:f,onGoToAgents:p,onCancel:m}){const[y,k]=h.useState("ready"),[w,R]=h.useState(""),[z,V]=h.useState(()=>l[0]?.id??""),[E,G]=h.useState(""),[j,B]=h.useState(""),[W,U]=h.useState(""),[J,K]=h.useState(""),[$,X]=h.useState(""),[ie,se]=h.useState(""),[ae,ee]=h.useState(null),[le,ue]=h.useState(null),[te,_e]=h.useState(null),[Q,ne]=h.useState(null),[A,M]=h.useState({}),P=h.useRef(null),F=h.useCallback(()=>(P.current||(P.current=new tt(c,new Ke(c))),P.current),[c]),g=l.find(O=>O.id===z)??null,S=h.useCallback((O,N)=>{navigator.clipboard.writeText(N).then(()=>{M(re=>({...re,[O]:"copied"})),setTimeout(()=>M(re=>({...re,[O]:"idle"})),2e3)})},[]),v=h.useCallback(async O=>{if(O.preventDefault(),!w.trim()||!E.trim()||!j.trim()||!W.trim()||!J.trim()||!$.trim()||!g)return;ee(null),k("connecting");let N;try{const re=Rh(w);N=await s({name:w.trim(),channelId:re,workspaceId:g.workspaceId,boundWorkflowId:g.boundWorkflowId,appType:"wecom",description:`WeCom integration for agent: ${g.name}`})}catch(re){ee(re instanceof Error?re.message:"Failed to create the channel record. Please try again."),k("error");return}_e(N);try{const re={corp_id:E.trim(),agent_id:j.trim(),corp_secret:W.trim(),token:J.trim(),encoding_aes_key:$.trim()};ie.trim()&&(re.receive_id=ie.trim());const xe=await F().connectChannel(N.workspaceId,N.id,re),H=xe.setupData;ne({webhookUrl:xe.webhookUrl??H?.webhook_url??void 0,token:H?.callback_token??J.trim(),encodingAesKeyMasked:H?.encoding_aes_key_masked??void 0,corpId:H?.corp_id??E.trim(),agentId:H?.agent_id??j.trim()});const fe={...N,connectionState:xe.connectionState,webhookUrl:xe.webhookUrl,setupData:xe.setupData};ue(fe),k("connected"),f?.(),u(fe)}catch(re){f?.(),ee(re instanceof Error?re.message:"Connection failed. Please check your Corp ID and Corp Secret."),k("created")}},[w,E,j,W,J,$,ie,g,s,F,u,f]);if(l.length===0)return n.jsxs("div",{className:"cheng-wc-form__no-agents",children:[n.jsx("div",{className:"cheng-wc-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wc-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wc-form__no-agents-desc",children:"Create an agent first, then come back to connect a WeCom integration. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:qo})]});if(y==="connected"&&le)return n.jsxs("div",{className:"cheng-wc-form__success",children:[n.jsx("div",{className:"cheng-wc-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-form__success-title",children:"WeCom Credentials Verified!"}),n.jsxs("p",{className:"cheng-wc-form__success-desc",children:[n.jsx("strong",{children:le.name})," has been created and the Corp Secret has been verified",g&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:g.name})]}),"."]}),n.jsx("div",{className:"cheng-wc-form__status-badge cheng-wc-form__status-badge--configuring",children:"Configuring — Awaiting Callback Setup"}),Q&&n.jsxs("div",{className:"cheng-wc-form__webhook-box",children:[n.jsx("p",{className:"cheng-wc-form__webhook-box-title",children:"Configure WeCom Admin Console Callback"}),Q.webhookUrl&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Callback URL"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:Q.webhookUrl}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>S("webhookUrl",Q.webhookUrl),children:A.webhookUrl==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),Q.token&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Token"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:Q.token}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>S("token",Q.token),children:A.token==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),Q.encodingAesKeyMasked&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"EncodingAESKey"}),n.jsx("code",{className:"cheng-wc-form__webhook-value cheng-wc-form__webhook-value--muted",children:Q.encodingAesKeyMasked})]}),n.jsxs("ol",{className:"cheng-wc-form__steps-list",children:[n.jsxs("li",{children:["Log in to"," ",n.jsx("strong",{children:"WeCom Admin Console"})," → ",n.jsx("strong",{children:"App Management"})," → select your custom app"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Receive Messages"}),", click ",n.jsx("strong",{children:"Set"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Callback URL"})," into the URL field"]}),n.jsxs("li",{children:["Enter the same ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," ","you configured above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Save"})," — WeCom will send a GET challenge to verify the URL"]}),n.jsxs("li",{children:["Once verified, the connection state will switch from"," ",n.jsx("em",{children:"Configuring"})," to ",n.jsx("em",{children:"Active"})]})]})]}),n.jsx("p",{className:"cheng-wc-form__success-hint",children:"The connection is not fully active until WeCom Admin Console successfully verifies the callback URL. After saving the callback config, send a test message to confirm end-to-end flow."}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:qo})]});if(y==="created"&&te)return n.jsxs("div",{className:"cheng-wc-form__created-warn",children:[n.jsx("div",{className:"cheng-wc-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-wc-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-wc-form__created-warn-desc",children:[n.jsx("strong",{children:te.name})," was created successfully, but credential validation failed",ae?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:ae})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:qo})]});const D=y==="connecting",T=w.trim().length>0&&E.trim().length>0&&j.trim().length>0&&W.trim().length>0&&J.trim().length>0&&$.trim().length>0&&!!g&&!D;return n.jsxs("form",{className:"cheng-wc-form",onSubmit:v,children:[n.jsxs("div",{className:"cheng-wc-form__instructions",children:[n.jsx("p",{className:"cheng-wc-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wc-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"WeCom Enterprise Account"})," with a created"," ",n.jsx("strong",{children:"Custom App"})," (自建应用)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Management"}),", note the ",n.jsx("strong",{children:"Corp ID"}),","," ",n.jsx("strong",{children:"AgentId"}),", and ",n.jsx("strong",{children:"App Secret"})]}),n.jsxs("li",{children:["Create a ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," of your choice — you'll use these when configuring the callback in WeCom Admin Console"]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Callback URL"})," to paste into the Receive Messages settings"]})]})]}),ae&&y!=="created"&&n.jsxs("div",{className:"cheng-wc-form__error-banner",children:[n.jsx("span",{children:ae}),n.jsx("button",{type:"button",className:"cheng-wc-form__retry-btn",onClick:()=>{k("ready"),ee(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-name",className:"cheng-wc-form__input",type:"text",value:w,onChange:O=>R(O.target.value),placeholder:"WeCom Customer Support",disabled:D,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A display name for this WeCom integration"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent",children:["Agent ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wc-form__agent-select-wrap",children:n.jsx("select",{id:"wc-agent",className:"cheng-wc-form__input cheng-wc-form__input--select",value:z,onChange:O=>V(O.target.value),disabled:D,required:!0,children:l.map(O=>n.jsxs("option",{value:O.id,children:[Mh(O)," ",O.name]},O.id))})}),g&&n.jsxs("span",{className:"cheng-wc-form__hint",children:["Messages from WeCom will be handled by"," ",n.jsx("strong",{children:g.name}),g.description?` — ${g.description}`:""]})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-id",children:["Corp ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-id",className:"cheng-wc-form__input",type:"text",value:E,onChange:O=>G(O.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:D,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in WeCom Admin Console → My Enterprise"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent-id",children:["Agent ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-agent-id",className:"cheng-wc-form__input",type:"text",value:j,onChange:O=>B(O.target.value),placeholder:"1000002",disabled:D,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → AgentId"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-secret",children:["Corp Secret ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-secret",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:W,onChange:O=>U(O.target.value),placeholder:"Your app's Corp Secret",disabled:D,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → App Secret. Used to obtain access tokens."})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-token",children:["Token ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-token",className:"cheng-wc-form__input",type:"text",value:J,onChange:O=>K(O.target.value),placeholder:"my-callback-token",disabled:D,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A string you choose — enter this same value in WeCom callback settings"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-aes-key",children:["EncodingAESKey ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-aes-key",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:$,onChange:O=>X(O.target.value),placeholder:"43-character AES key",disabled:D,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"43-char random key — enter this same value in WeCom callback settings"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-receive-id",children:["Receive ID",n.jsx("span",{className:"cheng-wc-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"wc-receive-id",className:"cheng-wc-form__input",type:"text",value:ie,onChange:O=>se(O.target.value),placeholder:"Defaults to Corp ID if blank",disabled:D,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Used as the receive_id in message verification. Defaults to Corp ID."})]}),n.jsxs("div",{className:"cheng-wc-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--ghost",onClick:m,disabled:D,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",disabled:!T,children:D?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-form__btn-spinner"}),"Connecting..."]}):"Connect WeCom"})]}),n.jsx("style",{children:qo})]})}const qo=`
  .cheng-wc-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* No-agents empty state */
  .cheng-wc-form__no-agents {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-wc-form__no-agents-icon { font-size: 32px; line-height: 1; }
  .cheng-wc-form__no-agents-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-wc-form__no-agents-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.55;
    max-width: 420px;
  }

  /* Success state */
  .cheng-wc-form__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 4px 0;
  }
  .cheng-wc-form__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #24806718;
    color: #248067;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-wc-form__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-wc-form__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-wc-form__success-hint {
    margin: 0;
    font-size: 12px;
    color: #87867f;
    line-height: 1.4;
  }

  /* Status badge */
  .cheng-wc-form__status-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .cheng-wc-form__status-badge--configuring {
    background: #f5a62318;
    border: 1px solid #f5a62338;
    color: #b87400;
  }
  .cheng-wc-form__status-badge--active {
    background: #24806718;
    border: 1px solid #24806738;
    color: #248067;
  }

  /* Webhook info box */
  .cheng-wc-form__webhook-box {
    width: 100%;
    background: #24806708;
    border: 1px solid #24806728;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
  }
  .cheng-wc-form__webhook-box-title {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    color: #248067;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cheng-wc-form__webhook-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .cheng-wc-form__webhook-label {
    font-size: 11px;
    font-weight: 600;
    color: #5e5d59;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .cheng-wc-form__webhook-url-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  .cheng-wc-form__webhook-value {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    background: #f0f0ea;
    padding: 6px 10px;
    border-radius: 6px;
    color: #141413;
    word-break: break-all;
    display: block;
    flex: 1;
  }
  .cheng-wc-form__webhook-value--muted {
    color: #87867f;
    letter-spacing: 0.05em;
  }
  .cheng-wc-form__copy-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    background: #248067 !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .cheng-wc-form__copy-btn:hover {
    background: #1a6050 !important;
  }
  .cheng-wc-form__steps-list {
    margin: 4px 0 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-wc-form__steps-list li {
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Channel-created-but-connect-failed warning state */
  .cheng-wc-form__created-warn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-wc-form__created-warn-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #f5a62318;
    color: #b87400;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-wc-form__created-warn-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-wc-form__created-warn-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.6;
    max-width: 460px;
  }
  .cheng-wc-form__created-warn-desc em {
    font-style: normal;
    color: #b53333;
  }

  /* Instructions box */
  .cheng-wc-form__instructions {
    background: #2480670d;
    border: 1px solid #24806725;
    border-radius: 10px;
    padding: 14px 16px;
  }
  .cheng-wc-form__instructions-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    color: #248067;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cheng-wc-form__steps {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .cheng-wc-form__steps li {
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-wc-form__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-wc-form__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .cheng-wc-form__retry-btn:hover { background: #b5333312 !important; }

  /* Two-column row */
  .cheng-wc-form__row-2col {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 560px) {
    .cheng-wc-form__row-2col { grid-template-columns: 1fr; }
  }

  /* Fields */
  .cheng-wc-form__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .cheng-wc-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-wc-form__required { color: #b53333; margin-left: 1px; }
  .cheng-wc-form__label-hint { font-weight: 400; color: #87867f; }
  .cheng-wc-form__input {
    padding: 9px 12px;
    border: 1px solid #d1cfc5;
    border-radius: 8px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-wc-form__input:focus {
    border-color: #248067;
    box-shadow: 0 0 0 3px rgba(36, 128, 103, 0.12);
  }
  .cheng-wc-form__input:disabled {
    background: #f5f4ed;
    color: #87867f;
    cursor: not-allowed;
  }
  .cheng-wc-form__input--select { appearance: auto; cursor: pointer; }
  .cheng-wc-form__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }
  .cheng-wc-form__agent-select-wrap { position: relative; }
  .cheng-wc-form__hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }
  .cheng-wc-form__hint strong { color: #5e5d59; }

  /* Footer & buttons */
  .cheng-wc-form__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }
  .cheng-wc-form__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-wc-form__btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .cheng-wc-form .cheng-wc-form__btn--connect {
    background: #248067 !important;
    color: #ffffff !important;
    border: none !important;
  }
  .cheng-wc-form .cheng-wc-form__btn--connect:hover:not(:disabled) {
    background: #1a6050 !important;
  }
  .cheng-wc-form .cheng-wc-form__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-wc-form .cheng-wc-form__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-wc-form .cheng-wc-form__btn--secondary {
    background: #f0eee6 !important;
    color: #141413 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-wc-form .cheng-wc-form__btn--secondary:hover:not(:disabled) {
    background: #e8e6dc !important;
  }
  .cheng-wc-form__btn-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-wc-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  @keyframes cheng-wc-spin { to { transform: rotate(360deg); } }
`;function Dh({channel:l,agents:s,apiBaseUrl:c,onUpdate:u,onRefresh:f,onSaved:p,onCancel:m}){const y=l.connectionConfig??{},k=s.find(N=>N.boundWorkflowId===l.boundWorkflowId&&N.workspaceId===l.workspaceId)?.id??s[0]?.id??"",[w,R]=h.useState(k),[z,V]=h.useState(typeof y.corp_id=="string"?y.corp_id:""),[E,G]=h.useState(typeof y.agent_id=="string"?y.agent_id:""),[j,B]=h.useState(typeof y.receive_id=="string"?y.receive_id:""),[W,U]=h.useState(""),[J,K]=h.useState(""),[$,X]=h.useState(""),[ie,se]=h.useState("ready"),[ae,ee]=h.useState(!1),[le,ue]=h.useState(null),[te,_e]=h.useState(null),[Q,ne]=h.useState(l.webhookUrl??null),A=h.useRef(null),M=h.useCallback(()=>(A.current||(A.current=new tt(c,new Ke(c))),A.current),[c]),P=s.find(N=>N.id===w)??null,F=s.find(N=>N.boundWorkflowId===l.boundWorkflowId&&N.workspaceId===l.workspaceId)??null,g=P&&(P.workspaceId!==l.workspaceId||P.boundWorkflowId!==l.boundWorkflowId),S=W.trim().length>0&&J.trim().length>0&&$.trim().length>0&&z.trim().length>0&&E.trim().length>0,v=h.useCallback(async N=>{if(P){_e(null),ue(null),N?se("saving"):ee(!0);try{if(g&&await u({id:l.id,channelId:l.channelId,name:l.name,workspaceId:P.workspaceId,boundWorkflowId:P.boundWorkflowId,appType:l.appType,description:l.description}),S){const re=g?P.workspaceId:l.workspaceId,xe={corp_id:z.trim(),agent_id:E.trim(),corp_secret:W.trim(),token:J.trim(),encoding_aes_key:$.trim()};j.trim()&&(xe.receive_id=j.trim());const H=await M().connectChannel(re,l.id,xe),fe=H.setupData,Ne=H.webhookUrl??fe?.webhook_url??null;Ne&&ne(Ne)}f?.(),N?(se("saved"),setTimeout(()=>p(),1200)):(se("ready"),ue(S?"Credentials verified — Corp Secret accepted.":"Agent binding updated."))}catch(re){_e(re instanceof Error?re.message:"Update failed. Please try again."),se("error"),ue(null)}finally{N||ee(!1)}}},[P,g,S,l,u,M,z,E,W,J,$,j,f,p]),D=h.useCallback(async N=>{N.preventDefault(),await v(!0)},[v]),T=ie==="saving",O=!!P&&(!!g||S)&&!T&&!ae;return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):ie==="saved"?n.jsxs("div",{className:"cheng-wc-edit__success",children:[n.jsx("div",{className:"cheng-wc-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wc-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",S?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:pd})]}):n.jsxs("form",{className:"cheng-wc-edit",onSubmit:D,children:[te&&n.jsxs("div",{className:"cheng-wc-edit__error-banner",children:[n.jsx("span",{children:te}),n.jsx("button",{type:"button",className:"cheng-wc-edit__retry-btn",onClick:()=>{se("ready"),_e(null)},children:"Retry"})]}),Q&&n.jsxs("div",{className:"cheng-wc-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wc-edit__webhook-label",children:"Callback URL"}),n.jsx("code",{className:"cheng-wc-edit__webhook-value",children:Q}),n.jsxs("span",{className:"cheng-wc-edit__webhook-hint",children:["Paste this URL in WeCom Admin Console → App → ",n.jsx("strong",{children:"Receive Messages"}),"."]})]}),l.connectionState==="configuring"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--configuring",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Credentials verified, but WeCom callback is not yet active. Configure the callback URL in WeCom Admin Console to complete the integration."]}),l.connectionState==="active"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--active",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"20 6 9 17 4 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),"Callback is active — WeCom verification challenge has succeeded."]}),n.jsxs("div",{className:"cheng-wc-edit__grid",children:[n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("select",{className:"cheng-wc-edit__input cheng-wc-edit__input--select",value:w,onChange:N=>R(N.target.value),disabled:T,required:!0,children:s.map(N=>n.jsx("option",{value:N.id,children:N.name},N.id))}),g&&P&&n.jsxs("div",{className:"cheng-wc-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:F?.name??"current agent"})," to"," ",n.jsx("strong",{children:P.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration. Update if the enterprise changed."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:z,onChange:N=>V(N.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Agent ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:E,onChange:N=>G(N.target.value),placeholder:"1000002",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp Secret"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing secret. Fill in to rotate credentials."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:W,onChange:N=>U(N.target.value),placeholder:"(leave blank to keep current)",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Token"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating Corp Secret."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:J,onChange:N=>K(N.target.value),placeholder:"(leave blank to keep current)",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"EncodingAESKey"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing key. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:$,onChange:N=>X(N.target.value),placeholder:"(leave blank to keep current)",disabled:T,autoComplete:"off"}),le&&n.jsx("div",{className:"cheng-wc-edit__test-ok",children:le}),n.jsx("div",{className:"cheng-wc-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--secondary",disabled:!S||!P||T||ae,onClick:()=>{v(!1)},children:ae?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner cheng-wc-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Receive ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Optional. Used for signature verification. Defaults to Corp ID if blank."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:j,onChange:N=>B(N.target.value),placeholder:"Defaults to Corp ID",disabled:T,autoComplete:"off"})})]})]}),!S&&n.jsxs("div",{className:"cheng-wc-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Corp Secret + Token + EncodingAESKey to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wc-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--ghost",onClick:m,disabled:T,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-edit__btn cheng-wc-edit__btn--connect",disabled:!O,children:T?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner"}),"Saving..."]}):S?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:pd})]})}const pd=`
  .cheng-wc-edit {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* Success state */
  .cheng-wc-edit__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-wc-edit__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #24806718;
    color: #248067;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-wc-edit__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-wc-edit__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-wc-edit__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-wc-edit__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
  }

  /* Webhook info (read-only) */
  .cheng-wc-edit__webhook-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px 14px;
    background: #2480670a;
    border: 1px solid #24806722;
    border-radius: 8px;
  }
  .cheng-wc-edit__webhook-label {
    font-size: 11px;
    font-weight: 600;
    color: #248067;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .cheng-wc-edit__webhook-value {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    color: #141413;
    word-break: break-all;
  }
  .cheng-wc-edit__webhook-hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }
  .cheng-wc-edit__webhook-hint strong { color: #5e5d59; }

  /* State note */
  .cheng-wc-edit__state-note {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
  }
  .cheng-wc-edit__state-note svg { flex-shrink: 0; margin-top: 1px; }
  .cheng-wc-edit__state-note--configuring {
    background: #f5a62310;
    border: 1px solid #f5a62330;
    color: #7a5c00;
  }
  .cheng-wc-edit__state-note--configuring svg { color: #b87400; }
  .cheng-wc-edit__state-note--active {
    background: #24806710;
    border: 1px solid #24806730;
    color: #1a5c4b;
  }
  .cheng-wc-edit__state-note--active svg { color: #248067; }

  /* Credentials hint */
  .cheng-wc-edit__creds-hint {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    background: #f5f3ec;
    border: 1px solid #ddd8cc;
    border-radius: 8px;
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-wc-edit__creds-hint svg { flex-shrink: 0; margin-top: 1px; color: #87867f; }

  /* Grid */
  .cheng-wc-edit__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 600px) {
    .cheng-wc-edit__grid { grid-template-columns: 1fr; }
  }

  /* Card */
  .cheng-wc-edit__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px;
    background: #fffdf8;
    border: 1px solid #ece7db;
    border-radius: 16px;
  }
  .cheng-wc-edit__card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-wc-edit__card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #141413;
  }
  .cheng-wc-edit__card-tip {
    font-size: 12px;
    line-height: 1.45;
    color: #6d6a63;
  }

  /* Field */
  .cheng-wc-edit__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cheng-wc-edit__notice {
    padding: 8px 12px;
    background: #fff8e8;
    border: 1px solid #f0d080;
    border-radius: 7px;
    font-size: 12px;
    color: #7a5c00;
    line-height: 1.45;
  }

  /* Input */
  .cheng-wc-edit__input {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #d9d3c7;
    border-radius: 10px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-wc-edit__input:focus {
    border-color: #248067;
    box-shadow: 0 0 0 3px rgba(36, 128, 103, 0.14);
    background: #ffffff;
  }
  .cheng-wc-edit__input:disabled { background: #f3f1ea; color: #87867f; cursor: not-allowed; }
  .cheng-wc-edit__input--select { appearance: auto; cursor: pointer; }
  .cheng-wc-edit__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  /* Test status */
  .cheng-wc-edit__test-ok {
    padding: 8px 12px;
    background: #2480670e;
    border: 1px solid #24806728;
    border-radius: 7px;
    font-size: 12px;
    color: #248067;
    line-height: 1.4;
  }
  .cheng-wc-edit__card-actions { display: flex; gap: 8px; }

  /* Footer */
  .cheng-wc-edit__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }

  /* Buttons */
  .cheng-wc-edit__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-wc-edit__btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .cheng-wc-edit .cheng-wc-edit__btn--connect {
    background: #248067 !important;
    color: #ffffff !important;
    border: none !important;
  }
  .cheng-wc-edit .cheng-wc-edit__btn--connect:hover:not(:disabled) {
    background: #1a6050 !important;
  }
  .cheng-wc-edit .cheng-wc-edit__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-wc-edit .cheng-wc-edit__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-wc-edit .cheng-wc-edit__btn--secondary {
    background: #fffdf8 !important;
    color: #248067 !important;
    border: 1px solid rgba(36, 128, 103, 0.28) !important;
    font-size: 12px;
    padding: 8px 14px;
    font-weight: 500;
  }
  .cheng-wc-edit . cheng-wc-edit__btn--secondary:hover:not(:disabled) {
    background: rgba(36, 128, 103, 0.07) !important;
    border-color: #248067 !important;
  }

  /* Spinner */
  .cheng-wc-edit__spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-wc-edit-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  .cheng-wc-edit__spinner--dark {
    border-color: rgba(36, 128, 103, 0.2);
    border-top-color: #248067;
  }
  @keyframes cheng-wc-edit-spin { to { transform: rotate(360deg); } }
`;function Wh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"dingtalk-bot"}function Fh(l){const s=l.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Oh({agents:l,onCreate:s,apiBaseUrl:c,onPaired:u,onRefresh:f,onGoToAgents:p,onCancel:m}){const[y,k]=h.useState("ready"),[w,R]=h.useState(""),[z,V]=h.useState(()=>l[0]?.id??""),[E,G]=h.useState(""),[j,B]=h.useState(""),[W,U]=h.useState(""),[J,K]=h.useState(null),[$,X]=h.useState(null),[ie,se]=h.useState(null),[ae,ee]=h.useState(null),le=h.useRef(null),ue=h.useCallback(()=>(le.current||(le.current=new tt(c,new Ke(c))),le.current),[c]),te=l.find(A=>A.id===z)??null,_e=h.useCallback(async A=>{if(A.preventDefault(),!w.trim()||!E.trim()||!j.trim()||!W.trim()||!te)return;K(null),k("connecting");let M;try{const P=Wh(w);M=await s({name:w.trim(),channelId:P,workspaceId:te.workspaceId,boundWorkflowId:te.boundWorkflowId,appType:"dingtalk",description:`DingTalk integration for agent: ${te.name}`})}catch(P){K(P instanceof Error?P.message:"Failed to create the channel record. Please try again."),k("error");return}se(M);try{const P=await ue().connectChannel(M.workspaceId,M.id,{client_id:E.trim(),client_secret:j.trim(),robot_code:W.trim(),connection_mode:"stream"}),F=P.setupData;ee({robotCode:F?.robot_code??W.trim(),appName:F?.app_name??void 0,streamStatus:F?.stream_status??"connected",validatedAt:F?.validated_at??void 0});const g={...M,connectionState:P.connectionState,webhookUrl:P.webhookUrl,setupData:P.setupData};X(g),k("connected"),f?.(),u(g)}catch(P){f?.(),K(P instanceof Error?P.message:"Connection failed. Please check your Client ID, Client Secret, and Robot Code."),k("created")}},[w,E,j,W,te,s,ue,u,f]);if(l.length===0)return n.jsxs("div",{className:"cheng-dt-form__no-agents",children:[n.jsx("div",{className:"cheng-dt-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-dt-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-dt-form__no-agents-desc",children:"Create an agent first, then come back to connect a DingTalk integration. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:Jo})]});if(y==="connected"&&$)return n.jsxs("div",{className:"cheng-dt-form__success",children:[n.jsx("div",{className:"cheng-dt-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-form__success-title",children:"DingTalk Connected!"}),n.jsxs("p",{className:"cheng-dt-form__success-desc",children:[n.jsx("strong",{children:$.name})," has been created and is now live",ae?.appName&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-dt-form__app-name",children:ae.appName})]}),te&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:te.name})]}),"."]}),n.jsxs("div",{className:"cheng-dt-form__mode-badge",children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),n.jsxs("div",{className:"cheng-dt-form__stream-box",children:[n.jsx("p",{className:"cheng-dt-form__stream-box-title",children:"Stream Connection Active"}),ae?.robotCode&&n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Robot Code"}),n.jsx("code",{className:"cheng-dt-form__stream-value",children:ae.robotCode})]}),n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Status"}),n.jsx("span",{className:"cheng-dt-form__stream-status",children:ae?.streamStatus==="connected"?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__status-dot cheng-dt-form__status-dot--active"}),"Connected"]}):ae?.streamStatus??"connecting"})]}),n.jsxs("ol",{className:"cheng-dt-form__steps-list",children:[n.jsxs("li",{children:["The backend is now maintaining a ",n.jsx("strong",{children:"persistent WebSocket"})," to DingTalk — no public URL or callback configuration needed"]}),n.jsxs("li",{children:["Verify the bot is working by sending a ",n.jsx("strong",{children:"direct message"})," to your DingTalk App Bot"]}),n.jsxs("li",{children:["For group chat, ",n.jsx("strong",{children:"@mention"})," the bot — only @-mentioned messages are forwarded to the workflow"]})]})]}),n.jsxs("p",{className:"cheng-dt-form__success-hint",children:["The stream worker runs as long as the server is up. If the worker stops unexpectedly, use ",n.jsx("strong",{children:"Manage → Edit → Test Connection"})," to reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:Jo})]});if(y==="created"&&ie)return n.jsxs("div",{className:"cheng-dt-form__created-warn",children:[n.jsx("div",{className:"cheng-dt-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-dt-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-dt-form__created-warn-desc",children:[n.jsx("strong",{children:ie.name})," was created successfully, but the stream worker failed to start",J?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:J})]}):"."," The channel is now listed in Connected Integrations — open"," ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:Jo})]});const Q=y==="connecting",ne=w.trim().length>0&&E.trim().length>0&&j.trim().length>0&&W.trim().length>0&&!!te&&!Q;return n.jsxs("form",{className:"cheng-dt-form",onSubmit:_e,children:[n.jsxs("div",{className:"cheng-dt-form__instructions",children:[n.jsx("p",{className:"cheng-dt-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-dt-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"DingTalk Open Platform"})," developer account with a created ",n.jsx("strong",{children:"App Bot"})," (企业内部应用)"]}),n.jsxs("li",{children:["From your app's ",n.jsx("strong",{children:"App Credentials"}),", note the"," ",n.jsx("strong",{children:"Client ID"})," (AppKey) and ",n.jsx("strong",{children:"Client Secret"})," (AppSecret)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Features → Bot"}),", enable the bot feature and note the ",n.jsx("strong",{children:"Robot Code"})]}),n.jsx("li",{children:"No callback URL configuration is needed — DingTalk Stream Mode connects outbound from the server"})]})]}),J&&y!=="created"&&n.jsxs("div",{className:"cheng-dt-form__error-banner",children:[n.jsx("span",{children:J}),n.jsx("button",{type:"button",className:"cheng-dt-form__retry-btn",onClick:()=>{k("ready"),K(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-name",children:["Integration Name ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-name",className:"cheng-dt-form__input",type:"text",value:w,onChange:A=>R(A.target.value),placeholder:"DingTalk Support Bot",disabled:Q,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-dt-form__hint",children:"A display name for this DingTalk integration"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-agent",children:["Agent ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-dt-form__agent-select-wrap",children:n.jsx("select",{id:"dt-agent",className:"cheng-dt-form__input cheng-dt-form__input--select",value:z,onChange:A=>V(A.target.value),disabled:Q,required:!0,children:l.map(A=>n.jsxs("option",{value:A.id,children:[Fh(A)," ",A.name]},A.id))})}),te&&n.jsxs("span",{className:"cheng-dt-form__hint",children:["Messages from DingTalk will be handled by"," ",n.jsx("strong",{children:te.name}),te.description?` — ${te.description}`:""]})]}),n.jsxs("div",{className:"cheng-dt-form__row-2col",children:[n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-id",children:["Client ID ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppKey)"})]}),n.jsx("input",{id:"dt-client-id",className:"cheng-dt-form__input",type:"text",value:E,onChange:A=>G(A.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:Q,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client ID"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-robot-code",children:["Robot Code ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-robot-code",className:"cheng-dt-form__input",type:"text",value:W,onChange:A=>U(A.target.value),placeholder:"dingxxxxxx",disabled:Q,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Features → Bot → Robot Code"})]})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-secret",children:["Client Secret ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppSecret)"})]}),n.jsx("input",{id:"dt-client-secret",className:"cheng-dt-form__input cheng-dt-form__input--token",type:"password",value:j,onChange:A=>B(A.target.value),placeholder:"Your app's Client Secret",disabled:Q,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client Secret. Used for stream authentication."})]}),n.jsxs("div",{className:"cheng-dt-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--ghost",onClick:m,disabled:Q,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",disabled:!ne,children:Q?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__btn-spinner"}),"Connecting..."]}):"Connect DingTalk"})]}),n.jsx("style",{children:Jo})]})}const Jo=`
  .cheng-dt-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* No-agents empty state */
  .cheng-dt-form__no-agents {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-dt-form__no-agents-icon { font-size: 32px; line-height: 1; }
  .cheng-dt-form__no-agents-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-dt-form__no-agents-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.55;
    max-width: 420px;
  }

  /* Success state */
  .cheng-dt-form__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 4px 0;
  }
  .cheng-dt-form__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #1677ff18;
    color: #1677ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-dt-form__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-dt-form__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-dt-form__app-name {
    color: #1677ff;
    font-weight: 500;
  }
  .cheng-dt-form__success-hint {
    margin: 0;
    font-size: 12px;
    color: #87867f;
    line-height: 1.4;
  }

  /* Mode badge */
  .cheng-dt-form__mode-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    background: #1677ff12;
    border: 1px solid #1677ff28;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: #1677ff;
    letter-spacing: 0.02em;
  }

  /* Stream info box */
  .cheng-dt-form__stream-box {
    width: 100%;
    background: #1677ff08;
    border: 1px solid #1677ff28;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
  }
  .cheng-dt-form__stream-box-title {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    color: #1677ff;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cheng-dt-form__stream-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .cheng-dt-form__stream-label {
    font-size: 11px;
    font-weight: 600;
    color: #5e5d59;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .cheng-dt-form__stream-value {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    background: #f0f0ea;
    padding: 6px 10px;
    border-radius: 6px;
    color: #141413;
    word-break: break-all;
    display: block;
  }
  .cheng-dt-form__stream-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #141413;
    font-weight: 500;
  }
  .cheng-dt-form__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .cheng-dt-form__status-dot--active {
    background: #1677ff;
    box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.2);
  }
  .cheng-dt-form__steps-list {
    margin: 4px 0 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-dt-form__steps-list li {
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Channel-created-but-connect-failed warning state */
  .cheng-dt-form__created-warn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-dt-form__created-warn-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #f5a62318;
    color: #b87400;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-dt-form__created-warn-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-dt-form__created-warn-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.6;
    max-width: 460px;
  }
  .cheng-dt-form__created-warn-desc em {
    font-style: normal;
    color: #b53333;
  }

  /* Instructions box */
  .cheng-dt-form__instructions {
    background: #1677ff0d;
    border: 1px solid #1677ff25;
    border-radius: 10px;
    padding: 14px 16px;
  }
  .cheng-dt-form__instructions-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    color: #1677ff;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cheng-dt-form__steps {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .cheng-dt-form__steps li {
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-dt-form__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-dt-form__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .cheng-dt-form__retry-btn:hover { background: #b5333312 !important; }

  /* Two-column row */
  .cheng-dt-form__row-2col {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 560px) {
    .cheng-dt-form__row-2col { grid-template-columns: 1fr; }
  }

  /* Fields */
  .cheng-dt-form__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .cheng-dt-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-dt-form__required { color: #b53333; margin-left: 1px; }
  .cheng-dt-form__label-hint { font-weight: 400; color: #87867f; }
  .cheng-dt-form__input {
    padding: 9px 12px;
    border: 1px solid #d1cfc5;
    border-radius: 8px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-dt-form__input:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.12);
  }
  .cheng-dt-form__input:disabled {
    background: #f5f4ed;
    color: #87867f;
    cursor: not-allowed;
  }
  .cheng-dt-form__input--select { appearance: auto; cursor: pointer; }
  .cheng-dt-form__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }
  .cheng-dt-form__agent-select-wrap { position: relative; }
  .cheng-dt-form__hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }
  .cheng-dt-form__hint strong { color: #5e5d59; }

  /* Footer & buttons */
  .cheng-dt-form__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }
  .cheng-dt-form__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-dt-form__btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .cheng-dt-form .cheng-dt-form__btn--connect {
    background: #1677ff !important;
    color: #ffffff !important;
    border: none !important;
  }
  .cheng-dt-form .cheng-dt-form__btn--connect:hover:not(:disabled) {
    background: #0958d9 !important;
  }
  .cheng-dt-form .cheng-dt-form__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-dt-form .cheng-dt-form__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-dt-form .cheng-dt-form__btn--secondary {
    background: #f0eee6 !important;
    color: #141413 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-dt-form . cheng-dt-form__btn--secondary:hover:not(:disabled) {
    background: #e8e6dc !important;
  }
  .cheng-dt-form__btn-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-dt-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  @keyframes cheng-dt-spin { to { transform: rotate(360deg); } }
`;function Uh({channel:l,agents:s,apiBaseUrl:c,liveStatus:u,onUpdate:f,onRefresh:p,onSaved:m,onCancel:y}){const k=l.connectionConfig??{},w=l.setupData,R=s.find(N=>N.boundWorkflowId===l.boundWorkflowId&&N.workspaceId===l.workspaceId)?.id??s[0]?.id??"",[z,V]=h.useState(R),[E,G]=h.useState(typeof k.client_id=="string"?k.client_id:""),[j,B]=h.useState(typeof k.robot_code=="string"?k.robot_code:typeof w?.robot_code=="string"?w.robot_code:""),[W,U]=h.useState(""),[J,K]=h.useState("ready"),[$,X]=h.useState(!1),[ie,se]=h.useState(null),[ae,ee]=h.useState(null),le=typeof w?.stream_status=="string"?w.stream_status:void 0,ue=u?.lastEventAt??(typeof w?.last_event_at=="string"?w.last_event_at:void 0),te=u?.connectionState??l.connectionState,_e=u?u.connectionState==="active"?"connected":u.connectionState??"unknown":le??(l.connectionState==="active"?"connected":l.connectionState??"unknown"),Q=u?u.workerRunning===!0||u.connectionState==="active":l.connectionState==="active"||le==="connected",ne=h.useRef(null),A=h.useCallback(()=>(ne.current||(ne.current=new tt(c,new Ke(c))),ne.current),[c]),M=s.find(N=>N.id===z)??null,P=s.find(N=>N.boundWorkflowId===l.boundWorkflowId&&N.workspaceId===l.workspaceId)??null,F=M&&(M.workspaceId!==l.workspaceId||M.boundWorkflowId!==l.boundWorkflowId),g=E.trim().length>0&&W.trim().length>0&&j.trim().length>0,S=h.useCallback(async N=>{if(M){ee(null),se(null),N?K("saving"):X(!0);try{if(F&&await f({id:l.id,channelId:l.channelId,name:l.name,workspaceId:M.workspaceId,boundWorkflowId:M.boundWorkflowId,appType:l.appType,description:l.description}),g){const re=F?M.workspaceId:l.workspaceId,xe=await A().connectChannel(re,l.id,{client_id:E.trim(),client_secret:W.trim(),robot_code:j.trim(),connection_mode:"stream"});U("");const fe=xe.setupData?.stream_status}p?.(),N?(K("saved"),setTimeout(()=>m(),1200)):(K("ready"),se(g?"Stream worker restarted — credentials accepted.":"Agent binding updated."))}catch(re){ee(re instanceof Error?re.message:"Update failed. Please try again."),K("error"),se(null)}finally{N||X(!1)}}},[M,F,g,l,f,A,E,W,j,p,m]),v=h.useCallback(async N=>{N.preventDefault(),await S(!0)},[S]),D=J==="saving",T=!!M&&(!!F||g)&&!D&&!$,O=N=>{if(!N)return"—";const re=new Date(N);return Number.isNaN(re.getTime())?N:re.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})};return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):J==="saved"?n.jsxs("div",{className:"cheng-dt-edit__success",children:[n.jsx("div",{className:"cheng-dt-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-dt-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",g?"reconfigured — stream worker restarted":"updated","."]}),n.jsx("style",{children:hd})]}):n.jsxs("form",{className:"cheng-dt-edit",onSubmit:v,children:[ae&&n.jsxs("div",{className:"cheng-dt-edit__error-banner",children:[n.jsx("span",{children:ae}),n.jsx("button",{type:"button",className:"cheng-dt-edit__retry-btn",onClick:()=>{K("ready"),ee(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-edit__stream-info",children:[n.jsxs("div",{className:"cheng-dt-edit__stream-info-header",children:[n.jsx("div",{className:"cheng-dt-edit__stream-info-label",children:"Stream Mode"}),n.jsxs("div",{className:"cheng-dt-edit__stream-status-row",children:[n.jsx("span",{className:`cheng-dt-edit__status-dot ${Q?"cheng-dt-edit__status-dot--active":te==="error"||le==="error"?"cheng-dt-edit__status-dot--error":"cheng-dt-edit__status-dot--idle"}`}),n.jsx("span",{className:"cheng-dt-edit__stream-status-text",children:_e})]})]}),ue&&n.jsxs("div",{className:"cheng-dt-edit__stream-meta",children:["Last event: ",n.jsx("strong",{children:O(ue)})]}),u?.lastError&&n.jsx("div",{className:"cheng-dt-edit__stream-warn cheng-dt-edit__stream-warn--error",children:u.lastError}),te==="degraded"&&!u?.lastError&&n.jsxs("div",{className:"cheng-dt-edit__stream-warn",children:["Worker stopped unexpectedly. Provide credentials below and click"," ",n.jsx("strong",{children:"Save & Reconnect"})," to restart the stream."]})]}),n.jsxs("div",{className:"cheng-dt-edit__grid",children:[n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("select",{className:"cheng-dt-edit__input cheng-dt-edit__input--select",value:z,onChange:N=>V(N.target.value),disabled:D,required:!0,children:s.map(N=>n.jsx("option",{value:N.id,children:N.name},N.id))}),F&&M&&n.jsxs("div",{className:"cheng-dt-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:P?.name??"current agent"})," to"," ",n.jsx("strong",{children:M.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client ID"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration. Update only if the app changed."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:E,onChange:N=>G(N.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:D,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Robot Code"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:j,onChange:N=>B(N.target.value),placeholder:"dingxxxxxx",disabled:D,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client Secret"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Leave blank to keep the existing secret. Fill to rotate credentials or restart the stream."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("input",{className:"cheng-dt-edit__input cheng-dt-edit__input--token",type:"password",value:W,onChange:N=>U(N.target.value),placeholder:"(leave blank to keep current)",disabled:D,autoComplete:"off"}),ie&&n.jsx("div",{className:"cheng-dt-edit__test-ok",children:ie}),n.jsx("div",{className:"cheng-dt-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--secondary",disabled:!g||!M||D||$,onClick:()=>{S(!1)},children:$?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner cheng-dt-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]})]}),!g&&n.jsxs("div",{className:"cheng-dt-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Client ID + Client Secret + Robot Code to restart the stream worker. Leave them blank to only update the agent."]}),n.jsxs("div",{className:"cheng-dt-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--ghost",onClick:y,disabled:D,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-edit__btn cheng-dt-edit__btn--connect",disabled:!T,children:D?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner"}),"Saving..."]}):g?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:hd})]})}const hd=`
  .cheng-dt-edit {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* Success state */
  .cheng-dt-edit__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }
  .cheng-dt-edit__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #1677ff18;
    color: #1677ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cheng-dt-edit__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }
  .cheng-dt-edit__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  /* Error banner */
  .cheng-dt-edit__error-banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #b5333310;
    border: 1px solid #b5333328;
    border-radius: 8px;
    color: #b53333;
    font-size: 13px;
    line-height: 1.5;
  }
  .cheng-dt-edit__retry-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    background: transparent !important;
    border: 1px solid #b53333 !important;
    border-radius: 6px;
    color: #b53333 !important;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
  }

  /* Stream info (read-only) */
  .cheng-dt-edit__stream-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    background: #1677ff0a;
    border: 1px solid #1677ff22;
    border-radius: 8px;
  }
  .cheng-dt-edit__stream-info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .cheng-dt-edit__stream-info-label {
    font-size: 11px;
    font-weight: 700;
    color: #1677ff;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .cheng-dt-edit__stream-status-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #141413;
    font-weight: 500;
  }
  .cheng-dt-edit__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .cheng-dt-edit__status-dot--active {
    background: #1677ff;
    box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.2);
  }
  .cheng-dt-edit__status-dot--error {
    background: #b53333;
    box-shadow: 0 0 0 3px rgba(181, 51, 51, 0.2);
  }
  .cheng-dt-edit__status-dot--idle {
    background: #87867f;
  }
  .cheng-dt-edit__stream-status-text {
    font-size: 12px;
    color: #5e5d59;
    text-transform: capitalize;
  }
  .cheng-dt-edit__stream-meta {
    font-size: 12px;
    color: #87867f;
  }
  .cheng-dt-edit__stream-meta strong { color: #5e5d59; }
  .cheng-dt-edit__stream-warn {
    padding: 7px 10px;
    background: #f5a62312;
    border: 1px solid #f5a62330;
    border-radius: 6px;
    font-size: 12px;
    color: #7a5c00;
    line-height: 1.4;
  }
  .cheng-dt-edit__stream-warn--error {
    background: #b5333310;
    border-color: #b5333328;
    color: #b53333;
  }

  /* Credentials hint */
  .cheng-dt-edit__creds-hint {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    background: #f5f3ec;
    border: 1px solid #ddd8cc;
    border-radius: 8px;
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }
  .cheng-dt-edit__creds-hint svg { flex-shrink: 0; margin-top: 1px; color: #87867f; }

  /* Grid */
  .cheng-dt-edit__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 600px) {
    .cheng-dt-edit__grid { grid-template-columns: 1fr; }
  }

  /* Card */
  .cheng-dt-edit__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px;
    background: #fffdf8;
    border: 1px solid #ece7db;
    border-radius: 16px;
  }
  .cheng-dt-edit__card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-dt-edit__card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #141413;
  }
  .cheng-dt-edit__card-tip {
    font-size: 12px;
    line-height: 1.45;
    color: #6d6a63;
  }

  /* Field */
  .cheng-dt-edit__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cheng-dt-edit__notice {
    padding: 8px 12px;
    background: #fff8e8;
    border: 1px solid #f0d080;
    border-radius: 7px;
    font-size: 12px;
    color: #7a5c00;
    line-height: 1.45;
  }

  /* Input */
  .cheng-dt-edit__input {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #d9d3c7;
    border-radius: 10px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .cheng-dt-edit__input:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.14);
    background: #ffffff;
  }
  .cheng-dt-edit__input:disabled { background: #f3f1ea; color: #87867f; cursor: not-allowed; }
  .cheng-dt-edit__input--select { appearance: auto; cursor: pointer; }
  .cheng-dt-edit__input--token {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  /* Test result */
  .cheng-dt-edit__test-ok {
    padding: 8px 12px;
    background: #1677ff0e;
    border: 1px solid #1677ff28;
    border-radius: 7px;
    font-size: 12px;
    color: #1677ff;
    line-height: 1.4;
  }
  .cheng-dt-edit__card-actions { display: flex; gap: 8px; }

  /* Footer */
  .cheng-dt-edit__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 4px;
  }

  /* Buttons */
  .cheng-dt-edit__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .cheng-dt-edit__btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .cheng-dt-edit .cheng-dt-edit__btn--connect {
    background: #1677ff !important;
    color: #ffffff !important;
    border: 1px solid #1677ff !important;
  }
  .cheng-dt-edit .cheng-dt-edit__btn--connect:hover:not(:disabled) {
    background: #0958d9 !important;
    border-color: #0958d9 !important;
  }
  .cheng-dt-edit .cheng-dt-edit__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }
  .cheng-dt-edit . cheng-dt-edit__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
  }
  .cheng-dt-edit . cheng-dt-edit__btn--secondary {
    background: #fffdf8 !important;
    color: #1677ff !important;
    border: 1px solid rgba(22, 119, 255, 0.28) !important;
    font-size: 12px;
    padding: 8px 14px;
    font-weight: 500;
  }
  .cheng-dt-edit . cheng-dt-edit__btn--secondary:hover:not(:disabled) {
    background: rgba(22, 119, 255, 0.07) !important;
    border-color: #1677ff !important;
  }

  /* Spinner */
  .cheng-dt-edit__spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-dt-edit-spin 0.65s linear infinite;
    flex-shrink: 0;
  }
  .cheng-dt-edit__spinner--dark {
    border-color: rgba(22, 119, 255, 0.2);
    border-top-color: #1677ff;
  }
  @keyframes cheng-dt-edit-spin { to { transform: rotate(360deg); } }

  @media (max-width: 760px) {
    .cheng-dt-edit__footer { flex-direction: column-reverse; align-items: stretch; }
    .cheng-dt-edit__btn { width: 100%; justify-content: center; }
  }
`;function Xn({title:l,description:s,icon:c,iconLabel:u,iconColor:f,onClose:p,children:m}){return n.jsx("div",{className:"cheng-page__dialog-overlay",onClick:p,children:n.jsxs("div",{className:"cheng-page__dialog",onClick:y=>y.stopPropagation(),children:[n.jsxs("div",{className:"cheng-page__dialog-header",children:[n.jsx("div",{className:"cheng-page__dialog-icon",style:{background:`${f}20`},children:n.jsx("span",{role:"img","aria-label":u,style:{fontSize:"20px"},children:c})}),n.jsxs("div",{className:"cheng-page__dialog-copy",children:[n.jsx("h2",{className:"cheng-page__form-card-title",children:l}),n.jsx("p",{className:"cheng-page__form-card-desc",children:s})]}),n.jsx("button",{type:"button",className:"cheng-page__applink-close-btn",onClick:p,children:"Close"})]}),n.jsx("div",{className:"cheng-page__dialog-body",children:m})]})})}function $h({activePlatform:l,platforms:s,isCreateModalOpen:c,onCloseCreate:u,editingChannel:f,onCloseEdit:p,agents:m,onCreate:y,onUpdate:k,onRefresh:w,apiBaseUrl:R,onGoToAgents:z,liveStatusMap:V}){const E=f?s.find(J=>J.id===f.appType)??{id:f.appType??"custom",label:f.appType??"App",shortLabel:f.appType??"App",emoji:"⚙️",color:"#c96442",desc:""}:null,G=h.useCallback(J=>{u(),w()},[u,w]),j=h.useCallback(J=>{w()},[w]),B=h.useCallback(J=>{w()},[w]),W=h.useCallback(J=>{w()},[w]),U=h.useCallback(J=>{w()},[w]);return n.jsxs(n.Fragment,{children:[c&&l.id==="telegram"&&n.jsx(Xn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:u,children:n.jsx(jh,{agents:m,onCreate:y,apiBaseUrl:R,onPaired:G,onRefresh:w,onGoToAgents:()=>{u(),z()},onCancel:u},"telegram-pairing")}),c&&l.id==="whatsapp"&&n.jsx(Xn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:u,children:n.jsx(Ih,{agents:m,onCreate:y,apiBaseUrl:R,onPaired:j,onRefresh:w,onGoToAgents:()=>{u(),z()},onCancel:u},"whatsapp-pairing")}),c&&l.id==="slack"&&n.jsx(Xn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:u,children:n.jsx(zh,{agents:m,onCreate:y,apiBaseUrl:R,onPaired:B,onRefresh:w,onGoToAgents:()=>{u(),z()},onCancel:u},"slack-pairing")}),c&&l.id==="dingtalk"&&n.jsx(Xn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:u,children:n.jsx(Oh,{agents:m,onCreate:y,apiBaseUrl:R,onPaired:U,onRefresh:w,onGoToAgents:()=>{u(),z()},onCancel:u},"dingtalk-pairing")}),c&&l.id==="wecom"&&n.jsx(Xn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:u,children:n.jsx(Ph,{agents:m,onCreate:y,apiBaseUrl:R,onPaired:W,onRefresh:w,onGoToAgents:()=>{u(),z()},onCancel:u},"wecom-pairing")}),f&&E&&n.jsxs(Xn,{title:`编辑 ${f.name}`,description:`@${f.channelId} · ${E.label}`,icon:E.emoji,iconLabel:f.appType??"app",iconColor:E.color,onClose:p,children:[f.appType==="telegram"&&n.jsx(Sh,{channel:f,agents:m,apiBaseUrl:R,onUpdate:k,onRefresh:w,onSaved:()=>{w(),p()},onCancel:p},`${f.id}-tg-edit`),f.appType==="whatsapp"&&n.jsx(Eh,{channel:f,agents:m,apiBaseUrl:R,onUpdate:k,onRefresh:w,onSaved:()=>{w(),p()},onCancel:p},`${f.id}-wa-edit`),f.appType==="slack"&&n.jsx(Lh,{channel:f,agents:m,apiBaseUrl:R,onUpdate:k,onRefresh:w,onSaved:()=>{w(),p()},onCancel:p},`${f.id}-sl-edit`),f.appType==="dingtalk"&&n.jsx(Uh,{channel:f,agents:m,apiBaseUrl:R,liveStatus:V?.[f.id],onUpdate:k,onRefresh:w,onSaved:()=>{w(),p()},onCancel:p},`${f.id}-dt-edit`),f.appType==="wecom"&&n.jsx(Dh,{channel:f,agents:m,apiBaseUrl:R,onUpdate:k,onRefresh:w,onSaved:()=>{w(),p()},onCancel:p},`${f.id}-wc-edit`)]})]})}const Yn=[{id:"whatsapp",label:"WhatsApp",shortLabel:"WA",emoji:"💬",color:"#25d366",desc:"Meta WhatsApp Business"},{id:"telegram",label:"Telegram",shortLabel:"TG",emoji:"✈️",color:"#2ca5e0",desc:"Telegram Bot API"},{id:"slack",label:"Slack",shortLabel:"Slack",emoji:"💼",color:"#4a154b",desc:"Slack Workspace App"},{id:"wecom",label:"WeCom",shortLabel:"WeCom",emoji:"🏢",color:"#248067",desc:"WeCom Custom App"},{id:"dingtalk",label:"DingTalk",shortLabel:"DT",emoji:"💠",color:"#1677ff",desc:"DingTalk App Bot"},{id:"line",label:"LINE",shortLabel:"LINE",emoji:"🟢",color:"#00c300",desc:"LINE Messaging API"},{id:"custom",label:"Custom",shortLabel:"Custom",emoji:"⚙️",color:"#c96442",desc:"Custom integration"}];function xd(){return n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}function _d(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M12 2l2.4 2.4H18v3.6L20.4 12 18 16v3.6h-3.6L12 22l-2.4-2.4H6V16L3.6 12 6 8V4.4h3.6z"}),n.jsx("circle",{cx:"12",cy:"12",r:"2.5"})]})}function Bh(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]})}function Vh(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"3"}),n.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}function Kh(){return n.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),n.jsx("polyline",{points:"16 17 21 12 16 7"}),n.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})}function Hh({channels:l,activeChannel:s,activeConfig:c,isLoading:u,onSelectChannel:f,onCreateClick:p,chatWindowProps:m={}}){const[y,k]=h.useState(!1),[w,R]=h.useState([]),[z,V]=h.useState(null),E=h.useMemo(()=>s?new gd(s.channelId):null,[s]),G=h.useCallback(()=>{if(!E){R([]),V(null);return}let $=E.listSessions();$.length===0&&($=[E.createSession("新会话")]),R($),V(E.getActiveSessionId())},[E]);h.useEffect(()=>{G()},[G]),h.useEffect(()=>{if(typeof window>"u"||!s)return;const $=X=>{X.detail?.channelId===s.channelId&&G()};return window.addEventListener("cheng:session-label-updated",$),()=>{window.removeEventListener("cheng:session-label-updated",$)}},[s,G]);const j=h.useCallback(()=>{E&&(E.createSession("新会话"),G())},[G,E]),B=h.useCallback($=>{E&&(E.setActiveSessionId($.id),G())},[G,E]),W=h.useCallback($=>{E&&(E.deleteSession($),G())},[G,E]),U=h.useCallback(($,X)=>{E&&(E.renameSession($,X),G())},[G,E]),J=h.useCallback($=>{E&&(E.togglePinSession($),G())},[G,E]),K=h.useMemo(()=>z?{...c,sessionId:z}:c,[c,z]);return n.jsxs("div",{className:"cheng-shell__chat-view",children:[n.jsxs("div",{className:`cheng-shell__channel-sidebar${y?" cheng-shell__channel-sidebar--collapsed":""}`,children:[!y&&n.jsx("div",{className:"cheng-shell__channel-sidebar-content",children:n.jsx(bh,{sessions:w,activeSessionId:z,onSelect:B,onCreateClick:j,onDeleteSession:W,onRenameSession:U,onTogglePinSession:J})}),n.jsx("button",{className:"cheng-shell__channel-sidebar-toggle cheng-shell__channel-sidebar-toggle--edge",onClick:()=>k($=>!$),type:"button","aria-label":y?"Expand agents sidebar":"Collapse agents sidebar",title:y?"Expand agents sidebar":"Collapse agents sidebar",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:y?n.jsx("path",{d:"M6 3L10 8L6 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}):n.jsx("path",{d:"M10 3L6 8L10 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),n.jsx("div",{className:"cheng-shell__chat-area",children:u&&!s?n.jsx("div",{className:"cheng-shell__placeholder",children:n.jsx("span",{className:"cheng-shell__placeholder-text",children:"Loading channels..."})}):s&&s.workspaceId?n.jsx(Vp,{config:K,children:n.jsx(uh,{...m,channels:l,activeChannelId:s?.id??null,activeChannel:s,onSelectChannel:f})},`${s.channelId}:${s.workspaceId}`):n.jsxs("div",{className:"cheng-shell__placeholder",children:[n.jsx("div",{className:"cheng-shell__placeholder-icon",children:n.jsx(xd,{})}),n.jsx("p",{className:"cheng-shell__placeholder-text",children:"No channels yet."}),n.jsx("button",{className:"cheng-shell__placeholder-btn",onClick:p,type:"button",children:"Create your first channel"})]})})]})}function Gh(l){if(!l)return"Unknown";const s=new Date(l);return Number.isNaN(s.getTime())?l:s.toLocaleDateString("zh-CN",{year:"numeric",month:"short",day:"numeric"})}function Qh(l){const s=l.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Xh({channels:l,onCreateClick:s,onEditClick:c,onDeleteClick:u,workspaceNames:f,workflowNames:p}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"Agents"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your agent roster, review workflow bindings, and launch any configured agent."})]}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:s,children:"Create Agent"})]}),n.jsx("div",{className:"cheng-page__content",children:l.length===0?n.jsxs("div",{className:"cheng-page__empty-card",children:[n.jsx("div",{className:"cheng-page__empty-icon",children:n.jsx(_d,{})}),n.jsx("h2",{className:"cheng-page__empty-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-page__empty-desc",children:"Create your first agent to bind a workflow and start handling conversations."}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:s,children:"Create Agent"})]}):n.jsx("div",{className:"cheng-page__channel-grid",children:l.map(m=>n.jsxs("div",{className:"cheng-page__channel-card",children:[n.jsxs("div",{className:"cheng-page__channel-card-top",children:[n.jsx("div",{className:"cheng-page__channel-card-icon",children:n.jsx("span",{className:"cheng-page__channel-card-avatar","aria-hidden":"true",children:Qh(m)})}),n.jsxs("div",{className:"cheng-page__channel-card-actions",children:[n.jsx("span",{className:"cheng-page__channel-card-badge",children:m.appType||"agent"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-edit",onClick:()=>c(m),children:"Edit"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-delete",onClick:()=>{u(m)},children:"Delete"})]})]}),n.jsxs("div",{className:"cheng-page__channel-card-body",children:[n.jsx("h2",{className:"cheng-page__channel-card-title",children:m.name}),n.jsxs("p",{className:"cheng-page__channel-card-id",children:["@",m.channelId]}),n.jsx("p",{className:"cheng-page__channel-card-desc",children:m.description||"No description yet. Open chat to interact with this agent."})]}),n.jsxs("div",{className:"cheng-page__channel-card-workflow",children:[n.jsxs("span",{className:"cheng-page__channel-card-detail",title:f[m.workspaceId]?`Workspace ID: ${m.workspaceId}`:m.workspaceId,children:["Workspace: ",f[m.workspaceId]||m.workspaceId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",title:p[m.boundWorkflowId]?`Workflow ID: ${m.boundWorkflowId}`:m.boundWorkflowId,children:["Workflow: ",p[m.boundWorkflowId]||m.boundWorkflowId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",children:["Created: ",Gh(m.createdAt)]})]})]},m.id||m.channelId))})})]})}function Yh({channels:l,onCreate:s,onUpdate:c,onDelete:u,onRefresh:f,apiBaseUrl:p,onSuccess:m,onGoToAgents:y}){const[k,w]=h.useState("telegram"),[R,z]=h.useState(""),[V,E]=h.useState(!1),[G,j]=h.useState(null),[B,W]=h.useState(null),[U,J]=h.useState({}),K=h.useRef(null),$=h.useCallback(()=>(K.current||(K.current=new tt(p,new Ke(p))),K.current),[p]),X=h.useMemo(()=>new Set(["telegram","whatsapp","slack","wecom","dingtalk"]),[]),ie=h.useMemo(()=>l.filter(v=>!v.appType||v.appType==="agent"),[l]),se={degraded:0,error:1,awaiting_input:2,connecting:3,active:4,disconnected:5},ae=h.useMemo(()=>l.filter(v=>v.appType&&v.appType!=="agent").sort((v,D)=>{const T=se[v.connectionState??""]??6,O=se[D.connectionState??""]??6;return T!==O?T-O:(D.updatedAt??D.createdAt??"").localeCompare(v.updatedAt??v.createdAt??"")}),[l]);h.useEffect(()=>{Yn.some(D=>D.id===k)||w(ae[0]?.appType??"telegram")},[ae,k]);const ee=Yn.find(v=>v.id===k)??Yn[1],le=h.useMemo(()=>Yn.map(v=>{const D=ae.filter(N=>N.appType===v.id),T=D.filter(N=>N.connectionState==="active").length,O=D.filter(N=>N.connectionState==="awaiting_input"||N.connectionState==="connecting"||N.connectionState==="configuring").length;return{platform:v,total:D.length,connectedCount:T,pendingCount:O}}),[ae]),ue=h.useMemo(()=>{const v=R.trim().toLowerCase();return ae.filter(D=>D.appType!==ee.id?!1:v?[D.name,D.channelId,D.description,D.webhookUrl,D.connectionState].filter(Boolean).join(" ").toLowerCase().includes(v):!0)},[ee.id,ae,R]),te=ae.filter(v=>v.appType===ee.id).length,_e=h.useMemo(()=>Object.fromEntries(ae.map(v=>{const D=ie.find(T=>T.workspaceId===v.workspaceId&&T.boundWorkflowId===v.boundWorkflowId);return[v.id,D?.name??"未绑定 Agent"]})),[ie,ae]),Q=h.useCallback(v=>{switch(v){case"active":return{label:"运行中",cls:"cheng-applink__badge--active"};case"degraded":return{label:"异常",cls:"cheng-applink__badge--degraded"};case"configuring":return{label:"待回调",cls:"cheng-applink__badge--configuring"};case"connecting":case"awaiting_input":return{label:"待配置",cls:"cheng-applink__badge--pending"};case"error":return{label:"失败",cls:"cheng-applink__badge--error"};case"disconnected":return{label:"已断开",cls:"cheng-applink__badge--disconnected"};default:return{label:"未配置",cls:"cheng-applink__badge--default"}}},[]),ne=h.useCallback(v=>{if(!v)return"—";const D=new Date(v);return Number.isNaN(D.getTime())?v:D.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},[]),A=h.useCallback(v=>{w(v),z("")},[]),M=h.useCallback(()=>{E(!1)},[]),P=h.useCallback(async v=>{W({channelId:v.id,action:"refresh"});try{const D=await $().getChannelStatus(v.workspaceId,v.id);J(T=>({...T,[v.id]:D})),await f()}finally{W(null)}},[$,f]),F=h.useCallback(async v=>{if(window.confirm(`确定要暂停 ${v.name} 的连接吗？这会断开当前平台连接。`)){W({channelId:v.id,action:"pause"});try{await $().disconnectChannel(v.workspaceId,v.id),J(T=>{const O={...T};return delete O[v.id],O}),await f()}finally{W(null)}}},[$,f]),g=h.useCallback(async v=>{W({channelId:v.id,action:"resume"});try{await $().connectChannel(v.workspaceId,v.id),J(D=>{const T={...D};return delete T[v.id],T}),await f()}finally{W(null)}},[$,f]),S=h.useCallback(async v=>{if(window.confirm(`确定删除 ${v.name} 吗？删除后需要重新创建连接。`)){W({channelId:v.id,action:"delete"});try{await Promise.resolve(u(v.id)),J(T=>{const O={...T};return delete O[v.id],O}),await f(),G?.id===v.id&&j(null)}finally{W(null)}}},[G?.id,u,f]);return n.jsxs("div",{className:"cheng-page cheng-applink",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"App Link 管理"}),n.jsx("p",{className:"cheng-page__subtitle",children:"管理各平台接入连接，查看运行状态，按平台筛选并操作。"})]}),n.jsxs("button",{type:"button",className:"cheng-applink__refresh-btn",onClick:()=>{f()},"aria-label":"刷新列表",title:"刷新列表",children:[n.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]}),"刷新"]})]}),n.jsxs("div",{className:"cheng-applink__body",children:[n.jsx("div",{className:"cheng-applink__platforms",children:le.map(({platform:v,total:D,connectedCount:T})=>{const O=v.id===ee.id,N=X.has(v.id);return n.jsxs("button",{type:"button",className:`cheng-applink__platform-card${O?" cheng-applink__platform-card--active":""}${N?"":" cheng-applink__platform-card--disabled"}`,onClick:()=>A(v.id),style:O?{borderColor:v.color}:{},children:[n.jsx("span",{className:"cheng-applink__platform-icon",style:{background:`${v.color}18`,color:v.color},role:"img","aria-label":v.label,children:v.emoji}),n.jsx("span",{className:"cheng-applink__platform-label",children:v.label}),!N&&n.jsx("span",{className:"cheng-applink__platform-soon",children:"Soon"}),N&&n.jsx("span",{className:`cheng-applink__platform-count${T>0?" cheng-applink__platform-count--active":""}`,children:D})]},v.id)})}),n.jsxs("div",{className:"cheng-applink__board",children:[n.jsxs("div",{className:"cheng-applink__board-header",children:[n.jsxs("div",{className:"cheng-applink__board-heading",children:[n.jsxs("h2",{className:"cheng-applink__board-title",children:[ee.shortLabel," 列表"]}),n.jsx("span",{className:"cheng-applink__board-count",children:te})]}),n.jsxs("div",{className:"cheng-applink__board-actions",children:[n.jsxs("label",{className:"cheng-applink__search",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"11",cy:"11",r:"7",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("path",{d:"M20 20l-3.5-3.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),n.jsx("input",{type:"search",value:R,onChange:v=>z(v.target.value),placeholder:`搜索 ${ee.shortLabel} 名称、ID...`})]}),n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>E(!0),disabled:!X.has(ee.id),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",ee.shortLabel]})]})]}),ue.length>0?n.jsx("div",{className:"cheng-applink__table-wrap",children:n.jsxs("table",{className:"cheng-applink__table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"连接名称"}),n.jsx("th",{children:"状态"}),n.jsx("th",{children:"绑定 Agent"}),n.jsx("th",{children:"Webhook / 描述"}),n.jsx("th",{children:"更新时间"}),n.jsx("th",{children:"操作"})]})}),n.jsx("tbody",{children:ue.map(v=>{const D=U[v.id],T=D?.connectionState??v.connectionState,O=Q(T),N=Yn.find(Ne=>Ne.id===v.appType)??ee,re=B?.channelId===v.id,xe=_e[v.id]??"未绑定 Agent",H=B?.channelId===v.id&&B.action==="refresh",fe=T==="disconnected";return n.jsxs("tr",{className:"cheng-applink__row",children:[n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--name",children:[n.jsx("div",{className:"cheng-applink__row-icon",style:{background:`${N.color}16`,color:N.color},children:n.jsx("span",{role:"img","aria-label":N.label,children:N.emoji})}),n.jsxs("div",{className:"cheng-applink__row-copy",children:[n.jsx("strong",{children:v.name}),n.jsxs("span",{children:["@",v.channelId]})]})]}),n.jsx("td",{className:"cheng-applink__cell",children:n.jsx("span",{className:`cheng-applink__badge ${O.cls}`,children:O.label})}),n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--meta",children:[n.jsx("span",{children:xe}),v.boundWorkflowId&&n.jsxs("small",{children:["Workflow: ",v.boundWorkflowId]})]}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--endpoint",children:v.appType==="dingtalk"?n.jsxs("div",{className:"cheng-applink__stream-cell",children:[n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--stream",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),(D?.lastEventAt??D?.lastError)&&n.jsx("span",{className:"cheng-applink__stream-meta",children:D.lastError?n.jsxs("span",{className:"cheng-applink__stream-error",title:D.lastError,children:["⚠ ",D.lastError.slice(0,40),D.lastError.length>40?"…":""]}):D?.lastEventAt?n.jsxs(n.Fragment,{children:["最近事件 ",ne(D.lastEventAt)]}):null})]}):v.appType==="slack"&&v.connectionConfig?.connection_mode==="socket_mode"?n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--socket",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]}):n.jsx("span",{title:v.webhookUrl||v.description||"",children:v.webhookUrl||v.description||"—"})}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--time",children:ne(v.updatedAt??v.createdAt)}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--actions",children:n.jsxs("div",{className:"cheng-applink__row-actions",children:[fe?n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"恢复连接",title:"恢复连接",onClick:()=>{g(v)},disabled:re,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 6.5v11l9-5.5-9-5.5Z",fill:"currentColor"})})}):n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"暂停连接",title:"暂停连接",onClick:()=>{F(v)},disabled:re,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M9 5H7v14h2V5Zm8 0h-2v14h2V5Z",fill:"currentColor"})})}),n.jsx("button",{type:"button",className:`cheng-applink__icon-btn${H?" cheng-applink__icon-btn--spinning":""}`,"aria-label":"刷新状态",title:"刷新状态",onClick:()=>{P(v)},disabled:re,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"编辑连接",title:"编辑连接",onClick:()=>j(v),children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M12 20h9",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn cheng-applink__icon-btn--danger","aria-label":"删除连接",title:"删除连接",onClick:()=>{S(v)},disabled:re,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M3 6h18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M8 6V4h8v2",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M19 6l-1 14H6L5 6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M10 11v5M14 11v5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]})})]})})]},v.id||v.channelId)})})]})}):n.jsxs("div",{className:"cheng-applink__empty",children:[n.jsx("div",{className:"cheng-applink__empty-icon",children:n.jsx("span",{role:"img","aria-label":ee.label,style:{fontSize:28},children:ee.emoji})}),n.jsxs("p",{className:"cheng-applink__empty-title",children:[ee.shortLabel," 暂无连接"]}),n.jsx("p",{className:"cheng-applink__empty-desc",children:R?`没有匹配 "${R}" 的连接`:`当前还没有 ${ee.label} 接入连接`}),!R&&X.has(ee.id)&&n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>E(!0),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",ee.shortLabel]})]})]})]}),n.jsx($h,{activePlatform:ee,platforms:Yn,isCreateModalOpen:V,onCloseCreate:M,editingChannel:G,onCloseEdit:()=>j(null),agents:ie,onCreate:s,onUpdate:c,onRefresh:f,apiBaseUrl:p,onGoToAgents:y,liveStatusMap:U})]})}function qh({onLogout:l}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header",children:[n.jsx("h1",{className:"cheng-page__title",children:"Settings"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your account and preferences."})]}),n.jsx("div",{className:"cheng-page__content",children:n.jsx("div",{className:"cheng-page__settings-card",children:n.jsxs("div",{className:"cheng-page__settings-section",children:[n.jsx("h2",{className:"cheng-page__settings-section-title",children:"Account"}),n.jsx("p",{className:"cheng-page__settings-section-desc",children:"You are currently logged in. Click below to sign out of your account."}),n.jsxs("button",{type:"button",className:"cheng-page__logout-btn",onClick:l,children:[n.jsx(Kh,{}),"Sign Out"]})]})})})]})}function Jh({channels:l,activeChannel:s,activeConfig:c,isLoading:u,onSelectChannel:f,onCreateChannel:p,onUpdateChannel:m,onDeleteChannel:y,onLogout:k,onRefreshChannels:w,apiBaseUrl:R,chatWindowProps:z={}}){const[V,E]=h.useState("chat"),[G,j]=h.useState(!1),[B,W]=h.useState(null),[U,J]=h.useState({}),[K,$]=h.useState({}),X=[{id:"chat",label:"Chat",icon:n.jsx(xd,{})},{id:"channel",label:"Agents",icon:n.jsx(_d,{})},{id:"applink",label:"App Links",icon:n.jsx(Bh,{})}],ie=()=>{j(!1),W(null),E("channel")},se=()=>{j(!1),W(null)},ae=async ee=>{window.confirm(`确定删除 Agent "${ee.name}" 吗？删除后无法恢复。`)&&(await Promise.resolve(y(ee.id)),B?.id===ee.id&&W(null))};return h.useEffect(()=>{let ee=!1;return(async()=>{if(!R||l.length===0){ee||(J({}),$({}));return}const ue=new Ke(R),te=new tt(R,ue);try{const ne=await te.listWorkspaces();ee||J(Object.fromEntries(ne.map(A=>[A.id,A.name||A.id])))}catch{ee||J({})}const _e=Array.from(new Set(l.map(ne=>ne.boundWorkflowId).filter(ne=>typeof ne=="string"&&ne.trim()))),Q=await Promise.all(_e.map(async ne=>{try{const A=await te.getWorkflowName(ne);return[ne,A||ne]}catch{return[ne,ne]}}));ee||$(Object.fromEntries(Q))})(),()=>{ee=!0}},[R,l]),n.jsxs("div",{className:"cheng-shell",children:[n.jsxs("div",{className:"cheng-shell__sidebar",children:[n.jsx("div",{className:"cheng-shell__logo","aria-label":"ChengOS logo",children:"CO"}),n.jsx("div",{className:"cheng-shell__divider"}),n.jsx("nav",{className:"cheng-shell__nav",children:X.map(ee=>{const le=V===ee.id;return n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${le?" cheng-shell__nav-item--active":""}`,onClick:()=>E(ee.id),"aria-label":ee.label,children:[ee.icon,le&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:ee.label})]},ee.id)})}),n.jsxs("div",{className:"cheng-shell__bottom",children:[n.jsx("div",{className:"cheng-shell__divider"}),n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${V==="settings"?" cheng-shell__nav-item--active":""}`,onClick:()=>E("settings"),"aria-label":"Settings",children:[n.jsx(Vh,{}),V==="settings"&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:"Settings"})]})]})]}),n.jsxs("div",{className:"cheng-shell__main",children:[V==="chat"&&n.jsx(Hh,{channels:l,activeChannel:s,activeConfig:c,isLoading:u,onSelectChannel:f,onCreateClick:()=>E("channel"),chatWindowProps:z}),V==="channel"&&n.jsx(Xh,{channels:l,onCreateClick:()=>j(!0),onEditClick:ee=>W(ee),onDeleteClick:ae,workspaceNames:U,workflowNames:K}),V==="applink"&&n.jsx(Yh,{channels:l,onCreate:p,onUpdate:m,onDelete:y,onRefresh:w??(()=>{}),apiBaseUrl:R,onSuccess:ie,onGoToAgents:()=>E("channel")}),V==="settings"&&n.jsx(qh,{onLogout:k})]}),n.jsx(xh,{isOpen:G||!!B,onClose:se,mode:B?"edit":"create",initialChannel:B,existingChannels:l,onCreate:async ee=>{await p(ee)},onUpdate:async ee=>{await m(ee),ie()},apiBaseUrl:R}),n.jsx("style",{children:Zh})]})}const Zh=`
  /* ── Shell container ── */
  .cheng-shell {
    display: flex;
    width: 100%;
    height: 100%;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
    background: #f5f4ed;
    overflow: hidden;
    isolation: isolate;
  }

  /* ── Icon sidebar (56px) ── */
  .cheng-shell__sidebar {
    position: relative;
    z-index: 40;
    flex-shrink: 0;
    width: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid #f0eee6;
    background: #faf9f5;
    padding: 12px 0;
    overflow: visible;
  }

  .cheng-shell__logo {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #c96442;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    box-shadow: 0 0 0 1px #c96442, rgba(0,0,0,0.08) 0px 6px 16px;
    letter-spacing: 0.6px;
  }

  .cheng-shell__divider {
    width: 32px;
    height: 1px;
    background: #f0eee6;
    margin: 8px 0;
  }

  .cheng-shell__nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
    width: 100%;
    padding: 0 8px;
    overflow: visible;
  }

  .cheng-shell__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 8px;
    overflow: visible;
  }

  /* ── Nav item (40×40) ── */
  .cheng-shell__nav-item {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #5e5d59;
    transition: background 0.15s, color 0.15s, transform 0.15s;
    overflow: visible;
  }

  .cheng-shell__nav-item:hover {
    background: #e8e6dc;
    color: #141413;
    transform: scale(1.05);
  }

  .cheng-shell__nav-item--active {
    background: #f0eee6;
    color: #c96442;
    box-shadow: 0 0 0 1px #d1cfc5;
  }

  .cheng-shell__nav-item--active:hover {
    background: #f0eee6;
    transform: none;
  }

  /* Left indicator bar */
  .cheng-shell__nav-active-bar {
    position: absolute;
    left: -9px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background: #c96442;
    border-radius: 0 3px 3px 0;
  }

  /* Tooltip */
  .cheng-shell__tooltip {
    position: absolute;
    left: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    background: #30302e;
    color: #f5f4ed;
    font-size: 12px;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 6px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s, visibility 0.15s;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .cheng-shell__nav-item:hover .cheng-shell__tooltip,
  .cheng-shell__nav-item:focus-visible .cheng-shell__tooltip {
    opacity: 1;
    visibility: visible;
  }

  /* ── Main content ── */
  .cheng-shell__main {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  /* ── Chat view ── */
  .cheng-shell__chat-view {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .cheng-shell__channel-sidebar {
    flex-shrink: 0;
    width: 220px;
    border-right: 1px solid #f0eee6;
    background: #faf9f5;
    overflow: visible;
    display: flex;
    flex-direction: column;
    transition: width 0.18s ease;
    position: relative;
  }

  .cheng-shell__channel-sidebar--collapsed {
    width: 0;
    border-right-color: transparent;
  }

  .cheng-shell__channel-sidebar-content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .cheng-shell__channel-sidebar-toggle {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #5e5d59;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .cheng-shell__channel-sidebar-toggle:hover {
    background: #e8e6dc;
    color: #141413;
  }

  .cheng-shell__channel-sidebar-toggle--edge {
    position: absolute;
    top: 50%;
    right: -14px;
    transform: translateY(-50%);
    z-index: 3;
    background: #faf9f5;
    border: 1px solid #f0eee6;
    box-shadow: 0 0 0 1px #d1cfc5, rgba(0,0,0,0.06) 0px 4px 12px;
  }

  .cheng-shell__chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    background: #faf9f5;
  }

  .cheng-shell__chat-area .cheng-chat-window {
    flex: 1;
    border-radius: 0;
    border: none;
    box-shadow: none;
    height: 100% !important;
  }

  /* ── Placeholder (empty / loading) ── */
  .cheng-shell__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 12px;
    color: #87867f;
    font-size: 14px;
    background: #faf9f5;
    height: 100%;
  }

  .cheng-shell__placeholder-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #e8e6dc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #87867f;
  }

  .cheng-shell__placeholder-text {
    margin: 0;
    color: #5e5d59;
  }

  .cheng-shell__placeholder-btn {
    padding: 9px 20px;
    background: #c96442;
    color: #faf9f5;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .cheng-shell__placeholder-btn:hover {
    background: #d97757;
  }

  /* ── Page layout (shared by Channel / AppLink / Settings views) ── */
  .cheng-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f4ed;
    overflow: hidden;
  }

  .cheng-page__header {
    flex-shrink: 0;
    padding: 20px 28px;
    border-bottom: 1px solid #f0eee6;
    background: #faf9f5;
  }

  .cheng-page__header--row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .cheng-page__title {
    margin: 0 0 4px;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 25px;
    font-weight: 700;
    line-height: 1.2;
    color: #000000;
  }

  .cheng-page__subtitle {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-page__content {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
  }

  .cheng-page__header-action {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    background: #141413;
    color: #faf9f5;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  }

  .cheng-page__header-action:hover {
    background: #30302e;
    transform: translateY(-1px);
    box-shadow: 0 0 0 1px #30302e, rgba(0,0,0,0.08) 0px 6px 16px;
  }

  .cheng-page__empty-card {
    max-width: 520px;
    padding: 32px;
    background: #faf9f5;
    border: 1px solid #f0eee6;
    border-radius: 18px;
    box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
  }

  .cheng-page__empty-card--slim {
    max-width: none;
    padding: 24px 28px;
  }

  .cheng-page__empty-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #f0eee6;
    color: #d97757;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .cheng-page__empty-title {
    margin: 0 0 8px;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 20px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-page__empty-desc {
    margin: 0 0 20px;
    color: #5e5d59;
    font-size: 14px;
    line-height: 1.6;
  }

  .cheng-page__channel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }

  .cheng-page__channel-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 20px;
    text-align: left;
    background:
      radial-gradient(circle at top right, rgba(201, 100, 66, 0.08), transparent 32%),
      #faf9f5;
    border: 1px solid #f0eee6;
    border-radius: 18px;
    transition: transform 0.16s, box-shadow 0.16s, border-color 0.16s;
    box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
  }

  .cheng-page__channel-card:hover {
    transform: translateY(-2px);
    border-color: #d1cfc5;
    box-shadow: rgba(0,0,0,0.06) 0px 8px 24px;
  }

  .cheng-page__channel-card--active {
    border-color: #d97757;
    box-shadow: 0 0 0 1px #c96442, rgba(0,0,0,0.06) 0px 8px 24px;
  }

  .cheng-page__channel-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .cheng-page__channel-card-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: #f0eee6;
    color: #c96442;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cheng-page__channel-card-avatar {
    font-size: 23px;
    line-height: 1;
  }

  .cheng-page__channel-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cheng-page__channel-card-badge {
    padding: 6px 10px;
    border-radius: 999px;
    background: #e8e6dc;
    color: #4d4c48;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
  }

  .cheng-page__channel-card-edit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid #e8e6dc;
    background: #faf9f5;
    color: #4d4c48;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }

  .cheng-page__channel-card-edit:hover {
    background: #f5f4ed;
    border-color: #d1cfc5;
    color: #141413;
  }

  .cheng-page__channel-card-delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid #e7b7ae;
    background: #f7ebe8;
    color: #b53333;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }

  .cheng-page__channel-card-delete:hover {
    background: #efd3cd;
    border-color: #d99283;
    color: #8f2727;
  }

  .cheng-page__channel-card-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .cheng-page__channel-card-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 18px;
    font-weight: 500;
    color: #141413;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cheng-page__channel-card-id {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    color: #c96442;
  }

  .cheng-page__channel-card-desc {
    margin: 0;
    color: #5e5d59;
    font-size: 13px;
    line-height: 1.55;
    min-height: 36px;
  }

  .cheng-page__channel-card-workflow {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 8px;
    border-top: 1px solid #e8e6dc;
    font-size: 10px;
    line-height: 1.2;
    color: #87867f;
    word-break: break-all;
  }

  .cheng-page__channel-card-detail {
    overflow-wrap: anywhere;
    letter-spacing: 0.01em;
  }

  /* ── Section label ── */
  .cheng-page__section-label {
    font-size: 12px;
    font-weight: 600;
    color: #87867f;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 12px;
  }

  /* ── Platform selector grid ── */
  .cheng-page__platform-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }

  .cheng-page__platform-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 12px;
    background: #faf9f5;
    border: 1.5px solid #f0eee6;
    border-radius: 12px;
    cursor: pointer;
    text-align: center;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
    gap: 6px;
  }

  .cheng-page__platform-card:hover {
    border-color: #e8e6dc;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .cheng-page__platform-card--active {
    box-shadow: 0 0 0 1px #d1cfc5, rgba(0,0,0,0.05) 0px 4px 14px;
  }

  .cheng-page__platform-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #e8e6dc;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .cheng-page__platform-label {
    font-size: 13px;
    font-weight: 600;
    color: #141413;
  }

  .cheng-page__platform-desc {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }

  /* ── Form card ── */
  .cheng-page__form-card {
    background: #faf9f5;
    border: 1px solid #f0eee6;
    border-radius: 14px;
    max-width: 600px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  .cheng-page__form-card--applink {
    margin-top: 4px;
  }

  .cheng-page__form-card-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px 24px;
    border-bottom: 1px solid #e8e6dc;
  }

  .cheng-page__form-card-icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #e8e6dc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c96442;
  }

  .cheng-page__form-card-icon--indigo {
    background: #f0eee6;
    color: #c96442;
  }

  .cheng-page__form-card-title {
    margin: 0 0 4px;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 15px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-page__form-card-desc {
    margin: 0;
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.4;
  }

  .cheng-page__form-card-body {
    padding: 24px;
  }

  /* ── Connected apps list (App Links page) ── */
  .cheng-page__connected-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cheng-page__connected-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: #faf9f5;
    border: 1px solid #f0eee6;
    border-radius: 10px;
    transition: border-color 0.15s, background 0.15s;
  }

  .cheng-page__connected-item:hover {
    border-color: #d1cfc5;
  }

  .cheng-page__connected-item--active {
    border-color: #c96442;
    background: #c9644208;
  }

  .cheng-page__connected-item-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #f0eee6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cheng-page__connected-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .cheng-page__connected-item-name {
    font-size: 13px;
    font-weight: 600;
    color: #141413;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cheng-page__connected-item-type {
    font-size: 12px;
    color: #87867f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cheng-page__conn-badge {
    flex-shrink: 0;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }

  .cheng-page__conn-badge--active {
    background: #25d36615;
    color: #1a9e4a;
  }

  .cheng-page__conn-badge--degraded {
    background: #e6a81715;
    color: #b8860b;
  }

  .cheng-page__conn-badge--pending {
    background: #2ca5e015;
    color: #2ca5e0;
  }

  .cheng-page__conn-badge--error {
    background: #b5333315;
    color: #b53333;
  }

  .cheng-page__conn-badge--disconnected {
    background: #87867f15;
    color: #87867f;
  }

  .cheng-page__conn-badge--default {
    background: #f0eee6;
    color: #87867f;
  }

  .cheng-page__connected-item-manage {
    flex-shrink: 0;
    padding: 5px 12px;
    background: transparent;
    border: 1px solid #d1cfc5;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #5e5d59;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .cheng-page__connected-item-manage:hover {
    background: #f0eee6;
    color: #141413;
  }

  /* ── App Link page ── */
  .cheng-applink {
    background: #f5f4ed;
  }

  .cheng-applink__refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: 9px;
    background: #faf9f5;
    border: 1px solid #d9d3c7;
    color: #5e5d59;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.14s, color 0.14s, border-color 0.14s;
    flex-shrink: 0;
  }

  .cheng-applink__refresh-btn:hover {
    background: #f0eee6;
    color: #141413;
    border-color: #cfc7b8;
  }

  .cheng-applink__body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Platform cards strip — 小图标长条 */
  .cheng-applink__platforms {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    width: 100%;
    overflow-x: visible;
    padding: 2px 2px 4px;
  }

  button.cheng-applink__platform-card {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-width: 0;
    min-height: 99px;
    padding: 10px 14px;
    border-radius: 18px;
    background: #faf9f5;
    border: 1px solid #e8e6dc;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(20, 20, 19, 0.06);
    transition: transform 0.14s, background 0.14s, border-color 0.14s, box-shadow 0.14s;
    white-space: nowrap;
    flex-shrink: 0;
    text-align: center;
  }

  button.cheng-applink__platform-card:hover:not(:disabled) {
    background: #f0eee6;
    border-color: #d1cfc5;
    box-shadow: 0 6px 14px rgba(20, 20, 19, 0.1);
    transform: translateY(-1px);
  }

  button.cheng-applink__platform-card--active {
    background: #f0eee6 !important;
    box-shadow: 0 0 0 1.5px currentColor, 0 6px 14px rgba(20, 20, 19, 0.12);
  }

  button.cheng-applink__platform-card--disabled {
    opacity: 0.55;
    cursor: default;
  }

  .cheng-applink__platform-icon {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 27px;
    flex-shrink: 0;
  }

  .cheng-applink__platform-label {
    order: 3;
    font-size: 15px;
    font-weight: 700;
    color: #000000;
  }

  .cheng-applink__platform-soon {
    order: 4;
    align-self: center;
    font-size: 10px;
    font-weight: 700;
    color: #87867f;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: #f0eee6;
    padding: 2px 6px;
    border-radius: 999px;
  }

  .cheng-applink__platform-count {
    order: 2;
    margin-top: 1px;
    font-size: 18px;
    line-height: 1;
    font-weight: 700;
    color: #141413;
    background: transparent;
    padding: 0;
    border-radius: 0;
  }

  .cheng-applink__platform-count--active {
    color: #141413;
    background: transparent;
  }

  /* Main board */
  .cheng-applink__board {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #faf9f5;
    border: 1px solid #e8e6dc;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .cheng-applink__board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid #f0eee6;
  }

  .cheng-applink__board-heading {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cheng-applink__board-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #141413;
  }

  .cheng-applink__board-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: 999px;
    background: #e8e6dc;
    color: #5e5d59;
    font-size: 12px;
    font-weight: 600;
  }

  .cheng-applink__board-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cheng-applink__search {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    height: 34px;
    border-radius: 8px;
    background: #f0eee6;
    border: 1px solid #e8e6dc;
    color: #87867f;
    min-width: 220px;
  }

  .cheng-applink__search input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #141413;
  }

  .cheng-applink__search input::placeholder {
    color: #9a968e;
  }

  button.cheng-applink__create-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    background: #141413;
    color: #faf9f5;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.14s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  button.cheng-applink__create-btn:hover:not(:disabled) {
    background: #30302e;
  }

  button.cheng-applink__create-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* Table */
  .cheng-applink__table-wrap {
    overflow-x: auto;
  }

  .cheng-applink__table {
    width: 100%;
    min-width: 820px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .cheng-applink__table thead tr {
    background: #f8f6f0;
    border-bottom: 1px solid #f0eee6;
  }

  .cheng-applink__table thead th {
    padding: 9px 14px;
    font-size: 11px;
    font-weight: 600;
    color: #87867f;
    text-align: left;
    white-space: nowrap;
  }

  .cheng-applink__table thead th:first-child { width: 22%; }
  .cheng-applink__table thead th:nth-child(2) { width: 10%; }
  .cheng-applink__table thead th:nth-child(3) { width: 16%; }
  .cheng-applink__table thead th:nth-child(4) { width: 26%; }
  .cheng-applink__table thead th:nth-child(5) { width: 13%; }
  .cheng-applink__table thead th:last-child { width: 13%; }

  tr.cheng-applink__row {
    border-bottom: 1px solid #f0eee6;
    transition: background 0.12s;
  }

  tr.cheng-applink__row:last-child {
    border-bottom: none;
  }

  tr.cheng-applink__row:hover {
    background: #f8f6f0;
  }

  .cheng-applink__cell {
    padding: 11px 14px;
    font-size: 13px;
    color: #30302e;
    vertical-align: middle;
  }

  .cheng-applink__cell--name {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cheng-applink__row-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
  }

  .cheng-applink__row-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cheng-applink__row-copy strong {
    font-size: 20px;
    font-weight: 600;
    color: #141413;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cheng-applink__row-copy span {
    font-size: 11px;
    color: #87867f;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cheng-applink__cell--meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .cheng-applink__cell--meta span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cheng-applink__cell--meta small {
    font-size: 11px;
    color: #87867f;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cheng-applink__cell--endpoint span {
    display: block;
    color: #4d4c48;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .cheng-applink__cell--time {
    font-size: 12px;
    color: #87867f;
    white-space: nowrap;
  }

  .cheng-applink__cell--actions {
    padding: 8px 14px;
  }

  .cheng-applink__row-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  button.cheng-applink__icon-btn {
    width: 30px;
    height: 30px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: transparent;
    border: 1px solid transparent;
    color: #5e5d59;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s, color 0.12s;
    flex-shrink: 0;
  }

  button.cheng-applink__icon-btn:hover:not(:disabled) {
    background: #f0eee6;
    border-color: #d9d3c7;
    color: #141413;
  }

  button.cheng-applink__icon-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  button.cheng-applink__icon-btn--danger {
    color: #b53333;
  }

  button.cheng-applink__icon-btn--danger:hover:not(:disabled) {
    background: #fff0ee !important;
    border-color: #e7b7ae !important;
    color: #b53333 !important;
  }

  button.cheng-applink__icon-btn--spinning svg {
    animation: cheng-applink-spin 0.7s linear infinite;
  }

  @keyframes cheng-applink-spin {
    to { transform: rotate(360deg); }
  }

  /* Status badges */
  .cheng-applink__badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  .cheng-applink__badge--active {
    background: #25d36618;
    color: #1a9e4a;
  }

  .cheng-applink__badge--degraded {
    background: #e6a81718;
    color: #b8860b;
  }

  .cheng-applink__badge--configuring {
    background: #f5a62318;
    color: #b87400;
  }

  .cheng-applink__badge--pending {
    background: #2ca5e018;
    color: #2ca5e0;
  }

  .cheng-applink__badge--error {
    background: #b5333318;
    color: #b53333;
  }

  .cheng-applink__badge--disconnected {
    background: #87867f18;
    color: #5e5d59;
  }

  .cheng-applink__badge--default {
    background: #e8e6dc;
    color: #87867f;
  }

  /* Connection mode tag (e.g. "Socket Mode" for Slack) */
  .cheng-applink__mode-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .cheng-applink__mode-tag--socket {
    background: #4a154b14;
    color: #4a154b;
    border: 1px solid #4a154b28;
  }
  .cheng-applink__mode-tag--stream {
    background: #1677ff14;
    color: #1677ff;
    border: 1px solid #1677ff28;
  }
  .cheng-applink__stream-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cheng-applink__stream-meta {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }
  .cheng-applink__stream-error {
    color: #b53333;
  }

  /* Empty state */
  .cheng-applink__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 56px 24px;
    color: #87867f;
  }

  .cheng-applink__empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: #f0eee6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cheng-applink__empty-title {
    margin: 4px 0 0;
    font-size: 14px;
    font-weight: 600;
    color: #141413;
  }

  .cheng-applink__empty-desc {
    margin: 0 0 8px;
    font-size: 13px;
    color: #87867f;
  }

  .cheng-page__dialog-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(20, 20, 19, 0.42);
    backdrop-filter: blur(6px);
    z-index: 1200;
  }

  .cheng-page__dialog {
    width: min(860px, 100%);
    max-height: calc(100vh - 80px);
    background: #faf9f5;
    border: 1px solid #e8e6dc;
    border-radius: 20px;
    box-shadow: rgba(0,0,0,0.18) 0px 20px 60px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .cheng-page__dialog-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 24px 28px 20px;
    border-bottom: 1px solid #e8e6dc;
    background:
      radial-gradient(circle at top right, rgba(201, 100, 66, 0.08), transparent 30%),
      #faf9f5;
  }

  .cheng-page__dialog-icon {
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cheng-page__dialog-copy {
    min-width: 0;
    flex: 1;
  }

  .cheng-page__dialog-body {
    overflow-y: auto;
    padding: 24px 28px 28px;
  }

  .cheng-page__management-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .cheng-page__management-section {
    border: 1px solid #f0eee6;
    border-radius: 16px;
    padding: 18px 18px 20px;
    background: #fffdf8;
  }

  .cheng-page__management-section-header {
    margin-bottom: 16px;
  }

  .cheng-page__management-section-title {
    margin: 0 0 6px;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-page__management-section-desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #5e5d59;
  }

  /* ── Settings card ── */
  .cheng-page__settings-card {
    background: #faf9f5;
    border: 1px solid #f0eee6;
    border-radius: 14px;
    max-width: 480px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  .cheng-page__settings-section {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cheng-page__settings-section-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 15px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-page__settings-section-desc {
    margin: 0 0 12px;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-page__logout-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    background: #f7ebe8;
    color: #b53333;
    border: 1px solid #e7b7ae;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    align-self: flex-start;
  }

  .cheng-page__logout-btn:hover {
    background: #f3ddd8;
    border-color: #d97757;
  }

  @media (max-width: 960px) {
    .cheng-page__header--row {
      flex-direction: column;
      align-items: flex-start;
    }

    .cheng-applink__board-header {
      flex-direction: column;
      align-items: stretch;
    }

    .cheng-applink__board-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .cheng-applink__search {
      min-width: 0;
      width: 100%;
    }

    .cheng-page__header-action {
      width: 100%;
    }

    .cheng-page__channel-grid {
      grid-template-columns: 1fr;
    }

    .cheng-page__dialog-overlay {
      padding: 16px;
      align-items: center;
    }

    .cheng-page__dialog {
      max-height: none;
      height: 100%;
      border-radius: 18px;
    }

    .cheng-page__dialog-header {
      padding: 20px;
      flex-wrap: wrap;
    }

    .cheng-page__dialog-body {
      padding: 20px;
    }

    .cheng-page__management-section {
      padding: 16px;
    }

    .cheng-page__connected-item {
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .cheng-page__conn-badge {
      order: 3;
    }

    .cheng-page__connected-item-manage {
      margin-left: auto;
    }
  }

  @media (max-width: 640px) {
    .cheng-page__content {
      padding: 18px;
    }

    .cheng-applink__body {
      padding: 16px;
    }
  }

  .cheng-shell button {
    background: #faf9f5 !important;
    color: #4d4c48 !important;
    border: 1px solid #d1cfc5 !important;
  }

  .cheng-shell button:hover:not(:disabled) {
    background: #c96442 !important;
    border-color: #c96442 !important;
    color: #faf9f5 !important;
  }

  .cheng-shell button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* ── Platform card: disabled / coming-soon state ── */
  .cheng-page__platform-card--disabled {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }

  .cheng-page__platform-soon {
    display: inline-block;
    padding: 2px 8px;
    background: #e8e6dc;
    color: #87867f;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  /* ── App Links close button ── */
  .cheng-page__applink-close-btn {
    flex-shrink: 0;
    margin-left: auto;
    padding: 5px 12px !important;
    background: transparent !important;
    border: 1px solid #d1cfc5 !important;
    border-radius: 6px !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: #5e5d59 !important;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .cheng-page__applink-close-btn:hover {
    background: #f0eee6 !important;
    color: #141413 !important;
    border-color: #d1cfc5 !important;
  }

  /* ── Coming Soon card ── */
  .cheng-coming-soon {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 4px 0;
  }

  .cheng-coming-soon__badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    background: #e8e6dc;
    color: #87867f;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    align-self: flex-start;
  }

  .cheng-coming-soon__desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.55;
  }

  .cheng-coming-soon__hint {
    margin: 0;
    font-size: 12px;
    color: #87867f;
    line-height: 1.4;
  }
`;function ef({apiBaseUrl:l,onLoginSuccess:s,title:c="ChengOS",subtitle:u="登录以管理你的 Channels"}){const[f,p]=h.useState(""),[m,y]=h.useState(""),[k,w]=h.useState(!1),[R,z]=h.useState(null),[V,E]=h.useState(!1),G=h.useCallback(async j=>{j.preventDefault(),w(!0),z(null);try{await new ra(l).login({email:f,password:m}),s()}catch(B){z(B instanceof Error?B.message:String(B))}finally{w(!1)}},[l,f,m,s]);return n.jsxs("div",{style:Te.root,children:[n.jsx("div",{style:Te.orbTopLeft}),n.jsx("div",{style:Te.orbTopRight}),n.jsx("div",{style:Te.orbBottom}),n.jsx("div",{style:Te.container,children:n.jsxs("section",{style:Te.card,children:[n.jsx("div",{style:Te.cardGlow}),n.jsxs("div",{style:Te.content,children:[n.jsx("div",{style:Te.headerRow,children:n.jsxs("div",{style:Te.brandWrap,children:[n.jsx("div",{style:Te.brandLogo,children:"CO"}),n.jsx("div",{style:Te.brandText,children:"CHENGOS"})]})}),n.jsxs("div",{style:Te.titleWrap,children:[n.jsx("h1",{style:Te.title,children:c}),n.jsx("p",{style:Te.subtitle,children:u})]}),n.jsxs("form",{onSubmit:G,style:Te.form,children:[n.jsxs("div",{style:Te.field,children:[n.jsx("label",{style:Te.label,htmlFor:"cheng-email",children:"邮箱"}),n.jsx("input",{id:"cheng-email",type:"email",required:!0,autoComplete:"email",value:f,onChange:j=>p(j.target.value),style:Te.input,placeholder:"you@example.com",disabled:k})]}),n.jsxs("div",{style:Te.field,children:[n.jsx("label",{style:Te.label,htmlFor:"cheng-password",children:"密码"}),n.jsx("input",{id:"cheng-password",type:"password",required:!0,autoComplete:"current-password",value:m,onChange:j=>y(j.target.value),style:Te.input,placeholder:"••••••••",disabled:k})]}),R&&n.jsx("div",{style:Te.error,children:R}),n.jsxs("button",{type:"submit",disabled:k,onMouseEnter:()=>E(!0),onMouseLeave:()=>E(!1),onFocus:()=>E(!0),onBlur:()=>E(!1),style:{...Te.button,...V&&!k?Te.buttonHovered:{},...k?Te.buttonDisabled:{}},children:[n.jsx("span",{children:k?"登录中...":"登录"}),n.jsx("span",{style:Te.arrow,children:"→"})]})]})]})]})})]})}const Te={root:{position:"relative",display:"flex",minHeight:"100%",width:"100%",overflow:"hidden",background:"radial-gradient(circle at top left, rgba(201, 100, 66, 0.14), transparent 30%), radial-gradient(circle at top right, rgba(217, 119, 87, 0.12), transparent 28%), linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},orbTopLeft:{position:"absolute",left:"-8rem",top:"-6rem",width:"16rem",height:"16rem",borderRadius:"9999px",background:"rgba(201, 100, 66, 0.12)",filter:"blur(56px)",pointerEvents:"none"},orbTopRight:{position:"absolute",right:"-6rem",top:"6rem",width:"18rem",height:"18rem",borderRadius:"9999px",background:"rgba(176, 174, 165, 0.2)",filter:"blur(56px)",pointerEvents:"none"},orbBottom:{position:"absolute",left:"32%",bottom:"-8rem",width:"20rem",height:"20rem",borderRadius:"9999px",background:"rgba(217, 119, 87, 0.12)",filter:"blur(60px)",pointerEvents:"none"},container:{position:"relative",zIndex:1,display:"flex",alignItems:"center",width:"100%",maxWidth:"36rem",minHeight:"100%",margin:"0 auto",padding:"2rem 1rem",boxSizing:"border-box"},card:{position:"relative",width:"100%",overflow:"hidden",borderRadius:"2rem",border:"1px solid #f0eee6",background:"#faf9f5",boxShadow:"0 0 0 1px #d1cfc5, rgba(0,0,0,0.07) 0px 16px 40px",backdropFilter:"blur(14px)"},cardGlow:{position:"absolute",inset:0,background:"radial-gradient(circle at top right, rgba(201, 100, 66, 0.08), transparent 34%), radial-gradient(circle at bottom left, rgba(217, 119, 87, 0.08), transparent 30%)",pointerEvents:"none"},content:{position:"relative",zIndex:1,padding:"1.75rem"},headerRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:"1.5rem"},brandWrap:{display:"flex",alignItems:"center",gap:"0.75rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"1rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700,boxShadow:"0 10px 24px rgba(226, 114, 91, 0.36)",letterSpacing:"0.03em"},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},titleWrap:{marginBottom:"1.5rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,letterSpacing:"-0.03em",color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},form:{display:"flex",flexDirection:"column",gap:"1rem"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"1rem",border:"1px solid #e8e6dc",background:"#faf9f5",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",boxShadow:"0 0 0 1px #d1cfc5",outline:"none"},error:{borderRadius:"1rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{height:"3rem",border:"1px solid #d1cfc5",borderRadius:"1rem",background:"#faf9f5",color:"#4d4c48",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",fontSize:"0.875rem",fontWeight:500,boxShadow:"0 0 0 1px #d1cfc5",cursor:"pointer",transition:"all 0.2s ease",marginTop:"0.25rem"},buttonHovered:{background:"#c96442",borderColor:"#c96442",color:"#faf9f5",boxShadow:"0 0 0 1px #c96442, rgba(0,0,0,0.08) 0px 8px 24px"},buttonDisabled:{opacity:.7,cursor:"not-allowed",boxShadow:"none"},arrow:{fontSize:"1rem",lineHeight:1}};function tf({config:l,chatWindowProps:s={},loginTitle:c,loginSubtitle:u}){const{isAuthenticated:f,logout:p,refresh:m}=Bp(l.apiBaseUrl),{channels:y,activeChannel:k,setActiveChannel:w,createChannel:R,updateChannel:z,deleteChannel:V,isLoading:E,refresh:G}=$p({...l,workspaceId:""}),j=h.useCallback(async U=>R(U),[R]),B=h.useCallback(async U=>{await z(U)},[z]),W=h.useMemo(()=>{const U={...l,workspaceId:""};return k?{...U,workspaceId:k.workspaceId,channelId:k.channelId,boundWorkflowId:k.boundWorkflowId||U.boundWorkflowId}:U},[l,k]);return f?n.jsxs("div",{className:"cheng-layout cheng-layout--multi",children:[n.jsx(Jh,{channels:y,activeChannel:k,activeConfig:W,isLoading:E,onSelectChannel:w,onCreateChannel:j,onUpdateChannel:B,onDeleteChannel:V,onLogout:p,onRefreshChannels:G,apiBaseUrl:l.apiBaseUrl,chatWindowProps:s}),n.jsx("style",{children:nf})]}):n.jsx(ef,{apiBaseUrl:l.apiBaseUrl,onLoginSuccess:m,title:c,subtitle:u})}const nf=`
  .cheng-layout {
    display: flex;
    width: 100%;
    height: 100%;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
    background: #f5f4ed;
  }

  .cheng-layout--multi {
    overflow: hidden;
    border-radius: 0;
    box-shadow: none;
  }
`;function rf({apiBaseUrl:l,token:s,onComplete:c}){const[u,f]=h.useState(""),[p,m]=h.useState(""),[y,k]=h.useState(!1),[w,R]=h.useState(!1),[z,V]=h.useState(null),E=h.useMemo(()=>s?.trim()||"",[s]),G=h.useCallback(async j=>{if(j.preventDefault(),V(null),!E){V("重置链接无效，请重新申请密码找回邮件。");return}if(u!==p){V("两次输入的密码不一致。");return}k(!0);try{await new ra(l).resetPassword({token:E,new_password:u}),R(!0),c?.()}catch(B){V(B instanceof Error?B.message:String(B))}finally{k(!1)}},[l,p,c,u,E]);return n.jsx("div",{style:Fe.root,children:n.jsxs("main",{style:Fe.panel,children:[n.jsxs("div",{style:Fe.brandRow,children:[n.jsx("div",{style:Fe.brandLogo,children:"CO"}),n.jsx("div",{style:Fe.brandText,children:"CHENGOS"})]}),w?n.jsxs("section",{style:Fe.content,children:[n.jsx("h1",{style:Fe.title,children:"密码已重置"}),n.jsx("p",{style:Fe.subtitle,children:"现在可以使用新密码登录。"}),n.jsx("a",{href:"/",style:Fe.button,children:"返回登录"})]}):n.jsxs("form",{onSubmit:G,style:Fe.content,children:[n.jsxs("div",{children:[n.jsx("h1",{style:Fe.title,children:"重置密码"}),n.jsx("p",{style:Fe.subtitle,children:"请输入新密码完成账号恢复。"})]}),n.jsxs("div",{style:Fe.field,children:[n.jsx("label",{style:Fe.label,htmlFor:"cheng-new-password",children:"新密码"}),n.jsx("input",{id:"cheng-new-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:u,onChange:j=>f(j.target.value),style:Fe.input,disabled:y||!E})]}),n.jsxs("div",{style:Fe.field,children:[n.jsx("label",{style:Fe.label,htmlFor:"cheng-confirm-password",children:"确认新密码"}),n.jsx("input",{id:"cheng-confirm-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:p,onChange:j=>m(j.target.value),style:Fe.input,disabled:y||!E})]}),!E&&n.jsx("div",{style:Fe.error,children:"重置链接缺少 token，请重新申请密码找回邮件。"}),z&&n.jsx("div",{style:Fe.error,children:z}),n.jsx("button",{type:"submit",disabled:y||!E,style:Fe.button,children:y?"提交中...":"更新密码"}),n.jsx("a",{href:"/",style:Fe.secondaryLink,children:"返回登录"})]})]})})}const Fe={root:{display:"flex",minHeight:"100%",width:"100%",alignItems:"center",justifyContent:"center",boxSizing:"border-box",padding:"2rem 1rem",background:"linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},panel:{width:"100%",maxWidth:"30rem",boxSizing:"border-box",border:"1px solid #d1cfc5",borderRadius:"1.25rem",background:"#faf9f5",padding:"1.75rem",boxShadow:"rgba(0,0,0,0.07) 0px 16px 40px"},brandRow:{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"0.875rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},content:{display:"flex",flexDirection:"column",gap:"1rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"0.875rem",border:"1px solid #e8e6dc",background:"#fff",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",outline:"none"},error:{borderRadius:"0.875rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{display:"flex",height:"3rem",alignItems:"center",justifyContent:"center",border:"1px solid #c96442",borderRadius:"0.875rem",background:"#c96442",color:"#faf9f5",fontSize:"0.875rem",fontWeight:600,textDecoration:"none",cursor:"pointer"},secondaryLink:{alignSelf:"center",color:"#5e5d59",fontSize:"0.875rem",textDecoration:"none"}};function of(){const l=window.__CHENGOS_APP_CONFIG__,s={apiBaseUrl:l?.apiBaseUrl||void 0||"/api/v1",wsBaseUrl:l?.wsUrl||void 0||"/ws/executions",channelId:l?.channelId||void 0||"weather-app",boundWorkflowId:l?.boundWorkflowId||void 0||""};if(window.location.pathname==="/reset-password"){const c=new URLSearchParams(window.location.search).get("token");return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(rf,{apiBaseUrl:s.apiBaseUrl,token:c})})}return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(tf,{config:s,loginTitle:"Chengflow",loginSubtitle:"登录以管理你的 Channels",chatWindowProps:{title:"AI 助手",placeholder:"输入消息...",height:"100vh"}})})}const wd=document.getElementById("root");if(!wd)throw new Error("Root element not found");const sf=Cp.createRoot(wd);sf.render(n.jsx(bp.StrictMode,{children:n.jsx(of,{})}));
