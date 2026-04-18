<script setup lang="ts">
import { BaseButton } from '@bcl/ui'
import { ShieldCheck } from 'lucide-vue-next'

const emit = defineEmits<{
  next: []
}>()

function handleContinue() {
  emit('next')
}
</script>

<template>
  <div class="space-y-8 flex flex-col items-center justify-center text-center py-12">
    <div class="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
      <ShieldCheck class="w-12 h-12" />
    </div>

    <div class="space-y-4 max-w-sm">
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">
        Identity Verified!
      </h2>
      <p class="text-sm text-slate-500 leading-relaxed px-2">
        Your identity has been successfully verified. You're all set to access your loan.
      </p>
    </div>

    <div class="pt-8 w-full mt-auto">
      <BaseButton class="w-full" size="lg" @click="handleContinue">
        Continue
      </BaseButton>
    </div>
  </div>
</template>
