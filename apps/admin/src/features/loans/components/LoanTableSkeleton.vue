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
            <th v-for="i in 6" :key="i" class="px-6 py-4">
              <BaseSkeleton width="80px" height="0.75rem" />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="i in 8" :key="i">
            <td class="px-6 py-4">
              <div class="space-y-1.5">
                <BaseSkeleton width="100px" height="1rem" />
                <BaseSkeleton width="60px" height="0.65rem" />
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <BaseSkeleton width="2rem" height="2rem" rounded="9999px" />
                <BaseSkeleton width="120px" height="0.85rem" />
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="space-y-1.5">
                <BaseSkeleton width="100px" height="1rem" />
                <BaseSkeleton width="120px" height="0.65rem" />
              </div>
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="90px" height="1.25rem" rounded="9999px" />
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="80px" height="0.75rem" />
            </td>
            <td class="px-6 py-4 text-right">
              <BaseSkeleton width="100px" height="2rem" rounded="0.5rem" className="ml-auto" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards Skeleton -->
    <div class="md:hidden divide-y divide-slate-100">
      <div v-for="i in 5" :key="i" class="p-4 space-y-4">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
             <BaseSkeleton width="2.5rem" height="2.5rem" rounded="9999px" />
             <div class="space-y-1.5">
               <BaseSkeleton width="120px" height="1rem" />
               <BaseSkeleton width="100px" height="0.65rem" />
             </div>
          </div>
          <BaseSkeleton width="80px" height="2rem" rounded="0.5rem" />
        </div>
        <div class="flex justify-between items-end">
          <div class="space-y-1.5">
            <BaseSkeleton width="100px" height="1rem" />
            <BaseSkeleton width="120px" height="0.65rem" />
          </div>
          <div class="flex flex-col items-end gap-1.5">
             <BaseSkeleton width="70px" height="1.25rem" rounded="9999px" />
             <BaseSkeleton width="60px" height="0.65rem" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
