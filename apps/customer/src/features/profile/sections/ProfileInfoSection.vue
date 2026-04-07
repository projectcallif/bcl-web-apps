<script setup lang="ts">
import { computed } from 'vue'
import { Pencil } from 'lucide-vue-next'
import { useAuthStore } from '../../auth/store'

const props = defineProps<{ activeSub: 'personal' | 'employment' | 'address' | 'bank' }>()

const authStore = useAuthStore()
const p = computed(() => authStore.user?.profile)

function formatDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
}
function label(val?: string): string {
  return val ? val.charAt(0) + val.slice(1).toLowerCase().replace(/_/g, ' ') : '—'
}

// Mock data for fields not yet in the User type
const mockEmployment = {
  jobTitle: 'Senior Software Engineer',
  employer: 'TechCorp Nigeria Ltd',
  type: 'Full-time',
  sector: 'Technology',
  monthlyIncome: 450_000,
  workCity: 'Lagos',
}

const mockAddress = {
  street: '14 Adeola Odeku Street',
  lga: 'Victoria Island',
}

const mockBank = {
  bankName: 'Zenith Bank',
  accountNumber: '2012345678',
  accountName: computed(() =>
    [p.value?.firstName, p.value?.lastName].filter(Boolean).join(' ').toUpperCase() || 'JOHN DOE',
  ),
  accountType: 'Savings',
}

const TITLES: Record<typeof props.activeSub, string> = {
  personal:   'Personal Information',
  employment: 'Employment Information',
  address:    'Address Information',
  bank:       'Bank Information',
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-base font-bold text-slate-800">{{ TITLES[activeSub] }}</h2>
      <button class="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5">
        <Pencil class="w-3 h-3" />
        Edit
      </button>
    </div>

    <!-- Personal Information -->
    <template v-if="activeSub === 'personal'">
      <div class="divide-y divide-slate-50">
        <div v-for="row in [
          { label: 'First Name',      value: p?.firstName },
          { label: 'Middle Name',     value: p?.middleName || '—' },
          { label: 'Last Name',       value: p?.lastName },
          { label: 'Date of Birth',   value: formatDate(p?.dateOfBirth) },
          { label: 'Gender',          value: label(p?.gender) },
          { label: 'Marital Status',  value: label(p?.maritalStatus) },
        ]" :key="row.label" class="flex items-center justify-between py-3.5">
          <span class="text-sm text-slate-500">{{ row.label }}</span>
          <span class="text-sm font-medium text-slate-800">{{ row.value ?? '—' }}</span>
        </div>
      </div>
    </template>

    <!-- Employment Information -->
    <template v-else-if="activeSub === 'employment'">
      <div class="divide-y divide-slate-50">
        <div v-for="row in [
          { label: 'Job Title',        value: mockEmployment.jobTitle },
          { label: 'Employer',         value: mockEmployment.employer },
          { label: 'Employment Type',  value: mockEmployment.type },
          { label: 'Sector',           value: mockEmployment.sector },
          { label: 'Monthly Income',   value: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(mockEmployment.monthlyIncome) },
          { label: 'Work City',        value: mockEmployment.workCity },
        ]" :key="row.label" class="flex items-center justify-between py-3.5">
          <span class="text-sm text-slate-500">{{ row.label }}</span>
          <span class="text-sm font-medium text-slate-800">{{ row.value }}</span>
        </div>
      </div>
      <p class="mt-4 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
        Employment information is used for loan eligibility assessment and is not shared publicly.
      </p>
    </template>

    <!-- Address Information -->
    <template v-else-if="activeSub === 'address'">
      <div class="divide-y divide-slate-50">
        <div v-for="row in [
          { label: 'Street Address',  value: mockAddress.street },
          { label: 'LGA',             value: mockAddress.lga },
          { label: 'City',            value: p?.city },
          { label: 'State',           value: p?.state },
          { label: 'Country',         value: p?.country },
        ]" :key="row.label" class="flex items-center justify-between py-3.5">
          <span class="text-sm text-slate-500">{{ row.label }}</span>
          <span class="text-sm font-medium text-slate-800">{{ row.value ?? '—' }}</span>
        </div>
      </div>
    </template>

    <!-- Bank Information -->
    <template v-else-if="activeSub === 'bank'">
      <div class="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-5">
        <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Disbursement Account</p>
        <div class="divide-y divide-primary/10">
          <div v-for="row in [
            { label: 'Bank Name',       value: mockBank.bankName },
            { label: 'Account Number',  value: mockBank.accountNumber },
            { label: 'Account Name',    value: mockBank.accountName.value },
            { label: 'Account Type',    value: mockBank.accountType },
          ]" :key="row.label" class="flex items-center justify-between py-3">
            <span class="text-sm text-slate-500">{{ row.label }}</span>
            <span class="text-sm font-semibold text-slate-800 font-mono">{{ row.value }}</span>
          </div>
        </div>
      </div>
      <p class="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
        This is the account your loan will be disbursed to. Contact support to update your bank details.
      </p>
    </template>
  </div>
</template>
