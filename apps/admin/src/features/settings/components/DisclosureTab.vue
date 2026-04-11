<script setup lang="ts">
import { ref } from "vue";
import { BaseButton, AppTextArea } from "@bcl/ui";
import { FileText, Save, History } from "lucide-vue-next";

const disclosureText = ref(
  "By clicking 'Accept', you agree to our Terms of Service and Privacy Policy. You also authorize BCL to perform a credit check and verify your employment status through our partner networks. This includes sharing necessary identifiers such as your BVN and Phone number for the sole purpose of loan eligibility evaluation.",
);

const termsAndConditions = ref(
  "1. LOAN AGREEMENT: The loan is a short-term credit facility provided by BCL...\n2. REPAYMENT: Repayment shall be made via automated debit on the due date.\n3. INTEREST: Interest rates are fixed for the duration of the loan tenor.",
);

function saveDisclosure() {
  // Logic to save and trigger audit log
  console.log("Saving legal configuration:", {
    disclosureText: disclosureText.value,
    termsAndConditions: termsAndConditions.value,
  });
  // TODO: Trigger Audit Log US-009
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100"
    >
      <div>
        <h2
          class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2"
        >
          <FileText class="w-5 h-5 text-primary-500" />
          Disclosure Configuration
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Update the legal text seen by customers during onboarding and loan
          application.
        </p>
      </div>
      <BaseButton variant="primary" @click="saveDisclosure">
        <Save class="w-4 h-4 mr-2" /> Save Changes
      </BaseButton>
    </div>

    <div class="flex flex-col gap-8">
      <div>
        <label
          class="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider"
        >
          Onboarding Disclosure Text
        </label>
        <p class="text-xs text-slate-500 mb-4">
          This text appears when users first register or apply for their first
          loan.
        </p>
        <AppTextArea
          id="disclosureText"
          v-model="disclosureText"
          placeholder="Enter disclosure text..."
          :rows="6"
        />
      </div>

      <div>
        <label
          class="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider"
        >
          Full Terms & Conditions
        </label>
        <p class="text-xs text-slate-500 mb-4">
          Detailed legal agreement available for download or viewing before
          disbursal.
        </p>
        <AppTextArea
          id="termsAndConditions"
          v-model="termsAndConditions"
          placeholder="Enter terms and conditions..."
          :rows="12"
        />
      </div>

      <div
        class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3"
      >
        <History class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-bold text-indigo-800">Audit History</p>
          <p class="text-xs text-indigo-600 mt-1">
            Last updated by <span class="font-bold">Super Admin</span> on Oct
            24, 2026. All changes are logged for compliance.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
