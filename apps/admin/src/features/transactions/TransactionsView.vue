<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AppPagination, AppDatePicker, AppTextInput } from "@bcl/ui";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Eye,
  RotateCcw,
} from "lucide-vue-next";
import type { Transaction, TransactionType, PaymentStatus } from "@bcl/types";
import { getTransactionsAcrossPlatform } from "./api";
import TransactionSkeleton from "./components/TransactionSkeleton.vue";

const route = useRoute();
const router = useRouter();

const transactions = ref<
  (Transaction & {
    userName?: string;
  })[]
>([]);
const total = ref(0);
const totalPages = ref(1);
const loading = ref(false);

const currentPage = ref(1);
const pageSize = 15;
const typeFilter = ref<TransactionType | null>(null);
const statusFilter = ref<PaymentStatus | null>(null);
const dateRange = ref<Date[] | null>(null);
const searchQuery = ref("");

const userIdFilter = computed(() => (route.query.userId as string) || null);
const loanIdFilter = computed(() => (route.query.loanId as string) || null);

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
      status: statusFilter.value,
      userId: userIdFilter.value,
      loanId: loanIdFilter.value,
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

watch(
  [
    currentPage,
    typeFilter,
    statusFilter,
    dateRange,
    userIdFilter,
    loanIdFilter,
  ],
  () => {
    fetchTransactions();
  },
);

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
  { label: "Refunds", value: "REFUND" },
  { label: "Reversals", value: "REVERSAL" },
];

const STATUS_FILTERS: { label: string; value: PaymentStatus | null }[] = [
  { label: "All Status", value: null },
  { label: "Success", value: "SUCCESS" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
  { label: "Reversed", value: "REVERSED" },
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
      class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4"
    >
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1 max-w-sm relative">
          <AppTextInput
            id="search"
            v-model="searchQuery"
            placeholder="Search by reference..."
            class="pl-10 -ml-4"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-6 top-3.5" />
        </div>

        <div class="h-px lg:h-8 w-full lg:w-px bg-slate-100 lg:mx-2"></div>

        <div class="w-full lg:w-72">
          <AppDatePicker
            v-model="dateRange"
            range
            placeholder="Filter by date range"
            @update:model-value="onFilterChange"
          />
        </div>

        <div
          v-if="userIdFilter || loanIdFilter"
          class="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold"
        >
          <span>Active Filter: {{ userIdFilter ? "User ID" : "Loan ID" }}</span>
          <button
            @click="router.push({ name: 'transactions' })"
            class="hover:text-primary-900"
          >
            <XCircle class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        class="flex flex-wrap flex-col sm:flex-row items-start sm:items-center gap-6 pt-2 border-t border-slate-50"
      >
        <div class="flex flex-wrap items-center gap-3">
          <span
            class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >Type</span
          >
          <div
            class="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-hide"
          >
            <button
              v-for="f in TYPE_FILTERS"
              :key="String(f.value)"
              class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap uppercase tracking-wider"
              :class="
                typeFilter === f.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              "
              @click="
                () => {
                  typeFilter = f.value;
                  onFilterChange();
                }
              "
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span
            class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >Status</span
          >
          <div
            class="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-hide"
          >
            <button
              v-for="f in STATUS_FILTERS"
              :key="String(f.value)"
              class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap uppercase tracking-wider"
              :class="
                statusFilter === f.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              "
              @click="
                () => {
                  statusFilter = f.value;
                  onFilterChange();
                }
              "
            >
              {{ f.label }}
            </button>
          </div>
        </div>
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
                <th class="px-6 py-4 font-semibold text-right">Actions</th>
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
                      class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-xs text-slate-700 uppercase"
                    >
                      {{ txn.userName?.[0] || "?"
                      }}{{ txn.userName?.split(" ")?.[1]?.[0] || "?" }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-800">
                        {{ txn.userName }}
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
                    class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold"
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
                  class="px-6 py-4 text-base"
                  :class="
                    txn.type === 'DISBURSEMENT'
                      ? 'text-primary-700'
                      : 'text-emerald-700'
                  "
                >
                  <p class="flex items-center gap-0.5 font-semibold">
                    <span>{{ txn.type === "DISBURSEMENT" ? "+" : "−" }}</span>
                    <span>{{ formatCurrency(Number(txn.amount)) }}</span>
                  </p>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset"
                    :class="{
                      'bg-emerald-50 text-emerald-700 ring-emerald-200':
                        txn.status === 'SUCCESS',
                      'bg-amber-50 text-amber-700 ring-amber-200':
                        txn.status === 'PENDING',
                      'bg-rose-50 text-rose-700 ring-rose-200':
                        txn.status === 'FAILED',
                      'bg-slate-100 text-slate-700 ring-slate-300':
                        txn.status === 'REVERSED',
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
                    <RotateCcw
                      v-else-if="txn.status === 'REVERSED'"
                      class="w-3.5 h-3.5"
                    />
                    <XCircle v-else class="w-3.5 h-3.5" />
                    {{ txn.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    class="text-primary font-semibold hover:bg-primary-50 flex items-center gap-1"
                    @click="
                      () => {
                        router.push({
                          name: 'transaction-detail',
                          params: { id: txn.id },
                        });
                      }
                    "
                  >
                    <Eye class="w-4 h-4" /> <span>Details</span>
                  </BaseButton>
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
                  class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold"
                >
                  {{ txn.userName?.[0] }}
                </div>
                <p class="text-sm font-semibold text-slate-800">
                  {{ txn.userName }}
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
                  class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest"
                  >{{ txn.type.replace("_", " ") }}</span
                >
                <span
                  class="text-sm font-semibold"
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
                class="text-[11px] font-semibold px-2 py-1 rounded-lg"
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
              <div class="flex items-center gap-4">
                <span>{{ formatDate(txn.createdAt) }}</span>
              </div>
              <button
                class="text-primary font-semibold hover:underline"
                @click="
                  () => {
                    router.push({
                      name: 'transaction-detail',
                      params: { id: txn.id },
                    });
                  }
                "
              >
                View Details
              </button>
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
