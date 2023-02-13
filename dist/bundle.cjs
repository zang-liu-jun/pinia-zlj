"use strict";var t=require("vue");exports.activePinia=void 0;const e=t=>exports.activePinia=t,n=Symbol();function s(t,e,n,s){return new(n||(n=Promise))((function(r,i){function o(t){try{c(s.next(t))}catch(t){i(t)}}function a(t){try{c(s.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}c((s=s.apply(t,e||[])).next())}))}class r{constructor(){this.events={}}add(t,e){this.events[t]||(this.events[t]=[]),this.events[t].push(e)}trigger(t,...e){this.events[t]&&this.events[t].forEach((t=>t(...e)))}off(t){this.events[t]&&(this.events[t]=[])}}function i(t){return"object"==typeof t&&null!==t}function o(e,n,s){const{state:r,getters:i,actions:o}=n;return a(e,(function(){s.state.value[e]=r?r():{};const n=t.toRefs(s.state.value[e]);return Object.assign(n,o,Object.keys(i||{}).reduce(((n,r)=>(n[r]=t.computed((()=>{const t=s._s.get(e);return i[r].call(t,t)})),n)),{}))}),n,s,!0)}function a(e,n,o,a,c){const u=new r,{state:f}=o,p={$id:e,$patch:function(t){"function"==typeof t?t(a.state.value[e]):h(a.state.value[e],t)},$subscribe(n,s={}){t.watch(a.state.value[e],(t=>{n({storeId:e},t)}),s)},$onAction:u.add.bind(u,"onAction"),$dispose:()=>{},$reset(){if(!c)throw new Error("🍎不能在setupStore中使用$reset!");const t=f?f():{};l.$patch((e=>{Object.assign(e,t)}))}},l=t.reactive(p),v=n();a.state.value[e]||c||(a.state.value[e]={});for(let n in v){const s=v[n];"function"==typeof s&&(v[n]=g(s)),c||(t.isRef(s)&&(d=s,!t.isRef(d)||!d.effect)||t.isReactive(s))&&(a.state.value[e][n]=s)}var d;function g(t){return function(){return s(this,arguments,void 0,(function*(){let e;u.trigger("onAction",{after:u.add.bind(u,"after"),onError:u.add.bind(u,"onError")});try{e=yield t.apply(l,Array.from(arguments)),u.trigger("after",e)}catch(t){u.trigger("onError",t)}finally{u.off("after"),u.off("onError")}return e}))}}function h(t,e){for(let n in e){let s=t[n],r=e[n];i(s)&&i(r)?t[n]=h(s,r):t[n]=r}}return a._s.set(e,l),Object.assign(l,v),Object.defineProperty(l,"$state",{get:()=>a.state.value[e],set(t){l.$patch((e=>Object.assign(e,t)))}}),a._p.forEach((t=>{Object.assign(l,t({pinia:a,store:l}))})),l}exports.EventEmitter=r,exports.addSubscription=function(t,e){return t.push(e),()=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)}},exports.createOptionsStore=o,exports.createPinia=function(){let e={_s:new Map,_p:[],state:t.ref({}),install(t){t.provide(n,e),console.log("mPinia🍎installed",e)},use(t){return this._p.push(t),this}};return e},exports.createSetupStore=a,exports.crossPagePlugin=function({pinia:t,store:e}){const n=new BroadcastChannel("pinia-zlj");e.$subscribe((({storeId:t},s)=>{n.postMessage(JSON.stringify(e.$state))})),n.onmessage=t=>{e.$state=JSON.parse(t.data)}},exports.defineStore=function(s,r){let i,c;return"string"==typeof s?(i=s,c=r):(i=s.id,c=s),function(){const s=t.getCurrentInstance();let u;if(exports.activePinia)u=exports.activePinia;else{if(null===s)throw new Error("🍎未在组件中使用并且没有设置activePinia");u=s&&t.inject(n)}return e(u),u._s.has(i)||("function"==typeof r?a(i,r,c,u,!1):o(i,c,u)),u._s.get(i)}},exports.persistentPlugin=function({pinia:t,store:e}){let n=localStorage.getItem(`PINIA_ZLJ_${e.$id}`);n&&(e.$state=JSON.parse(n)),e.$subscribe((({storeId:t},e)=>{localStorage.setItem(`PINIA_ZLJ_${t}`,JSON.stringify(e))}))},exports.piniaSymbol=n,exports.setActivePinia=e,exports.triggerSubscriptions=function(t,...e){t.slice().forEach((t=>t(...e)))};
