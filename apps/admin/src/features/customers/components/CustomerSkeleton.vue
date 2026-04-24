<script setup lang="ts">
import { BaseSkeleton } from "@bcl/ui";
</script>

<template>
  <div class="w-full">
    <!-- Desktop Skeleton -->
    <div class="hidden md:block">
      <table class="w-full text-left text-sm border-collapse min-w-200">
        <thead class="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
          <tr>
            <th scope="col" class="px-6 py-4 font-medium"><BaseSkeleton width="100px" height="0.75rem" /></th>
            <th scope="col" class="px-6 py-4 font-medium"><BaseSkeleton width="60px" height="0.75rem" /></th>
            <th scope="col" class="px-6 py-4 font-medium"><BaseSkeleton width="120px" height="0.75rem" /></th>
            <th scope="col" class="px-6 py-4 font-medium"><BaseSkeleton width="60px" height="0.75rem" /></th>
            <th scope="col" class="px-6 py-4 font-medium text-right"><BaseSkeleton width="40px" height="0.75rem" className="ml-auto" /></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="i in 5" :key="i">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <BaseSkeleton width="2.25rem" height="2.25rem" rounded="9999px" />
                <div class="space-y-2">
                  <BaseSkeleton width="140px" height="0.85rem" />
                  <BaseSkeleton width="200px" height="0.65rem" />
                </div>
              </div>
            </td>
            <td class="px-6 py-4"><BaseSkeleton width="80px" height="1.5rem" rounded="9999px" /></td>
            <td class="px-6 py-4"><BaseSkeleton width="160px" height="0.75rem" /></td>
            <td class="px-6 py-4"><BaseSkeleton width="100px" height="0.75rem" /></td>
            <td class="px-6 py-4 text-right">
              <BaseSkeleton width="32px" height="32px" rounded="0.5rem" className="ml-auto" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Skeleton -->
    <div class="md:hidden divide-y divide-slate-100">
      <div v-for="i in 3" :key="i" class="p-4 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <BaseSkeleton width="2.5rem" height="2.5rem" rounded="9999px" />
          <div class="space-y-1.5 flex-1">
            <BaseSkeleton width="160px" height="1rem" />
            <BaseSkeleton width="200px" height="0.75rem" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <BaseSkeleton width="70px" height="1.25rem" rounded="9999px" />
            <BaseSkeleton width="120px" height="0.75rem" />
          </div>
          <BaseSkeleton width="32px" height="32px" rounded="0.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>
