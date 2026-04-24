import { api } from "@/lib/api";
import type {
  ApiResponse,
  LoanProduct,
  AdminLoanProductListItem,
  LoanProductTenor,
} from "@bcl/types";

export function getAdminProducts(): Promise<ApiResponse<AdminLoanProductListItem[]>> {
  return api.get<AdminLoanProductListItem[]>("/v1/admin/products");
}

export function getAdminProductDetail(id: string): Promise<ApiResponse<LoanProduct>> {
  return api.get<LoanProduct>(`/v1/admin/products/${id}`);
}

export interface CreateProductPayload extends Omit<Partial<LoanProduct>, "tenors"> {
  tenors?: { tenorValue: number; interestRate: number }[];
}

export function createProduct(payload: CreateProductPayload): Promise<ApiResponse<LoanProduct>> {
  return api.post<LoanProduct>("/v1/admin/products", payload);
}

export function updateProduct(
  id: string,
  payload: Partial<LoanProduct>,
): Promise<ApiResponse<LoanProduct>> {
  return api.patch<LoanProduct>(`/v1/admin/products/${id}`, payload);
}

export function addTenor(
  productId: string,
  payload: { tenorValue: number; interestRate: number },
): Promise<ApiResponse<LoanProductTenor>> {
  return api.post<LoanProductTenor>(`/v1/admin/products/${productId}/tenors`, payload);
}

export function updateTenor(
  productId: string,
  tenorId: string | number,
  payload: Partial<LoanProductTenor>,
): Promise<ApiResponse<LoanProductTenor>> {
  return api.patch<LoanProductTenor>(
    `/v1/admin/products/${productId}/tenors/${tenorId}`,
    payload,
  );
}

export function deleteTenor(
  productId: string,
  tenorId: string | number,
): Promise<ApiResponse<{ message: string }>> {
  return api.delete<{ message: string }>(`/v1/admin/products/${productId}/tenors/${tenorId}`);
}
