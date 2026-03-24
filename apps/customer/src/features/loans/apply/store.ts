import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoanEligibility } from '@bcl/types'

export const useLoanApplicationStore = defineStore('loanApplication', () => {
  const currentStep = ref(0)

  // Step 1 — Terms
  const termsAccepted = ref(false)

  // Step 2 — Bank Link
  const bankLinked = ref(false)
  const linkedBankName = ref('')

  // Step 3 — Eligibility
  const eligibility = ref<LoanEligibility | null>(null)

  // Step 4 — Loan Amount
  const selectedAmount = ref(0)
  const selectedTenorMonths = ref(0)
  const selectedInterestRatePerMonth = ref(0)

  // Step 6 — Sign Terms
  const signatureName = ref('')
  const agreementSigned = ref(false)

  // Step 7 — Bank Details
  const bankName = ref('')
  const accountNumber = ref('')
  const accountName = ref('')

  // Step 8 — Result
  const applicationReference = ref('')

  const monthlyPayment = computed(() => {
    if (!selectedAmount.value || !selectedTenorMonths.value) return 0
    const totalInterest = selectedAmount.value * (selectedInterestRatePerMonth.value / 100) * selectedTenorMonths.value
    return Math.ceil((selectedAmount.value + totalInterest) / selectedTenorMonths.value)
  })

  const totalRepayment = computed(() => monthlyPayment.value * selectedTenorMonths.value)

  const totalInterest = computed(() => totalRepayment.value - selectedAmount.value)

  function nextStep(): void { console.log(currentStep.value); currentStep.value = currentStep.value + 1 }
  function prevStep(): void { if (currentStep.value > 0) currentStep.value = currentStep.value - 1 }

  function reset(): void {
    currentStep.value = 0
    termsAccepted.value = false
    bankLinked.value = false
    linkedBankName.value = ''
    eligibility.value = null
    selectedAmount.value = 0
    selectedTenorMonths.value = 0
    selectedInterestRatePerMonth.value = 0
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
    selectedTenorMonths,
    selectedInterestRatePerMonth,
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
