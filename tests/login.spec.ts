import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import testData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitLoginPage();
});

test('TC-07 Verify login successful with valid credentials', async ({ page }) => {
  await loginPage.registerFormCompleteAndSubmit(testData.validUser.email, testData.validUser.password);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  // await expect(page.getByText('Welcome')).toBeVisible();
});

// test('test', async ({ page }) => {
//  await page.goto('http://localhost:3000/signup');
//  await page.getByTestId('boton-login-header-signup').click();
//  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
//  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
//  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('software@hotmail.com');
//  await page.getByRole('textbox', { name: 'Contraseña' }).click();
//  await page.getByRole('textbox', { name: 'Contraseña' }).fill('123456');
//  await page.getByTestId('boton-login').click();
// });