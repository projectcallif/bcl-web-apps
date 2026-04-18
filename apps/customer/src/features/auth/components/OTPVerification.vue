<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { BaseButton } from '@bcl/ui'
import { RefreshCw } from 'lucide-vue-next'

const emit = defineEmits<{
  next: []
}>()

const otpValues = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Keep only the first character if paste or multiple chars entered somehow
  otpValues.value[index] = value.slice(-1)

  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

function handleSubmit() {
  const code = otpValues.value.join('')
  if (code.length === 6) {
    emit('next')
  }
}

function _debugPrefill() {
  otpValues.value = ['1', '2', '3', '4', '5', '6']
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-slate-900" @dblclick="_debugPrefill">
        Verify OTP
      </h2>
      <p class="text-sm text-slate-500">
        Enter the 6-digit code sent to your phone number and email.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8 text-center">
      <div class="flex justify-between gap-2 sm:gap-4 max-w-sm mx-auto">
        <input
          v-for="(_, index) in 6"
          :key="index"
          ref="inputRefs"
          v-model="otpValues[index]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold border-b-2 rounded-none border-slate-300 focus:border-primary-600 focus:outline-none bg-transparent transition-colors"
          @input="onInput(index, $event)"
          @keydown="onKeydown(index, $event)"
        />
      </div>

      <button type="button" class="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors inline-flex items-center gap-2">
        <RefreshCw class="w-4 h-4" />
        Resend Code
      </button>

      <div class="pt-4">
        <BaseButton
          class="w-full"
          size="lg"
          type="submit"
          :disabled="otpValues.join('').length !== 6"
        >
          Verify OTP
        </BaseButton>
      </div>
    </form>
  </div>
</template>
