---
trigger: always_on
---

# Workspace Rules & Initialization

You are operating within an established PNPM Monorepo Vue 3 codebase. The architectural guidelines, tech stack constraints, and formatting rules have already been defined by the project owner.

## 1. Primary Directives (The Source of Truth)
Do not use your default coding patterns. Before answering any prompts, scaffolding any features, or executing any edits, you MUST silently read, internalize, and strictly adhere to the project rules defined in:
- `CLAUDE.md` (Root project rules)
- `docs/architecture.md`
- `docs/design-system.md`
- `docs/api-contracts.md`
- `docs/contributing.md`

## 2. Monorepo Boundaries
- **Types:** NEVER define raw interfaces inside the `apps/` directory. All shared business logic types and API contracts MUST be imported from `packages/types/src/...`.
- **UI Components:** NEVER build raw HTML buttons or inputs inside the `apps/` directory. You MUST use and extend the primitives from `packages/ui/src/components/...` (e.g., `BaseButton`, `AppTextInput`).
- **State:** Use the existing store patterns (e.g., `features/auth/store.ts`).

## 3. Strict UI Requirement: Absolute Responsiveness
- EVERY single piece of UI you generate must be highly responsive. 
- Mobile-first methodology is mandatory. Ensure components scale elegantly from mobile screens up to large desktop viewports. 
- Adhere strictly to the styling guidelines defined in `docs/design-system.md` and `packages/ui/src/theme.css`.