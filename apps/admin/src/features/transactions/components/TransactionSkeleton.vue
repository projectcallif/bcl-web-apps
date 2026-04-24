<script setup lang="ts">
import { BaseSkeleton } from "@bcl/ui";
</script>

<template>
  <div>
    <!-- Desktop Table Skeleton -->
    <div class="hidden md:block w-full overflow-x-auto">
      <table class="w-full text-sm min-w-200">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50">
            <th v-for="i in 7" :key="i" class="px-6 py-4">
              <BaseSkeleton width="80px" height="0.75rem" />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="i in 8" :key="i">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <BaseSkeleton
                  width="2.25rem"
                  height="2.25rem"
                  rounded="9999px"
                />
                <div class="space-y-1.5">
                  <BaseSkeleton width="120px" height="1rem" />
                  <BaseSkeleton width="80px" height="0.75rem" />
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="100px" height="1rem" />
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="140px" height="0.75rem" />
            </td>
            <td class="px-6 py-4">
              <BaseSkeleton width="120px" height="1.5rem" rounded="0.5rem" />
            </td>
            <td class="px-6 py-4 text-right">
              <BaseSkeleton width="80px" height="1rem" className="ml-auto" />
            </td>
            <td class="px-6 py-4 text-center">
              <BaseSkeleton width="80px" height="1rem" className="mx-auto" />
            </td>
            <td class="px-6 py-4 text-right">
              <BaseSkeleton width="60px" height="1.5rem" className="ml-auto" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile View Skeleton -->
    <div class="md:hidden divide-y divide-slate-100">
      <div v-for="i in 5" :key="i" class="p-4 space-y-4">
        <div class="flex items-center gap-3">
          <BaseSkeleton width="2.5rem" height="2.5rem" rounded="9999px" />
          <div class="flex-1 space-y-2">
            <BaseSkeleton width="60%" height="1rem" />
            <BaseSkeleton width="40%" height="0.75rem" />
          </div>
        </div>
        <div
          class="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl"
        >
          <BaseSkeleton width="80px" height="1rem" />
          <BaseSkeleton width="60px" height="1.5rem" rounded="0.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>
