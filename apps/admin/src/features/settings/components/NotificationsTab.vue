<script setup lang="ts">
import { Bell } from "lucide-vue-next";
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8">
    <h2 class="text-lg font-bold text-slate-800 mb-2 tracking-tight">
      Notification Preferences
    </h2>
    <p class="text-sm text-slate-500 mb-6">
      Manage how you receive admin alerts and platform updates.
    </p>

    <div class="flex items-center justify-center h-48 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
      <div class="text-center">
        <Bell class="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p class="text-slate-500 text-sm">
          Notification settings coming soon.
        </p>
      </div>
    </div>
  </div>
</template>
