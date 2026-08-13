import { test as setup, expect } from '@playwright/test';
import { BackendUtils } from '../utils/backendUtils';
import TestData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { modalCreateAccount } from '../pages/createAccountModal';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let createAccountModal: modalCreateAccount;

const userSender = 'playwright/test/userSendAuth.json';
const userReceiver = 'playwright/test/userReceiveAuth.json';

setup.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createAccountModal = new modalCreateAccount(page);

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

    await dashboardPage.addAccount();

    await createAccountModal.selectAccountType('Débito');

    await createAccountModal.completeAmountInput('1000');

    await createAccountModal.submitCreateAccount();

    await page.waitForTimeout(1000);
});