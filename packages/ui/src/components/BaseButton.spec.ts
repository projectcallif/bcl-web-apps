import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('applies the correct variant class', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'danger' },
      slots: { default: 'Delete' },
    })
    expect(wrapper.classes()).toContain('base-button--danger')
  })

  it('applies the correct size class', () => {
    const wrapper = mount(BaseButton, {
      props: { size: 'lg' },
      slots: { default: 'Large' },
    })
    expect(wrapper.classes()).toContain('base-button--lg')
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows spinner and is disabled when loading', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Loading' },
    })
    expect(wrapper.find('.base-button__spinner').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('renders a submit button when type is submit', () => {
    const wrapper = mount(BaseButton, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
