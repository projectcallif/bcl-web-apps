export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'CLOSED'

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
