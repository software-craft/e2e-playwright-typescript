import { Page, Locator } from '@playwright/test';

// Modela las acciones para crear una cuenta desde el panel.
export class CreateAccountModal {
    readonly page: Page;
    readonly typeAccountDropdown: Locator;
    readonly amountInput: Locator;
    readonly cancelButton: Locator;
    readonly createAccountButton: Locator;

    // Prepara los localizadores del tipo, importe inicial y botones del diálogo.
    constructor(page: Page) {
        this.page = page;

        this.typeAccountDropdown = page.getByRole('combobox', { name: 'Tipo de cuenta' });

       
        this.amountInput = page.getByRole('spinbutton', { name: 'Monto inicial *' });

        this.cancelButton = page.getByTestId('boton-cancelar-crear-cuenta');
        this.createAccountButton = page.getByTestId('boton-crear-cuenta');
    }

    // Abre la lista de tipos y selecciona la opción solicitada.
    async selectAccountType(accountType: string) {
        await this.typeAccountDropdown.click();
        await this.page.getByRole('option', { name: accountType }).click();
    }

    // Introduce el saldo inicial de la cuenta nueva.
    async completeAmountInput(amount: string) {
        await this.amountInput.click();
        await this.amountInput.fill(amount);
    }

    // Confirma la creación con los datos actualmente introducidos.
    async submitCreateAccount() {
        await this.createAccountButton.click();
    }
}