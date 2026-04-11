<script setup lang="ts">
import { X } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl";
  }>(),
  {
    maxWidth: "md",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function close() {
  emit("update:modelValue", false);
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          @click="close"
        ></div>

        <!-- Panel -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="modelValue"
            :class="[
              'relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all w-full flex flex-col max-h-[90vh]',
              {
                'max-w-sm': maxWidth === 'sm',
                'max-w-md': maxWidth === 'md',
                'max-w-lg': maxWidth === 'lg',
                'max-w-xl': maxWidth === 'xl',
              },
            ]"
          >
            <div
              class="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0"
            >
              <h3 v-if="title" class="text-lg font-bold text-slate-800">
                {{ title }}
              </h3>
              <slot v-else name="header"></slot>

              <button
                @click="close"
                class="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-1.5 rounded-lg transition-colors ml-4"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="px-6 py-5 overflow-y-auto">
              <slot></slot>
            </div>

            <div
              v-if="$slots.footer"
              class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
