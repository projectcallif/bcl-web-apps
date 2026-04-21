<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { BaseButton } from '@bcl/ui'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { getDefaultLoanProduct, checkEligibility } from '../../api'
import type { ApiClientError, LoanProduct } from '@bcl/types'

const store = useLoanApplicationStore()

const isFetchingEligibility = ref(true)
const product = ref<LoanProduct | null>(null)

const amount = ref(store.selectedAmount || 10000)
const selectedTenor = ref(store.selectedTenor || 1)
const isPreviewing = ref(false)
const errorMessage = ref('')

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedUpdatePreview() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(updatePreview, 500)
}

async function updatePreview() {
  if (!amount.value || !selectedTenor.value) return
  isPreviewing.value = true
  errorMessage.value = ''
  try {
    const res = await checkEligibility({
      principal: amount.value,
      tenor: selectedTenor.value,
    })
    store.eligibility = res.data
    if (res.data.eligibleAmountInNaira === null) {
      errorMessage.value = 'Sorry, you are not eligible for a loan at this time.'
    }
  } catch (err) {
    const error = err as ApiClientError
    errorMessage.value = error.message || 'Unable to estimate loan details at this time.'
  } finally {
    isPreviewing.value = false
  }
}

const minAmount = computed(() => Math.max(1000, parseFloat(product.value?.minAmount as string || '10000')))
const maxAmount = computed(() => store.eligibility?.eligibleAmountInNaira ?? 0)

const smartAmounts = computed(() => {
  const min = minAmount.value
  const max = maxAmount.value
  if (!max || max <= min) return [min]
  
  const step = (max - min) / 3
  return [
    min,
    Math.round((min + step) / 1000) * 1000,
    Math.round((min + 2 * step) / 1000) * 1000,
    max
  ].filter((v, i, a) => a.indexOf(v) === i && v >= min && v <= max)
})

function selectAmount(val: number) {
  amount.value = val
}

function onCustomAmountBlur() {
  if (amount.value < minAmount.value) amount.value = minAmount.value
  if (amount.value > maxAmount.value) amount.value = maxAmount.value
}

watch([amount, selectedTenor], () => {
  store.selectedAmount = amount.value
  store.selectedTenor = selectedTenor.value
  debouncedUpdatePreview()
})

onMounted(async () => {
  try {
    // 1. Get default product configuration
    const prodRes = await getDefaultLoanProduct()
    const productData = prodRes.data
    product.value = productData

    // 2. Initiate eligibility check
    try {
      const res = await checkEligibility()
      const eligibilityData = res.data
      store.eligibility = eligibilityData

      if (!productData || !eligibilityData) {
        throw new Error('Required configuration data missing')
      }

      if (eligibilityData.eligibleAmountInNaira === null) {
        errorMessage.value = 'Sorry, you are not eligible for a loan at this time.'
        isFetchingEligibility.value = false
        return
      }

      // Initial values & Parsing
      const minAmt = parseFloat(productData.minAmount as string) || 10000

      if (!store.selectedAmount) {
        amount.value = eligibilityData.eligibleAmountInNaira || minAmt
        store.selectedAmount = amount.value
      }

      if (!store.selectedTenor) {
        const firstTenor =
          productData.tenors && productData.tenors.length > 0 ? productData.tenors[0] : null
        if (firstTenor) {
          selectedTenor.value = firstTenor.tenorValue
        } else {
          selectedTenor.value = productData.minTenor || 1
        }
        store.selectedTenor = selectedTenor.value
      }
    } catch (err) {
      const error = err as ApiClientError
      errorMessage.value = error.message || 'Unable to estimate loan details at this time.'
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
      <!-- Amount Selection Card -->
      <div class="relative bg-linear-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 mb-8 overflow-hidden shadow-xl shadow-blue-900/20">
        <!-- Decorative bg circle -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        
        <div class="relative z-10 text-center mb-8">
          <p class="text-xs font-bold text-blue-200/60 uppercase tracking-[0.2em] mb-2">Loan Amount</p>
          <p class="text-4xl sm:text-6xl font-black text-white tracking-tighter">
            {{ formatCurrency(amount) }}
          </p>
        </div>

        <!-- Sleek Slider -->
        <div class="relative z-10 px-2 mb-2">
          <input
            v-model.number="amount"
            type="range"
            :min="minAmount"
            :max="maxAmount"
            :step="1000"
            :disabled="!!errorMessage"
            class="w-full h-1.5 rounded-full bg-white/20 accent-white cursor-pointer disabled:opacity-50 appearance-none"
          />
          <div class="flex justify-between text-[10px] font-bold text-blue-100/40 mt-4 uppercase tracking-widest">
            <span>{{ formatCurrency(minAmount) }}</span>
            <span>{{ formatCurrency(maxAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Select -->
      <div class="mb-8 overflow-hidden">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Select</p>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="val in smartAmounts"
            :key="val"
            @click="selectAmount(val)"
            class="py-3 px-1 rounded-xl border text-xs font-bold transition-all duration-200"
            :class="amount === val 
              ? 'bg-indigo-900 border-indigo-900 text-white shadow-md shadow-indigo-900/20' 
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'"
          >
            ₦{{ val >= 1000 ? (val/1000).toFixed(0) + 'k' : val }}
          </button>
        </div>
      </div>

      <!-- Custom Amount Input -->
      <div class="mb-8">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Or enter a custom amount</p>
        <div class="relative group">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-indigo-600 transition-colors">₦</div>
          <input
            v-model.number="amount"
            type="number"
            placeholder="0.00"
            @blur="onCustomAmountBlur"
            class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-4 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
            :disabled="!!errorMessage"
          />
        </div>
      </div>

      <!-- Tenor selection -->
      <div class="mb-8">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Repayment Tenor</p>

        <!-- Fixed Tenors (Pills) -->
        <div v-if="product.tenors.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="t in product.tenors"
            :key="t.id"
            class="relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 group overflow-hidden"
            :class="selectedTenor === t.tenorValue
                ? 'border-indigo-900 bg-indigo-900 text-white shadow-lg shadow-indigo-900/20'
                : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            "
            @click="selectedTenor = t.tenorValue"
            :disabled="!!errorMessage"
          >
            <div 
              v-if="selectedTenor === t.tenorValue" 
              class="absolute -top-6 -right-6 w-12 h-12 bg-white/10 rounded-full" 
            />
            <span class="text-sm font-black">{{ t.tenorValue }} {{ t.tenorValue === 1 ? 'Month' : 'Months' }}</span>
            <span class="text-[10px] font-bold opacity-60 uppercase tracking-tighter mt-0.5">0% Interest</span>
          </button>
        </div>

        <!-- Fallback Tenors (Slider) -->
        <div v-else class="px-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-lg font-bold text-slate-700">{{ selectedTenor }} months</span>
            <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold"
              >Duration</span
            >
          </div>
          <input
            v-model.number="selectedTenor"
            type="range"
            :min="product.minTenor"
            :max="product.maxTenor"
            step="1"
            class="w-full h-2 rounded-full accent-primary cursor-pointer"
            :disabled="!!errorMessage"
          />
          <div class="flex justify-between text-xs text-slate-400 mt-2">
            <span>{{ product.minTenor }} Mo.</span>
            <span>{{ product.maxTenor }} Mo.</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl"
    >
      <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <p class="text-sm text-rose-700 font-medium">{{ errorMessage }}</p>
    </div>

    <!-- Summary -->
    <div
      v-if="!errorMessage"
      class="relative bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6 min-h-25 flex flex-col justify-center"
    >
      <div
        v-if="isPreviewing"
        class="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10"
      >
        <Loader2 class="w-5 h-5 text-primary animate-spin" />
      </div>

      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Estimated Summary
      </p>
      <div
        v-if="store.eligibility && store.eligibility.status === 'COMPLETED'"
        class="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div class="text-center sm:text-left">
          <p class="text-xs text-slate-400 mb-1">Monthly Payment</p>
          <p class="text-base font-bold text-primary">{{ formatCurrency(store.monthlyPayment) }}</p>
        </div>
        <div class="text-center border-y sm:border-y-0 sm:border-x border-slate-200 py-3 sm:py-0">
          <p class="text-xs text-slate-400 mb-1">Total Interest</p>
          <p class="text-base font-bold text-secondary">
            {{ formatCurrency(store.totalInterest) }}
          </p>
        </div>
        <div class="text-center sm:text-right">
          <p class="text-xs text-slate-400 mb-1">Total Repayment</p>
          <p class="text-base font-bold text-slate-800">
            {{ formatCurrency(store.totalRepayment) }}
          </p>
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
      <BaseButton
        variant="primary"
        size="lg"
        :disabled="isPreviewing || !store.eligibility || !!errorMessage"
        @click="proceed"
      >
        Check Eligibility
      </BaseButton>
    </div>
  </div>
</template>
