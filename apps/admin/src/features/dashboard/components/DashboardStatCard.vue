<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    value: string | number;
    variant?: "primary" | "emerald" | "rose" | "secondary";
    badgeText?: string;
    badgeVariant?: "primary" | "emerald" | "rose" | "secondary";
  }>(),
  {
    variant: "primary",
  },
);

function getVariantClasses(variant: string) {
  switch (variant) {
    case "emerald":
      return {
        circle: "bg-emerald-50",
        iconBox: "bg-emerald-100 text-emerald-600",
      };
    case "rose":
      return {
        circle: "bg-rose-50",
        iconBox: "bg-rose-100 text-rose-600",
      };
    case "secondary":
      return {
        circle: "bg-secondary-50",
        iconBox: "bg-secondary-100 text-secondary-600",
      };
    case "primary":
    default:
      return {
        circle: "bg-primary-50",
        iconBox: "bg-primary-100 text-primary-600",
      };
  }
}

function getBadgeClasses(variant: string) {
  switch (variant) {
    case "emerald":
      return "bg-emerald-100 text-emerald-700";
    case "rose":
      return "bg-rose-100 text-rose-700";
    case "secondary":
      return "bg-secondary-100 text-secondary-700";
    case "primary":
    default:
      return "bg-primary-100 text-primary-700";
  }
}
</script>

<template>
  <div
    class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group"
  >
    <div
      :class="[
        'absolute -right-6 -top-6 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500',
        getVariantClasses(variant).circle,
      ]"
    ></div>
    <div class="relative flex items-start justify-between mb-4">
      <div
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6',
          getVariantClasses(variant).iconBox,
        ]"
      >
        <slot name="icon"></slot>
      </div>
      <span
        v-if="badgeText"
        :class="[
          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
          getBadgeClasses(badgeVariant || variant),
        ]"
      >
        {{ badgeText }}
      </span>
    </div>
    <div class="relative">
      <h3 class="text-sm font-medium text-slate-500 mb-1">{{ title }}</h3>
      <p class="text-3xl font-bold text-slate-800">{{ value }}</p>
    </div>
  </div>
</template>
