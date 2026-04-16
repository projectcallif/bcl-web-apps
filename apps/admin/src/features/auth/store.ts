import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Admin, LoginPayload } from "@bcl/types";
import { login as loginApi } from "./api";

const TOKEN_KEY = "bcl_admin_token";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<Admin | null>(null);

  const isAuthenticated = computed(() => token.value !== null);

  async function login(payload: LoginPayload): Promise<void> {
    const response = await loginApi({
      email: payload.identifier,
      password: payload.password,
    });
    token.value = response.data.accessToken;
    user.value = response.data.admin;
    localStorage.setItem(TOKEN_KEY, token.value);
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  return { token, user, isAuthenticated, login, logout };
});
