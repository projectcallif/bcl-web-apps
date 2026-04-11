<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AppTextInput, AppPagination, BaseButton, AppPopover } from "@bcl/ui";
import { Filter, MoreVertical, Eye, AlertCircle } from "lucide-vue-next";
import type { LoanApplication, LoanStatus } from "@bcl/types";

const router = useRouter();

const searchQuery = ref("");
const currentPage = ref(1);
const activeTab = ref<"ALL" | "PENDING" | "ACTIVE" | "REJECTED">("ALL");

// Mock Data
type AugmentedLoanApp = LoanApplication & {
  customerName: string;
  email: string;
};

const mockLoans = ref<AugmentedLoanApp[]>([
  {
    id: "loan_1",
    userId: "usr_1",
    customerName: "John Doe",
    email: "john@example.com",
    amountRequested: 500000,
    tenorMonths: 6,
    purpose: "Business Expansion",
    status: "ACTIVE",
    appliedAt: "Oct 24, 2026",
  },
  {
    id: "loan_2",
    userId: "usr_5",
    customerName: "Frank Under",
    email: "frank@example.com",
    amountRequested: 1000000,
    tenorMonths: 12,
    purpose: "Vehicle Purchase",
    status: "PENDING",
    appliedAt: "Oct 25, 2026",
  },
  {
    id: "loan_3",
    userId: "usr_6",
    customerName: "Claire Smith",
    email: "claire@example.com",
    amountRequested: 250000,
    tenorMonths: 3,
    purpose: "Medical Bill",
    status: "REJECTED",
    appliedAt: "Oct 20, 2026",
    rejectionReason: "Failed Age Rule Verification (Applicant is under 18)",
  },
  {
    id: "loan_4",
    userId: "usr_7",
    customerName: "Bruce Banner",
    email: "bruce@example.com",
    amountRequested: 750000,
    tenorMonths: 9,
    purpose: "Home Renovation",
    status: "REJECTED",
    appliedAt: "Oct 21, 2026",
    rejectionReason: "Missing Mandatory Field (Proof of Employment)",
  },
]);

const filteredLoans = computed(() => {
  let result = mockLoans.value;
  if (activeTab.value !== "ALL") {
    result = result.filter((l) => l.status === activeTab.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (l) =>
        l.customerName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q),
    );
  }
  return result;
});

function getStatusColor(status: LoanStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "REJECTED":
      return "bg-rose-100 text-rose-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
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
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Loan Triage
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Review, manage, and analyze loan applications.
        </p>
      </div>
    </div>

    <!-- Stats summary for tabs -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
      <button
        v-for="tab in [
          { value: 'ALL', label: 'All Applications' },
          { value: 'PENDING', label: 'Pending Review' },
          { value: 'ACTIVE', label: 'Active Loans' },
          { value: 'REJECTED', label: 'Rejected Logs' },
        ]"
        :key="tab.value"
        @click="activeTab = tab.value as typeof activeTab"
        class="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
        :class="
          activeTab === tab.value
            ? 'bg-slate-800 text-white shadow-sm'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Main Card -->
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
            placeholder="Search loans by reference, name or email..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-auto flex items-center justify-end gap-2">
          <BaseButton variant="ghost" class="bg-white border border-slate-200">
            <span class="flex items-center gap-2 text-slate-600"
              ><Filter class="w-4 h-4" /> Filters</span
            >
          </BaseButton>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block w-full overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 border-collapse">
          <thead
            class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100"
          >
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">Applicant</th>
              <th scope="col" class="px-6 py-4 font-medium">Amount & Tenor</th>
              <th scope="col" class="px-6 py-4 font-medium">
                Status & Details
              </th>
              <th scope="col" class="px-6 py-4 font-medium">Date</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredLoans.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                No loan applications found matching criteria.
              </td>
            </tr>
            <tr
              v-for="loan in filteredLoans"
              :key="loan.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Applicant -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-primary-100"
                  >
                    {{ loan.customerName[0] }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">
                      {{ loan.customerName }}
                    </div>
                    <div class="text-xs text-slate-500 font-mono mt-0.5">
                      {{ loan.email }}
                    </div>
                  </div>
                </div>
              </td>
              <!-- Amount & Tenor -->
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-800">
                  {{ formatCurrency(loan.amountRequested) }}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ loan.tenorMonths }} Months · {{ loan.purpose }}
                </div>
              </td>
              <!-- Status & Details -->
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
                  v-if="loan.status === 'REJECTED' && loan.rejectionReason"
                  class="mt-2 text-xs flex items-start gap-1 max-w-xs text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100"
                >
                  <AlertCircle class="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span class="leading-tight">{{ loan.rejectionReason }}</span>
                </div>
              </td>
              <!-- Date -->
              <td class="px-6 py-4 text-slate-500">{{ loan.appliedAt }}</td>
              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex justify-end">
                  <AppPopover>
                    <template #trigger="{ isOpen }">
                      <button
                        :class="[
                          'text-slate-400 p-1.5 rounded-lg transition-colors',
                          isOpen
                            ? 'bg-primary-50 text-primary-600'
                            : 'hover:bg-slate-100 hover:text-slate-600',
                        ]"
                      >
                        <MoreVertical class="w-5 h-5" />
                      </button>
                    </template>
                    <template #content="{ close }">
                      <button
                        @click="
                          router.push({
                            name: 'admin-loan-detail',
                            params: { id: loan.id },
                          });
                          close();
                        "
                        class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <Eye class="w-4 h-4 text-slate-400" /> View Application
                        Details
                      </button>
                    </template>
                  </AppPopover>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden flex flex-col divide-y divide-slate-100">
        <div v-if="filteredLoans.length === 0" class="p-8 text-center text-slate-500">
          No loan applications found matching criteria.
        </div>
        <div
          v-for="loan in filteredLoans"
          :key="`mobile-${loan.id}`"
          class="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0 ring-1 ring-primary-100"
              >
                {{ loan.customerName[0] }}
              </div>
              <div>
                <div class="font-medium text-slate-800">
                  {{ loan.customerName }}
                </div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">
                  {{ loan.email }}
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <AppPopover>
                <template #trigger="{ isOpen }">
                  <button
                    :class="[
                      'text-slate-400 p-1.5 rounded-lg transition-colors',
                      isOpen
                        ? 'bg-primary-50 text-primary-600'
                        : 'hover:bg-slate-100 hover:text-slate-600',
                    ]"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </template>
                <template #content="{ close }">
                  <button
                    @click="
                      router.push({
                        name: 'admin-loan-detail',
                        params: { id: loan.id },
                      });
                      close();
                    "
                    class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <Eye class="w-4 h-4 text-slate-400" /> View Application Details
                  </button>
                </template>
              </AppPopover>
            </div>
          </div>
          
          <div>
            <div class="font-medium text-slate-800">
              {{ formatCurrency(loan.amountRequested) }}
            </div>
            <div class="text-xs text-slate-500 mt-0.5">
              {{ loan.tenorMonths }} Months · {{ loan.purpose }}
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 mt-1">
            <span
              :class="[
                'px-2 py-0.5 rounded text-xs font-semibold uppercase',
                getStatusColor(loan.status),
              ]"
            >
              {{ loan.status }}
            </span>
            <span class="text-xs text-slate-500">{{ loan.appliedAt }}</span>
          </div>

          <div
            v-if="loan.status === 'REJECTED' && loan.rejectionReason"
            class="text-xs flex items-start gap-1 text-rose-600 bg-rose-50 p-2 rounded border border-rose-100"
          >
            <AlertCircle class="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span class="leading-tight">{{ loan.rejectionReason }}</span>
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
