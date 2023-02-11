import {
  ComputedRef,
  getCurrentInstance,
  inject,
  reactive,
  computed,
  toRefs,
  watch,
  isRef,
  isReactive
} from "vue"
import {
  activePinia,
  piniaSymbol,
  setActivePinia
} from "./createPinia"
import {
  addSubscription,
  triggerSubscriptions,
  EventEmitter
} from "./subscribe"

import type {
  DefineStoreOptions,
  Pinia,
  StateTree,
  Store,
  BaseStore,
  _ActionsTree,
  _GettersTree
} from "./types"

function isComputed(o: any) {
  return !!(isRef(o) && (o as any).effect)
}
function isObject(obj: any) {
  return typeof obj === "object" && obj !== null
}
export function createOptionsStore<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
>(
  id: Id,
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia
): Store<Id, S, G, A> {
  const { state, getters, actions } = options

  function setup() {
    pinia.state.value[id] = state ? state() : {}
    const localState = toRefs(pinia.state.value[id])
    return Object.assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = computed(() => {
          const store = pinia._s.get(id)
          // TODO: 第二个参数咋办
          return (getters![name] as any).call(store, store)
        })
        return computedGetters
      }, {} as Record<string, ComputedRef>)
    )
  }
  const store = createSetupStore(id, setup, options, pinia, true)
  return store
}

export function createSetupStore<
  Id extends string,
  SS extends StateTree,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
>(
  $id: Id,
  setup: () => SS,
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia,
  isOptionsStore: boolean
): Store<Id, S, G, A> {

  const eventEmitter = new EventEmitter()
  const { state } = options
  // const actionSubscriptions: Function[] = []
  const partialStore: BaseStore<Id, S> = {
    $id,
    $patch,
    $subscribe(callback, options = {}) {
      watch(pinia.state.value[$id], (state) => {
        callback({ storeId: $id }, state as any)
      }, options)
    },
    // $onAction: addSubscription.bind(null, actionSubscriptions)
    $onAction: eventEmitter.add.bind(eventEmitter, "onAction"),
    $dispose: () => { },
    $reset() {
      if (!isOptionsStore) {
        throw new Error("🍎不能在setupStore中使用$reset!")
      }
      const newState = state ? state() : {}
      store.$patch(state => {
        Object.assign(state, newState)
      })
    }
  }
  const store = reactive(partialStore)
  const setupStore = setup()

  if (!pinia.state.value[$id] && !isOptionsStore) {
    pinia.state.value[$id] = {}
  }
  for (let key in setupStore) {
    const prop = setupStore[key]
    if (typeof prop === "function") {
      setupStore[key] = wrapAction(prop) as any
    }
    if (!isOptionsStore) {
      if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
        pinia.state.value[$id][key] = prop
      }
    }
  }

  function wrapAction(action: (...args: any) => any) {
    return function () {
      // 源码的发布订阅：
      // const afterCallbackList: Function[] = []
      // const onErrorCallbackList: Function[] = []
      // function after(callback: Function) {
      //   afterCallbackList.push(callback)
      // }
      // function onError(callback: Function) {
      //   onErrorCallbackList.push(callback)
      // }
      // triggerSubscriptions(actionSubscriptions, {after, onError })
      // let ret
      // try{
      //   ret = action.apply(store, Array.from(arguments))
      //   triggerSubscriptions(afterCallbackList,ret)
      // }catch(e){
      //   triggerSubscriptions(onErrorCallbackList,e)
      // }
      // return ret
      eventEmitter.trigger("onAction", {
        after: eventEmitter.add.bind(eventEmitter, "after"),
        onError: eventEmitter.add.bind(eventEmitter, "onError")
      })
      let ret
      try {
        ret = action.apply(store, Array.from(arguments))
        eventEmitter.trigger("after", ret)
      } catch (e) {
        eventEmitter.trigger("onError", e)
      }
      return ret
    }
  }

  function $patch(partialStoreOrMutator: Record<string, any> | ((state: S) => void)) {
    if (typeof partialStoreOrMutator === "function") {
      partialStoreOrMutator(pinia.state.value[$id])
    } else {
      mergeReactiveObject(pinia.state.value[$id], partialStoreOrMutator)
    }
  }

  function mergeReactiveObject(target: Record<string, any>, state: Record<string, any>) {
    for (let key in state) {
      let oldValue = target[key]
      let newValue = state[key]
      if (isObject(oldValue) && isObject(newValue)) {
        target[key] = mergeReactiveObject(oldValue, newValue)
      } else {
        target[key] = newValue
      }
    }
  }
  pinia._s.set($id, store)
  Object.assign(store, setupStore)
  Object.defineProperty(store, "$state", {
    get() {
      return pinia.state.value[$id]
    },
    set(state) {
      store.$patch($state => Object.assign($state, state))
    }
  })

  pinia._p.forEach(plugin => {
    Object.assign(store, plugin({ pinia, store }))
  })
  // TODO:不会
  return store as any
}

// defineStore的函数重载
export function defineStore<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
>(
  options: DefineStoreOptions<Id, S, G, A>
): (() => Store<Id, S, G, A>)

export function defineStore<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
>(
  id: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, "id">
): (() => Store<Id, S, G, A>)

export function defineStore<
  Id extends string,
  SS
>(id: Id, storeSetup: () => SS): () => Store<Id, StateTree, any, any>

// 具体实现defineStore
export function defineStore(
  idOrOptions: any,
  setup?: any
): (() => Store<string, StateTree, _GettersTree<StateTree>,
  _ActionsTree>) {
  let id: string
  let options: DefineStoreOptions<
    string,
    StateTree,
    _GettersTree<StateTree>,
    _ActionsTree
  >
  if (typeof idOrOptions === "string") {
    id = idOrOptions
    options = setup
  } else {
    id = idOrOptions.id
    options = idOrOptions
  }
  function useStore(): Store<
    string,
    StateTree,
    _GettersTree<StateTree>,
    _ActionsTree
  > {
    const currentInstance = getCurrentInstance()
    let pinia: Pinia
    if (activePinia) {
      pinia = activePinia
    } else {
      if (currentInstance === null) {
        throw new Error("🍎未在组件中使用并且没有设置activePinia")
      }
      pinia = currentInstance && inject(piniaSymbol) as Pinia
    }
    setActivePinia(pinia)

    if (!pinia._s.has(id)) {
      if (typeof setup === "function") {
        createSetupStore(id, setup, options, pinia, false)
      } else {
        createOptionsStore(id, options, pinia)
      }
    }
    const store = pinia._s.get(id)!
    return store
  }
  return useStore
}
