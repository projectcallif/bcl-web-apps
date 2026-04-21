<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BaseButton, AppDialog, AppTextArea } from "@bcl/ui";
import {
  User,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  ArrowLeft,
  ShieldCheck,
} from "lucide-vue-next";
import type { LoanApplication, LoanStatus } from "@bcl/types";
import { useToastStore } from "@/stores/toast";

const route = useRoute();
const router = useRouter();

const toastStore = useToastStore();

// Mock Detailed Application
const application = ref<
  LoanApplication & { customerName: string; customerEmail: string }
>({
  id: (route.params.id as string) || "app_99182",
  userId: "usr_123",
  customerName: "Obinna Okafor",
  customerEmail: "obinna.okafor@gmail.com",
  amountRequested: 250000,
  tenorMonths: 6,
  purpose: "Business Expansion",
  status: "PENDING",
  appliedAt: "2026-10-24T10:30:00Z",
  documents: {
    utilityBillUrl: "#",
    idFrontUrl: "#",
    idBackUrl: "#",
    employmentProofUrl: "#",
  },
  eligibilityResults: {
    bvnValid: true,
    ageValid: true,
    incomeScore: 78,
    passedRules: [
      "BVN_MATCH",
      "AGE_RESTRICTION",
      "LOCATION_LOCK",
      "PHONE_VERIFIED",
    ],
    failedRules: ["DEBT_TO_INCOME_RATIO"],
  },
});

const isDecisionModalOpen = ref(false);
const decisionType = ref<LoanStatus | "">("");
const decisionNote = ref("");

function openDecision(type: LoanStatus) {
  decisionType.value = type;
  isDecisionModalOpen.value = true;
}

function submitDecision() {
  // Logic to save decision and trigger audit log
  console.log("Submitting decision:", {
    id: application.value.id,
    decision: decisionType.value,
    note: decisionNote.value,
  });
  application.value.status = decisionType.value as LoanStatus;
  isDecisionModalOpen.value = false;
  toastStore.success("Application decision has been saved successfully.");
  router.push({ name: "loan-applications" });
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 flex-wrap justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="router.push({ name: 'loan-applications' })"
          class="p-2 hover:bg-white cursor-pointer rounded-lg transition-colors border border-transparent hover:border-slate-200"
        >
          <ArrowLeft class="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
            Application Review
          </h1>
          <p class="text-sm text-slate-500 mt-0.5">
            ID: {{ application.id }} • Applied
            {{ application.appliedAt.split("T")[0] }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <BaseButton
          variant="ghost"
          class="bg-white border border-slate-200"
          @click="openDecision('REJECTED')"
        >
          <XCircle class="w-4 h-4 mr-2 text-rose-500" /> Reject Application
        </BaseButton>
        <BaseButton variant="primary" @click="openDecision('ACTIVE')">
          <CheckCircle2 class="w-4 h-4 mr-2" /> Approve & Disburse
        </BaseButton>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Left Column: Customer Profile & Evidence -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Customer Card -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3
            class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"
          >
            <User class="w-4 h-4 text-primary-500" /> Customer Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p class="text-slate-500 font-medium mb-0.5">Full Name</p>
              <p class="font-bold text-slate-800 text-base">
                {{ application.customerName }}
              </p>
            </div>
            <div>
              <p class="text-slate-500 font-medium mb-0.5">Email Address</p>
              <p class="font-medium text-slate-800">
                {{ application.customerEmail }}
              </p>
            </div>
            <div>
              <p class="text-slate-500 font-medium mb-0.5">Loan Request</p>
              <p class="font-bold text-slate-800">
                N{{ application.amountRequested.toLocaleString() }} for
                {{ application.tenorMonths }} months
              </p>
            </div>
            <div>
              <p class="text-slate-500 font-medium mb-0.5">Loan Purpose</p>
              <p class="text-slate-800">{{ application.purpose }}</p>
            </div>
          </div>
        </div>

        <!-- Documents Card -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3
            class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"
          >
            <FileText class="w-4 h-4 text-primary-500" /> Verification Documents
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(_val, label) in {
                'Government ID (Front)': 'idFrontUrl',
                'Government ID (Back)': 'idBackUrl',
                'Utility Bill (Proof of Address)': 'utilityBillUrl',
                'Employment/Income Proof': 'employmentProofUrl',
              }"
              :key="label"
              class="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600"
                >
                  <FileText class="w-5 h-5" />
                </div>
                <span class="text-sm font-medium text-slate-700">{{
                  label
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  title="View"
                >
                  <ExternalLink class="w-4 h-4" />
                </button>
                <button
                  class="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  title="Download"
                >
                  <Download class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Eligibility Results -->
      <div class="flex flex-col gap-6">
        <div class="bg-slate-900 rounded-2xl p-6 shadow-xl text-white">
          <h3
            class="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 opacity-80"
          >
            <ShieldCheck class="w-4 h-4 text-emerald-400" /> Automated
            Eligibility
          </h3>

          <!-- Score Circle -->
          <div class="flex flex-col items-center justify-center mb-8">
            <div class="relative w-32 h-32 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-emerald-500"
                  :stroke-dasharray="364"
                  :stroke-dashoffset="
                    364 -
                    (364 * application.eligibilityResults!.incomeScore) / 100
                  "
                />
              </svg>
              <div
                class="absolute inset-0 flex flex-col items-center justify-center"
              >
                <span class="text-3xl font-bold">{{
                  application.eligibilityResults!.incomeScore
                }}</span>
                <span
                  class="text-[10px] font-bold opacity-50 uppercase tracking-tighter"
                  >Income Score</span
                >
              </div>
            </div>
          </div>

          <!-- Rules List -->
          <div class="flex flex-col gap-3">
            <div
              v-for="rule in application.eligibilityResults!.passedRules"
              :key="rule"
              class="flex items-center gap-3 text-sm"
            >
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span class="opacity-80">{{ rule.replace(/_/g, " ") }}</span>
            </div>
            <div
              v-for="rule in application.eligibilityResults!.failedRules"
              :key="rule"
              class="flex items-center gap-3 text-sm"
            >
              <AlertCircle class="w-4 h-4 text-rose-400 shrink-0" />
              <span
                class="text-rose-200 font-bold uppercase text-[10px] tracking-wide"
                >FAIL</span
              >
              <span class="opacity-80">{{ rule.replace(/_/g, " ") }}</span>
            </div>
          </div>
        </div>

        <!-- Contextural Warning -->
        <div
          v-if="application.eligibilityResults!.failedRules.length"
          class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3"
        >
          <AlertCircle class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p class="text-xs text-amber-800 leading-relaxed font-medium">
            <span class="font-bold">Manual Review Advised:</span> One or more
            eligibility rules failed auto-approval. Please verify debt-to-income
            ratios against provided income proof.
          </p>
        </div>
      </div>
    </div>

    <!-- Decision Modal -->
    <AppDialog
      v-model="isDecisionModalOpen"
      :title="
        decisionType === 'ACTIVE' ? 'Approve Application' : 'Reject Application'
      "
      max-width="md"
    >
      <div class="flex flex-col gap-5 mt-2">
        <p class="text-sm text-slate-600">
          Please provide a internal note for this decision. This will be stored
          in the audit history.
        </p>

        <AppTextArea
          id="decisionNote"
          v-model="decisionNote"
          :label="
            decisionType === 'ACTIVE'
              ? 'Approval Note (Optional)'
              : 'Rejection Reason (Required)'
          "
          placeholder="Enter decision details..."
        />

        <div class="flex justify-end gap-3 mt-4">
          <BaseButton variant="ghost" @click="isDecisionModalOpen = false"
            >Cancel</BaseButton
          >
          <BaseButton
            :variant="decisionType === 'ACTIVE' ? 'primary' : 'primary'"
            :class="{
              'bg-rose-600 hover:bg-rose-700 border-rose-600':
                decisionType === 'REJECTED',
            }"
            :disabled="!decisionNote && decisionType === 'REJECTED'"
            @click="submitDecision"
          >
            {{
              decisionType === "ACTIVE"
                ? "Complete Approval"
                : "Confirm Rejection"
            }}
          </BaseButton>
        </div>
      </div>
    </AppDialog>
  </div>
</template>
