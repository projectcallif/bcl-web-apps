<script setup lang="ts">
import { useSlots } from 'vue'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: InputType
  size?: InputSize
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  id?: string
  name?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const slots = useSlots()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      :class="[
        'text-sm font-medium leading-none',
        error ? 'text-red-600' : 'text-slate-700',
        disabled && 'opacity-50 cursor-not-allowed',
      ]"
    >
      {{ label }}
      <span v-if="required" class="ml-0.5 text-red-500" aria-hidden="true">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      
      <input
        :id="id"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          // Base
          'w-full rounded-xl border bg-white text-slate-800 placeholder:text-slate-400',
          'transition-all duration-150 outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',

          // Sizes
          size === 'sm' && (slots.suffix ? 'pl-3 pr-9 py-1.5 text-sm' : 'px-3 py-1.5 text-sm'),
          size === 'md' && (slots.suffix ? 'pl-3.5 pr-10 py-2.5 text-sm' : 'px-3.5 py-2.5 text-sm'),
          size === 'lg' && (slots.suffix ? 'pl-4 pr-12 py-3 text-base' : 'px-4 py-3 text-base'),

          // State: normal
          !error && [
            'border-slate-300',
            'hover:border-slate-400',
            'focus:border-primary focus:ring-3 focus:ring-primary-100',
          ],

          // State: error
          error && [
            'border-red-400',
            'hover:border-red-500',
            'focus:border-red-500 focus:ring-3 focus:ring-red-100',
          ],
        ]"
        v-bind="$attrs"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <!-- Suffix slot (e.g. show/hide password toggle) -->
      <div
        v-if="slots.suffix"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <slot name="suffix" />
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-600">
      <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5Zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
      {{ error }}
    </p>

    <!-- Hint text -->
    <p v-else-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
