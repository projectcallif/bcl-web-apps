<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, History, ChevronRight, FileJson } from "lucide-vue-next";
import {
  AppTextInput,
  AppPagination,
  BaseButton,
  AppDialog,
  AppDateRangePicker,
} from "@bcl/ui";
import type { DateRange } from "@bcl/ui";
import type { AuditLog } from "@bcl/types";

// Mock Audit Logs
const mockLogs = ref<AuditLog[]>([
  {
    id: "evt_1001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actorId: "usr_admin_1",
    actorName: "Super Admin",
    action: "APPROVE_KYC",
    targetId: "usr_8",
    targetName: "James Kolawole",
    ipAddress: "192.168.1.104",
    metadata: {
      previousState: "PENDING",
      newState: "ACTIVE",
      clearedBvn: true,
      clearedLiveness: true,
    },
  },
  {
    id: "evt_1002",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorId: "usr_finance_2",
    actorName: "Sarah Finance",
    action: "DISBURSE_LOAN",
    targetId: "loan_2026_a10",
    targetName: "BCL-2026-A10",
    ipAddress: "10.0.0.45",
    metadata: {
      amountDisbursed: 500000,
      bankReference: "ZEN-99882773661",
      systemFlag: "SUCCESS",
    },
  },
  {
    id: "evt_1003",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    actorId: "usr_underwriter_1",
    actorName: "Dave Reviewer",
    action: "REJECT_LOAN",
    targetId: "loan_2026_b99",
    targetName: "BCL-2026-B99",
    ipAddress: "10.0.0.88",
    metadata: {
      reason: "High DTI Ratio detected > 45%",
      manualOverride: false,
    },
  },
  {
    id: "evt_1004",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actorId: "usr_admin_1",
    actorName: "Super Admin",
    action: "UPDATE_SETTINGS",
    ipAddress: "192.168.1.104",
    metadata: {
      module: "Loan Underwriting Rules",
      changes: {
        requireUtilityBill: { old: false, new: true },
      },
    },
  },
]);

const searchQuery = ref("");
const dateRange = ref<DateRange>({ start: "", end: "" });
const currentPage = ref(1);

const filteredLogs = computed(() => {
  let res = mockLogs.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    res = res.filter(
      (l) =>
        l.actorName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.targetName && l.targetName.toLowerCase().includes(q)),
    );
  }

  if (dateRange.value.start) {
    const startTs = new Date(dateRange.value.start).getTime();
    res = res.filter((l) => new Date(l.timestamp).getTime() >= startTs);
  }

  if (dateRange.value.end) {
    const endTs = new Date(dateRange.value.end).getTime() + 86400000; // end of target day
    res = res.filter((l) => new Date(l.timestamp).getTime() < endTs);
  }

  return res;
});

// Metadata Inspector Dialog
const isMetadataOpen = ref(false);
const activeLog = ref<AuditLog | null>(null);

function viewMetadata(log: AuditLog) {
  activeLog.value = log;
  isMetadataOpen.value = true;
}

function formatDateOptions(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActionStyle(action: string) {
  if (action.includes("APPROVE") || action.includes("DISBURSE")) {
    return "bg-emerald-100 text-emerald-700";
  }
  if (action.includes("REJECT") || action.includes("SUSPEND")) {
    return "bg-rose-100 text-rose-700";
  }
  if (action.includes("UPDATE") || action.includes("SYSTEM")) {
    return "bg-indigo-100 text-indigo-700";
  }
  return "bg-slate-100 text-slate-700";
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
          <History class="w-6 h-6 text-slate-400" /> System Audit Logs
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Immutable ledger of all administrative and lifecycle state changes.
        </p>
      </div>
    </div>

    <!-- Main Card -->
    <div
      class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
      <!-- Toolbar -->
      <div
        class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="w-full sm:max-w-md flex items-center relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-6 z-10" />
          <AppTextInput
            id="search"
            v-model="searchQuery"
            placeholder="Search events, actors, or targets..."
            type="text"
            class="pl-10 w-full -ml-4"
          />
        </div>
        <AppDateRangePicker v-model="dateRange" />
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block w-full overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 border-collapse">
          <thead
            class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100"
          >
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">Timestamp & ID</th>
              <th scope="col" class="px-6 py-4 font-medium">Actor</th>
              <th scope="col" class="px-6 py-4 font-medium">Event Action</th>
              <th scope="col" class="px-6 py-4 font-medium">
                Target Reference
              </th>
              <th scope="col" class="px-6 py-4 font-medium text-right">
                Details
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono text-xs">
            <tr v-if="filteredLogs.length === 0">
              <td
                colspan="5"
                class="px-6 py-8 text-center text-slate-500 font-sans"
              >
                No system events matched.
              </td>
            </tr>
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4 text-slate-500">
                <div class="font-semibold text-slate-700">
                  {{ formatDateOptions(log.timestamp) }}
                </div>
                <div class="mt-0.5 opacity-60">{{ log.id }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-800">{{ log.actorName }}</div>
                <div class="mt-0.5 text-slate-400">{{ log.actorId }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex px-2 py-1 rounded font-bold uppercase tracking-wider text-[10px]"
                  :class="getActionStyle(log.action)"
                >
                  {{ log.action }}
                </span>
                <div class="mt-1 text-slate-400 flex items-center gap-1">
                  IP: {{ log.ipAddress }}
                </div>
              </td>
              <td class="px-6 py-4 text-slate-700">
                <template v-if="log.targetId">
                  <div class="font-bold">{{ log.targetName }}</div>
                  <div class="mt-0.5 text-slate-400">{{ log.targetId }}</div>
                </template>
                <template v-else>
                  <span class="text-slate-400 font-sans italic"
                    >System Global</span
                  >
                </template>
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  @click="viewMetadata(log)"
                >
                  Payload <FileJson class="w-4 h-4 ml-2" />
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile List -->
      <div
        class="md:hidden flex flex-col divide-y divide-slate-100 font-mono text-xs"
      >
        <div
          v-if="filteredLogs.length === 0"
          class="p-8 text-center text-slate-500 font-sans"
        >
          No events found.
        </div>
        <div
          v-for="log in filteredLogs"
          :key="`mob-${log.id}`"
          class="p-4 hover:bg-slate-50 flex flex-col gap-3"
        >
          <div class="flex items-start justify-between">
            <span
              class="inline-flex px-2 py-1 rounded font-bold uppercase tracking-wider text-[10px]"
              :class="getActionStyle(log.action)"
            >
              {{ log.action }}
            </span>
            <span class="text-slate-400">{{
              formatDateOptions(log.timestamp)
            }}</span>
          </div>

          <div
            class="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100"
          >
            <div>
              <p class="text-slate-400 mb-1 font-sans font-medium">Actor</p>
              <p class="font-bold text-slate-800">{{ log.actorName }}</p>
            </div>
            <div>
              <p class="text-slate-400 mb-1 font-sans font-medium">Target</p>
              <p class="font-bold text-slate-800">
                {{ log.targetName || "Global" }}
              </p>
            </div>
          </div>

          <BaseButton
            variant="secondary"
            class="w-full justify-between"
            @click="viewMetadata(log)"
          >
            Inspect Metadata <ChevronRight class="w-4 h-4" />
          </BaseButton>
        </div>
      </div>

      <!-- Pagination -->
      <div
        class="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="1"
          :total-items="filteredLogs.length"
          :page-size="10"
        />
      </div>
    </div>
  </div>

  <!-- Metadata Dialog -->
  <AppDialog v-model="isMetadataOpen" title="Event Metadata Map">
    <div class="flex flex-col gap-4 mt-2" v-if="activeLog">
      <div
        class="bg-slate-900 text-emerald-400 font-mono text-sm leading-relaxed p-4 rounded-xl overflow-x-auto shadow-inner border border-slate-800"
      >
        <pre><code>{{ JSON.stringify(activeLog.metadata, null, 2) }}</code></pre>
      </div>

      <div
        class="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-600 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100"
      >
        <div>
          <span class="font-medium text-slate-800">Event ID:</span>
          <span class="font-mono">{{ activeLog.id }}</span>
        </div>
        <div>
          <span class="font-medium text-slate-800">Origin IP:</span>
          <span class="font-mono">{{ activeLog.ipAddress }}</span>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <BaseButton variant="primary" @click="isMetadataOpen = false"
          >Close</BaseButton
        >
      </div>
    </div>
  </AppDialog>
</template>
