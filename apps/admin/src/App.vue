<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen">

    <!-- Sidebar -->
    <aside class="w-[220px] shrink-0 flex flex-col bg-slate-900 text-slate-200">
      <!-- Brand -->
      <div class="px-6 py-5 border-b border-slate-700">
        <span class="text-lg font-bold text-white tracking-tight">BCL Admin</span>
      </div>

      <!-- Nav -->
      <nav class="flex flex-col gap-1 px-3 py-4">
        <RouterLink
          to="/"
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          exact-active-class="!bg-primary-900 !text-tertiary font-semibold"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/users"
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          active-class="!bg-primary-900 !text-tertiary font-semibold"
        >
          Users
        </RouterLink>
        <RouterLink
          to="/settings"
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          active-class="!bg-primary-900 !text-tertiary font-semibold"
        >
          Settings
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-8 bg-slate-50">
      <RouterView />
    </main>

  </div>
</template>
