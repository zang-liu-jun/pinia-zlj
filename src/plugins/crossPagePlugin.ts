import { SafeStore, Pinia } from "../types";
export function crossPagePlugin({ pinia, store }: { pinia: Pinia, store: SafeStore }) {
  const bc = new BroadcastChannel("pinia-zlj")
  store.$subscribe(({ storeId }, state) => {
    bc.postMessage(JSON.stringify(store.$state))
  })

  bc.onmessage = (state) => {
    store.$state = JSON.parse(state.data)
  }
}