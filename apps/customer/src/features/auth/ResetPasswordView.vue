<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppPasswordInput, BaseButton, BrandLogo } from '@bcl/ui'
import { ApiClientError } from '@bcl/types'
import { resetPassword } from './api'

const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const formError = ref('')

// Extract token from URL query
const token = computed(() => route.query.token as string || '')

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return password.value === confirmPassword.value
})

const isTokenMissing = computed(() => !token.value)

async function handleSubmit(): Promise<void> {
  if (isTokenMissing.value) {
    formError.value = 'Invalid or missing reset token.'
    return
  }
  if (!passwordsMatch.value) {
    formError.value = 'Passwords do not match'
    return
  }

  formError.value = ''
  isLoading.value = true
  try {
    await resetPassword({
      token: token.value,
      password: password.value,
    })
    isSuccess.value = true
  } catch (err) {
    formError.value =
      err instanceof ApiClientError ? err.message : 'Reset failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-primary-50 to-slate-100 px-4 py-12"
  >
    <div class="w-full max-w-md">
      <!-- Brand mark -->
      <div class="mb-8 text-center">
        <BrandLogo class="mb-4" size="lg" />
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Reset password
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Set a new, strong password for your account
        </p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-8"
      >
        <div v-if="isSuccess" class="text-center animate-in fade-in zoom-in duration-300">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Password Reset!</h2>
          <p class="text-sm text-slate-500 mb-8">
            Your password has been successfully updated. You can now sign in with your new credentials.
          </p>
          <BaseButton component="router-link" to="/login" variant="primary" class="w-full">
            Sign In
          </BaseButton>
        </div>

        <div v-else-if="isTokenMissing" class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Invalid Reset Link</h2>
          <p class="text-sm text-slate-500 mb-8">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <BaseButton component="router-link" to="/forgot-password" variant="primary" class="w-full">
            Request New Link
          </BaseButton>
        </div>

        <form v-else class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <AppPasswordInput
            id="password"
            v-model="password"
            label="New Password"
            placeholder="Min. 8 characters"
            required
          />
          <AppPasswordInput
            id="confirmPassword"
            v-model="confirmPassword"
            label="Confirm New Password"
            placeholder="Repeat new password"
            :error="!passwordsMatch ? 'Passwords do not match' : undefined"
            required
          />

          <!-- Form-level error -->
          <div
            v-if="formError"
            role="alert"
            class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {{ formError }}
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isLoading"
            class="w-full"
          >
            Reset Password
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>
