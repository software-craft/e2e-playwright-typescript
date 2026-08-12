import {Page, Locator} from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly addAccountButton: Locator;
   

    constructor(page: Page) { // Initialize the page and locators
        this.page = page;
        this.dashboardTitle = page.getByTestId('titulo-dashboard');
        this.addAccountButton = page.getByTestId('tarjeta-agregar-cuenta');
        
    }
    
    async visitloginPage() {
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForLoadState('networkidle');
    }

    async addAccount() {
        await this.addAccountButton.click();
    }

   

}



