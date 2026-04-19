<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-vue-next";
import { BaseButton, AppDialog, AppTextArea } from "@bcl/ui";
import type { User } from "@bcl/types";

const router = useRouter();

// Mock User mapping the new complex profile interface
const mockUser = ref<User>({
  id: "usr_8",
  email: "james.k@example.com",
  phone: "+234 810 123 4567",
  isEmailVerified: true,
  isPhoneVerified: true,
  registrationStep: "UTILITY_BILL_COMPLETE",
  status: "PENDING",
  profile: {
    firstName: "James",
    lastName: "Kolawole",
    dateOfBirth: "1990-05-12",
    gender: "MALE",
    maritalStatus: "SINGLE",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    address: {
      street: "14 Adeola Odeku Street",
      lga: "Victoria Island",
    },
    bank: {
      bankName: "Zenith Bank",
      accountNumber: "2012345678",
      accountName: "JAMES KOLAWOLE",
      accountType: "Savings",
    },
  },
  employment: {
    jobTitle: "Senior Software Engineer",
    employerName: "TechCorp Nigeria Ltd",
    employmentStatus: "EMPLOYED",
    monthlyIncome: 450000,
    employerAddress: "14 Adeola Odeku Street, Victoria Island, Lagos",
    workEmail: "james.k@techcorp.ng",
    salaryDay: 25,
    employmentStartDate: "2018-11-01",
  },
  kyc: {
    bvn: "22233344455",
    bvnStatus: "VERIFIED",
  },
  createdAt: "2026-03-01T10:00:00.000Z",
});

const isRejectDialogOpen = ref(false);
const rejectionMessage = ref("");

function handleApprove() {
  mockUser.value.status = "ACTIVE";
  mockUser.value.registrationStep = "COMPLETE";
  // Ideally, call API to persist.
}

function handleReject() {
  mockUser.value.status = "SUSPENDED";
  // Ideally, process rejection message and notify user.
  isRejectDialogOpen.value = false;
}

function formatCurrency(n?: number) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Back Navigation -->
    <button
      class="flex items-center gap-1.5 cursor-pointer text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
      @click="router.push({ name: 'kyc' })"
    >
      <ArrowLeft class="w-4 h-4" /> Back to KYC Queue
    </button>

    <!-- Header / Status Banner -->
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xl shrink-0"
        >
          {{ mockUser.profile.firstName[0] }}{{ mockUser.profile.lastName[0] }}
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800">
            {{ mockUser.profile.firstName }} {{ mockUser.profile.lastName }}
          </h1>
          <p class="text-sm text-slate-500 mt-0.5">
            Reference: {{ mockUser.id }}
          </p>
        </div>
      </div>

      <div class="flex flex-col md:items-end gap-2">
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider w-fit"
          :class="{
            'bg-amber-100 text-amber-700': mockUser.status === 'PENDING',
            'bg-emerald-100 text-emerald-700': mockUser.status === 'ACTIVE',
            'bg-rose-100 text-rose-700': mockUser.status === 'SUSPENDED',
          }"
        >
          {{ mockUser.status === "ACTIVE" ? "APPROVED" : mockUser.status }}
        </span>
        <span class="text-xs text-slate-400 font-mono"
          >Stage: {{ mockUser.registrationStep }}</span
        >
      </div>
    </div>

    <!-- Review Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Card: Personal Verification -->
      <div
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
        >
          <ShieldCheck class="w-16 h-16 text-emerald-500" />
        </div>
        <h3
          class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"
        >
          Contact & Identity
        </h3>

        <div class="flex flex-col gap-4 text-sm relative z-10">
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="flex items-center gap-2 text-slate-600">
              <Mail class="w-4 h-4 text-slate-400" /> Email
            </div>
            <div class="flex items-center gap-2 font-medium text-slate-800">
              {{ mockUser.email }}
              <CheckCircle2
                v-if="mockUser.isEmailVerified"
                class="w-4 h-4 text-emerald-500"
              />
            </div>
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="flex items-center gap-2 text-slate-600">
              <Phone class="w-4 h-4 text-slate-400" /> Phone
            </div>
            <div class="flex items-center gap-2 font-medium text-slate-800">
              {{ mockUser.phone }}
              <CheckCircle2
                v-if="mockUser.isPhoneVerified"
                class="w-4 h-4 text-emerald-500"
              />
            </div>
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="flex text-slate-600">DOB (Age Gate)</div>
            <div class="flex items-center gap-2 font-medium text-slate-800">
              {{ formatDate(mockUser.profile.dateOfBirth) }}
              <CheckCircle2 class="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex text-slate-600">Gender & Marital</div>
            <div class="font-medium text-slate-800">
              {{ mockUser.profile.gender }} /
              {{ mockUser.profile.maritalStatus }}
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Employment -->
      <div
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
        >
          <Briefcase class="w-16 h-16 text-blue-500" />
        </div>
        <h3
          class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"
        >
          Employment Info
        </h3>
        <div
          class="flex flex-col gap-4 text-sm relative z-10"
          v-if="mockUser.employment"
        >
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="text-slate-600">Employer</div>
            <div class="font-medium text-slate-800">
              {{ mockUser.employment.employerName }}
            </div>
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="text-slate-600">Job Title</div>
            <div class="font-medium text-slate-800">
              {{ mockUser.employment.jobTitle }}
            </div>
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="text-slate-600">Status</div>
            <div class="font-medium text-slate-800">
              {{ mockUser.employment.employmentStatus }}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-600">Monthly Income</div>
            <div class="flex items-center gap-2 font-medium text-slate-800">
              {{ formatCurrency(mockUser.employment.monthlyIncome) }}
              <CheckCircle2 class="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Address & Location -->
      <div
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
        >
          <MapPin class="w-16 h-16 text-rose-500" />
        </div>
        <h3
          class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"
        >
          Residential Address
        </h3>
        <div
          class="flex flex-col gap-4 text-sm relative z-10"
          v-if="mockUser.profile.address"
        >
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="text-slate-600">Street</div>
            <div class="font-medium text-slate-800 text-right">
              {{ mockUser.profile.address.street }}
            </div>
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="text-slate-600">LGA / City</div>
            <div class="font-medium text-slate-800">
              {{ mockUser.profile.address.lga }}, {{ mockUser.profile.city }}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-600">State / Country</div>
            <div class="font-medium text-slate-800">
              {{ mockUser.profile.state }}, {{ mockUser.profile.country }}
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Bank Details -->
      <div
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group"
      >
        <h3
          class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"
        >
          Disbursement Bank
        </h3>
        <div class="flex flex-col gap-4 text-sm" v-if="mockUser.profile.bank">
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="text-slate-600">Bank Name</div>
            <div class="font-medium text-slate-800">
              {{ mockUser.profile.bank.bankName }}
            </div>
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-50 pb-3"
          >
            <div class="text-slate-600">Account No.</div>
            <div class="flex items-center gap-2 font-medium text-slate-800">
              {{ mockUser.profile.bank.accountNumber }}
              <!-- Visual verify for API BVN match -->
              <CheckCircle2
                class="w-4 h-4 text-emerald-500"
                title="BVN Matched"
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-600">Account Name</div>
            <div class="font-medium text-slate-800 font-mono">
              {{ mockUser.profile.bank.accountName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approvals Bar -->
    <div
      v-if="mockUser.status === 'PENDING'"
      class="bg-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-4 shadow-lg shadow-slate-900/10"
    >
      <div class="flex items-center gap-3 text-white">
        <ShieldCheck class="w-6 h-6 text-emerald-400" />
        <div>
          <p class="font-bold">Final Review</p>
          <p class="text-xs text-slate-400">
            Ensure documentation meets minimum policies before activating.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <BaseButton
          variant="secondary"
          class="w-full md:w-auto"
          @click="isRejectDialogOpen = true"
        >
          Reject Profile
        </BaseButton>
        <BaseButton
          variant="primary"
          class="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 border-none"
          @click="handleApprove"
        >
          <CheckCircle2 class="w-4 h-4 mr-1.5" /> Approve KYC
        </BaseButton>
      </div>
    </div>
  </div>

  <!-- Rejection Dialog -->
  <AppDialog v-model="isRejectDialogOpen" title="Reject KYC Profile">
    <div class="flex flex-col gap-4 mt-2">
      <div
        class="flex items-start gap-3 bg-rose-50 text-rose-700 p-3 rounded-lg border border-rose-100 text-sm"
      >
        <AlertTriangle class="w-5 h-5 shrink-0" />
        <p>
          This action will lock the user's progression. Please provide a clear
          explanation for the customer.
        </p>
      </div>
      <AppTextArea
        v-model="rejectionMessage"
        label="Rejection Reason (Visible to Customer)"
        placeholder="e.g., The provided utility bill is blurry and exceeds the 3-month validity constraint..."
        :rows="4"
      />
      <div class="flex justify-end gap-3 mt-4">
        <BaseButton variant="ghost" @click="isRejectDialogOpen = false"
          >Cancel</BaseButton
        >
        <BaseButton
          variant="primary"
          class="bg-rose-600 hover:bg-rose-700 border-none text-white"
          @click="handleReject"
        >
          Confirm Rejection
        </BaseButton>
      </div>
    </div>
  </AppDialog>
</template>
