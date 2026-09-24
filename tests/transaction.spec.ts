import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import userSendAuth from '../.playwright/.auth/userSendAuth.json';
import userReceive from '../.playwright/.auth/userReceiveAuth.json';
import { SendMoneyModal } from '../pages/sendMoneyModal';
import testData from '../data/testData.json';

test.describe.configure({ mode: 'serial' });

// La sesión persistida enfoca la prueba en transferencias / Persisted auth focuses tests on transfers.
const testUserSend = test.extend({
  storageState: userSendAuth
});

testUserSend.beforeEach(async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.visitDashboard();
})


testUserSend('TC-12 Verify successful transaction', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  const sendMoneyModal = new SendMoneyModal(page);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await dashboardPage.sendMoneyButton.click();
  await sendMoneyModal.fillAndClickSendButton(testData.validUser.email, '10');
  await expect(dashboardPage.transferSuccessMessage(testData.validUser.email)).toBeVisible();
});

test.extend({ storageState: userReceive })(
  'TC-13 Verify recipient receives the transfer',
  async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.visitDashboard();
    await expect.poll(
      async () => {
        await dashboardPage.reloadDashboard();
        return await dashboardPage.getTransactionAmount(10).count();
      },
      { timeout: 30000, intervals: [1000, 2000, 5000] }
    ).toBeGreaterThan(0);
  }
);
