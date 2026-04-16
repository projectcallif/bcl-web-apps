<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./store";
import { useToastStore } from "@/stores/toast";
import { AppTextInput, AppPasswordInput, BaseButton, BrandLogo } from "@bcl/ui";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToastStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

function _debugPrefill() {
  email.value = "superadmin@bcl.com";
  password.value = "SuperAdmin@1";
}

async function handleSubmit() {
  if (!email.value || !password.value) {
    errorMsg.value = "Please enter both email and password";
    toast.error("Please enter both email and password");
    return;
  }

  try {
    loading.value = true;
    errorMsg.value = "";
    await authStore.login({
      identifier: email.value,
      password: password.value,
    });
    toast.success("Welcome back, administrator!");
    router.push({ name: "dashboard" });
  } catch (e: any) {
    errorMsg.value =
      e.message || "Login failed. Please check your credentials.";
    toast.error(e.message || "Login failed. Please check your credentials.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Aesthetic Background Elements -->
    <div
      class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/40 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-tertiary/20 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Brand Plate -->
      <div class="flex flex-col items-center mb-8">
        <BrandLogo size="xl" class="mb-4" />
        <h1
          class="text-3xl font-bold tracking-tight text-white mb-2"
          @dblclick="_debugPrefill"
        >
          BCL Admin
        </h1>
        <p class="text-slate-400 text-sm">Secure Portal Authentication</p>
      </div>

      <!-- Login Card -->
      <div
        class="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
      >
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
          <AppTextInput
            id="email"
            v-model="email"
            label="Email Address"
            type="email"
            placeholder="admin@bcl.com"
          />

          <AppPasswordInput
            id="password"
            v-model="password"
            label="Password"
            placeholder="Enter your password"
          />

          <div
            v-if="errorMsg"
            class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {{ errorMsg }}
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full mt-2"
            :loading="loading"
          >
            Sign In
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>
