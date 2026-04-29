<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, CreditCard, Banknote } from 'lucide-vue-next'
import type { Loan, LoanStatus } from '@bcl/types'
import RepaymentScheduleTable from './components/RepaymentScheduleTable.vue'
import LoanDetailSkeleton from './components/LoanDetailSkeleton.vue'
import { getLoanDetail, getLoanTerms } from './api'

const route = useRoute()
const router = useRouter()

const loan = ref<Loan | null>(null)
const agreementHtml = ref('')
const isLoading = ref(true)
const isLoadingAgreement = ref(false)
const activeTab = ref<'schedule' | 'agreement'>('schedule')

onMounted(async () => {
  const id = route.params.id as string
  try {
    const res = await getLoanDetail(id)
    loan.value = res.data
  } catch (err) {
    console.error('Failed to load loan details:', err)
  } finally {
    isLoading.value = false
  }
})

async function fetchAgreement() {
  if (agreementHtml.value || isLoadingAgreement.value) return
  
  isLoadingAgreement.value = true
  try {
    const res = await getLoanTerms()
    agreementHtml.value = res.data.content
  } catch (err) {
    console.error('Failed to load agreement:', err)
  } finally {
    isLoadingAgreement.value = false
  }
}

watch(activeTab, (tab) => {
  if (tab === 'agreement') {
    fetchAgreement()
  }
})

const schedule = computed(() => loan.value?.schedule || null)

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

// Using loanProduct.name for labels

const statusConfig: Record<LoanStatus, { label: string; dot: string; badge: string }> = {
  ACTIVE: { label: 'Active', dot: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
  DEFAULTED: { label: 'Defaulted', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  WRITTEN_OFF: { label: 'Written Off', dot: 'bg-slate-900', badge: 'bg-slate-200 text-slate-800' },
}
</script>

<template>
  <!-- Back -->
  <button
    class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
    @click="router.push({ name: 'loans' })"
  >
    <ArrowLeft class="w-4 h-4" /> Back to My Loans
  </button>

  <!-- Loading state -->
  <LoanDetailSkeleton v-if="isLoading" />

  <template v-else-if="loan">
    <!-- Loan header card -->
    <div class="relative bg-primary rounded-2xl p-6 overflow-hidden text-white mb-6">
      <div
        class="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"
      />
      <div
        class="absolute right-4 -bottom-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none"
      />

      <div class="relative flex items-start justify-between mb-5">
        <p class="text-xs font-mono text-white/40">{{ loan.referenceId }}</p>
        <span
          class="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[loan.status].dot" />
          {{ statusConfig[loan.status].label }}
        </span>
      </div>

      <div class="relative grid grid-cols-2 gap-6 mb-5">
        <div>
          <p class="text-xs text-white/50 uppercase tracking-wider mb-1">Outstanding Balance</p>
          <p class="text-3xl font-bold tracking-tight">
            {{ formatCurrency(loan.outstandingBalance) }}
          </p>
        </div>
        <div class="self-end">
          <div class="flex justify-between text-xs text-white/50 mb-1.5">
            <span
              >{{
                Math.round(
                  ((loan.totalPayable - loan.outstandingBalance) / loan.totalPayable) * 100,
                )
              }}% repaid</span
            >
          </div>
          <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-white rounded-full"
              :style="{
                width:
                  Math.round(
                    ((loan.totalPayable - loan.outstandingBalance) / loan.totalPayable) * 100,
                  ) + '%',
              }"
            />
          </div>
        </div>
      </div>

      <div class="relative grid grid-cols-4 gap-4 pt-5 border-t border-white/15">
        <div>
          <p class="text-xs text-white/50 mb-1">Total Payable</p>
          <p class="text-sm font-semibold">{{ formatCurrency(loan.totalPayable) }}</p>
        </div>
        <div>
          <p class="text-xs text-white/50 mb-1">Amount Paid</p>
          <p class="text-sm font-semibold">
            {{ formatCurrency(loan.totalPayable - loan.outstandingBalance) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-white/50 mb-1">Disbursed</p>
          <p class="text-sm font-semibold">
            {{ loan.disbursedAt ? formatDate(loan.disbursedAt) : 'Pending' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-white/50 mb-1">Due Date</p>
          <p class="text-sm font-semibold">
            {{ loan.finalDueDate ? formatDate(loan.finalDueDate) : 'N/A' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Make Payment button (for active/defaulted loans) -->
    <div
      v-if="(loan.status === 'ACTIVE' || loan.status === 'DEFAULTED') && schedule"
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5 flex items-center justify-between mb-6"
    >
      <div>
        <p class="text-sm font-semibold text-slate-800">Next Payment Due</p>
        <p class="text-xs text-slate-500 mt-0.5">
          {{ formatCurrency(schedule.summary.monthlyPayment) }} due on
          {{ formatDate(schedule.summary.firstDueDate) }}
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition-colors shadow-sm shadow-primary/20"
        @click="
          () => {
            /* payment flow — coming soon */
          }
        "
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
          :class="
            activeTab === 'schedule'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          "
          @click="activeTab = 'schedule'"
        >
          <CreditCard class="w-4 h-4" />
          Repayment Schedule
        </button>
        <button
          class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
          :class="
            activeTab === 'agreement'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          "
          @click="activeTab = 'agreement'"
        >
          <CreditCard class="w-4 h-4" />
          Loan Agreement
        </button>
      </div>

      <div class="p-6">
        <!-- Schedule tab -->
        <RepaymentScheduleTable
          v-if="activeTab === 'schedule' && schedule"
          :items="schedule.installments"
          :loan-reference="loan.referenceId"
        />

        <!-- Agreement tab -->
        <div
          v-else
          class="prose prose-slate prose-sm max-w-none border border-slate-100 rounded-xl overflow-hidden relative"
        >
          <div v-if="isLoadingAgreement" class="min-h-75 flex flex-col items-center justify-center bg-slate-50">
            <Loader2 class="w-8 h-8 text-primary animate-spin mb-3" />
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Agreement...</p>
          </div>
          <iframe
            v-else
            :srcdoc="agreementHtml"
            class="w-full min-h-125 border-0"
            title="Loan Agreement"
          />
        </div>
      </div>
    </div>
  </template>
</template>
