import { Page, Locator } from '@playwright/test';

// Encapsula los localizadores y las acciones disponibles en la pantalla de inicio de sesión.
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // Vincula la instancia a la página y prepara localizadores reutilizables para el formulario.
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByTestId('boton-login');
  }

  // Abre la ruta de inicio de sesión de la aplicación.
  async visitLoginPage() {
    await this.page.goto('http://localhost:3000/login');
  }

  // Completa las credenciales sin enviar el formulario.
  async registerFormComplete(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  // Envía las credenciales introducidas.
  async clickLoginButton() {
    await this.loginButton.click();
  }

  // Completa y envía el formulario como una única acción reutilizable.
  async registerFormCompleteAndSubmit(email: string, password: string) {
    await this.registerFormComplete(email, password);
    await this.clickLoginButton();
  }
}
