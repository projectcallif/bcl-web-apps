<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg" | "xl";
  }>(),
  {
    size: "lg",
  },
);

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return {
        wrapper: "w-8 h-8 rounded-lg shadow-sm shadow-primary/30",
        icon: "w-4.5 h-4.5",
      };
    case "md":
      return {
        wrapper: "w-10 h-10 rounded-xl shadow-md shadow-primary/30",
        icon: "w-5 h-5",
      };
    case "xl":
      return {
        wrapper: "w-16 h-16 rounded-2xl shadow-xl shadow-primary/30",
        icon: "w-8 h-8",
      };
    case "lg":
    default:
      return {
        wrapper: "w-14 h-14 rounded-2xl shadow-lg shadow-primary/30",
        icon: "w-7 h-7",
      };
  }
});
</script>

<template>
  <div
    class="inline-flex items-center justify-center bg-primary"
    :class="sizeClasses.wrapper"
  >
    <svg
      :class="['text-white', sizeClasses.icon]"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 14H9V8h2v8Zm4 0h-2V8h2v8Z"
      />
    </svg>
  </div>
</template>
