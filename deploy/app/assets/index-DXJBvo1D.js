(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const h of document.querySelectorAll('link[rel="modulepreload"]'))u(h);new MutationObserver(h=>{for(const p of h)if(p.type==="childList")for(const m of p.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&u(m)}).observe(document,{childList:!0,subtree:!0});function l(h){const p={};return h.integrity&&(p.integrity=h.integrity),h.referrerPolicy&&(p.referrerPolicy=h.referrerPolicy),h.crossOrigin==="use-credentials"?p.credentials="include":h.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function u(h){if(h.ep)return;h.ep=!0;const p=l(h);fetch(h.href,p)}})();function mp(c){return c&&c.__esModule&&Object.prototype.hasOwnProperty.call(c,"default")?c.default:c}var Hs={exports:{}},Pr={},Gs={exports:{}},je={};var Qc;function xp(){if(Qc)return je;Qc=1;var c=Symbol.for("react.element"),s=Symbol.for("react.portal"),l=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),h=Symbol.for("react.profiler"),p=Symbol.for("react.provider"),m=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),j=Symbol.for("react.suspense"),k=Symbol.for("react.memo"),z=Symbol.for("react.lazy"),A=Symbol.iterator;function H(g){return g===null||typeof g!="object"?null:(g=A&&g[A]||g["@@iterator"],typeof g=="function"?g:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},G=Object.assign,C={};function K(g,N,y){this.props=g,this.context=N,this.refs=C,this.updater=y||E}K.prototype.isReactComponent={},K.prototype.setState=function(g,N){if(typeof g!="object"&&typeof g!="function"&&g!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,g,N,"setState")},K.prototype.forceUpdate=function(g){this.updater.enqueueForceUpdate(this,g,"forceUpdate")};function O(){}O.prototype=K.prototype;function $(g,N,y){this.props=g,this.context=N,this.refs=C,this.updater=y||E}var J=$.prototype=new O;J.constructor=$,G(J,K.prototype),J.isPureReactComponent=!0;var V=Array.isArray,B=Object.prototype.hasOwnProperty,X={current:null},oe={key:!0,ref:!0,__self:!0,__source:!0};function ie(g,N,y){var W,L={},U=null,_=null;if(N!=null)for(W in N.ref!==void 0&&(_=N.ref),N.key!==void 0&&(U=""+N.key),N)B.call(N,W)&&!oe.hasOwnProperty(W)&&(L[W]=N[W]);var Z=arguments.length-2;if(Z===1)L.children=y;else if(1<Z){for(var pe=Array(Z),_e=0;_e<Z;_e++)pe[_e]=arguments[_e+2];L.children=pe}if(g&&g.defaultProps)for(W in Z=g.defaultProps,Z)L[W]===void 0&&(L[W]=Z[W]);return{$$typeof:c,type:g,key:U,ref:_,props:L,_owner:X.current}}function se(g,N){return{$$typeof:c,type:g.type,key:N,ref:g.ref,props:g.props,_owner:g._owner}}function te(g){return typeof g=="object"&&g!==null&&g.$$typeof===c}function ae(g){var N={"=":"=0",":":"=2"};return"$"+g.replace(/[=:]/g,function(y){return N[y]})}var ce=/\/+/g;function ne(g,N){return typeof g=="object"&&g!==null&&g.key!=null?ae(""+g.key):N.toString(36)}function xe(g,N,y,W,L){var U=typeof g;(U==="undefined"||U==="boolean")&&(g=null);var _=!1;if(g===null)_=!0;else switch(U){case"string":case"number":_=!0;break;case"object":switch(g.$$typeof){case c:case s:_=!0}}if(_)return _=g,L=L(_),g=W===""?"."+ne(_,0):W,V(L)?(y="",g!=null&&(y=g.replace(ce,"$&/")+"/"),xe(L,N,y,"",function(_e){return _e})):L!=null&&(te(L)&&(L=se(L,y+(!L.key||_&&_.key===L.key?"":(""+L.key).replace(ce,"$&/")+"/")+g)),N.push(L)),1;if(_=0,W=W===""?".":W+":",V(g))for(var Z=0;Z<g.length;Z++){U=g[Z];var pe=W+ne(U,Z);_+=xe(U,N,y,pe,L)}else if(pe=H(g),typeof pe=="function")for(g=pe.call(g),Z=0;!(U=g.next()).done;)U=U.value,pe=W+ne(U,Z++),_+=xe(U,N,y,pe,L);else if(U==="object")throw N=String(g),Error("Objects are not valid as a React child (found: "+(N==="[object Object]"?"object with keys {"+Object.keys(g).join(", ")+"}":N)+"). If you meant to render a collection of children, use an array instead.");return _}function R(g,N,y){if(g==null)return g;var W=[],L=0;return xe(g,W,"","",function(U){return N.call(y,U,L++)}),W}function Q(g){if(g._status===-1){var N=g._result;N=N(),N.then(function(y){(g._status===0||g._status===-1)&&(g._status=1,g._result=y)},function(y){(g._status===0||g._status===-1)&&(g._status=2,g._result=y)}),g._status===-1&&(g._status=0,g._result=N)}if(g._status===1)return g._result.default;throw g._result}var D={current:null},P={transition:null},M={ReactCurrentDispatcher:D,ReactCurrentBatchConfig:P,ReactCurrentOwner:X};function F(){throw Error("act(...) is not supported in production builds of React.")}return je.Children={map:R,forEach:function(g,N,y){R(g,function(){N.apply(this,arguments)},y)},count:function(g){var N=0;return R(g,function(){N++}),N},toArray:function(g){return R(g,function(N){return N})||[]},only:function(g){if(!te(g))throw Error("React.Children.only expected to receive a single React element child.");return g}},je.Component=K,je.Fragment=l,je.Profiler=h,je.PureComponent=$,je.StrictMode=u,je.Suspense=j,je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=M,je.act=F,je.cloneElement=function(g,N,y){if(g==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+g+".");var W=G({},g.props),L=g.key,U=g.ref,_=g._owner;if(N!=null){if(N.ref!==void 0&&(U=N.ref,_=X.current),N.key!==void 0&&(L=""+N.key),g.type&&g.type.defaultProps)var Z=g.type.defaultProps;for(pe in N)B.call(N,pe)&&!oe.hasOwnProperty(pe)&&(W[pe]=N[pe]===void 0&&Z!==void 0?Z[pe]:N[pe])}var pe=arguments.length-2;if(pe===1)W.children=y;else if(1<pe){Z=Array(pe);for(var _e=0;_e<pe;_e++)Z[_e]=arguments[_e+2];W.children=Z}return{$$typeof:c,type:g.type,key:L,ref:U,props:W,_owner:_}},je.createContext=function(g){return g={$$typeof:m,_currentValue:g,_currentValue2:g,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},g.Provider={$$typeof:p,_context:g},g.Consumer=g},je.createElement=ie,je.createFactory=function(g){var N=ie.bind(null,g);return N.type=g,N},je.createRef=function(){return{current:null}},je.forwardRef=function(g){return{$$typeof:v,render:g}},je.isValidElement=te,je.lazy=function(g){return{$$typeof:z,_payload:{_status:-1,_result:g},_init:Q}},je.memo=function(g,N){return{$$typeof:k,type:g,compare:N===void 0?null:N}},je.startTransition=function(g){var N=P.transition;P.transition={};try{g()}finally{P.transition=N}},je.unstable_act=F,je.useCallback=function(g,N){return D.current.useCallback(g,N)},je.useContext=function(g){return D.current.useContext(g)},je.useDebugValue=function(){},je.useDeferredValue=function(g){return D.current.useDeferredValue(g)},je.useEffect=function(g,N){return D.current.useEffect(g,N)},je.useId=function(){return D.current.useId()},je.useImperativeHandle=function(g,N,y){return D.current.useImperativeHandle(g,N,y)},je.useInsertionEffect=function(g,N){return D.current.useInsertionEffect(g,N)},je.useLayoutEffect=function(g,N){return D.current.useLayoutEffect(g,N)},je.useMemo=function(g,N){return D.current.useMemo(g,N)},je.useReducer=function(g,N,y){return D.current.useReducer(g,N,y)},je.useRef=function(g){return D.current.useRef(g)},je.useState=function(g){return D.current.useState(g)},je.useSyncExternalStore=function(g,N,y){return D.current.useSyncExternalStore(g,N,y)},je.useTransition=function(){return D.current.useTransition()},je.version="18.3.1",je}var Xc;function na(){return Xc||(Xc=1,Gs.exports=xp()),Gs.exports}var qc;function _p(){if(qc)return Pr;qc=1;var c=na(),s=Symbol.for("react.element"),l=Symbol.for("react.fragment"),u=Object.prototype.hasOwnProperty,h=c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function m(v,j,k){var z,A={},H=null,E=null;k!==void 0&&(H=""+k),j.key!==void 0&&(H=""+j.key),j.ref!==void 0&&(E=j.ref);for(z in j)u.call(j,z)&&!p.hasOwnProperty(z)&&(A[z]=j[z]);if(v&&v.defaultProps)for(z in j=v.defaultProps,j)A[z]===void 0&&(A[z]=j[z]);return{$$typeof:s,type:v,key:H,ref:E,props:A,_owner:h.current}}return Pr.Fragment=l,Pr.jsx=m,Pr.jsxs=m,Pr}var Yc;function wp(){return Yc||(Yc=1,Hs.exports=_p()),Hs.exports}var n=wp(),f=na();const bp=mp(f);var Go={},Qs={exports:{}},ct={},Xs={exports:{}},qs={};var Jc;function yp(){return Jc||(Jc=1,(function(c){function s(P,M){var F=P.length;P.push(M);e:for(;0<F;){var g=F-1>>>1,N=P[g];if(0<h(N,M))P[g]=M,P[F]=N,F=g;else break e}}function l(P){return P.length===0?null:P[0]}function u(P){if(P.length===0)return null;var M=P[0],F=P.pop();if(F!==M){P[0]=F;e:for(var g=0,N=P.length,y=N>>>1;g<y;){var W=2*(g+1)-1,L=P[W],U=W+1,_=P[U];if(0>h(L,F))U<N&&0>h(_,L)?(P[g]=_,P[U]=F,g=U):(P[g]=L,P[W]=F,g=W);else if(U<N&&0>h(_,F))P[g]=_,P[U]=F,g=U;else break e}}return M}function h(P,M){var F=P.sortIndex-M.sortIndex;return F!==0?F:P.id-M.id}if(typeof performance=="object"&&typeof performance.now=="function"){var p=performance;c.unstable_now=function(){return p.now()}}else{var m=Date,v=m.now();c.unstable_now=function(){return m.now()-v}}var j=[],k=[],z=1,A=null,H=3,E=!1,G=!1,C=!1,K=typeof setTimeout=="function"?setTimeout:null,O=typeof clearTimeout=="function"?clearTimeout:null,$=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function J(P){for(var M=l(k);M!==null;){if(M.callback===null)u(k);else if(M.startTime<=P)u(k),M.sortIndex=M.expirationTime,s(j,M);else break;M=l(k)}}function V(P){if(C=!1,J(P),!G)if(l(j)!==null)G=!0,Q(B);else{var M=l(k);M!==null&&D(V,M.startTime-P)}}function B(P,M){G=!1,C&&(C=!1,O(ie),ie=-1),E=!0;var F=H;try{for(J(M),A=l(j);A!==null&&(!(A.expirationTime>M)||P&&!ae());){var g=A.callback;if(typeof g=="function"){A.callback=null,H=A.priorityLevel;var N=g(A.expirationTime<=M);M=c.unstable_now(),typeof N=="function"?A.callback=N:A===l(j)&&u(j),J(M)}else u(j);A=l(j)}if(A!==null)var y=!0;else{var W=l(k);W!==null&&D(V,W.startTime-M),y=!1}return y}finally{A=null,H=F,E=!1}}var X=!1,oe=null,ie=-1,se=5,te=-1;function ae(){return!(c.unstable_now()-te<se)}function ce(){if(oe!==null){var P=c.unstable_now();te=P;var M=!0;try{M=oe(!0,P)}finally{M?ne():(X=!1,oe=null)}}else X=!1}var ne;if(typeof $=="function")ne=function(){$(ce)};else if(typeof MessageChannel<"u"){var xe=new MessageChannel,R=xe.port2;xe.port1.onmessage=ce,ne=function(){R.postMessage(null)}}else ne=function(){K(ce,0)};function Q(P){oe=P,X||(X=!0,ne())}function D(P,M){ie=K(function(){P(c.unstable_now())},M)}c.unstable_IdlePriority=5,c.unstable_ImmediatePriority=1,c.unstable_LowPriority=4,c.unstable_NormalPriority=3,c.unstable_Profiling=null,c.unstable_UserBlockingPriority=2,c.unstable_cancelCallback=function(P){P.callback=null},c.unstable_continueExecution=function(){G||E||(G=!0,Q(B))},c.unstable_forceFrameRate=function(P){0>P||125<P?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):se=0<P?Math.floor(1e3/P):5},c.unstable_getCurrentPriorityLevel=function(){return H},c.unstable_getFirstCallbackNode=function(){return l(j)},c.unstable_next=function(P){switch(H){case 1:case 2:case 3:var M=3;break;default:M=H}var F=H;H=M;try{return P()}finally{H=F}},c.unstable_pauseExecution=function(){},c.unstable_requestPaint=function(){},c.unstable_runWithPriority=function(P,M){switch(P){case 1:case 2:case 3:case 4:case 5:break;default:P=3}var F=H;H=P;try{return M()}finally{H=F}},c.unstable_scheduleCallback=function(P,M,F){var g=c.unstable_now();switch(typeof F=="object"&&F!==null?(F=F.delay,F=typeof F=="number"&&0<F?g+F:g):F=g,P){case 1:var N=-1;break;case 2:N=250;break;case 5:N=1073741823;break;case 4:N=1e4;break;default:N=5e3}return N=F+N,P={id:z++,callback:M,priorityLevel:P,startTime:F,expirationTime:N,sortIndex:-1},F>g?(P.sortIndex=F,s(k,P),l(j)===null&&P===l(k)&&(C?(O(ie),ie=-1):C=!0,D(V,F-g))):(P.sortIndex=N,s(j,P),G||E||(G=!0,Q(B))),P},c.unstable_shouldYield=ae,c.unstable_wrapCallback=function(P){var M=H;return function(){var F=H;H=M;try{return P.apply(this,arguments)}finally{H=F}}}})(qs)),qs}var Zc;function kp(){return Zc||(Zc=1,Xs.exports=yp()),Xs.exports}var ed;function vp(){if(ed)return ct;ed=1;var c=na(),s=kp();function l(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var u=new Set,h={};function p(e,t){m(e,t),m(e+"Capture",t)}function m(e,t){for(h[e]=t,e=0;e<t.length;e++)u.add(t[e])}var v=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),j=Object.prototype.hasOwnProperty,k=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,z={},A={};function H(e){return j.call(A,e)?!0:j.call(z,e)?!1:k.test(e)?A[e]=!0:(z[e]=!0,!1)}function E(e,t,r,o){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function G(e,t,r,o){if(t===null||typeof t>"u"||E(e,t,r,o))return!0;if(o)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function C(e,t,r,o,i,a,d){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=i,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=d}var K={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){K[e]=new C(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];K[t]=new C(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){K[e]=new C(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){K[e]=new C(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){K[e]=new C(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){K[e]=new C(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){K[e]=new C(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){K[e]=new C(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){K[e]=new C(e,5,!1,e.toLowerCase(),null,!1,!1)});var O=/[\-:]([a-z])/g;function $(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(O,$);K[t]=new C(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(O,$);K[t]=new C(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(O,$);K[t]=new C(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){K[e]=new C(e,1,!1,e.toLowerCase(),null,!1,!1)}),K.xlinkHref=new C("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){K[e]=new C(e,1,!1,e.toLowerCase(),null,!0,!0)});function J(e,t,r,o){var i=K.hasOwnProperty(t)?K[t]:null;(i!==null?i.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(G(t,r,i,o)&&(r=null),o||i===null?H(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):i.mustUseProperty?e[i.propertyName]=r===null?i.type===3?!1:"":r:(t=i.attributeName,o=i.attributeNamespace,r===null?e.removeAttribute(t):(i=i.type,r=i===3||i===4&&r===!0?"":""+r,o?e.setAttributeNS(o,t,r):e.setAttribute(t,r))))}var V=c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,B=Symbol.for("react.element"),X=Symbol.for("react.portal"),oe=Symbol.for("react.fragment"),ie=Symbol.for("react.strict_mode"),se=Symbol.for("react.profiler"),te=Symbol.for("react.provider"),ae=Symbol.for("react.context"),ce=Symbol.for("react.forward_ref"),ne=Symbol.for("react.suspense"),xe=Symbol.for("react.suspense_list"),R=Symbol.for("react.memo"),Q=Symbol.for("react.lazy"),D=Symbol.for("react.offscreen"),P=Symbol.iterator;function M(e){return e===null||typeof e!="object"?null:(e=P&&e[P]||e["@@iterator"],typeof e=="function"?e:null)}var F=Object.assign,g;function N(e){if(g===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);g=t&&t[1]||""}return`
`+g+e}var y=!1;function W(e,t){if(!e||y)return"";y=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(T){var o=T}Reflect.construct(e,[],t)}else{try{t.call()}catch(T){o=T}e.call(t.prototype)}else{try{throw Error()}catch(T){o=T}e()}}catch(T){if(T&&o&&typeof T.stack=="string"){for(var i=T.stack.split(`
`),a=o.stack.split(`
`),d=i.length-1,x=a.length-1;1<=d&&0<=x&&i[d]!==a[x];)x--;for(;1<=d&&0<=x;d--,x--)if(i[d]!==a[x]){if(d!==1||x!==1)do if(d--,x--,0>x||i[d]!==a[x]){var w=`
`+i[d].replace(" at new "," at ");return e.displayName&&w.includes("<anonymous>")&&(w=w.replace("<anonymous>",e.displayName)),w}while(1<=d&&0<=x);break}}}finally{y=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?N(e):""}function L(e){switch(e.tag){case 5:return N(e.type);case 16:return N("Lazy");case 13:return N("Suspense");case 19:return N("SuspenseList");case 0:case 2:case 15:return e=W(e.type,!1),e;case 11:return e=W(e.type.render,!1),e;case 1:return e=W(e.type,!0),e;default:return""}}function U(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case oe:return"Fragment";case X:return"Portal";case se:return"Profiler";case ie:return"StrictMode";case ne:return"Suspense";case xe:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ae:return(e.displayName||"Context")+".Consumer";case te:return(e._context.displayName||"Context")+".Provider";case ce:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case R:return t=e.displayName||null,t!==null?t:U(e.type)||"Memo";case Q:t=e._payload,e=e._init;try{return U(e(t))}catch{}}return null}function _(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return U(t);case 8:return t===ie?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Z(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function pe(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function _e(e){var t=pe(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(d){o=""+d,a.call(this,d)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return o},setValue:function(d){o=""+d},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function me(e){e._valueTracker||(e._valueTracker=_e(e))}function De(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),o="";return e&&(o=pe(e)?e.checked?"true":"false":e.value),e=o,e!==r?(t.setValue(e),!0):!1}function fe(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ke(e,t){var r=t.checked;return F({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function Ie(e,t){var r=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;r=Z(t.value!=null?t.value:r),e._wrapperState={initialChecked:o,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Se(e,t){t=t.checked,t!=null&&J(e,"checked",t,!1)}function bt(e,t){Se(e,t);var r=Z(t.value),o=t.type;if(r!=null)o==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?vn(e,t.type,r):t.hasOwnProperty("defaultValue")&&vn(e,t.type,Z(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function ln(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function vn(e,t,r){(t!=="number"||fe(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var Yn=Array.isArray;function jn(e,t,r,o){if(e=e.options,t){t={};for(var i=0;i<r.length;i++)t["$"+r[i]]=!0;for(r=0;r<e.length;r++)i=t.hasOwnProperty("$"+e[r].value),e[r].selected!==i&&(e[r].selected=i),i&&o&&(e[r].defaultSelected=!0)}else{for(r=""+Z(r),t=null,i=0;i<e.length;i++){if(e[i].value===r){e[i].selected=!0,o&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function ni(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(l(91));return F({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function oa(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(l(92));if(Yn(r)){if(1<r.length)throw Error(l(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:Z(r)}}function ia(e,t){var r=Z(t.value),o=Z(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),o!=null&&(e.defaultValue=""+o)}function sa(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function aa(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ri(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?aa(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Wr,la=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,o,i){MSApp.execUnsafeLocalFunction(function(){return e(t,r,o,i)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Wr=Wr||document.createElement("div"),Wr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Wr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Jn(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var Zn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},bd=["Webkit","ms","Moz","O"];Object.keys(Zn).forEach(function(e){bd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Zn[t]=Zn[e]})});function ca(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||Zn.hasOwnProperty(e)&&Zn[e]?(""+t).trim():t+"px"}function da(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var o=r.indexOf("--")===0,i=ca(r,t[r],o);r==="float"&&(r="cssFloat"),o?e.setProperty(r,i):e[r]=i}}var yd=F({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function oi(e,t){if(t){if(yd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(l(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(l(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(l(61))}if(t.style!=null&&typeof t.style!="object")throw Error(l(62))}}function ii(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var si=null;function ai(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var li=null,Sn=null,Cn=null;function ua(e){if(e=yr(e)){if(typeof li!="function")throw Error(l(280));var t=e.stateNode;t&&(t=ao(t),li(e.stateNode,e.type,t))}}function pa(e){Sn?Cn?Cn.push(e):Cn=[e]:Sn=e}function ha(){if(Sn){var e=Sn,t=Cn;if(Cn=Sn=null,ua(e),t)for(e=0;e<t.length;e++)ua(t[e])}}function fa(e,t){return e(t)}function ga(){}var ci=!1;function ma(e,t,r){if(ci)return e(t,r);ci=!0;try{return fa(e,t,r)}finally{ci=!1,(Sn!==null||Cn!==null)&&(ga(),ha())}}function er(e,t){var r=e.stateNode;if(r===null)return null;var o=ao(r);if(o===null)return null;r=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(l(231,t,typeof r));return r}var di=!1;if(v)try{var tr={};Object.defineProperty(tr,"passive",{get:function(){di=!0}}),window.addEventListener("test",tr,tr),window.removeEventListener("test",tr,tr)}catch{di=!1}function kd(e,t,r,o,i,a,d,x,w){var T=Array.prototype.slice.call(arguments,3);try{t.apply(r,T)}catch(Y){this.onError(Y)}}var nr=!1,Fr=null,Or=!1,ui=null,vd={onError:function(e){nr=!0,Fr=e}};function jd(e,t,r,o,i,a,d,x,w){nr=!1,Fr=null,kd.apply(vd,arguments)}function Sd(e,t,r,o,i,a,d,x,w){if(jd.apply(this,arguments),nr){if(nr){var T=Fr;nr=!1,Fr=null}else throw Error(l(198));Or||(Or=!0,ui=T)}}function cn(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function xa(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function _a(e){if(cn(e)!==e)throw Error(l(188))}function Cd(e){var t=e.alternate;if(!t){if(t=cn(e),t===null)throw Error(l(188));return t!==e?null:e}for(var r=e,o=t;;){var i=r.return;if(i===null)break;var a=i.alternate;if(a===null){if(o=i.return,o!==null){r=o;continue}break}if(i.child===a.child){for(a=i.child;a;){if(a===r)return _a(i),e;if(a===o)return _a(i),t;a=a.sibling}throw Error(l(188))}if(r.return!==o.return)r=i,o=a;else{for(var d=!1,x=i.child;x;){if(x===r){d=!0,r=i,o=a;break}if(x===o){d=!0,o=i,r=a;break}x=x.sibling}if(!d){for(x=a.child;x;){if(x===r){d=!0,r=a,o=i;break}if(x===o){d=!0,o=a,r=i;break}x=x.sibling}if(!d)throw Error(l(189))}}if(r.alternate!==o)throw Error(l(190))}if(r.tag!==3)throw Error(l(188));return r.stateNode.current===r?e:t}function wa(e){return e=Cd(e),e!==null?ba(e):null}function ba(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=ba(e);if(t!==null)return t;e=e.sibling}return null}var ya=s.unstable_scheduleCallback,ka=s.unstable_cancelCallback,Nd=s.unstable_shouldYield,Id=s.unstable_requestPaint,Oe=s.unstable_now,Ed=s.unstable_getCurrentPriorityLevel,pi=s.unstable_ImmediatePriority,va=s.unstable_UserBlockingPriority,Ur=s.unstable_NormalPriority,Ad=s.unstable_LowPriority,ja=s.unstable_IdlePriority,$r=null,Et=null;function Td(e){if(Et&&typeof Et.onCommitFiberRoot=="function")try{Et.onCommitFiberRoot($r,e,void 0,(e.current.flags&128)===128)}catch{}}var yt=Math.clz32?Math.clz32:Md,zd=Math.log,Ld=Math.LN2;function Md(e){return e>>>=0,e===0?32:31-(zd(e)/Ld|0)|0}var Br=64,Kr=4194304;function rr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Vr(e,t){var r=e.pendingLanes;if(r===0)return 0;var o=0,i=e.suspendedLanes,a=e.pingedLanes,d=r&268435455;if(d!==0){var x=d&~i;x!==0?o=rr(x):(a&=d,a!==0&&(o=rr(a)))}else d=r&~i,d!==0?o=rr(d):a!==0&&(o=rr(a));if(o===0)return 0;if(t!==0&&t!==o&&(t&i)===0&&(i=o&-o,a=t&-t,i>=a||i===16&&(a&4194240)!==0))return t;if((o&4)!==0&&(o|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)r=31-yt(t),i=1<<r,o|=e[r],t&=~i;return o}function Rd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Pd(e,t){for(var r=e.suspendedLanes,o=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes;0<a;){var d=31-yt(a),x=1<<d,w=i[d];w===-1?((x&r)===0||(x&o)!==0)&&(i[d]=Rd(x,t)):w<=t&&(e.expiredLanes|=x),a&=~x}}function hi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Sa(){var e=Br;return Br<<=1,(Br&4194240)===0&&(Br=64),e}function fi(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function or(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-yt(t),e[t]=r}function Dd(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<r;){var i=31-yt(r),a=1<<i;t[i]=0,o[i]=-1,e[i]=-1,r&=~a}}function gi(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var o=31-yt(r),i=1<<o;i&t|e[o]&t&&(e[o]|=t),r&=~i}}var Ee=0;function Ca(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Na,mi,Ia,Ea,Aa,xi=!1,Hr=[],$t=null,Bt=null,Kt=null,ir=new Map,sr=new Map,Vt=[],Wd="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ta(e,t){switch(e){case"focusin":case"focusout":$t=null;break;case"dragenter":case"dragleave":Bt=null;break;case"mouseover":case"mouseout":Kt=null;break;case"pointerover":case"pointerout":ir.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":sr.delete(t.pointerId)}}function ar(e,t,r,o,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:r,eventSystemFlags:o,nativeEvent:a,targetContainers:[i]},t!==null&&(t=yr(t),t!==null&&mi(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Fd(e,t,r,o,i){switch(t){case"focusin":return $t=ar($t,e,t,r,o,i),!0;case"dragenter":return Bt=ar(Bt,e,t,r,o,i),!0;case"mouseover":return Kt=ar(Kt,e,t,r,o,i),!0;case"pointerover":var a=i.pointerId;return ir.set(a,ar(ir.get(a)||null,e,t,r,o,i)),!0;case"gotpointercapture":return a=i.pointerId,sr.set(a,ar(sr.get(a)||null,e,t,r,o,i)),!0}return!1}function za(e){var t=dn(e.target);if(t!==null){var r=cn(t);if(r!==null){if(t=r.tag,t===13){if(t=xa(r),t!==null){e.blockedOn=t,Aa(e.priority,function(){Ia(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Gr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=wi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var o=new r.constructor(r.type,r);si=o,r.target.dispatchEvent(o),si=null}else return t=yr(r),t!==null&&mi(t),e.blockedOn=r,!1;t.shift()}return!0}function La(e,t,r){Gr(e)&&r.delete(t)}function Od(){xi=!1,$t!==null&&Gr($t)&&($t=null),Bt!==null&&Gr(Bt)&&(Bt=null),Kt!==null&&Gr(Kt)&&(Kt=null),ir.forEach(La),sr.forEach(La)}function lr(e,t){e.blockedOn===t&&(e.blockedOn=null,xi||(xi=!0,s.unstable_scheduleCallback(s.unstable_NormalPriority,Od)))}function cr(e){function t(i){return lr(i,e)}if(0<Hr.length){lr(Hr[0],e);for(var r=1;r<Hr.length;r++){var o=Hr[r];o.blockedOn===e&&(o.blockedOn=null)}}for($t!==null&&lr($t,e),Bt!==null&&lr(Bt,e),Kt!==null&&lr(Kt,e),ir.forEach(t),sr.forEach(t),r=0;r<Vt.length;r++)o=Vt[r],o.blockedOn===e&&(o.blockedOn=null);for(;0<Vt.length&&(r=Vt[0],r.blockedOn===null);)za(r),r.blockedOn===null&&Vt.shift()}var Nn=V.ReactCurrentBatchConfig,Qr=!0;function Ud(e,t,r,o){var i=Ee,a=Nn.transition;Nn.transition=null;try{Ee=1,_i(e,t,r,o)}finally{Ee=i,Nn.transition=a}}function $d(e,t,r,o){var i=Ee,a=Nn.transition;Nn.transition=null;try{Ee=4,_i(e,t,r,o)}finally{Ee=i,Nn.transition=a}}function _i(e,t,r,o){if(Qr){var i=wi(e,t,r,o);if(i===null)Pi(e,t,o,Xr,r),Ta(e,o);else if(Fd(i,e,t,r,o))o.stopPropagation();else if(Ta(e,o),t&4&&-1<Wd.indexOf(e)){for(;i!==null;){var a=yr(i);if(a!==null&&Na(a),a=wi(e,t,r,o),a===null&&Pi(e,t,o,Xr,r),a===i)break;i=a}i!==null&&o.stopPropagation()}else Pi(e,t,o,null,r)}}var Xr=null;function wi(e,t,r,o){if(Xr=null,e=ai(o),e=dn(e),e!==null)if(t=cn(e),t===null)e=null;else if(r=t.tag,r===13){if(e=xa(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Xr=e,null}function Ma(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ed()){case pi:return 1;case va:return 4;case Ur:case Ad:return 16;case ja:return 536870912;default:return 16}default:return 16}}var Ht=null,bi=null,qr=null;function Ra(){if(qr)return qr;var e,t=bi,r=t.length,o,i="value"in Ht?Ht.value:Ht.textContent,a=i.length;for(e=0;e<r&&t[e]===i[e];e++);var d=r-e;for(o=1;o<=d&&t[r-o]===i[a-o];o++);return qr=i.slice(e,1<o?1-o:void 0)}function Yr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Jr(){return!0}function Pa(){return!1}function dt(e){function t(r,o,i,a,d){this._reactName=r,this._targetInst=i,this.type=o,this.nativeEvent=a,this.target=d,this.currentTarget=null;for(var x in e)e.hasOwnProperty(x)&&(r=e[x],this[x]=r?r(a):a[x]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Jr:Pa,this.isPropagationStopped=Pa,this}return F(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=Jr)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=Jr)},persist:function(){},isPersistent:Jr}),t}var In={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},yi=dt(In),dr=F({},In,{view:0,detail:0}),Bd=dt(dr),ki,vi,ur,Zr=F({},dr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Si,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ur&&(ur&&e.type==="mousemove"?(ki=e.screenX-ur.screenX,vi=e.screenY-ur.screenY):vi=ki=0,ur=e),ki)},movementY:function(e){return"movementY"in e?e.movementY:vi}}),Da=dt(Zr),Kd=F({},Zr,{dataTransfer:0}),Vd=dt(Kd),Hd=F({},dr,{relatedTarget:0}),ji=dt(Hd),Gd=F({},In,{animationName:0,elapsedTime:0,pseudoElement:0}),Qd=dt(Gd),Xd=F({},In,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),qd=dt(Xd),Yd=F({},In,{data:0}),Wa=dt(Yd),Jd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Zd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},eu={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function tu(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=eu[e])?!!t[e]:!1}function Si(){return tu}var nu=F({},dr,{key:function(e){if(e.key){var t=Jd[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Yr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Zd[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Si,charCode:function(e){return e.type==="keypress"?Yr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Yr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),ru=dt(nu),ou=F({},Zr,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Fa=dt(ou),iu=F({},dr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Si}),su=dt(iu),au=F({},In,{propertyName:0,elapsedTime:0,pseudoElement:0}),lu=dt(au),cu=F({},Zr,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),du=dt(cu),uu=[9,13,27,32],Ci=v&&"CompositionEvent"in window,pr=null;v&&"documentMode"in document&&(pr=document.documentMode);var pu=v&&"TextEvent"in window&&!pr,Oa=v&&(!Ci||pr&&8<pr&&11>=pr),Ua=" ",$a=!1;function Ba(e,t){switch(e){case"keyup":return uu.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ka(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var En=!1;function hu(e,t){switch(e){case"compositionend":return Ka(t);case"keypress":return t.which!==32?null:($a=!0,Ua);case"textInput":return e=t.data,e===Ua&&$a?null:e;default:return null}}function fu(e,t){if(En)return e==="compositionend"||!Ci&&Ba(e,t)?(e=Ra(),qr=bi=Ht=null,En=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Oa&&t.locale!=="ko"?null:t.data;default:return null}}var gu={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Va(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!gu[e.type]:t==="textarea"}function Ha(e,t,r,o){pa(o),t=oo(t,"onChange"),0<t.length&&(r=new yi("onChange","change",null,r,o),e.push({event:r,listeners:t}))}var hr=null,fr=null;function mu(e){dl(e,0)}function eo(e){var t=Mn(e);if(De(t))return e}function xu(e,t){if(e==="change")return t}var Ga=!1;if(v){var Ni;if(v){var Ii="oninput"in document;if(!Ii){var Qa=document.createElement("div");Qa.setAttribute("oninput","return;"),Ii=typeof Qa.oninput=="function"}Ni=Ii}else Ni=!1;Ga=Ni&&(!document.documentMode||9<document.documentMode)}function Xa(){hr&&(hr.detachEvent("onpropertychange",qa),fr=hr=null)}function qa(e){if(e.propertyName==="value"&&eo(fr)){var t=[];Ha(t,fr,e,ai(e)),ma(mu,t)}}function _u(e,t,r){e==="focusin"?(Xa(),hr=t,fr=r,hr.attachEvent("onpropertychange",qa)):e==="focusout"&&Xa()}function wu(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return eo(fr)}function bu(e,t){if(e==="click")return eo(t)}function yu(e,t){if(e==="input"||e==="change")return eo(t)}function ku(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var kt=typeof Object.is=="function"?Object.is:ku;function gr(e,t){if(kt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),o=Object.keys(t);if(r.length!==o.length)return!1;for(o=0;o<r.length;o++){var i=r[o];if(!j.call(t,i)||!kt(e[i],t[i]))return!1}return!0}function Ya(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ja(e,t){var r=Ya(e);e=0;for(var o;r;){if(r.nodeType===3){if(o=e+r.textContent.length,e<=t&&o>=t)return{node:r,offset:t-e};e=o}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Ya(r)}}function Za(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Za(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function el(){for(var e=window,t=fe();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=fe(e.document)}return t}function Ei(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function vu(e){var t=el(),r=e.focusedElem,o=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&Za(r.ownerDocument.documentElement,r)){if(o!==null&&Ei(r)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=r.textContent.length,a=Math.min(o.start,i);o=o.end===void 0?a:Math.min(o.end,i),!e.extend&&a>o&&(i=o,o=a,a=i),i=Ja(r,a);var d=Ja(r,o);i&&d&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==d.node||e.focusOffset!==d.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),a>o?(e.addRange(t),e.extend(d.node,d.offset)):(t.setEnd(d.node,d.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ju=v&&"documentMode"in document&&11>=document.documentMode,An=null,Ai=null,mr=null,Ti=!1;function tl(e,t,r){var o=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Ti||An==null||An!==fe(o)||(o=An,"selectionStart"in o&&Ei(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),mr&&gr(mr,o)||(mr=o,o=oo(Ai,"onSelect"),0<o.length&&(t=new yi("onSelect","select",null,t,r),e.push({event:t,listeners:o}),t.target=An)))}function to(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Tn={animationend:to("Animation","AnimationEnd"),animationiteration:to("Animation","AnimationIteration"),animationstart:to("Animation","AnimationStart"),transitionend:to("Transition","TransitionEnd")},zi={},nl={};v&&(nl=document.createElement("div").style,"AnimationEvent"in window||(delete Tn.animationend.animation,delete Tn.animationiteration.animation,delete Tn.animationstart.animation),"TransitionEvent"in window||delete Tn.transitionend.transition);function no(e){if(zi[e])return zi[e];if(!Tn[e])return e;var t=Tn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in nl)return zi[e]=t[r];return e}var rl=no("animationend"),ol=no("animationiteration"),il=no("animationstart"),sl=no("transitionend"),al=new Map,ll="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Gt(e,t){al.set(e,t),p(t,[e])}for(var Li=0;Li<ll.length;Li++){var Mi=ll[Li],Su=Mi.toLowerCase(),Cu=Mi[0].toUpperCase()+Mi.slice(1);Gt(Su,"on"+Cu)}Gt(rl,"onAnimationEnd"),Gt(ol,"onAnimationIteration"),Gt(il,"onAnimationStart"),Gt("dblclick","onDoubleClick"),Gt("focusin","onFocus"),Gt("focusout","onBlur"),Gt(sl,"onTransitionEnd"),m("onMouseEnter",["mouseout","mouseover"]),m("onMouseLeave",["mouseout","mouseover"]),m("onPointerEnter",["pointerout","pointerover"]),m("onPointerLeave",["pointerout","pointerover"]),p("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),p("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),p("onBeforeInput",["compositionend","keypress","textInput","paste"]),p("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),p("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),p("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var xr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Nu=new Set("cancel close invalid load scroll toggle".split(" ").concat(xr));function cl(e,t,r){var o=e.type||"unknown-event";e.currentTarget=r,Sd(o,t,void 0,e),e.currentTarget=null}function dl(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var o=e[r],i=o.event;o=o.listeners;e:{var a=void 0;if(t)for(var d=o.length-1;0<=d;d--){var x=o[d],w=x.instance,T=x.currentTarget;if(x=x.listener,w!==a&&i.isPropagationStopped())break e;cl(i,x,T),a=w}else for(d=0;d<o.length;d++){if(x=o[d],w=x.instance,T=x.currentTarget,x=x.listener,w!==a&&i.isPropagationStopped())break e;cl(i,x,T),a=w}}}if(Or)throw e=ui,Or=!1,ui=null,e}function ze(e,t){var r=t[$i];r===void 0&&(r=t[$i]=new Set);var o=e+"__bubble";r.has(o)||(ul(t,e,2,!1),r.add(o))}function Ri(e,t,r){var o=0;t&&(o|=4),ul(r,e,o,t)}var ro="_reactListening"+Math.random().toString(36).slice(2);function _r(e){if(!e[ro]){e[ro]=!0,u.forEach(function(r){r!=="selectionchange"&&(Nu.has(r)||Ri(r,!1,e),Ri(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ro]||(t[ro]=!0,Ri("selectionchange",!1,t))}}function ul(e,t,r,o){switch(Ma(t)){case 1:var i=Ud;break;case 4:i=$d;break;default:i=_i}r=i.bind(null,t,r,e),i=void 0,!di||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),o?i!==void 0?e.addEventListener(t,r,{capture:!0,passive:i}):e.addEventListener(t,r,!0):i!==void 0?e.addEventListener(t,r,{passive:i}):e.addEventListener(t,r,!1)}function Pi(e,t,r,o,i){var a=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var d=o.tag;if(d===3||d===4){var x=o.stateNode.containerInfo;if(x===i||x.nodeType===8&&x.parentNode===i)break;if(d===4)for(d=o.return;d!==null;){var w=d.tag;if((w===3||w===4)&&(w=d.stateNode.containerInfo,w===i||w.nodeType===8&&w.parentNode===i))return;d=d.return}for(;x!==null;){if(d=dn(x),d===null)return;if(w=d.tag,w===5||w===6){o=a=d;continue e}x=x.parentNode}}o=o.return}ma(function(){var T=a,Y=ai(r),ee=[];e:{var q=al.get(e);if(q!==void 0){var le=yi,ue=e;switch(e){case"keypress":if(Yr(r)===0)break e;case"keydown":case"keyup":le=ru;break;case"focusin":ue="focus",le=ji;break;case"focusout":ue="blur",le=ji;break;case"beforeblur":case"afterblur":le=ji;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":le=Da;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":le=Vd;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":le=su;break;case rl:case ol:case il:le=Qd;break;case sl:le=lu;break;case"scroll":le=Bd;break;case"wheel":le=du;break;case"copy":case"cut":case"paste":le=qd;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":le=Fa}var he=(t&4)!==0,Ue=!he&&e==="scroll",S=he?q!==null?q+"Capture":null:q;he=[];for(var b=T,I;b!==null;){I=b;var re=I.stateNode;if(I.tag===5&&re!==null&&(I=re,S!==null&&(re=er(b,S),re!=null&&he.push(wr(b,re,I)))),Ue)break;b=b.return}0<he.length&&(q=new le(q,ue,null,r,Y),ee.push({event:q,listeners:he}))}}if((t&7)===0){e:{if(q=e==="mouseover"||e==="pointerover",le=e==="mouseout"||e==="pointerout",q&&r!==si&&(ue=r.relatedTarget||r.fromElement)&&(dn(ue)||ue[Mt]))break e;if((le||q)&&(q=Y.window===Y?Y:(q=Y.ownerDocument)?q.defaultView||q.parentWindow:window,le?(ue=r.relatedTarget||r.toElement,le=T,ue=ue?dn(ue):null,ue!==null&&(Ue=cn(ue),ue!==Ue||ue.tag!==5&&ue.tag!==6)&&(ue=null)):(le=null,ue=T),le!==ue)){if(he=Da,re="onMouseLeave",S="onMouseEnter",b="mouse",(e==="pointerout"||e==="pointerover")&&(he=Fa,re="onPointerLeave",S="onPointerEnter",b="pointer"),Ue=le==null?q:Mn(le),I=ue==null?q:Mn(ue),q=new he(re,b+"leave",le,r,Y),q.target=Ue,q.relatedTarget=I,re=null,dn(Y)===T&&(he=new he(S,b+"enter",ue,r,Y),he.target=I,he.relatedTarget=Ue,re=he),Ue=re,le&&ue)t:{for(he=le,S=ue,b=0,I=he;I;I=zn(I))b++;for(I=0,re=S;re;re=zn(re))I++;for(;0<b-I;)he=zn(he),b--;for(;0<I-b;)S=zn(S),I--;for(;b--;){if(he===S||S!==null&&he===S.alternate)break t;he=zn(he),S=zn(S)}he=null}else he=null;le!==null&&pl(ee,q,le,he,!1),ue!==null&&Ue!==null&&pl(ee,Ue,ue,he,!0)}}e:{if(q=T?Mn(T):window,le=q.nodeName&&q.nodeName.toLowerCase(),le==="select"||le==="input"&&q.type==="file")var ge=xu;else if(Va(q))if(Ga)ge=yu;else{ge=wu;var we=_u}else(le=q.nodeName)&&le.toLowerCase()==="input"&&(q.type==="checkbox"||q.type==="radio")&&(ge=bu);if(ge&&(ge=ge(e,T))){Ha(ee,ge,r,Y);break e}we&&we(e,q,T),e==="focusout"&&(we=q._wrapperState)&&we.controlled&&q.type==="number"&&vn(q,"number",q.value)}switch(we=T?Mn(T):window,e){case"focusin":(Va(we)||we.contentEditable==="true")&&(An=we,Ai=T,mr=null);break;case"focusout":mr=Ai=An=null;break;case"mousedown":Ti=!0;break;case"contextmenu":case"mouseup":case"dragend":Ti=!1,tl(ee,r,Y);break;case"selectionchange":if(ju)break;case"keydown":case"keyup":tl(ee,r,Y)}var be;if(Ci)e:{switch(e){case"compositionstart":var ye="onCompositionStart";break e;case"compositionend":ye="onCompositionEnd";break e;case"compositionupdate":ye="onCompositionUpdate";break e}ye=void 0}else En?Ba(e,r)&&(ye="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(ye="onCompositionStart");ye&&(Oa&&r.locale!=="ko"&&(En||ye!=="onCompositionStart"?ye==="onCompositionEnd"&&En&&(be=Ra()):(Ht=Y,bi="value"in Ht?Ht.value:Ht.textContent,En=!0)),we=oo(T,ye),0<we.length&&(ye=new Wa(ye,e,null,r,Y),ee.push({event:ye,listeners:we}),be?ye.data=be:(be=Ka(r),be!==null&&(ye.data=be)))),(be=pu?hu(e,r):fu(e,r))&&(T=oo(T,"onBeforeInput"),0<T.length&&(Y=new Wa("onBeforeInput","beforeinput",null,r,Y),ee.push({event:Y,listeners:T}),Y.data=be))}dl(ee,t)})}function wr(e,t,r){return{instance:e,listener:t,currentTarget:r}}function oo(e,t){for(var r=t+"Capture",o=[];e!==null;){var i=e,a=i.stateNode;i.tag===5&&a!==null&&(i=a,a=er(e,r),a!=null&&o.unshift(wr(e,a,i)),a=er(e,t),a!=null&&o.push(wr(e,a,i))),e=e.return}return o}function zn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function pl(e,t,r,o,i){for(var a=t._reactName,d=[];r!==null&&r!==o;){var x=r,w=x.alternate,T=x.stateNode;if(w!==null&&w===o)break;x.tag===5&&T!==null&&(x=T,i?(w=er(r,a),w!=null&&d.unshift(wr(r,w,x))):i||(w=er(r,a),w!=null&&d.push(wr(r,w,x)))),r=r.return}d.length!==0&&e.push({event:t,listeners:d})}var Iu=/\r\n?/g,Eu=/\u0000|\uFFFD/g;function hl(e){return(typeof e=="string"?e:""+e).replace(Iu,`
`).replace(Eu,"")}function io(e,t,r){if(t=hl(t),hl(e)!==t&&r)throw Error(l(425))}function so(){}var Di=null,Wi=null;function Fi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Oi=typeof setTimeout=="function"?setTimeout:void 0,Au=typeof clearTimeout=="function"?clearTimeout:void 0,fl=typeof Promise=="function"?Promise:void 0,Tu=typeof queueMicrotask=="function"?queueMicrotask:typeof fl<"u"?function(e){return fl.resolve(null).then(e).catch(zu)}:Oi;function zu(e){setTimeout(function(){throw e})}function Ui(e,t){var r=t,o=0;do{var i=r.nextSibling;if(e.removeChild(r),i&&i.nodeType===8)if(r=i.data,r==="/$"){if(o===0){e.removeChild(i),cr(t);return}o--}else r!=="$"&&r!=="$?"&&r!=="$!"||o++;r=i}while(r);cr(t)}function Qt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function gl(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var Ln=Math.random().toString(36).slice(2),At="__reactFiber$"+Ln,br="__reactProps$"+Ln,Mt="__reactContainer$"+Ln,$i="__reactEvents$"+Ln,Lu="__reactListeners$"+Ln,Mu="__reactHandles$"+Ln;function dn(e){var t=e[At];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Mt]||r[At]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=gl(e);e!==null;){if(r=e[At])return r;e=gl(e)}return t}e=r,r=e.parentNode}return null}function yr(e){return e=e[At]||e[Mt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Mn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(l(33))}function ao(e){return e[br]||null}var Bi=[],Rn=-1;function Xt(e){return{current:e}}function Le(e){0>Rn||(e.current=Bi[Rn],Bi[Rn]=null,Rn--)}function Te(e,t){Rn++,Bi[Rn]=e.current,e.current=t}var qt={},Ye=Xt(qt),ot=Xt(!1),un=qt;function Pn(e,t){var r=e.type.contextTypes;if(!r)return qt;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var i={},a;for(a in r)i[a]=t[a];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function it(e){return e=e.childContextTypes,e!=null}function lo(){Le(ot),Le(Ye)}function ml(e,t,r){if(Ye.current!==qt)throw Error(l(168));Te(Ye,t),Te(ot,r)}function xl(e,t,r){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return r;o=o.getChildContext();for(var i in o)if(!(i in t))throw Error(l(108,_(e)||"Unknown",i));return F({},r,o)}function co(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||qt,un=Ye.current,Te(Ye,e),Te(ot,ot.current),!0}function _l(e,t,r){var o=e.stateNode;if(!o)throw Error(l(169));r?(e=xl(e,t,un),o.__reactInternalMemoizedMergedChildContext=e,Le(ot),Le(Ye),Te(Ye,e)):Le(ot),Te(ot,r)}var Rt=null,uo=!1,Ki=!1;function wl(e){Rt===null?Rt=[e]:Rt.push(e)}function Ru(e){uo=!0,wl(e)}function Yt(){if(!Ki&&Rt!==null){Ki=!0;var e=0,t=Ee;try{var r=Rt;for(Ee=1;e<r.length;e++){var o=r[e];do o=o(!0);while(o!==null)}Rt=null,uo=!1}catch(i){throw Rt!==null&&(Rt=Rt.slice(e+1)),ya(pi,Yt),i}finally{Ee=t,Ki=!1}}return null}var Dn=[],Wn=0,po=null,ho=0,ft=[],gt=0,pn=null,Pt=1,Dt="";function hn(e,t){Dn[Wn++]=ho,Dn[Wn++]=po,po=e,ho=t}function bl(e,t,r){ft[gt++]=Pt,ft[gt++]=Dt,ft[gt++]=pn,pn=e;var o=Pt;e=Dt;var i=32-yt(o)-1;o&=~(1<<i),r+=1;var a=32-yt(t)+i;if(30<a){var d=i-i%5;a=(o&(1<<d)-1).toString(32),o>>=d,i-=d,Pt=1<<32-yt(t)+i|r<<i|o,Dt=a+e}else Pt=1<<a|r<<i|o,Dt=e}function Vi(e){e.return!==null&&(hn(e,1),bl(e,1,0))}function Hi(e){for(;e===po;)po=Dn[--Wn],Dn[Wn]=null,ho=Dn[--Wn],Dn[Wn]=null;for(;e===pn;)pn=ft[--gt],ft[gt]=null,Dt=ft[--gt],ft[gt]=null,Pt=ft[--gt],ft[gt]=null}var ut=null,pt=null,Me=!1,vt=null;function yl(e,t){var r=wt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function kl(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ut=e,pt=Qt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ut=e,pt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=pn!==null?{id:Pt,overflow:Dt}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=wt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,ut=e,pt=null,!0):!1;default:return!1}}function Gi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Qi(e){if(Me){var t=pt;if(t){var r=t;if(!kl(e,t)){if(Gi(e))throw Error(l(418));t=Qt(r.nextSibling);var o=ut;t&&kl(e,t)?yl(o,r):(e.flags=e.flags&-4097|2,Me=!1,ut=e)}}else{if(Gi(e))throw Error(l(418));e.flags=e.flags&-4097|2,Me=!1,ut=e}}}function vl(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ut=e}function fo(e){if(e!==ut)return!1;if(!Me)return vl(e),Me=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Fi(e.type,e.memoizedProps)),t&&(t=pt)){if(Gi(e))throw jl(),Error(l(418));for(;t;)yl(e,t),t=Qt(t.nextSibling)}if(vl(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(l(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){pt=Qt(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}pt=null}}else pt=ut?Qt(e.stateNode.nextSibling):null;return!0}function jl(){for(var e=pt;e;)e=Qt(e.nextSibling)}function Fn(){pt=ut=null,Me=!1}function Xi(e){vt===null?vt=[e]:vt.push(e)}var Pu=V.ReactCurrentBatchConfig;function kr(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(l(309));var o=r.stateNode}if(!o)throw Error(l(147,e));var i=o,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(d){var x=i.refs;d===null?delete x[a]:x[a]=d},t._stringRef=a,t)}if(typeof e!="string")throw Error(l(284));if(!r._owner)throw Error(l(290,e))}return e}function go(e,t){throw e=Object.prototype.toString.call(t),Error(l(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Sl(e){var t=e._init;return t(e._payload)}function Cl(e){function t(S,b){if(e){var I=S.deletions;I===null?(S.deletions=[b],S.flags|=16):I.push(b)}}function r(S,b){if(!e)return null;for(;b!==null;)t(S,b),b=b.sibling;return null}function o(S,b){for(S=new Map;b!==null;)b.key!==null?S.set(b.key,b):S.set(b.index,b),b=b.sibling;return S}function i(S,b){return S=sn(S,b),S.index=0,S.sibling=null,S}function a(S,b,I){return S.index=I,e?(I=S.alternate,I!==null?(I=I.index,I<b?(S.flags|=2,b):I):(S.flags|=2,b)):(S.flags|=1048576,b)}function d(S){return e&&S.alternate===null&&(S.flags|=2),S}function x(S,b,I,re){return b===null||b.tag!==6?(b=Os(I,S.mode,re),b.return=S,b):(b=i(b,I),b.return=S,b)}function w(S,b,I,re){var ge=I.type;return ge===oe?Y(S,b,I.props.children,re,I.key):b!==null&&(b.elementType===ge||typeof ge=="object"&&ge!==null&&ge.$$typeof===Q&&Sl(ge)===b.type)?(re=i(b,I.props),re.ref=kr(S,b,I),re.return=S,re):(re=Fo(I.type,I.key,I.props,null,S.mode,re),re.ref=kr(S,b,I),re.return=S,re)}function T(S,b,I,re){return b===null||b.tag!==4||b.stateNode.containerInfo!==I.containerInfo||b.stateNode.implementation!==I.implementation?(b=Us(I,S.mode,re),b.return=S,b):(b=i(b,I.children||[]),b.return=S,b)}function Y(S,b,I,re,ge){return b===null||b.tag!==7?(b=yn(I,S.mode,re,ge),b.return=S,b):(b=i(b,I),b.return=S,b)}function ee(S,b,I){if(typeof b=="string"&&b!==""||typeof b=="number")return b=Os(""+b,S.mode,I),b.return=S,b;if(typeof b=="object"&&b!==null){switch(b.$$typeof){case B:return I=Fo(b.type,b.key,b.props,null,S.mode,I),I.ref=kr(S,null,b),I.return=S,I;case X:return b=Us(b,S.mode,I),b.return=S,b;case Q:var re=b._init;return ee(S,re(b._payload),I)}if(Yn(b)||M(b))return b=yn(b,S.mode,I,null),b.return=S,b;go(S,b)}return null}function q(S,b,I,re){var ge=b!==null?b.key:null;if(typeof I=="string"&&I!==""||typeof I=="number")return ge!==null?null:x(S,b,""+I,re);if(typeof I=="object"&&I!==null){switch(I.$$typeof){case B:return I.key===ge?w(S,b,I,re):null;case X:return I.key===ge?T(S,b,I,re):null;case Q:return ge=I._init,q(S,b,ge(I._payload),re)}if(Yn(I)||M(I))return ge!==null?null:Y(S,b,I,re,null);go(S,I)}return null}function le(S,b,I,re,ge){if(typeof re=="string"&&re!==""||typeof re=="number")return S=S.get(I)||null,x(b,S,""+re,ge);if(typeof re=="object"&&re!==null){switch(re.$$typeof){case B:return S=S.get(re.key===null?I:re.key)||null,w(b,S,re,ge);case X:return S=S.get(re.key===null?I:re.key)||null,T(b,S,re,ge);case Q:var we=re._init;return le(S,b,I,we(re._payload),ge)}if(Yn(re)||M(re))return S=S.get(I)||null,Y(b,S,re,ge,null);go(b,re)}return null}function ue(S,b,I,re){for(var ge=null,we=null,be=b,ye=b=0,Qe=null;be!==null&&ye<I.length;ye++){be.index>ye?(Qe=be,be=null):Qe=be.sibling;var Ne=q(S,be,I[ye],re);if(Ne===null){be===null&&(be=Qe);break}e&&be&&Ne.alternate===null&&t(S,be),b=a(Ne,b,ye),we===null?ge=Ne:we.sibling=Ne,we=Ne,be=Qe}if(ye===I.length)return r(S,be),Me&&hn(S,ye),ge;if(be===null){for(;ye<I.length;ye++)be=ee(S,I[ye],re),be!==null&&(b=a(be,b,ye),we===null?ge=be:we.sibling=be,we=be);return Me&&hn(S,ye),ge}for(be=o(S,be);ye<I.length;ye++)Qe=le(be,S,ye,I[ye],re),Qe!==null&&(e&&Qe.alternate!==null&&be.delete(Qe.key===null?ye:Qe.key),b=a(Qe,b,ye),we===null?ge=Qe:we.sibling=Qe,we=Qe);return e&&be.forEach(function(an){return t(S,an)}),Me&&hn(S,ye),ge}function he(S,b,I,re){var ge=M(I);if(typeof ge!="function")throw Error(l(150));if(I=ge.call(I),I==null)throw Error(l(151));for(var we=ge=null,be=b,ye=b=0,Qe=null,Ne=I.next();be!==null&&!Ne.done;ye++,Ne=I.next()){be.index>ye?(Qe=be,be=null):Qe=be.sibling;var an=q(S,be,Ne.value,re);if(an===null){be===null&&(be=Qe);break}e&&be&&an.alternate===null&&t(S,be),b=a(an,b,ye),we===null?ge=an:we.sibling=an,we=an,be=Qe}if(Ne.done)return r(S,be),Me&&hn(S,ye),ge;if(be===null){for(;!Ne.done;ye++,Ne=I.next())Ne=ee(S,Ne.value,re),Ne!==null&&(b=a(Ne,b,ye),we===null?ge=Ne:we.sibling=Ne,we=Ne);return Me&&hn(S,ye),ge}for(be=o(S,be);!Ne.done;ye++,Ne=I.next())Ne=le(be,S,ye,Ne.value,re),Ne!==null&&(e&&Ne.alternate!==null&&be.delete(Ne.key===null?ye:Ne.key),b=a(Ne,b,ye),we===null?ge=Ne:we.sibling=Ne,we=Ne);return e&&be.forEach(function(gp){return t(S,gp)}),Me&&hn(S,ye),ge}function Ue(S,b,I,re){if(typeof I=="object"&&I!==null&&I.type===oe&&I.key===null&&(I=I.props.children),typeof I=="object"&&I!==null){switch(I.$$typeof){case B:e:{for(var ge=I.key,we=b;we!==null;){if(we.key===ge){if(ge=I.type,ge===oe){if(we.tag===7){r(S,we.sibling),b=i(we,I.props.children),b.return=S,S=b;break e}}else if(we.elementType===ge||typeof ge=="object"&&ge!==null&&ge.$$typeof===Q&&Sl(ge)===we.type){r(S,we.sibling),b=i(we,I.props),b.ref=kr(S,we,I),b.return=S,S=b;break e}r(S,we);break}else t(S,we);we=we.sibling}I.type===oe?(b=yn(I.props.children,S.mode,re,I.key),b.return=S,S=b):(re=Fo(I.type,I.key,I.props,null,S.mode,re),re.ref=kr(S,b,I),re.return=S,S=re)}return d(S);case X:e:{for(we=I.key;b!==null;){if(b.key===we)if(b.tag===4&&b.stateNode.containerInfo===I.containerInfo&&b.stateNode.implementation===I.implementation){r(S,b.sibling),b=i(b,I.children||[]),b.return=S,S=b;break e}else{r(S,b);break}else t(S,b);b=b.sibling}b=Us(I,S.mode,re),b.return=S,S=b}return d(S);case Q:return we=I._init,Ue(S,b,we(I._payload),re)}if(Yn(I))return ue(S,b,I,re);if(M(I))return he(S,b,I,re);go(S,I)}return typeof I=="string"&&I!==""||typeof I=="number"?(I=""+I,b!==null&&b.tag===6?(r(S,b.sibling),b=i(b,I),b.return=S,S=b):(r(S,b),b=Os(I,S.mode,re),b.return=S,S=b),d(S)):r(S,b)}return Ue}var On=Cl(!0),Nl=Cl(!1),mo=Xt(null),xo=null,Un=null,qi=null;function Yi(){qi=Un=xo=null}function Ji(e){var t=mo.current;Le(mo),e._currentValue=t}function Zi(e,t,r){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===r)break;e=e.return}}function $n(e,t){xo=e,qi=Un=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(st=!0),e.firstContext=null)}function mt(e){var t=e._currentValue;if(qi!==e)if(e={context:e,memoizedValue:t,next:null},Un===null){if(xo===null)throw Error(l(308));Un=e,xo.dependencies={lanes:0,firstContext:e}}else Un=Un.next=e;return t}var fn=null;function es(e){fn===null?fn=[e]:fn.push(e)}function Il(e,t,r,o){var i=t.interleaved;return i===null?(r.next=r,es(t)):(r.next=i.next,i.next=r),t.interleaved=r,Wt(e,o)}function Wt(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var Jt=!1;function ts(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function El(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Ft(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Zt(e,t,r){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ce&2)!==0){var i=o.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),o.pending=t,Wt(e,r)}return i=o.interleaved,i===null?(t.next=t,es(o)):(t.next=i.next,i.next=t),o.interleaved=t,Wt(e,r)}function _o(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,gi(e,r)}}function Al(e,t){var r=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,r===o)){var i=null,a=null;if(r=r.firstBaseUpdate,r!==null){do{var d={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};a===null?i=a=d:a=a.next=d,r=r.next}while(r!==null);a===null?i=a=t:a=a.next=t}else i=a=t;r={baseState:o.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:o.shared,effects:o.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function wo(e,t,r,o){var i=e.updateQueue;Jt=!1;var a=i.firstBaseUpdate,d=i.lastBaseUpdate,x=i.shared.pending;if(x!==null){i.shared.pending=null;var w=x,T=w.next;w.next=null,d===null?a=T:d.next=T,d=w;var Y=e.alternate;Y!==null&&(Y=Y.updateQueue,x=Y.lastBaseUpdate,x!==d&&(x===null?Y.firstBaseUpdate=T:x.next=T,Y.lastBaseUpdate=w))}if(a!==null){var ee=i.baseState;d=0,Y=T=w=null,x=a;do{var q=x.lane,le=x.eventTime;if((o&q)===q){Y!==null&&(Y=Y.next={eventTime:le,lane:0,tag:x.tag,payload:x.payload,callback:x.callback,next:null});e:{var ue=e,he=x;switch(q=t,le=r,he.tag){case 1:if(ue=he.payload,typeof ue=="function"){ee=ue.call(le,ee,q);break e}ee=ue;break e;case 3:ue.flags=ue.flags&-65537|128;case 0:if(ue=he.payload,q=typeof ue=="function"?ue.call(le,ee,q):ue,q==null)break e;ee=F({},ee,q);break e;case 2:Jt=!0}}x.callback!==null&&x.lane!==0&&(e.flags|=64,q=i.effects,q===null?i.effects=[x]:q.push(x))}else le={eventTime:le,lane:q,tag:x.tag,payload:x.payload,callback:x.callback,next:null},Y===null?(T=Y=le,w=ee):Y=Y.next=le,d|=q;if(x=x.next,x===null){if(x=i.shared.pending,x===null)break;q=x,x=q.next,q.next=null,i.lastBaseUpdate=q,i.shared.pending=null}}while(!0);if(Y===null&&(w=ee),i.baseState=w,i.firstBaseUpdate=T,i.lastBaseUpdate=Y,t=i.shared.interleaved,t!==null){i=t;do d|=i.lane,i=i.next;while(i!==t)}else a===null&&(i.shared.lanes=0);xn|=d,e.lanes=d,e.memoizedState=ee}}function Tl(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],i=o.callback;if(i!==null){if(o.callback=null,o=r,typeof i!="function")throw Error(l(191,i));i.call(o)}}}var vr={},Tt=Xt(vr),jr=Xt(vr),Sr=Xt(vr);function gn(e){if(e===vr)throw Error(l(174));return e}function ns(e,t){switch(Te(Sr,t),Te(jr,e),Te(Tt,vr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ri(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ri(t,e)}Le(Tt),Te(Tt,t)}function Bn(){Le(Tt),Le(jr),Le(Sr)}function zl(e){gn(Sr.current);var t=gn(Tt.current),r=ri(t,e.type);t!==r&&(Te(jr,e),Te(Tt,r))}function rs(e){jr.current===e&&(Le(Tt),Le(jr))}var Re=Xt(0);function bo(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var os=[];function is(){for(var e=0;e<os.length;e++)os[e]._workInProgressVersionPrimary=null;os.length=0}var yo=V.ReactCurrentDispatcher,ss=V.ReactCurrentBatchConfig,mn=0,Pe=null,Be=null,He=null,ko=!1,Cr=!1,Nr=0,Du=0;function Je(){throw Error(l(321))}function as(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!kt(e[r],t[r]))return!1;return!0}function ls(e,t,r,o,i,a){if(mn=a,Pe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,yo.current=e===null||e.memoizedState===null?Uu:$u,e=r(o,i),Cr){a=0;do{if(Cr=!1,Nr=0,25<=a)throw Error(l(301));a+=1,He=Be=null,t.updateQueue=null,yo.current=Bu,e=r(o,i)}while(Cr)}if(yo.current=So,t=Be!==null&&Be.next!==null,mn=0,He=Be=Pe=null,ko=!1,t)throw Error(l(300));return e}function cs(){var e=Nr!==0;return Nr=0,e}function zt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return He===null?Pe.memoizedState=He=e:He=He.next=e,He}function xt(){if(Be===null){var e=Pe.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var t=He===null?Pe.memoizedState:He.next;if(t!==null)He=t,Be=e;else{if(e===null)throw Error(l(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},He===null?Pe.memoizedState=He=e:He=He.next=e}return He}function Ir(e,t){return typeof t=="function"?t(e):t}function ds(e){var t=xt(),r=t.queue;if(r===null)throw Error(l(311));r.lastRenderedReducer=e;var o=Be,i=o.baseQueue,a=r.pending;if(a!==null){if(i!==null){var d=i.next;i.next=a.next,a.next=d}o.baseQueue=i=a,r.pending=null}if(i!==null){a=i.next,o=o.baseState;var x=d=null,w=null,T=a;do{var Y=T.lane;if((mn&Y)===Y)w!==null&&(w=w.next={lane:0,action:T.action,hasEagerState:T.hasEagerState,eagerState:T.eagerState,next:null}),o=T.hasEagerState?T.eagerState:e(o,T.action);else{var ee={lane:Y,action:T.action,hasEagerState:T.hasEagerState,eagerState:T.eagerState,next:null};w===null?(x=w=ee,d=o):w=w.next=ee,Pe.lanes|=Y,xn|=Y}T=T.next}while(T!==null&&T!==a);w===null?d=o:w.next=x,kt(o,t.memoizedState)||(st=!0),t.memoizedState=o,t.baseState=d,t.baseQueue=w,r.lastRenderedState=o}if(e=r.interleaved,e!==null){i=e;do a=i.lane,Pe.lanes|=a,xn|=a,i=i.next;while(i!==e)}else i===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function us(e){var t=xt(),r=t.queue;if(r===null)throw Error(l(311));r.lastRenderedReducer=e;var o=r.dispatch,i=r.pending,a=t.memoizedState;if(i!==null){r.pending=null;var d=i=i.next;do a=e(a,d.action),d=d.next;while(d!==i);kt(a,t.memoizedState)||(st=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),r.lastRenderedState=a}return[a,o]}function Ll(){}function Ml(e,t){var r=Pe,o=xt(),i=t(),a=!kt(o.memoizedState,i);if(a&&(o.memoizedState=i,st=!0),o=o.queue,ps(Dl.bind(null,r,o,e),[e]),o.getSnapshot!==t||a||He!==null&&He.memoizedState.tag&1){if(r.flags|=2048,Er(9,Pl.bind(null,r,o,i,t),void 0,null),Ge===null)throw Error(l(349));(mn&30)!==0||Rl(r,t,i)}return i}function Rl(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=Pe.updateQueue,t===null?(t={lastEffect:null,stores:null},Pe.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function Pl(e,t,r,o){t.value=r,t.getSnapshot=o,Wl(t)&&Fl(e)}function Dl(e,t,r){return r(function(){Wl(t)&&Fl(e)})}function Wl(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!kt(e,r)}catch{return!0}}function Fl(e){var t=Wt(e,1);t!==null&&Nt(t,e,1,-1)}function Ol(e){var t=zt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ir,lastRenderedState:e},t.queue=e,e=e.dispatch=Ou.bind(null,Pe,e),[t.memoizedState,e]}function Er(e,t,r,o){return e={tag:e,create:t,destroy:r,deps:o,next:null},t=Pe.updateQueue,t===null?(t={lastEffect:null,stores:null},Pe.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(o=r.next,r.next=e,e.next=o,t.lastEffect=e)),e}function Ul(){return xt().memoizedState}function vo(e,t,r,o){var i=zt();Pe.flags|=e,i.memoizedState=Er(1|t,r,void 0,o===void 0?null:o)}function jo(e,t,r,o){var i=xt();o=o===void 0?null:o;var a=void 0;if(Be!==null){var d=Be.memoizedState;if(a=d.destroy,o!==null&&as(o,d.deps)){i.memoizedState=Er(t,r,a,o);return}}Pe.flags|=e,i.memoizedState=Er(1|t,r,a,o)}function $l(e,t){return vo(8390656,8,e,t)}function ps(e,t){return jo(2048,8,e,t)}function Bl(e,t){return jo(4,2,e,t)}function Kl(e,t){return jo(4,4,e,t)}function Vl(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Hl(e,t,r){return r=r!=null?r.concat([e]):null,jo(4,4,Vl.bind(null,t,e),r)}function hs(){}function Gl(e,t){var r=xt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&as(t,o[1])?o[0]:(r.memoizedState=[e,t],e)}function Ql(e,t){var r=xt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&as(t,o[1])?o[0]:(e=e(),r.memoizedState=[e,t],e)}function Xl(e,t,r){return(mn&21)===0?(e.baseState&&(e.baseState=!1,st=!0),e.memoizedState=r):(kt(r,t)||(r=Sa(),Pe.lanes|=r,xn|=r,e.baseState=!0),t)}function Wu(e,t){var r=Ee;Ee=r!==0&&4>r?r:4,e(!0);var o=ss.transition;ss.transition={};try{e(!1),t()}finally{Ee=r,ss.transition=o}}function ql(){return xt().memoizedState}function Fu(e,t,r){var o=rn(e);if(r={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null},Yl(e))Jl(t,r);else if(r=Il(e,t,r,o),r!==null){var i=rt();Nt(r,e,o,i),Zl(r,t,o)}}function Ou(e,t,r){var o=rn(e),i={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null};if(Yl(e))Jl(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var d=t.lastRenderedState,x=a(d,r);if(i.hasEagerState=!0,i.eagerState=x,kt(x,d)){var w=t.interleaved;w===null?(i.next=i,es(t)):(i.next=w.next,w.next=i),t.interleaved=i;return}}catch{}r=Il(e,t,i,o),r!==null&&(i=rt(),Nt(r,e,o,i),Zl(r,t,o))}}function Yl(e){var t=e.alternate;return e===Pe||t!==null&&t===Pe}function Jl(e,t){Cr=ko=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function Zl(e,t,r){if((r&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,gi(e,r)}}var So={readContext:mt,useCallback:Je,useContext:Je,useEffect:Je,useImperativeHandle:Je,useInsertionEffect:Je,useLayoutEffect:Je,useMemo:Je,useReducer:Je,useRef:Je,useState:Je,useDebugValue:Je,useDeferredValue:Je,useTransition:Je,useMutableSource:Je,useSyncExternalStore:Je,useId:Je,unstable_isNewReconciler:!1},Uu={readContext:mt,useCallback:function(e,t){return zt().memoizedState=[e,t===void 0?null:t],e},useContext:mt,useEffect:$l,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,vo(4194308,4,Vl.bind(null,t,e),r)},useLayoutEffect:function(e,t){return vo(4194308,4,e,t)},useInsertionEffect:function(e,t){return vo(4,2,e,t)},useMemo:function(e,t){var r=zt();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var o=zt();return t=r!==void 0?r(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=Fu.bind(null,Pe,e),[o.memoizedState,e]},useRef:function(e){var t=zt();return e={current:e},t.memoizedState=e},useState:Ol,useDebugValue:hs,useDeferredValue:function(e){return zt().memoizedState=e},useTransition:function(){var e=Ol(!1),t=e[0];return e=Wu.bind(null,e[1]),zt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var o=Pe,i=zt();if(Me){if(r===void 0)throw Error(l(407));r=r()}else{if(r=t(),Ge===null)throw Error(l(349));(mn&30)!==0||Rl(o,t,r)}i.memoizedState=r;var a={value:r,getSnapshot:t};return i.queue=a,$l(Dl.bind(null,o,a,e),[e]),o.flags|=2048,Er(9,Pl.bind(null,o,a,r,t),void 0,null),r},useId:function(){var e=zt(),t=Ge.identifierPrefix;if(Me){var r=Dt,o=Pt;r=(o&~(1<<32-yt(o)-1)).toString(32)+r,t=":"+t+"R"+r,r=Nr++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=Du++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},$u={readContext:mt,useCallback:Gl,useContext:mt,useEffect:ps,useImperativeHandle:Hl,useInsertionEffect:Bl,useLayoutEffect:Kl,useMemo:Ql,useReducer:ds,useRef:Ul,useState:function(){return ds(Ir)},useDebugValue:hs,useDeferredValue:function(e){var t=xt();return Xl(t,Be.memoizedState,e)},useTransition:function(){var e=ds(Ir)[0],t=xt().memoizedState;return[e,t]},useMutableSource:Ll,useSyncExternalStore:Ml,useId:ql,unstable_isNewReconciler:!1},Bu={readContext:mt,useCallback:Gl,useContext:mt,useEffect:ps,useImperativeHandle:Hl,useInsertionEffect:Bl,useLayoutEffect:Kl,useMemo:Ql,useReducer:us,useRef:Ul,useState:function(){return us(Ir)},useDebugValue:hs,useDeferredValue:function(e){var t=xt();return Be===null?t.memoizedState=e:Xl(t,Be.memoizedState,e)},useTransition:function(){var e=us(Ir)[0],t=xt().memoizedState;return[e,t]},useMutableSource:Ll,useSyncExternalStore:Ml,useId:ql,unstable_isNewReconciler:!1};function jt(e,t){if(e&&e.defaultProps){t=F({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function fs(e,t,r,o){t=e.memoizedState,r=r(o,t),r=r==null?t:F({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Co={isMounted:function(e){return(e=e._reactInternals)?cn(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var o=rt(),i=rn(e),a=Ft(o,i);a.payload=t,r!=null&&(a.callback=r),t=Zt(e,a,i),t!==null&&(Nt(t,e,i,o),_o(t,e,i))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var o=rt(),i=rn(e),a=Ft(o,i);a.tag=1,a.payload=t,r!=null&&(a.callback=r),t=Zt(e,a,i),t!==null&&(Nt(t,e,i,o),_o(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=rt(),o=rn(e),i=Ft(r,o);i.tag=2,t!=null&&(i.callback=t),t=Zt(e,i,o),t!==null&&(Nt(t,e,o,r),_o(t,e,o))}};function ec(e,t,r,o,i,a,d){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,a,d):t.prototype&&t.prototype.isPureReactComponent?!gr(r,o)||!gr(i,a):!0}function tc(e,t,r){var o=!1,i=qt,a=t.contextType;return typeof a=="object"&&a!==null?a=mt(a):(i=it(t)?un:Ye.current,o=t.contextTypes,a=(o=o!=null)?Pn(e,i):qt),t=new t(r,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Co,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=a),t}function nc(e,t,r,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,o),t.state!==e&&Co.enqueueReplaceState(t,t.state,null)}function gs(e,t,r,o){var i=e.stateNode;i.props=r,i.state=e.memoizedState,i.refs={},ts(e);var a=t.contextType;typeof a=="object"&&a!==null?i.context=mt(a):(a=it(t)?un:Ye.current,i.context=Pn(e,a)),i.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(fs(e,t,a,r),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&Co.enqueueReplaceState(i,i.state,null),wo(e,r,i,o),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function Kn(e,t){try{var r="",o=t;do r+=L(o),o=o.return;while(o);var i=r}catch(a){i=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:i,digest:null}}function ms(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function xs(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var Ku=typeof WeakMap=="function"?WeakMap:Map;function rc(e,t,r){r=Ft(-1,r),r.tag=3,r.payload={element:null};var o=t.value;return r.callback=function(){Lo||(Lo=!0,zs=o),xs(e,t)},r}function oc(e,t,r){r=Ft(-1,r),r.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var i=t.value;r.payload=function(){return o(i)},r.callback=function(){xs(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(r.callback=function(){xs(e,t),typeof o!="function"&&(tn===null?tn=new Set([this]):tn.add(this));var d=t.stack;this.componentDidCatch(t.value,{componentStack:d!==null?d:""})}),r}function ic(e,t,r){var o=e.pingCache;if(o===null){o=e.pingCache=new Ku;var i=new Set;o.set(t,i)}else i=o.get(t),i===void 0&&(i=new Set,o.set(t,i));i.has(r)||(i.add(r),e=op.bind(null,e,t,r),t.then(e,e))}function sc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function ac(e,t,r,o,i){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=Ft(-1,1),t.tag=2,Zt(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=i,e)}var Vu=V.ReactCurrentOwner,st=!1;function nt(e,t,r,o){t.child=e===null?Nl(t,null,r,o):On(t,e.child,r,o)}function lc(e,t,r,o,i){r=r.render;var a=t.ref;return $n(t,i),o=ls(e,t,r,o,a,i),r=cs(),e!==null&&!st?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ot(e,t,i)):(Me&&r&&Vi(t),t.flags|=1,nt(e,t,o,i),t.child)}function cc(e,t,r,o,i){if(e===null){var a=r.type;return typeof a=="function"&&!Fs(a)&&a.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=a,dc(e,t,a,o,i)):(e=Fo(r.type,null,o,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&i)===0){var d=a.memoizedProps;if(r=r.compare,r=r!==null?r:gr,r(d,o)&&e.ref===t.ref)return Ot(e,t,i)}return t.flags|=1,e=sn(a,o),e.ref=t.ref,e.return=t,t.child=e}function dc(e,t,r,o,i){if(e!==null){var a=e.memoizedProps;if(gr(a,o)&&e.ref===t.ref)if(st=!1,t.pendingProps=o=a,(e.lanes&i)!==0)(e.flags&131072)!==0&&(st=!0);else return t.lanes=e.lanes,Ot(e,t,i)}return _s(e,t,r,o,i)}function uc(e,t,r){var o=t.pendingProps,i=o.children,a=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Te(Hn,ht),ht|=r;else{if((r&1073741824)===0)return e=a!==null?a.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Te(Hn,ht),ht|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=a!==null?a.baseLanes:r,Te(Hn,ht),ht|=o}else a!==null?(o=a.baseLanes|r,t.memoizedState=null):o=r,Te(Hn,ht),ht|=o;return nt(e,t,i,r),t.child}function pc(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function _s(e,t,r,o,i){var a=it(r)?un:Ye.current;return a=Pn(t,a),$n(t,i),r=ls(e,t,r,o,a,i),o=cs(),e!==null&&!st?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ot(e,t,i)):(Me&&o&&Vi(t),t.flags|=1,nt(e,t,r,i),t.child)}function hc(e,t,r,o,i){if(it(r)){var a=!0;co(t)}else a=!1;if($n(t,i),t.stateNode===null)Io(e,t),tc(t,r,o),gs(t,r,o,i),o=!0;else if(e===null){var d=t.stateNode,x=t.memoizedProps;d.props=x;var w=d.context,T=r.contextType;typeof T=="object"&&T!==null?T=mt(T):(T=it(r)?un:Ye.current,T=Pn(t,T));var Y=r.getDerivedStateFromProps,ee=typeof Y=="function"||typeof d.getSnapshotBeforeUpdate=="function";ee||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(x!==o||w!==T)&&nc(t,d,o,T),Jt=!1;var q=t.memoizedState;d.state=q,wo(t,o,d,i),w=t.memoizedState,x!==o||q!==w||ot.current||Jt?(typeof Y=="function"&&(fs(t,r,Y,o),w=t.memoizedState),(x=Jt||ec(t,r,x,o,q,w,T))?(ee||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(t.flags|=4194308)):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=w),d.props=o,d.state=w,d.context=T,o=x):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{d=t.stateNode,El(e,t),x=t.memoizedProps,T=t.type===t.elementType?x:jt(t.type,x),d.props=T,ee=t.pendingProps,q=d.context,w=r.contextType,typeof w=="object"&&w!==null?w=mt(w):(w=it(r)?un:Ye.current,w=Pn(t,w));var le=r.getDerivedStateFromProps;(Y=typeof le=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(x!==ee||q!==w)&&nc(t,d,o,w),Jt=!1,q=t.memoizedState,d.state=q,wo(t,o,d,i);var ue=t.memoizedState;x!==ee||q!==ue||ot.current||Jt?(typeof le=="function"&&(fs(t,r,le,o),ue=t.memoizedState),(T=Jt||ec(t,r,T,o,q,ue,w)||!1)?(Y||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(o,ue,w),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(o,ue,w)),typeof d.componentDidUpdate=="function"&&(t.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof d.componentDidUpdate!="function"||x===e.memoizedProps&&q===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&q===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=ue),d.props=o,d.state=ue,d.context=w,o=T):(typeof d.componentDidUpdate!="function"||x===e.memoizedProps&&q===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&q===e.memoizedState||(t.flags|=1024),o=!1)}return ws(e,t,r,o,a,i)}function ws(e,t,r,o,i,a){pc(e,t);var d=(t.flags&128)!==0;if(!o&&!d)return i&&_l(t,r,!1),Ot(e,t,a);o=t.stateNode,Vu.current=t;var x=d&&typeof r.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&d?(t.child=On(t,e.child,null,a),t.child=On(t,null,x,a)):nt(e,t,x,a),t.memoizedState=o.state,i&&_l(t,r,!0),t.child}function fc(e){var t=e.stateNode;t.pendingContext?ml(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ml(e,t.context,!1),ns(e,t.containerInfo)}function gc(e,t,r,o,i){return Fn(),Xi(i),t.flags|=256,nt(e,t,r,o),t.child}var bs={dehydrated:null,treeContext:null,retryLane:0};function ys(e){return{baseLanes:e,cachePool:null,transitions:null}}function mc(e,t,r){var o=t.pendingProps,i=Re.current,a=!1,d=(t.flags&128)!==0,x;if((x=d)||(x=e!==null&&e.memoizedState===null?!1:(i&2)!==0),x?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),Te(Re,i&1),e===null)return Qi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(d=o.children,e=o.fallback,a?(o=t.mode,a=t.child,d={mode:"hidden",children:d},(o&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=d):a=Oo(d,o,0,null),e=yn(e,o,r,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=ys(r),t.memoizedState=bs,e):ks(t,d));if(i=e.memoizedState,i!==null&&(x=i.dehydrated,x!==null))return Hu(e,t,d,o,x,i,r);if(a){a=o.fallback,d=t.mode,i=e.child,x=i.sibling;var w={mode:"hidden",children:o.children};return(d&1)===0&&t.child!==i?(o=t.child,o.childLanes=0,o.pendingProps=w,t.deletions=null):(o=sn(i,w),o.subtreeFlags=i.subtreeFlags&14680064),x!==null?a=sn(x,a):(a=yn(a,d,r,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,o=a,a=t.child,d=e.child.memoizedState,d=d===null?ys(r):{baseLanes:d.baseLanes|r,cachePool:null,transitions:d.transitions},a.memoizedState=d,a.childLanes=e.childLanes&~r,t.memoizedState=bs,o}return a=e.child,e=a.sibling,o=sn(a,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=r),o.return=t,o.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=o,t.memoizedState=null,o}function ks(e,t){return t=Oo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function No(e,t,r,o){return o!==null&&Xi(o),On(t,e.child,null,r),e=ks(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Hu(e,t,r,o,i,a,d){if(r)return t.flags&256?(t.flags&=-257,o=ms(Error(l(422))),No(e,t,d,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=o.fallback,i=t.mode,o=Oo({mode:"visible",children:o.children},i,0,null),a=yn(a,i,d,null),a.flags|=2,o.return=t,a.return=t,o.sibling=a,t.child=o,(t.mode&1)!==0&&On(t,e.child,null,d),t.child.memoizedState=ys(d),t.memoizedState=bs,a);if((t.mode&1)===0)return No(e,t,d,null);if(i.data==="$!"){if(o=i.nextSibling&&i.nextSibling.dataset,o)var x=o.dgst;return o=x,a=Error(l(419)),o=ms(a,o,void 0),No(e,t,d,o)}if(x=(d&e.childLanes)!==0,st||x){if(o=Ge,o!==null){switch(d&-d){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=(i&(o.suspendedLanes|d))!==0?0:i,i!==0&&i!==a.retryLane&&(a.retryLane=i,Wt(e,i),Nt(o,e,i,-1))}return Ws(),o=ms(Error(l(421))),No(e,t,d,o)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=ip.bind(null,e),i._reactRetry=t,null):(e=a.treeContext,pt=Qt(i.nextSibling),ut=t,Me=!0,vt=null,e!==null&&(ft[gt++]=Pt,ft[gt++]=Dt,ft[gt++]=pn,Pt=e.id,Dt=e.overflow,pn=t),t=ks(t,o.children),t.flags|=4096,t)}function xc(e,t,r){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Zi(e.return,t,r)}function vs(e,t,r,o,i){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:r,tailMode:i}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=o,a.tail=r,a.tailMode=i)}function _c(e,t,r){var o=t.pendingProps,i=o.revealOrder,a=o.tail;if(nt(e,t,o.children,r),o=Re.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&xc(e,r,t);else if(e.tag===19)xc(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(Te(Re,o),(t.mode&1)===0)t.memoizedState=null;else switch(i){case"forwards":for(r=t.child,i=null;r!==null;)e=r.alternate,e!==null&&bo(e)===null&&(i=r),r=r.sibling;r=i,r===null?(i=t.child,t.child=null):(i=r.sibling,r.sibling=null),vs(t,!1,i,r,a);break;case"backwards":for(r=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&bo(e)===null){t.child=i;break}e=i.sibling,i.sibling=r,r=i,i=e}vs(t,!0,r,null,a);break;case"together":vs(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Io(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ot(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),xn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(l(153));if(t.child!==null){for(e=t.child,r=sn(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=sn(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function Gu(e,t,r){switch(t.tag){case 3:fc(t),Fn();break;case 5:zl(t);break;case 1:it(t.type)&&co(t);break;case 4:ns(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,i=t.memoizedProps.value;Te(mo,o._currentValue),o._currentValue=i;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(Te(Re,Re.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?mc(e,t,r):(Te(Re,Re.current&1),e=Ot(e,t,r),e!==null?e.sibling:null);Te(Re,Re.current&1);break;case 19:if(o=(r&t.childLanes)!==0,(e.flags&128)!==0){if(o)return _c(e,t,r);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Te(Re,Re.current),o)break;return null;case 22:case 23:return t.lanes=0,uc(e,t,r)}return Ot(e,t,r)}var wc,js,bc,yc;wc=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},js=function(){},bc=function(e,t,r,o){var i=e.memoizedProps;if(i!==o){e=t.stateNode,gn(Tt.current);var a=null;switch(r){case"input":i=ke(e,i),o=ke(e,o),a=[];break;case"select":i=F({},i,{value:void 0}),o=F({},o,{value:void 0}),a=[];break;case"textarea":i=ni(e,i),o=ni(e,o),a=[];break;default:typeof i.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=so)}oi(r,o);var d;r=null;for(T in i)if(!o.hasOwnProperty(T)&&i.hasOwnProperty(T)&&i[T]!=null)if(T==="style"){var x=i[T];for(d in x)x.hasOwnProperty(d)&&(r||(r={}),r[d]="")}else T!=="dangerouslySetInnerHTML"&&T!=="children"&&T!=="suppressContentEditableWarning"&&T!=="suppressHydrationWarning"&&T!=="autoFocus"&&(h.hasOwnProperty(T)?a||(a=[]):(a=a||[]).push(T,null));for(T in o){var w=o[T];if(x=i?.[T],o.hasOwnProperty(T)&&w!==x&&(w!=null||x!=null))if(T==="style")if(x){for(d in x)!x.hasOwnProperty(d)||w&&w.hasOwnProperty(d)||(r||(r={}),r[d]="");for(d in w)w.hasOwnProperty(d)&&x[d]!==w[d]&&(r||(r={}),r[d]=w[d])}else r||(a||(a=[]),a.push(T,r)),r=w;else T==="dangerouslySetInnerHTML"?(w=w?w.__html:void 0,x=x?x.__html:void 0,w!=null&&x!==w&&(a=a||[]).push(T,w)):T==="children"?typeof w!="string"&&typeof w!="number"||(a=a||[]).push(T,""+w):T!=="suppressContentEditableWarning"&&T!=="suppressHydrationWarning"&&(h.hasOwnProperty(T)?(w!=null&&T==="onScroll"&&ze("scroll",e),a||x===w||(a=[])):(a=a||[]).push(T,w))}r&&(a=a||[]).push("style",r);var T=a;(t.updateQueue=T)&&(t.flags|=4)}},yc=function(e,t,r,o){r!==o&&(t.flags|=4)};function Ar(e,t){if(!Me)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,o=0;if(t)for(var i=e.child;i!==null;)r|=i.lanes|i.childLanes,o|=i.subtreeFlags&14680064,o|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)r|=i.lanes|i.childLanes,o|=i.subtreeFlags,o|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=o,e.childLanes=r,t}function Qu(e,t,r){var o=t.pendingProps;switch(Hi(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ze(t),null;case 1:return it(t.type)&&lo(),Ze(t),null;case 3:return o=t.stateNode,Bn(),Le(ot),Le(Ye),is(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(fo(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,vt!==null&&(Rs(vt),vt=null))),js(e,t),Ze(t),null;case 5:rs(t);var i=gn(Sr.current);if(r=t.type,e!==null&&t.stateNode!=null)bc(e,t,r,o,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(l(166));return Ze(t),null}if(e=gn(Tt.current),fo(t)){o=t.stateNode,r=t.type;var a=t.memoizedProps;switch(o[At]=t,o[br]=a,e=(t.mode&1)!==0,r){case"dialog":ze("cancel",o),ze("close",o);break;case"iframe":case"object":case"embed":ze("load",o);break;case"video":case"audio":for(i=0;i<xr.length;i++)ze(xr[i],o);break;case"source":ze("error",o);break;case"img":case"image":case"link":ze("error",o),ze("load",o);break;case"details":ze("toggle",o);break;case"input":Ie(o,a),ze("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!a.multiple},ze("invalid",o);break;case"textarea":oa(o,a),ze("invalid",o)}oi(r,a),i=null;for(var d in a)if(a.hasOwnProperty(d)){var x=a[d];d==="children"?typeof x=="string"?o.textContent!==x&&(a.suppressHydrationWarning!==!0&&io(o.textContent,x,e),i=["children",x]):typeof x=="number"&&o.textContent!==""+x&&(a.suppressHydrationWarning!==!0&&io(o.textContent,x,e),i=["children",""+x]):h.hasOwnProperty(d)&&x!=null&&d==="onScroll"&&ze("scroll",o)}switch(r){case"input":me(o),ln(o,a,!0);break;case"textarea":me(o),sa(o);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(o.onclick=so)}o=i,t.updateQueue=o,o!==null&&(t.flags|=4)}else{d=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=aa(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=d.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=d.createElement(r,{is:o.is}):(e=d.createElement(r),r==="select"&&(d=e,o.multiple?d.multiple=!0:o.size&&(d.size=o.size))):e=d.createElementNS(e,r),e[At]=t,e[br]=o,wc(e,t,!1,!1),t.stateNode=e;e:{switch(d=ii(r,o),r){case"dialog":ze("cancel",e),ze("close",e),i=o;break;case"iframe":case"object":case"embed":ze("load",e),i=o;break;case"video":case"audio":for(i=0;i<xr.length;i++)ze(xr[i],e);i=o;break;case"source":ze("error",e),i=o;break;case"img":case"image":case"link":ze("error",e),ze("load",e),i=o;break;case"details":ze("toggle",e),i=o;break;case"input":Ie(e,o),i=ke(e,o),ze("invalid",e);break;case"option":i=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},i=F({},o,{value:void 0}),ze("invalid",e);break;case"textarea":oa(e,o),i=ni(e,o),ze("invalid",e);break;default:i=o}oi(r,i),x=i;for(a in x)if(x.hasOwnProperty(a)){var w=x[a];a==="style"?da(e,w):a==="dangerouslySetInnerHTML"?(w=w?w.__html:void 0,w!=null&&la(e,w)):a==="children"?typeof w=="string"?(r!=="textarea"||w!=="")&&Jn(e,w):typeof w=="number"&&Jn(e,""+w):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(h.hasOwnProperty(a)?w!=null&&a==="onScroll"&&ze("scroll",e):w!=null&&J(e,a,w,d))}switch(r){case"input":me(e),ln(e,o,!1);break;case"textarea":me(e),sa(e);break;case"option":o.value!=null&&e.setAttribute("value",""+Z(o.value));break;case"select":e.multiple=!!o.multiple,a=o.value,a!=null?jn(e,!!o.multiple,a,!1):o.defaultValue!=null&&jn(e,!!o.multiple,o.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=so)}switch(r){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ze(t),null;case 6:if(e&&t.stateNode!=null)yc(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(l(166));if(r=gn(Sr.current),gn(Tt.current),fo(t)){if(o=t.stateNode,r=t.memoizedProps,o[At]=t,(a=o.nodeValue!==r)&&(e=ut,e!==null))switch(e.tag){case 3:io(o.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&io(o.nodeValue,r,(e.mode&1)!==0)}a&&(t.flags|=4)}else o=(r.nodeType===9?r:r.ownerDocument).createTextNode(o),o[At]=t,t.stateNode=o}return Ze(t),null;case 13:if(Le(Re),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Me&&pt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)jl(),Fn(),t.flags|=98560,a=!1;else if(a=fo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(l(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(l(317));a[At]=t}else Fn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),a=!1}else vt!==null&&(Rs(vt),vt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Re.current&1)!==0?Ke===0&&(Ke=3):Ws())),t.updateQueue!==null&&(t.flags|=4),Ze(t),null);case 4:return Bn(),js(e,t),e===null&&_r(t.stateNode.containerInfo),Ze(t),null;case 10:return Ji(t.type._context),Ze(t),null;case 17:return it(t.type)&&lo(),Ze(t),null;case 19:if(Le(Re),a=t.memoizedState,a===null)return Ze(t),null;if(o=(t.flags&128)!==0,d=a.rendering,d===null)if(o)Ar(a,!1);else{if(Ke!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(d=bo(e),d!==null){for(t.flags|=128,Ar(a,!1),o=d.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=r,r=t.child;r!==null;)a=r,e=o,a.flags&=14680066,d=a.alternate,d===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=d.childLanes,a.lanes=d.lanes,a.child=d.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=d.memoizedProps,a.memoizedState=d.memoizedState,a.updateQueue=d.updateQueue,a.type=d.type,e=d.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return Te(Re,Re.current&1|2),t.child}e=e.sibling}a.tail!==null&&Oe()>Gn&&(t.flags|=128,o=!0,Ar(a,!1),t.lanes=4194304)}else{if(!o)if(e=bo(d),e!==null){if(t.flags|=128,o=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Ar(a,!0),a.tail===null&&a.tailMode==="hidden"&&!d.alternate&&!Me)return Ze(t),null}else 2*Oe()-a.renderingStartTime>Gn&&r!==1073741824&&(t.flags|=128,o=!0,Ar(a,!1),t.lanes=4194304);a.isBackwards?(d.sibling=t.child,t.child=d):(r=a.last,r!==null?r.sibling=d:t.child=d,a.last=d)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Oe(),t.sibling=null,r=Re.current,Te(Re,o?r&1|2:r&1),t):(Ze(t),null);case 22:case 23:return Ds(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(ht&1073741824)!==0&&(Ze(t),t.subtreeFlags&6&&(t.flags|=8192)):Ze(t),null;case 24:return null;case 25:return null}throw Error(l(156,t.tag))}function Xu(e,t){switch(Hi(t),t.tag){case 1:return it(t.type)&&lo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Bn(),Le(ot),Le(Ye),is(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return rs(t),null;case 13:if(Le(Re),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(l(340));Fn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Le(Re),null;case 4:return Bn(),null;case 10:return Ji(t.type._context),null;case 22:case 23:return Ds(),null;case 24:return null;default:return null}}var Eo=!1,et=!1,qu=typeof WeakSet=="function"?WeakSet:Set,de=null;function Vn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(o){We(e,t,o)}else r.current=null}function Ss(e,t,r){try{r()}catch(o){We(e,t,o)}}var kc=!1;function Yu(e,t){if(Di=Qr,e=el(),Ei(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var o=r.getSelection&&r.getSelection();if(o&&o.rangeCount!==0){r=o.anchorNode;var i=o.anchorOffset,a=o.focusNode;o=o.focusOffset;try{r.nodeType,a.nodeType}catch{r=null;break e}var d=0,x=-1,w=-1,T=0,Y=0,ee=e,q=null;t:for(;;){for(var le;ee!==r||i!==0&&ee.nodeType!==3||(x=d+i),ee!==a||o!==0&&ee.nodeType!==3||(w=d+o),ee.nodeType===3&&(d+=ee.nodeValue.length),(le=ee.firstChild)!==null;)q=ee,ee=le;for(;;){if(ee===e)break t;if(q===r&&++T===i&&(x=d),q===a&&++Y===o&&(w=d),(le=ee.nextSibling)!==null)break;ee=q,q=ee.parentNode}ee=le}r=x===-1||w===-1?null:{start:x,end:w}}else r=null}r=r||{start:0,end:0}}else r=null;for(Wi={focusedElem:e,selectionRange:r},Qr=!1,de=t;de!==null;)if(t=de,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,de=e;else for(;de!==null;){t=de;try{var ue=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ue!==null){var he=ue.memoizedProps,Ue=ue.memoizedState,S=t.stateNode,b=S.getSnapshotBeforeUpdate(t.elementType===t.type?he:jt(t.type,he),Ue);S.__reactInternalSnapshotBeforeUpdate=b}break;case 3:var I=t.stateNode.containerInfo;I.nodeType===1?I.textContent="":I.nodeType===9&&I.documentElement&&I.removeChild(I.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(l(163))}}catch(re){We(t,t.return,re)}if(e=t.sibling,e!==null){e.return=t.return,de=e;break}de=t.return}return ue=kc,kc=!1,ue}function Tr(e,t,r){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var i=o=o.next;do{if((i.tag&e)===e){var a=i.destroy;i.destroy=void 0,a!==void 0&&Ss(t,r,a)}i=i.next}while(i!==o)}}function Ao(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var o=r.create;r.destroy=o()}r=r.next}while(r!==t)}}function Cs(e){var t=e.ref;if(t!==null){var r=e.stateNode;e.tag,e=r,typeof t=="function"?t(e):t.current=e}}function vc(e){var t=e.alternate;t!==null&&(e.alternate=null,vc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[At],delete t[br],delete t[$i],delete t[Lu],delete t[Mu])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function jc(e){return e.tag===5||e.tag===3||e.tag===4}function Sc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||jc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ns(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=so));else if(o!==4&&(e=e.child,e!==null))for(Ns(e,t,r),e=e.sibling;e!==null;)Ns(e,t,r),e=e.sibling}function Is(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(Is(e,t,r),e=e.sibling;e!==null;)Is(e,t,r),e=e.sibling}var Xe=null,St=!1;function en(e,t,r){for(r=r.child;r!==null;)Cc(e,t,r),r=r.sibling}function Cc(e,t,r){if(Et&&typeof Et.onCommitFiberUnmount=="function")try{Et.onCommitFiberUnmount($r,r)}catch{}switch(r.tag){case 5:et||Vn(r,t);case 6:var o=Xe,i=St;Xe=null,en(e,t,r),Xe=o,St=i,Xe!==null&&(St?(e=Xe,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):Xe.removeChild(r.stateNode));break;case 18:Xe!==null&&(St?(e=Xe,r=r.stateNode,e.nodeType===8?Ui(e.parentNode,r):e.nodeType===1&&Ui(e,r),cr(e)):Ui(Xe,r.stateNode));break;case 4:o=Xe,i=St,Xe=r.stateNode.containerInfo,St=!0,en(e,t,r),Xe=o,St=i;break;case 0:case 11:case 14:case 15:if(!et&&(o=r.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){i=o=o.next;do{var a=i,d=a.destroy;a=a.tag,d!==void 0&&((a&2)!==0||(a&4)!==0)&&Ss(r,t,d),i=i.next}while(i!==o)}en(e,t,r);break;case 1:if(!et&&(Vn(r,t),o=r.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=r.memoizedProps,o.state=r.memoizedState,o.componentWillUnmount()}catch(x){We(r,t,x)}en(e,t,r);break;case 21:en(e,t,r);break;case 22:r.mode&1?(et=(o=et)||r.memoizedState!==null,en(e,t,r),et=o):en(e,t,r);break;default:en(e,t,r)}}function Nc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new qu),t.forEach(function(o){var i=sp.bind(null,e,o);r.has(o)||(r.add(o),o.then(i,i))})}}function Ct(e,t){var r=t.deletions;if(r!==null)for(var o=0;o<r.length;o++){var i=r[o];try{var a=e,d=t,x=d;e:for(;x!==null;){switch(x.tag){case 5:Xe=x.stateNode,St=!1;break e;case 3:Xe=x.stateNode.containerInfo,St=!0;break e;case 4:Xe=x.stateNode.containerInfo,St=!0;break e}x=x.return}if(Xe===null)throw Error(l(160));Cc(a,d,i),Xe=null,St=!1;var w=i.alternate;w!==null&&(w.return=null),i.return=null}catch(T){We(i,t,T)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Ic(t,e),t=t.sibling}function Ic(e,t){var r=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ct(t,e),Lt(e),o&4){try{Tr(3,e,e.return),Ao(3,e)}catch(he){We(e,e.return,he)}try{Tr(5,e,e.return)}catch(he){We(e,e.return,he)}}break;case 1:Ct(t,e),Lt(e),o&512&&r!==null&&Vn(r,r.return);break;case 5:if(Ct(t,e),Lt(e),o&512&&r!==null&&Vn(r,r.return),e.flags&32){var i=e.stateNode;try{Jn(i,"")}catch(he){We(e,e.return,he)}}if(o&4&&(i=e.stateNode,i!=null)){var a=e.memoizedProps,d=r!==null?r.memoizedProps:a,x=e.type,w=e.updateQueue;if(e.updateQueue=null,w!==null)try{x==="input"&&a.type==="radio"&&a.name!=null&&Se(i,a),ii(x,d);var T=ii(x,a);for(d=0;d<w.length;d+=2){var Y=w[d],ee=w[d+1];Y==="style"?da(i,ee):Y==="dangerouslySetInnerHTML"?la(i,ee):Y==="children"?Jn(i,ee):J(i,Y,ee,T)}switch(x){case"input":bt(i,a);break;case"textarea":ia(i,a);break;case"select":var q=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!a.multiple;var le=a.value;le!=null?jn(i,!!a.multiple,le,!1):q!==!!a.multiple&&(a.defaultValue!=null?jn(i,!!a.multiple,a.defaultValue,!0):jn(i,!!a.multiple,a.multiple?[]:"",!1))}i[br]=a}catch(he){We(e,e.return,he)}}break;case 6:if(Ct(t,e),Lt(e),o&4){if(e.stateNode===null)throw Error(l(162));i=e.stateNode,a=e.memoizedProps;try{i.nodeValue=a}catch(he){We(e,e.return,he)}}break;case 3:if(Ct(t,e),Lt(e),o&4&&r!==null&&r.memoizedState.isDehydrated)try{cr(t.containerInfo)}catch(he){We(e,e.return,he)}break;case 4:Ct(t,e),Lt(e);break;case 13:Ct(t,e),Lt(e),i=e.child,i.flags&8192&&(a=i.memoizedState!==null,i.stateNode.isHidden=a,!a||i.alternate!==null&&i.alternate.memoizedState!==null||(Ts=Oe())),o&4&&Nc(e);break;case 22:if(Y=r!==null&&r.memoizedState!==null,e.mode&1?(et=(T=et)||Y,Ct(t,e),et=T):Ct(t,e),Lt(e),o&8192){if(T=e.memoizedState!==null,(e.stateNode.isHidden=T)&&!Y&&(e.mode&1)!==0)for(de=e,Y=e.child;Y!==null;){for(ee=de=Y;de!==null;){switch(q=de,le=q.child,q.tag){case 0:case 11:case 14:case 15:Tr(4,q,q.return);break;case 1:Vn(q,q.return);var ue=q.stateNode;if(typeof ue.componentWillUnmount=="function"){o=q,r=q.return;try{t=o,ue.props=t.memoizedProps,ue.state=t.memoizedState,ue.componentWillUnmount()}catch(he){We(o,r,he)}}break;case 5:Vn(q,q.return);break;case 22:if(q.memoizedState!==null){Tc(ee);continue}}le!==null?(le.return=q,de=le):Tc(ee)}Y=Y.sibling}e:for(Y=null,ee=e;;){if(ee.tag===5){if(Y===null){Y=ee;try{i=ee.stateNode,T?(a=i.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(x=ee.stateNode,w=ee.memoizedProps.style,d=w!=null&&w.hasOwnProperty("display")?w.display:null,x.style.display=ca("display",d))}catch(he){We(e,e.return,he)}}}else if(ee.tag===6){if(Y===null)try{ee.stateNode.nodeValue=T?"":ee.memoizedProps}catch(he){We(e,e.return,he)}}else if((ee.tag!==22&&ee.tag!==23||ee.memoizedState===null||ee===e)&&ee.child!==null){ee.child.return=ee,ee=ee.child;continue}if(ee===e)break e;for(;ee.sibling===null;){if(ee.return===null||ee.return===e)break e;Y===ee&&(Y=null),ee=ee.return}Y===ee&&(Y=null),ee.sibling.return=ee.return,ee=ee.sibling}}break;case 19:Ct(t,e),Lt(e),o&4&&Nc(e);break;case 21:break;default:Ct(t,e),Lt(e)}}function Lt(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(jc(r)){var o=r;break e}r=r.return}throw Error(l(160))}switch(o.tag){case 5:var i=o.stateNode;o.flags&32&&(Jn(i,""),o.flags&=-33);var a=Sc(e);Is(e,a,i);break;case 3:case 4:var d=o.stateNode.containerInfo,x=Sc(e);Ns(e,x,d);break;default:throw Error(l(161))}}catch(w){We(e,e.return,w)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ju(e,t,r){de=e,Ec(e)}function Ec(e,t,r){for(var o=(e.mode&1)!==0;de!==null;){var i=de,a=i.child;if(i.tag===22&&o){var d=i.memoizedState!==null||Eo;if(!d){var x=i.alternate,w=x!==null&&x.memoizedState!==null||et;x=Eo;var T=et;if(Eo=d,(et=w)&&!T)for(de=i;de!==null;)d=de,w=d.child,d.tag===22&&d.memoizedState!==null?zc(i):w!==null?(w.return=d,de=w):zc(i);for(;a!==null;)de=a,Ec(a),a=a.sibling;de=i,Eo=x,et=T}Ac(e)}else(i.subtreeFlags&8772)!==0&&a!==null?(a.return=i,de=a):Ac(e)}}function Ac(e){for(;de!==null;){var t=de;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:et||Ao(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!et)if(r===null)o.componentDidMount();else{var i=t.elementType===t.type?r.memoizedProps:jt(t.type,r.memoizedProps);o.componentDidUpdate(i,r.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&Tl(t,a,o);break;case 3:var d=t.updateQueue;if(d!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Tl(t,d,r)}break;case 5:var x=t.stateNode;if(r===null&&t.flags&4){r=x;var w=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":w.autoFocus&&r.focus();break;case"img":w.src&&(r.src=w.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var T=t.alternate;if(T!==null){var Y=T.memoizedState;if(Y!==null){var ee=Y.dehydrated;ee!==null&&cr(ee)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(l(163))}et||t.flags&512&&Cs(t)}catch(q){We(t,t.return,q)}}if(t===e){de=null;break}if(r=t.sibling,r!==null){r.return=t.return,de=r;break}de=t.return}}function Tc(e){for(;de!==null;){var t=de;if(t===e){de=null;break}var r=t.sibling;if(r!==null){r.return=t.return,de=r;break}de=t.return}}function zc(e){for(;de!==null;){var t=de;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Ao(4,t)}catch(w){We(t,r,w)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var i=t.return;try{o.componentDidMount()}catch(w){We(t,i,w)}}var a=t.return;try{Cs(t)}catch(w){We(t,a,w)}break;case 5:var d=t.return;try{Cs(t)}catch(w){We(t,d,w)}}}catch(w){We(t,t.return,w)}if(t===e){de=null;break}var x=t.sibling;if(x!==null){x.return=t.return,de=x;break}de=t.return}}var Zu=Math.ceil,To=V.ReactCurrentDispatcher,Es=V.ReactCurrentOwner,_t=V.ReactCurrentBatchConfig,Ce=0,Ge=null,$e=null,qe=0,ht=0,Hn=Xt(0),Ke=0,zr=null,xn=0,zo=0,As=0,Lr=null,at=null,Ts=0,Gn=1/0,Ut=null,Lo=!1,zs=null,tn=null,Mo=!1,nn=null,Ro=0,Mr=0,Ls=null,Po=-1,Do=0;function rt(){return(Ce&6)!==0?Oe():Po!==-1?Po:Po=Oe()}function rn(e){return(e.mode&1)===0?1:(Ce&2)!==0&&qe!==0?qe&-qe:Pu.transition!==null?(Do===0&&(Do=Sa()),Do):(e=Ee,e!==0||(e=window.event,e=e===void 0?16:Ma(e.type)),e)}function Nt(e,t,r,o){if(50<Mr)throw Mr=0,Ls=null,Error(l(185));or(e,r,o),((Ce&2)===0||e!==Ge)&&(e===Ge&&((Ce&2)===0&&(zo|=r),Ke===4&&on(e,qe)),lt(e,o),r===1&&Ce===0&&(t.mode&1)===0&&(Gn=Oe()+500,uo&&Yt()))}function lt(e,t){var r=e.callbackNode;Pd(e,t);var o=Vr(e,e===Ge?qe:0);if(o===0)r!==null&&ka(r),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(r!=null&&ka(r),t===1)e.tag===0?Ru(Mc.bind(null,e)):wl(Mc.bind(null,e)),Tu(function(){(Ce&6)===0&&Yt()}),r=null;else{switch(Ca(o)){case 1:r=pi;break;case 4:r=va;break;case 16:r=Ur;break;case 536870912:r=ja;break;default:r=Ur}r=$c(r,Lc.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Lc(e,t){if(Po=-1,Do=0,(Ce&6)!==0)throw Error(l(327));var r=e.callbackNode;if(Qn()&&e.callbackNode!==r)return null;var o=Vr(e,e===Ge?qe:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Wo(e,o);else{t=o;var i=Ce;Ce|=2;var a=Pc();(Ge!==e||qe!==t)&&(Ut=null,Gn=Oe()+500,wn(e,t));do try{np();break}catch(x){Rc(e,x)}while(!0);Yi(),To.current=a,Ce=i,$e!==null?t=0:(Ge=null,qe=0,t=Ke)}if(t!==0){if(t===2&&(i=hi(e),i!==0&&(o=i,t=Ms(e,i))),t===1)throw r=zr,wn(e,0),on(e,o),lt(e,Oe()),r;if(t===6)on(e,o);else{if(i=e.current.alternate,(o&30)===0&&!ep(i)&&(t=Wo(e,o),t===2&&(a=hi(e),a!==0&&(o=a,t=Ms(e,a))),t===1))throw r=zr,wn(e,0),on(e,o),lt(e,Oe()),r;switch(e.finishedWork=i,e.finishedLanes=o,t){case 0:case 1:throw Error(l(345));case 2:bn(e,at,Ut);break;case 3:if(on(e,o),(o&130023424)===o&&(t=Ts+500-Oe(),10<t)){if(Vr(e,0)!==0)break;if(i=e.suspendedLanes,(i&o)!==o){rt(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=Oi(bn.bind(null,e,at,Ut),t);break}bn(e,at,Ut);break;case 4:if(on(e,o),(o&4194240)===o)break;for(t=e.eventTimes,i=-1;0<o;){var d=31-yt(o);a=1<<d,d=t[d],d>i&&(i=d),o&=~a}if(o=i,o=Oe()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*Zu(o/1960))-o,10<o){e.timeoutHandle=Oi(bn.bind(null,e,at,Ut),o);break}bn(e,at,Ut);break;case 5:bn(e,at,Ut);break;default:throw Error(l(329))}}}return lt(e,Oe()),e.callbackNode===r?Lc.bind(null,e):null}function Ms(e,t){var r=Lr;return e.current.memoizedState.isDehydrated&&(wn(e,t).flags|=256),e=Wo(e,t),e!==2&&(t=at,at=r,t!==null&&Rs(t)),e}function Rs(e){at===null?at=e:at.push.apply(at,e)}function ep(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var o=0;o<r.length;o++){var i=r[o],a=i.getSnapshot;i=i.value;try{if(!kt(a(),i))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function on(e,t){for(t&=~As,t&=~zo,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-yt(t),o=1<<r;e[r]=-1,t&=~o}}function Mc(e){if((Ce&6)!==0)throw Error(l(327));Qn();var t=Vr(e,0);if((t&1)===0)return lt(e,Oe()),null;var r=Wo(e,t);if(e.tag!==0&&r===2){var o=hi(e);o!==0&&(t=o,r=Ms(e,o))}if(r===1)throw r=zr,wn(e,0),on(e,t),lt(e,Oe()),r;if(r===6)throw Error(l(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,bn(e,at,Ut),lt(e,Oe()),null}function Ps(e,t){var r=Ce;Ce|=1;try{return e(t)}finally{Ce=r,Ce===0&&(Gn=Oe()+500,uo&&Yt())}}function _n(e){nn!==null&&nn.tag===0&&(Ce&6)===0&&Qn();var t=Ce;Ce|=1;var r=_t.transition,o=Ee;try{if(_t.transition=null,Ee=1,e)return e()}finally{Ee=o,_t.transition=r,Ce=t,(Ce&6)===0&&Yt()}}function Ds(){ht=Hn.current,Le(Hn)}function wn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Au(r)),$e!==null)for(r=$e.return;r!==null;){var o=r;switch(Hi(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&lo();break;case 3:Bn(),Le(ot),Le(Ye),is();break;case 5:rs(o);break;case 4:Bn();break;case 13:Le(Re);break;case 19:Le(Re);break;case 10:Ji(o.type._context);break;case 22:case 23:Ds()}r=r.return}if(Ge=e,$e=e=sn(e.current,null),qe=ht=t,Ke=0,zr=null,As=zo=xn=0,at=Lr=null,fn!==null){for(t=0;t<fn.length;t++)if(r=fn[t],o=r.interleaved,o!==null){r.interleaved=null;var i=o.next,a=r.pending;if(a!==null){var d=a.next;a.next=i,o.next=d}r.pending=o}fn=null}return e}function Rc(e,t){do{var r=$e;try{if(Yi(),yo.current=So,ko){for(var o=Pe.memoizedState;o!==null;){var i=o.queue;i!==null&&(i.pending=null),o=o.next}ko=!1}if(mn=0,He=Be=Pe=null,Cr=!1,Nr=0,Es.current=null,r===null||r.return===null){Ke=1,zr=t,$e=null;break}e:{var a=e,d=r.return,x=r,w=t;if(t=qe,x.flags|=32768,w!==null&&typeof w=="object"&&typeof w.then=="function"){var T=w,Y=x,ee=Y.tag;if((Y.mode&1)===0&&(ee===0||ee===11||ee===15)){var q=Y.alternate;q?(Y.updateQueue=q.updateQueue,Y.memoizedState=q.memoizedState,Y.lanes=q.lanes):(Y.updateQueue=null,Y.memoizedState=null)}var le=sc(d);if(le!==null){le.flags&=-257,ac(le,d,x,a,t),le.mode&1&&ic(a,T,t),t=le,w=T;var ue=t.updateQueue;if(ue===null){var he=new Set;he.add(w),t.updateQueue=he}else ue.add(w);break e}else{if((t&1)===0){ic(a,T,t),Ws();break e}w=Error(l(426))}}else if(Me&&x.mode&1){var Ue=sc(d);if(Ue!==null){(Ue.flags&65536)===0&&(Ue.flags|=256),ac(Ue,d,x,a,t),Xi(Kn(w,x));break e}}a=w=Kn(w,x),Ke!==4&&(Ke=2),Lr===null?Lr=[a]:Lr.push(a),a=d;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var S=rc(a,w,t);Al(a,S);break e;case 1:x=w;var b=a.type,I=a.stateNode;if((a.flags&128)===0&&(typeof b.getDerivedStateFromError=="function"||I!==null&&typeof I.componentDidCatch=="function"&&(tn===null||!tn.has(I)))){a.flags|=65536,t&=-t,a.lanes|=t;var re=oc(a,x,t);Al(a,re);break e}}a=a.return}while(a!==null)}Wc(r)}catch(ge){t=ge,$e===r&&r!==null&&($e=r=r.return);continue}break}while(!0)}function Pc(){var e=To.current;return To.current=So,e===null?So:e}function Ws(){(Ke===0||Ke===3||Ke===2)&&(Ke=4),Ge===null||(xn&268435455)===0&&(zo&268435455)===0||on(Ge,qe)}function Wo(e,t){var r=Ce;Ce|=2;var o=Pc();(Ge!==e||qe!==t)&&(Ut=null,wn(e,t));do try{tp();break}catch(i){Rc(e,i)}while(!0);if(Yi(),Ce=r,To.current=o,$e!==null)throw Error(l(261));return Ge=null,qe=0,Ke}function tp(){for(;$e!==null;)Dc($e)}function np(){for(;$e!==null&&!Nd();)Dc($e)}function Dc(e){var t=Uc(e.alternate,e,ht);e.memoizedProps=e.pendingProps,t===null?Wc(e):$e=t,Es.current=null}function Wc(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=Qu(r,t,ht),r!==null){$e=r;return}}else{if(r=Xu(r,t),r!==null){r.flags&=32767,$e=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ke=6,$e=null;return}}if(t=t.sibling,t!==null){$e=t;return}$e=t=e}while(t!==null);Ke===0&&(Ke=5)}function bn(e,t,r){var o=Ee,i=_t.transition;try{_t.transition=null,Ee=1,rp(e,t,r,o)}finally{_t.transition=i,Ee=o}return null}function rp(e,t,r,o){do Qn();while(nn!==null);if((Ce&6)!==0)throw Error(l(327));r=e.finishedWork;var i=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(l(177));e.callbackNode=null,e.callbackPriority=0;var a=r.lanes|r.childLanes;if(Dd(e,a),e===Ge&&($e=Ge=null,qe=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Mo||(Mo=!0,$c(Ur,function(){return Qn(),null})),a=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||a){a=_t.transition,_t.transition=null;var d=Ee;Ee=1;var x=Ce;Ce|=4,Es.current=null,Yu(e,r),Ic(r,e),vu(Wi),Qr=!!Di,Wi=Di=null,e.current=r,Ju(r),Id(),Ce=x,Ee=d,_t.transition=a}else e.current=r;if(Mo&&(Mo=!1,nn=e,Ro=i),a=e.pendingLanes,a===0&&(tn=null),Td(r.stateNode),lt(e,Oe()),t!==null)for(o=e.onRecoverableError,r=0;r<t.length;r++)i=t[r],o(i.value,{componentStack:i.stack,digest:i.digest});if(Lo)throw Lo=!1,e=zs,zs=null,e;return(Ro&1)!==0&&e.tag!==0&&Qn(),a=e.pendingLanes,(a&1)!==0?e===Ls?Mr++:(Mr=0,Ls=e):Mr=0,Yt(),null}function Qn(){if(nn!==null){var e=Ca(Ro),t=_t.transition,r=Ee;try{if(_t.transition=null,Ee=16>e?16:e,nn===null)var o=!1;else{if(e=nn,nn=null,Ro=0,(Ce&6)!==0)throw Error(l(331));var i=Ce;for(Ce|=4,de=e.current;de!==null;){var a=de,d=a.child;if((de.flags&16)!==0){var x=a.deletions;if(x!==null){for(var w=0;w<x.length;w++){var T=x[w];for(de=T;de!==null;){var Y=de;switch(Y.tag){case 0:case 11:case 15:Tr(8,Y,a)}var ee=Y.child;if(ee!==null)ee.return=Y,de=ee;else for(;de!==null;){Y=de;var q=Y.sibling,le=Y.return;if(vc(Y),Y===T){de=null;break}if(q!==null){q.return=le,de=q;break}de=le}}}var ue=a.alternate;if(ue!==null){var he=ue.child;if(he!==null){ue.child=null;do{var Ue=he.sibling;he.sibling=null,he=Ue}while(he!==null)}}de=a}}if((a.subtreeFlags&2064)!==0&&d!==null)d.return=a,de=d;else e:for(;de!==null;){if(a=de,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:Tr(9,a,a.return)}var S=a.sibling;if(S!==null){S.return=a.return,de=S;break e}de=a.return}}var b=e.current;for(de=b;de!==null;){d=de;var I=d.child;if((d.subtreeFlags&2064)!==0&&I!==null)I.return=d,de=I;else e:for(d=b;de!==null;){if(x=de,(x.flags&2048)!==0)try{switch(x.tag){case 0:case 11:case 15:Ao(9,x)}}catch(ge){We(x,x.return,ge)}if(x===d){de=null;break e}var re=x.sibling;if(re!==null){re.return=x.return,de=re;break e}de=x.return}}if(Ce=i,Yt(),Et&&typeof Et.onPostCommitFiberRoot=="function")try{Et.onPostCommitFiberRoot($r,e)}catch{}o=!0}return o}finally{Ee=r,_t.transition=t}}return!1}function Fc(e,t,r){t=Kn(r,t),t=rc(e,t,1),e=Zt(e,t,1),t=rt(),e!==null&&(or(e,1,t),lt(e,t))}function We(e,t,r){if(e.tag===3)Fc(e,e,r);else for(;t!==null;){if(t.tag===3){Fc(t,e,r);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(tn===null||!tn.has(o))){e=Kn(r,e),e=oc(t,e,1),t=Zt(t,e,1),e=rt(),t!==null&&(or(t,1,e),lt(t,e));break}}t=t.return}}function op(e,t,r){var o=e.pingCache;o!==null&&o.delete(t),t=rt(),e.pingedLanes|=e.suspendedLanes&r,Ge===e&&(qe&r)===r&&(Ke===4||Ke===3&&(qe&130023424)===qe&&500>Oe()-Ts?wn(e,0):As|=r),lt(e,t)}function Oc(e,t){t===0&&((e.mode&1)===0?t=1:(t=Kr,Kr<<=1,(Kr&130023424)===0&&(Kr=4194304)));var r=rt();e=Wt(e,t),e!==null&&(or(e,t,r),lt(e,r))}function ip(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),Oc(e,r)}function sp(e,t){var r=0;switch(e.tag){case 13:var o=e.stateNode,i=e.memoizedState;i!==null&&(r=i.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(l(314))}o!==null&&o.delete(t),Oc(e,r)}var Uc;Uc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||ot.current)st=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return st=!1,Gu(e,t,r);st=(e.flags&131072)!==0}else st=!1,Me&&(t.flags&1048576)!==0&&bl(t,ho,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Io(e,t),e=t.pendingProps;var i=Pn(t,Ye.current);$n(t,r),i=ls(null,t,o,e,i,r);var a=cs();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,it(o)?(a=!0,co(t)):a=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,ts(t),i.updater=Co,t.stateNode=i,i._reactInternals=t,gs(t,o,e,r),t=ws(null,t,o,!0,a,r)):(t.tag=0,Me&&a&&Vi(t),nt(null,t,i,r),t=t.child),t;case 16:o=t.elementType;e:{switch(Io(e,t),e=t.pendingProps,i=o._init,o=i(o._payload),t.type=o,i=t.tag=lp(o),e=jt(o,e),i){case 0:t=_s(null,t,o,e,r);break e;case 1:t=hc(null,t,o,e,r);break e;case 11:t=lc(null,t,o,e,r);break e;case 14:t=cc(null,t,o,jt(o.type,e),r);break e}throw Error(l(306,o,""))}return t;case 0:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),_s(e,t,o,i,r);case 1:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),hc(e,t,o,i,r);case 3:e:{if(fc(t),e===null)throw Error(l(387));o=t.pendingProps,a=t.memoizedState,i=a.element,El(e,t),wo(t,o,null,r);var d=t.memoizedState;if(o=d.element,a.isDehydrated)if(a={element:o,isDehydrated:!1,cache:d.cache,pendingSuspenseBoundaries:d.pendingSuspenseBoundaries,transitions:d.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){i=Kn(Error(l(423)),t),t=gc(e,t,o,r,i);break e}else if(o!==i){i=Kn(Error(l(424)),t),t=gc(e,t,o,r,i);break e}else for(pt=Qt(t.stateNode.containerInfo.firstChild),ut=t,Me=!0,vt=null,r=Nl(t,null,o,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Fn(),o===i){t=Ot(e,t,r);break e}nt(e,t,o,r)}t=t.child}return t;case 5:return zl(t),e===null&&Qi(t),o=t.type,i=t.pendingProps,a=e!==null?e.memoizedProps:null,d=i.children,Fi(o,i)?d=null:a!==null&&Fi(o,a)&&(t.flags|=32),pc(e,t),nt(e,t,d,r),t.child;case 6:return e===null&&Qi(t),null;case 13:return mc(e,t,r);case 4:return ns(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=On(t,null,o,r):nt(e,t,o,r),t.child;case 11:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),lc(e,t,o,i,r);case 7:return nt(e,t,t.pendingProps,r),t.child;case 8:return nt(e,t,t.pendingProps.children,r),t.child;case 12:return nt(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(o=t.type._context,i=t.pendingProps,a=t.memoizedProps,d=i.value,Te(mo,o._currentValue),o._currentValue=d,a!==null)if(kt(a.value,d)){if(a.children===i.children&&!ot.current){t=Ot(e,t,r);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var x=a.dependencies;if(x!==null){d=a.child;for(var w=x.firstContext;w!==null;){if(w.context===o){if(a.tag===1){w=Ft(-1,r&-r),w.tag=2;var T=a.updateQueue;if(T!==null){T=T.shared;var Y=T.pending;Y===null?w.next=w:(w.next=Y.next,Y.next=w),T.pending=w}}a.lanes|=r,w=a.alternate,w!==null&&(w.lanes|=r),Zi(a.return,r,t),x.lanes|=r;break}w=w.next}}else if(a.tag===10)d=a.type===t.type?null:a.child;else if(a.tag===18){if(d=a.return,d===null)throw Error(l(341));d.lanes|=r,x=d.alternate,x!==null&&(x.lanes|=r),Zi(d,r,t),d=a.sibling}else d=a.child;if(d!==null)d.return=a;else for(d=a;d!==null;){if(d===t){d=null;break}if(a=d.sibling,a!==null){a.return=d.return,d=a;break}d=d.return}a=d}nt(e,t,i.children,r),t=t.child}return t;case 9:return i=t.type,o=t.pendingProps.children,$n(t,r),i=mt(i),o=o(i),t.flags|=1,nt(e,t,o,r),t.child;case 14:return o=t.type,i=jt(o,t.pendingProps),i=jt(o.type,i),cc(e,t,o,i,r);case 15:return dc(e,t,t.type,t.pendingProps,r);case 17:return o=t.type,i=t.pendingProps,i=t.elementType===o?i:jt(o,i),Io(e,t),t.tag=1,it(o)?(e=!0,co(t)):e=!1,$n(t,r),tc(t,o,i),gs(t,o,i,r),ws(null,t,o,!0,e,r);case 19:return _c(e,t,r);case 22:return uc(e,t,r)}throw Error(l(156,t.tag))};function $c(e,t){return ya(e,t)}function ap(e,t,r,o){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wt(e,t,r,o){return new ap(e,t,r,o)}function Fs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function lp(e){if(typeof e=="function")return Fs(e)?1:0;if(e!=null){if(e=e.$$typeof,e===ce)return 11;if(e===R)return 14}return 2}function sn(e,t){var r=e.alternate;return r===null?(r=wt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Fo(e,t,r,o,i,a){var d=2;if(o=e,typeof e=="function")Fs(e)&&(d=1);else if(typeof e=="string")d=5;else e:switch(e){case oe:return yn(r.children,i,a,t);case ie:d=8,i|=8;break;case se:return e=wt(12,r,t,i|2),e.elementType=se,e.lanes=a,e;case ne:return e=wt(13,r,t,i),e.elementType=ne,e.lanes=a,e;case xe:return e=wt(19,r,t,i),e.elementType=xe,e.lanes=a,e;case D:return Oo(r,i,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case te:d=10;break e;case ae:d=9;break e;case ce:d=11;break e;case R:d=14;break e;case Q:d=16,o=null;break e}throw Error(l(130,e==null?e:typeof e,""))}return t=wt(d,r,t,i),t.elementType=e,t.type=o,t.lanes=a,t}function yn(e,t,r,o){return e=wt(7,e,o,t),e.lanes=r,e}function Oo(e,t,r,o){return e=wt(22,e,o,t),e.elementType=D,e.lanes=r,e.stateNode={isHidden:!1},e}function Os(e,t,r){return e=wt(6,e,null,t),e.lanes=r,e}function Us(e,t,r){return t=wt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function cp(e,t,r,o,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=fi(0),this.expirationTimes=fi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=fi(0),this.identifierPrefix=o,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function $s(e,t,r,o,i,a,d,x,w){return e=new cp(e,t,r,x,w),t===1?(t=1,a===!0&&(t|=8)):t=0,a=wt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:o,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},ts(a),e}function dp(e,t,r){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:X,key:o==null?null:""+o,children:e,containerInfo:t,implementation:r}}function Bc(e){if(!e)return qt;e=e._reactInternals;e:{if(cn(e)!==e||e.tag!==1)throw Error(l(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(it(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(l(171))}if(e.tag===1){var r=e.type;if(it(r))return xl(e,r,t)}return t}function Kc(e,t,r,o,i,a,d,x,w){return e=$s(r,o,!0,e,i,a,d,x,w),e.context=Bc(null),r=e.current,o=rt(),i=rn(r),a=Ft(o,i),a.callback=t??null,Zt(r,a,i),e.current.lanes=i,or(e,i,o),lt(e,o),e}function Uo(e,t,r,o){var i=t.current,a=rt(),d=rn(i);return r=Bc(r),t.context===null?t.context=r:t.pendingContext=r,t=Ft(a,d),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=Zt(i,t,d),e!==null&&(Nt(e,i,d,a),_o(e,i,d)),d}function $o(e){return e=e.current,e.child?(e.child.tag===5,e.child.stateNode):null}function Vc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function Bs(e,t){Vc(e,t),(e=e.alternate)&&Vc(e,t)}function up(){return null}var Hc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ks(e){this._internalRoot=e}Bo.prototype.render=Ks.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(l(409));Uo(e,t,null,null)},Bo.prototype.unmount=Ks.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;_n(function(){Uo(null,e,null,null)}),t[Mt]=null}};function Bo(e){this._internalRoot=e}Bo.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ea();e={blockedOn:null,target:e,priority:t};for(var r=0;r<Vt.length&&t!==0&&t<Vt[r].priority;r++);Vt.splice(r,0,e),r===0&&za(e)}};function Vs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ko(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Gc(){}function pp(e,t,r,o,i){if(i){if(typeof o=="function"){var a=o;o=function(){var T=$o(d);a.call(T)}}var d=Kc(t,o,e,0,null,!1,!1,"",Gc);return e._reactRootContainer=d,e[Mt]=d.current,_r(e.nodeType===8?e.parentNode:e),_n(),d}for(;i=e.lastChild;)e.removeChild(i);if(typeof o=="function"){var x=o;o=function(){var T=$o(w);x.call(T)}}var w=$s(e,0,!1,null,null,!1,!1,"",Gc);return e._reactRootContainer=w,e[Mt]=w.current,_r(e.nodeType===8?e.parentNode:e),_n(function(){Uo(t,w,r,o)}),w}function Vo(e,t,r,o,i){var a=r._reactRootContainer;if(a){var d=a;if(typeof i=="function"){var x=i;i=function(){var w=$o(d);x.call(w)}}Uo(t,d,e,i)}else d=pp(r,t,e,i,o);return $o(d)}Na=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=rr(t.pendingLanes);r!==0&&(gi(t,r|1),lt(t,Oe()),(Ce&6)===0&&(Gn=Oe()+500,Yt()))}break;case 13:_n(function(){var o=Wt(e,1);if(o!==null){var i=rt();Nt(o,e,1,i)}}),Bs(e,1)}},mi=function(e){if(e.tag===13){var t=Wt(e,134217728);if(t!==null){var r=rt();Nt(t,e,134217728,r)}Bs(e,134217728)}},Ia=function(e){if(e.tag===13){var t=rn(e),r=Wt(e,t);if(r!==null){var o=rt();Nt(r,e,t,o)}Bs(e,t)}},Ea=function(){return Ee},Aa=function(e,t){var r=Ee;try{return Ee=e,t()}finally{Ee=r}},li=function(e,t,r){switch(t){case"input":if(bt(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var o=r[t];if(o!==e&&o.form===e.form){var i=ao(o);if(!i)throw Error(l(90));De(o),bt(o,i)}}}break;case"textarea":ia(e,r);break;case"select":t=r.value,t!=null&&jn(e,!!r.multiple,t,!1)}},fa=Ps,ga=_n;var hp={usingClientEntryPoint:!1,Events:[yr,Mn,ao,pa,ha,Ps]},Rr={findFiberByHostInstance:dn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},fp={bundleType:Rr.bundleType,version:Rr.version,rendererPackageName:Rr.rendererPackageName,rendererConfig:Rr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:V.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=wa(e),e===null?null:e.stateNode},findFiberByHostInstance:Rr.findFiberByHostInstance||up,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ho=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ho.isDisabled&&Ho.supportsFiber)try{$r=Ho.inject(fp),Et=Ho}catch{}}return ct.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=hp,ct.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Vs(t))throw Error(l(200));return dp(e,t,null,r)},ct.createRoot=function(e,t){if(!Vs(e))throw Error(l(299));var r=!1,o="",i=Hc;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=$s(e,1,!1,null,null,r,!1,o,i),e[Mt]=t.current,_r(e.nodeType===8?e.parentNode:e),new Ks(t)},ct.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(l(188)):(e=Object.keys(e).join(","),Error(l(268,e)));return e=wa(t),e=e===null?null:e.stateNode,e},ct.flushSync=function(e){return _n(e)},ct.hydrate=function(e,t,r){if(!Ko(t))throw Error(l(200));return Vo(null,e,t,!0,r)},ct.hydrateRoot=function(e,t,r){if(!Vs(e))throw Error(l(405));var o=r!=null&&r.hydratedSources||null,i=!1,a="",d=Hc;if(r!=null&&(r.unstable_strictMode===!0&&(i=!0),r.identifierPrefix!==void 0&&(a=r.identifierPrefix),r.onRecoverableError!==void 0&&(d=r.onRecoverableError)),t=Kc(t,null,e,1,r??null,i,!1,a,d),e[Mt]=t.current,_r(e),o)for(e=0;e<o.length;e++)r=o[e],i=r._getVersion,i=i(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,i]:t.mutableSourceEagerHydrationData.push(r,i);return new Bo(t)},ct.render=function(e,t,r){if(!Ko(t))throw Error(l(200));return Vo(null,e,t,!1,r)},ct.unmountComponentAtNode=function(e){if(!Ko(e))throw Error(l(40));return e._reactRootContainer?(_n(function(){Vo(null,null,e,!1,function(){e._reactRootContainer=null,e[Mt]=null})}),!0):!1},ct.unstable_batchedUpdates=Ps,ct.unstable_renderSubtreeIntoContainer=function(e,t,r,o){if(!Ko(r))throw Error(l(200));if(e==null||e._reactInternals===void 0)throw Error(l(38));return Vo(e,t,r,!1,o)},ct.version="18.3.1-next-f1338f8080-20240426",ct}var td;function jp(){if(td)return Qs.exports;td=1;function c(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c)}catch(s){console.error(s)}}return c(),Qs.exports=vp(),Qs.exports}var nd;function Sp(){if(nd)return Go;nd=1;var c=jp();return Go.createRoot=c.createRoot,Go.hydrateRoot=c.hydrateRoot,Go}var Cp=Sp();const Zo="cheng_access_token",Ys="cheng_refresh_token";class Ve{constructor(s){this.apiBaseUrl=s}apiBaseUrl;async getAccessToken(){return this.getAccessTokenSync()}getAccessTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(Zo)}getRefreshTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(Ys)}storeTokens(s,l){typeof window>"u"||(window.localStorage.setItem(Zo,s),l&&window.localStorage.setItem(Ys,l))}clearTokens(){typeof window>"u"||(window.localStorage.removeItem(Zo),window.localStorage.removeItem(Ys))}async refreshAccessToken(){const s=this.getRefreshTokenSync();if(!s)return null;const l=await fetch(`${this.apiBaseUrl}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:s})});if(!l.ok)return null;const u=await l.json().catch(()=>null),h=u?.token??u?.access_token??null;return h?(this.storeTokens(h,u?.refresh_token),h):null}}const Dr="cheng:auth-expired";function fd(){new Ve("").clearTokens()}function kn(c="expired"){fd(),!(typeof window>"u")&&window.dispatchEvent(new CustomEvent(Dr,{detail:{reason:c}}))}class ra{constructor(s){this.apiBaseUrl=s,this.session=new Ve(s)}apiBaseUrl;session;async login(s){const l=await fetch(`${this.apiBaseUrl}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!l.ok){const h=await l.json().catch(()=>({}));throw new Error(h.message??h.error??`Login failed (${l.status})`)}const u=await l.json();return this.session.storeTokens(u.token,u.refresh_token),u}async resetPassword(s){const l=await fetch(`${this.apiBaseUrl}/auth/password/reset`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!l.ok){const u=await l.json().catch(()=>({}));throw new Error(u.message??u.error??`Reset password failed (${l.status})`)}}async refresh(){const s=await this.session.refreshAccessToken();return s||kn("refresh-failed"),s}logout(){fd()}getAccessToken(){return this.session.getAccessTokenSync()}getRefreshToken(){return this.session.getRefreshTokenSync()}isAuthenticated(){return!!this.getAccessToken()}}class Np{apiBaseUrl;workspaceId;contractWarnedKeys;tokenProvider;constructor(s,l){if(this.apiBaseUrl=s.apiBaseUrl,this.workspaceId=s.workspaceId.trim(),!this.workspaceId)throw new It("VALIDATION_ERROR","workspaceId is required in ChannelConfig",422);this.contractWarnedKeys=new Set,this.tokenProvider=l??new Ve(s.apiBaseUrl)}async execute(s,l,u,h,p,m){const v={app_id:s,external_user_id:(p||"web-user").trim(),external_chat_id:(h||`web-session-${Date.now()}`).trim(),mode:"workflow_chat",workflow_id:l,extra_context:{channel_id:s}},j=await this.resolveConversation(this.workspaceId,v),k=this._extractConversationId(j),z=await this.createMessage(k,{role:"user",content:u,attachments:m&&m.length>0?m:void 0}),A=this._extractExecutionId(z);return this._normalizeExecuteData({conversation_id:k,workflow_id:l,execution_id:A})}async workflowSupportsAttachments(s){try{const l=await this._fetch(`/workflows/${s}`,"GET");return(l?.definition?.nodes??l?.data?.definition?.nodes??[]).some(h=>h?.nodeType==="io/file_upload"||h?.node_type==="io/file_upload")}catch{return!1}}async resolveConversation(s,l){return this._fetch(`/workspaces/${s}/conversations/resolve`,"POST",l)}async getConversationMessages(s){const l=await this._fetch(`/conversations/${s}/messages`,"GET");return(Array.isArray(l)?l:Array.isArray(l?.data)?l.data:Array.isArray(l?.data?.items)?l.data.items:Array.isArray(l?.items)?l.items:[]).map(h=>({id:h.id??h.messageId??"",role:h.role??"assistant",content:h.content??"",createdAt:h.createdAt??h.created_at??new Date().toISOString(),executionId:h.executionId??h.execution_id}))}async createMessage(s,l){return this._fetch(`/conversations/${s}/messages`,"POST",l)}async submitApproval(s,l,u,h){return this._fetch(`/executions/${s}/approve`,"POST",{requestId:l,decision:u,scope:"once",reason:h||null})}async _fetch(s,l,u){const h=`${this.apiBaseUrl}${s}`;try{const p={"Content-Type":"application/json"},m=await this.tokenProvider.getAccessToken();if(!m)throw kn("missing-access-token"),new It("UNAUTHORIZED","Access token is missing",401);const v=u!==void 0?JSON.stringify(u):void 0,j=async A=>{const H={...p,Authorization:`Bearer ${A}`};return fetch(h,{method:l,headers:H,body:v})};let k=await j(m),z=!1;if(k.status===401&&this.tokenProvider.refreshAccessToken){const A=await this.tokenProvider.refreshAccessToken().catch(()=>null);A?k=await j(A):(kn("refresh-failed"),z=!0)}return k.ok||await this._handleError(k,z),k.json()}catch(p){throw p instanceof It?p:new It("NETWORK_ERROR",p instanceof Error?p.message:"Unknown network error",0)}}_extractConversationId(s){const l=s&&typeof s=="object"?s:{},u=l.data&&typeof l.data=="object"?l.data:l,h=u.id??u.conversation_id??u.conversationId;if(typeof h!="string"||!h)throw new It("UNKNOWN_ERROR","Conversation resolve response missing conversation id",500,s);return h}_extractExecutionId(s){const l=s&&typeof s=="object"?s:{},u=l.data&&typeof l.data=="object"?l.data:l,h=l.metadata&&typeof l.metadata=="object"?l.metadata:u.metadata&&typeof u.metadata=="object"?u.metadata:null,p=h?.execution_id??h?.executionId??u.execution_id??u.executionId??null;return typeof p=="string"?p:null}_normalizeExecuteData(s){const l=s&&typeof s=="object"?s:{},u=l.conversation_id??l.conversationId,h=l.workflow_id??l.workflowId,p=l.execution_id??l.executionId??null;(u===void 0||h===void 0)&&this._warnContract("execute-missing-fields","[contract-guard] execute response missing expected fields: conversation_id/workflow_id");const v=Object.keys(l).filter(j=>j.includes("_"));return v.length>0&&this._warnContract("execute-snake-keys",`[contract-guard] execute response contains snake_case keys: ${v.join(", ")}`),{conversation_id:typeof u=="string"?u:"",workflow_id:typeof h=="string"?h:"",execution_id:typeof p=="string"?p:null}}_warnContract(s,l){this.contractWarnedKeys.has(s)||(this.contractWarnedKeys.add(s),console.warn(l))}async _handleError(s,l){const u=s.status;let h;try{h=await s.json()}catch{h={message:s.statusText}}const p=h.message||h.error||"Unknown error";switch(u){case 401:throw l||kn("channel-unauthorized"),new It("UNAUTHORIZED","Access token is invalid or expired",u,h);case 404:throw new It("NOT_FOUND","Resource not found",u,h);case 422:throw new It("VALIDATION_ERROR",p,u,h);case 429:throw new It("RATE_LIMIT","Too many requests",u,h);case 500:case 502:case 503:case 504:throw new It("SERVER_ERROR","Server error, please try again later",u,h);default:throw new It("UNKNOWN_ERROR",p,u,h)}}}class It extends Error{constructor(s,l,u,h){super(l),this.code=s,this.status=u,this.details=h,this.name="ChannelClientError"}code;status;details}class gd{storage;sessionKey;conversationKey;sessionsKey;conversationMapKey;constructor(s,l){this.storage=l||(typeof window<"u"?window.localStorage:new Ip),this.sessionKey=`cheng_session_${s}`,this.conversationKey=`cheng_conversation_${s}`,this.sessionsKey=`cheng_sessions_${s}`,this.conversationMapKey=`cheng_conversation_map_${s}`}getOrCreateSessionId(){let s=this.storage.getItem(this.sessionKey);return s||(s=this._generateUUID(),this.storage.setItem(this.sessionKey,s)),this._ensureCurrentSessionListed(s),s}resetSession(){const s=this._generateUUID();return this.storage.setItem(this.sessionKey,s),this.storage.removeItem(this.conversationKey),this._ensureCurrentSessionListed(s),s}setConversationId(s){this.storage.setItem(this.conversationKey,s);const l=this.getOrCreateSessionId(),u=this._getConversationMap();u[l]=s,this._setConversationMap(u),this._updateSession(l,{conversationId:s})}getConversationId(){const s=this.storage.getItem(this.sessionKey),l=this._getConversationMap();if(s&&l[s])return l[s];const u=this.storage.getItem(this.conversationKey);return s&&u&&(l[s]=u,this._setConversationMap(l),this._updateSession(s,{conversationId:u})),u}clearConversationId(){this.storage.removeItem(this.conversationKey);const s=this.storage.getItem(this.sessionKey);if(!s)return;const l=this._getConversationMap();delete l[s],this._setConversationMap(l),this._updateSession(s,{conversationId:void 0})}clear(){this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey),this.storage.removeItem(this.sessionsKey),this.storage.removeItem(this.conversationMapKey)}listSessions(){const s=this.storage.getItem(this.sessionsKey),l=this.storage.getItem(this.sessionKey),u=this._getConversationMap();if(!s){if(!l)return[];const h={id:l,label:"Session 1",createdAt:new Date().toISOString(),conversationId:u[l],pinned:!1};return this.storage.setItem(this.sessionsKey,JSON.stringify([h])),[h]}try{const p=JSON.parse(s).map(v=>({...v,conversationId:u[v.id]??v.conversationId}));l&&!p.some(v=>v.id===l)&&p.unshift({id:l,label:`Session ${p.length+1}`,createdAt:new Date().toISOString(),conversationId:u[l],pinned:!1});const m=[...p.filter(v=>v.pinned),...p.filter(v=>!v.pinned)];return this.storage.setItem(this.sessionsKey,JSON.stringify(m)),m}catch{return[]}}createSession(s){const l=this.listSessions(),u=this._generateUUID(),h=s??`Session ${l.length+1}`,p={id:u,label:h,createdAt:new Date().toISOString(),pinned:!1};return l.unshift(p),this.storage.setItem(this.sessionsKey,JSON.stringify(l)),this.storage.setItem(this.sessionKey,u),this.storage.removeItem(this.conversationKey),p}renameSession(s,l){const u=l.trim();u&&this._updateSession(s,{label:u})}togglePinSession(s){const l=this.listSessions().find(u=>u.id===s);l&&this._updateSession(s,{pinned:!l.pinned})}deleteSession(s){let l=this.listSessions();const u=this.storage.getItem(this.sessionKey);if(l=l.filter(p=>p.id!==s),this.storage.setItem(this.sessionsKey,JSON.stringify(l)),u===s)if(l.length>0){this.storage.setItem(this.sessionKey,l[0].id);const m=this._getConversationMap()[l[0].id];m?this.storage.setItem(this.conversationKey,m):this.storage.removeItem(this.conversationKey)}else this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey);const h=this._getConversationMap();delete h[s],this._setConversationMap(h)}getActiveSessionId(){return this.getOrCreateSessionId()}setActiveSessionId(s){this.storage.setItem(this.sessionKey,s),this._ensureCurrentSessionListed(s);const u=this._getConversationMap()[s];u?this.storage.setItem(this.conversationKey,u):this.storage.removeItem(this.conversationKey)}_getConversationMap(){const s=this.storage.getItem(this.conversationMapKey);if(!s)return{};try{return JSON.parse(s)}catch{return{}}}_setConversationMap(s){this.storage.setItem(this.conversationMapKey,JSON.stringify(s))}_updateSession(s,l){const h=this.listSessions().map(p=>p.id===s?{...p,...l}:p);this.storage.setItem(this.sessionsKey,JSON.stringify(h))}_ensureCurrentSessionListed(s){const l=this.listSessions();if(l.some(h=>h.id===s))return;const u=[{id:s,label:`Session ${l.length+1}`,createdAt:new Date().toISOString(),conversationId:this._getConversationMap()[s],pinned:!1},...l];this.storage.setItem(this.sessionsKey,JSON.stringify(u))}_generateUUID(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,s=>{const l=Math.random()*16|0;return(s==="x"?l:l&3|8).toString(16)})}}let Ip=class{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(s){return this.data.get(s)??null}key(s){return Array.from(this.data.keys())[s]??null}removeItem(s){this.data.delete(s)}setItem(s,l){this.data.set(s,l)}};const Ep="cheng_active_execution",rd=c=>typeof c=="object"&&c!==null;class Ap{storage;recordsKey;activeExecutionKey;constructor(s,l){this.storage=l||(typeof window<"u"?window.localStorage:new Tp),this.recordsKey=`cheng_execution_mappings_${s}`,this.activeExecutionKey=`${Ep}_${s}`}setActive(s){const l=new Date().toISOString(),u={...s,status:s.status??"pending",createdAt:s.createdAt??l,updatedAt:s.updatedAt??l},h=this._readRecords();return h[u.executionId]=u,this._writeRecords(h),this.storage.setItem(this.activeExecutionKey,u.executionId),u}getActive(){const s=this.storage.getItem(this.activeExecutionKey);return s?this.getByExecutionId(s):null}getActiveForConversation(s){const l=this.getActive();return l?.conversationId===s?l:this.findLatestByConversation(s)}getByExecutionId(s){return this._readRecords()[s]??null}findLatestByConversation(s){const l=Object.values(this._readRecords()).filter(u=>u.conversationId===s);return l.length===0?null:l.sort((u,h)=>new Date(h.updatedAt).getTime()-new Date(u.updatedAt).getTime())[0]}updateStatus(s,l){const u=this._readRecords(),h=u[s];if(!h)return null;const p={...h,status:l,updatedAt:new Date().toISOString()};return u[s]=p,this._writeRecords(u),p}clearExecution(s){const l=this._readRecords();l[s]&&(delete l[s],this._writeRecords(l),this.storage.getItem(this.activeExecutionKey)===s&&this.storage.removeItem(this.activeExecutionKey))}clearConversation(s){const l=this._readRecords();let u=!1;for(const[p,m]of Object.entries(l))m.conversationId===s&&(delete l[p],u=!0);u&&this._writeRecords(l),this.getActive()?.conversationId===s&&this.storage.removeItem(this.activeExecutionKey)}clear(){this.storage.removeItem(this.recordsKey),this.storage.removeItem(this.activeExecutionKey)}_readRecords(){const s=this.storage.getItem(this.recordsKey);if(!s)return{};try{const l=JSON.parse(s);return rd(l)?Object.entries(l).reduce((u,[h,p])=>{if(!rd(p))return u;const m=p,v=typeof m.boundWorkflowId=="string"?m.boundWorkflowId:typeof m.workflowId=="string"?m.workflowId:void 0;return typeof m.channelId=="string"&&typeof v=="string"&&typeof m.conversationId=="string"&&typeof m.executionId=="string"&&typeof m.externalChatId=="string"&&typeof m.status=="string"&&typeof m.createdAt=="string"&&typeof m.updatedAt=="string"&&(u[h]={channelId:m.channelId,boundWorkflowId:v,conversationId:m.conversationId,executionId:m.executionId,externalChatId:m.externalChatId,externalUserId:m.externalUserId,status:m.status,createdAt:m.createdAt,updatedAt:m.updatedAt}),u},{}):{}}catch{return{}}}_writeRecords(s){this.storage.setItem(this.recordsKey,JSON.stringify(s))}}class Tp{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(s){return this.data.get(s)??null}key(s){return Array.from(this.data.keys())[s]??null}removeItem(s){this.data.delete(s)}setItem(s,l){this.data.set(s,l)}}class zp{config;ws=null;status="disconnected";eventHandlers=new Map;statusHandlers=new Set;activeSubscriptions=new Set;reconnectTimer=null;reconnectAttempts=0;shouldReconnect=!0;_wsGeneration=0;heartbeatTimer=null;heartbeatTimeoutTimer=null;lastPongTime=0;messageQueue=[];contractWarnedKeys=new Set;constructor(s){this.config={url:s.url,tokenProvider:s.tokenProvider,reconnect:s.reconnect??!0,reconnectInterval:s.reconnectInterval??1e3,reconnectMaxInterval:s.reconnectMaxInterval??3e4,reconnectBackoffRate:s.reconnectBackoffRate??2,reconnectMaxAttempts:s.reconnectMaxAttempts??1/0,reconnectJitter:s.reconnectJitter??!1,heartbeatInterval:s.heartbeatInterval??3e4,heartbeatTimeout:s.heartbeatTimeout??1e4,debug:s.debug??!1}}connect(){if(this.shouldReconnect=!0,this.ws?.readyState===WebSocket.OPEN){this._log("Already connected");return}if(this.ws?.readyState===WebSocket.CONNECTING){this._log("Already connecting");return}const s=this.config.tokenProvider?.(),l=s?`${this.config.url}${this.config.url.includes("?")?"&":"?"}token=${encodeURIComponent(s)}`:this.config.url;this._log(`Connecting to ${this.config.url}...`),this._setStatus("connecting");try{this._wsGeneration++,this.ws=new WebSocket(l),this._setupWebSocketHandlers(this._wsGeneration)}catch(u){this._log("Connection error:",u),this._setStatus("error"),this._scheduleReconnect()}}disconnect(){this._log("Disconnecting..."),this.shouldReconnect=!1,this._clearTimers(),this.messageQueue=[],this.ws&&(this._setStatus("disconnecting"),this.ws.close(1e3,"Client disconnect"),this.ws=null),this._setStatus("disconnected")}subscribe(s){const l=this._serializeScope(s);if(this.activeSubscriptions.has(l)){this._log(`Already subscribed to ${l}`);return}this.activeSubscriptions.add(l);const u={type:"SUBSCRIBE",scope:s};this._send(JSON.stringify(u)),this._log(`Subscribed to ${l}`)}unsubscribe(s){const l=this._serializeScope(s);if(!this.activeSubscriptions.has(l)){this._log(`Not subscribed to ${l}`);return}this.activeSubscriptions.delete(l);const u={type:"UNSUBSCRIBE",scope:s};this._send(JSON.stringify(u)),this._log(`Unsubscribed from ${l}`)}on(s,l){this.eventHandlers.has(s)||this.eventHandlers.set(s,new Set),this.eventHandlers.get(s).add(l)}off(s,l){const u=this.eventHandlers.get(s);u&&(u.delete(l),u.size===0&&this.eventHandlers.delete(s))}onStatusChange(s){this.statusHandlers.add(s)}offStatusChange(s){this.statusHandlers.delete(s)}getStatus(){return this.status}getActiveSubscriptions(){return Array.from(this.activeSubscriptions).map(s=>this._deserializeScope(s))}_setupWebSocketHandlers(s){this.ws&&(this.ws.onopen=()=>{this._log("Connected"),setTimeout(()=>{this._setStatus("connected"),this._flushMessageQueue(),this._restoreSubscriptions(),this._startHeartbeat()},1)},this.ws.onclose=l=>{s===this._wsGeneration&&(this._log(`Connection closed: ${l.code} ${l.reason}`),this._clearTimers(),this._setStatus("disconnected"),this.shouldReconnect&&this.config.reconnect&&this._scheduleReconnect())},this.ws.onerror=l=>{this._log("WebSocket error:",l),this._setStatus("error")},this.ws.onmessage=l=>{this._handleMessage(l.data)})}_handleMessage(s){try{const l=JSON.parse(s),u=this._normalizeEnvelope(l);if(!u){this._log("Ignoring malformed envelope:",l);return}if(this._guardEnvelopeContract(l,u),this._log("Received:",u.type,u),u.type==="PONG"){this._handlePong();return}this._dispatchEvent(u)}catch(l){this._log("Failed to parse message:",l,s)}}_normalizeEnvelope(s){if(!s||typeof s!="object"||Array.isArray(s))return null;const l=this._deepCamelizeKeys(s),u=l.type;if(typeof u!="string")return null;const h=typeof l.messageId=="string"?l.messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,p=typeof l.timestamp=="string"?l.timestamp:new Date().toISOString();return{...l,messageId:h,timestamp:p,type:u}}_guardEnvelopeContract(s,l){const h=(s&&typeof s=="object"&&!Array.isArray(s)?Object.keys(s):[]).filter(j=>j.includes("_"));h.length>0&&this._warnContract(`snake:${l.type}`,`[contract-guard] WS ${l.type} contains snake_case keys: ${h.join(", ")}`);const m={MESSAGE_CREATED:["conversationId","messageId","role","content"],WORKFLOW_TRIGGERED:["conversationId","workflowId","executionId"],MESSAGE_COMPLETED:["conversationId","messageId"],NODE_STREAM_CHUNK:["executionId","nodeId","content","sequence"],NODE_STREAM_COMPLETE:["executionId","nodeId","fullContent"],NODE_STREAM_FAILED:["executionId","nodeId","error"],EXECUTION_FAILED:["executionId","error"],ERROR:["code","message"]}[l.type];if(!m)return;const v=m.filter(j=>l[j]===void 0||l[j]===null);v.length>0&&this._warnContract(`missing:${l.type}:${v.join(",")}`,`[contract-guard] WS ${l.type} missing expected fields: ${v.join(", ")}`)}_warnContract(s,l){this.contractWarnedKeys.has(s)||(this.contractWarnedKeys.add(s),console.warn(l))}_deepCamelizeKeys(s){if(Array.isArray(s))return s.map(h=>this._deepCamelizeKeys(h));if(!s||typeof s!="object")return s;const l=s,u={};for(const[h,p]of Object.entries(l))u[this._toCamelCase(h)]=this._deepCamelizeKeys(p);return u}_toCamelCase(s){return s.replace(/_([a-z])/g,(l,u)=>u.toUpperCase())}_dispatchEvent(s){const l=this.eventHandlers.get("*");l&&l.forEach(h=>{try{h(s)}catch(p){this._log("Error in wildcard handler:",p)}});const u=this.eventHandlers.get(s.type);u&&u.forEach(h=>{try{h(s)}catch(p){this._log(`Error in ${s.type} handler:`,p)}})}_send(s){const l=this._wrapEnvelope(s);this.ws?.readyState===WebSocket.OPEN?(this.ws.send(l),this._log("Sent:",l)):(this.messageQueue.push(s),this._log("Queued:",s))}_wrapEnvelope(s){try{const l=JSON.parse(s),u={messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,timestamp:new Date().toISOString(),...l};return JSON.stringify(u)}catch{return s}}_flushMessageQueue(){this.messageQueue.length!==0&&(this._log(`Flushing ${this.messageQueue.length} queued messages`),this.messageQueue.forEach(s=>{this.ws?.readyState===WebSocket.OPEN&&this.ws.send(this._wrapEnvelope(s))}),this.messageQueue=[])}_restoreSubscriptions(){this.activeSubscriptions.size!==0&&(this._log(`Restoring ${this.activeSubscriptions.size} subscriptions`),this.messageQueue=this.messageQueue.filter(s=>{try{const l=JSON.parse(s);return l.type!=="SUBSCRIBE"&&l.type!=="UNSUBSCRIBE"}catch{return!0}}),this.activeSubscriptions.forEach(s=>{const u={type:"SUBSCRIBE",scope:this._deserializeScope(s)};this.ws?.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(u))}))}_scheduleReconnect(){if(!this.config.reconnect||!this.shouldReconnect)return;if(this.reconnectAttempts>=this.config.reconnectMaxAttempts){this._log(`Max reconnect attempts (${this.config.reconnectMaxAttempts}) reached, giving up`),this.shouldReconnect=!1,this._setStatus("error");return}let s=Math.min(this.config.reconnectInterval*Math.pow(this.config.reconnectBackoffRate,this.reconnectAttempts),this.config.reconnectMaxInterval);if(this.config.reconnectJitter){const l=s*.3*Math.random();s=s+l}this._log(`Reconnecting in ${Math.round(s)}ms (attempt ${this.reconnectAttempts+1}/${this.config.reconnectMaxAttempts})`),this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.reconnectAttempts++,this._setStatus("connecting"),this.connect()},s)}_startHeartbeat(){this._clearHeartbeat(),this.heartbeatTimer=setInterval(()=>{this._sendPing()},this.config.heartbeatInterval),this._sendPing()}_sendPing(){this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null);const s={type:"PING",timestamp:Date.now()};this._send(JSON.stringify(s)),this.heartbeatTimeoutTimer=setTimeout(()=>{this._log(`Heartbeat timeout (${this.config.heartbeatTimeout}ms), reconnecting...`),this.ws?.close(1e3,"Heartbeat timeout")},this.config.heartbeatTimeout)}_handlePong(){const s=Date.now(),l=this.lastPongTime?s-this.lastPongTime:0;this.lastPongTime=s,this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null),this._log(`Heartbeat OK${l?` (Δ ${l}ms)`:""}`)}_clearHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=null),this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null)}_clearTimers(){this._clearHeartbeat(),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null)}_setStatus(s){this.status!==s&&(this.status=s,this._log(`Status changed: ${s}`),this.statusHandlers.forEach(l=>{try{l(s)}catch(u){this._log("Error in status handler:",u)}}))}_serializeScope(s){if(s.type==="workspace")return`ws:${s.workspaceId}`;if(s.type==="conversation")return`conv:${s.conversationId}`;if(s.type==="execution")return`exec:${s.executionId}`;throw new Error(`Unknown scope type: ${s.type}`)}_deserializeScope(s){const[l,u]=s.split(":");if(l==="ws")return{type:"workspace",workspaceId:u};if(l==="conv")return{type:"conversation",conversationId:u};if(l==="exec")return{type:"execution",executionId:u};throw new Error(`Invalid scope key: ${s}`)}_log(...s){this.config.debug&&console.log("[WsClient]",...s)}}const ve=c=>typeof c=="object"&&c!==null;function Qo(c){if(Array.isArray(c))return c;if(!ve(c))return[];const s=c,l=ve(s.data)?s.data:void 0;return Array.isArray(l?.items)?l.items:Array.isArray(s.data)?s.data:Array.isArray(s.items)?s.items:[]}function Xo(c,s){const l=c.bound_workflow_id??c.boundWorkflowId,u=l!=null&&l!==""?String(l):"";return{id:String(c.id??""),workspaceId:String(c.workspace_id??c.workspaceId??s),channelId:String(c.channel_id??c.channelId??""),name:String(c.name??""),description:c.description!=null?String(c.description):void 0,boundWorkflowId:u,appType:typeof c.app_type=="string"?c.app_type:typeof c.appType=="string"?c.appType:void 0,connectionConfig:ve(c.connection_config)?c.connection_config:ve(c.connectionConfig)?c.connectionConfig:void 0,enabled:typeof c.enabled=="boolean"?c.enabled:!0,connectionState:typeof c.connection_state=="string"?c.connection_state:typeof c.connectionState=="string"?c.connectionState:void 0,setupData:ve(c.setup_data)?c.setup_data:ve(c.setupData)?c.setupData:void 0,webhookUrl:typeof c.webhook_url=="string"?c.webhook_url:typeof c.webhookUrl=="string"?c.webhookUrl:void 0,createdAt:String(c.created_at??c.createdAt??new Date().toISOString()),updatedAt:String(c.updated_at??c.updatedAt??c.created_at??c.createdAt??new Date().toISOString())}}function Lp(c){const l=(Array.isArray(c.tags)?c.tags:[]).find(p=>p.startsWith("chid:"));if(!l)return null;const u=ve(c.metadata)?c.metadata:{},h=String(c.id??c.workflowId??c.workflow_id??"");return{id:h,workspaceId:String(u.workspace_id??u.workspaceId??""),channelId:l.slice(5),name:String(u.display_name??c.name??""),description:c.description?String(c.description):void 0,boundWorkflowId:String(u.workflow_id??u.workflowId??h),appType:typeof u.app_type=="string"?u.app_type:void 0,connectionConfig:ve(u.connection_config)?u.connection_config:void 0,enabled:!0,createdAt:String(c.created_at??c.createdAt??new Date().toISOString()),updatedAt:String(c.updated_at??c.updatedAt??c.created_at??c.createdAt??new Date().toISOString())}}function Mp(c){const s=ve(c.metadata)?c.metadata:{},l=c.id??c.workflow_id??c.workflowId,u=c.name??c.display_name??c.displayName??s.display_name??s.displayName??l;return{id:String(l??""),name:String(u??""),description:c.description!=null?String(c.description):void 0,state:typeof c.state=="string"?c.state:void 0,visibility:typeof c.visibility=="string"?c.visibility:void 0,tags:Array.isArray(c.tags)?c.tags.map(String):[],createdAt:typeof(c.created_at??c.createdAt)=="string"?String(c.created_at??c.createdAt):void 0,updatedAt:typeof(c.updated_at??c.updatedAt)=="string"?String(c.updated_at??c.updatedAt):void 0}}class tt{constructor(s,l){this.apiBaseUrl=s,this.tokenProvider=l}apiBaseUrl;tokenProvider;async listChannels(){let s;try{s=await this.listWorkspaces()}catch(h){if(od(h))throw h;return this._listChannelsLegacy()}if(s.length===0)return this._listChannelsLegacy();const l=[];let u=!1;for(const h of s){const p=await this._fetchChannelsByWorkspaceSafe(h.id);p!==null&&(u=!0,l.push(...p))}return u?l:this._listChannelsLegacy()}async createChannel(s){try{const l=await this._fetch(`/workspaces/${s.workspaceId}/channels`,"POST",{channel_id:s.channelId,name:s.name,bound_workflow_id:s.boundWorkflowId,description:s.description,app_type:s.appType,connection_config:s.connectionConfig}),u=ve(l)?l:void 0,h=ve(u?.data)?u?.data:u??{};return Xo(h,s.workspaceId)}catch(l){if(l instanceof ei&&l.status===409){const u=ve(l.body)?l.body:void 0,h=ve(u?.details)?u.details:void 0,p=ve(h?.existing_channel)?h.existing_channel:void 0;if(p)return Xo(p,s.workspaceId);throw new Error(`Integration with ID "${s.channelId}" already exists in this workspace.`)}if(!Js(l))throw l;return this._createChannelLegacy(s)}}async updateChannel(s){const l=await this._fetch(`/workspaces/${s.workspaceId}/channels/${s.id}`,"PATCH",{channel_id:s.channelId,name:s.name,bound_workflow_id:s.boundWorkflowId,description:s.description,app_type:s.appType,connection_config:s.connectionConfig}),u=ve(l)?l:void 0,h=ve(u?.data)?u?.data:u??{};return Xo(h,s.workspaceId)}async deleteChannel(s,l){if(l)try{await this._fetch(`/workspaces/${l}/channels/${s}`,"DELETE");return}catch(u){if(!Js(u))throw u}await this._fetch(`/workflows/${s}`,"DELETE")}async listWorkspaces(){const s=await this._fetch("/workspaces","GET");return Qo(s).map(u=>{const h=u;return{id:String(h.id??h.workspace_id??""),name:String(h.name??""),description:h.description?String(h.description):void 0,createdAt:String(h.created_at??h.createdAt??new Date().toISOString()),updatedAt:h.updated_at?String(h.updated_at):h.updatedAt?String(h.updatedAt):void 0}})}async createWorkspace(s){const l=await this._fetch("/workspaces","POST",{name:s.name,description:s.description}),u=ve(l)?l:void 0,p=ve(u?.data)?u?.data:u??{};return{id:String(p.id??p.workspace_id??""),name:String(p.name??s.name),description:p.description?String(p.description):s.description,createdAt:String(p.created_at??p.createdAt??new Date().toISOString()),updatedAt:p.updated_at?String(p.updated_at):p.updatedAt?String(p.updatedAt):void 0}}async listPublishedWorkflows(s={}){const l=s.limit??100,u=new URLSearchParams({tags:"long_task",limit:String(l)}),h=await this._fetch(`/workflows?${u.toString()}`,"GET");return Qo(h).map(m=>Mp(m)).filter(m=>m.id.trim().length>0)}async getWorkflowName(s){const l=await this._fetch(`/workflows/${s}`,"GET"),u=ve(l)?l:void 0,p=ve(u?.data)?u?.data:u??{},m=ve(p.metadata)?p.metadata:void 0,v=p.name??p.display_name??p.displayName??m?.display_name??m?.displayName??p.title;return typeof v=="string"&&v.trim()?v.trim():null}async getChannelStatus(s,l){const u=await this._fetch(`/workspaces/${s}/channels/${l}/status`,"GET"),h=ve(u)?u:{},p=ve(h.data)?h.data:h;return{connectionState:String(p.connection_state??p.connectionState??"idle"),ok:typeof p.ok=="boolean"?p.ok:void 0,details:typeof p.details=="string"?p.details:void 0,lastMessageAt:typeof p.last_message_at=="string"?p.last_message_at:void 0,error:typeof p.error=="string"?p.error:void 0,mode:p.mode==="polling"||p.mode==="webhook"||p.mode==="stream"?p.mode:void 0,workerRunning:typeof p.worker_running=="boolean"?p.worker_running:void 0,lastPollAt:typeof p.last_poll_at=="string"?p.last_poll_at:void 0,startedAt:typeof p.started_at=="string"?p.started_at:void 0,lastEventAt:typeof p.last_event_at=="string"?p.last_event_at:void 0,lastError:typeof p.last_error=="string"?p.last_error:void 0}}async getChannelCapabilities(s,l){const u=await this._fetch(`/workspaces/${s}/channels/${l}/capabilities`,"GET"),h=ve(u)?u:{},p=ve(h.data)?h.data:h,m=v=>typeof v=="boolean"?v:void 0;return{raw:p,directMessage:m(p.direct_message),groupChat:m(p.group_chat),reactions:m(p.reactions),messageEdit:m(p.message_edit),messageDelete:m(p.message_delete),mediaUpload:m(p.media_upload),mediaDownload:m(p.media_download),typingIndicator:m(p.typing_indicator),readReceipts:m(p.read_receipts),webhooks:m(p.webhooks),longPolling:m(p.long_polling)}}async getChannelAuthPattern(s,l){const u=await this._fetch(`/workspaces/${s}/channels/${l}/auth-pattern`,"GET"),h=ve(u)?u:{},p=ve(h.data)?h.data:h,m=p.pattern??p.auth_pattern??p.authPattern;return{authPattern:Rp(m),raw:p,fields:Array.isArray(p.fields)?p.fields:void 0,webhookUrl:typeof(p.webhook_url??p.webhookUrl)=="string"?String(p.webhook_url??p.webhookUrl):void 0,oauthUrl:typeof(p.oauth_url??p.oauthUrl)=="string"?String(p.oauth_url??p.oauthUrl):void 0,instructions:typeof p.instructions=="string"?p.instructions:void 0}}async connectChannel(s,l,u){const h=await this._fetch(`/workspaces/${s}/channels/${l}/connect`,"POST",u),p=ve(h)?h:{},m=ve(p.data)?p.data:p;return{connectionState:String(m.connection_state??m.connectionState??"connecting"),setupData:ve(m.setup_data)?m.setup_data:ve(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async completeConnect(s,l,u){const h=await this._fetch(`/workspaces/${s}/channels/${l}/connect/complete`,"POST",u),p=ve(h)?h:{},m=ve(p.data)?p.data:p;return{connectionState:String(m.connection_state??m.connectionState??"active"),setupData:ve(m.setup_data)?m.setup_data:ve(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async disconnectChannel(s,l){await this._fetch(`/workspaces/${s}/channels/${l}/connect`,"DELETE")}async _fetchChannelsByWorkspaceSafe(s){try{const l=await this._fetch(`/workspaces/${s}/channels`,"GET");return Qo(l).map(h=>Xo(h,s))}catch(l){if(Js(l))return null;if(od(l))throw l;return[]}}async _listChannelsLegacy(){const s=await this._fetch("/workflows","GET"),l=Qo(s),u=[];for(const h of l){const p=Lp(h);p&&u.push(p)}return u}async _createChannelLegacy(s){const u=(await this._listChannelsLegacy()).find(A=>A.channelId===s.channelId);if(u)return u;const h={name:s.channelId,description:s.description,tags:[`chid:${s.channelId}`],metadata:{channel_id:s.channelId,workspace_id:s.workspaceId,display_name:s.name,workflow_id:s.boundWorkflowId,app_type:s.appType,connection_config:s.connectionConfig}},p=await this._fetch("/workflows","POST",h),m=ve(p)?p:void 0,j=ve(m?.data)?m?.data:m??{},k=ve(j.metadata)?j.metadata:{};return{id:String(j.id??j.workflowId??j.workflow_id??""),workspaceId:s.workspaceId,channelId:s.channelId,name:String(k.display_name??s.name),description:j.description?String(j.description):s.description,boundWorkflowId:String(k.workflow_id??k.workflowId??s.boundWorkflowId),appType:typeof k.app_type=="string"?k.app_type:s.appType,connectionConfig:ve(k.connection_config)?k.connection_config:s.connectionConfig,enabled:!0,createdAt:String(j.created_at??j.createdAt??new Date().toISOString()),updatedAt:String(j.updated_at??j.updatedAt??j.created_at??j.createdAt??new Date().toISOString())}}async _fetch(s,l,u){const h=`${this.apiBaseUrl}${s}`,p=await this.tokenProvider.getAccessToken();if(!p)throw kn("missing-access-token"),new Error("Authentication required");const m=async k=>fetch(h,{method:l,headers:{"Content-Type":"application/json",Authorization:`Bearer ${k}`},body:u!==void 0?JSON.stringify(u):void 0});let v=await m(p),j=!1;if(v.status===401&&this.tokenProvider.refreshAccessToken){const k=await this.tokenProvider.refreshAccessToken().catch(()=>null);k?v=await m(k):(kn("refresh-failed"),j=!0)}if(!v.ok){v.status===401&&!j&&kn("unauthorized");const k=await v.text().catch(()=>"");let z;try{z=JSON.parse(k)}catch{z=void 0}throw new ei(v.status,`Management API error ${v.status}: ${k}`,z)}return v.status===204||v.headers.get("content-length")==="0"?null:v.json().catch(()=>null)}}class ei extends Error{constructor(s,l,u){super(l),this.status=s,this.body=u,this.name="ManagementApiError"}status;body}function Js(c){return c instanceof ei?c.status===404||c.status===405:c instanceof Error?c.message.includes("404")||c.message.includes("405"):!1}function od(c){return c instanceof ei?c.status===401||c.status===403:c instanceof Error?c.message.includes("401")||c.message.includes("403")||c.message.toLowerCase().includes("authentication"):!1}const id=new Set;function Rp(c){const s=["webhook_token","webhook_signature","webhook_encrypted_signature","oauth","qr_session","stream_connection"],l=typeof c=="string"?c.toLowerCase().replace(/-/g,"_"):"";return s.includes(l)?l:(l&&!id.has(l)&&(id.add(l),console.warn(`[ManagementClient] Unknown auth-pattern value "${l}" from backend. Expected one of: ${s.join(", ")}. Defaulting to "webhook_token".`)),"webhook_token")}function Pp(c){const{autoConnect:s=!0,url:l,tokenProvider:u,...h}=c,p=f.useRef(!1),m=f.useRef(null),[v,j]=f.useState("disconnected"),[k,z]=f.useState([]);f.useEffect(()=>{const V={url:l,tokenProvider:u,...h},B=new zp(V);m.current=B;const X=ie=>{j(ie)};B.onStatusChange(X);let oe=null;return s&&!p.current&&(oe=setTimeout(()=>{B.connect()},0)),()=>{oe&&clearTimeout(oe),B.offStatusChange(X),B.disconnect(),m.current=null}},[l]),f.useEffect(()=>{if(typeof window>"u")return;const V=()=>{p.current=!0,m.current?.disconnect(),z([])};return window.addEventListener(Dr,V),()=>{window.removeEventListener(Dr,V)}},[]);const A=f.useCallback(()=>{if(p.current){if(!(typeof window<"u"&&!!window.localStorage.getItem(Zo)))return;p.current=!1}m.current?.connect()},[]),H=f.useCallback(()=>{m.current?.disconnect()},[]),E=f.useCallback(V=>{m.current?.subscribe(V),z(m.current?.getActiveSubscriptions()||[])},[]),G=f.useCallback(V=>{m.current?.unsubscribe(V),z(m.current?.getActiveSubscriptions()||[])},[]),C=f.useCallback((V,B)=>{m.current?.on(V,B)},[]),K=f.useCallback((V,B)=>{m.current?.off(V,B)},[]);return{status:v,connect:A,disconnect:H,subscribe:E,unsubscribe:G,on:C,off:K,activeSubscriptions:k,isConnected:v==="connected",isConnecting:v==="connecting",isDisconnected:v==="disconnected"}}function Dp(c,s){switch(s.type){case"ADD_MESSAGE":return[...c,s.message];case"UPDATE_MESSAGE":return c.map(l=>l.id===s.id?{...l,...s.updates}:l);case"REMOVE_MESSAGE":return c.filter(l=>l.id!==s.id);case"REMOVE_ASSISTANT_BY_EXEC_ID":return c.filter(l=>!(l.role==="assistant"&&l.executionId===s.executionId));case"REMOVE_EMPTY_ASSISTANTS":return c.filter(l=>!(l.role==="assistant"&&!l.content));case"CLEAR_MESSAGES":return[];case"SET_MESSAGES":return s.messages;default:return c}}function Wp(c){return c?c.includes("No response output found in execution")?"工作流未返回任何输出（请检查工作流是否配置了节点）":c.includes("No nodes")||c.includes("0 nodes")?"工作流没有节点，请先添加节点":c.includes("timeout")||c.includes("Timeout")?"工作流执行超时":c.includes("not found")||c.includes("Not found")?"工作流或资源未找到":c:"工作流执行失败"}function Fp(c){const s=c.replace(/\s+/g," ").trim();if(!s)return"新会话";const l=s.split(/\r?\n/)[0]?.trim()??s,u=l.split(/[。！？!?]/)[0]?.trim()||l,h=18;return u.length<=h?u:`${u.slice(0,h)}...`}function Op(c){if(!c)return!0;const s=c.trim();return/^(session|会话|新会话)(\s*\d+)?$/i.test(s)}function Up(c){const s=f.useRef(null),l=f.useRef(null),u=f.useRef(null),[h,p]=f.useReducer(Dp,[]),[m,v]=f.useState(!1),[j,k]=f.useState(null),[z,A]=f.useState(null),[H,E]=f.useState(!1),G=f.useRef(""),C=f.useRef(null),K=f.useRef(null),O=f.useRef(null),$=f.useRef(null),J=f.useRef(Date.now()),V=f.useRef(new Ve(c.apiBaseUrl)),B=Pp({url:c.wsBaseUrl,tokenProvider:()=>V.current.getAccessTokenSync(),autoConnect:!0,debug:!1}),X=B.subscribe,oe=B.unsubscribe,ie=B.on,se=B.off,te=B.connect;f.useEffect(()=>{s.current=new Np(c),l.current=new gd(c.channelId),u.current=new Ap(c.channelId),c.sessionId&&l.current.setActiveSessionId(c.sessionId),p({type:"CLEAR_MESSAGES"}),v(!1),k(null),A(null),G.current="",C.current=null,K.current=null,O.current=null,$.current=null;const R=l.current.getConversationId();if(R){O.current=R,X({type:"conversation",conversationId:R});const Q=u.current.getActiveForConversation(R);Q&&($.current=Q.executionId,X({type:"execution",executionId:Q.executionId})),(async()=>{try{const P=[...await s.current.getConversationMessages(R)].sort((M,F)=>new Date(M.createdAt).getTime()-new Date(F.createdAt).getTime());p({type:"SET_MESSAGES",messages:P.map(M=>({id:M.id,role:M.role??"assistant",content:M.content,status:"completed",createdAt:new Date(M.createdAt),executionId:M.executionId}))})}catch{}})()}},[c.apiBaseUrl,c.channelId,c.sessionId,X]),f.useEffect(()=>{const R=c.boundWorkflowId?.trim();if(!R||!s.current){E(!1);return}let Q=!1;return s.current.workflowSupportsAttachments(R).then(D=>{Q||E(D)}).catch(()=>{Q||E(!1)}),()=>{Q=!0}},[c.boundWorkflowId,c.apiBaseUrl]),f.useEffect(()=>{const R=_=>_?$.current===_:!1,Q=_=>{J.current=Date.now(),_.role==="assistant"&&(C.current?(p({type:"UPDATE_MESSAGE",id:C.current,updates:{content:_.content,status:"completed"}}),C.current=null,K.current=null):p({type:"ADD_MESSAGE",message:{id:`msg-assistant-${Date.now()}`,role:"assistant",content:_.content,status:"completed",executionId:$.current??void 0,createdAt:new Date}}),$.current&&(u.current?.updateStatus($.current,"completed"),u.current?.clearExecution($.current)),G.current="",A(null),v(!1))},D=_=>{v(!1),C.current&&(p({type:"REMOVE_MESSAGE",id:C.current}),C.current=null,K.current=null),p({type:"REMOVE_EMPTY_ASSISTANTS"}),$.current&&u.current?.clearExecution($.current),$.current&&(oe({type:"execution",executionId:$.current}),$.current=null)},P=_=>{J.current=Date.now();const{executionId:Z}=_;if(Z&&($.current&&$.current!==Z&&oe({type:"execution",executionId:$.current}),$.current=Z,X({type:"execution",executionId:Z}),O.current&&u.current?.setActive({channelId:c.channelId,boundWorkflowId:_.workflowId,conversationId:O.current,executionId:Z,externalChatId:l.current?.getOrCreateSessionId()??"",externalUserId:c.externalUserId,status:"running"}),!C.current||K.current!==Z)){const pe=`msg-assistant-${Date.now()}`;C.current=pe,K.current=Z,p({type:"ADD_MESSAGE",message:{id:pe,role:"assistant",content:"",status:"streaming",executionId:Z,createdAt:new Date}})}},M=_=>{R(_.executionId)&&(A(""),G.current="")},F=_=>{R(_.executionId)&&(J.current=Date.now(),G.current+=_.content,A(G.current),C.current&&p({type:"UPDATE_MESSAGE",id:C.current,updates:{content:G.current,status:"streaming"}}))},g=_=>{R(_.executionId)&&(_.fullContent&&G.current!==_.fullContent&&(console.warn("[useChannel] Stream content mismatch:",G.current.length,"vs",_.fullContent.length),G.current=_.fullContent,A(_.fullContent),C.current&&p({type:"UPDATE_MESSAGE",id:C.current,updates:{content:_.fullContent}})),_.usage&&console.log("[useChannel] Token usage:",_.usage),$.current===_.executionId&&u.current?.updateStatus(_.executionId,"completed"))},N=_=>{R(_.executionId)&&(v(!1),k(new Error(_.error)),C.current&&p({type:"UPDATE_MESSAGE",id:C.current,updates:{status:"error",content:_.partialContent||"流式输出失败"}}))},y=async _=>{if(!R(_.executionId)||!C.current)return;const Z=s.current,pe=l.current?.getConversationId();if(!(!Z||!pe))try{const me=(await Z.getConversationMessages(pe)).find(De=>De.role==="assistant"&&De.executionId===_.executionId);me&&C.current&&(p({type:"UPDATE_MESSAGE",id:C.current,updates:{content:me.content,status:"completed"}}),C.current=null,K.current=null,G.current="",A(null),v(!1))}catch{}},W=_=>{const Z=_.error||_.error||"",pe=Wp(Z);k(new Error(pe));const _e=_.executionId||_.execution_id;_e&&!R(_e)||(v(!1),C.current?(p({type:"REMOVE_MESSAGE",id:C.current}),C.current=null,K.current=null):p(_e?{type:"REMOVE_ASSISTANT_BY_EXEC_ID",executionId:_e}:{type:"REMOVE_EMPTY_ASSISTANTS"}),_e&&u.current?.updateStatus(_e,"failed"))},L=_=>{R(_.executionId)&&(J.current=Date.now(),v(!1),p({type:"ADD_MESSAGE",message:{id:`approval-${_.requestId}`,role:"assistant",content:`需要确认操作：${_.actionName}`,status:"approval",executionId:_.executionId,approval:{requestId:_.requestId,actionName:_.actionName,riskLevel:_.riskLevel,paramSummary:_.paramSummary,status:"pending"},createdAt:new Date}}))},U=_=>{console.error("[useChannel] WebSocket error:",_.code,_.message),k(new Error(`${_.code}: ${_.message}`)),_.executionId&&C.current&&p({type:"UPDATE_MESSAGE",id:C.current,updates:{status:"error"}}),_.executionId&&u.current?.updateStatus(_.executionId,"failed")};return ie("MESSAGE_CREATED",Q),ie("MESSAGE_COMPLETED",D),ie("WORKFLOW_TRIGGERED",P),ie("NODE_STREAM_START",M),ie("NODE_STREAM_CHUNK",F),ie("NODE_STREAM_COMPLETE",g),ie("NODE_STREAM_FAILED",N),ie("EXECUTION_FAILED",W),ie("EXECUTION_COMPLETE",y),ie("APPROVAL_REQUESTED",L),ie("ERROR",U),()=>{se("MESSAGE_CREATED",Q),se("MESSAGE_COMPLETED",D),se("WORKFLOW_TRIGGERED",P),se("NODE_STREAM_START",M),se("NODE_STREAM_CHUNK",F),se("NODE_STREAM_COMPLETE",g),se("NODE_STREAM_FAILED",N),se("EXECUTION_FAILED",W),se("EXECUTION_COMPLETE",y),se("APPROVAL_REQUESTED",L),se("ERROR",U)}},[ie,se,X,oe,c.channelId,c.externalUserId]),f.useEffect(()=>{const Q=setInterval(()=>{Date.now()-J.current>3e5&&B.disconnect()},3e4);return()=>clearInterval(Q)},[B.disconnect]);const ae=f.useCallback(async(R,Q)=>{if(!s.current||!l.current)throw new Error("Channel client not initialized");if(!R.trim()&&(!Q||Q.length===0))return;J.current=Date.now(),te(),k(null),v(!0),$.current&&(oe({type:"execution",executionId:$.current}),$.current=null);const D=c.sessionId||l.current.getOrCreateSessionId(),P=l.current.listSessions().find(F=>F.id===D);R.trim()&&Op(P?.label)&&(l.current.renameSession(D,Fp(R)),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cheng:session-label-updated",{detail:{channelId:c.channelId,sessionId:D}})));const M=`msg-user-${Date.now()}`;p({type:"ADD_MESSAGE",message:{id:M,role:"user",content:R,status:"sending",createdAt:new Date}});try{O.current&&X({type:"conversation",conversationId:O.current});const F=c.boundWorkflowId.trim();if(!F)throw new Error("Bound Workflow ID is required");const g=await s.current.execute(c.channelId,F,R,D,c.externalUserId,Q);p({type:"UPDATE_MESSAGE",id:M,updates:{status:"sent"}});const{conversation_id:N,execution_id:y}=g;if(O.current=N,l.current.setConversationId(N),X({type:"conversation",conversationId:N}),y){$.current=y,X({type:"execution",executionId:y}),u.current?.setActive({channelId:c.channelId,boundWorkflowId:F,conversationId:N,executionId:y,externalChatId:D,externalUserId:c.externalUserId,status:"running"});let W=C.current;(!W||K.current!==y)&&(W=`msg-assistant-${Date.now()}`,C.current=W,K.current=y,p({type:"ADD_MESSAGE",message:{id:W,role:"assistant",content:"",status:"streaming",executionId:y,createdAt:new Date}}));const L=async(pe,_e,me,De)=>{if(C.current!==me)return;const fe=s.current;if(fe)try{const Ie=(await fe.getConversationMessages(pe)).find(Se=>Se.role==="assistant"&&Se.executionId===_e);if(C.current!==me)return;if(Ie){p({type:"UPDATE_MESSAGE",id:me,updates:{content:Ie.content,status:"completed"}}),u.current?.updateStatus(_e,"completed"),u.current?.clearExecution(_e),C.current=null,K.current=null,G.current="",A(null),v(!1);return}}catch{if(!De||C.current!==me)return;p({type:"REMOVE_MESSAGE",id:me}),C.current=null,K.current=null,u.current?.updateStatus(_e,"failed"),v(!1)}};setTimeout(()=>{L(N,y,W,!1)},250);const U=W,_=N,Z=y;[5e3,1e4,2e4,4e4].forEach((pe,_e,me)=>{setTimeout(async()=>{C.current===U&&(await L(_,Z,U,!1),_e===me.length-1&&C.current===U&&(p({type:"UPDATE_MESSAGE",id:U,updates:{status:"error",content:"执行超时，请重试"}}),C.current=null,K.current=null,u.current?.updateStatus(Z,"failed"),v(!1)))},pe)})}else v(!1),console.warn("[useChannel] No execution_id returned, workflow not triggered")}catch(F){throw v(!1),k(F instanceof Error?F:new Error(String(F))),p({type:"UPDATE_MESSAGE",id:M,updates:{status:"error"}}),F}},[c.channelId,c.sessionId,c.boundWorkflowId,c.externalUserId,X,oe,te]),ce=f.useCallback(()=>{p({type:"CLEAR_MESSAGES"}),O.current=null,$.current=null,v(!1),k(null),A(null),G.current="",C.current=null,K.current=null,u.current?.clear(),l.current?.resetSession()},[]),ne=f.useCallback(async(R,Q,D)=>{const P=h.find(M=>M.id===R);if(!(!P?.executionId||!P.approval||!s.current)){p({type:"UPDATE_MESSAGE",id:R,updates:{approval:{...P.approval,status:"submitting"}}});try{await s.current.submitApproval(P.executionId,P.approval.requestId,Q,D),p({type:"UPDATE_MESSAGE",id:R,updates:{approval:{...P.approval,status:Q,reason:D}}})}catch(M){const F=M instanceof Error?M:new Error(String(M));k(F),p({type:"UPDATE_MESSAGE",id:R,updates:{approval:{...P.approval,status:"error"}}})}}},[h]),xe=B.isConnected?"connected":B.isConnecting?"connecting":B.status==="error"?"error":"disconnected";return{messages:h,sendMessage:ae,isLoading:m,connectionStatus:xe,streamingContent:z,resetConversation:ce,submitApproval:ne,error:j,supportsAttachments:H}}const sd="cheng_active_channel";function ad(c,s,l,u){const h=l.trim().toLowerCase();if(c.find(m=>u&&m.id===u?!1:m.workspaceId===s&&m.channelId.trim().toLowerCase()===h))throw new Error(`Agent ID "${l.trim()}" already exists in this workspace`)}function $p(c){const[s,l]=f.useState([]),[u,h]=f.useState(null),[p,m]=f.useState(!1),[v,j]=f.useState(null),k=f.useRef(null),z=f.useRef(null),A=f.useRef(c);A.current=c;const H=f.useRef([]);H.current=s,!z.current&&c&&(z.current=new Ve(c.apiBaseUrl));const E=f.useCallback(async()=>{const V=A.current;if(!V)return;const B=z.current;if(!B)return;if(!await B.getAccessToken()){const ie={id:V.channelId,workspaceId:V.workspaceId??"",channelId:V.channelId,name:"Default",boundWorkflowId:V.boundWorkflowId,createdAt:new Date().toISOString()};l([ie]),h(se=>se??ie);return}k.current||(k.current=new tt(V.apiBaseUrl,B));const oe=k.current;m(!0),j(null);try{const ie=await oe.listChannels();l(ie);const se=typeof window<"u"?window.localStorage.getItem(sd):null;h(te=>te?ie.find(ne=>ne.channelId===te.channelId)??ie[0]??null:(se?ie.find(ce=>ce.channelId===se):null)??ie[0]??null)}catch(ie){j(ie instanceof Error?ie:new Error(String(ie)))}finally{m(!1)}},[]),G=f.useRef(!1);f.useEffect(()=>{G.current||(G.current=!0,E())},[E]);const C=f.useCallback(V=>{h(V),typeof window<"u"&&window.localStorage.setItem(sd,V.channelId)},[]),K=f.useCallback(async()=>{if(k.current)return k.current;const V=A.current;if(!V)throw new Error("Workspace not selected.");const B=z.current;if(!await B.getAccessToken())throw new Error("Authentication required. Please log in.");return k.current=new tt(V.apiBaseUrl,B),k.current},[]),O=f.useCallback(async V=>{ad(H.current,V.workspaceId,V.channelId);const X=await(await K()).createChannel(V);return await E(),C(X),X},[K,E,C]),$=f.useCallback(async V=>{ad(H.current,V.workspaceId,V.channelId,V.id);const X=await(await K()).updateChannel(V);return await E(),h(oe=>oe&&(oe.id===V.id||oe.channelId===V.channelId?X:oe)),X},[K,E]),J=f.useCallback(async V=>{const B=await K(),X=H.current.find(oe=>oe.id===V);await B.deleteChannel(V,X?.workspaceId),h(oe=>oe?.id===V?null:oe),await E()},[K,E]);return{channels:s,activeChannel:u,setActiveChannel:C,createChannel:O,updateChannel:$,deleteChannel:J,isLoading:p,error:v,refresh:E}}function Bp(c){const l=f.useRef(new ra(c)).current,[u,h]=f.useState(()=>l.isAuthenticated()),[p,m]=f.useState(!1),[v,j]=f.useState(null),[k,z]=f.useState(null),A=f.useCallback(async G=>{m(!0),j(null);try{const C=await l.login(G);z(C.user),h(!0)}catch(C){j(C instanceof Error?C.message:String(C))}finally{m(!1)}},[l]),H=f.useCallback(()=>{l.logout(),h(!1),z(null)},[l]),E=f.useCallback(()=>{h(l.isAuthenticated())},[l]);return f.useEffect(()=>{if(typeof window>"u")return;const G=()=>{h(!1),z(null),j("登录已过期，请重新登录。")};return window.addEventListener(Dr,G),()=>{window.removeEventListener(Dr,G)}},[]),{isAuthenticated:u,isLoading:p,error:v,user:k,login:A,logout:H,refresh:E}}const md=f.createContext(null);function Kp({config:c,children:s}){const l=Up(c);return n.jsx(md.Provider,{value:l,children:s})}function ti(){const c=f.useContext(md);if(!c)throw new Error("useChatContext must be used within a ChatProvider");return c}function Vp({className:c="",showText:s=!0}){const{connectionStatus:l}=ti(),u=Hp(l);return n.jsxs("div",{className:`cheng-status-indicator ${c}`,"data-status":l,children:[n.jsxs("div",{className:`cheng-status-indicator__container ${u.containerClass}`,children:[n.jsx("div",{className:`cheng-status-indicator__dot ${u.dotClass}`}),s&&n.jsx("span",{className:"cheng-status-indicator__text",children:u.text})]}),n.jsx("style",{children:Gp})]})}function Hp(c){switch(c){case"connected":return{text:"已连接",dotClass:"cheng-status-indicator__dot--connected",containerClass:""};case"connecting":return{text:"连接中...",dotClass:"cheng-status-indicator__dot--connecting",containerClass:"cheng-status-indicator__container--pulse"};case"disconnected":return{text:"已断开",dotClass:"cheng-status-indicator__dot--disconnected",containerClass:""};case"error":return{text:"连接错误",dotClass:"cheng-status-indicator__dot--error",containerClass:""};default:return{text:"未知状态",dotClass:"",containerClass:""}}}const Gp=`
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
`;function Qp({content:c,className:s="",showCursor:l=!0}){const u=f.useRef(null);return f.useEffect(()=>{u.current&&(u.current.scrollTop=u.current.scrollHeight)},[c]),n.jsxs("div",{className:`cheng-streaming-text ${s}`,ref:u,children:[n.jsxs("div",{className:"cheng-streaming-text__content",children:[c,l&&n.jsx("span",{className:"cheng-streaming-text__cursor",children:"▊"})]}),n.jsx("style",{children:Xp})]})}const Xp=`
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
`;function qp({message:c,className:s="",onRetry:l,onApprovalDecision:u}){const h=c.role==="user",p=c.status==="streaming",m=c.status==="error",v=c.status==="sending",j=!!c.approval;return n.jsxs("div",{className:`cheng-message-bubble ${s}`,"data-role":c.role,"data-status":c.status,children:[n.jsxs("div",{className:`cheng-message-bubble__container ${h?"cheng-message-bubble__container--user":"cheng-message-bubble__container--assistant"}`,children:[n.jsxs("div",{className:`cheng-message-bubble__bubble ${h?"cheng-message-bubble__bubble--user":"cheng-message-bubble__bubble--assistant"} ${m?"cheng-message-bubble__bubble--error":""}`,children:[!j&&(p?n.jsx(ld,{content:c.content,role:c.role,isStreaming:!0}):n.jsx(ld,{content:c.content,role:c.role})),v&&n.jsx("div",{className:"cheng-message-bubble__sending",children:n.jsx("div",{className:"cheng-message-bubble__spinner"})}),m&&l&&n.jsx("button",{className:"cheng-message-bubble__retry",onClick:()=>l(c.id),type:"button",children:"重试"}),j&&c.approval&&n.jsx(Yp,{approval:c.approval,messageId:c.id,onDecision:u})]}),n.jsx("div",{className:"cheng-message-bubble__timestamp",children:Zp(c.createdAt)})]}),n.jsx("style",{children:eh})]})}function ld({content:c,role:s,isStreaming:l=!1}){if(s!=="assistant")return n.jsx("div",{className:"cheng-message-bubble__content",children:c});const{thinkBlocks:u,visibleContent:h,hasThinkTag:p,isThinkOpen:m}=Jp(c),v=h.trim().length>0;return n.jsxs("div",{className:"cheng-message-bubble__content-wrap",children:[p&&n.jsxs("details",{className:"cheng-message-bubble__think",children:[n.jsx("summary",{className:"cheng-message-bubble__think-summary",children:m?"查看思考中...":"查看思考过程"}),n.jsx("div",{className:"cheng-message-bubble__think-body",children:u.map((j,k)=>n.jsx("div",{className:"cheng-message-bubble__think-block",children:j||"思考中..."},k))})]}),v?l?n.jsx(Qp,{content:h}):n.jsx("div",{className:"cheng-message-bubble__content",children:h}):l&&p&&n.jsx("div",{className:"cheng-message-bubble__thinking-label",children:"正在思考..."})]})}function Yp({approval:c,messageId:s,onDecision:l}){const[u,h]=f.useState(!1),[p,m]=f.useState(""),v=c.status==="submitting",j=c.status==="approved"||c.status==="rejected",z={critical:"#b53333",high:"#b53333",medium:"#c96442",low:"#5e5d59"}[c.riskLevel.toLowerCase()]??"#5e5d59";let A=[];if(c.paramSummary)try{const H=typeof c.paramSummary=="string"?JSON.parse(c.paramSummary):c.paramSummary;A=Object.entries(H).map(([E,G])=>`${E}: ${G}`)}catch{A=[String(c.paramSummary)]}return n.jsxs("div",{className:"cheng-approval-card",children:[n.jsxs("div",{className:"cheng-approval-card__header",children:[n.jsxs("span",{className:"cheng-approval-card__risk",style:{color:z},children:["[",c.riskLevel.toUpperCase(),"]"]}),n.jsx("span",{className:"cheng-approval-card__action",children:c.actionName})]}),A.length>0&&n.jsx("div",{className:"cheng-approval-card__params",children:A.map((H,E)=>n.jsx("div",{className:"cheng-approval-card__param-line",children:H},E))}),j?n.jsxs("div",{className:"cheng-approval-card__settled",children:[n.jsx("span",{children:c.status==="approved"?"✓ 已批准":"✗ 已拒绝"}),c.reason&&n.jsxs("div",{className:"cheng-approval-card__settled-reason",children:["建议：",c.reason]})]}):n.jsxs(n.Fragment,{children:[u&&n.jsx("textarea",{className:"cheng-approval-card__suggestion",value:p,onChange:H=>m(H.target.value),placeholder:"请输入修改建议…",rows:2}),n.jsxs("div",{className:"cheng-approval-card__actions",children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--approve",disabled:v,onClick:()=>l?.(s,"approved"),type:"button",children:v?"提交中…":"批准"}),u?n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:v,onClick:()=>l?.(s,"rejected",p),type:"button",children:"确认拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--cancel",disabled:v,onClick:()=>{h(!1),m("")},type:"button",children:"取消"})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:v,onClick:()=>l?.(s,"rejected"),type:"button",children:"拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--suggest",disabled:v,onClick:()=>h(!0),type:"button",children:"拒绝并提建议"})]})]})]})]})}function Jp(c){const s=[],l=[],u="<think>",h="</think>";let p=0,m=!1;for(;p<c.length;){const v=c.indexOf(u,p);if(v===-1){l.push(c.slice(p));break}l.push(c.slice(p,v));const j=v+u.length,k=c.indexOf(h,j);if(k===-1){s.push(c.slice(j).trim()),m=!0;break}s.push(c.slice(j,k).trim()),p=k+h.length}return{thinkBlocks:s,visibleContent:l.join("").trim(),hasThinkTag:s.length>0||c.includes(u),isThinkOpen:m}}function Zp(c){const s=new Date,l=s.getTime()-c.getTime();return l<60*1e3?"刚刚":l<3600*1e3?`${Math.floor(l/6e4)} 分钟前`:c.toDateString()===s.toDateString()?c.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"}):c.toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}const eh=`
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
`;function th({className:c="",onRetry:s}){const{messages:l,submitApproval:u}=ti(),h=f.useRef(null),[p,m]=f.useState(!1),[v,j]=f.useState(!0),k=()=>{if(!h.current)return;const{scrollTop:A,scrollHeight:H,clientHeight:E}=h.current,G=H-A-E<100;m(!G),j(G)},z=(A=!1)=>{if(!h.current)return;const H=h.current.scrollHeight;typeof h.current.scrollTo=="function"?h.current.scrollTo({top:H,behavior:A?"smooth":"auto"}):h.current.scrollTop=H};return f.useEffect(()=>{v&&z()},[l,v]),f.useEffect(()=>{z()},[]),n.jsxs("div",{className:`cheng-message-list ${c}`,children:[n.jsx("div",{className:"cheng-message-list__container",ref:h,onScroll:k,children:l.length===0?n.jsxs("div",{className:"cheng-message-list__empty",children:[n.jsx("div",{className:"cheng-message-list__empty-icon",children:"💬"}),n.jsx("p",{className:"cheng-message-list__empty-text",children:"开始对话吧"})]}):n.jsx("div",{className:"cheng-message-list__messages",children:l.map(A=>n.jsx(qp,{message:A,onRetry:s,onApprovalDecision:u},A.id))})}),p&&n.jsxs("button",{className:"cheng-message-list__scroll-button",onClick:()=>{z(!0),j(!0)},type:"button","aria-label":"滚动到底部",children:[n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M5 7.5L10 12.5L15 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),n.jsx("span",{className:"cheng-message-list__scroll-button-text",children:"新消息"})]}),n.jsx("style",{children:nh})]})}const nh=`
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
`;function rh(c){return new Promise((s,l)=>{const u=new FileReader;u.onload=()=>{const h=u.result,p=h.indexOf(",");s(p>=0?h.slice(p+1):h)},u.onerror=l,u.readAsDataURL(c)})}async function oh(c){return Promise.all(c.map(async s=>{const l=await rh(s);return{filename:s.name,mime_type:s.type||void 0,base64_content:l,size:s.size}}))}function ih(c){return c<1024?`${c} B`:c<1024*1024?`${(c/1024).toFixed(1)} KB`:`${(c/1024/1024).toFixed(1)} MB`}const sh=["image/jpeg","image/png","image/gif","image/webp","image/bmp","image/svg+xml","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","text/plain","text/csv","text/markdown","audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/flac","video/mp4","video/quicktime","video/x-msvideo","video/x-matroska","video/webm"].join(",");function ah({className:c="",placeholder:s="输入消息...",disabled:l=!1,maxLength:u=2e3,autoFocus:h=!0,channels:p=[],activeChannelId:m=null,activeChannel:v=null,onSelectChannel:j}){const{sendMessage:k,resetConversation:z,isLoading:A,supportsAttachments:H}=ti(),[E,G]=f.useState(""),[C,K]=f.useState([]),[O,$]=f.useState(!1),J=f.useRef(null),V=f.useRef(null),B=f.useRef(null),X=l||A,oe=!X&&(E.trim().length>0||C.length>0),ie=R=>{const Q=R.trim().toLowerCase();return Q?p.find(D=>D.channelId.toLowerCase()===Q)??p.find(D=>D.id.toLowerCase()===Q)??p.find(D=>D.name.toLowerCase()===Q)??null:null};f.useEffect(()=>{if(!O)return;const R=Q=>{V.current&&(V.current.contains(Q.target)||$(!1))};return window.addEventListener("mousedown",R),()=>{window.removeEventListener("mousedown",R)}},[O]);const se=async R=>{R.preventDefault();const Q=E.trim();if(!(!Q&&C.length===0)&&!X)try{if(C.length===0&&Q.startsWith("~")){const P=Q.slice(1).trim();if(P.toLowerCase()==="new"){z(),G("");return}const M=ie(P);if(M&&j){j(M),z(),G("");return}}let D;C.length>0&&(D=await oh(C)),await k(Q||" ",D),G(""),K([]),J.current&&(J.current.style.height="auto")}catch(D){console.error("[InputBar] Failed to send message:",D)}},te=R=>{R.key==="Enter"&&!R.shiftKey&&(R.preventDefault(),se(R))},ae=R=>{const Q=R.target.value;G(Q),J.current&&(J.current.style.height="auto",J.current.style.height=`${Math.min(J.current.scrollHeight,120)}px`)},ce=()=>{!H||X||B.current?.click()},ne=R=>{const Q=Array.from(R.target.files??[]);Q.length!==0&&(K(D=>[...D,...Q]),R.target.value="")},xe=R=>{K(Q=>Q.filter((D,P)=>P!==R))};return n.jsxs("div",{className:`cheng-input-bar ${c}`,children:[n.jsx("form",{className:"cheng-input-bar__form",onSubmit:se,children:n.jsxs("div",{className:"cheng-input-bar__composer",children:[C.length>0&&n.jsx("div",{className:"cheng-input-bar__attachments",children:C.map((R,Q)=>n.jsxs("div",{className:"cheng-input-bar__attachment-chip",children:[n.jsx("span",{className:"cheng-input-bar__attachment-icon",children:lh(R.type)}),n.jsx("span",{className:"cheng-input-bar__attachment-name",title:R.name,children:R.name}),n.jsx("span",{className:"cheng-input-bar__attachment-size",children:ih(R.size)}),n.jsx("button",{type:"button",className:"cheng-input-bar__attachment-remove",onClick:()=>xe(Q),"aria-label":`移除 ${R.name}`,children:n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M2 2L10 10M10 2L2 10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]},Q))}),n.jsx("textarea",{ref:J,className:"cheng-input-bar__textarea",placeholder:s,value:E,onChange:ae,onKeyDown:te,disabled:X,maxLength:u,autoFocus:h,rows:1}),n.jsxs("div",{className:"cheng-input-bar__toolbar",children:[n.jsxs("div",{className:"cheng-input-bar__toolbar-left",children:[n.jsxs("div",{className:"cheng-input-bar__attachment-wrap",children:[n.jsx("button",{className:`cheng-input-bar__icon-button${H?"":" cheng-input-bar__icon-button--disabled"}`,type:"button","aria-label":"添加附件",title:H?"添加附件（PDF / 图片 / Word / Excel / 音视频等）":"当前工作流未配置附件上传节点",onClick:ce,disabled:!H||X,children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M15.5 8.5L8.5 15.5C6.843 17.157 4.157 17.157 2.5 15.5C0.843 13.843 0.843 11.157 2.5 9.5L9.5 2.5C10.657 1.343 12.343 1.343 13.5 2.5C14.657 3.657 14.657 5.343 13.5 6.5L6.5 13.5C5.948 14.052 5.052 14.052 4.5 13.5C3.948 12.948 3.948 12.052 4.5 11.5L11 5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})}),n.jsx("input",{ref:B,type:"file",multiple:!0,accept:sh,className:"cheng-input-bar__file-input",onChange:ne,tabIndex:-1,"aria-hidden":"true"})]}),p.length>0&&n.jsxs("div",{className:"cheng-input-bar__select-wrap",ref:V,children:[n.jsx("button",{className:"cheng-input-bar__select-button",type:"button","aria-haspopup":"listbox","aria-expanded":O,onClick:()=>$(R=>!R),children:n.jsx("span",{className:"cheng-input-bar__select-button-text",children:v?.name||p[0]?.name||"Select channel"})}),O&&n.jsx("div",{className:"cheng-input-bar__select-menu",role:"listbox","aria-label":"Channels",children:p.map(R=>{const Q=R.id===m;return n.jsxs("button",{type:"button",role:"option","aria-selected":Q,className:`cheng-input-bar__select-option${Q?" cheng-input-bar__select-option--active":""}`,onClick:()=>{j?.(R),$(!1)},children:[n.jsx("span",{className:"cheng-input-bar__select-option-name",children:R.name}),n.jsx("span",{className:"cheng-input-bar__select-option-id",children:R.channelId})]},R.id)})})]})]}),n.jsx("button",{className:"cheng-input-bar__button",type:"submit",disabled:!oe,"aria-label":"发送消息",children:A?n.jsx("div",{className:"cheng-input-bar__spinner"}):n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M10 3.5V16.5M10 3.5L5 8.5M10 3.5L15 8.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]})]})}),E.length>u*.8&&n.jsxs("div",{className:"cheng-input-bar__counter",children:[E.length," / ",u]}),n.jsx("style",{children:ch})]})}function lh(c){return c.startsWith("image/")?"🖼":c.startsWith("audio/")?"🎵":c.startsWith("video/")?"🎬":c==="application/pdf"?"📄":c.includes("word")||c.includes("wordprocessingml")?"📝":c.includes("excel")||c.includes("spreadsheetml")?"📊":c.includes("powerpoint")||c.includes("presentationml")?"📑":"📎"}const ch=`
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
`;function dh({className:c="",style:s={},title:l="对话",placeholder:u="输入消息...",showStatus:h=!0,height:p="600px",channels:m=[],activeChannelId:v=null,activeChannel:j=null,onSelectChannel:k}){const{resetConversation:z,error:A}=ti();return n.jsxs("div",{className:`cheng-chat-window ${c}`,style:{...s,height:typeof p=="number"?`${p}px`:p},children:[n.jsxs("div",{className:"cheng-chat-window__header",children:[n.jsxs("div",{className:"cheng-chat-window__header-left",children:[n.jsx("h2",{className:"cheng-chat-window__title",children:l}),h&&n.jsx(Vp,{})]}),n.jsx("div",{className:"cheng-chat-window__header-right",children:n.jsx("button",{className:"cheng-chat-window__reset-button",onClick:z,type:"button","aria-label":"新建对话",title:"新建对话",children:n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C8.34315 16 6.84315 15.3284 5.75736 14.2426",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),n.jsx("path",{d:"M7 10L4 10L4 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})})]}),A&&n.jsxs("div",{className:"cheng-chat-window__error",children:[n.jsx("span",{className:"cheng-chat-window__error-icon",children:"⚠️"}),n.jsx("span",{className:"cheng-chat-window__error-text",children:A.message})]}),n.jsx("div",{className:"cheng-chat-window__body",children:n.jsx(th,{})}),n.jsx("div",{className:"cheng-chat-window__footer",children:n.jsx(ah,{placeholder:u,channels:m,activeChannelId:v,activeChannel:j,onSelectChannel:k})}),n.jsx("style",{children:uh})]})}const uh=`
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
`,ph=/^[a-z0-9-]+$/,Zs=["🤖","🧠","🛠️","📊","💬","🚀","🧭","✨"];function hh(c){if(!c)return"";const{avatarIcon:s,...l}=c;return Object.keys(l).length>0?JSON.stringify(l,null,2):""}function fh({onSubmit:c,apiBaseUrl:s,onSuccess:l,isActive:u=!0,defaultAppType:h="",initialChannel:p=null,existingChannels:m=[],mode:v="create",showCancelButton:j=!1,onCancel:k,submitLabel:z="Create"}){const A=v==="edit",[H,E]=f.useState(""),[G,C]=f.useState(""),[K,O]=f.useState(""),[$,J]=f.useState(""),[V,B]=f.useState(""),[X,oe]=f.useState(h),[ie,se]=f.useState(Zs[0]),[te,ae]=f.useState(""),[ce,ne]=f.useState(!1),[xe,R]=f.useState(!1),[Q,D]=f.useState(!1),[P,M]=f.useState([]),[F,g]=f.useState([]),[N,y]=f.useState(null),[W,L]=f.useState(null),[U,_]=f.useState(null),Z=f.useCallback(()=>{const fe=p?.connectionConfig?.avatarIcon;E(p?.name??""),C(p?.channelId??""),O(p?.workspaceId??""),J(p?.boundWorkflowId??""),B(p?.description??""),oe(p?.appType??h),se(typeof fe=="string"&&fe.trim()?fe:Zs[0]),ae(hh(p?.connectionConfig)),M([]),g([]),y(null),L(null),R(!1),D(!1),_(null),ne(!1)},[h,p]);f.useEffect(()=>{Z()},[Z]);const pe=f.useCallback(async()=>{if(!s){M([]),y("Missing apiBaseUrl, cannot load workspaces");return}R(!0),y(null);try{const fe=new Ve(s),Ie=await new tt(s,fe).listWorkspaces();M(Ie),O(Se=>!Se&&Ie.length>0?Ie[0].id:Se)}catch(fe){M([]),y(fe instanceof Error?fe.message:"Failed to load workspaces")}finally{R(!1)}},[s]);f.useEffect(()=>{u&&pe()},[u,pe]);const _e=f.useCallback(async()=>{if(!s){g([]),L("Missing apiBaseUrl, cannot load workflows");return}D(!0),L(null);try{const fe=new Ve(s),Ie=await new tt(s,fe).listPublishedWorkflows();g(Ie),J(Se=>!Se&&Ie.length>0?Ie[0].id:Se)}catch(fe){g([]),L(fe instanceof Error?fe.message:"Failed to load published workflows")}finally{D(!1)}},[s]);f.useEffect(()=>{u&&_e()},[u,_e]);const me=f.useCallback(fe=>{const ke=fe.target.value;E(ke),C(Ie=>{const Se=H.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return Ie===Se||Ie===""?ke.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):Ie})},[H]),De=f.useCallback(async fe=>{if(fe.preventDefault(),_(null),!H.trim()){_("Name is required");return}if(!G.trim()){_("Channel ID is required");return}if(!K.trim()){_("Workspace ID is required");return}if(!$.trim()){_("Bound Workflow ID is required");return}if(!ph.test(G)){_("Channel ID must only contain lowercase letters, numbers, and hyphens");return}const ke=G.trim().toLowerCase();if(m.find(Se=>A&&p&&Se.id===p.id?!1:Se.workspaceId===K.trim()&&Se.channelId.trim().toLowerCase()===ke)){_(`Agent ID "${G.trim()}" already exists in this workspace`);return}ne(!0);try{const bt={...te.trim()?JSON.parse(te):{},avatarIcon:ie},ln={name:H.trim(),channelId:G.trim(),workspaceId:K.trim(),boundWorkflowId:$.trim(),description:V.trim()||void 0,appType:X.trim()||void 0,connectionConfig:bt};A&&p?await c({id:p.id,...ln}):await c(ln),Z(),l?.()}catch(Se){_(Se instanceof SyntaxError?"Connection config must be valid JSON":Se instanceof Error?Se.message:A?"Failed to update agent":"Failed to create agent"),ne(!1)}},[H,G,K,$,V,X,ie,te,p,m,A,c,Z,l]);return n.jsxs("form",{className:"cheng-channel-form",onSubmit:De,children:[U&&n.jsx("div",{className:"cheng-channel-form__error",children:U}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-name",children:"Name *"}),n.jsx("input",{id:"cf-name",className:"cheng-channel-form__input",type:"text",value:H,onChange:me,placeholder:"My Agent",autoFocus:!0,disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-channel-id",children:["Agent ID *",n.jsxs("span",{className:"cheng-channel-form__label-hint",children:[" ","(lowercase letters, numbers, hyphens)"]})]}),n.jsx("input",{id:"cf-channel-id",className:"cheng-channel-form__input",type:"text",value:G,onChange:fe=>C(fe.target.value),placeholder:"my-agent",disabled:ce||A})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workspace-id",children:"Workspace *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{pe()},disabled:ce||xe||A,children:xe?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workspace-id",className:"cheng-channel-form__input",value:K,onChange:fe=>O(fe.target.value),disabled:ce||xe||A,children:[n.jsx("option",{value:"",children:xe?"Loading workspaces...":"Select workspace"}),P.map(fe=>n.jsx("option",{value:fe.id,children:fe.name||fe.id},fe.id))]}),N&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:N})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workflow-id",children:"Published Workflow *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{_e()},disabled:ce||Q,children:Q?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workflow-id",className:"cheng-channel-form__input",value:$,onChange:fe=>J(fe.target.value),disabled:ce||Q,children:[n.jsx("option",{value:"",children:Q?"Loading published workflows...":"Select published workflow"}),F.map(fe=>n.jsx("option",{value:fe.id,children:fe.name||fe.id},fe.id)),$&&!F.some(fe=>fe.id===$)&&n.jsx("option",{value:$,children:$})]}),W&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:W})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-app-type",children:"App Type"}),n.jsx("input",{id:"cf-app-type",className:"cheng-channel-form__input",type:"text",value:X,onChange:fe=>oe(fe.target.value),placeholder:"whatsapp / telegram / slack",disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",children:"Agent Avatar"}),n.jsx("div",{className:"cheng-channel-form__avatar-grid",role:"radiogroup","aria-label":"Agent avatar",children:Zs.map(fe=>{const ke=ie===fe;return n.jsx("button",{type:"button",className:`cheng-channel-form__avatar-option${ke?" cheng-channel-form__avatar-option--selected":""}`,onClick:()=>se(fe),"aria-pressed":ke,disabled:ce,children:n.jsx("span",{className:"cheng-channel-form__avatar-emoji","aria-hidden":"true",children:fe})},fe)})}),n.jsx("div",{className:"cheng-channel-form__field-hint",children:"The selected avatar will be saved with this agent and shown on the agent cards."})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-desc",children:"Description"}),n.jsx("input",{id:"cf-desc",className:"cheng-channel-form__input",type:"text",value:V,onChange:fe=>B(fe.target.value),placeholder:"Optional description",disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-conn-cfg",children:"Connection Config"}),n.jsx("textarea",{id:"cf-conn-cfg",className:"cheng-channel-form__input cheng-channel-form__textarea",value:te,onChange:fe=>ae(fe.target.value),placeholder:'{"botToken":"..."}',rows:4,disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__footer",children:[j&&k&&n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--secondary",type:"button",onClick:k,disabled:ce,children:"Cancel"}),n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--primary",type:"submit",disabled:ce,children:ce?A?"Saving...":"Creating...":z})]}),n.jsx("style",{children:gh})]})}const gh=`
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
`;function mh({isOpen:c,onClose:s,mode:l="create",initialChannel:u=null,existingChannels:h=[],onCreate:p,onUpdate:m,apiBaseUrl:v}){const[j,k]=f.useState(0),z=l==="edit";return f.useEffect(()=>{c&&k(A=>A+1)},[c]),c?n.jsx("div",{className:"cheng-modal-overlay",onClick:s,children:n.jsxs("div",{className:"cheng-modal",onClick:A=>A.stopPropagation(),children:[n.jsxs("div",{className:"cheng-modal__header",children:[n.jsxs("div",{className:"cheng-modal__header-copy",children:[n.jsx("h3",{className:"cheng-modal__title",children:z?"Edit Agent":"Create Agent"}),n.jsx("p",{className:"cheng-modal__subtitle",children:z?"Update this agent's profile, workflow binding, avatar, and runtime settings.":"Set up a new agent, connect it to a workspace, and bind the workflow it should run."})]}),n.jsx("button",{className:"cheng-modal__close",onClick:s,type:"button","aria-label":"Close",children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M4 4l10 10M14 4L4 14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsx("div",{className:"cheng-modal__body",children:n.jsx(fh,{onSubmit:async A=>{if(z){if(!m)throw new Error("Update handler is not configured");await m(A);return}await p(A)},apiBaseUrl:v,onSuccess:s,isActive:c,initialChannel:u,existingChannels:h,mode:l,showCancelButton:!0,onCancel:s,submitLabel:z?"Save Changes":"Create Agent"},j)}),n.jsx("style",{children:xh})]})}):null}const xh=`
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
`;function _h(c){const s=new Date(c);return Number.isNaN(s.getTime())?"创建时间未知":`创建于 ${s.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}`}function wh({sessions:c,activeSessionId:s,onSelect:l,onCreateClick:u,onDeleteSession:h,onRenameSession:p,onTogglePinSession:m}){const[v,j]=f.useState(null),[k,z]=f.useState(null),[A,H]=f.useState(""),E=f.useRef(null),G=f.useRef(null);f.useEffect(()=>{const O=$=>{E.current&&(E.current.contains($.target)||(j(null),z(null)))};return document.addEventListener("mousedown",O),()=>document.removeEventListener("mousedown",O)},[]),f.useEffect(()=>{k&&(G.current?.focus(),G.current?.select())},[k]);const C=O=>{if(!p)return;const $=A.trim();!$||$===O.label||(p(O.id,$),j(null),z(null),H(""))},K=c.length>1&&!!h;return n.jsxs("div",{className:"cheng-session-list",ref:E,children:[n.jsxs("div",{className:"cheng-session-list__header",children:[n.jsx("span",{className:"cheng-session-list__title",children:"Conversations"}),n.jsx("button",{className:"cheng-session-list__add-btn",onClick:u,type:"button","aria-label":"Create conversation",title:"Create conversation",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsxs("ul",{className:"cheng-session-list__items",children:[c.map(O=>n.jsxs("li",{className:`cheng-session-list__item${O.id===s?" cheng-session-list__item--active":""}`,children:[n.jsxs("button",{className:"cheng-session-list__item-main",onClick:()=>l(O),type:"button",title:O.label,children:[n.jsx("span",{className:"cheng-session-list__item-icon",title:_h(O.createdAt),children:n.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M7 1C3.68629 1 1 3.68629 1 7C1 8.20693 1.35785 9.33012 1.97285 10.2718L1 13L3.72822 12.0272C4.66988 12.6421 5.79307 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})})}),n.jsx("span",{className:"cheng-session-list__item-meta",children:n.jsx("span",{className:"cheng-session-list__item-label",children:O.label})})]}),n.jsxs("div",{className:"cheng-session-list__item-actions",children:[n.jsx("button",{className:"cheng-session-list__item-menu-trigger",type:"button","aria-label":`更多操作 ${O.label}`,title:"更多操作",onClick:$=>{$.stopPropagation(),j(J=>J===O.id?null:O.id)},children:n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"7",cy:"2.5",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"7",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"11.5",r:"1.2",fill:"currentColor"})]})}),v===O.id&&n.jsx("div",{className:"cheng-session-list__menu",role:"menu",children:k===O.id?n.jsxs("div",{className:"cheng-session-list__rename-wrap",children:[n.jsx("input",{ref:G,className:"cheng-session-list__rename-input",value:A,onChange:$=>H($.target.value),onKeyDown:$=>{$.key==="Enter"&&($.preventDefault(),C(O)),$.key==="Escape"&&($.preventDefault(),z(null))},maxLength:80}),n.jsxs("div",{className:"cheng-session-list__rename-actions",children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:$=>{$.stopPropagation(),C(O)},children:"保存"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:$=>{$.stopPropagation(),z(null)},children:"取消"})]})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:$=>{$.stopPropagation(),m?.(O.id),j(null)},role:"menuitem",children:O.pinned?"取消置顶":"置顶"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:$=>{$.stopPropagation(),z(O.id),H(O.label)},role:"menuitem",children:"重命名"}),n.jsx("button",{className:"cheng-session-list__menu-item cheng-session-list__menu-item--danger",type:"button",disabled:!K,onClick:$=>{$.stopPropagation(),h&&(h(O.id),j(null))},role:"menuitem",children:"删除"})]})})]})]},O.id)),c.length===0&&n.jsx("li",{className:"cheng-session-list__empty",children:"No conversations yet"})]}),n.jsx("style",{children:bh})]})}const bh=`
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
`;function yh(c){return c.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"telegram-bot"}function kh(c){const s=c.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function vh({agents:c,onCreate:s,apiBaseUrl:l,onPaired:u,onRefresh:h,onGoToAgents:p,onCancel:m}){const[v,j]=f.useState("ready"),[k,z]=f.useState(""),[A,H]=f.useState(()=>c[0]?.id??""),[E,G]=f.useState(""),[C,K]=f.useState(null),[O,$]=f.useState(null),[J,V]=f.useState(null),[B,X]=f.useState(null),[oe,ie]=f.useState(!1),se=f.useRef(null),te=f.useCallback(()=>(se.current||(se.current=new tt(l,new Ve(l))),se.current),[l]),ae=c.find(R=>R.id===A)??null,ce=f.useCallback(async R=>{if(R.preventDefault(),!(!k.trim()||!E.trim()||!ae)){K(null),j("connecting");try{const Q=yh(k),D=await s({name:k.trim(),channelId:Q,workspaceId:ae.workspaceId,boundWorkflowId:ae.boundWorkflowId,appType:"telegram",description:`Telegram bot for agent: ${ae.name}`});D.channelId!==Q&&ie(!0);const P=await te().connectChannel(D.workspaceId,D.id,{bot_token:E.trim(),connection_mode:"polling"}),M=P.setupData,F=M?.username??M?.bot_username??M?.first_name;F&&X(`@${F}`),V(M?.connection_mode??"polling");const g={...D,connectionState:P.connectionState,webhookUrl:P.webhookUrl,setupData:P.setupData};$(g),j("connected"),h?.(),u(g)}catch(Q){K(Q instanceof Error?Q.message:"Connection failed. Please check your bot token and try again."),j("error")}}},[k,E,ae,s,te,u]);if(c.length===0)return n.jsxs("div",{className:"cheng-tg-form__no-agents",children:[n.jsx("div",{className:"cheng-tg-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-tg-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-tg-form__no-agents-desc",children:"Create an agent first, then come back to connect a Telegram bot to it. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:ea})]});if(v==="connected"&&O)return n.jsxs("div",{className:"cheng-tg-form__success",children:[n.jsx("div",{className:"cheng-tg-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-form__success-title",children:oe?"Telegram Reconnected!":"Telegram Connected!"}),n.jsxs("p",{className:"cheng-tg-form__success-desc",children:[oe&&n.jsxs("span",{className:"cheng-tg-form__existing-note",children:["An existing integration was found and reconnected."," "]}),n.jsx("strong",{children:O.name})," is now active",B&&n.jsxs(n.Fragment,{children:[" as ",n.jsx("strong",{children:B})]}),ae&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:ae.name})]}),"."]}),J==="polling"?n.jsxs("div",{className:"cheng-tg-form__polling-notice",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),"The bot is listening for messages via polling — no public URL required."]}):null,n.jsx("p",{className:"cheng-tg-form__success-hint",children:"Your integration is listed in Connected Integrations above. Use Manage to view connection details."}),n.jsx("style",{children:ea})]});const ne=v==="connecting",xe=k.trim().length>0&&E.trim().length>0&&!!ae&&!ne;return n.jsxs("form",{className:"cheng-tg-form",onSubmit:ce,children:[n.jsxs("div",{className:"cheng-tg-form__instructions",children:[n.jsx("p",{className:"cheng-tg-form__instructions-title",children:"How to get your bot token"}),n.jsxs("ol",{className:"cheng-tg-form__steps",children:[n.jsxs("li",{children:["Open Telegram and search for ",n.jsx("strong",{children:"@BotFather"})]}),n.jsxs("li",{children:["Send ",n.jsx("code",{children:"/newbot"})," and follow the prompts to create your bot"]}),n.jsx("li",{children:"Copy the API token BotFather provides and paste it below"})]})]}),C&&n.jsxs("div",{className:"cheng-tg-form__error-banner",children:[n.jsx("span",{children:C}),n.jsx("button",{type:"button",className:"cheng-tg-form__retry-btn",onClick:()=>{j("ready"),K(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-name",children:["Integration Name ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("input",{id:"tg-name",className:"cheng-tg-form__input",type:"text",value:k,onChange:R=>z(R.target.value),placeholder:"Support Bot",disabled:ne,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-tg-form__hint",children:"A display name for this Telegram integration"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-agent",children:["Agent ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-tg-form__agent-select-wrap",children:n.jsx("select",{id:"tg-agent",className:"cheng-tg-form__input cheng-tg-form__input--select",value:A,onChange:R=>H(R.target.value),disabled:ne,required:!0,children:c.map(R=>n.jsxs("option",{value:R.id,children:[kh(R)," ",R.name]},R.id))})}),ae&&n.jsxs("span",{className:"cheng-tg-form__hint",children:["Messages from this bot will be handled by ",n.jsx("strong",{children:ae.name}),ae.description?` — ${ae.description}`:""]})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-token",children:["Bot Token ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"}),n.jsx("span",{className:"cheng-tg-form__label-hint",children:" (from @BotFather)"})]}),n.jsx("input",{id:"tg-token",className:"cheng-tg-form__input cheng-tg-form__input--token",type:"password",value:E,onChange:R=>G(R.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:ne,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-form__hint",children:"Keep this token secret — it grants full control over your bot"})]}),n.jsxs("div",{className:"cheng-tg-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--ghost",onClick:m,disabled:ne,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-form__btn cheng-tg-form__btn--connect",disabled:!xe,children:ne?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-form__btn-spinner"}),"Connecting..."]}):"Connect Telegram"})]}),n.jsx("style",{children:ea})]})}const ea=`
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
`;function jh({channel:c,agents:s,apiBaseUrl:l,onUpdate:u,onRefresh:h,onSaved:p,onCancel:m}){const v=s.find(ne=>ne.boundWorkflowId===c.boundWorkflowId&&ne.workspaceId===c.workspaceId)?.id??s[0]?.id??"",[j,k]=f.useState(v),[z,A]=f.useState(""),[H,E]=f.useState("ready"),[G,C]=f.useState(!1),[K,O]=f.useState(null),[$,J]=f.useState(null),V=f.useRef(null),B=f.useCallback(()=>(V.current||(V.current=new tt(l,new Ve(l))),V.current),[l]),X=s.find(ne=>ne.id===j)??null,oe=X&&(X.workspaceId!==c.workspaceId||X.boundWorkflowId!==c.boundWorkflowId),ie=s.find(ne=>ne.boundWorkflowId===c.boundWorkflowId&&ne.workspaceId===c.workspaceId)??null,se=f.useCallback(async ne=>{if(!(!z.trim()||!X)){J(null),O(null),ne?E("saving"):C(!0);try{oe&&await u({id:c.id,channelId:c.channelId,name:c.name,workspaceId:X.workspaceId,boundWorkflowId:X.boundWorkflowId,appType:c.appType,description:c.description});const xe=oe?X.workspaceId:c.workspaceId;await B().connectChannel(xe,c.id,{bot_token:z.trim(),connection_mode:"polling"}),h?.(),ne?(E("saved"),setTimeout(()=>p(),1200)):(E("ready"),O("Bot connected — backend is polling for Telegram messages."))}catch(xe){J(xe instanceof Error?xe.message:"Update failed. Please try again."),E("error"),O(null)}finally{ne||C(!1)}}},[z,X,oe,c,u,B,h,p]),te=f.useCallback(async ne=>{ne.preventDefault(),await se(!0)},[se]),ae=H==="saving",ce=!!X&&z.trim().length>0&&!ae&&!G;return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):H==="saved"?n.jsxs("div",{className:"cheng-tg-edit__success",children:[n.jsx("div",{className:"cheng-tg-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-tg-edit__success-desc",children:[n.jsx("strong",{children:c.name})," has been reconfigured and reconnected."]}),n.jsx("style",{children:cd})]}):n.jsxs("form",{className:"cheng-tg-edit",onSubmit:te,children:[$&&n.jsxs("div",{className:"cheng-tg-edit__error-banner",children:[n.jsx("span",{children:$}),n.jsx("button",{type:"button",className:"cheng-tg-edit__retry-btn",onClick:()=>{E("ready"),J(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-edit__grid",children:[n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Choose which agent should handle messages from this Telegram bot."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("select",{className:"cheng-tg-edit__input cheng-tg-edit__input--select",value:j,onChange:ne=>k(ne.target.value),disabled:ae,required:!0,children:s.map(ne=>n.jsx("option",{value:ne.id,children:ne.name},ne.id))}),X&&n.jsxs("span",{className:"cheng-tg-edit__hint",children:["Selected: ",n.jsx("strong",{children:X.name}),X.description?` — ${X.description}`:""]}),oe&&X&&n.jsxs("div",{className:"cheng-tg-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:ie?.name??"the current agent"})," to"," ",n.jsx("strong",{children:X.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Bot Token"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Paste a fresh token to reconnect this bot or rotate credentials."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("input",{className:"cheng-tg-edit__input cheng-tg-edit__input--token",type:"password",value:z,onChange:ne=>A(ne.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:ae,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-edit__hint",children:"Your existing token will be replaced. Get a new one from @BotFather if needed."}),K&&n.jsx("div",{className:"cheng-tg-edit__test-ok",children:K}),n.jsx("div",{className:"cheng-tg-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--secondary",disabled:!X||z.trim().length===0||ae||G,onClick:()=>{se(!1)},children:G?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner cheng-tg-edit__spinner--dark"}),"测试中..."]}):"测试连接"})})]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--ghost",onClick:m,disabled:ae,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-edit__btn cheng-tg-edit__btn--connect",disabled:!ce,children:ae?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner"}),"Saving..."]}):"Save & Reconnect"})]}),n.jsx("style",{children:cd})]})}const cd=`
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
`;function Sh(c){return c.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"whatsapp-bot"}function Ch(c){const s=c.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Nh({agents:c,onCreate:s,apiBaseUrl:l,onPaired:u,onRefresh:h,onGoToAgents:p,onCancel:m}){const[v,j]=f.useState("ready"),[k,z]=f.useState(""),[A,H]=f.useState(()=>c[0]?.id??""),[E,G]=f.useState(""),[C,K]=f.useState(""),[O,$]=f.useState(""),[J,V]=f.useState(""),[B,X]=f.useState("v21.0"),[oe,ie]=f.useState(null),[se,te]=f.useState(null),[ae,ce]=f.useState(null),[ne,xe]=f.useState(null),R=f.useRef(null),Q=f.useCallback(()=>(R.current||(R.current=new tt(l,new Ve(l))),R.current),[l]),D=c.find(g=>g.id===A)??null,P=f.useCallback(async g=>{if(g.preventDefault(),!(!k.trim()||!E.trim()||!C.trim()||!O.trim()||!J.trim()||!D)){ie(null),j("connecting");try{const N=Sh(k),y=await s({name:k.trim(),channelId:N,workspaceId:D.workspaceId,boundWorkflowId:D.boundWorkflowId,appType:"whatsapp",description:`WhatsApp integration for agent: ${D.name}`}),W=await Q().connectChannel(y.workspaceId,y.id,{phone_number_id:E.trim(),access_token:C.trim(),signing_secret:O.trim(),webhook_verify_token:J.trim(),api_version:B.trim()||"v21.0"}),L=W.setupData,U=W.webhookUrl??L?.webhook_url??null,_=L?.webhook_verify_token??J.trim();ce(U),xe(_);const Z={...y,connectionState:W.connectionState,webhookUrl:W.webhookUrl,setupData:W.setupData};te(Z),j("connected"),h?.(),u(Z)}catch(N){ie(N instanceof Error?N.message:"Connection failed. Please check your configuration and try again."),j("error")}}},[k,E,C,O,J,B,D,s,Q,u,h]);if(c.length===0)return n.jsxs("div",{className:"cheng-wa-form__no-agents",children:[n.jsx("div",{className:"cheng-wa-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wa-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wa-form__no-agents-desc",children:"Create an agent first, then come back to connect a WhatsApp integration. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:ta})]});if(v==="connected"&&se)return n.jsxs("div",{className:"cheng-wa-form__success",children:[n.jsx("div",{className:"cheng-wa-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-form__success-title",children:"WhatsApp Connected!"}),n.jsxs("p",{className:"cheng-wa-form__success-desc",children:[n.jsx("strong",{children:se.name})," has been created and verified",D&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:D.name})]}),"."]}),(ae||ne)&&n.jsxs("div",{className:"cheng-wa-form__webhook-box",children:[n.jsx("p",{className:"cheng-wa-form__webhook-box-title",children:"Configure Meta Console Webhook"}),ae&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Webhook URL"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:ae})]}),ne&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Verify Token"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:ne})]}),n.jsxs("ol",{className:"cheng-wa-form__meta-steps",children:[n.jsxs("li",{children:["Go to"," ",n.jsx("strong",{children:"Meta for Developers"})," → your WhatsApp app →"," ",n.jsx("strong",{children:"WhatsApp > Configuration"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Webhook"}),", click ",n.jsx("strong",{children:"Edit"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Webhook URL"})," and"," ",n.jsx("strong",{children:"Verify Token"})," shown above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Verify and Save"})]}),n.jsxs("li",{children:["Subscribe to ",n.jsx("strong",{children:"messages"})," webhook field"]})]})]}),n.jsx("p",{className:"cheng-wa-form__success-hint",children:"After configuring the webhook in Meta Console, send a test WhatsApp message to verify the full integration is working."}),m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:ta})]});const M=v==="connecting",F=k.trim().length>0&&E.trim().length>0&&C.trim().length>0&&O.trim().length>0&&J.trim().length>0&&!!D&&!M;return n.jsxs("form",{className:"cheng-wa-form",onSubmit:P,children:[n.jsxs("div",{className:"cheng-wa-form__instructions",children:[n.jsx("p",{className:"cheng-wa-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wa-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"Meta Business Account"})," with a verified phone number in WhatsApp Business Platform"]}),n.jsxs("li",{children:["Create a WhatsApp app in"," ",n.jsx("strong",{children:"Meta for Developers"})," and note the"," ",n.jsx("strong",{children:"Phone Number ID"})," and ",n.jsx("strong",{children:"Access Token"})]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Webhook URL"})," ","to paste into Meta Console"]})]})]}),oe&&n.jsxs("div",{className:"cheng-wa-form__error-banner",children:[n.jsx("span",{children:oe}),n.jsx("button",{type:"button",className:"cheng-wa-form__retry-btn",onClick:()=>{j("ready"),ie(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-name",className:"cheng-wa-form__input",type:"text",value:k,onChange:g=>z(g.target.value),placeholder:"Customer Support WA",disabled:M,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A display name for this WhatsApp integration"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-agent",children:["Agent ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wa-form__agent-select-wrap",children:n.jsx("select",{id:"wa-agent",className:"cheng-wa-form__input cheng-wa-form__input--select",value:A,onChange:g=>H(g.target.value),disabled:M,required:!0,children:c.map(g=>n.jsxs("option",{value:g.id,children:[Ch(g)," ",g.name]},g.id))})}),D&&n.jsxs("span",{className:"cheng-wa-form__hint",children:["Messages from WhatsApp will be handled by"," ",n.jsx("strong",{children:D.name}),D.description?` — ${D.description}`:""]})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-phone-id",children:["Phone Number ID ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-phone-id",className:"cheng-wa-form__input",type:"text",value:E,onChange:g=>G(g.target.value),placeholder:"123456789012345",disabled:M,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta for Developers → WhatsApp → API Setup"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-access-token",children:["Access Token ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-access-token",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:C,onChange:g=>K(g.target.value),placeholder:"EAAxxxxxxxx...",disabled:M,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Permanent or temporary access token from Meta app dashboard"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-signing-secret",children:["App Secret"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"}),n.jsx("span",{className:"cheng-wa-form__label-hint",children:" (signing secret)"})]}),n.jsx("input",{id:"wa-signing-secret",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:O,onChange:g=>$(g.target.value),placeholder:"Your app secret",disabled:M,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta app → Settings → Basic → App Secret. Used to verify incoming webhook signatures."})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-verify-token",children:["Webhook Verify Token"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-verify-token",className:"cheng-wa-form__input",type:"text",value:J,onChange:g=>V(g.target.value),placeholder:"my-secret-verify-token",disabled:M,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A string you choose — you'll enter this same value when configuring the webhook in Meta Console"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsx("label",{className:"cheng-wa-form__label",htmlFor:"wa-api-version",children:"API Version"}),n.jsx("input",{id:"wa-api-version",className:"cheng-wa-form__input",type:"text",value:B,onChange:g=>X(g.target.value),placeholder:"v21.0",disabled:M,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"WhatsApp Cloud API version — default is v21.0"})]}),n.jsxs("div",{className:"cheng-wa-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--ghost",onClick:m,disabled:M,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",disabled:!F,children:M?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-form__btn-spinner"}),"Connecting..."]}):"Connect WhatsApp"})]}),n.jsx("style",{children:ta})]})}const ta=`
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
`;function Ih({channel:c,agents:s,apiBaseUrl:l,onUpdate:u,onRefresh:h,onSaved:p,onCancel:m}){const v=c.connectionConfig??{},j=s.find(L=>L.boundWorkflowId===c.boundWorkflowId&&L.workspaceId===c.workspaceId)?.id??s[0]?.id??"",[k,z]=f.useState(j),[A,H]=f.useState(typeof v.phone_number_id=="string"?v.phone_number_id:""),[E,G]=f.useState(typeof v.api_version=="string"?v.api_version:"v21.0"),[C,K]=f.useState(""),[O,$]=f.useState(""),[J,V]=f.useState(""),[B,X]=f.useState("ready"),[oe,ie]=f.useState(!1),[se,te]=f.useState(null),[ae,ce]=f.useState(null),[ne,xe]=f.useState(c.webhookUrl??null),R=f.useRef(null),Q=f.useCallback(()=>(R.current||(R.current=new tt(l,new Ve(l))),R.current),[l]),D=s.find(L=>L.id===k)??null,P=s.find(L=>L.boundWorkflowId===c.boundWorkflowId&&L.workspaceId===c.workspaceId)??null,M=D&&(D.workspaceId!==c.workspaceId||D.boundWorkflowId!==c.boundWorkflowId),F=C.trim().length>0&&O.trim().length>0&&J.trim().length>0&&A.trim().length>0,g=f.useCallback(async L=>{if(D){ce(null),te(null),L?X("saving"):ie(!0);try{if(M&&await u({id:c.id,channelId:c.channelId,name:c.name,workspaceId:D.workspaceId,boundWorkflowId:D.boundWorkflowId,appType:c.appType,description:c.description}),F){const U=M?D.workspaceId:c.workspaceId,_=await Q().connectChannel(U,c.id,{phone_number_id:A.trim(),access_token:C.trim(),signing_secret:O.trim(),webhook_verify_token:J.trim(),api_version:E.trim()||"v21.0"}),Z=_.setupData,pe=_.webhookUrl??Z?.webhook_url??null;pe&&xe(pe)}h?.(),L?(X("saved"),setTimeout(()=>p(),1200)):(X("ready"),te(F?"Connection verified — credentials accepted.":"Agent binding updated."))}catch(U){ce(U instanceof Error?U.message:"Update failed. Please try again."),X("error"),te(null)}finally{L||ie(!1)}}},[D,M,F,c,u,Q,A,C,O,J,E,h,p]),N=f.useCallback(async L=>{L.preventDefault(),await g(!0)},[g]),y=B==="saving",W=!!D&&(!!M||F)&&!y&&!oe;return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):B==="saved"?n.jsxs("div",{className:"cheng-wa-edit__success",children:[n.jsx("div",{className:"cheng-wa-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wa-edit__success-desc",children:[n.jsx("strong",{children:c.name})," has been"," ",F?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:dd})]}):n.jsxs("form",{className:"cheng-wa-edit",onSubmit:N,children:[ae&&n.jsxs("div",{className:"cheng-wa-edit__error-banner",children:[n.jsx("span",{children:ae}),n.jsx("button",{type:"button",className:"cheng-wa-edit__retry-btn",onClick:()=>{X("ready"),ce(null)},children:"Retry"})]}),ne&&n.jsxs("div",{className:"cheng-wa-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wa-edit__webhook-label",children:"Current Webhook URL"}),n.jsx("code",{className:"cheng-wa-edit__webhook-value",children:ne})]}),n.jsxs("div",{className:"cheng-wa-edit__grid",children:[n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("select",{className:"cheng-wa-edit__input cheng-wa-edit__input--select",value:k,onChange:L=>z(L.target.value),disabled:y,required:!0,children:s.map(L=>n.jsx("option",{value:L.id,children:L.name},L.id))}),M&&D&&n.jsxs("div",{className:"cheng-wa-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:P?.name??"current agent"})," to"," ",n.jsx("strong",{children:D.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Phone Number ID"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Pre-filled from your current configuration. Only change if the number changed."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:A,onChange:L=>H(L.target.value),placeholder:"123456789012345",disabled:y,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Access Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Fill in only to rotate credentials."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:C,onChange:L=>K(L.target.value),placeholder:"EAAxxxxxxxx... (leave blank to keep current)",disabled:y,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"App Secret"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing secret. Required when rotating Access Token."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:O,onChange:L=>$(L.target.value),placeholder:"(leave blank to keep current)",disabled:y,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Webhook Verify Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:J,onChange:L=>V(L.target.value),placeholder:"(leave blank to keep current)",disabled:y,autoComplete:"off"}),se&&n.jsx("div",{className:"cheng-wa-edit__test-ok",children:se}),n.jsx("div",{className:"cheng-wa-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--secondary",disabled:!F||!D||y||oe,onClick:()=>{g(!1)},children:oe?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner cheng-wa-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"API Version"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"WhatsApp Cloud API version — pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:E,onChange:L=>G(L.target.value),placeholder:"v21.0",disabled:y,autoComplete:"off"})})]})]}),!F&&n.jsxs("div",{className:"cheng-wa-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Access Token + App Secret + Verify Token to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wa-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--ghost",onClick:m,disabled:y,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-edit__btn cheng-wa-edit__btn--connect",disabled:!W,children:y?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner"}),"Saving..."]}):F?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:dd})]})}const dd=`
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
`;function Eh(c){return c.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"slack-app"}function Ah(c){const s=c.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Th({agents:c,onCreate:s,apiBaseUrl:l,onPaired:u,onRefresh:h,onGoToAgents:p,onCancel:m}){const[v,j]=f.useState("ready"),[k,z]=f.useState("webhook"),[A,H]=f.useState(""),[E,G]=f.useState(()=>c[0]?.id??""),[C,K]=f.useState(""),[O,$]=f.useState(""),[J,V]=f.useState(""),[B,X]=f.useState(""),[oe,ie]=f.useState(""),[se,te]=f.useState(null),[ae,ce]=f.useState(null),[ne,xe]=f.useState(null),[R,Q]=f.useState(null),[D,P]=f.useState(null),[M,F]=f.useState("idle"),g=f.useRef(null),N=f.useCallback(()=>(g.current||(g.current=new tt(l,new Ve(l))),g.current),[l]),y=c.find(_=>_.id===E)??null,W=f.useCallback(async _=>{_.preventDefault();const Z=k==="webhook"&&A.trim()&&C.trim()&&O.trim()&&y,pe=k==="socket_mode"&&A.trim()&&C.trim()&&J.trim()&&y;if(!Z&&!pe)return;te(null),j("connecting");let _e;try{const me=Eh(A);_e=await s({name:A.trim(),channelId:me,workspaceId:y.workspaceId,boundWorkflowId:y.boundWorkflowId,appType:"slack",description:`Slack integration for agent: ${y.name}`})}catch(me){te(me instanceof Error?me.message:"Failed to create the channel record. Please try again."),j("error");return}xe(_e);try{const me={bot_token:C.trim(),connection_mode:k};k==="webhook"?me.signing_secret=O.trim():me.app_token=J.trim(),B.trim()&&(me.app_id=B.trim()),oe.trim()&&(me.team_id=oe.trim());const De=await N().connectChannel(_e.workspaceId,_e.id,me),fe=De.setupData,ke=k==="webhook"?De.webhookUrl??fe?.webhook_url??null:null;Q(ke);const Ie=fe?.team_name??null,Se=fe?.bot_user??null;(Ie||Se)&&P([Ie,Se?`Bot: ${Se}`:null].filter(Boolean).join(" · "));const bt={..._e,connectionState:De.connectionState,webhookUrl:De.webhookUrl,setupData:De.setupData};ce(bt),j("connected"),h?.(),u(bt)}catch(me){h?.(),te(me instanceof Error?me.message:k==="webhook"?"Connection failed. Please check your Bot Token and Signing Secret.":"Connection failed. Please check your Bot Token and App-Level Token."),j("created")}},[k,A,C,O,J,B,oe,y,s,N,u,h]);if(c.length===0)return n.jsxs("div",{className:"cheng-sl-form__no-agents",children:[n.jsx("div",{className:"cheng-sl-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-sl-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-sl-form__no-agents-desc",children:"Create an agent first, then come back to connect a Slack app. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:qo})]});if(v==="connected"&&ae)return n.jsxs("div",{className:"cheng-sl-form__success",children:[n.jsx("div",{className:"cheng-sl-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-form__success-title",children:"Slack Connected!"}),n.jsxs("p",{className:"cheng-sl-form__success-desc",children:[n.jsx("strong",{children:ae.name})," has been created and verified",D&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-sl-form__workspace-info",children:D})]}),y&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:y.name})]}),"."]}),n.jsx("div",{className:"cheng-sl-form__mode-badge",children:k==="socket_mode"?"Socket Mode":"Webhook Mode"}),k==="webhook"&&R&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Configure Slack Event Subscriptions"}),n.jsxs("div",{className:"cheng-sl-form__webhook-row",children:[n.jsx("span",{className:"cheng-sl-form__webhook-label",children:"Request URL"}),n.jsxs("div",{className:"cheng-sl-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-sl-form__webhook-value",children:R}),n.jsx("button",{type:"button",className:"cheng-sl-form__copy-btn",onClick:()=>{navigator.clipboard.writeText(R).then(()=>{F("copied"),setTimeout(()=>F("idle"),2e3)})},children:M==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Event Subscriptions"})]}),n.jsxs("li",{children:["Enable events and paste the ",n.jsx("strong",{children:"Request URL"})," shown above"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Subscribe to bot events"}),", add:"," ",n.jsx("code",{children:"app_mention"})," and ",n.jsx("code",{children:"message.im"})," (add"," ",n.jsx("code",{children:"message.channels"})," to receive channel messages)"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"})]}),n.jsx("li",{children:"Reinstall the app to your workspace to apply scope changes"})]})]}),k==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Socket Mode — No Public URL Required"}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Socket Mode"})," and confirm it is ",n.jsx("strong",{children:"enabled"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Event Subscriptions"}),", enable events and subscribe to bot events:"," ",n.jsx("code",{children:"app_mention"}),", ",n.jsx("code",{children:"message.im"}),", ",n.jsx("code",{children:"message.channels"})]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"}),", ",n.jsx("code",{children:"connections:write"})]}),n.jsx("li",{children:"Reinstall the app to your workspace if you added new scopes"}),n.jsx("li",{children:"The backend is now listening via WebSocket — no Event Subscriptions Request URL needed"})]})]}),n.jsx("p",{className:"cheng-sl-form__success-hint",children:k==="webhook"?"After configuring Event Subscriptions, mention your bot in a channel to verify the integration.":"Your bot is now connected via Socket Mode. Mention it in a channel or send a DM to verify."}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:qo})]});if(v==="created"&&ne)return n.jsxs("div",{className:"cheng-sl-form__created-warn",children:[n.jsx("div",{className:"cheng-sl-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-sl-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-sl-form__created-warn-desc",children:[n.jsx("strong",{children:ne.name})," was created successfully, but the token validation failed",se?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:se})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:qo})]});const L=v==="connecting",U=A.trim().length>0&&C.trim().length>0&&(k==="webhook"?O.trim().length>0:J.trim().length>0)&&!!y&&!L;return n.jsxs("form",{className:"cheng-sl-form",onSubmit:W,children:[n.jsxs("div",{className:"cheng-sl-form__mode-toggle-wrap",children:[n.jsx("span",{className:"cheng-sl-form__mode-toggle-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-form__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${k==="webhook"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>z("webhook"),disabled:L,children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${k==="socket_mode"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>z("socket_mode"),disabled:L,children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]}),n.jsx("span",{className:"cheng-sl-form__mode-toggle-hint",children:k==="webhook"?"Requires a public HTTPS URL. Slack sends events to your server via HTTP.":"No public URL needed. Backend maintains a persistent WebSocket to Slack."})]}),n.jsxs("div",{className:"cheng-sl-form__instructions",children:[n.jsx("p",{className:"cheng-sl-form__instructions-title",children:"Before you begin"}),k==="webhook"?n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App Credentials"}),", copy the"," ",n.jsx("strong",{children:"Signing Secret"})]}),n.jsxs("li",{children:["After connecting, paste the provided ",n.jsx("strong",{children:"Request URL"})," into"," ",n.jsx("strong",{children:"Event Subscriptions"})]})]}):n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"Socket Mode"})," in your app settings and"," ",n.jsx("strong",{children:"enable Socket Mode"})]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),", generate a token with ",n.jsx("code",{children:"connections:write"})," scope — this is your"," ",n.jsx("strong",{children:"App-Level Token"})," (",n.jsx("code",{children:"xapp-..."}),")"]}),n.jsxs("li",{children:["Enable ",n.jsx("strong",{children:"Event Subscriptions"})," and subscribe to the bot events you need (no Request URL needed)"]})]})]}),se&&n.jsxs("div",{className:"cheng-sl-form__error-banner",children:[n.jsx("span",{children:se}),n.jsx("button",{type:"button",className:"cheng-sl-form__retry-btn",onClick:()=>{j("ready"),te(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-name",children:["Integration Name ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-name",className:"cheng-sl-form__input",type:"text",value:A,onChange:_=>H(_.target.value),placeholder:"Slack Support Bot",disabled:L,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-sl-form__hint",children:"A display name for this Slack integration"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-agent",children:["Agent ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-sl-form__agent-select-wrap",children:n.jsx("select",{id:"sl-agent",className:"cheng-sl-form__input cheng-sl-form__input--select",value:E,onChange:_=>G(_.target.value),disabled:L,required:!0,children:c.map(_=>n.jsxs("option",{value:_.id,children:[Ah(_)," ",_.name]},_.id))})}),y&&n.jsxs("span",{className:"cheng-sl-form__hint",children:["Messages from Slack will be handled by"," ",n.jsx("strong",{children:y.name}),y.description?` — ${y.description}`:""]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-bot-token",children:["Bot Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xoxb-...)"})]}),n.jsx("input",{id:"sl-bot-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:C,onChange:_=>K(_.target.value),placeholder:"xoxb-0000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx",disabled:L,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"OAuth & Permissions → Bot User OAuth Token"}),". Keep this secret."]})]}),k==="webhook"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-signing-secret",children:["Signing Secret ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-signing-secret",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:O,onChange:_=>$(_.target.value),placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:L,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App Credentials → Signing Secret"}),". Used to verify webhook signatures."]})]}),k==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-token",children:["App-Level Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xapp-...)"})]}),n.jsx("input",{id:"sl-app-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:J,onChange:_=>V(_.target.value),placeholder:"xapp-1-xxxxxxxxxx-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:L,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),". Must have the"," ",n.jsx("code",{children:"connections:write"})," scope. Different from the Bot Token."]})]}),n.jsxs("div",{className:"cheng-sl-form__optional-row",children:[n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-id",children:["App ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-app-id",className:"cheng-sl-form__input",type:"text",value:B,onChange:_=>X(_.target.value),placeholder:"A0XXXXXXX",disabled:L,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["From ",n.jsx("strong",{children:"Basic Information → App ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-team-id",children:["Workspace ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-team-id",className:"cheng-sl-form__input",type:"text",value:oe,onChange:_=>ie(_.target.value),placeholder:"T0XXXXXXX",disabled:L,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:"Slack Workspace / Team ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--ghost",onClick:m,disabled:L,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",disabled:!U,children:L?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-form__btn-spinner"}),"Connecting..."]}):"Connect Slack"})]}),n.jsx("style",{children:qo})]})}const qo=`
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
`;function zh({channel:c,agents:s,apiBaseUrl:l,onUpdate:u,onRefresh:h,onSaved:p,onCancel:m}){const v=c.connectionConfig??{},j=s.find(ke=>ke.boundWorkflowId===c.boundWorkflowId&&ke.workspaceId===c.workspaceId)?.id??s[0]?.id??"",k=typeof v.connection_mode=="string"&&v.connection_mode==="socket_mode"?"socket_mode":"webhook",[z,A]=f.useState(k),[H,E]=f.useState(j),G=typeof v.app_id=="string"?v.app_id:"",C=typeof v.team_id=="string"?v.team_id:"",[K,O]=f.useState(G),[$,J]=f.useState(C),[V,B]=f.useState(""),[X,oe]=f.useState(""),[ie,se]=f.useState(""),[te,ae]=f.useState("ready"),[ce,ne]=f.useState(!1),[xe,R]=f.useState(null),[Q,D]=f.useState(null),[P,M]=f.useState(c.webhookUrl??null),F=f.useRef(null),g=f.useCallback(()=>(F.current||(F.current=new tt(l,new Ve(l))),F.current),[l]),N=s.find(ke=>ke.id===H)??null,y=s.find(ke=>ke.boundWorkflowId===c.boundWorkflowId&&ke.workspaceId===c.workspaceId)??null,W=N&&(N.workspaceId!==c.workspaceId||N.boundWorkflowId!==c.boundWorkflowId),L=z!==k,U=z==="webhook"?V.trim().length>0||X.trim().length>0:V.trim().length>0||ie.trim().length>0,_=z==="webhook"?V.trim().length>0&&X.trim().length>0:V.trim().length>0&&ie.trim().length>0,Z=L&&!_,pe=f.useCallback(async ke=>{if(N&&!(!W&&!U&&!L)&&!Z){D(null),R(null),ke?ae("saving"):ne(!0);try{if(W&&await u({id:c.id,channelId:c.channelId,name:c.name,workspaceId:N.workspaceId,boundWorkflowId:N.boundWorkflowId,appType:c.appType,description:c.description}),U||L){const Ie=W?N.workspaceId:c.workspaceId,Se={connection_mode:z};V.trim()&&(Se.bot_token=V.trim()),z==="webhook"?X.trim()&&(Se.signing_secret=X.trim()):ie.trim()&&(Se.app_token=ie.trim()),Se.app_id=K.trim()||null,Se.team_id=$.trim()||null;const bt=await g().connectChannel(Ie,c.id,Se),ln=bt.setupData;if(z==="webhook"){const vn=bt.webhookUrl??ln?.webhook_url??null;vn&&M(vn)}else M(null)}if(h?.(),ke)ae("saved"),setTimeout(()=>p(),1200);else{ae("ready");let Ie;L?Ie=`Switched to ${z==="socket_mode"?"Socket Mode":"Webhook Mode"} and verified.`:U?Ie="Credentials verified — Slack integration is active.":Ie="Agent binding updated.",R(Ie)}}catch(Ie){D(Ie instanceof Error?Ie.message:"Update failed. Please try again."),ae("error"),R(null)}finally{ke||ne(!1)}}},[N,W,U,L,Z,z,c,u,g,V,X,ie,K,$,h,p]),_e=f.useCallback(async ke=>{ke.preventDefault(),await pe(!0)},[pe]),me=te==="saving",De=!!N&&(U||!!W&&!L)&&!Z&&!me&&!ce,fe=me?null:U||L?"Save & Reconnect":"Save";return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):te==="saved"?n.jsxs("div",{className:"cheng-sl-edit__success",children:[n.jsx("div",{className:"cheng-sl-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-sl-edit__success-desc",children:[n.jsx("strong",{children:c.name})," has been"," ",U||L?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:ud})]}):n.jsxs("form",{className:"cheng-sl-edit",onSubmit:_e,children:[Q&&n.jsxs("div",{className:"cheng-sl-edit__error-banner",children:[n.jsx("span",{children:Q}),n.jsx("button",{type:"button",className:"cheng-sl-edit__retry-btn",onClick:()=>{ae("ready"),D(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-edit__mode-section",children:[n.jsxs("div",{className:"cheng-sl-edit__mode-header",children:[n.jsx("span",{className:"cheng-sl-edit__mode-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-edit__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${z==="webhook"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>A("webhook"),disabled:me,children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${z==="socket_mode"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>A("socket_mode"),disabled:me,children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]})]}),L&&n.jsxs("div",{className:"cheng-sl-edit__mode-change-warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Switching from ",n.jsx("strong",{children:k==="webhook"?"Webhook":"Socket Mode"})," to"," ",n.jsx("strong",{children:z==="webhook"?"Webhook":"Socket Mode"}),". You must provide"," ",z==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to complete the switch — saving will trigger a full reconnect."]})]}),z==="webhook"&&P&&n.jsxs("div",{className:"cheng-sl-edit__webhook-info",children:[n.jsx("span",{className:"cheng-sl-edit__webhook-label",children:"Event Subscriptions Request URL"}),n.jsx("code",{className:"cheng-sl-edit__webhook-value",children:P}),n.jsxs("span",{className:"cheng-sl-edit__webhook-hint",children:["Paste this URL in your Slack app's ",n.jsx("strong",{children:"Event Subscriptions"})," settings."]})]}),z==="socket_mode"&&!L&&n.jsxs("div",{className:"cheng-sl-edit__socket-info",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),"Connected via Socket Mode — no Event Subscriptions Request URL needed. The backend maintains a persistent WebSocket to Slack."]}),n.jsxs("div",{className:"cheng-sl-edit__grid",children:[n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("select",{className:"cheng-sl-edit__input cheng-sl-edit__input--select",value:H,onChange:ke=>E(ke.target.value),disabled:me,required:!0,children:s.map(ke=>n.jsx("option",{value:ke.id,children:ke.name},ke.id))}),W&&N&&n.jsxs("div",{className:"cheng-sl-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:y?.name??"current agent"})," to"," ",n.jsx("strong",{children:N.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Bot Token"}),n.jsxs("span",{className:"cheng-sl-edit__card-tip",children:["Leave blank to keep the existing token (",n.jsx("code",{children:"xoxb-..."}),"). Fill in only to rotate."]})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:V,onChange:ke=>B(ke.target.value),placeholder:"xoxb-... (leave blank to keep current)",disabled:me,autoComplete:"off"})})]}),z==="webhook"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Signing Secret"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:L?"Required to activate Webhook Mode. Found in Basic Information → App Credentials.":"Leave blank to keep the existing secret. Fill in to rotate it independently."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:X,onChange:ke=>oe(ke.target.value),placeholder:L?"Required for Webhook Mode":"(leave blank to keep current)",disabled:me,autoComplete:"off"}),xe&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:xe}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!U||!N||me||ce||Z,onClick:()=>{pe(!1)},children:ce?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),z==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App-Level Token"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:L?"Required to activate Socket Mode. Generate in Basic Information → App-Level Tokens with connections:write scope.":"Leave blank to keep the existing token (xapp-...). Fill in only to rotate."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:ie,onChange:ke=>se(ke.target.value),placeholder:L?"xapp-... (required for Socket Mode)":"xapp-... (leave blank to keep current)",disabled:me,autoComplete:"off"}),xe&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:xe}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!U||!N||me||ce||Z,onClick:()=>{pe(!1)},children:ce?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:U?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:K,onChange:ke=>O(ke.target.value),placeholder:"A0XXXXXXX",disabled:me||!U,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Workspace ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:U?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:$,onChange:ke=>J(ke.target.value),placeholder:"T0XXXXXXX",disabled:me||!U,autoComplete:"off"})})]})]}),!U&&!L&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),z==="webhook"?"Fill in Bot Token or Signing Secret (or both) to reconnect. Leave blank to only update the agent.":"Fill in Bot Token or App-Level Token (or both) to reconnect. Leave blank to only update the agent."]}),Z&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint cheng-sl-edit__creds-hint--warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Mode change requires credentials to reconnect. Provide"," ",z==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to proceed."]}),n.jsxs("div",{className:"cheng-sl-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--ghost",onClick:m,disabled:me,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-edit__btn cheng-sl-edit__btn--connect",disabled:!De,children:me?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner"}),"Saving..."]}):fe})]}),n.jsx("style",{children:ud})]})}const ud=`
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
`;function Lh(c){return c.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"wecom-bot"}function Mh(c){const s=c.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Rh({agents:c,onCreate:s,apiBaseUrl:l,onPaired:u,onRefresh:h,onGoToAgents:p,onCancel:m}){const[v,j]=f.useState("ready"),[k,z]=f.useState(""),[A,H]=f.useState(()=>c[0]?.id??""),[E,G]=f.useState(""),[C,K]=f.useState(""),[O,$]=f.useState(""),[J,V]=f.useState(""),[B,X]=f.useState(""),[oe,ie]=f.useState(""),[se,te]=f.useState(null),[ae,ce]=f.useState(null),[ne,xe]=f.useState(null),[R,Q]=f.useState(null),[D,P]=f.useState({}),M=f.useRef(null),F=f.useCallback(()=>(M.current||(M.current=new tt(l,new Ve(l))),M.current),[l]),g=c.find(U=>U.id===A)??null,N=f.useCallback((U,_)=>{navigator.clipboard.writeText(_).then(()=>{P(Z=>({...Z,[U]:"copied"})),setTimeout(()=>P(Z=>({...Z,[U]:"idle"})),2e3)})},[]),y=f.useCallback(async U=>{if(U.preventDefault(),!k.trim()||!E.trim()||!C.trim()||!O.trim()||!J.trim()||!B.trim()||!g)return;te(null),j("connecting");let _;try{const Z=Lh(k);_=await s({name:k.trim(),channelId:Z,workspaceId:g.workspaceId,boundWorkflowId:g.boundWorkflowId,appType:"wecom",description:`WeCom integration for agent: ${g.name}`})}catch(Z){te(Z instanceof Error?Z.message:"Failed to create the channel record. Please try again."),j("error");return}xe(_);try{const Z={corp_id:E.trim(),agent_id:C.trim(),corp_secret:O.trim(),token:J.trim(),encoding_aes_key:B.trim()};oe.trim()&&(Z.receive_id=oe.trim());const pe=await F().connectChannel(_.workspaceId,_.id,Z),_e=pe.setupData;Q({webhookUrl:pe.webhookUrl??_e?.webhook_url??void 0,token:_e?.callback_token??J.trim(),encodingAesKeyMasked:_e?.encoding_aes_key_masked??void 0,corpId:_e?.corp_id??E.trim(),agentId:_e?.agent_id??C.trim()});const me={..._,connectionState:pe.connectionState,webhookUrl:pe.webhookUrl,setupData:pe.setupData};ce(me),j("connected"),h?.(),u(me)}catch(Z){h?.(),te(Z instanceof Error?Z.message:"Connection failed. Please check your Corp ID and Corp Secret."),j("created")}},[k,E,C,O,J,B,oe,g,s,F,u,h]);if(c.length===0)return n.jsxs("div",{className:"cheng-wc-form__no-agents",children:[n.jsx("div",{className:"cheng-wc-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wc-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wc-form__no-agents-desc",children:"Create an agent first, then come back to connect a WeCom integration. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:Yo})]});if(v==="connected"&&ae)return n.jsxs("div",{className:"cheng-wc-form__success",children:[n.jsx("div",{className:"cheng-wc-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-form__success-title",children:"WeCom Credentials Verified!"}),n.jsxs("p",{className:"cheng-wc-form__success-desc",children:[n.jsx("strong",{children:ae.name})," has been created and the Corp Secret has been verified",g&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:g.name})]}),"."]}),n.jsx("div",{className:"cheng-wc-form__status-badge cheng-wc-form__status-badge--configuring",children:"Configuring — Awaiting Callback Setup"}),R&&n.jsxs("div",{className:"cheng-wc-form__webhook-box",children:[n.jsx("p",{className:"cheng-wc-form__webhook-box-title",children:"Configure WeCom Admin Console Callback"}),R.webhookUrl&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Callback URL"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:R.webhookUrl}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>N("webhookUrl",R.webhookUrl),children:D.webhookUrl==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),R.token&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Token"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:R.token}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>N("token",R.token),children:D.token==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),R.encodingAesKeyMasked&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"EncodingAESKey"}),n.jsx("code",{className:"cheng-wc-form__webhook-value cheng-wc-form__webhook-value--muted",children:R.encodingAesKeyMasked})]}),n.jsxs("ol",{className:"cheng-wc-form__steps-list",children:[n.jsxs("li",{children:["Log in to"," ",n.jsx("strong",{children:"WeCom Admin Console"})," → ",n.jsx("strong",{children:"App Management"})," → select your custom app"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Receive Messages"}),", click ",n.jsx("strong",{children:"Set"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Callback URL"})," into the URL field"]}),n.jsxs("li",{children:["Enter the same ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," ","you configured above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Save"})," — WeCom will send a GET challenge to verify the URL"]}),n.jsxs("li",{children:["Once verified, the connection state will switch from"," ",n.jsx("em",{children:"Configuring"})," to ",n.jsx("em",{children:"Active"})]})]})]}),n.jsx("p",{className:"cheng-wc-form__success-hint",children:"The connection is not fully active until WeCom Admin Console successfully verifies the callback URL. After saving the callback config, send a test message to confirm end-to-end flow."}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:Yo})]});if(v==="created"&&ne)return n.jsxs("div",{className:"cheng-wc-form__created-warn",children:[n.jsx("div",{className:"cheng-wc-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-wc-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-wc-form__created-warn-desc",children:[n.jsx("strong",{children:ne.name})," was created successfully, but credential validation failed",se?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:se})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:Yo})]});const W=v==="connecting",L=k.trim().length>0&&E.trim().length>0&&C.trim().length>0&&O.trim().length>0&&J.trim().length>0&&B.trim().length>0&&!!g&&!W;return n.jsxs("form",{className:"cheng-wc-form",onSubmit:y,children:[n.jsxs("div",{className:"cheng-wc-form__instructions",children:[n.jsx("p",{className:"cheng-wc-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wc-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"WeCom Enterprise Account"})," with a created"," ",n.jsx("strong",{children:"Custom App"})," (自建应用)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Management"}),", note the ",n.jsx("strong",{children:"Corp ID"}),","," ",n.jsx("strong",{children:"AgentId"}),", and ",n.jsx("strong",{children:"App Secret"})]}),n.jsxs("li",{children:["Create a ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," of your choice — you'll use these when configuring the callback in WeCom Admin Console"]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Callback URL"})," to paste into the Receive Messages settings"]})]})]}),se&&v!=="created"&&n.jsxs("div",{className:"cheng-wc-form__error-banner",children:[n.jsx("span",{children:se}),n.jsx("button",{type:"button",className:"cheng-wc-form__retry-btn",onClick:()=>{j("ready"),te(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-name",className:"cheng-wc-form__input",type:"text",value:k,onChange:U=>z(U.target.value),placeholder:"WeCom Customer Support",disabled:W,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A display name for this WeCom integration"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent",children:["Agent ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wc-form__agent-select-wrap",children:n.jsx("select",{id:"wc-agent",className:"cheng-wc-form__input cheng-wc-form__input--select",value:A,onChange:U=>H(U.target.value),disabled:W,required:!0,children:c.map(U=>n.jsxs("option",{value:U.id,children:[Mh(U)," ",U.name]},U.id))})}),g&&n.jsxs("span",{className:"cheng-wc-form__hint",children:["Messages from WeCom will be handled by"," ",n.jsx("strong",{children:g.name}),g.description?` — ${g.description}`:""]})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-id",children:["Corp ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-id",className:"cheng-wc-form__input",type:"text",value:E,onChange:U=>G(U.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in WeCom Admin Console → My Enterprise"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent-id",children:["Agent ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-agent-id",className:"cheng-wc-form__input",type:"text",value:C,onChange:U=>K(U.target.value),placeholder:"1000002",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → AgentId"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-secret",children:["Corp Secret ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-secret",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:O,onChange:U=>$(U.target.value),placeholder:"Your app's Corp Secret",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → App Secret. Used to obtain access tokens."})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-token",children:["Token ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-token",className:"cheng-wc-form__input",type:"text",value:J,onChange:U=>V(U.target.value),placeholder:"my-callback-token",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A string you choose — enter this same value in WeCom callback settings"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-aes-key",children:["EncodingAESKey ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-aes-key",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:B,onChange:U=>X(U.target.value),placeholder:"43-character AES key",disabled:W,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"43-char random key — enter this same value in WeCom callback settings"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-receive-id",children:["Receive ID",n.jsx("span",{className:"cheng-wc-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"wc-receive-id",className:"cheng-wc-form__input",type:"text",value:oe,onChange:U=>ie(U.target.value),placeholder:"Defaults to Corp ID if blank",disabled:W,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Used as the receive_id in message verification. Defaults to Corp ID."})]}),n.jsxs("div",{className:"cheng-wc-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--ghost",onClick:m,disabled:W,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",disabled:!L,children:W?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-form__btn-spinner"}),"Connecting..."]}):"Connect WeCom"})]}),n.jsx("style",{children:Yo})]})}const Yo=`
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
`;function Ph({channel:c,agents:s,apiBaseUrl:l,onUpdate:u,onRefresh:h,onSaved:p,onCancel:m}){const v=c.connectionConfig??{},j=s.find(_=>_.boundWorkflowId===c.boundWorkflowId&&_.workspaceId===c.workspaceId)?.id??s[0]?.id??"",[k,z]=f.useState(j),[A,H]=f.useState(typeof v.corp_id=="string"?v.corp_id:""),[E,G]=f.useState(typeof v.agent_id=="string"?v.agent_id:""),[C,K]=f.useState(typeof v.receive_id=="string"?v.receive_id:""),[O,$]=f.useState(""),[J,V]=f.useState(""),[B,X]=f.useState(""),[oe,ie]=f.useState("ready"),[se,te]=f.useState(!1),[ae,ce]=f.useState(null),[ne,xe]=f.useState(null),[R,Q]=f.useState(c.webhookUrl??null),D=f.useRef(null),P=f.useCallback(()=>(D.current||(D.current=new tt(l,new Ve(l))),D.current),[l]),M=s.find(_=>_.id===k)??null,F=s.find(_=>_.boundWorkflowId===c.boundWorkflowId&&_.workspaceId===c.workspaceId)??null,g=M&&(M.workspaceId!==c.workspaceId||M.boundWorkflowId!==c.boundWorkflowId),N=O.trim().length>0&&J.trim().length>0&&B.trim().length>0&&A.trim().length>0&&E.trim().length>0,y=f.useCallback(async _=>{if(M){xe(null),ce(null),_?ie("saving"):te(!0);try{if(g&&await u({id:c.id,channelId:c.channelId,name:c.name,workspaceId:M.workspaceId,boundWorkflowId:M.boundWorkflowId,appType:c.appType,description:c.description}),N){const Z=g?M.workspaceId:c.workspaceId,pe={corp_id:A.trim(),agent_id:E.trim(),corp_secret:O.trim(),token:J.trim(),encoding_aes_key:B.trim()};C.trim()&&(pe.receive_id=C.trim());const _e=await P().connectChannel(Z,c.id,pe),me=_e.setupData,De=_e.webhookUrl??me?.webhook_url??null;De&&Q(De)}h?.(),_?(ie("saved"),setTimeout(()=>p(),1200)):(ie("ready"),ce(N?"Credentials verified — Corp Secret accepted.":"Agent binding updated."))}catch(Z){xe(Z instanceof Error?Z.message:"Update failed. Please try again."),ie("error"),ce(null)}finally{_||te(!1)}}},[M,g,N,c,u,P,A,E,O,J,B,C,h,p]),W=f.useCallback(async _=>{_.preventDefault(),await y(!0)},[y]),L=oe==="saving",U=!!M&&(!!g||N)&&!L&&!se;return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):oe==="saved"?n.jsxs("div",{className:"cheng-wc-edit__success",children:[n.jsx("div",{className:"cheng-wc-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wc-edit__success-desc",children:[n.jsx("strong",{children:c.name})," has been"," ",N?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:pd})]}):n.jsxs("form",{className:"cheng-wc-edit",onSubmit:W,children:[ne&&n.jsxs("div",{className:"cheng-wc-edit__error-banner",children:[n.jsx("span",{children:ne}),n.jsx("button",{type:"button",className:"cheng-wc-edit__retry-btn",onClick:()=>{ie("ready"),xe(null)},children:"Retry"})]}),R&&n.jsxs("div",{className:"cheng-wc-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wc-edit__webhook-label",children:"Callback URL"}),n.jsx("code",{className:"cheng-wc-edit__webhook-value",children:R}),n.jsxs("span",{className:"cheng-wc-edit__webhook-hint",children:["Paste this URL in WeCom Admin Console → App → ",n.jsx("strong",{children:"Receive Messages"}),"."]})]}),c.connectionState==="configuring"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--configuring",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Credentials verified, but WeCom callback is not yet active. Configure the callback URL in WeCom Admin Console to complete the integration."]}),c.connectionState==="active"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--active",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"20 6 9 17 4 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),"Callback is active — WeCom verification challenge has succeeded."]}),n.jsxs("div",{className:"cheng-wc-edit__grid",children:[n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("select",{className:"cheng-wc-edit__input cheng-wc-edit__input--select",value:k,onChange:_=>z(_.target.value),disabled:L,required:!0,children:s.map(_=>n.jsx("option",{value:_.id,children:_.name},_.id))}),g&&M&&n.jsxs("div",{className:"cheng-wc-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:F?.name??"current agent"})," to"," ",n.jsx("strong",{children:M.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration. Update if the enterprise changed."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:A,onChange:_=>H(_.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:L,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Agent ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:E,onChange:_=>G(_.target.value),placeholder:"1000002",disabled:L,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp Secret"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing secret. Fill in to rotate credentials."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:O,onChange:_=>$(_.target.value),placeholder:"(leave blank to keep current)",disabled:L,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Token"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating Corp Secret."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:J,onChange:_=>V(_.target.value),placeholder:"(leave blank to keep current)",disabled:L,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"EncodingAESKey"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing key. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:B,onChange:_=>X(_.target.value),placeholder:"(leave blank to keep current)",disabled:L,autoComplete:"off"}),ae&&n.jsx("div",{className:"cheng-wc-edit__test-ok",children:ae}),n.jsx("div",{className:"cheng-wc-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--secondary",disabled:!N||!M||L||se,onClick:()=>{y(!1)},children:se?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner cheng-wc-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Receive ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Optional. Used for signature verification. Defaults to Corp ID if blank."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:C,onChange:_=>K(_.target.value),placeholder:"Defaults to Corp ID",disabled:L,autoComplete:"off"})})]})]}),!N&&n.jsxs("div",{className:"cheng-wc-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Corp Secret + Token + EncodingAESKey to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wc-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--ghost",onClick:m,disabled:L,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-edit__btn cheng-wc-edit__btn--connect",disabled:!U,children:L?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner"}),"Saving..."]}):N?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:pd})]})}const pd=`
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
`;function Dh(c){return c.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"dingtalk-bot"}function Wh(c){const s=c.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Fh({agents:c,onCreate:s,apiBaseUrl:l,onPaired:u,onRefresh:h,onGoToAgents:p,onCancel:m}){const[v,j]=f.useState("ready"),[k,z]=f.useState(""),[A,H]=f.useState(()=>c[0]?.id??""),[E,G]=f.useState(""),[C,K]=f.useState(""),[O,$]=f.useState(""),[J,V]=f.useState(null),[B,X]=f.useState(null),[oe,ie]=f.useState(null),[se,te]=f.useState(null),ae=f.useRef(null),ce=f.useCallback(()=>(ae.current||(ae.current=new tt(l,new Ve(l))),ae.current),[l]),ne=c.find(D=>D.id===A)??null,xe=f.useCallback(async D=>{if(D.preventDefault(),!k.trim()||!E.trim()||!C.trim()||!O.trim()||!ne)return;V(null),j("connecting");let P;try{const M=Dh(k);P=await s({name:k.trim(),channelId:M,workspaceId:ne.workspaceId,boundWorkflowId:ne.boundWorkflowId,appType:"dingtalk",description:`DingTalk integration for agent: ${ne.name}`})}catch(M){V(M instanceof Error?M.message:"Failed to create the channel record. Please try again."),j("error");return}ie(P);try{const M=await ce().connectChannel(P.workspaceId,P.id,{client_id:E.trim(),client_secret:C.trim(),robot_code:O.trim(),connection_mode:"stream"}),F=M.setupData;te({robotCode:F?.robot_code??O.trim(),appName:F?.app_name??void 0,streamStatus:F?.stream_status??"connected",validatedAt:F?.validated_at??void 0});const g={...P,connectionState:M.connectionState,webhookUrl:M.webhookUrl,setupData:M.setupData};X(g),j("connected"),h?.(),u(g)}catch(M){h?.(),V(M instanceof Error?M.message:"Connection failed. Please check your Client ID, Client Secret, and Robot Code."),j("created")}},[k,E,C,O,ne,s,ce,u,h]);if(c.length===0)return n.jsxs("div",{className:"cheng-dt-form__no-agents",children:[n.jsx("div",{className:"cheng-dt-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-dt-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-dt-form__no-agents-desc",children:"Create an agent first, then come back to connect a DingTalk integration. An agent defines which workflow processes incoming messages."}),p&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:p,children:"Go to Agents"}),n.jsx("style",{children:Jo})]});if(v==="connected"&&B)return n.jsxs("div",{className:"cheng-dt-form__success",children:[n.jsx("div",{className:"cheng-dt-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-form__success-title",children:"DingTalk Connected!"}),n.jsxs("p",{className:"cheng-dt-form__success-desc",children:[n.jsx("strong",{children:B.name})," has been created and is now live",se?.appName&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-dt-form__app-name",children:se.appName})]}),ne&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:ne.name})]}),"."]}),n.jsxs("div",{className:"cheng-dt-form__mode-badge",children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),n.jsxs("div",{className:"cheng-dt-form__stream-box",children:[n.jsx("p",{className:"cheng-dt-form__stream-box-title",children:"Stream Connection Active"}),se?.robotCode&&n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Robot Code"}),n.jsx("code",{className:"cheng-dt-form__stream-value",children:se.robotCode})]}),n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Status"}),n.jsx("span",{className:"cheng-dt-form__stream-status",children:se?.streamStatus==="connected"?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__status-dot cheng-dt-form__status-dot--active"}),"Connected"]}):se?.streamStatus??"connecting"})]}),n.jsxs("ol",{className:"cheng-dt-form__steps-list",children:[n.jsxs("li",{children:["The backend is now maintaining a ",n.jsx("strong",{children:"persistent WebSocket"})," to DingTalk — no public URL or callback configuration needed"]}),n.jsxs("li",{children:["Verify the bot is working by sending a ",n.jsx("strong",{children:"direct message"})," to your DingTalk App Bot"]}),n.jsxs("li",{children:["For group chat, ",n.jsx("strong",{children:"@mention"})," the bot — only @-mentioned messages are forwarded to the workflow"]})]})]}),n.jsxs("p",{className:"cheng-dt-form__success-hint",children:["The stream worker runs as long as the server is up. If the worker stops unexpectedly, use ",n.jsx("strong",{children:"Manage → Edit → Test Connection"})," to reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",onClick:m,children:"Done — Close"}),n.jsx("style",{children:Jo})]});if(v==="created"&&oe)return n.jsxs("div",{className:"cheng-dt-form__created-warn",children:[n.jsx("div",{className:"cheng-dt-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-dt-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-dt-form__created-warn-desc",children:[n.jsx("strong",{children:oe.name})," was created successfully, but the stream worker failed to start",J?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:J})]}):"."," The channel is now listed in Connected Integrations — open"," ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:m,children:"Close"}),n.jsx("style",{children:Jo})]});const R=v==="connecting",Q=k.trim().length>0&&E.trim().length>0&&C.trim().length>0&&O.trim().length>0&&!!ne&&!R;return n.jsxs("form",{className:"cheng-dt-form",onSubmit:xe,children:[n.jsxs("div",{className:"cheng-dt-form__instructions",children:[n.jsx("p",{className:"cheng-dt-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-dt-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"DingTalk Open Platform"})," developer account with a created ",n.jsx("strong",{children:"App Bot"})," (企业内部应用)"]}),n.jsxs("li",{children:["From your app's ",n.jsx("strong",{children:"App Credentials"}),", note the"," ",n.jsx("strong",{children:"Client ID"})," (AppKey) and ",n.jsx("strong",{children:"Client Secret"})," (AppSecret)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Features → Bot"}),", enable the bot feature and note the ",n.jsx("strong",{children:"Robot Code"})]}),n.jsx("li",{children:"No callback URL configuration is needed — DingTalk Stream Mode connects outbound from the server"})]})]}),J&&v!=="created"&&n.jsxs("div",{className:"cheng-dt-form__error-banner",children:[n.jsx("span",{children:J}),n.jsx("button",{type:"button",className:"cheng-dt-form__retry-btn",onClick:()=>{j("ready"),V(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-name",children:["Integration Name ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-name",className:"cheng-dt-form__input",type:"text",value:k,onChange:D=>z(D.target.value),placeholder:"DingTalk Support Bot",disabled:R,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-dt-form__hint",children:"A display name for this DingTalk integration"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-agent",children:["Agent ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-dt-form__agent-select-wrap",children:n.jsx("select",{id:"dt-agent",className:"cheng-dt-form__input cheng-dt-form__input--select",value:A,onChange:D=>H(D.target.value),disabled:R,required:!0,children:c.map(D=>n.jsxs("option",{value:D.id,children:[Wh(D)," ",D.name]},D.id))})}),ne&&n.jsxs("span",{className:"cheng-dt-form__hint",children:["Messages from DingTalk will be handled by"," ",n.jsx("strong",{children:ne.name}),ne.description?` — ${ne.description}`:""]})]}),n.jsxs("div",{className:"cheng-dt-form__row-2col",children:[n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-id",children:["Client ID ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppKey)"})]}),n.jsx("input",{id:"dt-client-id",className:"cheng-dt-form__input",type:"text",value:E,onChange:D=>G(D.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client ID"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-robot-code",children:["Robot Code ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-robot-code",className:"cheng-dt-form__input",type:"text",value:O,onChange:D=>$(D.target.value),placeholder:"dingxxxxxx",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Features → Bot → Robot Code"})]})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-secret",children:["Client Secret ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppSecret)"})]}),n.jsx("input",{id:"dt-client-secret",className:"cheng-dt-form__input cheng-dt-form__input--token",type:"password",value:C,onChange:D=>K(D.target.value),placeholder:"Your app's Client Secret",disabled:R,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client Secret. Used for stream authentication."})]}),n.jsxs("div",{className:"cheng-dt-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--ghost",onClick:m,disabled:R,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",disabled:!Q,children:R?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__btn-spinner"}),"Connecting..."]}):"Connect DingTalk"})]}),n.jsx("style",{children:Jo})]})}const Jo=`
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
`;function Oh({channel:c,agents:s,apiBaseUrl:l,liveStatus:u,onUpdate:h,onRefresh:p,onSaved:m,onCancel:v}){const j=c.connectionConfig??{},k=c.setupData,z=s.find(_=>_.boundWorkflowId===c.boundWorkflowId&&_.workspaceId===c.workspaceId)?.id??s[0]?.id??"",[A,H]=f.useState(z),[E,G]=f.useState(typeof j.client_id=="string"?j.client_id:""),[C,K]=f.useState(typeof j.robot_code=="string"?j.robot_code:typeof k?.robot_code=="string"?k.robot_code:""),[O,$]=f.useState(""),[J,V]=f.useState("ready"),[B,X]=f.useState(!1),[oe,ie]=f.useState(null),[se,te]=f.useState(null),ae=typeof k?.stream_status=="string"?k.stream_status:void 0,ce=u?.lastEventAt??(typeof k?.last_event_at=="string"?k.last_event_at:void 0),ne=u?.connectionState??c.connectionState,xe=u?u.connectionState==="active"?"connected":u.connectionState??"unknown":ae??(c.connectionState==="active"?"connected":c.connectionState??"unknown"),R=u?u.workerRunning===!0||u.connectionState==="active":c.connectionState==="active"||ae==="connected",Q=f.useRef(null),D=f.useCallback(()=>(Q.current||(Q.current=new tt(l,new Ve(l))),Q.current),[l]),P=s.find(_=>_.id===A)??null,M=s.find(_=>_.boundWorkflowId===c.boundWorkflowId&&_.workspaceId===c.workspaceId)??null,F=P&&(P.workspaceId!==c.workspaceId||P.boundWorkflowId!==c.boundWorkflowId),g=E.trim().length>0&&O.trim().length>0&&C.trim().length>0,N=f.useCallback(async _=>{if(P){te(null),ie(null),_?V("saving"):X(!0);try{if(F&&await h({id:c.id,channelId:c.channelId,name:c.name,workspaceId:P.workspaceId,boundWorkflowId:P.boundWorkflowId,appType:c.appType,description:c.description}),g){const Z=F?P.workspaceId:c.workspaceId,pe=await D().connectChannel(Z,c.id,{client_id:E.trim(),client_secret:O.trim(),robot_code:C.trim(),connection_mode:"stream"});$("");const me=pe.setupData?.stream_status}p?.(),_?(V("saved"),setTimeout(()=>m(),1200)):(V("ready"),ie(g?"Stream worker restarted — credentials accepted.":"Agent binding updated."))}catch(Z){te(Z instanceof Error?Z.message:"Update failed. Please try again."),V("error"),ie(null)}finally{_||X(!1)}}},[P,F,g,c,h,D,E,O,C,p,m]),y=f.useCallback(async _=>{_.preventDefault(),await N(!0)},[N]),W=J==="saving",L=!!P&&(!!F||g)&&!W&&!B,U=_=>{if(!_)return"—";const Z=new Date(_);return Number.isNaN(Z.getTime())?_:Z.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})};return s.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):J==="saved"?n.jsxs("div",{className:"cheng-dt-edit__success",children:[n.jsx("div",{className:"cheng-dt-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-dt-edit__success-desc",children:[n.jsx("strong",{children:c.name})," has been"," ",g?"reconfigured — stream worker restarted":"updated","."]}),n.jsx("style",{children:hd})]}):n.jsxs("form",{className:"cheng-dt-edit",onSubmit:y,children:[se&&n.jsxs("div",{className:"cheng-dt-edit__error-banner",children:[n.jsx("span",{children:se}),n.jsx("button",{type:"button",className:"cheng-dt-edit__retry-btn",onClick:()=>{V("ready"),te(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-edit__stream-info",children:[n.jsxs("div",{className:"cheng-dt-edit__stream-info-header",children:[n.jsx("div",{className:"cheng-dt-edit__stream-info-label",children:"Stream Mode"}),n.jsxs("div",{className:"cheng-dt-edit__stream-status-row",children:[n.jsx("span",{className:`cheng-dt-edit__status-dot ${R?"cheng-dt-edit__status-dot--active":ne==="error"||ae==="error"?"cheng-dt-edit__status-dot--error":"cheng-dt-edit__status-dot--idle"}`}),n.jsx("span",{className:"cheng-dt-edit__stream-status-text",children:xe})]})]}),ce&&n.jsxs("div",{className:"cheng-dt-edit__stream-meta",children:["Last event: ",n.jsx("strong",{children:U(ce)})]}),u?.lastError&&n.jsx("div",{className:"cheng-dt-edit__stream-warn cheng-dt-edit__stream-warn--error",children:u.lastError}),ne==="degraded"&&!u?.lastError&&n.jsxs("div",{className:"cheng-dt-edit__stream-warn",children:["Worker stopped unexpectedly. Provide credentials below and click"," ",n.jsx("strong",{children:"Save & Reconnect"})," to restart the stream."]})]}),n.jsxs("div",{className:"cheng-dt-edit__grid",children:[n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("select",{className:"cheng-dt-edit__input cheng-dt-edit__input--select",value:A,onChange:_=>H(_.target.value),disabled:W,required:!0,children:s.map(_=>n.jsx("option",{value:_.id,children:_.name},_.id))}),F&&P&&n.jsxs("div",{className:"cheng-dt-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:M?.name??"current agent"})," to"," ",n.jsx("strong",{children:P.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client ID"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration. Update only if the app changed."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:E,onChange:_=>G(_.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:W,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Robot Code"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:C,onChange:_=>K(_.target.value),placeholder:"dingxxxxxx",disabled:W,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client Secret"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Leave blank to keep the existing secret. Fill to rotate credentials or restart the stream."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("input",{className:"cheng-dt-edit__input cheng-dt-edit__input--token",type:"password",value:O,onChange:_=>$(_.target.value),placeholder:"(leave blank to keep current)",disabled:W,autoComplete:"off"}),oe&&n.jsx("div",{className:"cheng-dt-edit__test-ok",children:oe}),n.jsx("div",{className:"cheng-dt-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--secondary",disabled:!g||!P||W||B,onClick:()=>{N(!1)},children:B?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner cheng-dt-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]})]}),!g&&n.jsxs("div",{className:"cheng-dt-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Client ID + Client Secret + Robot Code to restart the stream worker. Leave them blank to only update the agent."]}),n.jsxs("div",{className:"cheng-dt-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--ghost",onClick:v,disabled:W,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-edit__btn cheng-dt-edit__btn--connect",disabled:!L,children:W?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner"}),"Saving..."]}):g?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:hd})]})}const hd=`
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
`;function Xn({title:c,description:s,icon:l,iconLabel:u,iconColor:h,onClose:p,children:m}){return n.jsx("div",{className:"cheng-page__dialog-overlay",onClick:p,children:n.jsxs("div",{className:"cheng-page__dialog",onClick:v=>v.stopPropagation(),children:[n.jsxs("div",{className:"cheng-page__dialog-header",children:[n.jsx("div",{className:"cheng-page__dialog-icon",style:{background:`${h}20`},children:n.jsx("span",{role:"img","aria-label":u,style:{fontSize:"20px"},children:l})}),n.jsxs("div",{className:"cheng-page__dialog-copy",children:[n.jsx("h2",{className:"cheng-page__form-card-title",children:c}),n.jsx("p",{className:"cheng-page__form-card-desc",children:s})]}),n.jsx("button",{type:"button",className:"cheng-page__applink-close-btn",onClick:p,children:"Close"})]}),n.jsx("div",{className:"cheng-page__dialog-body",children:m})]})})}function Uh({activePlatform:c,platforms:s,isCreateModalOpen:l,onCloseCreate:u,editingChannel:h,onCloseEdit:p,agents:m,onCreate:v,onUpdate:j,onRefresh:k,apiBaseUrl:z,onGoToAgents:A,liveStatusMap:H}){const E=h?s.find(J=>J.id===h.appType)??{id:h.appType??"custom",label:h.appType??"App",shortLabel:h.appType??"App",emoji:"⚙️",color:"#c96442",desc:""}:null,G=f.useCallback(J=>{u(),k()},[u,k]),C=f.useCallback(J=>{k()},[k]),K=f.useCallback(J=>{k()},[k]),O=f.useCallback(J=>{k()},[k]),$=f.useCallback(J=>{k()},[k]);return n.jsxs(n.Fragment,{children:[l&&c.id==="telegram"&&n.jsx(Xn,{title:`创建 ${c.label}`,description:c.desc,icon:c.emoji,iconLabel:c.label,iconColor:c.color,onClose:u,children:n.jsx(vh,{agents:m,onCreate:v,apiBaseUrl:z,onPaired:G,onRefresh:k,onGoToAgents:()=>{u(),A()},onCancel:u},"telegram-pairing")}),l&&c.id==="whatsapp"&&n.jsx(Xn,{title:`创建 ${c.label}`,description:c.desc,icon:c.emoji,iconLabel:c.label,iconColor:c.color,onClose:u,children:n.jsx(Nh,{agents:m,onCreate:v,apiBaseUrl:z,onPaired:C,onRefresh:k,onGoToAgents:()=>{u(),A()},onCancel:u},"whatsapp-pairing")}),l&&c.id==="slack"&&n.jsx(Xn,{title:`创建 ${c.label}`,description:c.desc,icon:c.emoji,iconLabel:c.label,iconColor:c.color,onClose:u,children:n.jsx(Th,{agents:m,onCreate:v,apiBaseUrl:z,onPaired:K,onRefresh:k,onGoToAgents:()=>{u(),A()},onCancel:u},"slack-pairing")}),l&&c.id==="dingtalk"&&n.jsx(Xn,{title:`创建 ${c.label}`,description:c.desc,icon:c.emoji,iconLabel:c.label,iconColor:c.color,onClose:u,children:n.jsx(Fh,{agents:m,onCreate:v,apiBaseUrl:z,onPaired:$,onRefresh:k,onGoToAgents:()=>{u(),A()},onCancel:u},"dingtalk-pairing")}),l&&c.id==="wecom"&&n.jsx(Xn,{title:`创建 ${c.label}`,description:c.desc,icon:c.emoji,iconLabel:c.label,iconColor:c.color,onClose:u,children:n.jsx(Rh,{agents:m,onCreate:v,apiBaseUrl:z,onPaired:O,onRefresh:k,onGoToAgents:()=>{u(),A()},onCancel:u},"wecom-pairing")}),h&&E&&n.jsxs(Xn,{title:`编辑 ${h.name}`,description:`@${h.channelId} · ${E.label}`,icon:E.emoji,iconLabel:h.appType??"app",iconColor:E.color,onClose:p,children:[h.appType==="telegram"&&n.jsx(jh,{channel:h,agents:m,apiBaseUrl:z,onUpdate:j,onRefresh:k,onSaved:()=>{k(),p()},onCancel:p},`${h.id}-tg-edit`),h.appType==="whatsapp"&&n.jsx(Ih,{channel:h,agents:m,apiBaseUrl:z,onUpdate:j,onRefresh:k,onSaved:()=>{k(),p()},onCancel:p},`${h.id}-wa-edit`),h.appType==="slack"&&n.jsx(zh,{channel:h,agents:m,apiBaseUrl:z,onUpdate:j,onRefresh:k,onSaved:()=>{k(),p()},onCancel:p},`${h.id}-sl-edit`),h.appType==="dingtalk"&&n.jsx(Oh,{channel:h,agents:m,apiBaseUrl:z,liveStatus:H?.[h.id],onUpdate:j,onRefresh:k,onSaved:()=>{k(),p()},onCancel:p},`${h.id}-dt-edit`),h.appType==="wecom"&&n.jsx(Ph,{channel:h,agents:m,apiBaseUrl:z,onUpdate:j,onRefresh:k,onSaved:()=>{k(),p()},onCancel:p},`${h.id}-wc-edit`)]})]})}const qn=[{id:"whatsapp",label:"WhatsApp",shortLabel:"WA",emoji:"💬",color:"#25d366",desc:"Meta WhatsApp Business"},{id:"telegram",label:"Telegram",shortLabel:"TG",emoji:"✈️",color:"#2ca5e0",desc:"Telegram Bot API"},{id:"slack",label:"Slack",shortLabel:"Slack",emoji:"💼",color:"#4a154b",desc:"Slack Workspace App"},{id:"wecom",label:"WeCom",shortLabel:"WeCom",emoji:"🏢",color:"#248067",desc:"WeCom Custom App"},{id:"dingtalk",label:"DingTalk",shortLabel:"DT",emoji:"💠",color:"#1677ff",desc:"DingTalk App Bot"},{id:"line",label:"LINE",shortLabel:"LINE",emoji:"🟢",color:"#00c300",desc:"LINE Messaging API"},{id:"custom",label:"Custom",shortLabel:"Custom",emoji:"⚙️",color:"#c96442",desc:"Custom integration"}];function xd(){return n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}function _d(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M12 2l2.4 2.4H18v3.6L20.4 12 18 16v3.6h-3.6L12 22l-2.4-2.4H6V16L3.6 12 6 8V4.4h3.6z"}),n.jsx("circle",{cx:"12",cy:"12",r:"2.5"})]})}function $h(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]})}function Bh(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"3"}),n.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}function Kh(){return n.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),n.jsx("polyline",{points:"16 17 21 12 16 7"}),n.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})}function Vh({channels:c,activeChannel:s,activeConfig:l,isLoading:u,onSelectChannel:h,onCreateClick:p,chatWindowProps:m={}}){const[v,j]=f.useState(!1),[k,z]=f.useState([]),[A,H]=f.useState(null),E=f.useMemo(()=>s?new gd(s.channelId):null,[s]),G=f.useCallback(()=>{if(!E){z([]),H(null);return}let B=E.listSessions();B.length===0&&(B=[E.createSession("新会话")]),z(B),H(E.getActiveSessionId())},[E]);f.useEffect(()=>{G()},[G]),f.useEffect(()=>{if(typeof window>"u"||!s)return;const B=X=>{X.detail?.channelId===s.channelId&&G()};return window.addEventListener("cheng:session-label-updated",B),()=>{window.removeEventListener("cheng:session-label-updated",B)}},[s,G]);const C=f.useCallback(()=>{E&&(E.createSession("新会话"),G())},[G,E]),K=f.useCallback(B=>{E&&(E.setActiveSessionId(B.id),G())},[G,E]),O=f.useCallback(B=>{E&&(E.deleteSession(B),G())},[G,E]),$=f.useCallback((B,X)=>{E&&(E.renameSession(B,X),G())},[G,E]),J=f.useCallback(B=>{E&&(E.togglePinSession(B),G())},[G,E]),V=f.useMemo(()=>A?{...l,sessionId:A}:l,[l,A]);return n.jsxs("div",{className:"cheng-shell__chat-view",children:[n.jsxs("div",{className:`cheng-shell__channel-sidebar${v?" cheng-shell__channel-sidebar--collapsed":""}`,children:[!v&&n.jsx("div",{className:"cheng-shell__channel-sidebar-content",children:n.jsx(wh,{sessions:k,activeSessionId:A,onSelect:K,onCreateClick:C,onDeleteSession:O,onRenameSession:$,onTogglePinSession:J})}),n.jsx("button",{className:"cheng-shell__channel-sidebar-toggle cheng-shell__channel-sidebar-toggle--edge",onClick:()=>j(B=>!B),type:"button","aria-label":v?"Expand agents sidebar":"Collapse agents sidebar",title:v?"Expand agents sidebar":"Collapse agents sidebar",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:v?n.jsx("path",{d:"M6 3L10 8L6 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}):n.jsx("path",{d:"M10 3L6 8L10 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),n.jsx("div",{className:"cheng-shell__chat-area",children:u&&!s?n.jsx("div",{className:"cheng-shell__placeholder",children:n.jsx("span",{className:"cheng-shell__placeholder-text",children:"Loading channels..."})}):s&&s.workspaceId?n.jsx(Kp,{config:V,children:n.jsx(dh,{...m,channels:c,activeChannelId:s?.id??null,activeChannel:s,onSelectChannel:h})},`${s.channelId}:${s.workspaceId}`):n.jsxs("div",{className:"cheng-shell__placeholder",children:[n.jsx("div",{className:"cheng-shell__placeholder-icon",children:n.jsx(xd,{})}),n.jsx("p",{className:"cheng-shell__placeholder-text",children:"No channels yet."}),n.jsx("button",{className:"cheng-shell__placeholder-btn",onClick:p,type:"button",children:"Create your first channel"})]})})]})}function Hh(c){if(!c)return"Unknown";const s=new Date(c);return Number.isNaN(s.getTime())?c:s.toLocaleDateString("zh-CN",{year:"numeric",month:"short",day:"numeric"})}function Gh(c){const s=c.connectionConfig?.avatarIcon;return typeof s=="string"&&s.trim()?s:"🤖"}function Qh({channels:c,onCreateClick:s,onEditClick:l,onDeleteClick:u,workspaceNames:h,workflowNames:p}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"Agents"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your agent roster, review workflow bindings, and launch any configured agent."})]}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:s,children:"Create Agent"})]}),n.jsx("div",{className:"cheng-page__content",children:c.length===0?n.jsxs("div",{className:"cheng-page__empty-card",children:[n.jsx("div",{className:"cheng-page__empty-icon",children:n.jsx(_d,{})}),n.jsx("h2",{className:"cheng-page__empty-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-page__empty-desc",children:"Create your first agent to bind a workflow and start handling conversations."}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:s,children:"Create Agent"})]}):n.jsx("div",{className:"cheng-page__channel-grid",children:c.map(m=>n.jsxs("div",{className:"cheng-page__channel-card",children:[n.jsxs("div",{className:"cheng-page__channel-card-top",children:[n.jsx("div",{className:"cheng-page__channel-card-icon",children:n.jsx("span",{className:"cheng-page__channel-card-avatar","aria-hidden":"true",children:Gh(m)})}),n.jsxs("div",{className:"cheng-page__channel-card-actions",children:[n.jsx("span",{className:"cheng-page__channel-card-badge",children:m.appType||"agent"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-edit",onClick:()=>l(m),children:"Edit"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-delete",onClick:()=>{u(m)},children:"Delete"})]})]}),n.jsxs("div",{className:"cheng-page__channel-card-body",children:[n.jsx("h2",{className:"cheng-page__channel-card-title",children:m.name}),n.jsxs("p",{className:"cheng-page__channel-card-id",children:["@",m.channelId]}),n.jsx("p",{className:"cheng-page__channel-card-desc",children:m.description||"No description yet. Open chat to interact with this agent."})]}),n.jsxs("div",{className:"cheng-page__channel-card-workflow",children:[n.jsxs("span",{className:"cheng-page__channel-card-detail",title:h[m.workspaceId]?`Workspace ID: ${m.workspaceId}`:m.workspaceId,children:["Workspace: ",h[m.workspaceId]||m.workspaceId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",title:p[m.boundWorkflowId]?`Workflow ID: ${m.boundWorkflowId}`:m.boundWorkflowId,children:["Workflow: ",p[m.boundWorkflowId]||m.boundWorkflowId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",children:["Created: ",Hh(m.createdAt)]})]})]},m.id||m.channelId))})})]})}function Xh({channels:c,onCreate:s,onUpdate:l,onDelete:u,onRefresh:h,apiBaseUrl:p,onSuccess:m,onGoToAgents:v}){const[j,k]=f.useState("telegram"),[z,A]=f.useState(""),[H,E]=f.useState(!1),[G,C]=f.useState(null),[K,O]=f.useState(null),[$,J]=f.useState({}),V=f.useRef(null),B=f.useCallback(()=>(V.current||(V.current=new tt(p,new Ve(p))),V.current),[p]),X=f.useMemo(()=>new Set(["telegram","whatsapp","slack","wecom","dingtalk"]),[]),oe=f.useMemo(()=>c.filter(y=>!y.appType||y.appType==="agent"),[c]),ie={degraded:0,error:1,awaiting_input:2,connecting:3,active:4,disconnected:5},se=f.useMemo(()=>c.filter(y=>y.appType&&y.appType!=="agent").sort((y,W)=>{const L=ie[y.connectionState??""]??6,U=ie[W.connectionState??""]??6;return L!==U?L-U:(W.updatedAt??W.createdAt??"").localeCompare(y.updatedAt??y.createdAt??"")}),[c]);f.useEffect(()=>{qn.some(W=>W.id===j)||k(se[0]?.appType??"telegram")},[se,j]);const te=qn.find(y=>y.id===j)??qn[1],ae=f.useMemo(()=>qn.map(y=>{const W=se.filter(_=>_.appType===y.id),L=W.filter(_=>_.connectionState==="active").length,U=W.filter(_=>_.connectionState==="awaiting_input"||_.connectionState==="connecting"||_.connectionState==="configuring").length;return{platform:y,total:W.length,connectedCount:L,pendingCount:U}}),[se]),ce=f.useMemo(()=>{const y=z.trim().toLowerCase();return se.filter(W=>W.appType!==te.id?!1:y?[W.name,W.channelId,W.description,W.webhookUrl,W.connectionState].filter(Boolean).join(" ").toLowerCase().includes(y):!0)},[te.id,se,z]),ne=se.filter(y=>y.appType===te.id).length,xe=f.useMemo(()=>Object.fromEntries(se.map(y=>{const W=oe.find(L=>L.workspaceId===y.workspaceId&&L.boundWorkflowId===y.boundWorkflowId);return[y.id,W?.name??"未绑定 Agent"]})),[oe,se]),R=f.useCallback(y=>{switch(y){case"active":return{label:"运行中",cls:"cheng-applink__badge--active"};case"degraded":return{label:"异常",cls:"cheng-applink__badge--degraded"};case"configuring":return{label:"待回调",cls:"cheng-applink__badge--configuring"};case"connecting":case"awaiting_input":return{label:"待配置",cls:"cheng-applink__badge--pending"};case"error":return{label:"失败",cls:"cheng-applink__badge--error"};case"disconnected":return{label:"已断开",cls:"cheng-applink__badge--disconnected"};default:return{label:"未配置",cls:"cheng-applink__badge--default"}}},[]),Q=f.useCallback(y=>{if(!y)return"—";const W=new Date(y);return Number.isNaN(W.getTime())?y:W.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},[]),D=f.useCallback(y=>{k(y),A("")},[]),P=f.useCallback(()=>{E(!1)},[]),M=f.useCallback(async y=>{O({channelId:y.id,action:"refresh"});try{const W=await B().getChannelStatus(y.workspaceId,y.id);J(L=>({...L,[y.id]:W})),await h()}finally{O(null)}},[B,h]),F=f.useCallback(async y=>{if(window.confirm(`确定要暂停 ${y.name} 的连接吗？这会断开当前平台连接。`)){O({channelId:y.id,action:"pause"});try{await B().disconnectChannel(y.workspaceId,y.id),J(L=>{const U={...L};return delete U[y.id],U}),await h()}finally{O(null)}}},[B,h]),g=f.useCallback(async y=>{O({channelId:y.id,action:"resume"});try{await B().connectChannel(y.workspaceId,y.id),J(W=>{const L={...W};return delete L[y.id],L}),await h()}finally{O(null)}},[B,h]),N=f.useCallback(async y=>{if(window.confirm(`确定删除 ${y.name} 吗？删除后需要重新创建连接。`)){O({channelId:y.id,action:"delete"});try{await Promise.resolve(u(y.id)),J(L=>{const U={...L};return delete U[y.id],U}),await h(),G?.id===y.id&&C(null)}finally{O(null)}}},[G?.id,u,h]);return n.jsxs("div",{className:"cheng-page cheng-applink",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"App Link 管理"}),n.jsx("p",{className:"cheng-page__subtitle",children:"管理各平台接入连接，查看运行状态，按平台筛选并操作。"})]}),n.jsxs("button",{type:"button",className:"cheng-applink__refresh-btn",onClick:()=>{h()},"aria-label":"刷新列表",title:"刷新列表",children:[n.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]}),"刷新"]})]}),n.jsxs("div",{className:"cheng-applink__body",children:[n.jsx("div",{className:"cheng-applink__platforms",children:ae.map(({platform:y,total:W,connectedCount:L})=>{const U=y.id===te.id,_=X.has(y.id);return n.jsxs("button",{type:"button",className:`cheng-applink__platform-card${U?" cheng-applink__platform-card--active":""}${_?"":" cheng-applink__platform-card--disabled"}`,onClick:()=>D(y.id),style:U?{borderColor:y.color}:{},children:[n.jsx("span",{className:"cheng-applink__platform-icon",style:{background:`${y.color}18`,color:y.color},role:"img","aria-label":y.label,children:y.emoji}),n.jsx("span",{className:"cheng-applink__platform-label",children:y.label}),!_&&n.jsx("span",{className:"cheng-applink__platform-soon",children:"Soon"}),_&&n.jsx("span",{className:`cheng-applink__platform-count${L>0?" cheng-applink__platform-count--active":""}`,children:W})]},y.id)})}),n.jsxs("div",{className:"cheng-applink__board",children:[n.jsxs("div",{className:"cheng-applink__board-header",children:[n.jsxs("div",{className:"cheng-applink__board-heading",children:[n.jsxs("h2",{className:"cheng-applink__board-title",children:[te.shortLabel," 列表"]}),n.jsx("span",{className:"cheng-applink__board-count",children:ne})]}),n.jsxs("div",{className:"cheng-applink__board-actions",children:[n.jsxs("label",{className:"cheng-applink__search",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"11",cy:"11",r:"7",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("path",{d:"M20 20l-3.5-3.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),n.jsx("input",{type:"search",value:z,onChange:y=>A(y.target.value),placeholder:`搜索 ${te.shortLabel} 名称、ID...`})]}),n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>E(!0),disabled:!X.has(te.id),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",te.shortLabel]})]})]}),ce.length>0?n.jsx("div",{className:"cheng-applink__table-wrap",children:n.jsxs("table",{className:"cheng-applink__table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"连接名称"}),n.jsx("th",{children:"状态"}),n.jsx("th",{children:"绑定 Agent"}),n.jsx("th",{children:"Webhook / 描述"}),n.jsx("th",{children:"更新时间"}),n.jsx("th",{children:"操作"})]})}),n.jsx("tbody",{children:ce.map(y=>{const W=$[y.id],L=W?.connectionState??y.connectionState,U=R(L),_=qn.find(De=>De.id===y.appType)??te,Z=K?.channelId===y.id,pe=xe[y.id]??"未绑定 Agent",_e=K?.channelId===y.id&&K.action==="refresh",me=L==="disconnected";return n.jsxs("tr",{className:"cheng-applink__row",children:[n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--name",children:[n.jsx("div",{className:"cheng-applink__row-icon",style:{background:`${_.color}16`,color:_.color},children:n.jsx("span",{role:"img","aria-label":_.label,children:_.emoji})}),n.jsxs("div",{className:"cheng-applink__row-copy",children:[n.jsx("strong",{children:y.name}),n.jsxs("span",{children:["@",y.channelId]})]})]}),n.jsx("td",{className:"cheng-applink__cell",children:n.jsx("span",{className:`cheng-applink__badge ${U.cls}`,children:U.label})}),n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--meta",children:[n.jsx("span",{children:pe}),y.boundWorkflowId&&n.jsxs("small",{children:["Workflow: ",y.boundWorkflowId]})]}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--endpoint",children:y.appType==="dingtalk"?n.jsxs("div",{className:"cheng-applink__stream-cell",children:[n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--stream",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),(W?.lastEventAt??W?.lastError)&&n.jsx("span",{className:"cheng-applink__stream-meta",children:W.lastError?n.jsxs("span",{className:"cheng-applink__stream-error",title:W.lastError,children:["⚠ ",W.lastError.slice(0,40),W.lastError.length>40?"…":""]}):W?.lastEventAt?n.jsxs(n.Fragment,{children:["最近事件 ",Q(W.lastEventAt)]}):null})]}):y.appType==="slack"&&y.connectionConfig?.connection_mode==="socket_mode"?n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--socket",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]}):n.jsx("span",{title:y.webhookUrl||y.description||"",children:y.webhookUrl||y.description||"—"})}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--time",children:Q(y.updatedAt??y.createdAt)}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--actions",children:n.jsxs("div",{className:"cheng-applink__row-actions",children:[me?n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"恢复连接",title:"恢复连接",onClick:()=>{g(y)},disabled:Z,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 6.5v11l9-5.5-9-5.5Z",fill:"currentColor"})})}):n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"暂停连接",title:"暂停连接",onClick:()=>{F(y)},disabled:Z,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M9 5H7v14h2V5Zm8 0h-2v14h2V5Z",fill:"currentColor"})})}),n.jsx("button",{type:"button",className:`cheng-applink__icon-btn${_e?" cheng-applink__icon-btn--spinning":""}`,"aria-label":"刷新状态",title:"刷新状态",onClick:()=>{M(y)},disabled:Z,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"编辑连接",title:"编辑连接",onClick:()=>C(y),children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M12 20h9",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn cheng-applink__icon-btn--danger","aria-label":"删除连接",title:"删除连接",onClick:()=>{N(y)},disabled:Z,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M3 6h18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M8 6V4h8v2",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M19 6l-1 14H6L5 6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M10 11v5M14 11v5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]})})]})})]},y.id||y.channelId)})})]})}):n.jsxs("div",{className:"cheng-applink__empty",children:[n.jsx("div",{className:"cheng-applink__empty-icon",children:n.jsx("span",{role:"img","aria-label":te.label,style:{fontSize:28},children:te.emoji})}),n.jsxs("p",{className:"cheng-applink__empty-title",children:[te.shortLabel," 暂无连接"]}),n.jsx("p",{className:"cheng-applink__empty-desc",children:z?`没有匹配 "${z}" 的连接`:`当前还没有 ${te.label} 接入连接`}),!z&&X.has(te.id)&&n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>E(!0),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",te.shortLabel]})]})]})]}),n.jsx(Uh,{activePlatform:te,platforms:qn,isCreateModalOpen:H,onCloseCreate:P,editingChannel:G,onCloseEdit:()=>C(null),agents:oe,onCreate:s,onUpdate:l,onRefresh:h,apiBaseUrl:p,onGoToAgents:v,liveStatusMap:$})]})}function qh({onLogout:c}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header",children:[n.jsx("h1",{className:"cheng-page__title",children:"Settings"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your account and preferences."})]}),n.jsx("div",{className:"cheng-page__content",children:n.jsx("div",{className:"cheng-page__settings-card",children:n.jsxs("div",{className:"cheng-page__settings-section",children:[n.jsx("h2",{className:"cheng-page__settings-section-title",children:"Account"}),n.jsx("p",{className:"cheng-page__settings-section-desc",children:"You are currently logged in. Click below to sign out of your account."}),n.jsxs("button",{type:"button",className:"cheng-page__logout-btn",onClick:c,children:[n.jsx(Kh,{}),"Sign Out"]})]})})})]})}function Yh({channels:c,activeChannel:s,activeConfig:l,isLoading:u,onSelectChannel:h,onCreateChannel:p,onUpdateChannel:m,onDeleteChannel:v,onLogout:j,onRefreshChannels:k,apiBaseUrl:z,chatWindowProps:A={}}){const[H,E]=f.useState("chat"),[G,C]=f.useState(!1),[K,O]=f.useState(null),[$,J]=f.useState({}),[V,B]=f.useState({}),X=[{id:"chat",label:"Chat",icon:n.jsx(xd,{})},{id:"channel",label:"Agents",icon:n.jsx(_d,{})},{id:"applink",label:"App Links",icon:n.jsx($h,{})}],oe=()=>{C(!1),O(null),E("channel")},ie=()=>{C(!1),O(null)},se=async te=>{window.confirm(`确定删除 Agent "${te.name}" 吗？删除后无法恢复。`)&&(await Promise.resolve(v(te.id)),K?.id===te.id&&O(null))};return f.useEffect(()=>{let te=!1;return(async()=>{if(!z||c.length===0){te||(J({}),B({}));return}const ce=new Ve(z),ne=new tt(z,ce);try{const Q=await ne.listWorkspaces();te||J(Object.fromEntries(Q.map(D=>[D.id,D.name||D.id])))}catch{te||J({})}const xe=Array.from(new Set(c.map(Q=>Q.boundWorkflowId).filter(Q=>typeof Q=="string"&&Q.trim()))),R=await Promise.all(xe.map(async Q=>{try{const D=await ne.getWorkflowName(Q);return[Q,D||Q]}catch{return[Q,Q]}}));te||B(Object.fromEntries(R))})(),()=>{te=!0}},[z,c]),n.jsxs("div",{className:"cheng-shell",children:[n.jsxs("div",{className:"cheng-shell__sidebar",children:[n.jsx("div",{className:"cheng-shell__logo","aria-label":"ChengOS logo",children:"CO"}),n.jsx("div",{className:"cheng-shell__divider"}),n.jsx("nav",{className:"cheng-shell__nav",children:X.map(te=>{const ae=H===te.id;return n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${ae?" cheng-shell__nav-item--active":""}`,onClick:()=>E(te.id),"aria-label":te.label,children:[te.icon,ae&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:te.label})]},te.id)})}),n.jsxs("div",{className:"cheng-shell__bottom",children:[n.jsx("div",{className:"cheng-shell__divider"}),n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${H==="settings"?" cheng-shell__nav-item--active":""}`,onClick:()=>E("settings"),"aria-label":"Settings",children:[n.jsx(Bh,{}),H==="settings"&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:"Settings"})]})]})]}),n.jsxs("div",{className:"cheng-shell__main",children:[H==="chat"&&n.jsx(Vh,{channels:c,activeChannel:s,activeConfig:l,isLoading:u,onSelectChannel:h,onCreateClick:()=>E("channel"),chatWindowProps:A}),H==="channel"&&n.jsx(Qh,{channels:c,onCreateClick:()=>C(!0),onEditClick:te=>O(te),onDeleteClick:se,workspaceNames:$,workflowNames:V}),H==="applink"&&n.jsx(Xh,{channels:c,onCreate:p,onUpdate:m,onDelete:v,onRefresh:k??(()=>{}),apiBaseUrl:z,onSuccess:oe,onGoToAgents:()=>E("channel")}),H==="settings"&&n.jsx(qh,{onLogout:j})]}),n.jsx(mh,{isOpen:G||!!K,onClose:ie,mode:K?"edit":"create",initialChannel:K,existingChannels:c,onCreate:async te=>{await p(te)},onUpdate:async te=>{await m(te),oe()},apiBaseUrl:z}),n.jsx("style",{children:Jh})]})}const Jh=`
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
`;function Zh({apiBaseUrl:c,onLoginSuccess:s,title:l="ChengOS",subtitle:u="登录以管理你的 Channels"}){const[h,p]=f.useState(""),[m,v]=f.useState(""),[j,k]=f.useState(!1),[z,A]=f.useState(null),[H,E]=f.useState(!1),G=f.useCallback(async C=>{C.preventDefault(),k(!0),A(null);try{await new ra(c).login({email:h,password:m}),s()}catch(K){A(K instanceof Error?K.message:String(K))}finally{k(!1)}},[c,h,m,s]);return n.jsxs("div",{style:Ae.root,children:[n.jsx("div",{style:Ae.orbTopLeft}),n.jsx("div",{style:Ae.orbTopRight}),n.jsx("div",{style:Ae.orbBottom}),n.jsx("div",{style:Ae.container,children:n.jsxs("section",{style:Ae.card,children:[n.jsx("div",{style:Ae.cardGlow}),n.jsxs("div",{style:Ae.content,children:[n.jsx("div",{style:Ae.headerRow,children:n.jsxs("div",{style:Ae.brandWrap,children:[n.jsx("div",{style:Ae.brandLogo,children:"CO"}),n.jsx("div",{style:Ae.brandText,children:"CHENGOS"})]})}),n.jsxs("div",{style:Ae.titleWrap,children:[n.jsx("h1",{style:Ae.title,children:l}),n.jsx("p",{style:Ae.subtitle,children:u})]}),n.jsxs("form",{onSubmit:G,style:Ae.form,children:[n.jsxs("div",{style:Ae.field,children:[n.jsx("label",{style:Ae.label,htmlFor:"cheng-email",children:"邮箱"}),n.jsx("input",{id:"cheng-email",type:"email",required:!0,autoComplete:"email",value:h,onChange:C=>p(C.target.value),style:Ae.input,placeholder:"you@example.com",disabled:j})]}),n.jsxs("div",{style:Ae.field,children:[n.jsx("label",{style:Ae.label,htmlFor:"cheng-password",children:"密码"}),n.jsx("input",{id:"cheng-password",type:"password",required:!0,autoComplete:"current-password",value:m,onChange:C=>v(C.target.value),style:Ae.input,placeholder:"••••••••",disabled:j})]}),z&&n.jsx("div",{style:Ae.error,children:z}),n.jsxs("button",{type:"submit",disabled:j,onMouseEnter:()=>E(!0),onMouseLeave:()=>E(!1),onFocus:()=>E(!0),onBlur:()=>E(!1),style:{...Ae.button,...H&&!j?Ae.buttonHovered:{},...j?Ae.buttonDisabled:{}},children:[n.jsx("span",{children:j?"登录中...":"登录"}),n.jsx("span",{style:Ae.arrow,children:"→"})]})]})]})]})})]})}const Ae={root:{position:"relative",display:"flex",minHeight:"100%",width:"100%",overflow:"hidden",background:"radial-gradient(circle at top left, rgba(201, 100, 66, 0.14), transparent 30%), radial-gradient(circle at top right, rgba(217, 119, 87, 0.12), transparent 28%), linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},orbTopLeft:{position:"absolute",left:"-8rem",top:"-6rem",width:"16rem",height:"16rem",borderRadius:"9999px",background:"rgba(201, 100, 66, 0.12)",filter:"blur(56px)",pointerEvents:"none"},orbTopRight:{position:"absolute",right:"-6rem",top:"6rem",width:"18rem",height:"18rem",borderRadius:"9999px",background:"rgba(176, 174, 165, 0.2)",filter:"blur(56px)",pointerEvents:"none"},orbBottom:{position:"absolute",left:"32%",bottom:"-8rem",width:"20rem",height:"20rem",borderRadius:"9999px",background:"rgba(217, 119, 87, 0.12)",filter:"blur(60px)",pointerEvents:"none"},container:{position:"relative",zIndex:1,display:"flex",alignItems:"center",width:"100%",maxWidth:"36rem",minHeight:"100%",margin:"0 auto",padding:"2rem 1rem",boxSizing:"border-box"},card:{position:"relative",width:"100%",overflow:"hidden",borderRadius:"2rem",border:"1px solid #f0eee6",background:"#faf9f5",boxShadow:"0 0 0 1px #d1cfc5, rgba(0,0,0,0.07) 0px 16px 40px",backdropFilter:"blur(14px)"},cardGlow:{position:"absolute",inset:0,background:"radial-gradient(circle at top right, rgba(201, 100, 66, 0.08), transparent 34%), radial-gradient(circle at bottom left, rgba(217, 119, 87, 0.08), transparent 30%)",pointerEvents:"none"},content:{position:"relative",zIndex:1,padding:"1.75rem"},headerRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:"1.5rem"},brandWrap:{display:"flex",alignItems:"center",gap:"0.75rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"1rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700,boxShadow:"0 10px 24px rgba(226, 114, 91, 0.36)",letterSpacing:"0.03em"},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},titleWrap:{marginBottom:"1.5rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,letterSpacing:"-0.03em",color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},form:{display:"flex",flexDirection:"column",gap:"1rem"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"1rem",border:"1px solid #e8e6dc",background:"#faf9f5",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",boxShadow:"0 0 0 1px #d1cfc5",outline:"none"},error:{borderRadius:"1rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{height:"3rem",border:"1px solid #d1cfc5",borderRadius:"1rem",background:"#faf9f5",color:"#4d4c48",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",fontSize:"0.875rem",fontWeight:500,boxShadow:"0 0 0 1px #d1cfc5",cursor:"pointer",transition:"all 0.2s ease",marginTop:"0.25rem"},buttonHovered:{background:"#c96442",borderColor:"#c96442",color:"#faf9f5",boxShadow:"0 0 0 1px #c96442, rgba(0,0,0,0.08) 0px 8px 24px"},buttonDisabled:{opacity:.7,cursor:"not-allowed",boxShadow:"none"},arrow:{fontSize:"1rem",lineHeight:1}};function ef({config:c,chatWindowProps:s={},loginTitle:l,loginSubtitle:u}){const{isAuthenticated:h,logout:p,refresh:m}=Bp(c.apiBaseUrl),{channels:v,activeChannel:j,setActiveChannel:k,createChannel:z,updateChannel:A,deleteChannel:H,isLoading:E,refresh:G}=$p({...c,workspaceId:""}),C=f.useCallback(async $=>z($),[z]),K=f.useCallback(async $=>{await A($)},[A]),O=f.useMemo(()=>{const $={...c,workspaceId:""};return j?{...$,workspaceId:j.workspaceId,channelId:j.channelId,boundWorkflowId:j.boundWorkflowId||$.boundWorkflowId}:$},[c,j]);return h?n.jsxs("div",{className:"cheng-layout cheng-layout--multi",children:[n.jsx(Yh,{channels:v,activeChannel:j,activeConfig:O,isLoading:E,onSelectChannel:k,onCreateChannel:C,onUpdateChannel:K,onDeleteChannel:H,onLogout:p,onRefreshChannels:G,apiBaseUrl:c.apiBaseUrl,chatWindowProps:s}),n.jsx("style",{children:tf})]}):n.jsx(Zh,{apiBaseUrl:c.apiBaseUrl,onLoginSuccess:m,title:l,subtitle:u})}const tf=`
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
`;function nf({apiBaseUrl:c,token:s,onComplete:l}){const[u,h]=f.useState(""),[p,m]=f.useState(""),[v,j]=f.useState(!1),[k,z]=f.useState(!1),[A,H]=f.useState(null),E=f.useMemo(()=>s?.trim()||"",[s]),G=f.useCallback(async C=>{if(C.preventDefault(),H(null),!E){H("重置链接无效，请重新申请密码找回邮件。");return}if(u!==p){H("两次输入的密码不一致。");return}j(!0);try{await new ra(c).resetPassword({token:E,new_password:u}),z(!0),l?.()}catch(K){H(K instanceof Error?K.message:String(K))}finally{j(!1)}},[c,p,l,u,E]);return n.jsx("div",{style:Fe.root,children:n.jsxs("main",{style:Fe.panel,children:[n.jsxs("div",{style:Fe.brandRow,children:[n.jsx("div",{style:Fe.brandLogo,children:"CO"}),n.jsx("div",{style:Fe.brandText,children:"CHENGOS"})]}),k?n.jsxs("section",{style:Fe.content,children:[n.jsx("h1",{style:Fe.title,children:"密码已重置"}),n.jsx("p",{style:Fe.subtitle,children:"现在可以使用新密码登录。"}),n.jsx("a",{href:"/",style:Fe.button,children:"返回登录"})]}):n.jsxs("form",{onSubmit:G,style:Fe.content,children:[n.jsxs("div",{children:[n.jsx("h1",{style:Fe.title,children:"重置密码"}),n.jsx("p",{style:Fe.subtitle,children:"请输入新密码完成账号恢复。"})]}),n.jsxs("div",{style:Fe.field,children:[n.jsx("label",{style:Fe.label,htmlFor:"cheng-new-password",children:"新密码"}),n.jsx("input",{id:"cheng-new-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:u,onChange:C=>h(C.target.value),style:Fe.input,disabled:v||!E})]}),n.jsxs("div",{style:Fe.field,children:[n.jsx("label",{style:Fe.label,htmlFor:"cheng-confirm-password",children:"确认新密码"}),n.jsx("input",{id:"cheng-confirm-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:p,onChange:C=>m(C.target.value),style:Fe.input,disabled:v||!E})]}),!E&&n.jsx("div",{style:Fe.error,children:"重置链接缺少 token，请重新申请密码找回邮件。"}),A&&n.jsx("div",{style:Fe.error,children:A}),n.jsx("button",{type:"submit",disabled:v||!E,style:Fe.button,children:v?"提交中...":"更新密码"}),n.jsx("a",{href:"/",style:Fe.secondaryLink,children:"返回登录"})]})]})})}const Fe={root:{display:"flex",minHeight:"100%",width:"100%",alignItems:"center",justifyContent:"center",boxSizing:"border-box",padding:"2rem 1rem",background:"linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},panel:{width:"100%",maxWidth:"30rem",boxSizing:"border-box",border:"1px solid #d1cfc5",borderRadius:"1.25rem",background:"#faf9f5",padding:"1.75rem",boxShadow:"rgba(0,0,0,0.07) 0px 16px 40px"},brandRow:{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"0.875rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},content:{display:"flex",flexDirection:"column",gap:"1rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"0.875rem",border:"1px solid #e8e6dc",background:"#fff",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",outline:"none"},error:{borderRadius:"0.875rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{display:"flex",height:"3rem",alignItems:"center",justifyContent:"center",border:"1px solid #c96442",borderRadius:"0.875rem",background:"#c96442",color:"#faf9f5",fontSize:"0.875rem",fontWeight:600,textDecoration:"none",cursor:"pointer"},secondaryLink:{alignSelf:"center",color:"#5e5d59",fontSize:"0.875rem",textDecoration:"none"}};function rf(){const c=window.__CHENGOS_APP_CONFIG__,s={apiBaseUrl:c?.apiBaseUrl||void 0||"/api/v1",wsBaseUrl:c?.wsUrl||void 0||"/ws/executions",channelId:c?.channelId||void 0||"weather-app",boundWorkflowId:c?.boundWorkflowId||void 0||""};if(window.location.pathname==="/reset-password"){const l=new URLSearchParams(window.location.search).get("token");return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(nf,{apiBaseUrl:s.apiBaseUrl,token:l})})}return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(ef,{config:s,loginTitle:"Chengflow",loginSubtitle:"登录以管理你的 Channels",chatWindowProps:{title:"AI 助手",placeholder:"输入消息...",height:"100vh"}})})}const wd=document.getElementById("root");if(!wd)throw new Error("Root element not found");const of=Cp.createRoot(wd);of.render(n.jsx(bp.StrictMode,{children:n.jsx(rf,{})}));
