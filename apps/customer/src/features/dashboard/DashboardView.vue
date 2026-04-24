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
  AlertCircle,
  FileText,
} from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Loan, LoanStatus, LoanType, LoanDashboardStats, Transaction } from '@bcl/types'
import { BaseSkeleton } from '@bcl/ui'
import { useAuthStore } from '../auth/store'
import { getLoanDashboard, getLatestActiveLoan, getRecentTransactions } from '../loans/api'

const authStore = useAuthStore()

const balanceVisible = ref(false)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => authStore.user?.profile.firstName ?? 'there')

const router = useRouter()

const isLoading = ref(true)
const stats = ref<LoanDashboardStats | null>(null)
const activeLoan = ref<Loan | null>(null)
const recentTransactions = ref<Transaction[]>([])

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const [statsRes, loanRes, txRes] = await Promise.all([
      getLoanDashboard(),
      getLatestActiveLoan().catch(() => ({ data: null })), // Handle 404/no-loan gracefully
      getRecentTransactions(10),
    ])

    stats.value = statsRes.data
    activeLoan.value = loanRes.data
    recentTransactions.value = txRes.data
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const repaymentProgress = computed(() => {
  if (!activeLoan.value) return 0
  const paid = activeLoan.value.amountPaid ?? 0
  return Math.round((paid / activeLoan.value.totalPayable) * 100)
})

const paymentsMade = computed(() => {
  if (!activeLoan.value || !activeLoan.value.disbursedAt) return 0
  // Roughly calculate based on months since disbursement
  const start = new Date(activeLoan.value.disbursedAt)
  const now = new Date()
  const diffMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth()
  return Math.max(0, Math.min(diffMonths, activeLoan.value.tenor))
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
  WRITTEN_OFF: 'bg-slate-900',
}

const statusLabel: Record<LoanStatus, string> = {
  PENDING: 'Reviewing',
  REJECTED: 'Rejected',
  HALTED: 'Suspended',
  ACTIVE: 'Active',
  OVERDUE: 'Overdue',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
  WRITTEN_OFF: 'Written Off',
}

const transactionTypeConfig = {
  DISBURSEMENT: { color: 'text-emerald-500', icon: TrendingUp },
  REPAYMENT: { color: 'text-blue-500', icon: CreditCard },
  PENALTY_CHARGE: { color: 'text-rose-500', icon: AlertCircle },
  FEE_CHARGE: { color: 'text-amber-500', icon: FileText },
  REFUND: { color: 'text-purple-500', icon: ArrowRight },
  REVERSAL: { color: 'text-slate-500', icon: XCircle },
}

const paymentStatusConfig = {
  SUCCESS: { label: 'Successful', classes: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  PENDING: { label: 'Pending', classes: 'bg-amber-100 text-amber-700', icon: Clock },
  FAILED: { label: 'Failed', classes: 'bg-red-100 text-red-700', icon: XCircle },
  REVERSED: { label: 'Reversed', classes: 'bg-slate-100 text-slate-700', icon: XCircle },
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-800">
        {{ greeting }},
        <template v-if="isLoading">
          <BaseSkeleton width="120px" height="2rem" class="inline-block align-middle ml-2" />
        </template>
        <template v-else>{{ firstName }}</template>
      </h1>
      <p class="text-sm text-slate-500 mt-0.5">Here's a summary of your loan activity.</p>
    </div>

    <!-- Active Loan Card -->
    <div class="relative bg-primary rounded-2xl p-6 overflow-hidden text-white min-h-75">
      <!-- Decorative circles -->
      <div
        class="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none"
      />
      <div
        class="absolute right-6 -bottom-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none"
      />

      <template v-if="isLoading">
        <div class="space-y-6 relative">
          <div class="flex justify-between items-start">
            <BaseSkeleton width="150px" height="1.25rem" class="bg-white/20" />
            <BaseSkeleton width="80px" height="1.5rem" rounded="1rem" class="bg-white/20" />
          </div>
          <div class="space-y-2">
            <BaseSkeleton width="120px" height="0.75rem" class="bg-white/20" />
            <BaseSkeleton width="200px" height="2.5rem" class="bg-white/20" />
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <BaseSkeleton width="60px" height="0.75rem" class="bg-white/20" />
              <BaseSkeleton width="100px" height="0.75rem" class="bg-white/20" />
            </div>
            <BaseSkeleton width="100%" height="0.5rem" rounded="1rem" class="bg-white/20" />
          </div>
        </div>
      </template>

      <template v-else>
        <!-- Header row -->
        <div class="relative flex items-center justify-between mb-6">
          <div class="flex items-center gap-2.5 text-white/70 text-sm font-medium">
            <template v-if="activeLoan">
              <span class="text-white/50 text-xs font-mono">{{ activeLoan.referenceId }}</span>
            </template>
            <template v-else>No Active Loan</template>
          </div>
          <div
            v-if="activeLoan"
            class="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1"
          >
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
            <span v-if="balanceVisible">{{ formatCurrency(stats?.outstandingBalance || 0) }}</span>
            <span v-else class="tracking-widest">••••••</span>
          </p>
        </div>

        <!-- Progress bar -->
        <div class="relative mb-6">
          <div class="flex justify-between text-xs text-white/50 mb-2">
            <span>{{ stats?.percentagePaid || 0 }}% repaid</span>
            <span v-if="activeLoan">{{ paymentsMade }} of {{ activeLoan.tenor }} payments</span>
          </div>
          <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-white rounded-full transition-all duration-700"
              :style="{ width: (stats?.percentagePaid || 0) + '%' }"
            />
          </div>
        </div>

        <!-- Metrics -->
        <div
          class="relative grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-4 pt-5 border-t border-white/15"
        >
          <div>
            <p class="text-xs text-white/50 mb-1">Total Loan</p>
            <p class="text-sm font-semibold">{{ formatCurrency(stats?.totalPayable || 0) }}</p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Amount Paid</p>
            <p class="text-sm font-semibold">{{ formatCurrency(stats?.totalCollected || 0) }}</p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Health Score</p>
            <p class="text-sm font-semibold">
              {{ stats?.healthScoreInPercent || 0 }}% ({{ stats?.status }})
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Quick cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <template v-if="isLoading">
        <BaseSkeleton
          v-for="i in stats?.activeLoanCount ? 3 : 1"
          :key="i"
          height="180px"
          rounded="1.5rem"
        />
      </template>
      <template v-else>
        <!-- Next Due Payment (Only if active loan exists) -->
        <div
          v-if="stats && stats.activeLoanCount > 0 && activeLoan"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5"
        >
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Due</p>
            <div class="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Calendar class="w-4 h-4 text-secondary" />
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-800 mb-1">
            {{ formatCurrency(activeLoan.principal / activeLoan.tenor) }}
          </p>
          <p class="text-sm text-slate-500">
            {{ activeLoan.firstDueDate ? formatDate(activeLoan.firstDueDate) : 'Not scheduled' }}
          </p>
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span class="text-xs font-medium text-secondary" v-if="activeLoan.firstDueDate">
              {{ daysUntil(activeLoan.firstDueDate) }} days remaining
            </span>
            <span class="text-xs font-medium text-secondary" v-else>Schedule pending</span>
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
          <p class="text-sm text-slate-500 flex-1">
            Apply for a new loan in minutes, no paperwork.
          </p>
          <button
            class="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary group transition-all"
            @click="router.push({ name: 'loan-apply' })"
          >
            Apply Now
            <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <!-- Loan Progress (Only if active loan exists) -->
        <div
          v-if="stats && stats.activeLoanCount > 0 && activeLoan"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5"
        >
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Loan Progress
            </p>
            <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp class="w-4 h-4 text-primary" />
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-800 mb-1">{{ stats.percentagePaid }}%</p>
          <p class="text-sm text-slate-500">
            {{ paymentsMade }} of {{ activeLoan.tenor }} payments made
          </p>
          <div class="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-700"
              :style="{ width: stats.percentagePaid + '%' }"
            />
          </div>
          <p class="text-xs text-slate-400 mt-2" v-if="activeLoan.finalDueDate">
            Due {{ formatDate(activeLoan.finalDueDate) }}
          </p>
        </div>
      </template>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 class="text-sm font-semibold text-slate-700">Recent Transactions</h2>
        <button
          class="flex items-center gap-0.5 text-xs font-medium text-primary hover:text-primary-800 transition-colors"
          @click="router.push({ name: 'transactions' })"
        >
          View all <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="divide-y divide-slate-50">
        <template v-if="isLoading">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4 px-6 py-4">
            <BaseSkeleton width="36px" height="36px" rounded="full" />
            <div class="flex-1 space-y-2">
              <BaseSkeleton width="120px" height="0.875rem" />
              <BaseSkeleton width="80px" height="0.75rem" />
            </div>
            <div class="text-right space-y-2">
              <BaseSkeleton width="70px" height="0.875rem" class="ml-auto" />
              <BaseSkeleton width="60px" height="1.25rem" rounded="1rem" class="ml-auto" />
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-if="recentTransactions.length === 0"
            class="px-6 py-10 text-center text-slate-500 text-sm"
          >
            No transactions found.
          </div>
          <div
            v-for="tx in recentTransactions"
            :key="tx.id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
          >
            <!-- Icon -->
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-slate-50"
              :class="transactionTypeConfig[tx.type].color"
            >
              <component :is="transactionTypeConfig[tx.type].icon" class="w-4.5 h-4.5" />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate capitalize">
                {{ tx.type.toLowerCase().replace('_', ' ') }}
              </p>
              <p class="text-xs text-slate-400 mt-0.5">{{ formatDate(tx.createdAt) }}</p>
            </div>

            <!-- Amount + status -->
            <div class="text-right shrink-0">
              <p
                class="text-sm font-semibold"
                :class="tx.type === 'REPAYMENT' ? 'text-rose-600' : 'text-emerald-600'"
              >
                {{ tx.type === 'REPAYMENT' ? '-' : '+' }}{{ formatCurrency(Number(tx.amount)) }}
              </p>
              <span
                class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 uppercase"
                :class="paymentStatusConfig[tx.status].classes"
              >
                {{ paymentStatusConfig[tx.status].label }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
