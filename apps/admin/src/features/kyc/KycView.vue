<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AppTextInput, AppPagination } from "@bcl/ui";
import { Eye } from "lucide-vue-next";
import type { User } from "@bcl/types";

const router = useRouter();
const searchQuery = ref("");
const currentPage = ref(1);
const activeTab = ref<"PENDING" | "ACTIVE" | "SUSPENDED" | "ALL">("PENDING");

const mockUsers = ref<User[]>([
  {
    id: "usr_8",
    email: "james.k@example.com",
    phone: "+234 810 123 4567",
    isEmailVerified: true,
    isPhoneVerified: true,
    registrationStep: "UTILITY_BILL_COMPLETE",
    status: "PENDING",
    profile: {
      firstName: "James",
      lastName: "Kolawole",
      dateOfBirth: "1990-05-12",
      gender: "MALE",
      maritalStatus: "SINGLE",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
    },
    employment: {
      employmentStatus: "EMPLOYED",
      employerName: "Tech Solutions Ltd",
      employerAddress: "123 Business Way, Lagos",
      workEmail: "james.k@techsol.com",
      jobTitle: "Software Engineer",
      monthlyIncome: 450000,
      salaryDay: 28,
      employmentStartDate: "2020-01-15",
    },
    kyc: {
      bvn: "22233344455",
      bvnStatus: "VERIFIED",
    },
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "usr_9",
    email: "a.bello@example.com",
    phone: "+234 701 987 6543",
    isEmailVerified: true,
    isPhoneVerified: true,
    registrationStep: "COMPLETE",
    status: "ACTIVE",
    profile: {
      firstName: "Aisha",
      lastName: "Bello",
      dateOfBirth: "1988-11-20",
      gender: "FEMALE",
      maritalStatus: "MARRIED",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
    },
    employment: {
      employmentStatus: "SELF_EMPLOYED",
      employerName: "Aisha Bello Fabrics",
      employerAddress: "45 Market Street, Abuja",
      workEmail: null,
      jobTitle: "Creative Director",
      monthlyIncome: 800000,
      salaryDay: null,
      employmentStartDate: "2015-06-10",
    },
    kyc: {
      bvn: "11122233344",
      bvnStatus: "VERIFIED",
    },
    createdAt: "2026-02-15T14:30:00.000Z",
  },
  {
    id: "usr_10",
    email: "clark.k@example.com",
    phone: "+234 902 333 4444",
    isEmailVerified: true,
    isPhoneVerified: true,
    registrationStep: "IDENTITY_VERIFIED",
    status: "SUSPENDED",
    profile: {
      firstName: "Clark",
      lastName: "Kent",
      dateOfBirth: "1992-02-28",
      gender: "MALE",
      maritalStatus: "SINGLE",
      city: "Ibadan",
      state: "Oyo",
      country: "Nigeria",
    },
    employment: {
      employmentStatus: "EMPLOYED",
      employerName: "Daily Planet",
      employerAddress: "Planet Square, Oyo",
      workEmail: "ckent@dailyplanet.com",
      jobTitle: "Reporter",
      monthlyIncome: 250000,
      salaryDay: 25,
      employmentStartDate: "2018-11-01",
    },
    kyc: {
      bvn: "99988877766",
      bvnStatus: "PENDING",
    },
    createdAt: "2026-04-01T09:15:00.000Z",
  },
]);

const filteredUsers = computed(() => {
  let result = mockUsers.value;
  if (activeTab.value !== "ALL") {
    result = result.filter((u) => u.status === activeTab.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (u) =>
        u.profile.firstName.toLowerCase().includes(q) ||
        u.profile.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }
  return result;
});

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "SUSPENDED":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
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
          KYC Verifications
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Review customer profiles and verify submitted documentation.
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
      <button
        v-for="tab in [
          { value: 'PENDING', label: 'Pending Review' },
          { value: 'ACTIVE', label: 'Approved Profiles' },
          { value: 'SUSPENDED', label: 'Rejected / Suspended' },
          { value: 'ALL', label: 'All Customers' },
        ]"
        :key="tab.value"
        @click="activeTab = tab.value as typeof activeTab"
        class="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
        :class="
          activeTab === tab.value
            ? 'bg-primary-600 text-white shadow-sm ring-1 ring-primary-700'
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
      <div class="p-4 border-b border-slate-100 bg-slate-50/50">
        <div class="w-full sm:max-w-md">
          <AppTextInput
            id="search"
            v-model="searchQuery"
            placeholder="Search by name or email..."
            type="text"
          />
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block w-full overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 border-collapse min-w-200">
          <thead
            class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100"
          >
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">
                Customer Profile
              </th>
              <th scope="col" class="px-6 py-4 font-medium">Contact</th>
              <th scope="col" class="px-6 py-4 font-medium">Stage</th>
              <th scope="col" class="px-6 py-4 font-medium">Status</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                No KYC profiles pending review.
              </td>
            </tr>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0"
                  >
                    {{ user.profile.firstName[0]
                    }}{{ user.profile.lastName[0] }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">
                      {{ user.profile.firstName }} {{ user.profile.lastName }}
                    </div>
                    <div class="text-xs text-slate-500 font-mono mt-0.5">
                      {{ user.id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-slate-700">{{ user.email }}</div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ user.phone }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded"
                >
                  {{ user.registrationStep }}
                </span>
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
              <td class="px-6 py-4 text-right">
                <button
                  @click="
                    router.push({ name: 'kyc-detail', params: { id: user.id } })
                  "
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye class="w-3.5 h-3.5" /> Inspect KYC
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile List (Responsiveness) -->
      <div class="md:hidden flex flex-col divide-y divide-slate-100">
        <div
          v-if="filteredUsers.length === 0"
          class="p-8 text-center text-slate-500"
        >
          No profiles matched.
        </div>
        <div
          v-for="user in filteredUsers"
          :key="`mob-${user.id}`"
          class="p-4 hover:bg-slate-50 flex flex-col gap-3"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0"
              >
                {{ user.profile.firstName[0] }}
              </div>
              <div>
                <div class="font-medium text-slate-800">
                  {{ user.profile.firstName }} {{ user.profile.lastName }}
                </div>
                <div class="text-xs text-slate-500">{{ user.email }}</div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 mt-1">
            <span
              :class="[
                'px-2 py-0.5 rounded text-xs font-semibold uppercase',
                getStatusColor(user.status),
              ]"
            >
              {{ user.status }}
            </span>
            <button
              @click="
                router.push({ name: 'kyc-detail', params: { id: user.id } })
              "
              class="text-sm cursor-pointer font-medium text-primary-600 flex items-center gap-1"
            >
              <span>Inspect</span> <Eye class="w-4 h-4 mt-1" />
            </button>
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
          :total-items="filteredUsers.length"
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
