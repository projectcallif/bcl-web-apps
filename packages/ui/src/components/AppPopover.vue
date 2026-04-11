<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  contentClass?: string | string[] | Record<string, any>;
}>();

const isOpen = ref(false);
const popoverRef = ref<HTMLElement | null>(null);

function toggle() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

// Global click outside handler
onMounted(() => {
  const handleClick = (e: MouseEvent) => {
    if (
      isOpen.value &&
      popoverRef.value &&
      !popoverRef.value.contains(e.target as Node)
    ) {
      close();
    }
  };
  // Use capturing phase so we can catch the click before elements unmount
  document.addEventListener("click", handleClick, true);
  onUnmounted(() => document.removeEventListener("click", handleClick, true));
});
</script>

<template>
  <div class="relative inline-block text-left" ref="popoverRef">
    <div @click="toggle" class="cursor-pointer inline-flex items-center">
      <slot name="trigger" :is-open="isOpen"></slot>
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute right-0 mt-2 min-w-[200px] z-50 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col focus:outline-none origin-top-right p-1.5 rounded-xl',
          props.contentClass
        ]"
        @click.stop
      >
        <slot name="content" :close="close"></slot>
      </div>
    </Transition>
  </div>
</template>
