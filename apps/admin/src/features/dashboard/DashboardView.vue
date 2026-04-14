<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDashboardStore } from "./store";
import { Users, UserCheck, UserX, Activity } from "lucide-vue-next";
import DashboardStatCard from "./components/DashboardStatCard.vue";
import { AppDatePicker } from "@bcl/ui";

const dashboard = useDashboardStore();

const last7Days = [
  new Date(new Date().setDate(new Date().getDate() - 7)),
  new Date(),
];
const dateFilter = ref<Date | Date[] | null>(last7Days);

onMounted(() => {
  // Simulate loading more realistic stats
  dashboard.setStats(1420, 985);
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Dashboard Overview
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Check your key metrics and recent activities.
        </p>
      </div>
      <div class="flex items-center gap-2 w-full max-w-84">
        <!-- Date filter -->
        <AppDatePicker
          v-model="dateFilter"
          placeholder="Filter by date..."
          range
        />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Total Customers -->
      <DashboardStatCard
        title="Total Customers"
        :value="dashboard.totalCustomers.toLocaleString()"
        variant="primary"
        badgeText="+12.5%"
        badgeVariant="emerald"
      >
        <template #icon>
          <Users />
        </template>
      </DashboardStatCard>

      <!-- Active Customers -->
      <DashboardStatCard
        title="Active Customers"
        :value="dashboard.activeCustomers.toLocaleString()"
        variant="emerald"
      >
        <template #icon>
          <UserCheck />
        </template>
      </DashboardStatCard>

      <!-- Inactive Customers -->
      <DashboardStatCard
        title="Inactive Customers"
        :value="dashboard.inactiveCustomers.toLocaleString()"
        variant="rose"
      >
        <template #icon>
          <UserX />
        </template>
      </DashboardStatCard>

      <!-- System Activity -->
      <DashboardStatCard
        title="System Load"
        value="24%"
        variant="secondary"
        badgeText="Live"
      >
        <template #icon>
          <Activity />
        </template>
      </DashboardStatCard>
    </div>

    <!-- Recent Activity Mock Section -->
    <div
      class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mt-2"
    >
      <h3 class="text-lg font-bold text-slate-800 mb-4 tracking-tight">
        Recent Platform Activity
      </h3>
      <div class="space-y-4">
        <div
          class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
        >
          <div
            class="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm"
          >
            JS
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">
              John Smith created a new account
            </p>
            <p class="text-xs text-slate-500 mt-0.5">2 minutes ago</p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
        >
          <div
            class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm"
          >
            AW
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">
              Alice Wong successfully verified ID
            </p>
            <p class="text-xs text-slate-500 mt-0.5">1 hour ago</p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
        >
          <div
            class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm"
          >
            SD
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">
              System detected failed login attempt
            </p>
            <p class="text-xs text-slate-500 mt-0.5">3 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
