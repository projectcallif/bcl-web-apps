export type LoanStatus =
  | "ACTIVE"
  | "DEFAULTED"
  | "COMPLETED"
  | "WRITTEN_OFF";

export type LoanApplicationStatus =
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED";

export type LoanType = "PERSONAL" | "BUSINESS" | "EMERGENCY" | "SALARY_ADVANCE";

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED" | "REVERSED";

export type InstallmentStatus = "PAID" | "UPCOMING" | "OVERDUE";

export interface LoanProductTenor {
  id: string;
  tenorValue: number;
  interestRate: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  description?: string;
  minAmount: number | string;
  maxAmount: number | string;
  minTenor: number;
  maxTenor: number;
  tenorUnit?: string;
  interestRate: number | string;
  interestType: string;
  processingFeeRate?: number | string;
  managementFeeRate?: number | string;
  penaltyRate?: number | string;
  isActive: boolean;
  tenors: LoanProductTenor[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoanDisbursementAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface Loan {
  id: string;
  referenceId: string;
  applicationId: string;
  status: LoanStatus;
  principal: number;
  interestAmount: number;
  totalPayable: number;
  outstandingBalance: number;
  amountPaid?: number; // Optional since it might be derived or in detail
  tenor: number;
  disbursedAt: string | null;
  firstDueDate: string | null;
  finalDueDate: string | null;
  loanProduct: LoanProduct;
  disbursementAccount: LoanDisbursementAccount;
  createdAt: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  paidAt: string;
  reference: string;
  status: PaymentStatus;
}

export interface RepaymentScheduleItem {
  installmentNo: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  balance: number;
  status?: InstallmentStatus;
  amountPaid?: number;
}

export interface LoanScheduleSummary {
  amountRequested: number;
  monthlyInterestRate: number;
  tenor: number;
  monthlyPayment: number;
  totalInterest: number;
  totalAmountToRepay: number;
  firstDueDate: string;
  finalDueDate: string;
}

export interface LoanSchedule {
  summary: LoanScheduleSummary;
  installments: RepaymentScheduleItem[];
}

export interface LoanPreview {
  loanAmount: number;
  monthlyInterestRate: number;
  interestType: string;
  tenor: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayableAmount: number;
  disbursementAccount: LoanDisbursementAccount;
}

export interface TenorOption {
  months: number;
  interestRatePerMonth: number;
}

export type EligibilityStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface LoanEligibility {
  id: string;
  status: EligibilityStatus;
  canAfford: boolean;
  eligibleAmountInNaira: number | null;
  monthlyPaymentInNaira: number | null;
  totalRepaymentAmountInNaira: number | null;
  expiresAt: string | null;
  checkedAt: string | null;
  reason?: string;
  bankAccount?: {
    id: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface LoanDashboardStats {
  activeLoanCount: number;
  outstandingBalance: number;
  totalPayable: number;
  totalCollected: number;
  percentagePaid: number;
  healthScoreInPercent: number;
  status: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
}

export interface LoanLegalDocument {
  id: string;
  type: string;
  version: string;
  title: string;
  content: string;
  isActive: boolean;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CustomField {
  id: string;
  label: string;
  type: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";
  required: boolean;
}

export interface LegalConfig {
  disclosureText: string;
  termsAndConditions: string;
  updatedAt: string;
}

export interface LoanRuleConfig {
  minAge: number;
  maxAge: number;
  requireBvn: boolean;
  requireLocation: boolean;
  requireVerifiedPhone: boolean;
  requireGender: boolean;
  requireDob: boolean;
  requireUtilityBill: boolean;
  requireEmploymentProof: boolean;
  customFields?: CustomField[];
}

export interface LoanApplication {
  id: string;
  userId: string;
  amountRequested: number;
  tenorMonths: number;
  purpose: string;
  status: LoanStatus;
  appliedAt: string;
  rejectionReason?: string;
  // Enhanced fields for underwriting
  documents?: {
    utilityBillUrl?: string;
    idFrontUrl?: string;
    idBackUrl?: string;
    employmentProofUrl?: string;
  };
  eligibilityResults?: {
    bvnValid: boolean;
    ageValid: boolean;
    incomeScore: number;
    passedRules: string[];
    failedRules: string[];
  };
}

export type TransactionType =
  | "DISBURSEMENT"
  | "REPAYMENT"
  | "PENALTY_CHARGE"
  | "FEE_CHARGE"
  | "REFUND"
  | "REVERSAL";

export interface Transaction {
  id: string;
  reference: string;
  userId: string;
  loanId: string | null;
  loanNumber?: string;
  loanType?: LoanType;
  purpose?: string;
  type: TransactionType;
  amount: string | number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerReference?: string | null;
  narration: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface TransactionDetail extends Transaction {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  loan?: {
    id: string;
    referenceId: string;
    status: LoanStatus;
  };
}

export interface CollectionLog {
  id: string;
  loanId: string;
  officerId: string;
  date: string;
  note: string;
  method: "CALL" | "EMAIL" | "SMS" | "OTHER";
}

export interface AdminLoanApplicationListItem {
  id: string;
  userId: string;
  applicantName: string;
  status: LoanApplicationStatus;
  requestedAmount: number;
  requestedTenor: number;
  purpose: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface AdminLoanApplicationResponse {
  data: AdminLoanApplicationListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminLoanApplicationDetail {
  id: string;
  status: LoanApplicationStatus;
  requestedAmount: number;
  requestedTenor: number;
  purpose: string;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    residentialAddress: string;
    city: string;
    state: string;
    monoAccountId: string;
  };
  kyc: {
    bvnStatus: string;
    bvnVerifiedAt: string;
    tier: string;
  };
  eligibility: {
    canAfford: boolean;
    eligibleAmountInNaira: number;
    monthlyPaymentInNaira: number;
    assessedFrom: string;
    assessedTo: string;
    expiresAt: string;
  };
  loanProduct: LoanProduct;
  offer: {
    id: string;
    offeredAmount: number;
    interestRate: number;
    tenor: number;
    status: string;
    expiresAt: string;
  } | null;
}

export interface AdminDisbursedLoanListItem {
  id: string;
  referenceId: string;
  userId: string;
  applicantName: string;
  principal: number;
  totalPayable: number;
  outstandingBalance: number;
  tenor: number;
  status: LoanStatus;
  disbursedAt: string;
  firstDueDate: string;
  finalDueDate: string;
  disbursementAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  createdAt: string;
}

export interface AdminDisbursedLoanDetail {
  id: string;
  referenceId: string;
  status: LoanStatus;
  principal: number;
  interestAmount: number;
  processingFee: number;
  managementFee: number;
  totalPayable: number;
  outstandingBalance: number;
  totalPaid: number;
  tenor: number;
  disbursedAt: string;
  firstDueDate: string;
  finalDueDate: string;
  createdAt: string;
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    residentialAddress: string;
    city: string;
    state: string;
  };
  loanProduct: {
    id: string;
    name: string;
    interestRate: number;
    interestType: string;
  };
  disbursementAccount: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  application: {
    id: string;
    trackerId: string;
    purpose: string;
    reviewedAt: string;
  };
  scheduleInstallments: number;
  recentTransactions: Transaction[];
}

export interface AdminLoanRepaymentSchedule {
  loanId: string;
  referenceId: string;
  loanStatus: LoanStatus;
  installments: RepaymentScheduleItem[];
}
