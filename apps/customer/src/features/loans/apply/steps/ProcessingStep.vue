<script setup lang="ts">
import { useRouter } from 'vue-router'
import { BaseButton } from '@bcl/ui'
import { useLoanApplicationStore } from '../store'

const store = useLoanApplicationStore()
const router = useRouter()

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

function goToDashboard() {
  store.reset()
  router.push({ name: 'dashboard' })
}

function viewLoans() {
  store.reset()
  router.push({ name: 'loans' })
}
</script>

<template>
  <div class="flex flex-col items-center text-center py-6 max-w-lg mx-auto">

    <!-- Animated success ring -->
    <div class="relative mb-8">
      <div class="w-28 h-28 rounded-full border-4 border-green-100 flex items-center justify-center">
        <div class="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
          <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
      <!-- Decorative ring -->
      <div class="absolute inset-0 rounded-full border-4 border-green-200/50 animate-ping" style="animation-duration: 2.5s" />
    </div>

    <h2 class="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
    <p class="text-slate-500 text-sm mb-6 leading-relaxed">
      Your loan application has been received and is being processed. You'll be notified via SMS and email once your loan is disbursed.
    </p>

    <!-- Reference -->
    <div class="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 w-full mb-6">
      <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Application Reference</p>
      <p class="text-lg font-bold text-slate-800 font-mono">{{ store.applicationReference }}</p>
    </div>

    <!-- Loan summary -->
    <div class="bg-primary/5 border border-primary/15 rounded-2xl px-5 py-4 w-full mb-6">
      <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Loan Summary</p>
      <div class="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p class="text-xs text-slate-400 mb-0.5">Amount</p>
          <p class="font-bold text-slate-800">{{ formatCurrency(store.selectedAmount) }}</p>
        </div>
        <div class="border-x border-primary/15">
          <p class="text-xs text-slate-400 mb-0.5">Tenor</p>
          <p class="font-bold text-slate-800">{{ store.selectedTenor }} months</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-0.5">Monthly</p>
          <p class="font-bold text-primary">{{ formatCurrency(store.monthlyPayment) }}</p>
        </div>
      </div>
    </div>

    <!-- Disbursement info -->
    <div class="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10"/><line x1="2" x2="22" y1="15"/></svg>
        </div>
        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Disbursement Target</p>
      </div>
      <div class="flex justify-between items-center px-1">
        <div>
          <p class="text-sm font-bold text-slate-800">{{ store.bankName }}</p>
          <p class="text-xs text-slate-400">Acc: {{ store.accountNumber }}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-0.5">Estimated Arrival</p>
          <p class="text-xs font-semibold text-slate-600">2-4 Business Hours</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 w-full">
      <button
        class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        @click="viewLoans"
      >
        View My Loans
      </button>
      <BaseButton variant="primary" size="lg" class="flex-1" @click="goToDashboard">
        Back to Dashboard
      </BaseButton>
    </div>
  </div>
</template>
