import { test as setup, expect, APIRequestContext } from '@playwright/test';
import { backendUtils } from '../utils/backendUtils';
import { LoginPage } from '../pages/loginPage';
import testData from '../data/testData.json';

let loginPage: LoginPage;
let backendUtils: backendUtils;

const userSendAuthfile = 'playwright/.auth/userSendAuth.json';
const userReceiveAuthfile = 'playwright/.auth/userReceiveAuth.json';

setup.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.visitLoginPage();
});

setup('Generar usuario a traves de la API', async ({ page, request }) => {
    const newUser = await new backendUtils(request).generateUniqueUser(testData.validUser);

    const responsePromise = page.waitForResponse('http://localhost:6007/api/auth/register');
    
    await responsePromise;
});