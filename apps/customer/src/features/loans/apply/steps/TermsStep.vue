<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BaseButton, BaseSkeleton } from '@bcl/ui'
import { useLoanApplicationStore } from '../store'
import { getLoanTerms, getLoanProducts, getDefaultLoanProduct } from '../../api'
import type { ApiClientError } from '@bcl/types'

const store = useLoanApplicationStore()
const html = ref('')
const loading = ref(true)
const accepted = ref(store.termsAccepted)

onMounted(async () => {
  loading.value = true
  try {
    const [termsRes, productsRes, defaultRes] = await Promise.all([
      getLoanTerms(),
      getLoanProducts(),
      getDefaultLoanProduct().catch(() => null),
    ])

    html.value = termsRes.data.content
    store.products = productsRes.data

    if (defaultRes) {
      store.selectedProduct = defaultRes.data ?? null
    } else if (productsRes.data.length > 0) {
      store.selectedProduct = productsRes.data[0] ?? null
    }
  } catch (err) {
    const error = err as ApiClientError
    console.error('Failed to load terms/products:', error)
  } finally {
    loading.value = false
  }
})

const canProceed = computed(() => accepted.value && !loading.value)

function proceed() {
  store.termsAccepted = true
  store.nextStep()
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <h2 class="text-lg font-bold text-slate-800 mb-1">Terms &amp; Conditions</h2>
    <p class="text-sm text-slate-500 mb-5">Please read and accept our terms before proceeding.</p>

    <!-- Terms content -->
    <div
      class="h-72 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden prose prose-slate prose-sm max-w-none mb-5"
    >
      <div v-if="loading" class="w-full h-full p-6 flex flex-col gap-4">
        <BaseSkeleton height="1rem" width="100%" />
        <BaseSkeleton height="1rem" width="90%" />
        <BaseSkeleton height="1rem" width="95%" />
        <BaseSkeleton height="1rem" width="85%" />
        <BaseSkeleton height="1rem" width="92%" />
      </div>
      <iframe
        v-else
        :srcdoc="html || 'No content available.'"
        class="w-full h-full border-0"
        title="Terms and Conditions"
      />
    </div>

    <!-- Accept checkbox -->
    <label class="flex items-start gap-3 cursor-pointer group mb-6">
      <input
        v-model="accepted"
        type="checkbox"
        :disabled="loading"
        class="mt-0.5 w-4 h-4 accent-primary rounded cursor-pointer"
      />
      <span class="text-sm text-slate-600 leading-relaxed">
        I have read and agree to BCL Finance's
        <span class="font-semibold text-primary">Terms and Conditions</span> and
        <span class="font-semibold text-primary">Privacy Policy</span>.
      </span>
    </label>

    <div class="flex justify-end">
      <BaseButton variant="primary" size="lg" :disabled="!canProceed" @click="proceed">
        Accept &amp; Continue
      </BaseButton>
    </div>
  </div>
</template>
