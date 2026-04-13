<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { BrandLogo, AppDialog, BaseButton, AppPopover } from '@bcl/ui'
import HeaderNotifications from '@/features/notifications/components/HeaderNotifications.vue'
import {
  LayoutDashboard,
  CreditCard,
  History,
  ArrowLeftRight,
  User,
  LifeBuoy,
  Settings,
  LogOut,
  Bell,
  MessageCircle,
  Menu,
  X,
} from 'lucide-vue-next'
import { useAuthStore } from '@/features/auth/store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)
const isSignOutOpen = ref(false)

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, routeName: 'dashboard' },
  { label: 'My Loans', icon: CreditCard, routeName: 'loans' },
  { label: 'Transactions', icon: ArrowLeftRight, routeName: 'transactions' },
  { label: 'Profile', icon: User, routeName: 'profile' },
  { label: 'Support', icon: LifeBuoy, routeName: 'support' },
  { label: 'Settings', icon: Settings, routeName: 'settings' },
] as const

function isActive(routeName: string): boolean {
  return route.name === routeName
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function confirmSignOut() {
  isSignOutOpen.value = true
}

async function executeSignOut(): Promise<void> {
  authStore.logout()
  await router.push({ name: 'login' })
  isSignOutOpen.value = false
}

const userFirstName = computed(() => authStore.user?.profile.firstName ?? 'User')
const userInitials = computed(() => {
  const first = authStore.user?.profile.firstName?.[0] ?? 'U'
  const last = authStore.user?.profile.lastName?.[0] ?? ''
  return (first + last).toUpperCase()
})
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden relative">
    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden transition-opacity"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 absolute md:relative z-30 h-full',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-between px-5 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <BrandLogo size="sm" />
          <span class="text-base font-bold text-slate-800 tracking-tight">BCL</span>
        </div>
        <button class="md:hidden text-slate-400 hover:text-slate-600" @click="closeSidebar">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 overflow-y-auto">
        <ul class="flex flex-col gap-0.5">
          <li v-for="item in navItems" :key="item.routeName">
            <RouterLink
              :to="{ name: item.routeName }"
              @click="closeSidebar"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              :class="
                isActive(item.routeName)
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              "
            >
              <component :is="item.icon" class="w-4.5 h-4.5 shrink-0" />
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Logout -->
      <div class="px-3 py-3 border-t border-slate-100">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          @click="confirmSignOut"
        >
          <LogOut class="w-4.5 h-4.5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header
        class="h-16 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6"
      >
        <div class="flex items-center gap-3">
          <button
            class="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
            @click="isSidebarOpen = true"
          >
            <Menu class="w-5 h-5" />
          </button>
          <!-- Page title derived from current route -->
          <h2 class="text-sm font-semibold text-slate-700 capitalize">
            {{ String(route.name ?? '').replace(/-/g, ' ') }}
          </h2>
        </div>

        <div class="flex items-center gap-1.5 md:gap-3">
          <!-- Support -->
          <button
            aria-label="Contact support"
            class="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <MessageCircle class="w-5 h-5" />
          </button>

          <!-- Notifications -->
          <HeaderNotifications />

          <!-- User Section with Popover -->
          <div class="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <AppPopover placement="bottom-end">
            <template #trigger>
              <button
                class="flex items-center gap-2.5 pl-1 rounded-xl hover:bg-slate-50 transition-colors pr-2 py-1 cursor-pointer"
              >
                <div
                  class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold ring-2 ring-primary-50"
                >
                  {{ userInitials }}
                </div>
                <span class="text-xs md:text-sm font-semibold text-slate-700 hidden sm:block">{{
                  userFirstName
                }}</span>
              </button>
            </template>
            <template #content>
              <div class="min-w-48 p-1 flex flex-col gap-0.5">
                <button
                  @click="router.push({ name: 'profile' })"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                >
                  <User class="w-4 h-4" /> My Profile
                </button>
                <button
                  @click="router.push({ name: 'settings' })"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                >
                  <Settings class="w-4 h-4" /> Account Settings
                </button>
                <div class="h-px bg-slate-50 my-1"></div>
                <button
                  @click="confirmSignOut"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut class="w-4 h-4" /> Logout Securely
                </button>
              </div>
            </template>
          </AppPopover>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Sign Out Confirmation -->
  <AppDialog v-model="isSignOutOpen" title="Secure Logout" max-width="md">
    <div class="flex flex-col gap-4 mt-2">
      <p class="text-sm text-slate-600 leading-relaxed">
        Are you sure you want to end your current session? You will need to log in again to access
        your dashboard.
      </p>
      <div class="flex justify-end gap-3 mt-4">
        <BaseButton variant="ghost" @click="isSignOutOpen = false">Stay Logged In</BaseButton>
        <BaseButton
          variant="primary"
          class="bg-red-600! hover:bg-red-700! border-none"
          @click="executeSignOut"
        >
          Log Me Out
        </BaseButton>
      </div>
    </div>
  </AppDialog>
</template>
