<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ArrowLeft,
  CreditCard,
  Home,
  Briefcase,
  // FileText,
  History,
  Eye,
  AlertCircle,
  MoreVertical,
} from "lucide-vue-next";
import {
  BaseButton,
  AppProgressBar,
  BaseSkeleton,
  AppConfirmDialog,
  AppPagination,
} from "@bcl/ui";
import { useToastStore } from "@/stores/toast";
import type {
  LoanStatus,
  RepaymentScheduleItem,
  Transaction,
  AdminDisbursedLoanDetail,
  ApiClientError,
} from "@bcl/types";
import { getTransactionsAcrossPlatform } from "../transactions/api";
import {
  getDisbursedLoanDetail,
  getLoanRepaymentSchedule,
  updateLoanStatus,
} from "./api";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const loanId = route.params.id as string;
const activeTab = ref<"schedule" | "kyc" | "transactions">("schedule");

// ── Data State ─────────────────────────────────────────────────────────────────

const loan = ref<AdminDisbursedLoanDetail | null>(null);
const schedule = ref<RepaymentScheduleItem[]>([]);
const loading = ref(true);
const scheduleLoading = ref(false);

// Transactions State
const transactions = ref<Transaction[]>([]);
const transactionsLoading = ref(false);
const transactionsPage = ref(1);
const totalTransactions = ref(0);
const transactionsTotalPages = ref(1);

// ── Actions ───────────────────────────────────────────────────────────────────

async function fetchLoanData() {
  if (!loanId) return;
  loading.value = true;
  try {
    const res = await getDisbursedLoanDetail(loanId);
    loan.value = res.data;
  } catch (err) {
    const error = err as ApiClientError;
    console.error("Failed to fetch loan details:", error);
    toast.error(error.message || "Failed to load loan details");
  } finally {
    loading.value = false;
  }
}

async function fetchSchedule() {
  if (!loanId) return;
  scheduleLoading.value = true;
  try {
    const res = await getLoanRepaymentSchedule(loanId);
    schedule.value = res.data.installments;
  } catch (err) {
    const error = err as ApiClientError;
    console.error("Failed to fetch schedule:", error);
  } finally {
    scheduleLoading.value = false;
  }
}

async function fetchLoanTransactions() {
  if (!loanId) return;
  transactionsLoading.value = true;
  try {
    const res = await getTransactionsAcrossPlatform({
      page: transactionsPage.value,
      limit: 10,
      loanId: loanId,
    });
    transactions.value = res.data.items;
    totalTransactions.value = res.data.total;
    transactionsTotalPages.value = res.data.totalPages;
  } catch (err) {
    const error = err as ApiClientError;
    console.error("Failed to fetch loan transactions:", error);
  } finally {
    transactionsLoading.value = false;
  }
}

const pendingStatusChange = ref<LoanStatus | null>(null);
const isConfirmOpen = ref(false);

async function handleStatusUpdate(newStatus: LoanStatus) {
  if (!loan.value) return;
  pendingStatusChange.value = newStatus;
  isConfirmOpen.value = true;
}

async function confirmStatusUpdate() {
  if (!loan.value || !pendingStatusChange.value) return;

  const statusToApply = pendingStatusChange.value;
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;

  try {
    await updateLoanStatus(loan.value.id, statusToApply);
    toast.success(`Loan status updated to ${statusToApply}`);
    await fetchLoanData();
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Failed to update loan status");
  }
}

// ── Lifecycle & Watchers ───────────────────────────────────────────────────────

onMounted(() => {
  fetchLoanData();
  fetchSchedule();
});

watch([activeTab, transactionsPage], ([newTab]) => {
  if (newTab === "transactions") {
    fetchLoanTransactions();
  } else if (newTab === "schedule") {
    fetchSchedule();
  }
});

// ── Formatters ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number | string): string {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(num);
}

function formatDate(s: string): string {
  if (!s) return "N/A";
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusConfig: Record<
  LoanStatus,
  { label: string; dot: string; badge: string }
> = {
  ACTIVE: {
    label: "Active",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  DEFAULTED: {
    label: "Defaulted",
    dot: "bg-rose-600",
    badge: "bg-rose-200 text-rose-800",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  WRITTEN_OFF: {
    label: "Written Off",
    dot: "bg-slate-900",
    badge: "bg-slate-200 text-slate-800",
  },
};
</script>

<template>
  <!-- Back -->
  <button
    class="flex items-center gap-1.5 cursor-pointer text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
    @click="router.push({ name: 'loan-operations' })"
  >
    <ArrowLeft class="w-4 h-4" /> Back to Operations
  </button>

  <div v-if="loading" class="space-y-6">
    <BaseSkeleton height="200px" class="rounded-2xl" />
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      <BaseSkeleton height="400px" class="rounded-2xl" />
      <BaseSkeleton height="400px" class="rounded-2xl" />
    </div>
  </div>

  <div
    v-else-if="loan"
    class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start"
  >
    <!-- MAIN AREA -->
    <div class="flex flex-col gap-6 w-full">
      <!-- Loan header card -->
      <div
        class="relative bg-slate-900 rounded-2xl p-6 overflow-hidden text-white"
      >
        <div
          class="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"
        />
        <div
          class="absolute right-4 -bottom-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none"
        />

        <div class="relative flex items-start justify-between mb-5">
          <div>
            <p class="text-2xl font-semibold text-white tracking-tight">
              {{ loan.referenceId }}
            </p>
            <p class="text-sm text-white/50 mt-1 font-mono uppercase">
              Application ID: {{ loan.application.id.slice(0, 12) }}...
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase shadow-sm ring-1 ring-white/10"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="statusConfig[loan.status].dot"
              />
              {{ statusConfig[loan.status].label }}
            </span>

            <!-- Quick Actions Dropdown (for status transition) -->
            <div class="relative group">
              <BaseButton
                variant="ghost"
                size="sm"
                class="bg-white/5 hover:bg-white/10 border-none h-8 w-8 p-0 rounded-full"
              >
                <MoreVertical class="w-4 h-4 text-white" />
              </BaseButton>
              <div
                class="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 hidden group-hover:block z-50 overflow-hidden"
              >
                <p
                  class="px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1"
                >
                  Transition Status
                </p>
                <template v-if="loan.status === 'ACTIVE'">
                  <button
                    @click="handleStatusUpdate('COMPLETED')"
                    class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Mark as Completed
                  </button>
                  <button
                    @click="handleStatusUpdate('DEFAULTED')"
                    class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    Mark as Defaulted
                  </button>
                  <button
                    @click="handleStatusUpdate('WRITTEN_OFF')"
                    class="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 font-medium"
                  >
                    Write Off Loan
                  </button>
                </template>
                <template v-if="loan.status === 'DEFAULTED'">
                  <button
                    @click="handleStatusUpdate('ACTIVE')"
                    class="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 font-medium"
                  >
                    Reinstate (Active)
                  </button>
                  <button
                    @click="handleStatusUpdate('WRITTEN_OFF')"
                    class="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 font-medium"
                  >
                    Write Off Loan
                  </button>
                </template>
                <p
                  v-if="['COMPLETED', 'WRITTEN_OFF'].includes(loan.status)"
                  class="px-4 py-3 text-xs text-slate-400 italic"
                >
                  No actions available for final status.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative grid grid-cols-2 gap-6 mb-5">
          <div>
            <p
              class="text-[10px] text-white/50 uppercase tracking-widest mb-1 font-semibold"
            >
              Outstanding Balance
            </p>
            <p class="text-3xl font-bold tracking-tighter text-white">
              {{ formatCurrency(loan.outstandingBalance) }}
            </p>
          </div>
          <div class="self-end">
            <div
              class="flex justify-between text-[10px] font-semibold uppercase text-white/50 mb-2"
            >
              <span
                >{{ Math.round((loan.totalPaid / loan.totalPayable) * 100) }}%
                Repaid</span
              >
              <span
                >{{ formatCurrency(loan.totalPaid) }} /
                {{ formatCurrency(loan.totalPayable) }}</span
              >
            </div>
            <AppProgressBar
              :progress="Math.round((loan.totalPaid / loan.totalPayable) * 100)"
              color-class="bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
              track-class="bg-slate-800 ring-1 ring-white/10"
            />
          </div>
        </div>

        <div
          class="relative grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-white/10"
        >
          <div>
            <p class="text-[10px] text-white/40 mb-1 font-semibold uppercase">
              Principal
            </p>
            <p class="text-sm font-bold">
              {{ formatCurrency(loan.principal) }}
            </p>
          </div>
          <div>
            <p class="text-[10px] text-white/40 mb-1 font-semibold uppercase">
              Interest ({{ loan.loanProduct.interestType }})
            </p>
            <p class="text-sm font-bold">
              {{ (loan.loanProduct.interestRate * 100).toFixed(1) }}%
            </p>
          </div>
          <div>
            <p class="text-[10px] text-white/40 mb-1 font-semibold uppercase">
              Disbursed On
            </p>
            <p class="text-sm font-bold">
              {{ formatDate(loan.disbursedAt) }}
            </p>
          </div>
          <div>
            <p class="text-[10px] text-white/40 mb-1 font-semibold uppercase">
              Contract Tenor
            </p>
            <p class="text-sm font-bold">{{ loan.tenor }} Months</p>
          </div>
        </div>
      </div>

      <!-- Detail Tabs -->
      <div
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50"
      >
        <div class="flex flex-wrap border-b border-slate-100">
          <button
            class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
            :class="
              activeTab === 'schedule'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            "
            @click="activeTab = 'schedule'"
          >
            <CreditCard class="w-4 h-4" /> Repayment Schedule
          </button>
          <!-- <button
            class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
            :class="
              activeTab === 'kyc'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            "
            @click="activeTab = 'kyc'"
          >
            <FileText class="w-4 h-4" /> Review Documents
          </button> -->
          <button
            class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
            :class="
              activeTab === 'transactions'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            "
            @click="activeTab = 'transactions'"
          >
            <History class="w-4 h-4" /> Loan Transactions
          </button>
        </div>

        <div class="p-6">
          <!-- Schedule Tab -->
          <div v-if="activeTab === 'schedule'">
            <div v-if="scheduleLoading && schedule.length === 0">
              <BaseSkeleton
                v-for="i in 5"
                :key="i"
                height="48px"
                class="mb-2 rounded-lg"
              />
            </div>
            <div
              v-else-if="schedule.length === 0"
              class="py-12 text-center text-slate-400 italic"
            >
              Repayment schedule not generated for this contract.
            </div>
            <div v-else class="grid grid-cols-1 w-full overflow-x-auto">
              <table class="w-full text-left text-sm text-slate-600 min-w-225">
                <thead
                  class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]"
                >
                  <tr>
                    <th class="px-4 py-3 rounded-l-lg">No.</th>
                    <th class="px-4 py-3">Due Date</th>
                    <th class="px-4 py-3">Principal</th>
                    <th class="px-4 py-3">Interest</th>
                    <th class="px-4 py-3">Total Due</th>
                    <th class="px-4 py-3 text-right">Balance</th>
                    <th class="px-4 py-3 text-right rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="item in schedule"
                    :key="item.installmentNo"
                    :class="{ 'opacity-50': scheduleLoading }"
                  >
                    <td class="px-4 py-4 font-mono text-xs">
                      {{ item.installmentNo }}
                    </td>
                    <td class="px-4 py-4 font-medium text-slate-800">
                      {{ formatDate(item.dueDate) }}
                    </td>
                    <td class="px-4 py-4 text-slate-500 text-xs">
                      {{ formatCurrency(item.principalDue) }}
                    </td>
                    <td class="px-4 py-4 text-slate-500 text-xs">
                      {{ formatCurrency(item.interestDue) }}
                    </td>
                    <td class="px-4 py-4 font-semibold text-slate-700">
                      {{ formatCurrency(item.totalDue) }}
                    </td>
                    <td
                      class="px-4 py-4 text-right text-slate-400 font-mono text-xs"
                    >
                      {{ formatCurrency(item.balance) }}
                    </td>
                    <td class="px-4 py-4 text-right">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ring-1 ring-inset"
                        :class="
                          item.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                            : item.status === 'OVERDUE'
                              ? 'bg-rose-50 text-rose-700 ring-rose-100'
                              : 'bg-slate-50 text-slate-700 ring-slate-100'
                        "
                      >
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- KYC Documents Tab -->
          <!-- <div v-if="activeTab === 'kyc'" class="flex flex-col gap-6">
            <div
              class="flex items-center justify-between border-b border-slate-100 pb-3"
            >
              <h3
                class="text-xs font-semibold text-slate-700 uppercase tracking-widest"
              >
                Linked Underwriting Assets
              </h3>
              <BaseButton
                variant="ghost"
                size="sm"
                class="text-primary font-semibold"
                @click="
                  router.push({
                    name: 'loan-underwriting',
                    params: { id: loan.application.id },
                  })
                "
              >
                View Application Details
              </BaseButton>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div
                class="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex items-center gap-3"
              >
                <FileText class="w-8 h-8 text-slate-400" />
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-800 truncate">
                    Application_Metadata.json
                  </p>
                  <p
                    class="text-[10px] text-slate-400 uppercase font-semibold tracking-tighter"
                  >
                    System Generated · Audit Ready
                  </p>
                </div>
              </div>
              <div
                class="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex items-center gap-3"
              >
                <FileText class="w-8 h-8 text-slate-400" />
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-800 truncate">
                    Repayment_Mandate_Auth.pdf
                  </p>
                  <p
                    class="text-[10px] text-slate-400 uppercase font-semibold tracking-tighter"
                  >
                    Signed via E-Mandate
                  </p>
                </div>
              </div>
            </div>

            <div
              class="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3"
            >
              <AlertCircle class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div class="text-xs text-amber-800 leading-relaxed">
                <p class="font-semibold mb-1">Audit Protocol</p>
                <p>
                  All disbursed loans have verified KYC documents stored in the
                  encrypted storage. For security, full document previews are
                  restricted to authorized compliance officers only.
                </p>
              </div>
            </div>
          </div> -->

          <!-- Transactions Tab -->
          <div v-if="activeTab === 'transactions'" class="space-y-4">
            <div class="flex justify-between items-center mb-2">
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-widest"
              >
                Financial Ledger (Newest First)
              </p>
              <BaseButton
                variant="ghost"
                size="sm"
                class="text-primary font-semibold"
                @click="
                  router.push({
                    name: 'transactions',
                    query: { loanId: loanId },
                  })
                "
              >
                Detailed Logs
              </BaseButton>
            </div>

            <div class="grid grid-cols-1 overflow-x-auto relative">
              <table class="w-full text-left text-sm text-slate-600 min-w-200">
                <thead
                  class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]"
                >
                  <tr>
                    <th class="px-4 py-3 rounded-l-lg">Reference</th>
                    <th class="px-4 py-3">Type</th>
                    <th class="px-4 py-3">Amount</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3 text-right rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="transactionsLoading && transactions.length === 0">
                    <td colspan="5" class="px-4 py-8">
                      <div class="space-y-3">
                        <BaseSkeleton
                          v-for="i in 5"
                          :key="i"
                          height="48px"
                          class="rounded-xl"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="transactions.length === 0" class="text-center">
                    <td
                      colspan="5"
                      class="px-4 py-16 text-slate-400 font-medium"
                    >
                      No transactions recorded for this loan yet.
                    </td>
                  </tr>
                  <tr
                    v-for="tx in transactions"
                    :key="tx.id"
                    :class="{ 'opacity-50': transactionsLoading }"
                  >
                    <td class="px-4 py-4 font-mono text-[10px] text-slate-500">
                      {{ tx.reference }}
                    </td>
                    <td class="px-4 py-4">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ring-1 ring-inset bg-slate-50 text-slate-600 ring-slate-200"
                      >
                        {{ tx.type.replace("_", " ") }}
                      </span>
                    </td>
                    <td class="px-4 py-4 font-semibold text-slate-900">
                      {{ formatCurrency(tx.amount) }}
                    </td>
                    <td class="px-4 py-4 text-xs font-medium">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ring-1 ring-inset"
                        :class="{
                          'bg-emerald-50 text-emerald-700 ring-emerald-100':
                            tx.status === 'SUCCESS',
                          'bg-amber-50 text-amber-700 ring-amber-100':
                            tx.status === 'PENDING',
                          'bg-rose-50 text-rose-700 ring-rose-100':
                            tx.status === 'FAILED',
                          'bg-slate-100 text-slate-700 ring-slate-200':
                            tx.status === 'REVERSED',
                        }"
                      >
                        {{ tx.status }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-right">
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        class="text-primary hover:bg-primary-50 p-1.5 h-auto rounded-lg"
                        @click="
                          router.push({
                            name: 'transaction-detail',
                            params: { id: tx.id },
                          })
                        "
                      >
                        <Eye class="w-4 h-4" />
                      </BaseButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="transactionsTotalPages > 1"
              class="flex justify-end pt-4"
            >
              <AppPagination
                v-model:current-page="transactionsPage"
                :total-pages="transactionsTotalPages"
                :total-items="totalTransactions"
                :page-size="10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SIDEBAR -->
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 xl:sticky top-6"
    >
      <h3
        class="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest"
      >
        Applicant Profile
      </h3>

      <div class="flex items-center gap-4 mb-8">
        <div
          class="w-14 h-14 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xl shadow-inner ring-1 ring-primary-100"
        >
          {{ loan.applicant.firstName[0] }}{{ loan.applicant.lastName[0] }}
        </div>
        <div>
          <p class="font-semibold text-slate-900 text-lg leading-tight">
            {{ loan.applicant.firstName }} {{ loan.applicant.lastName }}
          </p>
          <BaseButton
            variant="ghost"
            size="sm"
            class="p-0 h-auto text-primary font-semibold text-xs mt-1"
            @click="
              router.push({
                name: 'customer-detail',
                params: { id: loan.applicant.id },
              })
            "
          >
            View Full Profile →
          </BaseButton>
        </div>
      </div>

      <div class="flex flex-col gap-6 text-sm">
        <div class="flex items-start gap-4">
          <div class="p-2 bg-slate-50 rounded-lg shrink-0">
            <Home class="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p
              class="text-slate-400 text-[10px] font-semibold uppercase tracking-tighter mb-0.5"
            >
              Primary Residence
            </p>
            <p class="font-semibold text-slate-800 leading-tight">
              {{ loan.applicant.residentialAddress }},
              {{ loan.applicant.city }}, {{ loan.applicant.state }}
            </p>
          </div>
        </div>

        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <p
            class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4"
          >
            Settlement Account
          </p>
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200"
            >
              <Briefcase class="w-5 h-5 text-slate-400" />
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-slate-800 text-sm truncate">
                {{ loan.disbursementAccount.bankName }}
              </p>
              <p class="text-xs font-mono text-slate-500 tracking-tighter">
                {{ loan.disbursementAccount.accountNumber }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="py-20 text-center">
    <AlertCircle class="w-12 h-12 text-slate-200 mx-auto mb-4" />
    <p class="text-slate-500 font-medium">Loan contract not found or moved.</p>
    <BaseButton
      variant="ghost"
      class="mt-4"
      @click="router.push({ name: 'loan-operations' })"
      >Return to Dashboard</BaseButton
    >
  </div>

  <!-- Status Transition Confirm -->
  <AppConfirmDialog
    v-model="isConfirmOpen"
    title="Confirm Status Transition"
    :message="`Are you sure you want to transition this loan to ${pendingStatusChange}? This action will be logged in the audit trail.`"
    confirm-text="Update Status"
    confirm-variant="primary"
    @confirm="confirmStatusUpdate"
  />
</template>
