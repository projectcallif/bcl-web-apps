<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/features/auth/store";
import { BrandLogo } from "@bcl/ui";
import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isLoginPage = computed(() => route.name === "login");
const isSidebarOpen = ref(false);

const navItems = [
  { label: "Dashboard", routeName: "dashboard", icon: LayoutDashboard },
  { label: "Users", routeName: "users", icon: Users },
  { label: "Administrators", routeName: "admins", icon: Shield },
  { label: "Settings", routeName: "settings", icon: SettingsIcon },
];

function isActive(routeName: string) {
  return route.name === routeName;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

function handleLogout() {
  authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <template v-if="isLoginPage">
    <RouterView />
  </template>

  <template v-else>
    <div class="flex h-screen bg-slate-50 overflow-hidden relative">
      <!-- Mobile Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden"
        @click="closeSidebar"
      ></div>

      <!-- Sidebar -->
      <aside
        :class="[
          'w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 transition-transform duration-300 absolute md:relative z-30 h-full',
          isSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0',
        ]"
      >
        <!-- Brand -->
        <div
          class="h-16 flex items-center justify-between px-6 border-b border-slate-800"
        >
          <div class="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span class="text-lg font-bold text-white tracking-tight"
              >BCL Admin</span
            >
          </div>
          <button
            class="md:hidden text-slate-400 hover:text-white"
            @click="closeSidebar"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-3 py-4 overflow-y-auto w-full">
          <ul class="flex flex-col gap-1.5 w-full">
            <li v-for="item in navItems" :key="item.routeName">
              <RouterLink
                :to="{ name: item.routeName }"
                @click="closeSidebar"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                :class="
                  isActive(item.routeName)
                    ? 'bg-primary-900/60 text-tertiary-500 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                "
              >
                <component :is="item.icon" class="w-5 h-5 shrink-0" />
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- User Footer block -->
        <div class="p-4 border-t border-slate-800">
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut class="w-5 h-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main content area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Header -->
        <header
          class="h-16 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 z-10 w-full"
        >
          <div class="flex items-center gap-3">
            <button
              class="md:hidden text-slate-500 hover:text-slate-800 focus:outline-none"
              @click="isSidebarOpen = true"
            >
              <Menu class="w-6 h-6" />
            </button>
            <h2
              class="text-sm font-semibold text-slate-800 capitalize hidden sm:block tracking-wide"
            >
              {{ String(route.name ?? "").replace(/-/g, " ") }}
            </h2>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-4">
            <button
              class="relative text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50"
            >
              <Bell class="w-5 h-5" />
              <span
                class="absolute top-1.25 right-1.25 w-2 h-2 bg-secondary-500 rounded-full border-2 border-white"
              ></span>
            </button>
            <div class="h-6 w-px bg-slate-200"></div>
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-primary-50"
              >
                SA
              </div>
              <span class="text-sm font-medium text-slate-700 hidden lg:block"
                >Super Admin</span
              >
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main
          class="flex-1 overflow-y-auto max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 w-full"
        >
          <RouterView />
        </main>
      </div>
    </div>
  </template>
</template>
