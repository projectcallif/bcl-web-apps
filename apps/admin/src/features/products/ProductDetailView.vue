<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ArrowLeft,
  Save,
  Plus,
  AlertCircle,
  MoreVertical,
  Calendar,
  Percent,
  History,
  Settings2,
} from "lucide-vue-next";
import {
  BaseButton,
  BaseSkeleton,
  AppDialog,
  AppConfirmDialog,
  AppTextInput,
} from "@bcl/ui";
import type {
  LoanProduct,
  LoanProductTenor,
  ApiClientError,
} from "@bcl/types";
import {
  getAdminProductDetail,
  updateProduct,
  addTenor,
  updateTenor,
  deleteTenor,
} from "./api";
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const productId = route.params.id as string;

// ── State ──────────────────────────────────────────────────────────────────────

const product = ref<LoanProduct | null>(null);
const loading = ref(true);
const saving = ref(false);

const isTenorModalOpen = ref(false);
const tenorForm = ref({
  id: "" as string | number,
  tenorValue: 1,
  interestRate: 5,
});
const isEditingTenor = ref(false);

const isDeleteConfirmOpen = ref(false);
const tenorToDelete = ref<string | number | null>(null);

const activeTenorMenuId = ref<string | number | null>(null);

function toggleTenorMenu(id: string | number) {
  activeTenorMenuId.value = activeTenorMenuId.value === id ? null : id;
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest(".group\\/tenor")) {
    activeTenorMenuId.value = null;
  }
}

// ── Fetch ──────────────────────────────────────────────────────────────────────

async function fetchDetail() {
  loading.value = true;
  try {
    const res = await getAdminProductDetail(productId);
    product.value = res.data;
    // Normalize numeric rates from decimals to percentages for display
    product.value.interestRate = Number(product.value.interestRate) * 100;
    product.value.processingFeeRate = Number(product.value.processingFeeRate || 0) * 100;
    product.value.managementFeeRate = Number(product.value.managementFeeRate || 0) * 100;
    product.value.penaltyRate = Number(product.value.penaltyRate || 0) * 100;
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Failed to load product detail");
    router.push({ name: "products" });
  } finally {
    loading.value = false;
  }
}

// ── Product Actions ──────────────────────────────────────────────────────────

async function handleSaveProduct() {
  if (!product.value) return;
  saving.value = true;
  try {
    const payload = {
      ...product.value,
      interestRate: Number(product.value.interestRate) / 100,
      processingFeeRate: Number(product.value.processingFeeRate) / 100,
      managementFeeRate: Number(product.value.managementFeeRate) / 100,
      penaltyRate: Number(product.value.penaltyRate) / 100,
    };
    await updateProduct(productId, payload);
    toast.success("Product updated successfully");
    fetchDetail();
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Failed to update product");
  } finally {
    saving.value = false;
  }
}

// ── Tenor Actions ────────────────────────────────────────────────────────────

function openAddTenor() {
  isEditingTenor.value = false;
  tenorForm.value = { id: "", tenorValue: 1, interestRate: 5 };
  isTenorModalOpen.value = true;
}

function openEditTenor(tenor: LoanProductTenor) {
  isEditingTenor.value = true;
  tenorForm.value = {
    id: tenor.id,
    tenorValue: tenor.tenorValue,
    interestRate: tenor.interestRate * 100,
  };
  isTenorModalOpen.value = true;
}

async function handleTenorSubmit() {
  try {
    const payload = {
      tenorValue: tenorForm.value.tenorValue,
      interestRate: tenorForm.value.interestRate / 100,
    };

    if (isEditingTenor.value) {
      await updateTenor(productId, tenorForm.value.id, payload);
      toast.success("Tenor updated");
    } else {
      await addTenor(productId, payload);
      toast.success("New tenor added");
    }
    isTenorModalOpen.value = false;
    activeTenorMenuId.value = null;
    fetchDetail();
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Tenor operation failed");
  }
}

async function toggleTenorStatus(tenor: LoanProductTenor) {
  try {
    activeTenorMenuId.value = null;
    await updateTenor(productId, tenor.id, { isActive: !tenor.isActive });
    toast.success(`Tenor ${tenor.isActive ? "deactivated" : "activated"}`);
    fetchDetail();
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Failed to update tenor status");
  }
}

function confirmDeleteTenor(id: string | number) {
  activeTenorMenuId.value = null;
  tenorToDelete.value = id;
  isDeleteConfirmOpen.value = true;
}

async function handleDeleteTenor() {
  if (!tenorToDelete.value) return;
  try {
    await deleteTenor(productId, tenorToDelete.value);
    toast.success("Tenor removed permanently");
    fetchDetail();
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Failed to remove tenor");
  } finally {
    isDeleteConfirmOpen.value = false;
    tenorToDelete.value = null;
  }
}

onMounted(() => {
  fetchDetail();
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Back & Title -->
    <div class="flex flex-col gap-2">
      <button
        @click="router.push({ name: 'products' })"
        class="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium w-fit"
      >
        <ArrowLeft class="w-4 h-4" /> Back to Products
      </button>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          {{ loading ? "Loading Product..." : product?.name }}
        </h1>
        <div class="flex items-center gap-3">
          <BaseButton variant="ghost" @click="fetchDetail" :disabled="loading">
            <History class="w-4 h-4 mr-2" /> Refresh
          </BaseButton>
          <BaseButton variant="primary" @click="handleSaveProduct" :loading="saving" :disabled="loading">
            <Save class="w-4 h-4 mr-2" /> Save Configuration
          </BaseButton>
        </div>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BaseSkeleton height="600px" class="lg:col-span-2 rounded-3xl" />
      <BaseSkeleton height="400px" class="rounded-3xl" />
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Main Configuration -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div class="flex items-center gap-2 mb-6">
            <Settings2 class="w-5 h-5 text-primary-500" />
            <h2 class="text-lg font-bold text-slate-800 tracking-tight">Basic Configuration</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
              <AppTextInput v-model="product.name" id="name" placeholder="e.g. Personal Salary Loan" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea
                v-model="product.description"
                rows="3"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Briefly describe this product for administrators..."
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Min Amount (₦)</label>
              <AppTextInput v-model="product.minAmount" id="minAmount" type="number" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Max Amount (₦)</label>
              <AppTextInput v-model="product.maxAmount" id="maxAmount" type="number" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Min Tenor</label>
              <AppTextInput v-model="product.minTenor" id="minTenor" type="number" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Max Tenor</label>
              <AppTextInput v-model="product.maxTenor" id="maxTenor" type="number" />
            </div>
          </div>
        </div>

        <!-- Tenor Management -->
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <Calendar class="w-5 h-5 text-primary-500" />
              <h2 class="text-lg font-bold text-slate-800 tracking-tight">Custom Tenors</h2>
            </div>
            <BaseButton variant="ghost" size="sm" class="text-primary-600 bg-primary-50" @click="openAddTenor">
              <Plus class="w-4 h-4 mr-1" /> Add Tenor
            </BaseButton>
          </div>

          <div v-if="product.tenors.length === 0" class="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p class="text-slate-400 text-sm font-medium">No custom tenors defined.</p>
            <p class="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Using fallback min/max range</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th class="px-4 py-3">Duration</th>
                  <th class="px-4 py-3 text-center">Interest / Mo</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="tenor in product.tenors" :key="tenor.id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-4 font-bold text-slate-800">{{ tenor.tenorValue }} {{ (product.tenorUnit || 'Months').toLowerCase() }}</td>
                  <td class="px-4 py-4 text-center font-mono text-xs text-primary-700 font-bold">
                    {{ (tenor.interestRate * 100).toFixed(1) }}%
                  </td>
                  <td class="px-4 py-4 text-center">
                    <span
                      class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ring-1 ring-inset"
                      :class="tenor.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-slate-100 text-slate-500 ring-slate-200'"
                    >
                      {{ tenor.isActive ? 'Active' : 'Hidden' }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-right">
                    <div class="relative group/tenor inline-block">
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        class="p-1 h-auto rounded-lg"
                        @click.stop="toggleTenorMenu(tenor.id)"
                      >
                        <MoreVertical class="w-4 h-4 text-slate-400" />
                      </BaseButton>
                      <div
                        v-if="activeTenorMenuId === tenor.id"
                        class="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <button
                          @click="openEditTenor(tenor)"
                          class="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Edit Rate
                        </button>
                        <button
                          @click="toggleTenorStatus(tenor)"
                          class="w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer"
                          :class="tenor.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'"
                        >
                          {{ tenor.isActive ? 'Deactivate' : 'Activate' }}
                        </button>
                        <div class="border-t border-slate-50 my-1"></div>
                        <button
                          @click="confirmDeleteTenor(tenor.id)"
                          class="w-full text-left px-4 py-2 text-xs font-medium text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Delete Permanently
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Fees & Rates -->
      <div class="flex flex-col gap-6">
        <div class="bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-900/10 text-white">
          <div class="flex items-center gap-2 mb-6">
            <Percent class="w-5 h-5 text-primary-400" />
            <h2 class="text-lg font-bold tracking-tight">Financial Parameters</h2>
          </div>

          <div class="flex flex-col gap-5">
            <div>
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Fallback Interest (%)</label>
              <div class="relative">
                <AppTextInput v-model="product.interestRate" id="int" type="number" class="bg-white/10 border-white/10 text-white focus:border-primary-400" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Processing Fee (%)</label>
              <div class="relative">
                <AppTextInput v-model="product.processingFeeRate" id="pFee" type="number" class="bg-white/10 border-white/10 text-white focus:border-primary-400" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Management Fee (%)</label>
              <div class="relative">
                <AppTextInput v-model="product.managementFeeRate" id="mFee" type="number" class="bg-white/10 border-white/10 text-white focus:border-primary-400" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10">
              <label class="block text-[10px] font-bold text-rose-400/60 uppercase tracking-widest mb-2">Penalty Rate / Day (%)</label>
              <div class="relative">
                <AppTextInput v-model="product.penaltyRate" id="pRate" type="number" class="bg-white/10 border-white/10 text-white focus:border-rose-400/50" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400/40 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div class="flex items-center gap-2 mb-4">
            <AlertCircle class="w-5 h-5 text-amber-500" />
            <h3 class="font-bold text-slate-800 tracking-tight">Deployment Info</h3>
          </div>
          <div class="space-y-4 text-xs text-slate-500">
            <div class="flex justify-between">
              <span>Status</span>
              <span class="font-bold" :class="product.isActive ? 'text-emerald-600' : 'text-rose-600'">
                {{ product.isActive ? 'Live' : 'Maintenance' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Interest Type</span>
              <span class="font-bold text-slate-700">{{ product.interestType }}</span>
            </div>
            <div class="flex justify-between">
              <span>Created At</span>
              <span class="font-bold text-slate-700">{{ new Date(product.createdAt || '').toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tenor Modal -->
    <AppDialog v-model="isTenorModalOpen" :title="isEditingTenor ? 'Update Tenor' : 'Add New Tenor'">
      <div class="space-y-6 pt-4">
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Duration ({{ (product?.tenorUnit || 'Months').toLowerCase() }})</label>
          <AppTextInput v-model="tenorForm.tenorValue" id="tVal" type="number" placeholder="e.g. 6" />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Interest Rate (%)</label>
          <div class="relative">
            <AppTextInput v-model="tenorForm.interestRate" id="tInt" type="number" placeholder="e.g. 5.5" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <BaseButton variant="ghost" @click="isTenorModalOpen = false">Cancel</BaseButton>
          <BaseButton variant="primary" @click="handleTenorSubmit">{{ isEditingTenor ? 'Update' : 'Add Tenor' }}</BaseButton>
        </div>
      </div>
    </AppDialog>

    <!-- Delete Confirmation -->
    <AppConfirmDialog
      v-model="isDeleteConfirmOpen"
      title="Delete Tenor"
      message="Are you sure you want to permanently delete this tenor? This action cannot be undone and may affect active loan calculations if users are currently applying."
      confirm-text="Yes, Delete Permanently"
      confirm-variant="primary"
      @confirm="handleDeleteTenor"
    />
  </div>
</template>
