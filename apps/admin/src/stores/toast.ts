import { ref } from "vue";
import { defineStore } from "pinia";
import type { Toast, ToastType } from "@bcl/types";

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  function show(type: ToastType, message: string, duration = 5000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, duration };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  }

  function success(message: string, duration?: number) {
    show("success", message, duration);
  }

  function error(message: string, duration?: number) {
    show("error", message, duration);
  }

  function warning(message: string, duration?: number) {
    show("warning", message, duration);
  }

  function info(message: string, duration?: number) {
    show("info", message, duration);
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts,
    success,
    error,
    warning,
    info,
    remove,
  };
});
