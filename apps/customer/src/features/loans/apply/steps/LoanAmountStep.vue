<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { BaseButton, BaseSkeleton } from '@bcl/ui'
import { Loader2, AlertCircle, Banknote, Calendar } from 'lucide-vue-next'
import { useLoanApplicationStore } from '../store'
import { getProjectedSchedule } from '../../api'
import type { ApiClientError } from '@bcl/types'

const store = useLoanApplicationStore()

const amount = ref(store.selectedAmount || 0)
const selectedTenor = ref(store.selectedTenor || 1)
const isPreviewing = ref(false)
const errorMessage = ref('')

const minAmount = computed(() => {
  const prodMin = store.selectedProduct
    ? parseFloat(store.selectedProduct.minAmount as string)
    : 10000
  return Math.max(1000, prodMin)
})

const maxAmount = computed(() => store.eligibility?.eligibleAmountInNaira ?? 100000)

const percentageOptions = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: 'Max', value: 1.0 },
]

function selectPercentage(percent: number) {
  const target = Math.round((maxAmount.value * percent) / 1000) * 1000
  amount.value = Math.max(minAmount.value, target)
}

async function updatePreview() {
  if (!amount.value || !selectedTenor.value || !store.eligibility?.id) return

  isPreviewing.value = true
  errorMessage.value = ''
  try {
    const res = await getProjectedSchedule({
      eligibilityId: store.eligibility.id,
      principal: amount.value,
      tenor: selectedTenor.value,
    })
    store.previewSchedule = res.data
  } catch (err) {
    const error = err as ApiClientError
    errorMessage.value = error.message || 'Unable to load repayment estimate.'
  } finally {
    isPreviewing.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedUpdatePreview() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(updatePreview, 400)
}

watch([amount, selectedTenor], () => {
  store.selectedAmount = amount.value
  store.selectedTenor = selectedTenor.value
  debouncedUpdatePreview()
})

onMounted(() => {
  if (!store.selectedAmount) {
    amount.value = maxAmount.value
  }

  if (!store.selectedTenor && store.selectedProduct) {
    if (store.selectedProduct.tenors?.length > 0) {
      selectedTenor.value = store?.selectedProduct?.tenors?.[0]?.tenorValue ?? 1
    } else {
      selectedTenor.value = store?.selectedProduct?.maxTenor || 1
    }
  }

  updatePreview()
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
  <div class="space-y-6">
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-8"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Banknote class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800">Loan Amount</h2>
          <p class="text-xs text-slate-500 font-medium">How much would you like to borrow?</p>
        </div>
      </div>

      <!-- Amount Selection Display -->
      <div class="bg-slate-50 rounded-3xl p-8 mb-8 text-center border border-slate-100">
        <div class="mb-2">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
            >Requested Amount</span
          >
        </div>
        <div class="flex items-center justify-center gap-2">
          <span class="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight">{{
            formatCurrency(amount)
          }}</span>
        </div>
      </div>

      <!-- Range Slider -->
      <div class="px-2 mb-8">
        <input
          v-model.number="amount"
          type="range"
          :min="minAmount"
          :max="maxAmount"
          :step="1000"
          class="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer accent-primary"
        />
        <div class="flex justify-between mt-3 px-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >Min: {{ formatCurrency(minAmount) }}</span
          >
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right"
            >Max: {{ formatCurrency(maxAmount) }}</span
          >
        </div>
      </div>

      <!-- Quick Select Buttons -->
      <div class="grid grid-cols-4 gap-3 mb-8">
        <button
          v-for="opt in percentageOptions"
          :key="opt.label"
          @click="selectPercentage(opt.value)"
          class="py-3.5 rounded-xl border-2 font-bold text-xs transition-all duration-200"
          :class="
            Math.abs(amount - maxAmount * opt.value) < 1000
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
          "
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Manual Input -->
      <div class="relative group mb-2">
        <div
          class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-primary transition-colors"
        >
          ₦
        </div>
        <input
          v-model.number="amount"
          type="number"
          class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-10 pr-4 font-bold text-slate-800 focus:outline-none focus:border-primary/50 transition-all text-lg"
          placeholder="Enter custom amount"
        />
      </div>
      <p class="text-[10px] text-slate-400 font-medium px-1 italic">
        * Enter any amount between the minimum and your maximum limit.
      </p>
    </div>

    <!-- Tenor Selection -->
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-8"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
          <Calendar class="w-5 h-5 text-tertiary" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800">Repayment Period</h2>
          <p class="text-xs text-slate-500 font-medium">Select your preferred duration.</p>
        </div>
      </div>

      <div
        v-if="store.selectedProduct?.tenors?.length"
        class="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        <button
          v-for="t in store.selectedProduct.tenors"
          :key="t.id"
          class="flex flex-col items-center py-5 rounded-2xl border-2 transition-all duration-200"
          :class="
            selectedTenor === t.tenorValue
              ? 'border-tertiary bg-tertiary/5 text-tertiary shadow-sm'
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
          "
          @click="selectedTenor = t.tenorValue"
        >
          <span class="text-lg font-bold">{{ t.tenorValue }}</span>
          <span class="text-[10px] font-bold uppercase tracking-widest opacity-60">Months</span>
        </button>
      </div>
      <div v-else class="px-2">
        <input
          v-model.number="selectedTenor"
          type="range"
          :min="store.selectedProduct?.minTenor || 1"
          :max="store.selectedProduct?.maxTenor || 12"
          step="1"
          class="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer accent-tertiary"
        />
        <div class="flex justify-between mt-3 px-1 text-[10px] font-bold text-slate-400 uppercase">
          <span>{{ store.selectedProduct?.minTenor || 1 }} Mo.</span>
          <span class="text-slate-700 text-sm font-bold">{{ selectedTenor }} Months</span>
          <span>{{ store.selectedProduct?.maxTenor || 12 }} Mo.</span>
        </div>
      </div>
    </div>

    <!-- Live Preview Card -->
    <div
      v-if="store.previewSchedule"
      class="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden relative"
    >
      <div
        v-if="isPreviewing"
        class="absolute inset-0 bg-indigo-900/40 backdrop-blur-[1px] flex items-center justify-center z-10"
      >
        <Loader2 class="w-6 h-6 animate-spin" />
      </div>

      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xs font-bold uppercase tracking-widest text-indigo-200/60">
          Estimated Repayment
        </h3>
        <span class="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold">Projected</span>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-[10px] font-bold text-indigo-200/40 uppercase mb-1">Monthly Payment</p>
          <p class="text-xl font-black">
            {{ formatCurrency(store.previewSchedule.summary.monthlyPayment) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-bold text-indigo-200/40 uppercase mb-1">Total Repayment</p>
          <p class="text-xl font-black">
            {{ formatCurrency(store.previewSchedule.summary.totalAmountToRepay) }}
          </p>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-white/10 flex justify-between items-end">
        <div>
          <p class="text-[10px] font-bold text-indigo-200/40 uppercase mb-0.5">Interest Rate</p>
          <p class="text-xs font-bold">
            {{ store.previewSchedule.summary.monthlyInterestRate }}% / month
          </p>
        </div>
        <p class="text-[9px] font-medium text-indigo-200/30 italic">
          Values are subject to final approval
        </p>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="flex items-start gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl"
    >
      <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <p class="text-xs text-rose-700 font-medium">{{ errorMessage }}</p>
    </div>

    <div class="flex justify-between items-center pt-4">
      <button
        class="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        @click="goBack"
      >
        Back
      </button>
      <BaseButton
        variant="primary"
        size="lg"
        :disabled="isPreviewing || !!errorMessage || amount < minAmount || amount > maxAmount"
        @click="proceed"
        class="px-10"
      >
        Review Schedule
      </BaseButton>
    </div>
  </div>
</template>
