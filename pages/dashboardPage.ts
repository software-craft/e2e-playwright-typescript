import { Page, Locator } from '@playwright/test';

/**
 * DashboardPage - Page Object Model for the user dashboard
 * 
 * This class represents the user dashboard (main page after login).
 * It encapsulates all interactions with dashboard elements.
 * 
 * The dashboard shows:
 * - Dashboard title/header
 * - Add Account button for managing accounts
 * - (Other account management features)
 * 
 * Usage:
 *   const dashboardPage = new DashboardPage(page);
 *   await dashboardPage.visitDashboard();
 *   await dashboardPage.addNewAccount();
 */
export class DashboardPage {
  // Playwright page object - represents the browser context
  readonly page: Page;

  // Element locators - dashboard UI elements
  readonly dashboardTitle: Locator;
  readonly addAccountButton: Locator;

  /**
   * Constructor - Initialize the page object and define all locators
   * 
   * @param page - Playwright page object from test context
   * 
   * All dashboard element selectors are defined here.
   */
  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.getByTestId('titulo-dashboard');
    this.addAccountButton = page.getByTestId('tarjeta-agregar-cuenta');
  }

  /**
   * Navigate to the dashboard page
   * 
   * The dashboard is the main page after successful login.
   * It waits for network idle to ensure the page is fully loaded.
   * 
   * @note This method uses 'networkidle' to ensure all content
   *       (including API calls) has completed loading.
   */
  async visitloginPage() {
    await this.page.goto('http://localhost:3000/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the Add Account button
   * 
   * This action typically opens a modal or navigates to a form
   * for adding a new account/transaction.
   */
  async addAccount() {
    await this.addAccountButton.click();
  }
}



