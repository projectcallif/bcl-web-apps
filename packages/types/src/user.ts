export type UserRole = 'customer' | 'admin' | 'super_admin'

export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  role?: UserRole
  status?: UserStatus
}
