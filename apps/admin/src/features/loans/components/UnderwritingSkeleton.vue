<script setup lang="ts">
import { BaseSkeleton } from "@bcl/ui";
</script>

<template>
  <div class="flex flex-col gap-6 max-w-7xl mx-auto w-full">
    <!-- Header Skeleton -->
    <div class="flex items-center gap-4 flex-wrap justify-between">
      <div class="flex items-center gap-4">
        <BaseSkeleton width="40px" height="40px" rounded="0.5rem" />
        <div class="space-y-2">
          <BaseSkeleton width="200px" height="1.75rem" />
          <BaseSkeleton width="250px" height="0.85rem" />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <BaseSkeleton width="160px" height="2.5rem" rounded="0.5rem" />
        <BaseSkeleton width="180px" height="2.5rem" rounded="0.5rem" />
      </div>
    </div>

    <!-- Main Grid Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Customer Info Card Skeleton -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <BaseSkeleton width="180px" height="1rem" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div v-for="i in 4" :key="i" class="space-y-2">
              <BaseSkeleton width="80px" height="0.75rem" />
              <BaseSkeleton width="100%" height="1.25rem" />
            </div>
          </div>
        </div>

        <!-- Documents Card Skeleton -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <BaseSkeleton width="200px" height="1rem" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="i in 4" :key="i" class="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-3">
                <BaseSkeleton width="2.5rem" height="2.5rem" rounded="0.5rem" />
                <BaseSkeleton width="140px" height="0.85rem" />
              </div>
              <div class="flex gap-2">
                <BaseSkeleton width="24px" height="24px" rounded="0.25rem" />
                <BaseSkeleton width="24px" height="24px" rounded="0.25rem" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column Skeleton -->
      <div class="flex flex-col gap-6">
        <div class="bg-slate-900 rounded-2xl p-6 shadow-xl space-y-8">
          <BaseSkeleton width="160px" height="1rem" className="opacity-20" />
          <div class="flex justify-center py-4">
            <BaseSkeleton width="120px" height="120px" rounded="9999px" className="opacity-10" />
          </div>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center gap-3">
              <BaseSkeleton width="16px" height="16px" rounded="9999px" className="opacity-20" />
              <BaseSkeleton width="80%" height="0.75rem" className="opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
