import { ref } from "vue";
import { defineStore } from "pinia";
import type { CustomerListItem, CustomerDetail } from "@bcl/types";
import {
  getCustomers as getCustomersApi,
  getCustomerById as getCustomerByIdApi,
  updateCustomerStatus as updateCustomerStatusApi,
} from "./api";
import { useToastStore } from "@/stores/toast";

export const useCustomersStore = defineStore("customers", () => {
  const customers = ref<CustomerListItem[]>([]);
  const currentCustomer = ref<CustomerDetail | null>(null);
  const meta = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const toast = useToastStore();

  async function fetchCustomers(page = 1, limit = 10, search = "") {
    try {
      loading.value = true;
      error.value = null;
      const response = await getCustomersApi({ page, limit, search });
      customers.value = response.data.data;
      meta.value = response.data.meta;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : "Failed to fetch customers";
    } finally {
      loading.value = false;
    }
  }

  async function fetchCustomerById(id: string) {
    try {
      loading.value = true;
      error.value = null;
      currentCustomer.value = null; // Clear previous data
      const response = await getCustomerByIdApi(id);
      currentCustomer.value = response.data;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : "Failed to fetch customer details";
    } finally {
      loading.value = false;
    }
  }
  async function updateCustomerStatus(id: string, status: string) {
    try {
      loading.value = true;
      const response = await updateCustomerStatusApi(id, { status });

      // Update in list
      const idx = customers.value.findIndex((c) => c.id === id);
      if (idx !== -1) {
        customers.value[idx] = {
          ...customers.value[idx],
          status: response.data.status,
        };
      }

      // Update in detail if open
      if (currentCustomer.value && currentCustomer.value.id === id) {
        currentCustomer.value.status = response.data.status;
      }

      toast.success("Customer status updated successfully");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update status";
      toast.error(msg);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    customers,
    currentCustomer,
    meta,
    loading,
    error,
    fetchCustomers,
    fetchCustomerById,
    updateCustomerStatus,
  };
});
