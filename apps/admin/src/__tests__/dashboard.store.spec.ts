import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDashboardStore } from '../stores/dashboard'

describe('Dashboard Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initialises with zero stats', () => {
    const dashboard = useDashboardStore()
    expect(dashboard.totalUsers).toBe(0)
    expect(dashboard.activeUsers).toBe(0)
  })

  it('computes inactiveUsers correctly', () => {
    const dashboard = useDashboardStore()
    dashboard.setStats(100, 60)
    expect(dashboard.inactiveUsers).toBe(40)
  })

  it('updates stats via setStats', () => {
    const dashboard = useDashboardStore()
    dashboard.setStats(200, 150)
    expect(dashboard.totalUsers).toBe(200)
    expect(dashboard.activeUsers).toBe(150)
    expect(dashboard.inactiveUsers).toBe(50)
  })
})
