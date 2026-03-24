<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboard = useDashboardStore()

onMounted(() => {
  // Simulate loading stats
  dashboard.setStats(142, 98)
})
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-value">{{ dashboard.totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Users</h3>
        <p class="stat-value active">{{ dashboard.activeUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>Inactive Users</h3>
        <p class="stat-value inactive">{{ dashboard.inactiveUsers }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard h1 {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.stat-card h3 {
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-value.active {
  color: #38a169;
}

.stat-value.inactive {
  color: #e53e3e;
}
</style>
