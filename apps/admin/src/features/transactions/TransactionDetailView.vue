<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BaseButton, BaseSkeleton } from "@bcl/ui";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Banknote,
  FileJson,
} from "lucide-vue-next";
import { type TransactionDetail, type ApiClientError } from "@bcl/types";
import { useToastStore } from "@/stores/toast";
import { getTransactionDetail } from "./api";

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const id = route.params.id as string;
const transaction = ref<TransactionDetail | null>(null);
const loading = ref(true);

async function fetchDetail() {
  loading.value = true;
  try {
    const res = await getTransactionDetail(id);
    transaction.value = res.data;
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || "Failed to load transaction details");
    router.push({ name: "transactions" });
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDetail);

const formatCurrency = (n: number | string) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(n));
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function getStatusClass(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "FAILED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "REVERSED":
      return "bg-slate-100 text-slate-700 ring-slate-300";
    default:
      return "bg-slate-50 text-slate-600 ring-slate-200";
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Back Button -->
    <button
      @click="router.back()"
      class="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit"
    >
      <ArrowLeft class="w-4 h-4" />
      <span class="text-sm font-medium">Back</span>
    </button>

    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold text-slate-800 tracking-tight flex flex-wrap items-center gap-2"
        >
          <span>Transaction Details</span>
          <span
            v-if="transaction"
            class="text-sm font-mono text-slate-400 font-normal"
            >#{{ transaction.reference }}</span
          >
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Detailed breakdown of financial event and its associated metadata.
        </p>
      </div>
      <div v-if="transaction" class="flex items-center gap-3">
        <span
          class="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ring-1 ring-inset flex items-center gap-1"
          :class="getStatusClass(transaction.status)"
        >
          <component
            :is="
              transaction.status === 'SUCCESS'
                ? CheckCircle2
                : transaction.status === 'PENDING'
                  ? Clock
                  : transaction.status === 'REVERSED'
                    ? RotateCcw
                    : XCircle
            "
            class="w-3.5 h-3.5"
          />
          <span>{{ transaction.status }}</span>
        </span>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 space-y-6">
        <div
          class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6"
        >
          <BaseSkeleton height="40px" width="200px" />
          <div class="grid grid-cols-2 gap-8">
            <BaseSkeleton v-for="i in 4" :key="i" height="60px" />
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <BaseSkeleton height="200px" rounded="20px" />
        <BaseSkeleton height="200px" rounded="20px" />
      </div>
    </div>

    <template v-else-if="transaction">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <!-- Main Content -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Primary Info -->
          <div
            class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div
              class="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between flex-wrap gap-4"
            >
              <div class="flex items-center gap-4 flex-wrap">
                <div
                  class="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary"
                >
                  <Banknote
                    v-if="transaction.type === 'DISBURSEMENT'"
                    class="w-6 h-6"
                  />
                  <CreditCard v-else class="w-6 h-6" />
                </div>
                <div>
                  <p
                    class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest"
                  >
                    {{ transaction.type.replace("_", " ") }}
                  </p>
                  <h2 class="text-2xl font-bold text-slate-900">
                    {{ formatCurrency(transaction.amount) }}
                  </h2>
                </div>
              </div>
              <div>
                <p
                  class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1"
                >
                  Transaction Date
                </p>
                <p
                  class="text-sm font-bold text-slate-700 flex items-center justify-end gap-2"
                >
                  <Calendar class="w-4 h-4" />
                  {{ formatDate(transaction.createdAt) }}
                </p>
              </div>
            </div>

            <div class="p-6 md:p-8 space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-1">
                  <span
                    class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest"
                    >Narration</span
                  >
                  <p class="text-sm font-medium text-slate-700 leading-relaxed">
                    {{ transaction.narration }}
                  </p>
                </div>
                <div class="space-y-1">
                  <span
                    class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest"
                    >Reference ID</span
                  >
                  <p
                    class="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded w-fit"
                  >
                    {{ transaction.reference }}
                  </p>
                </div>
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50"
              >
                <div class="space-y-1">
                  <span
                    class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest"
                    >Provider</span
                  >
                  <p class="text-sm font-bold text-slate-700">
                    {{ transaction.provider }}
                  </p>
                </div>
                <div class="space-y-1">
                  <span
                    class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest"
                    >Provider Reference</span
                  >
                  <p class="text-sm font-bold text-slate-700">
                    {{ transaction.providerReference || "N/A" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div
            class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div class="p-6 border-b border-slate-50 flex items-center gap-3">
              <FileJson class="w-5 h-5 text-indigo-600" />
              <h3 class="font-bold text-slate-800">Raw Metadata</h3>
            </div>
            <div class="p-6 bg-slate-900 overflow-x-auto">
              <pre class="text-emerald-400 font-mono text-xs leading-relaxed">{{
                transaction.metadata
                  ? JSON.stringify(transaction.metadata, null, 2)
                  : "No metadata available"
              }}</pre>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- User Info -->
          <div
            class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
          >
            <h3
              class="text-sm font-bold text-slate-800 flex items-center gap-2"
            >
              <User class="w-4 h-4 text-primary" /> Linked User
            </h3>
            <div class="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary uppercase"
              >
                {{ transaction?.user?.firstName[0]
                }}{{ transaction?.user?.lastName[0] }}
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="font-bold text-slate-900 truncate">
                  {{ transaction?.user?.firstName }}
                  {{ transaction?.user?.lastName }}
                </p>
                <p class="text-[10px] font-mono text-slate-400 truncate">
                  {{ transaction?.user?.id }}
                </p>
              </div>
            </div>
            <BaseButton
              v-if="transaction.user"
              variant="ghost"
              size="sm"
              class="w-max text-primary font-bold bg-primary-50 hover:bg-primary-100"
              @click="
                () => {
                  router.push({
                    name: 'customer-detail',
                    params: { id: transaction?.user?.id },
                  });
                }
              "
            >
              <ExternalLink class="w-3.5 h-3.5" /> Customer Profile
            </BaseButton>
          </div>

          <!-- Loan Info -->
          <div
            v-if="transaction.loan"
            class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
          >
            <h3
              class="text-sm font-bold text-slate-800 flex items-center gap-2"
            >
              <Banknote class="w-4 h-4 text-emerald-600" /> Linked Loan
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-400">Reference</span>
                <span class="font-bold text-slate-900">{{
                  transaction.loan.referenceId
                }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-400">Status</span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700"
                  >{{ transaction.loan.status }}</span
                >
              </div>
            </div>
            <BaseButton
              variant="ghost"
              size="sm"
              class="w-max text-emerald-600 font-bold bg-emerald-50 hover:bg-emerald-100"
              @click="
                () => {
                  router.push({
                    name: 'admin-loan-detail',
                    params: { id: transaction?.loan?.id },
                  });
                }
              "
            >
              <ExternalLink class="w-3.5 h-3.5" /> Loan Dashboard
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
