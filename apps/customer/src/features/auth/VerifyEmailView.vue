<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppTextInput, BaseButton, BrandLogo } from '@bcl/ui'
import { ApiClientError } from '@bcl/types'
import { useAuthStore } from './store'
import { resendEmailOtp } from './api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = computed(() => route.query.email as string || '')
const code = ref('')
const isLoading = ref(false)
const formError = ref('')

const canSubmit = computed(() => code.value.length >= 4)

// ── Resend logic ───────────────────────────────────────────────────────────────
const resendLoading = ref(false)
const resendTimer = ref(0)
const resendSuccess = ref(false)

function startTimer() {
  resendTimer.value = 60
  const interval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) clearInterval(interval)
  }, 1000)
}

async function handleResend() {
  if (resendTimer.value > 0 || !email.value) return
  resendLoading.value = true
  resendSuccess.value = false
  try {
    await resendEmailOtp({ identifier: email.value })
    resendSuccess.value = true
    startTimer()
  } catch (err) {
    formError.value = err instanceof ApiClientError ? err.message : 'Resend failed'
  } finally {
    resendLoading.value = false
  }
}

async function handleSubmit() {
  if (!canSubmit.value) return
  formError.value = ''
  isLoading.value = true
  try {
    await authStore.verifyEmail({ email: email.value, code: code.value })
    await router.push({ name: 'dashboard' })
  } catch (err) {
    formError.value = err instanceof ApiClientError ? err.message : 'Verification failed'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!email.value) {
    router.push({ name: 'login' })
  }
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-primary-50 to-slate-100 px-4 py-12"
  >
    <div class="w-full max-w-md">
      <!-- Brand mark -->
      <div class="mb-8 text-center text-primary-950">
        <BrandLogo class="mb-4" size="lg" />
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Verify your email
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          We've sent a 6-digit code to <strong>{{ email }}</strong>
        </p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-8"
      >
        <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
          <AppTextInput
            id="code"
            v-model="code"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            class="text-center tracking-[0.5em] font-mono text-xl"
            required
            autocomplete="one-time-code"
          />

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
            :disabled="!canSubmit"
            class="w-full"
          >
            Verify & Create Account
          </BaseButton>

          <div class="text-center">
            <p v-if="resendSuccess && resendTimer > 0" class="text-xs text-green-600 font-medium mb-3">
              New code sent successfully!
            </p>
            <p class="text-sm text-slate-500">
              Didn't receive the code?
              <button
                type="button"
                class="font-semibold text-primary transition-colors hover:text-primary-800 disabled:text-slate-300 disabled:cursor-not-allowed"
                :disabled="resendTimer > 0 || resendLoading"
                @click="handleResend"
              >
                {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
              </button>
            </p>
          </div>
        </form>
      </div>

      <!-- Back Link -->
      <p class="mt-6 text-center text-sm text-slate-500">
        <RouterLink
          to="/register"
          class="font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Entered the wrong email? Back to register
        </RouterLink>
      </p>
    </div>
  </div>
</template>
