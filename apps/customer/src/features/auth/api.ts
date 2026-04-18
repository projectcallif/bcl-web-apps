import { api } from '@/lib/api'
import type {
  ApiResponse,
  LoginPayload,
  AuthResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  ResendOtpPayload,
  InitiateRegisterPayload,
  VerifyRegisterOtpPayload,
  PersonalDetailsPayload,
  BvnInitiatePayload,
  BvnSendOtpPayload,
  BvnConfirmPayload,
  EmploymentUpdatePayload,
  UtilityBillUpdatePayload,
  PresignedUrlPayload,
} from '@bcl/types'

export function login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
  return api.post<AuthResponse>('/v1/auth/login', payload)
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<void>> {
  return api.post<void>('/v1/auth/forgot-password', payload)
}

export function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<void>> {
  return api.post<void>('/v1/auth/reset-password', payload)
}

export function verifyEmail(payload: VerifyEmailPayload): Promise<ApiResponse<AuthResponse>> {
  return api.post<AuthResponse>('/v1/auth/verify-email', payload)
}

export function resendEmailOtp(payload: ResendOtpPayload): Promise<ApiResponse<void>> {
  return api.post<void>('/v1/auth/resend-otp', payload)
}

// ── Registration Flow Endpoints ──────────────────────────────────────────────

export function initiateRegister(
  payload: InitiateRegisterPayload,
): Promise<ApiResponse<{ message: string }>> {
  return api.post('/v1/auth/register', payload)
}

export function verifyRegistrationOtp(
  payload: VerifyRegisterOtpPayload,
): Promise<ApiResponse<AuthResponse>> {
  return api.post('/v1/auth/register/verify-otp', payload)
}

export function resendRegistrationOtp(
  payload: Omit<VerifyRegisterOtpPayload, 'code' | 'password'>,
): Promise<ApiResponse<{ message: string }>> {
  return api.post('/v1/auth/register/resend-otp', {
    email: payload.email,
    phone: payload.phone,
    type: payload.type,
  })
}

export function updatePersonalDetails(
  payload: PersonalDetailsPayload,
): Promise<ApiResponse<{ message: string }>> {
  return api.put('/v1/auth/register/personal-details', payload)
}

export function initiateBvnVerification(
  payload: BvnInitiatePayload,
): Promise<ApiResponse<{ methods: { method: string; value: string }[] }>> {
  return api.post('/v1/auth/register/bvn/initiate', payload)
}

export function sendBvnOtp(payload: BvnSendOtpPayload): Promise<ApiResponse<{ message: string }>> {
  return api.post('/v1/auth/register/bvn/send-otp', payload)
}

export function confirmBvnOtp(
  payload: BvnConfirmPayload,
): Promise<ApiResponse<{ message: string }>> {
  return api.post('/v1/auth/register/bvn/confirm', payload)
}

export function updateEmployment(
  payload: EmploymentUpdatePayload,
): Promise<ApiResponse<{ message: string }>> {
  return api.put('/v1/auth/register/employment', payload)
}

export function updateUtilityBill(
  payload: UtilityBillUpdatePayload,
): Promise<ApiResponse<{ message: string }>> {
  return api.put('/v1/auth/register/utility-bill', payload)
}

export function getPresignedUrl(
  payload: PresignedUrlPayload,
): Promise<ApiResponse<{ uploadUrl: string; objectUrl: string; key: string }>> {
  return api.post('/v1/upload/presigned-url', payload)
}
