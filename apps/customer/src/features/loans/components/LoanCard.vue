<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, Calendar } from 'lucide-vue-next'
import type { Loan, LoanStatus, LoanType } from '@bcl/types'

const props = defineProps<{ loan: Loan }>()

const progress = computed(() =>
  Math.round((props.loan.amountPaid / props.loan.totalAmount) * 100),
)

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const loanTypeLabel: Record<LoanType, string> = {
  PERSONAL: 'Personal Loan',
  BUSINESS: 'Business Loan',
  EMERGENCY: 'Emergency Loan',
  SALARY_ADVANCE: 'Salary Advance',
}

const statusConfig: Record<LoanStatus, { label: string; dot: string; badge: string }> = {
  ACTIVE:    { label: 'Active',    dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
  OVERDUE:   { label: 'Overdue',   dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700' },
  CLOSED:    { label: 'Closed',    dot: 'bg-slate-400',  badge: 'bg-slate-100 text-slate-600' },
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5 hover:shadow-md hover:shadow-slate-200/60 transition-shadow">

    <!-- Row 1: type + status -->
    <div class="flex items-start justify-between mb-3">
      <div>
        <p class="text-sm font-semibold text-slate-800">{{ loanTypeLabel[loan.type] }}</p>
        <p class="text-xs text-slate-400 mt-0.5 font-mono">{{ loan.loanNumber }}</p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
        :class="statusConfig[loan.status].badge"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[loan.status].dot" />
        {{ statusConfig[loan.status].label }}
      </span>
    </div>

    <!-- Purpose -->
    <p v-if="loan.purpose" class="text-xs text-slate-500 mb-4">
      Purpose: <span class="font-medium text-slate-700">{{ loan.purpose }}</span>
    </p>

    <!-- Metrics -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div>
        <p class="text-xs text-slate-400 mb-0.5">Loan Amount</p>
        <p class="text-sm font-bold text-slate-800">{{ formatCurrency(loan.totalAmount) }}</p>
      </div>
      <div>
        <p class="text-xs text-slate-400 mb-0.5">Amount Paid</p>
        <p class="text-sm font-bold text-slate-800">{{ formatCurrency(loan.amountPaid) }}</p>
      </div>
      <div>
        <p class="text-xs text-slate-400 mb-0.5">Outstanding</p>
        <p class="text-sm font-bold" :class="loan.outstandingBalance > 0 ? 'text-slate-800' : 'text-green-600'">
          {{ loan.outstandingBalance > 0 ? formatCurrency(loan.outstandingBalance) : 'Fully paid' }}
        </p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mb-4">
      <div class="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>{{ progress }}% repaid</span>
        <span>{{ loan.tenorMonths }} months · {{ loan.interestRate }}% p.m.</span>
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
      <div v-if="loan.status === 'ACTIVE' || loan.status === 'OVERDUE'" class="flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar class="w-3.5 h-3.5" />
        Next: {{ formatDate(loan.nextRepaymentDate) }} —
        <span class="font-semibold text-slate-700">{{ formatCurrency(loan.nextRepaymentAmount) }}</span>
      </div>
      <div v-else class="text-xs text-slate-400">
        Closed {{ formatDate(loan.dueDate) }}
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
