<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BaseButton, AppTextInput } from '@bcl/ui'
import { useLoanApplicationStore } from '../store'
import { getLoanAgreement } from '../../api'
import { useAuthStore } from '@/features/auth/store'

const store = useLoanApplicationStore()
const authStore = useAuthStore()

const html = ref('')
const signatureName = ref(store.signatureName)
const agreed = ref(store.agreementSigned)

onMounted(async () => {
  const res = await getLoanAgreement('1')
  html.value = res.data.html
})

const fullName = computed(() =>
  [authStore.user?.profile.firstName, authStore.user?.profile.lastName].filter(Boolean).join(' ') || 'Your Full Name',
)

const canProceed = computed(() =>
  signatureName.value.trim().length >= 3 && agreed.value,
)

function proceed() {
  store.signatureName = signatureName.value
  store.agreementSigned = true
  store.nextStep()
}
function goBack() { store.prevStep() }
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Sign Loan Agreement</h2>
    <p class="text-sm text-slate-500 mb-5">Review and sign your loan agreement to proceed.</p>

    <!-- Agreement HTML -->
    <div class="h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-5 prose prose-slate prose-sm max-w-none mb-6"
         v-html="html || 'Loading...'" />

    <!-- Loan summary in agreement context -->
    <div class="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-5 text-sm">
      <p class="font-semibold text-primary mb-2">Loan Details</p>
      <div class="grid grid-cols-3 gap-3 text-xs">
        <div>
          <p class="text-slate-500">Amount</p>
          <p class="font-semibold text-slate-800">
            {{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(store.selectedAmount) }}
          </p>
        </div>
        <div>
          <p class="text-slate-500">Tenor</p>
          <p class="font-semibold text-slate-800">{{ store.selectedTenorMonths }} months</p>
        </div>
        <div>
          <p class="text-slate-500">Monthly Payment</p>
          <p class="font-semibold text-slate-800">
            {{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(store.monthlyPayment) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Signature -->
    <div class="mb-4">
      <AppTextInput
        v-model="signatureName"
        id="signature"
        label="Type your full name as signature"
        :placeholder="fullName"
        hint="This acts as your electronic signature"
      />
    </div>

    <label class="flex items-start gap-3 cursor-pointer mb-6">
      <input v-model="agreed" type="checkbox" class="mt-0.5 w-4 h-4 accent-primary rounded cursor-pointer" />
      <span class="text-sm text-slate-600">
        I have read, understood, and agree to all the terms of this Loan Agreement.
      </span>
    </label>

    <div class="flex justify-between">
      <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="goBack">Back</button>
      <BaseButton variant="primary" size="lg" :disabled="!canProceed" @click="proceed">
        Sign &amp; Continue
      </BaseButton>
    </div>
  </div>
</template>
