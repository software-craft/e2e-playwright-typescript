import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';


test('TC-01 Verify visual elements on the register page', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();

});

test('TC-2 Verify disabled register button', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await expect(registerPage.registerButton).toBeDisabled();
});

test('TC-3 Verify register button is enabled after completing all fields', async({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await registerPage.registerFormComplete('Testing', 'Automation', 'Software' + Date.now().toString() + '@softwarecraft.com', '1234561');
  await expect(registerPage.registerButton).toBeEnabled();
});

test('TC-4 Verify redirection to login page when clicking the signup button', async({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await registerPage.clickRegisterButton();
  await expect(page).toHaveURL('http://localhost:3000/login');
  await expect(registerPage.passwordInput).toBeVisible();
});

test('TC-5 Verify registration form validation', async({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await registerPage.registerFormCompleteAndSubmit('Software', 'Craft', 'Software' + Date.now().toString() + '@softwarecraft.com', '1234561');
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-6 Verify that a user cannot register with an existing email address', async ({ page }) => {
  const email = 'Software' + Date.now().toString() + '@softwarecraft.com';

  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await registerPage.registerFormComplete('Arnaldo', 'Carambolillo', email, '1234561');
  await page.getByTestId('boton-registrarse').click();
  await page.getByAltText('Registro exitoso');

  await registerPage.visitRegisterPage();
  await registerPage.registerFormComplete('Software', 'Craft', email, '1234561');
  await page.locator('input[name="lastName"]').fill('Software');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('1234561');
  await page.getByTestId('boton-registrarse').click();

  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
  await expect(page.getByText('Email already in use')).toBeVisible();
});
