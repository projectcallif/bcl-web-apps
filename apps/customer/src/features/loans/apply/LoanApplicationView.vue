<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { X, Check } from 'lucide-vue-next'
import { useLoanApplicationStore } from './store'
import TermsStep from './steps/TermsStep.vue'
import BankLinkStep from './steps/BankLinkStep.vue'
import EligibilityStep from './steps/EligibilityStep.vue'
import LoanAmountStep from './steps/LoanAmountStep.vue'
import ScheduleStep from './steps/ScheduleStep.vue'
import SignTermsStep from './steps/SignTermsStep.vue'
import BankDetailsStep from './steps/BankDetailsStep.vue'
import ProcessingStep from './steps/ProcessingStep.vue'

const store = useLoanApplicationStore()
const router = useRouter()

const STEPS = [
  { label: 'Terms', component: TermsStep },
  { label: 'Bank Link', component: BankLinkStep },
  { label: 'Amount', component: LoanAmountStep },
  { label: 'Eligibility', component: EligibilityStep },
  { label: 'Schedule', component: ScheduleStep },
  { label: 'Sign', component: SignTermsStep },
  { label: 'Bank', component: BankDetailsStep },
  { label: 'Done', component: ProcessingStep },
] as const

const isLastStep = computed(() => store.currentStep === STEPS.length - 1)
const currentStepComponent = computed(() => STEPS[store.currentStep]!.component)

async function handleCancel() {
  store.reset()
  await router.push({ name: 'loans' })
}

function stepCircleClass(index: number): string {
  if (index < store.currentStep) return 'ring-2 ring-primary bg-primary text-white'
  if (index === store.currentStep) return 'ring-2 ring-primary bg-white text-primary'
  return 'ring-2 ring-slate-200 bg-white text-slate-400'
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header (hidden on final step) -->
    <div v-if="!isLastStep" class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Apply for a Loan</h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Step {{ store.currentStep + 1 }} of {{ STEPS.length - 1 }}
        </p>
      </div>
      <button
        class="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
        @click="handleCancel"
      >
        <X class="w-4 h-4" />
        Cancel
      </button>
    </div>

    <!-- Step progress (hidden on final step) -->
    <div v-if="!isLastStep" class="flex items-start mb-8">
      <template v-for="(step, index) in STEPS.slice(0, -1)" :key="index">
        <div class="flex flex-col items-center" style="flex: 1; min-width: 0">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            :class="stepCircleClass(index)"
          >
            <Check v-if="index < store.currentStep" class="w-3.5 h-3.5" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            class="text-[10px] mt-1 text-center leading-tight truncate w-full px-0.5"
            :class="index <= store.currentStep ? 'text-slate-600' : 'text-slate-300'"
            >{{ step.label }}</span
          >
        </div>
        <div
          v-if="index < STEPS.length - 2"
          class="h-px mt-3.5 transition-colors"
          style="flex: 0.8; max-width: 2rem"
          :class="index < store.currentStep ? 'bg-primary' : 'bg-slate-200'"
        />
      </template>
    </div>

    <!-- Step content -->
    <component :is="currentStepComponent" />
  </div>
</template>
