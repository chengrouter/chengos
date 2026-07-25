(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))u(p);new MutationObserver(p=>{for(const h of p)if(h.type==="childList")for(const m of h.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&u(m)}).observe(document,{childList:!0,subtree:!0});function s(p){const h={};return p.integrity&&(h.integrity=p.integrity),p.referrerPolicy&&(h.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?h.credentials="include":p.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function u(p){if(p.ep)return;p.ep=!0;const h=s(p);fetch(p.href,h)}})();function Yp(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var os={exports:{}},$r={},is={exports:{}},Pe={};var hd;function Xp(){if(hd)return Pe;hd=1;var a=Symbol.for("react.element"),i=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),m=Symbol.for("react.context"),c=Symbol.for("react.forward_ref"),x=Symbol.for("react.suspense"),y=Symbol.for("react.memo"),j=Symbol.for("react.lazy"),S=Symbol.iterator;function M(w){return w===null||typeof w!="object"?null:(w=S&&w[S]||w["@@iterator"],typeof w=="function"?w:null)}var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},O=Object.assign,K={};function I(w,k,P){this.props=w,this.context=k,this.refs=K,this.updater=P||B}I.prototype.isReactComponent={},I.prototype.setState=function(w,k){if(typeof w!="object"&&typeof w!="function"&&w!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,w,k,"setState")},I.prototype.forceUpdate=function(w){this.updater.enqueueForceUpdate(this,w,"forceUpdate")};function z(){}z.prototype=I.prototype;function $(w,k,P){this.props=w,this.context=k,this.refs=K,this.updater=P||B}var G=$.prototype=new z;G.constructor=$,O(G,I.prototype),G.isPureReactComponent=!0;var E=Array.isArray,Q=Object.prototype.hasOwnProperty,X={current:null},Y={key:!0,ref:!0,__self:!0,__source:!0};function J(w,k,P){var b,H={},T=null,W=null;if(k!=null)for(b in k.ref!==void 0&&(W=k.ref),k.key!==void 0&&(T=""+k.key),k)Q.call(k,b)&&!Y.hasOwnProperty(b)&&(H[b]=k[b]);var R=arguments.length-2;if(R===1)H.children=P;else if(1<R){for(var F=Array(R),he=0;he<R;he++)F[he]=arguments[he+2];H.children=F}if(w&&w.defaultProps)for(b in R=w.defaultProps,R)H[b]===void 0&&(H[b]=R[b]);return{$$typeof:a,type:w,key:T,ref:W,props:H,_owner:X.current}}function de(w,k){return{$$typeof:a,type:w.type,key:k,ref:w.ref,props:w.props,_owner:w._owner}}function se(w){return typeof w=="object"&&w!==null&&w.$$typeof===a}function ue(w){var k={"=":"=0",":":"=2"};return"$"+w.replace(/[=:]/g,function(P){return k[P]})}var V=/\/+/g;function ce(w,k){return typeof w=="object"&&w!==null&&w.key!=null?ue(""+w.key):k.toString(36)}function re(w,k,P,b,H){var T=typeof w;(T==="undefined"||T==="boolean")&&(w=null);var W=!1;if(w===null)W=!0;else switch(T){case"string":case"number":W=!0;break;case"object":switch(w.$$typeof){case a:case i:W=!0}}if(W)return W=w,H=H(W),w=b===""?"."+ce(W,0):b,E(H)?(P="",w!=null&&(P=w.replace(V,"$&/")+"/"),re(H,k,P,"",function(he){return he})):H!=null&&(se(H)&&(H=de(H,P+(!H.key||W&&W.key===H.key?"":(""+H.key).replace(V,"$&/")+"/")+w)),k.push(H)),1;if(W=0,b=b===""?".":b+":",E(w))for(var R=0;R<w.length;R++){T=w[R];var F=b+ce(T,R);W+=re(T,k,P,F,H)}else if(F=M(w),typeof F=="function")for(w=F.call(w),R=0;!(T=w.next()).done;)T=T.value,F=b+ce(T,R++),W+=re(T,k,P,F,H);else if(T==="object")throw k=String(w),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(w).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.");return W}function _e(w,k,P){if(w==null)return w;var b=[],H=0;return re(w,b,"","",function(T){return k.call(P,T,H++)}),b}function ae(w){if(w._status===-1){var k=w._result;k=k(),k.then(function(P){(w._status===0||w._status===-1)&&(w._status=1,w._result=P)},function(P){(w._status===0||w._status===-1)&&(w._status=2,w._result=P)}),w._status===-1&&(w._status=0,w._result=k)}if(w._status===1)return w._result.default;throw w._result}var te={current:null},C={transition:null},q={ReactCurrentDispatcher:te,ReactCurrentBatchConfig:C,ReactCurrentOwner:X};function A(){throw Error("act(...) is not supported in production builds of React.")}return Pe.Children={map:_e,forEach:function(w,k,P){_e(w,function(){k.apply(this,arguments)},P)},count:function(w){var k=0;return _e(w,function(){k++}),k},toArray:function(w){return _e(w,function(k){return k})||[]},only:function(w){if(!se(w))throw Error("React.Children.only expected to receive a single React element child.");return w}},Pe.Component=I,Pe.Fragment=s,Pe.Profiler=p,Pe.PureComponent=$,Pe.StrictMode=u,Pe.Suspense=x,Pe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=q,Pe.act=A,Pe.cloneElement=function(w,k,P){if(w==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+w+".");var b=O({},w.props),H=w.key,T=w.ref,W=w._owner;if(k!=null){if(k.ref!==void 0&&(T=k.ref,W=X.current),k.key!==void 0&&(H=""+k.key),w.type&&w.type.defaultProps)var R=w.type.defaultProps;for(F in k)Q.call(k,F)&&!Y.hasOwnProperty(F)&&(b[F]=k[F]===void 0&&R!==void 0?R[F]:k[F])}var F=arguments.length-2;if(F===1)b.children=P;else if(1<F){R=Array(F);for(var he=0;he<F;he++)R[he]=arguments[he+2];b.children=R}return{$$typeof:a,type:w.type,key:H,ref:T,props:b,_owner:W}},Pe.createContext=function(w){return w={$$typeof:m,_currentValue:w,_currentValue2:w,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},w.Provider={$$typeof:h,_context:w},w.Consumer=w},Pe.createElement=J,Pe.createFactory=function(w){var k=J.bind(null,w);return k.type=w,k},Pe.createRef=function(){return{current:null}},Pe.forwardRef=function(w){return{$$typeof:c,render:w}},Pe.isValidElement=se,Pe.lazy=function(w){return{$$typeof:j,_payload:{_status:-1,_result:w},_init:ae}},Pe.memo=function(w,k){return{$$typeof:y,type:w,compare:k===void 0?null:k}},Pe.startTransition=function(w){var k=C.transition;C.transition={};try{w()}finally{C.transition=k}},Pe.unstable_act=A,Pe.useCallback=function(w,k){return te.current.useCallback(w,k)},Pe.useContext=function(w){return te.current.useContext(w)},Pe.useDebugValue=function(){},Pe.useDeferredValue=function(w){return te.current.useDeferredValue(w)},Pe.useEffect=function(w,k){return te.current.useEffect(w,k)},Pe.useId=function(){return te.current.useId()},Pe.useImperativeHandle=function(w,k,P){return te.current.useImperativeHandle(w,k,P)},Pe.useInsertionEffect=function(w,k){return te.current.useInsertionEffect(w,k)},Pe.useLayoutEffect=function(w,k){return te.current.useLayoutEffect(w,k)},Pe.useMemo=function(w,k){return te.current.useMemo(w,k)},Pe.useReducer=function(w,k,P){return te.current.useReducer(w,k,P)},Pe.useRef=function(w){return te.current.useRef(w)},Pe.useState=function(w){return te.current.useState(w)},Pe.useSyncExternalStore=function(w,k,P){return te.current.useSyncExternalStore(w,k,P)},Pe.useTransition=function(){return te.current.useTransition()},Pe.version="18.3.1",Pe}var gd;function bs(){return gd||(gd=1,is.exports=Xp()),is.exports}var fd;function Jp(){if(fd)return $r;fd=1;var a=bs(),i=Symbol.for("react.element"),s=Symbol.for("react.fragment"),u=Object.prototype.hasOwnProperty,p=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function m(c,x,y){var j,S={},M=null,B=null;y!==void 0&&(M=""+y),x.key!==void 0&&(M=""+x.key),x.ref!==void 0&&(B=x.ref);for(j in x)u.call(x,j)&&!h.hasOwnProperty(j)&&(S[j]=x[j]);if(c&&c.defaultProps)for(j in x=c.defaultProps,x)S[j]===void 0&&(S[j]=x[j]);return{$$typeof:i,type:c,key:M,ref:B,props:S,_owner:p.current}}return $r.Fragment=s,$r.jsx=m,$r.jsxs=m,$r}var md;function Zp(){return md||(md=1,os.exports=Jp()),os.exports}var n=Zp(),g=bs();const eh=Yp(g);var oi={},as={exports:{}},mt={},ss={exports:{}},cs={};var xd;function th(){return xd||(xd=1,(function(a){function i(C,q){var A=C.length;C.push(q);e:for(;0<A;){var w=A-1>>>1,k=C[w];if(0<p(k,q))C[w]=q,C[A]=k,A=w;else break e}}function s(C){return C.length===0?null:C[0]}function u(C){if(C.length===0)return null;var q=C[0],A=C.pop();if(A!==q){C[0]=A;e:for(var w=0,k=C.length,P=k>>>1;w<P;){var b=2*(w+1)-1,H=C[b],T=b+1,W=C[T];if(0>p(H,A))T<k&&0>p(W,H)?(C[w]=W,C[T]=A,w=T):(C[w]=H,C[b]=A,w=b);else if(T<k&&0>p(W,A))C[w]=W,C[T]=A,w=T;else break e}}return q}function p(C,q){var A=C.sortIndex-q.sortIndex;return A!==0?A:C.id-q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;a.unstable_now=function(){return h.now()}}else{var m=Date,c=m.now();a.unstable_now=function(){return m.now()-c}}var x=[],y=[],j=1,S=null,M=3,B=!1,O=!1,K=!1,I=typeof setTimeout=="function"?setTimeout:null,z=typeof clearTimeout=="function"?clearTimeout:null,$=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(C){for(var q=s(y);q!==null;){if(q.callback===null)u(y);else if(q.startTime<=C)u(y),q.sortIndex=q.expirationTime,i(x,q);else break;q=s(y)}}function E(C){if(K=!1,G(C),!O)if(s(x)!==null)O=!0,ae(Q);else{var q=s(y);q!==null&&te(E,q.startTime-C)}}function Q(C,q){O=!1,K&&(K=!1,z(J),J=-1),B=!0;var A=M;try{for(G(q),S=s(x);S!==null&&(!(S.expirationTime>q)||C&&!ue());){var w=S.callback;if(typeof w=="function"){S.callback=null,M=S.priorityLevel;var k=w(S.expirationTime<=q);q=a.unstable_now(),typeof k=="function"?S.callback=k:S===s(x)&&u(x),G(q)}else u(x);S=s(x)}if(S!==null)var P=!0;else{var b=s(y);b!==null&&te(E,b.startTime-q),P=!1}return P}finally{S=null,M=A,B=!1}}var X=!1,Y=null,J=-1,de=5,se=-1;function ue(){return!(a.unstable_now()-se<de)}function V(){if(Y!==null){var C=a.unstable_now();se=C;var q=!0;try{q=Y(!0,C)}finally{q?ce():(X=!1,Y=null)}}else X=!1}var ce;if(typeof $=="function")ce=function(){$(V)};else if(typeof MessageChannel<"u"){var re=new MessageChannel,_e=re.port2;re.port1.onmessage=V,ce=function(){_e.postMessage(null)}}else ce=function(){I(V,0)};function ae(C){Y=C,X||(X=!0,ce())}function te(C,q){J=I(function(){C(a.unstable_now())},q)}a.unstable_IdlePriority=5,a.unstable_ImmediatePriority=1,a.unstable_LowPriority=4,a.unstable_NormalPriority=3,a.unstable_Profiling=null,a.unstable_UserBlockingPriority=2,a.unstable_cancelCallback=function(C){C.callback=null},a.unstable_continueExecution=function(){O||B||(O=!0,ae(Q))},a.unstable_forceFrameRate=function(C){0>C||125<C?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):de=0<C?Math.floor(1e3/C):5},a.unstable_getCurrentPriorityLevel=function(){return M},a.unstable_getFirstCallbackNode=function(){return s(x)},a.unstable_next=function(C){switch(M){case 1:case 2:case 3:var q=3;break;default:q=M}var A=M;M=q;try{return C()}finally{M=A}},a.unstable_pauseExecution=function(){},a.unstable_requestPaint=function(){},a.unstable_runWithPriority=function(C,q){switch(C){case 1:case 2:case 3:case 4:case 5:break;default:C=3}var A=M;M=C;try{return q()}finally{M=A}},a.unstable_scheduleCallback=function(C,q,A){var w=a.unstable_now();switch(typeof A=="object"&&A!==null?(A=A.delay,A=typeof A=="number"&&0<A?w+A:w):A=w,C){case 1:var k=-1;break;case 2:k=250;break;case 5:k=1073741823;break;case 4:k=1e4;break;default:k=5e3}return k=A+k,C={id:j++,callback:q,priorityLevel:C,startTime:A,expirationTime:k,sortIndex:-1},A>w?(C.sortIndex=A,i(y,C),s(x)===null&&C===s(y)&&(K?(z(J),J=-1):K=!0,te(E,A-w))):(C.sortIndex=k,i(x,C),O||B||(O=!0,ae(Q))),C},a.unstable_shouldYield=ue,a.unstable_wrapCallback=function(C){var q=M;return function(){var A=M;M=q;try{return C.apply(this,arguments)}finally{M=A}}}})(cs)),cs}var _d;function nh(){return _d||(_d=1,ss.exports=th()),ss.exports}var wd;function rh(){if(wd)return mt;wd=1;var a=bs(),i=nh();function s(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var u=new Set,p={};function h(e,t){m(e,t),m(e+"Capture",t)}function m(e,t){for(p[e]=t,e=0;e<t.length;e++)u.add(t[e])}var c=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),x=Object.prototype.hasOwnProperty,y=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,j={},S={};function M(e){return x.call(S,e)?!0:x.call(j,e)?!1:y.test(e)?S[e]=!0:(j[e]=!0,!1)}function B(e,t,r,o){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function O(e,t,r,o){if(t===null||typeof t>"u"||B(e,t,r,o))return!0;if(o)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function K(e,t,r,o,l,d,f){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=l,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=d,this.removeEmptyString=f}var I={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){I[e]=new K(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];I[t]=new K(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){I[e]=new K(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){I[e]=new K(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){I[e]=new K(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){I[e]=new K(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){I[e]=new K(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){I[e]=new K(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){I[e]=new K(e,5,!1,e.toLowerCase(),null,!1,!1)});var z=/[\-:]([a-z])/g;function $(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(z,$);I[t]=new K(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(z,$);I[t]=new K(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(z,$);I[t]=new K(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){I[e]=new K(e,1,!1,e.toLowerCase(),null,!1,!1)}),I.xlinkHref=new K("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){I[e]=new K(e,1,!1,e.toLowerCase(),null,!0,!0)});function G(e,t,r,o){var l=I.hasOwnProperty(t)?I[t]:null;(l!==null?l.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(O(t,r,l,o)&&(r=null),o||l===null?M(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):l.mustUseProperty?e[l.propertyName]=r===null?l.type===3?!1:"":r:(t=l.attributeName,o=l.attributeNamespace,r===null?e.removeAttribute(t):(l=l.type,r=l===3||l===4&&r===!0?"":""+r,o?e.setAttributeNS(o,t,r):e.setAttribute(t,r))))}var E=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Q=Symbol.for("react.element"),X=Symbol.for("react.portal"),Y=Symbol.for("react.fragment"),J=Symbol.for("react.strict_mode"),de=Symbol.for("react.profiler"),se=Symbol.for("react.provider"),ue=Symbol.for("react.context"),V=Symbol.for("react.forward_ref"),ce=Symbol.for("react.suspense"),re=Symbol.for("react.suspense_list"),_e=Symbol.for("react.memo"),ae=Symbol.for("react.lazy"),te=Symbol.for("react.offscreen"),C=Symbol.iterator;function q(e){return e===null||typeof e!="object"?null:(e=C&&e[C]||e["@@iterator"],typeof e=="function"?e:null)}var A=Object.assign,w;function k(e){if(w===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);w=t&&t[1]||""}return`
`+w+e}var P=!1;function b(e,t){if(!e||P)return"";P=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(U){var o=U}Reflect.construct(e,[],t)}else{try{t.call()}catch(U){o=U}e.call(t.prototype)}else{try{throw Error()}catch(U){o=U}e()}}catch(U){if(U&&o&&typeof U.stack=="string"){for(var l=U.stack.split(`
`),d=o.stack.split(`
`),f=l.length-1,_=d.length-1;1<=f&&0<=_&&l[f]!==d[_];)_--;for(;1<=f&&0<=_;f--,_--)if(l[f]!==d[_]){if(f!==1||_!==1)do if(f--,_--,0>_||l[f]!==d[_]){var v=`
`+l[f].replace(" at new "," at ");return e.displayName&&v.includes("<anonymous>")&&(v=v.replace("<anonymous>",e.displayName)),v}while(1<=f&&0<=_);break}}}finally{P=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?k(e):""}function H(e){switch(e.tag){case 5:return k(e.type);case 16:return k("Lazy");case 13:return k("Suspense");case 19:return k("SuspenseList");case 0:case 2:case 15:return e=b(e.type,!1),e;case 11:return e=b(e.type.render,!1),e;case 1:return e=b(e.type,!0),e;default:return""}}function T(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Y:return"Fragment";case X:return"Portal";case de:return"Profiler";case J:return"StrictMode";case ce:return"Suspense";case re:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ue:return(e.displayName||"Context")+".Consumer";case se:return(e._context.displayName||"Context")+".Provider";case V:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case _e:return t=e.displayName||null,t!==null?t:T(e.type)||"Memo";case ae:t=e._payload,e=e._init;try{return T(e(t))}catch{}}return null}function W(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return T(t);case 8:return t===J?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function R(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function F(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function he(e){var t=F(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var l=r.get,d=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(f){o=""+f,d.call(this,f)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return o},setValue:function(f){o=""+f},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ke(e){e._valueTracker||(e._valueTracker=he(e))}function we(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),o="";return e&&(o=F(e)?e.checked?"true":"false":e.value),e=o,e!==r?(t.setValue(e),!0):!1}function Te(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Qe(e,t){var r=t.checked;return A({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function Se(e,t){var r=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;r=R(t.value!=null?t.value:r),e._wrapperState={initialChecked:o,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function pe(e,t){t=t.checked,t!=null&&G(e,"checked",t,!1)}function oe(e,t){pe(e,t);var r=R(t.value),o=t.type;if(r!=null)o==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Le(e,t.type,r):t.hasOwnProperty("defaultValue")&&Le(e,t.type,R(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ne(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function Le(e,t,r){(t!=="number"||Te(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var Ke=Array.isArray;function ct(e,t,r,o){if(e=e.options,t){t={};for(var l=0;l<r.length;l++)t["$"+r[l]]=!0;for(r=0;r<e.length;r++)l=t.hasOwnProperty("$"+e[r].value),e[r].selected!==l&&(e[r].selected=l),l&&o&&(e[r].defaultSelected=!0)}else{for(r=""+R(r),t=null,l=0;l<e.length;l++){if(e[l].value===r){e[l].selected=!0,o&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Tn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(s(91));return A({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function vs(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(s(92));if(Ke(r)){if(1<r.length)throw Error(s(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:R(r)}}function Ss(e,t){var r=R(t.value),o=R(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),o!=null&&(e.defaultValue=""+o)}function js(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Cs(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function fi(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Cs(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Qr,Ns=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,o,l){MSApp.execUnsafeLocalFunction(function(){return e(t,r,o,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Qr=Qr||document.createElement("div"),Qr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Qr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ar(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var sr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},eu=["Webkit","ms","Moz","O"];Object.keys(sr).forEach(function(e){eu.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),sr[t]=sr[e]})});function Ps(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||sr.hasOwnProperty(e)&&sr[e]?(""+t).trim():t+"px"}function Is(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var o=r.indexOf("--")===0,l=Ps(r,t[r],o);r==="float"&&(r="cssFloat"),o?e.setProperty(r,l):e[r]=l}}var tu=A({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function mi(e,t){if(t){if(tu[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(s(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(s(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(s(61))}if(t.style!=null&&typeof t.style!="object")throw Error(s(62))}}function xi(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var _i=null;function wi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var bi=null,Ln=null,Rn=null;function Es(e){if(e=Ir(e)){if(typeof bi!="function")throw Error(s(280));var t=e.stateNode;t&&(t=wo(t),bi(e.stateNode,e.type,t))}}function As(e){Ln?Rn?Rn.push(e):Rn=[e]:Ln=e}function Ts(){if(Ln){var e=Ln,t=Rn;if(Rn=Ln=null,Es(e),t)for(e=0;e<t.length;e++)Es(t[e])}}function Ls(e,t){return e(t)}function Rs(){}var ki=!1;function Ms(e,t,r){if(ki)return e(t,r);ki=!0;try{return Ls(e,t,r)}finally{ki=!1,(Ln!==null||Rn!==null)&&(Rs(),Ts())}}function cr(e,t){var r=e.stateNode;if(r===null)return null;var o=wo(r);if(o===null)return null;r=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(s(231,t,typeof r));return r}var yi=!1;if(c)try{var lr={};Object.defineProperty(lr,"passive",{get:function(){yi=!0}}),window.addEventListener("test",lr,lr),window.removeEventListener("test",lr,lr)}catch{yi=!1}function nu(e,t,r,o,l,d,f,_,v){var U=Array.prototype.slice.call(arguments,3);try{t.apply(r,U)}catch(ee){this.onError(ee)}}var dr=!1,Yr=null,Xr=!1,vi=null,ru={onError:function(e){dr=!0,Yr=e}};function ou(e,t,r,o,l,d,f,_,v){dr=!1,Yr=null,nu.apply(ru,arguments)}function iu(e,t,r,o,l,d,f,_,v){if(ou.apply(this,arguments),dr){if(dr){var U=Yr;dr=!1,Yr=null}else throw Error(s(198));Xr||(Xr=!0,vi=U)}}function mn(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function zs(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ds(e){if(mn(e)!==e)throw Error(s(188))}function au(e){var t=e.alternate;if(!t){if(t=mn(e),t===null)throw Error(s(188));return t!==e?null:e}for(var r=e,o=t;;){var l=r.return;if(l===null)break;var d=l.alternate;if(d===null){if(o=l.return,o!==null){r=o;continue}break}if(l.child===d.child){for(d=l.child;d;){if(d===r)return Ds(l),e;if(d===o)return Ds(l),t;d=d.sibling}throw Error(s(188))}if(r.return!==o.return)r=l,o=d;else{for(var f=!1,_=l.child;_;){if(_===r){f=!0,r=l,o=d;break}if(_===o){f=!0,o=l,r=d;break}_=_.sibling}if(!f){for(_=d.child;_;){if(_===r){f=!0,r=d,o=l;break}if(_===o){f=!0,o=d,r=l;break}_=_.sibling}if(!f)throw Error(s(189))}}if(r.alternate!==o)throw Error(s(190))}if(r.tag!==3)throw Error(s(188));return r.stateNode.current===r?e:t}function Ws(e){return e=au(e),e!==null?Fs(e):null}function Fs(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Fs(e);if(t!==null)return t;e=e.sibling}return null}var Os=i.unstable_scheduleCallback,Us=i.unstable_cancelCallback,su=i.unstable_shouldYield,cu=i.unstable_requestPaint,Ve=i.unstable_now,lu=i.unstable_getCurrentPriorityLevel,Si=i.unstable_ImmediatePriority,Bs=i.unstable_UserBlockingPriority,Jr=i.unstable_NormalPriority,du=i.unstable_LowPriority,Hs=i.unstable_IdlePriority,Zr=null,zt=null;function uu(e){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(Zr,e,void 0,(e.current.flags&128)===128)}catch{}}var It=Math.clz32?Math.clz32:gu,pu=Math.log,hu=Math.LN2;function gu(e){return e>>>=0,e===0?32:31-(pu(e)/hu|0)|0}var eo=64,to=4194304;function ur(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function no(e,t){var r=e.pendingLanes;if(r===0)return 0;var o=0,l=e.suspendedLanes,d=e.pingedLanes,f=r&268435455;if(f!==0){var _=f&~l;_!==0?o=ur(_):(d&=f,d!==0&&(o=ur(d)))}else f=r&~l,f!==0?o=ur(f):d!==0&&(o=ur(d));if(o===0)return 0;if(t!==0&&t!==o&&(t&l)===0&&(l=o&-o,d=t&-t,l>=d||l===16&&(d&4194240)!==0))return t;if((o&4)!==0&&(o|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)r=31-It(t),l=1<<r,o|=e[r],t&=~l;return o}function fu(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function mu(e,t){for(var r=e.suspendedLanes,o=e.pingedLanes,l=e.expirationTimes,d=e.pendingLanes;0<d;){var f=31-It(d),_=1<<f,v=l[f];v===-1?((_&r)===0||(_&o)!==0)&&(l[f]=fu(_,t)):v<=t&&(e.expiredLanes|=_),d&=~_}}function ji(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function $s(){var e=eo;return eo<<=1,(eo&4194240)===0&&(eo=64),e}function Ci(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function pr(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-It(t),e[t]=r}function xu(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<r;){var l=31-It(r),d=1<<l;t[l]=0,o[l]=-1,e[l]=-1,r&=~d}}function Ni(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var o=31-It(r),l=1<<o;l&t|e[o]&t&&(e[o]|=t),r&=~l}}var Re=0;function Ks(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Vs,Pi,Gs,qs,Qs,Ii=!1,ro=[],Qt=null,Yt=null,Xt=null,hr=new Map,gr=new Map,Jt=[],_u="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ys(e,t){switch(e){case"focusin":case"focusout":Qt=null;break;case"dragenter":case"dragleave":Yt=null;break;case"mouseover":case"mouseout":Xt=null;break;case"pointerover":case"pointerout":hr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":gr.delete(t.pointerId)}}function fr(e,t,r,o,l,d){return e===null||e.nativeEvent!==d?(e={blockedOn:t,domEventName:r,eventSystemFlags:o,nativeEvent:d,targetContainers:[l]},t!==null&&(t=Ir(t),t!==null&&Pi(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function wu(e,t,r,o,l){switch(t){case"focusin":return Qt=fr(Qt,e,t,r,o,l),!0;case"dragenter":return Yt=fr(Yt,e,t,r,o,l),!0;case"mouseover":return Xt=fr(Xt,e,t,r,o,l),!0;case"pointerover":var d=l.pointerId;return hr.set(d,fr(hr.get(d)||null,e,t,r,o,l)),!0;case"gotpointercapture":return d=l.pointerId,gr.set(d,fr(gr.get(d)||null,e,t,r,o,l)),!0}return!1}function Xs(e){var t=xn(e.target);if(t!==null){var r=mn(t);if(r!==null){if(t=r.tag,t===13){if(t=zs(r),t!==null){e.blockedOn=t,Qs(e.priority,function(){Gs(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function oo(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=Ai(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var o=new r.constructor(r.type,r);_i=o,r.target.dispatchEvent(o),_i=null}else return t=Ir(r),t!==null&&Pi(t),e.blockedOn=r,!1;t.shift()}return!0}function Js(e,t,r){oo(e)&&r.delete(t)}function bu(){Ii=!1,Qt!==null&&oo(Qt)&&(Qt=null),Yt!==null&&oo(Yt)&&(Yt=null),Xt!==null&&oo(Xt)&&(Xt=null),hr.forEach(Js),gr.forEach(Js)}function mr(e,t){e.blockedOn===t&&(e.blockedOn=null,Ii||(Ii=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,bu)))}function xr(e){function t(l){return mr(l,e)}if(0<ro.length){mr(ro[0],e);for(var r=1;r<ro.length;r++){var o=ro[r];o.blockedOn===e&&(o.blockedOn=null)}}for(Qt!==null&&mr(Qt,e),Yt!==null&&mr(Yt,e),Xt!==null&&mr(Xt,e),hr.forEach(t),gr.forEach(t),r=0;r<Jt.length;r++)o=Jt[r],o.blockedOn===e&&(o.blockedOn=null);for(;0<Jt.length&&(r=Jt[0],r.blockedOn===null);)Xs(r),r.blockedOn===null&&Jt.shift()}var Mn=E.ReactCurrentBatchConfig,io=!0;function ku(e,t,r,o){var l=Re,d=Mn.transition;Mn.transition=null;try{Re=1,Ei(e,t,r,o)}finally{Re=l,Mn.transition=d}}function yu(e,t,r,o){var l=Re,d=Mn.transition;Mn.transition=null;try{Re=4,Ei(e,t,r,o)}finally{Re=l,Mn.transition=d}}function Ei(e,t,r,o){if(io){var l=Ai(e,t,r,o);if(l===null)qi(e,t,o,ao,r),Ys(e,o);else if(wu(l,e,t,r,o))o.stopPropagation();else if(Ys(e,o),t&4&&-1<_u.indexOf(e)){for(;l!==null;){var d=Ir(l);if(d!==null&&Vs(d),d=Ai(e,t,r,o),d===null&&qi(e,t,o,ao,r),d===l)break;l=d}l!==null&&o.stopPropagation()}else qi(e,t,o,null,r)}}var ao=null;function Ai(e,t,r,o){if(ao=null,e=wi(o),e=xn(e),e!==null)if(t=mn(e),t===null)e=null;else if(r=t.tag,r===13){if(e=zs(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ao=e,null}function Zs(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(lu()){case Si:return 1;case Bs:return 4;case Jr:case du:return 16;case Hs:return 536870912;default:return 16}default:return 16}}var Zt=null,Ti=null,so=null;function ec(){if(so)return so;var e,t=Ti,r=t.length,o,l="value"in Zt?Zt.value:Zt.textContent,d=l.length;for(e=0;e<r&&t[e]===l[e];e++);var f=r-e;for(o=1;o<=f&&t[r-o]===l[d-o];o++);return so=l.slice(e,1<o?1-o:void 0)}function co(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function lo(){return!0}function tc(){return!1}function xt(e){function t(r,o,l,d,f){this._reactName=r,this._targetInst=l,this.type=o,this.nativeEvent=d,this.target=f,this.currentTarget=null;for(var _ in e)e.hasOwnProperty(_)&&(r=e[_],this[_]=r?r(d):d[_]);return this.isDefaultPrevented=(d.defaultPrevented!=null?d.defaultPrevented:d.returnValue===!1)?lo:tc,this.isPropagationStopped=tc,this}return A(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=lo)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=lo)},persist:function(){},isPersistent:lo}),t}var zn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Li=xt(zn),_r=A({},zn,{view:0,detail:0}),vu=xt(_r),Ri,Mi,wr,uo=A({},_r,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Di,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==wr&&(wr&&e.type==="mousemove"?(Ri=e.screenX-wr.screenX,Mi=e.screenY-wr.screenY):Mi=Ri=0,wr=e),Ri)},movementY:function(e){return"movementY"in e?e.movementY:Mi}}),nc=xt(uo),Su=A({},uo,{dataTransfer:0}),ju=xt(Su),Cu=A({},_r,{relatedTarget:0}),zi=xt(Cu),Nu=A({},zn,{animationName:0,elapsedTime:0,pseudoElement:0}),Pu=xt(Nu),Iu=A({},zn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Eu=xt(Iu),Au=A({},zn,{data:0}),rc=xt(Au),Tu={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Lu={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ru={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Mu(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Ru[e])?!!t[e]:!1}function Di(){return Mu}var zu=A({},_r,{key:function(e){if(e.key){var t=Tu[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=co(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Lu[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Di,charCode:function(e){return e.type==="keypress"?co(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?co(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Du=xt(zu),Wu=A({},uo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),oc=xt(Wu),Fu=A({},_r,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Di}),Ou=xt(Fu),Uu=A({},zn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Bu=xt(Uu),Hu=A({},uo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),$u=xt(Hu),Ku=[9,13,27,32],Wi=c&&"CompositionEvent"in window,br=null;c&&"documentMode"in document&&(br=document.documentMode);var Vu=c&&"TextEvent"in window&&!br,ic=c&&(!Wi||br&&8<br&&11>=br),ac=" ",sc=!1;function cc(e,t){switch(e){case"keyup":return Ku.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function lc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Dn=!1;function Gu(e,t){switch(e){case"compositionend":return lc(t);case"keypress":return t.which!==32?null:(sc=!0,ac);case"textInput":return e=t.data,e===ac&&sc?null:e;default:return null}}function qu(e,t){if(Dn)return e==="compositionend"||!Wi&&cc(e,t)?(e=ec(),so=Ti=Zt=null,Dn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return ic&&t.locale!=="ko"?null:t.data;default:return null}}var Qu={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function dc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Qu[e.type]:t==="textarea"}function uc(e,t,r,o){As(o),t=mo(t,"onChange"),0<t.length&&(r=new Li("onChange","change",null,r,o),e.push({event:r,listeners:t}))}var kr=null,yr=null;function Yu(e){Ic(e,0)}function po(e){var t=Bn(e);if(we(t))return e}function Xu(e,t){if(e==="change")return t}var pc=!1;if(c){var Fi;if(c){var Oi="oninput"in document;if(!Oi){var hc=document.createElement("div");hc.setAttribute("oninput","return;"),Oi=typeof hc.oninput=="function"}Fi=Oi}else Fi=!1;pc=Fi&&(!document.documentMode||9<document.documentMode)}function gc(){kr&&(kr.detachEvent("onpropertychange",fc),yr=kr=null)}function fc(e){if(e.propertyName==="value"&&po(yr)){var t=[];uc(t,yr,e,wi(e)),Ms(Yu,t)}}function Ju(e,t,r){e==="focusin"?(gc(),kr=t,yr=r,kr.attachEvent("onpropertychange",fc)):e==="focusout"&&gc()}function Zu(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return po(yr)}function ep(e,t){if(e==="click")return po(t)}function tp(e,t){if(e==="input"||e==="change")return po(t)}function np(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Et=typeof Object.is=="function"?Object.is:np;function vr(e,t){if(Et(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),o=Object.keys(t);if(r.length!==o.length)return!1;for(o=0;o<r.length;o++){var l=r[o];if(!x.call(t,l)||!Et(e[l],t[l]))return!1}return!0}function mc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function xc(e,t){var r=mc(e);e=0;for(var o;r;){if(r.nodeType===3){if(o=e+r.textContent.length,e<=t&&o>=t)return{node:r,offset:t-e};e=o}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=mc(r)}}function _c(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?_c(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function wc(){for(var e=window,t=Te();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=Te(e.document)}return t}function Ui(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function rp(e){var t=wc(),r=e.focusedElem,o=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&_c(r.ownerDocument.documentElement,r)){if(o!==null&&Ui(r)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=r.textContent.length,d=Math.min(o.start,l);o=o.end===void 0?d:Math.min(o.end,l),!e.extend&&d>o&&(l=o,o=d,d=l),l=xc(r,d);var f=xc(r,o);l&&f&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==f.node||e.focusOffset!==f.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),d>o?(e.addRange(t),e.extend(f.node,f.offset)):(t.setEnd(f.node,f.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var op=c&&"documentMode"in document&&11>=document.documentMode,Wn=null,Bi=null,Sr=null,Hi=!1;function bc(e,t,r){var o=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Hi||Wn==null||Wn!==Te(o)||(o=Wn,"selectionStart"in o&&Ui(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),Sr&&vr(Sr,o)||(Sr=o,o=mo(Bi,"onSelect"),0<o.length&&(t=new Li("onSelect","select",null,t,r),e.push({event:t,listeners:o}),t.target=Wn)))}function ho(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Fn={animationend:ho("Animation","AnimationEnd"),animationiteration:ho("Animation","AnimationIteration"),animationstart:ho("Animation","AnimationStart"),transitionend:ho("Transition","TransitionEnd")},$i={},kc={};c&&(kc=document.createElement("div").style,"AnimationEvent"in window||(delete Fn.animationend.animation,delete Fn.animationiteration.animation,delete Fn.animationstart.animation),"TransitionEvent"in window||delete Fn.transitionend.transition);function go(e){if($i[e])return $i[e];if(!Fn[e])return e;var t=Fn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in kc)return $i[e]=t[r];return e}var yc=go("animationend"),vc=go("animationiteration"),Sc=go("animationstart"),jc=go("transitionend"),Cc=new Map,Nc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function en(e,t){Cc.set(e,t),h(t,[e])}for(var Ki=0;Ki<Nc.length;Ki++){var Vi=Nc[Ki],ip=Vi.toLowerCase(),ap=Vi[0].toUpperCase()+Vi.slice(1);en(ip,"on"+ap)}en(yc,"onAnimationEnd"),en(vc,"onAnimationIteration"),en(Sc,"onAnimationStart"),en("dblclick","onDoubleClick"),en("focusin","onFocus"),en("focusout","onBlur"),en(jc,"onTransitionEnd"),m("onMouseEnter",["mouseout","mouseover"]),m("onMouseLeave",["mouseout","mouseover"]),m("onPointerEnter",["pointerout","pointerover"]),m("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var jr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),sp=new Set("cancel close invalid load scroll toggle".split(" ").concat(jr));function Pc(e,t,r){var o=e.type||"unknown-event";e.currentTarget=r,iu(o,t,void 0,e),e.currentTarget=null}function Ic(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var o=e[r],l=o.event;o=o.listeners;e:{var d=void 0;if(t)for(var f=o.length-1;0<=f;f--){var _=o[f],v=_.instance,U=_.currentTarget;if(_=_.listener,v!==d&&l.isPropagationStopped())break e;Pc(l,_,U),d=v}else for(f=0;f<o.length;f++){if(_=o[f],v=_.instance,U=_.currentTarget,_=_.listener,v!==d&&l.isPropagationStopped())break e;Pc(l,_,U),d=v}}}if(Xr)throw e=vi,Xr=!1,vi=null,e}function De(e,t){var r=t[ea];r===void 0&&(r=t[ea]=new Set);var o=e+"__bubble";r.has(o)||(Ec(t,e,2,!1),r.add(o))}function Gi(e,t,r){var o=0;t&&(o|=4),Ec(r,e,o,t)}var fo="_reactListening"+Math.random().toString(36).slice(2);function Cr(e){if(!e[fo]){e[fo]=!0,u.forEach(function(r){r!=="selectionchange"&&(sp.has(r)||Gi(r,!1,e),Gi(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[fo]||(t[fo]=!0,Gi("selectionchange",!1,t))}}function Ec(e,t,r,o){switch(Zs(t)){case 1:var l=ku;break;case 4:l=yu;break;default:l=Ei}r=l.bind(null,t,r,e),l=void 0,!yi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),o?l!==void 0?e.addEventListener(t,r,{capture:!0,passive:l}):e.addEventListener(t,r,!0):l!==void 0?e.addEventListener(t,r,{passive:l}):e.addEventListener(t,r,!1)}function qi(e,t,r,o,l){var d=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var f=o.tag;if(f===3||f===4){var _=o.stateNode.containerInfo;if(_===l||_.nodeType===8&&_.parentNode===l)break;if(f===4)for(f=o.return;f!==null;){var v=f.tag;if((v===3||v===4)&&(v=f.stateNode.containerInfo,v===l||v.nodeType===8&&v.parentNode===l))return;f=f.return}for(;_!==null;){if(f=xn(_),f===null)return;if(v=f.tag,v===5||v===6){o=d=f;continue e}_=_.parentNode}}o=o.return}Ms(function(){var U=d,ee=wi(r),ie=[];e:{var Z=Cc.get(e);if(Z!==void 0){var ge=Li,me=e;switch(e){case"keypress":if(co(r)===0)break e;case"keydown":case"keyup":ge=Du;break;case"focusin":me="focus",ge=zi;break;case"focusout":me="blur",ge=zi;break;case"beforeblur":case"afterblur":ge=zi;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ge=nc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ge=ju;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ge=Ou;break;case yc:case vc:case Sc:ge=Pu;break;case jc:ge=Bu;break;case"scroll":ge=vu;break;case"wheel":ge=$u;break;case"copy":case"cut":case"paste":ge=Eu;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ge=oc}var xe=(t&4)!==0,Ge=!xe&&e==="scroll",L=xe?Z!==null?Z+"Capture":null:Z;xe=[];for(var N=U,D;N!==null;){D=N;var le=D.stateNode;if(D.tag===5&&le!==null&&(D=le,L!==null&&(le=cr(N,L),le!=null&&xe.push(Nr(N,le,D)))),Ge)break;N=N.return}0<xe.length&&(Z=new ge(Z,me,null,r,ee),ie.push({event:Z,listeners:xe}))}}if((t&7)===0){e:{if(Z=e==="mouseover"||e==="pointerover",ge=e==="mouseout"||e==="pointerout",Z&&r!==_i&&(me=r.relatedTarget||r.fromElement)&&(xn(me)||me[Ut]))break e;if((ge||Z)&&(Z=ee.window===ee?ee:(Z=ee.ownerDocument)?Z.defaultView||Z.parentWindow:window,ge?(me=r.relatedTarget||r.toElement,ge=U,me=me?xn(me):null,me!==null&&(Ge=mn(me),me!==Ge||me.tag!==5&&me.tag!==6)&&(me=null)):(ge=null,me=U),ge!==me)){if(xe=nc,le="onMouseLeave",L="onMouseEnter",N="mouse",(e==="pointerout"||e==="pointerover")&&(xe=oc,le="onPointerLeave",L="onPointerEnter",N="pointer"),Ge=ge==null?Z:Bn(ge),D=me==null?Z:Bn(me),Z=new xe(le,N+"leave",ge,r,ee),Z.target=Ge,Z.relatedTarget=D,le=null,xn(ee)===U&&(xe=new xe(L,N+"enter",me,r,ee),xe.target=D,xe.relatedTarget=Ge,le=xe),Ge=le,ge&&me)t:{for(xe=ge,L=me,N=0,D=xe;D;D=On(D))N++;for(D=0,le=L;le;le=On(le))D++;for(;0<N-D;)xe=On(xe),N--;for(;0<D-N;)L=On(L),D--;for(;N--;){if(xe===L||L!==null&&xe===L.alternate)break t;xe=On(xe),L=On(L)}xe=null}else xe=null;ge!==null&&Ac(ie,Z,ge,xe,!1),me!==null&&Ge!==null&&Ac(ie,Ge,me,xe,!0)}}e:{if(Z=U?Bn(U):window,ge=Z.nodeName&&Z.nodeName.toLowerCase(),ge==="select"||ge==="input"&&Z.type==="file")var be=Xu;else if(dc(Z))if(pc)be=tp;else{be=Zu;var ye=Ju}else(ge=Z.nodeName)&&ge.toLowerCase()==="input"&&(Z.type==="checkbox"||Z.type==="radio")&&(be=ep);if(be&&(be=be(e,U))){uc(ie,be,r,ee);break e}ye&&ye(e,Z,U),e==="focusout"&&(ye=Z._wrapperState)&&ye.controlled&&Z.type==="number"&&Le(Z,"number",Z.value)}switch(ye=U?Bn(U):window,e){case"focusin":(dc(ye)||ye.contentEditable==="true")&&(Wn=ye,Bi=U,Sr=null);break;case"focusout":Sr=Bi=Wn=null;break;case"mousedown":Hi=!0;break;case"contextmenu":case"mouseup":case"dragend":Hi=!1,bc(ie,r,ee);break;case"selectionchange":if(op)break;case"keydown":case"keyup":bc(ie,r,ee)}var ve;if(Wi)e:{switch(e){case"compositionstart":var je="onCompositionStart";break e;case"compositionend":je="onCompositionEnd";break e;case"compositionupdate":je="onCompositionUpdate";break e}je=void 0}else Dn?cc(e,r)&&(je="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(je="onCompositionStart");je&&(ic&&r.locale!=="ko"&&(Dn||je!=="onCompositionStart"?je==="onCompositionEnd"&&Dn&&(ve=ec()):(Zt=ee,Ti="value"in Zt?Zt.value:Zt.textContent,Dn=!0)),ye=mo(U,je),0<ye.length&&(je=new rc(je,e,null,r,ee),ie.push({event:je,listeners:ye}),ve?je.data=ve:(ve=lc(r),ve!==null&&(je.data=ve)))),(ve=Vu?Gu(e,r):qu(e,r))&&(U=mo(U,"onBeforeInput"),0<U.length&&(ee=new rc("onBeforeInput","beforeinput",null,r,ee),ie.push({event:ee,listeners:U}),ee.data=ve))}Ic(ie,t)})}function Nr(e,t,r){return{instance:e,listener:t,currentTarget:r}}function mo(e,t){for(var r=t+"Capture",o=[];e!==null;){var l=e,d=l.stateNode;l.tag===5&&d!==null&&(l=d,d=cr(e,r),d!=null&&o.unshift(Nr(e,d,l)),d=cr(e,t),d!=null&&o.push(Nr(e,d,l))),e=e.return}return o}function On(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ac(e,t,r,o,l){for(var d=t._reactName,f=[];r!==null&&r!==o;){var _=r,v=_.alternate,U=_.stateNode;if(v!==null&&v===o)break;_.tag===5&&U!==null&&(_=U,l?(v=cr(r,d),v!=null&&f.unshift(Nr(r,v,_))):l||(v=cr(r,d),v!=null&&f.push(Nr(r,v,_)))),r=r.return}f.length!==0&&e.push({event:t,listeners:f})}var cp=/\r\n?/g,lp=/\u0000|\uFFFD/g;function Tc(e){return(typeof e=="string"?e:""+e).replace(cp,`
`).replace(lp,"")}function xo(e,t,r){if(t=Tc(t),Tc(e)!==t&&r)throw Error(s(425))}function _o(){}var Qi=null,Yi=null;function Xi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ji=typeof setTimeout=="function"?setTimeout:void 0,dp=typeof clearTimeout=="function"?clearTimeout:void 0,Lc=typeof Promise=="function"?Promise:void 0,up=typeof queueMicrotask=="function"?queueMicrotask:typeof Lc<"u"?function(e){return Lc.resolve(null).then(e).catch(pp)}:Ji;function pp(e){setTimeout(function(){throw e})}function Zi(e,t){var r=t,o=0;do{var l=r.nextSibling;if(e.removeChild(r),l&&l.nodeType===8)if(r=l.data,r==="/$"){if(o===0){e.removeChild(l),xr(t);return}o--}else r!=="$"&&r!=="$?"&&r!=="$!"||o++;r=l}while(r);xr(t)}function tn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Rc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var Un=Math.random().toString(36).slice(2),Dt="__reactFiber$"+Un,Pr="__reactProps$"+Un,Ut="__reactContainer$"+Un,ea="__reactEvents$"+Un,hp="__reactListeners$"+Un,gp="__reactHandles$"+Un;function xn(e){var t=e[Dt];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Ut]||r[Dt]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=Rc(e);e!==null;){if(r=e[Dt])return r;e=Rc(e)}return t}e=r,r=e.parentNode}return null}function Ir(e){return e=e[Dt]||e[Ut],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Bn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(s(33))}function wo(e){return e[Pr]||null}var ta=[],Hn=-1;function nn(e){return{current:e}}function We(e){0>Hn||(e.current=ta[Hn],ta[Hn]=null,Hn--)}function ze(e,t){Hn++,ta[Hn]=e.current,e.current=t}var rn={},ot=nn(rn),ut=nn(!1),_n=rn;function $n(e,t){var r=e.type.contextTypes;if(!r)return rn;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var l={},d;for(d in r)l[d]=t[d];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function pt(e){return e=e.childContextTypes,e!=null}function bo(){We(ut),We(ot)}function Mc(e,t,r){if(ot.current!==rn)throw Error(s(168));ze(ot,t),ze(ut,r)}function zc(e,t,r){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return r;o=o.getChildContext();for(var l in o)if(!(l in t))throw Error(s(108,W(e)||"Unknown",l));return A({},r,o)}function ko(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||rn,_n=ot.current,ze(ot,e),ze(ut,ut.current),!0}function Dc(e,t,r){var o=e.stateNode;if(!o)throw Error(s(169));r?(e=zc(e,t,_n),o.__reactInternalMemoizedMergedChildContext=e,We(ut),We(ot),ze(ot,e)):We(ut),ze(ut,r)}var Bt=null,yo=!1,na=!1;function Wc(e){Bt===null?Bt=[e]:Bt.push(e)}function fp(e){yo=!0,Wc(e)}function on(){if(!na&&Bt!==null){na=!0;var e=0,t=Re;try{var r=Bt;for(Re=1;e<r.length;e++){var o=r[e];do o=o(!0);while(o!==null)}Bt=null,yo=!1}catch(l){throw Bt!==null&&(Bt=Bt.slice(e+1)),Os(Si,on),l}finally{Re=t,na=!1}}return null}var Kn=[],Vn=0,vo=null,So=0,yt=[],vt=0,wn=null,Ht=1,$t="";function bn(e,t){Kn[Vn++]=So,Kn[Vn++]=vo,vo=e,So=t}function Fc(e,t,r){yt[vt++]=Ht,yt[vt++]=$t,yt[vt++]=wn,wn=e;var o=Ht;e=$t;var l=32-It(o)-1;o&=~(1<<l),r+=1;var d=32-It(t)+l;if(30<d){var f=l-l%5;d=(o&(1<<f)-1).toString(32),o>>=f,l-=f,Ht=1<<32-It(t)+l|r<<l|o,$t=d+e}else Ht=1<<d|r<<l|o,$t=e}function ra(e){e.return!==null&&(bn(e,1),Fc(e,1,0))}function oa(e){for(;e===vo;)vo=Kn[--Vn],Kn[Vn]=null,So=Kn[--Vn],Kn[Vn]=null;for(;e===wn;)wn=yt[--vt],yt[vt]=null,$t=yt[--vt],yt[vt]=null,Ht=yt[--vt],yt[vt]=null}var _t=null,wt=null,Fe=!1,At=null;function Oc(e,t){var r=Nt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function Uc(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,_t=e,wt=tn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,_t=e,wt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=wn!==null?{id:Ht,overflow:$t}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=Nt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,_t=e,wt=null,!0):!1;default:return!1}}function ia(e){return(e.mode&1)!==0&&(e.flags&128)===0}function aa(e){if(Fe){var t=wt;if(t){var r=t;if(!Uc(e,t)){if(ia(e))throw Error(s(418));t=tn(r.nextSibling);var o=_t;t&&Uc(e,t)?Oc(o,r):(e.flags=e.flags&-4097|2,Fe=!1,_t=e)}}else{if(ia(e))throw Error(s(418));e.flags=e.flags&-4097|2,Fe=!1,_t=e}}}function Bc(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;_t=e}function jo(e){if(e!==_t)return!1;if(!Fe)return Bc(e),Fe=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Xi(e.type,e.memoizedProps)),t&&(t=wt)){if(ia(e))throw Hc(),Error(s(418));for(;t;)Oc(e,t),t=tn(t.nextSibling)}if(Bc(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){wt=tn(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}wt=null}}else wt=_t?tn(e.stateNode.nextSibling):null;return!0}function Hc(){for(var e=wt;e;)e=tn(e.nextSibling)}function Gn(){wt=_t=null,Fe=!1}function sa(e){At===null?At=[e]:At.push(e)}var mp=E.ReactCurrentBatchConfig;function Er(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(s(309));var o=r.stateNode}if(!o)throw Error(s(147,e));var l=o,d=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===d?t.ref:(t=function(f){var _=l.refs;f===null?delete _[d]:_[d]=f},t._stringRef=d,t)}if(typeof e!="string")throw Error(s(284));if(!r._owner)throw Error(s(290,e))}return e}function Co(e,t){throw e=Object.prototype.toString.call(t),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function $c(e){var t=e._init;return t(e._payload)}function Kc(e){function t(L,N){if(e){var D=L.deletions;D===null?(L.deletions=[N],L.flags|=16):D.push(N)}}function r(L,N){if(!e)return null;for(;N!==null;)t(L,N),N=N.sibling;return null}function o(L,N){for(L=new Map;N!==null;)N.key!==null?L.set(N.key,N):L.set(N.index,N),N=N.sibling;return L}function l(L,N){return L=hn(L,N),L.index=0,L.sibling=null,L}function d(L,N,D){return L.index=D,e?(D=L.alternate,D!==null?(D=D.index,D<N?(L.flags|=2,N):D):(L.flags|=2,N)):(L.flags|=1048576,N)}function f(L){return e&&L.alternate===null&&(L.flags|=2),L}function _(L,N,D,le){return N===null||N.tag!==6?(N=Ja(D,L.mode,le),N.return=L,N):(N=l(N,D),N.return=L,N)}function v(L,N,D,le){var be=D.type;return be===Y?ee(L,N,D.props.children,le,D.key):N!==null&&(N.elementType===be||typeof be=="object"&&be!==null&&be.$$typeof===ae&&$c(be)===N.type)?(le=l(N,D.props),le.ref=Er(L,N,D),le.return=L,le):(le=Yo(D.type,D.key,D.props,null,L.mode,le),le.ref=Er(L,N,D),le.return=L,le)}function U(L,N,D,le){return N===null||N.tag!==4||N.stateNode.containerInfo!==D.containerInfo||N.stateNode.implementation!==D.implementation?(N=Za(D,L.mode,le),N.return=L,N):(N=l(N,D.children||[]),N.return=L,N)}function ee(L,N,D,le,be){return N===null||N.tag!==7?(N=Pn(D,L.mode,le,be),N.return=L,N):(N=l(N,D),N.return=L,N)}function ie(L,N,D){if(typeof N=="string"&&N!==""||typeof N=="number")return N=Ja(""+N,L.mode,D),N.return=L,N;if(typeof N=="object"&&N!==null){switch(N.$$typeof){case Q:return D=Yo(N.type,N.key,N.props,null,L.mode,D),D.ref=Er(L,null,N),D.return=L,D;case X:return N=Za(N,L.mode,D),N.return=L,N;case ae:var le=N._init;return ie(L,le(N._payload),D)}if(Ke(N)||q(N))return N=Pn(N,L.mode,D,null),N.return=L,N;Co(L,N)}return null}function Z(L,N,D,le){var be=N!==null?N.key:null;if(typeof D=="string"&&D!==""||typeof D=="number")return be!==null?null:_(L,N,""+D,le);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case Q:return D.key===be?v(L,N,D,le):null;case X:return D.key===be?U(L,N,D,le):null;case ae:return be=D._init,Z(L,N,be(D._payload),le)}if(Ke(D)||q(D))return be!==null?null:ee(L,N,D,le,null);Co(L,D)}return null}function ge(L,N,D,le,be){if(typeof le=="string"&&le!==""||typeof le=="number")return L=L.get(D)||null,_(N,L,""+le,be);if(typeof le=="object"&&le!==null){switch(le.$$typeof){case Q:return L=L.get(le.key===null?D:le.key)||null,v(N,L,le,be);case X:return L=L.get(le.key===null?D:le.key)||null,U(N,L,le,be);case ae:var ye=le._init;return ge(L,N,D,ye(le._payload),be)}if(Ke(le)||q(le))return L=L.get(D)||null,ee(N,L,le,be,null);Co(N,le)}return null}function me(L,N,D,le){for(var be=null,ye=null,ve=N,je=N=0,tt=null;ve!==null&&je<D.length;je++){ve.index>je?(tt=ve,ve=null):tt=ve.sibling;var Ae=Z(L,ve,D[je],le);if(Ae===null){ve===null&&(ve=tt);break}e&&ve&&Ae.alternate===null&&t(L,ve),N=d(Ae,N,je),ye===null?be=Ae:ye.sibling=Ae,ye=Ae,ve=tt}if(je===D.length)return r(L,ve),Fe&&bn(L,je),be;if(ve===null){for(;je<D.length;je++)ve=ie(L,D[je],le),ve!==null&&(N=d(ve,N,je),ye===null?be=ve:ye.sibling=ve,ye=ve);return Fe&&bn(L,je),be}for(ve=o(L,ve);je<D.length;je++)tt=ge(ve,L,je,D[je],le),tt!==null&&(e&&tt.alternate!==null&&ve.delete(tt.key===null?je:tt.key),N=d(tt,N,je),ye===null?be=tt:ye.sibling=tt,ye=tt);return e&&ve.forEach(function(gn){return t(L,gn)}),Fe&&bn(L,je),be}function xe(L,N,D,le){var be=q(D);if(typeof be!="function")throw Error(s(150));if(D=be.call(D),D==null)throw Error(s(151));for(var ye=be=null,ve=N,je=N=0,tt=null,Ae=D.next();ve!==null&&!Ae.done;je++,Ae=D.next()){ve.index>je?(tt=ve,ve=null):tt=ve.sibling;var gn=Z(L,ve,Ae.value,le);if(gn===null){ve===null&&(ve=tt);break}e&&ve&&gn.alternate===null&&t(L,ve),N=d(gn,N,je),ye===null?be=gn:ye.sibling=gn,ye=gn,ve=tt}if(Ae.done)return r(L,ve),Fe&&bn(L,je),be;if(ve===null){for(;!Ae.done;je++,Ae=D.next())Ae=ie(L,Ae.value,le),Ae!==null&&(N=d(Ae,N,je),ye===null?be=Ae:ye.sibling=Ae,ye=Ae);return Fe&&bn(L,je),be}for(ve=o(L,ve);!Ae.done;je++,Ae=D.next())Ae=ge(ve,L,je,Ae.value,le),Ae!==null&&(e&&Ae.alternate!==null&&ve.delete(Ae.key===null?je:Ae.key),N=d(Ae,N,je),ye===null?be=Ae:ye.sibling=Ae,ye=Ae);return e&&ve.forEach(function(Qp){return t(L,Qp)}),Fe&&bn(L,je),be}function Ge(L,N,D,le){if(typeof D=="object"&&D!==null&&D.type===Y&&D.key===null&&(D=D.props.children),typeof D=="object"&&D!==null){switch(D.$$typeof){case Q:e:{for(var be=D.key,ye=N;ye!==null;){if(ye.key===be){if(be=D.type,be===Y){if(ye.tag===7){r(L,ye.sibling),N=l(ye,D.props.children),N.return=L,L=N;break e}}else if(ye.elementType===be||typeof be=="object"&&be!==null&&be.$$typeof===ae&&$c(be)===ye.type){r(L,ye.sibling),N=l(ye,D.props),N.ref=Er(L,ye,D),N.return=L,L=N;break e}r(L,ye);break}else t(L,ye);ye=ye.sibling}D.type===Y?(N=Pn(D.props.children,L.mode,le,D.key),N.return=L,L=N):(le=Yo(D.type,D.key,D.props,null,L.mode,le),le.ref=Er(L,N,D),le.return=L,L=le)}return f(L);case X:e:{for(ye=D.key;N!==null;){if(N.key===ye)if(N.tag===4&&N.stateNode.containerInfo===D.containerInfo&&N.stateNode.implementation===D.implementation){r(L,N.sibling),N=l(N,D.children||[]),N.return=L,L=N;break e}else{r(L,N);break}else t(L,N);N=N.sibling}N=Za(D,L.mode,le),N.return=L,L=N}return f(L);case ae:return ye=D._init,Ge(L,N,ye(D._payload),le)}if(Ke(D))return me(L,N,D,le);if(q(D))return xe(L,N,D,le);Co(L,D)}return typeof D=="string"&&D!==""||typeof D=="number"?(D=""+D,N!==null&&N.tag===6?(r(L,N.sibling),N=l(N,D),N.return=L,L=N):(r(L,N),N=Ja(D,L.mode,le),N.return=L,L=N),f(L)):r(L,N)}return Ge}var qn=Kc(!0),Vc=Kc(!1),No=nn(null),Po=null,Qn=null,ca=null;function la(){ca=Qn=Po=null}function da(e){var t=No.current;We(No),e._currentValue=t}function ua(e,t,r){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===r)break;e=e.return}}function Yn(e,t){Po=e,ca=Qn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(ht=!0),e.firstContext=null)}function St(e){var t=e._currentValue;if(ca!==e)if(e={context:e,memoizedValue:t,next:null},Qn===null){if(Po===null)throw Error(s(308));Qn=e,Po.dependencies={lanes:0,firstContext:e}}else Qn=Qn.next=e;return t}var kn=null;function pa(e){kn===null?kn=[e]:kn.push(e)}function Gc(e,t,r,o){var l=t.interleaved;return l===null?(r.next=r,pa(t)):(r.next=l.next,l.next=r),t.interleaved=r,Kt(e,o)}function Kt(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var an=!1;function ha(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function qc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Vt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function sn(e,t,r){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ee&2)!==0){var l=o.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),o.pending=t,Kt(e,r)}return l=o.interleaved,l===null?(t.next=t,pa(o)):(t.next=l.next,l.next=t),o.interleaved=t,Kt(e,r)}function Io(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,Ni(e,r)}}function Qc(e,t){var r=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,r===o)){var l=null,d=null;if(r=r.firstBaseUpdate,r!==null){do{var f={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};d===null?l=d=f:d=d.next=f,r=r.next}while(r!==null);d===null?l=d=t:d=d.next=t}else l=d=t;r={baseState:o.baseState,firstBaseUpdate:l,lastBaseUpdate:d,shared:o.shared,effects:o.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function Eo(e,t,r,o){var l=e.updateQueue;an=!1;var d=l.firstBaseUpdate,f=l.lastBaseUpdate,_=l.shared.pending;if(_!==null){l.shared.pending=null;var v=_,U=v.next;v.next=null,f===null?d=U:f.next=U,f=v;var ee=e.alternate;ee!==null&&(ee=ee.updateQueue,_=ee.lastBaseUpdate,_!==f&&(_===null?ee.firstBaseUpdate=U:_.next=U,ee.lastBaseUpdate=v))}if(d!==null){var ie=l.baseState;f=0,ee=U=v=null,_=d;do{var Z=_.lane,ge=_.eventTime;if((o&Z)===Z){ee!==null&&(ee=ee.next={eventTime:ge,lane:0,tag:_.tag,payload:_.payload,callback:_.callback,next:null});e:{var me=e,xe=_;switch(Z=t,ge=r,xe.tag){case 1:if(me=xe.payload,typeof me=="function"){ie=me.call(ge,ie,Z);break e}ie=me;break e;case 3:me.flags=me.flags&-65537|128;case 0:if(me=xe.payload,Z=typeof me=="function"?me.call(ge,ie,Z):me,Z==null)break e;ie=A({},ie,Z);break e;case 2:an=!0}}_.callback!==null&&_.lane!==0&&(e.flags|=64,Z=l.effects,Z===null?l.effects=[_]:Z.push(_))}else ge={eventTime:ge,lane:Z,tag:_.tag,payload:_.payload,callback:_.callback,next:null},ee===null?(U=ee=ge,v=ie):ee=ee.next=ge,f|=Z;if(_=_.next,_===null){if(_=l.shared.pending,_===null)break;Z=_,_=Z.next,Z.next=null,l.lastBaseUpdate=Z,l.shared.pending=null}}while(!0);if(ee===null&&(v=ie),l.baseState=v,l.firstBaseUpdate=U,l.lastBaseUpdate=ee,t=l.shared.interleaved,t!==null){l=t;do f|=l.lane,l=l.next;while(l!==t)}else d===null&&(l.shared.lanes=0);Sn|=f,e.lanes=f,e.memoizedState=ie}}function Yc(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],l=o.callback;if(l!==null){if(o.callback=null,o=r,typeof l!="function")throw Error(s(191,l));l.call(o)}}}var Ar={},Wt=nn(Ar),Tr=nn(Ar),Lr=nn(Ar);function yn(e){if(e===Ar)throw Error(s(174));return e}function ga(e,t){switch(ze(Lr,t),ze(Tr,e),ze(Wt,Ar),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:fi(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=fi(t,e)}We(Wt),ze(Wt,t)}function Xn(){We(Wt),We(Tr),We(Lr)}function Xc(e){yn(Lr.current);var t=yn(Wt.current),r=fi(t,e.type);t!==r&&(ze(Tr,e),ze(Wt,r))}function fa(e){Tr.current===e&&(We(Wt),We(Tr))}var Oe=nn(0);function Ao(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ma=[];function xa(){for(var e=0;e<ma.length;e++)ma[e]._workInProgressVersionPrimary=null;ma.length=0}var To=E.ReactCurrentDispatcher,_a=E.ReactCurrentBatchConfig,vn=0,Ue=null,Ye=null,Ze=null,Lo=!1,Rr=!1,Mr=0,xp=0;function it(){throw Error(s(321))}function wa(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Et(e[r],t[r]))return!1;return!0}function ba(e,t,r,o,l,d){if(vn=d,Ue=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,To.current=e===null||e.memoizedState===null?kp:yp,e=r(o,l),Rr){d=0;do{if(Rr=!1,Mr=0,25<=d)throw Error(s(301));d+=1,Ze=Ye=null,t.updateQueue=null,To.current=vp,e=r(o,l)}while(Rr)}if(To.current=zo,t=Ye!==null&&Ye.next!==null,vn=0,Ze=Ye=Ue=null,Lo=!1,t)throw Error(s(300));return e}function ka(){var e=Mr!==0;return Mr=0,e}function Ft(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ze===null?Ue.memoizedState=Ze=e:Ze=Ze.next=e,Ze}function jt(){if(Ye===null){var e=Ue.alternate;e=e!==null?e.memoizedState:null}else e=Ye.next;var t=Ze===null?Ue.memoizedState:Ze.next;if(t!==null)Ze=t,Ye=e;else{if(e===null)throw Error(s(310));Ye=e,e={memoizedState:Ye.memoizedState,baseState:Ye.baseState,baseQueue:Ye.baseQueue,queue:Ye.queue,next:null},Ze===null?Ue.memoizedState=Ze=e:Ze=Ze.next=e}return Ze}function zr(e,t){return typeof t=="function"?t(e):t}function ya(e){var t=jt(),r=t.queue;if(r===null)throw Error(s(311));r.lastRenderedReducer=e;var o=Ye,l=o.baseQueue,d=r.pending;if(d!==null){if(l!==null){var f=l.next;l.next=d.next,d.next=f}o.baseQueue=l=d,r.pending=null}if(l!==null){d=l.next,o=o.baseState;var _=f=null,v=null,U=d;do{var ee=U.lane;if((vn&ee)===ee)v!==null&&(v=v.next={lane:0,action:U.action,hasEagerState:U.hasEagerState,eagerState:U.eagerState,next:null}),o=U.hasEagerState?U.eagerState:e(o,U.action);else{var ie={lane:ee,action:U.action,hasEagerState:U.hasEagerState,eagerState:U.eagerState,next:null};v===null?(_=v=ie,f=o):v=v.next=ie,Ue.lanes|=ee,Sn|=ee}U=U.next}while(U!==null&&U!==d);v===null?f=o:v.next=_,Et(o,t.memoizedState)||(ht=!0),t.memoizedState=o,t.baseState=f,t.baseQueue=v,r.lastRenderedState=o}if(e=r.interleaved,e!==null){l=e;do d=l.lane,Ue.lanes|=d,Sn|=d,l=l.next;while(l!==e)}else l===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function va(e){var t=jt(),r=t.queue;if(r===null)throw Error(s(311));r.lastRenderedReducer=e;var o=r.dispatch,l=r.pending,d=t.memoizedState;if(l!==null){r.pending=null;var f=l=l.next;do d=e(d,f.action),f=f.next;while(f!==l);Et(d,t.memoizedState)||(ht=!0),t.memoizedState=d,t.baseQueue===null&&(t.baseState=d),r.lastRenderedState=d}return[d,o]}function Jc(){}function Zc(e,t){var r=Ue,o=jt(),l=t(),d=!Et(o.memoizedState,l);if(d&&(o.memoizedState=l,ht=!0),o=o.queue,Sa(nl.bind(null,r,o,e),[e]),o.getSnapshot!==t||d||Ze!==null&&Ze.memoizedState.tag&1){if(r.flags|=2048,Dr(9,tl.bind(null,r,o,l,t),void 0,null),et===null)throw Error(s(349));(vn&30)!==0||el(r,t,l)}return l}function el(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=Ue.updateQueue,t===null?(t={lastEffect:null,stores:null},Ue.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function tl(e,t,r,o){t.value=r,t.getSnapshot=o,rl(t)&&ol(e)}function nl(e,t,r){return r(function(){rl(t)&&ol(e)})}function rl(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Et(e,r)}catch{return!0}}function ol(e){var t=Kt(e,1);t!==null&&Mt(t,e,1,-1)}function il(e){var t=Ft();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:zr,lastRenderedState:e},t.queue=e,e=e.dispatch=bp.bind(null,Ue,e),[t.memoizedState,e]}function Dr(e,t,r,o){return e={tag:e,create:t,destroy:r,deps:o,next:null},t=Ue.updateQueue,t===null?(t={lastEffect:null,stores:null},Ue.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(o=r.next,r.next=e,e.next=o,t.lastEffect=e)),e}function al(){return jt().memoizedState}function Ro(e,t,r,o){var l=Ft();Ue.flags|=e,l.memoizedState=Dr(1|t,r,void 0,o===void 0?null:o)}function Mo(e,t,r,o){var l=jt();o=o===void 0?null:o;var d=void 0;if(Ye!==null){var f=Ye.memoizedState;if(d=f.destroy,o!==null&&wa(o,f.deps)){l.memoizedState=Dr(t,r,d,o);return}}Ue.flags|=e,l.memoizedState=Dr(1|t,r,d,o)}function sl(e,t){return Ro(8390656,8,e,t)}function Sa(e,t){return Mo(2048,8,e,t)}function cl(e,t){return Mo(4,2,e,t)}function ll(e,t){return Mo(4,4,e,t)}function dl(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ul(e,t,r){return r=r!=null?r.concat([e]):null,Mo(4,4,dl.bind(null,t,e),r)}function ja(){}function pl(e,t){var r=jt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&wa(t,o[1])?o[0]:(r.memoizedState=[e,t],e)}function hl(e,t){var r=jt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&wa(t,o[1])?o[0]:(e=e(),r.memoizedState=[e,t],e)}function gl(e,t,r){return(vn&21)===0?(e.baseState&&(e.baseState=!1,ht=!0),e.memoizedState=r):(Et(r,t)||(r=$s(),Ue.lanes|=r,Sn|=r,e.baseState=!0),t)}function _p(e,t){var r=Re;Re=r!==0&&4>r?r:4,e(!0);var o=_a.transition;_a.transition={};try{e(!1),t()}finally{Re=r,_a.transition=o}}function fl(){return jt().memoizedState}function wp(e,t,r){var o=un(e);if(r={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null},ml(e))xl(t,r);else if(r=Gc(e,t,r,o),r!==null){var l=dt();Mt(r,e,o,l),_l(r,t,o)}}function bp(e,t,r){var o=un(e),l={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null};if(ml(e))xl(t,l);else{var d=e.alternate;if(e.lanes===0&&(d===null||d.lanes===0)&&(d=t.lastRenderedReducer,d!==null))try{var f=t.lastRenderedState,_=d(f,r);if(l.hasEagerState=!0,l.eagerState=_,Et(_,f)){var v=t.interleaved;v===null?(l.next=l,pa(t)):(l.next=v.next,v.next=l),t.interleaved=l;return}}catch{}r=Gc(e,t,l,o),r!==null&&(l=dt(),Mt(r,e,o,l),_l(r,t,o))}}function ml(e){var t=e.alternate;return e===Ue||t!==null&&t===Ue}function xl(e,t){Rr=Lo=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function _l(e,t,r){if((r&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,Ni(e,r)}}var zo={readContext:St,useCallback:it,useContext:it,useEffect:it,useImperativeHandle:it,useInsertionEffect:it,useLayoutEffect:it,useMemo:it,useReducer:it,useRef:it,useState:it,useDebugValue:it,useDeferredValue:it,useTransition:it,useMutableSource:it,useSyncExternalStore:it,useId:it,unstable_isNewReconciler:!1},kp={readContext:St,useCallback:function(e,t){return Ft().memoizedState=[e,t===void 0?null:t],e},useContext:St,useEffect:sl,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Ro(4194308,4,dl.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Ro(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ro(4,2,e,t)},useMemo:function(e,t){var r=Ft();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var o=Ft();return t=r!==void 0?r(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=wp.bind(null,Ue,e),[o.memoizedState,e]},useRef:function(e){var t=Ft();return e={current:e},t.memoizedState=e},useState:il,useDebugValue:ja,useDeferredValue:function(e){return Ft().memoizedState=e},useTransition:function(){var e=il(!1),t=e[0];return e=_p.bind(null,e[1]),Ft().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var o=Ue,l=Ft();if(Fe){if(r===void 0)throw Error(s(407));r=r()}else{if(r=t(),et===null)throw Error(s(349));(vn&30)!==0||el(o,t,r)}l.memoizedState=r;var d={value:r,getSnapshot:t};return l.queue=d,sl(nl.bind(null,o,d,e),[e]),o.flags|=2048,Dr(9,tl.bind(null,o,d,r,t),void 0,null),r},useId:function(){var e=Ft(),t=et.identifierPrefix;if(Fe){var r=$t,o=Ht;r=(o&~(1<<32-It(o)-1)).toString(32)+r,t=":"+t+"R"+r,r=Mr++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=xp++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},yp={readContext:St,useCallback:pl,useContext:St,useEffect:Sa,useImperativeHandle:ul,useInsertionEffect:cl,useLayoutEffect:ll,useMemo:hl,useReducer:ya,useRef:al,useState:function(){return ya(zr)},useDebugValue:ja,useDeferredValue:function(e){var t=jt();return gl(t,Ye.memoizedState,e)},useTransition:function(){var e=ya(zr)[0],t=jt().memoizedState;return[e,t]},useMutableSource:Jc,useSyncExternalStore:Zc,useId:fl,unstable_isNewReconciler:!1},vp={readContext:St,useCallback:pl,useContext:St,useEffect:Sa,useImperativeHandle:ul,useInsertionEffect:cl,useLayoutEffect:ll,useMemo:hl,useReducer:va,useRef:al,useState:function(){return va(zr)},useDebugValue:ja,useDeferredValue:function(e){var t=jt();return Ye===null?t.memoizedState=e:gl(t,Ye.memoizedState,e)},useTransition:function(){var e=va(zr)[0],t=jt().memoizedState;return[e,t]},useMutableSource:Jc,useSyncExternalStore:Zc,useId:fl,unstable_isNewReconciler:!1};function Tt(e,t){if(e&&e.defaultProps){t=A({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function Ca(e,t,r,o){t=e.memoizedState,r=r(o,t),r=r==null?t:A({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Do={isMounted:function(e){return(e=e._reactInternals)?mn(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var o=dt(),l=un(e),d=Vt(o,l);d.payload=t,r!=null&&(d.callback=r),t=sn(e,d,l),t!==null&&(Mt(t,e,l,o),Io(t,e,l))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var o=dt(),l=un(e),d=Vt(o,l);d.tag=1,d.payload=t,r!=null&&(d.callback=r),t=sn(e,d,l),t!==null&&(Mt(t,e,l,o),Io(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=dt(),o=un(e),l=Vt(r,o);l.tag=2,t!=null&&(l.callback=t),t=sn(e,l,o),t!==null&&(Mt(t,e,o,r),Io(t,e,o))}};function wl(e,t,r,o,l,d,f){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,d,f):t.prototype&&t.prototype.isPureReactComponent?!vr(r,o)||!vr(l,d):!0}function bl(e,t,r){var o=!1,l=rn,d=t.contextType;return typeof d=="object"&&d!==null?d=St(d):(l=pt(t)?_n:ot.current,o=t.contextTypes,d=(o=o!=null)?$n(e,l):rn),t=new t(r,d),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Do,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=d),t}function kl(e,t,r,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,o),t.state!==e&&Do.enqueueReplaceState(t,t.state,null)}function Na(e,t,r,o){var l=e.stateNode;l.props=r,l.state=e.memoizedState,l.refs={},ha(e);var d=t.contextType;typeof d=="object"&&d!==null?l.context=St(d):(d=pt(t)?_n:ot.current,l.context=$n(e,d)),l.state=e.memoizedState,d=t.getDerivedStateFromProps,typeof d=="function"&&(Ca(e,t,d,r),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Do.enqueueReplaceState(l,l.state,null),Eo(e,r,l,o),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Jn(e,t){try{var r="",o=t;do r+=H(o),o=o.return;while(o);var l=r}catch(d){l=`
Error generating stack: `+d.message+`
`+d.stack}return{value:e,source:t,stack:l,digest:null}}function Pa(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function Ia(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var Sp=typeof WeakMap=="function"?WeakMap:Map;function yl(e,t,r){r=Vt(-1,r),r.tag=3,r.payload={element:null};var o=t.value;return r.callback=function(){$o||($o=!0,$a=o),Ia(e,t)},r}function vl(e,t,r){r=Vt(-1,r),r.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var l=t.value;r.payload=function(){return o(l)},r.callback=function(){Ia(e,t)}}var d=e.stateNode;return d!==null&&typeof d.componentDidCatch=="function"&&(r.callback=function(){Ia(e,t),typeof o!="function"&&(ln===null?ln=new Set([this]):ln.add(this));var f=t.stack;this.componentDidCatch(t.value,{componentStack:f!==null?f:""})}),r}function Sl(e,t,r){var o=e.pingCache;if(o===null){o=e.pingCache=new Sp;var l=new Set;o.set(t,l)}else l=o.get(t),l===void 0&&(l=new Set,o.set(t,l));l.has(r)||(l.add(r),e=Wp.bind(null,e,t,r),t.then(e,e))}function jl(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Cl(e,t,r,o,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=Vt(-1,1),t.tag=2,sn(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var jp=E.ReactCurrentOwner,ht=!1;function lt(e,t,r,o){t.child=e===null?Vc(t,null,r,o):qn(t,e.child,r,o)}function Nl(e,t,r,o,l){r=r.render;var d=t.ref;return Yn(t,l),o=ba(e,t,r,o,d,l),r=ka(),e!==null&&!ht?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Gt(e,t,l)):(Fe&&r&&ra(t),t.flags|=1,lt(e,t,o,l),t.child)}function Pl(e,t,r,o,l){if(e===null){var d=r.type;return typeof d=="function"&&!Xa(d)&&d.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=d,Il(e,t,d,o,l)):(e=Yo(r.type,null,o,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(d=e.child,(e.lanes&l)===0){var f=d.memoizedProps;if(r=r.compare,r=r!==null?r:vr,r(f,o)&&e.ref===t.ref)return Gt(e,t,l)}return t.flags|=1,e=hn(d,o),e.ref=t.ref,e.return=t,t.child=e}function Il(e,t,r,o,l){if(e!==null){var d=e.memoizedProps;if(vr(d,o)&&e.ref===t.ref)if(ht=!1,t.pendingProps=o=d,(e.lanes&l)!==0)(e.flags&131072)!==0&&(ht=!0);else return t.lanes=e.lanes,Gt(e,t,l)}return Ea(e,t,r,o,l)}function El(e,t,r){var o=t.pendingProps,l=o.children,d=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ze(er,bt),bt|=r;else{if((r&1073741824)===0)return e=d!==null?d.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ze(er,bt),bt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=d!==null?d.baseLanes:r,ze(er,bt),bt|=o}else d!==null?(o=d.baseLanes|r,t.memoizedState=null):o=r,ze(er,bt),bt|=o;return lt(e,t,l,r),t.child}function Al(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function Ea(e,t,r,o,l){var d=pt(r)?_n:ot.current;return d=$n(t,d),Yn(t,l),r=ba(e,t,r,o,d,l),o=ka(),e!==null&&!ht?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Gt(e,t,l)):(Fe&&o&&ra(t),t.flags|=1,lt(e,t,r,l),t.child)}function Tl(e,t,r,o,l){if(pt(r)){var d=!0;ko(t)}else d=!1;if(Yn(t,l),t.stateNode===null)Fo(e,t),bl(t,r,o),Na(t,r,o,l),o=!0;else if(e===null){var f=t.stateNode,_=t.memoizedProps;f.props=_;var v=f.context,U=r.contextType;typeof U=="object"&&U!==null?U=St(U):(U=pt(r)?_n:ot.current,U=$n(t,U));var ee=r.getDerivedStateFromProps,ie=typeof ee=="function"||typeof f.getSnapshotBeforeUpdate=="function";ie||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(_!==o||v!==U)&&kl(t,f,o,U),an=!1;var Z=t.memoizedState;f.state=Z,Eo(t,o,f,l),v=t.memoizedState,_!==o||Z!==v||ut.current||an?(typeof ee=="function"&&(Ca(t,r,ee,o),v=t.memoizedState),(_=an||wl(t,r,_,o,Z,v,U))?(ie||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(t.flags|=4194308)):(typeof f.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=v),f.props=o,f.state=v,f.context=U,o=_):(typeof f.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{f=t.stateNode,qc(e,t),_=t.memoizedProps,U=t.type===t.elementType?_:Tt(t.type,_),f.props=U,ie=t.pendingProps,Z=f.context,v=r.contextType,typeof v=="object"&&v!==null?v=St(v):(v=pt(r)?_n:ot.current,v=$n(t,v));var ge=r.getDerivedStateFromProps;(ee=typeof ge=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(_!==ie||Z!==v)&&kl(t,f,o,v),an=!1,Z=t.memoizedState,f.state=Z,Eo(t,o,f,l);var me=t.memoizedState;_!==ie||Z!==me||ut.current||an?(typeof ge=="function"&&(Ca(t,r,ge,o),me=t.memoizedState),(U=an||wl(t,r,U,o,Z,me,v)||!1)?(ee||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(o,me,v),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(o,me,v)),typeof f.componentDidUpdate=="function"&&(t.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&Z===e.memoizedState||(t.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&Z===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=me),f.props=o,f.state=me,f.context=v,o=U):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&Z===e.memoizedState||(t.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&Z===e.memoizedState||(t.flags|=1024),o=!1)}return Aa(e,t,r,o,d,l)}function Aa(e,t,r,o,l,d){Al(e,t);var f=(t.flags&128)!==0;if(!o&&!f)return l&&Dc(t,r,!1),Gt(e,t,d);o=t.stateNode,jp.current=t;var _=f&&typeof r.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&f?(t.child=qn(t,e.child,null,d),t.child=qn(t,null,_,d)):lt(e,t,_,d),t.memoizedState=o.state,l&&Dc(t,r,!0),t.child}function Ll(e){var t=e.stateNode;t.pendingContext?Mc(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Mc(e,t.context,!1),ga(e,t.containerInfo)}function Rl(e,t,r,o,l){return Gn(),sa(l),t.flags|=256,lt(e,t,r,o),t.child}var Ta={dehydrated:null,treeContext:null,retryLane:0};function La(e){return{baseLanes:e,cachePool:null,transitions:null}}function Ml(e,t,r){var o=t.pendingProps,l=Oe.current,d=!1,f=(t.flags&128)!==0,_;if((_=f)||(_=e!==null&&e.memoizedState===null?!1:(l&2)!==0),_?(d=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),ze(Oe,l&1),e===null)return aa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(f=o.children,e=o.fallback,d?(o=t.mode,d=t.child,f={mode:"hidden",children:f},(o&1)===0&&d!==null?(d.childLanes=0,d.pendingProps=f):d=Xo(f,o,0,null),e=Pn(e,o,r,null),d.return=t,e.return=t,d.sibling=e,t.child=d,t.child.memoizedState=La(r),t.memoizedState=Ta,e):Ra(t,f));if(l=e.memoizedState,l!==null&&(_=l.dehydrated,_!==null))return Cp(e,t,f,o,_,l,r);if(d){d=o.fallback,f=t.mode,l=e.child,_=l.sibling;var v={mode:"hidden",children:o.children};return(f&1)===0&&t.child!==l?(o=t.child,o.childLanes=0,o.pendingProps=v,t.deletions=null):(o=hn(l,v),o.subtreeFlags=l.subtreeFlags&14680064),_!==null?d=hn(_,d):(d=Pn(d,f,r,null),d.flags|=2),d.return=t,o.return=t,o.sibling=d,t.child=o,o=d,d=t.child,f=e.child.memoizedState,f=f===null?La(r):{baseLanes:f.baseLanes|r,cachePool:null,transitions:f.transitions},d.memoizedState=f,d.childLanes=e.childLanes&~r,t.memoizedState=Ta,o}return d=e.child,e=d.sibling,o=hn(d,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=r),o.return=t,o.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=o,t.memoizedState=null,o}function Ra(e,t){return t=Xo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Wo(e,t,r,o){return o!==null&&sa(o),qn(t,e.child,null,r),e=Ra(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Cp(e,t,r,o,l,d,f){if(r)return t.flags&256?(t.flags&=-257,o=Pa(Error(s(422))),Wo(e,t,f,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(d=o.fallback,l=t.mode,o=Xo({mode:"visible",children:o.children},l,0,null),d=Pn(d,l,f,null),d.flags|=2,o.return=t,d.return=t,o.sibling=d,t.child=o,(t.mode&1)!==0&&qn(t,e.child,null,f),t.child.memoizedState=La(f),t.memoizedState=Ta,d);if((t.mode&1)===0)return Wo(e,t,f,null);if(l.data==="$!"){if(o=l.nextSibling&&l.nextSibling.dataset,o)var _=o.dgst;return o=_,d=Error(s(419)),o=Pa(d,o,void 0),Wo(e,t,f,o)}if(_=(f&e.childLanes)!==0,ht||_){if(o=et,o!==null){switch(f&-f){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(o.suspendedLanes|f))!==0?0:l,l!==0&&l!==d.retryLane&&(d.retryLane=l,Kt(e,l),Mt(o,e,l,-1))}return Ya(),o=Pa(Error(s(421))),Wo(e,t,f,o)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Fp.bind(null,e),l._reactRetry=t,null):(e=d.treeContext,wt=tn(l.nextSibling),_t=t,Fe=!0,At=null,e!==null&&(yt[vt++]=Ht,yt[vt++]=$t,yt[vt++]=wn,Ht=e.id,$t=e.overflow,wn=t),t=Ra(t,o.children),t.flags|=4096,t)}function zl(e,t,r){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),ua(e.return,t,r)}function Ma(e,t,r,o,l){var d=e.memoizedState;d===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:r,tailMode:l}:(d.isBackwards=t,d.rendering=null,d.renderingStartTime=0,d.last=o,d.tail=r,d.tailMode=l)}function Dl(e,t,r){var o=t.pendingProps,l=o.revealOrder,d=o.tail;if(lt(e,t,o.children,r),o=Oe.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&zl(e,r,t);else if(e.tag===19)zl(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(ze(Oe,o),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(r=t.child,l=null;r!==null;)e=r.alternate,e!==null&&Ao(e)===null&&(l=r),r=r.sibling;r=l,r===null?(l=t.child,t.child=null):(l=r.sibling,r.sibling=null),Ma(t,!1,l,r,d);break;case"backwards":for(r=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Ao(e)===null){t.child=l;break}e=l.sibling,l.sibling=r,r=l,l=e}Ma(t,!0,r,null,d);break;case"together":Ma(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Fo(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Gt(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),Sn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(s(153));if(t.child!==null){for(e=t.child,r=hn(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=hn(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function Np(e,t,r){switch(t.tag){case 3:Ll(t),Gn();break;case 5:Xc(t);break;case 1:pt(t.type)&&ko(t);break;case 4:ga(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,l=t.memoizedProps.value;ze(No,o._currentValue),o._currentValue=l;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(ze(Oe,Oe.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?Ml(e,t,r):(ze(Oe,Oe.current&1),e=Gt(e,t,r),e!==null?e.sibling:null);ze(Oe,Oe.current&1);break;case 19:if(o=(r&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Dl(e,t,r);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),ze(Oe,Oe.current),o)break;return null;case 22:case 23:return t.lanes=0,El(e,t,r)}return Gt(e,t,r)}var Wl,za,Fl,Ol;Wl=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},za=function(){},Fl=function(e,t,r,o){var l=e.memoizedProps;if(l!==o){e=t.stateNode,yn(Wt.current);var d=null;switch(r){case"input":l=Qe(e,l),o=Qe(e,o),d=[];break;case"select":l=A({},l,{value:void 0}),o=A({},o,{value:void 0}),d=[];break;case"textarea":l=Tn(e,l),o=Tn(e,o),d=[];break;default:typeof l.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=_o)}mi(r,o);var f;r=null;for(U in l)if(!o.hasOwnProperty(U)&&l.hasOwnProperty(U)&&l[U]!=null)if(U==="style"){var _=l[U];for(f in _)_.hasOwnProperty(f)&&(r||(r={}),r[f]="")}else U!=="dangerouslySetInnerHTML"&&U!=="children"&&U!=="suppressContentEditableWarning"&&U!=="suppressHydrationWarning"&&U!=="autoFocus"&&(p.hasOwnProperty(U)?d||(d=[]):(d=d||[]).push(U,null));for(U in o){var v=o[U];if(_=l?.[U],o.hasOwnProperty(U)&&v!==_&&(v!=null||_!=null))if(U==="style")if(_){for(f in _)!_.hasOwnProperty(f)||v&&v.hasOwnProperty(f)||(r||(r={}),r[f]="");for(f in v)v.hasOwnProperty(f)&&_[f]!==v[f]&&(r||(r={}),r[f]=v[f])}else r||(d||(d=[]),d.push(U,r)),r=v;else U==="dangerouslySetInnerHTML"?(v=v?v.__html:void 0,_=_?_.__html:void 0,v!=null&&_!==v&&(d=d||[]).push(U,v)):U==="children"?typeof v!="string"&&typeof v!="number"||(d=d||[]).push(U,""+v):U!=="suppressContentEditableWarning"&&U!=="suppressHydrationWarning"&&(p.hasOwnProperty(U)?(v!=null&&U==="onScroll"&&De("scroll",e),d||_===v||(d=[])):(d=d||[]).push(U,v))}r&&(d=d||[]).push("style",r);var U=d;(t.updateQueue=U)&&(t.flags|=4)}},Ol=function(e,t,r,o){r!==o&&(t.flags|=4)};function Wr(e,t){if(!Fe)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function at(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,o=0;if(t)for(var l=e.child;l!==null;)r|=l.lanes|l.childLanes,o|=l.subtreeFlags&14680064,o|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)r|=l.lanes|l.childLanes,o|=l.subtreeFlags,o|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=o,e.childLanes=r,t}function Pp(e,t,r){var o=t.pendingProps;switch(oa(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return at(t),null;case 1:return pt(t.type)&&bo(),at(t),null;case 3:return o=t.stateNode,Xn(),We(ut),We(ot),xa(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(jo(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,At!==null&&(Ga(At),At=null))),za(e,t),at(t),null;case 5:fa(t);var l=yn(Lr.current);if(r=t.type,e!==null&&t.stateNode!=null)Fl(e,t,r,o,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(s(166));return at(t),null}if(e=yn(Wt.current),jo(t)){o=t.stateNode,r=t.type;var d=t.memoizedProps;switch(o[Dt]=t,o[Pr]=d,e=(t.mode&1)!==0,r){case"dialog":De("cancel",o),De("close",o);break;case"iframe":case"object":case"embed":De("load",o);break;case"video":case"audio":for(l=0;l<jr.length;l++)De(jr[l],o);break;case"source":De("error",o);break;case"img":case"image":case"link":De("error",o),De("load",o);break;case"details":De("toggle",o);break;case"input":Se(o,d),De("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!d.multiple},De("invalid",o);break;case"textarea":vs(o,d),De("invalid",o)}mi(r,d),l=null;for(var f in d)if(d.hasOwnProperty(f)){var _=d[f];f==="children"?typeof _=="string"?o.textContent!==_&&(d.suppressHydrationWarning!==!0&&xo(o.textContent,_,e),l=["children",_]):typeof _=="number"&&o.textContent!==""+_&&(d.suppressHydrationWarning!==!0&&xo(o.textContent,_,e),l=["children",""+_]):p.hasOwnProperty(f)&&_!=null&&f==="onScroll"&&De("scroll",o)}switch(r){case"input":ke(o),Ne(o,d,!0);break;case"textarea":ke(o),js(o);break;case"select":case"option":break;default:typeof d.onClick=="function"&&(o.onclick=_o)}o=l,t.updateQueue=o,o!==null&&(t.flags|=4)}else{f=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Cs(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=f.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=f.createElement(r,{is:o.is}):(e=f.createElement(r),r==="select"&&(f=e,o.multiple?f.multiple=!0:o.size&&(f.size=o.size))):e=f.createElementNS(e,r),e[Dt]=t,e[Pr]=o,Wl(e,t,!1,!1),t.stateNode=e;e:{switch(f=xi(r,o),r){case"dialog":De("cancel",e),De("close",e),l=o;break;case"iframe":case"object":case"embed":De("load",e),l=o;break;case"video":case"audio":for(l=0;l<jr.length;l++)De(jr[l],e);l=o;break;case"source":De("error",e),l=o;break;case"img":case"image":case"link":De("error",e),De("load",e),l=o;break;case"details":De("toggle",e),l=o;break;case"input":Se(e,o),l=Qe(e,o),De("invalid",e);break;case"option":l=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},l=A({},o,{value:void 0}),De("invalid",e);break;case"textarea":vs(e,o),l=Tn(e,o),De("invalid",e);break;default:l=o}mi(r,l),_=l;for(d in _)if(_.hasOwnProperty(d)){var v=_[d];d==="style"?Is(e,v):d==="dangerouslySetInnerHTML"?(v=v?v.__html:void 0,v!=null&&Ns(e,v)):d==="children"?typeof v=="string"?(r!=="textarea"||v!=="")&&ar(e,v):typeof v=="number"&&ar(e,""+v):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(p.hasOwnProperty(d)?v!=null&&d==="onScroll"&&De("scroll",e):v!=null&&G(e,d,v,f))}switch(r){case"input":ke(e),Ne(e,o,!1);break;case"textarea":ke(e),js(e);break;case"option":o.value!=null&&e.setAttribute("value",""+R(o.value));break;case"select":e.multiple=!!o.multiple,d=o.value,d!=null?ct(e,!!o.multiple,d,!1):o.defaultValue!=null&&ct(e,!!o.multiple,o.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=_o)}switch(r){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return at(t),null;case 6:if(e&&t.stateNode!=null)Ol(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(s(166));if(r=yn(Lr.current),yn(Wt.current),jo(t)){if(o=t.stateNode,r=t.memoizedProps,o[Dt]=t,(d=o.nodeValue!==r)&&(e=_t,e!==null))switch(e.tag){case 3:xo(o.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&xo(o.nodeValue,r,(e.mode&1)!==0)}d&&(t.flags|=4)}else o=(r.nodeType===9?r:r.ownerDocument).createTextNode(o),o[Dt]=t,t.stateNode=o}return at(t),null;case 13:if(We(Oe),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Fe&&wt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Hc(),Gn(),t.flags|=98560,d=!1;else if(d=jo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!d)throw Error(s(318));if(d=t.memoizedState,d=d!==null?d.dehydrated:null,!d)throw Error(s(317));d[Dt]=t}else Gn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;at(t),d=!1}else At!==null&&(Ga(At),At=null),d=!0;if(!d)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Oe.current&1)!==0?Xe===0&&(Xe=3):Ya())),t.updateQueue!==null&&(t.flags|=4),at(t),null);case 4:return Xn(),za(e,t),e===null&&Cr(t.stateNode.containerInfo),at(t),null;case 10:return da(t.type._context),at(t),null;case 17:return pt(t.type)&&bo(),at(t),null;case 19:if(We(Oe),d=t.memoizedState,d===null)return at(t),null;if(o=(t.flags&128)!==0,f=d.rendering,f===null)if(o)Wr(d,!1);else{if(Xe!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(f=Ao(e),f!==null){for(t.flags|=128,Wr(d,!1),o=f.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=r,r=t.child;r!==null;)d=r,e=o,d.flags&=14680066,f=d.alternate,f===null?(d.childLanes=0,d.lanes=e,d.child=null,d.subtreeFlags=0,d.memoizedProps=null,d.memoizedState=null,d.updateQueue=null,d.dependencies=null,d.stateNode=null):(d.childLanes=f.childLanes,d.lanes=f.lanes,d.child=f.child,d.subtreeFlags=0,d.deletions=null,d.memoizedProps=f.memoizedProps,d.memoizedState=f.memoizedState,d.updateQueue=f.updateQueue,d.type=f.type,e=f.dependencies,d.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return ze(Oe,Oe.current&1|2),t.child}e=e.sibling}d.tail!==null&&Ve()>tr&&(t.flags|=128,o=!0,Wr(d,!1),t.lanes=4194304)}else{if(!o)if(e=Ao(f),e!==null){if(t.flags|=128,o=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Wr(d,!0),d.tail===null&&d.tailMode==="hidden"&&!f.alternate&&!Fe)return at(t),null}else 2*Ve()-d.renderingStartTime>tr&&r!==1073741824&&(t.flags|=128,o=!0,Wr(d,!1),t.lanes=4194304);d.isBackwards?(f.sibling=t.child,t.child=f):(r=d.last,r!==null?r.sibling=f:t.child=f,d.last=f)}return d.tail!==null?(t=d.tail,d.rendering=t,d.tail=t.sibling,d.renderingStartTime=Ve(),t.sibling=null,r=Oe.current,ze(Oe,o?r&1|2:r&1),t):(at(t),null);case 22:case 23:return Qa(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(bt&1073741824)!==0&&(at(t),t.subtreeFlags&6&&(t.flags|=8192)):at(t),null;case 24:return null;case 25:return null}throw Error(s(156,t.tag))}function Ip(e,t){switch(oa(t),t.tag){case 1:return pt(t.type)&&bo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Xn(),We(ut),We(ot),xa(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return fa(t),null;case 13:if(We(Oe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(s(340));Gn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return We(Oe),null;case 4:return Xn(),null;case 10:return da(t.type._context),null;case 22:case 23:return Qa(),null;case 24:return null;default:return null}}var Oo=!1,st=!1,Ep=typeof WeakSet=="function"?WeakSet:Set,fe=null;function Zn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(o){He(e,t,o)}else r.current=null}function Da(e,t,r){try{r()}catch(o){He(e,t,o)}}var Ul=!1;function Ap(e,t){if(Qi=io,e=wc(),Ui(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var o=r.getSelection&&r.getSelection();if(o&&o.rangeCount!==0){r=o.anchorNode;var l=o.anchorOffset,d=o.focusNode;o=o.focusOffset;try{r.nodeType,d.nodeType}catch{r=null;break e}var f=0,_=-1,v=-1,U=0,ee=0,ie=e,Z=null;t:for(;;){for(var ge;ie!==r||l!==0&&ie.nodeType!==3||(_=f+l),ie!==d||o!==0&&ie.nodeType!==3||(v=f+o),ie.nodeType===3&&(f+=ie.nodeValue.length),(ge=ie.firstChild)!==null;)Z=ie,ie=ge;for(;;){if(ie===e)break t;if(Z===r&&++U===l&&(_=f),Z===d&&++ee===o&&(v=f),(ge=ie.nextSibling)!==null)break;ie=Z,Z=ie.parentNode}ie=ge}r=_===-1||v===-1?null:{start:_,end:v}}else r=null}r=r||{start:0,end:0}}else r=null;for(Yi={focusedElem:e,selectionRange:r},io=!1,fe=t;fe!==null;)if(t=fe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,fe=e;else for(;fe!==null;){t=fe;try{var me=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(me!==null){var xe=me.memoizedProps,Ge=me.memoizedState,L=t.stateNode,N=L.getSnapshotBeforeUpdate(t.elementType===t.type?xe:Tt(t.type,xe),Ge);L.__reactInternalSnapshotBeforeUpdate=N}break;case 3:var D=t.stateNode.containerInfo;D.nodeType===1?D.textContent="":D.nodeType===9&&D.documentElement&&D.removeChild(D.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(s(163))}}catch(le){He(t,t.return,le)}if(e=t.sibling,e!==null){e.return=t.return,fe=e;break}fe=t.return}return me=Ul,Ul=!1,me}function Fr(e,t,r){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var l=o=o.next;do{if((l.tag&e)===e){var d=l.destroy;l.destroy=void 0,d!==void 0&&Da(t,r,d)}l=l.next}while(l!==o)}}function Uo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var o=r.create;r.destroy=o()}r=r.next}while(r!==t)}}function Wa(e){var t=e.ref;if(t!==null){var r=e.stateNode;e.tag,e=r,typeof t=="function"?t(e):t.current=e}}function Bl(e){var t=e.alternate;t!==null&&(e.alternate=null,Bl(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Dt],delete t[Pr],delete t[ea],delete t[hp],delete t[gp])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Hl(e){return e.tag===5||e.tag===3||e.tag===4}function $l(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Hl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Fa(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=_o));else if(o!==4&&(e=e.child,e!==null))for(Fa(e,t,r),e=e.sibling;e!==null;)Fa(e,t,r),e=e.sibling}function Oa(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(Oa(e,t,r),e=e.sibling;e!==null;)Oa(e,t,r),e=e.sibling}var nt=null,Lt=!1;function cn(e,t,r){for(r=r.child;r!==null;)Kl(e,t,r),r=r.sibling}function Kl(e,t,r){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(Zr,r)}catch{}switch(r.tag){case 5:st||Zn(r,t);case 6:var o=nt,l=Lt;nt=null,cn(e,t,r),nt=o,Lt=l,nt!==null&&(Lt?(e=nt,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):nt.removeChild(r.stateNode));break;case 18:nt!==null&&(Lt?(e=nt,r=r.stateNode,e.nodeType===8?Zi(e.parentNode,r):e.nodeType===1&&Zi(e,r),xr(e)):Zi(nt,r.stateNode));break;case 4:o=nt,l=Lt,nt=r.stateNode.containerInfo,Lt=!0,cn(e,t,r),nt=o,Lt=l;break;case 0:case 11:case 14:case 15:if(!st&&(o=r.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){l=o=o.next;do{var d=l,f=d.destroy;d=d.tag,f!==void 0&&((d&2)!==0||(d&4)!==0)&&Da(r,t,f),l=l.next}while(l!==o)}cn(e,t,r);break;case 1:if(!st&&(Zn(r,t),o=r.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=r.memoizedProps,o.state=r.memoizedState,o.componentWillUnmount()}catch(_){He(r,t,_)}cn(e,t,r);break;case 21:cn(e,t,r);break;case 22:r.mode&1?(st=(o=st)||r.memoizedState!==null,cn(e,t,r),st=o):cn(e,t,r);break;default:cn(e,t,r)}}function Vl(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new Ep),t.forEach(function(o){var l=Op.bind(null,e,o);r.has(o)||(r.add(o),o.then(l,l))})}}function Rt(e,t){var r=t.deletions;if(r!==null)for(var o=0;o<r.length;o++){var l=r[o];try{var d=e,f=t,_=f;e:for(;_!==null;){switch(_.tag){case 5:nt=_.stateNode,Lt=!1;break e;case 3:nt=_.stateNode.containerInfo,Lt=!0;break e;case 4:nt=_.stateNode.containerInfo,Lt=!0;break e}_=_.return}if(nt===null)throw Error(s(160));Kl(d,f,l),nt=null,Lt=!1;var v=l.alternate;v!==null&&(v.return=null),l.return=null}catch(U){He(l,t,U)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Gl(t,e),t=t.sibling}function Gl(e,t){var r=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Rt(t,e),Ot(e),o&4){try{Fr(3,e,e.return),Uo(3,e)}catch(xe){He(e,e.return,xe)}try{Fr(5,e,e.return)}catch(xe){He(e,e.return,xe)}}break;case 1:Rt(t,e),Ot(e),o&512&&r!==null&&Zn(r,r.return);break;case 5:if(Rt(t,e),Ot(e),o&512&&r!==null&&Zn(r,r.return),e.flags&32){var l=e.stateNode;try{ar(l,"")}catch(xe){He(e,e.return,xe)}}if(o&4&&(l=e.stateNode,l!=null)){var d=e.memoizedProps,f=r!==null?r.memoizedProps:d,_=e.type,v=e.updateQueue;if(e.updateQueue=null,v!==null)try{_==="input"&&d.type==="radio"&&d.name!=null&&pe(l,d),xi(_,f);var U=xi(_,d);for(f=0;f<v.length;f+=2){var ee=v[f],ie=v[f+1];ee==="style"?Is(l,ie):ee==="dangerouslySetInnerHTML"?Ns(l,ie):ee==="children"?ar(l,ie):G(l,ee,ie,U)}switch(_){case"input":oe(l,d);break;case"textarea":Ss(l,d);break;case"select":var Z=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!d.multiple;var ge=d.value;ge!=null?ct(l,!!d.multiple,ge,!1):Z!==!!d.multiple&&(d.defaultValue!=null?ct(l,!!d.multiple,d.defaultValue,!0):ct(l,!!d.multiple,d.multiple?[]:"",!1))}l[Pr]=d}catch(xe){He(e,e.return,xe)}}break;case 6:if(Rt(t,e),Ot(e),o&4){if(e.stateNode===null)throw Error(s(162));l=e.stateNode,d=e.memoizedProps;try{l.nodeValue=d}catch(xe){He(e,e.return,xe)}}break;case 3:if(Rt(t,e),Ot(e),o&4&&r!==null&&r.memoizedState.isDehydrated)try{xr(t.containerInfo)}catch(xe){He(e,e.return,xe)}break;case 4:Rt(t,e),Ot(e);break;case 13:Rt(t,e),Ot(e),l=e.child,l.flags&8192&&(d=l.memoizedState!==null,l.stateNode.isHidden=d,!d||l.alternate!==null&&l.alternate.memoizedState!==null||(Ha=Ve())),o&4&&Vl(e);break;case 22:if(ee=r!==null&&r.memoizedState!==null,e.mode&1?(st=(U=st)||ee,Rt(t,e),st=U):Rt(t,e),Ot(e),o&8192){if(U=e.memoizedState!==null,(e.stateNode.isHidden=U)&&!ee&&(e.mode&1)!==0)for(fe=e,ee=e.child;ee!==null;){for(ie=fe=ee;fe!==null;){switch(Z=fe,ge=Z.child,Z.tag){case 0:case 11:case 14:case 15:Fr(4,Z,Z.return);break;case 1:Zn(Z,Z.return);var me=Z.stateNode;if(typeof me.componentWillUnmount=="function"){o=Z,r=Z.return;try{t=o,me.props=t.memoizedProps,me.state=t.memoizedState,me.componentWillUnmount()}catch(xe){He(o,r,xe)}}break;case 5:Zn(Z,Z.return);break;case 22:if(Z.memoizedState!==null){Yl(ie);continue}}ge!==null?(ge.return=Z,fe=ge):Yl(ie)}ee=ee.sibling}e:for(ee=null,ie=e;;){if(ie.tag===5){if(ee===null){ee=ie;try{l=ie.stateNode,U?(d=l.style,typeof d.setProperty=="function"?d.setProperty("display","none","important"):d.display="none"):(_=ie.stateNode,v=ie.memoizedProps.style,f=v!=null&&v.hasOwnProperty("display")?v.display:null,_.style.display=Ps("display",f))}catch(xe){He(e,e.return,xe)}}}else if(ie.tag===6){if(ee===null)try{ie.stateNode.nodeValue=U?"":ie.memoizedProps}catch(xe){He(e,e.return,xe)}}else if((ie.tag!==22&&ie.tag!==23||ie.memoizedState===null||ie===e)&&ie.child!==null){ie.child.return=ie,ie=ie.child;continue}if(ie===e)break e;for(;ie.sibling===null;){if(ie.return===null||ie.return===e)break e;ee===ie&&(ee=null),ie=ie.return}ee===ie&&(ee=null),ie.sibling.return=ie.return,ie=ie.sibling}}break;case 19:Rt(t,e),Ot(e),o&4&&Vl(e);break;case 21:break;default:Rt(t,e),Ot(e)}}function Ot(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Hl(r)){var o=r;break e}r=r.return}throw Error(s(160))}switch(o.tag){case 5:var l=o.stateNode;o.flags&32&&(ar(l,""),o.flags&=-33);var d=$l(e);Oa(e,d,l);break;case 3:case 4:var f=o.stateNode.containerInfo,_=$l(e);Fa(e,_,f);break;default:throw Error(s(161))}}catch(v){He(e,e.return,v)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Tp(e,t,r){fe=e,ql(e)}function ql(e,t,r){for(var o=(e.mode&1)!==0;fe!==null;){var l=fe,d=l.child;if(l.tag===22&&o){var f=l.memoizedState!==null||Oo;if(!f){var _=l.alternate,v=_!==null&&_.memoizedState!==null||st;_=Oo;var U=st;if(Oo=f,(st=v)&&!U)for(fe=l;fe!==null;)f=fe,v=f.child,f.tag===22&&f.memoizedState!==null?Xl(l):v!==null?(v.return=f,fe=v):Xl(l);for(;d!==null;)fe=d,ql(d),d=d.sibling;fe=l,Oo=_,st=U}Ql(e)}else(l.subtreeFlags&8772)!==0&&d!==null?(d.return=l,fe=d):Ql(e)}}function Ql(e){for(;fe!==null;){var t=fe;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:st||Uo(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!st)if(r===null)o.componentDidMount();else{var l=t.elementType===t.type?r.memoizedProps:Tt(t.type,r.memoizedProps);o.componentDidUpdate(l,r.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var d=t.updateQueue;d!==null&&Yc(t,d,o);break;case 3:var f=t.updateQueue;if(f!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Yc(t,f,r)}break;case 5:var _=t.stateNode;if(r===null&&t.flags&4){r=_;var v=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":v.autoFocus&&r.focus();break;case"img":v.src&&(r.src=v.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var U=t.alternate;if(U!==null){var ee=U.memoizedState;if(ee!==null){var ie=ee.dehydrated;ie!==null&&xr(ie)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(s(163))}st||t.flags&512&&Wa(t)}catch(Z){He(t,t.return,Z)}}if(t===e){fe=null;break}if(r=t.sibling,r!==null){r.return=t.return,fe=r;break}fe=t.return}}function Yl(e){for(;fe!==null;){var t=fe;if(t===e){fe=null;break}var r=t.sibling;if(r!==null){r.return=t.return,fe=r;break}fe=t.return}}function Xl(e){for(;fe!==null;){var t=fe;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Uo(4,t)}catch(v){He(t,r,v)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var l=t.return;try{o.componentDidMount()}catch(v){He(t,l,v)}}var d=t.return;try{Wa(t)}catch(v){He(t,d,v)}break;case 5:var f=t.return;try{Wa(t)}catch(v){He(t,f,v)}}}catch(v){He(t,t.return,v)}if(t===e){fe=null;break}var _=t.sibling;if(_!==null){_.return=t.return,fe=_;break}fe=t.return}}var Lp=Math.ceil,Bo=E.ReactCurrentDispatcher,Ua=E.ReactCurrentOwner,Ct=E.ReactCurrentBatchConfig,Ee=0,et=null,qe=null,rt=0,bt=0,er=nn(0),Xe=0,Or=null,Sn=0,Ho=0,Ba=0,Ur=null,gt=null,Ha=0,tr=1/0,qt=null,$o=!1,$a=null,ln=null,Ko=!1,dn=null,Vo=0,Br=0,Ka=null,Go=-1,qo=0;function dt(){return(Ee&6)!==0?Ve():Go!==-1?Go:Go=Ve()}function un(e){return(e.mode&1)===0?1:(Ee&2)!==0&&rt!==0?rt&-rt:mp.transition!==null?(qo===0&&(qo=$s()),qo):(e=Re,e!==0||(e=window.event,e=e===void 0?16:Zs(e.type)),e)}function Mt(e,t,r,o){if(50<Br)throw Br=0,Ka=null,Error(s(185));pr(e,r,o),((Ee&2)===0||e!==et)&&(e===et&&((Ee&2)===0&&(Ho|=r),Xe===4&&pn(e,rt)),ft(e,o),r===1&&Ee===0&&(t.mode&1)===0&&(tr=Ve()+500,yo&&on()))}function ft(e,t){var r=e.callbackNode;mu(e,t);var o=no(e,e===et?rt:0);if(o===0)r!==null&&Us(r),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(r!=null&&Us(r),t===1)e.tag===0?fp(Zl.bind(null,e)):Wc(Zl.bind(null,e)),up(function(){(Ee&6)===0&&on()}),r=null;else{switch(Ks(o)){case 1:r=Si;break;case 4:r=Bs;break;case 16:r=Jr;break;case 536870912:r=Hs;break;default:r=Jr}r=sd(r,Jl.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Jl(e,t){if(Go=-1,qo=0,(Ee&6)!==0)throw Error(s(327));var r=e.callbackNode;if(nr()&&e.callbackNode!==r)return null;var o=no(e,e===et?rt:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Qo(e,o);else{t=o;var l=Ee;Ee|=2;var d=td();(et!==e||rt!==t)&&(qt=null,tr=Ve()+500,Cn(e,t));do try{zp();break}catch(_){ed(e,_)}while(!0);la(),Bo.current=d,Ee=l,qe!==null?t=0:(et=null,rt=0,t=Xe)}if(t!==0){if(t===2&&(l=ji(e),l!==0&&(o=l,t=Va(e,l))),t===1)throw r=Or,Cn(e,0),pn(e,o),ft(e,Ve()),r;if(t===6)pn(e,o);else{if(l=e.current.alternate,(o&30)===0&&!Rp(l)&&(t=Qo(e,o),t===2&&(d=ji(e),d!==0&&(o=d,t=Va(e,d))),t===1))throw r=Or,Cn(e,0),pn(e,o),ft(e,Ve()),r;switch(e.finishedWork=l,e.finishedLanes=o,t){case 0:case 1:throw Error(s(345));case 2:Nn(e,gt,qt);break;case 3:if(pn(e,o),(o&130023424)===o&&(t=Ha+500-Ve(),10<t)){if(no(e,0)!==0)break;if(l=e.suspendedLanes,(l&o)!==o){dt(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Ji(Nn.bind(null,e,gt,qt),t);break}Nn(e,gt,qt);break;case 4:if(pn(e,o),(o&4194240)===o)break;for(t=e.eventTimes,l=-1;0<o;){var f=31-It(o);d=1<<f,f=t[f],f>l&&(l=f),o&=~d}if(o=l,o=Ve()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*Lp(o/1960))-o,10<o){e.timeoutHandle=Ji(Nn.bind(null,e,gt,qt),o);break}Nn(e,gt,qt);break;case 5:Nn(e,gt,qt);break;default:throw Error(s(329))}}}return ft(e,Ve()),e.callbackNode===r?Jl.bind(null,e):null}function Va(e,t){var r=Ur;return e.current.memoizedState.isDehydrated&&(Cn(e,t).flags|=256),e=Qo(e,t),e!==2&&(t=gt,gt=r,t!==null&&Ga(t)),e}function Ga(e){gt===null?gt=e:gt.push.apply(gt,e)}function Rp(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var o=0;o<r.length;o++){var l=r[o],d=l.getSnapshot;l=l.value;try{if(!Et(d(),l))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function pn(e,t){for(t&=~Ba,t&=~Ho,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-It(t),o=1<<r;e[r]=-1,t&=~o}}function Zl(e){if((Ee&6)!==0)throw Error(s(327));nr();var t=no(e,0);if((t&1)===0)return ft(e,Ve()),null;var r=Qo(e,t);if(e.tag!==0&&r===2){var o=ji(e);o!==0&&(t=o,r=Va(e,o))}if(r===1)throw r=Or,Cn(e,0),pn(e,t),ft(e,Ve()),r;if(r===6)throw Error(s(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Nn(e,gt,qt),ft(e,Ve()),null}function qa(e,t){var r=Ee;Ee|=1;try{return e(t)}finally{Ee=r,Ee===0&&(tr=Ve()+500,yo&&on())}}function jn(e){dn!==null&&dn.tag===0&&(Ee&6)===0&&nr();var t=Ee;Ee|=1;var r=Ct.transition,o=Re;try{if(Ct.transition=null,Re=1,e)return e()}finally{Re=o,Ct.transition=r,Ee=t,(Ee&6)===0&&on()}}function Qa(){bt=er.current,We(er)}function Cn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,dp(r)),qe!==null)for(r=qe.return;r!==null;){var o=r;switch(oa(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&bo();break;case 3:Xn(),We(ut),We(ot),xa();break;case 5:fa(o);break;case 4:Xn();break;case 13:We(Oe);break;case 19:We(Oe);break;case 10:da(o.type._context);break;case 22:case 23:Qa()}r=r.return}if(et=e,qe=e=hn(e.current,null),rt=bt=t,Xe=0,Or=null,Ba=Ho=Sn=0,gt=Ur=null,kn!==null){for(t=0;t<kn.length;t++)if(r=kn[t],o=r.interleaved,o!==null){r.interleaved=null;var l=o.next,d=r.pending;if(d!==null){var f=d.next;d.next=l,o.next=f}r.pending=o}kn=null}return e}function ed(e,t){do{var r=qe;try{if(la(),To.current=zo,Lo){for(var o=Ue.memoizedState;o!==null;){var l=o.queue;l!==null&&(l.pending=null),o=o.next}Lo=!1}if(vn=0,Ze=Ye=Ue=null,Rr=!1,Mr=0,Ua.current=null,r===null||r.return===null){Xe=1,Or=t,qe=null;break}e:{var d=e,f=r.return,_=r,v=t;if(t=rt,_.flags|=32768,v!==null&&typeof v=="object"&&typeof v.then=="function"){var U=v,ee=_,ie=ee.tag;if((ee.mode&1)===0&&(ie===0||ie===11||ie===15)){var Z=ee.alternate;Z?(ee.updateQueue=Z.updateQueue,ee.memoizedState=Z.memoizedState,ee.lanes=Z.lanes):(ee.updateQueue=null,ee.memoizedState=null)}var ge=jl(f);if(ge!==null){ge.flags&=-257,Cl(ge,f,_,d,t),ge.mode&1&&Sl(d,U,t),t=ge,v=U;var me=t.updateQueue;if(me===null){var xe=new Set;xe.add(v),t.updateQueue=xe}else me.add(v);break e}else{if((t&1)===0){Sl(d,U,t),Ya();break e}v=Error(s(426))}}else if(Fe&&_.mode&1){var Ge=jl(f);if(Ge!==null){(Ge.flags&65536)===0&&(Ge.flags|=256),Cl(Ge,f,_,d,t),sa(Jn(v,_));break e}}d=v=Jn(v,_),Xe!==4&&(Xe=2),Ur===null?Ur=[d]:Ur.push(d),d=f;do{switch(d.tag){case 3:d.flags|=65536,t&=-t,d.lanes|=t;var L=yl(d,v,t);Qc(d,L);break e;case 1:_=v;var N=d.type,D=d.stateNode;if((d.flags&128)===0&&(typeof N.getDerivedStateFromError=="function"||D!==null&&typeof D.componentDidCatch=="function"&&(ln===null||!ln.has(D)))){d.flags|=65536,t&=-t,d.lanes|=t;var le=vl(d,_,t);Qc(d,le);break e}}d=d.return}while(d!==null)}rd(r)}catch(be){t=be,qe===r&&r!==null&&(qe=r=r.return);continue}break}while(!0)}function td(){var e=Bo.current;return Bo.current=zo,e===null?zo:e}function Ya(){(Xe===0||Xe===3||Xe===2)&&(Xe=4),et===null||(Sn&268435455)===0&&(Ho&268435455)===0||pn(et,rt)}function Qo(e,t){var r=Ee;Ee|=2;var o=td();(et!==e||rt!==t)&&(qt=null,Cn(e,t));do try{Mp();break}catch(l){ed(e,l)}while(!0);if(la(),Ee=r,Bo.current=o,qe!==null)throw Error(s(261));return et=null,rt=0,Xe}function Mp(){for(;qe!==null;)nd(qe)}function zp(){for(;qe!==null&&!su();)nd(qe)}function nd(e){var t=ad(e.alternate,e,bt);e.memoizedProps=e.pendingProps,t===null?rd(e):qe=t,Ua.current=null}function rd(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=Pp(r,t,bt),r!==null){qe=r;return}}else{if(r=Ip(r,t),r!==null){r.flags&=32767,qe=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Xe=6,qe=null;return}}if(t=t.sibling,t!==null){qe=t;return}qe=t=e}while(t!==null);Xe===0&&(Xe=5)}function Nn(e,t,r){var o=Re,l=Ct.transition;try{Ct.transition=null,Re=1,Dp(e,t,r,o)}finally{Ct.transition=l,Re=o}return null}function Dp(e,t,r,o){do nr();while(dn!==null);if((Ee&6)!==0)throw Error(s(327));r=e.finishedWork;var l=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(s(177));e.callbackNode=null,e.callbackPriority=0;var d=r.lanes|r.childLanes;if(xu(e,d),e===et&&(qe=et=null,rt=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Ko||(Ko=!0,sd(Jr,function(){return nr(),null})),d=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||d){d=Ct.transition,Ct.transition=null;var f=Re;Re=1;var _=Ee;Ee|=4,Ua.current=null,Ap(e,r),Gl(r,e),rp(Yi),io=!!Qi,Yi=Qi=null,e.current=r,Tp(r),cu(),Ee=_,Re=f,Ct.transition=d}else e.current=r;if(Ko&&(Ko=!1,dn=e,Vo=l),d=e.pendingLanes,d===0&&(ln=null),uu(r.stateNode),ft(e,Ve()),t!==null)for(o=e.onRecoverableError,r=0;r<t.length;r++)l=t[r],o(l.value,{componentStack:l.stack,digest:l.digest});if($o)throw $o=!1,e=$a,$a=null,e;return(Vo&1)!==0&&e.tag!==0&&nr(),d=e.pendingLanes,(d&1)!==0?e===Ka?Br++:(Br=0,Ka=e):Br=0,on(),null}function nr(){if(dn!==null){var e=Ks(Vo),t=Ct.transition,r=Re;try{if(Ct.transition=null,Re=16>e?16:e,dn===null)var o=!1;else{if(e=dn,dn=null,Vo=0,(Ee&6)!==0)throw Error(s(331));var l=Ee;for(Ee|=4,fe=e.current;fe!==null;){var d=fe,f=d.child;if((fe.flags&16)!==0){var _=d.deletions;if(_!==null){for(var v=0;v<_.length;v++){var U=_[v];for(fe=U;fe!==null;){var ee=fe;switch(ee.tag){case 0:case 11:case 15:Fr(8,ee,d)}var ie=ee.child;if(ie!==null)ie.return=ee,fe=ie;else for(;fe!==null;){ee=fe;var Z=ee.sibling,ge=ee.return;if(Bl(ee),ee===U){fe=null;break}if(Z!==null){Z.return=ge,fe=Z;break}fe=ge}}}var me=d.alternate;if(me!==null){var xe=me.child;if(xe!==null){me.child=null;do{var Ge=xe.sibling;xe.sibling=null,xe=Ge}while(xe!==null)}}fe=d}}if((d.subtreeFlags&2064)!==0&&f!==null)f.return=d,fe=f;else e:for(;fe!==null;){if(d=fe,(d.flags&2048)!==0)switch(d.tag){case 0:case 11:case 15:Fr(9,d,d.return)}var L=d.sibling;if(L!==null){L.return=d.return,fe=L;break e}fe=d.return}}var N=e.current;for(fe=N;fe!==null;){f=fe;var D=f.child;if((f.subtreeFlags&2064)!==0&&D!==null)D.return=f,fe=D;else e:for(f=N;fe!==null;){if(_=fe,(_.flags&2048)!==0)try{switch(_.tag){case 0:case 11:case 15:Uo(9,_)}}catch(be){He(_,_.return,be)}if(_===f){fe=null;break e}var le=_.sibling;if(le!==null){le.return=_.return,fe=le;break e}fe=_.return}}if(Ee=l,on(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(Zr,e)}catch{}o=!0}return o}finally{Re=r,Ct.transition=t}}return!1}function od(e,t,r){t=Jn(r,t),t=yl(e,t,1),e=sn(e,t,1),t=dt(),e!==null&&(pr(e,1,t),ft(e,t))}function He(e,t,r){if(e.tag===3)od(e,e,r);else for(;t!==null;){if(t.tag===3){od(t,e,r);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(ln===null||!ln.has(o))){e=Jn(r,e),e=vl(t,e,1),t=sn(t,e,1),e=dt(),t!==null&&(pr(t,1,e),ft(t,e));break}}t=t.return}}function Wp(e,t,r){var o=e.pingCache;o!==null&&o.delete(t),t=dt(),e.pingedLanes|=e.suspendedLanes&r,et===e&&(rt&r)===r&&(Xe===4||Xe===3&&(rt&130023424)===rt&&500>Ve()-Ha?Cn(e,0):Ba|=r),ft(e,t)}function id(e,t){t===0&&((e.mode&1)===0?t=1:(t=to,to<<=1,(to&130023424)===0&&(to=4194304)));var r=dt();e=Kt(e,t),e!==null&&(pr(e,t,r),ft(e,r))}function Fp(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),id(e,r)}function Op(e,t){var r=0;switch(e.tag){case 13:var o=e.stateNode,l=e.memoizedState;l!==null&&(r=l.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(s(314))}o!==null&&o.delete(t),id(e,r)}var ad;ad=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||ut.current)ht=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return ht=!1,Np(e,t,r);ht=(e.flags&131072)!==0}else ht=!1,Fe&&(t.flags&1048576)!==0&&Fc(t,So,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Fo(e,t),e=t.pendingProps;var l=$n(t,ot.current);Yn(t,r),l=ba(null,t,o,e,l,r);var d=ka();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,pt(o)?(d=!0,ko(t)):d=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,ha(t),l.updater=Do,t.stateNode=l,l._reactInternals=t,Na(t,o,e,r),t=Aa(null,t,o,!0,d,r)):(t.tag=0,Fe&&d&&ra(t),lt(null,t,l,r),t=t.child),t;case 16:o=t.elementType;e:{switch(Fo(e,t),e=t.pendingProps,l=o._init,o=l(o._payload),t.type=o,l=t.tag=Bp(o),e=Tt(o,e),l){case 0:t=Ea(null,t,o,e,r);break e;case 1:t=Tl(null,t,o,e,r);break e;case 11:t=Nl(null,t,o,e,r);break e;case 14:t=Pl(null,t,o,Tt(o.type,e),r);break e}throw Error(s(306,o,""))}return t;case 0:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:Tt(o,l),Ea(e,t,o,l,r);case 1:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:Tt(o,l),Tl(e,t,o,l,r);case 3:e:{if(Ll(t),e===null)throw Error(s(387));o=t.pendingProps,d=t.memoizedState,l=d.element,qc(e,t),Eo(t,o,null,r);var f=t.memoizedState;if(o=f.element,d.isDehydrated)if(d={element:o,isDehydrated:!1,cache:f.cache,pendingSuspenseBoundaries:f.pendingSuspenseBoundaries,transitions:f.transitions},t.updateQueue.baseState=d,t.memoizedState=d,t.flags&256){l=Jn(Error(s(423)),t),t=Rl(e,t,o,r,l);break e}else if(o!==l){l=Jn(Error(s(424)),t),t=Rl(e,t,o,r,l);break e}else for(wt=tn(t.stateNode.containerInfo.firstChild),_t=t,Fe=!0,At=null,r=Vc(t,null,o,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Gn(),o===l){t=Gt(e,t,r);break e}lt(e,t,o,r)}t=t.child}return t;case 5:return Xc(t),e===null&&aa(t),o=t.type,l=t.pendingProps,d=e!==null?e.memoizedProps:null,f=l.children,Xi(o,l)?f=null:d!==null&&Xi(o,d)&&(t.flags|=32),Al(e,t),lt(e,t,f,r),t.child;case 6:return e===null&&aa(t),null;case 13:return Ml(e,t,r);case 4:return ga(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=qn(t,null,o,r):lt(e,t,o,r),t.child;case 11:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:Tt(o,l),Nl(e,t,o,l,r);case 7:return lt(e,t,t.pendingProps,r),t.child;case 8:return lt(e,t,t.pendingProps.children,r),t.child;case 12:return lt(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(o=t.type._context,l=t.pendingProps,d=t.memoizedProps,f=l.value,ze(No,o._currentValue),o._currentValue=f,d!==null)if(Et(d.value,f)){if(d.children===l.children&&!ut.current){t=Gt(e,t,r);break e}}else for(d=t.child,d!==null&&(d.return=t);d!==null;){var _=d.dependencies;if(_!==null){f=d.child;for(var v=_.firstContext;v!==null;){if(v.context===o){if(d.tag===1){v=Vt(-1,r&-r),v.tag=2;var U=d.updateQueue;if(U!==null){U=U.shared;var ee=U.pending;ee===null?v.next=v:(v.next=ee.next,ee.next=v),U.pending=v}}d.lanes|=r,v=d.alternate,v!==null&&(v.lanes|=r),ua(d.return,r,t),_.lanes|=r;break}v=v.next}}else if(d.tag===10)f=d.type===t.type?null:d.child;else if(d.tag===18){if(f=d.return,f===null)throw Error(s(341));f.lanes|=r,_=f.alternate,_!==null&&(_.lanes|=r),ua(f,r,t),f=d.sibling}else f=d.child;if(f!==null)f.return=d;else for(f=d;f!==null;){if(f===t){f=null;break}if(d=f.sibling,d!==null){d.return=f.return,f=d;break}f=f.return}d=f}lt(e,t,l.children,r),t=t.child}return t;case 9:return l=t.type,o=t.pendingProps.children,Yn(t,r),l=St(l),o=o(l),t.flags|=1,lt(e,t,o,r),t.child;case 14:return o=t.type,l=Tt(o,t.pendingProps),l=Tt(o.type,l),Pl(e,t,o,l,r);case 15:return Il(e,t,t.type,t.pendingProps,r);case 17:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:Tt(o,l),Fo(e,t),t.tag=1,pt(o)?(e=!0,ko(t)):e=!1,Yn(t,r),bl(t,o,l),Na(t,o,l,r),Aa(null,t,o,!0,e,r);case 19:return Dl(e,t,r);case 22:return El(e,t,r)}throw Error(s(156,t.tag))};function sd(e,t){return Os(e,t)}function Up(e,t,r,o){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Nt(e,t,r,o){return new Up(e,t,r,o)}function Xa(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Bp(e){if(typeof e=="function")return Xa(e)?1:0;if(e!=null){if(e=e.$$typeof,e===V)return 11;if(e===_e)return 14}return 2}function hn(e,t){var r=e.alternate;return r===null?(r=Nt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Yo(e,t,r,o,l,d){var f=2;if(o=e,typeof e=="function")Xa(e)&&(f=1);else if(typeof e=="string")f=5;else e:switch(e){case Y:return Pn(r.children,l,d,t);case J:f=8,l|=8;break;case de:return e=Nt(12,r,t,l|2),e.elementType=de,e.lanes=d,e;case ce:return e=Nt(13,r,t,l),e.elementType=ce,e.lanes=d,e;case re:return e=Nt(19,r,t,l),e.elementType=re,e.lanes=d,e;case te:return Xo(r,l,d,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case se:f=10;break e;case ue:f=9;break e;case V:f=11;break e;case _e:f=14;break e;case ae:f=16,o=null;break e}throw Error(s(130,e==null?e:typeof e,""))}return t=Nt(f,r,t,l),t.elementType=e,t.type=o,t.lanes=d,t}function Pn(e,t,r,o){return e=Nt(7,e,o,t),e.lanes=r,e}function Xo(e,t,r,o){return e=Nt(22,e,o,t),e.elementType=te,e.lanes=r,e.stateNode={isHidden:!1},e}function Ja(e,t,r){return e=Nt(6,e,null,t),e.lanes=r,e}function Za(e,t,r){return t=Nt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Hp(e,t,r,o,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ci(0),this.expirationTimes=Ci(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ci(0),this.identifierPrefix=o,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function es(e,t,r,o,l,d,f,_,v){return e=new Hp(e,t,r,_,v),t===1?(t=1,d===!0&&(t|=8)):t=0,d=Nt(3,null,null,t),e.current=d,d.stateNode=e,d.memoizedState={element:o,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},ha(d),e}function $p(e,t,r){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:X,key:o==null?null:""+o,children:e,containerInfo:t,implementation:r}}function cd(e){if(!e)return rn;e=e._reactInternals;e:{if(mn(e)!==e||e.tag!==1)throw Error(s(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(pt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(s(171))}if(e.tag===1){var r=e.type;if(pt(r))return zc(e,r,t)}return t}function ld(e,t,r,o,l,d,f,_,v){return e=es(r,o,!0,e,l,d,f,_,v),e.context=cd(null),r=e.current,o=dt(),l=un(r),d=Vt(o,l),d.callback=t??null,sn(r,d,l),e.current.lanes=l,pr(e,l,o),ft(e,o),e}function Jo(e,t,r,o){var l=t.current,d=dt(),f=un(l);return r=cd(r),t.context===null?t.context=r:t.pendingContext=r,t=Vt(d,f),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=sn(l,t,f),e!==null&&(Mt(e,l,f,d),Io(e,l,f)),f}function Zo(e){return e=e.current,e.child?(e.child.tag===5,e.child.stateNode):null}function dd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function ts(e,t){dd(e,t),(e=e.alternate)&&dd(e,t)}function Kp(){return null}var ud=typeof reportError=="function"?reportError:function(e){console.error(e)};function ns(e){this._internalRoot=e}ei.prototype.render=ns.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(s(409));Jo(e,t,null,null)},ei.prototype.unmount=ns.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;jn(function(){Jo(null,e,null,null)}),t[Ut]=null}};function ei(e){this._internalRoot=e}ei.prototype.unstable_scheduleHydration=function(e){if(e){var t=qs();e={blockedOn:null,target:e,priority:t};for(var r=0;r<Jt.length&&t!==0&&t<Jt[r].priority;r++);Jt.splice(r,0,e),r===0&&Xs(e)}};function rs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function ti(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function pd(){}function Vp(e,t,r,o,l){if(l){if(typeof o=="function"){var d=o;o=function(){var U=Zo(f);d.call(U)}}var f=ld(t,o,e,0,null,!1,!1,"",pd);return e._reactRootContainer=f,e[Ut]=f.current,Cr(e.nodeType===8?e.parentNode:e),jn(),f}for(;l=e.lastChild;)e.removeChild(l);if(typeof o=="function"){var _=o;o=function(){var U=Zo(v);_.call(U)}}var v=es(e,0,!1,null,null,!1,!1,"",pd);return e._reactRootContainer=v,e[Ut]=v.current,Cr(e.nodeType===8?e.parentNode:e),jn(function(){Jo(t,v,r,o)}),v}function ni(e,t,r,o,l){var d=r._reactRootContainer;if(d){var f=d;if(typeof l=="function"){var _=l;l=function(){var v=Zo(f);_.call(v)}}Jo(t,f,e,l)}else f=Vp(r,t,e,l,o);return Zo(f)}Vs=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=ur(t.pendingLanes);r!==0&&(Ni(t,r|1),ft(t,Ve()),(Ee&6)===0&&(tr=Ve()+500,on()))}break;case 13:jn(function(){var o=Kt(e,1);if(o!==null){var l=dt();Mt(o,e,1,l)}}),ts(e,1)}},Pi=function(e){if(e.tag===13){var t=Kt(e,134217728);if(t!==null){var r=dt();Mt(t,e,134217728,r)}ts(e,134217728)}},Gs=function(e){if(e.tag===13){var t=un(e),r=Kt(e,t);if(r!==null){var o=dt();Mt(r,e,t,o)}ts(e,t)}},qs=function(){return Re},Qs=function(e,t){var r=Re;try{return Re=e,t()}finally{Re=r}},bi=function(e,t,r){switch(t){case"input":if(oe(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var o=r[t];if(o!==e&&o.form===e.form){var l=wo(o);if(!l)throw Error(s(90));we(o),oe(o,l)}}}break;case"textarea":Ss(e,r);break;case"select":t=r.value,t!=null&&ct(e,!!r.multiple,t,!1)}},Ls=qa,Rs=jn;var Gp={usingClientEntryPoint:!1,Events:[Ir,Bn,wo,As,Ts,qa]},Hr={findFiberByHostInstance:xn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},qp={bundleType:Hr.bundleType,version:Hr.version,rendererPackageName:Hr.rendererPackageName,rendererConfig:Hr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:E.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ws(e),e===null?null:e.stateNode},findFiberByHostInstance:Hr.findFiberByHostInstance||Kp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ri=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ri.isDisabled&&ri.supportsFiber)try{Zr=ri.inject(qp),zt=ri}catch{}}return mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Gp,mt.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!rs(t))throw Error(s(200));return $p(e,t,null,r)},mt.createRoot=function(e,t){if(!rs(e))throw Error(s(299));var r=!1,o="",l=ud;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=es(e,1,!1,null,null,r,!1,o,l),e[Ut]=t.current,Cr(e.nodeType===8?e.parentNode:e),new ns(t)},mt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=Ws(t),e=e===null?null:e.stateNode,e},mt.flushSync=function(e){return jn(e)},mt.hydrate=function(e,t,r){if(!ti(t))throw Error(s(200));return ni(null,e,t,!0,r)},mt.hydrateRoot=function(e,t,r){if(!rs(e))throw Error(s(405));var o=r!=null&&r.hydratedSources||null,l=!1,d="",f=ud;if(r!=null&&(r.unstable_strictMode===!0&&(l=!0),r.identifierPrefix!==void 0&&(d=r.identifierPrefix),r.onRecoverableError!==void 0&&(f=r.onRecoverableError)),t=ld(t,null,e,1,r??null,l,!1,d,f),e[Ut]=t.current,Cr(e),o)for(e=0;e<o.length;e++)r=o[e],l=r._getVersion,l=l(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,l]:t.mutableSourceEagerHydrationData.push(r,l);return new ei(t)},mt.render=function(e,t,r){if(!ti(t))throw Error(s(200));return ni(null,e,t,!1,r)},mt.unmountComponentAtNode=function(e){if(!ti(e))throw Error(s(40));return e._reactRootContainer?(jn(function(){ni(null,null,e,!1,function(){e._reactRootContainer=null,e[Ut]=null})}),!0):!1},mt.unstable_batchedUpdates=qa,mt.unstable_renderSubtreeIntoContainer=function(e,t,r,o){if(!ti(r))throw Error(s(200));if(e==null||e._reactInternals===void 0)throw Error(s(38));return ni(e,t,r,!1,o)},mt.version="18.3.1-next-f1338f8080-20240426",mt}var bd;function oh(){if(bd)return as.exports;bd=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(i){console.error(i)}}return a(),as.exports=rh(),as.exports}var kd;function ih(){if(kd)return oi;kd=1;var a=oh();return oi.createRoot=a.createRoot,oi.hydrateRoot=a.hydrateRoot,oi}var ah=ih();const ui={"common.save":"Save","common.cancel":"Cancel","common.delete":"Delete","common.edit":"Edit","common.close":"Close","common.confirm":"Confirm","common.loading":"Loading…","common.retry":"Retry","common.back":"Back","common.next":"Next","common.unknown":"Unknown","common.never":"Never","common.copy":"Copy","common.copied":"Copied","common.submit":"Submit","common.remove":"Remove","common.refresh":"Refresh","common.enabled":"Enabled","common.disabled":"Disabled","flowchat.policy.legend":"Workflow policy","flowchat.policy.allowAttachments":"Allow attachment references","flowchat.policy.allowStructuredHandoff":"Allow structured Agent handoff","flowchat.policy.maxRequestBytes":"Maximum request bytes","flowchat.policy.maxConcurrency":"Maximum concurrency","flowchat.policy.executionTimeout":"Execution timeout (seconds)","flowchat.policy.executionTimeoutAria":"Execution timeout","flowchat.policy.note":"These limits are persisted as non-secret channel policy and enforced by the FlowChat execution owner before workflow invocation.","flowchat.connection.title":"Platform connection","flowchat.connection.executionOwner":"Execution owner","flowchat.connection.endpointIdentity":"Endpoint identity","flowchat.connection.credential":"Credential","flowchat.connection.connected":"Connected","flowchat.connection.lastConnection":"Last connection","flowchat.connection.usage":"Usage","flowchat.connection.credentialActive":"active · {id}…","flowchat.connection.credentialRevoked":"revoked or unavailable","flowchat.connection.usageCount":"{count} authenticated requests","flowchat.connection.rotate":"Rotate credential…","flowchat.connection.disconnect":"Disconnect","flowchat.connection.disconnectConfirm":"Disconnect FlowChat and revoke its channel credential?","createChannel.modal.editTitle":"Edit Agent","createChannel.modal.createTitle":"Create Agent","createChannel.modal.editSubtitle":"Update this agent's profile, workflow binding, avatar, and runtime settings.","createChannel.modal.createSubtitle":"Set up a new agent, connect it to a workspace, and bind the workflow it should run.","createChannel.modal.saveChanges":"Save Changes","status.connected":"Connected","status.connecting":"Connecting…","status.disconnected":"Disconnected","status.error":"Connection error","status.unknown":"Unknown status","messageList.empty":"Start a conversation","messageList.scrollToBottom":"Scroll to bottom","messageList.newMessage":"New messages","chatWindow.title":"Conversation","chatWindow.placeholder":"Type a message…","chatWindow.newConversation":"New conversation","contextMemory.action.keep":"Keep","contextMemory.action.fold":"Fold","contextMemory.action.omit":"Auto-omit","contextMemory.mode.single_task":"Single task","contextMemory.mode.multi_task":"Multi task","contextMemory.applyError":"Failed to apply memory controls","contextMemory.limitReached":"Context limit reached","contextMemory.usage":"~{current} / {limit} chars","contextMemory.description":"The prompt has exceeded its budget. Choose how to retain each turn, then continue.","contextMemory.turn":"Turn {index}","contextMemory.chars":"{count} chars","contextMemory.recommended":"Recommended: {label}","contextMemory.projection":"Backend estimate: ~{chars} chars","contextMemory.applying":"Applying…","contextMemory.applyAndResume":"Apply and continue","channelList.title":"Agents","channelList.createChannel":"Create channel","channelList.deleteConfirm":'Delete channel "{name}"?',"channelList.deleteAria":"Delete {name}","channelList.deleteChannel":"Delete channel","channelList.boundWorkflow":"Bound workflow: {id}","channelList.empty":"No channels yet","login.subtitle":"Sign in to manage your channels","login.email":"Email","login.password":"Password","login.signingIn":"Signing in…","login.signIn":"Sign in","resetPassword.invalidLink":"The reset link is invalid. Please request a new password recovery email.","resetPassword.passwordMismatch":"The two passwords do not match.","resetPassword.doneTitle":"Password reset","resetPassword.doneSubtitle":"You can now sign in with your new password.","resetPassword.backToLogin":"Back to sign in","resetPassword.title":"Reset password","resetPassword.subtitle":"Enter a new password to recover your account.","resetPassword.newPassword":"New password","resetPassword.confirmPassword":"Confirm new password","resetPassword.missingToken":"The reset link is missing a token. Please request a new password recovery email.","resetPassword.submitting":"Submitting…","resetPassword.updatePassword":"Update password","flowchat.edit.saveError":"Failed to save changes.","flowchat.edit.revokeError":"Failed to revoke the key.","flowchat.edit.dismiss":"Dismiss","flowchat.edit.rotationTitle":"Replacement-first rotation","flowchat.edit.rotationHint":"Generate a fresh signed setup code for the same execution owner, then use Add Integration to import and confirm the replacement. The old key remains valid during this rollback window; revoke it only after the signed import succeeds.","flowchat.edit.close":"Close","flowchat.edit.sealedTitle":"Sealed connection","flowchat.edit.host":"Host","flowchat.edit.hostDevice":"Host device","flowchat.edit.lanEndpoint":"LAN endpoint","flowchat.edit.channelKey":"Channel key","flowchat.edit.delivery":"Delivery","flowchat.edit.unknownValue":"unknown","flowchat.edit.manualDelivery":"manual delivery","flowchat.edit.revokedTag":"revoked","flowchat.edit.deliveryLan":"LAN auto-delivery","flowchat.edit.deliveryManual":"manual code","flowchat.edit.keyHint":"The key exists only in the host device's vault. To rotate it, revoke below and pair again with a fresh setup code from the host.","flowchat.edit.integrationName":"Integration Name","flowchat.edit.agent":"Agent","flowchat.edit.handledBy":"FlowChat messages will be handled by {name}","flowchat.edit.revokeTitle":"Revoke channel key","flowchat.edit.revokeDesc":"Immediately invalidates key {id} on the host. The host keeps its vault entry but ChengFlow will reject it.","flowchat.edit.revoking":"Revoking…","flowchat.edit.confirmRevoke":"Confirm revoke","flowchat.edit.keepKey":"Keep key","flowchat.edit.revokeKey":"Revoke key…","flowchat.edit.cancel":"Cancel","flowchat.edit.saving":"Saving…","flowchat.edit.saveChanges":"Save changes","applink.createTitle":"Create {label}","applink.editTitle":"Edit {name}","telegram.edit.testConnected":"Bot connected — backend is polling for Telegram messages.","telegram.edit.updateFailed":"Update failed. Please try again.","telegram.edit.noAgents":"No agents available. Create an agent first before editing this integration.","telegram.edit.updatedTitle":"Integration Updated!","telegram.edit.updatedDesc":"{name} has been reconfigured and reconnected.","telegram.edit.routeToAgent":"Route To Agent","telegram.edit.routeTip":"Choose which agent should handle messages from this Telegram bot.","telegram.edit.selected":"Selected: {name}","telegram.edit.switchNotice":"Messages will switch from {from} to {to} after saving.","telegram.edit.currentAgentFallback":"the current agent","telegram.edit.botToken":"Bot Token","telegram.edit.botTokenTip":"Paste a fresh token to reconnect this bot or rotate credentials.","telegram.edit.botTokenHint":"Your existing token will be replaced. Get a new one from @BotFather if needed.","telegram.edit.testing":"Testing…","telegram.edit.testConnection":"Test connection","telegram.edit.saving":"Saving…","telegram.edit.saveReconnect":"Save & Reconnect","inputBar.removeFile":"Remove {name}","inputBar.addAttachment":"Add attachment","inputBar.addAttachmentTitle":"Add attachment (PDF / images / Word / Excel / audio & video, etc.)","inputBar.attachmentUnavailable":"The current workflow has no attachment upload node configured.","inputBar.selectChannel":"Select channel","inputBar.channels":"Channels","inputBar.sendMessage":"Send message","sessionList.status.running":"Running","sessionList.status.needsReview":"Needs review","sessionList.status.completed":"Completed","sessionList.status.failed":"Failed","sessionList.status.cancelled":"Cancelled","sessionList.status.reconnecting":"Reconnecting","sessionList.createdUnknown":"Creation time unknown","sessionList.createdAt":"Created at {time}","sessionList.title":"Conversations","sessionList.createConversation":"Create conversation","sessionList.statusAria":"{label}: {status}","sessionList.moreActionsFor":"More actions {label}","sessionList.moreActions":"More actions","sessionList.unpin":"Unpin","sessionList.pin":"Pin","sessionList.rename":"Rename","sessionList.empty":"No conversations yet","messageBubble.retry":"Retry","messageBubble.thinkOpen":"View thinking…","messageBubble.thinkClosed":"View thinking process","messageBubble.thinking":"Thinking…","messageBubble.thinkingLabel":"Thinking…","messageBubble.justNow":"Just now","messageBubble.minutesAgo":"{minutes} min ago","approval.presetSwitch":"Switch node preset","approval.approvedSession":"✓ Approved (always allow in this session)","approval.approved":"✓ Approved","approval.skipped":"⤼ Skipped","approval.rejected":"✗ Rejected","approval.suggestion":"Suggestion: {reason}","approval.feedbackPlaceholder":"Enter feedback (optional)…","approval.confirmSkip":"Confirm skip","approval.submitting":"Submitting…","approval.approveOnce":"Approve once","approval.alwaysAllow":"Always allow","approval.reject":"Reject","approval.skipWithFeedback":"Skip with feedback","agentReview.badge":"Review","agentReview.title":"Agent paused","agentReview.iteration":"Iteration {iteration}","agentReview.nextAction":"Next action","agentReview.waiting":"Saving the paused state, please wait…","agentReview.saving":"Saving…","agentReview.continuing":"Continuing…","agentReview.continue":"Continue","connPanel.loadingSetup":"Loading connection setup...","connPanel.unavailableTitle":"Connection Management Unavailable","connPanel.unavailableMsg":"This environment has not enabled adapter connection management APIs yet. Contact your administrator to configure the adapter registry.","connPanel.loadFailedTitle":"Could Not Load Connection Setup","connPanel.loadFailedMsg":"Failed to load connection configuration. Please try again.","connPanel.retry":"Retry","connPanel.connectedPolling":"Connected (Polling)","connPanel.refreshStatus":"Refresh Status","connPanel.webhookUrl":"Webhook URL","connPanel.disconnecting":"Disconnecting...","connPanel.disconnect":"Disconnect","connPanel.disconnectedMsg":"This channel has been disconnected. You can reconnect to resume receiving messages.","connPanel.reconnect":"Reconnect","connPanel.status.connected":"Connected","connPanel.status.degraded":"Degraded","connPanel.status.connecting":"Connecting...","connPanel.status.configuring":"Configuring","connPanel.status.awaitingSetup":"Awaiting Setup","connPanel.status.disconnected":"Disconnected","connPanel.status.error":"Error","connPanel.status.readyToConnect":"Ready to Connect","connPanel.capabilities":"Capabilities","connPanel.cap.directMessage":"Direct Message","connPanel.cap.groupChat":"Group Chat","connPanel.cap.mediaUpload":"Media Upload","connPanel.cap.mediaDownload":"Media Download","connPanel.cap.reactions":"Reactions","connPanel.cap.messageEdit":"Edit Messages","connPanel.cap.messageDelete":"Delete Messages","connPanel.cap.typingIndicator":"Typing Indicator","connPanel.cap.readReceipts":"Read Receipts","connPanel.cap.webhooks":"Webhooks","connPanel.cap.longPolling":"Long Polling","connPanel.copied":"Copied!","connPanel.copy":"Copy","connPanel.noConfigNeeded":"No additional configuration needed.","connPanel.connecting":"Connecting...","connPanel.connect":"Connect","connPanel.webhookInstructions":"Register the webhook URL in your platform console, then click Verify to confirm the connection.","connPanel.verifying":"Verifying...","connPanel.verifyConnection":"Verify Connection","connPanel.oauthInstructions":"Click below to open the OAuth authorization page. After granting access, return here — the connection will complete automatically.","connPanel.authorizeOAuth":"Authorize with OAuth","connPanel.qrInstructions":"Scan the QR code with your device to authenticate.","connPanel.generatingQr":"Generating QR...","connPanel.getQrCode":"Get QR Code","connPanel.awaitingOAuth":"Waiting for OAuth authorization to complete...","connPanel.awaitingQr":"Waiting for QR code scan...","connPanel.additionalInfo":"Additional information is required to complete the connection.","connPanel.verificationCode":"Verification Code","connPanel.verificationCodePlaceholder":"Enter verification code","connPanel.completing":"Completing...","connPanel.completeSetup":"Complete Setup","connPanel.workerNotRunning":"Bot token verified, but polling worker is not running. Try reconnecting.","connPanel.worker":"Worker","connPanel.workerRunning":"Running","connPanel.workerStopped":"Stopped","connPanel.lastPoll":"Last poll","connPanel.lastMessage":"Last message","flowchatPair.unrecognizedCode":"Unrecognized code.","flowchatPair.pairingFailed":"Pairing failed. Generate a fresh setup code on the host and try again.","flowchatPair.noAgentsTitle":"No agents yet","flowchatPair.noAgentsDesc":"Create an agent first, then come back to link it into FlowChat. An agent defines which workflow processes incoming messages.","flowchatPair.goToAgents":"Go to Agents","flowchatPair.pairedTitle":"FlowChat Paired!","flowchatPair.keySealedTitle":"Key Sealed — Deliver to Host","flowchatPair.existingNote":"An existing integration was found and re-paired. ","flowchatPair.mintedDesc":"{name} minted key {keyId} sealed to host {hostDevice}","flowchatPair.boundToAgent":", bound to agent {name}","flowchatPair.deliveredNotice":"The sealed package was delivered to the host over the LAN and imported into its vault. The key never left the host in plaintext.","flowchatPair.deliveryFailed":"Automatic delivery failed ({note}). ","flowchatPair.noLanEndpoint":"The host did not publish a reachable LAN endpoint. ","flowchatPair.manualHintRest":"Copy this sealed code and paste it into the FlowChat host app (Import sealed credential). Only that device can open it.","flowchatPair.copied":"Copied ✓","flowchatPair.copySealedCode":"Copy sealed code","flowchatPair.successHint":"Your integration is listed in Connected Integrations above. Use Manage to view connection details or revoke the key.","flowchatPair.howToTitle":"How to pair a FlowChat host","flowchatPair.clientName":"FlowChat desktop client","flowchatPair.step1":"Open the {client} on the device that will own the connection","flowchatPair.generateSetupCode":"Generate setup code","flowchatPair.step2":"In Host Mode, click {code}","flowchatPair.step3":"Copy the {code} code and paste it below (codes expire after ~10 minutes and are single-use)","flowchatPair.retry":"Retry","flowchatPair.integrationName":"Integration Name","flowchatPair.integrationNamePlaceholder":"Team FlowChat","flowchatPair.integrationNameHint":"A display name for this FlowChat integration","flowchatPair.agent":"Agent","flowchatPair.executionOwner":"Execution owner","flowchatPair.execLanHost":"LAN Host Device","flowchatPair.execCoordinator":"Hosted Coordinator (direct engine)","flowchatPair.execBridge":"Hosted Coordinator + Device Bridge","flowchatPair.executionHint":"Paste the signed setup identity issued by the selected Host, Coordinator KMS, or authorized bridge device.","flowchatPair.hostSetupCode":"Host Setup Code","flowchatPair.hostSetupCodeHint":" (from the FlowChat host app)","flowchatPair.deviceLabel":"device","flowchatPair.identityLabel":"identity","flowchatPair.lanDeliveryVia":"LAN delivery via","flowchatPair.manualDeliveryOnly":"manual delivery only","flowchatPair.hostExpired":"⚠ This code has expired — generate a fresh one on the host.","flowchatPair.hostExpires":"Expires {time} · signature verified on submit","flowchatPair.pairing":"Pairing...","flowchatPair.pairFlowChat":"Pair FlowChat","pairing.noAgentsTitle":"No agents yet","pairing.goToAgents":"Go to Agents","pairing.integrationName":"Integration Name","pairing.agent":"Agent","pairing.connecting":"Connecting...","telegramPair.noAgentsDesc":"Create an agent first, then come back to connect a Telegram bot to it. An agent defines which workflow processes incoming messages.","telegramPair.connectionFailed":"Connection failed. Please check your bot token and try again.","telegramPair.reconnectedTitle":"Telegram Reconnected!","telegramPair.connectedTitle":"Telegram Connected!","telegramPair.existingNote":"An existing integration was found and reconnected. ","telegramPair.activeDesc":"{name} is now active","telegramPair.asBot":" as {botInfo}","telegramPair.boundToAgent":", bound to agent {name}","telegramPair.pollingNotice":"The bot is listening for messages via polling — no public URL required.","telegramPair.successHint":"Your integration is listed in Connected Integrations above. Use Manage to view connection details.","telegramPair.howToTitle":"How to get your bot token","telegramPair.step1":"Open Telegram and search for {botFather}","telegramPair.step2":"Send {cmd} and follow the prompts to create your bot","telegramPair.step3":"Copy the API token BotFather provides and paste it below","telegramPair.integrationNamePlaceholder":"Support Bot","telegramPair.integrationNameHint":"A display name for this Telegram integration","telegramPair.handledBy":"Messages from this bot will be handled by {name}","telegramPair.botToken":"Bot Token","telegramPair.botTokenHint":" (from @BotFather)","telegramPair.botTokenSecretHint":"Keep this token secret — it grants full control over your bot","telegramPair.connectTelegram":"Connect Telegram","whatsappPair.noAgentsDesc":"Create an agent first, then come back to connect a WhatsApp integration. An agent defines which workflow processes incoming messages.","whatsappPair.connectionFailed":"Connection failed. Please check your configuration and try again.","whatsappPair.connectedTitle":"WhatsApp Connected!","whatsappPair.createdVerified":"{name} has been created and verified","whatsappPair.boundToAgent":", bound to agent {name}","whatsappPair.webhookBoxTitle":"Configure Meta Console Webhook","whatsappPair.webhookUrlLabel":"Webhook URL","whatsappPair.verifyTokenLabel":"Verify Token","whatsappPair.metaStep1":"Go to {metaDev} → your WhatsApp app → {config}","whatsappPair.metaStep2":"Under {webhook}, click {edit}","whatsappPair.metaStep3":"Paste the {webhookUrl} and {verifyToken} shown above","whatsappPair.metaStep4":"Click {verifyAndSave}","whatsappPair.metaStep5":"Subscribe to {messages} webhook field","whatsappPair.successHint":"After configuring the webhook in Meta Console, send a test WhatsApp message to verify the full integration is working.","whatsappPair.doneClose":"Done — Close","whatsappPair.beforeYouBegin":"Before you begin","whatsappPair.step1":"You need a {metaBiz} with a verified phone number in WhatsApp Business Platform","whatsappPair.step2":"Create a WhatsApp app in {metaDev} and note the {phoneId} and {accessToken}","whatsappPair.step3":"After connecting, you'll receive a {webhookUrl} to paste into Meta Console","whatsappPair.integrationNamePlaceholder":"Customer Support WA","whatsappPair.integrationNameHint":"A display name for this WhatsApp integration","whatsappPair.handledBy":"Messages from WhatsApp will be handled by {name}","whatsappPair.phoneNumberId":"Phone Number ID","whatsappPair.phoneNumberIdHint":"Found in Meta for Developers → WhatsApp → API Setup","whatsappPair.accessToken":"Access Token","whatsappPair.accessTokenHint":"Permanent or temporary access token from Meta app dashboard","whatsappPair.appSecret":"App Secret","whatsappPair.appSecretSuffix":" (signing secret)","whatsappPair.appSecretHint":"Found in Meta app → Settings → Basic → App Secret. Used to verify incoming webhook signatures.","whatsappPair.verifyToken":"Webhook Verify Token","whatsappPair.verifyTokenHint":"A string you choose — you'll enter this same value when configuring the webhook in Meta Console","whatsappPair.apiVersion":"API Version","whatsappPair.apiVersionHint":"WhatsApp Cloud API version — default is v21.0","whatsappPair.connectWhatsApp":"Connect WhatsApp","editPanel.updateFailed":"Update failed. Please try again.","editPanel.noAgents":"No agents available. Create an agent first before editing this integration.","editPanel.updatedTitle":"Integration Updated!","editPanel.routeToAgent":"Route To Agent","editPanel.switchNotice":"Messages will switch from {from} to {to} after saving.","editPanel.currentAgentFallback":"current agent","editPanel.testConnection":"Test Connection","editPanel.testing":"Testing...","editPanel.saving":"Saving...","editPanel.saveReconnect":"Save & Reconnect","editPanel.save":"Save","editPanel.agentBindingUpdated":"Agent binding updated.","editPanel.leaveBlankPlaceholder":"(leave blank to keep current)","waEdit.connectionVerified":"Connection verified — credentials accepted.","waEdit.reconfiguredReconnected":"reconfigured and reconnected","waEdit.updated":"updated","waEdit.updatedDesc":"{name} has been {status}.","waEdit.currentWebhookUrl":"Current Webhook URL","waEdit.routeTip":"Changing agent only updates routing — no need to re-enter credentials.","waEdit.phoneNumberId":"Phone Number ID","waEdit.phoneTip":"Pre-filled from your current configuration. Only change if the number changed.","waEdit.accessToken":"Access Token","waEdit.accessTip":"Leave blank to keep the existing token. Fill in only to rotate credentials.","waEdit.accessTokenPlaceholder":"EAAxxxxxxxx... (leave blank to keep current)","waEdit.appSecret":"App Secret","waEdit.appSecretTip":"Leave blank to keep the existing secret. Required when rotating Access Token.","waEdit.verifyToken":"Webhook Verify Token","waEdit.verifyTip":"Leave blank to keep the existing token. Required when rotating credentials.","waEdit.apiVersion":"API Version","waEdit.apiVersionTip":"WhatsApp Cloud API version — pre-filled from current configuration.","waEdit.credsHint":"Fill in Access Token + App Secret + Verify Token to reconnect. Leave them blank to only update the agent or other settings.","hooks.execFailed":"Workflow execution failed","hooks.execNoOutput":"The workflow returned no output (check that the workflow has nodes configured).","hooks.execNoNodes":"The workflow has no nodes — please add a node first.","hooks.execTimeout":"Workflow execution timed out","hooks.execNotFound":"Workflow or resource not found","hooks.newSession":"New conversation","hooks.reconnecting":"Reconnecting and confirming execution status…","hooks.execCancelled":"Execution cancelled","hooks.streamFailed":"Streaming output failed","hooks.approvalNeeded":"Action requires confirmation: {actionName}","hooks.sessionExpired":"Your session has expired. Please sign in again.","slackEdit.switchedMode":"Switched to {mode} and verified.","slackEdit.socketMode":"Socket Mode","slackEdit.webhookMode":"Webhook Mode","slackEdit.credsVerified":"Credentials verified — Slack integration is active.","slackEdit.connectionMode":"Connection Mode","slackEdit.webhook":"Webhook","slackEdit.switchWarn":"Switching from {from} to {to}. You must provide {creds} to complete the switch — saving will trigger a full reconnect.","slackEdit.credsWebhook":"Bot Token + Signing Secret","slackEdit.credsSocket":"Bot Token + App-Level Token","slackEdit.requestUrlLabel":"Event Subscriptions Request URL","slackEdit.requestUrlHint":"Paste this URL in your Slack app's {eventSubs} settings.","slackEdit.eventSubs":"Event Subscriptions","slackEdit.socketInfo":"Connected via Socket Mode — no Event Subscriptions Request URL needed. The backend maintains a persistent WebSocket to Slack.","slackEdit.botToken":"Bot Token","slackEdit.botTokenTip":"Leave blank to keep the existing token ({token}). Fill in only to rotate.","slackEdit.botTokenPlaceholder":"xoxb-... (leave blank to keep current)","slackEdit.signingSecret":"Signing Secret","slackEdit.signingSecretTipMode":"Required to activate Webhook Mode. Found in Basic Information → App Credentials.","slackEdit.signingSecretTip":"Leave blank to keep the existing secret. Fill in to rotate it independently.","slackEdit.signingSecretPlaceholderMode":"Required for Webhook Mode","slackEdit.appLevelToken":"App-Level Token","slackEdit.appTokenTipMode":"Required to activate Socket Mode. Generate in Basic Information → App-Level Tokens with connections:write scope.","slackEdit.appTokenTip":"Leave blank to keep the existing token (xapp-...). Fill in only to rotate.","slackEdit.appTokenPlaceholderMode":"xapp-... (required for Socket Mode)","slackEdit.appTokenPlaceholder":"xapp-... (leave blank to keep current)","slackEdit.appId":"App ID","slackEdit.fieldSavedOnReconnect":"Will be saved when you reconnect. Clear the field to remove it.","slackEdit.fieldNeedsCreds":"Provide credentials to make this editable. Not saved independently.","slackEdit.workspaceId":"Workspace ID","slackEdit.credsHintWebhook":"Fill in Bot Token or Signing Secret (or both) to reconnect. Leave blank to only update the agent.","slackEdit.credsHintSocket":"Fill in Bot Token or App-Level Token (or both) to reconnect. Leave blank to only update the agent.","slackEdit.blockedHint":"Mode change requires credentials to reconnect. Provide {creds} to proceed.","wcEdit.credsVerified":"Credentials verified — Corp Secret accepted.","wcEdit.callbackUrl":"Callback URL","wcEdit.callbackHint":"Paste this URL in WeCom Admin Console → App → {receiveMsgs}.","wcEdit.receiveMessages":"Receive Messages","wcEdit.stateConfiguring":"Credentials verified, but WeCom callback is not yet active. Configure the callback URL in WeCom Admin Console to complete the integration.","wcEdit.stateActive":"Callback is active — WeCom verification challenge has succeeded.","wcEdit.corpId":"Corp ID","wcEdit.corpIdTip":"Pre-filled from your current configuration. Update if the enterprise changed.","wcEdit.agentId":"Agent ID","wcEdit.agentIdTip":"Pre-filled from your current configuration.","wcEdit.corpSecret":"Corp Secret","wcEdit.corpSecretTip":"Leave blank to keep the existing secret. Fill in to rotate credentials.","wcEdit.token":"Token","wcEdit.tokenTip":"Leave blank to keep the existing token. Required when rotating Corp Secret.","wcEdit.encodingAesKey":"EncodingAESKey","wcEdit.encodingAesKeyTip":"Leave blank to keep the existing key. Required when rotating credentials.","wcEdit.receiveId":"Receive ID","wcEdit.receiveIdTip":"Optional. Used for signature verification. Defaults to Corp ID if blank.","wcEdit.receiveIdPlaceholder":"Defaults to Corp ID","wcEdit.credsHint":"Fill in Corp Secret + Token + EncodingAESKey to reconnect. Leave them blank to only update the agent or other settings.","dtEdit.streamRestarted":"Stream worker restarted — credentials accepted.","dtEdit.reconfiguredStream":"reconfigured — stream worker restarted","dtEdit.streamMode":"Stream Mode","dtEdit.lastEvent":"Last event: {time}","dtEdit.workerStoppedWarn":"Worker stopped unexpectedly. Provide credentials below and click {action} to restart the stream.","dtEdit.clientId":"Client ID","dtEdit.clientIdTip":"Pre-filled from current configuration. Update only if the app changed.","dtEdit.robotCode":"Robot Code","dtEdit.robotCodeTip":"Pre-filled from current configuration.","dtEdit.clientSecret":"Client Secret","dtEdit.clientSecretTip":"Leave blank to keep the existing secret. Fill to rotate credentials or restart the stream.","dtEdit.credsHint":"Fill in Client ID + Client Secret + Robot Code to restart the stream worker. Leave them blank to only update the agent.","createChannel.name":"Name","createChannel.namePlaceholder":"My Agent","createChannel.agentId":"Agent ID","createChannel.agentIdHint":" (lowercase letters, numbers, hyphens)","createChannel.agentIdPlaceholder":"my-agent","createChannel.workspace":"Workspace","createChannel.refresh":"Refresh","createChannel.loadingWorkspaces":"Loading workspaces...","createChannel.selectWorkspace":"Select workspace","createChannel.publishedWorkflow":"Published Workflow","createChannel.loadingWorkflows":"Loading published workflows...","createChannel.selectWorkflow":"Select published workflow","createChannel.noWorkflowsHint":"No active workflows found in this workspace. Create or activate a workflow first.","createChannel.appType":"App Type","createChannel.appTypePlaceholder":"whatsapp / telegram / slack","createChannel.agentAvatar":"Agent Avatar","createChannel.avatarHint":"The selected avatar will be saved with this agent and shown on the agent cards.","createChannel.description":"Description","createChannel.descriptionPlaceholder":"Optional description","createChannel.connectionConfig":"Connection Config","createChannel.cancel":"Cancel","createChannel.creating":"Creating...","createChannel.saving":"Saving...","createChannel.errorNameRequired":"Name is required","createChannel.errorChannelIdRequired":"Channel ID is required","createChannel.errorWorkspaceRequired":"Workspace ID is required","createChannel.errorWorkflowRequired":"Bound Workflow ID is required","createChannel.errorChannelIdPattern":"Channel ID must only contain lowercase letters, numbers, and hyphens","createChannel.errorDuplicateId":'Agent ID "{channelId}" already exists in this workspace',"createChannel.errorInvalidJson":"Connection config must be valid JSON","createChannel.errorCreateFailed":"Failed to create agent","createChannel.errorUpdateFailed":"Failed to update agent","createChannel.errorMissingApiBaseWorkspaces":"Missing apiBaseUrl, cannot load workspaces","createChannel.errorLoadWorkspaces":"Failed to load workspaces","createChannel.errorMissingApiBaseWorkflows":"Missing apiBaseUrl, cannot load workflows","createChannel.errorLoadWorkflows":"Failed to load published workflows","slackPair.noAgentsDesc":"Create an agent first, then come back to connect a Slack app. An agent defines which workflow processes incoming messages.","slackPair.connectionFailedWebhook":"Connection failed. Please check your Bot Token and Signing Secret.","slackPair.connectionFailedSocket":"Connection failed. Please check your Bot Token and App-Level Token.","slackPair.createFailed":"Failed to create the channel record. Please try again.","slackPair.connectedTitle":"Slack Connected!","slackPair.connectedDesc":"{name} has been created and verified","slackPair.boundToAgent":", bound to agent {name}","slackPair.modeWebhook":"Webhook Mode","slackPair.modeSocket":"Socket Mode","slackPair.eventSubsTitle":"Configure Slack Event Subscriptions","slackPair.requestUrl":"Request URL","slackPair.socketModeTitle":"Socket Mode — No Public URL Required","slackPair.successHintWebhook":"After configuring Event Subscriptions, mention your bot in a channel to verify the integration.","slackPair.successHintSocket":"Your bot is now connected via Socket Mode. Mention it in a channel or send a DM to verify.","slackPair.doneClose":"Done — Close","slackPair.createdWarnTitle":"Channel created, but connection failed","slackPair.createdWarnDesc":"{name} was created successfully, but the token validation failed","slackPair.createdWarnHint":"The channel is now listed in Connected Integrations — open Manage → Edit to fix the credentials and reconnect.","slackPair.connectionMode":"Connection Mode","slackPair.webhook":"Webhook","slackPair.socketModeBtn":"Socket Mode","slackPair.modeHintWebhook":"Requires a public HTTPS URL. Slack sends events to your server via HTTP.","slackPair.modeHintSocket":"No public URL needed. Backend maintains a persistent WebSocket to Slack.","slackPair.beforeYouBegin":"Before you begin","slackPair.whStep1":"Create a Slack app at {apiSlack} and install it to your workspace","slackPair.whStep2":"From {oauthPerms}, copy the {botToken} ({xoxb})","slackPair.whStep3":"From {basicInfo}, copy the {signingSecret}","slackPair.whStep4":"After connecting, paste the provided {requestUrl} into {eventSubs}","slackPair.smStep1":"Create a Slack app at {apiSlack} and install it to your workspace","slackPair.smStep2":"Go to {socketMode} in your app settings and {enableSocket}","slackPair.smStep3":"From {oauthPerms}, copy the {botToken} ({xoxb})","slackPair.smStep4":"From {basicInfoAppLevel}, generate a token with {connectionsWrite} scope — this is your {appLevelToken} ({xapp})","slackPair.smStep5":"Enable {eventSubs} and subscribe to the bot events you need (no Request URL needed)","slackPair.integrationNamePlaceholder":"Slack Support Bot","slackPair.integrationNameHint":"A display name for this Slack integration","slackPair.handledBy":"Messages from Slack will be handled by {name}","slackPair.botToken":"Bot Token","slackPair.botTokenHint":" (xoxb-...)","slackPair.botTokenFoundIn":"Found in {oauthPermsBotToken}. Keep this secret.","slackPair.signingSecret":"Signing Secret","slackPair.signingSecretFoundIn":"Found in {basicInfoSigningSecret}. Used to verify webhook signatures.","slackPair.appLevelToken":"App-Level Token","slackPair.appLevelTokenHint":" (xapp-...)","slackPair.appLevelTokenFoundIn":"Found in {basicInfoAppTokens}. Must have the {connectionsWrite} scope. Different from the Bot Token.","slackPair.appId":"App ID","slackPair.appIdOptional":" (optional)","slackPair.appIdFoundIn":"From {basicInfoAppId}","slackPair.workspaceId":"Workspace ID","slackPair.workspaceIdOptional":" (optional)","slackPair.workspaceIdHint":"Slack Workspace / Team ID","slackPair.connectSlack":"Connect Slack","slackPair.whConfigStep1":"Go to {apiSlack} → your app → {eventSubs}","slackPair.whConfigStep2":"Enable events and paste the {requestUrl} shown above","slackPair.whConfigStep3":"Under {subscribeBotEvents}, add: {appMention} and {messageIm} (add {messageChannels} to receive channel messages)","slackPair.whConfigStep4":"Go to {oauthPerms} and ensure scopes include: {chatWrite}, {appMentionsRead}, {imHistory}","slackPair.whConfigStep5":"Reinstall the app to your workspace to apply scope changes","slackPair.smConfigStep1":"Go to {apiSlack} → your app → {socketMode} and confirm it is {enabled}","slackPair.smConfigStep2":"Under {eventSubs}, enable events and subscribe to bot events: {appMention}, {messageIm}, {messageChannels}","slackPair.smConfigStep3":"Go to {oauthPerms} and ensure scopes include: {chatWrite}, {appMentionsRead}, {imHistory}, {connectionsWrite}","slackPair.smConfigStep4":"Reinstall the app to your workspace if you added new scopes","slackPair.smConfigStep5":"The backend is now listening via WebSocket — no Event Subscriptions Request URL needed","wecomPair.noAgentsDesc":"Create an agent first, then come back to connect a WeCom integration. An agent defines which workflow processes incoming messages.","wecomPair.createFailed":"Failed to create the channel record. Please try again.","wecomPair.connectionFailed":"Connection failed. Please check your Corp ID and Corp Secret.","wecomPair.connectedTitle":"WeCom Credentials Verified!","wecomPair.connectedDesc":"{name} has been created and the Corp Secret has been verified","wecomPair.boundToAgent":", bound to agent {name}","wecomPair.statusConfiguring":"Configuring — Awaiting Callback Setup","wecomPair.callbackConfigTitle":"Configure WeCom Admin Console Callback","wecomPair.callbackUrl":"Callback URL","wecomPair.token":"Token","wecomPair.encodingAesKey":"EncodingAESKey","wecomPair.wcStep1":"Log in to {wecomAdmin} → {appManagement} → select your custom app","wecomPair.wcStep2":"Under {receiveMessages}, click {set}","wecomPair.wcStep3":"Paste the {callbackUrl} into the URL field","wecomPair.wcStep4":"Enter the same {tokenLabel} and {aesKeyLabel} you configured above","wecomPair.wcStep5":"Click {save} — WeCom will send a GET challenge to verify the URL","wecomPair.wcStep6":"Once verified, the connection state will switch from {configuring} to {active}","wecomPair.successHint":"The connection is not fully active until WeCom Admin Console successfully verifies the callback URL. After saving the callback config, send a test message to confirm end-to-end flow.","wecomPair.doneClose":"Done — Close","wecomPair.createdWarnTitle":"Channel created, but connection failed","wecomPair.createdWarnDesc":"{name} was created successfully, but credential validation failed","wecomPair.createdWarnHint":"The channel is now listed in Connected Integrations — open Manage → Edit to fix the credentials and reconnect.","wecomPair.beforeYouBegin":"Before you begin","wecomPair.step1":"You need a {wecomEnterprise} with a created {customApp} (自建应用)","wecomPair.step2":"From {appManagement}, note the {corpId}, {agentId}, and {appSecret}","wecomPair.step3":"Create a {tokenLabel} and {aesKeyLabel} of your choice — you'll use these when configuring the callback in WeCom Admin Console","wecomPair.step4":"After connecting, you'll receive a {callbackUrl} to paste into the Receive Messages settings","wecomPair.integrationNamePlaceholder":"WeCom Customer Support","wecomPair.integrationNameHint":"A display name for this WeCom integration","wecomPair.handledBy":"Messages from WeCom will be handled by {name}","wecomPair.corpId":"Corp ID","wecomPair.corpIdHint":"Found in WeCom Admin Console → My Enterprise","wecomPair.agentId":"Agent ID","wecomPair.agentIdHint":"Found in App Management → your app → AgentId","wecomPair.corpSecret":"Corp Secret","wecomPair.corpSecretPlaceholder":"Your app's Corp Secret","wecomPair.corpSecretHint":"Found in App Management → your app → App Secret. Used to obtain access tokens.","wecomPair.tokenLabel":"Token","wecomPair.tokenHint":"A string you choose — enter this same value in WeCom callback settings","wecomPair.encodingAesKeyLabel":"EncodingAESKey","wecomPair.encodingAesKeyPlaceholder":"43-character AES key","wecomPair.encodingAesKeyHint":"43-char random key — enter this same value in WeCom callback settings","wecomPair.receiveId":"Receive ID","wecomPair.receiveIdOptional":" (optional)","wecomPair.receiveIdPlaceholder":"Defaults to Corp ID if blank","wecomPair.receiveIdHint":"Used as the receive_id in message verification. Defaults to Corp ID.","wecomPair.connectWeCom":"Connect WeCom","dingtalkPair.noAgentsDesc":"Create an agent first, then come back to connect a DingTalk integration. An agent defines which workflow processes incoming messages.","dingtalkPair.createFailed":"Failed to create the channel record. Please try again.","dingtalkPair.connectionFailed":"Connection failed. Please check your Client ID, Client Secret, and Robot Code.","dingtalkPair.connectedTitle":"DingTalk Connected!","dingtalkPair.connectedDesc":"{name} has been created and is now live","dingtalkPair.boundToAgent":", bound to agent {name}","dingtalkPair.streamMode":"Stream Mode","dingtalkPair.streamActiveTitle":"Stream Connection Active","dingtalkPair.robotCode":"Robot Code","dingtalkPair.status":"Status","dingtalkPair.statusConnected":"Connected","dingtalkPair.dtStep1":"The backend is now maintaining a {persistentWebSocket} to DingTalk — no public URL or callback configuration needed","dingtalkPair.dtStep2":"Verify the bot is working by sending a {directMessage} to your DingTalk App Bot","dingtalkPair.dtStep3":"For group chat, {mention} the bot — only @-mentioned messages are forwarded to the workflow","dingtalkPair.successHint":"The stream worker runs as long as the server is up. If the worker stops unexpectedly, use Manage → Edit → Test Connection to reconnect.","dingtalkPair.doneClose":"Done — Close","dingtalkPair.createdWarnTitle":"Channel created, but connection failed","dingtalkPair.createdWarnDesc":"{name} was created successfully, but the stream worker failed to start","dingtalkPair.createdWarnHint":"The channel is now listed in Connected Integrations — open Manage → Edit to fix the credentials and reconnect.","dingtalkPair.beforeYouBegin":"Before you begin","dingtalkPair.step1":"You need a {dingtalkPlatform} developer account with a created {appBot} (企业内部应用)","dingtalkPair.step2":"From your app's {appCredentials}, note the {clientId} (AppKey) and {clientSecret} (AppSecret)","dingtalkPair.step3":"From {appFeaturesBot}, enable the bot feature and note the {robotCode}","dingtalkPair.step4":"No callback URL configuration is needed — DingTalk Stream Mode connects outbound from the server","dingtalkPair.integrationNamePlaceholder":"DingTalk Support Bot","dingtalkPair.integrationNameHint":"A display name for this DingTalk integration","dingtalkPair.handledBy":"Messages from DingTalk will be handled by {name}","dingtalkPair.clientId":"Client ID","dingtalkPair.clientIdHint":" (AppKey)","dingtalkPair.clientIdFoundIn":"Found in App Credentials → Client ID","dingtalkPair.robotCodeLabel":"Robot Code","dingtalkPair.robotCodeFoundIn":"Found in App Features → Bot → Robot Code","dingtalkPair.clientSecret":"Client Secret","dingtalkPair.clientSecretHint":" (AppSecret)","dingtalkPair.clientSecretPlaceholder":"Your app's Client Secret","dingtalkPair.clientSecretFoundIn":"Found in App Credentials → Client Secret. Used for stream authentication.","dingtalkPair.connectDingTalk":"Connect DingTalk","appShell.loadingChannels":"Loading channels...","appShell.noChannels":"No channels yet.","appShell.createFirstChannel":"Create your first channel","appShell.expandSidebar":"Expand agents sidebar","appShell.collapseSidebar":"Collapse agents sidebar","appShell.agentsTitle":"Agents","appShell.agentsSubtitle":"Manage your agent roster, review workflow bindings, and launch any configured agent.","appShell.createAgent":"Create Agent","appShell.noAgentsYet":"No agents yet","appShell.noAgentsDesc":"Create your first agent to bind a workflow and start handling conversations.","appShell.edit":"Edit","appShell.delete":"Delete","appShell.noDescription":"No description yet. Open chat to interact with this agent.","appShell.workspace":"Workspace: {name}","appShell.workflow":"Workflow: {name}","appShell.created":"Created: {date}","appShell.confirmDeleteAgent":'Are you sure you want to delete Agent "{name}"? This cannot be undone.',"appShell.applinkTitle":"App Link Management","appShell.applinkSubtitle":"Manage platform integrations, view running status, filter by platform and take actions.","appShell.refreshList":"Refresh list","appShell.refresh":"Refresh","appShell.platformList":"{label} List","appShell.searchPlaceholder":"Search {label} name, ID...","appShell.createPlatform":"Create {label}","appShell.colName":"Connection Name","appShell.colStatus":"Status","appShell.colAgent":"Bound Agent","appShell.colWebhook":"Webhook / Description","appShell.colUpdated":"Updated","appShell.colActions":"Actions","appShell.unboundAgent":"Unbound Agent","appShell.lastEvent":"Last event {time}","appShell.resumeConnection":"Resume connection","appShell.pauseConnection":"Pause connection","appShell.refreshStatus":"Refresh status","appShell.editConnection":"Edit connection","appShell.deleteConnection":"Delete connection","appShell.noConnections":"{label} has no connections yet","appShell.noSearchMatch":'No connections matching "{search}"',"appShell.noPlatformConnections":"No {label} integration connections yet","appShell.confirmPause":"Are you sure you want to pause the connection for {name}? This will disconnect the current platform.","appShell.confirmDelete":"Are you sure you want to delete {name}? You will need to recreate the connection after deletion.","appShell.stateActive":"Running","appShell.stateDegraded":"Degraded","appShell.stateConfiguring":"Awaiting callback","appShell.statePending":"Pending config","appShell.stateError":"Failed","appShell.stateDisconnected":"Disconnected","appShell.stateDefault":"Not configured","appShell.settings":"Settings","appShell.settingsSubtitle":"Manage your account and preferences.","appShell.account":"Account","appShell.accountDesc":"You are currently logged in. Click below to sign out of your account.","appShell.signOut":"Sign Out","appShell.language":"Language","appShell.languageDesc":"Choose the display language for the interface.","appShell.navChat":"Chat","appShell.navAgents":"Agents","appShell.navAppLinks":"App Links","appShell.newSession":"New conversation","appShell.unknownDate":"Unknown","appShell.soon":"Soon"},sh={"common.save":"保存","common.cancel":"取消","common.delete":"删除","common.edit":"编辑","common.close":"关闭","common.confirm":"确认","common.loading":"加载中…","common.retry":"重试","common.back":"返回","common.next":"下一步","common.unknown":"未知","common.never":"从未","common.copy":"复制","common.copied":"已复制","common.submit":"提交","common.remove":"移除","common.refresh":"刷新","common.enabled":"已启用","common.disabled":"已禁用","flowchat.policy.legend":"工作流策略","flowchat.policy.allowAttachments":"允许附件引用","flowchat.policy.allowStructuredHandoff":"允许结构化 Agent 交接","flowchat.policy.maxRequestBytes":"最大请求字节数","flowchat.policy.maxConcurrency":"最大并发数","flowchat.policy.executionTimeout":"执行超时（秒）","flowchat.policy.executionTimeoutAria":"执行超时","flowchat.policy.note":"这些限制会作为非机密的渠道策略持久化保存，并由 FlowChat 执行方在调用工作流之前强制执行。","flowchat.connection.title":"平台连接","flowchat.connection.executionOwner":"执行方","flowchat.connection.endpointIdentity":"端点标识","flowchat.connection.credential":"凭据","flowchat.connection.connected":"已连接","flowchat.connection.lastConnection":"最近连接","flowchat.connection.usage":"使用情况","flowchat.connection.credentialActive":"有效 · {id}…","flowchat.connection.credentialRevoked":"已吊销或不可用","flowchat.connection.usageCount":"{count} 次已认证请求","flowchat.connection.rotate":"轮换凭据…","flowchat.connection.disconnect":"断开连接","flowchat.connection.disconnectConfirm":"断开 FlowChat 并吊销其渠道凭据？","createChannel.modal.editTitle":"编辑 Agent","createChannel.modal.createTitle":"创建 Agent","createChannel.modal.editSubtitle":"更新该 Agent 的资料、工作流绑定、头像和运行时设置。","createChannel.modal.createSubtitle":"创建一个新的 Agent，将其连接到工作空间，并绑定它要运行的工作流。","createChannel.modal.saveChanges":"保存更改","status.connected":"已连接","status.connecting":"连接中…","status.disconnected":"已断开","status.error":"连接错误","status.unknown":"未知状态","messageList.empty":"开始对话吧","messageList.scrollToBottom":"滚动到底部","messageList.newMessage":"新消息","chatWindow.title":"对话","chatWindow.placeholder":"输入消息...","chatWindow.newConversation":"新建对话","contextMemory.action.keep":"保留","contextMemory.action.fold":"折叠","contextMemory.action.omit":"自动省略","contextMemory.mode.single_task":"单任务","contextMemory.mode.multi_task":"多任务","contextMemory.applyError":"应用记忆控制失败","contextMemory.limitReached":"已达到上下文上限","contextMemory.usage":"~{current} / {limit} 字符","contextMemory.description":"提示词已超出预算。请选择每轮的保留方式，然后继续。","contextMemory.turn":"第 {index} 轮","contextMemory.chars":"{count} 字符","contextMemory.recommended":"推荐：{label}","contextMemory.projection":"后端预估：~{chars} 字符","contextMemory.applying":"应用中…","contextMemory.applyAndResume":"应用并继续","channelList.title":"智能体","channelList.createChannel":"创建渠道","channelList.deleteConfirm":'删除渠道 "{name}"？',"channelList.deleteAria":"删除 {name}","channelList.deleteChannel":"删除渠道","channelList.boundWorkflow":"绑定工作流：{id}","channelList.empty":"暂无渠道","login.subtitle":"登录以管理你的 Channels","login.email":"邮箱","login.password":"密码","login.signingIn":"登录中...","login.signIn":"登录","resetPassword.invalidLink":"重置链接无效，请重新申请密码找回邮件。","resetPassword.passwordMismatch":"两次输入的密码不一致。","resetPassword.doneTitle":"密码已重置","resetPassword.doneSubtitle":"现在可以使用新密码登录。","resetPassword.backToLogin":"返回登录","resetPassword.title":"重置密码","resetPassword.subtitle":"请输入新密码完成账号恢复。","resetPassword.newPassword":"新密码","resetPassword.confirmPassword":"确认新密码","resetPassword.missingToken":"重置链接缺少 token，请重新申请密码找回邮件。","resetPassword.submitting":"提交中...","resetPassword.updatePassword":"更新密码","flowchat.edit.saveError":"保存更改失败。","flowchat.edit.revokeError":"吊销密钥失败。","flowchat.edit.dismiss":"忽略","flowchat.edit.rotationTitle":"替换优先的轮换","flowchat.edit.rotationHint":"为同一执行方生成新的已签名设置码，然后使用“添加集成”导入并确认替换。旧密钥在此回滚窗口内仍然有效；仅在签名导入成功后再将其吊销。","flowchat.edit.close":"关闭","flowchat.edit.sealedTitle":"密封连接","flowchat.edit.host":"主机","flowchat.edit.hostDevice":"主机设备","flowchat.edit.lanEndpoint":"局域网端点","flowchat.edit.channelKey":"渠道密钥","flowchat.edit.delivery":"投递方式","flowchat.edit.unknownValue":"未知","flowchat.edit.manualDelivery":"手动投递","flowchat.edit.revokedTag":"已吊销","flowchat.edit.deliveryLan":"局域网自动投递","flowchat.edit.deliveryManual":"手动设置码","flowchat.edit.keyHint":"密钥仅存在于主机设备的保险库中。若要轮换，请在下方吊销，并使用主机上的新设置码重新配对。","flowchat.edit.integrationName":"集成名称","flowchat.edit.agent":"Agent","flowchat.edit.handledBy":"FlowChat 消息将由 {name} 处理","flowchat.edit.revokeTitle":"吊销渠道密钥","flowchat.edit.revokeDesc":"立即使主机上的密钥 {id} 失效。主机会保留其保险库条目，但 ChengFlow 将拒绝它。","flowchat.edit.revoking":"吊销中…","flowchat.edit.confirmRevoke":"确认吊销","flowchat.edit.keepKey":"保留密钥","flowchat.edit.revokeKey":"吊销密钥…","flowchat.edit.cancel":"取消","flowchat.edit.saving":"保存中…","flowchat.edit.saveChanges":"保存更改","applink.createTitle":"创建 {label}","applink.editTitle":"编辑 {name}","telegram.edit.testConnected":"机器人已连接 —— 后端正在轮询 Telegram 消息。","telegram.edit.updateFailed":"更新失败，请重试。","telegram.edit.noAgents":"暂无可用的 Agent。请先创建一个 Agent，再编辑此集成。","telegram.edit.updatedTitle":"集成已更新！","telegram.edit.updatedDesc":"{name} 已重新配置并重新连接。","telegram.edit.routeToAgent":"路由到 Agent","telegram.edit.routeTip":"选择由哪个 Agent 处理来自该 Telegram 机器人的消息。","telegram.edit.selected":"已选择：{name}","telegram.edit.switchNotice":"保存后，消息将从 {from} 切换到 {to}。","telegram.edit.currentAgentFallback":"当前 Agent","telegram.edit.botToken":"机器人 Token","telegram.edit.botTokenTip":"粘贴新的 Token 以重新连接此机器人或轮换凭据。","telegram.edit.botTokenHint":"你现有的 Token 将被替换。如有需要，请从 @BotFather 获取新的 Token。","telegram.edit.testing":"测试中...","telegram.edit.testConnection":"测试连接","telegram.edit.saving":"保存中...","telegram.edit.saveReconnect":"保存并重新连接","inputBar.removeFile":"移除 {name}","inputBar.addAttachment":"添加附件","inputBar.addAttachmentTitle":"添加附件（PDF / 图片 / Word / Excel / 音视频等）","inputBar.attachmentUnavailable":"当前工作流未配置附件上传节点","inputBar.selectChannel":"选择渠道","inputBar.channels":"渠道","inputBar.sendMessage":"发送消息","sessionList.status.running":"运行中","sessionList.status.needsReview":"待审核","sessionList.status.completed":"已完成","sessionList.status.failed":"失败","sessionList.status.cancelled":"已取消","sessionList.status.reconnecting":"重新连接中","sessionList.createdUnknown":"创建时间未知","sessionList.createdAt":"创建于 {time}","sessionList.title":"会话","sessionList.createConversation":"创建会话","sessionList.statusAria":"{label}：{status}","sessionList.moreActionsFor":"更多操作 {label}","sessionList.moreActions":"更多操作","sessionList.unpin":"取消置顶","sessionList.pin":"置顶","sessionList.rename":"重命名","sessionList.empty":"暂无会话","messageBubble.retry":"重试","messageBubble.thinkOpen":"查看思考中...","messageBubble.thinkClosed":"查看思考过程","messageBubble.thinking":"思考中...","messageBubble.thinkingLabel":"正在思考...","messageBubble.justNow":"刚刚","messageBubble.minutesAgo":"{minutes} 分钟前","approval.presetSwitch":"切换节点预设","approval.approvedSession":"✓ 已批准（本会话始终允许）","approval.approved":"✓ 已批准","approval.skipped":"⤼ 已跳过","approval.rejected":"✗ 已拒绝","approval.suggestion":"建议：{reason}","approval.feedbackPlaceholder":"请输入反馈（可选）…","approval.confirmSkip":"确认跳过","approval.submitting":"提交中…","approval.approveOnce":"批准一次","approval.alwaysAllow":"始终允许","approval.reject":"拒绝","approval.skipWithFeedback":"跳过并反馈","agentReview.badge":"审阅","agentReview.title":"智能体已暂停","agentReview.iteration":"第 {iteration} 轮迭代","agentReview.nextAction":"下一步操作","agentReview.waiting":"正在保存暂停状态，请稍候…","agentReview.saving":"保存中…","agentReview.continuing":"继续中…","agentReview.continue":"继续","connPanel.loadingSetup":"正在加载连接配置...","connPanel.unavailableTitle":"连接管理不可用","connPanel.unavailableMsg":"此环境尚未启用适配器连接管理 API。请联系管理员配置适配器注册表。","connPanel.loadFailedTitle":"无法加载连接配置","connPanel.loadFailedMsg":"加载连接配置失败，请重试。","connPanel.retry":"重试","connPanel.connectedPolling":"已连接（轮询）","connPanel.refreshStatus":"刷新状态","connPanel.webhookUrl":"Webhook URL","connPanel.disconnecting":"断开连接中...","connPanel.disconnect":"断开连接","connPanel.disconnectedMsg":"此渠道已断开连接。你可以重新连接以恢复接收消息。","connPanel.reconnect":"重新连接","connPanel.status.connected":"已连接","connPanel.status.degraded":"降级","connPanel.status.connecting":"连接中...","connPanel.status.configuring":"配置中","connPanel.status.awaitingSetup":"等待设置","connPanel.status.disconnected":"已断开","connPanel.status.error":"错误","connPanel.status.readyToConnect":"可连接","connPanel.capabilities":"功能","connPanel.cap.directMessage":"私信","connPanel.cap.groupChat":"群聊","connPanel.cap.mediaUpload":"媒体上传","connPanel.cap.mediaDownload":"媒体下载","connPanel.cap.reactions":"表情回应","connPanel.cap.messageEdit":"编辑消息","connPanel.cap.messageDelete":"删除消息","connPanel.cap.typingIndicator":"输入状态提示","connPanel.cap.readReceipts":"已读回执","connPanel.cap.webhooks":"Webhook","connPanel.cap.longPolling":"长轮询","connPanel.copied":"已复制！","connPanel.copy":"复制","connPanel.noConfigNeeded":"无需额外配置。","connPanel.connecting":"连接中...","connPanel.connect":"连接","connPanel.webhookInstructions":"在你的平台控制台中注册该 Webhook URL，然后点击“验证”以确认连接。","connPanel.verifying":"验证中...","connPanel.verifyConnection":"验证连接","connPanel.oauthInstructions":"点击下方按钮打开 OAuth 授权页面。授权后返回此处，连接将自动完成。","connPanel.authorizeOAuth":"使用 OAuth 授权","connPanel.qrInstructions":"使用你的设备扫描二维码以完成认证。","connPanel.generatingQr":"生成二维码中...","connPanel.getQrCode":"获取二维码","connPanel.awaitingOAuth":"等待 OAuth 授权完成...","connPanel.awaitingQr":"等待扫描二维码...","connPanel.additionalInfo":"需要提供更多信息才能完成连接。","connPanel.verificationCode":"验证码","connPanel.verificationCodePlaceholder":"请输入验证码","connPanel.completing":"完成中...","connPanel.completeSetup":"完成设置","connPanel.workerNotRunning":"机器人 Token 已验证，但轮询 worker 未运行。请尝试重新连接。","connPanel.worker":"Worker","connPanel.workerRunning":"运行中","connPanel.workerStopped":"已停止","connPanel.lastPoll":"最近轮询","connPanel.lastMessage":"最近消息","flowchatPair.unrecognizedCode":"无法识别的代码。","flowchatPair.pairingFailed":"配对失败。请在主机上生成新的设置码后重试。","flowchatPair.noAgentsTitle":"暂无 Agent","flowchatPair.noAgentsDesc":"请先创建一个 Agent，然后再回来将其接入 FlowChat。Agent 定义了由哪个工作流处理收到的消息。","flowchatPair.goToAgents":"前往 Agent 页面","flowchatPair.pairedTitle":"FlowChat 配对成功！","flowchatPair.keySealedTitle":"密钥已密封 —— 请投递到主机","flowchatPair.existingNote":"已找到现有集成并重新配对。 ","flowchatPair.mintedDesc":"{name} 已铸造密钥 {keyId}，并密封到主机 {hostDevice}","flowchatPair.boundToAgent":"，绑定到 Agent {name}","flowchatPair.deliveredNotice":"密封数据包已通过局域网投递到主机并导入其保险库。密钥从未以明文形式离开主机。","flowchatPair.deliveryFailed":"自动投递失败（{note}）。 ","flowchatPair.noLanEndpoint":"主机未发布可访问的局域网端点。 ","flowchatPair.manualHintRest":"复制此密封代码并粘贴到 FlowChat 主机应用中（导入密封凭据）。只有该设备才能打开它。","flowchatPair.copied":"已复制 ✓","flowchatPair.copySealedCode":"复制密封代码","flowchatPair.successHint":"你的集成已列在上方的“已连接集成”中。使用“管理”查看连接详情或吊销密钥。","flowchatPair.howToTitle":"如何配对 FlowChat 主机","flowchatPair.clientName":"FlowChat 桌面客户端","flowchatPair.step1":"在将拥有此连接的设备上打开 {client}","flowchatPair.generateSetupCode":"生成设置码","flowchatPair.step2":"在主机模式下，点击 {code}","flowchatPair.step3":"复制 {code} 代码并粘贴到下方（代码约 10 分钟后过期且仅可使用一次）","flowchatPair.retry":"重试","flowchatPair.integrationName":"集成名称","flowchatPair.integrationNamePlaceholder":"团队 FlowChat","flowchatPair.integrationNameHint":"此 FlowChat 集成的显示名称","flowchatPair.agent":"Agent","flowchatPair.executionOwner":"执行方","flowchatPair.execLanHost":"局域网主机设备","flowchatPair.execCoordinator":"托管协调器（直连引擎）","flowchatPair.execBridge":"托管协调器 + 设备桥接","flowchatPair.executionHint":"粘贴由所选主机、协调器 KMS 或授权桥接设备签发的已签名设置标识。","flowchatPair.hostSetupCode":"主机设置码","flowchatPair.hostSetupCodeHint":"（来自 FlowChat 主机应用）","flowchatPair.deviceLabel":"设备","flowchatPair.identityLabel":"标识","flowchatPair.lanDeliveryVia":"局域网投递通过","flowchatPair.manualDeliveryOnly":"仅手动投递","flowchatPair.hostExpired":"⚠ 此代码已过期 —— 请在主机上生成新的代码。","flowchatPair.hostExpires":"有效期至 {time} · 提交时验证签名","flowchatPair.pairing":"配对中...","flowchatPair.pairFlowChat":"配对 FlowChat","pairing.noAgentsTitle":"暂无 Agent","pairing.goToAgents":"前往 Agent 页面","pairing.integrationName":"集成名称","pairing.agent":"Agent","pairing.connecting":"连接中...","telegramPair.noAgentsDesc":"请先创建一个 Agent，然后再回来为其连接 Telegram 机器人。Agent 定义了由哪个工作流处理收到的消息。","telegramPair.connectionFailed":"连接失败。请检查你的机器人 Token 后重试。","telegramPair.reconnectedTitle":"Telegram 已重新连接！","telegramPair.connectedTitle":"Telegram 已连接！","telegramPair.existingNote":"已找到现有集成并重新连接。 ","telegramPair.activeDesc":"{name} 现已启用","telegramPair.asBot":"，身份为 {botInfo}","telegramPair.boundToAgent":"，绑定到 Agent {name}","telegramPair.pollingNotice":"机器人正在通过轮询监听消息 —— 无需公网 URL。","telegramPair.successHint":"你的集成已列在上方的“已连接集成”中。使用“管理”查看连接详情。","telegramPair.howToTitle":"如何获取你的机器人 Token","telegramPair.step1":"打开 Telegram 并搜索 {botFather}","telegramPair.step2":"发送 {cmd} 并按提示创建你的机器人","telegramPair.step3":"复制 BotFather 提供的 API Token 并粘贴到下方","telegramPair.integrationNamePlaceholder":"客服机器人","telegramPair.integrationNameHint":"此 Telegram 集成的显示名称","telegramPair.handledBy":"来自该机器人的消息将由 {name} 处理","telegramPair.botToken":"机器人 Token","telegramPair.botTokenHint":"（来自 @BotFather）","telegramPair.botTokenSecretHint":"请对该 Token 保密 —— 它拥有对你机器人的完全控制权。","telegramPair.connectTelegram":"连接 Telegram","whatsappPair.noAgentsDesc":"请先创建一个 Agent，然后再回来连接 WhatsApp 集成。Agent 定义了由哪个工作流处理收到的消息。","whatsappPair.connectionFailed":"连接失败。请检查你的配置后重试。","whatsappPair.connectedTitle":"WhatsApp 已连接！","whatsappPair.createdVerified":"{name} 已创建并通过验证","whatsappPair.boundToAgent":"，绑定到 Agent {name}","whatsappPair.webhookBoxTitle":"配置 Meta 控制台 Webhook","whatsappPair.webhookUrlLabel":"Webhook URL","whatsappPair.verifyTokenLabel":"验证 Token","whatsappPair.metaStep1":"前往 {metaDev} → 你的 WhatsApp 应用 → {config}","whatsappPair.metaStep2":"在 {webhook} 下，点击 {edit}","whatsappPair.metaStep3":"粘贴上方显示的 {webhookUrl} 和 {verifyToken}","whatsappPair.metaStep4":"点击 {verifyAndSave}","whatsappPair.metaStep5":"订阅 {messages} webhook 字段","whatsappPair.successHint":"在 Meta 控制台中配置好 Webhook 后，发送一条测试 WhatsApp 消息以验证整个集成是否正常工作。","whatsappPair.doneClose":"完成 —— 关闭","whatsappPair.beforeYouBegin":"开始之前","whatsappPair.step1":"你需要一个 {metaBiz}，并在 WhatsApp Business Platform 中拥有已验证的电话号码","whatsappPair.step2":"在 {metaDev} 中创建一个 WhatsApp 应用，并记下 {phoneId} 和 {accessToken}","whatsappPair.step3":"连接后，你将收到一个 {webhookUrl}，用于粘贴到 Meta 控制台","whatsappPair.integrationNamePlaceholder":"客户支持 WA","whatsappPair.integrationNameHint":"此 WhatsApp 集成的显示名称","whatsappPair.handledBy":"来自 WhatsApp 的消息将由 {name} 处理","whatsappPair.phoneNumberId":"电话号码 ID","whatsappPair.phoneNumberIdHint":"可在 Meta for Developers → WhatsApp → API Setup 中找到","whatsappPair.accessToken":"访问 Token","whatsappPair.accessTokenHint":"来自 Meta 应用面板的永久或临时访问 Token","whatsappPair.appSecret":"应用密钥","whatsappPair.appSecretSuffix":"（签名密钥）","whatsappPair.appSecretHint":"可在 Meta 应用 → 设置 → 基本 → 应用密钥 中找到。用于验证传入的 Webhook 签名。","whatsappPair.verifyToken":"Webhook 验证 Token","whatsappPair.verifyTokenHint":"你自行设定的字符串 —— 在 Meta 控制台中配置 Webhook 时需输入相同的值。","whatsappPair.apiVersion":"API 版本","whatsappPair.apiVersionHint":"WhatsApp Cloud API 版本 —— 默认为 v21.0","whatsappPair.connectWhatsApp":"连接 WhatsApp","editPanel.updateFailed":"更新失败，请重试。","editPanel.noAgents":"暂无可用的 Agent。请先创建一个 Agent，再编辑此集成。","editPanel.updatedTitle":"集成已更新！","editPanel.routeToAgent":"路由到 Agent","editPanel.switchNotice":"保存后，消息将从 {from} 切换到 {to}。","editPanel.currentAgentFallback":"当前 Agent","editPanel.testConnection":"测试连接","editPanel.testing":"测试中...","editPanel.saving":"保存中...","editPanel.saveReconnect":"保存并重新连接","editPanel.save":"保存","editPanel.agentBindingUpdated":"Agent 绑定已更新。","editPanel.leaveBlankPlaceholder":"（留空则保持当前值）","waEdit.connectionVerified":"连接已验证 —— 凭据已接受。","waEdit.reconfiguredReconnected":"重新配置并重新连接","waEdit.updated":"更新","waEdit.updatedDesc":"{name} 已{status}。","waEdit.currentWebhookUrl":"当前 Webhook URL","waEdit.routeTip":"更改 Agent 只会更新路由 —— 无需重新输入凭据。","waEdit.phoneNumberId":"电话号码 ID","waEdit.phoneTip":"已根据当前配置预填。仅在号码变更时才需修改。","waEdit.accessToken":"访问 Token","waEdit.accessTip":"留空则保持现有 Token。仅在轮换凭据时填写。","waEdit.accessTokenPlaceholder":"EAAxxxxxxxx...（留空则保持当前值）","waEdit.appSecret":"应用密钥","waEdit.appSecretTip":"留空则保持现有密钥。轮换访问 Token 时必填。","waEdit.verifyToken":"Webhook 验证 Token","waEdit.verifyTip":"留空则保持现有 Token。轮换凭据时必填。","waEdit.apiVersion":"API 版本","waEdit.apiVersionTip":"WhatsApp Cloud API 版本 —— 已根据当前配置预填。","waEdit.credsHint":"填写访问 Token + 应用密钥 + 验证 Token 以重新连接。留空则仅更新 Agent 或其他设置。","hooks.execFailed":"工作流执行失败","hooks.execNoOutput":"工作流未返回任何输出（请检查工作流是否配置了节点）","hooks.execNoNodes":"工作流没有节点，请先添加节点","hooks.execTimeout":"工作流执行超时","hooks.execNotFound":"工作流或资源未找到","hooks.newSession":"新会话","hooks.reconnecting":"正在重新连接并确认执行状态…","hooks.execCancelled":"执行已取消","hooks.streamFailed":"流式输出失败","hooks.approvalNeeded":"需要确认操作：{actionName}","hooks.sessionExpired":"登录已过期，请重新登录。","slackEdit.switchedMode":"已切换到{mode}并完成验证。","slackEdit.socketMode":"Socket 模式","slackEdit.webhookMode":"Webhook 模式","slackEdit.credsVerified":"凭据已验证 —— Slack 集成已激活。","slackEdit.connectionMode":"连接模式","slackEdit.webhook":"Webhook","slackEdit.switchWarn":"正在从 {from} 切换到 {to}。你必须提供 {creds} 才能完成切换 —— 保存将触发完整重新连接。","slackEdit.credsWebhook":"Bot Token + 签名密钥","slackEdit.credsSocket":"Bot Token + App-Level Token","slackEdit.requestUrlLabel":"事件订阅请求 URL","slackEdit.requestUrlHint":"将此 URL 粘贴到你的 Slack 应用的 {eventSubs} 设置中。","slackEdit.eventSubs":"事件订阅（Event Subscriptions）","slackEdit.socketInfo":"已通过 Socket 模式连接 —— 无需事件订阅请求 URL。后端会与 Slack 保持持久 WebSocket 连接。","slackEdit.botToken":"Bot Token","slackEdit.botTokenTip":"留空则保持现有 Token（{token}）。仅在轮换时填写。","slackEdit.botTokenPlaceholder":"xoxb-...（留空则保持当前值）","slackEdit.signingSecret":"签名密钥","slackEdit.signingSecretTipMode":"激活 Webhook 模式所必需。可在 Basic Information → App Credentials 中找到。","slackEdit.signingSecretTip":"留空则保持现有密钥。填写可单独轮换该密钥。","slackEdit.signingSecretPlaceholderMode":"Webhook 模式必填","slackEdit.appLevelToken":"App-Level Token","slackEdit.appTokenTipMode":"激活 Socket 模式所必需。请在 Basic Information → App-Level Tokens 中生成，需具备 connections:write 权限。","slackEdit.appTokenTip":"留空则保持现有 Token（xapp-...）。仅在轮换时填写。","slackEdit.appTokenPlaceholderMode":"xapp-...（Socket 模式必填）","slackEdit.appTokenPlaceholder":"xapp-...（留空则保持当前值）","slackEdit.appId":"App ID","slackEdit.fieldSavedOnReconnect":"将在你重新连接时保存。清空该字段可将其移除。","slackEdit.fieldNeedsCreds":"提供凭据后才可编辑此项。不会单独保存。","slackEdit.workspaceId":"工作区 ID","slackEdit.credsHintWebhook":"填写 Bot Token 或签名密钥（或两者）以重新连接。留空则仅更新 Agent。","slackEdit.credsHintSocket":"填写 Bot Token 或 App-Level Token（或两者）以重新连接。留空则仅更新 Agent。","slackEdit.blockedHint":"更改模式需要凭据才能重新连接。请提供 {creds} 以继续。","wcEdit.credsVerified":"凭据已验证 —— Corp Secret 已接受。","wcEdit.callbackUrl":"回调 URL","wcEdit.callbackHint":"将此 URL 粘贴到企业微信管理后台 → 应用 → {receiveMsgs} 中。","wcEdit.receiveMessages":"接收消息","wcEdit.stateConfiguring":"凭据已验证，但企业微信回调尚未激活。请在企业微信管理后台配置回调 URL 以完成集成。","wcEdit.stateActive":"回调已激活 —— 企业微信验证质询已成功。","wcEdit.corpId":"Corp ID","wcEdit.corpIdTip":"已根据当前配置预填。如企业变更请更新。","wcEdit.agentId":"Agent ID","wcEdit.agentIdTip":"已根据当前配置预填。","wcEdit.corpSecret":"Corp Secret","wcEdit.corpSecretTip":"留空则保持现有密钥。填写可轮换凭据。","wcEdit.token":"Token","wcEdit.tokenTip":"留空则保持现有 Token。轮换 Corp Secret 时必填。","wcEdit.encodingAesKey":"EncodingAESKey","wcEdit.encodingAesKeyTip":"留空则保持现有密钥。轮换凭据时必填。","wcEdit.receiveId":"Receive ID","wcEdit.receiveIdTip":"可选。用于签名验证。留空时默认使用 Corp ID。","wcEdit.receiveIdPlaceholder":"默认使用 Corp ID","wcEdit.credsHint":"填写 Corp Secret + Token + EncodingAESKey 以重新连接。留空则仅更新 Agent 或其他设置。","dtEdit.streamRestarted":"Stream worker 已重启 —— 凭据已接受。","dtEdit.reconfiguredStream":"重新配置 —— Stream worker 已重启","dtEdit.streamMode":"Stream 模式","dtEdit.lastEvent":"最近事件：{time}","dtEdit.workerStoppedWarn":"Worker 意外停止。请在下方提供凭据并点击 {action} 以重启 stream。","dtEdit.clientId":"Client ID","dtEdit.clientIdTip":"已根据当前配置预填。仅在应用变更时才需更新。","dtEdit.robotCode":"Robot Code","dtEdit.robotCodeTip":"已根据当前配置预填。","dtEdit.clientSecret":"Client Secret","dtEdit.clientSecretTip":"留空则保持现有密钥。填写可轮换凭据或重启 stream。","dtEdit.credsHint":"填写 Client ID + Client Secret + Robot Code 以重启 stream worker。留空则仅更新 Agent。","createChannel.name":"名称","createChannel.namePlaceholder":"我的 Agent","createChannel.agentId":"Agent ID","createChannel.agentIdHint":"（小写字母、数字、连字符）","createChannel.agentIdPlaceholder":"my-agent","createChannel.workspace":"工作空间","createChannel.refresh":"刷新","createChannel.loadingWorkspaces":"正在加载工作空间...","createChannel.selectWorkspace":"选择工作空间","createChannel.publishedWorkflow":"已发布工作流","createChannel.loadingWorkflows":"正在加载已发布工作流...","createChannel.selectWorkflow":"选择已发布工作流","createChannel.noWorkflowsHint":"此工作空间中没有活跃的工作流。请先创建或激活一个工作流。","createChannel.appType":"应用类型","createChannel.appTypePlaceholder":"whatsapp / telegram / slack","createChannel.agentAvatar":"Agent 头像","createChannel.avatarHint":"选中的头像将与此 Agent 一起保存，并显示在 Agent 卡片上。","createChannel.description":"描述","createChannel.descriptionPlaceholder":"可选描述","createChannel.connectionConfig":"连接配置","createChannel.cancel":"取消","createChannel.creating":"创建中...","createChannel.saving":"保存中...","createChannel.errorNameRequired":"名称为必填项","createChannel.errorChannelIdRequired":"Channel ID 为必填项","createChannel.errorWorkspaceRequired":"工作空间 ID 为必填项","createChannel.errorWorkflowRequired":"绑定工作流 ID 为必填项","createChannel.errorChannelIdPattern":"Channel ID 只能包含小写字母、数字和连字符","createChannel.errorDuplicateId":'Agent ID "{channelId}" 在此工作空间中已存在',"createChannel.errorInvalidJson":"连接配置必须是有效的 JSON","createChannel.errorCreateFailed":"创建 Agent 失败","createChannel.errorUpdateFailed":"更新 Agent 失败","createChannel.errorMissingApiBaseWorkspaces":"缺少 apiBaseUrl，无法加载工作空间","createChannel.errorLoadWorkspaces":"加载工作空间失败","createChannel.errorMissingApiBaseWorkflows":"缺少 apiBaseUrl，无法加载工作流","createChannel.errorLoadWorkflows":"加载已发布工作流失败","slackPair.noAgentsDesc":"请先创建一个 Agent，然后再回来连接 Slack 应用。Agent 定义了处理消息的工作流。","slackPair.connectionFailedWebhook":"连接失败。请检查您的 Bot Token 和 Signing Secret。","slackPair.connectionFailedSocket":"连接失败。请检查您的 Bot Token 和 App-Level Token。","slackPair.createFailed":"创建频道记录失败。请重试。","slackPair.connectedTitle":"Slack 已连接！","slackPair.connectedDesc":"{name} 已创建并验证通过","slackPair.boundToAgent":"，绑定到 Agent {name}","slackPair.modeWebhook":"Webhook 模式","slackPair.modeSocket":"Socket 模式","slackPair.eventSubsTitle":"配置 Slack 事件订阅","slackPair.requestUrl":"请求 URL","slackPair.socketModeTitle":"Socket 模式 — 无需公网 URL","slackPair.successHintWebhook":"配置事件订阅后，在频道中 @提及您的机器人以验证集成。","slackPair.successHintSocket":"您的机器人已通过 Socket 模式连接。在频道中 @提及它或发送私信来验证。","slackPair.doneClose":"完成 — 关闭","slackPair.createdWarnTitle":"频道已创建，但连接失败","slackPair.createdWarnDesc":"{name} 已成功创建，但令牌验证失败","slackPair.createdWarnHint":"该频道现已列在已连接集成中 — 打开 管理 → 编辑 以修复凭据并重新连接。","slackPair.connectionMode":"连接模式","slackPair.webhook":"Webhook","slackPair.socketModeBtn":"Socket 模式","slackPair.modeHintWebhook":"需要公网 HTTPS URL。Slack 通过 HTTP 将事件发送到您的服务器。","slackPair.modeHintSocket":"无需公网 URL。后端维护与 Slack 的持久 WebSocket 连接。","slackPair.beforeYouBegin":"开始之前","slackPair.whStep1":"在 {apiSlack} 创建一个 Slack 应用并安装到您的工作空间","slackPair.whStep2":"从 {oauthPerms} 复制 {botToken}（{xoxb}）","slackPair.whStep3":"从 {basicInfo} 复制 {signingSecret}","slackPair.whStep4":"连接后，将提供的 {requestUrl} 粘贴到 {eventSubs} 中","slackPair.smStep1":"在 {apiSlack} 创建一个 Slack 应用并安装到您的工作空间","slackPair.smStep2":"前往应用设置中的 {socketMode} 并{enableSocket}","slackPair.smStep3":"从 {oauthPerms} 复制 {botToken}（{xoxb}）","slackPair.smStep4":"从 {basicInfoAppLevel} 生成一个带有 {connectionsWrite} 权限的令牌 — 这就是您的 {appLevelToken}（{xapp}）","slackPair.smStep5":"启用 {eventSubs} 并订阅您需要的机器人事件（无需请求 URL）","slackPair.integrationNamePlaceholder":"Slack 客服机器人","slackPair.integrationNameHint":"此 Slack 集成的显示名称","slackPair.handledBy":"来自 Slack 的消息将由 {name} 处理","slackPair.botToken":"Bot Token","slackPair.botTokenHint":"（xoxb-...）","slackPair.botTokenFoundIn":"在 {oauthPermsBotToken} 中找到。请妥善保管。","slackPair.signingSecret":"Signing Secret","slackPair.signingSecretFoundIn":"在 {basicInfoSigningSecret} 中找到。用于验证 Webhook 签名。","slackPair.appLevelToken":"App-Level Token","slackPair.appLevelTokenHint":"（xapp-...）","slackPair.appLevelTokenFoundIn":"在 {basicInfoAppTokens} 中找到。必须具有 {connectionsWrite} 权限。与 Bot Token 不同。","slackPair.appId":"App ID","slackPair.appIdOptional":"（可选）","slackPair.appIdFoundIn":"来自 {basicInfoAppId}","slackPair.workspaceId":"工作空间 ID","slackPair.workspaceIdOptional":"（可选）","slackPair.workspaceIdHint":"Slack 工作空间 / 团队 ID","slackPair.connectSlack":"连接 Slack","slackPair.whConfigStep1":"前往 {apiSlack} → 您的应用 → {eventSubs}","slackPair.whConfigStep2":"启用事件并粘贴上方的 {requestUrl}","slackPair.whConfigStep3":"在 {subscribeBotEvents} 下，添加：{appMention} 和 {messageIm}（添加 {messageChannels} 以接收频道消息）","slackPair.whConfigStep4":"前往 {oauthPerms} 并确保权限范围包括：{chatWrite}、{appMentionsRead}、{imHistory}","slackPair.whConfigStep5":"重新安装应用到您的工作空间以应用权限更改","slackPair.smConfigStep1":"前往 {apiSlack} → 您的应用 → {socketMode} 并确认已{enabled}","slackPair.smConfigStep2":"在 {eventSubs} 下，启用事件并订阅机器人事件：{appMention}、{messageIm}、{messageChannels}","slackPair.smConfigStep3":"前往 {oauthPerms} 并确保权限范围包括：{chatWrite}、{appMentionsRead}、{imHistory}、{connectionsWrite}","slackPair.smConfigStep4":"如果添加了新权限，请重新安装应用到您的工作空间","slackPair.smConfigStep5":"后端现在正通过 WebSocket 监听 — 无需事件订阅请求 URL","wecomPair.noAgentsDesc":"请先创建一个 Agent，然后再回来连接企业微信集成。Agent 定义了处理消息的工作流。","wecomPair.createFailed":"创建频道记录失败。请重试。","wecomPair.connectionFailed":"连接失败。请检查您的 Corp ID 和 Corp Secret。","wecomPair.connectedTitle":"企业微信凭据已验证！","wecomPair.connectedDesc":"{name} 已创建，Corp Secret 已验证通过","wecomPair.boundToAgent":"，绑定到 Agent {name}","wecomPair.statusConfiguring":"配置中 — 等待回调设置","wecomPair.callbackConfigTitle":"配置企业微信管理后台回调","wecomPair.callbackUrl":"回调 URL","wecomPair.token":"Token","wecomPair.encodingAesKey":"EncodingAESKey","wecomPair.wcStep1":"登录 {wecomAdmin} → {appManagement} → 选择您的自建应用","wecomPair.wcStep2":"在 {receiveMessages} 下，点击 {set}","wecomPair.wcStep3":"将 {callbackUrl} 粘贴到 URL 字段中","wecomPair.wcStep4":"输入与上方配置相同的 {tokenLabel} 和 {aesKeyLabel}","wecomPair.wcStep5":"点击 {save} — 企业微信将发送 GET 验证请求以验证 URL","wecomPair.wcStep6":"验证通过后，连接状态将从 {configuring} 切换为 {active}","wecomPair.successHint":"在企业微信管理后台成功验证回调 URL 之前，连接尚未完全激活。保存回调配置后，请发送测试消息以确认端到端流程。","wecomPair.doneClose":"完成 — 关闭","wecomPair.createdWarnTitle":"频道已创建，但连接失败","wecomPair.createdWarnDesc":"{name} 已成功创建，但凭据验证失败","wecomPair.createdWarnHint":"该频道现已列在已连接集成中 — 打开 管理 → 编辑 以修复凭据并重新连接。","wecomPair.beforeYouBegin":"开始之前","wecomPair.step1":"您需要一个 {wecomEnterprise}，并已创建 {customApp}（自建应用）","wecomPair.step2":"从 {appManagement} 记下 {corpId}、{agentId} 和 {appSecret}","wecomPair.step3":"创建您自选的 {tokenLabel} 和 {aesKeyLabel} — 配置企业微信管理后台回调时需要使用","wecomPair.step4":"连接后，您将收到一个 {callbackUrl} 以粘贴到接收消息设置中","wecomPair.integrationNamePlaceholder":"企业微信客服","wecomPair.integrationNameHint":"此企业微信集成的显示名称","wecomPair.handledBy":"来自企业微信的消息将由 {name} 处理","wecomPair.corpId":"Corp ID","wecomPair.corpIdHint":"在企业微信管理后台 → 我的企业 中找到","wecomPair.agentId":"Agent ID","wecomPair.agentIdHint":"在应用管理 → 您的应用 → AgentId 中找到","wecomPair.corpSecret":"Corp Secret","wecomPair.corpSecretPlaceholder":"您应用的 Corp Secret","wecomPair.corpSecretHint":"在应用管理 → 您的应用 → App Secret 中找到。用于获取访问令牌。","wecomPair.tokenLabel":"Token","wecomPair.tokenHint":"您自选的字符串 — 在企业微信回调设置中输入相同的值","wecomPair.encodingAesKeyLabel":"EncodingAESKey","wecomPair.encodingAesKeyPlaceholder":"43 字符 AES 密钥","wecomPair.encodingAesKeyHint":"43 字符随机密钥 — 在企业微信回调设置中输入相同的值","wecomPair.receiveId":"Receive ID","wecomPair.receiveIdOptional":"（可选）","wecomPair.receiveIdPlaceholder":"留空则默认使用 Corp ID","wecomPair.receiveIdHint":"用作消息验证中的 receive_id。留空则默认使用 Corp ID。","wecomPair.connectWeCom":"连接企业微信","dingtalkPair.noAgentsDesc":"请先创建一个 Agent，然后再回来连接钉钉集成。Agent 定义了处理消息的工作流。","dingtalkPair.createFailed":"创建频道记录失败。请重试。","dingtalkPair.connectionFailed":"连接失败。请检查您的 Client ID、Client Secret 和 Robot Code。","dingtalkPair.connectedTitle":"钉钉已连接！","dingtalkPair.connectedDesc":"{name} 已创建并已上线","dingtalkPair.boundToAgent":"，绑定到 Agent {name}","dingtalkPair.streamMode":"Stream 模式","dingtalkPair.streamActiveTitle":"Stream 连接已激活","dingtalkPair.robotCode":"Robot Code","dingtalkPair.status":"状态","dingtalkPair.statusConnected":"已连接","dingtalkPair.dtStep1":"后端正在维护与钉钉的 {persistentWebSocket} — 无需公网 URL 或回调配置","dingtalkPair.dtStep2":"向您的钉钉应用机器人发送一条 {directMessage} 来验证机器人是否正常工作","dingtalkPair.dtStep3":"在群聊中{mention}机器人 — 只有 @提及 的消息才会转发到工作流","dingtalkPair.successHint":"只要服务器运行，Stream worker 就会持续运行。如果 worker 意外停止，请使用 管理 → 编辑 → 测试连接 来重新连接。","dingtalkPair.doneClose":"完成 — 关闭","dingtalkPair.createdWarnTitle":"频道已创建，但连接失败","dingtalkPair.createdWarnDesc":"{name} 已成功创建，但 Stream worker 启动失败","dingtalkPair.createdWarnHint":"该频道现已列在已连接集成中 — 打开 管理 → 编辑 以修复凭据并重新连接。","dingtalkPair.beforeYouBegin":"开始之前","dingtalkPair.step1":"您需要一个 {dingtalkPlatform} 开发者账号，并已创建 {appBot}（企业内部应用）","dingtalkPair.step2":"从您应用的 {appCredentials} 记下 {clientId}（AppKey）和 {clientSecret}（AppSecret）","dingtalkPair.step3":"从 {appFeaturesBot} 启用机器人功能并记下 {robotCode}","dingtalkPair.step4":"无需回调 URL 配置 — 钉钉 Stream 模式从服务器向外连接","dingtalkPair.integrationNamePlaceholder":"钉钉客服机器人","dingtalkPair.integrationNameHint":"此钉钉集成的显示名称","dingtalkPair.handledBy":"来自钉钉的消息将由 {name} 处理","dingtalkPair.clientId":"Client ID","dingtalkPair.clientIdHint":"（AppKey）","dingtalkPair.clientIdFoundIn":"在应用凭据 → Client ID 中找到","dingtalkPair.robotCodeLabel":"Robot Code","dingtalkPair.robotCodeFoundIn":"在应用功能 → 机器人 → Robot Code 中找到","dingtalkPair.clientSecret":"Client Secret","dingtalkPair.clientSecretHint":"（AppSecret）","dingtalkPair.clientSecretPlaceholder":"您应用的 Client Secret","dingtalkPair.clientSecretFoundIn":"在应用凭据 → Client Secret 中找到。用于 Stream 认证。","dingtalkPair.connectDingTalk":"连接钉钉","appShell.loadingChannels":"正在加载频道...","appShell.noChannels":"暂无频道。","appShell.createFirstChannel":"创建您的第一个频道","appShell.expandSidebar":"展开 Agent 侧边栏","appShell.collapseSidebar":"收起 Agent 侧边栏","appShell.agentsTitle":"Agents","appShell.agentsSubtitle":"管理您的 Agent 列表，查看工作流绑定，并启动任何已配置的 Agent。","appShell.createAgent":"创建 Agent","appShell.noAgentsYet":"暂无 Agent","appShell.noAgentsDesc":"创建您的第一个 Agent 以绑定工作流并开始处理对话。","appShell.edit":"编辑","appShell.delete":"删除","appShell.noDescription":"暂无描述。打开聊天以与此 Agent 交互。","appShell.workspace":"工作空间: {name}","appShell.workflow":"工作流: {name}","appShell.created":"创建时间: {date}","appShell.confirmDeleteAgent":'确定要删除 Agent "{name}" 吗？删除后无法恢复。',"appShell.applinkTitle":"App Link 管理","appShell.applinkSubtitle":"管理各平台接入连接，查看运行状态，按平台筛选并操作。","appShell.refreshList":"刷新列表","appShell.refresh":"刷新","appShell.platformList":"{label} 列表","appShell.searchPlaceholder":"搜索 {label} 名称、ID...","appShell.createPlatform":"创建 {label}","appShell.colName":"连接名称","appShell.colStatus":"状态","appShell.colAgent":"绑定 Agent","appShell.colWebhook":"Webhook / 描述","appShell.colUpdated":"更新时间","appShell.colActions":"操作","appShell.unboundAgent":"未绑定 Agent","appShell.lastEvent":"最近事件 {time}","appShell.resumeConnection":"恢复连接","appShell.pauseConnection":"暂停连接","appShell.refreshStatus":"刷新状态","appShell.editConnection":"编辑连接","appShell.deleteConnection":"删除连接","appShell.noConnections":"{label} 暂无连接","appShell.noSearchMatch":'没有匹配 "{search}" 的连接',"appShell.noPlatformConnections":"当前还没有 {label} 接入连接","appShell.confirmPause":"确定要暂停 {name} 的连接吗？这会断开当前平台连接。","appShell.confirmDelete":"确定删除 {name} 吗？删除后需要重新创建连接。","appShell.stateActive":"运行中","appShell.stateDegraded":"异常","appShell.stateConfiguring":"待回调","appShell.statePending":"待配置","appShell.stateError":"失败","appShell.stateDisconnected":"已断开","appShell.stateDefault":"未配置","appShell.settings":"设置","appShell.settingsSubtitle":"管理您的账户和偏好设置。","appShell.account":"账户","appShell.accountDesc":"您当前已登录。点击下方按钮以退出账户。","appShell.signOut":"退出登录","appShell.language":"语言","appShell.languageDesc":"选择界面显示语言。","appShell.navChat":"聊天","appShell.navAgents":"Agents","appShell.navAppLinks":"App Links","appShell.newSession":"新会话","appShell.unknownDate":"未知","appShell.soon":"即将推出"},Wd="chengflow-app-locale",hi={"en-US":ui,"zh-CN":sh},Fd=["zh-CN","en-US"],ch={"zh-CN":"中文","en-US":"English"};let ir="en-US";const xs=new Set;function lh(){if(typeof window>"u")return"en-US";const a=window.localStorage?.getItem(Wd);return a&&a in hi?a:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en-US"}ir=lh();function Od(a,i){return i?a.replace(/\{(\w+)\}/g,(s,u)=>u in i?String(i[u]):s):a}function kt(a,i){const u=(hi[ir]??ui)[a]??ui[a]??a;return Od(u,i)}function ne(a,i){const s=[],u=/\{(\w+)\}/g;let p=0,h=0,m;for(;(m=u.exec(a))!==null;){m.index>p&&s.push(a.slice(p,m.index));const c=m[1];c in i?s.push(n.jsx(g.Fragment,{children:i[c]},h++)):s.push(m[0]),p=u.lastIndex}return p<a.length&&s.push(a.slice(p)),s}function Ud(a){!(a in hi)||a===ir||(ir=a,typeof window<"u"&&(window.localStorage?.setItem(Wd,a),document.documentElement.lang=a),xs.forEach(i=>i(a)))}function dh(a){return xs.add(a),()=>xs.delete(a)}const Bd=g.createContext(null);function _s({children:a,locale:i}){const[s,u]=g.useState(()=>i??ir),p=g.useCallback(m=>{Ud(m),u(m)},[]);g.useEffect(()=>{i&&i!==s&&p(i)},[i,s,p]),g.useEffect(()=>dh(m=>u(m)),[]),g.useEffect(()=>{typeof document<"u"&&(document.documentElement.lang=s)},[s]);const h=g.useMemo(()=>({locale:s,t:(m,c)=>Od(hi[s][m]??ui[m]??m,c),setLocale:p,availableLocales:Fd}),[s,p]);return n.jsx(Bd.Provider,{value:h,children:a})}function Ie(){const a=g.useContext(Bd);return a||{locale:ir,t:kt,setLocale:Ud,availableLocales:Fd}}const di="cheng_access_token",ls="cheng_refresh_token";class Be{constructor(i){this.apiBaseUrl=i}apiBaseUrl;async getAccessToken(){return this.getAccessTokenSync()}getAccessTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(di)}getRefreshTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(ls)}storeTokens(i,s){typeof window>"u"||(window.localStorage.setItem(di,i),s&&window.localStorage.setItem(ls,s))}clearTokens(){typeof window>"u"||(window.localStorage.removeItem(di),window.localStorage.removeItem(ls))}async refreshAccessToken(){const i=this.getRefreshTokenSync();if(!i)return null;const s=await fetch(`${this.apiBaseUrl}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:i})});if(!s.ok)return null;const u=await s.json().catch(()=>null),p=u?.token??u?.access_token??null;return p?(this.storeTokens(p,u?.refresh_token),p):null}}const qr="cheng:auth-expired";function Hd(){new Be("").clearTokens()}function An(a="expired"){Hd(),!(typeof window>"u")&&window.dispatchEvent(new CustomEvent(qr,{detail:{reason:a}}))}class ks{constructor(i){this.apiBaseUrl=i,this.session=new Be(i)}apiBaseUrl;session;async login(i){const s=await fetch(`${this.apiBaseUrl}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!s.ok){const p=await s.json().catch(()=>({}));throw new Error(p.message??p.error??`Login failed (${s.status})`)}const u=await s.json();return this.session.storeTokens(u.token,u.refresh_token),u}async resetPassword(i){const s=await fetch(`${this.apiBaseUrl}/auth/password/reset`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!s.ok){const u=await s.json().catch(()=>({}));throw new Error(u.message??u.error??`Reset password failed (${s.status})`)}}async refresh(){const i=await this.session.refreshAccessToken();return i||An("refresh-failed"),i}logout(){Hd()}getAccessToken(){return this.session.getAccessTokenSync()}getRefreshToken(){return this.session.getRefreshTokenSync()}isAuthenticated(){return!!this.getAccessToken()}}class $d{apiBaseUrl;workspaceId;contractWarnedKeys;tokenProvider;constructor(i,s){this.apiBaseUrl=i.apiBaseUrl,this.workspaceId=i.workspaceId.trim(),this.contractWarnedKeys=new Set,this.tokenProvider=s??new Be(i.apiBaseUrl)}assertWorkspaceId(){if(!this.workspaceId)throw new Pt("VALIDATION_ERROR","workspaceId is required in ChannelConfig",422)}async execute(i,s,u,p,h,m){this.assertWorkspaceId();const c={app_id:i,external_user_id:(h||"web-user").trim(),external_chat_id:(p||`web-session-${Date.now()}`).trim(),mode:"workflow_chat",workflow_id:s,extra_context:{channel_id:i}},x=await this.resolveConversation(this.workspaceId,c),y=this._extractConversationId(x),j=await this.createMessage(y,{role:"user",content:u,attachments:m&&m.length>0?m:void 0}),S=this._extractExecutionId(j);return this._normalizeExecuteData({conversation_id:y,workflow_id:s,execution_id:S})}async workflowSupportsAttachments(i){try{const s=await this._fetch(`/workflows/${i}`,"GET");return(s?.definition?.nodes??s?.data?.definition?.nodes??[]).some(p=>p?.nodeType==="io/file_upload"||p?.node_type==="io/file_upload")}catch{return!1}}async resolveConversation(i,s){if(!i?.trim())throw new Pt("VALIDATION_ERROR","workspaceId is required to resolve a conversation",422);return this._fetch(`/workspaces/${i}/conversations/resolve`,"POST",s)}async getConversationMessages(i){const s=await this._fetch(`/conversations/${i}/messages`,"GET");return(Array.isArray(s)?s:Array.isArray(s?.data)?s.data:Array.isArray(s?.data?.items)?s.data.items:Array.isArray(s?.items)?s.items:[]).map(p=>({id:p.id??p.messageId??"",role:p.role??"assistant",content:p.content??"",createdAt:p.createdAt??p.created_at??new Date().toISOString(),executionId:p.executionId??p.execution_id}))}async createMessage(i,s){return this._fetch(`/conversations/${i}/messages`,"POST",s)}async submitApproval(i,s,u,p="once",h){return this._fetch(`/executions/${encodeURIComponent(i)}/approve`,"POST",{requestId:s,decision:u,scope:p,reason:h||null})}async resumeExecution(i){return this._fetch(`/executions/${encodeURIComponent(i)}/resume`,"POST")}async bulkUpdateMemoryControls(i,s,u){const p={updates:s};return u&&(p.trimming_mode=u),this._fetch(`/conversations/${encodeURIComponent(i)}/memory-controls`,"PATCH",p)}async getExecution(i){const s=await this._fetch(`/executions/${encodeURIComponent(i)}`,"GET"),u=s?.data??s,p=u?.error??u?.error_info??u?.errorInfo;return{executionId:u?.executionId??u?.execution_id??u?.id??i,status:u?.status??u?.state??"unknown",conversationId:u?.conversationId??u?.conversation_id,workflowId:u?.workflowId??u?.workflow_id,createdAt:u?.createdAt??u?.created_at,startedAt:u?.startedAt??u?.started_at,completedAt:u?.completedAt??u?.completed_at,updatedAt:u?.updatedAt??u?.updated_at,error:typeof p=="string"?p:p?{message:p.message??"Execution failed",code:p.code,details:p.details}:void 0,resultAvailable:u?.resultAvailable??u?.result_available??u?.result!=null,result:u?.result,review:u?.review??u?.review_payload,approval:u?.approval??u?.approval_payload}}async getExecutionResult(i){return this._fetch(`/executions/${encodeURIComponent(i)}/result`,"GET")}async _fetch(i,s,u){const p=`${this.apiBaseUrl}${i}`;try{const h={"Content-Type":"application/json"},m=await this.tokenProvider.getAccessToken();if(!m)throw An("missing-access-token"),new Pt("UNAUTHORIZED","Access token is missing",401);const c=u!==void 0?JSON.stringify(u):void 0,x=async S=>{const M={...h,Authorization:`Bearer ${S}`};return fetch(p,{method:s,headers:M,body:c})};let y=await x(m),j=!1;if(y.status===401&&this.tokenProvider.refreshAccessToken){const S=await this.tokenProvider.refreshAccessToken().catch(()=>null);S?y=await x(S):(An("refresh-failed"),j=!0)}return y.ok||await this._handleError(y,j),y.json()}catch(h){throw h instanceof Pt?h:new Pt("NETWORK_ERROR",h instanceof Error?h.message:"Unknown network error",0)}}_extractConversationId(i){const s=i&&typeof i=="object"?i:{},u=s.data&&typeof s.data=="object"?s.data:s,p=u.id??u.conversation_id??u.conversationId;if(typeof p!="string"||!p)throw new Pt("UNKNOWN_ERROR","Conversation resolve response missing conversation id",500,i);return p}_extractExecutionId(i){const s=i&&typeof i=="object"?i:{},u=s.data&&typeof s.data=="object"?s.data:s,p=s.metadata&&typeof s.metadata=="object"?s.metadata:u.metadata&&typeof u.metadata=="object"?u.metadata:null,h=p?.execution_id??p?.executionId??u.execution_id??u.executionId??null;return typeof h=="string"?h:null}_normalizeExecuteData(i){const s=i&&typeof i=="object"?i:{},u=s.conversation_id??s.conversationId,p=s.workflow_id??s.workflowId,h=s.execution_id??s.executionId??null;(u===void 0||p===void 0)&&this._warnContract("execute-missing-fields","[contract-guard] execute response missing expected fields: conversation_id/workflow_id");const c=Object.keys(s).filter(x=>x.includes("_"));return c.length>0&&this._warnContract("execute-snake-keys",`[contract-guard] execute response contains snake_case keys: ${c.join(", ")}`),{conversation_id:typeof u=="string"?u:"",workflow_id:typeof p=="string"?p:"",execution_id:typeof h=="string"?h:null}}_warnContract(i,s){this.contractWarnedKeys.has(i)||(this.contractWarnedKeys.add(i),console.warn(s))}async _handleError(i,s){const u=i.status;let p;try{p=await i.json()}catch{p={message:i.statusText}}const h=p.message||p.error||"Unknown error";switch(u){case 401:throw s||An("channel-unauthorized"),new Pt("UNAUTHORIZED","Access token is invalid or expired",u,p);case 404:throw new Pt("NOT_FOUND","Resource not found",u,p);case 422:throw new Pt("VALIDATION_ERROR",h,u,p);case 429:throw new Pt("RATE_LIMIT","Too many requests",u,p);case 500:case 502:case 503:case 504:throw new Pt("SERVER_ERROR","Server error, please try again later",u,p);default:throw new Pt("UNKNOWN_ERROR",h,u,p)}}}class Pt extends Error{constructor(i,s,u,p){super(s),this.code=i,this.status=u,this.details=p,this.name="ChannelClientError"}code;status;details}class Kd{storage;sessionKey;conversationKey;sessionsKey;conversationMapKey;constructor(i,s){this.storage=s||(typeof window<"u"?window.localStorage:new uh),this.sessionKey=`cheng_session_${i}`,this.conversationKey=`cheng_conversation_${i}`,this.sessionsKey=`cheng_sessions_${i}`,this.conversationMapKey=`cheng_conversation_map_${i}`}getOrCreateSessionId(){let i=this.storage.getItem(this.sessionKey);return i||(i=this._generateUUID(),this.storage.setItem(this.sessionKey,i)),this._ensureCurrentSessionListed(i),i}resetSession(){const i=this._generateUUID();return this.storage.setItem(this.sessionKey,i),this.storage.removeItem(this.conversationKey),this._ensureCurrentSessionListed(i),i}setConversationId(i){this.storage.setItem(this.conversationKey,i);const s=this.getOrCreateSessionId(),u=this._getConversationMap();u[s]=i,this._setConversationMap(u),this._updateSession(s,{conversationId:i})}getConversationId(){const i=this.storage.getItem(this.sessionKey),s=this._getConversationMap();if(i&&s[i])return s[i];const u=this.storage.getItem(this.conversationKey);return i&&u&&(s[i]=u,this._setConversationMap(s),this._updateSession(i,{conversationId:u})),u}clearConversationId(){this.storage.removeItem(this.conversationKey);const i=this.storage.getItem(this.sessionKey);if(!i)return;const s=this._getConversationMap();delete s[i],this._setConversationMap(s),this._updateSession(i,{conversationId:void 0})}clear(){this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey),this.storage.removeItem(this.sessionsKey),this.storage.removeItem(this.conversationMapKey)}listSessions(){const i=this.storage.getItem(this.sessionsKey),s=this.storage.getItem(this.sessionKey),u=this._getConversationMap();if(!i){if(!s)return[];const p={id:s,label:"Session 1",createdAt:new Date().toISOString(),conversationId:u[s],pinned:!1};return this.storage.setItem(this.sessionsKey,JSON.stringify([p])),[p]}try{const h=JSON.parse(i).map(c=>({...c,conversationId:u[c.id]??c.conversationId}));s&&!h.some(c=>c.id===s)&&h.unshift({id:s,label:`Session ${h.length+1}`,createdAt:new Date().toISOString(),conversationId:u[s],pinned:!1});const m=[...h.filter(c=>c.pinned),...h.filter(c=>!c.pinned)];return this.storage.setItem(this.sessionsKey,JSON.stringify(m)),m}catch{return[]}}createSession(i){const s=this.listSessions(),u=this._generateUUID(),p=i??`Session ${s.length+1}`,h={id:u,label:p,createdAt:new Date().toISOString(),pinned:!1};return s.unshift(h),this.storage.setItem(this.sessionsKey,JSON.stringify(s)),this.storage.setItem(this.sessionKey,u),this.storage.removeItem(this.conversationKey),h}renameSession(i,s){const u=s.trim();u&&this._updateSession(i,{label:u})}togglePinSession(i){const s=this.listSessions().find(u=>u.id===i);s&&this._updateSession(i,{pinned:!s.pinned})}deleteSession(i){let s=this.listSessions();const u=this.storage.getItem(this.sessionKey);if(s=s.filter(h=>h.id!==i),this.storage.setItem(this.sessionsKey,JSON.stringify(s)),u===i)if(s.length>0){this.storage.setItem(this.sessionKey,s[0].id);const m=this._getConversationMap()[s[0].id];m?this.storage.setItem(this.conversationKey,m):this.storage.removeItem(this.conversationKey)}else this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey);const p=this._getConversationMap();delete p[i],this._setConversationMap(p)}getActiveSessionId(){return this.getOrCreateSessionId()}setActiveSessionId(i){this.storage.setItem(this.sessionKey,i),this._ensureCurrentSessionListed(i);const u=this._getConversationMap()[i];u?this.storage.setItem(this.conversationKey,u):this.storage.removeItem(this.conversationKey)}_getConversationMap(){const i=this.storage.getItem(this.conversationMapKey);if(!i)return{};try{return JSON.parse(i)}catch{return{}}}_setConversationMap(i){this.storage.setItem(this.conversationMapKey,JSON.stringify(i))}_updateSession(i,s){const p=this.listSessions().map(h=>h.id===i?{...h,...s}:h);this.storage.setItem(this.sessionsKey,JSON.stringify(p))}_ensureCurrentSessionListed(i){const s=this.listSessions();if(s.some(p=>p.id===i))return;const u=[{id:i,label:`Session ${s.length+1}`,createdAt:new Date().toISOString(),conversationId:this._getConversationMap()[i],pinned:!1},...s];this.storage.setItem(this.sessionsKey,JSON.stringify(u))}_generateUUID(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,i=>{const s=Math.random()*16|0;return(i==="x"?s:s&3|8).toString(16)})}}let uh=class{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(i){return this.data.get(i)??null}key(i){return Array.from(this.data.keys())[i]??null}removeItem(i){this.data.delete(i)}setItem(i,s){this.data.set(i,s)}};const ph=new Set(["completed_unread","failed_unread","cancelled"]);function hh(a){switch(String(a??"").toLowerCase()){case"pending":case"queued":case"created":return"pending";case"running":case"in_progress":case"started":return"running";case"paused":case"waiting_for_review":case"waiting_for_approval":case"review":return"waiting_for_review";case"completed":case"succeeded":case"success":return"completed_unread";case"failed":case"error":return"failed_unread";case"cancelled":case"canceled":return"cancelled";default:return"unknown"}}function gh(a){return hh(a.status)}const fn=a=>ph.has(a),yd=2,ds=200,fh=720*60*60*1e3,Kr=a=>typeof a=="object"&&a!==null,Vr=a=>a==="paused"?"waiting_for_review":a==="completed"?"completed_unread":a==="failed"?"failed_unread":a;class En{storage;recordsKey;legacyActiveKey;constructor(i,s){this.storage=s??(typeof window<"u"?window.localStorage:new mh),this.recordsKey=`cheng_execution_mappings_${i}`,this.legacyActiveKey=`cheng_active_execution_${i}`}setActive(i){const s=new Date().toISOString(),u={...i,sessionId:i.sessionId??i.externalChatId,status:Vr(i.status??"pending"),createdAt:i.createdAt??s,updatedAt:i.updatedAt??s};return this.mutate(p=>{p.records[u.executionId]=u,p.activeByConversation[u.conversationId]=u.executionId}),this.safeSet(this.legacyActiveKey,u.executionId),u}upsert(i){const s={...i,sessionId:i.sessionId??i.externalChatId,status:Vr(i.status)};return this.mutate(u=>{u.records[i.executionId]=s,this.isActive(s.status)?u.activeByConversation[i.conversationId]=i.executionId:u.activeByConversation[i.conversationId]===i.executionId&&delete u.activeByConversation[i.conversationId]}),s}getActive(){const i=this.safeGet(this.legacyActiveKey);if(i){const s=this.getByExecutionId(i);if(s&&this.isActive(s.status))return s}return this.listRecoverable().find(s=>this.isActive(s.status))??null}getActiveForConversation(i){return this.findActiveByConversation(i)}getByExecutionId(i){return this.read().records[i]??null}findActiveByConversation(i){const s=this.read(),u=s.activeByConversation[i]&&s.records[s.activeByConversation[i]];return u&&this.isActive(u.status)?u:this.sorted(s.records).find(p=>p.conversationId===i&&this.isActive(p.status))??null}findBySession(i){return this.sorted(this.read().records).filter(s=>(s.sessionId??s.externalChatId)===i)}findLatestByConversation(i){return this.sorted(this.read().records).find(s=>s.conversationId===i)??null}listRecoverable(){return this.sorted(this.read().records).filter(i=>!i.acknowledgedAt||this.isActive(i.status))}listAll(){return this.sorted(this.read().records)}updateStatus(i,s,u={}){let p=null;return this.mutate(h=>{const m=h.records[i];m&&(p={...m,...u,status:Vr(s),updatedAt:new Date().toISOString()},h.records[i]=p,fn(p.status)&&h.activeByConversation[m.conversationId]===i&&delete h.activeByConversation[m.conversationId])}),p}acknowledge(i){return this.updateStatus(i,"idle",{acknowledgedAt:new Date().toISOString()})}clearActive(i){this.mutate(s=>{for(const[u,p]of Object.entries(s.activeByConversation))p===i&&delete s.activeByConversation[u]}),this.safeGet(this.legacyActiveKey)===i&&this.safeRemove(this.legacyActiveKey)}clearExecution(i){const s=this.getByExecutionId(i);s&&fn(Vr(s.status))?this.clearActive(i):this.removeExecution(i)}removeExecution(i){this.mutate(s=>{delete s.records[i];for(const[u,p]of Object.entries(s.activeByConversation))p===i&&delete s.activeByConversation[u]}),this.safeGet(this.legacyActiveKey)===i&&this.safeRemove(this.legacyActiveKey)}clearConversation(i){this.mutate(s=>{for(const[u,p]of Object.entries(s.records))p.conversationId===i&&delete s.records[u];delete s.activeByConversation[i]})}cleanup(i=Date.now()){this.mutate(s=>{const u=this.sorted(s.records).filter((p,h)=>h<ds&&(this.isActive(p.status)||i-Date.parse(p.updatedAt)<=fh));s.records=Object.fromEntries(u.map(p=>[p.executionId,p]));for(const[p,h]of Object.entries(s.activeByConversation))s.records[h]||delete s.activeByConversation[p]})}clear(){this.safeRemove(this.recordsKey),this.safeRemove(this.legacyActiveKey)}isActive(i){return["pending","running","waiting_for_review","unknown","paused"].includes(i)}sorted(i){return Object.values(i).sort((s,u)=>Date.parse(u.updatedAt)-Date.parse(s.updatedAt))}mutate(i){const s=this.read();i(s),s.revision++,this.prune(s),this.safeSet(this.recordsKey,JSON.stringify(s))}prune(i){const s=this.sorted(i.records);s.length>ds&&(i.records=Object.fromEntries(s.slice(0,ds).map(u=>[u.executionId,u])))}read(){const i={version:yd,revision:0,records:{},activeByConversation:{}},s=this.safeGet(this.recordsKey);if(!s)return i;try{const u=JSON.parse(s),p=Kr(u)&&u.version===yd&&Kr(u.records)?u.records:u;if(!Kr(p))return i;for(const h of Object.values(p)){if(!Kr(h))continue;const m=typeof h.boundWorkflowId=="string"?h.boundWorkflowId:h.workflowId;if(![h.channelId,m,h.conversationId,h.executionId,h.externalChatId,h.status,h.createdAt,h.updatedAt].every(j=>typeof j=="string"))continue;const c=h,{workflowId:x,...y}=c;i.records[c.executionId]={...y,boundWorkflowId:m,sessionId:c.sessionId??c.externalChatId,status:Vr(c.status)},this.isActive(c.status)&&(i.activeByConversation[c.conversationId]=c.executionId)}return Kr(u)&&typeof u.revision=="number"&&(i.revision=u.revision),i}catch{return i}}safeGet(i){try{return this.storage.getItem(i)}catch{return null}}safeSet(i,s){try{this.storage.setItem(i,s)}catch{}}safeRemove(i){try{this.storage.removeItem(i)}catch{}}}class mh{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(i){return this.data.get(i)??null}key(i){return[...this.data.keys()][i]??null}removeItem(i){this.data.delete(i)}setItem(i,s){this.data.set(i,s)}}const xh="cheng:execution-invalidated";function _h(a){typeof window<"u"&&window.dispatchEvent(new CustomEvent(xh,{detail:a}));try{if(typeof BroadcastChannel<"u"){const i=new BroadcastChannel("cheng-executions-v2");i.postMessage(a),i.close()}}catch{}}class Vd{config;ws=null;status="disconnected";eventHandlers=new Map;statusHandlers=new Set;activeSubscriptions=new Set;reconnectTimer=null;reconnectAttempts=0;shouldReconnect=!0;_wsGeneration=0;heartbeatTimer=null;heartbeatTimeoutTimer=null;lastPongTime=0;messageQueue=[];contractWarnedKeys=new Set;constructor(i){this.config={url:i.url,tokenProvider:i.tokenProvider,reconnect:i.reconnect??!0,reconnectInterval:i.reconnectInterval??1e3,reconnectMaxInterval:i.reconnectMaxInterval??3e4,reconnectBackoffRate:i.reconnectBackoffRate??2,reconnectMaxAttempts:i.reconnectMaxAttempts??1/0,reconnectJitter:i.reconnectJitter??!1,heartbeatInterval:i.heartbeatInterval??3e4,heartbeatTimeout:i.heartbeatTimeout??1e4,debug:i.debug??!1}}connect(){if(this.shouldReconnect=!0,this.ws?.readyState===WebSocket.OPEN){this._log("Already connected");return}if(this.ws?.readyState===WebSocket.CONNECTING){this._log("Already connecting");return}const i=this.config.tokenProvider?.(),s=i?`${this.config.url}${this.config.url.includes("?")?"&":"?"}token=${encodeURIComponent(i)}`:this.config.url;this._log(`Connecting to ${this.config.url}...`),this._setStatus("connecting");try{this._wsGeneration++,this.ws=new WebSocket(s),this._setupWebSocketHandlers(this._wsGeneration)}catch(u){this._log("Connection error:",u),this._setStatus("error"),this._scheduleReconnect()}}disconnect(){if(this._log("Disconnecting..."),this.shouldReconnect=!1,this._clearTimers(),this.messageQueue=[],this.ws){this._setStatus("disconnecting");const i=this.ws;i.readyState===WebSocket.CONNECTING?(i.onmessage=null,i.onerror=null,i.onclose=null,i.onopen=()=>i.close(1e3,"Client disconnect")):i.readyState===WebSocket.OPEN&&i.close(1e3,"Client disconnect"),this.ws=null}this._setStatus("disconnected")}subscribe(i){const s=this._serializeScope(i);if(this.activeSubscriptions.has(s)){this._log(`Already subscribed to ${s}`);return}this.activeSubscriptions.add(s);const u={type:"SUBSCRIBE",scope:i};this._send(JSON.stringify(u)),this._log(`Subscribed to ${s}`)}unsubscribe(i){const s=this._serializeScope(i);if(!this.activeSubscriptions.has(s)){this._log(`Not subscribed to ${s}`);return}this.activeSubscriptions.delete(s);const u={type:"UNSUBSCRIBE",scope:i};this._send(JSON.stringify(u)),this._log(`Unsubscribed from ${s}`)}on(i,s){this.eventHandlers.has(i)||this.eventHandlers.set(i,new Set),this.eventHandlers.get(i).add(s)}off(i,s){const u=this.eventHandlers.get(i);u&&(u.delete(s),u.size===0&&this.eventHandlers.delete(i))}onStatusChange(i){this.statusHandlers.add(i)}offStatusChange(i){this.statusHandlers.delete(i)}getStatus(){return this.status}getActiveSubscriptions(){return Array.from(this.activeSubscriptions).map(i=>this._deserializeScope(i))}_setupWebSocketHandlers(i){this.ws&&(this.ws.onopen=()=>{this._log("Connected"),setTimeout(()=>{this._setStatus("connected"),this._flushMessageQueue(),this._restoreSubscriptions(),this._startHeartbeat()},1)},this.ws.onclose=s=>{i===this._wsGeneration&&(this._log(`Connection closed: ${s.code} ${s.reason}`),this._clearTimers(),this._setStatus("disconnected"),this.shouldReconnect&&this.config.reconnect&&this._scheduleReconnect())},this.ws.onerror=s=>{this._log("WebSocket error:",s),this._setStatus("error")},this.ws.onmessage=s=>{this._handleMessage(s.data)})}_handleMessage(i){try{const s=JSON.parse(i),u=this._normalizeEnvelope(s);if(!u){this._log("Ignoring malformed envelope:",s);return}if(this._guardEnvelopeContract(s,u),this._log("Received:",u.type,u),u.type==="PONG"){this._handlePong();return}this._dispatchEvent(u)}catch(s){this._log("Failed to parse message:",s,i)}}_normalizeEnvelope(i){if(!i||typeof i!="object"||Array.isArray(i))return null;const s=this._deepCamelizeKeys(i),u=s.type;if(typeof u!="string")return null;const p=typeof s.messageId=="string"?s.messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,h=typeof s.timestamp=="string"?s.timestamp:new Date().toISOString();return{...s,messageId:p,timestamp:h,type:u}}_guardEnvelopeContract(i,s){const p=(i&&typeof i=="object"&&!Array.isArray(i)?Object.keys(i):[]).filter(x=>x.includes("_"));p.length>0&&this._warnContract(`snake:${s.type}`,`[contract-guard] WS ${s.type} contains snake_case keys: ${p.join(", ")}`);const m={MESSAGE_CREATED:["conversationId","messageId","role","content"],WORKFLOW_TRIGGERED:["conversationId","workflowId","executionId"],MESSAGE_COMPLETED:["conversationId","messageId"],NODE_STREAM_CHUNK:["executionId","nodeId","content","sequence"],NODE_STREAM_COMPLETE:["executionId","nodeId","fullContent"],NODE_STREAM_FAILED:["executionId","nodeId","error"],EXECUTION_FAILED:["executionId","error"],ERROR:["code","message"]}[s.type];if(!m)return;const c=m.filter(x=>s[x]===void 0||s[x]===null);c.length>0&&this._warnContract(`missing:${s.type}:${c.join(",")}`,`[contract-guard] WS ${s.type} missing expected fields: ${c.join(", ")}`)}_warnContract(i,s){this.contractWarnedKeys.has(i)||(this.contractWarnedKeys.add(i),console.warn(s))}_deepCamelizeKeys(i){if(Array.isArray(i))return i.map(p=>this._deepCamelizeKeys(p));if(!i||typeof i!="object")return i;const s=i,u={};for(const[p,h]of Object.entries(s))u[this._toCamelCase(p)]=this._deepCamelizeKeys(h);return u}_toCamelCase(i){return i.replace(/_([a-z])/g,(s,u)=>u.toUpperCase())}_dispatchEvent(i){const s=this.eventHandlers.get("*");s&&s.forEach(p=>{try{p(i)}catch(h){this._log("Error in wildcard handler:",h)}});const u=this.eventHandlers.get(i.type);u&&u.forEach(p=>{try{p(i)}catch(h){this._log(`Error in ${i.type} handler:`,h)}})}_send(i){const s=this._wrapEnvelope(i);this.ws?.readyState===WebSocket.OPEN?(this.ws.send(s),this._log("Sent:",s)):(this.messageQueue.push(i),this._log("Queued:",i))}_wrapEnvelope(i){try{const s=JSON.parse(i),u={messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,timestamp:new Date().toISOString(),...s};return JSON.stringify(u)}catch{return i}}_flushMessageQueue(){this.messageQueue.length!==0&&(this._log(`Flushing ${this.messageQueue.length} queued messages`),this.messageQueue.forEach(i=>{this.ws?.readyState===WebSocket.OPEN&&this.ws.send(this._wrapEnvelope(i))}),this.messageQueue=[])}_restoreSubscriptions(){this.activeSubscriptions.size!==0&&(this._log(`Restoring ${this.activeSubscriptions.size} subscriptions`),this.messageQueue=this.messageQueue.filter(i=>{try{const s=JSON.parse(i);return s.type!=="SUBSCRIBE"&&s.type!=="UNSUBSCRIBE"}catch{return!0}}),this.activeSubscriptions.forEach(i=>{const u={type:"SUBSCRIBE",scope:this._deserializeScope(i)};this.ws?.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(u))}))}_scheduleReconnect(){if(!this.config.reconnect||!this.shouldReconnect)return;if(this.reconnectAttempts>=this.config.reconnectMaxAttempts){this._log(`Max reconnect attempts (${this.config.reconnectMaxAttempts}) reached, giving up`),this.shouldReconnect=!1,this._setStatus("error");return}let i=Math.min(this.config.reconnectInterval*Math.pow(this.config.reconnectBackoffRate,this.reconnectAttempts),this.config.reconnectMaxInterval);if(this.config.reconnectJitter){const s=i*.3*Math.random();i=i+s}this._log(`Reconnecting in ${Math.round(i)}ms (attempt ${this.reconnectAttempts+1}/${this.config.reconnectMaxAttempts})`),this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.reconnectAttempts++,this._setStatus("connecting"),this.connect()},i)}_startHeartbeat(){this._clearHeartbeat(),this.heartbeatTimer=setInterval(()=>{this._sendPing()},this.config.heartbeatInterval),this._sendPing()}_sendPing(){this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null);const i={type:"PING",timestamp:Date.now()};this._send(JSON.stringify(i)),this.heartbeatTimeoutTimer=setTimeout(()=>{this._log(`Heartbeat timeout (${this.config.heartbeatTimeout}ms), reconnecting...`),this.ws?.close(1e3,"Heartbeat timeout")},this.config.heartbeatTimeout)}_handlePong(){const i=Date.now(),s=this.lastPongTime?i-this.lastPongTime:0;this.lastPongTime=i,this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null),this._log(`Heartbeat OK${s?` (Δ ${s}ms)`:""}`)}_clearHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=null),this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null)}_clearTimers(){this._clearHeartbeat(),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null)}_setStatus(i){this.status!==i&&(this.status=i,this._log(`Status changed: ${i}`),this.statusHandlers.forEach(s=>{try{s(i)}catch(u){this._log("Error in status handler:",u)}}))}_serializeScope(i){if(i.type==="workspace")return`ws:${i.workspaceId}`;if(i.type==="conversation")return`conv:${i.conversationId}`;if(i.type==="execution")return`exec:${i.executionId}`;throw new Error(`Unknown scope type: ${i.type}`)}_deserializeScope(i){const[s,u]=i.split(":");if(s==="ws")return{type:"workspace",workspaceId:u};if(s==="conv")return{type:"conversation",conversationId:u};if(s==="exec")return{type:"execution",executionId:u};throw new Error(`Invalid scope key: ${i}`)}_log(...i){this.config.debug&&console.log("[WsClient]",...i)}}const Ce=a=>typeof a=="object"&&a!==null;function rr(a){if(Array.isArray(a))return a;if(!Ce(a))return[];const i=a,s=Ce(i.data)?i.data:void 0;return Array.isArray(s?.items)?s.items:Array.isArray(i.data)?i.data:Array.isArray(i.items)?i.items:[]}function ii(a,i){const s=a.bound_workflow_id??a.boundWorkflowId,u=s!=null&&s!==""?String(s):"";return{id:String(a.id??""),workspaceId:String(a.workspace_id??a.workspaceId??i),channelId:String(a.channel_id??a.channelId??""),name:String(a.name??""),description:a.description!=null?String(a.description):void 0,boundWorkflowId:u,appType:typeof a.app_type=="string"?a.app_type:typeof a.appType=="string"?a.appType:void 0,connectionConfig:Ce(a.connection_config)?a.connection_config:Ce(a.connectionConfig)?a.connectionConfig:void 0,enabled:typeof a.enabled=="boolean"?a.enabled:!0,connectionState:typeof a.connection_state=="string"?a.connection_state:typeof a.connectionState=="string"?a.connectionState:void 0,setupData:Ce(a.setup_data)?a.setup_data:Ce(a.setupData)?a.setupData:void 0,webhookUrl:typeof a.webhook_url=="string"?a.webhook_url:typeof a.webhookUrl=="string"?a.webhookUrl:void 0,createdAt:String(a.created_at??a.createdAt??new Date().toISOString()),updatedAt:String(a.updated_at??a.updatedAt??a.created_at??a.createdAt??new Date().toISOString())}}function wh(a){const s=(Array.isArray(a.tags)?a.tags:[]).find(h=>h.startsWith("chid:"));if(!s)return null;const u=Ce(a.metadata)?a.metadata:{},p=String(a.id??a.workflowId??a.workflow_id??"");return{id:p,workspaceId:String(u.workspace_id??u.workspaceId??""),channelId:s.slice(5),name:String(u.display_name??a.name??""),description:a.description?String(a.description):void 0,boundWorkflowId:String(u.workflow_id??u.workflowId??p),appType:typeof u.app_type=="string"?u.app_type:void 0,connectionConfig:Ce(u.connection_config)?u.connection_config:void 0,enabled:!0,createdAt:String(a.created_at??a.createdAt??new Date().toISOString()),updatedAt:String(a.updated_at??a.updatedAt??a.created_at??a.createdAt??new Date().toISOString())}}function vd(a){const i=Ce(a.metadata)?a.metadata:{},s=a.id??a.workflow_id??a.workflowId,u=a.name??a.display_name??a.displayName??i.display_name??i.displayName??s;return{id:String(s??""),name:String(u??""),description:a.description!=null?String(a.description):void 0,state:typeof a.state=="string"?a.state:void 0,visibility:typeof a.visibility=="string"?a.visibility:void 0,tags:Array.isArray(a.tags)?a.tags.map(String):[],createdAt:typeof(a.created_at??a.createdAt)=="string"?String(a.created_at??a.createdAt):void 0,updatedAt:typeof(a.updated_at??a.updatedAt)=="string"?String(a.updated_at??a.updatedAt):void 0}}class Je{constructor(i,s){this.apiBaseUrl=i,this.tokenProvider=s}apiBaseUrl;tokenProvider;async listChannels(){let i;try{i=await this.listWorkspaces()}catch(p){if(Sd(p))throw p;return this._listChannelsLegacy()}if(i.length===0)return this._listChannelsLegacy();const s=[];let u=!1;for(const p of i){const h=await this._fetchChannelsByWorkspaceSafe(p.id);h!==null&&(u=!0,s.push(...h))}return u?s:this._listChannelsLegacy()}async createChannel(i){try{const s=await this._fetch(`/workspaces/${i.workspaceId}/channels`,"POST",{channel_id:i.channelId,name:i.name,bound_workflow_id:i.boundWorkflowId,description:i.description,app_type:i.appType,connection_config:i.connectionConfig}),u=Ce(s)?s:void 0,p=Ce(u?.data)?u?.data:u??{};return ii(p,i.workspaceId)}catch(s){if(s instanceof pi&&s.status===409){const u=Ce(s.body)?s.body:void 0,p=Ce(u?.details)?u.details:void 0,h=Ce(p?.existing_channel)?p.existing_channel:void 0;if(h)return ii(h,i.workspaceId);throw new Error(`Integration with ID "${i.channelId}" already exists in this workspace.`)}if(!us(s))throw s;return this._createChannelLegacy(i)}}async updateChannel(i){const s=await this._fetch(`/workspaces/${i.workspaceId}/channels/${i.id}`,"PATCH",{channel_id:i.channelId,name:i.name,bound_workflow_id:i.boundWorkflowId,description:i.description,app_type:i.appType,connection_config:i.connectionConfig}),u=Ce(s)?s:void 0,p=Ce(u?.data)?u?.data:u??{};return ii(p,i.workspaceId)}async deleteChannel(i,s){if(s)try{await this._fetch(`/workspaces/${s}/channels/${i}`,"DELETE");return}catch(u){if(!us(u))throw u}await this._fetch(`/workflows/${i}`,"DELETE")}async listWorkspaces(){const i=await this._fetch("/workspaces","GET");return rr(i).map(u=>{const p=u;return{id:String(p.id??p.workspace_id??""),name:String(p.name??""),description:p.description?String(p.description):void 0,createdAt:String(p.created_at??p.createdAt??new Date().toISOString()),updatedAt:p.updated_at?String(p.updated_at):p.updatedAt?String(p.updatedAt):void 0}})}async createWorkspace(i){const s=await this._fetch("/workspaces","POST",{name:i.name,description:i.description}),u=Ce(s)?s:void 0,h=Ce(u?.data)?u?.data:u??{};return{id:String(h.id??h.workspace_id??""),name:String(h.name??i.name),description:h.description?String(h.description):i.description,createdAt:String(h.created_at??h.createdAt??new Date().toISOString()),updatedAt:h.updated_at?String(h.updated_at):h.updatedAt?String(h.updatedAt):void 0}}async listPublishedWorkflows(i){const s=i.workspaceId.trim();if(!s)throw new Error("workspaceId is required to list workflows");const u=i.limit??100,p=new URLSearchParams({state:"active",limit:String(u)}),h=await this._fetch(`/workflows?${p.toString()}`,"GET",void 0,s),m=rr(h).map(y=>vd(y)).filter(y=>y.id.trim().length>0);if(m.length>=u)return m.slice(0,u);let c=[];try{const y=new URLSearchParams({tags:"long_task,scheduled",limit:String(u)}),j=await this._fetch(`/workflows?${y.toString()}`,"GET",void 0,s);c=rr(j).map(S=>vd(S)).filter(S=>S.id.trim().length>0&&S.state?.toLowerCase()!=="archived")}catch(y){console.warn("Legacy published-workflow fallback failed; returning active workflows",y)}const x=new Map;for(const y of[...m,...c])x.has(y.id)||x.set(y.id,y);return[...x.values()].slice(0,u)}async getWorkflowName(i,s){const u=await this._fetch(`/workflows/${i}`,"GET",void 0,s),p=Ce(u)?u:void 0,m=Ce(p?.data)?p?.data:p??{},c=Ce(m.metadata)?m.metadata:void 0,x=m.name??m.display_name??m.displayName??c?.display_name??c?.displayName??m.title;return typeof x=="string"&&x.trim()?x.trim():null}async getChannelStatus(i,s){const u=await this._fetch(`/workspaces/${i}/channels/${s}/status`,"GET"),p=Ce(u)?u:{},h=Ce(p.data)?p.data:p;return{connectionState:String(h.connection_state??h.connectionState??"idle"),ok:typeof h.ok=="boolean"?h.ok:void 0,details:typeof h.details=="string"?h.details:void 0,lastMessageAt:typeof h.last_message_at=="string"?h.last_message_at:void 0,error:typeof h.error=="string"?h.error:void 0,mode:h.mode==="polling"||h.mode==="webhook"||h.mode==="stream"?h.mode:void 0,workerRunning:typeof h.worker_running=="boolean"?h.worker_running:void 0,lastPollAt:typeof h.last_poll_at=="string"?h.last_poll_at:void 0,startedAt:typeof h.started_at=="string"?h.started_at:void 0,lastEventAt:typeof h.last_event_at=="string"?h.last_event_at:void 0,lastError:typeof h.last_error=="string"?h.last_error:void 0}}async getChannelCapabilities(i,s){const u=await this._fetch(`/workspaces/${i}/channels/${s}/capabilities`,"GET"),p=Ce(u)?u:{},h=Ce(p.data)?p.data:p,m=c=>typeof c=="boolean"?c:void 0;return{raw:h,directMessage:m(h.direct_message),groupChat:m(h.group_chat),reactions:m(h.reactions),messageEdit:m(h.message_edit),messageDelete:m(h.message_delete),mediaUpload:m(h.media_upload),mediaDownload:m(h.media_download),typingIndicator:m(h.typing_indicator),readReceipts:m(h.read_receipts),webhooks:m(h.webhooks),longPolling:m(h.long_polling)}}async getChannelAuthPattern(i,s){const u=await this._fetch(`/workspaces/${i}/channels/${s}/auth-pattern`,"GET"),p=Ce(u)?u:{},h=Ce(p.data)?p.data:p,m=h.pattern??h.auth_pattern??h.authPattern;return{authPattern:bh(m),raw:h,fields:Array.isArray(h.fields)?h.fields:void 0,webhookUrl:typeof(h.webhook_url??h.webhookUrl)=="string"?String(h.webhook_url??h.webhookUrl):void 0,oauthUrl:typeof(h.oauth_url??h.oauthUrl)=="string"?String(h.oauth_url??h.oauthUrl):void 0,instructions:typeof h.instructions=="string"?h.instructions:void 0}}async connectChannel(i,s,u){const p=await this._fetch(`/workspaces/${i}/channels/${s}/connect`,"POST",u),h=Ce(p)?p:{},m=Ce(h.data)?h.data:h;return{connectionState:String(m.connection_state??m.connectionState??"connecting"),setupData:Ce(m.setup_data)?m.setup_data:Ce(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async completeConnect(i,s,u){const p=await this._fetch(`/workspaces/${i}/channels/${s}/connect/complete`,"POST",u),h=Ce(p)?p:{},m=Ce(h.data)?h.data:h;return{connectionState:String(m.connection_state??m.connectionState??"active"),setupData:Ce(m.setup_data)?m.setup_data:Ce(m.setupData)?m.setupData:void 0,webhookUrl:typeof(m.webhook_url??m.webhookUrl)=="string"?String(m.webhook_url??m.webhookUrl):void 0,message:typeof m.message=="string"?m.message:void 0}}async disconnectChannel(i,s){await this._fetch(`/workspaces/${i}/channels/${s}/connect`,"DELETE")}async createFlowChatHandoff(i,s){const u=await this._fetch(`/workspaces/${i}/channel-keys/flowchat-handoff`,"POST",{name:s.name,channel_id:s.channelId,execution_mode:s.executionMode??"lan_host",setup_request:s.setupRequest,chengflow_base_url:s.chengflowBaseUrl}),p=Ce(u)?u:{},h=Ce(p.data)?p.data:p,m=Ce(h.package)?h.package:void 0;if(!m||typeof h.code!="string")throw new Error("FlowChat handoff response is missing the sealed package");return{keyId:String(h.key_id??h.keyId??""),setupId:String(h.setup_id??h.setupId??""),hostDeviceId:String(h.host_device_id??h.hostDeviceId??""),hostEndpoint:typeof(h.host_endpoint??h.hostEndpoint)=="string"?String(h.host_endpoint??h.hostEndpoint):"",package:m,code:h.code}}async listChannelKeys(i){const s=await this._fetch(`/workspaces/${i}/channel-keys`,"GET"),u=Ce(s)?s:{};return(Array.isArray(u.data)?u.data:rr(s)).map(h=>{const m=Ce(h)?h:{};return{id:String(m.id??""),name:String(m.name??""),appId:typeof m.app_id=="string"?m.app_id:void 0,channelId:typeof m.channel_id=="string"?m.channel_id:void 0,workspaceId:String(m.workspace_id??i),createdAt:String(m.created_at??""),lastUsedAt:typeof m.last_used_at=="string"?m.last_used_at:void 0,useCount:typeof m.use_count=="number"?m.use_count:0}})}async deleteChannelKey(i,s){await this._fetch(`/workspaces/${i}/channel-keys/${s}`,"DELETE")}async _fetchChannelsByWorkspaceSafe(i){try{const s=await this._fetch(`/workspaces/${i}/channels`,"GET");return rr(s).map(p=>ii(p,i))}catch(s){if(us(s))return null;if(Sd(s))throw s;return[]}}async _listChannelsLegacy(){const i=await this._fetch("/workflows","GET"),s=rr(i),u=[];for(const p of s){const h=wh(p);h&&u.push(h)}return u}async _createChannelLegacy(i){const u=(await this._listChannelsLegacy()).find(S=>S.channelId===i.channelId);if(u)return u;const p={name:i.channelId,description:i.description,tags:[`chid:${i.channelId}`],metadata:{channel_id:i.channelId,workspace_id:i.workspaceId,display_name:i.name,workflow_id:i.boundWorkflowId,app_type:i.appType,connection_config:i.connectionConfig}},h=await this._fetch("/workflows","POST",p),m=Ce(h)?h:void 0,x=Ce(m?.data)?m?.data:m??{},y=Ce(x.metadata)?x.metadata:{};return{id:String(x.id??x.workflowId??x.workflow_id??""),workspaceId:i.workspaceId,channelId:i.channelId,name:String(y.display_name??i.name),description:x.description?String(x.description):i.description,boundWorkflowId:String(y.workflow_id??y.workflowId??i.boundWorkflowId),appType:typeof y.app_type=="string"?y.app_type:i.appType,connectionConfig:Ce(y.connection_config)?y.connection_config:i.connectionConfig,enabled:!0,createdAt:String(x.created_at??x.createdAt??new Date().toISOString()),updatedAt:String(x.updated_at??x.updatedAt??x.created_at??x.createdAt??new Date().toISOString())}}async _fetch(i,s,u,p){const h=`${this.apiBaseUrl}${i}`,m=await this.tokenProvider.getAccessToken();if(!m)throw An("missing-access-token"),new Error("Authentication required");const c=async j=>fetch(h,{method:s,headers:{"Content-Type":"application/json",Authorization:`Bearer ${j}`,...p?.trim()?{"X-Workspace-Id":p.trim()}:{}},body:u!==void 0?JSON.stringify(u):void 0});let x=await c(m),y=!1;if(x.status===401&&this.tokenProvider.refreshAccessToken){const j=await this.tokenProvider.refreshAccessToken().catch(()=>null);j?x=await c(j):(An("refresh-failed"),y=!0)}if(!x.ok){x.status===401&&!y&&An("unauthorized");const j=await x.text().catch(()=>"");let S;try{S=JSON.parse(j)}catch{S=void 0}throw new pi(x.status,`Management API error ${x.status}: ${j}`,S)}return x.status===204||x.headers.get("content-length")==="0"?null:x.json().catch(()=>null)}}class pi extends Error{constructor(i,s,u){super(s),this.status=i,this.body=u,this.name="ManagementApiError"}status;body}function us(a){return a instanceof pi?a.status===404||a.status===405:a instanceof Error?a.message.includes("404")||a.message.includes("405"):!1}function Sd(a){return a instanceof pi?a.status===401||a.status===403:a instanceof Error?a.message.includes("401")||a.message.includes("403")||a.message.toLowerCase().includes("authentication"):!1}const jd=new Set;function bh(a){const i=["webhook_token","webhook_signature","webhook_encrypted_signature","oauth","qr_session","stream_connection"],s=typeof a=="string"?a.toLowerCase().replace(/-/g,"_"):"";return i.includes(s)?s:(s&&!jd.has(s)&&(jd.add(s),console.warn(`[ManagementClient] Unknown auth-pattern value "${s}" from backend. Expected one of: ${i.join(", ")}. Defaulting to "webhook_token".`)),"webhook_token")}function kh(a){const{autoConnect:i=!0,enabled:s=!0,url:u,tokenProvider:p,...h}=a,m=g.useRef(!1),c=g.useRef(null),[x,y]=g.useState("disconnected"),[j,S]=g.useState([]);g.useEffect(()=>{if(!s){c.current=null,y("disconnected"),S([]);return}const Q={url:u,tokenProvider:p,...h},X=new Vd(Q);c.current=X;const Y=J=>{y(J)};return X.onStatusChange(Y),i&&!m.current&&X.connect(),()=>{X.offStatusChange(Y),X.disconnect(),c.current=null}},[s,u]),g.useEffect(()=>{if(typeof window>"u")return;const Q=()=>{m.current=!0,c.current?.disconnect(),S([])};return window.addEventListener(qr,Q),()=>{window.removeEventListener(qr,Q)}},[]);const M=g.useCallback(()=>{if(m.current){if(!(typeof window<"u"&&!!window.localStorage.getItem(di)))return;m.current=!1}c.current?.connect()},[]),B=g.useCallback(()=>{c.current?.disconnect()},[]),O=g.useCallback(Q=>{c.current?.subscribe(Q),S(c.current?.getActiveSubscriptions()||[])},[]),K=g.useCallback(Q=>{c.current?.unsubscribe(Q),S(c.current?.getActiveSubscriptions()||[])},[]),I=g.useCallback((Q,X)=>{c.current?.on(Q,X)},[]),z=g.useCallback((Q,X)=>{c.current?.off(Q,X)},[]);return{status:x,connect:M,disconnect:B,subscribe:O,unsubscribe:K,on:I,off:z,activeSubscriptions:j,isConnected:x==="connected",isConnecting:x==="connecting",isDisconnected:x==="disconnected"}}class yh{client;ws;snapshots=new Map;listeners=new Set;timers=new Map;generations=new Map;started=!1;online=()=>{this.reconcileAll("online")};visible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.reconcileAll("visible")};constructor(i,s){this.client=new $d(i),this.ws=new Vd({url:i.wsBaseUrl,tokenProvider:s,reconnect:!0}),this.ws.on("*",this.handleEvent),this.ws.onStatusChange(this.handleStatus)}start(){this.started||(this.started=!0,this.recoverStorage(),this.ws.connect(),typeof window<"u"&&(window.addEventListener("online",this.online),document.addEventListener("visibilitychange",this.visible)),this.reconcileAll("startup"))}stop(i=!1){this.started=!1,this.ws.disconnect();for(const s of this.timers.values())clearTimeout(s);this.timers.clear(),typeof window<"u"&&(window.removeEventListener("online",this.online),document.removeEventListener("visibilitychange",this.visible)),i&&(this.snapshots.clear(),this.notify())}subscribe=i=>(this.listeners.add(i),()=>this.listeners.delete(i));getSnapshot=()=>this.snapshots;getExecution(i){return i?this.snapshots.get(i):void 0}getBySession(i){return[...this.snapshots.values()].filter(s=>(s.sessionId??s.externalChatId)===i).sort((s,u)=>Date.parse(u.updatedAt)-Date.parse(s.updatedAt))[0]}getByConversation(i){return[...this.snapshots.values()].filter(s=>s.conversationId===i).sort((s,u)=>Date.parse(u.updatedAt)-Date.parse(s.updatedAt))[0]}connect(){this.ws.connect()}subscribeScope(i){this.ws.subscribe(i)}unsubscribeScope(i){this.ws.unsubscribe(i)}on(i,s){this.ws.on(i,s)}off(i,s){this.ws.off(i,s)}register(i){const s=new En(i.channelId).setActive(i),u={...s,clientStatus:s.status};return this.snapshots.set(s.executionId,u),this.ws.subscribe({type:"conversation",conversationId:s.conversationId}),this.ws.subscribe({type:"execution",executionId:s.executionId}),this.notify(s),this.schedule(s.executionId,2e3),u}async reconcile(i,s="manual"){const u=this.snapshots.get(i);if(!u)return;const p=(this.generations.get(i)??0)+1;this.generations.set(i,p);try{const h=await this.client.getExecution(i);if(this.generations.get(i)!==p)return this.snapshots.get(i);const m=gh(h),c=typeof h.error=="string"?h.error:h.error?.message,x={...u,clientStatus:m,status:m,error:c,review:h.review,lastReconciledAt:new Date().toISOString(),updatedAt:h.updatedAt??h.completedAt??new Date().toISOString(),detail:h};return this.snapshots.set(i,x),new En(x.channelId).upsert(x),this.notify(x),fn(m)?(this.cancelTimer(i),this.ws.unsubscribe({type:"execution",executionId:i})):this.schedule(i),x}catch{if(this.generations.get(i)!==p)return this.snapshots.get(i);const h={...u,clientStatus:"unknown",status:"unknown",updatedAt:new Date().toISOString()};return this.snapshots.set(i,h),new En(h.channelId).upsert(h),this.notify(h),this.schedule(i),h}}async reconcileAll(i="manual"){await Promise.all([...this.snapshots.values()].filter(s=>!fn(s.clientStatus)&&s.clientStatus!=="idle").map(s=>this.reconcile(s.executionId,i)))}acknowledge(i){const s=this.snapshots.get(i);if(!s||!fn(s.clientStatus))return;const u=new En(s.channelId).acknowledge(i);u&&(this.snapshots.set(i,{...s,...u,clientStatus:"idle"}),this.notify(u))}removeSession(i){for(const s of[...this.snapshots.values()])(s.sessionId??s.externalChatId)===i&&(this.cancelTimer(s.executionId),this.ws.unsubscribe({type:"execution",executionId:s.executionId}),this.snapshots.delete(s.executionId));this.notify()}recoverStorage(){if(!(typeof localStorage>"u")){for(let i=0;i<localStorage.length;i++){const s=localStorage.key(i),u="cheng_execution_mappings_";if(!s?.startsWith(u))continue;const p=s.slice(u.length),h=new En(p);h.cleanup();for(const m of h.listRecoverable()){const c=m.status;this.snapshots.set(m.executionId,{...m,clientStatus:c}),!fn(c)&&c!=="idle"&&(this.ws.subscribe({type:"conversation",conversationId:m.conversationId}),this.ws.subscribe({type:"execution",executionId:m.executionId}))}}this.notify()}}handleStatus=i=>{i==="connected"&&this.reconcileAll("websocket-reconnected")};handleEvent=i=>{const s=typeof i.executionId=="string"?i.executionId:void 0;if(!s||!this.snapshots.has(s))return;const u=this.snapshots.get(s);i.type==="EXECUTION_START"||i.type==="EXECUTION_PROGRESS"?this.transition(u,"running"):i.type==="AGENT_PAUSED_FOR_REVIEW"||i.type==="APPROVAL_REQUESTED"?this.transition(u,"waiting_for_review",i):i.type==="EXECUTION_COMPLETE"||i.type==="EXECUTION_FAILED"||i.type==="EXECUTION_CANCELLED"||i.type==="EXECUTION_STATE_CHANGED"?this.reconcile(s,`ws:${i.type}`):i.type==="NODE_STREAM_CHUNK"&&typeof i.sequence=="number"&&i.sequence>(u.lastStreamSequence??-1)&&this.transition(u,u.clientStatus==="pending"?"running":u.clientStatus,void 0,i.sequence)};transition(i,s,u,p){const h={...i,clientStatus:s,status:s,detail:u??i.detail,lastStreamSequence:p??i.lastStreamSequence,updatedAt:new Date().toISOString()};this.snapshots.set(i.executionId,h),new En(i.channelId).upsert(h),this.notify(h)}schedule(i,s){if(this.cancelTimer(i),!this.started||typeof navigator<"u"&&!navigator.onLine)return;const u=this.snapshots.get(i);if(!u||fn(u.clientStatus)||u.clientStatus==="idle")return;const p=s??Math.min(3e4,2e3*2**Math.min(4,this.generations.get(i)??0)),h=typeof document<"u"&&document.visibilityState==="hidden";this.timers.set(i,setTimeout(()=>{this.reconcile(i,"poll")},h?Math.max(p,3e4):p))}cancelTimer(i){const s=this.timers.get(i);s&&clearTimeout(s),this.timers.delete(i)}notify(i){this.snapshots=new Map(this.snapshots);for(const s of this.listeners)s();_h(i??{})}}const ys=g.createContext(null);function vh({config:a,children:i}){const s=g.useMemo(()=>{const u=new Be(a.apiBaseUrl);return new yh(a,()=>u.getAccessTokenSync())},[a.apiBaseUrl,a.wsBaseUrl]);return g.useEffect(()=>(s.start(),()=>s.stop(!0)),[s]),n.jsx(ys.Provider,{value:s,children:i})}function Gd(){const a=g.useContext(ys);if(!a)throw new Error("ExecutionCoordinatorProvider is required");return a}function Sh(){return g.useContext(ys)}function jh(a){const i=Gd(),s=g.useSyncExternalStore(i.subscribe,i.getSnapshot,i.getSnapshot);return g.useMemo(()=>[...s.values()].filter(u=>u.channelId===a),[a,s])}const Ch="context_limit_reached",Nh="context_memory_selection";function qd(a){return a.reviewPayload??a.review_payload??null}function Ph(a){if(a.reason!==Ch)return!1;const i=qd(a);if(!i||!Array.isArray(i.outline))return!1;const s=i.kind;return s===void 0||s===Nh}function Ih(a){return{nodeId:a.nodeId,iteration:a.iteration,reason:a.reason||"Agent paused for review",interimReport:a.interimReport||"",suggestedNextAction:a.suggestedNextAction,status:"waiting"}}function Eh(a){if(!Ph(a))return null;const i=qd(a);return{executionId:a.executionId,nodeId:a.nodeId,iteration:a.iteration,sessionId:i.conversation_id||i.session_id,conversationId:i.conversation_id||void 0,currentEstimatedChars:i.current_estimated_chars,targetChars:i.target_chars,hardLimitChars:i.hard_limit_chars,trimmingMode:i.trimming_mode??"single_task",projectedEstimatedChars:i.projected_estimated_chars,reasonCode:i.reason_code??void 0,outline:i.outline}}function Ah(a){const i=Eh(a);return i?{kind:"context_memory",review:i}:{kind:"agent_review",review:Ih(a)}}function Th(a,i){switch(i.type){case"ADD_MESSAGE":return[...a,i.message];case"UPDATE_MESSAGE":return a.map(s=>s.id===i.id?{...s,...i.updates}:s);case"REMOVE_MESSAGE":return a.filter(s=>s.id!==i.id);case"REMOVE_ASSISTANT_BY_EXEC_ID":return a.filter(s=>!(s.role==="assistant"&&s.executionId===i.executionId));case"UPDATE_AGENT_REVIEW_BY_EXEC_ID":return a.map(s=>s.executionId===i.executionId&&s.agentReview?{...s,agentReview:{...s.agentReview,...i.updates}}:s);case"UPDATE_APPROVAL_BY_REQUEST_ID":return a.map(s=>s.approval?.requestId===i.requestId?{...s,approval:{...s.approval,...i.updates}}:s);case"REMOVE_EMPTY_ASSISTANTS":return a.filter(s=>!(s.role==="assistant"&&!s.content));case"CLEAR_MESSAGES":return[];case"SET_MESSAGES":return i.messages;default:return a}}function Cd(a){return a?a.includes("No response output found in execution")?kt("hooks.execNoOutput"):a.includes("No nodes")||a.includes("0 nodes")?kt("hooks.execNoNodes"):a.includes("timeout")||a.includes("Timeout")?kt("hooks.execTimeout"):a.includes("not found")||a.includes("Not found")?kt("hooks.execNotFound"):a:kt("hooks.execFailed")}function Lh(a){const i=a.replace(/\s+/g," ").trim();if(!i)return kt("hooks.newSession");const s=i.split(/\r?\n/)[0]?.trim()??i,u=s.split(/[。！？!?]/)[0]?.trim()||s,p=18;return u.length<=p?u:`${u.slice(0,p)}...`}function Rh(a){if(!a)return!0;const i=a.trim();return/^(session|会话|新会话)(\s*\d+)?$/i.test(i)}const Nd=new Map,Mh=()=>()=>{};function zh(a){const i=Sh(),s=g.useSyncExternalStore(i?.subscribe??Mh,i?.getSnapshot??(()=>Nd),i?.getSnapshot??(()=>Nd)),u=g.useRef(null),p=g.useRef(null),h=g.useRef(null),[m,c]=g.useReducer(Th,[]),[x,y]=g.useState(!1),[j,S]=g.useState(null),[M,B]=g.useState(null),[O,K]=g.useState(!1),I=g.useRef(""),z=g.useRef(null),$=g.useRef(null),G=g.useRef(null),E=g.useRef(null),Q=g.useRef(new Set),X=g.useRef(new Map),Y=g.useRef(Date.now()),J=g.useRef(new Be(a.apiBaseUrl)),de=kh({url:a.wsBaseUrl,enabled:!i,tokenProvider:()=>J.current.getAccessTokenSync(),autoConnect:!0,debug:!1}),se=g.useCallback(P=>i?i.subscribeScope(P):de.subscribe(P),[i,de.subscribe]),ue=g.useCallback(P=>i?i.unsubscribeScope(P):de.unsubscribe(P),[i,de.unsubscribe]),V=g.useCallback((P,b)=>i?i.on(P,b):de.on(P,b),[i,de.on]),ce=g.useCallback((P,b)=>i?i.off(P,b):de.off(P,b),[i,de.off]),re=g.useCallback(()=>i?i.connect():de.connect(),[i,de.connect]),_e=g.useCallback(P=>{P&&c({type:"UPDATE_AGENT_REVIEW_BY_EXEC_ID",executionId:P,updates:{status:"pending"}})},[]);g.useEffect(()=>{u.current=new $d(a),p.current=new Kd(a.channelId),h.current=new En(a.channelId),a.sessionId&&p.current.setActiveSessionId(a.sessionId),c({type:"CLEAR_MESSAGES"}),y(!1),S(null),B(null),I.current="",z.current=null,$.current=null,G.current=null,E.current=null;const P=p.current.getConversationId();if(P){G.current=P,se({type:"conversation",conversationId:P});const b=h.current.getActiveForConversation(P);if(b){E.current=b.executionId,se({type:"execution",executionId:b.executionId});const H=b.status;if(["pending","running","unknown"].includes(H)){const T=`recovered-${b.executionId}`;z.current=T,$.current=b.executionId,y(!0)}}(async()=>{try{const T=[...await u.current.getConversationMessages(P)].sort((W,R)=>new Date(W.createdAt).getTime()-new Date(R.createdAt).getTime());c({type:"SET_MESSAGES",messages:[...T.map(W=>({id:W.id,role:W.role??"assistant",content:W.content,status:"completed",createdAt:new Date(W.createdAt),executionId:W.executionId})),...b&&["pending","running","unknown"].includes(b.status)?[{id:`recovered-${b.executionId}`,role:"assistant",content:b.status==="unknown"?kt("hooks.reconnecting"):"",status:"streaming",executionId:b.executionId,createdAt:new Date}]:[]]})}catch{}})()}},[a.apiBaseUrl,a.channelId,a.sessionId,i,se]);const ae=g.useCallback(async P=>{const b=u.current;if(!(!b||Q.current.has(P.executionId))){Q.current.add(P.executionId);try{const W=[...await b.getConversationMessages(P.conversationId)].sort((F,he)=>Date.parse(F.createdAt)-Date.parse(he.createdAt)).map(F=>({id:F.id,role:F.role==="user"?"user":"assistant",content:F.content,status:"completed",executionId:F.executionId,createdAt:new Date(F.createdAt)}));let R=!1;if(P.clientStatus==="completed_unread")R=W.some(F=>F.role==="assistant"&&F.executionId===P.executionId);else if(P.clientStatus==="failed_unread"||P.clientStatus==="cancelled"){const F=P.clientStatus==="cancelled"?kt("hooks.execCancelled"):Cd(P.error||kt("hooks.execFailed"));W.push({id:`terminal-${P.executionId}`,role:"assistant",content:F,status:"error",executionId:P.executionId,createdAt:new Date(P.updatedAt)}),P.clientStatus==="failed_unread"&&S(new Error(F)),R=!0}if(c({type:"SET_MESSAGES",messages:W}),z.current=null,$.current=null,I.current="",B(null),y(!1),R)X.current.delete(P.executionId),i?.acknowledge(P.executionId),h.current?.acknowledge(P.executionId);else{Q.current.delete(P.executionId);const F=(X.current.get(P.executionId)??0)+1;X.current.set(P.executionId,F),F<10&&setTimeout(()=>{i?.reconcile(P.executionId,"terminal-result-pending")},Math.min(5e3,F*500))}}catch{Q.current.delete(P.executionId)}}},[i]);g.useEffect(()=>{if(!i||!a.sessionId)return;const P=[...s.values()].filter(b=>(b.sessionId??b.externalChatId)===a.sessionId).sort((b,H)=>Date.parse(H.updatedAt)-Date.parse(b.updatedAt))[0];P&&(G.current=P.conversationId,E.current=P.executionId,fn(P.clientStatus)?ae(P):["pending","running","unknown"].includes(P.clientStatus)&&y(!0))},[a.sessionId,i,s,ae]),g.useEffect(()=>{const P=a.boundWorkflowId?.trim();if(!P||!u.current){K(!1);return}let b=!1;return u.current.workflowSupportsAttachments(P).then(H=>{b||K(H)}).catch(()=>{b||K(!1)}),()=>{b=!0}},[a.boundWorkflowId,a.apiBaseUrl]),g.useEffect(()=>{const P=oe=>oe?E.current===oe:!1,b=oe=>{Y.current=Date.now(),oe.role==="assistant"&&(_e(E.current),z.current?(c({type:"UPDATE_MESSAGE",id:z.current,updates:{content:oe.content,status:"completed"}}),z.current=null,$.current=null):c({type:"ADD_MESSAGE",message:{id:`msg-assistant-${Date.now()}`,role:"assistant",content:oe.content,status:"completed",executionId:E.current??void 0,createdAt:new Date}}),E.current&&(h.current?.updateStatus(E.current,"completed"),h.current?.clearExecution(E.current)),I.current="",B(null),y(!1))},H=oe=>{_e(oe.executionId||E.current),y(!1),z.current&&(c({type:"REMOVE_MESSAGE",id:z.current}),z.current=null,$.current=null),c({type:"REMOVE_EMPTY_ASSISTANTS"}),E.current&&h.current?.clearExecution(E.current),E.current&&(ue({type:"execution",executionId:E.current}),E.current=null)},T=oe=>{Y.current=Date.now();const{executionId:Ne}=oe;if(Ne&&(E.current&&E.current!==Ne&&ue({type:"execution",executionId:E.current}),E.current=Ne,se({type:"execution",executionId:Ne}),G.current&&h.current?.setActive({channelId:a.channelId,boundWorkflowId:oe.workflowId,conversationId:G.current,executionId:Ne,externalChatId:p.current?.getOrCreateSessionId()??"",externalUserId:a.externalUserId,status:"running"}),!z.current||$.current!==Ne)){const Le=`msg-assistant-${Date.now()}`;z.current=Le,$.current=Ne,c({type:"ADD_MESSAGE",message:{id:Le,role:"assistant",content:"",status:"streaming",executionId:Ne,createdAt:new Date}})}},W=oe=>{P(oe.executionId)&&(B(""),I.current="")},R=oe=>{P(oe.executionId)&&(Y.current=Date.now(),I.current+=oe.content,B(I.current),z.current&&c({type:"UPDATE_MESSAGE",id:z.current,updates:{content:I.current,status:"streaming"}}))},F=oe=>{P(oe.executionId)&&(oe.fullContent&&I.current!==oe.fullContent&&(console.warn("[useChannel] Stream content mismatch:",I.current.length,"vs",oe.fullContent.length),I.current=oe.fullContent,B(oe.fullContent),z.current&&c({type:"UPDATE_MESSAGE",id:z.current,updates:{content:oe.fullContent}})),oe.usage&&console.log("[useChannel] Token usage:",oe.usage))},he=oe=>{P(oe.executionId)&&(y(!1),S(new Error(oe.error)),z.current&&c({type:"UPDATE_MESSAGE",id:z.current,updates:{status:"error",content:oe.partialContent||kt("hooks.streamFailed")}}))},ke=oe=>{if(!P(oe.executionId))return;Y.current=Date.now(),y(!1),B(null),I.current="",z.current&&(c({type:"REMOVE_MESSAGE",id:z.current}),z.current=null,$.current=null),h.current?.updateStatus(oe.executionId,"paused");const Ne=Ah(oe);c({type:"ADD_MESSAGE",message:{id:`agent-review-${oe.executionId}-${oe.iteration}`,role:"assistant",content:oe.reason||"Agent paused for review",status:"agent_review",executionId:oe.executionId,...Ne.kind==="context_memory"?{contextMemoryReview:Ne.review}:{agentReview:Ne.review},createdAt:new Date}})},we=async oe=>{if(!P(oe.executionId)||(_e(oe.executionId),!z.current))return;const Ne=u.current,Le=p.current?.getConversationId();if(!(!Ne||!Le))try{const ct=(await Ne.getConversationMessages(Le)).find(Tn=>Tn.role==="assistant"&&Tn.executionId===oe.executionId);ct&&z.current&&(c({type:"UPDATE_MESSAGE",id:z.current,updates:{content:ct.content,status:"completed"}}),z.current=null,$.current=null,I.current="",B(null),y(!1))}catch{}},Te=oe=>{const Ne=oe.error||oe.error||"",Le=Cd(Ne);S(new Error(Le));const Ke=oe.executionId||oe.execution_id;Ke&&!P(Ke)||(y(!1),z.current?(c({type:"REMOVE_MESSAGE",id:z.current}),z.current=null,$.current=null):c(Ke?{type:"REMOVE_ASSISTANT_BY_EXEC_ID",executionId:Ke}:{type:"REMOVE_EMPTY_ASSISTANTS"}),Ke&&h.current?.updateStatus(Ke,"failed"))},Qe=oe=>{P(oe.executionId)&&(Y.current=Date.now(),y(!1),c({type:"ADD_MESSAGE",message:{id:`approval-${oe.requestId}`,role:"assistant",content:kt("hooks.approvalNeeded",{actionName:oe.actionName}),status:"approval",executionId:oe.executionId,approval:{requestId:oe.requestId,actionName:oe.actionName,riskLevel:oe.riskLevel,paramSummary:oe.paramSummary,status:"pending"},createdAt:new Date}}))},Se=oe=>{P(oe.executionId)&&c({type:"UPDATE_APPROVAL_BY_REQUEST_ID",requestId:oe.requestId,updates:{status:oe.decision,scope:oe.scope,reason:oe.reason}})},pe=oe=>{console.error("[useChannel] WebSocket error:",oe.code,oe.message),S(new Error(`${oe.code}: ${oe.message}`)),oe.executionId&&z.current&&c({type:"UPDATE_MESSAGE",id:z.current,updates:{status:"error"}}),oe.executionId&&h.current?.updateStatus(oe.executionId,"failed")};return V("MESSAGE_CREATED",b),V("MESSAGE_COMPLETED",H),V("WORKFLOW_TRIGGERED",T),V("NODE_STREAM_START",W),V("NODE_STREAM_CHUNK",R),V("NODE_STREAM_COMPLETE",F),V("NODE_STREAM_FAILED",he),V("AGENT_PAUSED_FOR_REVIEW",ke),V("EXECUTION_FAILED",Te),V("EXECUTION_COMPLETE",we),V("APPROVAL_REQUESTED",Qe),V("APPROVAL_RESOLVED",Se),V("ERROR",pe),()=>{ce("MESSAGE_CREATED",b),ce("MESSAGE_COMPLETED",H),ce("WORKFLOW_TRIGGERED",T),ce("NODE_STREAM_START",W),ce("NODE_STREAM_CHUNK",R),ce("NODE_STREAM_COMPLETE",F),ce("NODE_STREAM_FAILED",he),ce("AGENT_PAUSED_FOR_REVIEW",ke),ce("EXECUTION_FAILED",Te),ce("EXECUTION_COMPLETE",we),ce("APPROVAL_REQUESTED",Qe),ce("APPROVAL_RESOLVED",Se),ce("ERROR",pe)}},[V,ce,se,ue,_e,a.channelId,a.externalUserId]),g.useEffect(()=>{const b=setInterval(()=>{!i&&Date.now()-Y.current>3e5&&de.disconnect()},3e4);return()=>clearInterval(b)},[i,de.disconnect]);const te=g.useCallback(async(P,b)=>{if(!u.current||!p.current)throw new Error("Channel client not initialized");if(!P.trim()&&(!b||b.length===0))return;Y.current=Date.now(),re(),S(null),y(!0),E.current&&(ue({type:"execution",executionId:E.current}),E.current=null);const H=a.sessionId||p.current.getOrCreateSessionId(),T=p.current.listSessions().find(R=>R.id===H);P.trim()&&Rh(T?.label)&&(p.current.renameSession(H,Lh(P)),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cheng:session-label-updated",{detail:{channelId:a.channelId,sessionId:H}})));const W=`msg-user-${Date.now()}`;c({type:"ADD_MESSAGE",message:{id:W,role:"user",content:P,status:"sending",createdAt:new Date}});try{G.current&&se({type:"conversation",conversationId:G.current});const R=a.boundWorkflowId.trim();if(!R)throw new Error("Bound Workflow ID is required");const F=await u.current.execute(a.channelId,R,P,H,a.externalUserId,b);c({type:"UPDATE_MESSAGE",id:W,updates:{status:"sent"}});const{conversation_id:he,execution_id:ke}=F;if(G.current=he,p.current.setConversationId(he),se({type:"conversation",conversationId:he}),ke){E.current=ke,se({type:"execution",executionId:ke}),h.current?.setActive({channelId:a.channelId,boundWorkflowId:R,conversationId:he,executionId:ke,externalChatId:H,externalUserId:a.externalUserId,status:"running"}),i?.register({channelId:a.channelId,boundWorkflowId:R,conversationId:he,executionId:ke,externalChatId:H,sessionId:H,externalUserId:a.externalUserId,status:"running"});let we=z.current;(!we||$.current!==ke)&&(we=`msg-assistant-${Date.now()}`,z.current=we,$.current=ke,c({type:"ADD_MESSAGE",message:{id:we,role:"assistant",content:"",status:"streaming",executionId:ke,createdAt:new Date}}));const Te=async(Qe,Se,pe,oe)=>{if(z.current!==pe)return;const Ne=u.current;if(Ne)try{const Ke=(await Ne.getConversationMessages(Qe)).find(ct=>ct.role==="assistant"&&ct.executionId===Se);if(z.current!==pe)return;if(Ke){c({type:"UPDATE_MESSAGE",id:pe,updates:{content:Ke.content,status:"completed"}}),h.current?.updateStatus(Se,"completed"),h.current?.clearExecution(Se),z.current=null,$.current=null,I.current="",B(null),y(!1);return}}catch{if(!oe||z.current!==pe)return;c({type:"REMOVE_MESSAGE",id:pe}),z.current=null,$.current=null,h.current?.updateStatus(Se,"failed"),y(!1)}};setTimeout(()=>{Te(he,ke,we,!1)},250)}else y(!1),console.warn("[useChannel] No execution_id returned, workflow not triggered")}catch(R){throw y(!1),S(R instanceof Error?R:new Error(String(R))),c({type:"UPDATE_MESSAGE",id:W,updates:{status:"error"}}),R}},[a.channelId,a.sessionId,a.boundWorkflowId,a.externalUserId,se,ue,re]),C=g.useCallback(()=>{c({type:"CLEAR_MESSAGES"}),G.current=null,E.current=null,y(!1),S(null),B(null),I.current="",z.current=null,$.current=null,h.current?.clear(),p.current?.resetSession()},[]),q=g.useCallback(async(P,b,H="once",T)=>{const W=m.find(R=>R.id===P);if(!(!W?.executionId||!W.approval||!u.current)){c({type:"UPDATE_MESSAGE",id:P,updates:{approval:{...W.approval,status:"submitting"}}});try{await u.current.submitApproval(W.executionId,W.approval.requestId,b,H,T),c({type:"UPDATE_MESSAGE",id:P,updates:{approval:{...W.approval,status:b,scope:H,reason:T}}})}catch(R){const F=R instanceof Error?R:new Error(String(R));S(F),c({type:"UPDATE_MESSAGE",id:P,updates:{approval:{...W.approval,status:"error"}}})}}},[m]),A=g.useCallback(async(P,b)=>{const H=m.find(W=>W.id===P);if(!H?.agentReview||H.agentReview.status!=="pending")return;c({type:"UPDATE_MESSAGE",id:P,updates:{agentReview:{...H.agentReview,status:"continuing"}}});const T=b?.trim()||H.agentReview.suggestedNextAction?.trim()||"Continue.";try{await te(T)}catch(W){const R=W instanceof Error?W:new Error(String(W));S(R),c({type:"UPDATE_MESSAGE",id:P,updates:{agentReview:{...H.agentReview,status:"pending"}}})}},[m,te]),w=g.useCallback(async(P,b,H)=>{const T=m.find(F=>F.id===P);if(!T?.contextMemoryReview||!u.current)return;const W=T.contextMemoryReview,R=H!==W.trimmingMode;try{await u.current.bulkUpdateMemoryControls(W.sessionId,b,R?H:void 0),await u.current.resumeExecution(W.executionId),c({type:"UPDATE_MESSAGE",id:P,updates:{contextMemoryReview:void 0,status:"completed"}})}catch(F){throw S(F instanceof Error?F:new Error(String(F))),F}},[m]),k=de.isConnected?"connected":de.isConnecting?"connecting":de.status==="error"?"error":"disconnected";return{messages:m,sendMessage:te,isLoading:x,connectionStatus:k,streamingContent:M,resetConversation:C,submitApproval:q,continueAgentReview:A,submitContextMemoryReview:w,error:j,supportsAttachments:O}}const Pd="cheng_active_channel";function Id(a,i,s,u){const p=s.trim().toLowerCase();if(a.find(m=>u&&m.id===u?!1:m.workspaceId===i&&m.channelId.trim().toLowerCase()===p))throw new Error(`Agent ID "${s.trim()}" already exists in this workspace`)}function Dh(a){const[i,s]=g.useState([]),[u,p]=g.useState(null),[h,m]=g.useState(!1),[c,x]=g.useState(null),y=g.useRef(null),j=g.useRef(null),S=g.useRef(a);S.current=a;const M=g.useRef([]);M.current=i,!j.current&&a&&(j.current=new Be(a.apiBaseUrl));const B=g.useCallback(async()=>{const E=S.current;if(!E)return;const Q=j.current;if(!Q)return;if(!await Q.getAccessToken()){const J={id:E.channelId,workspaceId:E.workspaceId??"",channelId:E.channelId,name:"Default",boundWorkflowId:E.boundWorkflowId,createdAt:new Date().toISOString()};s([J]),p(de=>de??J);return}y.current||(y.current=new Je(E.apiBaseUrl,Q));const Y=y.current;m(!0),x(null);try{const J=await Y.listChannels();s(J);const de=typeof window<"u"?window.localStorage.getItem(Pd):null;p(se=>se?J.find(ce=>ce.channelId===se.channelId)??J[0]??null:(de?J.find(V=>V.channelId===de):null)??J[0]??null)}catch(J){x(J instanceof Error?J:new Error(String(J)))}finally{m(!1)}},[]),O=g.useRef(!1);g.useEffect(()=>{O.current||(O.current=!0,B())},[B]);const K=g.useCallback(E=>{p(E),typeof window<"u"&&window.localStorage.setItem(Pd,E.channelId)},[]),I=g.useCallback(async()=>{if(y.current)return y.current;const E=S.current;if(!E)throw new Error("Workspace not selected.");const Q=j.current;if(!await Q.getAccessToken())throw new Error("Authentication required. Please log in.");return y.current=new Je(E.apiBaseUrl,Q),y.current},[]),z=g.useCallback(async E=>{Id(M.current,E.workspaceId,E.channelId);const X=await(await I()).createChannel(E);return await B(),K(X),X},[I,B,K]),$=g.useCallback(async E=>{Id(M.current,E.workspaceId,E.channelId,E.id);const X=await(await I()).updateChannel(E);return await B(),p(Y=>Y&&(Y.id===E.id||Y.channelId===E.channelId?X:Y)),X},[I,B]),G=g.useCallback(async E=>{const Q=await I(),X=M.current.find(Y=>Y.id===E);await Q.deleteChannel(E,X?.workspaceId),p(Y=>Y?.id===E?null:Y),await B()},[I,B]);return{channels:i,activeChannel:u,setActiveChannel:K,createChannel:z,updateChannel:$,deleteChannel:G,isLoading:h,error:c,refresh:B}}function Wh(a){const s=g.useRef(new ks(a)).current,[u,p]=g.useState(()=>s.isAuthenticated()),[h,m]=g.useState(!1),[c,x]=g.useState(null),[y,j]=g.useState(null),S=g.useCallback(async O=>{m(!0),x(null);try{const K=await s.login(O);j(K.user),p(!0)}catch(K){x(K instanceof Error?K.message:String(K))}finally{m(!1)}},[s]),M=g.useCallback(()=>{s.logout(),p(!1),j(null)},[s]),B=g.useCallback(()=>{p(s.isAuthenticated())},[s]);return g.useEffect(()=>{if(typeof window>"u")return;const O=()=>{p(!1),j(null),x(kt("hooks.sessionExpired"))};return window.addEventListener(qr,O),()=>{window.removeEventListener(qr,O)}},[]),{isAuthenticated:u,isLoading:h,error:c,user:y,login:S,logout:M,refresh:B}}const Qd=g.createContext(null);function Fh({config:a,children:i}){const s=zh(a);return n.jsx(Qd.Provider,{value:s,children:i})}function gi(){const a=g.useContext(Qd);if(!a)throw new Error("useChatContext must be used within a ChatProvider");return a}function Oh({className:a="",showText:i=!0}){const{connectionStatus:s}=gi(),{t:u}=Ie(),p=Uh(s);return n.jsxs("div",{className:`cheng-status-indicator ${a}`,"data-status":s,children:[n.jsxs("div",{className:`cheng-status-indicator__container ${p.containerClass}`,children:[n.jsx("div",{className:`cheng-status-indicator__dot ${p.dotClass}`}),i&&n.jsx("span",{className:"cheng-status-indicator__text",children:u(p.textKey)})]}),n.jsx("style",{children:Bh})]})}function Uh(a){switch(a){case"connected":return{textKey:"status.connected",dotClass:"cheng-status-indicator__dot--connected",containerClass:""};case"connecting":return{textKey:"status.connecting",dotClass:"cheng-status-indicator__dot--connecting",containerClass:"cheng-status-indicator__container--pulse"};case"disconnected":return{textKey:"status.disconnected",dotClass:"cheng-status-indicator__dot--disconnected",containerClass:""};case"error":return{textKey:"status.error",dotClass:"cheng-status-indicator__dot--error",containerClass:""};default:return{textKey:"status.unknown",dotClass:"",containerClass:""}}}const Bh=`
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
`;function Hh({content:a,className:i="",showCursor:s=!0}){const u=g.useRef(null);return g.useEffect(()=>{u.current&&(u.current.scrollTop=u.current.scrollHeight)},[a]),n.jsxs("div",{className:`cheng-streaming-text ${i}`,ref:u,children:[n.jsxs("div",{className:"cheng-streaming-text__content",children:[a,s&&n.jsx("span",{className:"cheng-streaming-text__cursor",children:"▊"})]}),n.jsx("style",{children:$h})]})}const $h=`
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
`;function Kh(a){return a.current_action?a.current_action:a.user_pinned?"keep":a.user_collapsed?"fold":"keep"}function Vh(a){return a==="keep"?{user_pinned:!0,user_collapsed:!1}:a==="fold"?{user_pinned:!1,user_collapsed:!0}:{user_pinned:!1,user_collapsed:!1}}function ai(a){return a>=1e3?`${(a/1e3).toFixed(a>=1e4?0:1)}k`:`${a}`}const Ed={keep:"contextMemory.action.keep",fold:"contextMemory.action.fold",omit:"contextMemory.action.omit"},Gh={single_task:"contextMemory.mode.single_task",multi_task:"contextMemory.mode.multi_task"};function qh({review:a,onApplyAndResume:i}){const{t:s}=Ie(),[u,p]=g.useState(a.trimmingMode),[h,m]=g.useState(()=>Object.fromEntries(a.outline.map(M=>[M.turn_index,Kh(M)]))),[c,x]=g.useState(!1),[y,j]=g.useState(null),S=async()=>{if(!i)return;j(null),x(!0);const M=a.outline.map(B=>{const O=h[B.turn_index]??"keep";return{turn_index:B.turn_index,action:O,...Vh(O)}});try{await i(M,u)}catch(B){j(B instanceof Error?B.message:s("contextMemory.applyError"))}finally{x(!1)}};return n.jsxs("div",{className:"cheng-context-memory-card",children:[n.jsxs("div",{className:"cheng-context-memory-card__header",children:[n.jsx("strong",{children:s("contextMemory.limitReached")}),n.jsx("span",{children:s("contextMemory.usage",{current:ai(a.currentEstimatedChars),limit:ai(a.hardLimitChars)})})]}),n.jsx("p",{children:s("contextMemory.description")}),n.jsx("div",{className:"cheng-context-memory-card__modes",children:["single_task","multi_task"].map(M=>n.jsx("button",{type:"button",disabled:c,"data-active":u===M,onClick:()=>p(M),children:s(Gh[M])},M))}),n.jsx("div",{className:"cheng-context-memory-card__outline",children:a.outline.map(M=>{const B=h[M.turn_index]??"keep";return n.jsxs("div",{className:"cheng-context-memory-card__turn",children:[n.jsxs("div",{children:[n.jsx("strong",{children:s("contextMemory.turn",{index:M.turn_index})}),n.jsx("span",{children:s("contextMemory.chars",{count:ai(M.projected_chars??M.char_count)})})]}),n.jsx("p",{children:M.preview||M.role_summary}),M.recommended_weave_action&&n.jsx("div",{className:"cheng-context-memory-card__recommended",children:s("contextMemory.recommended",{label:s(Ed[M.recommended_weave_action])})}),n.jsx("div",{className:"cheng-context-memory-card__actions",children:["keep","fold","omit"].map(O=>n.jsx("button",{type:"button",disabled:c,"data-active":B===O,onClick:()=>m(K=>({...K,[M.turn_index]:O})),children:s(Ed[O])},O))})]},M.turn_index)})}),n.jsxs("div",{className:"cheng-context-memory-card__projection",children:[s("contextMemory.projection",{chars:ai(a.projectedEstimatedChars??a.currentEstimatedChars)}),a.reasonCode?` · ${a.reasonCode.replace(/_/g," ")}`:""]}),y&&n.jsx("div",{className:"cheng-context-memory-card__error",children:y}),n.jsx("button",{className:"cheng-context-memory-card__resume",type:"button",disabled:c||!i,onClick:S,children:s(c?"contextMemory.applying":"contextMemory.applyAndResume")}),n.jsx("style",{children:Qh})]})}const Qh=`
  .cheng-context-memory-card { border: 1px solid #d59635; border-radius: 8px; background: #fff8e8; color: #312b1e; padding: 14px; }
  .cheng-context-memory-card__header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .cheng-context-memory-card__header span, .cheng-context-memory-card__projection { color: #716858; font-size: 12px; }
  .cheng-context-memory-card > p { margin: 8px 0; font-size: 13px; color: #5e5649; }
  .cheng-context-memory-card__modes, .cheng-context-memory-card__actions { display: flex; flex-wrap: wrap; gap: 6px; }
  .cheng-context-memory-card button { border: 1px solid #c8b997; border-radius: 5px; background: #fffdf8; color: #40372a; cursor: pointer; font: inherit; font-size: 12px; padding: 5px 8px; }
  .cheng-context-memory-card button[data-active="true"] { border-color: #b7781b; background: #f8e3b5; }
  .cheng-context-memory-card button:disabled { cursor: not-allowed; opacity: .6; }
  .cheng-context-memory-card__outline { display: grid; gap: 8px; margin-top: 12px; }
  .cheng-context-memory-card__turn { border: 1px solid #e4d5b7; border-radius: 6px; background: #fffdf8; padding: 9px; }
  .cheng-context-memory-card__turn > div:first-child { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; }
  .cheng-context-memory-card__turn > div:first-child span { color: #716858; }
  .cheng-context-memory-card__turn p { margin: 6px 0; color: #5e5649; font-size: 12px; white-space: pre-wrap; }
  .cheng-context-memory-card__recommended { margin: 4px 0 6px; color: #8c5a14; font-size: 11px; }
  .cheng-context-memory-card__projection { margin-top: 12px; }
  .cheng-context-memory-card__error { color: #b53333; font-size: 12px; margin-top: 8px; }
  .cheng-context-memory-card__resume { margin-top: 12px; background: #8c5a14 !important; border-color: #8c5a14 !important; color: #fff !important; }
`;function Yh({message:a,className:i="",onRetry:s,onApprovalDecision:u,onAgentReviewContinue:p,onSubmitContextMemoryReview:h}){const{t:m,locale:c}=Ie(),x=a.role==="user",y=a.status==="streaming",j=a.status==="error",S=a.status==="sending",M=!!a.approval,B=!!a.agentReview,O=!!a.contextMemoryReview;return n.jsxs("div",{className:`cheng-message-bubble ${i}`,"data-role":a.role,"data-status":a.status,children:[n.jsxs("div",{className:`cheng-message-bubble__container ${x?"cheng-message-bubble__container--user":"cheng-message-bubble__container--assistant"}`,children:[n.jsxs("div",{className:`cheng-message-bubble__bubble ${x?"cheng-message-bubble__bubble--user":"cheng-message-bubble__bubble--assistant"} ${j?"cheng-message-bubble__bubble--error":""}`,children:[!M&&!B&&!O&&(y?n.jsx(Ad,{content:a.content,role:a.role,isStreaming:!0}):n.jsx(Ad,{content:a.content,role:a.role})),S&&n.jsx("div",{className:"cheng-message-bubble__sending",children:n.jsx("div",{className:"cheng-message-bubble__spinner"})}),j&&s&&n.jsx("button",{className:"cheng-message-bubble__retry",onClick:()=>s(a.id),type:"button",children:m("messageBubble.retry")}),M&&a.approval&&n.jsx(Xh,{approval:a.approval,messageId:a.id,onDecision:u}),B&&a.agentReview&&n.jsx(Jh,{review:a.agentReview,messageId:a.id,onContinue:p}),O&&a.contextMemoryReview&&n.jsx(qh,{review:a.contextMemoryReview,onApplyAndResume:(K,I)=>Promise.resolve(h?.(a.id,K,I))})]}),n.jsx("div",{className:"cheng-message-bubble__timestamp",children:eg(a.createdAt,m,c)})]}),n.jsx("style",{children:tg})]})}function Ad({content:a,role:i,isStreaming:s=!1}){const{t:u}=Ie();if(i!=="assistant")return n.jsx("div",{className:"cheng-message-bubble__content",children:a});const{thinkBlocks:p,visibleContent:h,hasThinkTag:m,isThinkOpen:c}=Zh(a),x=h.trim().length>0;return n.jsxs("div",{className:"cheng-message-bubble__content-wrap",children:[m&&n.jsxs("details",{className:"cheng-message-bubble__think",children:[n.jsx("summary",{className:"cheng-message-bubble__think-summary",children:u(c?"messageBubble.thinkOpen":"messageBubble.thinkClosed")}),n.jsx("div",{className:"cheng-message-bubble__think-body",children:p.map((y,j)=>n.jsx("div",{className:"cheng-message-bubble__think-block",children:y||u("messageBubble.thinking")},j))})]}),x?s?n.jsx(Hh,{content:h}):n.jsx("div",{className:"cheng-message-bubble__content",children:h}):s&&m&&n.jsx("div",{className:"cheng-message-bubble__thinking-label",children:u("messageBubble.thinkingLabel")})]})}function Xh({approval:a,messageId:i,onDecision:s}){const{t:u}=Ie(),[p,h]=g.useState(!1),[m,c]=g.useState(""),x=a.status==="submitting",y=a.status==="approved"||a.status==="rejected"||a.status==="skip",S={critical:"#b53333",high:"#b53333",medium:"#c96442",low:"#5e5d59"}[a.riskLevel.toLowerCase()]??"#5e5d59",M=a.actionName==="preset_switch"?u("approval.presetSwitch"):a.actionName;let B=[];if(a.paramSummary)try{const I=typeof a.paramSummary=="string"?JSON.parse(a.paramSummary):a.paramSummary;B=Object.entries(I).map(([z,$])=>`${z}: ${typeof $=="object"&&$!==null?JSON.stringify($):$}`)}catch{B=[String(a.paramSummary)]}const O=a.status==="approved"?a.scope==="session"?u("approval.approvedSession"):u("approval.approved"):a.status==="skip"?u("approval.skipped"):u("approval.rejected"),K=()=>{h(!1),c("")};return n.jsxs("div",{className:"cheng-approval-card",children:[n.jsxs("div",{className:"cheng-approval-card__header",children:[n.jsxs("span",{className:"cheng-approval-card__risk",style:{color:S},children:["[",a.riskLevel.toUpperCase(),"]"]}),n.jsx("span",{className:"cheng-approval-card__action",children:M})]}),B.length>0&&n.jsx("div",{className:"cheng-approval-card__params",children:B.map((I,z)=>n.jsx("div",{className:"cheng-approval-card__param-line",children:I},z))}),y?n.jsxs("div",{className:"cheng-approval-card__settled",children:[n.jsx("span",{children:O}),a.reason&&n.jsx("div",{className:"cheng-approval-card__settled-reason",children:u("approval.suggestion",{reason:a.reason})})]}):p?n.jsxs(n.Fragment,{children:[n.jsx("textarea",{className:"cheng-approval-card__suggestion",value:m,onChange:I=>c(I.target.value),placeholder:u("approval.feedbackPlaceholder"),rows:2}),n.jsxs("div",{className:"cheng-approval-card__actions",children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:x,onClick:()=>s?.(i,"skip","once",m.trim()||void 0),type:"button",children:u("approval.confirmSkip")}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--cancel",disabled:x,onClick:K,type:"button",children:u("common.cancel")})]})]}):n.jsxs("div",{className:"cheng-approval-card__actions",children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--approve",disabled:x,onClick:()=>s?.(i,"approved","once"),type:"button",children:u(x?"approval.submitting":"approval.approveOnce")}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--approve",disabled:x,onClick:()=>s?.(i,"approved","session"),type:"button",children:u("approval.alwaysAllow")}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:x,onClick:()=>s?.(i,"rejected","once"),type:"button",children:u("approval.reject")}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--suggest",disabled:x,onClick:()=>h(!0),type:"button",children:u("approval.skipWithFeedback")})]})]})}function Jh({review:a,messageId:i,onContinue:s}){const{t:u}=Ie(),[p,h]=g.useState(a.suggestedNextAction||"Continue."),m=a.status==="waiting",c=a.status==="continuing",x=m||c;return n.jsxs("div",{className:"cheng-agent-review-card",children:[n.jsxs("div",{className:"cheng-agent-review-card__header",children:[n.jsx("span",{className:"cheng-agent-review-card__badge",children:u("agentReview.badge")}),n.jsx("span",{className:"cheng-agent-review-card__title",children:u("agentReview.title")}),n.jsx("span",{className:"cheng-agent-review-card__meta",children:u("agentReview.iteration",{iteration:a.iteration})})]}),n.jsx("div",{className:"cheng-agent-review-card__reason",children:a.reason}),a.interimReport&&n.jsx("pre",{className:"cheng-agent-review-card__report",children:a.interimReport}),n.jsx("div",{className:"cheng-agent-review-card__suggestion",children:n.jsxs("label",{className:"cheng-agent-review-card__suggestion-label",children:[u("agentReview.nextAction"),n.jsx("textarea",{className:"cheng-agent-review-card__suggestion-input",value:p,onChange:y=>h(y.target.value),rows:2,disabled:x})]})}),m&&n.jsx("div",{className:"cheng-agent-review-card__waiting",children:u("agentReview.waiting")}),n.jsx("button",{className:"cheng-agent-review-card__btn",disabled:x,onClick:()=>s?.(i,p.trim()||"Continue."),type:"button",children:u(m?"agentReview.saving":c?"agentReview.continuing":"agentReview.continue")})]})}function Zh(a){const i=[],s=[],u="<think>",p="</think>";let h=0,m=!1;for(;h<a.length;){const c=a.indexOf(u,h);if(c===-1){s.push(a.slice(h));break}s.push(a.slice(h,c));const x=c+u.length,y=a.indexOf(p,x);if(y===-1){i.push(a.slice(x).trim()),m=!0;break}i.push(a.slice(x,y).trim()),h=y+p.length}return{thinkBlocks:i,visibleContent:s.join("").trim(),hasThinkTag:i.length>0||a.includes(u),isThinkOpen:m}}function eg(a,i,s){const u=new Date,p=u.getTime()-a.getTime();if(p<60*1e3)return i("messageBubble.justNow");if(p<3600*1e3){const h=Math.floor(p/6e4);return i("messageBubble.minutesAgo",{minutes:h})}return a.toDateString()===u.toDateString()?a.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit"}):a.toLocaleString(s,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}const tg=`
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
`;function ng({className:a="",onRetry:i}){const{messages:s,submitApproval:u,continueAgentReview:p,submitContextMemoryReview:h}=gi(),{t:m}=Ie(),c=g.useRef(null),[x,y]=g.useState(!1),[j,S]=g.useState(!0),M=()=>{if(!c.current)return;const{scrollTop:O,scrollHeight:K,clientHeight:I}=c.current,z=K-O-I<100;y(!z),S(z)},B=(O=!1)=>{if(!c.current)return;const K=c.current.scrollHeight;typeof c.current.scrollTo=="function"?c.current.scrollTo({top:K,behavior:O?"smooth":"auto"}):c.current.scrollTop=K};return g.useEffect(()=>{j&&B()},[s,j]),g.useEffect(()=>{B()},[]),n.jsxs("div",{className:`cheng-message-list ${a}`,children:[n.jsx("div",{className:"cheng-message-list__container",ref:c,onScroll:M,children:s.length===0?n.jsxs("div",{className:"cheng-message-list__empty",children:[n.jsx("div",{className:"cheng-message-list__empty-icon",children:"💬"}),n.jsx("p",{className:"cheng-message-list__empty-text",children:m("messageList.empty")})]}):n.jsx("div",{className:"cheng-message-list__messages",children:s.map(O=>n.jsx(Yh,{message:O,onRetry:i,onApprovalDecision:u,onAgentReviewContinue:p,onSubmitContextMemoryReview:h},O.id))})}),x&&n.jsxs("button",{className:"cheng-message-list__scroll-button",onClick:()=>{B(!0),S(!0)},type:"button","aria-label":m("messageList.scrollToBottom"),children:[n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M5 7.5L10 12.5L15 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),n.jsx("span",{className:"cheng-message-list__scroll-button-text",children:m("messageList.newMessage")})]}),n.jsx("style",{children:rg})]})}const rg=`
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
`;function og(a){return new Promise((i,s)=>{const u=new FileReader;u.onload=()=>{const p=u.result,h=p.indexOf(",");i(h>=0?p.slice(h+1):p)},u.onerror=s,u.readAsDataURL(a)})}async function ig(a){return Promise.all(a.map(async i=>{const s=await og(i);return{filename:i.name,mime_type:i.type||void 0,base64_content:s,size:i.size}}))}function ag(a){return a<1024?`${a} B`:a<1024*1024?`${(a/1024).toFixed(1)} KB`:`${(a/1024/1024).toFixed(1)} MB`}const sg=["image/jpeg","image/png","image/gif","image/webp","image/bmp","image/svg+xml","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","text/plain","text/csv","text/markdown","audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/flac","video/mp4","video/quicktime","video/x-msvideo","video/x-matroska","video/webm"].join(",");function cg({className:a="",placeholder:i,disabled:s=!1,maxLength:u=2e3,autoFocus:p=!0,channels:h=[],activeChannelId:m=null,activeChannel:c=null,onSelectChannel:x}){const{sendMessage:y,resetConversation:j,isLoading:S,supportsAttachments:M}=gi(),{t:B}=Ie(),O=i??B("chatWindow.placeholder"),[K,I]=g.useState(""),[z,$]=g.useState([]),[G,E]=g.useState(!1),Q=g.useRef(null),X=g.useRef(null),Y=g.useRef(null),J=s||S,de=!J&&(K.trim().length>0||z.length>0),se=te=>{const C=te.trim().toLowerCase();return C?h.find(q=>q.channelId.toLowerCase()===C)??h.find(q=>q.id.toLowerCase()===C)??h.find(q=>q.name.toLowerCase()===C)??null:null};g.useEffect(()=>{if(!G)return;const te=C=>{X.current&&(X.current.contains(C.target)||E(!1))};return window.addEventListener("mousedown",te),()=>{window.removeEventListener("mousedown",te)}},[G]);const ue=async te=>{te.preventDefault();const C=K.trim();if(!(!C&&z.length===0)&&!J)try{if(z.length===0&&C.startsWith("~")){const A=C.slice(1).trim();if(A.toLowerCase()==="new"){j(),I("");return}const w=se(A);if(w&&x){x(w),j(),I("");return}}let q;z.length>0&&(q=await ig(z)),await y(C||" ",q),I(""),$([]),Q.current&&(Q.current.style.height="auto")}catch(q){console.error("[InputBar] Failed to send message:",q)}},V=te=>{te.key==="Enter"&&!te.shiftKey&&(te.preventDefault(),ue(te))},ce=te=>{const C=te.target.value;I(C),Q.current&&(Q.current.style.height="auto",Q.current.style.height=`${Math.min(Q.current.scrollHeight,120)}px`)},re=()=>{!M||J||Y.current?.click()},_e=te=>{const C=Array.from(te.target.files??[]);C.length!==0&&($(q=>[...q,...C]),te.target.value="")},ae=te=>{$(C=>C.filter((q,A)=>A!==te))};return n.jsxs("div",{className:`cheng-input-bar ${a}`,children:[n.jsx("form",{className:"cheng-input-bar__form",onSubmit:ue,children:n.jsxs("div",{className:"cheng-input-bar__composer",children:[z.length>0&&n.jsx("div",{className:"cheng-input-bar__attachments",children:z.map((te,C)=>n.jsxs("div",{className:"cheng-input-bar__attachment-chip",children:[n.jsx("span",{className:"cheng-input-bar__attachment-icon",children:lg(te.type)}),n.jsx("span",{className:"cheng-input-bar__attachment-name",title:te.name,children:te.name}),n.jsx("span",{className:"cheng-input-bar__attachment-size",children:ag(te.size)}),n.jsx("button",{type:"button",className:"cheng-input-bar__attachment-remove",onClick:()=>ae(C),"aria-label":B("inputBar.removeFile",{name:te.name}),children:n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M2 2L10 10M10 2L2 10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]},C))}),n.jsx("textarea",{ref:Q,className:"cheng-input-bar__textarea",placeholder:O,value:K,onChange:ce,onKeyDown:V,disabled:J,maxLength:u,autoFocus:p,rows:1}),n.jsxs("div",{className:"cheng-input-bar__toolbar",children:[n.jsxs("div",{className:"cheng-input-bar__toolbar-left",children:[n.jsxs("div",{className:"cheng-input-bar__attachment-wrap",children:[n.jsx("button",{className:`cheng-input-bar__icon-button${M?"":" cheng-input-bar__icon-button--disabled"}`,type:"button","aria-label":B("inputBar.addAttachment"),title:B(M?"inputBar.addAttachmentTitle":"inputBar.attachmentUnavailable"),onClick:re,disabled:!M||J,children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M15.5 8.5L8.5 15.5C6.843 17.157 4.157 17.157 2.5 15.5C0.843 13.843 0.843 11.157 2.5 9.5L9.5 2.5C10.657 1.343 12.343 1.343 13.5 2.5C14.657 3.657 14.657 5.343 13.5 6.5L6.5 13.5C5.948 14.052 5.052 14.052 4.5 13.5C3.948 12.948 3.948 12.052 4.5 11.5L11 5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})}),n.jsx("input",{ref:Y,type:"file",multiple:!0,accept:sg,className:"cheng-input-bar__file-input",onChange:_e,tabIndex:-1,"aria-hidden":"true"})]}),h.length>0&&n.jsxs("div",{className:"cheng-input-bar__select-wrap",ref:X,children:[n.jsx("button",{className:"cheng-input-bar__select-button",type:"button","aria-haspopup":"listbox","aria-expanded":G,onClick:()=>E(te=>!te),children:n.jsx("span",{className:"cheng-input-bar__select-button-text",children:c?.name||h[0]?.name||B("inputBar.selectChannel")})}),G&&n.jsx("div",{className:"cheng-input-bar__select-menu",role:"listbox","aria-label":B("inputBar.channels"),children:h.map(te=>{const C=te.id===m;return n.jsxs("button",{type:"button",role:"option","aria-selected":C,className:`cheng-input-bar__select-option${C?" cheng-input-bar__select-option--active":""}`,onClick:()=>{x?.(te),E(!1)},children:[n.jsx("span",{className:"cheng-input-bar__select-option-name",children:te.name}),n.jsx("span",{className:"cheng-input-bar__select-option-id",children:te.channelId})]},te.id)})})]})]}),n.jsx("button",{className:"cheng-input-bar__button",type:"submit",disabled:!de,"aria-label":B("inputBar.sendMessage"),children:S?n.jsx("div",{className:"cheng-input-bar__spinner"}):n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M10 3.5V16.5M10 3.5L5 8.5M10 3.5L15 8.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]})]})}),K.length>u*.8&&n.jsxs("div",{className:"cheng-input-bar__counter",children:[K.length," / ",u]}),n.jsx("style",{children:dg})]})}function lg(a){return a.startsWith("image/")?"🖼":a.startsWith("audio/")?"🎵":a.startsWith("video/")?"🎬":a==="application/pdf"?"📄":a.includes("word")||a.includes("wordprocessingml")?"📝":a.includes("excel")||a.includes("spreadsheetml")?"📊":a.includes("powerpoint")||a.includes("presentationml")?"📑":"📎"}const dg=`
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
`;function ug({className:a="",style:i={},title:s,placeholder:u,showStatus:p=!0,height:h="600px",channels:m=[],activeChannelId:c=null,activeChannel:x=null,onSelectChannel:y}){const{resetConversation:j,error:S}=gi(),{t:M}=Ie(),B=s??M("chatWindow.title"),O=u??M("chatWindow.placeholder");return n.jsxs("div",{className:`cheng-chat-window ${a}`,style:{...i,height:typeof h=="number"?`${h}px`:h},children:[n.jsxs("div",{className:"cheng-chat-window__header",children:[n.jsxs("div",{className:"cheng-chat-window__header-left",children:[n.jsx("h2",{className:"cheng-chat-window__title",children:B}),p&&n.jsx(Oh,{})]}),n.jsx("div",{className:"cheng-chat-window__header-right",children:n.jsx("button",{className:"cheng-chat-window__reset-button",onClick:j,type:"button","aria-label":M("chatWindow.newConversation"),title:M("chatWindow.newConversation"),children:n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C8.34315 16 6.84315 15.3284 5.75736 14.2426",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),n.jsx("path",{d:"M7 10L4 10L4 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})})]}),S&&n.jsxs("div",{className:"cheng-chat-window__error",children:[n.jsx("span",{className:"cheng-chat-window__error-icon",children:"⚠️"}),n.jsx("span",{className:"cheng-chat-window__error-text",children:S.message})]}),n.jsx("div",{className:"cheng-chat-window__body",children:n.jsx(ng,{})}),n.jsx("div",{className:"cheng-chat-window__footer",children:n.jsx(cg,{placeholder:O,channels:m,activeChannelId:c,activeChannel:x,onSelectChannel:y})}),n.jsx("style",{children:pg})]})}const pg=`
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
`,hg=/^[a-z0-9-]+$/,ps=["🤖","🧠","🛠️","📊","💬","🚀","🧭","✨"];function gg(a){if(!a)return"";const{avatarIcon:i,...s}=a;return Object.keys(s).length>0?JSON.stringify(s,null,2):""}function fg({onSubmit:a,apiBaseUrl:i,onSuccess:s,isActive:u=!0,defaultAppType:p="",initialChannel:h=null,existingChannels:m=[],mode:c="create",showCancelButton:x=!1,onCancel:y,submitLabel:j}){const{t:S}=Ie(),M=c==="edit",[B,O]=g.useState(""),[K,I]=g.useState(""),[z,$]=g.useState(""),[G,E]=g.useState(""),[Q,X]=g.useState(""),[Y,J]=g.useState(p),[de,se]=g.useState(ps[0]),[ue,V]=g.useState(""),[ce,re]=g.useState(!1),[_e,ae]=g.useState(!1),[te,C]=g.useState(!1),[q,A]=g.useState([]),[w,k]=g.useState([]),[P,b]=g.useState(null),[H,T]=g.useState(null),[W,R]=g.useState(null),F=g.useRef(null),he=g.useCallback(()=>{const pe=h?.connectionConfig?.avatarIcon;O(h?.name??""),I(h?.channelId??""),$(h?.workspaceId??""),E(h?.boundWorkflowId??""),X(h?.description??""),J(h?.appType??p),se(typeof pe=="string"&&pe.trim()?pe:ps[0]),V(gg(h?.connectionConfig)),A([]),k([]),b(null),T(null),ae(!1),C(!1),R(null),re(!1)},[p,h]);g.useEffect(()=>{he()},[he]);const ke=g.useCallback(async()=>{if(!i){A([]),b(S("createChannel.errorMissingApiBaseWorkspaces"));return}ae(!0),b(null);try{const pe=new Be(i),Ne=await new Je(i,pe).listWorkspaces();A(Ne),$(Le=>!Le&&Ne.length>0?Ne[0].id:Le)}catch(pe){A([]),b(pe instanceof Error?pe.message:S("createChannel.errorLoadWorkspaces"))}finally{ae(!1)}},[i]);g.useEffect(()=>{!u||!i||F.current!==i&&(F.current=i,ke())},[u,ke]);const we=g.useCallback(async()=>{if(!i){k([]),T(S("createChannel.errorMissingApiBaseWorkflows"));return}if(!z){k([]),T(null);return}C(!0),T(null);try{const pe=new Be(i),Ne=await new Je(i,pe).listPublishedWorkflows({workspaceId:z});k(Ne),E(Le=>!Le&&Ne.length>0?Ne[0].id:Le)}catch(pe){k([]),T(pe instanceof Error?pe.message:S("createChannel.errorLoadWorkflows"))}finally{C(!1)}},[i,z]),Te=g.useRef(we);Te.current=we,g.useEffect(()=>{u&&z&&Te.current()},[u,z]);const Qe=g.useCallback(pe=>{const oe=pe.target.value;O(oe),I(Ne=>{const Le=B.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return Ne===Le||Ne===""?oe.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):Ne})},[B]),Se=g.useCallback(async pe=>{if(pe.preventDefault(),R(null),!B.trim()){R(S("createChannel.errorNameRequired"));return}if(!K.trim()){R(S("createChannel.errorChannelIdRequired"));return}if(!z.trim()){R(S("createChannel.errorWorkspaceRequired"));return}if(!G.trim()){R(S("createChannel.errorWorkflowRequired"));return}if(!hg.test(K)){R(S("createChannel.errorChannelIdPattern"));return}const oe=K.trim().toLowerCase();if(m.find(Le=>M&&h&&Le.id===h.id?!1:Le.workspaceId===z.trim()&&Le.channelId.trim().toLowerCase()===oe)){R(S("createChannel.errorDuplicateId",{channelId:K.trim()}));return}re(!0);try{const Ke={...ue.trim()?JSON.parse(ue):{},avatarIcon:de},ct={name:B.trim(),channelId:K.trim(),workspaceId:z.trim(),boundWorkflowId:G.trim(),description:Q.trim()||void 0,appType:Y.trim()||void 0,connectionConfig:Ke};M&&h?await a({id:h.id,...ct}):await a(ct),he(),s?.()}catch(Le){R(Le instanceof SyntaxError?S("createChannel.errorInvalidJson"):Le instanceof Error?Le.message:S(M?"createChannel.errorUpdateFailed":"createChannel.errorCreateFailed")),re(!1)}},[B,K,z,G,Q,Y,de,ue,h,m,M,a,he,s]);return n.jsxs("form",{className:"cheng-channel-form",onSubmit:Se,children:[W&&n.jsx("div",{className:"cheng-channel-form__error",children:W}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-name",children:[S("createChannel.name")," *"]}),n.jsx("input",{id:"cf-name",className:"cheng-channel-form__input",type:"text",value:B,onChange:Qe,placeholder:S("createChannel.namePlaceholder"),autoFocus:!0,disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-channel-id",children:[S("createChannel.agentId")," *",n.jsx("span",{className:"cheng-channel-form__label-hint",children:S("createChannel.agentIdHint")})]}),n.jsx("input",{id:"cf-channel-id",className:"cheng-channel-form__input",type:"text",value:K,onChange:pe=>I(pe.target.value),placeholder:S("createChannel.agentIdPlaceholder"),disabled:ce||M})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-workspace-id",children:[S("createChannel.workspace")," *"]}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{ke()},disabled:ce||_e||M,children:S(_e?"common.loading":"createChannel.refresh")})]}),n.jsxs("select",{id:"cf-workspace-id",className:"cheng-channel-form__input",value:z,onChange:pe=>$(pe.target.value),disabled:ce||_e||M,children:[n.jsx("option",{value:"",children:S(_e?"createChannel.loadingWorkspaces":"createChannel.selectWorkspace")}),q.map(pe=>n.jsx("option",{value:pe.id,children:pe.name||pe.id},pe.id))]}),P&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:P})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-workflow-id",children:[S("createChannel.publishedWorkflow")," *"]}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{we()},disabled:ce||te,children:S(te?"common.loading":"createChannel.refresh")})]}),n.jsxs("select",{id:"cf-workflow-id",className:"cheng-channel-form__input",value:G,onChange:pe=>E(pe.target.value),disabled:ce||te,children:[n.jsx("option",{value:"",children:S(te?"createChannel.loadingWorkflows":"createChannel.selectWorkflow")}),w.map(pe=>n.jsx("option",{value:pe.id,children:pe.name||pe.id},pe.id)),G&&!w.some(pe=>pe.id===G)&&n.jsx("option",{value:G,children:G})]}),H&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:H}),!te&&!H&&w.length===0&&z&&n.jsx("div",{className:"cheng-channel-form__field-hint",children:S("createChannel.noWorkflowsHint")})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-app-type",children:S("createChannel.appType")}),n.jsx("input",{id:"cf-app-type",className:"cheng-channel-form__input",type:"text",value:Y,onChange:pe=>J(pe.target.value),placeholder:S("createChannel.appTypePlaceholder"),disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",children:S("createChannel.agentAvatar")}),n.jsx("div",{className:"cheng-channel-form__avatar-grid",role:"radiogroup","aria-label":"Agent avatar",children:ps.map(pe=>{const oe=de===pe;return n.jsx("button",{type:"button",className:`cheng-channel-form__avatar-option${oe?" cheng-channel-form__avatar-option--selected":""}`,onClick:()=>se(pe),"aria-pressed":oe,disabled:ce,children:n.jsx("span",{className:"cheng-channel-form__avatar-emoji","aria-hidden":"true",children:pe})},pe)})}),n.jsx("div",{className:"cheng-channel-form__field-hint",children:S("createChannel.avatarHint")})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-desc",children:S("createChannel.description")}),n.jsx("input",{id:"cf-desc",className:"cheng-channel-form__input",type:"text",value:Q,onChange:pe=>X(pe.target.value),placeholder:S("createChannel.descriptionPlaceholder"),disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-conn-cfg",children:S("createChannel.connectionConfig")}),n.jsx("textarea",{id:"cf-conn-cfg",className:"cheng-channel-form__input cheng-channel-form__textarea",value:ue,onChange:pe=>V(pe.target.value),placeholder:'{"botToken":"..."}',rows:4,disabled:ce})]}),n.jsxs("div",{className:"cheng-channel-form__footer",children:[x&&y&&n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--secondary",type:"button",onClick:y,disabled:ce,children:S("createChannel.cancel")}),n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--primary",type:"submit",disabled:ce,children:ce?S(M?"createChannel.saving":"createChannel.creating"):j??S("common.submit")})]}),n.jsx("style",{children:mg})]})}const mg=`
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
`;function xg({isOpen:a,onClose:i,mode:s="create",initialChannel:u=null,existingChannels:p=[],onCreate:h,onUpdate:m,apiBaseUrl:c}){const{t:x}=Ie(),y=s==="edit";return a?n.jsx("div",{className:"cheng-modal-overlay",onClick:i,children:n.jsxs("div",{className:"cheng-modal",onClick:j=>j.stopPropagation(),children:[n.jsxs("div",{className:"cheng-modal__header",children:[n.jsxs("div",{className:"cheng-modal__header-copy",children:[n.jsx("h3",{className:"cheng-modal__title",children:x(y?"createChannel.modal.editTitle":"createChannel.modal.createTitle")}),n.jsx("p",{className:"cheng-modal__subtitle",children:x(y?"createChannel.modal.editSubtitle":"createChannel.modal.createSubtitle")})]}),n.jsx("button",{className:"cheng-modal__close",onClick:i,type:"button","aria-label":x("common.close"),children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M4 4l10 10M14 4L4 14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsx("div",{className:"cheng-modal__body",children:n.jsx(fg,{onSubmit:async j=>{if(y){if(!m)throw new Error("Update handler is not configured");await m(j);return}await h(j)},apiBaseUrl:c,onSuccess:i,isActive:a,initialChannel:u,existingChannels:p,mode:s,showCancelButton:!0,onCancel:i,submitLabel:x(y?"createChannel.modal.saveChanges":"createChannel.modal.createTitle")})}),n.jsx("style",{children:_g})]})}):null}const _g=`
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
`,hs={pending:"sessionList.status.running",running:"sessionList.status.running",waiting_for_review:"sessionList.status.needsReview",completed_unread:"sessionList.status.completed",failed_unread:"sessionList.status.failed",cancelled:"sessionList.status.cancelled",unknown:"sessionList.status.reconnecting"};function wg(a,i,s){const u=new Date(a);return Number.isNaN(u.getTime())?i("sessionList.createdUnknown"):i("sessionList.createdAt",{time:u.toLocaleString(s,{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})})}function bg({sessions:a,activeSessionId:i,onSelect:s,onCreateClick:u,onDeleteSession:p,onRenameSession:h,onTogglePinSession:m}){const{t:c,locale:x}=Ie(),[y,j]=g.useState(null),[S,M]=g.useState(null),[B,O]=g.useState(""),K=g.useRef(null),I=g.useRef(null);g.useEffect(()=>{const G=E=>{K.current&&(K.current.contains(E.target)||(j(null),M(null)))};return document.addEventListener("mousedown",G),()=>document.removeEventListener("mousedown",G)},[]),g.useEffect(()=>{S&&(I.current?.focus(),I.current?.select())},[S]);const z=G=>{if(!h)return;const E=B.trim();!E||E===G.label||(h(G.id,E),j(null),M(null),O(""))},$=a.length>1&&!!p;return n.jsxs("div",{className:"cheng-session-list",ref:K,children:[n.jsxs("div",{className:"cheng-session-list__header",children:[n.jsx("span",{className:"cheng-session-list__title",children:c("sessionList.title")}),n.jsx("button",{className:"cheng-session-list__add-btn",onClick:u,type:"button","aria-label":c("sessionList.createConversation"),title:c("sessionList.createConversation"),children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsxs("ul",{className:"cheng-session-list__items",children:[a.map(G=>n.jsxs("li",{className:`cheng-session-list__item${G.id===i?" cheng-session-list__item--active":""}`,children:[n.jsxs("button",{className:"cheng-session-list__item-main",onClick:()=>s(G),type:"button",title:G.label,children:[n.jsx("span",{className:"cheng-session-list__item-icon",title:wg(G.createdAt,c,x),children:n.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M7 1C3.68629 1 1 3.68629 1 7C1 8.20693 1.35785 9.33012 1.97285 10.2718L1 13L3.72822 12.0272C4.66988 12.6421 5.79307 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})})}),n.jsxs("span",{className:"cheng-session-list__item-meta",children:[n.jsx("span",{className:"cheng-session-list__item-label",children:G.label}),G.executionStatus&&hs[G.executionStatus]&&n.jsx("span",{className:`cheng-session-list__status cheng-session-list__status--${G.executionStatus}`,"aria-label":c("sessionList.statusAria",{label:G.label,status:c(hs[G.executionStatus])}),children:c(hs[G.executionStatus])})]})]}),n.jsxs("div",{className:"cheng-session-list__item-actions",children:[n.jsx("button",{className:"cheng-session-list__item-menu-trigger",type:"button","aria-label":c("sessionList.moreActionsFor",{label:G.label}),title:c("sessionList.moreActions"),onClick:E=>{E.stopPropagation(),j(Q=>Q===G.id?null:G.id)},children:n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"7",cy:"2.5",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"7",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"11.5",r:"1.2",fill:"currentColor"})]})}),y===G.id&&n.jsx("div",{className:"cheng-session-list__menu",role:"menu",children:S===G.id?n.jsxs("div",{className:"cheng-session-list__rename-wrap",children:[n.jsx("input",{ref:I,className:"cheng-session-list__rename-input",value:B,onChange:E=>O(E.target.value),onKeyDown:E=>{E.key==="Enter"&&(E.preventDefault(),z(G)),E.key==="Escape"&&(E.preventDefault(),M(null))},maxLength:80}),n.jsxs("div",{className:"cheng-session-list__rename-actions",children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:E=>{E.stopPropagation(),z(G)},children:c("common.save")}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:E=>{E.stopPropagation(),M(null)},children:c("common.cancel")})]})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:E=>{E.stopPropagation(),m?.(G.id),j(null)},role:"menuitem",children:G.pinned?c("sessionList.unpin"):c("sessionList.pin")}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:E=>{E.stopPropagation(),M(G.id),O(G.label)},role:"menuitem",children:c("sessionList.rename")}),n.jsx("button",{className:"cheng-session-list__menu-item cheng-session-list__menu-item--danger",type:"button",disabled:!$,onClick:E=>{E.stopPropagation(),p&&(p(G.id),j(null))},role:"menuitem",children:c("common.delete")})]})})]})]},G.id)),a.length===0&&n.jsx("li",{className:"cheng-session-list__empty",children:c("sessionList.empty")})]}),n.jsx("style",{children:kg})]})}const kg=`
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
`;function yg(a){return a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"telegram-bot"}function vg(a){const i=a.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Sg({agents:a,onCreate:i,apiBaseUrl:s,onPaired:u,onRefresh:p,onGoToAgents:h,onCancel:m}){const{t:c}=Ie(),[x,y]=g.useState("ready"),[j,S]=g.useState(""),[M,B]=g.useState(()=>a[0]?.id??""),[O,K]=g.useState(""),[I,z]=g.useState(null),[$,G]=g.useState(null),[E,Q]=g.useState(null),[X,Y]=g.useState(null),[J,de]=g.useState(!1),se=g.useRef(null),ue=g.useCallback(()=>(se.current||(se.current=new Je(s,new Be(s))),se.current),[s]),V=a.find(ae=>ae.id===M)??null,ce=g.useCallback(async ae=>{if(ae.preventDefault(),!(!j.trim()||!O.trim()||!V)){z(null),y("connecting");try{const te=yg(j),C=await i({name:j.trim(),channelId:te,workspaceId:V.workspaceId,boundWorkflowId:V.boundWorkflowId,appType:"telegram",description:`Telegram bot for agent: ${V.name}`});C.channelId!==te&&de(!0);const q=await ue().connectChannel(C.workspaceId,C.id,{bot_token:O.trim(),connection_mode:"polling"}),A=q.setupData,w=A?.username??A?.bot_username??A?.first_name;w&&Y(`@${w}`),Q(A?.connection_mode??"polling");const k={...C,connectionState:q.connectionState,webhookUrl:q.webhookUrl,setupData:q.setupData};G(k),y("connected"),p?.(),u(k)}catch(te){z(te instanceof Error?te.message:c("telegramPair.connectionFailed")),y("error")}}},[j,O,V,i,ue,u,c]);if(a.length===0)return n.jsxs("div",{className:"cheng-tg-form__no-agents",children:[n.jsx("div",{className:"cheng-tg-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-tg-form__no-agents-title",children:c("pairing.noAgentsTitle")}),n.jsx("p",{className:"cheng-tg-form__no-agents-desc",children:c("telegramPair.noAgentsDesc")}),h&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--secondary",onClick:h,children:c("pairing.goToAgents")}),n.jsx("style",{children:gs})]});if(x==="connected"&&$)return n.jsxs("div",{className:"cheng-tg-form__success",children:[n.jsx("div",{className:"cheng-tg-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-form__success-title",children:c(J?"telegramPair.reconnectedTitle":"telegramPair.connectedTitle")}),n.jsxs("p",{className:"cheng-tg-form__success-desc",children:[J&&n.jsx("span",{className:"cheng-tg-form__existing-note",children:c("telegramPair.existingNote")}),ne(c("telegramPair.activeDesc"),{name:n.jsx("strong",{children:$.name})}),X&&ne(c("telegramPair.asBot"),{botInfo:n.jsx("strong",{children:X})}),V&&ne(c("telegramPair.boundToAgent"),{name:n.jsx("strong",{children:V.name})}),"."]}),E==="polling"?n.jsxs("div",{className:"cheng-tg-form__polling-notice",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),c("telegramPair.pollingNotice")]}):null,n.jsx("p",{className:"cheng-tg-form__success-hint",children:c("telegramPair.successHint")}),n.jsx("style",{children:gs})]});const re=x==="connecting",_e=j.trim().length>0&&O.trim().length>0&&!!V&&!re;return n.jsxs("form",{className:"cheng-tg-form",onSubmit:ce,children:[n.jsxs("div",{className:"cheng-tg-form__instructions",children:[n.jsx("p",{className:"cheng-tg-form__instructions-title",children:c("telegramPair.howToTitle")}),n.jsxs("ol",{className:"cheng-tg-form__steps",children:[n.jsx("li",{children:ne(c("telegramPair.step1"),{botFather:n.jsx("strong",{children:"@BotFather"})})}),n.jsx("li",{children:ne(c("telegramPair.step2"),{cmd:n.jsx("code",{children:"/newbot"})})}),n.jsx("li",{children:c("telegramPair.step3")})]})]}),I&&n.jsxs("div",{className:"cheng-tg-form__error-banner",children:[n.jsx("span",{children:I}),n.jsx("button",{type:"button",className:"cheng-tg-form__retry-btn",onClick:()=>{y("ready"),z(null)},children:c("common.retry")})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-name",children:[c("pairing.integrationName")," ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("input",{id:"tg-name",className:"cheng-tg-form__input",type:"text",value:j,onChange:ae=>S(ae.target.value),placeholder:c("telegramPair.integrationNamePlaceholder"),disabled:re,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-tg-form__hint",children:c("telegramPair.integrationNameHint")})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-agent",children:[c("pairing.agent")," ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-tg-form__agent-select-wrap",children:n.jsx("select",{id:"tg-agent",className:"cheng-tg-form__input cheng-tg-form__input--select",value:M,onChange:ae=>B(ae.target.value),disabled:re,required:!0,children:a.map(ae=>n.jsxs("option",{value:ae.id,children:[vg(ae)," ",ae.name]},ae.id))})}),V&&n.jsxs("span",{className:"cheng-tg-form__hint",children:[ne(c("telegramPair.handledBy"),{name:n.jsx("strong",{children:V.name})}),V.description?` — ${V.description}`:""]})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-token",children:[c("telegramPair.botToken")," ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"}),n.jsx("span",{className:"cheng-tg-form__label-hint",children:c("telegramPair.botTokenHint")})]}),n.jsx("input",{id:"tg-token",className:"cheng-tg-form__input cheng-tg-form__input--token",type:"password",value:O,onChange:ae=>K(ae.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:re,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-form__hint",children:c("telegramPair.botTokenSecretHint")})]}),n.jsxs("div",{className:"cheng-tg-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--ghost",onClick:m,disabled:re,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-tg-form__btn cheng-tg-form__btn--connect",disabled:!_e,children:re?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-form__btn-spinner"}),c("pairing.connecting")]}):c("telegramPair.connectTelegram")})]}),n.jsx("style",{children:gs})]})}const gs=`
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
`;function jg({channel:a,agents:i,apiBaseUrl:s,onUpdate:u,onRefresh:p,onSaved:h,onCancel:m}){const{t:c}=Ie(),x=i.find(re=>re.boundWorkflowId===a.boundWorkflowId&&re.workspaceId===a.workspaceId)?.id??i[0]?.id??"",[y,j]=g.useState(x),[S,M]=g.useState(""),[B,O]=g.useState("ready"),[K,I]=g.useState(!1),[z,$]=g.useState(null),[G,E]=g.useState(null),Q=g.useRef(null),X=g.useCallback(()=>(Q.current||(Q.current=new Je(s,new Be(s))),Q.current),[s]),Y=i.find(re=>re.id===y)??null,J=Y&&(Y.workspaceId!==a.workspaceId||Y.boundWorkflowId!==a.boundWorkflowId),de=i.find(re=>re.boundWorkflowId===a.boundWorkflowId&&re.workspaceId===a.workspaceId)??null,se=g.useCallback(async re=>{if(!(!S.trim()||!Y)){E(null),$(null),re?O("saving"):I(!0);try{J&&await u({id:a.id,channelId:a.channelId,name:a.name,workspaceId:Y.workspaceId,boundWorkflowId:Y.boundWorkflowId,appType:a.appType,description:a.description});const _e=J?Y.workspaceId:a.workspaceId;await X().connectChannel(_e,a.id,{bot_token:S.trim(),connection_mode:"polling"}),p?.(),re?(O("saved"),setTimeout(()=>h(),1200)):(O("ready"),$(c("telegram.edit.testConnected")))}catch(_e){E(_e instanceof Error?_e.message:c("telegram.edit.updateFailed")),O("error"),$(null)}finally{re||I(!1)}}},[S,Y,J,a,u,X,p,h,c]),ue=g.useCallback(async re=>{re.preventDefault(),await se(!0)},[se]),V=B==="saving",ce=!!Y&&S.trim().length>0&&!V&&!K;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:c("telegram.edit.noAgents")}):B==="saved"?n.jsxs("div",{className:"cheng-tg-edit__success",children:[n.jsx("div",{className:"cheng-tg-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-edit__success-title",children:c("telegram.edit.updatedTitle")}),n.jsx("p",{className:"cheng-tg-edit__success-desc",children:ne(c("telegram.edit.updatedDesc"),{name:n.jsx("strong",{children:a.name})})}),n.jsx("style",{children:Td})]}):n.jsxs("form",{className:"cheng-tg-edit",onSubmit:ue,children:[G&&n.jsxs("div",{className:"cheng-tg-edit__error-banner",children:[n.jsx("span",{children:G}),n.jsx("button",{type:"button",className:"cheng-tg-edit__retry-btn",onClick:()=>{O("ready"),E(null)},children:c("common.retry")})]}),n.jsxs("div",{className:"cheng-tg-edit__grid",children:[n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:c("telegram.edit.routeToAgent")}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:c("telegram.edit.routeTip")})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("select",{className:"cheng-tg-edit__input cheng-tg-edit__input--select",value:y,onChange:re=>j(re.target.value),disabled:V,required:!0,children:i.map(re=>n.jsx("option",{value:re.id,children:re.name},re.id))}),Y&&n.jsxs("span",{className:"cheng-tg-edit__hint",children:[ne(c("telegram.edit.selected"),{name:n.jsx("strong",{children:Y.name})}),Y.description?` — ${Y.description}`:""]}),J&&Y&&n.jsx("div",{className:"cheng-tg-edit__notice",children:ne(c("telegram.edit.switchNotice"),{from:n.jsx("strong",{children:de?.name??c("telegram.edit.currentAgentFallback")}),to:n.jsx("strong",{children:Y.name})})})]})]}),n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:c("telegram.edit.botToken")}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:c("telegram.edit.botTokenTip")})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("input",{className:"cheng-tg-edit__input cheng-tg-edit__input--token",type:"password",value:S,onChange:re=>M(re.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:V,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-edit__hint",children:c("telegram.edit.botTokenHint")}),z&&n.jsx("div",{className:"cheng-tg-edit__test-ok",children:z}),n.jsx("div",{className:"cheng-tg-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--secondary",disabled:!Y||S.trim().length===0||V||K,onClick:()=>{se(!1)},children:K?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner cheng-tg-edit__spinner--dark"}),c("telegram.edit.testing")]}):c("telegram.edit.testConnection")})})]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--ghost",onClick:m,disabled:V,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-tg-edit__btn cheng-tg-edit__btn--connect",disabled:!ce,children:V?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner"}),c("telegram.edit.saving")]}):c("telegram.edit.saveReconnect")})]}),n.jsx("style",{children:Td})]})}const Td=`
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
`;function Cg(a){return a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"whatsapp-bot"}function Ng(a){const i=a.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Pg({agents:a,onCreate:i,apiBaseUrl:s,onPaired:u,onRefresh:p,onGoToAgents:h,onCancel:m}){const{t:c}=Ie(),[x,y]=g.useState("ready"),[j,S]=g.useState(""),[M,B]=g.useState(()=>a[0]?.id??""),[O,K]=g.useState(""),[I,z]=g.useState(""),[$,G]=g.useState(""),[E,Q]=g.useState(""),[X,Y]=g.useState("v21.0"),[J,de]=g.useState(null),[se,ue]=g.useState(null),[V,ce]=g.useState(null),[re,_e]=g.useState(null),ae=g.useRef(null),te=g.useCallback(()=>(ae.current||(ae.current=new Je(s,new Be(s))),ae.current),[s]),C=a.find(k=>k.id===M)??null,q=g.useCallback(async k=>{if(k.preventDefault(),!(!j.trim()||!O.trim()||!I.trim()||!$.trim()||!E.trim()||!C)){de(null),y("connecting");try{const P=Cg(j),b=await i({name:j.trim(),channelId:P,workspaceId:C.workspaceId,boundWorkflowId:C.boundWorkflowId,appType:"whatsapp",description:`WhatsApp integration for agent: ${C.name}`}),H=await te().connectChannel(b.workspaceId,b.id,{phone_number_id:O.trim(),access_token:I.trim(),signing_secret:$.trim(),webhook_verify_token:E.trim(),api_version:X.trim()||"v21.0"}),T=H.setupData,W=H.webhookUrl??T?.webhook_url??null,R=T?.webhook_verify_token??E.trim();ce(W),_e(R);const F={...b,connectionState:H.connectionState,webhookUrl:H.webhookUrl,setupData:H.setupData};ue(F),y("connected"),p?.(),u(F)}catch(P){de(P instanceof Error?P.message:c("whatsappPair.connectionFailed")),y("error")}}},[j,O,I,$,E,X,C,i,te,u,p,c]);if(a.length===0)return n.jsxs("div",{className:"cheng-wa-form__no-agents",children:[n.jsx("div",{className:"cheng-wa-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wa-form__no-agents-title",children:c("pairing.noAgentsTitle")}),n.jsx("p",{className:"cheng-wa-form__no-agents-desc",children:c("whatsappPair.noAgentsDesc")}),h&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--secondary",onClick:h,children:c("pairing.goToAgents")}),n.jsx("style",{children:fs})]});if(x==="connected"&&se)return n.jsxs("div",{className:"cheng-wa-form__success",children:[n.jsx("div",{className:"cheng-wa-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-form__success-title",children:c("whatsappPair.connectedTitle")}),n.jsxs("p",{className:"cheng-wa-form__success-desc",children:[ne(c("whatsappPair.createdVerified"),{name:n.jsx("strong",{children:se.name})}),C&&ne(c("whatsappPair.boundToAgent"),{name:n.jsx("strong",{children:C.name})}),"."]}),(V||re)&&n.jsxs("div",{className:"cheng-wa-form__webhook-box",children:[n.jsx("p",{className:"cheng-wa-form__webhook-box-title",children:c("whatsappPair.webhookBoxTitle")}),V&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:c("whatsappPair.webhookUrlLabel")}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:V})]}),re&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:c("whatsappPair.verifyTokenLabel")}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:re})]}),n.jsxs("ol",{className:"cheng-wa-form__meta-steps",children:[n.jsx("li",{children:ne(c("whatsappPair.metaStep1"),{metaDev:n.jsx("strong",{children:"Meta for Developers"}),config:n.jsx("strong",{children:"WhatsApp > Configuration"})})}),n.jsx("li",{children:ne(c("whatsappPair.metaStep2"),{webhook:n.jsx("strong",{children:"Webhook"}),edit:n.jsx("strong",{children:"Edit"})})}),n.jsx("li",{children:ne(c("whatsappPair.metaStep3"),{webhookUrl:n.jsx("strong",{children:c("whatsappPair.webhookUrlLabel")}),verifyToken:n.jsx("strong",{children:c("whatsappPair.verifyTokenLabel")})})}),n.jsx("li",{children:ne(c("whatsappPair.metaStep4"),{verifyAndSave:n.jsx("strong",{children:"Verify and Save"})})}),n.jsx("li",{children:ne(c("whatsappPair.metaStep5"),{messages:n.jsx("strong",{children:"messages"})})})]})]}),n.jsx("p",{className:"cheng-wa-form__success-hint",children:c("whatsappPair.successHint")}),m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",onClick:m,children:c("whatsappPair.doneClose")}),n.jsx("style",{children:fs})]});const A=x==="connecting",w=j.trim().length>0&&O.trim().length>0&&I.trim().length>0&&$.trim().length>0&&E.trim().length>0&&!!C&&!A;return n.jsxs("form",{className:"cheng-wa-form",onSubmit:q,children:[n.jsxs("div",{className:"cheng-wa-form__instructions",children:[n.jsx("p",{className:"cheng-wa-form__instructions-title",children:c("whatsappPair.beforeYouBegin")}),n.jsxs("ol",{className:"cheng-wa-form__steps",children:[n.jsx("li",{children:ne(c("whatsappPair.step1"),{metaBiz:n.jsx("strong",{children:"Meta Business Account"})})}),n.jsx("li",{children:ne(c("whatsappPair.step2"),{metaDev:n.jsx("strong",{children:"Meta for Developers"}),phoneId:n.jsx("strong",{children:c("whatsappPair.phoneNumberId")}),accessToken:n.jsx("strong",{children:c("whatsappPair.accessToken")})})}),n.jsx("li",{children:ne(c("whatsappPair.step3"),{webhookUrl:n.jsx("strong",{children:c("whatsappPair.webhookUrlLabel")})})})]})]}),J&&n.jsxs("div",{className:"cheng-wa-form__error-banner",children:[n.jsx("span",{children:J}),n.jsx("button",{type:"button",className:"cheng-wa-form__retry-btn",onClick:()=>{y("ready"),de(null)},children:c("common.retry")})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-name",children:[c("pairing.integrationName")," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-name",className:"cheng-wa-form__input",type:"text",value:j,onChange:k=>S(k.target.value),placeholder:c("whatsappPair.integrationNamePlaceholder"),disabled:A,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wa-form__hint",children:c("whatsappPair.integrationNameHint")})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-agent",children:[c("pairing.agent")," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wa-form__agent-select-wrap",children:n.jsx("select",{id:"wa-agent",className:"cheng-wa-form__input cheng-wa-form__input--select",value:M,onChange:k=>B(k.target.value),disabled:A,required:!0,children:a.map(k=>n.jsxs("option",{value:k.id,children:[Ng(k)," ",k.name]},k.id))})}),C&&n.jsxs("span",{className:"cheng-wa-form__hint",children:[ne(c("whatsappPair.handledBy"),{name:n.jsx("strong",{children:C.name})}),C.description?` — ${C.description}`:""]})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-phone-id",children:[c("whatsappPair.phoneNumberId")," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-phone-id",className:"cheng-wa-form__input",type:"text",value:O,onChange:k=>K(k.target.value),placeholder:"123456789012345",disabled:A,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:c("whatsappPair.phoneNumberIdHint")})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-access-token",children:[c("whatsappPair.accessToken")," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-access-token",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:I,onChange:k=>z(k.target.value),placeholder:"EAAxxxxxxxx...",disabled:A,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:c("whatsappPair.accessTokenHint")})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-signing-secret",children:[c("whatsappPair.appSecret")," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"}),n.jsx("span",{className:"cheng-wa-form__label-hint",children:c("whatsappPair.appSecretSuffix")})]}),n.jsx("input",{id:"wa-signing-secret",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:$,onChange:k=>G(k.target.value),placeholder:"Your app secret",disabled:A,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:c("whatsappPair.appSecretHint")})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-verify-token",children:[c("whatsappPair.verifyToken")," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-verify-token",className:"cheng-wa-form__input",type:"text",value:E,onChange:k=>Q(k.target.value),placeholder:"my-secret-verify-token",disabled:A,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:c("whatsappPair.verifyTokenHint")})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsx("label",{className:"cheng-wa-form__label",htmlFor:"wa-api-version",children:c("whatsappPair.apiVersion")}),n.jsx("input",{id:"wa-api-version",className:"cheng-wa-form__input",type:"text",value:X,onChange:k=>Y(k.target.value),placeholder:"v21.0",disabled:A,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:c("whatsappPair.apiVersionHint")})]}),n.jsxs("div",{className:"cheng-wa-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--ghost",onClick:m,disabled:A,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",disabled:!w,children:A?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-form__btn-spinner"}),c("pairing.connecting")]}):c("whatsappPair.connectWhatsApp")})]}),n.jsx("style",{children:fs})]})}const fs=`
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
`;function Ig({channel:a,agents:i,apiBaseUrl:s,onUpdate:u,onRefresh:p,onSaved:h,onCancel:m}){const{t:c}=Ie(),x=a.connectionConfig??{},y=i.find(T=>T.boundWorkflowId===a.boundWorkflowId&&T.workspaceId===a.workspaceId)?.id??i[0]?.id??"",[j,S]=g.useState(y),[M,B]=g.useState(typeof x.phone_number_id=="string"?x.phone_number_id:""),[O,K]=g.useState(typeof x.api_version=="string"?x.api_version:"v21.0"),[I,z]=g.useState(""),[$,G]=g.useState(""),[E,Q]=g.useState(""),[X,Y]=g.useState("ready"),[J,de]=g.useState(!1),[se,ue]=g.useState(null),[V,ce]=g.useState(null),[re,_e]=g.useState(a.webhookUrl??null),ae=g.useRef(null),te=g.useCallback(()=>(ae.current||(ae.current=new Je(s,new Be(s))),ae.current),[s]),C=i.find(T=>T.id===j)??null,q=i.find(T=>T.boundWorkflowId===a.boundWorkflowId&&T.workspaceId===a.workspaceId)??null,A=C&&(C.workspaceId!==a.workspaceId||C.boundWorkflowId!==a.boundWorkflowId),w=I.trim().length>0&&$.trim().length>0&&E.trim().length>0&&M.trim().length>0,k=g.useCallback(async T=>{if(C){ce(null),ue(null),T?Y("saving"):de(!0);try{if(A&&await u({id:a.id,channelId:a.channelId,name:a.name,workspaceId:C.workspaceId,boundWorkflowId:C.boundWorkflowId,appType:a.appType,description:a.description}),w){const W=A?C.workspaceId:a.workspaceId,R=await te().connectChannel(W,a.id,{phone_number_id:M.trim(),access_token:I.trim(),signing_secret:$.trim(),webhook_verify_token:E.trim(),api_version:O.trim()||"v21.0"}),F=R.setupData,he=R.webhookUrl??F?.webhook_url??null;he&&_e(he)}p?.(),T?(Y("saved"),setTimeout(()=>h(),1200)):(Y("ready"),ue(c(w?"waEdit.connectionVerified":"editPanel.agentBindingUpdated")))}catch(W){ce(W instanceof Error?W.message:c("editPanel.updateFailed")),Y("error"),ue(null)}finally{T||de(!1)}}},[C,A,w,a,u,te,M,I,$,E,O,p,h,c]),P=g.useCallback(async T=>{T.preventDefault(),await k(!0)},[k]),b=X==="saving",H=!!C&&(!!A||w)&&!b&&!J;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:c("editPanel.noAgents")}):X==="saved"?n.jsxs("div",{className:"cheng-wa-edit__success",children:[n.jsx("div",{className:"cheng-wa-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-edit__success-title",children:c("editPanel.updatedTitle")}),n.jsx("p",{className:"cheng-wa-edit__success-desc",children:ne(c("waEdit.updatedDesc"),{name:n.jsx("strong",{children:a.name}),status:c(w?"waEdit.reconfiguredReconnected":"waEdit.updated")})}),n.jsx("style",{children:Ld})]}):n.jsxs("form",{className:"cheng-wa-edit",onSubmit:P,children:[V&&n.jsxs("div",{className:"cheng-wa-edit__error-banner",children:[n.jsx("span",{children:V}),n.jsx("button",{type:"button",className:"cheng-wa-edit__retry-btn",onClick:()=>{Y("ready"),ce(null)},children:c("common.retry")})]}),re&&n.jsxs("div",{className:"cheng-wa-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wa-edit__webhook-label",children:c("waEdit.currentWebhookUrl")}),n.jsx("code",{className:"cheng-wa-edit__webhook-value",children:re})]}),n.jsxs("div",{className:"cheng-wa-edit__grid",children:[n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:c("editPanel.routeToAgent")}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:c("waEdit.routeTip")})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("select",{className:"cheng-wa-edit__input cheng-wa-edit__input--select",value:j,onChange:T=>S(T.target.value),disabled:b,required:!0,children:i.map(T=>n.jsx("option",{value:T.id,children:T.name},T.id))}),A&&C&&n.jsx("div",{className:"cheng-wa-edit__notice",children:ne(c("editPanel.switchNotice"),{from:n.jsx("strong",{children:q?.name??c("editPanel.currentAgentFallback")}),to:n.jsx("strong",{children:C.name})})})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:c("waEdit.phoneNumberId")}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:c("waEdit.phoneTip")})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:M,onChange:T=>B(T.target.value),placeholder:"123456789012345",disabled:b,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:c("waEdit.accessToken")}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:c("waEdit.accessTip")})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:I,onChange:T=>z(T.target.value),placeholder:c("waEdit.accessTokenPlaceholder"),disabled:b,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:c("waEdit.appSecret")}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:c("waEdit.appSecretTip")})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:$,onChange:T=>G(T.target.value),placeholder:c("editPanel.leaveBlankPlaceholder"),disabled:b,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:c("waEdit.verifyToken")}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:c("waEdit.verifyTip")})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:E,onChange:T=>Q(T.target.value),placeholder:c("editPanel.leaveBlankPlaceholder"),disabled:b,autoComplete:"off"}),se&&n.jsx("div",{className:"cheng-wa-edit__test-ok",children:se}),n.jsx("div",{className:"cheng-wa-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--secondary",disabled:!w||!C||b||J,onClick:()=>{k(!1)},children:J?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner cheng-wa-edit__spinner--dark"}),c("editPanel.testing")]}):c("editPanel.testConnection")})})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:c("waEdit.apiVersion")}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:c("waEdit.apiVersionTip")})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:O,onChange:T=>K(T.target.value),placeholder:"v21.0",disabled:b,autoComplete:"off"})})]})]}),!w&&n.jsxs("div",{className:"cheng-wa-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),c("waEdit.credsHint")]}),n.jsxs("div",{className:"cheng-wa-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--ghost",onClick:m,disabled:b,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-wa-edit__btn cheng-wa-edit__btn--connect",disabled:!H,children:b?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner"}),c("editPanel.saving")]}):c(w?"editPanel.saveReconnect":"editPanel.save")})]}),n.jsx("style",{children:Ld})]})}const Ld=`
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
`;function Eg(a){return a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"slack-app"}function Ag(a){const i=a.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Tg({agents:a,onCreate:i,apiBaseUrl:s,onPaired:u,onRefresh:p,onGoToAgents:h,onCancel:m}){const{t:c}=Ie(),[x,y]=g.useState("ready"),[j,S]=g.useState("webhook"),[M,B]=g.useState(""),[O,K]=g.useState(()=>a[0]?.id??""),[I,z]=g.useState(""),[$,G]=g.useState(""),[E,Q]=g.useState(""),[X,Y]=g.useState(""),[J,de]=g.useState(""),[se,ue]=g.useState(null),[V,ce]=g.useState(null),[re,_e]=g.useState(null),[ae,te]=g.useState(null),[C,q]=g.useState(null),[A,w]=g.useState("idle"),k=g.useRef(null),P=g.useCallback(()=>(k.current||(k.current=new Je(s,new Be(s))),k.current),[s]),b=a.find(R=>R.id===O)??null,H=g.useCallback(async R=>{R.preventDefault();const F=j==="webhook"&&M.trim()&&I.trim()&&$.trim()&&b,he=j==="socket_mode"&&M.trim()&&I.trim()&&E.trim()&&b;if(!F&&!he)return;ue(null),y("connecting");let ke;try{const we=Eg(M);ke=await i({name:M.trim(),channelId:we,workspaceId:b.workspaceId,boundWorkflowId:b.boundWorkflowId,appType:"slack",description:`Slack integration for agent: ${b.name}`})}catch(we){ue(we instanceof Error?we.message:c("slackPair.createFailed")),y("error");return}_e(ke);try{const we={bot_token:I.trim(),connection_mode:j};j==="webhook"?we.signing_secret=$.trim():we.app_token=E.trim(),X.trim()&&(we.app_id=X.trim()),J.trim()&&(we.team_id=J.trim());const Te=await P().connectChannel(ke.workspaceId,ke.id,we),Qe=Te.setupData,Se=j==="webhook"?Te.webhookUrl??Qe?.webhook_url??null:null;te(Se);const pe=Qe?.team_name??null,oe=Qe?.bot_user??null;(pe||oe)&&q([pe,oe?`Bot: ${oe}`:null].filter(Boolean).join(" · "));const Ne={...ke,connectionState:Te.connectionState,webhookUrl:Te.webhookUrl,setupData:Te.setupData};ce(Ne),y("connected"),p?.(),u(Ne)}catch(we){p?.(),ue(we instanceof Error?we.message:c(j==="webhook"?"slackPair.connectionFailedWebhook":"slackPair.connectionFailedSocket")),y("created")}},[j,M,I,$,E,X,J,b,i,P,u,p,c]);if(a.length===0)return n.jsxs("div",{className:"cheng-sl-form__no-agents",children:[n.jsx("div",{className:"cheng-sl-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-sl-form__no-agents-title",children:c("pairing.noAgentsTitle")}),n.jsx("p",{className:"cheng-sl-form__no-agents-desc",children:c("slackPair.noAgentsDesc")}),h&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:h,children:c("pairing.goToAgents")}),n.jsx("style",{children:si})]});if(x==="connected"&&V)return n.jsxs("div",{className:"cheng-sl-form__success",children:[n.jsx("div",{className:"cheng-sl-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-form__success-title",children:c("slackPair.connectedTitle")}),n.jsxs("p",{className:"cheng-sl-form__success-desc",children:[ne(c("slackPair.connectedDesc"),{name:n.jsx("strong",{children:V.name})}),C&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-sl-form__workspace-info",children:C})]}),b&&ne(c("slackPair.boundToAgent"),{name:n.jsx("strong",{children:b.name})}),"."]}),n.jsx("div",{className:"cheng-sl-form__mode-badge",children:c(j==="socket_mode"?"slackPair.modeSocket":"slackPair.modeWebhook")}),j==="webhook"&&ae&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:c("slackPair.eventSubsTitle")}),n.jsxs("div",{className:"cheng-sl-form__webhook-row",children:[n.jsx("span",{className:"cheng-sl-form__webhook-label",children:c("slackPair.requestUrl")}),n.jsxs("div",{className:"cheng-sl-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-sl-form__webhook-value",children:ae}),n.jsx("button",{type:"button",className:"cheng-sl-form__copy-btn",onClick:()=>{navigator.clipboard.writeText(ae).then(()=>{w("copied"),setTimeout(()=>w("idle"),2e3)})},children:A==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),c("common.copied")]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),c("common.copy")]})})]})]}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsx("li",{children:ne(c("slackPair.whConfigStep1"),{apiSlack:n.jsx("strong",{children:"api.slack.com/apps"}),eventSubs:n.jsx("strong",{children:"Event Subscriptions"})})}),n.jsx("li",{children:ne(c("slackPair.whConfigStep2"),{requestUrl:n.jsx("strong",{children:"Request URL"})})}),n.jsx("li",{children:ne(c("slackPair.whConfigStep3"),{subscribeBotEvents:n.jsx("strong",{children:"Subscribe to bot events"}),appMention:n.jsx("code",{children:"app_mention"}),messageIm:n.jsx("code",{children:"message.im"}),messageChannels:n.jsx("code",{children:"message.channels"})})}),n.jsx("li",{children:ne(c("slackPair.whConfigStep4"),{oauthPerms:n.jsx("strong",{children:"OAuth & Permissions"}),chatWrite:n.jsx("code",{children:"chat:write"}),appMentionsRead:n.jsx("code",{children:"app_mentions:read"}),imHistory:n.jsx("code",{children:"im:history"})})}),n.jsx("li",{children:c("slackPair.whConfigStep5")})]})]}),j==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:c("slackPair.socketModeTitle")}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsx("li",{children:ne(c("slackPair.smConfigStep1"),{apiSlack:n.jsx("strong",{children:"api.slack.com/apps"}),socketMode:n.jsx("strong",{children:"Socket Mode"}),enabled:n.jsx("strong",{children:"enabled"})})}),n.jsx("li",{children:ne(c("slackPair.smConfigStep2"),{eventSubs:n.jsx("strong",{children:"Event Subscriptions"}),appMention:n.jsx("code",{children:"app_mention"}),messageIm:n.jsx("code",{children:"message.im"}),messageChannels:n.jsx("code",{children:"message.channels"})})}),n.jsx("li",{children:ne(c("slackPair.smConfigStep3"),{oauthPerms:n.jsx("strong",{children:"OAuth & Permissions"}),chatWrite:n.jsx("code",{children:"chat:write"}),appMentionsRead:n.jsx("code",{children:"app_mentions:read"}),imHistory:n.jsx("code",{children:"im:history"}),connectionsWrite:n.jsx("code",{children:"connections:write"})})}),n.jsx("li",{children:c("slackPair.smConfigStep4")}),n.jsx("li",{children:c("slackPair.smConfigStep5")})]})]}),n.jsx("p",{className:"cheng-sl-form__success-hint",children:c(j==="webhook"?"slackPair.successHintWebhook":"slackPair.successHintSocket")}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",onClick:m,children:c("slackPair.doneClose")}),n.jsx("style",{children:si})]});if(x==="created"&&re)return n.jsxs("div",{className:"cheng-sl-form__created-warn",children:[n.jsx("div",{className:"cheng-sl-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-sl-form__created-warn-title",children:c("slackPair.createdWarnTitle")}),n.jsxs("p",{className:"cheng-sl-form__created-warn-desc",children:[ne(c("slackPair.createdWarnDesc"),{name:n.jsx("strong",{children:re.name})}),se?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:se})]}):"."," ",c("slackPair.createdWarnHint")]}),m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:m,children:c("common.close")}),n.jsx("style",{children:si})]});const T=x==="connecting",W=M.trim().length>0&&I.trim().length>0&&(j==="webhook"?$.trim().length>0:E.trim().length>0)&&!!b&&!T;return n.jsxs("form",{className:"cheng-sl-form",onSubmit:H,children:[n.jsxs("div",{className:"cheng-sl-form__mode-toggle-wrap",children:[n.jsx("span",{className:"cheng-sl-form__mode-toggle-label",children:c("slackPair.connectionMode")}),n.jsxs("div",{className:"cheng-sl-form__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${j==="webhook"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>S("webhook"),disabled:T,children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),c("slackPair.webhook")]}),n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${j==="socket_mode"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>S("socket_mode"),disabled:T,children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),c("slackPair.socketModeBtn")]})]}),n.jsx("span",{className:"cheng-sl-form__mode-toggle-hint",children:c(j==="webhook"?"slackPair.modeHintWebhook":"slackPair.modeHintSocket")})]}),n.jsxs("div",{className:"cheng-sl-form__instructions",children:[n.jsx("p",{className:"cheng-sl-form__instructions-title",children:c("slackPair.beforeYouBegin")}),j==="webhook"?n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsx("li",{children:ne(c("slackPair.whStep1"),{apiSlack:n.jsx("strong",{children:"api.slack.com/apps"})})}),n.jsx("li",{children:ne(c("slackPair.whStep2"),{oauthPerms:n.jsx("strong",{children:"OAuth & Permissions"}),botToken:n.jsx("strong",{children:"Bot User OAuth Token"}),xoxb:n.jsx("code",{children:"xoxb-..."})})}),n.jsx("li",{children:ne(c("slackPair.whStep3"),{basicInfo:n.jsx("strong",{children:"Basic Information → App Credentials"}),signingSecret:n.jsx("strong",{children:"Signing Secret"})})}),n.jsx("li",{children:ne(c("slackPair.whStep4"),{requestUrl:n.jsx("strong",{children:"Request URL"}),eventSubs:n.jsx("strong",{children:"Event Subscriptions"})})})]}):n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsx("li",{children:ne(c("slackPair.smStep1"),{apiSlack:n.jsx("strong",{children:"api.slack.com/apps"})})}),n.jsx("li",{children:ne(c("slackPair.smStep2"),{socketMode:n.jsx("strong",{children:"Socket Mode"}),enableSocket:n.jsx("strong",{children:"enable Socket Mode"})})}),n.jsx("li",{children:ne(c("slackPair.smStep3"),{oauthPerms:n.jsx("strong",{children:"OAuth & Permissions"}),botToken:n.jsx("strong",{children:"Bot User OAuth Token"}),xoxb:n.jsx("code",{children:"xoxb-..."})})}),n.jsx("li",{children:ne(c("slackPair.smStep4"),{basicInfoAppLevel:n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),connectionsWrite:n.jsx("code",{children:"connections:write"}),appLevelToken:n.jsx("strong",{children:"App-Level Token"}),xapp:n.jsx("code",{children:"xapp-..."})})}),n.jsx("li",{children:ne(c("slackPair.smStep5"),{eventSubs:n.jsx("strong",{children:"Event Subscriptions"})})})]})]}),se&&n.jsxs("div",{className:"cheng-sl-form__error-banner",children:[n.jsx("span",{children:se}),n.jsx("button",{type:"button",className:"cheng-sl-form__retry-btn",onClick:()=>{y("ready"),ue(null)},children:c("common.retry")})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-name",children:[c("pairing.integrationName")," ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-name",className:"cheng-sl-form__input",type:"text",value:M,onChange:R=>B(R.target.value),placeholder:c("slackPair.integrationNamePlaceholder"),disabled:T,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-sl-form__hint",children:c("slackPair.integrationNameHint")})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-agent",children:[c("pairing.agent")," ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-sl-form__agent-select-wrap",children:n.jsx("select",{id:"sl-agent",className:"cheng-sl-form__input cheng-sl-form__input--select",value:O,onChange:R=>K(R.target.value),disabled:T,required:!0,children:a.map(R=>n.jsxs("option",{value:R.id,children:[Ag(R)," ",R.name]},R.id))})}),b&&n.jsxs("span",{className:"cheng-sl-form__hint",children:[ne(c("slackPair.handledBy"),{name:n.jsx("strong",{children:b.name})}),b.description?` — ${b.description}`:""]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-bot-token",children:[c("slackPair.botToken")," ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:c("slackPair.botTokenHint")})]}),n.jsx("input",{id:"sl-bot-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:I,onChange:R=>z(R.target.value),placeholder:"xoxb-0000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:ne(c("slackPair.botTokenFoundIn"),{oauthPermsBotToken:n.jsx("strong",{children:"OAuth & Permissions → Bot User OAuth Token"})})})]}),j==="webhook"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-signing-secret",children:[c("slackPair.signingSecret")," ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-signing-secret",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:$,onChange:R=>G(R.target.value),placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:ne(c("slackPair.signingSecretFoundIn"),{basicInfoSigningSecret:n.jsx("strong",{children:"Basic Information → App Credentials → Signing Secret"})})})]}),j==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-token",children:[c("slackPair.appLevelToken")," ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:c("slackPair.appLevelTokenHint")})]}),n.jsx("input",{id:"sl-app-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:E,onChange:R=>Q(R.target.value),placeholder:"xapp-1-xxxxxxxxxx-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:ne(c("slackPair.appLevelTokenFoundIn"),{basicInfoAppTokens:n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),connectionsWrite:n.jsx("code",{children:"connections:write"})})})]}),n.jsxs("div",{className:"cheng-sl-form__optional-row",children:[n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-id",children:[c("slackPair.appId"),n.jsx("span",{className:"cheng-sl-form__label-hint",children:c("slackPair.appIdOptional")})]}),n.jsx("input",{id:"sl-app-id",className:"cheng-sl-form__input",type:"text",value:X,onChange:R=>Y(R.target.value),placeholder:"A0XXXXXXX",disabled:T,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:ne(c("slackPair.appIdFoundIn"),{basicInfoAppId:n.jsx("strong",{children:"Basic Information → App ID"})})})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-team-id",children:[c("slackPair.workspaceId"),n.jsx("span",{className:"cheng-sl-form__label-hint",children:c("slackPair.workspaceIdOptional")})]}),n.jsx("input",{id:"sl-team-id",className:"cheng-sl-form__input",type:"text",value:J,onChange:R=>de(R.target.value),placeholder:"T0XXXXXXX",disabled:T,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:c("slackPair.workspaceIdHint")})]})]}),n.jsxs("div",{className:"cheng-sl-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--ghost",onClick:m,disabled:T,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",disabled:!W,children:T?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-form__btn-spinner"}),c("pairing.connecting")]}):c("slackPair.connectSlack")})]}),n.jsx("style",{children:si})]})}const si=`
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
`;function Lg({channel:a,agents:i,apiBaseUrl:s,onUpdate:u,onRefresh:p,onSaved:h,onCancel:m}){const{t:c}=Ie(),x=a.connectionConfig??{},y=i.find(Se=>Se.boundWorkflowId===a.boundWorkflowId&&Se.workspaceId===a.workspaceId)?.id??i[0]?.id??"",j=typeof x.connection_mode=="string"&&x.connection_mode==="socket_mode"?"socket_mode":"webhook",[S,M]=g.useState(j),[B,O]=g.useState(y),K=typeof x.app_id=="string"?x.app_id:"",I=typeof x.team_id=="string"?x.team_id:"",[z,$]=g.useState(K),[G,E]=g.useState(I),[Q,X]=g.useState(""),[Y,J]=g.useState(""),[de,se]=g.useState(""),[ue,V]=g.useState("ready"),[ce,re]=g.useState(!1),[_e,ae]=g.useState(null),[te,C]=g.useState(null),[q,A]=g.useState(a.webhookUrl??null),w=g.useRef(null),k=g.useCallback(()=>(w.current||(w.current=new Je(s,new Be(s))),w.current),[s]),P=i.find(Se=>Se.id===B)??null,b=i.find(Se=>Se.boundWorkflowId===a.boundWorkflowId&&Se.workspaceId===a.workspaceId)??null,H=P&&(P.workspaceId!==a.workspaceId||P.boundWorkflowId!==a.boundWorkflowId),T=S!==j,W=S==="webhook"?Q.trim().length>0||Y.trim().length>0:Q.trim().length>0||de.trim().length>0,R=S==="webhook"?Q.trim().length>0&&Y.trim().length>0:Q.trim().length>0&&de.trim().length>0,F=T&&!R,he=g.useCallback(async Se=>{if(P&&!(!H&&!W&&!T)&&!F){C(null),ae(null),Se?V("saving"):re(!0);try{if(H&&await u({id:a.id,channelId:a.channelId,name:a.name,workspaceId:P.workspaceId,boundWorkflowId:P.boundWorkflowId,appType:a.appType,description:a.description}),W||T){const pe=H?P.workspaceId:a.workspaceId,oe={connection_mode:S};Q.trim()&&(oe.bot_token=Q.trim()),S==="webhook"?Y.trim()&&(oe.signing_secret=Y.trim()):de.trim()&&(oe.app_token=de.trim()),oe.app_id=z.trim()||null,oe.team_id=G.trim()||null;const Ne=await k().connectChannel(pe,a.id,oe),Le=Ne.setupData;if(S==="webhook"){const Ke=Ne.webhookUrl??Le?.webhook_url??null;Ke&&A(Ke)}else A(null)}if(p?.(),Se)V("saved"),setTimeout(()=>h(),1200);else{V("ready");let pe;T?pe=c("slackEdit.switchedMode",{mode:c(S==="socket_mode"?"slackEdit.socketMode":"slackEdit.webhookMode")}):W?pe=c("slackEdit.credsVerified"):pe=c("editPanel.agentBindingUpdated"),ae(pe)}}catch(pe){C(pe instanceof Error?pe.message:c("editPanel.updateFailed")),V("error"),ae(null)}finally{Se||re(!1)}}},[P,H,W,T,F,S,a,u,k,Q,Y,de,z,G,p,h,c]),ke=g.useCallback(async Se=>{Se.preventDefault(),await he(!0)},[he]),we=ue==="saving",Te=!!P&&(W||!!H&&!T)&&!F&&!we&&!ce,Qe=we?null:c(W||T?"editPanel.saveReconnect":"editPanel.save");return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:c("editPanel.noAgents")}):ue==="saved"?n.jsxs("div",{className:"cheng-sl-edit__success",children:[n.jsx("div",{className:"cheng-sl-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-edit__success-title",children:c("editPanel.updatedTitle")}),n.jsx("p",{className:"cheng-sl-edit__success-desc",children:ne(c("waEdit.updatedDesc"),{name:n.jsx("strong",{children:a.name}),status:c(W||T?"waEdit.reconfiguredReconnected":"waEdit.updated")})}),n.jsx("style",{children:Rd})]}):n.jsxs("form",{className:"cheng-sl-edit",onSubmit:ke,children:[te&&n.jsxs("div",{className:"cheng-sl-edit__error-banner",children:[n.jsx("span",{children:te}),n.jsx("button",{type:"button",className:"cheng-sl-edit__retry-btn",onClick:()=>{V("ready"),C(null)},children:c("common.retry")})]}),n.jsxs("div",{className:"cheng-sl-edit__mode-section",children:[n.jsxs("div",{className:"cheng-sl-edit__mode-header",children:[n.jsx("span",{className:"cheng-sl-edit__mode-label",children:c("slackEdit.connectionMode")}),n.jsxs("div",{className:"cheng-sl-edit__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${S==="webhook"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>M("webhook"),disabled:we,children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),c("slackEdit.webhook")]}),n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${S==="socket_mode"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>M("socket_mode"),disabled:we,children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),c("slackEdit.socketMode")]})]})]}),T&&n.jsxs("div",{className:"cheng-sl-edit__mode-change-warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),ne(c("slackEdit.switchWarn"),{from:n.jsx("strong",{children:c(j==="webhook"?"slackEdit.webhook":"slackEdit.socketMode")}),to:n.jsx("strong",{children:c(S==="webhook"?"slackEdit.webhook":"slackEdit.socketMode")}),creds:c(S==="webhook"?"slackEdit.credsWebhook":"slackEdit.credsSocket")})]})]}),S==="webhook"&&q&&n.jsxs("div",{className:"cheng-sl-edit__webhook-info",children:[n.jsx("span",{className:"cheng-sl-edit__webhook-label",children:c("slackEdit.requestUrlLabel")}),n.jsx("code",{className:"cheng-sl-edit__webhook-value",children:q}),n.jsx("span",{className:"cheng-sl-edit__webhook-hint",children:ne(c("slackEdit.requestUrlHint"),{eventSubs:n.jsx("strong",{children:c("slackEdit.eventSubs")})})})]}),S==="socket_mode"&&!T&&n.jsxs("div",{className:"cheng-sl-edit__socket-info",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),c("slackEdit.socketInfo")]}),n.jsxs("div",{className:"cheng-sl-edit__grid",children:[n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:c("editPanel.routeToAgent")}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:c("waEdit.routeTip")})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("select",{className:"cheng-sl-edit__input cheng-sl-edit__input--select",value:B,onChange:Se=>O(Se.target.value),disabled:we,required:!0,children:i.map(Se=>n.jsx("option",{value:Se.id,children:Se.name},Se.id))}),H&&P&&n.jsx("div",{className:"cheng-sl-edit__notice",children:ne(c("editPanel.switchNotice"),{from:n.jsx("strong",{children:b?.name??c("editPanel.currentAgentFallback")}),to:n.jsx("strong",{children:P.name})})})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:c("slackEdit.botToken")}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:ne(c("slackEdit.botTokenTip"),{token:n.jsx("code",{children:"xoxb-..."})})})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:Q,onChange:Se=>X(Se.target.value),placeholder:c("slackEdit.botTokenPlaceholder"),disabled:we,autoComplete:"off"})})]}),S==="webhook"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:c("slackEdit.signingSecret")}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:c(T?"slackEdit.signingSecretTipMode":"slackEdit.signingSecretTip")})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:Y,onChange:Se=>J(Se.target.value),placeholder:c(T?"slackEdit.signingSecretPlaceholderMode":"editPanel.leaveBlankPlaceholder"),disabled:we,autoComplete:"off"}),_e&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:_e}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!W||!P||we||ce||F,onClick:()=>{he(!1)},children:ce?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),c("editPanel.testing")]}):c("editPanel.testConnection")})})]})]}),S==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:c("slackEdit.appLevelToken")}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:c(T?"slackEdit.appTokenTipMode":"slackEdit.appTokenTip")})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:de,onChange:Se=>se(Se.target.value),placeholder:c(T?"slackEdit.appTokenPlaceholderMode":"slackEdit.appTokenPlaceholder"),disabled:we,autoComplete:"off"}),_e&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:_e}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!W||!P||we||ce||F,onClick:()=>{he(!1)},children:ce?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),c("editPanel.testing")]}):c("editPanel.testConnection")})})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:c("slackEdit.appId")}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:c(W?"slackEdit.fieldSavedOnReconnect":"slackEdit.fieldNeedsCreds")})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:z,onChange:Se=>$(Se.target.value),placeholder:"A0XXXXXXX",disabled:we||!W,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:c("slackEdit.workspaceId")}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:c(W?"slackEdit.fieldSavedOnReconnect":"slackEdit.fieldNeedsCreds")})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:G,onChange:Se=>E(Se.target.value),placeholder:"T0XXXXXXX",disabled:we||!W,autoComplete:"off"})})]})]}),!W&&!T&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),c(S==="webhook"?"slackEdit.credsHintWebhook":"slackEdit.credsHintSocket")]}),F&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint cheng-sl-edit__creds-hint--warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),ne(c("slackEdit.blockedHint"),{creds:c(S==="webhook"?"slackEdit.credsWebhook":"slackEdit.credsSocket")})]}),n.jsxs("div",{className:"cheng-sl-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--ghost",onClick:m,disabled:we,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-sl-edit__btn cheng-sl-edit__btn--connect",disabled:!Te,children:we?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner"}),c("editPanel.saving")]}):Qe})]}),n.jsx("style",{children:Rd})]})}const Rd=`
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
`;function Rg(a){return a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"wecom-bot"}function Mg(a){const i=a.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function zg({agents:a,onCreate:i,apiBaseUrl:s,onPaired:u,onRefresh:p,onGoToAgents:h,onCancel:m}){const{t:c}=Ie(),[x,y]=g.useState("ready"),[j,S]=g.useState(""),[M,B]=g.useState(()=>a[0]?.id??""),[O,K]=g.useState(""),[I,z]=g.useState(""),[$,G]=g.useState(""),[E,Q]=g.useState(""),[X,Y]=g.useState(""),[J,de]=g.useState(""),[se,ue]=g.useState(null),[V,ce]=g.useState(null),[re,_e]=g.useState(null),[ae,te]=g.useState(null),[C,q]=g.useState({}),A=g.useRef(null),w=g.useCallback(()=>(A.current||(A.current=new Je(s,new Be(s))),A.current),[s]),k=a.find(W=>W.id===M)??null,P=g.useCallback((W,R)=>{navigator.clipboard.writeText(R).then(()=>{q(F=>({...F,[W]:"copied"})),setTimeout(()=>q(F=>({...F,[W]:"idle"})),2e3)})},[]),b=g.useCallback(async W=>{if(W.preventDefault(),!j.trim()||!O.trim()||!I.trim()||!$.trim()||!E.trim()||!X.trim()||!k)return;ue(null),y("connecting");let R;try{const F=Rg(j);R=await i({name:j.trim(),channelId:F,workspaceId:k.workspaceId,boundWorkflowId:k.boundWorkflowId,appType:"wecom",description:`WeCom integration for agent: ${k.name}`})}catch(F){ue(F instanceof Error?F.message:c("wecomPair.createFailed")),y("error");return}_e(R);try{const F={corp_id:O.trim(),agent_id:I.trim(),corp_secret:$.trim(),token:E.trim(),encoding_aes_key:X.trim()};J.trim()&&(F.receive_id=J.trim());const he=await w().connectChannel(R.workspaceId,R.id,F),ke=he.setupData;te({webhookUrl:he.webhookUrl??ke?.webhook_url??void 0,token:ke?.callback_token??E.trim(),encodingAesKeyMasked:ke?.encoding_aes_key_masked??void 0,corpId:ke?.corp_id??O.trim(),agentId:ke?.agent_id??I.trim()});const we={...R,connectionState:he.connectionState,webhookUrl:he.webhookUrl,setupData:he.setupData};ce(we),y("connected"),p?.(),u(we)}catch(F){p?.(),ue(F instanceof Error?F.message:c("wecomPair.connectionFailed")),y("created")}},[j,O,I,$,E,X,J,k,i,w,u,p,c]);if(a.length===0)return n.jsxs("div",{className:"cheng-wc-form__no-agents",children:[n.jsx("div",{className:"cheng-wc-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wc-form__no-agents-title",children:c("pairing.noAgentsTitle")}),n.jsx("p",{className:"cheng-wc-form__no-agents-desc",children:c("wecomPair.noAgentsDesc")}),h&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:h,children:c("pairing.goToAgents")}),n.jsx("style",{children:ci})]});if(x==="connected"&&V)return n.jsxs("div",{className:"cheng-wc-form__success",children:[n.jsx("div",{className:"cheng-wc-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-form__success-title",children:c("wecomPair.connectedTitle")}),n.jsxs("p",{className:"cheng-wc-form__success-desc",children:[ne(c("wecomPair.connectedDesc"),{name:n.jsx("strong",{children:V.name})}),k&&ne(c("wecomPair.boundToAgent"),{name:n.jsx("strong",{children:k.name})}),"."]}),n.jsx("div",{className:"cheng-wc-form__status-badge cheng-wc-form__status-badge--configuring",children:c("wecomPair.statusConfiguring")}),ae&&n.jsxs("div",{className:"cheng-wc-form__webhook-box",children:[n.jsx("p",{className:"cheng-wc-form__webhook-box-title",children:c("wecomPair.callbackConfigTitle")}),ae.webhookUrl&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:c("wecomPair.callbackUrl")}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:ae.webhookUrl}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>P("webhookUrl",ae.webhookUrl),children:C.webhookUrl==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),c("common.copied")]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),c("common.copy")]})})]})]}),ae.token&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:c("wecomPair.token")}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:ae.token}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>P("token",ae.token),children:C.token==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),c("common.copied")]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),c("common.copy")]})})]})]}),ae.encodingAesKeyMasked&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:c("wecomPair.encodingAesKey")}),n.jsx("code",{className:"cheng-wc-form__webhook-value cheng-wc-form__webhook-value--muted",children:ae.encodingAesKeyMasked})]}),n.jsxs("ol",{className:"cheng-wc-form__steps-list",children:[n.jsx("li",{children:ne(c("wecomPair.wcStep1"),{wecomAdmin:n.jsx("strong",{children:"WeCom Admin Console"}),appManagement:n.jsx("strong",{children:"App Management"})})}),n.jsx("li",{children:ne(c("wecomPair.wcStep2"),{receiveMessages:n.jsx("strong",{children:"Receive Messages"}),set:n.jsx("strong",{children:"Set"})})}),n.jsx("li",{children:ne(c("wecomPair.wcStep3"),{callbackUrl:n.jsx("strong",{children:"Callback URL"})})}),n.jsx("li",{children:ne(c("wecomPair.wcStep4"),{tokenLabel:n.jsx("strong",{children:"Token"}),aesKeyLabel:n.jsx("strong",{children:"EncodingAESKey"})})}),n.jsx("li",{children:ne(c("wecomPair.wcStep5"),{save:n.jsx("strong",{children:"Save"})})}),n.jsx("li",{children:ne(c("wecomPair.wcStep6"),{configuring:n.jsx("em",{children:"Configuring"}),active:n.jsx("em",{children:"Active"})})})]})]}),n.jsx("p",{className:"cheng-wc-form__success-hint",children:c("wecomPair.successHint")}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",onClick:m,children:c("wecomPair.doneClose")}),n.jsx("style",{children:ci})]});if(x==="created"&&re)return n.jsxs("div",{className:"cheng-wc-form__created-warn",children:[n.jsx("div",{className:"cheng-wc-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-wc-form__created-warn-title",children:c("wecomPair.createdWarnTitle")}),n.jsxs("p",{className:"cheng-wc-form__created-warn-desc",children:[ne(c("wecomPair.createdWarnDesc"),{name:n.jsx("strong",{children:re.name})}),se?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:se})]}):"."," ",c("wecomPair.createdWarnHint")]}),m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:m,children:c("common.close")}),n.jsx("style",{children:ci})]});const H=x==="connecting",T=j.trim().length>0&&O.trim().length>0&&I.trim().length>0&&$.trim().length>0&&E.trim().length>0&&X.trim().length>0&&!!k&&!H;return n.jsxs("form",{className:"cheng-wc-form",onSubmit:b,children:[n.jsxs("div",{className:"cheng-wc-form__instructions",children:[n.jsx("p",{className:"cheng-wc-form__instructions-title",children:c("wecomPair.beforeYouBegin")}),n.jsxs("ol",{className:"cheng-wc-form__steps",children:[n.jsx("li",{children:ne(c("wecomPair.step1"),{wecomEnterprise:n.jsx("strong",{children:"WeCom Enterprise Account"}),customApp:n.jsx("strong",{children:"Custom App"})})}),n.jsx("li",{children:ne(c("wecomPair.step2"),{appManagement:n.jsx("strong",{children:"App Management"}),corpId:n.jsx("strong",{children:"Corp ID"}),agentId:n.jsx("strong",{children:"AgentId"}),appSecret:n.jsx("strong",{children:"App Secret"})})}),n.jsx("li",{children:ne(c("wecomPair.step3"),{tokenLabel:n.jsx("strong",{children:"Token"}),aesKeyLabel:n.jsx("strong",{children:"EncodingAESKey"})})}),n.jsx("li",{children:ne(c("wecomPair.step4"),{callbackUrl:n.jsx("strong",{children:"Callback URL"})})})]})]}),se&&x!=="created"&&n.jsxs("div",{className:"cheng-wc-form__error-banner",children:[n.jsx("span",{children:se}),n.jsx("button",{type:"button",className:"cheng-wc-form__retry-btn",onClick:()=>{y("ready"),ue(null)},children:c("common.retry")})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-name",children:[c("pairing.integrationName")," ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-name",className:"cheng-wc-form__input",type:"text",value:j,onChange:W=>S(W.target.value),placeholder:c("wecomPair.integrationNamePlaceholder"),disabled:H,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wc-form__hint",children:c("wecomPair.integrationNameHint")})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent",children:[c("pairing.agent")," ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wc-form__agent-select-wrap",children:n.jsx("select",{id:"wc-agent",className:"cheng-wc-form__input cheng-wc-form__input--select",value:M,onChange:W=>B(W.target.value),disabled:H,required:!0,children:a.map(W=>n.jsxs("option",{value:W.id,children:[Mg(W)," ",W.name]},W.id))})}),k&&n.jsxs("span",{className:"cheng-wc-form__hint",children:[ne(c("wecomPair.handledBy"),{name:n.jsx("strong",{children:k.name})}),k.description?` — ${k.description}`:""]})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-id",children:[c("wecomPair.corpId")," ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-id",className:"cheng-wc-form__input",type:"text",value:O,onChange:W=>K(W.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:H,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:c("wecomPair.corpIdHint")})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent-id",children:[c("wecomPair.agentId")," ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-agent-id",className:"cheng-wc-form__input",type:"text",value:I,onChange:W=>z(W.target.value),placeholder:"1000002",disabled:H,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:c("wecomPair.agentIdHint")})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-secret",children:[c("wecomPair.corpSecret")," ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-secret",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:$,onChange:W=>G(W.target.value),placeholder:c("wecomPair.corpSecretPlaceholder"),disabled:H,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:c("wecomPair.corpSecretHint")})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-token",children:[c("wecomPair.tokenLabel")," ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-token",className:"cheng-wc-form__input",type:"text",value:E,onChange:W=>Q(W.target.value),placeholder:"my-callback-token",disabled:H,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:c("wecomPair.tokenHint")})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-aes-key",children:[c("wecomPair.encodingAesKeyLabel")," ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-aes-key",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:X,onChange:W=>Y(W.target.value),placeholder:c("wecomPair.encodingAesKeyPlaceholder"),disabled:H,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:c("wecomPair.encodingAesKeyHint")})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-receive-id",children:[c("wecomPair.receiveId"),n.jsx("span",{className:"cheng-wc-form__label-hint",children:c("wecomPair.receiveIdOptional")})]}),n.jsx("input",{id:"wc-receive-id",className:"cheng-wc-form__input",type:"text",value:J,onChange:W=>de(W.target.value),placeholder:c("wecomPair.receiveIdPlaceholder"),disabled:H,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:c("wecomPair.receiveIdHint")})]}),n.jsxs("div",{className:"cheng-wc-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--ghost",onClick:m,disabled:H,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",disabled:!T,children:H?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-form__btn-spinner"}),c("pairing.connecting")]}):c("wecomPair.connectWeCom")})]}),n.jsx("style",{children:ci})]})}const ci=`
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
`;function Dg({channel:a,agents:i,apiBaseUrl:s,onUpdate:u,onRefresh:p,onSaved:h,onCancel:m}){const{t:c}=Ie(),x=a.connectionConfig??{},y=i.find(R=>R.boundWorkflowId===a.boundWorkflowId&&R.workspaceId===a.workspaceId)?.id??i[0]?.id??"",[j,S]=g.useState(y),[M,B]=g.useState(typeof x.corp_id=="string"?x.corp_id:""),[O,K]=g.useState(typeof x.agent_id=="string"?x.agent_id:""),[I,z]=g.useState(typeof x.receive_id=="string"?x.receive_id:""),[$,G]=g.useState(""),[E,Q]=g.useState(""),[X,Y]=g.useState(""),[J,de]=g.useState("ready"),[se,ue]=g.useState(!1),[V,ce]=g.useState(null),[re,_e]=g.useState(null),[ae,te]=g.useState(a.webhookUrl??null),C=g.useRef(null),q=g.useCallback(()=>(C.current||(C.current=new Je(s,new Be(s))),C.current),[s]),A=i.find(R=>R.id===j)??null,w=i.find(R=>R.boundWorkflowId===a.boundWorkflowId&&R.workspaceId===a.workspaceId)??null,k=A&&(A.workspaceId!==a.workspaceId||A.boundWorkflowId!==a.boundWorkflowId),P=$.trim().length>0&&E.trim().length>0&&X.trim().length>0&&M.trim().length>0&&O.trim().length>0,b=g.useCallback(async R=>{if(A){_e(null),ce(null),R?de("saving"):ue(!0);try{if(k&&await u({id:a.id,channelId:a.channelId,name:a.name,workspaceId:A.workspaceId,boundWorkflowId:A.boundWorkflowId,appType:a.appType,description:a.description}),P){const F=k?A.workspaceId:a.workspaceId,he={corp_id:M.trim(),agent_id:O.trim(),corp_secret:$.trim(),token:E.trim(),encoding_aes_key:X.trim()};I.trim()&&(he.receive_id=I.trim());const ke=await q().connectChannel(F,a.id,he),we=ke.setupData,Te=ke.webhookUrl??we?.webhook_url??null;Te&&te(Te)}p?.(),R?(de("saved"),setTimeout(()=>h(),1200)):(de("ready"),ce(c(P?"wcEdit.credsVerified":"editPanel.agentBindingUpdated")))}catch(F){_e(F instanceof Error?F.message:c("editPanel.updateFailed")),de("error"),ce(null)}finally{R||ue(!1)}}},[A,k,P,a,u,q,M,O,$,E,X,I,p,h,c]),H=g.useCallback(async R=>{R.preventDefault(),await b(!0)},[b]),T=J==="saving",W=!!A&&(!!k||P)&&!T&&!se;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:c("editPanel.noAgents")}):J==="saved"?n.jsxs("div",{className:"cheng-wc-edit__success",children:[n.jsx("div",{className:"cheng-wc-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-edit__success-title",children:c("editPanel.updatedTitle")}),n.jsx("p",{className:"cheng-wc-edit__success-desc",children:ne(c("waEdit.updatedDesc"),{name:n.jsx("strong",{children:a.name}),status:c(P?"waEdit.reconfiguredReconnected":"waEdit.updated")})}),n.jsx("style",{children:Md})]}):n.jsxs("form",{className:"cheng-wc-edit",onSubmit:H,children:[re&&n.jsxs("div",{className:"cheng-wc-edit__error-banner",children:[n.jsx("span",{children:re}),n.jsx("button",{type:"button",className:"cheng-wc-edit__retry-btn",onClick:()=>{de("ready"),_e(null)},children:c("common.retry")})]}),ae&&n.jsxs("div",{className:"cheng-wc-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wc-edit__webhook-label",children:c("wcEdit.callbackUrl")}),n.jsx("code",{className:"cheng-wc-edit__webhook-value",children:ae}),n.jsx("span",{className:"cheng-wc-edit__webhook-hint",children:ne(c("wcEdit.callbackHint"),{receiveMsgs:n.jsx("strong",{children:c("wcEdit.receiveMessages")})})})]}),a.connectionState==="configuring"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--configuring",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),c("wcEdit.stateConfiguring")]}),a.connectionState==="active"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--active",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"20 6 9 17 4 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),c("wcEdit.stateActive")]}),n.jsxs("div",{className:"cheng-wc-edit__grid",children:[n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:c("editPanel.routeToAgent")}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:c("waEdit.routeTip")})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("select",{className:"cheng-wc-edit__input cheng-wc-edit__input--select",value:j,onChange:R=>S(R.target.value),disabled:T,required:!0,children:i.map(R=>n.jsx("option",{value:R.id,children:R.name},R.id))}),k&&A&&n.jsx("div",{className:"cheng-wc-edit__notice",children:ne(c("editPanel.switchNotice"),{from:n.jsx("strong",{children:w?.name??c("editPanel.currentAgentFallback")}),to:n.jsx("strong",{children:A.name})})})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:c("wcEdit.corpId")}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:c("wcEdit.corpIdTip")})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:M,onChange:R=>B(R.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:c("wcEdit.agentId")}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:c("wcEdit.agentIdTip")})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:O,onChange:R=>K(R.target.value),placeholder:"1000002",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:c("wcEdit.corpSecret")}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:c("wcEdit.corpSecretTip")})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:$,onChange:R=>G(R.target.value),placeholder:c("editPanel.leaveBlankPlaceholder"),disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:c("wcEdit.token")}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:c("wcEdit.tokenTip")})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:E,onChange:R=>Q(R.target.value),placeholder:c("editPanel.leaveBlankPlaceholder"),disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:c("wcEdit.encodingAesKey")}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:c("wcEdit.encodingAesKeyTip")})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:X,onChange:R=>Y(R.target.value),placeholder:c("editPanel.leaveBlankPlaceholder"),disabled:T,autoComplete:"off"}),V&&n.jsx("div",{className:"cheng-wc-edit__test-ok",children:V}),n.jsx("div",{className:"cheng-wc-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--secondary",disabled:!P||!A||T||se,onClick:()=>{b(!1)},children:se?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner cheng-wc-edit__spinner--dark"}),c("editPanel.testing")]}):c("editPanel.testConnection")})})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:c("wcEdit.receiveId")}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:c("wcEdit.receiveIdTip")})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:I,onChange:R=>z(R.target.value),placeholder:c("wcEdit.receiveIdPlaceholder"),disabled:T,autoComplete:"off"})})]})]}),!P&&n.jsxs("div",{className:"cheng-wc-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),c("wcEdit.credsHint")]}),n.jsxs("div",{className:"cheng-wc-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--ghost",onClick:m,disabled:T,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-wc-edit__btn cheng-wc-edit__btn--connect",disabled:!W,children:T?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner"}),c("editPanel.saving")]}):c(P?"editPanel.saveReconnect":"editPanel.save")})]}),n.jsx("style",{children:Md})]})}const Md=`
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
`;function Wg(a){return a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"dingtalk-bot"}function Fg(a){const i=a.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Og({agents:a,onCreate:i,apiBaseUrl:s,onPaired:u,onRefresh:p,onGoToAgents:h,onCancel:m}){const{t:c}=Ie(),[x,y]=g.useState("ready"),[j,S]=g.useState(""),[M,B]=g.useState(()=>a[0]?.id??""),[O,K]=g.useState(""),[I,z]=g.useState(""),[$,G]=g.useState(""),[E,Q]=g.useState(null),[X,Y]=g.useState(null),[J,de]=g.useState(null),[se,ue]=g.useState(null),V=g.useRef(null),ce=g.useCallback(()=>(V.current||(V.current=new Je(s,new Be(s))),V.current),[s]),re=a.find(C=>C.id===M)??null,_e=g.useCallback(async C=>{if(C.preventDefault(),!j.trim()||!O.trim()||!I.trim()||!$.trim()||!re)return;Q(null),y("connecting");let q;try{const A=Wg(j);q=await i({name:j.trim(),channelId:A,workspaceId:re.workspaceId,boundWorkflowId:re.boundWorkflowId,appType:"dingtalk",description:`DingTalk integration for agent: ${re.name}`})}catch(A){Q(A instanceof Error?A.message:c("dingtalkPair.createFailed")),y("error");return}de(q);try{const A=await ce().connectChannel(q.workspaceId,q.id,{client_id:O.trim(),client_secret:I.trim(),robot_code:$.trim(),connection_mode:"stream"}),w=A.setupData;ue({robotCode:w?.robot_code??$.trim(),appName:w?.app_name??void 0,streamStatus:w?.stream_status??"connected",validatedAt:w?.validated_at??void 0});const k={...q,connectionState:A.connectionState,webhookUrl:A.webhookUrl,setupData:A.setupData};Y(k),y("connected"),p?.(),u(k)}catch(A){p?.(),Q(A instanceof Error?A.message:c("dingtalkPair.connectionFailed")),y("created")}},[j,O,I,$,re,i,ce,u,p,c]);if(a.length===0)return n.jsxs("div",{className:"cheng-dt-form__no-agents",children:[n.jsx("div",{className:"cheng-dt-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-dt-form__no-agents-title",children:c("pairing.noAgentsTitle")}),n.jsx("p",{className:"cheng-dt-form__no-agents-desc",children:c("dingtalkPair.noAgentsDesc")}),h&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:h,children:c("pairing.goToAgents")}),n.jsx("style",{children:li})]});if(x==="connected"&&X)return n.jsxs("div",{className:"cheng-dt-form__success",children:[n.jsx("div",{className:"cheng-dt-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-form__success-title",children:c("dingtalkPair.connectedTitle")}),n.jsxs("p",{className:"cheng-dt-form__success-desc",children:[ne(c("dingtalkPair.connectedDesc"),{name:n.jsx("strong",{children:X.name})}),se?.appName&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-dt-form__app-name",children:se.appName})]}),re&&ne(c("dingtalkPair.boundToAgent"),{name:n.jsx("strong",{children:re.name})}),"."]}),n.jsxs("div",{className:"cheng-dt-form__mode-badge",children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),c("dingtalkPair.streamMode")]}),n.jsxs("div",{className:"cheng-dt-form__stream-box",children:[n.jsx("p",{className:"cheng-dt-form__stream-box-title",children:c("dingtalkPair.streamActiveTitle")}),se?.robotCode&&n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:c("dingtalkPair.robotCode")}),n.jsx("code",{className:"cheng-dt-form__stream-value",children:se.robotCode})]}),n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:c("dingtalkPair.status")}),n.jsx("span",{className:"cheng-dt-form__stream-status",children:se?.streamStatus==="connected"?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__status-dot cheng-dt-form__status-dot--active"}),c("dingtalkPair.statusConnected")]}):se?.streamStatus??c("pairing.connecting")})]}),n.jsxs("ol",{className:"cheng-dt-form__steps-list",children:[n.jsx("li",{children:ne(c("dingtalkPair.dtStep1"),{persistentWebSocket:n.jsx("strong",{children:"persistent WebSocket"})})}),n.jsx("li",{children:ne(c("dingtalkPair.dtStep2"),{directMessage:n.jsx("strong",{children:"direct message"})})}),n.jsx("li",{children:ne(c("dingtalkPair.dtStep3"),{mention:n.jsx("strong",{children:"@mention"})})})]})]}),n.jsx("p",{className:"cheng-dt-form__success-hint",children:c("dingtalkPair.successHint")}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",onClick:m,children:c("dingtalkPair.doneClose")}),n.jsx("style",{children:li})]});if(x==="created"&&J)return n.jsxs("div",{className:"cheng-dt-form__created-warn",children:[n.jsx("div",{className:"cheng-dt-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-dt-form__created-warn-title",children:c("dingtalkPair.createdWarnTitle")}),n.jsxs("p",{className:"cheng-dt-form__created-warn-desc",children:[ne(c("dingtalkPair.createdWarnDesc"),{name:n.jsx("strong",{children:J.name})}),E?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:E})]}):"."," ",c("dingtalkPair.createdWarnHint")]}),m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:m,children:c("common.close")}),n.jsx("style",{children:li})]});const ae=x==="connecting",te=j.trim().length>0&&O.trim().length>0&&I.trim().length>0&&$.trim().length>0&&!!re&&!ae;return n.jsxs("form",{className:"cheng-dt-form",onSubmit:_e,children:[n.jsxs("div",{className:"cheng-dt-form__instructions",children:[n.jsx("p",{className:"cheng-dt-form__instructions-title",children:c("dingtalkPair.beforeYouBegin")}),n.jsxs("ol",{className:"cheng-dt-form__steps",children:[n.jsx("li",{children:ne(c("dingtalkPair.step1"),{dingtalkPlatform:n.jsx("strong",{children:"DingTalk Open Platform"}),appBot:n.jsx("strong",{children:"App Bot"})})}),n.jsx("li",{children:ne(c("dingtalkPair.step2"),{appCredentials:n.jsx("strong",{children:"App Credentials"}),clientId:n.jsx("strong",{children:"Client ID"}),clientSecret:n.jsx("strong",{children:"Client Secret"})})}),n.jsx("li",{children:ne(c("dingtalkPair.step3"),{appFeaturesBot:n.jsx("strong",{children:"App Features → Bot"}),robotCode:n.jsx("strong",{children:"Robot Code"})})}),n.jsx("li",{children:c("dingtalkPair.step4")})]})]}),E&&x!=="created"&&n.jsxs("div",{className:"cheng-dt-form__error-banner",children:[n.jsx("span",{children:E}),n.jsx("button",{type:"button",className:"cheng-dt-form__retry-btn",onClick:()=>{y("ready"),Q(null)},children:c("common.retry")})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-name",children:[c("pairing.integrationName")," ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-name",className:"cheng-dt-form__input",type:"text",value:j,onChange:C=>S(C.target.value),placeholder:c("dingtalkPair.integrationNamePlaceholder"),disabled:ae,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-dt-form__hint",children:c("dingtalkPair.integrationNameHint")})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-agent",children:[c("pairing.agent")," ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-dt-form__agent-select-wrap",children:n.jsx("select",{id:"dt-agent",className:"cheng-dt-form__input cheng-dt-form__input--select",value:M,onChange:C=>B(C.target.value),disabled:ae,required:!0,children:a.map(C=>n.jsxs("option",{value:C.id,children:[Fg(C)," ",C.name]},C.id))})}),re&&n.jsxs("span",{className:"cheng-dt-form__hint",children:[ne(c("dingtalkPair.handledBy"),{name:n.jsx("strong",{children:re.name})}),re.description?` — ${re.description}`:""]})]}),n.jsxs("div",{className:"cheng-dt-form__row-2col",children:[n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-id",children:[c("dingtalkPair.clientId")," ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:c("dingtalkPair.clientIdHint")})]}),n.jsx("input",{id:"dt-client-id",className:"cheng-dt-form__input",type:"text",value:O,onChange:C=>K(C.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:ae,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:c("dingtalkPair.clientIdFoundIn")})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-robot-code",children:[c("dingtalkPair.robotCodeLabel")," ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-robot-code",className:"cheng-dt-form__input",type:"text",value:$,onChange:C=>G(C.target.value),placeholder:"dingxxxxxx",disabled:ae,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:c("dingtalkPair.robotCodeFoundIn")})]})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-secret",children:[c("dingtalkPair.clientSecret")," ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:c("dingtalkPair.clientSecretHint")})]}),n.jsx("input",{id:"dt-client-secret",className:"cheng-dt-form__input cheng-dt-form__input--token",type:"password",value:I,onChange:C=>z(C.target.value),placeholder:c("dingtalkPair.clientSecretPlaceholder"),disabled:ae,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:c("dingtalkPair.clientSecretFoundIn")})]}),n.jsxs("div",{className:"cheng-dt-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--ghost",onClick:m,disabled:ae,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",disabled:!te,children:ae?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__btn-spinner"}),c("pairing.connecting")]}):c("dingtalkPair.connectDingTalk")})]}),n.jsx("style",{children:li})]})}const li=`
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
`;function Ug({channel:a,agents:i,apiBaseUrl:s,liveStatus:u,onUpdate:p,onRefresh:h,onSaved:m,onCancel:c}){const{t:x,locale:y}=Ie(),j=a.connectionConfig??{},S=a.setupData,M=i.find(F=>F.boundWorkflowId===a.boundWorkflowId&&F.workspaceId===a.workspaceId)?.id??i[0]?.id??"",[B,O]=g.useState(M),[K,I]=g.useState(typeof j.client_id=="string"?j.client_id:""),[z,$]=g.useState(typeof j.robot_code=="string"?j.robot_code:typeof S?.robot_code=="string"?S.robot_code:""),[G,E]=g.useState(""),[Q,X]=g.useState("ready"),[Y,J]=g.useState(!1),[de,se]=g.useState(null),[ue,V]=g.useState(null),ce=typeof S?.stream_status=="string"?S.stream_status:void 0,re=u?.lastEventAt??(typeof S?.last_event_at=="string"?S.last_event_at:void 0),_e=u?.connectionState??a.connectionState,ae=u?u.connectionState==="active"?"connected":u.connectionState??"unknown":ce??(a.connectionState==="active"?"connected":a.connectionState??"unknown"),te=u?u.workerRunning===!0||u.connectionState==="active":a.connectionState==="active"||ce==="connected",C=g.useRef(null),q=g.useCallback(()=>(C.current||(C.current=new Je(s,new Be(s))),C.current),[s]),A=i.find(F=>F.id===B)??null,w=i.find(F=>F.boundWorkflowId===a.boundWorkflowId&&F.workspaceId===a.workspaceId)??null,k=A&&(A.workspaceId!==a.workspaceId||A.boundWorkflowId!==a.boundWorkflowId),P=K.trim().length>0&&G.trim().length>0&&z.trim().length>0,b=g.useCallback(async F=>{if(A){V(null),se(null),F?X("saving"):J(!0);try{if(k&&await p({id:a.id,channelId:a.channelId,name:a.name,workspaceId:A.workspaceId,boundWorkflowId:A.boundWorkflowId,appType:a.appType,description:a.description}),P){const he=k?A.workspaceId:a.workspaceId,ke=await q().connectChannel(he,a.id,{client_id:K.trim(),client_secret:G.trim(),robot_code:z.trim(),connection_mode:"stream"});E("");const Te=ke.setupData?.stream_status}h?.(),F?(X("saved"),setTimeout(()=>m(),1200)):(X("ready"),se(x(P?"dtEdit.streamRestarted":"editPanel.agentBindingUpdated")))}catch(he){V(he instanceof Error?he.message:x("editPanel.updateFailed")),X("error"),se(null)}finally{F||J(!1)}}},[A,k,P,a,p,q,K,G,z,h,m,x]),H=g.useCallback(async F=>{F.preventDefault(),await b(!0)},[b]),T=Q==="saving",W=!!A&&(!!k||P)&&!T&&!Y,R=F=>{if(!F)return"—";const he=new Date(F);return Number.isNaN(he.getTime())?F:he.toLocaleString(y,{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})};return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:x("editPanel.noAgents")}):Q==="saved"?n.jsxs("div",{className:"cheng-dt-edit__success",children:[n.jsx("div",{className:"cheng-dt-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-edit__success-title",children:x("editPanel.updatedTitle")}),n.jsx("p",{className:"cheng-dt-edit__success-desc",children:ne(x("waEdit.updatedDesc"),{name:n.jsx("strong",{children:a.name}),status:x(P?"dtEdit.reconfiguredStream":"waEdit.updated")})}),n.jsx("style",{children:zd})]}):n.jsxs("form",{className:"cheng-dt-edit",onSubmit:H,children:[ue&&n.jsxs("div",{className:"cheng-dt-edit__error-banner",children:[n.jsx("span",{children:ue}),n.jsx("button",{type:"button",className:"cheng-dt-edit__retry-btn",onClick:()=>{X("ready"),V(null)},children:x("common.retry")})]}),n.jsxs("div",{className:"cheng-dt-edit__stream-info",children:[n.jsxs("div",{className:"cheng-dt-edit__stream-info-header",children:[n.jsx("div",{className:"cheng-dt-edit__stream-info-label",children:x("dtEdit.streamMode")}),n.jsxs("div",{className:"cheng-dt-edit__stream-status-row",children:[n.jsx("span",{className:`cheng-dt-edit__status-dot ${te?"cheng-dt-edit__status-dot--active":_e==="error"||ce==="error"?"cheng-dt-edit__status-dot--error":"cheng-dt-edit__status-dot--idle"}`}),n.jsx("span",{className:"cheng-dt-edit__stream-status-text",children:ae})]})]}),re&&n.jsx("div",{className:"cheng-dt-edit__stream-meta",children:ne(x("dtEdit.lastEvent"),{time:n.jsx("strong",{children:R(re)})})}),u?.lastError&&n.jsx("div",{className:"cheng-dt-edit__stream-warn cheng-dt-edit__stream-warn--error",children:u.lastError}),_e==="degraded"&&!u?.lastError&&n.jsx("div",{className:"cheng-dt-edit__stream-warn",children:ne(x("dtEdit.workerStoppedWarn"),{action:n.jsx("strong",{children:x("editPanel.saveReconnect")})})})]}),n.jsxs("div",{className:"cheng-dt-edit__grid",children:[n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:x("editPanel.routeToAgent")}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:x("waEdit.routeTip")})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("select",{className:"cheng-dt-edit__input cheng-dt-edit__input--select",value:B,onChange:F=>O(F.target.value),disabled:T,required:!0,children:i.map(F=>n.jsx("option",{value:F.id,children:F.name},F.id))}),k&&A&&n.jsx("div",{className:"cheng-dt-edit__notice",children:ne(x("editPanel.switchNotice"),{from:n.jsx("strong",{children:w?.name??x("editPanel.currentAgentFallback")}),to:n.jsx("strong",{children:A.name})})})]})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:x("dtEdit.clientId")}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:x("dtEdit.clientIdTip")})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:K,onChange:F=>I(F.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:x("dtEdit.robotCode")}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:x("dtEdit.robotCodeTip")})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:z,onChange:F=>$(F.target.value),placeholder:"dingxxxxxx",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:x("dtEdit.clientSecret")}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:x("dtEdit.clientSecretTip")})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("input",{className:"cheng-dt-edit__input cheng-dt-edit__input--token",type:"password",value:G,onChange:F=>E(F.target.value),placeholder:x("editPanel.leaveBlankPlaceholder"),disabled:T,autoComplete:"off"}),de&&n.jsx("div",{className:"cheng-dt-edit__test-ok",children:de}),n.jsx("div",{className:"cheng-dt-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--secondary",disabled:!P||!A||T||Y,onClick:()=>{b(!1)},children:Y?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner cheng-dt-edit__spinner--dark"}),x("editPanel.testing")]}):x("editPanel.testConnection")})})]})]})]}),!P&&n.jsxs("div",{className:"cheng-dt-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),x("dtEdit.credsHint")]}),n.jsxs("div",{className:"cheng-dt-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--ghost",onClick:c,disabled:T,children:x("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-dt-edit__btn cheng-dt-edit__btn--connect",disabled:!W,children:T?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner"}),x("editPanel.saving")]}):x(P?"editPanel.saveReconnect":"editPanel.save")})]}),n.jsx("style",{children:zd})]})}const zd=`
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
`,Bg=1,Hg="flowchat/host-setup-request",$g="FCSETUP1.";class Gr extends Error{constructor(i){super(i),this.name="FlowChatCodeError"}}function Kg(a){const i=a.replace(/-/g,"+").replace(/_/g,"/");let s;try{s=atob(i)}catch{throw new Gr("Code payload is not valid base64.")}const u=Uint8Array.from(s,p=>p.charCodeAt(0));return new TextDecoder().decode(u)}function Vg(a,i,s){const u=i.trim();if(!u.startsWith(a))throw new Gr(`Not a ${s} code — it should start with ${a}`);try{return JSON.parse(Kg(u.slice(a.length)))}catch(p){throw p instanceof Gr?p:new Gr(`The ${s} code payload is not valid JSON.`)}}function Gg(a){const i=Vg($g,a,"FlowChat setup");if(i.kind!==Hg||i.v!==Bg||typeof i.setup_id!="string"||typeof i.signature!="string")throw new Gr("This is not a FlowChat host setup request code.");return i}function qg(a,i=new Date){const s=Date.parse(a.expires_at);return Number.isFinite(s)?i.getTime()>=s:!0}function Qg(a){return a.identity_public_key.slice(0,12)}async function Yg(a,i,s=8e3){const u=a.replace(/\/+$/,""),p=new AbortController,h=setTimeout(()=>p.abort(),s);try{const m=await fetch(`${u}/v1/setup/import`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({package:i}),signal:p.signal});if(!m.ok){const x=await m.text().catch(()=>"");throw new Error(`Host rejected the package (${m.status}): ${x.slice(0,200)}`)}const c=await m.json().catch(()=>null);return c?.receipt??c}finally{clearTimeout(h)}}const ws={allowAttachments:!1,maxRequestBytes:1048576,allowStructuredHandoff:!0,maxConcurrency:2,executionTimeoutSeconds:600};function Yd({value:a,onChange:i,disabled:s=!1}){const{t:u}=Ie(),p=(h,m,c)=>x=>i({...a,[h]:Math.min(c,Math.max(m,Number(x.target.value)||m))});return n.jsxs("fieldset",{className:"cheng-fc-policy",disabled:s,children:[n.jsx("legend",{children:u("flowchat.policy.legend")}),n.jsxs("label",{children:[n.jsx("input",{type:"checkbox",checked:a.allowAttachments,onChange:h=>i({...a,allowAttachments:h.target.checked})})," ",u("flowchat.policy.allowAttachments")]}),n.jsxs("label",{children:[n.jsx("input",{type:"checkbox",checked:a.allowStructuredHandoff,onChange:h=>i({...a,allowStructuredHandoff:h.target.checked})})," ",u("flowchat.policy.allowStructuredHandoff")]}),n.jsxs("label",{children:[u("flowchat.policy.maxRequestBytes"),n.jsx("input",{"aria-label":u("flowchat.policy.maxRequestBytes"),type:"number",min:1024,max:104857600,value:a.maxRequestBytes,onChange:p("maxRequestBytes",1024,104857600)})]}),n.jsxs("label",{children:[u("flowchat.policy.maxConcurrency"),n.jsx("input",{"aria-label":u("flowchat.policy.maxConcurrency"),type:"number",min:1,max:32,value:a.maxConcurrency,onChange:p("maxConcurrency",1,32)})]}),n.jsxs("label",{children:[u("flowchat.policy.executionTimeout"),n.jsx("input",{"aria-label":u("flowchat.policy.executionTimeoutAria"),type:"number",min:10,max:86400,value:a.executionTimeoutSeconds,onChange:p("executionTimeoutSeconds",10,86400)})]}),n.jsx("p",{children:u("flowchat.policy.note")}),n.jsx("style",{children:".cheng-fc-policy{display:grid;gap:9px;border:1px solid #d1cfc5;border-radius:9px;padding:12px}.cheng-fc-policy legend{font-size:12px;font-weight:700}.cheng-fc-policy label{display:flex;gap:8px;align-items:center;font-size:12px}.cheng-fc-policy input[type=number]{margin-left:auto;width:120px;padding:6px}.cheng-fc-policy p{margin:0;color:#87867f;font-size:11px}"})]})}function Xg(a){return a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"flowchat-agent"}function Jg(a){const i=a.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Zg({agents:a,onCreate:i,apiBaseUrl:s,onPaired:u,onRefresh:p,onGoToAgents:h,onCancel:m}){const{t:c}=Ie(),[x,y]=g.useState("ready"),[j,S]=g.useState(""),[M,B]=g.useState(()=>a[0]?.id??""),[O,K]=g.useState(""),[I,z]=g.useState(null),[$,G]=g.useState(null),[E,Q]=g.useState(null),[X,Y]=g.useState(null),[J,de]=g.useState(null),[se,ue]=g.useState(!1),[V,ce]=g.useState(!1),[re,_e]=g.useState("lan_host"),[ae,te]=g.useState(ws),C=g.useRef(null),q=g.useCallback(()=>(C.current||(C.current=new Je(s,new Be(s))),C.current),[s]),A=a.find(F=>F.id===M)??null,w=g.useMemo(()=>{const F=O.trim();if(!F)return null;try{const he=Gg(F);return{request:he,expired:qg(he)}}catch(he){return{parseError:he instanceof Error?he.message:c("flowchatPair.unrecognizedCode")}}},[O,c]),k=w&&"request"in w?w.request:null,P=w&&"request"in w?w.expired:!1,b=w&&"parseError"in w?w.parseError:null,H=g.useCallback(async F=>{if(F.preventDefault(),!(!j.trim()||!k||P||!A)){z(null),y("connecting");try{const he=Xg(j),ke=await i({name:j.trim(),channelId:he,workspaceId:A.workspaceId,boundWorkflowId:A.boundWorkflowId,appType:"flowchat",description:`FlowChat platform link for agent: ${A.name}`});ke.channelId!==he&&ce(!0);const we=await q().createFlowChatHandoff(ke.workspaceId,{name:`${j.trim()} (FlowChat)`,channelId:ke.channelId,executionMode:re,setupRequest:k,chengflowBaseUrl:typeof window<"u"?window.location.origin:void 0});Q(we);let Te="manual";if(we.hostEndpoint)try{await Yg(we.hostEndpoint,we.package),Te="lan"}catch(pe){de(pe instanceof Error?pe.message:String(pe))}Y(Te);const Qe={...ke.connectionConfig??{},flowchat_host_device_id:we.hostDeviceId,flowchat_host_endpoint:we.hostEndpoint,flowchat_key_id:we.keyId,flowchat_setup_id:we.setupId,flowchat_delivery:Te,flowchat_host_name:k.host_name,flowchat_host_platform:k.platform,flowchat_execution_mode:re,flowchat_policy:ae,flowchat_connected_at:new Date().toISOString()};let Se={...ke,connectionConfig:Qe};try{Se=await q().updateChannel({id:ke.id,workspaceId:ke.workspaceId,channelId:ke.channelId,name:ke.name,boundWorkflowId:ke.boundWorkflowId,appType:ke.appType,description:ke.description,connectionConfig:Qe})}catch(pe){console.warn("Failed to persist FlowChat handoff metadata",pe)}G(Se),y("connected"),p?.(),u(Se)}catch(he){z(he instanceof Error?he.message:c("flowchatPair.pairingFailed")),y("error")}}},[j,k,P,A,re,ae,i,q,u,p,c]),T=g.useCallback(async()=>{if(E)try{await navigator.clipboard.writeText(E.code),ue(!0)}catch{ue(!1)}},[E]);if(a.length===0)return n.jsxs("div",{className:"cheng-fc-form__no-agents",children:[n.jsx("div",{className:"cheng-fc-form__no-agents-icon",children:"🌊"}),n.jsx("h3",{className:"cheng-fc-form__no-agents-title",children:c("flowchatPair.noAgentsTitle")}),n.jsx("p",{className:"cheng-fc-form__no-agents-desc",children:c("flowchatPair.noAgentsDesc")}),h&&n.jsx("button",{type:"button",className:"cheng-fc-form__btn cheng-fc-form__btn--secondary",onClick:h,children:c("flowchatPair.goToAgents")}),n.jsx("style",{children:ms})]});if(x==="connected"&&$&&E)return n.jsxs("div",{className:"cheng-fc-form__success",children:[n.jsx("div",{className:"cheng-fc-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-fc-form__success-title",children:c(X==="lan"?"flowchatPair.pairedTitle":"flowchatPair.keySealedTitle")}),n.jsxs("p",{className:"cheng-fc-form__success-desc",children:[V&&n.jsx("span",{className:"cheng-fc-form__existing-note",children:c("flowchatPair.existingNote")}),ne(c("flowchatPair.mintedDesc"),{name:n.jsx("strong",{children:$.name}),keyId:n.jsxs("code",{children:[E.keyId.slice(0,8),"…"]}),hostDevice:n.jsx("strong",{children:E.hostDeviceId})}),A&&ne(c("flowchatPair.boundToAgent"),{name:n.jsx("strong",{children:A.name})}),"."]}),X==="lan"?n.jsxs("div",{className:"cheng-fc-form__delivered-notice",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("polyline",{points:"8 12 11 15 16 9"})]}),c("flowchatPair.deliveredNotice")]}):n.jsxs("div",{className:"cheng-fc-form__manual-block",children:[n.jsxs("p",{className:"cheng-fc-form__manual-hint",children:[J?c("flowchatPair.deliveryFailed",{note:J}):c("flowchatPair.noLanEndpoint"),c("flowchatPair.manualHintRest")]}),n.jsx("textarea",{className:"cheng-fc-form__seal-code",readOnly:!0,rows:4,value:E.code}),n.jsx("button",{type:"button",className:"cheng-fc-form__btn cheng-fc-form__btn--secondary",onClick:T,children:c(se?"flowchatPair.copied":"flowchatPair.copySealedCode")})]}),n.jsx("p",{className:"cheng-fc-form__success-hint",children:c("flowchatPair.successHint")}),n.jsx("style",{children:ms})]});const W=x==="connecting",R=j.trim().length>0&&!!k&&!P&&!!A&&!W;return n.jsxs("form",{className:"cheng-fc-form",onSubmit:H,children:[n.jsxs("div",{className:"cheng-fc-form__instructions",children:[n.jsx("p",{className:"cheng-fc-form__instructions-title",children:c("flowchatPair.howToTitle")}),n.jsxs("ol",{className:"cheng-fc-form__steps",children:[n.jsx("li",{children:ne(c("flowchatPair.step1"),{client:n.jsx("strong",{children:c("flowchatPair.clientName")})})}),n.jsx("li",{children:ne(c("flowchatPair.step2"),{code:n.jsx("code",{children:c("flowchatPair.generateSetupCode")})})}),n.jsx("li",{children:ne(c("flowchatPair.step3"),{code:n.jsx("code",{children:"FCSETUP1."})})})]})]}),I&&n.jsxs("div",{className:"cheng-fc-form__error-banner",children:[n.jsx("span",{children:I}),n.jsx("button",{type:"button",className:"cheng-fc-form__retry-btn",onClick:()=>{y("ready"),z(null)},children:c("flowchatPair.retry")})]}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsxs("label",{className:"cheng-fc-form__label",htmlFor:"fc-name",children:[c("flowchatPair.integrationName")," ",n.jsx("span",{className:"cheng-fc-form__required",children:"*"})]}),n.jsx("input",{id:"fc-name",className:"cheng-fc-form__input",type:"text",value:j,onChange:F=>S(F.target.value),placeholder:c("flowchatPair.integrationNamePlaceholder"),disabled:W,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-fc-form__hint",children:c("flowchatPair.integrationNameHint")})]}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsxs("label",{className:"cheng-fc-form__label",htmlFor:"fc-agent",children:[c("flowchatPair.agent")," ",n.jsx("span",{className:"cheng-fc-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-fc-form__agent-select-wrap",children:n.jsx("select",{id:"fc-agent",className:"cheng-fc-form__input cheng-fc-form__input--select",value:M,onChange:F=>B(F.target.value),disabled:W,required:!0,children:a.map(F=>n.jsxs("option",{value:F.id,children:[Jg(F)," ",F.name]},F.id))})}),A&&n.jsxs("span",{className:"cheng-fc-form__hint",children:[ne(c("flowchat.edit.handledBy"),{name:n.jsx("strong",{children:A.name})}),A.description?` — ${A.description}`:""]})]}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsx("label",{className:"cheng-fc-form__label",htmlFor:"fc-execution-mode",children:c("flowchatPair.executionOwner")}),n.jsxs("select",{id:"fc-execution-mode",className:"cheng-fc-form__input",value:re,onChange:F=>_e(F.target.value),disabled:W,children:[n.jsx("option",{value:"lan_host",children:c("flowchatPair.execLanHost")}),n.jsx("option",{value:"coordinator_direct",children:c("flowchatPair.execCoordinator")}),n.jsx("option",{value:"device_bridge",children:c("flowchatPair.execBridge")})]}),n.jsx("span",{className:"cheng-fc-form__hint",children:c("flowchatPair.executionHint")})]}),n.jsx(Yd,{value:ae,onChange:te,disabled:W}),n.jsxs("div",{className:"cheng-fc-form__field",children:[n.jsxs("label",{className:"cheng-fc-form__label",htmlFor:"fc-setup-code",children:[c("flowchatPair.hostSetupCode")," ",n.jsx("span",{className:"cheng-fc-form__required",children:"*"}),n.jsx("span",{className:"cheng-fc-form__label-hint",children:c("flowchatPair.hostSetupCodeHint")})]}),n.jsx("textarea",{id:"fc-setup-code",className:"cheng-fc-form__input cheng-fc-form__input--code",value:O,onChange:F=>K(F.target.value),placeholder:"FCSETUP1.…",rows:4,disabled:W,required:!0,autoComplete:"off",spellCheck:!1}),b&&n.jsx("span",{className:"cheng-fc-form__hint cheng-fc-form__hint--error",children:b}),k&&n.jsxs("div",{className:"cheng-fc-form__host-card"+(P?" cheng-fc-form__host-card--expired":""),"data-testid":"fc-host-card",children:[n.jsxs("div",{className:"cheng-fc-form__host-line",children:[n.jsx("strong",{children:k.host_name})," · ",k.platform," ·"," ",c("flowchatPair.deviceLabel")," ",n.jsx("code",{children:k.host_device_id})]}),n.jsxs("div",{className:"cheng-fc-form__host-line",children:[c("flowchatPair.identityLabel")," ",n.jsxs("code",{children:[Qg(k),"…"]}),k.endpoint?n.jsxs(n.Fragment,{children:[" · ",c("flowchatPair.lanDeliveryVia")," ",n.jsx("code",{children:k.endpoint})]}):n.jsxs(n.Fragment,{children:[" · ",c("flowchatPair.manualDeliveryOnly")]})]}),n.jsx("div",{className:"cheng-fc-form__host-line",children:P?c("flowchatPair.hostExpired"):c("flowchatPair.hostExpires",{time:new Date(k.expires_at).toLocaleTimeString()})})]})]}),n.jsxs("div",{className:"cheng-fc-form__footer",children:[m&&n.jsx("button",{type:"button",className:"cheng-fc-form__btn cheng-fc-form__btn--ghost",onClick:m,disabled:W,children:c("common.cancel")}),n.jsx("button",{type:"submit",className:"cheng-fc-form__btn cheng-fc-form__btn--connect",disabled:!R,children:W?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-fc-form__btn-spinner"}),c("flowchatPair.pairing")]}):c("flowchatPair.pairFlowChat")})]}),n.jsx("style",{children:ms})]})}const ms=`
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
`;function ef({channel:a,apiBaseUrl:i,onRotate:s,onDisconnected:u}){const{t:p}=Ie(),h=g.useRef(),[m,c]=g.useState(null),[x,y]=g.useState(!1),[j,S]=g.useState(null),M=g.useMemo(()=>a.connectionConfig??{},[a]),B=I=>typeof M[I]=="string"?String(M[I]):"",O=g.useCallback(()=>h.current??(h.current=new Je(i,new Be(i))),[i]);g.useEffect(()=>{O().listChannelKeys(a.workspaceId).then(I=>c(I.find(z=>z.id===B("flowchat_key_id"))??null)).catch(I=>S(String(I)))},[O,a.workspaceId,M]);const K=async()=>{if(confirm(p("flowchat.connection.disconnectConfirm"))){y(!0),S(null);try{const I=B("flowchat_key_id");I&&await O().deleteChannelKey(a.workspaceId,I),await O().disconnectChannel(a.workspaceId,a.channelId),u?.()}catch(I){S(String(I))}finally{y(!1)}}};return n.jsxs("section",{className:"cheng-fc-connection",children:[n.jsx("h4",{children:p("flowchat.connection.title")}),j&&n.jsx("p",{role:"alert",children:j}),n.jsxs("dl",{children:[n.jsx("dt",{children:p("flowchat.connection.executionOwner")}),n.jsx("dd",{children:B("flowchat_execution_mode")||"lan_host"}),n.jsx("dt",{children:p("flowchat.connection.endpointIdentity")}),n.jsx("dd",{children:B("flowchat_host_name")||B("flowchat_host_device_id")||p("common.unknown")}),n.jsx("dt",{children:p("flowchat.connection.credential")}),n.jsx("dd",{children:m?p("flowchat.connection.credentialActive",{id:m.id.slice(0,8)}):p("flowchat.connection.credentialRevoked")}),n.jsx("dt",{children:p("flowchat.connection.connected")}),n.jsx("dd",{children:B("flowchat_connected_at")?new Date(B("flowchat_connected_at")).toLocaleString():p("common.unknown")}),n.jsx("dt",{children:p("flowchat.connection.lastConnection")}),n.jsx("dd",{children:m?.lastUsedAt?new Date(m.lastUsedAt).toLocaleString():p("common.never")}),n.jsx("dt",{children:p("flowchat.connection.usage")}),n.jsx("dd",{children:p("flowchat.connection.usageCount",{count:m?.useCount??0})})]}),n.jsxs("div",{children:[n.jsx("button",{type:"button",onClick:s,disabled:x||!m,children:p("flowchat.connection.rotate")}),n.jsx("button",{type:"button",onClick:()=>{K()},disabled:x,children:p("flowchat.connection.disconnect")})]}),n.jsx("style",{children:".cheng-fc-connection{border:1px solid #d1cfc5;border-radius:9px;padding:12px}.cheng-fc-connection h4{margin:0 0 8px}.cheng-fc-connection dl{display:grid;grid-template-columns:130px 1fr;font-size:12px;gap:5px}.cheng-fc-connection dt{color:#87867f}.cheng-fc-connection dd{margin:0;word-break:break-all}.cheng-fc-connection div{display:flex;gap:8px}"})]})}function Dd(a,i,s){return!i||!a.includes(i)?a:a.split(i).flatMap((p,h)=>h===0?[p]:[n.jsx("span",{children:s(i)},h),p])}function tf({channel:a,agents:i,apiBaseUrl:s,onUpdate:u,onRefresh:p,onSaved:h,onCancel:m}){const{t:c}=Ie(),[x,y]=g.useState("ready"),[j,S]=g.useState(a.name),[M,B]=g.useState(()=>i.find(P=>P.boundWorkflowId===a.boundWorkflowId)?.id??i[0]?.id??""),[O,K]=g.useState(null),[I,z]=g.useState(!1),[$,G]=g.useState(!1),[E,Q]=g.useState(!1),[X,Y]=g.useState(()=>{const k=a.connectionConfig?.flowchat_policy;return k&&typeof k=="object"?{...ws,...k}:ws}),J=g.useRef(null),de=g.useCallback(()=>(J.current||(J.current=new Je(s,new Be(s))),J.current),[s]),se=g.useMemo(()=>a.connectionConfig??{},[a.connectionConfig]),ue=k=>typeof se[k]=="string"&&se[k].trim()?se[k]:void 0,V=ue("flowchat_host_name"),ce=ue("flowchat_host_device_id"),re=ue("flowchat_host_platform"),_e=ue("flowchat_host_endpoint"),ae=ue("flowchat_key_id"),te=ue("flowchat_delivery"),C=i.find(k=>k.id===M)??null,q=g.useCallback(async k=>{if(k.preventDefault(),!!j.trim()){K(null),y("saving");try{await u({id:a.id,workspaceId:a.workspaceId,channelId:a.channelId,name:j.trim(),boundWorkflowId:C?.boundWorkflowId??a.boundWorkflowId,appType:a.appType,description:a.description,connectionConfig:{...a.connectionConfig??{},flowchat_policy:X}}),p?.(),h()}catch(P){K(P instanceof Error?P.message:c("flowchat.edit.saveError")),y("error")}}},[j,C,a,X,u,p,h,c]),A=g.useCallback(async()=>{if(ae){K(null),y("revoking");try{await de().deleteChannelKey(a.workspaceId,ae),z(!0),G(!1),y("ready"),p?.()}catch(k){K(k instanceof Error?k.message:c("flowchat.edit.revokeError")),y("error")}}},[ae,a.workspaceId,de,p,c]),w=x==="saving"||x==="revoking";return n.jsxs("form",{className:"cheng-fc-edit",onSubmit:q,children:[O&&n.jsxs("div",{className:"cheng-fc-edit__error-banner",children:[n.jsx("span",{children:O}),n.jsx("button",{type:"button",className:"cheng-fc-edit__retry-btn",onClick:()=>{y("ready"),K(null)},children:c("flowchat.edit.dismiss")})]}),n.jsx(ef,{channel:a,apiBaseUrl:s,onRotate:()=>Q(!0),onDisconnected:()=>{z(!0),p?.()}}),E&&n.jsxs("div",{className:"cheng-fc-edit__info",children:[n.jsx("strong",{children:c("flowchat.edit.rotationTitle")}),n.jsx("p",{className:"cheng-fc-edit__info-hint",children:c("flowchat.edit.rotationHint")}),n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--ghost",onClick:()=>Q(!1),children:c("flowchat.edit.close")})]}),n.jsxs("div",{className:"cheng-fc-edit__info",children:[n.jsx("p",{className:"cheng-fc-edit__info-title",children:c("flowchat.edit.sealedTitle")}),n.jsxs("dl",{className:"cheng-fc-edit__info-grid",children:[n.jsx("dt",{children:c("flowchat.edit.host")}),n.jsxs("dd",{children:[V??"—",re?` (${re})`:""]}),n.jsx("dt",{children:c("flowchat.edit.hostDevice")}),n.jsx("dd",{children:n.jsx("code",{children:ce??c("flowchat.edit.unknownValue")})}),n.jsx("dt",{children:c("flowchat.edit.lanEndpoint")}),n.jsx("dd",{children:_e?n.jsx("code",{children:_e}):c("flowchat.edit.manualDelivery")}),n.jsx("dt",{children:c("flowchat.edit.channelKey")}),n.jsxs("dd",{children:[ae?n.jsxs("code",{children:[ae.slice(0,8),"…"]}):c("flowchat.edit.unknownValue"),I&&n.jsxs("span",{className:"cheng-fc-edit__revoked-tag",children:[" ",c("flowchat.edit.revokedTag")]})]}),n.jsx("dt",{children:c("flowchat.edit.delivery")}),n.jsx("dd",{children:te==="lan"?c("flowchat.edit.deliveryLan"):te==="manual"?c("flowchat.edit.deliveryManual"):"—"})]}),n.jsx("p",{className:"cheng-fc-edit__info-hint",children:c("flowchat.edit.keyHint")})]}),n.jsx(Yd,{value:X,onChange:Y,disabled:w}),n.jsxs("div",{className:"cheng-fc-edit__field",children:[n.jsx("label",{className:"cheng-fc-edit__label",htmlFor:"fc-edit-name",children:c("flowchat.edit.integrationName")}),n.jsx("input",{id:"fc-edit-name",className:"cheng-fc-edit__input",type:"text",value:j,onChange:k=>S(k.target.value),disabled:w,required:!0})]}),i.length>0&&n.jsxs("div",{className:"cheng-fc-edit__field",children:[n.jsx("label",{className:"cheng-fc-edit__label",htmlFor:"fc-edit-agent",children:c("flowchat.edit.agent")}),n.jsx("select",{id:"fc-edit-agent",className:"cheng-fc-edit__input cheng-fc-edit__input--select",value:M,onChange:k=>B(k.target.value),disabled:w,children:i.map(k=>n.jsx("option",{value:k.id,children:k.name},k.id))}),C&&n.jsx("span",{className:"cheng-fc-edit__hint",children:Dd(c("flowchat.edit.handledBy",{name:C.name}),C.name,k=>n.jsx("strong",{children:k}))})]}),ae&&!I&&n.jsxs("div",{className:"cheng-fc-edit__danger",children:[n.jsx("p",{className:"cheng-fc-edit__danger-title",children:c("flowchat.edit.revokeTitle")}),n.jsx("p",{className:"cheng-fc-edit__danger-desc",children:Dd(c("flowchat.edit.revokeDesc",{id:`${ae.slice(0,8)}…`}),`${ae.slice(0,8)}…`,k=>n.jsx("code",{children:k}))}),$?n.jsxs("div",{className:"cheng-fc-edit__danger-actions",children:[n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--danger",onClick:A,disabled:w,children:c(x==="revoking"?"flowchat.edit.revoking":"flowchat.edit.confirmRevoke")}),n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--ghost",onClick:()=>G(!1),disabled:w,children:c("flowchat.edit.keepKey")})]}):n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--danger-outline",onClick:()=>G(!0),disabled:w,children:c("flowchat.edit.revokeKey")})]}),n.jsxs("div",{className:"cheng-fc-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-fc-edit__btn cheng-fc-edit__btn--ghost",onClick:m,disabled:w,children:c("flowchat.edit.cancel")}),n.jsx("button",{type:"submit",className:"cheng-fc-edit__btn cheng-fc-edit__btn--primary",disabled:w||!j.trim(),children:c(x==="saving"?"flowchat.edit.saving":"flowchat.edit.saveChanges")})]}),n.jsx("style",{children:nf})]})}const nf=`
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
`;function In({title:a,description:i,icon:s,iconLabel:u,iconColor:p,onClose:h,children:m}){const{t:c}=Ie();return n.jsx("div",{className:"cheng-page__dialog-overlay",onClick:h,children:n.jsxs("div",{className:"cheng-page__dialog",onClick:x=>x.stopPropagation(),children:[n.jsxs("div",{className:"cheng-page__dialog-header",children:[n.jsx("div",{className:"cheng-page__dialog-icon",style:{background:`${p}20`},children:n.jsx("span",{role:"img","aria-label":u,style:{fontSize:"20px"},children:s})}),n.jsxs("div",{className:"cheng-page__dialog-copy",children:[n.jsx("h2",{className:"cheng-page__form-card-title",children:a}),n.jsx("p",{className:"cheng-page__form-card-desc",children:i})]}),n.jsx("button",{type:"button",className:"cheng-page__applink-close-btn",onClick:h,children:c("common.close")})]}),n.jsx("div",{className:"cheng-page__dialog-body",children:m})]})})}function rf({activePlatform:a,platforms:i,isCreateModalOpen:s,onCloseCreate:u,editingChannel:p,onCloseEdit:h,agents:m,onCreate:c,onUpdate:x,onRefresh:y,apiBaseUrl:j,onGoToAgents:S,liveStatusMap:M}){const{t:B}=Ie(),O=p?i.find(Q=>Q.id===p.appType)??{id:p.appType??"custom",label:p.appType??"App",shortLabel:p.appType??"App",emoji:"⚙️",color:"#c96442",desc:""}:null,K=g.useCallback(Q=>{u(),y()},[u,y]),I=g.useCallback(Q=>{y()},[y]),z=g.useCallback(Q=>{y()},[y]),$=g.useCallback(Q=>{y()},[y]),G=g.useCallback(Q=>{y()},[y]),E=g.useCallback(Q=>{y()},[y]);return n.jsxs(n.Fragment,{children:[s&&a.id==="telegram"&&n.jsx(In,{title:B("applink.createTitle",{label:a.label}),description:a.desc,icon:a.emoji,iconLabel:a.label,iconColor:a.color,onClose:u,children:n.jsx(Sg,{agents:m,onCreate:c,apiBaseUrl:j,onPaired:K,onRefresh:y,onGoToAgents:()=>{u(),S()},onCancel:u},"telegram-pairing")}),s&&a.id==="whatsapp"&&n.jsx(In,{title:B("applink.createTitle",{label:a.label}),description:a.desc,icon:a.emoji,iconLabel:a.label,iconColor:a.color,onClose:u,children:n.jsx(Pg,{agents:m,onCreate:c,apiBaseUrl:j,onPaired:I,onRefresh:y,onGoToAgents:()=>{u(),S()},onCancel:u},"whatsapp-pairing")}),s&&a.id==="slack"&&n.jsx(In,{title:B("applink.createTitle",{label:a.label}),description:a.desc,icon:a.emoji,iconLabel:a.label,iconColor:a.color,onClose:u,children:n.jsx(Tg,{agents:m,onCreate:c,apiBaseUrl:j,onPaired:z,onRefresh:y,onGoToAgents:()=>{u(),S()},onCancel:u},"slack-pairing")}),s&&a.id==="dingtalk"&&n.jsx(In,{title:B("applink.createTitle",{label:a.label}),description:a.desc,icon:a.emoji,iconLabel:a.label,iconColor:a.color,onClose:u,children:n.jsx(Og,{agents:m,onCreate:c,apiBaseUrl:j,onPaired:G,onRefresh:y,onGoToAgents:()=>{u(),S()},onCancel:u},"dingtalk-pairing")}),s&&a.id==="wecom"&&n.jsx(In,{title:B("applink.createTitle",{label:a.label}),description:a.desc,icon:a.emoji,iconLabel:a.label,iconColor:a.color,onClose:u,children:n.jsx(zg,{agents:m,onCreate:c,apiBaseUrl:j,onPaired:$,onRefresh:y,onGoToAgents:()=>{u(),S()},onCancel:u},"wecom-pairing")}),s&&a.id==="flowchat"&&n.jsx(In,{title:B("applink.createTitle",{label:a.label}),description:a.desc,icon:a.emoji,iconLabel:a.label,iconColor:a.color,onClose:u,children:n.jsx(Zg,{agents:m,onCreate:c,apiBaseUrl:j,onPaired:E,onRefresh:y,onGoToAgents:()=>{u(),S()},onCancel:u},"flowchat-pairing")}),p&&O&&n.jsxs(In,{title:B("applink.editTitle",{name:p.name}),description:`@${p.channelId} · ${O.label}`,icon:O.emoji,iconLabel:p.appType??"app",iconColor:O.color,onClose:h,children:[p.appType==="telegram"&&n.jsx(jg,{channel:p,agents:m,apiBaseUrl:j,onUpdate:x,onRefresh:y,onSaved:()=>{y(),h()},onCancel:h},`${p.id}-tg-edit`),p.appType==="whatsapp"&&n.jsx(Ig,{channel:p,agents:m,apiBaseUrl:j,onUpdate:x,onRefresh:y,onSaved:()=>{y(),h()},onCancel:h},`${p.id}-wa-edit`),p.appType==="slack"&&n.jsx(Lg,{channel:p,agents:m,apiBaseUrl:j,onUpdate:x,onRefresh:y,onSaved:()=>{y(),h()},onCancel:h},`${p.id}-sl-edit`),p.appType==="dingtalk"&&n.jsx(Ug,{channel:p,agents:m,apiBaseUrl:j,liveStatus:M?.[p.id],onUpdate:x,onRefresh:y,onSaved:()=>{y(),h()},onCancel:h},`${p.id}-dt-edit`),p.appType==="flowchat"&&n.jsx(tf,{channel:p,agents:m,apiBaseUrl:j,onUpdate:x,onRefresh:y,onSaved:()=>{y(),h()},onCancel:h},`${p.id}-fc-edit`),p.appType==="wecom"&&n.jsx(Dg,{channel:p,agents:m,apiBaseUrl:j,onUpdate:x,onRefresh:y,onSaved:()=>{y(),h()},onCancel:h},`${p.id}-wc-edit`)]})]})}const or=[{id:"whatsapp",label:"WhatsApp",shortLabel:"WA",emoji:"💬",color:"#25d366",desc:"Meta WhatsApp Business"},{id:"telegram",label:"Telegram",shortLabel:"TG",emoji:"✈️",color:"#2ca5e0",desc:"Telegram Bot API"},{id:"slack",label:"Slack",shortLabel:"Slack",emoji:"💼",color:"#4a154b",desc:"Slack Workspace App"},{id:"wecom",label:"WeCom",shortLabel:"WeCom",emoji:"🏢",color:"#248067",desc:"WeCom Custom App"},{id:"dingtalk",label:"DingTalk",shortLabel:"DT",emoji:"💠",color:"#1677ff",desc:"DingTalk App Bot"},{id:"flowchat",label:"FlowChat",shortLabel:"FC",emoji:"🌊",color:"#5b6ee1",desc:"FlowChat E2EE chat platform"},{id:"line",label:"LINE",shortLabel:"LINE",emoji:"🟢",color:"#00c300",desc:"LINE Messaging API"},{id:"custom",label:"Custom",shortLabel:"Custom",emoji:"⚙️",color:"#c96442",desc:"Custom integration"}];function Xd(){return n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}function Jd(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M12 2l2.4 2.4H18v3.6L20.4 12 18 16v3.6h-3.6L12 22l-2.4-2.4H6V16L3.6 12 6 8V4.4h3.6z"}),n.jsx("circle",{cx:"12",cy:"12",r:"2.5"})]})}function of(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]})}function af(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"3"}),n.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}function sf(){return n.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),n.jsx("polyline",{points:"16 17 21 12 16 7"}),n.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})}function cf({channels:a,activeChannel:i,activeConfig:s,isLoading:u,onSelectChannel:p,onCreateClick:h,chatWindowProps:m={}}){const{t:c}=Ie(),x=Gd(),y=jh(i?.channelId??""),[j,S]=g.useState(!1),[M,B]=g.useState([]),[O,K]=g.useState(null),I=g.useMemo(()=>i?new Kd(i.channelId):null,[i]),z=g.useCallback(()=>{if(!I){B([]),K(null);return}let J=I.listSessions();J.length===0&&(J=[I.createSession(c("appShell.newSession"))]),B(J.map(de=>{const se=y.filter(ue=>(ue.sessionId??ue.externalChatId)===de.id).sort((ue,V)=>Date.parse(V.updatedAt)-Date.parse(ue.updatedAt))[0];return se?{...de,executionStatus:se.clientStatus,executionStatusAt:se.updatedAt}:de})),K(I.getActiveSessionId())},[I,y]);g.useEffect(()=>{z()},[z]),g.useEffect(()=>{if(typeof window>"u"||!i)return;const J=de=>{de.detail?.channelId===i.channelId&&z()};return window.addEventListener("cheng:session-label-updated",J),()=>{window.removeEventListener("cheng:session-label-updated",J)}},[i,z]);const $=g.useCallback(()=>{I&&(I.createSession(c("appShell.newSession")),z())},[z,I]),G=g.useCallback(J=>{I&&(I.setActiveSessionId(J.id),z())},[z,I]),E=g.useCallback(J=>{I&&(x.removeSession(J),I.deleteSession(J),z())},[x,z,I]),Q=g.useCallback((J,de)=>{I&&(I.renameSession(J,de),z())},[z,I]),X=g.useCallback(J=>{I&&(I.togglePinSession(J),z())},[z,I]),Y=g.useMemo(()=>O?{...s,sessionId:O}:s,[s,O]);return n.jsxs("div",{className:"cheng-shell__chat-view",children:[n.jsxs("div",{className:`cheng-shell__channel-sidebar${j?" cheng-shell__channel-sidebar--collapsed":""}`,children:[!j&&n.jsx("div",{className:"cheng-shell__channel-sidebar-content",children:n.jsx(bg,{sessions:M,activeSessionId:O,onSelect:G,onCreateClick:$,onDeleteSession:E,onRenameSession:Q,onTogglePinSession:X})}),n.jsx("button",{className:"cheng-shell__channel-sidebar-toggle cheng-shell__channel-sidebar-toggle--edge",onClick:()=>S(J=>!J),type:"button","aria-label":c(j?"appShell.expandSidebar":"appShell.collapseSidebar"),title:c(j?"appShell.expandSidebar":"appShell.collapseSidebar"),children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:j?n.jsx("path",{d:"M6 3L10 8L6 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}):n.jsx("path",{d:"M10 3L6 8L10 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),n.jsx("div",{className:"cheng-shell__chat-area",children:u&&!i?n.jsx("div",{className:"cheng-shell__placeholder",children:n.jsx("span",{className:"cheng-shell__placeholder-text",children:c("appShell.loadingChannels")})}):i&&i.workspaceId?n.jsx(Fh,{config:Y,children:n.jsx(ug,{...m,channels:a,activeChannelId:i?.id??null,activeChannel:i,onSelectChannel:p})},`${i.channelId}:${i.workspaceId}`):n.jsxs("div",{className:"cheng-shell__placeholder",children:[n.jsx("div",{className:"cheng-shell__placeholder-icon",children:n.jsx(Xd,{})}),n.jsx("p",{className:"cheng-shell__placeholder-text",children:c("appShell.noChannels")}),n.jsx("button",{className:"cheng-shell__placeholder-btn",onClick:h,type:"button",children:c("appShell.createFirstChannel")})]})})]})}function lf(a){if(!a)return"";const i=new Date(a);return Number.isNaN(i.getTime())?a:i.toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"})}function df(a){const i=a.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function uf({channels:a,onCreateClick:i,onEditClick:s,onDeleteClick:u,workspaceNames:p,workflowNames:h}){const{t:m}=Ie();return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:m("appShell.agentsTitle")}),n.jsx("p",{className:"cheng-page__subtitle",children:m("appShell.agentsSubtitle")})]}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:i,children:m("appShell.createAgent")})]}),n.jsx("div",{className:"cheng-page__content",children:a.length===0?n.jsxs("div",{className:"cheng-page__empty-card",children:[n.jsx("div",{className:"cheng-page__empty-icon",children:n.jsx(Jd,{})}),n.jsx("h2",{className:"cheng-page__empty-title",children:m("appShell.noAgentsYet")}),n.jsx("p",{className:"cheng-page__empty-desc",children:m("appShell.noAgentsDesc")}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:i,children:m("appShell.createAgent")})]}):n.jsx("div",{className:"cheng-page__channel-grid",children:a.map(c=>n.jsxs("div",{className:"cheng-page__channel-card",children:[n.jsxs("div",{className:"cheng-page__channel-card-top",children:[n.jsx("div",{className:"cheng-page__channel-card-icon",children:n.jsx("span",{className:"cheng-page__channel-card-avatar","aria-hidden":"true",children:df(c)})}),n.jsxs("div",{className:"cheng-page__channel-card-actions",children:[n.jsx("span",{className:"cheng-page__channel-card-badge",children:c.appType||"agent"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-edit",onClick:()=>s(c),children:m("common.edit")}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-delete",onClick:()=>{u(c)},children:m("common.delete")})]})]}),n.jsxs("div",{className:"cheng-page__channel-card-body",children:[n.jsx("h2",{className:"cheng-page__channel-card-title",children:c.name}),n.jsxs("p",{className:"cheng-page__channel-card-id",children:["@",c.channelId]}),n.jsx("p",{className:"cheng-page__channel-card-desc",children:c.description||m("appShell.noDescription")})]}),n.jsxs("div",{className:"cheng-page__channel-card-workflow",children:[n.jsx("span",{className:"cheng-page__channel-card-detail",title:p[c.workspaceId]?`Workspace ID: ${c.workspaceId}`:c.workspaceId,children:ne(m("appShell.workspace"),{name:p[c.workspaceId]||c.workspaceId})}),n.jsx("span",{className:"cheng-page__channel-card-detail",title:h[c.boundWorkflowId]?`Workflow ID: ${c.boundWorkflowId}`:c.boundWorkflowId,children:ne(m("appShell.workflow"),{name:h[c.boundWorkflowId]||c.boundWorkflowId})}),n.jsx("span",{className:"cheng-page__channel-card-detail",children:ne(m("appShell.created"),{date:lf(c.createdAt)||m("appShell.unknownDate")})})]})]},c.id||c.channelId))})})]})}function pf({channels:a,onCreate:i,onUpdate:s,onDelete:u,onRefresh:p,apiBaseUrl:h,onSuccess:m,onGoToAgents:c}){const{t:x}=Ie(),[y,j]=g.useState("telegram"),[S,M]=g.useState(""),[B,O]=g.useState(!1),[K,I]=g.useState(null),[z,$]=g.useState(null),[G,E]=g.useState({}),Q=g.useRef(null),X=g.useCallback(()=>(Q.current||(Q.current=new Je(h,new Be(h))),Q.current),[h]),Y=g.useMemo(()=>new Set(["telegram","whatsapp","slack","wecom","dingtalk","flowchat"]),[]),J=g.useMemo(()=>a.filter(b=>!b.appType||b.appType==="agent"),[a]),de={degraded:0,error:1,awaiting_input:2,connecting:3,active:4,disconnected:5},se=g.useMemo(()=>a.filter(b=>b.appType&&b.appType!=="agent").sort((b,H)=>{const T=de[b.connectionState??""]??6,W=de[H.connectionState??""]??6;return T!==W?T-W:(H.updatedAt??H.createdAt??"").localeCompare(b.updatedAt??b.createdAt??"")}),[a]);g.useEffect(()=>{or.some(H=>H.id===y)||j(se[0]?.appType??"telegram")},[se,y]);const ue=or.find(b=>b.id===y)??or[1],V=g.useMemo(()=>or.map(b=>{const H=se.filter(R=>R.appType===b.id),T=H.filter(R=>R.connectionState==="active").length,W=H.filter(R=>R.connectionState==="awaiting_input"||R.connectionState==="connecting"||R.connectionState==="configuring").length;return{platform:b,total:H.length,connectedCount:T,pendingCount:W}}),[se]),ce=g.useMemo(()=>{const b=S.trim().toLowerCase();return se.filter(H=>H.appType!==ue.id?!1:b?[H.name,H.channelId,H.description,H.webhookUrl,H.connectionState].filter(Boolean).join(" ").toLowerCase().includes(b):!0)},[ue.id,se,S]),re=se.filter(b=>b.appType===ue.id).length,_e=g.useMemo(()=>Object.fromEntries(se.map(b=>{const H=J.find(T=>T.workspaceId===b.workspaceId&&T.boundWorkflowId===b.boundWorkflowId);return[b.id,H?.name??x("appShell.unboundAgent")]})),[J,se]),ae=g.useCallback(b=>{switch(b){case"active":return{label:x("appShell.stateActive"),cls:"cheng-applink__badge--active"};case"degraded":return{label:x("appShell.stateDegraded"),cls:"cheng-applink__badge--degraded"};case"configuring":return{label:x("appShell.stateConfiguring"),cls:"cheng-applink__badge--configuring"};case"connecting":case"awaiting_input":return{label:x("appShell.statePending"),cls:"cheng-applink__badge--pending"};case"error":return{label:x("appShell.stateError"),cls:"cheng-applink__badge--error"};case"disconnected":return{label:x("appShell.stateDisconnected"),cls:"cheng-applink__badge--disconnected"};default:return{label:x("appShell.stateDefault"),cls:"cheng-applink__badge--default"}}},[x]),te=g.useCallback(b=>{if(!b)return"—";const H=new Date(b);return Number.isNaN(H.getTime())?b:H.toLocaleString(void 0,{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},[]),C=g.useCallback(b=>{j(b),M("")},[]),q=g.useCallback(()=>{O(!1)},[]),A=g.useCallback(async b=>{$({channelId:b.id,action:"refresh"});try{const H=await X().getChannelStatus(b.workspaceId,b.id);E(T=>({...T,[b.id]:H})),await p()}finally{$(null)}},[X,p]),w=g.useCallback(async b=>{if(window.confirm(x("appShell.confirmPause",{name:b.name}))){$({channelId:b.id,action:"pause"});try{await X().disconnectChannel(b.workspaceId,b.id),E(T=>{const W={...T};return delete W[b.id],W}),await p()}finally{$(null)}}},[X,p]),k=g.useCallback(async b=>{$({channelId:b.id,action:"resume"});try{await X().connectChannel(b.workspaceId,b.id),E(H=>{const T={...H};return delete T[b.id],T}),await p()}finally{$(null)}},[X,p]),P=g.useCallback(async b=>{if(window.confirm(x("appShell.confirmDelete",{name:b.name}))){$({channelId:b.id,action:"delete"});try{await Promise.resolve(u(b.id)),E(T=>{const W={...T};return delete W[b.id],W}),await p(),K?.id===b.id&&I(null)}finally{$(null)}}},[K?.id,u,p]);return n.jsxs("div",{className:"cheng-page cheng-applink",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:x("appShell.applinkTitle")}),n.jsx("p",{className:"cheng-page__subtitle",children:x("appShell.applinkSubtitle")})]}),n.jsxs("button",{type:"button",className:"cheng-applink__refresh-btn",onClick:()=>{p()},"aria-label":x("appShell.refreshList"),title:x("appShell.refreshList"),children:[n.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]}),x("appShell.refresh")]})]}),n.jsxs("div",{className:"cheng-applink__body",children:[n.jsx("div",{className:"cheng-applink__platforms",children:V.map(({platform:b,total:H,connectedCount:T})=>{const W=b.id===ue.id,R=Y.has(b.id);return n.jsxs("button",{type:"button",className:`cheng-applink__platform-card${W?" cheng-applink__platform-card--active":""}${R?"":" cheng-applink__platform-card--disabled"}`,onClick:()=>C(b.id),style:W?{borderColor:b.color}:{},children:[n.jsx("span",{className:"cheng-applink__platform-icon",style:{background:`${b.color}18`,color:b.color},role:"img","aria-label":b.label,children:b.emoji}),n.jsx("span",{className:"cheng-applink__platform-label",children:b.label}),!R&&n.jsx("span",{className:"cheng-applink__platform-soon",children:x("appShell.soon")}),R&&n.jsx("span",{className:`cheng-applink__platform-count${T>0?" cheng-applink__platform-count--active":""}`,children:H})]},b.id)})}),n.jsxs("div",{className:"cheng-applink__board",children:[n.jsxs("div",{className:"cheng-applink__board-header",children:[n.jsxs("div",{className:"cheng-applink__board-heading",children:[n.jsx("h2",{className:"cheng-applink__board-title",children:ne(x("appShell.platformList"),{label:ue.shortLabel})}),n.jsx("span",{className:"cheng-applink__board-count",children:re})]}),n.jsxs("div",{className:"cheng-applink__board-actions",children:[n.jsxs("label",{className:"cheng-applink__search",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"11",cy:"11",r:"7",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("path",{d:"M20 20l-3.5-3.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),n.jsx("input",{type:"search",value:S,onChange:b=>M(b.target.value),placeholder:x("appShell.searchPlaceholder",{label:ue.shortLabel})})]}),n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>O(!0),disabled:!Y.has(ue.id),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),ne(x("appShell.createPlatform"),{label:ue.shortLabel})]})]})]}),ce.length>0?n.jsx("div",{className:"cheng-applink__table-wrap",children:n.jsxs("table",{className:"cheng-applink__table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:x("appShell.colName")}),n.jsx("th",{children:x("appShell.colStatus")}),n.jsx("th",{children:x("appShell.colAgent")}),n.jsx("th",{children:x("appShell.colWebhook")}),n.jsx("th",{children:x("appShell.colUpdated")}),n.jsx("th",{children:x("appShell.colActions")})]})}),n.jsx("tbody",{children:ce.map(b=>{const H=G[b.id],T=H?.connectionState??b.connectionState,W=ae(T),R=or.find(Te=>Te.id===b.appType)??ue,F=z?.channelId===b.id,he=_e[b.id]??x("appShell.unboundAgent"),ke=z?.channelId===b.id&&z.action==="refresh",we=T==="disconnected";return n.jsxs("tr",{className:"cheng-applink__row",children:[n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--name",children:[n.jsx("div",{className:"cheng-applink__row-icon",style:{background:`${R.color}16`,color:R.color},children:n.jsx("span",{role:"img","aria-label":R.label,children:R.emoji})}),n.jsxs("div",{className:"cheng-applink__row-copy",children:[n.jsx("strong",{children:b.name}),n.jsxs("span",{children:["@",b.channelId]})]})]}),n.jsx("td",{className:"cheng-applink__cell",children:n.jsx("span",{className:`cheng-applink__badge ${W.cls}`,children:W.label})}),n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--meta",children:[n.jsx("span",{children:he}),b.boundWorkflowId&&n.jsx("small",{children:ne(x("appShell.workflow"),{name:b.boundWorkflowId})})]}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--endpoint",children:b.appType==="dingtalk"?n.jsxs("div",{className:"cheng-applink__stream-cell",children:[n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--stream",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),x("dingtalkPair.streamMode")]}),(H?.lastEventAt??H?.lastError)&&n.jsx("span",{className:"cheng-applink__stream-meta",children:H.lastError?n.jsxs("span",{className:"cheng-applink__stream-error",title:H.lastError,children:["⚠ ",H.lastError.slice(0,40),H.lastError.length>40?"…":""]}):H?.lastEventAt?n.jsx(n.Fragment,{children:ne(x("appShell.lastEvent"),{time:te(H.lastEventAt)})}):null})]}):b.appType==="slack"&&b.connectionConfig?.connection_mode==="socket_mode"?n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--socket",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),x("slackPair.modeSocket")]}):n.jsx("span",{title:b.webhookUrl||b.description||"",children:b.webhookUrl||b.description||"—"})}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--time",children:te(b.updatedAt??b.createdAt)}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--actions",children:n.jsxs("div",{className:"cheng-applink__row-actions",children:[we?n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":x("appShell.resumeConnection"),title:x("appShell.resumeConnection"),onClick:()=>{k(b)},disabled:F,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 6.5v11l9-5.5-9-5.5Z",fill:"currentColor"})})}):n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":x("appShell.pauseConnection"),title:x("appShell.pauseConnection"),onClick:()=>{w(b)},disabled:F,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M9 5H7v14h2V5Zm8 0h-2v14h2V5Z",fill:"currentColor"})})}),n.jsx("button",{type:"button",className:`cheng-applink__icon-btn${ke?" cheng-applink__icon-btn--spinning":""}`,"aria-label":x("appShell.refreshStatus"),title:x("appShell.refreshStatus"),onClick:()=>{A(b)},disabled:F,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":x("appShell.editConnection"),title:x("appShell.editConnection"),onClick:()=>I(b),children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M12 20h9",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn cheng-applink__icon-btn--danger","aria-label":x("appShell.deleteConnection"),title:x("appShell.deleteConnection"),onClick:()=>{P(b)},disabled:F,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M3 6h18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M8 6V4h8v2",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M19 6l-1 14H6L5 6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M10 11v5M14 11v5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]})})]})})]},b.id||b.channelId)})})]})}):n.jsxs("div",{className:"cheng-applink__empty",children:[n.jsx("div",{className:"cheng-applink__empty-icon",children:n.jsx("span",{role:"img","aria-label":ue.label,style:{fontSize:28},children:ue.emoji})}),n.jsx("p",{className:"cheng-applink__empty-title",children:ne(x("appShell.noConnections"),{label:ue.shortLabel})}),n.jsx("p",{className:"cheng-applink__empty-desc",children:S?ne(x("appShell.noSearchMatch"),{search:S}):ne(x("appShell.noPlatformConnections"),{label:ue.label})}),!S&&Y.has(ue.id)&&n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>O(!0),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),ne(x("appShell.createPlatform"),{label:ue.shortLabel})]})]})]})]}),n.jsx(rf,{activePlatform:ue,platforms:or,isCreateModalOpen:B,onCloseCreate:q,editingChannel:K,onCloseEdit:()=>I(null),agents:J,onCreate:i,onUpdate:s,onRefresh:p,apiBaseUrl:h,onGoToAgents:c,liveStatusMap:G})]})}function hf({onLogout:a}){const{t:i,locale:s,setLocale:u,availableLocales:p}=Ie();return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header",children:[n.jsx("h1",{className:"cheng-page__title",children:i("appShell.settings")}),n.jsx("p",{className:"cheng-page__subtitle",children:i("appShell.settingsSubtitle")})]}),n.jsxs("div",{className:"cheng-page__content",children:[n.jsx("div",{className:"cheng-page__settings-card",children:n.jsxs("div",{className:"cheng-page__settings-section",children:[n.jsx("h2",{className:"cheng-page__settings-section-title",children:i("appShell.language")}),n.jsx("p",{className:"cheng-page__settings-section-desc",children:i("appShell.languageDesc")}),n.jsx("div",{className:"cheng-page__lang-switcher",children:p.map(h=>n.jsx("button",{type:"button",className:`cheng-page__lang-btn${s===h?" cheng-page__lang-btn--active":""}`,"aria-pressed":s===h,onClick:()=>u(h),style:s===h?{backgroundColor:"#d97757",color:"#fff",borderColor:"#d97757"}:void 0,children:ch[h]},h))})]})}),n.jsx("div",{className:"cheng-page__settings-card",children:n.jsxs("div",{className:"cheng-page__settings-section",children:[n.jsx("h2",{className:"cheng-page__settings-section-title",children:i("appShell.account")}),n.jsx("p",{className:"cheng-page__settings-section-desc",children:i("appShell.accountDesc")}),n.jsxs("button",{type:"button",className:"cheng-page__logout-btn",onClick:a,children:[n.jsx(sf,{}),i("appShell.signOut")]})]})})]})]})}function gf({channels:a,activeChannel:i,activeConfig:s,isLoading:u,onSelectChannel:p,onCreateChannel:h,onUpdateChannel:m,onDeleteChannel:c,onLogout:x,onRefreshChannels:y,apiBaseUrl:j,chatWindowProps:S={}}){const{t:M}=Ie(),[B,O]=g.useState("chat"),[K,I]=g.useState(!1),[z,$]=g.useState(null),[G,E]=g.useState({}),[Q,X]=g.useState({}),Y=g.useRef(null),J=[{id:"chat",label:M("appShell.navChat"),icon:n.jsx(Xd,{})},{id:"channel",label:M("appShell.navAgents"),icon:n.jsx(Jd,{})},{id:"applink",label:M("appShell.navAppLinks"),icon:n.jsx(of,{})}],de=()=>{I(!1),$(null),O("channel")},se=()=>{I(!1),$(null)},ue=async V=>{window.confirm(M("appShell.confirmDeleteAgent",{name:V.name}))&&(await Promise.resolve(c(V.id)),z?.id===V.id&&$(null))};return g.useEffect(()=>{const V=`${j??""}:${a.map(re=>`${re.workspaceId}/${re.boundWorkflowId}`).sort().join(",")}`;if(Y.current===V)return;Y.current=V,(async()=>{if(!j||a.length===0){Y.current===V&&(E({}),X({}));return}const re=new Be(j),_e=new Je(j,re);try{const C=await _e.listWorkspaces();Y.current===V&&E(Object.fromEntries(C.map(q=>[q.id,q.name||q.id])))}catch{Y.current===V&&E({})}const ae=Array.from(new Map(a.filter(C=>C.boundWorkflowId?.trim()).map(C=>[C.boundWorkflowId,{workflowId:C.boundWorkflowId,workspaceId:C.workspaceId}])).values()),te=await Promise.all(ae.map(async({workflowId:C,workspaceId:q})=>{try{const A=await _e.getWorkflowName(C,q);return[C,A||C]}catch{return[C,C]}}));Y.current===V&&X(Object.fromEntries(te))})()},[j,a]),n.jsxs("div",{className:"cheng-shell",children:[n.jsxs("div",{className:"cheng-shell__sidebar",children:[n.jsx("div",{className:"cheng-shell__logo","aria-label":"ChengOS logo",children:"CO"}),n.jsx("div",{className:"cheng-shell__divider"}),n.jsx("nav",{className:"cheng-shell__nav",children:J.map(V=>{const ce=B===V.id;return n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${ce?" cheng-shell__nav-item--active":""}`,onClick:()=>O(V.id),"aria-label":V.label,children:[V.icon,ce&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:V.label})]},V.id)})}),n.jsxs("div",{className:"cheng-shell__bottom",children:[n.jsx("div",{className:"cheng-shell__divider"}),n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${B==="settings"?" cheng-shell__nav-item--active":""}`,onClick:()=>O("settings"),"aria-label":M("appShell.settings"),children:[n.jsx(af,{}),B==="settings"&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:M("appShell.settings")})]})]})]}),n.jsxs("div",{className:"cheng-shell__main",children:[B==="chat"&&n.jsx(cf,{channels:a,activeChannel:i,activeConfig:s,isLoading:u,onSelectChannel:p,onCreateClick:()=>O("channel"),chatWindowProps:S}),B==="channel"&&n.jsx(uf,{channels:a,onCreateClick:()=>I(!0),onEditClick:V=>$(V),onDeleteClick:ue,workspaceNames:G,workflowNames:Q}),B==="applink"&&n.jsx(pf,{channels:a,onCreate:h,onUpdate:m,onDelete:c,onRefresh:y??(()=>{}),apiBaseUrl:j,onSuccess:de,onGoToAgents:()=>O("channel")}),B==="settings"&&n.jsx(hf,{onLogout:x})]}),n.jsx(xg,{isOpen:K||!!z,onClose:se,mode:z?"edit":"create",initialChannel:z,existingChannels:a,onCreate:async V=>{await h(V)},onUpdate:async V=>{await m(V),de()},apiBaseUrl:j}),n.jsx("style",{children:mf})]})}function ff(a){return n.jsx(_s,{children:n.jsx(vh,{config:a.activeConfig,children:n.jsx(gf,{...a})})})}const mf=`
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

  .cheng-page__lang-switcher {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .cheng-page__lang-btn {
    padding: 8px 18px;
    background: #fff;
    color: #5e5d59;
    border: 1px solid #e0ddd3;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }

  .cheng-page__lang-btn:hover {
    background: #f5f3ec;
    border-color: #d97757;
  }

  .cheng-page__lang-btn--active {
    background: #d97757 !important;
    color: #fff !important;
    border-color: #d97757 !important;
  }

  .cheng-page__lang-btn--active:hover {
    background: #c5664a !important;
    border-color: #c5664a !important;
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

  .cheng-shell .cheng-page__lang-btn--active {
    background: #d97757 !important;
    border-color: #d97757 !important;
    color: #fff !important;
  }

  .cheng-shell .cheng-page__lang-btn--active:hover:not(:disabled) {
    background: #c5664a !important;
    border-color: #c5664a !important;
    color: #fff !important;
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
`;function xf({apiBaseUrl:a,onLoginSuccess:i,title:s="ChengOS",subtitle:u}){const{t:p}=Ie(),h=u??p("login.subtitle"),[m,c]=g.useState(""),[x,y]=g.useState(""),[j,S]=g.useState(!1),[M,B]=g.useState(null),[O,K]=g.useState(!1),I=g.useCallback(async z=>{z.preventDefault(),S(!0),B(null);try{await new ks(a).login({email:m,password:x}),i()}catch($){B($ instanceof Error?$.message:String($))}finally{S(!1)}},[a,m,x,i]);return n.jsxs("div",{style:Me.root,children:[n.jsx("div",{style:Me.orbTopLeft}),n.jsx("div",{style:Me.orbTopRight}),n.jsx("div",{style:Me.orbBottom}),n.jsx("div",{style:Me.container,children:n.jsxs("section",{style:Me.card,children:[n.jsx("div",{style:Me.cardGlow}),n.jsxs("div",{style:Me.content,children:[n.jsx("div",{style:Me.headerRow,children:n.jsxs("div",{style:Me.brandWrap,children:[n.jsx("div",{style:Me.brandLogo,children:"CO"}),n.jsx("div",{style:Me.brandText,children:"CHENGOS"})]})}),n.jsxs("div",{style:Me.titleWrap,children:[n.jsx("h1",{style:Me.title,children:s}),n.jsx("p",{style:Me.subtitle,children:h})]}),n.jsxs("form",{onSubmit:I,style:Me.form,children:[n.jsxs("div",{style:Me.field,children:[n.jsx("label",{style:Me.label,htmlFor:"cheng-email",children:p("login.email")}),n.jsx("input",{id:"cheng-email",type:"email",required:!0,autoComplete:"email",value:m,onChange:z=>c(z.target.value),style:Me.input,placeholder:"you@example.com",disabled:j})]}),n.jsxs("div",{style:Me.field,children:[n.jsx("label",{style:Me.label,htmlFor:"cheng-password",children:p("login.password")}),n.jsx("input",{id:"cheng-password",type:"password",required:!0,autoComplete:"current-password",value:x,onChange:z=>y(z.target.value),style:Me.input,placeholder:"••••••••",disabled:j})]}),M&&n.jsx("div",{style:Me.error,children:M}),n.jsxs("button",{type:"submit",disabled:j,onMouseEnter:()=>K(!0),onMouseLeave:()=>K(!1),onFocus:()=>K(!0),onBlur:()=>K(!1),style:{...Me.button,...O&&!j?Me.buttonHovered:{},...j?Me.buttonDisabled:{}},children:[n.jsx("span",{children:p(j?"login.signingIn":"login.signIn")}),n.jsx("span",{style:Me.arrow,children:"→"})]})]})]})]})})]})}const Me={root:{position:"relative",display:"flex",minHeight:"100%",width:"100%",overflow:"hidden",background:"radial-gradient(circle at top left, rgba(201, 100, 66, 0.14), transparent 30%), radial-gradient(circle at top right, rgba(217, 119, 87, 0.12), transparent 28%), linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},orbTopLeft:{position:"absolute",left:"-8rem",top:"-6rem",width:"16rem",height:"16rem",borderRadius:"9999px",background:"rgba(201, 100, 66, 0.12)",filter:"blur(56px)",pointerEvents:"none"},orbTopRight:{position:"absolute",right:"-6rem",top:"6rem",width:"18rem",height:"18rem",borderRadius:"9999px",background:"rgba(176, 174, 165, 0.2)",filter:"blur(56px)",pointerEvents:"none"},orbBottom:{position:"absolute",left:"32%",bottom:"-8rem",width:"20rem",height:"20rem",borderRadius:"9999px",background:"rgba(217, 119, 87, 0.12)",filter:"blur(60px)",pointerEvents:"none"},container:{position:"relative",zIndex:1,display:"flex",alignItems:"center",width:"100%",maxWidth:"36rem",minHeight:"100%",margin:"0 auto",padding:"2rem 1rem",boxSizing:"border-box"},card:{position:"relative",width:"100%",overflow:"hidden",borderRadius:"2rem",border:"1px solid #f0eee6",background:"#faf9f5",boxShadow:"0 0 0 1px #d1cfc5, rgba(0,0,0,0.07) 0px 16px 40px",backdropFilter:"blur(14px)"},cardGlow:{position:"absolute",inset:0,background:"radial-gradient(circle at top right, rgba(201, 100, 66, 0.08), transparent 34%), radial-gradient(circle at bottom left, rgba(217, 119, 87, 0.08), transparent 30%)",pointerEvents:"none"},content:{position:"relative",zIndex:1,padding:"1.75rem"},headerRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:"1.5rem"},brandWrap:{display:"flex",alignItems:"center",gap:"0.75rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"1rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700,boxShadow:"0 10px 24px rgba(226, 114, 91, 0.36)",letterSpacing:"0.03em"},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},titleWrap:{marginBottom:"1.5rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,letterSpacing:"-0.03em",color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},form:{display:"flex",flexDirection:"column",gap:"1rem"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"1rem",border:"1px solid #e8e6dc",background:"#faf9f5",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",boxShadow:"0 0 0 1px #d1cfc5",outline:"none"},error:{borderRadius:"1rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{height:"3rem",border:"1px solid #d1cfc5",borderRadius:"1rem",background:"#faf9f5",color:"#4d4c48",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",fontSize:"0.875rem",fontWeight:500,boxShadow:"0 0 0 1px #d1cfc5",cursor:"pointer",transition:"all 0.2s ease",marginTop:"0.25rem"},buttonHovered:{background:"#c96442",border:"1px solid #c96442",color:"#faf9f5",boxShadow:"0 0 0 1px #c96442, rgba(0,0,0,0.08) 0px 8px 24px"},buttonDisabled:{opacity:.7,cursor:"not-allowed",boxShadow:"none"},arrow:{fontSize:"1rem",lineHeight:1}};function _f({config:a,chatWindowProps:i={},loginTitle:s,loginSubtitle:u}){const{isAuthenticated:p,logout:h,refresh:m}=Wh(a.apiBaseUrl),{channels:c,activeChannel:x,setActiveChannel:y,createChannel:j,updateChannel:S,deleteChannel:M,isLoading:B,refresh:O}=Dh({...a,workspaceId:""}),K=g.useCallback(async $=>j($),[j]),I=g.useCallback(async $=>{await S($)},[S]),z=g.useMemo(()=>{const $={...a,workspaceId:""};return x?{...$,workspaceId:x.workspaceId,channelId:x.channelId,boundWorkflowId:x.boundWorkflowId||$.boundWorkflowId}:$},[a,x]);return p?n.jsx(_s,{children:n.jsxs("div",{className:"cheng-layout cheng-layout--multi",children:[n.jsx(ff,{channels:c,activeChannel:x,activeConfig:z,isLoading:B,onSelectChannel:y,onCreateChannel:K,onUpdateChannel:I,onDeleteChannel:M,onLogout:h,onRefreshChannels:O,apiBaseUrl:a.apiBaseUrl,chatWindowProps:i}),n.jsx("style",{children:wf})]})}):n.jsx(_s,{children:n.jsx(xf,{apiBaseUrl:a.apiBaseUrl,onLoginSuccess:m,title:s,subtitle:u})})}const wf=`
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
`;function bf({apiBaseUrl:a,token:i,onComplete:s}){const{t:u}=Ie(),[p,h]=g.useState(""),[m,c]=g.useState(""),[x,y]=g.useState(!1),[j,S]=g.useState(!1),[M,B]=g.useState(null),O=g.useMemo(()=>i?.trim()||"",[i]),K=g.useCallback(async I=>{if(I.preventDefault(),B(null),!O){B(u("resetPassword.invalidLink"));return}if(p!==m){B(u("resetPassword.passwordMismatch"));return}y(!0);try{await new ks(a).resetPassword({token:O,new_password:p}),S(!0),s?.()}catch(z){B(z instanceof Error?z.message:String(z))}finally{y(!1)}},[a,m,s,p,O,u]);return n.jsx("div",{style:$e.root,children:n.jsxs("main",{style:$e.panel,children:[n.jsxs("div",{style:$e.brandRow,children:[n.jsx("div",{style:$e.brandLogo,children:"CO"}),n.jsx("div",{style:$e.brandText,children:"CHENGOS"})]}),j?n.jsxs("section",{style:$e.content,children:[n.jsx("h1",{style:$e.title,children:u("resetPassword.doneTitle")}),n.jsx("p",{style:$e.subtitle,children:u("resetPassword.doneSubtitle")}),n.jsx("a",{href:"/",style:$e.button,children:u("resetPassword.backToLogin")})]}):n.jsxs("form",{onSubmit:K,style:$e.content,children:[n.jsxs("div",{children:[n.jsx("h1",{style:$e.title,children:u("resetPassword.title")}),n.jsx("p",{style:$e.subtitle,children:u("resetPassword.subtitle")})]}),n.jsxs("div",{style:$e.field,children:[n.jsx("label",{style:$e.label,htmlFor:"cheng-new-password",children:u("resetPassword.newPassword")}),n.jsx("input",{id:"cheng-new-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:p,onChange:I=>h(I.target.value),style:$e.input,disabled:x||!O})]}),n.jsxs("div",{style:$e.field,children:[n.jsx("label",{style:$e.label,htmlFor:"cheng-confirm-password",children:u("resetPassword.confirmPassword")}),n.jsx("input",{id:"cheng-confirm-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:m,onChange:I=>c(I.target.value),style:$e.input,disabled:x||!O})]}),!O&&n.jsx("div",{style:$e.error,children:u("resetPassword.missingToken")}),M&&n.jsx("div",{style:$e.error,children:M}),n.jsx("button",{type:"submit",disabled:x||!O,style:$e.button,children:u(x?"resetPassword.submitting":"resetPassword.updatePassword")}),n.jsx("a",{href:"/",style:$e.secondaryLink,children:u("resetPassword.backToLogin")})]})]})})}const $e={root:{display:"flex",minHeight:"100%",width:"100%",alignItems:"center",justifyContent:"center",boxSizing:"border-box",padding:"2rem 1rem",background:"linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},panel:{width:"100%",maxWidth:"30rem",boxSizing:"border-box",border:"1px solid #d1cfc5",borderRadius:"1.25rem",background:"#faf9f5",padding:"1.75rem",boxShadow:"rgba(0,0,0,0.07) 0px 16px 40px"},brandRow:{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"0.875rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},content:{display:"flex",flexDirection:"column",gap:"1rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"0.875rem",border:"1px solid #e8e6dc",background:"#fff",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",outline:"none"},error:{borderRadius:"0.875rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{display:"flex",height:"3rem",alignItems:"center",justifyContent:"center",border:"1px solid #c96442",borderRadius:"0.875rem",background:"#c96442",color:"#faf9f5",fontSize:"0.875rem",fontWeight:600,textDecoration:"none",cursor:"pointer"},secondaryLink:{alignSelf:"center",color:"#5e5d59",fontSize:"0.875rem",textDecoration:"none"}};function kf(){const a=window.__CHENGOS_APP_CONFIG__,i={apiBaseUrl:a?.apiBaseUrl||void 0||"/api/v1",wsBaseUrl:a?.wsUrl||void 0||"/ws/executions",channelId:a?.channelId||void 0||"weather-app",boundWorkflowId:a?.boundWorkflowId||void 0||""};if(window.location.pathname==="/reset-password"){const s=new URLSearchParams(window.location.search).get("token");return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(bf,{apiBaseUrl:i.apiBaseUrl,token:s})})}return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(_f,{config:i,loginTitle:"Chengflow",chatWindowProps:{height:"100vh"}})})}const Zd=document.getElementById("root");if(!Zd)throw new Error("Root element not found");const yf=ah.createRoot(Zd);yf.render(n.jsx(eh.StrictMode,{children:n.jsx(kf,{})}));
