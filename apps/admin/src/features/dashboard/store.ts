import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", () => {
  const totalCustomers = ref(0);
  const activeCustomers = ref(0);
  const inactiveCustomers = computed(() => totalCustomers.value - activeCustomers.value);
  const newToday = ref(0);

  const totalDisbursed = ref(0);
  const activeLoans = ref(0);
  const totalRepaid = ref(0);
  const overdueLoans = ref(0);

  function setStats(payload: {
    totalCustomers: number;
    activeCustomers: number;
    newToday: number;
    totalDisbursed: number;
    activeLoans: number;
    totalRepaid: number;
    overdueLoans: number;
  }) {
    totalCustomers.value = payload.totalCustomers;
    activeCustomers.value = payload.activeCustomers;
    newToday.value = payload.newToday;
    totalDisbursed.value = payload.totalDisbursed;
    activeLoans.value = payload.activeLoans;
    totalRepaid.value = payload.totalRepaid;
    overdueLoans.value = payload.overdueLoans;
  }

  return {
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    newToday,
    totalDisbursed,
    activeLoans,
    totalRepaid,
    overdueLoans,
    setStats,
  };
});
