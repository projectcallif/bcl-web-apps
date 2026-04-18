<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AppProgressBar, BrandLogo } from '@bcl/ui'
import { ArrowLeft } from 'lucide-vue-next'

import RegistrationRequirements from './components/RegistrationRequirements.vue'
import PersonalDetailsForm from './components/PersonalDetailsForm.vue'
import LocationAccess from './components/LocationAccess.vue'
import OTPVerification from './components/OTPVerification.vue'
import EmploymentInfo from './components/EmploymentInfo.vue'
import ProofOfAddress from './components/ProofOfAddress.vue'
import IdentityVerification from './components/IdentityVerification.vue'
import RegistrationSuccess from './components/RegistrationSuccess.vue'

const router = useRouter()

const currentStep = ref(1)
const TOTAL_STEPS = 8

const formData = ref<Record<string, any>>({})

const currentComponent = computed(() => {
  switch (currentStep.value) {
    case 1:
      return RegistrationRequirements
    case 2:
      return PersonalDetailsForm
    case 3:
      return LocationAccess
    case 4:
      return OTPVerification
    case 5:
      return EmploymentInfo
    case 6:
      return ProofOfAddress
    case 7:
      return IdentityVerification
    case 8:
      return RegistrationSuccess
    default:
      return RegistrationRequirements
  }
})

const progressPercentage = computed(() => {
  // We want to show progress across the overall flow.
  // Step 1 is 0%, Step 7 is 100%. Step 8 has no progress bar.
  if (currentStep.value >= TOTAL_STEPS) return 100
  return Math.max(0, ((currentStep.value - 1) / (TOTAL_STEPS - 2)) * 100)
})

function goNext() {
  if (currentStep.value < TOTAL_STEPS) {
    currentStep.value++
  } else {
    // End of full flow
    router.push({ name: 'dashboard' })
  }
}

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.push({ name: 'login' })
  }
}

function onIdentityComplete(bvn: string) {
  formData.value.bvn = bvn

  // Here we would hit the final API endpoint. For now, mock success:
  goNext()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 relative font-sans text-slate-900">
    <!-- Top Progress Bar -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <AppProgressBar
        v-if="currentStep > 1 && currentStep < TOTAL_STEPS"
        :progress="progressPercentage"
        color-class="bg-primary-600 rounded-none"
        track-class="bg-slate-200 rounded-none"
        class="h-1.5"
      />
    </div>

    <!-- Header Navigation -->
    <header
      v-if="currentStep < TOTAL_STEPS"
      class="px-4 py-4 sm:px-6 lg:px-8 mt-1.5 flex items-center justify-between z-40 bg-slate-50 sticky top-0"
    >
      <button
        @click="goBack"
        class="w-10 h-10 flex items-center justify-center -ml-2 text-primary-900 hover:text-primary-700 transition-colors rounded-full hover:bg-slate-200/50"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>

      <div v-if="currentStep === 1" class="flex-1 text-center pr-8">
        <BrandLogo size="md" class="inline-block" />
      </div>
      <div v-else class="flex-1 text-center pr-8 font-semibold text-slate-800">
        <span v-if="currentStep === 2">Personal Details</span>
        <span v-else-if="currentStep === 3">Location Access</span>
        <span v-else-if="currentStep === 4">Verify OTP</span>
        <span v-else-if="currentStep === 5">Employment Information</span>
        <span v-else-if="currentStep === 6">Proof of Address</span>
        <span v-else-if="currentStep === 7">Identity Verification</span>
      </div>
    </header>

    <!-- Main Content Flow -->
    <main
      class="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-6 max-w-lg mx-auto z-10 w-full"
    >
      <div class="w-full">
        <!-- Transition wrapper for smooth stepping -->
        <transition name="fade-slide" mode="out-in">
          <component
            :is="currentComponent"
            v-model="formData"
            @next="goNext"
            @complete="onIdentityComplete"
          />
        </transition>
      </div>

      <div v-if="currentStep === 1" class="mt-auto pt-10 text-center pb-8">
        <p class="text-sm text-slate-500">
          Already have an account?
          <RouterLink
            to="/login"
            class="font-semibold text-primary-600 hover:text-primary-800 transition-colors"
          >
            Sign in
          </RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>

<style>
/* Un-scoped transitions so child components fade beautifully */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px) translateY(5px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px) translateY(-5px);
}
</style>
