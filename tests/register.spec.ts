import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import testData from '../data/testData.json';
import { generateUniqueEmail } from '../data/testData';

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
  await registerPage.registerFormComplete(testData.validUser.firsName, testData.validUser.lastName, testData.validUser.email, testData.validUser.password );
  await expect(registerPage.registerButton).toBeEnabled();
});

test('TC-4 Verify redirection to login page when clicking the register button', async({ page }) => {
  const email = generateUniqueEmail('Crafter');

  await registerPage.registerFormComplete(testData.validUser.firsName, testData.validUser.lastName, email, testData.validUser.password);

  await registerPage.clickRegisterButton();
  await expect(page).toHaveURL('http://localhost:3000/login');
  await expect(registerPage.passwordInput).toBeVisible();
});

test('TC-5 Verify registration form validation', async ({ page }) => {
  const email = generateUniqueEmail('register');
  await registerPage.registerFormCompleteAndSubmit(testData.validUser.firsName, testData.validUser.lastName, email, testData.validUser.password);
  await expect(page).toHaveURL('http://localhost:3000/login');
});


test('TC-6 Verify that a user cannot register with an existing email address', async ({ page }) => {
  const email = generateUniqueEmail('duplicate');

  await registerPage.registerFormCompleteAndSubmit('Soft', 'Test', email, '1234561');
  await expect(page.getByAltText('Registro exitoso')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:3000/login');

  await registerPage.visitRegisterPage();

  await registerPage.registerFormCompleteAndSubmit('Software', 'Craft', email, '1234561');

  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page).not.toHaveURL('http://localhost:3000/login');
});