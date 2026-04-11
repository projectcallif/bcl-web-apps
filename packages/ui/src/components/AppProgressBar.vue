<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    progress: number;
    colorClass?: string;
    trackClass?: string;
  }>(),
  {
    colorClass: "bg-primary-500",
    trackClass: "bg-slate-100",
  }
);

const boundedProgress = computed(() => {
  return Math.max(0, Math.min(100, props.progress));
});
</script>

<template>
  <div class="h-1.5 rounded-full overflow-hidden w-full" :class="trackClass">
    <div
      class="h-full rounded-full transition-all duration-300"
      :class="colorClass"
      :style="{ width: `${boundedProgress}%` }"
    />
  </div>
</template>
