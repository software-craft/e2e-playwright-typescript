import { test as setup, expect } from '@playwright/test';
import { BackendUtils } from '../utils/backendUtils';
import TestData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { CreateAccountModal } from '../pages/createAccountModal';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let createAccountModal: CreateAccountModal;

const userSender = '.playwright/.auth/userSendAuth.json';
const userReceiver = '.playwright/.auth/userReceiveAuth.json';

setup.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createAccountModal = new CreateAccountModal(page);

    await loginPage.visitLoginPage();
});

setup('Generate sender user', async ({ page, request }) => {
    // El API es más rápido y aísla la cuenta / API setup is faster and isolates the account.
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

    await page.waitForTimeout(500);

    await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();

    // Guarda la sesión para no repetir login / Persists auth state to avoid repeated login.
    await page.context().storageState({ path: userSender });
});

setup('Login receiver user', async ({ page, request }) => {
    await loginPage.registerFormCompleteAndSubmit(TestData.validUser.email, TestData.validUser.password);
    await expect(dashboardPage.dashboardTitle).toBeVisible();

    await page.context().storageState({ path: userReceiver });
});