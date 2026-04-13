<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Shield,
  Info,
  Phone,
  HelpCircle,
  Star,
  FileText,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Camera,
  Briefcase,
  MapPin,
  Building2,
  KeyRound,
  AlertTriangle,
  Mail,
  MessageSquare,
  ExternalLink,
} from 'lucide-vue-next'
import { useAuthStore } from '../auth/store'
import ProfileInfoSection from './sections/ProfileInfoSection.vue'
import SecuritySection from './sections/SecuritySection.vue'

type ActiveSection =
  | 'personal'
  | 'employment'
  | 'address'
  | 'bank'
  | 'change-password'
  | 'close-account'
  | 'about'
  | 'contact'
  | 'faq'
  | 'rate'
  | 'terms'
  | 'privacy'

type ProfileSub = 'personal' | 'employment' | 'address' | 'bank'
type SecuritySub = 'change-password' | 'close-account'

const authStore = useAuthStore()
const router = useRouter()

const active = ref<ActiveSection>('personal')
const openGroups = ref(new Set<string>(['profile', 'security', 'legal']))

const profileInfoKeys = new Set<string>(['personal', 'employment', 'address', 'bank'])
const securityKeys = new Set<string>(['change-password', 'close-account'])

function toggleGroup(key: string): void {
  openGroups.value.has(key) ? openGroups.value.delete(key) : openGroups.value.add(key)
}

const user = computed(() => authStore.user)
const fullName = computed(
  () =>
    [user.value?.profile.firstName, user.value?.profile.middleName, user.value?.profile.lastName]
      .filter(Boolean)
      .join(' ') || 'User',
)
const initials = computed(() => {
  const f = user.value?.profile.firstName?.[0] ?? 'U'
  const l = user.value?.profile.lastName?.[0] ?? ''
  return (f + l).toUpperCase()
})

async function handleLogout(): Promise<void> {
  authStore.logout()
  await router.push({ name: 'login' })
}

const profileInfoItems = [
  { key: 'personal', label: 'Personal Information', icon: User },
  { key: 'employment', label: 'Employment Information', icon: Briefcase },
  { key: 'address', label: 'Address Information', icon: MapPin },
  { key: 'bank', label: 'Bank Information', icon: Building2 },
]
const securityItems = [
  { key: 'change-password', label: 'Change Password', icon: KeyRound },
  { key: 'close-account', label: 'Close Account', icon: AlertTriangle },
]
const simpleItems = [
  { key: 'about', label: 'About BCL', icon: Info },
  { key: 'contact', label: 'Contact Us', icon: Phone },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'rate', label: 'Rate Us On Store', icon: Star },
]
const legalItems = [
  { key: 'terms', label: 'Terms and Conditions', icon: FileText },
  { key: 'privacy', label: 'Privacy Policy', icon: FileText },
]

const FAQ_ITEMS = [
  {
    q: 'How do I apply for a loan?',
    a: 'Navigate to My Loans and tap "Apply for a Loan". Follow the on-screen steps to complete your application in minutes.',
  },
  {
    q: 'How long does disbursement take?',
    a: 'Approved loans are typically disbursed within 2–4 business hours after signing your agreement.',
  },
  {
    q: 'Can I repay my loan early?',
    a: 'Yes — prepayments are applied first to accrued interest, then principal, with no prepayment penalty.',
  },
  {
    q: 'What happens if I miss a payment?',
    a: 'A late payment fee of ₦2,500 applies per missed installment. Persistent missed payments may affect your credit rating with us.',
  },
  {
    q: 'How do I update my bank account?',
    a: 'Go to Profile → Profile Info → Bank Information and update your disbursement account details.',
  },
]

const openFaq = ref<number | null>(null)
</script>

<template>
  <!-- Profile header -->
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-4 sm:p-6 mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-5"
  >
    <div class="relative shrink-0">
      <div
        class="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-primary/25"
      >
        {{ initials }}
      </div>
      <button
        class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
        aria-label="Change photo"
      >
        <Camera class="w-3 h-3 text-slate-500" />
      </button>
    </div>
    <div class="flex-1 min-w-0 text-center sm:text-left">
      <h1 class="text-xl font-bold text-slate-800">{{ fullName }}</h1>
      <div class="flex flex-col sm:flex-row sm:flex-wrap items-center gap-x-5 gap-y-2 mt-2">
        <div class="flex items-center gap-1.5 text-sm text-slate-500">
          <Mail class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span class="truncate">{{ user?.email ?? '—' }}</span>
          <CheckCircle2 v-if="user?.isEmailVerified" class="w-3.5 h-3.5 text-green-500 shrink-0" />
          <AlertCircle v-else class="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </div>
        <div class="flex items-center gap-1.5 text-sm text-slate-500">
          <Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{{ user?.phone ?? '—' }}</span>
          <CheckCircle2 v-if="user?.isPhoneVerified" class="w-3.5 h-3.5 text-green-500 shrink-0" />
          <AlertCircle v-else class="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </div>
      </div>
      <div class="mt-3 flex justify-center sm:justify-start">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
          :class="
            user?.status === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          "
        >
          {{ user?.status ?? 'ACTIVE' }}
        </span>
      </div>
    </div>
  </div>

  <!-- Two-column layout -->
  <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5 items-start">
    <!-- Navigation (Sidebar on Desktop, Scrollable Tabs on Mobile) -->

    <!-- Mobile Navigation -->
    <div class="md:hidden flex flex-col gap-4">
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide px-0.5">
        <button
          v-for="cat in [
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'security', icon: Shield, label: 'Security' },
            { id: 'legal', icon: FileText, label: 'Legal' },
            { id: 'support', icon: HelpCircle, label: 'Support' }
          ]"
          :key="cat.id"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
          :class="openGroups.has(cat.id) || (cat.id === 'support' && !['profile','security','legal'].some(g => openGroups.has(g)))
            ? 'bg-primary text-white shadow-sm shadow-primary/20'
            : 'bg-white border border-slate-100 text-slate-500'"
          @click="openGroups.clear(); openGroups.add(cat.id)"
        >
          <component :is="cat.icon" class="w-4 h-4" />
          {{ cat.label }}
        </button>
      </div>

      <!-- Sub-items for mobile -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide px-0.5">
        <template v-if="openGroups.has('profile')">
          <button
            v-for="item in profileInfoItems"
            :key="item.key"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap border"
            :class="active === item.key
              ? 'bg-primary/5 border-primary text-primary'
              : 'bg-white border-slate-100 text-slate-500'"
            @click="active = item.key as ActiveSection"
          >
            {{ item.label }}
          </button>
        </template>
        <template v-else-if="openGroups.has('security')">
          <button
            v-for="item in securityItems"
            :key="item.key"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap border"
            :class="active === item.key
              ? 'bg-primary/5 border-primary text-primary'
              : 'bg-white border-slate-100 text-slate-500'"
            @click="active = item.key as ActiveSection"
          >
            {{ item.label }}
          </button>
        </template>
        <template v-else-if="openGroups.has('support')">
          <button
            v-for="item in simpleItems"
            :key="item.key"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap border"
            :class="active === item.key
              ? 'bg-primary/5 border-primary text-primary'
              : 'bg-white border-slate-100 text-slate-500'"
            @click="active = item.key as ActiveSection"
          >
            {{ item.label }}
          </button>
        </template>
        <template v-else-if="openGroups.has('legal')">
          <button
            v-for="item in legalItems"
            :key="item.key"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap border"
            :class="active === item.key
              ? 'bg-primary/5 border-primary text-primary'
              : 'bg-white border-slate-100 text-slate-500'"
            @click="active = item.key as ActiveSection"
          >
            {{ item.label }}
          </button>
        </template>
      </div>
    </div>

    <!-- Desktop Sidebar Menu -->
    <div
      class="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden sticky top-6"
    >
      <!-- Profile Info group -->
      <div>
        <button
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          @click="toggleGroup('profile')"
        >
          <span class="flex items-center gap-2.5"
            ><User class="w-4 h-4 text-primary" /> Profile Info</span
          >
          <ChevronRight
            class="w-4 h-4 text-slate-400 transition-transform duration-200"
            :class="openGroups.has('profile') ? 'rotate-90' : ''"
          />
        </button>
        <div v-show="openGroups.has('profile')" class="border-t border-slate-50">
          <button
            v-for="item in profileInfoItems"
            :key="item.key"
            class="w-full flex items-center gap-2.5 pl-8 pr-4 py-2.5 text-sm text-left transition-colors"
            :class="
              active === item.key
                ? 'bg-primary/5 text-primary font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            "
            @click="active = item.key as ActiveSection"
          >
            <component :is="item.icon" class="w-3.5 h-3.5 shrink-0" />
            {{ item.label }}
          </button>
        </div>
      </div>

      <!-- Security group -->
      <div class="border-t border-slate-100">
        <button
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          @click="toggleGroup('security')"
        >
          <span class="flex items-center gap-2.5"
            ><Shield class="w-4 h-4 text-primary" /> Security</span
          >
          <ChevronRight
            class="w-4 h-4 text-slate-400 transition-transform duration-200"
            :class="openGroups.has('security') ? 'rotate-90' : ''"
          />
        </button>
        <div v-show="openGroups.has('security')" class="border-t border-slate-50">
          <button
            v-for="item in securityItems"
            :key="item.key"
            class="w-full flex items-center gap-2.5 pl-8 pr-4 py-2.5 text-sm text-left transition-colors"
            :class="
              active === item.key
                ? 'bg-primary/5 text-primary font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            "
            @click="active = item.key as ActiveSection"
          >
            <component
              :is="item.icon"
              class="w-3.5 h-3.5 shrink-0"
              :class="item.key === 'close-account' && active !== item.key ? 'text-red-400' : ''"
            />
            <span
              :class="item.key === 'close-account' && active !== item.key ? 'text-red-500' : ''"
              >{{ item.label }}</span
            >
          </button>
        </div>
      </div>

      <!-- Simple items (Support) -->
      <div class="border-t border-slate-100">
        <p class="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</p>
        <button
          v-for="item in simpleItems"
          :key="item.key"
          class="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-colors border-b border-slate-50 last:border-0"
          :class="
            active === item.key
              ? 'bg-primary/5 text-primary font-medium'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          "
          @click="active = item.key as ActiveSection"
        >
          <component
            :is="item.icon"
            class="w-4 h-4 shrink-0"
            :class="active === item.key ? 'text-primary' : 'text-slate-400'"
          />
          {{ item.label }}
        </button>
      </div>

      <!-- Legal group -->
      <div class="border-t border-slate-100">
        <button
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          @click="toggleGroup('legal')"
        >
          <span class="flex items-center gap-2.5"
            ><FileText class="w-4 h-4 text-primary" /> Legal</span
          >
          <ChevronRight
            class="w-4 h-4 text-slate-400 transition-transform duration-200"
            :class="openGroups.has('legal') ? 'rotate-90' : ''"
          />
        </button>
        <div v-show="openGroups.has('legal')" class="border-t border-slate-50">
          <button
            v-for="item in legalItems"
            :key="item.key"
            class="w-full flex items-center gap-2.5 pl-8 pr-4 py-2.5 text-sm text-left transition-colors"
            :class="
              active === item.key
                ? 'bg-primary/5 text-primary font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            "
            @click="active = item.key as ActiveSection"
          >
            <component :is="item.icon" class="w-3.5 h-3.5 shrink-0" />
            {{ item.label }}
          </button>
        </div>
      </div>

      <!-- Logout -->
      <div class="border-t border-slate-100">
        <button
          class="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4 shrink-0" /> Logout
        </button>
      </div>
    </div>

    <!-- Right content panel -->
    <div class="min-w-0">
      <!-- Profile Info sub-sections -->
      <ProfileInfoSection v-if="profileInfoKeys.has(active)" :active-sub="active as ProfileSub" />

      <!-- Security sub-sections -->
      <SecuritySection v-else-if="securityKeys.has(active)" :active-sub="active as SecuritySub" />

      <!-- About BCL -->
      <div
        v-else-if="active === 'about'"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6"
      >
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div
            class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm shadow-primary/25 shrink-0"
          >
            <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 14H9V8h2v8Zm4 0h-2V8h2v8Z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800">BCL Finance</h2>
            <p class="text-sm text-slate-500">Version 1.0.0 · Customer Portal</p>
          </div>
        </div>
        <p class="text-sm text-slate-600 leading-relaxed mb-4">
          BCL Finance Limited is a CBN-licensed financial institution dedicated to providing
          accessible, affordable credit to individuals and businesses across Nigeria.
        </p>
        <p class="text-sm text-slate-600 leading-relaxed mb-6">
          Our mission is to empower Nigerians with financial tools that help them grow — from
          personal loans for life's needs, to business financing that fuels entrepreneurship.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-xs text-slate-400 mb-1">RC Number</p>
            <p class="font-semibold text-slate-700">RC-1234567</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-xs text-slate-400 mb-1">Regulated By</p>
            <p class="font-semibold text-slate-700">CBN / FCCPC</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-xs text-slate-400 mb-1">Headquarters</p>
            <p class="font-semibold text-slate-700">Lagos, Nigeria</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-xs text-slate-400 mb-1">Founded</p>
            <p class="font-semibold text-slate-700">2019</p>
          </div>
        </div>
      </div>

      <!-- Contact Us -->
      <div
        v-else-if="active === 'contact'"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 space-y-4"
      >
        <h2 class="text-lg font-bold text-slate-800 mb-1">Contact Us</h2>
        <p class="text-sm text-slate-500 mb-2">We're available Monday–Friday, 8am–6pm WAT.</p>
        <div
          v-for="c in [
            { icon: Phone, label: 'Phone', value: '+234 700 225 4636', sub: 'Mon–Fri, 8am–6pm' },
            {
              icon: Mail,
              label: 'Email',
              value: 'support@bcl.finance',
              sub: 'Response within 24 hours',
            },
            {
              icon: MessageSquare,
              label: 'Live Chat',
              value: 'Chat with an agent',
              sub: 'In-app chat available 24/7',
            },
            {
              icon: MapPin,
              label: 'Office',
              value: '14 Adeola Odeku Street, Victoria Island',
              sub: 'Lagos, Nigeria',
            },
          ]"
          :key="c.label"
          class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <component :is="c.icon" class="w-4.5 h-4.5 text-primary" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-400 mb-0.5">{{ c.label }}</p>
            <p class="text-sm font-semibold text-slate-800 truncate">{{ c.value }}</p>
            <p class="text-xs text-slate-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{{ c.sub }}</p>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div
        v-else-if="active === 'faq'"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6"
      >
        <h2 class="text-lg font-bold text-slate-800 mb-5">Frequently Asked Questions</h2>
        <div class="space-y-2">
          <div
            v-for="(item, i) in FAQ_ITEMS"
            :key="i"
            class="rounded-xl border border-slate-100 overflow-hidden"
          >
            <button
              class="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-slate-700 text-left hover:bg-slate-50 transition-colors"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="pr-4">{{ item.q }}</span>
              <ChevronRight
                class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
                :class="openFaq === i ? 'rotate-90' : ''"
              />
            </button>
            <div
              v-show="openFaq === i"
              class="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3"
            >
              {{ item.a }}
            </div>
          </div>
        </div>
      </div>

      <!-- Rate Us -->
      <div
        v-else-if="active === 'rate'"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 text-center"
      >
        <div class="flex justify-center mb-4">
          <div class="flex gap-1">
            <Star v-for="i in 5" :key="i" class="w-6 h-6 sm:w-8 sm:h-8 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <h2 class="text-lg font-bold text-slate-800 mb-2">Enjoying BCL Finance?</h2>
        <p class="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed px-4">
          Your review helps others discover BCL and helps us keep improving. It only takes 30
          seconds!
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            class="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            <ExternalLink class="w-4 h-4" />
            App Store
          </button>
          <button
            class="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <ExternalLink class="w-4 h-4" />
            Google Play
          </button>
        </div>
      </div>

      <!-- Terms / Privacy -->
      <div
        v-else-if="active === 'terms' || active === 'privacy'"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6"
      >
        <h2 class="text-lg font-bold text-slate-800 mb-1">
          {{ active === 'terms' ? 'Terms and Conditions' : 'Privacy Policy' }}
        </h2>
        <p class="text-xs text-slate-400 mb-5">Last updated: January 2026</p>
        <div
          class="prose prose-sm prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-4"
        >
          <template v-if="active === 'terms'">
            <p>
              <strong>1. Acceptance of Terms</strong><br />By accessing or using the BCL Finance
              platform, you agree to be bound by these Terms and Conditions and all applicable laws.
              If you do not agree, please discontinue use immediately.
            </p>
            <p>
              <strong>2. Eligibility</strong><br />You must be at least 18 years old, a Nigerian
              citizen or lawful resident, hold a valid BVN, and maintain an active CBN-licensed bank
              account to use our services.
            </p>
            <p>
              <strong>3. Loan Products</strong><br />All loan products offered are subject to credit
              assessment and approval. Interest rates, tenor, and repayment schedules are disclosed
              before acceptance. We reserve the right to decline any application.
            </p>
            <p>
              <strong>4. Repayment Obligations</strong><br />Borrowers are obligated to repay all
              outstanding amounts, including principal, interest, and applicable fees, by the agreed
              due dates. Late payments attract a fee of ₦2,500 per missed installment.
            </p>
            <p>
              <strong>5. Amendments</strong><br />BCL Finance reserves the right to update these
              Terms at any time with 14 days' notice to users via email or in-app notification.
            </p>
          </template>
          <template v-else>
            <p>
              <strong>1. Data We Collect</strong><br />We collect your name, email, phone number,
              BVN, employment information, bank account details, and transaction history to provide
              and improve our services.
            </p>
            <p>
              <strong>2. How We Use Your Data</strong><br />Your data is used for identity
              verification, credit assessment, loan disbursement, repayment processing, and customer
              support. We do not sell your personal information to third parties.
            </p>
            <p>
              <strong>3. Data Sharing</strong><br />We may share data with CBN, FCCPC, credit
              bureaus, and our banking partners as required by law or to fulfill our services. All
              partners are bound by data protection agreements.
            </p>
            <p>
              <strong>4. Data Security</strong><br />We implement industry-standard encryption and
              access controls to protect your data. In the event of a breach affecting your
              information, we will notify you within 72 hours.
            </p>
            <p>
              <strong>5. Your Rights</strong><br />Under the NDPR, you have the right to access,
              correct, or request deletion of your personal data. Contact us at privacy@bcl.finance
              to exercise these rights.
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
