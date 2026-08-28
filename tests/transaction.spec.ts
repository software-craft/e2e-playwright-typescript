import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import userSendAuth from '../.playwright/.auth/userSendAuth.json';
import userReceive from '../.playwright/.auth/userReceiveAuth.json';
import { SendMoneyModal } from '../pages/sendMoneyModal';
import testData from '../data/testData.json';

test.describe.configure({ mode: 'serial' });

const testUserSend = test.extend({
  storageState: userSendAuth
});

testUserSend.beforeEach(async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.visitPageDashboard();
})


testUserSend('TC-12 Verify successful transaction', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  const sendMoneyModal = new SendMoneyModal(page);
  await page.waitForTimeout(250);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await dashboardPage.sendMoneyButton.click();
  await sendMoneyModal.fillAndClickSendButton(testData.validUser.email, '10');
  await expect(page.getByText(`Transferencia enviada a ${testData.validUser.email}`)).toBeVisible();
  await page.waitForTimeout(250);


});

