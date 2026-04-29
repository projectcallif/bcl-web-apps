<script setup lang="ts">
import { ref } from 'vue'
import { AppTextInput, AppSelect, AppDatePicker, BaseButton } from '@bcl/ui'
import { updatePersonalDetails } from '../api'
import type { ApiClientError, PersonalDetailsPayload } from '@bcl/types'

const props = defineProps<{
  modelValue: Partial<PersonalDetailsPayload>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Partial<PersonalDetailsPayload>]
  next: []
}>()

const formData = ref({ ...props.modelValue })
const loading = ref(false)
const error = ref('')

const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
]

const maritalStatusOptions = [
  { label: 'Single', value: 'SINGLE' },
  { label: 'Married', value: 'MARRIED' },
  { label: 'Divorced', value: 'DIVORCED' },
  { label: 'Widowed', value: 'WIDOWED' },
]

const countryOptions = [{ label: 'Nigeria', value: 'Nigeria' }]

const stateOptions = [
  { label: 'Lagos', value: 'Lagos' },
  { label: 'Ogun', value: 'Ogun' },
]

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    const payload: PersonalDetailsPayload = {
      firstName: formData.value.firstName!,
      lastName: formData.value.lastName!,
      middleName: formData.value.middleName,
      dateOfBirth: formData.value.dateOfBirth!,
      gender: formData.value.gender as 'MALE' | 'FEMALE',
      maritalStatus: formData.value.maritalStatus as 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED',
      addressNo: formData.value.addressNo!,
      residentialAddress: formData.value.residentialAddress!,
      country: formData.value.country!,
      state: formData.value.state!,
      city: formData.value.city!,
      lga: formData.value.lga!,
    }

    await updatePersonalDetails(payload)

    emit('update:modelValue', formData.value)
    emit('next')
  } catch (err) {
    error.value = (err as ApiClientError).message || 'Failed to update personal details'
  } finally {
    loading.value = false
  }
}

function _debugPrefill() {
  formData.value = {
    ...formData.value,
    firstName: 'Chisom',
    lastName: 'Udonsi',
    middleName: 'Raphael',
    gender: 'MALE',
    maritalStatus: 'SINGLE',
    dateOfBirth: '2002-05-02',
    addressNo: '12',
    residentialAddress: 'Broad Street Lne',
    country: 'Nigeria',
    state: 'Lagos',
    city: 'Lagos',
    lga: 'Lagos Island',
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-10">
    <div class="space-y-6">
      <div class="flex flex-col space-y-1" @dblclick="_debugPrefill">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">Personal Information</h2>
        <p class="text-xs text-slate-500">
          Please provide your legal names as they appear on your identity documents.
        </p>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <AppTextInput
            id="firstName"
            v-model="formData.firstName"
            label="First Name"
            placeholder="Chisom"
            required
            :disabled="loading"
          />
          <AppTextInput
            id="lastName"
            v-model="formData.lastName"
            label="Last Name"
            placeholder="Udonsi"
            required
            :disabled="loading"
          />
        </div>
        <AppTextInput
          id="middleName"
          v-model="formData.middleName"
          label="Middle Name"
          placeholder="Raphael"
          :disabled="loading"
        />
        <div class="grid grid-cols-2 gap-4">
          <AppSelect
            id="gender"
            v-model="formData.gender"
            label="Gender"
            :options="genderOptions"
            placeholder="Select"
            required
            :disabled="loading"
          />
          <AppSelect
            id="maritalStatus"
            v-model="formData.maritalStatus"
            label="Marital Status"
            :options="maritalStatusOptions"
            placeholder="Select"
            required
            :disabled="loading"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium leading-none text-slate-700">
            Date of Birth <span class="ml-0.5 text-red-500">*</span>
          </label>
          <AppDatePicker
            id="dob"
            v-model="formData.dateOfBirth"
            placeholder="YYYY-MM-DD"
            :disabled="loading"
          />
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="flex flex-col space-y-1">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">Residential Information</h2>
        <p class="text-xs text-slate-500">Enter your current residential address details.</p>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-1">
            <AppTextInput
              id="addressNo"
              v-model="formData.addressNo"
              label="House No"
              placeholder="12"
              required
              :disabled="loading"
            />
          </div>
          <div class="col-span-2">
            <AppTextInput
              id="residentialAddress"
              v-model="formData.residentialAddress"
              label="Street Address"
              placeholder="E.g. Broad Street Lne"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppSelect
            id="country"
            v-model="formData.country"
            label="Country"
            :options="countryOptions"
            placeholder="Select"
            required
            :disabled="loading"
          />
          <AppSelect
            id="state"
            v-model="formData.state"
            label="State"
            :options="stateOptions"
            placeholder="Select"
            required
            :disabled="loading"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppTextInput
            id="city"
            v-model="formData.city"
            label="City"
            placeholder="E.g. Ikeja"
            required
            :disabled="loading"
          />
          <AppTextInput
            id="lga"
            v-model="formData.lga"
            label="LGA"
            placeholder="E.g. Ikeja"
            required
            :disabled="loading"
          />
        </div>
      </div>
    </div>

    <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
      {{ error }}
    </div>

    <div class="pt-4 mt-auto">
      <BaseButton class="w-full" size="lg" type="submit" :loading="loading"> Continue </BaseButton>
    </div>
  </form>
</template>
