<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BaseButton } from '@bcl/ui'
import { Loader2 } from 'lucide-vue-next'
import RepaymentScheduleTable from '../../components/RepaymentScheduleTable.vue'
import { useLoanApplicationStore } from '../store'
import { getProjectedSchedule } from '../../api'

const store = useLoanApplicationStore()
const isLoading = ref(true)

async function fetchSchedule() {
  if (!store.eligibility?.id) {
    isLoading.value = false
    return
  }

  try {
    const res = await getProjectedSchedule(store.eligibility.id)
    store.previewSchedule = res.data
  } catch (err) {
    console.error('Failed to fetch schedule:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSchedule()
})

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
        {{
          new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
          }).format(store.selectedAmount)
        }}
      </span>
      loan over
      <span class="font-semibold text-slate-700">{{ store.selectedTenor }} months</span>.
    </p>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
      <p class="text-slate-500 animate-pulse">Calculating your schedule...</p>
    </div>

    <template v-else>
      <RepaymentScheduleTable
        v-if="store.previewSchedule"
        :items="store.previewSchedule.installments"
        loan-reference="PREVIEW"
      />
      <div v-else class="py-12 text-center text-slate-400 italic">
        Unable to load schedule. Please try going back and checking eligibility again.
      </div>

      <div class="flex justify-between mt-6">
        <button
          class="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          @click="goBack"
        >
          Back
        </button>
        <BaseButton variant="primary" size="lg" :disabled="!store.previewSchedule" @click="proceed">
          Continue
        </BaseButton>
      </div>
    </template>
  </div>
</template>
