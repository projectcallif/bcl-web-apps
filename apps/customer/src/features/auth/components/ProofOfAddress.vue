<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, AppFileUpload } from '@bcl/ui'
import { Zap, Droplet, Trash2, CheckCircle2 } from 'lucide-vue-next'

const emit = defineEmits<{
  next: []
}>()

const formData = ref({
  billType: '',
  proofOfAddressFile: null as File | null,
})

const billTypes = [
  { id: 'electric', label: 'Electric Bill', icon: Zap },
  { id: 'water', label: 'Water Bill', icon: Droplet },
  { id: 'waste', label: 'Waste Management Bill', icon: Trash2 },
]

function handleError(msg: string) {
  console.error(msg)
}

function handleSubmit() {
  emit('next')
}

function _debugPrefill() {
  formData.value.billType = 'water'
  formData.value.proofOfAddressFile = new File([''], 'debug_bill.png', { type: 'image/png' })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">
        Proof of Address
      </h2>
      <p class="text-sm text-slate-500">
        Upload a utility bill issued within the last 3 months.
      </p>
    </div>

    <!-- Bill Type Selection -->
    <div class="space-y-3">
      <label class="block text-sm font-semibold text-slate-900">Select Your Bill Type</label>
      <div class="space-y-2">
        <label
          v-for="type in billTypes"
          :key="type.id"
          class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors"
          :class="formData.billType === type.id ? 'border-primary-600 bg-primary-50/50' : 'border-slate-200 hover:border-slate-300'"
        >
          <div class="flex items-center gap-3">
            <component :is="type.icon" class="w-5 h-5" :class="formData.billType === type.id ? 'text-primary-600' : 'text-slate-400'" />
            <span class="text-sm font-medium" :class="formData.billType === type.id ? 'text-primary-900' : 'text-slate-700'">
              {{ type.label }}
            </span>
          </div>
          <input
            type="radio"
            name="billType"
            :value="type.id"
            v-model="formData.billType"
            class="sr-only"
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
        hint="JPG, PNG or PDF accepted."
        accept=".jpg,.png,.pdf"
        :max-size-mb="5"
        @error="handleError"
      />

    <div class="pt-4">
      <BaseButton class="w-full" size="lg" type="submit" :disabled="!formData.billType || !formData.proofOfAddressFile">
        Submit
      </BaseButton>
    </div>
  </form>
</template>
