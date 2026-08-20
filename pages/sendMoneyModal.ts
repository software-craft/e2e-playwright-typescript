import { Page, Locator } from '@playwright/test';

export class SendMoneyModal {
    readonly page: Page;
    readonly recipientEmailInput: Locator;
    readonly sourceAccountDropdown: Locator;
    readonly amountInput: Locator;
    readonly senderButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.recipientEmailInput = page.getByRole('textbox', { name: 'Email del destinatario *' });
        this.sourceAccountDropdown = page.getByRole('combobox', { name: 'Cuenta origen *'})
        this.amountInput = page.getByRole('spinbutton', { name: 'Monto *'})
        this.cancelButton = page.getByTestId('boton-cancelar-enviar')
        this.senderButton = page.getByTestId('boton-enviar')    
    }
}