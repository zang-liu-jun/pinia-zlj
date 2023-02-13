import { Pinia, SafeStore } from "../types";

export function persistentPlugin({ pinia, store }: { pinia: Pinia, store: SafeStore }) {
  let localData = localStorage.getItem(`PINIA_ZLJ_${store.$id}`)
  if (localData) {
    store.$state = JSON.parse(localData)
  }
  store.$subscribe(({ storeId }, state) => {
    localStorage.setItem(`PINIA_ZLJ_${storeId}`, JSON.stringify(state))
  })
}
