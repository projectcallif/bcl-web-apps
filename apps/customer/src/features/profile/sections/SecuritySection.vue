<script setup lang="ts">
import { ref, computed } from 'vue'
import { AppPasswordInput, BaseButton } from '@bcl/ui'
import { ShieldCheck, AlertTriangle } from 'lucide-vue-next'

defineProps<{ activeSub: 'change-password' | 'close-account' }>()

// ── Change Password ────────────────────────────────────────────────────────────
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const saved = ref(false)

const passwordsMatch = computed(() => newPassword.value === confirmPassword.value)
const canSave = computed(() =>
  currentPassword.value.length >= 6 &&
  newPassword.value.length >= 8 &&
  passwordsMatch.value,
)

async function savePassword(): Promise<void> {
  if (!canSave.value) return
  saving.value = true
  await new Promise(r => setTimeout(r, 1200))
  saving.value = false
  saved.value = true
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  setTimeout(() => { saved.value = false }, 3000)
}

// ── Close Account ──────────────────────────────────────────────────────────────
const closeConfirm = ref('')
const showCloseConfirm = ref(false)
</script>

<template>
  <!-- Change Password -->
  <div v-if="activeSub === 'change-password'" class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <ShieldCheck class="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-800">Change Password</h2>
        <p class="text-xs text-slate-500 mt-0.5">Use a strong password you don't use elsewhere.</p>
      </div>
    </div>

    <div v-if="saved" class="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-sm text-green-700 font-medium">
      <ShieldCheck class="w-4 h-4 shrink-0" />
      Password updated successfully.
    </div>

    <div class="space-y-4">
      <AppPasswordInput
        v-model="currentPassword"
        id="current-password"
        label="Current Password"
        placeholder="Enter current password"
      />
      <AppPasswordInput
        v-model="newPassword"
        id="new-password"
        label="New Password"
        placeholder="At least 8 characters"
        :hint="newPassword.length > 0 ? `${newPassword.length} characters` : undefined"
      />
      <AppPasswordInput
        v-model="confirmPassword"
        id="confirm-password"
        label="Confirm New Password"
        placeholder="Re-enter new password"
        :error="confirmPassword.length > 0 && !passwordsMatch ? 'Passwords do not match' : undefined"
      />
    </div>

    <div class="mt-6 flex justify-end">
      <BaseButton variant="primary" size="lg" :disabled="!canSave || saving" @click="savePassword">
        {{ saving ? 'Saving…' : 'Update Password' }}
      </BaseButton>
    </div>

    <!-- Password tips -->
    <div class="mt-6 pt-5 border-t border-slate-100">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Password Tips</p>
      <ul class="space-y-1.5 text-xs text-slate-400">
        <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-slate-300 shrink-0" />At least 8 characters long</li>
        <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-slate-300 shrink-0" />Mix of uppercase, lowercase, numbers and symbols</li>
        <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-slate-300 shrink-0" />Avoid using your name or date of birth</li>
        <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-slate-300 shrink-0" />Don't reuse passwords from other accounts</li>
      </ul>
    </div>
  </div>

  <!-- Close Account -->
  <div v-else-if="activeSub === 'close-account'" class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
        <AlertTriangle class="w-5 h-5 text-red-500" />
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-800">Close Account</h2>
        <p class="text-xs text-slate-500 mt-0.5">This action is permanent and cannot be undone.</p>
      </div>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
      <p class="text-sm font-semibold text-red-700 mb-3">Before you proceed, please note:</p>
      <ul class="space-y-2 text-sm text-red-600">
        <li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />All outstanding loan balances must be fully repaid before closure.</li>
        <li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />Your account data will be retained for 7 years as required by Nigerian law.</li>
        <li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />You will lose access to your loan history, statements, and documents.</li>
        <li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />This request may take up to 5 business days to process.</li>
      </ul>
    </div>

    <div v-if="!showCloseConfirm">
      <button
        class="w-full py-3 rounded-xl border-2 border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
        @click="showCloseConfirm = true"
      >
        I understand — Continue with account closure
      </button>
    </div>

    <div v-else class="space-y-4">
      <p class="text-sm text-slate-600">Type <strong class="font-mono text-red-600">CLOSE MY ACCOUNT</strong> to confirm:</p>
      <input
        v-model="closeConfirm"
        type="text"
        placeholder="CLOSE MY ACCOUNT"
        class="w-full rounded-xl border border-input-border px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-colors font-mono"
      />
      <div class="flex gap-3">
        <button
          class="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          @click="showCloseConfirm = false; closeConfirm = ''"
        >
          Cancel
        </button>
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          :class="closeConfirm === 'CLOSE MY ACCOUNT' ? 'bg-red-500 hover:bg-red-600 cursor-pointer' : 'bg-red-200 cursor-not-allowed'"
          :disabled="closeConfirm !== 'CLOSE MY ACCOUNT'"
        >
          Submit Closure Request
        </button>
      </div>
    </div>
  </div>
</template>
