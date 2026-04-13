<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AppTextInput, AppPasswordInput, BaseButton, BrandLogo } from '@bcl/ui'
import { ApiClientError } from '@bcl/types'
import { useAuthStore } from './store'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const formError = ref('')

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return password.value === confirmPassword.value
})

async function handleSubmit(): Promise<void> {
  if (!passwordsMatch.value) {
    formError.value = 'Passwords do not match'
    return
  }

  formError.value = ''
  isLoading.value = true
  try {
    await authStore.register({
      email: email.value,
      phone: phone.value,
      password: password.value,
      profile: {
        firstName: firstName.value,
        lastName: lastName.value,
      },
    })
    await router.push({ name: 'verify-email', query: { email: email.value } })
  } catch (err) {
    formError.value =
      err instanceof ApiClientError ? err.message : 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function _debugPrefill() {
  firstName.value = 'John'
  lastName.value = 'Doe'
  email.value = `user${Math.floor(Math.random() * 1000)}@example.com`
  phone.value =
    '080' +
    Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(8, '0')
  password.value = 'Password@1'
  confirmPassword.value = 'Password@1'
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-primary-50 to-slate-100 px-4 py-12"
  >
    <div class="w-full max-w-lg">
      <!-- Brand mark -->
      <div class="mb-8 text-center">
        <BrandLogo class="mb-4" size="lg" />
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight" @dblclick="_debugPrefill">
          Create an account
        </h1>
        <p class="mt-1 text-sm text-slate-500">Get started with BCL Finance today</p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-8"
      >
        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <!-- Name row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppTextInput
              id="firstName"
              v-model="firstName"
              label="First Name"
              placeholder="John"
              required
            />
            <AppTextInput
              id="lastName"
              v-model="lastName"
              label="Last Name"
              placeholder="Doe"
              required
            />
          </div>

          <!-- Email -->
          <AppTextInput
            id="email"
            v-model="email"
            label="Email address"
            placeholder="you@example.com"
            type="email"
            required
          />

          <!-- Phone -->
          <AppTextInput
            id="phone"
            v-model="phone"
            label="Phone number"
            placeholder="080XXXXXXXX"
            type="tel"
            required
          />

          <!-- Passwords -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppPasswordInput
              id="password"
              v-model="password"
              label="Password"
              placeholder="Min. 8 characters"
              required
            />
            <AppPasswordInput
              id="confirmPassword"
              v-model="confirmPassword"
              label="Confirm Password"
              placeholder="Repeat password"
              :error="!passwordsMatch ? 'Passwords do not match' : undefined"
              required
            />
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
            Create Account
          </BaseButton>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200" />
          </div>
          <div class="relative flex justify-center">
            <span class="bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
              Already have an account?
            </span>
          </div>
        </div>

        <!-- Login link -->
        <p class="text-center text-sm text-slate-500">
          <RouterLink
            to="/login"
            class="font-semibold text-primary hover:text-primary-800 transition-colors"
          >
            Sign in instead
          </RouterLink>
        </p>
      </div>

      <!-- Footer note -->
      <p class="mt-6 text-center text-xs text-slate-400">
        By creating an account, you agree to our Terms and Privacy Policy
      </p>
    </div>
  </div>
</template>
