<script setup lang="ts">
import { AppToast } from '@bcl/ui'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<template>
  <div class="fixed top-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-400 ease-out"
      enter-from-class="transform translate-x-10 opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-10 opacity-0"
      move-class="transition duration-400"
    >
      <AppToast
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :type="toast.type"
        :message="toast.message"
        @close="toastStore.remove(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>
