import { test, expect, request } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import testData from '../data/testData.json';
import { generateUniqueEmail } from '../data/testData';
import { BackendUtils } from '../utils/backendUtils';


let registerPage: RegisterPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let backendUtils: BackendUtils;



test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await registerPage.visitRegisterPage();
});


test('TC-01 Verify visual elements on the register page', async ({ page }) => {
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();

});

test('TC-02 Verify disabled register button', async ({ page }) => {
  await expect(registerPage.registerButton).toBeDisabled();
});

test('TC-03 Verify register button is enabled after completing all fields', async({ page }) => {
  await registerPage.registerFormComplete(testData.validUser.firstName, testData.validUser.lastName, testData.validUser.email, testData.validUser.password );
  await expect(registerPage.registerButton).toBeEnabled();
});

test('TC-04 Verify redirection to login page when clicking the register button', async({ page }) => {
  const email = generateUniqueEmail('Crafter');

  await registerPage.registerFormComplete(testData.validUser.firstName, testData.validUser.lastName, email, testData.validUser.password);

  await registerPage.clickRegisterButton();
  await expect(page).toHaveURL('http://localhost:3000/login');
  await expect(registerPage.passwordInput).toBeVisible();
});

test('TC-05 Verify registration form validation', async ({ page }) => {
  const email = generateUniqueEmail('register');
  await registerPage.registerFormCompleteAndSubmit(testData.validUser.firstName, testData.validUser.lastName, email, testData.validUser.password);
  await expect(page).toHaveURL('http://localhost:3000/login');
});


test('TC-06 Verify that a user cannot register with an existing email address', async ({ page }) => {
  const email = (testData.validUser.email.split('@')[0]) + `${Date.now()}@${testData.validUser.email.split('@')[1]}`;

  await registerPage.registerFormCompleteAndSubmit('Soft', 'Test', email, '1234561');

  await expect(page).toHaveURL('http://localhost:3000/login');

  await registerPage.visitRegisterPage();

  await registerPage.registerFormCompleteAndSubmit('Software', 'Craft', email, '1234561');

  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page).not.toHaveURL('http://localhost:3000/login');
});

test('TC-08 Verify registration form validation with API request', async ({ page }) => {

  await test.step('Fill out the form with valid data', async () => {

    const email = (testData.validUser.email.split('@')[0]) + `${Date.now()}@${testData.validUser.email.split('@')[1]}`;

    await registerPage.registerFormComplete(
      testData.validUser.firstName,
      testData.validUser.lastName,
      email,
      testData.validUser.password
    );

    const responsePromise = page.waitForResponse('http://localhost:6007/api/auth/signup');
    
    await registerPage.clickRegisterButton();
    const response = await responsePromise;
    const responseBody = await response.json();


    expect(response.status()).toBe(201);
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toEqual(expect.objectContaining({

      id: expect.any(String),
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: email,
    }));

    await expect(page).toHaveURL('http://localhost:3000/login');
    await
    expect((await response.body()).toString()).toContain('token');
    await expect(page.getByText('Registro exitoso')).toBeVisible();
  });

});

test('TC-09 Generate signup with API request', async ({ request }) => {
  const endoint = 'http://localhost:6007/api/auth/signup';
  
  const jsonBody = {
    firstName: testData.validUser.firstName,
    lastName: testData.validUser.lastName,
    email: generateUniqueEmail('api'),
    password: testData.validUser.password
  };
  const response = await request.post(endoint, {

    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },    
    data: {
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail('api'),
      password: testData.validUser.password
    }
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: testData.validUser.firstName,
    lastName: testData.validUser.lastName,
    email: expect.stringContaining('@')
  }));
});

test('TC-10 Verify frontend behavior when a 500 error occurs during registration', async ({ page }) => {
  const email = (testData.validUser.email.split('@')[0]) + Date.now().toString();

  // Interceptar la solicitud de registro y devolver un error 500
  await page.route('**/api/auth/signup', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });

  await registerPage.registerFormCompleteAndSubmit(
        testData.validUser.firstName, 
        testData.validUser.lastName, 
        email, 
        testData.validUser.password);


  await expect(page.getByText('Internal Server Error')).toBeVisible();

});


test('TC-11 Login with new user created by backend and verify dashboard', async ({ page, request }) => {

  const userEmail = generateUniqueEmail('api');

  const signupResponse = await request.post('http://localhost:6007/api/auth/signup', {
    data: {
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: userEmail,
      password: testData.validUser.password,
    },
  });

  const signupBody = await signupResponse.json();
  expect(signupResponse.status()).toBe(201);
  expect(signupBody.user.email).toBe(userEmail);

  await loginPage.visitLoginPage();

  const loginResponsePromise = page.waitForResponse('http://localhost:6007/api/auth/login');

  await loginPage.registerFormComplete(userEmail, testData.validUser.password);
  await loginPage.clickLoginButton();

  const loginResponse = await loginResponsePromise;
  const loginBody = await loginResponse.json();

  expect(loginResponse.status()).toBe(200);
  expect(loginBody).toHaveProperty('token');
  expect(typeof loginBody.token).toBe('string');
  expect(loginBody).toHaveProperty('user');
  expect(loginBody.user).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: userEmail,
    })
  );

  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();

});