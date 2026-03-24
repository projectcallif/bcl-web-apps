import { test, expect } from '@playwright/test'

test('home page loads and shows welcome heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /welcome to bcl customer/i })).toBeVisible()
})

test('navigation links are present', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
})

test('navigates to about page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL('/about')
  await expect(page.getByRole('heading', { name: /about bcl customer/i })).toBeVisible()
})

test('counter increments and decrements', async ({ page }) => {
  await page.goto('/')
  const counterHeading = page.getByRole('heading', { name: /counter:/i })
  await expect(counterHeading).toContainText('Counter: 0')

  await page.getByRole('button', { name: '+' }).click()
  await expect(counterHeading).toContainText('Counter: 1')

  await page.getByRole('button', { name: '−' }).click()
  await expect(counterHeading).toContainText('Counter: 0')
})
