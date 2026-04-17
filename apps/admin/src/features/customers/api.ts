import { api } from "@/lib/api";
import type {
  ApiResponse,
  CustomerListItem,
  CustomerDetail,
} from "@bcl/types";

export interface PaginatedCustomersResponse {
  data: CustomerListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetch users/customers with pagination.
 * GET /v1/admin/users
 */
export function getCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<PaginatedCustomersResponse>> {
  return api.get<PaginatedCustomersResponse>("/v1/admin/users", params);
}

/**
 * Fetch a single customer by ID.
 * GET /v1/admin/users/:id
 */
export function getCustomerById(
  id: string,
): Promise<ApiResponse<CustomerDetail>> {
  return api.get<CustomerDetail>(`/v1/admin/users/${id}`);
}
/**
 * Update a customer's status (e.g., SUSPENDED, ACTIVE, DEACTIVATED).
 * PATCH /v1/admin/users/:id/status
 */
export function updateCustomerStatus(
  id: string,
  payload: { status: string },
): Promise<ApiResponse<CustomerListItem>> {
  return api.patch<CustomerListItem>(`/v1/admin/users/${id}/status`, payload);
}
