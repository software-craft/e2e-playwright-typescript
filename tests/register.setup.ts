import { test as setup, expect } from '@playwright/test';
import { BackendUtils } from '../utils/backendUtils';
import TestData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';


let loginPage: LoginPage;
let dashboardPage: DashboardPage;

const userSender = 'playwright/test/userSendAuth.json';
const userReceiver = 'playwright/test/userReceiveAuth.json';

setup.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.visitLoginPage();
});

setup('Generate sender user', async ({ page, request }) => {
    const newUser = await BackendUtils.registerUser(
        request,
        TestData.validUser.firstName,
        TestData.validUser.lastName,
        TestData.validUser.email,
        TestData.validUser.password
    );

    await loginPage.registerFormCompleteAndSubmit(newUser.email, newUser.password);
    
    await page.waitForTimeout(2000);

    await dashboardPage.addAccount();    
    
});