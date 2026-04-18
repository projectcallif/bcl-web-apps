<script setup lang="ts">
import { ref, computed } from 'vue'
import { AppTextInput, BaseButton, AppToast } from '@bcl/ui'
import { Mail, Phone, ArrowRight } from 'lucide-vue-next'
import { initiateRegister } from '../api'
import { useAuthStore } from '../store'
import type { ApiClientError } from '@bcl/types'

const emit = defineEmits<{
  next: []
}>()

const authStore = useAuthStore()
const mode = ref<'email' | 'phone'>('email')
const identifier = ref('')
const loading = ref(false)
const error = ref('')

const isEmail = computed(() => mode.value === 'email')

async function handleSubmit() {
  if (!identifier.value) return

  loading.value = true
  error.value = ''

  try {
    const payload =
      mode.value === 'email' ? { email: identifier.value } : { phone: identifier.value }

    await initiateRegister(payload)

    // Store for the next step (OTP verification)
    authStore.setRegistrationData(
      identifier.value,
      mode.value === 'email' ? 'EMAIL_VERIFICATION' : 'PHONE_VERIFICATION',
    )

    emit('next')
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Failed to initiate registration'
  } finally {
    loading.value = false
  }
}

function _debugPrefill() {
  identifier.value = mode.value === 'email' ? 'test@bcl.com' : '+2348012345678'
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight" @dblclick="_debugPrefill">
        Create your account
      </h2>
      <p class="text-sm text-slate-500">
        Enter your {{ isEmail ? 'email address' : 'phone number' }} to get started. We'll send you a
        verification code.
      </p>
    </div>

    <div class="flex p-1 bg-slate-100 rounded-xl w-fit">
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
            ? 'bg-white text-primary-600 shadow-sm'
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
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700',
        ]"
      >
        Phone
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <AppTextInput
        v-if="mode === 'email'"
        id="email"
        v-model="identifier"
        label="Email Address"
        placeholder="you@example.com"
        type="email"
        required
        :disabled="loading"
        :error="error"
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
        :disabled="loading"
        :error="error"
      >
        <template #prefix>
          <Phone class="w-4 h-4 text-slate-400 ml-3" />
        </template>
      </AppTextInput>

      <div class="pt-4">
        <BaseButton
          class="w-full"
          size="lg"
          type="submit"
          :loading="loading"
          :disabled="!identifier"
        >
          Send Verification Code
          <ArrowRight class="w-4 h-4 ml-2" />
        </BaseButton>
      </div>
    </form>
  </div>
</template>
