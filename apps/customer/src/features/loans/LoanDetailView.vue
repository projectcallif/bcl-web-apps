<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Loader2, CreditCard, Banknote } from 'lucide-vue-next'
import type { Loan, LoanStatus, LoanType, RepaymentScheduleItem } from '@bcl/types'
import RepaymentScheduleTable from './components/RepaymentScheduleTable.vue'
import { getLoan, getRepaymentSchedule, getLoanAgreement } from './api'

const route = useRoute()
const router = useRouter()

const loan = ref<Loan | null>(null)
const schedule = ref<RepaymentScheduleItem[]>([])
const agreementHtml = ref('')
const isLoading = ref(true)
const activeTab = ref<'schedule' | 'agreement'>('schedule')

onMounted(async () => {
  const id = route.params.id as string
  const [loanRes, scheduleRes, agreementRes] = await Promise.all([
    getLoan(id),
    getRepaymentSchedule(id),
    getLoanAgreement(id),
  ])
  loan.value = loanRes.data
  schedule.value = scheduleRes.data
  agreementHtml.value = agreementRes.data.html
  isLoading.value = false
})

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const loanTypeLabel: Record<LoanType, string> = {
  PERSONAL: 'Personal Loan', BUSINESS: 'Business Loan',
  EMERGENCY: 'Emergency Loan', SALARY_ADVANCE: 'Salary Advance',
}

const statusConfig: Record<LoanStatus, { label: string; dot: string; badge: string }> = {
  ACTIVE:    { label: 'Active',    dot: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
  OVERDUE:   { label: 'Overdue',   dot: 'bg-red-500',   badge: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', dot: 'bg-blue-500',  badge: 'bg-blue-100 text-blue-700' },
  CLOSED:    { label: 'Closed',    dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
}
</script>

<template>
  <div class="max-w-4xl mx-auto">

    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
      @click="router.push({ name: 'loans' })"
    >
      <ArrowLeft class="w-4 h-4" /> Back to My Loans
    </button>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-24">
      <Loader2 class="w-7 h-7 text-primary animate-spin" />
    </div>

    <template v-else-if="loan">

      <!-- Loan header card -->
      <div class="relative bg-primary rounded-2xl p-6 overflow-hidden text-white mb-6">
        <div class="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div class="absolute right-4 -bottom-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div class="relative flex items-start justify-between mb-5">
          <div>
            <p class="text-white/60 text-sm mb-1">{{ loanTypeLabel[loan.type] }}</p>
            <p class="text-xs font-mono text-white/40">{{ loan.loanNumber }}</p>
            <p v-if="loan.purpose" class="text-sm text-white/70 mt-1">{{ loan.purpose }}</p>
          </div>
          <span class="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold">
            <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[loan.status].dot" />
            {{ statusConfig[loan.status].label }}
          </span>
        </div>

        <div class="relative grid grid-cols-2 gap-6 mb-5">
          <div>
            <p class="text-xs text-white/50 uppercase tracking-wider mb-1">Outstanding Balance</p>
            <p class="text-3xl font-bold tracking-tight">{{ formatCurrency(loan.outstandingBalance) }}</p>
          </div>
          <div class="self-end">
            <div class="flex justify-between text-xs text-white/50 mb-1.5">
              <span>{{ Math.round(loan.amountPaid / loan.totalAmount * 100) }}% repaid</span>
            </div>
            <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                class="h-full bg-white rounded-full"
                :style="{ width: Math.round(loan.amountPaid / loan.totalAmount * 100) + '%' }"
              />
            </div>
          </div>
        </div>

        <div class="relative grid grid-cols-4 gap-4 pt-5 border-t border-white/15">
          <div>
            <p class="text-xs text-white/50 mb-1">Total Loan</p>
            <p class="text-sm font-semibold">{{ formatCurrency(loan.totalAmount) }}</p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Amount Paid</p>
            <p class="text-sm font-semibold">{{ formatCurrency(loan.amountPaid) }}</p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Disbursed</p>
            <p class="text-sm font-semibold">{{ formatDate(loan.disbursedAt) }}</p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Due Date</p>
            <p class="text-sm font-semibold">{{ formatDate(loan.dueDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Make Payment button (for active/overdue loans) -->
      <div v-if="loan.status === 'ACTIVE' || loan.status === 'OVERDUE'" class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5 flex items-center justify-between mb-6">
        <div>
          <p class="text-sm font-semibold text-slate-800">Next Payment Due</p>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ formatCurrency(loan.nextRepaymentAmount) }} due on {{ formatDate(loan.nextRepaymentDate) }}
          </p>
        </div>
        <button
          class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition-colors shadow-sm shadow-primary/20"
          @click="() => {/* payment flow — coming soon */}"
        >
          <Banknote class="w-4 h-4" />
          Make a Payment
        </button>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
        <div class="flex border-b border-slate-100">
          <button
            class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
            :class="activeTab === 'schedule'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'"
            @click="activeTab = 'schedule'"
          >
            <CreditCard class="w-4 h-4" />
            Repayment Schedule
          </button>
          <button
            class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
            :class="activeTab === 'agreement'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'"
            @click="activeTab = 'agreement'"
          >
            <CreditCard class="w-4 h-4" />
            Loan Agreement
          </button>
        </div>

        <div class="p-6">
          <!-- Schedule tab -->
          <RepaymentScheduleTable
            v-if="activeTab === 'schedule'"
            :items="schedule"
            :loan-number="loan.loanNumber"
          />

          <!-- Agreement tab -->
          <div
            v-else
            class="prose prose-slate prose-sm max-w-none"
            v-html="agreementHtml"
          />
        </div>
      </div>

    </template>
  </div>
</template>
