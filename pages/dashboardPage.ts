import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;
  readonly addAccountButton: Locator;
  readonly sendMoneyButton: Locator;
  readonly transferSuccessMessage: (recipientEmail: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.getByTestId('titulo-dashboard');
    this.addAccountButton = page.getByTestId('tarjeta-agregar-cuenta');
    this.sendMoneyButton = page.getByTestId('boton-enviar')
    this.transferSuccessMessage = (recipientEmail: string) =>
      page.getByText(`Transferencia enviada a ${recipientEmail}`, { exact: true });
  }

  async addAccount() {
    await this.addAccountButton.click();
  }

  async visitDashboard() {
    // DOMContentLoaded evita conexiones largas / Avoids waiting for long-lived connections.
    await this.page.goto('http://localhost:3000/dashboard', {
      waitUntil: 'domcontentloaded'
    });
    await this.dashboardTitle.waitFor({ state: 'visible' });
  }

  async reloadDashboard() {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.dashboardTitle.waitFor({ state: 'visible' });
  }

  getTransactionAmount(amount: string | number, sign = '+'): Locator {
    const formattedAmount = Number(amount).toFixed(2);
    return this.page.getByText(`${sign} ${formattedAmount}`, { exact: true });
  }

}
