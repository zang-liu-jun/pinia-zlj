import { describe, expect, test, beforeEach } from "vitest";
import { createPinia, defineStore, setActivePinia } from "../index";
import { } from "vue"
import { mount } from "@vue/test-utils"

describe("Store", () => {
  // setActivePinia(createPinia())
  beforeEach(() => {
    setActivePinia(createPinia())
  })
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

  test("重复使用某个store", () => {
    const useStore = defineStore({ id: "main" })
    expect(useStore()).toBe(useStore())
  })

  test("id作为第一个参数", () => {
    const useStore = defineStore('main', {
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
    })
    expect(useStore()).toBe(useStore())
    const useStoreEmpty = defineStore('main', {})
    expect(useStoreEmpty()).toBe(useStoreEmpty())
  })

  test("最初设置的store", () => {
    const store = useStore()
    expect(store!.$state).toEqual({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    })
  })

  test("没有设置activePinia", async () => {
    setActivePinia(undefined as any)
    const pinia = createPinia()
    const useStore = defineStore({
      id: 'main',
      state: () => ({ n: 0 }),
    })
    const TestComponent = {
      template: `<div>{{ store. n }}</div>`,
      setup() {
        const store = useStore()
        return { store }
      },
    }
    const w1 = mount(TestComponent, { global: { plugins: [pinia] } })
    const w2 = mount(TestComponent, { global: { plugins: [pinia] } })
    
    expect(w1.text()).toBe('0')
    expect(w2.text()).toBe('0')

    w1.vm.store!.n++
    // 等待dom更新完成
    await w1.vm.$nextTick()
    expect(w1.text()).toBe('1')
    expect(w2.text()).toBe('1')
  })
})