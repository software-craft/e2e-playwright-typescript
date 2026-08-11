import {Page, Locator} from '@playwright/test';

export class modalCreateAccount {
    readonly page: Page;
    readonly typeAccountDropdown: Locator;
   

    constructor(page: Page) {
        this.page = page;
        this.typeAccountDropdown = page.getByRole('combobox', { name: 'Tipo de cuenta' });
    }

    async selectAccountType(accountType: string) {
        await this.typeAccountDropdown.click();
        await this.page.getByRole('option', { name: accountType }).click();
    }

}



