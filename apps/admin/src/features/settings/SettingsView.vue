<script setup lang="ts">
import { ref } from "vue";
import { AppTextInput, BaseButton, AppPasswordInput } from "@bcl/ui";
import {
  User,
  Bell,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  ChevronRight,
  Camera,
} from "lucide-vue-next";

const activeTab = ref("profile");

const profileForm = ref({
  firstName: "Super",
  lastName: "Admin",
  email: "admin@bcl.com",
  phone: "+1 234 567 8900",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const tabs = [
  { id: "profile", label: "Profile Information", icon: User },
  { id: "security", label: "Security & Auth", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];
</script>

<template>
  <!-- Profile header -->
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 mb-5 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6"
  >
    <div class="relative shrink-0">
      <div
        class="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-slate-900/25"
      >
        {{ profileForm.firstName[0] }}{{ profileForm.lastName[0] }}
      </div>
      <button
        class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
        aria-label="Change photo"
      >
        <Camera class="w-4 h-4 text-slate-500" />
      </button>
    </div>
    <div class="flex-1 min-w-0 text-center sm:text-left">
      <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
        {{ profileForm.firstName }} {{ profileForm.lastName }}
      </h1>
      <div
        class="flex flex-col sm:flex-row items-center sm:items-start gap-x-6 gap-y-2 mt-2.5"
      >
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <Mail class="w-4 h-4 text-slate-400 shrink-0" />
          <span>{{ profileForm.email }}</span>
          <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
        </div>
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <Phone class="w-4 h-4 text-slate-400 shrink-0" />
          <span>{{ profileForm.phone }}</span>
          <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
        </div>
      </div>
      <div class="mt-4 flex items-center justify-center sm:justify-start gap-2">
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700"
        >
          ACTIVE
        </span>
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
        >
          SUPER_ADMIN
        </span>
      </div>
    </div>
  </div>

  <!-- Two-column layout -->
  <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
    <!-- Left menu -->
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden md:sticky top-6"
    >
      <div class="flex flex-col">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="w-full flex items-center gap-3 px-5 py-4 text-sm text-left transition-colors font-medium border-l-[3px] border-b border-slate-50 last:border-b-0"
          :class="
            activeTab === tab.id
              ? 'bg-primary-50/50 text-primary-700 border-l-primary-500'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border-l-transparent'
          "
          @click="activeTab = tab.id"
        >
          <component
            :is="tab.icon"
            class="w-4.5 h-4.5 shrink-0 transition-colors"
            :class="
              activeTab === tab.id ? 'text-primary-600' : 'text-slate-400'
            "
          />
          {{ tab.label }}
          <ChevronRight
            class="w-4 h-4 ml-auto transition-all"
            :class="
              activeTab === tab.id
                ? 'text-primary-400 translate-x-1'
                : 'text-slate-300 opacity-0'
            "
          />
        </button>
      </div>
    </div>

    <!-- Right content panel -->
    <div class="min-w-0">
      <!-- Profile Tab -->
      <div
        v-if="activeTab === 'profile'"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
      >
        <h2 class="text-lg font-bold text-slate-800 mb-6 tracking-tight">
          Profile Information
        </h2>

        <form class="flex flex-col gap-6 max-w-2xl" @submit.prevent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AppTextInput
              id="firstName"
              v-model="profileForm.firstName"
              label="First Name"
            />
            <AppTextInput
              id="lastName"
              v-model="profileForm.lastName"
              label="Last Name"
            />
          </div>

          <AppTextInput
            id="email"
            v-model="profileForm.email"
            label="Email Address"
            type="email"
          />

          <AppTextInput
            id="phone"
            v-model="profileForm.phone"
            label="Phone Number"
            type="tel"
          />

          <div class="pt-6 flex justify-end mt-2 border-t border-slate-100">
            <BaseButton variant="primary">Save Changes</BaseButton>
          </div>
        </form>
      </div>

      <!-- Security Tab -->
      <div
        v-else-if="activeTab === 'security'"
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
            v-model="profileForm.currentPassword"
            label="Current Password"
            placeholder="Enter current password"
          />
          <AppPasswordInput
            id="newPassword"
            v-model="profileForm.newPassword"
            label="New Password"
            placeholder="Ensure it's at least 8 characters"
          />
          <AppPasswordInput
            id="confirmPassword"
            v-model="profileForm.confirmPassword"
            label="Confirm New Password"
            placeholder="Match your new password"
          />

          <div class="pt-6 flex justify-end mt-2">
            <BaseButton variant="primary">Update Password</BaseButton>
          </div>
        </form>
      </div>

      <!-- Notifications Tab -->
      <div
        v-else-if="activeTab === 'notifications'"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
      >
        <h2 class="text-lg font-bold text-slate-800 mb-2 tracking-tight">
          Notification Preferences
        </h2>
        <p class="text-sm text-slate-500 mb-6">
          Manage how you receive admin alerts and platform updates.
        </p>

        <div
          class="flex items-center justify-center h-48 bg-slate-50 rounded-xl border border-slate-100 border-dashed"
        >
          <div class="text-center">
            <Bell class="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p class="text-slate-500 text-sm">
              Notification settings coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
