<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BaseButton, AppTextInput, BaseSkeleton } from '@bcl/ui'
import { Loader2, PenTool, CheckCircle2 } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { getLoanContract } from '../../api'
import { useAuthStore } from '@/features/auth/store'
import type { ApiClientError } from '@bcl/types'

const store = useLoanApplicationStore()
const authStore = useAuthStore()

const html = ref('')
const isLoading = ref(true)
const signatureName = ref(store.signatureName)
const agreed = ref(store.agreementSigned)

onMounted(async () => {
  try {
    const res = await getLoanContract()
    html.value = res.data.content
  } catch (err) {
    const error = err as ApiClientError
    console.error('Failed to fetch contract:', error)
  } finally {
    isLoading.value = false
  }
})

const fullName = computed(() =>
  [authStore.user?.profile.firstName, authStore.user?.profile.lastName].filter(Boolean).join(' ') || 'Your Full Name',
)

const canProceed = computed(() =>
  signatureName.value.trim().length >= 3 && agreed.value,
)

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

function proceed() {
  store.signatureName = signatureName.value
  store.agreementSigned = true
  store.nextStep()
}
function goBack() { store.prevStep() }
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <PenTool class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800">Sign Agreement</h2>
          <p class="text-xs text-slate-500 font-medium">Review and electronically sign your loan contract.</p>
        </div>
      </div>

      <!-- Agreement HTML View -->
      <div class="h-80 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden prose prose-slate prose-sm max-w-none mb-6 relative">
        <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-8 space-y-4">
          <BaseSkeleton height="1rem" width="100%" />
          <BaseSkeleton height="1rem" width="90%" />
          <BaseSkeleton height="1rem" width="95%" />
          <BaseSkeleton height="1rem" width="85%" />
          <Loader2 class="w-6 h-6 text-primary animate-spin mt-4" />
        </div>
        <iframe
          v-else
          :srcdoc="html || 'Contract content is being generated...'"
          class="w-full h-full border-0"
          title="Loan Contract"
        />
      </div>

      <!-- Summary Banner -->
      <div class="bg-primary-50 rounded-2xl p-5 border border-primary-100 mb-8">
        <div class="flex items-center gap-2 mb-4">
          <CheckCircle2 class="w-4 h-4 text-primary" />
          <p class="text-[10px] font-bold text-primary uppercase tracking-widest">Final Terms Confirmation</p>
        </div>
        <div class="grid grid-cols-3 gap-6">
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Loan Amount</p>
            <p class="text-sm font-bold text-slate-800">{{ formatCurrency(store.selectedAmount) }}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Total Repayment</p>
            <p class="text-sm font-bold text-slate-800">{{ formatCurrency(store.totalRepayment) }}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Monthly</p>
            <p class="text-sm font-bold text-primary">{{ formatCurrency(store.monthlyPayment) }}</p>
          </div>
        </div>
      </div>

      <!-- Signature Section -->
      <div class="space-y-6">
        <div class="relative group">
          <AppTextInput
            v-model="signatureName"
            id="signature"
            label="Electronic Signature"
            :placeholder="fullName"
            hint="Type your full name exactly as it appears on your profile."
            class="text-lg font-bold"
          />
        </div>

        <label class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer transition-all hover:bg-slate-50">
          <input 
            v-model="agreed" 
            type="checkbox" 
            class="mt-1 w-5 h-5 accent-primary rounded-lg cursor-pointer border-slate-200" 
          />
          <span class="text-xs text-slate-500 leading-relaxed font-medium">
            By checking this box, I acknowledge that I have read, understood, and voluntarily entered into this binding Loan Agreement with BCL Finance.
          </span>
        </label>
      </div>

      <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
        <button class="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors" @click="goBack">Back</button>
        <BaseButton 
          variant="primary" 
          size="lg" 
          :disabled="!canProceed || isLoading" 
          @click="proceed"
          class="px-10 shadow-lg shadow-primary/20"
        >
          Confirm Disbursement
        </BaseButton>
      </div>
    </div>
  </div>
</template>
