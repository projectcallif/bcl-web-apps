import { ref } from "vue";
import { defineStore } from "pinia";
import type { Admin, CreateAdminPayload, UserStatus } from "@bcl/types";
import {
  getAdmins as getAdminsApi,
  createAdmin as createAdminApi,
  updateAdminStatus as updateAdminStatusApi,
} from "./api";

export const useAdminsStore = defineStore("admins", () => {
  const admins = ref<Admin[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAdmins() {
    try {
      loading.value = true;
      error.value = null;
      const response = await getAdminsApi();
      admins.value = response.data;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to fetch admins";
    } finally {
      loading.value = false;
    }
  }

  async function createAdmin(payload: CreateAdminPayload) {
    try {
      loading.value = true;
      const response = await createAdminApi(payload);
      // Re-fetch to ensure we have the full object with status and dates from server
      await fetchAdmins();
      return response.data;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to create admin";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(id: string, status: UserStatus) {
    try {
      loading.value = true;
      const response = await updateAdminStatusApi(id, { status });
      const index = admins.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        // Update local state with response data
        admins.value[index] = { ...admins.value[index], status: response.data.status };
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to update admin status";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    createAdmin,
    updateStatus,
  };
});
