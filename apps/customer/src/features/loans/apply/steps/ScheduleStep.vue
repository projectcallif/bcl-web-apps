<script setup lang="ts">
import { BaseButton } from '@bcl/ui'
import RepaymentScheduleTable from '../../components/RepaymentScheduleTable.vue'
import { useLoanApplicationStore } from '../store'

const store = useLoanApplicationStore()

function proceed() {
  store.nextStep()
}
function goBack() {
  store.prevStep()
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Repayment Schedule</h2>
    <p class="text-sm text-slate-500 mb-6">
      Here is your projected repayment plan for a
      <span class="font-semibold text-slate-700">
        {{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(store.selectedAmount) }}
      </span>
      loan over
      <span class="font-semibold text-slate-700">{{ store.selectedTenor }} months</span>.
    </p>

    <RepaymentScheduleTable
      v-if="store.previewSchedule"
      :items="store.previewSchedule.installments"
      loan-reference="PREVIEW"
    />

    <div class="flex justify-between mt-6">
      <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors" @click="goBack">Back</button>
      <BaseButton variant="primary" size="lg" @click="proceed">Continue</BaseButton>
    </div>
  </div>
</template>
