import { ApiHelper } from "@/helpers/ApiHelper";
import { api } from "@/lib/api";
import type { ApiResponse, LoanLegalDocument } from "@bcl/types";

export function getLegalDocuments(params: {
  type?: string;
  isActive?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ApiResponse<LoanLegalDocument[]>> {
  return api.get<LoanLegalDocument[]>(
    "/v1/admin/legal",
    ApiHelper.cleanParams(params),
  );
}

export function getLegalDocument(
  id: string,
): Promise<ApiResponse<LoanLegalDocument>> {
  return api.get<LoanLegalDocument>(`/v1/admin/legal/${id}`);
}

export function createLegalDocument(payload: {
  type: string;
  version: string;
  title: string;
  content: string;
  effectiveDate: string;
}): Promise<ApiResponse<LoanLegalDocument>> {
  return api.post<LoanLegalDocument>("/v1/admin/legal", payload);
}

export function updateLegalDocument(
  id: string,
  payload: {
    title?: string;
    version?: string;
    content?: string;
    effectiveDate?: string;
  },
): Promise<ApiResponse<LoanLegalDocument>> {
  return api.patch<LoanLegalDocument>(`/v1/admin/legal/${id}`, payload);
}

export function activateLegalDocument(
  id: string,
): Promise<ApiResponse<LoanLegalDocument>> {
  return api.post<LoanLegalDocument>(`/v1/admin/legal/${id}/activate`, {});
}

export function deleteLegalDocument(id: string): Promise<ApiResponse<null>> {
  return api.delete<null>(`/v1/admin/legal/${id}`);
}
