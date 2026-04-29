<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton } from '@bcl/ui'
import { CheckCircle2, Loader2, Building2, ShieldCheck, Lock, ExternalLink } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'

const store = useLoanApplicationStore()

const selectedBank = ref('')
const isConnecting = ref(false)
const connected = ref(store.bankLinked)

const BANKS = [
  'Access Bank', 'GTBank', 'First Bank', 'Zenith Bank',
  'UBA', 'Stanbic IBTC', 'Polaris Bank', 'Wema Bank',
  'Fidelity Bank', 'Union Bank',
]

async function connectBank() {
  if (!selectedBank.value) return
  isConnecting.value = true
  // Mocking Mono connection
  await new Promise(r => setTimeout(r, 2200))
  isConnecting.value = false
  connected.value = true
  store.bankLinked = true
  store.linkedBankName = selectedBank.value
}

function proceed() { store.nextStep() }
function goBack() { store.prevStep() }
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800">Bank Verification</h2>
          <p class="text-xs text-slate-500 font-medium">Link your primary income account securely.</p>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
             <ShieldCheck class="w-5 h-5 text-emerald-500" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-bold text-slate-800">Securely Powered by Mono</p>
            <p class="text-[11px] text-slate-400 font-medium leading-relaxed">
              We use bank-grade 256-bit encryption. We only request read-only access to verify your income patterns for loan eligibility. Your credentials are never stored.
            </p>
          </div>
        </div>
      </div>

      <!-- Connected State -->
      <div v-if="connected" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center gap-5 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl mb-8">
          <div class="w-14 h-14 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shadow-sm">
             <CheckCircle2 class="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p class="text-base font-black text-emerald-900">{{ store.linkedBankName }} Connected</p>
            <p class="text-xs text-emerald-700 font-medium opacity-80">Income verification data successfully retrieved.</p>
          </div>
        </div>

        <div class="flex items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-8">
          <Lock class="w-3.5 h-3.5 text-slate-400" />
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted Session</p>
        </div>
      </div>

      <!-- Bank selection -->
      <div v-else class="space-y-6">
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Select your primary bank</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="bank in BANKS"
              :key="bank"
              class="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 text-center"
              :class="selectedBank === bank
                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'"
              @click="selectedBank = bank"
            >
              <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-white transition-colors">
                <Building2 class="w-5 h-5 opacity-40" />
              </div>
              <span class="text-xs font-bold">{{ bank }}</span>
            </button>
          </div>
        </div>

        <BaseButton
          variant="primary"
          size="lg"
          :disabled="!selectedBank || isConnecting"
          class="w-full py-7 shadow-xl shadow-primary/20"
          @click="connectBank"
        >
          <template v-if="isConnecting">
            <Loader2 class="w-5 h-5 animate-spin mr-3 inline" />
            Establishing Secure Connection...
          </template>
          <template v-else>
            <ExternalLink class="w-4 h-4 mr-2" />
            Connect {{ selectedBank || 'Bank Account' }}
          </template>
        </BaseButton>
      </div>

      <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
        <button class="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors" @click="goBack">
          Back
        </button>
        <BaseButton v-if="connected" variant="primary" size="lg" @click="proceed" class="px-10">
          Continue to Assessment
        </BaseButton>
      </div>
    </div>
  </div>
</template>
