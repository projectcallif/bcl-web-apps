<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import {
  BaseButton,
  AppPagination,
  AppSelect,
  AppConfirmDialog,
  AppDialog,
} from "@bcl/ui";
import {
  ChevronLeft,
  User,
  Briefcase,
  MapPin,
  Building2,
  ChevronRight,
  ShieldAlert,
  ArrowRightLeft,
  Trash2,
  Calendar,
  Mail,
  Phone,
} from "lucide-vue-next";
import type { UserStatus } from "@bcl/types";
import { useCustomersStore } from "./store";
import { useToastStore } from "@/stores/toast";

// Store & Route
const router = useRouter();
const route = useRoute();
const customersStore = useCustomersStore();
const toast = useToastStore();

const customerId = route.params.id as string;

// Computed Customer Data
const customer = computed(() => customersStore.currentCustomer);

// Lifecycle
onMounted(async () => {
  if (customerId) {
    await customersStore.fetchCustomerById(customerId);
    if (customersStore.error) {
      toast.error(customersStore.error);
    }
  }
});

// Tabs State
const activeTab = ref<"info" | "loans" | "transactions">("info");
const activeInfoSubTab = ref<"personal" | "employment" | "address" | "bank">(
  "personal",
);

// Pagination State
const loansPage = ref(1);
const transactionsPage = ref(1);

const tabs = [
  { id: "info", label: "Customer Info" },
  { id: "loans", label: "Loans history" },
  { id: "transactions", label: "Transactions" },
] as const;

const subs = [
  { id: "personal", label: "Personal", icon: User },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "address", label: "Address", icon: MapPin },
  { id: "bank", label: "Bank", icon: Building2 },
] as const;

const loans = [
  {
    id: "L-9022",
    amount: 250000,
    tenor: "6 Months",
    status: "ACTIVE",
    date: "Apr 10, 2026",
  },
  {
    id: "L-8812",
    amount: 100000,
    tenor: "3 Months",
    status: "COMPLETED",
    date: "Jan 15, 2026",
  },
];

const transactions = [
  {
    id: "T-88221",
    type: "REPAYMENT",
    amount: 45000,
    method: "AUTO-DEBIT",
    date: "Apr 12, 2026 14:00",
  },
  {
    id: "T-88104",
    type: "DISBURSEMENT",
    amount: 250000,
    method: "BANK-TRANSFER",
    date: "Apr 10, 2026 09:30",
  },
  {
    id: "T-87992",
    type: "REPAYMENT",
    amount: 45000,
    method: "AUTO-DEBIT",
    date: "Mar 12, 2026 14:00",
  },
];

// --- Status & Delete Logic (Synced with CustomersView) ---

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Deactivated", value: "DEACTIVATED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const pendingStatusChange = ref<{
  newStatus: UserStatus;
} | null>(null);
const isConfirmOpen = ref(false);

function promptStatusChange(newStatus: string | number) {
  if (!customer.value || customer.value.status === newStatus) return;
  pendingStatusChange.value = { newStatus: newStatus as UserStatus };
  isConfirmOpen.value = true;
}

async function confirmStatusChange() {
  if (pendingStatusChange.value && customer.value) {
    await customersStore.updateCustomerStatus(
      customerId,
      pendingStatusChange.value.newStatus,
    );
  }
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

function cancelStatusChange() {
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

const targetStatusSelection = ref<UserStatus | "">("");
const isStatusModalOpen = ref(false);

function openStatusDialog() {
  if (customer.value) {
    targetStatusSelection.value = customer.value.status;
    isStatusModalOpen.value = true;
  }
}

function continueToStatusConfirm() {
  if (targetStatusSelection.value) {
    isStatusModalOpen.value = false;
    promptStatusChange(targetStatusSelection.value);
  }
}

const isDeleteConfirmOpen = ref(false);

function promptDeleteUser() {
  isDeleteConfirmOpen.value = true;
}

function confirmDeleteUser() {
  // Navigation back to list after delete simulation
  isDeleteConfirmOpen.value = false;
  toast.success("Customer deleted successfully");
  router.push({ name: "customers" });
}

function cancelDeleteUser() {
  isDeleteConfirmOpen.value = false;
}

// Helpers
function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(date: string | null | undefined) {
  if (!date) return "N/A";
  return dayjs(date).format("MMM D, YYYY");
}

function formatStep(step: string | null | undefined) {
  if (!step) return "N/A";
  return step.replace(/_/g, " ");
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Customer ID copied to clipboard");
  } catch (err) {
    toast.error("Failed to copy Customer ID");
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "ACTIVE":
    case "COMPLETE":
    case "VERIFIED":
      return "bg-emerald-100 text-emerald-700 font-bold";
    case "INACTIVE":
    case "DEACTIVATED":
      return "bg-slate-100 text-slate-700";
    case "SUSPENDED":
      return "bg-rose-100 text-rose-700 font-bold";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    case "REPAYMENT":
      return "bg-emerald-50 text-emerald-600";
    case "DISBURSEMENT":
      return "bg-indigo-50 text-indigo-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500">
      <button
        @click="router.push({ name: 'customers' })"
        class="hover:text-primary-600 transition-colors flex items-center gap-1"
      >
        <ChevronLeft class="w-4 h-4" />
        Customers
      </button>
    </nav>

    <!-- Header -->
    <div
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg md:text-xl font-bold shadow-lg shrink-0 overflow-hidden"
        >
          <template v-if="customer">
            {{ customer.profile.firstName[0] }}
          </template>
          <User v-else class="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 md:gap-3">
            <h1
              class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate max-w-50 sm:max-w-none"
            >
              <template v-if="customer">
                {{ customer.profile.firstName }} {{ customer.profile.lastName }}
              </template>
              <div
                v-else
                class="w-32 h-6 bg-slate-100 animate-pulse rounded"
              ></div>
            </h1>
            <span
              v-if="customer"
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border',
                customer.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-rose-50 text-rose-500 border-rose-100',
              ]"
            >
              {{ customer.status }}
            </span>
            <span
              v-if="customer"
              class="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border bg-slate-50 text-slate-500 border-slate-100"
            >
              {{ formatStep(customer.registrationStep) }}
            </span>
          </div>
          <div
            class="flex items-center gap-2 text-xs md:text-sm text-slate-500 mt-1"
          >
            <span class="font-mono truncate">ID: {{ customerId }}</span>
            <button
              @click="copyToClipboard(customerId)"
              class="hover:text-primary-600 transition-colors shrink-0"
            >
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path
                  d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <BaseButton
          variant="primary"
          @click="openStatusDialog"
          class="flex-1 lg:flex-none justify-center"
        >
          <ShieldAlert class="w-4 h-4 mr-2" /> Update Status
        </BaseButton>
        <BaseButton
          variant="danger"
          @click="promptDeleteUser"
          class="flex-1 lg:flex-none justify-center"
        >
          <Trash2 class="w-4 h-4 mr-2" /> Delete Customer
        </BaseButton>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start"
    >
      <!-- Sidebar Info -->
      <aside class="flex flex-col gap-6 lg:sticky lg:top-6 order-2 lg:order-1">
        <div
          class="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-6"
        >
          <button
            class="w-full flex items-center justify-between text-sm font-bold text-slate-800 tracking-tight group"
          >
            Details
            <ChevronRight
              class="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-transform lg:rotate-90"
            />
          </button>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-4 gap-x-6"
          >
            <div
              v-for="item in [
                {
                  label: 'Email address',
                  value: customer?.email,
                  icon: Mail,
                },
                {
                  label: 'Phone number',
                  value: customer?.phone,
                  icon: Phone,
                },
                {
                  label: 'Registration Date',
                  value: formatDate(customer?.createdAt),
                  icon: Calendar,
                },
                {
                  label: 'Registration Phase',
                  value: formatStep(customer?.registrationStep),
                  icon: ShieldAlert,
                },
              ]"
              :key="item.label"
              class="flex flex-col gap-1"
            >
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <component :is="item.icon" class="w-2.5 h-2.5" />
                {{ item.label }}
              </p>
              <p
                v-if="item.value && item.value !== 'N/A'"
                class="text-sm font-medium text-slate-700 break-all"
              >
                {{ item.value }}
              </p>
              <div
                v-else
                class="w-full h-4 bg-slate-50 animate-pulse rounded"
              ></div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Tabs and Content -->
      <div
        class="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col min-h-125 order-1 lg:order-2 relative overflow-hidden"
      >
        <!-- Loading Overlay -->
        <div
          v-if="customersStore.loading"
          class="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"
        >
          <div
            class="w-8 h-8 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"
          ></div>
        </div>
        <!-- Tabs Nav -->
        <div
          class="px-4 md:px-6 border-b border-slate-100 overflow-x-auto scrollbar-hide"
        >
          <div class="flex items-center gap-6 md:gap-8 h-12">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="relative h-full text-xs md:text-sm font-semibold transition-colors whitespace-nowrap"
              :class="
                activeTab === tab.id
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              "
            >
              {{ tab.label }}
              <div
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"
              ></div>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-4 md:p-6">
          <!-- Customer Info Tab -->
          <div v-if="activeTab === 'info'" class="space-y-6 md:space-y-8">
            <!-- Sub-tabs for Info -->
            <div
              class="flex items-center gap-1 bg-slate-50 p-1 rounded-xl w-full sm:w-fit overflow-x-auto scrollbar-hide"
            >
              <button
                v-for="sub in subs"
                :key="sub.id"
                @click="activeInfoSubTab = sub.id"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                :class="
                  activeInfoSubTab === sub.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                "
              >
                <component :is="sub.icon" class="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>{{ sub.label }}</span>
              </button>
            </div>

            <!-- Info Render -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 md:gap-6 pt-2"
            >
              <template v-if="activeInfoSubTab === 'personal'">
                <div
                  v-for="f in [
                    { label: 'First Name', value: customer?.profile.firstName },
                    { label: 'Last Name', value: customer?.profile.lastName },
                    {
                      label: 'Middle Name',
                      value: customer?.profile.middleName || 'N/A',
                    },
                    { label: 'Gender', value: customer?.profile.gender },
                    {
                      label: 'Date of Birth',
                      value: formatDate(customer?.profile.dateOfBirth),
                    },
                    {
                      label: 'Marital Status',
                      value: customer?.profile.maritalStatus,
                    },
                    { label: 'BVN Status', value: customer?.kyc.bvnStatus },
                    {
                      label: 'NIN Status',
                      value: customer?.kyc.ninStatus || 'Not provided',
                    },
                    { label: 'Tier', value: customer?.kyc.tier },
                  ]"
                  :key="f.label"
                >
                  <p
                    class="text-[10px] md:text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider"
                  >
                    {{ f.label }}
                  </p>
                  <p class="text-sm font-semibold text-slate-700 capitalize">
                    <span v-if="f.value">{{
                      f.value.toLowerCase().replace("_", " ")
                    }}</span>
                    <span v-else class="text-slate-300 italic font-normal"
                      >Not provided</span
                    >
                  </p>
                </div>
              </template>
              <template v-else-if="activeInfoSubTab === 'employment'">
                <div
                  v-for="f in [
                    {
                      label: 'Employer',
                      value: customer?.employment?.employerName,
                    },
                    { label: 'Role', value: customer?.employment?.jobTitle },
                    {
                      label: 'Monthly Income',
                      value: customer?.employment?.monthlyIncome
                        ? formatCurrency(customer.employment.monthlyIncome)
                        : null,
                    },
                    {
                      label: 'Employment Status',
                      value: customer?.employment?.employmentStatus,
                    },
                  ]"
                  :key="f.label"
                  class="col-span-1"
                >
                  <p
                    class="text-[10px] md:text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider"
                  >
                    {{ f.label }}
                  </p>
                  <p class="text-sm font-semibold text-slate-700">
                    <span v-if="f.value">{{ f.value }}</span>
                    <span v-else class="text-slate-300 italic font-normal"
                      >Information not available</span
                    >
                  </p>
                </div>
              </template>
              <template v-else-if="activeInfoSubTab === 'address'">
                <div
                  v-for="f in [
                    {
                      label: 'Street',
                      value: customer?.profile.residentialAddress,
                    },
                    { label: 'City', value: customer?.profile.city },
                    { label: 'LGA', value: customer?.profile.lga },
                    { label: 'State', value: customer?.profile.state },
                    { label: 'Country', value: customer?.profile.country },
                  ]"
                  :key="f.label"
                >
                  <p
                    class="text-[10px] md:text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider"
                  >
                    {{ f.label }}
                  </p>
                  <p class="text-sm font-semibold text-slate-700">
                    <span v-if="f.value">{{ f.value }}</span>
                    <span v-else class="text-slate-300 italic font-normal"
                      >Not provided</span
                    >
                  </p>
                </div>
              </template>
              <template v-else-if="activeInfoSubTab === 'bank'">
                <div
                  v-for="f in [
                    {
                      label: 'Bank Name',
                      value: customer?.profile.bank?.bankName,
                    },
                    {
                      label: 'Account Number',
                      value: customer?.profile.bank?.accountNumber,
                    },
                    {
                      label: 'Account Holder',
                      value: customer?.profile.bank?.accountName,
                    },
                    {
                      label: 'Mono ID',
                      value: customer?.profile.monoAccountId,
                    },
                  ]"
                  :key="f.label"
                >
                  <p
                    class="text-[10px] md:text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider"
                  >
                    {{ f.label }}
                  </p>
                  <p class="text-sm font-semibold text-slate-700">
                    <span v-if="f.value">{{ f.value }}</span>
                    <span v-else class="text-slate-300 italic font-normal"
                      >Information not available</span
                    >
                  </p>
                </div>
              </template>
            </div>
          </div>

          <!-- Loans Tab -->
          <div v-if="activeTab === 'loans'" class="space-y-4">
            <div class="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
              <table
                class="w-full text-left text-sm text-slate-600 border-collapse min-w-200"
              >
                <thead class="bg-slate-50/50 text-slate-500 font-medium">
                  <tr>
                    <th scope="col" class="px-4 py-3 font-medium rounded-l-xl">
                      Ref ID
                    </th>
                    <th scope="col" class="px-4 py-3 font-medium">Amount</th>
                    <th scope="col" class="px-4 py-3 font-medium">Tenor</th>
                    <th scope="col" class="px-4 py-3 font-medium">Status</th>
                    <th scope="col" class="px-4 py-3 font-medium rounded-r-xl">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="loan in loans"
                    :key="loan.id"
                    class="hover:bg-slate-50/50 transition-colors"
                  >
                    <td class="px-4 py-4 font-semibold text-slate-800">
                      {{ loan.id }}
                    </td>
                    <td class="px-4 py-4 font-medium text-slate-700">
                      {{ formatCurrency(loan.amount) }}
                    </td>
                    <td class="px-4 py-4 text-slate-500">{{ loan.tenor }}</td>
                    <td class="px-4 py-4">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase ring-1',
                          getStatusStyle(loan.status),
                        ]"
                      >
                        {{ loan.status }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-slate-500">{{ loan.date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="p-2 flex justify-end">
              <AppPagination
                v-model:current-page="loansPage"
                :page-size="10"
                :total-items="loans.length"
                :total-pages="1"
              />
            </div>
          </div>

          <!-- Transactions Tab -->
          <div v-if="activeTab === 'transactions'" class="space-y-4">
            <div class="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
              <table
                class="w-full text-left text-sm text-slate-600 border-collapse min-w-200"
              >
                <thead class="bg-slate-50/50 text-slate-500 font-medium">
                  <tr>
                    <th scope="col" class="px-4 py-3 font-medium rounded-l-xl">
                      Trans ID
                    </th>
                    <th scope="col" class="px-4 py-3 font-medium">Type</th>
                    <th scope="col" class="px-4 py-3 font-medium">Amount</th>
                    <th scope="col" class="px-4 py-3 font-medium">Method</th>
                    <th scope="col" class="px-4 py-3 font-medium rounded-r-xl">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="tx in transactions"
                    :key="tx.id"
                    class="hover:bg-slate-50/50 transition-colors"
                  >
                    <td class="px-4 py-4 font-mono text-xs text-slate-500">
                      {{ tx.id }}
                    </td>
                    <td class="px-4 py-4">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase ring-1',
                          getStatusStyle(tx.type),
                        ]"
                      >
                        {{ tx.type }}
                      </span>
                    </td>
                    <td class="px-4 py-4 font-semibold text-slate-800">
                      {{ formatCurrency(tx.amount) }}
                    </td>
                    <td
                      class="px-4 py-4 flex items-center gap-2 text-slate-600"
                    >
                      <ArrowRightLeft class="w-3.5 h-3.5" />
                      {{ tx.method }}
                    </td>
                    <td class="px-4 py-4 text-slate-500">{{ tx.date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="p-2 flex justify-end">
              <AppPagination
                v-model:current-page="transactionsPage"
                :page-size="10"
                :total-items="transactions.length"
                :total-pages="1"
              />
            </div>
          </div>
        </div>

        <!-- Footer Visual -->
        <div
          v-if="activeTab === 'info'"
          class="mt-auto border-t border-slate-50 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/30 rounded-b-2xl"
        >
          <div
            class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <User class="w-6 h-6 md:w-8 md:h-8 text-slate-200" />
          </div>
          <div>
            <h4 class="text-base md:text-lg font-bold text-slate-800">
              No profile documents yet
            </h4>
            <p class="text-xs md:text-sm text-slate-500">
              Click the button below to learn more
            </p>
          </div>
          <button
            class="text-primary-600 text-xs md:text-sm font-bold flex items-center gap-1.5 hover:underline"
          >
            About KYC Profiles <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <AppDialog v-model="isStatusModalOpen" title="Update Status" max-width="sm">
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          Select a new status for
          <span class="font-medium text-slate-800" v-if="customer">
            {{ customer.profile.firstName }} {{ customer.profile.lastName }}
          </span>
          <span v-else>this customer</span>.
        </p>
        <AppSelect
          v-model="targetStatusSelection"
          :options="statusOptions"
          class="w-full"
        />
      </div>
      <template #footer>
        <BaseButton
          variant="ghost"
          class="bg-white border border-slate-200"
          @click="isStatusModalOpen = false"
        >
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="continueToStatusConfirm">
          Continue
        </BaseButton>
      </template>
    </AppDialog>

    <AppConfirmDialog
      v-model="isConfirmOpen"
      title="Confirm Status Change"
      :message="`Are you sure you want to change the status of ${customer?.profile.firstName} ${customer?.profile.lastName} to ${pendingStatusChange?.newStatus}?`"
      confirm-text="Change Status"
      :confirm-variant="
        pendingStatusChange?.newStatus === 'SUSPENDED' ||
        pendingStatusChange?.newStatus === 'DEACTIVATED'
          ? 'danger'
          : 'primary'
      "
      @confirm="confirmStatusChange"
      @cancel="cancelStatusChange"
    />

    <AppConfirmDialog
      v-model="isDeleteConfirmOpen"
      title="Delete Customer"
      :message="`Are you sure you want to permanently delete customer ${customer?.profile.firstName} ${customer?.profile.lastName}? This action cannot be undone.`"
      confirm-text="Yes, Delete"
      confirm-variant="danger"
      @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser"
    />
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
