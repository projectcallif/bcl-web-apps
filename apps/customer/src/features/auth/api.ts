import { api } from '@/lib/api'
import type { ApiResponse, LoginPayload, AuthResponse } from '@bcl/types'

export function login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
  return api.post<AuthResponse>('/auth/login', payload)
}
