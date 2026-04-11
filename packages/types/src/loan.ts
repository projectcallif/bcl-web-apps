export type LoanStatus = 'PENDING' | 'REJECTED' | 'HALTED' | 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'CLOSED'

export type LoanType = 'PERSONAL' | 'BUSINESS' | 'EMERGENCY' | 'SALARY_ADVANCE'

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED'

export type InstallmentStatus = 'PAID' | 'UPCOMING' | 'OVERDUE'

export interface Loan {
  id: string
  loanNumber: string
  type: LoanType
  purpose?: string
  principal: number
  totalAmount: number
  amountPaid: number
  outstandingBalance: number
  nextRepaymentDate: string
  nextRepaymentAmount: number
  disbursedAt: string
  dueDate: string
  status: LoanStatus
  interestRate: number
  tenorMonths: number
}

export interface LoanPayment {
  id: string
  loanId: string
  amount: number
  paidAt: string
  reference: string
  status: PaymentStatus
}

export interface RepaymentScheduleItem {
  installmentNumber: number
  dueDate: string
  principal: number
  interest: number
  totalAmount: number
  balance: number
  status: InstallmentStatus
  paidAt?: string
}

export interface TenorOption {
  months: number
  interestRatePerMonth: number
}

export interface LoanEligibility {
  eligible: boolean
  maxAmount: number
  minAmount: number
  availableTenors: TenorOption[]
  reason?: string
}

export interface LoanStats {
  totalLoans: number
  activeLoans: number
  totalBorrowed: number
  totalOutstanding: number
}

export interface LoanRuleConfig {
  minAge: number
  maxAge: number
  requireBvn: boolean
  requireLocation: boolean
  requireVerifiedPhone: boolean
  requireGender: boolean
  requireDob: boolean
  requireUtilityBill: boolean
  requireEmploymentProof: boolean
}

export interface LoanApplication {
  id: string
  userId: string
  amountRequested: number
  tenorMonths: number
  purpose: string
  status: LoanStatus
  appliedAt: string
  rejectionReason?: string
}

export type TransactionType = 'DISBURSEMENT' | 'REPAYMENT'

export interface Transaction {
  id: string
  loanId: string
  loanNumber: string
  loanType: LoanType
  purpose?: string
  type: TransactionType
  amount: number
  date: string
  reference: string
  status: PaymentStatus
  description: string
}

export interface CollectionLog {
  id: string
  loanId: string
  officerId: string
  date: string
  note: string
  method: "CALL" | "EMAIL" | "SMS" | "OTHER"
}
