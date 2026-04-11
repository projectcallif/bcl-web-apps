<script setup lang="ts">
import { AppTextInput, BaseButton } from "@bcl/ui";

defineProps<{
  modelValue: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    [key: string]: unknown;
  };
}>();
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
  >
    <h2 class="text-lg font-bold text-slate-800 mb-6 tracking-tight">
      Profile Information
    </h2>

    <form class="flex flex-col gap-6 max-w-2xl" @submit.prevent>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AppTextInput
          id="firstName"
          v-model="modelValue.firstName"
          label="First Name"
        />
        <AppTextInput
          id="lastName"
          v-model="modelValue.lastName"
          label="Last Name"
        />
      </div>

      <AppTextInput
        id="email"
        v-model="modelValue.email"
        label="Email Address"
        type="email"
      />

      <AppTextInput
        id="phone"
        v-model="modelValue.phone"
        label="Phone Number"
        type="tel"
      />

      <div class="pt-6 flex justify-end mt-2 border-t border-slate-100">
        <BaseButton variant="primary">Save Changes</BaseButton>
      </div>
    </form>
  </div>
</template>
