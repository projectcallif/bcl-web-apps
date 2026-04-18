<script setup lang="ts">
import { ref } from 'vue'
import { AppTextInput, AppSelect, AppFileUpload, BaseButton } from '@bcl/ui'

const emit = defineEmits<{
  next: []
}>()

const formData = ref({
  employmentStatus: '',
  employerName: '',
  jobTitle: '',
  workEmail: '',
  monthlyIncome: '',
  proofOfEmploymentFile: null as File | null,
})

const employmentStatusOptions = [
  { label: 'Employed', value: 'EMPLOYED' },
  { label: 'Self-Employed', value: 'SELF_EMPLOYED' },
  { label: 'Unemployed', value: 'UNEMPLOYED' },
]

function handleSubmit() {
  emit('next')
}

function handleError(msg: string) {
  console.error(msg)
}

function _debugPrefill() {
  formData.value = {
    employmentStatus: 'EMPLOYED',
    employerName: 'Acme Technologies Ltd',
    jobTitle: 'Software Engineer',
    workEmail: 'john.doe@acmetechnologies.com',
    monthlyIncome: '350000',
    proofOfEmploymentFile: new File([''], 'debug_placeholder.jpg', { type: 'image/jpeg' }),
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">
        Employment Information
      </h2>
      <p class="text-sm text-slate-500">
        Help us understand your financial situation.
      </p>
    </div>

    <div class="space-y-4">
      <AppSelect
        id="employmentStatus"
        v-model="formData.employmentStatus"
        label="Employment Status"
        :options="employmentStatusOptions"
        placeholder="Select status"
        required
      />

      <AppTextInput
        id="employerName"
        v-model="formData.employerName"
        label="Employer / Business Name"
        placeholder="Acme Inc."
        required
      />

      <AppTextInput
        id="jobTitle"
        v-model="formData.jobTitle"
        label="Job Title / Role"
        placeholder="Engineer"
        required
      />

      <AppTextInput
        id="workEmail"
        v-model="formData.workEmail"
        label="Work Email (Optional)"
        placeholder="you@company.com"
        type="email"
      />

      <AppTextInput
        id="monthlyIncome"
        v-model="formData.monthlyIncome"
        label="Monthly Income (₦)"
        placeholder="0.00"
        type="number"
        required
      />

      <AppFileUpload
        id="proof-upload"
        v-model="formData.proofOfEmploymentFile"
        label="Proof of Employment"
        hint="Upload an offer letter, payslip, or employment contract."
        accept=".jpg,.png,.pdf"
        :max-size-mb="5"
        @error="handleError"
      />
    </div>

    <div class="pt-4">
      <BaseButton class="w-full" size="lg" type="submit">
        Continue
      </BaseButton>
    </div>
  </form>
</template>
