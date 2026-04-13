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
      path: '/register',
      name: 'register',
      component: () => import('../features/auth/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../features/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../features/auth/ResetPasswordView.vue'),
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('../features/auth/VerifyEmailView.vue'),
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
        // ── Loans ──────────────────────────────────────────────────────────
        {
          path: 'loans',
          name: 'loans',
          component: () => import('../features/loans/MyLoansView.vue'),
        },
        {
          // must be before :id to avoid conflict
          path: 'loans/apply',
          name: 'loan-apply',
          component: () => import('../features/loans/apply/LoanApplicationView.vue'),
        },
        {
          path: 'loans/:id',
          name: 'loan-detail',
          component: () => import('../features/loans/LoanDetailView.vue'),
        },
        {
          path: 'loan-history',
          name: 'loan-history',
          component: () => import('../views/ComingSoonView.vue'),
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('../features/transactions/TransactionsView.vue'),
        },
        // ── Other sections ─────────────────────────────────────────────────
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../features/profile/ProfileView.vue'),
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
