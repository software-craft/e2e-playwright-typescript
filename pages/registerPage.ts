import { Page, Locator } from '@playwright/test';

// Centraliza los localizadores y las acciones del formulario de registro.
export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  // Asocia los campos del formulario y el botón a la página recibida.
  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId('boton-registrarse');
  }

  // Abre la página inicial, donde se presenta el formulario de registro.
  async visitRegisterPage() {
    await this.page.goto('http://localhost:3000/');
  }

  // Rellena los datos del usuario sin enviar el formulario.
  async registerFormComplete(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  // Envía el formulario de registro.
  async clickRegisterButton() {
    await this.registerButton.click();
  }

  // Completa y envía el registro con las acciones reutilizables del objeto.
  async registerFormCompleteAndSubmit(firstName: string, lastName: string, email: string, password: string) {
    await this.registerFormComplete(firstName, lastName, email, password);
    await this.clickRegisterButton();
  }
}
