import {Page, Locator} from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) { // Inicializate the page and locators
        this.page = page;
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.registerButton = page.getByTestId('boton-registrarse');
    }

    async visitRegisterPage() {
        await this.page.goto('http://localhost:3000/');
    }
async registerFormComplete(firsName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firsName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
}

    async clickRegisterButton() { // especific method to click the register button
        await this.registerButton.click();
    }

    async registerFormCompleteAndSubmit(firsName: string, lastName: string, email: string, password: string) {
    await this.registerFormComplete(firsName, lastName, email, password);
    await this.clickRegisterButton();
}
}
