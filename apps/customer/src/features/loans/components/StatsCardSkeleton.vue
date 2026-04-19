<script setup lang="ts">
import { BaseSkeleton } from '@bcl/ui'
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-5">
    <div class="flex items-center justify-between mb-3">
      <BaseSkeleton width="80px" height="0.75rem" />
      <BaseSkeleton width="2rem" height="2rem" rounded="0.75rem" />
    </div>
    <BaseSkeleton width="60%" height="2rem" className="mb-2" />
    <BaseSkeleton width="40%" height="0.75rem" />
  </div>
</template>
