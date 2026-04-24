<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAdminsStore } from "./store";
import { useToastStore } from "@/stores/toast";
import dayjs from "dayjs";
import {
  AppTextInput,
  AppPagination,
  BaseButton,
  AppSelect,
  AppConfirmDialog,
  AppPopover,
  AppDialog,
  AppPasswordInput,
  AppDatePicker,
} from "@bcl/ui";
import {
  Filter,
  MoreVertical,
  ShieldAlert,
  ArrowRightLeft,
} from "lucide-vue-next";
import type {
  UserStatus,
  UserRole,
  Admin,
  CreateAdminPayload,
} from "@bcl/types";
import AdminSkeleton from "./components/AdminSkeleton.vue";

const searchQuery = ref("");
const dateRange = ref<Date[] | null>(null);
const currentPage = ref(1);

const adminsStore = useAdminsStore();
const toast = useToastStore();

onMounted(() => {
  adminsStore.fetchAdmins();
});

const filteredAdmins = computed(() => {
  let result = adminsStore.admins;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (a) =>
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q),
    );
  }

  if (dateRange.value && dateRange.value[0]) {
    const start = new Date(dateRange.value[0]).getTime();
    result = result.filter((a) => new Date(a.createdAt).getTime() >= start);
  }

  if (dateRange.value && dateRange.value[1]) {
    const end = new Date(dateRange.value[1]).getTime() + 86400000;
    result = result.filter((a) => new Date(a.createdAt).getTime() < end);
  }

  return result;
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

// CREATE ADMIN
const isAddAdminModalOpen = ref(false);
const newAdmin = ref<CreateAdminPayload>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "ADMIN",
});
const adminRoleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Loan Underwriter", value: "LOAN_UNDERWRITER" },
  { label: "Finance Officer", value: "FINANCE_OFFICER" },
  { label: "Collections Officer", value: "COLLECTIONS_OFFICER" },
  { label: "Support Agent", value: "SUPPORT_AGENT" },
];

function formatRole(role: UserRole) {
  if (role === "SUPER_ADMIN") return "Super Admin";
  if (role === "LOAN_UNDERWRITER") return "Loan Underwriter";
  if (role === "FINANCE_OFFICER") return "Finance Officer";
  if (role === "COLLECTIONS_OFFICER") return "Collections Officer";
  if (role === "SUPPORT_AGENT") return "Support Agent";
  return "Admin";
}

const isSubmitting = ref(false);

async function submitNewAdmin() {
  if (
    !newAdmin.value.email ||
    !newAdmin.value.firstName ||
    !newAdmin.value.lastName ||
    !newAdmin.value.password
  )
    return;

  try {
    isSubmitting.value = true;
    await adminsStore.createAdmin(newAdmin.value);
    toast.success("Administrator created successfully!");
    isAddAdminModalOpen.value = false;
    // Reset
    newAdmin.value = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "ADMIN",
    };
  } catch (e: unknown) {
    toast.error(
      e instanceof Error ? e.message : "Failed to create administrator",
    );
  } finally {
    isSubmitting.value = false;
  }
}

// STATUS
const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Deactivated", value: "DEACTIVATED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const targetUserForStatus = ref<Admin | null>(null);
const targetStatusSelection = ref<UserStatus | "">("");
const isStatusModalOpen = ref(false);

function openStatusDialog(user: Admin) {
  targetUserForStatus.value = user;
  targetStatusSelection.value = user.status;
  isStatusModalOpen.value = true;
}

const pendingStatusChange = ref<{
  user: Admin;
  newStatus: UserStatus;
} | null>(null);
const isConfirmOpen = ref(false);

function continueToStatusConfirm() {
  if (targetUserForStatus.value && targetStatusSelection.value) {
    if (targetUserForStatus.value.status === targetStatusSelection.value) {
      isStatusModalOpen.value = false;
      return;
    }
    pendingStatusChange.value = {
      user: targetUserForStatus.value,
      newStatus: targetStatusSelection.value as UserStatus,
    };
    isStatusModalOpen.value = false;
    isConfirmOpen.value = true;
  }
}

async function confirmStatusChange() {
  if (pendingStatusChange.value) {
    try {
      await adminsStore.updateStatus(
        pendingStatusChange.value.user.id,
        pendingStatusChange.value.newStatus,
      );
      toast.success("Administrator status updated!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  }
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

function cancelStatusChange() {
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

// ROLE CHANGE
const targetUserForRole = ref<Admin | null>(null);
const targetRoleSelection = ref<UserRole | "">("");
const isRoleModalOpen = ref(false);

function openRoleDialog(user: Admin) {
  targetUserForRole.value = user;
  targetRoleSelection.value = user.role;
  isRoleModalOpen.value = true;
}

const pendingRoleChange = ref<{
  user: Admin;
  newRole: UserRole;
} | null>(null);
const isRoleConfirmOpen = ref(false);

function continueToRoleConfirm() {
  if (targetUserForRole.value && targetRoleSelection.value) {
    if (targetUserForRole.value.role === targetRoleSelection.value) {
      isRoleModalOpen.value = false;
      return;
    }
    pendingRoleChange.value = {
      user: targetUserForRole.value,
      newRole: targetRoleSelection.value as UserRole,
    };
    isRoleModalOpen.value = false;
    isRoleConfirmOpen.value = true;
  }
}

async function confirmRoleChange() {
  if (pendingRoleChange.value) {
    const target = adminsStore.admins.find(
      (u) => u.id === pendingRoleChange.value!.user.id,
    );
    if (target) {
      target.role = pendingRoleChange.value.newRole;
    }
  }
  isRoleConfirmOpen.value = false;
  pendingRoleChange.value = null;
}

function cancelRoleChange() {
  isRoleConfirmOpen.value = false;
  pendingRoleChange.value = null;
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
          Administrators
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Manage system access, roles, and privileges.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton variant="primary" @click="isAddAdminModalOpen = true"
          >Create Admin</BaseButton
        >
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
            placeholder="Search admins by name or email..."
            type="text"
          />
        </div>
        <div class="w-full sm:w-auto flex items-center justify-end gap-3">
          <AppDatePicker
            v-model="dateRange"
            range
            placeholder="Date added"
            class="w-full sm:w-64"
          />
          <BaseButton variant="ghost" class="bg-white border border-slate-200">
            <span class="flex items-center gap-2 text-slate-600"
              ><Filter class="w-4 h-4" /> Filters</span
            >
          </BaseButton>
        </div>
      </div>

      <AdminSkeleton v-if="adminsStore.loading && !adminsStore.admins.length" />

      <template v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block w-full overflow-x-auto">
          <table
            class="w-full text-left text-sm text-slate-600 border-collapse min-w-200"
          >
            <thead
              class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100"
            >
              <tr>
                <th scope="col" class="px-6 py-4 font-medium">Administrator</th>
                <th scope="col" class="px-6 py-4 font-medium">Role</th>
                <th scope="col" class="px-6 py-4 font-medium">Status</th>
                <th scope="col" class="px-6 py-4 font-medium">Added</th>
                <th scope="col" class="px-6 py-4 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredAdmins.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                  No administrators found.
                </td>
              </tr>
              <tr
                v-for="user in filteredAdmins"
                :key="user.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0"
                    >
                      {{ user.firstName[0] }}{{ user.lastName[0] }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-800">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-xs text-slate-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 font-medium text-slate-700">
                  {{ formatRole(user.role) }}
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
                            openRoleDialog(user);
                            close();
                          "
                          class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                        >
                          <ArrowRightLeft class="w-4 h-4 text-slate-400" />
                          Change Role
                        </button>
                      </template>
                    </AppPopover>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden flex flex-col divide-y divide-slate-100">
          <div
            v-for="user in filteredAdmins"
            :key="`mobile-${user.id}`"
            class="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0"
                >
                  {{ user.firstName[0] }}{{ user.lastName[0] }}
                </div>
                <div>
                  <div class="font-medium text-slate-800">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="text-xs text-slate-500">{{ user.email }}</div>
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
                        openStatusDialog(user);
                        close();
                      "
                      class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      <ShieldAlert class="w-4 h-4 text-slate-400" />
                      Update Status
                    </button>
                  </template>
                </AppPopover>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded"
                >{{ formatRole(user.role) }}</span
              >
              <span
                :class="[
                  'px-2 py-0.5 rounded text-xs font-semibold capitalize',
                  getStatusColor(user.status),
                ]"
              >
                {{ user.status }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- Pagination -->
      <div
        class="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="1"
          :total-items="adminsStore.admins.length"
          :page-size="10"
        />
      </div>
    </div>

    <!-- Create Admin Modal -->
    <AppDialog
      v-model="isAddAdminModalOpen"
      title="Create New Admin"
      max-width="md"
    >
      <form @submit.prevent="submitNewAdmin" class="flex flex-col gap-5">
        <AppSelect
          label="Role"
          id="role"
          v-model="newAdmin.role"
          :options="adminRoleOptions"
          required
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppTextInput
            label="First Name"
            id="firstName"
            v-model="newAdmin.firstName"
            placeholder="First Name"
            type="text"
            required
          />
          <AppTextInput
            label="Last Name"
            id="lastName"
            v-model="newAdmin.lastName"
            placeholder="Last Name"
            type="text"
            required
          />
        </div>

        <AppTextInput
          label="Email Address"
          id="email"
          v-model="newAdmin.email"
          placeholder="Email Address"
          type="email"
          required
        />

        <AppPasswordInput
          id="password"
          v-model="newAdmin.password"
          label="Password"
          placeholder="Set a secure password"
          required
        />

        <div class="flex justify-end gap-3 mt-4">
          <BaseButton
            type="button"
            variant="ghost"
            class="bg-white border border-slate-200"
            @click="isAddAdminModalOpen = false"
          >
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSubmitting">
            Create Admin
          </BaseButton>
        </div>
      </form>
    </AppDialog>

    <!-- Dialogs -->
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

    <!-- Role Modal -->
    <AppDialog
      v-model="isRoleModalOpen"
      title="Update Admin Role"
      max-width="sm"
    >
      <div v-if="targetUserForRole" class="space-y-4">
        <p class="text-sm text-slate-600">
          Select a new role for
          <span class="font-medium text-slate-800"
            >{{ targetUserForRole.firstName }}
            {{ targetUserForRole.lastName }}</span
          >.
        </p>
        <AppSelect
          v-model="targetRoleSelection"
          :options="adminRoleOptions"
          class="w-full"
        />
      </div>
      <template #footer>
        <BaseButton
          variant="ghost"
          class="bg-white border border-slate-200"
          @click="isRoleModalOpen = false"
        >
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="continueToRoleConfirm">
          Continue
        </BaseButton>
      </template>
    </AppDialog>

    <AppConfirmDialog
      v-model="isRoleConfirmOpen"
      title="Confirm Role Change"
      :message="`Are you sure you want to change the role of ${pendingRoleChange?.user.firstName} ${pendingRoleChange?.user.lastName} to ${formatRole(pendingRoleChange?.newRole as any)}?`"
      confirm-text="Change Role"
      confirm-variant="primary"
      @confirm="confirmRoleChange"
      @cancel="cancelRoleChange"
    />

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
  </div>
</template>
