import{r as e,a as t}from"./react-vendor-__7b2ISL.js";import{aj as n,ak as o,al as a,am as r,an as s}from"./vendor-CeDBnZLH.js";const u="undefined"!=typeof document?e.useLayoutEffect:e.useEffect;function c(s){return function(o){const a=e.useReducer(()=>({}),{})[1],r={...o,onChange:(e,n)=>{var r;n?t.flushSync(a):a(),null==(r=o.onChange)||r.call(o,e,n)}},[s]=e.useState(()=>new n(r));return s.setOptions(r),u(()=>s._didMount(),[]),u(()=>s._willUpdate()),s}({observeElementRect:r,observeElementOffset:a,scrollToFn:o,...s})}
/**
   * react-table
   *
   * Copyright (c) TanStack
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   */function f(t,n){return t?function(e){return"function"==typeof e&&(()=>{const t=Object.getPrototypeOf(e);return t.prototype&&t.prototype.isReactComponent})()}(o=t)||"function"==typeof o||function(e){return"object"==typeof e&&"symbol"==typeof e.$$typeof&&["react.memo","react.forward_ref"].includes(e.$$typeof.description)}(o)?e.createElement(t,n):t:null;var o}function l(t){const n={state:{},onStateChange:()=>{},renderFallbackValue:null,...t},[o]=e.useState(()=>({current:s(n)})),[a,r]=e.useState(()=>o.current.initialState);return o.current.setOptions(e=>({...e,...t,state:{...a,...t.state},onStateChange:e=>{r(e),null==t.onStateChange||t.onStateChange(e)}})),o.current}export{l as a,f,c as u};
