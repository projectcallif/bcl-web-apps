<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useCustomersStore } from "./store";
import dayjs from "dayjs";
import {
  AppTextInput,
  AppPagination,
  BaseButton,
  AppSelect,
  AppConfirmDialog,
  AppPopover,
  AppDialog,
  AppDatePicker,
} from "@bcl/ui";
import {
  Filter,
  MoreVertical,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-vue-next";
import type { UserStatus, CustomerListItem } from "@bcl/types";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const currentPage = ref(1);
const dateRange = ref<Date[] | null>(null);
const customersStore = useCustomersStore();

let searchTimeout: any;

onMounted(() => {
  customersStore.fetchCustomers(currentPage.value, 10, searchQuery.value);
});

watch([currentPage, searchQuery, dateRange], ([newPage, newQuery]) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // Note: Store fetch call can be expanded here once backend filter is ready
    customersStore.fetchCustomers(
      newPage === currentPage.value ? newPage : 1,
      10,
      newQuery as string,
    );
  }, 500);
});

function getStatusColor(status: UserStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "DEACTIVATED":
      return "bg-slate-100 text-slate-700";
    case "SUSPENDED":
      return "bg-rose-100 text-rose-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Deactivated", value: "DEACTIVATED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const pendingStatusChange = ref<{
  user: CustomerListItem;
  newStatus: UserStatus;
} | null>(null);
const isConfirmOpen = ref(false);

function promptStatusChange(
  user: CustomerListItem,
  newStatus: string | number,
) {
  if (user.status === newStatus) return; // Ignore if unchanged somehow
  pendingStatusChange.value = { user, newStatus: newStatus as UserStatus };
  isConfirmOpen.value = true;
}

async function confirmStatusChange() {
  if (pendingStatusChange.value) {
    const targetUser = customersStore.customers.find(
      (u) => u.id === pendingStatusChange.value!.user.id,
    );
    if (targetUser) {
      await customersStore.updateCustomerStatus(
        pendingStatusChange.value.user.id,
        pendingStatusChange.value.newStatus,
      );
    }
  }
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

function cancelStatusChange() {
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

const targetUserForStatus = ref<CustomerListItem | null>(null);
const targetStatusSelection = ref<UserStatus | "">("");
const isStatusModalOpen = ref(false);

function openStatusDialog(user: CustomerListItem) {
  targetUserForStatus.value = user;
  targetStatusSelection.value = user.status;
  isStatusModalOpen.value = true;
}

function continueToStatusConfirm() {
  if (targetUserForStatus.value && targetStatusSelection.value) {
    isStatusModalOpen.value = false;
    promptStatusChange(targetUserForStatus.value, targetStatusSelection.value);
  }
}

const pendingDeleteUser = ref<CustomerListItem | null>(null);
const isDeleteConfirmOpen = ref(false);

function promptDeleteUser(user: CustomerListItem) {
  pendingDeleteUser.value = user;
  isDeleteConfirmOpen.value = true;
}

function confirmDeleteUser() {
  if (pendingDeleteUser.value) {
    customersStore.customers = customersStore.customers.filter(
      (u) => u.id !== pendingDeleteUser.value!.id,
    );
  }
  isDeleteConfirmOpen.value = false;
  pendingDeleteUser.value = null;
}

function cancelDeleteUser() {
  isDeleteConfirmOpen.value = false;
  pendingDeleteUser.value = null;
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
          Customers Management
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          View, search, and manage platform customers.
        </p>
      </div>
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
            placeholder="Search customers by name or email..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-auto flex items-center justify-end gap-3">
          <AppDatePicker
            v-model="dateRange"
            range
            placeholder="Registration date"
            class="w-full sm:w-64"
          />
          <BaseButton variant="ghost" class="bg-white border border-slate-200">
            <span class="flex items-center gap-2 text-slate-600"
              ><Filter class="w-4 h-4" /> Filters</span
            >
          </BaseButton>
        </div>
      </div>

      <!-- Desktop Table (hidden on mobile) -->
      <div class="hidden md:block w-full overflow-x-auto relative min-h-100">
        <!-- Loading Overlay -->
        <div
          v-if="customersStore.loading && customersStore.customers.length"
          class="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300"
        >
          <div class="flex flex-col items-center gap-2">
            <div
              class="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <p class="text-xs font-medium text-slate-500">Updating list...</p>
          </div>
        </div>

        <table
          class="w-full text-left text-sm text-slate-600 border-collapse min-w-200"
        >
          <thead
            class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100"
          >
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">Customer</th>
              <th scope="col" class="px-6 py-4 font-medium">Status</th>
              <th scope="col" class="px-6 py-4 font-medium">
                Registration Stage
              </th>
              <th scope="col" class="px-6 py-4 font-medium">Joined</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-if="customersStore.loading && !customersStore.customers.length"
            >
              <td colspan="5" class="px-6 py-10 text-center">
                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                  <p class="text-sm text-slate-500">Loading customers...</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="user in customersStore.customers"
              :key="user.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs ring-1 ring-primary-100 shrink-0"
                  >
                    {{ user.firstName?.[0] || "?"
                    }}{{ user.lastName?.[0] || "?" }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="text-xs text-slate-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
                    getStatusColor(user.status),
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase"
                >
                  {{ user.registrationStep.replace(/_/g, " ") }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500">
                {{ dayjs(user.createdAt).format("MMM DD, YYYY") }}
              </td>
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
                            name: 'customer-detail',
                            params: { id: user.id },
                          });
                          close();
                        "
                        class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <User class="w-4 h-4 text-slate-400" /> View Customer
                        Details
                      </button>
                      <button
                        @click="
                          openStatusDialog(user);
                          close();
                        "
                        class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <ShieldAlert class="w-4 h-4 text-slate-400" />
                        Update Status
                      </button>
                      <button
                        @click="
                          promptDeleteUser(user);
                          close();
                        "
                        class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-2 mt-1"
                      >
                        <Trash2 class="w-4 h-4 text-rose-500" />
                        Delete Customer
                      </button>
                    </template>
                  </AppPopover>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards (hidden on desktop) -->
      <div
        class="md:hidden flex flex-col divide-y divide-slate-100 relative min-h-75"
      >
        <!-- Loading Overlay for Mobile -->
        <div
          v-if="customersStore.loading && customersStore.customers.length"
          class="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300"
        >
          <div
            class="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <div
          v-if="customersStore.loading && !customersStore.customers.length"
          class="p-8 text-center text-slate-500"
        >
          Loading...
        </div>
        <div
          v-else
          v-for="user in customersStore.customers"
          :key="`mobile-${user.id}`"
          class="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-sm ring-1 ring-primary-100 shrink-0"
              >
                {{ user.firstName?.[0] || "?" }}{{ user.lastName?.[0] || "?" }}
              </div>
              <div>
                <div class="font-medium text-slate-800">
                  {{ user.firstName }} {{ user.lastName }}
                </div>
                <div class="text-xs text-slate-500">{{ user.email }}</div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'px-2 py-0.5 rounded text-xs font-semibold capitalize',
                  getStatusColor(user.status),
                ]"
              >
                {{ user.status }}
              </span>
              <span
                class="text-[10px] font-mono font-bold text-slate-400 uppercase ml-2"
              >
                • {{ user.registrationStep.replace(/_/g, " ") }}
              </span>
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
                        name: 'customer-detail',
                        params: { id: user.id },
                      });
                      close();
                    "
                    class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <User class="w-4 h-4 text-slate-400" /> View Details
                  </button>
                  <button
                    @click="
                      openStatusDialog(user);
                      close();
                    "
                    class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <ShieldAlert class="w-4 h-4 text-slate-400" />
                    Update Status
                  </button>
                  <button
                    @click="
                      promptDeleteUser(user);
                      close();
                    "
                    class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-2 mt-1"
                  >
                    <Trash2 class="w-4 h-4 text-rose-500" />
                    Delete Customer
                  </button>
                </template>
              </AppPopover>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        class="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="customersStore.meta.totalPages"
          :total-items="customersStore.meta.total"
          :page-size="customersStore.meta.limit"
        />
      </div>
    </div>

    <AppDialog v-model="isStatusModalOpen" title="Update Status" max-width="sm">
      <div v-if="targetUserForStatus" class="space-y-4">
        <p class="text-sm text-slate-600">
          Select a new status for
          <span class="font-medium text-slate-800"
            >{{ targetUserForStatus.firstName }}
            {{ targetUserForStatus.lastName }}</span
          >.
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
      :message="`Are you sure you want to change the status of ${pendingStatusChange?.user.firstName} ${pendingStatusChange?.user.lastName} to ${pendingStatusChange?.newStatus}?`"
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
      :message="`Are you sure you want to permanently delete customer ${pendingDeleteUser?.firstName} ${pendingDeleteUser?.lastName}? This action cannot be undone.`"
      confirm-text="Yes, Delete"
      confirm-variant="danger"
      @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser"
    />
  </div>
</template>
