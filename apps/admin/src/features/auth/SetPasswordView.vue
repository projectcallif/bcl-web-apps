<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { AppPasswordInput, BaseButton, BrandLogo } from "@bcl/ui";
import { ShieldCheck, ArrowRight, Lock } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMsg = ref("");
const success = ref(false);

const isMatch = computed(() => {
  if (!password.value || !confirmPassword.value) return null;
  return password.value === confirmPassword.value;
});

const isStrong = computed(() => password.value.length >= 8);

async function handleSubmit() {
  if (!isMatch.value || !isStrong.value) {
    errorMsg.value = "Please ensure passwords match and meet requirements";
    return;
  }

  try {
    loading.value = true;
    errorMsg.value = "";

    // We would typically send the inviteToken from the URL here
    const token = route.query.token as string;
    console.log("Using invite token:", token);

    success.value = true;
    setTimeout(() => {
      router.push({ name: "login" });
    }, 2000);
  } catch (e: any) {
    errorMsg.value =
      e.message || "Failed to set password. Link may be expired.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans"
  >
    <!-- Aesthetic Background Elements -->
    <div
      class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/30 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Brand Plate -->
      <div class="flex flex-col items-center mb-8">
        <BrandLogo size="xl" class="mb-4" />
        <h1 class="text-3xl font-bold tracking-tight text-white mb-2">
          Welcome, Admin
        </h1>
        <p class="text-slate-400 text-sm">
          Initialize your secure access portal
        </p>
      </div>

      <!-- Card Container -->
      <div
        class="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <!-- Success State -->
        <div
          v-if="success"
          class="flex flex-col items-center py-6 text-center animate-in fade-in zoom-in duration-500"
        >
          <div
            class="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4 ring-1 ring-emerald-500/50"
          >
            <ShieldCheck class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-bold text-white mb-2">Password Set!</h2>
          <p class="text-slate-400 text-sm mb-6">
            Your security credentials have been updated. Redirecting you to
            login...
          </p>
          <div class="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 animate-[progress_2s_ease-in-out]"
            ></div>
          </div>
        </div>

        <!-- Form State -->
        <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-6">
          <div class="space-y-1">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <Lock class="w-4 h-4 text-primary-400" /> Secure Your Account
            </h2>
            <p class="text-xs text-slate-500">
              Please set a complex password for your admin profile.
            </p>
          </div>

          <div class="space-y-4">
            <AppPasswordInput
              id="new-password"
              v-model="password"
              label="New Password"
              placeholder="Min. 8 characters"
            />

            <AppPasswordInput
              id="confirm-password"
              v-model="confirmPassword"
              label="Confirm New Password"
              placeholder="Repeat your password"
            />
          </div>

          <!-- Requirements -->
          <div
            class="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 flex flex-col gap-2 text-[11px]"
          >
            <div
              class="flex items-center gap-2"
              :class="isStrong ? 'text-emerald-400' : 'text-slate-500'"
            >
              <div
                class="w-1.5 h-1.5 rounded-full"
                :class="isStrong ? 'bg-emerald-500' : 'bg-slate-700'"
              ></div>
              Minimum 8 characters length
            </div>
            <div
              class="flex items-center gap-2"
              :class="
                isMatch === null
                  ? 'text-slate-500'
                  : isMatch
                    ? 'text-emerald-400'
                    : 'text-rose-400'
              "
            >
              <div
                class="w-1.5 h-1.5 rounded-full"
                :class="
                  isMatch === null
                    ? 'bg-slate-700'
                    : isMatch
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                "
              ></div>
              Passwords must match
            </div>
          </div>

          <!-- Error Alert -->
          <div
            v-if="errorMsg"
            class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
          >
            {{ errorMsg }}
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full group"
            :loading="loading"
            :disabled="!password || !confirmPassword || !isMatch || !isStrong"
          >
            Create Admin Password
            <ArrowRight
              class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
            />
          </BaseButton>
        </form>
      </div>

      <div class="mt-8 text-center">
        <p class="text-xs text-slate-500">
          Protected by BCL Security Protocols. <br />
          Link expired?
          <button
            class="text-primary-400 hover:text-primary-300 font-bold ml-1"
          >
            Request new invite
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
