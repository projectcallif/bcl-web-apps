import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", () => {
  const totalCustomers = ref(0);
  const activeCustomers = ref(0);
  const inactiveCustomers = computed(() => totalCustomers.value - activeCustomers.value);

  function setStats(total: number, active: number) {
    totalCustomers.value = total;
    activeCustomers.value = active;
  }

  return { totalCustomers, activeCustomers, inactiveCustomers, setStats };
});
