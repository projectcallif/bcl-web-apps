<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  Phone,
  Home,
  Briefcase,
  FileText,
} from "lucide-vue-next";
import { AppProgressBar } from "@bcl/ui";
import type { LoanStatus, LoanType, RepaymentScheduleItem } from "@bcl/types";

const router = useRouter();

const activeTab = ref<"schedule" | "kyc">("schedule");

const mockLoan = ref({
  id: "loan_1",
  loanNumber: "BCL-10293-847",
  type: "PERSONAL" as LoanType,
  purpose: "Business Expansion",
  principal: 500000,
  totalPayable: 550000,
  amountPaid: 200000,
  outstandingBalance: 350000,
  nextRepaymentDate: "2026-11-24T00:00:00.000Z",
  nextRepaymentAmount: 50000,
  disbursedAt: "2026-10-24T00:00:00.000Z",
  dueDate: "2027-04-24T00:00:00.000Z",
  status: "ACTIVE" as LoanStatus,
  interestRate: 2,
  tenor: 6,

  // Custom admin-side fields
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 800 111 2222",
    address: "14 Adeola Odeku St, Victoria Island",
    employment: "Gainfully Employed",
    employer: "Tech Corp Ltd",
    bvn: "2234005889",
  },
});

const mockSchedule = ref<RepaymentScheduleItem[]>([
  {
    installmentNo: 1,
    dueDate: "2026-11-24",
    principalDue: 41666,
    interestDue: 8334,
    totalDue: 50000,
    balance: 350000,
    status: "UPCOMING",
  },
  {
    installmentNo: 2,
    dueDate: "2026-12-24",
    principalDue: 41666,
    interestDue: 8334,
    totalDue: 50000,
    balance: 300000,
    status: "UPCOMING",
  },
]);

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(n);
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const loanTypeLabel: Record<LoanType, string> = {
  PERSONAL: "Personal Loan",
  BUSINESS: "Business Loan",
  EMERGENCY: "Emergency Loan",
  SALARY_ADVANCE: "Salary Advance",
};

const statusConfig: Record<
  LoanStatus | "PENDING" | "REJECTED" | "HALTED",
  { label: string; dot: string; badge: string }
> = {
  ACTIVE: {
    label: "Active",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700",
  },
  OVERDUE: {
    label: "Overdue",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700",
  },
  HALTED: {
    label: "Halted",
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700",
  },
};
</script>

<template>
  <!-- Back -->
  <button
    class="flex items-center gap-1.5 cursor-pointer text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
    @click="router.push({ name: 'loans' })"
  >
    <ArrowLeft class="w-4 h-4" /> Back to Loans Triage
  </button>

  <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
    <!-- MAIN AREA -->
    <div class="flex flex-col gap-6">
      <!-- Loan header card -->
      <div
        class="relative bg-slate-900 rounded-2xl p-6 overflow-hidden text-white"
      >
        <div
          class="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"
        />
        <div
          class="absolute right-4 -bottom-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none"
        />

        <div class="relative flex items-start justify-between mb-5">
          <div>
            <p class="text-white/60 text-sm mb-1">
              {{ loanTypeLabel[mockLoan.type] }}
            </p>
            <p class="text-lg font-bold text-white">
              {{ mockLoan.loanNumber }}
            </p>
            <p v-if="mockLoan.purpose" class="text-sm text-white/70 mt-1">
              {{ mockLoan.purpose }}
            </p>
          </div>
          <span
            class="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="statusConfig[mockLoan.status].dot"
            />
            {{ statusConfig[mockLoan.status].label }}
          </span>
        </div>

        <div class="relative grid grid-cols-2 gap-6 mb-5">
          <div>
            <p class="text-xs text-white/50 uppercase tracking-wider mb-1">
              Outstanding Balance
            </p>
            <p class="text-3xl font-bold tracking-tight text-white">
              {{ formatCurrency(mockLoan.outstandingBalance) }}
            </p>
          </div>
          <div class="self-end">
            <div class="flex justify-between text-xs text-white/50 mb-2">
              <span
                >{{
                  Math.round(
                    (mockLoan.amountPaid / mockLoan.totalPayable) * 100,
                  )
                }}% Repaid</span
              >
              <span
                >{{ formatCurrency(mockLoan.amountPaid) }} /
                {{ formatCurrency(mockLoan.totalPayable) }}</span
              >
            </div>
            <AppProgressBar
              :progress="
                Math.round((mockLoan.amountPaid / mockLoan.totalPayable) * 100)
              "
              color-class="bg-emerald-400"
              track-class="bg-slate-800 ring-1 ring-white/10"
            />
          </div>
        </div>

        <div
          class="relative grid grid-cols-4 gap-4 pt-5 border-t border-white/15"
        >
          <div>
            <p class="text-xs text-white/50 mb-1">Principal</p>
            <p class="text-sm font-semibold">
              {{ formatCurrency(mockLoan.principal) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Interest</p>
            <p class="text-sm font-semibold">{{ mockLoan.interestRate }}%</p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Disbursed On</p>
            <p class="text-sm font-semibold">
              {{ formatDate(mockLoan.disbursedAt) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-white/50 mb-1">Tenor</p>
            <p class="text-sm font-semibold">
              {{ mockLoan.tenor }} Months
            </p>
          </div>
        </div>
      </div>

      <!-- Detail Tabs -->
      <div
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50"
      >
        <div class="flex border-b border-slate-100">
          <button
            class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
            :class="
              activeTab === 'schedule'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            "
            @click="activeTab = 'schedule'"
          >
            <CreditCard class="w-4 h-4" /> Schedule
          </button>
          <button
            class="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
            :class="
              activeTab === 'kyc'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            "
            @click="activeTab = 'kyc'"
          >
            <FileText class="w-4 h-4" /> KYC Analysis
          </button>
        </div>

        <div class="p-6">
          <!-- Schedule Tab -->
          <div v-if="activeTab === 'schedule'">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-slate-600 min-w-200">
                <thead class="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th class="px-4 py-3 rounded-l-lg">Inst.</th>
                    <th class="px-4 py-3">Due Date</th>
                    <th class="px-4 py-3">Amount Due</th>
                    <th class="px-4 py-3 text-right">Balance</th>
                    <th class="px-4 py-3 text-right rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="item in mockSchedule"
                    :key="item.installmentNo"
                  >
                    <td class="px-4 py-3">{{ item.installmentNo }}</td>
                    <td class="px-4 py-3 font-medium text-slate-800">
                      {{ formatDate(item.dueDate) }}
                    </td>
                    <td class="px-4 py-3">
                      {{ formatCurrency(item.totalDue) }}
                    </td>
                    <td class="px-4 py-3 text-right text-slate-500">
                      {{ formatCurrency(item.balance) }}
                    </td>
                    <td class="px-4 py-3 text-right">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                        :class="
                          item.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        "
                      >
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- KYC Documents Tab -->
          <div v-if="activeTab === 'kyc'" class="flex flex-col gap-6">
            <h3
              class="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2"
            >
              Customer Documents
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div
                class="border border-slate-200 rounded-xl p-4 hover:border-primary-200 transition-colors cursor-pointer group bg-slate-50 hover:bg-primary-50/20"
              >
                <FileText
                  class="w-6 h-6 text-slate-400 group-hover:text-primary-500 mb-2"
                />
                <p class="font-medium text-slate-800 text-sm">
                  Employment_Letter.pdf
                </p>
                <p class="text-xs text-slate-500">Uploaded Oct 23, 2026</p>
              </div>
              <div
                class="border border-slate-200 rounded-xl p-4 hover:border-primary-200 transition-colors cursor-pointer group bg-slate-50 hover:bg-primary-50/20"
              >
                <FileText
                  class="w-6 h-6 text-slate-400 group-hover:text-primary-500 mb-2"
                />
                <p class="font-medium text-slate-800 text-sm">
                  Electricity_Bill_Aug.pdf
                </p>
                <p class="text-xs text-slate-500">Uploaded Oct 23, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SIDEBAR -->
    <div
      class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:sticky top-6"
    >
      <h3
        class="text-sm font-bold text-slate-800 mb-5 uppercase tracking-wider"
      >
        Applicant Profile
      </h3>

      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700"
        >
          {{ mockLoan.customer.name[0] }}
        </div>
        <div>
          <p class="font-bold text-slate-800">{{ mockLoan.customer.name }}</p>
          <p class="text-xs text-slate-500">
            BVN: {{ mockLoan.customer.bvn }}
            <span class="text-emerald-500">✓</span>
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-4 text-sm">
        <div class="flex items-start gap-3 border-b border-slate-50 pb-4">
          <Mail class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div class="min-w-0">
            <p class="text-slate-500 text-xs">Email Address</p>
            <p class="font-medium text-slate-800 truncate">
              {{ mockLoan.customer.email }}
            </p>
          </div>
        </div>
        <div class="flex items-start gap-3 border-b border-slate-50 pb-4">
          <Phone class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p class="text-slate-500 text-xs">Phone Number</p>
            <p class="font-medium text-slate-800">
              {{ mockLoan.customer.phone }}
            </p>
          </div>
        </div>
        <div class="flex items-start gap-3 border-b border-slate-50 pb-4">
          <Home class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p class="text-slate-500 text-xs">Residential Address</p>
            <p class="font-medium text-slate-800">
              {{ mockLoan.customer.address }}
            </p>
          </div>
        </div>
        <div class="flex items-start gap-3 pb-2">
          <Briefcase class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p class="text-slate-500 text-xs">Employment</p>
            <p class="font-medium text-slate-800">
              {{ mockLoan.customer.employment }}
            </p>
            <p class="text-xs text-slate-500">
              {{ mockLoan.customer.employer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
