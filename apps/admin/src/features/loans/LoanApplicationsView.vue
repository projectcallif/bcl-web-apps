<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  AppTextInput,
  AppPagination,
  BaseButton,
  AppDatePicker,
} from "@bcl/ui";
import { Clock, XCircle, ShieldAlert, ListFilter, Eye } from "lucide-vue-next";
import type { LoanApplication, LoanStatus } from "@bcl/types";

const router = useRouter();

const searchQuery = ref("");
const dateRange = ref<Date[] | null>(null);
const currentPage = ref(1);
const activeTab = ref<
  "ALL" | "PENDING" | "AUTO_REJECTED" | "MANUALLY_REJECTED" | "REJECT_LOGS"
>("ALL");

// Mock Data for Applications
type AugmentedApplication = LoanApplication & {
  customerName: string;
  email: string;
  rejectType?: "AUTO" | "MANUAL";
};

const mockApps = ref<AugmentedApplication[]>([
  {
    id: "APP-122",
    userId: "usr_1",
    customerName: "Jane Foster",
    email: "jane@thor.com",
    amountRequested: 300000,
    tenorMonths: 6,
    purpose: "Business Equipment",
    status: "PENDING",
    appliedAt: "2026-10-25T14:30:00Z",
  },
  {
    id: "APP-123",
    userId: "usr_2",
    customerName: "Tony Stark",
    email: "tony@stark.id",
    amountRequested: 5000000,
    tenorMonths: 12,
    purpose: "Arc Reactor Maintenance",
    status: "REJECTED",
    appliedAt: "2026-10-24T09:15:00Z",
    rejectionReason: "CREDIT_SCORE_BELOW_THRESHOLD",
    rejectType: "AUTO",
  },
  {
    id: "APP-124",
    userId: "usr_3",
    customerName: "Steve Rogers",
    email: "cap@vanguard.org",
    amountRequested: 100000,
    tenorMonths: 24,
    purpose: "Classic Shield Restoration",
    status: "REJECTED",
    appliedAt: "2026-10-23T11:45:00Z",
    rejectionReason:
      "Inconsistent employment history found during manual verification.",
    rejectType: "MANUAL",
  },
  {
    id: "APP-125",
    userId: "usr_4",
    customerName: "Wanda Maximoff",
    email: "wanda@chaos.io",
    amountRequested: 750000,
    tenorMonths: 6,
    purpose: "Education",
    status: "PENDING",
    appliedAt: "2026-10-25T16:00:00Z",
  },
]);

const filteredApps = computed(() => {
  let result = mockApps.value;

  if (activeTab.value !== "ALL") {
    switch (activeTab.value) {
      case "PENDING":
        result = result.filter((a) => a.status === "PENDING");
        break;
      case "AUTO_REJECTED":
        result = result.filter(
          (a) => a.status === "REJECTED" && a.rejectType === "AUTO",
        );
        break;
      case "MANUALLY_REJECTED":
        result = result.filter(
          (a) => a.status === "REJECTED" && a.rejectType === "MANUAL",
        );
        break;
      case "REJECT_LOGS":
        result = result.filter((a) => a.status === "REJECTED");
        break;
    }
  }

  if (dateRange.value && dateRange.value[0]) {
    const start = new Date(dateRange.value[0]).getTime();
    result = result.filter(
      (a) => a.appliedAt && new Date(a.appliedAt).getTime() >= start,
    );
  }

  if (dateRange.value && dateRange.value[1]) {
    const end = new Date(dateRange.value[1]).getTime() + 86400000;
    result = result.filter(
      (a) => a.appliedAt && new Date(a.appliedAt).getTime() < end,
    );
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (a) =>
        a.customerName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q),
    );
  }
  return result;
});

function getStatusColor(status: LoanStatus, rejectType?: string) {
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "REJECTED") {
    return rejectType === "AUTO"
      ? "bg-rose-100 text-rose-700 font-bold"
      : "bg-slate-200 text-slate-700 font-bold";
  }
  return "bg-slate-100 text-slate-400";
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
          Loan Applications
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Review new loan requests and audit rejection decisions.
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
      <button
        v-for="tab in [
          { value: 'ALL', label: 'All Requests', icon: ListFilter },
          { value: 'PENDING', label: 'Pending Review', icon: Clock },
          { value: 'AUTO_REJECTED', label: 'Auto Rejected', icon: ShieldAlert },
          {
            value: 'MANUALLY_REJECTED',
            label: 'Manual Rejected',
            icon: XCircle,
          },
          {
            value: 'REJECT_LOGS',
            label: 'Audit Logs (Rejections)',
            icon: ListFilter,
          },
        ]"
        :key="tab.value"
        @click="activeTab = tab.value as any"
        class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
        :class="
          activeTab === tab.value
            ? 'bg-primary-900 text-white shadow-sm'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        "
      >
        <component :is="tab.icon" class="w-4 h-4" />
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
            placeholder="Search by ID, name or email..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-auto flex items-center justify-end gap-3 px-1">
          <AppDatePicker
            v-model="dateRange"
            range
            placeholder="Application date"
            class="w-full sm:w-64"
          />
          <div
            class="hidden sm:block text-xs text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap"
          >
            {{ filteredApps.length }} found
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
              <th scope="col" class="px-6 py-4 font-medium">Applicant</th>
              <th scope="col" class="px-6 py-4 font-medium">
                Underwriting Info
              </th>
              <th scope="col" class="px-6 py-4 font-medium">Current Status</th>
              <th scope="col" class="px-6 py-4 font-medium italic">
                Applied On
              </th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredApps.length === 0">
              <td
                colspan="5"
                class="px-6 py-12 text-center text-slate-400 font-medium"
              >
                No matching applications in this queue.
              </td>
            </tr>
            <tr
              v-for="app in filteredApps"
              :key="app.id"
              class="hover:bg-slate-50 group transition-colors"
            >
              <td class="px-6 py-4">
                <div class="font-bold text-slate-900">
                  {{ app.customerName }}
                </div>
                <div class="text-[10px] text-slate-500 font-mono mt-0.5">
                  {{ app.email }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-800">
                  {{ formatCurrency(app.amountRequested) }}
                </div>
                <div class="text-[10px] text-slate-400 uppercase font-bold">
                  {{ app.tenorMonths }} Months · {{ app.purpose }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase ring-1 shadow-xs',
                    getStatusColor(app.status, app.rejectType),
                  ]"
                >
                  {{ app.status }}
                  {{ app.rejectType ? `(${app.rejectType})` : "" }}
                </span>
                <div
                  v-if="app.rejectionReason"
                  class="mt-2 text-[10px] text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100 max-w-64 line-clamp-2 italic"
                >
                  {{ app.rejectionReason }}
                </div>
              </td>
              <td class="px-6 py-4 text-xs text-slate-400 font-medium">
                {{ formatDate(app.appliedAt) }}
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  class="text-primary-600 hover:bg-primary-50 px-3"
                  @click="
                    router.push({
                      name: 'loan-underwriting',
                      params: { id: app.id },
                    })
                  "
                >
                  <Eye class="w-4 h-4 mr-1.5" />
                  Review Decision
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden flex flex-col divide-y divide-slate-100">
        <div
          v-for="app in filteredApps"
          :key="`mob-app-${app.id}`"
          class="p-4 hover:bg-slate-50 flex flex-col gap-3"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold text-slate-800">{{ app.customerName }}</div>
              <div class="text-[10px] text-slate-500">{{ app.email }}</div>
            </div>
            <span
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                getStatusColor(app.status, app.rejectType),
              ]"
            >
              {{ app.status }}
            </span>
          </div>
          <div class="flex justify-between items-center mt-1">
            <div class="text-sm font-bold text-slate-800">
              {{ formatCurrency(app.amountRequested) }}
            </div>
            <BaseButton
              variant="ghost"
              size="sm"
              class="text-primary-600 font-bold p-0 h-auto"
              @click="
                router.push({
                  name: 'loan-underwriting',
                  params: { id: app.id },
                })
              "
            >
              Review Decision
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
          :total-items="filteredApps.length"
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
