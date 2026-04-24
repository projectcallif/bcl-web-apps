import { ApiHelper } from "@/helpers/ApiHelper";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  PaginatedResponse,
  LoanStatus,
  LoanApplicationStatus,
  AdminLoanApplicationResponse,
  AdminLoanApplicationDetail,
  AdminDisbursedLoanListItem,
} from "@bcl/types";

export function getDisbursedLoans(params: {
  status?: LoanStatus;
  page: number;
  limit: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ApiResponse<PaginatedResponse<AdminDisbursedLoanListItem>>> {
  return api.get<PaginatedResponse<AdminDisbursedLoanListItem>>(
    "/v1/admin/disbursed-loans",
    ApiHelper.cleanParams(params),
  );
}

export function getLoanApplications(params: {
  status?: LoanApplicationStatus;
  page: number;
  limit: number;
}): Promise<ApiResponse<AdminLoanApplicationResponse>> {
  return api.get<AdminLoanApplicationResponse>(
    "/v1/admin/loan-applications",
    ApiHelper.cleanParams(params),
  );
}

export function getLoanApplicationDetail(
  id: string,
): Promise<ApiResponse<AdminLoanApplicationDetail>> {
  return api.get<AdminLoanApplicationDetail>(
    `/v1/admin/loan-applications/${id}`,
  );
}

export function approveLoanApplication(
  id: string,
  payload: {
    offeredAmount: number;
    tenor: number;
    offerValidDays?: number;
  },
): Promise<ApiResponse<AdminLoanApplicationDetail>> {
  return api.post<AdminLoanApplicationDetail>(
    `/v1/admin/loan-applications/${id}/approve`,
    payload,
  );
}

export function rejectLoanApplication(
  id: string,
  payload: {
    reason: string;
  },
): Promise<ApiResponse<AdminLoanApplicationDetail>> {
  return api.post<AdminLoanApplicationDetail>(
    `/v1/admin/loan-applications/${id}/reject`,
    payload,
  );
}
