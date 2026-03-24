export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'CLOSED'

export type LoanType = 'PERSONAL' | 'BUSINESS' | 'EMERGENCY' | 'SALARY_ADVANCE'

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED'

export interface Loan {
  id: string
  loanNumber: string
  type: LoanType
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
