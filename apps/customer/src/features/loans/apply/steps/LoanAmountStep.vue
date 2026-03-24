<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BaseButton } from '@bcl/ui'
import { useLoanApplicationStore } from '../store'

const store = useLoanApplicationStore()

const eligibility = store.eligibility!
const amount = ref(store.selectedAmount || eligibility.minAmount)
const selectedTenor = ref(store.selectedTenorMonths || eligibility.availableTenors[0].months)

const currentTenor = computed(() =>
  eligibility.availableTenors.find(t => t.months === selectedTenor.value) ?? eligibility.availableTenors[0],
)

const monthlyInterest = computed(() =>
  amount.value * (currentTenor.value.interestRatePerMonth / 100),
)
const totalInterest = computed(() =>
  monthlyInterest.value * selectedTenor.value,
)
const totalRepayment = computed(() => amount.value + totalInterest.value)
const monthlyPayment = computed(() => Math.ceil(totalRepayment.value / selectedTenor.value))

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

const sliderPercent = computed(() =>
  ((amount.value - eligibility.minAmount) / (eligibility.maxAmount - eligibility.minAmount)) * 100,
)

watch([amount, selectedTenor], () => {
  store.selectedAmount = amount.value
  store.selectedTenorMonths = selectedTenor.value
  store.selectedInterestRatePerMonth = currentTenor.value.interestRatePerMonth
})

function proceed() {
  store.selectedAmount = amount.value
  store.selectedTenorMonths = selectedTenor.value
  store.selectedInterestRatePerMonth = currentTenor.value.interestRatePerMonth
  store.nextStep()
}
function goBack() { store.prevStep() }
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Select Loan Amount &amp; Tenor</h2>
    <p class="text-sm text-slate-500 mb-6">Choose how much you need and your preferred repayment period.</p>

    <!-- Amount display -->
    <div class="text-center mb-6">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Loan Amount</p>
      <p class="text-5xl font-bold text-primary tracking-tight">{{ formatCurrency(amount) }}</p>
    </div>

    <!-- Slider -->
    <div class="mb-6">
      <input
        v-model.number="amount"
        type="range"
        :min="eligibility.minAmount"
        :max="eligibility.maxAmount"
        :step="10_000"
        class="w-full h-2 rounded-full accent-primary cursor-pointer"
      />
      <div class="flex justify-between text-xs text-slate-400 mt-2">
        <span>{{ formatCurrency(eligibility.minAmount) }}</span>
        <span>{{ formatCurrency(eligibility.maxAmount) }}</span>
      </div>
    </div>

    <!-- Tenor pills -->
    <div class="mb-6">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Repayment Tenor</p>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="tenor in eligibility.availableTenors"
          :key="tenor.months"
          class="flex flex-col items-center px-3 py-3 rounded-xl border text-sm font-medium transition-all"
          :class="selectedTenor === tenor.months
            ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
            : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50'"
          @click="selectedTenor = tenor.months"
        >
          <span class="font-bold">{{ tenor.months }} months</span>
          <span class="text-xs mt-0.5 opacity-75">{{ tenor.interestRatePerMonth }}% p.m.</span>
        </button>
      </div>
    </div>

    <!-- Summary -->
    <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Loan Summary</p>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <p class="text-xs text-slate-400 mb-1">Monthly Payment</p>
          <p class="text-base font-bold text-primary">{{ formatCurrency(monthlyPayment) }}</p>
        </div>
        <div class="text-center border-x border-slate-200">
          <p class="text-xs text-slate-400 mb-1">Total Interest</p>
          <p class="text-base font-bold text-secondary">{{ formatCurrency(totalInterest) }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs text-slate-400 mb-1">Total Repayment</p>
          <p class="text-base font-bold text-slate-800">{{ formatCurrency(totalRepayment) }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="goBack">Back</button>
      <BaseButton variant="primary" size="lg" @click="proceed">View Repayment Schedule</BaseButton>
    </div>
  </div>
</template>
