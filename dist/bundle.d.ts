import { Ref, App } from 'vue';

type Pinia = {
    _s: Map<string | symbol, Store<string, StateTree, any, _ActionsTree>>;
    _p: Function[];
    state: Ref<Record<string, any>>;
    install: (app: App) => void;
    use: (plugin: (() => any) | ((context: {
        pinia: Pinia;
        store: Store<string, StateTree, _GettersTree<StateTree>, _ActionsTree>;
    }) => any)) => Pinia;
};
type StateTree = Record<string | number | symbol, any>;
type _GettersTree<S extends StateTree> = Record<string, ((state: S) => any) | (() => any)>;
type _ActionsTree = Record<string, (...args: any[]) => any>;
type Store<Id extends string, S extends StateTree, G extends _GettersTree<S>, A extends _ActionsTree> = S & G & A & BaseStore<Id, S>;
type BaseStore<Id extends string, S extends StateTree> = {
    $dispose: () => void;
    $id: Id;
    $patch: (partialStoreOrMutator: Record<string, any> | ((state: S) => void)) => void;
    $reset: () => void;
    $subscribe: (callback: ({ storeId }: {
        storeId: string;
    }, state: S) => void, options?: Record<string, any>) => void;
    $onAction: (callback: (obj: {
        after?: Function;
        onError?: Function;
    }) => any) => void;
    $state?: S;
};
type DefineStoreOptions<Id extends string, S extends StateTree, G, A> = {
    id: Id;
    state?: () => S;
    getters?: G & ThisType<S> & _GettersTree<S>;
    actions?: A & ThisType<S>;
};

declare let activePinia: Pinia;
declare const setActivePinia: (pinia: Pinia) => Pinia;
declare const piniaSymbol: unique symbol;
declare function createPinia(): Pinia;

declare function createOptionsStore<Id extends string, S extends StateTree, G extends _GettersTree<S>, A extends _ActionsTree>(id: Id, options: DefineStoreOptions<Id, S, G, A>, pinia: Pinia): Store<Id, S, G, A>;
declare function createSetupStore<Id extends string, SS extends StateTree, S extends StateTree, G extends _GettersTree<S>, A extends _ActionsTree>($id: Id, setup: () => SS, options: DefineStoreOptions<Id, S, G, A>, pinia: Pinia, isOptionsStore: boolean): Store<Id, S, G, A>;
declare function defineStore<Id extends string, S extends StateTree, G extends _GettersTree<S>, A extends _ActionsTree>(options: DefineStoreOptions<Id, S, G, A>): (() => Store<Id, S, G, A>);
declare function defineStore<Id extends string, S extends StateTree, G extends _GettersTree<S>, A extends _ActionsTree>(id: Id, options: Omit<DefineStoreOptions<Id, S, G, A>, "id">): (() => Store<Id, S, G, A>);
declare function defineStore<Id extends string, SS>(id: Id, storeSetup: () => SS): () => Store<Id, StateTree, any, any>;

declare function addSubscription(subscriptions: Function[], callback: Function): () => void;
declare function triggerSubscriptions(subscriptions: Function[], ...args: any): void;
declare class EventEmitter<T extends string> {
    events: Record<string, Function[]>;
    constructor();
    add(type: T, callback: Function): void;
    trigger(type: T, ...args: any): void;
}

export { BaseStore, DefineStoreOptions, EventEmitter, Pinia, StateTree, Store, _ActionsTree, _GettersTree, activePinia, addSubscription, createOptionsStore, createPinia, createSetupStore, defineStore, piniaSymbol, setActivePinia, triggerSubscriptions };
