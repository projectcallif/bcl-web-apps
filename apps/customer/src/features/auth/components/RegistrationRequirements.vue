<script setup lang="ts">
import { BaseButton } from '@bcl/ui'
import { Calendar, Fingerprint, FileText, RefreshCw } from 'lucide-vue-next'

defineEmits<{
  next: []
}>()

const requirements = [
  {
    title: 'Age Requirement',
    description: 'You must be at least 18 years old to apply for a loan.',
    icon: Calendar,
  },
  {
    title: 'Identity Verification',
    description: 'A valid BVN (Bank Verification Number) is required to confirm your identity.',
    icon: Fingerprint,
  },
  {
    title: 'Complete Documentation',
    description: 'Provide a utility bill (Electric, Water, or Waste Management) as proof of address.',
    icon: FileText,
  },
  {
    title: 'Automated Repayment Setup',
    description: 'Repayments are automatically deducted from your registered bank account on the due date.',
    icon: RefreshCw,
  },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col space-y-1">
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight" @dblclick="$emit('next')">
        Before you begin
      </h2>
      <p class="text-sm text-slate-500">
        Make sure you meet the following requirements to complete your registration.
      </p>
    </div>

    <div class="space-y-4">
      <div
        v-for="(req, index) in requirements"
        :key="index"
        class="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-[0_2px_4px_rgb(0,0,0,0.02)]"
      >
        <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
          <component :is="req.icon" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-semibold text-slate-900 mb-0.5">{{ req.title }}</h3>
          <p class="text-xs text-slate-500 leading-relaxed">{{ req.description }}</p>
        </div>
      </div>
    </div>

    <div class="pt-4">
      <BaseButton class="w-full" size="lg" @click="$emit('next')">
        Get Started
      </BaseButton>
    </div>
  </div>
</template>
