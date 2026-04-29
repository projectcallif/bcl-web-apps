<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { BaseButton } from '@bcl/ui'
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { getMandateStatus } from '../../api'
import type { ApiClientError } from '@bcl/types'

const store = useLoanApplicationStore()
const router = useRouter()
const isPolling = ref(false)
const pollError = ref('')

async function pollMandate() {
  if (!store.applicationResult?.id || store.applicationResult.mandateSetup.status === 'APPROVED')
    return

  isPolling.value = true
  try {
    const res = await getMandateStatus(store.applicationResult.id)
    store.applicationResult.mandateSetup = res.data

    if (res.data.status === 'APPROVED') {
      isPolling.value = false
    } else {
      setTimeout(pollMandate, 4000)
    }
  } catch (err) {
    const error = err as ApiClientError
    console.error('Mandate poll failed:', error)
    pollError.value = error.message || 'We encountered an error while verifying your authorization.'
    isPolling.value = false
  }
}

onMounted(() => {
  if (store.applicationResult?.mandateSetup?.status !== 'APPROVED') {
    pollMandate()
  }
})

function authorizeMandate() {
  if (store.applicationResult?.mandateSetup?.monoUrl) {
    window.open(store.applicationResult.mandateSetup.monoUrl, '_blank')
  }
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}

function finish() {
  store.reset()
  router.push({ name: 'loans' })
}

onUnmounted(() => {
  isPolling.value = false
})
</script>

<template>
  <div class="space-y-8 py-4">
    <!-- Success / Approved State -->
    <div
      v-if="store.applicationResult?.mandateSetup?.status === 'APPROVED'"
      class="flex flex-col items-center text-center animate-in zoom-in duration-500"
    >
      <div class="relative mb-8">
        <div
          class="w-32 h-32 rounded-full border-8 border-emerald-50 flex items-center justify-center"
        >
          <div
            class="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
          >
            <CheckCircle2 class="w-10 h-10 text-white" />
          </div>
        </div>
        <div
          class="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-20"
        />
      </div>

      <h2 class="text-2xl font-black text-slate-800 mb-2">Disbursement Initialized!</h2>
      <p class="text-slate-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">
        Congratulations! Your loan has been approved and the funds are on their way to your verified
        bank account.
      </p>

      <div class="w-full bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10">
        <div class="grid grid-cols-2 gap-8 mb-8">
          <div class="text-left">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Loan Amount
            </p>
            <p class="text-xl font-black text-slate-800">
              {{ formatCurrency(store.selectedAmount) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Arrival Time
            </p>
            <p class="text-lg font-bold text-emerald-600">~ 2-4 Hours</p>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-200 flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary font-black shadow-sm"
          >
            {{ store.bankName?.substring(0, 2).toUpperCase() || 'BK' }}
          </div>
          <div class="text-left">
            <p class="text-sm font-bold text-slate-800">{{ store.bankName }}</p>
            <p class="text-xs text-slate-400 font-medium">
              {{ store.accountNumber }} • {{ store.accountName }}
            </p>
          </div>
        </div>
      </div>

      <BaseButton
        variant="primary"
        size="lg"
        @click="finish"
        class="w-full sm:w-auto px-16 shadow-xl shadow-primary/20"
      >
        View My Loans
      </BaseButton>
    </div>

    <!-- Pending / Authorization State -->
    <div v-else class="flex flex-col items-center text-center">
      <div class="relative mb-10">
        <div
          class="w-32 h-32 rounded-full border-8 border-indigo-50 flex items-center justify-center"
        >
          <Loader2 class="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>

      <h2 class="text-2xl font-black text-slate-800 mb-3">Authorization Required</h2>
      <p class="text-slate-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">
        To complete your disbursement, please authorize the direct-debit mandate via Mono. This
        ensures smooth automated repayments.
      </p>

      <div class="w-full bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10 space-y-6">
        <div
          class="flex items-center gap-4 text-left p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <ShieldCheck class="w-5 h-5 text-primary" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-800">Secure Authorization</p>
            <p class="text-[10px] text-slate-400 font-medium">
              You will be redirected to Mono's secure portal.
            </p>
          </div>
        </div>

        <BaseButton
          variant="primary"
          size="lg"
          class="w-full shadow-lg shadow-primary/20"
          @click="authorizeMandate"
        >
          <ExternalLink class="w-4 h-4 mr-2" />
          Open Mono Portal
        </BaseButton>
      </div>

      <div
        v-if="pollError"
        class="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl text-left"
      >
        <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <p class="text-xs text-rose-700 font-medium">{{ pollError }}</p>
      </div>

      <div class="flex items-center gap-2 text-slate-400">
        <Loader2 class="w-3 h-3 animate-spin" />
        <p class="text-[10px] font-bold uppercase tracking-widest">
          Waiting for mandate approval...
        </p>
      </div>
    </div>
  </div>
</template>
