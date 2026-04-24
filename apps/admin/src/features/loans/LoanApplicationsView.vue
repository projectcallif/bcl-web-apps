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
  Clock,
  XCircle,
  ListFilter,
  Eye,
  CheckCircle2,
  Banknote,
} from "lucide-vue-next";
import type {
  AdminLoanApplicationListItem,
  LoanApplicationStatus,
} from "@bcl/types";
import { getLoanApplications } from "./api";
import LoanApplicationSkeleton from "./components/LoanApplicationSkeleton.vue";

const router = useRouter();

// ── State ──────────────────────────────────────────────────────────────────────

const applications = ref<AdminLoanApplicationListItem[]>([]);
const totalItems = ref(0);
const totalPages = ref(1);
const loading = ref(false);

const searchQuery = ref("");
const dateRange = ref<Date[] | null>(null);
const currentPage = ref(1);
const activeTab = ref<LoanApplicationStatus | "ALL">("ALL");

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function fetchApplications(): Promise<void> {
  loading.value = true;
  try {
    const res = await getLoanApplications({
      status: activeTab.value === "ALL" ? undefined : activeTab.value,
      page: currentPage.value,
      limit: 10,
    });
    applications.value = res.data.data;
    totalItems.value = res.data.meta.total;
    totalPages.value = res.data.meta.totalPages;
  } catch (err) {
    console.error("Failed to fetch applications:", err);
  } finally {
    loading.value = false;
  }
}

watch([currentPage, activeTab, dateRange], fetchApplications);

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchApplications();
  }, 500);
});

onMounted(fetchApplications);

// ── Formatters ─────────────────────────────────────────────────────────────────

function getStatusColor(status: LoanApplicationStatus): string {
  switch (status) {
    case "UNDER_REVIEW":
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700 ring-emerald-200";
    case "REJECTED":
      return "bg-rose-100 text-rose-700 ring-rose-200";
    case "DISBURSED":
      return "bg-primary-100 text-primary-700 ring-primary-200";
    default:
      return "bg-slate-100 text-slate-500 ring-slate-200";
  }
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const TABS: {
  label: string;
  value: LoanApplicationStatus | "ALL";
  icon: any;
}[] = [
  { label: "All Requests", value: "ALL", icon: ListFilter },
  { label: "Under Review", value: "UNDER_REVIEW", icon: Clock },
  { label: "Approved", value: "APPROVED", icon: CheckCircle2 },
  { label: "Disbursed", value: "DISBURSED", icon: Banknote },
  { label: "Rejected", value: "REJECTED", icon: XCircle },
];
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
          Review new loan requests and manage the underwriting pipeline.
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
      <button
        v-for="tab in TABS"
        :key="tab.value"
        @click="
          activeTab = tab.value;
          currentPage = 1;
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
            v-if="!loading"
            class="hidden sm:block text-xs text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap"
          >
            {{ totalItems }} found
          </div>
        </div>
      </div>

      <LoanApplicationSkeleton v-if="loading && applications.length === 0" />

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
                <th scope="col" class="px-6 py-4 font-medium">Applicant</th>
                <th scope="col" class="px-6 py-4 font-medium">
                  Underwriting Info
                </th>
                <th scope="col" class="px-6 py-4 font-medium">
                  Current Status
                </th>
                <th scope="col" class="px-6 py-4 font-medium italic">
                  Applied On
                </th>
                <th scope="col" class="px-6 py-4 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="applications.length === 0">
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-2 opacity-30">
                    <ListFilter class="w-10 h-10" />
                    <p class="font-medium">No matching applications found</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="app in applications"
                :key="app.id"
                class="hover:bg-slate-50 group transition-colors"
                :class="{ 'opacity-50 grayscale shadow-inner': loading }"
              >
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">
                    {{ app.applicantName }}
                  </div>
                  <div class="text-[10px] text-slate-500 font-mono mt-0.5">
                    ID: {{ app.id.slice(0, 8) }}...
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="font-semibold text-slate-800">
                    {{ formatCurrency(app.requestedAmount) }}
                  </div>
                  <div class="text-[10px] text-slate-400 uppercase font-bold">
                    {{ app.requestedTenor }} Months · {{ app.purpose }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ring-1 shadow-xs',
                      getStatusColor(app.status),
                    ]"
                  >
                    {{ app.status.replace("_", " ") }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-slate-400 font-medium">
                  {{ formatDate(app.createdAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    class="text-primary-600 hover:bg-primary-50 px-3 font-bold"
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
            v-for="app in applications"
            :key="`mob-app-${app.id}`"
            class="p-4 hover:bg-slate-50 flex flex-col gap-3"
            :class="{ 'opacity-50': loading }"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="font-bold text-slate-800">
                  {{ app.applicantName }}
                </div>
                <div class="text-[10px] text-slate-500 font-mono uppercase">
                  {{ app.id.slice(0, 8) }}
                </div>
              </div>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                  getStatusColor(app.status),
                ]"
              >
                {{ app.status.replace("_", " ") }}
              </span>
            </div>
            <div class="flex justify-between items-center mt-1">
              <div class="text-sm font-bold text-slate-800">
                {{ formatCurrency(app.requestedAmount) }}
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
