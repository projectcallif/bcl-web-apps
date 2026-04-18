<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseButton, AppPasswordInput, AppToast } from '@bcl/ui'
import { RefreshCw, ShieldCheck } from 'lucide-vue-next'
import { useAuthStore } from '../store'
import { verifyRegistrationOtp, resendRegistrationOtp } from '../api'
import type { ApiClientError, VerifyRegisterOtpPayload } from '@bcl/types'

const emit = defineEmits<{
  next: []
}>()

const authStore = useAuthStore()
const otpValues = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const resendLoading = ref(false)
const error = ref('')

const identifier = computed(() => authStore.registrationIdentifier || 'your email/phone')

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Keep only the first character
  otpValues.value[index] = value.slice(-1)

  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

async function handleSubmit() {
  const code = otpValues.value.join('')
  if (code.length !== 6) return
  if (!password.value || password.value !== confirmPassword.value) return

  loading.value = true
  error.value = ''

  try {
    const payload: VerifyRegisterOtpPayload = {
      type: authStore.registrationType!,
      code,
      password: password.value,
    }

    if (authStore.registrationType === 'EMAIL_VERIFICATION') {
      payload.email = authStore.registrationIdentifier!
    } else {
      payload.phone = authStore.registrationIdentifier!
    }

    const response = await verifyRegistrationOtp(payload)

    // Auth store handles token/user persistence
    authStore.token = response.data.accessToken
    authStore.user = response.data.user
    localStorage.setItem('bcl_customer_token', response.data.accessToken)

    emit('next')
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Verification failed. Please check your code.'
  } finally {
    loading.value = false
  }
}

async function handleResend() {
  if (!authStore.registrationIdentifier || !authStore.registrationType) return

  resendLoading.value = true
  try {
    const payload: Omit<VerifyRegisterOtpPayload, 'code' | 'password'> = {
      type: authStore.registrationType,
    }
    if (authStore.registrationType === 'EMAIL_VERIFICATION') {
      payload.email = authStore.registrationIdentifier
    } else {
      payload.phone = authStore.registrationIdentifier
    }

    await resendRegistrationOtp(payload)
    // Show success message (AppToast if available, or just console)
    console.log('OTP Resent')
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Failed to resend OTP'
  } finally {
    resendLoading.value = false
  }
}

function _debugPrefill() {
  otpValues.value = ['1', '2', '3', '4', '5', '6']
  password.value = 'Ace12345$'
  confirmPassword.value = 'Ace12345$'
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600"
        >
          <ShieldCheck class="w-6 h-6" />
        </div>
        <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">
          Verify your identity
        </h2>
      </div>
      <p class="text-sm text-slate-500 leading-relaxed">
        We've sent a 6-digit verification code to
        <span class="font-semibold text-slate-700">{{ identifier }}</span
        >. Please enter it below to complete your account setup.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div class="space-y-6">
        <div class="flex justify-between gap-2 sm:gap-4 max-w-sm mx-auto">
          <input
            v-for="(_, index) in 6"
            :key="index"
            ref="inputRefs"
            v-model="otpValues[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold border-b-2 rounded-none border-slate-300 focus:border-primary-600 focus:outline-none bg-transparent transition-colors"
            @input="onInput(index, $event)"
            @keydown="onKeydown(index, $event)"
            :disabled="loading || resendLoading"
          />
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="handleResend"
            :disabled="loading || resendLoading"
            class="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': resendLoading }" />
            Resend Code
          </button>
        </div>
      </div>

      <div class="space-y-4 pt-4 border-t border-slate-100">
        <h3 class="text-sm font-bold text-slate-900">Set your password</h3>
        <AppPasswordInput
          id="password"
          v-model="password"
          label="Password"
          placeholder="Create a strong password"
          required
          :disabled="loading"
        />
        <AppPasswordInput
          id="confirmPassword"
          v-model="confirmPassword"
          label="Confirm Password"
          placeholder="Repeat your password"
          required
          :disabled="loading"
          :error="
            password && confirmPassword && password !== confirmPassword
              ? 'Passwords do not match'
              : undefined
          "
        />
      </div>

      <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
        {{ error }}
      </div>

      <div class="pt-4">
        <BaseButton
          class="w-full"
          size="lg"
          type="submit"
          :loading="loading"
          :disabled="otpValues.join('').length !== 6 || !password || password !== confirmPassword"
        >
          Create Account
        </BaseButton>
      </div>
    </form>
  </div>
</template>
