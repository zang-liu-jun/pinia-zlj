import { describe, expect, test, beforeEach, vi } from "vitest";
import { createPinia, defineStore, setActivePinia } from "../index";
import { defineComponent,nextTick} from "vue"
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
    await w1.vm.$nextTick()
    expect(w1.text()).toBe('1')
    expect(w2.text()).toBe('1')
  })

  test("可以被reset", () => {
    const store = useStore()!
    const spy = vi.fn()
    store.$subscribe(spy, { flush: "sync" })
    expect(spy).not.toHaveBeenCalled()
    store.$reset()
    expect(spy).toHaveBeenCalledTimes(1)
    store.$state!.nested.foo = "bar"
    expect(spy).toHaveBeenCalledTimes(2)
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
    })
    expect(store.nested.foo).toBe('bar')
  })

  test('如果没有state,可以创造一个空state', () => {
    const store = defineStore({ id: 'some' })()
    expect(store.$state).toEqual({})
  })

  test('直接修改pinia的state', () => {
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

    const store = useStore()
    pinia.state.value.main = {
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'string 2' },
      },
    }

    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'string 2' },
      },
    })
  })

  test('可以在两个不同的组件中使用一个pinia', async () => {
    const useStore = defineStore({ id: 'one', state: () => ({ n: 0 }) })
    const pinia = createPinia()

    const Comp = defineComponent({
      setup() {
        const store = useStore()
        return { store }
      },
      template: `{{ store.n }}`,
    })

    const One = mount(Comp, {
      global: {
        plugins: [pinia],
      },
    })

    const Two = mount(Comp, {
      global: {
        plugins: [pinia],
      },
    })

    const store = useStore()

    expect(One.text()).toBe('0')
    expect(Two.text()).toBe('0')

    store.n++
    await nextTick()

    expect(One.text()).toBe('1')
    expect(Two.text()).toBe('1')
  })
})