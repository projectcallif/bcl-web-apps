import { test, expect } from '@playwright/test'

test('dashboard loads and shows heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})

test('sidebar navigation links are present', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Users' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible()
})

test('navigates to users page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Users' }).click()
  await expect(page).toHaveURL('/users')
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
})

test('dashboard shows stats cards', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Total Users')).toBeVisible()
  await expect(page.getByText('Active Users')).toBeVisible()
  await expect(page.getByText('Inactive Users')).toBeVisible()
})
