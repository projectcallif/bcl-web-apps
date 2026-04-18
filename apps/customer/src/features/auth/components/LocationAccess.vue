<script setup lang="ts">
import { BaseButton } from '@bcl/ui'
import { MapPin, ShieldCheck, LocateFixed } from 'lucide-vue-next'

const emit = defineEmits<{
  next: []
}>()

function handleAllowLocation() {
  // In a real app, we would call navigator.geolocation.getCurrentPosition
  // For this mock, we just move to the next step.
  emit('next')
}
</script>

<template>
  <div class="space-y-8 flex flex-col items-center text-center py-6">
    <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-primary-700">
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

    <div class="pt-8 w-full">
      <BaseButton class="w-full" size="lg" @click="handleAllowLocation">
        <template #icon>
          <LocateFixed class="w-4 h-4 mr-2" />
        </template>
        Allow Location Access
      </BaseButton>
    </div>
  </div>
</template>
