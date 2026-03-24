# BCL Web Apps — Claude Instructions

## Project Overview

Multi-tenant Vue 3 + TypeScript monorepo managed with pnpm workspaces, consisting of two apps
(`customer`, `admin`) and two shared packages (`types`, `ui`).

## Directory Structure

```
bcl-web-apps/
├── apps/
│   ├── customer/       # Customer-facing portal  → http://localhost:5173
│   └── admin/          # Admin dashboard         → http://localhost:5174
├── packages/
│   ├── types/          # Shared TypeScript interfaces (User, ApiResponse, etc.)
│   └── ui/             # Shared component library (BaseButton, theme.css)
├── docs/               # Project documentation
└── .claude/            # Claude-specific config (launch.json)
```

## Tech Stack

| Layer         | Tool                          |
|---------------|-------------------------------|
| Framework     | Vue 3.5 (Composition API)     |
| Language      | TypeScript 5.7 (strict)       |
| Build         | Vite 6.2                      |
| Styling       | Tailwind CSS 4.2              |
| State         | Pinia 2.3                     |
| Routing       | Vue Router 4.5                |
| Unit tests    | Vitest 3.0                    |
| E2E tests     | Playwright 1.50               |
| Package mgr   | pnpm 9.15 (workspaces)        |

## Dev Commands

```bash
# Start dev servers
pnpm dev:customer          # http://localhost:5173
pnpm dev:admin             # http://localhost:5174

# Build
pnpm build                 # Build all packages then all apps
pnpm build:customer
pnpm build:admin

# Test
pnpm test:unit             # Vitest (all packages)
pnpm test:unit:ui          # Vitest with UI
pnpm test:e2e              # Playwright
pnpm test:e2e:ui           # Playwright with UI

# Quality
pnpm type-check            # vue-tsc across workspace
pnpm lint                  # ESLint across workspace
```

## Code Conventions

### Vue Components
- Always use `<script setup lang="ts">` — no Options API
- Props via `defineProps<Interface>()` with `withDefaults()` for defaults
- Emits via `defineEmits<{ eventName: [arg: Type] }>()`
- Keep component files under 200 lines; extract logic into composables

### TypeScript
- Strict mode — never use `any`
- Explicit return types on all exported functions
- All API shapes must use types from `@bcl/types`, never define inline
- Use `ApiResponse<T>` / `PaginatedResponse<T>` for all API calls

### Styling
- Tailwind CSS utility classes only — no inline `style` attributes
- Use brand tokens: `primary`, `secondary`, `tertiary` (defined in `packages/ui/src/theme.css`)
- Scoped styles (`<style scoped>`) only when Tailwind cannot cover the case

### State Management
- All shared/cross-component state goes in a Pinia store
- Stores use the setup-function syntax (`defineStore('id', () => { ... })`)
- Keep stores in `src/stores/` within each app

### Package Boundaries
- Cross-app shared types → `packages/types`
- Cross-app shared components → `packages/ui`
- Apps must NOT import from each other
- New reusable components go in `packages/ui` if used in more than one app

## File Naming

| Item              | Convention          | Example                  |
|-------------------|---------------------|--------------------------|
| Components        | PascalCase.vue      | `BaseButton.vue`         |
| Views             | PascalCase + View   | `DashboardView.vue`      |
| Stores            | camelCase.ts        | `dashboard.ts`           |
| Composables       | use + PascalCase.ts | `useUserSearch.ts`       |
| Types / interfaces| PascalCase          | `User`, `ApiResponse<T>` |

## Path Aliases

- `@` → `./src` (available in both apps and `packages/ui`)

## Testing Guidelines

- Unit test files live alongside source: `*.spec.ts`
- E2E tests live in `apps/*/e2e/`
- Use `@vue/test-utils` for component tests
- Customer app: port 5173 | Admin app: port 5174

## Do Not

- Add dependencies to an app that belong in a shared package
- Use `any` in TypeScript
- Define API response shapes outside `packages/types`
- Add inline styles — use Tailwind classes
- Commit `.env` files or secrets
- Import between apps directly (use packages instead)
