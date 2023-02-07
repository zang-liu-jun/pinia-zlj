import { App, ref } from "vue";
import { Pinia } from "./types";

export let activePinia: Pinia
export const setActivePinia = (pinia: Pinia) => activePinia = pinia
export const piniaSymbol = Symbol()

export function createPinia() {
  let pinia: Pinia = {
    _s: new Map(),
    _p: [],
    state: ref<Record<string, any>>({}),
    install(app: App) {
      app.provide(piniaSymbol, pinia)
      console.log("mPinia🍎installed", pinia);
    },
    use(plugin) {
      this._p.push(plugin)
      return this
    }
  }
  return pinia
}