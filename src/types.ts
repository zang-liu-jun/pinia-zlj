import { App, Ref, UnwrapRef } from "vue"

export type Pinia = {
  _s: Map<string | symbol, Store<string, StateTree, any, _ActionsTree>>
  _p: Function[]
  state: Ref<Record<string, any>>
  install: (app: App) => void
  use: (
    plugin:
      (() => any) |
      ((context: {
        pinia: Pinia,
        store: Store<string, StateTree, _GettersTree<StateTree>, _ActionsTree>
      }) => any)
  ) => Pinia
}

export type StateTree = Record<string | number | symbol, any>
export type _GettersTree<S extends StateTree> = Record<
  string,
  ((state: S) => any)
  | (() => any)
>
export type _ActionsTree = Record<string, (...args: any[]) => any>

export type Store<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
> = S & G & A & BaseStore<Id, S>

export type BaseStore<
  Id extends string,
  S extends StateTree
> = {
  $dispose: () => void
  $id: Id
  $patch: (
    partialStoreOrMutator: Record<string, any> | ((state: S) => void)
  ) => void
  $reset: () => void
  $subscribe: (
    callback: (
      { storeId }: { storeId: string },
      state: S
    ) => void,
    options?: Record<string, any>
  ) => void
  $onAction: (
    callback: (
      obj: {
        after?: Function;
        onError?: Function
      }) => any
  ) => void
  $state?: S
}

export type DefineStoreOptions<
  Id extends string,
  S extends StateTree,
  G,
  A
> = {
  id: Id
  state?: () => S
  getters?: G &
  ThisType<
    S
  > &
  _GettersTree<S>

  actions?: A & ThisType<S>
}

export type SafeStore = Store<
  string,
  StateTree,
  _GettersTree<StateTree>,
  _ActionsTree
>