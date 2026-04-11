<script setup lang="ts">
import AppDialog from "./AppDialog.vue";
import BaseButton from "./BaseButton.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "primary" | "danger";
    loading?: boolean;
  }>(),
  {
    confirmVariant: "primary",
    confirmText: "Confirm",
    cancelText: "Cancel",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function onConfirm() {
  emit("confirm");
}

function onCancel() {
  emit("update:modelValue", false);
  emit("cancel");
}
</script>

<template>
  <AppDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="title"
    max-width="sm"
  >
    <p class="text-sm text-slate-600">{{ message }}</p>

    <template #footer>
      <BaseButton
        variant="ghost"
        class="bg-white border border-slate-200"
        @click="onCancel"
        :disabled="loading"
      >
        {{ cancelText }}
      </BaseButton>
      <BaseButton
        :variant="confirmVariant"
        @click="onConfirm"
        :loading="loading"
      >
        {{ confirmText }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
