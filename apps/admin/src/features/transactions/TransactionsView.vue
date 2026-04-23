<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { AppPagination, AppDatePicker, AppTextInput } from "@bcl/ui";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
} from "lucide-vue-next";
import type { Transaction, TransactionType } from "@bcl/types";
import { getTransactionsAcrossPlatform } from "./api";
import TransactionSkeleton from "./components/TransactionSkeleton.vue";

// ── State ──────────────────────────────────────────────────────────────────────

const transactions = ref<
  (Transaction & {
    user?: { firstName: string; lastName: string; email: string };
  })[]
>([]);
const total = ref(0);
const totalPages = ref(1);
const loading = ref(false);

const currentPage = ref(1);
const pageSize = 10;
const typeFilter = ref<TransactionType | null>(null);
const dateRange = ref<Date[] | null>(null);
const searchQuery = ref("");

// ── Fetch ──────────────────────────────────────────────────────────────────────

async function fetchTransactions(): Promise<void> {
  loading.value = true;
  try {
    let dateFrom: string | null = null;
    let dateTo: string | null = null;

    if (dateRange.value && dateRange.value.length === 2) {
      if (dateRange.value[0])
        dateFrom = dateRange.value[0].toISOString().slice(0, 10);
      if (dateRange.value[1])
        dateTo = dateRange.value[1].toISOString().slice(0, 10);
    }

    const res = await getTransactionsAcrossPlatform({
      page: currentPage.value,
      limit: pageSize,
      type: typeFilter.value,
      dateFrom,
      dateTo,
      search: searchQuery.value,
    });
    transactions.value = res.data.items;
    total.value = res.data.total;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
  } finally {
    loading.value = false;
  }
}

watch([currentPage, typeFilter, dateRange], fetchTransactions);

// We debounce search manually or via watch with delay
let searchTimeout: any;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchTransactions();
  }, 500);
});

onMounted(fetchTransactions);

function onFilterChange(): void {
  currentPage.value = 1;
}

// ── Formatters ─────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

function formatCurrency(n: number): string {
  return fmt.format(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const TYPE_FILTERS: { label: string; value: TransactionType | null }[] = [
  { label: "All Types", value: null },
  { label: "Disbursements", value: "DISBURSEMENT" },
  { label: "Repayments", value: "REPAYMENT" },
  { label: "Penalties", value: "PENALTY_CHARGE" },
  { label: "Fees", value: "FEE_CHARGE" },
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
          Platform Transactions
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Monitor all financial movements across the BCL ecosystem in real-time.
        </p>
      </div>
    </div>

    <!-- Filters Strip -->
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col lg:flex-row lg:items-center gap-4"
    >
      <div class="flex-1 max-w-sm relative">
        <AppTextInput
          id="search"
          v-model="searchQuery"
          placeholder="Search by name, email or reference..."
          class="pl-10 -ml-4"
        />
        <Search class="w-4 h-4 text-slate-400 absolute left-6 top-3.5" />
      </div>

      <div class="flex items-center gap-3">
        <Filter class="w-4 h-4 text-slate-400 shrink-0" />
        <div
          class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide"
        >
          <button
            v-for="f in TYPE_FILTERS"
            :key="String(f.value)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            :class="
              typeFilter === f.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            "
            @click="
              () => {
                typeFilter = f.value;
                onFilterChange();
                fetchTransactions();
              }
            "
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div class="h-px lg:h-8 w-full lg:w-px bg-slate-100 lg:mx-2"></div>

      <div class="w-full lg:w-72">
        <AppDatePicker
          v-model="dateRange"
          range
          placeholder="Filter by date range"
          @update:model-value="
            () => {
              onFilterChange();
              fetchTransactions();
            }
          "
        />
      </div>
    </div>

    <!-- Transactions List Card -->
    <div
      class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
      <TransactionSkeleton v-if="loading && transactions.length === 0" />

      <template v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block w-full overflow-x-auto">
          <table
            class="w-full text-left text-sm text-slate-600 border-collapse min-w-200"
          >
            <thead
              class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100"
            >
              <tr>
                <th class="px-6 py-4 font-semibold">User</th>
                <th class="px-6 py-4 font-semibold">Date</th>
                <th class="px-6 py-4 font-semibold">Reference</th>
                <th class="px-6 py-4 font-semibold">Type</th>
                <th class="px-6 py-4 font-semibold text-right">Amount</th>
                <th class="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-if="transactions.length === 0" class="text-center">
                <td colspan="6" class="px-6 py-16 text-slate-400">
                  <ArrowUpFromLine class="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p class="font-medium">No transactions found</p>
                  <p class="text-xs">Adjust filters or search parameters</p>
                </td>
              </tr>
              <tr
                v-for="txn in transactions"
                :key="txn.id"
                class="hover:bg-slate-50/80 transition-colors"
                :class="{ 'opacity-50 grayscale shadow-inner': loading }"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 uppercase"
                    >
                      {{ txn.user?.firstName?.[0] || "?"
                      }}{{ txn.user?.lastName?.[0] || "?" }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">
                        {{ txn.user?.firstName }} {{ txn.user?.lastName }}
                      </p>
                      <p class="text-xs text-slate-500">
                        {{ txn.user?.email }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 font-medium text-slate-600">
                  {{ formatDate(txn.createdAt) }}
                </td>
                <td class="px-6 py-4 font-mono text-xs text-slate-400">
                  {{ txn.reference }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold"
                    :class="
                      txn.type === 'DISBURSEMENT'
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-emerald-50 text-emerald-700'
                    "
                  >
                    <ArrowDownToLine
                      v-if="txn.type === 'DISBURSEMENT'"
                      class="w-3.5 h-3.5"
                    />
                    <ArrowUpFromLine v-else class="w-3.5 h-3.5" />
                    {{
                      txn.type === "DISBURSEMENT" ? "Disbursement" : "Repayment"
                    }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 text-right font-black text-base"
                  :class="
                    txn.type === 'DISBURSEMENT'
                      ? 'text-primary-700'
                      : 'text-emerald-700'
                  "
                >
                  {{ txn.type === "DISBURSEMENT" ? "+" : "−"
                  }}{{ formatCurrency(Number(txn.amount)) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset"
                    :class="{
                      'bg-emerald-50 text-emerald-700 ring-emerald-200':
                        txn.status === 'SUCCESS',
                      'bg-amber-50 text-amber-700 ring-amber-200':
                        txn.status === 'PENDING',
                      'bg-rose-50 text-rose-700 ring-rose-200':
                        txn.status === 'FAILED',
                    }"
                  >
                    <CheckCircle2
                      v-if="txn.status === 'SUCCESS'"
                      class="w-3.5 h-3.5"
                    />
                    <Clock
                      v-else-if="txn.status === 'PENDING'"
                      class="w-3.5 h-3.5"
                    />
                    <XCircle v-else class="w-3.5 h-3.5" />
                    {{
                      txn.status.charAt(0) + txn.status.slice(1).toLowerCase()
                    }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View -->
        <div class="md:hidden divide-y divide-slate-50">
          <div
            v-for="txn in transactions"
            :key="`mob-${txn.id}`"
            class="p-4 flex flex-col gap-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold"
                >
                  {{ txn.user?.firstName?.[0] }}
                </div>
                <p class="text-sm font-bold text-slate-800">
                  {{ txn.user?.firstName }} {{ txn.user?.lastName }}
                </p>
              </div>
              <span class="text-[10px] text-slate-400 font-mono uppercase">{{
                txn.reference
              }}</span>
            </div>
            <div
              class="flex items-center justify-between bg-slate-50 rounded-xl p-3"
            >
              <div class="flex flex-col">
                <span
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >{{ txn.type.replace("_", " ") }}</span
                >
                <span
                  class="text-sm font-black"
                  :class="
                    txn.type === 'DISBURSEMENT'
                      ? 'text-primary'
                      : 'text-emerald-600'
                  "
                >
                  {{ txn.type === "DISBURSEMENT" ? "+" : "−"
                  }}{{ formatCurrency(Number(txn.amount)) }}
                </span>
              </div>
              <span
                class="text-[11px] font-bold px-2 py-1 rounded-lg"
                :class="{
                  'bg-emerald-100 text-emerald-700': txn.status === 'SUCCESS',
                  'bg-amber-100 text-amber-700': txn.status === 'PENDING',
                  'bg-rose-100 text-rose-700': txn.status === 'FAILED',
                }"
                >{{ txn.status }}</span
              >
            </div>
            <div
              class="flex justify-between items-center text-[11px] text-slate-400"
            >
              <span>{{ formatDate(txn.createdAt) }}</span>
              <span>{{ txn.user?.email }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Pagination -->
      <div
        v-if="!loading && totalPages > 1"
        class="border-t border-slate-100 px-6 py-4 bg-slate-50/50"
      >
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :total-items="total"
          :page-size="pageSize"
        />
      </div>
    </div>
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
