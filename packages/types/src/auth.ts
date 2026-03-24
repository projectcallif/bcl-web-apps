import type { User } from './user'

export interface LoginPayload {
  identifier: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}
