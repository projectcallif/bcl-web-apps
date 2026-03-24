<script setup lang="ts">
import { Download, CheckCircle2, Clock, AlertCircle } from 'lucide-vue-next'
import type { RepaymentScheduleItem, InstallmentStatus } from '@bcl/types'

const props = defineProps<{
  items: RepaymentScheduleItem[]
  loanNumber?: string
}>()

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusConfig: Record<InstallmentStatus, { label: string; classes: string; icon: typeof CheckCircle2 }> = {
  PAID:     { label: 'Paid',     classes: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  UPCOMING: { label: 'Upcoming', classes: 'bg-slate-100 text-slate-500', icon: Clock },
  OVERDUE:  { label: 'Overdue',  classes: 'bg-red-100 text-red-700',     icon: AlertCircle },
}

function downloadCSV() {
  const headers = ['#', 'Due Date', 'Principal (₦)', 'Interest (₦)', 'Total (₦)', 'Balance (₦)', 'Status', 'Paid At']
  const rows = props.items.map(item => [
    item.installmentNumber,
    item.dueDate,
    item.principal,
    item.interest,
    item.totalAmount,
    item.balance,
    item.status,
    item.paidAt ?? '',
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `repayment-schedule-${props.loanNumber ?? 'loan'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm font-semibold text-slate-700">Repayment Schedule</p>
        <p class="text-xs text-slate-400 mt-0.5">{{ items.length }} installments</p>
      </div>
      <button
        class="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        @click="downloadCSV"
      >
        <Download class="w-3.5 h-3.5" />
        Download CSV
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-xl border border-slate-100">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">#</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Principal</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Interest</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance</th>
            <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="item in items"
            :key="item.installmentNumber"
            class="hover:bg-slate-50/50 transition-colors"
            :class="item.status === 'OVERDUE' ? 'bg-red-50/30' : ''"
          >
            <td class="px-4 py-3 text-xs font-medium text-slate-400">{{ item.installmentNumber }}</td>
            <td class="px-4 py-3 text-slate-700">{{ formatDate(item.dueDate) }}</td>
            <td class="px-4 py-3 text-right text-slate-700">{{ formatCurrency(item.principal) }}</td>
            <td class="px-4 py-3 text-right text-slate-500">{{ formatCurrency(item.interest) }}</td>
            <td class="px-4 py-3 text-right font-semibold text-slate-800">{{ formatCurrency(item.totalAmount) }}</td>
            <td class="px-4 py-3 text-right text-slate-500">{{ formatCurrency(item.balance) }}</td>
            <td class="px-4 py-3 text-center">
              <span
                class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                :class="statusConfig[item.status].classes"
              >
                <component :is="statusConfig[item.status].icon" class="w-3 h-3" />
                {{ statusConfig[item.status].label }}
              </span>
            </td>
          </tr>
        </tbody>
        <!-- Summary row -->
        <tfoot class="border-t-2 border-slate-200 bg-slate-50">
          <tr>
            <td colspan="2" class="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Total</td>
            <td class="px-4 py-3 text-right text-xs font-bold text-slate-700">
              {{ formatCurrency(items.reduce((s, i) => s + i.principal, 0)) }}
            </td>
            <td class="px-4 py-3 text-right text-xs font-bold text-slate-700">
              {{ formatCurrency(items.reduce((s, i) => s + i.interest, 0)) }}
            </td>
            <td class="px-4 py-3 text-right text-xs font-bold text-slate-800">
              {{ formatCurrency(items.reduce((s, i) => s + i.totalAmount, 0)) }}
            </td>
            <td colspan="2" />
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
