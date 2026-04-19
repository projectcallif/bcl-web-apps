<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChevronRight,
  TrendingUp,
  Calendar,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-vue-next'
import type { Loan, LoanPayment, LoanStatus, LoanType, PaymentStatus } from '@bcl/types'
import { useAuthStore } from '../auth/store'

const authStore = useAuthStore()

const balanceVisible = ref(false)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => authStore.user?.profile.firstName ?? 'there')

// ── Mock data — replace with dashboard store/API calls ────────────────────────

const activeLoan = ref<
  Loan & {
    nextRepaymentDate: string
    nextRepaymentAmount: number
    interestRate: number
    loanNumber: string
  }
>({
  id: '1',
  referenceId: 'BCL-2026-0042',
  loanNumber: 'BCL-2026-0042', // Keeping for UI consistency
  applicationId: 'app_1',
  principal: 500_000,
  interestAmount: 60_000,
  totalPayable: 560_000,
  amountPaid: 186_668,
  outstandingBalance: 373_332,
  nextRepaymentDate: '2026-04-15',
  nextRepaymentAmount: 46_667,
  disbursedAt: '2025-12-15',
  firstDueDate: '2026-01-15',
  finalDueDate: '2026-12-15',
  status: 'ACTIVE',
  interestRate: 4,
  tenor: 12,
  createdAt: '2025-12-10',
  loanProduct: {
    id: 'prod_1',
    name: 'Personal Loan',
    interestType: 'FIXED',
    minAmount: 10000,
    maxAmount: 1000000,
    tenors: [],
  },
  disbursementAccount: {
    id: 'acc_1',
    bankName: 'Zenith Bank',
    accountNumber: '1234567890',
    accountName: 'John Doe', // Based on firstName logic
  },
})

const recentPayments: LoanPayment[] = [
  {
    id: '1',
    loanId: '1',
    amount: 46_667,
    paidAt: '2026-03-15',
    reference: 'PAY-20260315-001',
    status: 'SUCCESS',
  },
  {
    id: '2',
    loanId: '1',
    amount: 46_667,
    paidAt: '2026-02-15',
    reference: 'PAY-20260215-001',
    status: 'SUCCESS',
  },
  {
    id: '3',
    loanId: '1',
    amount: 46_667,
    paidAt: '2026-01-15',
    reference: 'PAY-20260115-001',
    status: 'SUCCESS',
  },
  {
    id: '4',
    loanId: '1',
    amount: 46_667,
    paidAt: '2025-12-15',
    reference: 'PAY-20251215-001',
    status: 'SUCCESS',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const repaymentProgress = computed(() => {
  const paid = activeLoan.value.amountPaid ?? 0
  return Math.round((paid / activeLoan.value.totalPayable) * 100)
})

const paymentsMade = computed(() => {
  const paid = activeLoan.value.amountPaid ?? 0
  return Math.round(paid / activeLoan.value.nextRepaymentAmount)
})

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const loanTypeLabel: Record<LoanType, string> = {
  PERSONAL: 'Personal Loan',
  BUSINESS: 'Business Loan',
  EMERGENCY: 'Emergency Loan',
  SALARY_ADVANCE: 'Salary Advance',
}

const statusDotColor: Record<LoanStatus, string> = {
  PENDING: 'bg-amber-400',
  REJECTED: 'bg-rose-600',
  HALTED: 'bg-rose-500',
  ACTIVE: 'bg-green-400',
  OVERDUE: 'bg-red-400',
  COMPLETED: 'bg-blue-400',
  CLOSED: 'bg-slate-400',
}

const statusLabel: Record<LoanStatus, string> = {
  PENDING: 'Reviewing',
  REJECTED: 'Rejected',
  HALTED: 'Suspended',
  ACTIVE: 'Active',
  OVERDUE: 'Overdue',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
}

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; classes: string; icon: typeof CheckCircle2 }
> = {
  SUCCESS: { label: 'Successful', classes: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  PENDING: { label: 'Pending', classes: 'bg-amber-100 text-amber-700', icon: Clock },
  FAILED: { label: 'Failed', classes: 'bg-red-100 text-red-700', icon: XCircle },
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-800">{{ greeting }}, {{ firstName }}</h1>
      <p class="text-sm text-slate-500 mt-0.5">Here's a summary of your loan activity.</p>
    </div>

    <!-- Active Loan Card -->
    <div class="relative bg-primary rounded-2xl p-6 overflow-hidden text-white">
      <!-- Decorative circles -->
      <div
        class="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none"
      />
      <div
        class="absolute right-6 -bottom-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none"
      />

      <!-- Header row -->
      <div class="relative flex items-center justify-between mb-6">
        <div class="flex items-center gap-2.5 text-white/70 text-sm font-medium">
          <span>{{ loanTypeLabel[activeLoan.loanProduct.name.toUpperCase() as LoanType] || activeLoan.loanProduct.name }}</span>
          <span class="text-white/40">·</span>
          <span class="text-white/50 text-xs font-mono">{{ activeLoan.loanNumber }}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
          <span class="w-1.5 h-1.5 rounded-full" :class="statusDotColor[activeLoan.status]" />
          <span class="text-xs font-semibold">{{ statusLabel[activeLoan.status] }}</span>
        </div>
      </div>

      <!-- Outstanding balance -->
      <div class="relative mb-5">
        <div class="flex items-center gap-2 mb-1">
          <p class="text-xs font-medium text-white/50 uppercase tracking-wider">
            Outstanding Balance
          </p>
          <button
            class="text-white/40 hover:text-white/80 transition-colors"
            :aria-label="balanceVisible ? 'Hide balance' : 'Show balance'"
            @click="balanceVisible = !balanceVisible"
          >
            <EyeOff v-if="balanceVisible" class="w-3.5 h-3.5" />
            <Eye v-else class="w-3.5 h-3.5" />
          </button>
        </div>
        <p class="text-4xl font-bold tracking-tight">
          <span v-if="balanceVisible">{{ formatCurrency(activeLoan.outstandingBalance) }}</span>
          <span v-else class="tracking-widest">••••••</span>
        </p>
      </div>

      <!-- Progress bar -->
      <div class="relative mb-6">
        <div class="flex justify-between text-xs text-white/50 mb-2">
          <span>{{ repaymentProgress }}% repaid</span>
          <span>{{ paymentsMade }} of {{ activeLoan.tenor }} payments</span>
        </div>
        <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            class="h-full bg-white rounded-full transition-all duration-700"
            :style="{ width: repaymentProgress + '%' }"
          />
        </div>
      </div>

      <!-- Metrics -->
      <div
        class="relative grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-4 pt-5 border-t border-white/15"
      >
        <div>
          <p class="text-xs text-white/50 mb-1">Total Loan</p>
          <p class="text-sm font-semibold">{{ formatCurrency(activeLoan.totalPayable) }}</p>
        </div>
        <div>
          <p class="text-xs text-white/50 mb-1">Amount Paid</p>
          <p class="text-sm font-semibold">{{ formatCurrency(activeLoan.amountPaid ?? 0) }}</p>
        </div>
        <div>
          <p class="text-xs text-white/50 mb-1">Monthly Repayment</p>
          <p class="text-sm font-semibold">{{ formatCurrency(activeLoan.nextRepaymentAmount) }}</p>
        </div>
      </div>
    </div>

    <!-- Quick cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Next Due Payment -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Payment</p>
          <div class="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Calendar class="w-4 h-4 text-secondary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800 mb-1">
          {{ formatCurrency(activeLoan.nextRepaymentAmount) }}
        </p>
        <p class="text-sm text-slate-500">{{ formatDate(activeLoan.nextRepaymentDate) }}</p>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span class="text-xs font-medium text-secondary">
            {{ daysUntil(activeLoan.nextRepaymentDate) }} days remaining
          </span>
        </div>
      </div>

      <!-- Apply for New Loan -->
      <div
        class="bg-linear-to-br from-primary-50 to-tertiary-50 rounded-2xl border border-primary-100 p-5 flex flex-col"
      >
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">New Loan</p>
          <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard class="w-4 h-4 text-primary" />
          </div>
        </div>
        <p class="text-base font-semibold text-slate-800 mb-1">Need more funds?</p>
        <p class="text-sm text-slate-500 flex-1">Apply for a new loan in minutes, no paperwork.</p>
        <button
          class="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary group transition-all"
        >
          Apply Now
          <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <!-- Loan Progress -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Loan Progress</p>
          <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp class="w-4 h-4 text-primary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-800 mb-1">{{ repaymentProgress }}%</p>
        <p class="text-sm text-slate-500">
          {{ paymentsMade }} of {{ activeLoan.tenor }} payments made
        </p>
        <div class="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-700"
            :style="{ width: repaymentProgress + '%' }"
          />
        </div>
        <p class="text-xs text-slate-400 mt-2">Due {{ formatDate(activeLoan.finalDueDate || '') }}</p>
      </div>
    </div>

    <!-- Recent Payments -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 class="text-sm font-semibold text-slate-700">Recent Payments</h2>
        <button
          class="flex items-center gap-0.5 text-xs font-medium text-primary hover:text-primary-800 transition-colors"
        >
          View all <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="divide-y divide-slate-50">
        <div
          v-for="payment in recentPayments"
          :key="payment.id"
          class="flex items-center gap-4 px-6 py-4"
        >
          <!-- Icon -->
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            :class="paymentStatusConfig[payment.status].classes"
          >
            <component :is="paymentStatusConfig[payment.status].icon" class="w-4.5 h-4.5" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-700 font-mono">{{ payment.reference }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ formatDate(payment.paidAt) }}</p>
          </div>

          <!-- Amount + status -->
          <div class="text-right shrink-0">
            <p class="text-sm font-semibold text-slate-800">{{ formatCurrency(payment.amount) }}</p>
            <span
              class="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
              :class="paymentStatusConfig[payment.status].classes"
            >
              {{ paymentStatusConfig[payment.status].label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
