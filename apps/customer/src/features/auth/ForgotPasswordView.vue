<script setup lang="ts">
import { ref } from 'vue'
import { AppTextInput, BaseButton, BrandLogo } from '@bcl/ui'
import { ApiClientError } from '@bcl/types'
import { forgotPassword } from './api'

const identifier = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const formError = ref('')

async function handleSubmit(): Promise<void> {
  formError.value = ''
  isLoading.value = true
  try {
    await forgotPassword({ identifier: identifier.value })
    isSuccess.value = true
  } catch (err) {
    formError.value =
      err instanceof ApiClientError ? err.message : 'Request failed. Please try again.'
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
          Forgot password?
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Enter your email or phone to reset your password
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
          <h2 class="text-xl font-bold text-slate-800 mb-2">Instructions Sent</h2>
          <p class="text-sm text-slate-500 mb-8">
            We've sent password reset instructions to <strong>{{ identifier }}</strong> if it's associated with an account.
          </p>
          <BaseButton component="router-link" to="/login" variant="primary" class="w-full">
            Back to Sign In
          </BaseButton>
        </div>

        <form v-else class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <AppTextInput
            id="identifier"
            v-model="identifier"
            label="Email or phone number"
            placeholder="you@example.com or 080XXXXXXXX"
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
            Send Reset Link
          </BaseButton>

          <p class="text-center text-sm text-slate-500">
            Wait, I remember it!
            <RouterLink
              to="/login"
              class="font-semibold text-primary hover:text-primary-800 transition-colors"
            >
              Sign in
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
