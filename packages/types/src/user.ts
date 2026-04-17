export type UserStatus =
  | "ACTIVE"
  | "DEACTIVATED"
  | "SUSPENDED"
  // TODO: not yet in backend
  | "PENDING";

export type UserGender = "MALE" | "FEMALE" | "OTHER";

export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";

export type RegistrationStep =
  | "PENDING"
  | "EMAIL_VERIFIED"
  | "PHONE_VERIFIED"
  | "BVN_VERIFIED"
  | "IDENTITY_VERIFIED"
  | "UTILITY_BILL_COMPLETE"
  | "COMPLETE";

export interface EmploymentInfo {
  jobTitle: string;
  employer: string;
  type: string;
  sector: string;
  monthlyIncome: number;
  workCity: string;
}

export interface AddressInfo {
  street: string;
  lga: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
}

export interface KycInfo {
  bvnStatus: string | null;
  bvnVerifiedAt: string | null;
  ninStatus: string | null;
  ninVerifiedAt: string | null;
  tier: string | null;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  dateOfBirth: string;
  gender: UserGender;
  maritalStatus: MaritalStatus;
  residentialAddress?: string | null;
  city: string;
  state: string;
  lga?: string | null;
  country: string;
  monoAccountId?: string | null;
  monoCustomerId?: string | null;
  employment?: EmploymentInfo;
  address?: AddressInfo;
  bank?: BankInfo;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  registrationStep: RegistrationStep;
  status: UserStatus;
  profile: UserProfile;
  createdAt: string;
}

export interface CustomerDetail extends User {
  kyc: KycInfo;
  loanApplications: unknown[]; // Stub for now
}

// ── Admin / management payloads ──────────────────────────────────────────────

export type UserRole =
  | "CUSTOMER"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "LOAN_UNDERWRITER"
  // TODO: not yet in backend
  | "FINANCE_OFFICER"
  | "COLLECTIONS_OFFICER"
  | "SUPPORT_AGENT";

export interface CreateUserPayload {
  email: string;
  phone: string;
  role: UserRole;
  profile: Pick<UserProfile, "firstName" | "lastName">;
}

export interface UpdateUserPayload {
  status?: UserStatus;
  role?: UserRole;
  profile?: Partial<UserProfile>;
}

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface CustomerListItem {
  id: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  registrationStep: RegistrationStep;
  firstName: string;
  lastName: string;
  createdAt: string;
}
