<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Wallet, TrendingDown, CreditCard, AlertCircle, Loader2 } from 'lucide-vue-next'
import type { Loan, LoanStatus, LoanDashboardStats } from '@bcl/types'
import LoanCard from './components/LoanCard.vue'
import LoanCardSkeleton from './components/LoanCardSkeleton.vue'
import StatsCardSkeleton from './components/StatsCardSkeleton.vue'
import { getMyLoans, getLoanDashboard } from './api'

const router = useRouter()

// ── State ─────────────────────────────────────────────────────────────────────

const loans = ref<Loan[]>([])
const stats = ref<LoanDashboardStats | null>(null)
const isLoading = ref(true)
const isLoadingStats = ref(true)
const statusFilter = ref<LoanStatus | null>(null)

const statusFilters: { label: string; value: LoanStatus | null }[] = [
  { label: 'All', value: null },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Defaulted', value: 'DEFAULTED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Written Off', value: 'WRITTEN_OFF' },
]

const filterBadgeClass = computed(
  () => (value: LoanStatus | null) =>
    statusFilter.value === value
      ? 'bg-primary text-white border-primary'
      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
)

// ── Data loading ──────────────────────────────────────────────────────────────

async function fetchLoans() {
  isLoading.value = true
  try {
    const res = await getMyLoans({
      status: statusFilter.value,
    })
    loans.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch loans:', err)
  } finally {
    isLoading.value = false
  }
}

function applyFilter(value: LoanStatus | null) {
  statusFilter.value = value
}

watch(statusFilter, fetchLoans, { immediate: true })

getLoanDashboard()
  .then((res) => {
    stats.value = res.data
  })
  .finally(() => {
    isLoadingStats.value = false
  })

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">My Loans</h1>
        <p class="text-sm text-slate-500 mt-0.5">View and manage all your loans in one place.</p>
      </div>
      <RouterLink
        :to="{ name: 'loan-apply' }"
        class="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition-colors shadow-sm shadow-primary/20 w-fit"
      >
        <Plus class="w-4 h-4" />
        Apply for Loan
      </RouterLink>
    </div>

    <!-- Stats row -->
    <div v-if="isLoadingStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCardSkeleton v-for="i in 4" :key="i" />
    </div>
    <div v-else-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Loans</p>
          <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard class="w-4 h-4 text-primary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ stats.activeLoanCount }}</p>
        <p class="text-xs text-slate-400 mt-1">running loans</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Payable</p>
          <div class="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingDown class="w-4 h-4 text-green-600" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ formatCurrency(stats.totalPayable) }}</p>
        <p class="text-xs text-slate-400 mt-1">total commitment</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Balance
          </p>
          <div class="w-8 h-8 rounded-xl bg-tertiary/10 flex items-center justify-center">
            <Wallet class="w-4 h-4 text-tertiary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800">
          {{ formatCurrency(stats.outstandingBalance) }}
        </p>
        <p class="text-xs text-slate-400 mt-1">outstanding</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Health Score</p>
          <div class="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
            <AlertCircle class="w-4 h-4 text-secondary" />
          </div>
        </div>
        <p
          class="text-2xl font-bold"
          :class="stats.status === 'POOR' ? 'text-red-500' : 'text-slate-800'"
        >
          {{ stats.healthScoreInPercent }}%
        </p>
        <p class="text-xs text-slate-400 mt-1">Credit status: {{ stats.status }}</p>
      </div>
    </div>

    <!-- Filter row -->
    <div class="flex flex-wrap items-center gap-2">
      <span
        class="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 w-full sm:w-auto"
        >Filter:</span
      >
      <button
        v-for="f in statusFilters"
        :key="String(f.value)"
        class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
        :class="filterBadgeClass(f.value)"
        @click="applyFilter(f.value)"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Loan list -->
    <div v-if="isLoading" class="flex flex-col gap-4">
      <LoanCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <div
      v-else-if="loans.length === 0"
      class="bg-white rounded-2xl border border-slate-100 p-12 text-center"
    >
      <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
        <CreditCard class="w-6 h-6 text-slate-400" />
      </div>
      <p class="text-sm font-semibold text-slate-700">No loans found</p>
      <p class="text-xs text-slate-400 mt-1">
        {{ statusFilter ? 'Try a different filter' : 'Apply for your first loan to get started' }}
      </p>
    </div>

    <div v-else class="flex flex-col gap-4">
      <LoanCard v-for="loan in loans" :key="loan.id" :loan="loan" />
    </div>

    <!-- Apply CTA banner -->
    <div
      class="bg-linear-to-r from-primary to-primary-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative text-center sm:text-left"
    >
      <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <div class="relative">
        <p class="text-base font-bold text-white">Ready for your next loan?</p>
        <p class="text-sm text-white/70 mt-0.5">Get up to ₦500,000 in minutes with no paperwork.</p>
      </div>
      <RouterLink
        :to="{ name: 'loan-apply' }"
        class="relative flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary text-sm font-bold rounded-xl hover:bg-primary-50 transition-colors shrink-0 w-full sm:w-auto"
      >
        <Plus class="w-4 h-4" /> Apply Now
      </RouterLink>
    </div>
  </div>
</template>
