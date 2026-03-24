<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div class="home">
    <h1>Welcome to BCL Customer Portal</h1>

    <section class="counter-demo">
      <h2>Counter: {{ counter.count }}</h2>
      <p>Double: {{ counter.doubleCount }}</p>
      <div class="actions">
        <button @click="counter.decrement">−</button>
        <button @click="counter.reset">Reset</button>
        <button @click="counter.increment">+</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
}

.counter-demo {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #f7fafc;
}
</style>
