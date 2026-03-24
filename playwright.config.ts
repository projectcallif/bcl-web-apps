import { defineConfig, devices } from '@playwright/test'

/**
 * Root Playwright config.
 * Each app has its own testDir and webServer so they run independently.
 * Run all e2e tests: pnpm test:e2e
 * Run one app only:  pnpm test:e2e --project=customer
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // ── Customer app ──────────────────────────────────────────────
    {
      name: 'customer',
      testDir: './apps/customer/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
    },
    {
      name: 'customer-firefox',
      testDir: './apps/customer/e2e',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:5173',
      },
    },

    // ── Admin app ─────────────────────────────────────────────────
    {
      name: 'admin',
      testDir: './apps/admin/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5174',
      },
    },
    {
      name: 'admin-firefox',
      testDir: './apps/admin/e2e',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:5174',
      },
    },
  ],

  webServer: [
    {
      command: 'pnpm --filter @bcl/customer dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter @bcl/admin dev',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
