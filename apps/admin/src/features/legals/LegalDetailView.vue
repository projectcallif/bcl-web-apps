<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  AppTextInput,
  AppSelect,
  BaseButton,
  AppRichTextEditor,
  AppDatePicker,
  AppDialog,
  BaseSkeleton,
} from "@bcl/ui";
import {
  ArrowLeft,
  Save,
  Trash2,
  CheckCircle2,
  FileText,
  AlertTriangle,
  History,
} from "lucide-vue-next";
import {
  type LoanLegalDocument,
  type LegalDocumentType,
  type ApiClientError,
} from "@bcl/types";
import { useToastStore } from "@/stores/toast";
import {
  getLegalDocument,
  createLegalDocument,
  updateLegalDocument,
  activateLegalDocument,
  deleteLegalDocument,
} from "./api";

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const id = route.params.id as string;
const isEdit = computed(() => !!id);

// ── State ──────────────────────────────────────────────────────────────────────

const loading = ref(isEdit.value);
const saving = ref(false);
const activating = ref(false);
const deleting = ref(false);
const isDeleteDialogOpen = ref(false);

const form = ref<{
  type: LegalDocumentType;
  title: string;
  version: string;
  content: string;
  effectiveDate: string;
}>({
  type: "LOAN_CONTRACT",
  title: "",
  version: "1.0.0",
  content: "",
  effectiveDate: new Date().toISOString().split("T")[0],
});

const docData = ref<LoanLegalDocument | null>(null);

// ── Lifecycle ──────────────────────────────────────────────────────────────────

async function loadDocument() {
  if (!isEdit.value) return;
  loading.value = true;
  try {
    const res = await getLegalDocument(id);
    docData.value = res.data;
    form.value = {
      type: res.data.type,
      title: res.data.title,
      version: res.data.version,
      content: res.data.content,
      effectiveDate: res.data.effectiveDate,
    };
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || "Failed to load document");
    router.push({ name: "legals" });
  } finally {
    loading.value = false;
  }
}

onMounted(loadDocument);

// ── Actions ────────────────────────────────────────────────────────────────────

async function handleSave() {
  if (!form.value.title || !form.value.content) {
    toastStore.error("Please fill in all required fields");
    return;
  }

  saving.value = true;
  try {
    if (isEdit.value) {
      await updateLegalDocument(id, form.value);
      toastStore.success("Document updated successfully");
    } else {
      const res = await createLegalDocument(form.value);
      toastStore.success("Document created successfully");
      router.push({ name: "legal-detail", params: { id: res.data.id } });
    }
    loadDocument();
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || "Failed to save document");
  } finally {
    saving.value = false;
  }
}

async function handleActivate() {
  if (!isEdit.value) return;
  activating.value = true;
  try {
    await activateLegalDocument(id);
    toastStore.success("Document activated successfully");
    loadDocument();
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || "Failed to activate document");
  } finally {
    activating.value = false;
  }
}

async function handleDelete() {
  if (!isEdit.value) return;
  deleting.value = true;
  try {
    await deleteLegalDocument(id);
    toastStore.success("Document deleted successfully");
    router.push({ name: "legals" });
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || "Failed to delete document");
  } finally {
    deleting.value = false;
    isDeleteDialogOpen.value = false;
  }
}

const typeOptions = [
  { label: "Loan Contract", value: "LOAN_CONTRACT" },
  { label: "Loan Terms", value: "LOAN_TERMS" },
  { label: "Privacy Policy", value: "PRIVACY_POLICY" },
  { label: "Terms & Conditions", value: "TERMS_AND_CONDITIONS" },
];
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Back Button -->
    <button
      @click="router.push({ name: 'legals' })"
      class="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit"
    >
      <ArrowLeft class="w-4 h-4" />
      <span class="text-sm font-medium">Back to Legals</span>
    </button>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          {{ isEdit ? "Edit Legal Document" : "Create Legal Document" }}
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          {{ isEdit ? `Managing ${docData?.title || 'document'}` : "Set up a new legal disclosure or contract." }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton
          v-if="isEdit && !docData?.isActive"
          variant="ghost"
          class="border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          :loading="activating"
          @click="handleActivate"
        >
          <CheckCircle2 class="w-4 h-4 mr-2" /> Activate Version
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="saving"
          @click="handleSave"
        >
          <Save class="w-4 h-4 mr-2" /> Save Changes
        </BaseButton>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
      <div class="space-y-8">
        <!-- Main Form Card -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppTextInput
              id="title"
              v-model="form.title"
              label="Document Title"
              placeholder="e.g. Loan Terms and Conditions"
              required
            />
            <AppSelect
              id="type"
              v-model="form.type"
              label="Document Type"
              :options="typeOptions"
              :disabled="isEdit"
            />
            <AppTextInput
              id="version"
              v-model="form.version"
              label="Version Number"
              placeholder="e.g. 1.0.0"
              required
            />
            <div class="flex flex-col gap-1.5">
               <label class="text-sm font-bold text-slate-700">Effective Date</label>
               <AppDatePicker
                v-model="form.effectiveDate"
                placeholder="Pick a date"
              />
            </div>
          </div>

          <div class="pt-4">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-bold text-slate-800 uppercase tracking-wider">
                Document Content
              </label>
              <div v-if="docData?.type === 'LOAN_CONTRACT'" class="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black">
                SUPPORTS PLACEHOLDERS
              </div>
            </div>
            <p v-if="docData?.type === 'LOAN_CONTRACT'" class="text-xs text-slate-500 mb-4" v-pre>
              Use <code>{{ USER_NAME }}</code> for applicant name and <code>{{ LOAN_AMOUNT }}</code> for principal amount.
            </p>
            <AppRichTextEditor
              id="content"
              v-model="form.content"
              placeholder="Enter legal document content here..."
              min-height="400px"
            />
          </div>
        </div>

        <!-- Danger Zone -->
        <div v-if="isEdit" class="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="text-sm font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle class="w-4 h-4" /> Danger Zone
            </h3>
            <p class="text-xs text-rose-600 mt-1">Once deleted, this document version cannot be recovered. Active documents should not be deleted.</p>
          </div>
          <BaseButton
            variant="ghost"
            class="text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold"
            @click="isDeleteDialogOpen = true"
          >
            <Trash2 class="w-4 h-4 mr-2" /> Delete Document
          </BaseButton>
        </div>
      </div>

      <!-- Sidebar info -->
      <aside class="space-y-6 sticky xl:top-0">
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText class="w-4 h-4 text-primary" />
            Metadata
          </h3>
          <div class="space-y-3">
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</span>
              <div v-if="loading" class="mt-1"><BaseSkeleton width="80px" height="20px" rounded="4px" /></div>
              <div v-else class="mt-1 flex items-center gap-2">
                <div :class="docData?.isActive ? 'bg-emerald-500' : 'bg-slate-300'" class="w-2 h-2 rounded-full"></div>
                <span class="text-sm font-semibold" :class="docData?.isActive ? 'text-emerald-700' : 'text-slate-500'">
                  {{ docData?.isActive ? 'Active & Published' : 'Draft / Inactive' }}
                </span>
              </div>
            </div>
            <div class="flex flex-col" v-if="docData">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last Updated</span>
              <span class="text-sm text-slate-600 mt-0.5">{{ new Date(docData.updatedAt).toLocaleString() }}</span>
            </div>
            <div class="flex flex-col" v-if="docData">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System ID</span>
              <span class="text-[10px] font-mono text-slate-500 mt-1 break-all">{{ docData.id }}</span>
            </div>
          </div>
        </div>

        <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
           <div class="flex items-center gap-3 mb-3">
             <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                <History class="w-4 h-4" />
             </div>
             <h3 class="text-sm font-bold text-indigo-900">Compliance Info</h3>
           </div>
           <p class="text-xs text-indigo-700 leading-relaxed">
             This legal document is a binding agreement. Ensure all versions are reviewed by the legal department before activation.
           </p>
        </div>
      </aside>
    </div>

    <!-- Delete Confirm -->
    <AppDialog v-model="isDeleteDialogOpen" title="Delete Legal Document">
       <div class="flex flex-col gap-4 py-2">
          <div class="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex gap-3">
             <AlertTriangle class="w-5 h-5 shrink-0" />
             <p>Are you sure you want to delete <strong>{{ docData?.title }}</strong>? This action is permanent and will remove all associated content.</p>
          </div>
          <div class="flex justify-end gap-3 mt-4">
             <BaseButton variant="ghost" @click="isDeleteDialogOpen = false">Cancel</BaseButton>
             <BaseButton variant="primary" class="bg-rose-600 border-none hover:bg-rose-700 text-white" :loading="deleting" @click="handleDelete">
               Confirm Delete
             </BaseButton>
          </div>
       </div>
    </AppDialog>
  </div>
</template>
