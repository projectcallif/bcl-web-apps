<script setup lang="ts">
import { BaseSkeleton } from '@bcl/ui'
</script>

<template>
  <div>
    <!-- Mobile List Skeleton (Hidden on md+) -->
    <div class="md:hidden divide-y divide-slate-50">
      <div v-for="i in 5" :key="i" class="p-4 space-y-3">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2.5">
            <BaseSkeleton width="2.25rem" height="2.25rem" rounded="0.75rem" />
            <div class="space-y-1.5">
              <BaseSkeleton width="100px" height="1rem" />
              <BaseSkeleton width="140px" height="0.65rem" />
            </div>
          </div>
          <div class="text-right space-y-1.5">
            <BaseSkeleton width="80px" height="1rem" />
            <BaseSkeleton width="60px" height="0.65rem" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <BaseSkeleton width="80px" height="0.65rem" />
          <BaseSkeleton width="60px" height="0.65rem" />
        </div>
      </div>
    </div>

    <!-- Desktop Table Skeleton -->
    <div class="hidden md:block w-full overflow-x-auto">
      <table class="w-full text-sm min-w-200">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50">
            <th v-for="i in 7" :key="i" class="px-5 py-3">
              <BaseSkeleton width="60px" height="0.75rem" />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="i in 5" :key="i">
            <td class="px-5 py-3.5"><BaseSkeleton width="100px" height="1rem" /></td>
            <td class="px-5 py-3.5"><BaseSkeleton width="160px" height="0.75rem" /></td>
            <td class="px-5 py-3.5"><BaseSkeleton width="120px" height="1.5rem" rounded="0.5rem" /></td>
            <td class="px-5 py-3.5">
              <div class="space-y-1.5">
                <BaseSkeleton width="80%" height="0.85rem" />
                <BaseSkeleton width="60%" height="0.75rem" />
              </div>
            </td>
            <td class="px-5 py-3.5"><BaseSkeleton width="100%" height="0.75rem" /></td>
            <td class="px-5 py-3.5 text-right"><BaseSkeleton width="80px" height="1rem" className="ml-auto" /></td>
            <td class="px-5 py-3.5"><BaseSkeleton width="80px" height="1rem" className="mx-auto" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
