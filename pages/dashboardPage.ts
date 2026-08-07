import {Page, Locator} from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
   

    constructor(page: Page) { // Initialize the page and locators
        this.page = page;
        
    }
  
}



