<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AppTextInput, BaseButton, BrandLogo } from '@bcl/ui'
import { Mail, Phone } from 'lucide-vue-next'
import { ApiClientError } from '@bcl/types'
import { forgotPassword } from './api'

const router = useRouter()
const mode = ref<'email' | 'phone'>('email')

const identifier = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const formError = ref('')

const isEmail = computed(() => mode.value === 'email')

async function handleSubmit(): Promise<void> {
  formError.value = ''
  isLoading.value = true
  try {
    const payload =
      mode.value === 'email' ? { email: identifier.value } : { phone: identifier.value }
    await forgotPassword(payload)
    isSuccess.value = true
    router.push({
      name: 'reset-password',
      query: {
        [mode.value]: identifier.value,
      },
    })
  } catch (err) {
    formError.value =
      err instanceof ApiClientError ? err.message : 'Request failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function _debugPrefill() {
  identifier.value = mode.value === 'email' ? 'udonsichisom02@gmail.com' : '+2347063265056'
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
          Forgot password?
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Enter your registered {{ isEmail ? 'email' : 'phone number' }} to reset your password
        </p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-8"
      >
        <div v-if="isSuccess" class="text-center animate-in fade-in zoom-in duration-300">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Instructions Sent</h2>
          <p class="text-sm text-slate-500 mb-8">
            We've sent password reset instructions to <strong>{{ identifier }}</strong> if it's
            associated with an account.
          </p>
          <BaseButton component="router-link" to="/login" variant="primary" class="w-full">
            Back to Sign In
          </BaseButton>
        </div>

        <form v-else class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <div class="flex p-1 bg-slate-100 rounded-xl w-fit mx-auto mb-2">
            <button
              type="button"
              @click="
                () => {
                  mode = 'email'
                  identifier = ''
                }
              "
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                mode === 'email'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              Email
            </button>
            <button
              type="button"
              @click="
                () => {
                  mode = 'phone'
                  identifier = ''
                }
              "
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                mode === 'phone'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              Phone
            </button>
          </div>

          <AppTextInput
            v-if="mode === 'email'"
            id="email"
            v-model="identifier"
            label="Email Address"
            placeholder="you@example.com"
            type="email"
            required
            :disabled="isLoading"
          >
            <template #prefix>
              <Mail class="w-4 h-4 text-slate-400 ml-3" />
            </template>
          </AppTextInput>

          <AppTextInput
            v-else
            id="phone"
            v-model="identifier"
            label="Phone Number"
            placeholder="+234 ..."
            type="tel"
            required
            :disabled="isLoading"
          >
            <template #prefix>
              <Phone class="w-4 h-4 text-slate-400 ml-3" />
            </template>
          </AppTextInput>

          <!-- Form-level error -->
          <div
            v-if="formError"
            role="alert"
            class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {{ formError }}
          </div>

          <BaseButton type="submit" variant="primary" size="lg" :loading="isLoading" class="w-full">
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
