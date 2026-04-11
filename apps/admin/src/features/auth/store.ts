import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User, LoginPayload } from "@bcl/types";

const TOKEN_KEY = "bcl_admin_token";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => token.value !== null);

  async function login(payload: LoginPayload): Promise<void> {
    // Mock API call to unblock UI construction
    return new Promise((resolve) => {
      setTimeout(() => {
        token.value = "mock-admin-token-123";
        user.value = {
          id: "admin_1",
          email: payload.identifier || "admin@bcl.com",
          isEmailVerified: true,
          isPhoneVerified: true,
          status: "ACTIVE",
          phone: "",
          profile: {
            firstName: "Super",
            lastName: "Admin",
            dateOfBirth: "",
            gender: "MALE",
            maritalStatus: "SINGLE",
            city: "",
            state: "",
            country: "",
            middleName: "",
          },
          registrationStep: "COMPLETE",
        };
        localStorage.setItem(TOKEN_KEY, token.value);
        resolve();
      }, 800);
    });
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  return { token, user, isAuthenticated, login, logout };
});
