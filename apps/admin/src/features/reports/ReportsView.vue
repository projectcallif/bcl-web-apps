<script setup lang="ts">
import { ref } from "vue";
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Banknote,
  AlertTriangle,
} from "lucide-vue-next";
import DashboardStatCard from "@/features/dashboard/components/DashboardStatCard.vue";

// Mock data spanning various analytics categories
const stats = ref({
  financial: {
    totalDisbursed: 155000000,
    totalCollected: 94000000,
    totalOutstanding: 61000000,
    growth: 12.5,
  },
  loans: {
    active: 1240,
    overdue: 135,
    defaulted: 42,
    total: 1417,
  },
  kyc: {
    pending: 342,
    approved: 12050,
    rejected: 89,
    growth: 4.2,
  },
});

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    notation: "compact", // e.g. 155M
  }).format(n);
}

function calculatePercentage(part: number, total: number) {
  return Math.round((part / total) * 100);
}
</script>

<template>
  <div class="flex flex-col gap-8 pb-10">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Reports & Analytics
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Platform-level financial metrics and pipeline health statistics.
        </p>
      </div>
      <div
        class="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-lg px-4 py-2 text-sm font-medium text-slate-600"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Live Data Synced
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Stat Card 1 -->
      <DashboardStatCard
        title="Total Network Disbursed"
        :value="formatCurrency(stats.financial.totalDisbursed)"
        variant="primary"
        :badgeText="'+' + stats.financial.growth + '%'"
        badgeVariant="emerald"
      >
        <template #icon>
          <Wallet />
        </template>
      </DashboardStatCard>

      <!-- Stat Card 2 -->
      <DashboardStatCard
        title="Total Principal Collected"
        :value="formatCurrency(stats.financial.totalCollected)"
        variant="emerald"
      >
        <template #icon>
          <TrendingUp />
        </template>
      </DashboardStatCard>

      <!-- Stat Card 3 -->
      <DashboardStatCard
        title="Total Outstanding Debt"
        :value="formatCurrency(stats.financial.totalOutstanding)"
        variant="rose"
      >
        <template #icon>
          <Banknote />
        </template>
      </DashboardStatCard>
    </div>

    <!-- Middle Grid: Composition Tracking -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Portfolio Health -->
      <div
        class="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm"
      >
        <h3
          class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"
        >
          <AlertTriangle class="w-5 h-5 text-amber-500" />
          Loan Portfolio Health
        </h3>

        <!-- Custom CSS Progression Bar -->
        <div
          class="w-full h-8 flex rounded-full overflow-hidden shadow-inner bg-slate-100"
        >
          <div
            class="h-full bg-emerald-500 transition-all duration-1000"
            :style="{
              width:
                calculatePercentage(stats.loans.active, stats.loans.total) +
                '%',
            }"
            title="Active Loans"
          ></div>
          <div
            class="h-full bg-amber-400 transition-all duration-1000"
            :style="{
              width:
                calculatePercentage(stats.loans.overdue, stats.loans.total) +
                '%',
            }"
            title="Overdue Loans"
          ></div>
          <div
            class="h-full bg-rose-500 transition-all duration-1000"
            :style="{
              width:
                calculatePercentage(stats.loans.defaulted, stats.loans.total) +
                '%',
            }"
            title="Defaulted Loans"
          ></div>
        </div>

        <!-- Legends -->
        <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-50">
          <div>
            <div
              class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
            >
              <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Active
            </div>
            <p class="text-xl font-bold text-slate-800">
              {{ calculatePercentage(stats.loans.active, stats.loans.total) }}%
            </p>
            <p class="text-xs text-slate-400">{{ stats.loans.active }} files</p>
          </div>
          <div>
            <div
              class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
            >
              <span class="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Overdue
            </div>
            <p class="text-xl font-bold text-slate-800">
              {{ calculatePercentage(stats.loans.overdue, stats.loans.total) }}%
            </p>
            <p class="text-xs text-slate-400">
              {{ stats.loans.overdue }} files
            </p>
          </div>
          <div>
            <div
              class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
            >
              <span class="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Default
            </div>
            <p class="text-xl font-bold text-slate-800">
              {{
                calculatePercentage(stats.loans.defaulted, stats.loans.total)
              }}%
            </p>
            <p class="text-xs text-slate-400">
              {{ stats.loans.defaulted }} files
            </p>
          </div>
        </div>
      </div>

      <!-- KYC Pipeline Trends -->
      <div
        class="bg-slate-800 md:p-8 p-6 rounded-2xl shadow-lg relative overflow-hidden"
      >
        <div class="absolute opacity-5 -top-12 -right-12">
          <ShieldCheck class="w-64 h-64 text-white" />
        </div>

        <div class="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3
              class="text-lg font-bold text-white mb-2 flex items-center gap-2"
            >
              <Users class="w-5 h-5 text-primary-400" />
              KYC Processing Volume
            </h3>
            <p class="text-sm text-slate-400 max-w-sm">
              Tracking onboarding throughput and security clearance rates over
              the current quarter.
            </p>
          </div>

          <div class="grid grid-cols-2 mt-8 gap-x-8 gap-y-6">
            <div class="border-l-2 border-primary-500 pl-4">
              <p class="text-slate-400 text-sm font-medium mb-1">
                Verified Users
              </p>
              <div class="flex items-end gap-3">
                <p class="text-3xl font-bold text-white">
                  {{ stats.kyc.approved.toLocaleString() }}
                </p>
                <span
                  class="flex items-center text-xs font-bold text-emerald-400 pb-1.5 gap-0.5"
                >
                  <ArrowUpRight class="w-3 h-3" /> {{ stats.kyc.growth }}%
                </span>
              </div>
            </div>

            <div class="border-l-2 border-amber-500 pl-4">
              <p class="text-slate-400 text-sm font-medium mb-1">
                Action Required
              </p>
              <p class="text-3xl font-bold text-white">
                {{ stats.kyc.pending }}
              </p>
            </div>

            <div class="border-l-2 border-rose-500 pl-4 col-span-2">
              <p class="text-slate-400 text-sm font-medium mb-1">
                Suspended Profiles
              </p>
              <p class="text-3xl font-bold text-white">
                {{ stats.kyc.rejected }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
