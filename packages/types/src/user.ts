export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'

export type UserGender = 'MALE' | 'FEMALE' | 'OTHER'

export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED'

export type RegistrationStep =
  | 'PENDING'
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'BVN_VERIFIED'
  | 'IDENTITY_VERIFIED'
  | 'UTILITY_BILL_COMPLETE'
  | 'COMPLETE'

export interface UserProfile {
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  gender: UserGender
  maritalStatus: MaritalStatus
  city: string
  state: string
  country: string
}

export interface User {
  id: string
  email: string
  phone: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  registrationStep: RegistrationStep
  status: UserStatus
  profile: UserProfile
}

// ── Admin / management payloads ──────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'

export interface CreateUserPayload {
  email: string
  phone: string
  role: UserRole
  profile: Pick<UserProfile, 'firstName' | 'lastName'>
}

export interface UpdateUserPayload {
  status?: UserStatus
  role?: UserRole
  profile?: Partial<UserProfile>
}
