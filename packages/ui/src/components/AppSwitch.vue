<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    activeColorClass?: string;
    inactiveColorClass?: string;
  }>(),
  {
    activeColorClass: "bg-emerald-500",
    inactiveColorClass: "bg-slate-200",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <label
    class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer shrink-0"
    :class="internalValue ? activeColorClass : inactiveColorClass"
  >
    <input type="checkbox" v-model="internalValue" class="sr-only" />
    <span
      class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm"
      :class="internalValue ? 'translate-x-[22px]' : 'translate-x-1'"
    />
  </label>
</template>
