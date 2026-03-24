import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import { useAuthStore } from '../features/auth/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../features/auth/LoginView.vue'),
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../features/dashboard/DashboardView.vue'),
        },
        {
          path: 'loans',
          name: 'loans',
          component: () => import('../views/ComingSoonView.vue'),
        },
        {
          path: 'loan-history',
          name: 'loan-history',
          component: () => import('../views/ComingSoonView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ComingSoonView.vue'),
        },
        {
          path: 'support',
          name: 'support',
          component: () => import('../views/ComingSoonView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/ComingSoonView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
