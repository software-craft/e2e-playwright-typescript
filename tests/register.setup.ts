import { test as setup, expect, APIRequestContext } from '@playwright/test';
import { backendUtils } from '../utils/backendUtils';
import { LoginPage } from '../pages/loginPage';
import testData from '../data/testData.json';

let loginPage: LoginPage;

const userSendAuthfile = 'playwright/.auth/userSendAuth.json';
const userReceiveAuthfile = 'playwright/.auth/userReceiveAuth.json';

setup.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.visitLoginPage();
});

setup('Generate user that sends money', async ({ page, request }) => {
    const utils = new backendUtils(page);
    const newUser = await utils.generateUniqueUser(request, testData.validUser);

    const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');
    await loginPage.registerFormCompleteAndSubmit(newUser.email, testData.validUser.password);
    await responsePromiseLogin;

    
    await page.context().storageState({ path: userSendAuthfile });
});