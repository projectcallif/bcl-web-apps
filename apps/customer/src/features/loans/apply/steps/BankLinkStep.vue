<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton } from '@bcl/ui'
import { CheckCircle2, Loader2, Building2 } from 'lucide-vue-next'
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
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Link Your Bank Account</h2>
    <p class="text-sm text-slate-500 mb-6">
      We use Mono to securely verify your income and account activity. Your credentials are never stored.
    </p>

    <!-- Mono branding -->
    <div class="flex items-center gap-3 bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 mb-6">
      <div class="w-8 h-8 rounded-lg bg-[#1a56db] flex items-center justify-center text-white font-bold text-xs shrink-0">M</div>
      <div>
        <p class="text-sm font-semibold text-slate-700">Powered by Mono</p>
        <p class="text-xs text-slate-400">Bank-grade 256-bit encryption · Read-only access</p>
      </div>
    </div>

    <!-- Connected state -->
    <div v-if="connected" class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4 mb-6">
      <CheckCircle2 class="w-5 h-5 text-green-600 shrink-0" />
      <div>
        <p class="text-sm font-semibold text-green-800">{{ store.linkedBankName }} connected</p>
        <p class="text-xs text-green-600 mt-0.5">Account verified successfully</p>
      </div>
    </div>

    <!-- Bank selection -->
    <div v-else>
      <p class="text-sm font-semibold text-slate-700 mb-3">Select your bank</p>
      <div class="grid grid-cols-2 gap-2 mb-5">
        <button
          v-for="bank in BANKS"
          :key="bank"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all"
          :class="selectedBank === bank
            ? 'border-primary bg-primary-50 text-primary'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
          @click="selectedBank = bank"
        >
          <Building2 class="w-4 h-4 shrink-0" />
          {{ bank }}
        </button>
      </div>

      <BaseButton
        variant="primary"
        size="lg"
        :disabled="!selectedBank || isConnecting"
        class="w-full"
        @click="connectBank"
      >
        <template v-if="isConnecting">
          <Loader2 class="w-4 h-4 animate-spin mr-2 inline" />
          Connecting to {{ selectedBank }}...
        </template>
        <template v-else>
          Connect {{ selectedBank || 'Bank Account' }}
        </template>
      </BaseButton>
    </div>

    <div class="flex justify-between mt-5">
      <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="goBack">
        Back
      </button>
      <BaseButton v-if="connected" variant="primary" size="lg" @click="proceed">
        Continue
      </BaseButton>
    </div>
  </div>
</template>
