# Architecture

## Overview

`bcl-web-apps` is a **pnpm monorepo** containing two independently deployable web apps that
share a common type library and UI component library.

```
┌─────────────────────────────────────────────────────┐
│                  bcl-web-apps (root)                │
│                  pnpm workspace                     │
│                                                     │
│  ┌─────────────────┐   ┌─────────────────────────┐ │
│  │  apps/customer  │   │      apps/admin         │ │
│  │  Port 5173      │   │      Port 5174          │ │
│  └────────┬────────┘   └───────────┬─────────────┘ │
│           │                        │               │
│           └──────────┬─────────────┘               │
│                      │                             │
│         ┌────────────┼────────────┐                │
│         ▼                        ▼                 │
│  ┌─────────────┐        ┌──────────────┐           │
│  │ packages/ui │        │packages/types│           │
│  │ Components  │        │ TS interfaces│           │
│  │ theme.css   │        │ API shapes   │           │
│  └─────────────┘        └──────────────┘           │
└─────────────────────────────────────────────────────┘
```

## Applications

### `apps/customer` — Customer Portal

| Item      | Detail                              |
|-----------|-------------------------------------|
| Port      | 5173                                |
| Purpose   | End-user facing product             |
| Package   | `@bcl/customer`                     |

**Routes:**

| Path     | Component       | Load strategy |
|----------|-----------------|---------------|
| `/`      | `HomeView`      | Eager         |
| `/about` | `AboutView`     | Lazy          |

**Stores:**

| Store          | State                        | Actions                        |
|----------------|------------------------------|-------------------------------|
| `useCounterStore` | `count`, `doubleCount`    | `increment`, `decrement`, `reset` |

**Layout:** Top navbar → `<RouterView>`

---

### `apps/admin` — Admin Dashboard

| Item      | Detail                              |
|-----------|-------------------------------------|
| Port      | 5174                                |
| Purpose   | Internal management dashboard       |
| Package   | `@bcl/admin`                        |

**Routes:**

| Path        | Component         | Load strategy |
|-------------|-------------------|---------------|
| `/`         | `DashboardView`   | Eager         |
| `/users`    | `UsersView`       | Lazy          |
| `/settings` | `SettingsView`    | Lazy          |

**Stores:**

| Store               | State                                       | Actions      |
|---------------------|---------------------------------------------|--------------|
| `useDashboardStore` | `totalUsers`, `activeUsers`, `inactiveUsers` | `setStats`  |

**Layout:** Fixed sidebar (220px dark) + flex main content area.

---

## Shared Packages

### `packages/types` — `@bcl/types`

Central source of truth for all shared TypeScript interfaces and types. Both apps import from here.
Never define API shapes inline in app code.

```
packages/types/src/
├── user.ts       # User, UserRole, UserStatus, CreateUserPayload, UpdateUserPayload
├── common.ts     # ApiResponse<T>, PaginatedResponse<T>, ApiError, PaginationParams
└── index.ts      # re-exports everything
```

### `packages/ui` — `@bcl/ui`

Shared component library and brand theme. Exports Vue components and a CSS theme file.

```
packages/ui/src/
├── components/
│   └── BaseButton.vue    # Primary button primitive
├── theme.css             # Tailwind @theme block (brand tokens)
└── index.ts              # Named exports
```

Apps consume the theme by adding `@import "@bcl/ui/theme.css"` at the top of their
global CSS entry point.

---

## Data Flow

```
API / Backend
     │
     ▼
 ApiResponse<T>         ← typed via @bcl/types
     │
     ▼
 Pinia Store            ← holds domain state per-app
     │
     ▼
 Vue Components         ← read state, call actions
     │
     ▼
 @bcl/ui BaseButton     ← shared presentational primitives
```

---

## Build Pipeline

```
pnpm build
  │
  ├── 1. Build packages/ (parallel, --filter './packages/**')
  │       └── packages/types  →  dist/
  │       └── packages/ui     →  dist/
  │
  └── 2. Build apps/ (parallel, --filter './apps/**')
          └── apps/customer   →  dist/
          └── apps/admin      →  dist/
```

Each app is a standalone static bundle that can be deployed independently.

---

## Testing Architecture

```
Vitest (unit)
├── apps/customer/src/**/*.spec.ts
├── apps/admin/src/**/*.spec.ts
└── packages/ui/src/**/*.spec.ts

Playwright (E2E)
├── apps/customer/e2e/
└── apps/admin/e2e/
    playwright.config.ts  ← targets ports 5173 & 5174
```

---

## Key Design Decisions

- **Monorepo** — shared packages prevent type drift between apps; one `pnpm install` sets up everything.
- **No cross-app imports** — apps communicate only through shared packages, keeping them independently deployable.
- **Lazy routing** — non-entry routes are lazy-loaded to minimize initial bundle size.
- **Tailwind v4 `@theme`** — brand tokens defined once in `theme.css`, consumed as utility classes everywhere without a separate config file.
- **Pinia setup-function stores** — consistent with Composition API style; easier to extract logic into composables later.
