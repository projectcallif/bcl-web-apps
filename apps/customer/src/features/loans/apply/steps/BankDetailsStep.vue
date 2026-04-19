<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { BaseButton, AppTextInput } from '@bcl/ui'
import { Loader2, CheckCircle2 } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { applyLoan } from '../../api'

const store = useLoanApplicationStore()

const BANKS = [
  'Access Bank', 'GTBank', 'First Bank', 'Zenith Bank',
  'UBA', 'Stanbic IBTC', 'Polaris Bank', 'Wema Bank',
  'Fidelity Bank', 'Union Bank', 'FCMB', 'Keystone Bank',
]

const bankName = ref(store.bankName)
const accountNumber = ref(store.accountNumber)
const accountName = ref(store.accountName)
const isVerifying = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

// Simulate account name lookup after 10-digit entry
watch(accountNumber, async (val) => {
  if (val.length === 10 && bankName.value) {
    isVerifying.value = true
    accountName.value = ''
    await new Promise(r => setTimeout(r, 1500))
    // Simulate fetched account name
    accountName.value = 'JOHN ADEWALE SMITH'
    isVerifying.value = false
    store.accountName = accountName.value
  } else {
    accountName.value = ''
    store.accountName = ''
  }
})

watch(bankName, () => {
  if (accountNumber.value.length === 10) {
    accountNumber.value = ''
    accountName.value = ''
  }
})

const canProceed = computed(() =>
  bankName.value && accountNumber.value.length === 10 && accountName.value.length > 0,
)

async function proceed() {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const res = await applyLoan({
      requestedAmount: store.selectedAmount,
      requestedTenor: store.selectedTenor,
      purpose: 'PERSONAL', // Defaulting for now
    })
    store.bankName = bankName.value
    store.accountNumber = accountNumber.value
    store.accountName = accountName.value
    store.applicationReference = res.data.referenceId
    store.nextStep()
  } catch (err: any) {
    console.error('Submission failed:', err)
    errorMessage.value = err.response?.data?.message || 'Failed to submit application. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
function goBack() { store.prevStep() }
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Disbursement Account</h2>
    <p class="text-sm text-slate-500 mb-6">Enter the bank account where your loan should be sent.</p>

    <!-- Bank select -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-slate-700 mb-1.5">Bank Name</label>
      <select
        v-model="bankName"
        class="w-full rounded-xl border border-input-border bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      >
        <option value="" disabled>Select your bank</option>
        <option v-for="bank in BANKS" :key="bank" :value="bank">{{ bank }}</option>
      </select>
    </div>

    <!-- Account number -->
    <div class="mb-4">
      <AppTextInput
        v-model="accountNumber"
        id="accountNumber"
        label="Account Number"
        placeholder="0000000000"
        type="text"
        :hint="accountNumber.length > 0 ? `${accountNumber.length}/10 digits` : undefined"
        @input="(e: Event) => {
          const val = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10)
          accountNumber = val
        }"
      />
    </div>

    <!-- Account name verification -->
    <div v-if="isVerifying" class="flex items-center gap-2 text-sm text-slate-500 mb-4">
      <Loader2 class="w-4 h-4 animate-spin text-primary" />
      Verifying account...
    </div>
    <div v-else-if="accountName" class="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
      <CheckCircle2 class="w-4.5 h-4.5 text-green-600 shrink-0" />
      <div>
        <p class="text-xs text-green-600">Account verified</p>
        <p class="text-sm font-bold text-green-800">{{ accountName }}</p>
      </div>
    </div>

    <!-- Confirmation -->
    <div v-if="canProceed" class="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5 text-sm overflow-hidden">
      <p class="font-semibold text-slate-600 mb-2 text-xs uppercase tracking-wider">Confirm Disbursement Details</p>
      <div class="space-y-1.5 text-sm">
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span class="text-slate-500">Bank</span>
          <span class="font-medium text-slate-800">{{ bankName }}</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span class="text-slate-500">Account Number</span>
          <span class="font-medium text-slate-800 font-mono">{{ accountNumber }}</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span class="text-slate-500">Account Name</span>
          <span class="font-medium text-slate-800">{{ accountName }}</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 pt-1.5 border-t border-slate-200">
          <span class="text-slate-500">Loan Amount</span>
          <span class="font-bold text-primary">
            {{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(store.selectedAmount) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="errorMessage" class="text-xs text-red-500 mb-4">{{ errorMessage }}</p>

    <div class="flex justify-between">
      <button
        class="text-sm text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
        :disabled="isSubmitting"
        @click="goBack"
      >
        Back
      </button>
      <BaseButton variant="primary" size="lg" :disabled="!canProceed" :isLoading="isSubmitting" @click="proceed">
        Confirm &amp; Submit
      </BaseButton>
    </div>
  </div>
</template>
