import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import userSendAuth from '../.playwright/.auth/userSendAuth.json';
import userReceive from '../.playwright/.auth/userReceiveAuth.json';

const testUserSend = test.extend({
  storageState: userSendAuth
});

const testUserReceive = test.extend({
  storageState: userReceive
});

test.beforeEach(async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.visitPageDashboard();
})

testUserSend('TC-12 Verify successful transaction', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await page.waitForTimeout(250);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await dashboardPage.sendMoneyButton.click();
  await page.waitForTimeout(500);
});