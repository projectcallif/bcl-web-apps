import type {
  ApiResponse,
  PaginatedResponse,
  Loan,
  LoanStatus,
  RepaymentScheduleItem,
  LoanEligibility,
  LoanStats,
  Transaction,
  TransactionType,
} from '@bcl/types'

// ── Mock helper ───────────────────────────────────────────────────────────────

function mockOk<T>(data: T, delay = 350): Promise<ApiResponse<T>> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, statusCode: 200, message: 'Success', data }), delay),
  )
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_LOANS: Loan[] = [
  {
    id: '1',
    loanNumber: 'BCL-2026-0042',
    type: 'PERSONAL',
    purpose: 'Home Renovation',
    principal: 500_000,
    totalAmount: 560_000,
    amountPaid: 186_668,
    outstandingBalance: 373_332,
    nextRepaymentDate: '2026-04-15',
    nextRepaymentAmount: 46_667,
    disbursedAt: '2025-12-15',
    dueDate: '2026-12-15',
    status: 'ACTIVE',
    interestRate: 1,
    tenorMonths: 12,
  },
  {
    id: '2',
    loanNumber: 'BCL-2025-0028',
    type: 'BUSINESS',
    purpose: 'Working Capital',
    principal: 300_000,
    totalAmount: 318_000,
    amountPaid: 318_000,
    outstandingBalance: 0,
    nextRepaymentDate: '2025-10-15',
    nextRepaymentAmount: 53_000,
    disbursedAt: '2025-04-15',
    dueDate: '2025-10-15',
    status: 'COMPLETED',
    interestRate: 1,
    tenorMonths: 6,
  },
  {
    id: '3',
    loanNumber: 'BCL-2024-0015',
    type: 'EMERGENCY',
    purpose: 'Medical Bills',
    principal: 150_000,
    totalAmount: 154_500,
    amountPaid: 154_500,
    outstandingBalance: 0,
    nextRepaymentDate: '2024-12-01',
    nextRepaymentAmount: 51_500,
    disbursedAt: '2024-09-01',
    dueDate: '2024-12-01',
    status: 'CLOSED',
    interestRate: 1,
    tenorMonths: 3,
  },
  {
    id: '4',
    loanNumber: 'BCL-2023-0007',
    type: 'PERSONAL',
    purpose: 'Tuition Fees',
    principal: 200_000,
    totalAmount: 224_000,
    amountPaid: 37_334,
    outstandingBalance: 186_666,
    nextRepaymentDate: '2023-03-15',
    nextRepaymentAmount: 18_667,
    disbursedAt: '2023-01-15',
    dueDate: '2024-01-15',
    status: 'OVERDUE',
    interestRate: 1,
    tenorMonths: 12,
  },
]

function buildSchedule(loan: Loan): RepaymentScheduleItem[] {
  const monthlyInterest = Math.round(loan.principal * (loan.interestRate / 100))
  const monthlyPrincipal = Math.round(loan.principal / loan.tenorMonths)
  const monthlyTotal = monthlyPrincipal + monthlyInterest
  const paid = Math.round(loan.amountPaid / monthlyTotal)

  return Array.from({ length: loan.tenorMonths }, (_, i) => {
    const n = i + 1
    const date = new Date(loan.disbursedAt)
    date.setMonth(date.getMonth() + n)
    const balance = Math.max(0, loan.totalAmount - monthlyTotal * n)
    const isPast = new Date(date) < new Date() && loan.status === 'OVERDUE'
    return {
      installmentNumber: n,
      dueDate: date.toISOString().split('T')[0] || '',
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      totalAmount: monthlyTotal,
      balance,
      status: n <= paid ? 'PAID' : isPast ? 'OVERDUE' : 'UPCOMING',
      paidAt: n <= paid ? date.toISOString().split('T')[0] : undefined,
    }
  })
}

const LOAN_AGREEMENT_HTML = `
<h2>Loan Agreement</h2>
<p>This Loan Agreement ("<strong>Agreement</strong>") is entered into between <strong>BCL Finance Limited</strong> ("Lender") and the Customer ("Borrower") as identified in the BCL customer portal.</p>
<h3>1. Loan Details</h3>
<p>The Lender agrees to provide the Borrower with a loan ("Loan") subject to the terms and conditions set forth herein. The specific loan amount, tenor, and repayment schedule are detailed in Schedule A attached to this Agreement.</p>
<h3>2. Interest Rate</h3>
<p>Interest shall accrue on the outstanding principal balance at the rate specified in Schedule A, calculated on a monthly reducing balance basis.</p>
<h3>3. Repayment</h3>
<p>The Borrower agrees to repay the Loan in equal monthly installments as set out in the Repayment Schedule. Payments are due on the 15th of each calendar month unless otherwise specified.</p>
<h3>4. Prepayment</h3>
<p>The Borrower may prepay all or part of the outstanding Loan balance at any time without penalty. Prepayments will be applied first to accrued interest and then to outstanding principal.</p>
<h3>5. Default</h3>
<p>The Borrower shall be in default if: (a) any payment is not made within 7 days of its due date; (b) the Borrower provides false or misleading information; (c) the Borrower becomes insolvent.</p>
<h3>6. Governing Law</h3>
<p>This Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
`

const LOAN_TERMS_HTML = `
<h2>BCL Finance Terms & Conditions</h2>
<p><strong>Last Updated: January 2026</strong></p>
<h3>1. Eligibility</h3>
<p>To apply for a loan through BCL Finance, you must: be at least 18 years of age; be a Nigerian citizen or lawful permanent resident; have a verified BVN (Bank Verification Number); maintain an active bank account with a CBN-licensed institution.</p>
<h3>2. Loan Application</h3>
<p>By submitting a loan application, you authorize BCL Finance to verify your identity, review your credit history, and assess your repayment capacity. Loan approval is not guaranteed and is subject to our credit assessment criteria.</p>
<h3>3. Fees & Charges</h3>
<p>BCL Finance may charge an origination fee of up to 2% of the loan amount, deducted at disbursement. Late payment fees of ₦2,500 per missed installment may apply. No prepayment penalty is charged.</p>
<h3>4. Data Privacy</h3>
<p>Your personal and financial data will be processed in accordance with our Privacy Policy and applicable Nigerian data protection regulations (NDPR). We will not share your data with third parties without your consent, except as required by law.</p>
<h3>5. Dispute Resolution</h3>
<p>Any dispute arising from these terms shall first be subject to mediation. If unresolved, disputes shall be referred to the appropriate court of competent jurisdiction in Lagos, Nigeria.</p>
<h3>6. Amendments</h3>
<p>BCL Finance reserves the right to amend these Terms & Conditions at any time. You will be notified of material changes via email or in-app notification at least 14 days before changes take effect.</p>
`

// ── Mock transactions ─────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  // Loan 1 — BCL-2026-0042 PERSONAL (active, 4 repayments made)
  {
    id: 't1-dis',
    loanId: '1',
    loanNumber: 'BCL-2026-0042',
    loanType: 'PERSONAL',
    purpose: 'Home Renovation',
    type: 'DISBURSEMENT',
    amount: 500_000,
    date: '2025-12-15',
    reference: 'DIS-2025-0042',
    status: 'SUCCESS',
    description: 'Loan disbursement',
  },
  {
    id: 't1-r1',
    loanId: '1',
    loanNumber: 'BCL-2026-0042',
    loanType: 'PERSONAL',
    purpose: 'Home Renovation',
    type: 'REPAYMENT',
    amount: 46_667,
    date: '2026-01-15',
    reference: 'REP-2026-0042-01',
    status: 'SUCCESS',
    description: 'Installment 1 of 12',
  },
  {
    id: 't1-r2',
    loanId: '1',
    loanNumber: 'BCL-2026-0042',
    loanType: 'PERSONAL',
    purpose: 'Home Renovation',
    type: 'REPAYMENT',
    amount: 46_667,
    date: '2026-02-15',
    reference: 'REP-2026-0042-02',
    status: 'SUCCESS',
    description: 'Installment 2 of 12',
  },
  {
    id: 't1-r3',
    loanId: '1',
    loanNumber: 'BCL-2026-0042',
    loanType: 'PERSONAL',
    purpose: 'Home Renovation',
    type: 'REPAYMENT',
    amount: 46_667,
    date: '2026-03-15',
    reference: 'REP-2026-0042-03',
    status: 'SUCCESS',
    description: 'Installment 3 of 12',
  },
  {
    id: 't1-r4',
    loanId: '1',
    loanNumber: 'BCL-2026-0042',
    loanType: 'PERSONAL',
    purpose: 'Home Renovation',
    type: 'REPAYMENT',
    amount: 46_667,
    date: '2026-03-27',
    reference: 'REP-2026-0042-04',
    status: 'PENDING',
    description: 'Installment 4 of 12',
  },
  // Loan 2 — BCL-2025-0028 BUSINESS (completed, 6 repayments)
  {
    id: 't2-dis',
    loanId: '2',
    loanNumber: 'BCL-2025-0028',
    loanType: 'BUSINESS',
    purpose: 'Working Capital',
    type: 'DISBURSEMENT',
    amount: 300_000,
    date: '2025-04-15',
    reference: 'DIS-2025-0028',
    status: 'SUCCESS',
    description: 'Loan disbursement',
  },
  {
    id: 't2-r1',
    loanId: '2',
    loanNumber: 'BCL-2025-0028',
    loanType: 'BUSINESS',
    purpose: 'Working Capital',
    type: 'REPAYMENT',
    amount: 53_000,
    date: '2025-05-15',
    reference: 'REP-2025-0028-01',
    status: 'SUCCESS',
    description: 'Installment 1 of 6',
  },
  {
    id: 't2-r2',
    loanId: '2',
    loanNumber: 'BCL-2025-0028',
    loanType: 'BUSINESS',
    purpose: 'Working Capital',
    type: 'REPAYMENT',
    amount: 53_000,
    date: '2025-06-15',
    reference: 'REP-2025-0028-02',
    status: 'SUCCESS',
    description: 'Installment 2 of 6',
  },
  {
    id: 't2-r3',
    loanId: '2',
    loanNumber: 'BCL-2025-0028',
    loanType: 'BUSINESS',
    purpose: 'Working Capital',
    type: 'REPAYMENT',
    amount: 53_000,
    date: '2025-07-15',
    reference: 'REP-2025-0028-03',
    status: 'SUCCESS',
    description: 'Installment 3 of 6',
  },
  {
    id: 't2-r4',
    loanId: '2',
    loanNumber: 'BCL-2025-0028',
    loanType: 'BUSINESS',
    purpose: 'Working Capital',
    type: 'REPAYMENT',
    amount: 53_000,
    date: '2025-08-15',
    reference: 'REP-2025-0028-04',
    status: 'SUCCESS',
    description: 'Installment 4 of 6',
  },
  {
    id: 't2-r5',
    loanId: '2',
    loanNumber: 'BCL-2025-0028',
    loanType: 'BUSINESS',
    purpose: 'Working Capital',
    type: 'REPAYMENT',
    amount: 53_000,
    date: '2025-09-15',
    reference: 'REP-2025-0028-05',
    status: 'SUCCESS',
    description: 'Installment 5 of 6',
  },
  {
    id: 't2-r6',
    loanId: '2',
    loanNumber: 'BCL-2025-0028',
    loanType: 'BUSINESS',
    purpose: 'Working Capital',
    type: 'REPAYMENT',
    amount: 53_000,
    date: '2025-10-15',
    reference: 'REP-2025-0028-06',
    status: 'SUCCESS',
    description: 'Installment 6 of 6',
  },
  // Loan 3 — BCL-2024-0015 EMERGENCY (closed, 3 repayments)
  {
    id: 't3-dis',
    loanId: '3',
    loanNumber: 'BCL-2024-0015',
    loanType: 'EMERGENCY',
    purpose: 'Medical Bills',
    type: 'DISBURSEMENT',
    amount: 150_000,
    date: '2024-09-01',
    reference: 'DIS-2024-0015',
    status: 'SUCCESS',
    description: 'Loan disbursement',
  },
  {
    id: 't3-r1',
    loanId: '3',
    loanNumber: 'BCL-2024-0015',
    loanType: 'EMERGENCY',
    purpose: 'Medical Bills',
    type: 'REPAYMENT',
    amount: 51_500,
    date: '2024-10-01',
    reference: 'REP-2024-0015-01',
    status: 'SUCCESS',
    description: 'Installment 1 of 3',
  },
  {
    id: 't3-r2',
    loanId: '3',
    loanNumber: 'BCL-2024-0015',
    loanType: 'EMERGENCY',
    purpose: 'Medical Bills',
    type: 'REPAYMENT',
    amount: 51_500,
    date: '2024-11-01',
    reference: 'REP-2024-0015-02',
    status: 'SUCCESS',
    description: 'Installment 2 of 3',
  },
  {
    id: 't3-r3',
    loanId: '3',
    loanNumber: 'BCL-2024-0015',
    loanType: 'EMERGENCY',
    purpose: 'Medical Bills',
    type: 'REPAYMENT',
    amount: 51_500,
    date: '2024-12-01',
    reference: 'REP-2024-0015-03',
    status: 'SUCCESS',
    description: 'Installment 3 of 3',
  },
  // Loan 4 — BCL-2023-0007 PERSONAL overdue (2 repayments then failed)
  {
    id: 't4-dis',
    loanId: '4',
    loanNumber: 'BCL-2023-0007',
    loanType: 'PERSONAL',
    purpose: 'Tuition Fees',
    type: 'DISBURSEMENT',
    amount: 200_000,
    date: '2023-01-15',
    reference: 'DIS-2023-0007',
    status: 'SUCCESS',
    description: 'Loan disbursement',
  },
  {
    id: 't4-r1',
    loanId: '4',
    loanNumber: 'BCL-2023-0007',
    loanType: 'PERSONAL',
    purpose: 'Tuition Fees',
    type: 'REPAYMENT',
    amount: 18_667,
    date: '2023-02-15',
    reference: 'REP-2023-0007-01',
    status: 'SUCCESS',
    description: 'Installment 1 of 12',
  },
  {
    id: 't4-r2',
    loanId: '4',
    loanNumber: 'BCL-2023-0007',
    loanType: 'PERSONAL',
    purpose: 'Tuition Fees',
    type: 'REPAYMENT',
    amount: 18_667,
    date: '2023-03-15',
    reference: 'REP-2023-0007-02',
    status: 'SUCCESS',
    description: 'Installment 2 of 12',
  },
  {
    id: 't4-r3',
    loanId: '4',
    loanNumber: 'BCL-2023-0007',
    loanType: 'PERSONAL',
    purpose: 'Tuition Fees',
    type: 'REPAYMENT',
    amount: 18_667,
    date: '2023-04-15',
    reference: 'REP-2023-0007-03',
    status: 'FAILED',
    description: 'Installment 3 of 12',
  },
] as const satisfies Transaction[]

// ── API functions ─────────────────────────────────────────────────────────────

export function getLoanStats(): Promise<ApiResponse<LoanStats>> {
  const data: LoanStats = {
    totalLoans: MOCK_LOANS.length,
    activeLoans: MOCK_LOANS.filter((l) => l.status === 'ACTIVE').length,
    totalBorrowed: MOCK_LOANS.reduce((s, l) => s + l.principal, 0),
    totalOutstanding: MOCK_LOANS.reduce((s, l) => s + l.outstandingBalance, 0),
  }
  return mockOk(data)
}

export function getLoans(params: {
  page: number
  pageSize: number
  status?: LoanStatus | null
}): Promise<ApiResponse<PaginatedResponse<Loan>>> {
  const filtered = params.status ? MOCK_LOANS.filter((l) => l.status === params.status) : MOCK_LOANS
  const start = (params.page - 1) * params.pageSize
  return mockOk({
    items: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(filtered.length / params.pageSize),
  })
}

export function getLoan(id: string): Promise<ApiResponse<Loan>> {
  const loan = MOCK_LOANS.find((l) => l.id === id)
  if (!loan) return Promise.reject(new Error('Loan not found'))
  return mockOk(loan)
}

export function getRepaymentSchedule(
  loanId: string,
): Promise<ApiResponse<RepaymentScheduleItem[]>> {
  const loan = MOCK_LOANS.find((l) => l.id === loanId)
  if (!loan) return Promise.reject(new Error('Loan not found'))
  return mockOk(buildSchedule(loan))
}

export function getLoanAgreement(_loanId: string): Promise<ApiResponse<{ html: string }>> {
  return mockOk({ html: LOAN_AGREEMENT_HTML })
}

export function getLoanTerms(): Promise<ApiResponse<{ html: string }>> {
  return mockOk({ html: LOAN_TERMS_HTML })
}

export function getTransactions(params: {
  page: number
  pageSize: number
  type?: TransactionType | null
  dateFrom?: string | null
  dateTo?: string | null
}): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
  let items = [...MOCK_TRANSACTIONS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  if (params.type) items = items.filter((t) => t.type === params.type)
  if (params.dateFrom) items = items.filter((t) => t.date >= params.dateFrom!)
  if (params.dateTo) items = items.filter((t) => t.date <= params.dateTo!)
  const start = (params.page - 1) * params.pageSize
  return mockOk({
    items: items.slice(start, start + params.pageSize),
    total: items.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(items.length / params.pageSize),
  })
}

export function checkEligibility(): Promise<ApiResponse<LoanEligibility>> {
  return mockOk(
    {
      eligible: true,
      maxAmount: 500_000,
      minAmount: 50_000,
      availableTenors: [
        { months: 3, interestRatePerMonth: 1.5 },
        { months: 6, interestRatePerMonth: 1.25 },
        { months: 9, interestRatePerMonth: 1.1 },
        { months: 12, interestRatePerMonth: 1.0 },
        { months: 18, interestRatePerMonth: 0.9 },
        { months: 24, interestRatePerMonth: 0.85 },
      ],
    },
    2000, // 2s delay to simulate real check
  )
}
