<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, AppFileUpload } from '@bcl/ui'
import { Zap, Droplet, Trash2, CheckCircle2 } from 'lucide-vue-next'
import { getPresignedUrl, updateUtilityBill } from '../api'
import type { ApiClientError, UtilityBillUpdatePayload } from '@bcl/types'

const emit = defineEmits<{
  next: []
}>()

const formData = ref<{
  billType: string
  proofOfAddressFile: File | null
}>({
  billType: '',
  proofOfAddressFile: null,
})

const loading = ref(false)
const error = ref('')

const billTypes = [
  { id: 'electricityBill', label: 'Electric Bill', icon: Zap },
  { id: 'waterBill', label: 'Water Bill', icon: Droplet },
  { id: 'wasteBill', label: 'Waste Management Bill', icon: Trash2 },
]

async function uploadFile(file: File) {
  const { data } = await getPresignedUrl({
    folder: 'utility-bills',
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
  if (!formData.value.billType || !formData.value.proofOfAddressFile) return

  loading.value = true
  error.value = ''

  try {
    const objectUrl = await uploadFile(formData.value.proofOfAddressFile)

    await updateUtilityBill({
      utilityBillUrl: objectUrl,
      utilityBillType: formData.value.billType,
    } as UtilityBillUpdatePayload)

    emit('next')
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Failed to submit utility bill'
  } finally {
    loading.value = false
  }
}

function handleError(msg: string) {
  error.value = msg
}

function _debugPrefill() {
  formData.value.billType = 'waterBill'
  formData.value.proofOfAddressFile = new File([''], 'debug_bill.png', { type: 'image/png' })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">Proof of Address</h2>
      <p class="text-sm text-slate-500">
        Upload a utility bill issued within the last 3 months to verify your residential address.
      </p>
    </div>

    <!-- Bill Type Selection -->
    <div class="space-y-3">
      <label class="block text-sm font-semibold text-slate-900">Select Your Bill Type</label>
      <div class="space-y-2">
        <label
          v-for="type in billTypes"
          :key="type.id"
          class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors relative"
          :class="[
            formData.billType === type.id
              ? 'border-primary-600 bg-primary-50/50'
              : 'border-slate-200 hover:border-slate-300',
            loading ? 'pointer-events-none opacity-50' : '',
          ]"
        >
          <div class="flex items-center gap-3">
            <component
              :is="type.icon"
              class="w-5 h-5"
              :class="formData.billType === type.id ? 'text-primary-600' : 'text-slate-400'"
            />
            <span
              class="text-sm font-medium"
              :class="formData.billType === type.id ? 'text-primary-900' : 'text-slate-700'"
            >
              {{ type.label }}
            </span>
          </div>
          <input
            type="radio"
            name="billType"
            :value="type.id"
            v-model="formData.billType"
            class="sr-only"
            :disabled="loading"
          />
          <CheckCircle2 v-if="formData.billType === type.id" class="w-5 h-5 text-primary-600" />
        </label>
      </div>
    </div>

    <!-- Upload Box -->
    <AppFileUpload
      id="address-proof-upload"
      v-model="formData.proofOfAddressFile"
      label="Upload Document"
      hint="JPG, PNG or PDF accepted. Max 5MB."
      accept=".jpg,.jpeg,.png,.pdf"
      :max-size-mb="5"
      :disabled="loading"
      @error="handleError"
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
        :disabled="!formData.billType || !formData.proofOfAddressFile"
      >
        Complete Registration
      </BaseButton>
    </div>
  </form>
</template>
