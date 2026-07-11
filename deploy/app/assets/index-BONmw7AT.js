(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))d(p);new MutationObserver(p=>{for(const h of p)if(h.type==="childList")for(const x of h.addedNodes)x.tagName==="LINK"&&x.rel==="modulepreload"&&d(x)}).observe(document,{childList:!0,subtree:!0});function a(p){const h={};return p.integrity&&(h.integrity=p.integrity),p.referrerPolicy&&(h.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?h.credentials="include":p.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function d(p){if(p.ep)return;p.ep=!0;const h=a(p);fetch(p.href,h)}})();function Ip(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var qs={exports:{}},Wr={},Ys={exports:{}},Se={};var td;function Ep(){if(td)return Se;td=1;var l=Symbol.for("react.element"),i=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),d=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),x=Symbol.for("react.context"),b=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),v=Symbol.for("react.memo"),R=Symbol.for("react.lazy"),M=Symbol.iterator;function $(m){return m===null||typeof m!="object"?null:(m=M&&m[M]||m["@@iterator"],typeof m=="function"?m:null)}var z={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ie=Object.assign,E={};function W(m,_,w){this.props=m,this.context=_,this.refs=E,this.updater=w||z}W.prototype.isReactComponent={},W.prototype.setState=function(m,_){if(typeof m!="object"&&typeof m!="function"&&m!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,m,_,"setState")},W.prototype.forceUpdate=function(m){this.updater.enqueueForceUpdate(this,m,"forceUpdate")};function N(){}N.prototype=W.prototype;function G(m,_,w){this.props=m,this.context=_,this.refs=E,this.updater=w||z}var Y=G.prototype=new N;Y.constructor=G,ie(Y,W.prototype),Y.isPureReactComponent=!0;var U=Array.isArray,ee=Object.prototype.hasOwnProperty,H={current:null},X={key:!0,ref:!0,__self:!0,__source:!0};function ae(m,_,w){var T,I={},P=null,S=null;if(_!=null)for(T in _.ref!==void 0&&(S=_.ref),_.key!==void 0&&(P=""+_.key),_)ee.call(_,T)&&!X.hasOwnProperty(T)&&(I[T]=_[T]);var J=arguments.length-2;if(J===1)I.children=w;else if(1<J){for(var pe=Array(J),be=0;be<J;be++)pe[be]=arguments[be+2];I.children=pe}if(m&&m.defaultProps)for(T in J=m.defaultProps,J)I[T]===void 0&&(I[T]=J[T]);return{$$typeof:l,type:m,key:P,ref:S,props:I,_owner:H.current}}function re(m,_){return{$$typeof:l,type:m.type,key:_,ref:m.ref,props:m.props,_owner:m._owner}}function se(m){return typeof m=="object"&&m!==null&&m.$$typeof===l}function te(m){var _={"=":"=0",":":"=2"};return"$"+m.replace(/[=:]/g,function(w){return _[w]})}var le=/\/+/g;function Q(m,_){return typeof m=="object"&&m!==null&&m.key!=null?te(""+m.key):_.toString(36)}function xe(m,_,w,T,I){var P=typeof m;(P==="undefined"||P==="boolean")&&(m=null);var S=!1;if(m===null)S=!0;else switch(P){case"string":case"number":S=!0;break;case"object":switch(m.$$typeof){case l:case i:S=!0}}if(S)return S=m,I=I(S),m=T===""?"."+Q(S,0):T,U(I)?(w="",m!=null&&(w=m.replace(le,"$&/")+"/"),xe(I,_,w,"",function(be){return be})):I!=null&&(se(I)&&(I=re(I,w+(!I.key||S&&S.key===I.key?"":(""+I.key).replace(le,"$&/")+"/")+m)),_.push(I)),1;if(S=0,T=T===""?".":T+":",U(m))for(var J=0;J<m.length;J++){P=m[J];var pe=T+Q(P,J);S+=xe(P,_,w,pe,I)}else if(pe=$(m),typeof pe=="function")for(m=pe.call(m),J=0;!(P=m.next()).done;)P=P.value,pe=T+Q(P,J++),S+=xe(P,_,w,pe,I);else if(P==="object")throw _=String(m),Error("Objects are not valid as a React child (found: "+(_==="[object Object]"?"object with keys {"+Object.keys(m).join(", ")+"}":_)+"). If you meant to render a collection of children, use an array instead.");return S}function V(m,_,w){if(m==null)return m;var T=[],I=0;return xe(m,T,"","",function(P){return _.call(w,P,I++)}),T}function ce(m){if(m._status===-1){var _=m._result;_=_(),_.then(function(w){(m._status===0||m._status===-1)&&(m._status=1,m._result=w)},function(w){(m._status===0||m._status===-1)&&(m._status=2,m._result=w)}),m._status===-1&&(m._status=0,m._result=_)}if(m._status===1)return m._result.default;throw m._result}var O={current:null},F={transition:null},B={ReactCurrentDispatcher:O,ReactCurrentBatchConfig:F,ReactCurrentOwner:H};function K(){throw Error("act(...) is not supported in production builds of React.")}return Se.Children={map:V,forEach:function(m,_,w){V(m,function(){_.apply(this,arguments)},w)},count:function(m){var _=0;return V(m,function(){_++}),_},toArray:function(m){return V(m,function(_){return _})||[]},only:function(m){if(!se(m))throw Error("React.Children.only expected to receive a single React element child.");return m}},Se.Component=W,Se.Fragment=a,Se.Profiler=p,Se.PureComponent=G,Se.StrictMode=d,Se.Suspense=k,Se.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=B,Se.act=K,Se.cloneElement=function(m,_,w){if(m==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+m+".");var T=ie({},m.props),I=m.key,P=m.ref,S=m._owner;if(_!=null){if(_.ref!==void 0&&(P=_.ref,S=H.current),_.key!==void 0&&(I=""+_.key),m.type&&m.type.defaultProps)var J=m.type.defaultProps;for(pe in _)ee.call(_,pe)&&!X.hasOwnProperty(pe)&&(T[pe]=_[pe]===void 0&&J!==void 0?J[pe]:_[pe])}var pe=arguments.length-2;if(pe===1)T.children=w;else if(1<pe){J=Array(pe);for(var be=0;be<pe;be++)J[be]=arguments[be+2];T.children=J}return{$$typeof:l,type:m.type,key:I,ref:P,props:T,_owner:S}},Se.createContext=function(m){return m={$$typeof:x,_currentValue:m,_currentValue2:m,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},m.Provider={$$typeof:h,_context:m},m.Consumer=m},Se.createElement=ae,Se.createFactory=function(m){var _=ae.bind(null,m);return _.type=m,_},Se.createRef=function(){return{current:null}},Se.forwardRef=function(m){return{$$typeof:b,render:m}},Se.isValidElement=se,Se.lazy=function(m){return{$$typeof:R,_payload:{_status:-1,_result:m},_init:ce}},Se.memo=function(m,_){return{$$typeof:v,type:m,compare:_===void 0?null:_}},Se.startTransition=function(m){var _=F.transition;F.transition={};try{m()}finally{F.transition=_}},Se.unstable_act=K,Se.useCallback=function(m,_){return O.current.useCallback(m,_)},Se.useContext=function(m){return O.current.useContext(m)},Se.useDebugValue=function(){},Se.useDeferredValue=function(m){return O.current.useDeferredValue(m)},Se.useEffect=function(m,_){return O.current.useEffect(m,_)},Se.useId=function(){return O.current.useId()},Se.useImperativeHandle=function(m,_,w){return O.current.useImperativeHandle(m,_,w)},Se.useInsertionEffect=function(m,_){return O.current.useInsertionEffect(m,_)},Se.useLayoutEffect=function(m,_){return O.current.useLayoutEffect(m,_)},Se.useMemo=function(m,_){return O.current.useMemo(m,_)},Se.useReducer=function(m,_,w){return O.current.useReducer(m,_,w)},Se.useRef=function(m){return O.current.useRef(m)},Se.useState=function(m){return O.current.useState(m)},Se.useSyncExternalStore=function(m,_,w){return O.current.useSyncExternalStore(m,_,w)},Se.useTransition=function(){return O.current.useTransition()},Se.version="18.3.1",Se}var nd;function la(){return nd||(nd=1,Ys.exports=Ep()),Ys.exports}var rd;function Ap(){if(rd)return Wr;rd=1;var l=la(),i=Symbol.for("react.element"),a=Symbol.for("react.fragment"),d=Object.prototype.hasOwnProperty,p=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function x(b,k,v){var R,M={},$=null,z=null;v!==void 0&&($=""+v),k.key!==void 0&&($=""+k.key),k.ref!==void 0&&(z=k.ref);for(R in k)d.call(k,R)&&!h.hasOwnProperty(R)&&(M[R]=k[R]);if(b&&b.defaultProps)for(R in k=b.defaultProps,k)M[R]===void 0&&(M[R]=k[R]);return{$$typeof:i,type:b,key:$,ref:z,props:M,_owner:p.current}}return Wr.Fragment=a,Wr.jsx=x,Wr.jsxs=x,Wr}var od;function Tp(){return od||(od=1,qs.exports=Ap()),qs.exports}var n=Tp(),f=la();const zp=Ip(f);var Yo={},Js={exports:{}},ht={},Zs={exports:{}},ea={};var id;function Lp(){return id||(id=1,(function(l){function i(F,B){var K=F.length;F.push(B);e:for(;0<K;){var m=K-1>>>1,_=F[m];if(0<p(_,B))F[m]=B,F[K]=_,K=m;else break e}}function a(F){return F.length===0?null:F[0]}function d(F){if(F.length===0)return null;var B=F[0],K=F.pop();if(K!==B){F[0]=K;e:for(var m=0,_=F.length,w=_>>>1;m<w;){var T=2*(m+1)-1,I=F[T],P=T+1,S=F[P];if(0>p(I,K))P<_&&0>p(S,I)?(F[m]=S,F[P]=K,m=P):(F[m]=I,F[T]=K,m=T);else if(P<_&&0>p(S,K))F[m]=S,F[P]=K,m=P;else break e}}return B}function p(F,B){var K=F.sortIndex-B.sortIndex;return K!==0?K:F.id-B.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;l.unstable_now=function(){return h.now()}}else{var x=Date,b=x.now();l.unstable_now=function(){return x.now()-b}}var k=[],v=[],R=1,M=null,$=3,z=!1,ie=!1,E=!1,W=typeof setTimeout=="function"?setTimeout:null,N=typeof clearTimeout=="function"?clearTimeout:null,G=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Y(F){for(var B=a(v);B!==null;){if(B.callback===null)d(v);else if(B.startTime<=F)d(v),B.sortIndex=B.expirationTime,i(k,B);else break;B=a(v)}}function U(F){if(E=!1,Y(F),!ie)if(a(k)!==null)ie=!0,ce(ee);else{var B=a(v);B!==null&&O(U,B.startTime-F)}}function ee(F,B){ie=!1,E&&(E=!1,N(ae),ae=-1),z=!0;var K=$;try{for(Y(B),M=a(k);M!==null&&(!(M.expirationTime>B)||F&&!te());){var m=M.callback;if(typeof m=="function"){M.callback=null,$=M.priorityLevel;var _=m(M.expirationTime<=B);B=l.unstable_now(),typeof _=="function"?M.callback=_:M===a(k)&&d(k),Y(B)}else d(k);M=a(k)}if(M!==null)var w=!0;else{var T=a(v);T!==null&&O(U,T.startTime-B),w=!1}return w}finally{M=null,$=K,z=!1}}var H=!1,X=null,ae=-1,re=5,se=-1;function te(){return!(l.unstable_now()-se<re)}function le(){if(X!==null){var F=l.unstable_now();se=F;var B=!0;try{B=X(!0,F)}finally{B?Q():(H=!1,X=null)}}else H=!1}var Q;if(typeof G=="function")Q=function(){G(le)};else if(typeof MessageChannel<"u"){var xe=new MessageChannel,V=xe.port2;xe.port1.onmessage=le,Q=function(){V.postMessage(null)}}else Q=function(){W(le,0)};function ce(F){X=F,H||(H=!0,Q())}function O(F,B){ae=W(function(){F(l.unstable_now())},B)}l.unstable_IdlePriority=5,l.unstable_ImmediatePriority=1,l.unstable_LowPriority=4,l.unstable_NormalPriority=3,l.unstable_Profiling=null,l.unstable_UserBlockingPriority=2,l.unstable_cancelCallback=function(F){F.callback=null},l.unstable_continueExecution=function(){ie||z||(ie=!0,ce(ee))},l.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):re=0<F?Math.floor(1e3/F):5},l.unstable_getCurrentPriorityLevel=function(){return $},l.unstable_getFirstCallbackNode=function(){return a(k)},l.unstable_next=function(F){switch($){case 1:case 2:case 3:var B=3;break;default:B=$}var K=$;$=B;try{return F()}finally{$=K}},l.unstable_pauseExecution=function(){},l.unstable_requestPaint=function(){},l.unstable_runWithPriority=function(F,B){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var K=$;$=F;try{return B()}finally{$=K}},l.unstable_scheduleCallback=function(F,B,K){var m=l.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?m+K:m):K=m,F){case 1:var _=-1;break;case 2:_=250;break;case 5:_=1073741823;break;case 4:_=1e4;break;default:_=5e3}return _=K+_,F={id:R++,callback:B,priorityLevel:F,startTime:K,expirationTime:_,sortIndex:-1},K>m?(F.sortIndex=K,i(v,F),a(k)===null&&F===a(v)&&(E?(N(ae),ae=-1):E=!0,O(U,K-m))):(F.sortIndex=_,i(k,F),ie||z||(ie=!0,ce(ee))),F},l.unstable_shouldYield=te,l.unstable_wrapCallback=function(F){var B=$;return function(){var K=$;$=B;try{return F.apply(this,arguments)}finally{$=K}}}})(ea)),ea}var sd;function Rp(){return sd||(sd=1,Zs.exports=Lp()),Zs.exports}var ad;function Mp(){if(ad)return ht;ad=1;var l=la(),i=Rp();function a(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var d=new Set,p={};function h(e,t){x(e,t),x(e+"Capture",t)}function x(e,t){for(p[e]=t,e=0;e<t.length;e++)d.add(t[e])}var b=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,v=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,R={},M={};function $(e){return k.call(M,e)?!0:k.call(R,e)?!1:v.test(e)?M[e]=!0:(R[e]=!0,!1)}function z(e,t,r,o){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ie(e,t,r,o){if(t===null||typeof t>"u"||z(e,t,r,o))return!0;if(o)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function E(e,t,r,o,s,c,u){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=s,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=c,this.removeEmptyString=u}var W={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){W[e]=new E(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];W[t]=new E(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){W[e]=new E(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){W[e]=new E(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){W[e]=new E(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){W[e]=new E(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){W[e]=new E(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){W[e]=new E(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){W[e]=new E(e,5,!1,e.toLowerCase(),null,!1,!1)});var N=/[\-:]([a-z])/g;function G(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(N,G);W[t]=new E(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(N,G);W[t]=new E(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(N,G);W[t]=new E(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){W[e]=new E(e,1,!1,e.toLowerCase(),null,!1,!1)}),W.xlinkHref=new E("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){W[e]=new E(e,1,!1,e.toLowerCase(),null,!0,!0)});function Y(e,t,r,o){var s=W.hasOwnProperty(t)?W[t]:null;(s!==null?s.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ie(t,r,s,o)&&(r=null),o||s===null?$(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):s.mustUseProperty?e[s.propertyName]=r===null?s.type===3?!1:"":r:(t=s.attributeName,o=s.attributeNamespace,r===null?e.removeAttribute(t):(s=s.type,r=s===3||s===4&&r===!0?"":""+r,o?e.setAttributeNS(o,t,r):e.setAttribute(t,r))))}var U=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ee=Symbol.for("react.element"),H=Symbol.for("react.portal"),X=Symbol.for("react.fragment"),ae=Symbol.for("react.strict_mode"),re=Symbol.for("react.profiler"),se=Symbol.for("react.provider"),te=Symbol.for("react.context"),le=Symbol.for("react.forward_ref"),Q=Symbol.for("react.suspense"),xe=Symbol.for("react.suspense_list"),V=Symbol.for("react.memo"),ce=Symbol.for("react.lazy"),O=Symbol.for("react.offscreen"),F=Symbol.iterator;function B(e){return e===null||typeof e!="object"?null:(e=F&&e[F]||e["@@iterator"],typeof e=="function"?e:null)}var K=Object.assign,m;function _(e){if(m===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);m=t&&t[1]||""}return`
`+m+e}var w=!1;function T(e,t){if(!e||w)return"";w=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(L){var o=L}Reflect.construct(e,[],t)}else{try{t.call()}catch(L){o=L}e.call(t.prototype)}else{try{throw Error()}catch(L){o=L}e()}}catch(L){if(L&&o&&typeof L.stack=="string"){for(var s=L.stack.split(`
`),c=o.stack.split(`
`),u=s.length-1,g=c.length-1;1<=u&&0<=g&&s[u]!==c[g];)g--;for(;1<=u&&0<=g;u--,g--)if(s[u]!==c[g]){if(u!==1||g!==1)do if(u--,g--,0>g||s[u]!==c[g]){var y=`
`+s[u].replace(" at new "," at ");return e.displayName&&y.includes("<anonymous>")&&(y=y.replace("<anonymous>",e.displayName)),y}while(1<=u&&0<=g);break}}}finally{w=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?_(e):""}function I(e){switch(e.tag){case 5:return _(e.type);case 16:return _("Lazy");case 13:return _("Suspense");case 19:return _("SuspenseList");case 0:case 2:case 15:return e=T(e.type,!1),e;case 11:return e=T(e.type.render,!1),e;case 1:return e=T(e.type,!0),e;default:return""}}function P(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case X:return"Fragment";case H:return"Portal";case re:return"Profiler";case ae:return"StrictMode";case Q:return"Suspense";case xe:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case te:return(e.displayName||"Context")+".Consumer";case se:return(e._context.displayName||"Context")+".Provider";case le:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case V:return t=e.displayName||null,t!==null?t:P(e.type)||"Memo";case ce:t=e._payload,e=e._init;try{return P(e(t))}catch{}}return null}function S(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return P(t);case 8:return t===ae?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function J(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function pe(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function be(e){var t=pe(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var s=r.get,c=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(u){o=""+u,c.call(this,u)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return o},setValue:function(u){o=""+u},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function me(e){e._valueTracker||(e._valueTracker=be(e))}function De(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),o="";return e&&(o=pe(e)?e.checked?"true":"false":e.value),e=o,e!==r?(t.setValue(e),!0):!1}function qe(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ve(e,t){var r=t.checked;return K({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function D(e,t){var r=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;r=J(t.value!=null?t.value:r),e._wrapperState={initialChecked:o,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ke(e,t){t=t.checked,t!=null&&Y(e,"checked",t,!1)}function Ce(e,t){ke(e,t);var r=J(t.value),o=t.type;if(r!=null)o==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?st(e,t.type,r):t.hasOwnProperty("defaultValue")&&st(e,t.type,J(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ee(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function st(e,t,r){(t!=="number"||qe(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var at=Array.isArray;function Nn(e,t,r,o){if(e=e.options,t){t={};for(var s=0;s<r.length;s++)t["$"+r[s]]=!0;for(r=0;r<e.length;r++)s=t.hasOwnProperty("$"+e[r].value),e[r].selected!==s&&(e[r].selected=s),s&&o&&(e[r].defaultSelected=!0)}else{for(r=""+J(r),t=null,s=0;s<e.length;s++){if(e[s].value===r){e[s].selected=!0,o&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function si(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(a(91));return K({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function ua(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(a(92));if(at(r)){if(1<r.length)throw Error(a(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:J(r)}}function pa(e,t){var r=J(t.value),o=J(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),o!=null&&(e.defaultValue=""+o)}function ha(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function fa(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ai(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?fa(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Br,ga=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,o,s){MSApp.execUnsafeLocalFunction(function(){return e(t,r,o,s)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Br=Br||document.createElement("div"),Br.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Br.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function er(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var tr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},zd=["Webkit","ms","Moz","O"];Object.keys(tr).forEach(function(e){zd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),tr[t]=tr[e]})});function ma(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||tr.hasOwnProperty(e)&&tr[e]?(""+t).trim():t+"px"}function xa(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var o=r.indexOf("--")===0,s=ma(r,t[r],o);r==="float"&&(r="cssFloat"),o?e.setProperty(r,s):e[r]=s}}var Ld=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function li(e,t){if(t){if(Ld[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(a(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(a(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(a(61))}if(t.style!=null&&typeof t.style!="object")throw Error(a(62))}}function ci(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var di=null;function ui(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var pi=null,In=null,En=null;function _a(e){if(e=kr(e)){if(typeof pi!="function")throw Error(a(280));var t=e.stateNode;t&&(t=po(t),pi(e.stateNode,e.type,t))}}function wa(e){In?En?En.push(e):En=[e]:In=e}function ba(){if(In){var e=In,t=En;if(En=In=null,_a(e),t)for(e=0;e<t.length;e++)_a(t[e])}}function ya(e,t){return e(t)}function va(){}var hi=!1;function ka(e,t,r){if(hi)return e(t,r);hi=!0;try{return ya(e,t,r)}finally{hi=!1,(In!==null||En!==null)&&(va(),ba())}}function nr(e,t){var r=e.stateNode;if(r===null)return null;var o=po(r);if(o===null)return null;r=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(a(231,t,typeof r));return r}var fi=!1;if(b)try{var rr={};Object.defineProperty(rr,"passive",{get:function(){fi=!0}}),window.addEventListener("test",rr,rr),window.removeEventListener("test",rr,rr)}catch{fi=!1}function Rd(e,t,r,o,s,c,u,g,y){var L=Array.prototype.slice.call(arguments,3);try{t.apply(r,L)}catch(Z){this.onError(Z)}}var or=!1,$r=null,Vr=!1,gi=null,Md={onError:function(e){or=!0,$r=e}};function Dd(e,t,r,o,s,c,u,g,y){or=!1,$r=null,Rd.apply(Md,arguments)}function Pd(e,t,r,o,s,c,u,g,y){if(Dd.apply(this,arguments),or){if(or){var L=$r;or=!1,$r=null}else throw Error(a(198));Vr||(Vr=!0,gi=L)}}function pn(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function ja(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Sa(e){if(pn(e)!==e)throw Error(a(188))}function Wd(e){var t=e.alternate;if(!t){if(t=pn(e),t===null)throw Error(a(188));return t!==e?null:e}for(var r=e,o=t;;){var s=r.return;if(s===null)break;var c=s.alternate;if(c===null){if(o=s.return,o!==null){r=o;continue}break}if(s.child===c.child){for(c=s.child;c;){if(c===r)return Sa(s),e;if(c===o)return Sa(s),t;c=c.sibling}throw Error(a(188))}if(r.return!==o.return)r=s,o=c;else{for(var u=!1,g=s.child;g;){if(g===r){u=!0,r=s,o=c;break}if(g===o){u=!0,o=s,r=c;break}g=g.sibling}if(!u){for(g=c.child;g;){if(g===r){u=!0,r=c,o=s;break}if(g===o){u=!0,o=c,r=s;break}g=g.sibling}if(!u)throw Error(a(189))}}if(r.alternate!==o)throw Error(a(190))}if(r.tag!==3)throw Error(a(188));return r.stateNode.current===r?e:t}function Ca(e){return e=Wd(e),e!==null?Na(e):null}function Na(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Na(e);if(t!==null)return t;e=e.sibling}return null}var Ia=i.unstable_scheduleCallback,Ea=i.unstable_cancelCallback,Fd=i.unstable_shouldYield,Od=i.unstable_requestPaint,Ue=i.unstable_now,Ud=i.unstable_getCurrentPriorityLevel,mi=i.unstable_ImmediatePriority,Aa=i.unstable_UserBlockingPriority,Kr=i.unstable_NormalPriority,Bd=i.unstable_LowPriority,Ta=i.unstable_IdlePriority,Gr=null,zt=null;function $d(e){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(Gr,e,void 0,(e.current.flags&128)===128)}catch{}}var St=Math.clz32?Math.clz32:Gd,Vd=Math.log,Kd=Math.LN2;function Gd(e){return e>>>=0,e===0?32:31-(Vd(e)/Kd|0)|0}var Hr=64,Qr=4194304;function ir(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Xr(e,t){var r=e.pendingLanes;if(r===0)return 0;var o=0,s=e.suspendedLanes,c=e.pingedLanes,u=r&268435455;if(u!==0){var g=u&~s;g!==0?o=ir(g):(c&=u,c!==0&&(o=ir(c)))}else u=r&~s,u!==0?o=ir(u):c!==0&&(o=ir(c));if(o===0)return 0;if(t!==0&&t!==o&&(t&s)===0&&(s=o&-o,c=t&-t,s>=c||s===16&&(c&4194240)!==0))return t;if((o&4)!==0&&(o|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)r=31-St(t),s=1<<r,o|=e[r],t&=~s;return o}function Hd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Qd(e,t){for(var r=e.suspendedLanes,o=e.pingedLanes,s=e.expirationTimes,c=e.pendingLanes;0<c;){var u=31-St(c),g=1<<u,y=s[u];y===-1?((g&r)===0||(g&o)!==0)&&(s[u]=Hd(g,t)):y<=t&&(e.expiredLanes|=g),c&=~g}}function xi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function za(){var e=Hr;return Hr<<=1,(Hr&4194240)===0&&(Hr=64),e}function _i(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function sr(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-St(t),e[t]=r}function Xd(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<r;){var s=31-St(r),c=1<<s;t[s]=0,o[s]=-1,e[s]=-1,r&=~c}}function wi(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var o=31-St(r),s=1<<o;s&t|e[o]&t&&(e[o]|=t),r&=~s}}var Ae=0;function La(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Ra,bi,Ma,Da,Pa,yi=!1,qr=[],Kt=null,Gt=null,Ht=null,ar=new Map,lr=new Map,Qt=[],qd="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Wa(e,t){switch(e){case"focusin":case"focusout":Kt=null;break;case"dragenter":case"dragleave":Gt=null;break;case"mouseover":case"mouseout":Ht=null;break;case"pointerover":case"pointerout":ar.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":lr.delete(t.pointerId)}}function cr(e,t,r,o,s,c){return e===null||e.nativeEvent!==c?(e={blockedOn:t,domEventName:r,eventSystemFlags:o,nativeEvent:c,targetContainers:[s]},t!==null&&(t=kr(t),t!==null&&bi(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function Yd(e,t,r,o,s){switch(t){case"focusin":return Kt=cr(Kt,e,t,r,o,s),!0;case"dragenter":return Gt=cr(Gt,e,t,r,o,s),!0;case"mouseover":return Ht=cr(Ht,e,t,r,o,s),!0;case"pointerover":var c=s.pointerId;return ar.set(c,cr(ar.get(c)||null,e,t,r,o,s)),!0;case"gotpointercapture":return c=s.pointerId,lr.set(c,cr(lr.get(c)||null,e,t,r,o,s)),!0}return!1}function Fa(e){var t=hn(e.target);if(t!==null){var r=pn(t);if(r!==null){if(t=r.tag,t===13){if(t=ja(r),t!==null){e.blockedOn=t,Pa(e.priority,function(){Ma(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Yr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=ki(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var o=new r.constructor(r.type,r);di=o,r.target.dispatchEvent(o),di=null}else return t=kr(r),t!==null&&bi(t),e.blockedOn=r,!1;t.shift()}return!0}function Oa(e,t,r){Yr(e)&&r.delete(t)}function Jd(){yi=!1,Kt!==null&&Yr(Kt)&&(Kt=null),Gt!==null&&Yr(Gt)&&(Gt=null),Ht!==null&&Yr(Ht)&&(Ht=null),ar.forEach(Oa),lr.forEach(Oa)}function dr(e,t){e.blockedOn===t&&(e.blockedOn=null,yi||(yi=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,Jd)))}function ur(e){function t(s){return dr(s,e)}if(0<qr.length){dr(qr[0],e);for(var r=1;r<qr.length;r++){var o=qr[r];o.blockedOn===e&&(o.blockedOn=null)}}for(Kt!==null&&dr(Kt,e),Gt!==null&&dr(Gt,e),Ht!==null&&dr(Ht,e),ar.forEach(t),lr.forEach(t),r=0;r<Qt.length;r++)o=Qt[r],o.blockedOn===e&&(o.blockedOn=null);for(;0<Qt.length&&(r=Qt[0],r.blockedOn===null);)Fa(r),r.blockedOn===null&&Qt.shift()}var An=U.ReactCurrentBatchConfig,Jr=!0;function Zd(e,t,r,o){var s=Ae,c=An.transition;An.transition=null;try{Ae=1,vi(e,t,r,o)}finally{Ae=s,An.transition=c}}function eu(e,t,r,o){var s=Ae,c=An.transition;An.transition=null;try{Ae=4,vi(e,t,r,o)}finally{Ae=s,An.transition=c}}function vi(e,t,r,o){if(Jr){var s=ki(e,t,r,o);if(s===null)Oi(e,t,o,Zr,r),Wa(e,o);else if(Yd(s,e,t,r,o))o.stopPropagation();else if(Wa(e,o),t&4&&-1<qd.indexOf(e)){for(;s!==null;){var c=kr(s);if(c!==null&&Ra(c),c=ki(e,t,r,o),c===null&&Oi(e,t,o,Zr,r),c===s)break;s=c}s!==null&&o.stopPropagation()}else Oi(e,t,o,null,r)}}var Zr=null;function ki(e,t,r,o){if(Zr=null,e=ui(o),e=hn(e),e!==null)if(t=pn(e),t===null)e=null;else if(r=t.tag,r===13){if(e=ja(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Zr=e,null}function Ua(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ud()){case mi:return 1;case Aa:return 4;case Kr:case Bd:return 16;case Ta:return 536870912;default:return 16}default:return 16}}var Xt=null,ji=null,eo=null;function Ba(){if(eo)return eo;var e,t=ji,r=t.length,o,s="value"in Xt?Xt.value:Xt.textContent,c=s.length;for(e=0;e<r&&t[e]===s[e];e++);var u=r-e;for(o=1;o<=u&&t[r-o]===s[c-o];o++);return eo=s.slice(e,1<o?1-o:void 0)}function to(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function no(){return!0}function $a(){return!1}function ft(e){function t(r,o,s,c,u){this._reactName=r,this._targetInst=s,this.type=o,this.nativeEvent=c,this.target=u,this.currentTarget=null;for(var g in e)e.hasOwnProperty(g)&&(r=e[g],this[g]=r?r(c):c[g]);return this.isDefaultPrevented=(c.defaultPrevented!=null?c.defaultPrevented:c.returnValue===!1)?no:$a,this.isPropagationStopped=$a,this}return K(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=no)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=no)},persist:function(){},isPersistent:no}),t}var Tn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Si=ft(Tn),pr=K({},Tn,{view:0,detail:0}),tu=ft(pr),Ci,Ni,hr,ro=K({},pr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ei,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==hr&&(hr&&e.type==="mousemove"?(Ci=e.screenX-hr.screenX,Ni=e.screenY-hr.screenY):Ni=Ci=0,hr=e),Ci)},movementY:function(e){return"movementY"in e?e.movementY:Ni}}),Va=ft(ro),nu=K({},ro,{dataTransfer:0}),ru=ft(nu),ou=K({},pr,{relatedTarget:0}),Ii=ft(ou),iu=K({},Tn,{animationName:0,elapsedTime:0,pseudoElement:0}),su=ft(iu),au=K({},Tn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),lu=ft(au),cu=K({},Tn,{data:0}),Ka=ft(cu),du={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},uu={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},pu={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function hu(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=pu[e])?!!t[e]:!1}function Ei(){return hu}var fu=K({},pr,{key:function(e){if(e.key){var t=du[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=to(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?uu[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ei,charCode:function(e){return e.type==="keypress"?to(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?to(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),gu=ft(fu),mu=K({},ro,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ga=ft(mu),xu=K({},pr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ei}),_u=ft(xu),wu=K({},Tn,{propertyName:0,elapsedTime:0,pseudoElement:0}),bu=ft(wu),yu=K({},ro,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),vu=ft(yu),ku=[9,13,27,32],Ai=b&&"CompositionEvent"in window,fr=null;b&&"documentMode"in document&&(fr=document.documentMode);var ju=b&&"TextEvent"in window&&!fr,Ha=b&&(!Ai||fr&&8<fr&&11>=fr),Qa=" ",Xa=!1;function qa(e,t){switch(e){case"keyup":return ku.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ya(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var zn=!1;function Su(e,t){switch(e){case"compositionend":return Ya(t);case"keypress":return t.which!==32?null:(Xa=!0,Qa);case"textInput":return e=t.data,e===Qa&&Xa?null:e;default:return null}}function Cu(e,t){if(zn)return e==="compositionend"||!Ai&&qa(e,t)?(e=Ba(),eo=ji=Xt=null,zn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ha&&t.locale!=="ko"?null:t.data;default:return null}}var Nu={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ja(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Nu[e.type]:t==="textarea"}function Za(e,t,r,o){wa(o),t=lo(t,"onChange"),0<t.length&&(r=new Si("onChange","change",null,r,o),e.push({event:r,listeners:t}))}var gr=null,mr=null;function Iu(e){xl(e,0)}function oo(e){var t=Pn(e);if(De(t))return e}function Eu(e,t){if(e==="change")return t}var el=!1;if(b){var Ti;if(b){var zi="oninput"in document;if(!zi){var tl=document.createElement("div");tl.setAttribute("oninput","return;"),zi=typeof tl.oninput=="function"}Ti=zi}else Ti=!1;el=Ti&&(!document.documentMode||9<document.documentMode)}function nl(){gr&&(gr.detachEvent("onpropertychange",rl),mr=gr=null)}function rl(e){if(e.propertyName==="value"&&oo(mr)){var t=[];Za(t,mr,e,ui(e)),ka(Iu,t)}}function Au(e,t,r){e==="focusin"?(nl(),gr=t,mr=r,gr.attachEvent("onpropertychange",rl)):e==="focusout"&&nl()}function Tu(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return oo(mr)}function zu(e,t){if(e==="click")return oo(t)}function Lu(e,t){if(e==="input"||e==="change")return oo(t)}function Ru(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ct=typeof Object.is=="function"?Object.is:Ru;function xr(e,t){if(Ct(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),o=Object.keys(t);if(r.length!==o.length)return!1;for(o=0;o<r.length;o++){var s=r[o];if(!k.call(t,s)||!Ct(e[s],t[s]))return!1}return!0}function ol(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function il(e,t){var r=ol(e);e=0;for(var o;r;){if(r.nodeType===3){if(o=e+r.textContent.length,e<=t&&o>=t)return{node:r,offset:t-e};e=o}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=ol(r)}}function sl(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?sl(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function al(){for(var e=window,t=qe();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=qe(e.document)}return t}function Li(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Mu(e){var t=al(),r=e.focusedElem,o=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&sl(r.ownerDocument.documentElement,r)){if(o!==null&&Li(r)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=r.textContent.length,c=Math.min(o.start,s);o=o.end===void 0?c:Math.min(o.end,s),!e.extend&&c>o&&(s=o,o=c,c=s),s=il(r,c);var u=il(r,o);s&&u&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==u.node||e.focusOffset!==u.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),c>o?(e.addRange(t),e.extend(u.node,u.offset)):(t.setEnd(u.node,u.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Du=b&&"documentMode"in document&&11>=document.documentMode,Ln=null,Ri=null,_r=null,Mi=!1;function ll(e,t,r){var o=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Mi||Ln==null||Ln!==qe(o)||(o=Ln,"selectionStart"in o&&Li(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),_r&&xr(_r,o)||(_r=o,o=lo(Ri,"onSelect"),0<o.length&&(t=new Si("onSelect","select",null,t,r),e.push({event:t,listeners:o}),t.target=Ln)))}function io(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Rn={animationend:io("Animation","AnimationEnd"),animationiteration:io("Animation","AnimationIteration"),animationstart:io("Animation","AnimationStart"),transitionend:io("Transition","TransitionEnd")},Di={},cl={};b&&(cl=document.createElement("div").style,"AnimationEvent"in window||(delete Rn.animationend.animation,delete Rn.animationiteration.animation,delete Rn.animationstart.animation),"TransitionEvent"in window||delete Rn.transitionend.transition);function so(e){if(Di[e])return Di[e];if(!Rn[e])return e;var t=Rn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in cl)return Di[e]=t[r];return e}var dl=so("animationend"),ul=so("animationiteration"),pl=so("animationstart"),hl=so("transitionend"),fl=new Map,gl="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function qt(e,t){fl.set(e,t),h(t,[e])}for(var Pi=0;Pi<gl.length;Pi++){var Wi=gl[Pi],Pu=Wi.toLowerCase(),Wu=Wi[0].toUpperCase()+Wi.slice(1);qt(Pu,"on"+Wu)}qt(dl,"onAnimationEnd"),qt(ul,"onAnimationIteration"),qt(pl,"onAnimationStart"),qt("dblclick","onDoubleClick"),qt("focusin","onFocus"),qt("focusout","onBlur"),qt(hl,"onTransitionEnd"),x("onMouseEnter",["mouseout","mouseover"]),x("onMouseLeave",["mouseout","mouseover"]),x("onPointerEnter",["pointerout","pointerover"]),x("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var wr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Fu=new Set("cancel close invalid load scroll toggle".split(" ").concat(wr));function ml(e,t,r){var o=e.type||"unknown-event";e.currentTarget=r,Pd(o,t,void 0,e),e.currentTarget=null}function xl(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var o=e[r],s=o.event;o=o.listeners;e:{var c=void 0;if(t)for(var u=o.length-1;0<=u;u--){var g=o[u],y=g.instance,L=g.currentTarget;if(g=g.listener,y!==c&&s.isPropagationStopped())break e;ml(s,g,L),c=y}else for(u=0;u<o.length;u++){if(g=o[u],y=g.instance,L=g.currentTarget,g=g.listener,y!==c&&s.isPropagationStopped())break e;ml(s,g,L),c=y}}}if(Vr)throw e=gi,Vr=!1,gi=null,e}function Le(e,t){var r=t[Gi];r===void 0&&(r=t[Gi]=new Set);var o=e+"__bubble";r.has(o)||(_l(t,e,2,!1),r.add(o))}function Fi(e,t,r){var o=0;t&&(o|=4),_l(r,e,o,t)}var ao="_reactListening"+Math.random().toString(36).slice(2);function br(e){if(!e[ao]){e[ao]=!0,d.forEach(function(r){r!=="selectionchange"&&(Fu.has(r)||Fi(r,!1,e),Fi(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ao]||(t[ao]=!0,Fi("selectionchange",!1,t))}}function _l(e,t,r,o){switch(Ua(t)){case 1:var s=Zd;break;case 4:s=eu;break;default:s=vi}r=s.bind(null,t,r,e),s=void 0,!fi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),o?s!==void 0?e.addEventListener(t,r,{capture:!0,passive:s}):e.addEventListener(t,r,!0):s!==void 0?e.addEventListener(t,r,{passive:s}):e.addEventListener(t,r,!1)}function Oi(e,t,r,o,s){var c=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var u=o.tag;if(u===3||u===4){var g=o.stateNode.containerInfo;if(g===s||g.nodeType===8&&g.parentNode===s)break;if(u===4)for(u=o.return;u!==null;){var y=u.tag;if((y===3||y===4)&&(y=u.stateNode.containerInfo,y===s||y.nodeType===8&&y.parentNode===s))return;u=u.return}for(;g!==null;){if(u=hn(g),u===null)return;if(y=u.tag,y===5||y===6){o=c=u;continue e}g=g.parentNode}}o=o.return}ka(function(){var L=c,Z=ui(r),ne=[];e:{var q=fl.get(e);if(q!==void 0){var de=Si,he=e;switch(e){case"keypress":if(to(r)===0)break e;case"keydown":case"keyup":de=gu;break;case"focusin":he="focus",de=Ii;break;case"focusout":he="blur",de=Ii;break;case"beforeblur":case"afterblur":de=Ii;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":de=Va;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":de=ru;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":de=_u;break;case dl:case ul:case pl:de=su;break;case hl:de=bu;break;case"scroll":de=tu;break;case"wheel":de=vu;break;case"copy":case"cut":case"paste":de=lu;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":de=Ga}var fe=(t&4)!==0,Be=!fe&&e==="scroll",C=fe?q!==null?q+"Capture":null:q;fe=[];for(var j=L,A;j!==null;){A=j;var oe=A.stateNode;if(A.tag===5&&oe!==null&&(A=oe,C!==null&&(oe=nr(j,C),oe!=null&&fe.push(yr(j,oe,A)))),Be)break;j=j.return}0<fe.length&&(q=new de(q,he,null,r,Z),ne.push({event:q,listeners:fe}))}}if((t&7)===0){e:{if(q=e==="mouseover"||e==="pointerover",de=e==="mouseout"||e==="pointerout",q&&r!==di&&(he=r.relatedTarget||r.fromElement)&&(hn(he)||he[Pt]))break e;if((de||q)&&(q=Z.window===Z?Z:(q=Z.ownerDocument)?q.defaultView||q.parentWindow:window,de?(he=r.relatedTarget||r.toElement,de=L,he=he?hn(he):null,he!==null&&(Be=pn(he),he!==Be||he.tag!==5&&he.tag!==6)&&(he=null)):(de=null,he=L),de!==he)){if(fe=Va,oe="onMouseLeave",C="onMouseEnter",j="mouse",(e==="pointerout"||e==="pointerover")&&(fe=Ga,oe="onPointerLeave",C="onPointerEnter",j="pointer"),Be=de==null?q:Pn(de),A=he==null?q:Pn(he),q=new fe(oe,j+"leave",de,r,Z),q.target=Be,q.relatedTarget=A,oe=null,hn(Z)===L&&(fe=new fe(C,j+"enter",he,r,Z),fe.target=A,fe.relatedTarget=Be,oe=fe),Be=oe,de&&he)t:{for(fe=de,C=he,j=0,A=fe;A;A=Mn(A))j++;for(A=0,oe=C;oe;oe=Mn(oe))A++;for(;0<j-A;)fe=Mn(fe),j--;for(;0<A-j;)C=Mn(C),A--;for(;j--;){if(fe===C||C!==null&&fe===C.alternate)break t;fe=Mn(fe),C=Mn(C)}fe=null}else fe=null;de!==null&&wl(ne,q,de,fe,!1),he!==null&&Be!==null&&wl(ne,Be,he,fe,!0)}}e:{if(q=L?Pn(L):window,de=q.nodeName&&q.nodeName.toLowerCase(),de==="select"||de==="input"&&q.type==="file")var ge=Eu;else if(Ja(q))if(el)ge=Lu;else{ge=Tu;var _e=Au}else(de=q.nodeName)&&de.toLowerCase()==="input"&&(q.type==="checkbox"||q.type==="radio")&&(ge=zu);if(ge&&(ge=ge(e,L))){Za(ne,ge,r,Z);break e}_e&&_e(e,q,L),e==="focusout"&&(_e=q._wrapperState)&&_e.controlled&&q.type==="number"&&st(q,"number",q.value)}switch(_e=L?Pn(L):window,e){case"focusin":(Ja(_e)||_e.contentEditable==="true")&&(Ln=_e,Ri=L,_r=null);break;case"focusout":_r=Ri=Ln=null;break;case"mousedown":Mi=!0;break;case"contextmenu":case"mouseup":case"dragend":Mi=!1,ll(ne,r,Z);break;case"selectionchange":if(Du)break;case"keydown":case"keyup":ll(ne,r,Z)}var we;if(Ai)e:{switch(e){case"compositionstart":var ye="onCompositionStart";break e;case"compositionend":ye="onCompositionEnd";break e;case"compositionupdate":ye="onCompositionUpdate";break e}ye=void 0}else zn?qa(e,r)&&(ye="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(ye="onCompositionStart");ye&&(Ha&&r.locale!=="ko"&&(zn||ye!=="onCompositionStart"?ye==="onCompositionEnd"&&zn&&(we=Ba()):(Xt=Z,ji="value"in Xt?Xt.value:Xt.textContent,zn=!0)),_e=lo(L,ye),0<_e.length&&(ye=new Ka(ye,e,null,r,Z),ne.push({event:ye,listeners:_e}),we?ye.data=we:(we=Ya(r),we!==null&&(ye.data=we)))),(we=ju?Su(e,r):Cu(e,r))&&(L=lo(L,"onBeforeInput"),0<L.length&&(Z=new Ka("onBeforeInput","beforeinput",null,r,Z),ne.push({event:Z,listeners:L}),Z.data=we))}xl(ne,t)})}function yr(e,t,r){return{instance:e,listener:t,currentTarget:r}}function lo(e,t){for(var r=t+"Capture",o=[];e!==null;){var s=e,c=s.stateNode;s.tag===5&&c!==null&&(s=c,c=nr(e,r),c!=null&&o.unshift(yr(e,c,s)),c=nr(e,t),c!=null&&o.push(yr(e,c,s))),e=e.return}return o}function Mn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function wl(e,t,r,o,s){for(var c=t._reactName,u=[];r!==null&&r!==o;){var g=r,y=g.alternate,L=g.stateNode;if(y!==null&&y===o)break;g.tag===5&&L!==null&&(g=L,s?(y=nr(r,c),y!=null&&u.unshift(yr(r,y,g))):s||(y=nr(r,c),y!=null&&u.push(yr(r,y,g)))),r=r.return}u.length!==0&&e.push({event:t,listeners:u})}var Ou=/\r\n?/g,Uu=/\u0000|\uFFFD/g;function bl(e){return(typeof e=="string"?e:""+e).replace(Ou,`
`).replace(Uu,"")}function co(e,t,r){if(t=bl(t),bl(e)!==t&&r)throw Error(a(425))}function uo(){}var Ui=null,Bi=null;function $i(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Vi=typeof setTimeout=="function"?setTimeout:void 0,Bu=typeof clearTimeout=="function"?clearTimeout:void 0,yl=typeof Promise=="function"?Promise:void 0,$u=typeof queueMicrotask=="function"?queueMicrotask:typeof yl<"u"?function(e){return yl.resolve(null).then(e).catch(Vu)}:Vi;function Vu(e){setTimeout(function(){throw e})}function Ki(e,t){var r=t,o=0;do{var s=r.nextSibling;if(e.removeChild(r),s&&s.nodeType===8)if(r=s.data,r==="/$"){if(o===0){e.removeChild(s),ur(t);return}o--}else r!=="$"&&r!=="$?"&&r!=="$!"||o++;r=s}while(r);ur(t)}function Yt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function vl(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var Dn=Math.random().toString(36).slice(2),Lt="__reactFiber$"+Dn,vr="__reactProps$"+Dn,Pt="__reactContainer$"+Dn,Gi="__reactEvents$"+Dn,Ku="__reactListeners$"+Dn,Gu="__reactHandles$"+Dn;function hn(e){var t=e[Lt];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Pt]||r[Lt]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=vl(e);e!==null;){if(r=e[Lt])return r;e=vl(e)}return t}e=r,r=e.parentNode}return null}function kr(e){return e=e[Lt]||e[Pt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Pn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(a(33))}function po(e){return e[vr]||null}var Hi=[],Wn=-1;function Jt(e){return{current:e}}function Re(e){0>Wn||(e.current=Hi[Wn],Hi[Wn]=null,Wn--)}function ze(e,t){Wn++,Hi[Wn]=e.current,e.current=t}var Zt={},Ze=Jt(Zt),lt=Jt(!1),fn=Zt;function Fn(e,t){var r=e.type.contextTypes;if(!r)return Zt;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var s={},c;for(c in r)s[c]=t[c];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function ct(e){return e=e.childContextTypes,e!=null}function ho(){Re(lt),Re(Ze)}function kl(e,t,r){if(Ze.current!==Zt)throw Error(a(168));ze(Ze,t),ze(lt,r)}function jl(e,t,r){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return r;o=o.getChildContext();for(var s in o)if(!(s in t))throw Error(a(108,S(e)||"Unknown",s));return K({},r,o)}function fo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Zt,fn=Ze.current,ze(Ze,e),ze(lt,lt.current),!0}function Sl(e,t,r){var o=e.stateNode;if(!o)throw Error(a(169));r?(e=jl(e,t,fn),o.__reactInternalMemoizedMergedChildContext=e,Re(lt),Re(Ze),ze(Ze,e)):Re(lt),ze(lt,r)}var Wt=null,go=!1,Qi=!1;function Cl(e){Wt===null?Wt=[e]:Wt.push(e)}function Hu(e){go=!0,Cl(e)}function en(){if(!Qi&&Wt!==null){Qi=!0;var e=0,t=Ae;try{var r=Wt;for(Ae=1;e<r.length;e++){var o=r[e];do o=o(!0);while(o!==null)}Wt=null,go=!1}catch(s){throw Wt!==null&&(Wt=Wt.slice(e+1)),Ia(mi,en),s}finally{Ae=t,Qi=!1}}return null}var On=[],Un=0,mo=null,xo=0,_t=[],wt=0,gn=null,Ft=1,Ot="";function mn(e,t){On[Un++]=xo,On[Un++]=mo,mo=e,xo=t}function Nl(e,t,r){_t[wt++]=Ft,_t[wt++]=Ot,_t[wt++]=gn,gn=e;var o=Ft;e=Ot;var s=32-St(o)-1;o&=~(1<<s),r+=1;var c=32-St(t)+s;if(30<c){var u=s-s%5;c=(o&(1<<u)-1).toString(32),o>>=u,s-=u,Ft=1<<32-St(t)+s|r<<s|o,Ot=c+e}else Ft=1<<c|r<<s|o,Ot=e}function Xi(e){e.return!==null&&(mn(e,1),Nl(e,1,0))}function qi(e){for(;e===mo;)mo=On[--Un],On[Un]=null,xo=On[--Un],On[Un]=null;for(;e===gn;)gn=_t[--wt],_t[wt]=null,Ot=_t[--wt],_t[wt]=null,Ft=_t[--wt],_t[wt]=null}var gt=null,mt=null,Me=!1,Nt=null;function Il(e,t){var r=kt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function El(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,gt=e,mt=Yt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,gt=e,mt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=gn!==null?{id:Ft,overflow:Ot}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=kt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,gt=e,mt=null,!0):!1;default:return!1}}function Yi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ji(e){if(Me){var t=mt;if(t){var r=t;if(!El(e,t)){if(Yi(e))throw Error(a(418));t=Yt(r.nextSibling);var o=gt;t&&El(e,t)?Il(o,r):(e.flags=e.flags&-4097|2,Me=!1,gt=e)}}else{if(Yi(e))throw Error(a(418));e.flags=e.flags&-4097|2,Me=!1,gt=e}}}function Al(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;gt=e}function _o(e){if(e!==gt)return!1;if(!Me)return Al(e),Me=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!$i(e.type,e.memoizedProps)),t&&(t=mt)){if(Yi(e))throw Tl(),Error(a(418));for(;t;)Il(e,t),t=Yt(t.nextSibling)}if(Al(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(a(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){mt=Yt(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}mt=null}}else mt=gt?Yt(e.stateNode.nextSibling):null;return!0}function Tl(){for(var e=mt;e;)e=Yt(e.nextSibling)}function Bn(){mt=gt=null,Me=!1}function Zi(e){Nt===null?Nt=[e]:Nt.push(e)}var Qu=U.ReactCurrentBatchConfig;function jr(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(a(309));var o=r.stateNode}if(!o)throw Error(a(147,e));var s=o,c=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===c?t.ref:(t=function(u){var g=s.refs;u===null?delete g[c]:g[c]=u},t._stringRef=c,t)}if(typeof e!="string")throw Error(a(284));if(!r._owner)throw Error(a(290,e))}return e}function wo(e,t){throw e=Object.prototype.toString.call(t),Error(a(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function zl(e){var t=e._init;return t(e._payload)}function Ll(e){function t(C,j){if(e){var A=C.deletions;A===null?(C.deletions=[j],C.flags|=16):A.push(j)}}function r(C,j){if(!e)return null;for(;j!==null;)t(C,j),j=j.sibling;return null}function o(C,j){for(C=new Map;j!==null;)j.key!==null?C.set(j.key,j):C.set(j.index,j),j=j.sibling;return C}function s(C,j){return C=cn(C,j),C.index=0,C.sibling=null,C}function c(C,j,A){return C.index=A,e?(A=C.alternate,A!==null?(A=A.index,A<j?(C.flags|=2,j):A):(C.flags|=2,j)):(C.flags|=1048576,j)}function u(C){return e&&C.alternate===null&&(C.flags|=2),C}function g(C,j,A,oe){return j===null||j.tag!==6?(j=Vs(A,C.mode,oe),j.return=C,j):(j=s(j,A),j.return=C,j)}function y(C,j,A,oe){var ge=A.type;return ge===X?Z(C,j,A.props.children,oe,A.key):j!==null&&(j.elementType===ge||typeof ge=="object"&&ge!==null&&ge.$$typeof===ce&&zl(ge)===j.type)?(oe=s(j,A.props),oe.ref=jr(C,j,A),oe.return=C,oe):(oe=$o(A.type,A.key,A.props,null,C.mode,oe),oe.ref=jr(C,j,A),oe.return=C,oe)}function L(C,j,A,oe){return j===null||j.tag!==4||j.stateNode.containerInfo!==A.containerInfo||j.stateNode.implementation!==A.implementation?(j=Ks(A,C.mode,oe),j.return=C,j):(j=s(j,A.children||[]),j.return=C,j)}function Z(C,j,A,oe,ge){return j===null||j.tag!==7?(j=jn(A,C.mode,oe,ge),j.return=C,j):(j=s(j,A),j.return=C,j)}function ne(C,j,A){if(typeof j=="string"&&j!==""||typeof j=="number")return j=Vs(""+j,C.mode,A),j.return=C,j;if(typeof j=="object"&&j!==null){switch(j.$$typeof){case ee:return A=$o(j.type,j.key,j.props,null,C.mode,A),A.ref=jr(C,null,j),A.return=C,A;case H:return j=Ks(j,C.mode,A),j.return=C,j;case ce:var oe=j._init;return ne(C,oe(j._payload),A)}if(at(j)||B(j))return j=jn(j,C.mode,A,null),j.return=C,j;wo(C,j)}return null}function q(C,j,A,oe){var ge=j!==null?j.key:null;if(typeof A=="string"&&A!==""||typeof A=="number")return ge!==null?null:g(C,j,""+A,oe);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case ee:return A.key===ge?y(C,j,A,oe):null;case H:return A.key===ge?L(C,j,A,oe):null;case ce:return ge=A._init,q(C,j,ge(A._payload),oe)}if(at(A)||B(A))return ge!==null?null:Z(C,j,A,oe,null);wo(C,A)}return null}function de(C,j,A,oe,ge){if(typeof oe=="string"&&oe!==""||typeof oe=="number")return C=C.get(A)||null,g(j,C,""+oe,ge);if(typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case ee:return C=C.get(oe.key===null?A:oe.key)||null,y(j,C,oe,ge);case H:return C=C.get(oe.key===null?A:oe.key)||null,L(j,C,oe,ge);case ce:var _e=oe._init;return de(C,j,A,_e(oe._payload),ge)}if(at(oe)||B(oe))return C=C.get(A)||null,Z(j,C,oe,ge,null);wo(j,oe)}return null}function he(C,j,A,oe){for(var ge=null,_e=null,we=j,ye=j=0,Xe=null;we!==null&&ye<A.length;ye++){we.index>ye?(Xe=we,we=null):Xe=we.sibling;var Ie=q(C,we,A[ye],oe);if(Ie===null){we===null&&(we=Xe);break}e&&we&&Ie.alternate===null&&t(C,we),j=c(Ie,j,ye),_e===null?ge=Ie:_e.sibling=Ie,_e=Ie,we=Xe}if(ye===A.length)return r(C,we),Me&&mn(C,ye),ge;if(we===null){for(;ye<A.length;ye++)we=ne(C,A[ye],oe),we!==null&&(j=c(we,j,ye),_e===null?ge=we:_e.sibling=we,_e=we);return Me&&mn(C,ye),ge}for(we=o(C,we);ye<A.length;ye++)Xe=de(we,C,ye,A[ye],oe),Xe!==null&&(e&&Xe.alternate!==null&&we.delete(Xe.key===null?ye:Xe.key),j=c(Xe,j,ye),_e===null?ge=Xe:_e.sibling=Xe,_e=Xe);return e&&we.forEach(function(dn){return t(C,dn)}),Me&&mn(C,ye),ge}function fe(C,j,A,oe){var ge=B(A);if(typeof ge!="function")throw Error(a(150));if(A=ge.call(A),A==null)throw Error(a(151));for(var _e=ge=null,we=j,ye=j=0,Xe=null,Ie=A.next();we!==null&&!Ie.done;ye++,Ie=A.next()){we.index>ye?(Xe=we,we=null):Xe=we.sibling;var dn=q(C,we,Ie.value,oe);if(dn===null){we===null&&(we=Xe);break}e&&we&&dn.alternate===null&&t(C,we),j=c(dn,j,ye),_e===null?ge=dn:_e.sibling=dn,_e=dn,we=Xe}if(Ie.done)return r(C,we),Me&&mn(C,ye),ge;if(we===null){for(;!Ie.done;ye++,Ie=A.next())Ie=ne(C,Ie.value,oe),Ie!==null&&(j=c(Ie,j,ye),_e===null?ge=Ie:_e.sibling=Ie,_e=Ie);return Me&&mn(C,ye),ge}for(we=o(C,we);!Ie.done;ye++,Ie=A.next())Ie=de(we,C,ye,Ie.value,oe),Ie!==null&&(e&&Ie.alternate!==null&&we.delete(Ie.key===null?ye:Ie.key),j=c(Ie,j,ye),_e===null?ge=Ie:_e.sibling=Ie,_e=Ie);return e&&we.forEach(function(Np){return t(C,Np)}),Me&&mn(C,ye),ge}function Be(C,j,A,oe){if(typeof A=="object"&&A!==null&&A.type===X&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case ee:e:{for(var ge=A.key,_e=j;_e!==null;){if(_e.key===ge){if(ge=A.type,ge===X){if(_e.tag===7){r(C,_e.sibling),j=s(_e,A.props.children),j.return=C,C=j;break e}}else if(_e.elementType===ge||typeof ge=="object"&&ge!==null&&ge.$$typeof===ce&&zl(ge)===_e.type){r(C,_e.sibling),j=s(_e,A.props),j.ref=jr(C,_e,A),j.return=C,C=j;break e}r(C,_e);break}else t(C,_e);_e=_e.sibling}A.type===X?(j=jn(A.props.children,C.mode,oe,A.key),j.return=C,C=j):(oe=$o(A.type,A.key,A.props,null,C.mode,oe),oe.ref=jr(C,j,A),oe.return=C,C=oe)}return u(C);case H:e:{for(_e=A.key;j!==null;){if(j.key===_e)if(j.tag===4&&j.stateNode.containerInfo===A.containerInfo&&j.stateNode.implementation===A.implementation){r(C,j.sibling),j=s(j,A.children||[]),j.return=C,C=j;break e}else{r(C,j);break}else t(C,j);j=j.sibling}j=Ks(A,C.mode,oe),j.return=C,C=j}return u(C);case ce:return _e=A._init,Be(C,j,_e(A._payload),oe)}if(at(A))return he(C,j,A,oe);if(B(A))return fe(C,j,A,oe);wo(C,A)}return typeof A=="string"&&A!==""||typeof A=="number"?(A=""+A,j!==null&&j.tag===6?(r(C,j.sibling),j=s(j,A),j.return=C,C=j):(r(C,j),j=Vs(A,C.mode,oe),j.return=C,C=j),u(C)):r(C,j)}return Be}var $n=Ll(!0),Rl=Ll(!1),bo=Jt(null),yo=null,Vn=null,es=null;function ts(){es=Vn=yo=null}function ns(e){var t=bo.current;Re(bo),e._currentValue=t}function rs(e,t,r){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===r)break;e=e.return}}function Kn(e,t){yo=e,es=Vn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(dt=!0),e.firstContext=null)}function bt(e){var t=e._currentValue;if(es!==e)if(e={context:e,memoizedValue:t,next:null},Vn===null){if(yo===null)throw Error(a(308));Vn=e,yo.dependencies={lanes:0,firstContext:e}}else Vn=Vn.next=e;return t}var xn=null;function os(e){xn===null?xn=[e]:xn.push(e)}function Ml(e,t,r,o){var s=t.interleaved;return s===null?(r.next=r,os(t)):(r.next=s.next,s.next=r),t.interleaved=r,Ut(e,o)}function Ut(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var tn=!1;function is(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Dl(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Bt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function nn(e,t,r){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ne&2)!==0){var s=o.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),o.pending=t,Ut(e,r)}return s=o.interleaved,s===null?(t.next=t,os(o)):(t.next=s.next,s.next=t),o.interleaved=t,Ut(e,r)}function vo(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,wi(e,r)}}function Pl(e,t){var r=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,r===o)){var s=null,c=null;if(r=r.firstBaseUpdate,r!==null){do{var u={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};c===null?s=c=u:c=c.next=u,r=r.next}while(r!==null);c===null?s=c=t:c=c.next=t}else s=c=t;r={baseState:o.baseState,firstBaseUpdate:s,lastBaseUpdate:c,shared:o.shared,effects:o.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function ko(e,t,r,o){var s=e.updateQueue;tn=!1;var c=s.firstBaseUpdate,u=s.lastBaseUpdate,g=s.shared.pending;if(g!==null){s.shared.pending=null;var y=g,L=y.next;y.next=null,u===null?c=L:u.next=L,u=y;var Z=e.alternate;Z!==null&&(Z=Z.updateQueue,g=Z.lastBaseUpdate,g!==u&&(g===null?Z.firstBaseUpdate=L:g.next=L,Z.lastBaseUpdate=y))}if(c!==null){var ne=s.baseState;u=0,Z=L=y=null,g=c;do{var q=g.lane,de=g.eventTime;if((o&q)===q){Z!==null&&(Z=Z.next={eventTime:de,lane:0,tag:g.tag,payload:g.payload,callback:g.callback,next:null});e:{var he=e,fe=g;switch(q=t,de=r,fe.tag){case 1:if(he=fe.payload,typeof he=="function"){ne=he.call(de,ne,q);break e}ne=he;break e;case 3:he.flags=he.flags&-65537|128;case 0:if(he=fe.payload,q=typeof he=="function"?he.call(de,ne,q):he,q==null)break e;ne=K({},ne,q);break e;case 2:tn=!0}}g.callback!==null&&g.lane!==0&&(e.flags|=64,q=s.effects,q===null?s.effects=[g]:q.push(g))}else de={eventTime:de,lane:q,tag:g.tag,payload:g.payload,callback:g.callback,next:null},Z===null?(L=Z=de,y=ne):Z=Z.next=de,u|=q;if(g=g.next,g===null){if(g=s.shared.pending,g===null)break;q=g,g=q.next,q.next=null,s.lastBaseUpdate=q,s.shared.pending=null}}while(!0);if(Z===null&&(y=ne),s.baseState=y,s.firstBaseUpdate=L,s.lastBaseUpdate=Z,t=s.shared.interleaved,t!==null){s=t;do u|=s.lane,s=s.next;while(s!==t)}else c===null&&(s.shared.lanes=0);bn|=u,e.lanes=u,e.memoizedState=ne}}function Wl(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],s=o.callback;if(s!==null){if(o.callback=null,o=r,typeof s!="function")throw Error(a(191,s));s.call(o)}}}var Sr={},Rt=Jt(Sr),Cr=Jt(Sr),Nr=Jt(Sr);function _n(e){if(e===Sr)throw Error(a(174));return e}function ss(e,t){switch(ze(Nr,t),ze(Cr,e),ze(Rt,Sr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ai(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ai(t,e)}Re(Rt),ze(Rt,t)}function Gn(){Re(Rt),Re(Cr),Re(Nr)}function Fl(e){_n(Nr.current);var t=_n(Rt.current),r=ai(t,e.type);t!==r&&(ze(Cr,e),ze(Rt,r))}function as(e){Cr.current===e&&(Re(Rt),Re(Cr))}var Pe=Jt(0);function jo(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ls=[];function cs(){for(var e=0;e<ls.length;e++)ls[e]._workInProgressVersionPrimary=null;ls.length=0}var So=U.ReactCurrentDispatcher,ds=U.ReactCurrentBatchConfig,wn=0,We=null,Ke=null,He=null,Co=!1,Ir=!1,Er=0,Xu=0;function et(){throw Error(a(321))}function us(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Ct(e[r],t[r]))return!1;return!0}function ps(e,t,r,o,s,c){if(wn=c,We=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,So.current=e===null||e.memoizedState===null?Zu:ep,e=r(o,s),Ir){c=0;do{if(Ir=!1,Er=0,25<=c)throw Error(a(301));c+=1,He=Ke=null,t.updateQueue=null,So.current=tp,e=r(o,s)}while(Ir)}if(So.current=Eo,t=Ke!==null&&Ke.next!==null,wn=0,He=Ke=We=null,Co=!1,t)throw Error(a(300));return e}function hs(){var e=Er!==0;return Er=0,e}function Mt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return He===null?We.memoizedState=He=e:He=He.next=e,He}function yt(){if(Ke===null){var e=We.alternate;e=e!==null?e.memoizedState:null}else e=Ke.next;var t=He===null?We.memoizedState:He.next;if(t!==null)He=t,Ke=e;else{if(e===null)throw Error(a(310));Ke=e,e={memoizedState:Ke.memoizedState,baseState:Ke.baseState,baseQueue:Ke.baseQueue,queue:Ke.queue,next:null},He===null?We.memoizedState=He=e:He=He.next=e}return He}function Ar(e,t){return typeof t=="function"?t(e):t}function fs(e){var t=yt(),r=t.queue;if(r===null)throw Error(a(311));r.lastRenderedReducer=e;var o=Ke,s=o.baseQueue,c=r.pending;if(c!==null){if(s!==null){var u=s.next;s.next=c.next,c.next=u}o.baseQueue=s=c,r.pending=null}if(s!==null){c=s.next,o=o.baseState;var g=u=null,y=null,L=c;do{var Z=L.lane;if((wn&Z)===Z)y!==null&&(y=y.next={lane:0,action:L.action,hasEagerState:L.hasEagerState,eagerState:L.eagerState,next:null}),o=L.hasEagerState?L.eagerState:e(o,L.action);else{var ne={lane:Z,action:L.action,hasEagerState:L.hasEagerState,eagerState:L.eagerState,next:null};y===null?(g=y=ne,u=o):y=y.next=ne,We.lanes|=Z,bn|=Z}L=L.next}while(L!==null&&L!==c);y===null?u=o:y.next=g,Ct(o,t.memoizedState)||(dt=!0),t.memoizedState=o,t.baseState=u,t.baseQueue=y,r.lastRenderedState=o}if(e=r.interleaved,e!==null){s=e;do c=s.lane,We.lanes|=c,bn|=c,s=s.next;while(s!==e)}else s===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function gs(e){var t=yt(),r=t.queue;if(r===null)throw Error(a(311));r.lastRenderedReducer=e;var o=r.dispatch,s=r.pending,c=t.memoizedState;if(s!==null){r.pending=null;var u=s=s.next;do c=e(c,u.action),u=u.next;while(u!==s);Ct(c,t.memoizedState)||(dt=!0),t.memoizedState=c,t.baseQueue===null&&(t.baseState=c),r.lastRenderedState=c}return[c,o]}function Ol(){}function Ul(e,t){var r=We,o=yt(),s=t(),c=!Ct(o.memoizedState,s);if(c&&(o.memoizedState=s,dt=!0),o=o.queue,ms(Vl.bind(null,r,o,e),[e]),o.getSnapshot!==t||c||He!==null&&He.memoizedState.tag&1){if(r.flags|=2048,Tr(9,$l.bind(null,r,o,s,t),void 0,null),Qe===null)throw Error(a(349));(wn&30)!==0||Bl(r,t,s)}return s}function Bl(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=We.updateQueue,t===null?(t={lastEffect:null,stores:null},We.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function $l(e,t,r,o){t.value=r,t.getSnapshot=o,Kl(t)&&Gl(e)}function Vl(e,t,r){return r(function(){Kl(t)&&Gl(e)})}function Kl(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Ct(e,r)}catch{return!0}}function Gl(e){var t=Ut(e,1);t!==null&&Tt(t,e,1,-1)}function Hl(e){var t=Mt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ar,lastRenderedState:e},t.queue=e,e=e.dispatch=Ju.bind(null,We,e),[t.memoizedState,e]}function Tr(e,t,r,o){return e={tag:e,create:t,destroy:r,deps:o,next:null},t=We.updateQueue,t===null?(t={lastEffect:null,stores:null},We.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(o=r.next,r.next=e,e.next=o,t.lastEffect=e)),e}function Ql(){return yt().memoizedState}function No(e,t,r,o){var s=Mt();We.flags|=e,s.memoizedState=Tr(1|t,r,void 0,o===void 0?null:o)}function Io(e,t,r,o){var s=yt();o=o===void 0?null:o;var c=void 0;if(Ke!==null){var u=Ke.memoizedState;if(c=u.destroy,o!==null&&us(o,u.deps)){s.memoizedState=Tr(t,r,c,o);return}}We.flags|=e,s.memoizedState=Tr(1|t,r,c,o)}function Xl(e,t){return No(8390656,8,e,t)}function ms(e,t){return Io(2048,8,e,t)}function ql(e,t){return Io(4,2,e,t)}function Yl(e,t){return Io(4,4,e,t)}function Jl(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Zl(e,t,r){return r=r!=null?r.concat([e]):null,Io(4,4,Jl.bind(null,t,e),r)}function xs(){}function ec(e,t){var r=yt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&us(t,o[1])?o[0]:(r.memoizedState=[e,t],e)}function tc(e,t){var r=yt();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&us(t,o[1])?o[0]:(e=e(),r.memoizedState=[e,t],e)}function nc(e,t,r){return(wn&21)===0?(e.baseState&&(e.baseState=!1,dt=!0),e.memoizedState=r):(Ct(r,t)||(r=za(),We.lanes|=r,bn|=r,e.baseState=!0),t)}function qu(e,t){var r=Ae;Ae=r!==0&&4>r?r:4,e(!0);var o=ds.transition;ds.transition={};try{e(!1),t()}finally{Ae=r,ds.transition=o}}function rc(){return yt().memoizedState}function Yu(e,t,r){var o=an(e);if(r={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null},oc(e))ic(t,r);else if(r=Ml(e,t,r,o),r!==null){var s=it();Tt(r,e,o,s),sc(r,t,o)}}function Ju(e,t,r){var o=an(e),s={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null};if(oc(e))ic(t,s);else{var c=e.alternate;if(e.lanes===0&&(c===null||c.lanes===0)&&(c=t.lastRenderedReducer,c!==null))try{var u=t.lastRenderedState,g=c(u,r);if(s.hasEagerState=!0,s.eagerState=g,Ct(g,u)){var y=t.interleaved;y===null?(s.next=s,os(t)):(s.next=y.next,y.next=s),t.interleaved=s;return}}catch{}r=Ml(e,t,s,o),r!==null&&(s=it(),Tt(r,e,o,s),sc(r,t,o))}}function oc(e){var t=e.alternate;return e===We||t!==null&&t===We}function ic(e,t){Ir=Co=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function sc(e,t,r){if((r&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,wi(e,r)}}var Eo={readContext:bt,useCallback:et,useContext:et,useEffect:et,useImperativeHandle:et,useInsertionEffect:et,useLayoutEffect:et,useMemo:et,useReducer:et,useRef:et,useState:et,useDebugValue:et,useDeferredValue:et,useTransition:et,useMutableSource:et,useSyncExternalStore:et,useId:et,unstable_isNewReconciler:!1},Zu={readContext:bt,useCallback:function(e,t){return Mt().memoizedState=[e,t===void 0?null:t],e},useContext:bt,useEffect:Xl,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,No(4194308,4,Jl.bind(null,t,e),r)},useLayoutEffect:function(e,t){return No(4194308,4,e,t)},useInsertionEffect:function(e,t){return No(4,2,e,t)},useMemo:function(e,t){var r=Mt();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var o=Mt();return t=r!==void 0?r(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=Yu.bind(null,We,e),[o.memoizedState,e]},useRef:function(e){var t=Mt();return e={current:e},t.memoizedState=e},useState:Hl,useDebugValue:xs,useDeferredValue:function(e){return Mt().memoizedState=e},useTransition:function(){var e=Hl(!1),t=e[0];return e=qu.bind(null,e[1]),Mt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var o=We,s=Mt();if(Me){if(r===void 0)throw Error(a(407));r=r()}else{if(r=t(),Qe===null)throw Error(a(349));(wn&30)!==0||Bl(o,t,r)}s.memoizedState=r;var c={value:r,getSnapshot:t};return s.queue=c,Xl(Vl.bind(null,o,c,e),[e]),o.flags|=2048,Tr(9,$l.bind(null,o,c,r,t),void 0,null),r},useId:function(){var e=Mt(),t=Qe.identifierPrefix;if(Me){var r=Ot,o=Ft;r=(o&~(1<<32-St(o)-1)).toString(32)+r,t=":"+t+"R"+r,r=Er++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=Xu++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ep={readContext:bt,useCallback:ec,useContext:bt,useEffect:ms,useImperativeHandle:Zl,useInsertionEffect:ql,useLayoutEffect:Yl,useMemo:tc,useReducer:fs,useRef:Ql,useState:function(){return fs(Ar)},useDebugValue:xs,useDeferredValue:function(e){var t=yt();return nc(t,Ke.memoizedState,e)},useTransition:function(){var e=fs(Ar)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Ol,useSyncExternalStore:Ul,useId:rc,unstable_isNewReconciler:!1},tp={readContext:bt,useCallback:ec,useContext:bt,useEffect:ms,useImperativeHandle:Zl,useInsertionEffect:ql,useLayoutEffect:Yl,useMemo:tc,useReducer:gs,useRef:Ql,useState:function(){return gs(Ar)},useDebugValue:xs,useDeferredValue:function(e){var t=yt();return Ke===null?t.memoizedState=e:nc(t,Ke.memoizedState,e)},useTransition:function(){var e=gs(Ar)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Ol,useSyncExternalStore:Ul,useId:rc,unstable_isNewReconciler:!1};function It(e,t){if(e&&e.defaultProps){t=K({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function _s(e,t,r,o){t=e.memoizedState,r=r(o,t),r=r==null?t:K({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Ao={isMounted:function(e){return(e=e._reactInternals)?pn(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var o=it(),s=an(e),c=Bt(o,s);c.payload=t,r!=null&&(c.callback=r),t=nn(e,c,s),t!==null&&(Tt(t,e,s,o),vo(t,e,s))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var o=it(),s=an(e),c=Bt(o,s);c.tag=1,c.payload=t,r!=null&&(c.callback=r),t=nn(e,c,s),t!==null&&(Tt(t,e,s,o),vo(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=it(),o=an(e),s=Bt(r,o);s.tag=2,t!=null&&(s.callback=t),t=nn(e,s,o),t!==null&&(Tt(t,e,o,r),vo(t,e,o))}};function ac(e,t,r,o,s,c,u){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,c,u):t.prototype&&t.prototype.isPureReactComponent?!xr(r,o)||!xr(s,c):!0}function lc(e,t,r){var o=!1,s=Zt,c=t.contextType;return typeof c=="object"&&c!==null?c=bt(c):(s=ct(t)?fn:Ze.current,o=t.contextTypes,c=(o=o!=null)?Fn(e,s):Zt),t=new t(r,c),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ao,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=c),t}function cc(e,t,r,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,o),t.state!==e&&Ao.enqueueReplaceState(t,t.state,null)}function ws(e,t,r,o){var s=e.stateNode;s.props=r,s.state=e.memoizedState,s.refs={},is(e);var c=t.contextType;typeof c=="object"&&c!==null?s.context=bt(c):(c=ct(t)?fn:Ze.current,s.context=Fn(e,c)),s.state=e.memoizedState,c=t.getDerivedStateFromProps,typeof c=="function"&&(_s(e,t,c,r),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&Ao.enqueueReplaceState(s,s.state,null),ko(e,r,s,o),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function Hn(e,t){try{var r="",o=t;do r+=I(o),o=o.return;while(o);var s=r}catch(c){s=`
Error generating stack: `+c.message+`
`+c.stack}return{value:e,source:t,stack:s,digest:null}}function bs(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function ys(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var np=typeof WeakMap=="function"?WeakMap:Map;function dc(e,t,r){r=Bt(-1,r),r.tag=3,r.payload={element:null};var o=t.value;return r.callback=function(){Po||(Po=!0,Ds=o),ys(e,t)},r}function uc(e,t,r){r=Bt(-1,r),r.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var s=t.value;r.payload=function(){return o(s)},r.callback=function(){ys(e,t)}}var c=e.stateNode;return c!==null&&typeof c.componentDidCatch=="function"&&(r.callback=function(){ys(e,t),typeof o!="function"&&(on===null?on=new Set([this]):on.add(this));var u=t.stack;this.componentDidCatch(t.value,{componentStack:u!==null?u:""})}),r}function pc(e,t,r){var o=e.pingCache;if(o===null){o=e.pingCache=new np;var s=new Set;o.set(t,s)}else s=o.get(t),s===void 0&&(s=new Set,o.set(t,s));s.has(r)||(s.add(r),e=mp.bind(null,e,t,r),t.then(e,e))}function hc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function fc(e,t,r,o,s){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=Bt(-1,1),t.tag=2,nn(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=s,e)}var rp=U.ReactCurrentOwner,dt=!1;function ot(e,t,r,o){t.child=e===null?Rl(t,null,r,o):$n(t,e.child,r,o)}function gc(e,t,r,o,s){r=r.render;var c=t.ref;return Kn(t,s),o=ps(e,t,r,o,c,s),r=hs(),e!==null&&!dt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,$t(e,t,s)):(Me&&r&&Xi(t),t.flags|=1,ot(e,t,o,s),t.child)}function mc(e,t,r,o,s){if(e===null){var c=r.type;return typeof c=="function"&&!$s(c)&&c.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=c,xc(e,t,c,o,s)):(e=$o(r.type,null,o,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(c=e.child,(e.lanes&s)===0){var u=c.memoizedProps;if(r=r.compare,r=r!==null?r:xr,r(u,o)&&e.ref===t.ref)return $t(e,t,s)}return t.flags|=1,e=cn(c,o),e.ref=t.ref,e.return=t,t.child=e}function xc(e,t,r,o,s){if(e!==null){var c=e.memoizedProps;if(xr(c,o)&&e.ref===t.ref)if(dt=!1,t.pendingProps=o=c,(e.lanes&s)!==0)(e.flags&131072)!==0&&(dt=!0);else return t.lanes=e.lanes,$t(e,t,s)}return vs(e,t,r,o,s)}function _c(e,t,r){var o=t.pendingProps,s=o.children,c=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ze(Xn,xt),xt|=r;else{if((r&1073741824)===0)return e=c!==null?c.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ze(Xn,xt),xt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=c!==null?c.baseLanes:r,ze(Xn,xt),xt|=o}else c!==null?(o=c.baseLanes|r,t.memoizedState=null):o=r,ze(Xn,xt),xt|=o;return ot(e,t,s,r),t.child}function wc(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function vs(e,t,r,o,s){var c=ct(r)?fn:Ze.current;return c=Fn(t,c),Kn(t,s),r=ps(e,t,r,o,c,s),o=hs(),e!==null&&!dt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,$t(e,t,s)):(Me&&o&&Xi(t),t.flags|=1,ot(e,t,r,s),t.child)}function bc(e,t,r,o,s){if(ct(r)){var c=!0;fo(t)}else c=!1;if(Kn(t,s),t.stateNode===null)zo(e,t),lc(t,r,o),ws(t,r,o,s),o=!0;else if(e===null){var u=t.stateNode,g=t.memoizedProps;u.props=g;var y=u.context,L=r.contextType;typeof L=="object"&&L!==null?L=bt(L):(L=ct(r)?fn:Ze.current,L=Fn(t,L));var Z=r.getDerivedStateFromProps,ne=typeof Z=="function"||typeof u.getSnapshotBeforeUpdate=="function";ne||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(g!==o||y!==L)&&cc(t,u,o,L),tn=!1;var q=t.memoizedState;u.state=q,ko(t,o,u,s),y=t.memoizedState,g!==o||q!==y||lt.current||tn?(typeof Z=="function"&&(_s(t,r,Z,o),y=t.memoizedState),(g=tn||ac(t,r,g,o,q,y,L))?(ne||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount()),typeof u.componentDidMount=="function"&&(t.flags|=4194308)):(typeof u.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=y),u.props=o,u.state=y,u.context=L,o=g):(typeof u.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{u=t.stateNode,Dl(e,t),g=t.memoizedProps,L=t.type===t.elementType?g:It(t.type,g),u.props=L,ne=t.pendingProps,q=u.context,y=r.contextType,typeof y=="object"&&y!==null?y=bt(y):(y=ct(r)?fn:Ze.current,y=Fn(t,y));var de=r.getDerivedStateFromProps;(Z=typeof de=="function"||typeof u.getSnapshotBeforeUpdate=="function")||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(g!==ne||q!==y)&&cc(t,u,o,y),tn=!1,q=t.memoizedState,u.state=q,ko(t,o,u,s);var he=t.memoizedState;g!==ne||q!==he||lt.current||tn?(typeof de=="function"&&(_s(t,r,de,o),he=t.memoizedState),(L=tn||ac(t,r,L,o,q,he,y)||!1)?(Z||typeof u.UNSAFE_componentWillUpdate!="function"&&typeof u.componentWillUpdate!="function"||(typeof u.componentWillUpdate=="function"&&u.componentWillUpdate(o,he,y),typeof u.UNSAFE_componentWillUpdate=="function"&&u.UNSAFE_componentWillUpdate(o,he,y)),typeof u.componentDidUpdate=="function"&&(t.flags|=4),typeof u.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof u.componentDidUpdate!="function"||g===e.memoizedProps&&q===e.memoizedState||(t.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||g===e.memoizedProps&&q===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=he),u.props=o,u.state=he,u.context=y,o=L):(typeof u.componentDidUpdate!="function"||g===e.memoizedProps&&q===e.memoizedState||(t.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||g===e.memoizedProps&&q===e.memoizedState||(t.flags|=1024),o=!1)}return ks(e,t,r,o,c,s)}function ks(e,t,r,o,s,c){wc(e,t);var u=(t.flags&128)!==0;if(!o&&!u)return s&&Sl(t,r,!1),$t(e,t,c);o=t.stateNode,rp.current=t;var g=u&&typeof r.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&u?(t.child=$n(t,e.child,null,c),t.child=$n(t,null,g,c)):ot(e,t,g,c),t.memoizedState=o.state,s&&Sl(t,r,!0),t.child}function yc(e){var t=e.stateNode;t.pendingContext?kl(e,t.pendingContext,t.pendingContext!==t.context):t.context&&kl(e,t.context,!1),ss(e,t.containerInfo)}function vc(e,t,r,o,s){return Bn(),Zi(s),t.flags|=256,ot(e,t,r,o),t.child}var js={dehydrated:null,treeContext:null,retryLane:0};function Ss(e){return{baseLanes:e,cachePool:null,transitions:null}}function kc(e,t,r){var o=t.pendingProps,s=Pe.current,c=!1,u=(t.flags&128)!==0,g;if((g=u)||(g=e!==null&&e.memoizedState===null?!1:(s&2)!==0),g?(c=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),ze(Pe,s&1),e===null)return Ji(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(u=o.children,e=o.fallback,c?(o=t.mode,c=t.child,u={mode:"hidden",children:u},(o&1)===0&&c!==null?(c.childLanes=0,c.pendingProps=u):c=Vo(u,o,0,null),e=jn(e,o,r,null),c.return=t,e.return=t,c.sibling=e,t.child=c,t.child.memoizedState=Ss(r),t.memoizedState=js,e):Cs(t,u));if(s=e.memoizedState,s!==null&&(g=s.dehydrated,g!==null))return op(e,t,u,o,g,s,r);if(c){c=o.fallback,u=t.mode,s=e.child,g=s.sibling;var y={mode:"hidden",children:o.children};return(u&1)===0&&t.child!==s?(o=t.child,o.childLanes=0,o.pendingProps=y,t.deletions=null):(o=cn(s,y),o.subtreeFlags=s.subtreeFlags&14680064),g!==null?c=cn(g,c):(c=jn(c,u,r,null),c.flags|=2),c.return=t,o.return=t,o.sibling=c,t.child=o,o=c,c=t.child,u=e.child.memoizedState,u=u===null?Ss(r):{baseLanes:u.baseLanes|r,cachePool:null,transitions:u.transitions},c.memoizedState=u,c.childLanes=e.childLanes&~r,t.memoizedState=js,o}return c=e.child,e=c.sibling,o=cn(c,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=r),o.return=t,o.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=o,t.memoizedState=null,o}function Cs(e,t){return t=Vo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function To(e,t,r,o){return o!==null&&Zi(o),$n(t,e.child,null,r),e=Cs(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function op(e,t,r,o,s,c,u){if(r)return t.flags&256?(t.flags&=-257,o=bs(Error(a(422))),To(e,t,u,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(c=o.fallback,s=t.mode,o=Vo({mode:"visible",children:o.children},s,0,null),c=jn(c,s,u,null),c.flags|=2,o.return=t,c.return=t,o.sibling=c,t.child=o,(t.mode&1)!==0&&$n(t,e.child,null,u),t.child.memoizedState=Ss(u),t.memoizedState=js,c);if((t.mode&1)===0)return To(e,t,u,null);if(s.data==="$!"){if(o=s.nextSibling&&s.nextSibling.dataset,o)var g=o.dgst;return o=g,c=Error(a(419)),o=bs(c,o,void 0),To(e,t,u,o)}if(g=(u&e.childLanes)!==0,dt||g){if(o=Qe,o!==null){switch(u&-u){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(o.suspendedLanes|u))!==0?0:s,s!==0&&s!==c.retryLane&&(c.retryLane=s,Ut(e,s),Tt(o,e,s,-1))}return Bs(),o=bs(Error(a(421))),To(e,t,u,o)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=xp.bind(null,e),s._reactRetry=t,null):(e=c.treeContext,mt=Yt(s.nextSibling),gt=t,Me=!0,Nt=null,e!==null&&(_t[wt++]=Ft,_t[wt++]=Ot,_t[wt++]=gn,Ft=e.id,Ot=e.overflow,gn=t),t=Cs(t,o.children),t.flags|=4096,t)}function jc(e,t,r){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),rs(e.return,t,r)}function Ns(e,t,r,o,s){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:r,tailMode:s}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=r,c.tailMode=s)}function Sc(e,t,r){var o=t.pendingProps,s=o.revealOrder,c=o.tail;if(ot(e,t,o.children,r),o=Pe.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&jc(e,r,t);else if(e.tag===19)jc(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(ze(Pe,o),(t.mode&1)===0)t.memoizedState=null;else switch(s){case"forwards":for(r=t.child,s=null;r!==null;)e=r.alternate,e!==null&&jo(e)===null&&(s=r),r=r.sibling;r=s,r===null?(s=t.child,t.child=null):(s=r.sibling,r.sibling=null),Ns(t,!1,s,r,c);break;case"backwards":for(r=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&jo(e)===null){t.child=s;break}e=s.sibling,s.sibling=r,r=s,s=e}Ns(t,!0,r,null,c);break;case"together":Ns(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function zo(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function $t(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),bn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(a(153));if(t.child!==null){for(e=t.child,r=cn(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=cn(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function ip(e,t,r){switch(t.tag){case 3:yc(t),Bn();break;case 5:Fl(t);break;case 1:ct(t.type)&&fo(t);break;case 4:ss(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,s=t.memoizedProps.value;ze(bo,o._currentValue),o._currentValue=s;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(ze(Pe,Pe.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?kc(e,t,r):(ze(Pe,Pe.current&1),e=$t(e,t,r),e!==null?e.sibling:null);ze(Pe,Pe.current&1);break;case 19:if(o=(r&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Sc(e,t,r);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),ze(Pe,Pe.current),o)break;return null;case 22:case 23:return t.lanes=0,_c(e,t,r)}return $t(e,t,r)}var Cc,Is,Nc,Ic;Cc=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},Is=function(){},Nc=function(e,t,r,o){var s=e.memoizedProps;if(s!==o){e=t.stateNode,_n(Rt.current);var c=null;switch(r){case"input":s=ve(e,s),o=ve(e,o),c=[];break;case"select":s=K({},s,{value:void 0}),o=K({},o,{value:void 0}),c=[];break;case"textarea":s=si(e,s),o=si(e,o),c=[];break;default:typeof s.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=uo)}li(r,o);var u;r=null;for(L in s)if(!o.hasOwnProperty(L)&&s.hasOwnProperty(L)&&s[L]!=null)if(L==="style"){var g=s[L];for(u in g)g.hasOwnProperty(u)&&(r||(r={}),r[u]="")}else L!=="dangerouslySetInnerHTML"&&L!=="children"&&L!=="suppressContentEditableWarning"&&L!=="suppressHydrationWarning"&&L!=="autoFocus"&&(p.hasOwnProperty(L)?c||(c=[]):(c=c||[]).push(L,null));for(L in o){var y=o[L];if(g=s?.[L],o.hasOwnProperty(L)&&y!==g&&(y!=null||g!=null))if(L==="style")if(g){for(u in g)!g.hasOwnProperty(u)||y&&y.hasOwnProperty(u)||(r||(r={}),r[u]="");for(u in y)y.hasOwnProperty(u)&&g[u]!==y[u]&&(r||(r={}),r[u]=y[u])}else r||(c||(c=[]),c.push(L,r)),r=y;else L==="dangerouslySetInnerHTML"?(y=y?y.__html:void 0,g=g?g.__html:void 0,y!=null&&g!==y&&(c=c||[]).push(L,y)):L==="children"?typeof y!="string"&&typeof y!="number"||(c=c||[]).push(L,""+y):L!=="suppressContentEditableWarning"&&L!=="suppressHydrationWarning"&&(p.hasOwnProperty(L)?(y!=null&&L==="onScroll"&&Le("scroll",e),c||g===y||(c=[])):(c=c||[]).push(L,y))}r&&(c=c||[]).push("style",r);var L=c;(t.updateQueue=L)&&(t.flags|=4)}},Ic=function(e,t,r,o){r!==o&&(t.flags|=4)};function zr(e,t){if(!Me)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function tt(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,o=0;if(t)for(var s=e.child;s!==null;)r|=s.lanes|s.childLanes,o|=s.subtreeFlags&14680064,o|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)r|=s.lanes|s.childLanes,o|=s.subtreeFlags,o|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=o,e.childLanes=r,t}function sp(e,t,r){var o=t.pendingProps;switch(qi(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return tt(t),null;case 1:return ct(t.type)&&ho(),tt(t),null;case 3:return o=t.stateNode,Gn(),Re(lt),Re(Ze),cs(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(_o(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Nt!==null&&(Fs(Nt),Nt=null))),Is(e,t),tt(t),null;case 5:as(t);var s=_n(Nr.current);if(r=t.type,e!==null&&t.stateNode!=null)Nc(e,t,r,o,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(a(166));return tt(t),null}if(e=_n(Rt.current),_o(t)){o=t.stateNode,r=t.type;var c=t.memoizedProps;switch(o[Lt]=t,o[vr]=c,e=(t.mode&1)!==0,r){case"dialog":Le("cancel",o),Le("close",o);break;case"iframe":case"object":case"embed":Le("load",o);break;case"video":case"audio":for(s=0;s<wr.length;s++)Le(wr[s],o);break;case"source":Le("error",o);break;case"img":case"image":case"link":Le("error",o),Le("load",o);break;case"details":Le("toggle",o);break;case"input":D(o,c),Le("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!c.multiple},Le("invalid",o);break;case"textarea":ua(o,c),Le("invalid",o)}li(r,c),s=null;for(var u in c)if(c.hasOwnProperty(u)){var g=c[u];u==="children"?typeof g=="string"?o.textContent!==g&&(c.suppressHydrationWarning!==!0&&co(o.textContent,g,e),s=["children",g]):typeof g=="number"&&o.textContent!==""+g&&(c.suppressHydrationWarning!==!0&&co(o.textContent,g,e),s=["children",""+g]):p.hasOwnProperty(u)&&g!=null&&u==="onScroll"&&Le("scroll",o)}switch(r){case"input":me(o),Ee(o,c,!0);break;case"textarea":me(o),ha(o);break;case"select":case"option":break;default:typeof c.onClick=="function"&&(o.onclick=uo)}o=s,t.updateQueue=o,o!==null&&(t.flags|=4)}else{u=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=fa(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=u.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=u.createElement(r,{is:o.is}):(e=u.createElement(r),r==="select"&&(u=e,o.multiple?u.multiple=!0:o.size&&(u.size=o.size))):e=u.createElementNS(e,r),e[Lt]=t,e[vr]=o,Cc(e,t,!1,!1),t.stateNode=e;e:{switch(u=ci(r,o),r){case"dialog":Le("cancel",e),Le("close",e),s=o;break;case"iframe":case"object":case"embed":Le("load",e),s=o;break;case"video":case"audio":for(s=0;s<wr.length;s++)Le(wr[s],e);s=o;break;case"source":Le("error",e),s=o;break;case"img":case"image":case"link":Le("error",e),Le("load",e),s=o;break;case"details":Le("toggle",e),s=o;break;case"input":D(e,o),s=ve(e,o),Le("invalid",e);break;case"option":s=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},s=K({},o,{value:void 0}),Le("invalid",e);break;case"textarea":ua(e,o),s=si(e,o),Le("invalid",e);break;default:s=o}li(r,s),g=s;for(c in g)if(g.hasOwnProperty(c)){var y=g[c];c==="style"?xa(e,y):c==="dangerouslySetInnerHTML"?(y=y?y.__html:void 0,y!=null&&ga(e,y)):c==="children"?typeof y=="string"?(r!=="textarea"||y!=="")&&er(e,y):typeof y=="number"&&er(e,""+y):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(p.hasOwnProperty(c)?y!=null&&c==="onScroll"&&Le("scroll",e):y!=null&&Y(e,c,y,u))}switch(r){case"input":me(e),Ee(e,o,!1);break;case"textarea":me(e),ha(e);break;case"option":o.value!=null&&e.setAttribute("value",""+J(o.value));break;case"select":e.multiple=!!o.multiple,c=o.value,c!=null?Nn(e,!!o.multiple,c,!1):o.defaultValue!=null&&Nn(e,!!o.multiple,o.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=uo)}switch(r){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return tt(t),null;case 6:if(e&&t.stateNode!=null)Ic(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(a(166));if(r=_n(Nr.current),_n(Rt.current),_o(t)){if(o=t.stateNode,r=t.memoizedProps,o[Lt]=t,(c=o.nodeValue!==r)&&(e=gt,e!==null))switch(e.tag){case 3:co(o.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&co(o.nodeValue,r,(e.mode&1)!==0)}c&&(t.flags|=4)}else o=(r.nodeType===9?r:r.ownerDocument).createTextNode(o),o[Lt]=t,t.stateNode=o}return tt(t),null;case 13:if(Re(Pe),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Me&&mt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Tl(),Bn(),t.flags|=98560,c=!1;else if(c=_o(t),o!==null&&o.dehydrated!==null){if(e===null){if(!c)throw Error(a(318));if(c=t.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(a(317));c[Lt]=t}else Bn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;tt(t),c=!1}else Nt!==null&&(Fs(Nt),Nt=null),c=!0;if(!c)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Pe.current&1)!==0?Ge===0&&(Ge=3):Bs())),t.updateQueue!==null&&(t.flags|=4),tt(t),null);case 4:return Gn(),Is(e,t),e===null&&br(t.stateNode.containerInfo),tt(t),null;case 10:return ns(t.type._context),tt(t),null;case 17:return ct(t.type)&&ho(),tt(t),null;case 19:if(Re(Pe),c=t.memoizedState,c===null)return tt(t),null;if(o=(t.flags&128)!==0,u=c.rendering,u===null)if(o)zr(c,!1);else{if(Ge!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(u=jo(e),u!==null){for(t.flags|=128,zr(c,!1),o=u.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=r,r=t.child;r!==null;)c=r,e=o,c.flags&=14680066,u=c.alternate,u===null?(c.childLanes=0,c.lanes=e,c.child=null,c.subtreeFlags=0,c.memoizedProps=null,c.memoizedState=null,c.updateQueue=null,c.dependencies=null,c.stateNode=null):(c.childLanes=u.childLanes,c.lanes=u.lanes,c.child=u.child,c.subtreeFlags=0,c.deletions=null,c.memoizedProps=u.memoizedProps,c.memoizedState=u.memoizedState,c.updateQueue=u.updateQueue,c.type=u.type,e=u.dependencies,c.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return ze(Pe,Pe.current&1|2),t.child}e=e.sibling}c.tail!==null&&Ue()>qn&&(t.flags|=128,o=!0,zr(c,!1),t.lanes=4194304)}else{if(!o)if(e=jo(u),e!==null){if(t.flags|=128,o=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),zr(c,!0),c.tail===null&&c.tailMode==="hidden"&&!u.alternate&&!Me)return tt(t),null}else 2*Ue()-c.renderingStartTime>qn&&r!==1073741824&&(t.flags|=128,o=!0,zr(c,!1),t.lanes=4194304);c.isBackwards?(u.sibling=t.child,t.child=u):(r=c.last,r!==null?r.sibling=u:t.child=u,c.last=u)}return c.tail!==null?(t=c.tail,c.rendering=t,c.tail=t.sibling,c.renderingStartTime=Ue(),t.sibling=null,r=Pe.current,ze(Pe,o?r&1|2:r&1),t):(tt(t),null);case 22:case 23:return Us(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(xt&1073741824)!==0&&(tt(t),t.subtreeFlags&6&&(t.flags|=8192)):tt(t),null;case 24:return null;case 25:return null}throw Error(a(156,t.tag))}function ap(e,t){switch(qi(t),t.tag){case 1:return ct(t.type)&&ho(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Gn(),Re(lt),Re(Ze),cs(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return as(t),null;case 13:if(Re(Pe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(a(340));Bn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Re(Pe),null;case 4:return Gn(),null;case 10:return ns(t.type._context),null;case 22:case 23:return Us(),null;case 24:return null;default:return null}}var Lo=!1,nt=!1,lp=typeof WeakSet=="function"?WeakSet:Set,ue=null;function Qn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(o){Fe(e,t,o)}else r.current=null}function Es(e,t,r){try{r()}catch(o){Fe(e,t,o)}}var Ec=!1;function cp(e,t){if(Ui=Jr,e=al(),Li(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var o=r.getSelection&&r.getSelection();if(o&&o.rangeCount!==0){r=o.anchorNode;var s=o.anchorOffset,c=o.focusNode;o=o.focusOffset;try{r.nodeType,c.nodeType}catch{r=null;break e}var u=0,g=-1,y=-1,L=0,Z=0,ne=e,q=null;t:for(;;){for(var de;ne!==r||s!==0&&ne.nodeType!==3||(g=u+s),ne!==c||o!==0&&ne.nodeType!==3||(y=u+o),ne.nodeType===3&&(u+=ne.nodeValue.length),(de=ne.firstChild)!==null;)q=ne,ne=de;for(;;){if(ne===e)break t;if(q===r&&++L===s&&(g=u),q===c&&++Z===o&&(y=u),(de=ne.nextSibling)!==null)break;ne=q,q=ne.parentNode}ne=de}r=g===-1||y===-1?null:{start:g,end:y}}else r=null}r=r||{start:0,end:0}}else r=null;for(Bi={focusedElem:e,selectionRange:r},Jr=!1,ue=t;ue!==null;)if(t=ue,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ue=e;else for(;ue!==null;){t=ue;try{var he=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(he!==null){var fe=he.memoizedProps,Be=he.memoizedState,C=t.stateNode,j=C.getSnapshotBeforeUpdate(t.elementType===t.type?fe:It(t.type,fe),Be);C.__reactInternalSnapshotBeforeUpdate=j}break;case 3:var A=t.stateNode.containerInfo;A.nodeType===1?A.textContent="":A.nodeType===9&&A.documentElement&&A.removeChild(A.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(a(163))}}catch(oe){Fe(t,t.return,oe)}if(e=t.sibling,e!==null){e.return=t.return,ue=e;break}ue=t.return}return he=Ec,Ec=!1,he}function Lr(e,t,r){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var s=o=o.next;do{if((s.tag&e)===e){var c=s.destroy;s.destroy=void 0,c!==void 0&&Es(t,r,c)}s=s.next}while(s!==o)}}function Ro(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var o=r.create;r.destroy=o()}r=r.next}while(r!==t)}}function As(e){var t=e.ref;if(t!==null){var r=e.stateNode;e.tag,e=r,typeof t=="function"?t(e):t.current=e}}function Ac(e){var t=e.alternate;t!==null&&(e.alternate=null,Ac(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Lt],delete t[vr],delete t[Gi],delete t[Ku],delete t[Gu])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Tc(e){return e.tag===5||e.tag===3||e.tag===4}function zc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Tc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ts(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=uo));else if(o!==4&&(e=e.child,e!==null))for(Ts(e,t,r),e=e.sibling;e!==null;)Ts(e,t,r),e=e.sibling}function zs(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(zs(e,t,r),e=e.sibling;e!==null;)zs(e,t,r),e=e.sibling}var Ye=null,Et=!1;function rn(e,t,r){for(r=r.child;r!==null;)Lc(e,t,r),r=r.sibling}function Lc(e,t,r){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(Gr,r)}catch{}switch(r.tag){case 5:nt||Qn(r,t);case 6:var o=Ye,s=Et;Ye=null,rn(e,t,r),Ye=o,Et=s,Ye!==null&&(Et?(e=Ye,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):Ye.removeChild(r.stateNode));break;case 18:Ye!==null&&(Et?(e=Ye,r=r.stateNode,e.nodeType===8?Ki(e.parentNode,r):e.nodeType===1&&Ki(e,r),ur(e)):Ki(Ye,r.stateNode));break;case 4:o=Ye,s=Et,Ye=r.stateNode.containerInfo,Et=!0,rn(e,t,r),Ye=o,Et=s;break;case 0:case 11:case 14:case 15:if(!nt&&(o=r.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){s=o=o.next;do{var c=s,u=c.destroy;c=c.tag,u!==void 0&&((c&2)!==0||(c&4)!==0)&&Es(r,t,u),s=s.next}while(s!==o)}rn(e,t,r);break;case 1:if(!nt&&(Qn(r,t),o=r.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=r.memoizedProps,o.state=r.memoizedState,o.componentWillUnmount()}catch(g){Fe(r,t,g)}rn(e,t,r);break;case 21:rn(e,t,r);break;case 22:r.mode&1?(nt=(o=nt)||r.memoizedState!==null,rn(e,t,r),nt=o):rn(e,t,r);break;default:rn(e,t,r)}}function Rc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new lp),t.forEach(function(o){var s=_p.bind(null,e,o);r.has(o)||(r.add(o),o.then(s,s))})}}function At(e,t){var r=t.deletions;if(r!==null)for(var o=0;o<r.length;o++){var s=r[o];try{var c=e,u=t,g=u;e:for(;g!==null;){switch(g.tag){case 5:Ye=g.stateNode,Et=!1;break e;case 3:Ye=g.stateNode.containerInfo,Et=!0;break e;case 4:Ye=g.stateNode.containerInfo,Et=!0;break e}g=g.return}if(Ye===null)throw Error(a(160));Lc(c,u,s),Ye=null,Et=!1;var y=s.alternate;y!==null&&(y.return=null),s.return=null}catch(L){Fe(s,t,L)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Mc(t,e),t=t.sibling}function Mc(e,t){var r=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(At(t,e),Dt(e),o&4){try{Lr(3,e,e.return),Ro(3,e)}catch(fe){Fe(e,e.return,fe)}try{Lr(5,e,e.return)}catch(fe){Fe(e,e.return,fe)}}break;case 1:At(t,e),Dt(e),o&512&&r!==null&&Qn(r,r.return);break;case 5:if(At(t,e),Dt(e),o&512&&r!==null&&Qn(r,r.return),e.flags&32){var s=e.stateNode;try{er(s,"")}catch(fe){Fe(e,e.return,fe)}}if(o&4&&(s=e.stateNode,s!=null)){var c=e.memoizedProps,u=r!==null?r.memoizedProps:c,g=e.type,y=e.updateQueue;if(e.updateQueue=null,y!==null)try{g==="input"&&c.type==="radio"&&c.name!=null&&ke(s,c),ci(g,u);var L=ci(g,c);for(u=0;u<y.length;u+=2){var Z=y[u],ne=y[u+1];Z==="style"?xa(s,ne):Z==="dangerouslySetInnerHTML"?ga(s,ne):Z==="children"?er(s,ne):Y(s,Z,ne,L)}switch(g){case"input":Ce(s,c);break;case"textarea":pa(s,c);break;case"select":var q=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!c.multiple;var de=c.value;de!=null?Nn(s,!!c.multiple,de,!1):q!==!!c.multiple&&(c.defaultValue!=null?Nn(s,!!c.multiple,c.defaultValue,!0):Nn(s,!!c.multiple,c.multiple?[]:"",!1))}s[vr]=c}catch(fe){Fe(e,e.return,fe)}}break;case 6:if(At(t,e),Dt(e),o&4){if(e.stateNode===null)throw Error(a(162));s=e.stateNode,c=e.memoizedProps;try{s.nodeValue=c}catch(fe){Fe(e,e.return,fe)}}break;case 3:if(At(t,e),Dt(e),o&4&&r!==null&&r.memoizedState.isDehydrated)try{ur(t.containerInfo)}catch(fe){Fe(e,e.return,fe)}break;case 4:At(t,e),Dt(e);break;case 13:At(t,e),Dt(e),s=e.child,s.flags&8192&&(c=s.memoizedState!==null,s.stateNode.isHidden=c,!c||s.alternate!==null&&s.alternate.memoizedState!==null||(Ms=Ue())),o&4&&Rc(e);break;case 22:if(Z=r!==null&&r.memoizedState!==null,e.mode&1?(nt=(L=nt)||Z,At(t,e),nt=L):At(t,e),Dt(e),o&8192){if(L=e.memoizedState!==null,(e.stateNode.isHidden=L)&&!Z&&(e.mode&1)!==0)for(ue=e,Z=e.child;Z!==null;){for(ne=ue=Z;ue!==null;){switch(q=ue,de=q.child,q.tag){case 0:case 11:case 14:case 15:Lr(4,q,q.return);break;case 1:Qn(q,q.return);var he=q.stateNode;if(typeof he.componentWillUnmount=="function"){o=q,r=q.return;try{t=o,he.props=t.memoizedProps,he.state=t.memoizedState,he.componentWillUnmount()}catch(fe){Fe(o,r,fe)}}break;case 5:Qn(q,q.return);break;case 22:if(q.memoizedState!==null){Wc(ne);continue}}de!==null?(de.return=q,ue=de):Wc(ne)}Z=Z.sibling}e:for(Z=null,ne=e;;){if(ne.tag===5){if(Z===null){Z=ne;try{s=ne.stateNode,L?(c=s.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none"):(g=ne.stateNode,y=ne.memoizedProps.style,u=y!=null&&y.hasOwnProperty("display")?y.display:null,g.style.display=ma("display",u))}catch(fe){Fe(e,e.return,fe)}}}else if(ne.tag===6){if(Z===null)try{ne.stateNode.nodeValue=L?"":ne.memoizedProps}catch(fe){Fe(e,e.return,fe)}}else if((ne.tag!==22&&ne.tag!==23||ne.memoizedState===null||ne===e)&&ne.child!==null){ne.child.return=ne,ne=ne.child;continue}if(ne===e)break e;for(;ne.sibling===null;){if(ne.return===null||ne.return===e)break e;Z===ne&&(Z=null),ne=ne.return}Z===ne&&(Z=null),ne.sibling.return=ne.return,ne=ne.sibling}}break;case 19:At(t,e),Dt(e),o&4&&Rc(e);break;case 21:break;default:At(t,e),Dt(e)}}function Dt(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Tc(r)){var o=r;break e}r=r.return}throw Error(a(160))}switch(o.tag){case 5:var s=o.stateNode;o.flags&32&&(er(s,""),o.flags&=-33);var c=zc(e);zs(e,c,s);break;case 3:case 4:var u=o.stateNode.containerInfo,g=zc(e);Ts(e,g,u);break;default:throw Error(a(161))}}catch(y){Fe(e,e.return,y)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function dp(e,t,r){ue=e,Dc(e)}function Dc(e,t,r){for(var o=(e.mode&1)!==0;ue!==null;){var s=ue,c=s.child;if(s.tag===22&&o){var u=s.memoizedState!==null||Lo;if(!u){var g=s.alternate,y=g!==null&&g.memoizedState!==null||nt;g=Lo;var L=nt;if(Lo=u,(nt=y)&&!L)for(ue=s;ue!==null;)u=ue,y=u.child,u.tag===22&&u.memoizedState!==null?Fc(s):y!==null?(y.return=u,ue=y):Fc(s);for(;c!==null;)ue=c,Dc(c),c=c.sibling;ue=s,Lo=g,nt=L}Pc(e)}else(s.subtreeFlags&8772)!==0&&c!==null?(c.return=s,ue=c):Pc(e)}}function Pc(e){for(;ue!==null;){var t=ue;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:nt||Ro(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!nt)if(r===null)o.componentDidMount();else{var s=t.elementType===t.type?r.memoizedProps:It(t.type,r.memoizedProps);o.componentDidUpdate(s,r.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var c=t.updateQueue;c!==null&&Wl(t,c,o);break;case 3:var u=t.updateQueue;if(u!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Wl(t,u,r)}break;case 5:var g=t.stateNode;if(r===null&&t.flags&4){r=g;var y=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":y.autoFocus&&r.focus();break;case"img":y.src&&(r.src=y.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var L=t.alternate;if(L!==null){var Z=L.memoizedState;if(Z!==null){var ne=Z.dehydrated;ne!==null&&ur(ne)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(a(163))}nt||t.flags&512&&As(t)}catch(q){Fe(t,t.return,q)}}if(t===e){ue=null;break}if(r=t.sibling,r!==null){r.return=t.return,ue=r;break}ue=t.return}}function Wc(e){for(;ue!==null;){var t=ue;if(t===e){ue=null;break}var r=t.sibling;if(r!==null){r.return=t.return,ue=r;break}ue=t.return}}function Fc(e){for(;ue!==null;){var t=ue;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Ro(4,t)}catch(y){Fe(t,r,y)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var s=t.return;try{o.componentDidMount()}catch(y){Fe(t,s,y)}}var c=t.return;try{As(t)}catch(y){Fe(t,c,y)}break;case 5:var u=t.return;try{As(t)}catch(y){Fe(t,u,y)}}}catch(y){Fe(t,t.return,y)}if(t===e){ue=null;break}var g=t.sibling;if(g!==null){g.return=t.return,ue=g;break}ue=t.return}}var up=Math.ceil,Mo=U.ReactCurrentDispatcher,Ls=U.ReactCurrentOwner,vt=U.ReactCurrentBatchConfig,Ne=0,Qe=null,$e=null,Je=0,xt=0,Xn=Jt(0),Ge=0,Rr=null,bn=0,Do=0,Rs=0,Mr=null,ut=null,Ms=0,qn=1/0,Vt=null,Po=!1,Ds=null,on=null,Wo=!1,sn=null,Fo=0,Dr=0,Ps=null,Oo=-1,Uo=0;function it(){return(Ne&6)!==0?Ue():Oo!==-1?Oo:Oo=Ue()}function an(e){return(e.mode&1)===0?1:(Ne&2)!==0&&Je!==0?Je&-Je:Qu.transition!==null?(Uo===0&&(Uo=za()),Uo):(e=Ae,e!==0||(e=window.event,e=e===void 0?16:Ua(e.type)),e)}function Tt(e,t,r,o){if(50<Dr)throw Dr=0,Ps=null,Error(a(185));sr(e,r,o),((Ne&2)===0||e!==Qe)&&(e===Qe&&((Ne&2)===0&&(Do|=r),Ge===4&&ln(e,Je)),pt(e,o),r===1&&Ne===0&&(t.mode&1)===0&&(qn=Ue()+500,go&&en()))}function pt(e,t){var r=e.callbackNode;Qd(e,t);var o=Xr(e,e===Qe?Je:0);if(o===0)r!==null&&Ea(r),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(r!=null&&Ea(r),t===1)e.tag===0?Hu(Uc.bind(null,e)):Cl(Uc.bind(null,e)),$u(function(){(Ne&6)===0&&en()}),r=null;else{switch(La(o)){case 1:r=mi;break;case 4:r=Aa;break;case 16:r=Kr;break;case 536870912:r=Ta;break;default:r=Kr}r=Xc(r,Oc.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Oc(e,t){if(Oo=-1,Uo=0,(Ne&6)!==0)throw Error(a(327));var r=e.callbackNode;if(Yn()&&e.callbackNode!==r)return null;var o=Xr(e,e===Qe?Je:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Bo(e,o);else{t=o;var s=Ne;Ne|=2;var c=$c();(Qe!==e||Je!==t)&&(Vt=null,qn=Ue()+500,vn(e,t));do try{fp();break}catch(g){Bc(e,g)}while(!0);ts(),Mo.current=c,Ne=s,$e!==null?t=0:(Qe=null,Je=0,t=Ge)}if(t!==0){if(t===2&&(s=xi(e),s!==0&&(o=s,t=Ws(e,s))),t===1)throw r=Rr,vn(e,0),ln(e,o),pt(e,Ue()),r;if(t===6)ln(e,o);else{if(s=e.current.alternate,(o&30)===0&&!pp(s)&&(t=Bo(e,o),t===2&&(c=xi(e),c!==0&&(o=c,t=Ws(e,c))),t===1))throw r=Rr,vn(e,0),ln(e,o),pt(e,Ue()),r;switch(e.finishedWork=s,e.finishedLanes=o,t){case 0:case 1:throw Error(a(345));case 2:kn(e,ut,Vt);break;case 3:if(ln(e,o),(o&130023424)===o&&(t=Ms+500-Ue(),10<t)){if(Xr(e,0)!==0)break;if(s=e.suspendedLanes,(s&o)!==o){it(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Vi(kn.bind(null,e,ut,Vt),t);break}kn(e,ut,Vt);break;case 4:if(ln(e,o),(o&4194240)===o)break;for(t=e.eventTimes,s=-1;0<o;){var u=31-St(o);c=1<<u,u=t[u],u>s&&(s=u),o&=~c}if(o=s,o=Ue()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*up(o/1960))-o,10<o){e.timeoutHandle=Vi(kn.bind(null,e,ut,Vt),o);break}kn(e,ut,Vt);break;case 5:kn(e,ut,Vt);break;default:throw Error(a(329))}}}return pt(e,Ue()),e.callbackNode===r?Oc.bind(null,e):null}function Ws(e,t){var r=Mr;return e.current.memoizedState.isDehydrated&&(vn(e,t).flags|=256),e=Bo(e,t),e!==2&&(t=ut,ut=r,t!==null&&Fs(t)),e}function Fs(e){ut===null?ut=e:ut.push.apply(ut,e)}function pp(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var o=0;o<r.length;o++){var s=r[o],c=s.getSnapshot;s=s.value;try{if(!Ct(c(),s))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function ln(e,t){for(t&=~Rs,t&=~Do,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-St(t),o=1<<r;e[r]=-1,t&=~o}}function Uc(e){if((Ne&6)!==0)throw Error(a(327));Yn();var t=Xr(e,0);if((t&1)===0)return pt(e,Ue()),null;var r=Bo(e,t);if(e.tag!==0&&r===2){var o=xi(e);o!==0&&(t=o,r=Ws(e,o))}if(r===1)throw r=Rr,vn(e,0),ln(e,t),pt(e,Ue()),r;if(r===6)throw Error(a(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,kn(e,ut,Vt),pt(e,Ue()),null}function Os(e,t){var r=Ne;Ne|=1;try{return e(t)}finally{Ne=r,Ne===0&&(qn=Ue()+500,go&&en())}}function yn(e){sn!==null&&sn.tag===0&&(Ne&6)===0&&Yn();var t=Ne;Ne|=1;var r=vt.transition,o=Ae;try{if(vt.transition=null,Ae=1,e)return e()}finally{Ae=o,vt.transition=r,Ne=t,(Ne&6)===0&&en()}}function Us(){xt=Xn.current,Re(Xn)}function vn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Bu(r)),$e!==null)for(r=$e.return;r!==null;){var o=r;switch(qi(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&ho();break;case 3:Gn(),Re(lt),Re(Ze),cs();break;case 5:as(o);break;case 4:Gn();break;case 13:Re(Pe);break;case 19:Re(Pe);break;case 10:ns(o.type._context);break;case 22:case 23:Us()}r=r.return}if(Qe=e,$e=e=cn(e.current,null),Je=xt=t,Ge=0,Rr=null,Rs=Do=bn=0,ut=Mr=null,xn!==null){for(t=0;t<xn.length;t++)if(r=xn[t],o=r.interleaved,o!==null){r.interleaved=null;var s=o.next,c=r.pending;if(c!==null){var u=c.next;c.next=s,o.next=u}r.pending=o}xn=null}return e}function Bc(e,t){do{var r=$e;try{if(ts(),So.current=Eo,Co){for(var o=We.memoizedState;o!==null;){var s=o.queue;s!==null&&(s.pending=null),o=o.next}Co=!1}if(wn=0,He=Ke=We=null,Ir=!1,Er=0,Ls.current=null,r===null||r.return===null){Ge=1,Rr=t,$e=null;break}e:{var c=e,u=r.return,g=r,y=t;if(t=Je,g.flags|=32768,y!==null&&typeof y=="object"&&typeof y.then=="function"){var L=y,Z=g,ne=Z.tag;if((Z.mode&1)===0&&(ne===0||ne===11||ne===15)){var q=Z.alternate;q?(Z.updateQueue=q.updateQueue,Z.memoizedState=q.memoizedState,Z.lanes=q.lanes):(Z.updateQueue=null,Z.memoizedState=null)}var de=hc(u);if(de!==null){de.flags&=-257,fc(de,u,g,c,t),de.mode&1&&pc(c,L,t),t=de,y=L;var he=t.updateQueue;if(he===null){var fe=new Set;fe.add(y),t.updateQueue=fe}else he.add(y);break e}else{if((t&1)===0){pc(c,L,t),Bs();break e}y=Error(a(426))}}else if(Me&&g.mode&1){var Be=hc(u);if(Be!==null){(Be.flags&65536)===0&&(Be.flags|=256),fc(Be,u,g,c,t),Zi(Hn(y,g));break e}}c=y=Hn(y,g),Ge!==4&&(Ge=2),Mr===null?Mr=[c]:Mr.push(c),c=u;do{switch(c.tag){case 3:c.flags|=65536,t&=-t,c.lanes|=t;var C=dc(c,y,t);Pl(c,C);break e;case 1:g=y;var j=c.type,A=c.stateNode;if((c.flags&128)===0&&(typeof j.getDerivedStateFromError=="function"||A!==null&&typeof A.componentDidCatch=="function"&&(on===null||!on.has(A)))){c.flags|=65536,t&=-t,c.lanes|=t;var oe=uc(c,g,t);Pl(c,oe);break e}}c=c.return}while(c!==null)}Kc(r)}catch(ge){t=ge,$e===r&&r!==null&&($e=r=r.return);continue}break}while(!0)}function $c(){var e=Mo.current;return Mo.current=Eo,e===null?Eo:e}function Bs(){(Ge===0||Ge===3||Ge===2)&&(Ge=4),Qe===null||(bn&268435455)===0&&(Do&268435455)===0||ln(Qe,Je)}function Bo(e,t){var r=Ne;Ne|=2;var o=$c();(Qe!==e||Je!==t)&&(Vt=null,vn(e,t));do try{hp();break}catch(s){Bc(e,s)}while(!0);if(ts(),Ne=r,Mo.current=o,$e!==null)throw Error(a(261));return Qe=null,Je=0,Ge}function hp(){for(;$e!==null;)Vc($e)}function fp(){for(;$e!==null&&!Fd();)Vc($e)}function Vc(e){var t=Qc(e.alternate,e,xt);e.memoizedProps=e.pendingProps,t===null?Kc(e):$e=t,Ls.current=null}function Kc(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=sp(r,t,xt),r!==null){$e=r;return}}else{if(r=ap(r,t),r!==null){r.flags&=32767,$e=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ge=6,$e=null;return}}if(t=t.sibling,t!==null){$e=t;return}$e=t=e}while(t!==null);Ge===0&&(Ge=5)}function kn(e,t,r){var o=Ae,s=vt.transition;try{vt.transition=null,Ae=1,gp(e,t,r,o)}finally{vt.transition=s,Ae=o}return null}function gp(e,t,r,o){do Yn();while(sn!==null);if((Ne&6)!==0)throw Error(a(327));r=e.finishedWork;var s=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(a(177));e.callbackNode=null,e.callbackPriority=0;var c=r.lanes|r.childLanes;if(Xd(e,c),e===Qe&&($e=Qe=null,Je=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Wo||(Wo=!0,Xc(Kr,function(){return Yn(),null})),c=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||c){c=vt.transition,vt.transition=null;var u=Ae;Ae=1;var g=Ne;Ne|=4,Ls.current=null,cp(e,r),Mc(r,e),Mu(Bi),Jr=!!Ui,Bi=Ui=null,e.current=r,dp(r),Od(),Ne=g,Ae=u,vt.transition=c}else e.current=r;if(Wo&&(Wo=!1,sn=e,Fo=s),c=e.pendingLanes,c===0&&(on=null),$d(r.stateNode),pt(e,Ue()),t!==null)for(o=e.onRecoverableError,r=0;r<t.length;r++)s=t[r],o(s.value,{componentStack:s.stack,digest:s.digest});if(Po)throw Po=!1,e=Ds,Ds=null,e;return(Fo&1)!==0&&e.tag!==0&&Yn(),c=e.pendingLanes,(c&1)!==0?e===Ps?Dr++:(Dr=0,Ps=e):Dr=0,en(),null}function Yn(){if(sn!==null){var e=La(Fo),t=vt.transition,r=Ae;try{if(vt.transition=null,Ae=16>e?16:e,sn===null)var o=!1;else{if(e=sn,sn=null,Fo=0,(Ne&6)!==0)throw Error(a(331));var s=Ne;for(Ne|=4,ue=e.current;ue!==null;){var c=ue,u=c.child;if((ue.flags&16)!==0){var g=c.deletions;if(g!==null){for(var y=0;y<g.length;y++){var L=g[y];for(ue=L;ue!==null;){var Z=ue;switch(Z.tag){case 0:case 11:case 15:Lr(8,Z,c)}var ne=Z.child;if(ne!==null)ne.return=Z,ue=ne;else for(;ue!==null;){Z=ue;var q=Z.sibling,de=Z.return;if(Ac(Z),Z===L){ue=null;break}if(q!==null){q.return=de,ue=q;break}ue=de}}}var he=c.alternate;if(he!==null){var fe=he.child;if(fe!==null){he.child=null;do{var Be=fe.sibling;fe.sibling=null,fe=Be}while(fe!==null)}}ue=c}}if((c.subtreeFlags&2064)!==0&&u!==null)u.return=c,ue=u;else e:for(;ue!==null;){if(c=ue,(c.flags&2048)!==0)switch(c.tag){case 0:case 11:case 15:Lr(9,c,c.return)}var C=c.sibling;if(C!==null){C.return=c.return,ue=C;break e}ue=c.return}}var j=e.current;for(ue=j;ue!==null;){u=ue;var A=u.child;if((u.subtreeFlags&2064)!==0&&A!==null)A.return=u,ue=A;else e:for(u=j;ue!==null;){if(g=ue,(g.flags&2048)!==0)try{switch(g.tag){case 0:case 11:case 15:Ro(9,g)}}catch(ge){Fe(g,g.return,ge)}if(g===u){ue=null;break e}var oe=g.sibling;if(oe!==null){oe.return=g.return,ue=oe;break e}ue=g.return}}if(Ne=s,en(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(Gr,e)}catch{}o=!0}return o}finally{Ae=r,vt.transition=t}}return!1}function Gc(e,t,r){t=Hn(r,t),t=dc(e,t,1),e=nn(e,t,1),t=it(),e!==null&&(sr(e,1,t),pt(e,t))}function Fe(e,t,r){if(e.tag===3)Gc(e,e,r);else for(;t!==null;){if(t.tag===3){Gc(t,e,r);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(on===null||!on.has(o))){e=Hn(r,e),e=uc(t,e,1),t=nn(t,e,1),e=it(),t!==null&&(sr(t,1,e),pt(t,e));break}}t=t.return}}function mp(e,t,r){var o=e.pingCache;o!==null&&o.delete(t),t=it(),e.pingedLanes|=e.suspendedLanes&r,Qe===e&&(Je&r)===r&&(Ge===4||Ge===3&&(Je&130023424)===Je&&500>Ue()-Ms?vn(e,0):Rs|=r),pt(e,t)}function Hc(e,t){t===0&&((e.mode&1)===0?t=1:(t=Qr,Qr<<=1,(Qr&130023424)===0&&(Qr=4194304)));var r=it();e=Ut(e,t),e!==null&&(sr(e,t,r),pt(e,r))}function xp(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),Hc(e,r)}function _p(e,t){var r=0;switch(e.tag){case 13:var o=e.stateNode,s=e.memoizedState;s!==null&&(r=s.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(a(314))}o!==null&&o.delete(t),Hc(e,r)}var Qc;Qc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||lt.current)dt=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return dt=!1,ip(e,t,r);dt=(e.flags&131072)!==0}else dt=!1,Me&&(t.flags&1048576)!==0&&Nl(t,xo,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;zo(e,t),e=t.pendingProps;var s=Fn(t,Ze.current);Kn(t,r),s=ps(null,t,o,e,s,r);var c=hs();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ct(o)?(c=!0,fo(t)):c=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,is(t),s.updater=Ao,t.stateNode=s,s._reactInternals=t,ws(t,o,e,r),t=ks(null,t,o,!0,c,r)):(t.tag=0,Me&&c&&Xi(t),ot(null,t,s,r),t=t.child),t;case 16:o=t.elementType;e:{switch(zo(e,t),e=t.pendingProps,s=o._init,o=s(o._payload),t.type=o,s=t.tag=bp(o),e=It(o,e),s){case 0:t=vs(null,t,o,e,r);break e;case 1:t=bc(null,t,o,e,r);break e;case 11:t=gc(null,t,o,e,r);break e;case 14:t=mc(null,t,o,It(o.type,e),r);break e}throw Error(a(306,o,""))}return t;case 0:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),vs(e,t,o,s,r);case 1:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),bc(e,t,o,s,r);case 3:e:{if(yc(t),e===null)throw Error(a(387));o=t.pendingProps,c=t.memoizedState,s=c.element,Dl(e,t),ko(t,o,null,r);var u=t.memoizedState;if(o=u.element,c.isDehydrated)if(c={element:o,isDehydrated:!1,cache:u.cache,pendingSuspenseBoundaries:u.pendingSuspenseBoundaries,transitions:u.transitions},t.updateQueue.baseState=c,t.memoizedState=c,t.flags&256){s=Hn(Error(a(423)),t),t=vc(e,t,o,r,s);break e}else if(o!==s){s=Hn(Error(a(424)),t),t=vc(e,t,o,r,s);break e}else for(mt=Yt(t.stateNode.containerInfo.firstChild),gt=t,Me=!0,Nt=null,r=Rl(t,null,o,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Bn(),o===s){t=$t(e,t,r);break e}ot(e,t,o,r)}t=t.child}return t;case 5:return Fl(t),e===null&&Ji(t),o=t.type,s=t.pendingProps,c=e!==null?e.memoizedProps:null,u=s.children,$i(o,s)?u=null:c!==null&&$i(o,c)&&(t.flags|=32),wc(e,t),ot(e,t,u,r),t.child;case 6:return e===null&&Ji(t),null;case 13:return kc(e,t,r);case 4:return ss(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=$n(t,null,o,r):ot(e,t,o,r),t.child;case 11:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),gc(e,t,o,s,r);case 7:return ot(e,t,t.pendingProps,r),t.child;case 8:return ot(e,t,t.pendingProps.children,r),t.child;case 12:return ot(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(o=t.type._context,s=t.pendingProps,c=t.memoizedProps,u=s.value,ze(bo,o._currentValue),o._currentValue=u,c!==null)if(Ct(c.value,u)){if(c.children===s.children&&!lt.current){t=$t(e,t,r);break e}}else for(c=t.child,c!==null&&(c.return=t);c!==null;){var g=c.dependencies;if(g!==null){u=c.child;for(var y=g.firstContext;y!==null;){if(y.context===o){if(c.tag===1){y=Bt(-1,r&-r),y.tag=2;var L=c.updateQueue;if(L!==null){L=L.shared;var Z=L.pending;Z===null?y.next=y:(y.next=Z.next,Z.next=y),L.pending=y}}c.lanes|=r,y=c.alternate,y!==null&&(y.lanes|=r),rs(c.return,r,t),g.lanes|=r;break}y=y.next}}else if(c.tag===10)u=c.type===t.type?null:c.child;else if(c.tag===18){if(u=c.return,u===null)throw Error(a(341));u.lanes|=r,g=u.alternate,g!==null&&(g.lanes|=r),rs(u,r,t),u=c.sibling}else u=c.child;if(u!==null)u.return=c;else for(u=c;u!==null;){if(u===t){u=null;break}if(c=u.sibling,c!==null){c.return=u.return,u=c;break}u=u.return}c=u}ot(e,t,s.children,r),t=t.child}return t;case 9:return s=t.type,o=t.pendingProps.children,Kn(t,r),s=bt(s),o=o(s),t.flags|=1,ot(e,t,o,r),t.child;case 14:return o=t.type,s=It(o,t.pendingProps),s=It(o.type,s),mc(e,t,o,s,r);case 15:return xc(e,t,t.type,t.pendingProps,r);case 17:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:It(o,s),zo(e,t),t.tag=1,ct(o)?(e=!0,fo(t)):e=!1,Kn(t,r),lc(t,o,s),ws(t,o,s,r),ks(null,t,o,!0,e,r);case 19:return Sc(e,t,r);case 22:return _c(e,t,r)}throw Error(a(156,t.tag))};function Xc(e,t){return Ia(e,t)}function wp(e,t,r,o){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function kt(e,t,r,o){return new wp(e,t,r,o)}function $s(e){return e=e.prototype,!(!e||!e.isReactComponent)}function bp(e){if(typeof e=="function")return $s(e)?1:0;if(e!=null){if(e=e.$$typeof,e===le)return 11;if(e===V)return 14}return 2}function cn(e,t){var r=e.alternate;return r===null?(r=kt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function $o(e,t,r,o,s,c){var u=2;if(o=e,typeof e=="function")$s(e)&&(u=1);else if(typeof e=="string")u=5;else e:switch(e){case X:return jn(r.children,s,c,t);case ae:u=8,s|=8;break;case re:return e=kt(12,r,t,s|2),e.elementType=re,e.lanes=c,e;case Q:return e=kt(13,r,t,s),e.elementType=Q,e.lanes=c,e;case xe:return e=kt(19,r,t,s),e.elementType=xe,e.lanes=c,e;case O:return Vo(r,s,c,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case se:u=10;break e;case te:u=9;break e;case le:u=11;break e;case V:u=14;break e;case ce:u=16,o=null;break e}throw Error(a(130,e==null?e:typeof e,""))}return t=kt(u,r,t,s),t.elementType=e,t.type=o,t.lanes=c,t}function jn(e,t,r,o){return e=kt(7,e,o,t),e.lanes=r,e}function Vo(e,t,r,o){return e=kt(22,e,o,t),e.elementType=O,e.lanes=r,e.stateNode={isHidden:!1},e}function Vs(e,t,r){return e=kt(6,e,null,t),e.lanes=r,e}function Ks(e,t,r){return t=kt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function yp(e,t,r,o,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=_i(0),this.expirationTimes=_i(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=_i(0),this.identifierPrefix=o,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Gs(e,t,r,o,s,c,u,g,y){return e=new yp(e,t,r,g,y),t===1?(t=1,c===!0&&(t|=8)):t=0,c=kt(3,null,null,t),e.current=c,c.stateNode=e,c.memoizedState={element:o,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},is(c),e}function vp(e,t,r){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:H,key:o==null?null:""+o,children:e,containerInfo:t,implementation:r}}function qc(e){if(!e)return Zt;e=e._reactInternals;e:{if(pn(e)!==e||e.tag!==1)throw Error(a(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ct(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(a(171))}if(e.tag===1){var r=e.type;if(ct(r))return jl(e,r,t)}return t}function Yc(e,t,r,o,s,c,u,g,y){return e=Gs(r,o,!0,e,s,c,u,g,y),e.context=qc(null),r=e.current,o=it(),s=an(r),c=Bt(o,s),c.callback=t??null,nn(r,c,s),e.current.lanes=s,sr(e,s,o),pt(e,o),e}function Ko(e,t,r,o){var s=t.current,c=it(),u=an(s);return r=qc(r),t.context===null?t.context=r:t.pendingContext=r,t=Bt(c,u),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=nn(s,t,u),e!==null&&(Tt(e,s,u,c),vo(e,s,u)),u}function Go(e){return e=e.current,e.child?(e.child.tag===5,e.child.stateNode):null}function Jc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function Hs(e,t){Jc(e,t),(e=e.alternate)&&Jc(e,t)}function kp(){return null}var Zc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Qs(e){this._internalRoot=e}Ho.prototype.render=Qs.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(a(409));Ko(e,t,null,null)},Ho.prototype.unmount=Qs.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;yn(function(){Ko(null,e,null,null)}),t[Pt]=null}};function Ho(e){this._internalRoot=e}Ho.prototype.unstable_scheduleHydration=function(e){if(e){var t=Da();e={blockedOn:null,target:e,priority:t};for(var r=0;r<Qt.length&&t!==0&&t<Qt[r].priority;r++);Qt.splice(r,0,e),r===0&&Fa(e)}};function Xs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Qo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function ed(){}function jp(e,t,r,o,s){if(s){if(typeof o=="function"){var c=o;o=function(){var L=Go(u);c.call(L)}}var u=Yc(t,o,e,0,null,!1,!1,"",ed);return e._reactRootContainer=u,e[Pt]=u.current,br(e.nodeType===8?e.parentNode:e),yn(),u}for(;s=e.lastChild;)e.removeChild(s);if(typeof o=="function"){var g=o;o=function(){var L=Go(y);g.call(L)}}var y=Gs(e,0,!1,null,null,!1,!1,"",ed);return e._reactRootContainer=y,e[Pt]=y.current,br(e.nodeType===8?e.parentNode:e),yn(function(){Ko(t,y,r,o)}),y}function Xo(e,t,r,o,s){var c=r._reactRootContainer;if(c){var u=c;if(typeof s=="function"){var g=s;s=function(){var y=Go(u);g.call(y)}}Ko(t,u,e,s)}else u=jp(r,t,e,s,o);return Go(u)}Ra=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=ir(t.pendingLanes);r!==0&&(wi(t,r|1),pt(t,Ue()),(Ne&6)===0&&(qn=Ue()+500,en()))}break;case 13:yn(function(){var o=Ut(e,1);if(o!==null){var s=it();Tt(o,e,1,s)}}),Hs(e,1)}},bi=function(e){if(e.tag===13){var t=Ut(e,134217728);if(t!==null){var r=it();Tt(t,e,134217728,r)}Hs(e,134217728)}},Ma=function(e){if(e.tag===13){var t=an(e),r=Ut(e,t);if(r!==null){var o=it();Tt(r,e,t,o)}Hs(e,t)}},Da=function(){return Ae},Pa=function(e,t){var r=Ae;try{return Ae=e,t()}finally{Ae=r}},pi=function(e,t,r){switch(t){case"input":if(Ce(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var o=r[t];if(o!==e&&o.form===e.form){var s=po(o);if(!s)throw Error(a(90));De(o),Ce(o,s)}}}break;case"textarea":pa(e,r);break;case"select":t=r.value,t!=null&&Nn(e,!!r.multiple,t,!1)}},ya=Os,va=yn;var Sp={usingClientEntryPoint:!1,Events:[kr,Pn,po,wa,ba,Os]},Pr={findFiberByHostInstance:hn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Cp={bundleType:Pr.bundleType,version:Pr.version,rendererPackageName:Pr.rendererPackageName,rendererConfig:Pr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:U.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ca(e),e===null?null:e.stateNode},findFiberByHostInstance:Pr.findFiberByHostInstance||kp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var qo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!qo.isDisabled&&qo.supportsFiber)try{Gr=qo.inject(Cp),zt=qo}catch{}}return ht.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Sp,ht.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Xs(t))throw Error(a(200));return vp(e,t,null,r)},ht.createRoot=function(e,t){if(!Xs(e))throw Error(a(299));var r=!1,o="",s=Zc;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=Gs(e,1,!1,null,null,r,!1,o,s),e[Pt]=t.current,br(e.nodeType===8?e.parentNode:e),new Qs(t)},ht.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(a(188)):(e=Object.keys(e).join(","),Error(a(268,e)));return e=Ca(t),e=e===null?null:e.stateNode,e},ht.flushSync=function(e){return yn(e)},ht.hydrate=function(e,t,r){if(!Qo(t))throw Error(a(200));return Xo(null,e,t,!0,r)},ht.hydrateRoot=function(e,t,r){if(!Xs(e))throw Error(a(405));var o=r!=null&&r.hydratedSources||null,s=!1,c="",u=Zc;if(r!=null&&(r.unstable_strictMode===!0&&(s=!0),r.identifierPrefix!==void 0&&(c=r.identifierPrefix),r.onRecoverableError!==void 0&&(u=r.onRecoverableError)),t=Yc(t,null,e,1,r??null,s,!1,c,u),e[Pt]=t.current,br(e),o)for(e=0;e<o.length;e++)r=o[e],s=r._getVersion,s=s(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,s]:t.mutableSourceEagerHydrationData.push(r,s);return new Ho(t)},ht.render=function(e,t,r){if(!Qo(t))throw Error(a(200));return Xo(null,e,t,!1,r)},ht.unmountComponentAtNode=function(e){if(!Qo(e))throw Error(a(40));return e._reactRootContainer?(yn(function(){Xo(null,null,e,!1,function(){e._reactRootContainer=null,e[Pt]=null})}),!0):!1},ht.unstable_batchedUpdates=Os,ht.unstable_renderSubtreeIntoContainer=function(e,t,r,o){if(!Qo(r))throw Error(a(200));if(e==null||e._reactInternals===void 0)throw Error(a(38));return Xo(e,t,r,!1,o)},ht.version="18.3.1-next-f1338f8080-20240426",ht}var ld;function Dp(){if(ld)return Js.exports;ld=1;function l(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l)}catch(i){console.error(i)}}return l(),Js.exports=Mp(),Js.exports}var cd;function Pp(){if(cd)return Yo;cd=1;var l=Dp();return Yo.createRoot=l.createRoot,Yo.hydrateRoot=l.hydrateRoot,Yo}var Wp=Pp();const ri="cheng_access_token",ta="cheng_refresh_token";class Ve{constructor(i){this.apiBaseUrl=i}apiBaseUrl;async getAccessToken(){return this.getAccessTokenSync()}getAccessTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(ri)}getRefreshTokenSync(){return typeof window>"u"?null:window.localStorage.getItem(ta)}storeTokens(i,a){typeof window>"u"||(window.localStorage.setItem(ri,i),a&&window.localStorage.setItem(ta,a))}clearTokens(){typeof window>"u"||(window.localStorage.removeItem(ri),window.localStorage.removeItem(ta))}async refreshAccessToken(){const i=this.getRefreshTokenSync();if(!i)return null;const a=await fetch(`${this.apiBaseUrl}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:i})});if(!a.ok)return null;const d=await a.json().catch(()=>null),p=d?.token??d?.access_token??null;return p?(this.storeTokens(p,d?.refresh_token),p):null}}const Ur="cheng:auth-expired";function kd(){new Ve("").clearTokens()}function Cn(l="expired"){kd(),!(typeof window>"u")&&window.dispatchEvent(new CustomEvent(Ur,{detail:{reason:l}}))}class ca{constructor(i){this.apiBaseUrl=i,this.session=new Ve(i)}apiBaseUrl;session;async login(i){const a=await fetch(`${this.apiBaseUrl}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!a.ok){const p=await a.json().catch(()=>({}));throw new Error(p.message??p.error??`Login failed (${a.status})`)}const d=await a.json();return this.session.storeTokens(d.token,d.refresh_token),d}async resetPassword(i){const a=await fetch(`${this.apiBaseUrl}/auth/password/reset`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!a.ok){const d=await a.json().catch(()=>({}));throw new Error(d.message??d.error??`Reset password failed (${a.status})`)}}async refresh(){const i=await this.session.refreshAccessToken();return i||Cn("refresh-failed"),i}logout(){kd()}getAccessToken(){return this.session.getAccessTokenSync()}getRefreshToken(){return this.session.getRefreshTokenSync()}isAuthenticated(){return!!this.getAccessToken()}}class jd{apiBaseUrl;workspaceId;contractWarnedKeys;tokenProvider;constructor(i,a){this.apiBaseUrl=i.apiBaseUrl,this.workspaceId=i.workspaceId.trim(),this.contractWarnedKeys=new Set,this.tokenProvider=a??new Ve(i.apiBaseUrl)}assertWorkspaceId(){if(!this.workspaceId)throw new jt("VALIDATION_ERROR","workspaceId is required in ChannelConfig",422)}async execute(i,a,d,p,h,x){this.assertWorkspaceId();const b={app_id:i,external_user_id:(h||"web-user").trim(),external_chat_id:(p||`web-session-${Date.now()}`).trim(),mode:"workflow_chat",workflow_id:a,extra_context:{channel_id:i}},k=await this.resolveConversation(this.workspaceId,b),v=this._extractConversationId(k),R=await this.createMessage(v,{role:"user",content:d,attachments:x&&x.length>0?x:void 0}),M=this._extractExecutionId(R);return this._normalizeExecuteData({conversation_id:v,workflow_id:a,execution_id:M})}async workflowSupportsAttachments(i){try{const a=await this._fetch(`/workflows/${i}`,"GET");return(a?.definition?.nodes??a?.data?.definition?.nodes??[]).some(p=>p?.nodeType==="io/file_upload"||p?.node_type==="io/file_upload")}catch{return!1}}async resolveConversation(i,a){if(!i?.trim())throw new jt("VALIDATION_ERROR","workspaceId is required to resolve a conversation",422);return this._fetch(`/workspaces/${i}/conversations/resolve`,"POST",a)}async getConversationMessages(i){const a=await this._fetch(`/conversations/${i}/messages`,"GET");return(Array.isArray(a)?a:Array.isArray(a?.data)?a.data:Array.isArray(a?.data?.items)?a.data.items:Array.isArray(a?.items)?a.items:[]).map(p=>({id:p.id??p.messageId??"",role:p.role??"assistant",content:p.content??"",createdAt:p.createdAt??p.created_at??new Date().toISOString(),executionId:p.executionId??p.execution_id}))}async createMessage(i,a){return this._fetch(`/conversations/${i}/messages`,"POST",a)}async submitApproval(i,a,d,p){return this._fetch(`/executions/${i}/approve`,"POST",{requestId:a,decision:d,scope:"once",reason:p||null})}async getExecution(i){const a=await this._fetch(`/executions/${encodeURIComponent(i)}`,"GET"),d=a?.data??a,p=d?.error??d?.error_info??d?.errorInfo;return{executionId:d?.executionId??d?.execution_id??d?.id??i,status:d?.status??d?.state??"unknown",conversationId:d?.conversationId??d?.conversation_id,workflowId:d?.workflowId??d?.workflow_id,createdAt:d?.createdAt??d?.created_at,startedAt:d?.startedAt??d?.started_at,completedAt:d?.completedAt??d?.completed_at,updatedAt:d?.updatedAt??d?.updated_at,error:typeof p=="string"?p:p?{message:p.message??"Execution failed",code:p.code,details:p.details}:void 0,resultAvailable:d?.resultAvailable??d?.result_available??d?.result!=null,result:d?.result,review:d?.review??d?.review_payload,approval:d?.approval??d?.approval_payload}}async getExecutionResult(i){return this._fetch(`/executions/${encodeURIComponent(i)}/result`,"GET")}async _fetch(i,a,d){const p=`${this.apiBaseUrl}${i}`;try{const h={"Content-Type":"application/json"},x=await this.tokenProvider.getAccessToken();if(!x)throw Cn("missing-access-token"),new jt("UNAUTHORIZED","Access token is missing",401);const b=d!==void 0?JSON.stringify(d):void 0,k=async M=>{const $={...h,Authorization:`Bearer ${M}`};return fetch(p,{method:a,headers:$,body:b})};let v=await k(x),R=!1;if(v.status===401&&this.tokenProvider.refreshAccessToken){const M=await this.tokenProvider.refreshAccessToken().catch(()=>null);M?v=await k(M):(Cn("refresh-failed"),R=!0)}return v.ok||await this._handleError(v,R),v.json()}catch(h){throw h instanceof jt?h:new jt("NETWORK_ERROR",h instanceof Error?h.message:"Unknown network error",0)}}_extractConversationId(i){const a=i&&typeof i=="object"?i:{},d=a.data&&typeof a.data=="object"?a.data:a,p=d.id??d.conversation_id??d.conversationId;if(typeof p!="string"||!p)throw new jt("UNKNOWN_ERROR","Conversation resolve response missing conversation id",500,i);return p}_extractExecutionId(i){const a=i&&typeof i=="object"?i:{},d=a.data&&typeof a.data=="object"?a.data:a,p=a.metadata&&typeof a.metadata=="object"?a.metadata:d.metadata&&typeof d.metadata=="object"?d.metadata:null,h=p?.execution_id??p?.executionId??d.execution_id??d.executionId??null;return typeof h=="string"?h:null}_normalizeExecuteData(i){const a=i&&typeof i=="object"?i:{},d=a.conversation_id??a.conversationId,p=a.workflow_id??a.workflowId,h=a.execution_id??a.executionId??null;(d===void 0||p===void 0)&&this._warnContract("execute-missing-fields","[contract-guard] execute response missing expected fields: conversation_id/workflow_id");const b=Object.keys(a).filter(k=>k.includes("_"));return b.length>0&&this._warnContract("execute-snake-keys",`[contract-guard] execute response contains snake_case keys: ${b.join(", ")}`),{conversation_id:typeof d=="string"?d:"",workflow_id:typeof p=="string"?p:"",execution_id:typeof h=="string"?h:null}}_warnContract(i,a){this.contractWarnedKeys.has(i)||(this.contractWarnedKeys.add(i),console.warn(a))}async _handleError(i,a){const d=i.status;let p;try{p=await i.json()}catch{p={message:i.statusText}}const h=p.message||p.error||"Unknown error";switch(d){case 401:throw a||Cn("channel-unauthorized"),new jt("UNAUTHORIZED","Access token is invalid or expired",d,p);case 404:throw new jt("NOT_FOUND","Resource not found",d,p);case 422:throw new jt("VALIDATION_ERROR",h,d,p);case 429:throw new jt("RATE_LIMIT","Too many requests",d,p);case 500:case 502:case 503:case 504:throw new jt("SERVER_ERROR","Server error, please try again later",d,p);default:throw new jt("UNKNOWN_ERROR",h,d,p)}}}class jt extends Error{constructor(i,a,d,p){super(a),this.code=i,this.status=d,this.details=p,this.name="ChannelClientError"}code;status;details}class Sd{storage;sessionKey;conversationKey;sessionsKey;conversationMapKey;constructor(i,a){this.storage=a||(typeof window<"u"?window.localStorage:new Fp),this.sessionKey=`cheng_session_${i}`,this.conversationKey=`cheng_conversation_${i}`,this.sessionsKey=`cheng_sessions_${i}`,this.conversationMapKey=`cheng_conversation_map_${i}`}getOrCreateSessionId(){let i=this.storage.getItem(this.sessionKey);return i||(i=this._generateUUID(),this.storage.setItem(this.sessionKey,i)),this._ensureCurrentSessionListed(i),i}resetSession(){const i=this._generateUUID();return this.storage.setItem(this.sessionKey,i),this.storage.removeItem(this.conversationKey),this._ensureCurrentSessionListed(i),i}setConversationId(i){this.storage.setItem(this.conversationKey,i);const a=this.getOrCreateSessionId(),d=this._getConversationMap();d[a]=i,this._setConversationMap(d),this._updateSession(a,{conversationId:i})}getConversationId(){const i=this.storage.getItem(this.sessionKey),a=this._getConversationMap();if(i&&a[i])return a[i];const d=this.storage.getItem(this.conversationKey);return i&&d&&(a[i]=d,this._setConversationMap(a),this._updateSession(i,{conversationId:d})),d}clearConversationId(){this.storage.removeItem(this.conversationKey);const i=this.storage.getItem(this.sessionKey);if(!i)return;const a=this._getConversationMap();delete a[i],this._setConversationMap(a),this._updateSession(i,{conversationId:void 0})}clear(){this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey),this.storage.removeItem(this.sessionsKey),this.storage.removeItem(this.conversationMapKey)}listSessions(){const i=this.storage.getItem(this.sessionsKey),a=this.storage.getItem(this.sessionKey),d=this._getConversationMap();if(!i){if(!a)return[];const p={id:a,label:"Session 1",createdAt:new Date().toISOString(),conversationId:d[a],pinned:!1};return this.storage.setItem(this.sessionsKey,JSON.stringify([p])),[p]}try{const h=JSON.parse(i).map(b=>({...b,conversationId:d[b.id]??b.conversationId}));a&&!h.some(b=>b.id===a)&&h.unshift({id:a,label:`Session ${h.length+1}`,createdAt:new Date().toISOString(),conversationId:d[a],pinned:!1});const x=[...h.filter(b=>b.pinned),...h.filter(b=>!b.pinned)];return this.storage.setItem(this.sessionsKey,JSON.stringify(x)),x}catch{return[]}}createSession(i){const a=this.listSessions(),d=this._generateUUID(),p=i??`Session ${a.length+1}`,h={id:d,label:p,createdAt:new Date().toISOString(),pinned:!1};return a.unshift(h),this.storage.setItem(this.sessionsKey,JSON.stringify(a)),this.storage.setItem(this.sessionKey,d),this.storage.removeItem(this.conversationKey),h}renameSession(i,a){const d=a.trim();d&&this._updateSession(i,{label:d})}togglePinSession(i){const a=this.listSessions().find(d=>d.id===i);a&&this._updateSession(i,{pinned:!a.pinned})}deleteSession(i){let a=this.listSessions();const d=this.storage.getItem(this.sessionKey);if(a=a.filter(h=>h.id!==i),this.storage.setItem(this.sessionsKey,JSON.stringify(a)),d===i)if(a.length>0){this.storage.setItem(this.sessionKey,a[0].id);const x=this._getConversationMap()[a[0].id];x?this.storage.setItem(this.conversationKey,x):this.storage.removeItem(this.conversationKey)}else this.storage.removeItem(this.sessionKey),this.storage.removeItem(this.conversationKey);const p=this._getConversationMap();delete p[i],this._setConversationMap(p)}getActiveSessionId(){return this.getOrCreateSessionId()}setActiveSessionId(i){this.storage.setItem(this.sessionKey,i),this._ensureCurrentSessionListed(i);const d=this._getConversationMap()[i];d?this.storage.setItem(this.conversationKey,d):this.storage.removeItem(this.conversationKey)}_getConversationMap(){const i=this.storage.getItem(this.conversationMapKey);if(!i)return{};try{return JSON.parse(i)}catch{return{}}}_setConversationMap(i){this.storage.setItem(this.conversationMapKey,JSON.stringify(i))}_updateSession(i,a){const p=this.listSessions().map(h=>h.id===i?{...h,...a}:h);this.storage.setItem(this.sessionsKey,JSON.stringify(p))}_ensureCurrentSessionListed(i){const a=this.listSessions();if(a.some(p=>p.id===i))return;const d=[{id:i,label:`Session ${a.length+1}`,createdAt:new Date().toISOString(),conversationId:this._getConversationMap()[i],pinned:!1},...a];this.storage.setItem(this.sessionsKey,JSON.stringify(d))}_generateUUID(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,i=>{const a=Math.random()*16|0;return(i==="x"?a:a&3|8).toString(16)})}}let Fp=class{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(i){return this.data.get(i)??null}key(i){return Array.from(this.data.keys())[i]??null}removeItem(i){this.data.delete(i)}setItem(i,a){this.data.set(i,a)}};const Op=new Set(["completed_unread","failed_unread","cancelled"]);function Up(l){switch(String(l??"").toLowerCase()){case"pending":case"queued":case"created":return"pending";case"running":case"in_progress":case"started":return"running";case"paused":case"waiting_for_review":case"waiting_for_approval":case"review":return"waiting_for_review";case"completed":case"succeeded":case"success":return"completed_unread";case"failed":case"error":return"failed_unread";case"cancelled":case"canceled":return"cancelled";default:return"unknown"}}function Bp(l){return Up(l.status)}const un=l=>Op.has(l),dd=2,na=200,$p=720*60*60*1e3,Fr=l=>typeof l=="object"&&l!==null,Or=l=>l==="paused"?"waiting_for_review":l==="completed"?"completed_unread":l==="failed"?"failed_unread":l;class Sn{storage;recordsKey;legacyActiveKey;constructor(i,a){this.storage=a??(typeof window<"u"?window.localStorage:new Vp),this.recordsKey=`cheng_execution_mappings_${i}`,this.legacyActiveKey=`cheng_active_execution_${i}`}setActive(i){const a=new Date().toISOString(),d={...i,sessionId:i.sessionId??i.externalChatId,status:Or(i.status??"pending"),createdAt:i.createdAt??a,updatedAt:i.updatedAt??a};return this.mutate(p=>{p.records[d.executionId]=d,p.activeByConversation[d.conversationId]=d.executionId}),this.safeSet(this.legacyActiveKey,d.executionId),d}upsert(i){const a={...i,sessionId:i.sessionId??i.externalChatId,status:Or(i.status)};return this.mutate(d=>{d.records[i.executionId]=a,this.isActive(a.status)?d.activeByConversation[i.conversationId]=i.executionId:d.activeByConversation[i.conversationId]===i.executionId&&delete d.activeByConversation[i.conversationId]}),a}getActive(){const i=this.safeGet(this.legacyActiveKey);if(i){const a=this.getByExecutionId(i);if(a&&this.isActive(a.status))return a}return this.listRecoverable().find(a=>this.isActive(a.status))??null}getActiveForConversation(i){return this.findActiveByConversation(i)}getByExecutionId(i){return this.read().records[i]??null}findActiveByConversation(i){const a=this.read(),d=a.activeByConversation[i]&&a.records[a.activeByConversation[i]];return d&&this.isActive(d.status)?d:this.sorted(a.records).find(p=>p.conversationId===i&&this.isActive(p.status))??null}findBySession(i){return this.sorted(this.read().records).filter(a=>(a.sessionId??a.externalChatId)===i)}findLatestByConversation(i){return this.sorted(this.read().records).find(a=>a.conversationId===i)??null}listRecoverable(){return this.sorted(this.read().records).filter(i=>!i.acknowledgedAt||this.isActive(i.status))}listAll(){return this.sorted(this.read().records)}updateStatus(i,a,d={}){let p=null;return this.mutate(h=>{const x=h.records[i];x&&(p={...x,...d,status:Or(a),updatedAt:new Date().toISOString()},h.records[i]=p,un(p.status)&&h.activeByConversation[x.conversationId]===i&&delete h.activeByConversation[x.conversationId])}),p}acknowledge(i){return this.updateStatus(i,"idle",{acknowledgedAt:new Date().toISOString()})}clearActive(i){this.mutate(a=>{for(const[d,p]of Object.entries(a.activeByConversation))p===i&&delete a.activeByConversation[d]}),this.safeGet(this.legacyActiveKey)===i&&this.safeRemove(this.legacyActiveKey)}clearExecution(i){const a=this.getByExecutionId(i);a&&un(Or(a.status))?this.clearActive(i):this.removeExecution(i)}removeExecution(i){this.mutate(a=>{delete a.records[i];for(const[d,p]of Object.entries(a.activeByConversation))p===i&&delete a.activeByConversation[d]}),this.safeGet(this.legacyActiveKey)===i&&this.safeRemove(this.legacyActiveKey)}clearConversation(i){this.mutate(a=>{for(const[d,p]of Object.entries(a.records))p.conversationId===i&&delete a.records[d];delete a.activeByConversation[i]})}cleanup(i=Date.now()){this.mutate(a=>{const d=this.sorted(a.records).filter((p,h)=>h<na&&(this.isActive(p.status)||i-Date.parse(p.updatedAt)<=$p));a.records=Object.fromEntries(d.map(p=>[p.executionId,p]));for(const[p,h]of Object.entries(a.activeByConversation))a.records[h]||delete a.activeByConversation[p]})}clear(){this.safeRemove(this.recordsKey),this.safeRemove(this.legacyActiveKey)}isActive(i){return["pending","running","waiting_for_review","unknown","paused"].includes(i)}sorted(i){return Object.values(i).sort((a,d)=>Date.parse(d.updatedAt)-Date.parse(a.updatedAt))}mutate(i){const a=this.read();i(a),a.revision++,this.prune(a),this.safeSet(this.recordsKey,JSON.stringify(a))}prune(i){const a=this.sorted(i.records);a.length>na&&(i.records=Object.fromEntries(a.slice(0,na).map(d=>[d.executionId,d])))}read(){const i={version:dd,revision:0,records:{},activeByConversation:{}},a=this.safeGet(this.recordsKey);if(!a)return i;try{const d=JSON.parse(a),p=Fr(d)&&d.version===dd&&Fr(d.records)?d.records:d;if(!Fr(p))return i;for(const h of Object.values(p)){if(!Fr(h))continue;const x=typeof h.boundWorkflowId=="string"?h.boundWorkflowId:h.workflowId;if(![h.channelId,x,h.conversationId,h.executionId,h.externalChatId,h.status,h.createdAt,h.updatedAt].every(R=>typeof R=="string"))continue;const b=h,{workflowId:k,...v}=b;i.records[b.executionId]={...v,boundWorkflowId:x,sessionId:b.sessionId??b.externalChatId,status:Or(b.status)},this.isActive(b.status)&&(i.activeByConversation[b.conversationId]=b.executionId)}return Fr(d)&&typeof d.revision=="number"&&(i.revision=d.revision),i}catch{return i}}safeGet(i){try{return this.storage.getItem(i)}catch{return null}}safeSet(i,a){try{this.storage.setItem(i,a)}catch{}}safeRemove(i){try{this.storage.removeItem(i)}catch{}}}class Vp{data=new Map;get length(){return this.data.size}clear(){this.data.clear()}getItem(i){return this.data.get(i)??null}key(i){return[...this.data.keys()][i]??null}removeItem(i){this.data.delete(i)}setItem(i,a){this.data.set(i,a)}}const Kp="cheng:execution-invalidated";function Gp(l){typeof window<"u"&&window.dispatchEvent(new CustomEvent(Kp,{detail:l}));try{if(typeof BroadcastChannel<"u"){const i=new BroadcastChannel("cheng-executions-v2");i.postMessage(l),i.close()}}catch{}}class Cd{config;ws=null;status="disconnected";eventHandlers=new Map;statusHandlers=new Set;activeSubscriptions=new Set;reconnectTimer=null;reconnectAttempts=0;shouldReconnect=!0;_wsGeneration=0;heartbeatTimer=null;heartbeatTimeoutTimer=null;lastPongTime=0;messageQueue=[];contractWarnedKeys=new Set;constructor(i){this.config={url:i.url,tokenProvider:i.tokenProvider,reconnect:i.reconnect??!0,reconnectInterval:i.reconnectInterval??1e3,reconnectMaxInterval:i.reconnectMaxInterval??3e4,reconnectBackoffRate:i.reconnectBackoffRate??2,reconnectMaxAttempts:i.reconnectMaxAttempts??1/0,reconnectJitter:i.reconnectJitter??!1,heartbeatInterval:i.heartbeatInterval??3e4,heartbeatTimeout:i.heartbeatTimeout??1e4,debug:i.debug??!1}}connect(){if(this.shouldReconnect=!0,this.ws?.readyState===WebSocket.OPEN){this._log("Already connected");return}if(this.ws?.readyState===WebSocket.CONNECTING){this._log("Already connecting");return}const i=this.config.tokenProvider?.(),a=i?`${this.config.url}${this.config.url.includes("?")?"&":"?"}token=${encodeURIComponent(i)}`:this.config.url;this._log(`Connecting to ${this.config.url}...`),this._setStatus("connecting");try{this._wsGeneration++,this.ws=new WebSocket(a),this._setupWebSocketHandlers(this._wsGeneration)}catch(d){this._log("Connection error:",d),this._setStatus("error"),this._scheduleReconnect()}}disconnect(){if(this._log("Disconnecting..."),this.shouldReconnect=!1,this._clearTimers(),this.messageQueue=[],this.ws){this._setStatus("disconnecting");const i=this.ws;i.readyState===WebSocket.CONNECTING?(i.onmessage=null,i.onerror=null,i.onclose=null,i.onopen=()=>i.close(1e3,"Client disconnect")):i.readyState===WebSocket.OPEN&&i.close(1e3,"Client disconnect"),this.ws=null}this._setStatus("disconnected")}subscribe(i){const a=this._serializeScope(i);if(this.activeSubscriptions.has(a)){this._log(`Already subscribed to ${a}`);return}this.activeSubscriptions.add(a);const d={type:"SUBSCRIBE",scope:i};this._send(JSON.stringify(d)),this._log(`Subscribed to ${a}`)}unsubscribe(i){const a=this._serializeScope(i);if(!this.activeSubscriptions.has(a)){this._log(`Not subscribed to ${a}`);return}this.activeSubscriptions.delete(a);const d={type:"UNSUBSCRIBE",scope:i};this._send(JSON.stringify(d)),this._log(`Unsubscribed from ${a}`)}on(i,a){this.eventHandlers.has(i)||this.eventHandlers.set(i,new Set),this.eventHandlers.get(i).add(a)}off(i,a){const d=this.eventHandlers.get(i);d&&(d.delete(a),d.size===0&&this.eventHandlers.delete(i))}onStatusChange(i){this.statusHandlers.add(i)}offStatusChange(i){this.statusHandlers.delete(i)}getStatus(){return this.status}getActiveSubscriptions(){return Array.from(this.activeSubscriptions).map(i=>this._deserializeScope(i))}_setupWebSocketHandlers(i){this.ws&&(this.ws.onopen=()=>{this._log("Connected"),setTimeout(()=>{this._setStatus("connected"),this._flushMessageQueue(),this._restoreSubscriptions(),this._startHeartbeat()},1)},this.ws.onclose=a=>{i===this._wsGeneration&&(this._log(`Connection closed: ${a.code} ${a.reason}`),this._clearTimers(),this._setStatus("disconnected"),this.shouldReconnect&&this.config.reconnect&&this._scheduleReconnect())},this.ws.onerror=a=>{this._log("WebSocket error:",a),this._setStatus("error")},this.ws.onmessage=a=>{this._handleMessage(a.data)})}_handleMessage(i){try{const a=JSON.parse(i),d=this._normalizeEnvelope(a);if(!d){this._log("Ignoring malformed envelope:",a);return}if(this._guardEnvelopeContract(a,d),this._log("Received:",d.type,d),d.type==="PONG"){this._handlePong();return}this._dispatchEvent(d)}catch(a){this._log("Failed to parse message:",a,i)}}_normalizeEnvelope(i){if(!i||typeof i!="object"||Array.isArray(i))return null;const a=this._deepCamelizeKeys(i),d=a.type;if(typeof d!="string")return null;const p=typeof a.messageId=="string"?a.messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,h=typeof a.timestamp=="string"?a.timestamp:new Date().toISOString();return{...a,messageId:p,timestamp:h,type:d}}_guardEnvelopeContract(i,a){const p=(i&&typeof i=="object"&&!Array.isArray(i)?Object.keys(i):[]).filter(k=>k.includes("_"));p.length>0&&this._warnContract(`snake:${a.type}`,`[contract-guard] WS ${a.type} contains snake_case keys: ${p.join(", ")}`);const x={MESSAGE_CREATED:["conversationId","messageId","role","content"],WORKFLOW_TRIGGERED:["conversationId","workflowId","executionId"],MESSAGE_COMPLETED:["conversationId","messageId"],NODE_STREAM_CHUNK:["executionId","nodeId","content","sequence"],NODE_STREAM_COMPLETE:["executionId","nodeId","fullContent"],NODE_STREAM_FAILED:["executionId","nodeId","error"],EXECUTION_FAILED:["executionId","error"],ERROR:["code","message"]}[a.type];if(!x)return;const b=x.filter(k=>a[k]===void 0||a[k]===null);b.length>0&&this._warnContract(`missing:${a.type}:${b.join(",")}`,`[contract-guard] WS ${a.type} missing expected fields: ${b.join(", ")}`)}_warnContract(i,a){this.contractWarnedKeys.has(i)||(this.contractWarnedKeys.add(i),console.warn(a))}_deepCamelizeKeys(i){if(Array.isArray(i))return i.map(p=>this._deepCamelizeKeys(p));if(!i||typeof i!="object")return i;const a=i,d={};for(const[p,h]of Object.entries(a))d[this._toCamelCase(p)]=this._deepCamelizeKeys(h);return d}_toCamelCase(i){return i.replace(/_([a-z])/g,(a,d)=>d.toUpperCase())}_dispatchEvent(i){const a=this.eventHandlers.get("*");a&&a.forEach(p=>{try{p(i)}catch(h){this._log("Error in wildcard handler:",h)}});const d=this.eventHandlers.get(i.type);d&&d.forEach(p=>{try{p(i)}catch(h){this._log(`Error in ${i.type} handler:`,h)}})}_send(i){const a=this._wrapEnvelope(i);this.ws?.readyState===WebSocket.OPEN?(this.ws.send(a),this._log("Sent:",a)):(this.messageQueue.push(i),this._log("Queued:",i))}_wrapEnvelope(i){try{const a=JSON.parse(i),d={messageId:`msg-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,timestamp:new Date().toISOString(),...a};return JSON.stringify(d)}catch{return i}}_flushMessageQueue(){this.messageQueue.length!==0&&(this._log(`Flushing ${this.messageQueue.length} queued messages`),this.messageQueue.forEach(i=>{this.ws?.readyState===WebSocket.OPEN&&this.ws.send(this._wrapEnvelope(i))}),this.messageQueue=[])}_restoreSubscriptions(){this.activeSubscriptions.size!==0&&(this._log(`Restoring ${this.activeSubscriptions.size} subscriptions`),this.messageQueue=this.messageQueue.filter(i=>{try{const a=JSON.parse(i);return a.type!=="SUBSCRIBE"&&a.type!=="UNSUBSCRIBE"}catch{return!0}}),this.activeSubscriptions.forEach(i=>{const d={type:"SUBSCRIBE",scope:this._deserializeScope(i)};this.ws?.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(d))}))}_scheduleReconnect(){if(!this.config.reconnect||!this.shouldReconnect)return;if(this.reconnectAttempts>=this.config.reconnectMaxAttempts){this._log(`Max reconnect attempts (${this.config.reconnectMaxAttempts}) reached, giving up`),this.shouldReconnect=!1,this._setStatus("error");return}let i=Math.min(this.config.reconnectInterval*Math.pow(this.config.reconnectBackoffRate,this.reconnectAttempts),this.config.reconnectMaxInterval);if(this.config.reconnectJitter){const a=i*.3*Math.random();i=i+a}this._log(`Reconnecting in ${Math.round(i)}ms (attempt ${this.reconnectAttempts+1}/${this.config.reconnectMaxAttempts})`),this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.reconnectAttempts++,this._setStatus("connecting"),this.connect()},i)}_startHeartbeat(){this._clearHeartbeat(),this.heartbeatTimer=setInterval(()=>{this._sendPing()},this.config.heartbeatInterval),this._sendPing()}_sendPing(){this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null);const i={type:"PING",timestamp:Date.now()};this._send(JSON.stringify(i)),this.heartbeatTimeoutTimer=setTimeout(()=>{this._log(`Heartbeat timeout (${this.config.heartbeatTimeout}ms), reconnecting...`),this.ws?.close(1e3,"Heartbeat timeout")},this.config.heartbeatTimeout)}_handlePong(){const i=Date.now(),a=this.lastPongTime?i-this.lastPongTime:0;this.lastPongTime=i,this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null),this._log(`Heartbeat OK${a?` (Δ ${a}ms)`:""}`)}_clearHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=null),this.heartbeatTimeoutTimer&&(clearTimeout(this.heartbeatTimeoutTimer),this.heartbeatTimeoutTimer=null)}_clearTimers(){this._clearHeartbeat(),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null)}_setStatus(i){this.status!==i&&(this.status=i,this._log(`Status changed: ${i}`),this.statusHandlers.forEach(a=>{try{a(i)}catch(d){this._log("Error in status handler:",d)}}))}_serializeScope(i){if(i.type==="workspace")return`ws:${i.workspaceId}`;if(i.type==="conversation")return`conv:${i.conversationId}`;if(i.type==="execution")return`exec:${i.executionId}`;throw new Error(`Unknown scope type: ${i.type}`)}_deserializeScope(i){const[a,d]=i.split(":");if(a==="ws")return{type:"workspace",workspaceId:d};if(a==="conv")return{type:"conversation",conversationId:d};if(a==="exec")return{type:"execution",executionId:d};throw new Error(`Invalid scope key: ${i}`)}_log(...i){this.config.debug&&console.log("[WsClient]",...i)}}const je=l=>typeof l=="object"&&l!==null;function Jo(l){if(Array.isArray(l))return l;if(!je(l))return[];const i=l,a=je(i.data)?i.data:void 0;return Array.isArray(a?.items)?a.items:Array.isArray(i.data)?i.data:Array.isArray(i.items)?i.items:[]}function Zo(l,i){const a=l.bound_workflow_id??l.boundWorkflowId,d=a!=null&&a!==""?String(a):"";return{id:String(l.id??""),workspaceId:String(l.workspace_id??l.workspaceId??i),channelId:String(l.channel_id??l.channelId??""),name:String(l.name??""),description:l.description!=null?String(l.description):void 0,boundWorkflowId:d,appType:typeof l.app_type=="string"?l.app_type:typeof l.appType=="string"?l.appType:void 0,connectionConfig:je(l.connection_config)?l.connection_config:je(l.connectionConfig)?l.connectionConfig:void 0,enabled:typeof l.enabled=="boolean"?l.enabled:!0,connectionState:typeof l.connection_state=="string"?l.connection_state:typeof l.connectionState=="string"?l.connectionState:void 0,setupData:je(l.setup_data)?l.setup_data:je(l.setupData)?l.setupData:void 0,webhookUrl:typeof l.webhook_url=="string"?l.webhook_url:typeof l.webhookUrl=="string"?l.webhookUrl:void 0,createdAt:String(l.created_at??l.createdAt??new Date().toISOString()),updatedAt:String(l.updated_at??l.updatedAt??l.created_at??l.createdAt??new Date().toISOString())}}function Hp(l){const a=(Array.isArray(l.tags)?l.tags:[]).find(h=>h.startsWith("chid:"));if(!a)return null;const d=je(l.metadata)?l.metadata:{},p=String(l.id??l.workflowId??l.workflow_id??"");return{id:p,workspaceId:String(d.workspace_id??d.workspaceId??""),channelId:a.slice(5),name:String(d.display_name??l.name??""),description:l.description?String(l.description):void 0,boundWorkflowId:String(d.workflow_id??d.workflowId??p),appType:typeof d.app_type=="string"?d.app_type:void 0,connectionConfig:je(d.connection_config)?d.connection_config:void 0,enabled:!0,createdAt:String(l.created_at??l.createdAt??new Date().toISOString()),updatedAt:String(l.updated_at??l.updatedAt??l.created_at??l.createdAt??new Date().toISOString())}}function Qp(l){const i=je(l.metadata)?l.metadata:{},a=l.id??l.workflow_id??l.workflowId,d=l.name??l.display_name??l.displayName??i.display_name??i.displayName??a;return{id:String(a??""),name:String(d??""),description:l.description!=null?String(l.description):void 0,state:typeof l.state=="string"?l.state:void 0,visibility:typeof l.visibility=="string"?l.visibility:void 0,tags:Array.isArray(l.tags)?l.tags.map(String):[],createdAt:typeof(l.created_at??l.createdAt)=="string"?String(l.created_at??l.createdAt):void 0,updatedAt:typeof(l.updated_at??l.updatedAt)=="string"?String(l.updated_at??l.updatedAt):void 0}}class rt{constructor(i,a){this.apiBaseUrl=i,this.tokenProvider=a}apiBaseUrl;tokenProvider;async listChannels(){let i;try{i=await this.listWorkspaces()}catch(p){if(ud(p))throw p;return this._listChannelsLegacy()}if(i.length===0)return this._listChannelsLegacy();const a=[];let d=!1;for(const p of i){const h=await this._fetchChannelsByWorkspaceSafe(p.id);h!==null&&(d=!0,a.push(...h))}return d?a:this._listChannelsLegacy()}async createChannel(i){try{const a=await this._fetch(`/workspaces/${i.workspaceId}/channels`,"POST",{channel_id:i.channelId,name:i.name,bound_workflow_id:i.boundWorkflowId,description:i.description,app_type:i.appType,connection_config:i.connectionConfig}),d=je(a)?a:void 0,p=je(d?.data)?d?.data:d??{};return Zo(p,i.workspaceId)}catch(a){if(a instanceof oi&&a.status===409){const d=je(a.body)?a.body:void 0,p=je(d?.details)?d.details:void 0,h=je(p?.existing_channel)?p.existing_channel:void 0;if(h)return Zo(h,i.workspaceId);throw new Error(`Integration with ID "${i.channelId}" already exists in this workspace.`)}if(!ra(a))throw a;return this._createChannelLegacy(i)}}async updateChannel(i){const a=await this._fetch(`/workspaces/${i.workspaceId}/channels/${i.id}`,"PATCH",{channel_id:i.channelId,name:i.name,bound_workflow_id:i.boundWorkflowId,description:i.description,app_type:i.appType,connection_config:i.connectionConfig}),d=je(a)?a:void 0,p=je(d?.data)?d?.data:d??{};return Zo(p,i.workspaceId)}async deleteChannel(i,a){if(a)try{await this._fetch(`/workspaces/${a}/channels/${i}`,"DELETE");return}catch(d){if(!ra(d))throw d}await this._fetch(`/workflows/${i}`,"DELETE")}async listWorkspaces(){const i=await this._fetch("/workspaces","GET");return Jo(i).map(d=>{const p=d;return{id:String(p.id??p.workspace_id??""),name:String(p.name??""),description:p.description?String(p.description):void 0,createdAt:String(p.created_at??p.createdAt??new Date().toISOString()),updatedAt:p.updated_at?String(p.updated_at):p.updatedAt?String(p.updatedAt):void 0}})}async createWorkspace(i){const a=await this._fetch("/workspaces","POST",{name:i.name,description:i.description}),d=je(a)?a:void 0,h=je(d?.data)?d?.data:d??{};return{id:String(h.id??h.workspace_id??""),name:String(h.name??i.name),description:h.description?String(h.description):i.description,createdAt:String(h.created_at??h.createdAt??new Date().toISOString()),updatedAt:h.updated_at?String(h.updated_at):h.updatedAt?String(h.updatedAt):void 0}}async listPublishedWorkflows(i){const a=i.workspaceId.trim();if(!a)throw new Error("workspaceId is required to list workflows");const d=i.limit??100,p=new URLSearchParams({state:"active",limit:String(d)}),h=await this._fetch(`/workflows?${p.toString()}`,"GET",void 0,a);return Jo(h).map(b=>Qp(b)).filter(b=>b.id.trim().length>0)}async getWorkflowName(i,a){const d=await this._fetch(`/workflows/${i}`,"GET",void 0,a),p=je(d)?d:void 0,x=je(p?.data)?p?.data:p??{},b=je(x.metadata)?x.metadata:void 0,k=x.name??x.display_name??x.displayName??b?.display_name??b?.displayName??x.title;return typeof k=="string"&&k.trim()?k.trim():null}async getChannelStatus(i,a){const d=await this._fetch(`/workspaces/${i}/channels/${a}/status`,"GET"),p=je(d)?d:{},h=je(p.data)?p.data:p;return{connectionState:String(h.connection_state??h.connectionState??"idle"),ok:typeof h.ok=="boolean"?h.ok:void 0,details:typeof h.details=="string"?h.details:void 0,lastMessageAt:typeof h.last_message_at=="string"?h.last_message_at:void 0,error:typeof h.error=="string"?h.error:void 0,mode:h.mode==="polling"||h.mode==="webhook"||h.mode==="stream"?h.mode:void 0,workerRunning:typeof h.worker_running=="boolean"?h.worker_running:void 0,lastPollAt:typeof h.last_poll_at=="string"?h.last_poll_at:void 0,startedAt:typeof h.started_at=="string"?h.started_at:void 0,lastEventAt:typeof h.last_event_at=="string"?h.last_event_at:void 0,lastError:typeof h.last_error=="string"?h.last_error:void 0}}async getChannelCapabilities(i,a){const d=await this._fetch(`/workspaces/${i}/channels/${a}/capabilities`,"GET"),p=je(d)?d:{},h=je(p.data)?p.data:p,x=b=>typeof b=="boolean"?b:void 0;return{raw:h,directMessage:x(h.direct_message),groupChat:x(h.group_chat),reactions:x(h.reactions),messageEdit:x(h.message_edit),messageDelete:x(h.message_delete),mediaUpload:x(h.media_upload),mediaDownload:x(h.media_download),typingIndicator:x(h.typing_indicator),readReceipts:x(h.read_receipts),webhooks:x(h.webhooks),longPolling:x(h.long_polling)}}async getChannelAuthPattern(i,a){const d=await this._fetch(`/workspaces/${i}/channels/${a}/auth-pattern`,"GET"),p=je(d)?d:{},h=je(p.data)?p.data:p,x=h.pattern??h.auth_pattern??h.authPattern;return{authPattern:Xp(x),raw:h,fields:Array.isArray(h.fields)?h.fields:void 0,webhookUrl:typeof(h.webhook_url??h.webhookUrl)=="string"?String(h.webhook_url??h.webhookUrl):void 0,oauthUrl:typeof(h.oauth_url??h.oauthUrl)=="string"?String(h.oauth_url??h.oauthUrl):void 0,instructions:typeof h.instructions=="string"?h.instructions:void 0}}async connectChannel(i,a,d){const p=await this._fetch(`/workspaces/${i}/channels/${a}/connect`,"POST",d),h=je(p)?p:{},x=je(h.data)?h.data:h;return{connectionState:String(x.connection_state??x.connectionState??"connecting"),setupData:je(x.setup_data)?x.setup_data:je(x.setupData)?x.setupData:void 0,webhookUrl:typeof(x.webhook_url??x.webhookUrl)=="string"?String(x.webhook_url??x.webhookUrl):void 0,message:typeof x.message=="string"?x.message:void 0}}async completeConnect(i,a,d){const p=await this._fetch(`/workspaces/${i}/channels/${a}/connect/complete`,"POST",d),h=je(p)?p:{},x=je(h.data)?h.data:h;return{connectionState:String(x.connection_state??x.connectionState??"active"),setupData:je(x.setup_data)?x.setup_data:je(x.setupData)?x.setupData:void 0,webhookUrl:typeof(x.webhook_url??x.webhookUrl)=="string"?String(x.webhook_url??x.webhookUrl):void 0,message:typeof x.message=="string"?x.message:void 0}}async disconnectChannel(i,a){await this._fetch(`/workspaces/${i}/channels/${a}/connect`,"DELETE")}async _fetchChannelsByWorkspaceSafe(i){try{const a=await this._fetch(`/workspaces/${i}/channels`,"GET");return Jo(a).map(p=>Zo(p,i))}catch(a){if(ra(a))return null;if(ud(a))throw a;return[]}}async _listChannelsLegacy(){const i=await this._fetch("/workflows","GET"),a=Jo(i),d=[];for(const p of a){const h=Hp(p);h&&d.push(h)}return d}async _createChannelLegacy(i){const d=(await this._listChannelsLegacy()).find(M=>M.channelId===i.channelId);if(d)return d;const p={name:i.channelId,description:i.description,tags:[`chid:${i.channelId}`],metadata:{channel_id:i.channelId,workspace_id:i.workspaceId,display_name:i.name,workflow_id:i.boundWorkflowId,app_type:i.appType,connection_config:i.connectionConfig}},h=await this._fetch("/workflows","POST",p),x=je(h)?h:void 0,k=je(x?.data)?x?.data:x??{},v=je(k.metadata)?k.metadata:{};return{id:String(k.id??k.workflowId??k.workflow_id??""),workspaceId:i.workspaceId,channelId:i.channelId,name:String(v.display_name??i.name),description:k.description?String(k.description):i.description,boundWorkflowId:String(v.workflow_id??v.workflowId??i.boundWorkflowId),appType:typeof v.app_type=="string"?v.app_type:i.appType,connectionConfig:je(v.connection_config)?v.connection_config:i.connectionConfig,enabled:!0,createdAt:String(k.created_at??k.createdAt??new Date().toISOString()),updatedAt:String(k.updated_at??k.updatedAt??k.created_at??k.createdAt??new Date().toISOString())}}async _fetch(i,a,d,p){const h=`${this.apiBaseUrl}${i}`,x=await this.tokenProvider.getAccessToken();if(!x)throw Cn("missing-access-token"),new Error("Authentication required");const b=async R=>fetch(h,{method:a,headers:{"Content-Type":"application/json",Authorization:`Bearer ${R}`,...p?.trim()?{"X-Workspace-Id":p.trim()}:{}},body:d!==void 0?JSON.stringify(d):void 0});let k=await b(x),v=!1;if(k.status===401&&this.tokenProvider.refreshAccessToken){const R=await this.tokenProvider.refreshAccessToken().catch(()=>null);R?k=await b(R):(Cn("refresh-failed"),v=!0)}if(!k.ok){k.status===401&&!v&&Cn("unauthorized");const R=await k.text().catch(()=>"");let M;try{M=JSON.parse(R)}catch{M=void 0}throw new oi(k.status,`Management API error ${k.status}: ${R}`,M)}return k.status===204||k.headers.get("content-length")==="0"?null:k.json().catch(()=>null)}}class oi extends Error{constructor(i,a,d){super(a),this.status=i,this.body=d,this.name="ManagementApiError"}status;body}function ra(l){return l instanceof oi?l.status===404||l.status===405:l instanceof Error?l.message.includes("404")||l.message.includes("405"):!1}function ud(l){return l instanceof oi?l.status===401||l.status===403:l instanceof Error?l.message.includes("401")||l.message.includes("403")||l.message.toLowerCase().includes("authentication"):!1}const pd=new Set;function Xp(l){const i=["webhook_token","webhook_signature","webhook_encrypted_signature","oauth","qr_session","stream_connection"],a=typeof l=="string"?l.toLowerCase().replace(/-/g,"_"):"";return i.includes(a)?a:(a&&!pd.has(a)&&(pd.add(a),console.warn(`[ManagementClient] Unknown auth-pattern value "${a}" from backend. Expected one of: ${i.join(", ")}. Defaulting to "webhook_token".`)),"webhook_token")}function qp(l){const{autoConnect:i=!0,enabled:a=!0,url:d,tokenProvider:p,...h}=l,x=f.useRef(!1),b=f.useRef(null),[k,v]=f.useState("disconnected"),[R,M]=f.useState([]);f.useEffect(()=>{if(!a){b.current=null,v("disconnected"),M([]);return}const ee={url:d,tokenProvider:p,...h},H=new Cd(ee);b.current=H;const X=ae=>{v(ae)};return H.onStatusChange(X),i&&!x.current&&H.connect(),()=>{H.offStatusChange(X),H.disconnect(),b.current=null}},[a,d]),f.useEffect(()=>{if(typeof window>"u")return;const ee=()=>{x.current=!0,b.current?.disconnect(),M([])};return window.addEventListener(Ur,ee),()=>{window.removeEventListener(Ur,ee)}},[]);const $=f.useCallback(()=>{if(x.current){if(!(typeof window<"u"&&!!window.localStorage.getItem(ri)))return;x.current=!1}b.current?.connect()},[]),z=f.useCallback(()=>{b.current?.disconnect()},[]),ie=f.useCallback(ee=>{b.current?.subscribe(ee),M(b.current?.getActiveSubscriptions()||[])},[]),E=f.useCallback(ee=>{b.current?.unsubscribe(ee),M(b.current?.getActiveSubscriptions()||[])},[]),W=f.useCallback((ee,H)=>{b.current?.on(ee,H)},[]),N=f.useCallback((ee,H)=>{b.current?.off(ee,H)},[]);return{status:k,connect:$,disconnect:z,subscribe:ie,unsubscribe:E,on:W,off:N,activeSubscriptions:R,isConnected:k==="connected",isConnecting:k==="connecting",isDisconnected:k==="disconnected"}}class Yp{client;ws;snapshots=new Map;listeners=new Set;timers=new Map;generations=new Map;started=!1;online=()=>{this.reconcileAll("online")};visible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.reconcileAll("visible")};constructor(i,a){this.client=new jd(i),this.ws=new Cd({url:i.wsBaseUrl,tokenProvider:a,reconnect:!0}),this.ws.on("*",this.handleEvent),this.ws.onStatusChange(this.handleStatus)}start(){this.started||(this.started=!0,this.recoverStorage(),this.ws.connect(),typeof window<"u"&&(window.addEventListener("online",this.online),document.addEventListener("visibilitychange",this.visible)),this.reconcileAll("startup"))}stop(i=!1){this.started=!1,this.ws.disconnect();for(const a of this.timers.values())clearTimeout(a);this.timers.clear(),typeof window<"u"&&(window.removeEventListener("online",this.online),document.removeEventListener("visibilitychange",this.visible)),i&&(this.snapshots.clear(),this.notify())}subscribe=i=>(this.listeners.add(i),()=>this.listeners.delete(i));getSnapshot=()=>this.snapshots;getExecution(i){return i?this.snapshots.get(i):void 0}getBySession(i){return[...this.snapshots.values()].filter(a=>(a.sessionId??a.externalChatId)===i).sort((a,d)=>Date.parse(d.updatedAt)-Date.parse(a.updatedAt))[0]}getByConversation(i){return[...this.snapshots.values()].filter(a=>a.conversationId===i).sort((a,d)=>Date.parse(d.updatedAt)-Date.parse(a.updatedAt))[0]}connect(){this.ws.connect()}subscribeScope(i){this.ws.subscribe(i)}unsubscribeScope(i){this.ws.unsubscribe(i)}on(i,a){this.ws.on(i,a)}off(i,a){this.ws.off(i,a)}register(i){const a=new Sn(i.channelId).setActive(i),d={...a,clientStatus:a.status};return this.snapshots.set(a.executionId,d),this.ws.subscribe({type:"conversation",conversationId:a.conversationId}),this.ws.subscribe({type:"execution",executionId:a.executionId}),this.notify(a),this.schedule(a.executionId,2e3),d}async reconcile(i,a="manual"){const d=this.snapshots.get(i);if(!d)return;const p=(this.generations.get(i)??0)+1;this.generations.set(i,p);try{const h=await this.client.getExecution(i);if(this.generations.get(i)!==p)return this.snapshots.get(i);const x=Bp(h),b=typeof h.error=="string"?h.error:h.error?.message,k={...d,clientStatus:x,status:x,error:b,review:h.review,lastReconciledAt:new Date().toISOString(),updatedAt:h.updatedAt??h.completedAt??new Date().toISOString(),detail:h};return this.snapshots.set(i,k),new Sn(k.channelId).upsert(k),this.notify(k),un(x)?(this.cancelTimer(i),this.ws.unsubscribe({type:"execution",executionId:i})):this.schedule(i),k}catch{if(this.generations.get(i)!==p)return this.snapshots.get(i);const h={...d,clientStatus:"unknown",status:"unknown",updatedAt:new Date().toISOString()};return this.snapshots.set(i,h),new Sn(h.channelId).upsert(h),this.notify(h),this.schedule(i),h}}async reconcileAll(i="manual"){await Promise.all([...this.snapshots.values()].filter(a=>!un(a.clientStatus)&&a.clientStatus!=="idle").map(a=>this.reconcile(a.executionId,i)))}acknowledge(i){const a=this.snapshots.get(i);if(!a||!un(a.clientStatus))return;const d=new Sn(a.channelId).acknowledge(i);d&&(this.snapshots.set(i,{...a,...d,clientStatus:"idle"}),this.notify(d))}removeSession(i){for(const a of[...this.snapshots.values()])(a.sessionId??a.externalChatId)===i&&(this.cancelTimer(a.executionId),this.ws.unsubscribe({type:"execution",executionId:a.executionId}),this.snapshots.delete(a.executionId));this.notify()}recoverStorage(){if(!(typeof localStorage>"u")){for(let i=0;i<localStorage.length;i++){const a=localStorage.key(i),d="cheng_execution_mappings_";if(!a?.startsWith(d))continue;const p=a.slice(d.length),h=new Sn(p);h.cleanup();for(const x of h.listRecoverable()){const b=x.status;this.snapshots.set(x.executionId,{...x,clientStatus:b}),!un(b)&&b!=="idle"&&(this.ws.subscribe({type:"conversation",conversationId:x.conversationId}),this.ws.subscribe({type:"execution",executionId:x.executionId}))}}this.notify()}}handleStatus=i=>{i==="connected"&&this.reconcileAll("websocket-reconnected")};handleEvent=i=>{const a=typeof i.executionId=="string"?i.executionId:void 0;if(!a||!this.snapshots.has(a))return;const d=this.snapshots.get(a);i.type==="EXECUTION_START"||i.type==="EXECUTION_PROGRESS"?this.transition(d,"running"):i.type==="AGENT_PAUSED_FOR_REVIEW"||i.type==="APPROVAL_REQUESTED"?this.transition(d,"waiting_for_review",i):i.type==="EXECUTION_COMPLETE"||i.type==="EXECUTION_FAILED"||i.type==="EXECUTION_CANCELLED"||i.type==="EXECUTION_STATE_CHANGED"?this.reconcile(a,`ws:${i.type}`):i.type==="NODE_STREAM_CHUNK"&&typeof i.sequence=="number"&&i.sequence>(d.lastStreamSequence??-1)&&this.transition(d,d.clientStatus==="pending"?"running":d.clientStatus,void 0,i.sequence)};transition(i,a,d,p){const h={...i,clientStatus:a,status:a,detail:d??i.detail,lastStreamSequence:p??i.lastStreamSequence,updatedAt:new Date().toISOString()};this.snapshots.set(i.executionId,h),new Sn(i.channelId).upsert(h),this.notify(h)}schedule(i,a){if(this.cancelTimer(i),!this.started||typeof navigator<"u"&&!navigator.onLine)return;const d=this.snapshots.get(i);if(!d||un(d.clientStatus)||d.clientStatus==="idle")return;const p=a??Math.min(3e4,2e3*2**Math.min(4,this.generations.get(i)??0)),h=typeof document<"u"&&document.visibilityState==="hidden";this.timers.set(i,setTimeout(()=>{this.reconcile(i,"poll")},h?Math.max(p,3e4):p))}cancelTimer(i){const a=this.timers.get(i);a&&clearTimeout(a),this.timers.delete(i)}notify(i){this.snapshots=new Map(this.snapshots);for(const a of this.listeners)a();Gp(i??{})}}const da=f.createContext(null);function Jp({config:l,children:i}){const a=f.useMemo(()=>{const d=new Ve(l.apiBaseUrl);return new Yp(l,()=>d.getAccessTokenSync())},[l.apiBaseUrl,l.wsBaseUrl]);return f.useEffect(()=>(a.start(),()=>a.stop(!0)),[a]),n.jsx(da.Provider,{value:a,children:i})}function Nd(){const l=f.useContext(da);if(!l)throw new Error("ExecutionCoordinatorProvider is required");return l}function Zp(){return f.useContext(da)}function eh(l){const i=Nd(),a=f.useSyncExternalStore(i.subscribe,i.getSnapshot,i.getSnapshot);return f.useMemo(()=>[...a.values()].filter(d=>d.channelId===l),[l,a])}function th(l,i){switch(i.type){case"ADD_MESSAGE":return[...l,i.message];case"UPDATE_MESSAGE":return l.map(a=>a.id===i.id?{...a,...i.updates}:a);case"REMOVE_MESSAGE":return l.filter(a=>a.id!==i.id);case"REMOVE_ASSISTANT_BY_EXEC_ID":return l.filter(a=>!(a.role==="assistant"&&a.executionId===i.executionId));case"UPDATE_AGENT_REVIEW_BY_EXEC_ID":return l.map(a=>a.executionId===i.executionId&&a.agentReview?{...a,agentReview:{...a.agentReview,...i.updates}}:a);case"REMOVE_EMPTY_ASSISTANTS":return l.filter(a=>!(a.role==="assistant"&&!a.content));case"CLEAR_MESSAGES":return[];case"SET_MESSAGES":return i.messages;default:return l}}function hd(l){return l?l.includes("No response output found in execution")?"工作流未返回任何输出（请检查工作流是否配置了节点）":l.includes("No nodes")||l.includes("0 nodes")?"工作流没有节点，请先添加节点":l.includes("timeout")||l.includes("Timeout")?"工作流执行超时":l.includes("not found")||l.includes("Not found")?"工作流或资源未找到":l:"工作流执行失败"}function nh(l){const i=l.replace(/\s+/g," ").trim();if(!i)return"新会话";const a=i.split(/\r?\n/)[0]?.trim()??i,d=a.split(/[。！？!?]/)[0]?.trim()||a,p=18;return d.length<=p?d:`${d.slice(0,p)}...`}function rh(l){if(!l)return!0;const i=l.trim();return/^(session|会话|新会话)(\s*\d+)?$/i.test(i)}const fd=new Map,oh=()=>()=>{};function ih(l){const i=Zp(),a=f.useSyncExternalStore(i?.subscribe??oh,i?.getSnapshot??(()=>fd),i?.getSnapshot??(()=>fd)),d=f.useRef(null),p=f.useRef(null),h=f.useRef(null),[x,b]=f.useReducer(th,[]),[k,v]=f.useState(!1),[R,M]=f.useState(null),[$,z]=f.useState(null),[ie,E]=f.useState(!1),W=f.useRef(""),N=f.useRef(null),G=f.useRef(null),Y=f.useRef(null),U=f.useRef(null),ee=f.useRef(new Set),H=f.useRef(new Map),X=f.useRef(Date.now()),ae=f.useRef(new Ve(l.apiBaseUrl)),re=qp({url:l.wsBaseUrl,enabled:!i,tokenProvider:()=>ae.current.getAccessTokenSync(),autoConnect:!0,debug:!1}),se=f.useCallback(_=>i?i.subscribeScope(_):re.subscribe(_),[i,re.subscribe]),te=f.useCallback(_=>i?i.unsubscribeScope(_):re.unsubscribe(_),[i,re.unsubscribe]),le=f.useCallback((_,w)=>i?i.on(_,w):re.on(_,w),[i,re.on]),Q=f.useCallback((_,w)=>i?i.off(_,w):re.off(_,w),[i,re.off]),xe=f.useCallback(()=>i?i.connect():re.connect(),[i,re.connect]),V=f.useCallback(_=>{_&&b({type:"UPDATE_AGENT_REVIEW_BY_EXEC_ID",executionId:_,updates:{status:"pending"}})},[]);f.useEffect(()=>{d.current=new jd(l),p.current=new Sd(l.channelId),h.current=new Sn(l.channelId),l.sessionId&&p.current.setActiveSessionId(l.sessionId),b({type:"CLEAR_MESSAGES"}),v(!1),M(null),z(null),W.current="",N.current=null,G.current=null,Y.current=null,U.current=null;const _=p.current.getConversationId();if(_){Y.current=_,se({type:"conversation",conversationId:_});const w=h.current.getActiveForConversation(_);if(w){U.current=w.executionId,se({type:"execution",executionId:w.executionId});const T=w.status;if(["pending","running","unknown"].includes(T)){const I=`recovered-${w.executionId}`;N.current=I,G.current=w.executionId,v(!0)}}(async()=>{try{const I=[...await d.current.getConversationMessages(_)].sort((P,S)=>new Date(P.createdAt).getTime()-new Date(S.createdAt).getTime());b({type:"SET_MESSAGES",messages:[...I.map(P=>({id:P.id,role:P.role??"assistant",content:P.content,status:"completed",createdAt:new Date(P.createdAt),executionId:P.executionId})),...w&&["pending","running","unknown"].includes(w.status)?[{id:`recovered-${w.executionId}`,role:"assistant",content:w.status==="unknown"?"正在重新连接并确认执行状态…":"",status:"streaming",executionId:w.executionId,createdAt:new Date}]:[]]})}catch{}})()}},[l.apiBaseUrl,l.channelId,l.sessionId,i,se]);const ce=f.useCallback(async _=>{const w=d.current;if(!(!w||ee.current.has(_.executionId))){ee.current.add(_.executionId);try{const P=[...await w.getConversationMessages(_.conversationId)].sort((J,pe)=>Date.parse(J.createdAt)-Date.parse(pe.createdAt)).map(J=>({id:J.id,role:J.role==="user"?"user":"assistant",content:J.content,status:"completed",executionId:J.executionId,createdAt:new Date(J.createdAt)}));let S=!1;if(_.clientStatus==="completed_unread")S=P.some(J=>J.role==="assistant"&&J.executionId===_.executionId);else if(_.clientStatus==="failed_unread"||_.clientStatus==="cancelled"){const J=_.clientStatus==="cancelled"?"执行已取消":hd(_.error||"工作流执行失败");P.push({id:`terminal-${_.executionId}`,role:"assistant",content:J,status:"error",executionId:_.executionId,createdAt:new Date(_.updatedAt)}),_.clientStatus==="failed_unread"&&M(new Error(J)),S=!0}if(b({type:"SET_MESSAGES",messages:P}),N.current=null,G.current=null,W.current="",z(null),v(!1),S)H.current.delete(_.executionId),i?.acknowledge(_.executionId),h.current?.acknowledge(_.executionId);else{ee.current.delete(_.executionId);const J=(H.current.get(_.executionId)??0)+1;H.current.set(_.executionId,J),J<10&&setTimeout(()=>{i?.reconcile(_.executionId,"terminal-result-pending")},Math.min(5e3,J*500))}}catch{ee.current.delete(_.executionId)}}},[i]);f.useEffect(()=>{if(!i||!l.sessionId)return;const _=[...a.values()].filter(w=>(w.sessionId??w.externalChatId)===l.sessionId).sort((w,T)=>Date.parse(T.updatedAt)-Date.parse(w.updatedAt))[0];_&&(Y.current=_.conversationId,U.current=_.executionId,un(_.clientStatus)?ce(_):["pending","running","unknown"].includes(_.clientStatus)&&v(!0))},[l.sessionId,i,a,ce]),f.useEffect(()=>{const _=l.boundWorkflowId?.trim();if(!_||!d.current){E(!1);return}let w=!1;return d.current.workflowSupportsAttachments(_).then(T=>{w||E(T)}).catch(()=>{w||E(!1)}),()=>{w=!0}},[l.boundWorkflowId,l.apiBaseUrl]),f.useEffect(()=>{const _=D=>D?U.current===D:!1,w=D=>{X.current=Date.now(),D.role==="assistant"&&(V(U.current),N.current?(b({type:"UPDATE_MESSAGE",id:N.current,updates:{content:D.content,status:"completed"}}),N.current=null,G.current=null):b({type:"ADD_MESSAGE",message:{id:`msg-assistant-${Date.now()}`,role:"assistant",content:D.content,status:"completed",executionId:U.current??void 0,createdAt:new Date}}),U.current&&(h.current?.updateStatus(U.current,"completed"),h.current?.clearExecution(U.current)),W.current="",z(null),v(!1))},T=D=>{V(D.executionId||U.current),v(!1),N.current&&(b({type:"REMOVE_MESSAGE",id:N.current}),N.current=null,G.current=null),b({type:"REMOVE_EMPTY_ASSISTANTS"}),U.current&&h.current?.clearExecution(U.current),U.current&&(te({type:"execution",executionId:U.current}),U.current=null)},I=D=>{X.current=Date.now();const{executionId:ke}=D;if(ke&&(U.current&&U.current!==ke&&te({type:"execution",executionId:U.current}),U.current=ke,se({type:"execution",executionId:ke}),Y.current&&h.current?.setActive({channelId:l.channelId,boundWorkflowId:D.workflowId,conversationId:Y.current,executionId:ke,externalChatId:p.current?.getOrCreateSessionId()??"",externalUserId:l.externalUserId,status:"running"}),!N.current||G.current!==ke)){const Ce=`msg-assistant-${Date.now()}`;N.current=Ce,G.current=ke,b({type:"ADD_MESSAGE",message:{id:Ce,role:"assistant",content:"",status:"streaming",executionId:ke,createdAt:new Date}})}},P=D=>{_(D.executionId)&&(z(""),W.current="")},S=D=>{_(D.executionId)&&(X.current=Date.now(),W.current+=D.content,z(W.current),N.current&&b({type:"UPDATE_MESSAGE",id:N.current,updates:{content:W.current,status:"streaming"}}))},J=D=>{_(D.executionId)&&(D.fullContent&&W.current!==D.fullContent&&(console.warn("[useChannel] Stream content mismatch:",W.current.length,"vs",D.fullContent.length),W.current=D.fullContent,z(D.fullContent),N.current&&b({type:"UPDATE_MESSAGE",id:N.current,updates:{content:D.fullContent}})),D.usage&&console.log("[useChannel] Token usage:",D.usage))},pe=D=>{_(D.executionId)&&(v(!1),M(new Error(D.error)),N.current&&b({type:"UPDATE_MESSAGE",id:N.current,updates:{status:"error",content:D.partialContent||"流式输出失败"}}))},be=D=>{_(D.executionId)&&(X.current=Date.now(),v(!1),z(null),W.current="",N.current&&(b({type:"REMOVE_MESSAGE",id:N.current}),N.current=null,G.current=null),h.current?.updateStatus(D.executionId,"paused"),b({type:"ADD_MESSAGE",message:{id:`agent-review-${D.executionId}-${D.iteration}`,role:"assistant",content:D.reason||"Agent paused for review",status:"agent_review",executionId:D.executionId,agentReview:{nodeId:D.nodeId,iteration:D.iteration,reason:D.reason||"Agent paused for review",interimReport:D.interimReport||"",suggestedNextAction:D.suggestedNextAction,status:"waiting"},createdAt:new Date}}))},me=async D=>{if(!_(D.executionId)||(V(D.executionId),!N.current))return;const ke=d.current,Ce=p.current?.getConversationId();if(!(!ke||!Ce))try{const st=(await ke.getConversationMessages(Ce)).find(at=>at.role==="assistant"&&at.executionId===D.executionId);st&&N.current&&(b({type:"UPDATE_MESSAGE",id:N.current,updates:{content:st.content,status:"completed"}}),N.current=null,G.current=null,W.current="",z(null),v(!1))}catch{}},De=D=>{const ke=D.error||D.error||"",Ce=hd(ke);M(new Error(Ce));const Ee=D.executionId||D.execution_id;Ee&&!_(Ee)||(v(!1),N.current?(b({type:"REMOVE_MESSAGE",id:N.current}),N.current=null,G.current=null):b(Ee?{type:"REMOVE_ASSISTANT_BY_EXEC_ID",executionId:Ee}:{type:"REMOVE_EMPTY_ASSISTANTS"}),Ee&&h.current?.updateStatus(Ee,"failed"))},qe=D=>{_(D.executionId)&&(X.current=Date.now(),v(!1),b({type:"ADD_MESSAGE",message:{id:`approval-${D.requestId}`,role:"assistant",content:`需要确认操作：${D.actionName}`,status:"approval",executionId:D.executionId,approval:{requestId:D.requestId,actionName:D.actionName,riskLevel:D.riskLevel,paramSummary:D.paramSummary,status:"pending"},createdAt:new Date}}))},ve=D=>{console.error("[useChannel] WebSocket error:",D.code,D.message),M(new Error(`${D.code}: ${D.message}`)),D.executionId&&N.current&&b({type:"UPDATE_MESSAGE",id:N.current,updates:{status:"error"}}),D.executionId&&h.current?.updateStatus(D.executionId,"failed")};return le("MESSAGE_CREATED",w),le("MESSAGE_COMPLETED",T),le("WORKFLOW_TRIGGERED",I),le("NODE_STREAM_START",P),le("NODE_STREAM_CHUNK",S),le("NODE_STREAM_COMPLETE",J),le("NODE_STREAM_FAILED",pe),le("AGENT_PAUSED_FOR_REVIEW",be),le("EXECUTION_FAILED",De),le("EXECUTION_COMPLETE",me),le("APPROVAL_REQUESTED",qe),le("ERROR",ve),()=>{Q("MESSAGE_CREATED",w),Q("MESSAGE_COMPLETED",T),Q("WORKFLOW_TRIGGERED",I),Q("NODE_STREAM_START",P),Q("NODE_STREAM_CHUNK",S),Q("NODE_STREAM_COMPLETE",J),Q("NODE_STREAM_FAILED",pe),Q("AGENT_PAUSED_FOR_REVIEW",be),Q("EXECUTION_FAILED",De),Q("EXECUTION_COMPLETE",me),Q("APPROVAL_REQUESTED",qe),Q("ERROR",ve)}},[le,Q,se,te,V,l.channelId,l.externalUserId]),f.useEffect(()=>{const w=setInterval(()=>{!i&&Date.now()-X.current>3e5&&re.disconnect()},3e4);return()=>clearInterval(w)},[i,re.disconnect]);const O=f.useCallback(async(_,w)=>{if(!d.current||!p.current)throw new Error("Channel client not initialized");if(!_.trim()&&(!w||w.length===0))return;X.current=Date.now(),xe(),M(null),v(!0),U.current&&(te({type:"execution",executionId:U.current}),U.current=null);const T=l.sessionId||p.current.getOrCreateSessionId(),I=p.current.listSessions().find(S=>S.id===T);_.trim()&&rh(I?.label)&&(p.current.renameSession(T,nh(_)),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cheng:session-label-updated",{detail:{channelId:l.channelId,sessionId:T}})));const P=`msg-user-${Date.now()}`;b({type:"ADD_MESSAGE",message:{id:P,role:"user",content:_,status:"sending",createdAt:new Date}});try{Y.current&&se({type:"conversation",conversationId:Y.current});const S=l.boundWorkflowId.trim();if(!S)throw new Error("Bound Workflow ID is required");const J=await d.current.execute(l.channelId,S,_,T,l.externalUserId,w);b({type:"UPDATE_MESSAGE",id:P,updates:{status:"sent"}});const{conversation_id:pe,execution_id:be}=J;if(Y.current=pe,p.current.setConversationId(pe),se({type:"conversation",conversationId:pe}),be){U.current=be,se({type:"execution",executionId:be}),h.current?.setActive({channelId:l.channelId,boundWorkflowId:S,conversationId:pe,executionId:be,externalChatId:T,externalUserId:l.externalUserId,status:"running"}),i?.register({channelId:l.channelId,boundWorkflowId:S,conversationId:pe,executionId:be,externalChatId:T,sessionId:T,externalUserId:l.externalUserId,status:"running"});let me=N.current;(!me||G.current!==be)&&(me=`msg-assistant-${Date.now()}`,N.current=me,G.current=be,b({type:"ADD_MESSAGE",message:{id:me,role:"assistant",content:"",status:"streaming",executionId:be,createdAt:new Date}}));const De=async(qe,ve,D,ke)=>{if(N.current!==D)return;const Ce=d.current;if(Ce)try{const st=(await Ce.getConversationMessages(qe)).find(at=>at.role==="assistant"&&at.executionId===ve);if(N.current!==D)return;if(st){b({type:"UPDATE_MESSAGE",id:D,updates:{content:st.content,status:"completed"}}),h.current?.updateStatus(ve,"completed"),h.current?.clearExecution(ve),N.current=null,G.current=null,W.current="",z(null),v(!1);return}}catch{if(!ke||N.current!==D)return;b({type:"REMOVE_MESSAGE",id:D}),N.current=null,G.current=null,h.current?.updateStatus(ve,"failed"),v(!1)}};setTimeout(()=>{De(pe,be,me,!1)},250)}else v(!1),console.warn("[useChannel] No execution_id returned, workflow not triggered")}catch(S){throw v(!1),M(S instanceof Error?S:new Error(String(S))),b({type:"UPDATE_MESSAGE",id:P,updates:{status:"error"}}),S}},[l.channelId,l.sessionId,l.boundWorkflowId,l.externalUserId,se,te,xe]),F=f.useCallback(()=>{b({type:"CLEAR_MESSAGES"}),Y.current=null,U.current=null,v(!1),M(null),z(null),W.current="",N.current=null,G.current=null,h.current?.clear(),p.current?.resetSession()},[]),B=f.useCallback(async(_,w,T)=>{const I=x.find(P=>P.id===_);if(!(!I?.executionId||!I.approval||!d.current)){b({type:"UPDATE_MESSAGE",id:_,updates:{approval:{...I.approval,status:"submitting"}}});try{await d.current.submitApproval(I.executionId,I.approval.requestId,w,T),b({type:"UPDATE_MESSAGE",id:_,updates:{approval:{...I.approval,status:w,reason:T}}})}catch(P){const S=P instanceof Error?P:new Error(String(P));M(S),b({type:"UPDATE_MESSAGE",id:_,updates:{approval:{...I.approval,status:"error"}}})}}},[x]),K=f.useCallback(async(_,w)=>{const T=x.find(I=>I.id===_);!T?.agentReview||T.agentReview.status!=="pending"||(b({type:"UPDATE_MESSAGE",id:_,updates:{agentReview:{...T.agentReview,status:"continuing"}}}),await O(w?.trim()||T.agentReview.suggestedNextAction?.trim()||"Continue."))},[x,O]),m=re.isConnected?"connected":re.isConnecting?"connecting":re.status==="error"?"error":"disconnected";return{messages:x,sendMessage:O,isLoading:k,connectionStatus:m,streamingContent:$,resetConversation:F,submitApproval:B,continueAgentReview:K,error:R,supportsAttachments:ie}}const gd="cheng_active_channel";function md(l,i,a,d){const p=a.trim().toLowerCase();if(l.find(x=>d&&x.id===d?!1:x.workspaceId===i&&x.channelId.trim().toLowerCase()===p))throw new Error(`Agent ID "${a.trim()}" already exists in this workspace`)}function sh(l){const[i,a]=f.useState([]),[d,p]=f.useState(null),[h,x]=f.useState(!1),[b,k]=f.useState(null),v=f.useRef(null),R=f.useRef(null),M=f.useRef(l);M.current=l;const $=f.useRef([]);$.current=i,!R.current&&l&&(R.current=new Ve(l.apiBaseUrl));const z=f.useCallback(async()=>{const U=M.current;if(!U)return;const ee=R.current;if(!ee)return;if(!await ee.getAccessToken()){const ae={id:U.channelId,workspaceId:U.workspaceId??"",channelId:U.channelId,name:"Default",boundWorkflowId:U.boundWorkflowId,createdAt:new Date().toISOString()};a([ae]),p(re=>re??ae);return}v.current||(v.current=new rt(U.apiBaseUrl,ee));const X=v.current;x(!0),k(null);try{const ae=await X.listChannels();a(ae);const re=typeof window<"u"?window.localStorage.getItem(gd):null;p(se=>se?ae.find(Q=>Q.channelId===se.channelId)??ae[0]??null:(re?ae.find(le=>le.channelId===re):null)??ae[0]??null)}catch(ae){k(ae instanceof Error?ae:new Error(String(ae)))}finally{x(!1)}},[]),ie=f.useRef(!1);f.useEffect(()=>{ie.current||(ie.current=!0,z())},[z]);const E=f.useCallback(U=>{p(U),typeof window<"u"&&window.localStorage.setItem(gd,U.channelId)},[]),W=f.useCallback(async()=>{if(v.current)return v.current;const U=M.current;if(!U)throw new Error("Workspace not selected.");const ee=R.current;if(!await ee.getAccessToken())throw new Error("Authentication required. Please log in.");return v.current=new rt(U.apiBaseUrl,ee),v.current},[]),N=f.useCallback(async U=>{md($.current,U.workspaceId,U.channelId);const H=await(await W()).createChannel(U);return await z(),E(H),H},[W,z,E]),G=f.useCallback(async U=>{md($.current,U.workspaceId,U.channelId,U.id);const H=await(await W()).updateChannel(U);return await z(),p(X=>X&&(X.id===U.id||X.channelId===U.channelId?H:X)),H},[W,z]),Y=f.useCallback(async U=>{const ee=await W(),H=$.current.find(X=>X.id===U);await ee.deleteChannel(U,H?.workspaceId),p(X=>X?.id===U?null:X),await z()},[W,z]);return{channels:i,activeChannel:d,setActiveChannel:E,createChannel:N,updateChannel:G,deleteChannel:Y,isLoading:h,error:b,refresh:z}}function ah(l){const a=f.useRef(new ca(l)).current,[d,p]=f.useState(()=>a.isAuthenticated()),[h,x]=f.useState(!1),[b,k]=f.useState(null),[v,R]=f.useState(null),M=f.useCallback(async ie=>{x(!0),k(null);try{const E=await a.login(ie);R(E.user),p(!0)}catch(E){k(E instanceof Error?E.message:String(E))}finally{x(!1)}},[a]),$=f.useCallback(()=>{a.logout(),p(!1),R(null)},[a]),z=f.useCallback(()=>{p(a.isAuthenticated())},[a]);return f.useEffect(()=>{if(typeof window>"u")return;const ie=()=>{p(!1),R(null),k("登录已过期，请重新登录。")};return window.addEventListener(Ur,ie),()=>{window.removeEventListener(Ur,ie)}},[]),{isAuthenticated:d,isLoading:h,error:b,user:v,login:M,logout:$,refresh:z}}const Id=f.createContext(null);function lh({config:l,children:i}){const a=ih(l);return n.jsx(Id.Provider,{value:a,children:i})}function ii(){const l=f.useContext(Id);if(!l)throw new Error("useChatContext must be used within a ChatProvider");return l}function ch({className:l="",showText:i=!0}){const{connectionStatus:a}=ii(),d=dh(a);return n.jsxs("div",{className:`cheng-status-indicator ${l}`,"data-status":a,children:[n.jsxs("div",{className:`cheng-status-indicator__container ${d.containerClass}`,children:[n.jsx("div",{className:`cheng-status-indicator__dot ${d.dotClass}`}),i&&n.jsx("span",{className:"cheng-status-indicator__text",children:d.text})]}),n.jsx("style",{children:uh})]})}function dh(l){switch(l){case"connected":return{text:"已连接",dotClass:"cheng-status-indicator__dot--connected",containerClass:""};case"connecting":return{text:"连接中...",dotClass:"cheng-status-indicator__dot--connecting",containerClass:"cheng-status-indicator__container--pulse"};case"disconnected":return{text:"已断开",dotClass:"cheng-status-indicator__dot--disconnected",containerClass:""};case"error":return{text:"连接错误",dotClass:"cheng-status-indicator__dot--error",containerClass:""};default:return{text:"未知状态",dotClass:"",containerClass:""}}}const uh=`
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
`;function ph({content:l,className:i="",showCursor:a=!0}){const d=f.useRef(null);return f.useEffect(()=>{d.current&&(d.current.scrollTop=d.current.scrollHeight)},[l]),n.jsxs("div",{className:`cheng-streaming-text ${i}`,ref:d,children:[n.jsxs("div",{className:"cheng-streaming-text__content",children:[l,a&&n.jsx("span",{className:"cheng-streaming-text__cursor",children:"▊"})]}),n.jsx("style",{children:hh})]})}const hh=`
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
`;function fh({message:l,className:i="",onRetry:a,onApprovalDecision:d,onAgentReviewContinue:p}){const h=l.role==="user",x=l.status==="streaming",b=l.status==="error",k=l.status==="sending",v=!!l.approval,R=!!l.agentReview;return n.jsxs("div",{className:`cheng-message-bubble ${i}`,"data-role":l.role,"data-status":l.status,children:[n.jsxs("div",{className:`cheng-message-bubble__container ${h?"cheng-message-bubble__container--user":"cheng-message-bubble__container--assistant"}`,children:[n.jsxs("div",{className:`cheng-message-bubble__bubble ${h?"cheng-message-bubble__bubble--user":"cheng-message-bubble__bubble--assistant"} ${b?"cheng-message-bubble__bubble--error":""}`,children:[!v&&!R&&(x?n.jsx(xd,{content:l.content,role:l.role,isStreaming:!0}):n.jsx(xd,{content:l.content,role:l.role})),k&&n.jsx("div",{className:"cheng-message-bubble__sending",children:n.jsx("div",{className:"cheng-message-bubble__spinner"})}),b&&a&&n.jsx("button",{className:"cheng-message-bubble__retry",onClick:()=>a(l.id),type:"button",children:"重试"}),v&&l.approval&&n.jsx(gh,{approval:l.approval,messageId:l.id,onDecision:d}),R&&l.agentReview&&n.jsx(mh,{review:l.agentReview,messageId:l.id,onContinue:p})]}),n.jsx("div",{className:"cheng-message-bubble__timestamp",children:_h(l.createdAt)})]}),n.jsx("style",{children:wh})]})}function xd({content:l,role:i,isStreaming:a=!1}){if(i!=="assistant")return n.jsx("div",{className:"cheng-message-bubble__content",children:l});const{thinkBlocks:d,visibleContent:p,hasThinkTag:h,isThinkOpen:x}=xh(l),b=p.trim().length>0;return n.jsxs("div",{className:"cheng-message-bubble__content-wrap",children:[h&&n.jsxs("details",{className:"cheng-message-bubble__think",children:[n.jsx("summary",{className:"cheng-message-bubble__think-summary",children:x?"查看思考中...":"查看思考过程"}),n.jsx("div",{className:"cheng-message-bubble__think-body",children:d.map((k,v)=>n.jsx("div",{className:"cheng-message-bubble__think-block",children:k||"思考中..."},v))})]}),b?a?n.jsx(ph,{content:p}):n.jsx("div",{className:"cheng-message-bubble__content",children:p}):a&&h&&n.jsx("div",{className:"cheng-message-bubble__thinking-label",children:"正在思考..."})]})}function gh({approval:l,messageId:i,onDecision:a}){const[d,p]=f.useState(!1),[h,x]=f.useState(""),b=l.status==="submitting",k=l.status==="approved"||l.status==="rejected",R={critical:"#b53333",high:"#b53333",medium:"#c96442",low:"#5e5d59"}[l.riskLevel.toLowerCase()]??"#5e5d59",M=l.actionName==="preset_switch"?"切换节点预设":l.actionName;let $=[];if(l.paramSummary)try{const z=typeof l.paramSummary=="string"?JSON.parse(l.paramSummary):l.paramSummary;$=Object.entries(z).map(([ie,E])=>`${ie}: ${typeof E=="object"&&E!==null?JSON.stringify(E):E}`)}catch{$=[String(l.paramSummary)]}return n.jsxs("div",{className:"cheng-approval-card",children:[n.jsxs("div",{className:"cheng-approval-card__header",children:[n.jsxs("span",{className:"cheng-approval-card__risk",style:{color:R},children:["[",l.riskLevel.toUpperCase(),"]"]}),n.jsx("span",{className:"cheng-approval-card__action",children:M})]}),$.length>0&&n.jsx("div",{className:"cheng-approval-card__params",children:$.map((z,ie)=>n.jsx("div",{className:"cheng-approval-card__param-line",children:z},ie))}),k?n.jsxs("div",{className:"cheng-approval-card__settled",children:[n.jsx("span",{children:l.status==="approved"?"✓ 已批准":"✗ 已拒绝"}),l.reason&&n.jsxs("div",{className:"cheng-approval-card__settled-reason",children:["建议：",l.reason]})]}):n.jsxs(n.Fragment,{children:[d&&n.jsx("textarea",{className:"cheng-approval-card__suggestion",value:h,onChange:z=>x(z.target.value),placeholder:"请输入修改建议…",rows:2}),n.jsxs("div",{className:"cheng-approval-card__actions",children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--approve",disabled:b,onClick:()=>a?.(i,"approved"),type:"button",children:b?"提交中…":"批准"}),d?n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:b,onClick:()=>a?.(i,"rejected",h),type:"button",children:"确认拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--cancel",disabled:b,onClick:()=>{p(!1),x("")},type:"button",children:"取消"})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--reject",disabled:b,onClick:()=>a?.(i,"rejected"),type:"button",children:"拒绝"}),n.jsx("button",{className:"cheng-approval-card__btn cheng-approval-card__btn--suggest",disabled:b,onClick:()=>p(!0),type:"button",children:"拒绝并提建议"})]})]})]})]})}function mh({review:l,messageId:i,onContinue:a}){const[d,p]=f.useState(l.suggestedNextAction||"Continue."),h=l.status==="waiting",x=l.status==="continuing",b=h||x;return n.jsxs("div",{className:"cheng-agent-review-card",children:[n.jsxs("div",{className:"cheng-agent-review-card__header",children:[n.jsx("span",{className:"cheng-agent-review-card__badge",children:"REVIEW"}),n.jsx("span",{className:"cheng-agent-review-card__title",children:"Agent paused"}),n.jsxs("span",{className:"cheng-agent-review-card__meta",children:["Iteration ",l.iteration]})]}),n.jsx("div",{className:"cheng-agent-review-card__reason",children:l.reason}),l.interimReport&&n.jsx("pre",{className:"cheng-agent-review-card__report",children:l.interimReport}),n.jsx("div",{className:"cheng-agent-review-card__suggestion",children:n.jsxs("label",{className:"cheng-agent-review-card__suggestion-label",children:["Next action",n.jsx("textarea",{className:"cheng-agent-review-card__suggestion-input",value:d,onChange:k=>p(k.target.value),rows:2,disabled:b})]})}),h&&n.jsx("div",{className:"cheng-agent-review-card__waiting",children:"Saving the paused state before resume..."}),n.jsx("button",{className:"cheng-agent-review-card__btn",disabled:b,onClick:()=>a?.(i,d.trim()||"Continue."),type:"button",children:h?"Saving...":x?"Continuing...":"Continue"})]})}function xh(l){const i=[],a=[],d="<think>",p="</think>";let h=0,x=!1;for(;h<l.length;){const b=l.indexOf(d,h);if(b===-1){a.push(l.slice(h));break}a.push(l.slice(h,b));const k=b+d.length,v=l.indexOf(p,k);if(v===-1){i.push(l.slice(k).trim()),x=!0;break}i.push(l.slice(k,v).trim()),h=v+p.length}return{thinkBlocks:i,visibleContent:a.join("").trim(),hasThinkTag:i.length>0||l.includes(d),isThinkOpen:x}}function _h(l){const i=new Date,a=i.getTime()-l.getTime();return a<60*1e3?"刚刚":a<3600*1e3?`${Math.floor(a/6e4)} 分钟前`:l.toDateString()===i.toDateString()?l.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"}):l.toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}const wh=`
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
`;function bh({className:l="",onRetry:i}){const{messages:a,submitApproval:d,continueAgentReview:p}=ii(),h=f.useRef(null),[x,b]=f.useState(!1),[k,v]=f.useState(!0),R=()=>{if(!h.current)return;const{scrollTop:$,scrollHeight:z,clientHeight:ie}=h.current,E=z-$-ie<100;b(!E),v(E)},M=($=!1)=>{if(!h.current)return;const z=h.current.scrollHeight;typeof h.current.scrollTo=="function"?h.current.scrollTo({top:z,behavior:$?"smooth":"auto"}):h.current.scrollTop=z};return f.useEffect(()=>{k&&M()},[a,k]),f.useEffect(()=>{M()},[]),n.jsxs("div",{className:`cheng-message-list ${l}`,children:[n.jsx("div",{className:"cheng-message-list__container",ref:h,onScroll:R,children:a.length===0?n.jsxs("div",{className:"cheng-message-list__empty",children:[n.jsx("div",{className:"cheng-message-list__empty-icon",children:"💬"}),n.jsx("p",{className:"cheng-message-list__empty-text",children:"开始对话吧"})]}):n.jsx("div",{className:"cheng-message-list__messages",children:a.map($=>n.jsx(fh,{message:$,onRetry:i,onApprovalDecision:d,onAgentReviewContinue:p},$.id))})}),x&&n.jsxs("button",{className:"cheng-message-list__scroll-button",onClick:()=>{M(!0),v(!0)},type:"button","aria-label":"滚动到底部",children:[n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M5 7.5L10 12.5L15 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),n.jsx("span",{className:"cheng-message-list__scroll-button-text",children:"新消息"})]}),n.jsx("style",{children:yh})]})}const yh=`
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
`;function vh(l){return new Promise((i,a)=>{const d=new FileReader;d.onload=()=>{const p=d.result,h=p.indexOf(",");i(h>=0?p.slice(h+1):p)},d.onerror=a,d.readAsDataURL(l)})}async function kh(l){return Promise.all(l.map(async i=>{const a=await vh(i);return{filename:i.name,mime_type:i.type||void 0,base64_content:a,size:i.size}}))}function jh(l){return l<1024?`${l} B`:l<1024*1024?`${(l/1024).toFixed(1)} KB`:`${(l/1024/1024).toFixed(1)} MB`}const Sh=["image/jpeg","image/png","image/gif","image/webp","image/bmp","image/svg+xml","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","text/plain","text/csv","text/markdown","audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/flac","video/mp4","video/quicktime","video/x-msvideo","video/x-matroska","video/webm"].join(",");function Ch({className:l="",placeholder:i="输入消息...",disabled:a=!1,maxLength:d=2e3,autoFocus:p=!0,channels:h=[],activeChannelId:x=null,activeChannel:b=null,onSelectChannel:k}){const{sendMessage:v,resetConversation:R,isLoading:M,supportsAttachments:$}=ii(),[z,ie]=f.useState(""),[E,W]=f.useState([]),[N,G]=f.useState(!1),Y=f.useRef(null),U=f.useRef(null),ee=f.useRef(null),H=a||M,X=!H&&(z.trim().length>0||E.length>0),ae=V=>{const ce=V.trim().toLowerCase();return ce?h.find(O=>O.channelId.toLowerCase()===ce)??h.find(O=>O.id.toLowerCase()===ce)??h.find(O=>O.name.toLowerCase()===ce)??null:null};f.useEffect(()=>{if(!N)return;const V=ce=>{U.current&&(U.current.contains(ce.target)||G(!1))};return window.addEventListener("mousedown",V),()=>{window.removeEventListener("mousedown",V)}},[N]);const re=async V=>{V.preventDefault();const ce=z.trim();if(!(!ce&&E.length===0)&&!H)try{if(E.length===0&&ce.startsWith("~")){const F=ce.slice(1).trim();if(F.toLowerCase()==="new"){R(),ie("");return}const B=ae(F);if(B&&k){k(B),R(),ie("");return}}let O;E.length>0&&(O=await kh(E)),await v(ce||" ",O),ie(""),W([]),Y.current&&(Y.current.style.height="auto")}catch(O){console.error("[InputBar] Failed to send message:",O)}},se=V=>{V.key==="Enter"&&!V.shiftKey&&(V.preventDefault(),re(V))},te=V=>{const ce=V.target.value;ie(ce),Y.current&&(Y.current.style.height="auto",Y.current.style.height=`${Math.min(Y.current.scrollHeight,120)}px`)},le=()=>{!$||H||ee.current?.click()},Q=V=>{const ce=Array.from(V.target.files??[]);ce.length!==0&&(W(O=>[...O,...ce]),V.target.value="")},xe=V=>{W(ce=>ce.filter((O,F)=>F!==V))};return n.jsxs("div",{className:`cheng-input-bar ${l}`,children:[n.jsx("form",{className:"cheng-input-bar__form",onSubmit:re,children:n.jsxs("div",{className:"cheng-input-bar__composer",children:[E.length>0&&n.jsx("div",{className:"cheng-input-bar__attachments",children:E.map((V,ce)=>n.jsxs("div",{className:"cheng-input-bar__attachment-chip",children:[n.jsx("span",{className:"cheng-input-bar__attachment-icon",children:Nh(V.type)}),n.jsx("span",{className:"cheng-input-bar__attachment-name",title:V.name,children:V.name}),n.jsx("span",{className:"cheng-input-bar__attachment-size",children:jh(V.size)}),n.jsx("button",{type:"button",className:"cheng-input-bar__attachment-remove",onClick:()=>xe(ce),"aria-label":`移除 ${V.name}`,children:n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M2 2L10 10M10 2L2 10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]},ce))}),n.jsx("textarea",{ref:Y,className:"cheng-input-bar__textarea",placeholder:i,value:z,onChange:te,onKeyDown:se,disabled:H,maxLength:d,autoFocus:p,rows:1}),n.jsxs("div",{className:"cheng-input-bar__toolbar",children:[n.jsxs("div",{className:"cheng-input-bar__toolbar-left",children:[n.jsxs("div",{className:"cheng-input-bar__attachment-wrap",children:[n.jsx("button",{className:`cheng-input-bar__icon-button${$?"":" cheng-input-bar__icon-button--disabled"}`,type:"button","aria-label":"添加附件",title:$?"添加附件（PDF / 图片 / Word / Excel / 音视频等）":"当前工作流未配置附件上传节点",onClick:le,disabled:!$||H,children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M15.5 8.5L8.5 15.5C6.843 17.157 4.157 17.157 2.5 15.5C0.843 13.843 0.843 11.157 2.5 9.5L9.5 2.5C10.657 1.343 12.343 1.343 13.5 2.5C14.657 3.657 14.657 5.343 13.5 6.5L6.5 13.5C5.948 14.052 5.052 14.052 4.5 13.5C3.948 12.948 3.948 12.052 4.5 11.5L11 5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})}),n.jsx("input",{ref:ee,type:"file",multiple:!0,accept:Sh,className:"cheng-input-bar__file-input",onChange:Q,tabIndex:-1,"aria-hidden":"true"})]}),h.length>0&&n.jsxs("div",{className:"cheng-input-bar__select-wrap",ref:U,children:[n.jsx("button",{className:"cheng-input-bar__select-button",type:"button","aria-haspopup":"listbox","aria-expanded":N,onClick:()=>G(V=>!V),children:n.jsx("span",{className:"cheng-input-bar__select-button-text",children:b?.name||h[0]?.name||"Select channel"})}),N&&n.jsx("div",{className:"cheng-input-bar__select-menu",role:"listbox","aria-label":"Channels",children:h.map(V=>{const ce=V.id===x;return n.jsxs("button",{type:"button",role:"option","aria-selected":ce,className:`cheng-input-bar__select-option${ce?" cheng-input-bar__select-option--active":""}`,onClick:()=>{k?.(V),G(!1)},children:[n.jsx("span",{className:"cheng-input-bar__select-option-name",children:V.name}),n.jsx("span",{className:"cheng-input-bar__select-option-id",children:V.channelId})]},V.id)})})]})]}),n.jsx("button",{className:"cheng-input-bar__button",type:"submit",disabled:!X,"aria-label":"发送消息",children:M?n.jsx("div",{className:"cheng-input-bar__spinner"}):n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M10 3.5V16.5M10 3.5L5 8.5M10 3.5L15 8.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]})]})}),z.length>d*.8&&n.jsxs("div",{className:"cheng-input-bar__counter",children:[z.length," / ",d]}),n.jsx("style",{children:Ih})]})}function Nh(l){return l.startsWith("image/")?"🖼":l.startsWith("audio/")?"🎵":l.startsWith("video/")?"🎬":l==="application/pdf"?"📄":l.includes("word")||l.includes("wordprocessingml")?"📝":l.includes("excel")||l.includes("spreadsheetml")?"📊":l.includes("powerpoint")||l.includes("presentationml")?"📑":"📎"}const Ih=`
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
`;function Eh({className:l="",style:i={},title:a="对话",placeholder:d="输入消息...",showStatus:p=!0,height:h="600px",channels:x=[],activeChannelId:b=null,activeChannel:k=null,onSelectChannel:v}){const{resetConversation:R,error:M}=ii();return n.jsxs("div",{className:`cheng-chat-window ${l}`,style:{...i,height:typeof h=="number"?`${h}px`:h},children:[n.jsxs("div",{className:"cheng-chat-window__header",children:[n.jsxs("div",{className:"cheng-chat-window__header-left",children:[n.jsx("h2",{className:"cheng-chat-window__title",children:a}),p&&n.jsx(ch,{})]}),n.jsx("div",{className:"cheng-chat-window__header-right",children:n.jsx("button",{className:"cheng-chat-window__reset-button",onClick:R,type:"button","aria-label":"新建对话",title:"新建对话",children:n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C8.34315 16 6.84315 15.3284 5.75736 14.2426",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),n.jsx("path",{d:"M7 10L4 10L4 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})})]}),M&&n.jsxs("div",{className:"cheng-chat-window__error",children:[n.jsx("span",{className:"cheng-chat-window__error-icon",children:"⚠️"}),n.jsx("span",{className:"cheng-chat-window__error-text",children:M.message})]}),n.jsx("div",{className:"cheng-chat-window__body",children:n.jsx(bh,{})}),n.jsx("div",{className:"cheng-chat-window__footer",children:n.jsx(Ch,{placeholder:d,channels:x,activeChannelId:b,activeChannel:k,onSelectChannel:v})}),n.jsx("style",{children:Ah})]})}const Ah=`
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
`,Th=/^[a-z0-9-]+$/,oa=["🤖","🧠","🛠️","📊","💬","🚀","🧭","✨"];function zh(l){if(!l)return"";const{avatarIcon:i,...a}=l;return Object.keys(a).length>0?JSON.stringify(a,null,2):""}function Lh({onSubmit:l,apiBaseUrl:i,onSuccess:a,isActive:d=!0,defaultAppType:p="",initialChannel:h=null,existingChannels:x=[],mode:b="create",showCancelButton:k=!1,onCancel:v,submitLabel:R="Create"}){const M=b==="edit",[$,z]=f.useState(""),[ie,E]=f.useState(""),[W,N]=f.useState(""),[G,Y]=f.useState(""),[U,ee]=f.useState(""),[H,X]=f.useState(p),[ae,re]=f.useState(oa[0]),[se,te]=f.useState(""),[le,Q]=f.useState(!1),[xe,V]=f.useState(!1),[ce,O]=f.useState(!1),[F,B]=f.useState([]),[K,m]=f.useState([]),[_,w]=f.useState(null),[T,I]=f.useState(null),[P,S]=f.useState(null),J=f.useRef(null),pe=f.useCallback(()=>{const D=h?.connectionConfig?.avatarIcon;z(h?.name??""),E(h?.channelId??""),N(h?.workspaceId??""),Y(h?.boundWorkflowId??""),ee(h?.description??""),X(h?.appType??p),re(typeof D=="string"&&D.trim()?D:oa[0]),te(zh(h?.connectionConfig)),B([]),m([]),w(null),I(null),V(!1),O(!1),S(null),Q(!1)},[p,h]);f.useEffect(()=>{pe()},[pe]);const be=f.useCallback(async()=>{if(!i){B([]),w("Missing apiBaseUrl, cannot load workspaces");return}V(!0),w(null);try{const D=new Ve(i),Ce=await new rt(i,D).listWorkspaces();B(Ce),N(Ee=>!Ee&&Ce.length>0?Ce[0].id:Ee)}catch(D){B([]),w(D instanceof Error?D.message:"Failed to load workspaces")}finally{V(!1)}},[i]);f.useEffect(()=>{!d||!i||J.current!==i&&(J.current=i,be())},[d,be]);const me=f.useCallback(async()=>{if(!i){m([]),I("Missing apiBaseUrl, cannot load workflows");return}if(!W){m([]),I(null);return}O(!0),I(null);try{const D=new Ve(i),Ce=await new rt(i,D).listPublishedWorkflows({workspaceId:W});m(Ce),Y(Ee=>!Ee&&Ce.length>0?Ce[0].id:Ee)}catch(D){m([]),I(D instanceof Error?D.message:"Failed to load published workflows")}finally{O(!1)}},[i,W]),De=f.useRef(me);De.current=me,f.useEffect(()=>{d&&W&&De.current()},[d,W]);const qe=f.useCallback(D=>{const ke=D.target.value;z(ke),E(Ce=>{const Ee=$.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return Ce===Ee||Ce===""?ke.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):Ce})},[$]),ve=f.useCallback(async D=>{if(D.preventDefault(),S(null),!$.trim()){S("Name is required");return}if(!ie.trim()){S("Channel ID is required");return}if(!W.trim()){S("Workspace ID is required");return}if(!G.trim()){S("Bound Workflow ID is required");return}if(!Th.test(ie)){S("Channel ID must only contain lowercase letters, numbers, and hyphens");return}const ke=ie.trim().toLowerCase();if(x.find(Ee=>M&&h&&Ee.id===h.id?!1:Ee.workspaceId===W.trim()&&Ee.channelId.trim().toLowerCase()===ke)){S(`Agent ID "${ie.trim()}" already exists in this workspace`);return}Q(!0);try{const st={...se.trim()?JSON.parse(se):{},avatarIcon:ae},at={name:$.trim(),channelId:ie.trim(),workspaceId:W.trim(),boundWorkflowId:G.trim(),description:U.trim()||void 0,appType:H.trim()||void 0,connectionConfig:st};M&&h?await l({id:h.id,...at}):await l(at),pe(),a?.()}catch(Ee){S(Ee instanceof SyntaxError?"Connection config must be valid JSON":Ee instanceof Error?Ee.message:M?"Failed to update agent":"Failed to create agent"),Q(!1)}},[$,ie,W,G,U,H,ae,se,h,x,M,l,pe,a]);return n.jsxs("form",{className:"cheng-channel-form",onSubmit:ve,children:[P&&n.jsx("div",{className:"cheng-channel-form__error",children:P}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-name",children:"Name *"}),n.jsx("input",{id:"cf-name",className:"cheng-channel-form__input",type:"text",value:$,onChange:qe,placeholder:"My Agent",autoFocus:!0,disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("label",{className:"cheng-channel-form__label",htmlFor:"cf-channel-id",children:["Agent ID *",n.jsxs("span",{className:"cheng-channel-form__label-hint",children:[" ","(lowercase letters, numbers, hyphens)"]})]}),n.jsx("input",{id:"cf-channel-id",className:"cheng-channel-form__input",type:"text",value:ie,onChange:D=>E(D.target.value),placeholder:"my-agent",disabled:le||M})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workspace-id",children:"Workspace *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{be()},disabled:le||xe||M,children:xe?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workspace-id",className:"cheng-channel-form__input",value:W,onChange:D=>N(D.target.value),disabled:le||xe||M,children:[n.jsx("option",{value:"",children:xe?"Loading workspaces...":"Select workspace"}),F.map(D=>n.jsx("option",{value:D.id,children:D.name||D.id},D.id))]}),_&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:_})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsxs("div",{className:"cheng-channel-form__label-row",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-workflow-id",children:"Published Workflow *"}),n.jsx("button",{type:"button",className:"cheng-channel-form__refresh",onClick:()=>{me()},disabled:le||ce,children:ce?"Loading...":"Refresh"})]}),n.jsxs("select",{id:"cf-workflow-id",className:"cheng-channel-form__input",value:G,onChange:D=>Y(D.target.value),disabled:le||ce,children:[n.jsx("option",{value:"",children:ce?"Loading published workflows...":"Select published workflow"}),K.map(D=>n.jsx("option",{value:D.id,children:D.name||D.id},D.id)),G&&!K.some(D=>D.id===G)&&n.jsx("option",{value:G,children:G})]}),T&&n.jsx("div",{className:"cheng-channel-form__field-hint cheng-channel-form__field-hint--error",children:T}),!ce&&!T&&K.length===0&&W&&n.jsx("div",{className:"cheng-channel-form__field-hint",children:"No active workflows found in this workspace. Create or activate a workflow first."})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-app-type",children:"App Type"}),n.jsx("input",{id:"cf-app-type",className:"cheng-channel-form__input",type:"text",value:H,onChange:D=>X(D.target.value),placeholder:"whatsapp / telegram / slack",disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",children:"Agent Avatar"}),n.jsx("div",{className:"cheng-channel-form__avatar-grid",role:"radiogroup","aria-label":"Agent avatar",children:oa.map(D=>{const ke=ae===D;return n.jsx("button",{type:"button",className:`cheng-channel-form__avatar-option${ke?" cheng-channel-form__avatar-option--selected":""}`,onClick:()=>re(D),"aria-pressed":ke,disabled:le,children:n.jsx("span",{className:"cheng-channel-form__avatar-emoji","aria-hidden":"true",children:D})},D)})}),n.jsx("div",{className:"cheng-channel-form__field-hint",children:"The selected avatar will be saved with this agent and shown on the agent cards."})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-desc",children:"Description"}),n.jsx("input",{id:"cf-desc",className:"cheng-channel-form__input",type:"text",value:U,onChange:D=>ee(D.target.value),placeholder:"Optional description",disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__field",children:[n.jsx("label",{className:"cheng-channel-form__label",htmlFor:"cf-conn-cfg",children:"Connection Config"}),n.jsx("textarea",{id:"cf-conn-cfg",className:"cheng-channel-form__input cheng-channel-form__textarea",value:se,onChange:D=>te(D.target.value),placeholder:'{"botToken":"..."}',rows:4,disabled:le})]}),n.jsxs("div",{className:"cheng-channel-form__footer",children:[k&&v&&n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--secondary",type:"button",onClick:v,disabled:le,children:"Cancel"}),n.jsx("button",{className:"cheng-channel-form__btn cheng-channel-form__btn--primary",type:"submit",disabled:le,children:le?M?"Saving...":"Creating...":R})]}),n.jsx("style",{children:Rh})]})}const Rh=`
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
`;function Mh({isOpen:l,onClose:i,mode:a="create",initialChannel:d=null,existingChannels:p=[],onCreate:h,onUpdate:x,apiBaseUrl:b}){const k=a==="edit";return l?n.jsx("div",{className:"cheng-modal-overlay",onClick:i,children:n.jsxs("div",{className:"cheng-modal",onClick:v=>v.stopPropagation(),children:[n.jsxs("div",{className:"cheng-modal__header",children:[n.jsxs("div",{className:"cheng-modal__header-copy",children:[n.jsx("h3",{className:"cheng-modal__title",children:k?"Edit Agent":"Create Agent"}),n.jsx("p",{className:"cheng-modal__subtitle",children:k?"Update this agent's profile, workflow binding, avatar, and runtime settings.":"Set up a new agent, connect it to a workspace, and bind the workflow it should run."})]}),n.jsx("button",{className:"cheng-modal__close",onClick:i,type:"button","aria-label":"Close",children:n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M4 4l10 10M14 4L4 14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsx("div",{className:"cheng-modal__body",children:n.jsx(Lh,{onSubmit:async v=>{if(k){if(!x)throw new Error("Update handler is not configured");await x(v);return}await h(v)},apiBaseUrl:b,onSuccess:i,isActive:l,initialChannel:d,existingChannels:p,mode:a,showCancelButton:!0,onCancel:i,submitLabel:k?"Save Changes":"Create Agent"})}),n.jsx("style",{children:Dh})]})}):null}const Dh=`
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
`,ia={pending:"Running",running:"Running",waiting_for_review:"Needs review",completed_unread:"Completed",failed_unread:"Failed",cancelled:"Cancelled",unknown:"Reconnecting"};function Ph(l){const i=new Date(l);return Number.isNaN(i.getTime())?"创建时间未知":`创建于 ${i.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}`}function Wh({sessions:l,activeSessionId:i,onSelect:a,onCreateClick:d,onDeleteSession:p,onRenameSession:h,onTogglePinSession:x}){const[b,k]=f.useState(null),[v,R]=f.useState(null),[M,$]=f.useState(""),z=f.useRef(null),ie=f.useRef(null);f.useEffect(()=>{const N=G=>{z.current&&(z.current.contains(G.target)||(k(null),R(null)))};return document.addEventListener("mousedown",N),()=>document.removeEventListener("mousedown",N)},[]),f.useEffect(()=>{v&&(ie.current?.focus(),ie.current?.select())},[v]);const E=N=>{if(!h)return;const G=M.trim();!G||G===N.label||(h(N.id,G),k(null),R(null),$(""))},W=l.length>1&&!!p;return n.jsxs("div",{className:"cheng-session-list",ref:z,children:[n.jsxs("div",{className:"cheng-session-list__header",children:[n.jsx("span",{className:"cheng-session-list__title",children:"Conversations"}),n.jsx("button",{className:"cheng-session-list__add-btn",onClick:d,type:"button","aria-label":"Create conversation",title:"Create conversation",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]}),n.jsxs("ul",{className:"cheng-session-list__items",children:[l.map(N=>n.jsxs("li",{className:`cheng-session-list__item${N.id===i?" cheng-session-list__item--active":""}`,children:[n.jsxs("button",{className:"cheng-session-list__item-main",onClick:()=>a(N),type:"button",title:N.label,children:[n.jsx("span",{className:"cheng-session-list__item-icon",title:Ph(N.createdAt),children:n.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M7 1C3.68629 1 1 3.68629 1 7C1 8.20693 1.35785 9.33012 1.97285 10.2718L1 13L3.72822 12.0272C4.66988 12.6421 5.79307 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})})}),n.jsxs("span",{className:"cheng-session-list__item-meta",children:[n.jsx("span",{className:"cheng-session-list__item-label",children:N.label}),N.executionStatus&&ia[N.executionStatus]&&n.jsx("span",{className:`cheng-session-list__status cheng-session-list__status--${N.executionStatus}`,"aria-label":`${N.label}: ${ia[N.executionStatus]}`,children:ia[N.executionStatus]})]})]}),n.jsxs("div",{className:"cheng-session-list__item-actions",children:[n.jsx("button",{className:"cheng-session-list__item-menu-trigger",type:"button","aria-label":`更多操作 ${N.label}`,title:"更多操作",onClick:G=>{G.stopPropagation(),k(Y=>Y===N.id?null:N.id)},children:n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"7",cy:"2.5",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"7",r:"1.2",fill:"currentColor"}),n.jsx("circle",{cx:"7",cy:"11.5",r:"1.2",fill:"currentColor"})]})}),b===N.id&&n.jsx("div",{className:"cheng-session-list__menu",role:"menu",children:v===N.id?n.jsxs("div",{className:"cheng-session-list__rename-wrap",children:[n.jsx("input",{ref:ie,className:"cheng-session-list__rename-input",value:M,onChange:G=>$(G.target.value),onKeyDown:G=>{G.key==="Enter"&&(G.preventDefault(),E(N)),G.key==="Escape"&&(G.preventDefault(),R(null))},maxLength:80}),n.jsxs("div",{className:"cheng-session-list__rename-actions",children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),E(N)},children:"保存"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),R(null)},children:"取消"})]})]}):n.jsxs(n.Fragment,{children:[n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),x?.(N.id),k(null)},role:"menuitem",children:N.pinned?"取消置顶":"置顶"}),n.jsx("button",{className:"cheng-session-list__menu-item",type:"button",onClick:G=>{G.stopPropagation(),R(N.id),$(N.label)},role:"menuitem",children:"重命名"}),n.jsx("button",{className:"cheng-session-list__menu-item cheng-session-list__menu-item--danger",type:"button",disabled:!W,onClick:G=>{G.stopPropagation(),p&&(p(N.id),k(null))},role:"menuitem",children:"删除"})]})})]})]},N.id)),l.length===0&&n.jsx("li",{className:"cheng-session-list__empty",children:"No conversations yet"})]}),n.jsx("style",{children:Fh})]})}const Fh=`
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
`;function Oh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"telegram-bot"}function Uh(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Bh({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:h,onCancel:x}){const[b,k]=f.useState("ready"),[v,R]=f.useState(""),[M,$]=f.useState(()=>l[0]?.id??""),[z,ie]=f.useState(""),[E,W]=f.useState(null),[N,G]=f.useState(null),[Y,U]=f.useState(null),[ee,H]=f.useState(null),[X,ae]=f.useState(!1),re=f.useRef(null),se=f.useCallback(()=>(re.current||(re.current=new rt(a,new Ve(a))),re.current),[a]),te=l.find(V=>V.id===M)??null,le=f.useCallback(async V=>{if(V.preventDefault(),!(!v.trim()||!z.trim()||!te)){W(null),k("connecting");try{const ce=Oh(v),O=await i({name:v.trim(),channelId:ce,workspaceId:te.workspaceId,boundWorkflowId:te.boundWorkflowId,appType:"telegram",description:`Telegram bot for agent: ${te.name}`});O.channelId!==ce&&ae(!0);const F=await se().connectChannel(O.workspaceId,O.id,{bot_token:z.trim(),connection_mode:"polling"}),B=F.setupData,K=B?.username??B?.bot_username??B?.first_name;K&&H(`@${K}`),U(B?.connection_mode??"polling");const m={...O,connectionState:F.connectionState,webhookUrl:F.webhookUrl,setupData:F.setupData};G(m),k("connected"),p?.(),d(m)}catch(ce){W(ce instanceof Error?ce.message:"Connection failed. Please check your bot token and try again."),k("error")}}},[v,z,te,i,se,d]);if(l.length===0)return n.jsxs("div",{className:"cheng-tg-form__no-agents",children:[n.jsx("div",{className:"cheng-tg-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-tg-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-tg-form__no-agents-desc",children:"Create an agent first, then come back to connect a Telegram bot to it. An agent defines which workflow processes incoming messages."}),h&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--secondary",onClick:h,children:"Go to Agents"}),n.jsx("style",{children:sa})]});if(b==="connected"&&N)return n.jsxs("div",{className:"cheng-tg-form__success",children:[n.jsx("div",{className:"cheng-tg-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-form__success-title",children:X?"Telegram Reconnected!":"Telegram Connected!"}),n.jsxs("p",{className:"cheng-tg-form__success-desc",children:[X&&n.jsxs("span",{className:"cheng-tg-form__existing-note",children:["An existing integration was found and reconnected."," "]}),n.jsx("strong",{children:N.name})," is now active",ee&&n.jsxs(n.Fragment,{children:[" as ",n.jsx("strong",{children:ee})]}),te&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:te.name})]}),"."]}),Y==="polling"?n.jsxs("div",{className:"cheng-tg-form__polling-notice",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),"The bot is listening for messages via polling — no public URL required."]}):null,n.jsx("p",{className:"cheng-tg-form__success-hint",children:"Your integration is listed in Connected Integrations above. Use Manage to view connection details."}),n.jsx("style",{children:sa})]});const Q=b==="connecting",xe=v.trim().length>0&&z.trim().length>0&&!!te&&!Q;return n.jsxs("form",{className:"cheng-tg-form",onSubmit:le,children:[n.jsxs("div",{className:"cheng-tg-form__instructions",children:[n.jsx("p",{className:"cheng-tg-form__instructions-title",children:"How to get your bot token"}),n.jsxs("ol",{className:"cheng-tg-form__steps",children:[n.jsxs("li",{children:["Open Telegram and search for ",n.jsx("strong",{children:"@BotFather"})]}),n.jsxs("li",{children:["Send ",n.jsx("code",{children:"/newbot"})," and follow the prompts to create your bot"]}),n.jsx("li",{children:"Copy the API token BotFather provides and paste it below"})]})]}),E&&n.jsxs("div",{className:"cheng-tg-form__error-banner",children:[n.jsx("span",{children:E}),n.jsx("button",{type:"button",className:"cheng-tg-form__retry-btn",onClick:()=>{k("ready"),W(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-name",children:["Integration Name ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("input",{id:"tg-name",className:"cheng-tg-form__input",type:"text",value:v,onChange:V=>R(V.target.value),placeholder:"Support Bot",disabled:Q,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-tg-form__hint",children:"A display name for this Telegram integration"})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-agent",children:["Agent ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-tg-form__agent-select-wrap",children:n.jsx("select",{id:"tg-agent",className:"cheng-tg-form__input cheng-tg-form__input--select",value:M,onChange:V=>$(V.target.value),disabled:Q,required:!0,children:l.map(V=>n.jsxs("option",{value:V.id,children:[Uh(V)," ",V.name]},V.id))})}),te&&n.jsxs("span",{className:"cheng-tg-form__hint",children:["Messages from this bot will be handled by ",n.jsx("strong",{children:te.name}),te.description?` — ${te.description}`:""]})]}),n.jsxs("div",{className:"cheng-tg-form__field",children:[n.jsxs("label",{className:"cheng-tg-form__label",htmlFor:"tg-token",children:["Bot Token ",n.jsx("span",{className:"cheng-tg-form__required",children:"*"}),n.jsx("span",{className:"cheng-tg-form__label-hint",children:" (from @BotFather)"})]}),n.jsx("input",{id:"tg-token",className:"cheng-tg-form__input cheng-tg-form__input--token",type:"password",value:z,onChange:V=>ie(V.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:Q,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-form__hint",children:"Keep this token secret — it grants full control over your bot"})]}),n.jsxs("div",{className:"cheng-tg-form__footer",children:[x&&n.jsx("button",{type:"button",className:"cheng-tg-form__btn cheng-tg-form__btn--ghost",onClick:x,disabled:Q,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-form__btn cheng-tg-form__btn--connect",disabled:!xe,children:Q?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-form__btn-spinner"}),"Connecting..."]}):"Connect Telegram"})]}),n.jsx("style",{children:sa})]})}const sa=`
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
`;function $h({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:h,onCancel:x}){const b=i.find(Q=>Q.boundWorkflowId===l.boundWorkflowId&&Q.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[k,v]=f.useState(b),[R,M]=f.useState(""),[$,z]=f.useState("ready"),[ie,E]=f.useState(!1),[W,N]=f.useState(null),[G,Y]=f.useState(null),U=f.useRef(null),ee=f.useCallback(()=>(U.current||(U.current=new rt(a,new Ve(a))),U.current),[a]),H=i.find(Q=>Q.id===k)??null,X=H&&(H.workspaceId!==l.workspaceId||H.boundWorkflowId!==l.boundWorkflowId),ae=i.find(Q=>Q.boundWorkflowId===l.boundWorkflowId&&Q.workspaceId===l.workspaceId)??null,re=f.useCallback(async Q=>{if(!(!R.trim()||!H)){Y(null),N(null),Q?z("saving"):E(!0);try{X&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:H.workspaceId,boundWorkflowId:H.boundWorkflowId,appType:l.appType,description:l.description});const xe=X?H.workspaceId:l.workspaceId;await ee().connectChannel(xe,l.id,{bot_token:R.trim(),connection_mode:"polling"}),p?.(),Q?(z("saved"),setTimeout(()=>h(),1200)):(z("ready"),N("Bot connected — backend is polling for Telegram messages."))}catch(xe){Y(xe instanceof Error?xe.message:"Update failed. Please try again."),z("error"),N(null)}finally{Q||E(!1)}}},[R,H,X,l,d,ee,p,h]),se=f.useCallback(async Q=>{Q.preventDefault(),await re(!0)},[re]),te=$==="saving",le=!!H&&R.trim().length>0&&!te&&!ie;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):$==="saved"?n.jsxs("div",{className:"cheng-tg-edit__success",children:[n.jsx("div",{className:"cheng-tg-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-tg-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-tg-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been reconfigured and reconnected."]}),n.jsx("style",{children:_d})]}):n.jsxs("form",{className:"cheng-tg-edit",onSubmit:se,children:[G&&n.jsxs("div",{className:"cheng-tg-edit__error-banner",children:[n.jsx("span",{children:G}),n.jsx("button",{type:"button",className:"cheng-tg-edit__retry-btn",onClick:()=>{z("ready"),Y(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-tg-edit__grid",children:[n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Choose which agent should handle messages from this Telegram bot."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("select",{className:"cheng-tg-edit__input cheng-tg-edit__input--select",value:k,onChange:Q=>v(Q.target.value),disabled:te,required:!0,children:i.map(Q=>n.jsx("option",{value:Q.id,children:Q.name},Q.id))}),H&&n.jsxs("span",{className:"cheng-tg-edit__hint",children:["Selected: ",n.jsx("strong",{children:H.name}),H.description?` — ${H.description}`:""]}),X&&H&&n.jsxs("div",{className:"cheng-tg-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:ae?.name??"the current agent"})," to"," ",n.jsx("strong",{children:H.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__card",children:[n.jsxs("div",{className:"cheng-tg-edit__card-header",children:[n.jsx("h4",{className:"cheng-tg-edit__card-title",children:"Bot Token"}),n.jsx("span",{className:"cheng-tg-edit__card-tip",children:"Paste a fresh token to reconnect this bot or rotate credentials."})]}),n.jsxs("div",{className:"cheng-tg-edit__field",children:[n.jsx("input",{className:"cheng-tg-edit__input cheng-tg-edit__input--token",type:"password",value:R,onChange:Q=>M(Q.target.value),placeholder:"123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ",disabled:te,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-tg-edit__hint",children:"Your existing token will be replaced. Get a new one from @BotFather if needed."}),W&&n.jsx("div",{className:"cheng-tg-edit__test-ok",children:W}),n.jsx("div",{className:"cheng-tg-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--secondary",disabled:!H||R.trim().length===0||te||ie,onClick:()=>{re(!1)},children:ie?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner cheng-tg-edit__spinner--dark"}),"测试中..."]}):"测试连接"})})]})]})]}),n.jsxs("div",{className:"cheng-tg-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-tg-edit__btn cheng-tg-edit__btn--ghost",onClick:x,disabled:te,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-tg-edit__btn cheng-tg-edit__btn--connect",disabled:!le,children:te?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-tg-edit__spinner"}),"Saving..."]}):"Save & Reconnect"})]}),n.jsx("style",{children:_d})]})}const _d=`
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
`;function Vh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"whatsapp-bot"}function Kh(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function Gh({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:h,onCancel:x}){const[b,k]=f.useState("ready"),[v,R]=f.useState(""),[M,$]=f.useState(()=>l[0]?.id??""),[z,ie]=f.useState(""),[E,W]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[ee,H]=f.useState("v21.0"),[X,ae]=f.useState(null),[re,se]=f.useState(null),[te,le]=f.useState(null),[Q,xe]=f.useState(null),V=f.useRef(null),ce=f.useCallback(()=>(V.current||(V.current=new rt(a,new Ve(a))),V.current),[a]),O=l.find(m=>m.id===M)??null,F=f.useCallback(async m=>{if(m.preventDefault(),!(!v.trim()||!z.trim()||!E.trim()||!N.trim()||!Y.trim()||!O)){ae(null),k("connecting");try{const _=Vh(v),w=await i({name:v.trim(),channelId:_,workspaceId:O.workspaceId,boundWorkflowId:O.boundWorkflowId,appType:"whatsapp",description:`WhatsApp integration for agent: ${O.name}`}),T=await ce().connectChannel(w.workspaceId,w.id,{phone_number_id:z.trim(),access_token:E.trim(),signing_secret:N.trim(),webhook_verify_token:Y.trim(),api_version:ee.trim()||"v21.0"}),I=T.setupData,P=T.webhookUrl??I?.webhook_url??null,S=I?.webhook_verify_token??Y.trim();le(P),xe(S);const J={...w,connectionState:T.connectionState,webhookUrl:T.webhookUrl,setupData:T.setupData};se(J),k("connected"),p?.(),d(J)}catch(_){ae(_ instanceof Error?_.message:"Connection failed. Please check your configuration and try again."),k("error")}}},[v,z,E,N,Y,ee,O,i,ce,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-wa-form__no-agents",children:[n.jsx("div",{className:"cheng-wa-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wa-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wa-form__no-agents-desc",children:"Create an agent first, then come back to connect a WhatsApp integration. An agent defines which workflow processes incoming messages."}),h&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--secondary",onClick:h,children:"Go to Agents"}),n.jsx("style",{children:aa})]});if(b==="connected"&&re)return n.jsxs("div",{className:"cheng-wa-form__success",children:[n.jsx("div",{className:"cheng-wa-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-form__success-title",children:"WhatsApp Connected!"}),n.jsxs("p",{className:"cheng-wa-form__success-desc",children:[n.jsx("strong",{children:re.name})," has been created and verified",O&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:O.name})]}),"."]}),(te||Q)&&n.jsxs("div",{className:"cheng-wa-form__webhook-box",children:[n.jsx("p",{className:"cheng-wa-form__webhook-box-title",children:"Configure Meta Console Webhook"}),te&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Webhook URL"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:te})]}),Q&&n.jsxs("div",{className:"cheng-wa-form__webhook-row",children:[n.jsx("span",{className:"cheng-wa-form__webhook-label",children:"Verify Token"}),n.jsx("code",{className:"cheng-wa-form__webhook-value",children:Q})]}),n.jsxs("ol",{className:"cheng-wa-form__meta-steps",children:[n.jsxs("li",{children:["Go to"," ",n.jsx("strong",{children:"Meta for Developers"})," → your WhatsApp app →"," ",n.jsx("strong",{children:"WhatsApp > Configuration"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Webhook"}),", click ",n.jsx("strong",{children:"Edit"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Webhook URL"})," and"," ",n.jsx("strong",{children:"Verify Token"})," shown above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Verify and Save"})]}),n.jsxs("li",{children:["Subscribe to ",n.jsx("strong",{children:"messages"})," webhook field"]})]})]}),n.jsx("p",{className:"cheng-wa-form__success-hint",children:"After configuring the webhook in Meta Console, send a test WhatsApp message to verify the full integration is working."}),x&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",onClick:x,children:"Done — Close"}),n.jsx("style",{children:aa})]});const B=b==="connecting",K=v.trim().length>0&&z.trim().length>0&&E.trim().length>0&&N.trim().length>0&&Y.trim().length>0&&!!O&&!B;return n.jsxs("form",{className:"cheng-wa-form",onSubmit:F,children:[n.jsxs("div",{className:"cheng-wa-form__instructions",children:[n.jsx("p",{className:"cheng-wa-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wa-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"Meta Business Account"})," with a verified phone number in WhatsApp Business Platform"]}),n.jsxs("li",{children:["Create a WhatsApp app in"," ",n.jsx("strong",{children:"Meta for Developers"})," and note the"," ",n.jsx("strong",{children:"Phone Number ID"})," and ",n.jsx("strong",{children:"Access Token"})]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Webhook URL"})," ","to paste into Meta Console"]})]})]}),X&&n.jsxs("div",{className:"cheng-wa-form__error-banner",children:[n.jsx("span",{children:X}),n.jsx("button",{type:"button",className:"cheng-wa-form__retry-btn",onClick:()=>{k("ready"),ae(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-name",className:"cheng-wa-form__input",type:"text",value:v,onChange:m=>R(m.target.value),placeholder:"Customer Support WA",disabled:B,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A display name for this WhatsApp integration"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-agent",children:["Agent ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wa-form__agent-select-wrap",children:n.jsx("select",{id:"wa-agent",className:"cheng-wa-form__input cheng-wa-form__input--select",value:M,onChange:m=>$(m.target.value),disabled:B,required:!0,children:l.map(m=>n.jsxs("option",{value:m.id,children:[Kh(m)," ",m.name]},m.id))})}),O&&n.jsxs("span",{className:"cheng-wa-form__hint",children:["Messages from WhatsApp will be handled by"," ",n.jsx("strong",{children:O.name}),O.description?` — ${O.description}`:""]})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-phone-id",children:["Phone Number ID ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-phone-id",className:"cheng-wa-form__input",type:"text",value:z,onChange:m=>ie(m.target.value),placeholder:"123456789012345",disabled:B,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta for Developers → WhatsApp → API Setup"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-access-token",children:["Access Token ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-access-token",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:E,onChange:m=>W(m.target.value),placeholder:"EAAxxxxxxxx...",disabled:B,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Permanent or temporary access token from Meta app dashboard"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-signing-secret",children:["App Secret"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"}),n.jsx("span",{className:"cheng-wa-form__label-hint",children:" (signing secret)"})]}),n.jsx("input",{id:"wa-signing-secret",className:"cheng-wa-form__input cheng-wa-form__input--token",type:"password",value:N,onChange:m=>G(m.target.value),placeholder:"Your app secret",disabled:B,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"Found in Meta app → Settings → Basic → App Secret. Used to verify incoming webhook signatures."})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsxs("label",{className:"cheng-wa-form__label",htmlFor:"wa-verify-token",children:["Webhook Verify Token"," ",n.jsx("span",{className:"cheng-wa-form__required",children:"*"})]}),n.jsx("input",{id:"wa-verify-token",className:"cheng-wa-form__input",type:"text",value:Y,onChange:m=>U(m.target.value),placeholder:"my-secret-verify-token",disabled:B,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"A string you choose — you'll enter this same value when configuring the webhook in Meta Console"})]}),n.jsxs("div",{className:"cheng-wa-form__field",children:[n.jsx("label",{className:"cheng-wa-form__label",htmlFor:"wa-api-version",children:"API Version"}),n.jsx("input",{id:"wa-api-version",className:"cheng-wa-form__input",type:"text",value:ee,onChange:m=>H(m.target.value),placeholder:"v21.0",disabled:B,autoComplete:"off"}),n.jsx("span",{className:"cheng-wa-form__hint",children:"WhatsApp Cloud API version — default is v21.0"})]}),n.jsxs("div",{className:"cheng-wa-form__footer",children:[x&&n.jsx("button",{type:"button",className:"cheng-wa-form__btn cheng-wa-form__btn--ghost",onClick:x,disabled:B,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-form__btn cheng-wa-form__btn--connect",disabled:!K,children:B?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-form__btn-spinner"}),"Connecting..."]}):"Connect WhatsApp"})]}),n.jsx("style",{children:aa})]})}const aa=`
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
`;function Hh({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:h,onCancel:x}){const b=l.connectionConfig??{},k=i.find(I=>I.boundWorkflowId===l.boundWorkflowId&&I.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[v,R]=f.useState(k),[M,$]=f.useState(typeof b.phone_number_id=="string"?b.phone_number_id:""),[z,ie]=f.useState(typeof b.api_version=="string"?b.api_version:"v21.0"),[E,W]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[ee,H]=f.useState("ready"),[X,ae]=f.useState(!1),[re,se]=f.useState(null),[te,le]=f.useState(null),[Q,xe]=f.useState(l.webhookUrl??null),V=f.useRef(null),ce=f.useCallback(()=>(V.current||(V.current=new rt(a,new Ve(a))),V.current),[a]),O=i.find(I=>I.id===v)??null,F=i.find(I=>I.boundWorkflowId===l.boundWorkflowId&&I.workspaceId===l.workspaceId)??null,B=O&&(O.workspaceId!==l.workspaceId||O.boundWorkflowId!==l.boundWorkflowId),K=E.trim().length>0&&N.trim().length>0&&Y.trim().length>0&&M.trim().length>0,m=f.useCallback(async I=>{if(O){le(null),se(null),I?H("saving"):ae(!0);try{if(B&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:O.workspaceId,boundWorkflowId:O.boundWorkflowId,appType:l.appType,description:l.description}),K){const P=B?O.workspaceId:l.workspaceId,S=await ce().connectChannel(P,l.id,{phone_number_id:M.trim(),access_token:E.trim(),signing_secret:N.trim(),webhook_verify_token:Y.trim(),api_version:z.trim()||"v21.0"}),J=S.setupData,pe=S.webhookUrl??J?.webhook_url??null;pe&&xe(pe)}p?.(),I?(H("saved"),setTimeout(()=>h(),1200)):(H("ready"),se(K?"Connection verified — credentials accepted.":"Agent binding updated."))}catch(P){le(P instanceof Error?P.message:"Update failed. Please try again."),H("error"),se(null)}finally{I||ae(!1)}}},[O,B,K,l,d,ce,M,E,N,Y,z,p,h]),_=f.useCallback(async I=>{I.preventDefault(),await m(!0)},[m]),w=ee==="saving",T=!!O&&(!!B||K)&&!w&&!X;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):ee==="saved"?n.jsxs("div",{className:"cheng-wa-edit__success",children:[n.jsx("div",{className:"cheng-wa-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wa-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wa-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",K?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:wd})]}):n.jsxs("form",{className:"cheng-wa-edit",onSubmit:_,children:[te&&n.jsxs("div",{className:"cheng-wa-edit__error-banner",children:[n.jsx("span",{children:te}),n.jsx("button",{type:"button",className:"cheng-wa-edit__retry-btn",onClick:()=>{H("ready"),le(null)},children:"Retry"})]}),Q&&n.jsxs("div",{className:"cheng-wa-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wa-edit__webhook-label",children:"Current Webhook URL"}),n.jsx("code",{className:"cheng-wa-edit__webhook-value",children:Q})]}),n.jsxs("div",{className:"cheng-wa-edit__grid",children:[n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("select",{className:"cheng-wa-edit__input cheng-wa-edit__input--select",value:v,onChange:I=>R(I.target.value),disabled:w,required:!0,children:i.map(I=>n.jsx("option",{value:I.id,children:I.name},I.id))}),B&&O&&n.jsxs("div",{className:"cheng-wa-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:F?.name??"current agent"})," to"," ",n.jsx("strong",{children:O.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Phone Number ID"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Pre-filled from your current configuration. Only change if the number changed."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:M,onChange:I=>$(I.target.value),placeholder:"123456789012345",disabled:w,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Access Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Fill in only to rotate credentials."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:E,onChange:I=>W(I.target.value),placeholder:"EAAxxxxxxxx... (leave blank to keep current)",disabled:w,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"App Secret"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing secret. Required when rotating Access Token."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input cheng-wa-edit__input--token",type:"password",value:N,onChange:I=>G(I.target.value),placeholder:"(leave blank to keep current)",disabled:w,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"Webhook Verify Token"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wa-edit__field",children:[n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:Y,onChange:I=>U(I.target.value),placeholder:"(leave blank to keep current)",disabled:w,autoComplete:"off"}),re&&n.jsx("div",{className:"cheng-wa-edit__test-ok",children:re}),n.jsx("div",{className:"cheng-wa-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--secondary",disabled:!K||!O||w||X,onClick:()=>{m(!1)},children:X?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner cheng-wa-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wa-edit__card",children:[n.jsxs("div",{className:"cheng-wa-edit__card-header",children:[n.jsx("h4",{className:"cheng-wa-edit__card-title",children:"API Version"}),n.jsx("span",{className:"cheng-wa-edit__card-tip",children:"WhatsApp Cloud API version — pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-wa-edit__field",children:n.jsx("input",{className:"cheng-wa-edit__input",type:"text",value:z,onChange:I=>ie(I.target.value),placeholder:"v21.0",disabled:w,autoComplete:"off"})})]})]}),!K&&n.jsxs("div",{className:"cheng-wa-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Access Token + App Secret + Verify Token to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wa-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wa-edit__btn cheng-wa-edit__btn--ghost",onClick:x,disabled:w,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wa-edit__btn cheng-wa-edit__btn--connect",disabled:!T,children:w?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wa-edit__spinner"}),"Saving..."]}):K?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:wd})]})}const wd=`
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
`;function Qh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"slack-app"}function Xh(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function qh({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:h,onCancel:x}){const[b,k]=f.useState("ready"),[v,R]=f.useState("webhook"),[M,$]=f.useState(""),[z,ie]=f.useState(()=>l[0]?.id??""),[E,W]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[ee,H]=f.useState(""),[X,ae]=f.useState(""),[re,se]=f.useState(null),[te,le]=f.useState(null),[Q,xe]=f.useState(null),[V,ce]=f.useState(null),[O,F]=f.useState(null),[B,K]=f.useState("idle"),m=f.useRef(null),_=f.useCallback(()=>(m.current||(m.current=new rt(a,new Ve(a))),m.current),[a]),w=l.find(S=>S.id===z)??null,T=f.useCallback(async S=>{S.preventDefault();const J=v==="webhook"&&M.trim()&&E.trim()&&N.trim()&&w,pe=v==="socket_mode"&&M.trim()&&E.trim()&&Y.trim()&&w;if(!J&&!pe)return;se(null),k("connecting");let be;try{const me=Qh(M);be=await i({name:M.trim(),channelId:me,workspaceId:w.workspaceId,boundWorkflowId:w.boundWorkflowId,appType:"slack",description:`Slack integration for agent: ${w.name}`})}catch(me){se(me instanceof Error?me.message:"Failed to create the channel record. Please try again."),k("error");return}xe(be);try{const me={bot_token:E.trim(),connection_mode:v};v==="webhook"?me.signing_secret=N.trim():me.app_token=Y.trim(),ee.trim()&&(me.app_id=ee.trim()),X.trim()&&(me.team_id=X.trim());const De=await _().connectChannel(be.workspaceId,be.id,me),qe=De.setupData,ve=v==="webhook"?De.webhookUrl??qe?.webhook_url??null:null;ce(ve);const D=qe?.team_name??null,ke=qe?.bot_user??null;(D||ke)&&F([D,ke?`Bot: ${ke}`:null].filter(Boolean).join(" · "));const Ce={...be,connectionState:De.connectionState,webhookUrl:De.webhookUrl,setupData:De.setupData};le(Ce),k("connected"),p?.(),d(Ce)}catch(me){p?.(),se(me instanceof Error?me.message:v==="webhook"?"Connection failed. Please check your Bot Token and Signing Secret.":"Connection failed. Please check your Bot Token and App-Level Token."),k("created")}},[v,M,E,N,Y,ee,X,w,i,_,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-sl-form__no-agents",children:[n.jsx("div",{className:"cheng-sl-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-sl-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-sl-form__no-agents-desc",children:"Create an agent first, then come back to connect a Slack app. An agent defines which workflow processes incoming messages."}),h&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:h,children:"Go to Agents"}),n.jsx("style",{children:ei})]});if(b==="connected"&&te)return n.jsxs("div",{className:"cheng-sl-form__success",children:[n.jsx("div",{className:"cheng-sl-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-form__success-title",children:"Slack Connected!"}),n.jsxs("p",{className:"cheng-sl-form__success-desc",children:[n.jsx("strong",{children:te.name})," has been created and verified",O&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-sl-form__workspace-info",children:O})]}),w&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:w.name})]}),"."]}),n.jsx("div",{className:"cheng-sl-form__mode-badge",children:v==="socket_mode"?"Socket Mode":"Webhook Mode"}),v==="webhook"&&V&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Configure Slack Event Subscriptions"}),n.jsxs("div",{className:"cheng-sl-form__webhook-row",children:[n.jsx("span",{className:"cheng-sl-form__webhook-label",children:"Request URL"}),n.jsxs("div",{className:"cheng-sl-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-sl-form__webhook-value",children:V}),n.jsx("button",{type:"button",className:"cheng-sl-form__copy-btn",onClick:()=>{navigator.clipboard.writeText(V).then(()=>{K("copied"),setTimeout(()=>K("idle"),2e3)})},children:B==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Event Subscriptions"})]}),n.jsxs("li",{children:["Enable events and paste the ",n.jsx("strong",{children:"Request URL"})," shown above"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Subscribe to bot events"}),", add:"," ",n.jsx("code",{children:"app_mention"})," and ",n.jsx("code",{children:"message.im"})," (add"," ",n.jsx("code",{children:"message.channels"})," to receive channel messages)"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"})]}),n.jsx("li",{children:"Reinstall the app to your workspace to apply scope changes"})]})]}),v==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__webhook-box",children:[n.jsx("p",{className:"cheng-sl-form__webhook-box-title",children:"Socket Mode — No Public URL Required"}),n.jsxs("ol",{className:"cheng-sl-form__slack-steps",children:[n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"api.slack.com/apps"})," → your app →"," ",n.jsx("strong",{children:"Socket Mode"})," and confirm it is ",n.jsx("strong",{children:"enabled"})]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Event Subscriptions"}),", enable events and subscribe to bot events:"," ",n.jsx("code",{children:"app_mention"}),", ",n.jsx("code",{children:"message.im"}),", ",n.jsx("code",{children:"message.channels"})]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"OAuth & Permissions"})," and ensure scopes include:"," ",n.jsx("code",{children:"chat:write"}),", ",n.jsx("code",{children:"app_mentions:read"}),","," ",n.jsx("code",{children:"im:history"}),", ",n.jsx("code",{children:"connections:write"})]}),n.jsx("li",{children:"Reinstall the app to your workspace if you added new scopes"}),n.jsx("li",{children:"The backend is now listening via WebSocket — no Event Subscriptions Request URL needed"})]})]}),n.jsx("p",{className:"cheng-sl-form__success-hint",children:v==="webhook"?"After configuring Event Subscriptions, mention your bot in a channel to verify the integration.":"Your bot is now connected via Socket Mode. Mention it in a channel or send a DM to verify."}),x&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",onClick:x,children:"Done — Close"}),n.jsx("style",{children:ei})]});if(b==="created"&&Q)return n.jsxs("div",{className:"cheng-sl-form__created-warn",children:[n.jsx("div",{className:"cheng-sl-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-sl-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-sl-form__created-warn-desc",children:[n.jsx("strong",{children:Q.name})," was created successfully, but the token validation failed",re?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:re})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),x&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--secondary",onClick:x,children:"Close"}),n.jsx("style",{children:ei})]});const I=b==="connecting",P=M.trim().length>0&&E.trim().length>0&&(v==="webhook"?N.trim().length>0:Y.trim().length>0)&&!!w&&!I;return n.jsxs("form",{className:"cheng-sl-form",onSubmit:T,children:[n.jsxs("div",{className:"cheng-sl-form__mode-toggle-wrap",children:[n.jsx("span",{className:"cheng-sl-form__mode-toggle-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-form__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${v==="webhook"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>R("webhook"),disabled:I,children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-form__mode-btn${v==="socket_mode"?" cheng-sl-form__mode-btn--active":""}`,onClick:()=>R("socket_mode"),disabled:I,children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]}),n.jsx("span",{className:"cheng-sl-form__mode-toggle-hint",children:v==="webhook"?"Requires a public HTTPS URL. Slack sends events to your server via HTTP.":"No public URL needed. Backend maintains a persistent WebSocket to Slack."})]}),n.jsxs("div",{className:"cheng-sl-form__instructions",children:[n.jsx("p",{className:"cheng-sl-form__instructions-title",children:"Before you begin"}),v==="webhook"?n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App Credentials"}),", copy the"," ",n.jsx("strong",{children:"Signing Secret"})]}),n.jsxs("li",{children:["After connecting, paste the provided ",n.jsx("strong",{children:"Request URL"})," into"," ",n.jsx("strong",{children:"Event Subscriptions"})]})]}):n.jsxs("ol",{className:"cheng-sl-form__steps",children:[n.jsxs("li",{children:["Create a Slack app at ",n.jsx("strong",{children:"api.slack.com/apps"})," and install it to your workspace"]}),n.jsxs("li",{children:["Go to ",n.jsx("strong",{children:"Socket Mode"})," in your app settings and"," ",n.jsx("strong",{children:"enable Socket Mode"})]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"OAuth & Permissions"}),", copy the"," ",n.jsx("strong",{children:"Bot User OAuth Token"})," (",n.jsx("code",{children:"xoxb-..."}),")"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),", generate a token with ",n.jsx("code",{children:"connections:write"})," scope — this is your"," ",n.jsx("strong",{children:"App-Level Token"})," (",n.jsx("code",{children:"xapp-..."}),")"]}),n.jsxs("li",{children:["Enable ",n.jsx("strong",{children:"Event Subscriptions"})," and subscribe to the bot events you need (no Request URL needed)"]})]})]}),re&&n.jsxs("div",{className:"cheng-sl-form__error-banner",children:[n.jsx("span",{children:re}),n.jsx("button",{type:"button",className:"cheng-sl-form__retry-btn",onClick:()=>{k("ready"),se(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-name",children:["Integration Name ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-name",className:"cheng-sl-form__input",type:"text",value:M,onChange:S=>$(S.target.value),placeholder:"Slack Support Bot",disabled:I,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-sl-form__hint",children:"A display name for this Slack integration"})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-agent",children:["Agent ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-sl-form__agent-select-wrap",children:n.jsx("select",{id:"sl-agent",className:"cheng-sl-form__input cheng-sl-form__input--select",value:z,onChange:S=>ie(S.target.value),disabled:I,required:!0,children:l.map(S=>n.jsxs("option",{value:S.id,children:[Xh(S)," ",S.name]},S.id))})}),w&&n.jsxs("span",{className:"cheng-sl-form__hint",children:["Messages from Slack will be handled by"," ",n.jsx("strong",{children:w.name}),w.description?` — ${w.description}`:""]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-bot-token",children:["Bot Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xoxb-...)"})]}),n.jsx("input",{id:"sl-bot-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:E,onChange:S=>W(S.target.value),placeholder:"xoxb-0000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx",disabled:I,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"OAuth & Permissions → Bot User OAuth Token"}),". Keep this secret."]})]}),v==="webhook"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-signing-secret",children:["Signing Secret ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"})]}),n.jsx("input",{id:"sl-signing-secret",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:N,onChange:S=>G(S.target.value),placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:I,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App Credentials → Signing Secret"}),". Used to verify webhook signatures."]})]}),v==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-token",children:["App-Level Token ",n.jsx("span",{className:"cheng-sl-form__required",children:"*"}),n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (xapp-...)"})]}),n.jsx("input",{id:"sl-app-token",className:"cheng-sl-form__input cheng-sl-form__input--token",type:"password",value:Y,onChange:S=>U(S.target.value),placeholder:"xapp-1-xxxxxxxxxx-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",disabled:I,required:!0,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["Found in ",n.jsx("strong",{children:"Basic Information → App-Level Tokens"}),". Must have the"," ",n.jsx("code",{children:"connections:write"})," scope. Different from the Bot Token."]})]}),n.jsxs("div",{className:"cheng-sl-form__optional-row",children:[n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-app-id",children:["App ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-app-id",className:"cheng-sl-form__input",type:"text",value:ee,onChange:S=>H(S.target.value),placeholder:"A0XXXXXXX",disabled:I,autoComplete:"off"}),n.jsxs("span",{className:"cheng-sl-form__hint",children:["From ",n.jsx("strong",{children:"Basic Information → App ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__field",children:[n.jsxs("label",{className:"cheng-sl-form__label",htmlFor:"sl-team-id",children:["Workspace ID",n.jsx("span",{className:"cheng-sl-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"sl-team-id",className:"cheng-sl-form__input",type:"text",value:X,onChange:S=>ae(S.target.value),placeholder:"T0XXXXXXX",disabled:I,autoComplete:"off"}),n.jsx("span",{className:"cheng-sl-form__hint",children:"Slack Workspace / Team ID"})]})]}),n.jsxs("div",{className:"cheng-sl-form__footer",children:[x&&n.jsx("button",{type:"button",className:"cheng-sl-form__btn cheng-sl-form__btn--ghost",onClick:x,disabled:I,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-form__btn cheng-sl-form__btn--connect",disabled:!P,children:I?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-form__btn-spinner"}),"Connecting..."]}):"Connect Slack"})]}),n.jsx("style",{children:ei})]})}const ei=`
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
`;function Yh({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:h,onCancel:x}){const b=l.connectionConfig??{},k=i.find(ve=>ve.boundWorkflowId===l.boundWorkflowId&&ve.workspaceId===l.workspaceId)?.id??i[0]?.id??"",v=typeof b.connection_mode=="string"&&b.connection_mode==="socket_mode"?"socket_mode":"webhook",[R,M]=f.useState(v),[$,z]=f.useState(k),ie=typeof b.app_id=="string"?b.app_id:"",E=typeof b.team_id=="string"?b.team_id:"",[W,N]=f.useState(ie),[G,Y]=f.useState(E),[U,ee]=f.useState(""),[H,X]=f.useState(""),[ae,re]=f.useState(""),[se,te]=f.useState("ready"),[le,Q]=f.useState(!1),[xe,V]=f.useState(null),[ce,O]=f.useState(null),[F,B]=f.useState(l.webhookUrl??null),K=f.useRef(null),m=f.useCallback(()=>(K.current||(K.current=new rt(a,new Ve(a))),K.current),[a]),_=i.find(ve=>ve.id===$)??null,w=i.find(ve=>ve.boundWorkflowId===l.boundWorkflowId&&ve.workspaceId===l.workspaceId)??null,T=_&&(_.workspaceId!==l.workspaceId||_.boundWorkflowId!==l.boundWorkflowId),I=R!==v,P=R==="webhook"?U.trim().length>0||H.trim().length>0:U.trim().length>0||ae.trim().length>0,S=R==="webhook"?U.trim().length>0&&H.trim().length>0:U.trim().length>0&&ae.trim().length>0,J=I&&!S,pe=f.useCallback(async ve=>{if(_&&!(!T&&!P&&!I)&&!J){O(null),V(null),ve?te("saving"):Q(!0);try{if(T&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:_.workspaceId,boundWorkflowId:_.boundWorkflowId,appType:l.appType,description:l.description}),P||I){const D=T?_.workspaceId:l.workspaceId,ke={connection_mode:R};U.trim()&&(ke.bot_token=U.trim()),R==="webhook"?H.trim()&&(ke.signing_secret=H.trim()):ae.trim()&&(ke.app_token=ae.trim()),ke.app_id=W.trim()||null,ke.team_id=G.trim()||null;const Ce=await m().connectChannel(D,l.id,ke),Ee=Ce.setupData;if(R==="webhook"){const st=Ce.webhookUrl??Ee?.webhook_url??null;st&&B(st)}else B(null)}if(p?.(),ve)te("saved"),setTimeout(()=>h(),1200);else{te("ready");let D;I?D=`Switched to ${R==="socket_mode"?"Socket Mode":"Webhook Mode"} and verified.`:P?D="Credentials verified — Slack integration is active.":D="Agent binding updated.",V(D)}}catch(D){O(D instanceof Error?D.message:"Update failed. Please try again."),te("error"),V(null)}finally{ve||Q(!1)}}},[_,T,P,I,J,R,l,d,m,U,H,ae,W,G,p,h]),be=f.useCallback(async ve=>{ve.preventDefault(),await pe(!0)},[pe]),me=se==="saving",De=!!_&&(P||!!T&&!I)&&!J&&!me&&!le,qe=me?null:P||I?"Save & Reconnect":"Save";return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):se==="saved"?n.jsxs("div",{className:"cheng-sl-edit__success",children:[n.jsx("div",{className:"cheng-sl-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-sl-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-sl-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",P||I?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:bd})]}):n.jsxs("form",{className:"cheng-sl-edit",onSubmit:be,children:[ce&&n.jsxs("div",{className:"cheng-sl-edit__error-banner",children:[n.jsx("span",{children:ce}),n.jsx("button",{type:"button",className:"cheng-sl-edit__retry-btn",onClick:()=>{te("ready"),O(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-sl-edit__mode-section",children:[n.jsxs("div",{className:"cheng-sl-edit__mode-header",children:[n.jsx("span",{className:"cheng-sl-edit__mode-label",children:"Connection Mode"}),n.jsxs("div",{className:"cheng-sl-edit__mode-toggle",children:[n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${R==="webhook"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>M("webhook"),disabled:me,children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),"Webhook"]}),n.jsxs("button",{type:"button",className:`cheng-sl-edit__mode-btn${R==="socket_mode"?" cheng-sl-edit__mode-btn--active":""}`,onClick:()=>M("socket_mode"),disabled:me,children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]})]})]}),I&&n.jsxs("div",{className:"cheng-sl-edit__mode-change-warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Switching from ",n.jsx("strong",{children:v==="webhook"?"Webhook":"Socket Mode"})," to"," ",n.jsx("strong",{children:R==="webhook"?"Webhook":"Socket Mode"}),". You must provide"," ",R==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to complete the switch — saving will trigger a full reconnect."]})]}),R==="webhook"&&F&&n.jsxs("div",{className:"cheng-sl-edit__webhook-info",children:[n.jsx("span",{className:"cheng-sl-edit__webhook-label",children:"Event Subscriptions Request URL"}),n.jsx("code",{className:"cheng-sl-edit__webhook-value",children:F}),n.jsxs("span",{className:"cheng-sl-edit__webhook-hint",children:["Paste this URL in your Slack app's ",n.jsx("strong",{children:"Event Subscriptions"})," settings."]})]}),R==="socket_mode"&&!I&&n.jsxs("div",{className:"cheng-sl-edit__socket-info",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),"Connected via Socket Mode — no Event Subscriptions Request URL needed. The backend maintains a persistent WebSocket to Slack."]}),n.jsxs("div",{className:"cheng-sl-edit__grid",children:[n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("select",{className:"cheng-sl-edit__input cheng-sl-edit__input--select",value:$,onChange:ve=>z(ve.target.value),disabled:me,required:!0,children:i.map(ve=>n.jsx("option",{value:ve.id,children:ve.name},ve.id))}),T&&_&&n.jsxs("div",{className:"cheng-sl-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:w?.name??"current agent"})," to"," ",n.jsx("strong",{children:_.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Bot Token"}),n.jsxs("span",{className:"cheng-sl-edit__card-tip",children:["Leave blank to keep the existing token (",n.jsx("code",{children:"xoxb-..."}),"). Fill in only to rotate."]})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:U,onChange:ve=>ee(ve.target.value),placeholder:"xoxb-... (leave blank to keep current)",disabled:me,autoComplete:"off"})})]}),R==="webhook"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Signing Secret"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:I?"Required to activate Webhook Mode. Found in Basic Information → App Credentials.":"Leave blank to keep the existing secret. Fill in to rotate it independently."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:H,onChange:ve=>X(ve.target.value),placeholder:I?"Required for Webhook Mode":"(leave blank to keep current)",disabled:me,autoComplete:"off"}),xe&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:xe}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!P||!_||me||le||J,onClick:()=>{pe(!1)},children:le?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),R==="socket_mode"&&n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App-Level Token"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:I?"Required to activate Socket Mode. Generate in Basic Information → App-Level Tokens with connections:write scope.":"Leave blank to keep the existing token (xapp-...). Fill in only to rotate."})]}),n.jsxs("div",{className:"cheng-sl-edit__field",children:[n.jsx("input",{className:"cheng-sl-edit__input cheng-sl-edit__input--token",type:"password",value:ae,onChange:ve=>re(ve.target.value),placeholder:I?"xapp-... (required for Socket Mode)":"xapp-... (leave blank to keep current)",disabled:me,autoComplete:"off"}),xe&&n.jsx("div",{className:"cheng-sl-edit__test-ok",children:xe}),n.jsx("div",{className:"cheng-sl-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--secondary",disabled:!P||!_||me||le||J,onClick:()=>{pe(!1)},children:le?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner cheng-sl-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"App ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:P?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:W,onChange:ve=>N(ve.target.value),placeholder:"A0XXXXXXX",disabled:me||!P,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-sl-edit__card",children:[n.jsxs("div",{className:"cheng-sl-edit__card-header",children:[n.jsx("h4",{className:"cheng-sl-edit__card-title",children:"Workspace ID"}),n.jsx("span",{className:"cheng-sl-edit__card-tip",children:P?"Will be saved when you reconnect. Clear the field to remove it.":"Provide credentials to make this editable. Not saved independently."})]}),n.jsx("div",{className:"cheng-sl-edit__field",children:n.jsx("input",{className:"cheng-sl-edit__input",type:"text",value:G,onChange:ve=>Y(ve.target.value),placeholder:"T0XXXXXXX",disabled:me||!P,autoComplete:"off"})})]})]}),!P&&!I&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),R==="webhook"?"Fill in Bot Token or Signing Secret (or both) to reconnect. Leave blank to only update the agent.":"Fill in Bot Token or App-Level Token (or both) to reconnect. Leave blank to only update the agent."]}),J&&n.jsxs("div",{className:"cheng-sl-edit__creds-hint cheng-sl-edit__creds-hint--warn",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Mode change requires credentials to reconnect. Provide"," ",R==="webhook"?"Bot Token + Signing Secret":"Bot Token + App-Level Token"," ","to proceed."]}),n.jsxs("div",{className:"cheng-sl-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-sl-edit__btn cheng-sl-edit__btn--ghost",onClick:x,disabled:me,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-sl-edit__btn cheng-sl-edit__btn--connect",disabled:!De,children:me?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-sl-edit__spinner"}),"Saving..."]}):qe})]}),n.jsx("style",{children:bd})]})}const bd=`
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
`;function Jh(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"wecom-bot"}function Zh(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function ef({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:h,onCancel:x}){const[b,k]=f.useState("ready"),[v,R]=f.useState(""),[M,$]=f.useState(()=>l[0]?.id??""),[z,ie]=f.useState(""),[E,W]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[ee,H]=f.useState(""),[X,ae]=f.useState(""),[re,se]=f.useState(null),[te,le]=f.useState(null),[Q,xe]=f.useState(null),[V,ce]=f.useState(null),[O,F]=f.useState({}),B=f.useRef(null),K=f.useCallback(()=>(B.current||(B.current=new rt(a,new Ve(a))),B.current),[a]),m=l.find(P=>P.id===M)??null,_=f.useCallback((P,S)=>{navigator.clipboard.writeText(S).then(()=>{F(J=>({...J,[P]:"copied"})),setTimeout(()=>F(J=>({...J,[P]:"idle"})),2e3)})},[]),w=f.useCallback(async P=>{if(P.preventDefault(),!v.trim()||!z.trim()||!E.trim()||!N.trim()||!Y.trim()||!ee.trim()||!m)return;se(null),k("connecting");let S;try{const J=Jh(v);S=await i({name:v.trim(),channelId:J,workspaceId:m.workspaceId,boundWorkflowId:m.boundWorkflowId,appType:"wecom",description:`WeCom integration for agent: ${m.name}`})}catch(J){se(J instanceof Error?J.message:"Failed to create the channel record. Please try again."),k("error");return}xe(S);try{const J={corp_id:z.trim(),agent_id:E.trim(),corp_secret:N.trim(),token:Y.trim(),encoding_aes_key:ee.trim()};X.trim()&&(J.receive_id=X.trim());const pe=await K().connectChannel(S.workspaceId,S.id,J),be=pe.setupData;ce({webhookUrl:pe.webhookUrl??be?.webhook_url??void 0,token:be?.callback_token??Y.trim(),encodingAesKeyMasked:be?.encoding_aes_key_masked??void 0,corpId:be?.corp_id??z.trim(),agentId:be?.agent_id??E.trim()});const me={...S,connectionState:pe.connectionState,webhookUrl:pe.webhookUrl,setupData:pe.setupData};le(me),k("connected"),p?.(),d(me)}catch(J){p?.(),se(J instanceof Error?J.message:"Connection failed. Please check your Corp ID and Corp Secret."),k("created")}},[v,z,E,N,Y,ee,X,m,i,K,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-wc-form__no-agents",children:[n.jsx("div",{className:"cheng-wc-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-wc-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-wc-form__no-agents-desc",children:"Create an agent first, then come back to connect a WeCom integration. An agent defines which workflow processes incoming messages."}),h&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:h,children:"Go to Agents"}),n.jsx("style",{children:ti})]});if(b==="connected"&&te)return n.jsxs("div",{className:"cheng-wc-form__success",children:[n.jsx("div",{className:"cheng-wc-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-form__success-title",children:"WeCom Credentials Verified!"}),n.jsxs("p",{className:"cheng-wc-form__success-desc",children:[n.jsx("strong",{children:te.name})," has been created and the Corp Secret has been verified",m&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:m.name})]}),"."]}),n.jsx("div",{className:"cheng-wc-form__status-badge cheng-wc-form__status-badge--configuring",children:"Configuring — Awaiting Callback Setup"}),V&&n.jsxs("div",{className:"cheng-wc-form__webhook-box",children:[n.jsx("p",{className:"cheng-wc-form__webhook-box-title",children:"Configure WeCom Admin Console Callback"}),V.webhookUrl&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Callback URL"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:V.webhookUrl}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>_("webhookUrl",V.webhookUrl),children:O.webhookUrl==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),V.token&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"Token"}),n.jsxs("div",{className:"cheng-wc-form__webhook-url-row",children:[n.jsx("code",{className:"cheng-wc-form__webhook-value",children:V.token}),n.jsx("button",{type:"button",className:"cheng-wc-form__copy-btn",onClick:()=>_("token",V.token),children:O.token==="copied"?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):n.jsxs(n.Fragment,{children:[n.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),n.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})})]})]}),V.encodingAesKeyMasked&&n.jsxs("div",{className:"cheng-wc-form__webhook-row",children:[n.jsx("span",{className:"cheng-wc-form__webhook-label",children:"EncodingAESKey"}),n.jsx("code",{className:"cheng-wc-form__webhook-value cheng-wc-form__webhook-value--muted",children:V.encodingAesKeyMasked})]}),n.jsxs("ol",{className:"cheng-wc-form__steps-list",children:[n.jsxs("li",{children:["Log in to"," ",n.jsx("strong",{children:"WeCom Admin Console"})," → ",n.jsx("strong",{children:"App Management"})," → select your custom app"]}),n.jsxs("li",{children:["Under ",n.jsx("strong",{children:"Receive Messages"}),", click ",n.jsx("strong",{children:"Set"})]}),n.jsxs("li",{children:["Paste the ",n.jsx("strong",{children:"Callback URL"})," into the URL field"]}),n.jsxs("li",{children:["Enter the same ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," ","you configured above"]}),n.jsxs("li",{children:["Click ",n.jsx("strong",{children:"Save"})," — WeCom will send a GET challenge to verify the URL"]}),n.jsxs("li",{children:["Once verified, the connection state will switch from"," ",n.jsx("em",{children:"Configuring"})," to ",n.jsx("em",{children:"Active"})]})]})]}),n.jsx("p",{className:"cheng-wc-form__success-hint",children:"The connection is not fully active until WeCom Admin Console successfully verifies the callback URL. After saving the callback config, send a test message to confirm end-to-end flow."}),x&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",onClick:x,children:"Done — Close"}),n.jsx("style",{children:ti})]});if(b==="created"&&Q)return n.jsxs("div",{className:"cheng-wc-form__created-warn",children:[n.jsx("div",{className:"cheng-wc-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-wc-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-wc-form__created-warn-desc",children:[n.jsx("strong",{children:Q.name})," was created successfully, but credential validation failed",re?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:re})]}):"."," The channel is now listed in Connected Integrations — open ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),x&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--secondary",onClick:x,children:"Close"}),n.jsx("style",{children:ti})]});const T=b==="connecting",I=v.trim().length>0&&z.trim().length>0&&E.trim().length>0&&N.trim().length>0&&Y.trim().length>0&&ee.trim().length>0&&!!m&&!T;return n.jsxs("form",{className:"cheng-wc-form",onSubmit:w,children:[n.jsxs("div",{className:"cheng-wc-form__instructions",children:[n.jsx("p",{className:"cheng-wc-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-wc-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"WeCom Enterprise Account"})," with a created"," ",n.jsx("strong",{children:"Custom App"})," (自建应用)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Management"}),", note the ",n.jsx("strong",{children:"Corp ID"}),","," ",n.jsx("strong",{children:"AgentId"}),", and ",n.jsx("strong",{children:"App Secret"})]}),n.jsxs("li",{children:["Create a ",n.jsx("strong",{children:"Token"})," and ",n.jsx("strong",{children:"EncodingAESKey"})," of your choice — you'll use these when configuring the callback in WeCom Admin Console"]}),n.jsxs("li",{children:["After connecting, you'll receive a ",n.jsx("strong",{children:"Callback URL"})," to paste into the Receive Messages settings"]})]})]}),re&&b!=="created"&&n.jsxs("div",{className:"cheng-wc-form__error-banner",children:[n.jsx("span",{children:re}),n.jsx("button",{type:"button",className:"cheng-wc-form__retry-btn",onClick:()=>{k("ready"),se(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-name",children:["Integration Name ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-name",className:"cheng-wc-form__input",type:"text",value:v,onChange:P=>R(P.target.value),placeholder:"WeCom Customer Support",disabled:T,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A display name for this WeCom integration"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent",children:["Agent ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-wc-form__agent-select-wrap",children:n.jsx("select",{id:"wc-agent",className:"cheng-wc-form__input cheng-wc-form__input--select",value:M,onChange:P=>$(P.target.value),disabled:T,required:!0,children:l.map(P=>n.jsxs("option",{value:P.id,children:[Zh(P)," ",P.name]},P.id))})}),m&&n.jsxs("span",{className:"cheng-wc-form__hint",children:["Messages from WeCom will be handled by"," ",n.jsx("strong",{children:m.name}),m.description?` — ${m.description}`:""]})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-id",children:["Corp ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-id",className:"cheng-wc-form__input",type:"text",value:z,onChange:P=>ie(P.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in WeCom Admin Console → My Enterprise"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-agent-id",children:["Agent ID ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-agent-id",className:"cheng-wc-form__input",type:"text",value:E,onChange:P=>W(P.target.value),placeholder:"1000002",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → AgentId"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-corp-secret",children:["Corp Secret ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-corp-secret",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:N,onChange:P=>G(P.target.value),placeholder:"Your app's Corp Secret",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Found in App Management → your app → App Secret. Used to obtain access tokens."})]}),n.jsxs("div",{className:"cheng-wc-form__row-2col",children:[n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-token",children:["Token ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-token",className:"cheng-wc-form__input",type:"text",value:Y,onChange:P=>U(P.target.value),placeholder:"my-callback-token",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"A string you choose — enter this same value in WeCom callback settings"})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-aes-key",children:["EncodingAESKey ",n.jsx("span",{className:"cheng-wc-form__required",children:"*"})]}),n.jsx("input",{id:"wc-aes-key",className:"cheng-wc-form__input cheng-wc-form__input--token",type:"password",value:ee,onChange:P=>H(P.target.value),placeholder:"43-character AES key",disabled:T,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"43-char random key — enter this same value in WeCom callback settings"})]})]}),n.jsxs("div",{className:"cheng-wc-form__field",children:[n.jsxs("label",{className:"cheng-wc-form__label",htmlFor:"wc-receive-id",children:["Receive ID",n.jsx("span",{className:"cheng-wc-form__label-hint",children:" (optional)"})]}),n.jsx("input",{id:"wc-receive-id",className:"cheng-wc-form__input",type:"text",value:X,onChange:P=>ae(P.target.value),placeholder:"Defaults to Corp ID if blank",disabled:T,autoComplete:"off"}),n.jsx("span",{className:"cheng-wc-form__hint",children:"Used as the receive_id in message verification. Defaults to Corp ID."})]}),n.jsxs("div",{className:"cheng-wc-form__footer",children:[x&&n.jsx("button",{type:"button",className:"cheng-wc-form__btn cheng-wc-form__btn--ghost",onClick:x,disabled:T,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-form__btn cheng-wc-form__btn--connect",disabled:!I,children:T?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-form__btn-spinner"}),"Connecting..."]}):"Connect WeCom"})]}),n.jsx("style",{children:ti})]})}const ti=`
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
`;function tf({channel:l,agents:i,apiBaseUrl:a,onUpdate:d,onRefresh:p,onSaved:h,onCancel:x}){const b=l.connectionConfig??{},k=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[v,R]=f.useState(k),[M,$]=f.useState(typeof b.corp_id=="string"?b.corp_id:""),[z,ie]=f.useState(typeof b.agent_id=="string"?b.agent_id:""),[E,W]=f.useState(typeof b.receive_id=="string"?b.receive_id:""),[N,G]=f.useState(""),[Y,U]=f.useState(""),[ee,H]=f.useState(""),[X,ae]=f.useState("ready"),[re,se]=f.useState(!1),[te,le]=f.useState(null),[Q,xe]=f.useState(null),[V,ce]=f.useState(l.webhookUrl??null),O=f.useRef(null),F=f.useCallback(()=>(O.current||(O.current=new rt(a,new Ve(a))),O.current),[a]),B=i.find(S=>S.id===v)??null,K=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)??null,m=B&&(B.workspaceId!==l.workspaceId||B.boundWorkflowId!==l.boundWorkflowId),_=N.trim().length>0&&Y.trim().length>0&&ee.trim().length>0&&M.trim().length>0&&z.trim().length>0,w=f.useCallback(async S=>{if(B){xe(null),le(null),S?ae("saving"):se(!0);try{if(m&&await d({id:l.id,channelId:l.channelId,name:l.name,workspaceId:B.workspaceId,boundWorkflowId:B.boundWorkflowId,appType:l.appType,description:l.description}),_){const J=m?B.workspaceId:l.workspaceId,pe={corp_id:M.trim(),agent_id:z.trim(),corp_secret:N.trim(),token:Y.trim(),encoding_aes_key:ee.trim()};E.trim()&&(pe.receive_id=E.trim());const be=await F().connectChannel(J,l.id,pe),me=be.setupData,De=be.webhookUrl??me?.webhook_url??null;De&&ce(De)}p?.(),S?(ae("saved"),setTimeout(()=>h(),1200)):(ae("ready"),le(_?"Credentials verified — Corp Secret accepted.":"Agent binding updated."))}catch(J){xe(J instanceof Error?J.message:"Update failed. Please try again."),ae("error"),le(null)}finally{S||se(!1)}}},[B,m,_,l,d,F,M,z,N,Y,ee,E,p,h]),T=f.useCallback(async S=>{S.preventDefault(),await w(!0)},[w]),I=X==="saving",P=!!B&&(!!m||_)&&!I&&!re;return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):X==="saved"?n.jsxs("div",{className:"cheng-wc-edit__success",children:[n.jsx("div",{className:"cheng-wc-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-wc-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-wc-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",_?"reconfigured and reconnected":"updated","."]}),n.jsx("style",{children:yd})]}):n.jsxs("form",{className:"cheng-wc-edit",onSubmit:T,children:[Q&&n.jsxs("div",{className:"cheng-wc-edit__error-banner",children:[n.jsx("span",{children:Q}),n.jsx("button",{type:"button",className:"cheng-wc-edit__retry-btn",onClick:()=>{ae("ready"),xe(null)},children:"Retry"})]}),V&&n.jsxs("div",{className:"cheng-wc-edit__webhook-info",children:[n.jsx("span",{className:"cheng-wc-edit__webhook-label",children:"Callback URL"}),n.jsx("code",{className:"cheng-wc-edit__webhook-value",children:V}),n.jsxs("span",{className:"cheng-wc-edit__webhook-hint",children:["Paste this URL in WeCom Admin Console → App → ",n.jsx("strong",{children:"Receive Messages"}),"."]})]}),l.connectionState==="configuring"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--configuring",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Credentials verified, but WeCom callback is not yet active. Configure the callback URL in WeCom Admin Console to complete the integration."]}),l.connectionState==="active"&&n.jsxs("div",{className:"cheng-wc-edit__state-note cheng-wc-edit__state-note--active",children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("polyline",{points:"20 6 9 17 4 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),"Callback is active — WeCom verification challenge has succeeded."]}),n.jsxs("div",{className:"cheng-wc-edit__grid",children:[n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("select",{className:"cheng-wc-edit__input cheng-wc-edit__input--select",value:v,onChange:S=>R(S.target.value),disabled:I,required:!0,children:i.map(S=>n.jsx("option",{value:S.id,children:S.name},S.id))}),m&&B&&n.jsxs("div",{className:"cheng-wc-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:K?.name??"current agent"})," to"," ",n.jsx("strong",{children:B.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration. Update if the enterprise changed."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:M,onChange:S=>$(S.target.value),placeholder:"wwxxxxxxxxxxxxxxxxxx",disabled:I,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Agent ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Pre-filled from your current configuration."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:z,onChange:S=>ie(S.target.value),placeholder:"1000002",disabled:I,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Corp Secret"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing secret. Fill in to rotate credentials."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:N,onChange:S=>G(S.target.value),placeholder:"(leave blank to keep current)",disabled:I,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Token"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing token. Required when rotating Corp Secret."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:Y,onChange:S=>U(S.target.value),placeholder:"(leave blank to keep current)",disabled:I,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"EncodingAESKey"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Leave blank to keep the existing key. Required when rotating credentials."})]}),n.jsxs("div",{className:"cheng-wc-edit__field",children:[n.jsx("input",{className:"cheng-wc-edit__input cheng-wc-edit__input--token",type:"password",value:ee,onChange:S=>H(S.target.value),placeholder:"(leave blank to keep current)",disabled:I,autoComplete:"off"}),te&&n.jsx("div",{className:"cheng-wc-edit__test-ok",children:te}),n.jsx("div",{className:"cheng-wc-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--secondary",disabled:!_||!B||I||re,onClick:()=>{w(!1)},children:re?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner cheng-wc-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]}),n.jsxs("div",{className:"cheng-wc-edit__card",children:[n.jsxs("div",{className:"cheng-wc-edit__card-header",children:[n.jsx("h4",{className:"cheng-wc-edit__card-title",children:"Receive ID"}),n.jsx("span",{className:"cheng-wc-edit__card-tip",children:"Optional. Used for signature verification. Defaults to Corp ID if blank."})]}),n.jsx("div",{className:"cheng-wc-edit__field",children:n.jsx("input",{className:"cheng-wc-edit__input",type:"text",value:E,onChange:S=>W(S.target.value),placeholder:"Defaults to Corp ID",disabled:I,autoComplete:"off"})})]})]}),!_&&n.jsxs("div",{className:"cheng-wc-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Corp Secret + Token + EncodingAESKey to reconnect. Leave them blank to only update the agent or other settings."]}),n.jsxs("div",{className:"cheng-wc-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-wc-edit__btn cheng-wc-edit__btn--ghost",onClick:x,disabled:I,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-wc-edit__btn cheng-wc-edit__btn--connect",disabled:!P,children:I?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-wc-edit__spinner"}),"Saving..."]}):_?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:yd})]})}const yd=`
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
`;function nf(l){return l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"dingtalk-bot"}function rf(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function of({agents:l,onCreate:i,apiBaseUrl:a,onPaired:d,onRefresh:p,onGoToAgents:h,onCancel:x}){const[b,k]=f.useState("ready"),[v,R]=f.useState(""),[M,$]=f.useState(()=>l[0]?.id??""),[z,ie]=f.useState(""),[E,W]=f.useState(""),[N,G]=f.useState(""),[Y,U]=f.useState(null),[ee,H]=f.useState(null),[X,ae]=f.useState(null),[re,se]=f.useState(null),te=f.useRef(null),le=f.useCallback(()=>(te.current||(te.current=new rt(a,new Ve(a))),te.current),[a]),Q=l.find(O=>O.id===M)??null,xe=f.useCallback(async O=>{if(O.preventDefault(),!v.trim()||!z.trim()||!E.trim()||!N.trim()||!Q)return;U(null),k("connecting");let F;try{const B=nf(v);F=await i({name:v.trim(),channelId:B,workspaceId:Q.workspaceId,boundWorkflowId:Q.boundWorkflowId,appType:"dingtalk",description:`DingTalk integration for agent: ${Q.name}`})}catch(B){U(B instanceof Error?B.message:"Failed to create the channel record. Please try again."),k("error");return}ae(F);try{const B=await le().connectChannel(F.workspaceId,F.id,{client_id:z.trim(),client_secret:E.trim(),robot_code:N.trim(),connection_mode:"stream"}),K=B.setupData;se({robotCode:K?.robot_code??N.trim(),appName:K?.app_name??void 0,streamStatus:K?.stream_status??"connected",validatedAt:K?.validated_at??void 0});const m={...F,connectionState:B.connectionState,webhookUrl:B.webhookUrl,setupData:B.setupData};H(m),k("connected"),p?.(),d(m)}catch(B){p?.(),U(B instanceof Error?B.message:"Connection failed. Please check your Client ID, Client Secret, and Robot Code."),k("created")}},[v,z,E,N,Q,i,le,d,p]);if(l.length===0)return n.jsxs("div",{className:"cheng-dt-form__no-agents",children:[n.jsx("div",{className:"cheng-dt-form__no-agents-icon",children:"🤖"}),n.jsx("h3",{className:"cheng-dt-form__no-agents-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-dt-form__no-agents-desc",children:"Create an agent first, then come back to connect a DingTalk integration. An agent defines which workflow processes incoming messages."}),h&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:h,children:"Go to Agents"}),n.jsx("style",{children:ni})]});if(b==="connected"&&ee)return n.jsxs("div",{className:"cheng-dt-form__success",children:[n.jsx("div",{className:"cheng-dt-form__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-form__success-title",children:"DingTalk Connected!"}),n.jsxs("p",{className:"cheng-dt-form__success-desc",children:[n.jsx("strong",{children:ee.name})," has been created and is now live",re?.appName&&n.jsxs(n.Fragment,{children:[" — ",n.jsx("span",{className:"cheng-dt-form__app-name",children:re.appName})]}),Q&&n.jsxs(n.Fragment,{children:[", bound to agent ",n.jsx("strong",{children:Q.name})]}),"."]}),n.jsxs("div",{className:"cheng-dt-form__mode-badge",children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),n.jsxs("div",{className:"cheng-dt-form__stream-box",children:[n.jsx("p",{className:"cheng-dt-form__stream-box-title",children:"Stream Connection Active"}),re?.robotCode&&n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Robot Code"}),n.jsx("code",{className:"cheng-dt-form__stream-value",children:re.robotCode})]}),n.jsxs("div",{className:"cheng-dt-form__stream-row",children:[n.jsx("span",{className:"cheng-dt-form__stream-label",children:"Status"}),n.jsx("span",{className:"cheng-dt-form__stream-status",children:re?.streamStatus==="connected"?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__status-dot cheng-dt-form__status-dot--active"}),"Connected"]}):re?.streamStatus??"connecting"})]}),n.jsxs("ol",{className:"cheng-dt-form__steps-list",children:[n.jsxs("li",{children:["The backend is now maintaining a ",n.jsx("strong",{children:"persistent WebSocket"})," to DingTalk — no public URL or callback configuration needed"]}),n.jsxs("li",{children:["Verify the bot is working by sending a ",n.jsx("strong",{children:"direct message"})," to your DingTalk App Bot"]}),n.jsxs("li",{children:["For group chat, ",n.jsx("strong",{children:"@mention"})," the bot — only @-mentioned messages are forwarded to the workflow"]})]})]}),n.jsxs("p",{className:"cheng-dt-form__success-hint",children:["The stream worker runs as long as the server is up. If the worker stops unexpectedly, use ",n.jsx("strong",{children:"Manage → Edit → Test Connection"})," to reconnect."]}),x&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",onClick:x,children:"Done — Close"}),n.jsx("style",{children:ni})]});if(b==="created"&&X)return n.jsxs("div",{className:"cheng-dt-form__created-warn",children:[n.jsx("div",{className:"cheng-dt-form__created-warn-icon",children:n.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]})}),n.jsx("h3",{className:"cheng-dt-form__created-warn-title",children:"Channel created, but connection failed"}),n.jsxs("p",{className:"cheng-dt-form__created-warn-desc",children:[n.jsx("strong",{children:X.name})," was created successfully, but the stream worker failed to start",Y?n.jsxs(n.Fragment,{children:[": ",n.jsx("em",{children:Y})]}):"."," The channel is now listed in Connected Integrations — open"," ",n.jsx("strong",{children:"Manage → Edit"})," to fix the credentials and reconnect."]}),x&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--secondary",onClick:x,children:"Close"}),n.jsx("style",{children:ni})]});const V=b==="connecting",ce=v.trim().length>0&&z.trim().length>0&&E.trim().length>0&&N.trim().length>0&&!!Q&&!V;return n.jsxs("form",{className:"cheng-dt-form",onSubmit:xe,children:[n.jsxs("div",{className:"cheng-dt-form__instructions",children:[n.jsx("p",{className:"cheng-dt-form__instructions-title",children:"Before you begin"}),n.jsxs("ol",{className:"cheng-dt-form__steps",children:[n.jsxs("li",{children:["You need a ",n.jsx("strong",{children:"DingTalk Open Platform"})," developer account with a created ",n.jsx("strong",{children:"App Bot"})," (企业内部应用)"]}),n.jsxs("li",{children:["From your app's ",n.jsx("strong",{children:"App Credentials"}),", note the"," ",n.jsx("strong",{children:"Client ID"})," (AppKey) and ",n.jsx("strong",{children:"Client Secret"})," (AppSecret)"]}),n.jsxs("li",{children:["From ",n.jsx("strong",{children:"App Features → Bot"}),", enable the bot feature and note the ",n.jsx("strong",{children:"Robot Code"})]}),n.jsx("li",{children:"No callback URL configuration is needed — DingTalk Stream Mode connects outbound from the server"})]})]}),Y&&b!=="created"&&n.jsxs("div",{className:"cheng-dt-form__error-banner",children:[n.jsx("span",{children:Y}),n.jsx("button",{type:"button",className:"cheng-dt-form__retry-btn",onClick:()=>{k("ready"),U(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-name",children:["Integration Name ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-name",className:"cheng-dt-form__input",type:"text",value:v,onChange:O=>R(O.target.value),placeholder:"DingTalk Support Bot",disabled:V,autoFocus:!0,required:!0}),n.jsx("span",{className:"cheng-dt-form__hint",children:"A display name for this DingTalk integration"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-agent",children:["Agent ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("div",{className:"cheng-dt-form__agent-select-wrap",children:n.jsx("select",{id:"dt-agent",className:"cheng-dt-form__input cheng-dt-form__input--select",value:M,onChange:O=>$(O.target.value),disabled:V,required:!0,children:l.map(O=>n.jsxs("option",{value:O.id,children:[rf(O)," ",O.name]},O.id))})}),Q&&n.jsxs("span",{className:"cheng-dt-form__hint",children:["Messages from DingTalk will be handled by"," ",n.jsx("strong",{children:Q.name}),Q.description?` — ${Q.description}`:""]})]}),n.jsxs("div",{className:"cheng-dt-form__row-2col",children:[n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-id",children:["Client ID ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppKey)"})]}),n.jsx("input",{id:"dt-client-id",className:"cheng-dt-form__input",type:"text",value:z,onChange:O=>ie(O.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:V,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client ID"})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-robot-code",children:["Robot Code ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"})]}),n.jsx("input",{id:"dt-robot-code",className:"cheng-dt-form__input",type:"text",value:N,onChange:O=>G(O.target.value),placeholder:"dingxxxxxx",disabled:V,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Features → Bot → Robot Code"})]})]}),n.jsxs("div",{className:"cheng-dt-form__field",children:[n.jsxs("label",{className:"cheng-dt-form__label",htmlFor:"dt-client-secret",children:["Client Secret ",n.jsx("span",{className:"cheng-dt-form__required",children:"*"}),n.jsx("span",{className:"cheng-dt-form__label-hint",children:" (AppSecret)"})]}),n.jsx("input",{id:"dt-client-secret",className:"cheng-dt-form__input cheng-dt-form__input--token",type:"password",value:E,onChange:O=>W(O.target.value),placeholder:"Your app's Client Secret",disabled:V,required:!0,autoComplete:"off"}),n.jsx("span",{className:"cheng-dt-form__hint",children:"Found in App Credentials → Client Secret. Used for stream authentication."})]}),n.jsxs("div",{className:"cheng-dt-form__footer",children:[x&&n.jsx("button",{type:"button",className:"cheng-dt-form__btn cheng-dt-form__btn--ghost",onClick:x,disabled:V,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-form__btn cheng-dt-form__btn--connect",disabled:!ce,children:V?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-form__btn-spinner"}),"Connecting..."]}):"Connect DingTalk"})]}),n.jsx("style",{children:ni})]})}const ni=`
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
`;function sf({channel:l,agents:i,apiBaseUrl:a,liveStatus:d,onUpdate:p,onRefresh:h,onSaved:x,onCancel:b}){const k=l.connectionConfig??{},v=l.setupData,R=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)?.id??i[0]?.id??"",[M,$]=f.useState(R),[z,ie]=f.useState(typeof k.client_id=="string"?k.client_id:""),[E,W]=f.useState(typeof k.robot_code=="string"?k.robot_code:typeof v?.robot_code=="string"?v.robot_code:""),[N,G]=f.useState(""),[Y,U]=f.useState("ready"),[ee,H]=f.useState(!1),[X,ae]=f.useState(null),[re,se]=f.useState(null),te=typeof v?.stream_status=="string"?v.stream_status:void 0,le=d?.lastEventAt??(typeof v?.last_event_at=="string"?v.last_event_at:void 0),Q=d?.connectionState??l.connectionState,xe=d?d.connectionState==="active"?"connected":d.connectionState??"unknown":te??(l.connectionState==="active"?"connected":l.connectionState??"unknown"),V=d?d.workerRunning===!0||d.connectionState==="active":l.connectionState==="active"||te==="connected",ce=f.useRef(null),O=f.useCallback(()=>(ce.current||(ce.current=new rt(a,new Ve(a))),ce.current),[a]),F=i.find(S=>S.id===M)??null,B=i.find(S=>S.boundWorkflowId===l.boundWorkflowId&&S.workspaceId===l.workspaceId)??null,K=F&&(F.workspaceId!==l.workspaceId||F.boundWorkflowId!==l.boundWorkflowId),m=z.trim().length>0&&N.trim().length>0&&E.trim().length>0,_=f.useCallback(async S=>{if(F){se(null),ae(null),S?U("saving"):H(!0);try{if(K&&await p({id:l.id,channelId:l.channelId,name:l.name,workspaceId:F.workspaceId,boundWorkflowId:F.boundWorkflowId,appType:l.appType,description:l.description}),m){const J=K?F.workspaceId:l.workspaceId,pe=await O().connectChannel(J,l.id,{client_id:z.trim(),client_secret:N.trim(),robot_code:E.trim(),connection_mode:"stream"});G("");const me=pe.setupData?.stream_status}h?.(),S?(U("saved"),setTimeout(()=>x(),1200)):(U("ready"),ae(m?"Stream worker restarted — credentials accepted.":"Agent binding updated."))}catch(J){se(J instanceof Error?J.message:"Update failed. Please try again."),U("error"),ae(null)}finally{S||H(!1)}}},[F,K,m,l,p,O,z,N,E,h,x]),w=f.useCallback(async S=>{S.preventDefault(),await _(!0)},[_]),T=Y==="saving",I=!!F&&(!!K||m)&&!T&&!ee,P=S=>{if(!S)return"—";const J=new Date(S);return Number.isNaN(J.getTime())?S:J.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})};return i.length===0?n.jsx("p",{style:{margin:0,fontSize:13,color:"#5e5d59"},children:"No agents available. Create an agent first before editing this integration."}):Y==="saved"?n.jsxs("div",{className:"cheng-dt-edit__success",children:[n.jsx("div",{className:"cheng-dt-edit__success-icon",children:n.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("polyline",{points:"20 6 9 17 4 12"})})}),n.jsx("h3",{className:"cheng-dt-edit__success-title",children:"Integration Updated!"}),n.jsxs("p",{className:"cheng-dt-edit__success-desc",children:[n.jsx("strong",{children:l.name})," has been"," ",m?"reconfigured — stream worker restarted":"updated","."]}),n.jsx("style",{children:vd})]}):n.jsxs("form",{className:"cheng-dt-edit",onSubmit:w,children:[re&&n.jsxs("div",{className:"cheng-dt-edit__error-banner",children:[n.jsx("span",{children:re}),n.jsx("button",{type:"button",className:"cheng-dt-edit__retry-btn",onClick:()=>{U("ready"),se(null)},children:"Retry"})]}),n.jsxs("div",{className:"cheng-dt-edit__stream-info",children:[n.jsxs("div",{className:"cheng-dt-edit__stream-info-header",children:[n.jsx("div",{className:"cheng-dt-edit__stream-info-label",children:"Stream Mode"}),n.jsxs("div",{className:"cheng-dt-edit__stream-status-row",children:[n.jsx("span",{className:`cheng-dt-edit__status-dot ${V?"cheng-dt-edit__status-dot--active":Q==="error"||te==="error"?"cheng-dt-edit__status-dot--error":"cheng-dt-edit__status-dot--idle"}`}),n.jsx("span",{className:"cheng-dt-edit__stream-status-text",children:xe})]})]}),le&&n.jsxs("div",{className:"cheng-dt-edit__stream-meta",children:["Last event: ",n.jsx("strong",{children:P(le)})]}),d?.lastError&&n.jsx("div",{className:"cheng-dt-edit__stream-warn cheng-dt-edit__stream-warn--error",children:d.lastError}),Q==="degraded"&&!d?.lastError&&n.jsxs("div",{className:"cheng-dt-edit__stream-warn",children:["Worker stopped unexpectedly. Provide credentials below and click"," ",n.jsx("strong",{children:"Save & Reconnect"})," to restart the stream."]})]}),n.jsxs("div",{className:"cheng-dt-edit__grid",children:[n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Route To Agent"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Changing agent only updates routing — no need to re-enter credentials."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("select",{className:"cheng-dt-edit__input cheng-dt-edit__input--select",value:M,onChange:S=>$(S.target.value),disabled:T,required:!0,children:i.map(S=>n.jsx("option",{value:S.id,children:S.name},S.id))}),K&&F&&n.jsxs("div",{className:"cheng-dt-edit__notice",children:["Messages will switch from"," ",n.jsx("strong",{children:B?.name??"current agent"})," to"," ",n.jsx("strong",{children:F.name})," after saving."]})]})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client ID"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration. Update only if the app changed."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:z,onChange:S=>ie(S.target.value),placeholder:"dingxxxxxxxxxxxxxxxx",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Robot Code"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Pre-filled from current configuration."})]}),n.jsx("div",{className:"cheng-dt-edit__field",children:n.jsx("input",{className:"cheng-dt-edit__input",type:"text",value:E,onChange:S=>W(S.target.value),placeholder:"dingxxxxxx",disabled:T,autoComplete:"off"})})]}),n.jsxs("div",{className:"cheng-dt-edit__card",children:[n.jsxs("div",{className:"cheng-dt-edit__card-header",children:[n.jsx("h4",{className:"cheng-dt-edit__card-title",children:"Client Secret"}),n.jsx("span",{className:"cheng-dt-edit__card-tip",children:"Leave blank to keep the existing secret. Fill to rotate credentials or restart the stream."})]}),n.jsxs("div",{className:"cheng-dt-edit__field",children:[n.jsx("input",{className:"cheng-dt-edit__input cheng-dt-edit__input--token",type:"password",value:N,onChange:S=>G(S.target.value),placeholder:"(leave blank to keep current)",disabled:T,autoComplete:"off"}),X&&n.jsx("div",{className:"cheng-dt-edit__test-ok",children:X}),n.jsx("div",{className:"cheng-dt-edit__card-actions",children:n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--secondary",disabled:!m||!F||T||ee,onClick:()=>{_(!1)},children:ee?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner cheng-dt-edit__spinner--dark"}),"Testing..."]}):"Test Connection"})})]})]})]}),!m&&n.jsxs("div",{className:"cheng-dt-edit__creds-hint",children:[n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]}),"Fill in Client ID + Client Secret + Robot Code to restart the stream worker. Leave them blank to only update the agent."]}),n.jsxs("div",{className:"cheng-dt-edit__footer",children:[n.jsx("button",{type:"button",className:"cheng-dt-edit__btn cheng-dt-edit__btn--ghost",onClick:b,disabled:T,children:"Cancel"}),n.jsx("button",{type:"submit",className:"cheng-dt-edit__btn cheng-dt-edit__btn--connect",disabled:!I,children:T?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"cheng-dt-edit__spinner"}),"Saving..."]}):m?"Save & Reconnect":"Save"})]}),n.jsx("style",{children:vd})]})}const vd=`
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
`;function Jn({title:l,description:i,icon:a,iconLabel:d,iconColor:p,onClose:h,children:x}){return n.jsx("div",{className:"cheng-page__dialog-overlay",onClick:h,children:n.jsxs("div",{className:"cheng-page__dialog",onClick:b=>b.stopPropagation(),children:[n.jsxs("div",{className:"cheng-page__dialog-header",children:[n.jsx("div",{className:"cheng-page__dialog-icon",style:{background:`${p}20`},children:n.jsx("span",{role:"img","aria-label":d,style:{fontSize:"20px"},children:a})}),n.jsxs("div",{className:"cheng-page__dialog-copy",children:[n.jsx("h2",{className:"cheng-page__form-card-title",children:l}),n.jsx("p",{className:"cheng-page__form-card-desc",children:i})]}),n.jsx("button",{type:"button",className:"cheng-page__applink-close-btn",onClick:h,children:"Close"})]}),n.jsx("div",{className:"cheng-page__dialog-body",children:x})]})})}function af({activePlatform:l,platforms:i,isCreateModalOpen:a,onCloseCreate:d,editingChannel:p,onCloseEdit:h,agents:x,onCreate:b,onUpdate:k,onRefresh:v,apiBaseUrl:R,onGoToAgents:M,liveStatusMap:$}){const z=p?i.find(Y=>Y.id===p.appType)??{id:p.appType??"custom",label:p.appType??"App",shortLabel:p.appType??"App",emoji:"⚙️",color:"#c96442",desc:""}:null,ie=f.useCallback(Y=>{d(),v()},[d,v]),E=f.useCallback(Y=>{v()},[v]),W=f.useCallback(Y=>{v()},[v]),N=f.useCallback(Y=>{v()},[v]),G=f.useCallback(Y=>{v()},[v]);return n.jsxs(n.Fragment,{children:[a&&l.id==="telegram"&&n.jsx(Jn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(Bh,{agents:x,onCreate:b,apiBaseUrl:R,onPaired:ie,onRefresh:v,onGoToAgents:()=>{d(),M()},onCancel:d},"telegram-pairing")}),a&&l.id==="whatsapp"&&n.jsx(Jn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(Gh,{agents:x,onCreate:b,apiBaseUrl:R,onPaired:E,onRefresh:v,onGoToAgents:()=>{d(),M()},onCancel:d},"whatsapp-pairing")}),a&&l.id==="slack"&&n.jsx(Jn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(qh,{agents:x,onCreate:b,apiBaseUrl:R,onPaired:W,onRefresh:v,onGoToAgents:()=>{d(),M()},onCancel:d},"slack-pairing")}),a&&l.id==="dingtalk"&&n.jsx(Jn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(of,{agents:x,onCreate:b,apiBaseUrl:R,onPaired:G,onRefresh:v,onGoToAgents:()=>{d(),M()},onCancel:d},"dingtalk-pairing")}),a&&l.id==="wecom"&&n.jsx(Jn,{title:`创建 ${l.label}`,description:l.desc,icon:l.emoji,iconLabel:l.label,iconColor:l.color,onClose:d,children:n.jsx(ef,{agents:x,onCreate:b,apiBaseUrl:R,onPaired:N,onRefresh:v,onGoToAgents:()=>{d(),M()},onCancel:d},"wecom-pairing")}),p&&z&&n.jsxs(Jn,{title:`编辑 ${p.name}`,description:`@${p.channelId} · ${z.label}`,icon:z.emoji,iconLabel:p.appType??"app",iconColor:z.color,onClose:h,children:[p.appType==="telegram"&&n.jsx($h,{channel:p,agents:x,apiBaseUrl:R,onUpdate:k,onRefresh:v,onSaved:()=>{v(),h()},onCancel:h},`${p.id}-tg-edit`),p.appType==="whatsapp"&&n.jsx(Hh,{channel:p,agents:x,apiBaseUrl:R,onUpdate:k,onRefresh:v,onSaved:()=>{v(),h()},onCancel:h},`${p.id}-wa-edit`),p.appType==="slack"&&n.jsx(Yh,{channel:p,agents:x,apiBaseUrl:R,onUpdate:k,onRefresh:v,onSaved:()=>{v(),h()},onCancel:h},`${p.id}-sl-edit`),p.appType==="dingtalk"&&n.jsx(sf,{channel:p,agents:x,apiBaseUrl:R,liveStatus:$?.[p.id],onUpdate:k,onRefresh:v,onSaved:()=>{v(),h()},onCancel:h},`${p.id}-dt-edit`),p.appType==="wecom"&&n.jsx(tf,{channel:p,agents:x,apiBaseUrl:R,onUpdate:k,onRefresh:v,onSaved:()=>{v(),h()},onCancel:h},`${p.id}-wc-edit`)]})]})}const Zn=[{id:"whatsapp",label:"WhatsApp",shortLabel:"WA",emoji:"💬",color:"#25d366",desc:"Meta WhatsApp Business"},{id:"telegram",label:"Telegram",shortLabel:"TG",emoji:"✈️",color:"#2ca5e0",desc:"Telegram Bot API"},{id:"slack",label:"Slack",shortLabel:"Slack",emoji:"💼",color:"#4a154b",desc:"Slack Workspace App"},{id:"wecom",label:"WeCom",shortLabel:"WeCom",emoji:"🏢",color:"#248067",desc:"WeCom Custom App"},{id:"dingtalk",label:"DingTalk",shortLabel:"DT",emoji:"💠",color:"#1677ff",desc:"DingTalk App Bot"},{id:"line",label:"LINE",shortLabel:"LINE",emoji:"🟢",color:"#00c300",desc:"LINE Messaging API"},{id:"custom",label:"Custom",shortLabel:"Custom",emoji:"⚙️",color:"#c96442",desc:"Custom integration"}];function Ed(){return n.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}function Ad(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M12 2l2.4 2.4H18v3.6L20.4 12 18 16v3.6h-3.6L12 22l-2.4-2.4H6V16L3.6 12 6 8V4.4h3.6z"}),n.jsx("circle",{cx:"12",cy:"12",r:"2.5"})]})}function lf(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),n.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]})}function cf(){return n.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("circle",{cx:"12",cy:"12",r:"3"}),n.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}function df(){return n.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[n.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),n.jsx("polyline",{points:"16 17 21 12 16 7"}),n.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})}function uf({channels:l,activeChannel:i,activeConfig:a,isLoading:d,onSelectChannel:p,onCreateClick:h,chatWindowProps:x={}}){const b=Nd(),k=eh(i?.channelId??""),[v,R]=f.useState(!1),[M,$]=f.useState([]),[z,ie]=f.useState(null),E=f.useMemo(()=>i?new Sd(i.channelId):null,[i]),W=f.useCallback(()=>{if(!E){$([]),ie(null);return}let X=E.listSessions();X.length===0&&(X=[E.createSession("新会话")]),$(X.map(ae=>{const re=k.filter(se=>(se.sessionId??se.externalChatId)===ae.id).sort((se,te)=>Date.parse(te.updatedAt)-Date.parse(se.updatedAt))[0];return re?{...ae,executionStatus:re.clientStatus,executionStatusAt:re.updatedAt}:ae})),ie(E.getActiveSessionId())},[E,k]);f.useEffect(()=>{W()},[W]),f.useEffect(()=>{if(typeof window>"u"||!i)return;const X=ae=>{ae.detail?.channelId===i.channelId&&W()};return window.addEventListener("cheng:session-label-updated",X),()=>{window.removeEventListener("cheng:session-label-updated",X)}},[i,W]);const N=f.useCallback(()=>{E&&(E.createSession("新会话"),W())},[W,E]),G=f.useCallback(X=>{E&&(E.setActiveSessionId(X.id),W())},[W,E]),Y=f.useCallback(X=>{E&&(b.removeSession(X),E.deleteSession(X),W())},[b,W,E]),U=f.useCallback((X,ae)=>{E&&(E.renameSession(X,ae),W())},[W,E]),ee=f.useCallback(X=>{E&&(E.togglePinSession(X),W())},[W,E]),H=f.useMemo(()=>z?{...a,sessionId:z}:a,[a,z]);return n.jsxs("div",{className:"cheng-shell__chat-view",children:[n.jsxs("div",{className:`cheng-shell__channel-sidebar${v?" cheng-shell__channel-sidebar--collapsed":""}`,children:[!v&&n.jsx("div",{className:"cheng-shell__channel-sidebar-content",children:n.jsx(Wh,{sessions:M,activeSessionId:z,onSelect:G,onCreateClick:N,onDeleteSession:Y,onRenameSession:U,onTogglePinSession:ee})}),n.jsx("button",{className:"cheng-shell__channel-sidebar-toggle cheng-shell__channel-sidebar-toggle--edge",onClick:()=>R(X=>!X),type:"button","aria-label":v?"Expand agents sidebar":"Collapse agents sidebar",title:v?"Expand agents sidebar":"Collapse agents sidebar",children:n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:v?n.jsx("path",{d:"M6 3L10 8L6 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}):n.jsx("path",{d:"M10 3L6 8L10 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),n.jsx("div",{className:"cheng-shell__chat-area",children:d&&!i?n.jsx("div",{className:"cheng-shell__placeholder",children:n.jsx("span",{className:"cheng-shell__placeholder-text",children:"Loading channels..."})}):i&&i.workspaceId?n.jsx(lh,{config:H,children:n.jsx(Eh,{...x,channels:l,activeChannelId:i?.id??null,activeChannel:i,onSelectChannel:p})},`${i.channelId}:${i.workspaceId}`):n.jsxs("div",{className:"cheng-shell__placeholder",children:[n.jsx("div",{className:"cheng-shell__placeholder-icon",children:n.jsx(Ed,{})}),n.jsx("p",{className:"cheng-shell__placeholder-text",children:"No channels yet."}),n.jsx("button",{className:"cheng-shell__placeholder-btn",onClick:h,type:"button",children:"Create your first channel"})]})})]})}function pf(l){if(!l)return"Unknown";const i=new Date(l);return Number.isNaN(i.getTime())?l:i.toLocaleDateString("zh-CN",{year:"numeric",month:"short",day:"numeric"})}function hf(l){const i=l.connectionConfig?.avatarIcon;return typeof i=="string"&&i.trim()?i:"🤖"}function ff({channels:l,onCreateClick:i,onEditClick:a,onDeleteClick:d,workspaceNames:p,workflowNames:h}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"Agents"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your agent roster, review workflow bindings, and launch any configured agent."})]}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:i,children:"Create Agent"})]}),n.jsx("div",{className:"cheng-page__content",children:l.length===0?n.jsxs("div",{className:"cheng-page__empty-card",children:[n.jsx("div",{className:"cheng-page__empty-icon",children:n.jsx(Ad,{})}),n.jsx("h2",{className:"cheng-page__empty-title",children:"No agents yet"}),n.jsx("p",{className:"cheng-page__empty-desc",children:"Create your first agent to bind a workflow and start handling conversations."}),n.jsx("button",{type:"button",className:"cheng-page__header-action",onClick:i,children:"Create Agent"})]}):n.jsx("div",{className:"cheng-page__channel-grid",children:l.map(x=>n.jsxs("div",{className:"cheng-page__channel-card",children:[n.jsxs("div",{className:"cheng-page__channel-card-top",children:[n.jsx("div",{className:"cheng-page__channel-card-icon",children:n.jsx("span",{className:"cheng-page__channel-card-avatar","aria-hidden":"true",children:hf(x)})}),n.jsxs("div",{className:"cheng-page__channel-card-actions",children:[n.jsx("span",{className:"cheng-page__channel-card-badge",children:x.appType||"agent"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-edit",onClick:()=>a(x),children:"Edit"}),n.jsx("button",{type:"button",className:"cheng-page__channel-card-delete",onClick:()=>{d(x)},children:"Delete"})]})]}),n.jsxs("div",{className:"cheng-page__channel-card-body",children:[n.jsx("h2",{className:"cheng-page__channel-card-title",children:x.name}),n.jsxs("p",{className:"cheng-page__channel-card-id",children:["@",x.channelId]}),n.jsx("p",{className:"cheng-page__channel-card-desc",children:x.description||"No description yet. Open chat to interact with this agent."})]}),n.jsxs("div",{className:"cheng-page__channel-card-workflow",children:[n.jsxs("span",{className:"cheng-page__channel-card-detail",title:p[x.workspaceId]?`Workspace ID: ${x.workspaceId}`:x.workspaceId,children:["Workspace: ",p[x.workspaceId]||x.workspaceId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",title:h[x.boundWorkflowId]?`Workflow ID: ${x.boundWorkflowId}`:x.boundWorkflowId,children:["Workflow: ",h[x.boundWorkflowId]||x.boundWorkflowId]}),n.jsxs("span",{className:"cheng-page__channel-card-detail",children:["Created: ",pf(x.createdAt)]})]})]},x.id||x.channelId))})})]})}function gf({channels:l,onCreate:i,onUpdate:a,onDelete:d,onRefresh:p,apiBaseUrl:h,onSuccess:x,onGoToAgents:b}){const[k,v]=f.useState("telegram"),[R,M]=f.useState(""),[$,z]=f.useState(!1),[ie,E]=f.useState(null),[W,N]=f.useState(null),[G,Y]=f.useState({}),U=f.useRef(null),ee=f.useCallback(()=>(U.current||(U.current=new rt(h,new Ve(h))),U.current),[h]),H=f.useMemo(()=>new Set(["telegram","whatsapp","slack","wecom","dingtalk"]),[]),X=f.useMemo(()=>l.filter(w=>!w.appType||w.appType==="agent"),[l]),ae={degraded:0,error:1,awaiting_input:2,connecting:3,active:4,disconnected:5},re=f.useMemo(()=>l.filter(w=>w.appType&&w.appType!=="agent").sort((w,T)=>{const I=ae[w.connectionState??""]??6,P=ae[T.connectionState??""]??6;return I!==P?I-P:(T.updatedAt??T.createdAt??"").localeCompare(w.updatedAt??w.createdAt??"")}),[l]);f.useEffect(()=>{Zn.some(T=>T.id===k)||v(re[0]?.appType??"telegram")},[re,k]);const se=Zn.find(w=>w.id===k)??Zn[1],te=f.useMemo(()=>Zn.map(w=>{const T=re.filter(S=>S.appType===w.id),I=T.filter(S=>S.connectionState==="active").length,P=T.filter(S=>S.connectionState==="awaiting_input"||S.connectionState==="connecting"||S.connectionState==="configuring").length;return{platform:w,total:T.length,connectedCount:I,pendingCount:P}}),[re]),le=f.useMemo(()=>{const w=R.trim().toLowerCase();return re.filter(T=>T.appType!==se.id?!1:w?[T.name,T.channelId,T.description,T.webhookUrl,T.connectionState].filter(Boolean).join(" ").toLowerCase().includes(w):!0)},[se.id,re,R]),Q=re.filter(w=>w.appType===se.id).length,xe=f.useMemo(()=>Object.fromEntries(re.map(w=>{const T=X.find(I=>I.workspaceId===w.workspaceId&&I.boundWorkflowId===w.boundWorkflowId);return[w.id,T?.name??"未绑定 Agent"]})),[X,re]),V=f.useCallback(w=>{switch(w){case"active":return{label:"运行中",cls:"cheng-applink__badge--active"};case"degraded":return{label:"异常",cls:"cheng-applink__badge--degraded"};case"configuring":return{label:"待回调",cls:"cheng-applink__badge--configuring"};case"connecting":case"awaiting_input":return{label:"待配置",cls:"cheng-applink__badge--pending"};case"error":return{label:"失败",cls:"cheng-applink__badge--error"};case"disconnected":return{label:"已断开",cls:"cheng-applink__badge--disconnected"};default:return{label:"未配置",cls:"cheng-applink__badge--default"}}},[]),ce=f.useCallback(w=>{if(!w)return"—";const T=new Date(w);return Number.isNaN(T.getTime())?w:T.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},[]),O=f.useCallback(w=>{v(w),M("")},[]),F=f.useCallback(()=>{z(!1)},[]),B=f.useCallback(async w=>{N({channelId:w.id,action:"refresh"});try{const T=await ee().getChannelStatus(w.workspaceId,w.id);Y(I=>({...I,[w.id]:T})),await p()}finally{N(null)}},[ee,p]),K=f.useCallback(async w=>{if(window.confirm(`确定要暂停 ${w.name} 的连接吗？这会断开当前平台连接。`)){N({channelId:w.id,action:"pause"});try{await ee().disconnectChannel(w.workspaceId,w.id),Y(I=>{const P={...I};return delete P[w.id],P}),await p()}finally{N(null)}}},[ee,p]),m=f.useCallback(async w=>{N({channelId:w.id,action:"resume"});try{await ee().connectChannel(w.workspaceId,w.id),Y(T=>{const I={...T};return delete I[w.id],I}),await p()}finally{N(null)}},[ee,p]),_=f.useCallback(async w=>{if(window.confirm(`确定删除 ${w.name} 吗？删除后需要重新创建连接。`)){N({channelId:w.id,action:"delete"});try{await Promise.resolve(d(w.id)),Y(I=>{const P={...I};return delete P[w.id],P}),await p(),ie?.id===w.id&&E(null)}finally{N(null)}}},[ie?.id,d,p]);return n.jsxs("div",{className:"cheng-page cheng-applink",children:[n.jsxs("div",{className:"cheng-page__header cheng-page__header--row",children:[n.jsxs("div",{children:[n.jsx("h1",{className:"cheng-page__title",children:"App Link 管理"}),n.jsx("p",{className:"cheng-page__subtitle",children:"管理各平台接入连接，查看运行状态，按平台筛选并操作。"})]}),n.jsxs("button",{type:"button",className:"cheng-applink__refresh-btn",onClick:()=>{p()},"aria-label":"刷新列表",title:"刷新列表",children:[n.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]}),"刷新"]})]}),n.jsxs("div",{className:"cheng-applink__body",children:[n.jsx("div",{className:"cheng-applink__platforms",children:te.map(({platform:w,total:T,connectedCount:I})=>{const P=w.id===se.id,S=H.has(w.id);return n.jsxs("button",{type:"button",className:`cheng-applink__platform-card${P?" cheng-applink__platform-card--active":""}${S?"":" cheng-applink__platform-card--disabled"}`,onClick:()=>O(w.id),style:P?{borderColor:w.color}:{},children:[n.jsx("span",{className:"cheng-applink__platform-icon",style:{background:`${w.color}18`,color:w.color},role:"img","aria-label":w.label,children:w.emoji}),n.jsx("span",{className:"cheng-applink__platform-label",children:w.label}),!S&&n.jsx("span",{className:"cheng-applink__platform-soon",children:"Soon"}),S&&n.jsx("span",{className:`cheng-applink__platform-count${I>0?" cheng-applink__platform-count--active":""}`,children:T})]},w.id)})}),n.jsxs("div",{className:"cheng-applink__board",children:[n.jsxs("div",{className:"cheng-applink__board-header",children:[n.jsxs("div",{className:"cheng-applink__board-heading",children:[n.jsxs("h2",{className:"cheng-applink__board-title",children:[se.shortLabel," 列表"]}),n.jsx("span",{className:"cheng-applink__board-count",children:Q})]}),n.jsxs("div",{className:"cheng-applink__board-actions",children:[n.jsxs("label",{className:"cheng-applink__search",children:[n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("circle",{cx:"11",cy:"11",r:"7",stroke:"currentColor",strokeWidth:"1.8"}),n.jsx("path",{d:"M20 20l-3.5-3.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),n.jsx("input",{type:"search",value:R,onChange:w=>M(w.target.value),placeholder:`搜索 ${se.shortLabel} 名称、ID...`})]}),n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>z(!0),disabled:!H.has(se.id),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",se.shortLabel]})]})]}),le.length>0?n.jsx("div",{className:"cheng-applink__table-wrap",children:n.jsxs("table",{className:"cheng-applink__table",children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"连接名称"}),n.jsx("th",{children:"状态"}),n.jsx("th",{children:"绑定 Agent"}),n.jsx("th",{children:"Webhook / 描述"}),n.jsx("th",{children:"更新时间"}),n.jsx("th",{children:"操作"})]})}),n.jsx("tbody",{children:le.map(w=>{const T=G[w.id],I=T?.connectionState??w.connectionState,P=V(I),S=Zn.find(De=>De.id===w.appType)??se,J=W?.channelId===w.id,pe=xe[w.id]??"未绑定 Agent",be=W?.channelId===w.id&&W.action==="refresh",me=I==="disconnected";return n.jsxs("tr",{className:"cheng-applink__row",children:[n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--name",children:[n.jsx("div",{className:"cheng-applink__row-icon",style:{background:`${S.color}16`,color:S.color},children:n.jsx("span",{role:"img","aria-label":S.label,children:S.emoji})}),n.jsxs("div",{className:"cheng-applink__row-copy",children:[n.jsx("strong",{children:w.name}),n.jsxs("span",{children:["@",w.channelId]})]})]}),n.jsx("td",{className:"cheng-applink__cell",children:n.jsx("span",{className:`cheng-applink__badge ${P.cls}`,children:P.label})}),n.jsxs("td",{className:"cheng-applink__cell cheng-applink__cell--meta",children:[n.jsx("span",{children:pe}),w.boundWorkflowId&&n.jsxs("small",{children:["Workflow: ",w.boundWorkflowId]})]}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--endpoint",children:w.appType==="dingtalk"?n.jsxs("div",{className:"cheng-applink__stream-cell",children:[n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--stream",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Stream Mode"]}),(T?.lastEventAt??T?.lastError)&&n.jsx("span",{className:"cheng-applink__stream-meta",children:T.lastError?n.jsxs("span",{className:"cheng-applink__stream-error",title:T.lastError,children:["⚠ ",T.lastError.slice(0,40),T.lastError.length>40?"…":""]}):T?.lastEventAt?n.jsxs(n.Fragment,{children:["最近事件 ",ce(T.lastEventAt)]}):null})]}):w.appType==="slack"&&w.connectionConfig?.connection_mode==="socket_mode"?n.jsxs("span",{className:"cheng-applink__mode-tag cheng-applink__mode-tag--socket",children:[n.jsx("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:n.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),"Socket Mode"]}):n.jsx("span",{title:w.webhookUrl||w.description||"",children:w.webhookUrl||w.description||"—"})}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--time",children:ce(w.updatedAt??w.createdAt)}),n.jsx("td",{className:"cheng-applink__cell cheng-applink__cell--actions",children:n.jsxs("div",{className:"cheng-applink__row-actions",children:[me?n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"恢复连接",title:"恢复连接",onClick:()=>{m(w)},disabled:J,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M8 6.5v11l9-5.5-9-5.5Z",fill:"currentColor"})})}):n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"暂停连接",title:"暂停连接",onClick:()=>{K(w)},disabled:J,children:n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M9 5H7v14h2V5Zm8 0h-2v14h2V5Z",fill:"currentColor"})})}),n.jsx("button",{type:"button",className:`cheng-applink__icon-btn${be?" cheng-applink__icon-btn--spinning":""}`,"aria-label":"刷新状态",title:"刷新状态",onClick:()=>{B(w)},disabled:J,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M21 12a9 9 0 1 1-2.64-6.36",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 3v6h-6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn","aria-label":"编辑连接",title:"编辑连接",onClick:()=>E(w),children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M12 20h9",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})]})}),n.jsx("button",{type:"button",className:"cheng-applink__icon-btn cheng-applink__icon-btn--danger","aria-label":"删除连接",title:"删除连接",onClick:()=>{_(w)},disabled:J,children:n.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[n.jsx("path",{d:"M3 6h18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M8 6V4h8v2",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M19 6l-1 14H6L5 6",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M10 11v5M14 11v5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]})})]})})]},w.id||w.channelId)})})]})}):n.jsxs("div",{className:"cheng-applink__empty",children:[n.jsx("div",{className:"cheng-applink__empty-icon",children:n.jsx("span",{role:"img","aria-label":se.label,style:{fontSize:28},children:se.emoji})}),n.jsxs("p",{className:"cheng-applink__empty-title",children:[se.shortLabel," 暂无连接"]}),n.jsx("p",{className:"cheng-applink__empty-desc",children:R?`没有匹配 "${R}" 的连接`:`当前还没有 ${se.label} 接入连接`}),!R&&H.has(se.id)&&n.jsxs("button",{type:"button",className:"cheng-applink__create-btn",onClick:()=>z(!0),children:[n.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:n.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),"创建 ",se.shortLabel]})]})]})]}),n.jsx(af,{activePlatform:se,platforms:Zn,isCreateModalOpen:$,onCloseCreate:F,editingChannel:ie,onCloseEdit:()=>E(null),agents:X,onCreate:i,onUpdate:a,onRefresh:p,apiBaseUrl:h,onGoToAgents:b,liveStatusMap:G})]})}function mf({onLogout:l}){return n.jsxs("div",{className:"cheng-page",children:[n.jsxs("div",{className:"cheng-page__header",children:[n.jsx("h1",{className:"cheng-page__title",children:"Settings"}),n.jsx("p",{className:"cheng-page__subtitle",children:"Manage your account and preferences."})]}),n.jsx("div",{className:"cheng-page__content",children:n.jsx("div",{className:"cheng-page__settings-card",children:n.jsxs("div",{className:"cheng-page__settings-section",children:[n.jsx("h2",{className:"cheng-page__settings-section-title",children:"Account"}),n.jsx("p",{className:"cheng-page__settings-section-desc",children:"You are currently logged in. Click below to sign out of your account."}),n.jsxs("button",{type:"button",className:"cheng-page__logout-btn",onClick:l,children:[n.jsx(df,{}),"Sign Out"]})]})})})]})}function xf({channels:l,activeChannel:i,activeConfig:a,isLoading:d,onSelectChannel:p,onCreateChannel:h,onUpdateChannel:x,onDeleteChannel:b,onLogout:k,onRefreshChannels:v,apiBaseUrl:R,chatWindowProps:M={}}){const[$,z]=f.useState("chat"),[ie,E]=f.useState(!1),[W,N]=f.useState(null),[G,Y]=f.useState({}),[U,ee]=f.useState({}),H=f.useRef(null),X=[{id:"chat",label:"Chat",icon:n.jsx(Ed,{})},{id:"channel",label:"Agents",icon:n.jsx(Ad,{})},{id:"applink",label:"App Links",icon:n.jsx(lf,{})}],ae=()=>{E(!1),N(null),z("channel")},re=()=>{E(!1),N(null)},se=async te=>{window.confirm(`确定删除 Agent "${te.name}" 吗？删除后无法恢复。`)&&(await Promise.resolve(b(te.id)),W?.id===te.id&&N(null))};return f.useEffect(()=>{const te=`${R??""}:${l.map(Q=>`${Q.workspaceId}/${Q.boundWorkflowId}`).sort().join(",")}`;if(H.current===te)return;H.current=te,(async()=>{if(!R||l.length===0){H.current===te&&(Y({}),ee({}));return}const Q=new Ve(R),xe=new rt(R,Q);try{const O=await xe.listWorkspaces();H.current===te&&Y(Object.fromEntries(O.map(F=>[F.id,F.name||F.id])))}catch{H.current===te&&Y({})}const V=Array.from(new Map(l.filter(O=>O.boundWorkflowId?.trim()).map(O=>[O.boundWorkflowId,{workflowId:O.boundWorkflowId,workspaceId:O.workspaceId}])).values()),ce=await Promise.all(V.map(async({workflowId:O,workspaceId:F})=>{try{const B=await xe.getWorkflowName(O,F);return[O,B||O]}catch{return[O,O]}}));H.current===te&&ee(Object.fromEntries(ce))})()},[R,l]),n.jsxs("div",{className:"cheng-shell",children:[n.jsxs("div",{className:"cheng-shell__sidebar",children:[n.jsx("div",{className:"cheng-shell__logo","aria-label":"ChengOS logo",children:"CO"}),n.jsx("div",{className:"cheng-shell__divider"}),n.jsx("nav",{className:"cheng-shell__nav",children:X.map(te=>{const le=$===te.id;return n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${le?" cheng-shell__nav-item--active":""}`,onClick:()=>z(te.id),"aria-label":te.label,children:[te.icon,le&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:te.label})]},te.id)})}),n.jsxs("div",{className:"cheng-shell__bottom",children:[n.jsx("div",{className:"cheng-shell__divider"}),n.jsxs("button",{type:"button",className:`cheng-shell__nav-item${$==="settings"?" cheng-shell__nav-item--active":""}`,onClick:()=>z("settings"),"aria-label":"Settings",children:[n.jsx(cf,{}),$==="settings"&&n.jsx("span",{className:"cheng-shell__nav-active-bar"}),n.jsx("span",{className:"cheng-shell__tooltip",children:"Settings"})]})]})]}),n.jsxs("div",{className:"cheng-shell__main",children:[$==="chat"&&n.jsx(uf,{channels:l,activeChannel:i,activeConfig:a,isLoading:d,onSelectChannel:p,onCreateClick:()=>z("channel"),chatWindowProps:M}),$==="channel"&&n.jsx(ff,{channels:l,onCreateClick:()=>E(!0),onEditClick:te=>N(te),onDeleteClick:se,workspaceNames:G,workflowNames:U}),$==="applink"&&n.jsx(gf,{channels:l,onCreate:h,onUpdate:x,onDelete:b,onRefresh:v??(()=>{}),apiBaseUrl:R,onSuccess:ae,onGoToAgents:()=>z("channel")}),$==="settings"&&n.jsx(mf,{onLogout:k})]}),n.jsx(Mh,{isOpen:ie||!!W,onClose:re,mode:W?"edit":"create",initialChannel:W,existingChannels:l,onCreate:async te=>{await h(te)},onUpdate:async te=>{await x(te),ae()},apiBaseUrl:R}),n.jsx("style",{children:wf})]})}function _f(l){return n.jsx(Jp,{config:l.activeConfig,children:n.jsx(xf,{...l})})}const wf=`
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
`;function bf({apiBaseUrl:l,onLoginSuccess:i,title:a="ChengOS",subtitle:d="登录以管理你的 Channels"}){const[p,h]=f.useState(""),[x,b]=f.useState(""),[k,v]=f.useState(!1),[R,M]=f.useState(null),[$,z]=f.useState(!1),ie=f.useCallback(async E=>{E.preventDefault(),v(!0),M(null);try{await new ca(l).login({email:p,password:x}),i()}catch(W){M(W instanceof Error?W.message:String(W))}finally{v(!1)}},[l,p,x,i]);return n.jsxs("div",{style:Te.root,children:[n.jsx("div",{style:Te.orbTopLeft}),n.jsx("div",{style:Te.orbTopRight}),n.jsx("div",{style:Te.orbBottom}),n.jsx("div",{style:Te.container,children:n.jsxs("section",{style:Te.card,children:[n.jsx("div",{style:Te.cardGlow}),n.jsxs("div",{style:Te.content,children:[n.jsx("div",{style:Te.headerRow,children:n.jsxs("div",{style:Te.brandWrap,children:[n.jsx("div",{style:Te.brandLogo,children:"CO"}),n.jsx("div",{style:Te.brandText,children:"CHENGOS"})]})}),n.jsxs("div",{style:Te.titleWrap,children:[n.jsx("h1",{style:Te.title,children:a}),n.jsx("p",{style:Te.subtitle,children:d})]}),n.jsxs("form",{onSubmit:ie,style:Te.form,children:[n.jsxs("div",{style:Te.field,children:[n.jsx("label",{style:Te.label,htmlFor:"cheng-email",children:"邮箱"}),n.jsx("input",{id:"cheng-email",type:"email",required:!0,autoComplete:"email",value:p,onChange:E=>h(E.target.value),style:Te.input,placeholder:"you@example.com",disabled:k})]}),n.jsxs("div",{style:Te.field,children:[n.jsx("label",{style:Te.label,htmlFor:"cheng-password",children:"密码"}),n.jsx("input",{id:"cheng-password",type:"password",required:!0,autoComplete:"current-password",value:x,onChange:E=>b(E.target.value),style:Te.input,placeholder:"••••••••",disabled:k})]}),R&&n.jsx("div",{style:Te.error,children:R}),n.jsxs("button",{type:"submit",disabled:k,onMouseEnter:()=>z(!0),onMouseLeave:()=>z(!1),onFocus:()=>z(!0),onBlur:()=>z(!1),style:{...Te.button,...$&&!k?Te.buttonHovered:{},...k?Te.buttonDisabled:{}},children:[n.jsx("span",{children:k?"登录中...":"登录"}),n.jsx("span",{style:Te.arrow,children:"→"})]})]})]})]})})]})}const Te={root:{position:"relative",display:"flex",minHeight:"100%",width:"100%",overflow:"hidden",background:"radial-gradient(circle at top left, rgba(201, 100, 66, 0.14), transparent 30%), radial-gradient(circle at top right, rgba(217, 119, 87, 0.12), transparent 28%), linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},orbTopLeft:{position:"absolute",left:"-8rem",top:"-6rem",width:"16rem",height:"16rem",borderRadius:"9999px",background:"rgba(201, 100, 66, 0.12)",filter:"blur(56px)",pointerEvents:"none"},orbTopRight:{position:"absolute",right:"-6rem",top:"6rem",width:"18rem",height:"18rem",borderRadius:"9999px",background:"rgba(176, 174, 165, 0.2)",filter:"blur(56px)",pointerEvents:"none"},orbBottom:{position:"absolute",left:"32%",bottom:"-8rem",width:"20rem",height:"20rem",borderRadius:"9999px",background:"rgba(217, 119, 87, 0.12)",filter:"blur(60px)",pointerEvents:"none"},container:{position:"relative",zIndex:1,display:"flex",alignItems:"center",width:"100%",maxWidth:"36rem",minHeight:"100%",margin:"0 auto",padding:"2rem 1rem",boxSizing:"border-box"},card:{position:"relative",width:"100%",overflow:"hidden",borderRadius:"2rem",border:"1px solid #f0eee6",background:"#faf9f5",boxShadow:"0 0 0 1px #d1cfc5, rgba(0,0,0,0.07) 0px 16px 40px",backdropFilter:"blur(14px)"},cardGlow:{position:"absolute",inset:0,background:"radial-gradient(circle at top right, rgba(201, 100, 66, 0.08), transparent 34%), radial-gradient(circle at bottom left, rgba(217, 119, 87, 0.08), transparent 30%)",pointerEvents:"none"},content:{position:"relative",zIndex:1,padding:"1.75rem"},headerRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:"1.5rem"},brandWrap:{display:"flex",alignItems:"center",gap:"0.75rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"1rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700,boxShadow:"0 10px 24px rgba(226, 114, 91, 0.36)",letterSpacing:"0.03em"},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},titleWrap:{marginBottom:"1.5rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,letterSpacing:"-0.03em",color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},form:{display:"flex",flexDirection:"column",gap:"1rem"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"1rem",border:"1px solid #e8e6dc",background:"#faf9f5",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",boxShadow:"0 0 0 1px #d1cfc5",outline:"none"},error:{borderRadius:"1rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{height:"3rem",border:"1px solid #d1cfc5",borderRadius:"1rem",background:"#faf9f5",color:"#4d4c48",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",fontSize:"0.875rem",fontWeight:500,boxShadow:"0 0 0 1px #d1cfc5",cursor:"pointer",transition:"all 0.2s ease",marginTop:"0.25rem"},buttonHovered:{background:"#c96442",border:"1px solid #c96442",color:"#faf9f5",boxShadow:"0 0 0 1px #c96442, rgba(0,0,0,0.08) 0px 8px 24px"},buttonDisabled:{opacity:.7,cursor:"not-allowed",boxShadow:"none"},arrow:{fontSize:"1rem",lineHeight:1}};function yf({config:l,chatWindowProps:i={},loginTitle:a,loginSubtitle:d}){const{isAuthenticated:p,logout:h,refresh:x}=ah(l.apiBaseUrl),{channels:b,activeChannel:k,setActiveChannel:v,createChannel:R,updateChannel:M,deleteChannel:$,isLoading:z,refresh:ie}=sh({...l,workspaceId:""}),E=f.useCallback(async G=>R(G),[R]),W=f.useCallback(async G=>{await M(G)},[M]),N=f.useMemo(()=>{const G={...l,workspaceId:""};return k?{...G,workspaceId:k.workspaceId,channelId:k.channelId,boundWorkflowId:k.boundWorkflowId||G.boundWorkflowId}:G},[l,k]);return p?n.jsxs("div",{className:"cheng-layout cheng-layout--multi",children:[n.jsx(_f,{channels:b,activeChannel:k,activeConfig:N,isLoading:z,onSelectChannel:v,onCreateChannel:E,onUpdateChannel:W,onDeleteChannel:$,onLogout:h,onRefreshChannels:ie,apiBaseUrl:l.apiBaseUrl,chatWindowProps:i}),n.jsx("style",{children:vf})]}):n.jsx(bf,{apiBaseUrl:l.apiBaseUrl,onLoginSuccess:x,title:a,subtitle:d})}const vf=`
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
`;function kf({apiBaseUrl:l,token:i,onComplete:a}){const[d,p]=f.useState(""),[h,x]=f.useState(""),[b,k]=f.useState(!1),[v,R]=f.useState(!1),[M,$]=f.useState(null),z=f.useMemo(()=>i?.trim()||"",[i]),ie=f.useCallback(async E=>{if(E.preventDefault(),$(null),!z){$("重置链接无效，请重新申请密码找回邮件。");return}if(d!==h){$("两次输入的密码不一致。");return}k(!0);try{await new ca(l).resetPassword({token:z,new_password:d}),R(!0),a?.()}catch(W){$(W instanceof Error?W.message:String(W))}finally{k(!1)}},[l,h,a,d,z]);return n.jsx("div",{style:Oe.root,children:n.jsxs("main",{style:Oe.panel,children:[n.jsxs("div",{style:Oe.brandRow,children:[n.jsx("div",{style:Oe.brandLogo,children:"CO"}),n.jsx("div",{style:Oe.brandText,children:"CHENGOS"})]}),v?n.jsxs("section",{style:Oe.content,children:[n.jsx("h1",{style:Oe.title,children:"密码已重置"}),n.jsx("p",{style:Oe.subtitle,children:"现在可以使用新密码登录。"}),n.jsx("a",{href:"/",style:Oe.button,children:"返回登录"})]}):n.jsxs("form",{onSubmit:ie,style:Oe.content,children:[n.jsxs("div",{children:[n.jsx("h1",{style:Oe.title,children:"重置密码"}),n.jsx("p",{style:Oe.subtitle,children:"请输入新密码完成账号恢复。"})]}),n.jsxs("div",{style:Oe.field,children:[n.jsx("label",{style:Oe.label,htmlFor:"cheng-new-password",children:"新密码"}),n.jsx("input",{id:"cheng-new-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:d,onChange:E=>p(E.target.value),style:Oe.input,disabled:b||!z})]}),n.jsxs("div",{style:Oe.field,children:[n.jsx("label",{style:Oe.label,htmlFor:"cheng-confirm-password",children:"确认新密码"}),n.jsx("input",{id:"cheng-confirm-password",type:"password",required:!0,minLength:8,autoComplete:"new-password",value:h,onChange:E=>x(E.target.value),style:Oe.input,disabled:b||!z})]}),!z&&n.jsx("div",{style:Oe.error,children:"重置链接缺少 token，请重新申请密码找回邮件。"}),M&&n.jsx("div",{style:Oe.error,children:M}),n.jsx("button",{type:"submit",disabled:b||!z,style:Oe.button,children:b?"提交中...":"更新密码"}),n.jsx("a",{href:"/",style:Oe.secondaryLink,children:"返回登录"})]})]})})}const Oe={root:{display:"flex",minHeight:"100%",width:"100%",alignItems:"center",justifyContent:"center",boxSizing:"border-box",padding:"2rem 1rem",background:"linear-gradient(180deg, #f5f4ed 0%, #faf9f5 100%)",fontFamily:"Anthropic Sans, Inter, Arial, sans-serif"},panel:{width:"100%",maxWidth:"30rem",boxSizing:"border-box",border:"1px solid #d1cfc5",borderRadius:"1.25rem",background:"#faf9f5",padding:"1.75rem",boxShadow:"rgba(0,0,0,0.07) 0px 16px 40px"},brandRow:{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem"},brandLogo:{display:"flex",width:"2.75rem",height:"2.75rem",borderRadius:"0.875rem",alignItems:"center",justifyContent:"center",background:"#c96442",color:"#fff",fontSize:"0.78rem",fontWeight:700},brandText:{fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.28em",color:"#5e5d59"},content:{display:"flex",flexDirection:"column",gap:"1rem"},title:{margin:0,fontFamily:"Anthropic Serif, Georgia, serif",fontSize:"1.875rem",lineHeight:1.15,fontWeight:500,color:"#141413"},subtitle:{margin:"0.5rem 0 0",fontSize:"0.875rem",color:"#5e5d59"},field:{display:"flex",flexDirection:"column",gap:"0.5rem"},label:{fontSize:"0.875rem",fontWeight:500,color:"#141413"},input:{height:"3rem",width:"100%",boxSizing:"border-box",borderRadius:"0.875rem",border:"1px solid #e8e6dc",background:"#fff",padding:"0 1rem",fontSize:"0.875rem",color:"#141413",outline:"none"},error:{borderRadius:"0.875rem",border:"1px solid #e7b7ae",background:"#f7ebe8",padding:"0.75rem 1rem",fontSize:"0.875rem",color:"#b53333"},button:{display:"flex",height:"3rem",alignItems:"center",justifyContent:"center",border:"1px solid #c96442",borderRadius:"0.875rem",background:"#c96442",color:"#faf9f5",fontSize:"0.875rem",fontWeight:600,textDecoration:"none",cursor:"pointer"},secondaryLink:{alignSelf:"center",color:"#5e5d59",fontSize:"0.875rem",textDecoration:"none"}};function jf(){const l=window.__CHENGOS_APP_CONFIG__,i={apiBaseUrl:l?.apiBaseUrl||void 0||"/api/v1",wsBaseUrl:l?.wsUrl||void 0||"/ws/executions",channelId:l?.channelId||void 0||"weather-app",boundWorkflowId:l?.boundWorkflowId||void 0||""};if(window.location.pathname==="/reset-password"){const a=new URLSearchParams(window.location.search).get("token");return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(kf,{apiBaseUrl:i.apiBaseUrl,token:a})})}return n.jsx("div",{style:{width:"100vw",height:"100vh",backgroundColor:"#f3f4f6"},children:n.jsx(yf,{config:i,loginTitle:"Chengflow",loginSubtitle:"登录以管理你的 Channels",chatWindowProps:{title:"AI 助手",placeholder:"输入消息...",height:"100vh"}})})}const Td=document.getElementById("root");if(!Td)throw new Error("Root element not found");const Sf=Wp.createRoot(Td);Sf.render(n.jsx(zp.StrictMode,{children:n.jsx(jf,{})}));
