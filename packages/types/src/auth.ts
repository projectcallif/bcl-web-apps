import type { User, UserProfile } from './user'

export interface LoginPayload {
  identifier: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface RegisterPayload {
  email: string
  phone: string
  password: string
  profile: Pick<UserProfile, 'firstName' | 'lastName'>
}

export interface ForgotPasswordPayload {
  identifier: string // email or phone
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface VerifyEmailPayload {
  email: string
  code: string
}

export interface ResendOtpPayload {
  identifier: string // email or phone
}
