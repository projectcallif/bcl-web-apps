<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:currentPage': [page: number] }>()

const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems))

const pageNumbers = computed((): (number | '...')[] => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function go(page: number) {
  if (page >= 1 && page <= props.totalPages) emit('update:currentPage', page)
}
</script>

<template>
  <div class="flex items-center justify-between">
    <p class="text-sm text-slate-500">
      Showing <span class="font-medium text-slate-700">{{ startItem }}–{{ endItem }}</span>
      of <span class="font-medium text-slate-700">{{ totalItems }}</span> results
    </p>

    <div class="flex items-center gap-1">
      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
        :class="currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'"
        :disabled="currentPage === 1"
        @click="go(currentPage - 1)"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <template v-for="(page, i) in pageNumbers" :key="i">
        <span v-if="page === '...'" class="w-8 h-8 flex items-center justify-center text-sm text-slate-400">…</span>
        <button
          v-else
          class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
          :class="page === currentPage
            ? 'bg-primary text-white'
            : 'text-slate-600 hover:bg-slate-100'"
          @click="go(page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
        :class="currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'"
        :disabled="currentPage === totalPages"
        @click="go(currentPage + 1)"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
