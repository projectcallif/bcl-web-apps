<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BaseButton, BaseSkeleton } from '@bcl/ui'
import { Loader2, AlertCircle, Banknote, Calendar, ShieldCheck, Wallet } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { applyLoan, previewLoan } from '../../api'
import type { ApiClientError } from '@bcl/types'

const store = useLoanApplicationStore()
const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')

async function fetchPreview() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await previewLoan({
      requestedAmount: store.selectedAmount,
      requestedTenor: store.selectedTenor,
    })
    store.previewData = res.data

    // Update store bank info for processing step display
    store.bankName = res.data.disbursementAccount.bankName
    store.accountNumber = res.data.disbursementAccount.accountNumber
    store.accountName = res.data.disbursementAccount.accountName
  } catch (err) {
    const error = err as ApiClientError
    console.error('Preview failed:', error)
    errorMessage.value = error.message || 'Failed to retrieve loan preview. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPreview()
})

async function submitApplication() {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const res = await applyLoan({
      requestedAmount: store.selectedAmount,
      requestedTenor: store.selectedTenor,
      purpose: store.purpose,
    })
    store.applicationResult = res.data
    store.nextStep()
  } catch (err) {
    const error = err as ApiClientError
    console.error('Submission failed:', error)
    errorMessage.value = error.message || 'Failed to submit application. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function goBack() {
  store.prevStep()
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}
</script>

<template>
  <div class="space-y-6">
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-8"
    >
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800">Review &amp; Confirm</h2>
          <p class="text-xs text-slate-500 font-medium">
            Finalize your application and disbursement bank.
          </p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="space-y-4 py-4">
        <BaseSkeleton height="100px" width="100%" class="rounded-2xl" />
        <div class="grid grid-cols-2 gap-4">
          <BaseSkeleton height="80px" width="100%" class="rounded-xl" />
          <BaseSkeleton height="80px" width="100%" class="rounded-xl" />
        </div>
        <BaseSkeleton height="150px" width="100%" class="rounded-2xl" />
      </div>

      <!-- Error State (Fetch Failed) -->
      <div
        v-else-if="errorMessage && !store.previewData"
        class="py-12 text-center flex flex-col items-center"
      >
        <div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <AlertCircle class="w-8 h-8 text-rose-500" />
        </div>
        <p class="text-slate-600 font-bold mb-2">Preview Failed</p>
        <p class="text-sm text-slate-400 mb-6 max-w-xs">{{ errorMessage }}</p>
        <BaseButton variant="primary" @click="fetchPreview">Retry Preview</BaseButton>
      </div>

      <!-- Preview Content -->
      <template v-else-if="store.previewData">
        <!-- Disbursement Account Card -->
        <div class="bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-8">
          <div class="flex items-center gap-2 mb-6">
            <Wallet class="w-3.5 h-3.5 text-slate-400" />
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >Disbursement Bank</span
            >
          </div>

          <div class="flex items-center gap-5">
            <div
              class="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary font-bold shadow-sm"
            >
              {{ store.previewData.disbursementAccount.bankName.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <p class="text-base font-bold text-slate-800">
                {{ store.previewData.disbursementAccount.bankName }}
              </p>
              <p class="text-sm font-bold text-primary">
                {{ store.previewData.disbursementAccount.accountNumber }}
              </p>
              <p class="text-xs text-slate-500 font-medium opacity-80 uppercase tracking-tighter">
                {{ store.previewData.disbursementAccount.accountName }}
              </p>
            </div>
          </div>
        </div>

        <!-- Loan Purpose Input -->
        <div class="mb-8">
          <label for="loan-purpose" class="flex items-center gap-2 mb-3">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >What is this loan for? (Optional)</span
            >
          </label>
          <div class="relative group">
            <input
              id="loan-purpose"
              v-model="store.purpose"
              type="text"
              placeholder="e.g. Rent, Medical, School Fees..."
              class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
              <Banknote class="w-4 h-4 text-tertiary" />
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >Principal</span
              >
            </div>
            <p class="text-lg font-bold text-slate-800">
              {{ formatCurrency(store.previewData.loanAmount) }}
            </p>
          </div>
          <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
              <Calendar class="w-4 h-4 text-amber-500" />
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >Tenor</span
              >
            </div>
            <p class="text-lg font-bold text-slate-800">{{ store.previewData.tenor }} Months</p>
          </div>
        </div>

        <!-- Repayment Summary Card -->
        <div
          class="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/20 mb-8 overflow-hidden relative"
        >
          <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />

          <div class="flex justify-between items-center mb-6">
            <span class="text-[10px] font-bold text-indigo-200/60 uppercase tracking-widest"
              >Repayment Breakdown</span
            >
            <span class="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold"
              >Standard Flat Rate</span
            >
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-indigo-100/60">Monthly Repayment</span>
              <span class="text-lg font-bold">{{
                formatCurrency(store.previewData.monthlyPayment)
              }}</span>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-white/10">
              <span class="text-sm font-bold text-white">Total Amount Due</span>
              <span class="text-xl font-bold">{{
                formatCurrency(store.previewData.totalRepayableAmount)
              }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="mb-8 flex items-start gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl animate-in slide-in-from-top-2"
        >
          <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p class="text-xs text-rose-700 font-medium leading-relaxed">{{ errorMessage }}</p>
        </div>

        <div class="flex justify-between items-center pt-4">
          <button
            class="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            :disabled="isSubmitting"
            @click="goBack"
          >
            Back
          </button>
          <BaseButton
            variant="primary"
            size="lg"
            :isLoading="isSubmitting"
            @click="submitApplication"
            class="px-10 shadow-lg shadow-primary/20"
          >
            Submit Application
          </BaseButton>
        </div>
      </template>
    </div>
  </div>
</template>
