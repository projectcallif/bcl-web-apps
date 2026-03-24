<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
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
        <Eye v-if="!showPassword" class="w-4.5 h-4.5" aria-hidden="true" />
        <EyeOff v-else class="w-4.5 h-4.5" aria-hidden="true" />
      </button>
    </template>
  </AppTextInput>
</template>
