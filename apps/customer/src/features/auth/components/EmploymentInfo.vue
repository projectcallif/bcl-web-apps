<script setup lang="ts">
import { ref, watch } from 'vue'
import { AppTextInput, AppSelect, AppFileUpload, BaseButton, AppDatePicker } from '@bcl/ui'
import { getPresignedUrl, updateEmployment } from '../api'
import type { ApiClientError, EmploymentStatus, EmploymentUpdatePayload } from '@bcl/types'

const emit = defineEmits<{
  next: []
}>()

const formData = ref<{
  employmentStatus: EmploymentStatus | ''
  employerName: string
  employerAddress: string
  jobTitle: string
  workEmail: string
  monthlyIncome: string
  salaryDay: string
  employmentStartDate: string
  proofOfEmploymentFile: File | null
}>({
  employmentStatus: '',
  employerName: '',
  employerAddress: '',
  jobTitle: '',
  workEmail: '',
  monthlyIncome: '',
  salaryDay: '',
  employmentStartDate: '',
  proofOfEmploymentFile: null,
})

const loading = ref(false)
const error = ref('')

const employmentStatusOptions = [
  { label: 'Employed', value: 'EMPLOYED' },
  { label: 'Self-Employed', value: 'SELF_EMPLOYED' },
  { label: 'Business Owner', value: 'BUSINESS_OWNER' },
  { label: 'Student', value: 'STUDENT' },
  { label: 'Unemployed', value: 'UNEMPLOYED' },
  { label: 'Retired', value: 'RETIRED' },
]

watch(
  () => formData.value.employmentStatus,
  () => {
    formData.value.employerName = ''
    formData.value.employerAddress = ''
    formData.value.jobTitle = ''
    formData.value.workEmail = ''
    formData.value.monthlyIncome = ''
    formData.value.salaryDay = ''
    formData.value.employmentStartDate = ''
    formData.value.proofOfEmploymentFile = null
  },
)

async function uploadFile(
  file: File,
  folder: 'identity-documents' | 'utility-bills' | 'profile-photos',
) {
  const { data } = await getPresignedUrl({
    folder,
    fileName: file.name,
  })

  try {
    const response = await fetch(data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!response.ok) {
      throw new Error(`S3 upload failed with status: ${response.status}`)
    }
  } catch (err) {
    console.error('S3 Upload Error:', err)
    throw new Error('Document upload failed.')
  }

  return data.objectUrl
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    let proofUrl = ''
    if (
      (formData.value.employmentStatus === 'EMPLOYED' ||
        formData.value.employmentStatus === 'BUSINESS_OWNER') &&
      !formData.value.proofOfEmploymentFile
    ) {
      error.value = 'Proof of employment is required'
      loading.value = false
      return
    }

    if (formData.value.proofOfEmploymentFile) {
      proofUrl = await uploadFile(formData.value.proofOfEmploymentFile, 'identity-documents')
    }

    const payload: EmploymentUpdatePayload = {
      employmentStatus: formData.value.employmentStatus as EmploymentStatus,
      monthlyIncome: Number(formData.value.monthlyIncome),
    }

    if (formData.value.employerName) payload.employerName = formData.value.employerName
    if (formData.value.employerAddress) payload.employerAddress = formData.value.employerAddress
    if (formData.value.jobTitle) payload.jobTitle = formData.value.jobTitle
    if (formData.value.workEmail) payload.workEmail = formData.value.workEmail
    if (formData.value.salaryDay) payload.salaryDay = Number(formData.value.salaryDay)
    if (formData.value.employmentStartDate)
      payload.employmentStartDate = formData.value.employmentStartDate
    if (proofUrl) payload.proofOfEmploymentUrl = proofUrl

    await updateEmployment(payload)
    emit('next')
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Failed to update employment information'
  } finally {
    loading.value = false
  }
}

function handleError(msg: string) {
  error.value = msg
}

function _debugPrefill() {
  formData.value = {
    employmentStatus: 'EMPLOYED',
    employerName: 'Acme Corp Ltd',
    employerAddress: '5 Victoria Island, Lagos',
    jobTitle: 'Software Engineer',
    workEmail: 'chisom.udonsi@acmecorp.com',
    monthlyIncome: '350000',
    salaryDay: '25',
    employmentStartDate: '2021-03-01',
    proofOfEmploymentFile: new File([''], 'proof.jpg', { type: 'image/jpeg' }),
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8 pb-10">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">
        Employment Information
      </h2>
      <p class="text-sm text-slate-500">
        Tell us about your work and income to help us process your loan.
      </p>
    </div>

    <div class="space-y-6">
      <AppSelect
        id="employmentStatus"
        v-model="formData.employmentStatus"
        label="Employment Status"
        :options="employmentStatusOptions"
        placeholder="Select status"
        required
        :disabled="loading"
      />

      <template
        v-if="
          formData.employmentStatus === 'EMPLOYED' || formData.employmentStatus === 'BUSINESS_OWNER'
        "
      >
        <AppTextInput
          id="employerName"
          v-model="formData.employerName"
          label="Employer / Business Name"
          placeholder="E.g. Acme Inc."
          required
          :disabled="loading"
        />

        <AppTextInput
          id="employerAddress"
          v-model="formData.employerAddress"
          label="Employer Address"
          placeholder="Enter work address"
          required
          :disabled="loading"
        />

        <div class="grid grid-cols-2 gap-4">
          <AppTextInput
            id="jobTitle"
            v-model="formData.jobTitle"
            label="Job Title"
            placeholder="Engineer"
            required
            :disabled="loading"
          />
          <AppTextInput
            id="salaryDay"
            v-model="formData.salaryDay"
            label="Salary Day"
            placeholder="E.g. 25"
            type="number"
            min="1"
            max="31"
            :disabled="loading"
          />
        </div>

        <AppTextInput
          id="workEmail"
          v-model="formData.workEmail"
          label="Work Email"
          placeholder="you@company.com"
          type="email"
          :disabled="loading"
        />

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium leading-none text-slate-700">
            Employment Start Date
          </label>
          <AppDatePicker
            id="startDate"
            v-model="formData.employmentStartDate"
            placeholder="YYYY-MM-DD"
            :disabled="loading"
          />
        </div>

        <AppFileUpload
          id="proof-upload"
          v-model="formData.proofOfEmploymentFile"
          label="Proof of Employment"
          hint="Upload your offer letter, payslip, or staff ID card."
          accept=".jpg,.jpeg,.png,.pdf"
          :max-size-mb="5"
          :disabled="loading"
          @error="handleError"
        />
      </template>

      <AppTextInput
        id="monthlyIncome"
        v-model="formData.monthlyIncome"
        label="Monthly Income (₦)"
        placeholder="0.00"
        type="number"
        required
        :disabled="loading"
      />
    </div>

    <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
      {{ error }}
    </div>

    <div class="pt-4">
      <BaseButton class="w-full" size="lg" type="submit" :loading="loading"> Continue </BaseButton>
    </div>
  </form>
</template>
