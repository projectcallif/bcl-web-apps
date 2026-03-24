# Contributing Guide

## Prerequisites

- Node.js 20+
- pnpm 9.15+ (`npm install -g pnpm`)

## Setup

```bash
git clone <repo-url>
cd bcl-web-apps
pnpm install       # installs all workspace dependencies
```

## Running the Apps

```bash
pnpm dev:customer  # http://localhost:5173
pnpm dev:admin     # http://localhost:5174
```

Both can run simultaneously. Use `.claude/launch.json` with Claude Code's preview tool to
start them from within Claude.

---

## Adding a New Page (View)

1. Create the view component in the appropriate app:

   ```
   apps/admin/src/views/ReportsView.vue
   ```

2. Register the route in `apps/admin/src/router/index.ts`:

   ```ts
   {
     path: '/reports',
     name: 'reports',
     component: () => import('../views/ReportsView.vue'),  // lazy-load
   }
   ```

3. Add a nav link in `apps/admin/src/App.vue` if it should appear in the sidebar.

---

## Adding a New Pinia Store

1. Create the store file:

   ```
   apps/admin/src/stores/reports.ts
   ```

2. Use the setup-function syntax:

   ```ts
   import { ref, computed } from 'vue'
   import { defineStore } from 'pinia'

   export const useReportsStore = defineStore('reports', () => {
     const items = ref<Report[]>([])

     async function fetchReports() {
       // ...
     }

     return { items, fetchReports }
   })
   ```

3. Import and use in a component:

   ```ts
   import { useReportsStore } from '@/stores/reports'
   const reports = useReportsStore()
   ```

---

## Adding a New Shared Component

Use `packages/ui` only for components used in **more than one app**.

1. Create the component:

   ```
   packages/ui/src/components/BadgeStatus.vue
   ```

2. Export it from `packages/ui/src/index.ts`:

   ```ts
   export { default as BadgeStatus } from './components/BadgeStatus.vue'
   ```

3. Use in any app:

   ```ts
   import { BadgeStatus } from '@bcl/ui'
   ```

---

## Adding New Shared Types

1. Add to an existing file or create a new one in `packages/types/src/`:

   ```ts
   // packages/types/src/product.ts
   export interface Product {
     id: string
     name: string
     price: number
   }
   ```

2. Re-export from `packages/types/src/index.ts`:

   ```ts
   export * from './product'
   ```

3. Import anywhere:

   ```ts
   import type { Product } from '@bcl/types'
   ```

---

## Adding a New App

1. Scaffold a new Vite + Vue project inside `apps/`:

   ```bash
   cd apps
   pnpm create vite my-new-app --template vue-ts
   ```

2. Update `package.json` in the new app:
   - Set `name` to `@bcl/my-new-app`
   - Add `@bcl/types` and `@bcl/ui` as `workspace:*` dependencies

3. Add dev script to root `package.json`:

   ```json
   "dev:my-new-app": "pnpm --filter @bcl/my-new-app dev"
   ```

4. Add an entry to `.claude/launch.json`.

5. Add the app to `playwright.config.ts` if E2E tests are needed.

---

## Running Tests

```bash
# Unit tests (watch mode)
pnpm test:unit

# Unit tests (single run with coverage)
pnpm test:unit -- run --coverage

# E2E tests (requires apps to be running)
pnpm test:e2e

# E2E with interactive UI
pnpm test:e2e:ui
```

Unit test files live next to the source file they test:

```
src/stores/counter.ts
src/stores/counter.spec.ts
```

---

## Code Quality

```bash
pnpm type-check    # TypeScript checks (no emitting)
pnpm lint          # ESLint with auto-fix
```

Run both before opening a PR. CI will fail if either reports errors.

---

## Branch & PR Conventions

| Branch prefix | Use for                                |
|---------------|----------------------------------------|
| `feat/`       | New features                           |
| `fix/`        | Bug fixes                              |
| `refactor/`   | Code changes with no behaviour change  |
| `docs/`       | Documentation only                     |
| `chore/`      | Deps, config, tooling                  |

PR titles should follow: `type(scope): short description`

Examples:
- `feat(admin): add reports page`
- `fix(ui): correct button focus outline colour`
- `chore: upgrade Vite to 6.3`
