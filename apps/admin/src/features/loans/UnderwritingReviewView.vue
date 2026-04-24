<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BaseButton, AppDialog, AppTextArea, AppTextInput } from "@bcl/ui";
import {
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Briefcase,
  Calendar,
  Wallet,
  ShieldAlert,
} from "lucide-vue-next";
import { ApiClientError, type AdminLoanApplicationDetail } from "@bcl/types";
import { useToastStore } from "@/stores/toast";
import {
  getLoanApplicationDetail,
  approveLoanApplication,
  rejectLoanApplication,
} from "./api";
import UnderwritingSkeleton from "./components/UnderwritingSkeleton.vue";

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const applicationId = route.params.id as string;

// ── State ──────────────────────────────────────────────────────────────────────

const application = ref<AdminLoanApplicationDetail | null>(null);
const loading = ref(true);
const isSubmitting = ref(false);

const isDecisionModalOpen = ref(false);
const decisionType = ref<"APPROVE" | "REJECT" | "">("");

// Approval Form
const approvalForm = ref({
  offeredAmount: 0,
  tenor: 0,
});

// Rejection Form
const rejectionReason = ref("");

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function fetchDetail(): Promise<void> {
  loading.value = true;
  try {
    const res = await getLoanApplicationDetail(applicationId);
    application.value = res.data;
    // Set defaults for approval form
    approvalForm.value.offeredAmount = res.data.requestedAmount;
    approvalForm.value.tenor = res.data.requestedTenor;
  } catch (err) {
    console.error("Failed to fetch application detail:", err);
    toastStore.error("Could not load application details.");
    router.push({ name: "loan-applications" });
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDetail);

// ── Actions ────────────────────────────────────────────────────────────────────

function openDecision(type: "APPROVE" | "REJECT") {
  decisionType.value = type;
  isDecisionModalOpen.value = true;
}

async function submitDecision(): Promise<void> {
  if (!application.value) return;

  isSubmitting.value = true;
  try {
    if (decisionType.value === "APPROVE") {
      await approveLoanApplication(applicationId, {
        offeredAmount: approvalForm.value.offeredAmount,
        tenor: approvalForm.value.tenor,
      });
      toastStore.success("Application approved and offer created.");
    } else {
      if (!rejectionReason.value) {
        toastStore.error("Please provide a rejection reason.");
        return;
      }
      await rejectLoanApplication(applicationId, {
        reason: rejectionReason.value,
      });
      toastStore.success("Application has been rejected.");
    }
    isDecisionModalOpen.value = false;
    router.push({ name: "loan-applications" });
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error?.message || "Failed to submit decision.");
  } finally {
    isSubmitting.value = false;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
</script>

<template>
  <UnderwritingSkeleton v-if="loading" />

  <div
    v-else-if="application"
    class="flex flex-col gap-6 max-w-7xl mx-auto w-full"
  >
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
            Underwriting Review
          </h1>
          <p class="text-sm text-slate-500 mt-0.5">
            ID:
            <span class="font-mono text-xs uppercase"
              >{{ application.id.slice(0, 12) }}...</span
            >
            • Applied
            {{ formatDate(application.createdAt) }}
          </p>
        </div>
      </div>

      <div
        v-if="application.status === 'UNDER_REVIEW'"
        class="flex items-center gap-3"
      >
        <BaseButton
          variant="ghost"
          class="bg-white border border-slate-200 text-rose-600 hover:bg-rose-50"
          @click="openDecision('REJECT')"
        >
          <XCircle class="w-4 h-4 mr-2" /> Reject
        </BaseButton>
        <BaseButton variant="primary" @click="openDecision('APPROVE')">
          <CheckCircle2 class="w-4 h-4 mr-2" /> Approve Application
        </BaseButton>
      </div>
      <div v-else>
        <span
          class="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-500 uppercase tracking-widest border border-slate-200"
        >
          Status: {{ application.status.replace("_", " ") }}
        </span>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Left Column: Customer Profile & Evidence -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Customer Card -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3
            class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"
          >
            <User class="w-4 h-4 text-primary" /> Applicant Profile
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0"
              >
                <User class="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5"
                >
                  Full Name
                </p>
                <p class="font-bold text-slate-800 text-base">
                  {{ application.applicant.firstName }}
                  {{ application.applicant.lastName }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0"
              >
                <Calendar class="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5"
                >
                  Age / Gender
                </p>
                <p class="font-bold text-slate-800">
                  {{ formatDate(application.applicant.dateOfBirth) }} ({{
                    application.applicant.gender
                  }})
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0"
              >
                <Briefcase class="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5"
                >
                  Requested Loan
                </p>
                <p class="font-black text-primary text-lg">
                  {{ formatCurrency(application.requestedAmount) }}
                </p>
                <p class="text-xs text-slate-500 font-medium">
                  For {{ application.requestedTenor }} Months ({{
                    application.purpose
                  }})
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0"
              >
                <Wallet class="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5"
                >
                  Residential Info
                </p>
                <p class="font-medium text-slate-700 leading-tight">
                  {{ application.applicant.residentialAddress }}<br />
                  {{ application.applicant.city }},
                  {{ application.applicant.state }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- KYC & Product Card -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
          >
            <h3
              class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
            >
              <ShieldCheck class="w-4 h-4 text-emerald-500" /> KYC Verification
            </h3>
            <div class="space-y-4">
              <div
                class="flex justify-between items-center pb-3 border-b border-slate-50"
              >
                <span class="text-sm text-slate-500">BVN Status</span>
                <span
                  class="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg"
                  >{{ application.kyc.bvnStatus }}</span
                >
              </div>
              <div
                class="flex justify-between items-center pb-3 border-b border-slate-50"
              >
                <span class="text-sm text-slate-500">Customer Tier</span>
                <span class="text-xs font-bold text-slate-700">{{
                  application.kyc.tier
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-500">Mono Link</span>
                <span class="text-xs font-mono text-slate-400 uppercase"
                  >{{
                    application.applicant.monoAccountId.slice(0, 10)
                  }}...</span
                >
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
          >
            <h3
              class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
            >
              <Wallet class="w-4 h-4 text-primary" /> Applied Product
            </h3>
            <div class="space-y-4">
              <div
                class="flex justify-between items-center pb-3 border-b border-slate-50"
              >
                <span class="text-sm text-slate-500">Product Name</span>
                <span class="text-sm font-bold text-slate-800">{{
                  application.loanProduct.name
                }}</span>
              </div>
              <div
                class="flex justify-between items-center pb-3 border-b border-slate-50"
              >
                <span class="text-sm text-slate-500">Interest Rate</span>
                <span class="text-sm font-bold text-emerald-600"
                  >{{ Number(application.loanProduct.interestRate) * 100 }}%
                  {{ application.loanProduct.interestType }}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-500">Product Limits</span>
                <span class="text-[10px] font-bold text-slate-400"
                  >{{
                    formatCurrency(Number(application.loanProduct.minAmount))
                  }}
                  -
                  {{
                    formatCurrency(Number(application.loanProduct.maxAmount))
                  }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Eligibility Results -->
      <div class="flex flex-col gap-6">
        <div
          class="bg-slate-900 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden group"
        >
          <!-- Background glow -->
          <div
            class="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"
          ></div>

          <h3
            class="text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-emerald-400"
          >
            <ShieldAlert class="w-4 h-4" /> Affordability Assessment
          </h3>

          <!-- Big Stats -->
          <div class="flex flex-col gap-6 mb-8 relative z-10">
            <div>
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
              >
                Calculated Max Eligible
              </p>
              <p class="text-3xl font-black text-white">
                {{
                  formatCurrency(application.eligibility.eligibleAmountInNaira)
                }}
              </p>
            </div>
            <div>
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
              >
                Projected Monthly Payment
              </p>
              <p class="text-xl font-bold text-emerald-400">
                {{
                  formatCurrency(application.eligibility.monthlyPaymentInNaira)
                }}
              </p>
            </div>
          </div>

          <div class="h-px bg-slate-800 w-full mb-6"></div>

          <!-- Quick Check List -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400">Can Afford?</span>
              <span
                :class="
                  application.eligibility.canAfford
                    ? 'text-emerald-400 font-bold'
                    : 'text-rose-400 font-bold'
                "
              >
                {{ application.eligibility.canAfford ? "YES" : "NO" }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400">Assessment Period</span>
              <span class="text-white font-medium"
                >{{ application.eligibility.assessedFrom.split("-")[0] }} -
                {{ application.eligibility.assessedTo.split("-")[0] }}</span
              >
            </div>
          </div>
        </div>

        <!-- Risk Warning -->
        <div
          v-if="!application.eligibility.canAfford"
          class="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex gap-3"
        >
          <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p class="text-xs text-rose-800 leading-relaxed font-medium">
            <span class="font-bold">Risk Alert:</span> The affordability engine
            indicates this user may struggle with the requested payment.
            Consider reducing the approved amount or extending tenor.
          </p>
        </div>
      </div>
    </div>

    <!-- Decision Modal -->
    <AppDialog
      v-model="isDecisionModalOpen"
      :title="
        decisionType === 'APPROVE'
          ? 'Approve Application'
          : 'Reject Application'
      "
      max-width="md"
    >
      <div v-if="decisionType === 'APPROVE'" class="flex flex-col gap-6 py-4">
        <div
          class="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-2"
        >
          <p class="text-xs text-primary-700 font-medium leading-relaxed">
            Approving this application will generate a Loan Offer for the
            customer. You can adjust the final offered amount and tenor below.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppTextInput
            id="offeredAmount"
            v-model.number="approvalForm.offeredAmount"
            label="Offered Amount (₦)"
            type="number"
            required
          />
          <AppTextInput
            id="offeredTenor"
            v-model.number="approvalForm.tenor"
            label="Approved Tenor (Months)"
            type="number"
            required
          />
        </div>
      </div>

      <div v-else class="flex flex-col gap-5 py-4">
        <p class="text-sm text-slate-600">
          Please provide a clear reason for rejection. This will be shared with
          the customer.
        </p>

        <AppTextArea
          id="rejectionReason"
          v-model="rejectionReason"
          label="Rejection Reason"
          placeholder="e.g. Insufficient income for requested amount..."
          :rows="4"
        />
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <BaseButton
            variant="ghost"
            class="bg-white border border-slate-200"
            @click="isDecisionModalOpen = false"
            >Cancel</BaseButton
          >
          <BaseButton
            :variant="decisionType === 'APPROVE' ? 'primary' : 'primary'"
            :class="{
              'bg-rose-600 hover:bg-rose-700 border-rose-600':
                decisionType === 'REJECT',
            }"
            :loading="isSubmitting"
            @click="submitDecision"
          >
            {{
              decisionType === "APPROVE"
                ? "Generate Offer"
                : "Confirm Rejection"
            }}
          </BaseButton>
        </div>
      </template>
    </AppDialog>
  </div>
</template>
