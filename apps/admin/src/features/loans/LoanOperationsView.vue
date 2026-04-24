<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  AppTextInput,
  AppPagination,
  BaseButton,
  AppDatePicker,
} from "@bcl/ui";
import {
  Eye,
  Clock,
  CheckCircle2,
  Search,
  ListFilter,
  History,
  XCircle,
} from "lucide-vue-next";
import {
  type AdminDisbursedLoanListItem,
  type LoanStatus,
  type ApiClientError,
} from "@bcl/types";
import { useToastStore } from "@/stores/toast";
import { getDisbursedLoans } from "./api";
import LoanTableSkeleton from "./components/LoanTableSkeleton.vue";

const router = useRouter();
const toastStore = useToastStore();

// ── State ──────────────────────────────────────────────────────────────────────

const loans = ref<AdminDisbursedLoanListItem[]>([]);
const totalItems = ref(0);
const totalPages = ref(1);
const loading = ref(false);

const searchQuery = ref("");
const dateRange = ref<Date[] | null>(null);
const currentPage = ref(1);

const tabs = [
  { value: "ALL", label: "All Portfolio", icon: ListFilter },
  { value: "ACTIVE", label: "Active Loans", icon: CheckCircle2 },
  { value: "DEFAULTED", label: "Defaulted", icon: Clock },
  { value: "COMPLETED", label: "Completed", icon: History },
  { value: "WRITTEN_OFF", label: "Written Off", icon: XCircle },
] as const;
const activeTab = ref<LoanStatus | "ALL">("ALL");

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function fetchLoans(): Promise<void> {
  loading.value = true;
  try {
    const statusFilter =
      activeTab.value === "ALL" ? undefined : activeTab.value;

    const res = await getDisbursedLoans({
      status: statusFilter,
      page: currentPage.value,
      limit: 10,
      search: searchQuery.value || undefined,
      dateFrom: dateRange.value?.[0]?.toISOString(),
      dateTo: dateRange.value?.[1]?.toISOString(),
    });

    loans.value = res.data.items;
    totalItems.value = res.data.total;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || "Failed to fetch loans");
    console.error("Fetch loans failed:", error);
  } finally {
    loading.value = false;
  }
}

// Watchers
watch([currentPage, activeTab, dateRange], () => {
  fetchLoans();
});

let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchLoans();
  }, 500);
});

onMounted(fetchLoans);

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStatusColor(status: LoanStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700 ring-emerald-200";
    case "DEFAULTED":
      return "bg-rose-100 text-rose-700 ring-rose-200";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700 ring-blue-200";
    case "WRITTEN_OFF":
      return "bg-slate-900 text-slate-100 ring-slate-800";
    default:
      return "bg-slate-100 text-slate-500 ring-slate-200";
  }
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string | null) {
  if (!iso) return "N/A";
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
          Loans Operations
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Monitor active loan portfolios, manage defaults, and review historical
          performance.
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="
          () => {
            activeTab = tab.value;
            currentPage = 1;
          }
        "
        class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
        :class="
          activeTab === tab.value
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        "
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Main Content -->
    <div
      class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
      <!-- Toolbar -->
      <div
        class="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-50/50"
      >
        <div class="w-full sm:max-w-md">
          <AppTextInput
            id="search"
            v-model="searchQuery"
            placeholder="Search by reference, loanee or email..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-auto flex items-center justify-end gap-3 px-1">
          <AppDatePicker
            v-model="dateRange"
            range
            placeholder="Disbursement date"
            class="w-full sm:w-64"
          />
          <div
            v-if="!loading"
            class="hidden sm:block text-xs text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap"
          >
            {{ totalItems }} found
          </div>
        </div>
      </div>

      <LoanTableSkeleton v-if="loading && loans.length === 0" />

      <template v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block w-full overflow-x-auto">
          <table
            class="w-full text-left text-sm text-slate-600 border-collapse min-w-225"
          >
            <thead
              class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100"
            >
              <tr>
                <th scope="col" class="px-6 py-4 font-medium">
                  Loan Reference
                </th>
                <th scope="col" class="px-6 py-4 font-medium">Customer</th>
                <th scope="col" class="px-6 py-4 font-medium">Financials</th>
                <th scope="col" class="px-6 py-4 font-medium">Status</th>
                <th scope="col" class="px-6 py-4 font-medium">Disbursed On</th>
                <th scope="col" class="px-6 py-4 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loans.length === 0">
                <td colspan="6" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-2 opacity-30">
                    <Search class="w-10 h-10" />
                    <p class="font-medium">
                      No records found matching criteria.
                    </p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="loan in loans"
                :key="loan.id"
                class="hover:bg-slate-50 transition-colors"
                :class="{ 'opacity-50 grayscale': loading }"
              >
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">
                    {{ loan.referenceId }}
                  </div>
                  <div
                    class="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter"
                  >
                    ID: {{ loan.id.slice(0, 8) }}...
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0"
                    >
                      {{ loan.applicantName[0] }}
                    </div>
                    <div class="font-medium text-slate-800">
                      {{ loan.applicantName }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-800">
                    {{ formatCurrency(loan.principal) }}
                  </div>
                  <div
                    class="text-[10px] text-slate-400 font-bold uppercase mt-0.5"
                  >
                    Bal: {{ formatCurrency(loan.outstandingBalance) }} ·
                    {{ loan.tenor }} Months
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 shadow-sm',
                      getStatusColor(loan.status),
                    ]"
                  >
                    {{ loan.status.replace("_", " ") }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500 font-medium italic">
                  {{ formatDate(loan.disbursedAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    class="text-primary hover:bg-primary-50 px-3 font-bold"
                    @click="
                      () => {
                        router.push({
                          name: 'admin-loan-detail',
                          params: { id: loan.id },
                        });
                      }
                    "
                  >
                    <Eye class="w-4 h-4 mr-1.5" /> View Details
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col divide-y divide-slate-100">
          <div
            v-for="loan in loans"
            :key="`mobile-${loan.id}`"
            class="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-4"
            :class="{ 'opacity-50': loading }"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0"
                >
                  {{ loan.applicantName[0] }}
                </div>
                <div>
                  <div class="font-bold text-slate-800">
                    {{ loan.applicantName }}
                  </div>
                  <div
                    class="text-[10px] text-slate-500 font-mono uppercase mt-0.5 tracking-tight"
                  >
                    Ref: {{ loan.referenceId }}
                  </div>
                </div>
              </div>

              <BaseButton
                variant="ghost"
                size="sm"
                class="text-primary font-bold p-0 h-auto"
                @click="
                  router.push({
                    name: 'admin-loan-detail',
                    params: { id: loan.id },
                  })
                "
              >
                View Details
              </BaseButton>
            </div>

            <div class="flex justify-between items-end">
              <div>
                <div class="text-sm font-bold text-slate-800">
                  {{ formatCurrency(loan.principal) }}
                </div>
                <div
                  class="text-[10px] text-slate-500 uppercase font-bold mt-0.5"
                >
                  Bal: {{ formatCurrency(loan.outstandingBalance) }} ·
                  {{ loan.tenor }}M
                </div>
              </div>
              <div class="flex flex-col items-end gap-1.5">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                    getStatusColor(loan.status),
                  ]"
                >
                  {{ loan.status.replace("_", " ") }}
                </span>
                <span class="text-[10px] text-slate-400 italic">{{
                  formatDate(loan.disbursedAt)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          :page-size="10"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
