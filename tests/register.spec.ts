import { test, expect } from '@playwright/test';

test('TC-01 Verify visual elements on the register page', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.waitForTimeout(3000)
  expect(page.locator('input[name="firstName"]')).toBeVisible();
  expect(page.locator('input[name="lastName"]')).toBeVisible();
  expect(page.locator('input[name="email"]')).toBeVisible();
  expect(page.locator('input[name="password"]')).toBeVisible();
  expect(page.getByTestId('boton-registrarse')).toBeVisible();

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});

test('TC-2 Verify disabled register button', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
});

test('TC-3 Verify register button is enabled after completing all fields', async({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Arnaldo')
  await page.locator('input[name="lastName"]').fill('Carambolillo')
  await page.locator('input[name="email"]').fill('Mister@coso.com')
  await page.locator('input[name="password"]').fill('123456')
  expect(page.getByTestId('boton-registrarse')).toBeEnabled();
});

test('TC-4 Verify redirection to login page when clicking the signup button', async({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('boton-login-header-signup').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
  expect(page.locator("input[name='password']")).toBeVisible();
});

test('TC-5 Verify registration form validation', async({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Arnaldo');
  await page.locator('input[name="lastName"]').fill ('Carambolillo');
  await page.locator('input[name="email"]').fill ('Mister' + Date.now().toString() + '@coso.com');
  await page.locator('input[name="password"]').fill ('1234561');
  await page.getByTestId('boton-registrarse').click();
  await page.getByAltText('Registro exitoso');
});

test('TC-6 Verify that a user cannot register with an existing email address', async ({ page }) => {
  const email = 'Mister' + Date.now().toString() + '@coso.com';

  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Arnaldo');
  await page.locator('input[name="lastName"]').fill('Carambolillo');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('1234561');
  await page.getByTestId('boton-registrarse').click();
  await page.getByAltText('Registro exitoso');

  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Arnaldo');
  await page.locator('input[name="lastName"]').fill('Carambolillo');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('1234561');
  await page.getByTestId('boton-registrarse').click();

  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
  await expect(page.getByText('Email already in use')).toBeVisible();
});
