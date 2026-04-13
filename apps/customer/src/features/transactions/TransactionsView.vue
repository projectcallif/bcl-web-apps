<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { AppPagination } from '@bcl/ui'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Clock,
  XCircle,
  SlidersHorizontal,
} from 'lucide-vue-next'
import type { Transaction, TransactionType } from '@bcl/types'
import { getTransactions } from '../loans/api'

// ── State ──────────────────────────────────────────────────────────────────────

const transactions = ref<Transaction[]>([])
const total = ref(0)
const totalPages = ref(1)
const loading = ref(false)

const currentPage = ref(1)
const pageSize = 10

const typeFilter = ref<TransactionType | null>(null)
const dateFrom = ref('')
const dateTo = ref('')

// ── Fetch ──────────────────────────────────────────────────────────────────────

async function fetchTransactions(): Promise<void> {
  loading.value = true
  const res = await getTransactions({
    page: currentPage.value,
    pageSize,
    type: typeFilter.value,
    dateFrom: dateFrom.value || null,
    dateTo: dateTo.value || null,
  })
  transactions.value = res.data.items
  total.value = res.data.total
  totalPages.value = res.data.totalPages
  loading.value = false
}

watch([currentPage, typeFilter, dateFrom, dateTo], fetchTransactions, { immediate: true })

function onFilterChange(): void {
  currentPage.value = 1
}

// ── Summary stats ──────────────────────────────────────────────────────────────

const totalDisbursed = computed(() =>
  transactions.value
    .filter((t) => t.type === 'DISBURSEMENT' && t.status === 'SUCCESS')
    .reduce((s, t) => s + t.amount, 0),
)
const totalRepaid = computed(() =>
  transactions.value
    .filter((t) => t.type === 'REPAYMENT' && t.status === 'SUCCESS')
    .reduce((s, t) => s + t.amount, 0),
)

// ── Formatters ─────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
})

function formatCurrency(n: number): string {
  return fmt.format(n)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function loanTypeLabel(type: string): string {
  return type.replace('_', ' ')
}

const TYPE_FILTERS: { label: string; value: TransactionType | null }[] = [
  { label: 'All', value: null },
  { label: 'Disbursement', value: 'DISBURSEMENT' },
  { label: 'Repayment', value: 'REPAYMENT' },
]
</script>

<template>
  <div class="mb-6">
    <h1 class="text-xl font-bold text-slate-800">Payments & Transactions</h1>
    <p class="text-sm text-slate-500 mt-0.5">
      Full history of disbursements and repayments across all your loans.
    </p>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-4 mb-5">
    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
      <div class="flex items-center gap-3">
        <SlidersHorizontal class="w-4 h-4 text-slate-400 shrink-0" />
        <!-- Type pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <button
            v-for="f in TYPE_FILTERS"
            :key="String(f.value)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            :class="
              typeFilter === f.value
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            "
            @click="
              () => {
                typeFilter = f.value
                onFilterChange()
              }
            "
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div class="h-px lg:h-5 w-full lg:w-px bg-slate-100 lg:bg-slate-200" />

      <!-- Date range -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex items-center gap-2 flex-1">
          <label class="text-xs font-medium text-slate-500 shrink-0 min-w-8">From</label>
          <input
            v-model="dateFrom"
            type="date"
            class="flex-1 lg:flex-none text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            @change="onFilterChange"
          />
        </div>
        <div class="flex items-center gap-2 flex-1">
          <label class="text-xs font-medium text-slate-500 shrink-0 min-w-8">To</label>
          <input
            v-model="dateTo"
            type="date"
            class="flex-1 lg:flex-none text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            @change="onFilterChange"
          />
        </div>
        <button
          v-if="dateFrom || dateTo"
          class="text-xs text-slate-400 hover:text-slate-600 underline transition-colors sm:ml-2"
          @click="
            () => {
              dateFrom = ''
              dateTo = ''
              onFilterChange()
            }
          "
        >
          Clear
        </button>
      </div>
    </div>
  </div>

  <!-- Summary strip -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-4">
      <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Transactions shown</p>
      <p class="text-2xl font-bold text-slate-800">{{ total }}</p>
    </div>
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-4">
      <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Disbursed</p>
      <p class="text-2xl font-bold text-primary">{{ formatCurrency(totalDisbursed) }}</p>
    </div>
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-4 sm:col-span-2 lg:col-span-1"
    >
      <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Repaid</p>
      <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalRepaid) }}</p>
    </div>
  </div>

  <!-- Table/List container -->
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden"
  >
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <svg
        class="w-6 h-6 animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="transactions.length === 0"
      class="flex flex-col items-center justify-center py-16 text-slate-400"
    >
      <ArrowUpFromLine class="w-10 h-10 mb-3 opacity-30" />
      <p class="text-sm font-medium">No transactions found</p>
      <p class="text-xs mt-1">Try adjusting your filters</p>
    </div>

    <template v-else>
      <!-- Mobile List View -->
      <div class="md:hidden divide-y divide-slate-50">
        <div
          v-for="txn in transactions"
          :key="txn.id"
          class="p-4 active:bg-slate-50 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2.5">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                :class="
                  txn.type === 'DISBURSEMENT'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-green-100 text-green-600'
                "
              >
                <ArrowDownToLine v-if="txn.type === 'DISBURSEMENT'" class="w-5 h-5" />
                <ArrowUpFromLine v-else class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">
                  {{ txn.type === 'DISBURSEMENT' ? 'Disbursement' : 'Repayment' }}
                </p>
                <p class="text-[10px] font-mono text-slate-400 uppercase">{{ txn.reference }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                class="text-sm font-bold"
                :class="txn.type === 'DISBURSEMENT' ? 'text-primary' : 'text-green-600'"
              >
                {{ txn.type === 'DISBURSEMENT' ? '+' : '−' }}{{ formatCurrency(txn.amount) }}
              </p>
              <span
                class="inline-flex items-center gap-1 text-[10px] font-bold"
                :class="{
                  'text-green-600': txn.status === 'SUCCESS',
                  'text-amber-500': txn.status === 'PENDING',
                  'text-red-500': txn.status === 'FAILED',
                }"
              >
                {{ txn.status.charAt(0) + txn.status.slice(1).toLowerCase() }}
              </span>
            </div>
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-500">{{ formatDate(txn.date) }}</span>
            <span class="text-slate-400 italic">{{ txn.loanNumber }}</span>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <table class="w-full text-sm hidden md:table">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50">
            <th
              class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Reference
            </th>
            <th
              class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Loan
            </th>
            <th
              class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              class="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="txn in transactions"
            :key="txn.id"
            class="hover:bg-slate-50/60 transition-colors"
          >
            <td class="px-5 py-3.5 text-slate-600 whitespace-nowrap">{{ formatDate(txn.date) }}</td>
            <td class="px-5 py-3.5">
              <span class="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{{
                txn.reference
              }}</span>
            </td>
            <td class="px-5 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                :class="
                  txn.type === 'DISBURSEMENT'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-green-100 text-green-700'
                "
              >
                <ArrowDownToLine v-if="txn.type === 'DISBURSEMENT'" class="w-3 h-3" />
                <ArrowUpFromLine v-else class="w-3 h-3" />
                {{ txn.type === 'DISBURSEMENT' ? 'Disbursement' : 'Repayment' }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <p class="font-medium text-slate-800 text-xs">{{ txn.loanNumber }}</p>
              <p class="text-slate-400 text-xs">
                {{ loanTypeLabel(txn.loanType) }}{{ txn.purpose ? ` · ${txn.purpose}` : '' }}
              </p>
            </td>
            <td class="px-5 py-3.5 text-slate-500 text-xs">{{ txn.description }}</td>
            <td
              class="px-5 py-3.5 text-right font-bold whitespace-nowrap"
              :class="txn.type === 'DISBURSEMENT' ? 'text-primary' : 'text-green-600'"
            >
              {{ txn.type === 'DISBURSEMENT' ? '+' : '−' }}{{ formatCurrency(txn.amount) }}
            </td>
            <td class="px-5 py-3.5 text-center">
              <span
                class="inline-flex items-center gap-1 text-xs font-semibold"
                :class="{
                  'text-green-600': txn.status === 'SUCCESS',
                  'text-amber-500': txn.status === 'PENDING',
                  'text-red-500': txn.status === 'FAILED',
                }"
              >
                <CheckCircle2 v-if="txn.status === 'SUCCESS'" class="w-3.5 h-3.5" />
                <Clock v-else-if="txn.status === 'PENDING'" class="w-3.5 h-3.5" />
                <XCircle v-else class="w-3.5 h-3.5" />
                {{ txn.status.charAt(0) + txn.status.slice(1).toLowerCase() }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="border-t border-slate-100 px-5 py-3">
      <AppPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="total"
        :page-size="pageSize"
        @update:current-page="currentPage = $event"
      />
    </div>
  </div>
</template>
