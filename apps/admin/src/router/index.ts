import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../features/dashboard/DashboardView.vue";
import { useAuthStore } from "../features/auth/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../features/auth/LoginView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/loans",
      name: "loans",
      component: () => import("../features/loans/LoansView.vue"),
    },
    {
      path: "/loans/:id",
      name: "admin-loan-detail",
      component: () => import("../features/loans/AdminLoanDetailView.vue"),
    },
    {
      path: "/collections",
      name: "collections",
      component: () => import("../features/collections/CollectionsView.vue"),
    },
    {
      path: "/reports",
      name: "reports",
      component: () => import("../features/reports/ReportsView.vue"),
    },
    {
      path: "/audit-logs",
      name: "audit-logs",
      component: () => import("../features/audit/AuditLogsView.vue"),
    },
    {
      path: "/kyc",
      name: "kyc",
      component: () => import("../features/kyc/KycView.vue"),
    },
    {
      path: "/kyc/:id",
      name: "kyc-detail",
      component: () => import("../features/kyc/KycDetailView.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../features/users/UsersView.vue"),
    },
    {
      path: "/admins",
      name: "admins",
      component: () => import("../features/admins/AdminsView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../features/settings/SettingsView.vue"),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // By default all routes require auth unless explicitly set to false
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    next({ name: "login" });
  } else if (to.name === "login" && authStore.isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
