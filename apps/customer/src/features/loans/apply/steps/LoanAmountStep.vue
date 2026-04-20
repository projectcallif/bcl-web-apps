<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { BaseButton } from '@bcl/ui'
import { Loader2 } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { getDefaultLoanProduct, checkEligibility } from '../../api'
import type { LoanProduct } from '@bcl/types'

const store = useLoanApplicationStore()

const isFetchingEligibility = ref(true)
const product = ref<LoanProduct | null>(null)

const amount = ref(store.selectedAmount || 10000)
const selectedTenor = ref(store.selectedTenor || 1)
const isPreviewing = ref(false)

async function updatePreview() {
  if (!amount.value || !selectedTenor.value) return
  isPreviewing.value = true
  try {
    const res = await checkEligibility({
      principal: amount.value,
      tenor: selectedTenor.value,
    })
    store.eligibility = res.data
  } catch (err) {
    console.error('Check failed:', err)
  } finally {
    isPreviewing.value = false
  }
}

watch([amount, selectedTenor], () => {
  store.selectedAmount = amount.value
  store.selectedTenor = selectedTenor.value
  updatePreview()
})

onMounted(async () => {
  try {
    // 1. Get default product configuration
    const prodRes = await getDefaultLoanProduct()
    const productData = prodRes.data
    product.value = productData
    
    // 2. Initiate eligibility check
    const res = await checkEligibility()
    const eligibilityData = res.data
    store.eligibility = eligibilityData

    if (!productData || !eligibilityData) {
      throw new Error('Required configuration data missing')
    }

    // Initial values & Parsing
    const minAmt = parseFloat(productData.minAmount as string) || 10000
    const maxAmt = parseFloat(productData.maxAmount as string) || 500000

    if (!store.selectedAmount) {
      amount.value = eligibilityData.eligibleAmountInNaira || minAmt
      store.selectedAmount = amount.value
    }
    
    if (!store.selectedTenor) {
      const firstTenor = productData.tenors && productData.tenors.length > 0 ? productData.tenors[0] : null
      if (firstTenor) {
        selectedTenor.value = firstTenor.tenorValue
      } else {
        selectedTenor.value = productData.minTenor || 1
      }
      store.selectedTenor = selectedTenor.value
    }
    
    // 3. Initial preview with defaults
    await updatePreview()
  } catch (err) {
    console.error('Initialization failed:', err)
  } finally {
    isFetchingEligibility.value = false
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
    <h2 class="text-lg font-bold text-slate-800 mb-1">Select Loan Amount &amp; Tenor</h2>
    <p class="text-sm text-slate-500 mb-6">
      Choose how much you need and your preferred repayment period.
    </p>

    <!-- Loading state -->
    <div v-if="isFetchingEligibility" class="flex flex-col items-center py-12">
      <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
      <p class="text-slate-500 animate-pulse">Initializing options...</p>
    </div>

    <template v-else-if="product">
      <!-- Amount display -->
      <div class="text-center mb-6">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Loan Amount</p>
        <p class="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
          {{ formatCurrency(amount) }}
        </p>
      </div>

      <!-- Amount Slider -->
      <div class="mb-6">
        <input
          v-model.number="amount"
          type="range"
          :min="parseFloat(product.minAmount as string)"
          :max="parseFloat(product.maxAmount as string)"
          :step="1000"
          class="w-full h-2 rounded-full accent-primary cursor-pointer"
        />
        <div class="flex justify-between text-xs text-slate-400 mt-2">
          <span>{{ formatCurrency(parseFloat(product.minAmount as string)) }}</span>
          <span>{{ formatCurrency(parseFloat(product.maxAmount as string)) }}</span>
        </div>
      </div>

      <!-- Tenor selection -->
      <div class="mb-6">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Repayment Tenor
        </p>
        
        <!-- Fixed Tenors (Pills) -->
        <div v-if="product.tenors.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="t in product.tenors"
            :key="t.id"
            class="flex flex-col items-center px-3 py-3 rounded-xl border text-sm font-medium transition-all"
            :class="
              selectedTenor === t.tenorValue
                ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
                : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50'
            "
            @click="selectedTenor = t.tenorValue"
          >
            <span class="font-bold">{{ t.tenorValue }} months</span>
          </button>
        </div>

        <!-- Fallback Tenors (Slider) -->
        <div v-else class="px-1">
          <div class="flex items-center justify-between mb-3">
             <span class="text-lg font-bold text-slate-700">{{ selectedTenor }} months</span>
             <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Duration</span>
          </div>
          <input
            v-model.number="selectedTenor"
            type="range"
            :min="product.minTenor"
            :max="product.maxTenor"
            step="1"
            class="w-full h-2 rounded-full accent-primary cursor-pointer"
          />
          <div class="flex justify-between text-xs text-slate-400 mt-2">
            <span>{{ product.minTenor }} Mo.</span>
            <span>{{ product.maxTenor }} Mo.</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Summary -->
    <div class="relative bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6 min-h-25 flex flex-col justify-center">
      <div v-if="isPreviewing" class="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
        <Loader2 class="w-5 h-5 text-primary animate-spin" />
      </div>

      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Estimated Summary</p>
      <div v-if="store.eligibility && store.eligibility.status === 'COMPLETED'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="text-center sm:text-left">
          <p class="text-xs text-slate-400 mb-1">Monthly Payment</p>
          <p class="text-base font-bold text-primary">{{ formatCurrency(store.monthlyPayment) }}</p>
        </div>
        <div class="text-center border-y sm:border-y-0 sm:border-x border-slate-200 py-3 sm:py-0">
          <p class="text-xs text-slate-400 mb-1">Total Interest</p>
          <p class="text-base font-bold text-secondary">{{ formatCurrency(store.totalInterest) }}</p>
        </div>
        <div class="text-center sm:text-right">
          <p class="text-xs text-slate-400 mb-1">Total Repayment</p>
          <p class="text-base font-bold text-slate-800">{{ formatCurrency(store.totalRepayment) }}</p>
        </div>
      </div>
      <div v-else class="text-center py-2">
        <p class="text-sm text-slate-400 italic">Select amount and tenor to see summary</p>
      </div>
    </div>

    <div class="flex justify-between">
      <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="goBack">
        Back
      </button>
      <BaseButton variant="primary" size="lg" :disabled="isPreviewing || !store.previewSchedule" @click="proceed">
        View Detailed Schedule
      </BaseButton>
    </div>
  </div>
</template>
