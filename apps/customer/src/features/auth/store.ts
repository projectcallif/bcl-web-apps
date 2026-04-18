import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginPayload, VerifyEmailPayload } from '@bcl/types'
import { login as loginApi, verifyEmail as verifyEmailApi } from './api'

const TOKEN_KEY = 'bcl_customer_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)
  const registrationIdentifier = ref<string | null>(null)
  const registrationType = ref<'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION' | null>(null)

  const isAuthenticated = computed(() => token.value !== null)

  /**
   * Authenticate with email/phone + password.
   * Throws `ApiClientError` on failure — let the caller handle it.
   */
  async function login(payload: LoginPayload): Promise<void> {
    const response = await loginApi(payload)
    token.value = response.data.accessToken
    user.value = response.data.user
    localStorage.setItem(TOKEN_KEY, response.data.accessToken)
  }

  /**
   * Verify email with OTP code.
   */
  async function verifyEmail(payload: VerifyEmailPayload): Promise<void> {
    const response = await verifyEmailApi(payload)
    token.value = response.data.accessToken
    user.value = response.data.user
    localStorage.setItem(TOKEN_KEY, response.data.accessToken)
  }

  function logout(): void {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  function setRegistrationData(
    identifier: string,
    type: 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION',
  ): void {
    registrationIdentifier.value = identifier
    registrationType.value = type
  }

  return {
    token,
    user,
    isAuthenticated,
    registrationIdentifier,
    registrationType,
    login,
    verifyEmail,
    logout,
    setRegistrationData,
  }
})
