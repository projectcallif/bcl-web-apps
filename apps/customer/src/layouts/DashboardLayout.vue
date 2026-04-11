<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { BrandLogo } from '@bcl/ui'
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
} from 'lucide-vue-next'
import { useAuthStore } from '@/features/auth/store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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

async function handleLogout(): Promise<void> {
  authStore.logout()
  await router.push({ name: 'login' })
}

const userFirstName = computed(() => authStore.user?.profile.firstName ?? 'User')
const userInitials = computed(() => {
  const first = authStore.user?.profile.firstName?.[0] ?? 'U'
  const last = authStore.user?.profile.lastName?.[0] ?? ''
  return (first + last).toUpperCase()
})
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col">
      <!-- Logo -->
      <div class="h-16 flex items-center px-5 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <BrandLogo size="sm" />
          <span class="text-base font-bold text-slate-800 tracking-tight">BCL</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 overflow-y-auto">
        <ul class="flex flex-col gap-0.5">
          <li v-for="item in navItems" :key="item.routeName">
            <RouterLink
              :to="{ name: item.routeName }"
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
          @click="handleLogout"
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
        class="h-16 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-6"
      >
        <!-- Page title derived from current route -->
        <h2 class="text-sm font-semibold text-slate-700 capitalize">
          {{ String(route.name ?? '').replace(/-/g, ' ') }}
        </h2>

        <div class="flex items-center gap-1">
          <!-- Support -->
          <button
            aria-label="Contact support"
            class="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <MessageCircle class="w-5 h-5" />
          </button>

          <!-- Notifications -->
          <button
            aria-label="Notifications"
            class="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <Bell class="w-5 h-5" />
            <span
              class="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full ring-2 ring-white"
            />
          </button>

          <!-- User -->
          <div class="flex items-center gap-2.5 ml-2 pl-3 border-l border-slate-200">
            <div
              class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold"
            >
              {{ userInitials }}
            </div>
            <span class="text-sm font-medium text-slate-700">{{ userFirstName }}</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
