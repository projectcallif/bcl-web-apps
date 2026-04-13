<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Wallet, TrendingDown, CreditCard, AlertCircle, Loader2 } from 'lucide-vue-next'
import { AppPagination } from '@bcl/ui'
import type { Loan, LoanStatus, LoanStats } from '@bcl/types'
import LoanCard from './components/LoanCard.vue'
import { getLoans, getLoanStats } from './api'

const router = useRouter()

// ── State ─────────────────────────────────────────────────────────────────────

const loans = ref<Loan[]>([])
const stats = ref<LoanStats | null>(null)
const totalItems = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const isLoading = ref(true)
const statusFilter = ref<LoanStatus | null>(null)
const PAGE_SIZE = 5

const statusFilters: { label: string; value: LoanStatus | null }[] = [
  { label: 'All', value: null },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Overdue', value: 'OVERDUE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Closed', value: 'CLOSED' },
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
  const res = await getLoans({
    page: currentPage.value,
    pageSize: PAGE_SIZE,
    status: statusFilter.value,
  })
  loans.value = res.data.items
  totalItems.value = res.data.total
  totalPages.value = res.data.totalPages
  isLoading.value = false
}

function applyFilter(value: LoanStatus | null) {
  statusFilter.value = value
  currentPage.value = 1
}

watch([currentPage, statusFilter], fetchLoans, { immediate: true })

getLoanStats().then((res) => {
  stats.value = res.data
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
    <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Loans</p>
          <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard class="w-4 h-4 text-primary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ stats.totalLoans }}</p>
        <p class="text-xs text-slate-400 mt-1">loans collected</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Active</p>
          <div class="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingDown class="w-4 h-4 text-green-600" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ stats.activeLoans }}</p>
        <p class="text-xs text-slate-400 mt-1">active loans</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Borrowed
          </p>
          <div class="w-8 h-8 rounded-xl bg-tertiary/10 flex items-center justify-center">
            <Wallet class="w-4 h-4 text-tertiary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ formatCurrency(stats.totalBorrowed) }}</p>
        <p class="text-xs text-slate-400 mt-1">across all loans</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Outstanding</p>
          <div class="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
            <AlertCircle class="w-4 h-4 text-secondary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800">
          {{ formatCurrency(stats.totalOutstanding) }}
        </p>
        <p class="text-xs text-slate-400 mt-1">total outstanding</p>
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
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <Loader2 class="w-6 h-6 text-primary animate-spin" />
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

    <!-- Pagination -->
    <div
      v-if="!isLoading && totalPages > 1"
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 px-6 py-4"
    >
      <AppPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :page-size="PAGE_SIZE"
        @update:current-page="currentPage = $event"
      />
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
