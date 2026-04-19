<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: '0.5rem',
  className: '',
})
</script>

<template>
  <div
    class="animate-pulse bg-slate-200"
    :style="{
      width: width.includes('%') || width.includes('px') || width.includes('rem') ? width : undefined,
      height: height.includes('%') || height.includes('px') || height.includes('rem') ? height : undefined,
      borderRadius: rounded,
    }"
    :class="[
      !width.includes('%') && !width.includes('px') && !width.includes('rem') ? width : '',
      !height.includes('%') && !height.includes('px') && !height.includes('rem') ? height : '',
      className,
    ]"
  />
</template>
