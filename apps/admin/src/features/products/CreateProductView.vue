<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  Check,
  Percent,
  Plus,
  Trash2,
} from "lucide-vue-next";
import {
  BaseButton,
  AppTextInput,
} from "@bcl/ui";
import type { ApiClientError } from "@bcl/types";
import { createProduct } from "./api";
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const toast = useToastStore();

const saving = ref(false);

const form = ref({
  name: "",
  description: "",
  minAmount: 10000,
  maxAmount: 500000,
  minTenor: 1,
  maxTenor: 12,
  tenorUnit: "MONTHS",
  interestRate: 5,
  interestType: "FLAT",
  processingFeeRate: 0,
  managementFeeRate: 0,
  penaltyRate: 0,
  tenors: [] as { tenorValue: number; interestRate: number }[],
});

function addInitialTenor() {
  form.value.tenors.push({ tenorValue: 1, interestRate: 5 });
}

function removeInitialTenor(index: number) {
  form.value.tenors.splice(index, 1);
}

async function handleSubmit() {
  if (!form.value.name) {
    toast.error("Product name is required");
    return;
  }

  saving.value = true;
  try {
    const payload = {
      ...form.value,
      interestRate: Number(form.value.interestRate) / 100,
      processingFeeRate: Number(form.value.processingFeeRate) / 100,
      managementFeeRate: Number(form.value.managementFeeRate) / 100,
      penaltyRate: Number(form.value.penaltyRate) / 100,
      tenors: form.value.tenors.map(t => ({
        tenorValue: t.tenorValue,
        interestRate: t.interestRate / 100
      }))
    };
    const res = await createProduct(payload);
    toast.success("Product created successfully");
    router.push({ name: "product-detail", params: { id: res.data.id } });
  } catch (err) {
    const error = err as ApiClientError;
    toast.error(error.message || "Failed to create product");
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-4xl mx-auto">
    <button
      @click="router.push({ name: 'products' })"
      class="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium w-fit"
    >
      <ArrowLeft class="w-4 h-4" /> Back to Products
    </button>

    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Create Loan Product</h1>
      <BaseButton variant="primary" @click="handleSubmit" :loading="saving">
        <Check class="w-4 h-4 mr-2" /> Launch Product
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- General Info -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 md:col-span-2">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Product Overview</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
            <AppTextInput v-model="form.name" id="name" placeholder="Personal Loan, Salary Advance, etc." />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="Who is this product for?"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Limits -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Lending Limits</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Min (₦)</label>
              <AppTextInput v-model="form.minAmount" id="minA" type="number" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Max (₦)</label>
              <AppTextInput v-model="form.maxAmount" id="maxA" type="number" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Min Tenor</label>
              <AppTextInput v-model="form.minTenor" id="minT" type="number" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Max Tenor</label>
              <AppTextInput v-model="form.maxTenor" id="maxT" type="number" />
            </div>
          </div>
        </div>
      </div>

      <!-- Interest & Fees -->
      <div class="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white">
        <div class="flex items-center gap-2 mb-6">
          <Percent class="w-4 h-4 text-primary-400" />
          <h3 class="text-xs font-bold text-white/60 uppercase tracking-widest">Base Rates</h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Monthly Interest (%)</label>
            <AppTextInput v-model="form.interestRate" id="int" type="number" class="bg-white/10 border-white/10 text-white" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Processing (%)</label>
              <AppTextInput v-model="form.processingFeeRate" id="p" type="number" class="bg-white/10 border-white/10 text-white" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Penalty / Day (%)</label>
              <AppTextInput v-model="form.penaltyRate" id="pen" type="number" class="bg-white/10 border-white/10 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Seed Tenors -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 md:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Initial Tenors (Optional)</h3>
          <BaseButton variant="ghost" size="sm" class="text-primary-600 bg-primary-50" @click="addInitialTenor">
            <Plus class="w-4 h-4 mr-1" /> Add Tenor
          </BaseButton>
        </div>

        <div v-if="form.tenors.length === 0" class="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
          <p class="text-slate-400 text-sm">No initial tenors added. Using fallback limits.</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(tenor, index) in form.tenors" :key="index" class="flex items-end gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="flex-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tenor (Months)</label>
              <AppTextInput v-model="tenor.tenorValue" :id="`t-v-${index}`" type="number" />
            </div>
            <div class="flex-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Monthly Interest (%)</label>
              <AppTextInput v-model="tenor.interestRate" :id="`t-i-${index}`" type="number" />
            </div>
            <BaseButton variant="ghost" class="text-rose-600 hover:bg-rose-50 px-2" @click="removeInitialTenor(index)">
              <Trash2 class="w-5 h-5" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
