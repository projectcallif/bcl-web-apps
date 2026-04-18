<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, AppTextInput } from '@bcl/ui'
import { Shield, CreditCard, ScanFace, FileBadge2, Info, CheckCircle2 } from 'lucide-vue-next'
import { initiateBvnVerification, sendBvnOtp, confirmBvnOtp } from '../api'
import type { ApiClientError } from '@bcl/types'

const emit = defineEmits<{
  next: []
}>()

const subStep = ref<'intro' | 'bvn' | 'channel' | 'otp'>('intro')
const bvn = ref('')
const otp = ref('')
const loading = ref(false)
const error = ref('')
const channels = ref<{ method: string; value: string }[]>([])
const selectedChannel = ref('')

function proceedToBvn() {
  subStep.value = 'bvn'
}

async function handleBvnSubmit() {
  if (bvn.value.length !== 11) return

  loading.value = true
  error.value = ''
  try {
    const response = await initiateBvnVerification({ bvn: bvn.value })
    channels.value = response.data.methods
    subStep.value = 'channel'
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Failed to initiate BVN verification'
  } finally {
    loading.value = false
  }
}

async function handleChannelSubmit() {
  if (!selectedChannel.value) return

  loading.value = true
  error.value = ''
  try {
    await sendBvnOtp({ method: selectedChannel.value })
    subStep.value = 'otp'
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Failed to send OTP'
  } finally {
    loading.value = false
  }
}

async function handleOtpConfirm() {
  if (otp.value.length !== 6) return

  loading.value = true
  error.value = ''
  try {
    await confirmBvnOtp({ otp: otp.value })
    emit('next')
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Verification failed. Please check your code.'
  } finally {
    loading.value = false
  }
}

function _debugPrefill() {
  if (subStep.value === 'bvn') {
    bvn.value = '12345678900'
  } else if (subStep.value === 'otp') {
    otp.value = '123456'
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- 1. Intro Sub-step -->
    <div v-if="subStep === 'intro'" class="space-y-8">
      <div class="flex justify-center pt-4">
        <div class="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
          <Shield class="w-10 h-10 text-primary-600" />
        </div>
      </div>

      <div class="space-y-4 text-center">
        <h2 class="text-2xl font-bold text-slate-900">Verify Your Identity</h2>
        <p class="text-sm text-slate-500 leading-relaxed">
          To comply with Nigerian financial regulations (KYC), we need to verify your identity
          before you can access loans.
        </p>
      </div>

      <div class="space-y-5">
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-tight font-mono">
          What you'll need
        </h3>
        <div class="space-y-5">
          <div class="flex gap-4">
            <CreditCard class="w-5 h-5 text-primary-600 shrink-0 mt-1" />
            <div>
              <p class="text-sm font-semibold text-slate-900">11-digit BVN</p>
              <p class="text-xs text-slate-500 mt-1">Dial *565*0# on your phone to retrieve it.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <ScanFace class="w-5 h-5 text-primary-600 shrink-0 mt-1" />
            <div>
              <p class="text-sm font-semibold text-slate-900">Selfie check</p>
              <p class="text-xs text-slate-500 mt-1">Match your face to your ID document.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <FileBadge2 class="w-5 h-5 text-primary-600 shrink-0 mt-1" />
            <div>
              <p class="text-sm font-semibold text-slate-900">Valid ID Document</p>
              <p class="text-xs text-slate-500 mt-1">
                NIN, Driver&apos;s licence, or International passport.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Info class="w-5 h-5 text-amber-500 shrink-0" />
        <p class="text-xs text-amber-800 leading-relaxed">
          Ensure you are in a well-lit environment. The process takes about 2 minutes.
        </p>
      </div>

      <div class="pt-4">
        <BaseButton class="w-full" size="lg" @click="proceedToBvn"> Start Verification </BaseButton>
      </div>
    </div>

    <!-- 2. BVN Entry -->
    <div v-else-if="subStep === 'bvn'" class="space-y-8">
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">BVN Verification</h2>
        <p class="text-sm text-slate-500">Enter your 11-digit Bank Verification Number.</p>
      </div>

      <form @submit.prevent="handleBvnSubmit" class="space-y-8">
        <div class="relative">
          <AppTextInput
            id="bvn"
            v-model="bvn"
            placeholder="00000000000"
            type="text"
            inputmode="numeric"
            maxlength="11"
            required
            :disabled="loading"
          />
          <div class="absolute right-3 -bottom-5 text-xs text-slate-400">{{ bvn.length }}/11</div>
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
            :disabled="bvn.length !== 11"
          >
            Proceed
          </BaseButton>
        </div>
      </form>
    </div>

    <!-- 3. Channel Selection -->
    <div v-else-if="subStep === 'channel'" class="space-y-8">
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Verification Method</h2>
        <p class="text-sm text-slate-500">Choose where to receive your verification code.</p>
      </div>

      <div class="space-y-3">
        <label
          v-for="item in channels"
          :key="item.method"
          class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all"
          :class="
            selectedChannel === item.method
              ? 'border-primary-600 bg-primary-50'
              : 'border-slate-200 hover:border-slate-300'
          "
          @click="selectedChannel = item.method"
        >
          <div class="space-y-0.5">
            <p class="text-sm font-semibold text-slate-900 capitalize">
              {{ item.method.replace('_', ' ') }}
            </p>
            <p class="text-xs text-slate-500">{{ item.value }}</p>
          </div>
          <CheckCircle2 v-if="selectedChannel === item.method" class="w-5 h-5 text-primary-600" />
          <div v-else class="w-5 h-5 rounded-full border border-slate-300" />
        </label>
      </div>

      <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
        {{ error }}
      </div>

      <div class="pt-4">
        <BaseButton
          class="w-full"
          size="lg"
          @click="handleChannelSubmit"
          :loading="loading"
          :disabled="!selectedChannel"
        >
          Send OTP
        </BaseButton>
        <button
          type="button"
          @click="subStep = 'bvn'"
          class="w-full text-center mt-4 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Change BVN
        </button>
      </div>
    </div>

    <!-- 4. OTP Confirmation -->
    <div v-else-if="subStep === 'otp'" class="space-y-8">
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">Confirm OTP</h2>
        <p class="text-sm text-slate-500">Enter the code sent to your selected delivery channel.</p>
      </div>

      <form @submit.prevent="handleOtpConfirm" class="space-y-8">
        <AppTextInput
          id="otp"
          v-model="otp"
          placeholder="000000"
          type="text"
          inputmode="numeric"
          maxlength="6"
          required
          :disabled="loading"
        />

        <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
          {{ error }}
        </div>

        <div class="pt-4">
          <BaseButton
            class="w-full"
            size="lg"
            type="submit"
            :loading="loading"
            :disabled="otp.length !== 6"
          >
            Verify & Complete
          </BaseButton>
          <button
            type="button"
            @click="subStep = 'channel'"
            class="w-full text-center mt-4 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Resend or Change Method
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
