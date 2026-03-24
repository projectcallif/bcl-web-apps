import { defineWorkspace } from 'vitest/config'

// Root-level workspace config — runs all unit tests across apps & packages
// from a single `pnpm test:unit` command at the repo root.
export default defineWorkspace([
  {
    extends: './apps/customer/vite.config.ts',
    test: {
      name: 'customer',
      root: './apps/customer',
    },
  },
  {
    extends: './apps/admin/vite.config.ts',
    test: {
      name: 'admin',
      root: './apps/admin',
    },
  },
  {
    extends: './packages/ui/vite.config.ts',
    test: {
      name: 'ui',
      root: './packages/ui',
    },
  },
])
