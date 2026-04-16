import { api } from "@/lib/api";
import type {
  ApiResponse,
  AdminAuthResponse,
  AdminLoginPayload,
} from "@bcl/types";

/**
 * Authenticate an administrator.
 * POST /v1/admin/auth/login
 */
export function login(
  payload: AdminLoginPayload,
): Promise<ApiResponse<AdminAuthResponse>> {
  return api.post<AdminAuthResponse>("/v1/admin/auth/login", payload);
}
