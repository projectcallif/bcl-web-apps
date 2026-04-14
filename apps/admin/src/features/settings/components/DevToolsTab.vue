<script setup lang="ts">
import { ref } from "vue";
import { AppTextInput, BaseButton } from "@bcl/ui";
import { Key, Copy, Check, Loader2 } from "lucide-vue-next";

const rawPassword = ref("");
const hashedPassword = ref("");
const isGenerating = ref(false);
const isCopied = ref(false);

async function generateHash() {
  if (!rawPassword.value) return;

  isGenerating.value = true;
  hashedPassword.value = "";

  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulating a bcrypt-style hash result
  const salt = "$2b$12$Vp7f8X9.Q2Y4z5R6T7U8V9";
  const fakeHash = salt + Math.random().toString(36).substring(2, 15);
  hashedPassword.value = fakeHash;

  isGenerating.value = false;
}

function copyToClipboard() {
  if (!hashedPassword.value) return;

  navigator.clipboard.writeText(hashedPassword.value);
  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
  >
    <div class="flex items-center gap-2 mb-6">
      <div
        class="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"
      >
        <Key class="w-5 h-5" />
      </div>
      <div>
        <h2 class="text-lg font-bold text-slate-800 tracking-tight">
          Developer Tools
        </h2>
        <p class="text-sm text-slate-500">
          Utility tools for debugging and internal administration.
        </p>
      </div>
    </div>

    <div class="space-y-8 max-w-2xl">
      <!-- Password Hashing Tool -->
      <section
        class="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4"
      >
        <div>
          <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Password Hash Generator
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Generate a secure hash for any raw string to be used for database
            seeding or manual overrides.
          </p>
        </div>

        <div class="space-y-4">
          <AppTextInput
            id="rawPassword"
            v-model="rawPassword"
            label="Input String"
            placeholder="Type your password or secret here..."
            @keyup.enter="generateHash"
          />

          <BaseButton
            variant="primary"
            :disabled="!rawPassword || isGenerating"
            @click="generateHash"
            class="w-full sm:w-auto"
          >
            <template v-if="isGenerating">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </template>
            <template v-else> Generate Hash </template>
          </BaseButton>
        </div>

        <div
          v-if="hashedPassword || isGenerating"
          class="pt-4 animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <p
            class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
          >
            Resulting Hash
          </p>
          <div
            class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-inner group"
          >
            <code class="flex-1 text-xs font-mono text-primary-700 break-all">
              {{ isGenerating ? "Hashing in progress..." : hashedPassword }}
            </code>
            <button
              v-if="hashedPassword && !isGenerating"
              @click="copyToClipboard"
              class="shrink-0 p-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 text-slate-400 hover:text-primary-600"
              title="Copy to clipboard"
            >
              <Check v-if="isCopied" class="w-4.5 h-4.5 text-emerald-500" />
              <Copy v-else class="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </section>

      <!-- Warning Note -->
      <div
        class="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800"
      >
        <div class="shrink-0">
          <Shield class="w-5 h-5" />
        </div>
        <div class="text-xs leading-relaxed font-medium">
          <span class="font-bold">Security Notice:</span> These tools are for
          development and staging use only. Avoid generating production
          credentials in browsers or environments that are not strictly secured.
        </div>
      </div>
    </div>
  </div>
</template>
