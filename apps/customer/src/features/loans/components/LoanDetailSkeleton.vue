<script setup lang="ts">
import { BaseSkeleton } from '@bcl/ui'
</script>

<template>
  <div class="space-y-6">
    <!-- Loan header card skeleton -->
    <div class="relative bg-primary/20 rounded-2xl p-6 overflow-hidden border border-primary/10">
      <div class="relative flex items-start justify-between mb-5">
        <BaseSkeleton width="100px" height="0.75rem" rounded="4px" className="bg-primary/20" />
        <BaseSkeleton width="80px" height="1.5rem" rounded="9999px" className="bg-primary/20" />
      </div>

      <div class="relative grid grid-cols-2 gap-6 mb-5">
        <div class="space-y-2">
          <BaseSkeleton width="140px" height="0.65rem" className="bg-primary/20" />
          <BaseSkeleton width="200px" height="2.5rem" className="bg-primary/20" />
        </div>
        <div class="self-end space-y-2">
          <div class="flex justify-between">
            <BaseSkeleton width="60px" height="0.65rem" className="bg-primary/20" />
          </div>
          <BaseSkeleton width="100%" height="0.375rem" rounded="9999px" className="bg-primary/20" />
        </div>
      </div>

      <div class="relative grid grid-cols-4 gap-4 pt-5 border-t border-white/10">
        <div v-for="i in 4" :key="i" class="space-y-1.5">
          <BaseSkeleton width="80px" height="0.65rem" className="bg-primary/20" />
          <BaseSkeleton width="100px" height="1rem" className="bg-primary/20" />
        </div>
      </div>
    </div>

    <!-- Quick info card skeleton -->
    <div class="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
      <div class="space-y-2">
        <BaseSkeleton width="140px" height="1rem" />
        <BaseSkeleton width="220px" height="0.75rem" />
      </div>
      <BaseSkeleton width="140px" height="2.5rem" rounded="0.75rem" />
    </div>

    <!-- Tabs container skeleton -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
      <div class="flex border-b border-slate-100">
        <div class="px-6 py-4 border-b-2 border-primary">
          <BaseSkeleton width="120px" height="1rem" />
        </div>
        <div class="px-6 py-4 border-b-2 border-transparent">
          <BaseSkeleton width="120px" height="1rem" />
        </div>
      </div>

      <div class="p-6 space-y-4">
        <!-- Table-like skeletons -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-50">
          <BaseSkeleton width="20%" height="0.75rem" />
          <BaseSkeleton width="20%" height="0.75rem" />
          <BaseSkeleton width="20%" height="0.75rem" />
          <BaseSkeleton width="20%" height="0.75rem" />
        </div>
        <div v-for="i in 5" :key="i" class="flex items-center justify-between py-1">
          <BaseSkeleton width="15%" height="1rem" />
          <BaseSkeleton width="25%" height="1rem" />
          <BaseSkeleton width="20%" height="1rem" />
          <BaseSkeleton width="15%" height="1rem" />
        </div>
      </div>
    </div>
  </div>
</template>
