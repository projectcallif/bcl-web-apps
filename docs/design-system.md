# Design System

## Overview

BCL uses **Tailwind CSS v4** with a custom `@theme` block defined in `packages/ui/src/theme.css`.
All brand tokens are available as Tailwind utility classes across both apps.

---

## Brand Colors

### Primary — Dark Blue `#0b0783`

Used for primary actions, navigation active states, and key UI elements.

| Token              | Hex       | Tailwind class examples                          |
|--------------------|-----------|--------------------------------------------------|
| `primary-50`       | `#edeeff` | `bg-primary-50`, `text-primary-50`               |
| `primary-100`      | `#d8d9ff` |                                                  |
| `primary-200`      | `#b1b4ff` |                                                  |
| `primary-300`      | `#898eff` |                                                  |
| `primary-400`      | `#6168f0` |                                                  |
| `primary-500`      | `#3a42cc` |                                                  |
| `primary-600`      | `#2222a8` |                                                  |
| **`primary-700`**  | `#0b0783` | **Brand value** — `bg-primary-700`, `text-primary-700` |
| `primary-800`      | `#080563` | Used for hover states on primary buttons         |
| `primary-900`      | `#050340` | Admin sidebar active state background            |
| `primary-950`      | `#020121` |                                                  |
| `primary`          | `#0b0783` | Shorthand — `bg-primary`, `text-primary`, `border-primary` |

### Secondary — Orange `#e47d20`

Used for secondary actions and accent highlights.

| Token                | Hex       | Notes                        |
|----------------------|-----------|------------------------------|
| `secondary-500`      | `#e47d20` | **Brand value**              |
| `secondary-600`      | `#c46b1b` | Hover state for secondary btn |
| `secondary`          | `#e47d20` | Shorthand alias              |

### Tertiary — Light Blue `#458dd7`

Used for active link text in the admin sidebar and supporting accents.

| Token              | Hex       | Notes                              |
|--------------------|-----------|------------------------------------|
| `tertiary-500`     | `#458dd7` | **Brand value**                    |
| `tertiary`         | `#458dd7` | Shorthand alias                    |

---

## Consuming the Theme

In each app's global CSS entry point:

```css
@import "@bcl/ui/theme.css";
@import "tailwindcss";
```

This makes all `primary-*`, `secondary-*`, and `tertiary-*` tokens available as standard
Tailwind utilities (`bg-*`, `text-*`, `border-*`, `outline-*`, etc.).

---

## Component Library

### `BaseButton`

The only shared component currently exported from `@bcl/ui`. All buttons in both apps should
use this component.

```vue
<BaseButton variant="primary" size="md">Save</BaseButton>
```

#### Props

| Prop       | Type                                                     | Default    | Description                    |
|------------|----------------------------------------------------------|------------|-------------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'tertiary' \| 'danger' \| 'ghost'` | `'primary'` | Visual style           |
| `size`     | `'sm' \| 'md' \| 'lg'`                                  | `'md'`     | Button size                    |
| `disabled` | `boolean`                                                | `false`    | Disables interaction           |
| `loading`  | `boolean`                                                | `false`    | Shows spinner, disables click  |
| `type`     | `'button' \| 'submit' \| 'reset'`                       | `'button'` | Native button type             |

#### Variants

| Variant     | Background        | Text    | Use for                        |
|-------------|-------------------|---------|-------------------------------|
| `primary`   | `bg-primary`      | white   | Main CTA actions               |
| `secondary` | `bg-secondary`    | white   | Supporting actions             |
| `tertiary`  | `bg-tertiary`     | white   | Alternate actions              |
| `danger`    | `bg-red-500`      | white   | Destructive actions            |
| `ghost`     | transparent       | slate   | Low-emphasis / icon buttons    |

#### Sizes

| Size | Padding       | Font size |
|------|---------------|-----------|
| `sm` | `px-3 py-1`   | `text-sm` |
| `md` | `px-4 py-2`   | `text-sm` |
| `lg` | `px-6 py-3`   | `text-base` |

#### Loading State

When `loading` is `true`, a spinning indicator is prepended inside the button and
`disabled` behavior is applied automatically.

```vue
<BaseButton :loading="isSaving" variant="primary">
  Save Changes
</BaseButton>
```

#### Emits

| Event   | Payload       |
|---------|---------------|
| `click` | `MouseEvent`  |

---

## Layout Patterns

### Customer App Layout

```
┌──────────────────────────────────────┐
│  nav  [ Home ]  [ About ]  (header)  │  px-5 py-3, border-b, bg-white
├──────────────────────────────────────┤
│                                      │
│         <RouterView />               │  p-8
│                                      │
└──────────────────────────────────────┘
```

Active nav links: `text-primary font-semibold`
Default nav links: `text-slate-500 hover:text-primary`

### Admin App Layout

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (220px)    │   Main Content (flex-1)        │
│  bg-slate-900       │   bg-slate-50, p-8             │
│                     │                                │
│  BCL Admin (brand)  │   <RouterView />               │
│  ─────────────────  │                                │
│  Dashboard          │                                │
│  Users              │                                │
│  Settings           │                                │
└─────────────────────┴────────────────────────────────┘
```

Sidebar active link: `bg-primary-900 text-tertiary font-semibold`
Sidebar default link: `text-slate-400 hover:bg-slate-800 hover:text-white`

---

## Typography & Spacing

These are Tailwind defaults — no custom typography scale is defined yet.

| Use case          | Recommended classes                    |
|-------------------|----------------------------------------|
| Page heading      | `text-2xl font-bold text-slate-800`    |
| Section heading   | `text-lg font-semibold text-slate-700` |
| Body text         | `text-sm text-slate-600`               |
| Muted / caption   | `text-xs text-slate-400`               |
| Stat values       | `text-2xl font-bold`                   |

---

## Accessibility

- `BaseButton` uses `focus-visible:outline-2 focus-visible:outline-offset-2` for keyboard focus.
- Disabled states use `opacity-50 cursor-not-allowed pointer-events-none`.
- Loading spinner uses `aria-hidden="true"` to hide it from screen readers.
- Always pair icon-only buttons with `aria-label`.
