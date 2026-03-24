<script setup lang="ts">
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      // ── Base ───────────────────────────────────────────────────────
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-md border cursor-pointer',
      'transition-all duration-150 whitespace-nowrap select-none',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',

      // ── Sizes ──────────────────────────────────────────────────────
      size === 'sm' && 'px-3 py-1 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',

      // ── Variants ───────────────────────────────────────────────────
      variant === 'primary'   && [
        'bg-primary text-white border-primary',
        'hover:bg-primary-800 focus-visible:outline-primary',
      ],
      variant === 'secondary' && [
        'bg-secondary text-white border-secondary',
        'hover:bg-secondary-600 focus-visible:outline-secondary',
      ],
      variant === 'tertiary'  && [
        'bg-tertiary text-white border-tertiary',
        'hover:bg-tertiary-600 focus-visible:outline-tertiary',
      ],
      variant === 'danger'    && [
        'bg-red-500 text-white border-red-500',
        'hover:bg-red-600 focus-visible:outline-red-500',
      ],
      variant === 'ghost'     && [
        'bg-transparent text-slate-600 border-transparent',
        'hover:bg-slate-100 focus-visible:outline-slate-400',
      ],

      loading && 'opacity-75',
    ]"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <span
      v-if="loading"
      class="w-[0.875em] h-[0.875em] rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
