import { test, expect } from '@playwright/test';

test('TC-01 Verify visual elements on the register page', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.waitForTimeout(3000)
  expect(page.locator('input[name="firstName"]')).toBeVisible();
  expect(page.locator('input[name="lastName"]')).toBeVisible();
  expect(page.locator('input[name="email"]')).toBeVisible();
  expect(page.locator('input[name="password"]')).toBeVisible();
  expect(page.locator('input[name="password"]')).toBeVisible();
  expect(page.getByTestId('boton-registrarse')).toBeVisible();

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});