import {Page, Locator} from '@playwright/test';

export class createAccountModal {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly addAccountButton: Locator;

    constructor(page: Page) { // Initialize the page and locators
        this.page = page;
        this.dashboardTitle = page.getByTestId('titulo-dashboard');
        this.addAccountButton = page.getByTestId('tarjeta-agregar-cuenta');
    }

    async visitDashboardPage() {
        await this.page.goto('http://localhost:3000/dashboard');
    }

    async addAccount() {
    await this.addAccountButton.click();
}
}



