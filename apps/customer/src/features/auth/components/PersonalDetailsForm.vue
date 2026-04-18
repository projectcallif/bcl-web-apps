<script setup lang="ts">
import { ref } from 'vue'
import { AppTextInput, AppPasswordInput, AppSelect, AppDatePicker, BaseButton } from '@bcl/ui'

const props = defineProps<{
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  next: []
}>()

const formData = ref({ ...props.modelValue })

const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
]

const maritalStatusOptions = [
  { label: 'Single', value: 'SINGLE' },
  { label: 'Married', value: 'MARRIED' },
  { label: 'Divorced', value: 'DIVORCED' },
  { label: 'Widowed', value: 'WIDOWED' },
]

const countryOptions = [
  { label: 'Nigeria', value: 'NIGERIA' },
]

const stateOptions = [
  { label: 'Lagos', value: 'LAGOS' },
  { label: 'Ogun', value: 'OGUN' },
]

const cityOptions = [
  { label: 'Lagos Island', value: 'LAGOS_ISLAND' },
  { label: 'Victoria Island', value: 'VICTORIA_ISLAND' },
  { label: 'Ikeja', value: 'IKEJA' },
]

function handleSubmit() {
  emit('update:modelValue', formData.value)
  emit('next')
}

function _debugPrefill() {
  formData.value = {
    ...formData.value,
    email: 'user64@bcl.com',
    phone: '08012345983',
    password: 'Password@1',
    confirmPassword: 'Password@1',
    firstName: 'Oluwadamilola',
    lastName: 'Okonkwo',
    middleName: 'Chidera',
    gender: 'FEMALE',
    maritalStatus: 'SINGLE',
    dateOfBirth: '1992-06-15',
    houseNo: '12',
    streetAddress: 'Balogun Street, Victoria Island',
    country: 'NIGERIA',
    state: 'LAGOS',
    city: 'VICTORIA_ISLAND',
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div @dblclick="_debugPrefill">
      <h2 class="text-xl font-bold text-slate-900 tracking-tight mb-4">Sign Up Information</h2>
      <div class="space-y-4">
        <AppTextInput
          id="email"
          v-model="formData.email"
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          required
        />
        <AppTextInput
          id="phone"
          v-model="formData.phone"
          label="Phone Number"
          placeholder="+234   Phone Number"
          type="tel"
          required
        />
        <AppPasswordInput
          id="password"
          v-model="formData.password"
          label="Password"
          placeholder="Create a password"
          required
        />
        <AppPasswordInput
          id="confirmPassword"
          v-model="formData.confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          :error="formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined"
          required
        />
      </div>
    </div>

    <div>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight mb-4">Personal Information</h2>
      <div class="space-y-4">
        <AppTextInput
          id="firstName"
          v-model="formData.firstName"
          label="First Name"
          placeholder="Enter your first name"
          required
        />
        <AppTextInput
          id="lastName"
          v-model="formData.lastName"
          label="Last Name"
          placeholder="Enter your last name"
          required
        />
        <AppTextInput
          id="middleName"
          v-model="formData.middleName"
          label="Middle Name"
          placeholder="Enter your middle name"
        />
        <AppSelect
          id="gender"
          v-model="formData.gender"
          label="Gender"
          :options="genderOptions"
          placeholder="Select gender"
          required
        />
        <AppSelect
          id="maritalStatus"
          v-model="formData.maritalStatus"
          label="Marital Status"
          :options="maritalStatusOptions"
          placeholder="Select marital status"
          required
        />
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium leading-none text-slate-700">
            Date of Birth <span class="ml-0.5 text-red-500">*</span>
          </label>
          <AppDatePicker
            id="dob"
            v-model="formData.dateOfBirth"
            placeholder="Select Date"
          />
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight mb-4">Your Residential Information</h2>
      <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-1">
            <AppTextInput
              id="houseNo"
              v-model="formData.houseNo"
              label="House No"
              placeholder="12"
              required
            />
          </div>
          <div class="col-span-2">
            <AppTextInput
              id="streetAddress"
              v-model="formData.streetAddress"
              label="Street Address"
              placeholder="E.g. Balogun Street"
              required
            />
          </div>
        </div>
        <AppSelect
          id="country"
          v-model="formData.country"
          label="Country"
          :options="countryOptions"
          placeholder="Select country"
          required
        />
        <div class="grid grid-cols-2 gap-4">
          <AppSelect
            id="state"
            v-model="formData.state"
            label="State"
            :options="stateOptions"
            placeholder="Select state"
            required
          />
          <AppSelect
            id="city"
            v-model="formData.city"
            label="City"
            :options="cityOptions"
            placeholder="Select city"
            required
          />
        </div>
      </div>
    </div>

    <div class="pt-4">
      <BaseButton class="w-full" size="lg" type="submit">
        Continue
      </BaseButton>
    </div>
  </form>
</template>
