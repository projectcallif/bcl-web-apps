import type {
  User,
  Admin,
  UserRole,
  UserStatus,
  UserGender,
  MaritalStatus,
  EmploymentStatus,
} from "./user";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface InitiateRegisterPayload {
  email?: string;
  phone?: string;
}

export interface VerifyRegisterOtpPayload {
  email?: string;
  phone?: string;
  type: "EMAIL_VERIFICATION" | "PHONE_VERIFICATION";
  code: string;
  password?: string;
}

export interface PersonalDetailsPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: UserGender;
  maritalStatus: MaritalStatus;
  addressNo: string;
  residentialAddress: string;
  country: string;
  state: string;
  city: string;
  lga: string;
}

export interface BvnInitiatePayload {
  bvn: string;
}

export interface BvnSendOtpPayload {
  method: string;
  phoneNumber?: string;
}

export interface BvnConfirmPayload {
  otp: string;
}

export interface EmploymentUpdatePayload {
  employmentStatus: EmploymentStatus;
  employerName?: string;
  employerAddress?: string;
  workEmail?: string;
  jobTitle?: string;
  monthlyIncome: number;
  salaryDay?: number;
  employmentStartDate?: string;
  proofOfEmploymentUrl?: string;
}

export interface UtilityBillUpdatePayload {
  utilityBillUrl: string;
  utilityBillType: string;
}

export interface PresignedUrlPayload {
  folder: "utility-bills" | "identity-documents" | "profile-photos";
  fileName: string;
}

export interface ForgotPasswordPayload {
  identifier: string; // email or phone
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendOtpPayload {
  identifier: string; // email or phone
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
