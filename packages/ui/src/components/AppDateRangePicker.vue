<script setup lang="ts">
import { ref, watch } from 'vue';
import { Calendar } from 'lucide-vue-next';
import AppPopover from './AppPopover.vue';

export interface DateRange {
  start: string;
  end: string;
}

const props = defineProps<{
  modelValue?: DateRange;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRange): void;
}>();

const startDate = ref(props.modelValue?.start || '');
const endDate = ref(props.modelValue?.end || '');

function emitRange() {
  emit('update:modelValue', {
    start: startDate.value,
    end: endDate.value
  });
}

function clear() {
  startDate.value = '';
  endDate.value = '';
  emit('update:modelValue', { start: '', end: '' });
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    startDate.value = newVal.start;
    endDate.value = newVal.end;
  } else {
    startDate.value = '';
    endDate.value = '';
  }
}, { deep: true });
</script>

<template>
  <AppPopover>
    <template #trigger>
      <button class="bg-white border border-slate-200 text-slate-600 shadow-sm px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto overflow-hidden focus:outline-none cursor-pointer">
        <Calendar class="w-4 h-4 shrink-0 text-slate-400" />
        <span class="truncate">
          <template v-if="startDate && endDate">
            {{ startDate }} &rarr; {{ endDate }}
          </template>
          <template v-else-if="startDate">
            From {{ startDate }}
          </template>
          <template v-else-if="endDate">
            Until {{ endDate }}
          </template>
          <template v-else>
            {{ placeholder || 'Filter by Date Range' }}
          </template>
        </span>
      </button>
    </template>
    
    <template #content>
      <div class="p-4 w-72 flex flex-col gap-4">
        <h4 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Select Date Range</h4>
        
        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
            <input 
              type="date" 
              v-model="startDate"
              class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
            <input 
              type="date" 
              v-model="endDate"
              class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono cursor-pointer"
            />
          </div>
        </div>

        <div class="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
           <button @click="clear" class="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1 cursor-pointer">Clear Range</button>
           <button @click="emitRange" class="text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Apply Filter</button>
        </div>
      </div>
    </template>
  </AppPopover>
</template>
