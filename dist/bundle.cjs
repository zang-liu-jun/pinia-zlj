"use strict";var t=require("vue");exports.activePinia=void 0;const e=t=>exports.activePinia=t,n=Symbol();class r{constructor(){this.events={}}add(t,e){this.events[t]||(this.events[t]=[]),this.events[t].push(e)}trigger(t,...e){this.events[t]&&this.events[t].forEach((t=>t(...e)))}}function s(t){return"object"==typeof t&&null!==t}function i(e,n,r){const{state:s,getters:i,actions:a}=n;return o(e,(function(){r.state.value[e]=s?s():{};const n=t.toRefs(r.state.value[e]);return Object.assign(n,a,Object.keys(i||{}).reduce(((n,s)=>(n[s]=t.computed((()=>{const t=r._s.get(e);return i[s].call(t,t)})),n)),{}))}),n,r,!0)}function o(e,n,i,o,a){const c=new r,{state:u}=i,f={$id:e,$patch:function(t){"function"==typeof t?t(o.state.value[e]):g(o.state.value[e],t)},$subscribe(n,r={}){t.watch(o.state.value[e],(t=>{n({storeId:e},t)}),r)},$onAction:c.add.bind(c,"onAction"),$dispose:()=>{},$reset(){if(!a)throw new Error("🍎不能在setupStore中使用$reset!");const t=u?u():{};p.$patch((e=>{Object.assign(e,t)}))}},p=t.reactive(f),l=n();o.state.value[e]||a||(o.state.value[e]={});for(let n in l){const r=l[n];"function"==typeof r&&(l[n]=d(r)),a||(t.isRef(r)&&(v=r,!t.isRef(v)||!v.effect)||t.isReactive(r))&&(o.state.value[e][n]=r)}var v;function d(t){return function(){let e;c.trigger("onAction",{after:c.add.bind(c,"after"),onError:c.add.bind(c,"onError")});try{e=t.apply(p,Array.from(arguments)),c.trigger("after",e)}catch(t){c.trigger("onError",t)}return e}}function g(t,e){for(let n in e){let r=t[n],i=e[n];s(r)&&s(i)?t[n]=g(r,i):t[n]=i}}return o._s.set(e,p),Object.assign(p,l),Object.defineProperty(p,"$state",{get:()=>o.state.value[e],set(t){p.$patch((e=>Object.assign(e,t)))}}),o._p.forEach((t=>{Object.assign(p,t({pinia:o,store:p}))})),p}exports.EventEmitter=r,exports.addSubscription=function(t,e){return t.push(e),()=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)}},exports.createOptionsStore=i,exports.createPinia=function(){let e={_s:new Map,_p:[],state:t.ref({}),install(t){t.provide(n,e),console.log("mPinia🍎installed",e)},use(t){return this._p.push(t),this}};return e},exports.createSetupStore=o,exports.defineStore=function(r,s){let a,c;return"string"==typeof r?(a=r,c=s):(a=r.id,c=r),function(){const r=t.getCurrentInstance();let u;if(exports.activePinia)u=exports.activePinia;else{if(null===r)throw new Error("🍎未在组件中使用并且没有设置activePinia");u=r&&t.inject(n)}return e(u),u._s.has(a)||("function"==typeof s?o(a,s,c,u,!1):i(a,c,u)),u._s.get(a)}},exports.piniaSymbol=n,exports.setActivePinia=e,exports.triggerSubscriptions=function(t,...e){t.slice().forEach((t=>t(...e)))};