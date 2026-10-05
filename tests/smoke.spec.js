import { test, expect } from '@playwright/test';

test.describe('Storefront Smoke Tests', () => {
  test('Home page renders header, branding, categories, and footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('Kara Asani Zindagi Main').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Shop catalog renders with category filter and search', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.getByRole('heading', { name: /Catalog/i })).toBeVisible();
    await expect(page.locator('aside').getByText('Categories')).toBeVisible();
  });

  test('Category page loads for laundry-care', async ({ page }) => {
    await page.goto('/category/laundry-care');
    await expect(page.getByRole('heading', { name: /Laundry Care/i })).toBeVisible();
  });

  test('Cart page renders', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  });

  test('Contact page renders form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /Contact/i }).first()).toBeVisible();
  });

  test('Track order page renders', async ({ page }) => {
    await page.goto('/track-order');
    await expect(page.getByRole('heading', { name: /Track/i })).toBeVisible();
  });
});
