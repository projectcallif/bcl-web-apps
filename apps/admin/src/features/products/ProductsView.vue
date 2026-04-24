<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  Plus,
  Search,
  MoreVertical,
  Settings2,
  ExternalLink,
  AlertCircle,
} from "lucide-vue-next";
import { BaseButton, BaseSkeleton } from "@bcl/ui";
import type { AdminLoanProductListItem, ApiClientError } from "@bcl/types";
import { getAdminProducts, updateProduct } from "./api";
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const toast = useToastStore();

const products = ref<AdminLoanProductListItem[]>([]);
const loading = ref(true);
const searchQuery = ref("");
const activeMenuId = ref<string | null>(null);

function toggleMenu(id: string) {
  activeMenuId.value = activeMenuId.value === id ? null : id;
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest(".group\\/menu")) {
    activeMenuId.value = null;
  }
}

async function fetchProducts() {
  loading.value = true;
  try {
    const res = await getAdminProducts();
    products.value = res.data;
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Failed to load products");
  } finally {
    loading.value = false;
  }
}

async function toggleProductStatus(product: AdminLoanProductListItem) {
  try {
    activeMenuId.value = null;
    await updateProduct(product.id, { isActive: !product.isActive });
    toast.success(`Product ${product.isActive ? "deactivated" : "activated"} successfully`);
    fetchProducts();
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Status update failed");
  }
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(val);
}

onMounted(() => {
  fetchProducts();
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Loan Products
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Manage loan offerings, interest rates, and repayment tenors.
        </p>
      </div>
      <BaseButton variant="primary" @click="router.push({ name: 'create-product' })">
        <Plus class="w-4 h-4 mr-2" /> New Product
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
      <div class="relative flex-1 w-full">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter products by name..."
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div class="flex justify-between mb-4">
          <BaseSkeleton width="120px" height="1.5rem" />
          <BaseSkeleton width="60px" height="1rem" rounded="999px" />
        </div>
        <BaseSkeleton width="100%" height="3rem" class="mb-4" />
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="j in 2" :key="j">
            <BaseSkeleton width="40px" height="0.75rem" class="mb-1" />
            <BaseSkeleton width="80px" height="1.25rem" />
          </div>
        </div>
        <BaseSkeleton width="100%" height="2.5rem" rounded="0.75rem" />
      </div>
    </div>

    <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Settings2 class="w-8 h-8 text-slate-300" />
      </div>
      <p class="text-slate-500 font-medium">No loan products found.</p>
      <p class="text-xs text-slate-400 mt-1">Start by creating your first lending product.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="font-bold text-slate-800 tracking-tight">{{ product.name }}</h3>
          <span
            class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset"
            :class="product.isActive 
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' 
              : 'bg-rose-50 text-rose-700 ring-rose-200'"
          >
            {{ product.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <p class="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
          {{ product.description || 'No description provided.' }}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-slate-50">
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Amount</p>
            <p class="font-bold text-slate-700">{{ formatCurrency(product.maxAmount) }}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Interest</p>
            <p class="font-bold text-slate-700">{{ (product.interestRate * 100).toFixed(1) }}% <span class="text-[10px] opacity-60">/ mo</span></p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tenors</p>
            <p class="font-bold text-slate-700">{{ product.activeTenorCount }} Active</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Tenor</p>
            <p class="font-bold text-slate-700">{{ product.maxTenor }} {{ product.tenorUnit.toLowerCase() }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <BaseButton
            variant="ghost"
            class="flex-1 text-slate-600 bg-slate-50 hover:bg-slate-100"
            @click="router.push({ name: 'product-detail', params: { id: product.id } })"
          >
            <ExternalLink class="w-4 h-4 mr-2" /> Manage
          </BaseButton>
          <div class="relative group/menu">
            <BaseButton
              variant="ghost"
              class="px-2 bg-slate-50 hover:bg-slate-100"
              @click.stop="toggleMenu(product.id)"
            >
              <MoreVertical class="w-4 h-4 text-slate-400" />
            </BaseButton>
            <div
              v-if="activeMenuId === product.id"
              class="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <button
                @click="toggleProductStatus(product)"
                class="w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                :class="product.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'"
              >
                {{ product.isActive ? 'Deactivate Product' : 'Activate Product' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
      <AlertCircle class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
      <div class="text-xs text-indigo-700 leading-relaxed">
        <p class="font-bold mb-1 uppercase tracking-wider">Product Logic Rule</p>
        <p>If a product has active tenors defined, only those values will be available during application. If no tenors exist, the system falls back to the top-level min/max range and interest rate.</p>
      </div>
    </div>
  </div>
</template>
