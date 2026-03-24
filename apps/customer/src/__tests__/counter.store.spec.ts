import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initialises with count of 0', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
  })

  it('increments the count', () => {
    const counter = useCounterStore()
    counter.increment()
    expect(counter.count).toBe(1)
  })

  it('decrements the count', () => {
    const counter = useCounterStore()
    counter.increment()
    counter.decrement()
    expect(counter.count).toBe(0)
  })

  it('resets the count to 0', () => {
    const counter = useCounterStore()
    counter.increment()
    counter.increment()
    counter.reset()
    expect(counter.count).toBe(0)
  })

  it('computes doubleCount correctly', () => {
    const counter = useCounterStore()
    counter.increment()
    counter.increment()
    counter.increment()
    expect(counter.doubleCount).toBe(6)
  })
})
