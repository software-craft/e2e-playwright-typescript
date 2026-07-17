import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import testData from '../data/testData.json';

let registerPage: RegisterPage;


test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
});

test('TC-01 Verify visual elements on the register page', async ({ page }) => {
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();

});

test('TC-2 Verify disabled register button', async ({ page }) => {
  await expect(registerPage.registerButton).toBeDisabled();
});

test('TC-3 Verify register button is enabled after completing all fields', async({ page }) => {
  await registerPage.registerFormComplete('Testing', 'Automation', 'Software' + Date.now().toString() + '@softwarecraft.com', '1234561');
  await expect(registerPage.registerButton).toBeEnabled();
});

test('TC-4 Verify redirection to login page when clicking the signup button', async({ page }) => {
  await registerPage.clickRegisterButton();
  await expect(page).toHaveURL('http://localhost:3000/login');
  await expect(registerPage.passwordInput).toBeVisible();
});

test('TC-5 Verify registration form validation', async({ page }) => {
  await registerPage.registerFormCompleteAndSubmit(testData.validUser.firsName, testData.validUser.lastName, testData.validUser.email, testData.validUser.password );
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-6 Verify that a user cannot register with an existing email address', async ({ page }) => {

  const email = 'Software' + Date.now().toString() + '@softwarecraft.com';

  await registerPage.registerFormCompleteAndSubmit('Soft', 'Test', email, '1234561');
  await page.getByAltText('Registro exitoso');

  
  await registerPage.registerFormComplete('Software', 'Craft', email, '1234561');


  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
  await expect(page.getByText('Email already in use')).toBeVisible();

});
