<script setup lang="ts">
import { AppPasswordInput, BaseButton } from "@bcl/ui";

defineProps<{
  modelValue: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    [key: string]: unknown;
  };
}>();
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
  >
    <h2 class="text-lg font-bold text-slate-800 mb-2 tracking-tight">
      Security & Authentication
    </h2>
    <p class="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
      Ensure your account is using a long, random password to stay secure.
    </p>

    <form class="flex flex-col gap-5 max-w-lg" @submit.prevent>
      <AppPasswordInput
        id="currentPassword"
        v-model="modelValue.currentPassword"
        label="Current Password"
        placeholder="Enter current password"
      />
      <AppPasswordInput
        id="newPassword"
        v-model="modelValue.newPassword"
        label="New Password"
        placeholder="Ensure it's at least 8 characters"
      />
      <AppPasswordInput
        id="confirmPassword"
        v-model="modelValue.confirmPassword"
        label="Confirm New Password"
        placeholder="Match your new password"
      />

      <div class="pt-6 flex justify-end mt-2">
        <BaseButton variant="primary">Update Password</BaseButton>
      </div>
    </form>
  </div>
</template>
