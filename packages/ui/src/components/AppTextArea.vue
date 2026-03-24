<script setup lang="ts">
export type TextAreaSize = 'sm' | 'md' | 'lg'
export type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  size?: TextAreaSize
  rows?: number
  resize?: TextAreaResize
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  id?: string
  name?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  rows: 4,
  resize: 'vertical',
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()
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

    <!-- Textarea -->
    <textarea
      :id="id"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        // Base
        'w-full rounded-lg border bg-white text-slate-800 placeholder:text-slate-400',
        'transition-all duration-150 outline-none leading-relaxed',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',

        // Resize
        resize === 'none'       && 'resize-none',
        resize === 'vertical'   && 'resize-y',
        resize === 'horizontal' && 'resize-x',
        resize === 'both'       && 'resize',

        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-3.5 py-2.5 text-sm',
        size === 'lg' && 'px-4 py-3 text-base',

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
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

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
