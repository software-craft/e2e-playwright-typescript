import { Page, Locator } from '@playwright/test';

// Reúne las acciones y comprobaciones reutilizables del panel de usuario.
export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;
  readonly addAccountButton: Locator;
  readonly sendMoneyButton: Locator;
  readonly transferSuccessMessage: (recipientEmail: string) => Locator;

  // Crea una sola vez los localizadores que utilizan los métodos del objeto.
  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.getByTestId('titulo-dashboard');
    this.addAccountButton = page.getByTestId('tarjeta-agregar-cuenta');
    this.sendMoneyButton = page.getByTestId('boton-enviar');
    this.transferSuccessMessage = (recipientEmail: string) =>
      page.getByText(`Transferencia enviada a ${recipientEmail}`, { exact: true });
  }

  // Abre el flujo para añadir una cuenta bancaria.
  async addAccount(): Promise<void> {
    await this.addAccountButton.click();
  }

  // Abre el panel y espera a que esté visible sin bloquearse en conexiones persistentes.
  async visitDashboard(): Promise<void> {
    await this.page.goto('http://localhost:3000/dashboard', {
      waitUntil: 'domcontentloaded',
    });
    await this.dashboardTitle.waitFor({ state: 'visible' });
  }

  // Recarga el panel y espera a que vuelva a estar visible antes de continuar.
  async reloadDashboard(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.dashboardTitle.waitFor({ state: 'visible' });
  }

  // Localiza una transacción por importe con dos decimales y el signo indicado.
  getTransactionAmount(amount: string | number, sign = '+'): Locator {
    const formattedAmount = Number(amount).toFixed(2);
    return this.page.getByText(`${sign} ${formattedAmount}`, { exact: true });
  }
}
