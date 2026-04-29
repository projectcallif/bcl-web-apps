<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton } from '@bcl/ui'
import { MapPin, ShieldCheck, LocateFixed, AlertCircle } from 'lucide-vue-next'

const emit = defineEmits<{
  next: []
}>()

const isLoading = ref(false)
const error = ref('')

async function handleAllowLocation() {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by your browser.'
    return
  }

  isLoading.value = true
  error.value = ''

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords

        // Reverse geocoding using Nominatim (OpenStreetMap)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          },
        )

        if (!response.ok) throw new Error('Failed to fetch location details')

        const data = await response.json()
        const state = data.address?.state || ''

        // Normalize and check against allowed states
        const normalizedState = state.toLowerCase()
        const isAllowed = normalizedState.includes('lagos') || normalizedState.includes('ogun')

        if (isAllowed) {
          emit('next')
        } else {
          error.value = `Our services are not yet available in ${state || 'your current location'}. We currently only serve Lagos and Ogun states.`
        }
      } catch (err) {
        console.error('Location verification error:', err)
        error.value =
          'We could not verify your exact location. Please ensure you have a stable connection and try again.'
      } finally {
        isLoading.value = false
      }
    },
    (err) => {
      isLoading.value = false
      if (err.code === 1) {
        error.value =
          'Location access was denied. We need this permission to confirm you are within our service area.'
      } else {
        error.value = 'An error occurred while retrieving your location. Please try again.'
      }
    },
    { timeout: 10000 },
  )
}
</script>

<template>
  <div class="space-y-8 flex flex-col items-center text-center py-6">
    <div
      class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-primary-700"
    >
      <MapPin class="w-8 h-8" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-slate-900" @dblclick="$emit('next')">
        Allow Location Access
      </h2>
      <p class="text-sm text-slate-500 leading-relaxed px-4">
        We need your location to confirm you are within our service area. BCL currently serves
        customers in Lagos and Ogun states, Nigeria.
      </p>
    </div>

    <div class="space-y-4 text-left w-full">
      <div class="flex gap-3">
        <ShieldCheck class="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p class="text-xs text-slate-500 leading-relaxed">
          Your location is only used for eligibility verification and is not stored.
        </p>
      </div>
      <div class="flex gap-3">
        <LocateFixed class="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p class="text-xs text-slate-500 leading-relaxed">
          Service is currently available in Lagos and Ogun states only.
        </p>
      </div>
    </div>

    <div class="pt-8 w-full space-y-4">
      <div
        v-if="error"
        class="flex items-start gap-3 bg-rose-50 border border-rose-100 p-4 rounded-2xl text-left animate-in fade-in slide-in-from-top-2"
      >
        <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <p class="text-xs text-rose-700 font-medium leading-relaxed">{{ error }}</p>
      </div>

      <BaseButton class="w-full" size="lg" :loading="isLoading" @click="handleAllowLocation">
        <template #icon v-if="!isLoading">
          <LocateFixed class="w-4 h-4 mr-2" />
        </template>
        Allow Location Access
      </BaseButton>
    </div>
  </div>
</template>
