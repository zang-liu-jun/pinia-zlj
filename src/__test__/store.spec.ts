import { describe, expect, test, beforeEach } from "vitest";
import { createPinia, defineStore, setActivePinia } from "../index";

describe("Store", () => {
  // setActivePinia(createPinia())
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  const useStore = defineStore("main", {
    state() {
      return {
        foo: true,
        baz: {
          qux: "qux",
          a: { b: "string" }
        }
      }
    }
  })
  test("reuses a store", () => {
    const useStore = defineStore({ id: "main" })
    expect(useStore()).toBe(useStore())
  })
})