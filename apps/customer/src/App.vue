<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute()
</script>

<template>
  <template v-if="route.name !== 'login'">
    <header class="px-5 py-3 border-b border-slate-200 bg-white">
      <nav class="flex items-center gap-6">
        <RouterLink
          to="/"
          class="text-sm font-medium text-slate-500 transition-colors hover:text-primary"
          active-class="!text-primary font-semibold"
          exact-active-class="!text-primary font-semibold"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about"
          class="text-sm font-medium text-slate-500 transition-colors hover:text-primary"
          active-class="!text-primary font-semibold"
          exact-active-class="!text-primary font-semibold"
        >
          About
        </RouterLink>
      </nav>
    </header>

    <main class="p-8">
      <RouterView />
    </main>
  </template>

  <RouterView v-else />
</template>
