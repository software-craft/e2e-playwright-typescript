import {Page, Locator} from '@playwright/test';

export class LoginPage {
    readonly page: Page;
  
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) { // Inicializate the page and locators
        this.page = page;
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByTestId('boton-login');
    }

    async visitLoginPage() {
        await this.page.goto('http://localhost:3000/login');
    }

async registerFormComplete(email: string, password: string) {

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
}

    async clickLoginButton() { // especific method to click the login button
        await this.loginButton.click();
    }

    async registerFormCompleteAndSubmit(email: string, password: string) {
    await this.registerFormComplete(email, password);
    await this.clickLoginButton();
}
}
