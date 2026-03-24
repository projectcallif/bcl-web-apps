import { createApiClient, ApiClientError } from '@bcl/types'

export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
})

// ── Request: inject stored Bearer token ──────────────────────────────────────
api.addRequestInterceptor((config) => {
  const token = localStorage.getItem('bcl_admin_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── Error: clear session and redirect to admin login on 401 ──────────────────
api.addErrorInterceptor((error: ApiClientError) => {
  if (error.isUnauthorized) {
    localStorage.removeItem('bcl_admin_token')
    window.location.href = '/login'
  }
  return error
})

export { ApiClientError }
