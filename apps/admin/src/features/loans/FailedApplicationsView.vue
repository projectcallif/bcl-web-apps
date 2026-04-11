<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AppTextInput, AppPagination, BaseButton, AppPopover } from "@bcl/ui";
import {
  Filter,
  Search,
  XCircle,
  AlertTriangle,
  Eye,
  MoreVertical,
} from "lucide-vue-next";
import type { LoanApplication } from "@bcl/types";

const router = useRouter();

const searchQuery = ref("");
const currentPage = ref(1);
const activeTab = ref<"ALL" | "AUTO" | "MANUAL">("ALL");

// Mock Data
type AugmentedFailedApp = LoanApplication & {
  customerName: string;
  email: string;
  failureType: "AUTO" | "MANUAL";
};

const applications = ref<AugmentedFailedApp[]>([
  {
    id: "app_98221",
    userId: "usr_55",
    customerName: "John Doe",
    email: "john.doe@example.com",
    amountRequested: 50000,
    tenorMonths: 3,
    purpose: "Emergency Medical",
    status: "REJECTED",
    appliedAt: "Oct 24, 2026",
    failureType: "AUTO",
    rejectionReason: "DEBT_TO_INCOME_RATIO_EXCEEDED",
  },
  {
    id: "app_98104",
    userId: "usr_992",
    customerName: "Mary Jenkins",
    email: "mary.j@provider.com",
    amountRequested: 120000,
    tenorMonths: 6,
    purpose: "Business Stock",
    status: "REJECTED",
    appliedAt: "Oct 23, 2026",
    failureType: "MANUAL",
    rejectionReason:
      "Inconsistent employment evidence provided during manual review.",
  },
  {
    id: "app_97992",
    userId: "usr_102",
    customerName: "Ahmed Musa",
    email: "ahmed.musa@corp.ng",
    amountRequested: 300000,
    tenorMonths: 12,
    purpose: "Furniture Purchase",
    status: "REJECTED",
    appliedAt: "Oct 22, 2026",
    failureType: "AUTO",
    rejectionReason:
      "BVN_IDENTITY_MISMATCH - Verified source records differ from input.",
  },
]);

const filteredApps = computed(() => {
  let result = applications.value;

  if (activeTab.value !== "ALL") {
    result = result.filter((a) => a.failureType === activeTab.value);
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

function getFailureStyle(type: string) {
  return type === "AUTO"
    ? "bg-rose-100 text-rose-700"
    : "bg-amber-100 text-amber-700";
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
        <h1
          class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2"
        >
          <XCircle class="w-6 h-6 text-rose-500" />
          Failed Applications
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Review auto-rejected and manually rejected loans for decision
          improvement.
        </p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
      <button
        v-for="tab in [
          { value: 'ALL', label: 'All Failures' },
          { value: 'AUTO', label: 'Auto-Rejected' },
          { value: 'MANUAL', label: 'Manually Rejected' },
        ]"
        :key="tab.value"
        @click="activeTab = tab.value as any"
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
            placeholder="Search by ID, name or email..."
            type="text"
          >
            <template #prefix>
              <Search class="w-4 h-4 text-slate-400" />
            </template>
          </AppTextInput>
        </div>
        <div class="w-full sm:w-auto flex items-center justify-end gap-2">
          <BaseButton variant="ghost" class="bg-white border border-slate-200">
            <span class="flex items-center gap-2 text-slate-600">
              <Filter class="w-4 h-4" /> Filters
            </span>
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
              <th scope="col" class="px-6 py-4 font-medium">Failure Reason</th>
              <th scope="col" class="px-6 py-4 font-medium">Date</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredApps.length === 0">
              <td
                colspan="5"
                class="px-6 py-12 text-center text-slate-400 italic font-medium"
              >
                No failed applications found matching your criteria.
              </td>
            </tr>
            <tr
              v-for="app in filteredApps"
              :key="app.id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <!-- Applicant -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-slate-200"
                  >
                    {{ app.customerName[0] }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">
                      {{ app.customerName }}
                    </div>
                    <div class="text-[10px] text-slate-500 font-mono mt-0.5">
                      {{ app.email }}
                    </div>
                  </div>
                </div>
              </td>
              <!-- Amount & Tenor -->
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-800">
                  {{ formatCurrency(app.amountRequested) }}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ app.tenorMonths }} Months · {{ app.purpose }}
                </div>
              </td>
              <!-- Failure Reason -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-2 max-w-xs">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight w-fit',
                      getFailureStyle(app.failureType),
                    ]"
                  >
                    {{ app.failureType }} REJECTION
                  </span>
                  <div
                    class="flex items-start gap-1.5 text-rose-600 bg-rose-50/50 p-1.5 rounded border border-rose-100/50"
                  >
                    <AlertTriangle class="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span class="leading-tight text-[11px] font-medium">{{
                      app.rejectionReason
                    }}</span>
                  </div>
                </div>
              </td>
              <!-- Date -->
              <td class="px-6 py-4 text-slate-500 text-xs">
                {{ app.appliedAt }}
              </td>
              <!-- Actions -->
              <td class="px-6 py-4 text-right">
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
                            name: 'loan-underwriting',
                            params: { id: app.id },
                          });
                          close();
                        "
                        class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <Eye class="w-4 h-4 text-slate-400" /> View Detailed
                        Review
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
        <div
          v-if="filteredApps.length === 0"
          class="p-8 text-center text-slate-500"
        >
          No failed applications found.
        </div>
        <div
          v-for="app in filteredApps"
          :key="`mobile-${app.id}`"
          class="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 ring-1 ring-slate-200"
              >
                {{ app.customerName[0] }}
              </div>
              <div>
                <div class="font-medium text-slate-800">
                  {{ app.customerName }}
                </div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">
                  {{ app.email }}
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
                        name: 'loan-underwriting',
                        params: { id: app.id },
                      });
                      close();
                    "
                    class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <Eye class="w-4 h-4 text-slate-400" /> View Review
                  </button>
                </template>
              </AppPopover>
            </div>
          </div>

          <div>
            <div class="font-medium text-slate-800">
              {{ formatCurrency(app.amountRequested) }}
            </div>
            <div class="text-xs text-slate-500 mt-0.5">
              {{ app.tenorMonths }} Months · {{ app.purpose }}
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight w-fit',
                getFailureStyle(app.failureType),
              ]"
            >
              {{ app.failureType }} REJECTION
            </span>
            <div
              class="text-xs flex items-start gap-1 text-rose-600 bg-rose-50 p-2 rounded border border-rose-100"
            >
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span class="leading-tight">{{ app.rejectionReason }}</span>
            </div>
            <span
              class="text-[10px] text-slate-400 font-bold uppercase tracking-widest"
              >{{ app.appliedAt }}</span
            >
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
