<script setup lang="ts">
import { computed } from "vue";

export interface SelectOption {
  label: string;
  value: string | number;
}

const props = defineProps<{
  id?: string;
  modelValue?: string | number;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const value = computed({
  get: () => props.modelValue ?? "",
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
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
      <span v-if="required" class="ml-0.5 text-red-500" aria-hidden="true"
        >*</span
      >
    </label>

    <div class="relative w-full">
      <select
        :id="id"
        v-model="value"
        :disabled="disabled"
        :required="required"
        class="bg-white border border-slate-300 text-slate-800 text-sm rounded-xl focus:border-primary focus:ring-3 focus:ring-primary-100 block w-full p-2.5 shadow-sm outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-10 transition-all duration-150"
      >
        <option v-if="placeholder" value="" disabled selected>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-600">
      <svg
        class="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5Zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
        />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
