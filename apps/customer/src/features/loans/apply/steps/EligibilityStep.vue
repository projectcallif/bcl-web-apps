<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BaseButton } from '@bcl/ui'
import { CheckCircle2, XCircle, Loader2, TrendingUp, Banknote, Info } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { checkEligibility, getEligibilityResult } from '../../api'
import type { ApiClientError } from '@bcl/types'

const store = useLoanApplicationStore()
const isChecking = ref(true)
const pollError = ref('')

async function startEligibilityCheck() {
  isChecking.value = true
  pollError.value = ''

  try {
    // Initiate check if not already done or if we need a fresh one
    const checkRes = await checkEligibility()
    store.eligibility = checkRes.data

    if (checkRes.data.status === 'COMPLETED') {
      isChecking.value = false
    } else {
      pollEligibility()
    }
  } catch (err) {
    const error = err as ApiClientError
    console.error('Eligibility initiation failed:', error)
    pollError.value =
      error.message ||
      'We could not initiate your eligibility check. Please ensure your bank is linked.'
    isChecking.value = false
  }
}

async function pollEligibility() {
  try {
    const res = await getEligibilityResult()
    store.eligibility = res.data

    if (res.data.status === 'PENDING') {
      setTimeout(pollEligibility, 3000)
    } else {
      isChecking.value = false
    }
  } catch (err) {
    const error = err as ApiClientError
    console.error('Eligibility poll failed:', error)
    pollError.value =
      error.message || 'An unexpected error occurred while checking your eligibility.'
    isChecking.value = false
  }
}

onMounted(() => {
  if (
    !store.eligibility ||
    store.eligibility.status === 'PENDING' ||
    store.eligibility.status === 'FAILED'
  ) {
    startEligibilityCheck()
  } else {
    isChecking.value = false
  }
})

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}

function proceed() {
  store.nextStep()
}
function goBack() {
  store.prevStep()
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Eligibility Assessment</h2>
    <p class="text-sm text-slate-500 mb-6">
      Determining your maximum loan limit based on your income profile.
    </p>

    <!-- Checking state -->
    <div v-if="isChecking" class="flex flex-col items-center py-12">
      <div class="relative mb-6">
        <div
          class="w-24 h-24 rounded-full border-4 border-primary/10 flex items-center justify-center"
        >
          <Loader2 class="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>
      <p class="text-base font-semibold text-slate-700 mb-1 text-center px-4">
        Checking your eligibility...
      </p>
      <p class="text-sm text-slate-400 text-center px-6">This usually takes a few seconds</p>
    </div>

    <!-- Global Error -->
    <div
      v-else-if="pollError"
      class="flex flex-col items-center py-8 text-center animate-in fade-in zoom-in duration-300"
    >
      <XCircle class="w-14 h-14 text-rose-400 mb-4" />
      <p class="text-base font-semibold text-slate-700 mb-1">Assessment Incomplete</p>
      <p class="text-sm text-slate-400 max-w-sm px-6">
        {{ pollError }}
      </p>
      <BaseButton variant="ghost" class="mt-6 text-primary" @click="startEligibilityCheck">
        Try Again
      </BaseButton>
    </div>

    <!-- Result -->
    <template v-else-if="store.eligibility">
      <!-- Eligible -->
      <div
        v-if="store.eligibility.canAfford"
        class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div
          class="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-5"
        >
          <div
            class="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
          >
            <CheckCircle2 class="w-7 h-7 text-white" />
          </div>
          <div>
            <p class="text-base font-bold text-emerald-900">Great news! You're eligible.</p>
            <p class="text-sm text-emerald-700 opacity-80">
              Based on your bank records, you qualify for a loan.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-primary-50 rounded-2xl p-5 border border-primary-100">
            <div class="flex items-center justify-between mb-4">
              <Banknote class="w-6 h-6 text-primary" />
              <span
                class="text-[10px] font-bold text-primary uppercase tracking-wider bg-white px-2 py-0.5 rounded-full"
                >Max Limit</span
              >
            </div>
            <p class="text-xs text-slate-500 mb-1 uppercase tracking-widest font-bold opacity-60">
              Maximum Loan Amount
            </p>
            <p class="text-2xl font-bold text-primary">
              {{ formatCurrency(store.eligibility.eligibleAmountInNaira || 0) }}
            </p>
          </div>

          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <TrendingUp class="w-6 h-6 text-emerald-600" />
              <span
                class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full"
                >Affordability</span
              >
            </div>
            <p class="text-xs text-slate-500 mb-1 uppercase tracking-widest font-bold opacity-60">
              Monthly Capacity
            </p>
            <p class="text-2xl font-bold text-slate-800">
              {{ formatCurrency(store.eligibility.monthlyPaymentInNaira || 0) }}
            </p>
          </div>
        </div>

        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div class="flex items-center gap-3 mb-4">
            <Info class="w-4 h-4 text-slate-400" />
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Disbursement Destination
            </p>
          </div>
          <div
            class="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100"
              >
                <span class="font-bold text-slate-400 text-sm">{{
                  store.eligibility.bankAccount?.bankName.substring(0, 2) || 'BK'
                }}</span>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">
                  {{ store.eligibility.bankAccount?.bankName }}
                </p>
                <p class="text-xs text-slate-500 font-medium">
                  {{ store.eligibility.bankAccount?.accountNumber }} •
                  {{ store.eligibility.bankAccount?.accountName }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not eligible -->
      <div
        v-else
        class="flex flex-col items-center py-10 text-center animate-in fade-in zoom-in duration-500"
      >
        <div class="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
          <XCircle class="w-10 h-10 text-rose-500" />
        </div>
        <p class="text-xl font-bold text-slate-800 mb-2">Maximum Capacity Exceeded</p>
        <p class="text-sm text-slate-400 max-w-sm px-6 leading-relaxed">
          {{
            store.eligibility.reason ||
            'We could not verify sufficient income flow to approve a loan at this time. Try again later.'
          }}
        </p>
        <BaseButton variant="ghost" class="mt-8 text-slate-500" @click="goBack">
          Back to Terms
        </BaseButton>
      </div>
    </template>

    <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
      <button
        class="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
        @click="goBack"
      >
        Back
      </button>
      <BaseButton
        v-if="store.eligibility?.canAfford && !pollError"
        variant="primary"
        size="lg"
        @click="proceed"
        class="px-8 shadow-lg shadow-primary/20"
      >
        Select Loan Amount
      </BaseButton>
    </div>
  </div>
</template>
