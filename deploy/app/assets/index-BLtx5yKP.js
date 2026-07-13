(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))d(p);new MutationObserver(p=>{for(const u of p)if(u.type==="childList")for(const m of u.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&d(m)}).observe(document,{childList:!0,subtree:!0});function a(p){const u={};return p.integrity&&(u.integrity=p.integrity),p.referrerPolicy&&(u.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?u.credentials="include":p.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function d(p){if(p.ep)return;p.ep=!0;const u=a(p);fetch(p.href,u)}})();function Lp(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var Ys={exports:{}},Wr={},Js={exports:{}},Se={};var od;function Rp(){if(od)return Se;od=1;var l=Symbol.for("react.element"),i=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),d=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),u=Symbol.for("react.provider"),m=Symbol.for("react.context"),w=Symbol.for("react.forward_ref"),v=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),z=Symbol.for("react.lazy"),T=Symbol.iterator;function H(g){return g===null||typeof g!="object"?null:(g=T&&g[T]||g["@@iterator"],typeof g=="function"?g:null)}var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},re=Object.assign,C={};function F(g,b,y){this.props=g,this.context=b,this.refs=C,this.updater=y||A}F.prototype.isReactComponent={},F.prototype.setState=function(g,b){if(typeof g!="object"&&typeof g!="function"&&g!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,g,b,"setState")},F.prototype.forceUpdate=function(g){this.updater.enqueueForceUpdate(this,g,"forceUpdate")};function N(){}N.prototype=F.prototype;function G(g,b,y){this.props=g,this.context=b,this.refs=C,this.updater=y||A}var Y=G.prototype=new N;Y.constructor=G,re(Y,F.prototype),Y.isPureReactComponent=!0;var U=Array.isArray,J=Object.prototype.hasOwnProperty,Q={current:null},X={key:!0,ref:!0,__self:!0,__source:!0};function se(g,b,y){var R,E={},P=null,S=null;if(b!=null)for(R in b.ref!==void 0&&(S=b.ref),b.key!==void 0&&(P=""+b.key),b)J.call(b,R)&&!X.hasOwnProperty(R)&&(E[R]=b[R]);var V=arguments.length-2;if(V===1)E.children=y;else if(1<V){for(var de=Array(V),ge=0;ge<V;ge++)de[ge]=arguments[ge+2];E.children=de}if(g&&g.defaultProps)for(R in V=g.defaultProps,V)E[R]===void 0&&(E[R]=V[R]);return{$$typeof:l,type:g,key:P,ref:S,props:E,_owner:Q.current}}function ne(g,b){return{$$typeof:l,type:g.type,key:b,ref:g.ref,props:g.props,_owner:g._owner}}function oe(g){return typeof g=="object"&&g!==null&&g.$$typeof===l}function ee(g){var b={"=":"=0",":":"=2"};return"$"+g.replace(/[=:]/g,function(y){return b[y]})}var le=/\/+/g;function q(g,b){return typeof g=="object"&&g!==null&&g.key!=null?ee(""+g.key):b.toString(36)}function _e(g,b,y,R,E){var P=typeof g;(P==="undefined"||P==="boolean")&&(g=null);var S=!1;if(g===null)S=!0;else switch(P){case"string":case"number":S=!0;break;case"object":switch(g.$$typeof){case l:case i:S=!0}}if(S)return S=g,E=E(S),g=R===""?"."+q(S,0):R,U(E)?(y="",g!=null&&(y=g.replace(le,"$&/")+"/"),_e(E,b,y,"",function(ge){return ge})):E!=null&&(oe(E)&&(E=ne(E,y+(!E.key||S&&S.key===E.key?"":(""+E.key).replace(le,"$&/")+"/")+g)),b.push(E)),1;if(S=0,R=R===""?".":R+":",U(g))for(var V=0;V<g.length;V++){P=g[V];var de=R+q(P,V);S+=_e(P,b,y,de,E)}else if(de=H(g),typeof de=="function")for(g=de.call(g),V=0;!(P=g.next()).done;)P=P.value,de=R+q(P,V++),S+=_e(P,b,y,de,E);else if(P==="object")throw b=String(g),Error("Objects are not valid as a React child (found: "+(b==="[object Object]"?"object with keys {"+Object.keys(g).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return S}function K(g,b,y){if(g==null)return g;var R=[],E=0;return _e(g,R,"","",function(P){return b.call(y,P,E++)}),R}function ce(g){if(g._status===-1){var b=g._result;b=b(),b.then(function(y){(g._status===0||g._status===-1)&&(g._status=1,g._result=y)},function(y){(g._status===0||g._status===-1)&&(g._status=2,g._result=y)}),g._status===-1&&(g._status=0,g._result=b)}if(g._status===1)return g._result.default;throw g._result}var O={current:null},$={transition:null},W={ReactCurrentDispatcher:O,ReactCurrentBatchConfig:$,ReactCurrentOwner:Q};function B(){throw Error("act(...) is not supported in production builds of React.")}return Se.Children={map:K,forEach:function(g,b,y){K(g,function(){b.apply(this,arguments)},y)},count:function(g){var b=0;return K(g,function(){b++}),b},toArray:function(g){return K(g,function(b){return b})||[]},only:function(g){if(!oe(g))throw Error("React.Children.only expected to receive a single React element child.");return g}},Se.Component=F,Se.Fragment=a,Se.Profiler=p,Se.PureComponent=G,Se.StrictMode=d,Se.Suspense=v,Se.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W,Se.act=B,Se.cloneElement=function(g,b,y){if(g==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+g+".");var R=re({},g.props),E=g.key,P=g.ref,S=g._owner;if(b!=null){if(b.ref!==void 0&&(P=b.ref,S=Q.current),b.key!==void 0&&(E=""+b.key),g.type&&g.type.defaultProps)var V=g.type.defaultProps;for(de in b)J.call(b,de)&&!X.hasOwnProperty(de)&&(R[de]=b[de]===void 0&&V!==void 0?V[de]:b[de])}var de=arguments.length-2;if(de===1)R.children=y;else if(1<de){V=Array(de);for(var ge=0;ge<de;ge++)V[ge]=arguments[ge+2];R.children=V}return{$$typeof:l,type:g.type,key:E,ref:P,props:R,_owner:S}},Se.createContext=function(g){return g={$$typeof:m,_currentValue:g,_currentValue2:g,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},g.Provider={$$typeof:u,_context:g},g.Consumer=g},Se.createElement=se,Se.createFactory=function(g){var b=se.bind(null,g);return b.type=g,b},Se.createRef=function(){return{current:null}},Se.forwardRef=function(g){return{$$typeof:w,render:g}},Se.isValidElement=oe,Se.lazy=function(g){return{$$typeof:z,_payload:{_status:-1,_result:g},_init:ce}},Se.memo=function(g,b){return{$$typeof:_,type:g,compare:b===void 0?null:b}},Se.startTransition=function(g){var b=$.transition;$.transition={};try{g()}finally{$.transition=b}},Se.unstable_act=B,Se.useCallback=function(g,b){return O.current.useCallback(g,b)},Se.useContext=function(g){return O.current.useContext(g)},Se.useDebugValue=function(){},Se.useDeferredValue=function(g){return O.current.useDeferredValue(g)},Se.useEffect=function(g,b){return O.current.useEffect(g,b)},Se.useId=function(){return O.current.useId()},Se.useImperativeHandle=function(g,b,y){return O.current.useImperativeHandle(g,b,y)},Se.useInsertionEffect=function(g,b){return O.current.useInsertionEffect(g,b)},Se.useLayoutEffect=function(g,b){return O.current.useLayoutEffect(g,b)},Se.useMemo=function(g,b){return O.current.useMemo(g,b)},Se.useReducer=function(g,b,y){return O.current.useReducer(g,b,y)},Se.useRef=function(g){return O.current.useRef(g)},Se.useState=function(g){return O.current.useState(g)},Se.useSyncExternalStore=function(g,b,y){return O.current.useSyncExternalStore(g,b,y)},Se.useTransition=function(){return O.current.useTransition()},Se.version="18.3.1",Se}var id;function ua(){return id||(id=1,Js.exports=Rp()),Js.exports}var sd;function Mp(){if(sd)return Wr;sd=1;var l=ua(),i=Symbol.for("react.element"),a=Symbol.for("react.fragment"),d=Object.prototype.hasOwnProperty,p=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function m(w,v,_){var z,T={},H=null,A=null;_!==void 0&&(H=""+_),v.key!==void 0&&(H=""+v.key),v.ref!==void 0&&(A=v.ref);for(z in v)d.call(v,z)&&!u.hasOwnProperty(z)&&(T[z]=v[z]);if(w&&w.defaultProps)for(z in v=w.defaultProps,v)T[z]===void 0&&(T[z]=v[z]);return{$$typeof:i,type:w,key:H,ref:A,props:T,_owner:p.current}}return Wr.Fragment=a,Wr.jsx=m,Wr.jsxs=m,Wr}var ad;function Dp(){return ad||(ad=1,Ys.exports=Mp()),Ys.exports}var n=Dp(),f=ua();const Pp=Lp(f);var Zo={},Zs={exports:{}},ht={},ea={exports:{}},ta={};var ld;function Fp(){return ld||(ld=1,(function(l){function i($,W){var B=$.length;$.push(W);e:for(;0<B;){var g=B-1>>>1,b=$[g];if(0<p(b,W))$[g]=W,$[B]=b,B=g;else break e}}function a($){return $.length===0?null:$[0]}function d($){if($.length===0)return null;var W=$[0],B=$.pop();if(B!==W){$[0]=B;e:for(var g=0,b=$.length,y=b>>>1;g<y;){var R=2*(g+1)-1,E=$[R],P=R+1,S=$[P];if(0>p(E,B))P<b&&0>p(S,E)?($[g]=S,$[P]=B,g=P):($[g]=E,$[R]=B,g=R);else if(P<b&&0>p(S,B))$[g]=S,$[P]=B,g=P;else break e}}return W}function p($,W){var B=$.sortIndex-W.sortIndex;return B!==0?B:$.id-W.id}if(typeof performance=="object"&&typeof performance.now=="function"){var u=performance;l.unstable_now=function(){return u.now()}}else{var m=Date,w=m.now();l.unstable_now=function(){return m.now()-w}}var v=[],_=[],z=1,T=null,H=3,A=!1,re=!1,C=!1,F=typeof setTimeout=="function"?setTimeout:null,N=typeof clearTimeout=="function"?clearTimeout:null,G=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Y($){for(var W=a(_);W!==null;){if(W.callback===null)d(_);else if(W.startTime<=$)d(_),W.sortIndex=W.expirationTime,i(v,W);else break;W=a(_)}}function U($){if(C=!1,Y($),!re)if(a(v)!==null)re=!0,ce(J);else{var W=a(_);W!==null&&O(U,W.startTime-$)}}function J($,W){re=!1,C&&(C=!1,N(se),se=-1),A=!0;var B=H;try{for(Y(W),T=a(v);T!==null&&(!(T.expirationTime>W)||$&&!ee());){var g=T.callback;if(typeof g=="function"){T.callback=null,H=T.priorityLevel;var b=g(T.expirationTime<=W);W=l.unstable_now(),typeof b=="function"?T.callback=b:T===a(v)&&d(v),Y(W)}else d(v);T=a(v)}if(T!==null)var y=!0;else{var R=a(_);R!==null&&O(U,R.startTime-W),y=!1}return y}finally{T=null,H=B,A=!1}}var Q=!1,X=null,se=-1,ne=5,oe=-1;function ee(){return!(l.unstable_now()-oe<ne)}function le(){if(X!==null){var $=l.unstable_now();oe=$;var W=!0;try{W=X(!0,$)}finally{W?q():(Q=!1,X=null)}}else Q=!1}var q;if(typeof G=="function")q=function(){G(le)};else if(typeof MessageChannel<"u"){var _e=new MessageChannel,K=_e.port2;_e.port1.onmessage=le,q=function(){K.postMessage(null)}}else q=function(){F(le,0)};function ce($){X=$,Q||(Q=!0,q())}function O($,W){se=F(function(){$(l.unstable_now())},W)}l.unstable_IdlePriority=5,l.unstable_ImmediatePriority=1,l.unstable_LowPriority=4,l.unstable_NormalPriority=3,l.unstable_Profiling=null,l.unstable_UserBlockingPriority=2,l.unstable_cancelCallback=function($){$.callback=null},l.unstable_continueExecution=function(){re||A||(re=!0,ce(J))},l.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ne=0<$?Math.floor(1e3/$):5},l.unstable_getCurrentPriorityLevel=function(){return H},l.unstable_getFirstCallbackNode=function(){return a(v)},l.unstable_next=function($){switch(H){case 1:case 2:case 3:var W=3;break;default:W=H}var B=H;H=W;try{return $()}finally{H=B}},l.unstable_pauseExecution=function(){},l.unstable_requestPaint=function(){},l.unstable_runWithPriority=function($,W){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var B=H;H=$;try{return W()}finally{H=B}},l.unstable_scheduleCallback=function($,W,B){var g=l.unstable_now();switch(typeof B=="object"&&B!==null?(B=B.delay,B=typeof B=="number"&&0<B?g+B:g):B=g,$){case 1:var b=-1;break;case 2:b=250;break;case 5:b=1073741823;break;case 4:b=1e4;break;default:b=5e3}return b=B+b,$={id:z++,callback:W,priorityLevel:$,startTime:B,expirationTime:b,sortIndex:-1},B>g?($.sortIndex=B,i(_,$),a(v)===null&&$===a(_)&&(C?(N(se),se=-1):C=!0,O(U,B-g))):($.sortIndex=b,i(v,$),re||A||(re=!0,ce(J))),$},l.unstable_shouldYield=ee,l.unstable_wrapCallback=function($){var W=H;return function(){var B=H;H=W;try{return $.apply(this,arguments)}finally{H=B}}}})(ta)),ta}var cd;function Wp(){return cd||(cd=1,ea.exports=Fp()),ea.exports}var dd;function Op(){if(dd)return ht;dd=1;var l=ua(),i=Wp();function a(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var d=new Set,p={};function u(e,t){m(e,t),m(e+"Capture",t)}function m(e,t){for(p[e]=t,e=0;e<t.length;e++)d.add(t[e])}var w=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),v=Object.prototype.hasOwnProperty,_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,z={},T={};function H(e){return v.call(T,e)?!0:v.call(z,e)?!1:_.test(e)?T[e]=!0:(z[e]=!0,!1)}function A(e,t,r,o){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function re(e,t,r,o){if(t===null||typeof t>"u"||A(e,t,r,o))return!0;if(o)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function C(e,t,r,o,s,c,h){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=s,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=c,this.removeEmptyString=h}var F={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){F[e]=new C(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];F[t]=new C(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){F[e]=new C(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){F[e]=new C(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){F[e]=new C(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){F[e]=new C(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){F[e]=new C(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){F[e]=new C(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){F[e]=new C(e,5,!1,e.toLowerCase(),null,!1,!1)});var N=/[\-:]([a-z])/g;function G(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(N,G);F[t]=new C(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(N,G);F[t]=new C(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(N,G);F[t]=new C(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){F[e]=new C(e,1,!1,e.toLowerCase(),null,!1,!1)}),F.xlinkHref=new C("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){F[e]=new C(e,1,!1,e.toLowerCase(),null,!0,!0)});function Y(e,t,r,o){var s=F.hasOwnProperty(t)?F[t]:null;(s!==null?s.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(re(t,r,s,o)&&(r=null),o||s===null?H(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):s.mustUseProperty?e[s.propertyName]=r===null?s.type===3?!1:"":r:(t=s.attributeName,o=s.attributeNamespace,r===null?e.removeAttribute(t):(s=s.type,r=s===3||s===4&&r===!0?"":""+r,o?e.setAttributeNS(o,t,r):e.setAttribute(t,r))))}var U=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,J=Symbol.for("react.element"),Q=Symbol.for("react.portal"),X=Symbol.for("react.fragment"),se=Symbol.for("react.strict_mode"),ne=Symbol.for("react.profiler"),oe=Symbol.for("react.provider"),ee=Symbol.for("react.context"),le=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),_e=Symbol.for("react.suspense_list"),K=Symbol.for("react.memo"),ce=Symbol.for("react.lazy"),O=Symbol.for("react.offscreen"),$=Symbol.iterator;function W(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var B=Object.assign,g;function b(e){if(g===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);g=t&&t[1]||""}return`
`+g+e}var y=!1;function R(e,t){if(!e||y)return"";y=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(M){var o=M}Reflect.construct(e,[],t)}else{try{t.call()}catch(M){o=M}e.call(t.prototype)}else{try{throw Error()}catch(M){o=M}e()}}catch(M){if(M&&o&&typeof M.stack=="string"){for(var s=M.stack.split(`
`),c=o.stack.split(`
`),h=s.length-1,x=c.length-1;1<=h&&0<=x&&s[h]!==c[x];)x--;for(;1<=h&&0<=x;h--,x--)if(s[h]!==c[x]){if(h!==1||x!==1)do if(h--,x--,0>x||s[h]!==c[x]){var k=`
`+s[h].replace(" at new "," at ");return e.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",e.displayName)),k}while(1<=h&&0<=x);break}}}finally{y=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?b(e):""}function E(e){switch(e.tag){case 5:return b(e.type);case 16:return b("Lazy");case 13:return b("Suspense");case 19:return b("SuspenseList");case 0:case 2:case 15:return e=R(e.type,!1),e;case 11:return e=R(e.type.render,!1),e;case 1:return e=R(e.type,!0),e;default:return""}}function P(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case X:return"Fragment";case Q:return"Portal";case ne:return"Profiler";case se:return"StrictMode";case q:return"Suspense";case _e:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ee:return(e.displayName||"Context")+".Consumer";case oe:return(e._context.displayName||"Context")+".Provider";case le:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case K:return t=e.displayName||null,t!==null?t:P(e.type)||"Memo";case ce:t=e._payload,e=e._init;try{return P(e(t))}catch{}}return null}function S(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return P(t);case 8:return t===se?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function V(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function de(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function ge(e){var t=de(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var s=r.get,c=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(h){o=""+h,c.call(this,h)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return o},setValue:function(h){o=""+h},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function he(e){e._valueTracker||(e._valueTracker=ge(e))}function Te(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),o="";return e&&(o=de(e)?e.checked?"true":"false":e.value),e=o,e!==r?(t.setValue(e),!0):!1}function He(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ye(e,t){var r=t.checked;return B({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function D(e,t){var r=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;r=V(t.value!=null?t.value:r),e._wrapperState={initialChecked:o,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function je(e,t){t=t.checked,t!=null&&Y(e,"checked",t,!1)}function Ce(e,t){je(e,t);var r=V(t.value),o=t.type;if(r!=null)o==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?st(e,t.type,r):t.hasOwnProperty("defaultValue")&&st(e,t.type,V(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ee(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function st(e,t,r){(t!=="number"||He(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var at=Array.isArray;function In(e,t,r,o){if(e=e.options,t){t={};for(var s=0;s<r.length;s++)t["$"+r[s]]=!0;for(r=0;r<e.length;r++)s=t.hasOwnProperty("$"+e[r].value),e[r].selected!==s&&(e[r].selected=s),s&&o&&(e[r].defaultSelected=!0)}else{for(r=""+V(r),t=null,s=0;s<e.length;s++){if(e[s].value===r){e[s].selected=!0,o&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function ai(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(a(91));return B({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function fa(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(a(92));if(at(r)){if(1<r.length)throw Error(a(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:V(r)}}function ga(e,t){var r=V(t.value),o=V(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),o!=null&&(e.defaultValue=""+o)}function ma(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function xa(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function li(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?xa(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Hr,_a=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,o,s){MSApp.execUnsafeLocalFunction(function(){return e(t,r,o,s)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Hr=Hr||document.createElement("div"),Hr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Hr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function tr(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var nr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Pd=["Webkit","ms","Moz","O"];Object.keys(nr).forEach(function(e){Pd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),nr[t]=nr[e]})});function ba(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||nr.hasOwnProperty(e)&&nr[e]?(""+t).trim():t+"px"}function wa(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var o=r.indexOf("--")===0,s=ba(r,t[r],o);r==="float"&&(r="cssFloat"),o?e.setProperty(r,s):e[r]=s}}var Fd=B({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ci(e,t){if(t){if(Fd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(a(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(a(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(a(61))}if(t.style!=null&&typeof t.style!="object")throw Error(a(62))}}function di(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ui=null;function pi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var hi=null,En=null,An=null;function ya(e){if(e=jr(e)){if(typeof hi!="function")throw Error(a(280));var t=e.stateNode;t&&(t=fo(t),hi(e.stateNode,e.type,t))}}function va(e){En?An?An.push(e):An=[e]:En=e}function ka(){if(En){var e=En,t=An;if(An=En=null,ya(e),t)for(e=0;e<t.length;e++)ya(t[e])}}function ja(e,t){return e(t)}function Sa(){}var fi=!1;function Ca(e,t,r){if(fi)return e(t,r);fi=!0;try{return ja(e,t,r)}finally{fi=!1,(En!==null||An!==null)&&(Sa(),ka())}}function rr(e,t){var r=e.stateNode;if(r===null)return null;var o=fo(r);if(o===null)return null;r=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(a(231,t,typeof r));return r}var gi=!1;if(w)try{var or={};Object.defineProperty(or,"passive",{get:function(){gi=!0}}),window.addEventListener("test",or,or),window.removeEventListener("test",or,or)}catch{gi=!1}function Wd(e,t,r,o,s,c,h,x,k){var M=Array.prototype.slice.call(arguments,3);try{t.apply(r,M)}catch(te){this.onError(te)}}var ir=!1,Kr=null,Vr=!1,mi=null,Od={onError:function(e){ir=!0,Kr=e}};function Ud(e,t,r,o,s,c,h,x,k){ir=!1,Kr=null,Wd.apply(Od,arguments)}function $d(e,t,r,o,s,c,h,x,k){if(Ud.apply(this,arguments),ir){if(ir){var M=Kr;ir=!1,Kr=null}else throw Error(a(198));Vr||(Vr=!0,mi=M)}}function pn(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function Na(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ia(e){if(pn(e)!==e)throw Error(a(188))}function Bd(e){var t=e.alternate;if(!t){if(t=pn(e),t===null)throw Error(a(188));return t!==e?null:e}for(var r=e,o=t;;){var s=r.return;if(s===null)break;var c=s.alternate;if(c===null){if(o=s.return,o!==null){r=o;continue}break}if(s.child===c.child){for(c=s.child;c;){if(c===r)return Ia(s),e;if(c===o)return Ia(s),t;c=c.sibling}throw Error(a(188))}if(r.return!==o.return)r=s,o=c;else{for(var h=!1,x=s.child;x;){if(x===r){h=!0,r=s,o=c;break}if(x===o){h=!0,o=s,r=c;break}x=x.sibling}if(!h){for(x=c.child;x;){if(x===r){h=!0,r=c,o=s;break}if(x===o){h=!0,o=c,r=s;break}x=x.sibling}if(!h)throw Error(a(189))}}if(r.alternate!==o)throw Error(a(190))}if(r.tag!==3)throw Error(a(188));return r.stateNode.current===r?e:t}function Ea(e){return e=Bd(e),e!==null?Aa(e):null}function Aa(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Aa(e);if(t!==null)return t;e=e.sibling}return null}var Ta=i.unstable_scheduleCallback,za=i.unstable_cancelCallback,Hd=i.unstable_shouldYield,Kd=i.unstable_requestPaint,$e=i.unstable_now,Vd=i.unstable_getCurrentPriorityLevel,xi=i.unstable_ImmediatePriority,La=i.unstable_UserBlockingPriority,Gr=i.unstable_NormalPriority,Gd=i.unstable_LowPriority,Ra=i.unstable_IdlePriority,qr=null,zt=null;function qd(e){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(qr,e,void 0,(e.current.flags&128)===128)}catch{}}var St=Math.clz32?Math.clz32:Yd,Qd=Math.log,Xd=Math.LN2;function Yd(e){return e>>>=0,e===0?32:31-(Qd(e)/Xd|0)|0}var Qr=64,Xr=4194304;function sr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Yr(e,t){var r=e.pendingLanes;if(r===0)return 0;var o=0,s=e.suspendedLanes,c=e.pingedLanes,h=r&268435455;if(h!==0){var x=h&~s;x!==0?o=sr(x):(c&=h,c!==0&&(o=sr(c)))}else h=r&~s,h!==0?o=sr(h):c!==0&&(o=sr(c));if(o===0)return 0;if(t!==0&&t!==o&&(t&s)===0&&(s=o&-o,c=t&-t,s>=c||s===16&&(c&4194240)!==0))return t;if((o&4)!==0&&(o|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)r=31-St(t),s=1<<r,o|=e[r],t&=~s;return o}function Jd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Zd(e,t){for(var r=e.suspendedLanes,o=e.pingedLanes,s=e.expirationTimes,c=e.pendingLanes;0<c;){var h=31-St(c),x=1<<h,k=s[h];k===-1?((x&r)===0||(x&o)!==0)&&(s[h]=Jd(x,t)):k<=t&&(e.expiredLanes|=x),c&=~x}}function _i(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Ma(){var e=Qr;return Qr<<=1,(Qr&4194240)===0&&(Qr=64),e}function bi(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function ar(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-St(t),e[t]=r}function eu(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<r;){var s=31-St(r),c=1<<s;t[s]=0,o[s]=-1,e[s]=-1,r&=~c}}function wi(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var o=31-St(r),s=1<<o;s&t|e[o]&t&&(e[o]|=t),r&=~s}}var Ae=0;function Da(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Pa,yi,Fa,Wa,Oa,vi=!1,Jr=[],Kt=null,Vt=null,Gt=null,lr=new Map,cr=new Map,qt=[],tu="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ua(e,t){switch(e){case"focusin":case"focusout":Kt=null;break;case"dragenter":case"dragleave":Vt=null;break;case"mouseover":case"mouseout":Gt=null;break;case"pointerover":case"pointerout":lr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":cr.delete(t.pointerId)}}function dr(e,t,r,o,s,c){return e===null||e.nativeEvent!==c?(e={blockedOn:t,domEventName:r,eventSystemFlags:o,nativeEvent:c,targetContainers:[s]},t!==null&&(t=jr(t),t!==null&&yi(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function nu(e,t,r,o,s){switch(t){case"focusin":return Kt=dr(Kt,e,t,r,o,s),!0;case"dragenter":return Vt=dr(Vt,e,t,r,o,s),!0;case"mouseover":return Gt=dr(Gt,e,t,r,o,s),!0;case"pointerover":var c=s.pointerId;return lr.set(c,dr(lr.get(c)||null,e,t,r,o,s)),!0;case"gotpointercapture":return c=s.pointerId,cr.set(c,dr(cr.get(c)||null,e,t,r,o,s)),!0}return!1}function $a(e){var t=hn(e.target);if(t!==null){var r=pn(t);if(r!==null){if(t=r.tag,t===13){if(t=Na(r),t!==null){e.blockedOn=t,Oa(e.priority,function(){Fa(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Zr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=ji(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var o=new r.constructor(r.type,r);ui=o,r.target.dispatchEvent(o),ui=null}else return t=jr(r),t!==null&&yi(t),e.blockedOn=r,!1;t.shift()}return!0}function Ba(e,t,r){Zr(e)&&r.delete(t)}function ru(){vi=!1,Kt!==null&&Zr(Kt)&&(Kt=null),Vt!==null&&Zr(Vt)&&(Vt=null),Gt!==null&&Zr(Gt)&&(Gt=null),lr.forEach(Ba),cr.forEach(Ba)}function ur(e,t){e.blockedOn===t&&(e.blockedOn=null,vi||(vi=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,ru)))}function pr(e){function t(s){return ur(s,e)}if(0<Jr.length){ur(Jr[0],e);for(var r=1;r<Jr.length;r++){var o=Jr[r];o.blockedOn===e&&(o.blockedOn=null)}}for(Kt!==null&&ur(Kt,e),Vt!==null&&ur(Vt,e),Gt!==null&&ur(Gt,e),lr.forEach(t),cr.forEach(t),r=0;r<qt.length;r++)o=qt[r],o.blockedOn===e&&(o.blockedOn=null);for(;0<qt.length&&(r=qt[0],r.blockedOn===null);)$a(r),r.blockedOn===null&&qt.shift()}var Tn=U.ReactCurrentBatchConfig,eo=!0;function ou(e,t,r,o){var s=Ae,c=Tn.transition;Tn.transition=null;try{Ae=1,ki(e,t,r,o)}finally{Ae=s,Tn.transition=c}}function iu(e,t,r,o){var s=Ae,c=Tn.transition;Tn.transition=null;try{Ae=4,ki(e,t,r,o)}finally{Ae=s,Tn.transition=c}}function ki(e,t,r,o){if(eo){var s=ji(e,t,r,o);if(s===null)Ui(e,t,o,to,r),Ua(e,o);else if(nu(s,e,t,r,o))o.stopPropagation();else if(Ua(e,o),t&4&&-1<tu.indexOf(e)){for(;s!==null;){var c=jr(s);if(c!==null&&Pa(c),c=ji(e,t,r,o),c===null&&Ui(e,t,o,to,r),c===s)break;s=c}s!==null&&o.stopPropagation()}else Ui(e,t,o,null,r)}}var to=null;function ji(e,t,r,o){if(to=null,e=pi(o),e=hn(e),e!==null)if(t=pn(e),t===null)e=null;else if(r=t.tag,r===13){if(e=Na(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return to=e,null}function Ha(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Vd()){case xi:return 1;case La:return 4;case Gr:case Gd:return 16;case Ra:return 536870912;default:return 16}default:return 16}}var Qt=null,Si=null,no=null;function Ka(){if(no)return no;var e,t=Si,r=t.length,o,s="value"in Qt?Qt.value:Qt.textContent,c=s.length;for(e=0;e<r&&t[e]===s[e];e++);var h=r-e;for(o=1;o<=h&&t[r-o]===s[c-o];o++);return no=s.slice(e,1<o?1-o:void 0)}function ro(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function oo(){return!0}function Va(){return!1}function ft(e){function t(r,o,s,c,h){this._reactName=r,this._targetInst=s,this.type=o,this.nativeEvent=c,this.target=h,this.currentTarget=null;for(var x in e)e.hasOwnProperty(x)&&(r=e[x],this[x]=r?r(c):c[x]);return this.isDefaultPrevented=(c.defaultPrevented!=null?c.defaultPrevented:c.returnValue===!1)?oo:Va,this.isPropagationStopped=Va,this}return B(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=oo)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=oo)},persist:function(){},isPersistent:oo}),t}var zn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ci=ft(zn),hr=B({},zn,{view:0,detail:0}),su=ft(hr),Ni,Ii,fr,io=B({},hr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ai,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==fr&&(fr&&e.type==="mousemove"?(Ni=e.screenX-fr.screenX,Ii=e.screenY-fr.screenY):Ii=Ni=0,fr=e),Ni)},movementY:function(e){return"movementY"in e?e.movementY:Ii}}),Ga=ft(io),au=B({},io,{dataTransfer:0}),lu=ft(au),cu=B({},hr,{relatedTarget:0}),Ei=ft(cu),du=B({},zn,{animationName:0,elapsedTime:0,pseudoElement:0}),uu=ft(du),pu=B({},zn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),hu=ft(pu),fu=B({},zn,{data:0}),qa=ft(fu),gu={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},mu={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},xu={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function _u(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=xu[e])?!!t[e]:!1}function Ai(){return _u}var bu=B({},hr,{key:function(e){if(e.key){var t=gu[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ro(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?mu[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ai,charCode:function(e){return e.type==="keypress"?ro(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ro(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),wu=ft(bu),yu=B({},io,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Qa=ft(yu),vu=B({},hr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ai}),ku=ft(vu),ju=B({},zn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Su=ft(ju),Cu=B({},io,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Nu=ft(Cu),Iu=[9,13,27,32],Ti=w&&"CompositionEvent"in window,gr=null;w&&"documentMode"in document&&(gr=document.documentMode);var Eu=w&&"TextEvent"in window&&!gr,Xa=w&&(!Ti||gr&&8<gr&&11>=gr),Ya=" ",Ja=!1;function Za(e,t){switch(e){case"keyup":return Iu.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function el(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Ln=!1;function Au(e,t){switch(e){case"compositionend":return el(t);case"keypress":return t.which!==32?null:(Ja=!0,Ya);case"textInput":return e=t.data,e===Ya&&Ja?null:e;default:return null}}function Tu(e,t){if(Ln)return e==="compositionend"||!Ti&&Za(e,t)?(e=Ka(),no=Si=Qt=null,Ln=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Xa&&t.locale!=="ko"?null:t.data;default:return null}}var zu={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function tl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!zu[e.type]:t==="textarea"}function nl(e,t,r,o){va(o),t=uo(t,"onChange"),0<t.length&&(r=new Ci("onChange","change",null,r,o),e.push({event:r,listeners:t}))}var mr=null,xr=null;function Lu(e){wl(e,0)}function so(e){var t=Fn(e);if(Te(t))return e}function Ru(e,t){if(e==="change")return t}var rl=!1;if(w){var zi;if(w){var Li="oninput"in document;if(!Li){var ol=document.createElement("div");ol.setAttribute("oninput","return;"),Li=typeof ol.oninput=="function"}zi=Li}else zi=!1;rl=zi&&(!document.documentMode||9<document.documentMode)}function il(){mr&&(mr.detachEvent("onpropertychange",sl),xr=mr=null)}function sl(e){if(e.propertyName==="value"&&so(xr)){var t=[];nl(t,xr,e,pi(e)),Ca(Lu,t)}}function Mu(e,t,r){e==="focusin"?(il(),mr=t,xr=r,mr.attachEvent("onpropertychange",sl)):e==="focusout"&&il()}function Du(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return so(xr)}function Pu(e,t){if(e==="click")return so(t)}function Fu(e,t){if(e==="input"||e==="change")return so(t)}function Wu(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ct=typeof Object.is=="function"?Object.is:Wu;function _r(e,t){if(Ct(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),o=Object.keys(t);if(r.length!==o.length)return!1;for(o=0;o<r.length;o++){var s=r[o];if(!v.call(t,s)||!Ct(e[s],t[s]))return!1}return!0}function al(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ll(e,t){var r=al(e);e=0;for(var o;r;){if(r.nodeType===3){if(o=e+r.textContent.length,e<=t&&o>=t)return{node:r,offset:t-e};e=o}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=al(r)}}function cl(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?cl(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function dl(){for(var e=window,t=He();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=He(e.document)}return t}function Ri(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Ou(e){var t=dl(),r=e.focusedElem,o=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&cl(r.ownerDocument.documentElement,r)){if(o!==null&&Ri(r)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=r.textContent.length,c=Math.min(o.start,s);o=o.end===void 0?c:Math.min(o.end,s),!e.extend&&c>o&&(s=o,o=c,c=s),s=ll(r,c);var h=ll(r,o);s&&h&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==h.node||e.focusOffset!==h.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),c>o?(e.addRange(t),e.extend(h.node,h.offset)):(t.setEnd(h.node,h.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Uu=w&&"documentMode"in document&&11>=document.documentMode,Rn=null,Mi=null,br=null,Di=!1;function ul(e,t,r){var o=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Di||Rn==null||Rn!==He(o)||(o=Rn,"selectionStart"in o&&Ri(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),br&&_r(br,o)||(br=o,o=uo(Mi,"onSelect"),0<o.length&&(t=new Ci("onSelect","select",null,t,r),e.push({event:t,listeners:o}),t.target=Rn)))}function ao(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Mn={animationend:ao("Animation","AnimationEnd"),animationiteration:ao("Animation","AnimationIteration"),animationstart:ao("Animation","AnimationStart"),transitionend:ao("Transition","TransitionEnd")},Pi={},pl={};w&&(pl=document.createElement("div").style,"AnimationEvent"in window||(delete Mn.animationend.animation,delete Mn.animationiteration.animation,delete Mn.animationstart.animation),"TransitionEvent"in window||delete Mn.transitionend.transition);function lo(e){if(Pi[e])return Pi[e];if(!Mn[e])return e;var t=Mn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in pl)return Pi[e]=t[r];return e}var hl=lo("animationend"),fl=lo("animationiteration"),gl=lo("animationstart"),ml=lo("transitionend"),xl=new Map,_l="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Xt(e,t){xl.set(e,t),u(t,[e])}for(var Fi=0;Fi<_l.length;Fi++){var Wi=_l[Fi],$u=Wi.toLowerCase(),Bu=Wi[0].toUpperCase()+Wi.slice(1);Xt($u,"on"+Bu)}Xt(hl,"onAnimationEnd"),Xt(fl,"onAnimationIteration"),Xt(gl,"onAnimationStart"),Xt("dblclick","onDoubleClick"),Xt("focusin","onFocus"),Xt("focusout","onBlur"),Xt(ml,"onTransitionEnd"),m("onMouseEnter",["mouseout","mouseover"]),m("onMouseLeave",["mouseout","mouseover"]),m("onPointerEnter",["pointerout","pointerover"]),m("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var wr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Hu=new Set("cancel close invalid load scroll toggle".split(" ").concat(wr));function bl(e,t,r){var o=e.type||"unknown-event";e.currentTarget=r,$d(o,t,void 0,e),e.currentTarget=null}function wl(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var o=e[r],s=o.event;o=o.listeners;e:{var c=void 0;if(t)for(var h=o.length-1;0<=h;h--){var x=o[h],k=x.instance,M=x.currentTarget;if(x=x.listener,k!==c&&s.isPropagationStopped())break e;bl(s,x,M),c=k}else for(h=0;h<o.length;h++){if(x=o[h],k=x.instance,M=x.currentTarget,x=x.listener,k!==c&&s.isPropagationStopped())break e;bl(s,x,M),c=k}}}if(Vr)throw e=mi,Vr=!1,mi=null,e}function Re(e,t){var r=t[Gi];r===void 0&&(r=t[Gi]=new Set);var o=e+"__bubble";r.has(o)||(yl(t,e,2,!1),r.add(o))}function Oi(e,t,r){var o=0;t&&(o|=4),yl(r,e,o,t)}var co="_reactListening"+Math.random().toString(36).slice(2);function yr(e){if(!e[co]){e[co]=!0,d.forEach(function(r){r!=="selectionchange"&&(Hu.has(r)||Oi(r,!1,e),Oi(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[co]||(t[co]=!0,Oi("selectionchange",!1,t))}}function yl(e,t,r,o){switch(Ha(t)){case 1:var s=ou;break;case 4:s=iu;break;default:s=ki}r=s.bind(null,t,r,e),s=void 0,!gi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),o?s!==void 0?e.addEventListener(t,r,{capture:!0,passive:s}):e.addEventListener(t,r,!0):s!==void 0?e.addEventListener(t,r,{passive:s}):e.addEventListener(t,r,!1)}function Ui(e,t,r,o,s){var c=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var h=o.tag;if(h===3||h===4){var x=o.stateNode.containerInfo;if(x===s||x.nodeType===8&&x.parentNode===s)break;if(h===4)for(h=o.return;h!==null;){var k=h.tag;if((k===3||k===4)&&(k=h.stateNode.containerInfo,k===s||k.nodeType===8&&k.parentNode===s))return;h=h.return}for(;x!==null;){if(h=hn(x),h===null)return;if(k=h.tag,k===5||k===6){o=c=h;continue e}x=x.parentNode}}o=o.return}Ca(function(){var M=c,te=pi(r),ie=[];e:{var Z=xl.get(e);if(Z!==void 0){var ue=Ci,fe=e;switch(e){case"keypress":if(ro(r)===0)break e;case"keydown":case"keyup":ue=wu;break;case"focusin":fe="focus",ue=Ei;break;case"focusout":fe="blur",ue=Ei;break;case"beforeblur":case"afterblur":ue=Ei;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ue=Ga;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ue=lu;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ue=ku;break;case hl:case fl:case gl:ue=uu;break;case ml:ue=Su;break;case"scroll":ue=su;break;case"wheel":ue=Nu;break;case"copy":case"cut":case"paste":ue=hu;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ue=Qa}var me=(t&4)!==0,Be=!me&&e==="scroll",I=me?Z!==null?Z+"Capture":null:Z;me=[];for(var j=M,L;j!==null;){L=j;var ae=L.stateNode;if(L.tag===5&&ae!==null&&(L=ae,I!==null&&(ae=rr(j,I),ae!=null&&me.push(vr(j,ae,L)))),Be)break;j=j.return}0<me.length&&(Z=new ue(Z,fe,null,r,te),ie.push({event:Z,listeners:me}))}}if((t&7)===0){e:{if(Z=e==="mouseover"||e==="pointerover",ue=e==="mouseout"||e==="pointerout",Z&&r!==ui&&(fe=r.relatedTarget||r.fromElement)&&(hn(fe)||fe[Pt]))break e;if((ue||Z)&&(Z=te.window===te?te:(Z=te.ownerDocument)?Z.defaultView||Z.parentWindow:window,ue?(fe=r.relatedTarget||r.toElement,ue=M,fe=fe?hn(fe):null,fe!==null&&(Be=pn(fe),fe!==Be||fe.tag!==5&&fe.tag!==6)&&(fe=null)):(ue=null,fe=M),ue!==fe)){if(me=Ga,ae="onMouseLeave",I="onMouseEnter",j="mouse",(e==="pointerout"||e==="pointerover")&&(me=Qa,ae="onPointerLeave",I="onPointerEnter",j="pointer"),Be=ue==null?Z:Fn(ue),L=fe==null?Z:Fn(fe),Z=new me(ae,j+"leave",ue,r,te),Z.target=Be,Z.relatedTarget=L,ae=null,hn(te)===M&&(me=new me(I,j+"enter",fe,r,te),me.target=L,me.relatedTarget=Be,ae=me),Be=ae,ue&&fe)t:{for(me=ue,I=fe,j=0,L=me;L;L=Dn(L))j++;for(L=0,ae=I;ae;ae=Dn(ae))L++;for(;0<j-L;)me=Dn(me),j--;for(;0<L-j;)I=Dn(I),L--;for(;j--;){if(me===I||I!==null&&me===I.alternate)break t;me=Dn(me),I=Dn(I)}me=null}else me=null;ue!==null&&vl(ie,Z,ue,me,!1),fe!==null&&Be!==null&&vl(ie,Be,fe,me,!0)}}e:{if(Z=M?Fn(M):window,ue=Z.nodeName&&Z.nodeName.toLowerCase(),ue==="select"||ue==="input"&&Z.type==="file")var xe=Ru;else if(tl(Z))if(rl)xe=Fu;else{xe=Du;var be=Mu}else(ue=Z.nodeName)&&ue.toLowerCase()==="input"&&(Z.type==="checkbox"||Z.type==="radio")&&(xe=Pu);if(xe&&(xe=xe(e,M))){nl(ie,xe,r,te);break e}be&&be(e,Z,M),e==="focusout"&&(be=Z._wrapperState)&&be.controlled&&Z.type==="number"&&st(Z,"number",Z.value)}switch(be=M?Fn(M):window,e){case"focusin":(tl(be)||be.contentEditable==="true")&&(Rn=be,Mi=M,br=null);break;case"focusout":br=Mi=Rn=null;break;case"mousedown":Di=!0;break;case"contextmenu":case"mouseup":case"dragend":Di=!1,ul(ie,r,te);break;case"selectionchange":if(Uu)break;case"keydown":case"keyup":ul(ie,r,te)}var we;if(Ti)e:{switch(e){case"compositionstart":var ve="onCompositionStart";break e;case"compositionend":ve="onCompositionEnd";break e;case"compositionupdate":ve="onCompositionUpdate";break e}ve=void 0}else Ln?Za(e,r)&&(ve="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(ve="onCompositionStart");ve&&(Xa&&r.locale!=="ko"&&(Ln||ve!=="onCompositionStart"?ve==="onCompositionEnd"&&Ln&&(we=Ka()):(Qt=te,Si="value"in Qt?Qt.value:Qt.textContent,Ln=!0)),be=uo(M,ve),0<be.length&&(ve=new qa(ve,e,null,r,te),ie.push({event:ve,listeners:be}),we?ve.data=we:(we=el(r),we!==null&&(ve.data=we)))),(we=Eu?Au(e,r):Tu(e,r))&&(M=uo(M,"onBeforeInput"),0<M.length&&(te=new qa("onBeforeInput","beforeinput",null,r,te),ie.push({event:te,listeners:M}),te.data=we))}wl(ie,t)})}function vr(e,t,r){return{instance:e,listener:t,currentTarget:r}}function uo(e,t){for(var r=t+"Capture",o=[];e!==null;){var s=e,c=s.stateNode;s.tag===5&&c!==null&&(s=c,c=rr(e,r),c!=null&&o.unshift(vr(e,c,s)),c=rr(e,t),c!=null&&o.push(vr(e,c,s))),e=e.return}return o}function Dn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function vl(e,t,r,o,s){for(var c=t._reactName,h=[];r!==null&&r!==o;){var x=r,k=x.alternate,M=x.stateNode;if(k!==null&&k===o)break;x.tag===5&&M!==null&&(x=M,s?(k=rr(r,c),k!=null&&h.unshift(vr(r,k,x))):s||(k=rr(r,c),k!=null&&h.push(vr(r,k,x)))),r=r.return}h.length!==0&&e.push({event:t,listeners:h})}var Ku=/\r\n?/g,Vu=/\u0000|\uFFFD/g;function kl(e){return(typeof e=="string"?e:""+e).replace(Ku,`
`).replace(Vu,"")}function po(e,t,r){if(t=kl(t),kl(e)!==t&&r)throw Error(a(425))}function ho(){}var $i=null,Bi=null;function Hi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ki=typeof setTimeout=="function"?setTimeout:void 0,Gu=typeof clearTimeout=="function"?clearTimeout:void 0,jl=typeof Promise=="function"?Promise:void 0,qu=typeof queueMicrotask=="function"?queueMicrotask:typeof jl<"u"?function(e){return jl.resolve(null).then(e).catch(Qu)}:Ki;function Qu(e){setTimeout(function(){throw e})}function Vi(e,t){var r=t,o=0;do{var s=r.nextSibling;if(e.removeChild(r),s&&s.nodeType===8)if(r=s.data,r==="/$"){if(o===0){e.removeChild(s),pr(t);return}o--}else r!=="$"&&r!=="$?"&&r!=="$!"||o++;r=s}while(r);pr(t)}function Yt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Sl(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var Pn=Math.random().toString(36).slice(2),Lt="__reactFiber$"+Pn,kr="__reactProps$"+Pn,Pt="__reactContainer$"+Pn,Gi="__reactEvents$"+Pn,Xu="__reactListeners$"+Pn,Yu="__reactHandles$"+Pn;function hn(e){var t=e[Lt];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Pt]||r[Lt]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=Sl(e);e!==null;){if(r=e[Lt])return r;e=Sl(e)}return t}e=r,r=e.parentNode}return null}function jr(e){return e=e[Lt]||e[Pt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Fn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(a(33))}function fo(e){return e[kr]||null}var qi=[],Wn=-1;function Jt(e){return{current:e}}function Me(e){0>Wn||(e.current=qi[Wn],qi[Wn]=null,Wn--)}function Le(e,t){Wn++,qi[Wn]=e.current,e.current=t}var Zt={},et=Jt(Zt),lt=Jt(!1),fn=Zt;function On(e,t){var r=e.type.contextTypes;if(!r)return Zt;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var s={},c;for(c in r)s[c]=t[c];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function ct(e){return e=e.childContextTypes,e!=null}function go(){Me(lt),Me(et)}function Cl(e,t,r){if(et.current!==Zt)throw Error(a(168));Le(et,t),Le(lt,r)}function Nl(e,t,r){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return r;o=o.getChildContext();for(var s in o)if(!(s in t))throw Error(a(108,S(e)||"Unknown",s));return B({},r,o)}function mo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Zt,fn=et.current,Le(et,e),Le(lt,lt.current),!0}function Il(e,t,r){var o=e.stateNode;if(!o)throw Error(a(169));r?(e=Nl(e,t,fn),o.__reactInternalMemoizedMergedChildContext=e,Me(lt),Me(et),Le(et,e)):Me(lt),Le(lt,r)}var Ft=null,xo=!1,Qi=!1;function El(e){Ft===null?Ft=[e]:Ft.push(e)}function Ju(e){xo=!0,El(e)}function en(){if(!Qi&&Ft!==null){Qi=!0;var e=0,t=Ae;try{var r=Ft;for(Ae=1;e<r.length;e++){var o=r[e];do o=o(!0);while(o!==null)}Ft=null,xo=!1}catch(s){throw Ft!==null&&(Ft=Ft.slice(e+1)),Ta(xi,en),s}finally{Ae=t,Qi=!1}}return null}var Un=[],$n=0,_o=null,bo=0,_t=[],bt=0,gn=null,Wt=1,Ot="";function mn(e,t){Un[$n++]=bo,Un[$n++]=_o,_o=e,bo=t}function Al(e,t,r){_t[bt++]=Wt,_t[bt++]=Ot,_t[bt++]=gn,gn=e;var o=Wt;e=Ot;var s=32-St(o)-1;o&=~(1<<s),r+=1;var c=32-St(t)+s;if(30<c){var h=s-s%5;c=(o&(1<<h)-1).toString(32),o>>=h,s-=h,Wt=1<<32-St(t)+s|r<<s|o,Ot=c+e}else Wt=1<<c|r<<s|o,Ot=e}function Xi(e){e.return!==null&&(mn(e,1),Al(e,1,0))}function Yi(e){for(;e===_o;)_o=Un[--$n],Un[$n]=null,bo=Un[--$n],Un[$n]=null;for(;e===gn;)gn=_t[--bt],_t[bt]=null,Ot=_t[--bt],_t[bt]=null,Wt=_t[--bt],_t[bt]=null}var gt=null,mt=null,De=!1,Nt=null;function Tl(e,t){var r=kt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function zl(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,gt=e,mt=Yt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,gt=e,mt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=gn!==null?{id:Wt,overflow:Ot}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=kt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,gt=e,mt=null,!0):!1;default:return!1}}function Ji(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Zi(e){if(De){var t=mt;if(t){var r=t;if(!zl(e,t)){if(Ji(e))throw Error(a(418));t=Yt(r.nextSibling);var o=gt;t&&zl(e,t)?Tl(o,r):(e.flags=e.flags&-4097|2,De=!1,gt=e)}}else{if(Ji(e))throw Error(a(418));e.flags=e.flags&-4097|2,De=!1,gt=e}}}function Ll(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;gt=e}function wo(e){if(e!==gt)return!1;if(!De)return Ll(e),De=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Hi(e.type,e.memoizedProps)),t&&(t=mt)){if(Ji(e))throw Rl(),Error(a(418));for(;t;)Tl(e,t),t=Yt(t.nextSibling)}if(Ll(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(a(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){mt=Yt(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}mt=null}}else mt=gt?Yt(e.stateNode.nextSibling):null;return!0}function Rl(){for(var e=mt;e;)e=Yt(e.nextSibling)}function Bn(){mt=gt=null,De=!1}function es(e){Nt===null?Nt=[e]:Nt.push(e)}var Zu=U.ReactCurrentBatchConfig;function Sr(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(a(309));var o=r.stateNode}if(!o)throw Error(a(147,e));var s=o,c=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===c?t.ref:(t=function(h){var x=s.refs;h===null?delete x[c]:x[c]=h},t._stringRef=c,t)}if(typeof e!="string")throw Error(a(284));if(!r._owner)throw Error(a(290,e))}return e}function yo(e,t){throw e=Object.prototype.toString.call(t),Error(a(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ml(e){var t=e._init;return t(e._payload)}function Dl(e){function t(I,j){if(e){var L=I.deletions;L===null?(I.deletions=[j],I.flags|=16):L.push(j)}}function r(I,j){if(!e)return null;for(;j!==null;)t(I,j),j=j.sibling;return null}function o(I,j){for(I=new Map;j!==null;)j.key!==null?I.set(j.key,j):I.set(j.index,j),j=j.sibling;return I}function s(I,j){return I=cn(I,j),I.index=0,I.sibling=null,I}function c(I,j,L){return I.index=L,e?(L=I.alternate,L!==null?(L=L.index,L<j?(I.flags|=2,j):L):(I.flags|=2,j)):(I.flags|=1048576,j)}function h(I){return e&&I.alternate===null&&(I.flags|=2),I}function x(I,j,L,ae){return j===null||j.tag!==6?(j=Ks(L,I.mode,ae),j.return=I,j):(j=s(j,L),j.return=I,j)}function k(I,j,L,ae){var xe=L.type;return xe===X?te(I,j,L.props.children,ae,L.key):j!==null&&(j.elementType===xe||typeof xe=="object"&&xe!==null&&xe.$$typeof===ce&&Ml(xe)===j.type)?(ae=s(j,L.props),ae.ref=Sr(I,j,L),ae.return=I,ae):(ae=Ko(L.type,L.key,L.props,null,I.mode,ae),ae.ref=Sr(I,j,L),ae.return=I,ae)}function M(I,j,L,ae){return j===null||j.tag!==4||j.stateNode.containerInfo!==L.containerInfo||j.stateNode.implementation!==L.implementation?(j=Vs(L,I.mode,ae),j.return=I,j):(j=s(j,L.children||[]),j.return=I,j)}function te(I,j,L,ae,xe){return j===null||j.tag!==7?(j=jn(L,I.mode,ae,xe),j.return=I,j):(j=s(j,L),j.return=I,j)}function ie(I,j,L){if(typeof j=="string"&&j!==""||typeof j=="number")return j=Ks(""+j,I.mode,L),j.return=I,j;if(typeof j=="object"&&j!==null){switch(j.$$typeof){case J:return L=Ko(j.type,j.key,j.props,null,I.mode,L),L.ref=Sr(I,null,j),L.return=I,L;case Q:return j=Vs(j,I.mode,L),j.return=I,j;case ce:var ae=j._init;return ie(I,ae(j._payload),L)}if(at(j)||W(j))return j=jn(j,I.mode,L,null),j.return=I,j;yo(I,j)}return null}function Z(I,j,L,ae){var xe=j!==null?j.key:null;if(typeof L=="string"&&L!==""||typeof L=="number")return xe!==null?null:x(I,j,""+L,ae);if(typeof L=="object"&&L!==null){switch(L.$$typeof){case J:return L.key===xe?k(I,j,L,ae):null;case Q:return L.key===xe?M(I,j,L,ae):null;case ce:return xe=L._init,Z(I,j,xe(L._payload),ae)}if(at(L)||W(L))return xe!==null?null:te(I,j,L,ae,null);yo(I,L)}return null}function ue(I,j,L,ae,xe){if(typeof ae=="string"&&ae!==""||typeof ae=="number")return I=I.get(L)||null,x(j,I,""+ae,xe);if(typeof ae=="object"&&ae!==null){switch(ae.$$typeof){case J:return I=I.get(ae.key===null?L:ae.key)||null,k(j,I,ae,xe);case Q:return I=I.get(ae.key===null?L:ae.key)||null,M(j,I,ae,xe);case ce:var be=ae._init;return ue(I,j,L,be(ae._payload),xe)}if(at(ae)||W(ae))return I=I.get(L)||null,te(j,I,ae,xe,null);yo(j,ae)}return null}function fe(I,j,L,ae){for(var xe=null,be=null,we=j,ve=j=0,Ye=null;we!==null&&ve<L.length;ve++){we.index>ve?(Ye=we,we=null):Ye=we.sibling;var Ie=Z(I,we,L[ve],ae);if(Ie===null){we===null&&(we=Ye);break}e&&we&&Ie.alternate===null&&t(I,we),j=c(Ie,j,ve),be===null?xe=Ie:be.sibling=Ie,be=Ie,we=Ye}if(ve===L.length)return r(I,we),De&&mn(I,ve),xe;if(we===null){for(;ve<L.length;ve++)we=ie(I,L[ve],ae),we!==null&&(j=c(we,j,ve),be===null?xe=we:be.sibling=we,be=we);return De&&mn(I,ve),xe}for(we=o(I,we);ve<L.length;ve++)Ye=ue(we,I,ve,L[ve],ae),Ye!==null&&(e&&Ye.alternate!==null&&we.delete(Ye.key===null?ve:Ye.key),j=c(Ye,j,ve),be===null?xe=Ye:be.sibling=Ye,be=Ye);return e&&we.forEach(function(dn){return t(I,dn)}),De&&mn(I,ve),xe}function me(I,j,L,ae){var xe=W(L);if(typeof xe!="function")throw Error(a(150));if(L=xe.call(L),L==null)throw Error(a(151));for(var be=xe=null,we=j,ve=j=0,Ye=null,Ie=L.next();we!==null&&!Ie.done;ve++,Ie=L.next()){we.index>ve?(Ye=we,we=null):Ye=we.sibling;var dn=Z(I,we,Ie.value,ae);if(dn===null){we===null&&(we=Ye);break}e&&we&&dn.alternate===null&&t(I,we),j=c(dn,j,ve),be===null?xe=dn:be.sibling=dn,be=dn,we=Ye}if(Ie.done)return r(I,we),De&&mn(I,ve),xe;if(we===null){for(;!Ie.done;ve++,Ie=L.next())Ie=ie(I,Ie.value,ae),Ie!==null&&(j=c(Ie,j,ve),be===null?xe=Ie:be.sibling=Ie,be=Ie);return De&&mn(I,ve),xe}for(we=o(I,we);!Ie.done;ve++,Ie=L.next())Ie=ue(we,I,ve,Ie.value,ae),Ie!==null&&(e&&Ie.alternate!==null&&we.delete(Ie.key===null?ve:Ie.key),j=c(Ie,j,ve),be===null?xe=Ie:be.sibling=Ie,be=Ie);return e&&we.forEach(function(zp){return t(I,zp)}),De&&mn(I,ve),xe}function Be(I,j,L,ae){if(typeof L=="object"&&L!==null&&L.type===X&&L.key===null&&(L=L.props.children),typeof L=="object"&&L!==null){switch(L.$$typeof){case J:e:{for(var xe=L.key,be=j;be!==null;){if(be.key===xe){if(xe=L.type,xe===X){if(be.tag===7){r(I,be.sibling),j=s(be,L.props.children),j.return=I,I=j;break e}}else if(be.elementType===xe||typeof xe=="object"&&xe!==null&&xe.$$typeof===ce&&Ml(xe)===be.type){r(I,be.sibling),j=s(be,L.props),j.ref=Sr(I,be,L),j.return=I,I=j;break e}r(I,be);break}else t(I,be);be=be.sibling}L.type===X?(j=jn(L.props.children,I.mode,ae,L.key),j.return=I,I=j):(ae=Ko(L.type,L.key,L.props,null,I.mode,ae),ae.ref=Sr(I,j,L),ae.return=I,I=ae)}return h(I);case Q:e:{for(be=L.key;j!==null;){if(j.key===be)if(j.tag===4&&j.stateNode.containerInfo===L.containerInfo&&j.stateNode.implementation===L.implementation){r(I,j.sibling),j=s(j,L.children||[]),j.return=I,I=j;break e}else{r(I,j);break}else t(I,j);j=j.sibling}j=Vs(L,I.mode,ae),j.return=I,I=j}return h(I);case ce:return be=L._init,Be(I,j,be(L._payload),ae)}if(at(L))return fe(I,j,L,ae);if(W(L))return me(I,j,L,ae);yo(I,L)}return typeof L=="string"&&L!==""||typeof L=="number"?(L=""+L,j!==null&&j.tag===6?(r(I,j.sibling),j=s(j,L),j.return=I,I=j):(r(I,j),j=Ks(L,I.mode,ae),j.return=I,I=j),h(I)):r(I,j)}return Be}var Hn=Dl(!0),Pl=Dl(!1),vo=Jt(null),ko=null,Kn=null,ts=null;function ns(){ts=Kn=ko=null}function rs(e){var t=vo.current;Me(vo),e._currentValue=t}function os(e,t,r){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===r)break;e=e.return}}function Vn(e,t){ko=e,ts=Kn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(dt=!0),e.firstContext=null)}function wt(e){var t=e._currentValue;if(ts!==e)if(e={context:e,memoizedValue:t,next:null},Kn===null){if(ko===null)throw Error(a(308));Kn=e,ko.dependencies={lanes:0,firstContext:e}}else Kn=Kn.next=e;return t}var xn=null;function is(e){xn===null?xn=[e]:xn.push(e)}function Fl(e,t,r,o){var s=t.interleaved;return s===null?(r.next=r,is(t)):(r.next=s.next,s.next=r),t.interleaved=r,Ut(e,o)}function Ut(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var tn=!1;function ss(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Wl(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function $t(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function nn(e,t,r){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ne&2)!==0){var s=o.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),o.pending=t,Ut(e,r)}return s=o.interleaved,s===null?(t.next=t,is(o)):(t.next=s.next,s.next=t),o.interleaved=t,Ut(e,r)}function jo(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,wi(e,r)}}function Ol(e,t){var r=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,r===o)){var s=null,c=null;if(r=r.firstBaseUpdate,r!==null){do{var h={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};c===null?s=c=h:c=c.next=h,r=r.next}while(r!==null);c===null?s=c=t:c=c.next=t}else s=c=t;r={baseState:o.baseState,firstBaseUpdate:s,lastBaseUpdate:c,shared:o.shared,effects:o.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function So(e,t,r,o){var s=e.updateQueue;tn=!1;var c=s.firstBaseUpdate,h=s.lastBaseUpdate,x=s.shared.pending;if(x!==null){s.shared.pending=null;var k=x,M=k.next;k.next=null,h===null?c=M:h.next=M,h=k;var te=e.alternate;te!==null&&(te=te.updateQueue,x=te.lastBaseUpdate,x!==h&&(x===null?te.firstBaseUpdate=M:x.next=M,te.lastBaseUpdate=k))}if(c!==null){var ie=s.baseState;h=0,te=M=k=null,x=c;do{var Z=x.lane,ue=x.eventTime;if((o&Z)===Z){te!==null&&(te=te.next={eventTime:ue,lane:0,tag:x.tag,payload:x.payload,callback:x.callback,next:null});e:{var fe=e,me=x;switch(Z=t,ue=r,me.tag){case 1:if(fe=me.payload,typeof fe=="function"){ie=fe.call(ue,ie,Z);break e}ie=fe;break e;case 3:fe.flags=fe.flags&-65537|128;case 0:if(fe=me.payload,Z=typeof fe=="function"?fe.call(ue,ie,Z):fe,Z==null)break e;ie=B({},ie,Z);break e;case 2:tn=!0}}x.callback!==null&&x.lane!==0&&(e.flags|=64,Z=s.effects,Z===null?s.effects=[x]:Z.push(x))}else ue={eventTime:ue,lane:Z,tag:x.tag,payload:x.payload,callback:x.callback,next:null},te===null?(M=te=ue,k=ie):te=te.next=ue,h|=Z;if(x=x.next,x===null){if(x=s.shared.pending,x===null)break;Z=x,x=Z.next,Z.next=null,s.lastBaseUpdate=Z,s.shared.pending=null}}while(!0);if(te===null&&(k=ie),s.baseState=k,s.firstBaseUpdate=M,s.lastBaseUpdate=te,t=s.shared.interleaved,t!==null){s=t;do h|=s.lane,s=s.next;while(s!==t)}else c===null&&(s.shared.lanes=0);wn|=h,e.lanes=h,e.memoizedState=ie}}function Ul(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],s=o.callback;if(s!==null){if(o.callback=null,o=r,typeof s!="function")throw Error(a(191,s));s.call(o)}}}var Cr={},Rt=Jt(Cr),Nr=Jt(Cr),Ir=Jt(Cr);function _n(e){if(e===Cr)throw Error(a(174));return e}function as(e,t){switch(Le(Ir,t),Le(Nr,e),Le(Rt,Cr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:li(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=li(t,e)}Me(Rt),Le(Rt,t)}function Gn(){Me(Rt),Me(Nr),Me(Ir)}function $l(e){_n(Ir.current);var t=_n(Rt.current),r=li(t,e.type);t!==r&&(Le(Nr,e),Le(Rt,r))}function ls(e){Nr.current===e&&(Me(Rt),Me(Nr))}var Pe=Jt(0);function Co(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var cs=[];function ds(){for(var e=0;e<cs.length;e++)cs[e]._workInProgressVersionPrimary=null;cs.length=0}var No=U.ReactCurrentDispatcher,us=U.ReactCurrentBatchConfig,bn=0,Fe=null,Ve=null,Qe=null,Io=!1,Er=!1,Ar=0,ep=0;function tt(){throw Error(a(321))}function ps(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Ct(e[r],t[r]))return!1;return!0}function hs(e,t,r,o,s,c){if(bn=c,Fe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,No.current=e===null||e.memoizedState===null?op:ip,e=r(o,s),Er){c=0;do{if(Er=!1,Ar=0,25<=c)throw Error(a(301));c+=1,Qe=Ve=null,t.updateQueue=null,No.current=sp,e=r(o,s)}while(Er)}if(No.current=To,t=Ve!==null&&Ve.next!==null,bn=0,Qe=Ve=Fe=null,Io=!1,t)throw Error(a(300));return e}function fs(){var e=Ar!==0;return Ar=0,e}function Mt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qe===null?Fe.memoizedState=Qe=e:Qe=Qe.next=e,Qe}function yt(){if(Ve===null){var e=Fe.alternate;e=e!==null?e.memoizedState:null}else e=Ve.next;var t=Qe===null?Fe.memoizedState:Qe.next;if(t!==null)Qe=t,Ve=e;else{if(e===null)throw Error(a(310));Ve=e,e={memoizedState:Ve.memoizedState,baseState:Ve.baseState,baseQueue:Ve.baseQueue,queue:Ve.queue,next:null},Qe===null?Fe.memoizedState=Qe=e:Qe=Qe.next=e}return Qe}function Tr(e,t){return typeof t=="function"?t(e):t}function gs(e){var t=yt(),r=t.queue;if(r===null)throw Error(a(311));r.lastRenderedReducer=e;var o=Ve,s=o.baseQueue,c=r.pending;if(c!==null){if(s!==null){var h=s.next;s.next=c.next,c.next=h}o.baseQueue=s=c,r.pending=null}if(s!==null){c=s.next,o=o.baseState;var x=h=null,k=null,M=c;do{var te=M.lane;if((bn&te)===te)k!==null&&(k=k.next={lane:0,action:M.action,hasEagerState:M.hasEagerState,eagerState:M.eagerState,next:null}),o=M.hasEagerState?M.eagerState:e(o,M.action);else{var ie={lane:te,action:M.action,hasEagerState:M.hasEagerState,eagerState:M.eagerState,next:null};k===null?(x=k=ie,h=o):k=k.next=ie,Fe.lanes|=te,wn|=te}M=M.next}while(M!==null&&M!==c);k===null?h=o:k.next=x,Ct(o,t.memoizedState)||(dt=!0),t.memoizedState=o,t.baseState=h,t.baseQueue=k,r.lastRenderedState=o}if(e=r.interleaved,e!==null){s=e;do c=s.lane,Fe.lanes|=c,wn|=c,s=s.next;while(s!==e)}else s===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function ms(e){var t=yt(),r=t.queue;if(r===null)throw Error(a(311));r.lastRenderedReducer=e;var o=r.dispatch,s=r.pending,c=t.memoizedState;if(s!==null){r.pending=null;var h=s=s.next;do c=e(c,h.action),h=h.next;while(h!==s);Ct(c,t.memoizedState)||(dt=!0),t.memoizedState=c,t.baseQueue===null&&(t.baseState=c),r.lastRenderedState=c}return[c,o]}function Bl(){}function Hl(e,t){var r=Fe,o=yt(),s=t(),c=!Ct(o.memoizedState,s);if(c&&(o.memoizedState=s,dt=!0),o=o.queue,xs(Gl.bind(null,r,o,e),[e]),o.getSnapshot!==t||c||Qe!==null&&Qe.memoizedState.tag&1){if(r.flags|=2048,zr(9,Vl.bind(null,r,o,s,t),void 0,null),Xe===null)throw Error(a(349));(bn&30)!==0||Kl(r,t,s)}return s}function Kl(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=Fe.updateQueue,t===null?(t={lastEffect:null,stores:null},Fe.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function Vl(e,t,r,o){t.value=r,t.getSnapshot=o,ql(t)&&Ql(e)}function Gl(e,t,r){return r(function(){ql(t)&&Ql(e)})}function ql(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Ct(e,r)}catch{return!0}}function Ql(e){var t=Ut(e,1);t!==null&&Tt(t,e,1,-1)}function Xl(e){var t=Mt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Tr,lastRenderedState:e},t.queue=e,e=e.dispatch=rp.bind(null,Fe,e),[t.memoizedState,e]}function zr(e,t,r,o){return e={tag:e,create:t,destroy:r,deps:o,next:null},t=Fe.updateQueue,t===null?(t={lastEffect:null,stores:null},Fe.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(o=r.next,r.next=e,e.next=o,t.lastEffect=e)),e}function Yl(){return yt().memoizedState}function Eo(e,t,r,o){var s=Mt();Fe.flags|=e,s.memoizedState=zr(1|t,r,void 0,o===void 0?null:o)}function Ao(e,t,r,o){var s=yt();o=o===void 0?null:o;var c=void 0;if(Ve!==null){var h=Ve.memoizedState;if(c=h.destroy,o!==null&&ps(o,h.deps)){s.memoizedState=zr(t,r,c,o);return}}Fe.flags|=e,s.memoizedState=zr(1|t,r,c,o)}function Jl(e,t){return Eo(8390656,8,e,t)}function xs(e,t){return Ao(2048,8,e,t)}function Zl(e,t){return Ao(4,2,e,t)}function ec(e,t){return Ao(4,4,e,t)}function tc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function nc(e,t,r){return r=r!=null?r.concat([e]):null,Ao(4,4,tc.bind(null,t,e),r)}function _s(){}function rc(e,t){var r=yt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&ps(t,o[1])?o[0]:(r.memoizedState=[e,t],e)}function oc(e,t){var r=yt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&ps(t,o[1])?o[0]:(e=e(),r.memoizedState=[e,t],e)}function ic(e,t,r){return(bn&21)===0?(e.baseState&&(e.baseState=!1,dt=!0),e.memoizedState=r):(Ct(r,t)||(r=Ma(),Fe.lanes|=r,wn|=r,e.baseState=!0),t)}function tp(e,t){var r=Ae;Ae=r!==0&&4>r?r:4,e(!0);var o=us.transition;us.transition={};try{e(!1),t()}finally{Ae=r,us.transition=o}}function sc(){return yt().memoizedState}function np(e,t,r){var o=an(e);if(r={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null},ac(e))lc(t,r);else if(r=Fl(e,t,r,o),r!==null){var s=it();Tt(r,e,o,s),cc(r,t,o)}}function rp(e,t,r){var o=an(e),s={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null};if(ac(e))lc(t,s);else{var c=e.alternate;if(e.lanes===0&&(c===null||c.lanes===0)&&(c=t.lastRenderedReducer,c!==null))try{var h=t.lastRenderedState,x=c(h,r);if(s.hasEagerState=!0,s.eagerState=x,Ct(x,h)){var k=t.interleaved;k===null?(s.next=s,is(t)):(s.next=k.next,k.next=s),t.interleaved=s;return}}catch{}r=Fl(e,t,s,o),r!==null&&(s=it(),Tt(r,e,o,s),cc(r,t,o))}}function ac(e){var t=e.alternate;return e===Fe||t!==null&&t===Fe}function lc(e,t){Er=Io=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function cc(e,t,r){if((r&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,wi(e,r)}}var To={readContext:wt,useCallback:tt,useContext:tt,useEffect:tt,useImperativeHandle:tt,useInsertionEffect:tt,useLayoutEffect:tt,useMemo:tt,useReducer:tt,useRef:tt,useState:tt,useDebugValue:tt,useDeferredValue:tt,useTransition:tt,useMutableSource:tt,useSyncExternalStore:tt,useId:tt,unstable_isNewReconciler:!1},op={readContext:wt,useCallback:function(e,t){return Mt().memoizedState=[e,t===void 0?null:t],e},useContext:wt,useEffect:Jl,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Eo(4194308,4,tc.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Eo(4194308,4,e,t)},useInsertionEffect:function(e,t){return Eo(4,2,e,t)},useMemo:function(e,t){var r=Mt();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var o=Mt();return t=r!==void 0?r(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=np.bind(null,Fe,e),[o.memoizedState,e]},useRef:function(e){var t=Mt();return e={current:e},t.memoizedState=e},useState:Xl,useDebugValue:_s,useDeferredValue:function(e){return Mt().memoizedState=e},useTransition:function(){var e=Xl(!1),t=e[0];return e=tp.bind(null,e[1]),Mt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var o=Fe,s=Mt();if(De){if(r===void 0)throw Error(a(407));r=r()}else{if(r=t(),Xe===null)throw Error(a(349));(bn&30)!==0||Kl(o,t,r)}s.memoizedState=r;var c={value:r,getSnapshot:t};return s.queue=c,Jl(Gl.bind(null,o,c,e),[e]),o.flags|=2048,zr(9,Vl.bind(null,o,c,r,t),void 0,null),r},useId:function(){var e=Mt(),t=Xe.identifierPrefix;if(De){var r=Ot,o=Wt;r=(o&~(1<<32-St(o)-1)).toString(32)+r,t=":"+t+"R"+r,r=Ar++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=ep++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ip={readContext:wt,useCallback:rc,useContext:wt,useEffect:xs,useImperativeHandle:nc,useInsertionEffect:Zl,useLayoutEffect:ec,useMemo:oc,useReducer:gs,useRef:Yl,useState:function(){return gs(Tr)},useDebugValue:_s,useDeferredValue:function(e){var t=yt();return ic(t,Ve.memoizedState,e)},useTransition:function(){var e=gs(Tr)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Bl,useSyncExternalStore:Hl,useId:sc,unstable_isNewReconciler:!1},sp={readContext:wt,useCallback:rc,useContext:wt,useEffect:xs,useImperativeHandle:nc,useInsertionEffect:Zl,useLayoutEffect:ec,useMemo:oc,useReducer:ms,useRef:Yl,useState:function(){return ms(Tr)},useDebugValue:_s,useDeferredValue:function(e){var t=yt();return Ve===null?t.memoizedState=e:ic(t,Ve.memoizedState,e)},useTransition:function(){var e=ms(Tr)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Bl,useSyncExternalStore:Hl,useId:sc,unstable_isNewReconciler:!1};function It(e,t){if(e&&e.defaultProps){t=B({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function bs(e,t,r,o){t=e.memoizedState,r=r(o,t),r=r==null?t:B({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var zo={isMounted:function(e){return(e=e._reactInternals)?pn(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var o=it(),s=an(e),c=$t(o,s);c.payload=t,r!=null&&(c.callback=r),t=nn(e,c,s),t!==null&&(Tt(t,e,s,o),jo(t,e,s))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var o=it(),s=an(e),c=$t(o,s);c.tag=1,c.payload=t,r!=null&&(c.callback=r),t=nn(e,c,s),t!==null&&(Tt(t,e,s,o),jo(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=it(),o=an(e),s=$t(r,o);s.tag=2,t!=null&&(s.callback=t),t=nn(e,s,o),t!==null&&(Tt(t,e,o,r),jo(t,e,o))}};function dc(e,t,r,o,s,c,h){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,c,h):t.prototype&&t.prototype.isPureReactComponent?!_r(r,o)||!_r(s,c):!0}function uc(e,t,r){var o=!1,s=Zt,c=t.contextType;return typeof c=="object"&&c!==null?c=wt(c):(s=ct(t)?fn:et.current,o=t.contextTypes,c=(o=o!=null)?On(e,s):Zt),t=new t(r,c),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=zo,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=c),t}function pc(e,t,r,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,o),t.state!==e&&zo.enqueueReplaceState(t,t.state,null)}function ws(e,t,r,o){var s=e.stateNode;s.props=r,s.state=e.memoizedState,s.refs={},ss(e);var c=t.contextType;typeof c=="object"&&c!==null?s.context=wt(c):(c=ct(t)?fn:et.current,s.context=On(e,c)),s.state=e.memoizedState,c=t.getDerivedStateFromProps,typeof c=="function"&&(bs(e,t,c,r),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&zo.enqueueReplaceState(s,s.state,null),So(e,r,s,o),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function qn(e,t){try{var r="",o=t;do r+=E(o),o=o.return;while(o);var s=r}catch(c){s=`
Error generating stack: `+c.message+`
`+c.stack}return{value:e,source:t,stack:s,digest:null}}function ys(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function vs(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var ap=typeof WeakMap=="function"?WeakMap:Map;function hc(e,t,r){r=$t(-1,r),r.tag=3,r.payload={element:null};var o=t.value;return r.callback=function(){Wo||(Wo=!0,Ps=o),vs(e,t)},r}function fc(e,t,r){r=$t(-1,r),r.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var s=t.value;r.payload=function(){return o(s)},r.callback=function(){vs(e,t)}}var c=e.stateNode;return c!==null&&typeof c.componentDidCatch=="function"&&(r.callback=function(){vs(e,t),typeof o!="function"&&(on===null?on=new Set([this]):on.add(this));var h=t.stack;this.componentDidCatch(t.value,{componentStack:h!==null?h:""})}),r}function gc(e,t,r){var o=e.pingCache;if(o===null){o=e.pingCache=new ap;var s=new Set;o.set(t,s)}else s=o.get(t),s===void 0&&(s=new Set,o.set(t,s));s.has(r)||(s.add(r),e=yp.bind(null,e,t,r),t.then(e,e))}function mc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function xc(e,t,r,o,s){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=$t(-1,1),t.tag=2,nn(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=s,e)}var lp=U.ReactCurrentOwner,dt=!1;function ot(e,t,r,o){t.child=e===null?Pl(t,null,r,o):Hn(t,e.child,r,o)}function _c(e,t,r,o,s){r=r.render;var c=t.ref;return Vn(t,s),o=hs(e,t,r,o,c,s),r=fs(),e!==null&&!dt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,Bt(e,t,s)):(De&&r&&Xi(t),t.flags|=1,ot(e,t,o,s),t.child)}function bc(e,t,r,o,s){if(e===null){var c=r.type;return typeof c=="function"&&!Hs(c)&&c.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=c,wc(e,t,c,o,s)):(e=Ko(r.type,null,o,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(c=e.child,(e.lanes&s)===0){var h=c.memoizedProps;if(r=r.compare,r=r!==null?r:_r,r(h,o)&&e.ref===t.ref)return Bt(e,t,s)}return t.flags|=1,e=cn(c,o),e.ref=t.ref,e.return=t,t.child=e}function wc(e,t,r,o,s){if(e!==null){var c=e.memoizedProps;if(_r(c,o)&&e.ref===t.ref)if(dt=!1,t.pendingProps=o=c,(e.lanes&s)!==0)(e.flags&131072)!==0&&(dt=!0);else return t.lanes=e.lanes,Bt(e,t,s)}return ks(e,t,r,o,s)}function yc(e,t,r){var o=t.pendingProps,s=o.children,c=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Le(Xn,xt),xt|=r;else{if((r&1073741824)===0)return e=c!==null?c.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Le(Xn,xt),xt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=c!==null?c.baseLanes:r,Le(Xn,xt),xt|=o}else c!==null?(o=c.baseLanes|r,t.memoizedState=null):o=r,Le(Xn,xt),xt|=o;return ot(e,t,s,r),t.child}function vc(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function ks(e,t,r,o,s){var c=ct(r)?fn:et.current;return c=On(t,c),Vn(t,s),r=hs(e,t,r,o,c,s),o=fs(),e!==null&&!dt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,Bt(e,t,s)):(De&&o&&Xi(t),t.flags|=1,ot(e,t,r,s),t.child)}function kc(e,t,r,o,s){if(ct(r)){var c=!0;mo(t)}else c=!1;if(Vn(t,s),t.stateNode===null)Ro(e,t),uc(t,r,o),ws(t,r,o,s),o=!0;else if(e===null){var h=t.stateNode,x=t.memoizedProps;h.props=x;var k=h.context,M=r.contextType;typeof M=="object"&&M!==null?M=wt(M):(M=ct(r)?fn:et.current,M=On(t,M));var te=r.getDerivedStateFromProps,ie=typeof te=="function"||typeof h.getSnapshotBeforeUpdate=="function";ie||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(x!==o||k!==M)&&pc(t,h,o,M),tn=!1;var Z=t.memoizedState;h.state=Z,So(t,o,h,s),k=t.memoizedState,x!==o||Z!==k||lt.current||tn?(typeof te=="function"&&(bs(t,r,te,o),k=t.memoizedState),(x=tn||dc(t,r,x,o,Z,k,M))?(ie||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount()),typeof h.componentDidMount=="function"&&(t.flags|=4194308)):(typeof h.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=k),h.props=o,h.state=k,h.context=M,o=x):(typeof h.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{h=t.stateNode,Wl(e,t),x=t.memoizedProps,M=t.type===t.elementType?x:It(t.type,x),h.props=M,ie=t.pendingProps,Z=h.context,k=r.contextType,typeof k=="object"&&k!==null?k=wt(k):(k=ct(r)?fn:et.current,k=On(t,k));var ue=r.getDerivedStateFromProps;(te=typeof ue=="function"||typeof h.getSnapshotBeforeUpdate=="function")||typeof h.UNSAFE_componentWillReceiveProps!="function"&&typeof h.componentWillReceiveProps!="function"||(x!==ie||Z!==k)&&pc(t,h,o,k),tn=!1,Z=t.memoizedState,h.state=Z,So(t,o,h,s);var fe=t.memoizedState;x!==ie||Z!==fe||lt.current||tn?(typeof ue=="function"&&(bs(t,r,ue,o),fe=t.memoizedState),(M=tn||dc(t,r,M,o,Z,fe,k)||!1)?(te||typeof h.UNSAFE_componentWillUpdate!="function"&&typeof h.componentWillUpdate!="function"||(typeof h.componentWillUpdate=="function"&&h.componentWillUpdate(o,fe,k),typeof h.UNSAFE_componentWillUpdate=="function"&&h.UNSAFE_componentWillUpdate(o,fe,k)),typeof h.componentDidUpdate=="function"&&(t.flags|=4),typeof h.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof h.componentDidUpdate!="function"||x===e.memoizedProps&&Z===e.memoizedState||(t.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&Z===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=fe),h.props=o,h.state=fe,h.context=k,o=M):(typeof h.componentDidUpdate!="function"||x===e.memoizedProps&&Z===e.memoizedState||(t.flags|=4),typeof h.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&Z===e.memoizedState||(t.flags|=1024),o=!1)}return js(e,t,r,o,c,s)}function js(e,t,r,o,s,c){vc(e,t);var h=(t.flags&128)!==0;if(!o&&!h)return s&&Il(t,r,!1),Bt(e,t,c);o=t.stateNode,lp.current=t;var x=h&&typeof r.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&h?(t.child=Hn(t,e.child,null,c),t.child=Hn(t,null,x,c)):ot(e,t,x,c),t.memoizedState=o.state,s&&Il(t,r,!0),t.child}function jc(e){var t=e.stateNode;t.pendingContext?Cl(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Cl(e,t.context,!1),as(e,t.containerInfo)}function Sc(e,t,r,o,s){return Bn(),es(s),t.flags|=256,ot(e,t,r,o),t.child}var Ss={dehydrated:null,treeContext:null,retryLane:0};function Cs(e){return{baseLanes:e,cachePool:null,transitions:null}}function Cc(e,t,r){var o=t.pendingProps,s=Pe.current,c=!1,h=(t.flags&128)!==0,x;if((x=h)||(x=e!==null&&e.memoizedState===null?!1:(s&2)!==0),x?(c=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),Le(Pe,s&1),e===null)return Zi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(h=o.children,e=o.fallback,c?(o=t.mode,c=t.child,h={mode:"hidden",children:h},(o&1)===0&&c!==null?(c.childLanes=0,c.pendingProps=h):c=Vo(h,o,0,null),e=jn(e,o,r,null),c.return=t,e.return=t,c.sibling=e,t.child=c,t.child.memoizedState=Cs(r),t.memoizedState=Ss,e):Ns(t,h));if(s=e.memoizedState,s!==null&&(x=s.dehydrated,x!==null))return cp(e,t,h,o,x,s,r);if(c){c=o.fallback,h=t.mode,s=e.child,x=s.sibling;var k={mode:"hidden",children:o.children};return(h&1)===0&&t.child!==s?(o=t.child,o.childLanes=0,o.pendingProps=k,t.deletions=null):(o=cn(s,k),o.subtreeFlags=s.subtreeFlags&14680064),x!==null?c=cn(x,c):(c=jn(c,h,r,null),c.flags|=2),c.return=t,o.return=t,o.sibling=c,t.child=o,o=c,c=t.child,h=e.child.memoizedState,h=h===null?Cs(r):{baseLanes:h.baseLanes|r,cachePool:null,transitions:h.transitions},c.memoizedState=h,c.childLanes=e.childLanes&~r,t.memoizedState=Ss,o}return c=e.child,e=c.sibling,o=cn(c,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=r),o.return=t,o.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=o,t.memoizedState=null,o}function Ns(e,t){return t=Vo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Lo(e,t,r,o){return o!==null&&es(o),Hn(t,e.child,null,r),e=Ns(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function cp(e,t,r,o,s,c,h){if(r)return t.flags&256?(t.flags&=-257,o=ys(Error(a(422))),Lo(e,t,h,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(c=o.fallback,s=t.mode,o=Vo({mode:"visible",children:o.children},s,0,null),c=jn(c,s,h,null),c.flags|=2,o.return=t,c.return=t,o.sibling=c,t.child=o,(t.mode&1)!==0&&Hn(t,e.child,null,h),t.child.memoizedState=Cs(h),t.memoizedState=Ss,c);if((t.mode&1)===0)return Lo(e,t,h,null);if(s.data==="$!"){if(o=s.nextSibling&&s.nextSibling.dataset,o)var x=o.dgst;return o=x,c=Error(a(419)),o=ys(c,o,void 0),Lo(e,t,h,o)}if(x=(h&e.childLanes)!==0,dt||x){if(o=Xe,o!==null){switch(h&-h){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(o.suspendedLanes|h))!==0?0:s,s!==0&&s!==c.retryLane&&(c.retryLane=s,Ut(e,s),Tt(o,e,s,-1))}return Bs(),o=ys(Error(a(421))),Lo(e,t,h,o)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=vp.bind(null,e),s._reactRetry=t,null):(e=c.treeContext,mt=Yt(s.nextSibling),gt=t,De=!0,Nt=null,e!==null&&(_t[bt++]=Wt,_t[bt++]=Ot,_t[bt++]=gn,Wt=e.id,Ot=e.overflow,gn=t),t=Ns(t,o.children),t.flags|=4096,t)}function Nc(e,t,r){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),os(e.return,t,r)}function Is(e,t,r,o,s){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:r,tailMode:s}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=r,c.tailMode=s)}function Ic(e,t,r){var o=t.pendingProps,s=o.revealOrder,c=o.tail;if(ot(e,t,o.children,r),o=Pe.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Nc(e,r,t);else if(e.tag===19)Nc(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(Le(Pe,o),(t.mode&1)===0)t.memoizedState=null;else switch(s){case"forwards":for(r=t.child,s=null;r!==null;)e=r.alternate,e!==null&&Co(e)===null&&(s=r),r=r.sibling;r=s,r===null?(s=t.child,t.child=null):(s=r.sibling,r.sibling=null),Is(t,!1,s,r,c);break;case"backwards":for(r=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&Co(e)===null){t.child=s;break}e=s.sibling,s.sibling=r,r=s,s=e}Is(t,!0,r,null,c);break;case"together":Is(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ro(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Bt(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),wn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(a(153));if(t.child!==null){for(e=t.child,r=cn(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=cn(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function dp(e,t,r){switch(t.tag){case 3:jc(t),Bn();break;case 5:$l(t);break;case 1:ct(t.type)&&mo(t);break;case 4:as(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,s=t.memoizedProps.value;Le(vo,o._currentValue),o._currentValue=s;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(Le(Pe,Pe.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?Cc(e,t,r):(Le(Pe,Pe.current&1),e=Bt(e,t,r),e!==null?e.sibling:null);Le(Pe,Pe.current&1);break;case 19:if(o=(r&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Ic(e,t,r);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),Le(Pe,Pe.current),o)break;return null;case 22:case 23:return t.lanes=0,yc(e,t,r)}return Bt(e,t,r)}var Ec,Es,Ac,Tc;Ec=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},Es=function(){},Ac=function(e,t,r,o){var s=e.memoizedProps;if(s!==o){e=t.stateNode,_n(Rt.current);var c=null;switch(r){case"input":s=ye(e,s),o=ye(e,o),c=[];break;case"select":s=B({},s,{value:void 0}),o=B({},o,{value:void 0}),c=[];break;case"textarea":s=ai(e,s),o=ai(e,o),c=[];break;default:typeof s.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=ho)}ci(r,o);var h;r=null;for(M in s)if(!o.hasOwnProperty(M)&&s.hasOwnProperty(M)&&s[M]!=null)if(M==="style"){var x=s[M];for(h in x)x.hasOwnProperty(h)&&(r||(r={}),r[h]="")}else M!=="dangerouslySetInnerHTML"&&M!=="children"&&M!=="suppressContentEditableWarning"&&M!=="suppressHydrationWarning"&&M!=="autoFocus"&&(p.hasOwnProperty(M)?c||(c=[]):(c=c||[]).push(M,null));for(M in o){var k=o[M];if(x=s?.[M],o.hasOwnProperty(M)&&k!==x&&(k!=null||x!=null))if(M==="style")if(x){for(h in x)!x.hasOwnProperty(h)||k&&k.hasOwnProperty(h)||(r||(r={}),r[h]="");for(h in k)k.hasOwnProperty(h)&&x[h]!==k[h]&&(r||(r={}),r[h]=k[h])}else r||(c||(c=[]),c.push(M,r)),r=k;else M==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,x=x?x.__html:void 0,k!=null&&x!==k&&(c=c||[]).push(M,k)):M==="children"?typeof k!="string"&&typeof k!="number"||(c=c||[]).push(M,""+k):M!=="suppressContentEditableWarning"&&M!=="suppressHydrationWarning"&&(p.hasOwnProperty(M)?(k!=null&&M==="onScroll"&&Re("scroll",e),c||x===k||(c=[])):(c=c||[]).push(M,k))}r&&(c=c||[]).push("style",r);var M=c;(t.updateQueue=M)&&(t.flags|=4)}},Tc=function(e,t,r,o){r!==o&&(t.flags|=4)};function Lr(e,t){if(!De)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function nt(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,o=0;if(t)for(var s=e.child;s!==null;)r|=s.lanes|s.childLanes,o|=s.subtreeFlags&14680064,o|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)r|=s.lanes|s.childLanes,o|=s.subtreeFlags,o|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=o,e.childLanes=r,t}function up(e,t,r){var o=t.pendingProps;switch(Yi(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return nt(t),null;case 1:return ct(t.type)&&go(),nt(t),null;case 3:return o=t.stateNode,Gn(),Me(lt),Me(et),ds(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(wo(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Nt!==null&&(Os(Nt),Nt=null))),Es(e,t),nt(t),null;case 5:ls(t);var s=_n(Ir.current);if(r=t.type,e!==null&&t.stateNode!=null)Ac(e,t,r,o,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(a(166));return nt(t),null}if(e=_n(Rt.current),wo(t)){o=t.stateNode,r=t.type;var c=t.memoizedProps;switch(o[Lt]=t,o[kr]=c,e=(t.mode&1)!==0,r){case"dialog":Re("cancel",o),Re("close",o);break;case"iframe":case"object":case"embed":Re("load",o);break;case"video":case"audio":for(s=0;s<wr.length;s++)Re(wr[s],o);break;case"source":Re("error",o);break;case"img":case"image":case"link":Re("error",o),Re("load",o);break;case"details":Re("toggle",o);break;case"input":D(o,c),Re("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!c.multiple},Re("invalid",o);break;case"textarea":fa(o,c),Re("invalid",o)}ci(r,c),s=null;for(var h in c)if(c.hasOwnProperty(h)){var x=c[h];h==="children"?typeof x=="string"?o.textContent!==x&&(c.suppressHydrationWarning!==!0&&po(o.textContent,x,e),s=["children",x]):typeof x=="number"&&o.textContent!==""+x&&(c.suppressHydrationWarning!==!0&&po(o.textContent,x,e),s=["children",""+x]):p.hasOwnProperty(h)&&x!=null&&h==="onScroll"&&Re("scroll",o)}switch(r){case"input":he(o),Ee(o,c,!0);break;case"textarea":he(o),ma(o);break;case"select":case"option":break;default:typeof c.onClick=="function"&&(o.onclick=ho)}o=s,t.updateQueue=o,o!==null&&(t.flags|=4)}else{h=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=xa(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=h.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=h.createElement(r,{is:o.is}):(e=h.createElement(r),r==="select"&&(h=e,o.multiple?h.multiple=!0:o.size&&(h.size=o.size))):e=h.createElementNS(e,r),e[Lt]=t,e[kr]=o,Ec(e,t,!1,!1),t.stateNode=e;e:{switch(h=di(r,o),r){case"dialog":Re("cancel",e),Re("close",e),s=o;break;case"iframe":case"object":case"embed":Re("load",e),s=o;break;case"video":case"audio":for(s=0;s<wr.length;s++)Re(wr[s],e);s=o;break;case"source":Re("error",e),s=o;break;case"img":case"image":case"link":Re("error",e),Re("load",e),s=o;break;case"details":Re("toggle",e),s=o;break;case"input":D(e,o),s=ye(e,o),Re("invalid",e);break;case"option":s=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},s=B({},o,{value:void 0}),Re("invalid",e);break;case"textarea":fa(e,o),s=ai(e,o),Re("invalid",e);break;default:s=o}ci(r,s),x=s;for(c in x)if(x.hasOwnProperty(c)){var k=x[c];c==="style"?wa(e,k):c==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,k!=null&&_a(e,k)):c==="children"?typeof k=="string"?(r!=="textarea"||k!=="")&&tr(e,k):typeof k=="number"&&tr(e,""+k):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(p.hasOwnProperty(c)?k!=null&&c==="onScroll"&&Re("scroll",e):k!=null&&Y(e,c,k,h))}switch(r){case"input":he(e),Ee(e,o,!1);break;case"textarea":he(e),ma(e);break;case"option":o.value!=null&&e.setAttribute("value",""+V(o.value));break;case"select":e.multiple=!!o.multiple,c=o.value,c!=null?In(e,!!o.multiple,c,!1):o.defaultValue!=null&&In(e,!!o.multiple,o.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=ho)}switch(r){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return nt(t),null;case 6:if(e&&t.stateNode!=null)Tc(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(a(166));if(r=_n(Ir.current),_n(Rt.current),wo(t)){if(o=t.stateNode,r=t.memoizedProps,o[Lt]=t,(c=o.nodeValue!==r)&&(e=gt,e!==null))switch(e.tag){case 3:po(o.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&po(o.nodeValue,r,(e.mode&1)!==0)}c&&(t.flags|=4)}else o=(r.nodeType===9?r:r.ownerDocument).createTextNode(o),o[Lt]=t,t.stateNode=o}return nt(t),null;case 13:if(Me(Pe),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(De&&mt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Rl(),Bn(),t.flags|=98560,c=!1;else if(c=wo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!c)throw Error(a(318));if(c=t.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(a(317));c[Lt]=t}else Bn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;nt(t),c=!1}else Nt!==null&&(Os(Nt),Nt=null),c=!0;if(!c)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Pe.current&1)!==0?Ge===0&&(Ge=3):Bs())),t.updateQueue!==null&&(t.flags|=4),nt(t),null);case 4:return Gn(),Es(e,t),e===null&&yr(t.stateNode.containerInfo),nt(t),null;case 10:return rs(t.type._context),nt(t),null;case 17:return ct(t.type)&&go(),nt(t),null;case 19:if(Me(Pe),c=t.memoizedState,c===null)return nt(t),null;if(o=(t.flags&128)!==0,h=c.rendering,h===null)if(o)Lr(c,!1);else{if(Ge!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(h=Co(e),h!==null){for(t.flags|=128,Lr(c,!1),o=h.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=r,r=t.child;r!==null;)c=r,e=o,c.flags&=14680066,h=c.alternate,h===null?(c.childLanes=0,c.lanes=e,c.child=null,c.subtreeFlags=0,c.memoizedProps=null,c.memoizedState=null,c.updateQueue=null,c.dependencies=null,c.stateNode=null):(c.childLanes=h.childLanes,c.lanes=h.lanes,c.child=h.child,c.subtreeFlags=0,c.deletions=null,c.memoizedProps=h.memoizedProps,c.memoizedState=h.memoizedState,c.updateQueue=h.updateQueue,c.type=h.type,e=h.dependencies,c.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return Le(Pe,Pe.current&1|2),t.child}e=e.sibling}c.tail!==null&&$e()>Yn&&(t.flags|=128,o=!0,Lr(c,!1),t.lanes=4194304)}else{if(!o)if(e=Co(h),e!==null){if(t.flags|=128,o=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Lr(c,!0),c.tail===null&&c.tailMode==="hidden"&&!h.alternate&&!De)return nt(t),null}else 2*$e()-c.renderingStartTime>Yn&&r!==1073741824&&(t.flags|=128,o=!0,Lr(c,!1),t.lanes=4194304);c.isBackwards?(h.sibling=t.child,t.child=h):(r=c.last,r!==null?r.sibling=h:t.child=h,c.last=h)}return c.tail!==null?(t=c.tail,c.rendering=t,c.tail=t.sibling,c.renderingStartTime=$e(),t.sibling=null,r=Pe.current,Le(Pe,o?r&1|2:r&1),t):(nt(t),null);case 22:case 23:return $s(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(xt&1073741824)!==0&&(nt(t),t.subtreeFlags&6&&(t.flags|=8192)):nt(t),null;case 24:return null;case 25:return null}throw Error(a(156,t.tag))}function pp(e,t){switch(Yi(t),t.tag){case 1:return ct(t.type)&&go(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Gn(),Me(lt),Me(et),ds(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return ls(t),null;case 13:if(Me(Pe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(a(340));Bn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Me(Pe),null;case 4:return Gn(),null;case 10:return rs(t.type._context),null;case 22:case 23:return $s(),null;case 24:return null;default:return null}}var Mo=!1,rt=!1,hp=typeof WeakSet=="function"?WeakSet:Set,pe=null;function Qn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(o){Oe(e,t,o)}else r.current=null}function As(e,t,r){try{r()}catch(o){Oe(e,t,o)}}var zc=!1;function fp(e,t){if($i=eo,e=dl(),Ri(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var o=r.getSelection&&r.getSelection();if(o&&o.rangeCount!==0){r=o.anchorNode;var s=o.anchorOffset,c=o.focusNode;o=o.focusOffset;try{r.nodeType,c.nodeType}catch{r=null;break e}var h=0,x=-1,k=-1,M=0,te=0,ie=e,Z=null;t:for(;;){for(var ue;ie!==r||s!==0&&ie.nodeType!==3||(x=h+s),ie!==c||o!==0&&ie.nodeType!==3||(k=h+o),ie.nodeType===3&&(h+=ie.nodeValue.length),(ue=ie.firstChild)!==null;)Z=ie,ie=ue;for(;;){if(ie===e)break t;if(Z===r&&++M===s&&(x=h),Z===c&&++te===o&&(k=h),(ue=ie.nextSibling)!==null)break;ie=Z,Z=ie.parentNode}ie=ue}r=x===-1||k===-1?null:{start:x,end:k}}else r=null}r=r||{start:0,end:0}}else r=null;for(Bi={focusedElem:e,selectionRange:r},eo=!1,pe=t;pe!==null;)if(t=pe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,pe=e;else for(;pe!==null;){t=pe;try{var fe=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(fe!==null){var me=fe.memoizedProps,Be=fe.memoizedState,I=t.stateNode,j=I.getSnapshotBeforeUpdate(t.elementType===t.type?me:It(t.type,me),Be);I.__reactInternalSnapshotBeforeUpdate=j}break;case 3:var L=t.stateNode.containerInfo;L.nodeType===1?L.textContent="":L.nodeType===9&&L.documentElement&&L.removeChild(L.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(a(163))}}catch(ae){Oe(t,t.return,ae)}if(e=t.sibling,e!==null){e.return=t.return,pe=e;break}pe=t.return}return fe=zc,zc=!1,fe}function Rr(e,t,r){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var s=o=o.next;do{if((s.tag&e)===e){var c=s.destroy;s.destroy=void 0,c!==void 0&&As(t,r,c)}s=s.next}while(s!==o)}}function Do(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var o=r.create;r.destroy=o()}r=r.next}while(r!==t)}}function Ts(e){var t=e.ref;if(t!==null){var r=e.stateNode;e.tag,e=r,typeof t=="function"?t(e):t.current=e}}function Lc(e){var t=e.alternate;t!==null&&(e.alternate=null,Lc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Lt],delete t[kr],delete t[Gi],delete t[Xu],delete t[Yu])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Rc(e){return e.tag===5||e.tag===3||e.tag===4}function Mc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Rc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function zs(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=ho));else if(o!==4&&(e=e.child,e!==null))for(zs(e,t,r),e=e.sibling;e!==null;)zs(e,t,r),e=e.sibling}function Ls(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(Ls(e,t,r),e=e.sibling;e!==null;)Ls(e,t,r),e=e.sibling}var Je=null,Et=!1;function rn(e,t,r){for(r=r.child;r!==null;)Dc(e,t,r),r=r.sibling}function Dc(e,t,r){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(qr,r)}catch{}switch(r.tag){case 5:rt||Qn(r,t);case 6:var o=Je,s=Et;Je=null,rn(e,t,r),Je=o,Et=s,Je!==null&&(Et?(e=Je,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):Je.removeChild(r.stateNode));break;case 18:Je!==null&&(Et?(e=Je,r=r.stateNode,e.nodeType===8?Vi(e.parentNode,r):e.nodeType===1&&Vi(e,r),pr(e)):Vi(Je,r.stateNode));break;case 4:o=Je,s=Et,Je=r.stateNode.containerInfo,Et=!0,rn(e,t,r),Je=o,Et=s;break;case 0:case 11:case 14:case 15:if(!rt&&(o=r.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){s=o=o.next;do{var c=s,h=c.destroy;c=c.tag,h!==void 0&&((c&2)!==0||(c&4)!==0)&&As(r,t,h),s=s.next}while(s!==o)}rn(e,t,r);break;case 1:if(!rt&&(Qn(r,t),o=r.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=r.memoizedProps,o.state=r.memoizedState,o.componentWillUnmount()}catch(x){Oe(r,t,x)}rn(e,t,r);break;case 21:rn(e,t,r);break;case 22:r.mode&1?(rt=(o=rt)||r.memoizedState!==null,rn(e,t,r),rt=o):rn(e,t,r);break;default:rn(e,t,r)}}function Pc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new hp),t.forEach(function(o){var s=kp.bind(null,e,o);r.has(o)||(r.add(o),o.then(s,s))})}}function At(e,t){var r=t.deletions;if(r!==null)for(var o=0;o<r.length;o++){var s=r[o];try{var c=e,h=t,x=h;e:for(;x!==null;){switch(x.tag){case 5:Je=x.stateNode,Et=!1;break e;case 3:Je=x.stateNode.containerInfo,Et=!0;break e;case 4:Je=x.stateNode.containerInfo,Et=!0;break e}x=x.return}if(Je===null)throw Error(a(160));Dc(c,h,s),Je=null,Et=!1;var k=s.alternate;k!==null&&(k.return=null),s.return=null}catch(M){Oe(s,t,M)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Fc(t,e),t=t.sibling}function Fc(e,t){var r=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(At(t,e),Dt(e),o&4){try{Rr(3,e,e.return),Do(3,e)}catch(me){Oe(e,e.return,me)}try{Rr(5,e,e.return)}catch(me){Oe(e,e.return,me)}}break;case 1:At(t,e),Dt(e),o&512&&r!==null&&Qn(r,r.return);break;case 5:if(At(t,e),Dt(e),o&512&&r!==null&&Qn(r,r.return),e.flags&32){var s=e.stateNode;try{tr(s,"")}catch(me){Oe(e,e.return,me)}}if(o&4&&(s=e.stateNode,s!=null)){var c=e.memoizedProps,h=r!==null?r.memoizedProps:c,x=e.type,k=e.updateQueue;if(e.updateQueue=null,k!==null)try{x==="input"&&c.type==="radio"&&c.name!=null&&je(s,c),di(x,h);var M=di(x,c);for(h=0;h<k.length;h+=2){var te=k[h],ie=k[h+1];te==="style"?wa(s,ie):te==="dangerouslySetInnerHTML"?_a(s,ie):te==="children"?tr(s,ie):Y(s,te,ie,M)}switch(x){case"input":Ce(s,c);break;case"textarea":ga(s,c);break;case"select":var Z=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!c.multiple;var ue=c.value;ue!=null?In(s,!!c.multiple,ue,!1):Z!==!!c.multiple&&(c.defaultValue!=null?In(s,!!c.multiple,c.defaultValue,!0):In(s,!!c.multiple,c.multiple?[]:"",!1))}s[kr]=c}catch(me){Oe(e,e.return,me)}}break;case 6:if(At(t,e),Dt(e),o&4){if(e.stateNode===null)throw Error(a(162));s=e.stateNode,c=e.memoizedProps;try{s.nodeValue=c}catch(me){Oe(e,e.return,me)}}break;case 3:if(At(t,e),Dt(e),o&4&&r!==null&&r.memoizedState.isDehydrated)try{pr(t.containerInfo)}catch(me){Oe(e,e.return,me)}break;case 4:At(t,e),Dt(e);break;case 13:At(t,e),Dt(e),s=e.child,s.flags&8192&&(c=s.memoizedState!==null,s.stateNode.isHidden=c,!c||s.alternate!==null&&s.alternate.memoizedState!==null||(Ds=$e())),o&4&&Pc(e);break;case 22:if(te=r!==null&&r.memoizedState!==null,e.mode&1?(rt=(M=rt)||te,At(t,e),rt=M):At(t,e),Dt(e),o&8192){if(M=e.memoizedState!==null,(e.stateNode.isHidden=M)&&!te&&(e.mode&1)!==0)for(pe=e,te=e.child;te!==null;){for(ie=pe=te;pe!==null;){switch(Z=pe,ue=Z.child,Z.tag){case 0:case 11:case 14:case 15:Rr(4,Z,Z.return);break;case 1:Qn(Z,Z.return);var fe=Z.stateNode;if(typeof fe.componentWillUnmount=="function"){o=Z,r=Z.return;try{t=o,fe.props=t.memoizedProps,fe.state=t.memoizedState,fe.componentWillUnmount()}catch(me){Oe(o,r,me)}}break;case 5:Qn(Z,Z.return);break;case 22:if(Z.memoizedState!==null){Uc(ie);continue}}ue!==null?(ue.return=Z,pe=ue):Uc(ie)}te=te.sibling}e:for(te=null,ie=e;;){if(ie.tag===5){if(te===null){te=ie;try{s=ie.stateNode,M?(c=s.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none"):(x=ie.stateNode,k=ie.memoizedProps.style,h=k!=null&&k.hasOwnProperty("display")?k.display:null,x.style.display=ba("display",h))}catch(me){Oe(e,e.return,me)}}}else if(ie.tag===6){if(te===null)try{ie.stateNode.nodeValue=M?"":ie.memoizedProps}catch(me){Oe(e,e.return,me)}}else if((ie.tag!==22&&ie.tag!==23||ie.memoizedState===null||ie===e)&&ie.child!==null){ie.child.return=ie,ie=ie.child;continue}if(ie===e)break e;for(;ie.sibling===null;){if(ie.return===null||ie.return===e)break e;te===ie&&(te=null),ie=ie.return}te===ie&&(te=null),ie.sibling.return=ie.return,ie=ie.sibling}}break;case 19:At(t,e),Dt(e),o&4&&Pc(e);break;case 21:break;default:At(t,e),Dt(e)}}function Dt(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Rc(r)){var o=r;break e}r=r.return}throw Error(a(160))}switch(o.tag){case 5:var s=o.stateNode;o.flags&32&&(tr(s,""),o.flags&=-33);var c=Mc(e);Ls(e,c,s);break;case 3:case 4:var h=o.stateNode.containerInfo,x=Mc(e);zs(e,x,h);break;default:throw Error(a(161))}}catch(k){Oe(e,e.return,k)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function gp(e,t,r){pe=e,Wc(e)}function Wc(e,t,r){for(var o=(e.mode&1)!==0;pe!==null;){var s=pe,c=s.child;if(s.tag===22&&o){var h=s.memoizedState!==null||Mo;if(!h){var x=s.alternate,k=x!==null&&x.memoizedState!==null||rt;x=Mo;var M=rt;if(Mo=h,(rt=k)&&!M)for(pe=s;pe!==null;)h=pe,k=h.child,h.tag===22&&h.memoizedState!==null?$c(s):k!==null?(k.return=h,pe=k):$c(s);for(;c!==null;)pe=c,Wc(c),c=c.sibling;pe=s,Mo=x,rt=M}Oc(e)}else(s.subtreeFlags&8772)!==0&&c!==null?(c.return=s,pe=c):Oc(e)}}function Oc(e){for(;pe!==null;){var t=pe;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:rt||Do(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!rt)if(r===null)o.componentDidMount();else{var s=t.elementType===t.type?r.memoizedProps:It(t.type,r.memoizedProps);o.componentDidUpdate(s,r.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var c=t.updateQueue;c!==null&&Ul(t,c,o);break;case 3:var h=t.updateQueue;if(h!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Ul(t,h,r)}break;case 5:var x=t.stateNode;if(r===null&&t.flags&4){r=x;var k=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":k.autoFocus&&r.focus();break;case"img":k.src&&(r.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var M=t.alternate;if(M!==null){var te=M.memoizedState;if(te!==null){var ie=te.dehydrated;ie!==null&&pr(ie)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(a(163))}rt||t.flags&512&&Ts(t)}catch(Z){Oe(t,t.return,Z)}}if(t===e){pe=null;break}if(r=t.sibling,r!==null){r.return=t.return,pe=r;break}pe=t.return}}function Uc(e){for(;pe!==null;){var t=pe;if(t===e){pe=null;break}var r=t.sibling;if(r!==null){r.return=t.return,pe=r;break}pe=t.return}}function $c(e){for(;pe!==null;){var t=pe;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Do(4,t)}catch(k){Oe(t,r,k)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var s=t.return;try{o.componentDidMount()}catch(k){Oe(t,s,k)}}var c=t.return;try{Ts(t)}catch(k){Oe(t,c,k)}break;case 5:var h=t.return;try{Ts(t)}catch(k){Oe(t,h,k)}}}catch(k){Oe(t,t.return,k)}if(t===e){pe=null;break}var x=t.sibling;if(x!==null){x.return=t.return,pe=x;break}pe=t.return}}var mp=Math.ceil,Po=U.ReactCurrentDispatcher,Rs=U.ReactCurrentOwner,vt=U.ReactCurrentBatchConfig,Ne=0,Xe=null,Ke=null,Ze=0,xt=0,Xn=Jt(0),Ge=0,Mr=null,wn=0,Fo=0,Ms=0,Dr=null,ut=null,Ds=0,Yn=1/0,Ht=null,Wo=!1,Ps=null,on=null,Oo=!1,sn=null,Uo=0,Pr=0,Fs=null,$o=-1,Bo=0;function it(){return(Ne&6)!==0?$e():$o!==-1?$o:$o=$e()}function an(e){return(e.mode&1)===0?1:(Ne&2)!==0&&Ze!==0?Ze&-Ze:Zu.transition!==null?(Bo===0&&(Bo=Ma()),Bo):(e=Ae,e!==0||(e=window.event,e=e===void 0?16:Ha(e.type)),e)}function Tt(e,t,r,o){if(50<Pr)throw Pr=0,Fs=null,Error(a(185));ar(e,r,o),((Ne&2)===0||e!==Xe)&&(e===Xe&&((Ne&2)===0&&(Fo|=r),Ge===4&&ln(e,Ze)),pt(e,o),r===1&&Ne===0&&(t.mode&1)===0&&(Yn=$e()+500,xo&&en()))}function pt(e,t){var r=e.callbackNode;Zd(e,t);var o=Yr(e,e===Xe?Ze:0);if(o===0)r!==null&&za(r),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(r!=null&&za(r),t===1)e.tag===0?Ju(Hc.bind(null,e)):El(Hc.bind(null,e)),qu(function(){(Ne&6)===0&&en()}),r=null;else{switch(Da(o)){case 1:r=xi;break;case 4:r=La;break;case 16:r=Gr;break;case 536870912:r=Ra;break;default:r=Gr}r=Jc(r,Bc.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Bc(e,t){if($o=-1,Bo=0,(Ne&6)!==0)throw Error(a(327));var r=e.callbackNode;if(Jn()&&e.callbackNode!==r)return null;var o=Yr(e,e===Xe?Ze:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Ho(e,o);else{t=o;var s=Ne;Ne|=2;var c=Vc();(Xe!==e||Ze!==t)&&(Ht=null,Yn=$e()+500,vn(e,t));do try{bp();break}catch(x){Kc(e,x)}while(!0);ns(),Po.current=c,Ne=s,Ke!==null?t=0:(Xe=null,Ze=0,t=Ge)}if(t!==0){if(t===2&&(s=_i(e),s!==0&&(o=s,t=Ws(e,s))),t===1)throw r=Mr,vn(e,0),ln(e,o),pt(e,$e()),r;if(t===6)ln(e,o);else{if(s=e.current.alternate,(o&30)===0&&!xp(s)&&(t=Ho(e,o),t===2&&(c=_i(e),c!==0&&(o=c,t=Ws(e,c))),t===1))throw r=Mr,vn(e,0),ln(e,o),pt(e,$e()),r;switch(e.finishedWork=s,e.finishedLanes=o,t){case 0:case 1:throw Error(a(345));case 2:kn(e,ut,Ht);break;case 3:if(ln(e,o),(o&130023424)===o&&(t=Ds+500-$e(),10<t)){if(Yr(e,0)!==0)break;if(s=e.suspendedLanes,(s&o)!==o){it(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Ki(kn.bind(null,e,ut,Ht),t);break}kn(e,ut,Ht);break;case 4:if(ln(e,o),(o&4194240)===o)break;for(t=e.eventTimes,s=-1;0<o;){var h=31-St(o);c=1<<h,h=t[h],h>s&&(s=h),o&=~c}if(o=s,o=$e()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*mp(o/1960))-o,10<o){e.timeoutHandle=Ki(kn.bind(null,e,ut,Ht),o);break}kn(e,ut,Ht);break;case 5:kn(e,ut,Ht);break;default:throw Error(a(329))}}}return pt(e,$e()),e.callbackNode===r?Bc.bind(null,e):null}function Ws(e,t){var r=Dr;return e.current.memoizedState.isDehydrated&&(vn(e,t).flags|=256),e=Ho(e,t),e!==2&&(t=ut,ut=r,t!==null&&Os(t)),e}function Os(e){ut===null?ut=e:ut.push.apply(ut,e)}function xp(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var o=0;o<r.length;o++){var s=r[o],c=s.getSnapshot;s=s.value;try{if(!Ct(c(),s))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function ln(e,t){for(t&=~Ms,t&=~Fo,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-St(t),o=1<<r;e[r]=-1,t&=~o}}function Hc(e){if((Ne&6)!==0)throw Error(a(327));Jn();var t=Yr(e,0);if((t&1)===0)return pt(e,$e()),null;var r=Ho(e,t);if(e.tag!==0&&r===2){var o=_i(e);o!==0&&(t=o,r=Ws(e,o))}if(r===1)throw r=Mr,vn(e,0),ln(e,t),pt(e,$e()),r;if(r===6)throw Error(a(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,kn(e,ut,Ht),pt(e,$e()),null}function Us(e,t){var r=Ne;Ne|=1;try{return e(t)}finally{Ne=r,Ne===0&&(Yn=$e()+500,xo&&en())}}function yn(e){sn!==null&&sn.tag===0&&(Ne&6)===0&&Jn();var t=Ne;Ne|=1;var r=vt.transition,o=Ae;try{if(vt.transition=null,Ae=1,e)return e()}finally{Ae=o,vt.transition=r,Ne=t,(Ne&6)===0&&en()}}function $s(){xt=Xn.current,Me(Xn)}function vn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Gu(r)),Ke!==null)for(r=Ke.return;r!==null;){var o=r;switch(Yi(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&go();break;case 3:Gn(),Me(lt),Me(et),ds();break;case 5:ls(o);break;case 4:Gn();break;case 13:Me(Pe);break;case 19:Me(Pe);break;case 10:rs(o.type._context);break;case 22:case 23:$s()}r=r.return}if(Xe=e,Ke=e=cn(e.current,null),Ze=xt=t,Ge=0,Mr=null,Ms=Fo=wn=0,ut=Dr=null,xn!==null){for(t=0;t<xn.length;t++)if(r=xn[t],o=r.interleaved,o!==null){r.interleaved=null;var s=o.next,c=r.pending;if(c!==null){var h=c.next;c.next=s,o.next=h}r.pending=o}xn=null}return e}function Kc(e,t){do{var r=Ke;try{if(ns(),No.current=To,Io){for(var o=Fe.memoizedState;o!==null;){var s=o.queue;s!==null&&(s.pending=null),o=o.next}Io=!1}if(bn=0,Qe=Ve=Fe=null,Er=!1,Ar=0,Rs.current=null,r===null||r.return===null){Ge=1,Mr=t,Ke=null;break}e:{var c=e,h=r.return,x=r,k=t;if(t=Ze,x.flags|=32768,k!==null&&typeof k=="object"&&typeof k.then=="function"){var M=k,te=x,ie=te.tag;if((te.mode&1)===0&&(ie===0||ie===11||ie===15)){var Z=te.alternate;Z?(te.updateQueue=Z.updateQueue,te.memoizedState=Z.memoizedState,te.lanes=Z.lanes):(te.updateQueue=null,te.memoizedState=null)}var ue=mc(h);if(ue!==null){ue.flags&=-257,xc(ue,h,x,c,t),ue.mode&1&&gc(c,M,t),t=ue,k=M;var fe=t.updateQueue;if(fe===null){var me=new Set;me.add(k),t.updateQueue=me}else fe.add(k);break e}else{if((t&1)===0){gc(c,M,t),Bs();break e}k=Error(a(426))}}else if(De&&x.mode&1){var Be=mc(h);if(Be!==null){(Be.flags&65536)===0&&(Be.flags|=256),xc(Be,h,x,c,t),es(qn(k,x));break e}}c=k=qn(k,x),Ge!==4&&(Ge=2),Dr===null?Dr=[c]:Dr.push(c),c=h;do{switch(c.tag){case 3:c.flags|=65536,t&=-t,c.lanes|=t;var I=hc(c,k,t);Ol(c,I);break e;case 1:x=k;var j=c.type,L=c.stateNode;if((c.flags&128)===0&&(typeof j.getDerivedStateFromError=="function"||L!==null&&typeof L.componentDidCatch=="function"&&(on===null||!on.has(L)))){c.flags|=65536,t&=-t,c.lanes|=t;var ae=fc(c,x,t);Ol(c,ae);break e}}c=c.return}while(c!==null)}qc(r)}catch(xe){t=xe,Ke===r&&r!==null&&(Ke=r=r.return);continue}break}while(!0)}function Vc(){var e=Po.current;return Po.current=To,e===null?To:e}function Bs(){(Ge===0||Ge===3||Ge===2)&&(Ge=4),Xe===null||(wn&268435455)===0&&(Fo&268435455)===0||ln(Xe,Ze)}function Ho(e,t){var r=Ne;Ne|=2;var o=Vc();(Xe!==e||Ze!==t)&&(Ht=null,vn(e,t));do try{_p();break}catch(s){Kc(e,s)}while(!0);if(ns(),Ne=r,Po.current=o,Ke!==null)throw Error(a(261));return Xe=null,Ze=0,Ge}function _p(){for(;Ke!==null;)Gc(Ke)}function bp(){for(;Ke!==null&&!Hd();)Gc(Ke)}function Gc(e){var t=Yc(e.alternate,e,xt);e.memoizedProps=e.pendingProps,t===null?qc(e):Ke=t,Rs.current=null}function qc(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=up(r,t,xt),r!==null){Ke=r;return}}else{if(r=pp(r,t),r!==null){r.flags&=32767,Ke=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ge=6,Ke=null;return}}if(t=t.sibling,t!==null){Ke=t;return}Ke=t=e}while(t!==null);Ge===0&&(Ge=5)}function kn(e,t,r){var o=Ae,s=vt.transition;try{vt.transition=null,Ae=1,wp(e,t,r,o)}finally{vt.transition=s,Ae=o}return null}function wp(e,t,r,o){do Jn();while(sn!==null);if((Ne&6)!==0)throw Error(a(327));r=e.finishedWork;var s=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(a(177));e.callbackNode=null,e.callbackPriority=0;var c=r.lanes|r.childLanes;if(eu(e,c),e===Xe&&(Ke=Xe=null,Ze=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Oo||(Oo=!0,Jc(Gr,function(){return Jn(),null})),c=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||c){c=vt.transition,vt.transition=null;var h=Ae;Ae=1;var x=Ne;Ne|=4,Rs.current=null,fp(e,r),Fc(r,e),Ou(Bi),eo=!!$i,Bi=$i=null,e.current=r,gp(r),Kd(),Ne=x,Ae=h,vt.transition=c}else e.current=r;if(Oo&&(Oo=!1,sn=e,Uo=s),c=e.pendingLanes,c===0&&(on=null),qd(r.stateNode),pt(e,$e()),t!==null)for(o=e.onRecoverableError,r=0;r<t.length;r++)s=t[r],o(s.value,{componentStack:s.stack,digest:s.digest});if(Wo)throw Wo=!1,e=Ps,Ps=null,e;return(Uo&1)!==0&&e.tag!==0&&Jn(),c=e.pendingLanes,(c&1)!==0?e===Fs?Pr++:(Pr=0,Fs=e):Pr=0,en(),null}function Jn(){if(sn!==null){var e=Da(Uo),t=vt.transition,r=Ae;try{if(vt.transition=null,Ae=16>e?16:e,sn===null)var o=!1;else{if(e=sn,sn=null,Uo=0,(Ne&6)!==0)throw Error(a(331));var s=Ne;for(Ne|=4,pe=e.current;pe!==null;){var c=pe,h=c.child;if((pe.flags&16)!==0){var x=c.deletions;if(x!==null){for(var k=0;k<x.length;k++){var M=x[k];for(pe=M;pe!==null;){var te=pe;switch(te.tag){case 0:case 11:case 15:Rr(8,te,c)}var ie=te.child;if(ie!==null)ie.return=te,pe=ie;else for(;pe!==null;){te=pe;var Z=te.sibling,ue=te.return;if(Lc(te),te===M){pe=null;break}if(Z!==null){Z.return=ue,pe=Z;break}pe=ue}}}var fe=c.alternate;if(fe!==null){var me=fe.child;if(me!==null){fe.child=null;do{var Be=me.sibling;me.sibling=null,me=Be}while(me!==null)}}pe=c}}if((c.subtreeFlags&2064)!==0&&h!==null)h.return=c,pe=h;else e:for(;pe!==null;){if(c=pe,(c.flags&2048)!==0)switch(c.tag){case 0:case 11:case 15:Rr(9,c,c.return)}var I=c.sibling;if(I!==null){I.return=c.return,pe=I;break e}pe=c.return}}var j=e.current;for(pe=j;pe!==null;){h=pe;var L=h.child;if((h.subtreeFlags&2064)!==0&&L!==null)L.return=h,pe=L;else e:for(h=j;pe!==null;){if(x=pe,(x.flags&2048)!==0)try{switch(x.tag){case 0:case 11:case 15:Do(9,x)}}catch(xe){Oe(x,x.return,xe)}if(x===h){pe=null;break e}var ae=x.sibling;if(ae!==null){ae.return=x.return,pe=ae;break e}pe=x.return}}if(Ne=s,en(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(qr,e)}catch{}o=!0}return o}finally{Ae=r,vt.transition=t}}return!1}function Qc(e,t,r){t=qn(r,t),t=hc(e,t,1),e=nn(e,t,1),t=it(),e!==null&&(ar(e,1,t),pt(e,t))}function Oe(e,t,r){if(e.tag===3)Qc(e,e,r);else for(;t!==null;){if(t.tag===3){Qc(t,e,r);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(on===null||!on.has(o))){e=qn(r,e),e=fc(t,e,1),t=nn(t,e,1),e=it(),t!==null&&(ar(t,1,e),pt(t,e));break}}t=t.return}}function yp(e,t,r){var o=e.pingCache;o!==null&&o.delete(t),t=it(),e.pingedLanes|=e.suspendedLanes&r,Xe===e&&(Ze&r)===r&&(Ge===4||Ge===3&&(Ze&130023424)===Ze&&500>$e()-Ds?vn(e,0):Ms|=r),pt(e,t)}function Xc(e,t){t===0&&((e.mode&1)===0?t=1:(t=Xr,Xr<<=1,(Xr&130023424)===0&&(Xr=4194304)));var r=it();e=Ut(e,t),e!==null&&(ar(e,t,r),pt(e,r))}function vp(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),Xc(e,r)}function kp(e,t){var r=0;switch(e.tag){case 13:var o=e.stateNode,s=e.memoizedState;s!==null&&(r=s.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(a(314))}o!==null&&o.delete(t),Xc(e,r)}var Yc;Yc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||lt.current)dt=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return dt=!1,dp(e,t,r);dt=(e.flags&131072)!==0}else dt=!1,De&&(t.flags&1048576)!==0&&Al(t,bo,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Ro(e,t),e=t.pendingProps;var s=On(t,et.current);Vn(t,r),s=hs(null,t,o,e,s,r);var c=fs();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ct(o)?(c=!0,mo(t)):c=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,ss(t),s.updater=zo,t.stateNode=s,s._reactInternals=t,ws(t,o,e,r),t=js(null,t,o,!0,c,r)):(t.tag=0,De&&c&&Xi(t),ot(null,t,s,r),t=t.child),t;case 16:o=t.elementType;e:{switch(Ro(e,t),e=t.pendingProps,s=o._init,o=s(o._payload),t.type=o,s=t.tag=Sp(o),e=It(o,e),s){case 0:t=ks(null,t,o,e,r);break e;case 1:t=kc(null,t,o,e,r);break e;case 11:t=_c(null,t,o,e,r);break e;case 14:t=bc(null,t,o,It(o.type,e),r);break e}throw Error(a(306,o,""))}return t;case 0:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),ks(e,t,o,s,r);case 1:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),kc(e,t,o,s,r);case 3:e:{if(jc(t),e===null)throw Error(a(387));o=t.pendingProps,c=t.memoizedState,s=c.element,Wl(e,t),So(t,o,null,r);var h=t.memoizedState;if(o=h.element,c.isDehydrated)if(c={element:o,isDehydrated:!1,cache:h.cache,pendingSuspenseBoundaries:h.pendingSuspenseBoundaries,transitions:h.transitions},t.updateQueue.baseState=c,t.memoizedState=c,t.flags&256){s=qn(Error(a(423)),t),t=Sc(e,t,o,r,s);break e}else if(o!==s){s=qn(Error(a(424)),t),t=Sc(e,t,o,r,s);break e}else for(mt=Yt(t.stateNode.containerInfo.firstChild),gt=t,De=!0,Nt=null,r=Pl(t,null,o,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Bn(),o===s){t=Bt(e,t,r);break e}ot(e,t,o,r)}t=t.child}return t;case 5:return $l(t),e===null&&Zi(t),o=t.type,s=t.pendingProps,c=e!==null?e.memoizedProps:null,h=s.children,Hi(o,s)?h=null:c!==null&&Hi(o,c)&&(t.flags|=32),vc(e,t),ot(e,t,h,r),t.child;case 6:return e===null&&Zi(t),null;case 13:return Cc(e,t,r);case 4:return as(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Hn(t,null,o,r):ot(e,t,o,r),t.child;case 11:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),_c(e,t,o,s,r);case 7:return ot(e,t,t.pendingProps,r),t.child;case 8:return ot(e,t,t.pendingProps.children,r),t.child;case 12:return ot(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(o=t.type._context,s=t.pendingProps,c=t.memoizedProps,h=s.value,Le(vo,o._currentValue),o._currentValue=h,c!==null)if(Ct(c.value,h)){if(c.children===s.children&&!lt.current){t=Bt(e,t,r);break e}}else for(c=t.child,c!==null&&(c.return=t);c!==null;){var x=c.dependencies;if(x!==null){h=c.child;for(var k=x.firstContext;k!==null;){if(k.context===o){if(c.tag===1){k=$t(-1,r&-r),k.tag=2;var M=c.updateQueue;if(M!==null){M=M.shared;var te=M.pending;te===null?k.next=k:(k.next=te.next,te.next=k),M.pending=k}}c.lanes|=r,k=c.alternate,k!==null&&(k.lanes|=r),os(c.return,r,t),x.lanes|=r;break}k=k.next}}else if(c.tag===10)h=c.type===t.type?null:c.child;else if(c.tag===18){if(h=c.return,h===null)throw Error(a(341));h.lanes|=r,x=h.alternate,x!==null&&(x.lanes|=r),os(h,r,t),h=c.sibling}else h=c.child;if(h!==null)h.return=c;else for(h=c;h!==null;){if(h===t){h=null;break}if(c=h.sibling,c!==null){c.return=h.return,h=c;break}h=h.return}c=h}ot(e,t,s.children,r),t=t.child}return t;case 9:return s=t.type,o=t.pendingProps.children,Vn(t,r),s=wt(s),o=o(s),t.flags|=1,ot(e,t,o,r),t.child;case 14:return o=t.type,s=It(o,t.pendingProps),s=It(o.type,s),bc(e,t,o,s,r);case 15:return wc(e,t,t.type,t.pendingProps,r);case 17:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),Ro(e,t),t.tag=1,ct(o)?(e=!0,mo(t)):e=!1,Vn(t,r),uc(t,o,s),ws(t,o,s,r),js(null,t,o,!0,e,r);case 19:return Ic(e,t,r);case 22:return yc(e,t,r)}throw Error(a(156,t.tag))};function Jc(e,t){return Ta(e,t)}function jp(e,t,r,o){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function kt(e,t,r,o){return new jp(e,t,r,o)}function Hs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Sp(e){if(typeof e=="function")return Hs(e)?1:0;if(e!=null){if(e=e.$$typeof,e===le)return 11;if(e===K)return 14}return 2}function cn(e,t){var r=e.alternate;return r===null?(r=kt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Ko(e,t,r,o,s,c){var h=2;if(o=e,typeof e=="function")Hs(e)&&(h=1);else if(typeof e=="string")h=5;else e:switch(e){case X:return jn(r.children,s,c,t);case se:h=8,s|=8;break;case ne:return e=kt(12,r,t,s|2),e.elementType=ne,e.lanes=c,e;case q:return e=kt(13,r,t,s),e.elementType=q,e.lanes=c,e;case _e:return e=kt(19,r,t,s),e.elementType=_e,e.lanes=c,e;case O:return Vo(r,s,c,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case oe:h=10;break e;case ee:h=9;break e;case le:h=11;break e;case K:h=14;break e;case ce:h=16,o=null;break e}throw Error(a(130,e==null?e:typeof e,""))}return t=kt(h,r,t,s),t.elementType=e,t.type=o,t.lanes=c,t}function jn(e,t,r,o){return e=kt(7,e,o,t),e.lanes=r,e}function Vo(e,t,r,o){return e=kt(22,e,o,t),e.elementType=O,e.lanes=r,e.stateNode={isHidden:!1},e}function Ks(e,t,r){return e=kt(6,e,null,t),e.lanes=r,e}function Vs(e,t,r){return t=kt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Cp(e,t,r,o,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=bi(0),this.expirationTimes=bi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=bi(0),this.identifierPrefix=o,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Gs(e,t,r,o,s,c,h,x,k){return e=new Cp(e,t,r,x,k),t===1?(t=1,c===!0&&(t|=8)):t=0,c=kt(3,null,null,t),e.current=c,c.stateNode=e,c.memoizedState={element:o,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},ss(c),e}function Np(e,t,r){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Q,key:o==null?null:""+o,children:e,containerInfo:t,implementation:r}}function Zc(e){if(!e)return Zt;e=e._reactInternals;e:{if(pn(e)!==e||e.tag!==1)throw Error(a(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ct(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(a(171))}if(e.tag===1){var r=e.type;if(ct(r))return Nl(e,r,t)}return t}function ed(e,t,r,o,s,c,h,x,k){return e=Gs(r,o,!0,e,s,c,h,x,k),e.context=Zc(null),r=e.current,o=it(),s=an(r),c=$t(o,s),c.callback=t??null,nn(r,c,s),e.current.lanes=s,ar(e,s,o),pt(e,o),e}function Go(e,t,r,o){var s=t.current,c=it(),h=an(s);return r=Zc(r),t.context===null?t.context=r:t.pendingContext=r,t=$t(c,h),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=nn(s,t,h),e!==null&&(Tt(e,s,h,c),jo(e,s,h)),h}function qo(e){return e=e.current,e.child?(e.child.tag===5,e.child.stateNode):null}function td(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function qs(e,t){td(e,t),(e=e.alternate)&&td(e,t)}function Ip(){return null}var nd=typeof reportError=="function"?reportError:function(e){console.error(e)};function Qs(e){this._internalRoot=e}Qo.prototype.render=Qs.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(a(409));Go(e,t,null,null)},Qo.prototype.unmount=Qs.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;yn(function(){Go(null,e,null,null)}),t[Pt]=null}};function Qo(e){this._internalRoot=e}Qo.prototype.unstable_scheduleHydration=function(e){if(e){var t=Wa();e={blockedOn:null,target:e,priority:t};for(var r=0;r<qt.length&&t!==0&&t<qt[r].priority;r++);qt.splice(r,0,e),r===0&&$a(e)}};function Xs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Xo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function rd(){}function Ep(e,t,r,o,s){if(s){if(typeof o=="function"){var c=o;o=function(){var M=qo(h);c.call(M)}}var h=ed(t,o,e,0,null,!1,!1,"",rd);return e._reactRootContainer=h,e[Pt]=h.current,yr(e.nodeType===8?e.parentNode:e),yn(),h}for(;s=e.lastChild;)e.removeChild(s);if(typeof o=="function"){var x=o;o=function(){var M=qo(k);x.call(M)}}var k=Gs(e,0,!1,null,null,!1,!1,"",rd);return e._reactRootContainer=k,e[Pt]=k.current,yr(e.nodeType===8?e.parentNode:e),yn(function(){Go(t,k,r,o)}),k}function Yo(e,t,r,o,s){var c=r._reactRootContainer;if(c){var h=c;if(typeof s=="function"){var x=s;s=function(){var k=qo(h);x.call(k)}}Go(t,h,e,s)}else h=Ep(r,t,e,s,o);return qo(h)}Pa=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=sr(t.pendingLanes);r!==0&&(wi(t,r|1),pt(t,$e()),(Ne&6)===0&&(Yn=$e()+500,en()))}break;case 13:yn(function(){var o=Ut(e,1);if(o!==null){var s=it();Tt(o,e,1,s)}}),qs(e,1)}},yi=function(e){if(e.tag===13){var t=Ut(e,134217728);if(t!==null){var r=it();Tt(t,e,134217728,r)}qs(e,134217728)}},Fa=function(e){if(e.tag===13){var t=an(e),r=Ut(e,t);if(r!==null){var o=it();Tt(r,e,t,o)}qs(e,t)}},Wa=function(){return Ae},Oa=function(e,t){var r=Ae;try{return Ae=e,t()}finally{Ae=r}},hi=function(e,t,r){switch(t){case"input":if(Ce(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var o=r[t];if(o!==e&&o.form===e.form){var s=fo(o);if(!s)throw Error(a(90));Te(o),Ce(o,s)}}}break;case"textarea":ga(e,r);break;case"select":t=r.value,t!=null&&In(e,!!r.multiple,t,!1)}},ja=Us,Sa=yn;var Ap={usingClientEntryPoint:!1,Events:[jr,Fn,fo,va,ka,Us]},Fr={findFiberByHostInstance:hn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Tp={bundleType:Fr.bundleType,version:Fr.version,rendererPackageName:Fr.rendererPackageName,rendererConfig:Fr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:U.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ea(e),e===null?null:e.stateNode},findFiberByHostInstance:Fr.findFiberByHostInstance||Ip,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Jo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jo.isDisabled&&Jo.supportsFiber)try{qr=Jo.inject(Tp),zt=Jo}catch{}}return ht.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ap,ht.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Xs(t))throw Error(a(200));return Np(e,t,null,r)},ht.createRoot=function(e,t){if(!Xs(e))throw Error(a(299));var r=!1,o="",s=nd;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=Gs(e,1,!1,null,null,r,!1,o,s),e[Pt]=t.current,yr(e.nodeType===8?e.parentNode:e),new Qs(t)},ht.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(a(188)):(e=Object.keys(e).join(","),Error(a(268,e)));return e=Ea(t),e=e===null?null:e.stateNode,e},ht.flushSync=function(e){return yn(e)},ht.hydrate=function(e,t,r){if(!Xo(t))throw Error(a(200));return Yo(null,e,t,!0,r)},ht.hydrateRoot=function(e,t,r){if(!Xs(e))throw Error(a(405));var o=r!=null&&r.hydratedSources||null,s=!1,c="",h=nd;if(r!=null&&(r.unstable_strictMode===!0&&(s=!0),r.identifierPrefix!==void 0&&(c=r.identifierPrefix),r.onRecoverableError!==void 0&&(h=r.onRecoverableError)),t=ed(t,null,e,1,r??null,s,!1,c,h),e[Pt]=t.current,yr(e),o)for(e=0;e<o.length;e++)r=o[e],s=r._getVersion,s=s(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,s]:t.mutableSourceEagerHydrationData.push(r,s);return new Qo(t)},ht.render=function(e,t,r){if(!Xo(t))throw Error(a(200));return Yo(null,e,t,!1,r)},ht.unmountComponentAtNode=function(e){if(!Xo(e))throw Error(a(40));return e._reactRootContainer?(yn(function(){Yo(null,null,e,!1,function(){e._reactRootContainer=null,e[Pt]=null})}),!0):!1},ht.unstable_batchedUpdates=Us,ht.unstable_renderSubtreeIntoContainer=function(e,t,r,o){if(!Xo(r))throw Error(a(200));if(e==null||e._reactInternals===void 0)throw Error(a(38));return Yo(e,t,r,!1,o)},ht.version="18.3.1-next-f1338f8080-20240426",ht}var ud;function Up(){if(ud)return Zs.exports;ud=1;function l(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l)}catch(i){console.error(i)}}return l(),Zs.exports=Op(),Zs.exports}var pd;function $p(){if(pd)return Zo;pd=1;var l=Up();return Zo.createRoot=l.createRoot,Zo.hydrateRoot=l.hydrateRoot,Zo}var Bp=$p();const oi="cheng_access_token",na="cheng_refresh_token";class We{constructor(i){this.apiBaseUrl=i}apiBaseUrl;async getAccessToken(){return this.getAccessTokenSync()}getAccessTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(oi)}getRefreshTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(na)}storeTokens(i,a){typeof window>"u"||(window.localStorage.setItem(oi,i),a&&window.localStorage.setItem(na,a))}clearTokens(){typeof window>"u"||(window.localStorage.removeItem(oi),window.localStorage.removeItem(na))}async refreshAccessToken(){const i=this.getRefreshTokenSync();if(!i)return null;const a=await fetch(`${this.apiBaseUrl}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:i})});if(!a.ok)return null;const d=await a.json().catch(()=>null),p=d?.token??d?.access_token??null;return p?(this.storeTokens(p,d?.refresh_token),p):null}}const Br="cheng:auth-expired";function Nd(){new We("").clearTokens()}function Nn(l="expired"){Nd(),!(typeof window>"u")&&window.dispatchEvent(new CustomEvent(Br,{detail:{reason:l}}))}class pa{constructor(i){this.apiBaseUrl=i,this.session=new We(i)}apiBaseUrl;session;async login(i){const a=await fetch(`${this.apiBaseUrl}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!a.ok){const p=await a.json().catch(()=>({}));throw new Error(p.message??p.error??`Login failed (${a.status})`)}const d=await a.json();return this.session.storeTokens(d.token,d.refresh_token),d}async resetPassword(i){const a=await fetch(`${this.apiBaseUrl}/auth/password/reset`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!a.ok){const d=await a.json().catch(()=>({}));throw new Error(d.message??d.error??`Reset password failed (${a.status})`)}}async refresh(){const i=await this.session.refreshAccessToken();return i||Nn("refresh-failed"),i}logout(){Nd()}getAccessToken(){return this.session.getAccessTokenSync()}getRefreshToken(){return this.session.getRefreshTokenSync()}isAuthenticated(){return!!this.getAccessToken()}}class Id{apiBaseUrl;workspaceId;contractWarnedKeys;tokenProvider;constructor(i,a){this.apiBaseUrl=i.apiBaseUrl,this.workspaceId=i.workspaceId.trim(),this.contractWarnedKeys=new Set,this.tokenProvider=a??new We(i.apiBaseUrl)}assertWorkspaceId(){if(!this.workspaceId)throw new jt("VALIDATION_ERROR","workspaceId is required in ChannelConfig",422)}async execute(i,a,d,p,u,m){this.assertWorkspaceId();const w={app_id:i,external_user_id:(u||"web-user").trim(),external_chat_id:(p||`web-session-${Date.now()}`).trim(),mode:"workflow_chat",workflow_id:a,extra_context:{channel_id:i}},v=await this.resolveConversation(this.workspaceId,w),_=this._extractConversationId(v),z=await this.createMessage(_,{role:"user",content:d,attachments:m&&m.length>0?m:void 0}),T=this._extractExecutionId(z);return this._normalizeExecuteData({conversation_id:_,workflow_id:a,execution_id:T})}async workflowSupportsAttachments(i){try{const a=await this._fetch(`/workflows/${i}`,"GET");return(a?.definition?.nodes??a?.data?.definition?.nodes??[]).some(p=>p?.nodeType==="io/file_upload"||p?.node_type==="io/file_upload")}catch{return!1}}async resolveConversation(i,a){if(!i?.trim())throw new jt("VALIDATION_ERROR","workspaceId is required to resolve a conversation",422);return this._fetch(`/workspaces/${i}/conversations/resolve`,"POST",a)}async getConversationMessages(i){const a=await this._fetch(`/conversations/${i}/messages`,"GET");return(Array.isArray(a)?a:Array.isArray(a?.data)?a.data:Array.isArray(a?.data?.items)?a.data.items:Array.isArray(a?.items)?a.items:[]).map(p=>({id:p.id??p.messageId??"",role:p.role??"assistant",content:p.content??"",createdAt:p.createdAt??p.created_at??new Date().toISOString(),executionId:p.executionId??p.execution_id}))}async createMessage(i,a){return this._fetch(`/conversations/${i}/messages`,"POST",a)}async submitApproval(i,a,d,p){return this._fetch(`/executions/${i}/approve`,"POST",{requestId:a,decision:d,scope:"once",reason:p||null})}async getExecution(i){const a=await this._fetch(`/executions/${encodeURIComponent(i)}`,"GET"),d=a?.data??a,p=d?.error??d?.error_info??d?.errorInfo;return{executionId:d?.executionId??d?.execution_id??d?.id??i,status:d?.status??d?.state??"unknown",conversationId:d?.conversationId??d?.conversation_id,workflowId:d?.workflowId??d?.workflow_id,createdAt:d?.createdAt??d?.created_at,startedAt:d?.startedAt??d?.started_at,completedAt:d?.completedAt??d?.completed_at,updatedAt:d?.updatedAt??d?.updated_at,error:typeof p=="string"?p:p?{message:p.message??"Execution failed",code:p.code,details:p.details}:void 0,resultAvailable:d?.resultAvailable??d?.result_available??d?.result!=null,result:d?.result,review:d?.review??d?.review_payload,approval:d?.approval??d?.approval_payload}}async getExecutionResult(i){return this._fetch(`/executions/${encodeURIComponent(i)}/result`,"GET")}async _fetch(i,a,d){const p=`${this.apiBaseUrl}${i}`;try{const u={"Content-Type":"application/json"},m=await this.tokenProvider.getAccessToken();if(!m)throw Nn("missing-access-token"),new jt("UNAUTHORIZED","Access token is missing",401);const w=d!==void 0?JSON.stringify(d):void 0,v=async T=>{const H={...u,Authorization:`Bearer ${T}`};return fetch(p,{method:a,headers:H,body:w})};let _=await v(m),z=!1;if(_.status===401&&this.tokenProvider.refreshAccessToken){const T=await this.tokenProvider.refreshAccessToken().catch(()=>null);T?_=await v(T):(Nn("refresh-failed"),z=!0)}return _.ok||await this._handleError(_,z),_.json()}catch(u){throw u instanceof jt?u:new jt("NETWORK_ERROR",u instanceof Error?u.message:"Unknown network error",0)}}_extractConversationId(i){const a=i&&typeof i=="object"?i:{},d=a.data&&typeof a.data=="object"?a.data:a,p=d.id??d.conversation_id??d.conversationId;if(typeof p!="string"||!p)throw new jt("UNKNOWN_ERROR","Conversation resolve response missing conversation id",500,i);return p}_extractExecutionId(i){const a=i&&typeof i=="object"?i:{},d=a.data&&typeof a.data=="object"?a.data:a,p=a.metadata&&typeof a.metadata=="object"?a.metadata:d.metadata&&typeof d.metadata=="object"?d.metadata:null,u=p?.execution_id??p?.executionId??d.execution_id??d.executionId??null;return typeof u=="string"?u:null}_normalizeExecuteData(i){const a=i&&typeof i=="object"?i:{},d=a.conversation_id??a.conversationId,p=a.workflow_id??a.workflowId,u=a.execution_id??a.executionId??null;(d===void 0||p===void 0)&&this._warnContract("execute-missing-fields","[contract-guard] execute response missing expected fields: conversation_id/workflow_id");const w=Object.keys(a).filter(v=>v.includes("_"));return w.length>0&&this._warnContract("execute-snake-keys",`[contract-guard] execute response contains snake_case keys: ${w.join(", ")}`),{conversation_id:typeof d=="string"?d:"",workflow_id:typeof p=="string"?p:"",execution_id:typeof u=="string"?u:null}}_warnContract(i,a){this.contractWarnedKeys.has(i)||(this.contractWarnedKeys.add(i),console.warn(a))}async _handleError(i,a){const d=i.status;let p;try{p=await i.json()}catch{p={message:i.statusText}}const u=p.message||p.error||"Unknown error";switch(d){case 401:throw a||Nn("channel-unauthorized"),new jt("UNAUTHORIZED","Access token is invalid or expired",d,p);case 404:throw new jt("NOT_FOUND","Resource not found",d,p);case 422:throw new jt("VALIDATION_ERROR",u,d,p);case 429:throw new jt("RATE_LIMIT","Too many requests",d,p);case 500:case 502:case 503:case 504:throw new jt("SERVER_ERROR","Server error, please try again later",d,p);default:throw new jt("UNKNOWN_ERROR",u,d,p)}}}class jt extends Error{constructor(i,a,d,p){super(a),this.code=i,this.status=d,this.details=p,this.name="ChannelClientError"}code;status;details}class Ed{storage;sessionKey;conversationKey;sessionsKey;conversationMapKey;constructor(i,a){this.storage=a||(typeof window<"u"?window.localStorage:new Hp),this.sessionKey=`cheng_session_${i}`,this.conversationKey=`cheng_conversation_${i}`,this.sessionsKey=`cheng_sessions_${i}`,this.conversationMapKey=`cheng_conversation_map_${i}`}getOrCreateSessionId(){let i=this.storage.getItem(this.sessionKey);return i||(i=this._generateUUID(),this.storage.setItem(this.sessionKey,i)),this._ensureCurrentSessionListed(i),i}resetSession(){const i=this._generateUUID();return this.storage.setItem(this.sessionKey,i),this.storage.removeItem(this.conversationKey),this._ensureCurrentSessionListed(i),i}setConversationId(i){this.storage.setItem(this.conversationKey,i);const a=this.getOrCreateSessionId(),d=this._getConversationMap();d[a]=i,this._setConversationMap(d),this._updateSession(a,{conversationId:i})}getConversationId(){const i=this.storage.getItem(this.sessionKey),a=this._getConversationMap();if(i&&a[i])return a[i];const d=this.storage.getItem(this.conversationKey);return i&&d&&(a[i]=d,this._setConversationMap(a),this._updateSession(i,{conversationId:d})),d}clearConversationId(){this.storage.removeItem(this.conversationKey);const i=this.storage.getItem(this.sessionKey);if(!i)return;const a=this._getConversationMap();delete a[i],this._setConversationMap(a),this._updateSession(i,{conversationId:void 0})}clear(){this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey),this.storage.removeItem(this.sessionsKey),this.storage.removeItem(this.conversationMapKey)}listSessions(){const i=this.storage.getItem(this.sessionsKey),a=this.storage.getItem(this.sessionKey),d=this._getConversationMap();if(!i){if(!a)return[];const p={id:a,label:"Session 1",createdAt:new Date().toISOString(),conversationId:d[a],pinned:!1};return this.storage.setItem(this.sessionsKey,JSON.stringify([p])),[p]}try{const u=JSON.parse(i).map(w=>({...w,conversationId:d[w.id]??w.conversationId}));a&&!u.some(w=>w.id===a)&&u.unshift({id:a,label:`Session ${u.length+1}`,createdAt:new Date().toISOString(),conversationId:d[a],pinned:!1});const m=[...u.filter(w=>w.pinned),...u.filter(w=>!w.pinned)];return this.storage.setItem(this.sessionsKey,JSON.stringify(m)),m}catch{return[]}}createSession(i){const a=this.listSessions(),d=this._generateUUID(),p=i??`Session ${a.length+1}`,u={id:d,label:p,createdAt:new Date().toISOString(),pinned:!1};return a.unshift(u),this.storage.setItem(this.sessionsKey,JSON.stringify(a)),this.storage.setItem(this.sessionKey,d),this.storage.removeItem(this.conversationKey),u}renameSession(i,a){const d=a.trim();d&&this._updateSession(i,{label:d})}togglePinSession(i){const a=this.listSessions().find(d=>d.id===i);a&&this._updateSession(i,{pinned:!a.pinned})}deleteSession(i){let a=this.listSessions();const d=this.storage.getItem(this.sessionKey);if(a=a.filter(u=>u.id!==i),this.storage.setItem(this.sessionsKey,JSON.stringify(a)),d===i)if(a.length>0){this.storage.setItem(this.sessionKey,a[0].id);const m=this._getConversationMap()[a[0].id];m?this.storage.setItem(this.conversationKey,m):this.storage.removeItem(this.conversationKey)}else this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey);const p=this._getConversationMap();delete p[i],this._setConversationMap(p)}getActiveSessionId(){return this.getOrCreateSessionId()}setActiveSessionId(i){this.storage.setItem(this.sessionKey,i),this._ensureCurrentSessionListed(i);const d=this._getConversationMap()[i];d?this.storage.setItem(this.conversationKey,d):this.storage.removeItem(this.conversationKey)}_getConversationMap(){const i=this.storage.getItem(this.conversationMapKey);if(!i)return{};try{return JSON.parse(i)}catch{return{}}}_setConversationMap(i){this.storage.setItem(this.conversationMapKey,JSON.stringify(i))}_updateSession(i,a){const p=this.listSessions().map(u=>u.id===i?{...u,...a}:u);this.storage.setItem(this.sessionsKey,JSON.stringify(p))}_ensureCurrentSessionListed(i){const a=this.listSessions();if(a.some(p=>p.id===i))return;const d=[{id:i,label:`Session ${a.length+1}`,createdAt:new Date().toISOString(),conversationId:this._getConversationMap()[i],pinned:!1},...a];this.storage.setItem(this.sessionsKey,JSON.stringify(d))}_generateUUID(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,i=>{const a=Math.random()*16|0;return(i==="x"?a:a&3|8).toString(16)})}}let Hp=class{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(i){return this.data.get(i)??null}key(i){return Array.from(this.data.keys())[i]??null}removeItem(i){this.data.delete(i)}setItem(i,a){this.data.set(i,a)}};const Kp=new Set(["completed_unread","failed_unread","cancelled"]);function Vp(l){switch(String(l??"").toLowerCase()){case"pending":case"queued":case"created":return"pending";case"running":case"in_progress":case"started":return"running";case"paused":case"waiting_for_review":case"waiting_for_approval":case"review":return"waiting_for_review";case"completed":case"succeeded":case"success":return"completed_unread";case"failed":case"error":return"failed_unread";case"cancelled":case"canceled":return"cancelled";default:return"unknown"}}function Gp(l){return Vp(l.status)}const un=l=>Kp.has(l),hd=2,ra=200,qp=720*60*60*1e3,Or=l=>typeof l=="object"&&l!==null,Ur=l=>l==="paused"?"waiting_for_review":l==="completed"?"completed_unread":l==="failed"?"failed_unread":l;class Cn{storage;recordsKey;legacyActiveKey;constructor(i,a){this.storage=a??(typeof window<"u"?window.localStorage:new Qp),this.recordsKey=`cheng_execution_mappings_${i}`,this.legacyActiveKey=`cheng_active_execution_${i}`}setActive(i){const a=new Date().toISOString(),d={...i,sessionId:i.sessionId??i.externalChatId,status:Ur(i.status??"pending"),createdAt:i.createdAt??a,updatedAt:i.updatedAt??a};return this.mutate(p=>{p.records[d.executionId]=d,p.activeByConversation[d.conversationId]=d.executionId}),this.safeSet(this.legacyActiveKey,d.executionId),d}upsert(i){const a={...i,sessionId:i.sessionId??i.externalChatId,status:Ur(i.status)};return this.mutate(d=>{d.records[i.executionId]=a,this.isActive(a.status)?d.activeByConversation[i.conversationId]=i.executionId:d.activeByConversation[i.conversationId]===i.executionId&&delete d.activeByConversation[i.conversationId]}),a}getActive(){const i=this.safeGet(this.legacyActiveKey);if(i){const a=this.getByExecutionId(i);if(a&&this.isActive(a.status))return a}return this.listRecoverable().find(a=>this.isActive(a.status))??null}getActiveForConversation(i){return this.findActiveByConversation(i)}getByExecutionId(i){return this.read().records[i]??null}findActiveByConversation(i){const a=this.read(),d=a.activeByConversation[i]&&a.records[a.activeByConversation[i]];return d&&this.isActive(d.status)?d:this.sorted(a.records).find(p=>p.conversationId===i&&this.isActive(p.status))??null}findBySession(i){return this.sorted(this.read().records).filter(a=>(a.sessionId??a.externalChatId)===i)}findLatestByConversation(i){return this.sorted(this.read().records).find(a=>a.conversationId===i)??null}listRecoverable(){return this.sorted(this.read().records).filter(i=>!i.acknowledgedAt||this.isActive(i.status))}listAll(){return this.sorted(this.read().records)}updateStatus(i,a,d={}){let p=null;return this.mutate(u=>{const m=u.records[i];m&&(p={...m,...d,status:Ur(a),updatedAt:new Date().toISOString()},u.records[i]=p,un(p.status)&&u.activeByConversation[m.conversationId]===i&&delete u.activeByConversation[m.conversationId])}),p}acknowledge(i){return this.updateStatus(i,"idle",{acknowledgedAt:new Date().toISOString()})}clearActive(i){this.mutate(a=>{for(const[d,p]of Object.entries(a.activeByConversation))p===i&&delete a.activeByConversation[d]}),this.safeGet(this.legacyActiveKey)===i&&this.safeRemove(this.legacyActiveKey)}clearExecution(i){const a=this.getByExecutionId(i);a&&un(Ur(a.status))?this.clearActive(i):this.removeExecution(i)}removeExecution(i){this.mutate(a=>{delete a.records[i];for(const[d,p]of Object.entries(a.activeByConversation))p===i&&delete a.activeByConversation[d]}),this.safeGet(this.legacyActiveKey)===i&&this.safeRemove(this.legacyActiveKey)}clearConversation(i){this.mutate(a=>{for(const[d,p]of Object.entries(a.records))p.conversationId===i&&delete a.records[d];delete a.activeByConversation[i]})}cleanup(i=Date.now()){this.mutate(a=>{const d=this.sorted(a.records).filter((p,u)=>u<ra&&(this.isActive(p.status)||i-Date.parse(p.updatedAt)<=qp));a.records=Object.fromEntries(d.map(p=>[p.executionId,p]));for(const[p,u]of Object.entries(a.activeByConversation))a.records[u]||delete a.activeByConversation[p]})}clear(){this.safeRemove(this.recordsKey),this.safeRemove(this.legacyActiveKey)}isActive(i){return["pending","running","waiting_for_review","unknown","paused"].includes(i)}sorted(i){return Object.values(i).sort((a,d)=>Date.parse(d.updatedAt)-Date.parse(a.updatedAt))}mutate(i){const a=this.read();i(a),a.revision++,this.prune(a),this.safeSet(this.recordsKey,JSON.stringify(a))}prune(i){const a=this.sorted(i.records);a.length>ra&&(i.records=Object.fromEntries(a.slice(0,ra).map(d=>[d.executionId,d])))}read(){const i={version:hd,revision:0,records:{},activeByConversation:{}},a=this.safeGet(this.recordsKey);if(!a)return i;try{const d=JSON.parse(a),p=Or(d)&&d.version===hd&&Or(d.records)?d.records:d;if(!Or(p))return i;for(const u of Object.values(p)){if(!Or(u))continue;const m=typeof u.boundWorkflowId=="string"?u.boundWorkflowId:u.workflowId;if(![u.channelId,m,u.conversationId,u.executionId,u.externalChatId,u.status,u.createdAt,u.updatedAt].every(z=>typeof z=="string"))continue;const w=u,{workflowId:v,..._}=w;i.records[w.executionId]={..._,boundWorkflowId:m,sessionId:w.sessionId??w.externalChatId,status:Ur(w.status)},this.isActive(w.status)&&(i.activeByConversation[w.conversationId]=w.executionId)}return Or(d)&&typeof d.revision=="number"&&(i.revision=d.revision),i}catch{return i}}safeGet(i){try{return this.storage.getItem(i)}catch{return null}}safeSet(i,a){try{this.storage.setItem(i,a)}catch{}}safeRemove(i){try{this.storage.removeItem(i)}catch{}}}class Qp{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(i){return this.data.get(i)??null}key(i){return[...this.data.keys()][i]??null}removeItem(i){this.data.delete(i)}setItem(i,a){this.data.set(i,a)}}const Xp="cheng:execution-invalidated";function Yp(l){typeof window<"u"&&window.dispatchEvent(new CustomEvent(Xp,{detail:l}));try{if(typeof BroadcastChannel<"u"){const i=new BroadcastChannel("cheng-executions-v2");i.postMessage(l),i.close()}}catch{}}class Ad{config;ws=null;status="disconnected";eventHandlers=new Map;statusHandlers=new Set;activeSubscriptions=new Set;reconnectTimer=null;reconnectAttempts=0;shouldReconnect=!0;_wsGeneration=0;heartbeatTimer=null;heartbeatTimeoutTimer=null;lastPongTime=0;messageQueue=[];contractWarnedKeys=new Set;constructor(i){this.config={url:i.url,tokenProvider:i.tokenProvider,reconnect:i.reconnect??!0,reconnectInterval:i.reconnectInterval??1e3,reconnectMaxInterval:i.reconnectMaxInterval??3e4,reconnectBackoffRate:i.reconnectBackoffRate??2,reconnectMaxAttempts:i.reconnectMaxAttempts??1/0,reconnectJitter:i.reconnectJitter??!1,heartbeatInterval:i.heartbeatInterval??3e4,heartbeatTimeout:i.heartbeatTimeout??1e4,debug:i.debug??!1}}connect(){if(this.shouldReconnect=!0,this.ws?.readyState===WebSocket.OPEN){this._log("Already connected");return}if(this.ws?.readyState===WebSocket.CONNECTING){this._log("Already connecting");return}const i=this.config.tokenProvider?.(),a=i?`${this.config.url}${this.config.url.includes("?")?"&":"?"}token=${encodeURIComponent(i)}`:this.config.url;this._log(`Connecting to ${this.config.url}...`),this._setStatus("connecting");try{this._wsGeneration++,this.ws=new WebSocket(a),this._setupWebSocketHandlers(this._wsGeneration)}catch(d){this._log("Connection error:",d),this._setStatus("error"),this._scheduleReconnect()}}disconnect(){if(this._log("Disconnecting..."),this.shouldReconnect=!1,this._clearTimers(),this.messageQueue=[],this.ws){this._setStatus("disconnecting");const i=this.ws;i.readyState===WebSocket.CONNECTING?(i.onmessage=null,i.onerror=null,i.onclose=null,i.onopen=()=>i.close(1e3,"Client disconnect")):i.readyState===WebSocket.OPEN&&i.close(1e3,"Client disconnect"),this.ws=null}this._setStatus("disconnected")}subscribe(i){const a=this._serializeScope(i);if(this.activeSubscriptions.has(a)){this._log(`Already subscribed to ${a}`);return}this.activeSubscriptions.add(a);const d={type:"SUBSCRIBE",scope:i};this._send(JSON.stringify(d)),this._log(`Subscribed to ${a}`)}unsubscribe(i){const a=this._serializeScope(i);if(!this.activeSubscriptions.has(a)){this._log(`Not subscribed to ${a}`);return}this.activeSubscriptions.delete(a);const d={type:"UNSUBSCRIBE",scope:i};this._send(JSON.stringify(d)),this._log(`Unsubscribed from ${a}`)}on(i,a){this.eventHandlers.has(i)||this.eventHandlers.set(i,new Set),this.eventHandlers.get(i).add(a)}off(i,a){const d=this.eventHandlers.get(i);d&&(d.delete(a),d.size===0&&this.eventHandlers.delete(i))}onStatusChange(i){this.statusHandlers.add(i)}offStatusChange(i){this.statusHandlers.delete(i)}getStatus(){return this.status}getActiveSubscriptions(){return Array.from(this.activeSubscriptions).map(i=>this._deserializeScope(i))}_setupWebSocketHandlers(i){this.ws&&(this.ws.onopen=()=>{this._log("Connected"),setTimeout(()=>{this._setStatus("connected"),this._flushMessageQueue(),this._restoreSubscriptions(),this._startHeartbeat()},1)},this.ws.onclose=a=>{i===this._wsGeneration&&(this._log(`Connection closed: ${a.code} ${a.reason}`),this._clearTimers(),this._setStatus("disconnected"),this.shouldReconnect&&this.config.reconnect&&this._scheduleReconnect())},this.ws.onerror=a=>{this._log("WebSocket error:",a),this._setStatus("error")},this.ws.onmessage=a=>{this._handleMessage(a.data)})}_handleMessage(i){try{const a=JSON.parse(i),d=this._normalizeEnvelope(a);if(!d){this._log("Ignoring malformed envelope:",a);return}if(this._guardEnvelopeContract(a,d),this._log("Received:",d.type,d),d.type==="PONG"){this._handlePong();return}this._dispatchEvent(d)}catch(a){this._log("Failed to parse message:",a,i)}}_normalizeEnvelope(i){if(!i||typeof i!="object"||Array.isArray(i))return null;const a=this._deepCamelizeKeys(i),d=a.type;if(typeof d!="string")return null;const p=typeof a.messageId=="string"?a.messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,u=typeof a.timestamp=="string"?a.timestamp:new Date().toISOString();return{...a,messageId:p,timestamp:u,type:d}}_guardEnvelopeContract(i,a){const p=(i&&typeof i=="object"&&!Array.isArray(i)?Object.keys(i):[]).filter(v=>v.includes("_"));p.length>0&&this._warnContract(`snake:${a.type}`,`[contract-guard] WS ${a.type} contains snake_case keys: ${p.join(", ")}`);const m={MESSAGE_CREATED:["conversationId","messageId","role","content"],WORKFLOW_TRIGGERED:["conversationId","workflowId","executionId"],MESSAGE_COMPLETED:["conversationId","messageId"],NODE_STREAM_CHUNK:["executionId","nodeId","content","sequence"],NODE_STREAM_COMPLETE:["executionId","nodeId","fullContent"],NODE_STREAM_FAILED:["executionId","nodeId","error"],EXECUTION_FAILED:["executionId","error"],ERROR:["code","message"]}[a.type];if(!m)return;const w=m.filter(v=>a[v]===void 0||a[v]===null);w.length>0&&this._warnContract(`missing:${a.type}:${w.join(",")}`,`[contract-guard] WS ${a.type} missing expected fields: ${w.join(", ")}`)}_warnContract(i,a){this.contractWarnedKeys.has(i)||(this.contractWarnedKeys.add(i),console.warn(a))}_deepCamelizeKeys(i){if(Array.isArray(i))return i.map(p=>this._deepCamelizeKeys(p));if(!i||typeof i!="object")return i;const a=i,d={};for(const[p,u]of Object.entries(a))d[this._toCamelCase(p)]=this._deepCamelizeKeys(u);return d}_toCamelCase(i){return i.replace(/_([a-z])/g,(a,d)=>d.toUpperCase())}_dispatchEvent(i){const a=this.eventHandlers.get("*");a&&a.forEach(p=>{try{p(i)}catch(u){this._log("Error in wildcard handler:",u)}});const d=this.eventHandlers.get(i.type);d&&d.forEach(p=>{try{p(i)}catch(u){this._log(`Error in ${i.type} handler:`,u)}})}_send(i){const a=this._wrapEnvelope(i);this.ws?.readyState===WebSocket.OPEN?(this.ws.send(a),this._log("Sent:",a)):(this.messageQueue.push(i),this._log("Queued:",i))}_wrapEnvelope(i){try{const a=JSON.parse(i),d={messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,timestamp:new Date().toISOString(),...a};return JSON.stringify(d)}catch{return i}}_flushMessageQueue(){this.messageQueue.length!==0&&(this._log(`Flushing ${this.messageQueue.length} queued messages`),this.messageQueue.forEach(i=>{this.ws?.readyState===WebSocket.OPEN&&this.ws.send(this._wrapEnvelope(i))}),this.messageQueue=[])}_restoreSubscriptions(){this.activeSubscriptions.size!==0&&(this._log(`Restoring ${this.activeSubscriptions.size} subscriptions`),this.messageQueue=this.messageQueue.filter(i=>{try{const a=JSON.parse(i);return a.type!=="SUBSCRIBE"&&a.type!=="UNSUBSCRIBE"}catch{return!0}}),this.activeSubscriptions.forEach(i=>{const d={type:"SUBSCRIBE",scope:this._deserializeScope(i)};this.ws?.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(d))}))}_scheduleReconnect(){if(!this.config.reconnect||!this.shouldReconnect)return;if(this.reconnectAttempts>=this.config.reconnectMaxAttempts){this._log(`Max reconnect attempts (${this.config.reconnectMaxAttempts}) reached, giving up`),this.shouldReconnect=!1,this._setStatus("error");return}let i=Math.min(this.config.reconnectInterval*Math.pow(this.config.reconnectBackoffRate,this.reconnectAttempts),this.config.reconnectMaxInterval);if(this.config.reconnectJitter){const a=i*.3*Math.random();i=i+a}this._log(`Reconnecting in ${Math.round(i)}ms (attempt ${this.reconnectAttempts+1}/${this.config.reconnectMaxAttempts})`),this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.reconnectAttempts++,this._setStatus("connecting"),this.connect()},i)}_startHeartbeat(){this._clearHeartbeat(),this.heartbeatTimer=setInterval(()=>{this._sendPing()},this.config.heartbeatInterval),this._sendPing()}_sendPing(){this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null);const i={type:"PING",timestamp:Date.now()};this._send(JSON.stringify(i)),this.heartbeatTimeoutTimer=setTimeout(()=>{this._log(`Heartbeat timeout (${this.config.heartbeatTimeout}ms), reconnecting...`),this.ws?.close(1e3,"Heartbeat timeout")},this.config.heartbeatTimeout)}_handlePong(){const i=Date.now(),a=this.lastPongTime?i-this.lastPongTime:0;this.lastPongTime=i,this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null),this._log(`Heartbeat OK${a?` (Δ ${a}ms)`:""}`)}_clearHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=null),this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null)}_clearTimers(){this._clearHeartbeat(),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null)}_setStatus(i){this.status!==i&&(this.status=i,this._log(`Status changed: ${i}`),this.statusHandlers.forEach(a=>{try{a(i)}catch(d){this._log("Error in status handler:",d)}}))}_serializeScope(i){if(i.type==="workspace")return`ws:${i.workspaceId}`;if(i.type==="conversation")return`conv:${i.conversationId}`;if(i.type==="execution")return`exec:${i.executionId}`;throw new Error(`Unknown scope type: ${i.type}`)}_deserializeScope(i){const[a,d]=i.split(":");if(a==="ws")return{type:"workspace",workspaceId:d};if(a==="conv")return{type:"conversation",conversationId:d};if(a==="exec")return{type:"execution",executionId:d};throw new Error(`Invalid scope key: ${i}`)}_log(...i){this.config.debug&&console.log("[WsClient]",...i)}}const ke=l=>typeof l=="object"&&l!==null;function Zn(l){if(Array.isArray(l))return l;if(!ke(l))return[];const i=l,a=ke(i.data)?i.data:void 0;return Array.isArray(a?.items)?a.items:Array.isArray(i.data)?i.data:Array.isArray(i.items)?i.items:[]}function ei(l,i){const a=l.bound_workflow_id??l.boundWorkflowId,d=a!=null&&a!==""?String(a):"";return{id:String(l.id??""),workspaceId:String(l.workspace_id??l.workspaceId??i),channelId:String(l.channel_id??l.channelId??""),name:String(l.name??""),description:l.description!=null?String(l.description):void 0,boundWorkflowId:d,appType:typeof l.app_type=="string"?l.app_type:typeof l.appType=="string"?l.appType:void 0,connectionConfig:ke(l.connection_config)?l.connection_config:ke(l.connectionConfig)?l.connectionConfig:void 0,enabled:typeof l.enabled=="boolean"?l.enabled:!0,connectionState:typeof l.connection_state=="string"?l.connection_state:typeof l.connectionState=="string"?l.connectionState:void 0,setupData:ke(l.setup_data)?l.setup_data:ke(l.setupData)?l.setupData:void 0,webhookUrl:typeof l.webhook_url=="string"?l.webhook_url:typeof l.webhookUrl=="string"?l.webhookUrl:void 0,createdAt:String(l.created_at??l.createdAt??new Date().toISOString()),updatedAt:String(l.updated_at??l.updatedAt??l.created_at??l.createdAt??new Date().toISOString())}}function Jp(l){const a=(Array.isArray(l.tags)?l.tags:[]).find(u=>u.startsWith("chid:"));if(!a)return null;const d=ke(l.metadata)?l.metadata:{},p=String(l.id??l.workflowId??l.workflow_id??"");return{id:p,workspaceId:String(d.workspace_id??d.workspaceId??""),channelId:a.slice(5),name:String(d.display_name??l.name??""),description:l.description?String(l.description):void 0,boundWorkflowId:String(d.workflow_id??d.workflowId??p),appType:typeof d.app_type=="string"?d.app_type:void 0,connectionConfig:ke(d.connection_config)?d.connection_config:void 0,enabled:!0,createdAt:String(l.created_at??l.createdAt??new Date().toISOString()),updatedAt:String(l.updated_at??l.updatedAt??l.created_at??l.createdAt??new Date().toISOString())}}function fd(l){const i=ke(l.metadata)?l.metadata:{},a=l.id??l.workflow_id??l.workflowId,d=l.name??l.display_name??l.displayName??i.display_name??i.displayName??a;return{id:String(a??""),name:String(d??""),description:l.description!=null?String(l.description):void 0,state:typeof l.state=="string"?l.state:void 0,visibility:typeof l.visibility=="string"?l.visibility:void 0,tags:Array.isArray(l.tags)?l.tags.map(String):[],createdAt:typeof(l.created_at??l.createdAt)=="string"?String(l.created_at??l.createdAt):void 0,updatedAt:typeof(l.updated_at??l.updatedAt)=="string"?String(l.updated_at??l.updatedAt):void 0}}class qe{constructor(i,a){this.apiBaseUrl=i,this.tokenProvider=a}apiBaseUrl;tokenProvider;async listChannels(){let i;try{i=await this.listWorkspaces()}catch(p){if(gd(p))throw p;return this._listChannelsLegacy()}if(i.length===0)return this._listChannelsLegacy();const a=[];let d=!1;for(const p of i){const u=await this._fetchChannelsByWorkspaceSafe(p.id);u!==null&&(d=!0,a.push(...u))}return d?a:this._listChannelsLegacy()}async createChannel(i){try{const a=await this._fetch(`/workspaces/${i.workspaceId}/channels`,"POST",{channel_id:i.channelId,name:i.name,bound_workflow_id:i.boundWorkflowId,description:i.description,app_type:i.appType,connection_config:i.connectionConfig}),d=ke(a)?a:void 0,p=ke(d?.data)?d?.data:d??{};return ei(p,i.workspaceId)}catch(a){if(a instanceof ii&&a.status===409){const d=ke(a.body)?a.body:void 0,p=ke(d?.details)?d.details:void 0,u=ke(p?.existing_channel)?p.existing_channel:void 0;if(u)return ei(u,i.workspaceId);throw new Error(`Integration with ID "${i.channelId}" already exists in this workspace.`)}if(!oa(a))throw a;return this._createChannelLegacy(i)}}async updateChannel(i){const a=await this._fetch(`/workspaces/${i.workspaceId}/channels/${i.id}`,"PATCH",{channel_id:i.channelId,name:i.name,bound_workflow_id:i.boundWorkflowId,description:i.description,app_type:i.appType,connection_config:i.connectionConfig}),d=ke(a)?a:void 0,p=ke(d?.data)?d?.data:d??{};return ei(p,i.workspaceId)}async deleteChannel(i,a){if(a)try{await this._fetch(`/workspaces/${a}/channels/${i}`,"DELETE");return}catch(d){if(!oa(d))throw d}await this._fetch(`/workflows/${i}`,"DELETE")}async listWorkspaces(){const i=await this._fetch("/workspaces","GET");return Zn(i).map(d=>{const p=d;return{id:String(p.id??p.workspace_id??""),name:String(p.name??""),description:p.description?String(p.description):void 0,createdAt:String(p.created_at??p.createdAt??new Date().toISOString()),updatedAt:p.updated_at?String(p.updated_at):p.updatedAt?String(p.updatedAt):void 0}})}async createWorkspace(i){const a=await this._fetch("/workspaces","POST",{name:i.name,description:i.description}),d=ke(a)?a:void 0,u=ke(d?.data)?d?.data:d??{};return{id:String(u.id??u.workspace_id??""),name:String(u.name??i.name),description:u.description?String(u.description):i.description,createdAt:String(u.created_at??u.createdAt??new Date().toISOString()),updatedAt:u.updated_at?String(u.updated_at):u.updatedAt?String(u.updatedAt):void 0}}async listPublishedWorkflows(i){const a=i.workspaceId.trim();if(!a)throw new Error("workspaceId is required to list workflows");const d=i.limit??100,p=new URLSearchParams({state:"active",limit:String(d)}),u=await this._fetch(`/workflows?${p.toString()}`,"GET",void 0,a),m=Zn(u).map(_=>fd(_)).filter(_=>_.id.trim().length>0);if(m.length>=d)return m.slice(0,d);let w=[];try{const _=new URLSearchParams({tags:"long_task,scheduled",limit:String(d)}),z=await this._fetch(`/workflows?${_.toString()}`,"GET",void 0,a);w=Zn(z).map(T=>fd(T)).filter(T=>T.id.trim().length>0&&T.state?.toLowerCase()!=="archived")}catch(_){console.warn("Legacy published-workflow fallback failed; returning active workflows",_)}const v=new Map;for(const _ of[...m,...w])v.has(_.id)||v.set(_.id,_);return[...v.values()].slice(0,d)}async getWorkflowName(i,a){const d=await this._fetch(`/workflows/${i}`,"GET",void 0,a),p=ke(d)?d:void 0,m=ke(p?.data)?p?.data:p??{},w=ke(m.metadata)?m.metadata:void 0,v=m.name??m.display_name??m.displayName??w?.display_name??w?.displayName??m.title;return typeof v=="string"&&v.trim()?v.trim():null}async getChannelStatus(i,a){const d=await this._fetch(`/workspaces/${i}/channels/${a}/status`,"GET"),p=ke(d)?d:{},u=ke(p.data)?p.data:p;return{connectionState:String(u.connection_state??u.connectionState??"idle"),ok:typeof u.ok=="boolean"?u.ok:void 0,details:typeof u.details=="string"?u.details:void 0,lastMessageAt:typeof u.last_message_at=="string"?u.last_message_at:void 0,error:typeof u.error=="string"?u.error:void 0,mode:u.mode==="polling"||u.mode==="webhook"||u.mode==="stream"?u.mode:void 0,workerRunning:typeof u.worker_running=="boolean"?u.worker_running:void 0,lastPollAt:typeof u.last_poll_at=="string"?u.last_poll_at:void 0,startedAt:typeof u.started_at=="string"?u.started_at:void 0,lastEventAt:typeof u.last_event_at=="string"?u.last_event_at:void 0,lastError:typeof u.last_error=="string"?u.last_error:void 0}}async getChannelCapabilities(i,a){const d=await this._fetch(`/workspaces/${i}/channels/${a}/capabilities`,"GET"),p=ke(d)?d:{},u=ke(p.data)?p.data:p,m=w=>typeof w=="boolean"?w:void 0;return{raw:u,directMessage:m(u.direct_message),groupChat:m(u.group_chat),reactions:m(u.reactions),messageEdit:m(u.message_edit),messageDelete:m(u.message_delete),mediaUpload:m(u.media_upload),mediaDownload:m(u.media_download),typingIndicator:m(u.typing_indicator),readReceipts:m(u.read_receipts),webhooks:m(u.webhooks),longPolling:m(u.long_polling)}}async getChannelAuthPattern(i,a){const d=await this._fetch(`/workspaces/${i}/channels/${a}/auth-pattern`,"GET"),p=ke(d)?d:{},u=ke(p.data)?p.data:p,m=u.pattern??u.auth_pattern??u.authPattern;return{authPattern:Zp(m),raw:u,fields:Array.isArray(u.fields)?u.fields:void 0,webhookUrl:typeof(u.webhook_url??u.webhookUrl)=="string"?String(u.webhook_url??u.webhookUrl):void 0,oauthUrl:typeof(u.oauth_url??u.oauthUrl)=="string"?String(u.oauth_url??u.oauthUrl):void 0,instructions:typeof u.instructions=="string"?u.instructions:void 0}}async connectChannel(i,a,d){const p=await this._fetch(`/workspaces/${i}/channels/${a}/connect`,"POST",d),u=ke(p)?p:{},m=ke(u.data)?u.data:u;return{connectionState:String(m.connection_state??m.connectionState??"connecting"),setupData:ke(m.setup_data)?m.setup_data:ke(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async completeConnect(i,a,d){const p=await this._fetch(`/workspaces/${i}/channels/${a}/connect/complete`,"POST",d),u=ke(p)?p:{},m=ke(u.data)?u.data:u;return{connectionState:String(m.connection_state??m.connectionState??"active"),setupData:ke(m.setup_data)?m.setup_data:ke(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async disconnectChannel(i,a){await this._fetch(`/workspaces/${i}/channels/${a}/connect`,"DELETE")}async createFlowChatHandoff(i,a){const d=await this._fetch(`/workspaces/${i}/channel-keys/flowchat-handoff`,"POST",{name:a.name,channel_id:a.channelId,execution_mode:a.executionMode??"lan_host",setup_request:a.setupRequest,chengflow_base_url:a.chengflowBaseUrl}),p=ke(d)?d:{},u=ke(p.data)?p.data:p,m=ke(u.package)?u.package:void 0;if(!m||typeof u.code!="string")throw new Error("FlowChat handoff response is missing the sealed package");return{keyId:String(u.key_id??u.keyId??""),setupId:String(u.setup_id??u.setupId??""),hostDeviceId:String(u.host_device_id??u.hostDeviceId??""),hostEndpoint:typeof(u.host_endpoint??u.hostEndpoint)=="string"?String(u.host_endpoint??u.hostEndpoint):"",package:m,code:u.code}}async listChannelKeys(i){const a=await this._fetch(`/workspaces/${i}/channel-keys`,"GET"),d=ke(a)?a:{};return(Array.isArray(d.data)?d.data:Zn(a)).map(u=>{const m=ke(u)?u:{};return{id:String(m.id??""),name:String(m.name??""),appId:typeof m.app_id=="string"?m.app_id:void 0,channelId:typeof m.channel_id=="string"?m.channel_id:void 0,workspaceId:String(m.workspace_id??i),createdAt:String(m.created_at??""),lastUsedAt:typeof m.last_used_at=="string"?m.last_used_at:void 0,useCount:typeof m.use_count=="number"?m.use_count:0}})}async deleteChannelKey(i,a){await this._fetch(`/workspaces/${i}/channel-keys/${a}`,"DELETE")}async _fetchChannelsByWorkspaceSafe(i){try{const a=await this._fetch(`/workspaces/${i}/channels`,"GET");return Zn(a).map(p=>ei(p,i))}catch(a){if(oa(a))return null;if(gd(a))throw a;return[]}}async _listChannelsLegacy(){const i=await this._fetch("/workflows","GET"),a=Zn(i),d=[];for(const p of a){const u=Jp(p);u&&d.push(u)}return d}async _createChannelLegacy(i){const d=(await this._listChannelsLegacy()).find(T=>T.channelId===i.channelId);if(d)return d;const p={name:i.channelId,description:i.description,tags:[`chid:${i.channelId}`],metadata:{channel_id:i.channelId,workspace_id:i.workspaceId,display_name:i.name,workflow_id:i.boundWorkflowId,app_type:i.appType,connection_config:i.connectionConfig}},u=await this._fetch("/workflows","POST",p),m=ke(u)?u:void 0,v=ke(m?.data)?m?.data:m??{},_=ke(v.metadata)?v.metadata:{};return{id:String(v.id??v.workflowId??v.workflow_id??""),workspaceId:i.workspaceId,channelId:i.channelId,name:String(_.display_name??i.name),description:v.description?String(v.description):i.description,boundWorkflowId:String(_.workflow_id??_.workflowId??i.boundWorkflowId),appType:typeof _.app_type=="string"?_.app_type:i.appType,connectionConfig:ke(_.connection_config)?_.connection_config:i.connectionConfig,enabled:!0,createdAt:String(v.created_at??v.createdAt??new Date().toISOString()),updatedAt:String(v.updated_at??v.updatedAt??v.created_at??v.createdAt??new Date().toISOString())}}async _fetch(i,a,d,p){const u=`${this.apiBaseUrl}${i}`,m=await this.tokenProvider.getAccessToken();if(!m)throw Nn("missing-access-token"),new Error("Authentication required");const w=async z=>fetch(u,{method:a,headers:{"Content-Type":"application/json",Authorization:`Bearer ${z}`,...p?.trim()?{"X-Workspace-Id":p.trim()}:{}},body:d!==void 0?JSON.stringify(d):void 0});let v=await w(m),_=!1;if(v.status===401&&this.tokenProvider.refreshAccessToken){const z=await this.tokenProvider.refreshAccessToken().catch(()=>null);z?v=await w(z):(Nn("refresh-failed"),_=!0)}if(!v.ok){v.status===401&&!_&&Nn("unauthorized");const z=await v.text().catch(()=>"");let T;try{T=JSON.parse(z)}catch{T=void 0}throw new ii(v.status,`Management API error ${v.status}: ${z}`,T)}return v.status===204||v.headers.get("content-length")==="0"?null:v.json().catch(()=>null)}}class ii extends Error{constructor(i,a,d){super(a),this.status=i,this.body=d,this.name="ManagementApiError"}status;body}function oa(l){return l instanceof ii?l.status===404||l.status===405:l instanceof Error?l.message.includes("404")||l.message.includes("405"):!1}function gd(l){return l instanceof ii?l.status===401||l.status===403:l instanceof Error?l.message.includes("401")||l.message.includes("403")||l.message.toLowerCase().includes("authentication"):!1}const md=new Set;function Zp(l){const i=["webhook_token","webhook_signature","webhook_encrypted_signature","oauth","qr_session","stream_connection"],a=typeof l=="string"?l.toLowerCase().replace(/-/g,"_"):"";return i.includes(a)?a:(a&&!md.has(a)&&(md.add(a),console.warn(`[ManagementClient] Unknown auth-pattern value "${a}" from backend. Expected one of: ${i.join(", ")}. Defaulting to "webhook_token".`)),"webhook_token")}function eh(l){const{autoConnect:i=!0,enabled:a=!0,url:d,tokenProvider:p,...u}=l,m=f.useRef(!1),w=f.useRef(null),[v,_]=f.useState("disconnected"),[z,T]=f.useState([]);f.useEffect(()=>{if(!a){w.current=null,_("disconnected"),T([]);return}const J={url:d,tokenProvider:p,...u},Q=new Ad(J);w.current=Q;const X=se=>{_(se)};return Q.onStatusChange(X),i&&!m.current&&Q.connect(),()=>{Q.offStatusChange(X),Q.disconnect(),w.current=null}},[a,d]),f.useEffect(()=>{if(typeof window>"u")return;const J=()=>{m.current=!0,w.current?.disconnect(),T([])};return window.addEventListener(Br,J),()=>{window.removeEventListener(Br,J)}},[]);const H=f.useCallback(()=>{if(m.current){if(!(typeof window<"u"&&!!window.localStorage.getItem(oi)))return;m.current=!1}w.current?.connect()},[]),A=f.useCallback(()=>{w.current?.disconnect()},[]),re=f.useCallback(J=>{w.current?.subscribe(J),T(w.current?.getActiveSubscriptions()||[])},[]),C=f.useCallback(J=>{w.current?.unsubscribe(J),T(w.current?.getActiveSubscriptions()||[])},[]),F=f.useCallback((J,Q)=>{w.current?.on(J,Q)},[]),N=f.useCallback((J,Q)=>{w.current?.off(J,Q)},[]);return{status:v,connect:H,disconnect:A,subscribe:re,unsubscribe:C,on:F,off:N,activeSubscriptions:z,isConnected:v==="connected",isConnecting:v==="connecting",isDisconnected:v==="disconnected"}}class th{client;ws;snapshots=new Map;listeners=new Set;timers=new Map;generations=new Map;started=!1;online=()=>{this.reconcileAll("online")};visible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.reconcileAll("visible")};constructor(i,a){this.client=new Id(i),this.ws=new Ad({url:i.wsBaseUrl,tokenProvider:a,reconnect:!0}),this.ws.on("*",this.handleEvent),this.ws.onStatusChange(this.handleStatus)}start(){this.started||(this.started=!0,this.recoverStorage(),this.ws.connect(),typeof window<"u"&&(window.addEventListener("online",this.online),document.addEventListener("visibilitychange",this.visible)),this.reconcileAll("startup"))}stop(i=!1){this.started=!1,this.ws.disconnect();for(const a of this.timers.values())clearTimeout(a);this.timers.clear(),typeof window<"u"&&(window.removeEventListener("online",this.online),document.removeEventListener("visibilitychange",this.visible)),i&&(this.snapshots.clear(),this.notify())}subscribe=i=>(this.listeners.add(i),()=>this.listeners.delete(i));getSnapshot=()=>this.snapshots;getExecution(i){return i?this.snapshots.get(i):void 0}getBySession(i){return[...this.snapshots.values()].filter(a=>(a.sessionId??a.externalChatId)===i).sort((a,d)=>Date.parse(d.updatedAt)-Date.parse(a.updatedAt))[0]}getByConversation(i){return[...this.snapshots.values()].filter(a=>a.conversationId===i).sort((a,d)=>Date.parse(d.updatedAt)-Date.parse(a.updatedAt))[0]}connect(){this.ws.connect()}subscribeScope(i){this.ws.subscribe(i)}unsubscribeScope(i){this.ws.unsubscribe(i)}on(i,a){this.ws.on(i,a)}off(i,a){this.ws.off(i,a)}register(i){const a=new Cn(i.channelId).setActive(i),d={...a,clientStatus:a.status};return this.snapshots.set(a.executionId,d),this.ws.subscribe({type:"conversation",conversationId:a.conversationId}),this.ws.subscribe({type:"execution",executionId:a.executionId}),this.notify(a),this.schedule(a.executionId,2e3),d}async reconcile(i,a="manual"){const d=this.snapshots.get(i);if(!d)return;const p=(this.generations.get(i)??0)+1;this.generations.set(i,p);try{const u=await this.client.getExecution(i);if(this.generations.get(i)!==p)return this.snapshots.get(i);const m=Gp(u),w=typeof u.error=="string"?u.error:u.error?.message,v={...d,clientStatus:m,status:m,error:w,review:u.review,lastReconciledAt:new Date().toISOString(),updatedAt:u.updatedAt??u.completedAt??new Date().toISOString(),detail:u};return this.snapshots.set(i,v),new Cn(v.channelId).upsert(v),this.notify(v),un(m)?(this.cancelTimer(i),this.ws.unsubscribe({type:"execution",executionId:i})):this.schedule(i),v}catch{if(this.generations.get(i)!==p)return this.snapshots.get(i);const u={...d,clientStatus:"unknown",status:"unknown",updatedAt:new Date().toISOString()};return this.snapshots.set(i,u),new Cn(u.channelId).upsert(u),this.notify(u),this.schedule(i),u}}async reconcileAll(i="manual"){await Promise.all([...this.snapshots.values()].filter(a=>!un(a.clientStatus)&&a.clientStatus!=="idle").map(a=>this.reconcile(a.executionId,i)))}acknowledge(i){const a=this.snapshots.get(i);if(!a||!un(a.clientStatus))return;const d=new Cn(a.channelId).acknowledge(i);d&&(this.snapshots.set(i,{...a,...d,clientStatus:"idle"}),this.notify(d))}removeSession(i){for(const a of[...this.snapshots.values()])(a.sessionId??a.externalChatId)===i&&(this.cancelTimer(a.executionId),this.ws.unsubscribe({type:"execution",executionId:a.executionId}),this.snapshots.delete(a.executionId));this.notify()}recoverStorage(){if(!(typeof localStorage>"u")){for(let i=0;i<localStorage.length;i++){const a=localStorage.key(i),d="cheng_execution_mappings_";if(!a?.startsWith(d))continue;const p=a.slice(d.length),u=new Cn(p);u.cleanup();for(const m of u.listRecoverable()){const w=m.status;this.snapshots.set(m.executionId,{...m,clientStatus:w}),!un(w)&&w!=="idle"&&(this.ws.subscribe({type:"conversation",conversationId:m.conversationId}),this.ws.subscribe({type:"execution",executionId:m.executionId}))}}this.notify()}}handleStatus=i=>{i==="connected"&&this.reconcileAll("websocket-reconnected")};handleEvent=i=>{const a=typeof i.executionId=="string"?i.executionId:void 0;if(!a||!this.snapshots.has(a))return;const d=this.snapshots.get(a);i.type==="EXECUTION_START"||i.type==="EXECUTION_PROGRESS"?this.transition(d,"running"):i.type==="AGENT_PAUSED_FOR_REVIEW"||i.type==="APPROVAL_REQUESTED"?this.transition(d,"waiting_for_review",i):i.type==="EXECUTION_COMPLETE"||i.type==="EXECUTION_FAILED"||i.type==="EXECUTION_CANCELLED"||i.type==="EXECUTION_STATE_CHANGED"?this.reconcile(a,`ws:${i.type}`):i.type==="NODE_STREAM_CHUNK"&&typeof i.sequence=="number"&&i.sequence>(d.lastStreamSequence??-1)&&this.transition(d,d.clientStatus==="pending"?"running":d.clientStatus,void 0,i.sequence)};transition(i,a,d,p){const u={...i,clientStatus:a,status:a,detail:d??i.detail,lastStreamSequence:p??i.lastStreamSequence,updatedAt:new Date().toISOString()};this.snapshots.set(i.executionId,u),new Cn(i.channelId).upsert(u),this.notify(u)}schedule(i,a){if(this.cancelTimer(i),!this.started||typeof navigator<"u"&&!navigator.onLine)return;const d=this.snapshots.get(i);if(!d||un(d.clientStatus)||d.clientStatus==="idle")return;const p=a??Math.min(3e4,2e3*2**Math.min(4,this.generations.get(i)??0)),u=typeof document<"u"&&document.visibilityState==="hidden";this.timers.set(i,setTimeout(()=>{this.reconcile(i,"poll")},u?Math.max(p,3e4):p))}cancelTimer(i){const a=this.timers.get(i);a&&clearTimeout(a),this.timers.delete(i)}notify(i){this.snapshots=new Map(this.snapshots);for(const a of this.listeners)a();Yp(i??{})}}const ha=f.createContext(null);function nh({config:l,children:i}){const a=f.useMemo(()=>{const d=new We(l.apiBaseUrl);return new th(l,()=>d.getAccessTokenSync())},[l.apiBaseUrl,l.wsBaseUrl]);return f.useEffect(()=>(a.start(),()=>a.stop(!0)),[a]),n.jsx(ha.Provider,{value:a,children:i})}function Td(){const l=f.useContext(ha);if(!l)throw new Error("ExecutionCoordinatorProvider is required");return l}function rh(){return f.useContext(ha)}function oh(l){const i=Td(),a=f.useSyncExternalStore(i.subscribe,i.getSnapshot,i.getSnapshot);return f.useMemo(()=>[...a.values()].filter(d=>d.channelId===l),[l,a])}function ih(l,i){switch(i.type){case"ADD_MESSAGE":return[...l,i.message];case"UPDATE_MESSAGE":return l.map(a=>a.id===i.id?{...a,...i.updates}:a);case"REMOVE_MESSAGE":return l.filter(a=>a.id!==i.id);case"REMOVE_ASSISTANT_BY_EXEC_ID":return l.filter(a=>!(a.role==="assistant"&&a.executionId===i.executionId));case"UPDATE_AGENT_REVIEW_BY_EXEC_ID":return l.map(a=>a.executionId===i.executionId&&a.agentReview?{...a,agentReview:{...a.agentReview,...i.updates}}:a);case"REMOVE_EMPTY_ASSISTANTS":return l.filter(a=>!(a.role==="assistant"&&!a.content));case"CLEAR_MESSAGES":return[];case"SET_MESSAGES":return i.messages;default:return l}}function xd(l){return l?l.includes("No response output found in execution")?"工作流未返回任何输出（请检查工作流是否配置了节点）":l.includes("No nodes")||l.includes("0 nodes")?"工作流没有节点，请先添加节点":l.includes("timeout")||l.includes("Timeout")?"工作流执行超时":l.includes("not found")||l.includes("Not found")?"工作流或资源未找到":l:"工作流执行失败"}function sh(l){const i=l.replace(/\s+/g," ").trim();if(!i)return"新会话";const a=i.split(/\r?\n/)[0]?.trim()??i,d=a.split(/[。！？!?]/)[0]?.trim()||a,p=18;return d.length<=p?d:`${d.slice(0,p)}...`}function ah(l){if(!l)return!0;const i=l.trim();return/^(session|会话|新会话)(\s*\d+)?$/i.test(i)}const _d=new Map,lh=()=>()=>{};function ch(l){const i=rh(),a=f.useSyncExternalStore(i?.subscribe??lh,i?.getSnapshot??(()=>_d),i?.getSnapshot??(()=>_d)),d=f.useRef(null),p=f.useRef(null),u=f.useRef(null),[m,w]=f.useReducer(ih,[]),[v,_]=f.useState(!1),[z,T]=f.useState(null),[H,A]=f.useState(null),[re,C]=f.useState(!1),F=f.useRef(""),N=f.useRef(null),G=f.useRef(null),Y=f.useRef(null),U=f.useRef(null),J=f.useRef(new Set),Q=f.useRef(new Map),X=f.useRef(Date.now()),se=f.useRef(new We(l.apiBaseUrl)),ne=eh({url:l.wsBaseUrl,enabled:!i,tokenProvider:()=>se.current.getAccessTokenSync(),autoConnect:!0,debug:!1}),oe=f.useCallback(b=>i?i.subscribeScope(b):ne.subscribe(b),[i,ne.subscribe]),ee=f.useCallback(b=>i?i.unsubscribeScope(b):ne.unsubscribe(b),[i,ne.unsubscribe]),le=f.useCallback((b,y)=>i?i.on(b,y):ne.on(b,y),[i,ne.on]),q=f.useCallback((b,y)=>i?i.off(b,y):ne.off(b,y),[i,ne.off]),_e=f.useCallback(()=>i?i.connect():ne.connect(),[i,ne.connect]),K=f.useCallback(b=>{b&&w({type:"UPDATE_AGENT_REVIEW_BY_EXEC_ID",executionId:b,updates:{status:"pending"}})},[]);f.useEffect(()=>{d.current=new Id(l),p.current=new Ed(l.channelId),u.current=new Cn(l.channelId),l.sessionId&&p.current.setActiveSessionId(l.sessionId),w({type:"CLEAR_MESSAGES"}),_(!1),T(null),A(null),F.current="",N.current=null,G.current=null,Y.current=null,U.current=null;const b=p.current.getConversationId();if(b){Y.current=b,oe({type:"conversation",conversationId:b});const y=u.current.getActiveForConversation(b);if(y){U.current=y.executionId,oe({type:"execution",executionId:y.executionId});const R=y.status;if(["pending","running","unknown"].includes(R)){const E=`recovered-${y.executionId}`;N.current=E,G.current=y.executionId,_(!0)}}(async()=>{try{const E=[...await d.current.getConversationMessages(b)].sort((P,S)=>new Date(P.createdAt).getTime()-new Date(S.createdAt).getTime());w({type:"SET_MESSAGES",messages:[...E.map(P=>({id:P.id,role:P.role??"assistant",content:P.content,status:"completed",createdAt:new Date(P.createdAt),executionId:P.executionId})),...y&&["pending","running","unknown"].includes(y.status)?[{id:`recovered-${y.executionId}`,role:"assistant",content:y.status==="unknown"?"正在重新连接并确认执行状态…":"",status:"streaming",executionId:y.executionId,createdAt:new Date}]:[]]})}catch{}})()}},[l.apiBaseUrl,l.channelId,l.sessionId,i,oe]);const ce=f.useCallback(async b=>{const y=d.current;if(!(!y||J.current.has(b.executionId))){J.current.add(b.executionId);try{const P=[...await y.getConversationMessages(b.conversationId)].sort((V,de)=>Date.parse(V.createdAt)-Date.parse(de.createdAt)).map(V=>({id:V.id,role:V.role==="user"?"user":"assistant",content:V.content,status:"completed",executionId:V.executionId,createdAt:new Date(V.createdAt)}));let S=!1;if(b.clientStatus==="completed_unread")S=P.some(V=>V.role==="assistant"&&V.executionId===b.executionId);else if(b.clientStatus==="failed_unread"||b.clientStatus==="cancelled"){const V=b.clientStatus==="cancelled"?"执行已取消":xd(b.error||"工作流执行失败");P.push({id:`terminal-${b.executionId}`,role:"assistant",content:V,status:"error",executionId:b.executionId,createdAt:new Date(b.updatedAt)}),b.clientStatus==="failed_unread"&&T(new Error(V)),S=!0}if(w({type:"SET_MESSAGES",messages:P}),N.current=null,G.current=null,F.current="",A(null),_(!1),S)Q.current.delete(b.executionId),i?.acknowledge(b.executionId),u.current?.acknowledge(b.executionId);else{J.current.delete(b.executionId);const V=(Q.current.get(b.executionId)??0)+1;Q.current.set(b.executionId,V),V<10&&setTimeout(()=>{i?.reconcile(b.executionId,"terminal-result-pending")},Math.min(5e3,V*500))}}catch{J.current.delete(b.executionId)}}},[i]);f.useEffect(()=>{if(!i||!l.sessionId)return;const b=[...a.values()].filter(y=>(y.sessionId??y.externalChatId)===l.sessionId).sort((y,R)=>Date.parse(R.updatedAt)-Date.parse(y.updatedAt))[0];b&&(Y.current=b.conversationId,U.current=b.executionId,un(b.clientStatus)?ce(b):["pending","running","unknown"].includes(b.clientStatus)&&_(!0))},[l.sessionId,i,a,ce]),f.useEffect(()=>{const b=l.boundWorkflowId?.trim();if(!b||!d.current){C(!1);return}let y=!1;return d.current.workflowSupportsAttachments(b).then(R=>{y||C(R)}).catch(()=>{y||C(!1)}),()=>{y=!0}},[l.boundWorkflowId,l.apiBaseUrl]),f.useEffect(()=>{const b=D=>D?U.current===D:!1,y=D=>{X.current=Date.now(),D.role==="assistant"&&(K(U.current),N.current?(w({type:"UPDATE_MESSAGE",id:N.current,updates:{content:D.content,status:"completed"}}),N.current=null,G.current=null):w({type:"ADD_MESSAGE",message:{id:`msg-assistant-${Date.now()}`,role:"assistant",content:D.content,status:"completed",executionId:U.current??void 0,createdAt:new Date}}),U.current&&(u.current?.updateStatus(U.current,"completed"),u.current?.clearExecution(U.current)),F.current="",A(null),_(!1))},R=D=>{K(D.executionId||U.current),_(!1),N.current&&(w({type:"REMOVE_MESSAGE",id:N.current}),N.current=null,G.current=null),w({type:"REMOVE_EMPTY_ASSISTANTS"}),U.current&&u.current?.clearExecution(U.current),U.current&&(ee({type:"execution",executionId:U.current}),U.current=null)},E=D=>{X.current=Date.now();const{executionId:je}=D;if(je&&(U.current&&U.current!==je&&ee({type:"execution",executionId:U.current}),U.current=je,oe({type:"execution",executionId:je}),Y.current&&u.current?.setActive({channelId:l.channelId,boundWorkflowId:D.workflowId,conversationId:Y.current,executionId:je,externalChatId:p.current?.getOrCreateSessionId()??"",externalUserId:l.externalUserId,status:"running"}),!N.current||G.current!==je)){const Ce=`msg-assistant-${Date.now()}`;N.current=Ce,G.current=je,w({type:"ADD_MESSAGE",message:{id:Ce,role:"assistant",content:"",status:"streaming",executionId:je,createdAt:new Date}})}},P=D=>{b(D.executionId)&&(A(""),F.current="")},S=D=>{b(D.executionId)&&(X.current=Date.now(),F.current+=D.content,A(F.current),N.current&&w({type:"UPDATE_MESSAGE",id:N.current,updates:{content:F.current,status:"streaming"}}))},V=D=>{b(D.executionId)&&(D.fullContent&&F.current!==D.fullContent&&(console.warn("[useChannel] Stream content mismatch:",F.current.length,"vs",D.fullContent.length),F.current=D.fullContent,A(D.fullContent),N.current&&w({type:"UPDATE_MESSAGE",id:N.current,updates:{content:D.fullContent}})),D.usage&&console.log("[useChannel] Token usage:",D.usage))},de=D=>{b(D.executionId)&&(_(!1),T(new Error(D.error)),N.current&&w({type:"UPDATE_MESSAGE",id:N.current,updates:{status:"error",content:D.partialContent||"流式输出失败"}}))},ge=D=>{b(D.executionId)&&(X.current=Date.now(),_(!1),A(null),F.current="",N.current&&(w({type:"REMOVE_MESSAGE",id:N.current}),N.current=null,G.current=null),u.current?.updateStatus(D.executionId,"paused"),w({type:"ADD_MESSAGE",message:{id:`agent-review-${D.executionId}-${D.iteration}`,role:"assistant",content:D.reason||"Agent paused for review",status:"agent_review",executionId:D.executionId,agentReview:{nodeId:D.nodeId,iteration:D.iteration,reason:D.reason||"Agent paused for review",interimReport:D.interimReport||"",suggestedNextAction:D.suggestedNextAction,status:"waiting"},createdAt:new Date}}))},he=async D=>{if(!b(D.executionId)||(K(D.executionId),!N.current))return;const je=d.current,Ce=p.current?.getConversationId();if(!(!je||!Ce))try{const st=(await je.getConversationMessages(Ce)).find(at=>at.role==="assistant"&&at.executionId===D.executionId);st&&N.current&&(w({type:"UPDATE_MESSAGE",id:N.current,updates:{content:st.content,status:"completed"}}),N.current=null,G.current=null,F.current="",A(null),_(!1))}catch{}},Te=D=>{const je=D.error||D.error||"",Ce=xd(je);T(new Error(Ce));const Ee=D.executionId||D.execution_id;Ee&&!b(Ee)||(_(!1),N.current?(w({type:"REMOVE_MESSAGE",id:N.current}),N.current=null,G.current=null):w(Ee?{type:"REMOVE_ASSISTANT_BY_EXEC_ID",executionId:Ee}:{type:"REMOVE_EMPTY_ASSISTANTS"}),Ee&&u.current?.updateStatus(Ee,"failed"))},He=D=>{b(D.executionId)&&(X.current=Date.now(),_(!1),w({type:"ADD_MESSAGE",message:{id:`approval-${D.requestId}`,role:"assistant",content:`需要确认操作：${D.actionName}`,status:"approval",executionId:D.executionId,approval:{requestId:D.requestId,actionName:D.actionName,riskLevel:D.riskLevel,paramSummary:D.paramSummary,status:"pending"},createdAt:new Date}}))},ye=D=>{console.error("[useChannel] WebSocket error:",D.code,D.message),T(new Error(`${D.code}: ${D.message}`)),D.executionId&&N.current&&w({type:"UPDATE_MESSAGE",id:N.current,updates:{status:"error"}}),D.executionId&&u.current?.updateStatus(D.executionId,"failed")};return le("MESSAGE_CREATED",y),le("MESSAGE_COMPLETED",R),le("WORKFLOW_TRIGGERED",E),le("NODE_STREAM_START",P),le("NODE_STREAM_CHUNK",S),le("NODE_STREAM_COMPLETE",V),le("NODE_STREAM_FAILED",de),le("AGENT_PAUSED_FOR_REVIEW",ge),le("EXECUTION_FAILED",Te),le("EXECUTION_COMPLETE",he),le("APPROVAL_REQUESTED",He),le("ERROR",ye),()=>{q("MESSAGE_CREATED",y),q("MESSAGE_COMPLETED",R),q("WORKFLOW_TRIGGERED",E),q("NODE_STREAM_START",P),q("NODE_STREAM_CHUNK",S),q("NODE_STREAM_COMPLETE",V),q("NODE_STREAM_FAILED",de),q("AGENT_PAUSED_FOR_REVIEW",ge),q("EXECUTION_FAILED",Te),q("EXECUTION_COMPLETE",he),q("APPROVAL_REQUESTED",He),q("ERROR",ye)}},[le,q,oe,ee,K,l.channelId,l.externalUserId]),f.useEffect(()=>{const y=setInterval(()=>{!i&&Date.now()-X.current>3e5&&ne.disconnect()},3e4);return()=>clearInterval(y)},[i,ne.disconnect]);const O=f.useCallback(async(b,y)=>{if(!d.current||!p.current)throw new Error("Channel client not initialized");if(!b.trim()&&(!y||y.length===0))return;X.current=Date.now(),_e(),T(null),_(!0),U.current&&(ee({type:"execution",executionId:U.current}),U.current=null);const R=l.sessionId||p.current.getOrCreateSessionId(),E=p.current.listSessions().find(S=>S.id===R);b.trim()&&ah(E?.label)&&(p.current.renameSession(R,sh(b)),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cheng:session-label-updated",{detail:{channelId:l.channelId,sessionId:R}})));const P=`msg-user-${Date.now()}`;w({type:"ADD_MESSAGE",message:{id:P,role:"user",content:b,status:"sending",createdAt:new Date}});try{Y.current&&oe({type:"conversation",conversationId:Y.current});const S=l.boundWorkflowId.trim();if(!S)throw new Error("Bound Workflow ID is required");const V=await d.current.execute(l.channelId,S,b,R,l.externalUserId,y);w({type:"UPDATE_MESSAGE",id:P,updates:{status:"sent"}});const{conversation_id:de,execution_id:ge}=V;if(Y.current=de,p.current.setConversationId(de),oe({type:"conversation",conversationId:de}),ge){U.current=ge,oe({type:"execution",executionId:ge}),u.current?.setActive({channelId:l.channelId,boundWorkflowId:S,conversationId:de,executionId:ge,externalChatId:R,externalUserId:l.externalUserId,status:"running"}),i?.register({channelId:l.channelId,boundWorkflowId:S,conversationId:de,executionId:ge,externalChatId:R,sessionId:R,externalUserId:l.externalUserId,status:"running"});let he=N.current;(!he||G.current!==ge)&&(he=`msg-assistant-${Date.now()}`,N.current=he,G.current=ge,w({type:"ADD_MESSAGE",message:{id:he,role:"assistant",content:"",status:"streaming",executionId:ge,createdAt:new Date}}));const Te=async(He,ye,D,je)=>{if(N.current!==D)return;const Ce=d.current;if(Ce)try{const st=(await Ce.getConversationMessages(He)).find(at=>at.role==="assistant"&&at.executionId===ye);if(N.current!==D)return;if(st){w({type:"UPDATE_MESSAGE",id:D,updates:{content:st.content,status:"completed"}}),u.current?.updateStatus(ye,"completed"),u.current?.clearExecution(ye),N.current=null,G.current=null,F.current="",A(null),_(!1);return}}catch{if(!je||N.current!==D)return;w({type:"REMOVE_MESSAGE",id:D}),N.current=null,G.current=null,u.current?.updateStatus(ye,"failed"),_(!1)}};setTimeout(()=>{Te(de,ge,he,!1)},250)}else _(!1),console.warn("[useChannel] No execution_id returned, workflow not triggered")}catch(S){throw _(!1),T(S instanceof Error?S:new Error(String(S))),w({type:"UPDATE_MESSAGE",id:P,updates:{status:"error"}}),S}},[l.channelId,l.sessionId,l.boundWorkflowId,l.externalUserId,oe,ee,_e]),$=f.useCallback(()=>{w({type:"CLEAR_MESSAGES"}),Y.current=null,U.current=null,_(!1),T(null),A(null),F.current="",N.current=null,G.current=null,u.current?.clear(),p.current?.resetSession()},[]),W=f.useCallback(async(b,y,R)=>{const E=m.find(P=>P.id===b);if(!(!E?.executionId||!E.approval||!d.current)){w({type:"UPDATE_MESSAGE",id:b,updates:{approval:{...E.approval,status:"submitting"}}});try{await d.current.submitApproval(E.executionId,E.approval.requestId,y,R),w({type:"UPDATE_MESSAGE",id:b,updates:{approval:{...E.approval,status:y,reason:R}}})}catch(P){const S=P instanceof Error?P:new Error(String(P));T(S),w({type:"UPDATE_MESSAGE",id:b,updates:{approval:{...E.approval,status:"error"}}})}}},[m]),B=f.useCallback(async(b,y)=>{const R=m.find(E=>E.id===b);!R?.agentReview||R.agentReview.status!=="pending"||(w({type:"UPDATE_MESSAGE",id:b,updates:{agentReview:{...R.agentReview,status:"continuing"}}}),await O(y?.trim()||R.agentReview.suggestedNextAction?.trim()||"Continue."))},[m,O]),g=ne.isConnected?"connected":ne.isConnecting?"connecting":ne.status==="error"?"error":"disconnected";return{messages:m,sendMessage:O,isLoading:v,connectionStatus:g,streamingContent:H,resetConversation:$,submitApproval:W,continueAgentReview:B,error:z,supportsAttachments:re}}const bd="cheng_active_channel";function wd(l,i,a,d){const p=a.trim().toLowerCase();if(l.find(m=>d&&m.id===d?!1:m.workspaceId===i&&m.channelId.trim().toLowerCase()===p))throw new Error(`Agent ID "${a.trim()}" already exists in this workspace`)}function dh(l){const[i,a]=f.useState([]),[d,p]=f.useState(null),[u,m]=f.useState(!1),[w,v]=f.useState(null),_=f.useRef(null),z=f.useRef(null),T=f.useRef(l);T.current=l;const H=f.useRef([]);H.current=i,!z.current&&l&&(z.current=new We(l.apiBaseUrl));const A=f.useCallback(async()=>{const U=T.current;if(!U)return;const J=z.current;if(!J)return;if(!await J.getAccessToken()){const se={id:U.channelId,workspaceId:U.workspaceId??"",channelId:U.channelId,name:"Default",boundWorkflowId:U.boundWorkflowId,createdAt:new Date().toISOString()};a([se]),p(ne=>ne??se);return}_.current||(_.current=new qe(U.apiBaseUrl,J));const X=_.current;m(!0),v(null);try{const se=await X.listChannels();a(se);const ne=typeof window<"u"?window.localStorage.getItem(bd):null;p(oe=>oe?se.find(q=>q.channelId===oe.channelId)??se[0]??null:(ne?se.find(le=>le.channelId===ne):null)??se[0]??null)}catch(se){v(se instanceof Error?se:new Error(String(se)))}finally{m(!1)}},[]),re=f.useRef(!1);f.useEffect(()=>{re.current||(re.current=!0,A())},[A]);const C=f.useCallback(U=>{p(U),typeof window<"u"&&window.localStorage.setItem(bd,U.channelId)},[]),F=f.useCallback(async()=>{if(_.current)return _.current;const U=T.current;if(!U)throw new Error("Workspace not selected.");const J=z.current;if(!await J.getAccessToken())throw new Error("Authentication required. Please log in.");return _.current=new qe(U.apiBaseUrl,J),_.current},[]),N=f.useCallback(async U=>{wd(H.current,U.workspaceId,U.channelId);const Q=await(await F()).createChannel(U);return await A(),C(Q),Q},[F,A,C]),G=f.useCallback(async U=>{wd(H.current,U.workspaceId,U.channelId,U.id);const Q=await(await F()).updateChannel(U);return await A(),p(X=>X&&(X.id===U.id||X.channelId===U.channelId?Q:X)),Q},[F,A]),Y=f.useCallback(async U=>{const J=await F(),Q=H.current.find(X=>X.id===U);await J.deleteChannel(U,Q?.workspaceId),p(X=>X?.id===U?null:X),await A()},[F,A]);return{channels:i,activeChannel:d,setActiveChannel:C,createChannel:N,updateChannel:G,deleteChannel:Y,isLoading:u,error:w,refresh:A}}function uh(l){const a=f.useRef(new pa(l)).current,[d,p]=f.useState(()=>a.isAuthenticated()),[u,m]=f.useState(!1),[w,v]=f.useState(null),[_,z]=f.useState(null),T=f.useCallback(async re=>{m(!0),v(null);try{const C=await a.login(re);z(C.user),p(!0)}catch(C){v(C instanceof Error?C.message:String(C))}finally{m(!1)}},[a]),H=f.useCallback(()=>{a.logout(),p(!1),z(null)},[a]),A=f.useCallback(()=>{p(a.isAuthenticated())},[a]);return f.useEffect(()=>{if(typeof window>"u")return;const re=()=>{p(!1),z(null),v("登录已过期，请重新登录。")};return window.addEventListener(Br,re),()=>{window.removeEventListener(Br,re)}},[]),{isAuthenticated:d,isLoading:u,error:w,user:_,login:T,logout:H,refresh:A}}const zd=f.createContext(null);function ph({config:l,children:i}){const a=ch(l);return n.jsx(zd.Provider,{value:a,children:i})}function si(){const l=f.useContext(zd);if(!l)throw new Error("useChatContext must be used within a ChatProvider");return l}function hh({className:l="",showText:i=!0}){const{connectionStatus:a}=si(),d=fh(a);return n.jsxs("div",{className:`cheng-status-indicator ${l}`,"data-status":a,children:[n.jsxs("div",{className:`cheng-status-indicator__container ${d.containerClass}`,children:[n.jsx("div",{className:`cheng-status-indicator__dot ${d.dotClass}`}),i&&n.jsx("span",{className:"cheng-status-indicator__text",children:d.text})]}),n.jsx("style",{children:gh})]})}function fh(l){switch(l){case"connected":return{text:"已连接",dotClass:"cheng-status-indicator__dot--connected",containerClass:""};case"connecting":return{text:"连接中...",dotClass:"cheng-status-indicator__dot--connecting",containerClass:"cheng-status-indicator__container--pulse"};case"disconnected":return{text:"已断开",dotClass:"cheng-status-indicator__dot--disconnected",containerClass:""};case"error":return{text:"连接错误",dotClass:"cheng-status-indicator__dot--error",containerClass:""};default:return{text:"未知状态",dotClass:"",containerClass:""}}}const gh=`
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
`;function mh({content:l,className:i="",showCursor:a=!0}){const d=f.useRef(null);return f.useEffect(()=>{d.current&&(d.current.scrollTop=d.current.scrollHeight)},[l]),n.jsxs("div",{className:`cheng-streaming-text ${i}`,ref:d,children:[n.jsxs("div",{className:"cheng-streaming-text__content",children:[l,a&&n.jsx("span",{className:"cheng-streaming-text__cursor",children:"▊"})]}),n.jsx("style",{children:xh})]})}const xh=`
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
`;function _h({message:l,className:i="",onRetry:a,onApprovalDecision:d,onAgentReviewContinue:p}){const u=l.role==="user",m=l.status==="streaming",w=l.status==="error",v=l.status==="sending",_=!!l.approval,z=!!l.agentReview;return n.jsxs("div",{className:`cheng-message-bubble ${i}`,"data-role":l.role,"data-status":l.status,children:[n.jsxs("div",{className:`cheng-message-bubble__container ${u?"cheng-message-bubble__container--user":"cheng-message-bubble__container--assistant"}`,children:[n.jsxs("div",{className:`cheng-message-bubble__bubble ${u?"cheng-message-bubble__bubble--user":"cheng-message-bubble__bubble--assistant"} ${w?"cheng-message-bubble__bubble--error":""}`,children:[!_&&!z&&(m?n.jsx(yd,{content:l.content,role:l.role,isStreaming:!0}):n.jsx(yd,{content:l.content,role:l.role})),v&&n.jsx("div",{className:"cheng-message-bubble__sending",children:n.jsx("div",{className:"cheng-message-bubble__spinner"})}),w&&a&&n.jsx("button",{className:"cheng-message-bubble__retry",onClick:()=>a(l.id),type:"button",children:"重试"}),_&&l.approval&&n.jsx(bh,{approval:l.approval,messageId:l.id,onDecision:d}),z&&l.agentReview&&n.jsx(wh,{review:l.agentReview,messageId:l.id,onContinue:p})]}),n.jsx("div",{className:"cheng-message-bubble__timestamp",children:vh(l.createdAt)})]}),n.jsx("style",{children:kh})]})}function yd({content:l,role:i,isStreaming:a=!1}){if(i!=="assistant")return n.jsx("div",{className:"cheng-message-bubble__content",children:l});const{thinkBlocks:d,visibleContent:p,hasThinkTag:u,isThinkOpen:m}=yh(l),w=p.trim().length>0;return n.jsxs("div",{className:"cheng-message-bubble__content-wrap",children:[u&&n.jsxs("details",{className:"cheng-message-bubble__think",children:[n.jsx("summary",{className:"cheng-message-bubble__think-summary",children:m?"查看思考中...":"查看思考过程"}),n.jsx("div",{className:"cheng-message-bubble__think-body",children:d.map((v,_)=>n.jsx("div",{className:"cheng-message-bubble__think-block",children:v||"思考中..."},_))})]}),w?a?n.jsx(mh,{content:p}):n.jsx("div",{className:"cheng-message-bubble__content",children:p}):a&&u&&n.jsx("div",{className:"cheng-message-bubble__thinking-label",children:"正在思考..."})]})}function bh({approval:l,messageId:i,onDecision:a}){const[d,p]=f.useState(!1),[u,m]=f.useState(""),w=l.status==="submitting",v=l.status==="approved"||l.status==="rejected",z={critical:"#b53333",high:"#b53333",medium:"#c96442",low:"#5e5d59"}[l.riskLevel.toLowerCase()]??"#5e5d59",T=l.actionName==="preset_switch"?"切换节点预设":l.actionName;let H=[];if(l.paramSummary)try{const A=typeof l.paramSummary=="string"?JSON.parse(l.paramSummary):l.paramSummary;H=Object.entries(A).map(([re,C])=>`${re}: ${typeof C=="object"&&C!==null?JSON.stringify(C):C}`)}catch{H=[String(l.paramSummary)]}return n.jsxs("div",{className:"cheng-approval-card",children:[n.jsxs("div",{className:"cheng-approval-card__header",children:[n.jsxs("span",{className:"cheng-approval-card__risk",style:{color:z},children:["[",l.riskLevel.toUpperCase(),"]"]}),n.jsx("span",{className:"cheng-approval-card__action",children:T})]}),H.length>0&&n.jsx("div",{className:"cheng-approval-card__params",children:H.map((A,re)=>n.jsx("div",{className:"cheng-approval-card__param-line",children:A},re))}),v?n.jsxs("div",{className:"cheng-approval-card__settled",children:[n.jsx("span",{children:l.status==="approved"?"✓ 已批准":"✗ 已拒绝"}),l.reason&&n.jsxs("div",{className:"cheng-approval-card__settled-reason",children:["建议：",l.reason]})]}):n.jsxs(n.Fragment,{children:[d&&n.jsx("textarea",{className:"cheng-approval-card__suggestion",value:u,onChange:A=>m(A.target.value),placeholder:"请输入修改建议…",rows:2}),n.jsxs("div",{className:"cheng-approval-card__actions",children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--approve",disabled:w,onClick:()=>a?.(i,"approved"),type:"button",children:w?"提交中…":"批准"}),d?n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:w,onClick:()=>a?.(i,"rejected",u),type:"button",children:"确认拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--cancel",disabled:w,onClick:()=>{p(!1),m("")},type:"button",children:"取消"})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:w,onClick:()=>a?.(i,"rejected"),type:"button",children:"拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--suggest",disabled:w,onClick:()=>p(!0),type:"button",children:"拒绝并提建议"})]})]})]})]})}function wh({review:l,messageId:i,onContinue:a}){const[d,p]=f.useState(l.suggestedNextAction||"Continue."),u=l.status==="waiting",m=l.status==="continuing",w=u||m;return n.jsxs("div",{className:"cheng-agent-review-card",children:[n.jsxs("div",{className:"cheng-agent-review-card__header",children:[n.jsx("span",{className:"cheng-agent-review-card__badge",children:"REVIEW"}),n.jsx("span",{className:"cheng-agent-review-card__title",children:"Agent paused"}),n.jsxs("span",{className:"cheng-agent-review-card__meta",children:["Iteration ",l.iteration]})]}),n.jsx("div",{className:"cheng-agent-review-card__reason",children:l.reason}),l.interimReport&&n.jsx("pre",{className:"cheng-agent-review-card__report",children:l.interimReport}),n.jsx("div",{className:"cheng-agent-review-card__suggestion",children:n.jsxs("label",{className:"cheng-agent-review-card__suggestion-label",children:["Next action",n.jsx("textarea",{className:"cheng-agent-review-card__suggestion-input",value:d,onChange:v=>p(v.target.value),rows:2,disabled:w})]})}),u&&n.jsx("div",{className:"cheng-agent-review-card__waiting",children:"Saving the paused state before resume..."}),n.jsx("button",{className:"cheng-agent-review-card__btn",disabled:w,onClick:()=>a?.(i,d.trim()||"Continue."),type:"button",children:u?"Saving...":m?"Continuing...":"Continue"})]})}function yh(l){const i=[],a=[],d="<think>",p="</think>";let u=0,m=!1;for(;u<l.length;){const w=l.indexOf(d,u);if(w===-1){a.push(l.slice(u));break}a.push(l.slice(u,w));const v=w+d.length,_=l.indexOf(p,v);if(_===-1){i.push(l.slice(v).trim()),m=!0;break}i.push(l.slice(v,_).trim()),u=_+p.length}return{thinkBlocks:i,visibleContent:a.join("").trim(),hasThinkTag:i.length>0||l.includes(d),isThinkOpen:m}}function vh(l){const i=new Date,a=i.getTime()-l.getTime();return a<60*1e3?"刚刚":a<3600*1e3?`${Math.floor(a/6e4)} 分钟前`:l.toDateString()===i.toDateString()?l.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"}):l.toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}const kh=`
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
`;function jh({className:l="",onRetry:i}){const{messages:a,submitApproval:d,continueAgentReview:p}=si(),u=f.useRef(null),[m,w]=f.useState(!1),[v,_]=f.useState(!0),z=()=>{if(!u.current)return;const{scrollTop:H,scrollHeight:A,clientHeight:re}=u.current,C=A-H-re<100;w(!C),_(C)},T=(H=!1)=>{if(!u.current)return;const A=u.current.scrollHeight;typeof u.current.scrollTo=="function"?u.current.scrollTo({top:A,behavior:H?"smooth":"auto"}):u.current.scrollTop=A};return f.useEffect(()=>{v&&T()},[a,v]),f.useEffect(()=>{T()},[]),n.jsxs("div",{className:`cheng-message-list ${l}`,children:[n.jsx("div",{className:"cheng-message-list__container",ref:u,onScroll:z,children:a.length===0?n.jsxs("div",{className:"cheng-message-list__empty",children:[n.jsx("div",{className:"cheng-message-list__empty-icon",children:"💬"}),n.jsx("p",{className:"cheng-message-list__empty-text",children:"开始对话吧"})]}):n.jsx("div",{className:"cheng-message-list__messages",children:a.map(H=>n.jsx(_h,{message:H,onRetry:i,onApprovalDecision:d,onAgentReviewContinue:p},H.id))})}),m&&n.jsxs("button",{className:"cheng-message-list__scroll-button",onClick:()=>{T(!0),_(!0)},type:"button","aria-label":"滚动到底部",children:[n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M5 7.5L10 12.5L15 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),n.jsx("span",{className:"cheng-message-list__scroll-button-text",children:"新消息"})]}),n.jsx("style",{children:Sh})]})}const Sh=`
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
`;function Ch(l){return new Promise((i,a)=>{const d=new FileReader;d.onload=()=>{const p=d.result,u=p.indexOf(",");i(u>=0?p.slice(u+1):p)},d.onerror=a,d.readAsDataURL(l)})}async function Nh(l){return Promise.all(l.map(async i=>{const a=await Ch(i);return{filename:i.name,mime_type:i.type||void 0,base64_content:a,size:i.size}}))}function Ih(l){return l<1024?`${l} B`:l<1024*1024?`${(l/1024).toFixed(1)} KB`:`${(l/1024/1024).toFixed(1)} MB`}const Eh=["image/jpeg","image/png","image/gif","image/webp","image/bmp","image/svg+xml","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","text/plain","text/csv","text/markdown","audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/flac","video/mp4","video/quicktime","video/x-msvideo","video/x-matroska","video/webm"].join(",");function Ah({className:l="",placeholder:i="输入消息...",disabled:a=!1,maxLength:d=2e3,autoFocus:p=!0,channels:u=[],activeChannelId:m=null,activeChannel:w=null,onSelectChannel:v}){const{sendMessage:_,resetConversation:z,isLoading:T,supportsAttachments:H}=si(),[A,re]=f.useState(""),[C,F]=f.useState([]),[N,G]=f.useState(!1),Y=f.useRef(null),U=f.useRef(null),J=f.useRef(null),Q=a||T,X=!Q&&(A.trim().length>0||C.length>0),se=K=>{const ce=K.trim().toLowerCase();return ce?u.find(O=>O.channelId.toLowerCase()===ce)??u.find(O=>O.id.toLowerCase()===ce)??u.find(O=>O.name.toLowerCase()===ce)??null:null};f.useEffect(()=>{if(!N)return;const K=ce=>{U.current&&(U.current.contains(ce.target)||G(!1))};return window.addEventListener("mousedown",K),()=>{window.removeEventListener("mousedown",K)}},[N]);const ne=async K=>{K.preventDefault();const ce=A.trim();if(!(!ce&&C.length===0)&&!Q)try{if(C.length===0&&ce.startsWith("~")){const $=ce.slice(1).trim();if($.toLowerCase()==="new"){z(),re("");return}const W=se($);if(W&&v){v(W),z(),re("");return}}let O;C.length>0&&(O=await Nh(C)),await _(ce||" ",O),re(""),F([]),Y.current&&(Y.current.style.height="auto")}catch(O){console.error("[InputBar] Failed to send message:",O)}},oe=K=>{K.key==="Enter"&&!K.shiftKey&&(K.preventDefault(),ne(K))},ee=K=>{const ce=K.target.value;re(ce),Y.current&&(Y.current.style.height="auto",Y.current.style.height=`${Math.min(Y.current.scrollHeight,120)}px`)},le=()=>{!H||Q||J.current?.click()},q=K=>{const ce=Array.from(K.target.files??[]);ce.length!==0&&(F(O=>[...O,...ce]),K.target.value="")},_e=K=>{F(ce=>ce.filter((O,$)=>$!==K))};return n.jsxs("div",{className:`cheng-input-bar ${l}`,children:[n.jsx("form",{className:"cheng-input-bar__form",onSubmit:ne,children:n.jsxs("div",{className:"cheng-input-bar__composer",children:[C.length>0&&n.jsx("div",{className:"cheng-input-bar__attachments",children:C.map((K,ce)=>n.jsxs("div",{className:"cheng-input-bar__attachment-chip",children:[n.jsx("span",{className:"cheng-input-bar__attachment-icon",children:Th(K.type)}),n.jsx("span",{className:"cheng-input-bar__attachment-name",title:K.name,children:K.name}),n.jsx("span",{className:"cheng-input-bar__attachment-size",children:Ih(K.size)}),n.jsx("button",{type:"button",className:"cheng-input-bar__attachment-remove",onClick:()=>_e(ce),"aria-label":`移除 ${K.name}`,children:n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M2 2L10 10M10 2L2 10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]},ce))}),n.jsx("textarea",{ref:Y,className:"cheng-input-bar__textarea",placeholder:i,value:A,onChange:ee,onKeyDown:oe,disabled:Q,maxLength:d,autoFocus:p,rows:1}),n.jsxs("div",{className:"cheng-input-bar__toolbar",children:[n.jsxs("div",{className:"cheng-input-bar__toolbar-left",children:[n.jsxs("div",{className:"cheng-input-bar__attachment-wrap",children:[n.jsx("button",{className:`cheng-input-bar__icon-button${H?"":" cheng-input-bar__icon-button--disabled"}`,type:"button","aria-label":"添加附件",title:H?"添加附件（PDF / 图片 / Word / Excel / 音视频等）":"当前工作流未配置附件上传节点",onClick:le,disabled:!H||Q,children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M15.5 8.5L8.5 15.5C6.843 17.157 4.157 17.157 2.5 15.5C0.843 13.843 0.843 11.157 2.5 9.5L9.5 2.5C10.657 1.343 12.343 1.343 13.5 2.5C14.657 3.657 14.657 5.343 13.5 6.5L6.5 13.5C5.948 14.052 5.052 14.052 4.5 13.5C3.948 12.948 3.948 12.052 4.5 11.5L11 5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})}),n.jsx("input",{ref:J,type:"file",multiple:!0,accept:Eh,className:"cheng-input-bar__file-input",onChange:q,tabIndex:-1,"aria-hidden":"true"})]}),u.length>0&&n.jsxs("div",{className:"cheng-input-bar__select-wrap",ref:U,children:[n.jsx("button",{className:"cheng-input-bar__select-button",type:"button","aria-haspopup":"listbox","aria-expanded":N,onClick:()=>G(K=>!K),children:n.jsx("span",{className:"cheng-input-bar__select-button-text",children:w?.name||u[0]?.name||"Select channel"})}),N&&n.jsx("div",{className:"cheng-input-bar__select-menu",role:"listbox","aria-label":"Channels",children:u.map(K=>{const ce=K.id===m;return n.jsxs("button",{type:"button",role:"option","aria-selected":ce,className:`cheng-input-bar__select-option${ce?" cheng-input-bar__select-option--active":""}`,onClick:()=>{v?.(K),G(!1)},children:[n.jsx("span",{className:"cheng-input-bar__select-option-name",children:K.name}),n.jsx("span",{className:"cheng-input-bar__select-option-id",children:K.channelId})]},K.id)})})]})]}),n.jsx("button",{className:"cheng-input-bar__button",type:"submit",disabled:!X,"aria-label":"发送消息",children:T?n.jsx("div",{className:"cheng-input-bar__spinner"}):n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M10 3.5V16.5M10 3.5L5 8.5M10 3.5L15 8.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]})]})}),A.length>d*.8&&n.jsxs("div",{className:"cheng-input-bar__counter",children:[A.length," / ",d]}),n.jsx("style",{children:zh})]})}function Th(l){return l.startsWith("image/")?"🖼":l.startsWith("audio/")?"🎵":l.startsWith("video/")?"🎬":l==="application/pdf"?"📄":l.includes("word")||l.includes("wordprocessingml")?"📝":l.includes("excel")||l.includes("spreadsheetml")?"📊":l.includes("powerpoint")||l.includes("presentationml")?"📑":"📎"}const zh=`
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
`;function Lh({className:l="",style:i={},title:a="对话",placeholder:d="输入消息...",showStatus:p=!0,height:u="600px",channels:m=[],activeChannelId:w=null,activeChannel:v=null,onSelectChannel:_}){const{resetConversation:z,error:T}=si();return n.jsxs("div",{className:`cheng-chat-window ${l}`,style:{...i,height:typeof u=="number"?`${u}px`:u},children:[n.jsxs("div",{className:"cheng-chat-window__header",children:[n.jsxs("div",{className:"cheng-chat-window__header-left",children:[n.jsx("h2",{className:"cheng-chat-window__title",children:a}),p&&n.jsx(hh,{})]}),n.jsx("div",{className:"cheng-chat-window__header-right",children:n.jsx("button",{className:"cheng-chat-window__reset-button",onClick:z,type:"button","aria-label":"新建对话",title:"新建对话",children:n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C8.34315 16 6.84315 15.3284 5.75736 14.2426",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),n.jsx("path",{d:"M7 10L4 10L4 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})})]}),T&&n.jsxs("div",{className:"cheng-chat-window__error",children:[n.jsx("span",{className:"cheng-chat-window__error-icon",children:"⚠️"}),n.jsx("span",{className:"cheng-chat-window__error-text",children:T.message})]}),n.jsx("div",{className:"cheng-chat-window__body",children:n.jsx(jh,{})}),n.jsx("div",{className:"cheng-chat-window__footer",children:n.jsx(Ah,{placeholder:d,channels:m,activeChannelId:w,activeChannel:v,onSelectChannel:_})}),n.jsx("style",{children:Rh})]})}const Rh=`
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
`,Mh=/^[a-z0-9-]+$/,ia=["🤖","🧠","🛠️","📊","💬","🚀","🧭","✨"];function Dh(l){if(!l)return"";const{avatarIcon:i,...a}=l;return Object.keys(a).length>0?JSON.stringify(a,null,2):""}function Ph({onSubmit:l,apiBaseUrl:i,onSuccess:a,isActive:d=!0,defaultAppType:p="",initialChannel:u=null,existingChannels:m=[],mode:w="create",showCancelButton:v=!1,onCancel:_,submitLabel:z="Create"}){const T=w==="edit",[H,A]=f.useState(""),[re,C]=f.useState(""),[F,N]=f.useState(""),[G,Y]=f.useState(""),[U,J]=f.useState(""),[Q,X]=f.useState(p),[se,ne]=f.useState(ia[0]),[oe,ee]=f.useState(""),[le,q]=f.useState(!1),[_e,K]=f.useState(!1),[ce,O]=f.useState(!1),[$,W]=f.useState([]),[B,g]=f.useState([]),[b,y]=f.useState(null),[R,E]=f.useState(null),[P,S]=f.useState(null),V=f.useRef(null),de=f.useCallback(()=>{const D=u?.connectionConfig?.avatarIcon;A(u?.name??""),C(u?.channelId??""),N(u?.workspaceId??""),Y(u?.boundWorkflowId??""),J(u?.description??""),X(u?.appType??p),ne(typeof D=="string"&&D.trim()?D:ia[0]),ee(Dh(u?.connectionConfig)),W([]),g([]),y(null),E(null),K(!1),O(!1),S(null),q(!1)},[p,u]);f.useEffect(()=>{de()},[de]);const ge=f.useCallback(async()=>{if(!i){W([]),y("Missing apiBaseUrl, cannot load workspaces");return}K(!0),y(null);try{const D=new We(i),Ce=await new qe(i,D).listWorkspaces();W(Ce),N(Ee=>!Ee&&Ce.length>0?Ce[0].id:Ee)}catch(D){W([]),y(D instanceof Error?D.message:"Failed to load workspaces")}finally{K(!1)}},[i]);f.useEffect(()=>{!d||!i||V.current!==i&&(V.current=i,ge())},[d,ge]);const he=f.useCallback(async()=>{if(!i){g([]),E("Missing apiBaseUrl, cannot load workflows");return}if(!F){g([]),E(null);return}O(!0),E(null);try{const D=new We(i),Ce=await new qe(i,D).listPublishedWorkflows({workspaceId:F});g(Ce),Y(Ee=>!Ee&&Ce.length>0?Ce[0].id:Ee)}catch(D){g([]),E(D instanceof Error?D.message:"Failed to load published workflows")}finally{O(!1)}},[i,F]),Te=f.useRef(he);Te.current=he,f.useEffect(()=>{d&&F&&Te.current()},[d,F]);const He=f.useCallback(D=>{const je=D.target.value;A(je),C(Ce=>{const Ee=H.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return Ce===Ee||Ce===""?je.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):Ce})},[H]),ye=f.useCallback(async D=>{if(D.preventDefault(),S(null),!H.trim()){S("Name is required");return}if(!re.trim()){S("Channel ID is required");return}if(!F.trim()){S("Workspace ID is required");return}if(!G.trim()){S("Bound Workflow ID is required");return}if(!Mh.test(re)){S("Channel ID must only contain lowercase letters, numbers, and hyphens");return}const je=re.trim().toLowerCase();if(m.find(Ee=>T&&u&&Ee.id===u.id?!1:Ee.workspaceId===F.trim()&&Ee.channelId.trim().toLowerCase()===je)){S(`Agent ID "${re.trim()}" already exists in this workspace`);return}q(!0);try{const st={...oe.trim()?JSON.parse(oe):{},avatarIcon:se},at={name:H.trim(),channelId:re.trim(),workspaceId:F.trim(),boundWorkflowId:G.trim(),description:U.trim()||void 0,appType:Q.trim()||void 0,connectionConfig:st};T&&u?await l({id:u.id,...at}):await l(at),de(),a?.()}catch(Ee){S(Ee instanceof SyntaxError?"Connection config must be valid JSON":Ee instanceof Error?Ee.message:T?"Failed to update agent":"Failed to create agent"),q(!1)}},[H,re,F,G,U,Q,se,oe,u,m,T,l,de,a]);return n.jsxs("form",{className:"cheng-channel-form",onSubmit:ye,children:[P&&n.jsx("div",{className:"cheng-channel-form__error",children:P}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-name",children:"Name *"}),n.jsx("input",{id:"cf-name",className:"cheng-channel-form__input",type:"text",value:H,onChange:He,placeholder:"My Agent",autoFocus:!0,disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-channel-id",children:["Agent ID *",n.jsxs("span",{className:"cheng-channel-form__label-hint",children:[" ","(lowercase letters, numbers, hyphens)"]})]}),n.jsx("input",{id:"cf-channel-id",className:"cheng-channel-form__input",type:"text",value:re,onChange:D=>C(D.target.value),placeholder:"my-agent",disabled:le||T})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workspace-id",children:"Workspace *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{ge()},disabled:le||_e||T,children:_e?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workspace-id",className:"cheng-channel-form__input",value:F,onChange:D=>N(D.target.value),disabled:le||_e||T,children:[n.jsx("option",{value:"",children:_e?"Loading workspaces...":"Select workspace"}),$.map(D=>n.jsx("option",{value:D.id,children:D.name||D.id},D.id))]}),b&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:b})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workflow-id",children:"Published Workflow *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{he()},disabled:le||ce,children:ce?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workflow-id",className:"cheng-channel-form__input",value:G,onChange:D=>Y(D.target.value),disabled:le||ce,children:[n.jsx("option",{value:"",children:ce?"Loading published workflows...":"Select published workflow"}),B.map(D=>n.jsx("option",{value:D.id,children:D.name||D.id},D.id)),G&&!B.some(D=>D.id===G)&&n.jsx("option",{value:G,children:G})]}),R&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:R}),!ce&&!R&&B.length===0&&F&&n.jsx("div",{className:"cheng-channel-form__field-hint",children:"No active workflows found in this workspace. Create or activate a workflow first."})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-app-type",children:"App Type"}),n.jsx("input",{id:"cf-app-type",className:"cheng-channel-form__input",type:"text",value:Q,onChange:D=>X(D.target.value),placeholder:"whatsapp / telegram / slack",disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",children:"Agent Avatar"}),n.jsx("div",{className:"cheng-channel-form__avatar-grid",role:"radiogroup","aria-label":"Agent avatar",children:ia.map(D=>{const je=se===D;return n.jsx("button",{type:"button",className:`cheng-channel-form__avatar-option${je?" cheng-channel-form__avatar-option--selected":""}`,onClick:()=>ne(D),"aria-pressed":je,disabled:le,children:n.jsx("span",{className:"cheng-channel-form__avatar-emoji","aria-hidden":"true",children:D})},D)})}),n.jsx("div",{className:"cheng-channel-form__field-hint",children:"The selected avatar will be saved with this agent and shown on the agent cards."})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-desc",children:"Description"}),n.jsx("input",{id:"cf-desc",className:"cheng-channel-form__input",type:"text",value:U,onChange:D=>J(D.target.value),placeholder:"Optional description",disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-conn-cfg",children:"Connection Config"}),n.jsx("textarea",{id:"cf-conn-cfg",className:"cheng-channel-form__input cheng-channel-form__textarea",value:oe,onChange:D=>ee(D.target.value),placeholder:'{"botToken":"..."}',rows:4,disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__footer",children:[v&&_&&n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--secondary",type:"button",onClick:_,disabled:le,children:"Cancel"}),n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--primary",type:"submit",disabled:le,children:le?T?"Saving...":"Creating...":z})]}),n.jsx("style",{children:Fh})]})}const Fh=`
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
`;function Wh({isOpen:l,onClose:i,mode:a="create",initialChannel:d=null,existingChannels:p=[],onCreate:u,onUpdate:m,apiBaseUrl:w}){const v=a==="edit";return l?n.jsx("div",{className:"cheng-modal-overlay",onClick:i,children:n.jsxs("div",{className:"cheng-modal",onClick:_=>_.stopPropagation(),children:[n.jsxs("div",{className:"cheng-modal__header",children:[n.jsxs("div",{className:"cheng-modal__header-copy",children:[n.jsx("h3",{className:"cheng-modal__title",children:v?"Edit Agent":"Create Agent"}),n.jsx("p",{className:"cheng-modal__subtitle",children:v?"Update this agent's profile, workflow binding, avatar, and runtime settings.":"Set up a new agent, connect it to a workspace, and bind the workflow it should run."})]}),n.jsx("button",{className:"cheng-modal__close",onClick:i,type:"button","aria-label":"Close",children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M4 4l10 10M14 4L4 14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsx("div",{className:"cheng-modal__body",children:n.jsx(Ph,{onSubmit:async _=>{if(v){if(!m)throw new Error("Update handler is not configured");await m(_);return}await u(_)},apiBaseUrl:w,onSuccess:i,isActive:l,initialChannel:d,existingChannels:p,mode:a,showCancelButton:!0,onCancel:i,submitLabel:v?"Save Changes":"Create Agent"})}),n.jsx("style",{children:Oh})]})}):null}const Oh=`
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
`,sa={pending:"Running",running:"Running",waiting_for_review:"Needs review",completed_unread:"Completed",failed_unread:"Failed",cancelled:"Cancelled",unknown:"Reconnecting"};function Uh(l){const i=new Date(l);return Number.isNaN(i.getTime())?"创建时间未知":`创建于 ${i.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}`}function $h({sessions:l,activeSessionId:i,onSelect:a,onCreateClick:d,onDeleteSession:p,onRenameSession:u,onTogglePinSession:m}){const[w,v]=f.useState(null),[_,z]=f.useState(null),[T,H]=f.useState(""),A=f.useRef(null),re=f.useRef(null);f.useEffect(()=>{const N=G=>{A.current&&(A.current.contains(G.target)||(v(null),z(null)))};return document.addEventListener("mousedown",N),()=>document.removeEventListener("mousedown",N)},[]),f.useEffect(()=>{_&&(re.current?.focus(),re.current?.select())},[_]);const C=N=>{if(!u)return;const G=T.trim();!G||G===N.label||(u(N.id,G),v(null),z(null),H(""))},F=l.length>1&&!!p;return n.jsxs("div",{className:"cheng-session-list",ref:A,children:[n.jsxs("div",{className:"cheng-session-list__header",children:[n.jsx("span",{className:"cheng-session-list__title",children:"Conversations"}),n.jsx("button",{className:"cheng-session-list__add-btn",onClick:d,type:"button","aria-label":"Create conversation",title:"Create conversation",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsxs("ul",{className:"cheng-session-list__items",children:[l.map(N=>n.jsxs("li",{className:`cheng-session-list__item${N.id===i?" cheng-session-list__item--active":""}`,children:[n.jsxs("button",{className:"cheng-session-list__item-main",onClick:()=>a(N),type:"button",title:N.label,children:[n.jsx("span",{className:"cheng-session-list__item-icon",title:Uh(N.createdAt),children:n.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M7 1C3.68629 1 1 3.68629 1 7C1 8.20693 1.35785 9.33012 1.97285 10.2718L1 13L3.72822 12.0272C4.66988 12.6421 5.79307 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})})}),n.jsxs("span",{className:"cheng-session-list__item-meta",children:[n.jsx("span",{className:"cheng-session-list__item-label",children:N.label}),N.executionStatus&&sa[N.executionStatus]&&n.jsx("span",{className:`cheng-session-list__status cheng-session-list__status--${N.executionStatus}`,"aria-label":`${N.label}: ${sa[N.executionStatus]}`,children:sa[N.executionStatus]})]})]}),n.jsxs("div",{className:"cheng-session-list__item-actions",children:[n.jsx("button",{className:"cheng-session-list__item-menu-trigger",type:"button","aria-label":`更多操作 ${N.label}`,title:"更多操作",onClick:G=>{G.stopPropagation(),v(Y=>Y===N.id?null:N.id)},children:n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"7",cy:"2.5",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"7",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"11.5",r:"1.2",fill:"currentColor"})]})}),w===N.id&&n.jsx("div",{className:"cheng-session-list__menu",role:"menu",children:_===N.id?n.jsxs("div",{className:"cheng-session-list__rename-wrap",children:[n.jsx("input",{ref:re,className:"cheng-session-list__rename-input",value:T,onChange:G=>H(G.target.value),onKeyDown:G=>{G.key==="Enter"&&(G.preventDefault(),C(N)),G.key==="Escape"&&(G.preventDefault(),z(null))},maxLength:80}),n.jsxs("div",{className:"cheng-session-list__rename-actions",children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),C(N)},children:"保存"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),z(null)},children:"取消"})]})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),m?.(N.id),v(null)},role:"menuitem",children:N.pinned?"取消置顶":"置顶"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),z(N.id),H(N.label)},role:"menuitem",children:"重命名"}),n.jsx("button",{className:"cheng-session-list__menu-item cheng-session-list__menu-item--danger",type:"button",disabled:!F,onClick:G=>{G.stopPropagation(),p&&(p(N.id),v(null))},role:"menuitem",children:"删除"})]})})]})]},N.id)),l.length===0&&n.jsx("li",{className:"cheng-session-list__empty",children:"No conversations yet"})]}),n.jsx("style",{children:Bh})]})}const Bh=`
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

  .cheng-session-list__status { font-size: 10px; line-height: 1.2; color: #68645c; white-space: nowrap; }
  .cheng-session-list__status--running, .cheng-session-list__status--pending { color: #2b6e52; }
  .cheng-session-list__status--waiting_for_review { color: #9a5b13; font-weight: 600; }
  .cheng-session-list__status--failed_unread, .cheng-session-list__status--cancelled { color: #a43c35; }
  .cheng-session-list__status--completed_unread { color: #3567a8; }
  @media (prefers-reduced-motion: no-preference) {
    .cheng-session-list__status--running::before, .cheng-session-list__status--pending::before { content: ""; display: inline-block; width: 5px; height: 5px; margin-right: 4px; border-radius: 50%; background: currentColor; animation: cheng-status-pulse 1.5s ease-in-out infinite; }
    @keyframes cheng-status-pulse { 50% { opacity: .35; } }
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
`;function Hh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"telegram-bot"}function Kh(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Vh({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:u,onCancel:m}){const[w,v]=f.useState("ready"),[_,z]=f.useState(""),[T,H]=f.useState(()=>l[0]?.id??""),[A,re]=f.useState(""),[C,F]=f.useState(null),[N,G]=f.useState(null),[Y,U]=f.useState(null),[J,Q]=f.useState(null),[X,se]=f.useState(!1),ne=f.useRef(null),oe=f.useCallback(()=>(ne.current||(ne.current=new qe(a,new We(a))),ne.current),[a]),ee=l.find(K=>K.id===T)??null,le=f.useCallback(async K=>{if(K.preventDefault(),!(!_.trim()||!A.trim()||!ee)){F(null),v("connecting");try{const ce=Hh(_),O=await i({name:_.trim(),channelId:ce,workspaceId:ee.workspaceId,boundWorkflowId:ee.boundWorkflowId,appType:"telegram",description:`Telegram bot for agent: ${ee.name}`});O.channelId!==ce&&se(!0);const $=await oe().connectChannel(O.workspaceId,O.id,{bot_token:A.trim(),connection_mode:"polling"}),W=$.setupData,B=W?.username??W?.bot_username??W?.first_name;B&&Q(`@${B}`),U(W?.connection_mode??"polling");const g={...O,connectionState:$.connectionState,webhookUrl:$.webhookUrl,setupData:$.setupData};G(g),v("connected"),p?.(),d(g)}catch(ce){F(ce instanceof Error?ce.message:"Connection failed. Please check your bot token and try again."),v("error")}}},[_,A,ee,i,oe,d]);if(l.length===0)return n.jsxs("div",{className:"cheng-tg-form__no-agents",children:[n.jsx("div",{className:"cheng-tg-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-tg-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-tg-form__no-agents-desc",children:"Create an agent first, then come back to connect a Telegram bot to it. An agent defines which workflow processes incoming messages."}),u&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--secondary",onClick:u,children:"Go to Agents"}),n.jsx("style",{children:aa})]});if(w==="connected"&&N)return n.jsxs("div",{className:"cheng-tg-form__success",children:[n.jsx("div",{className:"cheng-tg-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-form__success-title",children:X?"Telegram Reconnected!":"Telegram Connected!"}),n.jsxs("p",{className:"cheng-tg-form__success-desc",children:[X&&n.jsxs("span",{className:"cheng-tg-form__existing-note",children:["An existing integration was found and reconnected."," "]}),n.jsx("strong",{children:N.name})," is now active",J&&n.jsxs(n.Fragment,{children:[" as ",n.jsx("strong",{children:J})]}),ee&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:ee.name})]}),"."]}),Y==="polling"?n.jsxs("div",{className:"cheng-tg-form__polling-notice",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),"The bot is listening for messages via polling — no public URL required."]}):null,n.jsx("p",{className:"cheng-tg-form__success-hint",children:"Your integration is listed in Connected Integrations above. Use Manage to view connection details."}),n.jsx("style",{children:aa})]});const q=w==="connecting",_e=_.trim().length>0&&A.trim().length>0&&!!ee&&!q;return n.jsxs("form",{className:"cheng-tg-form",onSubmit:le,children:[n.jsxs("div",{className:"cheng-tg-form__instructions",children:[n.jsx("p",{className:"cheng-tg-form__instructions-title",children:"How to get your bot token"}),n.jsxs("ol",{className:"cheng-tg-form__steps",children:[n.jsxs("li",{children:["Open Telegram and search for ",n.jsx("strong",{children:"@BotFather"})]}),n.jsxs("li",{children:["Send ",n.jsx("code",{children:"/newbot"})," and follow the prompts to create your bot"]}),n.jsx("li",{children:"Copy the API token BotFather provides and paste it below"})]})]}),C&&n.jsxs("div",{className:"cheng-tg-form__error-banner",children:[n.jsx("span",{children:C}),n.jsx("button",{type:"button",className:"cheng-tg-form__retry-btn",onClick:()=>{v("ready"),F(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-name",children:["Integration Name ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("input",{id:"tg-name",className:"cheng-tg-form__input",type:"text",value:_,onChange:K=>z(K.target.value),placeholder:"Support Bot",disabled:q,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-tg-form__hint",children:"A display name for this Telegram integration"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-agent",children:["Agent ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-tg-form__agent-select-wrap",children:n.jsx("select",{id:"tg-agent",className:"cheng-tg-form__input cheng-tg-form__input--select",value:T,onChange:K=>H(K.target.value),disabled:q,required:!0,children:l.map(K=>n.jsxs("option",{value:K.id,children:[Kh(K)," ",K.name]},K.id))})}),ee&&n.jsxs("span",{className:"cheng-tg-form__hint",children:["Messages from this bot will be handled by ",n.jsx("strong",{children:ee.name}),ee.description?` — ${ee.description}`:""]})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-token",children:["Bot Token ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"}),n.jsx("span",{className:"cheng-tg-form__label-hint",children:" (from @BotFather)"})]}),n.jsx("input",{id:"tg-token",className:"cheng-tg-form__input cheng-tg-form__input--token",type:"password",value:A,onChange:K=>re(K.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:q,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-form__hint",children:"Keep this token secret — it grants full control over your bot"})]}),n.jsxs("div",{className:"cheng-tg-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--ghost",onClick:m,disabled:q,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-form__btn cheng-tg-form__btn--connect",disabled:!_e,children:q?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-form__btn-spinner"}),"Connecting..."]}):"Connect Telegram"})]}),n.jsx("style",{children:aa})]})}const aa=`
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
`;function Gh({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:u,onCancel:m}){const w=i.find(q=>q.boundWorkflowId===l.boundWorkflowId&&q.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[v,_]=f.useState(w),[z,T]=f.useState(""),[H,A]=f.useState("ready"),[re,C]=f.useState(!1),[F,N]=f.useState(null),[G,Y]=f.useState(null),U=f.useRef(null),J=f.useCallback(()=>(U.current||(U.current=new qe(a,new We(a))),U.current),[a]),Q=i.find(q=>q.id===v)??null,X=Q&&(Q.workspaceId!==l.workspaceId||Q.boundWorkflowId!==l.boundWorkflowId),se=i.find(q=>q.boundWorkflowId===l.boundWorkflowId&&q.workspaceId===l.workspaceId)??null,ne=f.useCallback(async q=>{if(!(!z.trim()||!Q)){Y(null),N(null),q?A("saving"):C(!0);try{X&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:Q.workspaceId,boundWorkflowId:Q.boundWorkflowId,appType:l.appType,description:l.description});const _e=X?Q.workspaceId:l.workspaceId;await J().connectChannel(_e,l.id,{bot_token:z.trim(),connection_mode:"polling"}),p?.(),q?(A("saved"),setTimeout(()=>u(),1200)):(A("ready"),N("Bot connected — backend is polling for Telegram messages."))}catch(_e){Y(_e instanceof Error?_e.message:"Update failed. Please try again."),A("error"),N(null)}finally{q||C(!1)}}},[z,Q,X,l,d,J,p,u]),oe=f.useCallback(async q=>{q.preventDefault(),await ne(!0)},[ne]),ee=H==="saving",le=!!Q&&z.trim().length>0&&!ee&&!re;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):H==="saved"?n.jsxs("div",{className:"cheng-tg-edit__success",children:[n.jsx("div",{className:"cheng-tg-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-tg-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been reconfigured and reconnected."]}),n.jsx("style",{children:vd})]}):n.jsxs("form",{className:"cheng-tg-edit",onSubmit:oe,children:[G&&n.jsxs("div",{className:"cheng-tg-edit__error-banner",children:[n.jsx("span",{children:G}),n.jsx("button",{type:"button",className:"cheng-tg-edit__retry-btn",onClick:()=>{A("ready"),Y(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-edit__grid",children:[n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Choose which agent should handle messages from this Telegram bot."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("select",{className:"cheng-tg-edit__input cheng-tg-edit__input--select",value:v,onChange:q=>_(q.target.value),disabled:ee,required:!0,children:i.map(q=>n.jsx("option",{value:q.id,children:q.name},q.id))}),Q&&n.jsxs("span",{className:"cheng-tg-edit__hint",children:["Selected: ",n.jsx("strong",{children:Q.name}),Q.description?` — ${Q.description}`:""]}),X&&Q&&n.jsxs("div",{className:"cheng-tg-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:se?.name??"the current agent"})," to"," ",n.jsx("strong",{children:Q.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Bot Token"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Paste a fresh token to reconnect this bot or rotate credentials."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("input",{className:"cheng-tg-edit__input cheng-tg-edit__input--token",type:"password",value:z,onChange:q=>T(q.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:ee,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-edit__hint",children:"Your existing token will be replaced. Get a new one from @BotFather if needed."}),F&&n.jsx("div",{className:"cheng-tg-edit__test-ok",children:F}),n.jsx("div",{className:"cheng-tg-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--secondary",disabled:!Q||z.trim().length===0||ee||re,onClick:()=>{ne(!1)},children:re?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner cheng-tg-edit__spinner--dark"}),"测试中..."]}):"测试连接"})})]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--ghost",onClick:m,disabled:ee,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-edit__btn cheng-tg-edit__btn--connect",disabled:!le,children:ee?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner"}),"Saving..."]}):"Save & Reconnect"})]}),n.jsx("style",{children:vd})]})}const vd=`
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
`;function qh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"whatsapp-bot"}function Qh(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Xh({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:u,onCancel:m}){const[w,v]=f.useState("ready"),[_,z]=f.useState(""),[T,H]=f.useState(()=>l[0]?.id??""),[A,re]=f.useState(""),[C,F]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[J,Q]=f.useState("v21.0"),[X,se]=f.useState(null),[ne,oe]=f.useState(null),[ee,le]=f.useState(null),[q,_e]=f.useState(null),K=f.useRef(null),ce=f.useCallback(()=>(K.current||(K.current=new qe(a,new We(a))),K.current),[a]),O=l.find(g=>g.id===T)??null,$=f.useCallback(async g=>{if(g.preventDefault(),!(!_.trim()||!A.trim()||!C.trim()||!N.trim()||!Y.trim()||!O)){se(null),v("connecting");try{const b=qh(_),y=await i({name:_.trim(),channelId:b,workspaceId:O.workspaceId,boundWorkflowId:O.boundWorkflowId,appType:"whatsapp",description:`WhatsApp integration for agent: ${O.name}`}),R=await ce().connectChannel(y.workspaceId,y.id,{phone_number_id:A.trim(),access_token:C.trim(),signing_secret:N.trim(),webhook_verify_token:Y.trim(),api_version:J.trim()||"v21.0"}),E=R.setupData,P=R.webhookUrl??E?.webhook_url??null,S=E?.webhook_verify_token??Y.trim();le(P),_e(S);const V={...y,connectionState:R.connectionState,webhookUrl:R.webhookUrl,setupData:R.setupData};oe(V),v("connected"),p?.(),d(V)}catch(b){se(b instanceof Error?b.message:"Connection failed. Please check your configuration and try again."),v("error")}}},[_,A,C,N,Y,J,O,i,ce,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-wa-form__no-agents",children:[n.jsx("div",{className:"cheng-wa-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wa-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wa-form__no-agents-desc",children:"Create an agent first, then come back to connect a WhatsApp integration. An agent defines which workflow processes incoming messages."}),u&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--secondary",onClick:u,children:"Go to Agents"}),n.jsx("style",{children:la})]});if(w==="connected"&&ne)return n.jsxs("div",{className:"cheng-wa-form__success",children:[n.jsx("div",{className:"cheng-wa-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-form__success-title",children:"WhatsApp Connected!"}),n.jsxs("p",{className:"cheng-wa-form__success-desc",children:[n.jsx("strong",{children:ne.name})," has been created and verified",O&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:O.name})]}),"."]}),(ee||q)&&n.jsxs("div",{className:"cheng-wa-form__webhook-box",children:[n.jsx("p",{className:"cheng-wa-form__webhook-box-title",children:"Configure Meta Console Webhook"}),ee&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Webhook URL"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:ee})]}),q&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Verify Token"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:q})]}),n.jsxs("ol",{className:"cheng-wa-form__meta-steps",children:[n.jsxs("li",{children:["Go to"," ",n.jsx("strong",{children:"Meta for Developers"})," → your WhatsApp app →"," ",n.jsx("strong",{children:"WhatsApp > Configuration"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Webhook"}),", click ",n.jsx("strong",{children:"Edit"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Webhook URL"})," and"," ",n.jsx("strong",{children:"Verify Token"})," shown above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Verify and Save"})]}),n.jsxs("li",{children:["Subscribe to ",n.jsx("strong",{children:"messages"})," webhook field"]})]})]}),n.jsx("p",{className:"cheng-wa-form__success-hint",children:"After configuring the webhook in Meta Console, send a test WhatsApp message to verify the full integration is working."}),m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:la})]});const W=w==="connecting",B=_.trim().length>0&&A.trim().length>0&&C.trim().length>0&&N.trim().length>0&&Y.trim().length>0&&!!O&&!W;return n.jsxs("form",{className:"cheng-wa-form",onSubmit:$,children:[n.jsxs("div",{className:"cheng-wa-form__instructions",children:[n.jsx("p",{className:"cheng-wa-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wa-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"Meta Business Account"})," with a verified phone number in WhatsApp Business Platform"]}),n.jsxs("li",{children:["Create a WhatsApp app in"," ",n.jsx("strong",{children:"Meta for Developers"})," and note the"," ",n.jsx("strong",{children:"Phone Number ID"})," and ",n.jsx("strong",{children:"Access Token"})]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Webhook URL"})," ","to paste into Meta Console"]})]})]}),X&&n.jsxs("div",{className:"cheng-wa-form__error-banner",children:[n.jsx("span",{children:X}),n.jsx("button",{type:"button",className:"cheng-wa-form__retry-btn",onClick:()=>{v("ready"),se(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-name",className:"cheng-wa-form__input",type:"text",value:_,onChange:g=>z(g.target.value),placeholder:"Customer Support WA",disabled:W,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A display name for this WhatsApp integration"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-agent",children:["Agent ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wa-form__agent-select-wrap",children:n.jsx("select",{id:"wa-agent",className:"cheng-wa-form__input cheng-wa-form__input--select",value:T,onChange:g=>H(g.target.value),disabled:W,required:!0,children:l.map(g=>n.jsxs("option",{value:g.id,children:[Qh(g)," ",g.name]},g.id))})}),O&&n.jsxs("span",{className:"cheng-wa-form__hint",children:["Messages from WhatsApp will be handled by"," ",n.jsx("strong",{children:O.name}),O.description?` — ${O.description}`:""]})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-phone-id",children:["Phone Number ID ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-phone-id",className:"cheng-wa-form__input",type:"text",value:A,onChange:g=>re(g.target.value),placeholder:"123456789012345",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta for Developers → WhatsApp → API Setup"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-access-token",children:["Access Token ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-access-token",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:C,onChange:g=>F(g.target.value),placeholder:"EAAxxxxxxxx...",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Permanent or temporary access token from Meta app dashboard"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-signing-secret",children:["App Secret"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"}),n.jsx("span",{className:"cheng-wa-form__label-hint",children:" (signing secret)"})]}),n.jsx("input",{id:"wa-signing-secret",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:N,onChange:g=>G(g.target.value),placeholder:"Your app secret",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta app → Settings → Basic → App Secret. Used to verify incoming webhook signatures."})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-verify-token",children:["Webhook Verify Token"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-verify-token",className:"cheng-wa-form__input",type:"text",value:Y,onChange:g=>U(g.target.value),placeholder:"my-secret-verify-token",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A string you choose — you'll enter this same value when configuring the webhook in Meta Console"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsx("label",{className:"cheng-wa-form__label",htmlFor:"wa-api-version",children:"API Version"}),n.jsx("input",{id:"wa-api-version",className:"cheng-wa-form__input",type:"text",value:J,onChange:g=>Q(g.target.value),placeholder:"v21.0",disabled:W,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"WhatsApp Cloud API version — default is v21.0"})]}),n.jsxs("div",{className:"cheng-wa-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--ghost",onClick:m,disabled:W,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",disabled:!B,children:W?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-form__btn-spinner"}),"Connecting..."]}):"Connect WhatsApp"})]}),n.jsx("style",{children:la})]})}const la=`
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
`;function Yh({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:u,onCancel:m}){const w=l.connectionConfig??{},v=i.find(E=>E.boundWorkflowId===l.boundWorkflowId&&E.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[_,z]=f.useState(v),[T,H]=f.useState(typeof w.phone_number_id=="string"?w.phone_number_id:""),[A,re]=f.useState(typeof w.api_version=="string"?w.api_version:"v21.0"),[C,F]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[J,Q]=f.useState("ready"),[X,se]=f.useState(!1),[ne,oe]=f.useState(null),[ee,le]=f.useState(null),[q,_e]=f.useState(l.webhookUrl??null),K=f.useRef(null),ce=f.useCallback(()=>(K.current||(K.current=new qe(a,new We(a))),K.current),[a]),O=i.find(E=>E.id===_)??null,$=i.find(E=>E.boundWorkflowId===l.boundWorkflowId&&E.workspaceId===l.workspaceId)??null,W=O&&(O.workspaceId!==l.workspaceId||O.boundWorkflowId!==l.boundWorkflowId),B=C.trim().length>0&&N.trim().length>0&&Y.trim().length>0&&T.trim().length>0,g=f.useCallback(async E=>{if(O){le(null),oe(null),E?Q("saving"):se(!0);try{if(W&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:O.workspaceId,boundWorkflowId:O.boundWorkflowId,appType:l.appType,description:l.description}),B){const P=W?O.workspaceId:l.workspaceId,S=await ce().connectChannel(P,l.id,{phone_number_id:T.trim(),access_token:C.trim(),signing_secret:N.trim(),webhook_verify_token:Y.trim(),api_version:A.trim()||"v21.0"}),V=S.setupData,de=S.webhookUrl??V?.webhook_url??null;de&&_e(de)}p?.(),E?(Q("saved"),setTimeout(()=>u(),1200)):(Q("ready"),oe(B?"Connection verified — credentials accepted.":"Agent binding updated."))}catch(P){le(P instanceof Error?P.message:"Update failed. Please try again."),Q("error"),oe(null)}finally{E||se(!1)}}},[O,W,B,l,d,ce,T,C,N,Y,A,p,u]),b=f.useCallback(async E=>{E.preventDefault(),await g(!0)},[g]),y=J==="saving",R=!!O&&(!!W||B)&&!y&&!X;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):J==="saved"?n.jsxs("div",{className:"cheng-wa-edit__success",children:[n.jsx("div",{className:"cheng-wa-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wa-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",B?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:kd})]}):n.jsxs("form",{className:"cheng-wa-edit",onSubmit:b,children:[ee&&n.jsxs("div",{className:"cheng-wa-edit__error-banner",children:[n.jsx("span",{children:ee}),n.jsx("button",{type:"button",className:"cheng-wa-edit__retry-btn",onClick:()=>{Q("ready"),le(null)},children:"Retry"})]}),q&&n.jsxs("div",{className:"cheng-wa-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wa-edit__webhook-label",children:"Current Webhook URL"}),n.jsx("code",{className:"cheng-wa-edit__webhook-value",children:q})]}),n.jsxs("div",{className:"cheng-wa-edit__grid",children:[n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("select",{className:"cheng-wa-edit__input cheng-wa-edit__input--select",value:_,onChange:E=>z(E.target.value),disabled:y,required:!0,children:i.map(E=>n.jsx("option",{value:E.id,children:E.name},E.id))}),W&&O&&n.jsxs("div",{className:"cheng-wa-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:$?.name??"current agent"})," to"," ",n.jsx("strong",{children:O.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Phone Number ID"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Pre-filled from your current configuration. Only change if the number changed."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:T,onChange:E=>H(E.target.value),placeholder:"123456789012345",disabled:y,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Access Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Fill in only to rotate credentials."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:C,onChange:E=>F(E.target.value),placeholder:"EAAxxxxxxxx... (leave blank to keep current)",disabled:y,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"App Secret"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing secret. Required when rotating Access Token."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:N,onChange:E=>G(E.target.value),placeholder:"(leave blank to keep current)",disabled:y,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Webhook Verify Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:Y,onChange:E=>U(E.target.value),placeholder:"(leave blank to keep current)",disabled:y,autoComplete:"off"}),ne&&n.jsx("div",{className:"cheng-wa-edit__test-ok",children:ne}),n.jsx("div",{className:"cheng-wa-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--secondary",disabled:!B||!O||y||X,onClick:()=>{g(!1)},children:X?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner cheng-wa-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"API Version"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"WhatsApp Cloud API version — pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:A,onChange:E=>re(E.target.value),placeholder:"v21.0",disabled:y,autoComplete:"off"})})]})]}),!B&&n.jsxs("div",{className:"cheng-wa-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Access Token + App Secret + Verify Token to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wa-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--ghost",onClick:m,disabled:y,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-edit__btn cheng-wa-edit__btn--connect",disabled:!R,children:y?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner"}),"Saving..."]}):B?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:kd})]})}const kd=`
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
`;function Jh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"slack-app"}function Zh(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function ef({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:u,onCancel:m}){const[w,v]=f.useState("ready"),[_,z]=f.useState("webhook"),[T,H]=f.useState(""),[A,re]=f.useState(()=>l[0]?.id??""),[C,F]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[J,Q]=f.useState(""),[X,se]=f.useState(""),[ne,oe]=f.useState(null),[ee,le]=f.useState(null),[q,_e]=f.useState(null),[K,ce]=f.useState(null),[O,$]=f.useState(null),[W,B]=f.useState("idle"),g=f.useRef(null),b=f.useCallback(()=>(g.current||(g.current=new qe(a,new We(a))),g.current),[a]),y=l.find(S=>S.id===A)??null,R=f.useCallback(async S=>{S.preventDefault();const V=_==="webhook"&&T.trim()&&C.trim()&&N.trim()&&y,de=_==="socket_mode"&&T.trim()&&C.trim()&&Y.trim()&&y;if(!V&&!de)return;oe(null),v("connecting");let ge;try{const he=Jh(T);ge=await i({name:T.trim(),channelId:he,workspaceId:y.workspaceId,boundWorkflowId:y.boundWorkflowId,appType:"slack",description:`Slack integration for agent: ${y.name}`})}catch(he){oe(he instanceof Error?he.message:"Failed to create the channel record. Please try again."),v("error");return}_e(ge);try{const he={bot_token:C.trim(),connection_mode:_};_==="webhook"?he.signing_secret=N.trim():he.app_token=Y.trim(),J.trim()&&(he.app_id=J.trim()),X.trim()&&(he.team_id=X.trim());const Te=await b().connectChannel(ge.workspaceId,ge.id,he),He=Te.setupData,ye=_==="webhook"?Te.webhookUrl??He?.webhook_url??null:null;ce(ye);const D=He?.team_name??null,je=He?.bot_user??null;(D||je)&&$([D,je?`Bot: ${je}`:null].filter(Boolean).join(" · "));const Ce={...ge,connectionState:Te.connectionState,webhookUrl:Te.webhookUrl,setupData:Te.setupData};le(Ce),v("connected"),p?.(),d(Ce)}catch(he){p?.(),oe(he instanceof Error?he.message:_==="webhook"?"Connection failed. Please check your Bot Token and Signing Secret.":"Connection failed. Please check your Bot Token and App-Level Token."),v("created")}},[_,T,C,N,Y,J,X,y,i,b,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-sl-form__no-agents",children:[n.jsx("div",{className:"cheng-sl-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-sl-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-sl-form__no-agents-desc",children:"Create an agent first, then come back to connect a Slack app. An agent defines which workflow processes incoming messages."}),u&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:u,children:"Go to Agents"}),n.jsx("style",{children:ti})]});if(w==="connected"&&ee)return n.jsxs("div",{className:"cheng-sl-form__success",children:[n.jsx("div",{className:"cheng-sl-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-form__success-title",children:"Slack Connected!"}),n.jsxs("p",{className:"cheng-sl-form__success-desc",children:[n.jsx("strong",{children:ee.name})," has been created and verified",O&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-sl-form__workspace-info",children:O})]}),y&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:y.name})]}),"."]}),n.jsx("div",{className:"cheng-sl-form__mode-badge",children:_==="socket_mode"?"Socket Mode":"Webhook Mode"}),_==="webhook"&&K&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Configure Slack Event Subscriptions"}),n.jsxs("div",{className:"cheng-sl-form__webhook-row",children:[n.jsx("span",{className:"cheng-sl-form__webhook-label",children:"Request URL"}),n.jsxs("div",{className:"cheng-sl-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-sl-form__webhook-value",children:K}),n.jsx("button",{type:"button",className:"cheng-sl-form__copy-btn",onClick:()=>{navigator.clipboard.writeText(K).then(()=>{B("copied"),setTimeout(()=>B("idle"),2e3)})},children:W==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Event Subscriptions"})]}),n.jsxs("li",{children:["Enable events and paste the ",n.jsx("strong",{children:"Request URL"})," shown above"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Subscribe to bot events"}),", add:"," ",n.jsx("code",{children:"app_mention"})," and ",n.jsx("code",{children:"message.im"})," (add"," ",n.jsx("code",{children:"message.channels"})," to receive channel messages)"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"})]}),n.jsx("li",{children:"Reinstall the app to your workspace to apply scope changes"})]})]}),_==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Socket Mode — No Public URL Required"}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Socket Mode"})," and confirm it is ",n.jsx("strong",{children:"enabled"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Event Subscriptions"}),", enable events and subscribe to bot events:"," ",n.jsx("code",{children:"app_mention"}),", ",n.jsx("code",{children:"message.im"}),", ",n.jsx("code",{children:"message.channels"})]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"}),", ",n.jsx("code",{children:"connections:write"})]}),n.jsx("li",{children:"Reinstall the app to your workspace if you added new scopes"}),n.jsx("li",{children:"The backend is now listening via WebSocket — no Event Subscriptions Request URL needed"})]})]}),n.jsx("p",{className:"cheng-sl-form__success-hint",children:_==="webhook"?"After configuring Event Subscriptions, mention your bot in a channel to verify the integration.":"Your bot is now connected via Socket Mode. Mention it in a channel or send a DM to verify."}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:ti})]});if(w==="created"&&q)return n.jsxs("div",{className:"cheng-sl-form__created-warn",children:[n.jsx("div",{className:"cheng-sl-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-sl-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-sl-form__created-warn-desc",children:[n.jsx("strong",{children:q.name})," was created successfully, but the token validation failed",ne?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:ne})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:ti})]});const E=w==="connecting",P=T.trim().length>0&&C.trim().length>0&&(_==="webhook"?N.trim().length>0:Y.trim().length>0)&&!!y&&!E;return n.jsxs("form",{className:"cheng-sl-form",onSubmit:R,children:[n.jsxs("div",{className:"cheng-sl-form__mode-toggle-wrap",children:[n.jsx("span",{className:"cheng-sl-form__mode-toggle-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-form__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${_==="webhook"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>z("webhook"),disabled:E,children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${_==="socket_mode"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>z("socket_mode"),disabled:E,children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]}),n.jsx("span",{className:"cheng-sl-form__mode-toggle-hint",children:_==="webhook"?"Requires a public HTTPS URL. Slack sends events to your server via HTTP.":"No public URL needed. Backend maintains a persistent WebSocket to Slack."})]}),n.jsxs("div",{className:"cheng-sl-form__instructions",children:[n.jsx("p",{className:"cheng-sl-form__instructions-title",children:"Before you begin"}),_==="webhook"?n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App Credentials"}),", copy the"," ",n.jsx("strong",{children:"Signing Secret"})]}),n.jsxs("li",{children:["After connecting, paste the provided ",n.jsx("strong",{children:"Request URL"})," into"," ",n.jsx("strong",{children:"Event Subscriptions"})]})]}):n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"Socket Mode"})," in your app settings and"," ",n.jsx("strong",{children:"enable Socket Mode"})]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),", generate a token with ",n.jsx("code",{children:"connections:write"})," scope — this is your"," ",n.jsx("strong",{children:"App-Level Token"})," (",n.jsx("code",{children:"xapp-..."}),")"]}),n.jsxs("li",{children:["Enable ",n.jsx("strong",{children:"Event Subscriptions"})," and subscribe to the bot events you need (no Request URL needed)"]})]})]}),ne&&n.jsxs("div",{className:"cheng-sl-form__error-banner",children:[n.jsx("span",{children:ne}),n.jsx("button",{type:"button",className:"cheng-sl-form__retry-btn",onClick:()=>{v("ready"),oe(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-name",children:["Integration Name ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-name",className:"cheng-sl-form__input",type:"text",value:T,onChange:S=>H(S.target.value),placeholder:"Slack Support Bot",disabled:E,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-sl-form__hint",children:"A display name for this Slack integration"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-agent",children:["Agent ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-sl-form__agent-select-wrap",children:n.jsx("select",{id:"sl-agent",className:"cheng-sl-form__input cheng-sl-form__input--select",value:A,onChange:S=>re(S.target.value),disabled:E,required:!0,children:l.map(S=>n.jsxs("option",{value:S.id,children:[Zh(S)," ",S.name]},S.id))})}),y&&n.jsxs("span",{className:"cheng-sl-form__hint",children:["Messages from Slack will be handled by"," ",n.jsx("strong",{children:y.name}),y.description?` — ${y.description}`:""]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-bot-token",children:["Bot Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xoxb-...)"})]}),n.jsx("input",{id:"sl-bot-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:C,onChange:S=>F(S.target.value),placeholder:"xoxb-0000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx",disabled:E,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"OAuth & Permissions → Bot User OAuth Token"}),". Keep this secret."]})]}),_==="webhook"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-signing-secret",children:["Signing Secret ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-signing-secret",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:N,onChange:S=>G(S.target.value),placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:E,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App Credentials → Signing Secret"}),". Used to verify webhook signatures."]})]}),_==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-token",children:["App-Level Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xapp-...)"})]}),n.jsx("input",{id:"sl-app-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:Y,onChange:S=>U(S.target.value),placeholder:"xapp-1-xxxxxxxxxx-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:E,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),". Must have the"," ",n.jsx("code",{children:"connections:write"})," scope. Different from the Bot Token."]})]}),n.jsxs("div",{className:"cheng-sl-form__optional-row",children:[n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-id",children:["App ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-app-id",className:"cheng-sl-form__input",type:"text",value:J,onChange:S=>Q(S.target.value),placeholder:"A0XXXXXXX",disabled:E,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["From ",n.jsx("strong",{children:"Basic Information → App ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-team-id",children:["Workspace ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-team-id",className:"cheng-sl-form__input",type:"text",value:X,onChange:S=>se(S.target.value),placeholder:"T0XXXXXXX",disabled:E,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:"Slack Workspace / Team ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--ghost",onClick:m,disabled:E,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",disabled:!P,children:E?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-form__btn-spinner"}),"Connecting..."]}):"Connect Slack"})]}),n.jsx("style",{children:ti})]})}const ti=`
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
`;function tf({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:u,onCancel:m}){const w=l.connectionConfig??{},v=i.find(ye=>ye.boundWorkflowId===l.boundWorkflowId&&ye.workspaceId===l.workspaceId)?.id??i[0]?.id??"",_=typeof w.connection_mode=="string"&&w.connection_mode==="socket_mode"?"socket_mode":"webhook",[z,T]=f.useState(_),[H,A]=f.useState(v),re=typeof w.app_id=="string"?w.app_id:"",C=typeof w.team_id=="string"?w.team_id:"",[F,N]=f.useState(re),[G,Y]=f.useState(C),[U,J]=f.useState(""),[Q,X]=f.useState(""),[se,ne]=f.useState(""),[oe,ee]=f.useState("ready"),[le,q]=f.useState(!1),[_e,K]=f.useState(null),[ce,O]=f.useState(null),[$,W]=f.useState(l.webhookUrl??null),B=f.useRef(null),g=f.useCallback(()=>(B.current||(B.current=new qe(a,new We(a))),B.current),[a]),b=i.find(ye=>ye.id===H)??null,y=i.find(ye=>ye.boundWorkflowId===l.boundWorkflowId&&ye.workspaceId===l.workspaceId)??null,R=b&&(b.workspaceId!==l.workspaceId||b.boundWorkflowId!==l.boundWorkflowId),E=z!==_,P=z==="webhook"?U.trim().length>0||Q.trim().length>0:U.trim().length>0||se.trim().length>0,S=z==="webhook"?U.trim().length>0&&Q.trim().length>0:U.trim().length>0&&se.trim().length>0,V=E&&!S,de=f.useCallback(async ye=>{if(b&&!(!R&&!P&&!E)&&!V){O(null),K(null),ye?ee("saving"):q(!0);try{if(R&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:b.workspaceId,boundWorkflowId:b.boundWorkflowId,appType:l.appType,description:l.description}),P||E){const D=R?b.workspaceId:l.workspaceId,je={connection_mode:z};U.trim()&&(je.bot_token=U.trim()),z==="webhook"?Q.trim()&&(je.signing_secret=Q.trim()):se.trim()&&(je.app_token=se.trim()),je.app_id=F.trim()||null,je.team_id=G.trim()||null;const Ce=await g().connectChannel(D,l.id,je),Ee=Ce.setupData;if(z==="webhook"){const st=Ce.webhookUrl??Ee?.webhook_url??null;st&&W(st)}else W(null)}if(p?.(),ye)ee("saved"),setTimeout(()=>u(),1200);else{ee("ready");let D;E?D=`Switched to ${z==="socket_mode"?"Socket Mode":"Webhook Mode"} and verified.`:P?D="Credentials verified — Slack integration is active.":D="Agent binding updated.",K(D)}}catch(D){O(D instanceof Error?D.message:"Update failed. Please try again."),ee("error"),K(null)}finally{ye||q(!1)}}},[b,R,P,E,V,z,l,d,g,U,Q,se,F,G,p,u]),ge=f.useCallback(async ye=>{ye.preventDefault(),await de(!0)},[de]),he=oe==="saving",Te=!!b&&(P||!!R&&!E)&&!V&&!he&&!le,He=he?null:P||E?"Save & Reconnect":"Save";return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):oe==="saved"?n.jsxs("div",{className:"cheng-sl-edit__success",children:[n.jsx("div",{className:"cheng-sl-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-sl-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",P||E?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:jd})]}):n.jsxs("form",{className:"cheng-sl-edit",onSubmit:ge,children:[ce&&n.jsxs("div",{className:"cheng-sl-edit__error-banner",children:[n.jsx("span",{children:ce}),n.jsx("button",{type:"button",className:"cheng-sl-edit__retry-btn",onClick:()=>{ee("ready"),O(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-edit__mode-section",children:[n.jsxs("div",{className:"cheng-sl-edit__mode-header",children:[n.jsx("span",{className:"cheng-sl-edit__mode-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-edit__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${z==="webhook"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>T("webhook"),disabled:he,children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${z==="socket_mode"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>T("socket_mode"),disabled:he,children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]})]}),E&&n.jsxs("div",{className:"cheng-sl-edit__mode-change-warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Switching from ",n.jsx("strong",{children:_==="webhook"?"Webhook":"Socket Mode"})," to"," ",n.jsx("strong",{children:z==="webhook"?"Webhook":"Socket Mode"}),". You must provide"," ",z==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to complete the switch — saving will trigger a full reconnect."]})]}),z==="webhook"&&$&&n.jsxs("div",{className:"cheng-sl-edit__webhook-info",children:[n.jsx("span",{className:"cheng-sl-edit__webhook-label",children:"Event Subscriptions Request URL"}),n.jsx("code",{className:"cheng-sl-edit__webhook-value",children:$}),n.jsxs("span",{className:"cheng-sl-edit__webhook-hint",children:["Paste this URL in your Slack app's ",n.jsx("strong",{children:"Event Subscriptions"})," settings."]})]}),z==="socket_mode"&&!E&&n.jsxs("div",{className:"cheng-sl-edit__socket-info",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),"Connected via Socket Mode — no Event Subscriptions Request URL needed. The backend maintains a persistent WebSocket to Slack."]}),n.jsxs("div",{className:"cheng-sl-edit__grid",children:[n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("select",{className:"cheng-sl-edit__input cheng-sl-edit__input--select",value:H,onChange:ye=>A(ye.target.value),disabled:he,required:!0,children:i.map(ye=>n.jsx("option",{value:ye.id,children:ye.name},ye.id))}),R&&b&&n.jsxs("div",{className:"cheng-sl-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:y?.name??"current agent"})," to"," ",n.jsx("strong",{children:b.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Bot Token"}),n.jsxs("span",{className:"cheng-sl-edit__card-tip",children:["Leave blank to keep the existing token (",n.jsx("code",{children:"xoxb-..."}),"). Fill in only to rotate."]})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:U,onChange:ye=>J(ye.target.value),placeholder:"xoxb-... (leave blank to keep current)",disabled:he,autoComplete:"off"})})]}),z==="webhook"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Signing Secret"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:E?"Required to activate Webhook Mode. Found in Basic Information → App Credentials.":"Leave blank to keep the existing secret. Fill in to rotate it independently."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:Q,onChange:ye=>X(ye.target.value),placeholder:E?"Required for Webhook Mode":"(leave blank to keep current)",disabled:he,autoComplete:"off"}),_e&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:_e}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!P||!b||he||le||V,onClick:()=>{de(!1)},children:le?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),z==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App-Level Token"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:E?"Required to activate Socket Mode. Generate in Basic Information → App-Level Tokens with connections:write scope.":"Leave blank to keep the existing token (xapp-...). Fill in only to rotate."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:se,onChange:ye=>ne(ye.target.value),placeholder:E?"xapp-... (required for Socket Mode)":"xapp-... (leave blank to keep current)",disabled:he,autoComplete:"off"}),_e&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:_e}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!P||!b||he||le||V,onClick:()=>{de(!1)},children:le?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:P?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:F,onChange:ye=>N(ye.target.value),placeholder:"A0XXXXXXX",disabled:he||!P,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Workspace ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:P?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:G,onChange:ye=>Y(ye.target.value),placeholder:"T0XXXXXXX",disabled:he||!P,autoComplete:"off"})})]})]}),!P&&!E&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),z==="webhook"?"Fill in Bot Token or Signing Secret (or both) to reconnect. Leave blank to only update the agent.":"Fill in Bot Token or App-Level Token (or both) to reconnect. Leave blank to only update the agent."]}),V&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint cheng-sl-edit__creds-hint--warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Mode change requires credentials to reconnect. Provide"," ",z==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to proceed."]}),n.jsxs("div",{className:"cheng-sl-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--ghost",onClick:m,disabled:he,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-edit__btn cheng-sl-edit__btn--connect",disabled:!Te,children:he?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner"}),"Saving..."]}):He})]}),n.jsx("style",{children:jd})]})}const jd=`
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
`;function nf(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"wecom-bot"}function rf(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function of({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:u,onCancel:m}){const[w,v]=f.useState("ready"),[_,z]=f.useState(""),[T,H]=f.useState(()=>l[0]?.id??""),[A,re]=f.useState(""),[C,F]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[J,Q]=f.useState(""),[X,se]=f.useState(""),[ne,oe]=f.useState(null),[ee,le]=f.useState(null),[q,_e]=f.useState(null),[K,ce]=f.useState(null),[O,$]=f.useState({}),W=f.useRef(null),B=f.useCallback(()=>(W.current||(W.current=new qe(a,new We(a))),W.current),[a]),g=l.find(P=>P.id===T)??null,b=f.useCallback((P,S)=>{navigator.clipboard.writeText(S).then(()=>{$(V=>({...V,[P]:"copied"})),setTimeout(()=>$(V=>({...V,[P]:"idle"})),2e3)})},[]),y=f.useCallback(async P=>{if(P.preventDefault(),!_.trim()||!A.trim()||!C.trim()||!N.trim()||!Y.trim()||!J.trim()||!g)return;oe(null),v("connecting");let S;try{const V=nf(_);S=await i({name:_.trim(),channelId:V,workspaceId:g.workspaceId,boundWorkflowId:g.boundWorkflowId,appType:"wecom",description:`WeCom integration for agent: ${g.name}`})}catch(V){oe(V instanceof Error?V.message:"Failed to create the channel record. Please try again."),v("error");return}_e(S);try{const V={corp_id:A.trim(),agent_id:C.trim(),corp_secret:N.trim(),token:Y.trim(),encoding_aes_key:J.trim()};X.trim()&&(V.receive_id=X.trim());const de=await B().connectChannel(S.workspaceId,S.id,V),ge=de.setupData;ce({webhookUrl:de.webhookUrl??ge?.webhook_url??void 0,token:ge?.callback_token??Y.trim(),encodingAesKeyMasked:ge?.encoding_aes_key_masked??void 0,corpId:ge?.corp_id??A.trim(),agentId:ge?.agent_id??C.trim()});const he={...S,connectionState:de.connectionState,webhookUrl:de.webhookUrl,setupData:de.setupData};le(he),v("connected"),p?.(),d(he)}catch(V){p?.(),oe(V instanceof Error?V.message:"Connection failed. Please check your Corp ID and Corp Secret."),v("created")}},[_,A,C,N,Y,J,X,g,i,B,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-wc-form__no-agents",children:[n.jsx("div",{className:"cheng-wc-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wc-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wc-form__no-agents-desc",children:"Create an agent first, then come back to connect a WeCom integration. An agent defines which workflow processes incoming messages."}),u&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:u,children:"Go to Agents"}),n.jsx("style",{children:ni})]});if(w==="connected"&&ee)return n.jsxs("div",{className:"cheng-wc-form__success",children:[n.jsx("div",{className:"cheng-wc-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-form__success-title",children:"WeCom Credentials Verified!"}),n.jsxs("p",{className:"cheng-wc-form__success-desc",children:[n.jsx("strong",{children:ee.name})," has been created and the Corp Secret has been verified",g&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:g.name})]}),"."]}),n.jsx("div",{className:"cheng-wc-form__status-badge cheng-wc-form__status-badge--configuring",children:"Configuring — Awaiting Callback Setup"}),K&&n.jsxs("div",{className:"cheng-wc-form__webhook-box",children:[n.jsx("p",{className:"cheng-wc-form__webhook-box-title",children:"Configure WeCom Admin Console Callback"}),K.webhookUrl&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Callback URL"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:K.webhookUrl}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>b("webhookUrl",K.webhookUrl),children:O.webhookUrl==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),K.token&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Token"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:K.token}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>b("token",K.token),children:O.token==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),K.encodingAesKeyMasked&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"EncodingAESKey"}),n.jsx("code",{className:"cheng-wc-form__webhook-value cheng-wc-form__webhook-value--muted",children:K.encodingAesKeyMasked})]}),n.jsxs("ol",{className:"cheng-wc-form__steps-list",children:[n.jsxs("li",{children:["Log in to"," ",n.jsx("strong",{children:"WeCom Admin Console"})," → ",n.jsx("strong",{children:"App Management"})," → select your custom app"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Receive Messages"}),", click ",n.jsx("strong",{children:"Set"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Callback URL"})," into the URL field"]}),n.jsxs("li",{children:["Enter the same ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," ","you configured above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Save"})," — WeCom will send a GET challenge to verify the URL"]}),n.jsxs("li",{children:["Once verified, the connection state will switch from"," ",n.jsx("em",{children:"Configuring"})," to ",n.jsx("em",{children:"Active"})]})]})]}),n.jsx("p",{className:"cheng-wc-form__success-hint",children:"The connection is not fully active until WeCom Admin Console successfully verifies the callback URL. After saving the callback config, send a test message to confirm end-to-end flow."}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:ni})]});if(w==="created"&&q)return n.jsxs("div",{className:"cheng-wc-form__created-warn",children:[n.jsx("div",{className:"cheng-wc-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-wc-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-wc-form__created-warn-desc",children:[n.jsx("strong",{children:q.name})," was created successfully, but credential validation failed",ne?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:ne})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:ni})]});const R=w==="connecting",E=_.trim().length>0&&A.trim().length>0&&C.trim().length>0&&N.trim().length>0&&Y.trim().length>0&&J.trim().length>0&&!!g&&!R;return n.jsxs("form",{className:"cheng-wc-form",onSubmit:y,children:[n.jsxs("div",{className:"cheng-wc-form__instructions",children:[n.jsx("p",{className:"cheng-wc-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wc-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"WeCom Enterprise Account"})," with a created"," ",n.jsx("strong",{children:"Custom App"})," (自建应用)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Management"}),", note the ",n.jsx("strong",{children:"Corp ID"}),","," ",n.jsx("strong",{children:"AgentId"}),", and ",n.jsx("strong",{children:"App Secret"})]}),n.jsxs("li",{children:["Create a ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," of your choice — you'll use these when configuring the callback in WeCom Admin Console"]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Callback URL"})," to paste into the Receive Messages settings"]})]})]}),ne&&w!=="created"&&n.jsxs("div",{className:"cheng-wc-form__error-banner",children:[n.jsx("span",{children:ne}),n.jsx("button",{type:"button",className:"cheng-wc-form__retry-btn",onClick:()=>{v("ready"),oe(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-name",className:"cheng-wc-form__input",type:"text",value:_,onChange:P=>z(P.target.value),placeholder:"WeCom Customer Support",disabled:R,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A display name for this WeCom integration"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent",children:["Agent ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wc-form__agent-select-wrap",children:n.jsx("select",{id:"wc-agent",className:"cheng-wc-form__input cheng-wc-form__input--select",value:T,onChange:P=>H(P.target.value),disabled:R,required:!0,children:l.map(P=>n.jsxs("option",{value:P.id,children:[rf(P)," ",P.name]},P.id))})}),g&&n.jsxs("span",{className:"cheng-wc-form__hint",children:["Messages from WeCom will be handled by"," ",n.jsx("strong",{children:g.name}),g.description?` — ${g.description}`:""]})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-id",children:["Corp ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-id",className:"cheng-wc-form__input",type:"text",value:A,onChange:P=>re(P.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in WeCom Admin Console → My Enterprise"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent-id",children:["Agent ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-agent-id",className:"cheng-wc-form__input",type:"text",value:C,onChange:P=>F(P.target.value),placeholder:"1000002",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → AgentId"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-secret",children:["Corp Secret ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-secret",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:N,onChange:P=>G(P.target.value),placeholder:"Your app's Corp Secret",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → App Secret. Used to obtain access tokens."})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-token",children:["Token ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-token",className:"cheng-wc-form__input",type:"text",value:Y,onChange:P=>U(P.target.value),placeholder:"my-callback-token",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A string you choose — enter this same value in WeCom callback settings"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-aes-key",children:["EncodingAESKey ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-aes-key",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:J,onChange:P=>Q(P.target.value),placeholder:"43-character AES key",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"43-char random key — enter this same value in WeCom callback settings"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-receive-id",children:["Receive ID",n.jsx("span",{className:"cheng-wc-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"wc-receive-id",className:"cheng-wc-form__input",type:"text",value:X,onChange:P=>se(P.target.value),placeholder:"Defaults to Corp ID if blank",disabled:R,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Used as the receive_id in message verification. Defaults to Corp ID."})]}),n.jsxs("div",{className:"cheng-wc-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--ghost",onClick:m,disabled:R,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",disabled:!E,children:R?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-form__btn-spinner"}),"Connecting..."]}):"Connect WeCom"})]}),n.jsx("style",{children:ni})]})}const ni=`
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
`;function sf({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:u,onCancel:m}){const w=l.connectionConfig??{},v=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[_,z]=f.useState(v),[T,H]=f.useState(typeof w.corp_id=="string"?w.corp_id:""),[A,re]=f.useState(typeof w.agent_id=="string"?w.agent_id:""),[C,F]=f.useState(typeof w.receive_id=="string"?w.receive_id:""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[J,Q]=f.useState(""),[X,se]=f.useState("ready"),[ne,oe]=f.useState(!1),[ee,le]=f.useState(null),[q,_e]=f.useState(null),[K,ce]=f.useState(l.webhookUrl??null),O=f.useRef(null),$=f.useCallback(()=>(O.current||(O.current=new qe(a,new We(a))),O.current),[a]),W=i.find(S=>S.id===_)??null,B=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)??null,g=W&&(W.workspaceId!==l.workspaceId||W.boundWorkflowId!==l.boundWorkflowId),b=N.trim().length>0&&Y.trim().length>0&&J.trim().length>0&&T.trim().length>0&&A.trim().length>0,y=f.useCallback(async S=>{if(W){_e(null),le(null),S?se("saving"):oe(!0);try{if(g&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:W.workspaceId,boundWorkflowId:W.boundWorkflowId,appType:l.appType,description:l.description}),b){const V=g?W.workspaceId:l.workspaceId,de={corp_id:T.trim(),agent_id:A.trim(),corp_secret:N.trim(),token:Y.trim(),encoding_aes_key:J.trim()};C.trim()&&(de.receive_id=C.trim());const ge=await $().connectChannel(V,l.id,de),he=ge.setupData,Te=ge.webhookUrl??he?.webhook_url??null;Te&&ce(Te)}p?.(),S?(se("saved"),setTimeout(()=>u(),1200)):(se("ready"),le(b?"Credentials verified — Corp Secret accepted.":"Agent binding updated."))}catch(V){_e(V instanceof Error?V.message:"Update failed. Please try again."),se("error"),le(null)}finally{S||oe(!1)}}},[W,g,b,l,d,$,T,A,N,Y,J,C,p,u]),R=f.useCallback(async S=>{S.preventDefault(),await y(!0)},[y]),E=X==="saving",P=!!W&&(!!g||b)&&!E&&!ne;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):X==="saved"?n.jsxs("div",{className:"cheng-wc-edit__success",children:[n.jsx("div",{className:"cheng-wc-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wc-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",b?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:Sd})]}):n.jsxs("form",{className:"cheng-wc-edit",onSubmit:R,children:[q&&n.jsxs("div",{className:"cheng-wc-edit__error-banner",children:[n.jsx("span",{children:q}),n.jsx("button",{type:"button",className:"cheng-wc-edit__retry-btn",onClick:()=>{se("ready"),_e(null)},children:"Retry"})]}),K&&n.jsxs("div",{className:"cheng-wc-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wc-edit__webhook-label",children:"Callback URL"}),n.jsx("code",{className:"cheng-wc-edit__webhook-value",children:K}),n.jsxs("span",{className:"cheng-wc-edit__webhook-hint",children:["Paste this URL in WeCom Admin Console → App → ",n.jsx("strong",{children:"Receive Messages"}),"."]})]}),l.connectionState==="configuring"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--configuring",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Credentials verified, but WeCom callback is not yet active. Configure the callback URL in WeCom Admin Console to complete the integration."]}),l.connectionState==="active"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--active",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"20 6 9 17 4 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),"Callback is active — WeCom verification challenge has succeeded."]}),n.jsxs("div",{className:"cheng-wc-edit__grid",children:[n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("select",{className:"cheng-wc-edit__input cheng-wc-edit__input--select",value:_,onChange:S=>z(S.target.value),disabled:E,required:!0,children:i.map(S=>n.jsx("option",{value:S.id,children:S.name},S.id))}),g&&W&&n.jsxs("div",{className:"cheng-wc-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:B?.name??"current agent"})," to"," ",n.jsx("strong",{children:W.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration. Update if the enterprise changed."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:T,onChange:S=>H(S.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:E,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Agent ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:A,onChange:S=>re(S.target.value),placeholder:"1000002",disabled:E,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp Secret"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing secret. Fill in to rotate credentials."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:N,onChange:S=>G(S.target.value),placeholder:"(leave blank to keep current)",disabled:E,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Token"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating Corp Secret."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:Y,onChange:S=>U(S.target.value),placeholder:"(leave blank to keep current)",disabled:E,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"EncodingAESKey"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing key. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:J,onChange:S=>Q(S.target.value),placeholder:"(leave blank to keep current)",disabled:E,autoComplete:"off"}),ee&&n.jsx("div",{className:"cheng-wc-edit__test-ok",children:ee}),n.jsx("div",{className:"cheng-wc-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--secondary",disabled:!b||!W||E||ne,onClick:()=>{y(!1)},children:ne?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner cheng-wc-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Receive ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Optional. Used for signature verification. Defaults to Corp ID if blank."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:C,onChange:S=>F(S.target.value),placeholder:"Defaults to Corp ID",disabled:E,autoComplete:"off"})})]})]}),!b&&n.jsxs("div",{className:"cheng-wc-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Corp Secret + Token + EncodingAESKey to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wc-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--ghost",onClick:m,disabled:E,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-edit__btn cheng-wc-edit__btn--connect",disabled:!P,children:E?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner"}),"Saving..."]}):b?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:Sd})]})}const Sd=`
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
`;function af(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"dingtalk-bot"}function lf(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function cf({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:u,onCancel:m}){const[w,v]=f.useState("ready"),[_,z]=f.useState(""),[T,H]=f.useState(()=>l[0]?.id??""),[A,re]=f.useState(""),[C,F]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(null),[J,Q]=f.useState(null),[X,se]=f.useState(null),[ne,oe]=f.useState(null),ee=f.useRef(null),le=f.useCallback(()=>(ee.current||(ee.current=new qe(a,new We(a))),ee.current),[a]),q=l.find(O=>O.id===T)??null,_e=f.useCallback(async O=>{if(O.preventDefault(),!_.trim()||!A.trim()||!C.trim()||!N.trim()||!q)return;U(null),v("connecting");let $;try{const W=af(_);$=await i({name:_.trim(),channelId:W,workspaceId:q.workspaceId,boundWorkflowId:q.boundWorkflowId,appType:"dingtalk",description:`DingTalk integration for agent: ${q.name}`})}catch(W){U(W instanceof Error?W.message:"Failed to create the channel record. Please try again."),v("error");return}se($);try{const W=await le().connectChannel($.workspaceId,$.id,{client_id:A.trim(),client_secret:C.trim(),robot_code:N.trim(),connection_mode:"stream"}),B=W.setupData;oe({robotCode:B?.robot_code??N.trim(),appName:B?.app_name??void 0,streamStatus:B?.stream_status??"connected",validatedAt:B?.validated_at??void 0});const g={...$,connectionState:W.connectionState,webhookUrl:W.webhookUrl,setupData:W.setupData};Q(g),v("connected"),p?.(),d(g)}catch(W){p?.(),U(W instanceof Error?W.message:"Connection failed. Please check your Client ID, Client Secret, and Robot Code."),v("created")}},[_,A,C,N,q,i,le,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-dt-form__no-agents",children:[n.jsx("div",{className:"cheng-dt-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-dt-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-dt-form__no-agents-desc",children:"Create an agent first, then come back to connect a DingTalk integration. An agent defines which workflow processes incoming messages."}),u&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:u,children:"Go to Agents"}),n.jsx("style",{children:ri})]});if(w==="connected"&&J)return n.jsxs("div",{className:"cheng-dt-form__success",children:[n.jsx("div",{className:"cheng-dt-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-form__success-title",children:"DingTalk Connected!"}),n.jsxs("p",{className:"cheng-dt-form__success-desc",children:[n.jsx("strong",{children:J.name})," has been created and is now live",ne?.appName&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-dt-form__app-name",children:ne.appName})]}),q&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:q.name})]}),"."]}),n.jsxs("div",{className:"cheng-dt-form__mode-badge",children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),n.jsxs("div",{className:"cheng-dt-form__stream-box",children:[n.jsx("p",{className:"cheng-dt-form__stream-box-title",children:"Stream Connection Active"}),ne?.robotCode&&n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Robot Code"}),n.jsx("code",{className:"cheng-dt-form__stream-value",children:ne.robotCode})]}),n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Status"}),n.jsx("span",{className:"cheng-dt-form__stream-status",children:ne?.streamStatus==="connected"?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__status-dot cheng-dt-form__status-dot--active"}),"Connected"]}):ne?.streamStatus??"connecting"})]}),n.jsxs("ol",{className:"cheng-dt-form__steps-list",children:[n.jsxs("li",{children:["The backend is now maintaining a ",n.jsx("strong",{children:"persistent WebSocket"})," to DingTalk — no public URL or callback configuration needed"]}),n.jsxs("li",{children:["Verify the bot is working by sending a ",n.jsx("strong",{children:"direct message"})," to your DingTalk App Bot"]}),n.jsxs("li",{children:["For group chat, ",n.jsx("strong",{children:"@mention"})," the bot — only @-mentioned messages are forwarded to the workflow"]})]})]}),n.jsxs("p",{className:"cheng-dt-form__success-hint",children:["The stream worker runs as long as the server is up. If the worker stops unexpectedly, use ",n.jsx("strong",{children:"Manage → Edit → Test Connection"})," to reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:ri})]});if(w==="created"&&X)return n.jsxs("div",{className:"cheng-dt-form__created-warn",children:[n.jsx("div",{className:"cheng-dt-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-dt-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-dt-form__created-warn-desc",children:[n.jsx("strong",{children:X.name})," was created successfully, but the stream worker failed to start",Y?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:Y})]}):"."," The channel is now listed in Connected Integrations — open"," ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:ri})]});const K=w==="connecting",ce=_.trim().length>0&&A.trim().length>0&&C.trim().length>0&&N.trim().length>0&&!!q&&!K;return n.jsxs("form",{className:"cheng-dt-form",onSubmit:_e,children:[n.jsxs("div",{className:"cheng-dt-form__instructions",children:[n.jsx("p",{className:"cheng-dt-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-dt-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"DingTalk Open Platform"})," developer account with a created ",n.jsx("strong",{children:"App Bot"})," (企业内部应用)"]}),n.jsxs("li",{children:["From your app's ",n.jsx("strong",{children:"App Credentials"}),", note the"," ",n.jsx("strong",{children:"Client ID"})," (AppKey) and ",n.jsx("strong",{children:"Client Secret"})," (AppSecret)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Features → Bot"}),", enable the bot feature and note the ",n.jsx("strong",{children:"Robot Code"})]}),n.jsx("li",{children:"No callback URL configuration is needed — DingTalk Stream Mode connects outbound from the server"})]})]}),Y&&w!=="created"&&n.jsxs("div",{className:"cheng-dt-form__error-banner",children:[n.jsx("span",{children:Y}),n.jsx("button",{type:"button",className:"cheng-dt-form__retry-btn",onClick:()=>{v("ready"),U(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-name",children:["Integration Name ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-name",className:"cheng-dt-form__input",type:"text",value:_,onChange:O=>z(O.target.value),placeholder:"DingTalk Support Bot",disabled:K,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-dt-form__hint",children:"A display name for this DingTalk integration"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-agent",children:["Agent ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-dt-form__agent-select-wrap",children:n.jsx("select",{id:"dt-agent",className:"cheng-dt-form__input cheng-dt-form__input--select",value:T,onChange:O=>H(O.target.value),disabled:K,required:!0,children:l.map(O=>n.jsxs("option",{value:O.id,children:[lf(O)," ",O.name]},O.id))})}),q&&n.jsxs("span",{className:"cheng-dt-form__hint",children:["Messages from DingTalk will be handled by"," ",n.jsx("strong",{children:q.name}),q.description?` — ${q.description}`:""]})]}),n.jsxs("div",{className:"cheng-dt-form__row-2col",children:[n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-id",children:["Client ID ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppKey)"})]}),n.jsx("input",{id:"dt-client-id",className:"cheng-dt-form__input",type:"text",value:A,onChange:O=>re(O.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:K,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client ID"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-robot-code",children:["Robot Code ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-robot-code",className:"cheng-dt-form__input",type:"text",value:N,onChange:O=>G(O.target.value),placeholder:"dingxxxxxx",disabled:K,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Features → Bot → Robot Code"})]})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-secret",children:["Client Secret ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppSecret)"})]}),n.jsx("input",{id:"dt-client-secret",className:"cheng-dt-form__input cheng-dt-form__input--token",type:"password",value:C,onChange:O=>F(O.target.value),placeholder:"Your app's Client Secret",disabled:K,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client Secret. Used for stream authentication."})]}),n.jsxs("div",{className:"cheng-dt-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--ghost",onClick:m,disabled:K,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",disabled:!ce,children:K?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__btn-spinner"}),"Connecting..."]}):"Connect DingTalk"})]}),n.jsx("style",{children:ri})]})}const ri=`
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
`;function df({channel:l,agents:i,apiBaseUrl:a,liveStatus:d,onUpdate:p,onRefresh:u,onSaved:m,onCancel:w}){const v=l.connectionConfig??{},_=l.setupData,z=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[T,H]=f.useState(z),[A,re]=f.useState(typeof v.client_id=="string"?v.client_id:""),[C,F]=f.useState(typeof v.robot_code=="string"?v.robot_code:typeof _?.robot_code=="string"?_.robot_code:""),[N,G]=f.useState(""),[Y,U]=f.useState("ready"),[J,Q]=f.useState(!1),[X,se]=f.useState(null),[ne,oe]=f.useState(null),ee=typeof _?.stream_status=="string"?_.stream_status:void 0,le=d?.lastEventAt??(typeof _?.last_event_at=="string"?_.last_event_at:void 0),q=d?.connectionState??l.connectionState,_e=d?d.connectionState==="active"?"connected":d.connectionState??"unknown":ee??(l.connectionState==="active"?"connected":l.connectionState??"unknown"),K=d?d.workerRunning===!0||d.connectionState==="active":l.connectionState==="active"||ee==="connected",ce=f.useRef(null),O=f.useCallback(()=>(ce.current||(ce.current=new qe(a,new We(a))),ce.current),[a]),$=i.find(S=>S.id===T)??null,W=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)??null,B=$&&($.workspaceId!==l.workspaceId||$.boundWorkflowId!==l.boundWorkflowId),g=A.trim().length>0&&N.trim().length>0&&C.trim().length>0,b=f.useCallback(async S=>{if($){oe(null),se(null),S?U("saving"):Q(!0);try{if(B&&await p({id:l.id,channelId:l.channelId,name:l.name,workspaceId:$.workspaceId,boundWorkflowId:$.boundWorkflowId,appType:l.appType,description:l.description}),g){const V=B?$.workspaceId:l.workspaceId,de=await O().connectChannel(V,l.id,{client_id:A.trim(),client_secret:N.trim(),robot_code:C.trim(),connection_mode:"stream"});G("");const he=de.setupData?.stream_status}u?.(),S?(U("saved"),setTimeout(()=>m(),1200)):(U("ready"),se(g?"Stream worker restarted — credentials accepted.":"Agent binding updated."))}catch(V){oe(V instanceof Error?V.message:"Update failed. Please try again."),U("error"),se(null)}finally{S||Q(!1)}}},[$,B,g,l,p,O,A,N,C,u,m]),y=f.useCallback(async S=>{S.preventDefault(),await b(!0)},[b]),R=Y==="saving",E=!!$&&(!!B||g)&&!R&&!J,P=S=>{if(!S)return"—";const V=new Date(S);return Number.isNaN(V.getTime())?S:V.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})};return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):Y==="saved"?n.jsxs("div",{className:"cheng-dt-edit__success",children:[n.jsx("div",{className:"cheng-dt-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-dt-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",g?"reconfigured — stream worker restarted":"updated","."]}),n.jsx("style",{children:Cd})]}):n.jsxs("form",{className:"cheng-dt-edit",onSubmit:y,children:[ne&&n.jsxs("div",{className:"cheng-dt-edit__error-banner",children:[n.jsx("span",{children:ne}),n.jsx("button",{type:"button",className:"cheng-dt-edit__retry-btn",onClick:()=>{U("ready"),oe(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-edit__stream-info",children:[n.jsxs("div",{className:"cheng-dt-edit__stream-info-header",children:[n.jsx("div",{className:"cheng-dt-edit__stream-info-label",children:"Stream Mode"}),n.jsxs("div",{className:"cheng-dt-edit__stream-status-row",children:[n.jsx("span",{className:`cheng-dt-edit__status-dot ${K?"cheng-dt-edit__status-dot--active":q==="error"||ee==="error"?"cheng-dt-edit__status-dot--error":"cheng-dt-edit__status-dot--idle"}`}),n.jsx("span",{className:"cheng-dt-edit__stream-status-text",children:_e})]})]}),le&&n.jsxs("div",{className:"cheng-dt-edit__stream-meta",children:["Last event: ",n.jsx("strong",{children:P(le)})]}),d?.lastError&&n.jsx("div",{className:"cheng-dt-edit__stream-warn cheng-dt-edit__stream-warn--error",children:d.lastError}),q==="degraded"&&!d?.lastError&&n.jsxs("div",{className:"cheng-dt-edit__stream-warn",children:["Worker stopped unexpectedly. Provide credentials below and click"," ",n.jsx("strong",{children:"Save & Reconnect"})," to restart the stream."]})]}),n.jsxs("div",{className:"cheng-dt-edit__grid",children:[n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("select",{className:"cheng-dt-edit__input cheng-dt-edit__input--select",value:T,onChange:S=>H(S.target.value),disabled:R,required:!0,children:i.map(S=>n.jsx("option",{value:S.id,children:S.name},S.id))}),B&&$&&n.jsxs("div",{className:"cheng-dt-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:W?.name??"current agent"})," to"," ",n.jsx("strong",{children:$.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client ID"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration. Update only if the app changed."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:A,onChange:S=>re(S.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:R,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Robot Code"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:C,onChange:S=>F(S.target.value),placeholder:"dingxxxxxx",disabled:R,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client Secret"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Leave blank to keep the existing secret. Fill to rotate credentials or restart the stream."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("input",{className:"cheng-dt-edit__input cheng-dt-edit__input--token",type:"password",value:N,onChange:S=>G(S.target.value),placeholder:"(leave blank to keep current)",disabled:R,autoComplete:"off"}),X&&n.jsx("div",{className:"cheng-dt-edit__test-ok",children:X}),n.jsx("div",{className:"cheng-dt-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--secondary",disabled:!g||!$||R||J,onClick:()=>{b(!1)},children:J?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner cheng-dt-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]})]}),!g&&n.jsxs("div",{className:"cheng-dt-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Client ID + Client Secret + Robot Code to restart the stream worker. Leave them blank to only update the agent."]}),n.jsxs("div",{className:"cheng-dt-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--ghost",onClick:w,disabled:R,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-edit__btn cheng-dt-edit__btn--connect",disabled:!E,children:R?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner"}),"Saving..."]}):g?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:Cd})]})}const Cd=`
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
`,uf=1,pf="flowchat/host-setup-request",hf="FCSETUP1.";class $r extends Error{constructor(i){super(i),this.name="FlowChatCodeError"}}function ff(l){const i=l.replace(/-/g,"+").replace(/_/g,"/");let a;try{a=atob(i)}catch{throw new $r("Code payload is not valid base64.")}const d=Uint8Array.from(a,p=>p.charCodeAt(0));return new TextDecoder().decode(d)}function gf(l,i,a){const d=i.trim();if(!d.startsWith(l))throw new $r(`Not a ${a} code — it should start with ${l}`);try{return JSON.parse(ff(d.slice(l.length)))}catch(p){throw p instanceof $r?p:new $r(`The ${a} code payload is not valid JSON.`)}}function mf(l){const i=gf(hf,l,"FlowChat setup");if(i.kind!==pf||i.v!==uf||typeof i.setup_id!="string"||typeof i.signature!="string")throw new $r("This is not a FlowChat host setup request code.");return i}function xf(l,i=new Date){const a=Date.parse(l.expires_at);return Number.isFinite(a)?i.getTime()>=a:!0}function _f(l){return l.identity_public_key.slice(0,12)}async function bf(l,i,a=8e3){const d=l.replace(/\/+$/,""),p=new AbortController,u=setTimeout(()=>p.abort(),a);try{const m=await fetch(`${d}/v1/setup/import`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({package:i}),signal:p.signal});if(!m.ok){const v=await m.text().catch(()=>"");throw new Error(`Host rejected the package (${m.status}): ${v.slice(0,200)}`)}const w=await m.json().catch(()=>null);return w?.receipt??w}finally{clearTimeout(u)}}const da={allowAttachments:!1,maxRequestBytes:1048576,allowStructuredHandoff:!0,maxConcurrency:2,executionTimeoutSeconds:600};function Ld({value:l,onChange:i,disabled:a=!1}){const d=(p,u,m)=>w=>i({...l,[p]:Math.min(m,Math.max(u,Number(w.target.value)||u))});return n.jsxs("fieldset",{className:"cheng-fc-policy",disabled:a,children:[n.jsx("legend",{children:"Workflow policy"}),n.jsxs("label",{children:[n.jsx("input",{type:"checkbox",checked:l.allowAttachments,onChange:p=>i({...l,allowAttachments:p.target.checked})})," Allow attachment references"]}),n.jsxs("label",{children:[n.jsx("input",{type:"checkbox",checked:l.allowStructuredHandoff,onChange:p=>i({...l,allowStructuredHandoff:p.target.checked})})," Allow structured Agent handoff"]}),n.jsxs("label",{children:["Maximum request bytes",n.jsx("input",{"aria-label":"Maximum request bytes",type:"number",min:1024,max:104857600,value:l.maxRequestBytes,onChange:d("maxRequestBytes",1024,104857600)})]}),n.jsxs("label",{children:["Maximum concurrency",n.jsx("input",{"aria-label":"Maximum concurrency",type:"number",min:1,max:32,value:l.maxConcurrency,onChange:d("maxConcurrency",1,32)})]}),n.jsxs("label",{children:["Execution timeout (seconds)",n.jsx("input",{"aria-label":"Execution timeout",type:"number",min:10,max:86400,value:l.executionTimeoutSeconds,onChange:d("executionTimeoutSeconds",10,86400)})]}),n.jsx("p",{children:"These limits are persisted as non-secret channel policy and enforced by the FlowChat execution owner before workflow invocation."}),n.jsx("style",{children:".cheng-fc-policy{display:grid;gap:9px;border:1px solid #d1cfc5;border-radius:9px;padding:12px}.cheng-fc-policy legend{font-size:12px;font-weight:700}.cheng-fc-policy label{display:flex;gap:8px;align-items:center;font-size:12px}.cheng-fc-policy input[type=number]{margin-left:auto;width:120px;padding:6px}.cheng-fc-policy p{margin:0;color:#87867f;font-size:11px}"})]})}function wf(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"flowchat-agent"}function yf(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function vf({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:u,onCancel:m}){const[w,v]=f.useState("ready"),[_,z]=f.useState(""),[T,H]=f.useState(()=>l[0]?.id??""),[A,re]=f.useState(""),[C,F]=f.useState(null),[N,G]=f.useState(null),[Y,U]=f.useState(null),[J,Q]=f.useState(null),[X,se]=f.useState(null),[ne,oe]=f.useState(!1),[ee,le]=f.useState(!1),[q,_e]=f.useState("lan_host"),[K,ce]=f.useState(da),O=f.useRef(null),$=f.useCallback(()=>(O.current||(O.current=new qe(a,new We(a))),O.current),[a]),W=l.find(V=>V.id===T)??null,B=f.useMemo(()=>{const V=A.trim();if(!V)return null;try{const de=mf(V);return{request:de,expired:xf(de)}}catch(de){return{parseError:de instanceof Error?de.message:"Unrecognized code."}}},[A]),g=B&&"request"in B?B.request:null,b=B&&"request"in B?B.expired:!1,y=B&&"parseError"in B?B.parseError:null,R=f.useCallback(async V=>{if(V.preventDefault(),!(!_.trim()||!g||b||!W)){F(null),v("connecting");try{const de=wf(_),ge=await i({name:_.trim(),channelId:de,workspaceId:W.workspaceId,boundWorkflowId:W.boundWorkflowId,appType:"flowchat",description:`FlowChat platform link for agent: ${W.name}`});ge.channelId!==de&&le(!0);const he=await $().createFlowChatHandoff(ge.workspaceId,{name:`${_.trim()} (FlowChat)`,channelId:ge.channelId,executionMode:q,setupRequest:g,chengflowBaseUrl:typeof window<"u"?window.location.origin:void 0});U(he);let Te="manual";if(he.hostEndpoint)try{await bf(he.hostEndpoint,he.package),Te="lan"}catch(D){se(D instanceof Error?D.message:String(D))}Q(Te);const He={...ge.connectionConfig??{},flowchat_host_device_id:he.hostDeviceId,flowchat_host_endpoint:he.hostEndpoint,flowchat_key_id:he.keyId,flowchat_setup_id:he.setupId,flowchat_delivery:Te,flowchat_host_name:g.host_name,flowchat_host_platform:g.platform,flowchat_execution_mode:q,flowchat_policy:K,flowchat_connected_at:new Date().toISOString()};let ye={...ge,connectionConfig:He};try{ye=await $().updateChannel({id:ge.id,workspaceId:ge.workspaceId,channelId:ge.channelId,name:ge.name,boundWorkflowId:ge.boundWorkflowId,appType:ge.appType,description:ge.description,connectionConfig:He})}catch(D){console.warn("Failed to persist FlowChat handoff metadata",D)}G(ye),v("connected"),p?.(),d(ye)}catch(de){F(de instanceof Error?de.message:"Pairing failed. Generate a fresh setup code on the host and try again."),v("error")}}},[_,g,b,W,q,K,i,$,d,p]),E=f.useCallback(async()=>{if(Y)try{await navigator.clipboard.writeText(Y.code),oe(!0)}catch{oe(!1)}},[Y]);if(l.length===0)return n.jsxs("div",{className:"cheng-fc-form__no-agents",children:[n.jsx("div",{className:"cheng-fc-form__no-agents-icon",children:"🌊"}),n.jsx("h3",{className:"cheng-fc-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-fc-form__no-agents-desc",children:"Create an agent first, then come back to link it into FlowChat. An agent defines which workflow processes incoming messages."}),u&&n.jsx("button",{type:"button",className:"cheng-fc-form__btn cheng-fc-form__btn--secondary",onClick:u,children:"Go to Agents"}),n.jsx("style",{children:ca})]});if(w==="connected"&&N&&Y)return n.jsxs("div",{className:"cheng-fc-form__success",children:[n.jsx("div",{className:"cheng-fc-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-fc-form__success-title",children:J==="lan"?"FlowChat Paired!":"Key Sealed — Deliver to Host"}),n.jsxs("p",{className:"cheng-fc-form__success-desc",children:[ee&&n.jsxs("span",{className:"cheng-fc-form__existing-note",children:["An existing integration was found and re-paired."," "]}),n.jsx("strong",{children:N.name})," minted key"," ",n.jsxs("code",{children:[Y.keyId.slice(0,8),"…"]})," sealed to host"," ",n.jsx("strong",{children:Y.hostDeviceId}),W&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:W.name})]}),"."]}),J==="lan"?n.jsxs("div",{className:"cheng-fc-form__delivered-notice",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("polyline",{points:"8 12 11 15 16 9"})]}),"The sealed package was delivered to the host over the LAN and imported into its vault. The key never left the host in plaintext."]}):n.jsxs("div",{className:"cheng-fc-form__manual-block",children:[n.jsxs("p",{className:"cheng-fc-form__manual-hint",children:[X?`Automatic delivery failed (${X}). `:"The host did not publish a reachable LAN endpoint. ","Copy this sealed code and paste it into the FlowChat host app (Import sealed credential). Only that device can open it."]}),n.jsx("textarea",{className:"cheng-fc-form__seal-code",readOnly:!0,rows:4,value:Y.code}),n.jsx("button",{type:"button",className:"cheng-fc-form__btn cheng-fc-form__btn--secondary",onClick:E,children:ne?"Copied ✓":"Copy sealed code"})]}),n.jsx("p",{className:"cheng-fc-form__success-hint",children:"Your integration is listed in Connected Integrations above. Use Manage to view connection details or revoke the key."}),n.jsx("style",{children:ca})]});const P=w==="connecting",S=_.trim().length>0&&!!g&&!b&&!!W&&!P;return n.jsxs("form",{className:"cheng-fc-form",onSubmit:R,children:[n.jsxs("div",{className:"cheng-fc-form__instructions",children:[n.jsx("p",{className:"cheng-fc-form__instructions-title",children:"How to pair a FlowChat host"}),n.jsxs("ol",{className:"cheng-fc-form__steps",children:[n.jsxs("li",{children:["Open the ",n.jsx("strong",{children:"FlowChat desktop client"})," on the device that will own the connection"]}),n.jsxs("li",{children:["In Host Mode, click ",n.jsx("code",{children:"Generate setup code"})]}),n.jsxs("li",{children:["Copy the ",n.jsx("code",{children:"FCSETUP1."})," code and paste it below (codes expire after ~10 minutes and are single-use)"]})]})]}),C&&n.jsxs("div",{className:"cheng-fc-form__error-banner",children:[n.jsx("span",{children:C}),n.jsx("button",{type:"button",className:"cheng-fc-form__retry-btn",onClick:()=>{v("ready"),F(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsxs("label",{className:"cheng-fc-form__label",htmlFor:"fc-name",children:["Integration Name ",n.jsx("span",{className:"cheng-fc-form__required",children:"*"})]}),n.jsx("input",{id:"fc-name",className:"cheng-fc-form__input",type:"text",value:_,onChange:V=>z(V.target.value),placeholder:"Team FlowChat",disabled:P,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-fc-form__hint",children:"A display name for this FlowChat integration"})]}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsxs("label",{className:"cheng-fc-form__label",htmlFor:"fc-agent",children:["Agent ",n.jsx("span",{className:"cheng-fc-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-fc-form__agent-select-wrap",children:n.jsx("select",{id:"fc-agent",className:"cheng-fc-form__input cheng-fc-form__input--select",value:T,onChange:V=>H(V.target.value),disabled:P,required:!0,children:l.map(V=>n.jsxs("option",{value:V.id,children:[yf(V)," ",V.name]},V.id))})}),W&&n.jsxs("span",{className:"cheng-fc-form__hint",children:["FlowChat messages will be handled by ",n.jsx("strong",{children:W.name}),W.description?` — ${W.description}`:""]})]}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsx("label",{className:"cheng-fc-form__label",htmlFor:"fc-execution-mode",children:"Execution owner"}),n.jsxs("select",{id:"fc-execution-mode",className:"cheng-fc-form__input",value:q,onChange:V=>_e(V.target.value),disabled:P,children:[n.jsx("option",{value:"lan_host",children:"LAN Host Device"}),n.jsx("option",{value:"coordinator_direct",children:"Hosted Coordinator (direct engine)"}),n.jsx("option",{value:"device_bridge",children:"Hosted Coordinator + Device Bridge"})]}),n.jsx("span",{className:"cheng-fc-form__hint",children:"Paste the signed setup identity issued by the selected Host, Coordinator KMS, or authorized bridge device."})]}),n.jsx(Ld,{value:K,onChange:ce,disabled:P}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsxs("label",{className:"cheng-fc-form__label",htmlFor:"fc-setup-code",children:["Host Setup Code ",n.jsx("span",{className:"cheng-fc-form__required",children:"*"}),n.jsx("span",{className:"cheng-fc-form__label-hint",children:" (from the FlowChat host app)"})]}),n.jsx("textarea",{id:"fc-setup-code",className:"cheng-fc-form__input cheng-fc-form__input--code",value:A,onChange:V=>re(V.target.value),placeholder:"FCSETUP1.…",rows:4,disabled:P,required:!0,autoComplete:"off",spellCheck:!1}),y&&n.jsx("span",{className:"cheng-fc-form__hint cheng-fc-form__hint--error",children:y}),g&&n.jsxs("div",{className:"cheng-fc-form__host-card"+(b?" cheng-fc-form__host-card--expired":""),"data-testid":"fc-host-card",children:[n.jsxs("div",{className:"cheng-fc-form__host-line",children:[n.jsx("strong",{children:g.host_name})," · ",g.platform," · device ",n.jsx("code",{children:g.host_device_id})]}),n.jsxs("div",{className:"cheng-fc-form__host-line",children:["identity ",n.jsxs("code",{children:[_f(g),"…"]}),g.endpoint?n.jsxs(n.Fragment,{children:[" · LAN delivery via ",n.jsx("code",{children:g.endpoint})]}):n.jsx(n.Fragment,{children:" · manual delivery only"})]}),n.jsx("div",{className:"cheng-fc-form__host-line",children:b?"⚠ This code has expired — generate a fresh one on the host.":`Expires ${new Date(g.expires_at).toLocaleTimeString()} · signature verified on submit`})]})]}),n.jsxs("div",{className:"cheng-fc-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-fc-form__btn cheng-fc-form__btn--ghost",onClick:m,disabled:P,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-fc-form__btn cheng-fc-form__btn--connect",disabled:!S,children:P?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-fc-form__btn-spinner"}),"Pairing..."]}):"Pair FlowChat"})]}),n.jsx("style",{children:ca})]})}const ca=`
  .cheng-fc-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  /* No-agents empty state */
  .cheng-fc-form__no-agents {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }

  .cheng-fc-form__no-agents-icon {
    font-size: 32px;
    line-height: 1;
  }

  .cheng-fc-form__no-agents-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-fc-form__no-agents-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.55;
    max-width: 420px;
  }

  /* Success state */
  .cheng-fc-form__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0;
  }

  .cheng-fc-form__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #5b6ee118;
    color: #4353c4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cheng-fc-form__success-title {
    margin: 0;
    font-family: "Anthropic Serif", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-fc-form__success-desc {
    margin: 0;
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-fc-form__existing-note {
    color: #b8860b;
  }

  .cheng-fc-form__success-hint {
    margin: 0;
    font-size: 12px;
    color: #87867f;
    line-height: 1.4;
  }

  .cheng-fc-form__delivered-notice {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 13px;
    background: #5b6ee110;
    border: 1px solid #5b6ee130;
    border-radius: 8px;
    font-size: 12px;
    color: #4353c4;
    line-height: 1.5;
  }

  .cheng-fc-form__delivered-notice svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .cheng-fc-form__manual-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .cheng-fc-form__manual-hint {
    margin: 0;
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-fc-form__seal-code {
    width: 100%;
    box-sizing: border-box;
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    border: 1px solid #d1cfc5;
    border-radius: 8px;
    padding: 8px 10px;
    background: #faf9f5;
    color: #141413;
    resize: vertical;
  }

  /* Instructions box */
  .cheng-fc-form__instructions {
    background: #5b6ee10d;
    border: 1px solid #5b6ee125;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .cheng-fc-form__instructions-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    color: #5b6ee1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .cheng-fc-form__steps {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cheng-fc-form__steps li {
    font-size: 13px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-fc-form__steps code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 12px;
    background: #e8e6dc;
    padding: 1px 5px;
    border-radius: 4px;
    color: #141413;
  }

  /* Error banner */
  .cheng-fc-form__error-banner {
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

  .cheng-fc-form__retry-btn {
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

  .cheng-fc-form__retry-btn:hover {
    background: #b5333312 !important;
    border-color: #b53333 !important;
    color: #b53333 !important;
  }

  /* Fields */
  .cheng-fc-form__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cheng-fc-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-fc-form__required {
    color: #b53333;
    margin-left: 1px;
  }

  .cheng-fc-form__label-hint {
    font-weight: 400;
    color: #87867f;
  }

  .cheng-fc-form__input {
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

  .cheng-fc-form__input:focus {
    border-color: #5b6ee1;
    box-shadow: 0 0 0 3px rgba(91, 110, 225, 0.12);
  }

  .cheng-fc-form__input:disabled {
    background: #f5f4ed;
    color: #87867f;
    cursor: not-allowed;
  }

  .cheng-fc-form__input--select {
    appearance: auto;
    cursor: pointer;
  }

  .cheng-fc-form__input--code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    letter-spacing: 0.02em;
    resize: vertical;
  }

  .cheng-fc-form__agent-select-wrap {
    position: relative;
  }

  .cheng-fc-form__hint {
    font-size: 11px;
    color: #87867f;
    line-height: 1.3;
  }

  .cheng-fc-form__hint strong {
    color: #5e5d59;
  }

  .cheng-fc-form__hint--error {
    color: #b53333;
  }

  /* Parsed host identity card */
  .cheng-fc-form__host-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 13px;
    background: #5b6ee10a;
    border: 1px solid #5b6ee128;
    border-radius: 8px;
  }

  .cheng-fc-form__host-card--expired {
    background: #b5333308;
    border-color: #b5333330;
  }

  .cheng-fc-form__host-line {
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.45;
    word-break: break-all;
  }

  .cheng-fc-form__host-line code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    background: #e8e6dc;
    padding: 0 4px;
    border-radius: 4px;
    color: #141413;
  }

  /* Footer & buttons */
  .cheng-fc-form__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
  }

  .cheng-fc-form__btn {
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

  .cheng-fc-form__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* FlowChat indigo — doubled selector beats .cheng-shell button { !important } */
  .cheng-fc-form .cheng-fc-form__btn--connect,
  .cheng-fc-form__success .cheng-fc-form__btn--connect {
    background: #5b6ee1 !important;
    color: #ffffff !important;
    border: none !important;
  }

  .cheng-fc-form .cheng-fc-form__btn--connect:hover:not(:disabled) {
    background: #4353c4 !important;
    border-color: #4353c4 !important;
  }

  .cheng-fc-form .cheng-fc-form__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }

  .cheng-fc-form .cheng-fc-form__btn--ghost:hover:not(:disabled) {
    background: #f0eee6 !important;
    color: #141413 !important;
    border-color: #d1cfc5 !important;
  }

  .cheng-fc-form .cheng-fc-form__btn--secondary,
  .cheng-fc-form__no-agents .cheng-fc-form__btn--secondary,
  .cheng-fc-form__success .cheng-fc-form__btn--secondary {
    background: #f0eee6 !important;
    color: #141413 !important;
    border: 1px solid #d1cfc5 !important;
    padding: 9px 16px;
    font-weight: 500;
  }

  .cheng-fc-form .cheng-fc-form__btn--secondary:hover:not(:disabled),
  .cheng-fc-form__success .cheng-fc-form__btn--secondary:hover:not(:disabled) {
    background: #e8e6dc !important;
    color: #141413 !important;
  }

  .cheng-fc-form__btn-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: cheng-fc-spin 0.65s linear infinite;
    flex-shrink: 0;
  }

  @keyframes cheng-fc-spin {
    to { transform: rotate(360deg); }
  }
`;function kf({channel:l,apiBaseUrl:i,onRotate:a,onDisconnected:d}){const p=f.useRef(),[u,m]=f.useState(null),[w,v]=f.useState(!1),[_,z]=f.useState(null),T=f.useMemo(()=>l.connectionConfig??{},[l]),H=C=>typeof T[C]=="string"?String(T[C]):"",A=f.useCallback(()=>p.current??(p.current=new qe(i,new We(i))),[i]);f.useEffect(()=>{A().listChannelKeys(l.workspaceId).then(C=>m(C.find(F=>F.id===H("flowchat_key_id"))??null)).catch(C=>z(String(C)))},[A,l.workspaceId,T]);const re=async()=>{if(confirm("Disconnect FlowChat and revoke its channel credential?")){v(!0),z(null);try{const C=H("flowchat_key_id");C&&await A().deleteChannelKey(l.workspaceId,C),await A().disconnectChannel(l.workspaceId,l.channelId),d?.()}catch(C){z(String(C))}finally{v(!1)}}};return n.jsxs("section",{className:"cheng-fc-connection",children:[n.jsx("h4",{children:"Platform connection"}),_&&n.jsx("p",{role:"alert",children:_}),n.jsxs("dl",{children:[n.jsx("dt",{children:"Execution owner"}),n.jsx("dd",{children:H("flowchat_execution_mode")||"lan_host"}),n.jsx("dt",{children:"Endpoint identity"}),n.jsx("dd",{children:H("flowchat_host_name")||H("flowchat_host_device_id")||"Unknown"}),n.jsx("dt",{children:"Credential"}),n.jsx("dd",{children:u?`active · ${u.id.slice(0,8)}…`:"revoked or unavailable"}),n.jsx("dt",{children:"Connected"}),n.jsx("dd",{children:H("flowchat_connected_at")?new Date(H("flowchat_connected_at")).toLocaleString():"Unknown"}),n.jsx("dt",{children:"Last connection"}),n.jsx("dd",{children:u?.lastUsedAt?new Date(u.lastUsedAt).toLocaleString():"Never"}),n.jsx("dt",{children:"Usage"}),n.jsxs("dd",{children:[u?.useCount??0," authenticated requests"]})]}),n.jsxs("div",{children:[n.jsx("button",{type:"button",onClick:a,disabled:w||!u,children:"Rotate credential…"}),n.jsx("button",{type:"button",onClick:()=>{re()},disabled:w,children:"Disconnect"})]}),n.jsx("style",{children:".cheng-fc-connection{border:1px solid #d1cfc5;border-radius:9px;padding:12px}.cheng-fc-connection h4{margin:0 0 8px}.cheng-fc-connection dl{display:grid;grid-template-columns:130px 1fr;font-size:12px;gap:5px}.cheng-fc-connection dt{color:#87867f}.cheng-fc-connection dd{margin:0;word-break:break-all}.cheng-fc-connection div{display:flex;gap:8px}"})]})}function jf({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:u,onCancel:m}){const[w,v]=f.useState("ready"),[_,z]=f.useState(l.name),[T,H]=f.useState(()=>i.find(b=>b.boundWorkflowId===l.boundWorkflowId)?.id??i[0]?.id??""),[A,re]=f.useState(null),[C,F]=f.useState(!1),[N,G]=f.useState(!1),[Y,U]=f.useState(!1),[J,Q]=f.useState(()=>{const g=l.connectionConfig?.flowchat_policy;return g&&typeof g=="object"?{...da,...g}:da}),X=f.useRef(null),se=f.useCallback(()=>(X.current||(X.current=new qe(a,new We(a))),X.current),[a]),ne=f.useMemo(()=>l.connectionConfig??{},[l.connectionConfig]),oe=g=>typeof ne[g]=="string"&&ne[g].trim()?ne[g]:void 0,ee=oe("flowchat_host_name"),le=oe("flowchat_host_device_id"),q=oe("flowchat_host_platform"),_e=oe("flowchat_host_endpoint"),K=oe("flowchat_key_id"),ce=oe("flowchat_delivery"),O=i.find(g=>g.id===T)??null,$=f.useCallback(async g=>{if(g.preventDefault(),!!_.trim()){re(null),v("saving");try{await d({id:l.id,workspaceId:l.workspaceId,channelId:l.channelId,name:_.trim(),boundWorkflowId:O?.boundWorkflowId??l.boundWorkflowId,appType:l.appType,description:l.description,connectionConfig:{...l.connectionConfig??{},flowchat_policy:J}}),p?.(),u()}catch(b){re(b instanceof Error?b.message:"Failed to save changes."),v("error")}}},[_,O,l,J,d,p,u]),W=f.useCallback(async()=>{if(K){re(null),v("revoking");try{await se().deleteChannelKey(l.workspaceId,K),F(!0),G(!1),v("ready"),p?.()}catch(g){re(g instanceof Error?g.message:"Failed to revoke the key."),v("error")}}},[K,l.workspaceId,se,p]),B=w==="saving"||w==="revoking";return n.jsxs("form",{className:"cheng-fc-edit",onSubmit:$,children:[A&&n.jsxs("div",{className:"cheng-fc-edit__error-banner",children:[n.jsx("span",{children:A}),n.jsx("button",{type:"button",className:"cheng-fc-edit__retry-btn",onClick:()=>{v("ready"),re(null)},children:"Dismiss"})]}),n.jsx(kf,{channel:l,apiBaseUrl:a,onRotate:()=>U(!0),onDisconnected:()=>{F(!0),p?.()}}),Y&&n.jsxs("div",{className:"cheng-fc-edit__info",children:[n.jsx("strong",{children:"Replacement-first rotation"}),n.jsx("p",{className:"cheng-fc-edit__info-hint",children:"Generate a fresh signed setup code for the same execution owner, then use Add Integration to import and confirm the replacement. The old key remains valid during this rollback window; revoke it only after the signed import succeeds."}),n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--ghost",onClick:()=>U(!1),children:"Close"})]}),n.jsxs("div",{className:"cheng-fc-edit__info",children:[n.jsx("p",{className:"cheng-fc-edit__info-title",children:"Sealed connection"}),n.jsxs("dl",{className:"cheng-fc-edit__info-grid",children:[n.jsx("dt",{children:"Host"}),n.jsxs("dd",{children:[ee??"—",q?` (${q})`:""]}),n.jsx("dt",{children:"Host device"}),n.jsx("dd",{children:n.jsx("code",{children:le??"unknown"})}),n.jsx("dt",{children:"LAN endpoint"}),n.jsx("dd",{children:_e?n.jsx("code",{children:_e}):"manual delivery"}),n.jsx("dt",{children:"Channel key"}),n.jsxs("dd",{children:[K?n.jsxs("code",{children:[K.slice(0,8),"…"]}):"unknown",C&&n.jsx("span",{className:"cheng-fc-edit__revoked-tag",children:" revoked"})]}),n.jsx("dt",{children:"Delivery"}),n.jsx("dd",{children:ce==="lan"?"LAN auto-delivery":ce==="manual"?"manual code":"—"})]}),n.jsx("p",{className:"cheng-fc-edit__info-hint",children:"The key exists only in the host device's vault. To rotate it, revoke below and pair again with a fresh setup code from the host."})]}),n.jsx(Ld,{value:J,onChange:Q,disabled:B}),n.jsxs("div",{className:"cheng-fc-edit__field",children:[n.jsx("label",{className:"cheng-fc-edit__label",htmlFor:"fc-edit-name",children:"Integration Name"}),n.jsx("input",{id:"fc-edit-name",className:"cheng-fc-edit__input",type:"text",value:_,onChange:g=>z(g.target.value),disabled:B,required:!0})]}),i.length>0&&n.jsxs("div",{className:"cheng-fc-edit__field",children:[n.jsx("label",{className:"cheng-fc-edit__label",htmlFor:"fc-edit-agent",children:"Agent"}),n.jsx("select",{id:"fc-edit-agent",className:"cheng-fc-edit__input cheng-fc-edit__input--select",value:T,onChange:g=>H(g.target.value),disabled:B,children:i.map(g=>n.jsx("option",{value:g.id,children:g.name},g.id))}),O&&n.jsxs("span",{className:"cheng-fc-edit__hint",children:["FlowChat messages will be handled by ",n.jsx("strong",{children:O.name})]})]}),K&&!C&&n.jsxs("div",{className:"cheng-fc-edit__danger",children:[n.jsx("p",{className:"cheng-fc-edit__danger-title",children:"Revoke channel key"}),n.jsxs("p",{className:"cheng-fc-edit__danger-desc",children:["Immediately invalidates key ",n.jsxs("code",{children:[K.slice(0,8),"…"]})," on the host. The host keeps its vault entry but ChengFlow will reject it."]}),N?n.jsxs("div",{className:"cheng-fc-edit__danger-actions",children:[n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--danger",onClick:W,disabled:B,children:w==="revoking"?"Revoking…":"Confirm revoke"}),n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--ghost",onClick:()=>G(!1),disabled:B,children:"Keep key"})]}):n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--danger-outline",onClick:()=>G(!0),disabled:B,children:"Revoke key…"})]}),n.jsxs("div",{className:"cheng-fc-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--ghost",onClick:m,disabled:B,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-fc-edit__btn cheng-fc-edit__btn--primary",disabled:B||!_.trim(),children:w==="saving"?"Saving…":"Save changes"})]}),n.jsx("style",{children:Sf})]})}const Sf=`
  .cheng-fc-edit {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: "Anthropic Sans", "Inter", Arial, sans-serif;
  }

  .cheng-fc-edit__error-banner {
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

  .cheng-fc-edit__retry-btn {
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

  .cheng-fc-edit__info {
    background: #5b6ee10a;
    border: 1px solid #5b6ee128;
    border-radius: 10px;
    padding: 13px 15px;
  }

  .cheng-fc-edit__info-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    color: #5b6ee1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .cheng-fc-edit__info-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 14px;
    margin: 0;
  }

  .cheng-fc-edit__info-grid dt {
    font-size: 12px;
    color: #87867f;
  }

  .cheng-fc-edit__info-grid dd {
    margin: 0;
    font-size: 12px;
    color: #141413;
    word-break: break-all;
  }

  .cheng-fc-edit__info-grid code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    background: #e8e6dc;
    padding: 0 4px;
    border-radius: 4px;
  }

  .cheng-fc-edit__info-hint {
    margin: 8px 0 0;
    font-size: 11px;
    color: #87867f;
    line-height: 1.45;
  }

  .cheng-fc-edit__revoked-tag {
    color: #b53333;
    font-weight: 600;
    font-size: 11px;
  }

  .cheng-fc-edit__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cheng-fc-edit__label {
    font-size: 13px;
    font-weight: 500;
    color: #141413;
  }

  .cheng-fc-edit__input {
    padding: 9px 12px;
    border: 1px solid #d1cfc5;
    border-radius: 8px;
    font-size: 13px;
    background: #faf9f5;
    color: #141413;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }

  .cheng-fc-edit__input:focus {
    border-color: #5b6ee1;
    box-shadow: 0 0 0 3px rgba(91, 110, 225, 0.12);
  }

  .cheng-fc-edit__input--select {
    appearance: auto;
    cursor: pointer;
  }

  .cheng-fc-edit__hint {
    font-size: 11px;
    color: #87867f;
  }

  .cheng-fc-edit__hint strong {
    color: #5e5d59;
  }

  .cheng-fc-edit__danger {
    border: 1px solid #b5333328;
    border-radius: 10px;
    padding: 13px 15px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .cheng-fc-edit__danger-title {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: #b53333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .cheng-fc-edit__danger-desc {
    margin: 0;
    font-size: 12px;
    color: #5e5d59;
    line-height: 1.5;
  }

  .cheng-fc-edit__danger-desc code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 11px;
    background: #e8e6dc;
    padding: 0 4px;
    border-radius: 4px;
  }

  .cheng-fc-edit__danger-actions {
    display: flex;
    gap: 8px;
  }

  .cheng-fc-edit__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .cheng-fc-edit__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cheng-fc-edit .cheng-fc-edit__btn--primary {
    background: #5b6ee1 !important;
    color: #ffffff !important;
    border: none !important;
  }

  .cheng-fc-edit .cheng-fc-edit__btn--primary:hover:not(:disabled) {
    background: #4353c4 !important;
  }

  .cheng-fc-edit .cheng-fc-edit__btn--ghost {
    background: transparent !important;
    color: #5e5d59 !important;
    border: 1px solid #d1cfc5 !important;
    font-weight: 500;
  }

  .cheng-fc-edit .cheng-fc-edit__btn--danger {
    background: #b53333 !important;
    color: #ffffff !important;
    border: none !important;
  }

  .cheng-fc-edit .cheng-fc-edit__btn--danger-outline {
    align-self: flex-start;
    background: transparent !important;
    color: #b53333 !important;
    border: 1px solid #b53333 !important;
    font-weight: 500;
  }

  .cheng-fc-edit__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 2px;
  }
`;function Sn({title:l,description:i,icon:a,iconLabel:d,iconColor:p,onClose:u,children:m}){return n.jsx("div",{className:"cheng-page__dialog-overlay",onClick:u,children:n.jsxs("div",{className:"cheng-page__dialog",onClick:w=>w.stopPropagation(),children:[n.jsxs("div",{className:"cheng-page__dialog-header",children:[n.jsx("div",{className:"cheng-page__dialog-icon",style:{background:`${p}20`},children:n.jsx("span",{role:"img","aria-label":d,style:{fontSize:"20px"},children:a})}),n.jsxs("div",{className:"cheng-page__dialog-copy",children:[n.jsx("h2",{className:"cheng-page__form-card-title",children:l}),n.jsx("p",{className:"cheng-page__form-card-desc",children:i})]}),n.jsx("button",{type:"button",className:"cheng-page__applink-close-btn",onClick:u,children:"Close"})]}),n.jsx("div",{className:"cheng-page__dialog-body",children:m})]})})}function Cf({activePlatform:l,platforms:i,isCreateModalOpen:a,onCloseCreate:d,editingChannel:p,onCloseEdit:u,agents:m,onCreate:w,onUpdate:v,onRefresh:_,apiBaseUrl:z,onGoToAgents:T,liveStatusMap:H}){const A=p?i.find(U=>U.id===p.appType)??{id:p.appType??"custom",label:p.appType??"App",shortLabel:p.appType??"App",emoji:"⚙️",color:"#c96442",desc:""}:null,re=f.useCallback(U=>{d(),_()},[d,_]),C=f.useCallback(U=>{_()},[_]),F=f.useCallback(U=>{_()},[_]),N=f.useCallback(U=>{_()},[_]),G=f.useCallback(U=>{_()},[_]),Y=f.useCallback(U=>{_()},[_]);return n.jsxs(n.Fragment,{children:[a&&l.id==="telegram"&&n.jsx(Sn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(Vh,{agents:m,onCreate:w,apiBaseUrl:z,onPaired:re,onRefresh:_,onGoToAgents:()=>{d(),T()},onCancel:d},"telegram-pairing")}),a&&l.id==="whatsapp"&&n.jsx(Sn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(Xh,{agents:m,onCreate:w,apiBaseUrl:z,onPaired:C,onRefresh:_,onGoToAgents:()=>{d(),T()},onCancel:d},"whatsapp-pairing")}),a&&l.id==="slack"&&n.jsx(Sn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(ef,{agents:m,onCreate:w,apiBaseUrl:z,onPaired:F,onRefresh:_,onGoToAgents:()=>{d(),T()},onCancel:d},"slack-pairing")}),a&&l.id==="dingtalk"&&n.jsx(Sn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(cf,{agents:m,onCreate:w,apiBaseUrl:z,onPaired:G,onRefresh:_,onGoToAgents:()=>{d(),T()},onCancel:d},"dingtalk-pairing")}),a&&l.id==="wecom"&&n.jsx(Sn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(of,{agents:m,onCreate:w,apiBaseUrl:z,onPaired:N,onRefresh:_,onGoToAgents:()=>{d(),T()},onCancel:d},"wecom-pairing")}),a&&l.id==="flowchat"&&n.jsx(Sn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(vf,{agents:m,onCreate:w,apiBaseUrl:z,onPaired:Y,onRefresh:_,onGoToAgents:()=>{d(),T()},onCancel:d},"flowchat-pairing")}),p&&A&&n.jsxs(Sn,{title:`编辑 ${p.name}`,description:`@${p.channelId} · ${A.label}`,icon:A.emoji,iconLabel:p.appType??"app",iconColor:A.color,onClose:u,children:[p.appType==="telegram"&&n.jsx(Gh,{channel:p,agents:m,apiBaseUrl:z,onUpdate:v,onRefresh:_,onSaved:()=>{_(),u()},onCancel:u},`${p.id}-tg-edit`),p.appType==="whatsapp"&&n.jsx(Yh,{channel:p,agents:m,apiBaseUrl:z,onUpdate:v,onRefresh:_,onSaved:()=>{_(),u()},onCancel:u},`${p.id}-wa-edit`),p.appType==="slack"&&n.jsx(tf,{channel:p,agents:m,apiBaseUrl:z,onUpdate:v,onRefresh:_,onSaved:()=>{_(),u()},onCancel:u},`${p.id}-sl-edit`),p.appType==="dingtalk"&&n.jsx(df,{channel:p,agents:m,apiBaseUrl:z,liveStatus:H?.[p.id],onUpdate:v,onRefresh:_,onSaved:()=>{_(),u()},onCancel:u},`${p.id}-dt-edit`),p.appType==="flowchat"&&n.jsx(jf,{channel:p,agents:m,apiBaseUrl:z,onUpdate:v,onRefresh:_,onSaved:()=>{_(),u()},onCancel:u},`${p.id}-fc-edit`),p.appType==="wecom"&&n.jsx(sf,{channel:p,agents:m,apiBaseUrl:z,onUpdate:v,onRefresh:_,onSaved:()=>{_(),u()},onCancel:u},`${p.id}-wc-edit`)]})]})}const er=[{id:"whatsapp",label:"WhatsApp",shortLabel:"WA",emoji:"💬",color:"#25d366",desc:"Meta WhatsApp Business"},{id:"telegram",label:"Telegram",shortLabel:"TG",emoji:"✈️",color:"#2ca5e0",desc:"Telegram Bot API"},{id:"slack",label:"Slack",shortLabel:"Slack",emoji:"💼",color:"#4a154b",desc:"Slack Workspace App"},{id:"wecom",label:"WeCom",shortLabel:"WeCom",emoji:"🏢",color:"#248067",desc:"WeCom Custom App"},{id:"dingtalk",label:"DingTalk",shortLabel:"DT",emoji:"💠",color:"#1677ff",desc:"DingTalk App Bot"},{id:"flowchat",label:"FlowChat",shortLabel:"FC",emoji:"🌊",color:"#5b6ee1",desc:"FlowChat E2EE chat platform"},{id:"line",label:"LINE",shortLabel:"LINE",emoji:"🟢",color:"#00c300",desc:"LINE Messaging API"},{id:"custom",label:"Custom",shortLabel:"Custom",emoji:"⚙️",color:"#c96442",desc:"Custom integration"}];function Rd(){return n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}function Md(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M12 2l2.4 2.4H18v3.6L20.4 12 18 16v3.6h-3.6L12 22l-2.4-2.4H6V16L3.6 12 6 8V4.4h3.6z"}),n.jsx("circle",{cx:"12",cy:"12",r:"2.5"})]})}function Nf(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]})}function If(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"3"}),n.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}function Ef(){return n.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),n.jsx("polyline",{points:"16 17 21 12 16 7"}),n.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})}function Af({channels:l,activeChannel:i,activeConfig:a,isLoading:d,onSelectChannel:p,onCreateClick:u,chatWindowProps:m={}}){const w=Td(),v=oh(i?.channelId??""),[_,z]=f.useState(!1),[T,H]=f.useState([]),[A,re]=f.useState(null),C=f.useMemo(()=>i?new Ed(i.channelId):null,[i]),F=f.useCallback(()=>{if(!C){H([]),re(null);return}let X=C.listSessions();X.length===0&&(X=[C.createSession("新会话")]),H(X.map(se=>{const ne=v.filter(oe=>(oe.sessionId??oe.externalChatId)===se.id).sort((oe,ee)=>Date.parse(ee.updatedAt)-Date.parse(oe.updatedAt))[0];return ne?{...se,executionStatus:ne.clientStatus,executionStatusAt:ne.updatedAt}:se})),re(C.getActiveSessionId())},[C,v]);f.useEffect(()=>{F()},[F]),f.useEffect(()=>{if(typeof window>"u"||!i)return;const X=se=>{se.detail?.channelId===i.channelId&&F()};return window.addEventListener("cheng:session-label-updated",X),()=>{window.removeEventListener("cheng:session-label-updated",X)}},[i,F]);const N=f.useCallback(()=>{C&&(C.createSession("新会话"),F())},[F,C]),G=f.useCallback(X=>{C&&(C.setActiveSessionId(X.id),F())},[F,C]),Y=f.useCallback(X=>{C&&(w.removeSession(X),C.deleteSession(X),F())},[w,F,C]),U=f.useCallback((X,se)=>{C&&(C.renameSession(X,se),F())},[F,C]),J=f.useCallback(X=>{C&&(C.togglePinSession(X),F())},[F,C]),Q=f.useMemo(()=>A?{...a,sessionId:A}:a,[a,A]);return n.jsxs("div",{className:"cheng-shell__chat-view",children:[n.jsxs("div",{className:`cheng-shell__channel-sidebar${_?" cheng-shell__channel-sidebar--collapsed":""}`,children:[!_&&n.jsx("div",{className:"cheng-shell__channel-sidebar-content",children:n.jsx($h,{sessions:T,activeSessionId:A,onSelect:G,onCreateClick:N,onDeleteSession:Y,onRenameSession:U,onTogglePinSession:J})}),n.jsx("button",{className:"cheng-shell__channel-sidebar-toggle cheng-shell__channel-sidebar-toggle--edge",onClick:()=>z(X=>!X),type:"button","aria-label":_?"Expand agents sidebar":"Collapse agents sidebar",title:_?"Expand agents sidebar":"Collapse agents sidebar",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:_?n.jsx("path",{d:"M6 3L10 8L6 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}):n.jsx("path",{d:"M10 3L6 8L10 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),n.jsx("div",{className:"cheng-shell__chat-area",children:d&&!i?n.jsx("div",{className:"cheng-shell__placeholder",children:n.jsx("span",{className:"cheng-shell__placeholder-text",children:"Loading channels..."})}):i&&i.workspaceId?n.jsx(ph,{config:Q,children:n.jsx(Lh,{...m,channels:l,activeChannelId:i?.id??null,activeChannel:i,onSelectChannel:p})},`${i.channelId}:${i.workspaceId}`):n.jsxs("div",{className:"cheng-shell__placeholder",children:[n.jsx("div",{className:"cheng-shell__placeholder-icon",children:n.jsx(Rd,{})}),n.jsx("p",{className:"cheng-shell__placeholder-text",children:"No channels yet."}),n.jsx("button",{className:"cheng-shell__placeholder-btn",onClick:u,type:"button",children:"Create your first channel"})]})})]})}function Tf(l){if(!l)return"Unknown";const i=new Date(l);return Number.isNaN(i.getTime())?l:i.toLocaleDateString("zh-CN",{year:"numeric",month:"short",day:"numeric"})}function zf(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Lf({channels:l,onCreateClick:i,onEditClick:a,onDeleteClick:d,workspaceNames:p,workflowNames:u}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"Agents"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your agent roster, review workflow bindings, and launch any configured agent."})]}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:i,children:"Create Agent"})]}),n.jsx("div",{className:"cheng-page__content",children:l.length===0?n.jsxs("div",{className:"cheng-page__empty-card",children:[n.jsx("div",{className:"cheng-page__empty-icon",children:n.jsx(Md,{})}),n.jsx("h2",{className:"cheng-page__empty-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-page__empty-desc",children:"Create your first agent to bind a workflow and start handling conversations."}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:i,children:"Create Agent"})]}):n.jsx("div",{className:"cheng-page__channel-grid",children:l.map(m=>n.jsxs("div",{className:"cheng-page__channel-card",children:[n.jsxs("div",{className:"cheng-page__channel-card-top",children:[n.jsx("div",{className:"cheng-page__channel-card-icon",children:n.jsx("span",{className:"cheng-page__channel-card-avatar","aria-hidden":"true",children:zf(m)})}),n.jsxs("div",{className:"cheng-page__channel-card-actions",children:[n.jsx("span",{className:"cheng-page__channel-card-badge",children:m.appType||"agent"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-edit",onClick:()=>a(m),children:"Edit"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-delete",onClick:()=>{d(m)},children:"Delete"})]})]}),n.jsxs("div",{className:"cheng-page__channel-card-body",children:[n.jsx("h2",{className:"cheng-page__channel-card-title",children:m.name}),n.jsxs("p",{className:"cheng-page__channel-card-id",children:["@",m.channelId]}),n.jsx("p",{className:"cheng-page__channel-card-desc",children:m.description||"No description yet. Open chat to interact with this agent."})]}),n.jsxs("div",{className:"cheng-page__channel-card-workflow",children:[n.jsxs("span",{className:"cheng-page__channel-card-detail",title:p[m.workspaceId]?`Workspace ID: ${m.workspaceId}`:m.workspaceId,children:["Workspace: ",p[m.workspaceId]||m.workspaceId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",title:u[m.boundWorkflowId]?`Workflow ID: ${m.boundWorkflowId}`:m.boundWorkflowId,children:["Workflow: ",u[m.boundWorkflowId]||m.boundWorkflowId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",children:["Created: ",Tf(m.createdAt)]})]})]},m.id||m.channelId))})})]})}function Rf({channels:l,onCreate:i,onUpdate:a,onDelete:d,onRefresh:p,apiBaseUrl:u,onSuccess:m,onGoToAgents:w}){const[v,_]=f.useState("telegram"),[z,T]=f.useState(""),[H,A]=f.useState(!1),[re,C]=f.useState(null),[F,N]=f.useState(null),[G,Y]=f.useState({}),U=f.useRef(null),J=f.useCallback(()=>(U.current||(U.current=new qe(u,new We(u))),U.current),[u]),Q=f.useMemo(()=>new Set(["telegram","whatsapp","slack","wecom","dingtalk","flowchat"]),[]),X=f.useMemo(()=>l.filter(y=>!y.appType||y.appType==="agent"),[l]),se={degraded:0,error:1,awaiting_input:2,connecting:3,active:4,disconnected:5},ne=f.useMemo(()=>l.filter(y=>y.appType&&y.appType!=="agent").sort((y,R)=>{const E=se[y.connectionState??""]??6,P=se[R.connectionState??""]??6;return E!==P?E-P:(R.updatedAt??R.createdAt??"").localeCompare(y.updatedAt??y.createdAt??"")}),[l]);f.useEffect(()=>{er.some(R=>R.id===v)||_(ne[0]?.appType??"telegram")},[ne,v]);const oe=er.find(y=>y.id===v)??er[1],ee=f.useMemo(()=>er.map(y=>{const R=ne.filter(S=>S.appType===y.id),E=R.filter(S=>S.connectionState==="active").length,P=R.filter(S=>S.connectionState==="awaiting_input"||S.connectionState==="connecting"||S.connectionState==="configuring").length;return{platform:y,total:R.length,connectedCount:E,pendingCount:P}}),[ne]),le=f.useMemo(()=>{const y=z.trim().toLowerCase();return ne.filter(R=>R.appType!==oe.id?!1:y?[R.name,R.channelId,R.description,R.webhookUrl,R.connectionState].filter(Boolean).join(" ").toLowerCase().includes(y):!0)},[oe.id,ne,z]),q=ne.filter(y=>y.appType===oe.id).length,_e=f.useMemo(()=>Object.fromEntries(ne.map(y=>{const R=X.find(E=>E.workspaceId===y.workspaceId&&E.boundWorkflowId===y.boundWorkflowId);return[y.id,R?.name??"未绑定 Agent"]})),[X,ne]),K=f.useCallback(y=>{switch(y){case"active":return{label:"运行中",cls:"cheng-applink__badge--active"};case"degraded":return{label:"异常",cls:"cheng-applink__badge--degraded"};case"configuring":return{label:"待回调",cls:"cheng-applink__badge--configuring"};case"connecting":case"awaiting_input":return{label:"待配置",cls:"cheng-applink__badge--pending"};case"error":return{label:"失败",cls:"cheng-applink__badge--error"};case"disconnected":return{label:"已断开",cls:"cheng-applink__badge--disconnected"};default:return{label:"未配置",cls:"cheng-applink__badge--default"}}},[]),ce=f.useCallback(y=>{if(!y)return"—";const R=new Date(y);return Number.isNaN(R.getTime())?y:R.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},[]),O=f.useCallback(y=>{_(y),T("")},[]),$=f.useCallback(()=>{A(!1)},[]),W=f.useCallback(async y=>{N({channelId:y.id,action:"refresh"});try{const R=await J().getChannelStatus(y.workspaceId,y.id);Y(E=>({...E,[y.id]:R})),await p()}finally{N(null)}},[J,p]),B=f.useCallback(async y=>{if(window.confirm(`确定要暂停 ${y.name} 的连接吗？这会断开当前平台连接。`)){N({channelId:y.id,action:"pause"});try{await J().disconnectChannel(y.workspaceId,y.id),Y(E=>{const P={...E};return delete P[y.id],P}),await p()}finally{N(null)}}},[J,p]),g=f.useCallback(async y=>{N({channelId:y.id,action:"resume"});try{await J().connectChannel(y.workspaceId,y.id),Y(R=>{const E={...R};return delete E[y.id],E}),await p()}finally{N(null)}},[J,p]),b=f.useCallback(async y=>{if(window.confirm(`确定删除 ${y.name} 吗？删除后需要重新创建连接。`)){N({channelId:y.id,action:"delete"});try{await Promise.resolve(d(y.id)),Y(E=>{const P={...E};return delete P[y.id],P}),await p(),re?.id===y.id&&C(null)}finally{N(null)}}},[re?.id,d,p]);return n.jsxs("div",{className:"cheng-page cheng-applink",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"App Link 管理"}),n.jsx("p",{className:"cheng-page__subtitle",children:"管理各平台接入连接，查看运行状态，按平台筛选并操作。"})]}),n.jsxs("button",{type:"button",className:"cheng-applink__refresh-btn",onClick:()=>{p()},"aria-label":"刷新列表",title:"刷新列表",children:[n.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]}),"刷新"]})]}),n.jsxs("div",{className:"cheng-applink__body",children:[n.jsx("div",{className:"cheng-applink__platforms",children:ee.map(({platform:y,total:R,connectedCount:E})=>{const P=y.id===oe.id,S=Q.has(y.id);return n.jsxs("button",{type:"button",className:`cheng-applink__platform-card${P?" cheng-applink__platform-card--active":""}${S?"":" cheng-applink__platform-card--disabled"}`,onClick:()=>O(y.id),style:P?{borderColor:y.color}:{},children:[n.jsx("span",{className:"cheng-applink__platform-icon",style:{background:`${y.color}18`,color:y.color},role:"img","aria-label":y.label,children:y.emoji}),n.jsx("span",{className:"cheng-applink__platform-label",children:y.label}),!S&&n.jsx("span",{className:"cheng-applink__platform-soon",children:"Soon"}),S&&n.jsx("span",{className:`cheng-applink__platform-count${E>0?" cheng-applink__platform-count--active":""}`,children:R})]},y.id)})}),n.jsxs("div",{className:"cheng-applink__board",children:[n.jsxs("div",{className:"cheng-applink__board-header",children:[n.jsxs("div",{className:"cheng-applink__board-heading",children:[n.jsxs("h2",{className:"cheng-applink__board-title",children:[oe.shortLabel," 列表"]}),n.jsx("span",{className:"cheng-applink__board-count",children:q})]}),n.jsxs("div",{className:"cheng-applink__board-actions",children:[n.jsxs("label",{className:"cheng-applink__search",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"11",cy:"11",r:"7",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("path",{d:"M20 20l-3.5-3.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),n.jsx("input",{type:"search",value:z,onChange:y=>T(y.target.value),placeholder:`搜索 ${oe.shortLabel} 名称、ID...`})]}),n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>A(!0),disabled:!Q.has(oe.id),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",oe.shortLabel]})]})]}),le.length>0?n.jsx("div",{className:"cheng-applink__table-wrap",children:n.jsxs("table",{className:"cheng-applink__table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"连接名称"}),n.jsx("th",{children:"状态"}),n.jsx("th",{children:"绑定 Agent"}),n.jsx("th",{children:"Webhook / 描述"}),n.jsx("th",{children:"更新时间"}),n.jsx("th",{children:"操作"})]})}),n.jsx("tbody",{children:le.map(y=>{const R=G[y.id],E=R?.connectionState??y.connectionState,P=K(E),S=er.find(Te=>Te.id===y.appType)??oe,V=F?.channelId===y.id,de=_e[y.id]??"未绑定 Agent",ge=F?.channelId===y.id&&F.action==="refresh",he=E==="disconnected";return n.jsxs("tr",{className:"cheng-applink__row",children:[n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--name",children:[n.jsx("div",{className:"cheng-applink__row-icon",style:{background:`${S.color}16`,color:S.color},children:n.jsx("span",{role:"img","aria-label":S.label,children:S.emoji})}),n.jsxs("div",{className:"cheng-applink__row-copy",children:[n.jsx("strong",{children:y.name}),n.jsxs("span",{children:["@",y.channelId]})]})]}),n.jsx("td",{className:"cheng-applink__cell",children:n.jsx("span",{className:`cheng-applink__badge ${P.cls}`,children:P.label})}),n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--meta",children:[n.jsx("span",{children:de}),y.boundWorkflowId&&n.jsxs("small",{children:["Workflow: ",y.boundWorkflowId]})]}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--endpoint",children:y.appType==="dingtalk"?n.jsxs("div",{className:"cheng-applink__stream-cell",children:[n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--stream",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),(R?.lastEventAt??R?.lastError)&&n.jsx("span",{className:"cheng-applink__stream-meta",children:R.lastError?n.jsxs("span",{className:"cheng-applink__stream-error",title:R.lastError,children:["⚠ ",R.lastError.slice(0,40),R.lastError.length>40?"…":""]}):R?.lastEventAt?n.jsxs(n.Fragment,{children:["最近事件 ",ce(R.lastEventAt)]}):null})]}):y.appType==="slack"&&y.connectionConfig?.connection_mode==="socket_mode"?n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--socket",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]}):n.jsx("span",{title:y.webhookUrl||y.description||"",children:y.webhookUrl||y.description||"—"})}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--time",children:ce(y.updatedAt??y.createdAt)}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--actions",children:n.jsxs("div",{className:"cheng-applink__row-actions",children:[he?n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"恢复连接",title:"恢复连接",onClick:()=>{g(y)},disabled:V,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 6.5v11l9-5.5-9-5.5Z",fill:"currentColor"})})}):n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"暂停连接",title:"暂停连接",onClick:()=>{B(y)},disabled:V,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M9 5H7v14h2V5Zm8 0h-2v14h2V5Z",fill:"currentColor"})})}),n.jsx("button",{type:"button",className:`cheng-applink__icon-btn${ge?" cheng-applink__icon-btn--spinning":""}`,"aria-label":"刷新状态",title:"刷新状态",onClick:()=>{W(y)},disabled:V,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"编辑连接",title:"编辑连接",onClick:()=>C(y),children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M12 20h9",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn cheng-applink__icon-btn--danger","aria-label":"删除连接",title:"删除连接",onClick:()=>{b(y)},disabled:V,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M3 6h18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M8 6V4h8v2",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M19 6l-1 14H6L5 6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M10 11v5M14 11v5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]})})]})})]},y.id||y.channelId)})})]})}):n.jsxs("div",{className:"cheng-applink__empty",children:[n.jsx("div",{className:"cheng-applink__empty-icon",children:n.jsx("span",{role:"img","aria-label":oe.label,style:{fontSize:28},children:oe.emoji})}),n.jsxs("p",{className:"cheng-applink__empty-title",children:[oe.shortLabel," 暂无连接"]}),n.jsx("p",{className:"cheng-applink__empty-desc",children:z?`没有匹配 "${z}" 的连接`:`当前还没有 ${oe.label} 接入连接`}),!z&&Q.has(oe.id)&&n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>A(!0),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",oe.shortLabel]})]})]})]}),n.jsx(Cf,{activePlatform:oe,platforms:er,isCreateModalOpen:H,onCloseCreate:$,editingChannel:re,onCloseEdit:()=>C(null),agents:X,onCreate:i,onUpdate:a,onRefresh:p,apiBaseUrl:u,onGoToAgents:w,liveStatusMap:G})]})}function Mf({onLogout:l}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header",children:[n.jsx("h1",{className:"cheng-page__title",children:"Settings"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your account and preferences."})]}),n.jsx("div",{className:"cheng-page__content",children:n.jsx("div",{className:"cheng-page__settings-card",children:n.jsxs("div",{className:"cheng-page__settings-section",children:[n.jsx("h2",{className:"cheng-page__settings-section-title",children:"Account"}),n.jsx("p",{className:"cheng-page__settings-section-desc",children:"You are currently logged in. Click below to sign out of your account."}),n.jsxs("button",{type:"button",className:"cheng-page__logout-btn",onClick:l,children:[n.jsx(Ef,{}),"Sign Out"]})]})})})]})}function Df({channels:l,activeChannel:i,activeConfig:a,isLoading:d,onSelectChannel:p,onCreateChannel:u,onUpdateChannel:m,onDeleteChannel:w,onLogout:v,onRefreshChannels:_,apiBaseUrl:z,chatWindowProps:T={}}){const[H,A]=f.useState("chat"),[re,C]=f.useState(!1),[F,N]=f.useState(null),[G,Y]=f.useState({}),[U,J]=f.useState({}),Q=f.useRef(null),X=[{id:"chat",label:"Chat",icon:n.jsx(Rd,{})},{id:"channel",label:"Agents",icon:n.jsx(Md,{})},{id:"applink",label:"App Links",icon:n.jsx(Nf,{})}],se=()=>{C(!1),N(null),A("channel")},ne=()=>{C(!1),N(null)},oe=async ee=>{window.confirm(`确定删除 Agent "${ee.name}" 吗？删除后无法恢复。`)&&(await Promise.resolve(w(ee.id)),F?.id===ee.id&&N(null))};return f.useEffect(()=>{const ee=`${z??""}:${l.map(q=>`${q.workspaceId}/${q.boundWorkflowId}`).sort().join(",")}`;if(Q.current===ee)return;Q.current=ee,(async()=>{if(!z||l.length===0){Q.current===ee&&(Y({}),J({}));return}const q=new We(z),_e=new qe(z,q);try{const O=await _e.listWorkspaces();Q.current===ee&&Y(Object.fromEntries(O.map($=>[$.id,$.name||$.id])))}catch{Q.current===ee&&Y({})}const K=Array.from(new Map(l.filter(O=>O.boundWorkflowId?.trim()).map(O=>[O.boundWorkflowId,{workflowId:O.boundWorkflowId,workspaceId:O.workspaceId}])).values()),ce=await Promise.all(K.map(async({workflowId:O,workspaceId:$})=>{try{const W=await _e.getWorkflowName(O,$);return[O,W||O]}catch{return[O,O]}}));Q.current===ee&&J(Object.fromEntries(ce))})()},[z,l]),n.jsxs("div",{className:"cheng-shell",children:[n.jsxs("div",{className:"cheng-shell__sidebar",children:[n.jsx("div",{className:"cheng-shell__logo","aria-label":"ChengOS logo",children:"CO"}),n.jsx("div",{className:"cheng-shell__divider"}),n.jsx("nav",{className:"cheng-shell__nav",children:X.map(ee=>{const le=H===ee.id;return n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${le?" cheng-shell__nav-item--active":""}`,onClick:()=>A(ee.id),"aria-label":ee.label,children:[ee.icon,le&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:ee.label})]},ee.id)})}),n.jsxs("div",{className:"cheng-shell__bottom",children:[n.jsx("div",{className:"cheng-shell__divider"}),n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${H==="settings"?" cheng-shell__nav-item--active":""}`,onClick:()=>A("settings"),"aria-label":"Settings",children:[n.jsx(If,{}),H==="settings"&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:"Settings"})]})]})]}),n.jsxs("div",{className:"cheng-shell__main",children:[H==="chat"&&n.jsx(Af,{channels:l,activeChannel:i,activeConfig:a,isLoading:d,onSelectChannel:p,onCreateClick:()=>A("channel"),chatWindowProps:T}),H==="channel"&&n.jsx(Lf,{channels:l,onCreateClick:()=>C(!0),onEditClick:ee=>N(ee),onDeleteClick:oe,workspaceNames:G,workflowNames:U}),H==="applink"&&n.jsx(Rf,{channels:l,onCreate:u,onUpdate:m,onDelete:w,onRefresh:_??(()=>{}),apiBaseUrl:z,onSuccess:se,onGoToAgents:()=>A("channel")}),H==="settings"&&n.jsx(Mf,{onLogout:v})]}),n.jsx(Wh,{isOpen:re||!!F,onClose:ne,mode:F?"edit":"create",initialChannel:F,existingChannels:l,onCreate:async ee=>{await u(ee)},onUpdate:async ee=>{await m(ee),se()},apiBaseUrl:z}),n.jsx("style",{children:Ff})]})}function Pf(l){return n.jsx(nh,{config:l.activeConfig,children:n.jsx(Df,{...l})})}const Ff=`
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
`;function Wf({apiBaseUrl:l,onLoginSuccess:i,title:a="ChengOS",subtitle:d="登录以管理你的 Channels"}){const[p,u]=f.useState(""),[m,w]=f.useState(""),[v,_]=f.useState(!1),[z,T]=f.useState(null),[H,A]=f.useState(!1),re=f.useCallback(async C=>{C.preventDefault(),_(!0),T(null);try{await new pa(l).login({email:p,password:m}),i()}catch(F){T(F instanceof Error?F.message:String(F))}finally{_(!1)}},[l,p,m,i]);return n.jsxs("div",{style:ze.root,children:[n.jsx("div",{style:ze.orbTopLeft}),n.jsx("div",{style:ze.orbTopRight}),n.jsx("div",{style:ze.orbBottom}),n.jsx("div",{style:ze.container,children:n.jsxs("section",{style:ze.card,children:[n.jsx("div",{style:ze.cardGlow}),n.jsxs("div",{style:ze.content,children:[n.jsx("div",{style:ze.headerRow,children:n.jsxs("div",{style:ze.brandWrap,children:[n.jsx("div",{style:ze.brandLogo,children:"CO"}),n.jsx("div",{style:ze.brandText,children:"CHENGOS"})]})}),n.jsxs("div",{style:ze.titleWrap,children:[n.jsx("h1",{style:ze.title,children:a}),n.jsx("p",{style:ze.subtitle,children:d})]}),n.jsxs("form",{onSubmit:re,style:ze.form,children:[n.jsxs("div",{style:ze.field,children:[n.jsx("label",{style:ze.label,htmlFor:"cheng-email",children:"邮箱"}),n.jsx("input",{id:"cheng-email",type:"email",required:!0,autoComplete:"email",value:p,onChange:C=>u(C.target.value),style:ze.input,placeholder:"you@example.com",disabled:v})]}),n.jsxs("div",{style:ze.field,children:[n.jsx("label",{style:ze.label,htmlFor:"cheng-password",children:"密码"}),n.jsx("input",{id:"cheng-password",type:"password",required:!0,autoComplete:"current-password",value:m,onChange:C=>w(C.target.value),style:ze.input,placeholder:"••••••••",disabled:v})]}),z&&n.jsx("div",{style:ze.error,children:z}),n.jsxs("button",{type:"submit",disabled:v,onMouseEnter:()=>A(!0),onMouseLeave:()=>A(!1),onFocus:()=>A(!0),onBlur:()=>A(!1),style:{...ze.button,...H&&!v?ze.buttonHovered:{},...v?ze.buttonDisabled:{}},children:[n.jsx("span",{children:v?"登录中...":"登录"}),n.jsx("span",{style:ze.arrow,children:"→"})]})]})]})]})})]})}const ze={root:{position:"relative",display:"flex",minHeight:"100%",width:"100%",overflow:"hidden",background:"radial-gradient(circle at top left, rgba(201, 100, 66, 0.14), transparent 30%), radial-gradient(circle at top right, rgba(217, 119, 87, 0.12), transparent 28%), linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},orbTopLeft:{position:"absolute",left:"-8rem",top:"-6rem",width:"16rem",height:"16rem",borderRadius:"9999px",background:"rgba(201, 100, 66, 0.12)",filter:"blur(56px)",pointerEvents:"none"},orbTopRight:{position:"absolute",right:"-6rem",top:"6rem",width:"18rem",height:"18rem",borderRadius:"9999px",background:"rgba(176, 174, 165, 0.2)",filter:"blur(56px)",pointerEvents:"none"},orbBottom:{position:"absolute",left:"32%",bottom:"-8rem",width:"20rem",height:"20rem",borderRadius:"9999px",background:"rgba(217, 119, 87, 0.12)",filter:"blur(60px)",pointerEvents:"none"},container:{position:"relative",zIndex:1,display:"flex",alignItems:"center",width:"100%",maxWidth:"36rem",minHeight:"100%",margin:"0 auto",padding:"2rem 1rem",boxSizing:"border-box"},card:{position:"relative",width:"100%",overflow:"hidden",borderRadius:"2rem",border:"1px solid #f0eee6",background:"#faf9f5",boxShadow:"0 0 0 1px #d1cfc5, rgba(0,0,0,0.07) 0px 16px 40px",backdropFilter:"blur(14px)"},cardGlow:{position:"absolute",inset:0,background:"radial-gradient(circle at top right, rgba(201, 100, 66, 0.08), transparent 34%), radial-gradient(circle at bottom left, rgba(217, 119, 87, 0.08), transparent 30%)",pointerEvents:"none"},content:{position:"relative",zIndex:1,padding:"1.75rem"},headerRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:"1.5rem"},brandWrap:{display:"flex",alignItems:"center",gap:"0.75rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"1rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700,boxShadow:"0 10px 24px rgba(226, 114, 91, 0.36)",letterSpacing:"0.03em"},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},titleWrap:{marginBottom:"1.5rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,letterSpacing:"-0.03em",color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},form:{display:"flex",flexDirection:"column",gap:"1rem"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"1rem",border:"1px solid #e8e6dc",background:"#faf9f5",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",boxShadow:"0 0 0 1px #d1cfc5",outline:"none"},error:{borderRadius:"1rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{height:"3rem",border:"1px solid #d1cfc5",borderRadius:"1rem",background:"#faf9f5",color:"#4d4c48",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",fontSize:"0.875rem",fontWeight:500,boxShadow:"0 0 0 1px #d1cfc5",cursor:"pointer",transition:"all 0.2s ease",marginTop:"0.25rem"},buttonHovered:{background:"#c96442",border:"1px solid #c96442",color:"#faf9f5",boxShadow:"0 0 0 1px #c96442, rgba(0,0,0,0.08) 0px 8px 24px"},buttonDisabled:{opacity:.7,cursor:"not-allowed",boxShadow:"none"},arrow:{fontSize:"1rem",lineHeight:1}};function Of({config:l,chatWindowProps:i={},loginTitle:a,loginSubtitle:d}){const{isAuthenticated:p,logout:u,refresh:m}=uh(l.apiBaseUrl),{channels:w,activeChannel:v,setActiveChannel:_,createChannel:z,updateChannel:T,deleteChannel:H,isLoading:A,refresh:re}=dh({...l,workspaceId:""}),C=f.useCallback(async G=>z(G),[z]),F=f.useCallback(async G=>{await T(G)},[T]),N=f.useMemo(()=>{const G={...l,workspaceId:""};return v?{...G,workspaceId:v.workspaceId,channelId:v.channelId,boundWorkflowId:v.boundWorkflowId||G.boundWorkflowId}:G},[l,v]);return p?n.jsxs("div",{className:"cheng-layout cheng-layout--multi",children:[n.jsx(Pf,{channels:w,activeChannel:v,activeConfig:N,isLoading:A,onSelectChannel:_,onCreateChannel:C,onUpdateChannel:F,onDeleteChannel:H,onLogout:u,onRefreshChannels:re,apiBaseUrl:l.apiBaseUrl,chatWindowProps:i}),n.jsx("style",{children:Uf})]}):n.jsx(Wf,{apiBaseUrl:l.apiBaseUrl,onLoginSuccess:m,title:a,subtitle:d})}const Uf=`
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
`;function $f({apiBaseUrl:l,token:i,onComplete:a}){const[d,p]=f.useState(""),[u,m]=f.useState(""),[w,v]=f.useState(!1),[_,z]=f.useState(!1),[T,H]=f.useState(null),A=f.useMemo(()=>i?.trim()||"",[i]),re=f.useCallback(async C=>{if(C.preventDefault(),H(null),!A){H("重置链接无效，请重新申请密码找回邮件。");return}if(d!==u){H("两次输入的密码不一致。");return}v(!0);try{await new pa(l).resetPassword({token:A,new_password:d}),z(!0),a?.()}catch(F){H(F instanceof Error?F.message:String(F))}finally{v(!1)}},[l,u,a,d,A]);return n.jsx("div",{style:Ue.root,children:n.jsxs("main",{style:Ue.panel,children:[n.jsxs("div",{style:Ue.brandRow,children:[n.jsx("div",{style:Ue.brandLogo,children:"CO"}),n.jsx("div",{style:Ue.brandText,children:"CHENGOS"})]}),_?n.jsxs("section",{style:Ue.content,children:[n.jsx("h1",{style:Ue.title,children:"密码已重置"}),n.jsx("p",{style:Ue.subtitle,children:"现在可以使用新密码登录。"}),n.jsx("a",{href:"/",style:Ue.button,children:"返回登录"})]}):n.jsxs("form",{onSubmit:re,style:Ue.content,children:[n.jsxs("div",{children:[n.jsx("h1",{style:Ue.title,children:"重置密码"}),n.jsx("p",{style:Ue.subtitle,children:"请输入新密码完成账号恢复。"})]}),n.jsxs("div",{style:Ue.field,children:[n.jsx("label",{style:Ue.label,htmlFor:"cheng-new-password",children:"新密码"}),n.jsx("input",{id:"cheng-new-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:d,onChange:C=>p(C.target.value),style:Ue.input,disabled:w||!A})]}),n.jsxs("div",{style:Ue.field,children:[n.jsx("label",{style:Ue.label,htmlFor:"cheng-confirm-password",children:"确认新密码"}),n.jsx("input",{id:"cheng-confirm-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:u,onChange:C=>m(C.target.value),style:Ue.input,disabled:w||!A})]}),!A&&n.jsx("div",{style:Ue.error,children:"重置链接缺少 token，请重新申请密码找回邮件。"}),T&&n.jsx("div",{style:Ue.error,children:T}),n.jsx("button",{type:"submit",disabled:w||!A,style:Ue.button,children:w?"提交中...":"更新密码"}),n.jsx("a",{href:"/",style:Ue.secondaryLink,children:"返回登录"})]})]})})}const Ue={root:{display:"flex",minHeight:"100%",width:"100%",alignItems:"center",justifyContent:"center",boxSizing:"border-box",padding:"2rem 1rem",background:"linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},panel:{width:"100%",maxWidth:"30rem",boxSizing:"border-box",border:"1px solid #d1cfc5",borderRadius:"1.25rem",background:"#faf9f5",padding:"1.75rem",boxShadow:"rgba(0,0,0,0.07) 0px 16px 40px"},brandRow:{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"0.875rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},content:{display:"flex",flexDirection:"column",gap:"1rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"0.875rem",border:"1px solid #e8e6dc",background:"#fff",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",outline:"none"},error:{borderRadius:"0.875rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{display:"flex",height:"3rem",alignItems:"center",justifyContent:"center",border:"1px solid #c96442",borderRadius:"0.875rem",background:"#c96442",color:"#faf9f5",fontSize:"0.875rem",fontWeight:600,textDecoration:"none",cursor:"pointer"},secondaryLink:{alignSelf:"center",color:"#5e5d59",fontSize:"0.875rem",textDecoration:"none"}};function Bf(){const l=window.__CHENGOS_APP_CONFIG__,i={apiBaseUrl:l?.apiBaseUrl||void 0||"/api/v1",wsBaseUrl:l?.wsUrl||void 0||"/ws/executions",channelId:l?.channelId||void 0||"weather-app",boundWorkflowId:l?.boundWorkflowId||void 0||""};if(window.location.pathname==="/reset-password"){const a=new URLSearchParams(window.location.search).get("token");return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx($f,{apiBaseUrl:i.apiBaseUrl,token:a})})}return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(Of,{config:i,loginTitle:"Chengflow",loginSubtitle:"登录以管理你的 Channels",chatWindowProps:{title:"AI 助手",placeholder:"输入消息...",height:"100vh"}})})}const Dd=document.getElementById("root");if(!Dd)throw new Error("Root element not found");const Hf=Bp.createRoot(Dd);Hf.render(n.jsx(Pp.StrictMode,{children:n.jsx(Bf,{})}));
