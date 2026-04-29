import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { 
  LoanEligibility, 
  LoanSchedule, 
  LoanPreview, 
  LoanProduct, 
  LoanApplicationResult, 
  LoanMandate 
} from '@bcl/types'

export const useLoanApplicationStore = defineStore('loanApplication', () => {
  const currentStep = ref(0)

  // Step 1 — Products & Terms
  const products = ref<LoanProduct[]>([])
  const selectedProduct = ref<LoanProduct | null>(null)
  const termsAccepted = ref(false)

  // Prerequisite — Bank Link (handled before or during flow if needed)
  const bankLinked = ref(false)
  const linkedBankName = ref('')

  // Step 2 — Eligibility
  const eligibility = ref<LoanEligibility | null>(null)

  // Step 3 — Loan Amount Selection
  const selectedAmount = ref(0)
  const selectedTenor = ref(0)

  // Step 4 — Schedule (Preview Result)
  const previewSchedule = ref<LoanSchedule | null>(null)
  
  // Step 6 — Final Preview/Bank Details
  const previewData = ref<LoanPreview | null>(null)

  // Step 5 — Sign Terms
  const signatureName = ref('')
  const agreementSigned = ref(false)

  // Step 6 — Bank Details (for disbursement)
  const bankName = ref('')
  const accountNumber = ref('')
  const accountName = ref('')

  // Step 7 — Result & Mandate
  const applicationResult = ref<LoanApplicationResult | null>(null)
  const mandate = ref<LoanMandate | null>(null)
  const applicationReference = ref('')
  const purpose = ref('PERSONAL')

  // Computed properties
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
    products.value = []
    selectedProduct.value = null
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
    applicationResult.value = null
    mandate.value = null
    applicationReference.value = ''
    purpose.value = 'PERSONAL'
  }

  return {
    currentStep,
    products,
    selectedProduct,
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
    applicationResult,
    mandate,
    applicationReference,
    purpose,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    nextStep,
    prevStep,
    reset,
  }
})
