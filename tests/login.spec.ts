import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import testData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';
import { BackendUtils } from '../utils/backendUtils';

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

});

