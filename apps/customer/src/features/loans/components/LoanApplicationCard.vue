<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Info, Clock, CheckCircle2, XCircle } from 'lucide-vue-next'
import type { LoanApplicationResult, LoanApplicationStatus } from '@bcl/types'

const props = defineProps<{ application: LoanApplicationResult }>()

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusConfig: Record<
  LoanApplicationStatus,
  { label: string; icon: any; color: string; bg: string }
> = {
  UNDER_REVIEW: {
    label: 'Under Review',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-100',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-100',
  },
  DISBURSED: {
    label: 'Disbursed',
    icon: CheckCircle2,
    color: 'text-primary',
    bg: 'bg-primary-50 border-primary-100',
  },
}

const config = computed(() => statusConfig[props.application.status])
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5 overflow-hidden relative"
  >
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Loan Application
        </p>
        <p class="text-xl font-bold text-slate-800">
          {{ formatCurrency(application.requestedAmount) }}
        </p>
      </div>
      <div
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-colors"
        :class="[config.bg, config.color]"
      >
        <component :is="config.icon" class="w-3.5 h-3.5" />
        {{ config.label }}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-5">
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100"
        >
          <Calendar class="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Applied On</p>
          <p class="text-xs font-bold text-slate-700">{{ formatDate(application.createdAt) }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100"
        >
          <Info class="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Tracker ID</p>
          <p class="text-xs font-bold text-slate-700 font-mono">{{ application.trackerId }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="application.status === 'REJECTED' && application.rejectionReason"
      class="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50 mb-4"
    >
      <p class="text-[10px] text-rose-600 font-medium leading-relaxed">
        <span class="font-bold">Reason:</span> {{ application.rejectionReason }}
      </p>
    </div>

    <div class="flex items-center justify-between pt-4 border-t border-slate-50">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-slate-200" />
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
          >{{ application.requestedTenor }} Months Tenor</span
        >
      </div>
      <p class="text-[10px] font-bold text-slate-300 italic">
        {{ application.purpose || 'Personal Use' }}
      </p>
    </div>
  </div>
</template>
