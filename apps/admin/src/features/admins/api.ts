import { api } from "@/lib/api";
import type {
  ApiResponse,
  Admin,
  CreateAdminPayload,
  UpdateAdminStatusPayload,
} from "@bcl/types";

/**
 * Fetch all administrative users.
 * GET /v1/admin/auth/admins
 */
export function getAdmins(): Promise<ApiResponse<Admin[]>> {
  return api.get<Admin[]>("/v1/admin/auth/admins");
}

/**
 * Create a new administrative user.
 * POST /v1/admin/auth/admins
 */
export function createAdmin(
  payload: CreateAdminPayload,
): Promise<ApiResponse<Admin>> {
  return api.post<Admin>("/v1/admin/auth/admins", payload);
}

/**
 * Update an administrator's status (e.g., SUSPENDED, ACTIVE).
 * PATCH /v1/admin/auth/admins/:id/status
 */
export function updateAdminStatus(
  id: string,
  payload: UpdateAdminStatusPayload,
): Promise<ApiResponse<Admin>> {
  return api.patch<Admin>(`/v1/admin/auth/admins/${id}/status`, payload);
}
