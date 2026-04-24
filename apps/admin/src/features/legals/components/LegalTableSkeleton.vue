<script setup lang="ts">
import { BaseSkeleton } from "@bcl/ui";
</script>

<template>
  <div class="w-full">
    <!-- Desktop Table Skeleton -->
    <div class="hidden md:block w-full overflow-x-auto">
      <table class="w-full text-left text-sm min-w-225">
        <thead class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
          <tr>
            <th v-for="i in 5" :key="i" class="px-6 py-4">
              <BaseSkeleton width="80px" height="0.75rem" />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="i in 5" :key="i">
            <td class="px-6 py-4">
              <div class="space-y-1.5">
                <BaseSkeleton width="200px" height="1rem" />
                <BaseSkeleton width="120px" height="0.65rem" />
              </div>
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="120px" height="1.25rem" rounded="9999px" />
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="80px" height="0.85rem" />
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="90px" height="0.85rem" />
            </td>
            <td class="px-6 py-4 text-right">
              <BaseSkeleton width="80px" height="2rem" rounded="0.5rem" className="ml-auto" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards Skeleton -->
    <div class="md:hidden divide-y divide-slate-100">
      <div v-for="i in 3" :key="i" class="p-4 space-y-4">
        <div class="flex justify-between items-start">
          <div class="space-y-1.5">
            <BaseSkeleton width="180px" height="1rem" />
            <BaseSkeleton width="140px" height="0.75rem" />
          </div>
          <BaseSkeleton width="70px" height="1.25rem" rounded="9999px" />
        </div>
        <div class="flex justify-between items-center pt-2">
          <BaseSkeleton width="100px" height="0.85rem" />
          <BaseSkeleton width="80px" height="1.5rem" rounded="0.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>
