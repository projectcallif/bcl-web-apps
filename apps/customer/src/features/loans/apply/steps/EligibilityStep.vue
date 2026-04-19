<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BaseButton } from '@bcl/ui'
import { CheckCircle2, XCircle, Loader2, ShieldCheck, TrendingUp, Banknote } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { checkEligibility } from '../../api'

const store = useLoanApplicationStore()
const isChecking = ref(!store.eligibility)

onMounted(async () => {
  if (store.eligibility) return
  const res = await checkEligibility()
  store.eligibility = res.data
  isChecking.value = false
})

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

function proceed() { store.nextStep() }
function goBack() { store.prevStep() }
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Eligibility Check</h2>
    <p class="text-sm text-slate-500 mb-6">We're assessing your profile to determine your loan eligibility.</p>

    <!-- Checking state -->
    <div v-if="isChecking" class="flex flex-col items-center py-12">
      <div class="relative mb-6">
        <div class="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
          <Loader2 class="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
      <p class="text-base font-semibold text-slate-700 mb-1">Analyzing your profile...</p>
      <p class="text-sm text-slate-400">Checking BVN, credit history & account activity</p>
    </div>

    <!-- Result -->
    <template v-else-if="store.eligibility">

      <!-- Eligible -->
      <div v-if="store.eligibility.isEligible" class="space-y-5">
        <div class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4">
          <CheckCircle2 class="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p class="text-sm font-bold text-green-800">You're eligible for a loan!</p>
            <p class="text-xs text-green-600 mt-0.5">Congratulations, your profile meets our criteria.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-primary-50 rounded-xl p-4 text-center">
            <Banknote class="w-6 h-6 text-primary mx-auto mb-2" />
            <p class="text-xs text-slate-500 mb-1">Max Loan Amount</p>
            <p class="text-base sm:text-lg font-bold text-primary">{{ formatCurrency(store.eligibility.maxAmount) }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4 text-center">
            <TrendingUp class="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p class="text-xs text-slate-500 mb-1">Credit Score</p>
            <p class="text-base sm:text-lg font-bold text-green-700">724 <span class="text-xs font-normal text-green-600">Good</span></p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4 text-center">
            <ShieldCheck class="w-6 h-6 text-tertiary mx-auto mb-2" />
            <p class="text-xs text-slate-500 mb-1">Available Tenors</p>
            <p class="text-base sm:text-lg font-bold text-slate-700">{{ store.eligibility.tenors.length }}</p>
          </div>
        </div>

        <div class="bg-slate-50 rounded-xl p-4">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Eligibility Factors</p>
          <div class="space-y-2">
            <div v-for="factor in [
              { label: 'BVN Verification', status: true },
              { label: 'Email Verified', status: true },
              { label: 'Phone Verified', status: true },
              { label: 'Bank Account Linked', status: true },
              { label: 'Account History', status: true },
            ]" :key="factor.label"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-slate-600">{{ factor.label }}</span>
              <span class="flex items-center gap-1 text-xs font-medium" :class="factor.status ? 'text-green-600' : 'text-red-500'">
                <CheckCircle2 v-if="factor.status" class="w-3.5 h-3.5" />
                <XCircle v-else class="w-3.5 h-3.5" />
                {{ factor.status ? 'Verified' : 'Failed' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Not eligible -->
      <div v-else class="flex flex-col items-center py-8 text-center">
        <XCircle class="w-14 h-14 text-red-400 mb-4" />
        <p class="text-base font-semibold text-slate-700 mb-1">Not eligible at this time</p>
        <p class="text-sm text-slate-400 max-w-sm">{{ store.eligibility.reason ?? 'Your profile does not meet our current criteria. Please try again in 30 days.' }}</p>
      </div>

    </template>

    <div class="flex justify-between mt-6">
      <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="goBack">Back</button>
      <BaseButton v-if="store.eligibility?.isEligible" variant="primary" size="lg" @click="proceed">
        View Loan Options
      </BaseButton>
    </div>
  </div>
</template>
