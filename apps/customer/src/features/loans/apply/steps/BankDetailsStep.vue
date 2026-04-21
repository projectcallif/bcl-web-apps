<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BaseButton } from '@bcl/ui'
import { Loader2, AlertCircle, Banknote, Calendar, ShieldCheck } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { applyLoan, previewLoan } from '../../api'

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
  } catch (err: any) {
    console.error('Preview failed:', err)
    errorMessage.value =
      err.response?.data?.message || 'Failed to retrieve loan preview. Please try again.'
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
      purpose: 'PERSONAL',
      productId: 'cfe75bf8-ec72-4642-8e33-f8cd205ed8fd',
    })
    store.applicationReference = res.data.referenceId
    store.nextStep()
  } catch (err: any) {
    console.error('Submission failed:', err)
    errorMessage.value =
      err.response?.data?.message || 'Failed to submit application. Please try again.'
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
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Confirm Disbursement</h2>
    <p class="text-sm text-slate-500 mb-6">
      Please review the details below before submitting your application.
    </p>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center py-12">
      <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
      <p class="text-slate-500 animate-pulse">Confirming disbursement details...</p>
    </div>

    <!-- Error State (Fetch Failed) -->
    <div
      v-else-if="errorMessage && !store.previewData"
      class="py-8 text-center flex flex-col items-center"
    >
      <AlertCircle class="w-12 h-12 text-rose-400 mb-3" />
      <p class="text-slate-600 font-medium mb-4">{{ errorMessage }}</p>
      <BaseButton variant="primary" size="sm" @click="fetchPreview">Retry Preview</BaseButton>
    </div>

    <!-- Preview Content -->
    <template v-else-if="store.previewData">
      <!-- Disbursement Account -->
      <div class="bg-slate-50 rounded-2xl border border-slate-200 p-5 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck class="w-5 h-5 text-primary" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Disbursement Account
            </p>
            <p class="text-sm font-bold text-slate-700">Verified & Linked</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500">Bank</span>
            <span class="font-bold text-slate-800">{{
              store.previewData.disbursementAccount.bankName
            }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500">Account Name</span>
            <span class="font-bold text-slate-800">{{
              store.previewData.disbursementAccount.accountName
            }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500">Account Number</span>
            <span class="font-bold text-slate-800 font-mono tracking-wider">{{
              store.previewData.disbursementAccount.accountNumber
            }}</span>
          </div>
        </div>
      </div>

      <!-- Loan Summary -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <Banknote class="w-5 h-5 text-tertiary mb-2" />
          <p class="text-xs text-slate-400 mb-0.5">Loan Amount</p>
          <p class="text-base font-bold text-slate-800">
            {{ formatCurrency(store.previewData.loanAmount) }}
          </p>
        </div>
        <div class="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <Calendar class="w-5 h-5 text-amber-500 mb-2" />
          <p class="text-xs text-slate-400 mb-0.5">Duration</p>
          <p class="text-base font-bold text-slate-800">{{ store.previewData.tenor }} Months</p>
        </div>
      </div>

      <div class="space-y-2.5 mb-6 px-1">
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">Monthly Repayment</span>
          <span class="font-bold text-primary">{{
            formatCurrency(store.previewData.monthlyPayment)
          }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">Total Interest</span>
          <span class="font-semibold text-slate-600">{{
            formatCurrency(store.previewData.totalInterest)
          }}</span>
        </div>
        <div class="flex justify-between text-base pt-2.5 border-t border-slate-100">
          <span class="font-bold text-slate-700">Total Repayable</span>
          <span class="font-black text-slate-900">{{
            formatCurrency(store.previewData.totalRepayableAmount)
          }}</span>
        </div>
      </div>

      <!-- Submission Error (e.g. Active Loan) -->
      <div
        v-if="errorMessage"
        class="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl animate-in slide-in-from-top-2"
      >
        <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <p class="text-sm text-rose-700 font-medium">{{ errorMessage }}</p>
      </div>

      <div class="flex justify-between">
        <button
          class="text-sm text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
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
        >
          Confirm & Submit Application
        </BaseButton>
      </div>
    </template>
  </div>
</template>
