<script setup lang="ts">
import { ref } from "vue";
import {
  AppTextInput,
  AppPagination,
  BaseButton,
  AppSelect,
  AppConfirmDialog,
  AppPopover,
  AppDialog,
} from "@bcl/ui";
import { Filter, MoreVertical, ShieldAlert, Trash2 } from "lucide-vue-next";
import type { UserStatus, UserRole } from "@bcl/types";

const searchQuery = ref("");
const currentPage = ref(1);

type MockAdmin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  date: string;
};

const mockAdmins = ref<MockAdmin[]>([
  {
    id: "adm_1",
    firstName: "Sarah",
    lastName: "Connor",
    email: "sarah@bcl.com",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    date: "Oct 24, 2026",
  },
  {
    id: "adm_2",
    firstName: "Alice",
    lastName: "Wong",
    email: "alice@bcl.com",
    role: "ADMIN",
    status: "ACTIVE",
    date: "Oct 23, 2026",
  },
]);

function getStatusColor(status: UserStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "INACTIVE":
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
const newAdmin = ref({
  firstName: "",
  lastName: "",
  email: "",
  role: "ADMIN" as UserRole,
});
const adminRoleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

function submitNewAdmin() {
  mockAdmins.value.unshift({
    id: "adm_" + Math.random().toString(36).substr(2, 6),
    firstName: newAdmin.value.firstName,
    lastName: newAdmin.value.lastName,
    email: newAdmin.value.email,
    role: newAdmin.value.role,
    status: "PENDING",
    date: "Just now",
  });
  isAddAdminModalOpen.value = false;
  // Reset
  newAdmin.value = {
    firstName: "",
    lastName: "",
    email: "",
    role: "ADMIN",
  };
}

// STATUS
const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Pending", value: "PENDING" },
];

const targetUserForStatus = ref<MockAdmin | null>(null);
const targetStatusSelection = ref<UserStatus | "">("");
const isStatusModalOpen = ref(false);

function openStatusDialog(user: MockAdmin) {
  targetUserForStatus.value = user;
  targetStatusSelection.value = user.status;
  isStatusModalOpen.value = true;
}

const pendingStatusChange = ref<{
  user: MockAdmin;
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

function confirmStatusChange() {
  if (pendingStatusChange.value) {
    const target = mockAdmins.value.find(
      (u) => u.id === pendingStatusChange.value!.user.id,
    );
    if (target) {
      target.status = pendingStatusChange.value.newStatus;
    }
  }
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

function cancelStatusChange() {
  isConfirmOpen.value = false;
  pendingStatusChange.value = null;
}

// DELETE
const pendingDeleteUser = ref<MockAdmin | null>(null);
const isDeleteConfirmOpen = ref(false);

function promptDeleteUser(user: MockAdmin) {
  pendingDeleteUser.value = user;
  isDeleteConfirmOpen.value = true;
}

function confirmDeleteUser() {
  if (pendingDeleteUser.value) {
    mockAdmins.value = mockAdmins.value.filter(
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
            <tr
              v-for="user in mockAdmins"
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
                {{ user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin" }}
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
              <td class="px-6 py-4 text-slate-500">{{ user.date }}</td>
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
                          promptDeleteUser(user);
                          close();
                        "
                        class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-2 mt-1"
                      >
                        <Trash2 class="w-4 h-4 text-rose-500" />
                        Delete Admin
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
          v-for="user in mockAdmins"
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
                  <button
                    @click="
                      promptDeleteUser(user);
                      close();
                    "
                    class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium flex items-center gap-2 mt-1"
                  >
                    <Trash2 class="w-4 h-4 text-rose-500" />
                    Delete Admin
                  </button>
                </template>
              </AppPopover>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded"
              >{{ user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin" }}</span
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

      <!-- Pagination -->
      <div
        class="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="1"
          :total-items="2"
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
          id="role"
          v-model="newAdmin.role"
          :options="adminRoleOptions"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppTextInput
            id="firstName"
            v-model="newAdmin.firstName"
            placeholder="First Name"
            type="text"
            required
          />
          <AppTextInput
            id="lastName"
            v-model="newAdmin.lastName"
            placeholder="Last Name"
            type="text"
            required
          />
        </div>

        <AppTextInput
          id="email"
          v-model="newAdmin.email"
          placeholder="Email Address"
          type="email"
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
          <BaseButton type="submit" variant="primary">
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

    <AppConfirmDialog
      v-model="isConfirmOpen"
      title="Confirm Status Change"
      :message="`Are you sure you want to change the status of ${pendingStatusChange?.user.firstName} ${pendingStatusChange?.user.lastName} to ${pendingStatusChange?.newStatus}?`"
      confirm-text="Change Status"
      :confirm-variant="
        pendingStatusChange?.newStatus === 'SUSPENDED' ||
        pendingStatusChange?.newStatus === 'INACTIVE'
          ? 'danger'
          : 'primary'
      "
      @confirm="confirmStatusChange"
      @cancel="cancelStatusChange"
    />

    <AppConfirmDialog
      v-model="isDeleteConfirmOpen"
      title="Delete Administrator"
      :message="`Are you sure you want to permanently delete administrator ${pendingDeleteUser?.firstName} ${pendingDeleteUser?.lastName}? This action cannot be undone.`"
      confirm-text="Yes, Delete"
      confirm-variant="danger"
      @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser"
    />
  </div>
</template>
