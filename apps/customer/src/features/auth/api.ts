import { api } from '@/lib/api'
import type {
  ApiResponse,
  LoginPayload,
  AuthResponse,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  ResendOtpPayload,
} from '@bcl/types'

export function login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
  return api.post<AuthResponse>('/auth/login', payload)
}

export function register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
  return api.post<AuthResponse>('/auth/register', payload)
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<void>> {
  return api.post<void>('/auth/forgot-password', payload)
}

export function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<void>> {
  return api.post<void>('/auth/reset-password', payload)
}

export function verifyEmail(payload: VerifyEmailPayload): Promise<ApiResponse<AuthResponse>> {
  return api.post<AuthResponse>('/auth/verify-email', payload)
}

export function resendEmailOtp(payload: ResendOtpPayload): Promise<ApiResponse<void>> {
  return api.post<void>('/auth/resend-otp', payload)
}
