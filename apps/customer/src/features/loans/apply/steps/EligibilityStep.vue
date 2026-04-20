<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BaseButton } from '@bcl/ui'
import { CheckCircle2, XCircle, Loader2, ShieldCheck, TrendingUp, Banknote } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { getEligibilityResult } from '../../api'

const store = useLoanApplicationStore()
const isChecking = ref(true)

async function pollEligibility() {
  try {
    const res = await getEligibilityResult()
    store.eligibility = res.data
    
    if (res.data.status === 'PENDING') {
      setTimeout(pollEligibility, 2000)
    } else {
      isChecking.value = false
    }
  } catch (err) {
    console.error('Eligibility poll failed:', err)
    isChecking.value = false
  }
}

onMounted(() => {
  pollEligibility()
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
      <div v-if="store.eligibility.canAfford" class="space-y-5">
        <div class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4">
          <CheckCircle2 class="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p class="text-sm font-bold text-green-800">You're eligible for this loan!</p>
            <p class="text-xs text-green-600 mt-0.5">Your profile supports a repayment of {{ formatCurrency(store.eligibility.monthlyPaymentInNaira || 0) }}/month.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-primary-50 rounded-xl p-4 text-center">
            <Banknote class="w-6 h-6 text-primary mx-auto mb-2" />
            <p class="text-xs text-slate-500 mb-1">Max Available Amount</p>
            <p class="text-base sm:text-lg font-bold text-primary">{{ formatCurrency(store.eligibility.eligibleAmountInNaira || 0) }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4 text-center">
            <TrendingUp class="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p class="text-xs text-slate-500 mb-1">Affordability</p>
            <p class="text-base sm:text-lg font-bold text-green-700">Verified</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4 text-center">
            <ShieldCheck class="w-6 h-6 text-tertiary mx-auto mb-2" />
            <p class="text-xs text-slate-500 mb-1">Status</p>
            <p class="text-base sm:text-lg font-bold text-slate-700">{{ store.eligibility.status }}</p>
          </div>
        </div>

        <div class="bg-slate-50 rounded-xl p-4">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Linked Bank Account</p>
          <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center font-bold text-primary text-xs">
                {{ store.eligibility.bankAccount?.bankName.substring(0, 2) || 'BK' }}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ store.eligibility.bankAccount?.bankName }}</p>
                <p class="text-xs text-slate-500">{{ store.eligibility.bankAccount?.accountNumber }}</p>
              </div>
            </div>
            <p class="text-xs font-medium text-slate-400 italic">Primary Source</p>
          </div>
        </div>
      </div>

      <!-- Not eligible -->
      <div v-else class="flex flex-col items-center py-8 text-center">
        <XCircle class="w-14 h-14 text-red-400 mb-4" />
        <p class="text-base font-semibold text-slate-700 mb-1">Not eligible for this request</p>
        <p class="text-sm text-slate-400 max-w-sm">
          {{ store.eligibility.reason || 'We are unable to approve this specific loan request at this time. Please try adjusting the amount or tenor.' }}
        </p>
      </div>

    </template>

    <div class="flex justify-between mt-6">
      <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="goBack">Back</button>
      <BaseButton v-if="store.eligibility?.canAfford" variant="primary" size="lg" @click="proceed">
        Proceed to Schedule
      </BaseButton>
    </div>
  </div>
</template>
