import { Page, Locator } from '@playwright/test';

/**
 * RegisterPage - Page Object Model for the registration page
 * 
 * This class represents the user registration page and encapsulates all interactions
 * with the registration form. It follows the Page Object Model (POM) pattern.
 * 
 * The registration form has these fields:
 * - First Name
 * - Last Name
 * - Email (must be unique)
 * - Password
 * 
 * Usage:
 *   const registerPage = new RegisterPage(page);
 *   await registerPage.visitRegisterPage();
 *   await registerPage.registerWithData('John', 'Doe', 'john@example.com', 'pass123');
 */
export class RegisterPage {
  // Playwright page object - represents the browser context
  readonly page: Page;

  // Element locators - defined as readonly properties
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  /**
   * Constructor - Initialize the page object and define all locators
   * 
   * @param page - Playwright page object from test context
   * 
   * All UI element selectors are defined here. This follows Playwright
   * best practices for maintainable test code.
   */
  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId('boton-registrarse');
  }

  /**
   * Navigate to the registration page
   * 
   * The registration page is the root path ('/').
   * This method is used in test.beforeEach() to set up the test state.
   */
  async visitRegisterPage() {
    await this.page.goto('http://localhost:3000/');
  }

  /**
   * Fill the registration form fields (without submitting)
   * 
   * @param firstName - User first name
   * @param lastName - User last name
   * @param email - User email (must be unique for each registration)
   * @param password - User password
   * 
   * This method fills all form fields but does NOT click the register button.
   * Useful for tests that validate form state before submission.
   */
  async registerFormComplete(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Click the register button
   * 
   * This is a separate method for test flexibility. You can:
   * - Fill form, validate button state, then click
   * - Test button behavior independently
   * - Add assertions between fill and click
   */
  async clickRegisterButton() {
    await this.registerButton.click();
  }

  /**
   * Complete registration form and submit (convenience method)
   * 
   * @param firstName - User first name
   * @param lastName - User last name  
   * @param email - User email (must be unique)
   * @param password - User password
   * 
   * This combines fill + click for simpler test code.
   * Most tests will use this method for complete registration flow.
   */
  async registerFormCompleteAndSubmit(firstName: string, lastName: string, email: string, password: string) {
    await this.registerFormComplete(firstName, lastName, email, password);
    await this.clickRegisterButton();
  }
}
