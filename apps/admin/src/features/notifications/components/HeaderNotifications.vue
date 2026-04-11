<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AppPopover } from "@bcl/ui";
import {
  Bell,
  ShieldAlert,
  CreditCard,
  UserCheck,
  CheckCircle2,
} from "lucide-vue-next";

// Mock Data
type NotificationType = "SECURITY" | "LOAN" | "KYC" | "SYSTEM";
interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const router = useRouter();

const notifications = ref<AppNotification[]>([
  {
    id: "notif_1",
    type: "LOAN",
    title: "Large Disbursal Flagged",
    message: "Disbursal for Loan BCL-2026-A10 exceeds N500k auto-limit.",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "notif_2",
    type: "KYC",
    title: "15 Pending Profiles",
    message: "New tier-1 user applications require manual BVN review.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "notif_3",
    type: "SECURITY",
    title: "New Login Location",
    message: "SuperAdmin logged in from new IP: 192.168.1.104.",
    time: "2 hours ago",
    read: true,
  },
]);

const unreadCount = computed(
  () => notifications.value.filter((n) => !n.read).length,
);

function markAllAsRead() {
  notifications.value.forEach((n) => (n.read = true));
}

function getIcon(type: NotificationType) {
  switch (type) {
    case "SECURITY":
      return ShieldAlert;
    case "LOAN":
      return CreditCard;
    case "KYC":
      return UserCheck;
    default:
      return Bell;
  }
}

function getIconCol(type: NotificationType) {
  switch (type) {
    case "SECURITY":
      return "text-rose-500 bg-rose-50";
    case "LOAN":
      return "text-indigo-500 bg-indigo-50";
    case "KYC":
      return "text-emerald-500 bg-emerald-50";
    default:
      return "text-slate-500 bg-slate-50";
  }
}
</script>

<template>
  <AppPopover
    placement="bottom-end"
    content-class="!w-80 flex flex-col bg-white rounded-xl shadow-lg border border-slate-100 max-h-[85vh] overflow-y-auto !p-0"
  >
    <template #trigger>
      <button
        class="relative text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer focus:outline-none"
      >
        <Bell class="w-5 h-5" />
        <span
          v-if="unreadCount > 0"
          class="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full border-2 border-white ring-2 ring-transparent"
        ></span>
      </button>
    </template>

    <template #content>
      <div class="flex flex-col h-full w-full">
        <!-- Header -->
        <div
          class="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"
        >
          <h3 class="font-bold text-slate-800 text-sm">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer focus:outline-none"
          >
            <CheckCircle2 class="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto max-h-96 flex flex-col">
          <div
            v-if="notifications.length === 0"
            class="p-6 text-center text-slate-400 text-sm"
          >
            You're all caught up!
          </div>

          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="p-4 pl-6 border-b border-slate-50 hover:bg-slate-50 flex gap-3 transition-colors last:border-none relative cursor-pointer"
            :class="{ 'bg-slate-50/50': !notif.read }"
            @click="notif.read = true"
          >
            <!-- Unread Dot Indicator -->
            <div
              v-if="!notif.read"
              class="absolute left-2.5 top-5 w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"
            ></div>

            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                getIconCol(notif.type),
              ]"
            >
              <component :is="getIcon(notif.type)" class="w-4 h-4" />
            </div>

            <div class="flex-1">
              <p class="text-sm font-bold text-slate-800 mb-0.5">
                {{ notif.title }}
              </p>
              <p class="text-xs text-slate-500 mb-1 leading-relaxed">
                {{ notif.message }}
              </p>
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >
                {{ notif.time }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-2 border-t border-slate-100 bg-slate-50">
          <button
            @click="router.push({ name: 'audit-logs' })"
            class="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 py-2 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer focus:outline-none"
          >
            View Audit Logs
          </button>
        </div>
      </div>
    </template>
  </AppPopover>
</template>
