<script setup lang="ts">
import { ref } from "vue";
import {
  TrendingUp,
  Wallet,
  Banknote,
  AlertTriangle,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  CreditCard,
} from "lucide-vue-next";
import { AppTextInput, BaseButton, AppSelect, AppDatePicker } from "@bcl/ui";
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
  collections: {
    dueToday: 12400000,
    overdue: 4500000,
    failedDebits: 890000,
    successRate: 92.4,
  },
});

const filterDate = ref<Date[] | null>(null);
const searchQuery = ref("");
const filterStatus = ref("");

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

function handleExport(format: "CSV" | "PDF" | "EXCEL") {
  console.log(`Exporting report in ${format} format...`);
  // Trigger download logic
}
</script>

<template>
  <div class="flex flex-col gap-8 pb-10">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="w-full">
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Reports & Analytics
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Platform-level financial metrics and portfolio health statistics.
        </p>
      </div>

      <div class="flex items-center gap-3 w-full md:justify-end">
        <AppDatePicker
          v-model="filterDate"
          range
          placeholder="Select range"
          class="w-full max-w-84"
        />

        <div class="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

        <div class="flex items-center gap-2">
          <BaseButton
            variant="ghost"
            class="bg-white border border-slate-200 gap-1"
            @click="handleExport('CSV')"
          >
            <Download class="w-3.5 h-3.5" /> <span>Export</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Quick Search & Filter Panel -->
    <div
      class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center"
    >
      <div class="relative flex-1 w-full">
        <Search
          class="absolute left-6 z-10 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        />
        <AppTextInput
          id="reportSearch"
          v-model="searchQuery"
          placeholder="Search by customer, amount, or loan status..."
          class="pl-10 w-full -ml-4"
        />
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <AppSelect
          id="statusFilter"
          class="w-full md:w-48"
          v-model="filterStatus"
          :options="[
            { label: 'All Statuses', value: '' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Overdue', value: 'OVERDUE' },
            { label: 'Completed', value: 'COMPLETED' },
          ]"
        />
        <BaseButton variant="ghost" class="bg-slate-50 border border-slate-200">
          <Filter class="w-4 h-4" />
        </BaseButton>
      </div>
    </div>

    <!-- Financial Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <DashboardStatCard
        title="Total Principal Collected"
        :value="formatCurrency(stats.financial.totalCollected)"
        variant="emerald"
      >
        <template #icon>
          <TrendingUp />
        </template>
      </DashboardStatCard>

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

    <!-- Collections Overview (US-069) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1"
      >
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Due Today
        </p>
        <p class="text-2xl font-bold text-slate-800">
          {{ formatCurrency(stats.collections.dueToday) }}
        </p>
        <div
          class="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full"
        >
          <CheckCircle2 class="w-3 h-3" /> Projected
        </div>
      </div>
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1"
      >
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Overdue
        </p>
        <p class="text-2xl font-bold text-rose-600">
          {{ formatCurrency(stats.collections.overdue) }}
        </p>
        <div
          class="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 w-fit px-2 py-0.5 rounded-full"
        >
          <AlertTriangle class="w-3 h-3" /> Urgent Follow-up
        </div>
      </div>
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1"
      >
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Failed Debits
        </p>
        <p class="text-2xl font-bold text-amber-600">
          {{ formatCurrency(stats.collections.failedDebits) }}
        </p>
        <div
          class="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded-full"
        >
          <XCircle class="w-3 h-3" /> System Retrying
        </div>
      </div>
      <div
        class="bg-slate-900 p-5 rounded-2xl shadow-lg flex flex-col gap-1 text-white"
      >
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Success Rate
        </p>
        <p class="text-3xl font-black text-emerald-400">
          {{ stats.collections.successRate }}%
        </p>
        <div
          class="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-400/80 bg-emerald-900/50 w-fit px-2 py-0.5 rounded-full"
        >
          <TrendingUp class="w-3 h-3" /> Above Target
        </div>
      </div>
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

      <!-- Repayment & Recovery Trends (US-069) -->
      <div
        class="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
      >
        <h3
          class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"
        >
          <CreditCard class="w-5 h-5 text-indigo-500" />
          Repayment Recovery Trends
        </h3>

        <div class="flex-1 flex flex-col justify-center gap-5">
          <div
            v-for="channel in [
              { name: 'Auto-Debit (Mono)', success: 88, vol: 'N42M' },
              { name: 'Manual Transfer', success: 64, vol: 'N18M' },
              { name: 'Settlement Plan', success: 32, vol: 'N5.2M' },
            ]"
            :key="channel.name"
            class="space-y-2"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="font-bold text-slate-700">{{ channel.name }}</span>
              <span class="text-slate-500 font-medium"
                >Vol:
                <span class="text-slate-800">{{ channel.vol }}</span></span
              >
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-500 rounded-full transition-all duration-700"
                :style="{ width: channel.success + '%' }"
              ></div>
            </div>
            <div class="flex justify-end">
              <span class="text-[10px] font-black text-indigo-600 uppercase"
                >{{ channel.success }}% Recovery</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
