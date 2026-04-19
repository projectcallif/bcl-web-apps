<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BaseButton } from '@bcl/ui'
import { useLoanApplicationStore } from '../store'
import { getLoanTerms } from '../../api'

const store = useLoanApplicationStore()
const html = ref('')
const accepted = ref(store.termsAccepted)

onMounted(async () => {
  const res = await getLoanTerms()
  html.value = res.data.content
})

const canProceed = computed(() => accepted.value)

function proceed() {
  console.log("-----")
  store.termsAccepted = true
  store.nextStep()
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Terms &amp; Conditions</h2>
    <p class="text-sm text-slate-500 mb-5">Please read and accept our terms before proceeding.</p>

    <!-- Terms content -->
    <div class="h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-5 prose prose-slate prose-sm max-w-none mb-5 scroll-smooth"
         v-html="html || 'Loading...'" />

    <!-- Accept checkbox -->
    <label class="flex items-start gap-3 cursor-pointer group mb-6">
      <input
        v-model="accepted"
        type="checkbox"
        class="mt-0.5 w-4 h-4 accent-primary rounded cursor-pointer"
      />
      <span class="text-sm text-slate-600 leading-relaxed">
        I have read and agree to BCL Finance's <span class="font-semibold text-primary">Terms and Conditions</span> and <span class="font-semibold text-primary">Privacy Policy</span>.
      </span>
    </label>

    <div class="flex justify-end">
      <BaseButton variant="primary" size="lg" :disabled="!canProceed" @click="proceed">
        Accept &amp; Continue
      </BaseButton>
    </div>
  </div>
</template>
