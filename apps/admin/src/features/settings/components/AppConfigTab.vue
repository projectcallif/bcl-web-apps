<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AppTextInput, BaseButton, AppSwitch, BaseSkeleton } from "@bcl/ui";
import { Settings, ShieldCheck, RefreshCw, AlertCircle } from "lucide-vue-next";
import { type AppConfig, type ApiClientError } from "@bcl/types";
import { useToastStore } from "@/stores/toast";
import { getAppConfigs, setAppConfig } from "../api";

const toastStore = useToastStore();

// ── State ──────────────────────────────────────────────────────────────────────

const configs = ref<AppConfig[]>([]);
const loading = ref(true);
const saving = ref<Record<string, boolean>>({});

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function fetchConfigs() {
  loading.value = true;
  try {
    const res = await getAppConfigs();
    configs.value = res.data;
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(
      error.message || "Failed to load application configurations",
    );
  } finally {
    loading.value = false;
  }
}

onMounted(fetchConfigs);

// ── Actions ────────────────────────────────────────────────────────────────────

async function handleUpdate(
  config: AppConfig,
  updates: { value?: string; isPublic?: boolean },
) {
  const key = config.key;

  // Store old values for potential reversion
  const oldValue = config.value;
  const oldIsPublic = config.isPublic;

  // Optimistic update: Update local state immediately
  const index = configs.value.findIndex((c) => c.key === key);
  if (index !== -1) {
    if (updates.value !== undefined) configs.value[index].value = updates.value;
    if (updates.isPublic !== undefined)
      configs.value[index].isPublic = updates.isPublic;
  }

  saving.value[key] = true;
  try {
    const payload = {
      value: updates.value !== undefined ? updates.value : oldValue,
      description: config.description,
      isPublic: updates.isPublic !== undefined ? updates.isPublic : oldIsPublic,
    };
    await setAppConfig(key, payload);
    toastStore.success(`${key.replace(/_/g, " ")} updated successfully`);
  } catch (err) {
    const error = err as ApiClientError;
    toastStore.error(error.message || `Failed to update ${key}`);

    // Revert local state on failure
    if (index !== -1) {
      configs.value[index].value = oldValue;
      configs.value[index].isPublic = oldIsPublic;
    }
  } finally {
    saving.value[key] = false;
  }
}

function isBoolean(val: string) {
  return val === "true" || val === "false";
}

function parseBoolean(val: string) {
  return val === "true";
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100"
    >
      <div>
        <h2
          class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2"
        >
          <Settings class="w-5 h-5 text-primary" />
          Application Configuration
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Manage global system flags, disbursement thresholds, and service
          parameters.
        </p>
      </div>
      <BaseButton
        variant="ghost"
        size="sm"
        @click="fetchConfigs"
        :disabled="loading"
      >
        <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
        Refresh Config
      </BaseButton>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-6">
      <div v-if="loading && configs.length === 0" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="p-4 border border-slate-100 rounded-xl space-y-3"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <BaseSkeleton width="180px" height="1.25rem" />
              <BaseSkeleton width="240px" height="0.875rem" />
            </div>
            <BaseSkeleton width="40px" height="24px" rounded="12px" />
          </div>
        </div>
      </div>

      <div v-else-if="configs.length === 0" class="py-12 text-center">
        <div class="flex flex-col items-center gap-2 opacity-30">
          <AlertCircle class="w-12 h-12" />
          <p class="font-medium">No application configurations found.</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="config in configs"
          :key="config.key"
          class="group p-5 bg-white border border-slate-100 rounded-2xl hover:border-primary-100 hover:shadow-sm transition-all"
        >
          <div
            class="flex flex-col xl:flex-row xl:items-center justify-between gap-4"
          >
            <div class="flex items-start gap-4 flex-1">
              <div
                class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors"
              >
                <ShieldCheck class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  class="text-sm font-bold text-slate-800 tracking-tight break-all uppercase"
                >
                  {{ config.key.replace(/_/g, " ") }}
                </h3>
                <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                  {{ config.description }}
                </p>
                <!-- <div class="mt-2 flex items-center gap-3">
                  <span
                    class="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase"
                  >
                    Key: {{ config.key }}
                  </span>
                </div> -->
              </div>
            </div>

            <div
              class="flex items-center gap-4 shrink-0 sm:pl-4 sm:border-l border-slate-100"
            >
              <!-- Public Toggle -->
              <div
                class="flex flex-col items-center gap-1.5 px-4 border-r border-slate-50"
              >
                <span
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                  >Public</span
                >
                <AppSwitch
                  :model-value="config.isPublic"
                  @update:model-value="
                    (val) => handleUpdate(config, { isPublic: val })
                  "
                  :disabled="saving[config.key]"
                />
              </div>

              <!-- Boolean Switch -->
              <div
                v-if="isBoolean(config.value)"
                class="flex flex-col items-end gap-1.5"
              >
                <AppSwitch
                  :model-value="parseBoolean(config.value)"
                  @update:model-value="
                    (val) => handleUpdate(config, { value: val.toString() })
                  "
                  :disabled="saving[config.key]"
                />
                <span
                  class="text-[10px] font-bold"
                  :class="
                    parseBoolean(config.value)
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  "
                >
                  {{ parseBoolean(config.value) ? "ENABLED" : "DISABLED" }}
                </span>
              </div>

              <!-- Text/Number Input -->
              <div v-else class="flex items-center gap-2">
                <AppTextInput
                  :id="config.key"
                  :model-value="config.value"
                  @update:model-value="
                    (val) => handleUpdate(config, { value: val })
                  "
                  placeholder="Enter value..."
                  class="max-w-48"
                  :disabled="saving[config.key]"
                />
                <div
                  v-if="saving[config.key]"
                  class="animate-spin text-primary"
                >
                  <RefreshCw class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
