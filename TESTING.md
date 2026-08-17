# Testing Guide & Best Practices

Practical guide for writing, running, and debugging tests in this Playwright project.

---

## Quick Start: Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test tests/login.spec.ts
```

### Run Tests Matching a Pattern
```bash
npm test -- --grep "TC-07"
```

### Run in Debug Mode (Step Through)
```bash
npm test -- --debug
```

### Run in UI Mode (Watch Tests)
```bash
npm test -- --ui
```

### Run Single Test Only
```bash
npm test -- --grep "^TC-07"
```

---

## Writing Your First Test

### Test Structure

Every test follows this pattern:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Login Feature', () => {
  // Setup - runs before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visitLoginPage();
  });

  // Test case
  test('TC-## Verify login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Act - perform action
    await loginPage.loginWithCredentials('user@example.com', 'password123');
    
    // Assert - verify result
    await expect(page).toHaveURL('**/dashboard');
  });
});
```

### Anatomy of a Test

```typescript
test('TC-## Brief description', async ({ page, request }) => {
  // 1. SETUP - Initialize page objects
  const loginPage = new LoginPage(page);
  
  // 2. ACT - Perform user actions
  await loginPage.visitLoginPage();
  await loginPage.loginWithCredentials('user@example.com', 'password');
  
  // 3. ASSERT - Verify results
  await expect(page).toHaveURL('**/dashboard');
});
```

**The three A's: Arrange → Act → Assert**

---

## Test Examples

### Example 1: Simple UI Test

```typescript
test('TC-01 Verify login page elements are visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Navigate
  await loginPage.visitLoginPage();
  
  // Verify elements exist
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});
```

**What it does:** Verifies UI elements are present on load

### Example 2: Form Submission Test

```typescript
test('TC-07 Verify login successful with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Navigate to login
  await loginPage.visitLoginPage();
  
  // Submit login form
  await loginPage.loginWithCredentials('software@hotmail.com', '123456');
  
  // Verify redirect to dashboard
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});
```

**What it does:** Tests complete login flow end-to-end

### Example 3: Form Validation Test

```typescript
test('TC-02 Verify register button is disabled when form is empty', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  
  // Navigate
  await registerPage.visitRegisterPage();
  
  // Verify button is disabled
  await expect(registerPage.registerButton).toBeDisabled();
});
```

**What it does:** Verifies form behavior (button state)

### Example 4: API Integration Test

```typescript
test('TC-08 Verify signup API returns valid token', async ({ page, request }) => {
  const registerPage = new RegisterPage(page);
  
  await registerPage.visitRegisterPage();
  
  // Wait for API response while submitting form
  const responsePromise = page.waitForResponse('**/api/auth/signup');
  
  await registerPage.registerWithData(
    'John', 'Doe', 'john@example.com', 'password123'
  );
  
  // Get and validate response
  const response = await responsePromise;
  const body = await response.json();
  
  expect(response.status()).toBe(201);
  expect(body.token).toBeDefined();
  expect(body.user.email).toBe('john@example.com');
});
```

**What it does:** Tests API response alongside UI interaction

---

## Common Assertions

### URL Assertions
```typescript
// Exact URL
await expect(page).toHaveURL('http://localhost:3000/dashboard');

// URL pattern (with wildcard)
await expect(page).toHaveURL('**/dashboard');
```

### Element Assertions
```typescript
// Element visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Element state
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();

// Element text
await expect(element).toHaveText('Login');
await expect(element).toContainText('Login');

// Element count
await expect(page.locator('.item')).toHaveCount(5);
```

### Input Assertions
```typescript
// Input value
await expect(element).toHaveValue('expected value');

// Input placeholder
await expect(element).toHaveAttribute('placeholder', 'Email');
```

### Error Assertions
```typescript
// Verify error message appears
await expect(page.getByText('Email already in use')).toBeVisible();

// Verify error message does NOT appear
await expect(page.getByText('Error')).not.toBeVisible();
```

---

## Common User Actions

### Navigation
```typescript
// Navigate to URL
await page.goto('http://localhost:3000/login');

// Click link
await page.click('a[href="/dashboard"]');

// Go back
await page.goBack();
```

### Form Interactions
```typescript
// Fill input
await emailInput.fill('user@example.com');

// Clear input
await emailInput.clear();

// Type (character by character)
await emailInput.type('user@example.com', { delay: 100 });

// Select option
await page.selectOption('select', 'option-value');

// Check checkbox
await checkbox.check();

// Uncheck checkbox
await checkbox.uncheck();
```

### Clicking
```typescript
// Click element
await element.click();

// Double click
await element.dblclick();

// Right click
await element.click({ button: 'right' });

// Click at specific coordinates
await page.click('div', { position: { x: 10, y: 10 } });
```

### Wait Operations
```typescript
// Wait for element to be visible
await page.waitForSelector('.modal', { visible: true });

// Wait for navigation
await page.waitForNavigation();

// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for specific API response
const response = await page.waitForResponse('**/api/users');
```

---

## Debugging Tests

### Debug Mode
```bash
npm test -- --debug
```

**What you can do:**
- Step through tests line by line
- Inspect elements
- View console logs
- Evaluate expressions

**Controls:**
- ⏯ Play/Pause
- ⏭ Step over
- ⬇ Step into
- ⬆ Step out

### UI Mode (Interactive)
```bash
npm test -- --ui
```

**Features:**
- Watch tests run in real-time
- Time travel through steps
- Inspect elements
- Replay failed tests
- View locators

### Headed Mode (See Browser)
```bash
npm test -- --headed
```

Runs tests with visible browser window so you can watch interactions.

### View Traces
```bash
npx playwright show-trace trace/file.zip
```

Traces are automatically recorded for first retry. Useful for debugging why tests fail.

### Add Custom Logs
```typescript
test('My test', async ({ page }) => {
  console.log('About to navigate');
  await page.goto('http://localhost:3000/login');
  console.log('Navigation complete');
});
```

Run with logs visible:
```bash
npm test -- --headed
```

### Use test.step for Organization
```typescript
test('Login flow', async ({ page }) => {
  await test.step('Navigate to login page', async () => {
    await page.goto('http://localhost:3000/login');
  });
  
  await test.step('Enter credentials', async () => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
  });
  
  await test.step('Submit form', async () => {
    await page.click('button[type="submit"]');
  });
  
  await test.step('Verify dashboard', async () => {
    await expect(page).toHaveURL('**/dashboard');
  });
});
```

---

## Best Practices

### ✅ DO

**1. Use Page Objects**
```typescript
// ✅ Good
const loginPage = new LoginPage(page);
await loginPage.loginWithCredentials('user@example.com', 'password');
```

**2. Give Tests Clear Names**
```typescript
// ✅ Good
test('TC-07 Verify login successful with valid credentials', ...)

// ❌ Bad
test('Test login', ...)
```

**3. Separate Setup and Test**
```typescript
// ✅ Good
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');
});

test('TC-07 Login', async ({ page }) => {
  // Just test logic, not setup
});
```

**4. Use Fixtures for Common Setup**
```typescript
// ✅ Good - create user via API once
test.beforeAll(async ({ request }) => {
  const { email, password } = await BackendUtils.registerUser(...);
});
```

**5. Test Behavior, Not Implementation**
```typescript
// ✅ Good - testing what user sees
await expect(dashboardPage.dashboardTitle).toBeVisible();

// ❌ Bad - testing how it's done
expect(page.url()).toContain('dashboard');
```

### ❌ DON'T

**1. Don't Sleep/Wait for Arbitrary Time**
```typescript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

**2. Don't Hardcode Selectors in Tests**
```typescript
// ❌ Bad
await page.click('button.login-btn');

// ✅ Good (use page object)
const loginPage = new LoginPage(page);
await loginPage.clickLoginButton();
```

**3. Don't Make Tests Depend on Each Other**
```typescript
// ❌ Bad - tests depend on order
test('Create user', ...); // Must run first
test('Login user', ...);  // Depends on first test

// ✅ Good - tests are independent
test('Create and login user', ...); // All in one
test('Login with existing user', ...); // Self-contained
```

**4. Don't Skip Error Handling**
```typescript
// ❌ Bad
await page.click('button');

// ✅ Good
await expect(button).toBeVisible();
await button.click();
```

---

## Test Organization

### Group Related Tests
```typescript
test.describe('Registration Feature', () => {
  test.describe('Form Validation', () => {
    test('TC-02 Verify fields are required', ...);
    test('TC-03 Verify email format', ...);
  });
  
  test.describe('Form Submission', () => {
    test('TC-04 Verify successful registration', ...);
    test('TC-06 Verify duplicate email error', ...);
  });
});
```

### Skip or Focus on Tests
```typescript
// Skip this test
test.skip('TC-XX Pending test', ...);

// Only run this test
test.only('TC-07 Focus on this', ...);

// Run this group only
test.describe.only('Priority Tests', () => {
  test('Test 1', ...);
  test('Test 2', ...);
});
```

---

## Performance Tips

### 1. Parallel Execution (Enabled by Default)
Tests run in parallel for speed. To run sequentially:
```typescript
test.describe.serial('Sequential tests', () => {
  test('First', ...);
  test('Second', ...); // Runs after First
});
```

### 2. Use API Setup When Possible
```typescript
// ✅ Fast - register via API
const { email, password } = await BackendUtils.registerUser(...);

// ❌ Slow - register via UI
await registerPage.registerWithData(...);
```

### 3. Reuse Browser Context
```typescript
// Share same browser context across tests
test.describe.serial('Shared context', () => {
  test('Test 1', ...);
  test('Test 2', ...); // Faster
});
```

### 4. Limit Network Activity
```typescript
// Wait for network idle (all requests done)
await page.waitForLoadState('networkidle');

// Only wait for DOM ready
await page.waitForLoadState('domcontentloaded');
```

---

## Troubleshooting

### Test Fails: "Timeout waiting for element"
```typescript
// Increase timeout
test('My test', async ({ page }) => {
  await page.click('button', { timeout: 30000 }); // 30 seconds
});

// Or configure globally in playwright.config.ts
use: {
  actionTimeout: 30000,
}
```

### Test Fails: "Navigation timeout"
```typescript
// Application takes long to load
await page.waitForLoadState('networkidle'); // Wait for all network requests

// or
await page.goto(url, { waitUntil: 'networkidle' });
```

### Test Fails: "Element not found"
```typescript
// Check selector is correct
// Use inspector to verify selector:
await page.goto('about:blank'); // Then use inspector
```

### Test Fails: "Flaky" (Sometimes passes, sometimes fails)

Common causes:
- ❌ Not waiting for element to be ready
- ❌ Race conditions (multiple async operations)
- ❌ Timeout too short
- ❌ Network issues

**Solution:**
```typescript
// Wait explicitly for element
await expect(element).toBeVisible();
await element.click();

// Or wait for specific condition
await page.waitForLoadState('networkidle');
await page.waitForFunction(() => {
  return document.querySelectorAll('.item').length > 0;
});
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Reports

### View HTML Report
```bash
npm test
npx playwright show-report
```

**Report shows:**
- Test results summary
- Passed/failed tests
- Screenshots of failures
- Video recordings (if enabled)
- Test duration

---

## Next Steps

- ✅ Read [README.md](./README.md) for project overview
- ✅ Read [SETUP.md](./SETUP.md) for environment setup
- ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
- ✅ Explore page objects in `pages/` folder
- ✅ Run existing tests to see examples
- ✅ Create your first test

---

**Questions?** Check the [Playwright Documentation](https://playwright.dev)
