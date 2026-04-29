<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BaseButton } from '@bcl/ui'
import { Loader2, Info } from 'lucide-vue-next'
import RepaymentScheduleTable from '../../components/RepaymentScheduleTable.vue'
import { useLoanApplicationStore } from '../store'
import { getProjectedSchedule } from '../../api'
import type { ApiClientError } from '@bcl/types'

const store = useLoanApplicationStore()
const isLoading = ref(false)

async function fetchSchedule() {
  if (!store.eligibility?.id) return

  isLoading.value = true
  try {
    const res = await getProjectedSchedule({
      eligibilityId: store.eligibility.id,
      principal: store.selectedAmount,
      tenor: store.selectedTenor,
    })
    store.previewSchedule = res.data
  } catch (err) {
    const error = err as ApiClientError
    console.error('Failed to fetch schedule:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!store.previewSchedule) {
    fetchSchedule()
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
  <div class="space-y-6">
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-8"
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Repayment Schedule</h2>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Your monthly payment plan for this loan.
          </p>
        </div>
        <div
          class="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2"
        >
          <Info class="w-3.5 h-3.5 text-slate-400" />
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
            >Estimated</span
          >
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
        <p class="text-slate-500 text-sm font-medium animate-pulse">Building your schedule...</p>
      </div>

      <template v-else-if="store.previewSchedule">
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Principal
            </p>
            <p class="text-sm font-bold text-slate-800">
              {{ formatCurrency(store.previewSchedule.summary.amountRequested) }}
            </p>
          </div>
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Interest
            </p>
            <p class="text-sm font-bold text-secondary">
              {{ formatCurrency(store.previewSchedule.summary.totalInterest) }}
            </p>
          </div>
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tenor</p>
            <p class="text-sm font-bold text-slate-800">
              {{ store.previewSchedule.summary.tenor }} Months
            </p>
          </div>
          <div class="p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p class="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Monthly</p>
            <p class="text-sm font-bold text-primary">
              {{ formatCurrency(store.previewSchedule.summary.monthlyPayment) }}
            </p>
          </div>
        </div>

        <!-- Schedule Table -->
        <div class="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden p-3">
          <RepaymentScheduleTable
            :items="store.previewSchedule.installments"
            loan-reference="PROJECTION"
          />
        </div>
      </template>

      <div v-else class="py-16 text-center">
        <div
          class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4"
        >
          <Info class="w-8 h-8 text-slate-200" />
        </div>
        <p class="text-sm text-slate-400 font-medium">Unable to generate schedule.</p>
        <BaseButton variant="ghost" class="mt-4 text-primary" @click="fetchSchedule"
          >Retry Calculation</BaseButton
        >
      </div>

      <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
        <button
          class="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          @click="goBack"
        >
          Back
        </button>
        <BaseButton
          variant="primary"
          size="lg"
          :disabled="!store.previewSchedule"
          @click="proceed"
          class="px-10 shadow-lg shadow-primary/20"
        >
          Sign Loan Terms
        </BaseButton>
      </div>
    </div>
  </div>
</template>
