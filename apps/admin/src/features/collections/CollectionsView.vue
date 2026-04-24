<script setup lang="ts">
import { ref, computed } from "vue";
import {
  AppTextInput,
  AppPagination,
  BaseButton,
  AppDialog,
  AppTextArea,
  AppSelect,
  AppDatePicker,
} from "@bcl/ui";
import { PhoneCall, AlertTriangle, Search, Filter } from "lucide-vue-next";
import type { Loan, CollectionLog } from "@bcl/types";

// Setup mocks using the Loan interface mapped to ACTIVE/DEFAULTED explicitly
const mockLoans = ref<
  (Loan & {
    customerName: string;
    phone: string;
    nextRepaymentAmount: number;
    nextRepaymentDate: string;
    loanNumber: string;
  })[]
>([
  {
    id: "loan_active_1",
    referenceId: "BCL-2026-A10",
    loanNumber: "BCL-2026-A10",
    applicationId: "app_1",
    customerName: "Michael Doe",
    phone: "+234 810 123 4444",
    principal: 500000,
    interestAmount: 50000,
    totalPayable: 550000,
    amountPaid: 200000,
    outstandingBalance: 350000,
    tenor: 6,
    nextRepaymentDate: "2026-11-25T00:00:00Z",
    nextRepaymentAmount: 50000,
    disbursedAt: "2026-08-01T00:00:00Z",
    firstDueDate: "2026-09-01T00:00:00Z",
    finalDueDate: "2027-02-01T00:00:00Z",
    status: "ACTIVE",
    createdAt: "2026-07-25T00:00:00Z",
    loanProduct: {
      id: "prod_1",
      name: "Personal Loan",
      interestType: "FIXED",
      minAmount: 10000,
      maxAmount: 1000000,
      minTenor: 1,
      maxTenor: 12,
      interestRate: 0.05,
      isActive: true,
      tenors: [],
    },
    disbursementAccount: {
      id: "acc_1",
      bankName: "Zenith Bank",
      accountNumber: "1234567890",
      accountName: "Michael Doe",
    },
  },
  {
    id: "loan_defaulted_1",
    referenceId: "BCL-2026-D99",
    loanNumber: "BCL-2026-D99",
    applicationId: "app_2",
    customerName: "Sarah Connor",
    phone: "+234 902 333 5555",
    principal: 2000000,
    interestAmount: 400000,
    totalPayable: 2400000,
    amountPaid: 400000,
    outstandingBalance: 2000000,
    tenor: 12,
    nextRepaymentDate: "2026-10-15T00:00:00Z",
    nextRepaymentAmount: 400000,
    disbursedAt: "2026-05-15T00:00:00Z",
    firstDueDate: "2026-06-15T00:00:00Z",
    finalDueDate: "2027-05-15T00:00:00Z",
    status: "DEFAULTED",
    createdAt: "2026-05-10T00:00:00Z",
    loanProduct: {
      id: "prod_2",
      name: "Business Loan",
      interestType: "FIXED",
      minAmount: 500000,
      maxAmount: 5000000,
      minTenor: 3,
      maxTenor: 24,
      interestRate: 0.04,
      isActive: true,
      tenors: [],
    },
    disbursementAccount: {
      id: "acc_2",
      bankName: "GTBank",
      accountNumber: "0987654321",
      accountName: "Sarah Connor",
    },
  },
]);

const searchQuery = ref("");
const dateRange = ref<Date[] | null>(null);
const currentPage = ref(1);

const filteredOutstandings = computed(() => {
  let res = mockLoans.value;

  if (dateRange.value && dateRange.value[0]) {
    const start = new Date(dateRange.value[0]).getTime();
    res = res.filter(
      (l) => l.disbursedAt && new Date(l.disbursedAt).getTime() >= start,
    );
  }

  if (dateRange.value && dateRange.value[1]) {
    const end = new Date(dateRange.value[1]).getTime() + 86400000;
    res = res.filter(
      (l) => l.disbursedAt && new Date(l.disbursedAt).getTime() < end,
    );
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    res = res.filter(
      (l) =>
        l.customerName.toLowerCase().includes(q) ||
        l.loanNumber.toLowerCase().includes(q),
    );
  }
  return res;
});

// Dialogue Follow Up Logic
const isFollowUpOpen = ref(false);
const activeInteractionLoanId = ref<string | null>(null);
const followUpForm = ref<{
  method: "CALL" | "EMAIL" | "SMS" | "OTHER";
  note: string;
}>({
  method: "CALL",
  note: "",
});

function openFollowUp(loanId: string) {
  activeInteractionLoanId.value = loanId;
  followUpForm.value.note = "";
  followUpForm.value.method = "CALL";
  isFollowUpOpen.value = true;
}

function submitFollowUp() {
  if (!activeInteractionLoanId.value || !followUpForm.value.note) return;

  const log: CollectionLog = {
    id: `log_${Date.now()}`,
    loanId: activeInteractionLoanId.value,
    officerId: "current_officer", // Typically injected by authStore
    date: new Date().toISOString(),
    note: followUpForm.value.note,
    method: followUpForm.value.method,
  };

  // Natively in a real app, dispatch to pinned API store to track logs.
  console.log("Logged interaction:", log);

  isFollowUpOpen.value = false;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDateOptions(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Collections Hub
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Monitor active repayment schedules and log follow-up actions for
          defaulted accounts.
        </p>
      </div>
    </div>

    <!-- Main Card -->
    <div
      class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
      <!-- Toolbar -->
      <div
        class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4"
      >
        <div class="w-full sm:max-w-md flex items-center relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-6 z-10" />
          <AppTextInput
            id="search"
            v-model="searchQuery"
            placeholder="Search by loanee or reference..."
            type="text"
            class="pl-10 w-full -ml-4"
          />
        </div>
        <div class="w-full sm:w-auto flex items-center justify-end gap-3">
          <AppDatePicker
            v-model="dateRange"
            range
            placeholder="Disbursement date"
            class="w-full sm:w-64"
          />
          <BaseButton
            variant="ghost"
            class="bg-white border border-slate-200 text-slate-600 shadow-sm"
          >
            <Filter class="w-4 h-4 mr-2" /> Filters
          </BaseButton>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block w-full overflow-x-auto">
        <table
          class="w-full text-left text-sm text-slate-600 border-collapse min-w-225"
        >
          <thead
            class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100"
          >
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">Borrower</th>
              <th scope="col" class="px-6 py-4 font-medium">Debt Summary</th>
              <th scope="col" class="px-6 py-4 font-medium">Next Due</th>
              <th scope="col" class="px-6 py-4 font-medium">Risk Status</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Interactions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredOutstandings.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                No active loans queued for monitoring.
              </td>
            </tr>
            <tr
              v-for="loan in filteredOutstandings"
              :key="loan.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="font-medium text-slate-800">
                  {{ loan.customerName }}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ loan.loanNumber }}
                </div>
                <div class="text-xs font-mono text-slate-400 mt-0.5">
                  {{ loan.phone }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-800">
                  {{ formatCurrency(loan.outstandingBalance) }}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  out of {{ formatCurrency(loan.totalPayable) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-slate-700">
                  {{ formatCurrency(loan.nextRepaymentAmount) }}
                </div>
                <div
                  class="text-xs font-semibold mt-0.5"
                  :class="
                    new Date() > new Date(loan.nextRepaymentDate)
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  "
                >
                  By {{ formatDateOptions(loan.nextRepaymentDate) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  :class="
                    loan.status === 'DEFAULTED'
                      ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
                      : 'bg-emerald-100 text-emerald-700'
                  "
                >
                  <AlertTriangle
                    v-if="loan.status === 'DEFAULTED'"
                    class="w-3.5 h-3.5"
                  />
                  {{ loan.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  class="bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
                  @click="openFollowUp(loan.id)"
                >
                  <PhoneCall class="w-3.5 h-3.5 mr-1.5" /> Log Action
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile List -->
      <div class="md:hidden flex flex-col divide-y divide-slate-100">
        <div
          v-if="filteredOutstandings.length === 0"
          class="p-8 text-center text-slate-500"
        >
          No collections matched.
        </div>
        <div
          v-for="loan in filteredOutstandings"
          :key="`mob-${loan.id}`"
          class="p-4 hover:bg-slate-50 flex flex-col gap-4"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="font-bold text-slate-800">
                {{ loan.customerName }}
              </div>
              <div class="text-xs text-slate-500">{{ loan.loanNumber }}</div>
            </div>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold uppercase"
              :class="
                loan.status === 'DEFAULTED'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              "
            >
              {{ loan.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-slate-500 text-xs text-uppercase">Balance Left</p>
              <p class="font-bold text-slate-800">
                {{ formatCurrency(loan.outstandingBalance) }}
              </p>
            </div>
            <div>
              <p class="text-slate-500 text-xs text-uppercase">Next Due</p>
              <p class="font-bold text-slate-800">
                {{ formatCurrency(loan.nextRepaymentAmount) }}
              </p>
              <p
                class="text-xs"
                :class="
                  new Date() > new Date(loan.nextRepaymentDate)
                    ? 'text-rose-600'
                    : 'text-slate-500'
                "
              >
                {{ formatDateOptions(loan.nextRepaymentDate) }}
              </p>
            </div>
          </div>

          <BaseButton
            variant="secondary"
            class="w-full justify-center bg-indigo-50 text-indigo-700 border-none"
            @click="openFollowUp(loan.id)"
          >
            Log Interaction
          </BaseButton>
        </div>
      </div>

      <!-- Pagination -->
      <div
        class="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="1"
          :total-items="filteredOutstandings.length"
          :page-size="10"
        />
      </div>
    </div>
  </div>

  <!-- Collections Follow-Up Dialog -->
  <AppDialog v-model="isFollowUpOpen" title="Log Customer Interaction">
    <div class="flex flex-col gap-4 mt-2">
      <p class="text-sm text-slate-500 mb-2">
        Record details of your correspondence with the borrower regarding their
        outstanding schedule.
      </p>

      <div class="grid grid-cols-2 gap-4">
        <AppSelect
          v-model="followUpForm.method"
          label="Communication Method"
          :options="[
            { value: 'CALL', label: 'Phone Call' },
            { value: 'EMAIL', label: 'Email' },
            { value: 'SMS', label: 'Text Message' },
            { value: 'OTHER', label: 'Other/Manual' },
          ]"
        />
      </div>

      <AppTextArea
        v-model="followUpForm.note"
        label="Interaction Notes / Promise to Pay"
        placeholder="e.g. Spoke with customer. They stated salary was delayed but will clear the balance by Friday."
        :rows="4"
      />

      <div class="flex justify-end gap-3 mt-4">
        <BaseButton variant="ghost" @click="isFollowUpOpen = false"
          >Cancel</BaseButton
        >
        <BaseButton
          variant="primary"
          @click="submitFollowUp"
          :disabled="!followUpForm.note.trim()"
        >
          Save Log
        </BaseButton>
      </div>
    </div>
  </AppDialog>
</template>
