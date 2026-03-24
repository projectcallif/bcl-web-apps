import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', () => {
  const totalUsers = ref(0)
  const activeUsers = ref(0)
  const inactiveUsers = computed(() => totalUsers.value - activeUsers.value)

  function setStats(total: number, active: number) {
    totalUsers.value = total
    activeUsers.value = active
  }

  return { totalUsers, activeUsers, inactiveUsers, setStats }
})
