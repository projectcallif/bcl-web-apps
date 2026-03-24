<script setup lang="ts">
import { ref } from 'vue'
import AppTextInput from './AppTextInput.vue'
import type { InputSize } from './AppTextInput.vue'

export type { InputSize }

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  size?: InputSize
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  id?: string
  name?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const showPassword = ref(false)
</script>

<template>
  <AppTextInput
    :id="id"
    :name="name"
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="showPassword ? 'text' : 'password'"
    :size="size"
    :disabled="disabled"
    :required="required"
    :error="error"
    :hint="hint"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
    <template #suffix>
      <button
        type="button"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        class="text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:text-primary"
        @click="showPassword = !showPassword"
      >
        <!-- Eye open — password hidden -->
        <svg
          v-if="!showPassword"
          class="w-4.5 h-4.5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <path d="M2 10s3.2-6 8-6 8 6 8 6-3.2 6-8 6-8-6-8-6Z" stroke-linejoin="round"/>
          <circle cx="10" cy="10" r="2.5"/>
        </svg>
        <!-- Eye closed — password visible -->
        <svg
          v-else
          class="w-4.5 h-4.5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <path d="M3 3l14 14M8.5 8.6A2.5 2.5 0 0 0 12.4 12M6.3 5.3C4.5 6.4 3 8.3 2 10c1.6 2.9 4.6 6 8 6a8 8 0 0 0 3.7-.9M9.4 4.1A8 8 0 0 1 10 4c3.4 0 6.4 3.1 8 6a13 13 0 0 1-1.5 2.3" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
      </button>
    </template>
  </AppTextInput>
</template>
