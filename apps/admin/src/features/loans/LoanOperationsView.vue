<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AppTextInput, AppPagination, BaseButton, AppDatePicker } from "@bcl/ui";
import {
  Eye,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-vue-next";
import type { Loan, LoanStatus } from "@bcl/types";

const router = useRouter();

const searchQuery = ref("");
const dateRange = ref<Date[] | null>(null);
const currentPage = ref(1);
const activeTab = ref<"ALL" | "ACTIVE" | "DEFAULT" | "CLOSED">("ALL");

// Mock Data for Operations
type AugmentedLoan = Loan & {
  customerName: string;
  email: string;
};

const mockLoans = ref<AugmentedLoan[]>([
  {
    id: "LOAN-88221",
    referenceId: "BCL-2026-A10",
    applicationId: "app_1",
    customerName: "Michael Doe",
    email: "michael@example.com",
    principal: 500000,
    interestAmount: 50000,
    totalPayable: 550000,
    outstandingBalance: 350000,
    tenor: 6,
    disbursedAt: "2026-08-01T00:00:00Z",
    firstDueDate: "2026-09-01T00:00:00Z",
    finalDueDate: "2027-02-01T00:00:00Z",
    status: "ACTIVE",
    createdAt: "2026-07-25T00:00:00Z",
    loanProduct: {
      id: "p1",
      name: "Personal Loan",
      minAmount: 10000,
      maxAmount: 1000000,
      minTenor: 1,
      maxTenor: 12,
      interestRate: 0.05,
      interestType: "FIXED",
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
    id: "LOAN-98104",
    referenceId: "BCL-2026-D99",
    applicationId: "app_2",
    customerName: "Sarah Connor",
    email: "sarah@example.com",
    principal: 2000000,
    interestAmount: 400000,
    totalPayable: 2400000,
    outstandingBalance: 2000000,
    tenor: 12,
    disbursedAt: "2026-05-15T00:00:00Z",
    firstDueDate: "2026-06-15T00:00:00Z",
    finalDueDate: "2027-05-15T00:00:00Z",
    status: "OVERDUE",
    createdAt: "2026-05-10T00:00:00Z",
    loanProduct: {
      id: "p2",
      name: "Business Loan",
      minAmount: 500000,
      maxAmount: 5000000,
      minTenor: 3,
      maxTenor: 24,
      interestRate: 0.04,
      interestType: "FIXED",
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
  {
    id: "LOAN-77221",
    referenceId: "BCL-2025-C01",
    applicationId: "app_3",
    customerName: "James Bond",
    email: "007@mi6.com",
    principal: 100000,
    interestAmount: 10000,
    totalPayable: 110000,
    outstandingBalance: 0,
    tenor: 3,
    disbursedAt: "2025-01-01T00:00:00Z",
    firstDueDate: "2025-02-01T00:00:00Z",
    finalDueDate: "2025-04-01T00:00:00Z",
    status: "CLOSED",
    createdAt: "2024-12-25T00:00:00Z",
    loanProduct: {
      id: "p1",
      name: "Personal Loan",
      minAmount: 10000,
      maxAmount: 1000000,
      minTenor: 1,
      maxTenor: 12,
      interestRate: 0.05,
      interestType: "FIXED",
      isActive: true,
      tenors: [],
    },
    disbursementAccount: {
      id: "acc_3",
      bankName: "First Bank",
      accountNumber: "1122334455",
      accountName: "James Bond",
    },
  },
]);

const filteredLoans = computed(() => {
  let result = mockLoans.value;
  if (activeTab.value !== "ALL") {
    if (activeTab.value === "DEFAULT") {
      result = result.filter((l) => l.status === "OVERDUE");
    } else {
      result = result.filter((l) => l.status === activeTab.value);
    }
  }

  if (dateRange.value && dateRange.value[0]) {
    const start = new Date(dateRange.value[0]).getTime();
    result = result.filter(
      (l) => l.disbursedAt && new Date(l.disbursedAt).getTime() >= start,
    );
  }

  if (dateRange.value && dateRange.value[1]) {
    const end = new Date(dateRange.value[1]).getTime() + 86400000;
    result = result.filter(
      (l) => l.disbursedAt && new Date(l.disbursedAt).getTime() < end,
    );
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (l) =>
        l.customerName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.referenceId.toLowerCase().includes(q),
    );
  }
  return result;
});

function getStatusColor(status: LoanStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "OVERDUE":
      return "bg-rose-100 text-rose-700 font-bold animate-pulse";
    case "CLOSED":
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-slate-100 text-slate-700";
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
        v-for="tab in [
          { value: 'ALL', label: 'All Portfolio', icon: Clock },
          { value: 'ACTIVE', label: 'Active Loans', icon: TrendingUp },
          { value: 'DEFAULT', label: 'Defaults / Overdue', icon: AlertCircle },
          { value: 'CLOSED', label: 'Closed / Paid', icon: CheckCircle2 },
        ]"
        :key="tab.value"
        @click="activeTab = tab.value as any"
        class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
        :class="
          activeTab === tab.value
            ? 'bg-slate-800 text-white shadow-sm'
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
            class="hidden sm:block text-xs text-slate-400 font-medium italic whitespace-nowrap"
          >
            Showing {{ filteredLoans.length }} records
          </div>
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
              <th scope="col" class="px-6 py-4 font-medium">Loanee</th>
              <th scope="col" class="px-6 py-4 font-medium">
                Principal & Balance
              </th>
              <th scope="col" class="px-6 py-4 font-medium">Health Status</th>
              <th scope="col" class="px-6 py-4 font-medium">Disbursed On</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredLoans.length === 0">
              <td
                colspan="5"
                class="px-6 py-8 text-center text-slate-500 italic"
              >
                No records found in this segment.
              </td>
            </tr>
            <tr
              v-for="loan in filteredLoans"
              :key="loan.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="font-medium text-slate-800">
                  {{ loan.customerName }}
                </div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">
                  {{ loan.referenceId }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-800">
                  {{ formatCurrency(loan.outstandingBalance) }}
                </div>
                <div
                  class="text-[10px] text-slate-400 mt-0.5 uppercase tracking-tighter"
                >
                  Out of {{ formatCurrency(loan.totalPayable) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
                    getStatusColor(loan.status),
                  ]"
                >
                  {{ loan.status }}
                </span>
                <div
                  v-if="loan.status === 'OVERDUE'"
                  class="text-[10px] text-rose-500 mt-1 font-bold"
                >
                  Immediate Follow-up Required
                </div>
              </td>
              <td class="px-6 py-4 text-slate-500 text-xs">
                {{ formatDate(loan.disbursedAt) }}
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  class="text-slate-500 hover:text-primary-600 font-medium"
                  @click="
                    router.push({
                      name: 'admin-loan-detail',
                      params: { id: loan.id },
                    })
                  "
                >
                  <Eye class="w-4 h-4 mr-1.5" /> View Ledger
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden flex flex-col divide-y divide-slate-100">
        <div
          v-for="loan in filteredLoans"
          :key="`mob-${loan.id}`"
          class="p-4 hover:bg-slate-50 flex flex-col gap-3"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold text-slate-800">
                {{ loan.customerName }}
              </div>
              <div class="text-[10px] text-slate-500 font-mono">
                {{ loan.referenceId }}
              </div>
            </div>
            <span
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                getStatusColor(loan.status),
              ]"
            >
              {{ loan.status }}
            </span>
          </div>
          <div class="flex justify-between items-end">
            <div>
              <p
                class="text-[10px] text-slate-400 font-bold uppercase tracking-widest"
              >
                Balance
              </p>
              <p class="text-sm font-bold text-slate-800">
                {{ formatCurrency(loan.outstandingBalance) }}
              </p>
            </div>
            <BaseButton
              variant="ghost"
              size="sm"
              class="text-primary-600 p-0 h-auto"
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
        </div>
      </div>

      <!-- Pagination -->
      <div
        class="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="1"
          :total-items="filteredLoans.length"
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
