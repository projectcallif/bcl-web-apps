import { api } from "@/lib/api";
import type { ApiResponse, AppConfig, SaveAppConfigPayload } from "@bcl/types";

export function getAppConfigs(): Promise<ApiResponse<AppConfig[]>> {
  return api.get<AppConfig[]>("/v1/admin/config");
}

export function getAppConfig(key: string): Promise<ApiResponse<AppConfig>> {
  return api.get<AppConfig>(`/v1/admin/config/${key}`);
}

export function setAppConfig(
  key: string,
  payload: SaveAppConfigPayload,
): Promise<ApiResponse<AppConfig>> {
  return api.put<AppConfig>(`/v1/admin/config/${key}`, payload);
}

export function deleteAppConfig(key: string): Promise<ApiResponse<null>> {
  return api.delete<null>(`/v1/admin/config/${key}`);
}
