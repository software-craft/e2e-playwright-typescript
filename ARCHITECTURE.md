# Architecture & Design Patterns

## Overview

This document explains the architecture, design patterns, and technical decisions behind the e2e-login-test project. It's designed for developers who want to understand **how** and **why** the project is structured this way.

---

## 1. Page Object Model (POM) Pattern

### What is POM?

The **Page Object Model** is a design pattern that:
- Creates a class for each page/feature in the application
- Encapsulates all interactions with that page
- Separates test logic from UI element selectors
- Makes tests more readable and maintainable

### Structure

```
pages/
├── loginPage.ts          # Represents the login page
├── registerPage.ts       # Represents the register page
├── dashboardPage.ts      # Represents the dashboard page
└── createAccountModal.ts # Represents a modal component
```

### Example: LoginPage

```typescript
// pages/loginPage.ts
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByTestId('boton-login');
  }

  async visitLoginPage() {
    await this.page.goto('http://localhost:3000/login');
  }

  async loginWithCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Usage in Tests

```typescript
// tests/login.spec.ts
import { LoginPage } from '../pages/loginPage';

test('TC-07 Verify login successful with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.visitLoginPage();
  await loginPage.loginWithCredentials('user@example.com', 'password123');
  
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});
```

### Benefits

| Benefit | Explanation |
|---------|-------------|
| **Readability** | Tests read like plain English |
| **Maintainability** | Change selectors in one place |
| **Reusability** | Use same page object in multiple tests |
| **Scalability** | Easy to add new pages and tests |
| **Debugging** | Easier to identify what failed |

---

## 2. Test Data Management

### Centralized Test Data

All test data is stored in `data/testData.json`:

```json
{
  "validUser": {
    "firstName": "Software",
    "lastName": "Craft",
    "email": "software@hotmail.com",
    "password": "123456"
  }
}
```

**Why?**
- Single source of truth for test data
- Easy to update test credentials
- Can be overridden by environment variables
- Supports multiple test scenarios

### Test Data Utilities

The `data/testData.ts` file provides helper functions:

```typescript
// Generate unique emails to avoid duplicates
export function generateUniqueEmail(prefix: string): string {
  return `${prefix}${Date.now()}@example.com`;
}
```

**Usage:**
```typescript
const uniqueEmail = generateUniqueEmail('testuser');
// Result: testuser1692876543210@example.com
```

### Why Unique Emails?

Registration tests need to create new users. Without unique emails:
- Tests fail if run multiple times
- Email uniqueness constraints prevent registration
- Tests interfere with each other

**Solution:** Use timestamp-based unique identifiers

---

## 3. Multi-Layer Testing Strategy

### Level 1: UI Testing (Page Objects)

Tests user-facing behavior through the browser:

```typescript
test('Verify form fields are visible', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await expect(registerPage.emailInput).toBeVisible();
});
```

**Covers:**
- Visual elements
- Form behavior
- User interactions
- Navigation flows

### Level 2: Form Validation Testing

Tests form behavior and validation:

```typescript
test('Verify required fields', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.visitRegisterPage();
  await expect(registerPage.registerButton).toBeDisabled();
});
```

**Covers:**
- Required field validation
- Button states
- Error messages
- Field formatting

### Level 3: API Testing (Backend Validation)

Tests backend endpoints directly:

```typescript
test('Verify signup API returns valid token', async ({ page, request }) => {
  const response = await BackendUtils.registerUser(
    request, 'John', 'Doe', 'john@example.com', 'password123'
  );
  
  expect(response.status()).toBe(201);
  expect(response.token).toBeDefined();
});
```

**Covers:**
- API response status codes
- Response payload structure
- Business logic validation
- Error handling

### Pyramid Model

```
        /\
       /  \  API Testing
      /____\
      
     /    \
    / Form \  UI & Validation Testing
   /______\ 
   
  /        \
 / Basic UI \  Smoke Tests
/____________\
```

---

## 4. Test Setup & Fixtures

### register.setup.ts

This file runs **before** other tests to set up authentication:

```typescript
// tests/register.setup.ts
test.describe.serial('Generate signup with API request', () => {
  test('Generate sender user setup', async ({ request }) => {
    const credentials = await BackendUtils.registerUser(
      request, 'Sender', 'User', 'sender@example.com', 'password123'
    );
    // Save credentials for other tests
  });
});
```

**Purpose:**
- Create test users before running tests
- Store authentication tokens
- Set up preconditions for tests
- Reduce test execution time

**Playwright Config:**
```typescript
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  { name: 'chromium', dependencies: ['setup'] },
  // chromium tests run AFTER setup
]
```

---

## 5. Directory Structure Explained

### `/tests` — Test Specifications

```
tests/
├── login.spec.ts          # Test cases for login functionality
├── register.spec.ts       # Test cases for registration
├── transaction.spec.ts    # Test cases for post-login features
└── register.setup.ts      # Setup/fixture tests
```

**Each file contains:**
- `test.beforeEach()` — Setup before each test
- `test('TC-## Description', ...)` — Individual test case
- Assertions using `expect()`

### `/pages` — Page Object Models

```
pages/
├── loginPage.ts          # Locators + methods for login page
├── registerPage.ts       # Locators + methods for register page
├── dashboardPage.ts      # Locators + methods for dashboard
└── createAccountModal.ts # Modal component
```

**Each file contains:**
- `Locators` — Element selectors
- `Methods` — User actions (fill, click, navigate)
- `Constructor` — Initialize page with Playwright page object

### `/data` — Test Data

```
data/
├── testData.json  # Static test data (users, emails, etc.)
└── testData.ts    # Utility functions (generateUniqueEmail, etc.)
```

### `/utils` — Shared Utilities

```
utils/
└── backendUtils.ts  # API testing helpers
```

**Contains:**
- API request methods
- Response validation
- Reusable backend operations

---

## 6. Playwright Configuration

### Key Configuration Options

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',           // Where to find tests
  fullyParallel: true,          // Run tests in parallel
  forbidOnly: !!process.env.CI, // Prevent test.only on CI
  retries: process.env.CI ? 2 : 0,  // Retry failed tests on CI
  workers: process.env.CI ? 1 : undefined,  // Workers for parallel execution
  reporter: 'html',             // Generate HTML reports
  
  use: {
    baseURL: 'http://localhost:6007',  // Base URL for all tests
    trace: 'on-first-retry',           // Record traces for failed tests
  },
  
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'chromium', use: devices['Desktop Chrome'], dependencies: ['setup'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
```

### Why These Settings?

| Setting | Reason |
|---------|--------|
| `fullyParallel: true` | Faster test execution |
| `retries: 2` on CI | Handle flaky network issues |
| `trace: 'on-first-retry'` | Debug failures without recording all tests |
| `baseURL` | DRY principle — no hardcoding URLs |
| Multiple projects | Verify cross-browser compatibility |

---

## 7. TypeScript Integration

### Benefits of TypeScript

```typescript
// With TypeScript (Type-safe)
export class LoginPage {
  constructor(page: Page) { /* ... */ }
  
  async login(email: string, password: string): Promise<void> {
    // IDE knows types, catches errors at compile-time
  }
}

// Without TypeScript (No type checking)
export class LoginPage {
  constructor(page) { /* ... */ }
  
  async login(email, password) {
    // Runtime errors possible
  }
}
```

**Advantages:**
- ✅ IDE autocomplete and type hints
- ✅ Catch errors before running tests
- ✅ Self-documenting code (types are documentation)
- ✅ Refactoring safely

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,  // Enable strict type checking
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 8. Test Isolation & Independence

### Why Test Isolation Matters

Tests should **not depend on each other**:

```typescript
// ❌ BAD: Tests depend on execution order
test('First: Create user', () => { /* ... */ });
test('Second: Login with created user', () => { /* ... */ });  // Fails if first test doesn't run

// ✅ GOOD: Each test is independent
test('Register new user', () => { /* ... */ });
test('Login with valid credentials', () => { /* ... */ });
```

### How We Achieve Isolation

1. **Fresh test data per test:**
   ```typescript
   test('Register user', async ({ page }) => {
     const email = generateUniqueEmail('test');  // Unique every time
     await registerPage.register(email, password);
   });
   ```

2. **Setup fixtures:**
   ```typescript
   test.beforeEach(async ({ page }) => {
     registerPage = new RegisterPage(page);  // Fresh instance
     await registerPage.visitRegisterPage(); // Clean state
   });
   ```

3. **API setup:**
   ```typescript
   test('Login', async ({ request }) => {
     const { email, password } = await BackendUtils.registerUser(request, ...);
     // No state depends on previous test
   });
   ```

---

## 9. Scaling & Maintenance

### Adding a New Test

1. **Create page object** (if needed):
   ```typescript
   // pages/newFeaturePage.ts
   export class NewFeaturePage {
     constructor(page: Page) { /* ... */ }
     async interactWithFeature() { /* ... */ }
   }
   ```

2. **Add test data** (if needed):
   ```json
   // data/testData.json
   { "newFeature": { "testField": "value" } }
   ```

3. **Write test**:
   ```typescript
   // tests/newFeature.spec.ts
   test('TC-## Verify new feature', async ({ page }) => {
     const featurePage = new NewFeaturePage(page);
     // ... test implementation
   });
   ```

### Adding a New Page Object

Follow the POM pattern:

```typescript
export class MyNewPage {
  readonly page: Page;
  readonly myElement: Locator;  // Define locators as properties
  
  constructor(page: Page) {
    this.page = page;
    this.myElement = page.locator('selector');
  }
  
  async myAction() {
    // Encapsulate actions as methods
  }
}
```

---

## 10. Common Patterns

### Pattern 1: Wait for Condition

```typescript
await expect(page.locator('.loading')).toHaveCount(0);  // Wait for loading to complete
await page.waitForLoadState('networkidle');  // Wait for network
```

### Pattern 2: Handle Dialogs

```typescript
page.once('dialog', dialog => {
  console.log('Dialog message:', dialog.message());
  dialog.dismiss();
});
await page.click('button');
```

### Pattern 3: API Request with Response Validation

```typescript
const responsePromise = page.waitForResponse('**/api/auth/login');
await loginPage.login('user@example.com', 'password');
const response = await responsePromise;
expect(response.status()).toBe(200);
```

### Pattern 4: Test Steps

```typescript
test('Complex flow', async ({ page }) => {
  await test.step('Navigate to login', async () => {
    await loginPage.visitLoginPage();
  });
  
  await test.step('Enter credentials', async () => {
    await loginPage.login('user@example.com', 'password');
  });
  
  await test.step('Verify dashboard', async () => {
    await expect(page).toHaveURL('**/dashboard');
  });
});
```

---

## 11. Performance Considerations

### Parallel Execution

```typescript
// Tests run in parallel (faster)
fullyParallel: true
workers: undefined  // Use default (number of CPU cores)
```

### Reducing Test Time

1. **Use API setup** instead of UI registration:
   ```typescript
   // Fast: Create user via API
   const { email } = await BackendUtils.registerUser(request, ...);
   
   // Slow: Register via UI
   await registerPage.visitRegisterPage();
   await registerPage.register(...);
   ```

2. **Reuse sessions** where possible:
   ```typescript
   test.describe.serial('Sequential tests', () => {
     // These tests share the same browser context
   });
   ```

---

## Summary

This architecture provides:

✅ **Maintainability** — Easy to update and debug  
✅ **Scalability** — Simple to add new tests  
✅ **Reliability** — Test isolation prevents flakiness  
✅ **Performance** — Parallel execution, API optimization  
✅ **Readability** — Clear test code with POM  
✅ **Type Safety** — TypeScript catches errors early  

---

**Next Steps:**
- Read [SETUP.md](./SETUP.md) for environment setup
- Read [TESTING.md](./TESTING.md) for testing strategies
- Check individual page object files for detailed API documentation
