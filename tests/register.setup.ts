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

// Inicializa los Page Objects y navega al formulario antes de cada preparación.
setup.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createAccountModal = new CreateAccountModal(page);

    await loginPage.visitLoginPage();
});

// Crea un emisor aislado, configura su cuenta y persiste su sesión autenticada.
setup('Generate sender user', async ({ page, request }) => {
    // La API crea rápidamente un usuario único antes de cubrir sus acciones en la interfaz.
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

    // Persiste la sesión para reutilizarla en las pruebas de transferencias.
    await page.context().storageState({ path: userSender });
});

// Inicia sesión con el receptor fijo y persiste su estado para verificar la recepción.
setup('Login receiver user', async ({ page, request }) => {
    await loginPage.registerFormCompleteAndSubmit(TestData.validUser.email, TestData.validUser.password);
    await expect(dashboardPage.dashboardTitle).toBeVisible();

    await page.context().storageState({ path: userReceiver });
});