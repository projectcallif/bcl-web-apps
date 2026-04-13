<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AppPopover } from '@bcl/ui'
import { Bell, CreditCard, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-vue-next'

type NotificationType = 'REPAYMENT' | 'LOAN_UPDATE' | 'SECURITY' | 'SUPPORT'
interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

const router = useRouter()

const notifications = ref<AppNotification[]>([
  {
    id: 'notif_1',
    type: 'REPAYMENT',
    title: 'Repayment Due Soon',
    message: 'Your upcoming payment of N46,667 for Loan BCL-2026-0042 is due in 2 days.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'notif_2',
    type: 'LOAN_UPDATE',
    title: 'Application Received',
    message: 'We have successfully received your new loan application. We are reviewing it!',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'notif_3',
    type: 'SECURITY',
    title: 'New Login Detected',
    message: 'A successful login was made from a new Chrome browser on Windows.',
    time: '1 day ago',
    read: true,
  },
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function markAllAsRead() {
  notifications.value.forEach((n) => (n.read = true))
}

function getIcon(type: NotificationType) {
  switch (type) {
    case 'REPAYMENT':
      return CreditCard
    case 'LOAN_UPDATE':
      return ShieldCheck
    case 'SUPPORT':
      return HelpCircle
    default:
      return Bell
  }
}

function getIconCol(type: NotificationType) {
  switch (type) {
    case 'REPAYMENT':
      return 'text-rose-500 bg-rose-50'
    case 'LOAN_UPDATE':
      return 'text-indigo-500 bg-indigo-50'
    case 'SECURITY':
      return 'text-emerald-500 bg-emerald-50'
    default:
      return 'text-slate-500 bg-slate-50'
  }
}

function handleNotificationClick(notif: AppNotification) {
  notif.read = true
  if (notif.type === 'REPAYMENT') {
    router.push({ name: 'loans' })
  }
}
</script>

<template>
  <AppPopover
    placement="bottom-end"
    content-class="!w-70 sm:!w-80 md:!w-96 flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto !p-0"
  >
    <template #trigger>
      <button
        aria-label="Notifications"
        class="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <Bell class="w-5 h-5" />
        <span
          v-if="unreadCount > 0"
          class="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full ring-2 ring-white"
        />
      </button>
    </template>

    <template #content>
      <div class="flex flex-col h-full w-full">
        <!-- Header -->
        <div
          class="p-4 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10"
        >
          <h3 class="font-bold text-slate-800 text-sm">Activity Notifications</h3>
          <button
            v-if="unreadCount > 0"
            class="text-xs font-semibold text-primary hover:text-primary-800 flex items-center gap-1 cursor-pointer"
            @click="markAllAsRead"
          >
            <CheckCircle2 class="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto max-h-96 flex flex-col bg-white">
          <div v-if="notifications.length === 0" class="p-8 text-center text-slate-400 text-sm">
            Everything up to date!
          </div>

          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="p-4 border-b border-slate-50 hover:bg-slate-50 flex gap-3 transition-colors last:border-none relative cursor-pointer"
            :class="{ 'bg-slate-50/30': !notif.read }"
            @click="handleNotificationClick(notif)"
          >
            <!-- Unread Dot -->
            <div
              v-if="!notif.read"
              class="absolute left-2.5 top-5 w-1.5 h-1.5 bg-primary rounded-full"
            ></div>

            <div
              :class="[
                'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                getIconCol(notif.type),
              ]"
            >
              <component :is="getIcon(notif.type)" class="w-4.5 h-4.5" />
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-slate-800 mb-0.5 truncate">{{ notif.title }}</p>
              <p class="text-[11px] text-slate-500 mb-1 leading-relaxed">{{ notif.message }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {{ notif.time }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-slate-50 bg-slate-50/50">
          <button
            class="w-full text-center text-xs font-bold text-slate-500 hover:text-primary py-2 rounded-lg transition-colors cursor-pointer"
            @click="router.push({ name: 'dashboard' })"
          >
            View Entire Activity Log
          </button>
        </div>
      </div>
    </template>
  </AppPopover>
</template>
