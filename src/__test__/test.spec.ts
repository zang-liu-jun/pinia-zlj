import { test, expect, describe } from "vitest"
import { createPinia, setActivePinia, defineStore } from "pinia"

describe("test", () => {

  test('can hydrate the state', () => {
    debugger
    const pinia = createPinia()
    setActivePinia(pinia)
    const useStore = defineStore({
      id: 'main',
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
    })

    pinia.state.value.main = {
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'string 2' },
      },
    }
    
    const store = useStore()

    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'string 2' },
      },
    })
  })
})