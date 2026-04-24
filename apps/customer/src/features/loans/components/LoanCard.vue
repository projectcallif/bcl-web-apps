<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, Calendar } from 'lucide-vue-next'
import type { Loan, LoanStatus } from '@bcl/types'

const props = defineProps<{ loan: Loan }>()

const progress = computed(() => {
  const paid = props.loan.amountPaid || props.loan.totalPayable - props.loan.outstandingBalance
  return Math.round((paid / props.loan.totalPayable) * 100)
})

const estimatedMonthly = computed(() => Math.round(props.loan.totalPayable / props.loan.tenor))

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusConfig: Record<LoanStatus, { label: string; dot: string; badge: string }> = {
  PENDING: { label: 'Reviewing', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
  REJECTED: { label: 'Rejected', dot: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700' },
  HALTED: { label: 'Suspended', dot: 'bg-slate-500', badge: 'bg-slate-100 text-slate-700' },
  ACTIVE: { label: 'Active', dot: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
  OVERDUE: { label: 'Overdue', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  CLOSED: { label: 'Closed', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
  WRITTEN_OFF: { label: 'Written Off', dot: 'bg-slate-900', badge: 'bg-slate-200 text-slate-800' },
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5 hover:shadow-md hover:shadow-slate-200/60 transition-shadow"
  >
    <!-- Row 1: type + status -->
    <div class="flex items-start justify-between mb-3">
      <div>
        <p class="text-lg font-bold text-slate-800">{{ formatCurrency(loan.totalPayable) }}</p>
        <p class="text-xs text-slate-400 mt-0.5 font-mono">{{ loan.referenceId }}</p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
        :class="statusConfig[loan.status].badge"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[loan.status].dot" />
        {{ statusConfig[loan.status].label }}
      </span>
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div>
        <p class="text-xs text-slate-400 mb-0.5">Loan Amount</p>
        <p class="text-sm font-bold text-slate-800">{{ formatCurrency(loan.totalPayable) }}</p>
      </div>
      <div>
        <p class="text-xs text-slate-400 mb-0.5">Amount Paid</p>
        <p class="text-sm font-bold text-slate-800">
          {{ formatCurrency(loan.totalPayable - loan.outstandingBalance) }}
        </p>
      </div>
      <div>
        <p class="text-xs text-slate-400 mb-0.5">Outstanding</p>
        <p
          class="text-sm font-bold"
          :class="loan.outstandingBalance > 0 ? 'text-slate-800' : 'text-green-600'"
        >
          {{ loan.outstandingBalance > 0 ? formatCurrency(loan.outstandingBalance) : 'Fully paid' }}
        </p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mb-4">
      <div class="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>{{ progress }}% repaid</span>
        <span>{{ loan.tenor }} months tenor</span>
      </div>
      <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="loan.status === 'OVERDUE' ? 'bg-red-500' : 'bg-primary'"
          :style="{ width: progress + '%' }"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-slate-100">
      <div
        v-if="(loan.status === 'ACTIVE' || loan.status === 'OVERDUE') && loan.firstDueDate"
        class="flex items-center gap-1.5 text-xs text-slate-500"
      >
        <Calendar class="w-3.5 h-3.5" />
        Next: {{ formatDate(loan.firstDueDate) }} —
        <span class="font-semibold text-slate-700">{{ formatCurrency(estimatedMonthly) }}</span>
      </div>
      <div v-else class="text-xs text-slate-400">
        Ended {{ loan.finalDueDate ? formatDate(loan.finalDueDate) : 'N/A' }}
      </div>

      <RouterLink
        :to="{ name: 'loan-detail', params: { id: loan.id } }"
        class="flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-primary-800 transition-colors"
      >
        View Details <ChevronRight class="w-3.5 h-3.5" />
      </RouterLink>
    </div>
  </div>
</template>
