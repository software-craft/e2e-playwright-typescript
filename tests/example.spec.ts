import { test, expect } from '@playwright/test';

test('TC-01 Verify visual elements on the register page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(5000);

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});