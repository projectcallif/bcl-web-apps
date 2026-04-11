<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppTextInput, AppPasswordInput, BaseButton, BrandLogo } from '@bcl/ui'
import { ApiClientError } from '@bcl/types'
import { useAuthStore } from './store'

const router = useRouter()
const authStore = useAuthStore()

const identifier = ref('')
const password = ref('')
const isLoading = ref(false)
const formError = ref('')

async function handleSubmit(): Promise<void> {
  formError.value = ''
  isLoading.value = true
  try {
    await authStore.login({ identifier: identifier.value, password: password.value })
    await router.push({ name: 'dashboard' })
  } catch (err) {
    formError.value =
      err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function _debugPrefill() {
  identifier.value = 'user40@bcl.com'
  password.value = 'Password@1'
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
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight" @dblclick="_debugPrefill">
          Welcome back
        </h1>
        <p class="mt-1 text-sm text-slate-500">Sign in to your BCL account</p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-8"
      >
        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <!-- Email / Phone -->
          <AppTextInput
            id="identifier"
            v-model="identifier"
            label="Email or phone number"
            placeholder="you@example.com or 08097654345"
            type="text"
            name="identifier"
            autocomplete="username"
            required
          />

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <AppPasswordInput
              id="password"
              v-model="password"
              label="Password"
              placeholder="Enter your password"
              name="password"
              autocomplete="current-password"
              required
            />

            <!-- Forgot password -->
            <div class="flex justify-end">
              <RouterLink
                to="/forgot-password"
                class="text-xs font-medium text-primary hover:text-primary-800 transition-colors"
              >
                Forgot password?
              </RouterLink>
            </div>
          </div>

          <!-- Form-level error -->
          <div
            v-if="formError"
            role="alert"
            class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {{ formError }}
          </div>

          <!-- Submit -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isLoading"
            class="w-full mt-1"
          >
            Sign in
          </BaseButton>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200" />
          </div>
          <div class="relative flex justify-center">
            <span class="bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
              New to BCL?
            </span>
          </div>
        </div>

        <!-- Register link -->
        <p class="text-center text-sm text-slate-500">
          Don't have an account?
          <RouterLink
            to="/register"
            class="font-semibold text-primary hover:text-primary-800 transition-colors"
          >
            Create one
          </RouterLink>
        </p>
      </div>

      <!-- Footer note -->
      <p class="mt-6 text-center text-xs text-slate-400">
        Protected by BCL's secure authentication
      </p>
    </div>
  </div>
</template>
