import type { User, UserProfile, Admin, UserRole, UserStatus } from "./user";

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

export interface AdminAuthResponse {
  accessToken: string;
  admin: Admin;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface CreateAdminPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateAdminStatusPayload {
  status: UserStatus;
}
