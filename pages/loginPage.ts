import { Page, Locator } from '@playwright/test';

/**
 * LoginPage - Page Object Model for the login page
 * 
 * This class represents the login page and encapsulates all interactions
 * with the login form. It follows the Page Object Model (POM) pattern to:
 * - Separate test logic from UI element selectors
 * - Make tests more readable and maintainable
 * - Centralize selector management (easy to update if UI changes)
 * 
 * Usage:
 *   const loginPage = new LoginPage(page);
 *   await loginPage.visitLoginPage();
 *   await loginPage.loginWithCredentials('user@example.com', 'password123');
 */
export class LoginPage {
  // Playwright page object - represents the browser context
  readonly page: Page;

  // Element locators (selectors) - defined as readonly properties
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  /**
   * Constructor - Initialize the page object and define all locators
   * 
   * @param page - Playwright page object from test context
   * 
   * This is called once per test to set up the page object.
   * All UI element selectors are defined here.
   */
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByTestId('boton-login');
  }

  /**
   * Navigate to the login page
   * 
   * This method handles navigation to the login URL.
   * Called in test.beforeEach() to reset to login page state.
   */
  async visitLoginPage() {
    await this.page.goto('http://localhost:3000/login');
  }

  /**
   * Fill login form with email and password (without submitting)
   * 
   * @param email - User email address
   * @param password - User password
   * 
   * This method fills the form fields but does NOT click the login button.
   * Useful for tests that validate form behavior before submission.
   */
  async registerFormComplete(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   * 
   * This is a separate method for flexibility. You can:
   * - Fill form, wait for condition, then click button
   * - Fill form, validate button state, then click
   * - Test button behavior independently
   */
  async clickLoginButton() {
    await this.loginButton.click();
  }

  /**
   * Complete login form and submit (convenience method)
   * 
   * @param email - User email address
   * @param password - User password
   * 
   * This method combines fill + click for simpler test code.
   * Most tests will use this method.
   */
  async registerFormCompleteAndSubmit(email: string, password: string) {
    await this.registerFormComplete(email, password);
    await this.clickLoginButton();
  }
}
