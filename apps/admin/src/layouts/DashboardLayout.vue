<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/features/auth/store";
import { BrandLogo, AppDialog, BaseButton, AppPopover } from "@bcl/ui";
import HeaderNotifications from "@/features/notifications/components/HeaderNotifications.vue";
import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Shield,
  Banknote,
  ShieldCheck,
  ClipboardList,
  PieChart,
  History,
  ArrowRightLeft,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isSidebarOpen = ref(false);
const isSignOutOpen = ref(false);

const navItems = [
  { label: "Dashboard", routeName: "dashboard", icon: LayoutDashboard },
  { label: "Loan Applications", routeName: "loan-applications", icon: ClipboardList },
  { label: "Loan Operations", routeName: "loan-operations", icon: Banknote },
  { label: "Transactions", routeName: "transactions", icon: ArrowRightLeft },
  // { label: "Collections", routeName: "collections", icon: PhoneCall },
  { label: "KYC Operations", routeName: "kyc", icon: ShieldCheck },
  { label: "Customers", routeName: "customers", icon: Users },
  { label: "Administrators", routeName: "admins", icon: Shield },
  { label: "Reports & Analytics", routeName: "reports", icon: PieChart },
  { label: "Audit Logs", routeName: "audit-logs", icon: History },
  { label: "Settings", routeName: "settings", icon: SettingsIcon },
];

function isActive(routeName: string) {
  return route.name === routeName || String(route.path).includes(routeName);
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

function confirmSignOut() {
  isSignOutOpen.value = true;
}

function executeSignOut() {
  authStore.logout();
  router.push({ name: "login" });
  isSignOutOpen.value = false;
}
</script>

<template>
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
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
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
          @click="confirmSignOut"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors cursor-pointer"
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
          <HeaderNotifications />
          <div class="h-6 w-px bg-slate-200"></div>
          <AppPopover>
            <template #trigger>
              <button
                class="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
              >
                <div
                  class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-primary-50"
                >
                  SA
                </div>
                <span class="text-sm font-medium text-slate-700 hidden lg:block"
                  >Super Admin</span
                >
              </button>
            </template>
            <template #content>
              <div class="min-w-50 flex flex-col gap-1">
                <div class="px-3 py-2 border-b border-slate-100 mb-1">
                  <p class="text-sm font-bold text-slate-800">Super Admin</p>
                  <p class="text-xs text-slate-500">superadmin@bcl.com</p>
                </div>
                <button
                  @click="router.push({ name: 'settings' })"
                  class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <SettingsIcon class="w-4 h-4" /> Settings
                </button>
                <button
                  @click="confirmSignOut"
                  class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut class="w-4 h-4" /> Sign Out
                </button>
              </div>
            </template>
          </AppPopover>
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

  <AppDialog v-model="isSignOutOpen" title="Sign Out">
    <div class="flex flex-col gap-4 mt-2 text-sm text-slate-600">
      <p>Are you sure you want to sign out of your administrative session?</p>
      <div class="flex justify-end gap-3 mt-4">
        <BaseButton variant="ghost" @click="isSignOutOpen = false"
          >Cancel</BaseButton
        >
        <BaseButton
          variant="primary"
          class="bg-red-600 hover:bg-red-700 border-none text-white"
          @click="executeSignOut"
        >
          Confirm Sign Out
        </BaseButton>
      </div>
    </div>
  </AppDialog>
</template>
