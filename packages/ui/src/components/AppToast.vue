<script setup lang="ts">
import { CheckCircle2, AlertCircle, XCircle, Info, X } from "lucide-vue-next";
import type { ToastType } from "@bcl/types";
import type { Component } from "vue";

const props = defineProps<{
  type: ToastType;
  message: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const icons: Record<ToastType, Component> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: "bg-emerald-500",
  error: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-primary-500",
};

const iconColors: Record<ToastType, string> = {
  success: "text-emerald-500",
  error: "text-rose-500",
  warning: "text-amber-500",
  info: "text-primary-500",
};
</script>

<template>
  <div
    class="pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] group transition-all"
  >
    <!-- Marker -->
    <div :class="['w-1 h-10 rounded-full shrink-0', colors[props.type]]"></div>

    <div class="flex-1 flex items-start gap-3">
      <component
        :is="icons[props.type]"
        :class="['w-5 h-5 shrink-0 mt-0.5', iconColors[props.type]]"
      />

      <div class="flex-1 min-w-0 py-0.5">
        <p class="text-sm font-medium text-slate-800 leading-snug">
          {{ props.message }}
        </p>
      </div>
    </div>

    <button
      @click="emit('close')"
      class="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>
