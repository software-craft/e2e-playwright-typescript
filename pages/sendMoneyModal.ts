import { Page, Locator } from '@playwright/test';
import testData from '../data/testData.json';

export class SendMoneyModal {
    readonly page: Page;
    readonly recipientEmailInput: Locator;
    readonly sourceAccountDropdown: Locator;
    readonly amountInput: Locator;
    readonly senderButton: Locator;
    readonly cancelButton: Locator;
    readonly originAccountOption: Locator;

    constructor(page: Page) {
        this.page = page;
        this.recipientEmailInput = page.getByRole('textbox', { name: 'Email del destinatario *' });
        this.sourceAccountDropdown = page.getByRole('combobox', { name: 'Cuenta origen *'})
        this.amountInput = page.getByRole('spinbutton', { name: 'Monto a enviar *'})
        this.cancelButton = page.getByTestId('boton-cancelar-enviar')
        this.senderButton = page.locator('.MuiDialog-paper').getByRole('button', { name: 'ENVIAR' });
        this.originAccountOption = page.getByRole('option').first();
    }

    async fillAndClickSendButton(recipientEmailInput: string, amountInput: string ) {

        await this.recipientEmailInput.fill(recipientEmailInput)
        await this.sourceAccountDropdown.click();
        await this.originAccountOption.click();
        await this.amountInput.fill(amountInput);
        await this.senderButton.click();
    }
}