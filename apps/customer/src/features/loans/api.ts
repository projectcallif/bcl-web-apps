import { ApiHelper } from '@/helpers/ApiHelper'
import { api } from '@/lib/api'
import type {
  ApiResponse,
  PaginatedResponse,
  Loan,
  LoanStatus,
  LoanSchedule,
  LoanEligibility,
  LoanDashboardStats,
  Transaction,
  TransactionType,
  LoanProduct,
  LoanLegalDocument,
  LoanPreview,
} from '@bcl/types'

// ── Dashboard & Stats ────────────────────────────────────────────────────────

export function getLoanDashboard(): Promise<ApiResponse<LoanDashboardStats>> {
  return api.get<LoanDashboardStats>('/v1/loans/dashboard')
}

export function getLoanProducts(): Promise<ApiResponse<LoanProduct[]>> {
  return api.get<LoanProduct[]>('/v1/loans/products')
}

export function getProductDetail(id: string): Promise<ApiResponse<LoanProduct>> {
  return api.get<LoanProduct>(`/v1/loans/products/${id}`)
}

export function getDefaultLoanProduct(): Promise<ApiResponse<LoanProduct>> {
  return api.get<LoanProduct>('/v1/loans/products/default')
}

// ── Loan Management ──────────────────────────────────────────────────────────

export function getMyLoans(params: { status?: LoanStatus | null }): Promise<ApiResponse<Loan[]>> {
  return api.get<Loan[]>('/v1/loans/my-loans', ApiHelper.cleanParams(params))
}

export function getLoanDetail(id: string): Promise<ApiResponse<Loan & { schedule: LoanSchedule }>> {
  return api.get<Loan & { schedule: LoanSchedule }>(`/v1/loans/my-loans/${id}`)
}

export function getActiveLoans(): Promise<ApiResponse<Loan[]>> {
  return api.get<Loan[]>('/v1/loans/active')
}

export function getLatestActiveLoan(): Promise<ApiResponse<Loan>> {
  return api.get<Loan>('/v1/loans/active/latest')
}

export function getLoanSchedule(loanId: string): Promise<ApiResponse<LoanSchedule>> {
  return api.get<LoanSchedule>(`/v1/loans/schedule`, { loanId })
}

export function getProjectedSchedule(eligibilityId: string): Promise<ApiResponse<LoanSchedule>> {
  return api.get<LoanSchedule>(`/v1/loans/schedule`, { eligibilityId })
}

// ── Application Flow ─────────────────────────────────────────────────────────

export function checkEligibility(payload?: {
  principal?: number
  tenor?: number
}): Promise<ApiResponse<LoanEligibility>> {
  return api.post<LoanEligibility>('/v1/loans/eligibility-check', payload)
}

export function getEligibilityResult(): Promise<ApiResponse<LoanEligibility>> {
  return api.get<LoanEligibility>('/v1/loans/eligibility')
}

export function previewLoan(payload: {
  requestedAmount: number
  requestedTenor: number
}): Promise<ApiResponse<LoanPreview>> {
  return api.post<LoanPreview>('/v1/loans/apply/preview', payload)
}

export function applyLoan(payload: {
  requestedAmount: number
  requestedTenor: number
  purpose?: string
  productId?: string
}): Promise<ApiResponse<{ referenceId: string; status: LoanStatus }>> {
  return api.post('/v1/loans/apply', payload)
}

export function getLoanContract(): Promise<ApiResponse<LoanLegalDocument>> {
  return api.get<LoanLegalDocument>('/v1/loans/contract')
}

export function getLoanTerms(): Promise<ApiResponse<LoanLegalDocument>> {
  return api.get<LoanLegalDocument>('/v1/loans/terms')
}

// ── Transactions ─────────────────────────────────────────────────────────────

export function getTransactions(params: {
  page: number
  limit: number
  type?: TransactionType | null
  dateFrom?: string | null
  dateTo?: string | null
}): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
  return api.get<PaginatedResponse<Transaction>>('/v1/transactions', ApiHelper.cleanParams(params))
}

export function getRecentTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
  return api.get<Transaction[]>('/v1/transactions/recent', { limit })
}
