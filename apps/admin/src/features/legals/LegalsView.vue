<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  AppTextInput,
  BaseButton,
  AppDatePicker,
  AppSelect,
} from "@bcl/ui";
import {
  FileText,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  FileCode,
  Calendar,
} from "lucide-vue-next";
import {
  type LoanLegalDocument,
  type LegalDocumentType,
  type ApiClientError,
} from "@bcl/types";
import { useToastStore } from "@/stores/toast";
import { getLegalDocuments } from "./api";
import LegalTableSkeleton from "./components/LegalTableSkeleton.vue";

const router = useRouter();
const toastStore = useToastStore();

// ── State ──────────────────────────────────────────────────────────────────────

const documents = ref<LoanLegalDocument[]>([]);
const loading = ref(true);

const searchQuery = ref("");
const filterType = ref<LegalDocumentType | "">("");
const filterStatus = ref<"ACTIVE" | "INACTIVE" | "">("");
const dateRange = ref<Date[] | null>(null);

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function fetchDocuments(): Promise<void> {
  loading.value = true;
  try {
    const res = await getLegalDocuments({
      type: filterType.value || undefined,
      isActive: filterStatus.value === "" ? undefined : filterStatus.value === "ACTIVE",
      search: searchQuery.value || undefined,
      dateFrom: dateRange.value?.[0]?.toISOString(),
      dateTo: dateRange.value?.[1]?.toISOString(),
    });
    documents.value = res.data;
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || "Failed to load documents");
  } finally {
    loading.value = false;
  }
}

watch([filterType, filterStatus, dateRange], fetchDocuments);

let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchDocuments();
  }, 500);
});

onMounted(fetchDocuments);

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const typeOptions = [
  { label: "All Types", value: "" },
  { label: "Loan Contract", value: "LOAN_CONTRACT" },
  { label: "Loan Terms", value: "LOAN_TERMS" },
  { label: "Privacy Policy", value: "PRIVACY_POLICY" },
  { label: "Terms & Conditions", value: "TERMS_AND_CONDITIONS" },
];

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FileText class="w-6 h-6 text-primary" />
          Legal Documents
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Manage platform disclosures, contracts, and terms of service.
        </p>
      </div>
      <BaseButton variant="primary" @click="router.push({ name: 'legal-create' })">
        <Plus class="w-4 h-4" /> New Document
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col xl:flex-row gap-4 items-end">
      <div class="w-full xl:flex-1">
        <AppTextInput
          id="search"
          v-model="searchQuery"
          placeholder="Search by title..."
          :icon="Search"
        />
      </div>
      <div class="w-full xl:w-48">
        <AppSelect
          id="type"
          v-model="filterType"
          label="Document Type"
          :options="typeOptions"
        />
      </div>
      <div class="w-full xl:w-40">
        <AppSelect
          id="status"
          v-model="filterStatus"
          label="Status"
          :options="statusOptions"
        />
      </div>
      <div class="w-full xl:w-64">
        <AppDatePicker
          v-model="dateRange"
          range
          label="Effective Date"
          placeholder="Select range"
        />
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <LegalTableSkeleton v-if="loading && documents.length === 0" />

      <template v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block w-full overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600 border-collapse min-w-225">
            <thead class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-medium">Document Title</th>
                <th class="px-6 py-4 font-medium">Type</th>
                <th class="px-6 py-4 font-medium">Version</th>
                <th class="px-6 py-4 font-medium">Effective Date</th>
                <th class="px-6 py-4 font-medium">Status</th>
                <th class="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="documents.length === 0">
                <td colspan="6" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-2 opacity-30">
                    <FileCode class="w-10 h-10" />
                    <p class="font-medium">No legal documents found</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="doc in documents"
                :key="doc.id"
                class="hover:bg-slate-50 transition-colors group"
                :class="{ 'opacity-50': loading }"
              >
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">{{ doc.title }}</div>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ doc.id.slice(0, 8) }}...</div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                    {{ doc.type.replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono text-xs">{{ doc.version }}</td>
                <td class="px-6 py-4 text-xs">{{ formatDate(doc.effectiveDate) }}</td>
                <td class="px-6 py-4">
                  <span
                    v-if="doc.isActive"
                    class="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" /> Active
                  </span>
                  <span
                    v-else
                    class="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider"
                  >
                    <XCircle class="w-3.5 h-3.5" /> Inactive
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    class="text-primary hover:bg-primary-50 font-bold"
                    @click="router.push({ name: 'legal-detail', params: { id: doc.id } })"
                  >
                    <Eye class="w-4 h-4 mr-1.5" /> View/Edit
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col divide-y divide-slate-100">
          <div
            v-for="doc in documents"
            :key="`mob-${doc.id}`"
            class="p-4 flex flex-col gap-3"
            :class="{ 'opacity-50': loading }"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="font-bold text-slate-800">{{ doc.title }}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-1">v{{ doc.version }} · {{ doc.type.replace('_', ' ') }}</div>
              </div>
              <span
                :class="doc.isActive ? 'text-emerald-600' : 'text-slate-400'"
                class="text-[10px] font-black uppercase tracking-widest"
              >
                {{ doc.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="flex justify-between items-center mt-1">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <Calendar class="w-3.5 h-3.5" />
                {{ formatDate(doc.effectiveDate) }}
              </div>
              <BaseButton
                variant="ghost"
                size="sm"
                class="text-primary font-bold p-0 h-auto"
                @click="router.push({ name: 'legal-detail', params: { id: doc.id } })"
              >
                Edit Document
              </BaseButton>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
