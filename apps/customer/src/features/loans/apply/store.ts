import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoanEligibility, LoanSchedule, LoanPreview } from '@bcl/types'

export const useLoanApplicationStore = defineStore('loanApplication', () => {
  const currentStep = ref(0)

  // Step 1 — Terms
  const termsAccepted = ref(false)

  // Step 2 — Bank Link
  const bankLinked = ref(false)
  const linkedBankName = ref('')

  // Step 3 — Eligibility
  const eligibility = ref<LoanEligibility | null>(null)

  // Step 4 — Loan Amount Selection
  const selectedAmount = ref(0)
  const selectedTenor = ref(0)

  // Step 5 — Schedule (Preview Result)
  const previewSchedule = ref<LoanSchedule | null>(null)
  
  // Step 7 — Final Preview/Bank Details
  const previewData = ref<LoanPreview | null>(null)

  // Step 6 — Sign Terms
  const signatureName = ref('')
  const agreementSigned = ref(false)

  // Step 7/8 — Bank Details
  const bankName = ref('')
  const accountNumber = ref('')
  const accountName = ref('')

  // Step 9 — Result
  const applicationReference = ref('')

  // Computed properties from eligibility result or preview result
  const monthlyPayment = computed(() => 
    previewData.value?.monthlyPayment ?? 
    eligibility.value?.monthlyPaymentInNaira ?? 
    previewSchedule.value?.summary.monthlyPayment ?? 0
  )
  const totalRepayment = computed(() => 
    previewData.value?.totalRepayableAmount ?? 
    eligibility.value?.totalRepaymentAmountInNaira ?? 
    previewSchedule.value?.summary.totalAmountToRepay ?? 0
  )
  const totalInterest = computed(() => {
    if (previewData.value) return previewData.value.totalInterest
    if (eligibility.value?.totalRepaymentAmountInNaira && selectedAmount.value) {
      return eligibility.value.totalRepaymentAmountInNaira - selectedAmount.value
    }
    return previewSchedule.value?.summary.totalInterest ?? 0
  })

  function nextStep(): void {
    currentStep.value = currentStep.value + 1
  }
  function prevStep(): void {
    if (currentStep.value > 0) currentStep.value = currentStep.value - 1
  }

  function reset(): void {
    currentStep.value = 0
    termsAccepted.value = false
    bankLinked.value = false
    linkedBankName.value = ''
    eligibility.value = null
    selectedAmount.value = 0
    selectedTenor.value = 0
    previewSchedule.value = null
    previewData.value = null
    signatureName.value = ''
    agreementSigned.value = false
    bankName.value = ''
    accountNumber.value = ''
    accountName.value = ''
    applicationReference.value = ''
  }

  return {
    currentStep,
    termsAccepted,
    bankLinked,
    linkedBankName,
    eligibility,
    selectedAmount,
    selectedTenor,
    previewSchedule,
    previewData,
    signatureName,
    agreementSigned,
    bankName,
    accountNumber,
    accountName,
    applicationReference,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    nextStep,
    prevStep,
    reset,
  }
})
