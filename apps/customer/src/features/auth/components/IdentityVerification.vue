<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, AppTextInput } from '@bcl/ui'
import { Shield, CreditCard, ScanFace, FileBadge2, Info } from 'lucide-vue-next'

const emit = defineEmits<{
  complete: [bvn: string]
}>()

const subStep = ref<'intro' | 'bvn' | 'mono-intro'>('intro')
const bvn = ref('')

function proceedToBvn() {
  subStep.value = 'bvn'
}

function handleBvnSubmit() {
  if (bvn.value.length === 11) {
    subStep.value = 'mono-intro'
  }
}

function handleMonoSubmit() {
  emit('complete', bvn.value)
}

function _debugPrefill() {
  bvn.value = '12345678901'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Intro Sub-step -->
    <div v-if="subStep === 'intro'" class="space-y-8">
      <div class="flex justify-center pt-4">
        <div class="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
          <Shield class="w-10 h-10 text-primary-600" />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-slate-900 text-center">Verify Your Identity</h2>
        <p class="text-sm text-slate-500 text-center leading-relaxed">
          To comply with Nigerian financial regulations (KYC), we need to verify your identity
          before you can access loans.
        </p>
      </div>

      <div class="space-y-5">
        <h3 class="text-sm font-bold text-slate-900">What you'll need</h3>

        <div class="space-y-5">
          <div class="flex gap-4">
            <div class="shrink-0 flex justify-center mt-1">
              <CreditCard class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Bank Verification Number (BVN)</p>
              <p class="text-xs text-slate-500 mt-1">
                Your 11-digit BVN. Dial *565*0# on your phone to retrieve it.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="shrink-0 flex justify-center mt-1">
              <ScanFace class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Selfie check</p>
              <p class="text-xs text-slate-500 mt-1">
                A quick selfie to match your face to your ID document.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="shrink-0 flex justify-center mt-1">
              <FileBadge2 class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Government-issued ID</p>
              <p class="text-xs text-slate-500 mt-1">
                NIN, driver's licence, or international passport.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#FFF9EB] border border-[#FDE68A] rounded-xl p-4 flex gap-3">
        <Info class="w-5 h-5 text-[#F59E0B] shrink-0" />
        <p class="text-xs text-[#92400E] leading-relaxed">
          The process takes about 2 minutes. Please ensure you are in a well-lit environment with
          your ID document ready.
        </p>
      </div>

      <div class="pt-4">
        <BaseButton class="w-full" size="lg" @click="proceedToBvn"> Start Verification </BaseButton>
      </div>
    </div>

    <!-- BVN Input Sub-step -->
    <form v-else-if="subStep === 'bvn'" @submit.prevent="handleBvnSubmit" class="space-y-8">
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">BVN Verification</h2>
        <p class="text-sm text-slate-500">Enter your 11-digit Bank Verification Number.</p>
      </div>

      <div class="space-y-8">
        <div class="relative">
          <AppTextInput
            id="bvn"
            v-model="bvn"
            placeholder="00000000000"
            type="text"
            inputmode="numeric"
            maxlength="11"
            required
          />
          <div class="absolute right-3 -bottom-5 text-xs text-slate-400 pointer-events-none">
            {{ bvn.length }}/11
          </div>
        </div>

        <div class="bg-[#FFF9EB] border border-[#FDE68A] rounded-xl p-4 flex gap-3">
          <Info class="w-5 h-5 text-[#F59E0B] shrink-0" />
          <p class="text-xs text-[#92400E] leading-relaxed">
            Your BVN is an 11-digit number assigned by your bank. Dial *565*0# on your phone to
            retrieve it. Your BVN does not give us access to your bank account.
          </p>
        </div>
      </div>

      <div class="pt-4">
        <BaseButton class="w-full" size="lg" type="submit" :disabled="bvn.length !== 11">
          Proceed
        </BaseButton>
      </div>
    </form>

    <!-- Mono SDK Intro Sub-step -->
    <div v-else-if="subStep === 'mono-intro'" class="space-y-8">
      <div class="flex justify-center pt-4">
        <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <Shield class="w-10 h-10 text-primary-600" />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-slate-900 text-center">One last step</h2>
        <p class="text-sm text-slate-500 text-center leading-relaxed">
          To comply with Nigerian financial regulations (KYC), we need to verify your identity
          before approving your loan account.
        </p>
      </div>

      <div class="space-y-5">
        <h3 class="text-sm font-bold text-slate-900">What to expect</h3>

        <div class="space-y-5">
          <div class="flex gap-4">
            <div class="shrink-0 flex justify-center mt-1">
              <div class="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                <ScanFace class="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Selfie check</p>
              <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Take a short selfie so we can match your face to your ID.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="shrink-0 flex justify-center mt-1">
              <div class="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                <CreditCard class="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">ID document scan</p>
              <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Capture your NIN, driver's licence, or international passport.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="shrink-0 flex justify-center mt-1">
              <div class="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                <Shield class="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Secure & private</p>
              <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Your data is encrypted and used solely for identity verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#FFF9EB] border border-[#FDE68A] rounded-xl p-4 flex gap-3">
        <Info class="w-5 h-5 text-[#F59E0B] shrink-0" />
        <p class="text-xs text-[#92400E] leading-relaxed">
          The process takes about 1 minutes. Please have your ID document ready and ensure you are
          in a well-lit environment.
        </p>
      </div>

      <div class="pt-4">
        <BaseButton class="w-full" size="lg" @click="handleMonoSubmit">
          Proceed to Verify My Identity
        </BaseButton>
      </div>
    </div>
  </div>
</template>
