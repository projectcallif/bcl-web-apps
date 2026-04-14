<script setup lang="ts">
import { computed } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { Calendar } from "lucide-vue-next";

interface Props {
  modelValue?: Date | Date[] | string | string[] | null;
  range?: boolean;
  placeholder?: string;
  format?: string | ((date: Date) => string);
  disabled?: boolean;
  id?: string;
  presets?: { label: string; value: Date | Date[] }[];
  enableTimePicker?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  range: false,
  placeholder: "Select Date",
  disabled: false,
  enableTimePicker: false,
});

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: Date | Date[] | string | string[] | null,
  ): void;
}>();

const date = computed({
  get: () => props.modelValue ?? null,
  set: (val) => emit("update:modelValue", val),
});

// Default presets if range is true and no presets provided
const internalPresets = computed(() => {
  if (!props.range) return [];
  if (props.presets) return props.presets;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return [
    { label: "Today", value: [now, now] },
    {
      label: "Last 7 Days",
      value: [new Date(new Date().setDate(now.getDate() - 7)), now],
    },
    {
      label: "Last 30 Days",
      value: [new Date(new Date().setDate(now.getDate() - 30)), now],
    },
    {
      label: "This Year",
      value: [new Date(now.getFullYear(), 0, 1), now],
    },
  ];
});
</script>

<template>
  <div class="app-date-picker relative w-full group">
    <VueDatePicker
      v-model="date"
      :range="range"
      :placeholder="placeholder"
      :disabled="disabled"
      :id="id"
      :enable-time-picker="enableTimePicker"
      :format="format"
      :preset-dates="internalPresets"
      text-input
      auto-apply
      :close-on-auto-apply="true"
    >
      <!-- Custom Trigger / Input styling -->
      <template
        #dp-input="{ value, onEnter, onTab, openMenu, onFocus, onBlur }"
      >
        <div class="relative group">
          <input
            :id="id"
            type="text"
            readonly
            :value="value"
            :placeholder="placeholder"
            :disabled="disabled"
            class="bg-white border border-slate-300 text-slate-700 text-sm rounded-xl focus:border-primary focus:ring-3 focus:ring-primary-100 block w-full pl-10 pr-3.5 py-2.5 shadow-sm outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-slate-400"
            @click="openMenu"
            @focus="onFocus"
            @blur="onBlur"
            @keydown.enter="onEnter"
            @keydown.tab="onTab"
          />
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-hover:text-slate-500 transition-colors"
          >
            <Calendar class="w-4 h-4" />
          </div>
        </div>
      </template>

      <!-- Styling the picker internals -->
      <template #action-row v-if="range">
        <!-- We use auto-apply so action row is mostly for range info if needed -->
      </template>
    </VueDatePicker>
  </div>
</template>

<style>
/* 
  VueDatePicker theme overrides 
  We use CSS variables to match BCL's primary/slate palette
*/
:root {
  --dp-font-family: inherit;
  --dp-border-radius: 12px;
  --dp-primary-color: #3a42cc; /* primary-500 */
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #f1f5f9; /* slate-100 */
  --dp-menu-border-color: #f1f5f9;
  --dp-border-color: #e2e8f0; /* slate-200 */
  --dp-hover-color: #f8fafc; /* slate-50 */
  --dp-hover-text-color: #1e293b; /* slate-800 */
  --dp-text-color: #334155; /* slate-700 */
  --dp-background-color: #ffffff;
}

.dp__menu {
  border: 1px solid #f1f5f9 !important;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
  font-family: inherit !important;
  padding: 8px !important;
}

.dp__calendar_header_item {
  font-weight: 600 !important;
  color: #64748b !important; /* slate-500 */
  font-size: 0.75rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
}

.dp__cell_inner {
  font-size: 0.875rem !important;
  border-radius: 8px !important;
}

.dp__today {
  border: 1px solid var(--dp-primary-color) !important;
}

.dp__range_start,
.dp__range_end {
  background: var(--dp-primary-color) !important;
}

.dp__range_between {
  background: #edeeff !important; /* primary-50 */
  color: #3a42cc !important;
}

.dp__preset_btns {
  padding: 8px !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  border-right: 1px solid #f1f5f9 !important;
}

.dp__preset_btn {
  background: #f8fafc !important;
  border: 1px solid #f1f5f9 !important;
  border-radius: 8px !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  padding: 6px 10px !important;
  transition: all 0.2s !important;
}

.dp__preset_btn:hover {
  background: #edeeff !important;
  border-color: #b1b4ff !important;
  color: #3a42cc !important;
}
</style>
