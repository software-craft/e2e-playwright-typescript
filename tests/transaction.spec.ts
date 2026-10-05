import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import userSendAuth from '../.playwright/.auth/userSendAuth.json';
import userReceive from '../.playwright/.auth/userReceiveAuth.json';
import { SendMoneyModal } from '../pages/sendMoneyModal';
import testData from '../data/testData.json';

test.describe.configure({ mode: 'serial' });

// La sesión persistida evita repetir el inicio de sesión en el flujo del emisor.
const testUserSend = test.extend({
  storageState: userSendAuth
});

// Abre el panel del emisor antes de cada escenario asociado a su sesión.
testUserSend.beforeEach(async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.visitDashboard();
})


// Comprueba que el emisor envía dinero al correo configurado del receptor.
testUserSend('TC-12 Verify successful transaction', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  const sendMoneyModal = new SendMoneyModal(page);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await dashboardPage.sendMoneyButton.click();
  await sendMoneyModal.fillAndClickSendButton(testData.validUser.email, '10');
  await expect(dashboardPage.transferSuccessMessage(testData.validUser.email)).toBeVisible();
});

// Espera a que el receptor vea el importe recibido, contemplando la actualización asíncrona.
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
