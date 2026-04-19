<script setup lang="ts">
import { BaseSkeleton } from '@bcl/ui'
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
    <!-- Row 1: type + status -->
    <div class="flex items-start justify-between mb-3">
      <div class="space-y-2">
        <BaseSkeleton width="120px" height="1.25rem" />
        <BaseSkeleton width="80px" height="0.75rem" />
      </div>
      <BaseSkeleton width="70px" height="1.5rem" rounded="9999px" />
    </div>

    <!-- Summary -->
    <div class="mb-4">
      <BaseSkeleton width="150px" height="0.75rem" />
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="space-y-1.5">
        <BaseSkeleton width="40px" height="0.65rem" />
        <BaseSkeleton width="80%" height="1rem" />
      </div>
      <div class="space-y-1.5">
        <BaseSkeleton width="40px" height="0.65rem" />
        <BaseSkeleton width="80%" height="1rem" />
      </div>
      <div class="space-y-1.5">
        <BaseSkeleton width="40px" height="0.65rem" />
        <BaseSkeleton width="80%" height="1rem" />
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mb-4">
      <div class="flex justify-between mb-1.5">
        <BaseSkeleton width="60px" height="0.65rem" />
        <BaseSkeleton width="60px" height="0.65rem" />
      </div>
      <BaseSkeleton width="100%" height="0.375rem" rounded="9999px" />
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-slate-100">
      <div class="flex items-center gap-2">
        <BaseSkeleton width="1rem" height="1rem" rounded="0.25rem" />
        <BaseSkeleton width="140px" height="0.75rem" />
      </div>
      <BaseSkeleton width="80px" height="0.75rem" />
    </div>
  </div>
</template>
