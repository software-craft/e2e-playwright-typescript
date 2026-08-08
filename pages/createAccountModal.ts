import {Page, Locator} from '@playwright/test';

export class createAccountModal {
    readonly page: Page;
    readonly typeAccountDropdown: Locator;
   

    constructor(page: Page) {
        this.page = page;
        this.typeAccountDropdown = page.getByRole('combobox', { name: 'Tipo de cuenta' });
    }

}



