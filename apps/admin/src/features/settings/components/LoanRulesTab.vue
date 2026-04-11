<script setup lang="ts">
import { AppTextInput, BaseButton, AppSwitch } from "@bcl/ui";
import type { LoanRuleConfig } from "@bcl/types";

defineProps<{
  modelValue: LoanRuleConfig;
}>();
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-800 tracking-tight">
          Loan Underwriting Rules
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Configure eligibility parameters and enforce required KYC fields
          dynamically.
        </p>
      </div>
      <BaseButton variant="primary">Save</BaseButton>
    </div>

    <div class="flex flex-col gap-8">
      <!-- Age Restrictions -->
      <div>
        <h3
          class="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider"
        >
          Age Eligibility Constraints
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100"
        >
          <AppTextInput
            id="minAge"
            v-model.number="modelValue.minAge"
            label="Minimum Eligible Age"
            type="number"
          />
          <AppTextInput
            id="maxAge"
            v-model.number="modelValue.maxAge"
            label="Maximum Eligible Age"
            type="number"
          />
        </div>
      </div>

      <!-- Field Requirements -->
      <div>
        <h3
          class="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider"
        >
          Mandatory KYC Data Fields
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            v-for="(rule, key) in {
              requireBvn: 'Valid BVN Data',
              requireLocation: 'Geo-location Lock',
              requireVerifiedPhone: 'Verified Phone Source',
              requireGender: 'Declared Gender',
              requireDob: 'Birth Validation (DOB)',
              requireUtilityBill: 'Utility Bill Document',
              requireEmploymentProof: 'Proof of Job/Income',
            }"
            :key="key"
            class="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-primary-100 transition-colors cursor-pointer select-none"
          >
            <span class="text-sm font-medium text-slate-700">{{ rule }}</span>
            <AppSwitch
              v-model="
                modelValue[
                  key as keyof Omit<LoanRuleConfig, 'minAge' | 'maxAge'>
                ]
              "
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
